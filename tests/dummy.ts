import { equals, test } from '../src/index';

test('dummy ok 1', () => {
    equals(1, 1);
});


test('fails 1', () => {
    equals("s",2);
});