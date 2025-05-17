import path from 'path';
import { findFilesInDirectories } from '../utils/utils';
import { TestResult } from './test-result';
import { TestRunnerError } from './errors';
import { TestRunnerResults } from './test-runner-results';

interface ITestRunner {
    processTest: (description: string, func: (logs: Array<String> | null) => void) => void;
    runAll: () =>  void;
}

class TestRunner implements ITestRunner{

    private currentDir: Array<string>;
    private results: Array<TestResult> = new Array<TestResult>();
    private runnerResults = new TestRunnerResults();

    constructor() {
        this.currentDir = new Array<string>(path.join(process.cwd(), 'tests'));
    }

    runAll() {
        this.clearResults();
        const files = findFilesInDirectories(new Set(this.currentDir));
        this.runTests(files, this.processResults);
    }

    private async runTests(files: Set<string>, cb: (err: any | null, result: Array<TestResult>) => any) {
        const promises = new Array<Promise<any>>();

        for (const file of files) {
            promises.push(import(file));
        }
    
        try {
            await Promise.all(promises);
            cb(null, this.results);
        }
        catch (err) {
            cb(err, this.results);
            return;
        }
    }

    private processResults(err: Error | null, results: Array<TestResult>) {
        if (err) {
            console.error(`test runner import fails - Error${err.message}`);
            process.exit(1);
        }
    
        
        this.runnerResults.results = results;
        this.runnerResults.passed = this.runnerResults.results.filter((result) => result.errors.length === 0);
        this.runnerResults.failed = this.runnerResults.results.filter((result) => result.errors.length > 0);
        this.runnerResults.runnerErrors = this.runnerResults.results.filter((result) => result.testRunnerError !== null);

        this.showResults();

        if (this.runnerResults.failed.length > 0) {
            process.exit(1);
        }
    }

    private showResults() {
        if (this.runnerResults === null) return;

        this.runnerResults.passed.forEach((result) => {
            console.log(result.info);
        });
    
        this.runnerResults.failed.forEach(result => {
            console.error(result.info);
            result.errors.forEach((err) => {
                console.error(err);
            });

            if (result.testRunnerError) {
                console.error(result.testRunnerError.message);
            }
        });

        
        console.log('\nTest Results');
        console.log('------------');
        console.log('\x1b[33m%s\x1b[0m', `Total: ${this.runnerResults.results.length}`);
        console.log('\x1b[32m%s\x1b[0m', `Passed: ${this.runnerResults.passed.length}`);
        console.log('\x1b[31m%s\x1b[0m', `Failed: ${this.runnerResults.failed.length}`);
        console.log('\x1b[31m%s\x1b[0m', `testsRunnerError: ${this.runnerResults.runnerErrors.length}`);
        console.log('\n');
        
        this.runnerResults.results.forEach((result) => {

            console.log(result.info);
            result.consoleLogEntry.forEach((log) => {
               console.log(log); 
            });
            console.log('\n');
        });
    }

    processTest(description: string, func: (logs: Array<string> | null) => void) {
        const start = Date.now();
        const errors = Array<any>();
    
        const logs = new Array<string>();

        try {
            func(logs);
            const time = `${(Date.now() - start) / 1000} sec`;
            this.addResult(new TestResult(description, time, errors, logs));
        }
        catch (err) {
            if (err instanceof TestRunnerError) {
                errors.push("TEST RUNNER ERROR");
            } else {
                errors.push(err);
            }
            const time = `${(Date.now() - start) / 1000} sec`;
            this.addResult(new TestResult(description, time, errors, logs, err));
        }
    }

    private clearResults() {
        this.results.length = 0;
    }

    private addResult(result: TestResult) {
        this.results.push(result);
    }
}

const testRunner: ITestRunner = new TestRunner();
export const test: typeof testRunner.processTest = testRunner.processTest.bind(testRunner);
export const runAll: typeof testRunner.runAll = testRunner.runAll.bind(testRunner);

