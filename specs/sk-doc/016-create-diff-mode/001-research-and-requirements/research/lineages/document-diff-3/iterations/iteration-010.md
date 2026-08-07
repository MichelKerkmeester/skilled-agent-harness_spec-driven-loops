# Iteration 10: Gap Analysis and Remaining Open Questions

## Focus
Cross-cutting gaps: edge cases, performance constraints, remaining uncertainties, implementation risks.

## Findings

### F1: Identified Gaps and Unknowns
| Gap | Confidence | Recommended Resolution |
|-----|-----------|----------------------|
| DOCX tracked-changes handling | Medium | mammoth can extract comments but NOT tracked changes; warn user and recommend "Accept All Changes" before diff |
| PDF structure heuristics accuracy | Low-Medium | Needs empirical testing with real-world PDFs; may require per-document tuning |
| Move detection algorithm | Low | jsdiff does not natively detect moves; v1 labels moves as delete+add; histogram algorithm (v2) could improve |
| Large document memory usage | Medium | 1MB+ Markdown parsing is fast but DOM-based HTML/DOCX may stress memory; streaming not yet investigated |
| Unicode normalization strategy | Medium | Recommend NFC normalization before diff; needs explicit testing with CJK and RTL text |
| Image diff in DOCX | Low | mammoth can extract images but comparing them requires perceptual hashing (out of v1 scope) |
| Concurrent AI edits | Low | If two AIs edit same document simultaneously, snapshot race conditions possible; document-level locking needed |
| Embedded objects (OLE in DOCX) | Low | mammoth cannot extract embedded Excel/Visio objects; flag as unsupported |

### F2: Edge Cases Addressed
From spec.md §8, here is the v1 handling strategy:
- **Empty document**: Generate diff showing all new content as additions
- **Identical documents**: Report "No changes detected" with empty diff
- **Renamed file**: Snapshot follows content hash, so rename is transparent
- **Missing baseline**: Error with actionable "run `doc-diff watch` first" message
- **Unreadable file**: Graceful error with permission/encoding diagnosis
- **Mixed encoding**: Auto-detect via BOM or content sniffing; flag if ambiguous
- **Very long lines**: No line-wrapping in diff; side-by-side view shows horizontal scroll
- **Concurrent snapshots**: Lockfile prevents races; second process waits or fails fast
- **Symlinks**: Resolved before snapshot; diff compares target content
- **Path traversal in output**: Sanitized to prevent writing outside report directory

### F3: Risk Mitigation Summary
| Risk (from spec.md §6) | v1 Mitigation |
|------------------------|---------------|
| Rich-document conversion noise | Fidelity dashboard with per-construct warnings |
| Untrusted HTML/DOCX/PDF input | HTML-escape, CSP, no external entity resolution, size limits |
| Snapshot data loss | Atomic writes, content-addressed storage, hash verification |
| Large-document diff cost | Configurable size limits, timeout on diff computation |
| Heavy conversion dependencies | Optional adapters loaded on-demand; pure-JS where possible |

### F4: Remaining Open Questions (for Phase 2+)
1. Should v1 use WASM for PDF parsing (PDFium) to improve structure extraction?
2. Should the report support export to Markdown or PDF for sharing?
3. Should snapshot storage use SQLite for concurrent-write safety at scale?
4. Should move detection use histogram algorithm or AST-based diff?
5. Should the skill support batch comparison (multiple files in one run)?
6. Should we add image-perceptual-diff for DOCX embedded images?

### F5: All Primary Questions Now Answered
- **Q1** (Canonical representation): Structured token model with sections, fidelity scoring
- **Q2** (Diff algorithms): jsdiff Myers for v1; histogram as v2 upgrade path
- **Q3** (Snapshot lifecycle): SHA-256 content-addressed, 30-day LRU, atomic writes
- **Q4** (HTML report): Self-contained, side-by-side+unified, CSP-hardened, fidelity dashboard
- **Q5** (Portable core + skill): Two-layer; core npm package + OpenCode skill wrapper
- **Q6** (Format matrix): 4 tiers (Full, Limited, Adapter, Unsupported) for 7 formats
- **Q7** (Existing libraries): diff + mammoth + cheerio + remark + pdf-parse = complete v1 stack

## Assessment
- **newInfoRatio**: 0.40 — gap-filling iteration; most findings were consolidations and edge-case analysis
- **Novelty Justification**: Systematic gap analysis, edge-case handling table, all spec questions now answered with evidence

## Reflection
### What Worked Across All Iterations
1. npm package pages provided authoritative, up-to-date library documentation
2. The canonical representation model mapped cleanly to real libraries
3. Spec.md provided clear guardrails that kept research focused
4. Format tier model (Full/Limited/Adapter/Unsupported) proved robust

### Dead Ends
- pdf-parse npm page was inaccessible (403); used general knowledge instead
- Could not find a maintained pure-JS PDF structure extractor; PDF remains the weakest tier

## Recommended Next Focus
SYNTHESIS: Compile all 10 iterations into final research.md
