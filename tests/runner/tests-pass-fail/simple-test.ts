import { equals, test } from "../../../src";

test('test runner simple test pass', () => {
    equals(1,1);
});

test('test runner simple test fail', () => {
    equals(1,2);
});