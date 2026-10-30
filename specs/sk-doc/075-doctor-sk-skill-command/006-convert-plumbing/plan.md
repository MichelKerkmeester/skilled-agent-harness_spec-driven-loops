---
title: "Implementation Plan: Phase 6: convert-plumbing"
description: "Wire the convert target of /doctor:sk-skill into the doctor plumbing: a workflow YAML modelled on doctor-ci-scaffold.yaml, a mutating route, router and presentation states, a setup row and an activated advisor bridge, proved by route-validate, run-all and phrase reach."
trigger_phrases:
  - "convert plumbing plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: convert-plumbing

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflow assets, Markdown command router, JSON contracts, Node.js tests |
| **Framework** | Doctor command family (`.skilled/commands/doctor/`) |
| **Storage** | None; backups go to the gitignored `.skilled/skills/.state/doctor-sk-skill/` |
| **Testing** | `node --test` through `run-all.sh`, `route-validate.sh`, `doctor-phrase-reach.cjs` |

### Overview
This phase adds the `convert` route to `/doctor:sk-skill` and the workflow that drives `sk-skill-convert.cjs`. The YAML prints the plan, asks once, and calls `apply` only on yes. Route validation, the doctor test suite and the phrase-reach check prove it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified: `ls .skilled/commands/doctor/scripts/sk-skill-convert.cjs` prints the path (phases 3 to 5 closed)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 and `bash .skilled/commands/doctor/scripts/tests/run-all.sh` prints every suite PASS
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Doctor route plus workflow YAML (the `/doctor:ci scaffold` shape).

### Key Components
- **`doctor-sk-skill-convert.yaml`**: phases read, refuse, plan and approval, write, re-read, undo; statuses `OK`, `CANCELLED`, `FAIL`.
- **`_routes.yaml` convert route**: `mutating: mutates`, `script_invocations` naming `sk-skill-convert.cjs`, trigger phrases the bridge deriver copies into the advisor.

### Data Flow
The router `sk-skill.md` resolves `convert` to the route, the route names the YAML, the YAML runs `sk-skill-convert.cjs plan`, renders the plan from the presentation contract, asks once, then runs `sk-skill-convert.cjs apply` and `sk-skill-check.cjs` to re-read and prints the undo list.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: this phase adds a feature route, not a fix.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `route-validate.py` | Enforces asset existence, mutation class, target parity and `script_invocations` use (`.skilled/commands/doctor/scripts/route-validate.py:12-33`) | unchanged | `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 |
| `doctor-update-contract.test.cjs` | Reads `families.doctor` (`.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs:42-46`) | unchanged | `run-all.sh` PASS |

Required inventories:
- Same-class producers: `rg -n 'mutating: mutates' .skilled/commands/doctor/_routes.yaml`.
- Consumers of changed symbols: `rg -n 'doctor-sk-skill-convert' . --glob '*.yaml' --glob '*.cjs' --glob '*.md'`.
- Matrix axes: answer (yes, no, other) by input kind (older Skilled, plain, refused).
- Algorithm invariant: no write before yes.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup confirms phases 2 to 5 landed, Implementation writes the YAML, route, states and bridge, and Verification runs route-validate, run-all, phrase reach and the manual yes and no runs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Contract test: route fields, YAML statuses, every refusal string | `node --test .skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs` |
| Integration | Route table, bridges and phrase reach | `route-validate.sh`, `derive-command-bridges.cjs`, `doctor-phrase-reach.cjs` |
| Manual | `/doctor:sk-skill convert` on a scratch skill: plan, then no, then yes | Agent runtime, scratch copy under `scratch/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-skill-convert.cjs` (phases 3 to 5) | Internal | Yellow | The route has no script to call; this phase cannot start |
| `sk-skill.md`, presentation and contract test (phase 2) | Internal | Yellow | No router to extend; this phase cannot start |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: route-validate or run-all fails after the change, or a manual run writes before yes.
- **Procedure**: Revert the phase commit, then rerun `derive-command-bridges.cjs` and the mirror sync scripts so the generated files match the reverted sources.
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
| Setup | Phases 2, 3 and 5 closed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 7 |
<!-- /ANCHOR:phase-deps -->

---

