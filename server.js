var schedule = require('node-schedule');
var http = require('http');
var qs = require('querystring');
var url = require('url');
var install = require('./installation.js');
var maintainance = require('./maintain.js');
var time = require('./time.js');
var axios = require('axios');
var Botkit = require('botkit');
var request123 = require('request');
var https = require('https')
var app_install = [];



// run everyday at midnight
schedule.scheduleJob('0 0 * * *', () => {
  
  //check if new year
  if(time.newYear()){
      //send slack msgs
      maintainance.zeroYearly();
  }else if(time.newMonth()){
      //send slack msgs
      maintainance.zeroMonthly();
  }else if(time.newWeek()){
     //send slack msgs
     maintainance.zeroWeekly();
  }

}) 

//for all HTTP calls
http.createServer(handleRequest).listen(3000)
function handleRequest (request, response) {
  
  var options = { method: 'POST',
  url: 'https://hooks.slack.com/services/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',
  headers: 
   { 'cache-control': 'no-cache',
     'content-type': 'application/json' },
  body: { text: 'tari ben ne chode' },
  json: true };

request123(options, function (error, response123, body) {
  if (error) throw new Error(error);

  console.log(body);
});
  
  if(request.method === 'GET'){
    
    let adr = request.url;
    let q = url.parse(adr, true);
    let qdata = q.query; 
    if(qdata.code && app_install.length >= 1){
        install.installation(qdata.code, app_install);
        app_install = [];
    }
    
  }

  if (request.method === 'POST') {
  
        let payload = '';

        request.on('data', (data) => payload += data );
        request.on('end', () => {
        
        //change payload to json
        payload = JSON.parse(payload)
        
        //console.log("The post payload is: ");
        //console.log(payload);
      
        //check if POST is for Issue opened (new one)
        if(payload.action === 'opened' && payload.issue){
            maintainance.checkUserRepoConnection(payload.issue.user.id, payload.repository.id, payload.issue.user.login, payload.issue.user.html_url);
            //add point to user
        }
      
        //check if POST is for Issue closed (not deleted, but completed)
        else if(payload.action === 'closed' && payload.issue){
            maintainance.checkUserRepoConnection(payload.issue.user.id, payload.repository.id, payload.issue.user.login, payload.issue.user.html_url);
            //add point to user
        }
      
        //check if POST is for comment in Issue
        else if(payload.action === 'created' && payload.issue){
            maintainance.checkUserRepoConnection(payload.issue.user.id, payload.repository.id, payload.issue.user.login, payload.issue.user.html_url);
            //DONT add points to the user
        }
        
        //check if POST is for PULL Request submitted (MAYBE)  
        else if(payload.action === 'submitted' && payload.review && payload.pull_request){
            maintainance.checkUserRepoConnection(payload.issue.user.id, payload.repository.id, payload.issue.user.login, payload.issue.user.html_url);
            //add point to user
        }
          
        //check if POST is for Push  
        else if(payload.ref && payload.head_commit && payload.repository){
            maintainance.checkUserRepoConnection(payload.issue.user.id, payload.repository.id, payload.issue.user.login, payload.issue.user.html_url);
            //add point to user
        }
      
        //check if POST is for Git App Install
        else if(payload.action === 'created' && payload.installation){
            payload.repositories.forEach(function(x){
                if(app_install.indexOf(x.id) === -1){
                    app_install.push(x.id);
                }
            });
        }
      
        //check if POST is to delete the GIT App 
        //else if(payload.action === 'deleted' && payload.installation)
        
      })
  }
   
}