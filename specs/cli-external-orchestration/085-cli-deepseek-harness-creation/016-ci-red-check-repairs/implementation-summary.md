---
title: "Implementation Summary: CI Red Check Repairs"
description: "Five CI workflows on main reported the same four stale inputs on every push. Each input is repaired at its source, each repair proved locally with its workflow's command, and no check was loosened."
trigger_phrases:
  - "ci red check repairs implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/016-ci-red-check-repairs"
    last_updated_at: "2026-11-08T09:05:30Z"
    last_updated_by: "generate-context"
    recent_action: "CI red check causes repaired locally"
    next_safe_action: "Commit and push main"
    blockers: []
    key_files:
      - ".gitignore"
      - ".skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs"
      - ".skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json"
    session_dedup:
      fingerprint: "sha256:c3d236f612d27c8248123bb9c9afa6fcede9003b033d33364ec45f0c87153193"
      session_id: "scaffold-016-ci-red-check-repairs"
      parent_session_id: null
    completion_pct: 90
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
| **Spec Folder** | 016-ci-red-check-repairs |
| **Completed** | 2026-11-08 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Main's CI stops reporting four stale inputs as failures, and a new worktree no longer trips the pre-commit mirror gate on its first commit.

### Phase 16: ci-red-check-repairs

The DSH prompt for the operator's private command is now ignored like every other runtime's private mirror, so CI and a fresh worktree have no stray prompt to report. The variable-`DSH_HOME` dispatch case puts a stub `dsh` on a temporary PATH, so it tests the command shape and not whether the harness is installed. Three recorded playbook results lost their run dates, which the operator contract keeps out of scenario truth and one SKIP rule now names its blocker. The sk-doc directory manifest now lists the hook adapter folders added on 2026-11-07, and one README verdict moved from line 279 to 280.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.gitignore` | Modified | Ignores `/.dsh/prompts/local-*` |
| `.dsh/prompts/local-skilled-alignment.md` | Untracked | Generated from a private, ignored source |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modified | Stub `dsh` on PATH for one case |
| Three `cli-deepseek-harness` playbook scenarios | Modified | Dates removed; one SKIP blocker named |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Modified | Refreshed with `--write` |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Modified | One line number |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each cause was read from its workflow log and reproduced locally first: the dispatch case by removing `~/.local/bin` from PATH, the playbook and sk-doc failures by running their checkers as CI does. Each repair was then rechecked with the same command.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ignore the private DSH prompt rather than teach the generator to follow links | Every other runtime's private mirror is already ignored; once the stub is untracked, nothing is left to report |
| Patch one verdict line rather than rewrite the baseline | `--write` would freeze 152 new verdicts for READMEs added since, any of which could differ on a runner, to fix a one-line drift |
| Refresh the directory manifest with `--write` | Its 143 new folders are the deliberate hook reorganisation, and the refreshed count, 919, equals what CI derived |
| Leave the doctor playbook to worktree 324 | The operator chose the full scope, but that session committed the same two fixes at 09:10, with version bumps; a second copy on main would only make its branch conflict |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| DSH prompt check, provisioned private link present, no stub | PASS: `PASS: 44 prompt stubs are in sync.` |
| Runtime mirror check | PASS: `PASS: 241 mirrors across 10 trees are in sync.` |
| Dispatch tests without `dsh` on PATH | Before: `pass 46`, `fail 1`. After: `pass 47`, `fail 0` |
| Dispatch tests with `dsh` installed | PASS: `pass 47`, `fail 0` |
| `validate-playbook-package.cjs --strict` | PASS for DSH: `cli-deepseek-harness violations=0`. `system-skilled-doctor` still reports 2 until worktree 324 lands |
| `test_readme_manifest.py`, `test_readme_verdict_parity.py` | Before: both exit 1. After: both exit 0, `PARITY PASS: verdict diff is empty` |
| sk-doc runner as CI runs it | PASS: 55 of 55, `all sk-doc script tests passed` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A checkout that holds the private command loses its DSH stub on the next pull.** Git deletes a file that stops being tracked. Run `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-prompts-dsh.cjs` there; it writes the stub back as an ignored file.
2. **The README verdict baseline still covers 989 of 1,141 tracked READMEs.** It predates the rest. Rebuilding it is a separate decision for the sk-doc owner.
<!-- /ANCHOR:limitations -->

---
