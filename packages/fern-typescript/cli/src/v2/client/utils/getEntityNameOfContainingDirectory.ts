import { ts } from "ts-morph";
import { ExportedFilePath } from "../../exports-manager/ExportedFilePath";
import { getQualifiedNameOfContainingDirectory } from "./getQualifiedNameOfContainingDirectory";

export declare namespace getEntityNameOfContainingDirectory {
    export interface Args {
        pathToFile: ExportedFilePath;
    }
}

export function getEntityNameOfContainingDirectory({
    pathToFile,
}: getEntityNameOfContainingDirectory.Args): ts.EntityName {
    return getQualifiedNameOfContainingDirectory<ts.EntityName>({
        pathToFile,
        constructQualifiedName: (left, right) => ts.factory.createQualifiedName(left, right),
        convertToQualifiedName: (value) => ts.factory.createIdentifier(value),
    });
}
