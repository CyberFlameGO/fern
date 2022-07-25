import { writeFile } from "fs/promises";
import prettier from "prettier";
import zodToJsonSchema from "zod-to-json-schema";
import { FernConfigurationSchema } from "../schemas";

export async function writeFernJsonSchema(filepath: string): Promise<void> {
    const jsonSchema = zodToJsonSchema(FernConfigurationSchema, "Fern API Definition");
    const jsonSchemaStr = JSON.stringify(jsonSchema);
    const jsonSchemaFormatted = prettier.format(jsonSchemaStr, {
        filepath,
    });
    await writeFile(filepath, jsonSchemaFormatted);
}
