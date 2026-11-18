---
title: "Feature Specification: Opt-in expansive depth mode for deep-review: admission into candidateCoverage and searchDebt"
description: "Deep-review has no question surface, so the research frontier cannot be reused as is: a review run cannot widen beyond its four fixed dimensions or decompose a large target. This phase adds the review side of --depth-mode=expansive, admitting leaf-proposed sub-targets into candidateCoverage and searchDebt, with a review proposal channel, a review Next Focus branch, the stop veto and pivot seed changes, and default runs byte-identical."
trigger_phrases:
  - "review frontier mode"
  - "opt in expansive depth mode for deep review"
  - "depth-mode expansive review"
  - "review frontier admission"
  - "candidateCoverage searchDebt frontier"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Opt-in expansive depth mode for deep-review: admission into candidateCoverage and searchDebt

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

A deep-review run covers four fixed dimensions over one configured target and has no question set, inbox or other surface that can grow mid-run, so a target like "the last 100 commits" cannot be split into subsystems and batches. This phase builds Slice K of the parent research: the review side of `--depth-mode=expansive`, which seeds depth-1 sub-target nodes before the first iteration, admits typed `frontier_proposal` rows from a new review pack channel into `candidateCoverage` and `searchDebt` plus a review `registry.frontier`, keeps node status in its own append-only store, steers the dispatched dimension and focus through `step_read_state`, extends the `frontierOpen` veto to review stop candidates and changes the `divergent-review-pivot.ts` seeds. Fan-out runs get the seed before spawn, a `--depth-mode` passthrough, a recorded partition and a merged review `frontier`. The proof is a golden test that keeps default review runs byte-identical, a review admission suite, `review-depth-convergence` cases and a pilot on the last-100-commits target with fan-out partitioning of its seven subsystem nodes.

**Key Decisions**: admit into the review coverage surfaces, never an inbox; reuse the research phase's flag, admission helper, node-store row shape, seed step, depth budget and veto rather than a second design; steer through `next_dimension` and a `{frontier_block}` pack variable, because review dispatch reads `next_dimension` (`deep-review.yaml:904`) and the reducer's Next Focus is advisory text.

**Critical Dependencies**: phases `003-review-min-iterations-floor`, `004-focus-hijack-fix`, `008-review-dimension-coverage`, `009-fanout-review-coverage-merge`, `010-research-frontier-mode` and `012-pivot-hygiene` must land first. 003 adds the review floor the veto sits after, 004 rewrites the review focus block this phase extends, and 012 rewrites the pivot branch and `divergent-review-pivot.ts` this phase gates.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Research** | `../research/research.md` (sections 8, 9, 10, 18, 20 Slice K) |
| **Depends On** | `003-review-min-iterations-floor`, `004-focus-hijack-fix`, `008-review-dimension-coverage`, `009-fanout-review-coverage-merge`, `010-research-frontier-mode`, `012-pivot-hygiene` |
| **Predecessor** | `010-research-frontier-mode` |
| **Level Basis** | `recommend-level.sh --loc 650 --files 14 --architectural --api` printed Level 3, score 73/100. `--api` is set because the phase adds the review flag plus new delta-row and registry contracts. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The review coverage universe is `reviewDimensions`, normalized once at init and locked, and the review reducer has no `inbox`, `keyQuestions` or `openQuestions` surface, so nothing a leaf discovers can become counted review work. The review pivot's seed vocabulary is closed and its seat mandates forbid expanding the configured target, so a large target is reviewed as one undivided unit on four axes. A research-style inbox admission would be read by nothing on review.

### Purpose
With `--depth-mode=expansive`, a review run decomposes its target into admitted sub-target nodes held in `candidateCoverage`, `searchDebt` and a review `registry.frontier`, focuses them breadth-first, refuses to stop while they are open within budget, closes them cleanly and partitions depth-1 nodes across fan-out lineages; without the flag, nothing changes byte for byte.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run on `main` at 2026-11-17 from the repository root (`D=.skilled/skills/system-deep-loop`). No review surface knows the flag, a proposal row, a `frontier_scope:` binding or an inbox; the five `frontier` hits in `deep-review.yaml` are all the pivot's candidate frontier; the review default cap is 7.
```text
$ rg -c "depth-mode|depthMode|frontier_proposal|frontier_scope|inbox" .skilled/commands/deep/review.md $D/deep-review/assets/deep-review-config.json $D/deep-review/assets/prompt-pack-iteration.md.tmpl $D/runtime/scripts/reduce-state.cjs $D/deep-review/scripts/divergent-review-pivot.ts; echo "rg exit=$?"
rg exit=1
$ rg -c "frontier" .skilled/commands/deep/assets/deep-review.yaml
5
$ rg -n '"maxIterations"' $D/deep-review/assets/deep-review-config.json
9:  "maxIterations": 7,
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `--depth-mode=default|expansive` to `/deep:review` and the `depthMode` plus `expansiveDepth` keys to the review config, locked against the optimizer, and bind it on every surface `convergence_mode` is bound on: the review presentation asset, the YAML `user_inputs`, preflight, `step_read_state` and the `convergence.cjs` call.
- Add a review node-status store, `review/frontier-nodes.jsonl`, with the row shape of phase 010's store and written only by the phase-010 helper in its review target mode. Review has no inbox and `buildSearchLedgerState` (`runtime/scripts/reduce-state.cjs:1764`) rebuilds coverage from iteration records on every reduce, so admitted nodes need their own durable rows.
- Add a review `step_frontier_seed` that decomposes the review target into depth-1 nodes: before `step_fanout_spawn` on the fan-out path, in `phase_init` after `step_create_config` otherwise.
- Add the `frontier_proposal` channel to the review leaf contract and the review prompt pack.
- Add a review admission step in `deep-review.yaml` that reuses the research admission order and writes admitted nodes into `searchDebt`, `candidateCoverage` and a review `registry.frontier`, plus the expansive STUCK_RECOVERY sub-branch.
- Add the review reducer frontier projection read from the node store, the close rule, per-node dimension coverage and the Next Focus branch, and extend the `frontierOpen` veto to review stop candidates.
- Steer dispatch: under the flag, `step_read_state` extracts the active frontier node from `registry.frontier` and sets `next_dimension` to that node's next uncovered dimension, and the review pack carries the node through a `{frontier_block}` variable.
- Change `divergent-review-pivot.ts` seeds and gating under the flag, add the review fan-out path (`--depth-mode` passthrough, a `frontier_scope:` prompt binding with the partition recorded as `frontier_partition` in `orchestration-summary.json`, per-lineage stores, a merged `frontier` in `mergeReviewRegistries` and the merge guard), then pilot on example target 1.
- Own the review-side documentation this phase makes stale: the reference docs, the playbook scenarios (through `/create:manual-testing-playbook`), the changelog entry, the review compiled-contract regeneration and the agent mirror sync.
- Inert default-run byte change (2026-11-18): `step_create_config` writes `expansiveDepth.maxFrontierNodes: null` for every run, where it wrote the iteration budget before, so admission derives the cap as half of `maxIterations`. A default run's config file therefore differs by that one value; only expansive steps (`frontier-admit.cjs` seed and admit) read it, so default behavior does not change.

### Out of Scope
- An inbox or question surface for review - eliminated in the parent research because the review reducer would read nothing from it.
- The research frontier - built in `010-research-frontier-mode`; this phase reuses its admission helper, budget split and veto.
- Carrying the existing review coverage surfaces through the fan-out merge and deciding custom review dimensions - owned by `009-fanout-review-coverage-merge` and `008-review-dimension-coverage`. The merged review `frontier` is new data and is built here.
- Relaxing the pivot's ban on expanding the configured target - frontier nodes stay inside the root scope, so the ban stays.

### Files to Change

All line numbers below were read on `main` on 2026-11-17 and go stale once 001, 003, 004, 008 and 012 land. Anchor every edit on the step or function name.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/deep/review.md` | Modify | Flag table row for `--depth-mode=default\|expansive` |
| `.skilled/commands/deep/assets/deep-review-presentation.txt` | Modify | Bind `depth_mode` beside `convergence_mode`: the setup default (`:42`), the input table row (`:75`), the resolution rule (`:228`) and the bound-values list (`:244`) |
| `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json` | Modify | `antiConvergence.depthMode: "default"`, `expansiveDepth` block, `depthMode` in `lockedFields` |
| `.skilled/skills/system-spec-kit/runtime/cli/optimizer/optimizer-manifest.json` | Modify | Lock the review `depthMode` key |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modify | `depth_mode` in `user_inputs` (`:54-58`) and `step_preflight_contract` (`:356`); keys in `step_create_config` (`:674`); review `step_frontier_seed` before `step_fanout_spawn` (`:304`) and in `phase_init`; `--depth-mode {depth_mode}` on the `fanout-run.cjs` command (`:327-341`); in `step_read_state` (`:889`) a `depth_mode` extract, an `active_frontier_node` extract from `registry.frontier`, and a flag-gated case in the `next_dimension` rule (`:904`) that returns the node's next uncovered dimension; `--depth-mode` on the `convergence.cjs` call (`:989`); `frontier_block` in `render_prompt_pack.variables` (`:1450`), modeled on `review_focus_block`; review admission step after verify-iteration and before the reduce step; expansive STUCK_RECOVERY sub-branch keeping `deep_review.recovery_started`; pivot gating in the divergent branch (`:1150`) as 012 left it |
| `.skilled/agents/deep-review.md` and its mirrors (`.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`, `.pi/agents/deep-review.md`, `.vibe/agents/deep-review.toml`, `.dsh/agents/deep-review.patch.yml`) | Modify | `frontier_proposal` delta row type for review leaves; mirrors synced, then `/doctor:runtime-mirrors` |
| `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl` | Modify | One `{frontier_block}` token placed so an empty value adds no byte, and the proposal row shape inside the block text |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts` | None expected | Plain token substitution (`:69-85`); the condition lives in the variable's value. Every caller that renders the review template must pass `frontier_block` |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modify | Review `registry.frontier` read from `review/frontier-nodes.jsonl`, admitted nodes as open `searchDebt` entries, close rule, per-node dimension coverage; the frontier assignment in the strategy focus block (`:2173-2187`) and its dashboard twin (`:2271-2274`); frontier metrics in `renderDashboard` (`:2257`, rows near `:2301`) |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Modify | Apply the existing `frontierOpen` veto to review stop candidates (`all_dimensions_clean`, composite), after the review floor that 003 adds; add the review `frontierTotal` fact and the expansive `frontier_drained` candidate (REQ-017) |
| `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs` | Modify | Review finding evidence from `--state-log`, `--delta-dir` and `--iteration`, the finding id fold, and the undeclared-endpoint edge skip (REQ-018) |
| `.skilled/commands/deep/assets/deep-research.yaml` | Modify | The lineage-local graph store instruction on `step_graph_convergence`, `step_graph_upsert` and `step_frontier_graph_upsert` (REQ-016) |
| `.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts` | Modify | Pivot only once the frontier is terminal; seed from terminal unanswered nodes; route accepted candidates through admission |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Review `config.depthMode` passthrough only when the value is `expansive` and `frontier_scope:` binding beside `review_focus` (`:1693`), the partition recorded in `orchestration-summary.json`, each lineage's nodes written into `lineages/<label>/review/frontier-nodes.jsonl` before spawn, the review detached `leafContract` (`:1617-1625`); `DEEP_LOOP_COVERAGE_DB_DIR` in every lineage's dispatch env (REQ-016) |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Modify | Merged review `frontier` in the return of `mergeReviewRegistries` (`:981-996`), and the review fan-in guard over the recorded partition and the phase-009 merged coverage |
| `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` (created by phase 010) | Modify | Review target mode writing node-store rows and debt entries instead of inbox rows |
| Review suites under `.skilled/skills/system-deep-loop/runtime/tests/` | Create/Modify | Review admit suite, golden review case, `deep-review-deltas-contract`, `deep-review-state-reducer`, `review-depth-convergence`, `stop-decision-yaml-contract`, pivot, fan-out, and the template-render suites `prompt-pack`, `deep-review-marker-scan` and `fanout-review-focus` |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Regenerate | `compile-command-contracts.cjs --command deep/review --write` after the last digested source changes; never edited by hand |
| `.skilled/skills/system-deep-loop/deep-review/references/` (`convergence/`, `protocol/loop-protocol.md`, `state/` state-format, the quick reference), `deep-review/assets/review-mode-contract.yaml`, `deep-review/SKILL.md`, `deep-review/README.md` | Modify | Describe the flag, the seed step, the node store, the steering rule, the veto and the fan-out partition |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/` | Modify | Scenarios for `--depth-mode=expansive` on review, written only through `/create:manual-testing-playbook system-deep-loop update --path <dir>` |
| `.skilled/skills/system-deep-loop/deep-review/changelog/` | Create | One entry for the review flag |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With `depthMode` absent, and with an explicit `--depth-mode=default`, the review registry, dashboard, Next Focus, rendered review prompt pack, pivot seed output and fan-out lineage prompt are byte-identical to the baseline captured before this phase. |
| REQ-002 | The review admission step applies the same six ordered checks as phase 010; an admitted node is recorded in `review/frontier-nodes.jsonl` and becomes an open `searchDebt` entry and a `registry.frontier` node, and no row is written to any inbox. |
| REQ-003 | The `frontierOpen` veto applies to review STOP candidates (`all_dimensions_clean` and the composite vote) under the same conditions as research and never outranks the cap, failures, stuck, pause, `off` or `max-iterations`. |
| REQ-004 | When a review node reaches a terminal status, its `searchDebt` entry is cleared and its status is recorded in `registry.frontier`; an `answered`, `pruned` or `abstained` node is also recorded in a non-debt `candidateCoverage` bucket, and no terminal status is written as a `deferred` or `blocked` disposition, so a fully terminal frontier leaves no frontier-owned debt. |
| REQ-005 | The review prompt pack carries a `frontier_proposal` channel under the flag through a `{frontier_block}` variable that is empty when the flag is off, and the review agent definition and pack allowed-write list agree on it. |
| REQ-011 | Review node status survives a reduce: every seed, admit, prune and close writes one row to `review/frontier-nodes.jsonl` through the phase-010 helper, the reducer builds `registry.frontier` and the frontier debt from that store, and reducing the same state twice gives a byte-identical `frontier` and `searchDebt`. |
| REQ-012 | Under the flag the dispatched iteration works the active frontier node: `step_read_state` reads the active node from `registry.frontier`, `next_dimension` is that node's next uncovered dimension, and the rendered pack names the node through `{frontier_block}`. Without the flag `next_dimension` follows today's rule unchanged. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Under the flag, the review Next Focus frontier assignment is placed in the reducer's last-assignment-wins sequence, in the strategy focus block and its dashboard twin, so the effective precedence is blocked-stop text, then pivot focus, then the frontier node, then the leaf `nextFocus`, then the first uncovered dimension. This text is advisory; REQ-012 is what steers dispatch. |
| REQ-007 | Under the flag, the review pivot is prepared only once every frontier node is terminal, may seed from nodes closed `exhausted` or `blocked`, and routes an accepted candidate through admission; the boundary regexes and the configured-target ban stay unchanged. |
| REQ-008 | With fan-out under the flag, the review `step_frontier_seed` writes the depth-1 nodes before `step_fanout_spawn`; `fanout-run.cjs` passes `config.depthMode: expansive` to every review lineage (nothing for `default`), partitions the nodes round-robin through a `frontier_scope:` binding that coexists with `review_focus`, records the partition as `frontier_partition` in `orchestration-summary.json` and writes each lineage's nodes into its store before it spawns; `mergeReviewRegistries` returns a merged `frontier`; and the merge guard fails when a partitioned depth-1 node is missing from every lineage. |
| REQ-009 | Under expansive mode the review STUCK_RECOVERY handler closes the active node as `exhausted`, advances focus and still appends `deep_review.recovery_started`, which projects to the `stuckRecovery` event that resets `stuckCount`. |
| REQ-010 | A pilot on example target 1 reviews `<pilot-sha>~100..<pilot-sha>` with the SHA recorded at start, prunes merges as `merge-no-own-diff` and index rebuilds as `generated-artifact` in the seed step, admits the seven subsystem nodes at depth 1, partitions them across fan-out lineages and ends with every node terminal on a non-cap stop. |
| REQ-013 | The flag is bound on every surface `convergence_mode` is bound on: the review presentation asset, `user_inputs`, `step_preflight_contract`, `step_read_state` and the `convergence.cjs` call, with a `stop-decision-yaml-contract` case. |
| REQ-014 | Each review node records which configured dimensions it has covered, so ADR-002's focus can name the node's next uncovered dimension and a node closes `answered` once every configured dimension is covered for it. |
| REQ-015 | The review reference docs, `review-mode-contract.yaml`, `deep-review/SKILL.md`, `deep-review/README.md`, a changelog entry, the playbook scenarios (through `/create:manual-testing-playbook`), the regenerated review compiled contract and the synced agent mirrors all land in this phase. |
| REQ-016 | Named defect fix, which also changes default fan-out runs of both loop types: every fan-out lineage keeps its coverage graph in `graph-db/` inside its own directory. `fanout-run.cjs` exports `DEEP_LOOP_COVERAGE_DB_DIR` to that directory for every lineage, and each graph-writing step in `deep-review.yaml` and `deep-research.yaml` tells a fan-out lineage that the store is inside its write surface and how to bind it. The defect: the store defaulted to the shared runtime database outside the lineage write surface, so five of six pilot lineages skipped every graph step, ran graphless, and could never pass `hotspotSaturationGate`. Fail-first tests: `fanout-run.vitest.ts` (the env a research and a review lineage receive) and `stop-decision-yaml-contract.vitest.ts` (the six graph-writing steps). |
| REQ-017 | Under the flag, a review run whose frontier holds at least one node and none open or active, and which forms neither `all_dimensions_clean` nor the composite candidate, gets the hard candidate `frontier_drained`. It never outranks the cap, failures, stuck recovery, `off`, `max-iterations` or the floor, every legal-stop gate and the graph decision still decide it, and a default run never forms it (plan ADR-006, decision-record Q003). A frontier that closed with no `answered` node, every node exhausted or pruned, forms no candidate. |
| REQ-018 | Named defect fix, which also changes default review runs: the review graph upsert derives one FINDING node per finding and one `EVIDENCE_FOR` edge to the FILE node of its `file:line` ref, read from the iteration's delta finding rows and state record, so evidence density no longer depends on the leaf sending graph events. Re-upserting an iteration adds no duplicate node or edge, a finding without a ref adds no edge, a leaf finding node whose id wraps the finding id folds onto the same node, and an edge to a node neither the batch nor the stored graph declares is skipped and reported instead of failing the foreign key (all loop types). The derived FINDING nodes also enter the graph's `findingStability` signal (the share of finding nodes no CONTRADICTS edge touches), which moves in default runs too: a leaf CONTRADICTS edge on a finding now weighs against more finding nodes. Finding ids fold case-insensitively onto this iteration's and the stored findings, an id that collides with a stored finding of another file and title is keyed on the id and the iteration, and only a `file:line` ref earns an edge, with any trailing column dropped. The defect: the canonical projection built no evidence edges, so the pilot lineages whose leaves sent none got a `CONTINUE` graph decision with every legal-stop gate passing. Decision-record Q003 and the operator's ruling of 2026-11-18. Fail-first tests: `upsert-script.vitest.ts` (evidence edge, delta-sourced ref, fold, re-upsert, no ref, undeclared target) and `stop-decision-yaml-contract.vitest.ts` (the step passes the state log, delta directory and iteration). |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The golden review test passes for the absent key and `--depth-mode=default`, and `review-depth-convergence`, the `deep-review-*` reducer suites, `deep-review-deltas-contract`, `divergent-pivot*`, `fanout-*` and `check-contract-drift` stay green, run with `npm test` from `.skilled/skills/system-deep-loop/runtime`.
- **SC-002**: The target-1 pilot registry shows seven depth-1 nodes, every node terminal and no frontier-owned `searchDebt` entry left open, and the merged fan-out result accounts for all seven.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `009-fanout-review-coverage-merge` (Slice I) | Without it the merged review registry drops `candidateCoverage` and `searchCoverage`, so the review fan-in guard has nothing to read | Start only after 009 is merged |
| Dependency | `010-research-frontier-mode` (Slice J) | The admission helper, budget split and veto this phase reuses do not exist | Start only after 010 is merged |
| Dependency | `008-review-dimension-coverage` (Slice H) | Binding: the operator chose on 2026-11-17 that 008 supports custom dimensions, so the review coverage universe this phase extends is the configured list that 008 makes trackable | Start only after 008 is merged |
| Dependency | `003-review-min-iterations-floor` and `004-focus-hijack-fix` | The veto sits after the review floor 003 adds (`convergence.cjs:1159`), and 004 rewrites the review focus block (`reduce-state.cjs:2173-2187`) this phase extends | Start only after both are merged |
| Dependency | `012-pivot-hygiene` | 012 rewrites the review pivot branch (`deep-review.yaml:1158-1206`) and counts seats in `divergent-review-pivot.ts`, which T017 also edits | Start only after 012 is merged |
| Risk | A new `{frontier_block}` token throws `PromptPackError` in any caller that renders the review template without it | High | T009 greps every caller and test that renders the template and adds the variable to each before the token lands |
| Risk | Frontier focus starves dimension coverage, so the four-dimension gate never clears | Med | The frontier focus names the node and its next uncovered dimension (plan ADR-002) |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The review admission step adds no new process per iteration and its suite runs inside the existing vitest run.

### Security
- **NFR-S01**: Review leaves never write `candidateCoverage`, `searchDebt` or the registry; only the workflow admission step and the reducer do.

### Reliability
- **NFR-R01**: An absent `depthMode` key reads as `default`, and every review branch added here is unreachable when the flag is off.

---

## 8. EDGE CASES

- Empty input: an expansive review whose leaves propose nothing behaves like a default review; the veto is a no-op on an empty frontier.
- Maximum input: proposals beyond the depth, children or node caps are pruned with their reason. Under ADR-002 a node is worked one dimension per iteration, so with seven depth-1 nodes over L lineages and D configured dimensions, each lineage's depth-1 band (50% of its `maxIterations`) must be at least `ceil(7 / L) * D`, or the pilot config is rejected. With the default four dimensions and three lineages that is 12, so each lineage needs `maxIterations` of at least 24.
- Failure path: a proposal whose scope does not intersect the configured review target is pruned on relevance and never becomes debt.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: about 14, LOC: about 650, Systems: review workflow, review reducer, convergence, pivot, fan-out |
| Risk | 16/25 | Auth: N, API: Y (flag, delta row, registry field), Breaking: N (opt-in) |
| Research | 10/20 | Bucket mapping and dimension interplay left open by the parent research |
| Multi-Agent | 6/15 | Workstreams: 2 (runtime and workflow) |
| Coordination | 12/15 | Dependencies: six predecessor phases |
| **Total** | **62/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Default review regression through the shared reducer, convergence or pivot files | H | M | Golden review test covering registry, dashboard, focus, pack, pivot seeds and lineage prompt |
| R-002 | Frontier debt never clears, fails `candidateCoverageGate` and turns the verdict CONDITIONAL | H | M | Close rule (REQ-004) and a close test asserting empty frontier debt and a passing gate |
| R-003 | Pivot reopens breadth outside the configured target | M | L | Admission relevance check plus unchanged boundary regexes |
| R-004 | Commit profile drifts between planning and pilot | L | H | Pin the range to a recorded SHA |

---

## 11. USER STORIES

### US-001: Review a large commit range by subsystem (Priority: P0)

**As a** deep-review operator, **I want** `--depth-mode=expansive` to split the last 100 commits into subsystem and batch nodes, **so that** each cluster gets its own review pass instead of one shallow sweep.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Keep default reviews untouched (Priority: P1)

**As a** maintainer of existing review workflows, **I want** reviews without the flag to produce the same bytes as before, **so that** nothing that does not opt in can regress.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- How does each terminal status map to a `candidateCoverage` bucket? The parent research is silent. The reducer turns every `deferred` or `blocked` disposition into a `searchDebt` entry (`runtime/scripts/reduce-state.cjs`, the `disposition === 'deferred' || disposition === 'blocked'` branch), so those buckets cannot hold closed nodes; decided in plan ADR-001, accepted 2026-11-17.
- Does the review coverage graph need a frontier upsert counterpart, or do the review coverage surfaces carry the frontier alone? UNKNOWN until the review graph signals are read at build time.
- Is the depth-1 band rule `ceil(7 / L) * D` affordable for the pilot, or should the pilot narrow `review_dimensions`? Plan ADR-002, accepted 2026-11-17, allows either; the pilot's pick is still to be recorded before the pilot runs.
- Answered while revising: `dimension_queue` is written only at init (`deep-review.yaml:639-641`) and the reducer never rewrites it, so frontier steering changes the `next_dimension` rule in `step_read_state`, not the strategy queue.
- Answered while authoring: `searchDebt` does take part in the stop. `convergence.cjs` passes `candidateCoverageGate` only when `searchDebt.length === 0` (`everyRequiredClassCovered`), and the synthesis counts non-empty debt as a CONDITIONAL verdict. So frontier debt left open after every node is terminal blocks the stop and degrades the verdict, which is why REQ-004 is P0.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Parent Research**: See `../research/research.md`

---
