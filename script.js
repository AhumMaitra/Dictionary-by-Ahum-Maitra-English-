"use strict";

const bodyEl = document.querySelector("body");
const checkBox = document.querySelector(".switch input");
const selectOptions = document.querySelector(".content select");
const searchBtn = document.querySelector(".search");
const inputEl = document.querySelector("form input");
const disContainer = document.querySelector(".dictionary-content");
const partOfSpeech = document.querySelector(".part-of-speech");
const ulEl = document.querySelector(".meanings");
const sysEl = document.querySelector(".syn");
const verbEl = document.querySelector(".verb");
const form = document.querySelector("form");

const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

searchBtn.addEventListener("click", () => {
    if (inputEl.value !== "") {
        searching(inputEl.value);
        inputEl.style.border = "";
        inputEl.value = "";
    } else {
        inputEl.style.border = "1px solid red";
    }
});

async function searching(data) {
    try {
        const apiData = await fetch(API_URL + data);
        const result = await apiData.json();

        const html = `
            <div class="section">
                <h2>${result[0].word}</h2>
                <p>${result[0].phonetic}</p>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="75"
                height="75"
                viewBox="0 0 75 75"
                class="playBtn"
            >
                <g fill="#A445ED" fill-rule="evenodd">
                    <circle cx="37.5" cy="37.5" r="37.5" opacity=".25" />
                    <path d="M29 27v21l21-10.5z" />
                </g>
            </svg>
        `;

        disContainer.innerHTML = html;
        partOfSpeech.textContent = result[0].meanings[0].partOfSpeech;

        const li = result[0].meanings[0].definitions.map(def => `
            <li>${def.definition}</li>
        `).join("");

        ulEl.innerHTML = li;

        const synonyms = result[0].meanings[0].synonyms;
        sysEl.textContent = synonyms ? synonyms.join(" ") : "None";

        const partOfSpeech2 = result[0].meanings[1] ? `
            <div class="verb-content">
                <h3>${result[0].meanings[1].partOfSpeech}</h3>
                <p>Meaning</p>
                <ul class="meanings">
                    <li>${result[0].meanings[1].definitions[0].definition}</li>
                </ul>
            </div>
        ` : "";

        verbEl.innerHTML = partOfSpeech2;

        const playBtn = document.querySelector(".playBtn");
        playBtn.addEventListener("click", () => {
            const speechWord = result[0].word;
            speechText(speechWord);
        });

        console.log(result);
    } catch (error) {
        console.error("Error fetching the API:", error);
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    searching(inputEl.value);
    inputEl.value = "";
});

selectOptions.addEventListener("change", (e) => {
    const fonts = e.target.value;
    bodyEl.style.fontFamily = fonts;
});

checkBox.addEventListener("click", () => {
    bodyEl.classList.toggle("dark");
});

function speechText(textSpeech) {
    const speechText = new SpeechSynthesisUtterance();
    speechText.text = textSpeech;
    speechText.voice = window.speechSynthesis.getVoices()[0];
    window.speechSynthesis.speak(speechText);
}

