import { TestResult } from './test-result';

export class TestRunnerResults {
    #results = new Array<TestResult>();
    #passed: Array<TestResult>;
    #failed: Array<TestResult>;
    #runnerError: Array<TestResult>;

    get results() { return this.#results; }
    get passed() { return this.#passed; }
    get failed() { return this.#failed; }
    get runnerErrors() { return this.#runnerError; }


    constructor(results: Array<TestResult>) {
        for (let i = 0; i < results.length; i++) {
            this.#results.push(results[i].clone());
        }

        this.#passed = this.#results.filter((result) => result.errors.length === 0);
        this.#failed = this.#results.filter((result) => result.errors.length > 0);
        this.#runnerError = this.#results.filter((result) => result.testRunnerError !== null);
    }
}
