---
title: "Feature Specification: Phase 2: doctor-surface"
description: "The doctor still offers the embedder route, runs an embedder leg, lists the route as install step 5 and passes the semantic-health flag from eight files, though the lane ships at weight 0. This phase deletes that surface, regenerates the command bridges and takes the route out of the two install docs, so phase 004 can remove the flag without a doctor step being refused."
trigger_phrases:
  - "doctor surface"
  - "phase 2 doctor surface"
  - "remove the doctor embedder route"
  - "doctor semantic health flag removal"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 2: doctor-surface

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The doctor still offers `/doctor:skill-advisor embedder`, runs an embedder leg in `/doctor:setup`, prints the route as step 5 of `/doctor:install`, and prints an informational vector coverage line from four workflows, so 18 doctor files name the lane and 8 pass `--include-semantic-health`. This phase deletes the route, its asset, menu item, setup leg, install step, coverage lines, contract-test section and cost script, removes the route's two rows from the bridge input and regenerates the bridges, and takes the route out of the two install docs. Afterwards the manifest lists 6 `/doctor:skill-advisor` targets instead of 7, `/doctor:setup` runs 6 legs instead of 7, and `git grep -l include-semantic-health -- .skilled/commands/doctor` prints nothing.

**Key Decisions**: the orphan check's model-server class stays until phase 005, because it is the only doctor code that finds a running model server and phase 005 deletes that server; the cost script goes with the route as an operator script, not runtime code; the bridge input rows are a hand edit and every generated output is regenerated, never hand-edited.

**Critical Dependencies**: phase 001's recorded gate baselines and its residue check, and `derive-command-bridges.cjs`; this phase must land before phase 004 removes the status flag, because the status input schema is strict.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-20 |
| **Branch** | `worktrees/497-ollama-lane-removal` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 8 |
| **Predecessor** | 001-residue-check-and-cleanup-tool |
| **Successor** | 003-lane-feeders |
| **Handoff Criteria** | `run-all.sh`, `derive-command-bridges.cjs --check`, the drift guard, the mirror check and the link check pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Ollama lane removal specification.

**Scope Boundary**: The doctor surface only: the embedder route block in `_routes.yaml`, `doctor-skill-advisor-embedder.yaml`, presentation section 8 and menu item 5, the setup leg, install step 5, the informational vector coverage lines in the update, overlay and symlink assets, `doctor-phrase-reach.cjs` 163 and 169, the contract tests that pin them, and the command-bridge regeneration, plus the two install docs and the cost script only this route calls. No advisor runtime code. The orphan check's model-server class stays until phase 005, as `plan.md` ADR-002 records.

**Dependencies**:
- 001-residue-check-and-cleanup-tool: the check and gate baselines exist
- `../../023-ollama-deprecation-research/research/research.md` sections 3.1 to 3.4

**Deliverables**:
- `/doctor:skill-advisor` lists six targets and `/doctor:setup` six legs
- `run-all.sh`, `derive-command-bridges.cjs --check`, the drift guard, the mirror check and the link check pass
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The lane ships at weight 0, yet the doctor still sets it up, checks it and reports its vectors: 18 files under `.skilled/commands/doctor/` name it and 8 pass `--include-semantic-health`. Phase 004 removes that flag from a status input schema that refuses unknown keys, so any doctor step still passing it would fail instead of skipping. The install docs send new users to the route, and the advisor install guide's package check imports the built `semantic-shadow.js` that phase 004 deletes.

### Purpose
No doctor file and neither install doc names the embedder route or passes the semantic-health flag, and every doctor gate stays as green as phase 001 recorded it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git rev-parse --short HEAD
bf6806ad4b3
$ node -e 'const y=require("./.skilled/node_modules/yaml");const m=y.parse(require("fs").readFileSync(".skilled/commands/doctor/_routes.yaml","utf8"));const t=m.routes.filter(r=>r.command==="/doctor:skill-advisor").map(r=>r.target);console.log(t.length+" targets: "+t.join(" "))'
7 targets: tune rebuild skill-budget parent-skill skill-graph-freshness router-reach embedder
$ grep -o '^    - "Leg [a-z-]*' .skilled/commands/doctor/assets/doctor-setup.yaml | cut -c12- | tr '\n' ' '
sk-code sk-git trigger-index runtime-mirrors advisor embedder delivery 
$ git grep -l include-semantic-health -- .skilled/commands/doctor | wc -l
       8
$ git grep -l -i -E 'embedder|ollama|vector coverage|meaning match' -- .skilled/commands/doctor | wc -l
      18
$ bash .skilled/commands/doctor/scripts/route-validate.sh 2>/dev/null | grep -o '[0-9]* routes validated'
32 routes validated
$ node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check | tr -d '\n '
{"status":"fresh","counts":{"commandMetadata":27,"doctorRoutes":36,"generated":63,"typescriptActive":47,"pythonActive":53},"changed":[]}
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete the embedder route block (`_routes.yaml` 232 to 250), its workflow asset, its router-table row and argument-hint entry, its menu item, accepted answer, help line, valid-target entry, manifest row and presentation section 8, and renumber menu items 6 and 7 to 5 and 6.
- Delete the setup embedder leg and its four presentation rows, and change "seven" to "six" legs in `doctor-setup.yaml` 5 and 6, the setup presentation 19 and `setup.md` 62.
- Delete install step 5 from `doctor-install.yaml`, the install presentation and `CHECKLIST_STEPS`, so `/doctor:setup` becomes step 5.
- Delete the informational vector coverage step and presentation lines in update apply, overlay apply, overlay repin and symlink link, the route contract test's section 4 with its constants and four helpers, `doctor-phrase-reach.cjs` 163's clause and 169's assignment, and the cost script with its two README passages.
- Remove the two embedder rows from `scoring-compatibility.json`, regenerate the four bridge outputs with `derive-command-bridges.cjs`, and take the route and lane out of `INSTALL-SKILLED.md` and the advisor `INSTALL-GUIDE.md`.

### Out of Scope
- The orphan check's model-server class: `orphan-process-check.cjs` 24 to 27 and 232 to 246, its test cases, the scripts README row 130, `setup.md` 72, setup presentation 87, the `_routes.yaml` 407 phrase and the helper fixture rows `tune.jsonl` 60 and `heldout.jsonl` 48 - phase 005 deletes `hf-model-server.cjs`, and until then this class is the only doctor code that finds a running one (`plan.md` ADR-002).
- The `--include-semantic-health` and `--include-embeddings-health` status inputs and their schema - phase 004 removes them once no doctor file passes the flag.
- The `embeddingText` field in the generated bridges and its writer in `derive-command-bridges.cjs` 690 to 693 - phase 003 removes the field with its only reader.
- The other `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` writers, root `README.md`, `.env.example`, the `/create:command` assets and every changelog - phases 003, 004 and 006 own them.
- Raising the `version` field of either install doc by hand - the global pre-commit hook raises it from the staged change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/_routes.yaml` | Modify | Delete the embedder route block, 232 to 250; leave 407 |
| `.skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml` | Delete | The route's 180-line workflow |
| `.skilled/commands/doctor/skill-advisor.md` | Modify | Drop `embedder` from the hint at 3; delete the table row at 61 |
| `.skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt` | Modify | Menu 16 to 18, answers 31 to 33, help 49 to 51 and 56, valid targets 65, manifest row 87, section 8 from 206 to the end at 306 |
| `.skilled/commands/doctor/assets/doctor-setup.yaml` | Modify | "seven" to "six" at 5 and 6; delete the leg at 60 |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` | Modify | "seven" to "six" at 19; delete 40, 55, 64 and 108; leave 87 |
| `.skilled/commands/doctor/setup.md` | Modify | Line 62 names six legs and drops the embedder clause; leave 72 |
| `.skilled/commands/doctor/assets/doctor-install.yaml` | Modify | Line 60 drops item 5 and renumbers `/doctor:setup` to 5 |
| `.skilled/commands/doctor/assets/doctor-install-presentation.txt` | Modify | Delete step 5 at 122 to 124; renumber 125 to `5)` |
| `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` | Modify | Delete the embedder entry at 87 to 92 |
| `.skilled/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs` | Modify | Delete constants 74 to 82, helpers 193 to 228 and section 4 from 324 to 496 |
| `.skilled/commands/doctor/assets/doctor-update-apply.yaml` | Modify | Delete the `coverage_report` key at 212 |
| `.skilled/commands/doctor/assets/doctor-update-presentation.txt` | Modify | Reword 429, delete 467, reword 471 |
| `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml` | Modify | Delete the coverage step at 125 |
| `.skilled/commands/doctor/assets/doctor-overlay-repin.yaml` | Modify | Delete the coverage step at 114 |
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` | Modify | Delete 427, 438, 451, 463, 489 and 501 |
| `.skilled/commands/doctor/assets/doctor-symlink-link.yaml` | Modify | Delete the coverage step at 102 |
| `.skilled/commands/doctor/assets/doctor-symlink-presentation.txt` | Modify | Delete 217 and 252 |
| `.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` | Modify | Drop the clause at 163 and the assignment at 169 |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` | Modify | Delete the two embedder rows, 265 to 270 and 610 to 615, and the commas before them |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` | Regenerate | Generator output |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` | Regenerate | Generated bridge block, embedder row at 768 |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | Regenerate | Generated rows at 97 and 166 |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Regenerate | Generated rows at 2737 to 2740 |
| `.skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs` | Delete | The cost script only the embedder asset calls |
| `.skilled/skills/system-skill-advisor/runtime/scripts/README.md` | Modify | Delete the row at 62 and the paragraph at 66 |
| `INSTALL-SKILLED.md` | Modify | Delete section 86 to 99, row 157 (158 becomes step 5) and row 342; reword 351 |
| `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md` | Modify | Delete 54, section 12 at 275 to 378 and row 387; line 105 imports `lanes/lexical.js`; sections 13 and 14 become 12 and 13 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The Measured Behavior target command prints `6 targets: tune rebuild skill-budget parent-skill skill-graph-freshness router-reach`, and `doctor-skill-advisor-embedder.yaml` no longer exists. |
| REQ-002 | `skill-advisor.md` and `doctor-skill-advisor-presentation.txt` name the same six targets in the hint, router table, menu, accepted answers, help block, valid-targets line and manifest table, numbered 1 to 6 with no gap, with no section 8; the live `route-validate.sh` exits 0 and prints `31 routes validated`. |
| REQ-003 | The Measured Behavior leg command prints `sk-code sk-git trigger-index runtime-mirrors advisor delivery`, and `doctor-setup.yaml`, the setup presentation and `setup.md` say six legs and name no embedder leg. |
| REQ-004 | The install checklist in `doctor-install.yaml`, the install presentation and `CHECKLIST_STEPS` holds five steps ending in `5) /doctor:setup`, and `node --test doctor-install-contract.test.cjs` passes. |
| REQ-005 | `git grep -l include-semantic-health -- .skilled/commands/doctor` prints nothing. |
| REQ-006 | Both embedder rows are gone from `scoring-compatibility.json`, the four bridge outputs come from running `derive-command-bridges.cjs`, its `--check` prints `"status":"fresh"` with `"doctorRoutes":35`, and `git grep -l command-doctor-skill-advisor-embedder -- .skilled/skills/system-skill-advisor` prints nothing. |
| REQ-007 | `run-all.sh` exits 0, the drift guard passes, `sync-runtime-mirrors.cjs --check` prints `PASS`, and `check-markdown-links.cjs` exits 0 with 0 broken links. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | The route contract test keeps sections 1 to 3 only: `grep -c '^test(' skill-advisor-route-contract.test.cjs` prints 7, no `EMBEDDER_` constant or embedder helper remains, and the file passes under `node --test`. |
| REQ-009 | `git grep -n -i -E 'embedder\|ollama\|semantic\|meaning match\|vector coverage' -- INSTALL-SKILLED.md .skilled/skills/system-skill-advisor/INSTALL-GUIDE.md` prints nothing, INSTALL-GUIDE's sections run 0 to 13 with no gap, and its package-check import of `lanes/lexical.js` exits 0. |
| REQ-010 | `measure-embedder-cost.mjs` is deleted and `git grep -l measure-embedder-cost -- . ':!specs'` prints nothing. |
| REQ-011 | `doctor-phrase-reach.cjs` no longer sets `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` or says semantic embeddings are disabled, and `node --test doctor-phrase-reach.test.cjs` passes. |
| REQ-012 | The model-server class is untouched: `git grep -l -i -E 'hf-model-server\|model server\|model_server\|HF_MODEL_SERVER' -- .skilled/commands/doctor` lists the same eight files as at HEAD, and `heldout.jsonl` still hashes to the pinned `e5a41fbc...f143191`. |
| REQ-013 | Advisor `npm test` in the runtime fails no test that passed in phase 001's recorded baseline. |
| REQ-014 | `git grep -n -i -E 'embedder\|ollama\|include-semantic-health\|vector coverage\|meaning match\|semantic lane\|DISABLE_BUILTIN_SEMANTIC\|semantic embeddings' -- .skilled/commands/doctor` prints nothing, and phase 001's residue check in repo mode lists no file under `.skilled/commands/doctor/` outside the eight model-server files and neither install doc. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: At this phase's commit, `git grep -l include-semantic-health -- .skilled/commands/doctor | wc -l` prints 0 (8 at HEAD) and the lane-word count over the doctor folder drops from 18 files to 0.
- **SC-002**: The Measured Behavior commands print 6 targets and 6 legs, and `route-validate.sh` prints `31 routes validated`.
- **SC-003**: `run-all.sh`, `derive-command-bridges.cjs --check`, the drift guard, the mirror check and the link check all pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `derive-command-bridges.cjs` and its input `scoring-compatibility.json` | A compatibility row for a removed route makes the generator throw "requires a known inventoryId", so no output regenerates | Delete both rows before running the generator, and gate with `--check` and the drift guard |
| Risk | Removing a bridge changes which command a corpus prompt routes to | Med | Run advisor `npm test` and compare with phase 001's baseline; a ratchet that needs recapturing is recorded as a finding, not absorbed |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `/doctor:setup` makes one fewer advisor CLI call (the 1500 ms warm-only embedder probe goes), so it never runs longer than at HEAD.

### Security
- **NFR-S01**: No file this phase writes reads or prints a dotenv value, a token or a key, and no hook or permission changes.

### Reliability
- **NFR-R01**: Every route left in `_routes.yaml` resolves to an existing asset and keeps target parity, which the live `route-validate.sh` checks.

---

## 8. EDGE CASES

- Empty input: `/doctor:skill-advisor embedder` after the phase renders the unknown-target failure and lists the six valid targets.
- Maximum input: an operator who answers `7` at the skill-advisor menu gets no target, because the accepted answers stop at 6.
- Failure path: a doctor step still passing `--include-semantic-health` after phase 004 would be refused by the strict schema; the REQ-005 grep proves none is left before phase 004 starts.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 28, LOC: about 800, mostly deleted, Systems: doctor routes, bridge generator, two install docs |
| Risk | 8/25 | Auth: N, API: N, Breaking: Y, one user-facing doctor target goes |
| Research | 3/20 | The per-file inventory is research iteration 3; this plan re-read every line at HEAD |
| Multi-Agent | 2/15 | Workstreams: 1 |
| Coordination | 8/15 | Dependencies: 3, phase 001's baselines, the generator, phase 004's flag removal |
| **Total** | **33/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The generator throws on the stale compatibility rows, or a generated file is edited by hand and drifts | H | M | Delete the two rows first, then run the generator; `--check` and the drift guard catch any hand edit |
| R-002 | Renumbering leaves a menu answer mapped to the wrong target | M | M | The live `route-validate.sh` J1 parity check, plus reading the accepted-answers table after the edit |
| R-003 | Removing the orphan model-server class early hides a server an older checkout started | H | M | The class stays until phase 005 deletes the server (`plan.md` ADR-002) |
| R-004 | Dropping a bridge moves a routing ratchet | M | L | No corpus row or test names the embedder command; advisor `npm test` against phase 001's baseline |

---

## 11. USER STORIES

### US-001: The doctor stops offering a removed lane (Priority: P0)

**As a** maintainer removing the lane, **I want** no doctor route, leg, step or status call to set up or read it, **so that** phase 004 can drop the status flag without a doctor workflow failing.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Install docs point only at commands that exist (Priority: P1)

**As a** new user following `INSTALL-SKILLED.md`, **I want** every printed step and troubleshooting row to name a command that still exists, **so that** the install finishes without a dead step.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None blocking. Does deleting the `semantic_lane_off` row from `INSTALL-SKILLED.md` 342 strand a user who still sees that warning? Decision: no; `advisor-recommend.ts` 512 suppresses the warning when the reason is `lane_weight_zero`, the shipped default, and the row's repair names the route this phase removes.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
