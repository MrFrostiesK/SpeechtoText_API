var rouge = new Object();
rouge.nom = "rouge";
rouge.code = "#FF0000";
rouge.rbg = "RGB(255,0,0)";

var rose = new Object();
rose.nom = "rose";
rose.code = "#FFC0CB";
rose.rbg = "RGB(255,192,203)";

var jaune = new Object(); 
jaune.nom = "jaune";
jaune.code = "#FFFF00";
jaune.rbg = "RGB(255,255,0)";

var violet = new Object(); 
violet.nom = "violet";
violet.code = "#800080";
violet.rbg = "RGB(128,0,128)";

var indigo = new Object();
indigo.nom = "indigo";
indigo.code = "#4B0082";
indigo.rbg = "RGB(75,0,130)";

var vert = new Object();
vert.nom = "vert";
vert.code = "#008000";
vert.rbg = "RGB(0,128,0)";

var bleu = new Object(); 
bleu.nom = "bleu";
bleu.code = "#0000FF";
bleu.rbg = "RGB(0,0,255)";
 
var marron = new Object();
marron.nom = "marron";
marron.code = "#A52A2A";
marron.rbg = "RGB(165,42,42)";

var blanc = new Object();
blanc.nom = "blanc";
blanc.code = "#FFFFFF";
blanc.rbg = "RGB(255,255,255)";

var gris = new Object();
gris.nom = "gris";
gris.code = "#808080";
gris.rbg = "RGB(128,128,128)";

var noir = new Object();
noir.nom = "noir";
noir.code = "#000000";
noir.rbg = "RGB(0,0,0)";

var ListCouleur = {}
ListCouleur["rouge"] = "#FF0000";
ListCouleur["rose"] = "#FFC0CB";
ListCouleur["jaune"] = "#FFFF00";
ListCouleur["violet"] = "#800080";
ListCouleur["indigo"] = "#4B0082";
ListCouleur["vert"] = "#008000";
ListCouleur["bleu"] = "#0000FF";
ListCouleur["marron"] = "#A52A2A";
ListCouleur["blanc"] = "#FFFFFF";
ListCouleur["gris"] = "#808080";
ListCouleur["noir"] = "#000000";
var BoutonColor = "";

try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch(e) {
  console.error(e);
  $('.no-browser-support').show();
  $('.app').hide();
}


var noteTextarea = $('#note-textarea');
var instructions = $('#recording-instructions');
var notesList = $('ul#notes');

var noteContent = '';

// Get all notes from previous sessions and display them.
var notes = getAllNotes();
renderNotes(notes);



/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = true;

// This block is called every time the Speech APi captures a line. 
recognition.onresult = function(event) {

  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far. 
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript;

  // Add the current transcript to the contents of our Note.
  // There is a weird bug on mobile, where everything is repeated twice.
  // There is no official solution so far so we have to handle an edge case.
  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  if(!mobileRepeatBug) {
    noteContent += transcript;
    noteTextarea.val(noteContent);
  }
};

recognition.onstart = function() { 
  instructions.text('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onspeechend = function() {
  instructions.text('You were quiet for a while so voice recognition turned itself off.');
}

recognition.onerror = function(event) {
  if(event.error == 'no-speech') {
    instructions.text('No speech was detected. Try again.');  
  };
}



/*-----------------------------
      App buttons and input 
------------------------------*/

$('#start-record-btn').on('click', function(e) {
  if (noteContent.length) {
    noteContent += ' ';
  }
  recognition.start();
});


$('#pause-record-btn').on('click', function(e) {
  recognition.stop();
  instructions.text('Voice recognition paused.');
});

// Sync the text inside the text area with the noteContent variable.
noteTextarea.on('input', function() {
  noteContent = $(this).val();
})

$('#save-note-btn').on('click', function(e) {
  recognition.stop();

  if(!noteContent.length) {
    instructions.text('Could not save empty note. Please add a message to your note.');
  }
  else {
    // Save note to localStorage.
    // The key is the dateTime with seconds, the value is the content of the note.
    saveNote(new Date().toLocaleString(), noteContent);

    // Reset variables and update UI.
    noteContent = '';
    renderNotes(getAllNotes());
    noteTextarea.val('');
    instructions.text('Note saved successfully.');
  }
      
})


notesList.on('click', function(e) {
  e.preventDefault();
  var target = $(e.target);

  // Listen to the selected note.
  if(target.hasClass('listen-note')) {
    var content = target.closest('.note').find('.content').text();
    readOutLoud(content);
  }

  // Delete note.
  if(target.hasClass('delete-note')) {
    var dateTime = target.siblings('.date').text();  
    deleteNote(dateTime);
    target.closest('.note').remove();
  }
});



/*-----------------------------
      Speech Synthesis 
------------------------------*/

function readOutLoud(message) {
	var speech = new SpeechSynthesisUtterance();

  // Set the text and voice attributes.
	speech.text = message;
	speech.volume = 1;
	speech.rate = 1;
	speech.pitch = 1;
  
	window.speechSynthesis.speak(speech);
}



/*-----------------------------
      Helper Functions 
------------------------------*/

function renderNotes(notes) {
  var html = '';
  if(notes.length) {
    notes.forEach(function(note) {
      html+= `<li class="note">
        <p class="header">
          <span class="date">${note.date}</span>
          <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
          <a href="#" class="delete-note" title="Delete">Delete</a>
        </p>
        <p class="content">${note.content}</p>
      </li>`;    
    });
  }
  else {
    html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
  }
  notesList.html(html);
}


function saveNote(dateTime, content) {
  test = 0;
  var supertest = "rouge";
  console.log(ListCouleur[supertest]);
  var textBoutton = ""
  localStorage.setItem('note-' + dateTime, content);
  if(content.includes("bouton")){
    var list = content.split(' ');
    list.forEach(function(item, index, array) {
      console.log(item)
      console.log(test)      
      if(test==1){
          var testCouleur = ListCouleur[item]
          console.log("testCouleur"+ testCouleur);
        if(testCouleur != undefined){
          BoutonColor = testCouleur;
        }else{
          textBoutton = textBoutton.concat(' ', item);

        }
        }
      
      if(item == "bouton"){
        test=1;
        console.log("j'ys suis")

      }
    });

    maFonction(textBoutton)
  }
}


function getAllNotes() {
  var notes = [];
  var key;
  for (var i = 0; i < localStorage.length; i++) {
    key = localStorage.key(i);

    if(key.substring(0,5) == 'note-') {
      notes.push({
        date: key.replace('note-',''),
        content: localStorage.getItem(localStorage.key(i))
      });
    } 
  }
  return notes;
}


function deleteNote(dateTime) {
  localStorage.removeItem('note-' + dateTime); 
}


    var btns = document.querySelectorAll(".btns"),
    answer = document.querySelector("#answer"),
    section = document.querySelector("section"),
    i = btns.length;
    function onButtonsClick(e) {
      if (e.target.tagName === "BUTTON") {
        alert(e.target.id);
      }
    }
    function maFonction(textBoutton) {
      console.log(textBoutton)
      console.log("bouton color "+ BoutonColor)
      var btn = document.createElement("button");
      btn.style.background = BoutonColor;
      //e.preventDefault();
      btn.id = i+1;
      btn.classList.add("btns");
      section.appendChild(btn);
      btn.appendChild(document.createTextNode(textBoutton));
      btns[i] = btn;
      i++;
      BoutonColor = "";
    }
    section.addEventListener("click", onButtonsClick, false);
    document.querySelector("form").addEventListener("submit", maFonction, false);


