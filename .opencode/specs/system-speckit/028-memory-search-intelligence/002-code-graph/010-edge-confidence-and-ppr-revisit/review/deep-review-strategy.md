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

Edge-Confidence Differentiation and Seeded-PPR Revisit (`002-code-graph/010-edge-confidence-and-ppr-revisit`, Level 3). This packet built real per-edge confidence differentiation for CALLS edges (a new default-off flag `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION`), recovered the deleted seeded-PPR module from git history, re-wired it to the new signal, and re-ran its original benchmark. Verdict: the prior CUT was reconfirmed with a wider margin. Both flags stay default-off. This review audits that work for testing gaps and integration gaps (does the new gate actually isolate all consumers, do the recovered tests actually exercise the recovered code paths, is the flag wiring complete end to end).

**Operator directive (binding for this entire session):** `--stop-policy=max-iterations` is set. Convergence signals are telemetry only. The loop MUST NOT stop early on "all dimensions clean" or composite convergence — it must run all 20 configured iterations, actively broadening scope and depth each time coverage looks complete. See §5 STOP CONDITIONS and §16 REVIEW BOUNDARIES.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS

- Not re-litigating the seeded-PPR CUT verdict itself (it is measured and final for this cycle).
- Not reviewing sibling packets (008, 009) or the changelog/timeline/before-vs-after doc updates made in the same session; those are pure documentation with no code, out of this review's scope.
- Not proposing a parser rewrite or true semantic call-resolution; the confidence signal is explicitly documented as an approximation.

---

## 5. STOP CONDITIONS

Explicit conditions beyond convergence that should end the session:

- Reaching `maxIterations` (20). This is the only intended stop path under `stopPolicy=max-iterations`.
- A confirmed P0 that blocks further productive review (extremely unlikely given this is a small, gated, already-tested packet; if it happens, keep iterating on other dimensions/files rather than stopping).
- Operator-issued pause (`.deep-review-pause` sentinel).

**All-dimensions-clean is explicitly NOT a stop condition this run.** When D1-D4 all show PASS with no new findings, the next iteration must broaden rather than stop: widen file scope to nearby integration points not yet directly reviewed (structural-indexer.ts's other CALLS-edge call sites, cross-file-edge-resolver.ts's other resolution branches, the recovered code-graph-context.ts's other PPR-adjacent functions, the ENV_REFERENCE.md entry's consistency with every other flag doc in the same file), re-examine each dimension at a finer grain (function-level then line-level), stress-test edge cases the existing tests do not cover (empty candidate lists, single-file-only symbols, malformed edge metadata), and re-check the ADR-001 near-miss fix for any residual trace of the reverted local-walker approach anywhere in the tree (docs, comments, git-recovered artifacts).

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | Confidence write paths are gated, but recovered seeded-PPR adds a top-level missing dist dependency before the PPR flag gate. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 1 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +1 P1, +0 P2

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
- Inventory-first review exposed the difference between correctly gated confidence metadata writes and the separate recovered-PPR module-load dependency. (iteration 1)

---

## 9. WHAT FAILED
- Treating recovered unit tests as sufficient would miss checkout/runtime availability of the compiled shared walker artifact. (iteration 1)

---

## 10. EXHAUSTED APPROACHES (do not retry)

None yet. Under `stopPolicy=max-iterations`, do not mark a category exhausted just because a first pass found nothing new; broaden the angle (different file, finer grain, different test scenario) before considering it exhausted, and prefer re-framing over stopping.

---

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Iteration 2: Continue correctness at finer grain. First verify the `code-graph-context.ts` module-load failure mode around the shared weighted-walk dependency and the seeded-PPR flag gate, then review deadline/budget/duplicate-candidate behavior in `collectSeededPprImpactRanking`. Begin traceability only after confirming whether P1-001 is fully active in the runtime.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT

This packet was implemented and verified in a git worktree this session by GPT-5.5-fast (high) via cli-opencode, then synced to the live tree with a file-by-file diff confirming zero drift. Key claims already independently verified this session (re-verify, do not just trust):
- `tsc --noEmit` clean before and after the ADR-001 fix.
- Existing code-graph vitest suite regression-proven with the new flag off (same pre-existing baseline failures, 0 new failures, confirmed via a real `git stash`/`stash pop` before/after comparison).
- Recovered PPR module's own unit tests pass (2 files, 9 tests).
- A fresh full-repo reindex confirmed 4 distinct real confidence values in the live database (892 at 0.3, 2267 at 0.35, 16198 at 0.75, 2838 at 0.9), replacing the uniform 0.8.
- The original, unmodified benchmark harness was re-run with both flags on; verdict CUT stands, gap widened (exact deltas in `implementation-summary.md` and `007-dark-flag-graduation/005-codegraph-seeded-ppr/benchmark-results.md`).
- One real deviation was caught and fixed during recovery: the first pass swapped a cross-subsystem dynamic import for a local reimplementation (an ADR-001 violation), caught by diffing against the pre-deletion original and fixed by building the missing dist output.

Prior context load was skipped for this review session (fresh review, no `memory_context()` call made before this file was created); if useful prior review context exists for this or sibling code-graph phases, an early iteration should surface it via `memory_search`/`memory_context` rather than assuming none exists.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | conditional | 1 | Confidence metadata writes align with the edge-confidence flag, but recovered PPR adds a flag-off module-load risk. |
| `checklist_evidence` | core | conditional | 1 | Checklist claims need replay against an environment without prebuilt Memory MCP dist. |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `spec.md` | none | - | - | pending |
| `plan.md` | none | - | - | pending |
| `tasks.md` | none | - | - | pending |
| `checklist.md` | none | - | - | pending |
| `decision-record.md` | none | - | - | pending |
| `implementation-summary.md` | none | - | - | pending |
| `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | none | - | - | pending |
| `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts` | none | - | - | pending |
| `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts` | none | - | - | pending |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` | correctness | 1 | P1-001 | conditional |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cross-file-edges.vitest.ts` | none | - | - | pending |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts` | none | - | - | pending |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-flag-on-path.vitest.ts` | none | - | - | pending |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-ranking.vitest.ts` | none | - | - | pending |
| `.opencode/skills/system-code-graph/mcp_server/scripts/eval/score-seeded-ppr-retrieval.mjs` | none | - | - | pending |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | none | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 20 (hard requirement this run, see operator directive in §2)
- Convergence threshold: 0.10 (telemetry only, does not gate STOP under stopPolicy=max-iterations)
- Stop policy: max-iterations (operator-set; convergence CANNOT stop the loop before iteration 20)
- Rolling STOP threshold: 0.08 (telemetry only this run)
- No-progress threshold: 0.05 (telemetry only this run; do not treat as a signal to narrow scope, treat as a signal to broaden it)
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-07-01T13:37:25.000Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-07-01T13:37:25.000Z
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .opencode/skills/deep-loop-workflows/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs, .opencode/skills/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```
