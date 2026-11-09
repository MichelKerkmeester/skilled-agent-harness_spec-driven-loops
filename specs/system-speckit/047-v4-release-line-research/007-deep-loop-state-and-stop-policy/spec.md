---
title: "Feature Specification: Phase 7: deep-loop-state-and-stop-policy"
description: "Deep-loop state reporting disagrees with what ran: the reducer counts rows rather than iterations, delta corruption is swallowed, the state row loses its focus, review closeout never binds readiness, quota errors burn iterations, a confirm gate can lose its lock and a max-iterations fan-out is rejected only after it ran. This phase makes the state and stop policy honest."
trigger_phrases:
  - "deep loop state and stop policy"
  - "phase 7 deep loop state and stop policy"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: deep-loop-state-and-stop-policy

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-08 |
| **Branch** | `worktrees/334-v4-release-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 17 |
| **Predecessor** | 006-deep-loop-single-executor-dispatch |
| **Successor** | 008-write-containment-scoping |
| **Handoff Criteria** | The reducer replay over the five research logs reports distinct iterations, and the deep-loop runtime and council suites hold their baselines |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the v4 release line remediation specification.

**Scope Boundary**: Iteration counting, delta and state-log integrity, the canonical state row, review closeout bindings, executor-unavailable handling, confirm-mode lock refresh, fan-out max-iterations validation, unknown-option refusal in deep-loop scripts, and the council confirm post-dispatch check. Dispatch argv belongs to 006; containment to 008.

**Dependencies**:
- Phase 006 committed (`e7398d6c76`), because both phases edit the same workflow YAMLs
- Verified findings V07, V08, V10, V11, V12, V13, V14, V16 and P2s V06, V15 in `../research/research.md`

**Deliverables**:
- Honest iteration counts and fail-closed delta reads in the research reducer
- Workflow YAML fixes for state fields, readiness binding, quota errors and confirm-gate locks
- Up-front fan-out validation and strict option parsing in deep-loop scripts
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep loops report state that does not match what ran. The research reducer counts iteration rows, so a redispatched iteration is counted twice, and it takes the last row as the latest; corrupt delta rows are padded with nulls while a corrupt state log fails closed. The canonical state row drops `focus`, so `last_focus` reads undefined. Review closeout passes `{release_readiness_state}` that nothing binds. An executor quota error is written as an `error` iteration that consumes `maxIterations`. A confirm-mode operator gate longer than the lock TTL lets another run reclaim the packet. A fan-out with `stopPolicy=max-iterations` and no lineage cap is rejected only after the lineage ran. And the v4.0.0.8 promise that every deep-loop script refuses unknown options holds for 15 of 27.

### Purpose
Every count, stop decision and refusal a deep loop reports is derived from what actually happened, and fails closed where the evidence is broken.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ for each 047 research child: count type=iteration rows, distinct run values, error rows, keys on the last row
001-spec-kit-core iterationRows=20 distinctRuns=20 errorRows=1 lastRowKeys=7 hasFocus=false
002-authoring-hubs iterationRows=11 distinctRuns=11 errorRows=1 lastRowKeys=7 hasFocus=false
003-cli-and-deep-loop iterationRows=26 distinctRuns=26 errorRows=0 lastRowKeys=7 hasFocus=false
004-advisor-hooks-relaunch iterationRows=22 distinctRuns=20 errorRows=0 lastRowKeys=7 hasFocus=false
005-doctor-git-ci-runtime iterationRows=22 distinctRuns=22 errorRows=1 lastRowKeys=7 hasFocus=false
$ bash replay-reducer.sh   # reduce-state.cjs --lenient on a temp copy of each child
001-spec-kit-core iterationsCompleted=20 reduceExit=0
002-authoring-hubs iterationsCompleted=11 reduceExit=0
003-cli-and-deep-loop iterationsCompleted=26 reduceExit=0
004-advisor-hooks-relaunch iterationsCompleted=22 reduceExit=0
005-doctor-git-ci-runtime iterationsCompleted=22 reduceExit=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Count distinct iterations and pick the latest by run number in the research reducer, and read delta corruption fail-closed like the state log.
- Keep `focus`, `mode` and `answeredQuestions` on the canonical research state row, and bind `release_readiness_state` before review closeout.
- Record an executor-unavailable dispatch as an event that does not consume `maxIterations`, refresh the confirm-mode lock after every operator gate, and reject an uncapped max-iterations fan-out before any lineage starts.
- Make every deep-loop CLI script refuse unknown options, and give the council confirm workflow the auto twin's post-dispatch validation.

### Out of Scope
- Moving stop policy and `minIterations` from YAML into `convergence.cjs` (V06) - the YAML implements them correctly; waived by ADR-001.
- Rewriting the 047 research logs - they are evidence; only temp copies are reduced.
- Dispatch argv and containment - phases 006 and 008.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Modify | Distinct-iteration counting, latest by run, fail-closed delta corruption |
| `.skilled/commands/deep/assets/deep-research-{auto,confirm}.yaml` | Modify | State row fields, `iteration_count` semantics, executor-unavailable path, confirm-gate lock refresh |
| `.skilled/commands/deep/assets/deep-review-{auto,confirm}.yaml` | Modify | `release_readiness_state` binding, executor-unavailable path, confirm-gate lock refresh |
| `.skilled/commands/deep/assets/deep-ai-council-confirm.yaml` | Modify | Post-dispatch validation matching the auto twin |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Reject an uncapped max-iterations lineage before dispatch |
| `.skilled/skills/system-deep-loop/runtime/scripts/*.cjs` (scripts that accept unknown options) | Modify | Refuse unknown options with a usage error |
| `.skilled/skills/system-deep-loop/runtime/tests/**` | Modify/Create | Coverage for each fix |
| `.skilled/commands/deep/assets/compiled/*.contract.markdown` | Modify | Regenerated digests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The research reducer reports one completed iteration per distinct run, takes the highest run as the latest, and reduces a copy of child 004's log to 20, not 22. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | A corrupt delta row makes the reducer refuse with the same recovery error class the state log uses when existing state is required, instead of padding nulls. |
| REQ-003 | The canonical research state row keeps `focus`, `mode` and `answeredQuestions`, so `last_focus` reads the last iteration's focus. |
| REQ-004 | Review closeout receives a bound `release_readiness_state` derived before the closeout call, never the literal placeholder. |
| REQ-005 | A dispatch that fails because the executor is unavailable (quota, capacity, auth) is recorded as an executor-unavailable event that does not count toward `maxIterations`. |
| REQ-006 | Confirm-mode workflows refresh the packet lock after every operator gate returns, and stop when the refresh reports the lock lost. |
| REQ-007 | `fanout-run.cjs` rejects `stopPolicy=max-iterations` without a positive per-lineage cap before any lineage dispatch. |
| REQ-008 | Every deep-loop runtime CLI script exits with a usage error on an unknown `--option`. |
| REQ-009 | The council confirm workflow runs the same post-dispatch validation as its auto twin. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The reducer replay prints `iterationsCompleted=20` for 004 and unchanged counts for the other four children.
- **SC-002**: The deep-loop runtime suite, the council suite and the two node script tests pass with no fewer passing tests than the baseline, plus the new tests.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 006 YAML edits | Both phases edit the same YAMLs | 006 is committed before the first 007 edit |
| Risk | Fail-closed delta reads stop a run that previously limped on | Med | Refuse only under the same `requireExistingState` condition the state log uses; `--lenient` keeps its tolerant path |
| Risk | Stricter option parsing breaks a caller passing an undocumented flag | Med | Inventory every caller of each script in YAMLs, tests and docs before tightening |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: counting distinct runs is linear in the state log, as counting rows was.

### Security
- **NFR-S01**: N/A: no credential or permission path changes.

### Reliability
- **NFR-R01**: Broken evidence (corrupt delta, lost lock, uncapped forced-depth run) stops the loop with a named reason instead of producing a count.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a state log with no iteration rows reports 0 completed iterations and `last_focus` of `none yet`.
- Maximum input: a run redispatched several times still counts once, and its latest row by timestamp wins within the same run.
- Failure path: an unknown option exits 2 with usage; an uncapped max-iterations fan-out exits with an input error before any spawn.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Reducer, six workflow YAMLs, fan-out runner, about a dozen scripts |
| Risk | 15/25 | State and stop decisions of every deep loop |
| Research | 6/20 | Verified findings with evidence |
| **Total** | **39/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. V06 is waived by ADR-001 in `decision-record.md`.
<!-- /ANCHOR:questions -->

---
