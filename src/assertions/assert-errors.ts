/*
export function raiseError(testFunction, params, errorMessage) {
    let p = params;
    if (p === null) {
        p = [null];
    } else if (p === undefined) {
        p = [undefined];
    } else if (!Array.isArray(p)) {
        p = [p];
    }

    if (!testFunction) throw new Error('No function to evaluate');
    try {
        testFunction.apply(null, p);
    } catch (err) {
        return;
    }
    if (errExpected === null) {
        let info = '';
        if (errorMessage) info += `${errorMessage} \n`;
        info += `should have throws an error, but it does not`;
        throw new Error(info);
    }
}
*/