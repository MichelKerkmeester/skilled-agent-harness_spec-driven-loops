---
title: "Feature Specification: Reference evidence research for the OpenBot parity build"
description: "The 003 build plan names what to build and how deeply, and no run has collected, phase by phase, the reference code a builder should lift or mirror. Five vendored crates in openhuman-full have never been read. This run collects that evidence in 40 iterations before the build starts."
trigger_phrases:
  - "reference evidence research"
  - "phase 4 reference evidence research"
  - "openbot reference evidence"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Reference evidence research for the OpenBot parity build

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-plan-depth-research |
| **Successor** | None |
| **Handoff Criteria** | `research/research.md` names, for each of the fourteen 003 phases, the reference code to lift or mirror and the pitfalls to guard against, and ranks the features the ten repos have that the plan and the skip list both miss |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the research runs for the OpenBot parity work: reference evidence for the build.

**Scope Boundary**: The ten reference repos under `specs/system-skilled-bots/context/`, read against the fourteen phase folders and the `contracts/` folder of `specs/system-skilled-bots/003-openbot-parity-build`. The run reads and reports. It edits no build document.

**Dependencies**:
- The ten reference repos, which are gitignored and exist only in the primary checkout.
- The fourteen 003 phase folders and `003-openbot-parity-build/contracts/`.
- The three earlier syntheses, so this run does not repeat a finding they already carry.
- The built skilled-bots runtime under `.skilled/skills/system-skilled-bots/`.

**Deliverables**:
- `research/research.md`, the merged synthesis with one evidence section per 003 phase and a ranked list of net-new features.
- `research/resource-map.md` and `research/findings-registry.json`, the resource map and the merged findings registry.
- Four lineage folders under `research/lineages/`, each with 10 iteration records.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The three earlier runs settled what to build, whether the plan holds together and whether each phase is planned deeply enough. None of them collected, phase by phase, the reference files and lines a builder should lift or mirror, or the failures those repos already hit. The build hands most work to DeepSeek Flash executors, so a builder without that evidence writes each module from the plan's prose alone. One input is also unread: `openhuman-full` carries five vendored crates that are empty in `openhuman-main`, and no synthesis or spec mentions the repo.

### Purpose
A per-phase evidence pack and a ranked list of net-new features, so each build phase starts from cited reference code and known pitfalls.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls specs/system-skilled-bots/context/ | grep -v '\.log$' | wc -l
      10
$ grep -rl "openhuman-full" specs/system-skilled-bots/002-openbot-parity-research/00[123]-*/research/research.md specs/system-skilled-bots/003-openbot-parity-build/spec.md | wc -l
       0
$ ls -d specs/system-skilled-bots/003-openbot-parity-build/0[0-9][0-9]-* | wc -l
      14
$ for v in tinyagents tinyconnectors tinymemory tinyhumans-sdk tinysecurity; do echo "$v main=$(find specs/system-skilled-bots/context/openhuman-main/vendor/$v -type f 2>/dev/null | wc -l | tr -d ' ') full=$(find specs/system-skilled-bots/context/openhuman-full/vendor/$v -type f -not -path '*/target/*' 2>/dev/null | wc -l | tr -d ' ')"; done
tinyagents main=0 full=2188
tinyconnectors main=0 full=504
tinymemory main=0 full=523
tinyhumans-sdk main=0 full=92
tinysecurity main=0 full=1164
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run one `/deep:research` fan-out in expansive depth mode: four lineages of 10 iterations, 40 in total, on DeepSeek Flash at max thinking.
- Name, for each of the fourteen 003 phases, the reference files and lines that implement the same thing and what the builder should lift or mirror.
- Record where the plan differs from how the references do it, and which side the evidence supports.
- Record the failures, tests and fixes in the reference repos that the plan does not yet guard against.
- Rank the features the ten repos have that neither the plan nor the skip list covers, with `openhuman-full` read first.

### Out of Scope
- Building any phase or editing a 003 document - the synthesis names the evidence and the build packet applies it.
- Repeating a finding the three earlier syntheses already carry - this run cites them and adds only what is new.
- Changing the reference repos under `specs/system-skilled-bots/context/` - they are read-only inputs and stay gitignored.
- The desktop app and the other parts on the skip list of the parity research - a skipped part is reported only when the evidence contradicts the reason it was skipped.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | The four lineage folders, the merged findings registry, `research.md` and `resource-map.md`, all written by the workflow when the run starts |
| `scratch/research-topic.txt`, `scratch/frontier-seed.json` | Create | The prepared topic and the six seed questions the run starts from |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | Packet docs and continuity |
| `goal.md` | Modify | The durable directive and its completion criteria |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The run produces 40 iteration records, 10 in each of four lineages. | `find research/lineages -maxdepth 3 -path '*/iterations/iteration-*.md' \| wc -l` prints 40. |
| REQ-002 | Every finding carries a `[SOURCE: path:line]` into a reference repo, a 003 document or the runtime. | `research/findings-registry.json` holds no key finding without a source, and the synthesis marks each one confirmed, weak, wrong or not verified. |
| REQ-003 | No lineage changes a file outside its own lineage folder. | `git status --short` after the run lists no path outside `specs/system-skilled-bots/002-openbot-parity-research/`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The synthesis holds one evidence section per 003 phase. | `research/research.md` names each of the fourteen phase folders in a heading. |
| REQ-005 | The synthesis ranks the net-new features and says what `openhuman-full` adds. | `research/research.md` holds a ranked net-new section, and `grep -c "openhuman-full" research/research.md` prints 1 or more. |
| REQ-006 | The synthesis repeats no finding of the three earlier syntheses without saying what is new. | The synthesis holds a section that lists each overlap with the earlier run it came from. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A builder can open one section of `research/research.md` per 003 phase and find the reference code to mirror and the pitfalls to guard against, each with a resolving citation.
- **SC-002**: 40 iteration records exist under `research/lineages/`, and `validate.sh --strict` on this packet prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The Vibe and DevPass quotas behind the two providers | A provider that runs out stops its two lineages, and the seeds dealt to them go unworked | The seeds are split across both providers, and `orchestration-summary.json` carries a `rerun_command` for each failed lineage to rerun on the other provider |
| Risk | The seeds cannot be changed once the lineages spawn | A weak seed costs up to 10 iterations | The six seeds are written and reviewed before the run, in `scratch/frontier-seed.json` |
| Risk | A lineage edits a 003 build document | The runner reverts the edit and can fail the lineage | The topic states that every input is read-only, and REQ-003 checks the tree after the run |
| Risk | A finding rests on a reading, not a run | A lift or mirror recommendation is wrong | The synthesis re-checks each finding against its cited line before it enters `research/research.md` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How long does a `cli-pi` lineage take per iteration at max thinking? Answered by the run: each of the four lineages finished its 10 iterations in 14 to 17 minutes, so a Pi iteration took about a minute and a half.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Abridged from `research/research.md`, which is the source of truth.

- The run finished: 4 lineages, 40 iterations, 303 raw findings. After every finding was re-checked against its cited line, 121 rows stand (90 confirmed, 31 weak). The regrade log holds 332 rows, 106 of them wrong.
- The plan already carries most of what the references offer. The gain is four lifts, about twenty guards, six places where the plan contradicts itself and five corrections to the earlier syntheses.
- `openhuman-full` holds 21 vendored crates, not the five this spec names, and all 21 are GPL-3.0. `tinychannels-main` is GPL-3.0 too. Both are design references only. The `openhuman-tui` crate is identical in both checkouts.
- Highest-stakes guards: bracketed paste in 003 and 010, the unknown-before-retryable order in 011, the scan forms and the placeholder gate in 008, the deny wording in 006 and the skill label in 009.
- Sixteen net-new candidates are ranked. The first three are a per-bot cap on runs per hour, inbound coalescing with one outcome per message and a stall watchdog. Nothing contradicts the skip list.
- Five frontier questions stay open and are listed in section 12 of the synthesis.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
