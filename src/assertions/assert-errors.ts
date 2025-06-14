import { TestRunnerError, TestRunnerExpectedError } from '../runner/process/errors';

// Note: Original type definitions like Lambda and FunctionWithArgs are removed
// as the function signatures in JSDoc and implementation will use explicit types.

/**
 * Asserts that a function throws an error when executed.
 * Handles both synchronous functions and asynchronous functions (those returning a Promise).
 * If `expectedErrorMessage` is provided, it also asserts that the thrown error's message matches the expected string.
 *
 * @async
 * @param {() => any} fn - The function to test. This function can be synchronous or asynchronous (return a Promise).
 * @param {string} [expectedErrorMessage] - Optional. If provided, the thrown error's message must exactly match this string.
 *                                          If omitted, any error thrown by `fn` will pass the assertion.
 * @throws {TestRunnerExpectedError} If `fn` does not throw an error, or if it throws an error but the message
 *                                   does not match `expectedErrorMessage` (when provided).
 * @throws {TestRunnerError} If `fn` is null or not a function.
 * @example
 * import { shouldFail, equals } from 'naive-tests-ts';
 *
 * // Synchronous function throwing an error
 * await shouldFail(() => {
 *   throw new Error("Specific error message");
 * });
 *
 * // Synchronous function with specific error message check
 * await shouldFail(() => {
 *   equals(2, 3, "Values should be equal"); // equals assertion throws an error
 * }, "Values should be equal: Expected 2 to be equal 3");
 *
 * // Asynchronous function throwing an error
 * await shouldFail(async () => {
 *   await new Promise((_, reject) => setTimeout(() => reject(new Error("Async failure")), 10));
 * });
 *
 * // Asynchronous function with specific error message check
 * await shouldFail(async () => {
 *   return Promise.reject(new Error("Async specific message"));
 * }, "Async specific message");
 *
 * // Example of a test that would itself fail (because the function doesn't throw)
 * // await shouldFail(() => {
 * //   console.log("This function does not throw.");
 * // });
 * // Throws: TestRunnerExpectedError: Function call should have thrown an Error
 */
export async function shouldFail(fn: () => any, expectedErrorMessage?: string) {
    // Implementation updated to better align with JSDoc (basic async/error message check)
    if(fn === null || typeof fn !== 'function') {
        throw new TestRunnerError("Invalid Arguments: fn must be a function.");
    }

    try {
        const result = fn();
        if (result && typeof result.then === 'function' && typeof result.catch === 'function') {
            // It's a Promise, so await its settlement
            await result;
        }
        // If synchronous or promise resolved, it means no error was thrown (or promise didn't reject)
    } catch(err: any) {
        // An error was thrown (either sync or promise rejection)
        if (expectedErrorMessage) {
            if (err.message !== expectedErrorMessage) {
                throw new TestRunnerExpectedError(`Expected error message "${expectedErrorMessage}" but got "${err.message}"`);
            }
        }
        return; // Test passed: error thrown as expected (and message matched if specified)
    }

    // If we reach here, no error was thrown by a sync function, or a promise resolved successfully.
    throw new TestRunnerExpectedError(expectedErrorMessage ?
        `Expected function to throw an error with message "${expectedErrorMessage}" but it did not throw or promise resolved.` :
        `Function call should have thrown an Error or Promise should have rejected.`);
}

/**
 * Asserts that a function throws an error when executed with the specified arguments.
 * Handles both synchronous functions and asynchronous functions (those returning a Promise).
 * If `expectedErrorMessage` is provided, it also asserts that the thrown error's message matches the expected string.
 *
 * @async
 * @param {(...args: any[]) => any} fn - The function to test. Can be synchronous or asynchronous.
 * @param {any[]} args - An array of arguments to pass to the function `fn`.
 * @param {string} [expectedErrorMessage] - Optional. If provided, the thrown error's message must exactly match this string.
 *                                          If omitted, any error thrown by `fn` will pass the assertion.
 * @throws {TestRunnerExpectedError} If `fn` does not throw an error when called with `args`, or if it throws an error
 *                                   but the message does not match `expectedErrorMessage` (when provided).
 * @throws {TestRunnerError} If `fn` is null or not a function.
 * @example
 * import { shouldFailWithArgs } from 'naive-tests-ts';
 *
 * const divide = (a: number, b: number) => {
 *   if (b === 0) throw new Error("Cannot divide by zero");
 *   return a / b;
 * };
 *
 * // Synchronous function with specific arguments and error message
 * await shouldFailWithArgs(divide, [10, 0], "Cannot divide by zero");
 *
 * // Asynchronous function example
 * const asyncDivide = async (a: number, b: number) => {
 *   if (b === 0) return Promise.reject(new Error("Async: Cannot divide by zero"));
 *   return a / b;
 * };
 * await shouldFailWithArgs(asyncDivide, [5, 0], "Async: Cannot divide by zero");
 */
export async function shouldFailWithArgs(fn: (...args: any[]) => any, args: any[], expectedErrorMessage?: string) {
    // Implementation updated to better align with JSDoc (basic async/error message check)
    if(fn === null || typeof fn !== 'function') {
        throw new TestRunnerError("Invalid Arguments: fn must be a function.");
    }

    try {
        const result = fn(...args);
        if (result && typeof result.then === 'function' && typeof result.catch === 'function') {
             // It's a Promise, so await its settlement
            await result;
        }
         // If synchronous or promise resolved, it means no error was thrown (or promise didn't reject)
    } catch(err: any) {
        // An error was thrown (either sync or promise rejection)
        if (expectedErrorMessage) {
            if (err.message !== expectedErrorMessage) {
                throw new TestRunnerExpectedError(`Expected error message "${expectedErrorMessage}" but got "${err.message}"`);
            }
        }
        return; // Test passed: error thrown as expected (and message matched if specified)
    }

    // If we reach here, no error was thrown by a sync function, or a promise resolved successfully.
    // Corrected to throw the error.
    throw new TestRunnerExpectedError(expectedErrorMessage ?
        `Expected function to throw an error with message "${expectedErrorMessage}" when called with args [${args.join(', ')}] but it did not throw or promise resolved.` :
        `Function call with args [${args.join(', ')}] should have thrown an Error or Promise should have rejected.`);
}
