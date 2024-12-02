class NumberGuessingGame {
    constructor() {
        this.difficultySettings = {
            easy: { range: 50, attempts: 10, points: 10 },
            medium: { range: 100, attempts: 7, points: 20 },
            hard: { range: 200, attempts: 5, points: 30 }
        };
        
        this.currentDifficulty = 'medium';
        this.targetNumber = 0;
        this.attemptsLeft = 0;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
        this.gameActive = false;
        this.guessHistory = [];
        
        this.initializeElements();
        this.setupEventListeners();
        this.updateDisplay();
    }

    initializeElements() {
        this.difficultySelect = document.getElementById('difficulty');
        this.startBtn = document.getElementById('startBtn');
        this.guessInput = document.getElementById('guessInput');
        this.guessBtn = document.getElementById('guessBtn');
        this.hintBtn = document.getElementById('hintBtn');
        this.attemptsDisplay = document.getElementById('attemptsLeft');
        this.scoreDisplay = document.getElementById('score');
        this.highScoreDisplay = document.getElementById('highScore');
        this.messageDisplay = document.getElementById('message');
        this.historyDisplay = document.getElementById('history');
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.guessBtn.addEventListener('click', () => this.makeGuess());
        this.hintBtn.addEventListener('click', () => this.giveHint());
        this.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.makeGuess();
        });
        this.difficultySelect.addEventListener('change', (e) => {
            this.currentDifficulty = e.target.value;
        });
    }

    startGame() {
        const settings = this.difficultySettings[this.currentDifficulty];
        this.targetNumber = Math.floor(Math.random() * settings.range) + 1;
        this.attemptsLeft = settings.attempts;
        this.gameActive = true;
        this.guessHistory = [];

        this.guessInput.disabled = false;
        this.guessBtn.disabled = false;
        this.hintBtn.disabled = false;
        this.guessInput.value = '';
        this.guessInput.focus();

        this.showMessage(`Game started! Guess a number between 1 and ${settings.range}`, 'info');
        this.updateDisplay();
        this.updateHistory();
    }

    makeGuess() {
        if (!this.gameActive) return;

        const guess = parseInt(this.guessInput.value);
        
        if (isNaN(guess) || guess < 1) {
            this.showMessage('Please enter a valid positive number!', 'error');
            return;
        }

        const settings = this.difficultySettings[this.currentDifficulty];
        if (guess > settings.range) {
            this.showMessage(`Please enter a number between 1 and ${settings.range}!`, 'error');
            return;
        }

        this.attemptsLeft--;
        this.guessHistory.push(guess);

        if (guess === this.targetNumber) {
            this.handleWin();
        } else if (this.attemptsLeft === 0) {
            this.handleLoss();
        } else {
            this.handleIncorrectGuess(guess);
        }

        this.guessInput.value = '';
        this.updateDisplay();
        this.updateHistory();
    }

    handleWin() {
        const settings = this.difficultySettings[this.currentDifficulty];
        const pointsEarned = settings.points + (this.attemptsLeft * 2);
        this.score += pointsEarned;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore.toString());
        }

        this.showMessage(
            `🎉 Correct! The number was ${this.targetNumber}. You earned ${pointsEarned} points!`,
            'success'
        );
        this.endGame();
    }

    handleLoss() {
        this.showMessage(
            `💀 Game Over! The number was ${this.targetNumber}. Better luck next time!`,
            'error'
        );
        this.endGame();
    }

    handleIncorrectGuess(guess) {
        const direction = guess < this.targetNumber ? 'higher' : 'lower';
        this.showMessage(
            `Incorrect! Try a ${direction} number. ${this.attemptsLeft} attempts left.`,
            'info'
        );
    }

    giveHint() {
        if (!this.gameActive || this.attemptsLeft <= 1) return;

        // Use an attempt for the hint
        this.attemptsLeft--;
        
        const range = this.difficultySettings[this.currentDifficulty].range;
        const quarter = Math.floor(range / 4);
        
        let hint;
        if (this.targetNumber <= quarter) {
            hint = "Hint: The number is in the first quarter (low numbers)";
        } else if (this.targetNumber <= quarter * 2) {
            hint = "Hint: The number is in the second quarter";
        } else if (this.targetNumber <= quarter * 3) {
            hint = "Hint: The number is in the third quarter";
        } else {
            hint = "Hint: The number is in the fourth quarter (high numbers)";
        }

        this.showMessage(`${hint} (used 1 attempt)`, 'info');
        this.updateDisplay();
    }

    endGame() {
        this.gameActive = false;
        this.guessInput.disabled = true;
        this.guessBtn.disabled = true;
        this.hintBtn.disabled = true;
    }

    showMessage(text, type) {
        this.messageDisplay.textContent = text;
        this.messageDisplay.className = `message ${type}`;
    }

    updateDisplay() {
        this.attemptsDisplay.textContent = this.gameActive ? this.attemptsLeft : '-';
        this.scoreDisplay.textContent = this.score;
        this.highScoreDisplay.textContent = this.highScore;
    }

    updateHistory() {
        if (this.guessHistory.length === 0) {
            this.historyDisplay.innerHTML = '<h3>Guess History</h3><p>No guesses yet</p>';
            return;
        }

        let historyHTML = '<h3>Guess History</h3><ul>';
        this.guessHistory.forEach((guess, index) => {
            const guessNumber = index + 1;
            let status = '';
            if (guess === this.targetNumber) {
                status = ' ✅ Correct!';
            } else if (guess < this.targetNumber) {
                status = ' 📈 Too low';
            } else {
                status = ' 📉 Too high';
            }
            historyHTML += `<li>Guess ${guessNumber}: ${guess}${status}</li>`;
        });
        historyHTML += '</ul>';
        this.historyDisplay.innerHTML = historyHTML;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NumberGuessingGame();
});