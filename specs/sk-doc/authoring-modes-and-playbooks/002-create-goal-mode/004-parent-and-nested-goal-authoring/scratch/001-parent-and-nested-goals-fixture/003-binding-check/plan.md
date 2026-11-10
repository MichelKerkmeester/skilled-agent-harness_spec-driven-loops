---
title: "Implementation Plan: Phase 3: binding-check"
description: "This phase compares the parent map, direct child folders and binding targets, then runs the recursive strict gate."
trigger_phrases:
  - "parent binding plan"
  - "map disk goal comparison"
  - "recursive validation plan"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: binding-check

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and filesystem inspection |
| **Framework** | system-spec-kit goal and validation contracts |
| **Storage** | Parent packet and three direct child folders |
| **Testing** | Exact name-set comparison and recursive strict validation |

### Overview
Compare the phase map, direct numbered directories and parent binding targets by exact folder name. Confirm all child goal paths, refresh metadata and run the recursive strict gate from the workspace root.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 1 records the expected map and disk names.
- [x] Phase 2 has authored all three child goals.

### Definition of Done
- [x] Parent goal has exactly three child targets.
- [x] Map, direct folder and binding-target sets match.
- [x] Recursive strict validation prints `RESULT: PASSED` with no sufficiency finding.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A three-way consistency check followed by the authoritative recursive packet gate.

### Key Components
- **Phase map**: The parent specification's complete mapped folder set.
- **Direct folders**: Every numbered child directory on disk.
- **Binding table**: The parent goal's relative child-goal paths.

### Data Flow
Read the map, list direct children and extract binding targets. Compare all three exact sets, confirm each target exists, then validate the final fixture recursively.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a documentation verification phase. It changes no code producer, helper, policy or consumer.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Parent map | Defines planned phase folders | Read only | Compare exact folder names. |
| Direct child folders | Define the on-disk phase set | Read only | List every numbered directory. |
| Parent goal | Binds children to their goal documents | Modify | Check exactly three backticked targets. |

Required inventories:
- Same-class producers: Not applicable. No code producer changes.
- Consumers of changed symbols: Not applicable. No symbols change.
- Matrix axes: Map names, direct folder names and binding target names.
- Algorithm invariant: All three sorted name sets are identical and contain three entries.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Finish the parent binding, verify every target and run the recursive strict validator. Record the observed final result in this packet's verification evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Set comparison | Map, direct folders and binding targets | `find`, parent `spec.md` and parent `goal.md`. |
| Target check | Three relative child goal paths | Confirm each target file exists. |
| Packet gate | Parent and all three children | `bash .../validate.sh <fixture> --recursive --strict`. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Three child goals | Internal | Available | Parent targets cannot be confirmed. |
| Generated metadata | Internal | Refresh required | Strict validation may inspect stale derived fields. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The three sets differ or the recursive validator reports an error.
- **Procedure**: Restore the original whole-file text from the pre-write read, correct only the fixture document that caused the mismatch and rerun metadata refresh plus the full validator.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| source-audit | Parent map and child source pairs | goal-authoring |
| goal-authoring | Three child goals | binding-check |
| binding-check | Parent binding and refreshed metadata | Recursive validation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Parent binding | Low | 15 minutes |
| Set comparison | Low | 10 minutes |
| Recursive verification | Low | 15 minutes |
| **Total** | | **40 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes or deployment are in scope.
- [x] Original parent goal and fixture sources were read before rewriting.
- [x] The write set remains inside this fixture.

### Rollback Procedure
1. Restore the original whole-file text for any document that needs reversal.
2. Recheck the map, direct folders and binding targets by exact name.
3. Refresh metadata and rerun recursive strict validation.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable. This phase changes documentation only.
<!-- /ANCHOR:enhanced-rollback -->

---
