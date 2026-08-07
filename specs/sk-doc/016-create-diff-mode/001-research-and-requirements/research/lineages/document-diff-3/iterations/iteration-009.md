# Iteration 9: Architecture Synthesis

## Focus
Synthesize the recommended v1 architecture from all prior research evidence.

## Findings

### F1: Recommended v1 Architecture
```
┌──────────────────────────────────────────────────────────────┐
│                    OpenCode Skill Wrapper                      │
│  Triggers: "document diff", "doc diff", "compare document"    │
│  Workflow: snapshot → AI edit → compare → report               │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                 Portable Core (npm: doc-diff-core)             │
│                                                                │
│  ┌──────────┐   ┌──────────────┐   ┌──────────┐   ┌────────┐ │
│  │ Adapters  │──▶│  Canonical   │──▶│   Diff   │──▶│ Report │ │
│  │           │   │    Model     │   │  Engine  │   │ Render │ │
│  │ remark    │   │              │   │          │   │        │ │
│  │ cheerio   │   │  Sections[]  │   │  jsdiff  │   │  HTML  │ │
│  │ mammoth   │   │  Fidelity    │   │  Myers   │   │  self- │ │
│  │ pdf-parse │   │  Warnings[]  │   │  algo    │   │ contain│ │
│  │ passthru  │   │              │   │          │   │        │ │
│  └──────────┘   └──────────────┘   └──────────┘   └────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │            Snapshot Manager                               │ │
│  │  SHA-256 | content-addressed | ~/.doc-diff/snapshots/     │ │
│  │  30-day LRU | atomic writes | lockfile per-document       │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### F2: Technology Stack Summary
| Component | Library | License | Weekly Downloads | Rationale |
|-----------|---------|---------|-----------------|-----------|
| Diff engine | diff (jsdiff) | BSD-3-Clause | 95M | Industry standard JS diff, extensible tokenization |
| Markdown | remark + mdast | MIT | 3.7M | Standard Markdown AST with plugin ecosystem |
| HTML | cheerio | MIT | (1.8M dependents) | Lightweight jQuery-like DOM, server-safe |
| DOCX | mammoth | BSD-2-Clause | 5.2M | Mature docx→HTML, custom style mapping |
| PDF | pdf-parse + pdf.js | MIT / Apache-2.0 | — | Best available pure-JS options |
| Runtime | Node.js 18+ | MIT | — | Cross-platform, fs access, ESM/CJS support |

### F3: Format Support Matrix (Final)
| Format | Tier | Adapter | Extraction Fidelity | Structure Preserved |
|--------|------|---------|---------------------|---------------------|
| Plain Text (.txt) | **Full** | Passthrough | 100% | N/A (plain text) |
| Markdown (.md) | **Full** | remark → mdast | ~95% | Headings, lists, links, code, tables, emphasis |
| HTML (.html) | **Limited** | cheerio → DOM text | ~80% | Headings, lists, links, tables; loses CSS/JS/layout |
| DOCX (.docx) | **Adapter** | mammoth → cheerio | ~60% | Headings, lists, tables, links, images; loses tracked changes, comments |
| Text PDF (.pdf) | **Adapter** | pdf-parse + pdf.js | ~50% | Heuristic structure; loses layout, images |
| Scanned PDF (.pdf) | **Unsupported** | — | <30% | Warn user; OCR not in v1 |
| Binary/Image | **Unsupported** | — | 0% | Only byte-level comparison |

### F4: Implementation Phase Map Recommendation
- **Phase 1**: Core diff engine + plain text + Markdown adapters + HTML report (MVP)
- **Phase 2**: HTML adapter + DOCX adapter + side-by-side view
- **Phase 3**: PDF adapter + snapshot management CLI + performance optimization
- **Phase 4**: OpenCode skill wrapper + move detection + accessibility refinement

## Assessment
- **newInfoRatio**: 0.55 — consolidation/synthesis; most findings confirmed rather than newly discovered
- **Novelty Justification**: Architecture diagram, technology stack table, phase map are new synthesized artifacts

## Recommended Next Focus
Cross-cutting gaps: performance constraints, edge cases not yet addressed, remaining open questions
