import { AbsoluteFilePath, join } from "@fern-api/fs-utils";
import { IrVersions } from "../../../ir-versions";
import { createMigrationTester } from "../../../__test__/utils/runFixtureThroughMigration";
import { V4_TO_V3_MIGRATION } from "../migrateFromV4ToV3";

const runMigration = createMigrationTester(V4_TO_V3_MIGRATION);

describe("migrateFromV4ToV3", () => {
    it("adds discriminantValue to errors", async () => {
        const migrated = await runMigration({
            pathToFixture: join(AbsoluteFilePath.of(__dirname), "./fixtures/simple"),
        });

        expect(migrated.types[0]?.examples?.[0]).toEqual(
            IrVersions.V3.types.ExampleType.object({
                properties: [
                    {
                        wireKey: "title",
                        value: IrVersions.V3.types.ExampleTypeReference.primitive(
                            IrVersions.V3.types.ExamplePrimitive.string("hello")
                        ),
                        originalTypeDeclaration: expect.anything(),
                    },
                ],
            })
        );
    });
});
