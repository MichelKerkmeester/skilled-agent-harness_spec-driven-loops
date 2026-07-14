# Iteration 2: Canonical Representation and Extraction Pipelines Per Format

## Focus

Which intermediate canonical representation best bridges Markdown, plain text, HTML, DOCX, and PDF for structural comparison, and which extraction libraries are most viable per format?

## Findings

### Finding 1: Markdown as Canonical Intermediate Format

Markdown-to-HTML pipelines are the most mature and well-understood conversion path. Libraries like markdown-it (21.7k stars, MIT, actively maintained) provide 100% CommonMark compliance with plugin architecture for extensions (tables, footnotes, strikethrough, etc.). This makes Markdown an ideal "hub" format:
- Text is trivially representable as Markdown
- HTML can be converted to Markdown via turndown/rehype-remark
- DOCX can be converted HTML then to Markdown via mammoth
- Markdown's AST is well-defined (CommonMark spec)
- Produces clean, semantic HTML output for reports

[SOURCE: https://github.com/markdown-it/markdown-it]

### Finding 2: Unified.js Ecosystem for Multi-Format Pipelines

The unified.js ecosystem (remark/rehype/retext) provides the most complete AST-based document processing pipeline in the JavaScript ecosystem:
- remark: Markdown AST (mdast) processing
- rehype: HTML AST (hast) processing  
- retext: Natural language AST (nlcst) processing
- Well-defined AST specifications for each format
- Plugin ecosystem for transformations, linting, and format conversion
- remark-rehype bridges Markdown to HTML in a lossless AST-to-AST conversion
- Mature: used by Gatsby, Next.js, MDX, Docusaurus

[SOURCE: https://unifiedjs.com]

### Finding 3: Extraction Library Viability Matrix

| Format | Library | Lang | License | Maintained | Fidelity |
|--------|---------|------|---------|------------|----------|
| Markdown | markdown-it / unified | JS | MIT | Yes | Full (CommonMark spec) |
| Plain text | Native / unified | Any | N/A | N/A | Identity (no conversion) |
| HTML | rehype-parse / cheerio | JS | MIT | Yes | Full (WHATWG spec) |
| DOCX | mammoth.js/python-mammoth | JS/Py | BSD-2 | Yes (1.1k stars) | Structural, style-mapped |
| DOCX | python-docx | Python | MIT | Yes | Full XML access |
| PDF (text) | pdf.js / pdfplumber | JS/Py | Apache/MIT | Yes | Text extraction only |
| PDF (scanned) | Tesseract OCR | Multi | Apache | Yes | OCR-dependent, lossy |

[SOURCE: https://github.com/mwilliamson/python-mammoth]

### Finding 4: The Two-Pass Extraction Model

For v1, a two-pass model is recommended:
1. **Extraction pass**: Each format adapter produces a unified AST (mdast/hast)
2. **Normalization pass**: The AST is normalized to remove non-semantic variance (whitespace, encoding, metadata)

This model is proven by difftastic's approach (parse to AST, then structural diff) and avoids the complexity of trying to compare raw format representations directly.

### Finding 5: Format Capability Tiers

Based on extraction fidelity and library maturity:

| Tier | Formats | Behavior |
|------|---------|----------|
| **Full** | Markdown, Plain Text | Lossless AST, all constructs preserved |
| **Structural** | HTML, DOCX (via mammoth) | Semantic structure preserved; visual formatting may be approximated |
| **Limited** | PDF (text-based), DOCX (complex) | Text extracted; structure may be incomplete; fidelity warnings required |
| **Unsupported** | Scanned PDF, images, password-protected | Detected and reported; no diff produced; explicit user warning |

### Finding 6: Recommended v1 Canonical Pipeline

```
[Format] → [Adapter] → [mdast/hast AST] → [Diff Engine] → [HTML Report]
   │            │              │                    │               │
   ▼            ▼              ▼                    ▼               ▼
Markdown    markdown-it   mdast (unified)     Tree diff       Self-contained
Plain text  Native text   hast (rehype)       (structural)    HTML artifact
HTML        rehype-parse  normalized AST      with text fallback
DOCX        mammoth.js    + fidelity tags       
PDF         pdf.js        (limited tier)
```

## Sources Consulted

- https://github.com/markdown-it/markdown-it — CommonMark parser (21.7k stars)
- https://github.com/mwilliamson/python-mammoth — DOCX to HTML converter
- https://unifiedjs.com — AST-based document processing ecosystem
- https://github.com/nicknochnack/markdown-to-html-pdf-docx — 404, not available

## Assessment

**newInfoRatio**: 0.8 — Five substantive findings about the canonical representation pipeline with direct evidence. Format capability tiers and the two-pass model are novel contributions.

**Novelty justification**: The Markdown-as-hub approach, two-pass extraction model, and format capability tier classification are all new to this packet. Built on existing library evidence.

**Confidence**: High — evidence from primary sources with direct library data.

## Reflection

**What worked**: The unified.js ecosystem emerged as the clear architectural winner for AST-based multi-format pipelines. Mammoth's explicit approach to semantic conversion (ignoring visual formatting in favor of structure) validates the spec's architectural direction.

**What failed**: Direct Markdown-to-PDF or Markdown-to-DOCX pipelines are too immature for production use. The 404 from nicknochnack's repo confirms this. The conversion path must go through HTML as an intermediate.

**Ruled out**: Direct format-to-format comparison without a canonical intermediate. The combinatorial explosion (N×M adapters) is unsustainable compared to the hub-and-spoke model (N adapters to one canonical format).

## Recommended Next Focus

Diff algorithm comparison — which tree-aware diff strategy (Myers, patience, histogram, tree-edit-distance) best handles the normalized AST for readable change detection?
