import { AbsoluteFilePath, join } from "@fern-api/fs-utils";
import { createLogger } from "@fern-api/logger";
import { createMockTaskContext } from "@fern-api/task-context";
import { createMigrationTester } from "../../../__test__/utils/runFixtureThroughMigration";
import { V11_TO_V10_MIGRATION } from "../migrateFromV11ToV10";

const runMigration = createMigrationTester(V11_TO_V10_MIGRATION);

describe("migrateFromV11ToV10", () => {
    it("tranforms auth header correctly", async () => {
        const migrated = await runMigration({
            pathToFixture: join(AbsoluteFilePath.of(__dirname), "./fixtures/simple"),
        });
        expect(migrated.auth).toEqual({
            docs: undefined,
            requirement: "ALL",
            schemes: [
                {
                    _type: "header",
                    availability: {
                        message: undefined,
                        status: "GENERAL_AVAILABILITY",
                    },
                    docs: undefined,
                    name: {
                        name: {
                            camelCase: {
                                safeName: "apiKey",
                                unsafeName: "apiKey",
                            },
                            originalName: "ApiKey",
                            pascalCase: {
                                safeName: "ApiKey",
                                unsafeName: "ApiKey",
                            },
                            screamingSnakeCase: {
                                safeName: "API_KEY",
                                unsafeName: "API_KEY",
                            },
                            snakeCase: {
                                safeName: "api_key",
                                unsafeName: "api_key",
                            },
                        },
                        wireValue: "Authorization",
                    },
                    valueType: {
                        _type: "primitive",
                        primitive: "STRING",
                    },
                },
            ],
        });
    });

    it("throws when header prefix is used", async () => {
        let output = "";
        const context = createMockTaskContext({
            logger: createLogger((_logLevel, ...logs) => {
                output += logs.join(" ");
            }),
        });
        await expect(
            runMigration({
                pathToFixture: join(AbsoluteFilePath.of(__dirname), "./fixtures/auth-header-prefix"),
                context: {
                    taskContext: context,
                },
            })
        ).rejects.toBeTruthy();
        expect(output).toContain("does not support specifying an auth header prefix");
    });
});
