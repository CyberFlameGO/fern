import { RawSchemas } from "@fern-api/yaml-schema";
import { Type } from "@fern-fern/ir-model/types";
import { FernFileContext } from "../../FernFileContext";

export function convertUndiscriminatedUnionTypeDeclaration({
    union,
    file,
}: {
    union: RawSchemas.UndiscriminatedUnionSchema;
    file: FernFileContext;
}): Type {
    return Type.undiscriminatedUnion({
        docs: union.docs,
        members: union.union.map((unionMember) => {
            if (typeof unionMember === "string") {
                return {
                    docs: undefined,
                    type: file.parseTypeReference(unionMember),
                };
            }
            return {
                type: file.parseTypeReference(unionMember.type),
                docs: unionMember.docs,
            };
        }),
    });
}
