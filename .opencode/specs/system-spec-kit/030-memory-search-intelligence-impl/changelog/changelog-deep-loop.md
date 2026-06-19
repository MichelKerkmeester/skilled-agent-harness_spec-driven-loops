---
title: "Deep Loop: Reducer Anchor-Marker Fix Plus Deterministic Merge, Pool Gauges, Graceful Self-Stop"
description: "Two Wave-0 candidates hardened the Deep Loop runtime. The deep-research strategy template gained the seven reducer-required anchor markers, and the fan-out backend gained deterministic merge ordering, pool gauges and graceful self-stop on signal."
trigger_phrases:
  - "030 deep loop changelog"
  - "deep research strategy anchor markers reducer"
  - "fanout deterministic merge pool gauges"
  - "graceful self-stop empty-tick convergence"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/system-spec-kit/030-memory-search-intelligence-impl` (Level 3)
> Subsystem: Deep Loop (deep-research reducer template and deep-loop-runtime fan-out)
> Source: `spec.md` section 14 candidates 1, 12

### Summary

Two Wave-0 candidates landed on the Deep Loop surface, both additive with happy-path orchestration unchanged. Candidate 1 (Q6-anchor) fixes a hard failure in the deep-research reducer. The shipped strategy template carried none of the `ANCHOR` markers the `reduce-state` reducer requires, so the reducer hard-failed with "Missing anchor section key-questions" on the first reduce after iteration 1. Wrapping the seven reducer-owned sections in their anchor pairs makes a freshly-copied strategy file reduce deterministically. Candidate 12 brings three fan-out backend improvements: a deterministic content-derived total-order merge sort on top of the existing id-or-title dedup, read-side pool gauges for lag, pending and failed counts, and a graceful self-stop that flushes a partial summary marked `stopped:true` on SIGINT or SIGTERM while treating an empty or no-new-findings tick as valid convergence rather than failure. Candidate 12 was mutation-checked, so the merge-order, gauge and stopped-marker tests were confirmed to fail on injected mutations and to go green when restored.

### Added

- The seven reducer-owned anchor pairs (key-questions, answered-questions, what-worked, what-failed, exhausted-approaches, ruled-out-directions, next-focus) in the deep-research strategy template (Candidate 1).
- Read-side lag, pending and failed gauges on the fan-out pool events and final summary, without duplicating the upstream failure classification (Candidate 12).
- A graceful self-stop that flushes a partial summary marked `stopped:true` on SIGINT or SIGTERM (Candidate 12).
- Merge-order, gauge and graceful-stop unit tests across the fan-out suite.

### Changed

- The fan-out merge applies a deterministic content-derived total-order sort on top of the existing id-or-title dedup, so merged research and review findings order reproducibly across runs. The dedup alone was not a total order (Candidate 12).
- An empty or no-new-findings tick is now recorded as valid convergence rather than treated as a failure (Candidate 12).

### Fixed

- The deep-research reducer hard-failed on the first reduce because the shipped strategy template had no anchor markers. A freshly-copied strategy file now reduces deterministically (Candidate 1).
- Fan-out children that died silently before now flush a partial summary with a `stopped` marker on signal, so a stopped run is distinguishable from a crashed one (Candidate 12).

### Verification

| Check | Result |
|-------|--------|
| Reducer anchor parity | PASS: all seven anchor pairs added, reducer regex verified to match all seven (Candidate 1) |
| `node --check` (fan-out scripts) | PASS, exit 0 on all three `.cjs` (Candidate 12) |
| Fan-out unit suite | PASS: 58 fan-out tests (Candidate 12) |
| Mutation check | PASS: merge-order, gauge and stopped-marker tests fail on injected mutations and go green when restored (Candidate 12) |
| Comment hygiene and alignment drift | PASS (Candidate 12) |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md` | Modified |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Modified |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Modified |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-merge.vitest.ts` | Modified |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts` | Modified |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Modified |

### Commits

| Commit | Candidates |
|--------|-----------|
| `738e118751` | 1 (Q6-anchor reducer fix) |
| `46812f12a8` | 12 (deterministic merge order, pool gauges, graceful self-stop) |

### Follow-Ups

- None for these two candidates. Both are additive and leave happy-path orchestration unchanged.
