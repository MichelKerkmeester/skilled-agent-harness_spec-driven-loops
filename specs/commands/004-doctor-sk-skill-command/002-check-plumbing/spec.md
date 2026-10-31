---
title: "Feature Specification: Phase 2: check-plumbing"
description: "The check engine from phase 1 has no command surface, so no operator or advisor can reach it. This phase authors the /doctor:sk-skill router, presentation and check YAML through sk-doc's sk-create-command mode, adds the route, contract entry, setup row and runtime mirrors, and a contract test."
trigger_phrases:
  - "check plumbing"
  - "phase 2 check plumbing"
  - "doctor sk-skill check route"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: check-plumbing

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-30 |
| **Branch** | `worktrees/281-doctor-skill-command` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 10 |
| **Predecessor** | 001-check-engine |
| **Successor** | 003-convert-legacy-skilled |
| **Handoff Criteria** | `route-validate.sh` exit 0, `tests/run-all.sh` all PASS and the four mirror checks pass with `/doctor:sk-skill check` routed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Doctor skill command: check and convert a skill to the Skilled format and wire it into the advisor specification.

**Scope Boundary**: The command surface for the read-only `check` target only. The `convert` YAML, its presentation states and the advisor bridge activation belong to phase 006.

**Owning workflow**: sk-doc's sk-create-command mode, entered through `/create:command` (`.skilled/commands/create/command.md`). The implementer reads `.skilled/skills/sk-doc/sk-create-command/SKILL.md`, its `ROUTER.md` and `references/router-presentation-split.md` first, then builds each surface from that mode's templates. No surface is hand-rolled.

**Dependencies**:
- Phase 001: `sk-skill-check.cjs` exists and its test passes.
- sk-create-command templates: `assets/command-router-template.md`, `assets/command-presentation-template.md`, `assets/command-template.md`, `assets/command-contract.json` and `assets/command-contract.schema.json`.

**Deliverables**:
- Router `.skilled/commands/doctor/sk-skill.md`, presentation `assets/doctor-sk-skill-presentation.txt` and workflow `assets/doctor-sk-skill-check.yaml`
- A `check` route in `_routes.yaml` with `mutating: read-only` and, while it is the only target, no `default_target`
- The `families.doctor` contract entry, the `/doctor:setup` row and generated command mirrors
- `scripts/tests/doctor-sk-skill-contract.test.cjs`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-skill-check.cjs` runs only when someone types its path. There is no `/doctor:sk-skill` router, route, contract entry or mirror, so `/doctor:setup` does not list it and the doctor validators cannot check that its assets, targets and mutation class agree.

### Purpose
A bare `/doctor:sk-skill` lands on the read-only `check` target on every runtime, and `route-validate.sh` plus the doctor test suite prove the surface is complete.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .skilled/commands/doctor/sk-skill.md .skilled/commands/doctor/assets/doctor-sk-skill-check.yaml
ls: .skilled/commands/doctor/assets/doctor-sk-skill-check.yaml: No such file or directory
ls: .skilled/commands/doctor/sk-skill.md: No such file or directory

$ bash .skilled/commands/doctor/scripts/route-validate.sh | tail -1 | grep -o '[0-9]* routes validated, [0-9]* warnings'; echo "exit=${pipestatus[1]}"
18 routes validated, 3 warnings
exit=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author the router, presentation and check YAML from the sk-create-command templates, following the router and presentation split.
- Append the `check` route to `.skilled/commands/doctor/_routes.yaml` per its header steps (`_routes.yaml:44-48`), with `mutating: read-only`. A bare command must land on a read-only target (`_routes.yaml:36-40`); as the only target, `check` is reached without `default_target`, which the bridge deriver refuses on a single-target command.
- Add `/doctor:sk-skill` to `families.doctor` in `command-contract.json` (`router_path`, `input.argument_hint`, `execution_targets`, `loader_requirements`) and keep it valid against `command-contract.schema.json`.
- Add the `/doctor:sk-skill check` row to `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` (list at `:19-37`).
- Generate the command mirrors with the sync scripts and add the contract test.

### Out of Scope
- The `convert` route, YAML and setup row - phase 006.
- Advisor bridge activation in `scoring-compatibility.json` - phase 006.
- README and catalog docs - phase 007.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/sk-skill.md` | Create | Router, from `command-router-template.md` |
| `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt` | Create | Presentation and target menu, from `command-presentation-template.md` |
| `.skilled/commands/doctor/assets/doctor-sk-skill-check.yaml` | Create | Check workflow, from `command-template.md` |
| `.skilled/commands/doctor/_routes.yaml` | Modify | `check` route, `mutating: read-only`, no `default_target`, `script_invocations` naming `sk-skill-check.cjs` |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | `families.doctor` entry (`:194`) |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` | Modify | One `/doctor:sk-skill check` row |
| `.claude/commands/doctor/sk-skill.md` | Create | Link, written by the sync scripts |
| `.cursor/commands/doctor-sk-skill.md`, `.codex/prompts/doctor-sk-skill.md`, `.pi/prompts/doctor-sk-skill.md`, `.hermes/prompts/doctor-sk-skill.md` | Create | Generated mirrors, never written by hand |
| `.skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs` | Create | Contract test, read like `doctor-update-contract.test.cjs:42-46` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with the new route counted. |
| REQ-002 | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` reports all PASS, including `doctor-sk-skill-contract.test.cjs`. |
| REQ-003 | `validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check`, `pi/sync-prompts-pi.cjs --check` and `command-catalog-mirror-check.cjs` all pass. |
| REQ-004 | The router, presentation and YAML follow the sk-create-command templates, and the `families.doctor` entry validates against `command-contract.schema.json`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | A bare `/doctor:sk-skill` resolves to the `check` route, which carries `mutating: read-only`. While `check` is the only target it carries no `default_target`; phase 006 adds `default_target: true` with the `convert` route. |
| REQ-006 | `/doctor:setup` lists the `/doctor:sk-skill check` row. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `route-validate.sh` exits 0 and `tests/run-all.sh` reports all PASS.
- **SC-002**: The four mirror checks pass with `doctor-sk-skill.md` present on every runtime that has a commands or prompts directory.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-create-command templates and `/create:command` workflow | Hand-rolled surfaces drift from the family canon | Read the mode's SKILL.md, ROUTER.md and `router-presentation-split.md` first; T001 records it |
| Risk | `route-validate.py` enforces asset existence, mutation class, target parity and that every `script_invocations` script is invoked by the YAML (`route-validate.py:12-33`) | Med | Add route, router table, presentation menu and YAML invocation in one change and rerun the validator |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: the phase adds routing files, not a running service.
- **NFR-P02**: N/A: no throughput target applies.

### Security
- **NFR-S01**: The `check` route is `mutating: read-only` and its YAML runs no write.
- **NFR-S02**: Mirrors come from the sync scripts only, never hand edits (`parent-skills-nested-packets.md:257-262`).

### Reliability
- **NFR-R01**: Mirror checks pass on every runtime that has a commands or prompts directory.
- **NFR-R02**: An absent runtime directory is skipped, never created (parent D4).

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a bare `/doctor:sk-skill` with no target resolves to `check` with no argument, which prints the fleet table.
- Maximum input: `check <name-or-path> --json` passes both arguments through to `sk-skill-check.cjs` unchanged.
- Failure path: `route-validate.sh` exits non-zero when the presentation menu, router table and route disagree on targets; the phase stays open until it exits 0.
- Absent runtime: a runtime with no commands or prompts directory gets no mirror and reports n/a (parent D4).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Four new files, three modified, five generated mirrors |
| Risk | 8/25 | Shared doctor route table and command contract |
| Research | 4/20 | Templates and validators are named |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which command checks `command-contract.json` against `command-contract.schema.json`? sk-create-command's SKILL.md says the schema validates the contract (`SKILL.md:361`) but names no validator script; T007 finds or records the check used.
<!-- /ANCHOR:questions -->

---

