---
title: "Implementation Summary"
description: "An optional git hook gate can now stay off for good through git config, and a repository can change its commit, PR and branch rules in its own .sk-git/ copies, both through the new /doctor:git command."
trigger_phrases:
  - "doctor git summary"
  - "git hook gate settings shipped"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/009-doctor-git"
    last_updated_at: "2026-10-04T09:30:00Z"
    last_updated_by: "doctor-git"
    recent_action: "Added /doctor:git with saved hook gate settings and .sk-git/ rule editing"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".skilled/scripts/git-hooks/lib/gate-config.sh"
      - ".skilled/commands/doctor/scripts/git-standards.cjs"
      - ".skilled/commands/doctor/git.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-git"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-doctor-git |
| **Completed** | 2026-10-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An operator can now keep any optional hook gate off without prefixing every commit, and a repository can change its commit, PR and branch rules without editing sk-git or risking a broken rulebook. Both go through `/doctor:git`.

### Saved hook gate settings

- **One registry.** `lib/gates.tsv` lists the 12 switchable gates: hook, config key, bypass variable, whether it may be saved, and what it does.
- **One reader.** `lib/gate-config.sh` runs in `pre-commit`, `prepare-commit-msg` and `pre-push`. When local or global git config holds `off`, `false`, `no` or `0` for a gate's key, it sets that gate's existing `SPECKIT_SKIP_*` variable for the run and prints one line naming the setting. No gate's own code changed.
- **What cannot be saved.** A `git -c` or `GIT_CONFIG_*` value never counts. The per-push approvals stay one-command variables. Only a trusted toolchain repository reads any setting, so other repositories see no new output.

### `/doctor:git <hooks|standards>`

- **`hooks`** lists every gate with its local, global and effective value and the hook install state, then switches one gate on or off in local or global config after showing the exact `git config` command. The whole-hook kill switches are shown and handed to `/doctor:env`.
- **`standards`** shows which rules are enforced and where they come from. It copies the shipped sk-git templates into `.sk-git/` once, never overwriting. After that it changes a rules-block setting, removes one, or removes a kind's whole rules section. Each change is rechecked with sk-git's own shape check and refused if the gates would reject it. It reports the rules switched on or off and any template prose still stating the old rule, and offers to fix that prose.
- **Every change** waits for an approval, and `--dry-run` shows the plans and writes nothing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/scripts/git-hooks/lib/{gate-config.sh,gates.tsv}` | Created | The reader and the registry |
| `.skilled/scripts/git-hooks/{pre-commit,prepare-commit-msg,pre-push}` | Modified | Read saved gate settings |
| `.skilled/scripts/git-hooks/tests/gate-config.test.sh` | Created | 25 cases, the installed-hook case included |
| `.skilled/commands/doctor/git.md`, `assets/doctor-git-{presentation.txt,hooks.yaml,standards.yaml}` | Created | Router, presentation, two workflows |
| `.skilled/commands/doctor/scripts/{git-hook-gates,git-standards}.cjs` and their tests | Created | The scripts the workflows call, 16 cases |
| `.skilled/commands/doctor/_routes.yaml` | Modified | Two `/doctor:git` routes |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modified | Doctor entry for the new router |
| `/doctor:env` workflow and presentation, `ENV-REFERENCE.md`, hook and doctor READMEs, the commands index, the root README | Modified | Describe and point to the new command |
| Runtime mirrors under `.claude`, `.cursor`, `.codex`, `.pi`, `.hermes` | Generated | Through their own sync scripts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The operator chose the shape before work began: one `/doctor:git` command with `hooks` and `standards` targets, git config keys for persistence, and the `.sk-git/` folder for rule overrides so sk-git stays untouched. The parent session built and tested it in one pass. The installed-hook test was proven to fail on a scratch copy with the wiring removed. The runtime copies were regenerated through their sync scripts, never edited by hand.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Map a saved off to the existing `SPECKIT_SKIP_*` variable | Every gate already honours its variable, so no gate's logic changes and the one-run prefix keeps working |
| One registry read by both the hooks and the doctor script | A new gate needs one row, and the parity test fails if a hook reads a variable without one |
| Ignore command-scope config, the same rule as `skgit.contractDir` | One invocation must not switch a gate off for itself |
| Read settings only in a trusted toolchain repository | The hooks run machine-wide, and other repositories run none of these gates |
| Reuse sk-git's contract module for parsing, validation and drift | The doctor and the gates cannot disagree about what a valid rulebook is |
| Keep the shipped block layout when writing | A one-value change stays a one-line diff; an unusual layout falls back to plain JSON and says so |
| Leave `commit-msg` without an off switch | Its rules change through `standards`, and removing a kind's section turns that kind off |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `gate-config.test.sh` | 25 passed, 0 failed; 24 passed, 1 failed with the helper call removed from a scratch copy |
| Other hook suites | All exit 0: commit-msg 39, pre-commit 69, pre-push 46, prepare-commit-msg 66, pre-push message contract 15, source-root selection 58, mass deletion 12, autostash guard 9 |
| Doctor `run-all.sh` | 7 suites passed, node:test 219 of 219 (203 before plus the 16 new cases), exit 0 |
| `route-validate.sh` | `OK: route-validate — 11 routes validated, 2 warnings`, exit 0 |
| Contract | Valid against its schema; router generator `routers=35 clean=35 path-drift=0` |
| Mirrors and catalog | 181 runtime mirrors and 37 prompts each for Codex, Pi and Hermes in sync; catalog `STATUS=OK`; compiled route guard exit 0 |
| Docs | `validate_document.py --type command` on `git.md`: 0 issues; `check-markdown-links.cjs`: 0 broken across 7,870 files |
| Comment hygiene | Exit 0 on every new and changed code file |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The installed hooks on this machine link to the primary checkout.** Saved settings take effect there only after this branch is merged and that checkout is updated. `install-git-hooks.sh --status` shows each hook as shadowed until then.
2. **The workflows themselves have no automated run.** Their scripts are fully tested, and the route validator checks that each workflow invokes every script its route names. The interactive flow, approvals and prose follow-up have not been exercised end to end.
3. **The Hermes skill copy of `cli-jev` still drifts.** `sync-skills-hermes.cjs --check` reports it. The drift predates this phase and touches no file it changed.
4. **sk-git's own docs do not mention `/doctor:git`.** They describe `.sk-git/` and `skgit.contractDir`, but the operator chose to leave sk-git untouched, so no pointer was added.
<!-- /ANCHOR:limitations -->

---
