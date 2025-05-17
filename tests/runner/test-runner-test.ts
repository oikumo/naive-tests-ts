import { TestRunner } from "../../src/runner/test-runner";

export function runnerPass() {
    const testRunner = new TestRunner();

    testRunner.runAll();

}