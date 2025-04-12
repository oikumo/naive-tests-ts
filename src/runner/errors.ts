export class TestRunnerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TestRunnerError";
      }
}