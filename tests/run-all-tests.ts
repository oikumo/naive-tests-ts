import { assertEquailityPassCases, assertEquailityFailCases } from "./assertions/assert-equality-test";
import { assertErrorFail, assertErrorPass } from "./assertions/assert-errors-test";
import { FrameworkTestGroup } from "./framework-test-group";
import { FrameworkResult } from "./framework-test-result";

const frameworkTest = new FrameworkTestGroup(
    assertEquailityPassCases, 
    assertEquailityFailCases,
    assertErrorPass,
    assertErrorFail
);

const results = new FrameworkResult(frameworkTest.run());

results.show();

if (results.fails.length > 0) {
    process.exit(1);
}