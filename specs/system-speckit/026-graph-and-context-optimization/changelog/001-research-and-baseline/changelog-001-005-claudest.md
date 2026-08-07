---
title: "005-claudest: Claudest Plugin Marketplace Deep Research"
description: "20-iteration deep-research audit of the Claudest Claude Code plugin marketplace and the claude-memory plugin. Produced 162 reducer-tracked findings, a 9-track adoption decision matrix, two packet-ready implementation briefs (FTS capability cascade and normalized analytics tables) and a six-packet execution-ready implementation roadmap."
trigger_phrases:
  - "claudest plugin marketplace research"
  - "claude-memory fts5 bm25 adoption matrix"
  - "005-claudest changelog"
  - "claudest research findings"
  - "fts capability cascade brief"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-08

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/005-claudest` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline`

### Summary

Public's memory and search stack lacked an evidence-grounded survey of how the Claudest `claude-memory` plugin implements probe-driven FTS cascade, Stop-time precomputed context summaries, and auditor/discoverer consolidation. Without that survey, any port of those patterns risked importing wrong assumptions or missing load-bearing implementation details.

A 20-iteration two-generation deep-research session audited the Claudest external Claude Code plugin marketplace (`external/.claude-plugin/marketplace.json`) and the `claude-memory` plugin across three distinct handoff layers: the original 10-question charter (iterations 1 to 7) that converged at iteration 7 with composite 0.84, a first continuation (iterations 8 to 12) that converted Q10 into packet-ready briefs, and an execution-ready continuation (iterations 13 to 20) that translated conclusions into implementation contracts and a dependency-ordered packet roadmap. All 18 questions (Q1 to Q18) were answered with source citations. The synthesis lives in `research/research.md` with the final roadmap in Section 19.

### Added

None. Research-only phase.

### Changed

None. Research-only phase.

### Fixed

None. Research-only phase.

### Verification

- All 18 questions (Q1 to Q18) answered across 20 iterations and two generations with `external/plugins/...` file:line citations.
- 162 reducer-tracked key findings logged in `research/findings-registry.json`.
- 9-track adoption decision matrix in `research/research.md` Section 13 (original charter) and Section 18.1 (first continuation); every row cites exact source paths and labels evidence type (`source-proven` or `README-level`).
- Two packet-ready briefs in `research/research.md` Section 18.4: Brief A (FTS capability cascade, narrowed to `fts5_bm25` to `like_scan`) and Brief B (normalized analytics tables), each with named Public file surfaces, forced-degrade verification matrices, and rollback plans.
- Execution-ready implementation roadmap in `research/research.md` Section 19 with six ordered follow-on packets.
- Cross-phase boundary with sibling phase `001-claude-optimization-settings` explicitly bounded in `research/research.md` Sections 14 and 15.
- `validate.sh --strict` rerun after continuation sync: PASSED.
- No edits made under `external/`.

### Files Changed

| File | Action |
|------|--------|
| `research/research.md` | Created: canonical 19-section synthesis including adoption matrix, two implementation briefs, and execution-ready roadmap |
| `research/iterations/iteration-001.md` through `iteration-020.md` | Created: per-iteration finding files (20 total) |
| `research/deep-research-strategy.md` | Created: analyst and reducer strategy file with Q1 to Q18 marked answered |
| `research/deep-research-dashboard.md` | Created: reducer-generated dashboard |
| `research/deep-research-config.json` | Created: config with `status=complete`, `maxIterations=20`, `lineageMode=completed-continue`, `generation=2` |
| `research/deep-research-state.jsonl` | Created: 28 JSONL lines covering 20 iteration records plus generation events |
| `research/findings-registry.json` | Created: 162 reducer-tracked key findings |
| `research/archive/research-v1-iter012-snapshot.md` | Created: immutable snapshot of the pre-generation-2 synthesis |

### Follow-Ups

- Restore the `fts4_match` lane in Brief A: the v1 was narrowed to `fts5_bm25` to `like_scan` because Public provisions only `memory_fts USING fts5`. Adding an `fts4_match` lane requires alternate FTS4 schema creation in the same implementation packet.
- Satisfy Brief B entry conditions before opening the normalized analytics packet: `024/003` must persist `transcript_path` into `HookState`, populate `speckitSessionId`, carry parsed cache token fields, and emit turn-level `lastTranscriptOffset` rather than session-level only.
- Address reducer and analyst section collision: the reducer sometimes overwrites analyst-owned KEY QUESTIONS and ANSWERED QUESTIONS sections in `strategy.md` when JSONL records use abbreviated question texts. A workaround is to re-add Q1 to Q18 summaries after each reducer run.
- Index the generation-2 continuation memory artifact: the latest save was written under a write-only policy and is not yet indexed in the memory MCP. A follow-on save with `generate-context.js` and rich JSON would make Section 19 findings retrievable via `memory_search`.
