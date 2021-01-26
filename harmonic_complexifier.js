const BASE_FREQ = 261.63                              //frequency of C4
keys            = "zsxdcvgbhnjmq2w3er5t6y7ui";

const keySel = document.getElementById("keySel");

const maj_temp = [true,false,false,false,true,false,false,true,false,false,false,true]
const min_temp = [true,false,false,true,false,false,false,true,false,false,true,false]
const dom_temp = [true,false,false,false,true,false,false,true,false,false,true,false]
const m7b5_temp = [true,false,false,true,false,false,true,false,false,false,true,false]


var audio = new AudioContext()
var gains = {}
var keyIndex = 0
var chord_progOUT1
var chord_progOUT2

function playNote(freq){
  var osc1 = audio.createOscillator()
  osc1.type = "triangle"
  var osc2 = audio.createOscillator()
  osc2.type = "triangle"
  var g1 = audio.createGain()
  var g2 = audio.createGain()
  gains[freq] = g1
  gains[4*freq] = g2
  osc1.connect(g1)
  osc2.connect(g2)
  g1.connect(audio.destination)
  g2.connect(audio.destination)
  osc1.frequency.setValueAtTime(freq, audio.currentTime)
  osc2.frequency.setValueAtTime(4*freq, audio.currentTime)
  osc1.start()
  osc2.start()
  g1.gain.linearRampToValueAtTime(1, audio.currentTime)
  g1.gain.linearRampToValueAtTime(0.8, audio.currentTime+0.2)
  g2.gain.linearRampToValueAtTime(0.2, audio.currentTime)
  g2.gain.linearRampToValueAtTime(0.15, audio.currentTime+0.2)
}

function stopNote(freq){
  var g1 = gains[freq]
  g1.gain.linearRampToValueAtTime(0.8, audio.currentTime)
  g1.gain.linearRampToValueAtTime(0, audio.currentTime+0.2)
  var g2 = gains[4*freq]
  g2.gain.linearRampToValueAtTime(0.15, audio.currentTime)
  g2.gain.linearRampToValueAtTime(0, audio.currentTime+0.2)
}

function resume() {
  audio.resume().then(() => {
    console.log('Playback resumed successfully')
  })
}

var chords = new Vue({
  el: '#root',

  data: {

    Wkeys:      [
                  {text: 'z', clicked: false},
                  {text: 'x', clicked: false},
                  {text: 'c', clicked: false},
                  {text: 'v', clicked: false},
                  {text: 'b', clicked: false},
                  {text: 'n', clicked: false},
                  {text: 'm', clicked: false},
                  {text: 'q', clicked: false},
                  {text: 'w', clicked: false},
                  {text: 'e', clicked: false},
                  {text: 'r', clicked: false},
                  {text: 't', clicked: false},
                  {text: 'y', clicked: false},
                  {text: 'u', clicked: false},
                  {text: 'i', clicked: false},
                ],

    Bkeys:      [
                  {text: 's', activeClass: 'black key', clicked: false},
                  {text: 'd', activeClass: 'black key', clicked: false},
                  {text: '',  activeClass: 'space',     clicked: false},
                  {text: 'g', activeClass: 'black key', clicked: false},
                  {text: 'h', activeClass: 'black key', clicked: false},
                  {text: 'j', activeClass: 'black key', clicked: false},
                  {text: '',  activeClass: 'space',     clicked: false},
                  {text: '2', activeClass: 'black key', clicked: false},
                  {text: '3', activeClass: 'black key', clicked: false},
                  {text: '',  activeClass: 'space',     clicked: false},
                  {text: '5', activeClass: 'black key', clicked: false},
                  {text: '6', activeClass: 'black key', clicked: false},
                  {text: '7', activeClass: 'black key', clicked: false},
                ],

    keys:       [
                  {text:'C',  active: false},
                  {text:'C#', active: false},
                  {text:'D',  active: false},
                  {text:'D#', active: false},
                  {text:'E',  active: false},
                  {text:'F',  active: false},
                  {text:'F#', active: false},
                  {text:'G',  active: false},
                  {text:'G#', active: false},
                  {text:'A',  active: false},
                  {text:'A#', active: false},
                  {text:'B',  active: false}
                ],

    notes:       [
                  {text:'C',  active: false},
                  {text:'C#', active: false},
                  {text:'D',  active: false},
                  {text:'D#', active: false},
                  {text:'E',  active: false},
                  {text:'F',  active: false},
                  {text:'F#', active: false},
                  {text:'G',  active: false},
                  {text:'G#', active: false},
                  {text:'A',  active: false},
                  {text:'A#', active: false},
                  {text:'B',  active: false}
                ],

    chords:     [
                  {text:'M7',   active: false},
                  {text:'m7',   active: false},
                  {text:'D7',   active: false},
                  {text:'dim7', active: false},
                ],

    durations:  [
                  {text:'1',    value:1,    active: false},
                  {text:'1/2',  value:1/2,  active: false},
                  {text:'1/4',  value:1/4,  active: false},
                  {text:'1/8',  value:1/8,  active: false},
                  {text:'1/16', value:1/16, active: false},
                  {text:'1/32', value:1/32, active: false},
                ],

    preview:    { message: '' },

    error:      [],

    stdin:      [],

    chord_progOUT1: [],

    chord_progOUT2: []

  },

  methods: {
    activate: function(el, dataName) {

      dataName.forEach((i) => {
        i.active = false;
      });

      el.active = true;

      chords.preview.message = inText();
    },

    newKey: function(el) {
      keyIndex = chords.keys.findIndex(key => key.active == el.text)

      resetInputs();

      /*chords.notes = [];
      for (var i=0; i < chords.keys.length; i++) {
        chords.notes.push(
          { text: chords.keys[(i + keyIndex) % chords.keys.length].text,
            active: false
          }
        )
      }*/
    },

    playKey: function(el) {
      if (document.getElementById("keyboard").style.display == 'block' && keys.indexOf(el.text) != -1 && !el.clicked){
        freq = BASE_FREQ * Math.pow(2, keys.indexOf(el.text)/12);
        playNote(freq);
        setTimeout(stopNote(freq), 2000);
      }
    },

    activeKey: function(el) {
      el.clicked = !el.clicked;
      chords.preview.message = inText();
    }
  }
})

var captions = new Vue({
  el: '#caption',
  data: {
    captions: [
                {text:  'M7 = major 7th chord'},
                {text:  'm7 = minor 7th chord'},
                {text:  'D7 = dominant 7th chord'},
                {text:  'dim7 = diminished 7th chord'}
              ]
  }
})

function inText() {
  text = '';
  if (buttons.style.display == 'block'){
    chords.notes.forEach((note) => {
      if (note.active){
        text = text + note.text
      }
    });

    chords.chords.forEach((chord) => {
      if (chord.active){
        text = text + chord.text
      }
    });

    chords.durations.forEach((time) => {
      if (time.active){
        text = text + ' (' + time.text + ')';
      }
    });

    return text;
  }

  if (keyboard.style.display == 'block'){
    keyIndex = chords.keys.findIndex(key => key.active == true);
    booleanArr = [chords.Wkeys[0], chords.Bkeys[0], chords.Wkeys[1], chords.Bkeys[1],
                  chords.Wkeys[2], chords.Wkeys[3], chords.Bkeys[3], chords.Wkeys[4],
                  chords.Bkeys[4], chords.Wkeys[5], chords.Bkeys[5], chords.Wkeys[6],
                  chords.Wkeys[7], chords.Bkeys[7], chords.Wkeys[8], chords.Bkeys[8],
                  chords.Wkeys[9], chords.Wkeys[10], chords.Bkeys[10], chords.Wkeys[11],
                  chords.Bkeys[11], chords.Wkeys[12], chords.Bkeys[12], chords.Wkeys[13],
                  chords.Wkeys[14]];
    console.log(booleanArr);
    var arr = []
    for (i=0; i < 11; i++){
      arr[i] = booleanArr[(keyIndex +i) % 11]
      arr[i] = arr[i].clicked
    }
    console.log(arr)

    if (arr == maj_temp)
      text = booleanArr[keyIndex].note + 'M7';

    if (arr == min_temp)
      text = booleanArr[keyIndex].note + 'm7';

    if (arr == dom_temp)
      text = booleanArr[keyIndex].note + 'D7';

    chords.durations.forEach((time) => {
      if (time.active){
        text = text + ' (' + time.text + ')';
      }
    });

    return text;
  }
}

function addToStdin() {
  previewText = inText()
  if (previewText != ''){
    if (chords.keys.find( (el) => el.active == true) == null) {
      chords.error.push('Key missing: select a key before add a new element');
      setTimeout(() => { chords.error.shift(); }, 3000)
    }

    else if (chords.notes.find( (el) => el.active == true) == null) {
      chords.error.push('Note missing: select a note before add a new element');
      setTimeout(() => { chords.error.shift(); }, 3000)
    }

    else if (chords.chords.find( (el) => el.active == true) == null ) {
      chords.error.push('Chord missing: select a chord before add a new element');
      setTimeout(() => { chords.error.shift(); }, 3000)
    }

    else if (chords.durations.find( (el) => el.active == true) == null ) {
      chords.error.push('Duration missing: select a duration before add a new element');
      setTimeout(() => { chords.error.shift(); }, 3000)
    }

    else {
      var note = ''
      chords.notes.forEach((x) => {
              if (x.active)
                note = x.text
            })

      var chord = ''
      chords.chords.forEach((x) => {
              if (x.active)
                chord = x.text
            })

      var duration = ''
      chords.durations.forEach((x) => {
              if (x.active)
                duration = x.value
            })

      chords.stdin.push({
        note: note,
        chord: chord,
        duration: duration
      });
      console.log("Added");
    }
  }
  else {
    chords.error.push("Empty input")
    setTimeout(() => { chords.error.shift(); }, 3000)
  }
}

function undoIn() {
  chords.stdin.pop();
}

function resetInputs(){
  chords.notes.forEach((i) => {
    i.active = false;
  });

  chords.chords.forEach((i) => {
    i.active = false;
  });

  chords.durations.forEach((i) => {
    i.active = false;
  });

  chords.preview.message = '';
}

function switchToKeyboard() {
  buttons.style.display   = 'none';
  keyboard.style.display  = 'block';
  console.log("Switched to keyboard input");
  document.getElementById("keySwitch").classList.add("activated");
  document.getElementById("btnSwitch").classList.remove("activated");

  resetInputs();
}

function switchToButtons() {
  buttons.style.display   = 'block';
  keyboard.style.display  = 'none';
  console.log("Switched to buttons input");
  document.getElementById("keySwitch").classList.remove("activated");
  document.getElementById("btnSwitch").classList.add("activated");
}

function pressedKey(e) {
  chords.Wkeys.forEach((key) => {
    if (key.text == e)
      key.clicked = !key.clicked;
  });

  chords.Bkeys.forEach((key) => {
    if (key.text == e)
      key.clicked = !key.clicked;
  });

  chords.preview.message = inText();
}

document.onkeydown = function(e) {
  if (keyboard.style.display == 'block' && !e.repeat && keys.indexOf(e.key) != -1){
    playNote( BASE_FREQ * Math.pow(2, keys.indexOf(e.key)/12))

    pressedKey(e.key);
  }
}

document.onkeyup = function(e) {
  if (keyboard.style.display == 'block' && keys.indexOf(e.key) != -1){
    stopNote( BASE_FREQ * Math.pow(2, keys.indexOf(e.key)/12))
    pressedKey(e.key);
  }
}

function chord_prog_type(input, note_labels){
  var place = []

  for(var k=0; k < input.length; k++){
    var note = input[k].note
    if (input[k].chord == 'M7'){
      if (note_labels.indexOf(note) == 0){
        console.log("The chord "+ note +"M7 is the tonic");
        place[k] = 1
      }

      else if (note_labels.indexOf(note) == 5) {
        console.log("The chord "+ note +"M7 is the subdominant");
        place[k] = 4
      }

      else{ place[k] = -1 }
    }

    else if (input[k].chord == 'D7') {
      if (note_labels.indexOf(note) == 7){
        console.log("The chord "+ note +"7 is the dominant");
        place[k] = 5
      }
      else{ place[k] = -1 }
    }

    /*else if (input[k].chord == '') {

    }*/
  }

  return place
}

function chord_prog_1(input, note_labels, place){
  var chord_progOUT = []
  for(var k=0; k < input.length; k++){
      if (place[k] == 5){
        el1 = {note: note_labels[2], chord: 'm7', duration: input[k].duration/2};
        el2 = {note: input[k].note, chord: input[k].chord, duration: input[k].duration/2};
        chord_progOUT.push(el1);
        chord_progOUT.push(el2);
      }
      else { chord_progOUT.push(input[k]); }
  }

  return chord_progOUT;
}

function chord_prog_2(input, note_labels, place){
  var chord_progOUT = []
  for(var k=0; k < input.length; k++){
    if (place[k] == 1) {
      el1 = {note: input[k].note, chord: input[k].chord, duration: input[k].duration/2};
      el2 = {note: note_labels[9], chord: 'm7', duration: input.duration/2}
      chord_progOUT.push(el1);
      chord_progOUT.push(el2);
    }
    else {
      chord_progOUT.push(input[k]);
    }
  }

  return chord_progOUT;
}

function runCode() {
  note_labels = []
  chords.notes.forEach((key) => note_labels.push(key.text))
  var ind = []

  var place = chord_prog_type(chords.stdin, note_labels);

  // Add the minor substitution before the dominant chord (II - V - I)
  chord_progOUT1 = chord_prog_1(chords.stdin, note_labels, place)

  // Tonic to minor parallel substitution (I- iv- V)
  chord_progOUT2 = chord_prog_2(chord_progOUT1, note_labels, place)

  showResult();
}

function showResult() {
  var int = document.getElementById("complexity").value;
  if(int == 1) {
    if(chord_progOUT1 != null){
      stdout = document.getElementById("stdout");
      if (stdout.firstChild != null)
        stdout.removeChild(stdout.firstChild);

      content = document.createElement("div");
      for(k=0; k < chord_progOUT1.length; k++){
        content.innerText += chord_progOUT1[k].note + chord_progOUT1[k].chord +
          "(1/" + (1/chord_progOUT1[k].duration) + ") "
      }
      stdout.appendChild(content);

      result = document.getElementById("result");
      result.showModal();
    }
  }
  if(int == 2) {
    if(chord_progOUT2 != null){
      stdout = document.getElementById("stdout");
      if (stdout.firstChild != null)
        stdout.removeChild(stdout.firstChild);

      content = document.createElement("div");
      for(k=0; k < chord_progOUT1.length; k++){
        content.innerText += chord_progOUT1[k].note + chord_progOUT1[k].chord +
          "(1/" + (1/chord_progOUT1[k].duration) + ") "
      }
      stdout.appendChild(content);

      result = document.getElementById("result");
      result.showModal();
    }
  }
}

function closeResult() {
  result = document.getElementById("result");
  result.close();
}

switchToButtons()
resume()
