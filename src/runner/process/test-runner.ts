import path from 'path';
import { findFilesInDirectories } from '../../utils/utils';
import { TestResult } from '../results/test-result';
import { TestRunnerResults } from '../results/test-runner-results';

export class TestRunner {
    #currentDir: Array<string>;
    static runnerResults = new TestRunnerResults();
    public static pendingTestPromises: Promise<void>[] = []; // Added static member

    static clearResults() { TestRunner.runnerResults.clear(); }
    
    static addResult(result: TestResult) { TestRunner.runnerResults.results.push(result); }

    constructor(localTestsPath = 'tests') {
        this.#currentDir = new Array<string>(path.join(process.cwd(), localTestsPath));
    }

    async run() {
        TestRunner.clearResults();
        TestRunner.pendingTestPromises = []; // Reset pending promises
        const files = findFilesInDirectories(new Set(this.#currentDir));

        await this.runTests(files, (runPhaseError: Error | null) => {
            if (runPhaseError !== null) {
                // If an error already exists on runnerResults.testImportError, this will overwrite it.
                // This is acceptable as errors in later stages (like awaiting pendingTestPromises)
                // are arguably more critical or indicative of the final state.
                TestRunner.runnerResults.testImportError = runPhaseError;
            }
        });

        const results = TestRunner.runnerResults.clone();
        TestRunner.clearResults();
        TestRunner.pendingTestPromises = []; // Clear promises after run completion as well

        return results;
    }

    // cbForRunPhaseError is for critical errors during file imports or awaiting test completions
    private async runTests(files: Set<string>, cbForRunPhaseError: (runPhaseError: Error | null) => void) {
        try {
            const importPromises = Array.from(files).map(file => import(file));
            await Promise.all(importPromises);
            // Imports succeeded. No error to report via cbForRunPhaseError for this stage.
        } catch (err: any) {
            const importError = err instanceof Error ? err : new Error(String(err));
            cbForRunPhaseError(importError);
            return; // Stop if imports fail, as tests might not have been registered correctly
        }

        // Now await all pending test promises that were queued by processTest calls during imports
        try {
            await Promise.all(TestRunner.pendingTestPromises);
            // If imports were successful and all test promises resolved (or were handled by processTest),
            // then there's no run phase error to report.
            cbForRunPhaseError(null);
        } catch (err: any) {
            // This catches if Promise.all(TestRunner.pendingTestPromises) itself rejects.
            // This implies an unhandled rejection from one of the test promises that wasn't
            // converted into a TestResult by processTest, which would be an unexpected critical failure.
            console.error("Critical error occurred while awaiting test execution completion:", err);
            const executionError = err instanceof Error ? err : new Error(String(err));
            cbForRunPhaseError(executionError); // Signal this as a run-level error
        }
    }
}
