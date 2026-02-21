/** Options for controlling chunking behaviour */
export interface ChunkOptions {
    /** Maximum token budget per chunk (approximate, 4 chars ≈ 1 token) */
    maxTokens?: number;
}
/** A single output chunk produced by chunkMarkdown */
export interface Chunk {
    /** The raw markdown content of this chunk */
    content: string;
    /** Semantic type of the dominant content */
    type: 'text' | 'code' | 'table' | 'heading' | 'mixed';
    /** Approximate token count (content.length / CHARS_PER_TOKEN, ceiling) */
    tokenEstimate: number;
}
/** Internal block unit produced by splitIntoBlocks */
interface Block {
    content: string;
    type: 'text' | 'code' | 'table' | 'heading';
}
/**
 * Split a markdown string into logical, typed blocks.
 *
 * Detection rules (in priority order):
 * 1. Fenced code block  — starts with ``` and ends with ```
 * 2. GFM table          — header row followed by a separator row `| --- |`
 * 3. ATX heading        — line starting with 1-6 `#` characters
 * 4. Non-empty text     — everything else
 *
 * Empty/blank lines are silently skipped so they don't produce noise blocks.
 *
 * @param markdown - Raw markdown input string
 * @returns Ordered array of typed blocks
 */
export declare function splitIntoBlocks(markdown: string): Block[];
/**
 * Chunk a markdown string into semantically coherent segments.
 *
 * Chunking guarantees:
 * - Code blocks are **always** emitted as a single atomic chunk, even when
 *   they exceed `maxTokens` (splitting mid-block would corrupt syntax).
 * - GFM tables are **always** emitted as a single atomic chunk for the same
 *   reason — a partial table row is meaningless.
 * - Headings begin a new chunk so that heading + body stay paired together.
 * - Plain text blocks are accumulated until adding the next block would push
 *   the token estimate over `maxTokens`, at which point the accumulator is
 *   flushed and a new chunk begins.
 *
 * @param markdown   - Raw markdown string to chunk
 * @param options    - Optional configuration object
 * @returns Ordered array of Chunk objects
 */
export declare function chunkMarkdown(markdown: string, options?: ChunkOptions): Chunk[];
/**
 * Overload that accepts `maxTokens` directly as the second argument.
 * This mirrors the inline-stub signature used in the unit tests.
 *
 * @param markdown  - Raw markdown string
 * @param maxTokens - Token budget per chunk
 */
export declare function chunkMarkdown(markdown: string, maxTokens?: number): Chunk[];
export {};
//# sourceMappingURL=structure-aware-chunker.d.ts.map