---
title: "Implementation Summary"
description: "A playbook run now saves its verdicts into the owning skill's benchmark folder through one checked command, and the validator fails a root playbook that drops the results rule."
trigger_phrases:
  - "run recorder and validator implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/007-playbook-run-recording/001-run-recorder-and-validator"
    last_updated_at: "2026-11-22T11:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the build and its verification"
    next_safe_action: "Commit the phase on the operator's instruction"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "da5c810b-9095-42b1-8923-c83799a0919f"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-run-recorder-and-validator |
| **Completed** | 2026-11-22 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A finished playbook run now has one way into the benchmark folder. You write the verdicts to a CSV, or point at the conversation runner's output, and `record-playbook-run.cjs` checks every row against the playbook before it writes the dated run folder and the index row. A playbook root that leaves out the results rule now fails validation instead of warning.

### Phase 1: run-recorder-and-validator

The recorder reuses the validator's markdown walk and id extraction, so a scenario id it accepts is one the validator sees. The conversation runner may not write into the repository, so it leaves `scenario.json` in its `--out` folder and prints the exact recorder command. Coverage is a report you ask for with `--coverage`, because most playbooks are partly run. MTP-005, the mode's own scenario for saving results, described a retired wrapper and now tests the recorder.

A fresh review and a doc alignment pass then found one real bug: a reused runner `--out` folder could save another scenario's verdicts. `scenario.json` now lists the runtimes the run played. The same pass made the write atomic, refused malformed input instead of crashing, made coverage parse multi-line CSV fields and aligned 25 playbook roots that still described a renderer or a hand-written record. That shipped as v1.2.1.0.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/record-playbook-run.cjs` | Created | The one writer for run folders |
| `scripts/tests/record-playbook-run.test.cjs` | Created | Happy path, refusals and runner hand-off |
| `scripts/validate-playbook-package.cjs` and its test | Modified | Marker error and `--coverage` |
| `scripts/run-conversation-scenario.cjs` and its test | Modified | `scenario.json` and the printed recorder command |
| `scripts/tests/fixtures/*/manual-testing-playbook.md` | Modified | The fixtures carry the marker |
| `SKILL.md`, `README.md`, `references/conversation-scenarios.md`, `assets/*template.md` | Modified | One results contract |
| `manual-testing-playbook/` root and MTP-005 | Modified | The scenario tests the recorder |
| `changelog/v1.2.0.0.md` | Created | The release entry, mode at 1.2.0.0 |
| `.skilled/changelog/skilled/v4.2.0.0.md` | Modified | Name the mode among the components with entries in the open release |
| `sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Modified | Regenerated, 859 directories |
| `sk-doc` activation manifest pair | Modified | Re-minted after the mode's docs changed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fleet, the two existing test files and the README audit were baselined first. The recorder and its tests came next, then the runner hand-off and the validator change, then the docs. Every gate ran again from the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One new script, not a validator mode | Validation reads and reports. Writing a run folder is a different side effect, and the runner needs a writer it can name |
| Write three files, not the harness's seven | A manual run captures no scores or per-attempt failures, and the contract says an uncaptured field reads as not recorded |
| Coverage never fails | Most playbooks are partly run, and the request was for saved output, not complete runs |
| The runner writes `scenario.json` instead of a scenario id in `result.json` | One write at the end of the run, and no change to the shape the existing tests read |
| Print the README audit refresh, not run it | That test belongs to `sk-create-readme`, and a new run folder is a durable directory by its rules |
| Two phases although the level helper did not call for them | The operator chose the split on 2026-11-22 |
| Write paths outside the repository as a fixed note | Runner output always sits outside the repository and is deleted, so an absolute path in a committed report would be dead and would name one machine |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node tests/record-playbook-run.test.cjs` | PASS, four PASS lines, 36 assertions after the review fixes |
| The new recorder assertions against the v1.2.0.0 recorder | FAIL on `only the played runtime is saved` and the second-variant label, as intended |
| Deep-loop `check-documentation-drift.cjs --facts` | 2 errors from the backfill on main, 0 after the rewording |
| `validate_document.py` on a recorded `README.md`, `source.md` and new index | 0 issues each |
| `package_skill.py --check --strict` on the 12 touched skills and modes | PASS, exit 0 each |
| `cite-drift-gate.mjs --base` the merge base | exit 0, no new broken citation |
| `node tests/validate-playbook-package.test.cjs` | PASS, including `result contract regressions: PASS (6 assertions)` |
| `node --test tests/run-conversation-scenario.test.cjs` | PASS, `pass 1, fail 0` |
| Fleet validator before phase 2 | exit 1, 11 `RESULT_PERSISTENCE_MARKER_MISSING` violations, as intended |
| `run-script-tests.sh` (sk-doc suite) | PASS, exit 0, 58 PASS lines |
| `test_readme_manifest.py` | PASS after the refresh, `manifest=reproducible` |
| `validate_document.py` on the edited docs | 0 issues each |
| `check_changelog_shape.py` on v1.2.0.0 | PASS |
| sk-doc parent-skill check, intent signals, route guard | `OK`, `RESULT: PASSED`, exit 0 after one re-mint |
| Recorder `--dry-run` on the real mode playbook | exit 0 for MTP-005, exit 1 naming MTP-099, nothing written |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live run folder was written.** MTP-005 records MTP-004, whose authoring steps were not run here, so a real record would claim a PASS nobody observed. The tests and the dry run cover the write path.
2. **Hand-written reports stay as they are.** Coverage lists them as runs without `results.csv`, for example the five browser hub reports from 2026-11-22.
3. **Each new run folder needs the README audit refresh in the same commit.** The recorder prints the command, but nothing runs it for you.
4. **The repository-level playbook records into `.skilled/benchmark/reports/`.** Its parent folder is `.skilled`, so a dry run plans that folder and titles a new index ".skilled Benchmark Reports". No run has been recorded there yet.
5. **Three playbooks keep their own results rules.** `cli-mistral-vibe` records in each scenario's `Recorded Result` block, and `sk-code-ci` and `sk-code-frontend` send runs to the hub's report tree. The recorder writes beside the playbook it is given, so those three wait for an operator decision.
6. **MTP-005 writes a real dated folder.** A second run on the same day is refused, and its triage says to pick a new label.
<!-- /ANCHOR:limitations -->
