$('#other-title').hide(); //show this option only when user selects 'other' option
$(':input:visible:first').focus(); // focus the first field
$('#color').children().hide(); //hide the options
const selectTheme = document.createElement("OPTION"); //create a new option
$('#color').prepend(selectTheme)  //prepend it to the option list
selectTheme.innerText = "Please select a T-shirt theme" //ask the user to select a design first
selectTheme.selected = "selected" //set it to selected

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

  for (i=0; i < $('#color').children().length; i += 1 ) { //check all the options
    let option = $('#color').children()[i].value; //give me their values
    if (availableColors.indexOf(option) !== -1)  { //if the values are on the list of available colors
      $('#color').children()[i].style.display = "block" //display that option on the color selector
    }
  }
});
