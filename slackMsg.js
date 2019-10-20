//   var options = { method: 'POST',
//   url: 'https://hooks.slack.com/services/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',
//   headers: 
//    { 'cache-control': 'no-cache',
//      'content-type': 'application/json' },
//   body: { text: 'tari ben ne chode' },
//   json: true };

// request123(options, function (error, response123, body) {
//   if (error) throw new Error(error);

//   console.log(body);
// });

var request123 = require('request');

function msgSlack(body, url){
  
  var options = { method: 'POST',
  url: url,
  headers: 
   { 'cache-control': 'no-cache',
     'content-type': 'application/json' },
  body: body,
  json: true };
  
  request123(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
    });
  
}