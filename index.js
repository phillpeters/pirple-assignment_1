/*
 * Homework Assignment #1 - "Hello World" API
 *
 */

 // Dependencies
 const http = require('http');
 const url = require('url');
 const StringDecoder = require('string_decoder').StringDecoder;

// Instantiate server
 const server = http.createServer(function(req, res) {

    // Get the URL and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the HTTP method
    var method = req.method.toLowerCase();

    // Get the headers as an oject
    var headers = req.headers;

    // Get the payload if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data) {
        buffer += decoder.write(data);
    });

    req.on('end', function(data) {
        buffer += decoder.end();

        // Choose the handler this request should go to.  If one is not found, use the notFound handler
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' :  method,
            'headers' : headers,
            'payload' : buffer
        }

        // Route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload) {
            // Use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Use the payload called back by the handler, or default to an empty string
            payload = typeof(payload) == 'string' ? payload : {};

            // Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request path
            console.log('Returning this response: ', statusCode, payloadString);
        });
    });
});

// Start the server
server.listen(4005, function() {
    console.log('The server is listening on port ', 4005);
});

// Define the handlers
const handlers = {};

// hello handler
handlers.hello = function(data, callback) {
    callback(200, "Hello! Welcome to my first API!");
};

// notFound handler
handlers.notFound = function(data, callback) {
    callback(404);
};

// Define a request router
const router = {
    'hello' : handlers.hello
};