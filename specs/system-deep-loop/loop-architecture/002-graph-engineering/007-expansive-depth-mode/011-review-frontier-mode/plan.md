---
title: "Implementation Plan: Opt-in expansive depth mode for deep-review: admission into candidateCoverage and searchDebt"
description: "Builds the review side of --depth-mode=expansive on top of the research frontier: review config and flag, golden review test, review proposal channel, admission into searchDebt and candidateCoverage, review Next Focus branch, veto on review stop candidates, pivot seed changes and the review fan-out partition, then the last-100-commits pilot."
trigger_phrases:
  - "review frontier mode plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Opt-in expansive depth mode for deep-review: admission into candidateCoverage and searchDebt

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS scripts (`.cjs`), TypeScript runtime and pivot modules, YAML workflow assets |
| **Framework** | `system-deep-loop` deep-review workflow (`/deep:review`) |
| **Storage** | JSONL deltas, the review findings registry (`candidateCoverage`, `searchDebt`, new `frontier`), the fan-out merged registry |
| **Testing** | vitest suites under `.skilled/skills/system-deep-loop/runtime/tests/` |

### Overview
The change reuses the research phase's flag semantics, admission helper, depth budget and veto, and points them at the review coverage surfaces instead of an inbox. Every review branch is gated on `depthMode` being `expansive`. A golden review test, which also covers pivot seed output and the fan-out lineage prompt, lands before any behavior change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified: phases 008, 009 and 010 merged, confirmed with `git log --oneline` naming each

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `npx vitest run` over `.skilled/skills/system-deep-loop/runtime/tests/` exits 0, including the golden review, review admit, close, pivot and fan-out cases
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Flag-gated reuse of the research frontier, retargeted at review coverage surfaces.

### Key Components
- **Review proposal channel**: the review pack and agent definition gain the `frontier_proposal` row. Without it a review leaf has no sanctioned way to name a sub-target; today every `frontier` hit in `deep-review.yaml` is the pivot's candidate frontier.
- **Review admission step**: calls the phase-010 helper in a review target mode; an admitted node becomes an open `searchDebt` entry and a `registry.frontier` node.
- **Review reducer frontier branch**: projects `registry.frontier`, applies the close rule (clear debt, record a `candidateCoverage` bucket) and assigns Next Focus in the last-assignment-wins sequence.
- **Veto on review candidates**: the existing `frontierOpen` veto, now reading the review registry for `all_dimensions_clean` and composite candidates.
- **Pivot seed change**: `divergent-review-pivot.ts` waits for a terminal frontier, may seed from `exhausted` or `blocked` nodes and hands an accepted candidate to admission.
- **Review fan-out partition**: `frontier_scope:` beside `review_focus`, with a merge guard over the phase-009 merged coverage.

### Data Flow
Review leaf writes `frontier_proposal` rows in its delta. The review admission step prunes or admits; admitted nodes are handed to the reducer, which writes `searchDebt`, `registry.frontier` and Next Focus. `convergence.cjs` applies the veto right after the `minIterations` floor and before the gates and guards, as the parent research places it. The order matters on review: `candidateCoverageGate` fails while `searchDebt` is non-empty, so a gate evaluated first would turn every stop with open frontier debt into BLOCKED, and blocked-stop text outranks the frontier focus. On a terminal status the reducer clears the node's debt and records its bucket. At a STOP candidate with a terminal frontier the pivot may run and propose more nodes through admission.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is a feature, but it edits shared default-path files, so each surface is listed with its default-path effect.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/scripts/reduce-state.cjs` (review block) | Owns review coverage, debt and Next Focus | update, flag-gated | Golden review test with the key absent |
| `runtime/scripts/convergence.cjs` | Owns the review stop order and `candidateCoverageGate` | update, veto unreachable when off | `review-depth-convergence` and `stop-decision*` suites |
| `deep-review/scripts/divergent-review-pivot.ts` | Builds review pivot seeds | update, seeds unchanged when off | `divergent-pivot*` suites plus a byte-compare of seed output |
| `runtime/scripts/fanout-run.cjs`, `fanout-merge.cjs` | Build review lineage prompts with `review_focus`, merge registries | update, binding absent when off | `fanout-review-focus`, `fanout-merge*` suites |
| Phase 010 admission helper | Research admission | update, review target mode added | Research admission suite stays green |

Required inventories:
- Same-class producers: `rg -n 'addCandidateClass|searchDebt|nextFocus' .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`.
- Consumers of changed symbols: `rg -n 'searchDebt|candidateCoverage|frontier_scope|depthMode' .skilled --glob '*.cjs' --glob '*.ts' --glob '*.yaml' --glob '*.md'`.
- Matrix axes: `depthMode` (absent, default, expansive) x `convergenceMode` (default, divergent) x executor (single, fan-out).
- Algorithm invariant: a review node never leaves the configured target scope; debt owned by a terminal node is always cleared.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup confirms phases 008-010 are merged, including 008's custom dimension support, and captures the golden review baseline. Implementation adds config and flag, the golden assertion, the proposal channel, admission into the coverage surfaces, the reducer close and focus branch, the veto on review candidates, the stuck sub-branch, the pivot seed changes and the fan-out partition. Verification runs the full suite and the target-1 pilot.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Review admission into debt, close-to-bucket mapping, focus precedence, veto on review candidates, stuck counter reset, pivot gating and seeds | vitest |
| Integration | Golden byte-identity (registry, dashboard, focus, pack, pivot seeds, lineage prompt), fan-out partition and merge guard | vitest with fixture packets |
| Manual | Pilot `/deep:review` on example target 1 with fan-out and `--depth-mode=expansive` | `/deep:review`, `jq` over the merged registry |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `010-research-frontier-mode` (Slice J) | Internal | Red (not built) | No admission helper, budget split or veto to reuse |
| `009-fanout-review-coverage-merge` (Slice I) | Internal | Red (not built) | The review merge drops coverage, so the fan-in guard has nothing to read |
| `008-review-dimension-coverage` (Slice H) | Internal | Red (not built) | Binding: 008 supports custom dimensions (operator decision 2026-11-17), and this phase builds on its configured-list coverage |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the golden review test fails on `main`, or `review-depth-convergence` or a `deep-review-*` suite turns red after a merge from this phase.
- **Procedure**: revert this phase's commits with `git revert <sha>`; every branch is flag-gated and the absent key reads as default, so no packet needs migration.
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
| Setup | Phases 008, 009, 010 merged | Implementation |
| Implementation | Setup golden baseline | Verification |
| Verification | All implementation steps | Packet close |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
config+flag ──► golden test ──► proposal channel ──► admission into debt ──► reducer close+focus
                                                                                   │
                fan-out frontier_scope ◄── pivot seeds ◄── stuck branch ◄── veto on review
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Config and flag | Phase 010 config shape | Review `depthMode`, `expansiveDepth` | All others |
| Golden test | Config and flag | Review byte-identity guard | Every behavior change |
| Proposal channel | Golden test | Review `frontier_proposal` rows | Admission |
| Admission into debt | Proposal channel, phase 010 helper | `searchDebt` entries, `registry.frontier` | Reducer branch |
| Reducer close and focus | Admission | Bucket on close, Next Focus | Veto |
| Veto on review | Reducer branch | CONTINUE on review candidates | Stuck branch, pivot |
| Pivot seeds | Veto | Gated pivot, admission-routed candidates | Fan-out |
| Fan-out `frontier_scope` | Phase 009 merge, pivot seeds | Lineage partition, merge guard | Pilot |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Golden review baseline and test** - one session - CRITICAL
2. **Admission into debt, close and veto** - two sessions - CRITICAL
3. **Fan-out partition and target-1 pilot** - one to two sessions - CRITICAL

**Total Critical Path**: four to five working sessions after phases 008-010 land.

**Parallel Opportunities**:
- The review pack block and the agent-definition row can be drafted while the reducer work runs
- The pivot seed change and the dashboard metrics can run after the veto lands
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Guard in place | The golden review test passes for the absent key and `--depth-mode=default` | End of Setup plus config step |
| M2 | Review frontier loop works | Review admit, close and veto suites pass | Middle of Implementation |
| M3 | Pilot proven | Target-1 pilot ends with seven terminal depth-1 nodes and no frontier debt | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Terminal status to candidateCoverage bucket mapping

**Status**: Proposed

**Context**: `candidateCoverage` has four buckets (`covered`, `ruledOut`, `deferred`, `blocked`) and the frontier has five terminal statuses. The parent research names the target surfaces but not the mapping. The review reducer writes every `deferred` or `blocked` disposition into `searchDebt`, and non-empty debt fails `candidateCoverageGate` and makes the verdict CONDITIONAL.

**Decision**: Map `answered` to `covered` and `pruned` and `abstained` to `ruledOut`, recording the frontier status on the entry. Record `exhausted` and `blocked` nodes in `registry.frontier` only, with their status, and list them in the synthesis as follow-up review work, never as a `deferred` or `blocked` disposition.

**Consequences**:
- Every terminal node leaves no debt, so a terminal frontier cannot hold the stop at BLOCKED.
- An exhausted or blocked sub-target does not degrade the verdict on its own; mitigated by naming it in the synthesis as unfinished review work.

**Alternatives Rejected**:
- Map `exhausted` to `deferred` and `blocked` to `blocked`: both dispositions become `searchDebt`, so any exhausted or blocked node would fail `candidateCoverageGate` for the rest of the run.
- Map every unanswered status to `ruledOut`: claims a clean search that never happened.

### ADR-002: Frontier focus carries the node's next uncovered dimension

**Status**: Proposed

**Context**: The frontier assignment outranks the first-uncovered-dimension fallback, which could starve the four-dimension coverage gate.

**Decision**: The review frontier focus names the node id, its scope and the next dimension that node has not yet covered, so each node is reviewed across the four dimensions.

**Consequences**:
- Dimension coverage keeps advancing while the frontier is worked.
- A node needs up to four iterations at full depth; mitigated by the depth budget and the pilot's stated `maxIterations`.

**Alternatives Rejected**:
- Leave the frontier below the dimension fallback: the frontier would never steer while any dimension is uncovered.
