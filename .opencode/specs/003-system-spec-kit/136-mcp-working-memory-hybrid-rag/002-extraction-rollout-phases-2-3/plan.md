# Phase Package Plan: Extraction and Rollout (Phase 2, Phase 3)

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: phase-package-plan | v1.1 -->

---

<!-- ANCHOR:objective -->
## 1. Objective

Implement extraction and causal ranking features, then execute controlled rollout with telemetry and rollback safety.
<!-- /ANCHOR:objective -->

---

<!-- ANCHOR:quality-gates -->
## 2. Quality Gates

### Definition of Ready
- Package 001 hardening gate (`T027o`) has passed.
- Redaction calibration artifacts are available and approved.
- Root task and verification mappings are synchronized.

### Definition of Done
- Phase 2 and Phase 3 mapped tasks complete (`T029-T070`).
- Extraction precision/recall and MRR thresholds are met.
- Staged rollout evidence and rollback runbook are complete.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:execution-model -->
## 3. Execution Model

| Workstream | Root Tasks | Duration | Output |
|------------|------------|----------|--------|
| Extraction adapter | `T029-T037` | 1 week | Tool-class extraction with summarizers and hook integration |
| Redaction gate | `T035a-T035e` | 2-3 days | Calibrated PII/secret redaction with exclusion heuristics |
| Causal boost | `T038-T044` | 3-4 days | 2-hop bounded causal boost integrated into search |
| Prompt injection and integration | `T045-T055` | 4-5 days | End-to-end extraction-to-search pipeline validated |
| Telemetry and rollout | `T056-T070` | 1 week | Dark launch, staged enablement, runbook, docs |
<!-- /ANCHOR:execution-model -->

---

<!-- ANCHOR:milestones -->
## 4. Milestones

| Milestone | Exit Criteria |
|-----------|---------------|
| EXR-M2 | `T055` complete and Phase 2 sign-off done |
| EXR-M3 | `T070` complete and staged rollout evidence captured |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:risk-register -->
## 5. Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Extraction noise overfills working memory | Degraded retrieval quality | Precision/recall gates and bounded attention scores |
| Redaction strips useful git context | Missing operational signals | Enforce SHA/UUID exclusions from hardening calibration |
| Causal traversal cost grows unexpectedly | Search latency regression | Bound traversal to 2 hops and enforce p95 checks |
| Rollout regressions | User-facing instability | Feature flags, dark launch, staged percentages, rollback runbook |
<!-- /ANCHOR:risk-register -->

---

<!-- ANCHOR:dependencies -->
## 6. Dependencies

- Requires package `../001-foundation-phases-0-1-1-5/` hard-gate success.
- Ownership lock: `REQ-014` and `REQ-017` are accepted in package 001; this package consumes hook and calibration outputs without duplicating ownership.
- Requires root phase alignment in `../plan.md` and `../tasks.md`.
- Consumes quality-gate outputs from package `../003-memory-quality-qp-0-4/` when available.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:governance -->
## 7. Governance Notes

- Level 3+ package planning is maintained here.
- `decision-record.md` remains root-only at `../decision-record.md`.
- `implementation-summary.md` is intentionally absent until implementation work exists.
<!-- /ANCHOR:governance -->

---

<!-- ANCHOR:status -->
## 8. Planning Status

Planning-only package. No implementation has started.
<!-- /ANCHOR:status -->
