import { IntermediateRepresentation } from "@fern-fern/ir-model";
import { Project } from "ts-morph";
import { TypeDeclarationHandler } from "../model/TypeDeclarationHandler";
import { Logger } from "./logger/Logger";
import { TypeResolver } from "./type-resolver/TypeResolver";
import { File, ImportOptions } from "./types";
import { ExportDeclaration, Exports } from "./utils/Exports";
import { getFilepathForError } from "./utils/getFilepathForError";
import { getFilepathForType } from "./utils/getFilepathForType";
import { getGeneratedErrorName } from "./utils/getGeneratedErrorName";
import { getReferenceToExportedType } from "./utils/getReferenceToExportedType";
import { getReferenceToType } from "./utils/getReferenceToType";
import { Imports } from "./utils/Imports";

const IMPORT_OPTIONS: ImportOptions = { importDirectlyFromFile: false };

export class FernTypescriptClientGenerator {
    private exports = new Exports();
    private project: Project;
    private typeResolver: TypeResolver;

    constructor(
        private readonly apiName: string,
        private readonly intermediateRepresentation: IntermediateRepresentation,
        private readonly logger: Logger
    ) {
        this.project = new Project({
            useInMemoryFileSystem: true,
        });
        this.typeResolver = new TypeResolver(intermediateRepresentation);
    }

    public async generate(): Promise<Project> {
        await this.generateTypeDeclarations();
        this.exports.writeExportsToProject(this.project);
        for (const sourceFile of this.project.getSourceFiles()) {
            sourceFile.formatText();
        }
        return this.project;
    }

    private async generateTypeDeclarations() {
        for (const typeDeclaration of this.intermediateRepresentation.types) {
            await TypeDeclarationHandler.run(typeDeclaration, {
                withFile: async (run) =>
                    this.withFile({
                        filepath: getFilepathForType(typeDeclaration.name),
                        exportDeclaration: { exportAll: true },
                        run,
                    }),
                logger: this.logger,
                fernConstants: this.intermediateRepresentation.constants,
            });
        }
    }

    private async withFile({
        filepath,
        exportDeclaration,
        run,
    }: {
        filepath: string;
        exportDeclaration: ExportDeclaration | undefined;
        run: (file: File) => void | Promise<void>;
    }) {
        this.logger.info(`Generating ${filepath}`);

        const sourceFile = this.project.createSourceFile(filepath);
        if (exportDeclaration != null) {
            this.exports.addExport(sourceFile, exportDeclaration);
        }

        const imports = new Imports();
        const file: File = {
            sourceFile,
            getReferenceToType: (typeReference) =>
                getReferenceToType({
                    apiName: this.apiName,
                    referencedIn: sourceFile,
                    typeReference,
                    addImport: (moduleSpecifier, importDeclaration) =>
                        imports.addImport(moduleSpecifier, importDeclaration),
                    importOptions: IMPORT_OPTIONS,
                }),
            resolveTypeReference: (typeReference) => this.typeResolver.resolveTypeReference(typeReference),
            getReferenceToError: (errorName) =>
                getReferenceToExportedType({
                    apiName: this.apiName,
                    referencedIn: sourceFile,
                    typeName: getGeneratedErrorName(errorName),
                    exportedFromPath: getFilepathForError(errorName),
                    addImport: (moduleSpecifier, importDeclaration) =>
                        imports.addImport(moduleSpecifier, importDeclaration),
                    importOptions: IMPORT_OPTIONS,
                }),
        };
        await run(file);

        imports.writeImportsToSourceFile(sourceFile);
    }
}
