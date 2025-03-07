import { ErrorId, FernFilepath, ServiceId, SubpackageId, TypeId } from "@fern-fern/ir-model/commons";
import { ErrorDeclaration } from "@fern-fern/ir-model/errors";
import { HttpService } from "@fern-fern/ir-model/http";
import { IntermediateRepresentation, Package, Subpackage } from "@fern-fern/ir-model/ir";
import { TypeDeclaration } from "@fern-fern/ir-model/types";
import { mapValues } from "lodash-es";
import { IdGenerator } from "./IdGenerator";

type UnprocessedPackage = Omit<Package, "hasEndpointsInTree">;
type UnprocessedSubpackage = Omit<Subpackage, "hasEndpointsInTree">;

export class PackageTreeGenerator {
    private subpackages: Record<SubpackageId, UnprocessedSubpackage> = {};
    private rootPackage: UnprocessedPackage = {
        docs: undefined,
        fernFilepath: {
            allParts: [],
            packagePath: [],
            file: undefined,
        },
        service: undefined,
        types: [],
        errors: [],
        subpackages: [],
    };

    public addDocs(fernFilepath: FernFilepath, docs: string): void {
        const package_ = this.getPackageForFernFilepath(fernFilepath);
        if (package_.docs != null) {
            throw new Error("Found docs service for package");
        }
        package_.docs = docs;
    }

    public addType(typeId: TypeId, type: TypeDeclaration): void {
        this.getPackageForFernFilepath(type.name.fernFilepath).types.push(typeId);
    }

    public addError(errorId: ErrorId, error: ErrorDeclaration): void {
        this.getPackageForFernFilepath(error.name.fernFilepath).errors.push(errorId);
    }

    public addService(serviceId: ServiceId, service: HttpService): void {
        const package_ = this.getPackageForFernFilepath(service.name.fernFilepath);
        if (package_.service != null) {
            throw new Error("Found duplicate service for " + serviceId);
        }
        package_.service = serviceId;
    }

    public build(): Pick<IntermediateRepresentation, "subpackages" | "rootPackage"> {
        const allSubpackagesWithEndpoints = new Set(this.getAllChildrenWithEndpoints(this.rootPackage));
        return {
            subpackages: mapValues(this.subpackages, (subpackage, subpackageId) => ({
                ...subpackage,
                hasEndpointsInTree: allSubpackagesWithEndpoints.has(subpackageId),
            })),
            rootPackage: {
                ...this.rootPackage,
                hasEndpointsInTree: allSubpackagesWithEndpoints.size > 0 || this.rootPackage.service != null,
            },
        };
    }

    private getAllSubpackagesWithEndpoints(root: SubpackageId): SubpackageId[] {
        const subpackage = this.subpackages[root];
        if (subpackage == null) {
            throw new Error("Subpackage does not exist: " + root);
        }

        const subpackagesWithEndpoints = this.getAllChildrenWithEndpoints(subpackage);
        if (subpackagesWithEndpoints.length > 0 || subpackage.service != null) {
            subpackagesWithEndpoints.push(root);
        }

        return subpackagesWithEndpoints;
    }

    private getAllChildrenWithEndpoints(package_: UnprocessedPackage): SubpackageId[] {
        return package_.subpackages.flatMap((child) => {
            return [...this.getAllSubpackagesWithEndpoints(child)];
        });
    }

    private getPackageForFernFilepath(
        fernFilepath: FernFilepath,
        index = 0,
        parent = this.rootPackage
    ): UnprocessedPackage {
        const nextPart = fernFilepath.allParts[index];
        if (nextPart == null) {
            return parent;
        }
        const subpackagesInParent = parent.subpackages.map((subpackageId) => {
            const subpackage = this.subpackages[subpackageId];
            if (subpackage == null) {
                throw new Error("Subpackage ID is invalid: " + subpackageId);
            }
            return subpackage;
        });

        const nextIndex = index + 1;
        const fernFilepathForNextParent: FernFilepath = {
            allParts: fernFilepath.allParts.slice(0, nextIndex),
            packagePath: fernFilepath.packagePath.slice(0, nextIndex),
            file: nextIndex === fernFilepath.allParts.length ? fernFilepath.file : undefined,
        };
        let nextParent = subpackagesInParent.find(
            (subpackage) => subpackage.name.originalName === nextPart.originalName
        );
        if (nextParent == null) {
            const newParentId = IdGenerator.generateSubpackageId(fernFilepathForNextParent);
            const newParent: UnprocessedSubpackage = {
                docs: undefined,
                fernFilepath: fernFilepathForNextParent,
                name: nextPart,
                service: undefined,
                types: [],
                errors: [],
                subpackages: [],
            };
            this.subpackages[newParentId] = newParent;
            parent.subpackages.push(newParentId);
            nextParent = newParent;
        }

        return this.getPackageForFernFilepath(fernFilepath, nextIndex, nextParent);
    }
}
