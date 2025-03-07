import { GeneratorName } from "@fern-api/generators-configuration";
import { IrVersions } from "../../ir-versions";
import { IrMigrationContext } from "../../IrMigrationContext";
import { AlwaysRunMigration, IrMigration } from "../../types/IrMigration";

export const V11_TO_V10_MIGRATION: IrMigration<
    IrVersions.V11.ir.IntermediateRepresentation,
    IrVersions.V10.ir.IntermediateRepresentation
> = {
    laterVersion: "v11",
    earlierVersion: "v10",
    minGeneratorVersionsToExclude: {
        [GeneratorName.TYPESCRIPT]: AlwaysRunMigration,
        [GeneratorName.TYPESCRIPT_SDK]: "0.5.0-rc0-1-g83a12940",
        [GeneratorName.TYPESCRIPT_EXPRESS]: "0.5.0-rc0-1-g83a12940",
        [GeneratorName.JAVA]: AlwaysRunMigration,
        [GeneratorName.JAVA_MODEL]: AlwaysRunMigration,
        [GeneratorName.JAVA_SDK]: AlwaysRunMigration,
        [GeneratorName.JAVA_SPRING]: AlwaysRunMigration,
        [GeneratorName.PYTHON_FASTAPI]: AlwaysRunMigration,
        [GeneratorName.PYTHON_PYDANTIC]: AlwaysRunMigration,
        [GeneratorName.OPENAPI_PYTHON_CLIENT]: AlwaysRunMigration,
        [GeneratorName.OPENAPI]: AlwaysRunMigration,
        [GeneratorName.POSTMAN]: "0.0.40-1-g9aa2117",
    },
    migrateBackwards: (v11, context): IrVersions.V10.ir.IntermediateRepresentation => {
        return {
            ...v11,
            auth: convertAuth(v11.auth, context),
        };
    },
};

function convertAuth(auth: IrVersions.V11.auth.ApiAuth, context: IrMigrationContext): IrVersions.V10.auth.ApiAuth {
    return {
        ...auth,
        schemes: auth.schemes.map((scheme) => convertAuthScheme(scheme, context)),
    };
}

function convertAuthScheme(
    scheme: IrVersions.V11.auth.AuthScheme,
    { taskContext, targetGenerator }: IrMigrationContext
): IrVersions.V10.auth.AuthScheme {
    return IrVersions.V11.auth.AuthScheme._visit<IrVersions.V10.auth.AuthScheme>(scheme, {
        bearer: IrVersions.V10.auth.AuthScheme.bearer,
        basic: IrVersions.V10.auth.AuthScheme.basic,
        header: (header) => {
            if (header.prefix != null) {
                return taskContext.failAndThrow(
                    `Generator ${targetGenerator.name}@${targetGenerator.version}` +
                        " does not support specifying an auth header prefix." +
                        ` If you'd like to use this feature, please upgrade ${targetGenerator.name}` +
                        " to a compatible version."
                );
            }
            return IrVersions.V10.auth.AuthScheme.header({
                docs: header.docs,
                availability: {
                    status: IrVersions.V10.commons.AvailabilityStatus.GeneralAvailability,
                    message: undefined,
                },
                name: {
                    name: header.name,
                    wireValue: header.header,
                },
                valueType: header.valueType,
            });
        },
        _unknown: () => {
            throw new Error("Unknown auth scheme: " + scheme._type);
        },
    });
}
