# Tasks: Memory Quality Package (QP-0 to QP-4)

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

### Group A - Baseline Harness (QP-0)
- [ ] MQ-001 Complete fixture baseline tasks (`TQ001-TQ005`).

### Group B - Validator and Contamination (QP-1)
- [ ] MQ-010 Complete post-render validator tasks (`TQ010-TQ011`, `TQ013`, `TQ015`).
- [ ] MQ-011 Complete contamination filter tasks (`TQ012`, `TQ014`).

### Group C - Decision and Semantic Quality (QP-2)
- [ ] MQ-020 Complete decision extraction tasks (`TQ020-TQ021`, `TQ025`).
- [ ] MQ-021 Complete semantic backfill tasks (`TQ022-TQ023`, `TQ026`).
- [ ] MQ-022 Complete placeholder suppression tasks (`TQ024`, `TQ027`, `TQ028`).

### Group D - Quality Score and KPIs (QP-3)
- [ ] MQ-030 Complete quality scoring tasks (`TQ030-TQ034`).
- [ ] MQ-031 Complete KPI automation task (`TQ035`).

### Group E - Legacy Remediation (QP-4)
- [ ] MQ-040 [B:MQ-031] Complete active-tier remediation tasks (`TQ040-TQ046`).
- [ ] MQ-041 [B:MQ-040] Complete archive-tier handling task (`TQ047`).

## 2. Evidence Requirements

- [ ] MQ-E01 Quality gate test evidence attached (known-bad fail / known-good pass).
- [ ] MQ-E02 KPI 14-day evidence attached for `SC-006-SC-013`.
- [ ] MQ-E03 Legacy remediation before/after retrieval comparison attached.

## 3. Completion Conditions

- [ ] All package tasks `MQ-001` through `MQ-041` completed.
- [ ] All evidence tasks `MQ-E01` through `MQ-E03` completed.
- [ ] Root KPI targets for `SC-006` through `SC-013` are measurable and traceable.
- [ ] Root mapping remains synchronized.

Planning-only tracking document; no implementation completion is claimed here.
