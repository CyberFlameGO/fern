import { z } from "zod";
import { ExampleResponseSchema } from "./ExampleResponseSchema";
import { ExampleTypeReferenceSchema } from "./ExampleTypeReferenceSchema";
import { WithDocsSchema } from "./WithDocsSchema";

export const ExampleEndpointCallSchema = WithDocsSchema.extend({
    name: z.optional(z.string()),
    "path-parameters": z.optional(z.record(z.string(), ExampleTypeReferenceSchema)),
    "query-parameters": z.optional(z.record(z.string(), ExampleTypeReferenceSchema)),
    headers: z.optional(z.record(z.string(), ExampleTypeReferenceSchema)),
    request: z.optional(ExampleTypeReferenceSchema),
    response: z.optional(ExampleResponseSchema),
});

export type ExampleEndpointCallSchema = z.infer<typeof ExampleEndpointCallSchema>;
