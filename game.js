class NumberGuessingGame {
    constructor() {
        this.difficultySettings = {
            easy: { min: 1, max: 50, maxAttempts: 10, points: 10 },
            medium: { min: 1, max: 100, maxAttempts: 7, points: 20 },
            hard: { min: 1, max: 200, maxAttempts: 5, points: 30 }
        };
        
        this.currentDifficulty = 'easy';
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.attempts = 0;
        this.previousGuesses = [];
        this.targetNumber = null;
        this.gameActive = false;
        
        this.initializeElements();
        this.setupEventListeners();
        this.updateDisplay();
        this.startNewGame();
    }
    
    initializeElements() {
        // Difficulty buttons
        this.easyBtn = document.getElementById('easy-btn');
        this.mediumBtn = document.getElementById('medium-btn');
        this.hardBtn = document.getElementById('hard-btn');
        
        // Game elements
        this.guessInput = document.getElementById('guess-input');
        this.guessBtn = document.getElementById('guess-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.messageEl = document.getElementById('message');
        
        // Display elements
        this.scoreEl = document.getElementById('score');
        this.highScoreEl = document.getElementById('high-score');
        this.attemptsEl = document.getElementById('attempts');
        this.rangeEl = document.getElementById('range');
        this.previousGuessesEl = document.getElementById('previous-guesses');
    }
    
    setupEventListeners() {
        // Difficulty buttons
        this.easyBtn.addEventListener('click', () => this.setDifficulty('easy'));
        this.mediumBtn.addEventListener('click', () => this.setDifficulty('medium'));
        this.hardBtn.addEventListener('click', () => this.setDifficulty('hard'));
        
        // Game buttons
        this.guessBtn.addEventListener('click', () => this.makeGuess());
        this.resetBtn.addEventListener('click', () => this.startNewGame());
        
        // Enter key for guess input
        this.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.makeGuess();
            }
        });
    }
    
    setDifficulty(difficulty) {
        if (this.currentDifficulty === difficulty) return;
        
        // Update active button
        document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${difficulty}-btn`).classList.add('active');
        
        this.currentDifficulty = difficulty;
        this.startNewGame();
    }
    
    startNewGame() {
        const settings = this.difficultySettings[this.currentDifficulty];
        this.targetNumber = this.generateRandomNumber(settings.min, settings.max);
        this.attempts = 0;
        this.previousGuesses = [];
        this.gameActive = true;
        
        this.updateDisplay();
        this.showMessage(`New game started! Guess a number between ${settings.min} and ${settings.max}`, 'info');
        this.guessInput.focus();
    }
    
    generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    makeGuess() {
        if (!this.gameActive) {
            this.showMessage('Game over! Start a new game to play again.', 'error');
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
        
        if (guess === this.targetNumber) {
            this.handleWin();
        } else {
            this.handleIncorrectGuess(guess);
        }
        
        this.guessInput.value = '';
        this.updateDisplay();
        
        // Check if game over due to max attempts
        if (this.attempts >= settings.maxAttempts && guess !== this.targetNumber) {
            this.handleGameOver();
        }
    }
    
    handleWin() {
        const settings = this.difficultySettings[this.currentDifficulty];
        const pointsEarned = Math.max(1, Math.floor(settings.points * (1 - (this.attempts - 1) / settings.maxAttempts)));
        
        this.score += pointsEarned;
        this.gameActive = false;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
        }
        
        this.showMessage(
            `🎉 Correct! The number was ${this.targetNumber}. You earned ${pointsEarned} points!`,
            'success'
        );
    }
    
    handleIncorrectGuess(guess) {
        const settings = this.difficultySettings[this.currentDifficulty];
        const attemptsLeft = settings.maxAttempts - this.attempts;
        
        let hint = guess < this.targetNumber ? 'higher' : 'lower';
        let message = `Too ${hint}! ${attemptsLeft} attempt(s) left.`;
        
        this.showMessage(message, 'error');
    }
    
    handleGameOver() {
        this.gameActive = false;
        this.showMessage(
            `Game Over! The number was ${this.targetNumber}. Your score: ${this.score}`,
            'error'
        );
    }
    
    showMessage(text, type) {
        this.messageEl.textContent = text;
        this.messageEl.className = `message ${type}`;
    }
    
    updateDisplay() {
        const settings = this.difficultySettings[this.currentDifficulty];
        
        this.scoreEl.textContent = this.score;
        this.highScoreEl.textContent = this.highScore;
        this.attemptsEl.textContent = `${this.attempts}/${settings.maxAttempts}`;
        this.rangeEl.textContent = `${settings.min}-${settings.max}`;
        this.previousGuessesEl.textContent = this.previousGuesses.join(', ') || 'None';
        
        // Update input placeholder
        this.guessInput.placeholder = `Enter guess (${settings.min}-${settings.max})`;
        this.guessInput.min = settings.min;
        this.guessInput.max = settings.max;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NumberGuessingGame();
});