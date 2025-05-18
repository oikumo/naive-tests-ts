import { TestRunnerResults } from './test-runner-results';

export function showTestRunnerResults(testRunnerResults: TestRunnerResults) {
    const allResults = testRunnerResults.results;
    const allResultsCount = allResults.length;
    const passed = testRunnerResults.passed;
    const failed = testRunnerResults.failed;
    const runnerErrors = testRunnerResults.runnerErrors;
    
    passed.forEach((result) => {
        console.log(result.info);
    });

    failed.forEach(result => {
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
    console.log('\x1b[32m%s\x1b[0m', `Passed: ${passed.length}`);
    console.log('\x1b[31m%s\x1b[0m', `Failed: ${failed.length}`);
    console.log('\x1b[31m%s\x1b[0m', `Tests Runner Errors: ${runnerErrors.length}`);
    console.log(`Total: ${allResultsCount}`);
    console.log('\n');
    

    const logEntries = allResults.filter((result) => { return result.consoleLogEntry.length > 0; });

    if (logEntries.length > 0) {
        console.log('Tests log');
        console.log('--------');

        logEntries.forEach((result) => {
            console.log('\x1b[32m%s\x1b[0m', `\nTest: ${result.info}`);
            result.consoleLogEntry.forEach((log) => {
                console.log(log); 
            });
        });
    }

}
