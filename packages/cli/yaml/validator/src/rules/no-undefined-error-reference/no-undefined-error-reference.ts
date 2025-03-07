import { RelativeFilePath } from "@fern-api/fs-utils";
import { parseReferenceToTypeName } from "@fern-api/ir-generator";
import { FernWorkspace, visitAllServiceFiles } from "@fern-api/workspace-loader";
import { RootApiFileSchema, ServiceFileSchema, visitFernServiceFileYamlAst } from "@fern-api/yaml-schema";
import { mapValues } from "lodash-es";
import { Rule, RuleViolation } from "../../Rule";

type ErrorName = string;

export const NoUndefinedErrorReferenceRule: Rule = {
    name: "no-undefined-error-reference",
    create: async ({ workspace }) => {
        const errorsByFilepath: Record<RelativeFilePath, Set<ErrorName>> = await getErrorsByFilepath(workspace);

        function doesErrorExist(errorName: string, relativeFilepath: RelativeFilePath) {
            const errorsForFilepath = errorsByFilepath[relativeFilepath];
            if (errorsForFilepath == null) {
                return false;
            }
            return errorsForFilepath.has(errorName);
        }

        const validateErrorReference = (
            errorReference: string,
            relativeFilepath: RelativeFilePath,
            contents: ServiceFileSchema | RootApiFileSchema
        ): RuleViolation[] => {
            const parsedReference = parseReferenceToTypeName({
                reference: errorReference,
                referencedIn: relativeFilepath,
                imports: mapValues(contents.imports ?? {}, RelativeFilePath.of),
            });

            if (parsedReference != null && doesErrorExist(parsedReference.typeName, parsedReference.relativeFilepath)) {
                return [];
            }

            return [
                {
                    severity: "error",
                    message: "Error is not defined.",
                },
            ];
        };

        return {
            rootApiFile: {
                errorReference: (errorReference, { relativeFilepath, contents }) => {
                    return validateErrorReference(errorReference, relativeFilepath, contents);
                },
            },
            serviceFile: {
                errorReference: (errorReference, { relativeFilepath, contents }) => {
                    return validateErrorReference(errorReference, relativeFilepath, contents);
                },
            },
        };
    },
};

async function getErrorsByFilepath(workspace: FernWorkspace) {
    const erorrsByFilepath: Record<RelativeFilePath, Set<ErrorName>> = {};

    await visitAllServiceFiles(workspace, async (relativeFilepath, file) => {
        const errorsForFile = new Set<ErrorName>();
        erorrsByFilepath[relativeFilepath] = errorsForFile;

        await visitFernServiceFileYamlAst(file, {
            errorDeclaration: ({ errorName }) => {
                errorsForFile.add(errorName);
            },
        });
    });

    return erorrsByFilepath;
}
