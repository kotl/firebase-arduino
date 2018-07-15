// Please run this first:
// npm install firebase-admin --save

var querystring = require('querystring');
const https = require('https');
var fs = require('fs');
var admin = require("firebase-admin");

var data = require("./data");

var app = admin.initializeApp({
  credential: admin.credential.cert(data.serviceJson),
  databaseURL: data.databaseURL,
});

var auth = app.auth();

var getData = function(verifyTokenResponse) {
  parsedResponse = JSON.parse(verifyTokenResponse);
  var url = data.databaseUrl + data.databasePath + ".json?auth=" + parsedResponse.idToken;
  console.log('curl "' + url + '"');
};

admin.auth().createCustomToken(data.uid)
  .then(function(customToken) {
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

  })
  .catch(function(error) {
    console.log("Error creating custom token:", error);
  });
