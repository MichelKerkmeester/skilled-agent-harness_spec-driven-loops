---
title: "Feature Specification: Phase 3: hub-reports-destination"
description: "Mode packets with no benchmark folder of their own could not save playbook runs where their playbook said. This phase adds --reports to the recorder and the conversation runner, points the three affected playbook roots at it and saves the cli-mistral-vibe verdicts as recorder reports in the hub's folder."
trigger_phrases:
  - "hub reports destination"
  - "phase 3 hub reports destination"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: hub-reports-destination

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-22 |
| **Branch** | `worktrees/514-playbook-run-recording` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-playbook-marker-backfill |
| **Successor** | None |
| **Handoff Criteria** | `record-playbook-run.cjs --reports` saves a run into the owning hub and refuses a foreign reports folder, and `validate-playbook-package.cjs` exits 0 with no violations for the three playbook roots |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the playbook run recording program. Phases 1 and 2 covered modes that own a `benchmark/` folder. Three mode packets have none: `sk-code/sk-code-ci` and `sk-code/sk-code-frontend` sit in the `sk-code` hub, and `cli-external-orchestration/cli-mistral-vibe` sits in the `cli-external-orchestration` hub. Their playbooks named a reports folder, but the recorder wrote only into the playbook's own skill. The operator chose the owning hub, reached through a flag, on 2026-11-22.

**Scope Boundary**: the recorder and runner flag, its tests, the three playbook roots, the mode's docs and changelog, and the cli-mistral-vibe result blocks. The default destination does not change.

**Dependencies**:
- 001-run-recorder-and-validator, which created the recorder and the runner hand-off that this phase extends.
- 002-playbook-marker-backfill, which gave each root the results block that this phase edits.

**Deliverables**:
- `--reports DIR` on the recorder and on the conversation runner, with the refusal rules in section 3.
- A run saved through `--reports` names the owning hub in the reports index and in its `source.md`.
- The three playbook roots name the flag, and the 25 cli-mistral-vibe result blocks are saved as recorder reports.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A mode packet with no `benchmark/` folder of its own had no place for its runs. `record-playbook-run.cjs` wrote only into the playbook's own skill, so a playbook that asked for its results in a reports folder had nowhere to put them. This affects `sk-code-ci`, `sk-code-frontend` and `cli-mistral-vibe`. The 25 cli-mistral-vibe verdicts stayed as per-scenario blocks inside the scenario files, not as report folders.

### Purpose
A mode packet with no benchmark folder saves its runs into its owning hub's reports folder through one flag, and the hub's reports index and `source.md` name the hub that owns them.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git -c core.fsmonitor=false show HEAD:.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/record-playbook-run.cjs | grep -c -- '--reports'
0
$ grep -c -- '--reports' .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/record-playbook-run.cjs
6
```
The first count is the recorder before this phase, which has no `--reports` flag. The second is the recorder after it.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `--reports DIR` to `record-playbook-run.cjs`, resolved by `resolveReports(playbookRoot, reports)`.
- Forward `--reports` from `run-conversation-scenario.cjs` into the `save results:` command that the runner prints.
- Add the hub-reports test case and the runner assertion to the two test files.
- Point the sk-code-ci, sk-code-frontend and cli-mistral-vibe roots at the flag, and move the 25 cli-mistral-vibe blocks into recorder-written report folders.
- Document the flag in the mode `SKILL.md` (1.3.0.0), its template (1.0.3.0) and changelog `v1.3.0.0.md`.

### Out of Scope
- Changing the default destination. The flag is opt-in, so a packet with its own benchmark folder needs no change.
- Running any scenario again. The 25 moved verdicts are the blocks as they were recorded.

### Deviation from the parent scope
The parent's Out of Scope lists "Rewriting existing run reports into the recorder's format". This phase moved 25 existing cli-mistral-vibe blocks into recorder-written reports, which that bullet excluded. The operator accepted the move as an amendment on 2026-11-22, and the parent's bullet now says so (section 10).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/record-playbook-run.cjs` | Modify | `--reports DIR` and `resolveReports` |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | Modify | `--reports` forwarded into the printed save command |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/record-playbook-run.test.cjs` | Modify | `runHubReports` (14 assertions after the review follow-up) |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs` | Modify | Passes `--reports` and asserts the printed command carries it |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` | Modify | `--reports` paragraph under "Recording A Run"; version 1.3.0.0, then 1.3.1.0 in the review follow-up |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md` | Modify | One sentence on `--reports`; version 1.0.3.0 |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/changelog/v1.3.0.0.md` | Create | Changelog entry naming this phase's spec folder |
| `.skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/manual-testing-playbook.md` | Modify | Result persistence block names `--reports`; version 1.1.4.0 |
| `.skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/manual-testing-playbook.md` | Modify | Result persistence block names `--reports`; version 1.0.4.0 |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/manual-testing-playbook.md` | Modify | Root block names `--reports`; version 1.0.12.0 |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/**/*.md` (25 scenario files) | Modify | The per-scenario `Recorded Result` block removed; `fanout/adapter-stress-cells.md` gains a `Skip blocker:` line |
| `.skilled/skills/cli-external-orchestration/benchmark/reports/2026-11-14--manual-testing-playbook--recorded-results/` | Create | Recorder-written run folder, 22 PASS |
| `.skilled/skills/cli-external-orchestration/benchmark/reports/2026-11-15--manual-testing-playbook--recorded-results/` | Create | Recorder-written run folder, 3 PASS |
| `.skilled/skills/cli-external-orchestration/benchmark/reports/README.md` | Create | Reports index the recorder wrote for those two runs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `record-playbook-run.cjs --reports <hub>/benchmark/reports` writes the run folder under that hub, and refuses a path that does not end in `benchmark/reports` or a reports folder that belongs to anything other than the playbook's own skill or its direct parent hub, a folder holding `mode-registry.json` (symlinks resolved), with exit 1 before any write |
| REQ-002 | `run-conversation-scenario.cjs --reports DIR` prints a `save results:` command that carries `--reports` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The sk-code-ci, sk-code-frontend and cli-mistral-vibe roots name the recorder with `--reports`, and the three packages validate with no violations |
| REQ-004 | The 25 cli-mistral-vibe verdicts are saved as recorder reports (22 PASS and 3 PASS), and no scenario file still holds a `Recorded Result` block |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node scripts/tests/record-playbook-run.test.cjs` and `node --test scripts/tests/run-conversation-scenario.test.cjs` in the mode exit 0, the runner reporting `fail 0`.
- **SC-002**: `validate-playbook-package.cjs --package <root>` exits 0 with `violations=0` for each of the three playbook roots, and `rg -l 'Recorded Result'` over the cli-mistral-vibe playbook prints nothing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 recorder and runner hand-off | Without them the flag has nothing to extend | Phase 1 is Complete, and its test files are re-run in this phase |
| Risk | Moving 25 scenario blocks edits files the fleet validator reads | Med | `validate-playbook-package.cjs --package` exits 0 with no violations on the cli-mistral-vibe root after the move |
| Risk | A `--reports` value that names a foreign skill scatters run folders | Med | The refusal in REQ-001 runs before any write, and the foreign-folder case is in the hub-reports test |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. Documentation and one path check in a script; no service runs.
- **NFR-P02**: N/A. No throughput surface.

### Security
- **NFR-S01**: N/A. No credential or network surface.
- **NFR-S02**: N/A. The flag accepts a local path only, and the refusal rules bound it to the playbook's own skill or its direct parent hub, a folder holding `mode-registry.json`.

### Reliability
- **NFR-R01**: The recorder checks `--reports` before it writes, so a refused path is not written.
- **NFR-R02**: N/A. No error budget applies.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a run without `--reports` writes into the playbook's own skill, as it did before this phase.
- Maximum input: N/A. The flag takes one path.
- Failure path: a `--reports` path that does not end in `benchmark/reports`, or that belongs to anything other than the playbook's own skill or its direct parent hub, a folder holding `mode-registry.json`, is refused with exit 1 before any write. The hub-reports test asserts the refusals for a typo, a foreign folder, a folder above the hub and a folder inside the playbook, and that refused folders are not created. A hub reached through a symlink is accepted.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Two scripts, two test files, three playbook roots, 25 scenario files, three docs and two report folders |
| Risk | 6/25 | Edits three skills' playbooks and report indexes; no auth, no data handling |
| Research | 3/20 | Reading the recorder's destination rules and the three roots' current blocks |
| **Total** | **23/70** | **Level 2, inherited from the program** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Resolved 2026-11-22: the operator accepted the move as an amendment, and the parent's Out of Scope bullet now says so.
<!-- /ANCHOR:questions -->

---
