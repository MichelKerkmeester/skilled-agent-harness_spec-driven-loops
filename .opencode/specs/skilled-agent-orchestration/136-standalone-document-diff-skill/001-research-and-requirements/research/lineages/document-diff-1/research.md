# Research Synthesis: Standalone Local AI Document Diff Skill

**Status**: Complete | **Iterations**: 10 | **Stop Reason**: maxIterationsReached
**Session**: fanout-document-diff-1-1783944168326-lgic9n | **Generated**: 2026-07-13T15:30:00Z

---

## 1. Executive Summary

This research investigated the architecture and v1 contract for a standalone, local-first document diff tool that provides Git-style review for AI-edited documents. All five key questions from the research charter are answered with evidence-backed recommendations. The recommended architecture is a TypeScript/Node.js portable core (`document-diff-core`) with a thin OpenCode skill wrapper, using established npm libraries for diffing (jsdiff), HTML rendering (diff2html), Markdown parsing (unified/MDAST), HTML parsing (rehype/HAST), and optional DOCX conversion (mammoth).

---

## 2. V1 Architecture Recommendation

### Architecture Diagram
```
document-diff CLI (capture | compare | list | cleanup | config)
    |
OpenCode Skill Wrapper (@document-diff)
    |
document-diff-core
    |-- Adapters (Text, Markdown/MDAST, HTML/HAST, DOCX/mammoth)
    |-- Snapshot Manager (filesystem store, SHA-256 hash, TTL cleanup)
    |-- Diff Engine (jsdiff + diff2html HTML renderer)
    |
Dependencies: diff, diff2html, mammoth?, unified, chokidar?
```

### Runtime
**TypeScript/Node.js** (Node 18 LTS+). All required libraries are npm-native. Python, Rust, Deno evaluated and ruled out.

### Key Library Choices
| Component | Library | Version | License | Weekly Downloads |
|-----------|---------|---------|---------|-----------------|
| Diff engine | `diff` (jsdiff) | 9.0.0 | BSD-3-Clause | 95M |
| HTML renderer | `diff2html` | 3.4.x | MIT | ~200K |
| DOCX parser | `mammoth` | 1.12.0 | BSD-2-Clause | 5.2M |
| Markdown parser | `unified` + `remark-parse` | latest | MIT | ecosystem |
| HTML parser | `rehype-parse` | latest | MIT | ecosystem |
| File watching | `chokidar` | 5.0.0 | MIT | 188M |

---

## 3. Format Support Tiers

| Tier | Formats | Parser | Fidelity | Notes |
|------|---------|--------|----------|-------|
| **Full** | Plain Text, Markdown, HTML | Native AST parsers -> normalize -> diff | HIGH | Structural + semantic changes captured |
| **Limited** | DOCX | mammoth -> HTML -> normalize -> diff | MEDIUM | Conversion noise expected; sanitize mammoth output |
| **Unsupported** | PDF, images, scanned docs | N/A | N/A | Reject with explanation; recommend external converter |

---

## 4. Diff Algorithm and Noise Suppression

**Primary algorithm**: Myers O(ND) diff via jsdiff.

**Noise suppression tactics**:
- Token-level granularity selection (`diffLines` for structure, `diffWords` for semantics)
- Format-specific normalization before diffing (whitespace, list markers, link references, heading anchors)
- Canonical re-serialization via format-specific ASTs (MDAST -> markdown, HAST -> HTML)
- Metadata exclusion (YAML frontmatter optionally excluded)
- Line ending and encoding normalization (CRLF -> LF, all to UTF-8)

**Ruled out**: diff-match-patch (archived Aug 2024, no maintenance).

---

## 5. Snapshot Lifecycle

**Four-phase model**: Detect -> Capture -> Compare -> Cleanup

**Storage**: Filesystem-based under `~/.document-snapshots/`, organized by `{filePathHash}/{timestamp}.snap` with JSON metadata sidecars. Permissions: `0700` dir, `0600` files.

**Change detection**: SHA-256 content hash on capture; skip diff if current hash matches stored hash.

**Triggers**: Primary mode is explicit API (`capture()`, `compare()`). Optional chokidar-based file watcher for continuous monitoring.

**Retention**: TTL-based expiration (default 7 days), pair-based retention (last 10 snapshots per file). Auto-cleanup on next capture.

---

## 6. HTML Report Design

**Rendering**: diff2html with side-by-side and line-by-line modes, word-level change highlighting, syntax highlighting.

**Fidelity header** (above diff):
| Indicator | Values |
|-----------|--------|
| Format Match | `same` / `converted` |
| Conversion Fidelity | `native` / `high` / `medium` / `low` |
| Change Severity | `minor` / `moderate` / `major` / `rewrite` |
| Risk Level | `low` / `medium` / `high` |

**Self-containment**: All CSS, JS, and images inlined. Single `.html` file works on `file://` protocol. No CDN references, no network requests.

**Change classification**: Content changes, structural changes, formatting changes, metadata changes.

---

## 7. Skill Interface

**CLI commands**:
- `document-diff capture <path>` — capture before-snapshot
- `document-diff compare <path> [--before <file>] [--after <file>] [--output <html>]` — generate diff
- `document-diff list <path>` — list stored snapshots
- `document-diff cleanup [--older-than <duration>]` — remove expired snapshots
- `document-diff config` — manage configuration

**Programmatic API** (for AI agents):
```typescript
import { capture, compare, listSnapshots, cleanup } from 'document-diff-core';
const snapshot = await capture('file.md');
const result = await compare(snapshot.id, 'file.md');
const html = result.toHtml({ outputFormat: 'side-by-side' });
```

**OpenCode skill**: Thin wrapper with workspace-aware path resolution. Follows OpenCode skill authoring conventions.

---

## 8. Security

| Threat | Mitigation |
|--------|------------|
| Path traversal | Resolve paths against base directory; reject `..` after resolution |
| Symlink attacks | `fs.realpath()` before access; refuse symlinks by default |
| Malicious DOCX (XSS) | Sanitize mammoth output through HAST pipeline |
| HTML injection in reports | diff2html escapes content; sanitize custom headers |
| Denial of service | Size limits (10MB max), `diffMaxChanges`, `maxEditLength` |
| Snapshot permissions | `0700` directories, `0600` files, no world-readable |

---

## 9. Cross-Format Comparison

When formats differ, normalize both sides to a common plain-text representation with optional structural markers, then diff. Fidelity score computed from format match, conversion count, and source complexity. Explicit fidelity downgrade labels on reports.

**Fidelity scoring algorithm**: `baseFidelity * conversionPenalty * formatMatchBonus`

---

## 10. Remaining Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Mammoth XSS from DOCX | High | HAST sanitization pipeline |
| jsdiff on very large files | Medium | Size limits + timeout |
| MD/HST ecosystem churn | Low | Pin major versions |
| Cross-format fidelity gaps | Medium | Explicit labels and warnings |

---

## 11. Recommendations

1. **Start with Phase 2 (Core Implementation)** implementing the adapter pattern with Text + Markdown + HTML support first.
2. **Defer DOCX** to Phase 5 — it's the highest-risk component due to mammoth security concerns.
3. **Build the validation corpus** before Phase 3 CLI implementation to enable TDD.
4. **Target `npx document-diff compare file.md`** as the v1 MVP user experience.
5. **Keep PDF clearly unsupported** with a helpful error message suggesting external conversion.

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|------------------|----------|-------------|
| diff-match-patch | Repository archived Aug 2024; no maintenance | GitHub repo status | 2 |
| Python runtime | No diff2html equivalent; HTML rendering much harder | npm ecosystem analysis | 6 |
| Rust/WASM runtime | Ecosystem mismatch; no jsdiff/diff2html equivalents | npm ecosystem analysis | 6 |
| Deno runtime | Smaller ecosystem; compatibility gaps for v1 | Runtime comparison | 6 |
| SQLite snapshot storage | Unnecessary dependency for v1 | Storage strategy analysis | 4 |
| In-memory-only snapshots | Not persistent across sessions | Storage strategy analysis | 4 |
| PDF diff in v1 | No parser preserves layout for structural diff | Library ecosystem assessment | 3, 9 |
| Server-side rendering | Violates local-first constraint | spec.md requirements | 5 |
| External CDN dependencies | Violates self-contained requirement | spec.md requirements | 5 |
| Custom diff algorithm | jsdiff is extensible enough | jsdiff API analysis | 2 |
| GUI-only interface | Violates AI agent integration | spec.md requirements | 8 |
| REST API | Violates local-only constraint | spec.md requirements | 8 |

---

## 12. Open Questions

All five key questions from the research charter are answered:

1. **Canonical representation**: Adapter pattern with format-specific parsers (MDAST, HAST, mammoth) normalizing to canonical text representation. **RESOLVED** (Iteration 1, 3).
2. **Diff algorithms**: jsdiff (Myers O(ND)) with format-specific normalizers. **RESOLVED** (Iteration 2).
3. **Snapshot lifecycle**: Four-phase model with filesystem storage, SHA-256 hashes, TTL cleanup. **RESOLVED** (Iteration 4).
4. **HTML report**: diff2html with fidelity header, self-contained single file. **RESOLVED** (Iteration 5).
5. **Portable core + skill**: TypeScript/Node.js core with 5 CLI commands + OpenCode wrapper. **RESOLVED** (Iteration 6, 8).

---

## 13. Recommended Later-Phase Decomposition

| Phase | Focus | Depends On |
|-------|-------|------------|
| Phase 2 | Core implementation (adapters, snapshots, diff engine) | Phase 1 |
| Phase 3 | CLI + HTML report (5 commands, self-contained output) | Phase 2 |
| Phase 4 | OpenCode skill wrapper | Phase 3 |
| Phase 5 | DOCX + advanced formats | Phase 2 |
| Phase 6 | Testing + hardening (validation corpus, security, perf) | Phase 3 |

---

## 14. Validation Corpus Proposal

| Corpus Pair | Purpose |
|-------------|---------|
| `pair-same-markdown/` | Same-format Markdown before/after (heading, list, paragraph changes) |
| `pair-same-html/` | Same-format HTML pairs |
| `pair-docx-to-markdown/` | DOCX -> Markdown conversion fidelity |
| `pair-empty/` | Empty file edge case |
| `pair-large/` | ~1MB text performance test |
| `pair-identical/` | No-change detection |
| `pair-encoding/` | UTF-8 vs Latin-1 encoding handling |

---

## 15. Convergence Report

- **Stop reason**: maxIterationsReached (10/10)
- **Total iterations**: 10
- **Questions answered**: 5/5 (100%)
- **Average newInfoRatio**: 0.645
- **newInfoRatio trend**: [1.0, 0.75, 0.8, 0.7, 0.65, 0.6, 0.55, 0.5, 0.4, 0.25] — expected decline as topic space was exhausted
- **Stuck count**: 0
- **Recovery events**: 0
- **Blocked stops**: 0

---

## 16. Methodology

Each iteration followed the deep-research LEAF agent protocol: read state, research 3-5 sources, externalize findings, report newInfoRatio, cite sources. Sources included npm package documentation, GitHub repositories, and the research charter's spec.md and resource-map.md. All recommendations cite authoritative evidence.

---

## 17. References

- jsdiff (npm `diff` v9.0.0): https://www.npmjs.com/package/diff
- diff2html: https://github.com/rtfpessoa/diff2html
- diff-match-patch (archived): https://github.com/google/diff-match-patch
- MDAST specification v5.0.0: https://github.com/syntax-tree/mdast
- mammoth (DOCX converter) v1.12.0: https://www.npmjs.com/package/mammoth
- chokidar (file watcher) v5.0.0: https://www.npmjs.com/package/chokidar
- Research charter: `.opencode/specs/skilled-agent-orchestration/136-standalone-document-diff-skill/001-research-and-requirements/spec.md`
- Resource map: `.opencode/specs/skilled-agent-orchestration/136-standalone-document-diff-skill/001-research-and-requirements/resource-map.md`

---

*Generated by deep-research loop | Lineage: document-diff-1 | Session: fanout-document-diff-1-1783944168326-lgic9n*
