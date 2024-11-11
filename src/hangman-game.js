let revealedTextElement;
let textHintElement;

let text;
let textHint;
let revealedText;

function load() {
    keyboardContainer = document.querySelector("#keyboard-container");
    letter = keyboardContainer.querySelector(".letter");
    revealedTextElement = document.querySelector("#revealed_text");
    textHintElement = document.querySelector("#hint");

    const A = 65, Z = 90;
    const N = 78;

    for (let i = A + 1; i <= Z; i++) {
        newLetter = letter.cloneNode();
        newLetter.textContent = String.fromCharCode(i);

        keyboardContainer.appendChild(newLetter);

        if (i == N) {
            const Ñ = 209;
            ñLetter = letter.cloneNode();
            ñLetter.textContent = String.fromCharCode(Ñ)
            keyboardContainer.appendChild(ñLetter);
        }
    }

    letters = keyboardContainer.querySelectorAll(".letter");
    letters.forEach(element => {
        element.addEventListener("click", (evt) => {
            console.log(element.textContent)
        })
    });
}

function initGame() {
    text = "Test";
    textHint = "Esta es una definición de prueba";

    revealedText = text.replace(/./g, "_");

    console.log("Text: " + text);
    console.log("Revealed Text: " + revealedText);
    console.log("Text Hint: " + textHint);

    revealedTextElement.textContent = revealedText;
    textHintElement.textContent = textHint;
}


window.onload = (evt) => {
    load();
    initGame();
}