const BASE_FREQ = 261.63                              //frequency of C4
keys            = "zsxdcvgbhnjmq2w3er5t6y7ui";
notesB          = ['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B']
notesD          = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

const keySel    = document.getElementById("keySel");

var audio = new AudioContext()
var gains = {}
var keyIndex = 0
var chord_progOUT1
var chord_progOUT2
var chord_progOUT3

var chords = new Vue({
  el: '#root',

  data: {

    Wkeys:      [
                  {text: 'z', clicked: false, src: "./audio/C4.wav"},
                  {text: 'x', clicked: false, src: "./audio/D4.wav"},
                  {text: 'c', clicked: false, src: "./audio/E4.wav"},
                  {text: 'v', clicked: false, src: "./audio/F4.wav"},
                  {text: 'b', clicked: false, src: "./audio/G4.wav"},
                  {text: 'n', clicked: false, src: "./audio/A4.wav"},
                  {text: 'm', clicked: false, src: "./audio/B4.wav"},
                  {text: 'q', clicked: false, src: "./audio/C5.wav"},
                  {text: 'w', clicked: false, src: "./audio/D5.wav"},
                  {text: 'e', clicked: false, src: "./audio/E5.wav"},
                  {text: 'r', clicked: false, src: "./audio/F5.wav"},
                  {text: 't', clicked: false, src: "./audio/G5.wav"},
                  {text: 'y', clicked: false, src: "./audio/A5.wav"},
                  {text: 'u', clicked: false, src: "./audio/B5.wav"},
                  {text: 'i', clicked: false, src: "./audio/C6.wav"},
                ],

    Bkeys:      [
                  {text: 's', activeClass: 'black key', clicked: false, src: "./audio/C%234.wav"},
                  {text: 'd', activeClass: 'black key', clicked: false, src: "./audio/D%234.wav"},
                  {text: '',  activeClass: 'space',     clicked: false},
                  {text: 'g', activeClass: 'black key', clicked: false, src: "./audio/F%234.wav"},
                  {text: 'h', activeClass: 'black key', clicked: false, src: "./audio/G%234.wav"},
                  {text: 'j', activeClass: 'black key', clicked: false, src: "./audio/A%234.wav"},
                  {text: '',  activeClass: 'space',     clicked: false},
                  {text: '2', activeClass: 'black key', clicked: false, src: "./audio/C%235.wav"},
                  {text: '3', activeClass: 'black key', clicked: false, src: "./audio/D%235.wav"},
                  {text: '',  activeClass: 'space',     clicked: false},
                  {text: '5', activeClass: 'black key', clicked: false, src: "./audio/F%235.wav"},
                  {text: '6', activeClass: 'black key', clicked: false, src: "./audio/G%235.wav"},
                  {text: '7', activeClass: 'black key', clicked: false, src: "./audio/A%235.wav"},
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
                  {text:'B♭', active: false},
                  {text:'B',  active: false}
                ],

    notes:       [
                  {text:'C',  active: false,  hide: false},
                  {text:'D♭', active: false,  hide: true},
                  {text:'D',  active: false,  hide: false},
                  {text:'E♭', active: false,  hide: true},
                  {text:'E',  active: false,  hide: false},
                  {text:'F',  active: false,  hide: false},
                  {text:'F#', active: false,  hide: true},
                  {text:'G',  active: false,  hide: false},
                  {text:'A♭', active: false,  hide: true},
                  {text:'A',  active: false,  hide: false},
                  {text:'B♭', active: false,  hide: true},
                  {text:'B',  active: false,  hide: false}
                ],

    chords:     [
                  {text:'Δ',    active: false},
                  {text:'m7',   active: false},
                  {text:'7',    active: false},
                  {text:'dim7', active: false},
                ],

    durations:  [
                  {text:'𝅝',  value:1,    active: false, class: "1"   },
                  {text:'𝅗𝅥',  value:1/2,  active: false, class: "1/2" },
                  {text:'♩',  value:1/4,  active: false, class: "1/4" },
                  {text:'𝅘𝅥𝅮',  value:1/8,  active: false, class: "1/8" },
                  {text:'𝅘𝅥𝅯', value:1/16,  active: false, class: "1/16"},
                  {text:'𝅘𝅥𝅰', value:1/32,  active: false, class: "1/32"},
                ],

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

        if (keyIndex == 0 || keyIndex == 2 || keyIndex == 4 || keyIndex == 6 || keyIndex == 7 || keyIndex == 9 || keyIndex == 11) {

          for (var i=0; i < notesD.length; i++) {
            chords.notes.push(
              { text: notesD[(i + keyIndex) % notesD.length],
                active: false,
                hide: true
              }
            );

            if (i==0 || i==2 || i==4 || i==5 || i==7 || i==9 || i==11){
              chords.notes[i].hide = false;
            }
          }
        }
        else {
          for (var i=0; i < notesB.length; i++) {
            chords.notes.push(
              { text: notesB[(i + keyIndex) % notesB.length],
                active: false,
                hide: true
              }
            );

            if (i==0 || i==2 || i==4 || i==5 || i==7 || i==9 || i==11){
              chords.notes[i].hide = false;
            }
          }
        }
        resetInputs();
        chords.activate(el, chords.keys)
        document.getElementById("padlock").click();
      }
    },

    playKey: function(el) {
      if (document.getElementById("keyboard").style.display == 'block' && keys.indexOf(el.text) != -1 && !el.clicked){
        var audio = new Audio(el.src);
        audio.play();
      }
    },

    activeKey: function(el) {
      el.clicked = !el.clicked;
      preview.message = inText();
    }
  }
})

var caption = new Vue({
  el: '#caption',
  data: {
    caption: [
                {text:  'Δ = major 7th'},
                {text:  'm7 = minor 7th'},
                {text:  '7 = dominant 7th'},
                {text:  'dim7 = diminished 7th'}
                /* Add iteration description */
              ]
  }
})

var preview = new Vue({
  el:   '#inputOpt',
  data: { message:  '',
          error: []
        }
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

    /* B♭ chords */
    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +11)%12].click();
      document.getElementById("buttons").children[14].click();
      chord = 'B♭Δ'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +11)%12].click();
      document.getElementById("buttons").children[15].click();
      chord = 'B♭m7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +11)%12].click();
      document.getElementById("buttons").children[16].click();
      chord = 'B♭7'
    }

    else if (JSON.stringify(arr) == JSON.stringify([false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false, false, false])){
      document.getElementById("buttons").children[(12 - keyIndex +11)%12].click();
      document.getElementById("buttons").children[17].click();
      chord = 'B♭dim7'
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

    if (chord == null)
      chord = preview.message.split(' ')[0];

    text = chord;

    chords.durations.forEach((time) => {
      if (time.active){
        text += ' (' + time.text + ')';
      }
    });

    return text
  }
}

function addToStdin() {
  previewText = inText()
  if (previewText != ''){
    if (chords.keys.find( (el) => el.active == true) == null) {
      preview.error.push('Key missing: select a key before add a new element');
      setTimeout(() => { preview.error.shift(); }, 3000)
    }

    else if (chords.notes.find( (el) => el.active == true) == null) {
      preview.error.push('Note missing: select a note before add a new element');
      setTimeout(() => { preview.error.shift(); }, 3000)
    }

    else if (chords.chords.find( (el) => el.active == true) == null ) {
      preview.error.push('Chord missing: select a chord before add a new element');
      setTimeout(() => { preview.error.shift(); }, 3000)
    }

    else if (chords.durations.find( (el) => el.active == true) == null ) {
      preview.error.push('Duration missing: select a duration before add a new element');
      setTimeout(() => { preview.error.shift(); }, 3000)
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
    preview.error.push("Empty input")
    setTimeout(() => { preview.error.shift(); }, 3000)
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

  preview.message = '';
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
    var el = chords.Wkeys.find(key => key.text == e.key)
    if (el == null)
      el = chords.Bkeys.find(key => key.text == e.key)
    var audio = new Audio(el.src);
    audio.play();

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

function chord_prog_1(input, note_labels){
  var place = chord_prog_type(input, note_labels);
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

function chord_prog_2(input, note_labels){
  var place = chord_prog_type(input, note_labels);
  var chord_progOUT = []
  for(var k=0; k < input.length; k++){
    if (place[k] == 1 && k != input.length-1) {
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

function chord_prog_3(input, note_labels) {
  var place = chord_prog_type(input, note_labels);
  var chord_progOUT = []
  for(var k=0; k < input.length; k++){
      if (place[k] == 5){
        console.log(input[k]);
        el1 = {note: note_labels[2], chord: '7', duration: input[k].duration/2};
        el2 = {note: input[k].note, chord: input[k].chord, duration: input[k].duration/2};
        chord_progOUT.push(el1);
        chord_progOUT.push(el2);
      }
      else if (place[k] == 1 && k != input.length-1) {
        console.log(input[k]);
        el1 = {note: input[k].note, chord: input[k].chord, duration: input[k].duration/2};
        el2 = {note: note_labels[9], chord: 'm7', duration: input[k].duration/2}
        chord_progOUT.push(el1);
        chord_progOUT.push(el2);
      }
      else {console.log(input[k], place[k]); chord_progOUT.push(input[k]); }
  }

  return chord_progOUT;
}

function chord_prog_4(input, note_labels){
  var place = chord_prog_type(input, note_labels);
  var chord_progOUT = []

  for(var k=0; k < input.length; k++) {
    if (place[k] == 5)
      chord_progOUT.push({note: note_labels[1], chord: '7', duration: input[k].duration});
    else { chord_progOUT.push(input[k]); }
  }

  return chord_progOUT;
}

function runCode() {
  note_labels = []
  chords.notes.forEach((key) => note_labels.push(key.text))
  var ind = []

  // Add the minor substitution before the dominant chord (II - V - I)
  chord_progOUT1 = chord_prog_1(chords.stdin, note_labels)

  // Tonic to minor parallel substitution (I- iv- V)
  chord_progOUT2 = chord_prog_2(chord_progOUT1, note_labels)

  chord_progOUT3 = chord_prog_3(chords.stdin, note_labels)

  chord_progOUT4 = chord_prog_4(chord_progOUT3, note_labels)

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
      content.id = "output";
      for(k=0; k < chord_progOUT3.length; k++){
        content.innerText += chord_progOUT3[k].note + chord_progOUT3[k].chord +
          "(1/" + (1/chord_progOUT3[k].duration) + ") "
      }
      stdout.appendChild(content);

      result = document.getElementById("result");
      result.showModal();
    }
  }
  if(int == 4) {
    if(chord_progOUT4 != null && chord_progOUT4.length != 0){
      stdout = document.getElementById("stdout");
      if (stdout.firstChild != null)
        stdout.removeChild(stdout.firstChild);

      content = document.createElement("div");
      for(k=0; k < chord_progOUT4.length; k++){
        content.innerText += chord_progOUT4[k].note + chord_progOUT4[k].chord +
          "(1/" + (1/chord_progOUT4[k].duration) + ") "
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
  document.querySelector("#complexity").value = 1
  chords.stdin = [];
  resetInputs();
  console.log("Reset all the input");
}

function saveOutput() {
  var textToSave = document.getElementById("stdout").firstChild.innerText;
  var hiddenElement = document.createElement('a');

  hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'complexSequence.txt';
  hiddenElement.click();
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
