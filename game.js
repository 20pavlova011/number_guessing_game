class NumberGuessingGame {
    constructor() {
        this.difficultySettings = {
            easy: { range: 10, attempts: 3, points: 10 },
            medium: { range: 50, attempts: 5, points: 20 },
            hard: { range: 100, attempts: 7, points: 30 }
        };
        
        this.currentDifficulty = 'easy';
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.previousGuesses = [];
        
        this.initializeGame();
        this.bindEvents();
        this.updateDisplay();
    }

    initializeGame() {
        const settings = this.difficultySettings[this.currentDifficulty];
        this.targetNumber = Math.floor(Math.random() * settings.range) + 1;
        this.remainingAttempts = settings.attempts;
        this.previousGuesses = [];
        
        console.log('Target number:', this.targetNumber); // For debugging
    }

    bindEvents() {
        // Difficulty buttons
        document.getElementById('easy-btn').addEventListener('click', () => this.setDifficulty('easy'));
        document.getElementById('medium-btn').addEventListener('click', () => this.setDifficulty('medium'));
        document.getElementById('hard-btn').addEventListener('click', () => this.setDifficulty('hard'));
        
        // Game buttons
        document.getElementById('guess-btn').addEventListener('click', () => this.makeGuess());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetGame());
        
        // Enter key support
        document.getElementById('guess-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.makeGuess();
            }
        });
    }

    setDifficulty(difficulty) {
        // Update active button
        document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${difficulty}-btn`).classList.add('active');
        
        this.currentDifficulty = difficulty;
        this.resetGame();
    }

    makeGuess() {
        const guessInput = document.getElementById('guess-input');
        const guess = parseInt(guessInput.value);
        
        // Validate input
        if (isNaN(guess)) {
            this.showMessage('Please enter a valid number!', 'error');
            return;
        }
        
        const settings = this.difficultySettings[this.currentDifficulty];
        if (guess < 1 || guess > settings.range) {
            this.showMessage(`Please enter a number between 1 and ${settings.range}`, 'error');
            return;
        }
        
        // Check if already guessed
        if (this.previousGuesses.includes(guess)) {
            this.showMessage('You already guessed that number!', 'error');
            return;
        }
        
        this.previousGuesses.push(guess);
        this.remainingAttempts--;
        
        // Check guess
        if (guess === this.targetNumber) {
            this.handleWin();
        } else if (this.remainingAttempts === 0) {
            this.handleLoss();
        } else {
            this.handleIncorrectGuess(guess);
        }
        
        guessInput.value = '';
        this.updateDisplay();
    }

    handleWin() {
        const points = this.difficultySettings[this.currentDifficulty].points;
        this.score += points;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
        }
        
        this.showMessage(`🎉 Correct! The number was ${this.targetNumber}. You earned ${points} points!`, 'success');
        document.getElementById('guess-btn').disabled = true;
    }

    handleLoss() {
        this.showMessage(`💀 Game Over! The number was ${this.targetNumber}. Better luck next time!`, 'error');
        document.getElementById('guess-btn').disabled = true;
    }

    handleIncorrectGuess(guess) {
        const hint = guess < this.targetNumber ? 'higher' : 'lower';
        this.showMessage(`Wrong! Try a ${hint} number. ${this.remainingAttempts} attempts remaining.`, 'info');
    }

    showMessage(text, type) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = text;
        messageElement.className = `message ${type}`;
    }

    resetGame() {
        this.initializeGame();
        document.getElementById('guess-btn').disabled = false;
        document.getElementById('guess-input').value = '';
        this.showMessage('New game started! Make your first guess.', 'info');
        this.updateDisplay();
    }

    updateDisplay() {
        const settings = this.difficultySettings[this.currentDifficulty];
        
        // Update range display
        document.getElementById('range-display').textContent = `1 and ${settings.range}`;
        
        // Update attempts
        document.getElementById('attempts-left').textContent = this.remainingAttempts;
        
        // Update scores
        document.getElementById('score').textContent = this.score;
        document.getElementById('high-score').textContent = this.highScore;
        
        // Update previous guesses
        const guessesList = document.getElementById('guesses-list');
        guessesList.textContent = this.previousGuesses.length > 0 
            ? this.previousGuesses.join(', ') 
            : 'None';
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NumberGuessingGame();
});