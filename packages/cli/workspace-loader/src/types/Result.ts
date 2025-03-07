import { RelativeFilePath } from "@fern-api/fs-utils";
import { ZodError } from "zod";
import { Workspace } from "./Workspace";

export declare namespace WorkspaceLoader {
    export type Result = SuccessfulResult | FailedResult;

    export interface SuccessfulResult {
        didSucceed: true;
        workspace: Workspace;
    }

    export interface FailedResult {
        didSucceed: false;
        failures: Record<RelativeFilePath, Failure>;
    }

    export type Failure =
        | FileReadFailure
        | FileParseFailure
        | MissingFileFailure
        | StructureValidationFailure
        | DependencyFailure;

    export interface FileReadFailure {
        type: WorkspaceLoaderFailureType.FILE_READ;
        error: unknown;
    }

    export interface FileParseFailure {
        type: WorkspaceLoaderFailureType.FILE_PARSE;
        error: unknown;
    }

    export interface MissingFileFailure {
        type: WorkspaceLoaderFailureType.FILE_MISSING;
    }

    export interface StructureValidationFailure {
        type: WorkspaceLoaderFailureType.STRUCTURE_VALIDATION;
        error: ZodError;
    }

    export type DependencyFailure =
        | DependencyNotListedFailure
        | FailedToLoadDependencyFailure
        | ExportPackageHasDefinitionsFailure;

    export interface DependencyNotListedFailure {
        type: WorkspaceLoaderFailureType.DEPENDENCY_NOT_LISTED;
        dependencyName: string;
    }

    export interface FailedToLoadDependencyFailure {
        type: WorkspaceLoaderFailureType.FAILED_TO_LOAD_DEPENDENCY;
        dependencyName: string;
    }

    export interface ExportPackageHasDefinitionsFailure {
        type: WorkspaceLoaderFailureType.EXPORT_PACKAGE_HAS_DEFINITIONS;
        pathToPackage: RelativeFilePath;
    }
}

export enum WorkspaceLoaderFailureType {
    FILE_READ = "FILE_READ",
    FILE_PARSE = "FILE_PARSE",
    FILE_MISSING = "FILE_MISSING",
    STRUCTURE_VALIDATION = "STRUCTURE_VALIDATION",
    DEPENDENCY_NOT_LISTED = "DEPENDENCY_NOT_LISTED",
    FAILED_TO_LOAD_DEPENDENCY = "FAILED_TO_LOAD_DEPENDENCY",
    EXPORT_PACKAGE_HAS_DEFINITIONS = "EXPORT_PACKAGE_HAS_DEFINITIONS",
}
