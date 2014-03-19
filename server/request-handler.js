var assert = require('assert');
messages = [];
messageNumber = 0; // First message starts at 1, 0 should not be a message.

exports.handleRequest = function(request, response) {

  var statusCode = 200;

  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";

  response.writeHead(statusCode, headers);

  if (request.url === "/classes/chatterbox/makepost/") {
    request.setEncoding('utf8');
    request.on('data', function(chunk) {
      assert.equal(typeof chunk, 'string');
      var message = JSON.parse(chunk);
      message.recieved = Date.now();
      messageNumber++;
      message.id = messageNumber;
      messages.push(message);
      console.log(messages);
    });
    response.end("Message recieved by server.");
  }
  else if (request.url === "/classes/chatterbox/requestposts/") {
    var newMessages = {};
    request.setEncoding('utf8');
    
    request.on('data', function(chunk){
      assert.equal(typeof chunk, 'string');
      var lastMessageRecieved = JSON.parse(chunk);
      console.log("Last Message Client Recieved: " + lastMessageRecieved);
      if (messageNumber !== 0 && ((lastMessageRecieved < messageNumber) && lastMessageRecieved > -1)) {
        console.log(lastMessageRecieved, messageNumber);
        newMessages['results'] = messages.slice(lastMessageRecieved);
        console.log(newMessages.results);
      }
    });
    request.on('end', function(){
      response.end(JSON.stringify(newMessages));
    });
    
  }
  else {
    response.end("Hello, World!");
  }
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "x-parse-application-id, x-parse-rest-api-key, origin, content-type, accept, x-requested-with",
  "access-control-max-age": 10 // Seconds.
};
