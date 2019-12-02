
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
var singletonRoiDesId = 100;
var tableauRoiDesTableau = [];
var StringAvecLesNombreDeDebile = "1 2 3 4 5 6";


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
  var textBouton = "";
  localStorage.setItem('note-' + dateTime, content);
    var list = content.split(' ');
    list.forEach(function(item, index, array) {
      console.log(item)
      if(item == "créer" || item == "afficher" || item == "affiche" || item == "ajouter" || item =="ajoute"
      || item =="génère" || item =="générer" ){
        afficherItem(list,item);


    }else if(item == "déplacer" || item == "déplace" || item == "bouge"){
      deplacerItem(list,item);

    }else if(item == "supprimer" || item == "supprime" || item == "retire" || item == "retirer"){
      supprimerItem(list,item);
    }

    });

 

}
function deplacerItem(chaine, mot){
  var typeItem = "";
  var origine=0;
  var cible=0;
  var listItem = [];
  etape = 0;
    chaine.forEach(function(item, index, array){
      if(item=="bouton" || item == "champ texte"){
        typeItem=item;

      }
      if(etape == 0){
        if(StringAvecLesNombreDeDebile.includes(item)){
          origine=item;
          etape = 1;
        }
      }else if(etape == 1){
        if(StringAvecLesNombreDeDebile.includes(item)){
          cible=item;
          etape = etape+1;
        }
      }
      if(item == "haut"){
        if(origine=="1"){
          alert("impossible");
        }else if(origine=="2"){
          alert("impossible");

        }else if(origine =="3"){
                    alert("impossible");

        }else if(origine =="4"){
          cible = "1";
        }else if(origine =="5"){
          cible = "2";
        }else if(origine =="6"){
          cible = "3";
        }
      }
      if(item == "bas"){
        if(origine=="1"){
          cible="4";
        }else if(origine=="2"){
          cible="5";
        }else if(origine =="3"){
          cible="6";
        }else if(origine =="4"){
          alert("impossible");
        }else if(origine =="5"){
          alert("impossible");
        }else if(origine =="6"){
          alert("impossible");
        }
      }
      if(item == "gauche"){
        if(origine=="1"){
          alert("impossible");
        }else if(origine=="2"){
          cible="1";
        }else if(origine =="3"){
          cible="2";
        }else if(origine =="4"){
          alert("impossible");
        }else if(origine =="5"){
          cible="4";
        }else if(origine =="6"){
          cible="5";
        }
      }
      if(item == "droite"){
        console.log("in droite");
          if(origine=="1"){
          cible="2";
        }else if(origine=="2"){
          cible="3";
        }else if(origine =="3"){
          alert("impossible");
        }else if(origine =="4"){
          cible="5";
        }else if(origine =="5"){
          cible="6";
        }else if(origine =="6"){
          alert("impossible");
        }
      }


    });
      listItem = rechercherItem(origine,typeItem);
      console.log(listItem+ "list item");
      mvItem(listItem,origine,cible);
}
function rechercherItem(origine, typeItem){
  console.log(tableauRoiDesTableau);
  var listItem = [];
  tableauRoiDesTableau.forEach(function(item,index, array){
    if(item.deleted == false){
    console.log(item.div+"div");
    console.log(typeItem+"typeitem");
    if(typeItem == "bouton" || typeItem == "champ texte"){
    if(item.div == origine && item == typeItem){
      console.log("je suis dans le compliqué")
    listItem.push(item.id);
  }
    }else{
      if(item.div == origine){
        console.log("je suis dans le simple"+item.id);
        listItem.push(item.id);
        console.log(listItem);
      }
    }
  }
  });
  console.log(listItem+"juste avant");
  return listItem;
}
function MAJItem(id, couleur, div){
  tableauRoiDesTableau.forEach(function(item,index,array){
    var tampon={}
    if(item.id == id){
      if(couleur == "same"){
        tableauRoiDesTableau[index].div = div;
              }else{
                tableauRoiDesTableau[index].couleur = couleur;
                tableauRoiDesTableau[index].div = div;
              }
    }
  });
}
function supprimerItem(chaine,mot){
  var color="vide";
  var div="vide";
  var text="vide";
  var etape=0;
  var listId = [];
  chaine.forEach(function(item, index, array){
    if(item == "bouton"){
      etape = 1;
    }
    if(ListCouleur[item]!=undefined){
      color = item;
    }
    if(StringAvecLesNombreDeDebile.includes(item)){
      div=item;
    }
    if(etape==1){
      console.log(ListCouleur[item]+"couleur");
      console.log("item = "+item);
      if(ListCouleur[item]==undefined && item!="en" && item!="dans"){
        if(item !="1" || item !="2" || item != "3" || item != "4" || item != "5" || item !="6"){
          if(text=="vide"){
          text="";
        }
        text = item.concat(' ', item);
      }
      }
    }

  });
  console.log(etape+"etape");
  console.log(div+"div");
  console.log(text+"text");
  console.log(color+"color");
  listId = rechercheItemToDelete(color,div,text);
  deleteItem(listId);
}

function rechercheItemToDelete(color,div,text){
  var testCol;
  var testDiv;
  var testText;
  var itemAVirer = [];
  console.log("text de la fonction rechercheItemToDelete " + text);
  var listId = []
  console.log("in");
  if(color == "vide" && div == "vide" && text == "vide"){
    alert("rien trouvé a supprimer");
    return null;
  }
  tableauRoiDesTableau.forEach(function(item,index,array){
    if(color=="vide"){
      testCol=item.couleur;
    }else{
      testCol=color;
    }
    if(div=="vide"){
      testDiv=item.div;
    }else{
      testDiv=div;
    }
    if(text=="vide"){
      testText=item.txt;
    }else{
      testText=text;
    }
    console.log(item);
    console.log(testCol+"col");
    console.log(testDiv+"div");
    console.log(testText+"text");
    if(item.couleur== testCol && item.div == testDiv && item.txt == testText && item.deleted == false){

      console.log("trouvé");
      listId.push(item.id);
      itemAVirer.push(index);
      tableauRoiDesTableau[index].deleted = true;
      //tableauRoiDesTableau.splice(index,1);

    }
  });
  itemAVirer.forEach(function(item,index,array){
    tableauRoiDesTableau.splice(item,1);
  });
  console.log(itemAVirer+"itemAVirer");
  return listId;
}



function afficherItem(chaine, mot){
  var textBouton ="";
  var tampon = 0;
  var test = 0;
  var done = 0;
  var couleur = "";
  var textBouton ="";
  var BoutonColor= "";
  var cords = "1";
  var type ="";
  chaine.forEach(function(item, index, array) {
        if(item=="dans" || item == "en"){
        test = 2;
      }
      if(test==2){
        if(item == "1" || item == "2" || item == "3" || item == "4" || item == "5" || item == "6"){
          cords = item;
        }

      }      
      if(test==1){
          var testCouleur = ListCouleur[item]
          console.log("testCouleur"+ testCouleur);
        if(testCouleur != undefined){
          BoutonColor = testCouleur;
          couleur = item;
        }else{
          textBouton = textBouton.concat(' ', item);

        }
        }
     
      if(item == "bouton" || item == "champ" || item == "chant" || item == "titre"){
        if(item == "champ" || item == "chant" ){
          if(chaine[index+1] == "texte"){
            type = "champtexte";
          }
          if(chaine[index+1] == "de" && chaine[index+2]=="texte"){
            type = "champtexte";
             }
          console.log(chaine[index+1]+"index +1");
          console.log(chaine[index+2]+"index + 2");
        }
        if(item =="bouton"){
          type = "bouton";
        }
        if(item == "titre"){
          type = "titre";
        }
        test=1;
        done = 1

      }


});
  if(done == 1 ){
    if(type == "bouton"){
    console.log(cords +"test coordonnes");
    maFonction(textBouton,BoutonColor, couleur, cords);
    }else if(type == "champtexte"){
    console.log("in CT");
    addTextfield(textBouton,BoutonColor, couleur, cords);
  }else if(type=="titre"){
   addTitle(textBouton,BoutonColor,couleur,cords); 
  }
    testCouleur="";
    textBouton="";
    BoutonColor="";
    couleur="";
    cords = "1";
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
      }
    }
    function maFonction(textBouton, BoutonColor, Couleur, cords) {
      var objetHtml = {};
      var btn = document.createElement("button");
      var casetable = document.getElementById("div"+cords);
      singletonRoiDesId = singletonRoiDesId+1;
      objetHtml.id= singletonRoiDesId;
      objetHtml.couleur = Couleur;
      objetHtml.div = cords;
      objetHtml.item = "bouton";
      objetHtml.txt= textBouton;
      objetHtml.deleted = false;
      tableauRoiDesTableau.push(objetHtml);
      btn.id = singletonRoiDesId;
      btn.style.background = BoutonColor;
      btn.classList.add("btns");
      casetable.appendChild(btn)
      btn.appendChild(document.createTextNode(textBouton));

    }

    function addTextfield(textBouton,BoutonColor,couleur,cords){
      var objetHtml = {};
      var txtfiedl = document.createElement("INPUT");
      var casetable = document.getElementById("div"+cords);
      txtfiedl.setAttribute("type","text");
      singletonRoiDesId = singletonRoiDesId+1;
      txtfiedl.id = singletonRoiDesId;
      objetHtml.id = singletonRoiDesId;
      objetHtml.couleur = couleur;
      objetHtml.div = cords;
      objetHtml.item = "champ texte";
      objetHtml.txt = textBouton;
      objetHtml.deleted = false;
      tableauRoiDesTableau.push(objetHtml);
      // TODO couleur du text
      // TODO size
      // TODO string devant
      casetable.appendChild(txtfiedl);
    }

    function addTitle(textBouton,BoutonColor,couleur,cords){
      var objetHtml = {};
      var h = document.createElement("H1") 
      var title = document.createTextNode(textBouton);
      h.appendChild(title);
      var casetable = document.getElementById("div"+cords);
      //title.style.color = 'green'
       singletonRoiDesId = singletonRoiDesId+1;
      h.id = singletonRoiDesId;
      objetHtml.id = singletonRoiDesId;
      objetHtml.couleur = couleur;
      objetHtml.div = cords;
      objetHtml.item = "titre";
      objetHtml.txt = textBouton;
      objetHtml.deleted = false;
      tableauRoiDesTableau.push(objetHtml);
      casetable.appendChild(h);
      var divs = document.getElementsByTagName("h1");  
for(var i = 0; i < divs.length; i++) {   
  var div = divs[i];                     
  div.style.color = BoutonColor;            
}

    }


    function deleteItem(listId){
      console.log("in"+listId);
      listId.forEach(function(item,index,arry){
        document.getElementById(item).remove();
      });
    }
    function mvItem(listItem,id,cible){
      console.log(listItem+"listItem");
      console.log(listItem+"id");
      console.log(listItem+"cible");
      var origine;
      var target;
      listItem.forEach(function(item,index,array){
      origine = document.getElementById(item);
      target = document.getElementById("div"+cible);
      console.log(target);
      target.appendChild(origine);
      MAJItem(item,"same",cible)
      });

    }
