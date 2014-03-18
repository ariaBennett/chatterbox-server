/* global $, app  */

window.app = {
  init: function() {
    app.server = 'http://127.0.0.1:3000/classes/chatterbox/';
    app.people = {};
    app.get = {
      url: 'http://127.0.0.1:3000/classes/chatterbox',
      type: 'GET',
      contentType: 'jsonp',
      jsonpCallback: "_testcb",
      order: 'createdAt',
      limit: 5,
      success: function (data) {
        data = JSON.parse(data);
        console.log('chatterbox: Messages retrieved');
        displayLastMessage(data.results);
        if (app.people[results.data[0].username] === undefined) {
          app.people[results.data[0].username] = {};
          app.people[results.data[0].username].group = null;
        }
      },
      error: function () {
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
