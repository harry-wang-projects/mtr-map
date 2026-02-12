import divide, { add, subtract, multiply, Calculator } from './mathUtils.js';

const calc = new Calculator();

// DOM Elements
const num1 = document.getElementById('num1');
const num2 = document.getElementById('num2');
const result = document.getElementById('result');
const historyList = document.getElementById('history');

// Button event listeners
document.getElementById('btn-add').addEventListener('click', () => operate('add'));
document.getElementById('btn-subtract').addEventListener('click', () => operate('subtract'));
document.getElementById('btn-multiply').addEventListener('click', () => operate('multiply'));
document.getElementById('btn-divide').addEventListener('click', () => operate('divide'));
document.getElementById('btn-clear').addEventListener('click', clearAll);

function operate(operation) {
    const a = parseFloat(num1.value);
    const b = parseFloat(num2.value);
    
    if (isNaN(a) || isNaN(b)) {
        result.textContent = 'Please enter valid numbers';
        result.className = 'error';
        return;
    }
    
    try {
        let res;
        if (operation === 'divide') {
            res = divide(a, b);
        } else {
            res = calc.calculate(operation, a, b);
        }
        result.textContent = res;
        result.className = 'success';
        updateHistory();
    } catch (err) {
        result.textContent = err.message;
        result.className = 'error';
    }
}

function updateHistory() {
    historyList.innerHTML = calc.getHistory()
        .map(item => `<li>${item}</li>`)
        .join('');
}

function clearAll() {
    num1.value = '';
    num2.value = '';
    result.textContent = '-';
    result.className = '';
    calc.clearHistory();
    updateHistory();
}