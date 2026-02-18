<!-- SPECKIT_LEVEL: 3+ -->
# Phase Package Spec: Foundation (Phase 0, Phase 1, Phase 1.5)

<!-- SPECKIT_TEMPLATE_SOURCE: phase-package-spec | v1.1 -->

---

<!-- ANCHOR:executive-summary -->
## Executive Summary

This package defines the foundation and hardening work required before extraction/rollout implementation begins. It covers prerequisite infrastructure, core cognitive automation, and hard-gate validation.

Primary outcome: produce reliable go/no-go artifacts for Phase 2.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| Package | `001-foundation-phases-0-1-1-5` |
| Parent Spec | `../spec.md` |
| Parent Plan | `../plan.md` |
| Status | Draft (planning-only) |
| Implementation Status | Not started |
| Last Updated | 2026-02-18 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:scope -->
## 2. Scope Boundaries

### In Scope
- Phase 0 prerequisites and sign-off (`T000a-T000l`, `CHK-125-129`).
- Phase 1 core automation and indicative validation (`T001-T028`, `CHK-130-139`).
- Phase 1.5 hardening gate (`T027a-T027o`, `CHK-155-159b`).
- Requirement slice: `REQ-001-006`, `REQ-009-012`, `REQ-014-017`.

### Out of Scope
- Phase 2 extraction and causal boost implementation.
- Phase 3 rollout and user telemetry rollout controls.
- QP memory-quality stream (`TQ001-TQ047`) except explicit dependency notes.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements-map -->
## 3. Requirement Mapping (Package Slice)

| Priority | Requirement IDs | Package Interpretation |
|----------|------------------|------------------------|
| P0 | `REQ-001-005`, `REQ-011-012`, `REQ-016-017` | Must pass before Phase 2 can start |
| P1 | `REQ-006`, `REQ-009-010`, `REQ-014-015` | Required unless user-approved deferral |

This package does not redefine requirements; it scopes root requirements to foundation execution.
<!-- /ANCHOR:requirements-map -->

---

<!-- ANCHOR:root-mapping -->
## 4. Root Mapping

| Root Artifact | Coverage in this Package |
|---------------|--------------------------|
| `../spec.md` | Scope sections + requirement subset above |
| `../plan.md` | Foundation architecture and hard-gate flow |
| `../tasks.md` | `T000a-T028`, `T027a-T027o` |
| `../checklist.md` | `CHK-125-139`, `CHK-155-159b` |
<!-- /ANCHOR:root-mapping -->

---

<!-- ANCHOR:acceptance-targets -->
## 5. Acceptance Targets

| Target | Threshold |
|--------|-----------|
| Phase 0 dataset bootstrap | 100 real queries with baseline + coverage sanity checks |
| Hardening dataset expansion | 1000-query set complete before Phase 2 |
| Rank stability gate | Spearman correlation >= 0.90 on 1000-query eval |
| Redaction calibration gate | False-positive rate <= 15% on 50 real Bash outputs |
| Session lifecycle contract | New-session reset and resume-counter behavior verified by integration test |
<!-- /ANCHOR:acceptance-targets -->

---

<!-- ANCHOR:dependencies -->
## 6. Dependencies and Handoffs

- Blocks `../002-extraction-rollout-phases-2-3/` until `T027o` go/no-go passes.
- Provides hardened input artifacts:
  - `../scratch/eval-dataset-1000.json`
  - `../scratch/phase1-5-eval-results.md`
  - `../scratch/redaction-calibration.md`
- Runs in parallel with package `../003-memory-quality-qp-0-4/` where no hardening dependency exists.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:governance -->
## 7. Governance (Level 3+ Package Rules)

- This package is Level 3+ planning documentation.
- `decision-record.md` is intentionally not present in this package; canonical ADRs remain at `../decision-record.md`.
- `implementation-summary.md` is intentionally not present in this package; implementation has not started.
- Root documents remain source-of-truth for completion claims.
<!-- /ANCHOR:governance -->

---

<!-- ANCHOR:status -->
## 8. Status Statement

Planning-only package. No implementation tasks are marked complete in this file set.
<!-- /ANCHOR:status -->
