// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let score = 0;
let timer = 30;
let timerInterval;

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;

  // Reset score at game start
  score = 0;
  updateScore();

  // Reset and display timer
  timer = 30;
  updateTimer();

  // Start countdown timer
  timerInterval = setInterval(() => {
    timer -= 1;
    updateTimer();
    if (timer <= 0) {
      endGame();
    }
  }, 1000);

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);

  // Hide end message if present
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
  const timerElem = document.querySelector(".timer");
  if (timerElem) timerElem.textContent = timer;
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
  if (score >= 20) {
    messageElem.textContent = "Congratulations! You win!";
    messageElem.style.color = "#2E9DF7";
    showConfetti("good");
  } else {
    messageElem.textContent = "Try again! Score 20 or more to win.";
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
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";

  // All drops start as solid color #003366
  drop.style.background = "radial-gradient(ellipse at center 60%, #003366 60%, #77A8BB 100%)";

  // Randomly assign drop type: good or bad
  const isGood = Math.random() < 0.5; // 50% chance

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Score logic for clicking drops
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

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}

// Add event listener for restart button
document.getElementById("restart-btn").addEventListener("click", restartGame);

function restartGame() {
  // Stop any running intervals
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  gameRunning = false;

  // Remove all drops
  const container = document.getElementById("game-container");
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Hide end message if present
  const messageElem = document.getElementById("end-message");
  if (messageElem) messageElem.style.display = "none";

  // Start a new game
  startGame();
}
