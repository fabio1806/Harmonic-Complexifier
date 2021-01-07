const BASE_FREQ = 261.63                              //frequency of C4
keys            = "zsxdcvgbhnjmq2w3er5t6y7ui";

const keySel = document.getElementById("keySel");

var audio = new AudioContext()
var gains = {}

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
                  {text:'7',    active: false},
                  {text:'mM7',  active: false},
                  {text:'m7b5', active: false},
                  {text:'M7#5', active: false},
                  {text:'dim7', active: false},
                  {text:'7#5',  active: false},
                  {text:'7b5',  active: false},
                  {text:'6#5',  active: false}
                ],

    durations:  [
                  {text:'1',    active: false},
                  {text:'1/2',  active: false},
                  {text:'1/4',  active: false},
                  {text:'1/8',  active: false},
                  {text:'1/16', active: false},
                  {text:'1/32', active: false},
                  {text:'1/64', active: false}
                ],

    preview:    { message: '' },

    error:      [],

    stdin:      []

  },

  methods: {
    activate: function(el, dataName) {

      dataName.forEach((i) => {
        i.active = false;
      });

      el.active = true;

      chords.preview.message = inText();
    },

    createNotes: function(el) {
      chords.chords.forEach((i) => {
        i.active = false;
      });

      chords.durations.forEach((i) => {
        i.active = false;
      });

      chords.notes = [];
      chords.preview.message = '';
      for (var i=0; i < chords.keys.length; i++) {
        chords.notes.push(
          { text: chords.keys[(i + chords.keys.findIndex(key => key.text === el.text)) % chords.keys.length].text,
            active: false
          }
        )
      }
    }
  }
})

var captions = new Vue({
  el: '#caption',
  data: {
    captions: [
                {text:  'M = major chord'},
                {text:  'm = minor chord'}
              ]
  }
})

function inText() {
  text = '';

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

function addToStdin() {
  previewText = inText()
  if (previewText != ''){
    if (chords.notes.find( (el) => el.active == true) == null) {
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
      chords.stdin.push(previewText);
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

function switchToKeyboard() {
  buttons.style.display   = 'none';
  keyboard.style.display  = 'block';
  stdin.style.display     = 'block';
  preview.style.display   = 'none';
  console.log("Switched to keyboard input");
  document.getElementById("keySwitch").classList.add("activated");
  document.getElementById("btnSwitch").classList.remove("activated");
}

function switchToButtons() {
  buttons.style.display   = 'block';
  keyboard.style.display  = 'none';
  stdin.style.display     = 'block';
  preview.style.display   = 'block';
  console.log("Switched to buttons input");
  document.getElementById("keySwitch").classList.remove("activated");
  document.getElementById("btnSwitch").classList.add("activated");
}

function playKey(e) {
  if (keyboard.style.display == 'block' && keys.indexOf(e) != -1){
    freq = BASE_FREQ * Math.pow(2, keys.indexOf(e)/12);
    playNote(freq);
    setTimeout(stopNote(freq), 2000);
  }
}

document.onkeydown = function(e) {
  if (keyboard.style.display == 'block' && !e.repeat && keys.indexOf(e.key) != -1)
    playNote( BASE_FREQ * Math.pow(2, keys.indexOf(e.key)/12))
}

document.onkeyup = function(e) {
  if (keyboard.style.display == 'block' && keys.indexOf(e.key) != -1)
    stopNote( BASE_FREQ * Math.pow(2, keys.indexOf(e.key)/12))
}

resume()
