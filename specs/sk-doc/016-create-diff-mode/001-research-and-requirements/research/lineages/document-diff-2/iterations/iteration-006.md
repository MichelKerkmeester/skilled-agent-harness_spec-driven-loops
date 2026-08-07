# Iteration 6: Runtime Selection, Dependency Analysis, and Skill Workflow

## Focus

Select the v1 runtime, analyze dependencies, and define the skill workflow boundary.

## Findings

### Finding 1: Runtime Comparison

| Runtime | Pros | Cons | Verdict |
|---------|------|------|---------|
| **Node.js/TypeScript** | Best unified.js ecosystem; mammoth.js native; rehype/remark; npm ecosystem; JS in HTML report; WASM for heavy libs | Async complexity; memory for large files | **RECOMMENDED for v1** |
| Python | python-mammoth; pdfplumber; clean sync code; strong doc processing libs | No unified.js; HTML report JS generated separately; two-ecosystem complexity | Viable alternative |
| Rust (compiled binary) | Maximum performance; single binary; cross-compilation | Minimal document processing ecosystem; mammoth not available; must bridge JS or Python for rich formats | v1.5+ for perf-critical paths |
| Go | Simple deployment; good cross-compilation | Very limited document processing ecosystem | Not recommended |

**Decision**: Node.js/TypeScript for v1. The unified.js ecosystem is the decisive factor — it provides the only unified AST pipeline across formats.

### Finding 2: Minimal Dependency Set for v1

Core dependencies (npm packages, all MIT/Apache licensed):

| Package | Purpose | Weight | Alternative |
|---------|---------|--------|-------------|
| `unified` | AST pipeline framework | Light | — (core) |
| `remark-parse` | Markdown → mdast | Light | markdown-it |
| `remark-stringify` | mdast → Markdown | Light | — |
| `rehype-parse` | HTML → hast | Light | parse5 |
| `rehype-stringify` | hast → HTML | Light | — |
| `mammoth` | DOCX → HTML | Medium | python bridge |
| `pdfjs-dist` | PDF text extraction | Heavy (WASM) | pdf-parse |
| **Diff engine** | AST comparison | Light | Custom or tree-edit-distance |
| **HTML builder** | Report construction | None | Inline templates |

Optional adapters (lazy-loaded or subprocess):
- Tesseract.js (OCR for scanned PDFs) — very heavy, optional
- python-docx bridge (for DOCX features mammoth misses) — optional

Total npm install size estimate: ~15-20MB (mostly pdfjs-dist WASM)

### Finding 3: Portable Core vs. Skill Wrapper Architecture

```
┌─────────────────────────────────────────┐
│         Standalone OpenCode Skill        │
│  (trigger, config, workflow integration) │
├─────────────────────────────────────────┤
│         Document Diff Library            │
│  (public API, Node.js package)           │
├───────────┬──────────┬──────────────────┤
│ Markdown  │ HTML     │ DOCX Adapter     │
│ Adapter   │ Adapter  │ (mammoth.js)     │
├───────────┴──────────┴──────────────────┤
│         Canonical Diff Engine            │
│  (AST comparison + text fallback)        │
├─────────────────────────────────────────┤
│         HTML Report Builder              │
│  (self-contained, secure, accessible)    │
├─────────────────────────────────────────┤
│         Snapshot Manager                 │
│  (capture, store, identify, cleanup)     │
└─────────────────────────────────────────┘
```

The portable core library exposes:
```typescript
interface DocumentDiff {
  capture(path: string): SnapshotResult;
  compare(before: string, after: string, options?: DiffOptions): DiffResult;
  render(diff: DiffResult, options?: RenderOptions): string; // HTML
}
```

The skill wrapper adds:
- Slash command triggers (`/docdiff capture`, `/docdiff compare`)
- AI edit workflow integration (auto-capture before edit, auto-compare after)
- OpenCode-specific configuration and UX

### Finding 4: Offline and Privacy Properties

| Property | Implementation |
|----------|---------------|
| **Zero network calls** | All processing local; no telemetry; no update checks by default |
| **No account required** | Pure local operation |
| **Document content never leaves device** | All parsing, diffing, and rendering in-process |
| **Snapshots stored locally** | Configurable directory; never uploaded |
| **Dependency audit** | npm audit on install; SBOM available |
| **License compliance** | All dependencies MIT or Apache 2.0; no GPL/AGPL |

### Finding 5: Skill Workflow Integration

The standalone OpenCode skill provides:

```markdown
# Skill: document-diff

## Commands
/docdiff capture <file>     — Capture a snapshot of a document
/docdiff compare            — Compare latest snapshot with current file
/docdiff compare --before X --after Y  — Explicit pair comparison
/docdiff cleanup            — Clean old snapshots
/docdiff status             — Show snapshots and pending comparisons

## Auto-Capture Integration
When the skill detects an AI edit workflow starting on a supported document:
1. Automatically capture baseline snapshot
2. After edit completes, offer to generate comparison report
3. Open report in browser or save to disk
```

## Assessment

**newInfoRatio**: 0.7 — Runtime selection is a decision synthesis from prior evidence. The portable core vs. skill wrapper architecture and offline/privacy properties are novel contributions.

## Recommended Next Focus

Security constraints for untrusted document input — parser isolation, resource limits, active content stripping.
