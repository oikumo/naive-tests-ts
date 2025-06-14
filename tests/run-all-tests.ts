import { assertEquailityPassCases, assertEquailityFailCases } from "./assertions/assert-equality-test";
import { assertErrorFail, assertErrorPass } from "./assertions/assert-errors-test";
import { FrameworkTestGroup, FrameworkTestGroupAsync } from "./framework-test-group";
import { FrameworkResult } from "./framework-test-result";
import { runAllPassAsync, runnerPassAsync, runnerPassAndFailsAsync } from "./runner/test-runner-test";

const frameworkTest = new FrameworkTestGroup(
    assertEquailityPassCases, 
    assertEquailityFailCases,
    assertErrorPass,
    assertErrorFail,
    runAllPassAsync
);

const frameworkTestAsync = new FrameworkTestGroupAsync(
    runnerPassAsync(),
    runnerPassAndFailsAsync()
);

async function runAllTest() {
    
    const resultsSync = new FrameworkResult(await frameworkTest.run());
    const resultsAsync = new FrameworkResult(await frameworkTestAsync.runAsync());

    console.log('Native Test TS lib test execution results');
    console.log('-----------------------------------------');

    resultsSync.show('Sync tests results');
    resultsAsync.show('Async tests results');
    

    if (resultsSync.fails.length > 0 || resultsAsync.fails.length > 0) {
        console.log('\x1b[31m%s\x1b[0m', 'Test execution has failing tests');
        process.exit(1);
    }

    console.log('\x1b[32m%s\x1b[0m', 'Test execution success');
}

runAllTest();



