# Iteration 10: Integration Synthesis, Risks, and Later-Phase Recommendations

## Focus

Synthesize all findings into the final v1 architecture recommendation, risk assessment, open questions, and later-phase decomposition.

## Findings

### Finding 1: v1 Architecture Recommendation (Consolidated)

**Architecture Shape**: CLI Library with Self-Contained HTML Output (Shape C)

**Runtime**: Node.js 20+ / TypeScript 5+

**Core Pipeline**:
```
[Source Document] → Format Adapter → Normalized mdast/hast AST → Structural Diff Engine → HTML Report Builder → [Self-Contained .html]
                                        ↑
                              [Optional: Baseline Snapshot from Snapshot Manager]
```

**Key Libraries** (all MIT/Apache 2.0):
- `unified` + `remark` + `rehype` — AST pipeline framework
- `mammoth` — DOCX → HTML conversion
- `pdfjs-dist` — PDF text extraction (WASM, lazy-loaded)
- `DOMPurify` — HTML sanitization for untrusted input
- Custom AST diff engine — structural comparison inspired by difftastic

**Snapshot Manager**: Local filesystem, `~/.document-diff/snapshots/{path-hash}/{timestamp}-{content-hash}.snap`

**Report**: Self-contained HTML with inline CSS, optional progressive JS, CSP meta tag, fidelity warnings, dual view modes

**Skill Interface**: `/docdiff capture|compare|cleanup|status` with auto-capture in AI edit workflows

### Finding 2: Format Support Tiers (Final)

| Tier | Formats | Adapter | Key Limitations | User Warning |
|------|---------|---------|-----------------|--------------|
| **Full Fidelity** | Plain Text, Markdown | Native (remark) | None | None |
| **Structural Fidelity** | HTML | rehype + DOMPurify | Active content stripped; dynamic content lost | ⚠️ Active elements removed |
| **Structural Fidelity** | DOCX | mammoth | Visual formatting approximated; macros/OLE stripped | ⚠️ Layout may differ from Word |
| **Limited Fidelity** | PDF (text-based) | pdfjs-dist | No layout preservation; tables may be garbled | 🔴 Text extracted only; visual review required |
| **Unsupported** | Scanned PDF, images, password-protected | Detection only | Cannot extract text | ❌ Cannot diff; use visual comparison |

### Finding 3: Risk Register (Top 5)

| Rank | Risk | Likelihood | Impact | Mitigation |
|------|------|------------|--------|------------|
| 1 | DOCX conversion loses critical formatting | Medium | High | Style map customization; explicit fidelity warnings; table of unsupported constructs |
| 2 | PDF text extraction produces garbled output | High | Medium | Clear tier classification; recommend DOCX/HTML instead; suggest OCR optional adapter |
| 3 | Large documents cause memory/timeout failures | Medium | Medium | Configurable limits; streaming where possible; chunk-based processing for v1.5 |
| 4 | XSS via crafted HTML/DOCX input bypasses sanitizer | Low | High | Defense-in-depth (DOMPurify + CSP + escaping); security review; adversarial test corpus |
| 5 | Snapshot accumulation fills disk silently | Medium | Low | Default retention policy; disk space check on capture; cleanup command; documented limits |

### Finding 4: Open Questions (Unresolved)

1. **PDF visual comparison**: Should v1.5 add an optional pixel-comparison mode for PDFs, or is text-extraction-only acceptable? The spec says "do not promise visual comparison" — this question is deferred.

2. **DOCX false equivalence**: Can one canonical representation (mdast → HTML) truly cover DOCX without creating false equivalence between semantically different constructs? The recommendation is "structural fidelity with explicit warnings" — perfect equivalence is impossible.

3. **Snapshot location security**: The default `~/.document-diff/` directory may contain sensitive document content. Should snapshots be encrypted at rest? Recommendation: defer to v1.5; v1 relies on filesystem permissions.

4. **JavaScript in reports**: The dual-view toggle and scroll sync require JS. Should there be a zero-JS fallback that renders both views statically? Recommendation: yes, the baseline report works without JS; JS is progressive enhancement.

5. **Cross-format comparison**: Should the tool support comparing a DOCX to its Markdown export? Recommendation: defer to v2.0; v1 compares same-format or canonically-normalized pairs only.

### Finding 5: Later-Phase Decomposition

Recommended child phases after research:

| Phase | Name | Scope | Priority |
|-------|------|-------|----------|
| 002 | Core library and snapshot manager | TypeScript package, public API, snapshot lifecycle, format detection | P0 |
| 003 | Format adapters (Markdown, Text, HTML, DOCX) | remark/rehype integration, mammoth adapter, HTML sanitizer | P0 |
| 004 | Diff engine and noise suppression | AST comparison algorithm, normalization rules, word-level fallback | P0 |
| 005 | HTML report builder | Self-contained report, dual-view, accessibility, fidelity warnings | P0 |
| 006 | OpenCode skill wrapper | Slash commands, auto-capture integration, UX | P1 |
| 007 | PDF adapter and OCR optional | pdfjs-dist integration, OCR capability detection | P1 |
| 008 | Fixture corpus and acceptance testing | Automated test suite, performance benchmarks, security tests | P0 |
| 009 | Performance optimization and streaming | Large-document handling, chunk processing, memory profiling | P1.5 |
| 010 | Move detection and v1.5 features | Structural move detection, richer metadata, config improvements | P2 |

### Finding 6: Implementation Handoff Summary

**What to build**: A Node.js/TypeScript `document-diff` package with a public API for capture/compare/render, a CLI for direct use, and a self-contained HTML report that is secure, accessible, and offline-capable.

**What NOT to build**: Persistent history, cloud sync, collaboration, visual/pixel diffing, desktop GUI, browser-only app.

**Primary evidence sources cited across this research**:
- difftastic (25.6k stars) — structural diff architecture validation
- unified.js ecosystem — AST pipeline framework
- mammoth.js/python-mammoth — DOCX extraction
- DOMPurify (12k+ stars) — HTML sanitization
- google/diff-match-patch — text diff algorithm reference
- pdf.js — PDF text extraction
- CommonMark spec — Markdown AST standard

**Confidence level**: High (80%) for v1 architecture recommendation. Medium (60%) for specific performance targets (need real measurement). Low (30%) for PDF extraction fidelity on real-world documents (highly variable).

## Assessment

**newInfoRatio**: 0.4 — This is primarily a consolidation and synthesis iteration. The open questions, later-phase decomposition, and handoff summary are the novel contributions, but much of the content restates prior findings in service of the synthesis.

**Novelty justification**: The later-phase decomposition map, consolidated risk register, and explicit handoff criteria are new. The architecture recommendation itself consolidates prior iterations' evidence rather than introducing new primary research.

## Reflection

**What worked**: The 10-iteration structure allowed systematic coverage of all spec-defined questions. Each iteration built on prior evidence, and the convergence pattern (0.9 → 0.4) shows diminishing returns as expected.

**What failed**: Could not get direct primary source evidence on some DOCX edge cases (tracked changes, complex tables) without testing against real documents. These remain as residual risks.

## Recommended Next Focus

Synthesis phase — compile all iteration findings into the canonical research/research.md.
