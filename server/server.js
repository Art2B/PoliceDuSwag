var Twit = Meteor.npmRequire('twit');
var Future = Meteor.npmRequire('fibers/future');
var T = {};

Meteor.startup(function () {
  console.log('Started meteor server');
  T = new Twit({
      consumer_key: Meteor.settings.twit.consumer_key
    , consumer_secret: Meteor.settings.twit.consumer_secret
    , access_token: Meteor.settings.twit.access_token
    , access_token_secret: Meteor.settings.twit.access_token_secret
  });
});

Meteor.methods({
  sendSwagPolice: function(url){
    var fut = new Future();

    check(url, String);
    var tweetIdReg = /status\/(\d+)/;
    var tweetId = tweetIdReg.exec(url)[1];
    T.get('/statuses/show/:id', {id: tweetId}, function(err, data, response){
      // Get array of screen name to notify
      var screenNameReg = /(@+\w+)/g;
      var screenNameToReply = data.text.match(screenNameReg) || [];
      screenNameToReply.unshift('@'+data.user.screen_name);

      // Build message
      var message = '';
      screenNameToReply.forEach(function(val, index){
        message += val+" ";
      });
      message += ' #PoliceDuSwag ! Personne ne bouge !';
      if(message.length <= 140){
        T.post('/statuses/update',
          {status: message, in_reply_to_status_id: data.id_str},
          function(err, data, response){
            if(err){
              return fut.throw(new Meteor.Error('tweet-not-send', 'there hasn\'t been send'));
            }
            return fut.return({tweetSend: true});
          }
        )
      } else {
        // error here
        return fut.throw(new Meteor.Error('tweet-too-long', 'the tweet is too long'));
      }
    });
    fut.wait();
  }
});