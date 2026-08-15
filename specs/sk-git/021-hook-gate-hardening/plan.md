---
title: "Implementation Plan: git hook gate hardening"
description: "Harden live-sync gates and add safe SessionStart reconciliation for the primary live checkout."
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
    recent_action: "Completed the SessionStart reconciliation work item and final-state checks"
    next_safe_action: "Review the scoped diff; no real repository push was performed"
---
# Implementation Plan: git hook gate hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash hooks and reconciliation, JavaScript/TypeScript runtime wiring, JSON configuration, Markdown references |
| **Framework** | sk-git live-sync and versioned Git hooks |
| **Storage** | Append-only `git-sync.log` and `git-primary-reconcile.log` under the Git common directory |
| **Testing** | `bash -n`, JSON parsing, isolated clone plus bare local remote, scoped runtime tests, strict packet validation |

### Overview
Inventory each lifecycle gate first. Then add one exact autosync predicate shared by the pre-push decisions, use the skill metadata checker's bounded `--fix` mode only for generated drift, and re-check before allowing the push. Refactor push execution in `git-sync.sh` so stderr is captured once, classified only when a known hook signature is present, replayed to the caller, and appended to the durable outcome log.

The second work item adds one shell source of truth invoked in the background by every SessionStart surface. It exits before mutation unless the checkout is primary, on the resolved live branch, enabled, lock-owning, and clean for tracked changes. It then fetches with a short bound, fast-forwards behind-only state, or rebases and publishes local commits. Conflict and push-rejection paths preserve the commit, restore a clean tracked tree, emit classified guidance, and log the outcome.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All named hooks, libraries, publisher code, metadata checker, and reference docs read fully.
- [x] The checker confirms `--fix` writes generated projections only.
- [x] The no-Git constraint is translated into command-stub simulations.

### Definition of Done
- [x] Every gate appears in the audit table with autosync behavior and silent-block assessment.
- [x] Skill-root and mass-deletion block simulations show loud terminal output and durable log records.
- [x] Clean autosync simulation preserves the success path.
- [x] Every modified shell script passes `bash -n`.
- [x] Packet validation reports zero errors and zero warnings.
- [x] Six isolated Git scenarios prove all primary-reconcile safety and publication paths.
- [x] Claude, Codex, OpenCode, and Pi SessionStart surfaces background the shared script.
- [x] New shell, JSON, documentation, metadata, and strict packet gates pass from final state.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use one narrow predicate for an autosync publish to the exact live branch. Safety checks remain authoritative. Generated metadata drift is the only chore eligible for bounded repair. Push stderr becomes structured evidence: known `BLOCKED` signatures select a gate classification, while unknown failures remain ordinary network/race outcomes.

### Key Components
- **`pre-push`**: run mass-deletion, naming, permission, skill metadata, and optional tests with explicit diagnostics. An exact autosync first publish to the live branch is naming-exempt because the wrapper branch is a transport source, not the remote destination identity.
- **`ci-skill-root-metadata.cjs`**: existing deterministic `--fix` behavior is invoked, not modified, unless the audit proves a checker defect.
- **`git-sync.sh`**: central push helper captures stderr, prints it on known gate rejection, records a stable gate id and normalized fix text, and returns a distinct result to the publish loop.
- **References**: one table documents commit-time gates, push-time gates, exemptions, and durable outcomes.

### Data Flow
`post-commit` invokes `git-sync.sh --auto`. The publisher pushes `HEAD:<live>` and captures stderr. If the pre-push hook blocks, the publisher classifies the signature, replays diagnostics, writes a `blocked gate=<id>` record, and stops retrying. If no gate signature exists, the existing push-race retry path remains active.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Audit and Proof Design
- [x] Inventory hook and publisher gates.
- [x] Record current autosync execution, exemptions, diagnostics, and silent-block risks.
- [x] Define stubbed command scenarios for generated drift, mass deletion, and clean publication.

### Phase 2: Runtime Hardening
- [x] Add the exact live-branch autosync predicate and naming coverage.
- [x] Keep skill metadata blocking with an exact repair command because hook-side repair cannot change committed bytes.
- [x] Capture, classify, replay, and durably log pre-push stderr in `git-sync.sh`.
- [x] Address any other audited silent block without weakening safety.

### Phase 3: Documentation and Verification
- [x] Document the complete gate map in both named references.
- [x] Run syntax checks and all three command-stub simulations.
- [x] Generate packet metadata, finalize evidence, and run strict validation.

### Phase 4: Reconcile Design and Packet Reopen
- [x] Reopen the completed packet as In Progress and extend its requirements without erasing Work Item 1 evidence.
- [x] Inspect primary/live-sync conventions, flag resolution, runtime SessionStart surfaces, and packet validation rules.
- [x] Define observable pass/fail checks for six local-sandbox decision paths.

### Phase 5: SessionStart Reconcile Implementation
- [x] Add the non-fatal primary reconciler with canonical checkout gating, shared flags, atomic stale-aware lock, tracked-only cleanliness, bounded fetch/push, rebase-abort assertions, gate classification, and durable logging.
- [x] Add thin background calls to Claude, Codex, OpenCode, and Pi SessionStart surfaces.
- [x] Document SessionStart reconciliation and the per-concern disable flag.

### Phase 6: Final-State Verification
- [x] Validate shell and JSON syntax.
- [x] Exercise all six Git paths against a temporary bare remote and capture local/remote HEAD evidence.
- [x] Run relevant runtime tests and code-quality checks.
- [x] Finalize packet evidence, regenerate metadata, and pass strict validation with zero warnings and errors.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | Every modified shell script | `bash -n` |
| Negative control | Skill metadata gate before repair | Temporary command stubs and fixture stderr |
| Safety block | Mass-deletion gate | Temporary command stubs and threshold fixture |
| Success | Clean autosync publish | Temporary command stubs with successful push |
| Documentation | Packet consistency | `generate-context.js`, `validate.sh --strict` |
| Safety invariant | Dirty tracked primary | Local clone plus bare local remote; compare pre/post HEAD, status, bytes, and remote tip |
| Integration | Behind and ahead paths | Local clone plus bare local remote; compare local and remote tips and push count |
| Recovery | Conflicting rebase | Divergent commits to the same line; assert abort, original HEAD, clean tracked state, unchanged remote, and loud warning |
| Gating | Linked worktree and disable flag | Local linked worktree plus shared resolver environment |
| Runtime wiring | Claude/Codex JSON and OpenCode/Pi source | JSON parse plus scoped source tests/type checks where available |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Skill metadata checker | Internal | Available | Generated projection repair cannot run |
| Mass-deletion helper | Internal | Available | Destructive push simulation cannot exercise the real verdict |
| Git common-dir log contract | Internal | Available | Durable rejection evidence has no canonical sink |
| Shared hook flag resolver | Internal | Available with fail-open fallback | Master and per-concern disables cannot be resolved persistently if absent |
| Local Git executable | Test-only | Available | Six behavioral scenarios cannot run; no real remote is ever needed |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A clean autosync is misclassified, a safety gate no longer blocks, or reconciliation touches a tracked-dirty/non-primary checkout.
- **Procedure**: Set `MK_PRIMARY_RECONCILE_DISABLED=1` or `MK_LIVE_SYNC_DISABLED=1`, then restore only the scoped script and wiring through operator-controlled version history.
- **Data reversal**: Reconcile uses fast-forward or non-force rebase-and-push only. The append-only diagnostic logs are observational and need no reversal.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit and Proof Design | None | Runtime Hardening |
| Runtime Hardening | Audit and Proof Design | Documentation and Verification |
| Documentation and Verification | Runtime Hardening | None |
| Reconcile Design and Packet Reopen | Existing Work Item 1 completion | SessionStart Reconcile Implementation |
| SessionStart Reconcile Implementation | Reconcile Design and Packet Reopen | Final-State Verification |
| Final-State Verification | SessionStart Reconcile Implementation | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit and Proof Design | Medium | 45 minutes |
| Runtime Hardening | High | 90 minutes |
| Documentation and Verification | Medium | 60 minutes |
| Reconcile Design and Packet Reopen | Medium | 30 minutes |
| SessionStart Reconcile Implementation | High | 100 minutes |
| Final-State Verification | High | 75 minutes |
| **Total** | | **400 minutes across both work items** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirm clean pushes follow the original success path. [Evidence: scratch remote advanced to `4adc7fa`]
- [x] Confirm every true safety violation remains blocking. [Evidence: dirty skip, conflict abort, and `[gate:test-suites]` rejection]

### Rollback Procedure
1. Disable live-sync with `MK_LIVE_SYNC_DISABLED=1` if runtime behavior is unsafe.
2. Restore only the scoped hook and publisher files through operator-controlled history tooling.
3. Re-run the blocked and clean simulations before re-enabling live-sync.
4. Re-run all six local-remote reconcile scenarios before removing the disable flag.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. Durable logs are append-only diagnostics.

<!-- /ANCHOR:enhanced-rollback -->
