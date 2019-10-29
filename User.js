var time = require('./time.js');


module.exports = class User {
  constructor(id, login, html_url, repoID){
    this.id = id;
    this.login = login;
    this.html_url = html_url;
    this.repoID = repoID;
    
    //function to remove time
    Date.prototype.withoutTime = function () {
      var d = new Date(this);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    var date = new Date();  //todays date
    
    this.joinDate = date.withoutTime();
    this.lastActive = date.withoutTime();
    this.gitStreak = 1;
    
    this.badge_BugFixer = 0;
    this.badge_Committer = 0;
    this.badge_TopContribitor = 0;    
    this.badge_TheUnstoppable = 0;
    
    this.point_bugsFixed = 0;
    this.points_push = 0;
    this.points_pullRequest = 0;
    this.points_issueOpen = 0;
    this.points_issueClose = 0;
    
    this.points_weekly = 0;
    this.points_monthly = 0;
    this.points_yearly = 0;
    this.total_points = 0;
    
    //add badges
  }
  
  checkGitStreak(){
      if(time.isItOneDay(this.lastActive)){
        this.gitStreak += 1;
      }else{
        this.gitStreak = 1;
      }
    
      //function to remove time
      Date.prototype.withoutTime = function () {
        var d = new Date(this);
        d.setHours(0, 0, 0, 0);
        return d;
      }
      var date = new Date();  //todays date
    
      this.lastActive = date.withoutTime();
  }
  
  checkGitAnniversary(){
    
     var one_day = 1000 * 60 * 60 * 24;
     // To Calculate the result in milliseconds and then converting into days 
     var Result = Math.round(this.lastActive.getTime() - this.joinDate.getTime()) / (one_day); 
     // To remove the decimals from the (Result) resulting days value 
     var Final_Result = Result.toFixed(0);
     
     //return true;
    if(Final_Result==7)
      return "Weekly";
    if(Final_Result==365)
      return "Yearly";
    if(Final_Result==30)
      return "Monthly";
    
  }
  
  
}