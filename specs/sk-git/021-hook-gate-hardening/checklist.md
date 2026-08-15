---
title: "Verification Checklist: git hook gate hardening"
description: "Level 2 checklist for live-sync gate hardening and safe SessionStart primary-checkout reconciliation."
trigger_phrases:
  - "git hook gate hardening"
  - "autosync gate rejection"
  - "skill root metadata self heal"
  - "durable pre-push failure log"
  - "session start primary reconcile"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-git/021-hook-gate-hardening"
    last_updated_at: "2026-08-15T14:57:27Z"
    last_updated_by: "opencode"
    recent_action: "Verified SessionStart primary reconciliation and runtime parity"
    next_safe_action: "Review the scoped diff; no real repository push was performed"
---
# Verification Checklist: git hook gate hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` [EVIDENCE: REQ-001 through REQ-011]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` [EVIDENCE: architecture and test strategy]
- [x] CHK-003 [P1] Every scoped implementation file read before modification [EVIDENCE: `read` tool receipts]

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Exact live-branch autosync predicate cannot exempt another branch [EVIDENCE: `pre-push:104-108` plus first-publication simulation]
- [x] CHK-011 [P0] Skill metadata repair is not attempted after commit creation [EVIDENCE: `ci-skill-root-metadata.cjs --fix` writes working-tree projections]
- [x] CHK-012 [P0] Unknown or authored metadata failures remain blocking [EVIDENCE: `gate=skill-root-metadata` blocked record]
- [x] CHK-013 [P0] Push stderr is preserved and replayed for a gate rejection [EVIDENCE: `AUTOSYNC BLOCKED` simulation output]
- [x] CHK-014 [P0] Known gate rejection stops retrying as a push race [EVIDENCE: durable logs contain `blocked` and no `pending`]
- [x] CHK-015 [P1] New script comments explain durable reasons and contain no artifact labels [EVIDENCE: `check-comment-hygiene.sh` clean]

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-030 [P0] Every modified shell script passes `bash -n` [EVIDENCE: five final-state exit-0 checks]
- [x] CHK-031 [P0] Skill-root gate simulation is loud and durably logged [EVIDENCE: terminal and `git-sync.log` at 2026-08-15T13:48:24Z]
- [x] CHK-032 [P0] Mass-deletion simulation is loud and durably logged [EVIDENCE: terminal and `git-sync.log` at 2026-08-15T13:48:24Z]
- [x] CHK-033 [P0] Clean autosync simulation preserves successful publication [EVIDENCE: `published` fast-forward record at 2026-08-15T13:48:24Z]
- [x] CHK-034 [P1] Strict packet validation reports zero errors and zero warnings [EVIDENCE: `validate.sh --strict` reported Errors 0 and Warnings 0]

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-035 [P0] All blocking pre-push outcomes have stable publisher classifications [EVIDENCE: `mass-deletion`, `skill-root-metadata`, `naming`, `remote-permission`, and `test-suites` cases]
- [x] CHK-036 [P1] Advisory bypasses remain concern-local [EVIDENCE: `SPECKIT_SKIP_DOC_MODEL_VALIDATE` guards only the advisory invocation]

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-020 [P0] Mass-deletion violations remain blocking [EVIDENCE: `101 deletions` simulated and blocked]
- [x] CHK-021 [P0] Remote-permission violations remain blocking outside exact autosync [EVIDENCE: `gate:remote-permission` control flow]
- [x] CHK-022 [P0] Naming violations remain blocking outside documented exemptions [EVIDENCE: `gate:naming` control flow]
- [x] CHK-023 [P0] Enforced test failures remain blocking and report-only mode stays report-only [EVIDENCE: `SPECKIT_PREPUSH_TESTS_ENFORCE` verdict unchanged]
- [x] CHK-024 [P1] No captured diagnostic can expose credentials [EVIDENCE: `_record` receives normalized static repair text]

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Continuous-integration reference contains the complete gate map [EVIDENCE: `continuous-integration.md` lifecycle gate table]
- [x] CHK-041 [P1] Remote-branch policy explains naming and permission behavior for exact autosync [EVIDENCE: `remote-branch-policy.md` continuous-integration exception]
- [x] CHK-042 [P1] Chore repair and true safety blocks are clearly distinguished [EVIDENCE: `ci-skill-root-metadata.cjs --fix` rationale in both references]

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Only the explicitly scoped hooks, libraries, publisher, references, and packet changed [EVIDENCE: `apply_patch` operation ledger]
- [x] CHK-051 [P0] Package manifests and lockfiles are untouched [EVIDENCE: `.opencode/package.json` and `.opencode/package-lock.json` received no operation]
- [x] CHK-052 [P1] No task-created temporary output remains in the workspace [EVIDENCE: `trap` removed external temp fixtures]

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 27 | 27/27 |
| P1 Items | 14 | 14/14 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-15
**Verified By**: OpenCode with static checks, runtime tests, TypeScript typecheck, and isolated local-remote Git simulations

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:session-reconcile -->
## SessionStart Primary Reconcile

- [x] CHK-060 [P0] Linked worktrees exit zero silently without changing local or remote refs [EVIDENCE: primary, linked, and remote all remained `6237ea3`; no output or log]
- [x] CHK-061 [P0] Master and per-concern disable flags produce zero-exit no-ops through the shared resolver [EVIDENCE: both outputs silent; log names `MK_LIVE_SYNC_DISABLED` and `MK_PRIMARY_RECONCILE_DISABLED`]
- [x] CHK-062 [P0] A tracked-dirty primary is not fetched, merged, rebased, or pushed [EVIDENCE: HEAD `01281b5`, file hash, remote `b1a9764`, and local tracking `01281b5` unchanged]
- [x] CHK-063 [P0] Untracked files do not block reconciliation [EVIDENCE: behind path advanced to `4ed6b47` and retained `build.tmp`]
- [x] CHK-064 [P0] Behind-only state fast-forwards to the scratch remote tip without a push [EVIDENCE: local reached `4ed6b47`; bare remote remained `4ed6b47`; `advance` log]
- [x] CHK-065 [P0] Clean unpublished commits rebase and publish non-force to the scratch remote [EVIDENCE: local rebased from `2bb7686` to `4adc7fa`; bare remote advanced to the same tip]
- [x] CHK-066 [P0] Rebase conflict abort restores original HEAD and clean tracked state while preserving the local commit [EVIDENCE: local `ae2a51b` restored, tracked-clean yes, rebase-state none, remote `0c43bd9` unchanged]
- [x] CHK-067 [P0] Push-gate rejection is classified, loud, durably logged, and leaves the commit local [EVIDENCE: local `[gate:test-suites]` hook produced `BLOCK [test-suites]`; local `c8bdfd1` preserved; remote `3e6e4ac` unchanged]
- [x] CHK-068 [P0] Fetch and push are time-bounded and every script path exits zero [EVIDENCE: `time bash primary-reconcile-sandbox.sh` completed the seven-case battery in 6.640 seconds]
- [x] CHK-069 [P1] Single-flight lock is atomic, stale-aware, common-dir scoped, and released on exit [EVIDENCE: `.opencode/bin/git-primary-reconcile.sh:88-113` and token-matched EXIT cleanup at lines 41-55]
- [x] CHK-070 [P1] Claude, Codex, OpenCode, and Pi background the same script without duplicated gates [EVIDENCE: `.claude/settings.json:125-129`, `.codex/hooks.json:21-25`, `.opencode/plugins/session-cleanup.js:148-161`, and `session-start-advisories.ts:36`]
- [x] CHK-071 [P1] New script comments contain durable reasons and no ephemeral artifact labels [EVIDENCE: `python3 check-comment-hygiene.sh <file>` exited 0 for the shell, plugin, and Pi source]
- [x] CHK-072 [P1] Continuous-integration and feature-flag docs match runtime behavior [EVIDENCE: `continuous-integration.md:36-81`, `ENV-REFERENCE.md:229-231`, and `AGENTS.md:359`]
- [x] CHK-073 [P1] Shell syntax, JSON parsing, relevant runtime tests, metadata generation, and strict validation pass [EVIDENCE: bash/JSON exits 0; plugin 13/13; TypeScript typecheck; strict Errors 0 / Warnings 0]

<!-- /ANCHOR:session-reconcile -->
