---
title: "Tasks: Post-019 Feature-Catalog Accuracy Remediation"
description: "Owner-scoped correction and verification tasks for ten sealed catalog findings."
trigger_phrases:
  - "feature catalog remediation tasks"
  - "catalog finding closure"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/016-documentation-quality-program/012-fix-post-019-alignment-p1-findings-for-feature-catalog-accuracy"
    last_updated_at: "2026-07-25T13:29:20Z"
    last_updated_by: "opencode"
    recent_action: "Completed and validated all catalog corrections."
    next_safe_action: "None; all required checks pass."
    blockers: []
    key_files: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Post-019 Feature-Catalog Accuracy Remediation

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description [EVIDENCE: command or file]`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm all ten findings against current repository sources. [EVIDENCE: sealed `alignment-report.md` re-probed against the live tree]
- [x] T002 Map each finding to its owner catalog and authority file. [EVIDENCE: `spec.md` requirements table]
- [x] T003 Define runtime/config files as read-only authorities. [EVIDENCE: `plan.md` affected-surfaces table]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Correct CLI executor packet-count claims. [EVIDENCE: both CLI catalogs match the four entries in `mode-registry.json`.]
- [x] T005 Correct Cursor hook status and replace phase/spec authority. [EVIDENCE: `.cursor/hooks.json` and durable playbook/test anchors]
- [x] T006 Correct `sk-code` workflow-doctrine paths. [EVIDENCE: three hyphenated workflow files exist]
- [x] T007 Reconcile interface command parity wording and metadata. [EVIDENCE: `design-command-surface-check.mjs` reports `STATUS=VALID`, drift=0]
- [x] T008 Replace the manager-shell validation anchor. [EVIDENCE: `verifier-cadence-pause.md` contains explicit PASS/FAIL criteria]
- [x] T009 Correct both styles-backend capability leaves. [EVIDENCE: 20/20 engine tests and 73/73 database tests pass at the corrected paths]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Probe all changed source and validation paths. [EVIDENCE: source-path probe resolved 24/24 paths.]
- [x] T011 Run feature-catalog and design command validators. [EVIDENCE: seven catalog validators pass; `design-command-surface-check.mjs` reports invalid=0 and drift=0.]
- [x] T012 Run strict packet validation. [EVIDENCE: `validate.sh --strict` reports 0 errors and 0 warnings.]
- [x] T013 Reconcile checklist and implementation evidence. [EVIDENCE: `checklist.md` and `implementation-summary.md` record the final command results.]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All ten report findings have verified corrections. [EVIDENCE: T004-T009 cover 10/10 findings.]
- [x] No behavior/config source changed. [EVIDENCE: `git diff --name-only` contains only catalogs, descriptive metadata, and packet docs.]
- [x] All required checks exit 0. [EVIDENCE: seven catalog validators, command parity, and `validate.sh --strict` pass.]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification**: `checklist.md`
<!-- /ANCHOR:cross-refs -->
