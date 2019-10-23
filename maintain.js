var User = require('./User.js');
var slackMsg = require('./slackMsg.js');

var slackArray = []
var userArray = []
var user_search = {}
var repos_slack = {}
var repo_user = {}
var whoInstalledApp = {}

  function sendYearlySlackMsg(){
      //console.log("In maintan");
      //console.log(repos_slack);
      for (const [key, value] of Object.entries(repos_slack)) {
          console.log(key, value);
          slackMsg.msgSlack(
            { text: 'This is the most recent Leaderboard based on your progress' }, slackArray[value].url);
      }
  }

  function addPointsToIssueOpen(userID, repoID){
      userArray[user_search[[userID, repoID]]].points_issueOpen += 1;
  }

  function addPointsToIssueClose(userID, repoID){
      userArray[user_search[[userID, repoID]]].points_issueClose += 1;
      this.checkForBadgeBugFixer(user_search[[userID, repoID]], repoID);
  }

  function addPointsToPush(userID, repoID){
      userArray[user_search[[userID, repoID]]].points_push += 3;
      this.checkForBadgeCommitter(user_search[[userID, repoID]], repoID);
  }

  function checkForBadgeBugFixer(index, repoID){
      if (userArray[index].points_issueClose%3 === 0){
          userArray[index].badge_BugFixer = Math.floor(userArray[index].points_issueClose/3);
          slackMsg.msgSlack({text: "Please congratulate User: " + userArray[index].login +  
                " on receiving Badge: BugFixer of Level: " + userArray[index].badge_BugFixer + "."}, slackArray[repos_slack[repoID]].url);
      }
  }

  function checkForBadgeCommitter(index, repoID){
      if (userArray[index].points_push%9 === 0){
          userArray[index].badge_Committer = Math.floor(userArray[index].points_push/9);
          slackMsg.msgSlack({text: "Please congratulate User: " + userArray[index].login + 
                "on receiving Badge: Committer of Level: " + userArray[index].badge_Committer + "."}, slackArray[repos_slack[repoID]].url);
      }
  }

  function issueClose(){
      slackMsg.msgSlack({text: 'Congratulate @lalimasharda on receiveing Bug Fixer Badge..'},slackArray[0].url);
  }

  function pushMade(){
      slackMsg.msgSlack({text: 'Here is the Leader Board:\n Name     Points\n lalima   1'},slackArray[0].url);
  }

  function alreadyMemberNewRepo(repoID, userID){
      repos_slack[repoID] = whoInstalledApp[userID];
  }

  function addToWhoInstalledApp(userID, slackIndex){
      if(whoInstalledApp[userID]){
        return whoInstalledApp[userID];
      }else{
        whoInstalledApp[userID] = slackIndex;
      }
    
    
      //this.installationCompleteCheck();
    
      slackMsg.msgSlack({text: 'Congratulations, You are starting to use reward bot'},slackArray[slackIndex].url);
  }
    
  function addToSlackArray(newSlack){
      slackArray.push(newSlack);
      return slackArray.length-1;
  }

  function zeroYearly(){
      userArray.forEach(function(u){
        u.points_yearly = 0;
      });
  }

  function zeroMonthly(){
      userArray.forEach(function(u){
        u.points_monthly = 0;
      });
  }

  function zeroWeekly(){
      userArray.forEach(function(u){
        u.points_weekly = 0;
      });
  }


  function addToUserArray(newUser){
      userArray.push(newUser);
      return userArray.length-1;
  }

  function checkUserInUserSearch(userID, repoID){
      if ([userID, repoID] in user_search){
        console.log("User already present");
        return true;
      }
      return false;
  }

  function userInUserArray(userID){
      userArray.forEach(function(u){
        if(u.id === userID){
          return true;
        }
      });
      return false;
  }

  function userIndexInUserArray(userID){
      for(var i = 0; i < userArray.length; i+=1){
          if (userArray[i].id === userID){
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
        console.log(slackArray[repos_slack[repoID]].channel);
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
      userArray[user_search[[userID, repoID]]].checkGitStreak();
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
        console.log(slackArray);
        console.log("User array is: ");
        console.log(userArray);
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
  checkStreak,
  addToWhoInstalledApp,
  installationCompleteCheck,
  alreadyMemberNewRepo,
  sendYearlySlackMsg,
  issueClose,
  pushMade,
  addPointsToIssueOpen,
  addPointsToIssueClose,
  addPointsToPush,
  checkForBadgeBugFixer,
  checkForBadgeCommitter
};
  