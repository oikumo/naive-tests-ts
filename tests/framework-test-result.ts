export class FrameworkTestResult {
    passed: boolean;
    functionName: string;
    errors: string | null = null;
    constructor(functionName: string, passed: boolean, errors: string | null = null) {
        this.functionName = functionName;
        this.passed = passed;
        this.errors = errors;
    }
}

export class FrameworkResult {
    results = new Array<FrameworkTestResult>;
    passed = new Array<FrameworkTestResult>;
    fails = new Array<FrameworkTestResult>;
    
    constructor(results: Array<FrameworkTestResult> | null = null) {
        if (results === null) {
            this.results = new Array<FrameworkTestResult>();
        } else {
            this.setResults(results);
        }
        this.compute();
    }

    compute() {
        this.passed = this.results.filter((result) => result.passed);
        this.fails = this.results.filter((result) => !result.passed);
    }

    setResults(results: Array<FrameworkTestResult>) {
        this.results = results;
    }

    show(title: string) {
        console.log(`\n${title}`);
        console.log('-------------');
        console.log('\x1b[32m%s\x1b[0m', `Pass: ${this.passed.length}`);
        console.error(`Fail: ${this.fails.length}`);
        console.log(`Total: ${this.results.length}\n`);
    }
}
