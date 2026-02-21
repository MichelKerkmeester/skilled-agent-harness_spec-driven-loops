"use strict";
// ---------------------------------------------------------------
// MODULE: Structure-Aware Chunker
// AST-aware markdown chunking that keeps code blocks and tables
// atomic, groups headings with their content, and respects a
// configurable maxTokens size limit.
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitIntoBlocks = splitIntoBlocks;
exports.chunkMarkdown = chunkMarkdown;
// ---------------------------------------------------------------------------
// 2. CONSTANTS
// ---------------------------------------------------------------------------
/** Default token budget per chunk */
const DEFAULT_MAX_TOKENS = 500;
/** Industry-standard approximation: 1 token ≈ 4 characters */
const CHARS_PER_TOKEN = 4;
// ---------------------------------------------------------------------------
// 3. BLOCK SPLITTER
// ---------------------------------------------------------------------------
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
function splitIntoBlocks(markdown) {
    const blocks = [];
    const lines = markdown.split('\n');
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        // Fenced code block: collect until closing fence
        if (line.match(/^```/)) {
            const codeLines = [line];
            i++;
            while (i < lines.length && !lines[i].match(/^```/)) {
                codeLines.push(lines[i]);
                i++;
            }
            // Include closing fence when present
            if (i < lines.length) {
                codeLines.push(lines[i]);
            }
            blocks.push({ content: codeLines.join('\n'), type: 'code' });
            i++;
            continue;
        }
        // GFM table: header row followed immediately by a separator row
        if (i + 1 < lines.length && line.includes('|') && lines[i + 1].match(/^\|?\s*[-:]+\s*\|/)) {
            const tableLines = [line];
            i++;
            // Collect all rows that contain a pipe character
            while (i < lines.length && lines[i].includes('|')) {
                tableLines.push(lines[i]);
                i++;
            }
            blocks.push({ content: tableLines.join('\n'), type: 'table' });
            continue;
        }
        // ATX heading (H1–H6)
        if (line.match(/^#{1,6}\s/)) {
            blocks.push({ content: line, type: 'heading' });
            i++;
            continue;
        }
        // Non-empty text line
        if (line.trim()) {
            blocks.push({ content: line, type: 'text' });
        }
        i++;
    }
    return blocks;
}
function chunkMarkdown(markdown, optionsOrMaxTokens) {
    // Resolve token limit from either overload signature
    let maxTokens;
    if (typeof optionsOrMaxTokens === 'number') {
        maxTokens = optionsOrMaxTokens;
    }
    else {
        maxTokens = optionsOrMaxTokens?.maxTokens ?? DEFAULT_MAX_TOKENS;
    }
    const chunks = [];
    const blocks = splitIntoBlocks(markdown);
    let currentChunk = '';
    let currentType = 'text';
    /**
     * Flush the current text/heading accumulator into a completed chunk.
     * Guard: only flush when there is non-whitespace content.
     */
    function flushAccumulator() {
        if (!currentChunk.trim())
            return;
        chunks.push({
            content: currentChunk.trim(),
            type: currentType,
            tokenEstimate: Math.ceil(currentChunk.length / CHARS_PER_TOKEN),
        });
        currentChunk = '';
    }
    for (const block of blocks) {
        const blockTokens = Math.ceil(block.content.length / CHARS_PER_TOKEN);
        if (block.type === 'code' || block.type === 'table') {
            // Atomic blocks: flush accumulator first, then emit as standalone chunk
            flushAccumulator();
            currentType = 'text'; // Reset type for next accumulation run
            chunks.push({
                content: block.content,
                type: block.type,
                tokenEstimate: blockTokens,
            });
            continue;
        }
        if (block.type === 'heading') {
            // Headings always start a new chunk so they pair with the content below
            flushAccumulator();
            currentChunk = block.content + '\n';
            currentType = 'heading';
            continue;
        }
        // Text block: accumulate while under the token budget
        const combined = currentChunk + block.content + '\n';
        const combinedTokens = Math.ceil(combined.length / CHARS_PER_TOKEN);
        if (combinedTokens > maxTokens && currentChunk.trim()) {
            // Adding this block would exceed the budget — flush first
            flushAccumulator();
            currentChunk = block.content + '\n';
            currentType = 'text';
        }
        else {
            currentChunk = combined;
        }
    }
    // Emit any remaining content
    flushAccumulator();
    return chunks;
}
//# sourceMappingURL=structure-aware-chunker.js.map