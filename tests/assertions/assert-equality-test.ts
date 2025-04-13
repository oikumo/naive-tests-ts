import { equals } from "../../src/assertions/assert-equality";
import { TestRunnerError } from "../../src/runner/errors";

export function assertEquailityTest() {
    equals(1, 1);
    equals(2, 2);
    equals("s", "s");

    /*

    let error: TestRunnerError | null = null;
    try {
        equals(1, "1");    
    } catch (err) {
        if (err instanceof TestRunnerError) {
            error = err;
        }
    }

    if ((error instanceof TestRunnerError)) {
        throw error;
    }

    
    /*
    const arr1 = [1,2,2];
    const arr2 = [1,2,3];
    equals(arr1, arr2);
    */

    //equals();

    /*
    notEquals(1, 2);
    shouldFail(equals, [1, 0]);
    shouldFail(notEquals, [0, 0]);
    objAreEquals({ x: 3, y: 4 }, { x: 3, y: 4 });
    objAreNotEquals({ x: 1, c: '22' }, { x: 2 });
    shouldFail(objAreEquals, [{ www: '22' }, { x: 3, y: 4 }]);
    shouldFail(objAreEquals, [null, { x: 3, y: 4 }]);
    shouldFail(objAreNotEquals, [{ x: 1, y: 3 }, { x: 1, y: 3 }]);
    */
}