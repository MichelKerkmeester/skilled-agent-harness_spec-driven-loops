---
title: "Feature Specification: Build: improve the Jev reviewer verdict fallback (025)"
description: "Reviewers emit a verdict the parser cannot miss, the parser reads the common real forms, and the fallback can abstain."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Build: improve the Jev reviewer verdict fallback (025)

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `scaffold/006-verdict-fallback-improvements` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 12 |
| **Predecessor** | 005-hallucination-grader-improvements |
| **Successor** | 007-clarify-default-improvements |
| **Handoff Criteria** | Every completion criterion in `goal.md` is checked with evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Build the recommendations from 048's research for each kept Jev feature, and fix the deep-research workflow faults found while running it specification.

**Scope Boundary**: The recommendations listed in scope below, from `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/006-verdict-fallback-research/research/research.md`. Corpus, label and default-on work stays out.

**Dependencies**:
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/006-verdict-fallback-research/research/research.md` ranks the recommendations

**Deliverables**:
- Have the reviewer emit a typed verdict field, and keep the parser strict
- Widen the regex for bold, heading and qualified verdict forms
- Serve one call per miss and keep three orders for audits

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Feature 025 scored 24 of 24, but on reports written so the regex misses them. The shipped `extractVerdict` misses plausible real forms such as `**VERDICT: FAIL**` and `Final verdict: pass`, the fallback must pick one of three verdicts even when the text decides nothing, and the report lacks instrument identity.

### Purpose
Reviewers emit a verdict the parser cannot miss, the parser reads the common real forms, and the fallback can abstain.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R3: Have the reviewer emit a typed verdict field, and keep the parser strict
- R4: Widen the regex for bold, heading and qualified verdict forms
- R5: Serve one call per miss and keep three orders for audits
- R6: Add an abstain outcome and fail closed on unknown
- R7: Extend the report with commit, scorer version, usage tokens, intervals and per-class confusion
- R8: Add `jev` as an opt-in grader with miss-case fixtures in `reviewer-regression`

### Out of Scope
- R1 capturing real reviewer outputs - needs a capture run across real reviews, a later phase
- R2 two-reader labels - new labels, per 003 D4
- R9 residue severity reuse - another owner

### Files to Change

| File Path | Change Type | Description |
| ----------- | ------------- | ------------- |
| `.skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md` | Modify | Typed verdict field |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs` | Modify | Wider verdict regex and the typed field |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs` | Modify | One-call serving, abstain outcome, report identity |
| `.skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/reviewer-regression.json` | Modify | Opt-in `jev` grader and miss-case fixtures |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/verdict-fallback.vitest.ts` | Modify | Cases for each new behavior |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-001 | `extractVerdict` reads `**VERDICT: FAIL**`, `Verdict: **FAIL**`, `# VERDICT: FAIL`, `Final verdict: pass` and `Verdict: FAIL (stale evidence)`. | A test asserts each form. |
| REQ-002 | The fallback can return abstain, and an unknown answer fails closed. | A test with no-decision text asserts abstain. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-003 | The reviewer schema carries a typed verdict field the parser reads first. | A test with the field set asserts it wins. |
| REQ-004 | The report carries commit, scorer version, usage tokens, intervals and per-class confusion. | A test asserts each field. |
| REQ-005 | `reviewer-regression` runs `jev` as an opt-in grader on miss-case fixtures. | The profile lists it and a dry run reads the fixtures. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The five plausible forms no longer miss
- **SC-002**: No-decision text is never forced into a verdict
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
| ------ | ------ | -------- | ------------ |
| Risk | A wider regex reads a mention or an example as the verdict | Med | Anchor each form to its own line and test negatives |
| Dependency | `jev auth status` for the re-measure | Re-measure cannot run | Record the skip in the log; the code changes still close |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The scope follows 048's ranked table.
<!-- /ANCHOR:questions -->

---


