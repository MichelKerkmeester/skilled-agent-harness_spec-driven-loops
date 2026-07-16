---
title: "Verification Checklist: Eval Benchmark Fidelity Remediation"
description: "PENDING verification checklist for the flag-eval driver fix and criterion-4 re-run."
trigger_phrases:
  - "028 eval benchmark fidelity checklist"
  - "flag eval driver fix checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/004-review-remediation/001-eval-benchmark-fidelity"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created PENDING eval-benchmark-fidelity checklist"
    next_safe_action: "Do not mark items complete until the benchmark re-run evidence exists"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-checklist-006-001-eval-benchmark-fidelity"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Eval Benchmark Fidelity Remediation

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete or get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Scope is limited to the eval driver and benchmark doc, not production routing. Evidence: `git status` shows only `run-retrieval-flag-eval.mjs`, `benchmark-status.md` and the new test changed.
- [x] CHK-002 [P0] Prior criterion-4 run is reproduced as a baseline. Evidence: `/tmp/speckit-retrieval-flag-eval.PRIOR-baseline.json`.
- [x] CHK-003 [P1] Default routing and trigger call-site facts are confirmed against source. Evidence: `hybrid-search.ts:1394-1396` (route vs forceAll), `:1504` unconditional `exactTriggerSearch`, `:783-826` ignores `triggerPhrases`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Driver no longer hardcodes `forceAllChannels: true` for the per-flag pass. Evidence: per-flag `search()` uses `buildPerFlagSearchOptions()` (no `forceAllChannels`).
- [x] CHK-011 [P0] Trigger ablation no longer emits a meaningless lane. Evidence: `selectAblationChannels()` removes `'trigger'` from the sweep and the inert `triggerPhrases: []` lever is deleted. Corrected report has no trigger row. DECISION: removal chosen over a production `activeChannels.has('trigger')` guard (guard requires out-of-scope `hybrid-search.ts`/`query-router.ts` `ChannelName` changes that would risk default-off byte-identity).
- [x] CHK-012 [P1] Production routing code is unchanged. Evidence: no `.ts` lib files in `git status`.
- [x] CHK-013 [P1] Driver change is measurement-only with no runtime side effect. Evidence: only the eval driver options/channel-set changed. Runtime imports `dist/` unchanged.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Criterion-4 per-flag benchmark is re-run on the corrected driver. Evidence: `/tmp/speckit-retrieval-flag-eval.CORRECTED.json` (exit 0).
- [x] CHK-021 [P0] Embedding coverage is asserted healthy before trusting the re-run. Evidence: 0 query-embedding failures, vector-ablation delta +0.256, `runAblation` coverage assertion passed (report produced).
- [x] CHK-022 [P1] Trigger row no longer carries an identical-by-construction delta. Evidence: the trigger row is removed from the channel report entirely (satisfied by removal rather than differentiation, see CHK-011 DECISION). A deterministic test (`tests/retrieval-flag-eval-driver.vitest.ts`) asserts `'trigger'` is excluded and the inert lever is gone. It fails against the pre-fix driver.
- [x] CHK-023 [P1] Strict validation exits 0. Evidence: `validate.sh --strict` → RESULT: PASSED.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-060 [P0] Both P1-1 and P1-3 are addressed. Evidence: P1-1 is per-flag default routing, P1-3 is trigger noise row removed.
- [x] CHK-061 [P0] The criterion-4 flip verdict is re-derived from the new deltas. Evidence: NO flip (summary_fusion_lane -0.0361 hurts, cardinality_penalty 0.0), recommend keep default-off.
- [x] CHK-062 [P1] `benchmark-status.md` states the re-run supersedes the prior measurement. Evidence: "Driver-fidelity correction, supersedes the per-flag measurement below" + "Prior measurement (superseded ...)".
- [x] CHK-063 [P1] The concurrent session's files and packet 030 remain unchanged. Evidence: `git status` shows `rrf-fusion.ts`/deep-research/commands/.gitignore untouched by this seat, no packet-030 path changed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or shard paths are leaked into the benchmark doc. Evidence: `benchmark-status.md` records provider name + recall numbers only, no absolute DB/shard paths or secrets.
- [x] CHK-031 [P1] Re-run commands are reproducible and do not encourage unsafe execution. Evidence: a single read-only `node scripts/evals/run-retrieval-flag-eval.mjs` repro line recorded (operates on a temp DB copy).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and checklist remain synchronized. Evidence: tasks/checklist marked DONE with matching evidence, spec/plan scope unchanged.
- [x] CHK-041 [P1] Parent phase map still points to this child. Evidence: parent `graph-metadata.json` unchanged by this seat.
- [x] CHK-042 [P2] Benchmark re-run evidence is linked from this child when execution happens. Evidence: `tasks.md` T008/T010 and `implementation-summary.md` cite `/tmp/speckit-retrieval-flag-eval.CORRECTED.json` and the `benchmark-status.md` tables.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files are committed. Evidence: benchmark outputs live under `/tmp`, not in the repo (`git status` clean of them).
- [x] CHK-051 [P1] Benchmark output stays in the recorded evidence area. Evidence: outputs at `/tmp/speckit-retrieval-flag-eval.{CORRECTED,PRIOR-baseline}.json`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-20
<!-- /ANCHOR:summary -->
