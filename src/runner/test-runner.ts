import path from 'path';
import { findFilesInDirectories } from '../utils/utils';
import { TestResult } from './test-result';
import { TestRunnerError } from './errors';
import { TestRunnerResults } from './test-runner-results';

interface ITestRunner {
    processTest: (description: string, func: (logs: Array<String> | null) => void) => void;
    runAll: () =>  void;
}

export class TestRunner implements ITestRunner{

    private currentDir: Array<string>;
    static runnerResults = new TestRunnerResults();

    constructor(localTestsPath = 'tests') {
        this.currentDir = new Array<string>(path.join(process.cwd(), localTestsPath));
    }

    async runAll() {
        this.clearResults();
        const files = findFilesInDirectories(new Set(this.currentDir));
        const results = await this.runTests(files, this.processResults);
        return results;
    }

    private async runTests(files: Set<string>, cb: (err: any | null, runnerResults: TestRunnerResults) => any) {
        const promises = new Array<Promise<any>>();

        for (const file of files) {
            promises.push(import(file));
        }
    
        try {
            await Promise.all(promises);
            cb(null, TestRunner.runnerResults);
        }
        catch (err) {
            cb(err, TestRunner.runnerResults);
            return;
        }

        return TestRunner.runnerResults;
    }

    private processResults(err: Error | null, runnerResults: TestRunnerResults) {
        if (err) {
            console.error(`test runner import fails - Error${err.message}`);
            process.exit(1);
        }
    
        
        runnerResults.passed = runnerResults.results.filter((result) => result.errors.length === 0);
        runnerResults.failed = runnerResults.results.filter((result) => result.errors.length > 0);
        runnerResults.runnerErrors = runnerResults.results.filter((result) => result.testRunnerError !== null);


        TestRunner.showResults(runnerResults);

        if (runnerResults.failed.length > 0) {
            process.exit(1);
        }
    }

    static showResults(runnerResults: TestRunnerResults) {
        runnerResults.passed.forEach((result) => {
            console.log(result.info);
        });
    
        runnerResults.failed.forEach(result => {
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
        console.log('\x1b[33m%s\x1b[0m', `Total: ${runnerResults.results.length}`);
        console.log('\x1b[32m%s\x1b[0m', `Passed: ${runnerResults.passed.length}`);
        console.log('\x1b[31m%s\x1b[0m', `Failed: ${runnerResults.failed.length}`);
        console.log('\x1b[31m%s\x1b[0m', `testsRunnerError: ${runnerResults.runnerErrors.length}`);
        console.log('\n');
        
        runnerResults.results.forEach((result) => {

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
        TestRunner.runnerResults.results.length = 0;
        TestRunner.runnerResults.passed.length = 0;
        TestRunner.runnerResults.failed.length = 0;
        TestRunner.runnerResults.runnerErrors.length = 0;
    }

    private addResult(result: TestResult) {
        TestRunner.runnerResults.results.push(result);
    }
}

const testRunner: ITestRunner = new TestRunner();
export const test: typeof testRunner.processTest = testRunner.processTest.bind(testRunner);
export const runAll: typeof testRunner.runAll = testRunner.runAll.bind(testRunner);

