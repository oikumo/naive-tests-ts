/*
export function isNull(actual, errorMessage) {
    if (actual !== null) {
        let info = '';
        if (errorMessage) info += `${errorMessage} \n`;
        info += `is not null, actual: ${actual}`;
        throw Error(info);
    }
}

export function notNull(actual, errorMessage) {
    if (actual === null) {
        let info = '';
        if (errorMessage) info += `${errorMessage} \n`;
        info += `is null, actual: ${actual}`;
        throw Error(info);
    }
}

export function areUndefined(actual, errorMessage) {
    if (actual !== undefined) {
        let info = '';
        if (errorMessage) info += `${errorMessage} \n`;
        info += `it is not undefined, actual: ${actual}`;
        throw Error(info);
    }
}

export function areNotUndefinedOrNull(actual, errorMessage) {
    if (actual === undefined || actual === null) {
        let info = '';
        if (errorMessage) info += `${errorMessage} \n`;
        info += `should not be undefined or null, actual: ${actual}`;
        throw Error(info);
    }
}
*/