---
title: "Task Breakdown: Advisor Scorer Eval Hardening"
description: "Executable task list: add the additive bucket schema and enum enforcement, load the delegation fixture and compute the named buckets, freeze the holdout and ambiguity fixtures, capture the ratcheted baseline under the harness regime, author the three gates, reconcile the two handler tests, and verify corpus-neutrality."
trigger_phrases:
  - "advisor eval hardening tasks"
  - "ratchet baseline task breakdown"
importance_tier: "high"
contextType: "implementation"
parent: "system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/016-skill-advisor-tuning/007-eval-hardening"
    last_updated_at: "2026-07-07T07:15:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "All tasks complete and verified"
    next_safe_action: "Orchestrator pushes the working tree to the shared branch"
---
# Task Breakdown: Advisor Scorer Eval Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete · `[ ]` pending · `[P]` parallelizable
- Each task lists its evidence (file, test, or command).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

- **M1**: Handler + schema additive edits typecheck and build (T-010..T-013).
- **M2**: Three fixtures frozen and the baseline captured (T-020..T-022).
- **M3**: Three gates green; handler and shapes tests reconciled (T-030..T-034).
- **M4**: Full-suite corpus-neutrality confirmed and the spec folder authored (T-040..T-051).
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Read the validate handler, its schema, the corpus, the projection env, the delegation fixture, and the divergence ratchet pattern. Evidence: advisor-validate.ts / advisor-tool-schemas.ts / labeled-prompts.jsonl / projection.ts / executor-delegation-cases.json / local-native-divergence-ratchet.vitest.ts read.
- [x] T-002 Confirm the two target source files are git-clean before editing. Evidence: `git status --porcelain` on advisor-validate.ts + advisor-tool-schemas.ts returns empty.
- [x] T-003 Verify the corpus carries valid bucket/source_type on all 193 rows. Evidence: bucket {32,32,32,32,36,29} and source_type {96,37,48,12} distributions match the enums.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-010 Add `bucketSliceSchema` (extends the validation slice with `minN` + `top1`) and the `slices.buckets` block to the output schema. Evidence: advisor-tool-schemas.ts diff; typecheck exit 0.
- [x] T-011 Enum-enforce bucket/source_type on `CorpusRowSchema`, retaining `.passthrough()`. Evidence: schema rejects a bad enum value; the 193-row loader still succeeds.
- [x] T-012 Add the delegation fixture loader + schema and `evaluateDelegationCases` (strict top-1, 'none' = correct abstain). Evidence: delegation slice computes 11/11 on the current tree.
- [x] T-013 Compute `slices.buckets.{review,memory_save,delegation}` over the full corpus and output them via `bucketSlice`. Evidence: buckets present with `minN` 32/32/11; rebuild dist exit 0.
- [x] T-020 Assemble the 78-row independent holdout (dedup family-normalized; drop the training collision). Evidence: 83 raw -> 4 intra-pool dupes -> 1 training collision -> 78 rows; disjoint from training.
- [x] T-021 Derive + freeze the ambiguity slice at the frozen `tau`. Evidence: 25 rows at `tau=0.03` under the harness regime; row-id set frozen.
- [x] T-022 Capture the baseline with sha256 fixture pins under the deterministic harness regime. Evidence: scorer-eval-baseline.json written; full 147/193, holdout 60/78, ambiguity 15/25, buckets 22/25/11.
- [x] T-030 Author the ratchet gate (exact-match, directional messages, sha256 pins, retained floors, `minN`). Evidence: 6 tests pass.
- [x] T-031 Author the holdout gate (>= baseline, re-proves disjointness + provenance). Evidence: 3 tests pass.
- [x] T-032 Author the ambiguity gate (>= baseline, non-empty, frozen `tau`). Evidence: 3 tests pass.
- [x] T-033 Extend the validate handler test (buckets present, `minN`, full-corpus scope, enum enforcement). Evidence: 3 new assertions pass.
- [x] T-034 Reconcile the shapes test for the now-required enum fields. Evidence: advisor-validate-shapes.vitest.ts green.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-040 Mutation-prove the ratchet: perturb the committed baseline; confirm the gate fails with the exact directional diff; restore. Evidence: baseline 147 -> 148 fails the "improvement/regression" message; restored to 147.
- [x] T-041 Confirm the gates exercise the scorer. Evidence: the gates failed with exact live-vs-baseline numeric diffs before the baseline was captured under the correct regime.
- [x] T-042 Run the full advisor suite; confirm corpus-neutrality. Evidence: 652 passed / 5 skipped; `python-ts-parity` 105/101/4 (passing hard assertions); divergence ratchet + ablation unchanged; the 4 failures are pre-existing scorer-independent infra flakes.
- [x] T-050 Author the Level 3 spec folder and record the three decisions. Evidence: spec/plan/tasks/checklist/decision-record/implementation-summary + description.json + graph-metadata.json.
- [x] T-051 Register the child in the parent `graph-metadata.json` `children_ids`. Evidence: `system-skill-advisor/016-skill-advisor-tuning/007-eval-hardening` after 006, before z_archive; `last_active_child_id` set.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0/P1 requirements met (REQ-001..REQ-008).
- No routing change; additive output + stricter input validation only; comment hygiene clean.
- 105/101/4 held byte-identical; ratchet mutation-proved; zero new suite failures.
- Deferred (out of packet): documenting the four fixtures in the routing-accuracy `README.md`, because a concurrent session holds the README dirty; the doc delta is handed off rather than clobbering their edit.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` · Plan: `plan.md` · Checklist: `checklist.md` · Decisions: `decision-record.md`
- Program umbrella: `system-skill-advisor/016-skill-advisor-tuning/001-scorer-saturation-root-fix`.
<!-- /ANCHOR:cross-refs -->
