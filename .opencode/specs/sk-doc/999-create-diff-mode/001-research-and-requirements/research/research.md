# Research Synthesis: Standalone Local AI Document Diff Skill — V1 Architecture

<!-- ANCHOR:research-synthesis -->
**Status**: Complete | **Iterations**: 30 across 3 lineages (10 each) | **Stop Reason**: maxIterationsReached
**Generated**: 2026-07-13T16:20:00Z | **Corrected**: 2026-07-13T18:00:00Z
**Fan-out**: 3 concurrent research lineages (document-diff-1, document-diff-2, document-diff-3)

---

## 1. Executive Summary

This research defines the v1 architecture and contract for a standalone, local-first document diff tool that provides Git-style before-and-after review for AI-edited documents outside version control. Three independent research lineages ran 10 iterations each (30 total). All lineages converged on a consistent core recommendation: **a portable Node.js/TypeScript core library (npm `document-diff`) wrapped by an OpenCode skill, using established libraries for diffing (jsdiff), structured document parsing (unified.js / remark / rehype), DOCX conversion (mammoth), PDF text extraction (pdf-parse + pdf.js), with a self-contained HTML report hardened against XSS.**

### Consensus and Dissent

The three lineages agreed on the fundamental architecture shape (portable core + skill wrapper), the diff engine (jsdiff), the format-adapter pattern, and the snapshot model (content-addressed filesystem, SHA-256, TTL cleanup). They disagreed on two topics:

- **PDF tier classification**: Lineage 1 classified all PDF as Unsupported. Lineage 2 classified text PDF as Limited (pdfjs-dist). Lineage 3 classified text PDF as Adapter but scanned PDF as Unsupported. The capability-tier contract in §3 resolves this: text PDF is a Limited/Adapter tier (text extraction via pdf-parse/pdf.js); scanned or mixed-content PDF relies on an explicit optional local OCR adapter (PDF.js page rendering + Tesseract.js worker — see §9); when the optional adapter is absent, the tool returns an actionable unsupported-capability result rather than silently degrading.

- **Move detection in v1**: Lineage 1 did not discuss moves. Lineage 2 deferred moves to v1.5. Lineage 3 recommended v1 moves labeled as delete+add. The resolution in §6 makes move detection a v1 feature: deterministic subtree-hash matching with similarity fallback and ancestor/sibling context tie-breakers, producing first-class move actions in the diff result. V1 moves require unique-exact confirmation; below-threshold similarity candidates become delete+add.

---

## 2. V1 Architecture Recommendation

### Architecture Diagram

```
document-diff CLI (capture | compare | list | cleanup | config)
    |
OpenCode Skill Wrapper (@document-diff)
    |
document-diff-core (portable npm package)
    |-- Format Adapters
    |   |-- Plain Text (passthrough)
    |   |-- Markdown (remark → mdast)
    |   |-- HTML (rehype + DOMPurify → hast)
    |   |-- DOCX (mammoth → cheerio, worker/subprocess isolation)
    |   |-- PDF (pdf-parse + pdf.js, limited text extraction)
    |   |-- Scanned PDF (PDF.js render + Tesseract.js OCR; optional)
    |-- Canonical Document Model (ordered typed tree)
    |-- Diff Engine (jsdiff, Myers O(ND) + subtree-hash move detection)
    |-- HTML Report Builder (self-contained, CSP-hardened, zero-JS fallback)
    |-- Snapshot Manager (OS state dir, content-addressed, atomic writes, TTL cleanup)
```

### Technology Stack

#### Mandatory Core

| Component | Library | License | Role |
|---|---|---|---|
| Diff engine | `diff` (jsdiff) v9 | BSD-3-Clause | Myers algorithm with extensible tokenization [SOURCE: https://www.npmjs.com/package/diff] |
| Markdown parser | `unified` + `remark-parse` | MIT | Parse to mdast AST, normalize to canonical [SOURCE: https://unifiedjs.com] |
| HTML parser | `rehype-parse` / `cheerio` | MIT | Parse HTML DOM, strip unsafe elements [SOURCE: https://github.com/cheeriojs/cheerio] |
| HTML sanitizer | DOMPurify | Apache-2.0 OR MPL-2.0 | XSS defense for HTML/DOCX sources [SOURCE: https://github.com/cure53/DOMPurify] |
| DOCX converter | `mammoth` v1.12 | BSD-2-Clause | Convert .docx to structured HTML [SOURCE: https://github.com/mwilliamson/mammoth.js/] |
| PDF text extractor | `pdf-parse` | MIT | Extract text, heuristic structure [SOURCE: https://www.npmjs.com/package/pdf-parse] |
| PDF text extractor | `pdf.js` | Apache-2.0 | PDF parsing engine [SOURCE: https://mozilla.github.io/pdf.js/getting_started/] |
| Runtime | Node.js 22+ (support); Node 24 LTS (dev/default) | MIT | Cross-platform, filesystem primitives |

#### Optional / Lazy-Loaded Adapters

| Component | Library | License | Role |
|---|---|---|---|
| Scanned PDF OCR | Tesseract.js | Apache-2.0 | Local OCR worker + language data (WASM-based) [SOURCE: https://github.com/naptha/tesseract.js/] |
| PDF page rendering | pdf.js (canvas) | Apache-2.0 | Render PDF pages for OCR pipeline [SOURCE: https://mozilla.github.io/pdf.js/getting_started/] |

DOMPurify is dual-licensed Apache-2.0 OR MPL-2.0 — not MIT. PDF.js and Tesseract.js are Apache-2.0 — not MIT. Core mandatory dependencies carry MIT, BSD-2-Clause, BSD-3-Clause, or Apache-2.0 (OR MPL-2.0 for DOMPurify only). Optional adapters carry Apache-2.0. No GPL copyleft. No patent-clause issue was identified in the reviewed licenses; implementation still requires a lockfile/transitive-license audit. The optional OCR adapter (Tesseract.js) uses WASM for its worker — see §9.

**Runtime floor**: As of 2026-07-13, Node.js 18 is end-of-life (EOL April 2025) and Node.js 20 is end-of-life (EOL March 24, 2026) [SOURCE: https://nodejs.org/en/about/previous-releases]. The recommended runtime is **Node.js 22+ for support**, with **Node.js 24 LTS as the development/default runtime**, and CI on currently supported Node LTS lines (22 and 24) [SOURCE: https://nodejs.org/en/about/eol]. TypeScript 5.x accompanies the runtime.

---

## 3. Format Support Tiers

| Format | Tier | Adapter | Key Limitation |
|---|---|---|---|
| Plain Text | **Full** | Passthrough | N/A |
| Markdown (.md) | **Full** | remark → mdast | Headings, lists, links, code, tables, emphasis preserved |
| HTML (.html) | **Structural** | rehype + DOMPurify / cheerio | CSS/JS/layout lost; active content stripped |
| DOCX (.docx) | **Adapter** | mammoth → cheerio (worker/subprocess) | Layout approximation; tracked changes lost; parser warnings preserved |
| Text PDF (.pdf) | **Limited** | pdf-parse + pdf.js | Heuristic text extraction only; layout and images lost |
| Scanned / Mixed PDF | **Optional OCR** | PDF.js render + Tesseract.js worker | Requires optional adapter and language data; emits OCR confidence, reading-order, and layout warnings; visual comparison is a separate unevaluated dimension |
| Images, binaries | **Unsupported** | — | Byte-level comparison only; warn user |

**Capability-tier resolution for PDF dissent**: Lineages disagreed on PDF classification. The contract resolves this with a two-tier approach: text PDF is Limited (mandatory adapter using pdf-parse/pdf.js for text extraction; structural fidelity extracts text and basic positional heuristics but inherently loses layout, fonts, and images). Scanned or mixed-content PDF requires the optional local OCR tier (PDF.js renders pages locally; Tesseract.js performs OCR with a locally provisioned worker and language data — Tesseract.js does not directly accept PDFs; pages must be rendered first [SOURCE: https://github.com/naptha/tesseract.js/blob/master/docs/faq.md]). When the optional adapter or language data is absent, the tool returns an **actionable unsupported-capability result** — it does not silently download resources or produce a degraded empty diff.

### Cross-Format Comparison

When formats differ, normalize both sides to the canonical typed tree (§4), then diff. Fidelity warnings are emitted per-node for constructs that could not survive extraction, with source/provenance references. Format-specific sidecars (e.g., DOCX style maps, PDF layout hints) are retained only when needed and never imply equivalent structure across formats.

---

## 4. Canonical Document Model

The canonical model is an **ordered typed tree**, replacing the prior flat `Sections[]` representation:

```typescript
interface CanonicalDocument {
  format: Format;
  root: CanonicalNode;
  fidelityDiagnostics: FidelityWarning[];
  metadata: DocumentMetadata;
}

type CanonicalNodeKind =
  | 'document'
  | 'heading'
  | 'paragraph'
  | 'list'
  | 'listItem'
  | 'table'
  | 'tableRow'
  | 'tableCell'
  | 'codeBlock'
  | 'blockquote'
  | 'link'
  | 'image'
  | 'emphasis'
  | 'strong'
  | 'inlineCode'
  | 'thematicBreak'
  | 'htmlInline'       // escaped; structural only
  | 'unsupported';     // unrecognized construct

interface CanonicalNode {
  id: string;                 // deterministic occurrence identity: parent path + sibling occurrence ordinal + provenance
  contentHash: string;        // SHA-256 of kind + normalizedText + sorted semanticAttributes (excludes children)
  subtreeHash: string;        // SHA-256 of contentHash + ordered child subtreeHash list
  kind: CanonicalNodeKind;
  normalizedText: string;     // NFC-normalized, whitespace-collapsed
  semanticAttributes: Record<string, string>;  // safe subset: e.g., heading level, list marker, href text
  children: CanonicalNode[];  // ordered
  sourceReference?: SourceSpan;  // provenance in original format
  fidelityWarnings: FidelityWarning[];  // per-node unsupported diagnostics
  formatSidecar?: Record<string, unknown>;  // format-specific data (never used for structural equivalence)
}

interface SourceSpan {
  filePath: string;
  format: Format;
  startOffset: number;
  endOffset: number;
  startLine: number;
  endLine: number;
}

interface FidelityWarning {
  nodeId: string;
  construct: string;          // e.g., "tracked-changes", "embedded-chart", "layout-table"
  severity: 'info' | 'caution' | 'warning' | 'error';
  message: string;
}
```

**Design rationale**: The ordered typed tree separates occurrence identity from content identity. `id` is a deterministic occurrence identity composed from parent path, sibling occurrence ordinal, and provenance — it is stable across runs for the same input. `contentHash` and `subtreeHash` are content-derived (SHA-256). Two nodes with identical `subtreeHash` are structurally identical but must be disambiguated by occurrence context. `sourceReference` preserves provenance back to the original document. `fidelityWarnings` travel with each node so the report can show per-construct degradation. `formatSidecar` stores format-specific data (e.g., DOCX style name, PDF font size) but is excluded from structural equivalence and hashing — DOCX/HTML/PDF structures are never claimed as perfectly equivalent.

---

## 5. Core API Contract

```typescript
interface DocumentDiffCore {
  capture(path: string): Promise<SnapshotResult>;
  compare(path: string, options?: CompareOptions): Promise<DiffResult>;
  compareExplicit(before: string, after: string, options?: CompareOptions): Promise<DiffResult>;
  listSnapshots(path: string): Promise<Snapshot[]>;
  cleanup(options?: CleanupOptions): Promise<CleanupResult>;
  extractCanonical(filePath: string, format: Format): Promise<CanonicalDocument>;
  computeDiff(before: CanonicalDocument, after: CanonicalDocument, options?: DiffOptions): Promise<DiffResult>;
  renderHtmlReport(diff: DiffResult, options?: ReportOptions): Promise<string>;
}
```

The core is deterministic (same inputs produce same outputs). The skill wrapper handles AI-orchestration concerns (when to snapshot, when to diff).

### CLI Contract

```bash
document-diff capture <path>             # Capture baseline snapshot
document-diff compare <path>             # Compare current vs last snapshot
document-diff compare --before <a> --after <b>  # Compare two explicit files
document-diff list <path>                # List stored snapshots for a file
document-diff cleanup [--dry-run] [--older-than 7d]  # Remove expired snapshots
document-diff config                     # Manage configuration
```

Options: `--format <txt|md|html|docx|pdf|auto>`, `--mode <side-by-side|unified>`, `--output <path>`

---

## 6. Diff Algorithm and Move Detection

### Primary Strategy

**jsdiff** (Myers O(ND)) with format-specific normalizers. For structured documents (Markdown/HTML/DOCX), parse to the canonical typed tree (§4), diff structurally, then fill in word-level changes at leaf nodes — an approach inspired by difftastic's Dijkstra-based structural diff [SOURCE: https://github.com/Wilfred/difftastic].

### V1 Move, Replacement, and Repeated-Content Handling

V1 includes explicit move and replacement detection using the GumTree-inspired principle of syntax-aware tree mapping, adapted for the canonical typed tree rather than depending on GumTree directly [SOURCE: https://github.com/GumTreeDiff/gumtree]. The algorithm:

1. **Exact subtree matching**: For every node, compute a subtree hash (SHA-256 of `contentHash + ordered child subtreeHash list`). Exact-hash anchors are accepted only when the hash is unique on both the old and new sides. When the same subtree hash appears on either side more than once, those hashes are not used as anchors and flow instead to deterministic one-to-one contextual matching in step 2. Unique exact-hash matches across sides become anchors.

2. **Deterministic contextual matching**: For nodes with duplicate hashes (multiple identical subtrees on the same side) that could not anchor in step 1, match using parent path distance, sibling occurrence ordinal proximity, and provenance similarity. This produces a deterministic one-to-one mapping for repeated identical content.

3. **Similarity matching**: For unmatched nodes after steps 1-2, compute a similarity score (Jaccard on tokenized normalized text, weighted by kind match, with ancestor-path bonus). Candidates above the similarity threshold proceed to assignment.

4. **Deterministic one-to-one assignment**: Bipartite matching with ancestor and sibling context as tie-breakers. A node on the old side maps to at most one node on the new side. Ancestor chain match first, then sibling position proximity, then leftmost-old-vs-leftmost-new.

5. **Replacement vs. move**: A matched node whose `normalizedText` differs is a **replacement/update** (produces a text-level diff within the node). A matched node whose text is identical but whose position in the tree changed is a **move** (produced as a first-class move action in the diff result).

6. **Below-threshold → delete+add**: Nodes below the similarity threshold are not matched. They produce a delete action (old side) and an add action (new side).

### Change Classification

| Change Type | Visual Encoding |
|---|---|
| Addition | Green background, `+` prefix |
| Deletion | Red background, `-` prefix, strikethrough |
| Modification / Replacement | Yellow/orange background |
| Move | Blue indicator with source/destination reference |
| Extraction noise | Amber border + tooltip |
| Unsupported construct | Gray background + warning badge |

### Noise Suppression

Unicode NFC normalization, whitespace collapse, newline normalization, metadata stripping, canonical re-serialization via ASTs, line-ending normalization (CRLF → LF).

### Eliminated

- diff-match-patch (archived Aug 2024)
- Pure line-based diff without AST awareness (misses structural changes)
- Custom diff algorithm (jsdiff is extensible enough)

---

## 7. Snapshot Lifecycle

### Four-Phase Model

Capture → Store → Compare → Cleanup

### Cross-Platform Storage

Snapshots are stored in the OS-appropriate state directory, not a hardcoded home-directory path:

| Platform | State Directory |
|---|---|
| Linux | `$XDG_STATE_HOME/document-diff/snapshots/` (falls back to `~/.local/state/document-diff/snapshots/`) |
| macOS | `~/Library/Application Support/document-diff/snapshots/` |
| Windows | `%LOCALAPPDATA%/document-diff/snapshots/` |

| Property | Design |
|---|---|
| **Addressing** | Content-addressed by SHA-256; identical content deduplicates |
| **Atomicity** | Write to temp file on same filesystem → fsync → atomic rename; no partial writes visible |
| **Concurrency** | Per-document lockfile (advisory, 30s timeout); lock reclamation requires both timeout expiry AND a failed owner liveness/PID check; no cross-process races |
| **Retention** | Last N snapshots per file (default 10), max age T days (default 30); dry-run cleanup before deletion |
| **Integrity** | SHA-256 verified on every read; corrupted snapshots detected and logged |
| **Permissions** | Restrictive: directory 0700, files 0600; platform ACLs where available (macOS sandbox entitlements, Windows inheritable ACEs) |
| **Crash recovery** | Orphaned temp files cleaned on startup; lockfiles exceeding both a configurable timeout and a failed owner liveness/PID check are stale and reclaimable |
| **Symlink/path safety** | All paths resolved via `fs.realpath()` before use; symlinks outside snapshot directory refused |
| **Fallback** | Explicit `compare --before <a> --after <b>` with no snapshot dependency |

---

## 8. HTML Report Design

### Self-Contained Requirements

- Single `.html` file, zero external dependencies
- All CSS inlined; no CDN or network requests
- Works on `file://` protocol
- All document content HTML-escaped before insertion; never insert raw source HTML

### Content Security Policy

```
default-src 'none';
connect-src 'none';
object-src 'none';
base-uri 'none';
form-action 'none';
font-src 'none';
style-src 'unsafe-inline';
img-src data:;
script-src 'sha256-<hash-of-the-single-fixed-inline-script>';
```

This restrictive policy is sourced from the W3C CSP Level 3 (the current document) specification [SOURCE: https://www.w3.org/TR/CSP/].

**Zero-JS fallback**: The default static report (unified inline view, fidelity dashboard, TOC, change navigation via anchor links) works without any JavaScript. If JavaScript is disabled or the script hash mismatches, the report degrades gracefully to CSS-only operation with all essential content visible.

**Optional progressive enhancement**: Exactly one fixed inline script, authorized by a generated CSP SHA-256 hash, provides:
- Side-by-side synchronized scrolling
- Keyboard shortcuts (J/K for previous/next change)
- Collapsible unchanged sections

One fixed audited script body is bundled with the renderer, and report generation computes the CSP SHA-256 hash over its exact UTF-8 bytes. Any modification to the script body invalidates the CSP hash and the browser refuses execution — safe by construction.

### View Modes

- **Side-by-side**: Old left, new right, changes aligned by diff hunk; requires the authorized script for scroll sync, falls back to independent scroll without JS
- **Unified inline**: Single document with color-coded additions (+) and deletions (-); works fully without JS

### Fidelity Dashboard

- Format badge per node with tier classification
- Extraction warnings table with per-construct severity
- Move source/destination indicators
- Summary score: percentage of nodes that survived extraction without fidelity warnings
- Per-construct diagnostic provenance

### Accessibility

- WCAG 2.1 AA: keyboard navigation, ARIA labels, color-independent indicators (addition/deletion also marked with `+`/`-` text prefixes)
- Auto-generated table of contents
- Skip-navigation link
- Previous/Next change navigation via anchor links (CSS-only) and J/K keyboard shortcuts (script-only)

---

## 9. Scanned Document and OCR Support

Scanned or mixed-content PDFs are handled through an **optional local OCR tier**:

1. **Page rendering**: PDF pages are rendered locally using pdf.js to canvas/image buffers [SOURCE: https://mozilla.github.io/pdf.js/getting_started/].

2. **OCR**: Images are processed with a locally provisioned Tesseract.js worker and language data — Tesseract.js does not directly accept PDFs; pages must be pre-rendered [SOURCE: https://github.com/naptha/tesseract.js/blob/master/docs/faq.md].

3. **Diagnostics**: The OCR adapter emits per-page confidence scores, reading-order heuristics, and layout warnings. These are surfaced in the fidelity dashboard as per-node diagnostics.

4. **Visual comparison**: Image-level visual diff is documented as a **separate unevaluated dimension** — not in v1 scope and not claimed by text-level diff.

5. **Absent adapter handling**: When the optional OCR adapter or required language data is absent, the tool returns an actionable `unsupported-capability` result with a specific message identifying which adapter/language is missing, rather than silently downloading or producing an empty degraded output.

---

## 10. Security Model

### 4-Layer Defense-in-Depth

| Layer | Protections |
|---|---|
| **Input Validation** | File size limits, magic-byte format detection, MIME verification, password-protection rejection |
| **Parser Hardening** | Disable XML DTD/entities (DOCX), DOMPurify sanitization (HTML), disable JS/forms (PDF), disable external file access (DOCX via mammoth), isolate DOCX/HTML parsing in a worker/subprocess with time and memory limits [SOURCE: https://github.com/mwilliamson/mammoth.js/ security guidance] |
| **Output Sanitization** | All content HTML-escaped, CSP meta tag with restrictive policy (§8), no raw HTML from source in report, strip `javascript:` and `data:` URIs |
| **Resource Limits** | Max file size (50MB), CPU timeout (30s per adapter), memory limit (512MB per worker/subprocess), max AST node count, max output size |

### Source Content Treatment

All extracted source content (HTML, DOCX, PDF) is treated as **data, never as instructions**:
- Parsed into the canonical typed tree (§4)
- HTML-escaped on output; never inserted raw into the report
- Parser warnings are preserved and attached to relevant nodes via `FidelityWarning`

### Privacy Guarantees

- Zero network requests from the core library (optional OCR data is pre-provisioned, not downloaded at runtime)
- No telemetry, analytics, or crash reporting
- No document content leaves the local machine
- No cloud dependencies or API keys required

---

## 11. Portable Core vs. Skill Wrapper

The portable `document-diff` npm package exposes a public API (`capture`, `compare`, `render`) usable independently of OpenCode. The OpenCode skill wrapper adds slash commands (`/docdiff capture|compare|cleanup|status`), auto-capture integration in AI edit workflows, and workspace-aware path resolution. Both share the same core library.

---

## 12. Acceptance Criteria and Performance Budgets

### Quality Metrics (Proposed V1 Contract)

| Metric | Target |
|---|---|
| Change detection rate | ≥ 95% of intentional changes detected |
| False positive rate | ≤ 5% of reported changes are noise |
| XSS safety | Zero script execution from document content |
| Cross-platform | Pass on macOS, Linux, Windows |
| Report | Self-contained, no network requests, zero-JS fallback functional |

### Performance Budgets (Provisional p95 Targets — Acceptance Hypotheses to Validate)

These are explicitly provisional measurable p95 budgets to be validated against the fixture corpus. They are not measured benchmarks.

**Text documents (plain text, Markdown):**

| Document Size | p95 Extraction | p95 Diff | p95 Report | Peak Memory |
|---|---|---|---|---|
| 10 KB | 50 ms | 100 ms | 50 ms | 64 MB |
| 100 KB | 200 ms | 500 ms | 200 ms | 128 MB |
| 1 MB | 2 s | 5 s | 1 s | 256 MB |

**Structured documents (HTML, DOCX):**

| Document Size | p95 Extraction + Sanitization | p95 Diff | p95 Report | Peak Memory |
|---|---|---|---|---|
| 100 KB | 500 ms | 1 s | 500 ms | 256 MB |
| 1 MB | 5 s | 8 s | 2 s | 512 MB |

**Rich documents (text PDF):**

| Document Size | p95 Extraction | p95 Diff | p95 Report | Peak Memory |
|---|---|---|---|---|
| 100 KB | 2 s | 500 ms | 500 ms | 256 MB |
| 1 MB | 10 s | 2 s | 1 s | 512 MB |

**OCR tier (scanned PDF, optional adapter):**

| Page Count | p95 Render + OCR | Peak Memory |
|---|---|---|
| 10 pages | 30 s | 512 MB |
| 50 pages | 120 s | 1 GB |

**Report size cap**: Generated HTML report ≤ 2 MB for source documents up to 100 KB; ≤ 10 MB for source documents up to 1 MB.

All numbers above are provisional acceptance hypotheses to be validated or adjusted against the fixture corpus in Phase 5. No absolute fidelity percentages are claimed for rich-format extraction beyond the tier classification.

---

## 13. Implementation Phase Map

| Phase | Focus | Priority |
|---|---|---|
| Phase 1 (MVP) | Core diff engine + Text + Markdown adapters + unified HTML report + basic snapshot + canonical typed tree | P0 |
| Phase 2 | Fixture corpus + adversarial test corpus + security hardening + CSP audit + license gate + accessibility gate + performance validation | P0 |
| Phase 3 | HTML adapter + DOCX adapter (worker/subprocess isolation) + side-by-side view + fidelity dashboard + move detection | P0 |
| Phase 4 | Text PDF adapter + snapshot management CLI + cross-platform state directories | P1 |
| Phase 5 | OpenCode skill wrapper + accessibility refinement | P1 |
| Phase 6 (conditional) | Optional OCR adapter (PDF.js + Tesseract.js) — gated on Phase 2 fixture/security/license gates passing | P2 |

**Gate rule**: Rich-format adapters (DOCX, text PDF) and optional OCR must not enter implementation before fixture, security, and license gates are defined and pass in Phase 2.

---

## 14. Validation Corpus (33+ Fixture Pairs)

| Category | Pairs | Purpose |
|---|---|---|
| Basic text | 5 | Plain text + Unicode + whitespace changes |
| Markdown structure | 8 | Headings, lists, links, code blocks, tables, emphasis, YAML frontmatter |
| HTML structure | 5 | DOM changes, CSS-only changes, active-element stripping |
| DOCX conversion | 3 | Heading mapping, table fidelity, tracked-changes behavior |
| PDF extraction | 4 | Text PDF with varied layout, image-only PDF, mixed content |
| Move/replacement | 4 | Repeated identical blocks, reordered sections, renamed headings, partial edits within moved blocks |
| Normalization | 4 | Line endings, encoding, whitespace, metadata |
| Edge cases | 5 | Empty files, identical files, very large (1MB), binary files, deeply nested structures |
| Negative cases | 3 | Malformed files, password-protected, URL-encoded content |
| Hostile containers | 3 | DOCX with embedded scripts, HTML with `<script>`/`<iframe>`, PDF with JavaScript |
| Accessibility | 2 | Unicode/RTL/CJK text, screen-reader compatibility |
| **Security gates** | | CSP nonce/hash verification, XSS payload battery, DOMPurify bypass suite |
| **License gates** | | Dependency license audit before rich adapters; verify no GPL, confirm Apache-2.0/MPL-2.0 attribution |
| **OCR confidence** | 2 | Scanned text at varying DPI, mixed text-and-image pages |

---

## 15. Risk Register

| Risk | Severity | Mitigation |
|---|---|---|
| DOCX conversion loses critical formatting | High | Style map customization; explicit fidelity warnings per node; tracked-changes warning; worker/subprocess isolation |
| XSS via crafted HTML/DOCX bypasses DOMPurify | High | Defense-in-depth (DOMPurify + restrictive CSP + full escaping); adversarial test corpus; worker isolation |
| PDF text extraction produces garbled output | Medium | Limited tier classification; recommend DOCX/HTML over PDF; optional OCR adapter for scanned content |
| Large documents (10MB+) cause memory/timeout | Medium | Configurable limits; worker/subprocess isolation with time/memory caps; chunk-based processing for v1.5 |
| Snapshot accumulation fills disk | Low | Default retention policy; dry-run cleanup; disk-space check; cross-platform state directory |
| Unified ecosystem churn | Low | Pin major versions; npm lockfile |
| Optional OCR adapter accuracy inadequate | Medium | Return confidence scores and reading-order warnings; keep as optional tier; do not silently produce bad output |

---

## 16. Eliminated Alternatives

| Approach | Reason Eliminated | Source |
|---|---|---|
| Python runtime | No diff2html equivalent; two-language complexity for HTML reports | Lineage 1 |
| Rust/WASM (core) | Minimal document processing ecosystem; mammoth not available; jsdiff sufficient for v1 | Lineage 1, 2 |
| diff-match-patch | Repository archived Aug 2024 | All lineages |
| Pure line-based diff | Misses structural changes; false positives on text reflow | Lineage 2 |
| SQLite for snapshots | Unnecessary dependency for v1; flat files simpler | Lineage 1, 3 |
| Browser-first SPA | Cannot support automatic snapshot lifecycle or CLI integration | Lineage 2 |
| Electron/Tauri desktop app | ~200MB dependency weight; disproportionate for CLI-first use case | Lineage 2 |
| Git-dependent workflow | Violates core "no Git" requirement | All lineages |
| Cloud-hosted service | Violates local-only, offline, privacy requirements | All lineages |
| Monolithic skill-only | Loses portability; ADR-001 chose portable core + skill wrapper | Lineage 3 |
| Server-rendered HTML | Violates local-only constraint; must work offline without server | Lineage 2, 3 |
| Custom markdown parser | remark/mdast is the established ecosystem standard | Lineage 3 |
| Custom diff algorithm | jsdiff is extensible enough; unnecessary reinvention | All lineages |
| Hardcoded `~/.doc-diff/` storage | Not cross-platform; OS state directories required | Corrected synthesis |

---

## 17. Recommendations

1. **Build v1 on Node.js/TypeScript** with jsdiff and the unified.js ecosystem, targeting Node 22+ with Node 24 LTS as the development/default runtime.
2. **Start with Phase 1 MVP**: Text + Markdown adapters, jsdiff, canonical typed tree, self-contained HTML report with zero-JS fallback, basic snapshot.
3. **Defer rich adapters (DOCX, PDF) to Phases 3-4** — highest-risk adapters requiring worker isolation and security hardening. Do not start rich adapters before fixture, security, and license gates are defined and pass in Phase 2.
4. **Implement the 4-layer security model** before accepting any untrusted input.
5. **Use DOMPurify** for HTML sanitization (Apache-2.0 OR MPL-2.0); CSP meta tag with restrictive policy and SHA-256-hash-authorized inline script in all generated reports.
6. **Build the portable core first** as npm package `document-diff`, then wrap with OpenCode skill.
7. **Establish the validation corpus** before writing diff engine code (test-driven development).
8. **Target `npx document-diff compare file.md`** as the v1 MVP user experience.
9. **Isolate DOCX/HTML parsing** in workers/subprocesses with time/memory limits and preserve parser warnings [SOURCE: https://github.com/mwilliamson/mammoth.js/].
10. **Use OS state directories** for cross-platform snapshot storage, with restrictive permissions and dry-run cleanup.

---

## 18. Open Questions (Deferred to v2+)

1. Should v2 use WASM for PDF parsing (PDFium) to improve structure extraction further?
2. Should the report support export to Markdown or PDF for sharing?
3. Should snapshot storage use SQLite for concurrent-write safety at scale?
4. Should we add image-perceptual-diff for DOCX embedded images?
5. Should snapshot encryption-at-rest be added?
6. Should the skill support batch comparison (multiple files in one run)?
7. Can one canonical representation truly cover DOCX and HTML without false equivalence? (Mitigated by per-node fidelity warnings, format-specific sidecars excluded from structural equivalence, and explicit tier classification.)

---

## 19. Convergence Report

| Metric | Value |
|---|---|
| Stop reason | maxIterationsReached |
| Total iterations | 30 (3 lineages × 10) |
| All lineages converged | Yes — all recommend Node.js/TypeScript + jsdiff + format adapters |
| Cross-lineage disagreement | PDF tier classification; move detection scope (resolved by capability-tier contract and explicit v1 contract in §6) |
| Questions answered | All primary questions resolved |
| Approaches ruled out | 14 |
| Sources consulted | 30+ across npm docs, GitHub repos, academic papers, spec documents, W3C standards |

---

## 20. Methodology

Three independent research lineages ran concurrently through 10 iterations each, using the deep-research LEAF agent protocol. Lineage 1 focused on the npm ecosystem and library licensing, Lineage 2 on structural diffing and security, and Lineage 3 on API contracts and validation. The fan-out merge consolidated findings into this unified synthesis. This correction pass applies post-synthesis verification repairs without altering lineage state.

---

## 21. Evidence Matrix

| Primary Research Question | Supporting Section(s) | Primary Sources |
|---|---|---|
| Q1: Extraction pipeline and canonical representation | §3, §4 | unifiedjs.com, syntax-tree/mdast, cheerio.js.org, github.com/mwilliamson/mammoth.js, github.com/cure53/DOMPurify |
| Q2: Diff strategy and move detection | §6 | npmjs.com/package/diff, github.com/Wilfred/difftastic, github.com/GumTreeDiff/gumtree |
| Q3: Snapshot lifecycle | §7 | nodejs.org/api/fs.html, XDG Base Directory spec, macOS/Windows state directory conventions |
| Q4: HTML report contract and security | §8 | w3.org/TR/CSP, w3.org/WAI/WCAG22/Understanding, github.com/cure53/DOMPurify, github.com/mwilliamson/mammoth.js |
| Q5: Runtime, portable interface, and architecture | §2, §5, §11 | nodejs.org/en/about/previous-releases, nodejs.org/en/about/eol, github.com/mozilla/pdf.js, github.com/naptha/tesseract.js |
| Scanned PDF / OCR | §9 | mozilla.github.io/pdf.js/getting_started, github.com/naptha/tesseract.js |
| Dependencies and licenses | §2 | npmjs.com, github.com (DOMPurify LICENSE, pdf.js LICENSE, tesseract.js LICENSE) |

---

## 22. References

- jsdiff (npm `diff` v9.0.0): https://www.npmjs.com/package/diff
- unified.js: https://unifiedjs.com
- remark (mdast): https://github.com/syntax-tree/mdast
- DOMPurify: https://github.com/cure53/DOMPurify (Apache-2.0 OR MPL-2.0)
- mammoth.js v1.12: https://www.npmjs.com/package/mammoth — security guidance: https://github.com/mwilliamson/mammoth.js/
- cheerio v1.2: https://github.com/cheeriojs/cheerio
- pdf-parse: https://www.npmjs.com/package/pdf-parse
- PDF.js: https://mozilla.github.io/pdf.js/getting_started/ (Apache-2.0)
- Tesseract.js: https://github.com/naptha/tesseract.js/blob/master/docs/faq.md (Apache-2.0; does not accept PDFs directly — see FAQ)
- difftastic: https://github.com/Wilfred/difftastic
- GumTree: https://github.com/GumTreeDiff/gumtree
- Node.js releases and EOL: https://nodejs.org/en/about/previous-releases | https://nodejs.org/en/about/eol
- CSP Level 3 (current): https://www.w3.org/TR/CSP/
- Spec charter: `.opencode/specs/skilled-agent-orchestration/136-standalone-document-diff-skill/001-research-and-requirements/spec.md`
- Resource map: `.opencode/specs/skilled-agent-orchestration/136-standalone-document-diff-skill/001-research-and-requirements/resource-map.md`

<!-- /ANCHOR:research-synthesis -->

---

*Generated by deep-research fan-out (3 lineages, 30 iterations) | Session: fanout-document-diff-*-1783944168326-lgic9n*
*Corrected: post-synthesis verification 2026-07-13T18:00:00Z*
