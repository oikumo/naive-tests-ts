/**
 * Custom error class for errors originating from the test runner itself,
 * such as configuration issues or internal runner problems,
 * distinct from test assertion failures.
 * Extends the base JavaScript `Error` class.
 */
export class TestRunnerError extends Error {
    /**
     * Creates an instance of TestRunnerError.
     * @param {string} message - The human-readable description of the error.
     */
    constructor(message: string) {
        super(message);
        this.name = "TestRunnerError"; // Sets the error name for identification
      }

    /**
     * Creates a clone of the current TestRunnerError instance.
     * The cloned error will have the same `name` (initialized with the original error's name)
     * and `stack` trace as the original error. The `message` of the cloned error
     * will be the `name` of the original error.
     * @returns {TestRunnerError} A new TestRunnerError instance.
     */
    clone() : TestRunnerError {
      // Note: The message for the new error is taken from the original error's name.
      const error = new TestRunnerError(this.name);
      error.stack = this.stack;
      return error;
    }
}

export class TestRunnerExpectedError extends Error {
  constructor(message: string) {
      super(`TestRunnerExpectedError: ${message}`);
      this.name = "TestRunnerExpectedError";
    }
}