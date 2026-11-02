---
title: "Implementation Summary"
description: "Skilled no longer ships the .skilled/release folder: /doctor:update keeps its base record, divergence log, runs and apply lock as local, ignored state under .skilled/skills/.state/doctor-update/, and reads an old committed record once."
trigger_phrases:
  - "doctor update local state implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "commands/002-doctor-audit-and-fixes/006-doctor-update-local-state"
    last_updated_at: "2026-11-02T14:48:34Z"
    last_updated_by: "generate-context"
    recent_action: "Added the state folder README and fixed two stale doc lines"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files:
      - ".skilled/skills/.state/doctor-update/README.md"
      - ".skilled/manual-testing-playbook/manual-testing-playbook.md"
      - ".skilled/repo-rules/communication-handoff.md"
    session_dedup:
      fingerprint: "sha256:2387350b30cbfbe8698f427418c1ffb06f43dc1a486d0c0eb6d4badc5b36af9b"
      session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
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
| **Spec Folder** | 006-doctor-update-local-state |
| **Completed** | 2026-11-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`.skilled/` no longer carries a `release/` folder. Everything `/doctor:update` writes now lives in `.skilled/skills/.state/doctor-update/`, which git already ignores, so an installed copy stays clean until someone runs the updater, and even then nothing shows in `git status`.

### Phase 6: doctor-update-local-state

The base record, the divergence log, the run folders and the apply lock all moved. The two records are no longer tracked files, so the updater stops refusing when one differs from HEAD and stops telling you to commit it. Each clone records its own base. A repository that committed `.skilled/release/base.json` under the old layout keeps working: the updater reads the old record when the new one is missing, writes the new path from then on, and prints one notice with the `git rm -r .skilled/release` command to drop the old copy.

An independent review after the first commit found two faults, now fixed. The update-unit filter had excluded all of `.skilled/skills/.state/`, which also holds eight tracked READMEs that releases ship, so a changed README would never have been delivered. The filter now excludes only `.skilled/skills/.state/doctor-update/`. The `apply --dry-run` preview had also printed the whole record file as a byte array; it now shows only mode and blob.

A later documentation sweep found three gaps. The state folder was the only one under `.skilled/skills/.state/` without a README, so it now has one describing each record and how to clean it up. The root playbook's fixture list now says the existing fixture commits its base record at the legacy path and a rebuilt one keeps it as ignored local state. The Codex row of `communication-handoff.md` now says this repository turns on the Default-mode question tool.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/release-update.cjs` | Modified | State paths, legacy reader, record dirty checks, unit and rollback filters, help text |
| `.skilled/commands/doctor/scripts/tests/release-update.test.cjs` | Modified | New paths; legacy-read and untracked-record tests |
| `.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs` | Modified | Presentation no longer asks to commit the records |
| `.skilled/release/.gitignore` | Deleted | The folder stops shipping |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs`, `runtime/cli/tests/upgrade-legacy.vitest.ts` | Modified | Apply-lock path |
| `.skilled/commands/doctor/assets/doctor-update-*.yaml` (7), `doctor-update-presentation.txt` | Modified | Paths and operator instructions |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-update-*.md` (6), `manual-testing-playbook.md` | Modified | Paths and steps |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modified | The doctor update write paths |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Modified | Installed-state exception accepts the new folder |
| `.skilled/skills/.state/doctor-update/README.md` | Created | Explains the state folder, like its siblings |
| `.skilled/repo-rules/communication-handoff.md` | Modified | Codex row names the repository's question-tool flag |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built in worktree `worktrees/308-doctor-update-local-state` by one `gpt-6-luna` worker (xhigh, fast) through cli-codex, from a brief that froze the scope. The main session reread the diff and reran every suite itself. The worktree's spec-kit links the main checkout's `node_modules` and builds its own `dist`; nothing was installed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| All state local and uncommitted | Operator's choice: no `.skilled/release/` in the shipped tree, at the cost of teammates not sharing one base |
| Read the legacy record, never delete it | The tool never writes git; the operator removes the tracked copy with one command |
| No changelog entry in this change | Release notes are written when a release is cut |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `release-update.test.cjs` | PASS: `tests 77`, `pass 77`, `fail 0` (baseline 73/73). The unit-enumeration and second-apply tests fail on the first commit's engine and pass after the review fixes; the two rollback tests each fail when their restore branch is disabled |
| `doctor-update-contract.test.cjs` | PASS: `pass 12`, `fail 0` |
| `upgrade-legacy.vitest.ts` | PASS: `Tests 67 passed (67)` |
| `validate-playbook-package.test.cjs` | PASS: exit 0 (run with `NODE_PATH` at spec-kit's `node_modules`, which the unprovisioned worktree lacks); exit 1 when the regex drops the new state prefix |
| Root playbook validation, main vs worktree | Same 0 errors and same 12 warnings, none about this change |
| `node --check`, `git diff --check` | PASS |
| Barter re-pin to `96b456e0a3` | PASS: `replay.cjs --check` 49/49 `miss=0`; `sync.cjs --status` in-sync=269, no drift; `skilled/.skilled/release` gone |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Teammates don't share a base.** Each clone runs `record-base` once.
2. **Both-present case is not tested separately.** The new record wins because it is read first.
3. **Consumers keep their committed `.skilled/release/` until they remove it.** The updater prints the command once.
4. **A `record-base` that runs during an `apply` can be overwritten.** `apply` reads the base record before it takes the lock, and the records are no longer checked against HEAD. The window is short and both commands are run by hand.
<!-- /ANCHOR:limitations -->

---
