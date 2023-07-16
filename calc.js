const operationStore = {
    num1: null,
    operator: null,
    nextOperator: null,
    num2: null,
    needClear: false,
    newCalculation: false,
}

const buttons = document.querySelectorAll('#buttons button');
buttons.forEach(item => item.addEventListener('click', operate));

function operate(e) {
    const pressed = e.target.textContent;

    if (pressed >= 0 && pressed <= 9) {
        updateNumber(pressed);
    } else if (pressed === ".") {
        checkDecimal()
    } else if (pressed === "AC") {
        clearCalculator();
    } else {
        switch (pressed) {
            case '%':
            case '/':
            case '*':
            case '-':
            case '+':
                updateOperator(pressed);
                processNumber();
                break;
            case '=':
                operationStore.nextOperator = null;
                processNumber();
                operationStore.num1 = null;
                break;
        }
    }
}

function clearCalculator() {
    operationStore.num1 = null;
    operationStore.operator = null;
    operationStore.num2 = null;
    clearDisplay();
}

function clearDisplay() {
    document.getElementById('display').childNodes[1].textContent = "0"
}

function updateNumber(num) {
    console.table(operationStore);
    if (operationStore.needClear) {
        setNumber("0");
        operationStore.needClear = false;
    }
    const currentNumber = getNumber();

    if (currentNumber === "0") {
        if (num === "0") {
            return;
        } else {
            setNumber(num);
            return;
        }
    } else if (atMaxLength()) {
        return;
    } else {
        setNumber(currentNumber + num);
    }
}

function getNumber() {
    return document.getElementById('display').childNodes[1].textContent;
}

function setNumber(num) {
    document.getElementById('display').childNodes[1].textContent = num;

}

function roundNumber(num) {
    return Math.round(num * 1000) / 1000;
}

function checkDecimal() {
    if (getNumber().indexOf('.') >= 0 || atMaxLength()) {
        return;
    } else {
        setNumber(getNumber() + '.');
    }
}

function atMaxLength() {
    const currentNumber = getNumber();
    return currentNumber.length >= 9 ? true : false;
}

function updateOperator(operator) {
    if (operationStore.operator) {
        operationStore.nextOperator = operator;
    } else {
        operationStore.operator = operator;
    }
}

function processNumber() {
    if (operationStore.num1 === null) {
        operationStore.num1 = getNumber();
        operationStore.needClear = true;
    } else if (operationStore.num2 === null) {
        if (operationStore.operator === null) {
            // fix behaviour after =
            operationStore.num1 = getNumber();
            operationStore.needClear = true;
        } else {
            operationStore.num2 = getNumber();
            calculateResult();
        }
    }
}

function calculateResult() {
    console.table(operationStore);
    let result = 0;
    if (operationStore.operator === '+') {
        result = Number(operationStore.num1) + Number(operationStore.num2);
    } else if (operationStore.operator === '-') {
        result = Number(operationStore.num1) - Number(operationStore.num2);
    } else if (operationStore.operator === "/") {
        if (operationStore.num2 === "0") {
            result = "ERROR"
        } else {
            result = Number(operationStore.num1) / Number(operationStore.num2);
        }
    } else if (operationStore.operator === '*') {
        result = Number(operationStore.num1) * Number(operationStore.num2);
    } else if (operationStore.operator === null || operationStore.operator === '=') {
        result = Number(operationStore.num1) || 0;
    }

    displayResult(result);
    cleanupAfterResult()
}

function displayResult(result) {
    if (!(result === 'ERROR')) {
        setNumber(roundNumber(result));
        operationStore.num1 = result;
    } else {
        setNumber(result);
    }
}

function cleanupAfterResult() {
    operationStore.num2 = null;
    if (operationStore.nextOperator) {
        operationStore.operator = operationStore.nextOperator;
        operationStore.nextOperator = null;
    } else {
        operationStore.operator = null;
    }
    operationStore.needClear = true;
}

