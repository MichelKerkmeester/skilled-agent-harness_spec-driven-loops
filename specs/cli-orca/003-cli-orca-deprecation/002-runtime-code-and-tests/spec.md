---
title: "Feature Specification: Phase 2: runtime-code-and-tests"
description: "Remove cli-orca from the advisor scorer comment, two advisor tests, the skill-root metadata contract test and its reference."
trigger_phrases:
  - "cli orca removal runtime code"
  - "cli orca removal tests"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: runtime-code-and-tests

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-24 |
| **Branch** | `worktrees/534-deprecate-cli-orca` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-inventory-and-baseline |
| **Successor** | 003-docs-registries-and-skill-removal |
| **Handoff Criteria** | Touched suites match their baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Deprecate and remove the cli-orca skill specification.

**Scope Boundary**: The advisor scorer comment, two advisor test files, the skill-root metadata contract test and the class table in its reference doc.

**Dependencies**:
- Phase 1 manifest section 2

**Deliverables**:
- Five files that no longer name cli-orca
- Advisor tests at their baseline
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor test suite builds a synthetic `cli-orca` projection and lists `cli-orca` as an example skill name, and the metadata contract test expects a `cli-orca` root. Once the skill is gone, the contract test fails and the examples point at a skill that does not exist.

### Purpose
Make the code and tests independent of cli-orca without changing what they test.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
npx vitest run tests/scorer/route-gates.vitest.ts tests/legacy/advisor-prompt-policy.vitest.ts
before: Tests 58 passed (58); after: Tests 58 passed (58)
rg -n -i orca on the three advisor files: before 6 lines, after none
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reword the scorer comment so its example is generic
- Replace the synthetic `cli-orca` projection with `cli-widget`
- Swap `cli-orca` for `cli-classifier` in the explicit-name example list
- Drop `cli-orca` from the metadata contract class map and its reference table

### Out of Scope
- The scorer logic in `promptMentionsSkill` - the branch still applies to `cli-classifier` and `cli-external-orchestration`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modify | Comment example |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/route-gates.vitest.ts` | Modify | Synthetic cli skill |
| `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-prompt-policy.vitest.ts` | Modify | Example name list |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs` | Modify | Class map |
| `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` | Modify | Class S row, 6 to 5 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No file in this phase names cli-orca |
| REQ-002 | The two advisor test files pass as they did at baseline |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The metadata contract test passes once the skill folder is gone |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n -i orca` over the five files prints nothing
- **SC-002**: The two advisor test files report 58 passed
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DeepSeek Flash dispatch through cli-opencode | Edits do not land | Diff every return and rerun the tests before the next dispatch |
| Risk | The synthetic skill stops testing the tool-name branch | Low | `cli-widget` keeps the `cli-` prefix and the `cli` family, so the same branch runs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A: this phase removes code and documentation and runs no service, so it sets no performance, security or uptime target.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a prompt that names no tool keeps the read-only floor, as the existing negative test asserts.
- Maximum input: the class map keeps 14 roots.
- Failure path: the contract test fails until phase 3 deletes the folder, which is expected.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | 5 file groups |
| Risk | 4/25 | Removal only; git restores every path |
| Research | 3/20 | Inventory and tool lookup |
| **Total** | **12/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose full removal on 2026-11-24.
<!-- /ANCHOR:questions -->

---
