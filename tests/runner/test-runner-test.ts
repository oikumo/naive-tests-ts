import { TestRunner } from "../../src/runner/test-runner";

export async function runnerPass() {
    const testRunner = new TestRunner('tests/runner/tests');
    const results = await testRunner.runAll();

    if (!results) {
        throw Error('runnerPass error');
    }

    console.log('pass:', results.results[0].info);
}