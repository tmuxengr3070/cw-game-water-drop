// Variables to control game state
let gameRunning = false;
let dropMaker;
let score = 0;
let timer = 30;
let timerInterval;

// Mode state
let mode = "normal"; // default mode
let dropSpeed = "4s"; // default drop speed
let winScore = 22; // default win score

// Mode button/dropdown logic
const modeBtn = document.getElementById("mode-btn");
const modeDropdown = document.getElementById("mode-dropdown");
modeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  modeDropdown.classList.add("show");
});
document.querySelectorAll(".mode-option").forEach(opt => {
  opt.addEventListener("click", (e) => {
    mode = e.target.getAttribute("data-mode");
    // Set timer, drop speed, win score based on mode
    if (mode === "easy") {
      timer = 45;
      dropSpeed = "6s";
      winScore = 22;
    } else if (mode === "normal") {
      timer = 35;
      dropSpeed = "5s";
      winScore = 25;
    } else if (mode === "hard") {
      timer = 30;
      dropSpeed = "4s";
      winScore = 27;
    }
    updateTimer();
    modeDropdown.classList.remove("show");
    modeBtn.textContent = `Mode (${mode.charAt(0).toUpperCase() + mode.slice(1)}) ▼`;
  });

// Wait for button click to start the game
document.getElementById("start-btn").onclick = startGame;
document.getElementById("restart-btn").onclick = restartGame;

function startGame() {
  if (gameRunning) return;
  gameRunning = true;
  score = 0;
  updateScore();

  // Set timer and winScore based on mode
  if (mode === "easy") {
    timer = 45;
    dropSpeed = "6s";
    winScore = 22;
  } else if (mode === "normal") {
    timer = 35;
    dropSpeed = "5s";
    winScore = 25;
  } else if (mode === "hard") {
    timer = 30;
    dropSpeed = "4s";
    winScore = 27;
  }
  updateTimer();

  timerInterval = setInterval(() => {
    timer -= 1;
    updateTimer();
    if (timer <= 0) {
      endGame();
    }
  }, 1000);

  dropMaker = setInterval(createDrop, 1000);

  const messageElem = document.getElementById("end-message");
  if (messageElem) messageElem.style.display = "none";
}

// Add this function to update score display
function updateScore() {
  const scoreElem = document.getElementById("score");
  if (scoreElem) scoreElem.textContent = score;
}

// Add this function to update timer display
function updateTimer() {
  // Update both .timer and #time for compatibility
  const timerElem = document.querySelector(".timer");
  if (timerElem) timerElem.textContent = `Time: ${timer}s`;
  const timeElem = document.getElementById("time");
  if (timeElem) timeElem.textContent = timer;
}

// End the game when timer reaches 0
function endGame() {
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  gameRunning = false;
  showEndMessage();
}

// Show end-of-game message based on score
function showEndMessage() {
  const container = document.getElementById("game-container");
  let messageElem = document.getElementById("end-message");
  if (!messageElem) {
    messageElem = document.createElement("div");
    messageElem.id = "end-message";
    messageElem.style.position = "absolute";
    messageElem.style.bottom = "20px";
    messageElem.style.left = "50%";
    messageElem.style.transform = "translateX(-50%)";
    messageElem.style.width = "90%";
    messageElem.style.textAlign = "center";
    messageElem.style.fontSize = "28px";
    messageElem.style.fontWeight = "bold";
    messageElem.style.color = "#333";
    messageElem.style.background = "rgba(255,255,255,0.85)";
    messageElem.style.borderRadius = "8px";
    messageElem.style.padding = "16px";
    container.appendChild(messageElem);
  }
  if (score >= winScore) {
    messageElem.textContent = "Congratulations! You win!";
    messageElem.style.color = "#2E9DF7";
    showConfetti("good");
  } else {
    messageElem.textContent = "Try again! Score 30 or more to win.";
    messageElem.style.color = "#FFC907";
    showConfetti("bad");
  }
  messageElem.style.display = "block";
}

// Confetti effect function
function showConfetti(type) {
  const container = document.getElementById("game-container");
  const confettiColors = type === "good"
    ? ["#FFC907", "#2E9DF7"]
    : ["#BF6C46", "#FF902A"];
  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement("div");
    confetti.style.position = "absolute";
    confetti.style.width = "10px";
    confetti.style.height = "18px";
    confetti.style.borderRadius = "3px";
    confetti.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    confetti.style.left = Math.random() * (container.offsetWidth - 10) + "px";
    confetti.style.top = "-20px";
    confetti.style.opacity = "0.85";
    confetti.style.zIndex = "1000";
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    // Animate confetti falling
    const fallDistance = 500 + Math.random() * 100;
    confetti.animate([
      { top: "-20px", opacity: 0.85 },
      { top: `${fallDistance}px`, opacity: 0.2 }
    ], {
      duration: 1800 + Math.random() * 600,
      easing: "ease-in"
    });
    container.appendChild(confetti);
    setTimeout(() => confetti.remove(), 2000);
  }
}

function createDrop() {
  const drop = document.createElement("div");
  drop.className = "water-drop";
  drop.style.background = "radial-gradient(ellipse at center 60%, #003366 60%, #77A8BB 100%)";
  const isGood = Math.random() < 0.5;
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Set drop speed based on mode
  drop.style.animationDuration = dropSpeed;

  document.getElementById("game-container").appendChild(drop);

  drop.addEventListener("click", () => {
    if (isGood) {
      drop.style.background = "radial-gradient(ellipse at center 60%, #FFC907 60%, #FFF7D6 100%)";
      score += 1;
      document.getElementById("good-sound").play();
    } else {
      drop.style.background = "radial-gradient(ellipse at center 60%, #BF6C46 60%, #FFD6C1 100%)";
      score -= 1;
      document.getElementById("bad-sound").play();
    }
    updateScore();
    setTimeout(() => drop.remove(), 200);
  });

  drop.addEventListener("animationend", () => {
    drop.remove();
  });
}

// Add event listener for restart button
document.getElementById("restart-btn").addEventListener("click", restartGame);

function restartGame() {
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  gameRunning = false;
  const container = document.getElementById("game-container");
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  const messageElem = document.getElementById("end-message");
  if (messageElem) messageElem.style.display = "none";
  startGame();
}
