// Global variables
let guess = "";
let currentWord = "";
let wordDescription = "";
let imageURL = "";
let currentIndex = 0;
let hashArray = [];
let wins = 0;
let remainingGuesses = 0;
let lettersGuessed = [];
const alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const audio = new Audio();

// DOM elements
const wordDescriptionEl = document.getElementById("description");
const gameInfoEl = document.getElementById("game-info");
const imgageEl = document.getElementById("image");
const startGameEl = document.getElementById("start-game");
const currentWordEl = document.getElementById("current-word");
const winsEl = document.getElementById("wins");
const RemainingGuessesEl = document.getElementById("remaining-guesses");
const lettersGuessedEl = document.getElementById("letters-guessed");

const resetLife = () => remainingGuesses = 10;

const shuffle = (array) => { //Fisher-Yates shuffle algorithm
	let currentIndex = array.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
};

// Generate the current word and its relevant information
const generateCurrentWord = () => {
    let randIndex = Math.floor(Math.random() * secretWords.length);
    currentWord = secretWords[randIndex].word;
    console.log("Current word: ", currentWord);
    currentIndex = randIndex;
    imageURL = secretWords[randIndex].image;
    wordDescription = secretWords[randIndex].description;
}

// Hash/Mask the current word
// Put the hashed word in the array "hashArray"
const hashCurrentWord = word => {
    for (let i = 0; i < word.length; i++) {
        if (word[i] == " ") {
            hashArray.push(" ");
        } else hashArray.push("_");
    }
}

// Display to the screen: hashed word, number of wins, remaining guesses, and letters already guessed
const showHashedWord = hashArr => currentWordEl.innerHTML = hashArr.join("&nbsp;");
const showNumWins = () => winsEl.innerHTML = wins;
const showRemainingGuesses = () => RemainingGuessesEl.innerHTML = remainingGuesses;
const showLettersAlreadyGuessed = () => lettersGuessedEl.innerHTML = lettersGuessed.join(", ");
const showDescription = () => wordDescriptionEl.innerHTML = wordDescription;
const showImage = () => imgageEl.setAttribute("src", imageURL);
const showDefaultImage = () => imgageEl.setAttribute("src", "assets/images/hangman.png");

// Reveal the description of the current word
const RevealWordDescription = () => wordDescriptionEl.innerHTML = wordDescription;

// Verify to make sure user presses alphabetic key only. The function returns boolean value true/false.
const alphabetKeyPress = (keyPress) => {
    return (alphabets.includes(keyPress)) ? true : false;
}

/* Compare user's guess with each character of the current word
If matching:
>> Replace "_" with the actual character in the hash array
>> Check if no more "_" in the hash array - all letters are guessed correctly.
>> * Increase number of wins by 1
>> * Reset Game
If no matching:
>> Decrease number of remaining guesses by 1
>> * Check if remaining guesses = 0. If so, 1). Play failure sound, 2). Pop up loser msg, 3). Reset Game
*/
const compareGuess = guess => {
    let isMatching = false;
    let letterAlreadyGuessed = false;
    for (let i = 0; i < currentWord.length; i++) {
        if (guess == currentWord[i]) {
            hashArray[i] = guess;
            showHashedWord(hashArray);
            isMatching = true;
        }
    }
    letterAlreadyGuessed = storeGuesses(guess);
    showLettersAlreadyGuessed();
    determineWinner();

    // If the user made a wrong guess and letter was not previousely guess:
    // - Deduct remainingGuesses by 1
    // - Show remainingGuesses
    // - Determine looser
    if (letterAlreadyGuessed == false && isMatching == false) {
        remainingGuesses = remainingGuesses - 1;
        showRemainingGuesses();
        determineLooser(remainingGuesses, currentWord);
    } 
}

// Determine winner if there's no "_" left in the hash array.
// Set timeout for 100ms so that user can see the full word he/she guessed before
// the alert comes up and the the game is reset.
const determineWinner = () => {
    if (!hashArray.includes("_")) {
        wins = wins + 1;
        winsEl.innerHTML = wins;
        showDescription();
        showImage();
        playWinnerSound();
        setTimeout(() => {
            alert("You are the WINNER!!!");
            stopWinnerSound();
            resetGame();
        }, 100);
    }
}

// Determine looser if there's life/remaining guesses become 0.
const determineLooser = (life, secrettWord) => {
    if (life == 0) {
        showDescription();
        showImage();
        playLooserSound();
        setTimeout(() => {
            alert("You are the LOOSER!!! \n The secret word is " + secrettWord);
            stopLooserSound();
            resetGame();
        }, 100);
    }
}

// Store letters already guessed and return a boolean value if the letter already stored
const storeGuesses = (guess) => {
    let letterAlreadyStored = false;
    if (!lettersGuessed.includes(guess)) {
        lettersGuessed.push(guess);
    } else letterAlreadyStored = true;
    return letterAlreadyStored;
}

// Play winner sound
const playWinnerSound = () => {   
    audio.src = "assets/audio/victory.wav";
    audio.play();
}

// Stop winner sound
const stopWinnerSound = () => {
    audio.src = "assets/audio/victory.wav";
    audio.pause();
    audio.currentTime = 0;
}
// Play looser sound
const playLooserSound = () => {   
    audio.src = "assets/audio/Sad_Trombone.wav";
    audio.play();
}

const stopLooserSound = () => {
    audio.src = "assets/audio/victory.wav";
    audio.pause();
    audio.currentTime = 0;
}

// Reset the game
const resetGame = () => {
    // Clear the hash array
    hashArray = [];
    // Reset the remaining guesses
    resetLife();
    // Clear the array for the letters already guessed
    lettersGuessed = [];
    generateCurrentWord();
    hashCurrentWord(currentWord);
    showHashedWord(hashArray);
    showRemainingGuesses();
    showLettersAlreadyGuessed();
}

// Excutes the logics
resetLife();
showDefaultImage();
generateCurrentWord();
hashCurrentWord(currentWord);
showHashedWord(hashArray);
showNumWins();
showRemainingGuesses();
showLettersAlreadyGuessed();
document.onkeypress = (event) => {
    guess = event.key.toUpperCase();
    // Check to make sure that the user pressed alphabet key
    // checkUserInput(event.key.toUpperCase());
    if (alphabetKeyPress(guess)) {
        compareGuess(guess);
    }
}



