# Iteration 2: Diff Algorithms and Noise Suppression

## Focus
Evaluate diff algorithm options (Myers, Patience, Histogram, fuzzy) and noise-suppression strategies for document comparison across formats.

## Findings

### 1. Myers diff is the established baseline, available in two major JS libraries
- **jsdiff** (`diff` npm, 95M weekly downloads): Implements Myers O(ND) algorithm with performance optimizations (linked-list tracking, diagonal pruning for append/truncate cases). Features: `diffChars`, `diffWords`, `diffWordsWithSpace`, `diffLines`, `diffSentences`, `diffCss`, `diffJson`, `diffArrays`. Extensible via class overrides (`tokenize`, `equals`, `join`). Supports `ignoreCase`, `ignoreWhitespace`, `newlineIsToken`, `timeout`/`maxEditLength` for abortable diffs. BSD-3-Clause.
- **diff-match-patch** (Google, archived, 8.1k stars): Also implements Myers diff with pre-diff speedups and post-diff cleanups. Multi-language (JS, Python, Java, C++, C#, Dart, Lua, ObjC). Includes fuzzy Match and best-effort Patch. Originally built for Google Docs (2006). Archived Aug 2024 — read-only, no further maintenance. Apache-2.0.
[SOURCE: https://www.npmjs.com/package/diff, https://github.com/google/diff-match-patch]

### 2. Key noise-suppression strategies for document diffing
- **Token-level granularity**: Choosing the right tokenizer greatly affects noise. `diffWords` (word + punctuation tokens, whitespace ignored) produces cleaner results than `diffChars` for prose. `diffLines` is best for structural (heading/paragraph) comparison.
- **Normalization before diffing**: Converting both sides to a canonical form before comparing reduces noise from format conversion artifacts. For Markdown: normalize whitespace, unify list markers, resolve reference links. For HTML: parse to HAST tree, normalize attribute order, collapse insignificant whitespace.
- **Semantic equality**: jsdiff's `equals()` override and `comparator` option enable domain-specific equality (e.g., two heading nodes with different depth but same text are "equal" for structural comparison purposes).
- **Noise from format conversion**: When comparing across formats (e.g., DOCX converted to Markdown vs original Markdown), the converter itself introduces noise. Solution: convert to a common intermediate (e.g., plain text with structure markers or unified AST), then diff.
[SOURCE: https://www.npmjs.com/package/diff (API documentation), Inferred from library architecture]

### 3. diff-match-patch is archived — not viable for v1 dependency
Google archived the repository in August 2024 with "read-only" status. No further maintenance. jsdiff (active, v9.0.0 released 3 months ago, 95M weekly downloads) is the clear v1 choice.
[SOURCE: https://github.com/google/diff-match-patch]

### 4. HTML diff rendering via diff2html
diff2html (MIT, 3.4k stars, TypeScript) renders unified diffs as HTML with:
- Line-by-line and side-by-side modes (`outputFormat`)
- Word-level and char-level diff highlighting (`diffStyle: 'word'|'char'`, `matching: 'lines'|'words'|'none'`)
- Syntax highlighting via highlight.js integration
- Collapsible file lists, synchronized scrolling, sticky headers
- Configurable `matchWordsThreshold` (default 0.25), `diffMaxChanges`, `diffMaxLineLength` to prevent OOM on large diffs
- Self-contained: CSS + JS bundle, no server required
[SOURCE: https://github.com/rtfpessoa/diff2html]

### 5. Algorithm recommendation for v1
**Recommended**: jsdiff (`diffLines` for structural comparison, `diffWords` for semantic text comparison) paired with format-specific normalizers. For HTML output, diff2html provides the rendering layer. The pipeline: Document A/B -> Parse to native AST -> Normalize to canonical text representation -> jsdiff -> diff2html HTML render.
[SOURCE: Composite analysis of all sources]

## Sources Consulted
- https://www.npmjs.com/package/diff (jsdiff v9.0.0 docs)
- https://github.com/google/diff-match-patch (archived)
- https://github.com/rtfpessoa/diff2html
- Prior iteration-001.md findings

## Assessment
- **newInfoRatio**: 0.75 (diff-match-patch archiving is new; noise-suppression strategies are new; jsdiff capabilities confirmed)
- **Novelty Justification**: Ruled out diff-match-patch as inactive; established specific normalization-for-diffing strategies; confirmed jsdiff + diff2html composition as the v1 pipeline.

## Reflection
- **What Worked**: Direct inspection of both diff libraries gave clear selection rationale.
- **What Failed**: No single "structural diff for AST trees" library found for JS — must build on jsdiff's extensibility.
- **Ruled Out**: diff-match-patch — archived, no maintenance. Custom diff algorithm implementation — unnecessary, jsdiff is extensible enough.

## Recommended Next Focus
Map format-specific adapter chains: what parser + normalizer pair serves each format tier (full: Markdown/HTML/Text; limited: DOCX; unsupported: PDF)?
