// Tone.js synth settings
const synth = new Tone.PolySynth(16, Tone.Synth);
synth.set({
  oscillator: {
    type: "sine"
  }
});

const vol = new Tone.Volume(-14);
synth.chain(vol, Tone.Master);

// Initialize empty sequencer
let sequencer = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let empty = sequencer.map(inner => inner.slice());
let bar1 = sequencer.map(inner => inner.slice());
let bar2 = sequencer.map(inner => inner.slice());
let bar3 = sequencer.map(inner => inner.slice());
let bar4 = sequencer.map(inner => inner.slice());

let play = false;
let selectedBar = 1;
let playingBar = 1;
let column = 0;

// Beats Per Minute
const BPM = 120;
// One column length in milliseconds
const semiquaver = (BPM / 60 / 16) * 1000;

// Demo song (Bokurano Network)
const demo = JSON.parse(
  '{"bar1":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0],[0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],[1,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],"bar2":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],[0,0,0,0,0,0,1,1,0,0,1,0,1,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0],[0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],[1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0]],"bar3":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0],[0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],[1,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],"bar4":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],[0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0],[0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0],[1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0]]}'
);

// C-major scale
const scale = [
  "C4",
  "D4",
  "E4",
  "F4",
  "G4",
  "A4",
  "B4",
  "C5",
  "D5",
  "E5",
  "F5",
  "G5",
  "A5",
  "B5",
  "C6",
  "D6"
];

// Add click handlers to notes
Array.from(document.getElementsByClassName("note")).map(note => {
  note.onclick = () => {
    const column = Number.parseInt(note.parentElement.id);
    const row = Number.parseInt([...note.parentElement.children].indexOf(note));
    changeNote(row, column, note, sequencer[row][column]);
  };
});

// Add click handlers to bars
Array.from(document.getElementsByClassName("barButton")).map(bar => {
  bar.onclick = () => {
    const id = bar.id;
    removeClass(document.getElementById(`bar${selectedBar}`), "selected");
    addClass(bar, "selected");
    saveCurrentBar();
    selectedBar = Number.parseInt(id.substring(3, 4));
    switchBar();
  };
});

// Add click handler for clear button
document.getElementById("clear").onclick = () => {
  clearSequencer();
};

// Add click handler for clear button
document.getElementById("demo").onclick = () => {
  loadDemo();
};

const loadDemo = () => {
  if (!play) {
    // Go to bar 1
    document.getElementById('bar1').click();
    bar1 = demo["bar1"];
    bar2 = demo["bar2"];
    bar3 = demo["bar3"];
    bar4 = demo["bar4"];
    startSequencer();
    repaintSequencer();
  } else {
    clearSequencer();
    repaintSequencer();
    setTimeout(loadDemo, 200);
  }
};

const clearSequencer = () => {
  play = false;
  sequencer = empty.map(inner => inner.slice());
  bar1 = empty.map(inner => inner.slice());
  bar2 = empty.map(inner => inner.slice());
  bar3 = empty.map(inner => inner.slice());
  bar4 = empty.map(inner => inner.slice());
  repaintSequencer();
  stopSequencer();
};

const switchBar = () => {
  sequencer = getCurrentBar(selectedBar);
  repaintSequencer();
};

const saveCurrentBar = () => {
  switch (selectedBar) {
    case 1:
      bar1 = sequencer.map(inner => inner.slice());
      break;
    case 2:
      bar2 = sequencer.map(inner => inner.slice());
      break;
    case 3:
      bar3 = sequencer.map(inner => inner.slice());
      break;
    case 4:
      bar4 = sequencer.map(inner => inner.slice());
  }
};

const isEmpty = bar => {
  const sum = bar
    .reduce((a, b) => {
      return a.concat(b);
    })
    .reduce((a, b) => {
      return a + b;
    });
  return sum === 0;
};

const allEmpty = bars => {
  let empty = true;
  bars.map(bar => {
    if (!isEmpty(bar)) {
      empty = false;
    }
  });
  return empty;
};

// Change note value in sequencer
const changeNote = (x, y, note, value) => {
  sequencer = getCurrentBar(selectedBar);
  sequencer[x][y] = value === 1 ? 0 : 1;
  saveCurrentBar();

  repaintSequencer();

  if (!isEmpty(sequencer) && !play) {
    startSequencer();
  } else if (allEmpty([bar1, bar2, bar3, bar4]) && play) {
    stopSequencer();
  }
};

const stopSequencer = () => {
  console.log("Sequencer stopped");

  play = false;
  column = 0;
  paintColumn();
};

const repaintSequencer = () => {
  Array.from(document.getElementsByClassName("note")).map(note => {
    const y = note.parentElement.id;
    const x = [...note.parentElement.children].indexOf(note);
    if (sequencer[x][y] === 0) {
      removeClass(note, "on");
      addClass(note, "off");
    } else {
      removeClass(note, "off");
      addClass(note, "on");
    }
  });
};

const startSequencer = () => {
  console.log("Sequencer started");

  // ALWAYS start with the first bar
  sequencer = bar1.map(inner => inner.slice());
  playingBar = 1;

  play = true;
  handleColumn(sequencer);
};

const getCurrentBar = index => {
  switch (index) {
    case 1:
      return bar1.map(inner => inner.slice());
    case 2:
      return bar2.map(inner => inner.slice());
    case 3:
      return bar3.map(inner => inner.slice());
    case 4:
      return bar4.map(inner => inner.slice());
  }
};

const handleColumn = sequencer => {
  if (play) {
    // Paint column
    paintColumn();

    let columnArray = sequencer.map(r => r[column]).reverse();
    let nextBars = [];

    switch (playingBar) {
      case 1:
        nextBars = [bar2, bar3, bar4];
        break;
      case 2:
        nextBars = [bar3, bar4];
        break;
      case 3:
        nextBars = [bar4];
        break;
      case 4:
        nextBars = [bar1, bar2, bar3, bar4];
    }

    // Sequencer has reached its end
    if (column === 15) {
      if (!allEmpty(nextBars)) {
        playingBar === 4 ? (playingBar = 1) : playingBar++;
      } else {
        playingBar = 1;
      }
      column = 0;
    } else {
      column++;
    }

    let noteArray = [];
    columnArray.map((note, i) => {
      if (note === 1) {
        noteArray.push(scale[i]);
      }
    });

    // Print sequencer data as JSON
    /*console.log(
      JSON.stringify({
        bar1,
        bar2,
        bar3,
        bar4
      })
    );*/

    synth.triggerAttackRelease(noteArray, "16n");

    setTimeout(() => {
      handleColumn(getCurrentBar(playingBar));
    }, semiquaver);
  }
};

const paintColumn = () => {
  Array.from(document.getElementsByClassName("note")).map(note => {
    if (
      column === Number.parseInt(note.parentElement.id) &&
      play &&
      selectedBar === playingBar
    ) {
      addClass(note, "playing");
    } else {
      removeClass(note, "playing");
    }
  });
};

const addClass = (element, className) => {
  if (element.classList) {
    element.classList.add(className);
  } else {
    element.className += " " + className;
  }
};

const removeClass = (element, className) => {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    element.className = element.className.replace(
      new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"),
      " "
    );
  }
};
