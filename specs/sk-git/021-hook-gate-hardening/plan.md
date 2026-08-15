---
title: "Implementation Plan: git hook gate hardening"
description: "Audit all commit and push gates, add bounded skill-metadata self-heal, and make autosync rejection diagnostics loud and durable."
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
    recent_action: "Completed all implementation and verification phases"
    next_safe_action: "Review the scoped changes without running Git operations"
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
| **Language/Stack** | Bash hooks and publisher, Node.js metadata checker, Markdown references |
| **Framework** | sk-git live-sync and versioned Git hooks |
| **Storage** | Append-only `git-sync.log` under the Git common directory |
| **Testing** | `bash -n`, command stubs, captured stderr assertions, strict packet validation |

### Overview
Inventory each lifecycle gate first. Then add one exact autosync predicate shared by the pre-push decisions, use the skill metadata checker's bounded `--fix` mode only for generated drift, and re-check before allowing the push. Refactor push execution in `git-sync.sh` so stderr is captured once, classified only when a known hook signature is present, replayed to the caller, and appended to the durable outcome log.

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

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Skill metadata checker | Internal | Available | Generated projection repair cannot run |
| Mass-deletion helper | Internal | Available | Destructive push simulation cannot exercise the real verdict |
| Git common-dir log contract | Internal | Available | Durable rejection evidence has no canonical sink |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A clean autosync is misclassified or a safety gate no longer blocks.
- **Procedure**: Restore the prior hook and publisher files from the operator's external backup or version-control history. The documentation and packet can be removed independently.
- **Data reversal**: The append-only diagnostic log needs no reversal. New records are observational only.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit and Proof Design | None | Runtime Hardening |
| Runtime Hardening | Audit and Proof Design | Documentation and Verification |
| Documentation and Verification | Runtime Hardening | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit and Proof Design | Medium | 45 minutes |
| Runtime Hardening | High | 90 minutes |
| Documentation and Verification | Medium | 60 minutes |
| **Total** | | **195 minutes** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirm clean pushes follow the original success path.
- [x] Confirm every true safety violation remains blocking.

### Rollback Procedure
1. Disable live-sync with `MK_LIVE_SYNC_DISABLED=1` if runtime behavior is unsafe.
2. Restore only the scoped hook and publisher files through operator-controlled history tooling.
3. Re-run the blocked and clean simulations before re-enabling live-sync.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. Durable logs are append-only diagnostics.

<!-- /ANCHOR:enhanced-rollback -->
