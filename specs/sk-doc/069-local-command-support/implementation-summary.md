---
title: "Implementation Summary"
description: "A git-ignored local-* command now reaches every runtime through the existing generators and cannot be committed by accident, on the same precedent as local-* skills: seven ignore rules, one catalog-check skip and one extra pre-commit pattern, each pinned by tests that fail against the old file."
trigger_phrases:
  - "local command support implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/069-local-command-support"
    last_updated_at: "2026-10-26T22:10:00Z"
    last_updated_by: "leaf-worker"
    recent_action: "Landed local-* command support in five tracked files and verified it"
    next_safe_action: "None: packet complete, ready to commit on operator approval"
    blockers: []
    key_files:
      - ".gitignore"
      - ".skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs"
      - ".skilled/scripts/git-hooks/pre-commit"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-doc-069-local-command-support"
      parent_session_id: null
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 069-local-command-support |
| **Completed** | 2026-10-26 on `worktrees/217-weak-model-spec-authoring`, not committed |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves 3 archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

You can now keep a slash command that is yours alone. Name it `.skilled/commands/local-<name>.md`, run the usual generators, and it reaches Claude, Cursor, Codex, Pi, Hermes and OpenCode, with every copy git-ignored and every mirror check still green.

### Local commands, on the local-* skill precedent

This follows the private-skill work in `specs/sk-code/013-private-surface-skills`, which made `local-*` skills ignorable, invisible to tracked catalogs and refused at commit. Commands get the same three layers. The generators needed no change, because they already walk `.skilled/commands`, skip `assets/` and keep only real files; the new ignore rules cover what they write. A forced add of the command, its assets folder or any mirror stops at the pre-commit guard, which names the path and the `git rm --cached -r` repair.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.gitignore` | Modified | Seven rules: `/.skilled/commands/local-*`, `/.skilled/commands/assets/local-*`, and the `.claude/commands`, `.cursor/commands`, `.codex/prompts`, `.pi/prompts` and `.hermes/prompts` roots |
| `.skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` | Modified | Skips a `local-*` root command or namespace |
| `.skilled/commands/doctor/scripts/tests/command-catalog-mirror-check.test.cjs` | Modified | The skip case and a `localize.md` boundary case |
| `.skilled/scripts/git-hooks/pre-commit` | Modified | `PRIVATE_COMMAND_RE` beside the skill pattern; the message now says "skill or command" |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Modified | Case 82 for every command root, case 83 for a `local-` file inside a family |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Baselines came first: catalog tests `pass 11`, hook harness `134 passed, 0 failed`, every mirror check exit 0. Each new case then ran against the `HEAD` file as a negative control and failed there. With a real local command present in this checkout, the four generators each wrote one mirror, and all twelve mirror checks and the catalog check exited 0. `git check-ignore` matched every `local-probe` path and none of the boundary paths.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Generic `local-*` rules, never a command name | No private id may reach a tracked file, so the support has to work for any local command |
| The guard keeps the `gate:private-skill` label | Existing harness cases and any reader of the hook output match that label |
| No rule for `.opencode/commands` | It is a symlink to `.skilled/commands`, and git cannot stage a path beyond a symlink |
| No generator change | The generators already keep only real files and skip `assets/`, so a real router file reaches every runtime as it is |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `node --test .skilled/commands/doctor/scripts/tests/command-catalog-mirror-check.test.cjs` | PASS: `pass 13`, `fail 0`; against the `HEAD` checker `fail 1` |
| `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` | PASS: `pre-commit gates: 145 passed, 0 failed`; against the `HEAD` hook `136 passed, 9 failed` |
| `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` with a local command present | PASS: exit 0, `STATUS=OK command-catalog-mirror` |
| Twelve mirror checks with a local command present | PASS: all exit 0; `196 mirrors across 8 trees`, `39 prompts` each for Codex, Pi and Hermes |
| `git check-ignore -v --no-index` on eight `local-probe` paths | PASS: exit 0, rules `.gitignore:250` to `:256` |
| `git check-ignore --no-index` on three non-local boundary paths | PASS: exit 1, none ignored |
| `validate.sh --strict` on this folder | PASS: `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **A local command does not follow a new worktree.** Ignored files stay in the checkout that has them. Copy the router and its assets folder into the new worktree, then rerun the four generators.
2. **`git commit --no-verify` bypasses the guard**, the same recorded limit as the skill guard. The ignore rules remain the first layer.
3. **The match is on the name.** A private command copied to a name without the `local-` prefix is not caught.
<!-- /ANCHOR:limitations -->

---
