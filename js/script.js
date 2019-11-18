$('#other-title').hide(); //show this option only when user selects 'other' option
$(':input:visible:first').focus(); // focus the first field
$('#color').children().hide(); //hide the options
const selectTheme = document.createElement("OPTION"); //create a new option
$('#color').prepend(selectTheme)  //prepend it to the option list
selectTheme.innerText = "Please select a T-shirt theme" //ask the user to select a design first
selectTheme.selected = "selected" //set it to selected


//”T-Shirt Info” section
let themes = [
  {
    name: "js puns",
    colors: ["cornflowerblue", "darkslategrey", "gold"]
  },

  {
    name: "heart js",
    colors: ["tomato", "steelblue", "dimgrey"]
  }
]

$('#design').change(function(){
  $('#color').children().hide();  //hide all options again
  availableColors = [];
  let selectedDesign = $('#design').val(); //design the user chose
  $.each( themes, function( i, val ) { //check themes
    if(themes[i].name === selectedDesign) { //if the selection matches the theme name
      availableColors = themes[i].colors; //tell me which colors are available for that theme
    }
  })
  let availableOptions = []; //create a list of available options
  for (i=0; i < $('#color').children().length; i += 1 ) { //check all the options
    let option = $('#color').children()[i].value; //give me their values
    if (availableColors.indexOf(option) !== -1)  { //if the values are on the list of available colors
      $('#color').children()[i].style.display = "block" //display that option on the color selector dropdown
        availableOptions.push($('#color').children()[i]) //if there is a match add it to the availableOptions array
    }
  }
  try {
    availableOptions[0].selected = true; //set the first of the available options to selected
  } catch (err) { //if there is an error (Example: user selected Select Theme )
    $('#color').children()[0].selected = true; //set the selected for the first in the color options array
  }
});


//”Register for Activities” section
let fieldset_activities$ = $("body").find("fieldset.activities");
let activities = fieldset_activities$.find("label").children();
let events = [];

$.each( activities, function( i, val ) { //check activities
  let activity = {
    name: val.getAttribute("name"), //get name
    date: val.getAttribute("data-day-and-time"), //get date
    cost: val.getAttribute("data-cost"),  //get cost
    isConficting: false,
  }
  events.push(activity)
});

$.each( events, function( i, val ) { //check activities
  let regex = /(\w+)-T(\d{2}):(\d{2}):(\d{2})-T(\d{2}):(\d{2}):(\d{2})/;
  let date = String(val.date)
  let dayWeek = '$1' //get day of the week
  let startTime = '$2' //get starting hour
  let endTime = '$5' //get ending hour
  val.day = date.replace(regex, dayWeek)
  val.startTime = parseInt(date.replace(regex, startTime))
  val.endTime = parseInt(date.replace(regex, endTime))
});

console.log(events)
