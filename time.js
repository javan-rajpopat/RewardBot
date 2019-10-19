function isItOneDay(oldDate){
    
    //function to remove time
    Date.prototype.withoutTime = function () {
      var d = new Date(this);
      d.setHours(0, 0, 0, 0);
      return d;
    }
  
    //function to add a date
    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
    
    //todays date
    var date = new Date();
  
    //todays date without time
    date = date.withoutTime();
  
    oldDate = oldDate.addDays(1);
  
    if(oldDate.getTime() === date.getTime()){
        //return todays date and add 1 to the streak
        return true;
    }
  
    return false;
}

function newYear(){
  var d = new Date();
  if(d.getDate() === 1 && d.getMonth() === 0){
      return true; 
  }
  return false;
}

function newMonth(){
  var d = new Date();
  if(d.getDate() === 1){
      return true; 
  }
  return false;
}

function newWeek(){
  var d = new Date();
  if(d.getDay() === 1){
    return true;
  }
  return false;
}


module.exports = {
  isItOneDay,
  newMonth,
  newYear,
  newWeek
};