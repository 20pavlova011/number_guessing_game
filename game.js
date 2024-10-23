class NumberGuessingGame {
    constructor() {
        this.difficultySettings = {
            easy: { range: 50, attempts: 10, baseScore: 100 },
            medium: { range: 100, attempts: 7, baseScore: 200 },
            hard: { range: 200, attempts: 5, baseScore: 300 }
        };
        
        this.currentDifficulty = null;
        this.targetNumber = null;
        this.attemptsLeft = null;
        this.score = 0;
        this.previousGuesses = [];
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Enter key support for guess input
        document.getElementById('guess-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkGuess();
            }
        });
    }

    startGame(difficulty) {
        this.currentDifficulty = difficulty;
        const settings = this.difficultySettings[difficulty];
        
        this.targetNumber = Math.floor(Math.random() * settings.range) + 1;
        this.attemptsLeft = settings.attempts;
        this.score = settings.baseScore;
        this.previousGuesses = [];
        
        this.updateUI();
        this.showScreen('game-screen');
        
        console.log(`Target number: ${this.targetNumber}`); // For debugging
    }

    checkGuess() {
        const guessInput = document.getElementById('guess-input');
        const guess = parseInt(guessInput.value);
        
        if (isNaN(guess) || guess < 1 || guess > this.difficultySettings[this.currentDifficulty].range) {
            this.showMessage('Please enter a valid number!', 'error');
            return;
        }

        this.previousGuesses.push(guess);
        
        if (guess === this.targetNumber) {
            this.handleWin();
        } else {
            this.handleWrongGuess(guess);
        }
        
        guessInput.value = '';
        this.updateUI();
    }

    handleWin() {
        const bonus = this.attemptsLeft * 10;
        this.score += bonus;
        
        this.showMessage(
            `🎉 Congratulations! You found the number ${this.targetNumber}! Bonus: +${bonus} points`,
            'success'
        );
        this.endGame(true);
    }

    handleWrongGuess(guess) {
        this.attemptsLeft--;
        this.score = Math.max(0, this.score - 10); // Penalty for wrong guess
        
        const hint = guess < this.targetNumber ? 'Too low! 📉' : 'Too high! 📈';
        this.showMessage(`${hint} Try again!`, 'error');
        
        if (this.attemptsLeft === 0) {
            this.showMessage(`Game Over! The number was ${this.targetNumber}`, 'error');
            this.endGame(false);
        }
    }

    endGame(isWin) {
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('game-result-message').textContent = isWin ? 
            'You won! 🎊' : 'Better luck next time! 💪';
        document.getElementById('game-result-message').className = `message ${isWin ? 'success' : 'error'}`;
        
        this.showScreen('game-over-screen');
    }

    updateUI() {
        // Update game info
        document.getElementById('current-score').textContent = this.score;
        document.getElementById('current-difficulty').textContent = this.currentDifficulty;
        document.getElementById('attempts-left').textContent = this.attemptsLeft;
        
        // Update range display
        const range = this.difficultySettings[this.currentDifficulty].range;
        document.getElementById('range-display').textContent = `1 and ${range}`;
        
        // Update previous guesses
        this.updatePreviousGuesses();
    }

    updatePreviousGuesses() {
        const container = document.getElementById('previous-guesses');
        container.innerHTML = '<strong>Previous guesses:</strong><br>';
        
        this.previousGuesses.forEach(guess => {
            const guessElement = document.createElement('span');
            guessElement.className = `guess-item ${guess < this.targetNumber ? 'low' : 'high'}`;
            guessElement.textContent = guess;
            container.appendChild(guessElement);
        });
    }

    showMessage(text, type) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = text;
        messageElement.className = `message ${type}`;
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        document.getElementById(screenId).classList.add('active');
    }

    resetGame() {
        if (this.currentDifficulty) {
            this.startGame(this.currentDifficulty);
        }
    }

    showDifficultyScreen() {
        this.showScreen('difficulty-screen');
    }
}

// Global functions for HTML onclick events
let game;

function startGame(difficulty) {
    if (!game) {
        game = new NumberGuessingGame();
    }
    game.startGame(difficulty);
}

function checkGuess() {
    if (game) {
        game.checkGuess();
    }
}

function resetGame() {
    if (game) {
        game.resetGame();
    }
}

function showDifficultyScreen() {
    if (game) {
        game.showDifficultyScreen();
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    game = new NumberGuessingGame();
});