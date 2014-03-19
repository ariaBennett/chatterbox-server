/* global $ */
window.lastMessageRecieved = 0;
window.messages = [];
window.currentRoom = 'all';

// Creates DOM elements and displays message
var display = function(obj) {
  $('#container').append('<div class="message"></div>');
  $('.message:last').append('<span class="date"></span>');
  var date = obj.createdAt;
  var startSlice = date.indexOf(':') + 1;
  var date = date.slice(startSlice);
  var endSlice = date.indexOf('M') + 1;
  var formattedDate = date.slice(0, endSlice);
  $('.date:last').text(formattedDate + ' - ');
  $('.message:last').append('<span class="username"></span>');
  $('.username:last').text(obj.username);
  $('.message:last').append('<span class="content"></span>');
  $('.content:last').text(obj.text);
  $('.message:last')[0].setAttribute("room", obj.roomname);
  $('.username:last')[0].setAttribute("group", groupCheck(obj.username));
};

// Checks room before displaying, also ignores muted users
var roomCheckAndDisplay = function(obj) {
  if (window.people[obj.username] === undefined) {
    window.people[obj.username] = {};
    window.people[obj.username].group = null;
  }
  if (people[obj.username].muted === true) return;
  if (window.currentRoom !== 'all') {
    if (obj.roomname === window.currentRoom) {
      display(obj);
      $('#container')[0].scrollTop = $('#container')[0].scrollHeight;
    }
  }
  else {
    display(obj);
    $('#container')[0].scrollTop = $('#container')[0].scrollHeight;
  }
};

// Display most recent message, ignore duplicates and undefined users/messages
var displayNewMessages = function(messages) {
  for (var i = 0; i < messages.length; i++) {
    roomCheckAndDisplay(messages[i]);
  }
};

// Create POST data
var makePost = function(url, type, data, success, fail) {
  return {
    url: 'http://127.0.0.1:3000/classes/' + url,
    type: type, 
    data: JSON.stringify(data),
    contentType: 'jsonp',
    success: success,
    error: fail
  };
};

// Assembles and sends message object
var createMessage = function() {
  var currentTime = new Date(Date.now());
  currentTime = currentTime.toLocaleString();
  console.log(currentTime);
  var message = {
    'username': document.URL.slice(document.URL.indexOf("=") + 1),
    'text': $('.wordbox').val(),
    'roomname': window.currentRoom,
    'createdAt': currentTime
  };
  $('.wordbox').val(''); // Clears input box

  if (message.text[0] === '/') {
    parseCommand(message);
  }
  else {
    $.ajax(makePost(
      "chatterbox/makepost/", 
      "POST", 
      message, 
      function () {
        console.log('chatterbox: Message sent');
      },
      function () {
        console.error('chatterbox: Failed to send message');
      }
    ));
  }
};

// Click and enter event handlers
$('.messaginator2000').on('click', createMessage);
$('.wordbox').on('keydown', function(e) {
  if (e.keyCode === 13) {
    createMessage();
  }
});

var requestMessages = function() {
  $.ajax(makePost(
    "chatterbox/requestposts/", 
    "POST", 
    window.lastMessageRecieved, 
    function (data) {
      data = JSON.parse(data);
      var newMessages = data.results;
      if (newMessages !== undefined) {
        var resultsLength = newMessages.length;

        var lastMessageId = newMessages[(resultsLength - 1)].id;

        window.messages = window.messages.concat(newMessages);
        window.lastMessageRecieved = lastMessageId;

        displayNewMessages(newMessages);

        console.log('chatterbox: New Messages retrieved');
      }
    },
    function () {
      console.error('chatterbox: No response from server');
    }
  ));
}

var listenForMessages = function() {
  setTimeout(function(){
    requestMessages();
    listenForMessages();
  }, 500);
}
listenForMessages();
