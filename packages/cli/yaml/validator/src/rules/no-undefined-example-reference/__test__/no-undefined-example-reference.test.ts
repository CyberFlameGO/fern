import { AbsoluteFilePath, join } from "@fern-api/fs-utils";
import { getViolationsForRule } from "../../../testing-utils/getViolationsForRule";
import { NoUndefinedExampleReferenceRule } from "../no-undefined-example-reference";

describe("no-undefined-example-reference", () => {
    it("simple", async () => {
        const violations = await getViolationsForRule({
            rule: NoUndefinedExampleReferenceRule,
            absolutePathToWorkspace: join(AbsoluteFilePath.of(__dirname), "fixtures", "simple"),
        });

        expect(violations).toEqual([
            {
                message:
                    "Example $malformed-example is malformed. Examples should be formatted like $YourType.ExampleName",
                nodePath: [
                    "types",
                    "MyType",
                    {
                        arrayIndex: 0,
                        key: "examples",
                    },
                ],
                relativeFilepath: "b.yml",
                severity: "error",
            },
            {
                message: "Example $a.MissingType.Example is not defined.",
                nodePath: [
                    "types",
                    "MyType",
                    {
                        arrayIndex: 0,
                        key: "examples",
                    },
                ],
                relativeFilepath: "b.yml",
                severity: "error",
            },
            {
                message: "Example $other.OtherType.OtherExample2 is not defined.",
                nodePath: [
                    "types",
                    "NestedType",
                    {
                        arrayIndex: 0,
                        key: "examples",
                    },
                ],
                relativeFilepath: "folder/nested.yml",
                severity: "error",
            },
        ]);
    });
});
