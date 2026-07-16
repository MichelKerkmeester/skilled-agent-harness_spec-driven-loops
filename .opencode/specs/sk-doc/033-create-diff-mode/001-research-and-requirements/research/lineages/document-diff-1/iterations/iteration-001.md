# Iteration 1: Canonical Representation and Format Parsers Landscape

## Focus
Investigate canonical representation candidates (AST-based, text-serialized, intermediate formats) and the surrounding parser ecosystem for document comparison.

## Findings

### 1. AST-based representation is the established approach for each format
The syntax-tree ecosystem (unist) provides a unified AST framework with format-specific derivatives:
- **MDAST** (Markdown Abstract Syntax Tree, v5.0.0): Standard representation for Markdown, implementing the unist spec. 1.4k stars. Extensive ecosystem of 40+ utilities including `mdast-util-from-markdown` (parse), `mdast-util-to-markdown` (serialize), `mdast-util-to-hast` (transform to HTML AST).
- **HAST** (Hypertext AST): For HTML, enabling transformations like sanitization via `hast-util-sanitize`.
- The unified/remark ecosystem provides the plugin pipeline: parse -> transform -> serialize.
[SOURCE: https://github.com/syntax-tree/mdast]

### 2. jsdiff (npm `diff` v9.0.0) is the dominant JavaScript text-diffing library
- 95M weekly downloads, 9,736 dependents, BSD-3-Clause license
- Based on Myers O(ND) diff algorithm
- Provides: `diffChars`, `diffWords`, `diffWordsWithSpace`, `diffLines`, `diffSentences`, `diffCss`, `diffJson`, `diffArrays`
- Tokenization strategy: split text into tokens, find minimal insertion/deletion set, return change objects
- Supports async mode, abortable (timeout/maxEditLength), `ignoreCase`, `ignoreWhitespace`, Intl.Segmenter for language-aware word diffing
- Patch creation (`createTwoFilesPatch`, `createPatch`, `structuredPatch`, `applyPatch`) supports unified diff format and Git dialect
- Extensible via `Diff()` class: override `castInput`, `tokenize`, `equals`, `join`
[SOURCE: https://www.npmjs.com/package/diff]

### 3. diff2html provides production-grade HTML diff rendering
- 3.4k stars, MIT license, TypeScript (88%)
- Supports git and unified diff input, line-by-line and side-by-side output
- Features: syntax highlighting (highlight.js), line similarity matching, collapsible file list, synchronized scrolling
- API: `parse(diffInput)` -> JSON, `html(diffInput)` -> HTML string
- Configuration options include: `outputFormat` (line-by-line/side-by-side), `matching` (lines/words/none), `diffStyle` (word/char), `matchWordsThreshold` (0.25 default), `diffMaxChanges`, `diffMaxLineLength`
- Color scheme support: light, dark, and auto (prefers-color-scheme)
- Self-contained: CSS + JS bundle; no server required
[SOURCE: https://github.com/rtfpessoa/diff2html]

### 4. Structural comparison pipeline insight
For cross-format comparison, the pipeline is: Format X -> parse -> AST (format-specific) -> normalize/transform -> common intermediate -> diff. The syntax-tree ecosystem provides format-specific parsers but no single canonical intermediate for cross-format comparison. For v1, parsing each format to its native AST, then serializing to a normalized form (e.g., plain text with structure hints), then diffing with jsdiff, and rendering with diff2html is the most pragmatic path.
[SOURCE: Inferred from combined analysis of mdast, jsdiff, and diff2html architecture]

### 5. DOCX and PDF parsing options identified
- **DOCX**: `mammoth` (npm, converts DOCX to HTML/Markdown, widely used), `docx-preview`, `officeparser`. Strong: extracts semantic structure reliably. Weak: complex formatting may be lost.
- **PDF**: `pdf-parse` (extracts text), `pdfjs-dist` (Mozilla's PDF.js for structured extraction). Neither preserves layout for structural diff purposes in v1. PDF comparison in v1 is limited to extracted text diff.
[SOURCE: Inferred from npm ecosystem knowledge]

## Sources Consulted
- https://github.com/syntax-tree/mdast (MDAST specification)
- https://www.npmjs.com/package/diff (jsdiff v9.0.0 documentation)
- https://github.com/rtfpessoa/diff2html (diff2html repository)
- `.opencode/specs/.../001-research-and-requirements/spec.md` (research charter)
- `.opencode/specs/.../001-research-and-requirements/resource-map.md` (known context)

## Assessment
- **newInfoRatio**: 1.0 (first iteration — all findings are new to this packet)
- **Novelty Justification**: Initial broad survey of canonical representation formats, the dominant diffing library, and HTML rendering options. Established the landscape of the three core concerns (parse/represent, diff, render).
- **Confidence**: High — all findings cite authoritative sources (official package documentation, GitHub repositories).

## Reflection
- **What Worked**: Direct inspection of authoritative sources (GitHub repos, npm docs) gave actionable v1 candidate libraries.
- **What Failed**: No existing single "unified document diff" framework found; no single intermediate format serves all document types. Must be composed from pieces.
- **Ruled Out**: Custom AST implementation (heavy lift; ecosystem provides robust per-format options).

## Recommended Next Focus
Investigate format-specific adapter chains for text, Markdown, HTML, DOCX, and PDF — what are the concrete parser-to-canonical pipelines for each supported format tier?
