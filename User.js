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
    
    this.point_bugsFixed = 0;
    this.points_push = 0;
    this.points_pullRequest = 0;
    
    this.points_weekly = 0;
    this.points_monthly = 0;
    this.points_yearly = 0;
    
    
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
  
  
}