---
title: "Implementation Summary"
description: "Phase 3 turned 217 core template hints into value tokens stamped v2.3 and gave the placeholder gate a Draft lifecycle for v2.3 docs, with no change to any existing packet verdict."
trigger_phrases:
  - "versioned placeholder gate implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate"
    last_updated_at: "2026-10-24T15:45:00Z"
    last_updated_by: "conductor"
    recent_action: "Closed phase 3 after the census, suite and review"
    next_safe_action: "Start phase 004"
    blockers: []
    key_files:
      - "specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-versioned-placeholder-gate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-versioned-placeholder-gate |
| **Status** | Complete |
| **Completed** | 2026-10-24 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An unfilled template hint now fails strict validation once a new packet leaves Draft, and only warns while it is Draft. Older packets keep the verdict they had.

### Phase 3: versioned-placeholder-gate

The five core templates (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` and the `acceptance-criteria.md` addon) now hold 217 `[YOUR_VALUE_HERE: ...]` tokens in place of bare bracketed hints, and their seven stamp lines and five manifest entries read v2.3. Both `validatePlaceholders` in the orchestrator and the shell rule `check-placeholders.sh` read the stamp and the spec status: a v2.3 doc warns on an unfilled token while `spec.md` has the Status Draft and errors at any other status, a doc with an older stamp keeps its error, and `[NEEDS CLARIFICATION:` is an error everywhere. One new test file pins the four cells and compares the two implementations. The review found one parity gap, which is fixed: the legacy `<YOUR_VALUE_HERE:` form is no longer deferred to a warning.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `templates/core/spec.md.tmpl`, `plan.md.tmpl`, `tasks.md.tmpl`, `implementation-summary.md.tmpl`, `templates/addons/acceptance-criteria.md.tmpl` | Modified | 96, 90, 7, 14 and 10 hints converted, stamped v2.3 |
| `templates/spec-kit-docs.json` | Modified | Five manifest entries moved to v2.3 |
| `runtime/lib/validation/orchestrator.ts` | Modified | Stamp and Draft lifecycle in `validatePlaceholders` |
| `runtime/cli/rules/check-placeholders.sh` | Modified | The same lifecycle in the shell rule |
| `runtime/cli/tests/placeholder-token-gate.vitest.ts` | Created | Five tests: four pinned cells plus the parity check |
| `runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap`, `level-contract-resolver.vitest.ts`, `upgrade-legacy.vitest.ts` | Modified | Snapshot regenerated, two stamp expectations moved to v2.3 |
| `references/templates/template-guide.md`, `references/validation/validation-rules.md` | Modified | Guide corrected, lifecycle section added |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`, `implementation-summary.md`, `scratch/` | Modified or created | Phase record and evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The conductor ran `tasks.md` T001 to T021 with saved tools and no worker model edited a file. The failing test was written and seen red first (T007), the code made it green (T008, T009), and three scripted breaks turned it red again (T010). The one model call was a read-only review through cli-devin `swe-2-max`. The phase ends in one local commit on the worktree branch and was not pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse the existing `[YOUR_VALUE_HERE: ...]` token | The validator already knows it, so no new grammar needs teaching |
| Gate on the v2.3 stamp and the exact Status word Draft | A stamp keeps every existing packet on its old rule, and a warning does not fail strict |
| Convert by script and keep the scaffolder's own texts | `create.sh` replaces some hints at scaffold time, and a hand edit could break that |
| Update the orchestrator and the shell rule together | `validate.sh` runs the orchestrator and a test compares the shell rule with it |
| Record the scanner defects, the era flip and the upgrade-level copy | Fixing them is outside the frozen file list |
| Defer only the bracketed token, not the legacy angle-bracket form | The review showed the orchestrator matched `<YOUR_VALUE_HERE:` too and the shell rule never did, so a Draft doc would warn in one and pass silently in the other |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Strict validation of this phase folder (T021) | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` printed `RESULT: PASSED` |
| Conversion tool on a copy (T005) | Converted 96, 90, 7, 14 and 10, then `converted 0` on a second pass, `LEFTOVERS_SAME` |
| Failing test first, then green (T007, T009) | `Tests  1 failed \| 4 passed (5)` before the change, `Tests  5 passed (5)` after, harness `8/8 passed` and `3/3 passed`, `Failed:  0` |
| Three mutations (T010) | `M1_RED`, `M2_RED`, `M3_RED`, `GREEN_AGAIN`, `RESTORED` |
| Templates converted (T011) | 217 tokens, 7 stamps, 5 manifest entries, `LEFTOVERS_SAME`, no v2.2 stamp left |
| Snapshot and template tests (T013) | `Snapshots  16 updated`, `Tests  12 passed (12)`, `5 passed (5)`, `32 passed (32)`, `74 passed (74)` |
| Scaffold smoke test (T014) | Level 1 Draft passes with a `PLACEHOLDER_FILLED` warning, Complete and a v2.2 stamp error, Level 2 counts `112 112 101 101 0`, `TRACK_GONE` |
| Census (T015) | `CENSUS_SAME gate A` and `CENSUS_SAME gate B` over 4688 folders, `4496 PASS` and `192 FAIL`, run twice (before and after the review fix). Files `scratch/census/a-before.tsv`, `a-after.tsv`, `b-before.tsv`, `b-after.tsv` |
| Suite (T017) | `SUITE_MATCH_PLUS_NEW_TEST` twice, `exit=0`: cli lane 180 to 181 files and 2061 to 2066 tests, core lane unchanged at 276 files and 4162 tests. Output in `scratch/suite-end.txt` |
| Scope (T018) | `1`: only the parent `goal.md`, changed by the conductor and excluded from this phase's commit |
| Review (T019, T020) | `scratch/review/T019.txt` holds one `P2` line, true and applied; `FINDINGS_TALLIED 1 1` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The era report flips (OP-1).** The manifest bump makes `repo-era.mjs` count v2.2 stamps as legacy: `templateMarkers` is now `{"new":1451,"legacy":17869,"none":510}`, against `{"new":16871,"legacy":2374,"none":510}` measured at planning time. Fixed after the phase commit by operator decision on 2026-10-24: `repo-era.mjs` counts only stamps older than v2.2 as legacy, and `templateMarkers` is back to `{"new":16944,"legacy":2376,"none":510}`, equal to the pre-bump script on the same documents.
2. **The post-edit scanner is blind in two ways (OP-2).** `probe-fence exit=1` (a hint inside a fenced block) and `probe-token exit=0` (a token with a colon). This phase records both and fixes neither.
3. **`upgrade-level.sh` copies tokens into older docs (OP-3).** A v2.2 doc that gains a template section then holds tokens that error. The one test that hard-coded the old plan stamp was fixed in T013.
4. **Other docs still say `[PLACEHOLDER]` (OP-4).** `README.md` and `assets/template-mapping.md` are left to phase 7.
5. **Two ledger rows are handed to phase 004.** L-A-015 and L-A-016 (missing `risk-matrix` and `user-stories` anchors in core `spec.md.tmpl`) are not fixed here because phase 004's alignment table removes those anchors from the level-3 example. The operator should confirm that hand-off.
6. **The commit decision (OP-5).** Resolved by the operator's 2026-10-24 choice of one local commit per phase on the worktree branch.
<!-- /ANCHOR:limitations -->

---
