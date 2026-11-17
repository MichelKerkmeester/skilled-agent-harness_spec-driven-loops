---
title: "Feature Specification: Opt-in expansive depth mode for deep-research: frontier admission, veto, close rules"
description: "Deep-research stops once its init-time questions are answered, because nothing grows the counted question set during a run. This phase adds an opt-in --depth-mode=expansive that admits leaf-proposed frontier nodes into the counted set, steers focus to them, vetoes a premature stop while they are open and closes them cleanly, with default runs byte-identical."
trigger_phrases:
  - "research frontier mode"
  - "opt in expansive depth mode for deep research"
  - "depth-mode expansive research"
  - "frontier admit step"
  - "frontierOpen veto"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Opt-in expansive depth mode for deep-research: frontier admission, veto, close rules

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Deep-research treats a run that answers its 3-7 init questions narrowly as converged, because every stop signal and focus source is anchored to the question set written at init and nothing grows that set mid-run. This phase builds Slice J of the parent research: an opt-in `--depth-mode=expansive` that admits typed `frontier_proposal` rows through a workflow-owned admission step into `research/inbox.jsonl`, projects a `frontier` field into the findings registry, picks Next Focus by lowest open depth, adds a `frontierOpen` stop veto and closes terminal nodes so the run can still stop cleanly. The proof is a golden test that keeps default runs byte-identical, an admission table test, a stop-decision table test, a close test and a pilot run on the skill-advisor chat auto-utilization target rooted at the prompt-policy gate.

**Key Decisions**: a separate `--depth-mode` flag rather than a fifth `--convergence-mode` value; frontier growth travels through delta and inbox rows, never the research state-log upcast.

**Critical Dependencies**: phases `004-focus-hijack-fix`, `005-prompt-pack-contract-alignment`, `006-state-log-leaf-fields` and `007-source-diversity-quality-class` must land first.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Research** | `../research/research.md` (sections 7-11, 15, 20 Slice J) |
| **Depends On** | `004-focus-hijack-fix`, `005-prompt-pack-contract-alignment`, `006-state-log-leaf-fields`, `007-source-diversity-quality-class` |
| **Successor** | `011-review-frontier-mode` |
| **Level Basis** | `recommend-level.sh --loc 900 --files 16 --architectural --api` printed Level 3, score 77/100. `--api` is set because the phase adds a public command flag plus new delta-row and registry contracts. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A deep-research run stops on `all_questions_answered` or `composite_converged` as soon as the questions written at init are answered, however narrowly. The only path that grows the counted question set, `research/inbox.jsonl`, has no runtime writer, carried-forward questions steer focus without entering the stop count, and no stop signal measures unexplored surface. So a run asked to "find improvement opportunities" across a whole subsystem cannot widen or deepen on its own, and narrow-and-done is indistinguishable from converged.

### Purpose
With `--depth-mode=expansive`, a research run discovers new scope as typed proposals, admits it under fixed bounds, steers focus to it breadth-first, refuses to stop while admitted nodes are open within budget and still reaches a clean stop when every node is terminal; without the flag, nothing changes byte for byte.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run on `main` at 2026-11-17 from the repository root (`D=.skilled/skills/system-deep-loop`). No frontier surface exists today, the question-origin set has no `frontier` entry, and the default iteration cap is 10.
```text
$ rg -c "depth-mode|depthMode|frontier_proposal|frontierOpen" .skilled/commands/deep/research.md .skilled/commands/deep/assets/deep-research.yaml $D/deep-research/assets/deep-research-config.json $D/deep-research/scripts/reduce-state.cjs $D/runtime/scripts/convergence.cjs $D/runtime/scripts/fanout-run.cjs; echo "rg exit=$?"
rg exit=1
$ sed -n '128,133p' $D/deep-research/scripts/reduce-state.cjs
const VALID_QUESTION_ORIGINS = new Set([
  'angle-bank',
  'analyst-strategy',
  'operator',
  LEGACY_IMPORT_ORIGIN,
]);
$ rg -n '"maxIterations"' $D/deep-research/assets/deep-research-config.json
3:  "maxIterations": 10,
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the `--depth-mode=default|expansive` flag and the `antiConvergence.depthMode` plus `expansiveDepth` config block, locked against the optimizer.
- Add the `frontier_proposal` delta row to the research leaf contract and a conditional `## FRONTIER` block to the research prompt pack.
- Add `step_frontier_admit` (six-step admission into `research/inbox.jsonl` with `origin: "frontier"`), `step_frontier_graph_upsert` and an expansive STUCK_RECOVERY sub-branch to `deep-research.yaml`.
- Add the reducer `frontier` registry projection, the `frontier` question origin, the frontier Next Focus branch and the three close rules.
- Add the `frontierOpen` veto in `convergence.cjs` and the fan-out `frontier_scope:` partition with a fan-in coverage guard, then pilot on example target 2.

### Out of Scope
- The review-side frontier - built in `011-review-frontier-mode`, because review has no question surface and admits into different structures.
- Fixing defects D1, D5, D6, D7, D9 and D13 on the default path - owned by phases 004-007, which this phase depends on.
- A new `mode-registry.json` entry or a fifth `--convergence-mode` value - eliminated in the parent research because a mode binds one command and loop type, and a convergence-mode value would exclude `divergent` and `sliding-window`.
- Widening the research ledger upcast to carry frontier fields - eliminated; frontier data has a non-ledger channel.
- Promoting `wave_orchestration` - stays reference-only and only gains a pointer.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/deep/research.md` | Modify | Flag table row for `--depth-mode=default\|expansive` |
| `.skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json` | Modify | `antiConvergence.depthMode: "default"`, `expansiveDepth` block (maxDepth 3, maxChildrenPerNode 6, node cap tied to `maxIterations`, depthShares), `depthMode` in `lockedFields` |
| `.skilled/skills/system-spec-kit/runtime/cli/optimizer/optimizer-manifest.json` | Modify | Lock `antiConvergence.depthMode` so the optimizer cannot switch widening on |
| `.skilled/commands/deep/assets/deep-research.yaml` | Modify | New keys in `step_create_config`; `step_frontier_admit` after verify-iteration and before `step_reduce_state`; `step_frontier_graph_upsert` after `step_graph_upsert`; expansive STUCK_RECOVERY sub-branch keeping the `stuckRecovery` append; pointer on `wave_orchestration` |
| `.skilled/agents/deep-research.md` | Modify | `frontier_proposal` delta row type; leaves propose and never write the inbox |
| `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` | Modify | Conditional `## FRONTIER` block (node id, scope, budget, depth) and the proposal row shape |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts` | Modify | Render the `## FRONTIER` block only when `depthMode` is `expansive` |
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Modify | `'frontier'` in `VALID_QUESTION_ORIGINS`; opt-in `frontier: {nodes, stats}` in `buildRegistry`; question close rule; frontier branch in `resolveNextFocus` |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Modify | `depthMode` passthrough in `stopDecisionConfig`; `frontierOpen` veto after the `minIterations` floor |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | `frontier_scope:` setup binding modeled on `review_focus`, round-robin over open depth-1 nodes |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Modify | Fan-in guard that every depth-1 node is accounted for |
| Admission helper script, name UNKNOWN | Create | Deterministic six-step admission the YAML step calls. Without it the admission order lives in YAML prose the orchestrating model executes, which no vitest suite can test |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit.vitest.ts` | Create | New admission suite named in the parent slice plan |
| Existing suites under `.skilled/skills/system-deep-loop/runtime/tests/unit/` | Modify | Golden byte-identity, stop-decision table, reducer origin, close, fan-out and pivot-composition cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With `depthMode` absent, and with an explicit `--depth-mode=default`, the findings registry, dashboard, Next Focus and rendered prompt pack are byte-identical to the baseline captured before this phase on the same fixture. |
| REQ-002 | `step_frontier_admit` applies the admission checks in the fixed order relevance, dedupe, depth (`maxDepth` 3), fan-out (`maxChildrenPerNode` 6 and the run node cap), monotone budget, acyclicity; the first failing check prunes the proposal with that check's reason, and only admitted nodes are written to `research/inbox.jsonl` with `origin: "frontier"`. |
| REQ-003 | A `frontier`-origin inbox row keeps its origin through the reducer instead of being rewritten to `operator`. |
| REQ-004 | The `frontierOpen` veto turns a STOP candidate into CONTINUE only under expansive mode while open or active nodes exist and depth budget remains; it acts on a `composite_converged` candidate, never outranks the cap, consecutive failures, stuck, pause, `convergenceMode: off` or `stopPolicy: max-iterations`, and leaves the frozen `stopReason` enum unchanged. |
| REQ-005 | When a frontier node reaches a terminal status (`answered`, `blocked`, `exhausted`, `abstained`, `pruned`), the reducer marks its `frontier`-origin question resolved and records the status, and the node stops counting in the graph question-coverage and source-diversity signals. |
| REQ-006 | Visiting a node does not answer it: the frontier Next Focus branch emits a focus string that differs from the node's question text, so one iteration with that focus does not resolve the question. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | Under the flag, Next Focus picks the open node with the lowest depth, then one with no covering FINDING, then the oldest; the branch sits after the pivot focus and blocked-stop recovery and before continuity. |
| REQ-008 | `maxIterations` is split 50% / 35% / 15% across depths 0-1, 2 and 3; unused budget rolls down and never up; a spent band closes its open nodes as `exhausted: budget`; the node cap is tied to `maxIterations` or a minimum `maxIterations` for expansive runs is enforced. |
| REQ-009 | Under expansive mode the STUCK_RECOVERY handler closes the active node as `exhausted`, advances focus, falls through to global recovery only when no open node remains and still appends the `stuckRecovery` event that resets `stuckCount`. |
| REQ-010 | With fan-out, open depth-1 nodes are partitioned round-robin across lineages through a `frontier_scope:` binding, and the merge fails its guard when a depth-1 node is missing from every lineage; without the flag the lineage prompt carries no `frontier_scope:` line. |
| REQ-011 | With `divergent`, the Council pivot fires only once every frontier node is terminal. |
| REQ-012 | A pilot run on example target 2 roots its depth-1 nodes at the prompt-policy gate and its threshold config, places the scorer at depth 2, dedupes against the ten `specs/system-skill-advisor/routing-and-scoring/001-010` packets and ends in a non-cap stop with every node terminal. |
| REQ-013 | The dashboard reports frontier size, pruned nodes, revisits and budget spent per depth under the flag. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The golden byte-identity test passes for both the absent key and `--depth-mode=default`, and every existing guard suite named in the parent research section 10 stays green.
- **SC-002**: The pilot on target 2 admits at least one node beyond the init questions, closes every node with a terminal status and stops on a reason other than `maxIterationsReached`, with `jq '.frontier.stats'` on its `findings-registry.json` showing zero open and zero active nodes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 004 (D5 focus hijack), 005 (D6/D13 pack contract), 006 (D7/D9 leaf fields) and 007 (D1 `quality_class`) | Without 004 the frontier focus competes with the free-text hijack; without 007 the graph `sourceDiversity` signal is gameable and can block the stop | Start only after all four are merged; capture the golden baseline on that tree |
| Risk | A frontier that cannot close: terminal unanswered nodes keep counted questions open and QUESTION nodes uncovered | High | The three close rules (REQ-005, REQ-006, graph close in `step_frontier_graph_upsert`) and the close test |
| Risk | Phase 006 restores `keyQuestions`, which switches the `focusAlignment` guard on for research and could penalize widening | Med | A convergence case that runs an expansive fixture with `keyQuestions` present and asserts the guard does not block a frontier-driven continue on its own |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Admission and the registry projection add no new process per iteration; `step_frontier_admit` runs once per iteration and its suite completes inside the existing vitest run.

### Security
- **NFR-S01**: Leaves never write `research/inbox.jsonl`; only the workflow admission step writes it, and the prompt-pack allowed-write list matches the agent definition.

### Reliability
- **NFR-R01**: An absent `depthMode` key reads as `default`, and every new branch is unreachable when the flag is off.

---

## 8. EDGE CASES

- Empty input: an expansive run whose leaves propose nothing behaves like a default run with an empty frontier; the veto is a no-op on an empty frontier.
- Maximum input: proposals beyond `maxChildrenPerNode` 6 or the run node cap are pruned with the fan-out reason, and a depth-4 proposal is pruned with the depth reason.
- Failure path: a malformed `frontier_proposal` row is pruned with a recorded reason and never reaches the inbox; the iteration itself is not failed.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: about 16, LOC: about 900, Systems: workflow YAML, reducer, convergence, fan-out, prompt pack |
| Risk | 16/25 | Auth: N, API: Y (new flag, delta row, registry field), Breaking: N (opt-in) |
| Research | 8/20 | Design settled in parent research; three choices left open (see plan ADRs) |
| Multi-Agent | 6/15 | Workstreams: 2 (runtime and workflow) |
| Coordination | 12/15 | Dependencies: 4 predecessor phases plus the successor review phase |
| **Total** | **62/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Default-path regression from a shared file edit (reducer, convergence, prompt pack) | H | M | Golden byte-identity test written before any behavior change |
| R-002 | Frontier runaway or cost growth | M | M | Depth, children and node caps, narrow-only budgets, the `maxIterations` hard cap |
| R-003 | Leaves over-propose | M | H | Evidence-anchor relevance check, dedupe, workflow-owned admission |
| R-004 | Most admitted nodes close as `exhausted: budget` at the default cap of 10 | M | H | Node cap tied to `maxIterations` or an enforced minimum (plan ADR-003) |
| R-005 | Gaming the stop guards through self-chosen `quality_class` labels | M | L | Depend on phase 007; do not rely on graph `sourceDiversity` before it lands |

---

## 11. USER STORIES

### US-001: Widen a research run past its init questions (Priority: P0)

**As a** deep-research operator, **I want** `--depth-mode=expansive` to admit and pursue sub-questions the leaves discover, **so that** a broad target like skill-advisor chat auto-utilization is not declared converged after its first few questions.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Keep default runs untouched (Priority: P1)

**As a** maintainer of existing deep-research workflows, **I want** runs without the flag to produce the same bytes as before, **so that** the sub-mode cannot regress anything that does not opt in.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Which file holds the admission helper, and is it shared with the review phase? UNKNOWN until build; the parent research names only the YAML step and the suite.
- Should the node cap be derived from `maxIterations`, or should expansive mode enforce a minimum `maxIterations`? Proposed in plan ADR-003.
- Does the graph close rule skip writing pruned and exhausted nodes, or re-kind them on close? Proposed in plan ADR-002.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Parent Research**: See `../research/research.md`

---
