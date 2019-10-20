var main = require('./server.js')
var User = require('./User.js');
var slackMsg = require('./slackMsg.js');

  function sendYearlySlackMsg(){
      console.log("In maintan");
      console.log(main.repos_slack);
      for (const [key, value] of Object.entries(main.repos_slack)) {
          console.log(key, value);
          slackMsg.msgSlack(
            { text: 'Happy New Year' }, main.slackArray[value].url);
      }
  }

  function alreadyMemberNewRepo(repoID, userID){
      main.repos_slack[repoID] = main.whoInstalledApp[userID];
  }

  function addToWhoInstalledApp(userID, slackIndex){
      if(main.whoInstalledApp[userID]){
        return main.whoInstalledApp[userID];
      }else{
        main.whoInstalledApp[userID] = slackIndex;
      }
  }
    
  function addToSlackArray(newSlack){
      main.slackArray.push(newSlack);
      return main.slackArray.length-1;
  }

  function zeroYearly(){
      main.userArray.forEach(function(u){
        u.points_yearly = 0;
      });
  }

  function zeroMonthly(){
      main.userArray.forEach(function(u){
        u.points_monthly = 0;
      });
  }

  function zeroWeekly(){
      main.userArray.forEach(function(u){
        u.points_weekly = 0;
      });
  }


  function addToUserArray(newUser){
      main.userArray.push(newUser);
      return main.userArray.length-1;
  }

  function checkUserInUserSearch(userID, repoID){
      if ([userID, repoID] in main.user_search){
        console.log("User already present");
        return true;
      }
      return false;
  }

  function userInUserArray(userID){
      main.userArray.forEach(function(u){
        if(u.id === userID){
          return true;
        }
      });
      return false;
  }

  function userIndexInUserArray(userID){
      for(var i = 0; i < main.userArray.length; i+=1){
          if (main.userArray[i].id === userID){
              return i;
          }
      }
      return -1;
  }

  function addToUserSearchDict(userID, repoID, index){
      main.user_search[[userID, repoID]] = index;
  }

  function addToReposSlackDict(repoID, index){
      if (repoID in main.repos_slack){
        console.log("The app is already installed in the repo, and messages are send to slack: ");
        console.log(main.slackArray[main.repos_slack[repoID]].channel);
      }else{
        main.repos_slack[repoID] = index;
      }
  }

  function addToRepoUserDict(repoID, userID){
    if(repoID in main.repo_user){
        if(main.repo_user[repoID].indexOf(userID) === -1){
            main.repo_user[repoID].puhs(userID);
        }
    }else{
        main.repo_user[repoID] = []
        main.repo_user[repoID].push(userID);
    }
  }

  function checkStreak(userID, repoID){
      main.userArray[main.user_search[[userID, repoID]]].checkGitStreak();
  }

  function checkUserRepoConnection(userID, repoID, userLogin, userHtmlUrl){
        if(!this.checkUserInUserSearch(userID, repoID)){
              let index;
              let newUser = new User(userID, userLogin, userHtmlUrl, repoID);
              index = this.addToUserArray(newUser); 
              this.addToUserSearchDict(userID, repoID, index);
              this.addToRepoUserDict(repoID, userID);
        }
        this.checkStreak(userID, repoID);
  }

  function installationCompleteCheck(){
        console.log("Check for arrays and dictionaries");
        console.log("Slack array is: ");
        console.log(main.slackArray);
        console.log("User array is: ");
        console.log(main.userArray);
        console.log("User Search dictinory is: ");
        console.log(main.user_search);
        console.log("Repos Slack dictniory is: ");
        console.log(main.repos_slack);
        console.log("Repos User dictniory is: ");
        console.log(main.repo_user);
  }


module.exports = {
  addToSlackArray,
  checkUserRepoConnection,
  addToRepoUserDict,
  addToReposSlackDict,
  addToUserSearchDict,
  addToUserArray,
  userIndexInUserArray,
  checkUserInUserSearch,
  userInUserArray,
  zeroWeekly,
  zeroMonthly,
  zeroYearly,
  checkStreak,
  addToWhoInstalledApp,
  installationCompleteCheck,
  alreadyMemberNewRepo,
  sendYearlySlackMsg
};
  