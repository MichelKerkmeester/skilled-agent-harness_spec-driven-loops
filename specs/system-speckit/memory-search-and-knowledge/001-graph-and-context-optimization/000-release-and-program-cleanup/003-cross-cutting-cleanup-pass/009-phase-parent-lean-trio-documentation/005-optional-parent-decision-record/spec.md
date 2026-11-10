---
title: "Feature Specification: Phase 5: optional-parent-decision-record"
description: "Let a phase parent carry an optional decision-record.md for decisions that span its phases, so an operator's cross-phase answers have one recorded home. Two reference lines change; the validator already accepts the file."
trigger_phrases:
  - "optional parent decision record"
  - "phase 5 optional parent decision record"
  - "parent decision record"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: optional-parent-decision-record

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-01 |
| **Branch** | `scaffold/005-optional-parent-decision-record` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-legacy-phase-parent-migration |
| **Successor** | None |
| **Handoff Criteria** | Phase 4 (`004-legacy-phase-parent-migration`) validates on its own, and this phase's two reference edits are in place with every content rule passing under `validate.sh --strict` on this child and on the parent folder. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Phase Parent Documentation specification.

**Scope Boundary**: Two reference lines: the parent-structure paragraph in `phase-definitions.md` and the Phase Parent row in `validation-rules.md`. No validator code, template or other phase-parent document changes.

**Dependencies**:
- Phase 4 (`004-legacy-phase-parent-migration`) shipped, so the lean-trio policy this phase amends is already applied across the repo.

**Deliverables**:
- A parent-structure rule that allows an optional parent `decision-record.md` for decisions that span the phases.
- A validation reference row that names the same exception.
- This packet's four Level 1 docs recording the reasoning and the evidence.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two reference documents told readers that a phase parent may never carry a decision record. `phase-definitions.md` line 142 said a parent's heavy docs, `decision-record.md` included, "live exclusively in the phase children", and `validation-rules.md` line 208 said "(lean trio only; heavy docs live in phase children)". A real multi-phase conversion needed exactly that file at the root. The operator asked that every structured question and answer be recorded in a decision record and said "It may live in root too", so `barter/ai-speckit/specs/barter-framework/001-coder-skilled-v4-conversion` now carries a root `decision-record.md` logging 38 questions. Some answers span phases, such as phase releases and the executor switch, so no single child owns them.

### Purpose
Let a phase parent carry an optional `decision-record.md` for decisions that span its phases, so a cross-phase answer has a recorded home while the lean trio stays the required parent minimum.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh --strict --recursive <barter-framework>/001-coder-skilled-v4-conversion
RESULT: PASSED
```

That recursive run covered the Barter parent and its 10 children with the root `decision-record.md` present, and printed `RESULT: PASSED` 11 times. The validator already accepted the file; only the two reference lines disagreed, so this phase changes documentation and no executable rule.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the parent-structure paragraph in `phase-definitions.md` so heavy docs live in the phase children while one optional exception allows a parent `decision-record.md` for decisions that span the phases.
- Align the Phase Parent row in `validation-rules.md` with the same optional exception.
- Record the problem, the approach and the evidence in this packet's four Level 1 docs.

### Out of Scope
- Validator code - `validate.sh --strict` already accepts a root `decision-record.md`, as the 11 passing runs above show.
- Templates - no template requires the file and none gains it.
- Any other phase-parent document - a parent `plan.md`, `tasks.md`, `acceptance-criteria.md` or `implementation-summary.md` keeps the lean-trio rule unchanged.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md` | Modify | Parent-structure paragraph allows an optional parent `decision-record.md` for decisions that span the phases |
| `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` | Modify | Phase Parent row names the same optional exception |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `phase-definitions.md` states that a parent may carry an optional `decision-record.md` for decisions that span its phases | `sed -n '142p' .skilled/skills/system-spec-kit/references/structure/phase-definitions.md` prints "One exception is optional: a parent may carry a `decision-record.md`" and no longer prints "live exclusively in the phase children" |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The Phase Parent row in `validation-rules.md` names the exception | `sed -n '208p' .skilled/skills/system-spec-kit/references/validation/validation-rules.md` prints "except an optional `decision-record.md` for decisions that span the phases" |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git diff --numstat -- <the two reference files>` prints `1\t1` before each path and names no third path.
- **SC-002**: `validate.sh --strict` on this child folder reports no content-rule error; the only remaining errors are `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT`, and both need `repair-derived.cjs --apply`, which writes `description.json` and `graph-metadata.json` outside this packet's scope.
- **SC-003**: `validate.sh --strict` on `../` reports no content-rule error; its only remaining error is `GENERATED_METADATA_INTEGRITY` on the parent's `graph-metadata.json`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `validate.sh --strict` tolerance for a root `decision-record.md` | If the validator rejected the file, the two lines would describe an unsupported shape | Measured before the edit: the Barter packet printed `RESULT: PASSED` 11 times with the file present, so no code change is needed |
| Risk | A parent `decision-record.md` drifts stale as phases execute | Low | Keep it optional and limit it to decisions that span phases, whose owner no child can be; the parent `spec.md` stays the one authored manifest document |
| Risk | Generated metadata lags the filled docs, so `--strict` keeps failing on `GENERATED_METADATA_*` | Low | Run `repair-derived.cjs --apply` with the next save; it owns `description.json` and `graph-metadata.json`, and every content rule already passes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The two reference lines are the whole change, and the validator already accepts the shape they describe.
<!-- /ANCHOR:questions -->

---
