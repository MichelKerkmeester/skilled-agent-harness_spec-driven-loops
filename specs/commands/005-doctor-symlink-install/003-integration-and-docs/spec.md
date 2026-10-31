---
title: "Feature Specification: Phase 3: integration-and-docs"
description: "Phase 3 registers /doctor:symlink and /doctor:install in the route manifest, the setup target list, the advisor bridges, the command index, the root README, the feature catalog, the playbook and the runtime mirrors."
trigger_phrases:
  - "integration and docs"
  - "phase 3 integration and docs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: integration-and-docs

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-31 |
| **Branch** | `worktrees/304-doctor-symlink-install` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 6 |
| **Predecessor** | 002-install-guide-router |
| **Successor** | 004-command-contract-and-readme |
| **Handoff Criteria** | Both commands are listed on every surface the plan names, and `validate.sh --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Doctor symlink and install commands: link Skilled into user project repos and guide setup specification.

**Scope Boundary**: Registration and documentation only. The engine, both routers, the workflow YAMLs and the presentation texts are frozen by the two phase contracts, and this phase changes none of them.

**Dependencies**:
- `001-symlink-engine-and-command/scratch/engine-contract.md`
- `002-install-guide-router/scratch/install-contract.md`
- Both routers on disk: `.skilled/commands/doctor/symlink.md` and `.skilled/commands/doctor/install.md`

**Deliverables**:
- Four routes in `_routes.yaml`, and a header that lists 16 router files
- Two rows in the `/doctor:setup` target list
- Four bridge activations in each language list, and regenerated bridge files
- Helper fixtures, command index rows and root README sections
- Catalog, playbook, owner README and advisor routing entries
- Regenerated runtime and prompt mirrors
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A doctor command that no entry point names is a command nobody runs. `_routes.yaml` reports 24 routes under a 14-file header, the `/doctor:setup` target list has no row for either new command, the advisor has no activation entry for their bridges, and the command index check reports the install router unlisted while the doctor group still counts 14 files. The helper cannot rank them, the advisor cannot suggest them, and a reader of any index cannot find them.

### Purpose

Register both commands on every surface the doctor family is listed on, so `/doctor:helper` ranks them, `/doctor:setup` lists them, the advisor suggests them, and each README, catalog and playbook describes them.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ bash .skilled/commands/doctor/scripts/route-validate.sh | rg 'B1:|J1:|^OK:'
PASS: B1: .routes has 24 entries
PASS: J1: targets are in parity with their router and presentation across 11 commands
OK: route-validate — 24 routes validated, 5 warnings

$ rg -c '^#   /doctor:' .skilled/commands/doctor/_routes.yaml
14
```

The `24`, `11` and `14` in this block are the numbers this phase moves: four new routes take the count to 28, the parity check covers two more commands once their setup rows land, and the header lists 16 router files. Every count this spec states about the current manifest quotes this block.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add three `/doctor:symlink` routes and one `/doctor:install` route to `_routes.yaml`
- Raise the manifest header from 14 to 16 router files
- Add the two `/doctor:setup` target rows and four bridge activations per language list
- Add helper fixtures, command index rows, and the root README section, line, count and rows
- Add catalog, playbook, owner README and advisor routing entries, then regenerate every mirror

### Out of Scope
- Changing the engine, a router, a workflow or a presentation - the two contracts freeze them
- Repairing the operator's existing broken links - `/doctor:symlink link` does that under a yes
- The project-root resolution defect in packet 051 - `/doctor:install` only warns about it

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/_routes.yaml` | Modify | Four routes, and the header list and count raised to 16 |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` | Modify | Two rows in the target list |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` | Modify | Four activation entries in each language list |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` and its three source outputs | Regenerate | The deriver's output |
| `.skilled/commands/doctor/scripts/tests/fixtures/doctor-helper/tune.jsonl` and `heldout.jsonl` | Modify | Ranking fixtures for both commands |
| `.skilled/commands/README.txt` | Modify | Family row, Fourteen count and doctor table |
| `README.md` | Modify | Install section, Keep It Healthy line, Sixteen count, two rows and two entries |
| `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md` | Modify | Catalog coverage for both commands |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/` | Create | One scenario per command |
| `.skilled/skills/system-spec-kit/README.md` | Modify | The doctor command table |
| `.skilled/skills/system-skill-advisor/README.md` | Modify | The doctor routing paragraph |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md` | Modify | Routing coverage for both commands |
| Runtime mirror trees under `.claude`, `.opencode`, `.codex`, `.cursor`, `.devin`, `.pi` and `.hermes` | Regenerate | Generator output only, never hand-edited |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `_routes.yaml` holds three `/doctor:symlink` routes and one `/doctor:install` route, and its header lists 16 router files, so `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 and reports 28 routes. |
| REQ-002 | `doctor-setup-presentation.txt` section 2 lists both commands, so `node --test .skilled/commands/doctor/scripts/tests/doctor-helper-contract.test.cjs` exits 0. |
| REQ-003 | `scoring-compatibility.json` activates the four new bridges in both the typescript and the python list, and `derive-command-bridges.cjs` regenerates every generated bridge file. |
| REQ-004 | `.skilled/commands/README.txt` lists both commands, and its family row reads Sixteen. |
| REQ-005 | The root `README.md` gains the "Use It In Your Own Project" section, the "Keep It Healthy" mention, the Sixteen count, two table rows and two per-command entries. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The helper ranking fixtures cover both commands, so `node --test .skilled/commands/doctor/scripts/tests/doctor-helper-match.test.cjs` exits 0. |
| REQ-007 | The doctor feature catalog and the spec-kit playbook describe both commands. |
| REQ-008 | Both owner READMEs and the advisor's doctor routing document name both commands. |
| REQ-009 | Every runtime and prompt mirror is regenerated, and each generator's `--check` exits 0. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 and reports 28 routes, and `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` prints `STATUS=OK`.
- **SC-002**: The prompt "symlink skilled into my project" ranks `/doctor:symlink` or `/doctor:install`, never `/doctor:mcp install`.
- **SC-003**: `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` prints `STATUS=OK` with both commands listed.
- **SC-004**: `sync-runtime-mirrors.cjs --check` and each prompt generator's `--check` exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The two frozen contracts | The integration edits have no stable interface to build against | Change the contract first, then the lane |
| Dependency | The advisor bridge deriver | Both bridges stay inactive and the advisor never suggests either command | Rerun the deriver and assert `command-bridges.generated.json` names all four bridges |
| Risk | A hand-edited runtime mirror | The next mirror check fails and the runtime copy drifts from `.skilled` | Regenerate every mirror, and never edit one by hand |
| Risk | A stale count in an index | `command-catalog-mirror-check.cjs` reports drift | Fix the count the check names, never the check |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `/doctor:helper` still reads one manifest per run; the four routes add no script execution to it.
- **NFR-P02**: `route-validate.sh` completes in under 10 seconds on the full manifest.

### Security
- **NFR-S01**: No edited file adds a credential, and every command the install guide prints carries no secret.
- **NFR-S02**: No README, catalog or playbook line tells a reader to commit an absolute link; where a doc restates the ignore guidance, it names `.git/info/exclude`.

### Reliability
- **NFR-R01**: Every generated file is byte-identical on a rerun, so each generator's `--check` exits 0.
- **NFR-R02**: A router that lands without its setup row fails `doctor-helper-contract.test.cjs` instead of passing silently.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a router file that lands with no `_routes.yaml` route fails `doctor-helper-contract.test.cjs`, so a command never goes unreachable without a failing test.
- Maximum input: both commands with every target give 4 new routes and 4 new bridges per language, and `route-validate.sh` reports 28 routes.
- Failure path: a stale generated copy makes `sync-runtime-mirrors.cjs --check` exit 1 and name the file, and a stale index makes `command-catalog-mirror-check.cjs` print `STATUS=DRIFT` with the count.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Thirteen files, no new code, one manifest and two indexes |
| Risk | 6/25 | Registry and index edits; a missed row fails a test, not a user path |
| Research | 4/20 | Both contracts are frozen and the nine surfaces are enumerated in the approved plan |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The route set, the phrase wording, the mutation classes and the ignore location are fixed by the two phase contracts.
<!-- /ANCHOR:questions -->

---


---
