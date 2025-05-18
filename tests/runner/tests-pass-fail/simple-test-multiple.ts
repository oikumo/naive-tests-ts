import { equals, test } from "../../../src";

test('test runner test multiple pass', () => {
    equals(1,1);
});

test('test runner test multiple fail', () => {
    equals(1,2);
});