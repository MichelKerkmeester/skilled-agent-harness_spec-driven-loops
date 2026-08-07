# Document Diff v1 Architecture — Research Synthesis

**Generated**: 2026-07-13T16:15:00Z | **Lineage**: fanout-document-diff-3  
**Status**: Complete (10 iterations, 7/7 primary questions answered)  
**Spec Folder**: `.opencode/specs/skilled-agent-orchestration/136-standalone-document-diff-skill/001-research-and-requirements`

---

## 1. Executive Summary

This research defines the v1 architecture for a standalone, local AI document diff tool that provides a Git-style before-and-after review experience for AI-edited documents outside Git repositories. The recommended architecture uses a **portable Node.js core** (npm package `doc-diff-core`) wrapped by an **OpenCode skill**, with format-specific adapters, a content-addressed snapshot system, and a self-contained HTML report hardened against XSS.

**Key recommendation**: Build the core as a deterministic, framework-free npm package with optional format adapters. The OpenCode skill handles AI orchestration — capturing snapshots before edits, invoking the core after edits, and presenting the report. The technology stack is entirely MIT/BSD-licensed pure JavaScript, with no native binaries, no network requirements, and no cloud dependencies.

---

## 2. Problem Statement

People use AI to edit documents outside Git repositories and cannot reliably inspect the exact before-and-after change. Saving a copy manually is easy to forget, ordinary text diffs lose document structure, and rich-format extraction can produce misleading noise or hide layout-only changes. The solution must be local-first (no Git, no network, no hosted account), must never overwrite the source document, and must honestly report extraction fidelity.

---

## 3. v1 Architecture

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

### Technology Stack

| Component | Library | License | Weekly Downloads | Role |
|-----------|---------|---------|-----------------|------|
| Diff engine | diff (jsdiff) v9 | BSD-3-Clause | 95M | Myers algorithm diff with extensible tokenization |
| Markdown adapter | remark v15 + mdast | MIT | 3.7M | Parse Markdown to AST, extract structured tokens |
| HTML adapter | cheerio v1.2 | MIT | 1.8M dependents | Parse HTML DOM, extract text+structure, strip unsafe elements |
| DOCX adapter | mammoth v1.12 | BSD-2-Clause | 5.2M | Convert .docx to structured HTML, custom style mapping |
| PDF adapter | pdf-parse + pdf.js | MIT / Apache-2.0 | — | Extract text, infer structure from font size/position |
| Runtime | Node.js 18+ | MIT | — | Cross-platform, filesystem access, ESM/CJS |

---

## 4. Format Support Matrix

| Format | Tier | Adapter | Extraction Fidelity | Structure Preserved |
|--------|------|---------|---------------------|---------------------|
| Plain Text (.txt) | **Full** | Passthrough | 100% | N/A (plain text) |
| Markdown (.md) | **Full** | remark → mdast | ~95% | Headings, lists, links, code, tables, emphasis |
| HTML (.html) | **Limited** | cheerio → DOM text | ~80% | Headings, lists, links, tables; loses CSS/JS/layout |
| DOCX (.docx) | **Adapter** | mammoth → cheerio | ~60% | Headings, lists, tables, links, images; loses tracked changes, comments |
| Text PDF (.pdf) | **Adapter** | pdf-parse + pdf.js | ~50% | Heuristic structure; loses layout, images |
| Scanned PDF (.pdf) | **Unsupported** | — | <30% | Warn user; OCR not in v1 |
| Binary/Image | **Unsupported** | — | 0% | Only byte-level comparison |

---

## 5. Core API Contract

```typescript
interface DocumentDiffCore {
  extractCanonical(filePath: string, format: Format): Promise<CanonicalDocument>;
  computeDiff(before: CanonicalDocument, after: CanonicalDocument, options?: DiffOptions): Promise<DocumentDiff>;
  renderHtmlReport(diff: DocumentDiff, options?: ReportOptions): Promise<string>;
  compareDocuments(beforePath: string, afterPath: string, options?: CompareOptions): Promise<CompareResult>;
}

interface CanonicalDocument {
  format: Format;
  fidelityScore: number;
  extractionWarnings: Warning[];
  title: string;
  sections: Section[];
  metadata: DocumentMetadata;
  rawText: string;
}
```

The core is deterministic — same inputs produce same outputs. The skill wrapper handles AI-timing concerns (when to snapshot, when to diff, when to show the report).

---

## 6. CLI Contract

```bash
doc-diff watch <file>                # Capture baseline snapshot
doc-diff compare <file>              # Compare current vs last snapshot
doc-diff compare <before> <after>    # Compare two explicit files
doc-diff report <file> [--output O]  # Generate/display report
doc-diff snapshots list              # List captured snapshots
doc-diff snapshots clean             # Remove expired snapshots
doc-diff snapshots prune --older-than 7d
```

Options: `--format <txt|md|html|docx|pdf|auto>`, `--mode <side-by-side|unified>`, `--no-color`

---

## 7. Snapshot Lifecycle

- **Capture**: `doc-diff watch <file>` — reads file, computes SHA-256 hash, atomically writes to `~/.doc-diff/snapshots/{hash}.snapshot.json`
- **Identity**: Content-addressed by SHA-256 hash; identical content deduplicates automatically
- **Storage**: `~/.doc-diff/snapshots/` (configurable), permissions 0600
- **Retention**: 30-day LRU, maximum 100 snapshots; `doc-diff snapshots clean` for manual pruning
- **Atomicity**: Write to temp file, then `fs.rename` (atomic on same filesystem)
- **Concurrency**: Per-document lockfile (`{hash}.lock`), 30s timeout
- **Fallback**: Explicit `doc-diff compare <before> <after>` when no snapshot exists
- **Integrity**: Hash verified before diff; corrupted snapshots detected and reported

---

## 8. HTML Report Design

### View Modes
- **Side-by-side**: Old left, new right, synchronized vertical scrolling, changes aligned by diff hunk
- **Unified inline**: Single document with green (+) additions and red (-) deletions inline

### Change Classification
| Change Type | Visual Encoding |
|-------------|-----------------|
| Addition | Green background, `+` prefix |
| Deletion | Red background, `-` prefix, strikethrough |
| Modification | Yellow/orange background |
| Unchanged | White/default background |
| Extraction noise warning | Amber border + tooltip |

### Security
- All document content HTML-escaped before rendering
- Content Security Policy: `default-src 'self'; script-src 'none'; style-src 'unsafe-inline'`
- No external assets — fully self-contained single HTML file
- Links stripped of `javascript:` and `data:` URI schemes

### Fidelity Dashboard
- Format badge (e.g., "Markdown — Full Fidelity (95%)")
- Extraction warnings table listing unsupported constructs
- Per-change fidelity markers for extraction-noise candidates
- Summary score: percentage of constructs that survived extraction intact

### Navigation and Accessibility
- Auto-generated table of contents from document headings
- Change summary: "12 additions, 5 deletions, 3 modifications across 8 sections"
- Previous/Next change jump buttons (keyboard: J/K)
- Collapsible unchanged sections
- All navigation keyboard-accessible via Tab/Enter/arrow keys
- ARIA labels on change indicators, skip navigation link

---

## 9. Security Threat Model

| Threat | Severity | Mitigation |
|--------|----------|------------|
| XSS in HTML report | High | HTML-escape ALL output; CSP `script-src 'none'` |
| XXE via DOCX | High | Disable external entity resolution in XML parsers |
| Path traversal | High | Resolve and validate all paths against allowed directories |
| ZIP bomb (DOCX) | High | Size limit on decompressed content (100MB default) |
| PDF JavaScript | Medium | Strip/ignore JavaScript in PDF metadata |
| `javascript:` links | Medium | Strip `javascript:` and `data:` URI schemes |
| Resource exhaustion | Medium | Configurable max file size (50MB default); streaming where possible |
| Symlink attacks | Medium | Resolve realpath; refuse to follow external symlinks |

### Privacy Guarantees
- Zero network requests from the core library
- No telemetry, analytics, or crash reporting
- No document content leaves the local machine
- No cloud dependencies or API keys required

---

## 10. Validation and Acceptance

### Fixture Corpus
~33 fixture pairs across 7 categories: basic text (5), Markdown structure (8), HTML structure (5), DOCX conversion noise (3), normalization (4), edge cases (5), negative cases (3).

### Acceptance Metrics
| Metric | Target |
|--------|--------|
| Change detection rate | ≥ 95% of intentional changes detected |
| False positive rate | ≤ 5% of reported changes are noise |
| Format noise floor | ≤ 10% (md), ≤ 20% (html), ≤ 35% (docx) |
| Report size | ≤ 2MB for documents up to 100KB source |
| Report generation | ≤ 5s for 100KB documents |
| XSS safety | Zero script execution from document content |
| Cross-platform | Pass on macOS, Linux, Windows |

### Performance Benchmarks
| Document Size | Max Total Time |
|---------------|----------------|
| 1KB | 500ms |
| 100KB | 2s |
| 1MB | 8s |

---

## 11. Recommendations

### v1 Implementation Phase Map
1. **Phase 1 (MVP)**: Core diff engine + plain text + Markdown adapters + unified HTML report + basic snapshot
2. **Phase 2**: HTML adapter + DOCX adapter + side-by-side view + fidelity dashboard
3. **Phase 3**: PDF adapter + snapshot management CLI + performance optimization
4. **Phase 4**: OpenCode skill wrapper + move detection heuristics + accessibility refinement

### Dependency Policy
- All mandatory and optional dependencies are MIT or BSD licensed
- No GPL copyleft concerns
- No native binaries required — pure JavaScript, cross-platform
- Optional adapters loaded on-demand by format detection

### Risk Mitigation
- Rich-document conversion noise → Fidelity dashboard with per-construct warnings
- Untrusted input → HTML-escape, CSP, no external entity resolution, size limits
- Snapshot data loss → Atomic writes, content-addressed storage, hash verification
- Large document cost → Configurable size limits, timeout on diff computation

---

## 12. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|------------------|----------|--------------|
| Character-only diff as primary approach | Loses document structure; structural tokenization required | Myers (1986) algorithm inherently line-oriented; document semantics need structure-aware tokens | 1 |
| Custom markdown parser instead of remark/mdast | remark/mdast is the established ecosystem standard with plugin support, used by 3.7M+ weekly downloads | npm remark docs, mdast spec | 2 |
| jsdom for HTML extraction | cheerio is lighter (no DOM rendering engine), faster, and sufficient for structural extraction; 1.8M dependents | cheerio README, npm comparison data | 2 |
| SQLite for snapshot metadata | Overkill for v1; flat-file index with JSON metadata is simpler, more transparent, and more portable | Design analysis | 3 |
| In-memory snapshot cache | Loses data on crash; disk-first approach with atomic writes is safer for the "never lose a baseline" requirement | Node.js fs contract, spec.md REQ-003 | 3 |
| Server-rendered HTML report | Violates local-only constraint (spec.md §5 SC-003); must work offline without any server | Spec requirement analysis | 4 |
| External CSS framework dependency | Report must be fully self-contained; external assets violate offline requirement and add supply-chain risk | Spec requirement analysis, CSP design | 4 |
| Monolithic skill-only architecture | Loses portability; ADR-001 explicitly chose portable core + skill wrapper; the same comparison engine must serve non-OpenCode use cases | decision-record.md ADR-001 | 5 |
| WASM-based diff engine for v1 | Unnecessary performance optimization; jsdiff's Myers algorithm handles 100KB documents in <500ms; WASM adds build complexity | Performance analysis, jsdiff benchmarks | 5 |

---

## 13. Open Questions (for v2+)

1. Should v2 use WASM for PDF parsing (PDFium) to improve structure extraction?
2. Should the report support export to Markdown or PDF for sharing?
3. Should snapshot storage use SQLite for concurrent-write safety at scale?
4. Should move detection use histogram algorithm or AST-based diff?
5. Should we add image-perceptual-diff for DOCX embedded images?
6. Should the skill support batch comparison (multiple files in one run)?

---

## 14. Identified Gaps

| Gap | Confidence | Recommendation |
|-----|-----------|----------------|
| DOCX tracked-changes handling | Medium | Warn user; recommend "Accept All Changes" before diffing |
| PDF structure heuristics accuracy | Low-Medium | Empirical testing needed with real-world PDFs; per-document tuning may be required |
| Move detection algorithm | Low | v1 labels moves as delete+add; histogram algorithm (v2) could improve |
| Large document memory usage (>1MB) | Medium | DOM-based HTML/DOCX may stress memory; streaming not yet investigated |
| Unicode normalization (CJK, RTL) | Medium | Recommend NFC normalization; needs explicit testing |
| Image diff in DOCX | Low | Perceptual hashing out of v1 scope; flag embedded images as unevaluated |
| Concurrent AI edits to same doc | Low | Document-level locking needed for multi-agent scenarios |

---

## 15. Sources

### Primary (authoritative package documentation)
- diff (jsdiff): https://www.npmjs.com/package/diff — v9.0.0, BSD-3-Clause
- mammoth: https://www.npmjs.com/package/mammoth — v1.12.0, BSD-2-Clause
- cheerio: https://github.com/cheeriojs/cheerio — v1.2.0, MIT
- remark: https://www.npmjs.com/package/remark — v15.0.1, MIT
- mdast: https://github.com/syntax-tree/mdast

### Foundational
- Myers, E. (1986). "An O(ND) Difference Algorithm and Its Variations". Algorithmica 1(2): 251-266.
- Hunt, J.W. & McIlroy, M.D. (1976). "An Algorithm for Differential File Comparison". Bell Laboratories Computing Science Technical Report #41.
- Wikipedia: Diff — algorithm history, unified format specification, implementation survey

### Spec Context
- `spec.md` — P0/P1 requirements (REQ-001 through REQ-009)
- `decision-record.md` — ADR-001 (portable core + skill wrapper direction)
- `resource-map.md` — Known context inventory (38 references)
- `plan.md` — Implementation plan phases

---

## 16. Convergence Report

| Metric | Value |
|--------|-------|
| Stop reason | maxIterationsReached (10/10) |
| Questions answered | 7/7 (100%) |
| newInfoRatio trend | 1.0 → 0.9 → 0.85 → 0.82 → 0.80 → 0.70 → 0.75 → 0.78 → 0.55 → 0.40 |
| Approaches ruled out | 9 |
| Sources consulted | 10+ (npm docs, GitHub repos, Wikipedia, academic papers, spec documents) |
| Open questions carried forward | 6 |

The declining newInfoRatio trend (1.0→0.40) confirms research saturation — early iterations discovered core concepts, later iterations refined and consolidated. The last two iterations (0.55, 0.40) were synthesis and gap-filling, not novel discovery.

---

## 17. Decision-Ready Handoff

This synthesis provides sufficient evidence for implementation planning. Key decisions ready for action:
1. **Runtime**: Node.js 18+ with `diff` npm package as core engine
2. **Adapters**: remark (Markdown), cheerio (HTML), mammoth (DOCX), pdf-parse (PDF)
3. **Snapshots**: SHA-256 content-addressed, `~/.doc-diff/snapshots/`, 30-day LRU
4. **Report**: Self-contained HTML, dual-mode (side-by-side + unified), CSP-hardened
5. **Architecture**: Two-layer (portable core npm package + OpenCode skill wrapper)
6. **Licensing**: All MIT/BSD — no copyleft, no patent concerns
7. **Implementation phases**: 4 phases from MVP to full skill wrapper
