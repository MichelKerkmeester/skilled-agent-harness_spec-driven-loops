---
title: "Verification Checklist: continuous-integration workflow for sk-git"
description: "Level 2 checklist with sandbox-battery, safety-gate, cross-runtime, and no-regression evidence."
trigger_phrases:
  - "continuous integration workflow"
  - "always current live branch"
  - "sk-git autosync"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-git/001-continuous-integration-workflow"
    last_updated_at: "2026-07-13T15:45:00Z"
    last_updated_by: "claude"
    recent_action: "All checklist items verified with evidence"
    next_safe_action: "Hand off the packet for operator review/merge"
---
# Verification Checklist: continuous-integration workflow for sk-git

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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md]
  - **Evidence**: `spec.md` REQ-001 through REQ-011 define the publish, safety, cross-runtime, and opt-out requirements.
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md]
  - **Evidence**: `plan.md` architecture describes the `fetch → FF-or-rebase-abort → non-force push` primitive and the triple-gated autosync.
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: plan.md dependencies]
  - **Evidence**: `plan.md` lists `worktree-session.sh`, the `install-git-hooks.sh` symlink, and the two guards as green internal dependencies.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The publish primitive never force-pushes and aborts on conflict [EVIDENCE: git-sync.sh]
  - **Evidence**: `git-sync.sh` uses `git push` (no `--force`) and `git rebase --abort` on any conflict, restoring the pre-sync state.
- [x] CHK-011 [P0] `--auto` mode is non-fatal (every exit code 0) [EVIDENCE: _bail helper]
  - **Evidence**: the `_bail` helper in `git-sync.sh` returns `exit 0` whenever `--auto` is set.
- [x] CHK-011b [P0] The dirty check is tracked-only so untracked files do not block rebase [EVIDENCE: git diff]
  - **Evidence**: `git-sync.sh` gates the rebase on `git diff` / `git diff --cached`, not `git status --porcelain`.
- [x] CHK-012 [P1] Autosync gate requires wrapper env + linked worktree [EVIDENCE: post-commit]
  - **Evidence**: the `post-commit` block requires `SPECKIT_AUTOSYNC=1` + `SPECKIT_LIVE_BRANCH` and an `--absolute-git-dir` that differs from the resolved `--git-common-dir`.
- [x] CHK-013 [P1] Comment hygiene preserved — no artifact ids in code comments [EVIDENCE: durable-why comments]
  - **Evidence**: `git-sync.sh`, `git-live-follow.sh`, and `worktree-status.sh` carry only durable WHY comments; no spec paths or packet ids in code.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: REQ-001 through REQ-011]
  - **Evidence**: every REQ has a passing gate recorded in `implementation-summary.md`.
- [x] CHK-021 [P0] The `git-sync.sh` sandbox battery passes every publish path [EVIDENCE: sandbox test]
  - **Evidence**: the fake-remote `gitsync-test.sh` reported `9 passed, 0 failed` (fast-forward, rebase, conflict-abort, `--auto`-safe, untracked-tolerant).
- [x] CHK-022 [P0] All scripts are syntax-clean [EVIDENCE: bash -n]
  - **Evidence**: `bash -n` returned `OK` for `git-sync.sh`, `git-live-follow.sh`, `worktree-status.sh`, `worktree-session.sh`, and `post-commit`.
- [x] CHK-023 [P1] `.codex/hooks.json` is valid JSON with the two guards added [EVIDENCE: json parse]
  - **Evidence**: `json.load` succeeded and reported `3` SessionStart hooks (`session-start.js` + the two guards).

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] The autosync composes with the existing hook behavior [EVIDENCE: post-commit compose]
  - **Evidence**: the block sits after the `mark_memory_drift_from_diff` call and before the `SPECKIT_SKIP_CODE_GRAPH_POST_COMMIT` branch; existing early-exits and markers are untouched.
- [x] CHK-025 [P1] Cross-runtime parity achieved without double-wiring OpenCode [EVIDENCE: session-cleanup.js]
  - **Evidence**: OpenCode already runs both guards via `session-cleanup.js` `GUARD_SCRIPTS`; only Codex needed the two hooks added.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in changed files [EVIDENCE: script review]
  - **Evidence**: `git-sync.sh` handles no credentials; the push relies on the existing remote configuration.
- [x] CHK-031 [P1] No repo authority widened [EVIDENCE: no-force invariant]
  - **Evidence**: publication uses `git push` without `--force` to the live branch only; no protected-branch bypass and no history rewrite.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: doc sync]
  - **Evidence**: `spec.md`, `plan.md`, and `tasks.md` describe the same continuous-integration scope and file list.
- [x] CHK-041 [P1] sk-git documents the model and the opt-out [EVIDENCE: continuous_integration.md]
  - **Evidence**: `references/continuous_integration.md` describes the live branch, the three scripts, the safety contract, and the `SPECKIT_AUTOSYNC=0` opt-out; SKILL.md carries the ALWAYS rule.
- [x] CHK-042 [P2] Comment hygiene preserved
  - **Evidence**: no ephemeral artifact ids in code; the doc changes are authoring-doc prose only.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files committed [EVIDENCE: scratchpad only]
  - **Evidence**: the `gitsync-test.sh` battery and its sandbox live under the session `scratchpad`, not the packet.
- [x] CHK-051 [P1] Scripts live in the canonical `.opencode/bin` location [EVIDENCE: bin path]
  - **Evidence**: `git-sync.sh`, `git-live-follow.sh`, and `worktree-status.sh` are under `.opencode/bin/` alongside `worktree-session.sh`.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-13
**Verified By**: Claude (sandbox battery + syntax + JSON + smoke gates)

<!-- /ANCHOR:summary -->
