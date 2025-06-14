import { areArraysEqual } from './assert-equality-arrays';

/**
 * Recursively checks if two items (typically objects or arrays) are deeply equal.
 * - Compares object properties by value. Property order does not matter.
 * - Delegates to `areArraysEqual` for arrays, which compares elements and order.
 * - Considers `NaN` values equal to other `NaN` values.
 * - Returns `false` if types are different (e.g., object vs. array, object vs. primitive).
 * - Handles `null` values: `null` is only equal to `null`.
 * - Note: Does not handle circular references; will cause stack overflow.
 *
 * @param {*} actual - The actual item to compare.
 * @param {*} expected - The expected item to compare against.
 * @returns {boolean} True if the items are deeply equal, false otherwise.
 */
function areObjectsEqual(actual: any, expected: any): boolean {
  if (actual === expected) return true;
  if (actual == null || expected == null || typeof actual !== 'object' || typeof expected !== 'object') {
    return false;
  }

  if (Array.isArray(actual) !== Array.isArray(expected)) return false;

  if (Array.isArray(actual)) { // implies expected is also an array
    return areArraysEqual(actual, expected);
  }

  // Both are non-null, non-array objects
  const actualKeys = Object.keys(actual);
  const expectedKeys = Object.keys(expected);

  if (actualKeys.length !== expectedKeys.length) return false;

  actualKeys.sort();
  expectedKeys.sort();

  for (let i = 0; i < actualKeys.length; i++) {
    if (actualKeys[i] !== expectedKeys[i]) return false;

    const key = actualKeys[i];

    const valActual = actual[key];
    const valExpected = expected[key];

    // Recursively call areObjectsEqual for nested objects/arrays
    if (typeof valActual === 'object' && valActual !== null && typeof valExpected === 'object' && valExpected !== null) {
      if (!areObjectsEqual(valActual, valExpected)) return false;
    } else if (valActual !== valExpected) {
      // Handle NaN comparison
      if (Number.isNaN(valActual) && Number.isNaN(valExpected)) {
        continue;
      }
      return false;
    }
  }

  return true;
}

/**
 * Asserts that two objects are deeply equal.
 * Checks for the same properties and values. Property order does not matter.
 * Nested objects and arrays are also compared deeply.
 * `NaN` values are considered equal to other `NaN` values within properties.
 * Inputs must be non-null objects (not arrays).
 *
 * @template T - The type of the objects to compare, constrained to `object`.
 * @param {T} actual - The actual object.
 * @param {T} expected - The expected object.
 * @param {string} [message] - Optional custom message to prepend if the assertion fails.
 * @throws {Error} If the objects are not deeply equal, or if inputs are not suitable non-array objects.
 * @example
 * import { assertObjectEquals } from './assert-equality-objects';
 *
 * assertObjectEquals({ a: 1, b: { c: 2 } }, { b: { c: 2 }, a: 1 }); // Passes
 * assertObjectEquals({ value: NaN }, { value: NaN }); // Passes
 *
 * try {
 *   assertObjectEquals({ a: 1 }, { a: 1, b: 2 }, "Objects should match");
 * } catch (e) {
 *   console.error(e.message); // "Objects should match: Objects are not equal. Expected: {"a":1,"b":2}, Actual: {"a":1}" (or similar)
 * }
 *
 * try {
 *   assertObjectEquals([1, 2], { foo: 'bar' });
 * } catch (e) {
 *   console.error(e.message); // "Both arguments must be non-null objects. Got array and object..."
 * }
 */
export function assertObjectEquals<T extends object>(actual: T, expected: T, message?: string): void {
  if (typeof actual !== 'object' || actual === null || Array.isArray(actual) ||
      typeof expected !== 'object' || expected === null || Array.isArray(expected)) {
    let actualType = Array.isArray(actual) ? 'array' : (actual === null ? 'null' : typeof actual);
    let expectedType = Array.isArray(expected) ? 'array' : (expected === null ? 'null' : typeof expected);
    throw new Error(`Both arguments must be non-null objects. Got ${actualType} and ${expectedType}. For array comparison, use assertArrayEquals.`);
  }
  if (!areObjectsEqual(actual, expected)) {
    let errorMessageStr = message ? `${message}: ` : '';
    errorMessageStr += `Objects are not equal. Expected: ${JSON.stringify(expected)}, Actual: ${JSON.stringify(actual)}`;
    throw new Error(errorMessageStr);
  }
}

/**
 * Asserts that two objects are NOT deeply equal.
 * Checks that objects differ in properties or values. Property order does not affect equality (i.e., if they only differ by order, they are considered equal, and this assertion would fail).
 * Nested objects and arrays are also compared deeply.
 * `NaN` values are considered equal.
 * Inputs must be non-null objects (not arrays).
 *
 * @template T - The type of the objects to compare, constrained to `object`.
 * @param {T} actual - The actual object.
 * @param {T} expected - The object that `actual` is expected not to be equal to.
 * @param {string} [message] - Optional custom message to prepend if the assertion fails (i.e., if objects are equal).
 * @throws {Error} If the objects are deeply equal, or if inputs are not suitable non-array objects.
 * @example
 * import { assertObjectNotEquals } from './assert-equality-objects';
 *
 * assertObjectNotEquals({ a: 1, b: 2 }, { a: 1, c: 2 }); // Passes
 * assertObjectNotEquals({ value: 1 }, { value: NaN }); // Passes
 *
 * try {
 *   assertObjectNotEquals({ a: 1, b: 2 }, { b: 2, a: 1 }, "Objects should differ");
 * } catch (e) {
 *   console.error(e.message); // "Objects should differ: Objects are equal. Expected not to be: {"b":2,"a":1}" (or similar)
 * }
 */
export function assertObjectNotEquals<T extends object>(actual: T, expected: T, message?: string): void {
  if (typeof actual !== 'object' || actual === null || Array.isArray(actual) ||
      typeof expected !== 'object' || expected === null || Array.isArray(expected)) {
    let actualType = Array.isArray(actual) ? 'array' : (actual === null ? 'null' : typeof actual);
    let expectedType = Array.isArray(expected) ? 'array' : (expected === null ? 'null' : typeof expected);
    throw new Error(`Both arguments must be non-null objects. Got ${actualType} and ${expectedType}. For array comparison, use assertArrayNotEquals.`);
  }
  if (areObjectsEqual(actual, expected)) {
    let errorMessageStr = message ? `${message}: ` : '';
    errorMessageStr += `Objects are equal. Expected not to be: ${JSON.stringify(expected)}`;
    throw new Error(errorMessageStr);
  }
}
