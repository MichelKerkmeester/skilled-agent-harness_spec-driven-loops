# Iteration 1: Canonical Representations and Format Adapters Survey

## Focus
Q1 + Q6: Survey canonical representations and format adapters — identify the v1 canonical document model.

## Findings

### F1: The Myers Diff Algorithm is the Industry Standard Core
The canonical line-oriented diff algorithm was published by Eugene Myers in 1986 ("An O(ND) Difference Algorithm and Its Variations"). It solves the longest common subsequence (LCS) problem with O(ND) time complexity where N is the sum of lengths and D is the edit distance. Variations include the histogram algorithm (used in Git's libXDiff fork) and the patience algorithm. [SOURCE: https://en.wikipedia.org/wiki/Diff]

### F2: jsdiff (npm `diff`) is the Dominant JavaScript Diff Library
The `diff` package on npm (v9.0.0, 95M+ weekly downloads, BSD-3-Clause license) provides a comprehensive set of diff functions built on the Myers algorithm:
- `diffChars` — per-character tokenization
- `diffWords` / `diffWordsWithSpace` — word-level diffing with Intl.Segmenter support
- `diffLines` — line-level diffing (classic unified diff)
- `diffSentences` — sentence-level
- `diffCss` — CSS token-aware diffing
- `diffJson` — JSON-aware (serializes, sorts keys, diffs lines)
- `diffArrays` — generic token array diff with custom comparator
- `createPatch` / `createTwoFilesPatch` / `structuredPatch` — unified diff patch generation
- `applyPatch` / `applyPatches` — patch application with fuzzFactor
- `parsePatch` — unified diff format parser
- Supports async mode via callback, timeout, maxEditLength abort

The library also exposes a `Diff` base class allowing custom tokenization and equality semantics, making it extensible for format-specific diff behaviors. [SOURCE: https://www.npmjs.com/package/diff]

### F3: Canonical Representation Should Be a Structured Token Model
For v1, the canonical document representation should be a structured model comprising:
- **Plain text content** — the primary diffable artifact (always available)
- **Structure annotations** — headings (H1-H6), paragraphs, lists (ordered/unordered, nested), tables, links, code blocks
- **Metadata** — title, encoding, format source, extraction fidelity flags

This model allows:
1. Format-specific adapters (Markdown, HTML, DOCX, PDF) to extract into this canonical form
2. The diff engine operates on tokens derived from structure-aware parsing, not raw text
3. The HTML report reconstructs structure for meaningful side-by-side display

Plain text (always full fidelity) → structural extraction (format-dependent fidelity) → tokenized diff → structured HTML report.

### F4: Format Adapter Architecture Pattern
Each format requires an adapter that:
1. **Parses** the source format into the canonical model (extract phase)
2. **Maps** fidelity per construct (heading levels, lists, tables, links)
3. **Signals** what could NOT be extracted (images, embedded objects, layout)
4. **Normalizes** encoding (UTF-8), line endings (\n), and whitespace

### F5: Format Support Tiers for v1

| Tier | Format | Extraction Method | Fidelity |
|------|--------|------------------|----------|
| **Full** | Plain Text (.txt) | Direct read; no extraction loss | 100% — byte-identical |
| **Full** | Markdown (.md) | Parse AST (remark/unified); structure fully extractable | ~95% — preserves headings, lists, links, code; loses raw formatting quirks |
| **Limited** | HTML (.html) | Parse DOM tree (cheerio/jsdom); extract text + structure | ~80% — loses CSS layout, scripts, interactive elements, forms |
| **Adapter-dependent** | DOCX (.docx) | mammoth.js for text extraction; optional python-docx for tables | ~60% — loses tracked changes, comments, embedded images, exact positioning |
| **Adapter-dependent** | PDF (.pdf) | pdf-parse for text; pdf.js for structure; OCR fallback for scans | ~30-70% — text PDFs extract well; scanned PDFs need OCR; layout lost |
| **Unsupported** | Scanned-only PDF | OCR-only; results unreliable for diff | <30% — warn user, suggest re-scan or manual review |
| **Unsupported** | Images, binaries | No text extraction path | 0% — binary diff only |

### F6: Key Tokenization Strategy
The diff engine should tokenize the canonical model at multiple levels:
1. **Structure tokens** — headings, list items, table cells as atomic tokens
2. **Content tokens** — words within structure tokens (using `diffWords`)
3. **Metadata tokens** — title, format info as separate comparison units

This multi-level approach suppresses noise from format conversion (e.g., whitespace differences from HTML→text extraction) while preserving meaningful changes.

## Sources Consulted
- Wikipedia: Diff algorithm history and unified format specification
- npm: jsdiff package documentation (API surface, options, extensions)
- Git libXDiff documentation (histogram algorithm)
- Myers (1986) "An O(ND) Difference Algorithm and Its Variations"

## Assessment
- **newInfoRatio**: 1.0 — all findings are new to this research packet
- **Novelty Justification**: First pass; surveyed the canonical diff algorithm family, identified jsdiff as the dominant JS library, and proposed a concrete canonical representation model with format tiers
- **Confidence**: High for diff algorithms and jsdiff (primary sources); medium for specific format adapter libraries (need deeper research)

## Reflection
### What Worked
- Wikipedia diff page provided comprehensive algorithm history with all three major algorithms (Hunt-Szymanski, Myers, histogram)
- npm jsdiff page provided complete API reference with extension points
- The format tier model emerged naturally from extraction fidelity analysis

### What Failed
- Nothing failed; this was an efficient first pass

### Ruled Out
- Character-only diff as primary approach (loses document structure)

## Recommended Next Focus
Q2 + Q7: Deep dive into diff algorithms — compare Myers vs histogram vs patience for document use cases, and investigate specific format adapter libraries (mammoth, cheerio, pdf-parse, remark)
