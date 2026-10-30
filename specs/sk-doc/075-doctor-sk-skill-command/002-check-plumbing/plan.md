---
title: "Implementation Plan: Phase 2: check-plumbing"
description: "Author the /doctor:sk-skill check surface through sk-doc's sk-create-command mode: router, presentation and YAML from its templates, then the route, contract entry, setup row and generated mirrors. Prove it with route-validate, the doctor test suite and four mirror checks."
trigger_phrases:
  - "check plumbing plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: check-plumbing

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown router, plain-text presentation, YAML workflow, JSON contract, Node test |
| **Framework** | Doctor command family, authored through sk-create-command and `/create:command` |
| **Storage** | None |
| **Testing** | `route-validate.sh`, `tests/run-all.sh`, mirror sync checks |

### Overview
Load sk-create-command, then fill its router, presentation and command templates for `/doctor:sk-skill` with the `check` target only. Register the route and contract entry, add the setup row, run the sync scripts for mirrors, and add a contract test. Prove it with `route-validate.sh` exit 0, `run-all.sh` all PASS and the four mirror checks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` exits 0 (phase 001 closed)
- [ ] sk-create-command `SKILL.md`, `ROUTER.md` and `references/router-presentation-split.md` read
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 and `bash .skilled/commands/doctor/scripts/tests/run-all.sh` prints all PASS
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Router, presentation, workflow split

### Key Components
- **`sk-skill.md`**: router; resolves the target and loads the presentation and YAML.
- **`doctor-sk-skill-presentation.txt`**: target menu and output shapes.
- **`doctor-sk-skill-check.yaml`**: runs `sk-skill-check.cjs` and renders its rows.
- **`_routes.yaml` check route**: the manifest `route-validate.py` reads.

### Data Flow
A typed `/doctor:sk-skill [check] [<name-or-path>] [--json]` reaches the runtime mirror, which points at the router. The router resolves the route in `_routes.yaml`, loads the presentation and the check YAML, and the YAML invokes `sk-skill-check.cjs`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/commands/doctor/_routes.yaml` | Doctor route manifest | update | `route-validate.sh` exit 0 |
| `command-contract.json` `families.doctor` | Doctor family contract | update | Schema check and `doctor-sk-skill-contract.test.cjs` |
| `doctor-setup-presentation.txt` | `/doctor:setup` target list | update | `doctor-setup-orphan-line.test.cjs` in `run-all.sh` |
| Runtime command mirrors | Discovery for each runtime | update via sync scripts | Four mirror checks pass |
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
| Unit | Contract entry fields and template conformance | `node --test .skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs` |
| Integration | Route manifest, router table, presentation menu, YAML invocations | `bash .skilled/commands/doctor/scripts/route-validate.sh`, `bash .skilled/commands/doctor/scripts/tests/run-all.sh` |
| Manual | Mirror parity on every runtime | `validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check`, `pi/sync-prompts-pi.cjs --check`, `command-catalog-mirror-check.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 `sk-skill-check.cjs` | Internal | Yellow | The YAML has nothing to invoke |
| sk-create-command templates and `/create:command` | Internal | Green | Surfaces cannot be authored to canon |
| Sync scripts under `.skilled/skills/system-spec-kit/runtime/cli/` | Internal | Green | Mirrors cannot be generated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `route-validate.sh` or a mirror check fails after the change and cannot be repaired in place.
- **Procedure**: revert the phase commit, then rerun the sync scripts so the generated mirrors drop `doctor-sk-skill.md`.
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
| Setup (load sk-create-command) | Phase 001 closed | Implementation |
| Implementation (surfaces, route, contract, mirrors) | Setup | Verification |
| Verification (validators, tests, mirror checks) | Implementation | Phase 003 |
<!-- /ANCHOR:phase-deps -->

---
