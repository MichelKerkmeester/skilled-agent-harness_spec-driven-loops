---
title: "Implementation Summary"
description: "A fan-out research merge now refuses a lineage whose dashboard shows the reducer never wrote its projections, and warns when provenance cannot be confirmed."
trigger_phrases:
  - "lineage reducer compliance implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-review-and-cli-lineage/007-lineage-reducer-compliance"
    last_updated_at: "2026-10-11T19:55:33Z"
    last_updated_by: "generate-context"
    recent_action: "Built the reducer provenance refusal in fanout-merge with tests"
    next_safe_action: "Monitor fanout-merge refusals in later research fanouts"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs"
      - "specs/system-deep-loop/038-review-and-cli-lineage/007-lineage-reducer-compliance/scratch/evidence/lane-01-reducer-provenance.txt"
      - "specs/system-deep-loop/038-review-and-cli-lineage/007-lineage-reducer-compliance/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:601be1061ad8801f3acb5943f5cc1a8559bf8a62add226b5720b3045b695fac9"
      session_id: "scaffold-007-lineage-reducer-compliance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-lineage-reducer-compliance |
| **Completed** | 2026-10-11 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A fan-out research merge no longer reads a lineage registry the reducer did not write without saying so. A dashboard that exists without the reducer's stamp refuses that lineage, and a lineage with no dashboard merges with a warning, so the merge never treats silence as proof of provenance.

### Phase 7: lineage-reducer-compliance

The fan-out merge now inspects `deep-research-dashboard.md` in every research lineage that carries an on-disk registry. The reducer always writes one fixed description line into that dashboard, so the merge reads the line as a provenance stamp. A dashboard without it proves the projections were hand-written, and the lineage is refused: its registry leaves the merged set, `refused_reducer_provenance` lists it in the JSON payload, and `lineage_reducer_provenance_missing` prints on stderr with the lineage name and the missing stamp. A lineage with no dashboard leaves provenance unconfirmed, so it still merges and prints `lineage_reducer_provenance_unverified`, with `reducer_provenance_warnings` in the payload. A stamped dashboard passes without a line. The inspection runs only for research lineages and only where a registry exists.

### Review Fixes

A code review of the merge found two issues, and both are fixed. The first was an attribution table that read as if a refused lineage had merged. `fanout-attribution.md` listed the lineage's row with `n/a` in the verdict cell. `buildAttributionMd` now receives the refused set and writes `REFUSED` in that cell for a refused lineage, so the table cannot show one as merged. The second was a merge that aborted when one lineage's dashboard was a symbolic link. The resolution error escaped `inspectResearchReducerProvenance` and `main` exited 3 with INPUT_VALIDATION before any lineage merged. The inspection now returns a refused result with a reason, so `main` refuses only that lineage, names it in `refused_reducer_provenance`, prints the reason in the `lineage_reducer_provenance_missing` stderr event and merges the remaining lineages. Registry symlink handling is unchanged and still aborts.

Two regression cases cover the fixes, so `fanout-merge-reducer-provenance.vitest.ts` now holds five. The baseline, the red and green runs and a negative control on the reconstructed pre-fix script are in `scratch/evidence/lane-review-fixes-merge.txt`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Modified | Read the dashboard stamp at merge time, refuse hand-written projections and linked dashboards, mark refused lineages in the attribution table, warn on unconfirmed provenance |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge-reducer-provenance.vitest.ts` | Created | Five regression cases, three from the `proof-a` and `proof-b` shapes and two for the review fixes |
| `specs/system-deep-loop/038-review-and-cli-lineage/007-lineage-reducer-compliance/scratch/evidence/lane-review-fixes-merge.txt` | Created | Baseline, negative control and final runs for the two review fixes |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Updated | Packet record filled from the lane evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The reducer runs only as a model-executed step of the detached lineage workflow, so nothing machine-verifies that the step ran. The step that lets it be skipped is `step_reduce_state` at `.skilled/commands/deep/assets/deep-research-auto.yaml:1841`, whose command at `:1843` invokes `deep-research/scripts/reduce-state.cjs`. It sits in the `phase_loop` list the detached CLI leaf orchestrates itself, handed to it by `fanout-run.cjs:1602-1614`. When no recognised synthesis event is present, `findMaxIterationsPolicyViolation` at `fanout-run.cjs:1043` falls back at `:1073-:1075` to `completionFromArtifacts` at `:1015`, which validates only `research.md` at `:1023-:1025` and the iteration count at `:1027-:1032`. The one registry-shaped check on that path, `hasLineageRegisteredFindings` at `:950`, proves only that `keyFindings` is non-empty, never who wrote it. That is why `proof-a` passed completion with hand-written projections. On the saved evidence, its registry carries 8 hand keys and none of the reducer's machine-owned fields, and its dashboard lacks the stamp, while `proof-b` shows the stamp and the reducer-owned shape.

The change landed test first. The new suite ran red, exit 1 with 2 failures and empty stderr, before the check existed, then green, 3 of 3, after it. The merge set ran 74 of 74 across 5 files, and the check then ran end to end over the saved `proof-a` and `proof-b` folders, where `proof-a` was refused and `proof-b` merged alone. Nothing was committed.

**Amendment to the refusal wording**: refusal fires on positive evidence, a dashboard that exists without the reducer stamp. A lineage with no dashboard merges with a warning, because every existing merge fixture is a hand-built registry with no dashboard, and refusing those would fail SC-002. REQ-001 allows a lineage to be refused or flagged, so unconfirmed provenance takes the flagged path.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Put the gate at the merge, not in the runner | The workflow cannot be fixed by the runner without duplicating the reducer call, and the skip is leaf non-compliance with an unenforced workflow step. The operator placed the gate at the merge. |
| Refuse only on positive evidence, and flag everything else | Refusing dashboard-less registries would fail SC-002, because every existing merge fixture is a hand-built registry with no dashboard and editing those tests was outside the lane allowlist. REQ-001 allows a refusal or a flag. |
| Exclude a refused registry from the merged set | A refusal that still merged the data would gate nothing. `refused_reducer_provenance` in the payload names what was dropped. |
| Grade severity by evidence, error for hand-written and warning for unconfirmed | An error needs positive evidence. A missing dashboard may simply predate the projections, so it stays visible without blocking the merge. |
| Build the regression case from the saved artifacts | The skip is model behaviour that does not reliably reproduce, so the fixture comes from the saved `proof-a` and `proof-b` folders instead of a rerun. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Red run of the new suite, before the check existed | PASS as a negative control, exit 1, 2 failed and 1 passed, empty stderr in both failures |
| Green run of the new suite | PASS, exit 0, 3 of 3 |
| Merge suite, 5 files | PASS, 74 of 74 (71 pre-existing plus 3 new), exit 0 |
| Review-fix cases, red before and green after | PASS. On the pre-fix script rebuilt in an isolated copy, 2 of 5 failed, the two new cases, exit 1. On the fixed script, 5 of 5, exit 0. The 3 original cases passed in both runs |
| Merge suite after the review fixes | PASS, 6 files and 106 of 106, exit 0, against a 104 baseline, so the delta is the 2 new cases |
| Static checks after the review fixes | PASS, `node --check scripts/fanout-merge.cjs` exit 0 and `git diff --check` exit 0 |
| End to end over the saved proof lineages | PASS, exit 0, `refused_reducer_provenance: ["proof-a"]`, merged registry `mergedFrom: ["proof-b"]` with 4 findings and no `proof-a` finding id present |
| Regression on `fanout-run.vitest.ts` | PASS with baseline parity, 9 failed and 158 passed of 167 before and after, delta 0. The 9 are pre-existing sandbox timeouts, each ending `exitCode: null` at the test's own 20s spawn budget, and none invokes `fanout-merge.cjs` |
| Static, `node --check` and `npm run typecheck` | PASS, both exit 0. The package typecheck covers `lib/**/*.ts` only, so the targeted check below carries the test file |
| Static, targeted `tsc` on the new test | PASS, exit 0, with a control command that exits 2 on a pre-existing error, proving the command checks types |
| Comment hygiene on both changed files | PASS, exit 0, no spec paths or artifact ids in code comments |
| `validate.sh --strict` on this packet | 2 errors, both GENERATED_METADATA (source fingerprint and description drift against the edited docs), and no other error. The 2 are the expected generated-metadata lag until the next save |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The review loop has no matching check.** The provenance inspection runs only for research lineages, so a review lineage with hand-written projections is not gated by this change.
2. **The attribution file still lists a refused lineage's row.** `fanout-attribution.md` is built from all lineage data, so a refused lineage keeps its row even though its findings are excluded from the merged registry. The review fix writes `REFUSED` in that row's verdict cell, so the file no longer reads as if the lineage had merged.
3. **A registry with no dashboard merges with a warning rather than a refusal.** This is the recorded amendment. Unconfirmed provenance stays visible but is not blocked, which leaves the door open for a hand-written registry that also omitted its dashboard.
<!-- /ANCHOR:limitations -->

---
