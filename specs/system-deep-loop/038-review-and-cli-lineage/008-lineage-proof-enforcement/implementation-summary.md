---
title: "Implementation Summary: Phase 8: lineage-proof-enforcement"
description: "Planned. Nothing is built yet. This records the evidence the plan rests on: where each defect sits in the runner, merge and projection, and what the 2026-10-12 run showed on disk."
trigger_phrases:
  - "lineage proof enforcement implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-review-and-cli-lineage/008-lineage-proof-enforcement"
    last_updated_at: "2026-10-12T12:00:00Z"
    last_updated_by: "claude-opus-5.5"
    recent_action: "Planned the phase and confirmed each finding against the code and the saved run"
    next_safe_action: "Build the T001 to T003 fixtures and record each failing against the current code"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs"
      - ".skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-12-lineage-proof-enforcement-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Refuse a missing dashboard at merge, or run the reducer in the runner"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 8: lineage-proof-enforcement

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-lineage-proof-enforcement |
| **Status** | Planned |
| **Completed** | Not yet |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. The phase is planned. What follows is the evidence the plan was checked against, so the implementer starts from confirmed facts.

### Phase 8: lineage-proof-enforcement

The runner marks a lineage fulfilled at `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:265-272` once the worker returns at `:3984`. The worker's gates are missing artifacts, stop policy and salvage. None of them reads route proof, and the route-proof field list at `:756-757` serves only duplicate selection. `verify-iteration.cjs` has no caller in `fanout-run.cjs` or `fanout-merge.cjs`, and neither script calls `reduce-state.cjs`.

The duplicate rows have a named producer. The research state projection at `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts:214-224` rebuilds each iteration row with 7 keys and no route proof. The `deepseek-4` leaf saw that and appended its full records a second time, against the prompt pack's rule at `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:63` and `:71`. Its own stdout says "5 gateway records + 5 route-proof canonical records", and its `research.md:151` gives the reason. Rows 7 to 11 equal the delta's iteration records field for field and carry no `reportedTimestamp`, so they did not pass through `append-state-record.cjs`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None yet | Planned | See `spec.md` Files to Change |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. Each finding was checked against the current code and the saved run before planning. Line numbers were read on 2026-10-12.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the duplicate rows at the projection, and also reject them at the runner | The projection dropping route proof is what moved the leaf to write twice. The runner gate catches any other leaf that does the same. |
| Do not rely on the verifier alone for the `deepseek-4` shape | The verifier accepts route proof from the delta when the state row lacks it, at `verify-iteration.cjs:466-483`, so that lineage would pass it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `deepseek-4` state rows | 11 rows for 5 iterations, observed |
| Lineages without a dashboard | `deepseek-3` and `deepseek-4` of 4, observed |
| spec-kit `SOURCE_TAGS` helper on the run's packet | 1 WARN, `iteration-003.md:40` cites `references/2026/README.md:83-84` past the end of an 81-line file, observed |
| Implementation checks | Not run. Nothing is built. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The two runs carry different counts** The 35 iteration rows against 30 in merged metrics belong to the official rerun, where three lineages duplicated. The expansion run shows 29 rows with only `deepseek-4` duplicating. Both close out at 20 iterations.
2. **The blank-line citation was not located** The review reported one citation landing on a blank line. A bounds check will not catch that case, and this phase does not try to.
<!-- /ANCHOR:limitations -->
