---
title: "Goal: Phase 2: template-and-example-defect-repair"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "template and example defect repair goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/002-template-and-example-defect-repair"
    last_updated_at: "2026-10-23T11:27:20Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: template-and-example-defect-repair

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Apply every ledger row that phase 1 assigned to this phase, so that no example doc, authoring checklist or style guide in system-spec-kit teaches a weak model a broken line. The spec-kit suite result stays the same.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every exact text swap is made by `apply_row.py` and never by a model. It runs only when the old text occurs exactly once in its file. |
| D2 | Only the files named by the 25 known rows in `tasks.md` T004, by owner `002` ledger rows and `templates/.hashes` change. No file under `templates/core`, `templates/addons` or `templates/packet-types` changes. |
| D3 | `templates/.hashes` is deleted only when both reader searches in `tasks.md` T008 exit with code 1. |
| D4 | Rows owned by the write recipe (`041-006`) and by phases 3 to 6 are not touched here. |
| D5 | One Task subagent fixes only a row the applier could not apply as a swap, one row and one file per brief, with at most 3 Task calls in one message and never two that write the same file. |
| D6 | The phase closes on a matching suite comparison and one read-only frontier review through `cli-codex` with `gpt-6-luna`. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -c '^APPLIED K-' scratch/applied.txt` prints `25` and `grep -c '^KCHECK K-.* locator=0 expected=1$' scratch/applied.txt` prints `25`
- [ ] `grep -c '^YES ' scratch/recheck.txt` prints `0`, so no owner `002` ledger row still reproduces. `grep -c '^K-LEFT .* [1-9][0-9]*$' scratch/recheck.txt` prints `0` too
- [ ] The leaked-text search in `tasks.md` T007 prints nothing, and its exact-line check prints `18 1`
- [ ] `test ! -e .skilled/skills/system-spec-kit/templates/.hashes` succeeds, and `rg -l --hidden '\.hashes' .skilled --glob '!**/node_modules/**' --glob '!.git'` exits with code 1
- [ ] `tasks.md` T014 prints `SUITE_MATCH`, and `tasks.md` T013 prints `0` changed paths that no row names
- [ ] `scratch/review/T015.txt` holds only lines that start with `P0`, `P1` or `P2`, or the single line `NO FINDINGS`. Each P0 and P1 line is fixed
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/054-weak-model-spec-authoring/002-template-and-example-defect-repair --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase 1 closed with a reviewed ledger (T001) | Pending | |
| Tools checked (T002) | Pending | |
| Phase start commit | Pending | |
| Known rows saved (T004) | Pending | |
| Applier saved and tested (T005) | Pending | |
| 25 known rows applied (T006) | Pending | |
| Example descriptions checked (T007) | Pending | |
| `.hashes` reader guards and delete (T008) | Pending | |
| Census rows applied (T009 to T011) | Pending | |
| Every row rechecked, scope checked (T012, T013) | Pending | |
| Suite compared with the phase 1 start (T014) | Pending | |
| Frontier review and findings (T015, T016) | Pending | |
| Phase closed and committed (T017) | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
