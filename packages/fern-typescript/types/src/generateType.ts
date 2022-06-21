import { Type } from "@fern-api/api";
import { TypeResolver } from "@fern-typescript/commons";
import { Directory, SourceFile } from "ts-morph";
import { generateEnumType } from "./enum/generateEnumType";
import { generateAliasType } from "./generateAliasType";
import { generateObjectType } from "./generateObjectType";
import { generateUnionType } from "./union/generateUnionType";
import { getResolvedValueTypeForSingleUnionType } from "./union/utils";

export function generateType({
    type,
    typeName,
    docs,
    typeResolver,
    modelDirectory,
    file,
}: {
    type: Type;
    typeName: string;
    docs: string | null | undefined;
    typeResolver: TypeResolver;
    modelDirectory: Directory;
    file: SourceFile;
}): void {
    Type._visit(type, {
        object: (object) => {
            generateObjectType({
                file,
                typeName,
                docs,
                shape: object,
                modelDirectory,
            });
        },
        union: (unionTypeDefinition) => {
            generateUnionType({
                file,
                typeName,
                docs,
                discriminant: unionTypeDefinition.discriminant,
                resolvedTypes: unionTypeDefinition.types.map((singleUnionType) => ({
                    docs: singleUnionType.docs,
                    discriminantValue: singleUnionType.discriminantValue,
                    valueType: getResolvedValueTypeForSingleUnionType({
                        valueType: singleUnionType.valueType,
                        modelDirectory,
                        typeResolver,
                        file,
                    }),
                })),
                modelDirectory,
            });
        },
        alias: (alias) => {
            generateAliasType({
                file,
                typeName,
                docs,
                shape: alias,
                modelDirectory,
            });
        },
        enum: (_enum) => {
            generateEnumType({
                file,
                typeName,
                docs,
                shape: _enum,
            });
        },
        _unknown: () => {
            throw new Error("Unexpected type: " + type._type);
        },
    });
}
