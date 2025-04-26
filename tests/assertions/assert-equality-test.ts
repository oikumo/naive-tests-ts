import { equals, notEquals } from "../../src/index";
import { shouldFail } from "../../src/assertions/assert-errors";

export function assertEquailityPassCases() {
    equals(1, 1);
    equals(2, 2);
    equals(true, true);
    equals(false, false);
    equals("abc", "abc");

    notEquals(1,2);
    notEquals(2,1);
    notEquals(true, false);
    notEquals(false, true);
    notEquals("a", "b");
    notEquals("b", "a");
}

export function assertEquailityFailCases() {
    shouldFail(() => equals(1, 2));
    shouldFail(() => equals(2, 3));
    shouldFail(() => equals("s", "1", "Error"));

    shouldFail(() => notEquals(1,1));
    shouldFail(() => notEquals(true, true));
    shouldFail(() => notEquals(false, false));
    shouldFail(() => notEquals("a", "a"));
}

