import { TestResult } from './test-result';

export class TestRunnerResults {
    results = new Array<TestResult>();
    passed = new Array<TestResult>();
    failed = new Array<TestResult>();
    runnerErrors = new Array<TestResult>();

    constructor() {
        
        /*new Array<TestResult>();
        for (let i = 0; i < results.length; i++) {
            this.results.push(results[i].clone());
        }
        */
    }
}
