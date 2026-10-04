---
title: "Implementation Plan: Phase 8: doctor-ownership-split"
description: "Give every doctor route an owning command so one manifest serves four routers, move eight targets out of /doctor:speckit, replace /doctor:rebuild with an advisor-owned rebuild, and repoint every reference."
trigger_phrases:
  - "doctor ownership split plan"
  - "doctor route command owner"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: doctor-ownership-split

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown routers, YAML workflows, Python route validator, Bash and Node tests |
| **Framework** | The sk-create-command router contract |
| **Storage** | The advisor's `skill-graph.sqlite` (rebuilt, never schema-changed) |
| **Testing** | `route-validate.sh` and its test, the doctor `run-all.sh`, the advisor route contract test, the command-router generator |

### Overview
Keep one route manifest and add a `command` owner to each route, so the validator can check each router and presentation against its own routes. Move the advisor, deep-loop and mirror targets behind new routers, add an advisor-owned rebuild workflow, then delete the retired surfaces and repoint every reference found by a repository-wide search.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin routers over a shared route manifest: each router owns argument parsing and asset routing, each workflow owns behaviour, each presentation owns visible text.

### Key Components
- **`_routes.yaml`**: One manifest; every route names the command that owns it
- **`route-validate.py`**: Checks each route against its own router and presentation (rules B3 and J1)
- **`doctor-skill-advisor-rebuild.yaml`**: The advisor's graph rebuild through its own CLI, behind a backup

### Data Flow
A router reads `_routes.yaml`, keeps the routes whose `command` is its own, binds the target's workflow and flags, and loads the workflow. The validator groups routes by command and compares each group with that command's targets table and presentation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `_routes.yaml` and `route-validate.py` | Produce and check the route set | Update | `route-validate.sh` and its test |
| Routers and presentations | Consume the route set | Update and create | J1 parity, `validate_document.py --type command` |
| Command contract | Declares the doctor routers | Update | Ajv against the schema, router generator `--check` |
| Runtime mirrors | Derived copies of each router | Regenerate | The four sync `--check` runs |
| Tests that named a moved path | Pin the tuning workflow and the router | Update | Their own runs |
| Skill docs, playbook, catalog, READMEs | Describe the surface | Update or delete | Repository-wide search for the removed names |

Required inventories:
- Same-class producers: `rg --hidden -l "doctor:rebuild|doctor-rebuild|fable-mode|doctor:speckit|doctor-skill-advisor" --glob '!specs/**'`, which listed 81 live files before the change.
- Consumers of changed symbols: every test that names `doctor-skill-advisor.yaml`, `speckit.md` or a `skill-advisor` route.
<!-- /ANCHOR:affected-surfaces -->


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
| Unit | The validator's new rule B3 and per-command J1 | `route-validate.sh --self-test`, the mutation tests in `route-validate.test.sh` |
| Integration | The whole doctor surface | `run-all.sh`, the advisor route contract test, the router generator, the mirror and catalog checks |
| Manual | J1 against a broken copy | A scratch copy of the doctor folder with one router row removed and one target renamed |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Advisor CLI rebuild commands | Internal | Green | The rebuild target could not run |
| Runtime mirror and prompt sync scripts | Internal | Green | Per-runtime copies would keep the deleted command |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A routed doctor command fails to dispatch after the change.
- **Procedure**: Revert the phase commit; the deleted files and mirrors come back with it, and no data changes.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Manifest + validator ──► Routers + presentations ──► Deletions + references ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Manifest and validator | None | Routers |
| Routers and presentations | Manifest | Deletions |
| Deletions and references | Routers | Verify |
| Verify | All | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Ownership and reference inventory |
| Core Implementation | Med | Manifest, validator, seven router and presentation files, one workflow |
| Verification | Med | The doctor suite, mirrors, contract and a repository-wide search |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): the rebuild workflow backs up `skill-graph.sqlite` before each run
- [x] Feature flag configured: not applicable, a revert restores the previous surface
- [x] Monitoring alerts set: not applicable

### Rollback Procedure
1. Revert the phase commit.
2. Rerun the mirror sync scripts so per-runtime copies match.
3. Rerun `route-validate.sh` and `run-all.sh`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

