---
title: "Feature Specification: git hook gate hardening"
description: "Make every commit and pre-push gate explicit under live-sync, self-heal safe generated metadata drift, and durably classify blocked autosync publishes."
trigger_phrases:
  - "git hook gate hardening"
  - "autosync gate rejection"
  - "skill root metadata self heal"
  - "durable pre-push failure log"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-git/021-hook-gate-hardening"
    last_updated_at: "2026-08-15T13:52:00Z"
    last_updated_by: "opencode"
    recent_action: "Completed hook gate hardening and behavioral verification"
    next_safe_action: "Review the scoped changes without running Git operations"
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
The live-sync publisher discards `git push` stderr. A pre-push hook can therefore reject an autosync publish with a precise reason while `git-sync.sh` records only a generic pending push race. The skill-root metadata gate can also block an autosync publish over safely regenerable stale projections, stranding a wrapper session even though the gate has a deterministic repair. The full commit and push gate set has not been documented as one autosync-aware map.

### Purpose
Preserve every real safety block while making autosync gate failures impossible to miss. Safe generated projection drift should self-heal and re-check during an exact live-branch autosync. Any remaining gate rejection must be classified from captured stderr, printed loudly, and written to the durable sync log with the gate name and repair guidance.

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

### Out of Scope
- Weakening or bypassing mass-deletion, remote-permission, naming, or enforced test safety.
- Editing hook installation, package manifests, lockfiles, unrelated scripts, or runtime configuration.
- Running Git commands, creating commits, or pushing branches.

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
| `specs/sk-git/021-hook-gate-hardening/` | Create | Planning, evidence, and completion records |

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

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A simulated skill-root gate rejection either repairs and proceeds or produces a classified loud block plus durable log evidence.
- **SC-002**: A simulated mass-deletion rejection remains blocked and produces loud hook output plus durable sync-log evidence.
- **SC-003**: A clean autosync simulation reaches the existing published outcome without altered semantics.
- **SC-004**: Every modified shell script passes `bash -n`.
- **SC-005**: Strict packet validation reports `Errors: 0` and `Warnings: 0`.

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

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: No blocking exit may lose its gate identity or repair guidance.
- **NFR-R02**: Self-heal must be bounded to exact live-branch autosync and followed by a full re-check.

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

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | Three lifecycle hooks, shared helpers, sync publisher, and two references |
| Risk | 18/25 | Changes affect every wrapper-session publish and several blocking gates |
| Research | 12/20 | Requires full gate inventory and controlled failure simulations |
| **Total** | **43/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None. Scope, safety constraints, packet location, and no-Git verification are operator-selected.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:related-docs -->
