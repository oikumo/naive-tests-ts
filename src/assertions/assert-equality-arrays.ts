/*
export function sameArray(expected, actual, errorMessage) {
    const differences = [];

    if (expected.length !== actual.length) {
        let info = '';
        if (errorMessage) info += `${errorMessage} \n`;
        info += `length doesn't match. expected length: ${expected.length} actual: ${actual.length} `;
        throw new Error(info);
    }
    const actualLength = actual.length;

    for (let i = 0; i < actualLength; i++) {
        if (expected[i] !== actual[i]) {
            differences.push({ index: i, expected: expected[i], actual: actual[i] });
        }
    }

    if (differences.length > 0) {
        let info = '';
        if (errorMessage) info += `${errorMessage} \n`;
        info += `arrays doesn't match`;
        differences.forEach((diff) => {
            info += `\nelement index: ${diff.index} expected: ${diff.expected} actual: ${diff.actual}`;
        });
        throw new Error(info);
    }
}

export function sameArrayElementsOnly(expected, actual, errorMessage) {
    sameArray(expected, actual, errorMessage);
}

export function equalsArrayElements(expected, actual, errorMessage) {
    if (Object.getPrototypeOf(expected) !== Object.getPrototypeOf(actual)) {
        let info = '';
        if (errorMessage) info += `${errorMessage} \n`;
        info += `prototypes doesn't match. expected proto: ${Object.getPrototypeOf(expected)} actual proto: ${Object.getPrototypeOf(actual)} `;
        throw new Error(info);
    }
    sameArray(expected, actual, errorMessage);
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
