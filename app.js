"use strict";
//  toggle instructions

const instructionBtn = document.querySelector(".show-instructions");

instructionBtn.addEventListener("click", () => {
	document.querySelector(".instructions-container").classList.toggle("toggle-instructions");
});

// game
// get secret word
const loader = document.querySelector(".loader");
const WORD_URL = "https://words.dev-apis.com/word-of-the-day?random=1";
const getWord = async function () {
	try {
		loader.style.display = "block";
		// add loader before fetch complete
		const response = await fetch(WORD_URL);
		const data = await response.json();
		loader.style.display = "none";
		// remove loader if fetch succesfull
		return data.word.toUpperCase();
	} catch (err) {
		console.error(err);
		loader.style.display = "none";
		// remove loader if fetch fails
	}
};

let secretWord = await getWord();

const firstRowBoxes = document.querySelectorAll(".first-row .letter-box");
const firstRowDataAtr = document.querySelector(".first-row");
let firstRowArr = [];

const secondRowBoxes = document.querySelectorAll(".second-row .letter-box");
const secondRowDataAtr = document.querySelector(".second-row");
let secondRowArr = [];

const thirdRowBoxes = document.querySelectorAll(".third-row .letter-box");
const thirdRowDataAtr = document.querySelector(".third-row");
let thirdRowArr = [];

const fourthRowBoxes = document.querySelectorAll(".fourth-row .letter-box");
const fourthRowDataAtr = document.querySelector(".fourth-row");
let fourthRowArr = [];

const fifthRowBoxes = document.querySelectorAll(".fifth-row .letter-box");
const fifthRowDataAtr = document.querySelector(".fifth-row");
let fifthRowArr = [];

const sixthRowBoxes = document.querySelectorAll(".sixth-row .letter-box");
const sixthRowDataAtr = document.querySelector(".sixth-row");
let sixthRowArr = [];

const modal = document.querySelector("#modal");
const resetBtn = document.querySelector(".modal-btn");

let round = 1;
let toRemove;

const game = function (e, keyArr, boxArr, rowAtribute) {
	if (keyArr.length < 5 && isLetter(e.key.toUpperCase())) {
		keyArr.push(e.key.toLocaleUpperCase());

		boxArr[0].textContent = keyArr[0];
		boxArr[1].textContent = keyArr[1];
		boxArr[2].textContent = keyArr[2];
		boxArr[3].textContent = keyArr[3];
		boxArr[4].textContent = keyArr[4];
		// assigned the text content of each box with the value of the key pressed
	}

	if (e.key === "Backspace") {
		keyArr.pop();
		// remove last letter in array to delete last letter on screen
		if (!keyArr.length) {
			boxArr[0].textContent = "";
			// delete first letter in row
		}
	}

	if (e.key === "Enter" && keyArr.length === 5) {
		if (checkWord(keyArr.join(""))) {
			// check if the word entered matches a certain pattern
			boxArr.forEach((box) => {
				box.style.border = "2px solid red";
			});
		}
		rowAtribute.setAttribute("data-first-word", keyArr.join(""));
		// assign the word as an data atribute to its row
		checkInputWithSecretWord(boxArr, secretWord.split(""));
		checkForWinningRow(rowAtribute);
	}
};

function isLetter(letter) {
	return /^[a-zA-Z]$/.test(letter);
	// allowed to enter only one letter at a time
}

function checkWord(word) {
	return /(.)\1{2}/.test(word);
	// can't enter words with more that 3 letters of the same type
}

const checkInputWithSecretWord = function (input, secret) {
	// transform input string into array since we need to compare each letter agains the secret word
	const inputArray = Array.from(input);
	const inputValues = [];
	for (let i = 0; i < inputArray.length; i++) {
		inputValues.push(inputArray[i].innerText);
	}

	// nested loops to compare each letter of input with each letter of secret word
	for (let i = 0; i < inputValues.length; i++) {
		for (let j = 0; j < secret.length; j++) {
			if (inputValues[i] === secret[j] && i === j) {
				// if letters match and position in array match
				input[i].style.backgroundColor = "#12841f";
				input[i].style.color = "#f8f9f8";
				input[i].setAttribute("data-valid-letter", true);
			} else if (!input[i].dataset.validLetter && secret.includes(inputValues[i])) {
				// if letters don't contain the valid letter atribute but are included in secret word array mark as yellow
				input[i].style.backgroundColor = "yellow";
				input[i].style.color = "black";
				input[i].setAttribute("data-wrong-place-letter", true);
				// set data atribute on letters that are in the wrong place
			} else if (!input[i].dataset.validLetter && !input[i].dataset.wrongPlaceLetter) {
				// if there are letters that are not part of the secret word but are marked with valid or wrong place do nothing
				if (input[i].dataset.validLetter || input[i].dataset.wrongPlaceLetter) {
					return;
				}
				input[i].style.border = "2px solid red";
				// place border on letters that are not in the secret word
			}
		}
	}
};

const checkForWinningRow = function (row) {
	if (row.dataset.firstWord === secretWord) {
		modal.classList.add("modal");
		modal.style.opacity = 0.9;
		document.querySelector(".modal-title").innerText = `Well Done!`;
		document.querySelector(".modal-text").innerText = `You won this round!`;
		window.removeEventListener("keyup", toRemove, false);
	} else {
		round++;
		switch (round) {
			case 2:
				// not sure if it is the best way to do this !!!!
				window.removeEventListener("keyup", toRemove, false);
				window.addEventListener(
					"keyup",
					(toRemove = () => {
						game(event, secondRowArr, secondRowBoxes, secondRowDataAtr);
					}),
				);
				break;

			case 3:
				window.removeEventListener("keyup", toRemove, false);
				window.addEventListener(
					"keyup",
					(toRemove = () => {
						game(event, thirdRowArr, thirdRowBoxes, thirdRowDataAtr);
					}),
				);
				break;
			case 4:
				window.removeEventListener("keyup", toRemove, false);
				window.addEventListener(
					"keyup",
					(toRemove = () => {
						game(event, fourthRowArr, fourthRowBoxes, fourthRowDataAtr);
					}),
				);
				break;
			case 5:
				window.removeEventListener("keyup", toRemove, false);
				window.addEventListener(
					"keyup",
					(toRemove = () => {
						game(event, fifthRowArr, fifthRowBoxes, fifthRowDataAtr);
					}),
				);
				break;
			case 6:
				window.removeEventListener("keyup", toRemove, false);
				window.addEventListener(
					"keyup",
					(toRemove = () => {
						game(event, sixthRowArr, sixthRowBoxes, sixthRowDataAtr);
					}),
				);
				break;
		}

		if (round === 7) {
			window.removeEventListener("keyup", toRemove, false);
			modal.classList.add("modal");
			modal.style.opacity = 0.9;
			document.querySelector(".modal-title").innerText = `Nice try! The word was ${secretWord}`;
			document.querySelector(".modal-text").innerText = `You wan't to go for another round?`;
		}
	}
};

const init = function () {
	if (round === 1) {
		window.addEventListener(
			"keyup",
			(toRemove = () => {
				game(event, firstRowArr, firstRowBoxes, firstRowDataAtr);
			}),
			false,
		);
	}
};

const resetGame = function () {
	// undo all the imputs
	round = 1;
	modal.classList.remove("modal");
	modal.style.opacity = 0;
	firstRowArr = [];
	secondRowArr = [];
	thirdRowArr = [];
	fourthRowArr = [];
	fifthRowArr = [];
	sixthRowArr = [];

	clearRows(firstRowBoxes);
	clearRows(secondRowBoxes);
	clearRows(thirdRowBoxes);
	clearRows(fourthRowBoxes);
	clearRows(fifthRowBoxes);
	clearRows(sixthRowBoxes);
	(async () => {
		secretWord = await getWord();
	})(); // call the fetch to get a new secret word
	init();
};

function clearRows(rowArr) {
	// clear the rows of letters and data atributes
	rowArr.forEach((box) => {
		box.textContent = "";
		box.style.backgroundColor = "#807f80";
		box.style.color = "#1a1d18";
		box.style.border = "none";
		delete box.dataset.validLetter;
		delete box.dataset.wrongPlaceLetter;
	});

	delete firstRowDataAtr.dataset.firstWord;
	delete secondRowDataAtr.dataset.firstWord;
	delete thirdRowDataAtr.dataset.firstWord;
	delete fourthRowDataAtr.dataset.firstWord;
	delete fifthRowDataAtr.dataset.firstWord;
	delete sixthRowDataAtr.dataset.firstWord;
}

init();
resetBtn.addEventListener("click", resetGame);
