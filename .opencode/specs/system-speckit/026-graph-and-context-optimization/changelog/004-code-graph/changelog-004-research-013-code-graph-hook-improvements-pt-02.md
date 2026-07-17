---
title: "Code Graph Phase 004/Research/013-Pt-02: Hook Improvement Investigation"
description: "10-iteration deep-research investigation into code-graph and hook contract leakage. Converged on 6 findings (3 P1, 3 P2). Core pattern: information exists in one layer but is dropped before the next layer receives it."
trigger_phrases:
  - "004 research 013 pt 02"
  - "code graph hook improvement investigation"
  - "contract leakage"
  - "read-path soft continuation"
  - "CocoIndex bridge ranking"
importance_tier: "normal"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-22

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph` (Research-only)
> Parent packet: `026-graph-and-context-optimization/004-code-graph`

### Summary

A 10-iteration deep-research investigation targeted the code-graph and hook surfaces. The investigation asked: what information do the layers produce that the next layer does not receive? The answer was contract leakage at three boundaries.

Six findings surfaced. Three P1 issues and three P2 issues.

The P1 findings were: (F-001) the read-path silently returned degraded results when a full scan was required instead of signaling the blocked state, (F-002) the CocoIndex bridge returned search results but dropped the semantic ranking scores, and (F-003) stale enrichment metadata persisted across scans without being reset. The P2 findings were: (F-004) detector summaries were write-only with no read path, (F-005) the structured startup payload from `buildStartupBrief()` never reached runtime hooks, and (F-006) context deadline contracts were defined in the type system but never wired.

The investigation stopped at the 10-iteration cap. The `newInfoRatio` trajectory stayed above 0.05 across all iterations, indicating additional surface area remained uncovered by the 10-pass budget. The four parent packet implementation streams that followed (Phase 004) addressed the P1 findings directly. The P2 findings were filed as follow-ups.

### Added

- None. Research-only phase.

### Changed

- None. Research-only phase.

### Fixed

- None. Research-only phase.

### Verification

- 10 iteration files (iteration-001.md through iteration-010.md) in the research directory.
- `findings-registry.json` with 6 entries (3 P1, 3 P2).
- `deep-research-dashboard.md` tracking iteration-level metrics.
- `deep-research-state.jsonl` externalized state across all 10 iterations.
- `research.md` (227 lines) synthesis document.

### Files Changed

| File | What changed |
|------|--------------|
| `research/002-readiness-cocoindex-and-startup-contract-research/research.md` (NEW) | Synthesis document with 17 sections |
| `research/002-readiness-cocoindex-and-startup-contract-research/iterations/iteration-01.md` through `iteration-10.md` (NEW) | Per-iteration pass narratives |
| `research/002-readiness-cocoindex-and-startup-contract-research/deltas/` (NEW) | Per-iteration delta records in JSONL |
| `research/002-readiness-cocoindex-and-startup-contract-research/findings-registry.json` (NEW) | Structured findings registry |
| `research/002-readiness-cocoindex-and-startup-contract-research/deep-research-*.json|md` (NEW) | Config, state, dashboard, strategy files |

### Follow-Ups

- **F-004 detector summaries read path.** The write-only detector summaries need a query surface. Filed for a future observability packet.
- **F-005 startup payload transport.** Three of four runtime hooks dropped the structured payload. Addressed by the Phase 004 implementation's startup payload parity stream.
- **F-006 context deadline wiring.** Deadline contracts were defined but never wired. Addressed by the Phase 004 implementation's bounded-context contracts stream.
- **Additional surface area.** The investigation stopped at the 10-iteration cap with `newInfoRatio` above 0.05. A follow-up investigation may cover the remaining surface.
