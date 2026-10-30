---
title: "Implementation Plan: command plumbing"
description: "Copy the read-only exemplar's router shape, declare the three mutation classes, pin them in a contract suite and regenerate every derived surface from its own script."
trigger_phrases:
  - "agents md plumbing plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: command plumbing

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown router, YAML workflows, JSON contract, Node.js `node:test` |
| **Framework** | The doctor family's own validators: route-validate, the contract test pattern, the mirror check |
| **Storage** | The route manifest and the command contract |
| **Testing** | `node:test` and the four shell validators the family already runs |

### Overview
Author the router from the shipped command templates, add the three workflows with the mutation class each one earns, then run the generators. The contract suite is written before the router so the six sections and the phrase rule fail loudly while the router is still wrong.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Both engines answer on this repository
- [ ] The exemplar router and its contract test are read, not recalled
- [ ] The six baseline commands are recorded in `scratch/baseline.txt`

### Definition of Done
- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0
- [ ] `node --test .skilled/commands/doctor/scripts/tests/doctor-agents-md-contract.test.cjs` reports `fail 0`
- [ ] Every `--check` of every generator exits 0 twice in a row
- [ ] `bash .skilled/commands/doctor/scripts/tests/run-all.sh` ends `0 failed`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One router, one manifest entry per target, generated surfaces downstream.

### Key Components
- **Router** `agents-md.md`: the six canonical sections the contract test asserts, with no presentation inline.
- **Workflows**: `check` read-only, `embed` plan-then-yes, `restore` plan-then-yes, each naming the script it invokes.
- **Generated surfaces**: the advisor blocks, the runtime mirrors and the three prompt stub sets, each from its own script.

### Data Flow
The manifest names each target and its workflow; the router routes to a target; the workflow invokes the engine; the generators read the router set and rewrite the advisor blocks, mirrors and stubs. Nothing downstream is edited by hand.
<!-- /ANCHOR:architecture -->

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
| Contract | Router sections, phrases, mutation classes, YAML fields, setup row | `node:test` |
| Validator | Route schema and cross-file parity | `route-validate.sh`, `validate-command-tree-parity.sh` |
| Manual | A bare invocation on this repository | The router itself |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Both engines | Internal | Yellow | Workflows have nothing to invoke |
| The doctor sk-skill command | Internal | Yellow | Every count shifts by one when it lands |
| Generation scripts | Internal | Green | The advisor blocks and mirrors cannot be produced |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A validator reports a route shape error, or a generated file differs after two consecutive regeneration runs.
- **Procedure**: Revert the commit; the router and its manifest entry are one unit, and the generated files come back with it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The two engines | Implementation |
| Implementation | The router and the three workflows | Verification |
| Verification | Every generator run | Child 005, which runs the end-to-end pass |
<!-- /ANCHOR:phase-deps -->

---
