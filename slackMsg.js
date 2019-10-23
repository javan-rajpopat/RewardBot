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


module.exports = {
  msgSlack
}