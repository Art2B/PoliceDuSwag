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
      Meteor.call('sendSwagPolice', url, function(err, result){
        if(err){
          Session.set('formMessage', 'La Police du Swag a des problèmes plus important à règler pour le moment. Merci de réessayer plus tard.');
        } else {
          Session.set('formMessage', 'La Police du Swag est en cours d\'intervention');
        }
      });
    } else {
      Session.set('formMessage', 'Ceci n\'est pas une adresse où la Police du Swag peut intervenir');
    }

    // Prevent form from submit
    return false;
  }
});