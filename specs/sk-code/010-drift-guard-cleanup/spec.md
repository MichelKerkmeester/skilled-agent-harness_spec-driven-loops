---
title: "Feature Specification: Narrow the alignment drift guard so it skips recorded evidence and experiment fixtures"
description: "The sk-code drift-guard wrapper exits 1 because the alignment-drift verifier holds recorded spec evidence scripts and a rule-experiment fixture tree to shipped-code shebang and strict-mode rules. The verifier should stop scanning those two kinds of record instead of the records being rewritten."
trigger_phrases:
  - "drift guard cleanup"
  - "narrow the alignment drift guard so it skips"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Narrow the alignment drift guard so it skips recorded evidence and experiment fixtures

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-08 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`run-all-drift-guards.sh` exits 1 on the current tree. Its alignment-drift verifier reports 60 errors: 56 SH-SHEBANG and SH-STRICT-MODE findings in shell scripts kept as recorded evidence under `specs/**/evidence/`, and 4 PY-SHEBANG findings in the `rule-experiment-fixture/` tree that sk-create-repo-rule uses for rule experiments. Neither is shipped code, and editing the evidence would change what a packet recorded.

### Purpose
The verifier skips recorded spec evidence and experiment fixture trees, so the wrapper exits 0 while the same defect in shipped code is still reported.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A path rule in the verifier's file walk that skips a file under an `evidence` directory below a `specs` directory, and a file under a directory named `fixture` or ending in `-fixture`.
- One unit test proving both kinds are skipped while a shipped script with the same defect is still reported.

### Out of Scope
- Editing the evidence scripts or the fixture files - that would change recorded results.
- The 254 WARN findings - they do not fail the gate and are a separate cleanup.
- The plural `fixtures` directories - the verifier already downgrades those to WARN, and widening the skip to them was not needed to clear the errors.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py` | Modify | Add the skip rule to the file walk |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/test_verify_alignment_drift.py` | Modify | Add the skip test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Recorded spec evidence and fixture trees are not scanned | `run-all-drift-guards.sh` exits 0 with 0 alignment-drift errors |
| REQ-002 | Shipped code keeps its coverage | The new test shows an `evidence` folder outside `specs/` is still scanned and reported |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No evidence or fixture file changes | `git status --porcelain` lists only the verifier, its test and this packet |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The verifier test file passes, including the new skip test.
- **SC-002**: The drift-guard wrapper prints `all 2 guards PASSED` and exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The rule hides real shipped code | High | Only directory names count, the evidence rule needs a `specs` ancestor, and a survey of tracked files showed the fixture rule matches only four fixture trees |
| Risk | A folder above the checkout named `specs` would skip shipped `evidence` folders too | Low | The rule reads the path below the scan root |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator fixed the approach: narrow the guard, leave the records alone.
<!-- /ANCHOR:questions -->

---
