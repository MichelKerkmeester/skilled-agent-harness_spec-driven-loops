# Phase Package Plan: Foundation (Phase 0, Phase 1, Phase 1.5)

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: phase-package-plan | v1.1 -->

---

<!-- ANCHOR:objective -->
## 1. Objective

Deliver prerequisite and hardening infrastructure that enables safe start of Phase 2 extraction work.
<!-- /ANCHOR:objective -->

---

<!-- ANCHOR:quality-gates -->
## 2. Quality Gates

### Definition of Ready
- Root mapping to `T000a-T028` and `T027a-T027o` confirmed.
- Dataset strategy confirmed (100-query bootstrap, 1000-query hardening).
- Token-usage three-tier contract accepted.
- Session lifecycle contract scope confirmed.

### Definition of Done
- `T000l` and `T027o` complete.
- Hard gates pass: correlation >= 0.90 and redaction FP <= 15%.
- Handoff artifacts published to `../scratch/` for package 002.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:execution-model -->
## 3. Execution Model

| Workstream | Root Tasks | Duration | Output |
|------------|------------|----------|--------|
| Hook pipeline | `T000a-T000d` | 2-3 days | Non-blocking post-dispatch callback pipeline |
| tokenUsage contract | `T000e-T000g` | 1-2 days | Three-tier fallback contract and tests |
| Phase 0 dataset bootstrap | `T000h-T000k` | 1 day | `eval-dataset-100.json` with baseline capture |
| Core automation | `T001-T028` | 1-2 weeks | Event decay, session boost, pressure policy |
| Hardening gate | `T027a-T027o` | 4-5 days | 1000-query eval, redaction calibration, go/no-go |
<!-- /ANCHOR:execution-model -->

---

<!-- ANCHOR:milestones -->
## 4. Milestones

| Milestone | Exit Criteria |
|-----------|---------------|
| FDN-M0 | `T000l` complete (Phase 0 sign-off) |
| FDN-M1 | `T028` complete with Phase 1 dark launch |
| FDN-M1.5 | `T027o` complete; all hard gates passed for Phase 2 handoff |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:risk-register -->
## 5. Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Dataset quality too weak in Phase 0 | Misleading Phase 1 confidence | Treat 100-query set as indicative only; enforce 1000-query hard gate |
| tokenUsage often absent from callers | Pressure policy under-activation | Three-tier fallback + explicit WARN when inactive |
| Redaction false positives | Loss of useful git/runtime context | Calibrate on 50 outputs + SHA/UUID exclusions before Phase 2 |
| Session lifecycle ambiguity | Wrong decay/boost behavior on resume | Contract + integration test in `T027k-T027n` |
<!-- /ANCHOR:risk-register -->

---

<!-- ANCHOR:dependencies -->
## 6. Dependencies and Handoff

- Consumes canonical requirements and acceptance criteria from `../spec.md`.
- Primary ownership in overlap set: this package owns acceptance for `REQ-014` and `REQ-017`; package 002 consumes these outputs.
- On completion, unlocks package `../002-extraction-rollout-phases-2-3/`.
- Handoff bundle:
  - `../scratch/eval-dataset-1000.json`
  - `../scratch/phase1-5-eval-results.md`
  - `../scratch/redaction-calibration.md`
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
