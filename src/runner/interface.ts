import { processTest } from "./process/test-process";
import { TestRunner } from "./process/test-runner";
import { showTestRunnerResults } from "./results/test-runner-results-summary";

/**
 * Defines and registers a test case with the test runner.
 * The test execution function can contain assertions and other test logic.
 * It receives a `logs` array to which custom log messages can be pushed during the test.
 * 
 * Note: While the `execution` function itself is currently processed synchronously by `processTest`,
 * for asynchronous operations within a test (e.g., awaiting promises), ensure that
 * `processTest` is adapted or the overall test runner handles promise resolutions
 * or rejections from `execution` if it were to return a Promise. The `test` function
 * itself does not currently await or handle promises returned by `execution`.
 *
 * @param {string} name - A descriptive name or title for the test case. This corresponds to the `info` parameter of `processTest`.
 * @param {(logs: string[] | null) => void} execution - The function containing the test logic. This corresponds to the `func` parameter of `processTest`.
 *                                                   It receives an array for logging; push messages to it.
 *                                                   Throw an error within this function to fail the test.
 * @example
 * import { test, equals } from 'naive-tests-ts'; // Assuming 'equals' is an available assertion
 *
 * test("should correctly add two numbers", (logs) => {
 *   const result = 2 + 2;
 *   logs?.push(`Calculation: 2 + 2 = ${result}`); // Optional logging
 *   equals(result, 4); // Assertion
 * });
 * 
 * test("example of a test that might fail", (logs) => {
 *   logs?.push("Attempting a risky operation...");
 *   equals(true, false, "This assertion will fail");
 * });
 * 
 * // For asynchronous code within 'execution':
 * // test("async conceptual test", (logs) => {
 * //   myAsyncFunction().then(result => {
 * //     logs?.push(`Async result: ${result}`);
 * //     equals(result, expectedAsyncResult);
 * //   }).catch(error => {
 * //     logs?.push(`Async error: ${error.message}`);
 * //     throw error; // Ensure the test fails by re-throwing or throwing a new error
 * //   });
 * //   // IMPORTANT: The 'test' function itself does not wait for promises from 'execution'.
 * //   // The above async pattern might lead to tests finishing before async code completes
 * //   // or error handling issues if not managed carefully within 'execution',
 * //   // unless processTest is enhanced to handle promises from 'execution'.
 * // });
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
