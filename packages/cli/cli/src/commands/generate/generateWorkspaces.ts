import { createOrganizationIfDoesNotExist } from "@fern-api/auth";
import { join } from "@fern-api/fs-utils";
import { askToLogin } from "@fern-api/login";
import { convertOpenApi } from "@fern-api/openapi-migrator";
import { Project } from "@fern-api/project-loader";
import { TaskContext } from "@fern-api/task-context";
import { FernWorkspace, OpenAPIWorkspace } from "@fern-api/workspace-loader";
import yaml from "js-yaml";
import { mapValues as mapValuesLodash } from "lodash-es";
import { CliContext } from "../../cli-context/CliContext";
import { generateWorkspace } from "./generateWorkspace";

export async function generateWorkspaces({
    project,
    cliContext,
    version,
    groupName,
    shouldLogS3Url,
    keepDocker,
    useLocalDocker,
}: {
    project: Project;
    cliContext: CliContext;
    version: string | undefined;
    groupName: string | undefined;
    shouldLogS3Url: boolean;
    useLocalDocker: boolean;
    keepDocker: boolean;
}): Promise<void> {
    const token = await cliContext.runTask(async (context) => {
        return askToLogin(context);
    });

    if (token.type === "user") {
        await cliContext.runTask(async (context) => {
            await createOrganizationIfDoesNotExist({
                organization: project.config.organization,
                token,
                context,
            });
        });
    }

    cliContext.instrumentPostHogEvent({
        orgId: project.config.organization,
        command: "fern generate",
        properties: {
            workspaces: project.workspaces.map((workspace) => {
                return {
                    name: workspace.name,
                    group: groupName,
                    generators: workspace.generatorsConfiguration.groups
                        .filter((group) => (groupName == null ? true : group.groupName === groupName))
                        .map((group) => {
                            return group.generators.map((generator) => {
                                return {
                                    name: generator.name,
                                    version: generator.version,
                                    outputMode: generator.outputMode.type,
                                    config: generator.config,
                                };
                            });
                        }),
                };
            }),
        },
    });

    await Promise.all(
        project.workspaces.map(async (workspace) => {
            await cliContext.runTaskForWorkspace(workspace, async (context) => {
                const fernWorkspace: FernWorkspace =
                    workspace.type === "fern"
                        ? workspace
                        : await convertOpenApiWorkspaceToFernWorkspace(workspace, context);

                await generateWorkspace({
                    workspace: fernWorkspace,
                    organization: project.config.organization,
                    context,
                    version,
                    groupName,
                    shouldLogS3Url,
                    token,
                    useLocalDocker,
                    keepDocker,
                });
            });
        })
    );
}

export async function convertOpenApiWorkspaceToFernWorkspace(
    openapiWorkspace: OpenAPIWorkspace,
    context: TaskContext
): Promise<FernWorkspace> {
    const definition = await convertOpenApi({
        openApiPath: join(openapiWorkspace.absolutePathToDefinition, openapiWorkspace.definition.path),
        taskContext: context,
    });

    if (definition == null) {
        return context.failAndThrow("Failed to convert OpenAPI");
    }

    return {
        type: "fern",
        name: openapiWorkspace.name,
        generatorsConfiguration: openapiWorkspace.generatorsConfiguration,
        absolutePathToDefinition: openapiWorkspace.absolutePathToDefinition,
        absolutePathToWorkspace: openapiWorkspace.absolutePathToDefinition,
        dependenciesConfiguration: {
            dependencies: {},
        },
        definition: {
            rootApiFile: {
                contents: definition.rootApiFile,
                rawContents: yaml.dump(definition.rootApiFile),
            },
            serviceFiles: mapValues(definition.serviceFiles, (serviceFile) => ({
                // these files doesn't live on disk, so there's no absolute filepath
                absoluteFilepath: "/DUMMY_PATH",
                rawContents: yaml.dump(serviceFile),
                contents: serviceFile,
            })),
            packageMarkers: {},
            importedDefinitions: {},
        },
    };
}

function mapValues<T extends object, U>(items: T, mapper: (item: T[keyof T]) => U): Record<keyof T, U> {
    return mapValuesLodash(items, mapper) as Record<keyof T, U>;
}
