import { equals } from '../../src/assertions/assert-equality';
import { shouldFail, shouldFailWithArgs } from '../../src/assertions/assert-errors'
import { TestRunnerExpectedError } from '../../src/runner/process/errors';

export function assertErrorPass() {
    shouldFail(() => { throw Error(); });
    shouldFail(() => { equals(2,3); });
    shouldFail(() => { equals(2,4); }, "expected: 2 actual: 4 ");

    const testFunction = (a,b) => { equals(a,b); };
    shouldFailWithArgs(testFunction, [1,2]);
    shouldFailWithArgs(testFunction, [1,2], "expected: 1 actual: 2 ");
}

export async function assertErrorFail() {
    const testFunction = (a,b) => { equals(a,b); };

    try {
        await shouldFailWithArgs( (a, b ) => { new Error()}, [1,1]);
        throw new TestRunnerExpectedError("Error: Fail expected, function shouldn't throw an error");
    } catch {}


    try {
        await shouldFailWithArgs(testFunction, [1,1]);
        throw new TestRunnerExpectedError("Error: Fail expected, function shouldn't throw an error");
    } catch {}

    try {
        await shouldFailWithArgs(testFunction, [1,1, "s"], "Error: Fail expected");
        throw new TestRunnerExpectedError("Error: Fail expected, 3 args given, but 2 are required");
    } catch {}

    try {
        await shouldFailWithArgs(testFunction, null, "Error: Fail expected");
        throw new TestRunnerExpectedError("Error: Fail expected, null args provided, 2 are required");
    } catch {}
}
