/**
 * Shared utilities for the pi-harness extension.
 *
 * Line hashing uses a SHA-256 digest truncated to 32 bits (8 hex chars).
 * The previous 16-bit truncation was too collision-prone: two distinct
 * config lines hashed to the same value, and birthday analysis put a 50%
 * collision chance at only ~300 lines. 32 bits keeps annotations compact
 * while making accidental collisions unlikely for typical file-sized line
 * sets. The hash is computed on trailing-whitespace-trimmed content so edits
 * that only change trailing spaces don't cause spurious mismatches.
 */

import { createHash } from "node:crypto";

/**
 * Compute an 8-character hex hash for a line of content.
 * The hash is based on trailing-whitespace-trimmed content.
 */
export function lineHash(line: string): string {
	const trimmed = line.replace(/\s+$/, "");
	// SHA-256 truncated to 32 bits (8 hex chars). The 16-bit FNV-1a
	// truncation let distinct lines collide (e.g. "critical setting = false"
	// and "critical setting = true # 41223" both hashed to "fdec"); 32 bits
	// makes such collisions unlikely at typical file sizes.
	return createHash("sha256").update(trimmed).digest("hex").slice(0, 8);
}

/**
 * Format a line number with its hash annotation.
 *
 * Output format: `     N:HHHHHHHH→content`
 * The line number is right-padded to 5 chars for alignment with 3-digit+ lines.
 * The hash is 8 hex chars. The `→` separates annotation from content.
 */
export function annotateLine(lineNumber: number, content: string): string {
	const num = String(lineNumber).padStart(5, " ");
	const hash = lineHash(content);
	return `${num}:${hash}\u2192${content}`;
}

/** The regex used to detect already-annotated lines (to avoid double-annotation). */
const ANNOTATED_RE = /^\s*\d+:([0-9a-f]{8})\u2192/;

/** Check whether a line already has a hash annotation. */
export function isAnnotated(line: string): boolean {
	return ANNOTATED_RE.test(line);
}

/**
 * Detect truncation/continuation notice lines from the read tool.
 *
 * Matches the actual pi read tool output format:
 *   [Showing lines 1-50 of 200. Use offset=51 to continue.]
 *   [...output truncated. Type 'more' to continue.]
 *
 * Does NOT match TOML/INI section headers like [section], JSON array
 * snippets like [1, 2, 3], or other bracketed content that is real
 * file content requiring annotation.
 */
const isNoticeLine = (line: string): boolean =>
	line.startsWith("[Showing") ||
	(line.startsWith("[") && line.includes("to continue.]"));

/**
 * Annotate raw file content with line numbers and hashes.
 *
 * @param content Raw file content (newline-separated)
 * @param startLine 1-based line number of the first line (for offset reads)
 * @returns Annotated content where each line is `     N:HHHHHHHH→original line content`
 *
 * Truncation notice lines (e.g. [Showing lines 1-50 of 200...]) are
 * left un-annotated so the model can distinguish them from file content.
 * Blank separator lines immediately before a notice are also skipped
 * (they are display artifacts, not real file lines).
 */
export function annotateContent(content: string, startLine = 1): string {
	const lines = content.split("\n");
	const result: string[] = [];
	let lineNum = startLine;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]!;

		if (isNoticeLine(line)) {
			// Truncation/continuation notice: pass through without annotation.
			result.push(line);
			continue;
		}

		if (line === "" && i + 1 < lines.length && isNoticeLine(lines[i + 1]!)) {
			// Blank line immediately before a truncation notice — it's a display
			// artifact, not a real file line. Pass through without annotation.
			result.push(line);
			continue;
		}

		if (isAnnotated(line)) {
			// Already annotated (e.g., re-read after our hook) — pass through.
			result.push(line);
		} else {
			result.push(annotateLine(lineNum, line));
		}
		lineNum++;
	}

	return result.join("\n");
}

/**
 * Extract the error message from a tool result's content array.
 *
 * Tool results contain `(TextContent | ImageContent)[]`. We concatenate
 * all text content to produce the error text seen by the model.
 * The full text is preserved (not truncated here) so actionable details
 * past 500 characters survive; dedup signatures truncate separately in
 * `errorSignature`.
 */
export function extractErrorText(
	content: { type: string; text?: string; data?: string }[],
): string {
	return content
		.filter((c) => c.type === "text" && c.text)
		.map((c) => c.text!)
		.join("\n");
}

/**
 * Normalize an error message into a signature for consecutive-failure dedup.
 *
 * Strips file-specific details (paths, line numbers, timestamps) so that
 * "Error: open /foo/bar.txt: no such file" and "Error: open /baz/qux.txt: no such file"
 * are considered the same failure class.
 */
export function errorSignature(toolName: string, errorText: string): string {
	const normalized = errorText
		.replace(/\/[^\s:]+/g, "<path>") // file paths
		.replace(/line \d+/gi, "line N") // line numbers
		.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/g, "<timestamp>") // ISO timestamps
		.replace(/\b0x[0-9a-f]+\b/gi, "<hex>") // hex addresses
		.slice(0, 200);
	return `${toolName}:${normalized}`;
}

/**
 * Enhance a raw tool error message to be more actionable.
 *
 * Catches common unhelpful error patterns and replaces them with messages
 * that tell the model *what to fix*, not just *what broke*.
 */
export function enhanceError(toolName: string, errorText: string): string {
	// Empty path errors
	if (
		/open\s*:?\s*no such file/i.test(errorText) ||
		/no such file or directory/i.test(errorText)
	) {
		if (/open\s+:|open\s+''/.test(errorText) || errorText.includes('""')) {
			return `Error: the 'path' argument is empty or missing. Please provide a valid file path.`;
		}
	}

	// Permission errors
	if (/permission denied/i.test(errorText)) {
		return `${errorText}\n\nThis usually means the file is not readable. Check the path and permissions.`;
	}

	// Edit tool partial-match errors — include the actual content for context.
	// Only match edit-specific patterns to avoid catching unrelated 'not found' errors.
	if (
		/old_text.*not found|old_string.*not found|did not match|exact string.*not found/i.test(
			errorText,
		)
	) {
		return `${errorText}\n\nThe exact string was not found in the file. This commonly happens when:\n- The file was modified since you last read it (re-read the file)\n- Whitespace differs (tabs vs spaces, trailing whitespace)\n- You are matching content from an outdated read\nSuggestion: use read to get fresh content, then retry.`;
	}

	// Offset out of bounds
	if (/offset.*beyond end of file/i.test(errorText)) {
		return `${errorText}\nThe file may be shorter than expected. Use read without offset to see the full file.`;
	}

	// Default: pass through with tool name context
	return `[${toolName}] ${errorText}`;
}

/**
 * Check whether a model matches any of the given patterns (case-insensitive
 * substring match against the model's provider, id, or name).
 *
 * Used to gate cache and hashline modules to DeepSeek-like models only.
 * Returns false when model is undefined (no model selected yet).
 */
export function matchesModelPattern(
	model: { id: string; provider: string; name: string } | undefined,
	patterns: string[],
): boolean {
	if (!model || patterns.length === 0) return false;
	const haystack = `${model.provider} ${model.id} ${model.name}`.toLowerCase();
	return patterns.some((p) => haystack.includes(p.toLowerCase()));
}
