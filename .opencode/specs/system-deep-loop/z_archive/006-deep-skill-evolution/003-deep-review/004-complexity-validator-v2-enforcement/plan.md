---
title: "Implementation Plan: 116/004 — Validator v2 Enforcement"
description: "Level 3 plan for warnings-first validator v2 enforcement."
trigger_phrases:
  - "116 validator v2 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/003-deep-review/004-complexity-validator-v2-enforcement"
    last_updated_at: "2026-05-22T12:10:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Implemented validator v2 warnings and enforcement surface."
    next_safe_action: "Verify and handoff."
---
# Implementation Plan: 116/004 — Validator v2 Enforcement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Implement Phase D as a warnings-first validator rollout. The validator extends its result type, checks v2 state depth when the discriminator is present, and exposes advisories to the workflow while preserving legacy behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:effort -->
## 1.1 EFFORT ESTIMATE

| Area | Estimate |
|------|----------|
| Validator result and helper changes | Medium |
| Workflow warning surface | Small |
| Level 3 documentation | Medium |
| Verification | Medium |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- [x] Phase 001 research read for validator/reducer continuity.
- [x] Phase 003 state contract read for v2 field names and enums.
- [x] Target validator and workflow files read before modification.
- [x] Phase B fixtures preserved as-is.
- [ ] Targeted Vitest commands pass.
- [ ] Strict spec validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The validator remains a single post-dispatch guard. The new logic is additive:

```text
state log append
  -> existing legacy shape checks
  -> optional delta existence check
  -> v2 discriminator branch
       legacy: warning only when non-trivial
       v2 off: skip depth checks
       v2 warn: convert depth failures to advisories
       v2 strict: fail first depth violation
  -> optional code verification pass
```

Identity mismatch between state-log and delta rows is treated as transport integrity, not search-depth rollout debt, so it remains a hard validator failure.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read validator result types and current failure reasons.
- [x] Read Phase 003 schema and Phase B fixtures.
- [x] Confirm workflow YAML hard-fail handling.

### Phase 2: Result-Type Extension
- [x] Add `PostDispatchAdvisory`.
- [x] Allow success and failure results to carry `warnings`.
- [x] Keep existing result shapes backward compatible when warnings are absent.

### Phase 3: v2 Strict Checks
- [x] Detect `reviewDepthSchemaVersion === 2`.
- [x] Validate applicability, target selection, and search coverage shape.
- [x] Validate non-trivial ledger presence, evidence refs, linked findings, and active finding depth.
- [x] Validate state-log/delta iteration identity.

### Phase 4: Warning Surface
- [x] Add `DEEP_REVIEW_V2_ENFORCEMENT=warn|strict|off`.
- [x] Default to warn mode.
- [x] Wire YAML `schema_advisory` event recipe.

### Phase 5: Verification
- [ ] Run Phase B validator/reducer fixtures.
- [ ] Run legacy validator tests.
- [ ] Run prompt-pack regression tests.
- [ ] Run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command |
|-----------|-------|---------|
| Fixture | v2 validator + reducer slices | `pnpm vitest run --no-coverage review-depth-validator review-depth-reducer` |
| Regression | Existing post-dispatch behavior | `pnpm vitest run --no-coverage post-dispatch-validate` |
| Prompt | v2 prompt contract stays rendered | `pnpm vitest run --no-coverage prompt-pack` |
| Spec | Level 3 document compliance | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../004-validator-v2-enforcement --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 schema contract | Spec contract | Complete | Cannot know enum/field shape. |
| Phase B validator fixture | Test evidence | Present | Cannot prove seeded failure moved. |
| Phase 005 reducer observability | Bundled phase | In progress | Warning rollout lacks operator visibility. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert `post-dispatch-validate.ts` plus YAML advisory additions. Legacy validator behavior is isolated because warnings are optional and v2 checks only activate for `reviewDepthSchemaVersion: 2`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK PLAN

Rollback is file-scoped: restore `post-dispatch-validate.ts` and remove `warning_surface`/v2 failure reason additions from both YAML workflows. Existing review packets do not need migration because no persisted state shape is rewritten by the validator.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Setup -> Result-Type Extension -> v2 Checks -> Warning Surface -> Verification
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
001 research -> 003 schema contract -> 004 validator
                                      -> 005 reducer observability
                                      -> 006 STOP wire
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Exit Criteria |
|-----------|---------------|
| M1 Result type | Warning envelope compiles and legacy tests pass. |
| M2 v2 checks | Strict mode rejects missing/uncited/unlinked depth proof. |
| M3 Workflow | `schema_advisory` recipe exists in auto and confirm YAML. |
| M4 Verification | Fixture, regression, prompt, and spec validation commands pass. |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The critical path is the result envelope. YAML can only surface `schema_advisory` once the validator result type can carry warnings; reducer hard-fail rollout should wait until Phase 005 exposes search debt to operators.
<!-- /ANCHOR:critical-path -->
