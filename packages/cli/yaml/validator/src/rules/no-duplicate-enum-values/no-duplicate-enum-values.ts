import { isRawEnumDefinition } from "@fern-api/yaml-schema";
import chalk from "chalk";
import { Rule } from "../../Rule";
import { getDuplicates } from "../../utils/getDuplicates";

export const NoDuplicateEnumValuesRule: Rule = {
    name: "no-duplicate-enum-values",
    create: () => {
        return {
            serviceFile: {
                typeDeclaration: ({ declaration }) => {
                    if (!isRawEnumDefinition(declaration)) {
                        return [];
                    }

                    const duplicatedValues = getDuplicates(
                        declaration.enum.map((enumValue) =>
                            typeof enumValue === "string" ? enumValue : enumValue.value
                        )
                    );

                    return duplicatedValues.map((duplicatedValue) => ({
                        severity: "error",
                        message: `Duplicated enum value: ${chalk.bold(duplicatedValue)}.`,
                    }));
                },
            },
        };
    },
};
