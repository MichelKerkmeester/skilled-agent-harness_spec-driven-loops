---
title: "Implementation Plan: Phase 8: hub-gap-report"
description: "Add a read-only --into-hub option to the sk-skill check script that fills the 11-row mode integration table from parent-skill-check, compiled-route, the router parser, the advisor and the mirror checkers, proved by a shipped-hub run and a broken fixture hub."
trigger_phrases:
  - "hub gap report plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: hub-gap-report

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS scripts |
| **Framework** | Doctor command family |
| **Storage** | None |
| **Testing** | `node --test` |

### Overview
`sk-skill-check.cjs` gains `--into-hub <hub>`, which runs the existing hub checkers and reads the ungated surfaces directly. It prints the 11-row table from `parent-skills-nested-packets.md:245-256`. Two fixture tests prove it: a shipped hub reports every applicable row present, and a fixture hub missing one mode's `routerSignals` reports row 2.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified: `ls .skilled/commands/doctor/scripts/sk-skill-check.cjs` prints the path (phase 2 closed)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` passes and `bash .skilled/commands/doctor/scripts/tests/run-all.sh` prints every suite PASS
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only report aggregator.

### Key Components
- **`sk-skill-check.cjs --into-hub`**: argument handling, row assembly, text and JSON output.
- **`lib/sk-skill-surface.cjs` hub probes**: one probe per ungated row (4, 5, 6, 7, 8, 10).

### Data Flow
The script resolves the hub folder, runs `parent-skill-check.cjs` for rows 1-3 and 9, replays a mode phrase through `compiled-route.cjs --hub` and `skill_advisor.py`, parses the root `ROUTER.md`, reads the hub JSON files, runs the mirror checkers in check mode, and prints one verdict per row.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: a new read-only report, not a fix.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `parent-skill-check.cjs` | Gates rows 1-3 and 9 | unchanged (called) | its own tests still pass in `run-all.sh` |
| Check route in `_routes.yaml` | Read-only route | update (`allowed_flags`) | `route-validate.sh` exit 0 |

Required inventories:
- Same-class producers: `rg -n "parent-skill-check.cjs" .skilled/commands/doctor`.
- Consumers of changed symbols: `rg -n "into-hub" . --glob '*.cjs' --glob '*.yaml' --glob '*.md'`.
- Matrix axes: hub (with and without `FULL_INVENTORY`) by mode class (`metadata`, `lexical`) by advisor state (up, exit 75).
- Algorithm invariant: no row is reported present without a probe that ran.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup picks the shipped hub and builds the fixture, Implementation adds the option and the plumbing, and Verification runs the tests and a read-only proof.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Row probes against fixture hubs | `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` |
| Integration | Shipped hub end to end, route plumbing | `sk-skill-check.cjs check <mode> --into-hub <hub>`, `route-validate.sh` |
| Manual | `/doctor:sk-skill check <skill> --into-hub <hub>` in an agent runtime | Agent runtime |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 check script and route | Internal | Yellow | Nothing to extend |
| Advisor backend for row 10 | Internal | Yellow | Row 10 prints UNKNOWN; the rest still runs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the option reports a row present that a manual check shows missing, or any run changes a file.
- **Procedure**: Revert the phase commit; the check target without the option is unchanged.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 2 closed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 10 |
<!-- /ANCHOR:phase-deps -->

---

