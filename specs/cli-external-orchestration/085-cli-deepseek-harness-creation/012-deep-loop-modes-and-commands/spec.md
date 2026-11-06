---
title: "Feature Specification: Phase 12: deep-loop-modes-and-commands"
description: "The deep-research and deep-review protocols, skills, command YAMLs, presentation lists and compiled contracts do not name cli-deepseek-harness, so the executor kind exists in the runtime but /deep:research and /deep:review cannot select it. This phase lists the kind on those surfaces, regenerates the compiled contracts and records the AI Council seat decision."
trigger_phrases:
  - "deep loop modes and commands"
  - "phase 12 deep loop modes and commands"
  - "dsh deep research executor"
  - "dsh deep review executor"
  - "dsh council seat decision"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: deep-loop-modes-and-commands

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-05 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 14 |
| **Predecessor** | 011-hub-registration-and-routing |
| **Successor** | 013-dsh-live-contract-pin |
| **Handoff Criteria** | `rg -l cli-deepseek-harness` matches every research and review file in Section 3, regenerated contracts leave `git diff --exit-code` clean on `compiled/` and the council seat decision is recorded in this phase folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the DeepSeek Harness (dsh) as a cli-external-orchestration runtime mode mirroring cli-pi specification.

**Scope Boundary**: Make the existing `cli-deepseek-harness` executor kind selectable from `/deep:research` and `/deep:review` and decide whether it becomes an AI Council seat. The runtime builder, the stress adapter and the hub registration belong to phases 006, 007 and 011.

**Dependencies**:
- `006-deep-loop-executor-kind` (the kind and its builder)
- `007-dispatch-recognition-and-stress-adapter` (dispatch recognition and stress coverage)
- `011-hub-registration-and-routing` (the hub mode the contracts point at)

**Deliverables**:
- Research and review protocol and skill text: two `loop-protocol.md` files, `deep-review/SKILL.md` and `deep-research/SKILL.md` if it lists executors
- Command assets: `deep-research-auto.yaml`, `deep-review-auto.yaml`, confirm variants where they enumerate kinds, both presentation lists and both regenerated compiled contracts
- A council seat decision record, and the council skill, script, test, pattern doc, YAML and contract only if a seat is admitted
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After phase 006 the fan-out runtime accepts `cli-deepseek-harness`, but none of the files `/deep:research` and `/deep:review` read name it, so an operator cannot pick it and a loop never dispatches through it. The council seat question (research open question Q13) is also undecided, so the council roster could gain or miss the runtime by accident.

### Purpose
An operator can choose `cli-deepseek-harness` as the executor of a deep-research or deep-review run, and the council roster reflects a recorded decision.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -l cli-deepseek-harness .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md .skilled/skills/system-deep-loop/deep-review/SKILL.md .skilled/commands/deep/assets/deep-research-auto.yaml .skilled/commands/deep/assets/deep-review-auto.yaml .skilled/commands/deep/assets/deep-research-presentation.txt .skilled/commands/deep/assets/deep-review-presentation.txt .skilled/commands/deep/assets/compiled/deep-research.contract.markdown .skilled/commands/deep/assets/compiled/deep-review.contract.markdown
exit 1

$ rg -c 'cli-hermes' .skilled/commands/deep/assets/deep-research-presentation.txt .skilled/commands/deep/assets/deep-review-presentation.txt
.skilled/commands/deep/assets/deep-research-presentation.txt:3
.skilled/commands/deep/assets/deep-review-presentation.txt:3
exit 0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- List `cli-deepseek-harness` in both `loop-protocol.md` files, `deep-review/SKILL.md` and `deep-research/SKILL.md` where it lists executors.
- Add the kind to `deep-research-auto.yaml`, `deep-review-auto.yaml`, the confirm variants that enumerate kinds and both presentation lists.
- Regenerate both compiled contracts with `compile-command-contracts.cjs`.
- Record the council seat decision, and implement the seat only if the decision admits it.

### Out of Scope
- The builder, env allowlist and executor tests - phase 006 owns them
- Live dispatch through the kind - phase 013 owns it, because no provider key is set
- Hub and advisor registration - phase 011 owns it

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | Modify | List the executor |
| `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | Modify | List the executor |
| `.skilled/skills/system-deep-loop/deep-review/SKILL.md` | Modify | Executor roster |
| `.skilled/skills/system-deep-loop/deep-research/SKILL.md` | Modify if it lists executors | Executor roster |
| `.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-review-auto.yaml` | Modify | Shared-builder branch note |
| `.skilled/commands/deep/assets/deep-research-confirm.yaml`, `deep-review-confirm.yaml` | Modify where they enumerate kinds | Executor choice |
| `.skilled/commands/deep/assets/deep-research-presentation.txt`, `deep-review-presentation.txt` | Modify | Executor choice list |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`, `deep-review.contract.markdown` | Regenerate | Compiled contracts |
| `.skilled/skills/system-deep-loop/deep-ai-council/` skill, script, test and pattern files, council YAML and contract | Modify only if a seat is admitted | Seat support |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `rg -l cli-deepseek-harness` matches each research and review file listed in Section 3 |
| REQ-002 | Running `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` after the edits leaves `git diff --exit-code .skilled/commands/deep/assets/compiled/` at exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The council seat decision is recorded in this phase folder, and if a seat is admitted the council vitest suite `orchestrate-session-cli.vitest.ts` passes |
| REQ-004 | The deep-loop unit suites from phase 006 (`executor-config`, `fanout-run`, `combo-matrix`, `executor-audit`) still pass |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `rg -l` command in Measured Behavior lists all nine files instead of exiting 1.
- **SC-002**: A contract regeneration run produces zero diff on `compiled/` and the phase 006 unit suites print no new failure.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Executor kind from phase 006 | The contracts name a kind the runtime rejects | Start only after the phase 006 suites pass |
| Risk | A hand edit to a compiled contract drifts from its sources | Med | Edit only maintained sources and regenerate, then require zero diff |
| Risk | The kind is offered as a default before any route is proven | Med | Present it as an explicit choice only, never a default, until phase 013 promotes a route |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: the phase changes executor lists and serves no traffic.
- **NFR-P02**: N/A: per-iteration latency is measured in phase 013.

### Security
- **NFR-S01**: No YAML or contract names a key value or a `.env` path.
- **NFR-S02**: The kind is never a default executor in a command YAML.

### Reliability
- **NFR-R01**: Existing executor choices in both presentation lists keep their order and wording.
- **NFR-R02**: A second regeneration run produces zero diff.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a run that names no executor keeps the current default and never falls to `cli-deepseek-harness`.
- Maximum input: a council run with every seat filled keeps its current roster when the decision admits no seat.
- Failure path: a stale compiled contract makes the renderer reject it in `fix` mode, and the regeneration step fixes it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | About 12 files, more if a council seat is admitted |
| Risk | 8/25 | Compiled contracts are rejected when stale |
| Research | 4/20 | The council seat is a product decision |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should dsh become an AI Council seat (research Q13)? Decided in this phase and recorded in a decision record in this folder.
<!-- /ANCHOR:questions -->

---
