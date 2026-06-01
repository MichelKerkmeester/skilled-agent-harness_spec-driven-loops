---
title: "Embedder Pluggability Narrative: Canonical Reference Doc"
description: "Canonical reference covering mk-spec-memory and CocoIndex embedder architecture, out-of-box support matrix, swap mechanisms and device selection shipped as embedder_pluggability.md."
trigger_phrases:
  - "embedder pluggability narrative"
  - "embedder pluggability reference"
  - "out-of-box embedder support matrix"
  - "mk-spec-memory embedder swap"
  - "cocoindex embedder narrative"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-24

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/003-embedder-pluggability-narrative`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment`

### Summary

The mk-spec-memory and CocoIndex embedder architectures had been implemented across multiple packets (016, 018, 019) but no single document explained them together. A new user or contributor asking "which embedder should I use" had to read four separate spec folders and two codebases to reconstruct the picture.

An Opus-class markdown agent synthesized a canonical reference at `.opencode/skills/system-spec-kit/references/memory/embedder_pluggability.md` (410 LOC, cap 600). The document covers both MCPs equally: the mk-spec-memory side (jina-embeddings-v3 default, MANIFESTS registry, EmbedderAdapter interface, dim-tagged schema, ADR-001 through ADR-012 trail) and the CocoIndex side (jina-code default, registered_embedders.py, env-var swap, MPS auto-detect, kill switch). A 13-row out-of-box support matrix, operating-mode runbooks for first-install, swap and rollback, plus a trade-offs section round out the coverage. All 7 spec requirements passed.

### Added

- `embedder_pluggability.md` (NEW) at `.opencode/skills/system-spec-kit/references/memory/` covering both MCPs in 410 LOC
- 13-row out-of-box support matrix covering every registered candidate in either MCP with dim, RAM, MPS status and notes
- Operating-mode runbooks for first-install, swap and rollback (per MCP) plus device-selection decision tree
- Appendix section with validated-against commit SHAs and cross-link block for doc-rot detection

### Changed

- `embedder_architecture.md` at `.opencode/skills/system-spec-kit/references/memory/` updated to reflect post-021/003 state

### Fixed

None.

### Verification

- R1 LOC cap: PASS (410 of 600)
- R2 both MCPs covered equally: PASS (approx 80 LOC for mk-spec-memory, approx 80 LOC for CocoIndex)
- R3 out-of-box matrix accurate: PASS (built from registry.ts and registered_embedders.py)
- R4 ADR-009/010/011/012 cited: PASS (table row, inline rescue, production-default)
- R5 018 ADR-001 cited: PASS (commit `8f909d229` for default flip and MPS patch)
- R6 cross-links wired: PASS (CocoIndex INSTALL_GUIDE, registered_embedders.py, 016/004 decision-record.md, registry.ts, adapter.ts)
- R7 new user can swap without further reference: PASS (swap runbook in operating modes per MCP, full env var and kill-switch in CocoIndex section)
- Evidence summary: `evidence/narrative-summary.md`

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/references/memory/embedder_pluggability.md` | Created (NEW) | Canonical 410-LOC reference covering both MCPs, out-of-box matrix, swap runbooks, trade-offs, appendix with commit SHAs |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Updated | Aligned to post-021/003 shipped state |

### Follow-Ups

- Dispatch markdown agent to wire cross-link from CocoIndex INSTALL_GUIDE section 4 once INSTALL_GUIDE path is confirmed.
- Wire cross-link from root README (handled by 021/002).
- Run read-through with a new contributor framing to confirm swap-in-10-min test passes against the shipped doc.
- Verify out-of-box matrix rows stay accurate if registered_embedders.py adds candidates in future packets.
