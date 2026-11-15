---
title: "Feature Specification: Phase 32: traceability-reserve-iteration"
description: "A deep review that reaches its iteration cap stops before every legal-stop veto, so a core traceability protocol left partial or unrecorded fails the coverage gate and the review ends FAIL. Nothing steers the last iteration toward that protocol. This phase reserves the last iteration under the cap for unfinished core protocols."
trigger_phrases:
  - "traceability reserve iteration"
  - "phase 32 traceability reserve iteration"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 32: traceability-reserve-iteration

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 32 of 33 |
| **Predecessor** | 031-search-debt-verdict |
| **Successor** | 033-zero-iteration-report |
| **Handoff Criteria** | The registry and the stop decision name the unfinished core protocols, the last iteration's focus and prompt name them, a partial result rises to pass only with file:line evidence, the replay test covers it, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 32** of the agent alignment follow-ups. It builds one fix from the Fable 5.2 report on the four known limits.

**Scope Boundary**: `convergence.cjs`, `reduce-state.cjs`, `deep-review.yaml`, the iteration prompt pack, their tests and the recompiled contract.

**Dependencies**:
- Phase 27's traceability rollup, which reads every recorded result shape

**Deliverables**:
- Unfinished core protocol ids in the registry and the stop inputs
- A last-iteration focus and prompt slot for them
- An evidence rule for a partial result raised to pass
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cap check (`.skilled/commands/deep/assets/deep-review.yaml:1021`) runs before the coverage veto, by design, so a run that reaches it with `spec_code` or `checklist_evidence` partial or unrecorded fails coverage at the terminal gates. The focus rule (`.skilled/commands/deep/assets/deep-review.yaml:904`) takes the next uncovered dimension only, and the traceability dimension can already count as covered while a core protocol is still partial.

### Purpose
Spend the last iteration under the cap on the core protocols that are still unfinished, and accept a raised result only with evidence a reader can check.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n 1021p .skilled/commands/deep/assets/deep-review.yaml
          1. if iteration_count >= max_iterations: STOP (maxIterationsReached). This terminal cap is evaluated before every veto ...
$ sed -n 904p .skilled/commands/deep/assets/deep-review.yaml
          - next_dimension: "Next uncovered dimension from dimension_queue in strategy.md"
# nothing steers the last iteration toward an unfinished core protocol

$ python3 - < count-capped   # inline count over registries changed 2026-10-01 onward, as their reducer recorded them
registries 60 stopped at cap 9 cap with unfinished core (as recorded) 5
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `convergence.cjs` exports `reviewUnfinishedCoreProtocols(config, registry)`: each core protocol in `config.crossReference.core` whose latest result is missing or `pending`, `deferred`, `skipped`, `partial` or `blocked`; the review stop inputs carry it as `unfinishedCoreProtocols`
- The reducer writes the same list to `registry.traceability.unfinishedCoreProtocols`
- In the rollup, a result that follows `partial` for the same protocol counts as `pass` only when it carries a file:line reference in `evidenceRefs` or `evidence`; otherwise the partial result stays
- `.skilled/commands/deep/assets/deep-review.yaml` read step extracts `unfinished_core_protocols`; when `max_iterations` is at least 2, `current_iteration` equals `max_iterations` and the list is non-empty, `next_dimension` is `traceability`; the recovery line names the list
- `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl` gains an `{unfinished_core_protocols_block}` slot that names the protocols and the evidence rule
- The stop-path replay test covers the steer

### Out of Scope
- Moving the cap check after the vetoes; the cap stays absolute
- A protocol whose result is `fail`: it ran and found drift, so another pass does not finish it

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Modify | Unfinished core protocol ids |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modify | Registry field; evidence rule for partial to pass |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/traceability-rollup.vitest.ts` | Modify | Evidence rule and registry field |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/review-stop-path-replay.vitest.ts` | Modify | Steer case |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modify | Focus, prompt variable, recovery line |
| `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl` | Modify | Prompt slot |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Modify | Recompiled |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision.vitest.ts` | Modify | The function |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts`, `tests/fanout-review-focus.vitest.ts` | Modify | Fixtures bind the new slot |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The registry and the stop decision name the unfinished core protocols. | Tests: a registry with `spec_code` partial and `checklist_evidence` unrecorded yields both ids from the function, the registry field and `stop_decision.inputs.review.unfinishedCoreProtocols`; a `fail` or `pass` result is not listed |
| REQ-002 | A partial result rises to pass only with file:line evidence. | Rollup tests: partial then pass without a file:line reference stays partial; with `evidenceRefs: ['spec.md:12']` it is pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The last iteration under the cap is steered to the unfinished protocols. | The workflow's focus rule and prompt slot name them when `current_iteration == max_iterations >= 2`; the contract recompiles with drift and parity passing; the replay test covers the inputs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The runtime suite fails nothing that passed at baseline, plus the new tests.
- **SC-002**: `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The last iteration skips an uncovered dimension | Medium | The dimension coverage veto already applies; an unfinished core protocol fails coverage either way |
| Risk | A one-iteration run | Low | The steer needs `max_iterations` of at least 2 |
| Dependency | Contract parity and prompt-pack tests | Low | Run them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


