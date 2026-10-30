---
title: "Feature Specification: Phase 6: convert-plumbing"
description: "The convert scripts from phases 3 to 5 have no doctor route, workflow YAML, presentation states or advisor bridge, so no operator can reach them through /doctor:sk-skill convert. This phase wires the convert target into the doctor plumbing with a plan, yes, write, re-read and undo workflow."
trigger_phrases:
  - "convert plumbing"
  - "phase 6 convert plumbing"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: convert-plumbing

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
| **Phase** | 6 of 10 |
| **Predecessor** | 005-integration |
| **Successor** | 007-docs-and-changelogs |
| **Handoff Criteria** | `bash .skilled/commands/doctor/scripts/route-validate.sh` and `bash .skilled/commands/doctor/scripts/tests/run-all.sh` pass with the convert route present, and `doctor-phrase-reach.cjs` reaches `/doctor:sk-skill` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Doctor skill command: check and convert a skill to the Skilled format and wire it into the advisor specification.

**Scope Boundary**: The doctor plumbing for the `convert` target only: its route, workflow YAML, router and presentation entries, setup row, command contract entry, advisor bridge activation and the contract test of its refusal strings. The convert logic itself (`sk-skill-convert.cjs`, the transforms and the integration writes) belongs to phases 3, 4 and 5 and is not changed here.

**Dependencies**:
- Phase 3 (`003-convert-legacy-skilled`): `sk-skill-convert.cjs plan|apply` exists.
- Phase 5 (`005-integration`): the integration rows I1 to I6 run inside `apply`.
- Phase 2 (`002-check-plumbing`): `sk-skill.md`, `doctor-sk-skill-presentation.txt`, the `check` route and `doctor-sk-skill-contract.test.cjs` exist to extend.
- sk-doc's sk-create-command mode owns the authoring of every command surface here: the implementer reads `.skilled/skills/sk-doc/sk-create-command/SKILL.md`, its `ROUTER.md` and `references/router-presentation-split.md` first, and works through the `/create:command` workflow (`.skilled/commands/create/command.md`).

**Deliverables**:
- `.skilled/commands/doctor/assets/doctor-sk-skill-convert.yaml` with the phases read, plan, follow-ups, approval, write, re-read, undo and report.
- A `convert` route in `.skilled/commands/doctor/_routes.yaml` with `mutating: mutates` and the engine's real write set as its gate-3 location.
- Convert states in the router, presentation and setup list, an activated advisor bridge and refusal-string contract tests whose code list is derived from the engine.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After phase 5, `sk-skill-convert.cjs` can plan and apply a conversion, but only a person who knows the script path can run it. The doctor family's contract is "read by default, write only after a printed plan and a yes" (design section 1, citing `.skilled/commands/doctor/ci.md:38` and `.skilled/commands/doctor/_routes.yaml:370-384`), and nothing yet enforces that contract for convert. The advisor also cannot suggest the target, because a bridge without an activation entry stays inactive (`.skilled/commands/doctor/_routes.yaml:46`).

### Purpose
An operator types `/doctor:sk-skill convert <name-or-path>`, sees the plan, and the workflow writes only after an explicit yes, prints `CANCELLED` on any other answer, and the advisor routes convert requests to the command.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .skilled/commands/doctor/assets | grep -c "doctor-sk-skill-convert"
0
exit 1
$ rg -c 'doctor:sk-skill"' .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json
exit 1
```
Run in the worktree on 2026-10-30, before phases 2 to 5 land: no convert workflow YAML exists and no bridge activation names `/doctor:sk-skill`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author the router, presentation and convert YAML through the sk-create-command mode (`/create:command`), extending them from `assets/command-router-template.md`, `assets/command-presentation-template.md` and `assets/command-template.md` under `.skilled/skills/sk-doc/sk-create-command/`, never hand-rolled.
- Create `doctor-sk-skill-convert.yaml`, modelled on `doctor-ci-scaffold.yaml` (`mutation_boundaries` at `:25-36`, plan and approval at `:86-98`), with the statuses `OK`, `CANCELLED` and `FAIL`.
- Add the `convert` route to `_routes.yaml` following the header steps at `.skilled/commands/doctor/_routes.yaml:44-48`, with `mutating: mutates`, `script_invocations` that name `sk-skill-convert.cjs` and trigger phrases of three or more words.
- Add the convert target to the router `sk-skill.md`, the menu and result states to `doctor-sk-skill-presentation.txt`, and a convert row to `doctor-setup-presentation.txt`.
- Activate the bridge in both lists of `scoring-compatibility.json`, rerun `derive-command-bridges.cjs`, and confirm reach with `doctor-phrase-reach.cjs`.
- Extend `doctor-sk-skill-contract.test.cjs` to assert every refusal string the YAML prints.

### Out of Scope
- Changing `sk-skill-convert.cjs`, `lib/sk-skill-convert-transforms.cjs` or the integration writes - phases 3 to 5 own them; this phase only routes to them.
- User-facing docs and changelogs - phase 7 owns them.
- The `check --into-hub` gap report - phase 8 owns it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/assets/doctor-sk-skill-convert.yaml` | Create | Workflow: read, plan, follow-ups, approval, write, re-read, undo, report |
| `.skilled/commands/doctor/_routes.yaml` | Modify | Add the `/doctor:sk-skill` `convert` route |
| `.skilled/commands/doctor/sk-skill.md` | Modify | Add the convert row to the router's target table |
| `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt` | Modify | Convert menu entry, plan, refusal, `OK` and `CANCELLED` states |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` | Modify | Add the convert row to the target list (`:19-37`) |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | Add convert to `families.doctor` `execution_targets` (`:194`) |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` | Modify | Activation entry in the `typescript` and `python` lists |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` | Modify | Regenerated by `derive-command-bridges.cjs`, never by hand |
| `.skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs` | Modify | Assert the convert route, the YAML statuses and every refusal string |
| `.cursor/commands/doctor-sk-skill.md`, `.codex/prompts/doctor-sk-skill.md`, `.pi/prompts/doctor-sk-skill.md`, `.hermes/prompts/doctor-sk-skill.md` | Modify | Regenerated by the sync scripts when the router changes, never by hand |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `_routes.yaml` holds a `/doctor:sk-skill` `convert` route with `mutating: mutates`, its `yaml: doctor-sk-skill-convert.yaml` exists, and `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. |
| REQ-002 | The YAML writes nothing before an explicit yes: any other answer ends with `STATUS=CANCELLED` and no file under `.skilled/skills/` changes. |
| REQ-003 | The YAML refuses, with `STATUS=FAIL` and a named reason, a dual declaration, a hub declaration or half hub declaration, nested `SKILL.md` packets, a `local-` prefix, an `agent-` prefix and a name collision (design V0 and R1 to R3). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | After `derive-command-bridges.cjs`, `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` reports the convert trigger phrases reaching `/doctor:sk-skill`. |
| REQ-005 | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` passes, with `doctor-sk-skill-contract.test.cjs` asserting each refusal string the YAML prints. |
| REQ-006 | A description over 130 characters is proposed as a separately named trim with its own yes, and `allowed-tools` for a plain skill is proposed, never defaulted (decisions D1 and D7). |
| REQ-007 | The router, presentation and convert YAML are authored through the sk-create-command mode from its three templates, and `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` still validates against `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.schema.json`. |
| REQ-008 | Adding the `convert` route makes `/doctor:sk-skill` multi-target, so the `check` route gains `default_target: true` in the same change; `derive-command-bridges.cjs` then runs without error and the bare command still reaches `check`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A manual run of `/doctor:sk-skill convert` on a scratch skill prints the plan, then `STATUS=CANCELLED` on "no", then `STATUS=OK` on "yes" (design phase 6).
- **SC-002**: `route-validate.sh`, `run-all.sh` and `doctor-phrase-reach.cjs` all exit 0 with the convert route present.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `sk-skill-convert.cjs plan|apply` from phases 3 to 5 | Without it the YAML has nothing to invoke and route-validate fails its `script_invocations` check | Start only after phase 5 closes; route-validate catches a missing script |
| Risk | The workflow writes before the operator says yes | High | The YAML calls `apply` only after yes, the default `plan` call writes nothing, and the contract test asserts the order |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The plan step adds no network call; it runs `sk-skill-convert.cjs plan`, which only reads the skill folder.
- **NFR-P02**: N/A for throughput: the command runs once per operator request.

### Security
- **NFR-S01**: The route's `mutation_boundaries` name every write the engine makes and nothing else: the staged or converted skill folder, its backups under `.skilled/skills/.state/doctor-sk-skill/<name>/<timestamp>/`, the skill's changelog folder and its `.skilled/changelog/<name>` link, the integration targets the engine records (the advisor graph, the compiled `skill-graph.json`, the advisor cases file, the Hermes skills mirror), and the frontmatter fields the operator approved as flags.
- **NFR-S02**: A permission grant (`allowed-tools`) is never written without the operator confirming it (D7).

### Reliability
- **NFR-R01**: Every overwritten file is backed up before the write, and the result prints the undo commands (design V10).
- **NFR-R02**: A second `apply` on a converted skill is a no-op, so a rerun after a failure is safe.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: `/doctor:sk-skill convert` with no name asks once for the name and refuses to infer one.
- Maximum input: a skill with fewer than 8 approved intent phrases stops the plan with `INTENT_SIGNALS_BELOW_FLOOR` (design R4).
- Failure path: a refusal from V0 (dual declaration, hub candidate, `local-` or `agent-` prefix, collision) prints `REFUSE:` with the reason and ends `STATUS=FAIL`; a hub candidate also prints the `/create:skill-parent` command line (R3).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One new YAML, eight edited files, generated mirrors and bridges |
| Risk | 12/25 | First mutating doctor route that writes a skill package |
| Research | 4/20 | The pattern exists in `doctor-ci-scaffold.yaml` |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does phase 2 already register `convert` in `command-contract.json` `execution_targets`? Decision: this phase checks and adds it only when absent.
- None else blocks.
<!-- /ANCHOR:questions -->

---


