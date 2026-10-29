---
title: "Implementation Plan: Phase 13: mcp-tooling-routing-canon"
description: "Move the mcp-tooling hub SKILL.md to the routing canon and add code RS-005 to both routing-shape checks, so a SKILL.md without a final MACHINE ROUTER section fails --strict."
trigger_phrases:
  - "mcp tooling routing canon plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 13: mcp-tooling-routing-canon

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python 3.9, Node.js |
| **Framework** | None |
| **Storage** | None |
| **Testing** | pytest, `node --test` |

### Overview
The hub SKILL.md gets short SMART ROUTING prose and a final `## 6. MACHINE ROUTER` section that holds the compiled-routing directive, the two-axis model and the routing rule. Both routing-shape checks gain RS-005 for a missing section. The proof is the old file failing the new check and every gate passing on the new tree.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] The 38-gate set prints exit 0 for every gate
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two parallel checks

### Key Components
- **`package_skill.py`**: the Python routing-shape check that `/create:skill` and the strict package gate run.
- **`parent-skill-check.cjs` check 12b**: the JS copy that checks a hub and every packet.

### Data Flow
Each check parses the SKILL.md headings outside fences, finds the MACHINE ROUTER section, and reports one finding per broken rule. A known-debt entry can tolerate a recorded code.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `package_skill.py` and `parent-skill-check.cjs` | Produce the routing-shape findings | update | Both suites pass with an RS-005 case |
| Clean-skill test fixtures | Model a passing skill | update | sk-doc Python suite 270 passed |
| Canon docs and `/create:skill` steps | Tell authors the codes | update | `rg 'RS-001 to RS-004' .skilled` prints nothing |
| Known-debt ledger | Tolerates recorded codes | unchanged | The ledger is empty |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the before state, Implementation changes the hub and both checks, and Verification runs the suites and the gate set.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Routing-shape rules in both checks | pytest, `node --test` |
| Integration | Every hub and skill under the strict checks | the 38-gate set |
| Manual | The old hub SKILL.md under the new check | a direct `validate_routing_shape` call |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `compiled-route-manifest.cjs refresh` | Internal | Green | The route guard fails on a stale hub manifest |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: RS-005 fails a skill that should pass, or the hub routes differently.
- **Procedure**: revert the phase commit, then refresh the mcp-tooling route manifest and its twin.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closure |
<!-- /ANCHOR:phase-deps -->

---
