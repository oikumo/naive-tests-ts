import { TestRunnerError } from "./errors";
import { TestResult } from "../results/test-result";
import { TestRunner } from "./test-runner";

export function processTest(description: string, func: (logs: Array<string> | null) => void) {
    const start = Date.now();
    const errors = Array<any>();
    const logs = new Array<string>();

    try {
        func(logs);
        const time = `${(Date.now() - start) / 1000} sec`;
        TestRunner.addResult(new TestResult(description, time, errors, logs));
    }
    catch (err) {
        if (err instanceof TestRunnerError) {
            errors.push("TEST RUNNER ERROR");
        } else {
            errors.push(err);
        }
        const time = `${(Date.now() - start) / 1000} sec`;
        TestRunner.addResult(new TestResult(description, time, errors, logs, err));
    }
}