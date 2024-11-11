const concepts = {
    "Responsabilidad Digital": {
        "Protección de datos": "Salvaguardar la privacidad y los datos personales de los usuarios en línea",
        "Transparencia": "Ser claro y honesto en la comunicación y en el uso de datos, evitando prácticas engañosas o fraudulentas",
        "Seguridad digital": "Implementar medidas que protejan la información sensible de los usuarios contra vulneraciones de seguridad",
        "Sostenibilidad digital": "Tener en cuenta el impacto ambiental de las actividades tecnológicas, como el consumo de energía"
    },
    "Concepto de Ética": {
        "Ética digital": "Conjunto de principios y normas que guían el comportamiento moral en el uso de la tecnología y el entorno digital",
        "Responsabilidad digital": "Compromiso de utilizar y compartir tecnologías digitales, en forma segura, ética y responsable",
        "UNESCO": "Organización cuyo código de ética regula el uso de la Inteligencia Artificial",
        "Unión Europea para Redes Sociales": "Organización cuyo código de conducta establece pautas para luchar contra la desinformación y el discurso de odio",
        "Buenas Prácticas en Redes Sociales": "Código que busca regular el comportamiento ético en las plataformas virtuales"
    },
    "Ética en la comunicación": {
        "Identidad digital": "Conjunto de la información sobre un individuo o una organización expuesta en Internet que conforma una descripción de dicha persona en el plano digital",
        "Seguridad en la Red": "Desafío que puede determinar la estabilidad y el buen funcionamiento del propio sistema",
        "Acoso virtual": "Una forma de violencia virtual que trasciende los espacios",
        "Propiedad intelectual": "Al existir una saturación de información, esto complica que los derechos de autor sean respetados",
        "Difusión de información": "No garantiza ni su calidad ni su veracidad"
    }
}

let revealedTextElement;
let textHintElement;
let correctAnswersElement;
let currentLivesElement;
let hangmanStatusElement;
let selectedThemeElement;
let letters;

const imagesPath = "resources/images/hangman/_.png";
const rightSoundPath = "/resources/audio/rightanswer-95219.mp3";
const wrongSoundPath = "/resources/audio/wrong-47985.mp3";
const winGameSoundPath = "/resources/audio/success-1-6297.mp3";
const loseGameSoundPath = "/resources/audio/negative_beeps-6008.mp3";

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
    selectedThemeElement = document.querySelector("#selected-theme");

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

function removeAccents(str) {
    return str.toUpperCase()
        .normalize("NFD")
        .replace(/\u0301|\u0308]/g, "")
        .replace(/N\u0303/g, "Ñ");
}

function getRandomConcept() {
    const themes = Object.keys(concepts);
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    const themeConcepts = Object.keys(concepts[randomTheme]);
    const randomConcept = themeConcepts[Math.floor(Math.random() * themeConcepts.length)];

    const definition = concepts[randomTheme][randomConcept];

    return {
        theme: randomTheme,
        concept: randomConcept,
        definition: definition
    }
}

function getIndexes(character, text) {
    let indexes = [];
    let i = -1;
    while ((i = text.indexOf(character, i + 1)) >= 0) {
        indexes.push(i);
    }

    return indexes;
}

function playSound(path) {
    new Audio(path).play();
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
        playSound(winGameSoundPath);
        showAlert("Has ganado!!! :D\nReinicia la página para volver a intentarlo");
        isPlaying = false;
    } else if (lives == 0) {
        playSound(loseGameSoundPath);
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
    const uText = removeAccents(text.toUpperCase());
    const uLetter = removeAccents(letter.toUpperCase());

    if (isPlaying && lives > 0 && !selectedLetters.includes(uLetter)) {
        if (uText.includes(uLetter)) {
            correctAnswers++;

            indexes = getIndexes(uLetter, uText);

            indexes.forEach(index => {
                character = revealedTextElement.children[index];

                character.textContent = text.charAt(index);
            })

            playSound(rightSoundPath);
        } else {
            lives--;
            updateHangmanImage();

            playSound(wrongSoundPath);
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
    const result = getRandomConcept();
    selectedThemeElement.textContent = result.theme;
    text = result.concept;
    textHint = result.definition;

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