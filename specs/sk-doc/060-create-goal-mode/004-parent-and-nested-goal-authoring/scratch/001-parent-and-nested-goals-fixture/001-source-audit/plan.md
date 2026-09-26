---
title: "Implementation Plan: Phase 1: source-audit"
description: "This phase inventories parent and child sources, then compares mapped phase names with direct child folders."
trigger_phrases:
  - "source audit plan"
  - "phase folder comparison"
  - "fixture audit checks"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: source-audit

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and filesystem inspection |
| **Framework** | system-spec-kit spec and goal contracts |
| **Storage** | Fixture documents on disk |
| **Testing** | Exact folder-set comparison and strict validation |

### Overview
Read the parent phase map and every child source pair. Compare sorted folder names rather than counts, then record the source set and criteria in this packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent specification and phase map are present.
- [x] All three child specifications and acceptance-criteria files are present.

### Definition of Done
- [x] The audit records the three mapped folder names.
- [x] The mapped and direct-child name sets match exactly.
- [x] Each acceptance criterion has observed line evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A read-only source audit followed by a short evidence record.

### Key Components
- **Phase map**: Supplies the canonical folder names.
- **Child source pairs**: Provide the phase-local specification and acceptance criteria.
- **Direct-child listing**: Confirms the folders present on disk.

### Data Flow
Read the map and source pairs, list direct numbered folders, compare exact names, then record the result in this packet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a documentation audit. It changes no code producer, helper, policy or consumer.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Parent phase map | Defines the planned folder set | Read only | Record all three names in `spec.md`. |
| Direct child folders | Define the on-disk folder set | Read only | List and compare exact names. |

Required inventories:
- Same-class producers: Not applicable. No code producer changes.
- Consumers of changed symbols: Not applicable. No symbols change.
- Matrix axes: Map names and direct-folder names, with three expected entries on each side.
- Algorithm invariant: The two sorted name sets must be identical.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Complete the source inventory, compare exact folder names and close the phase-local acceptance criteria. The task checklist records each result.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source review | Parent map and each child source pair | Read the fixture documents. |
| Folder comparison | Map names against direct numbered folders | `find` with a three-digit folder pattern, then compare sorted names. |
| Packet gate | Final fixture and child documents | Recursive strict `validate.sh`. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Parent specification | Internal | Available | The map cannot be audited without it. |
| Three child source pairs | Internal | Available | Phase-local goal sources would be incomplete. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A source citation is wrong or the recorded folder sets differ from disk.
- **Procedure**: Restore the original document text from the pre-write read, correct the audit record and repeat the exact-set comparison.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| source-audit | Parent spec and child source pairs | goal-authoring |
| goal-authoring | Completed source audit | binding-check |
| binding-check | Three child goals | Recursive validation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Source review | Low | 20 minutes |
| Exact-set comparison | Low | 10 minutes |
| Verification | Low | 10 minutes |
| **Total** | | **40 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes or deployment are in scope.
- [x] Original fixture documents were read before rewriting.
- [x] The write set remains inside this fixture.

### Rollback Procedure
1. Restore the original whole-file text for any document that needs reversal.
2. Rerun the exact map-to-folder comparison.
3. Rerun recursive strict validation after the fixture is restored.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable. This phase changes documentation only.
<!-- /ANCHOR:enhanced-rollback -->

---
