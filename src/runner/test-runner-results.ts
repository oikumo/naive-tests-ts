import { TestResult } from './test-result';

export class TestRunnerResults {
    results: Array<TestResult>;
    passed: Array<TestResult>;
    failed: Array<TestResult>;
    runnerError: Array<TestResult>;

    constructor(results: Array<TestResult>) {
        this.results = new Array<TestResult>();
        for (let i = 0; i < results.length; i++) {
            this.results.push(results[i].clone());
        }

        this.passed = this.results.filter((result) => result.errors.length === 0);
        this.failed = this.results.filter((result) => result.errors.length > 0);
        this.runnerError = this.results.filter((result) => result.testRunnerError !== null);
    }
}
