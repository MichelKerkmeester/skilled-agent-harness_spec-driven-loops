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
- [ ] Dependencies identified: phases 004, 005, 006 and 007 merged, confirmed with `git log --oneline` naming each

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `npx vitest run` over `.skilled/skills/system-deep-loop/runtime/tests/unit/` exits 0, including the golden, admission, stop-decision, close and fan-out cases
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Flag-gated pipeline extension: propose, admit, project, steer, veto, close.

### Key Components
- **Leaf proposal (`frontier_proposal` delta row)**: the leaf names a candidate node with an evidence anchor; it never writes state.
- **`step_frontier_admit` and its helper**: applies the six admission checks and writes admitted nodes to `research/inbox.jsonl` with `origin: "frontier"`. Without it nothing writes the inbox, which is the only path that grows the counted question set.
- **Reducer frontier projection**: rebuilds `findings-registry.json` `frontier: {nodes, stats}`, applies the question close rule and picks Next Focus.
- **`frontierOpen` veto**: reads `registry.frontier.stats`, already loaded by `convergence.cjs`, and converts a STOP candidate to CONTINUE.
- **`step_frontier_graph_upsert`**: writes admitted nodes as QUESTION nodes with `DERIVED_FROM` edges and applies the graph close rule, so traversal no longer depends on inconsistent leaf graph events.
- **Fan-out `frontier_scope:`**: partitions open depth-1 nodes across lineages; the merge guard checks every depth-1 node is accounted for.

### Data Flow
Leaf writes `frontier_proposal` rows in `deltas/iter-NNN.jsonl`. After verify-iteration, `step_frontier_admit` reads them, prunes or admits, and appends admitted rows to `research/inbox.jsonl`. `step_reduce_state` promotes inbox rows to counted questions, rebuilds the `frontier` field, closes terminal nodes and writes Next Focus. `step_graph_upsert` then `step_frontier_graph_upsert` update the coverage graph. `convergence.cjs` evaluates the stop order and applies the veto after the floor.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is a feature, not a fix, but it edits shared default-path files, so each surface is listed with its default-path effect.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep-research/scripts/reduce-state.cjs` | Owns the registry, question resolution and Next Focus for every research run | update, flag-gated | Golden byte-identity test with the key absent |
| `runtime/scripts/convergence.cjs` | Owns the stop order for both loops | update, veto unreachable when off | Stop-decision table test and the existing `stop-decision*` suites |
| `runtime/lib/deep-loop/prompt-pack.ts` and the research template | Renders every iteration prompt | update, block rendered only under the flag | Golden test compares the rendered pack |
| `runtime/scripts/fanout-run.cjs`, `fanout-merge.cjs` | Build lineage prompts and merge registries | update, binding absent when off | `fanout-run`, `fanout-merge*` suites plus a no-binding case |
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

Follow the ordered tasks in `tasks.md`. Setup confirms phases 004-007 are merged and captures the golden baseline on that tree. Implementation follows the research order: config and flag, golden assertion, reducer projection with Next Focus and the question close rule, `step_frontier_admit`, the veto, the proposal rows, the graph upsert with its close rule, then fan-out `frontier_scope`. Verification runs the full suite and the target-2 pilot.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Admission order and prune reasons, depth budget roll-down, veto table, reducer origin, close rules, stuck sub-branch counter reset | vitest |
| Integration | Golden byte-identity (registry, dashboard, Next Focus, prompt pack), fan-out partition and merge guard, divergent composition | vitest with fixture packets |
| Manual | Pilot `/deep:research` run on example target 2 with `--depth-mode=expansive` | `/deep:research`, `jq` over `findings-registry.json` |
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
| Setup | Phases 004, 005, 006, 007 merged | Implementation |
| Implementation | Setup golden baseline | Verification |
| Verification | All implementation steps | Phase 011 and packet close |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
config+flag ──► golden test ──► reducer projection/focus/close ──► step_frontier_admit ──► veto
                                                                                            │
                                fan-out frontier_scope ◄── graph upsert+close ◄── proposal rows
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Config and flag | None | `depthMode`, `expansiveDepth` | All others |
| Golden test | Config and flag | Byte-identity guard | Every behavior change |
| Reducer projection, focus, close | Golden test | `registry.frontier`, Next Focus | Admission, veto |
| `step_frontier_admit` | Reducer projection | Inbox rows with `origin: "frontier"` | Veto, proposal rows |
| Veto | Admission | `frontierOpen` reasonDetail | Proposal rows |
| Proposal rows | Veto | `frontier_proposal` contract | Graph upsert |
| Graph upsert and close | Proposal rows | QUESTION nodes, graph close | Fan-out |
| Fan-out `frontier_scope` | Graph upsert | Lineage partition, merge guard | Pilot |
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
| M3 | Pilot proven | Target-2 pilot ends with every node terminal and a non-cap stop | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Close rule 2, visited is not answered

**Status**: Proposed

**Context**: A question resolves after one non-error iteration whose `focus` equals its text. If the frontier branch emits the node's question text as focus, nodes close by being visited.

**Decision**: The frontier Next Focus branch emits a focus string built from the node id and scope that never equals the question text, so a node resolves only through `answeredQuestions` or the terminal-status close rule.

**Consequences**:
- A visit no longer silently answers a node.
- Focus strings change shape under the flag only; mitigated by the golden test covering the default path.

**Alternatives Rejected**:
- Accept visit-closes on purpose: it lets an expansive run report breadth it never examined.

### ADR-002: Graph close variant for pruned and exhausted nodes

**Status**: Proposed

**Context**: Question coverage needs two answering findings per QUESTION node and divides by all QUESTION nodes; source diversity averages over all of them. A pruned or exhausted node left as an uncovered QUESTION produces `uncovered_questions` and `source_diversity_guard` blockers.

**Decision**: Never write pruned nodes to the graph, and re-kind an admitted node that later closes as `exhausted`, `blocked` or `abstained` so it leaves the QUESTION denominator. The exact re-kind target is settled at build time against the coverage-graph kinds.

**Consequences**:
- The graph stop is reachable once every node is terminal.
- A re-kind path must be added to the graph upsert; covered by the close test.

**Alternatives Rejected**:
- Remove closed nodes from the graph: loses the audit trail of what was tried.

### ADR-003: Node cap versus minimum maxIterations

**Status**: Proposed

**Context**: At the default `maxIterations` 10 the depth bands get 5, 3.5 and 1.5 iterations against a node cap of 40, so most admitted nodes would close as `exhausted: budget`.

**Decision**: Derive `maxFrontierNodes` from `maxIterations` at config creation and record the derived value in the config, rather than a fixed 40.

**Consequences**:
- Admission stops before budget exhaustion becomes the common close reason.
- The pilot must still state its `maxIterations`; mitigated by REQ-012.

**Alternatives Rejected**:
- Enforce a minimum `maxIterations` for expansive runs: rejects small exploratory runs outright instead of sizing the frontier to them.
