# Iteration 6: PDF and Edge Format Deep-Dive

## Focus
Q6 continued: PDF format specifics, text vs scanned handling, adapter architecture consolidation.

## Findings

### F1: PDF Extraction Strategy
| PDF Type | Detection | Extraction Path | Diffable? | Fidelity |
|----------|-----------|-----------------|------------|----------|
| Text PDF (native text layer) | pdf-parse returns >50 chars/page | Extract text per page → concatenate → structural heuristics | Yes | ~60% |
| Text PDF with structure | pdf.js text positions + font size analysis | Infer headings from font size jumps | Yes | ~70% |
| Mixed text+image PDF | pdf-parse partial text | Diff text portions only; warn about image content | Partial | ~40% |
| Scanned PDF (no text) | pdf-parse returns empty | Offer OCR suggestion; no automatic OCR in v1 | No | 0% |
| Password-protected | Library throws error | Report "cannot access: password-protected" | No | 0% |

### F2: PDF Structure Inference Heuristics
With pdf.js (Mozilla, Apache 2.0), text positions and font sizes can be extracted:
- **Font size ≥ 18pt → heading** (H1/H2)
- **Bold + font size ≥ 14pt → subheading** (H3)
- **Left-aligned text blocks → paragraphs**
- **Tabular column alignment → table detection**
- These heuristics are imperfect but provide structural context for diffing

### F3: Adapter Architecture Consolidation
All adapters implement a common interface:
```
interface FormatAdapter {
  readonly format: Format;
  readonly fidelityBaseline: number;  // 0-1, expected extraction fidelity
  extract(input: Buffer | string): Promise<CanonicalDocument>;
  readonly supportedConstructs: string[];  // e.g., ["heading", "list", "table"]
  readonly unsupportedConstructs: string[]; // e.g., ["image", "comment", "layout"]
}
```
Adapters are auto-detected by file extension, with override via `--format` flag.

### F4: Format Detection Matrix
| Extension | Format | Adapter | Auto-detect Confidence |
|-----------|--------|---------|----------------------|
| .txt, .text | Plain text | Passthrough (no adapter needed) | 100% |
| .md, .markdown | Markdown | remark | 100% |
| .html, .htm | HTML | cheerio | 95% (could be XHTML, SVG) |
| .docx | DOCX | mammoth | 100% |
| .pdf | PDF | pdf-parse + pdf.js heuristics | 90% (could be scanned) |

## Assessment
- **newInfoRatio**: 0.70 — consolidated format handling, PDF specifics, adapter interface
- **Novelty Justification**: PDF extraction heuristics, adapter interface contract, format detection matrix

## Recommended Next Focus
Q7 continued: Security boundary analysis — untrusted input, parser isolation, dependency audit
