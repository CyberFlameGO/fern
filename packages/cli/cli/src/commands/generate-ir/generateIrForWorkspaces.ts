import { AbsoluteFilePath, stringifyLargeObject } from "@fern-api/fs-utils";
import { GenerationLanguage, GeneratorAudiences } from "@fern-api/generators-configuration";
import { Project } from "@fern-api/project-loader";
import { writeFile } from "fs/promises";
import path from "path";
import { CliContext } from "../../cli-context/CliContext";
import { generateIrForFernWorkspace } from "./generateIrForFernWorkspace";

export async function generateIrForWorkspaces({
    project,
    irFilepath,
    cliContext,
    generationLanguage,
    audiences,
}: {
    project: Project;
    irFilepath: AbsoluteFilePath;
    cliContext: CliContext;
    generationLanguage: GenerationLanguage | undefined;
    audiences: GeneratorAudiences;
}): Promise<void> {
    await Promise.all(
        project.workspaces.map(async (workspace) => {
            await cliContext.runTaskForWorkspace(workspace, async (context) => {
                if (workspace.type === "openapi") {
                    context.failWithoutThrowing("Generating from OpenAPI not currently supported.");
                    return;
                }
                const intermediateRepresentation = await generateIrForFernWorkspace({
                    workspace,
                    context,
                    generationLanguage,
                    audiences,
                });
                const irOutputFilePath = path.resolve(irFilepath);
                await writeFile(
                    irOutputFilePath,
                    await stringifyLargeObject(intermediateRepresentation, { pretty: true })
                );
                context.logger.info(`Wrote IR to ${irOutputFilePath}`);
            });
        })
    );
}
