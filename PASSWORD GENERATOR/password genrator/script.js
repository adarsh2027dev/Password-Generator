// Element Selectors
const inputSlider = document.querySelector("[data-length-slider]");
const lengthDisplay = document.querySelector("[data-length-number]");
const passwordDisplay = document.querySelector("[data-password-display]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copying-msg]");
const uppercaseCheck = document.querySelector("#Uppercase");
const lowercaseCheck = document.querySelector("#Lowercase");
const numbersCheck = document.querySelector("#Numbers");
const symbolsCheck = document.querySelector("#Symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const resetBtn = document.querySelector(".Reset");
const strengthText = document.querySelector(".batana");
const allCheckboxes = document.querySelectorAll("input[type=checkbox]");

// Symbol list
const symbols = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

// Initial State
let password = "";
let passwordLength = 10;
let checkCount = 0;
let funcArr = [];

// Update slider UI and value display
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}
handleSlider();

// Set strength indicator color
function setIndicator(color) {
  indicator.style.display = "block";
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

// Random Generators
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 10).toString();
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123)); // a-z
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91)); // A-Z
}

function generateSymbol() {
  const randIndex = getRndInteger(0, symbols.length);
  return symbols.charAt(randIndex);
}

// Password strength checker
function calcStrength() {
  const hasUpper = uppercaseCheck.checked;
  const hasLower = lowercaseCheck.checked;
  const hasNum = numbersCheck.checked;
  const hasSym = symbolsCheck.checked;

  if (hasUpper && hasLower && (hasNum || hasSym) && password.length >= 8) {
    setIndicator("#0f0"); // strong
    strengthText.innerText = "Strong password";
  } else if ((hasUpper || hasLower) && (hasNum || hasSym) && password.length >= 5) {
    setIndicator("#ff0"); // medium
    strengthText.innerText = "Medium password";
  } else {
    setIndicator("#f00"); // weak
    strengthText.innerText = "Weak password";
  }
}

// Copy to clipboard
async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Copy failed";
  }

  copyMsg.classList.add("active");
  setTimeout(() => copyMsg.classList.remove("active"), 2000);
}

// Shuffle password using Fisher-Yates algorithm
function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = getRndInteger(0, i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}

// Handle slider movement
inputSlider.addEventListener('input', (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

// Handle checkbox selection
function handleCheckBoxChange() {
  checkCount = 0;
  funcArr = [];

  if (uppercaseCheck.checked) {
    funcArr.push(generateUpperCase);
    checkCount++;
  }
  if (lowercaseCheck.checked) {
    funcArr.push(generateLowerCase);
    checkCount++;
  }
  if (numbersCheck.checked) {
    funcArr.push(generateRandomNumber);
    checkCount++;
  }
  if (symbolsCheck.checked) {
    funcArr.push(generateSymbol);
    checkCount++;
  }

  // Adjust password length if less than checked options
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}
allCheckboxes.forEach((checkbox) =>
  checkbox.addEventListener("change", handleCheckBoxChange)
);

// Copy button handler
copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

// Generate password handler
generateBtn.addEventListener("click", () => {
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // Generate password
  password = "";
  let generatedChars = [];

  // Add one character of each selected type
  funcArr.forEach((func) => generatedChars.push(func()));

  // Fill the rest of the password
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    generatedChars.push(funcArr[randIndex]());
  }

  // Shuffle and display
  password = shufflePassword(generatedChars);
  passwordDisplay.value = password;

  // Evaluate strength
  calcStrength();
});

// Reset handler
resetBtn.addEventListener("click", () => {
  passwordDisplay.value = "";
  password = "";

  // Uncheck all checkboxes
  uppercaseCheck.checked = true;
  lowercaseCheck.checked = true;
  numbersCheck.checked = false;
  symbolsCheck.checked = false;

  // Reset password length
  passwordLength = 10;
  handleSlider();

  // Reset UI
  indicator.style.display = "none";
  strengthText.innerText = "";
  copyMsg.innerText = "";

  // Reset state
  checkCount = 0;
  funcArr = [];
});
