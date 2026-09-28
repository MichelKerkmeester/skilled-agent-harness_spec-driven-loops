---
title: "Changelog: Root docs and git hook disclosure [033-system-speckit-v4/067-root-docs-and-git-hook-disclosure]"
description: "Chronological changelog for the Root docs and git hook disclosure phase."
trigger_phrases:
  - "system speckit v4 root docs and git hook disclosure changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-09-28

> Spec folder: `specs/system-speckit/033-system-speckit-v4/067-root-docs-and-git-hook-disclosure` (Level 1)
> Parent packet: `specs/system-speckit/033-system-speckit-v4`

### Summary

A person who clones this repository now learns from the README that git hooks will check their commits, what those hooks refuse and how to turn them off. When a hook does block, its message names the variable that lets that one command through, so nobody has to read a hook's source to get unstuck.

### Added

- [P] Add a test case per missing bypass line and watch each fail against the current hooks (.skilled/scripts/git-hooks/tests/commit-msg.test.sh, .skilled/scripts/git-hooks/tests/pre-commit.test.sh)
- Add the bypass line to the two early commit-msg blocks (.skilled/scripts/git-hooks/commit-msg)
- Add the bypass line to the comment hygiene and mirror parity blocks, and the whole-chain switch to both agent mirror blocks (.skilled/scripts/git-hooks/pre-commit)
- [P] Add the header on where switches are read and complete the git hook bypass list (.env.example)
- Add the Git Hooks subsection to Quick Start and the Off Switches subsection to Configuration (README.md)
- Run both suites: commit-msg 19 of 19 and pre-commit 55 of 55. The same suites against the HEAD hooks fail exactly the seven new checks

### Changed

- Read each hook's block paths and list the seven that name no way through (.skilled/scripts/git-hooks/commit-msg, .skilled/scripts/git-hooks/pre-commit)
- Capture the suite baselines: commit-msg 17 of 17, pre-commit 50 of 50
- Check each README claim against the hook source: the install trigger in every runtime's session start, the 100-file deletion ceiling, the four-file body rule and what --uninstall removes
- All tasks marked [x]
- No [B] blocked tasks remaining
- Manual verification passed

### Fixed

- Confirm the stale claims: the project name and the clone URL (CONTRIBUTING.md). The README's CLAUDE.md line was already fixed in 003dabe08d (README.md)
- [P] Rename the project, fix the clone URL, state the enforced commit rules and link the README's Git Hooks section (CONTRIBUTING.md)

### Verification

- commit-msg.test.sh - PASS, 19 of 19. Against the HEAD hook, 17 pass and the two new checks fail
- pre-commit.test.sh - PASS, 55 of 55. Against the HEAD hook, 50 pass and the five new checks fail
- bash -n on both hooks - PASS
- validate_document.py on README.md and CONTRIBUTING.md - No new issue. CONTRIBUTING's missing overview section is reported at HEAD too
- hvr_scan.py on the added doc lines - PASS, 0 hard blockers
- Tasks complete - 15 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `README.md` | Modified | Git Hooks and Off Switches subsections |
| `CONTRIBUTING.md` | Modified | Name, clone URL, enforced commit rules and a pointer to the hooks |
| `.env.example` | Modified | Where switches are read and the full git hook bypass list |
| `.skilled/scripts/git-hooks/commit-msg` | Modified | Bypass line on the two early blocks |
| `.skilled/scripts/git-hooks/pre-commit` | Modified | Bypass line on the comment hygiene and mirror parity blocks, the whole-chain switch on both agent mirror blocks |
| `.skilled/scripts/git-hooks/tests/commit-msg.test.sh` | Modified | Case 17 asserts both early blocks name the bypass |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Modified | Bypass checks on the dirty mirror and missing checker cases, and cases 40 to 42 |

### Follow-Ups

- The agent mirror gate has no switch of its own. Getting one commit past it turns off the whole pre-commit chain for that commit. A per-gate switch would need its own change to the gate.
- The git hook bypasses are read from the environment only. They cannot be saved in hook-flags.env. Only SYSTEM_GIT_COMMIT_HOOKS_DISABLED and the master SYSTEM_HOOKS_DISABLED reach the pre-commit chain from that file.
