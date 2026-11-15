---
title: "Feature Specification: Phase 26: alignment-remaining-findings"
description: "Phase 025 left the routing corpus pin stale and several alignment findings open. This phase recaptures the pin and fixes the executor-selection, save and presentation docs, the benchmark packet labels and the Claude session id entry."
trigger_phrases:
  - "alignment remaining findings"
  - "phase 26 alignment remaining findings"
  - "routing corpus pin recapture"
  - "deep loop presentation mistral vibe executor"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 26: alignment-remaining-findings

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/409-alignment-remaining` |
| **Parent Spec** | ../spec.md |
| **Phase** | 26 of 27 |
| **Predecessor** | 025-alignment-open-findings |
| **Successor** | 027-ci-red-checks-after-council-retirement |
| **Handoff Criteria** | The corpus pin check passes, the contract drift check prints OK and both spec folders validate strict |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 26** of the DeepSeek Harness creation specification. Phase 025 fixed most of the alignment run's findings. The operator asked to fix the rest, including the routing corpus pin that another packet's baseline holds.

**Scope Boundary**: docs, one routing baseline capture, two regenerated command contracts. No runtime code changes.

**Dependencies**:
- Phase 025, whose probe trials this phase finishes
- The routing baseline in `specs/system-deep-loop/loop-architecture/003-deprecate-improvement-modes/013-drift-guard-repairs/baseline/`

**Deliverables**:
- A corpus pin that matches main's holdout file
- Docs that match the executor dispatch, the full-auto save and the Claude session id read
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The routing CI corpus gate exits 2 on main because the AI Council retirement removed two holdout rows without recapturing the pin. The review executor-selection entry says three dispatch branches exist. The review save entry, the research catalog index and the review save scenario describe a save without `--full-auto`. Both deep presentations leave out `cli-mistral-vibe`, and the review one says `:confirm` runs only three kinds. Two benchmark reports label the source packet `004-` while linking `002-`. ENV-REFERENCE never names `CLAUDE_CODE_SESSION_ID`, which session handover reads.

### Purpose
Make the corpus gate score again and bring each doc in line with the code.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 corpus_gate.py   # the pin step of routing-registry-drift.yml
CORPUS DRIFTED FROM PIN — recapture the baseline before scoring:
  holdout-prompts.jsonl: pinned e8c637d3f59fbba1… actual 9408335972503fab…
exit=2
$ grep -c "one of three dispatch branches" .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/executor-selection-contract.md
1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Recapture the holdout pin, the holdout metrics and the top-3 capture
- Fix the executor-selection entry and the review catalog index
- Name `--full-auto` in the review save entry, the research catalog index and the review save scenario
- Add `cli-mistral-vibe` to both presentations and correct the `:confirm` sentence
- Correct the two benchmark packet labels
- Add `CLAUDE_CODE_SESSION_ID` to ENV-REFERENCE

### Out of Scope
- The labeled and ambiguity corpus evidence, whose hashes and scores did not change
- Advisor vocabulary for the full-auto save probe - each trial phrase either moved nothing or failed a ratchet

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `013-drift-guard-repairs/baseline/routing-baseline.json`, `capture-scorer-eval-baseline.stdout.txt`, `capture-top3.json` | Modify | Recaptured pin and holdout metrics |
| `deep-review/feature-catalog/loop-lifecycle/executor-selection-contract.md`, `deep-review/feature-catalog/feature-catalog.md` | Modify | Dispatch branches |
| `deep-review/feature-catalog/loop-lifecycle/memory-save.md`, `deep-research/feature-catalog/feature-catalog.md` | Modify | Full-auto save |
| `deep-review/manual-testing-playbook/synthesis-save-and-guardrails/final-synthesis-memory-save-and-guardrail-behavior.md` | Modify | Full-auto pass criterion |
| `.skilled/commands/deep/assets/deep-review-presentation.txt`, `deep-research-presentation.txt` | Modify | Executor list |
| `.skilled/commands/deep/assets/compiled/*.contract.markdown` | Modify | Regenerated |
| `cli-{opencode,pi}/benchmark/reports/2026-07-29--manual-testing-playbook--goal-hook/source.md` | Modify | Packet label |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | Claude session id row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The corpus pin matches main | The pin step prints `corpus matches the pinned baseline hashes` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The presentations name every executor kind | `grep -c "cli-mistral-vibe"` on each compiled contract prints at least 2 |
| REQ-003 | The save docs name `--full-auto` | `grep -c "full-auto"` on the review save entry prints at least 1 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=2`.
- **SC-002**: `validate.sh` prints `RESULT: PASSED` for this phase and its parent with `--strict`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A recapture taken outside the recorded regime | High | Run every capture with the regime's empty advisor DB dir and its three env switches |
| Dependency | The compiled contracts pin both presentations | Drift check fails | Regenerate both with `compile-command-contracts.cjs --write` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
