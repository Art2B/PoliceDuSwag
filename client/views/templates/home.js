Template.home.onRendered(function(){
  console.log('Home template rendered');
  Session.set('formMessage', '');
});

Template.home.helpers({
  formMessage: function(){
    return Session.get('formMessage');
  }
});

Template.home.events({
  'submit .swag-form': function(event){
    var url = event.target.url.value;
    // Check valid twitter url
    var twitterUrlRegex = /https:\/\/twitter\.com\/\w+\/status\/\d+/;
    var isUrlValid = twitterUrlRegex.test(url);

    // Send Police du Swag
    if(isUrlValid){
      // send police du swag
      Meteor.call('sendSwagPolice', url);
    } else {
      Session.set('formMessage', 'Your url is invalid');
    }
    // Prevent form from submit
    return false;
  }
});