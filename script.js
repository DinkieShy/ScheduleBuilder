var mon;
var tue;
var wed;
var thu;
var fri;
var sat;
var sun;
var maxID = 0;

var dragItemTemplate = `<div class="dragItem"><input class="newEventText" name="newEventText" wrap="soft" style="overflow:hidden; resize:none;" type="text" rows="20" cols="50"></input>
<div class="timeInput"><label style="float: left" for="startTime">Start time:</label><input style="float: right" name="startTime" type="time" placeholder="09:00"></input></div>
<div class="timeInput"><label style="float: left" for="endTime">End time:</label><input style="float: right" name="endTime" type="time" placeholder="09:00"></input></div>
</div>`;

function ScheduledEvent(desc, start, end, id){
  this.desc = desc;
  this.start = start;
  this.end = end;
  this.id = id;
}

function displayEvents(){
  var days = [["mon", mon], ["tue", tue], ["wed", wed], ["thu", thu], ["fri", fri], ["sat", sat], ["sun", sun]];
  for(var i = 0; i < days.length; i++){
    days[i][1].sort(compareTimes);
    //$(`#${days[i][0]}`)[0].innerHTML = `<h1 class="dayTitle">${days[i][0].toUpperCase()}</h1>`;
    $(`#${days[i][0]}`)[0].innerHTML = "";
    for(var ii = 0; ii < days[i][1].length; ii++){
      var droppedItemHTML = `<div id="event${days[i][1][ii].id}" class="droppedItem">
      <p class="title">${days[i][1][ii].desc}</p>`
      if(days[i][1][ii].start != "" && days[i][1][ii] != undefined){
        if(days[i][1][ii].end != "" && days[i][1][ii].end != undefined){
          droppedItemHTML += `<p class="time">${days[i][1][ii].start} - ${days[i][1][ii].end}</p>`;
        }
        else{
          droppedItemHTML += `<p class="time">${days[i][1][ii].start}</p>`;
        }
      }
      droppedItemHTML += `</div><button  id="removeEvent${days[i][1][ii].id}" class="removeEventButton" onclick="removeEvent(event)">x</button>`;
      $(`#${days[i][0]}`)[0].innerHTML += droppedItemHTML;
    }
  }
}

function compareTimes(timeA, timeB){
  hoursMinsA = timeA.start.split(':');
  hoursMinsB = timeB.start.split(':');
  if(hoursMinsA[0] < hoursMinsB[0]){
    return -1;
  }
  else if(hoursMinsA[0] == hoursMinsB[0]){
    if(hoursMinsA[1] < hoursMinsB[1]){
      return -1;
    }
    else{
      return 1;
    }
  }
  else{
    return 1;
  }
}

function addEvent(day, desc, start, end){
  switch(day){
    case "mon":
      mon.push(new ScheduledEvent(desc, start, end, maxID));
    break;
    case "tue":
      tue.push(new ScheduledEvent(desc, start, end, maxID));
    break;
    case "wed":
      wed.push(new ScheduledEvent(desc, start, end, maxID));
    break;
    case "thu":
      thu.push(new ScheduledEvent(desc, start, end, maxID));
    break;
    case "fri":
      fri.push(new ScheduledEvent(desc, start, end, maxID));
    break;
    case "sat":
      sat.push(new ScheduledEvent(desc, start, end, maxID));
    break;
    case "sun":
      sun.push(new ScheduledEvent(desc, start, end, maxID));
    break;
  }
  maxID += 1;
  save();
}

function removeEvent(event){
  var idToRemove = event.target.id.slice(11);
  var days = [["mon", mon], ["tue", tue], ["wed", wed], ["thu", thu], ["fri", fri], ["sat", sat], ["sun", sun]];
  for(var i = 0; i < days.length; i++){
    for(var ii = 0; ii < days[i][1].length; ii++){
      if(days[i][1][ii].id == idToRemove){
        days[i][1].splice(ii, 1);
        save();
        displayEvents();
      }
    }
  }

}

$(document).ready(function(){
  load();
  var days = [["mon", mon], ["tue", tue], ["wed", wed], ["thu", thu], ["fri", fri], ["sat", sat], ["sun", sun]];
  for(var i = 0; i < days.length; i++){
    for(var ii = 0; ii < days[i][1].length; ii++){
      if(days[i][1][ii].id > maxID){
        maxID = days[i][1][ii].id + 1;
      }
    }
  }
  $('.dayArea').droppable({
    tolerance: "pointer",
    drop: function(event, ui){
      ui.draggable.css({
        revert: 'invalid'
      });
      var text = $(ui.draggable[0].firstChild).val();
      var start = $(ui.draggable[0].children[1].lastChild).val();
      var end = $(ui.draggable[0].children[2].lastChild).val();
      console.log($(ui.draggable[0].children));
      console.log(text);
      if(text.trim() != ""){
        ui.draggable.draggable('disable');
        ui.draggable.removeClass("dragItem");
        ui.draggable.addClass("droppedItem");
        ui.draggable[0].innerHTML = `<p class="title">${text}</p>`;
        ui.draggable[0].innerHTML += `<p class="time">${start} - ${end}</p>`;
        $(this).append(ui.draggable);
        addEvent($(this)[0].id, text, start, end);
        addDragItem();
        displayEvents();
      }
    }
  });
  addDragItem();
  displayEvents();
});

function addDragItem(id){
  $('#toolbar').append(parseHTML(dragItemTemplate));
  $(`.dragItem`).draggable({
    cursor: "move",
    revert: 'invalid',
    helper: 'clone',
    appendTo: 'body',
    scroll: false
  });
}

function parseHTML(str){
  var tmp = document.implementation.createHTMLDocument();
  tmp.body.innerHTML = str;
  return tmp.body.children;
}

function load(){
  var days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  var nullStoarage = false;
  if(localStorage){
    for(var i = 0; i < days.length; i++){
      if(localStorage.getItem(days[i]) == null){
        nullStoarage = true;
      }
    }
  }
  else{
    nullStoarage = true;
  }
  if(!nullStoarage){
    mon = JSON.parse(localStorage.getItem("mon"));
    tue = JSON.parse(localStorage.getItem("tue"));
    wed = JSON.parse(localStorage.getItem("wed"));
    thu = JSON.parse(localStorage.getItem("thu"));
    fri = JSON.parse(localStorage.getItem("fri"));
    sat = JSON.parse(localStorage.getItem("sat"));
    sun = JSON.parse(localStorage.getItem("sun"));
  }
  else{
    mon = [];
    tue = [];
    wed = [];
    thu = [];
    fri = [];
    sat = [];
    sun = [];
  }
}

function save(){
  var days = [["mon", mon], ["tue", tue], ["wed", wed], ["thu", thu], ["fri", fri], ["sat", sat], ["sun", sun]];
  for(var i = 0; i < days.length; i++){
    localStorage.setItem(days[i][0], JSON.stringify(days[i][1]));
  }
}

function inIframe(){
  try{
    return window.self !== window.top;
  }
  catch(e){
    return true;
  }
}

function reset(){
  window.location.reload();
}
