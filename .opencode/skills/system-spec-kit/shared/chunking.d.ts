/**
 * Maximum text length for embedding generation.
 * This value is used across all embedding providers.
 * Based on the EmbeddingGemma 300M profile window used by the local defaults.
 */
export declare const MAX_TEXT_LENGTH: number;
/** Defines reserved overview. */
export declare const RESERVED_OVERVIEW: number;
/** Defines reserved outcome. */
export declare const RESERVED_OUTCOME: number;
/** Defines min section length. */
export declare const MIN_SECTION_LENGTH: number;
/**
 * Intelligently chunk text to fit within max_length while preserving important content.
 * Priority: 1) First RESERVED_OVERVIEW chars, 2) Last RESERVED_OUTCOME chars,
 * 3) Decision sections, 4) Fill remaining with high -> medium -> low priority.
 */
export declare function semanticChunk(text: string, maxLength?: number): string;
//# sourceMappingURL=chunking.d.ts.map