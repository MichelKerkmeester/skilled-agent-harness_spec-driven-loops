---
title: "Implementation Plan: Phase 2: doctor-surface"
description: "Delete the embedder route and every doctor line that sets up, checks or reports the lane, in one commit with the install contract test and the bridge regeneration. The two bridge input rows are a hand edit; the four bridge outputs come only from running the generator. The orphan check's model-server class waits for phase 005."
trigger_phrases:
  - "doctor surface plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: doctor-surface

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML route manifest and workflow assets, plain-text presentation contracts, Markdown, Node CommonJS (`node:test` suites, the bridge generator), one JSON input |
| **Framework** | The doctor router contract: `_routes.yaml` names every target, one workflow YAML per target, one presentation file per command, checked by `route-validate.sh` |
| **Storage** | None; the phase writes no database and no user-machine state |
| **Testing** | `node:test` suites through `run-all.sh`, the live `route-validate.sh`, the advisor runtime's vitest drift guard and full `npm test` |

### Overview
The change is almost all deletion across 19 doctor files, the cost script, two install docs and one bridge input, plus a regeneration of four bridge outputs. Line numbers below were re-read at `bf6806ad4b3`; they match research iteration 3 except `doctor-overlay-apply.yaml`, whose coverage step moved from 124 to 125. This plan also adds what the research table missed: help-block line 49 and the renumbering at 50, 51 and 56 of the skill-advisor presentation, the word "seven" at `doctor-setup.yaml` 5 and 6 and setup presentation 19, and two more route-test helpers (`yamlStrings`, `phaseText`) that only section 4 uses. Two research open checks are closed: `advisor_status` stays declared on the tune and rebuild routes (`_routes.yaml` 122 and 145), and `scoring-compatibility.json` is a generator input (read at `derive-command-bridges.cjs` 918, never written).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exits 0, `derive-command-bridges.cjs --check` prints `"status":"fresh"` with `"doctorRoutes":35`, and `git grep -l include-semantic-health -- .skilled/commands/doctor` prints nothing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manifest-driven command router with generated scorer bridges.

### Key Components
- **`_routes.yaml`**: the single source of the doctor routes. The bridge generator, `route-validate.sh` and both contract tests read it, so the route block, the router displays, the install checklist and the install test entry change in one commit.
- **Workflow assets and presentation files**: the setup, install, update, overlay and symlink workflows and their presentations, edited by deletion; only the counts and the update presentation's two coverage sentences are reworded.
- **Contract tests**: `skill-advisor-route-contract.test.cjs` loses section 4 and the code only it used; `doctor-install-contract.test.cjs` loses one `CHECKLIST_STEPS` entry. No test file is renamed or deleted, and `run-all.sh` collects suites by glob, so no runner reference changes.
- **`derive-command-bridges.cjs`**: reads `_routes.yaml` and `scoring-compatibility.json` and writes `command-bridges.generated.json` plus the generated blocks of `projection.ts`, `command-attach.ts` and `skill_advisor.py`.
- **Install docs**: `INSTALL-SKILLED.md` and the advisor `INSTALL-GUIDE.md`, which link to each other's embedder section and so change together.

### Data Flow
`_routes.yaml` and `scoring-compatibility.json` feed the generator, which writes the four bridge outputs the advisor scorer reads. The doctor router reads `_routes.yaml` to bind a target, then loads that target's workflow and the command's presentation. Removing the route therefore removes its bridge, its menu entry and its workflow in one pass, and the generator refuses to run until the compatibility rows for the route are gone too.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `_routes.yaml` 232 to 250 | Declares the embedder route, its flag-passing status call and six phrases | update: delete the block | The Measured Behavior target command prints 6 targets |
| `doctor-skill-advisor-embedder.yaml` | The route's workflow | delete | `test -e` exits 1 |
| `skill-advisor.md`, skill-advisor presentation | Display the target set | update: drop the target and renumber | Live `route-validate.sh` J1 passes and prints `31 routes validated` |
| `skill-advisor-route-contract.test.cjs` | Pins the route, asset, approval phase and host guard | update: delete section 4, its constants and four helpers | `grep -c '^test('` prints 7; the file passes |
| Install yaml, presentation and contract test | Checklist step 5 and its manifest owner | update in one commit | `node --test doctor-install-contract.test.cjs` passes |
| Setup yaml, presentation and `setup.md` | The embedder leg and the leg count | update | The leg command prints six legs |
| Update apply, overlay apply, overlay repin, symlink link and their presentations | Informational coverage line through the flag | update: delete | `git grep -l include-semantic-health -- .skilled/commands/doctor` prints nothing |
| `doctor-phrase-reach.cjs` 163 and 169 | Writes `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` for its frozen regime | update: delete the clause and the assignment | `node --test doctor-phrase-reach.test.cjs` passes |
| `scoring-compatibility.json` | Hand-authored generator input | update by hand | `node -e` JSON parse exits 0 and `rg -c embedder` prints 0 |
| Bridge outputs (JSON, `projection.ts`, `command-attach.ts`, `skill_advisor.py`) | Generator output the scorer reads | regenerate, never hand-edit | `--check` fresh; drift guard passes |
| `measure-embedder-cost.mjs` and the runtime scripts README | Operator script only the embedder asset calls | delete the script, the row at 62 and the paragraph at 66 | `git grep -l measure-embedder-cost -- . ':!specs'` prints nothing |
| `INSTALL-SKILLED.md`, advisor `INSTALL-GUIDE.md` | Send users to the route; 105 imports the lane's build | update | REQ-009 grep prints nothing; link check 0 broken |
| `orphan-process-check.cjs`, its test, scripts README 130, `setup.md` 72, setup presentation 87, `_routes.yaml` 407, `tune.jsonl` 60, `heldout.jsonl` 48 | The model-server class and its wordings | unchanged until phase 005 | The model-server file list is the same eight files as at HEAD |
| `.codex`, `.pi` and `.vibe` doctor prompts; `.claude`, `.cursor` and `.opencode` doctor entries | Pointer prompts with no lane text; symlinks into `.skilled` | not a consumer | `sync-runtime-mirrors.cjs --check` prints `PASS` |
| `scripts/tests/README.markdown` row 53 | Describes the route test in general terms | unchanged | `rg -n -i embedder` on it prints nothing |
| Root `README.md`, `.env.example`, `/create:command` assets, changelogs | Lane prose outside the doctor | not in this phase | Phase 006 owns them |

Required inventories:
- Same-class producers: `git grep -l include-semantic-health -- .skilled/commands/doctor` lists 8 files at HEAD (the route manifest, the embedder asset, setup, update apply, overlay apply, overlay repin, symlink link and the route test); every one is edited or deleted here.
- Consumers of changed symbols: `git grep -n -i 'skill-advisor-embedder\|doctor:skill-advisor embedder' -- . ':!specs'` lists the four generator outputs, the compatibility input, `INSTALL-GUIDE.md` 54 and 362, and two changelog lines left to phase 006. No advisor test or routing corpus row names the command or its six phrases.
- Matrix axes: display surface (argument hint, router table, menu, accepted answers, help block, valid-targets line, manifest table) by target (six); install surface (workflow, presentation, test) by step (five).
- Algorithm invariant: the manifest's `/doctor:skill-advisor` target set equals every display's target set, and every install checklist step resolves to a manifest route and appears as `N) <command>` in both the workflow and the presentation.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms the HEAD numbers in `spec.md` Measured Behavior and reads phase 001's recorded gate baselines. Implementation deletes the route and its displays, the setup leg, the install step, the coverage lines, the route-test section, the phrase-reach lines and the cost script, removes the two compatibility rows, runs the generator, and edits the two install docs. Verification runs `run-all.sh`, the live `route-validate.sh`, `derive-command-bridges.cjs --check`, the drift guard, the mirror check, the link check and advisor `npm test`, then the doctor greps. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The two edited contract tests and `doctor-phrase-reach.test.cjs`, each run alone first | `node --test <file>` |
| Integration | Every doctor suite, the live route validator, the bridge generator check, the drift guard, the mirror check, the link check and the advisor suite | `run-all.sh`, `route-validate.sh`, `derive-command-bridges.cjs --check`, `npx vitest run tests/command-bridges-drift-guard.vitest.ts`, `sync-runtime-mirrors.cjs --check`, `check-markdown-links.cjs`, `npm test` |
| Manual | Read the skill-advisor menu and accepted-answers table after the renumbering, and the install checklist in both its workflow and presentation | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `derive-command-bridges.cjs` | Internal | Green | The bridges cannot regenerate and REQ-006 stays unmet |
| `.skilled/node_modules/yaml` | Internal | Green | The route test and the Measured Behavior target count cannot parse the manifest |
| Advisor runtime `node_modules/.bin/vitest` | Internal | Green | `run-all.sh` exits 2 and the drift guard cannot run |
| Phase 001's recorded gate baselines | Internal | Yellow | REQ-013 has no baseline to compare against; phase 001 is planned, not built |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A gate stays red after three fix rounds, or `route-validate.sh` J1 or the install contract test fails in a way the edits cannot fix.
- **Procedure**: `git revert` the phase commit, which restores the route, the asset, the cost script and the four generated outputs together; then `derive-command-bridges.cjs --check` must print `"status":"fresh"` with `"doctorRoutes":36`.
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
| Setup (HEAD numbers, 001 baselines) | Phase 001 committed | Implementation |
| Implementation (doctor edits, compatibility rows, regeneration, install docs) | Setup | Verification |
| Verification (all gates, greps, validate) | Implementation | Phase 003 |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Setup     │────►│  Route block +   │────►│ Regenerate  │
│  baselines  │     │ compat rows gone │     │   bridges   │
└─────────────┘     └────────┬─────────┘     └──────┬──────┘
                             │                      │
                    ┌────────▼─────────┐     ┌──────▼──────┐
                    │ Displays, legs,  │────►│   Verify    │
                    │ steps, tests,    │     │  all gates  │
                    │ docs, script     │     └─────────────┘
                    └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Route block and compatibility rows | Setup | A manifest and generator input without the route | Regeneration, displays |
| Regeneration | Route block and compatibility rows | Four bridge outputs without the embedder bridge | Verification |
| Displays, setup, install, coverage lines, tests, phrase reach, cost script, install docs | Route block | A doctor surface that never names the route | Verification |
| Verification | Regeneration, displays | Gate results recorded in `implementation-summary.md` | Phase 003 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Doctor edits, route block through route test** - about 90 minutes - CRITICAL
2. **Compatibility rows and regeneration** - about 15 minutes - CRITICAL
3. **Gates: `run-all.sh`, advisor `npm test` and the rest** - about 40 minutes - CRITICAL

**Total Critical Path**: about 2.5 hours

**Parallel Opportunities**:
- The coverage-line deletions in update, overlay and symlink and the install doc edits can run simultaneously
- The cost script deletion and the phrase-reach edit can run after Setup, apart from the route work
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baselines confirmed | The Measured Behavior commands reprint 7 targets, 7 legs, 8 flag files and `"doctorRoutes":36`, and phase 001's gate rows are read | Setup |
| M2 | Doctor and bridges consistent | `route-validate.sh` prints `31 routes validated` and `--check` prints `"doctorRoutes":35` | Implementation |
| M3 | Phase ready | Every gate passes and `validate.sh --strict` prints `RESULT: PASSED` | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: One commit for the route, its displays, the install step, the tests and the regenerated bridges

**Status**: Accepted

**Context**: Three checks read the route manifest together: `route-validate.sh` J1 compares the manifest's target set with every display, `doctor-install-contract.test.cjs` 101 to 106 resolves each checklist step to a manifest route, and the generator derives the bridges from it. Goal decision D2 puts the bridge input edit and its regeneration in this phase's commit.

**Decision**: Land every edit in `spec.md` Files to Change as one commit, with the generator run after the route block and the compatibility rows are gone.

**Consequences**:
- No intermediate state leaves a checklist step without an owner or a display listing a target the manifest lacks.
- The commit is large, about 28 files; the task order and the gates in `tasks.md` keep it reviewable.

**Alternatives Rejected**:
- One commit per surface: the route test, the install test and route-validate would fail between commits.

### ADR-002: The orphan check's model-server class stays until phase 005

**Status**: Accepted

**Context**: Research 3.2 lists the class with the doctor surface, while research 5.2 puts it in step 4 and the parent phase map gives it to phase 005. Research F9 records that the class is the only doctor code that recognizes a running `hf-model-server.cjs`, and phase 005 deletes that server.

**Decision**: Leave `orphan-process-check.cjs` 24 to 27 and 232 to 246, its test cases, scripts README 130, `setup.md` 72, setup presentation 87, `_routes.yaml` 407 and the `tune.jsonl` 60 and `heldout.jsonl` 48 rows unchanged. Phase 005 removes them in the commit that deletes the server; its `_routes.yaml` 407 edit needs a bridge regeneration there too, and its `heldout.jsonl` edit needs the digest at `doctor-helper-match.test.cjs` 44 recomputed.

**Consequences**:
- A server started by an older checkout stays visible to `/doctor:setup` while the server code still exists.
- Eight doctor files still name the model server after this phase, which the residue check lists until phase 005.

**Alternatives Rejected**:
- Remove the class here: the doctor would lose sight of a server that can still run for three more phases.

### ADR-003: The cost script goes with the route, and goal decision D1 still holds

**Status**: Accepted

**Context**: Goal decision D1 allows no advisor runtime code change in this phase. `runtime/scripts/measure-embedder-cost.mjs` lives under the runtime folder, but the embedder asset at 44 and 111 is its only caller, it imports the shared package's built Ollama adapter, and parent phase map row 2 and research 5.2 step 1 both name it here.

**Decision**: Delete the script with its README row and paragraph. It is an operator measurement script that nothing on the advisor's prompt, daemon or status path loads, so D1 is not engaged. The four regenerated outputs are under D2, not D1.

**Consequences**:
- No caller is left pointing at a deleted file, and the advisor build does not compile `.mjs` scripts, so no build input changes.
- A reviewer who reads D1 as "nothing under `runtime/`" sees one deletion there; this ADR is the answer.

**Alternatives Rejected**:
- Leave it for phase 004 or 005: it would sit with no caller for two commits, and the parent phase map would disagree with the work.
