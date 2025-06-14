import { assertArrayEquals, assertArrayNotEquals } from '../../src/assertions/assert-equality-arrays';
import { shouldFail } from '../../src/assertions/assert-errors';

export function assertArrayEqualsPassCases() {
  assertArrayEquals([], []);
  assertArrayEquals([1, 2, 3], [1, 2, 3]);
  assertArrayEquals([1, "hello", true, null, undefined], [1, "hello", true, null, undefined]);
  assertArrayEquals([1, [2, 3], 4], [1, [2, 3], 4]);
  assertArrayEquals([1, [2, [3, 4]], 5], [1, [2, [3, 4]], 5]);
  const obj1 = { a: 1 };
  const obj2 = { b: 2 };
  assertArrayEquals([obj1, obj2], [obj1, obj2]);
}

export async function assertArrayEqualsFailCases() {
  await shouldFail(() => assertArrayEquals([1, 2], [1, 2, 3]), 'Arrays are not equal. Expected: [1,2,3], Actual: [1,2]');
  await shouldFail(() => assertArrayEquals([1, 2, 3], [1, 2, 4]), 'Arrays are not equal. Expected: [1,2,4], Actual: [1,2,3]');
  await shouldFail(() => assertArrayEquals([1, "hello", true], [1, "world", true]), 'Arrays are not equal. Expected: [1,"world",true], Actual: [1,"hello",true]');
  await shouldFail(() => assertArrayEquals([1, [2, 3], 4], [1, [2, 0], 4]), 'Arrays are not equal. Expected: [1,[2,0],4], Actual: [1,[2,3],4]');
  await shouldFail(() => assertArrayEquals([1, [2, 3]], [1, 2, 3] as any), 'Arrays are not equal. Expected: [1,2,3], Actual: [1,[2,3]]');
  await shouldFail(() => assertArrayEquals([1, 2, 3], [1, "2", 3] as any), 'Arrays are not equal. Expected: [1,"2",3], Actual: [1,2,3]');
  await shouldFail(() => assertArrayEquals([NaN], [NaN]), 'Arrays are not equal. Expected: [null], Actual: [null]');
  await shouldFail(() => assertArrayEquals([{ a: 1 }], [{ a: 1 }]), 'Arrays are not equal. Expected: [{"a":1}], Actual: [{"a":1}]');
  await shouldFail(() => assertArrayEquals(null as any, []), 'Both arguments must be arrays.');
  await shouldFail(() => assertArrayEquals([], null as any), 'Both arguments must be arrays.');
}

export function assertArrayNotEqualsPassCases() {
  assertArrayNotEquals([1, 2], [1, 2, 3]);
  assertArrayNotEquals([1, 2, 3], [1, 2, 4]);
  assertArrayNotEquals([1, "hello", true], [1, "world", true]);
  assertArrayNotEquals([1, [2, 3], 4], [1, [2, 0], 4]);
  assertArrayNotEquals([1, [2, 3]], [1, 2, 3] as any);
  assertArrayNotEquals([1, 2, 3], [1, "2", 3] as any);
  assertArrayNotEquals([NaN], [NaN]);
  assertArrayNotEquals([{ a: 1 }], [{ a: 1 }]);
}

export async function assertArrayNotEqualsFailCases() {
  await shouldFail(() => assertArrayNotEquals([], []), 'Arrays are equal. Expected not to be: []');
  await shouldFail(() => assertArrayNotEquals([1, 2, 3], [1, 2, 3]), 'Arrays are equal. Expected not to be: [1,2,3]');
  await shouldFail(() => assertArrayNotEquals([1, "hello", true], [1, "hello", true]), 'Arrays are equal. Expected not to be: [1,"hello",true]');
  await shouldFail(() => assertArrayNotEquals([1, [2, 3], 4], [1, [2, 3], 4]), 'Arrays are equal. Expected not to be: [1,[2,3],4]');
  const obj1 = { a: 1 };
  const obj2 = { b: 2 };
  await shouldFail(() => assertArrayNotEquals([obj1, obj2], [obj1, obj2]), 'Arrays are equal. Expected not to be: [{"a":1},{"b":2}]');
  await shouldFail(() => assertArrayNotEquals(null as any, []), 'Both arguments must be arrays.');
  await shouldFail(() => assertArrayNotEquals([], null as any), 'Both arguments must be arrays.');
}
