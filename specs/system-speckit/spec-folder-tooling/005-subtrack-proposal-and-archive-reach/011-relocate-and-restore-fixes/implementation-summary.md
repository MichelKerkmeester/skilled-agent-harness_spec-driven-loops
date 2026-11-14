---
title: "Implementation Summary"
description: "relocate.mjs finishes a stopped re-parent, keeps exit 3 for a real RESULT: FAILED and leaves another folder's bare names alone; archive.sh decides the mixed-track restore refusal in the shell."
trigger_phrases:
  - "relocate and restore fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/011-relocate-and-restore-fixes"
    last_updated_at: "2026-11-14T13:14:36Z"
    last_updated_by: "generate-context"
    recent_action: "Committed phase 011 as f6825d19b2"
    next_safe_action: "Build phase 012-catalog-and-playbook-alignment"
    packet_purpose: "Purpose: A rerun of a stopped re-parent leaves both parents' phase rows correct, and each smaller defect is fixed with a test that failed before the fix."
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/relocate.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts"
    session_dedup:
      fingerprint: "sha256:765c2abf8729022da8b44a4f4d90d907eefced9c555002535f5cfcf0bbebc3d7"
      session_id: "scaffold-011-relocate-and-restore-fixes"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "71bf64cd-38aa-49d3-90c7-925ac95b4fa9"
      workspace: "/Users/michelkerkmeester/worktrees/public/378-relocate-restore-fixes"
      savedAt: "2026-11-14T13:14:36Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-relocate-and-restore-fixes |
| **Completed** | 2026-11-14, branch `worktrees/378-relocate-restore-fixes` |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Five fixes from the two reviews of the finished packet, each with a case that failed before it.

### Phase 11: relocate-and-restore-fixes

- **Re-parent resume.** `phaseRowEdits` now plans the rows of a done re-parent while either parent's rows are stale, reads the moved child where it landed, and writes the new parent before the old one. A stopped re-parent finishes on the rerun, and a clean one still ends on `relocate: nothing to do`.
- **Exit 3 only on a real verdict.** `closeRun` sets 3 only when the moved packet's validation printed `RESULT: FAILED`. A failed validation with no `RESULT` line sets 2, and 2 outranks 3. The sweep mark is written after validation, and only when every validation printed a `RESULT` line or exited 0, so a validator that never ran is asked again on the rerun.
- **Bare-name boundary.** `bareNamePattern` takes the phase parent's name. A bare name behind `<name>/` is rewritten only when `<name>` is `.`, `..` or that parent, so `other-track/003-gamma` is left as written.
- **Mixed-track restore refusal in the shell.** `refuse_mixed_track_restore` refuses when the destination track holds a declared sub-track and no longer runs a `relocate.mjs` dry run. `is_declared_subtrack` applies the same container-name rule as `CONTAINER_NAME` in relocate.mjs.
- **Help.** `archive.sh --help` names the mixed-track refusal and the restored-with-warning outcome of a failed own validation.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs` | Modified | Re-parent resume, close status and sweep mark, bare-name boundary |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | Modified | Shell mixed-track check, name rule, help lines |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/relocate.vitest.ts` | Modified | Re-parent, close status and bare-name cases |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts` | Modified | No-`RESULT` restore, no-dry-run restore and help cases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Five `dsh` briefs to DeepSeek V4.1 Flash at max reasoning on the pinned dsh 0.2.2-rc.1: REQ-001, REQ-002, REQ-003, REQ-004 with REQ-005 together, and one follow-up for the validator that exits 0 without a `RESULT` line. Each brief added the failing case first. The orchestrator read each diff and reran the three suites after each brief. Evidence: `scratch/worker-011a.md`, `scratch/worker-011b.md`, `scratch/worker-011d.md`, `scratch/worker-011e.md`, `scratch/reproduce-f1.txt`, `scratch/after-f1.txt`, `scratch/baseline.txt`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A validation that exits 0 with no `RESULT` line counts as reported | Otherwise the sweep mark is never written and the map stays open forever, against decision D3 |
| A done re-parent with no old map row gets the scaffold placeholder row | No focus or status is left to copy, and the new parent's map must still list the phase |
| The mixed-track restore check no longer needs `relocate.mjs` | The refusal is decided from the declaration alone, so a missing engine now still refuses a mixed-track restore |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Three suites, baseline before the phase | 105 passed, exit 0 |
| Three suites, final | 3 files, 115 passed, exit 0 |
| F1 reproduction cases on the final script | 2 passed, exit 0; each asserts `relocate: nothing to do` on the next run (`scratch/after-f1.txt`) |
| Full CLI `npm test` | PASS on the third run: 212 files, 2613 passed, 0 failed, exit 0; baseline 2603 plus the 10 new cases. Run 1 failed only the suite guard, because the orchestrator wrote packet files while it ran. Run 2 failed one restore case on a fixture race, see Known Limitations |
| `verify_alignment_drift.py --root runtime/cli/spec` | `[alignment-drift] PASS`, exit 0 |
| Added comment lines | No spec path, packet number or finding id |
| `archive.sh --help \| rg -c 'flat packets\|own validation'` | 2 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A validator exiting 0 with no verdict.** It closes the map. A validator that reports success by exit status alone is trusted.
2. **Fixture copy race.** `copyToolTree` in `tests/fixtures/subtrack-tree.mjs` copies the runtime tree while another test file can create and remove `runtime/.workflow-lock`, the lock `core/workflow.ts` takes. One full run failed the real-pipeline restore case with `ENOENT ... .workflow-lock`; the next passed. The copy helpers in `upgrade-legacy-host-root.vitest.ts` and `helpers/upgrade-legacy-harness.ts` already skip that file; this filter does not. The fixture predates this phase and was not changed in it. A follow-up of 2026-11-14, after the race failed one more full run, adds `.workflow-lock` to the same filter, so this limit is closed.
3. **Bare names behind a full path.** A name behind another track's folder of the same name as the phase parent is still rewritten. The pattern sees one segment, not the whole path.
<!-- /ANCHOR:limitations -->

---
