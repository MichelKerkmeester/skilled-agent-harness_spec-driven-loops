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

A deep-review run covers four fixed dimensions over one configured target and has no question set, inbox or other surface that can grow mid-run, so a target like "the last 100 commits" cannot be split into subsystems and batches. This phase builds Slice K of the parent research: the review side of `--depth-mode=expansive`, which admits typed `frontier_proposal` rows from a new review pack channel into `candidateCoverage` and `searchDebt` plus a review `registry.frontier`, adds a review Next Focus branch, extends the `frontierOpen` veto to review stop candidates and changes the `divergent-review-pivot.ts` seeds. The proof is a golden test that keeps default review runs byte-identical, a review admission suite, `review-depth-convergence` cases and a pilot on the last-100-commits target with fan-out partitioning of its seven subsystem nodes.

**Key Decisions**: admit into the review coverage surfaces, never an inbox; reuse the research phase's flag, admission order, depth budget and veto rather than a second design.

**Critical Dependencies**: phases `008-review-dimension-coverage`, `009-fanout-review-coverage-merge` and `010-research-frontier-mode` must land first.

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
| **Parent Research** | `../research/research.md` (sections 8, 9, 10, 18, 20 Slice K) |
| **Depends On** | `008-review-dimension-coverage`, `009-fanout-review-coverage-merge`, `010-research-frontier-mode` |
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
- Add `--depth-mode=default|expansive` to `/deep:review` and the `depthMode` plus `expansiveDepth` keys to the review config, locked against the optimizer.
- Add the `frontier_proposal` channel to the review leaf contract and the review prompt pack.
- Add a review admission step in `deep-review.yaml` that reuses the research admission order and writes admitted nodes into `searchDebt`, `candidateCoverage` and a review `registry.frontier`, plus the expansive STUCK_RECOVERY sub-branch.
- Add the review reducer frontier projection, close rule and Next Focus branch, and extend the `frontierOpen` veto to review stop candidates.
- Change `divergent-review-pivot.ts` seeds and gating under the flag, add the review `frontier_scope:` partition and merge guard, then pilot on example target 1.

### Out of Scope
- An inbox or question surface for review - eliminated in the parent research because the review reducer would read nothing from it.
- The research frontier - built in `010-research-frontier-mode`; this phase reuses its admission helper, budget split and veto.
- Carrying review coverage through the fan-out merge and deciding custom review dimensions - owned by `009-fanout-review-coverage-merge` and `008-review-dimension-coverage`.
- Relaxing the pivot's ban on expanding the configured target - frontier nodes stay inside the root scope, so the ban stays.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/deep/review.md` | Modify | Flag table row for `--depth-mode=default\|expansive` |
| `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json` | Modify | `antiConvergence.depthMode: "default"`, `expansiveDepth` block, `depthMode` in `lockedFields` |
| `.skilled/skills/system-spec-kit/runtime/cli/optimizer/optimizer-manifest.json` | Modify | Lock the review `depthMode` key |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modify | Keys in `step_create_config`; review admission step after verify-iteration and before the reduce step; expansive STUCK_RECOVERY sub-branch keeping `deep_review.recovery_started`; pivot gating |
| `.skilled/agents/deep-review.md` | Modify | `frontier_proposal` delta row type for review leaves |
| `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl` | Modify | Conditional `## FRONTIER` block and proposal row shape |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts` | Modify | Render the review block only under the flag |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modify | Review `registry.frontier`, admission into `searchDebt` and `candidateCoverage`, close rule, Next Focus frontier branch |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Modify | Apply the existing `frontierOpen` veto to review stop candidates (`all_dimensions_clean`, composite) |
| `.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts` | Modify | Pivot only once the frontier is terminal; seed from terminal unanswered nodes; route accepted candidates through admission |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Review `frontier_scope:` binding beside `review_focus` |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Modify | Review fan-in guard over the merged coverage that phase 009 adds |
| Admission helper from phase 010 | Modify | Review target mode writing coverage surfaces instead of the inbox |
| Review suites under `.skilled/skills/system-deep-loop/runtime/tests/` | Create/Modify | Review admit suite, golden review case, `deep-review-deltas-contract`, `review-depth-convergence`, pivot and fan-out cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With `depthMode` absent, and with an explicit `--depth-mode=default`, the review registry, dashboard, Next Focus, rendered review prompt pack, pivot seed output and fan-out lineage prompt are byte-identical to the baseline captured before this phase. |
| REQ-002 | The review admission step applies the same six ordered checks as phase 010; an admitted node becomes an open `searchDebt` entry and a `registry.frontier` node, and no row is written to any inbox. |
| REQ-003 | The `frontierOpen` veto applies to review STOP candidates (`all_dimensions_clean` and the composite vote) under the same conditions as research and never outranks the cap, failures, stuck, pause, `off` or `max-iterations`. |
| REQ-004 | When a review node reaches a terminal status, its `searchDebt` entry is cleared and its status is recorded in `registry.frontier`; an `answered`, `pruned` or `abstained` node is also recorded in a non-debt `candidateCoverage` bucket, and no terminal status is written as a `deferred` or `blocked` disposition, so a fully terminal frontier leaves no frontier-owned debt. |
| REQ-005 | The review prompt pack carries a `frontier_proposal` channel under the flag, and the review agent definition and pack allowed-write list agree on it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Under the flag, the review Next Focus frontier assignment is placed in the reducer's last-assignment-wins sequence so the effective precedence is blocked-stop text, then pivot focus, then the frontier node, then the leaf `nextFocus`, then the first uncovered dimension. |
| REQ-007 | Under the flag, the review pivot is prepared only once every frontier node is terminal, may seed from nodes closed `exhausted` or `blocked`, and routes an accepted candidate through admission; the boundary regexes and the configured-target ban stay unchanged. |
| REQ-008 | With fan-out, open depth-1 review nodes are partitioned round-robin through a `frontier_scope:` binding that coexists with `review_focus`, and the merge guard over the phase-009 merged coverage fails when a depth-1 node is missing. |
| REQ-009 | Under expansive mode the review STUCK_RECOVERY handler closes the active node as `exhausted`, advances focus and still appends `deep_review.recovery_started`, which projects to the `stuckRecovery` event that resets `stuckCount`. |
| REQ-010 | A pilot on example target 1 reviews `<pilot-sha>~100..<pilot-sha>` with the SHA recorded at start, prunes merges as `merge-no-own-diff` and index rebuilds as `generated-artifact` at init, admits the seven subsystem nodes at depth 1, partitions them across fan-out lineages and ends with every node terminal on a non-cap stop. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The golden review test passes for the absent key and `--depth-mode=default`, and `review-depth-convergence`, the `deep-review-*` reducer suites, `deep-review-deltas-contract`, `divergent-pivot*` and `fanout-*` stay green.
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
- Maximum input: proposals beyond the depth, children or node caps are pruned with their reason; with seven depth-1 nodes over L lineages, each lineage's depth-1 band (50% of its `maxIterations`) must be at least `ceil(7 / L)`, or the pilot config is rejected.
- Failure path: a proposal whose scope does not intersect the configured review target is pruned on relevance and never becomes debt.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: about 14, LOC: about 650, Systems: review workflow, review reducer, convergence, pivot, fan-out |
| Risk | 16/25 | Auth: N, API: Y (flag, delta row, registry field), Breaking: N (opt-in) |
| Research | 10/20 | Bucket mapping and dimension interplay left open by the parent research |
| Multi-Agent | 6/15 | Workstreams: 2 (runtime and workflow) |
| Coordination | 12/15 | Dependencies: three predecessor phases |
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

- How does each terminal status map to a `candidateCoverage` bucket? The parent research is silent. The reducer turns every `deferred` or `blocked` disposition into a `searchDebt` entry (`runtime/scripts/reduce-state.cjs`, the `disposition === 'deferred' || disposition === 'blocked'` branch), so those buckets cannot hold closed nodes; proposed in plan ADR-001.
- Does the review coverage graph need a frontier upsert counterpart, or do the review coverage surfaces carry the frontier alone? UNKNOWN until the review graph signals are read at build time.
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
