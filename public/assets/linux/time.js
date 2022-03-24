app = {};
app.time = {}

app.time.dotw = {};
app.time.dotw["Sun"] = "Sunday";
app.time.dotw["Mon"] = "Monday";
app.time.dotw["Tues"] = "Tuesday";
app.time.dotw["Wed"] = "Wednesday";
app.time.dotw["Thurs"] = "Thursday";
app.time.dotw["Fri"] = "Friday";
app.time.dotw["Sat"] = "Staurday";

app.time.toDOTW = function(weekday) {
  return app.time.dotw[weekday];
}

app.time.serial = function(id) {
  var full = Date.apply(id);
  var datestring = full.split(" ");
  datestring[0] = app.time.toDOTW(full[0]);
  datestring = datestring.join(" ");
  var list = full.split(" ", 6);
  var tz = full.split(" ").splice(6).join(" ").split("(").join("").split(")").join("");
  list = list.concat(tz);
  var hms = list[4];
  hms = hms.split(":");
  hms = {hour: hms[0], min: hms[1], sec: hms[2]}
  return {
    datestring: datestring,
    original: full,
    datelist: list,
    timezone: tz,
    serial: Date.parse(full),
    hms: hms
  }
}

app.time.now = function() {
  return app.time.serial(Date.now());
}


app.time.relative = function(id) {
  var time = app.time.serial(id).datelist;
  var ctime = app.time.now().datelist;

  timestring = "";
  var hms = time[4];
  hms = hms.split(":");
  var hour = hms[0];
  var min = hms[1];
  var sec = hms[2];
  var ampm = "";
  if((Number(hour)-12)>0){hour=hour-12; ampm = "PM";} else {ampm = "AM"}
  hm = hour+":"+min+" "+ampm;

  if(time[3]==ctime[3]) {
    year = "This Year";
    if(time[1]==ctime[1]) {
      timestring = time[0]+", "+time[1]+" "+time[2];
      if(time[2]==ctime[2]) {
        timestring = "Today at "+hm;
        if((ctime[4][0]-hour)<5) {
          timestring = "A few hours ago";
          if((ctime[4][0]-hour)<1) {
            timestring = "Within the last hour";
            if((ctime[4][1]-min)<30) {
              timestring = "Within the last half hour";
              if((ctime[4][1]-min)<10) {
                timestring = "Within the last 10 minutes";
                if((ctime[4][1]-min)<5) {
                  timestring = "A few minutes ago";
                  if((ctime[4][2]-sec)<60) {
                    timestring = "A few seconds ago";
                    if((ctime[4][2]-sec)<30) {
                      timestring = "Just now";
                    }
                  }
                }
              }
            }
          }
        }
      } else if((day+1)==ctime[2]) {
        timestring = "Yesterday at "+hm;
      }
    } else {
      timestring = time[1]+" "+time[2]+" at "+hm;
    }
  } else {
    timestring = time[1]+" "+time[2]+", "+time[3]+" at "+hm;
  }

  return {
    toString: timestring,
    h: hour,
    min: min,
    sec: sec
  };
}