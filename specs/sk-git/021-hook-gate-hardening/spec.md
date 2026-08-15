---
title: "Feature Specification: git hook gate hardening"
description: "Make live-sync gate failures explicit and reconcile the primary live checkout safely at SessionStart."
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
    recent_action: "Delivered and verified SessionStart primary-checkout reconciliation"
    next_safe_action: "Review the scoped diff; no real repository push was performed"
---
# Feature Specification: git hook gate hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-15 |
| **Branch** | Existing operator-provided worktree |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Work Item 1 addressed silent live-sync gate failures: the publisher discarded `git push` stderr, misreported policy rejections as races, and lacked a complete autosync-aware gate map. Work Item 2 addresses primary-checkout drift: the long-running follower is not a reliable startup dependency, so direct commits in the primary checkout remain unpublished while other sessions' published commits remain unseen. New sessions then encounter a diverged live checkout.

### Purpose
Preserve every real safety block while making autosync failures observable and making SessionStart the reliable reconciliation boundary. A clean primary checkout may fast-forward, rebase unpublished local commits, and non-force publish them. A primary checkout with tracked changes must never be fetched, rebased, merged, or pushed by the reconciler.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit every gate in `pre-commit`, `pre-push`, `post-commit`, their shared libraries, and `git-sync.sh`.
- Make the skill-root metadata gate self-heal generated files only during an exact live-branch autosync, then re-run the blocking check.
- Capture pre-push stderr in `git-sync.sh`, classify known gate failures, and preserve the original diagnostics.
- Make mass-deletion and all other true safety violations remain blocking, loud, and durably logged.
- Confirm naming and permission behavior for the exact autosync live branch.
- Document the complete gate map in the two named sk-git references.
- Verify behavior through non-Git command simulations and shell syntax checks.
- Add a non-fatal, primary-checkout-only SessionStart reconciler with tracked-only cleanliness, single-flight locking, bounded network operations, clean rebase-and-publish behavior, conflict abort assertions, classified push blocks, and a durable common-dir log.
- Background the reconciler from the Claude, Codex, OpenCode, and Pi SessionStart surfaces without duplicating its gates.
- Document SessionStart reconciliation and `MK_PRIMARY_RECONCILE_DISABLED`.
- Prove dirty, behind, ahead, conflicting, linked-worktree, and disabled behavior against a local scratch remote.

### Out of Scope
- Weakening or bypassing mass-deletion, remote-permission, naming, or enforced test safety.
- Editing package manifests, lockfiles, unrelated hooks, or unrelated runtime configuration.
- Mutating history or pushing in the real repository; all behavioral Git mutations and pushes are confined to a throwaway local sandbox.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/scripts/git-hooks/pre-push` | Modify | Autosync detection, generated metadata repair, and classified blocks |
| `.opencode/scripts/git-hooks/pre-commit` | Modify if audit finds a silent block | Preserve loud commit-gate diagnostics |
| `.opencode/scripts/git-hooks/post-commit` | Modify if needed | Preserve non-fatal autosync launch visibility |
| `.opencode/scripts/git-hooks/lib/` | Modify if needed | Shared durable diagnostics without safety weakening |
| `.opencode/bin/git-sync.sh` | Modify | Capture, classify, print, and durably log hook stderr |
| `.opencode/skills/sk-git/references/continuous-integration.md` | Modify | Full gate map and autosync outcome contract |
| `.opencode/skills/sk-git/references/remote-branch-policy.md` | Modify | Naming and permission behavior for autosync |
| `.opencode/bin/git-primary-reconcile.sh` | Create | SessionStart primary-checkout reconciliation source of truth |
| `.claude/settings.json` | Modify | Background the reconciler at SessionStart |
| `.codex/hooks.json` | Modify | Background the reconciler at SessionStart |
| `.opencode/plugins/session-cleanup.js` | Modify | Background the reconciler on OpenCode session creation |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-start-advisories.ts` | Modify | Background the reconciler at Pi session start |
| `.opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md` | Modify | Document the per-concern disable flag |
| `specs/sk-git/021-hook-gate-hardening/` | Modify | Reopened planning, evidence, and completion records |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every pre-commit and pre-push gate is audited for autosync execution, exemption, output, and silent-block risk | A final per-gate table records all four properties |
| REQ-002 | Safe stale skill projections self-heal only for an exact autosync push to the live branch | The hook runs `--fix`, re-checks, and proceeds only if the blocking gate passes |
| REQ-003 | Authored or unfixable skill metadata violations stay blocking | A failed post-fix re-check names the gate and exact repair command |
| REQ-004 | `git-sync.sh` preserves pre-push stderr | A rejected push emits the original hook output instead of discarding it |
| REQ-005 | `git-sync.sh` classifies and durably logs gate rejections | The autosync log records `blocked`, a gate identifier, and repair guidance |
| REQ-006 | Mass-deletion and permission violations remain blocking | Simulations prove the verdict remains non-zero and diagnostics are loud and logged |
| REQ-007 | Clean autosync behavior is unchanged | A clean simulated push completes through the existing success path |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Naming behavior explicitly covers exact live-branch autosync publishes | Existing live-branch updates are naming-exempt and first-publish handling is documented |
| REQ-009 | The two sk-git references contain the full gate map and repair behavior | Both docs distinguish chores from real safety violations |
| REQ-010 | Modified shell scripts remain syntax-clean | `bash -n` exits zero for every modified shell file |
| REQ-011 | Packet metadata is generated through `generate-context.js` | `description.json` and `graph-metadata.json` exist and strict validation reports zero warnings and errors |
| REQ-012 | SessionStart reconciliation acts only in the primary checkout on the resolved live branch | Linked worktrees and non-live branches exit zero without changing refs or files |
| REQ-013 | Tracked changes block every reconcile mutation while untracked files do not | Dirty tracked simulation preserves HEAD, index, worktree bytes, and remote tip |
| REQ-014 | Clean behind-only state fast-forwards without publishing | The local primary reaches the remote tip and the remote tip is unchanged |
| REQ-015 | Clean unpublished primary commits are rebased and non-force published | A clean ahead/diverged simulation leaves the local and bare remote tips equal |
| REQ-016 | Rebase conflicts abort completely and preserve unpublished commits | Original HEAD is restored, tracked state is clean, remote is unchanged, and a loud manual path is printed and logged |
| REQ-017 | Reconcile execution is non-fatal, single-flight, bounded, and observable | Every path exits zero; lock contention skips; fetch/push are time-bounded; durable log records skips, advances, publishes, and blocks |
| REQ-018 | Shared and concern-specific disable flags stop reconciliation | `MK_LIVE_SYNC_DISABLED=1` and `MK_PRIMARY_RECONCILE_DISABLED=1` produce a zero-exit no-op through the shared resolver |
| REQ-019 | Every supported SessionStart surface backgrounds the same script | Claude, Codex, OpenCode, and Pi wiring contains no duplicated Git gating logic |
| REQ-020 | Reconcile documentation and runtime configuration remain valid | Named docs describe the behavior and flag; shell syntax and both JSON files validate |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A simulated skill-root gate rejection either repairs and proceeds or produces a classified loud block plus durable log evidence.
- **SC-002**: A simulated mass-deletion rejection remains blocked and produces loud hook output plus durable sync-log evidence.
- **SC-003**: A clean autosync simulation reaches the existing published outcome without altered semantics.
- **SC-004**: Every modified shell script passes `bash -n`.
- **SC-005**: Strict packet validation reports `Errors: 0` and `Warnings: 0`.
- **SC-006**: Six local-sandbox scenarios prove the tracked-dirty, behind, ahead, conflict, linked-worktree, and master-disable invariants without contacting the real remote.
- **SC-007**: Every SessionStart call site backgrounds one shared script and remains non-blocking.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Treating every push failure as a hook rejection | Network races could be misclassified | Classify only known stderr signatures and keep generic race handling otherwise |
| Risk | Auto-fixing authored metadata | Could invent policy or identity | `--fix` is limited to generated projections and the gate must re-check afterward |
| Risk | Captured stderr is hidden during retries | A block could remain silent | Print classified blocks immediately and append them to the common-dir log |
| Dependency | `ci-skill-root-metadata.cjs --fix` | Supplies deterministic generated projection repair | Confirmed to write only generated manifest and alias projections |
| Risk | Reconcile runs in a linked worktree or on an intentional feature branch | Could move a branch owned by another session | Compare canonical git-dir/common-dir paths and require current branch equality with the resolved live branch |
| Risk | Rebase conflict leaves partial state | Could strand the primary checkout mid-operation | Abort, assert original HEAD and tracked cleanliness, then emit a loud preserved-but-unpublished warning |
| Risk | SessionStart waits on a remote | Could delay every runtime | Background the script and bound fetch/push duration inside it |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: No blocking exit may lose its gate identity or repair guidance.
- **NFR-R02**: Self-heal must be bounded to exact live-branch autosync and followed by a full re-check.
- **NFR-R03**: Reconciliation must always exit zero and never block SessionStart.
- **NFR-R04**: The critical dirty-tree predicate must inspect tracked unstaged and staged changes only.

### Security
- **NFR-S01**: Captured diagnostics and durable logs must not record credentials or environment secrets.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A first publish to a new live branch must not be rejected merely because the source is a wrapper branch.
- A manual push with `SPECKIT_AUTOSYNC=1` targeting any branch other than `$SPECKIT_LIVE_BRANCH` receives no autosync exemption.
- A skill gate whose failure remains after `--fix` must stay blocked and name the authored repair path.
- Unknown push failures retain bounded retry behavior and are not mislabeled as a known gate.
- An untracked build artifact does not block a clean fast-forward or rebase.
- A stale lock older than the short TTL may be replaced; an active lock causes an immediate zero-exit skip.
- A missing or broken flag resolver warns once and fails open to reconciliation.
- A rejected post-rebase push preserves the local commit and reports the classified pre-push gate plus repair command.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Two live-sync work items spanning shell, four runtime surfaces, and references |
| Risk | 21/25 | Reconcile may move and publish the primary live branch, with dirty-tree safety as a hard invariant |
| Research | 16/20 | Requires gate inventory plus six real local-remote Git simulations |
| **Total** | **55/70** | **Level 2 with expanded verification** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None. Scope, safety constraints, packet location, and local-scratch-remote verification are operator-selected.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:related-docs -->
