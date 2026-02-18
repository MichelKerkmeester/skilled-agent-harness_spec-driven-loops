# Tasks: Foundation Package (Phase 0, 1, 1.5)

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: phase-package-tasks | v1.1 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked by dependency |

---

## 1. Package Task Groups

### Group A - Phase 0 Prerequisites
- [ ] FDN-001 Complete hook pipeline tasks (`T000a-T000d`).
- [ ] FDN-002 Complete tokenUsage contract tasks (`T000e-T000g`).
- [ ] FDN-003 Complete evaluation bootstrap tasks (`T000h-T000k`).
- [ ] FDN-004 [B:FDN-001,FDN-002,FDN-003] Phase 0 sign-off complete (`T000l`).

### Group B - Phase 1 Core Automation
- [ ] FDN-010 Complete config and event-decay tasks (`T001-T009`).
- [ ] FDN-011 Complete session-boost tasks (`T010-T015`).
- [ ] FDN-012 Complete pressure monitor tasks (`T016-T021`).
- [ ] FDN-013 [B:FDN-010,FDN-011,FDN-012] Complete Phase 1 evaluation/sign-off (`T022-T028`).

### Group C - Phase 1.5 Hardening Gate
- [ ] FDN-020 Complete dataset expansion and rank gate tasks (`T027a-T027d`).
- [ ] FDN-021 Complete redaction calibration tasks (`T027e-T027j`).
- [ ] FDN-022 Complete session lifecycle contract tasks (`T027k-T027n`).
- [ ] FDN-023 [B:FDN-020,FDN-021,FDN-022] Complete go/no-go hard gate (`T027o`).

## 2. Handoff and Synchronization Tasks

- [ ] FDN-030 Publish handoff artifact list for package 002 (`eval-dataset-1000.json`, `phase1-5-eval-results.md`, `redaction-calibration.md`).
- [ ] FDN-031 Confirm hard-gate status and dependencies in root `../tasks.md` mapping section.
- [ ] FDN-032 Confirm package references in root `../spec.md`, `../plan.md`, and `../checklist.md` remain current.

## 3. Evidence Requirements

- [ ] FDN-E01 Correlation evidence attached (`phase1-5-eval-results.md`).
- [ ] FDN-E02 Redaction FP evidence attached (`redaction-calibration.md`).
- [ ] FDN-E03 Session lifecycle test evidence attached (integration test output).

## 4. Completion Conditions

- [ ] All `FDN-001` through `FDN-023` completed.
- [ ] All `FDN-E01` through `FDN-E03` completed.
- [ ] Hard-gate outputs available for package 002.
- [ ] Root mapping remains synchronized.

Planning-only tracking document; no implementation completion is claimed here.
