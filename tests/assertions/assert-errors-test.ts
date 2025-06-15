import { equals } from '../../src/assertions/assert-equality';
import { shouldFail, shouldFailWithArgs } from '../../src/assertions/assert-errors'; // Both are now sync
import { TestRunnerExpectedError } from '../../src/runner/process/errors';

// assertErrorPass is now synchronous as shouldFail and shouldFailWithArgs are synchronous.
export function assertErrorPass() {
    // Test that shouldFail works with a function that throws an error.
    shouldFail(() => { throw new Error("Any error message"); });

    // Test that shouldFail works with a function that throws an error, and check the message.
    shouldFail(() => { equals(2,3); }, "expected: 2 actual: 3 ");
    shouldFail(() => { equals(2,4); }, "expected: 2 actual: 4 ");

    const testFunction = (a: number, b: number) => { equals(a,b); };

    // shouldFailWithArgs is now synchronous.
    // Test that shouldFailWithArgs works with a function that throws an error.
    shouldFailWithArgs(testFunction, [1,2]);
    // Test that shouldFailWithArgs works with a function that throws an error, and check the message.
    shouldFailWithArgs(testFunction, [1,2], "expected: 1 actual: 2 ");
}

// assertErrorFail is now synchronous as shouldFailWithArgs is now synchronous.
// This function tests scenarios where shouldFailWithArgs itself is expected to throw an error
// (i.e., when the function passed to shouldFailWithArgs does NOT behave as expected for a "pass" of shouldFailWithArgs).
export function assertErrorFail() {
    const testFunction = (a: number,b: number) => { equals(a,b); };

    try {
        // Scenario 1: The function provided to shouldFailWithArgs does NOT throw an error.
        // `(a:any, b:any) => { new Error("Error not thrown"); }` creates an error but doesn't throw it.
        // So, shouldFailWithArgs should throw a TestRunnerExpectedError.
        shouldFailWithArgs( (a:any, b:any) => { new Error("Error not thrown"); }, [1,1]);
        // If shouldFailWithArgs does NOT throw (i.e., it's bugged), this line will be reached, failing this meta-test.
        throw new TestRunnerExpectedError("Meta-test FAIL: shouldFailWithArgs should have thrown because its target function didn't throw.");
    } catch (e: any) {
        // Expected path: shouldFailWithArgs threw. Verify it's the correct type of error and message.
        // Message from shouldFailWithArgs when inner fn doesn't throw (and no expectedMsg was passed to shouldFailWithArgs):
        // `Function call with args [...] should have thrown an Error.`
        if (!(e instanceof TestRunnerExpectedError) || !e.message.includes("should have thrown an Error")) {
            throw new Error(`assertErrorFail (test1) failed: shouldFailWithArgs threw an unexpected error or message. Got: ${e.message}`);
        }
    }

    try {
        // Scenario 2: The function provided to shouldFailWithArgs (equals(1,1)) does NOT throw an error.
        // So, shouldFailWithArgs should throw a TestRunnerExpectedError.
        shouldFailWithArgs(testFunction, [1,1]);
        throw new TestRunnerExpectedError("Meta-test FAIL: shouldFailWithArgs should have thrown because equals(1,1) didn't throw.");
    } catch (e: any) {
        if (!(e instanceof TestRunnerExpectedError) || !e.message.includes("should have thrown an Error")) {
            throw new Error(`assertErrorFail (test2) failed: shouldFailWithArgs threw an unexpected error or message. Got: ${e.message}`);
        }
    }

    try {
        // Scenario 3: The function provided to shouldFailWithArgs (equals(1,1) with extra arg) does NOT throw.
        // The 3rd arg to shouldFailWithArgs is the expected error message.
        shouldFailWithArgs(testFunction, [1,1, "s"], "This specific message is for matching, not relevant here");
        throw new TestRunnerExpectedError("Meta-test FAIL: shouldFailWithArgs should have thrown because equals(1,1) (with extra arg) didn't throw.");
    } catch (e: any) {
         // Message from shouldFailWithArgs when inner fn doesn't throw (and an expectedMsg *was* passed to shouldFailWithArgs):
         // `Expected function to throw an error with message "${expectedErrorMessage}" ... but it did not throw.`
         if (!(e instanceof TestRunnerExpectedError) || !e.message.includes("but it did not throw")) {
            throw new Error(`assertErrorFail (test3) failed: shouldFailWithArgs threw an unexpected error or message. Got: ${e.message}`);
        }
    }

    try {
        // Scenario 4: fn(...args) where `args` is `null` causes a TypeError (e.g. "args is not iterable").
        // shouldFailWithArgs catches this TypeError.
        // An expectedErrorMessage ("This message...") IS provided to shouldFailWithArgs.
        // shouldFailWithArgs compares the TypeError message with expectedErrorMessage. They don't match.
        // So, shouldFailWithArgs itself throws a TestRunnerExpectedError about message mismatch.
        shouldFailWithArgs(testFunction, null as any, "This message is for matching, not relevant here");
        // This line should NOT be reached if shouldFailWithArgs correctly throws due to message mismatch.
        throw new TestRunnerExpectedError("Meta-test FAIL: shouldFailWithArgs should have thrown due to error message mismatch.");
    } catch (e: any) {
        // Expected path: shouldFailWithArgs threw due to message mismatch.
        // Message from shouldFailWithArgs: `Expected error message "${expectedErrorMessage}" but got "${actualErrorMessage}"`
        if (!(e instanceof TestRunnerExpectedError) || !e.message.includes("but got")) {
             throw new Error(`assertErrorFail (test4) failed: shouldFailWithArgs threw an unexpected error or message. Got: ${e.message}`);
        }
    }
}
