import { TestRunnerError, TestRunnerExpectedError } from '../runner/process/errors';

/**
 * Asserts that a synchronous function throws an error when executed.
 * If `expectedErrorMessage` is provided, it also asserts that the thrown error's message strictly matches the expected string.
 * This function does not handle asynchronous functions or Promises. For asynchronous operations, use `await shouldFailWithArgs` if applicable or handle promise rejection manually.
 *
 * @param {() => any} fn - The synchronous function to test.
 * @param {string} [expectedErrorMessage] - Optional. If provided, the thrown error's message must strictly match this string.
 *                                          If omitted, any error thrown by `fn` will pass the assertion.
 * @throws {TestRunnerExpectedError} If `fn` does not throw an error, or if it throws an error but the message
 *                                   does not strictly match `expectedErrorMessage` (when provided).
 * @throws {TestRunnerError} If `fn` is null or not a function.
 * @example
 * import { shouldFail, equals } from 'naive-tests-ts';
 *
 * // Synchronous function throwing an error
 * shouldFail(() => {
 *   throw new Error("Specific error message");
 * });
 *
 * // Synchronous function with specific error message check (exact match)
 * shouldFail(() => {
 *   equals(2, 3, "Values should be equal"); // equals assertion throws an error
 * }, "Values should be equal: Expected 2 to be equal 3");
 */
export function shouldFail(fn: () => any, expectedErrorMessage?: string) {
    if(fn === null || typeof fn !== 'function') {
        throw new TestRunnerError("Invalid Arguments: fn must be a function.");
    }

    try {
        fn(); // Call synchronously
    } catch(err: any) {
        // An error was thrown
        if (expectedErrorMessage) {
            if (err.message !== expectedErrorMessage) { // Strict comparison
                throw new TestRunnerExpectedError(`Expected error message "${expectedErrorMessage}" but got "${err.message}"`);
            }
        }
        return; // Test passed: error thrown as expected (and message matched if specified)
    }

    // If we reach here, no error was thrown by the sync function.
    throw new TestRunnerExpectedError(expectedErrorMessage ?
        `Expected function to throw an error with message "${expectedErrorMessage}" but it did not throw.` :
        `Function call should have thrown an Error.`);
}

/**
 * Asserts that a synchronous function throws an error when executed with the specified arguments.
 * If `expectedErrorMessage` is provided, it also asserts that the thrown error's message strictly matches the expected string.
 * This function does not handle asynchronous functions or Promises.
 *
 * @param {(...args: any[]) => any} fn - The synchronous function to test.
 * @param {any[]} args - An array of arguments to pass to the function `fn`.
 * @param {string} [expectedErrorMessage] - Optional. If provided, the thrown error's message must strictly match this string.
 *                                          If omitted, any error thrown by `fn` will pass the assertion.
 * @throws {TestRunnerExpectedError} If `fn` does not throw an error when called with `args`, or if it throws an error
 *                                   but the message does not strictly match `expectedErrorMessage` (when provided).
 * @throws {TestRunnerError} If `fn` is null or not a function.
 * @example
 * import { shouldFailWithArgs } from 'naive-tests-ts';
 *
 * const divide = (a: number, b: number) => {
 *   if (b === 0) throw new Error("Cannot divide by zero");
 *   return a / b;
 * };
 *
 * // Synchronous function with specific arguments and exact error message
 * shouldFailWithArgs(divide, [10, 0], "Cannot divide by zero");
 */
export function shouldFailWithArgs(fn: (...args: any[]) => any, args: any[], expectedErrorMessage?: string) {
    if (fn === null || typeof fn !== 'function') {
        throw new TestRunnerError("Invalid Arguments: fn must be a function.");
    }
    try {
        fn(...args); // Call synchronously
    } catch (err: any) {
        if (expectedErrorMessage) {
            if (err.message !== expectedErrorMessage) { // Strict comparison
                throw new TestRunnerExpectedError(`Expected error message "${expectedErrorMessage}" but got "${err.message}"`);
            }
        }
        return;
    }
    const argsString = Array.isArray(args) ? args.join(', ') : String(args);
    throw new TestRunnerExpectedError(expectedErrorMessage ?
        `Expected function to throw an error with message "${expectedErrorMessage}" when called with args [${argsString}] but it did not throw.` :
        `Function call with args [${argsString}] should have thrown an Error.`);
}
