export class TestRunnerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TestRunnerError";
      }
}

export class TestRunnerExpectedError extends Error {
  constructor(message: string) {
      super(`TestRunnerExpectedError: ${message}`);
      this.name = "TestRunnerExpectedError";
    }
}