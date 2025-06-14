import { processTest } from "./process/test-process";
import { TestRunner } from "./process/test-runner";
import { showTestRunnerResults } from "./results/test-runner-results-summary";

/**
 * Defines and registers a test case with the test runner.
 * The test execution function can contain assertions and other test logic.
 * It can be synchronous or asynchronous (return a Promise). If it returns a Promise,
 * the test runner will await its settlement.
 * The execution function receives a `logs` array to which custom log messages can be pushed.
 *
 * @param {string} name - A descriptive name or title for the test case. This corresponds to the `info` parameter of `processTest`.
 * @param {(logs: string[] | null) => void | Promise<void>} execution - The function containing the test logic.
 *                                                                    It receives an array for logging.
 *                                                                    Throw an error or return a rejected Promise to fail the test.
 * @example
 * import { test, equals } from 'naive-tests-ts';
 *
 * // Synchronous test
 * test("should correctly add two numbers", (logs) => {
 *   const result = 2 + 2;
 *   logs?.push(`Calculation: 2 + 2 = ${result}`);
 *   equals(result, 4);
 * });
 * 
 * // Asynchronous test
 * test("should handle asynchronous operations", async (logs) => {
 *   const delayedResult = await new Promise(resolve => setTimeout(() => resolve(5), 50));
 *   logs?.push(`Async result: ${delayedResult}`);
 *   equals(delayedResult, 5);
 * });
 *
 * test("example of a failing asynchronous test", async (logs) => {
 *   await new Promise((_, reject) => setTimeout(() => reject(new Error("Async task failed")), 10));
 * });
 */
export const test: typeof processTest = processTest;

/**
 * Runs all registered test cases.
 * It discovers test files (assumed to be imported, thereby registering tests via the `test` function),
 * executes them, and then typically displays a summary of the results to the console.
 * The function will cause the Node.js process to exit with a status code of 1 (error)
 * if there are any test import errors or if any test cases fail. Otherwise, it exits with code 0.
 *
 * @async
 * @param {string} [localTestsPath='tests'] - The path to the directory containing test files,
 *                                            relative to the current working directory.
 * @param {boolean} [printResultsInConsole=true] - Whether to print a summary of test results to the console.
 * @returns {Promise<void>} A promise that resolves when all tests have been run and results processed.
 *                          Note that the Node.js process may exit before this promise technically resolves
 *                          in the calling context if tests fail or import errors occur, due to `process.exit()`.
 * @example
 * import { runAll } from 'naive-tests-ts';
 * 
 * // Ensure your test files (which use the 'test' function) are imported before calling runAll.
 * // e.g.: import './my-first-test-file';
 * //       import './my-second-test-file';
 * 
 * (async () => {
 *   try {
 *     await runAll(); // Uses default 'tests' directory and prints results
 *     // If execution reaches here, it means all tests passed and no import errors.
 *     console.log("Test run completed successfully and all tests passed.");
 *   } catch (error) {
 *     // This catch block might not be reached if process.exit() is called internally by runAll.
 *     // It's here for conceptual completeness if runAll's behavior regarding process.exit were different.
 *     console.error("Test runner encountered an unexpected issue:", error);
 *   }
 * })();
 * 
 * // Example with a custom tests path and disabling direct console output from runAll:
 * // (async () => {
 * //   await runAll('src/__tests__', false);
 * //   // You might handle results.testImportError or results.failed manually here if not printing.
 * // })();
 */
export async function runAll(localTestsPath = 'tests', printResultsInConsole = true) {
    const testRunner = new TestRunner(localTestsPath);
    const results = await testRunner.run();

    if (printResultsInConsole) {
        showTestRunnerResults(results);
    }

    if (results.testImportError !== null) {
        if (printResultsInConsole) {
            console.error(`\nTest Runner import test files error: ${results.testImportError.message}`);
        }
        
        process.exit(1);
    }
    
    if (results.failed.length > 0) {
        if (printResultsInConsole) {
            console.error(`\nTest Runner tests failed: ${results.failed.length}`);
        }
        process.exit(1);
    }

    if (printResultsInConsole) {
        console.log('\nTest Runner execution success');
    }
}
