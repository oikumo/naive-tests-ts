import { TestRunnerError } from "./errors";

export class TestResult {
    #info: string;
    #time: string;
    #errors: Array<string>;
    #consoleLogEntry = Array<String>();
    #testRunnerError: TestRunnerError | null;

    get info() { return this.#info; }
    get time() { return this.#time; }
    get errors() { return [...this.#errors]; }
    get consoleLogEntry() { return [...this.#consoleLogEntry]; }
    get testRunnerError() { return this.#testRunnerError?.clone(); }

    constructor(info: string, time: string, errors: Array<string>, consoleLogEntry: Array<String>, 
        testRunnerError: TestRunnerError | null = null) {
        this.#info = info;
        this.#time = time;
        this.#errors = errors;
        this.#consoleLogEntry = consoleLogEntry;
        this.#testRunnerError = testRunnerError;
    }

    clone() {
        return new TestResult(
            this.#info,
            this.#time,
            [...this.#errors],
            [...this.#consoleLogEntry],
            this.#testRunnerError !== null ? this.#testRunnerError.clone() : null
        );
    }
}
