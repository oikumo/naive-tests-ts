import path from 'path';
import { findFilesInDirectories } from '../utils/utils';
import { TestResult } from './test-result';
import { TestRunnerError } from './errors';

interface ITestRunner {
    processTest: (description: string, func: () => void) => void;
    runAll: () =>  void;
}

class TestRunner implements ITestRunner{

    private currentDir: Array<string>;
    private results: Array<TestResult> = new Array<TestResult>();

    constructor() {
        this.currentDir = new Array<string>(path.join(process.cwd(), 'tests'));
    }

    runAll() {
        this.clearResults();
        const files = findFilesInDirectories(new Set(this.currentDir));
        this.runTests(files, this.processResults);
    }

    private processResults(err: Error , results: Array<TestResult>) {
        if (err) {
            console.error(`test runner import fails - Error${err.message}`);
            process.exit(1);
        }
    
        const testsPassed = results.filter((result) => result.errors.length === 0);
        const testsFailed = results.filter((result) => result.errors.length > 0);
        const testsRunnerError = results.filter((result) => result.testRunnerError !== null);
    
        testsPassed.forEach((result) => {
            console.log(result);
        });
    
        testsFailed.forEach(result => {
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
        console.log('\x1b[33m%s\x1b[0m', `Total: ${results.length}`);
        console.log('\x1b[32m%s\x1b[0m', `Passed: ${testsPassed.length}`);
        console.log('\x1b[31m%s\x1b[0m', `Failed: ${testsFailed.length}`);
        console.log('\x1b[31m%s\x1b[0m', `testsRunnerError: ${testsRunnerError.length}`);
        console.log('\n');

        if (testsFailed.length > 0) {
            process.exit(1);
        }
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
    };

    processTest(description: string, func: () => void) {
        const start = Date.now();
        const errors = Array<any>();
    
        try {
            func();
            const time = `${(Date.now() - start) / 1000} sec`;
            this.addResult(new TestResult(description, time, errors));
        }
        catch (err) {
            if (err instanceof TestRunnerError) {
                errors.push("TEST RUNNER ERROR");
                const time = `${(Date.now() - start) / 1000} sec`;
                this.addResult(new TestResult(description, time, errors, err));
                return;
    
            } else {
                errors.push(err);
            }
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

