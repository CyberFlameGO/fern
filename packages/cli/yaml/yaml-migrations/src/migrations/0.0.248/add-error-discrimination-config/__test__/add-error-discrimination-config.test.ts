import { AbsoluteFilePath, join, RelativeFilePath } from "@fern-api/fs-utils";
import { createMockTaskContext } from "@fern-api/task-context";
import { cp, readFile } from "fs/promises";
import tmp from "tmp-promise";
import { migration } from "../migration";

const FIXTURES_PATH = join(AbsoluteFilePath.of(__dirname), "fixtures");

const fixtures = ["property", "status-code"];

describe("add-generator-groups", () => {
    for (const fixture of fixtures) {
        it(`${fixture}`, async () => {
            const fixturePath = join(FIXTURES_PATH, RelativeFilePath.of(fixture));
            const tmpDir = await tmp.dir();
            await cp(fixturePath, tmpDir.path, { recursive: true });
            process.chdir(tmpDir.path);

            await migration.run({
                context: createMockTaskContext(),
            });

            const apiYaml = (
                await readFile(join(AbsoluteFilePath.of(tmpDir.path), "fern/api/definition/api.yml"))
            ).toString();

            expect(apiYaml).toMatchSnapshot();
        });
    }
});
