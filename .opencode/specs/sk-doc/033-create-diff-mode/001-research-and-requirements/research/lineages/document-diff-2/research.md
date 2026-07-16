# Research Synthesis: Standalone Local AI Document Diff Skill

**Status**: Complete (max-iterations reached)  
**Generated**: 2026-07-13T14:55:00Z  
**Lineage**: fanout-document-diff-2-1783944168326-lgic9n  
**Iterations**: 10 | **Questions Answered**: 7/8 (Q8 partially — target estimates, needs measurement)  
**Stop Reason**: maxIterationsReached (convergenceThreshold=0, telemetry-only signals)

---

## 1. Executive Summary

The 10-iteration deep research loop investigated architectures for a standalone local AI document diff skill. The research converged on a **Node.js/TypeScript CLI library with self-contained HTML output** as the recommended v1 architecture shape. The system extracts documents to a normalized Markdown/mdast AST via format-specific adapters (unified.js ecosystem), performs structural diffing inspired by difftastic's AST-aware approach, and generates a secure, accessible, self-contained HTML report with fidelity warnings.

Key decisions: local-first automatic snapshots (not Git-dependent); semantic and structural comparison (not pixel-based); self-contained HTML with CSP security; portable core library with OpenCode skill wrapper.

---

## 2. Research Questions and Answers

### Q1: Which canonical representation and extraction pipeline best preserve semantic structure across formats?

**Answer**: Markdown/mdast as the canonical intermediate format, with the unified.js ecosystem (remark/rehype) providing a well-defined AST pipeline.

| Format | Adapter | Fidelity Tier | Key Limitation |
|--------|---------|---------------|----------------|
| Plain Text | Native (remark) | Full | None |
| Markdown | markdown-it / remark-parse | Full | None |
| HTML | rehype-parse + DOMPurify | Structural | Active content stripped |
| DOCX | mammoth.js (DOCX → HTML → hast) | Structural | Visual formatting approximated |
| PDF (text) | pdfjs-dist | Limited | Layout lost; tables may garble |
| Scanned PDF | Detection only | Unsupported | Cannot extract text |

The two-pass model (extract to AST, then normalize) suppresses conversion noise: Unicode NFC normalization, whitespace collapse, newline normalization, metadata stripping, and style-to-semantic mapping.

[SOURCES: iteration-002.md, iteration-007.md]

### Q2: Which diff algorithm strategy best combines readable changes, structural awareness, and noise suppression?

**Answer**: AST-aware structural diff with word-level text fallback.

The recommended strategy:
1. Parse both documents to normalized mdast/hast AST
2. Compute tree-level diff for structural changes (sections added/removed/reordered)
3. For leaf text nodes, compute word-level diff within structural context
4. Present hierarchically: structural changes frame the report, text changes fill details

This is inspired by difftastic's Dijkstra-based approach (structural diff as graph shortest-path problem). Pure line-based diffs (Myers, patience, histogram) are eliminated — they miss structural changes and produce false positives on text reflow.

Move detection is deferred to v1.5 (heuristic flagging only in v1).

[SOURCES: iteration-003.md, https://github.com/Wilfred/difftastic]

### Q3: Which automatic snapshot lifecycle is safe, atomic, recoverable, and intentionally smaller than version control?

**Answer**: Explicit-command capture model with filesystem-level atomicity guarantees.

```
Capture: diff capture <file>
Storage: ~/.document-diff/snapshots/{hash-of-abs-path}/{iso8601-ts}-{sha256}.snap
Atomicity: Write to temp → fsync → POSIX atomic rename
Retention: Keep last N snapshots (default 10), max age T days (default 30)
Cleanup: diff cleanup [--dry-run] [--older-than N]
Fallback: diff compare --before <a> --after <b> (explicit pair)
```

Safety guarantees: never overwrites source document; per-file locking for concurrency; crash-safe (temp files cleaned on startup); hash verification on read.

[SOURCE: iteration-004.md]

### Q4: Which local HTML report architecture is accessible, secure, self-contained, and honest about fidelity?

**Answer**: Self-contained single `.html` file with CSP meta tag, zero external dependencies, and progressive enhancement.

Key properties:
- All CSS/JS/fonts/images inlined; no CDN or network requests
- Dual view modes: inline (unified) and side-by-side with synchronized scrolling
- 4-level fidelity warning system (Info → Caution → Warning → Error)
- WCAG 2.1 AA accessibility: keyboard navigation, ARIA labels, color-independent indicators
- Security: Content-Security-Policy meta tag (`default-src 'none'; style-src 'unsafe-inline'; img-src data:`), all content HTML-escaped, active elements stripped

[SOURCE: iteration-005.md]

### Q5: Which runtime, portable interface, dependency set, and standalone-skill workflow best suit v1?

**Answer**: Node.js 20+ / TypeScript 5+ with npm-distributed package.

Core dependencies (all MIT/Apache 2.0): `unified`, `remark`, `rehype`, `mammoth`, `pdfjs-dist` (lazy-loaded), `DOMPurify`. Total ~15-20MB.

Portable core API:
```typescript
interface DocumentDiff {
  capture(path: string): SnapshotResult;
  compare(before: string, after: string, options?: DiffOptions): DiffResult;
  render(diff: DiffResult, options?: RenderOptions): string; // HTML output
}
```

Skill integration: `/docdiff capture|compare|cleanup|status` slash commands with auto-capture in AI edit workflows.

[SOURCE: iteration-006.md]

### Q6: What existing libraries and products exist for document diff/compare?

**Answer**: The ecosystem has mature text/structural diff tools but no standalone document diff product.

| Tool | Type | Stars | Maintained | Gap |
|------|------|-------|------------|-----|
| difftastic | Structural code diff | 25.6k | Yes | Code-focused, not documents |
| delta | Diff renderer | 31.4k | Yes | Requires git diff input |
| diff-match-patch | Text diff library | 8.1k | Archived | Plain text only |
| diff-so-fancy | Diff renderer | 18.1k | Yes | Requires git diff input |

No existing tool bridges structural diffing with rich document formats, generates self-contained HTML reports, or provides automatic snapshot management outside version control.

[SOURCE: iteration-001.md]

### Q7: What security constraints apply to handling untrusted DOCX, HTML, and PDF input?

**Answer**: 4-layer defense-in-depth model.

| Layer | Protections |
|-------|------------|
| Input Validation | File size limits, magic-byte format detection, MIME verification, password-protection rejection |
| Parser Hardening | Disable XML DTD/entities (DOCX), DOMPurify sanitization (HTML), disable JS/forms (PDF) |
| Output Sanitization | All content HTML-escaped, CSP meta tag, no raw HTML from source in report |
| Resource Limits | 30s CPU timeout, 512MB memory limit, max AST node count, max output size |

DOMPurify (12k+ stars, industry standard) is the recommended HTML sanitizer. Mammoth.js already disables external file access by default. pdf.js strips JavaScript by default.

[SOURCE: iteration-007.md, https://github.com/cure53/DOMPurify]

### Q8: What fixture corpus and measurable acceptance criteria should gate v1?

**Answer**: ~30 fixture pairs across 6 categories (text, markdown, HTML, DOCX, PDF, combined/malicious), 11 measurable acceptance criteria, and 10 performance benchmarks. Performance targets are estimates requiring real measurement for confirmation.

[SOURCE: iteration-009.md]

---

## 3. Architecture Recommendation

**Shape**: CLI Library with Self-Contained HTML Output

```
[Source Document]
       │
       ▼
[Format Detector] ──→ [Adapter Selection]
       │                    │
       ▼                    ▼
[Extraction] ──→ [Normalized mdast/hast AST]
       │                    │
       ▼                    ▼
[Snapshot Manager]    [Structural Diff Engine]
  (optional, for          │
   baseline capture)      ▼
                     [HTML Report Builder]
                            │
                            ▼
                     [Self-Contained .html]
```

**Runtime**: Node.js 20+ / TypeScript 5+  
**Distribution**: npm package (`document-diff`)  
**License**: MIT (all dependencies MIT or Apache 2.0)  
**Platform**: macOS, Linux, Windows (Node.js cross-platform)

---

## 4. Format Capability Tiers

| Tier | Formats | Adapter | User Warning |
|------|---------|---------|--------------|
| **Full Fidelity** | Plain Text, Markdown | Native (remark) | None |
| **Structural Fidelity** | HTML | rehype + DOMPurify | Active elements removed |
| **Structural Fidelity** | DOCX | mammoth | Layout may differ from Word |
| **Limited Fidelity** | PDF (text) | pdfjs-dist | Text only; visual review required |
| **Unsupported** | Scanned PDF, images, encrypted | Detection only | Cannot diff |

---

## 5. Snapshot Lifecycle

- **Capture**: `diff capture <file>` (explicit) or auto-capture in AI edit workflows
- **Storage**: `~/.document-diff/snapshots/{path-hash}/{iso8601-ts}-{sha256}.snap`
- **Atomicity**: temp file → fsync → rename; per-file locking
- **Retention**: last 10 per file, max 30 days (configurable)
- **Fallback**: `diff compare --before <a> --after <b>` for ad-hoc pairs

---

## 6. Diff Strategy

- **Primary**: AST-aware structural diff (Dijkstra-based, inspired by difftastic)
- **Fallback**: Word-level Myers diff for unsupported formats
- **Noise suppression**: Unicode NFC, whitespace collapse, metadata stripping, style→semantic mapping
- **Move detection**: Deferred to v1.5 (heuristic flagging in v1)

---

## 7. HTML Report Contract

- **Self-contained**: Single `.html` file; zero external dependencies
- **Views**: Inline (unified) and side-by-side, synchronized
- **Security**: CSP meta tag; all content escaped; active elements stripped
- **Accessibility**: WCAG 2.1 AA; keyboard navigation; screen reader support; color-independent indicators
- **Fidelity warnings**: 4-level system (Info/Caution/Warning/Error) per construct

---

## 8. Security Model

4-layer defense-in-depth:
1. **Input validation**: Size limits, format detection, password-protection rejection
2. **Parser hardening**: Disable XML entities, DOMPurify HTML, strip PDF JS
3. **Output sanitization**: All content escaped, CSP, no raw source HTML
4. **Resource limits**: CPU timeout (30s), memory (512MB), AST node count, output size

---

## 9. Portable Core vs. Skill Wrapper

The portable `document-diff` npm package exposes a public API (`capture`, `compare`, `render`) usable independently. The OpenCode skill wrapper adds slash commands, auto-capture integration, and AI edit workflow support. Both share the same core library.

---

## 10. Performance Targets (Estimated, Needs Measurement)

| Benchmark | Target |
|-----------|--------|
| Small doc (< 10KB) extraction | < 100ms |
| Medium doc (< 1MB) extraction | < 2s |
| Large doc (< 10MB) extraction | < 15s |
| Diff computation (1000-node AST) | < 500ms |
| Report generation (medium diff) | < 500ms |
| Peak memory (10MB doc) | < 256MB |

---

## 11. Recommendations

1. **Build v1 on Node.js/TypeScript** with the unified.js ecosystem as the AST pipeline foundation
2. **Start with Markdown, Text, and HTML adapters** (available immediately); add DOCX via mammoth; defer PDF to 007
3. **Implement the 4-layer security model** from iteration 7 before accepting any untrusted input
4. **Use DOMPurify** for HTML sanitization and a CSP meta tag in all generated reports
5. **Build the portable core first**, then wrap it with the OpenCode skill interface
6. **Establish the fixture corpus** before writing any diff engine code (test-driven development)
7. **Publish as npm package** `document-diff` with MIT license

---

## 12. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|-------------|
| Automerge-style CRDT merging | Designed for distributed merging, not local comparison; adds unnecessary complexity | https://github.com/automerge/automerge | 1 |
| Direct format-to-format comparison (no canonical intermediate) | N×M adapter combinatorial explosion; hub-and-spoke model is sustainable | Architecture analysis | 2 |
| Pure line-based diff (Myers/patience/histogram) for structured documents | Misses structural changes; produces false positives on text reflow; cannot distinguish semantic from formatting | https://difftastic.wilfred.me.uk/diffing.html | 3 |
| Browser-first SPA | Cannot support automatic snapshot lifecycle (REQ-003) or CLI/programmatic integration (REQ-006); browser storage is ephemeral | P0 requirement analysis | 8 |
| Electron/Tauri desktop application | Excessive dependency weight (~200MB for Electron) for a CLI-first use case; distribution complexity disproportionate to value | Architecture shape comparison | 8 |
| Python-only implementation | Lacks unified.js AST ecosystem; two-language complexity for HTML report generation | Runtime comparison; library analysis | 6, 8 |
| Rust-native binary | Minimal document processing ecosystem; mammoth not available; must bridge JS or Python for rich format adapters | Runtime comparison | 6 |
| Git-dependent workflow | Violates core requirement of working without Git for document comparison (REQ-003) | spec.md:178 | 8 |
| Cloud-hosted service | Violates local-only, offline, and privacy requirements of the spec | spec.md:210-213 | — |
| Visual/pixel diff comparison | Cannot distinguish semantic changes from layout changes; PDF-to-image pipeline is heavy and slow; spec explicitly says "do not promise visual comparison" | spec.md:289 | — |

---

## 13. Open Questions

1. **PDF visual comparison**: Should v1.5 add optional pixel-comparison mode for PDFs? (Deferred; the spec says "do not promise visual comparison unless the recommended architecture actually renders and evaluates visual output")

2. **DOCX false equivalence**: Can one canonical representation truly cover DOCX and HTML without creating false equivalence? (Mitigated by explicit fidelity warnings and structural-only tier classification)

3. **Snapshot encryption-at-rest**: Should `~/.document-diff/` snapshots be encrypted? (Deferred to v1.5; v1 relies on filesystem permissions)

4. **Zero-JS report fallback**: Should the HTML report work without JavaScript? (Recommended: yes — baseline report uses CSS-only; JS is progressive enhancement for view toggle and scroll sync)

5. **Cross-format comparison**: Should v2.0 support comparing DOCX to Markdown export? (Deferred to v2.0)

---

## 14. Risk Register

| Rank | Risk | Likelihood | Impact | Mitigation |
|------|------|------------|--------|------------|
| 1 | DOCX conversion loses critical formatting | Medium | High | Style map customization; explicit fidelity warnings; table of unsupported constructs |
| 2 | PDF text extraction produces garbled output | High | Medium | Clear "Limited Fidelity" tier classification; recommend DOCX/HTML instead; OCR optional adapter |
| 3 | Large documents (10MB+) cause memory/timeout | Medium | Medium | Configurable limits; streaming where possible; chunk-based processing for v1.5 |
| 4 | XSS via crafted HTML/DOCX bypasses sanitizer | Low | High | Defense-in-depth (DOMPurify + CSP + escaping); security review; adversarial test corpus |
| 5 | Snapshot accumulation fills disk silently | Medium | Low | Default retention policy (last 10, max 30 days); disk space check; cleanup command |

---

## 15. Later-Phase Decomposition

| Phase | Name | Priority |
|-------|------|----------|
| 002 | Core library and snapshot manager | P0 |
| 003 | Format adapters (Markdown, Text, HTML, DOCX) | P0 |
| 004 | Diff engine and noise suppression | P0 |
| 005 | HTML report builder | P0 |
| 006 | OpenCode skill wrapper | P1 |
| 007 | PDF adapter and OCR optional | P1 |
| 008 | Fixture corpus and acceptance testing | P0 |
| 009 | Performance optimization and streaming | P1.5 |
| 010 | Move detection and v1.5 features | P2 |

---

## 16. Validation Strategy

**Automated gates**: TypeScript compilation, ESLint, unit tests, fixture-based integration tests, DOMPurify + CSP security scan, axe-core accessibility audit.

**Manual review**: DOCX heading→semantic mapping accuracy, table rendering fidelity, PDF extraction quality, diff readability on structural changes, side-by-side alignment.

**Acceptance criteria**: 11 measurable criteria defined in iteration 9, including: 100% valid HTML output, 0 false changes on identical docs, 100% XSS neutralization, 0 external network requests in reports.

---

## 17. References

- difftastic: https://github.com/Wilfred/difftastic — structural diff architecture (25.6k stars, MIT)
- unified.js: https://unifiedjs.com — AST-based document processing ecosystem
- markdown-it: https://github.com/markdown-it/markdown-it — CommonMark parser (21.7k stars, MIT)
- mammoth.js: https://github.com/mwilliamson/mammoth.js — DOCX to HTML converter
- python-mammoth: https://github.com/mwilliamson/python-mammoth — DOCX to HTML (Python)
- DOMPurify: https://github.com/cure53/DOMPurify — HTML sanitizer (12k+ stars)
- diff-match-patch: https://github.com/google/diff-match-patch — text diff reference (archived)
- delta: https://github.com/dandavison/delta — git diff renderer (31.4k stars, MIT)
- diff-so-fancy: https://github.com/so-fancy/diff-so-fancy — git diff renderer (18.1k stars, MIT)
- Spec charter: `.opencode/specs/skilled-agent-orchestration/136-standalone-document-diff-skill/001-research-and-requirements/spec.md`
- Resource map: `.opencode/specs/skilled-agent-orchestration/136-standalone-document-diff-skill/001-research-and-requirements/resource-map.md`
