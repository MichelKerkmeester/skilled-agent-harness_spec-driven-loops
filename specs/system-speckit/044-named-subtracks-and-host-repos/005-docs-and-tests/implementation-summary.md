---
title: "Implementation Summary: Docs and Tests"
description: "Corrects the 044 docs that drifted from the sub-track code and repairs two tests so each fails when the behavior it names breaks, with a negative control for every test change."
trigger_phrases:
  - "docs and tests implementation"
  - "sub-track doc corrections"
  - "archive parent derivation negative control"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/044-named-subtracks-and-host-repos/005-docs-and-tests"
    last_updated_at: "2026-11-08T01:44:32Z"
    last_updated_by: "generate-context"
    recent_action: "Remediation phases and review fixes verified"
    next_safe_action: "Commit and push main"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/subtrack-predicate-parity.vitest.ts"
    session_dedup:
      fingerprint: "sha256:3e0aae3294694ddf87fcb96f8ab3b6dc13043720831270fa702a33e5c63520d0"
      session_id: "005-docs-and-tests"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-docs-and-tests |
| **Completed** | 2026-11-08 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The 044 packet now says what the sub-track code actually does: `specFolder` is the required `description.json` path and `specId` is not required, both reader return shapes are documented, and the three stale packet lines are corrected. Two `create.sh` cases pin the missing-metadata and refresh-failure paths on a sub-track, and the archive parent-derivation case now uses a three-segment identity so the `z_` check is the one that decides.

### Doc Corrections

`folder-structure.md` no longer requires a `specId` that no producer writes. The reader README row names declared sub-tracks and the working-tree array versus commit `{ tracks, skipped, diagnostics }` shapes. The feature-catalog track-root page gains a sub-track paragraph, the two sub-track test files, and the required `2.0.2.0` version raise. The parent packet's `tasks.md` names the red runs that were kept and states that `red-E.log` was not kept; its `plan.md` test command lists `validate-subtrack.vitest.ts`; its Known Limitations now says a deeper layout is not reported.

### Test Repairs

The archive case moved from `demo/z_archive/old/001-kept` (four segments, so the depth guard returned first) to `demo/z_old/001-kept` (three segments, so the archive-name check decides). The two new `create.sh` cases cover a declared sub-track with no `graph-metadata.json` and a sub-track whose metadata is invalid JSON. Each test change is proved by a local negative control that breaks the behavior, shows the failure, and is restored.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/references/structure/folder-structure.md` | Modified | Corrects the sub-track `description.json` requirement and raises the doc version to `1.6.8.0`. |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/README.md` | Modified | Names sub-tracks and both reader return shapes in the `track-roots.mjs` row. |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/track-root-children-lists.md` | Modified | Adds sub-track behavior and tests; raises the page version to `2.0.2.0`. |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts` | Modified | Adds the missing-metadata and refresh-failure sub-track cases. |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/graph-metadata-refresh.vitest.ts` | Modified | Rewrites the archive case so the `z_` check is the one that decides. |
| `specs/system-speckit/044-named-subtracks-and-host-repos/tasks.md` | Modified | Corrects the red-log evidence citation at line 38. |
| `specs/system-speckit/044-named-subtracks-and-host-repos/plan.md` | Modified | Adds `tests/validate-subtrack.vitest.ts` to the test command. |
| `specs/system-speckit/044-named-subtracks-and-host-repos/implementation-summary.md` | Modified | Corrects the Known Limitations item at line 129. |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `scratch/` | Modified/Created | Records the operator decisions, completion status, task evidence, baseline and red/green logs. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The tests were repaired first. Each one was run green on the unchanged code, then run again with the one behavior it names broken locally, and its failing output was saved under `scratch/`; the source line was restored and the file rerun green. The doc corrections came after, each with a before-and-after search printed. Final verification reran the runtime build, the required CLI suite, the doctor node tests, and strict validation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Correct the Known Limitations instead of adding a deeper-layout diagnostic | Discovery never looks inside a sub-track, and a diagnostic for that layout is new behavior the parent put out of scope. |
| Correct the `specId` doc instead of generating the field | No producer writes `specId` for a sub-track and no reader derives identity from it; the field would be new dead metadata. |
| Document both reader return shapes instead of unifying them | Only `sweep-track-roots.mjs` consumes both, and the split predates the sub-track range, so the code change buys little. |
| Prove each characterization test with a negative control | A test that passes both before and after the fix proves nothing; breaking the named behavior locally shows it can fail for that reason. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Runtime build | PASS, `npm run build`, exit 0 (`scratch/build.log`). |
| Required CLI suite, 10 files | PASS, `Test Files 10 passed (10)`, `Tests 191 passed (191)`, exit 0 (`scratch/final-cli-suite-10-files.log`). |
| Same suite plus `subtrack-predicate-parity.vitest.ts` | PASS, `Test Files 11 passed (11)`, `Tests 196 passed (196)`, exit 0; baseline was 194, so the two new cases account for the increase (`scratch/final-cli-suite-11-files.log`). |
| `create-track-refresh.vitest.ts` | PASS, 22 passed, 0 failed; baseline 20 plus the two new cases. |
| `graph-metadata-refresh.vitest.ts` | PASS, 7 passed, 0 failed. |
| Negative control, archive case | PASS: with `name.startsWith('z_')` removed the unchanged four-segment case still passed (`scratch/red-T004-unchanged-case-passes-with-z-check-removed.log`), and the rewritten case failed with `expected 'demo/z_old' to be null` (`scratch/red-T005-z-check-removed.log`); restored line reran 7/7. |
| Negative control, missing sub-track metadata | PASS: with the `graph-metadata.json` existence guard removed the case failed because the refresh seeded the file (`scratch/red-T006-metadata-guard-removed.log`); restored line reran 22/22. |
| Negative control, refresh failure | PASS: with the warning made unreachable the case failed on the missing `demo/sub/graph-metadata.json was not refreshed` line (`scratch/red-T007-warning-unreachable.log`); restored line reran 22/22. |
| Doctor symlink tests | PASS, `tests 51`, `pass 51`, `fail 0`, exit 0 (`scratch/final-doctor-tests.log`). |
| Doc check, `folder-structure.md` | Before: line 115 required `specFolder` and `specId`. After: `specId` is not required and producers write only `specFolder`. |
| Doc check, reader README | `grep -c 'sub-track'` printed 0 before and 1 after; the row names both return shapes. |
| Doc check, feature catalog | `grep -c 'sub-track'` printed 0 before and 5 after; version is `2.0.2.0`. |
| Doc check, parent packet | `red-E` appears only in the sentence saying it was not kept; `validate-subtrack.vitest.ts` count went 0 to 1; line 129 now says a deeper layout is not reported. |
| Negative-control restore check | PASS: `z_` guard at `graph-metadata-parser.ts:856`, metadata guard at `create.sh:1013` and the warning line at `create.sh:1020` are all present; `bash -n create.sh` exit 0. |
| Code quality gate | PASS, `NO_BLOCKER_FOUND`, `p0_blocking=0`, `unverified` none, exit 0 (`scratch/quality-gate.log`). |
| Strict phase validation | PASS, `RESULT: PASSED`, exit 0 (`scratch/strict-validation.log`). |
| Strict recursive 044 validation | PARTIAL: phases 001 to 005 print `RESULT: PASSED`; the parent folder fails only `GREP_CONVENTION` on the pre-existing untracked `morning-handoff.md`, which has no frontmatter and is outside this phase's scope (`scratch/recursive-validation.log`). |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The historical red-A to red-G logs are not in this worktree.** They were never committed, so `ls specs/system-speckit/044-named-subtracks-and-host-repos/scratch | rg '^red-'` prints nothing here; the primary checkout still holds A-D and F-G. Regenerating them was out of scope because a log written now would not be the run that existed then, so the corrected citation names those six runs and states that E was not kept.
2. **The two reader views still return different shapes.** The README now documents both; unifying them was the optional P3 path and was not taken.
3. **A deeper layout stays silent by design.** A sub-track holds numbered packets, not another sub-track; nothing reports a folder below that level.
4. **The recursive parent validation keeps one pre-existing error.** `morning-handoff.md` at the packet root is untracked, carries no frontmatter, and fails `GREP_CONVENTION`; it predates this phase and is outside its file scope. Every phase folder, including this one, validates as `RESULT: PASSED`.
<!-- /ANCHOR:limitations -->
