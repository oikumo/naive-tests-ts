import { TestRunnerError } from "./errors";
import { TestResult } from "../results/test-result";
import { TestRunner } from "./test-runner";

export function processTest(info: string, func: (logs: Array<string> | null) => void) {
    const start = Date.now();
    const errors = Array<string>();
    const logs = new Array<string>();

    try {
        func(logs);
        const time = `${(Date.now() - start) / 1000} sec`;
        TestRunner.addResult(new TestResult(info, time, errors, logs));
    }
    catch (err) {

        if (err instanceof Error) {
            errors.push(err.message);

        } else {
            errors.push("Undefined error");
        }

        const time = `${(Date.now() - start) / 1000} sec`;

        if (err instanceof TestRunnerError) {
            TestRunner.addResult(new TestResult(info, time, errors, logs, err));
        } else {
            TestRunner.addResult(new TestResult(info, time, errors, logs));
        }

    }
}