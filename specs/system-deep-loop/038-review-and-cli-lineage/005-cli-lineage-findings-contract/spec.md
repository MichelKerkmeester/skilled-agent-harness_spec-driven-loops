---
title: "Feature Specification: Give CLI deep-loop lineages the findings output contract and gate it per iteration"
description: "A CLI fan-out lineage never receives the per-iteration output contract, and the iteration check accepts a findings count with no findings behind it, so a deep-research or deep-review run can finish every iteration and still fail its closeout. This packet carries the contract into every CLI lineage prompt, gates each iteration on enumerated findings, and makes the closeout and merge count each iteration once."
trigger_phrases:
  - "cli lineage findings contract"
  - "findings not enumerated"
  - "synthesis closeout count only"
  - "fanout loop prompt output contract"
  - "reconstruction gap"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Give CLI deep-loop lineages the findings output contract and gate it per iteration

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
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A `/deep:research` fan-out with two CLI lineages, DeepSeek V4.1 Flash on cli-pi and GPT-6 Luna on cli-codex, finished all ten iterations, and every iteration passed `verify-iteration.cjs`. The closeout then failed with `synthesis_incomplete`. DeepSeek claimed 46 findings and enumerated 22, a reconstruction gap of 24. The run was in the AI Systems repository, packet `088-media-editor-cli-runtime/001-deep-research`, where the diagnosis and a reproduction are recorded.

The cause is in the runtime, not in the model alone:

- A CLI lineage gets one prompt from `buildLoopPrompt` (`runtime/scripts/fanout-run.cjs:1442-1574`). That prompt never states the per-iteration output contract, meaning the `## Findings` list, the `finding` delta rows and a `findingsCount` that matches them. Its in-process directive (`:1467-1478`) also tells the model that the per-iteration dispatch steps, where the prompt pack carrying that contract is rendered, are already satisfied.
- `runtime/scripts/verify-iteration.cjs:301-309` accepts a delta that holds only the iteration row, so an iteration that claims findings without listing them passes, and the fault only surfaces at the closeout.
- `synthesis-closeout.cjs` and `fanout-merge.cjs` sum every iteration record, while the reducer and `verify-iteration.cjs` keep the latest record per iteration, so a backfilled iteration is counted twice.
- `fanout-merge.cjs:771` aborts the whole merge when a lineage registry stores `openQuestions` as a number.

### Purpose

Every CLI lineage, in every deep-loop mode that runs one, receives its mode's output contract and is held to it at each iteration, so a closeout never fails on findings that were claimed and never listed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The output contract block in `buildLoopPrompt` for both fan-out loop types, research and review, each taken from that mode's own iteration template and agent file
- A `findings_not_enumerated` failure in `verify-iteration.cjs` for each loop type whose state record claims a findings count
- Latest-record-per-iteration counting in the closeout and the merge
- Tolerant guards in the merge for registry fields that hold a number where a list belongs
- One shared Markdown finding parser, used by both the gate and the merge
- The same defect class checked in `deep-ai-council` and `deep-improvement`, and fixed only where it is present

### Out of Scope

- The iteration templates and agent files themselves. They already carry the correct contract
- Rerunning or rewriting the AI Systems research in packet 088. That rerun happens there, after this lands

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Output contract block in the CLI lineage prompt, per loop type |
| `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` | Modify | `findings_not_enumerated` gate |
| `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs` | Modify | Latest record per iteration |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Modify | Latest record per iteration, tolerant registry guards, parser moved out |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/iteration-findings.cjs` | Create | Shared Markdown finding parser |
| `.skilled/skills/system-deep-loop/runtime/tests/` | Modify/Create | Tests for every change |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A CLI research lineage prompt and a CLI review lineage prompt each carry their mode's output contract, and a native lineage prompt carries none |
| REQ-002 | `verify-iteration.cjs` fails an iteration whose claimed findings count is not matched by its state list, its finding delta rows or its `## Findings` lines, for each loop type that claims a count |
| REQ-003 | The closeout and the merge count each iteration once, using its latest record |
| REQ-004 | Every new test fails on the unpatched code and passes on the patched code |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | A registry that stores a count where a list belongs degrades instead of aborting the merge |
| REQ-006 | `deep-ai-council` and `deep-improvement` are checked for the same defect class, with file:line evidence, and fixed where it is present |
| REQ-007 | The full deep-loop runtime suite shows no new failure against its baseline of 164 files and 2,799 passed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Run against the five kept DeepSeek iterations from the AI Systems research, the new gate returns `findings_not_enumerated` for each, and against the five Luna iterations it passes each
- **SC-002**: A DeepSeek-only rerun of that research, after this lands, closes with `synthesis_complete`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Every deep-loop fan-out reads these scripts live | An edit reaches running loops in other sessions at once | Land it as one reviewed change, run the full suite first |
| Risk | The new gate fails iterations that previously passed | Med | It triggers the existing redispatch-once rule, so an iteration is repaired while it is fresh. Enumerated output, which the templates already require, passes unchanged |
| Risk | Review and research finding shapes differ | Med | Each loop type's contract and gate are taken from its own template, with tests per loop type |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The gate reads only the files `verify-iteration.cjs` already opens, with no new process or network call

### Security
- **NFR-S01**: No new write path. The gate and the merge stay read-only on lineage artifacts

### Reliability
- **NFR-R01**: The gate and the merge use one parser, so they never disagree about what a Markdown finding is
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A findings count of 0 or no count: the gate does not apply, unchanged behavior
- A count matched by any one of the three sources: pass

### Error Scenarios
- A registry field holding a number where a list belongs: treated as empty, the merge continues for every lineage
- An iteration recorded twice: the latest record counts

### State Transitions
- An iteration that fails the gate: the workflow's existing redispatch-once rule reruns it
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Four scripts, one new module, tests |
| Risk | 14/25 | A shared runtime used live by every deep-loop run |
| Research | 8/20 | Root cause already reproduced |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open. Council and improvement were checked and carry no instance of the defect, with file:line evidence in `implementation-summary.md`
<!-- /ANCHOR:questions -->

---
