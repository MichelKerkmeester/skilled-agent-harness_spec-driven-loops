<!-- SPECKIT_LEVEL: 3+ -->
# Phase Package Spec: Extraction and Rollout (Phase 2, Phase 3)

<!-- SPECKIT_TEMPLATE_SOURCE: phase-package-spec | v1.1 -->

---

<!-- ANCHOR:executive-summary -->
## Executive Summary

This package defines extraction, redaction, causal boost, and rollout operations after foundation hard-gates pass.

Primary outcome: safe production rollout with measurable retrieval and stability improvements.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| Package | `002-extraction-rollout-phases-2-3` |
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
- Phase 2 extraction adapter, redaction gate, causal boost, and prompt injection (`T029-T055`).
- Phase 3 telemetry, rollout, and operations runbook (`T056-T070`).
- Requirement slice: `REQ-007-010`, `REQ-013-014`, `REQ-017`.

### Out of Scope
- Foundation/hardening prerequisites from package 001.
- QP memory-quality engineering from package 003.
- Phase 3+ architectural expansion deferred in root spec.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements-map -->
## 3. Requirement Mapping (Package Slice)

| Priority | Requirement IDs | Package Interpretation |
|----------|------------------|------------------------|
| P0 | `REQ-007`, `REQ-008`, `REQ-010`, `REQ-013-014`, `REQ-017` | Must pass for extraction and rollout readiness |
| P1 | `REQ-009` | Evaluation and stability checks required unless deferred |

This package uses the canonical requirements from root docs and scopes execution only.
<!-- /ANCHOR:requirements-map -->

---

<!-- ANCHOR:root-mapping -->
## 4. Root Mapping

| Root Artifact | Coverage in this Package |
|---------------|--------------------------|
| `../spec.md` | Phase 2 and Phase 3 scope sections |
| `../plan.md` | Extraction architecture and rollout sequencing |
| `../tasks.md` | `T029-T070` |
| `../checklist.md` | `CHK-140-166` |
<!-- /ANCHOR:root-mapping -->

---

<!-- ANCHOR:acceptance-targets -->
## 5. Acceptance Targets

| Target | Threshold |
|--------|-----------|
| Extraction precision | >= 85% |
| Extraction recall | >= 70% |
| Top-5 retrieval stability | MRR >= 0.95x baseline |
| Manual save reduction | <= 40% of baseline |
| Rollout sequence | 10% -> 50% -> 100% with monitoring windows |
<!-- /ANCHOR:acceptance-targets -->

---

<!-- ANCHOR:dependencies -->
## 6. Dependencies and Handoffs

- Hard dependency: package `../001-foundation-phases-0-1-1-5/` must pass `T027o`.
- Soft dependency: package `../003-memory-quality-qp-0-4/` quality filtering should be available before full rollout.
- Produces rollout artifacts consumed by root completion checks: telemetry outputs, runbook evidence, rollout logs.
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
