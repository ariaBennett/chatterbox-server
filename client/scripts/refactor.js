/* global $, app  */

window.app = {
  init: function() {
    app.server = 'https://api.parse.com/1/classes/chatterbox/';
    app.people = {};
    app.get = {
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      data: {
        order: '-createdAt',
        limit: 5
      },
      success: function (data) {
        console.log('chatterbox: Messages retrieved');
        displayLastMessage(data);
        if (app.people[data.results[0].username] === undefined) {
          app.people[data.results[0].username] = {};
          app.people[data.results[0].username].group = null;
        }
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: No response from server');
      }
    };
  },

  // Assembles and sends message object
  createMessage: function() {
    var message = {
      'username': document.URL.slice(document.URL.indexOf('=') + 1),
      'text': $('.wordbox').val(),
      'roomname': window.currentRoom
    };

    $('.wordbox').val('');

    if (message.text[0] === '/') {
      parseCommand(message);
    } else {
      send(message);
    }
  },

  send: function(message) {
    var post = {
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function () {
        console.log('chatterbox: Message sent');
      },
      error: function () {
        console.error('chatterbox: Failed to send message');
      }
    };
    $.ajax(post);
  },

  fetch: function() {
    $.ajax(app.get);
  }
};

app.init();
