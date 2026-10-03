---
title: "Feature Specification: Phase 45: deem-live-runs"
description: "No scorer has measured a real Deem answer: before phase 044 the client could not read noul or score answers. This phase runs every scorer's Deem arm on the local server and closes the three Deem findings 044 recorded."
trigger_phrases:
  - "deem live runs"
  - "deem arm results"
  - "local deem measurement"
  - "cli-deem open findings"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 45: deem-live-runs

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-02 |
| **Branch** | `worktrees/071-cli-jev-sk-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 45 of 45 |
| **Predecessor** | 044-deem-answer-shape-fix |
| **Successor** | 046-deem-deprecation |
| **Handoff Criteria** | The five completion criteria in `goal.md` each run from the final state: every Deem scorer has a recorded run, no run shows an answer-shape error, the cli-deem suite passes with the new count cases, the cross-family review leaves no open P0 or P1, and `validate.sh --strict` passes on this phase and the parent. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 45** of the cli-jev workflow integration specification.

**Scope Boundary**: one live `--deem` run per scorer, the three cli-deem findings 044 recorded, and the record of each result. The operator asked for it on 2026-10-02.

**Dependencies**:
- Phase 044's client fix, so `noul` and `score` answers can be read.
- The local Deem server at `127.0.0.1:8300`, model `deem-0.8-v1`.
- The label files 042 recorded in `gates.md`.

**Deliverables**:
- One run folder and result line per scorer under `~/.skilled/.labels/runs/045-deem-20261002/`.
- The wire contract and README describe the request fields the server accepts.
- The client refuses a score with fewer than 2 or more than 10 levels and a choice with 1 option before any request.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Until phase 044 every `noul` and `score` call through `cli-deem` exited 1, so no scorer's Deem arm has a measured result, and the one local run of 006's arm failed all 196 calls. Phase 044 also recorded three Deem findings it did not fix: a wire-contract claim that the server rejects `criteria`, a fixture field no real answer carries, and client counts that let a request through which the server rejects with 422.

### Purpose
Every scorer's Deem arm has one recorded run on the real server, and the open Deem findings are closed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One sequential `--deem` run per scorer, 20 in all, each with its recorded label file and `--out` outside the repository.
- The three cli-deem findings: the wire contract and README, the `temperature` fixture field, and the score-level and choice-option counts.
- The result line of each run in `goal.md`'s log.

### Out of Scope
- Any `--jev` run. Jev was not part of the operator's request.
- Labeling more rows to open a closed gate. Labels need the operator.
- Acting on a verdict, such as promoting an arm. A verdict is recorded, not applied.
- Redesigning `cli-deem` because the server now accepts Jev's `criteria` request.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs` | Modify | Score-level and choice-option counts |
| `.skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs` | Modify | Count cases and the `x_temperature` fixture |
| `.skilled/skills/cli-classifier/cli-deem/` docs | Modify | Wire contract, README, DEE-006 and changelog v0.1.2.0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each scorer with a `--deem` switch runs once against the local server, and its stdout, stderr and exit status are kept |
| REQ-002 | No run reaches a `cli-deem` answer-shape error |
| REQ-003 | No run sends anything off the machine: no `--jev`, and output only under `~/.skilled/.labels/runs/` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The client exits 2 before any request on a score with fewer than 2 or more than 10 levels and on a choice with 1 option |
| REQ-005 | The wire contract and README say the server accepts `criteria` and the `options` and `levels` aliases, and every fake answer uses `x_temperature` |
| REQ-006 | One DeepSeek V4.1 Flash review covers the changes. P0 and P1 are fixed and P2 recorded |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of the 20 scorers has a recorded result line: a verdict, a gate stop or a named missing input.
- **SC-002**: Each changed suite passes from the final state with more tests than its baseline and 0 failing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A run with many calls takes long | Low | Runs are sequential with a 30-minute limit each |
| Risk | A verdict reads as a decision | Med | Verdicts are recorded only. Acting on one is out of scope |
| Dependency | The local Deem server | Med | Each scorer checks health first and prints a skip line if it is down |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Runs go one at a time, so the local server serves one scorer at once.

### Security
- **NFR-S01**: No script holds, reads or prints a credential.
- **NFR-S02**: Run output stays under `~/.skilled/.labels/runs/`, mode 700, outside the repository.

### Reliability
- **NFR-R01**: A failed health gate prints one skip line and exits 0.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A scorer with no label file or no input prints its gate stop or usage error, which is recorded as its result.
- A score with exactly 2 or 10 levels is sent.

### Error Scenarios
- A run that times out is recorded with its exit status.
- A call that fails is unmeasured, and the scorer's coverage stop decides the verdict.

### State Transitions
- Not applicable. Each run writes only its own `--out` folder.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 20 runs, one script, one test file and four docs |
| Risk | 6/25 | Local calls and offline scorers |
| Research | 4/20 | 042 recorded every label file |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The operator asked for every Deem item on 2026-10-02.
<!-- /ANCHOR:questions -->

---
