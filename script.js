const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '0';
let isEvaluated = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function clearAll() {
  currentInput = '0';
  isEvaluated = false;
  updateDisplay();
}

function deleteLast() {
  if (currentInput.length <= 1) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }

  isEvaluated = false;
  updateDisplay();
}

function appendValue(value) {
  if (isEvaluated && /\d|\./.test(value)) {
    currentInput = value === '.' ? '0.' : value;
    isEvaluated = false;
    updateDisplay();
    return;
  }

  if (currentInput === '0' && value !== '.') {
    currentInput = value;
  } else {
    currentInput += value;
  }

  if (currentInput === '0.' && value === '.') {
    currentInput = '0.';
  }

  isEvaluated = false;
  updateDisplay();
}

function appendOperator(operator) {
  const lastChar = currentInput.slice(-1);

  if (currentInput === '0' && operator !== '-') {
    return;
  }

  if (/[+\-*/]/.test(lastChar)) {
    currentInput = currentInput.slice(0, -1) + operator;
  } else {
    currentInput += operator;
  }

  isEvaluated = false;
  updateDisplay();
}

function evaluateExpression() {
  const sanitizedInput = currentInput.replace(/×/g, '*').replace(/−/g, '-');

  if (!sanitizedInput || /[+\-*/]$/.test(sanitizedInput)) {
    return;
  }

  try {
    const result = Function(`"use strict"; return (${sanitizedInput});`)();

    if (!Number.isFinite(result)) {
      currentInput = 'Error';
    } else {
      currentInput = String(result);
    }
  } catch (error) {
    currentInput = 'Error';
  }

  isEvaluated = true;
  updateDisplay();
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;

    if (value === 'clear') {
      clearAll();
      return;
    }

    if (value === 'delete') {
      deleteLast();
      return;
    }

    if (value === 'equals') {
      evaluateExpression();
      return;
    }

    if (/[+\-*/]/.test(value)) {
      appendOperator(value);
      return;
    }

    appendValue(value);
  });
});

document.addEventListener('keydown', (event) => {
  if (/^[0-9]$/.test(event.key)) {
    appendValue(event.key);
  }

  if (['+', '-', '*', '/'].includes(event.key)) {
    appendOperator(event.key);
  }

  if (event.key === '.') {
    appendValue('.');
  }

  if (event.key === 'Enter' || event.key === '=') {
    evaluateExpression();
  }

  if (event.key === 'Backspace') {
    deleteLast();
  }

  if (event.key.toLowerCase() === 'c') {
    clearAll();
  }
});

updateDisplay();

// Add support for a quick “0.” when typing decimal after operator or after clearing.
