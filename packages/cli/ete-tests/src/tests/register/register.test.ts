import { runFernCli } from "../../utils/runFernCli";
import { init } from "../init/init";

// runFernCli will throw if registering fails
// eslint-disable-next-line jest/expect-expect
it("fern register", async () => {
    const pathOfDirectory = await init();

    await runFernCli(["register-v2", "--log-level", "debug"], {
        cwd: pathOfDirectory,
    });
}, 30_000);
