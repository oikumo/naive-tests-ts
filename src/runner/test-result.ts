import { TestRunnerError } from "./errors";

export class TestResult {
    info: string;
    time: string;
    errors: Array<string>;
    testRunnerError: TestRunnerError | null;

    constructor(info: string, time: string, errors: Array<string>, testRunnerError: TestRunnerError | null = null) {
        this.info = info;
        this.time = time;
        this.errors = errors;
        this.testRunnerError = testRunnerError;
    }
}
