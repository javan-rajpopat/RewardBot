var slack = []
var user = []
var user_search = {}
var repos_slack = {}
var repo_user = {}

var User = require('./User.js');
    
  function addToSlackArray(newSlack){
      slack.push(newSlack);
      return slack.length-1;
  }

  function zeroYearly(){
      user.forEach(function(u){
        u.points_yearly = 0;
      });
  }

  function zeroMonthly(){
      user.forEach(function(u){
        u.points_monthly = 0;
      });
  }

  function zeroWeekly(){
      user.forEach(function(u){
        u.points_weekly = 0;
      });
  }


  function addToUserArray(newUser){
      user.push(newUser);
      return user.length-1;
  }

  function checkUserInUserSearch(userID, repoID){
      if ([userID, repoID] in user_search){
        console.log("User already present");
        return true;
      }
      return false;
  }

  function userInUserArray(userID){
      user.forEach(function(u){
        if(u.id === userID){
          return true;
        }
      });
      return false;
  }

  function userIndexInUserArray(userID){
      for(var i = 0; i < user.length; i+=1){
          if (user[i].id === userID){
              return i;
          }
      }
      return -1;
  }

  function addToUserSearchDict(userID, repoID, index){
      user_search[[userID, repoID]] = index;
  }

  function addToReposSlackDict(repoID, index){
      if (repoID in repos_slack){
        console.log("The app is already installed in the repo, and messages are send to slack: ");
        console.log(slack[repos_slack[repoID]].channel);
      }else{
        repos_slack[repoID] = index;
      }
  }

  function addToRepoUserDict(repoID, userID){
    if(repoID in repo_user){
        if(repo_user[repoID].indexOf(userID) === -1){
            repo_user[repoID].puhs(userID);
        }
    }else{
        repo_user[repoID] = []
        repo_user[repoID].push(userID);
    }
  }

  function checkStreak(userID, repoID){
      user[user_search[[userID, repoID]]].checkGitStreak();
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
        console.log("Slack array is: ");
        console.log(slack);
        console.log("User array is: ");
        console.log(user);
        console.log("User Search dictinory is: ");
        console.log(user_search);
        console.log("Repos Slack dictniory is: ");
        console.log(repos_slack);
        console.log("Repos User dictniory is: ");
        console.log(repo_user);
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
  checkStreak
};
  