import { runAll } from "../../src";
import { TestRunner } from "../../src/runner/process/test-runner";

const localTestDirectory = 'tests/runner/tests-pass-fail'; 
const localTestPassDirectory = 'tests/runner/tests-pass'; 

export async function runAllPass() {
    await runAll(localTestPassDirectory, false);
}

export async function runnerPass() {
    const results = await runner(localTestPassDirectory);
    const passed = 3;
    const failed = 0;
   
    if (!results.testSuccess) {
        throw Error();
    }
    if (passed !== results.passed.length) {
        throw Error();
    }
    if (failed !== results.failed.length) {
        throw Error();
    }
}

export async function runnerPassAndFails() {
    const results = await runner(localTestDirectory);
    const passed = 2;
    const failed = 2;

    if (results.testSuccess) {
        throw Error();
    }
    if (passed !== results.passed.length) {
        throw Error();
    }
    if (failed !== results.failed.length) {
        throw Error();
    }
}

async function runner(localTestDirectory: string) {
    const testRunner = new TestRunner(localTestDirectory);
    const results = await testRunner.run();

    return results;
}