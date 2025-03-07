import { assertNever } from "@fern-api/core-utils";
import { RawSchemas } from "@fern-api/yaml-schema";
import { Availability, AvailabilityStatus, Declaration } from "@fern-fern/ir-model/commons";

const DEFAULT_DECLARATION = {
    docs: undefined,
    availability: {
        status: convertAvailabilityStatus(undefined),
        message: undefined,
    },
};

export function convertDeclaration(declaration: string | RawSchemas.DeclarationSchema): Declaration {
    if (typeof declaration === "string") {
        return DEFAULT_DECLARATION;
    }
    return {
        docs: declaration.docs,
        availability: convertAvailability(declaration.availability),
    };
}

export function convertAvailability(
    availability: RawSchemas.AvailabilitySchema | RawSchemas.AvailabilityStatusSchema | undefined
): Availability {
    return {
        status: convertAvailabilityStatus(typeof availability === "string" ? availability : availability?.status),
        message: typeof availability !== "string" ? availability?.message : undefined,
    };
}

export function getAudiences(schema: RawSchemas.TypeDeclarationSchema): string[] {
    if (typeof schema === "string") {
        return [];
    }
    return schema.audiences ?? [];
}

function convertAvailabilityStatus(status: RawSchemas.AvailabilityStatusSchema | undefined): AvailabilityStatus {
    if (status == null) {
        return AvailabilityStatus.GeneralAvailability;
    }
    switch (status) {
        case "in-development":
            return AvailabilityStatus.InDevelopment;
        case "pre-release":
            return AvailabilityStatus.PreRelease;
        case "deprecated":
            return AvailabilityStatus.Deprecated;
        default:
            assertNever(status);
    }
}
