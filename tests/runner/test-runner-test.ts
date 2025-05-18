import { runAll } from "../../src";
import { TestRunner } from "../../src/runner/process/test-runner";
import { showTestRunnerResults } from "../../src/runner/results/test-runner-results-summary";

const localTestDirectory = 'tests/runner/tests'; 
const localTestPassDirectory = 'tests/runner/tests-pass'; 

export async function runAllPass() {
    await runAll(localTestPassDirectory, false);
}

export async function runnerPass() {
    const results = await runner();

    if (results.testFailError !== false) {
        throw Error();
    }
    if (results.passed.length === 0) {
        throw Error();
    }
}

async function runner() {
    const testRunner = new TestRunner(localTestDirectory);
    const results = await testRunner.run();

    return results;
}