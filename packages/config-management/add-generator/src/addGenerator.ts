import { GeneratorInvocationSchema, WorkspaceDefinitionSchema } from "@fern-api/workspace-configuration";

const JAVA_GENERATOR_INVOCATION: GeneratorInvocationSchema = {
    name: "fernapi/fern-java",
    version: "0.0.83",
    generate: true,
    config: {
        packagePrefix: "com",
        mode: "client_and_server",
    },
};

const TYPESCRIPT_GENERATOR_INVOCATION: GeneratorInvocationSchema = {
    name: "fernapi/fern-typescript",
    version: "0.0.155",
    generate: true,
    config: {
        mode: "client_and_server",
    },
};

const POSTMAN_GENERATOR_INVOCATION: GeneratorInvocationSchema = {
    name: "fernapi/fern-postman",
    version: "0.0.17",
    generate: {
        enabled: true,
        output: "./generated-postman.json",
    },
};

export function addJavaGenerator(workspaceDefinition: WorkspaceDefinitionSchema): WorkspaceDefinitionSchema {
    return addGeneratorIfNotPresent({
        workspaceDefinition,
        invocation: JAVA_GENERATOR_INVOCATION,
    });
}

export function addTypescriptGenerator(workspaceDefinition: WorkspaceDefinitionSchema): WorkspaceDefinitionSchema {
    return addGeneratorIfNotPresent({
        workspaceDefinition,
        invocation: TYPESCRIPT_GENERATOR_INVOCATION,
    });
}

export function addPostmanGenerator(workspaceDefinition: WorkspaceDefinitionSchema): WorkspaceDefinitionSchema {
    return addGeneratorIfNotPresent({
        workspaceDefinition,
        invocation: POSTMAN_GENERATOR_INVOCATION,
    });
}

function addGeneratorIfNotPresent({
    workspaceDefinition,
    invocation,
}: {
    workspaceDefinition: WorkspaceDefinitionSchema;
    invocation: GeneratorInvocationSchema;
}): WorkspaceDefinitionSchema {
    const isAlreadyInstalled = workspaceDefinition.generators.some(
        (otherInvocation) => otherInvocation.name === invocation.name
    );
    if (isAlreadyInstalled) {
        return workspaceDefinition;
    }
    return {
        ...workspaceDefinition,
        generators: [...workspaceDefinition.generators, invocation],
    };
}