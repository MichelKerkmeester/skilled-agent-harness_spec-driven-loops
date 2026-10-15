---
title: "Implementation Summary: standards template round-trip"
description: "The commit template round-trips again, CI Gate Inputs is green, the setup check covers all six AI-tool adapters and nine review findings are fixed."
trigger_phrases:
  - "standards template round trip implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/034-standards-template-round-trip"
    last_updated_at: "2026-10-15T13:17:04Z"
    last_updated_by: "generate-context"
    recent_action: "Named /doctor:git setup in the README, SKILL.md, catalog and playbook"
    next_safe_action: "Commit the doc gaps, then start the deep research and review loops"
    blockers: []
    key_files:
      - ".skilled/skills/sk-git/SKILL.md"
      - ".skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md"
    session_dedup:
      fingerprint: "sha256:0b0ac2d79e6af6bb29cc8c6227d3ebc5404d98a73f137c35983ae6b466c47cce"
      session_id: "scaffold-034-standards-template-round-trip"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 034-standards-template-round-trip |
| **Completed** | 2026-10-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/doctor:git standards set` changes one line of your `.sk-git/` copy again, CI Gate Inputs is green on main, and `/doctor:git setup` is safer and more accurate. A fresh review found a way for an inspected repository to make the setup check run a program of its choosing, and that is now closed.

### Standards template round-trip

The `commitId` trailer entry in the shipped commit template had grown past the serializer's 115-character inline limit, so `set` rewrote the whole block. The entry now spans six lines in the serializer's layout, with the parsed contract unchanged.

### Follow-ups and review fixes

- The gate-inputs checker reads the `/dev/null/.skilled-untrusted` hook-trust sentinel as a note and still checks any other path on the same line.
- The five docs the setup build touched carry no HVR hard blocker.
- ai-tool-hooks checks all six adapters. A present config must register the advisory, an absent one is "not set up", and the active tool must register. Only the parsed hooks section counts, and Claude's local settings file counts too.
- Every child process gets `core.fsmonitor=false` and `log.showSignature=false` through the environment, so no helper's git call can run `gpg.program` or an fsmonitor program from the inspected repository.
- hooks accepts links into the repository's own sources, the install repair restores files, trust reads a boolean, and the allowlist and worktree base resolve against the main worktree, each as the hooks and helpers do.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-git/assets/commit-message-template.md` | Modified | The `commitId` entry in the serializer's layout |
| `.github/scripts/check-gate-inputs.sh` and its test | Modified | The sentinel rule |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` and its test | Modified | Six adapters and the nine review fixes |
| `.skilled/commands/doctor/assets/doctor-git-setup.yaml` | Modified | The six-adapter rule |
| `git.md`, both READMEs, the scripts README, the doctor catalog overview | Modified | HVR fixes |
| `README.md`, sk-git `SKILL.md`, the sk-git feature catalog, the spec-kit doctor playbook README | Modified | Name `/doctor:git setup` where it was missing |
| `.skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md` | Created | The `/doctor:git` feature entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 Flash at max thinking, run through cli-pi, made every edit from exact briefs, one at a time. The orchestrator reviewed each diff against a backup and checked every new test by reverting its fix and watching it fail. A fresh Opus 5.5 medium agent reviewed all the work read-only, and the orchestrator reproduced its top finding before fixing it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reflow the template line, keep `INLINE_WIDTH` at 115 | It leaves the layout of every user's `set` output as it was |
| Exempt the sentinel in the checker, leave the hooks alone | One rule instead of seven hook edits |
| Configured adapters must register, the active tool must exist | A present but unregistered file reads as coverage while no warning is ever shown |
| Force safe git config through the environment | It outranks every config file, so it reaches helper scripts the battery cannot change |
| Hooks may resolve into the repository's own sources or this checkout's | That matches both the installer and a shared core.hooksPath |
| DOC-384 verdict recorded here, not in a benchmark report folder | The operator chose it, since that folder is written by the harness |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Parsed contract before and after the reflow | PASS, byte-identical |
| `run-all.sh` | PASS, exit 0, 7 of 7 suites, 302 tests |
| `git-setup-check.test.cjs` | PASS, 17 of 17. Each new test fails with its fix reverted |
| `check-gate-inputs.sh` and its suite | PASS, `RESULT: PASSED` and 50 of 50 |
| `route-validate.sh` | PASS, exit 0 |
| HVR on the five docs | PASS, 0 hard blockers each |
| DOC-384 through a live Claude Code `/doctor:git setup` | PASS: 11 PASS rows, exit 0, `--json` 11 complete rows, `--tool nope` exit 2, status and local config unchanged |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The battery's own `GIT_FLAGS` comment overstates the risk.** It says fsmonitor runs on a plain query, while the review found none of today's queries start it. The environment override makes the point moot.
2. **`hard-rules.json` has no per-repository overlay,** as the setup research noted.
<!-- /ANCHOR:limitations -->

---
