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

Deep-research treats a run that answers its 3-7 init questions narrowly as converged, because every stop signal and focus source is anchored to the question set written at init and nothing grows that set mid-run. This phase builds Slice J of the parent research: an opt-in `--depth-mode=expansive` that seeds depth-1 frontier nodes before the first iteration, admits typed `frontier_proposal` rows through a workflow-owned admission step into `research/inbox.jsonl`, keeps node status in a durable append-only store, projects a `frontier` field into the findings registry, picks Next Focus by lowest open depth, adds a `frontierOpen` stop veto and closes terminal nodes so the run can still stop cleanly. Fan-out runs get the seed before any lineage spawns, a `--depth-mode` passthrough, a persisted partition and a merged `frontier`. The proof is a golden test that keeps default runs byte-identical, an admission table test, a stop-decision table test, a close test and a pilot run on the skill-advisor chat auto-utilization target rooted at the prompt-policy gate.

**Key Decisions**: a separate `--depth-mode` flag rather than a fifth `--convergence-mode` value; frontier growth travels through delta and inbox rows, never the research state-log upcast; node status lives in its own append-only store because the inbox keeps only six fields and the registry is rebuilt on every reduce.

**Critical Dependencies**: phases `004-focus-hijack-fix`, `005-prompt-pack-contract-alignment`, `006-state-log-leaf-fields`, `007-source-diversity-quality-class` and `012-pivot-hygiene` must land first. 012 rewrites the pivot branch that T018 gates.

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
| **Depends On** | `004-focus-hijack-fix`, `005-prompt-pack-contract-alignment`, `006-state-log-leaf-fields`, `007-source-diversity-quality-class`, `012-pivot-hygiene` |
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
- Add the `--depth-mode=default|expansive` flag and the `antiConvergence.depthMode` plus `expansiveDepth` config block, locked against the optimizer, and bind it on every surface `convergence_mode` is bound on: the presentation asset, the YAML `user_inputs`, preflight, `step_read_state` and the `convergence.cjs` call.
- Add `step_frontier_seed`, which decomposes the topic into depth-1 nodes before the first iteration. On the fan-out path it runs before `step_fanout_spawn`, because that step skips `phase_init` and `phase_main_loop`. On the single-executor path it runs in `phase_init` after `step_create_config`.
- Add a durable node-status store, `research/frontier-nodes.jsonl`: append-only rows, last row per node id wins, written only by the admission helper (seed, admit, prune and the workflow-owned close calls). The inbox keeps only six fields and the registry is rebuilt on every reduce, so neither can hold status.
- Add the `frontier_proposal` delta row to the research leaf contract and a `{frontier_block}` variable to the research prompt pack whose value is empty unless the mode is expansive.
- Add `step_frontier_admit` (six-step admission into `research/inbox.jsonl` with `origin: "frontier"`), `step_frontier_graph_upsert` and an expansive STUCK_RECOVERY sub-branch to `deep-research.yaml`.
- Add the reducer `frontier` registry projection read from the node store, the `frontier` question origin, the frontier Next Focus branch, the three close rules and the dashboard metrics in `renderDashboard`.
- Add the `frontierOpen` veto in `convergence.cjs`.
- Add the fan-out path: `--depth-mode` passthrough to every lineage, a round-robin `frontier_scope:` partition persisted in `orchestration-summary.json`, each lineage's assigned nodes written into its own node store before it spawns, a merged `frontier` in `mergeResearchRegistries` and a fan-in guard that reads the persisted partition.
- Own the research-side documentation this phase makes stale: the reference docs, the manual testing playbook scenarios (written through `/create:manual-testing-playbook`), the changelog entry, the compiled-contract regeneration and the agent mirror sync. Then pilot on example target 2.

### Out of Scope
- The review-side frontier - built in `011-review-frontier-mode`, because review has no question surface and admits into different structures.
- Fixing defects D1, D5, D6, D7, D9 and D13 on the default path - owned by phases 004-007, which this phase depends on.
- A new `mode-registry.json` entry or a fifth `--convergence-mode` value - eliminated in the parent research because a mode binds one command and loop type, and a convergence-mode value would exclude `divergent` and `sliding-window`.
- Widening the research ledger upcast to carry frontier fields - eliminated; frontier data has a non-ledger channel.
- Promoting `wave_orchestration` - stays reference-only and only gains a pointer.

### Files to Change

All line numbers below were read on `main` on 2026-11-17 and go stale once 001 and 012 land. Anchor every edit on the step or function name.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/deep/research.md` | Modify | Flag table row for `--depth-mode=default\|expansive` |
| `.skilled/commands/deep/assets/deep-research-presentation.txt` | Modify | Bind `depth_mode` beside `convergence_mode`: the setup default (`:46`), the input table row (`:68`), the resolution rule (`:197`) and the bound-values list (`:211`) |
| `.skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json` | Modify | `antiConvergence.depthMode: "default"`, `expansiveDepth` block (maxDepth 3, maxChildrenPerNode 6, node cap tied to `maxIterations`, depthShares), `depthMode` in `lockedFields` |
| `.skilled/skills/system-spec-kit/runtime/cli/optimizer/optimizer-manifest.json` | Modify | Lock `antiConvergence.depthMode` so the optimizer cannot switch widening on |
| `.skilled/commands/deep/assets/deep-research.yaml` | Modify | `depth_mode` in `user_inputs` (near `:71`) and in `step_preflight_contract` `required_values_present` (`:369`); new keys in `step_create_config`; `depth_mode` extracted in `step_read_state` (`:868`) and passed to the `convergence.cjs` call (`:947`); `step_frontier_seed` before `step_fanout_spawn` and in `phase_init`; `--depth-mode {depth_mode}` on the `fanout-run.cjs` command in `step_fanout_spawn_cli` (`:345-354`); `frontier_block` in `render_prompt_pack.variables` (`:1376-1398`); `step_frontier_admit` after verify-iteration and before `step_reduce_state`; `step_frontier_graph_upsert` after `step_graph_upsert`; expansive STUCK_RECOVERY sub-branch keeping the `stuckRecovery` append; pivot gate in the divergent branch (`:1056`); pointer on `wave_orchestration` |
| `.skilled/agents/deep-research.md` and its mirrors (`.claude/agents/deep-research.md`, `.codex/agents/deep-research.toml`, `.pi/agents/deep-research.md`, `.vibe/agents/deep-research.toml`, `.dsh/agents/deep-research.patch.yml`) | Modify | `frontier_proposal` delta row type; leaves propose and never write the inbox or the node store. Mirrors synced, then `/doctor:runtime-mirrors` |
| `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` | Modify | One `{frontier_block}` token placed at the end of an existing line, so an empty value adds no byte, and the proposal row shape inside the block text |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts` | None expected | `renderPromptPack` (`:69-85`) is plain token substitution that throws `PromptPackError` on a missing variable, so the condition lives in the variable's value, not here. Every caller that renders the research template must pass `frontier_block` |
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Modify | `'frontier'` in `VALID_QUESTION_ORIGINS`; opt-in `frontier: {nodes, stats}` in `buildRegistry` read from the node store; question close rule; frontier branch in `resolveNextFocus`; frontier metrics in `renderDashboard` (`:2848`, written to `deep-research-dashboard.md` at `:3114`) |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Modify | `depthMode` added to `stopDecisionConfig` (`:1344-1368`) only when the resolved value is `expansive`, so the echoed `inputs.config` of a default run, including one that passes `--depth-mode default`, does not change; `frontierOpen` veto after the `minIterations` floor |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | `depthMode` in `FANOUT_FLAGS` (`:31`); `config.depthMode` in the lineage params (`:1658-1680`) only when the value is `expansive`, because the YAML passes `--depth-mode default` on every default run; `frontier_scope:` binding modeled on `review_focus` (`:1693`), round-robin over seeded depth-1 nodes; the partition recorded in `orchestration-summary.json` (`:3613`); each lineage's assigned nodes written into `lineages/<label>/research/frontier-nodes.jsonl` before spawn; the detached `leafContract` (`:1617-1625`) repeats the frontier rules for CLI lineages, which read the raw template |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Modify | Merged `frontier` in `mergeResearchRegistries` (`:758`); fan-in guard that reads the partition from `orchestration-summary.json` and fails when a depth-1 node is missing from every lineage |
| `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` (name proposed, plan ADR-004) | Create | Deterministic seed, six-step admission and close writer the YAML steps call, and the only writer of the node store. Without it the admission order lives in YAML prose the orchestrating model executes, which no vitest suite can test |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit.vitest.ts` | Create | New admission suite named in the parent slice plan |
| Existing suites under `.skilled/skills/system-deep-loop/runtime/tests/` | Modify | Golden byte-identity, stop-decision table (including `'echoes the input unchanged'` at `stop-decision.vitest.ts:917`), `stop-decision-yaml-contract`, reducer origin, close, fan-out, pivot-composition and the template-render suites `prompt-pack`, `deep-research-marker-scan` and `fanout-loop-prompt-in-process` |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` | Regenerate | `compile-command-contracts.cjs --command deep/research --write` after the last digested source changes; never edited by hand |
| `.skilled/skills/system-deep-loop/deep-research/references/` (`convergence.md`, `loop-protocol.md`, `state-format.md`, the quick reference), `deep-research/SKILL.md`, `deep-research/README.md` | Modify | Describe the flag, the seed step, the node store, the veto and the fan-out partition |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/` | Modify | Scenarios for `--depth-mode=expansive`, written only through `/create:manual-testing-playbook system-deep-loop update --path <dir>` |
| `.skilled/skills/system-deep-loop/deep-research/changelog/` | Create | One entry for the new flag |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With `depthMode` absent, and with an explicit `--depth-mode=default`, the findings registry, dashboard, Next Focus, rendered prompt pack, fan-out lineage prompt and the `stopDecisionConfig` echo are byte-identical to the baseline captured before this phase on the same fixture. |
| REQ-002 | `step_frontier_admit` applies the admission checks in the fixed order relevance, dedupe, depth (`maxDepth` 3), fan-out (`maxChildrenPerNode` 6 and the run node cap), monotone budget, acyclicity; the first failing check prunes the proposal with that check's reason, and only admitted nodes are written to `research/inbox.jsonl` with `origin: "frontier"`. |
| REQ-003 | A `frontier`-origin inbox row keeps its origin through the reducer instead of being rewritten to `operator`. |
| REQ-004 | The `frontierOpen` veto turns a STOP candidate into CONTINUE only under expansive mode while open or active nodes exist and depth budget remains; it acts on a `composite_converged` candidate, never outranks the cap, consecutive failures, stuck, pause, `convergenceMode: off` or `stopPolicy: max-iterations`, and leaves the frozen `stopReason` enum unchanged. |
| REQ-005 | When a frontier node reaches a terminal status (`answered`, `blocked`, `exhausted`, `abstained`, `pruned`), the reducer marks its `frontier`-origin question resolved and records the status, and the node stops counting in the graph question-coverage and source-diversity signals. |
| REQ-006 | Visiting a node does not answer it: the frontier Next Focus branch emits a focus string that differs from the node's question text, so one iteration with that focus does not resolve the question. |
| REQ-014 | Node status survives a reduce: every seed, admit, prune and close writes one row to `research/frontier-nodes.jsonl` through the admission helper, the reducer builds `registry.frontier` from that store, and reducing the same state twice gives a byte-identical `frontier`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | Under the flag, Next Focus picks the open node with the lowest depth, then one with no covering FINDING, then the oldest; the branch sits after the pivot focus and blocked-stop recovery and before continuity. |
| REQ-008 | `maxIterations` is split 50% / 35% / 15% across depths 0-1, 2 and 3; unused budget rolls down and never up; a spent band closes its open nodes as `exhausted: budget`; the node cap is tied to `maxIterations` or a minimum `maxIterations` for expansive runs is enforced. |
| REQ-009 | Under expansive mode the STUCK_RECOVERY handler closes the active node as `exhausted`, advances focus, falls through to global recovery only when no open node remains and still appends the `stuckRecovery` event that resets `stuckCount`. |
| REQ-010 | With fan-out under the flag, `step_frontier_seed` writes the depth-1 nodes before `step_fanout_spawn` runs; `fanout-run.cjs` passes `config.depthMode: expansive` to every lineage, partitions the seeded nodes round-robin through a `frontier_scope:` binding, records the partition in `orchestration-summary.json` and writes each lineage's assigned nodes into that lineage's node store before it spawns; `mergeResearchRegistries` returns a merged `frontier`; and the merge guard fails when a depth-1 node from the recorded partition is missing from every lineage. Without the flag, and with `--depth-mode default`, the lineage prompt carries no `frontier_scope:` or `depthMode` line. |
| REQ-011 | With `divergent`, the Council pivot fires only once every frontier node is terminal. |
| REQ-012 | A pilot run on example target 2 roots its depth-1 nodes at the prompt-policy gate and its threshold config, places the scorer at depth 2, dedupes against the ten `specs/system-skill-advisor/routing-and-scoring/001-010` packets and ends in a non-cap stop with every node terminal. |
| REQ-013 | The dashboard that `renderDashboard` writes reports frontier size, pruned nodes, revisits and budget spent per depth under the flag. |
| REQ-015 | On the single-executor path under the flag, `step_frontier_seed` runs in `phase_init` after `step_create_config`, so iteration 1 already has open depth-1 nodes. |
| REQ-016 | The flag is bound on every surface `convergence_mode` is bound on: the presentation asset, `user_inputs`, `step_preflight_contract`, `step_read_state` and the `convergence.cjs` call, with a `stop-decision-yaml-contract` case. |
| REQ-017 | The research reference docs, `deep-research/SKILL.md`, `deep-research/README.md`, a changelog entry, the playbook scenarios (through `/create:manual-testing-playbook`), the regenerated research compiled contract and the synced agent mirrors all land in this phase. |

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
| Dependency | Phase 012 (pivot hygiene) | 012 rewrites the pivot branch in `deep-research.yaml` (`:1056-1112`) for the quorum retry; T018 gates the same branch | Start only after 012 is merged |
| Risk | The fan-out seed step reads the topic only, before any iteration has run, so depth-1 nodes come from the topic text alone | Med | The seed step uses the same admission checks as a proposal, and the pilot records how many depth-1 nodes the seed produced |
| Risk | A new `{frontier_block}` token throws `PromptPackError` in any caller that renders the research template without it | High | T016 greps every caller and test that renders the template and adds the variable to each before the token lands |
| Risk | Parallel phases rewrite the same compiled contract | Med | Regenerate after each merge with `compile-command-contracts.cjs`; never resolve its digest lines by hand |
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
| Coordination | 12/15 | Dependencies: 5 predecessor phases plus the successor review phase |
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

- Which file holds the admission helper and node store? Plan ADR-004: `runtime/scripts/frontier-admit.cjs` and `research/frontier-nodes.jsonl`, shared with the review phase through a target mode. Accepted by the operator 2026-11-17 (T000).
- Should the node cap be derived from `maxIterations`, or should expansive mode enforce a minimum `maxIterations`? Derived from `maxIterations`, plan ADR-003, accepted 2026-11-17.
- Does the graph close rule skip writing pruned and exhausted nodes, or re-kind them on close? Skip pruned, re-kind the rest, plan ADR-002, accepted 2026-11-17.
- How does the seed step decompose a topic into depth-1 nodes before any iteration? Plan ADR-005, accepted 2026-11-17: the orchestrating model writes candidate nodes from the topic and the init key questions, and every candidate goes through the same six admission checks as a leaf proposal.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Parent Research**: See `../research/research.md`

---
