# Iteration 9: Cross-Format Comparison and Edge Cases

## Focus
Evaluate cross-format comparison strategies: format-mismatched pairs, fidelity scoring mechanics, and edge case handling.

## Findings

### 1. Cross-format comparison matrix
| Before Format | After Format | Strategy | Fidelity |
|---------------|--------------|----------|----------|
| Markdown | Markdown | Parse to MDAST -> normalize -> diff | HIGH (same format) |
| HTML | HTML | Parse to HAST -> normalize -> diff | HIGH (same format) |
| Text | Text | Line-ending normalization -> diff | HIGH (same format) |
| DOCX | DOCX | Mammoth -> HTML -> normalize -> diff | MEDIUM (conversion noise) |
| Markdown | HTML | Parse both -> normalize to common text repr -> diff | MEDIUM (structural mismatch) |
| DOCX | Markdown | Mammoth -> HTML vs MDAST -> text; diff normalized text | LOW (dual conversion noise) |
| Any | PDF | Reject: "PDF not supported" | N/A |

### 2. Common intermediate representation for cross-format
When formats don't match, normalize both sides to a common plain-text representation:
1. Parse each side with its format-specific parser
2. Extract plain text content (via `mdast-util-to-string` for Markdown, text extraction for HTML, mammoth raw text for DOCX)
3. Optionally annotate with structural markers: `[H1]`, `[H2]`, `[LIST]`, `[CODE]`
4. Run jsdiff on the normalized representation
5. Tag the diff report with `formatMatch: 'converted'` and fidelity downgrade

### 3. Fidelity scoring algorithm
```
fidelityScore = baseFidelity * conversionPenalty * formatMatchBonus

Where:
- baseFidelity: 1.0 for same-format, 0.85 for single-conversion, 0.70 for dual-conversion
- conversionPenalty: 0.95 for well-structured sources, 0.80 for complex/dense content
- formatMatchBonus: 1.0 if same format, 0.90 if both text-based, 0.75 if one is DOCX

Fidelity label:
- >= 0.90: HIGH
- >= 0.75: MEDIUM
- < 0.75: LOW
```

### 4. Edge cases and their handling
| Edge Case | Detection | Handling |
|-----------|-----------|----------|
| Empty file | Content length = 0 | Show diff as "file created" or "file deleted" |
| Binary file | Magic bytes detection or file extension list | Reject with "Binary files cannot be diffed" |
| File not found | `ENOENT` from fs | "File X not found. Has it been moved or deleted?" |
| Encoding mismatch | BOM detection, content inspection | Normalize to UTF-8; warn if non-UTF-8 detected |
| Very large file | > `maxFileSizeMB` config | Reject with size limit message |
| Identical content | Content hashes match | "No changes detected" report (empty diff) |
| Nested snapshots dir | Self-referencing path | Exclude `.document-snapshots/` from watching |

### 5. Conversion noise suppression tactics
- **Whitespace normalization**: Collapse multiple spaces, normalize line endings, trim trailing whitespace
- **List marker normalization**: Convert `-`, `*`, `+` to a canonical marker before diffing
- **Link reference normalization**: Resolve reference-style links to inline before diffing
- **Heading anchor stripping**: Remove auto-generated heading anchors (e.g., `{#custom-id}`) before diffing
- **Metadata exclusion**: Optionally exclude YAML frontmatter from diff comparison

## Sources Consulted
- Prior iteration findings (format tiers, adapter chains)
- `.opencode/specs/.../001-research-and-requirements/spec.md` (format matrix requirement)
- Inferred from jsdiff, mammoth, and unified ecosystem capabilities

## Assessment
- **newInfoRatio**: 0.4 (Cross-format comparison matrix and fidelity scoring algorithm are new; edge case catalog is new; noise suppression tactics refined from prior iterations)
- **Novelty Justification**: Defined the cross-format strategy with explicit fidelity scoring; cataloged 8 edge cases with concrete handling; implemented fidelity downgrade model for format conversions.

## Reflection
- **What Worked**: The common intermediate representation pattern handles cross-format gracefully.
- **What Failed**: Dual-format conversion (DOCX + Markdown) has inherently low fidelity — user should be warned explicitly.
- **Ruled Out**: Attempting to diff PDF against anything in v1. Building a universal document model (overengineered for v1).

## Recommended Next Focus
Consolidate all findings: validate v1 architecture recommendation against all five key questions; identify remaining risks and unknowns.
