var schedule = require('node-schedule');
var http = require('http');
var qs = require('querystring');
var url = require('url');
var install = require('./installation.js');
var maintainance = require('./maintain.js');
var time = require('./time.js');
var axios = require('axios');
var Botkit = require('botkit');
var https = require('https');
var mock = require('./mockGitData.js');
var app_install = [];
var user_app_install;
var fs = require('fs');                                


// run everyday at midnight
schedule.scheduleJob('30 * * * * *', () => {
  
  
  maintainance.sendYearlySlackMsg();
  maintainance.zeroYearly();
  
  
  //check if new year
  if(time.newYear()){
      
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
  
  
  //maintainance.installationCompleteCheck();
  
  if(request.method === 'GET'){
    
    let adr = request.url;
    let q = url.parse(adr, true);
    let qdata = q.query; 
    if(qdata.code && app_install.length >= 1 && user_app_install){
        install.installation(qdata.code, app_install, user_app_install);
        app_install = [];
        user_app_install = undefined;
    }
    
  }

  if (request.method === 'POST') {
  
        let payload = '';

        request.on('data', (data) => payload += data );
        request.on('end', () => {
        
        //change payload to json
        payload = JSON.parse(payload)
          
        //console.log(JSON.stringify(payload, null, 4));
      
        //check if POST is for Issue opened (new one)
        if(request.headers['x-github-event'] === 'issues' && payload.action === 'opened'){
            maintainance.checkUserRepoConnection(payload.issue.user.id, payload.repository.id, payload.issue.user.login, payload.issue.user.html_url);
            maintainance.addPointsToIssueOpen(payload.issue.user.id, payload.repository.id);
            //maintainance.installationCompleteCheck();
        }
      
         //check if POST is for Issue closed (not deleted, but completed)
        else if(request.headers['x-github-event'] === 'issues' && payload.action === 'closed'){
            maintainance.checkUserRepoConnection(payload.issue.user.id, payload.repository.id, payload.issue.user.login, payload.issue.user.html_url);
            //maintainance.issueClose();
            //add point to user
            maintainance.addPointsToIssueClose(payload.issue.user.id, payload.repository.id);
            //maintainance.installationCompleteCheck();
        }
      
        //check if POST is for comment in Issue
        else if(request.headers['x-github-event'] === 'issue_comment' && payload.action === 'created'){
            maintainance.checkUserRepoConnection(payload.issue.user.id, payload.repository.id, payload.issue.user.login, payload.issue.user.html_url);
            //DONT add points to the user
        }
        
        //check if POST is for PULL Request submitted (MAYBE)  
        // else if(request.headers['x-github-event'] === 'pull_request' && payload.action === 'opened'){
        //     maintainance.checkUserRepoConnection(payload.issue.user.id, payload.repository.id, payload.issue.user.login, payload.issue.user.html_url);
        //     //add point to user
        // }
          
        
          
        //check if POST is for Push  
        else if(request.headers['x-github-event'] === 'push'){
            maintainance.checkUserRepoConnection(payload.sender.id, payload.repository.id, payload.sender.login, payload.sender.html_url);
            maintainance.addPointsToPush(payload.sender.id,payload.repository.id);
            //maintainance.pushMade();
          //add point to user
        }
      
        //check if POST is for Git App Installs
        else if(request.headers['x-github-event'] === 'installation'){
            user_app_install = payload.installation.account.id;
            if(payload.repositories){
                payload.repositories.forEach(function(x){
                    if(app_install.indexOf(x.id) === -1){
                        app_install.push(x.id);
                    }
                });
            }
        }
          
        //check if POST is for Git Repo add to already excisting app
        else if(request.headers['x-github-event'] === 'installation_repositories'){
            payload.repositories_added.forEach(function(x){
                maintainance.alreadyMemberNewRepo(x.id, payload.installation.account.id);
            });
        }
      
        //check if POST is to delete the GIT App 
        //else if(payload.action === 'deleted' && payload.installation)
        
       })
   }
   
}
