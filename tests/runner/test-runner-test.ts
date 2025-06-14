import { runAll } from "../../src";
import { TestRunner } from "../../src/runner/process/test-runner";

const localTestDirectory = 'tests/runner/tests-pass-fail'; 
const localTestPassDirectory = 'tests/runner/tests-pass'; 

export async function runAllPassAsync() {
    await runAll(localTestPassDirectory, false);
}

export async function runnerPassAsync() {
    const results = await runner(localTestPassDirectory);
    const passed = 3;
    const failed = 0;
    const expectedSuccess = true;

    const expectedResult = expectedSuccess === results.testSuccess;
   
    if (!expectedResult) {
        throw Error();
    }
    if (passed !== results.passed.length) {
        throw Error();
    }
    if (failed !== results.failed.length) {
        throw Error();
    }
}

export async function runnerPassAndFailsAsync() {
    const results = await runner(localTestDirectory);
    const passed = 2;
    const failed = 2;
    const expectedSuccess = false;
    
    const expectedResult = expectedSuccess === results.testSuccess;
    if (!expectedResult) {
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