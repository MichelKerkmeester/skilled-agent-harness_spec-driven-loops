# Iteration 2: Diff Algorithms and Format Adapter Libraries

## Focus
Q2 + Q7: Compare diff algorithms and investigate specific format adapter libraries.

## Findings

### F1: Three Algorithm Families Compared

| Algorithm | Use Case | Strengths | Weaknesses | Best For |
|-----------|----------|-----------|------------|----------|
| **Myers** (O(ND)) | General-purpose diff | Guaranteed minimal edit distance; widely implemented | Can produce non-intuitive results for moved code blocks | Core engine (jsdiff uses this) |
| **Histogram** | Code/structured text | Better at detecting moved blocks; faster on large files | Slightly less minimal on pathological cases | Git's default; best for structured documents |
| **Patience** | Human-readable diffs | Excellent at matching unique lines; good for reordered content | Worse on repetitive content; can miss moved blocks | Fallback for specific cases |

For document diff, Myers (via jsdiff) is optimal for v1: proven, minimal, and jsdiff exposes extensible tokenization. The histogram algorithm can be introduced as an optional upgrade path. [SOURCE: https://en.wikipedia.org/wiki/Diff §Implementations; Git libXDiff documentation]

### F2: jsdiff Extension Points for Document Diff
jsdiff's `Diff` base class supports four overrides:
1. `castInput(value)` — normalize input (e.g., HTML→text extraction)
2. `tokenize(value)` — split into tokens (e.g., structure-aware tokenization)
3. `equals(left, right)` — custom equality (e.g., case-insensitive, whitespace-tolerant)
4. `join(tokens)` — rejoin common tokens into display value

This means the document diff engine can subclass `Diff` for each format adapter, using format-specific tokenization while reusing Myers algorithm. [SOURCE: https://www.npmjs.com/package/diff §Custom diffing behaviors]

### F3: Markdown Canonical Model via remark/mdast
The remark ecosystem (MIT license, maintained by unified collective) provides:
- `remark-parse` — parses Markdown to mdast (Markdown AST)
- `mdast` — a standardized syntax tree with nodes for: heading, paragraph, list, listItem, link, image, code, blockquote, table, thematicBreak, emphasis, strong, delete, inlineCode, html, etc.
- `remark-stringify` — serializes mdast back to Markdown

For the diff skill: parse both old and new Markdown → traverse mdast trees → extract structured tokens (headings, paragraphs, list items, code blocks) → diff the token sequences. This preserves structure while ignoring formatting quirks. [SOURCE: https://www.npmjs.com/package/remark; https://github.com/syntax-tree/mdast]

### F4: HTML Extraction via cheerio
cheerio (MIT, 30.4K stars, 1.8M dependents) provides jQuery-like DOM manipulation on server-side HTML:
- Parse HTML → DOM tree → traverse elements → extract text + structure
- Supports CSS selectors for targeted extraction
- Can strip `<script>`, `<style>`, comments out of the box

For the diff skill: load HTML → strip unsafe elements → extract text content mapped to heading/list/paragraph/table structure → tokenize for diff. cheerio wraps parse5 or htmlparser2 for parsing; htmlparser2 is more forgiving with malformed HTML. [SOURCE: https://github.com/cheeriojs/cheerio]

### F5: DOCX Extraction via mammoth
mammoth (BSD-2-Clause, 5.2M weekly downloads) converts .docx to HTML or raw text:
- `convertToHtml()` — full HTML with structure (headings, lists, tables, images, links, footnotes)
- `extractRawText()` — plain text only (paragraphs separated by double newlines)
- Customizable style mapping (e.g., map "Heading 1" → `<h1>`, custom styles → custom CSS classes)
- Built-in support for images (inline base64 or separate files)
- **Security note**: mammoth performs NO sanitization — input must be treated as untrusted

For the diff skill: use `convertToHtml` → extract structured content via cheerio → diff as canonical model. The intermediate HTML step provides structure that raw text extraction lacks. [SOURCE: https://www.npmjs.com/package/mammoth]

### F6: PDF Extraction Options
Limited options in pure Node.js:
- `pdf-parse` (npm) — extracts text from text-based PDFs; no structure awareness
- `pdf.js` (Mozilla) — renders PDF pages; can extract text positions but not heading levels
- For scanned PDFs: OCR via `tesseract.js` but quality is unreliable for diff purposes

Recommendation: classify PDF as "adapter-dependent" with explicit fidelity warnings. Text PDFs may diff usefully; scanned PDFs should warn users. [SOURCE: npm ecosystem survey]

## Sources Consulted
- npm: mammoth, remark, cheerio documentation
- GitHub: cheeriojs/cheerio repository (README, features, API)
- Wikipedia: Diff §Implementations and related programs
- Git libXDiff documentation (histogram, patience algorithms)

## Assessment
- **newInfoRatio**: 0.9 — confirmed jsdiff extensibility from iteration 1, added concrete format adapter libraries
- **Novelty Justification**: Identified specific libraries with concrete APIs and extension points for each format tier
- **Confidence**: High for mammoth, cheerio, remark (primary docs); medium for PDF (limited pure-JS options)

## Reflection
### What Worked
- npm pages provided comprehensive library documentation
- The adapter architecture from iteration 1 mapped cleanly to real libraries
- jsdiff's extension model (castInput/tokenize/equals/join) is well-suited for format adapters

### What Failed
- pdf-parse npm page was inaccessible (403); PDF research needs alternate sources

### Ruled Out
- Building a custom markdown parser (remark/mdast is the established standard)
- Using jsdom (heavy) over cheerio (lightweight) for HTML extraction

## Recommended Next Focus
Q3: Define the snapshot lifecycle — automatic baseline capture, hashing, retention, cleanup, explicit-pair fallback
