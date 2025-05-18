import { equals, notEquals } from './assertions/assert-equality';
import { shouldFail, shouldFailWithArgs } from './assertions/assert-errors';
import { runAll, test } from './runner/interface';

export {
    runAll,
    equals,
    notEquals,
    shouldFail,
    shouldFailWithArgs,
    test
};