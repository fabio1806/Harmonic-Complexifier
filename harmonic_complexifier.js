const BASE_FREQ = 261.63                              //frequency of C4
keys            = "zsxdcvgbhnjmq2w3er5t6y7ui";

const keySel    = document.getElementById("keySel");

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
                  {text:'Δ',   active: false},
                  {text:'m7',   active: false},
                  {text:'7',   active: false},
                  {text:'dim7', active: false},
                ],

    durations:  [
                  {text:'𝅝',  value:1,    active: false},
                  {text:'𝅗𝅥',  value:1/2,  active: false},
                  {text:'♩',  value:1/4,  active: false},
                  {text:'𝅘𝅥𝅮',  value:1/8,  active: false},
                  {text:'𝅘𝅥𝅯', value:1/16, active: false},
                  {text:'𝅘𝅥𝅰', value:1/32, active: false},
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
      if (document.getElementById("padlock").classList == "fa fa-unlock") {
        keyIndex = chords.keys.findIndex(key => key.text == el.text)

        resetInputs();

        chords.notes = [];
        for (var i=0; i < chords.keys.length; i++) {
          chords.notes.push(
            { text: chords.keys[(i + keyIndex) % chords.keys.length].text,
              active: false
            }
          )
        }
        chords.activate(el, chords.keys)
        document.getElementById("padlock").click();
      }
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
                {text:  'Δ = major 7th'},
                {text:  'm7 = minor 7th'},
                {text:  '7 = dominant 7th'},
                {text:  'dim7 = diminished 7th'}
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
    arr = [chords.Wkeys[0].clicked, chords.Bkeys[0].clicked, chords.Wkeys[1].clicked, chords.Bkeys[1].clicked,
            chords.Wkeys[2].clicked, chords.Wkeys[3].clicked, chords.Bkeys[3].clicked, chords.Wkeys[4].clicked,
            chords.Bkeys[4].clicked, chords.Wkeys[5].clicked, chords.Bkeys[5].clicked, chords.Wkeys[6].clicked,
            chords.Wkeys[7].clicked, chords.Bkeys[7].clicked, chords.Wkeys[8].clicked, chords.Bkeys[8].clicked,
            chords.Wkeys[9].clicked, chords.Wkeys[10].clicked, chords.Bkeys[10].clicked, chords.Wkeys[11].clicked,
            chords.Bkeys[11].clicked, chords.Wkeys[12].clicked, chords.Bkeys[12].clicked, chords.Wkeys[13].clicked,
            chords.Wkeys[14].clicked];
    
    /* C chords */
    if (JSON.stringify(arr) == JSON.stringify([true, false, false, false, true, false, false, true, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false]) ||
        JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, false, true, false])){
      document.getElementById("buttons").children[1].click();
      document.getElementById("buttons").children[14].click();
      text = 'CΔ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([true, false, false, true, false, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false]) ||
            JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false])){
      document.getElementById("buttons").children[1].click();
      document.getElementById("buttons").children[15].click();
      text = 'Cm7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([true, false, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false]) ||
            JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false])){
      document.getElementById("buttons").children[1].click();
      document.getElementById("buttons").children[16].click();
      text = 'C7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([true, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]) ||
            JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false])){
      document.getElementById("buttons").children[1].click();
      document.getElementById("buttons").children[17].click();
      text = 'Cdim7'
    }

    /* C# chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false]) ||
            JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, false, true])){
      document.getElementById("buttons").children[2].click();
      document.getElementById("buttons").children[14].click();
      text = 'C#Δ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, true, false, false, true, false, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false]) ||
            JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false])){
      document.getElementById("buttons").children[2].click();
      document.getElementById("buttons").children[15].click();
      text = 'C#m7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, true, false, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false]) ||
            JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false])){
      document.getElementById("buttons").children[2].click();
      document.getElementById("buttons").children[16].click();
      text = 'C#7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, true, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false]) ||
            JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, true, false, false, true, false, false])){
      document.getElementById("buttons").children[2].click();
      document.getElementById("buttons").children[17].click();
      text = 'C#dim7'
    }

    /* D chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[3].click();
      document.getElementById("buttons").children[14].click();
      text = 'DΔ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, true, false, false, true, false, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[3].click();
      document.getElementById("buttons").children[15].click();
      text = 'Dm7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[3].click();
      document.getElementById("buttons").children[16].click();
      text = 'D7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, true, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false]) ||
            JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, true, false, false, true, false])){
      document.getElementById("buttons").children[3].click();
      document.getElementById("buttons").children[17].click();
      text = 'Ddim7'
    }

    /* D# chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[4].click();
      document.getElementById("buttons").children[14].click();
      text = 'D#Δ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[4].click();
      document.getElementById("buttons").children[15].click();
      text = 'D#m7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[4].click();
      document.getElementById("buttons").children[16].click();
      text = 'D#7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false]) ||
            JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, true, false, false, true])){
      document.getElementById("buttons").children[4].click();
      document.getElementById("buttons").children[17].click();
      text = 'D#dim7'
    }

    /* E chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[5].click();
      document.getElementById("buttons").children[14].click();
      text = 'EΔ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[5].click();
      document.getElementById("buttons").children[15].click();
      text = 'Em7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[5].click();
      document.getElementById("buttons").children[16].click();
      text = 'E7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[5].click();
      document.getElementById("buttons").children[17].click();
      text = 'Edim7'
    }

    /* F chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[6].click();
      document.getElementById("buttons").children[14].click();
      text = 'FΔ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[6].click();
      document.getElementById("buttons").children[15].click();
      text = 'Fm7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[6].click();
      document.getElementById("buttons").children[16].click();
      text = 'F7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[6].click();
      document.getElementById("buttons").children[17].click();
      text = 'Fdim7'
    }

    /* F# chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[7].click();
      document.getElementById("buttons").children[14].click();
      text = 'F#Δ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[7].click();
      document.getElementById("buttons").children[15].click();
      text = 'F#m7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[7].click();
      document.getElementById("buttons").children[16].click();
      text = 'F#7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[7].click();
      document.getElementById("buttons").children[17].click();
      text = 'F#dim7'
    }

    /* G chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, false, false, false, false])){
      document.getElementById("buttons").children[8].click();
      document.getElementById("buttons").children[14].click();
      text = 'GΔ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[8].click();
      document.getElementById("buttons").children[15].click();
      text = 'Gm7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[8].click();
      document.getElementById("buttons").children[16].click();
      text = 'G7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[8].click();
      document.getElementById("buttons").children[17].click();
      text = 'Gdim7'
    }

    /* G# chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, false, false, false])){
      document.getElementById("buttons").children[9].click();
      document.getElementById("buttons").children[14].click();
      text = 'G#Δ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false, false, false, false, false])){
      document.getElementById("buttons").children[9].click();
      document.getElementById("buttons").children[15].click();
      text = 'G#m7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false])){
      document.getElementById("buttons").children[9].click();
      document.getElementById("buttons").children[16].click();
      text = 'G#7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[9].click();
      document.getElementById("buttons").children[17].click();
      text = 'G#dim7'
    }

    /* A chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, false, false])){
      document.getElementById("buttons").children[10].click();
      document.getElementById("buttons").children[14].click();
      text = 'AΔ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false, false, false, false])){
      document.getElementById("buttons").children[10].click();
      document.getElementById("buttons").children[15].click();
      text = 'Am7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false, false, false])){
      document.getElementById("buttons").children[10].click();
      document.getElementById("buttons").children[16].click();
      text = 'A7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false])){
      document.getElementById("buttons").children[10].click();
      document.getElementById("buttons").children[17].click();
      text = 'Adim7'
    }

    /* A# chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, false])){
      document.getElementById("buttons").children[11].click();
      document.getElementById("buttons").children[14].click();
      text = 'A#Δ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false, false, false])){
      document.getElementById("buttons").children[11].click();
      document.getElementById("buttons").children[15].click();
      text = 'A#m7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false, false])){
      document.getElementById("buttons").children[11].click();
      document.getElementById("buttons").children[16].click();
      text = 'A#7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false, false, false])){
      document.getElementById("buttons").children[11].click();
      document.getElementById("buttons").children[17].click();
      text = 'A#dim7'
    }

    /* B chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false])){
      document.getElementById("buttons").children[12].click();
      document.getElementById("buttons").children[14].click();
      text = 'BΔ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false, false])){
      document.getElementById("buttons").children[12].click();
      document.getElementById("buttons").children[15].click();
      text = 'Bm7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false])){
      document.getElementById("buttons").children[12].click();
      document.getElementById("buttons").children[16].click();
      text = 'B7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false, false])){
      document.getElementById("buttons").children[12].click();
      document.getElementById("buttons").children[17].click();
      text = 'Bdim7'
    }

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

  resetInputs();
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
}

document.onkeydown = function(e) {
  if (keyboard.style.display == 'block' && !e.repeat && keys.indexOf(e.key) != -1){
    playNote( BASE_FREQ * Math.pow(2, keys.indexOf(e.key)/12))

    pressedKey(e.key);
    chords.preview.message = inText();
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
    if (input[k].chord == 'Δ'){
      if (note_labels.indexOf(note) == 0){
        console.log("The chord "+ note +"Δ is the tonic");
        place[k] = 1
      }

      else if (note_labels.indexOf(note) == 5) {
        console.log("The chord "+ note +"Δ is the subdominant");
        place[k] = 4
      }

      else{ place[k] = -1 }
    }

    else if (input[k].chord == '7') {
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
    if(chord_progOUT1 != null && chord_progOUT1.length != 0){
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
    if(chord_progOUT2 != null && chord_progOUT2.length != 0){
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


document.getElementById("padlock").addEventListener('click', function(el) {
    el.target.classList.toggle("fa-unlock");
    el.target.classList.toggle("fa-lock")
  })

switchToButtons()
resume()
