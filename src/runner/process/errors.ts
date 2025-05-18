export class TestRunnerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TestRunnerError";
      }

    clone() : TestRunnerError {
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