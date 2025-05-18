import path from 'path';
import { findFilesInDirectories } from '../../utils/utils';
import { TestResult } from '../results/test-result';
import { TestRunnerResults } from '../results/test-runner-results';

export class TestRunner {
    #currentDir: Array<string>;
    static runnerResults = new TestRunnerResults();

    static clearResults() { TestRunner.runnerResults.clear(); }
    
    static addResult(result: TestResult) { TestRunner.runnerResults.results.push(result); }

    constructor(localTestsPath = 'tests') {
        this.#currentDir = new Array<string>(path.join(process.cwd(), localTestsPath));
    }

    async run() {
        TestRunner.clearResults();
        const files = findFilesInDirectories(new Set(this.#currentDir));
        await this.runTests(files, (err: Error | null) => {
            if (err !== null) { 
                TestRunner.runnerResults.testImportError = err; 
            }
        });

        const results = TestRunner.runnerResults.clone();
        TestRunner.clearResults();

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
        }

        return TestRunner.runnerResults;
    }
}

