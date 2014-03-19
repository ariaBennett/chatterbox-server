/* global $ */

// List of users object
var people = {};

// Add local user to people object
var local = document.URL.slice(document.URL.indexOf('=') + 1);
people[local] = {};
people[local].group = 'local';

// Checks if a user has a group
var groupCheck = function(user) {
  if (people[user]) {
    return people[user].group;
  }
  else {
    console.log('THAT GUY DON\'T EXIST YO\'');
  }
};

// Collects the username spans to attach attributes
var getUsernameSpans = function(userName) {
  return $('.username').filter(function(huh, elem) {
    if ($(elem).text() === userName) {
      return true;
    }
    else {
      return false;
    }
  });
};

// Sets attributes
$('#container').on('click', '.username', function() {
  var user = $(this).text();
  var group = groupCheck(user);
  var $usernameSpans = getUsernameSpans(user);
  if (group === null) {
    people[user].group = 'friend';
    $usernameSpans.attr('group', 'friend');
  }
  else if (group === 'friend') {
    people[user].group = 'frenemy';
    $usernameSpans.attr('group', 'frenemy');
  }
  else if (group === 'frenemy') {
    people[user].group = 'enemy';
    $usernameSpans.attr('group', 'SILENCE');
  }
  else if (group === 'enemy') {
    people[user].group = null;
    $usernameSpans.attr('group', 'null');
  }
});
