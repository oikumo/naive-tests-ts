import { TestRunnerError } from "./errors";
import { TestResult } from "../results/test-result";
import { TestRunner } from "./test-runner";

export async function processTest(info: string, func: (logs: Array<string> | null) => void | Promise<void>) {
    const start = Date.now();
    const errors = Array<string>();
    const logs = new Array<string>();

    try {
        const result = func(logs);
        if (result && typeof result.then === 'function' && typeof result.catch === 'function') {
            await result;
        }
        // If promise resolved or sync function completed without error:
        const time = `${(Date.now() - start) / 1000} sec`;
        TestRunner.addResult(new TestResult(info, time, errors, logs));
    }
    catch (err: any) { // Catch synchronous errors or promise rejections
        if (err instanceof Error) {
            errors.push(err.message);
        } else {
            // Handle cases where non-Error types might be thrown/rejected
            errors.push(String(err));
        }

        const time = `${(Date.now() - start) / 1000} sec`;

        // Assuming TestRunnerError is a specific type of Error
        if (err instanceof TestRunnerError) {
            TestRunner.addResult(new TestResult(info, time, errors, logs, err));
        } else {
            TestRunner.addResult(new TestResult(info, time, errors, logs));
        }
    }
}