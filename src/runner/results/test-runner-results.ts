import { TestResult } from './test-result';


export class TestRunnerResults {
    results = new Array<TestResult>();
    testImportError: Error | null = null;
    testFailError = false;
    

    get passed() {
        return [...this.results.filter((result) => result.errors.length === 0)];
    }

    get failed() { 
        return [...this.results.filter((result) => result.errors.length > 0)];
    }

    get runnerErrors() {
        return [...this.results.filter((result) => result.testRunnerError !== null)];
    }

    constructor() {
    }

    clone() {
        const newResults = new TestRunnerResults();
        newResults.update(this.results);

        return newResults;
    }

    update(results: Array<TestResult>) {
        this.results = new Array<TestResult>();

        for (let i = 0; i < results.length; i++) {
            this.results.push(results[i].clone());
        }
    }

    clear() {
        this.results.length = 0;
    }
}
