// Named exports - export multiple functions
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;

// Export a default function (one per file)
export default function divide(a, b) {
    if (b === 0) throw new Error("Cannot divide by zero");
    return a / b;
}

// Export a class
export class Calculator {
    constructor() {
        this.history = [];
    }
    
    calculate(operation, a, b) {
        let result;
        switch(operation) {
            case 'add': result = add(a, b); break;
            case 'subtract': result = subtract(a, b); break;
            case 'multiply': result = multiply(a, b); break;
            default: throw new Error('Unknown operation');
        }
        this.history.push(`${operation}(${a}, ${b}) = ${result}`);
        return result;
    }
    
    getHistory() {
        return this.history;
    }
}