---
title: "Feature Specification: Phase 8: hub-gap-report"
description: "A mode added under a parent hub lands on 11 surfaces, and five of them have no gate, so a hub can pass every check with a mode no request reaches. This phase adds a read-only check --into-hub report that fills the 11-row integration table for a skill and a hub."
trigger_phrases:
  - "hub gap report"
  - "phase 8 hub gap report"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: hub-gap-report

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-30 |
| **Branch** | `worktrees/281-doctor-skill-command` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 10 |
| **Predecessor** | 007-docs-and-changelogs |
| **Successor** | 009-mirror-and-template-fixes |
| **Handoff Criteria** | `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` passes with the hub-gap fixtures, and a run against a shipped hub reports every applicable row present |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Doctor skill command: check and convert a skill to the Skilled format and wire it into the advisor specification.

**Scope Boundary**: A read-only `--into-hub <hub>` option on the `check` target. It reports; it never writes and never changes how a hub routes. Mode-into-hub conversion stays refused (design section 1, input (c)).

**Dependencies**:
- Phase 2 (`002-check-plumbing`): the `check` route, `sk-skill-check.cjs`, `lib/sk-skill-surface.cjs` and `sk-skill-check.test.cjs` exist (design phase 8 depends on 2).
- The command surfaces change through sk-doc's sk-create-command mode, as in phase 6.

**Deliverables**:
- `sk-skill-check.cjs check <name-or-path> --into-hub <hub> [--json]` printing the 11-row table.
- The flag added to the check route, its YAML, the router and the presentation.
- Fixture tests: a shipped-hub run and a hub missing `routerSignals` for a mode.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`parent-skills-nested-packets.md:245-256` lists the 11 surfaces a mode must land on, and `:259-264` says `parent-skill-check` covers rows 1-3 and 9, the mirror checkers cover row 11, check 6b covers row 7 only by name, and "Rows 4, 5, 6, 8 and 10 have no gate: a hub can pass every check with a mode that no request can reach." An operator who wants a skill under a hub has no single report of which surfaces are missing.

### Purpose
`/doctor:sk-skill check <skill> --into-hub <hub>` prints one row per surface with present, missing, n/a or UNKNOWN, and writes nothing.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n "into-hub" .skilled/commands/doctor
exit 1
```
Run in the worktree on 2026-10-30: no doctor command or script offers a hub gap report.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `--into-hub <hub>` to `sk-skill-check.cjs`, filling the 11 rows from the sources in the table below.
- Report row 5 as n/a on a hub without `FULL_INVENTORY` (only `sk-doc` carries one, `:251`) and row 10 as n/a for a `metadata` routing class (`:243`).
- Add the flag to the check route's `allowed_flags`, `doctor-sk-skill-check.yaml`, the router `sk-skill.md` argument hint and `doctor-sk-skill-presentation.txt`, through the sk-create-command mode.
- Add fixture tests for a shipped hub and a hub missing `routerSignals` for one mode.

### Out of Scope
- Writing any hub surface - the design refuses mode-into-hub writes because they change how the hub routes.
- New gates for rows 4, 5, 6, 8 and 10 in CI - this phase reports; promoting a row to a gate is a separate change.

### Row sources

| Row | Surface (`parent-skills-nested-packets.md:245-256`) | Source the report reads |
|-----|------|------|
| 1, 2, 3, 9 | Registry, `routerSignals`, `tieBreak`, leaf manifest | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/<hub>` (`:269`, always pass the hub path) |
| 2 (replay) | Stage-one selection | `node .skilled/bin/compiled-route.cjs --hub <hub> --prompt "<phrase>"` (`:279`) |
| 4, 5 | Root `ROUTER.md` `INTENT_SIGNALS`, `RESOURCE_MAP`, `FULL_INVENTORY` | `parseRouter` from `router-replay-lib.cjs` (design C7) |
| 6, 8 | Hub `graph-metadata.json` vocabulary, hub `description.json` | Direct JSON read |
| 7 | Hub `SKILL.md` mode table and packet count | Direct read |
| 10 | Projection maps and scorer (non-`metadata` only) | `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "<phrase>" --threshold 0.5` (`:280`) |
| 11 | Command mirrors | `validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check`, `pi/sync-prompts-pi.cjs --check` (`:259-262`) |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/sk-skill-check.cjs` | Modify | `--into-hub <hub>` option and the 11-row table, text and JSON |
| `.skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs` | Modify | Hub probes for rows 4 to 8 and 10 |
| `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` | Modify | Shipped-hub and missing-`routerSignals` cases |
| `.skilled/commands/doctor/scripts/tests/fixtures/` | Create | An invented fixture hub with one mode lacking `routerSignals` |
| `.skilled/commands/doctor/_routes.yaml` | Modify | `--into-hub` in the check route's `allowed_flags` |
| `.skilled/commands/doctor/assets/doctor-sk-skill-check.yaml` | Modify | Pass the flag through and render the table |
| `.skilled/commands/doctor/sk-skill.md`, `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt` | Modify | Argument hint and the gap-table template |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `check <mode> --into-hub <hub>` for a mode already shipped in that hub reports every applicable row present and exits 0. |
| REQ-002 | On the fixture hub whose mode lacks `routerSignals`, the report marks row 2 missing and exits 1. |
| REQ-003 | The option writes nothing: a run leaves `git status --porcelain` unchanged. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Row 5 prints n/a on a hub without `FULL_INVENTORY`, and row 10 prints n/a for a `metadata`-class mode. |
| REQ-005 | When the advisor backend returns exit 75, row 10 prints UNKNOWN, never present (design C8). |
| REQ-006 | `bash .skilled/commands/doctor/scripts/route-validate.sh` and `bash .skilled/commands/doctor/scripts/tests/run-all.sh` pass with the new flag. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A run against a shipped hub reports every applicable row present (design phase 8).
- **SC-002**: The fixture hub missing `routerSignals` for a mode reports row 2 missing (design phase 8).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `parent-skill-check.cjs` output shape | A format change would break rows 1-3 and 9 | Parse its JSON form if it has one, else pin the parsed lines in a test |
| Risk | A green report read as integration | Med | The report footer repeats "A green gate is not integration" and lists which rows have no CI gate |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The report spawns each checker once per run.
- **NFR-P02**: N/A: no throughput target; the command runs on request.

### Security
- **NFR-S01**: The report is read-only; its route keeps `mutating: read-only`.
- **NFR-S02**: A hub or skill with a `local-` prefix is refused, because every gate skips those roots (design R1).

### Reliability
- **NFR-R01**: A checker that cannot run prints UNKNOWN for its rows and exit 2, never a pass.
- **NFR-R02**: Text and JSON outputs carry the same row verdicts.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: `--into-hub` with no hub name exits 2 with usage.
- Maximum input: a hub with every mode, such as `sk-doc` with its `FULL_INVENTORY`, fills all 11 rows.
- Failure path: a path that holds no `mode-registry.json` or `hub-router.json` is not a hub and exits 2 with that reason.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two scripts, one test file, fixtures and four command surfaces |
| Risk | 5/25 | Read-only |
| Research | 8/20 | Map each row to a reliable probe |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which shipped hub and mode does the happy-path test use? Decision: pick one whose `parent-skill-check.cjs` run is clean in the phase 1 baseline, and record it in the test.
- None else blocks.
<!-- /ANCHOR:questions -->

---


