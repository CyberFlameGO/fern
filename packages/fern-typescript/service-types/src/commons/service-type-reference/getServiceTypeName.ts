import { FernFilepath } from "@fern-api/api";
import { ModelContext } from "@fern-typescript/model-context";

export function getServiceTypeName({
    proposedName,
    fernFilepath,
    modelContext,
}: {
    proposedName: string;
    fernFilepath: FernFilepath;
    modelContext: ModelContext;
}): string {
    if (!modelContext.doesTypeExist({ fernFilepath, name: proposedName })) {
        return proposedName;
    } else {
        return `_${proposedName}`;
    }
}
