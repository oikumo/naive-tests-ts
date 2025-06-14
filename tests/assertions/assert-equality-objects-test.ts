import { assertObjectEquals, assertObjectNotEquals } from '../../src/assertions/assert-equality-objects';
import { shouldFail } from '../../src/assertions/assert-errors';

export function assertObjectEqualsPassCases() {
  assertObjectEquals({}, {});
  assertObjectEquals({ a: 1, b: 2 }, { a: 1, b: 2 });
  assertObjectEquals({ a: 1, b: 2 }, { b: 2, a: 1 });
  const obj1 = { a: 1, b: "hello", c: true, d: null, e: undefined, f: [1, { x: 10 }] };
  const obj2 = { a: 1, b: "hello", c: true, d: null, e: undefined, f: [1, { x: 10 }] };
  assertObjectEquals(obj1, obj2);
  assertObjectEquals({ a: 1, b: { c: 2, d: 3 } }, { a: 1, b: { c: 2, d: 3 } });
  assertObjectEquals({ a: 1, b: { c: 2, d: { e: 4 } } }, { b: { d: { e: 4 }, c: 2 }, a: 1 });
  assertObjectEquals({ a: [1, 2], b: { c: [3, { d: 4 }] } }, { a: [1, 2], b: { c: [3, { d: 4 }] } });
  assertObjectEquals({ a: NaN }, { a: NaN });
  assertObjectEquals({ a: 1, b: NaN }, { b: NaN, a: 1 });
  const fn = () => {};
  assertObjectEquals({ a: fn, b: { c: fn } }, { a: fn, b: { c: fn } });
}

export async function assertObjectEqualsFailCases() {
  await shouldFail(() => assertObjectEquals({ a: 1 }, { a: 1, b: 2 }), 'Objects are not equal. Expected: {"a":1,"b":2}, Actual: {"a":1}');
  await shouldFail(() => assertObjectEquals({ a: 1, b: 2 }, { a: 1, c: 2 }), 'Objects are not equal. Expected: {"a":1,"c":2}, Actual: {"a":1,"b":2}');
  await shouldFail(() => assertObjectEquals({ a: 1, b: 2 }, { a: 1, b: 3 }), 'Objects are not equal. Expected: {"a":1,"b":3}, Actual: {"a":1,"b":2}');
  await shouldFail(() => assertObjectEquals({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } }), 'Objects are not equal. Expected: {"a":1,"b":{"c":3}}, Actual: {"a":1,"b":{"c":2}}');
  await shouldFail(() => assertObjectEquals({ a: [1, 2] }, { a: [1, 3] }), 'Objects are not equal. Expected: {"a":[1,3]}, Actual: {"a":[1,2]}');
  await shouldFail(() => assertObjectEquals({ a: NaN }, { a: 1 }), 'Objects are not equal. Expected: {"a":1}, Actual: {"a":null}');
  await shouldFail(() => assertObjectEquals({ a: NaN }, { a: undefined }), 'Objects are not equal. Expected: {"a":undefined}, Actual: {"a":null}');
  const fn1 = () => {};
  const fn2 = () => {};
  await shouldFail(() => assertObjectEquals({ a: fn1 }, { a: fn2 }), 'Objects are not equal. Expected: {"a":{}}, Actual: {"a":{}}');
  await shouldFail(() => assertObjectEquals(null as any, {}), "Both arguments must be non-null objects. Got null and object. For array comparison, use assertArrayEquals.");
  await shouldFail(() => assertObjectEquals({}, [] as any), "Both arguments must be non-null objects. Got object and array. For array comparison, use assertArrayEquals.");
}

export function assertObjectNotEqualsPassCases() {
  assertObjectNotEquals({ a: 1 }, { a: 1, b: 2 });
  assertObjectNotEquals({ a: 1, b: 2 }, { a: 1, c: 2 });
  assertObjectNotEquals({ a: 1, b: 2 }, { a: 1, b: 3 });
  assertObjectNotEquals({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } });
  assertObjectNotEquals({ a: [1, 2] }, { a: [1, 3] });
  assertObjectNotEquals({ a: NaN }, { a: 1 });
  assertObjectNotEquals({ a: () => {} }, { a: () => {} });
}

export async function assertObjectNotEqualsFailCases() {
  await shouldFail(() => assertObjectNotEquals({}, {}), 'Objects are equal. Expected not to be: {}');
  await shouldFail(() => assertObjectNotEquals({ a: 1, b: 2 }, { a: 1, b: 2 }), 'Objects are equal. Expected not to be: {"a":1,"b":2}');
  await shouldFail(() => assertObjectNotEquals({ a: 1, b: 2 }, { b: 2, a: 1 }), 'Objects are equal. Expected not to be: {"b":2,"a":1}');
  await shouldFail(() => assertObjectNotEquals({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }), 'Objects are equal. Expected not to be: {"a":1,"b":{"c":2}}');
  await shouldFail(() => assertObjectNotEquals({ a: [1, 2] }, { a: [1, 2] }), 'Objects are equal. Expected not to be: {"a":[1,2]}');
  await shouldFail(() => assertObjectNotEquals({ a: NaN }, { a: NaN }), 'Objects are equal. Expected not to be: {"a":null}');
  const fn = () => {};
  await shouldFail(() => assertObjectNotEquals({ a: fn }, { a: fn }), 'Objects are equal. Expected not to be: {"a":{}}');
  await shouldFail(() => assertObjectNotEquals([] as any, {}), "Both arguments must be non-null objects. Got array and object. For array comparison, use assertArrayNotEquals.");
  await shouldFail(() => assertObjectNotEquals({}, null as any), "Both arguments must be non-null objects. Got object and null. For array comparison, use assertArrayNotEquals.");
}
