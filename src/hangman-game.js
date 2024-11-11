function init() {
    keyboardContainer = document.querySelector("#keyboard-container");
    letter = keyboardContainer.querySelector(".letter");

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


window.onload = (evt) => {
    init();
}