import { TestRunnerError } from "../runner/process/errors";

type AllowedLiterals = number | boolean | string;
const Literals = new Set(['number', 'boolean', 'string']);

/**
 * Validates that all provided arguments are of the same allowed literal type (string, number, or boolean).
 * Throws a TestRunnerError if arguments are invalid (e.g., mixed types, non-literal types).
 * @template T - Type extending AllowedLiterals.
 * @param {...T[]} t - An array of arguments to validate.
 * @throws {TestRunnerError} If validation fails due to type mismatch or invalid type.
 */
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
 * Asserts that two literal values are strictly equal (===).
 * Throws an error if the values are not strictly equal.
 * @template T - The type of the literals to compare (number, boolean, or string).
 * @param {T} expected - The expected value.
 * @param {T} actual - The actual value to compare against the expected value.
 * @param {string | null} [errorMessage=null] - An optional custom message to include in the error if the assertion fails.
 * @throws {Error} If `actual` is not strictly equal to `expected`.
 * @example
 * import { equals } from './assert-equality';
 * 
 * equals(5, 5); // Passes
 * equals("hello", "hello"); // Passes
 * 
 * try {
 *   equals(5, 10, "Numbers should be equal");
 * } catch (e) {
 *   console.error(e.message); // "Numbers should be equal \nexpected: 5 actual: 10 "
 * }
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

/**
 * Asserts that two literal values are strictly not equal (!==).
 * Throws an error if the values are strictly equal.
 * @template T - The type of the literals to compare (number, boolean, or string).
 * @param {T} element1 - The first value.
 * @param {T} element2 - The second value to compare against the first value.
 * @param {string | null} [errorMessage=null] - An optional custom message to include in the error if the assertion fails.
 * @throws {Error} If `element1` is strictly equal to `element2`.
 * @example
 * import { notEquals } from './assert-equality';
 *
 * notEquals(5, 10); // Passes
 * notEquals("hello", "world"); // Passes
 * 
 * try {
 *   notEquals(5, 5, "Numbers should not be equal");
 * } catch (e) {
 *   console.error(e.message); // "Numbers should not be equal \nvalues: 5 and 5 are equals, should be different"
 * }
 */
export function notEquals<T extends AllowedLiterals>(element1: T, element2: T, errorMessage: string | null = null) {
    assertLiteralsArgs(element1, element2);

    const different = element1 !== element2;
    
    if (!different) {
        let info = '';
        if (errorMessage != null) {
            info += `${errorMessage} \n`;
        }
        info += `values: ${element1} and ${element2} are equals, should be different`;
        throw Error(info);
    }
}