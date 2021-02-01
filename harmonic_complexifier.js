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
var chord_progOUT3

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
                  {text:'D♭', active: false},
                  {text:'D',  active: false},
                  {text:'E♭', active: false},
                  {text:'E',  active: false},
                  {text:'F',  active: false},
                  {text:'F#', active: false},
                  {text:'G',  active: false},
                  {text:'A♭', active: false},
                  {text:'A',  active: false},
                  {text:'A#', active: false},
                  {text:'B',  active: false}
                ],

    notes:       [
                  {text:'C',  active: false},
                  {text:'D♭', active: false},
                  {text:'D',  active: false},
                  {text:'E♭', active: false},
                  {text:'E',  active: false},
                  {text:'F',  active: false},
                  {text:'F#', active: false},
                  {text:'G',  active: false},
                  {text:'A♭', active: false},
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

      preview.message = inText();
    },

    newKey: function(el) {
      if (document.getElementById("padlock").classList == "fa fa-unlock") {
        keyIndex = chords.keys.findIndex(key => key.text == el.text)

        chords.notes = [];
        for (var i=0; i < chords.keys.length; i++) {
          chords.notes.push(
            { text: chords.keys[(i + keyIndex) % chords.keys.length].text,
              active: false
            }
          )
        }
        resetInputs();
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
      preview.message = inText();
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

var preview = new Vue({
  el:   '#inputOpt',
  data: {message:  ''}
})

function inText() {

  if (buttons.style.display == 'block'){
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

  if (keyboard.style.display == 'block'){
    var chord
    var text
    keyIndex = chords.keys.findIndex(key => key.active == true)
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
      document.getElementById("buttons").children[(12 - keyIndex +1)%12].click();
      document.getElementById("buttons").children[14].click();
      chord = 'CΔ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([true, false, false, true, false, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false]) ||
            JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +1)%12].click();
      document.getElementById("buttons").children[15].click();
      chord = 'Cm7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([true, false, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false]) ||
            JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +1)%12].click();
      document.getElementById("buttons").children[16].click();
      chord = 'C7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([true, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]) ||
            JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +1)%12].click();
      document.getElementById("buttons").children[17].click();
      chord = 'Cdim7'
    }

    /* D♭ chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false]) ||
            JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, false, true])){
      document.getElementById("buttons").children[(12 - keyIndex +2)%12].click();
      document.getElementById("buttons").children[14].click();
      chord = 'D♭Δ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, true, false, false, true, false, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false]) ||
            JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false])){
      document.getElementById("buttons").children[(12 - keyIndex +2)%12].click();
      document.getElementById("buttons").children[15].click();
      chord = 'D♭m7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, true, false, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false]) ||
            JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false])){
      document.getElementById("buttons").children[(12 - keyIndex +2)%12].click();
      document.getElementById("buttons").children[16].click();
      chord = 'D♭7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, true, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false]) ||
            JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, true, false, false, true, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +2)%12].click();
      document.getElementById("buttons").children[17].click();
      chord = 'D♭dim7'
    }

    /* D chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +3)%12].click();
      document.getElementById("buttons").children[14].click();
      chord = 'DΔ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, true, false, false, true, false, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +3)%12].click();
      document.getElementById("buttons").children[15].click();
      chord = 'Dm7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +3)%12].click();
      document.getElementById("buttons").children[16].click();
      chord = 'D7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, true, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false]) ||
            JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, true, false, false, true, false])){
      document.getElementById("buttons").children[(12 - keyIndex +3)%12].click();
      document.getElementById("buttons").children[17].click();
      chord = 'Ddim7'
    }

    /* E♭ chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +4)%12].click();
      document.getElementById("buttons").children[14].click();
      chord = 'E♭Δ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +4)%12].click();
      document.getElementById("buttons").children[15].click();
      chord = 'E♭m7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +4)%12].click();
      document.getElementById("buttons").children[16].click();
      chord = 'E♭7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false]) ||
            JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, true, false, false, true])){
      document.getElementById("buttons").children[(12 - keyIndex +4)%12].click();
      document.getElementById("buttons").children[17].click();
      chord = 'E♭dim7'
    }

    /* E chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +5)%12].click();
      document.getElementById("buttons").children[14].click();
      chord = 'EΔ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +5)%12].click();
      document.getElementById("buttons").children[15].click();
      chord = 'Em7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +5)%12].click();
      document.getElementById("buttons").children[16].click();
      chord = 'E7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +5)%12].click();
      document.getElementById("buttons").children[17].click();
      chord = 'Edim7'
    }

    /* F chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +6)%12].click();
      document.getElementById("buttons").children[14].click();
      chord = 'FΔ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +6)%12].click();
      document.getElementById("buttons").children[15].click();
      chord = 'Fm7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +6)%12].click();
      document.getElementById("buttons").children[16].click();
      chord = 'F7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +6)%12].click();
      document.getElementById("buttons").children[17].click();
      chord = 'Fdim7'
    }

    /* F# chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +7)%12].click();
      document.getElementById("buttons").children[14].click();
      chord = 'F#Δ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +7)%12].click();
      document.getElementById("buttons").children[15].click();
      chord = 'F#m7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +7)%12].click();
      document.getElementById("buttons").children[16].click();
      chord = 'F#7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +7)%12].click();
      document.getElementById("buttons").children[17].click();
      chord = 'F#dim7'
    }

    /* G chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +8)%12].click();
      document.getElementById("buttons").children[14].click();
      chord = 'GΔ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +8)%12].click();
      document.getElementById("buttons").children[15].click();
      chord = 'Gm7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +8)%12].click();
      document.getElementById("buttons").children[16].click();
      chord = 'G7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +8)%12].click();
      document.getElementById("buttons").children[17].click();
      chord = 'Gdim7'
    }

    /* A♭ chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +9)%12].click();
      document.getElementById("buttons").children[14].click();
      chord = 'A♭Δ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +9)%12].click();
      document.getElementById("buttons").children[15].click();
      chord = 'A♭m7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +9)%12].click();
      document.getElementById("buttons").children[16].click();
      chord = 'A♭7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +9)%12].click();
      document.getElementById("buttons").children[17].click();
      chord = 'A♭dim7'
    }

    /* A chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +10)%12].click();
      document.getElementById("buttons").children[14].click();
      chord = 'AΔ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +10)%12].click();
      document.getElementById("buttons").children[15].click();
      chord = 'Am7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +10)%12].click();
      document.getElementById("buttons").children[16].click();
      chord = 'A7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +10)%12].click();
      document.getElementById("buttons").children[17].click();
      chord = 'Adim7'
    }

    /* A# chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +11)%12].click();
      document.getElementById("buttons").children[14].click();
      chord = 'A#Δ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +11)%12].click();
      document.getElementById("buttons").children[15].click();
      chord = 'A#m7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +11)%12].click();
      document.getElementById("buttons").children[16].click();
      chord = 'A#7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +11)%12].click();
      document.getElementById("buttons").children[17].click();
      chord = 'A#dim7'
    }

    /* B chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +12)%12].click();
      document.getElementById("buttons").children[14].click();
      chord = 'BΔ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +12)%12].click();
      document.getElementById("buttons").children[15].click();
      chord = 'Bm7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +12)%12].click();
      document.getElementById("buttons").children[16].click();
      chord = 'B7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +12)%12].click();
      document.getElementById("buttons").children[17].click();
      chord = 'Bdim7'
    }

    chords.durations.forEach((time) => {
      if (time.active){
        text = chord + ' (' + time.text + ')';
      }
    });

    /* for debug */
    /* console.log(arr) */

    if (chord != null)
      return text;
    else
      return preview.message
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

  preview.message = inText();
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
    preview.message = inText();
  }

  if (e.keyCode === 13){
    addToStdin();
  }

  if (e.keyCode === 8){
    undoIn();
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
      el2 = {note: note_labels[9], chord: 'm7', duration: input[k].duration/2}
      chord_progOUT.push(el1);
      chord_progOUT.push(el2);
    }
    else {
      chord_progOUT.push(input[k]);
    }
  }

  return chord_progOUT;
}

function chord_prog_3(input, note_labels, place) {
  var chord_progOUT = []
  for(var k=0; k < input.length; k++){
      if (place[k] == 5){
        el1 = {note: note_labels[2], chord: '7', duration: input[k].duration/2};
        el2 = {note: input[k].note, chord: input[k].chord, duration: input[k].duration/2};
        chord_progOUT.push(el1);
        chord_progOUT.push(el2);
      }
      else if (place[k] == 1) {
        el1 = {note: input[k].note, chord: input[k].chord, duration: input[k].duration/2};
        el2 = {note: note_labels[9], chord: 'm7', duration: input[k].duration/2}
        chord_progOUT.push(el1);
        chord_progOUT.push(el2);
      }
      else { chord_progOUT.push(input[k]); }
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

  chord_progOUT3 = chord_prog_3(chords.stdin, note_labels, place)

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
      for(k=0; k < chord_progOUT2.length; k++){
        content.innerText += chord_progOUT2[k].note + chord_progOUT2[k].chord +
          "(1/" + (1/chord_progOUT2[k].duration) + ") "
      }
      stdout.appendChild(content);

      result = document.getElementById("result");
      result.showModal();
    }
  }
  if(int == 3) {
    if(chord_progOUT3 != null && chord_progOUT3.length != 0){
      stdout = document.getElementById("stdout");
      if (stdout.firstChild != null)
        stdout.removeChild(stdout.firstChild);

      content = document.createElement("div");
      for(k=0; k < chord_progOUT3.length; k++){
        content.innerText += chord_progOUT3[k].note + chord_progOUT3[k].chord +
          "(1/" + (1/chord_progOUT2[3].duration) + ") "
      }
      stdout.appendChild(content);

      result = document.getElementById("result");
      result.showModal();
    }
  }
}

function reset() {
  w = Array.from(document.querySelector("#keyboard").children[0].children)
  b = Array.from(document.querySelector("#keyboard").children[1].children)
  a = w.concat(b);
  a.forEach((e) => e.classList.remove("active"));
  chords.keys.forEach((key) => key.active=false);
  document.querySelector("#padlock").className="fa fa-unlock";
  chords.stdin = [];
  resetInputs();
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
