var Twit = Meteor.npmRequire('twit');
var T = {};

Meteor.startup(function () {
  console.log('Started meteor server');
  T = new Twit({
      consumer_key: Meteor.settings.twit.consumer_key
    , consumer_secret: Meteor.settings.twit.consumer_secret
    , access_token: Meteor.settings.twit.access_token
    , access_token_secret: Meteor.settings.twit.access_token_secret
  });

  // Meteor.call('sendSwagPolice', 'https://twitter.com/abattut/status/615227218898370560');
});

Meteor.methods({
  sendSwagPolice: function(url){
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
        console.log('c good');
        T.post('/statuses/update',
          {status: message, in_reply_to_status_id: data.id_str},
          function(err, data, response){
            console.log('tweet send');
          }
        )
      } else {
        // Need to return error
      }
    });
  }
});