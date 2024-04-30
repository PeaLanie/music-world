window.addEventListener("load", eventWindowLoaded, false);

function eventWindowLoaded() {
  canvasApp();
}

// function canvasSupport () {
//     return Modernizr.canvas;
// }

function canvasApp() {
  //   if (!canvasSupport()) {
  //     return;
  //   } else {
  //     var theCanvas = document.getElementById("canvas");
  //     var context = theCanvas.getContext("2d");
  //   }
  const theCanvas = document.getElementById("canvasMain");
  const c = theCanvas.getContext("2d");

  theCanvas.setAttribute("width", "497");
  theCanvas.setAttribute("height", "647");

  const notesObjAll = {
    40: "DH",
    72: "CH",
    103: "BH",
    135: "AH",
    167: "GH",
    198: "FM",
    229: "EM",
    261: "DM",
    292: "CM",
    324: "BM",
    356: "AM",
    387: "GM",
    419: "FL",
    451: "EL",
    482: "DL",
    513: "CL",
    545: "BL",
    576: "AL",
    608: "GL",
  };
  const notesObjOnStaff = {
    198: "FM",
    229: "EM",
    261: "DM",
    292: "CM",
    324: "BM",
    356: "AM",
    387: "GM",
    419: "FL",
    451: "EL",
  };
  const notesObjOutOfStaff = {
    40: "DH",
    72: "CH",
    103: "BH",
    135: "AH",
    167: "GH",
    482: "DL",
    513: "CL",
    545: "BL",
    576: "AL",
    608: "GL",
  };

  //localStorage.clear();
  const soundControl = document.querySelector(".soundControl");
  let highScore = document.querySelector(".highscore");
  let modeBtnsClassList = [];
  let modeButtons = document.querySelectorAll(".modeButton");
  let storedClassList;
  let currentModeBtnStored;
  let notesList;
  console.log()
  
  if (localStorage.length === 0) {
    modeButtons.forEach((btn) => {
      modeBtnsClassList.push(btn.className);
    })
    localStorage.setItem("highscore", 0);
    localStorage.setItem("currentMode", JSON.stringify(modeBtnsClassList));
    localStorage.setItem("mute", "MUTE")
    soundControl.textContent = localStorage.mute;
  } else {
    // RETREIVING PREVIOUS MODE FROM THE LOCAL STORAGE *******
  
  storedClassList = JSON.parse(localStorage.currentMode);

  storedClassList.findIndex((cls, index) => {
    if (cls === "modeButton selectedMode") {
      currentModeBtnStored = modeButtons[index];
      currentModeBtnStored.className = cls;

      modeButtons.forEach((btn) => {
        if (btn.className === currentModeBtnStored.className) {
          changeNotes(btn);
        }
      });
    } else {
      modeButtons[index].className = cls;
    }
  });

  soundControl.textContent = localStorage.mute;

  }

  highScore.textContent = `High Score: ${localStorage.getItem("highscore")}`;

  
  let randomNum;
  let dy;
  let note;
  let btns = document.querySelectorAll(".btn");
  
  let selectedEl;
  const sideBar = document.querySelector(".sideBar");
  const wrapper = document.querySelector(".wrapper");
  const displayAllNotesEl = document.querySelector(".displayNotesButton");
  const modeBtnDiv = document.querySelector(".modeBtnDiv");
  const controlsDiv = document.querySelector(".btnsAndSoundControl");
  const autoNoteBtn = document.querySelector(".autoNoteBtn");
  const timeInterval = document.querySelector(".time");
  const upArrow = document.querySelector(".up");
  const downArrow = document.querySelector(".down");
  const timeIntervalChangeDiv = document.querySelector(".interval");
  let score = 0;
  let heart = 3;
  let newHighScore = parseInt(localStorage.highscore);
  let noteSound;
  let src;
  let lifeSpanEl = document.querySelector(".lifespan");
  lifeSpanEl.textContent = `Life: ${heart}`;
  let scoreEl = document.querySelector(".current-score");
  scoreEl.textContent = `Score: ${score}`;

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      
      selectedEl = document.querySelectorAll(".selectedMode");
      if (note.includes(btn.id)) {
        // IF THE NOTE IS CORRECT ********
        score += 5;

        if (soundControl.textContent != "UNMUTE") {
          src = `audio/${note.toLowerCase()}.ogg`;
          noteSound = new Audio();
          noteSound.setAttribute("src", `${src}`);
          noteSound.play();
        }

        sideBar.style.backgroundColor = "#adffad";
        sideBar.style.borderLeft = "7px solid green";
        displayAllNotesEl.style.border = "2px solid green";
        selectedEl.forEach((el) => {
          el.className = "modeButton selectedMode greenHighlight";
        });
        modeBtnDiv.style.border = "2px solid green";

        scoreEl.textContent = `Score: ${score}`;

        c.clearRect(0, 0, theCanvas.width, theCanvas.height);

        drawNote(notesObjAll, notesList);
        

        setTimeout(() => {
          sideBar.style.backgroundColor = "#d1d1d1";
          sideBar.style.borderLeft = "7px solid black";
          displayAllNotesEl.style.border = "2px solid black";
          selectedEl.forEach((el) => {
            el.className = "modeButton selectedMode";
          });
          modeBtnDiv.style.border = "2px solid black";
          
        }, 1000);
      } else {
        // IF THE NOTE IS WRONG ********
        heart -= 1;
        lifeSpanEl.textContent = `Life: ${heart}`;

        if (heart === 0) {
          newHighScore = parseInt(localStorage.highscore);

          makePopUp(score, newHighScore, wrapper);

          if (score > newHighScore) {
            localStorage.setItem("highscore", score);
          }

          let closeBtn = document.querySelector(".closeBtn");
          let popUpEl = document.querySelector(".popup");

          closeBtn.addEventListener("click", () => {
            score = 0;
            heart = 3;
            highScore.textContent = `High Score: ${localStorage.getItem(
              "highscore"
            )}`;
            scoreEl.textContent = `Score: ${score}`;
            lifeSpanEl.textContent = `Life: ${heart}`;
            popUpEl.remove();
            c.clearRect(0, 0, theCanvas.width, theCanvas.height);
            drawNote(notesObjAll, notesList);
            
          });
        } else {
          sideBar.style.backgroundColor = "#ffbdbd";
          sideBar.style.borderLeft = "7px solid red";
          displayAllNotesEl.style.border = "2px solid red";
          selectedEl.forEach((el) => {
            el.className = "modeButton selectedMode redHighlight";
          });
          modeBtnDiv.style.border = "2px solid red";

          setTimeout(() => {
            sideBar.style.backgroundColor = "#d1d1d1";
            sideBar.style.borderLeft = "7px solid black";
            displayAllNotesEl.style.border = "2px solid black";
            selectedEl.forEach((el) => {
              el.className = "modeButton selectedMode";
            });
            modeBtnDiv.style.border = "2px solid black";
          }, 1000);
        }
      }
    });
  });

  modeButtons.forEach((btn) => {
    // MODE BUTTON LOOP ***********
    btn.addEventListener("click", (e) => {
      let cl = e.target.className;
      if (autoNoteBtn.className !== "autoNoteBtn selectedMode") {
        btn.className = "modeButton selectedMode";
      }

      if (cl !== btn.className || autoNoteBtn.className !== "autoNoteBtn selectedMode") {
        modeBtnsClassList = [];

        modeButtons.forEach((buttons) => {
          if (buttons != btn) {
            buttons.className = "modeButton";
          }
          modeBtnsClassList.push(buttons.className);
        });

        localStorage.setItem("currentMode", JSON.stringify(modeBtnsClassList));

        if (displayAllNotesEl.className === "displayNotesButton selectedMode") {
          // IF "DISPLAY NOTES" BUTTON IS SELECTED ***************
          c.clearRect(0, 0, theCanvas.width, theCanvas.height);

          storedClassList = JSON.parse(localStorage.currentMode);

          storedClassList.findIndex((cls, index) => {
            // BUTTONS LOOP *****
            if (cls === "modeButton selectedMode") {
              // SELECTED BUTTON
              currentModeBtnStored = modeButtons[index];
              displayAllNotes(currentModeBtnStored);
              if (currentModeBtnStored.id == "all") {
                notesList = Object.keys(notesObjAll);
              } else if (currentModeBtnStored.id == "wsn") {
                notesList = Object.keys(notesObjOnStaff);
              } else if (currentModeBtnStored.id == "osn") {
                notesList = Object.keys(notesObjOutOfStaff);
              }
            }
          });
        } else {
          // IF "DISPLAY NOTES" BUTTON IS NOT SELECTED *******
          if (score > 0 || heart < 3) {
            newHighScore = parseInt(localStorage.highscore);
            
            if (score > newHighScore) {
              localStorage.setItem("highscore", score);
            }
            
            makePopUp(score, newHighScore, wrapper);
            let closeBtn = document.querySelector(".closeBtn");
            let popUpEl = document.querySelector(".popup");

            closeBtn.addEventListener("click", () => {
              score = 0;
              heart = 3;
              highScore.textContent = `High Score: ${localStorage.getItem(
                "highscore"
              )}`;
              scoreEl.textContent = `Score: ${score}`;
              lifeSpanEl.textContent = `Life: ${heart}`;
              popUpEl.remove();
              c.clearRect(0, 0, theCanvas.width, theCanvas.height);
              modeButtons.forEach((btn) => {
                if (btn.className == "modeButton selectedMode") {
                  changeNotes(btn);
                }
              });
            });
          } else {
            c.clearRect(0, 0, theCanvas.width, theCanvas.height);
            changeNotes(btn);
          }
        }
      }
    });
    modeBtnsClassList.push(btn.className);
  });

  soundControl.addEventListener("click", () => {
    if (soundControl.textContent !== "UNMUTE") {
      soundControl.textContent = "UNMUTE";
    } else {
      soundControl.textContent = "MUTE";
    }
    localStorage.setItem("mute", soundControl.textContent)
  })
  
  
  
  // DISPLAY BUTTON EVENTS ********************************
  displayAllNotesEl.addEventListener("click", (e) => {
    if (autoNoteBtn.className === "autoNoteBtn selectedMode") {
      clearInterval(countdownID);
      clearInterval(intervalID);
      timeInterval.textContent = time/1000;
      timeIntervalChangeDiv.style.display = "flex";
      autoNoteBtn.className = "autoNoteBtn";
    }
    let btn = e.target;

    if (btn.className === "displayNotesButton") {
      // SELECTING ******
      btn.className = "displayNotesButton selectedMode";
      c.clearRect(0, 0, 270, theCanvas.height);

      storedClassList = JSON.parse(localStorage.currentMode);

      storedClassList.findIndex((cls, index) => {
        if (cls === "modeButton selectedMode") {
          currentModeBtnStored = modeButtons[index];
          displayAllNotes(currentModeBtnStored);
        }
      });

      controlsDiv.style.display = "none";
    } else {
      // UNSELECTING ******************************************
      c.clearRect(0, 0, 310, theCanvas.height);
      drawOpenNotes();
      btn.className = "displayNotesButton";
      controlsDiv.style.display = "flex";
    }
  });

  let time = 10000;
  let countDownStartPoint;
  timeInterval.textContent = time/1000;
  let intervalID;
  let countdownID;

  autoNoteBtn.addEventListener("click", (e) => {
    if (displayAllNotesEl.className === "displayNotesButton selectedMode") {
      c.clearRect(0, 0, theCanvas.width, theCanvas.height);
      drawOpenNotes();
      displayAllNotesEl.className = "displayNotesButton";
    }
    c.clearRect(270, 0, theCanvas.width - 270, theCanvas.height);
    if (e.target.className === "autoNoteBtn") {
      e.target.className = "autoNoteBtn selectedMode";
      timeIntervalChangeDiv.style.display = "none";
      controlsDiv.style.display = "none";
      
      if (score > 0 || heart < 3) {
        newHighScore = parseInt(localStorage.highscore);
        
        if (score > newHighScore) {
          localStorage.setItem("highscore", score);
        }
        
        makePopUp(score, newHighScore, wrapper);
        let closeBtn = document.querySelector(".closeBtn");
        let popUpEl = document.querySelector(".popup");
        
        closeBtn.addEventListener("click", () => {

          intervalID = setInterval(setTimeInterval, time);

          countdownID = setInterval(() => {
            countDownStartPoint = parseInt(timeInterval.textContent);
            countDownStartPoint -= 1;
            if (countDownStartPoint < 1) {
              timeInterval.textContent = time/1000;
            } else {
              timeInterval.textContent = countDownStartPoint;
            }
          }, 1000)

          score = 0;
          heart = 3;
          highScore.textContent = `High Score: ${localStorage.getItem(
            "highscore"
          )}`;
          scoreEl.textContent = `Score: ${score}`;
          lifeSpanEl.textContent = `Life: ${heart}`;
          popUpEl.remove();
        });
      } else {
        
        countdownID = setInterval(() => {
          countDownStartPoint = parseInt(timeInterval.textContent);
          countDownStartPoint -= 1;
          
          if (countDownStartPoint < 1) {
            timeInterval.textContent = time/1000;
          } else {
            timeInterval.textContent = countDownStartPoint;
          }
        }, 1000)
        intervalID = setInterval(setTimeInterval, time);
      }

    } else {
      e.target.className = "autoNoteBtn";
      clearInterval(intervalID);
      clearInterval(countdownID);
      drawNote(notesObjAll, notesList);
      timeIntervalChangeDiv.style.display = "flex";
      controlsDiv.style.display = "flex";
      timeInterval.textContent = time/1000;
    }
  })

  upArrow.addEventListener("click", () => {
    if (time < 10000) {
      time += 1000;
    }
    timeInterval.textContent = time/1000;
  })
  downArrow.addEventListener("click", () => {
    if (time > 2000) {
      time -= 1000;
    }
    timeInterval.textContent = time/1000;
  })
  

  // FUNCTIONS *******************************************************
  function drawNote(obj, arr) {

    drawOpenNotes();

    setTimeout(() => {
      randomNum = Math.floor(Math.random() * arr.length);
      dy = arr[randomNum];
  
      c.beginPath();
      c.stokeStyle = "black";
      c.lineWidth = 15;
      c.arc(350, dy, 22, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);
      c.stroke();
      c.closePath();
  
      note = obj[dy];
    }, 1000)
  }

  function makePopUp(score, highscore, wrapper) {
    let popUp = document.createElement("div");
    popUp.className = "popup";

    let popUpMsg = document.createElement("div");
    popUpMsg.className = "popUpMsg";

    let gameOver = document.createElement("h1");
    gameOver.style.color = "red";
    gameOver.textContent = "Game Over!";

    let scoreEl = document.createElement("h2");
    scoreEl.textContent = `Score: ${score}`;

    let closeEl = document.createElement("button");
    closeEl.textContent = "CLOSE";
    closeEl.className = "closeBtn";

    popUpMsg.appendChild(gameOver);
    popUpMsg.appendChild(scoreEl);

    if (score > parseInt(highscore)) {
      let highScore = document.createElement("h2");
      highScore.textContent = `New High Score`;
      highScore.style.color = "green";
      popUpMsg.appendChild(highScore);
    }

    popUpMsg.appendChild(closeEl);

    popUp.appendChild(popUpMsg);

    wrapper.appendChild(popUp);
  }

  function displayAllNotes(btn) {
    if (btn.id == "all") {
      setTimeout(() => {
        c.beginPath();
        c.font = "48px arial";
        c.fillStyle = "red";
        c.fillText("D", 220, 58);
        c.fillText("C", 270, 89);
        c.fillText("B", 220, 120);
        c.fillText("A", 270, 148);
        c.fillText("G", 220, 185);
        c.fillText("F", 270, 214);
        c.fillStyle = "blue";
        c.fillText("E", 220, 247);
        c.fillStyle = "red";
        c.fillText("D", 270, 278);
        c.fillText("C", 220, 311);
        c.fillText("B", 270, 342);
        c.fillStyle = "blue";
        c.fillText("A", 220, 374);
        c.fillStyle = "red";
        c.fillText("G", 270, 402);
        c.fillText("F", 220, 437);
        c.fillText("E", 270, 467);
        c.fillStyle = "blue";
        c.fillText("D", 220, 499);
        c.fillStyle = "red";
        c.fillText("C", 270, 532);
        c.fillText("B", 220, 563);
        c.fillText("A", 270, 590);
        c.fillStyle = "blue";
        c.fillText("G", 220, 625);
        c.fillStyle = "red";
        c.closePath();
      }, 100);
    } else if (btn.id == "wsn") {
      setTimeout(() => {
        c.beginPath();
        c.fillStyle = "red";
        c.font = "48px arial";
        c.fillText("F", 270, 214);
        c.fillStyle = "blue";
        c.fillText("E", 220, 247);
        c.fillStyle = "red";
        c.fillText("D", 270, 278);
        c.fillText("C", 220, 311);
        c.fillText("B", 270, 342);
        c.fillStyle = "blue";
        c.fillText("A", 220, 374);
        c.fillStyle = "red";
        c.fillText("G", 270, 402);
        c.fillText("F", 220, 437);
        c.fillText("E", 270, 467);
        c.closePath();
      }, 100);
    } else if (btn.id == "osn") {
      setTimeout(() => {
        c.beginPath();
        c.fillStyle = "red";
        c.font = "48px arial";
        c.fillText("D", 220, 58);
        c.fillText("C", 270, 89);
        c.fillText("B", 220, 120);
        c.fillText("A", 270, 148);
        c.fillText("G", 220, 185);
        c.fillStyle = "blue";
        c.fillText("D", 220, 499);
        c.fillStyle = "red";
        c.fillText("C", 270, 532);
        c.fillText("B", 220, 563);
        c.fillText("A", 270, 590);
        c.fillStyle = "blue";
        c.fillText("G", 220, 625);
        c.fillStyle = "red";
        c.closePath();
      }, 100);
    }
  }

  function changeNotes(btn) {
    if (btn.id == "all") {
      notesList = Object.keys(notesObjAll);

      drawNote(notesObjAll, notesList);
      
    } else if (btn.id == "wsn") {
      notesList = Object.keys(notesObjOnStaff);

      drawNote(notesObjAll, notesList);
      
    } else if (btn.id == "osn") {
      notesList = Object.keys(notesObjOutOfStaff);

      drawNote(notesObjAll, notesList);
      
    }
  }

  function timeLaps(obj) {
    let arr = Object.keys(obj);
    arr = arr.slice(3,);
    
    randomNum = Math.floor(Math.random() * arr.length);
      dy = arr[randomNum];
  
      c.beginPath();
      c.stokeStyle = "black";
      c.lineWidth = 15;
      c.arc(350, dy, 22, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);
      c.stroke();
      c.closePath();
  }

  function setTimeInterval() {
    c.clearRect(270, 0, theCanvas.width - 270, theCanvas.height);
    setTimeout(() => {
      timeLaps(notesObjAll)
    }, 100)
  }

  function drawOpenNotes() {
    c.beginPath();
    c.fillStyle = "blue";
    c.font = "48px arial";
    c.fillText("E", 220, 247);
    c.fillText("A", 220, 374);
    c.fillText("D", 220, 499);
    c.fillText("G", 220, 625);
    c.closePath();
  }
  
}
