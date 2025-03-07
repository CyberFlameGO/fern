import { AbsoluteFilePath, join } from "@fern-api/fs-utils";
import { createMockTaskContext } from "@fern-api/task-context";
import { cp, readFile } from "fs/promises";
import tmp from "tmp-promise";
import { migration } from "../migration";

const FIXTURES_PATH = join(AbsoluteFilePath.of(__dirname), "fixtures");

describe("add-mode-to-draft-generators", () => {
    it("simple", async () => {
        const fixturePath = join(FIXTURES_PATH, "simple");
        const tmpDir = await tmp.dir();

        await cp(fixturePath, tmpDir.path, { recursive: true });
        process.chdir(tmpDir.path);

        await migration.run({
            context: createMockTaskContext(),
        });

        const newGeneratorsYml = (
            await readFile(join(AbsoluteFilePath.of(tmpDir.path), "fern/api/generators.yml"))
        ).toString();

        expect(newGeneratorsYml).toMatchSnapshot();
    });
});
