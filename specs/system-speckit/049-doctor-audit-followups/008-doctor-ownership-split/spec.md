---
title: "Feature Specification: Phase 8: doctor-ownership-split"
description: "/doctor:speckit carried diagnostics that belong to the skill advisor, the deep loop and the runtime mirrors, /doctor:rebuild rebuilt one database the advisor already rebuilds, and the fable-mode target served no one. This phase gives each owner its own doctor command and deletes the rest."
trigger_phrases:
  - "doctor ownership split"
  - "doctor skill-advisor command"
  - "delete doctor rebuild"
  - "doctor deep-loop command"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: doctor-ownership-split

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-speckit-router-contract-drift |
| **Successor** | None |
| **Handoff Criteria** | `route-validate.sh` passes across all four routed commands and no live doc names a removed command |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the doctor audit follow-ups. After phase 007 the doctor surface worked, but `/doctor:speckit` still dispatched nine targets and only one of them belonged to spec-kit.

**Scope Boundary**: The doctor command folder (routers, route manifest, workflows, presentations, scripts and tests), the command contract's doctor entry, the generated runtime mirrors, and every live doc that names a moved or deleted doctor surface.

**Dependencies**:
- The advisor CLI's `advisor_rebuild`, `skill_graph_scan` and `skill_graph_validate` commands, which the new rebuild target calls
- The runtime mirror and prompt sync scripts, which regenerate the per-runtime command copies

**Deliverables**:
- `/doctor:skill-advisor`, `/doctor:deep-loop` and `/doctor:runtime-mirrors` routers with their own presentations
- A `/doctor:skill-advisor rebuild` workflow that replaces the advisor leg of `/doctor:rebuild`
- `/doctor:speckit` narrowed to retrieval, with a moved-target notice for its old targets
- `/doctor:rebuild` and the fable-mode target deleted, with every reference repointed

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/doctor:speckit` was one router for nine targets, and eight of them belonged to other owners: four to the skill advisor's routing quality, one each to the deep loop and the runtime mirrors, one to the parent-hub canon and one to a Fable 5 metrics check nobody used. `/doctor:rebuild` had outlived its purpose. Spec-kit's database left with the memory decommission, so it rebuilt only the advisor's `skill-graph.sqlite` (which the advisor CLI already rebuilds), regenerated the trigger index (one generator command) and ran a v3.3 migration that no v4 checkout needs. It was also the only doctor command with no recorded end-to-end run.

### Purpose
Each doctor command diagnoses one owner's surface, the advisor's database rebuild lives with the advisor, and nothing a user can run points at a deleted command.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Give every route in `_routes.yaml` an owning `command`, and teach `route-validate.py` to check each command's router and presentation
- Add the three routers and presentations, and narrow `speckit.md` and its presentation to retrieval
- Add `doctor-skill-advisor-rebuild.yaml`, rename the tuning workflow to `doctor-skill-advisor-tune.yaml`
- Delete `rebuild.md`, its workflow, presentation, bootstrap script and test, and the fable-mode workflow, script and test
- Repoint every live reference: kept workflows, the command contract, runtime mirrors, READMEs, the feature catalog, the playbook and skill references

### Out of Scope
- Changing what any moved workflow diagnoses - the move keeps each workflow's behaviour; only the deep-loop recommendations change, because they named a command that never rebuilt that graph
- A git hooks doctor and sk-git standard customization - requested during this phase and planned as phase 009

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/_routes.yaml` | Modify | `command` owner per route, `tune` and `rebuild` routes, fable-mode and rebuild entries removed |
| `.skilled/commands/doctor/{skill-advisor,deep-loop,runtime-mirrors}.md` | Create | One router per owner |
| `.skilled/commands/doctor/speckit.md` | Modify | Retrieval only, moved-target notice |
| `.skilled/commands/doctor/assets/doctor-{skill-advisor,deep-loop,runtime-mirrors}-presentation.txt` | Create | Per-command presentations |
| `.skilled/commands/doctor/assets/doctor-skill-advisor-rebuild.yaml` | Create | Advisor graph rebuild behind a backup |
| `.skilled/commands/doctor/scripts/route-validate.{py,sh}` and its test | Modify | Command-aware checks, new rule B3 |
| `.skilled/commands/doctor/rebuild.md` and its assets, bootstrap and fable-mode files | Delete | Retired surfaces |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | Doctor router list, hints, targets and loader rules |
| Runtime mirrors under `.claude`, `.cursor`, `.codex`, `.pi`, `.hermes` | Regenerate | Through their sync scripts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every route in `_routes.yaml` names an owning doctor command, and `route-validate.sh` passes with each command's targets in parity with its router and, for a multi-route command, its presentation. |
| REQ-002 | `/doctor:skill-advisor` routes `tune`, `rebuild`, `skill-graph-freshness`, `router-reach`, `skill-budget` and `parent-skill`; `/doctor:deep-loop` and `/doctor:runtime-mirrors` each bind their one workflow. |
| REQ-003 | `/doctor:skill-advisor rebuild` backs up `skill-graph.sqlite`, rebuilds through `advisor_rebuild` and `skill_graph_scan`, validates, and restores the backup when either fails; `--dry-run` writes nothing. |
| REQ-004 | `/doctor:rebuild` and the fable-mode target are deleted, and no live file outside `specs/` names them as runnable. |
| REQ-005 | The doctor test runner, the route tests and every test that named a moved file pass. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `/doctor:speckit` answers an old target name with the command that owns it now. |
| REQ-007 | The command contract validates against its schema and the router generator reports every doctor router clean. |
| REQ-008 | The runtime mirror, prompt and command-catalog checks all pass. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `route-validate.sh` reports 9 routes across 4 commands with no failure.
- **SC-002**: A search for `doctor:rebuild`, `doctor-rebuild` and `fable-mode` across live files outside `specs/` finds only the moved-target notice and historical changelogs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Advisor CLI rebuild commands | The rebuild target cannot run without them | The route declares them in `cli_commands`, and the route contract test checks they exist in the live registry |
| Risk | A user runs an old `/doctor:speckit <target>` form | Med | The moved-target notice names the new command instead of failing |
| Risk | A doc still names `/doctor:rebuild` | Low | A repository-wide search over live files is part of verification |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The route validator still runs in a few seconds; it reads four routers instead of one.

### Security
- **NFR-S01**: The rebuild target writes only `skill-graph.sqlite` and its backup, and only through the advisor CLI after one approval.

### Reliability
- **NFR-R01**: A failed rebuild leaves the previous database in place.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No `skill-graph.sqlite` yet: the rebuild records `backup=none` and builds one.
- A route whose command names no router file: rule B3 fails the manifest.

### Error Scenarios
- Advisor daemon not running: the warm-only probe exits 75 and the rebuild proceeds, because it does not need the daemon.
- `advisor_rebuild` or `skill_graph_validate` fails: the backup is copied back and the result is `ROLLED_BACK`.

### State Transitions
- An old `/doctor:speckit <moved-target>` call: the notice stops before any workflow loads.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | About 90 files across commands, skills, mirrors and docs |
| Risk | 10/25 | Deletes a command; every runnable path is repointed and verified |
| Research | 8/20 | Ownership mapping and the rebuild legs were traced first |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose the homes for `parent-skill` and `runtime-mirrors` and an outright delete of `/doctor:rebuild` before work began.
<!-- /ANCHOR:questions -->

---


