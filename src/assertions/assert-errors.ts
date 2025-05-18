import { TestRunnerError, TestRunnerExpectedError } from '../runner/process/errors';

type Lambda = () => void;
type FunctionWithArgs = (...args: any[]) => any;

/**
 * Verifies that a function throws an error when executed. Throws a test failure
 * if no error is produced, with optional error message matching.
 * 
 * @param f - The function to test (expected to throw an error when called)
 * @param errorMessage - Optional expected error message string (null for any error)
 * 
 * @throws {TestRunnerError} If the provided function is null
 * @throws {TestRunnerExpectedError} If the function doesn't throw an error
 * 
 * @example Basic usage
 * shouldFail(() => { throw new Error("Failure") });
 * 
 * @example With specific error message
 * shouldFail(
 *   () => { throw new Error("Validation failed") },
 *   "Validation failed"
 * );
 */
export function shouldFail(f: Lambda, errorMessage: string | null = null) {
    if(f === null) { throw new TestRunnerError("Invalid Arguments"); }    

    try {
        f();
    } catch(err) {
        return;        
    }

    if (errorMessage !== null) {
        throw new TestRunnerExpectedError(errorMessage);    
    } else {
        throw new TestRunnerExpectedError(`Function call should thrown an Error`);
    }
}

/**
* Verifies that a function throws an error when executed with specified arguments.
* Throws a test failure if no error occurs, with optional error message validation.
* 
* @param f - Function to test (expected to throw an error when called with arguments)
* @param testArgs - Array of arguments to pass to the function
* @param errorMessage - Optional expected error message (null for any error)
* 
* @throws {TestRunnerError} If invalid arguments are provided
* @throws {TestRunnerExpectedError} If no error is thrown or message doesn't match
* 
* @example Basic usage with arguments
* shouldFailWithArgs(
*   (a, b) => { if (a === b) throw Error("Match") },
*   [2, 2]
* );
* 
* @example With specific error message validation
* shouldFailWithArgs(
*   (age) => { if (age < 18) throw Error("Underage") },
*   [16],
*   "Underage"
* );
*/
export function shouldFailWithArgs(f: FunctionWithArgs, testArgs: any[], errorMessage: string | null = null) {
    if(f === null) { throw new TestRunnerError("Invalid Arguments"); }    

    try {
        f(...testArgs);
    } catch(err) {
        return;        
    }

    if (errorMessage !== null) {
        throw new TestRunnerExpectedError(errorMessage);    
    }

    new TestRunnerExpectedError(`Error, not exception found calling: ${f.toString()}`);
}
