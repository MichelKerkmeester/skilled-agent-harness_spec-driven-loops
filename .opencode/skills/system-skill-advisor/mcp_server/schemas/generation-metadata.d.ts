import { z } from 'zod';
export declare const GenerationMetadataSchema: z.ZodObject<{
    generation: z.ZodNumber;
    updatedAt: z.ZodString;
    sourceSignature: z.ZodNullable<z.ZodString>;
    reason: z.ZodString;
    state: z.ZodEnum<{
        stale: "stale";
        live: "live";
        absent: "absent";
        unavailable: "unavailable";
    }>;
}, z.core.$strip>;
export type GenerationMetadata = z.infer<typeof GenerationMetadataSchema>;
//# sourceMappingURL=generation-metadata.d.ts.map