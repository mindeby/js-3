$('#other-title').hide(); //show this option only when user selects 'other' option
$(':input:visible:first').focus(); // focus the first field
$('#color').children().hide(); //hide the options
const selectTheme = document.createElement("OPTION"); //create a new option
$('#color').prepend(selectTheme)  //prepend it to the option list
selectTheme.innerText = "Please select a T-shirt theme" //ask the user to select a design first
selectTheme.selected = "selected" //set it to selected

$('#title').change(function(){
  $('#other-title').hide();
  if ($('#title')[0].value === 'other') {
    $('#other-title').show(); //show field to insert other job role when selected
  }
});

//Extra Credit - Hide the "Color" label and select menu until a T-Shirt design is selected from the "Design" menu.
$('#color').hide()
$('label[for="color"]').hide()

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
  $('#color').show() //show color options and label
  $('label[for="color"]').show()
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
const fieldset_activities$ = $("body").find("fieldset.activities");
const activities = fieldset_activities$.find("label").children();
let events = [];

$.each( activities, function( i, val ) { //check activities
  let activity = {
    name: val.getAttribute("name"), //get name
    date: val.getAttribute("data-day-and-time"), //get date
    cost: val.getAttribute("data-cost"),  //get cost
    isConflicting: false,
  }
  events.push(activity)
});

$.each( events, function( i, val ) { //check activities
  let regexDate = /(\w+)-T(\d{2}):(\d{2}):(\d{2})-T(\d{2}):(\d{2}):(\d{2})/;
  let regexCost = /(\$)(\d+)/;
  let date = String(val.date)
  let cost = String(val.cost)
  let costInt = '$2' //get number
  let dayWeek = '$1' //get day of the week
  let startTime = '$2' //get starting hour
  let endTime = '$5' //get ending hour
  val.day = date.replace(regexDate, dayWeek)
  val.startTime = parseInt(date.replace(regexDate, startTime))
  val.endTime = parseInt(date.replace(regexDate, endTime))
  val.cost = parseInt(cost.replace(regexCost, costInt))
});

function checkConflict(eventA,eventB) {
  if (eventA.day === eventB.day) { //if the activity is on the same day
    if (eventA.startTime >= eventB.startTime && eventA.startTime <= eventB.endTime  ) { //and starts at the same time
      eventB.isConflicting = true;
      eventA.conflict = eventB;
    }
  }
}

const billingBox = document.createElement("SPAN"); //create a new span to insert bill total
fieldset_activities$.append(billingBox)
let totalBill = 0;


$('input:checkbox').change(function(event){
  let checkedBox = $(this)[0].name; //get me the name attribute of the checkbox that was checked or unchecked
  if($(this).is(':checked')){
  $.each( events, function( i, val ) {
    if (checkedBox === val.name){ //if it matches the name of one of the events object
      let eventA = events[i] //give me the index and set it to EventA
      totalBill += eventA.cost;
      billingBox.innerText = "$ " + totalBill;
      $.each( events, function( i, val ) {
        if ( eventA.name !== val.name) { //If it's not the same event
          checkConflict(eventA, val) //check for scheduling conflicts
        }
      });
    }
  });
} else {
  $.each( events, function( i, val ) {
    if (checkedBox === val.name){ //if it matches the name of one of the events object
      let eventA = events[i] //give me the index and set it to EventA
      totalBill -= eventA.cost;
      if (totalBill !== 0) {
        billingBox.innerText = "$ " + totalBill;
      } else {
        billingBox.innerText = ""
      }
      try {
        eventA.conflict.isConflicting = false; //if there was a conflicting event set it's  isConflicting property to false
      } catch (err) {
        console.log("this event had no scheduling conflicts")
      }
    }
  });
}
  $.each( events, function( i, val ) {
    let conflictingLabel = fieldset_activities$.find("label")[i];
    if (val.isConflicting) {
      activities[i].disabled = true; //disabled conflicting activities
      conflictingLabel.style.color="grey"
      conflictingLabel.style.textDecoration="line-through"
    } else {
      activities[i].disabled = false; //disabled conflicting activities
      conflictingLabel.style.color="black"
      conflictingLabel.style.textDecoration="none"
    }
  });
});

const paymentOption$ = $('#payment').children();
let need_valid_cc = true; //because the default option is credit card

$.each( paymentOption$, function( i, val ) {
  if (val.value == "Credit Card") { //set credit card payment option to default
  val.selected = true;
  $('#paypal').hide()
  $('#bitcoin').hide()
  }
  if (val.value == "select method") { //don't allow the 'select method' option to be chosen
  val.disabled = true;
  }
});

$('#payment').change(function(event){
  $('#bitcoin').hide()
  $('#credit-card').hide()
  $('#paypal').hide()
  switch (event.target.value) { //show the selected one and hide all the others
    case "Credit Card":
      $('#credit-card').show()
      need_valid_cc = true;
      break;
    case "PayPal":
      $('#paypal').show()
      need_valid_cc = false;
      break;
    case "Bitcoin":
      $('#bitcoin').show()
      need_valid_cc = false;
      break;
  }
});

function redFlag(div,field, additionalInfo){
  let redMessage = document.createElement("SPAN");
  redMessage.innerText = 'Please insert a valid ' + field
  if (additionalInfo) {
    redMessage.innerHTML += "</br>" + additionalInfo
  }
  div[0].classList.add('red_border');
  redMessage.classList.add('error_message');
  div.after(redMessage)
}
console.log($('#payment')[0].value)

$(':submit').click(function(event){
  event.preventDefault() //don't want the form to refresh on submit
  const currentErrorMessages = $( "body" ).find( ".error_message" )
  currentErrorMessages.remove() //don't keep adding up elements with error messages, delete previous ones
  let valid_user_name = /^[a-z ,.'-]+$/i.test($('#name').val()) //check if valid name;
  let valid_user_email = /^[^@]+@[^@.]+\.[a-z]+$/i.test($('#mail').val()) //check if valid email address
  let valid_billing = (totalBill > 0); //if one or more checkboxes are selected the total billing will be > 0
  if (!need_valid_cc){
    let valid_cc = true;
  } else {
    let valid_cc = false;
  }
  if ($('#payment')[0].value == "Credit Card") {
    let valid_number = /^[0-9]{13,16}$/.test($('#cc-num').val()) //number between 13 and 16 digits
    let valid_zip = /^[0-9]{5}$/.test($('#zip').val()) //5 digit number
    let valid_cvv = /^[0-9]{3}$/.test($('#cvv').val()) //3 digit number
    valid_cc = (valid_number && valid_zip && valid_cvv )
    if (!valid_number){
      redFlag($('#cc-num'),'credit card number', `It should be between 13 and 16 digits and you inserted ${($('#cc-num').val().length)}`);
    }
    if (!valid_zip){
      redFlag($('#zip'),'zip code', `It should be 5 digits and you inserted ${($('#zip').val().length)}`);
    }
    if (!valid_cvv){
      redFlag($('#cvv'),'cvv',`It should be 3 digits and you inserted ${($('#cvv').val().length)}`);
    }
  } else {
    valid_cc = true; //fix issue where form was not submitted if paypal or bitcoin was selected
  }
  let passed = (valid_user_name && valid_user_email && valid_billing && valid_cc)
  if (!valid_user_name){
    redFlag($('#name'),'name');
  }
  if (!valid_user_email){
    redFlag($('#mail'),'email');
  }
  if (!valid_billing){
    const errorBox = document.createElement("SPAN"); //create a new span to insert error message if needed
    billingBox.append(errorBox)
    errorBox.setAttribute('id', 'billing')
    $('#billing')[0].style.display = "block"
    $('#billing')[0].innerText = "Please select at least one activity"
    $('#billing')[0].classList.add('error_message');
  }
  if (passed){
    alert('Your form was successfully submited')
    location.reload();
  }
});

//Real time validation of name and email fields

$('#name').focusout(function(event){
  const currentErrorMessages = $( "body" ).find( ".error_message" )
  currentErrorMessages.remove()
  let name = /^[a-z ,.'-]+$/i.test($('#name').val()) //check if valid name
  if (!name){
    redFlag($('#name'),'name');
  } else {
    $('#name > span').removeClass( "error_message" );
    $('#name').removeClass( "red_border");
  }
});

$('#mail').focusout(function(event){
  const currentErrorMessages = $( "body" ).find( ".error_message" )
  currentErrorMessages.remove()
  let email = /^[^@]+@[^@.]+\.[a-z]+$/i.test($('#mail').val()) //check if valid email address
  if (!email){
      redFlag($('#mail'),'email');
  } else {
    $('#mail > span').removeClass( "error_message" );
    $('#mail').removeClass( "red_border");
  }
});
