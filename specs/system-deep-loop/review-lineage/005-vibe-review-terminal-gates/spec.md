---
title: "Feature Specification: Fan-out review lineages that skip the terminal stop gate and record rows under the wrong run"
description: "Two Vibe review lineages exited 0 with ten iterations and a report each, yet the fan-out runner failed both because neither recorded a terminal_gates row, and one of them scoped its rows by the fan-out root's session id."
trigger_phrases:
  - "vibe review terminal gates"
  - "fan out review lineages that skip the terminal"
  - "lineage scoped by the root session id"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Fan-out review lineages that skip the terminal stop gate and record rows under the wrong run

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
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A `/deep:review:auto` fan-out of two `cli-mistral-vibe` lineages ran ten iterations each and wrote a review report each, but the runner marked both failed: "the state log holds no terminal stop row (terminal_gates)". Neither lineage ever ran the stop decision or `terminal-gates.cjs`, because the lineage prompt told it to loop to the cap and never named the stop gate. One lineage also built its config by copying the root config, so its closeout row and seven of its iteration rows carried the root's session id. An earlier research fan-out showed a related leak: a closeout event staged by one lineage was replayed into another lineage's state log through a fixed `/tmp` file.

### Purpose
A review lineage records its terminal gates before synthesis, or is stopped in session before it closes out, and no lineage row can carry another run's id.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Evidence is the run folder `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/review/`, read only.
```text
orchestration-summary.json: vibe-1 status failed, failure_class exit, exit_code 0. vibe-2 the same.
lineages/vibe-1/deep-review-state.jsonl: 1 config row, 10 iteration rows, 1 synthesis_incomplete row, 0 terminal_gates rows.
  closeout row: runId 2026-11-27T09:14:53.505Z, sessionId 2026-11-27T09:14:53.505Z (the root's id)
lineages/vibe-2/deep-review-state.jsonl: 1 config row, 10 iteration rows, 1 synthesis_complete row, 0 terminal_gates rows.
grep terminal_gates over every lineage and root ledger frame: 0 files.
Executed commands in each Vibe session (structured command fields):
  vibe-1: synthesis-closeout.cjs 1, terminal-gates.cjs 0, convergence.cjs 0
  vibe-2: synthesis-closeout.cjs 1, terminal-gates.cjs 0, convergence.cjs 0
vibe-1 session, config write command:
  const root=JSON.parse(fs.readFileSync(".../review/deep-review-config.json"))
  cfg.sessionId=root.sessionId
  stdout: config written 2026-11-27T09:14:53.505Z 10 42
research/lineages/pi-2/deep-research-state.jsonl line 13: synthesis_complete with runId fanout-vibe-1-1795763950430-ek4gqy
/tmp/event-dir.txt (08:33 local) still names .../T//deep-research-synthesis.la6FSq, whose synthesis_complete.json holds that same vibe-1 event
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Name the review stop gate, its `terminal-gates.cjs` command and its gateway event in every review lineage prompt the fan-out runner builds.
- Pin the lineage session id in the prompt and forbid building a lineage config from the root config or keeping working files under `/tmp`.
- Refuse in the append gateway a lineage row scoped by the root run's session id, and a lineage closeout event scoped by another run.
- Refuse in the synthesis closeout a review lineage close-out when the lineage state log holds no `terminal_gates` row.

### Out of Scope
- The runner's completion check in `fanout-run.cjs` - it stays as strict as it is, since it is what caught the defect.
- The workflow YAML `deep-review.yaml` - its stop path already runs `record_terminal_gates` on every stop, the lineage simply never reached it.
- `runScope` in `synthesis-closeout.cjs` - reading the run id from the config beside the state log is an earlier decision this change keeps.
- The evidence run folder - read only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Lineage prompt names the stop gate and the run identity |
| `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` | Modify | Refuse lineage rows that name another run |
| `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs` | Modify | Refuse a review lineage close-out with no terminal_gates row |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-lineage-run-identity.vitest.ts` | Create | Tests for the three changes |
| `.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-review-default/lineage-prompt.txt` | Modify | Regenerated golden prompt |
| `.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-research-default/lineage-prompt.txt` | Modify | Regenerated golden prompt |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A review lineage prompt names the stop gate before synthesis | The built prompt holds the `terminal-gates.cjs --config-path` command and `deep_review.terminal_gates_recorded`, tested in `fanout-lineage-run-identity.vitest.ts` |
| REQ-002 | The gateway refuses a lineage row scoped by the root session id | Exit 2, code `LINEAGE_SCOPE_MISMATCH`, no ledger frame, tested |
| REQ-003 | The synthesis closeout refuses a review lineage with no terminal_gates row | Exit 1, nothing staged, tested, and a lineage with the row still closes out |
| REQ-004 | The runner's completion check is unchanged | `git diff` shows no change to `TERMINAL_STOP_EVENTS_BY_LOOP_TYPE` or the completion functions |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The gateway refuses a lineage closeout event scoped by another run | Research case tested, exit 2, no ledger frame |
| REQ-006 | The runtime suite passes with no regression | Full `npx vitest run --no-coverage` before and after, counts recorded in `implementation-summary.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new test file fails 5 of its 9 tests against the unchanged scripts and passes 9 of 9 with the change.
- **SC-002**: The full runtime suite passes with only the new tests added to the count.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The lineage model follows the prompt | Med | The closeout and gateway refusals stop a lineage in session even when it ignores the prompt |
| Risk | A gateway refusal blocks a legitimate lineage row | High | The rule fires only in a `lineages/<label>/` folder whose root config names a session id, and a scan of three recent fan-outs found no legitimate lineage row carrying the root id |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. A live Vibe rerun would show that a lineage now records the gate, and is left to the operator.
<!-- /ANCHOR:questions -->

---
