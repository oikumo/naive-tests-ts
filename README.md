[![npm version](https://badge.fury.io/js/naive-tests-ts.svg)](https://badge.fury.io/js/naive-tests-ts)
[![Node.js Package](https://github.com/oikumo/naive-tests-ts/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/oikumo/naive-tests-ts/actions/workflows/npm-publish.yml)

A lightweight testing framework for TypeScript and JavaScript projects.

## Installation

```bash
npm install naive-tests-ts --save-dev
# or
yarn add naive-tests-ts --dev
```

## Usage

### Defining Tests

Import `test` from `naive-tests-ts` to define your test cases. Assertions like `equals`, `assertArrayEquals`, etc., are also available.

```typescript
import { test, equals, assertArrayEquals } from 'naive-tests-ts';

test('should add two numbers correctly', () => {
  equals(2 + 2, 4);
});

test('should compare arrays', () => {
  assertArrayEquals([1, 2, { id: 1 }], [1, 2, { id: 1 }]);
  // This will fail because object {id:1} are different references.
  // For deep object comparison within arrays, you might need custom logic or ensure references are identical.
});
```

### Running Tests

To run your tests, import and use `runAll`. Create a test runner file (e.g., `run-tests.ts`):

```typescript
// run-tests.ts
import { runAll } from 'naive-tests-ts';

// Import your test files to ensure they are registered with the 'test' function
import './path/to/your/test-file-1';
import './path/to/your/test-file-2';
// ... more test files

(async () => {
  const results = await runAll();
  // Optionally, process results (e.g., exit with error code if failures)
  if (results.failed > 0) {
    console.error(`Tests failed: ${results.failed} of ${results.total}`);
    process.exit(1);
  } else {
    console.log(`All ${results.total} tests passed!`);
  }
})();
```

Then execute it with Node.js:

```bash
node run-tests.ts
```

## Available Assertions

### Equality Assertions

#### `equals(actual, expected, message?)`
Asserts that `actual` is strictly equal (`===`) to `expected`.

```typescript
import { equals } from 'naive-tests-ts';

equals(5, 5); // Passes
equals("hello", "hello"); // Passes

// Example of a failing test:
// equals(5, "5", "Value 5 should be equal to string '5'");
// Throws: AssertionError: Value 5 should be equal to string '5': Expected 5 to be equal "5" (actual: number, expected: string)
```

#### `notEquals(actual, unexpected, message?)`
Asserts that `actual` is not strictly equal (`!==`) to `unexpected`.

```typescript
import { notEquals } from 'naive-tests-ts';

notEquals(5, "5"); // Passes
notEquals(5, 6); // Passes

// Example of a failing test:
// notEquals(5, 5, "Value 5 should not be 5");
// Throws: AssertionError: Value 5 should not be 5: Expected 5 to not be equal 5
```

### Array Assertions

#### `assertArrayEquals(actual: any[], expected: any[], message?: string)`
Asserts that two arrays are deeply equal. Arrays must have the same elements in the same order.
- Handles nested arrays by recursively comparing them.
- For object elements within arrays, equality is determined by strict reference (`===`). If deep comparison of object elements is needed, ensure they are the same reference or use `assertObjectEquals` on the elements directly if appropriate.

```typescript
import { assertArrayEquals } from 'naive-tests-ts';

assertArrayEquals([1, 2, 3], [1, 2, 3]); // Passes
assertArrayEquals([1, [2, 3]], [1, [2, 3]]); // Passes

const obj = { id: 1 };
assertArrayEquals([obj], [obj]); // Passes (same object reference)

// Example of a failing test due to different content:
// assertArrayEquals([1, 2, 3], [1, 2, 4], "Array content should match");
// Throws: AssertionError: Array content should match: Arrays are not equal. Expected: [1,2,4], Actual: [1,2,3]

// Example of a failing test due to different object references:
// assertArrayEquals([{ id: 1 }], [{ id: 1 }]);
// Throws: AssertionError: Arrays are not equal. Expected: [{"id":1}], Actual: [{"id":1}]
// (This fails because the objects {id:1} are different instances)
```
*(Note: The exact error message format is illustrative and depends on `JSON.stringify`.)*

#### `assertArrayNotEquals(actual: any[], expected: any[], message?: string)`
Asserts that two arrays are not deeply equal. The same comparison rules as `assertArrayEquals` apply.

```typescript
import { assertArrayNotEquals } from 'naive-tests-ts';

assertArrayNotEquals([1, 2, 3], [1, 2, 4]); // Passes
assertArrayNotEquals([1, [2, 3]], [1, [2, 4]]); // Passes
assertArrayNotEquals([{ id: 1 }], [{ id: 1 }]); // Passes (different object references)

// Example of a failing test:
// assertArrayNotEquals([1, 2, 3], [1, 2, 3], "Arrays should be different");
// Throws: AssertionError: Arrays should be different: Arrays are equal. Expected not to be: [1,2,3]
```

### Object Assertions

#### `assertObjectEquals(actual: object, expected: object, message?: string)`
Asserts that two objects are deeply equal.
- Objects must have the same properties with the same values.
- Property order does not matter.
- Handles nested objects (recursively compared) and arrays within objects (delegated to array equality logic).
- `NaN` property values are considered equal to other `NaN` property values.

```typescript
import { assertObjectEquals } from 'naive-tests-ts';

assertObjectEquals({ a: 1, b: 2 }, { b: 2, a: 1 }); // Passes
assertObjectEquals({ a: 1, b: { c: 3, d: [4, 5] } }, { a: 1, b: { c: 3, d: [4, 5] } }); // Passes
assertObjectEquals({ val: NaN }, { val: NaN }); // Passes

// Example of a failing test:
// assertObjectEquals({ a: 1, b: 2 }, { a: 1, b: "2" }, "Object content should match");
// Throws: AssertionError: Object content should match: Objects are not equal. Expected: {"a":1,"b":"2"}, Actual: {"a":1,"b":2}
```
*(Note: The exact error message format is illustrative.)*

#### `assertObjectNotEquals(actual: object, expected: object, message?: string)`
Asserts that two objects are not deeply equal. The same comparison rules as `assertObjectEquals` apply.

```typescript
import { assertObjectNotEquals } from 'naive-tests-ts';

assertObjectNotEquals({ a: 1, b: 2 }, { a: 1, b: 3 }); // Passes
assertObjectNotEquals({ a: 1, b: { c: 3 } }, { a: 1, b: { c: "3" } }); // Passes

// Example of a failing test:
// assertObjectNotEquals({ a: 1, b: 2 }, { b: 2, a: 1 }, "Objects should be different");
// Throws: AssertionError: Objects should be different: Objects are equal. Expected not to be: {"b":2,"a":1}
```

### Error Assertions

#### `shouldFail(fnToExecute: () => void, failMessage?: string, expectedErrorMsg?: string | RegExp)`
Asserts that `fnToExecute` throws an error. Optionally, verifies the error message.

```typescript
import { shouldFail, equals } from 'naive-tests-ts';

(async () => {
  // Example 1: Expect any error
  await shouldFail(() => {
    equals(2, 3); // This code is expected to throw an assertion error
  });

  // Example 2: Expect a specific error message (string)
  await shouldFail(() => {
    equals(2, 3, "Mismatch");
  }, "Test should have failed with specific message", "Mismatch: Expected 2 to be equal 3");

  // Example 3: Expect error message to match RegExp
  await shouldFail(() => {
    throw new Error("Something went wrong here.");
  }, "Test should throw specific error type", /went wrong/);
})();
```

#### `shouldFailWithArgs(fnToExecute: (...args: any[]) => void, args: any[], failMessage?: string, expectedErrorMsg?: string | RegExp)`
Similar to `shouldFail`, but for functions that take arguments.

*(Further examples for `shouldFailWithArgs` can be added here.)*


## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.