---
title: "Code Graph Phase 012/003: Deep Research Issues"
description: "Final synthesis packet for the 10-iteration deep-research sweep over code graph, hooks/plugin, advisor, CocoIndex handoff, readiness, and test coverage issues. Classified 88 findings, reclassified default-scope behavior as design-intent, and produced the Phase 012 remediation backlog."
trigger_phrases:
  - "012 003 deep research issues"
  - "code graph deep research synthesis"
  - "code graph findings classification"
  - "remediation backlog 012"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-06

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph` (Level 2)
> Parent packet: `002-graph-and-context-optimization/004-code-graph`

### Summary

The Phase 012/001 sandbox campaign and Phase 012/002 native rerun surfaced issues across code-graph, hooks, advisor, CocoIndex handoff, readiness, and test-coverage surfaces. A 10-iteration deep-research sweep classified these issues, identified root causes, and produced the Phase 012 remediation backlog.

Eighty-eight findings were classified across the 10 iterations. The sweep produced several reclassifications that changed the remediation strategy:

1. **Default scope is design-intent, not a bug.** The Phase 012/001 sandbox initially classified the code-graph defaulting to end-user scope as a limitation. The deep research found that this was the intentional design from Phase 009. The finding was reclassified from P2 bug to design-documentation gap.
2. **Parser crash is a P0, not a P1.** The broad-scope parser crash was initially classified as P1 (medium severity). The deep research reclassified it to P0 after finding that the crash cascade could corrupt the index in addition to dropping symbols. This reclassification triggered the 012/007 priority escalation.
3. **Zero-node wipe and scope-shrink are separate P0s.** The sandbox classified them as one P0. The deep research found they are independent attack vectors with different root causes and fixes. They were split into 012/004 (zero-node rejection) and 012/005 (scope-guard defense).
4. **Medium-priority clusters are 5, not 3.** The sandbox found 3 medium-priority issues. The deep research expanded this to 5 (clusters A through E), which were addressed in Phase 012/006.

The sweep also identified test-coverage gaps: CocoIndex handoff tests were missing, readiness computational tests were absent, and the test-isolation infrastructure was incomplete.

### Added

- 10-iteration deep-research sweep with 88 classified findings
- Reclassification of default-scope behavior from P2 bug to design-documentation gap
- Reclassification of parser crash from P1 to P0 with index-corruption pathway
- Reclassification of zero-node and scope-shrink from one P0 to two independent P0s
- Expanded medium-priority cluster list from 3 to 5 (clusters A through E)
- Phase 012 remediation backlog with priority-ordered issue list

### Changed

- None. Research and classification phase.

### Fixed

- None. Research and classification phase.

### Verification

- 10 iteration files (iteration-001.md through iteration-010.md) in the research directory.
- `findings-registry.json` with 88 entries across all surface categories.
- `deep-research-state.jsonl` externalized state across all 10 iterations.
- `research.md` synthesis document with reclassification rationale.
- All findings mapped to remediation packets (012/004 through 012/007).

### Files Changed

| File | What changed |
|------|--------------|
| `research.md` (NEW) | Synthesis document with reclassification rationale |
| `findings-registry.json` (NEW) | 88 classified findings across all surfaces |
| `iterations/iteration-001.md` through `iteration-010.md` (NEW) | Per-iteration pass narratives |
| `deltas/` (NEW) | 10 iteration delta records |
| `deep-research-*.json` (NEW) | Config, state, strategy |
| `remediation-backlog.md` (NEW) | Priority-ordered issue list for Phase 012 |

### Follow-Ups

- **012/004 remediation (zero-node wipe).** Phase 012/004 implemented zero-node scan rejection based on this sweep's classification.
- **012/005 scope guard.** Phase 012/005 implemented the forceScopeChange gate.
- **012/006 cluster A-E polish.** Phase 012/006 addressed the expanded 5-cluster list.
- **012/007 parser resilience.** Phase 012/007 addressed the reclassified P0 parser crash with skip-list and quarantine.
- **Test-coverage gaps.** The identified CocoIndex handoff, readiness computation, and test-isolation gaps were filed for a future coverage-hardening packet.
