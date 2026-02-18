# Tasks: Extraction and Rollout Package (Phase 2, 3)

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

### Group A - Phase 2 Extraction and Redaction
- [ ] EXR-001 Complete extraction adapter tasks (`T029-T037`).
- [ ] EXR-002 Complete calibrated redaction tasks (`T035a-T035e`).
- [ ] EXR-003 Complete causal boost tasks (`T038-T044`).
- [ ] EXR-004 [B:EXR-001,EXR-002,EXR-003] Complete prompt injection/integration tasks (`T045-T055`).

### Group B - Phase 3 Rollout
- [ ] EXR-010 Complete telemetry and logging tasks (`T056-T060`).
- [ ] EXR-011 [B:EXR-010] Complete staged rollout tasks (`T061-T066`).
- [ ] EXR-012 [B:EXR-011] Complete runbook and documentation tasks (`T067-T070`).

## 2. Dependency and Sync Tasks

- [ ] EXR-020 Confirm package 001 hard-gate completion before `EXR-001` starts.
- [ ] EXR-021 Confirm package 003 quality signals are available before full rollout.
- [ ] EXR-022 Confirm root mappings remain synchronized in `../tasks.md` and `../checklist.md`.

## 3. Evidence Requirements

- [ ] EXR-E01 Extraction metrics evidence attached (precision/recall).
- [ ] EXR-E02 Retrieval stability evidence attached (MRR comparison).
- [ ] EXR-E03 Rollout and rollback evidence attached (telemetry logs and runbook output).

## 4. Completion Conditions

- [ ] All `EXR-001` through `EXR-012` completed.
- [ ] All `EXR-E01` through `EXR-E03` completed.
- [ ] Staged rollout evidence and rollback readiness documented.
- [ ] Root mapping remains synchronized.

Planning-only tracking document; no implementation completion is claimed here.
