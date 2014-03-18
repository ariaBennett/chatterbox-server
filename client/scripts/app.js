/* global $ */

// Creates DOM elements and displays message
var display = function(obj) {
  $('#container').append('<div class="message"></div>');
  $('.message:last').append('<span class="date"></span>');
  $('.date:last').text(obj.createdAt.slice(11, 16) + ' - ');
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
var displayLastMessage = function(list) {
  console.log(list);
  var print = false;
  var $last = $('.content:last').text();
  for (var i = list.length - 1; i >= 0; i--) {
    if (list[i].username === undefined || list[i].text === undefined) {
      list.splice(i, 1);
      continue;
    }
    if ($last !== list[i].text) {
      if (!print) {
        continue;
      }
      roomCheckAndDisplay(list[i]);
    } else {
      print = true;
    }
  }
  if (print === false) {
    for (var i = list.length - 1; i>= 0; i--) {
      roomCheckAndDisplay(list[i]);
    }
  }
};

// Create POST data
var makePost = function(message) {
  return {
    url: 'http://127.0.0.1:3000/classes/chatterbox/makepost/',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'jsonp',
    jsonpCallback: "_testcb",
    success: function () {
      console.log('chatterbox: Message sent');
    },
    error: function () {
      console.error('chatterbox: Failed to send message');
    }
  };
};

// GET data
var get = {
  url: 'http://127.0.0.1:3000/classes/chatterbox/',
  type: 'GET',
  contentType: 'jsonp',
  jsonpCallback: "_testcb",
  order: 'createdAt',
  limit: 5,
  success: function (data) {
    data = JSON.parse(data);
    console.log('chatterbox: Messages retrieved');
    displayLastMessage(data.results);
  },
  error: function () {
    console.error('chatterbox: No response from server');
  }
};

// Assembles and sends message object
var createMessage = function() {
  var message = {
    'username': document.URL.slice(document.URL.indexOf("=") + 1),
    'text': $('.wordbox').val(),
    'roomname': window.currentRoom
  };
  $('.wordbox').val(''); // Clears input box

  if (message.text[0] === '/') {
    parseCommand(message);
  }
  else {
    $.ajax(makePost(message));
  }
};

// Click and enter event handlers
$('.messaginator2000').on('click', createMessage);
$('.wordbox').on('keydown', function(e) {
  if (e.keyCode === 13) {
    createMessage();
  }
});

// Initial retrival
$.ajax(get);

/*
// Retrieve every 500 ms
setInterval(function() {
  $.ajax(get);
}, 1000);
*/
