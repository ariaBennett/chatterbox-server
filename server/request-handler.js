var assert = require('assert');
messages = [];
messageNumber = 0;
/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

exports.handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  //console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode = 200;

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;
  //console.log(defaultCorsHeaders);

  headers['Content-Type'] = "text/plain";

  /* .writeHead() tells our server what HTTP status code to send back */
  response.writeHead(statusCode, headers);

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
  if (request.url === "/classes/chatterbox/makepost/") {
    request.setEncoding('utf8');
    request.on('data', function(chunk) {
      assert.equal(typeof chunk, 'string');
      var message = JSON.parse(chunk);
      message.recieved = Date.now();
      message.id = messageNumber;
      messageNumber++;
      messages.push(message);
      console.log(messages);
    })
    response.end("Message recieved by server.");
  }
  else if (request.url === "/classes/chatterbox/requestposts/") {
    request.setEncoding('utf8');
    request.on('data', function(chunk){
      assert.equal(typeof chunk, 'string');
      var message = JSON.parse(chunk);
      console.log("recieving: " + message);
    });
    response.end(JSON.stringify({message: "test", user: "test", room: "test"}));
  }
  else {
    response.end("Hello, World!");
  }
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "x-parse-application-id, x-parse-rest-api-key, origin, content-type, accept, x-requested-with",
  "access-control-max-age": 10 // Seconds.
};
