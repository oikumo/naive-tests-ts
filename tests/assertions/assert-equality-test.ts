import { equals } from "../../src/assertions/assert-equality";
import { shouldFail } from "../../src/assertions/assert-errors";

export function assertEquailityPassCases() {
    equals(1, 1);
    equals(2, 2);
    equals("s", "s");
}

export function assertEquailityFailCases() {
    shouldFail(() => equals(1, 2));
    shouldFail(() => equals(2, 3));
    shouldFail(() => equals("s", "1", "Error"));
}