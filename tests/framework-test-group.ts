import { FrameworkTestResult } from "./framework-test-result";

export class FrameworkTestGroup {
    tests = Array<() => void>();
    results = new Array<FrameworkTestResult>();

    constructor(...args: Array<()=> void>) {
        if (args.length === 0) {
            return;
        }
        this.tests.push(...args);
    }

    addTests(...args: Array<()=> void>) {
        this.tests.push(...args);
    }

    run() {
        this.results = new Array<FrameworkTestResult>();

        for (const test of this.tests) {
            this.runTest(test);
        }
        return this.results;
    }

    private runTest(f: () => void) {
        try {
            f();
        } catch (err) {
            this.results.push(new FrameworkTestResult(f.name, false, err));
            return;
        }
        this.results.push(new FrameworkTestResult(f.name, true));
    }
}
