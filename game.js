class NumberGuessingGame {
    constructor() {
        this.difficultySettings = {
            easy: { min: 1, max: 10, maxAttempts: 5 },
            medium: { min: 1, max: 50, maxAttempts: 7 },
            hard: { min: 1, max: 100, maxAttempts: 10 }
        };
        
        this.currentDifficulty = 'easy';
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.gameActive = false;
        this.targetNumber = null;
        this.attempts = 0;
        this.previousGuesses = [];
        
        this.initializeElements();
        this.setupEventListeners();
        this.updateDisplay();
    }

    initializeElements() {
        this.difficultyButtons = document.querySelectorAll('.difficulty-btn');
        this.guessInput = document.getElementById('guessInput');
        this.submitButton = document.getElementById('submitGuess');
        this.newGameButton = document.getElementById('newGame');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.messageElement = document.getElementById('message');
        this.attemptsElement = document.getElementById('attempts');
        this.previousGuessesElement = document.getElementById('previousGuesses');
    }

    setupEventListeners() {
        // Difficulty buttons
        this.difficultyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.setDifficulty(e.target.id);
            });
        });

        // Submit guess
        this.submitButton.addEventListener('click', () => {
            this.submitGuess();
        });

        // New game button
        this.newGameButton.addEventListener('click', () => {
            this.startNewGame();
        });

        // Enter key support
        this.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitGuess();
            }
        });
    }

    setDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
        
        // Update active button
        this.difficultyButtons.forEach(button => {
            button.classList.remove('active');
            if (button.id === difficulty) {
                button.classList.add('active');
            }
        });

        // Start new game with selected difficulty
        this.startNewGame();
    }

    startNewGame() {
        const settings = this.difficultySettings[this.currentDifficulty];
        this.targetNumber = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min;
        this.attempts = 0;
        this.previousGuesses = [];
        this.gameActive = true;
        
        this.guessInput.value = '';
        this.guessInput.disabled = false;
        this.submitButton.disabled = false;
        this.guessInput.min = settings.min;
        this.guessInput.max = settings.max;
        this.guessInput.placeholder = `Enter number (${settings.min}-${settings.max})`;
        
        this.showMessage(`New game started! Guess a number between ${settings.min} and ${settings.max}`, 'info');
        this.updateDisplay();
    }

    submitGuess() {
        if (!this.gameActive) {
            this.showMessage('Please start a new game first!', 'error');
            return;
        }

        const guess = parseInt(this.guessInput.value);
        const settings = this.difficultySettings[this.currentDifficulty];

        // Validate input
        if (isNaN(guess) || guess < settings.min || guess > settings.max) {
            this.showMessage(`Please enter a valid number between ${settings.min} and ${settings.max}`, 'error');
            return;
        }

        this.attempts++;
        this.previousGuesses.push(guess);

        // Check guess
        if (guess === this.targetNumber) {
            this.handleWin();
        } else if (this.attempts >= settings.maxAttempts) {
            this.handleLoss();
        } else {
            const direction = guess < this.targetNumber ? 'higher' : 'lower';
            this.showMessage(`Wrong! Try a ${direction} number.`, 'error');
        }

        this.updateDisplay();
        this.guessInput.value = '';
        this.guessInput.focus();
    }

    handleWin() {
        const settings = this.difficultySettings[this.currentDifficulty];
        const points = (settings.maxAttempts - this.attempts + 1) * this.getDifficultyMultiplier();
        this.score += points;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
        }

        this.showMessage(`🎉 Correct! The number was ${this.targetNumber}. You earned ${points} points!`, 'success');
        this.endGame();
    }

    handleLoss() {
        this.showMessage(`💀 Game Over! The number was ${this.targetNumber}.`, 'error');
        this.endGame();
    }

    endGame() {
        this.gameActive = false;
        this.guessInput.disabled = true;
        this.submitButton.disabled = true;
    }

    getDifficultyMultiplier() {
        const multipliers = { easy: 1, medium: 2, hard: 3 };
        return multipliers[this.currentDifficulty];
    }

    showMessage(text, type = 'info') {
        this.messageElement.textContent = text;
        this.messageElement.className = `message ${type}`;
    }

    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.highScoreElement.textContent = this.highScore;
        this.attemptsElement.textContent = `Attempts: ${this.attempts}/${this.difficultySettings[this.currentDifficulty].maxAttempts}`;
        
        if (this.previousGuesses.length > 0) {
            this.previousGuessesElement.textContent = `Previous guesses: ${this.previousGuesses.join(', ')}`;
        } else {
            this.previousGuessesElement.textContent = '';
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NumberGuessingGame();
});