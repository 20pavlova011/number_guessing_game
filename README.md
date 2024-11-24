## Number Guessing Game

A simple, interactive number guessing game built with vanilla JavaScript featuring multiple difficulty levels and score tracking.

### How to Use

1. **Setup**: Save all three files (`index.html`, `styles.css`, `game.js`) in the same folder.

2. **Launch**: Open `index.html` in your web browser.

3. **Game Features**:

   - **Difficulty Levels**:
     - **Easy**: Numbers 1-10, 5 attempts
     - **Medium**: Numbers 1-50, 7 attempts  
     - **Hard**: Numbers 1-100, 10 attempts

   - **Scoring System**:
     - Points are awarded based on remaining attempts and difficulty multiplier
     - Easy: 1x multiplier, Medium: 2x multiplier, Hard: 3x multiplier
     - Formula: `(maxAttempts - attemptsUsed + 1) * difficultyMultiplier`

   - **Game Controls**:
     - Select difficulty level by clicking the buttons
     - Enter your guess in the input field
     - Click "Submit Guess" or press Enter
     - Start a new game anytime with "New Game" button

4. **Game Flow**:
   - Choose your difficulty level
   - Guess numbers within the specified range
   - Receive hints (higher/lower) for incorrect guesses
   - Win by guessing correctly within the attempt limit
   - Track your score and high score (stored in browser)

### Files Overview

- `index.html` - Main HTML structure
- `styles.css` - Styling and responsive design
- `game.js` - Game logic and functionality

### Browser Compatibility

Works in all modern browsers that support ES6+ features and localStorage.

### Customization

You can easily modify the game by:
- Changing difficulty ranges in the `difficultySettings` object
- Adjusting scoring multipliers
- Modifying CSS for different visual themes
- Adding new difficulty levels

Enjoy playing! 🎯