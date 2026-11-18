---
title: "Implementation Plan: Opt-in expansive depth mode for deep-research: frontier admission, veto, close rules"
description: "Builds the research frontier sub-mode behind --depth-mode=expansive in the parent research's internal order: config and flag, golden byte-identity test, reducer projection and Next Focus, admission step, veto, proposal rows, graph upsert, fan-out frontier_scope. Every new branch is gated on the flag, and a golden test pins default runs byte for byte."
trigger_phrases:
  - "research frontier mode plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Opt-in expansive depth mode for deep-research: frontier admission, veto, close rules

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS scripts (`.cjs`), TypeScript runtime libraries, YAML workflow assets |
| **Framework** | `system-deep-loop` deep-research workflow (`/deep:research`) |
| **Storage** | JSONL state files (`deltas/iter-NNN.jsonl`, `research/inbox.jsonl`), `findings-registry.json`, the coverage graph |
| **Testing** | vitest suites under `.skilled/skills/system-deep-loop/runtime/tests/` |

### Overview
The change adds one opt-in flag and threads it through config, workflow, leaf contract, reducer, convergence and fan-out, each new branch reachable only when `depthMode` is `expansive`. Frontier growth runs leaf proposal, then workflow admission into the existing inbox growth path, then reducer projection, then focus, veto and close. A golden byte-identity test lands before any behavior change and guards every later step.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified: phases 004, 005, 006, 007 and 012 merged, confirmed with `git log --oneline` naming each
- [x] ADR-001 to ADR-005 below Accepted or replaced by the operator (T000). Accepted as proposed 2026-11-17.

### Definition of Done
- [ ] All acceptance criteria met
- [ ] From `.skilled/skills/system-deep-loop/runtime`, `npm test` exits 0, including the golden, admission, stop-decision, close and fan-out cases. Vitest run from any other directory finds no `.vitest.ts` file, because the only config is `runtime/vitest.config.ts`
- [ ] The research compiled contract is regenerated and `check-contract-drift.vitest.ts` passes
- [ ] Reference docs, playbook scenarios, changelog and agent mirrors updated (REQ-017)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Flag-gated pipeline extension: propose, admit, project, steer, veto, close.

### Key Components
- **`step_frontier_seed`**: writes the depth-1 nodes before the first iteration. Fan-out lineages are spawned before any iteration runs (`deep-research.yaml:327-357`: `step_fanout_spawn` skips `phase_init` and `phase_main_loop`), so without a seed step a partition would run over an empty frontier and every lineage would fall back to default mode.
- **Node-status store (`research/frontier-nodes.jsonl`)**: append-only rows `{nodeId, parentId, depth, scope, status, reason, iteration}`; the last row per `nodeId` wins. `readInboxQuestions` (`deep-research/scripts/reduce-state.cjs:1137-1175`) keeps only six fields and `buildRegistry` (`:2480`) rebuilds the registry from inputs, so neither the inbox nor the registry can hold status.
- **Leaf proposal (`frontier_proposal` delta row)**: the leaf names a candidate node with an evidence anchor; it never writes state.
- **`step_frontier_admit` and `frontier-admit.cjs`**: applies the six admission checks, writes admitted nodes to `research/inbox.jsonl` with `origin: "frontier"` and records every admit and prune in the node store. Without it nothing writes the inbox, which is the only path that grows the counted question set. The same script writes the workflow-owned closes (`exhausted` from the stuck sub-branch and spent budget bands).
- **Reducer frontier projection**: builds `findings-registry.json` `frontier: {nodes, stats}` from the node store, derives `answered` from the registry, applies the question close rule, picks Next Focus and adds the frontier metrics in `renderDashboard`.
- **`frontierOpen` veto**: reads `registry.frontier.stats`, already loaded by `convergence.cjs`, and converts a STOP candidate to CONTINUE.
- **`step_frontier_graph_upsert`**: writes admitted nodes as QUESTION nodes with `DERIVED_FROM` edges and applies the graph close rule, so traversal no longer depends on inconsistent leaf graph events.
- **Prompt variable `frontier_block`**: the YAML computes it as an empty string unless the mode is expansive. The template token sits at the end of an existing line, so an empty value adds no byte and `renderPromptPack` needs no change.
- **Fan-out path**: `fanout-run.cjs` takes `--depth-mode`, puts `config.depthMode` in every lineage's params when the value is `expansive` (never for `default`, so default lineage prompts keep their bytes), partitions the seeded depth-1 nodes round-robin through `frontier_scope:`, records the partition in `orchestration-summary.json` and writes each lineage's nodes into `lineages/<label>/research/frontier-nodes.jsonl` before it spawns. `mergeResearchRegistries` merges `frontier`, and the merge guard checks the merged nodes against the recorded partition.

### Data Flow
Before the first iteration, `step_frontier_seed` writes depth-1 nodes to the node store (and, under fan-out, `fanout-run.cjs` splits them across lineage stores). Leaf writes `frontier_proposal` rows in `deltas/iter-NNN.jsonl`. After verify-iteration, `step_frontier_admit` reads them, prunes or admits, appends admitted rows to `research/inbox.jsonl` and records each outcome in the node store. `step_reduce_state` promotes inbox rows to counted questions, builds the `frontier` field from the node store, closes terminal nodes and writes Next Focus. `step_graph_upsert` then `step_frontier_graph_upsert` update the coverage graph. `convergence.cjs` evaluates the stop order and applies the veto after the floor. At fan-in, `mergeResearchRegistries` merges each lineage's `frontier` and the guard reads the recorded partition.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is a feature, not a fix, but it edits shared default-path files, so each surface is listed with its default-path effect.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep-research/scripts/reduce-state.cjs` | Owns the registry, question resolution and Next Focus for every research run | update, flag-gated | Golden byte-identity test with the key absent |
| `runtime/scripts/convergence.cjs` | Owns the stop order for both loops | update, veto unreachable when off | Stop-decision table test and the existing `stop-decision*` suites |
| Research template and every caller that renders it (`deep-research.yaml` `render_prompt_pack`, `prompt-pack.vitest.ts`, `deep-research-marker-scan.vitest.ts`, `fanout-loop-prompt-in-process.test.ts`) | Renders every iteration prompt | update: one new `{frontier_block}` token, empty when off; `prompt-pack.ts` unchanged | Golden test compares the rendered pack; each caller passes the variable |
| `runtime/scripts/fanout-run.cjs`, `fanout-merge.cjs` | Build lineage prompts and merge registries | update, binding, `depthMode` param and merged `frontier` absent when off | `fanout-run`, `fanout-merge*` suites plus a no-binding case |
| `commands/deep/assets/deep-research-presentation.txt` and the YAML setup steps | Bind setup values before any write | update, `depth_mode` defaults to `default` | `stop-decision-yaml-contract` case |
| `commands/deep/assets/compiled/deep-research.contract.markdown` | Digests the command doc, presentation, YAML, template and agent | regenerate | `check-contract-drift.vitest.ts` |
| `append-mode-event.cjs` research upcast | Projects state-log rows | unchanged, not a consumer | `append-mode-event-legacy-seam` stays green |
| `mode-registry.json` | Binds modes to commands | unchanged, not a consumer | `rg -c depthMode mode-registry.json` prints nothing |

Required inventories:
- Same-class producers: `rg -n 'VALID_QUESTION_ORIGINS|resolveNextFocus|buildRegistry' .skilled/skills/system-deep-loop`.
- Consumers of changed symbols: `rg -n 'frontier|depthMode' .skilled --glob '*.cjs' --glob '*.ts' --glob '*.md' --glob '*.yaml'`.
- Matrix axes: `depthMode` (absent, default, expansive) x `convergenceMode` (default, divergent, sliding-window) x `stopPolicy` (convergence, max-iterations) x executor (single, fan-out).
- Algorithm invariant: admission is order-fixed and first-failure-wins; budgets only narrow from parent to child; the veto never creates a STOP.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the operator's ADR acceptance, confirms phases 004-007 and 012 are merged and captures the golden baseline on that tree. Implementation follows the research order: config and flag with every binding surface, golden assertion, node store and admission helper, seed step, reducer projection with Next Focus and the question close rule, `step_frontier_admit`, the veto, the proposal rows, the graph upsert with its close rule, then the fan-out path (passthrough, partition, per-lineage stores, merged `frontier`, guard). Documentation closes the phase: reference docs, playbook scenarios, changelog, contract regeneration and mirrors. Verification runs the full suite and the target-2 pilot.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Admission order and prune reasons, depth budget roll-down, veto table, reducer origin, close rules, reduce-twice node store, stuck sub-branch counter reset | vitest, run as `npm test -- tests/unit/<file>` from `.skilled/skills/system-deep-loop/runtime` |
| Integration | Golden byte-identity (registry, dashboard, Next Focus, prompt pack, lineage prompt), seed-then-spawn, fan-out partition, per-lineage store and merge guard, divergent composition | vitest with fixture packets |
| Contract | YAML wording that Vitest cannot execute (seed placement, stuck sub-branch, pivot gate): asserted as text in `stop-decision-yaml-contract.vitest.ts`, which pins wording, not behavior | vitest |
| Manual | Pilot `/deep:research` run on example target 2 with `--depth-mode=expansive`, plus the playbook scenarios this phase writes | `/deep:research`, `jq` over `findings-registry.json` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `004-focus-hijack-fix` (Slice D) | Internal | Red (not built) | Free-text focus hijack competes with the frontier branch |
| `005-prompt-pack-contract-alignment` (Slice E) | Internal | Red (not built) | Pack and agent allowed-write lists disagree, so the proposal channel lands on an inconsistent contract |
| `006-state-log-leaf-fields` (Slice F) | Internal | Red (not built) | Leaf fields and the findings gate stay dark; `focusAlignment` behavior undefined for the risk case |
| `007-source-diversity-quality-class` (Slice G) | Internal | Red (not built) | Graph `sourceDiversity` stays gameable and can block the expansive stop |
| `012-pivot-hygiene` (Slice L) | Internal | Red (not built) | 012 rewrites the pivot branch for the quorum retry; T018 would gate a branch that is about to change |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the golden byte-identity test fails on `main`, or any existing guard suite turns red after a merge from this phase.
- **Procedure**: revert this phase's commits with `git revert <sha>`; because every branch is flag-gated and the config key reads absent as default, existing packets need no migration.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 004, 005, 006, 007 and 012 merged; ADRs accepted | Implementation |
| Implementation | Setup golden baseline | Verification |
| Verification | All implementation steps | Phase 011 and packet close |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
config+flag+bindings ──► golden test ──► node store+helper ──► seed step ──► reducer projection/focus/close
                                                                                       │
        docs+contract+mirrors ◄── fan-out path ◄── graph upsert+close ◄── proposal rows ◄── veto ◄── step_frontier_admit
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Config, flag and binding surfaces | None | `depthMode`, `expansiveDepth`, `depth_mode` binding | All others |
| Golden test | Config and flag | Byte-identity guard | Every behavior change |
| Node store and `frontier-admit.cjs` | Golden test | `research/frontier-nodes.jsonl` rows | Seed, admission, reducer |
| Seed step | Node store | Depth-1 nodes before iteration 1 | Reducer focus, fan-out partition |
| Reducer projection, focus, close | Node store | `registry.frontier`, Next Focus, dashboard metrics | Admission, veto |
| `step_frontier_admit` | Reducer projection | Inbox rows with `origin: "frontier"`, store rows | Veto, proposal rows |
| Veto | Admission | `frontierOpen` reasonDetail | Proposal rows |
| Proposal rows | Veto | `frontier_proposal` contract | Graph upsert |
| Graph upsert and close | Proposal rows | QUESTION nodes, graph close | Fan-out |
| Fan-out path | Seed step, graph upsert | Passthrough, recorded partition, lineage stores, merged `frontier`, merge guard | Pilot |
| Docs, contract, mirrors | Every code change | Reference docs, playbook scenarios, changelog, regenerated contract, synced mirrors | Phase close |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Golden baseline and test** - one session - CRITICAL
2. **Reducer projection, admission and veto** - two to three sessions - CRITICAL
3. **Close rules and pilot run** - one to two sessions - CRITICAL

**Total Critical Path**: four to six working sessions after phases 004-007 land.

**Parallel Opportunities**:
- The prompt-pack `## FRONTIER` block and the agent-definition row can be drafted while the reducer work runs
- The dashboard frontier metrics and the fan-out binding can run after the veto lands
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Guard in place | The golden test passes for the absent key and `--depth-mode=default` | End of Setup plus config step |
| M2 | Frontier loop works | Admission, veto and close suites pass | Middle of Implementation |
| M3 | Pilot proven | Target-2 pilot ends with every node terminal and its frontier at zero open before the iteration cap (amended 2026-11-18) | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

The operator accepted ADR-001 to ADR-005 as proposed on 2026-11-17 (T000). The builder may raise an amendment when the code disagrees with an ADR; an amended ADR names what replaces it.

### ADR-001: Close rule 2, visited is not answered

**Status**: Accepted (operator, 2026-11-17, as proposed). The builder may raise an amendment if the code disagrees.

**Context**: A question resolves after one non-error iteration whose `focus` equals its text. If the frontier branch emits the node's question text as focus, nodes close by being visited.

**Decision**: The frontier Next Focus branch emits a focus string built from the node id and scope that never equals the question text, so a node resolves only through `answeredQuestions` or the terminal-status close rule.

**Consequences**:
- A visit no longer silently answers a node.
- Focus strings change shape under the flag only; mitigated by the golden test covering the default path.

**Alternatives Rejected**:
- Accept visit-closes on purpose: it lets an expansive run report breadth it never examined.

### ADR-002: Graph close variant for pruned and exhausted nodes

**Status**: Accepted (operator, 2026-11-17, as proposed). The builder may raise an amendment if the code disagrees.

**Context**: Question coverage needs two answering findings per QUESTION node and divides by all QUESTION nodes; source diversity averages over all of them. A pruned or exhausted node left as an uncovered QUESTION produces `uncovered_questions` and `source_diversity_guard` blockers.

**Decision**: Never write pruned nodes to the graph, and re-kind an admitted node that later closes as `exhausted`, `blocked` or `abstained` so it leaves the QUESTION denominator. The exact re-kind target is settled at build time against the coverage-graph kinds.

**Consequences**:
- The graph stop is reachable once every node is terminal.
- A re-kind path must be added to the graph upsert; covered by the close test.

**Alternatives Rejected**:
- Remove closed nodes from the graph: loses the audit trail of what was tried.

### ADR-003: Node cap versus minimum maxIterations

**Status**: Accepted (operator, 2026-11-17, as proposed). The builder may raise an amendment if the code disagrees.

**Context**: At the default `maxIterations` 10 the depth bands get 5, 3.5 and 1.5 iterations against a node cap of 40, so most admitted nodes would close as `exhausted: budget`.

**Decision**: Derive `maxFrontierNodes` from `maxIterations` at config creation and record the derived value in the config, rather than a fixed 40.

**Consequences**:
- Admission stops before budget exhaustion becomes the common close reason.
- The pilot must still state its `maxIterations`; mitigated by REQ-012.

**Amendment (operator, 2026-11-18, decision-record Q003)**: Both live pilots showed that a cap equal to `maxIterations` fills every iteration slot, so the seeded questions waited until the last iterations and the run could only stop on the cap. The cap is now derived at admission as half of `maxIterations` (at least 1) unless the config sets a number, and the workflow writes `null` so the derivation applies.

**Alternatives Rejected**:
- Enforce a minimum `maxIterations` for expansive runs: rejects small exploratory runs outright instead of sizing the frontier to them.

### ADR-004: Node-status store and admission helper

**Status**: Accepted (operator, 2026-11-17, as proposed). The builder may raise an amendment if the code disagrees.

**Context**: Nodes move through `open`, `active`, `answered`, `exhausted`, `blocked`, `abstained` and `pruned`. `readInboxQuestions` keeps six fields (`text`, `id`, `source`, `origin`, `injectedAtIteration`, `promotedQuestionId`), `buildRegistry` rebuilds the registry from its inputs on every reduce, and the research upcast checks exact fields, so a status cannot ride the inbox, the registry or an existing state-log event.

**Decision**: Add `research/frontier-nodes.jsonl`, an append-only store with one row per seed, admit, prune or close (`{nodeId, parentId, depth, scope, status, reason, iteration}`); the last row per `nodeId` wins. `runtime/scripts/frontier-admit.cjs` is its only writer and takes a target mode (`research` now, `review` in phase 011). The reducer reads the store and derives `answered` from the registry, so reducing twice gives the same `frontier`.

**Consequences**:
- Status survives every reduce and a resumed run.
- One more state file per expansive run; absent when the flag is off, so default packets do not change.

**Alternatives Rejected**:
- Extra inbox fields: the inbox reader drops them, and widening it changes a default-path reader.
- A new state-log event: needs a ledger schema change, which the parent research eliminated for frontier data.

### ADR-005: Seed before spawn

**Status**: Accepted (operator, 2026-11-17, as proposed). The builder may raise an amendment if the code disagrees.

**Context**: `step_fanout_spawn` (`deep-research.yaml:327-357`) runs before `phase_init` and skips `phase_init` and `phase_main_loop`, and `fanout-run.cjs` passes no depth mode to a lineage. A partition built "when lineage prompts are built" runs over an empty frontier.

**Decision**: Add `step_frontier_seed`. Under fan-out it runs before `step_fanout_spawn`; on the single-executor path it runs in `phase_init` after `step_create_config`. The orchestrating model writes candidate depth-1 nodes from the topic and the init key questions, and `frontier-admit.cjs` admits each one under the same six checks as a leaf proposal. `fanout-run.cjs` then splits the admitted depth-1 nodes round-robin, records the partition in `orchestration-summary.json` and writes each lineage's nodes into its own store before it spawns.

**Consequences**:
- Every lineage starts with its own open nodes, so it runs in expansive mode from iteration 1.
- The seed sees only the topic, so depth-1 quality depends on the topic text; the pilot records how many nodes the seed produced.

**Alternatives Rejected**:
- Move fan-out out of this phase: leaves the flag silently ignored on fan-out runs.
- Seed inside each lineage from its `frontier_scope:` line: the lineages would each decompose the whole topic and the partition would mean nothing.
