const mainAudioPlayer = document.getElementById("mainAudioPlayer");
const titleContainer = document.querySelector(".title-container");
const selectionSelectAll = document.querySelectorAll(".selection-select");

const selectionSelectAge = document.getElementById("selection-select-age");
const selectionSelectPeople = document.getElementById("selection-select-people");


const selectionSendBtn = document.getElementById("selection-send-btn")
const selectionSendBtnCTNT = selectionSendBtn.textContent;

const mutedCcbox = document.querySelector(".muted-wrapper").querySelector("input[type='checkbox']");


let DataPredictionResult = null;


mainAudioPlayer.load();



function animateCounter(targetValue, duration = 2000) {
    const ResultsContainer = document.querySelector(".results-container");
    const startTime = performance.now();

    function easeInOutCubic(t) {
        return t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easedProgress = easeInOutCubic(progress);
        const currentValue = easedProgress * targetValue;

        ResultsContainer.textContent = `${currentValue.toFixed(2)} %`;

        if (progress < 1) {
        requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

window.addEventListener("click", () => {
    mainAudioPlayer.play();
})

window.addEventListener("DOMContentLoaded", () => {
    titleContainer.classList.add("active");
});



for (let A = 0; A <= 71; A++) {
    const selectionSelectAge__Option = document.createElement("option");

    selectionSelectAge__Option.id = `selectionSelectAge__Option__${A}`;
    selectionSelectAge__Option.value = A;
    selectionSelectAge__Option.textContent = A;

    selectionSelectAge.appendChild(selectionSelectAge__Option);
}

for (let P = 1; P <= 24; P++) {
    const selectionSelectPeople__Option = document.createElement("option");

    selectionSelectPeople__Option.value = `selectionSelectPeople__Option__${P}`;
    selectionSelectPeople__Option.value = P;
    selectionSelectPeople__Option.textContent = P;

    selectionSelectPeople.appendChild(selectionSelectPeople__Option);
}

selectionSendBtn.addEventListener("click", async () => {
    const dataTsmt = {
        class: Number(document.getElementById("selection-select-class").value),
        sex: Number(document.getElementById("selection-select-sex").value),
        age: Number(document.getElementById("selection-select-age").value),
        people: Number(document.getElementById("selection-select-people").value)
    }


    selectionSendBtn.innerHTML = `<svg viewBox="0 0 100 100" id="selection-send-loading-container">
                                    <path d="M50,10 A 40 40 0 1 0 50,90 A 40 40 0 1 0 50,10 Z" id="selection-send-loading">
                                    </path></svg>`;

    const selectionSendLoadingContainer = document.getElementById("selection-send-loading-container");

    selectionSendBtn.classList.add("loading");
    selectionSendBtn.disabled = true;
    selectionSendLoadingContainer.classList.add("loading");

    const BEresponse = await fetch("/api/model/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataTsmt)
    });
    
    const responseBEResponse = await BEresponse.json();
    DataPredictionResult = responseBEResponse.pdt_bnry_val;
        
    animateCounter(DataPredictionResult, 2000);

    selectionSendBtn.textContent = selectionSendBtnCTNT;
    selectionSendBtn.classList.remove("loading");
    selectionSendBtn.disabled = false;
})

mutedCcbox.addEventListener("input", () => {
    mainAudioPlayer.muted = mutedCcbox.checked;
});
