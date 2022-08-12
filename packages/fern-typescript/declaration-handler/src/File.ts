import { DeclaredErrorName, ErrorDeclaration, FernConstants, TypeReference } from "@fern-fern/ir-model";
import { DeclaredServiceName } from "@fern-fern/ir-model/services";
import { WrapperName } from "@fern-typescript/commons-v2";
import { ResolvedType } from "@fern-typescript/resolvers";
import { SourceFile, ts } from "ts-morph";
import { ExternalDependencies } from "./external-dependencies/ExternalDependencies";
import { ServiceReference } from "./ServiceReference";
import { WrapperReference } from "./WrapperReference";

export interface File {
    sourceFile: SourceFile;
    getReferenceToType: (typeReference: TypeReference) => ts.TypeNode;
    resolveTypeReference: (typeReference: TypeReference) => ResolvedType;
    getErrorDeclaration: (errorName: DeclaredErrorName) => ErrorDeclaration;
    getReferenceToError: (errorName: DeclaredErrorName) => ts.TypeNode;
    addDependency: (name: string, version: string, options?: { preferPeer?: boolean }) => void;
    getReferenceToService: (serviceName: DeclaredServiceName) => ServiceReference;
    getReferenceToWrapper: (wrapperName: WrapperName) => WrapperReference;
    externalDependencies: ExternalDependencies;
    fernConstants: FernConstants;
}
