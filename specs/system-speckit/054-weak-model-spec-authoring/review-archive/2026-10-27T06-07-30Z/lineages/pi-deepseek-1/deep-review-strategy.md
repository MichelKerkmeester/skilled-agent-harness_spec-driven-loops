---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
Phase-parent spec folder `specs/system-speckit/054-weak-model-spec-authoring` (Level 2, nine child phases 001-009). The packet claims to make system-spec-kit templates and authoring docs followable by a weak-model swarm; the review audits whether the shipped templates, guards, gates, catalog, playbooks, benchmark records and phase closures still support that claim.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Not assessing whether the benchmark methodology generalises to models other than cli-devin `deepseek-v4-1-flash-1017-max`; the packet fixes that subject by design.
- Not re-reviewing the wave-1 findings already recorded in `review/lineages/deepseek` and `review/lineages/luna`; this lineage broadens into directions those runs did not enter.
- Not proposing code edits; findings are reported only.

---

## 5. STOP CONDITIONS
- `config.maxIterations` (10) is the terminal ceiling; convergence earlier is telemetry only and broadens the angle instead of synthesising.
- Halt if the gateway refuses an iteration record (exit 2) or the reducer reports corruption.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 4
- P2 (Suggestions): 14
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Reading the guard scripts as programs rather than as documentation: the exit-code path and the shape each guard actually scans is where a weak-model claim breaks (iteration 1).
- Comparing generated metadata against the tree it describes, mechanically, with `git` and `rg` rather than prose (iterations 3, 6, 9).

---

## 9. WHAT FAILED
- Trusting a phase `implementation-summary.md` closure sentence as evidence that the work landed; two samples read as complete while a carrier disagreed (iterations 6, 10).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- `sk-prompt` ownership of authoring logic: ruled out by the frozen out-of-scope row (parent `spec.md:90`), so no finding is raised against it (iteration 1).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
**Target pointers.** Parent `spec.md`, `goal.md`, `graph-metadata.json`; children `001`-`009` (spec, plan, tasks, acceptance criteria, implementation summary); templates under `.skilled/skills/system-spec-kit/templates/`; the placeholder gate (`runtime/lib/validation/orchestrator.ts`, `runtime/cli/rules/check-placeholders.sh`) and its parity test; the two guard scripts `runtime/cli/spec/check-example-drift.sh` and `check-card-sync.sh`; `references/workflows/spec-authoring-card.md`; `feature-catalog/`; `manual-testing-playbook/`; `benchmark/reports/`; `changelog/v2.9.0.0.md`; the speckit and doctor command surfaces and the doc-authoring agents.

**Behaviour claims to verify.** Every child phase reads Complete and its acceptance rows are Met; the v2.3 template marker is stamped on the four core templates; unfilled `[YOUR_VALUE_HERE: ...]` tokens warn while Draft and error otherwise; both guards exit 0 on the final tree; the benchmark reports a measured before and after for five authoring metrics.

**Reuse and conventions.** Phase-parent content discipline (no plan/tasks/implementation-summary at parent level, `spec.md:30-38`); `system-spec-kit` folder-structure rules; the `[SOURCE: path:line]` citation form; the three-tier severity scale.

**Review risks and gaps.** Wave-1 lineages already covered path traversal in `create.sh`, the example task-format contradiction, the first-token placeholder gap, implement-workflow alignment, catalog parity leaves, and parent metadata staleness. `resource-map.md` is absent for this packet, so the resource-map coverage gate is skipped rather than failed. Graph metadata for the review packet is stale by construction while a lineage is open.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `runtime/cli/spec/check-example-drift.sh`, `check-card-sync.sh` | D1 | 1 | pending | partial |
| `templates/spec-kit-docs.json`, `templates/core/*`, `templates/addons/*` | D1 | 1 | pending | partial |
| `manual-testing-playbook/` scenarios + index | D2 | 1 | pending | partial |
| `benchmark/reports/`, parent `spec.md`, phase 009 docs | D3 | 1 | pending | partial |
| `.skilled/commands/speckit/`, `.skilled/commands/doctor/`, `.skilled/agents/markdown.md` | D3 | 1 | pending | partial |
| `changelog/v2.9.0.0.md`, version carriers | D4 | 1 | pending | partial |
| `references/workflows/spec-authoring-card.md`, `feature-catalog/` leaves | D4 | 1 | pending | partial |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-pi-deepseek-1-1792950661620-vss1cp, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-10-25T17:52:41Z
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```
