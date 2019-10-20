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


// var slackArray = require('data-store')({ path: process.cwd() + '/slackArray.json'})
// var userArray = require('data-store')({ path: process.cwd() + '/userArray.json'})
// var user_search = require('data-store')({ path: process.cwd() + '/userSearch.json'})
// var repos_slack = require('data-store')({ path: process.cwd() + '/reposSlack.json'})
// var repo_user = require('data-store')({ path: process.cwd() + '/reposUser.json'})
// var whoInstalledApp = require('data-store')({ path: process.cwd() + '/whoInstalledApp.json'})                               

var slackArray = []
var userArray = []
var user_search = {}
var repos_slack = {}
var repo_user = {}
var whoInstalledApp = {}

// run everyday at midnight
schedule.scheduleJob('54 * * * *', () => {
  
  
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
      
        //check if POST is for Issue opened (new one)
        if(request.headers['x-github-event'] === 'issues' && payload.action === 'opened'){
            maintainance.checkUserRepoConnection(payload.issue.user.id, payload.repository.id, payload.issue.user.login, payload.issue.user.html_url);
            //add point to user
            maintainance.installationCompleteCheck();
        }
      
         //check if POST is for Issue closed (not deleted, but completed)
        else if(request.headers['x-github-event'] === 'issues' && payload.action === 'closed'){
            maintainance.checkUserRepoConnection(payload.issue.user.id, payload.repository.id, payload.issue.user.login, payload.issue.user.html_url);
            //add point to user
        }
      
        //check if POST is for comment in Issue
        else if(request.headers['x-github-event'] === 'issue_comment' && payload.action === 'created'){
            maintainance.checkUserRepoConnection(payload.issue.user.id, payload.repository.id, payload.issue.user.login, payload.issue.user.html_url);
            //DONT add points to the user
        }
        
        //check if POST is for PULL Request submitted (MAYBE)  
        else if(request.headers['x-github-event'] === 'pull_request' && payload.action === 'opened'){
            maintainance.checkUserRepoConnection(payload.issue.user.id, payload.repository.id, payload.issue.user.login, payload.issue.user.html_url);
            //add point to user
        }
          
        
          
        //check if POST is for Push  
        else if(request.headers['x-github-event'] === 'push'){
            maintainance.checkUserRepoConnection(payload.issue.user.id, payload.repository.id, payload.issue.user.login, payload.issue.user.html_url);
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



module.exports = {
 slackArray,
 userArray,
 user_search,
 repos_slack,
 repo_user,
 whoInstalledApp 
};