var querystring = require('querystring');
var https = require('https');
var fs = require('fs');

var data = require("./data");

var getData = function(verifyTokenResponse) {
  parsedResponse = JSON.parse(verifyTokenResponse);
  var url = data.databaseUrl + data.databasePath + ".json?auth=" + parsedResponse.idToken;
  console.log('curl "' + url + '"');
};

var generateIdToken = function() {
    var verifyTokenPath = '/identitytoolkit/v3/relyingparty/verifyPassword?key=' + data.apiKey;
    var post_data = querystring.stringify(
      {
        "email": data.email,
        "password": data.password,
        "returnSecureToken":true,
      }
    );
    var post_options = {
      host: 'www.googleapis.com',
      port: '443',
      path: verifyTokenPath,
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
      }
    };  
    var verifyTokenResponse = '';  
    var post_req = https.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        verifyTokenResponse += chunk;
      });
      res.on('end', function () {
         getData(verifyTokenResponse);
      });      
    });
    // post the data
    post_req.write(post_data);
    post_req.end();    
};

generateIdToken();
