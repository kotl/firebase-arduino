// Please run this first:
// npm install jsonwebtoken

var querystring = require('querystring');
var https = require('https');
var fs = require('fs');
var jwt = require('jsonwebtoken');

var data = require("./data");

var getData = function(verifyTokenResponse) {
  parsedResponse = JSON.parse(verifyTokenResponse);
  var url = data.databaseUrl + data.databasePath + ".json?auth=" + parsedResponse.idToken;
  console.log('curl "' + url + '"');
};

var validateToken = function(customToken) {
    var verifyTokenPath = '/identitytoolkit/v3/relyingparty/verifyCustomToken?key=' + data.apiKey;
    var post_data = querystring.stringify(
      {
        "token": customToken,
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

var cert = data.serviceJson.private_key;
var jwtData = {
  "uid": data.uid,
  "iat": new Date().getTime()/1000,
  "exp": new Date().getTime()/1000+3600,
  "aud": "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit",
  "iss": data.serviceJson.client_email,
  "sub": data.serviceJson.client_email,
};

var token = jwt.sign(jwtData, cert, { algorithm: 'RS256'});
validateToken(token);
