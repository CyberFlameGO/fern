import { FailedResponse, FernFilepath } from "@fern-api/api";
import { RawSchemas } from "@fern-api/syntax-analysis";
import { DEFAULT_UNION_TYPE_DISCRIMINANT } from "../../constants";
import { parseTypeName } from "../../utils/parseTypeName";

export function convertFailedResponse({
    rawFailedResponse,
    fernFilepath,
    imports,
}: {
    rawFailedResponse: RawSchemas.FailedResponseSchema | undefined;
    fernFilepath: FernFilepath;
    imports: Record<string, string>;
}): FailedResponse {
    return {
        docs: rawFailedResponse?.docs,
        discriminant: rawFailedResponse?.discriminant ?? DEFAULT_UNION_TYPE_DISCRIMINANT,
        errors:
            rawFailedResponse?.errors == null
                ? []
                : Object.entries(rawFailedResponse.errors).map(([discriminantValue, errorReference]) => ({
                      docs: typeof errorReference !== "string" ? errorReference.docs : undefined,
                      discriminantValue,
                      error: parseTypeName({
                          typeName: typeof errorReference === "string" ? errorReference : errorReference.error,
                          fernFilepath,
                          imports,
                      }),
                  })),
    };
}
