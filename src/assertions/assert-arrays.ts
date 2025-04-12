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
*/