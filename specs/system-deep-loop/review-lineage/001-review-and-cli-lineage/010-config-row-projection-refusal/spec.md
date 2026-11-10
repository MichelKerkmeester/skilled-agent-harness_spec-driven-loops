---
title: "Feature Specification: Phase 10: config-row-projection-refusal"
description: "A cli-codex research lineage wrote its own config row into the state log, so the append gateway refused every later projection and the fan-out rejected the lineage. The fan-out brief told CLI lineages to write the state record directly; this phase sends every state record through the gateway."
trigger_phrases:
  - "config row projection refusal"
  - "phase 10 config row projection refusal"
  - "fanout brief direct state write"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: config-row-projection-refusal

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-19 |
| **Branch** | `worktrees/154-deep-loop-config-row-projection` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-findings-summary-integrity |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, the related deep-loop suites pass with no failures and `validate.sh` on this folder prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the deep-loop review and CLI lineage specification.

**Scope Boundary**: The instructions a CLI fan-out lineage reads about the state log: the in-process brief in `fanout-run.cjs` and the pre-dispatch notes in the research and review auto workflows. The gateway, its guard and the projector stay as they are.

**Dependencies**:
- The failed run `1792429886029-no7lpl` recorded under `specs/hooks/023-session-relaunch-loop/research/lineages/luna/`, and the codex session log that shows the direct writes.

**Deliverables**:
- A brief that sends every state record through `append-mode-event.cjs` and forbids writing the state log directly.
- A test that fails on the old brief.
- Pre-dispatch notes that say the same thing, with the compiled command contracts rebuilt.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A fan-out research run on 2026-10-19 rejected its cli-codex lineage with the failure class `projection_refusal`, although all five iterations were written. The codex session wrote a 12-key config row and iteration 1 straight into `deep-research-state.jsonl` with shell redirects. The gateway's ledger held no `run_initialized` record, so every later projection would have dropped keys from that hand-written row, and the attribution guard refused all of them. The in-process brief in `fanout-run.cjs` was the only instruction that told a lineage to write "the state record ... directly into the lineage directory", and it asked for a `findingsCount` the projected row never carries, a demand only a direct write could meet.

### Purpose
A CLI lineage is told, in every instruction it reads, to hand each state record to the append gateway and never to write the state log itself.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The in-process brief in `fanout-run.cjs` for research and review lineages.
- The pre-dispatch notes in `deep-research-auto.yaml` and `deep-review-auto.yaml`, and the compiled contracts that digest them.
- A failing-first test on the brief.

### Out of Scope
- A mechanical check that rejects a lineage whose ledger has no `run_initialized`, or a gateway that refuses before writing when the log holds rows the ledger never produced. Both are recorded as follow-ups.
- The duplicate ledger records a retried refused append leaves, and the projector writing the run id into the config row's `topic`.
- Changing the attribution guard itself, which did its job.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Brief sends every state record through the gateway |
| `.skilled/skills/system-deep-loop/runtime/tests/fanout-loop-prompt-in-process.test.ts` | Modify | Failing-first test on the brief |
| `.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-review-auto.yaml` | Modify | Pre-dispatch note names the gateway |
| `.skilled/command-support/deep/assets/compiled/deep-research.contract.md`, `deep-review.contract.md` | Regenerate | Source digest of the edited workflows |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The CLI lineage brief names `append-mode-event.cjs` for every state record, from the run-opening row to synthesis, and forbids creating, appending to or rewriting the state log. |
| REQ-002 | No instruction a CLI lineage reads asks for a direct state write or for a field only a direct write could supply. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The compiled command contracts match the edited workflows, and the related deep-loop suites pass. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new test fails on the old brief and passes on the new one.
- **SC-002**: Strict validation of this folder prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A prompt fix makes a direct write less likely but cannot stop one | Medium | The guard still refuses the projection, and the mechanical checks are recorded as follow-ups |
| Risk | A stale compiled contract blocks the fix-mode renderer | Low | Both contracts are rebuilt with `compile-command-contracts.cjs --write` |
| Dependency | The append gateway's `step_create_state_log` path | Low | Unchanged; the workflow already uses it |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The brief grows by four lines; no runtime cost.

### Security
- **NFR-S01**: The guard that refuses an attribution-losing projection stays untouched.

### Reliability
- **NFR-R01**: A lineage that follows the brief opens its log through the gateway, so its first ledger record is `run_initialized`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A review lineage reads the same rule with `deep-review-state.jsonl` named in place of the research log.

### Error Scenarios
- A lineage that writes the log anyway: the gateway still refuses and the fan-out still records `projection_refusal`.

### State Transitions
- Native lineages get no in-process brief, so their prompt is unchanged.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One brief, two workflow notes, two regenerated contracts, one test |
| Risk | 5/25 | Prompt text only; the gateway is unchanged |
| Research | 9/20 | The cause needed the codex session log and a reproduction |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose this phase under packet 038 and a worktree merged to main.
<!-- /ANCHOR:questions -->

---
