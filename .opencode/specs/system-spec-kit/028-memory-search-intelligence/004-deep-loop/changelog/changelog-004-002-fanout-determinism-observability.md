---
title: "Changelog: Deep Loop Fan-out Determinism + Observability (028/004 determinism cluster) [004-deep-loop/002-fanout-determinism-observability]"
description: "Chronological changelog for the Deep Loop Fan-out Determinism + Observability (028/004 determinism cluster) phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/004-deep-loop/002-fanout-determinism-observability` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/004-deep-loop`

### Summary

The deep-loop fan-out determinism + observability trio shipped in the flat Wave-0 packet (030, commit 46812f12a8) and is the foundation already in place: the merge sorts its de-duplicated survivors with a hand-written content-then-id total comparator (compareByContentThenId, layered on the first-write-wins id||title dedup); the concurrent pool emits read-derived lag/pending/failed gauges (buildPoolGauges, no new state); and a SIGINT/SIGTERM during a long run flushes a stopped partial summary while an empty no-new-findings tick is valid convergence. This worktree now implements the Wave-1 tail: research and review order-invariance tests assert byte-identical merged registries across lineage-order permutations, fanout-merge.cjs sorts lineage labels and merged metadata arrays to close the full-registry arrival-order seam, and a default-off near-duplicate dedup option collapses normalized body-content restatements across research, review open, and review resolved findings.

### Added

- DL-pool-gauges — read-derived lag/pending/failed from buildPoolGauges({ total, settled, pending, failed }) with no new state; emitted live per settle and in the final summary (fanout-pool.cjs:58-63, :184-188, :240-248) [Done, commit 46812f12a8; the one un-caveated trio member ("gauges are clean", synthesis/01 gauges row); 030 §14 cand 12].
- DL-graceful-self-stop — flush a stopped partial summary on SIGINT/SIGTERM + treat an empty no-new-findings tick as valid convergence (fanout-run.cjs:490 empty-tick=convergence, :508-524 stopped flush idempotent at :511, :66-76 signal handlers) [Done, commit 46812f12a8; the shutdown-summary half (distinct from the NEEDS-BENCHMARK progress-heartbeat half); GO — confirmed clean (synthesis/01:95); 030 §14 cand 12].
- DL-arrival-order-property-test — added research and review property tests that run merges under multiple lineage-order permutations and assert byte-identical merged registries; sorted label dirs and merged metadata arrays close the arrival-order seam in full-registry output [Done locally; evidence: fanout-merge.vitest.ts, npx vitest run ../../deep-loop-runtime/tests/unit --reporter=dot → 34 files / 343 tests passed].
- DL-near-dup-merge-dedup (research merge) — added default-off normalized-body-content collapse in the research merge, available via enableNearDuplicateDedup, --enable-near-duplicate-dedup, or SPECKIT_FANOUT_NEAR_DUP_DEDUP; distinct same-id different-content records remain conflict variants [Done locally, default-off; evidence: research restatement-collapse + distinct-content tests].
- Re-confirm the shipped trio against 030 section 14 candidate 12 (46812f12a8) and current source: compareByContentThenId at the three merge sorts, buildPoolGauges lag/pending/failed, empty-tick=convergence + stopped flush.
- Confirm the out-of-scope residuals (D2/D3/Q2 reliability learning, newInfoRatio non-consumption, progress-heartbeat, the REFUTED preserve/recover galadriel candidates) are recorded as NO-GO/needs-benchmark/elsewhere, not silently dropped (spec.md section 3 Out of Scope).

### Changed

- DL-near-dup-merge-dedup (review merge) — applied the same default-off collapse to review open and resolved findings, preserving strongest-severity survivor selection and distinct-content conflict variants [Done locally, default-off; evidence: review open, review distinct-content, and review resolved variant tests].
- Re-run the order-invariance property test after the near-dup dedup landed — the broad deep-loop-runtime unit suite reran after T005/T006 and passed [Done; evidence: 34 files / 343 tests passed].
- Record that this cluster is independent of the absent D2 reliability signal (every input r=0.5; keyed only on content text + read-derived pool counters) in spec.md + plan.md.
- Confirm the resilience cluster (failure-class taxonomy, transient/fatal retry, orphan reset, recover-vs-fresh gate) is recorded as belonging to the sibling 003-fanout-failure-recovery, not silently merged into this cluster (spec.md section 3 Out of Scope).
- All 6 candidate rows have a final status in spec.md section 11 (3 Wave-0 DONE-with-commit, 3 local DONE rows — near-dup spans two merge-path rows of one candidate).
- The shipped trio traces to Wave-0 commit 46812f12a8 in ../../../030-memory-search-intelligence-impl/spec.md section 14 candidate 12.

### Fixed

- DL-merge-tiebreak — layer compareByContentThenId (content key → normalized id key → full stable stringify) on top of the first-write-wins id||title dedup so merged output is reproducible across runs; consumed at the three merge sorts (fanout-merge.cjs:142-163 comparator, :198/:312/:314 sorts) [Done, commit 46812f12a8; total-order ON TOP of the dedup because finding.id is not always present (corrected from the pass-1 "SOLID total-order" billing, roadmap.md:221); node --check + 58 fanout tests + mutation-checked; 030 §14 cand 12].
- Run validate.sh --strict on this sub-phase and fix structure issues.
- CHK-FIX-001 Each candidate has a class and status. Evidence: spec.md section 11.
- CHK-FIX-002 Same-class inventory recorded. Evidence: spec.md section 3 lists research and review merge paths separately for one dedup candidate.
- CHK-FIX-003 Consumer inventory recorded. Evidence: plan.md Data Flow names merge registry, severity rollup and sourceDiversity.
- CHK-FIX-004 Dedup adversarial table tests written before tail completion. Evidence: same-content collapse and same-id different-content survival tests landed before closeout.

### Verification

- Baseline typecheck - Pass
- Baseline broad unit suite - Pass
- Syntax - Pass
- Comment hygiene - Pass
- Targeted merge tests - Pass
- Final typecheck - Pass
- Final broad unit suite - Pass
- Strict packet validation - Pass

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Modified | Wave-0 comparator remains; Wave-1 adds deterministic label/metadata ordering and default-off normalized-body-content dedup |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Modified (Wave-0 46812f12a8) | buildPoolGauges read-derived lag/pending/failed; live per settle + final summary |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified (Wave-0 46812f12a8) | empty-tick=convergence + stopped partial-summary flush on SIGINT/SIGTERM |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-merge.vitest.ts` | Modified | Added 7 tests for order-invariance, default-off near-dup collapse, distinct-content survival, and resolved review variants |
| `.opencode/specs/.../002-fanout-determinism-observability/{spec,plan,tasks,implementation-summary,checklist}.md` | Modified | Level-2 packet docs reconciled to 3 Wave-0 DONE rows plus 3 local Wave-1 DONE rows |

### Follow-Ups

- No measured benefit number — every leverage/effort rating is structural inference; there is no before/after delta for the near-dup dedup's effect on sourceDiversity (roadmap.md §6; synthesis/03 §B).
- The near-dup dedup changes merge membership when enabled — it remains default-off until a caller deliberately opts in with the option, CLI flag, or environment variable.
- No live benchmark or reindex was run — per instruction, verification stayed at code, typecheck, and unit-test level.
