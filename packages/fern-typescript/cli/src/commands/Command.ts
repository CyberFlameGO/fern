import { Values } from "@fern-api/core-utils";
import { IntermediateRepresentation } from "@fern-fern/ir-model";
import { GeneratorContext } from "@fern-typescript/declaration-handler";
import { Volume } from "memfs/lib/volume";
import { NpmPackage } from "./constructNpmPackageForCommand";

export const CommandKey = {
    Server: "server",
    Client: "client",
    ClientV2: "client-v2",
    Model: "model",
} as const;
export type CommandKey = Values<typeof CommandKey>;

export declare namespace Command {
    export namespace generate {
        export interface Args {
            volume: Volume;
            intermediateRepresentation: IntermediateRepresentation;
            apiName: string;
            context: GeneratorContext;
        }
    }
}

export interface Command<K extends string> {
    key: K;
    npmPackage: NpmPackage;
    generate: (args: Command.generate.Args) => void | Promise<void>;
}
