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


export class FrameworkTestGroupAsync {
    tests = Array<Promise<void>>();
    results = new Array<FrameworkTestResult>();

    constructor(...args: Array<Promise<void>>) {
        if (args.length === 0) {
            return;
        }
        this.tests.push(...args);
    }

    addTests(...args: Array<Promise<void>>) {
        this.tests.push(...args);
    }

    async runAsync() {
        this.results = new Array<FrameworkTestResult>();


        for (const test of this.tests) {
            try {
                await test;
                this.results.push(new FrameworkTestResult('a', true));
            } catch (err) {
                this.results.push(new FrameworkTestResult('b', false, err));    
            }
            
        }

        return this.results;
    }
}
