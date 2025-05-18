import { processTest } from "./process/test-process";
import { TestRunner } from "./process/test-runner";
import { showTestRunnerResults } from "./results/test-runner-results-summary";

/**
 * Executes an individual test case and records its results
 * 
 * This function:
 * 1. Times test execution duration
 * 2. Captures logs during test execution
 * 3. Handles both successful and failed test scenarios
 * 4. Records results to the TestRunner's internal state
 * 
 * @function test
 * @param {string} description - Human-readable test description/name
 * @param {(logs: Array<string> | null) => void} func - Test implementation function.
 *        Receives a mutable array for logging test-specific information.
 * 
 * @example
 * // Simple test case
 * test("should add numbers correctly", (logs) => {
 *   const result = 2 + 2;
 *   logs.push(`Addition result: ${result}`);
 *   if (result !== 4) throw new Error("Addition failed");
 * });
 * 
 * @sideeffects
 * - Modifies TestRunner's internal results storage
 * - Mutates the provided logs array
 * - May add entries to TestRunner's error collection
 * 
 * @errorhandling
 * - Catches all errors thrown by test function
 * - Distinguishes between TestRunnerErrors and other errors
 * - Records error details in test results
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
