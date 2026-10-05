---
title: "Feature Specification: Bump brace-expansion in two Pi extension lockfiles to close four Dependabot alerts"
description: "Two Pi extension lockfiles pin brace-expansion 5.0.9, which carries four Dependabot alerts; this moves both to 5.0.12."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Bump brace-expansion in two Pi extension lockfiles to close four Dependabot alerts

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-05 |
| **Branch** | `scaffold/080-pi-extension-brace-expansion` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
GitHub reports four open Dependabot alerts, two high and two moderate, for `brace-expansion` 5.0.9 in the lockfiles of two Pi extensions. The fixed release is 5.0.12. Dependabot opened no pull request, and `npm update` and `npm audit fix --package-lock-only` both left the nested copy at 5.0.9.

### Purpose
Both lockfiles resolve `brace-expansion` 5.0.12, `npm audit` finds nothing in either, and the four alerts close.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Re-resolve the nested `brace-expansion` entry in both lockfiles within its existing `^5.0.8` range.
- Leave every other locked version as it is.

### Out of Scope
- Changing either `package.json` or adding an `overrides` block - the existing range already admits 5.0.12.
- Installing the extensions' dependencies to run their own suites - the operator approved a lockfile-only change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/pi-cache-optimizer/package-lock.json` | Modify | `brace-expansion` 5.0.9 to 5.0.12 |
| `.pi/extensions/pi-fast-mode-w-subagent-support/package-lock.json` | Modify | `brace-expansion` 5.0.9 to 5.0.12 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both lockfiles resolve `brace-expansion` at 5.0.12 or later | `npm audit --package-lock-only` finds 0 vulnerabilities in each extension |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | No other locked version changes | The before and after lists of package versions differ only in `brace-expansion` and the location of `balanced-match` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The four Dependabot alerts (1097, 1098, 1099, 1102) close after the push.
- **SC-002**: The packet validates strict with `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The npm registry | No re-resolve without it | None needed; it answered |
| Risk | 5.0.12 behaves differently for `minimatch` | Low | A patch release inside the declared range; the extensions' suites were not run, recorded as a limitation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


