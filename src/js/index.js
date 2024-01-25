class HangmanGame {
  constructor() {
    this.wordDisplay = document.querySelector(".word-display");
    this.guessesText = document.querySelector(".guesses-text b");
    this.keyboardDiv = document.querySelector(".keyboard");
    this.hangmanImage = document.querySelector(".hangman-box img");
    this.gameModal = document.querySelector(".game-modal");
    this.playAgainBtn = this.gameModal.querySelector("button");
    this.startScreen = document.querySelector("start-screen");
    this.backgroundMusic = document.getElementById("background-music");
    this.wrongAnswerSound = document.getElementById("wrong-answer-sound");
    this.rightAnswerSound = document.getElementById("right-answer-sound");
    this.gameOverDefeatSound = document.getElementById(
      "game-over-defeat-sound"
    );
    this.gameOverVictorySound = document.getElementById(
      "game-over-victory-sound"
    );

    document
      .getElementById("start-button")
      .addEventListener("click", this.handleStartButtonClick.bind(this));

    this.currentWord = "";
    this.correctLetters = [];
    this.wrongGuessCount = 0;
    this.maxGuesses = 6;

    this.playAgainBtn.addEventListener("click", () => this.getRandomWord());
  }

  resetGame() {
    this.correctLetters = [];
    this.wrongGuessCount = 0;
    this.hangmanImage.src = `assets/images/hangman-${this.wrongGuessCount}.png`;
    this.guessesText.innerText = `${this.wrongGuessCount} / ${this.maxGuesses}`;
    this.wordDisplay.innerHTML = this.currentWord
      .split("")
      .map(() => `<li class="letter"></li>`)
      .join("");
    this.keyboardDiv
      .querySelectorAll("button")
      .forEach((btn) => (btn.disabled = false));
    this.gameModal.classList.remove("show");
  }
  gameScreen = document.querySelector(".game-screen");
  if(gameScreen) {
    gameScreen.style.display = "none";
  }
  showStartScreen() {
    const startScreen = document.querySelector(".start-screen");
    if (startScreen) {
      startScreen.style.display = "block";
    }
  }

  getRandomWord() {
    const { word, hint } =
      wordList[Math.floor(Math.random() * wordList.length)];
    this.currentWord = word;
    document.querySelector(".hint-text b").innerText = hint;
    this.resetGame();
  }

  gameOver(isVictory) {
    const modalText = isVictory
      ? `You found the word:`
      : "The correct word was:";
    this.gameModal.querySelector("img").src = `assets/images/${
      isVictory ? "Happy Pirate.png" : "Skull.jpg"
    }`;
    this.gameModal.querySelector("h4").innerText = isVictory
      ? "You survived the Hangman's game!"
      : "To The Gallows With Thee!";
    this.gameModal.querySelector(
      "p"
    ).innerHTML = `${modalText} <b>${this.currentWord}</b>`;
    this.gameModal.classList.add("show");
    setTimeout(() => {
      this.resetGame();
      this.showStartScreen();
    }, 5000);
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
    if (isVictory) {
      this.gameOverVictorySound.play();
    } else {
      this.gameOverDefeatSound.play();
    }
  }

  initGame(button, clickedLetter) {
    if (this.currentWord.includes(clickedLetter)) {
      [...this.currentWord].forEach((letter, index) => {
        if (letter === clickedLetter) {
          this.correctLetters.push(letter);
          const li = this.wordDisplay.querySelectorAll("li")[index];
          li.innerText = letter;
          li.classList.add("guessed");
          this.rightAnswerSound.play();
        }
      });
    } else {
      this.wrongGuessCount++;
      this.hangmanImage.src = `assets/images/hangman-${this.wrongGuessCount}.png`;
      this.playWrongAnswerSound();
    }
    button.disabled = true;
    this.guessesText.innerText = `${this.wrongGuessCount} / ${this.maxGuesses}`;

    if (this.wrongGuessCount === this.maxGuesses) return this.gameOver(false);
    if (this.correctLetters.length === this.currentWord.length)
      return this.gameOver(true);
  }

  createAlphabetButtons() {
    this.keyboardDiv.innerHTML = "";
    for (let i = 97; i <= 122; i++) {
      const button = document.createElement("button");
      button.innerText = String.fromCharCode(i);
      this.keyboardDiv.appendChild(button);
      button.addEventListener("click", (e) =>
        this.initGame(e.target, String.fromCharCode(i))
      );
    }
  }

  startGame() {
    this.createAlphabetButtons();
    this.getRandomWord();
    this.backgroundMusic.play();
  }

  handleStartButtonClick() {
    this.showGamePage();
    this.startGame();
  }

  showGamePage() {
    const startScreen = document.querySelector(".start-screen");
    const gameScreen = document.querySelector(".game-screen");

    if (startScreen && gameScreen) {
      startScreen.style.display = "none";
      gameScreen.style.display = "block";
    }
  }
  playRightAnswerSound() {
    this.rightAnswerSound.play();
  }
  playWrongAnswerSound() {
    this.wrongAnswerSound.play();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const hangmanGame = new HangmanGame();
  hangmanGame.startGame();
});
