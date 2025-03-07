import { AbsoluteFilePath, join } from "@fern-api/fs-utils";
import { createLogger } from "@fern-api/logger";
import { createMockTaskContext } from "@fern-api/task-context";
import { createMigrationTester } from "../../../__test__/utils/runFixtureThroughMigration";
import { V12_TO_V11_MIGRATION } from "../migrateFromV12ToV11";

const runMigration = createMigrationTester(V12_TO_V11_MIGRATION);

describe("migrateFromV12ToV11", () => {
    it("works for non-streaming APIs", async () => {
        await expect(
            runMigration({
                pathToFixture: join(AbsoluteFilePath.of(__dirname), "./fixtures/non-streaming"),
            })
        ).resolves.toBeTruthy();
    });

    it("throws on streaming APIs", async () => {
        let output = "";
        const context = createMockTaskContext({
            logger: createLogger((_logLevel, ...logs) => {
                output += logs.join(" ");
            }),
        });
        await expect(
            runMigration({
                pathToFixture: join(AbsoluteFilePath.of(__dirname), "./fixtures/streaming"),
                context: {
                    taskContext: context,
                },
            })
        ).rejects.toBeTruthy();
        expect(output).toContain("does not support streaming responses");
    });
});
