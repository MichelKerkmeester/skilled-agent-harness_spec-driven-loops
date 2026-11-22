---
title: "Implementation Summary"
description: "A mode packet with no benchmark folder of its own can now save its playbook runs where its playbook says. Passing --reports with the owning hub's reports folder lands the run there, and the recorder refuses any folder other than the playbook's own skill or its direct parent hub, a folder holding `mode-registry.json`."
trigger_phrases:
  - "hub reports destination implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/007-playbook-run-recording/003-hub-reports-destination"
    last_updated_at: "2026-11-22T11:50:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the hub destination and its verification"
    next_safe_action: "Commit the phase on the operator's instruction"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-hub-reports-destination"
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
| **Spec Folder** | 003-hub-reports-destination |
| **Status** | Complete |
| **Completed** | 2026-11-22 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A mode packet with no benchmark folder of its own can now save its playbook runs where its playbook says. Pass `--reports` with the owning hub's reports folder, and the run lands there, with the hub named in the reports index and in the run's `source.md`. The recorder refuses any folder other than the playbook's own skill or its direct parent hub, a folder holding `mode-registry.json`.

### Phase 3: hub-reports-destination

Before this phase the recorder wrote only into the playbook's own skill. Three packets have no benchmark folder: `sk-code-ci` and `sk-code-frontend`, which sit in the `sk-code` hub, and `cli-mistral-vibe`, which sits in `cli-external-orchestration`. Their playbooks named a reports folder that the recorder could not reach. Now the save command carries `--reports`, and the runner prints it too. The 25 cli-mistral-vibe verdicts that sat as blocks inside scenario files are now two report folders: 22 PASS dated 2026-11-14 and 3 PASS dated 2026-11-15. The root playbook names the command with the flag.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/record-playbook-run.cjs` | Modified | `--reports DIR` and the exported `resolveReports` refusal rules |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | Modified | Forwards `--reports` into the printed `save results:` command |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/record-playbook-run.test.cjs` | Modified | `runHubReports`, 8 assertions, then 14 in the review follow-up |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs` | Modified | Passes `--reports` and asserts the printed command carries it |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` | Modified | `--reports` paragraph under "Recording A Run"; version 1.3.0.0 |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md` | Modified | One sentence on `--reports`; version 1.0.3.0 |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/changelog/v1.3.0.0.md` | Created | Changelog entry that names this phase's spec folder |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/changelog/v1.3.1.0.md` | Created | Review follow-up: the tighter `--reports` check |
| `.skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/manual-testing-playbook.md` | Modified | Result block names `--reports`; version 1.1.4.0 |
| `.skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/manual-testing-playbook.md` | Modified | Result block names `--reports`; version 1.0.4.0 |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/manual-testing-playbook.md` | Modified | Root block names `--reports`; version 1.0.12.0 |
| 25 cli-mistral-vibe scenario files under `manual-testing-playbook/` | Modified | Per-scenario `Recorded Result` block removed; `fanout/adapter-stress-cells.md` gains a `Skip blocker:` line |
| `.skilled/skills/cli-external-orchestration/benchmark/reports/2026-11-14--manual-testing-playbook--recorded-results/` | Created | Recorder-written run folder, 22 PASS |
| `.skilled/skills/cli-external-orchestration/benchmark/reports/2026-11-15--manual-testing-playbook--recorded-results/` | Created | Recorder-written run folder, 3 PASS |
| `.skilled/skills/cli-external-orchestration/benchmark/reports/README.md` | Created | Reports index the recorder wrote for those two runs |
### Review follow-up

An independent review after commit `413d3268b8a` found that the first `--reports` check only asked whether the folder above `benchmark/reports` contained the playbook. Any folder above the playbook passed: a dry run accepted the repository root, the disk root and a folder inside the playbook. `resolveReports` now accepts only the playbook's own skill or its direct parent hub, a folder holding `mode-registry.json`, and the parent counts as a hub only when it holds `mode-registry.json`, so `.skilled/skills/` is never an owner. Paths are compared after resolving symlinks. Run against each earlier version of the check, the new test fails on its first new assertion: "a folder above the hub is refused", then "a parent folder without mode-registry.json is not a hub and is refused". The same review found that `sk-code-ci` and `sk-code-frontend` still carried the old paragraph saying a run is written by hand and leaves the index alone, which contradicted the recorder command above it. That paragraph is removed, and the two roots are now 1.1.5.0 and 1.0.5.0. SKILL.md is 1.3.1.0 with changelog `v1.3.1.0.md`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The recorder and runner changes, their tests, the three roots and the moved blocks were built before this packet was scaffolded. This phase then re-ran the checks below in one session, reading each output and exit status. The dry run wrote nothing, so the sk-code benchmark folder stayed as it was. The recorder tests create their working folders under the operating system's temporary folder.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `--reports` is opt-in, and the default destination does not change | A packet with its own benchmark folder keeps working with no edit, and only the three packets without one need the flag. |
| The recorder refuses before any write | A destination outside its hub would scatter run folders across the disk. A refusal that writes nothing is simple to check. |
| The 25 blocks are moved as recorded, not run again | The verdicts already exist, and re-running would create live records for runs nobody asked for in this phase. |
| A `Skip blocker:` line replaces the sentence removed with the block | The validator needs the sentence that names the live-probe SKIP blocker. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node scripts/tests/record-playbook-run.test.cjs` | Exit 0. Five suites print PASS: happy path 8, refusals 8, hub reports 8, runner hand-off 9, edge cases 11 assertions. After the review follow-up, hub reports prints 14 |
| `node --test scripts/tests/run-conversation-scenario.test.cjs` | Exit 0, `fail 0` |
| `node scripts/tests/validate-playbook-package.test.cjs` | Exit 0. Prompt sync 8, piped report 2, conversation script 114 assertions PASS |
| `validate-playbook-package.cjs --package` on sk-code-ci, sk-code-frontend and cli-mistral-vibe | Exit 0 each, `violations=0`, `warnings=0`; 8, 11 and 55 scenarios |
| Recorder dry run into the sk-code hub with `ci-surface-ci-standards` | Exit 0, prints the planned folder; no file written under `sk-code/benchmark` |
| `Recorded Result` blocks left in the cli-mistral-vibe playbook | 0 |
| The two report folders | 22 records and 3 records, all PASS, 25 distinct scenario ids |
| Pattern scan for secret-like strings in the added lines and the new folders | No match |
| `validate.sh --strict` for this child, the parent, 001 and 002, and `--recursive --strict` on the parent | `RESULT: PASSED`, 0 errors and 0 warnings for each of the four folders. Run under the nvm node v26.13.0, because the Homebrew node 26.13.0_2 cannot load `libsimdjson.36` or `libsimdutf.37`: both are absent, and 37 and 38 are installed. No system file was changed. |
| `check-goal.cjs` for this child and the parent | `RESULT: PASSED (5/5 checks)` for both. `goal.cjs packet` on the parent reports `packet_budget=ok` at 2,655 durable characters |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The flag is opt-in.** A mode packet that omits `--reports` still writes into its own skill, so a playbook that does not name the flag keeps the old behavior.
2. **The 25 verdicts are the blocks as they were recorded.** No scenario ran again, so these reports show the state of those earlier runs, not a fresh run.
3. **The parent's Out of Scope bullet was amended.** It excluded rewriting existing run reports. The operator amended it on 2026-11-22 so that moving verdicts out of scenario files into recorder runs is in scope.
<!-- /ANCHOR:limitations -->

---
