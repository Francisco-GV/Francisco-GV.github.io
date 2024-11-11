let revealedTextElement;
let textHintElement;
let correctAnswersElement;
let currentLivesElement;
let hangmanStatusElement;
let letters;

const imagesPath = "resources/_.png"

let text;
let textHint;

let isPlaying = false;

let lives;
let correctAnswers;

let selectedLetters = [];

function load() {
    keyboardContainer = document.querySelector("#keyboard-container");
    revealedTextElement = document.querySelector("#revealed_text");
    textHintElement = document.querySelector("#hint");
    correctAnswersElement = document.querySelector("#correct-answers");
    currentLivesElement = document.querySelector("#current-lives");
    hangmanStatusElement = document.querySelector("#hangman-status");

    const A = 65, Z = 90;
    const N = 78;

    const letter = keyboardContainer.querySelector(".letter");
    for (let i = A + 1; i <= Z; i++) {
        const newLetter = letter.cloneNode();
        newLetter.textContent = String.fromCharCode(i);

        keyboardContainer.appendChild(newLetter);

        if (i == N) {
            const Ñ = 209;
            const ñLetter = letter.cloneNode();
            ñLetter.textContent = String.fromCharCode(Ñ)
            keyboardContainer.appendChild(ñLetter);
        }
    }

    letters = keyboardContainer.querySelectorAll(".letter");
    letters.forEach(element => {
        element.addEventListener("click", (evt) => {
            console.log("Click: " + element.textContent);
            evaluateLetterClick(element.textContent, evt.target || evt.srcElement);
        })
    });
}

function getIndexes(character, text) {
    let indexes = [];
    let i = -1;
    while ((i = text.indexOf(character, i + 1)) >= 0) {
        indexes.push(i);
    }

    return indexes;
}

function updateScoreboard() {
    currentLivesElement.textContent = lives;
    correctAnswersElement.textContent = correctAnswers;
}

function showAlert(message) {
    new Promise(resolve => setTimeout(resolve, 100))
        .then(() => alert(message));
}

function evaluateWin() {
    if (!revealedTextElement.textContent.includes("_")) {
        showAlert("Has ganado!!! :D\nReinicia la página para volver a intentarlo");
        isPlaying = false;
    } else if (lives == 0) {
        showAlert("Has perdido! :/\nReinicia la página para volver a intentarlo")
        isPlaying = false;
    }
}

function updateHangmanImage() {
    const imageNum = Math.abs(lives - 7);
    const path = imagesPath.replace("_", imageNum);

    hangmanStatusElement.src = path;
}

function evaluateLetterClick(letter, source) {
    if (isPlaying && lives > 0 && !selectedLetters.includes(letter.toUpperCase())) {
        if (text.toUpperCase().includes(letter.toUpperCase())) {
            correctAnswers++;

            indexes = getIndexes(letter.toUpperCase(), text.toUpperCase());

            indexes.forEach(index => {
                character = revealedTextElement.children[index];

                character.textContent = text.charAt(index);
            })
        } else {
            lives--;
            updateHangmanImage();
        }

        updateScoreboard();
        evaluateWin();

        selectedLetters.push(letter.toUpperCase());
        source.classList.add("hidden")
    }
}

function createRevealedTextLetters(revealedText) {
    revealedTextElement.innerHTML = "";
    for (let i = 0; i < revealedText.length; i++) {
        const span = document.createElement("span");

        if (revealedText[i] == " ") {
            span.className = "space-letter";
            span.textContent = " ";
        } else {
            span.className = "revealed-letter";
            span.textContent = revealedText[i];
        }
        revealedTextElement.appendChild(span);
    }

    console.log(revealedTextElement.textContent);
}

function initGame() {
    text = "Esta es una prueba";
    textHint = "Esta es una definición de prueba";

    const revealedText = text.replace(/\S/g, "_");

    console.log("Text: " + text);
    console.log("Revealed Text: " + revealedText);
    console.log("Text Hint: " + textHint);

    textHintElement.textContent = textHint;
    createRevealedTextLetters(revealedText);

    correctAnswers = 0;
    lives = 7;
    selectedLetters = [];
    letters.forEach(element => {
        element.classList.remove("hidden");
    })

    updateHangmanImage();
    updateScoreboard();
}

function startGame() {
    isPlaying = true;
}


window.onload = (evt) => {
    load();
    initGame();
    startGame();
}