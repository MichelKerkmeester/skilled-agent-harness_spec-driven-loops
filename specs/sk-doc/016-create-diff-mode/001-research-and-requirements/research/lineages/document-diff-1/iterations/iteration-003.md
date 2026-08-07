# Iteration 3: Format Adapter Chain Architecture

## Focus
Map concrete parser-to-normalizer pipelines for each supported format tier: Text, Markdown, HTML (full), DOCX (limited), PDF (unsupported in v1).

## Findings

### 1. Format Tier Classification
| Tier | Formats | Parser/Normalizer Chain | Fidelity |
|------|---------|------------------------|----------|
| **Full** | Plain Text, Markdown, HTML | Native parser -> normalized AST -> plain-text structure repr -> jsdiff | High — structural + semantic changes captured |
| **Limited** | DOCX | mammoth -> HTML -> HTML normalizer -> text repr -> jsdiff | Medium — formatting conversion noise expected |
| **Unsupported** | PDF, images, scanned docs | N/A in v1 | Error with explanation; recommend external OCR/conversion first |

[SOURCE: Composite analysis from prior iterations, npm package documentation]

### 2. Concrete adapter chains per format

**Plain Text**:
- Parser: `fs.readFileSync` (no parsing needed)
- Normalizer: Line ending normalization (CRLF->LF), trailing whitespace trimming, optional encoding detection
- Diff: jsdiff `diffLines` with `ignoreWhitespace`, `stripTrailingCr`, `newlineIsToken`

**Markdown**:
- Parser: `remark`/`unified` with `remark-parse` -> MDAST (standard Markdown AST)
- Normalizer: MDAST tree -> `mdast-util-to-markdown` for canonical re-serialization (normalizes whitespace, list markers, reference style). Alternative: serialize to plain text via `mdast-util-to-string`.
- Diff: jsdiff `diffLines` or `diffWords` on the re-serialized representation
[SOURCE: https://github.com/syntax-tree/mdast, prior iteration 1 findings]

**HTML**:
- Parser: `rehype`/`unified` with `rehype-parse` -> HAST (HTML AST), or `cheerio` (jQuery-like API for Node)
- Normalizer: HAST tree -> `hast-util-to-html` for canonical re-serialization with normalized attribute order. `hast-util-sanitize` for stripping potentially dangerous content before diff rendering.
- Diff: jsdiff `diffLines` on the re-serialized HTML
[SOURCE: https://github.com/syntax-tree/hast, inferred from syntax-tree ecosystem]

**DOCX**:
- Parser: `mammoth` v1.12.0 (5.2M weekly downloads, BSD-2-Clause) — converts .docx to HTML with semantic style mapping
- Normalizer: Mammoth output HTML -> HAST/cheerio parser -> canonical HTML serialization
- Limitations: Tables lose border formatting, text boxes handled as trailing paragraphs, complex formatting may not survive the conversion
- Diff: jsdiff `diffLines` on the normalized HTML output
[SOURCE: https://www.npmjs.com/package/mammoth]

**PDF (unsupported in v1)**:
- Available extraction libraries: `pdf-parse` (text only), `pdfjs-dist` (structured)
- Neither preserves formatting/layout sufficient for structural diff. PDF diff in v1 is out of scope.
- User-facing message: "PDF comparison requires extracting text first. Use an external PDF-to-text converter before comparing."

### 3. Adapter interface design
The adapter pattern for v1 should define a common interface:
```
interface FormatAdapter {
  parse(input: string | Buffer): Promise<Document>;
  normalize(doc: Document): Promise<string>; // canonical text representation
  getFormatLabel(): string;
}
```
Each format gets its own adapter implementing this interface. The core diff engine works only with the normalized string output.
[SOURCE: Architectural inference from adapter pattern best practices]

## Sources Consulted
- https://www.npmjs.com/package/mammoth (DOCX parser)
- https://github.com/syntax-tree/mdast (MDAST)
- https://github.com/syntax-tree/hast (HAST)
- Prior iteration findings (iterations 1, 2)

## Assessment
- **newInfoRatio**: 0.8 (Format tier classification and concrete adapter chains are new architectural decisions; DOCX pipeline specifics newly researched; adapter interface pattern is synthesis of prior findings)
- **Novelty Justification**: Established explicit format tiers with concrete library choices for each; defined the adapter interface contract; confirmed PDF as out-of-scope for v1.

## Reflection
- **What Worked**: npm package inspection gave concrete, actively-maintained library choices for each format tier.
- **What Failed**: PDF structured comparison is fundamentally infeasible without OCR/layout analysis — correctly ruled out.
- **Ruled Out**: PDF support in v1. `diff-match-patch` (already ruled out, confirmed).

## Recommended Next Focus
Design the snapshot lifecycle: how to capture before/after snapshots automatically, storage strategy, hash-based change detection, and cleanup.
