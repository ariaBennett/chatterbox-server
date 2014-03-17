// Globals
window.currentRoom = 'all';

// Ajax request for 100 messages to list recently used rooms
var getRooms = {
  url: 'https://api.parse.com/1/classes/chatterbox/',
  type: 'GET',
  contentType: 'application/json',
  data: {
    order: '-createdAt',
    limit: 100
  },
  success: function (data) {
    var results = {};
    _.each(data.results, function(item) {
      _.each(item, function(item, key) {
        if (key === 'roomname') {
          results[item] = true;
        }
      });
    });
    results = Object.keys(results);
    var rooms = {}; // Message obj for display()
    rooms.text = results.join(', ');
    rooms.username = 'CLIENT -';
    rooms.createdAt = '';
    display(rooms);
  },
  error: function (data) {
    console.error('chatterbox: No response from server');
  }
};

// Parses slash commands and args
var parseCommand = function(message) {
  var space = message.text.indexOf(' ');
  var command = message.text.slice(1, space);
  var args;
  if (space !== -1) {
    args = message.text.slice(space + 1);
  } else {
    command = message.text.slice(1);
  }

  // Join room
  if (command === 'join') {
    if (args === undefined) {
      args = 'all';
    }
    joinRoom(args);
  }

  // List rooms
  else if (command === 'rooms') {
    $.ajax(getRooms);
  }

  // Leave room
  else if ((command === 'exit') || (command === 'leave')) {
    if (currentRoom === 'all') {
      display({username: 'CLIENT -', text: 'Already in ' + window.currentRoom, createdAt: ''});
      return;
    }
    joinRoom('all');
  }

  // Mute/unmute user
  else if (command === 'mute') {
    if (args) {
      if (people[args].muted) {
        people[args].muted = false;
        console.log(args + ' unmuted');
      } else {
        people[args].muted = true;
        console.log(args + ' muted');
      }
    }
  }

  // Sends message as fixed size lines, for science
  else if(command === 'fixed') {
    space = args.indexOf(' ');
    var lineSize = parseInt(args.slice(0, space));
    var args = args.slice(space + 1);

    var slicedMessage = [];
    var sliceLine = function(text) {
      if (text.length >= lineSize) {
        slicedMessage.push(text.slice(0, lineSize));
        text = text.slice(lineSize);

        sliceLine(text);
      }
      else {
        if (text.length > 0) {
          slicedMessage.push(text);
        }
      }
    };
    sliceLine(args);
  }
  _.each(slicedMessage, function(line) {
    var message = {};
    message.username = document.URL.slice(document.URL.indexOf('=') + 1);
    message.text = line;
    $.ajax(makePost(message));
  });
};

// Filters messages to specified room only
var joinRoom = function(roomName) {
  window.currentRoom = roomName;
  if (window.currentRoom !== 'all') {
    $('.message').each(function(m, thing){
      if (thing.roomname !== window.currentRoom) {
        thing.style.display = 'none';
      }
    });
  }
  else {
    $('.message').each(function(m, thing){
      thing.style.display = 'block';
    });
  }
  display({username: 'CLIENT -', text: 'Joined room ' + window.currentRoom, createdAt: ''});
};
