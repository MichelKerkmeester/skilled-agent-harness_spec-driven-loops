---
title: "Feature Specification: Phase 13: skilled-and-doc-alignment"
description: "Runs /local-skilled-alignment over every .skilled change phases 001 to 012 make and /local-doc-alignment over every doc topic they touch, fixes what the two findings reports name, and re-runs both until each report holds zero open findings."
trigger_phrases:
  - "skilled and doc alignment"
  - "phase 13 skilled and doc alignment"
  - "local-skilled-alignment"
  - "local-doc-alignment"
  - "alignment findings report"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 13: skilled-and-doc-alignment

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 14 |
| **Predecessor** | 012-manual-testing-scenarios |
| **Successor** | 014-deep-review |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh --strict` prints `RESULT: PASSED` for this folder. What passes to 014 is `evidence/` and `scratch/rebuttals.md`, so the review reads a checked surface rather than an assumed one. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the OpenBot parity build. Phases 001 to 012 change `.skilled/bin/bots.cjs`, the runtime modules under `.skilled/skills/system-skilled-bots/runtime/lib/` and the skill's own docs. This phase is the one that checks those changes against the standards they are held to, using the two operator-local alignment commands the repository already ships.

**Scope Boundary**: The `system-skilled-bots` topic entry in `topics.json`, one `/local-skilled-alignment` run over the packet's `.skilled` change set, one `/local-doc-alignment` run over that topic, the fixes both reports name and the re-runs that prove the fixes landed. The 001 to 012 feature work itself, a new alignment command, a new surface in `surface-map.yaml`, and a CI gate are out of scope.

**Dependencies**:
- Phases 001 to 012 are closed, so the `.skilled` change set the skilled-alignment run scopes is the packet's own and not a moving target. The parent map names each phase's dependency [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "PHASE DOCUMENTATION MAP", row 13]
- `/local-skilled-alignment` resolves its scope from git topology with `resolve-scope.cjs`, so the change set is the first-parent commits from `origin/main` to `HEAD` unless `--base` names another ref [SOURCE: .skilled/commands/local-skilled-alignment.md:93]
- `/local-doc-alignment` resolves a topic from `topics.json` and stops at its no-topic display when none matches, so this phase must add the topic before the doc run can happen at all [SOURCE: .skilled/commands/local-doc-alignment.md:41]
- The lane presets in `executors.json` are the same executors this packet's build may use, so a lane and a build worker share one roster [SOURCE: .skilled/commands/assets/local-skilled-alignment/executors.json:9]
- The surface map already fires S1 to S16 for a `.skilled` scope, so no new surface is needed [SOURCE: .skilled/commands/assets/local-skilled-alignment/surface-map.yaml:103]

**Deliverables**:
- A `system-skilled-bots` topic in `.skilled/commands/assets/local-doc-alignment/topics.json`: a title, the `terms` that reach the skill docs, the README, the feature catalog, the manual testing playbook, the references and the bots CLI help, three `codeRoots` and the three package checks that already exist for those docs. The entry's every field and its decided values are `design/records.md` section 2, and the model shape it copies is section 2.1
- One `/local-skilled-alignment :auto` run over the packet's `.skilled` change set, writing `report.md`, `findings.json` and `fix-plan.md` under `<state>/local-skilled-alignment/system-skilled-bots/<UTC timestamp>/`
- One `/local-doc-alignment system-skilled-bots :auto` run, writing the same three files under `<state>/local-doc-alignment/system-skilled-bots/<UTC timestamp>/`
- The fixes for every finding either report names, and a recorded reason for every finding the fix pass rebuts or hands on
- The re-runs that prove each report holds zero open findings
- `evidence/skilled-alignment/` and `evidence/doc-alignment/`, each holding the last run's `report.md`, `findings.json` and `recheck.md`, so the clean close is checkable after the run folders are pruned. The manifest is `evidence/README.md`
- `scratch/rebuttals.md`, one heading per settled finding, which is the second half of the handoff to 014. Its grammar is `design/records.md` section 11
- The design artifacts a builder reads instead of deciding: `design/records.md` for every record field, `design/state-machines.md` and `design/sequences.md` for the run and finding lifecycles, `design/refusals.md` for every stop, `design/mockups.md` for every screen and `design/fixtures/` for the goldens
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 001 to 012 change the bots CLI, the runtime modules and the skill's own docs, and nothing in the packet checks either against the standard it is held to. Two operator-local commands exist for exactly that check and neither has ever run over these docs: the doc-alignment output root for this repository does not exist, and `topics.json` carries no topic whose terms reach the bots docs, so `/local-doc-alignment` has no topic to resolve and stops at its no-topic display [SOURCE: .skilled/commands/local-doc-alignment.md:41]. A skill doc that names a verb the CLI does not have, or a feature-catalog entry that describes a field the runtime dropped, therefore ships unread.

### Purpose
Run both alignment commands over the packet's own changes and docs, fix every finding they report and re-run both until each report holds zero open findings, so the packet closes on a checked surface rather than an assumed one.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ rg -c 'system-skilled-bots' .skilled/commands/assets/local-doc-alignment/topics.json
exit=1
$ ls "${XDG_STATE_HOME:-$HOME/.local/state}/local-doc-alignment/system-skilled-bots"
ls: /Users/michelkerkmeester/.local/state/local-doc-alignment/system-skilled-bots: No such file or directory
exit=1
$ ls "${XDG_STATE_HOME:-$HOME/.local/state}/local-skilled-alignment/system-skilled-bots"
20261123T205442Z
20261124T065827Z
$ node .skilled/bin/bots.cjs --help | wc -l
35
$ rg -n '^const VERB_SPECS' .skilled/bin/bots.cjs
64:const VERB_SPECS = {
$ node -e "const t=require('./.skilled/commands/assets/local-doc-alignment/topics.json');console.log(Object.keys(t.topics).length)"
10
```

The first two commands are the measured gap. `topics.json` holds ten topics and none of them names this skill, so the doc-alignment scope step has no topic to resolve and the command stops before it reads a single doc [SOURCE: .skilled/commands/assets/local-doc-alignment/topics.json:15]. The doc-alignment output root for this repository does not exist, so no doc-alignment run has ever been made here, while the skilled-alignment root holds two runs, one full run and one `--recheck`, which is the asymmetry this phase closes [SOURCE: .skilled/commands/local-skilled-alignment.md:58] [SOURCE: .skilled/commands/local-doc-alignment.md:55].

The last three commands are the surface the doc run has to read and the shape the new topic copies. The bots CLI help is a 35-line block that lists eleven verbs, and the verb table it must agree with is `VERB_SPECS` at line 64 of the same file [SOURCE: .skilled/bin/bots.cjs:19] [SOURCE: .skilled/bin/bots.cjs:64]. Nothing compares the two today: one test asserts the usage line reaches stderr on a bad invocation, and none compares the verb list to the table, so a verb added to the table and left out of the help is invisible to every gate the packet runs [SOURCE: .skilled/skills/system-skilled-bots/runtime/tests/installer.vitest.ts:1094]. Phases 001 to 011 add eight more verb groups to that table, `activity`, `routines`, `ui`, `remember`, `secret`, `skill`, `chat` and `channel`, so the gap widens with every phase that lands [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "Files to Change", row `.skilled/bin/bots.cjs`].

The block is measured before 001 lands, so the 35-line help and the eleven-verb table are today's numbers. This phase re-measures both after 012 closes and records the new pair in `implementation-summary.md`, because the count is the one number the doc run's own check compares.

The topic's three `checks` are all green today: the skill-package and catalog validators exit 0, and the playbook validator prints `violations=0 warnings=0` over 58 scenarios in 17 categories. The root `manual-testing-playbook.md` links every per-feature file, because 012's root-index task closed the seventeen `INDEX_ORPHAN_FILE` rows that stood before it. The criterion therefore reads `violations=0` as a regression guard rather than as work this phase inherits, and a row that reappears is a finding the fix pass closes.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `system-skilled-bots` topic to `.skilled/commands/assets/local-doc-alignment/topics.json`, with the `terms` that reach the skill docs, the README, the feature catalog, the manual testing playbook, the references and the bots CLI help, three `codeRoots`, and the three package checks that already exist. Without it the doc run has no topic and stops, which is the measured gap above [SOURCE: .skilled/commands/local-doc-alignment.md:41]. The entry's every field is `design/records.md` section 2 and the model shape it copies is section 2.1
- Run `/local-skilled-alignment :auto` over the packet's `.skilled` change set, so the battery replays every surface the scope fires and four read-only lanes review them [SOURCE: .skilled/commands/local-skilled-alignment.md:95]
- Run `/local-doc-alignment system-skilled-bots :auto`, so every tracked doc that names the topic is read against the topic's code roots whether or not it changed [SOURCE: .skilled/commands/local-doc-alignment.md:11]
- Fix every finding either report names, and record a reason for every finding the fix pass rebuts or hands on, so no finding is dropped silently
- Re-run both until each report holds zero open findings
- Copy the last run of each command into `evidence/skilled-alignment/` and `evidence/doc-alignment/`, and record the two roots, the clean criterion and the re-measured counts in `implementation-summary.md`
- Write `scratch/rebuttals.md`, one heading per settled finding, and hand it and `evidence/` to 014

### Out of Scope
- The 001 to 012 feature work itself - this phase fixes only what the two reports name, and a finding that needs a runtime change is recorded and handed to 014 rather than fixed here
- A new alignment command or a new surface in `surface-map.yaml` - the map already fires S1 to S16 for a `.skilled` scope, so a new surface would duplicate a check that exists [SOURCE: .skilled/commands/assets/local-skilled-alignment/surface-map.yaml:103]
- `--fix literal` as the fix path - it applies only exact literal fixes the critic did not overturn, and 36 of the 40 findings the last full run reported were `judgment`, so the fix pass is a hand edit [SOURCE: .skilled/commands/local-skilled-alignment.md:15]
- The `specs/` tree - the doc-alignment scope skips specs by design, so this packet's own docs are checked by `validate.sh` and not by the doc run [SOURCE: .skilled/commands/local-doc-alignment.md:82]
- A CI gate over either command - both are operator-local and write outside the checkout, so neither has a workflow to gate

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/assets/local-doc-alignment/topics.json` | Modify | The `system-skilled-bots` topic: title, four `terms`, three `codeRoots`, `lanes`, three `checks`. The decided entry is `design/records.md` section 2.2 and the model shape it copies is section 2.1 |
| `.skilled/skills/system-skilled-bots/SKILL.md` | Modify | Whatever the skilled-alignment report names on the hub entry file |
| `.skilled/skills/system-skilled-bots/ROUTER.md` | Modify | Whatever the report names on the surface router |
| `.skilled/skills/system-skilled-bots/README.md` | Modify | Whatever the report names on the skill README |
| `.skilled/skills/system-skilled-bots/feature-catalog/` | Modify | The entries the report names, and the root catalog row each one needs |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/` | Modify | The scenarios the report names, and the root playbook row each one needs |
| `.skilled/skills/system-skilled-bots/*/references/` | Modify | The reference files the report names |
| `.skilled/bin/bots.cjs` | Modify | The `USAGE` block, so the help lists every verb `VERB_SPECS` dispatches. The block today and the eight verb groups 001 to 011 add are `design/mockups.md` section 9 |
| `specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/evidence/skilled-alignment/` | Create | The last skilled run's `report.md`, `findings.json` and `recheck.md`, copied out of the state root |
| `specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/evidence/doc-alignment/` | Create | The last doc run's `report.md`, `findings.json` and `recheck.md`, copied out of the state root |
| `specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/scratch/rebuttals.md` | Create | One heading per settled finding, with the six fields `design/records.md` section 11 fixes, including the `Phase` line 014's seeded intake reads |
| `specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/implementation-summary.md` | Modify | The two report roots, the clean criterion and the re-measured help and verb counts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `topics.json` carries a `system-skilled-bots` topic whose `terms` reach the skill docs, the README, the feature catalog, the manual testing playbook, the references and the bots CLI help, and whose `codeRoots` name the runtime and the CLI, so `/local-doc-alignment system-skilled-bots` resolves a topic instead of stopping at the no-topic display |
| REQ-002 | `/local-skilled-alignment :auto` runs over the packet's `.skilled` change set and writes `report.md`, `findings.json` and `fix-plan.md` under `<state>/local-skilled-alignment/system-skilled-bots/<UTC timestamp>/` |
| REQ-003 | `/local-doc-alignment system-skilled-bots :auto` runs and writes `report.md`, `findings.json` and `fix-plan.md` under `<state>/local-doc-alignment/system-skilled-bots/<UTC timestamp>/` |
| REQ-004 | Every finding either report names is fixed, or is recorded as `handed_off` or `rebutted` with its reason in `scratch/rebuttals.md` and in the run's `dispositions.json`, so no finding is dropped silently |
| REQ-005 | Both commands re-run until each report's `Open findings:` line reads `0`, and the re-run's `still_open` and `new` buckets both read `0`. The line's grammar is `- Open findings: <open> (<handed off> handed off, <rebutted> rebutted)`, so a criterion matches its prefix and not the whole line |
| REQ-009 | After the last run of each command, `report.md`, `findings.json` and `recheck.md` are copied into `evidence/skilled-alignment/` and `evidence/doc-alignment/` in this folder, and `evidence/` and `scratch/rebuttals.md` are named as the two inputs 014 reads, so the clean close is checkable after the run folders are pruned |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The bots CLI help lists every verb `VERB_SPECS` dispatches and no verb the table lacks, so the help block and the verb table agree on one verb set. The pair is measured at this phase's setup and recorded, because both counts move as phases 001 to 011 land |
| REQ-007 | The skill docs, README, feature catalog and manual testing playbook name the same verbs and fields the runtime ships, so a doc claim and its code root cannot disagree |
| REQ-008 | `implementation-summary.md` names both report roots, the clean criterion and the re-measured help-line and verb counts |

This phase fixes findings of every severity, and 014 leaves P2 open, by intent. The two rules are not in conflict: a P2 that this phase's own reports name is fixed here, and a P2 that 014's review finds afterwards is recorded and left. The reason is that this phase's clean criterion is a count of open findings and a count cannot be read as clean while a P2 sits in it, while 014's verdict is a judgement about the build and a P2 is not a blocker for it.

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node -e "const t=require('./.skilled/commands/assets/local-doc-alignment/topics.json');console.log(t.topics['system-skilled-bots'].codeRoots.length)"` prints `3`, so the topic resolves and names three code roots.
- **SC-002**: The skilled-alignment run folder holds `report.md`, `findings.json` and `fix-plan.md`, and its `report.md` line `- Open findings:` reads `0`.
- **SC-003**: The doc-alignment run folder holds the same three files, and its `report.md` line `- Open findings:` reads `0`.
- **SC-004**: The recheck's `recheck.md` table rows `still_open` and `new` both read `0`.
- **SC-005**: `node .skilled/bin/bots.cjs --help` lists every key of `VERB_SPECS`, and the count of verb lines in the help equals the count of `VERB_SPECS` keys.
- **SC-006**: `rg -n '^- Open findings: 0' evidence/*/report.md` prints two lines, one per evidence folder, so the clean close is checkable from the packet and not only from the operator's state root.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:design-references -->
## 5b. DESIGN REFERENCES

The artifacts a builder reads instead of deciding. Each one is a file in this folder and each one is the only place its subject is fixed.

| Artifact | Fixes | Read it before |
|----------|-------|----------------|
| `design/records.md` | Every field of the topic entry, `scope.json`, `battery.json`, `findings.json`, `dispositions.json`, `report.md`, `fix-plan.md`, `recheck.json`, `recheck.md`, `applied.json`, `scratch/rebuttals.md` and `evidence/` | Writing the topic, reading a report or writing a rebuttal |
| `design/state-machines.md` | The skilled run, the doc run, the finding, the recheck bucket, the topic and this phase's own clean-criterion loop | Deciding what a run's state means or when the fix pass reopens |
| `design/sequences.md` | The five sequences, each naming the script, the file it writes and the line it prints | Running either command or copying the evidence |
| `design/refusals.md` | Every way either command stops, with the line it prints and the exit status, plus the aggregator's problems and the five recheck buckets | Meeting a stop and deciding what to do |
| `design/mockups.md` | Every screen a person sees, including the no-topic display and the bots help block | Editing the help block or reading a result |
| `design/fixtures/` | One golden per record, each produced by the script that writes it | Changing a record shape |

The packet's own contracts are cited by file and section and never copied. The three that bear on this phase are `contracts/records.md` for why a run folder is not a runtime record, `contracts/cli-json.md` for why `findings.json` is a bare array and `contracts/refusals.md` section 3.11 for why this phase adds no refusal. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "Durable records of the OpenBot parity build"] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/cli-json.md, section "1. THE RULE"] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "3.11 Phases 012 to 014"]
<!-- /ANCHOR:design-references -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `python3` and `node` on PATH, because the topic's three `checks` are a Python package validator, a Node playbook validator and a Python catalog validator | A missing interpreter makes its check row `cannot_run`, which the battery reports rather than passes | Run `command -v python3 node` before the doc run and record both versions in `implementation-summary.md` |
| Dependency | A lane CLI on PATH for the `--lanes` preset, since a `cli-pi`, `cli-opencode`, `cli-codex` or `cli-vibe` preset dispatches a binary [SOURCE: .skilled/commands/local-skilled-alignment.md:95] | An absent binary fails the lane, and the critic then scores a partial lane set | Fall back through the ladder in `plan.md` §8, and `--lanes=native` as the last resort, which needs no binary |
| Risk | A fix pass that edits a doc to match a runtime bug rather than fixing the runtime | The doc becomes a record of the bug, and the next reader trusts it | A finding whose code root is wrong is recorded and handed to 014, never fixed by editing the doc to agree with it |
| Risk | The orchestrator runs inside a Vibe session, where `cli-mistral-vibe` refuses to load [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:16] | The `vibe-deepseek` lane preset and the `cli-mistral-vibe` build executor are both unavailable | The ladder skips `cli-mistral-vibe` when `VIBE_SESSION=1` is set and continues to `cli-codex`, which is the last fallback anyway |
| Risk | `cli-devin`'s paid families are gated by a quota, and the operator records that window as weekly [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237] | A dispatch is refused mid-wave and the wave stalls | Probe with a trivial read-only call before the wave, and skip `cli-devin` when the probe is refused |
| Risk | A re-run that reports a new finding the first run missed | The clean criterion is met on a run that is not the last one | The clean criterion is read from the last run only, and a `new` bucket above `0` reopens the fix pass |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A: this phase runs two operator-local commands and ships no service, so no response-time target applies. The one budget that does apply is the lane timeout, which `executors.json` sets per preset [SOURCE: .skilled/commands/assets/local-skilled-alignment/executors.json:41]
- **NFR-P02**: N/A: no throughput target applies for the same reason. The run count is bounded by `--keep`, which prunes to the newest 10 run folders [SOURCE: .skilled/commands/local-skilled-alignment.md:99]

### Security
- **NFR-S01**: Neither command stages, commits or pushes, and both write only under their output folder, which sits outside the checkout, so a run cannot change the tree it reads [SOURCE: .skilled/commands/local-skilled-alignment.md:15] [SOURCE: .skilled/commands/local-doc-alignment.md:17]
- **NFR-S02**: No credential value reaches a report, a prompt or a file in the checkout. The env-token check writes `env-tokens.json` into the run folder, and a lane prompt names a variable rather than its value [SOURCE: .skilled/commands/local-skilled-alignment.md:94]

### Reliability
- **NFR-R01**: A check row that cannot run is reported `cannot_run`, never a silent pass, so an absent interpreter or binary shows as a gap rather than a green row [SOURCE: .skilled/commands/assets/local-skilled-alignment/surface-map.yaml:40]
- **NFR-R02**: A finding the critic overturns is not counted, so the open count is the critic's count and not the lanes' raw count [SOURCE: .skilled/commands/local-skilled-alignment.md:97]
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a scope with no `.skilled` change fires no surface, and the battery writes zero rows. The run still writes `report.md` with `Open findings: 0`, and the phase records that the scope was empty rather than claiming a clean pass over a change set that did not exist.
- Maximum input: a scope of 700 or more files, which is what the last full run scoped, splits the docs into `--lane-count` lanes of 1 to 8 and caps the per-file check at `max_items: 400`, so the overflow becomes one `cannot_run` row rather than a dropped file [SOURCE: .skilled/commands/assets/local-skilled-alignment/surface-map.yaml:153]
- Failure path: an unknown topic exits with the presentation contract's argument error and writes no run folder, so a typo in the topic name is distinguishable from a clean run by the absence of the folder rather than by a green report [SOURCE: .skilled/commands/assets/local-doc-alignment/local-doc-alignment-presentation.txt:22]
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One JSON topic entry, one CLI help block and the doc edits two reports name. No new module and no new command |
| Risk | 6/25 | The fixes are doc edits and one help block. The one real risk is editing a doc to agree with a runtime bug, which the handoff rule in §6 covers |
| Research | 5/20 | Both command contracts are read in full, and the topic shape is copied from the ten entries already in `topics.json` |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The one decision this phase could not settle from the docs is whether a finding whose code root is wrong is fixed here or handed on, and §6 settles it: it is recorded and handed to 014.
<!-- /ANCHOR:questions -->

---
