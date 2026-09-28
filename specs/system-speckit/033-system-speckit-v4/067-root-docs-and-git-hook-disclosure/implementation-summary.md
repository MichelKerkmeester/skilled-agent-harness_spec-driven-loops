---
title: "Implementation Summary: Root docs and git hook disclosure"
description: "The README now says what the git hooks block and how to turn them off, one section links every off switch, CONTRIBUTING matches the repository and every hook block names its bypass."
trigger_phrases:
  - "root docs git hook disclosure summary"
  - "git hook bypass lines shipped"
  - "readme off switches shipped"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/067-root-docs-and-git-hook-disclosure"
    last_updated_at: "2026-09-28T20:03:11Z"
    last_updated_by: "generate-context"
    recent_action: "Reviewed this phase's release section and published the release with packet 062"
    next_safe_action: "Decide whether the agent mirror gate needs a bypass switch of its own"
    blockers: []
    key_files:
      - "README.md"
      - "CONTRIBUTING.md"
      - ".skilled/scripts/git-hooks/pre-commit"
      - ".skilled/changelog/skilled/v4.0.0.2.md"
    session_dedup:
      fingerprint: "sha256:410bbd958310d75547667ee9f4a9aca5cde33e4376fdac5151a1a1abeb74fc90"
      session_id: "scaffold-067-root-docs-and-git-hook-disclosure"
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
| **Spec Folder** | 067-root-docs-and-git-hook-disclosure |
| **Completed** | 2026-09-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A person who clones this repository now learns from the README that git hooks will check their commits, what those hooks refuse and how to turn them off. When a hook does block, its message names the variable that lets that one command through, so nobody has to read a hook's source to get unstuck.

### Root docs and git hook disclosure

The README's Quick Start gained a "Git Hooks" subsection. It says the first AI session in the main checkout installs the hooks, lists what pre-commit, commit-msg and pre-push block, and gives the two commands that remove the hooks and keep the session check from putting them back. The Configuration section gained "Off Switches", the one place that links the hook kill-switches, the two validation switches, the git hook bypasses and `.env.example`, and says which of them the personal `hook-flags.env` file can hold.

`CONTRIBUTING.md` now names Skilled, clones `skilled-agent-harness_spec-driven-loops` and states the commit rules the commit-msg hook enforces. `.env.example` opens with where each group of switches is read, and its git hook list names every bypass the hooks read. Seven block messages in the commit-msg and pre-commit hooks gained a bypass line.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `README.md` | Modified | Git Hooks and Off Switches subsections |
| `CONTRIBUTING.md` | Modified | Name, clone URL, enforced commit rules and a pointer to the hooks |
| `.env.example` | Modified | Where switches are read and the full git hook bypass list |
| `.skilled/scripts/git-hooks/commit-msg` | Modified | Bypass line on the two early blocks |
| `.skilled/scripts/git-hooks/pre-commit` | Modified | Bypass line on the comment hygiene and mirror parity blocks, the whole-chain switch on both agent mirror blocks |
| `.skilled/scripts/git-hooks/tests/commit-msg.test.sh` | Modified | Case 17 asserts both early blocks name the bypass |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Modified | Bypass checks on the dirty mirror and missing checker cases, and cases 40 to 42 |
| `.skilled/changelog/skilled/v4.0.0.2.md` | Modified | The Git Hooks and the Root Docs section, then the release review shared with packet 062 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The test cases came first. Run against the hooks as committed at HEAD, they failed exactly the seven new checks while every other case passed, and after the message lines went in both suites passed in full. Each README claim about a hook was read back from that hook's source before it was written: the install in every runtime's session start, the 100-file deletion ceiling, the four-file body rule and what `--uninstall` removes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The agent mirror gate's blocks name `SYSTEM_GIT_COMMIT_HOOKS_DISABLED=1` | That gate has no switch of its own, and adding one changes a gate's contract. The message says the switch turns off every pre-commit gate, so the cost is stated where the choice is made |
| The README's `CLAUDE.md` line was left alone | Commit `003dabe08d` fixed it before this phase started |
| The Section 5 validation switch lines in `.env.example` belong to `specs/sk-doc/062-doc-validation-off-switches` | They close that packet's review finding F002, so they are committed with it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `commit-msg.test.sh` | PASS, 19 of 19. Against the HEAD hook, 17 pass and the two new checks fail |
| `pre-commit.test.sh` | PASS, 55 of 55. Against the HEAD hook, 50 pass and the five new checks fail |
| `bash -n` on both hooks | PASS |
| `validate_document.py` on `README.md` and `CONTRIBUTING.md` | No new issue. CONTRIBUTING's missing overview section is reported at HEAD too |
| `hvr_scan.py` on the added doc lines | PASS, 0 hard blockers |
| v4.0.0.2 entry after the release review | PASS, recorded in packet 062's T026: 0 issues, 0 hard blockers and every link resolving |
| v4.0.0.2 release | PASS, recorded in packet 062's T027: tagged on `68dd665c5d` after ten of ten CI workflows passed, and published as Latest |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The agent mirror gate has no switch of its own.** Getting one commit past it turns off the whole pre-commit chain for that commit. A per-gate switch would need its own change to the gate.
2. **The git hook bypasses are read from the environment only.** They cannot be saved in `hook-flags.env`. Only `SYSTEM_GIT_COMMIT_HOOKS_DISABLED` and the master `SYSTEM_HOOKS_DISABLED` reach the pre-commit chain from that file.
<!-- /ANCHOR:limitations -->

---
