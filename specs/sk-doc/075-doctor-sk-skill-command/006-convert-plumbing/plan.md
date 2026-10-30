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
- **`doctor-sk-skill-convert.yaml`**: phases read, plan, follow-ups, approval, write, re-read, undo, report; statuses `OK`, `CANCELLED`, `FAIL`, with the dry run ending `OK`.
- **`_routes.yaml` convert route**: `mutating: mutates`, `script_invocations` naming the plan, the preserve proof, the apply and the re-read, and the engine's real write set as its gate-3 location.

### Data Flow
The router `sk-skill.md` resolves `convert` to the route, the route names the YAML, the YAML runs `sk-skill-convert.cjs plan`, asks the two field follow-ups with their own yes, proves the plain-skill prose with `preserve --snapshot`, reruns the plan with the approved flags, renders that plan, asks the conversion question, runs `apply --apply` with the same flags, re-reads the converted root through `sk-skill-check.cjs`, prints the engine's undo block, and renders the result.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase also repairs the surfaces two reviews found out of line with the engine, which grew a plain-skill path, the `--description-trim` and `--allowed-tools` flags, a `preserve --snapshot` check and a printed undo block while the phase was in review.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-skill-convert.cjs` and its `lib/` | Own the conversion: plan, apply, preserve, the integration rows and the undo block | unchanged, and read as the source of truth for every code and every flag | `node .skilled/commands/doctor/scripts/sk-skill-convert.cjs` prints the usage block the workflow quotes, exit 2 |
| `doctor-sk-skill-convert.yaml` | Workflow: read, plan, follow-ups, approval, write, re-read, undo, report | rewritten in the engine's order, with the engine's write set as its mutation boundary | `node --test …/doctor-sk-skill-contract.test.cjs` 32/32 |
| `doctor-sk-skill-presentation.txt` | Plan, questions, refusals, results | the two field messages became questions, the refusal table matches the derived code list, and the results carry the engine's undo block | the contract test's code-coverage and undo assertions |
| `route-validate.py` | Enforces asset existence, mutation class, target parity and `script_invocations` use | unchanged | `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0, 51 invocations covered |
| `doctor-update-contract.test.cjs` | Reads `families.doctor` | unchanged | `run-all.sh` PASS |

Required inventories:
- Same-class producers: `rg -n 'mutating: mutates' .skilled/commands/doctor/_routes.yaml`.
- Consumers of changed symbols: `rg -n 'doctor-sk-skill-convert' . --glob '*.yaml' --glob '*.cjs' --glob '*.md'`.
- Matrix axes: answer (yes, no, other) by input kind (older Skilled converted in place, plain skill staged from an outside path, refused).
- Algorithm invariant: no write before the plan has been printed and the operator has answered yes.
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

