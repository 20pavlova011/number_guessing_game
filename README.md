## Number Guessing Game

A simple, interactive number guessing game built with HTML, CSS, and JavaScript featuring multiple difficulty levels and score tracking.

### How to Use

1. **Setup**: Save all three files (`index.html`, `styles.css`, `game.js`) in the same folder.

2. **Launch**: Open `index.html` in your web browser.

3. **Gameplay**:
   - **Select Difficulty**: Choose from Easy (1-50), Medium (1-100), or Hard (1-200)
   - **Make Guesses**: Enter your number guess and click "Guess" or press Enter
   - **Get Hints**: The game tells you if your guess is too high or too low
   - **Track Progress**: See your attempts, previous guesses, and score

### Features

- **Three Difficulty Levels**:
  - Easy: 1-50 range, 10 attempts, 10 base points
  - Medium: 1-100 range, 7 attempts, 20 base points
  - Hard: 1-200 range, 5 attempts, 30 base points

- **Scoring System**:
  - Points are awarded based on difficulty and number of attempts
  - Higher scores for fewer attempts
  - Persistent high score storage using localStorage

- **Game Information**:
  - Current score and high score display
  - Attempt counter with maximum attempts
  - Previous guesses history
  - Visual feedback messages

### Controls

- **Mouse**: Click buttons to interact
- **Keyboard**: Press Enter to submit guesses
- **Responsive Design**: Works on desktop and mobile devices

### File Structure

- `index.html` - Main HTML structure
- `styles.css` - Styling and responsive design
- `game.js` - Game logic and functionality

Enjoy playing! 🎯