---
title: "Implementation Plan: Comment Hygiene Violation Fixture"
description: "Violation fixture for the comment hygiene validation rule."
trigger_phrases:
  - "comment hygiene violation fixture"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Comment Hygiene Violation Fixture

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown fixture |
| **Framework** | None |
| **Storage** | Local files |
| **Testing** | Isolated validation rule |

### Overview
The fixture intentionally carries one marker in the specification document and exercises the fail branch of the rule.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Fixture scope is documented
- [ ] Verification command is known
- [ ] Marker policy is clear

### Definition of Done
- [ ] Clean fixture passes the isolated rule
- [ ] Violation fixture fails the isolated rule
- [ ] Harness reports both expected outcomes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fixture packet

### Key Components
- **Spec document**: Carries the violation comment case
- **Rule script**: Scans authored docs for markers inside HTML comments

### Data Flow
The validation harness sources the rule script and evaluates the fixture folder.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| validation fixture | rule input | add fail case | isolated harness evidence |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Create fixture files
- [ ] Add violation comment example

### Phase 2: Core Implementation
- [ ] Register rule test line
- [ ] Keep fixture Level 1 shaped

### Phase 3: Verification
- [ ] Run isolated harness category
- [ ] Confirm violation fixture fails
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Rule script | test-validation-extended.sh |
| Manual | Fixture content | Read review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Rule harness | Internal | Present | Fixture cannot be exercised |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Isolated rule harness regresses
- **Procedure**: Restore the prior fixture files from version control
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
