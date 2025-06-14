/**
 * Recursively checks if two arrays are deeply equal.
 * Elements are compared by strict equality (`===`). If elements are arrays,
 * they are recursively compared using this function.
 * Handles nested arrays and different data types within arrays (compared by strict equality).
 *
 * @template T - The type of elements in the arrays.
 * @param {T[]} a - The first array.
 * @param {T[]} b - The second array.
 * @returns {boolean} True if the arrays are deeply equal, false otherwise.
 */
export function areArraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    const valA = a[i];
    const valB = b[i];

    if (Array.isArray(valA) && Array.isArray(valB)) {
      // If both values are arrays, recurse
      if (!areArraysEqual(valA, valB)) {
        return false;
      }
    } else if (valA !== valB) {
      // For non-array values (including objects), use strict equality.
      // This means objects are compared by reference.
      return false;
    }
  }
  return true;
}

/**
 * Asserts that two arrays are deeply equal.
 * It checks for the same elements in the same order. Nested arrays are also compared deeply.
 * Non-array inputs will cause an error.
 *
 * @template T - The type of elements in the arrays.
 * @param {T[]} actual - The actual array.
 * @param {T[]} expected - The expected array.
 * @param {string} [message] - Optional custom message to include if the assertion fails.
 *                             Note: Current implementation appends this message to a default error structure if provided,
 *                             or constructs a default message if not. The primary error information about actual/expected
 *                             values is always included.
 * @throws {Error} If the arrays are not deeply equal, or if either `actual` or `expected` is not an array.
 * @example
 * import { assertArrayEquals } from './assert-equality-arrays';
 *
 * assertArrayEquals([1, [2, 3]], [1, [2, 3]]); // Passes
 *
 * try {
 *   assertArrayEquals([1, 2, 3], [1, 2, 4], "Arrays should match");
 * } catch (e) {
 *   console.error(e.message); // Example: "Arrays are not equal. Expected: [1,2,4], Actual: [1,2,3]"
 * }
 *
 * try {
 *   assertArrayEquals(null, [1,2,3]);
 * } catch (e) {
 *   console.error(e.message); // "Both arguments must be arrays."
 * }
 */
export function assertArrayEquals<T>(actual: T[], expected: T[], message?: string): void {
  if (!Array.isArray(actual) || !Array.isArray(expected)) {
    throw new Error("Both arguments must be arrays.");
  }
  if (!areArraysEqual(actual, expected)) {
    let errorMessage = message ? `${message}: ` : '';
    errorMessage += `Arrays are not equal. Expected: ${JSON.stringify(expected)}, Actual: ${JSON.stringify(actual)}`;
    throw new Error(errorMessage);
  }
}

/**
 * Asserts that two arrays are NOT deeply equal.
 * It checks that the arrays differ either in length, element order, or element values.
 * Nested arrays are also compared deeply. Non-array inputs will cause an error.
 *
 * @template T - The type of elements in the arrays.
 * @param {T[]} actual - The actual array.
 * @param {T[]} expected - The array that `actual` is expected not to be equal to.
 * @param {string} [message] - Optional custom message to include if the assertion fails (i.e., if arrays are equal).
 *                             Similar to assertArrayEquals, this message is prepended if provided.
 * @throws {Error} If the arrays are deeply equal, or if either `actual` or `expected` is not an array.
 * @example
 * import { assertArrayNotEquals } from './assert-equality-arrays';
 *
 * assertArrayNotEquals([1, 2, 3], [1, 2, 4]); // Passes
 * assertArrayNotEquals([1, [2, 3]], [1, [2, 4]]); // Passes
 *
 * try {
 *   assertArrayNotEquals([1, 2, 3], [1, 2, 3], "Arrays should be different");
 * } catch (e) {
 *   console.error(e.message); // Example: "Arrays should be different: Arrays are equal. Expected not to be: [1,2,3]"
 * }
 */
export function assertArrayNotEquals<T>(actual: T[], expected: T[], message?: string): void {
  if (!Array.isArray(actual) || !Array.isArray(expected)) {
    throw new Error("Both arguments must be arrays.");
  }
  if (areArraysEqual(actual, expected)) {
    let errorMessage = message ? `${message}: ` : '';
    errorMessage += `Arrays are equal. Expected not to be: ${JSON.stringify(expected)}`;
    throw new Error(errorMessage);
  }
}
