import { TestRunnerError } from "../runner/errors";

type AllowedLiterals = number | boolean | string;
const Literals = new Set(['number', 'boolean', 'string']);

function assertLiteralsArgs<T extends AllowedLiterals>(...t: Array<T>) {
    for (let i of t) {
        if (!Literals.has(typeof i)) {
            throw new TestRunnerError("Invalid argument, invalid type");
        }
    }

    if (t.length <= 1) {
        return;
    }
    
    let typeFound = typeof t[0];

    for (let i = 1; i < t.length; i++) {

        if (typeof t[i] !== typeFound) {
            throw new TestRunnerError("Invalid argument, different types");
        }

        typeFound = typeof t[i];
    }
}

/**
 * Asserts strict equality between two values of allowed literal types.
 * Throws a detailed error message if values don't match, with optional custom message.
 * 
 * @template T - Type extending AllowedLiterals (typically primitive values: string, number, boolean, etc.)
 * @param expected - The anticipated value for comparison
 * @param actual - The received value to validate against expected
 * @param errorMessage - Optional custom message to prepend to error details
 * 
 * @throws {Error} When values don't match, containing:
 * - Custom message (if provided)
 * - Expected/actual values comparison
 * 
 * @example Basic usage
 * equals(42, 42); // No error
 * 
 * @example With custom message
 * equals("hello", "world", "String mismatch occurred");
 * // Throws: "String mismatch occurred \nexpected: hello actual: world"
 */
export function equals<T extends AllowedLiterals>(expected: T, actual: T, errorMessage: string | null = null) {
    assertLiteralsArgs(expected, actual);

    const equal = expected === actual;
    
    if (!equal) {
        let info = '';
        if (errorMessage != null) {
            info += `${errorMessage} \n`;
        }
        info += `expected: ${expected} actual: ${actual} `;
        throw Error(info);
    }
}

/*
export function notEquals<T extends AllowedLiterals>(expected: T, actual: T, errorMessage: string | null = null) {
    if (!Literals.has(typeof expected) || !Literals.has(typeof actual)) {
        throw new TestRunnerError("Invalid argument");
    }
    if (typeof expected !== typeof actual) {
        throw new TestRunnerError("Invalid argument");
    }

    const equal = expected !== actual;
    
    if (!equal) {
        let info = '';
        if (errorMessage != null) {
            info += `${errorMessage} \n`;
        }
        info += `expected: ${expected} actual: ${actual} `;
        throw Error(info);
    }
}

export function notEquals(expected, actual, errorMessage) {
    const notequal = expected !== actual;

    if (!notequal) {
        let info = '';
        if (errorMessage) info += `${errorMessage} \n`;
        info += `expected: ${expected} actual: ${actual} `;
        throw Error(info);
    }
}

export function objAreEquals(expected, actual, errorMessage) {
    const equal = JSON.stringify(expected) === JSON.stringify(actual);
    if (!equal) {
        let info = '';
        if (errorMessage) info += `${errorMessage} \n`;
        info += `expected: ${JSON.stringify(expected)} actual: ${JSON.stringify(actual)} `;
        throw Error(info);
    }
}

export function objAreNotEquals(expected, actual, errorMessage) {
    const equal = JSON.stringify(expected) === JSON.stringify(actual);
    if (equal) {
        let info = '';
        if (errorMessage) info += `${errorMessage} \n`;
        info += `expected: ${expected} actual: ${actual} `;
        throw Error(info);
    }
}
*/