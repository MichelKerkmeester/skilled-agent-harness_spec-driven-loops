<!-- SPECKIT_LEVEL: 3+ -->
# Phase Package Spec: Memory Quality (QP-0 through QP-4)

<!-- SPECKIT_TEMPLATE_SOURCE: phase-package-spec | v1.1 -->

---

<!-- ANCHOR:executive-summary -->
## Executive Summary

This package defines memory-generation quality controls derived from `research.md` and source analysis artifacts in `../research/`.

Primary outcome: new memory files are high-signal, actionable, and index-safe.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| Package | `003-memory-quality-qp-0-4` |
| Parent Spec | `../spec.md` |
| Research Inputs | `../research.md`, `../research/` |
| Status | Draft (planning-only) |
| Implementation Status | Not started |
| Last Updated | 2026-02-18 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:scope -->
## 2. Scope Boundaries

### In Scope
- QP-0 baseline and fixture harness.
- QP-1 post-render validator and contamination filter.
- QP-2 decision extraction and semantic backfill.
- QP-3 quality score persistence and KPI pipeline.
- QP-4 legacy remediation and re-index strategy.
- Requirement slice: `REQ-018-023`, `SC-006-SC-013`.

### Out of Scope
- Core memory-search behavioral changes owned by package 001.
- Phase 2/3 extraction and rollout engineering owned by package 002.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements-map -->
## 3. Requirement Mapping (Package Slice)

| Priority | Requirement IDs | Package Interpretation |
|----------|------------------|------------------------|
| P0 | `REQ-018-020` | Hard quality gates before indexing |
| P1 | `REQ-021-023` | Semantic quality and quality-scoring completeness |

This package operationalizes root requirements without redefining them.
<!-- /ANCHOR:requirements-map -->

---

<!-- ANCHOR:root-mapping -->
## 4. Root Mapping

| Root Artifact | Coverage in this Package |
|---------------|--------------------------|
| `../spec.md` | Research findings section and quality requirements |
| `../plan.md` | Memory quality architecture and QP sequence |
| `../tasks.md` | `TQ001-TQ047` |
| `../checklist.md` | `CHK-190-212` |
<!-- /ANCHOR:root-mapping -->

---

<!-- ANCHOR:acceptance-targets -->
## 5. Acceptance Targets

| Target | Threshold |
|--------|-----------|
| Placeholder leakage in new files | <= 2% over 14-day window |
| Generic fallback decision sentence | <= 10% |
| Contamination phrase occurrence | <= 1% |
| Empty `trigger_phrases` | <= 5% |
| Empty `key_topics` | <= 5% |
| Concrete decision coverage (eligible sessions) | >= 70% |
| Quality band A+B on new files | >= 70% |
| `quality_score` and `quality_flags` coverage | 100% |
<!-- /ANCHOR:acceptance-targets -->

---

<!-- ANCHOR:dependencies -->
## 6. Dependencies and Handoffs

- Can start in parallel with package `../001-foundation-phases-0-1-1-5/`.
- QP-4 cleanup runs after QP-2 and QP-3 stabilization.
- Provides quality-gate behavior used by package `../002-extraction-rollout-phases-2-3/` rollout confidence.
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
