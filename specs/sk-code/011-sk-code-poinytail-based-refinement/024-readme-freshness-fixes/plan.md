---
title: "Implementation Plan: README freshness fixes"
description: "Re-verify each research row, dispatch its wording fix as a literal replacement, remove doctor check 13c and its tests, then review the phase for five iterations."
trigger_phrases:
  - "readme freshness fixes plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: README freshness fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown for the READMEs; Node.js CommonJS for the doctor check |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node:test` doctor suite; a recount command per README row |

### Overview
The orchestrator reruns each research claim and writes the exact old and new text. A cli-devin builder on `deepseek-v4-1-flash-max` applies each group as literal replacements, and the orchestrator diffs every dispatch against HEAD. Check 13c goes in one dispatch: the function, its warn-only list, its call and its two tests, replaced by one test that README drift is not reported.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: wording edits plus one check removed

### Key Components
- **`checkVersionParity()`**: runs 13a and calls 13b and 13c; after the change it calls 13b only
- **`checkReadmeVersion()` and `README_VERSION_WARN_ONLY`**: removed, with no other caller

### Data Flow
`parent-skill-check.cjs <hub>` prints one PASS, WARN, FAIL or INFO line per check. With 13c gone, a hub README `version:` is read by no check, as the per-doc rule expects.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `checkReadmeVersion()` | Compares a hub README version to SKILL.md | Remove | `grep -c 13c-readme-version` on the five hub outputs prints 0 |
| `parent-skill-check-invariants.test.cjs` | Asserts 13c fails and warns | Update: assert no 13c line | The suite passes; it fails with the check restored |
| Docs naming 13c | None found | Unchanged | `grep -rn readme-version .skilled` outside the script and its test prints nothing |
| `path:line` citations into edited docs | Line anchors | Re-anchor if an edit shifts a cited line | `cite-drift-gate.mjs` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | 13c no longer reported | `parent-skill-check-invariants.test.cjs` |
| Integration | The five hubs | `parent-skill-check.cjs` before and after |
| Manual | Each README line against its source | The recount command in its ledger row |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 023 research | Internal | Done | None |
| cli-devin with `deepseek-v4-1-flash-max` | External | Available | Stop and report |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A wording fix is wrong, or the check removal hides a real defect.
- **Procedure**: Revert the commit that carries it; the README fixes and the doctor change are separate commits.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Recount every number |
| Core Implementation | Low | Five builder dispatches |
| Verification | Low | Tests, gates and a five-iteration review |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The five hubs' doctor output before the change is saved in scratch

### Rollback Procedure
1. Revert the commit that introduced the wrong change.
2. Rerun the doctor suite and the five hub checks.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A; every change is a tracked file
<!-- /ANCHOR:enhanced-rollback -->
