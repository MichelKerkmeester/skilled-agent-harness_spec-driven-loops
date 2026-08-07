---
title: "Post-Stress Follow-Up Research: v1.0.2 P0/P1/P2 fix proposals refined"
description: "10-iteration deep-research loop converted four v1.0.2 stress-test follow-ups from tagged to actionable patch proposals. A parallel 10-iteration review loop audited the integrated 012-015 implementation. Both loops ran to completion."
trigger_phrases:
  - "post-stress follow-up research"
  - "v1.0.2 P0 P1 P2 fix proposals"
  - "cli-copilot Gate 3 bypass research"
  - "code-graph fast-fail testability"
  - "CocoIndex seed-fidelity passthrough"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/011-research-post-stress-finding-followups`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

Four v1.0.2 stress-test follow-ups (cli-copilot `/memory:save` Gate 3 bypass, code-graph fast-fail not testable in the harness, file-watcher debounce gap, unused CocoIndex fork telemetry fields) were tagged but lacked actionable proposals. A 10-iteration `/deep:start-research-loop:auto` loop with cli-codex (gpt-5.5, high reasoning, fast service tier) produced a concrete patch proposal for each follow-up including evidence, root-cause hypothesis, fix candidates, recommended approach, estimated scope, falsifiable success criteria. Two architectural seams (authority token vs recovered context, specialist telemetry vs composed retrieval ranking) were named for downstream scoping. A parallel 10-iteration deep-review loop then audited the integrated 012-015 implementation as a cohesive unit, surfacing 0 P0 / 2 P1 / 7 P2 cross-cutting findings and recommending three follow-on remediation packets.

### Added

- None. Research-only phase.

### Changed

- None. Research-only phase.

### Fixed

- None. Research-only phase.

### Verification

| Check | Result |
|-------|--------|
| Research loop stop reason | `maxIterationsReached` (10/10 completed, 0 failed) |
| `research/research.md` exists and is non-empty | Confirmed. 28-minute wall-clock run. |
| All 4 follow-ups covered with labeled sections | Q-P0 (cli-copilot bypass), Q-P1 (fast-fail testability), Q-P2 (debounce), Q-OPP (CocoIndex seed-fidelity) each present with evidence and fix candidates |
| Light architectural touch: named seams | 2 seams surfaced (authority token seam, specialist telemetry seam) |
| `newInfoRatio` trajectory | 0.74 to 0.22 overall decay with two rebounds at iterations 5 and 8 |
| Review loop stop reason | `maxIterationsReached` (10/10 completed, 0 failed) |
| Review verdict | CONDITIONAL (0 P0 / 2 P1 / 7 P2 findings) |
| `review/review-report.md` exists and is non-empty | Confirmed. 31-minute wall-clock run. |

### Files Changed

| File | What changed |
|------|--------------|
| `research/research.md` (NEW) | Final synthesis document covering all 4 follow-ups plus 2 architectural seams |
| `research/iterations/` (NEW) | 10 iteration documents (`iteration-001.md` through `iteration-010.md`) |
| `research/deltas/` (NEW) | 10 JSONL delta records (`iter-001.jsonl` through `iter-010.jsonl`) |
| `research/deep-research-state.jsonl` (NEW) | Loop state with per-event timing and synthesis completion record |
| `research/deep-research-config.json` (NEW) | Executor config: cli-codex, gpt-5.5, reasoning_effort=high, service_tier=fast |
| `research/findings-registry.json` (NEW) | Per-follow-up findings registry produced by the research loop |
| `review/review-report.md` (NEW) | Cross-packet audit report for the 012-015 integrated implementation |
| `review/iterations/` (NEW) | 10 review iteration documents (`iteration-001.md` through `iteration-010.md`) |
| `review/deep-review-state.jsonl` (NEW) | Review loop state with per-event timing |
| `review/deep-review-config.json` (NEW) | Review executor config: cli-codex, gpt-5.5, reasoning_effort=high, service_tier=fast |

### Follow-Ups

- Implement the cli-copilot target-authority helper proposed in Q-P0: a wrapper inside `executor-config.ts` that injects a `targetAuthority` token on every Copilot dispatch so recovered memory cannot override workflow-approved authority. Estimated scope is 80-120 LOC across one helper and two YAML call-sites.
- Implement the deterministic integration sweep for code-graph fast-fail proposed in Q-P1: an isolated `SPEC_KIT_DB_DIR`-scoped test covering all four `fallbackDecision` matrix branches. Estimated scope is 150-250 LOC, test-only with no production change.
- Implement the `getGraphReadinessSnapshot()` non-mutating helper proposed in Q-P2: threads the `full_scan` vs `selective_reindex` distinction from `ensure-ready.ts` through the `code_graph_status` response so operators see actionable readiness states. Estimated scope is 100-180 LOC across one helper and the status handler.
- Implement the CocoIndex seed-fidelity passthrough proposed in Q-OPP: additive metadata passthrough of `raw_score`, `path_class`, `rankingSignals`, `dedupedAliases`, `uniqueResultCount` through `code_graph_context` with zero score or ordering changes. Estimated scope is 150-250 LOC across four schema and handler files.
- Address the 2 P1 and 7 P2 cross-cutting findings from the review loop. The review-report recommends three remediation packets: Packet A (degraded-readiness envelope parity, P1 required), Packet B (cli-copilot dispatch test parity, P2), Packet C (catalog and playbook degraded alignment, P2).
