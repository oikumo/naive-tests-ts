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
 * Executes all test cases in the specified directory and handles the test results.
 *
 * This function:
 * 1. Initializes a TestRunner with the provided tests directory path
 * 2. Runs all test cases
 * 3. Displays test results
 * 4. Handles exit codes based on test outcomes
 *
 * @async
 * @function runAll
 * @param {string} [localTestsPath='tests'] - Path to directory containing test files
 * @returns {Promise<void>} Does not return a value directly, but may exit the process
 *
 * @example
 * // Run tests from default 'tests' directory
 * await runAll();
 * 
 * // Run tests from custom directory
 * await runAll('tests/my-tests');
 * 
 * @throws {Error} Will exit process with code 1 if:
 * - There are test import errors
 * - Any test cases fail
 * 
 * @sideeffects
 * - Outputs test results to console
 * - May terminate process with exit code 0 (success) or 1 (failure)
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
