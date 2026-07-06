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
- [x] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [x] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [x] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
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
| D1 Correctness | CONDITIONAL | 2 | Seeded-PPR deadline and duplicate handling did not reveal a stronger blocker, but includeTrace loses multi-hop provenance for PPR candidates. |
| D3 Traceability | CONDITIONAL | 2 | Strict validation, typecheck, and targeted PPR tests pass; checklist completion totals conflict with still-unchecked task/plan state. |
| D2 Security/Reliability | PASS with advisory | 3 | No injection/traversal/unsafe env parsing found; eval harness cleanup can leave generated scratch artifacts on failure. |
| D3/D4 Traceability + Maintainability Overlays | PASS with advisory | 4 | Overlay docs and agents are mostly current, but the feature catalog and manual testing playbook omit the new gated `code_graph_context` PPR/edge-confidence capability. |
| D1 Correctness/Test Coverage | PASS with advisory | 5 | Focused PPR tests cover flag-off behavior and ranking, but miss regression coverage for the active missing-dist import and multi-hop includeTrace provenance findings. |
| D1 Runtime Integration | CONDITIONAL | 6 | Handler and package tracing strengthened P1-001 as MCP startup-reachable and P1-002 as live `code_graph_context` reachable under `includeTrace:true` plus the seeded-PPR flag; no package build-order mitigation found. |
| D1 Runtime Launcher Integration | CONDITIONAL | 7 | Cross-runtime MCP configs all invoke `mk-code-index-launcher.cjs`; the launcher builds/verifies only code-graph dist and dead-socket reclaim reuses that same path, so no outer build-order mitigation for P1-001 was found. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 3 active
- **P2 (Minor):** 3 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
- Inventory-first review exposed the difference between correctly gated confidence metadata writes and the separate recovered-PPR module-load dependency. (iteration 1)
- Replaying lightweight commands separated runnable evidence from packet-state drift: strict validation, typecheck, and targeted seeded-PPR tests pass, but docs still conflict. (iteration 2)
- Reviewing filesystem operations separately separated the eval harness's fixed-path, no-shell execution from its weaker failure-cleanup behavior. (iteration 3)
- Overlay-scope grep separated stale-agent risk from catalog/playbook currency debt: runtime agents only carry generic stable `code_graph_*` tool references, while feature/playbook inventories omit the gated capability. (iteration 4)
- Line-by-line test review separated real coverage from nominal test presence: flag-off behavior and ranking are asserted, but absent-dist import and seeded-PPR includeTrace provenance are not. (iteration 5)
- Runtime import tracing separated invocation-only risk from startup risk: `code_graph_context` is imported through the MCP server's top-level tool/handler barrels, so the missing dist dependency can fail before any tool call. (iteration 6)
- Launcher tracing separated manual setup guidance from startup guarantees: setup docs mention building system-spec-kit, but OpenCode/Claude/Codex MCP startup all enter the code-graph launcher, whose build/reclaim paths verify only code-graph dist. (iteration 7)

---

## 9. WHAT FAILED
- Treating recovered unit tests as sufficient would miss checkout/runtime availability of the compiled shared walker artifact. (iteration 1)
- Treating multi-hop PPR ranking tests as trace coverage would miss that `why_included.edgeChain` cannot reconstruct the PPR path. (iteration 2)
- Treating fixed repo-local paths as automatically reliable would miss non-finally cleanup leaks in the recovered eval harness. (iteration 3)
- Treating `code_graph_context`'s generic feature catalog entry as complete would miss that default-off seeded-PPR/edge-confidence behavior has no operator-facing catalog or manual playbook scenario. (iteration 4)
- Treating the recovered PPR vitest files as comprehensive would miss that their multi-hop tests run without `includeTrace` and do not simulate the compiled weighted-walk artifact being absent. (iteration 5)
- Treating default-off seeded-PPR as unreachable would miss that MCP callers can request `queryMode:"impact"` plus `includeTrace:true` through the live schema whenever the process env flag is enabled. (iteration 6)
- Treating daemon reclaim hardening as a dependency mitigation would miss that respawn calls the same code-graph-only `buildIfNeeded` and does not build or validate the spec-kit traversal dist artifact. (iteration 7)

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
Iteration 8: Continue under `stopPolicy=max-iterations`; broaden away from launcher startup because iteration 7 found no outer build-order mitigation. Review a genuinely different angle such as dependency/artifact packaging consistency for generated dist assumptions across system-spec-kit and system-code-graph, or database/index schema behavior under edge-confidence flag toggles and seeded-PPR fallback paths. Keep P1-001, P1-002, and P1-003 active until remediated or explicitly downgraded with evidence; carry P2-004, P2-005, and P2-006 as advisory cleanup debt.
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
| `spec_code` | core | conditional | 2 | Seeded-PPR impact path is gated and targeted tests pass, but includeTrace provenance is incomplete for multi-hop PPR candidates. |
| `checklist_evidence` | core | conditional | 2 | `validate.sh --strict`, typecheck, and targeted PPR vitest pass; checklist completion totals conflict with unchecked task/plan state. |
| `spec_code` | core | pass | 3 | Security/reliability pass found no shell injection, traversal, or unsafe env parsing in the eval harness and confidence write paths; recorded one P2 cleanup advisory. |
| `checklist_evidence` | core | conditional | 3 | Security checklist intent was reviewed, but prior P1-003 completion-state conflict remains active. |
| `skill_agent` | overlay | partial | 4 | `system-code-graph/SKILL.md` routes `code_graph_context` users to the feature catalog; low-level flag details can remain catalog/playbook-owned. |
| `agent_cross_runtime` | overlay | pass | 4 | `.opencode/agents/*.md` only carry generic stable code-graph tool references; no stale seeded-PPR/edge-confidence internals found. |
| `feature_catalog_code` | overlay | conditional | 4 | P2-005: feature catalog omits the default-off seeded-PPR/edge-confidence `code_graph_context` capability. |
| `playbook_capability` | overlay | conditional | 4 | P2-005: manual testing playbook has readiness coverage but no scenario for the gated flags. |
| `spec_code` | core | conditional | 6 | Runtime handler tracing confirms P1-001 is MCP startup-reachable and P1-002 is live-tool reachable under `includeTrace:true` plus the seeded-PPR flag. |
| `checklist_evidence` | core | conditional | 6 | P1-003 completion-state conflict remains active; this runtime integration pass did not re-adjudicate packet task/checklist state. |
| `feature_catalog_code` | overlay | conditional | 6 | Feature catalog confirms operator-facing `includeTrace:true`, supporting live reachability for P1-002 rather than a tests-only path. |
| `spec_code` | core | conditional | 7 | Cross-runtime launcher and MCP config review found no startup build-order guarantee for the spec-kit traversal dist artifact required by P1-001. |
| `agent_cross_runtime` | overlay | conditional | 7 | OpenCode, Claude, and Codex all register `mk_code_index` to the same launcher, so P1-001 is not isolated to one runtime config. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `spec.md` | none | - | - | pending |
| `plan.md` | traceability | 2 | P1-003 | conditional |
| `tasks.md` | traceability | 2 | P1-003 | conditional |
| `checklist.md` | traceability | 2 | P1-003 | conditional |
| `decision-record.md` | none | - | - | pending |
| `implementation-summary.md` | none | - | - | pending |
| `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | security/reliability | 3 | - | reviewed |
| `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts` | security/reliability | 3 | - | reviewed |
| `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts` | security/reliability | 3 | - | reviewed |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` | correctness | 2 | P1-001, P1-002 | conditional |
| `.opencode/skills/system-code-graph/mcp_server/index.ts` | correctness/runtime-integration | 6 | P1-001 | conditional |
| `.opencode/skills/system-code-graph/mcp_server/tools/index.ts` | correctness/runtime-integration | 6 | P1-001 | conditional |
| `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts` | correctness/runtime-integration | 6 | P1-001, P1-002 | conditional |
| `.opencode/skills/system-code-graph/mcp_server/handlers/index.ts` | correctness/runtime-integration | 6 | P1-001 | conditional |
| `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts` | correctness/runtime-integration | 6 | P1-001, P1-002 | conditional |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` | correctness/runtime-integration | 6 | P1-002 | conditional |
| `.opencode/skills/system-code-graph/package.json` | correctness/runtime-integration | 6 | P1-001 | conditional |
| `.opencode/skills/system-code-graph/tsconfig.json` | correctness/runtime-integration | 6 | P1-001 | conditional |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | correctness/runtime-integration | 6 | P1-001 | conditional |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs` | correctness/runtime-integration | 6 | P1-001 | conditional |
| `.opencode/bin/code-index.cjs` | correctness/runtime-launcher | 7 | P1-001 | conditional |
| `.opencode/bin/mk-code-index-launcher.cjs` | correctness/runtime-launcher | 7 | P1-001 | conditional |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | correctness/runtime-launcher | 7 | - | reviewed |
| `.opencode/bin/lib/launcher-session-proxy.cjs` | correctness/runtime-launcher | 7 | - | reviewed |
| `opencode.json` | agent_cross_runtime/runtime-launcher | 7 | P1-001 | conditional |
| `.claude/mcp.json` | agent_cross_runtime/runtime-launcher | 7 | P1-001 | conditional |
| `.codex/config.toml` | agent_cross_runtime/runtime-launcher | 7 | P1-001 | conditional |
| `.opencode/install_guides/SET-UP - Code Graph.md` | traceability/runtime-launcher | 7 | P1-001 | conditional |
| `.opencode/install_guides/README.md` | traceability/runtime-launcher | 7 | P1-001 | conditional |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cross-file-edges.vitest.ts` | correctness/test-coverage | 5 | - | reviewed |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts` | correctness/test-coverage | 5 | - | reviewed |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-flag-on-path.vitest.ts` | correctness/test-coverage | 5 | P2-006 | advisory |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-ranking.vitest.ts` | correctness/test-coverage | 5 | P2-006 | advisory |
| `.opencode/skills/system-code-graph/mcp_server/scripts/eval/score-seeded-ppr-retrieval.mjs` | security/reliability | 3 | P2-004 | advisory |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | security/reliability | 3 | - | reviewed |
| `.opencode/skills/system-code-graph/SKILL.md` | traceability/maintainability | 4 | - | reviewed |
| `.opencode/skills/system-code-graph/README.md` | traceability/maintainability | 4 | - | reviewed |
| `.opencode/skills/system-code-graph/feature_catalog/04--context-retrieval/code-graph-context.md` | traceability/maintainability | 4 | P2-005 | advisory |
| `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` | traceability/maintainability | 4 | P2-005 | advisory |
| `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md` | traceability/maintainability | 4 | P2-005 | advisory |
| `.opencode/skills/system-code-graph/manual_testing_playbook/04--context-retrieval/code-graph-context-readiness-block.md` | traceability/maintainability | 4 | P2-005 | advisory |
| `.opencode/agents/deep-review.md` | agent_cross_runtime | 4 | - | reviewed |
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

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

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
- P1 (Required): 8
- P2 (Suggestions): 6
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `checklist_evidence` core: CONDITIONAL inherited from P1-003. This iteration did not re-adjudicate completion-state drift, but did confirm `checklist.md:89` records recovered-code security review intent. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence` core: CONDITIONAL inherited from P1-003. This iteration did not re-adjudicate completion-state drift, but did confirm `checklist.md:89` records recovered-code security review intent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` core: CONDITIONAL inherited from P1-003. This iteration did not re-adjudicate completion-state drift, but did confirm `checklist.md:89` records recovered-code security review intent.

### `security/reliability` overlay: PASS with advisory. No injection/traversal/unsafe env parsing found in reviewed code paths; one failure-cleanup reliability advisory was recorded. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `security/reliability` overlay: PASS with advisory. No injection/traversal/unsafe env parsing found in reviewed code paths; one failure-cleanup reliability advisory was recorded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `security/reliability` overlay: PASS with advisory. No injection/traversal/unsafe env parsing found in reviewed code paths; one failure-cleanup reliability advisory was recorded.

### `spec_code` core: PASS for this dimension. `spec.md:156` requires no destructive shell commands; the eval script does not use shell invocation and the reviewed cleanup targets are fixed paths. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code` core: PASS for this dimension. `spec.md:156` requires no destructive shell commands; the eval script does not use shell invocation and the reviewed cleanup targets are fixed paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` core: PASS for this dimension. `spec.md:156` requires no destructive shell commands; the eval script does not use shell invocation and the reviewed cleanup targets are fixed paths.

### Calibration claim matches raw data. `metrics.json:76` through `metrics.json:128` shows damping `0.5` ties flat nDCG@5 at `1`, while all other tested damping values have nDCG@5 below flat. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Calibration claim matches raw data. `metrics.json:76` through `metrics.json:128` shows damping `0.5` ties flat nDCG@5 at `1`, while all other tested damping values have nDCG@5 below flat.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Calibration claim matches raw data. `metrics.json:76` through `metrics.json:128` shows damping `0.5` ties flat nDCG@5 at `1`, while all other tested damping values have nDCG@5 below flat.

### Confidence distribution assumptions: PASS with caveat. The existing rank factors already distinguish `EXTRACTED`, `INFERRED`, and `AMBIGUOUS` at `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:132-137`; no `>=0.5` assumption was found in `contextEdgeReliability`. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: Confidence distribution assumptions: PASS with caveat. The existing rank factors already distinguish `EXTRACTED`, `INFERRED`, and `AMBIGUOUS` at `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:132-137`; no `>=0.5` assumption was found in `contextEdgeReliability`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Confidence distribution assumptions: PASS with caveat. The existing rank factors already distinguish `EXTRACTED`, `INFERRED`, and `AMBIGUOUS` at `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:132-137`; no `>=0.5` assumption was found in `contextEdgeReliability`.

### Confidence range assumptions: PASS. `contextEdgeReliability` clamps arbitrary confidence into `0..1` at `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:437-449`; the new `0.9`, `0.75`, `0.35`, and `0.3` values are in-range. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: Confidence range assumptions: PASS. `contextEdgeReliability` clamps arbitrary confidence into `0..1` at `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:437-449`; the new `0.9`, `0.75`, `0.35`, and `0.3` values are in-range.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Confidence range assumptions: PASS. `contextEdgeReliability` clamps arbitrary confidence into `0..1` at `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:437-449`; the new `0.9`, `0.75`, `0.35`, and `0.3` values are in-range.

### Counterevidence sought: searched for loose truthy env parsing, string-interpolated SQL containing symbol names/file paths, dynamic object writes such as `obj[userControlledKey] = value`, and plain object dictionaries keyed by graph strings in the assigned paths. The reviewed occurrences used strict comparison, prepared statements, fixed-field metadata objects, `Map`, or `Set`. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Counterevidence sought: searched for loose truthy env parsing, string-interpolated SQL containing symbol names/file paths, dynamic object writes such as `obj[userControlledKey] = value`, and plain object dictionaries keyed by graph strings in the assigned paths. The reviewed occurrences used strict comparison, prepared statements, fixed-field metadata objects, `Map`, or `Set`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counterevidence sought: searched for loose truthy env parsing, string-interpolated SQL containing symbol names/file paths, dynamic object writes such as `obj[userControlledKey] = value`, and plain object dictionaries keyed by graph strings in the assigned paths. The reviewed occurrences used strict comparison, prepared statements, fixed-field metadata objects, `Map`, or `Set`.

### Cross-file resolver confidence writes: reads and updates use fixed SQL text with placeholders, and all file-derived `symbol_id`, edge ID, and JSON metadata values are passed via `.run(...)` parameters. Name bucketing uses `Map<string, CodeNodeRow[]>`, not object-index assignment. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:95`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:117`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:122`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:127`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:146`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:159`] -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Cross-file resolver confidence writes: reads and updates use fixed SQL text with placeholders, and all file-derived `symbol_id`, edge ID, and JSON metadata values are passed via `.run(...)` parameters. Name bucketing uses `Map<string, CodeNodeRow[]>`, not object-index assignment. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:95`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:117`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:122`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:127`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:146`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:159`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Cross-file resolver confidence writes: reads and updates use fixed SQL text with placeholders, and all file-derived `symbol_id`, edge ID, and JSON metadata values are passed via `.run(...)` parameters. Name bucketing uses `Map<string, CodeNodeRow[]>`, not object-index assignment. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:95`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:117`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:122`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:127`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:146`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:159`]

### Edge evidence type coverage: PASS. The graph-local type is exactly `EXTRACTED | INFERRED | AMBIGUOUS` at `.opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts:41-48`; no missing fourth graph-local value was found. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: Edge evidence type coverage: PASS. The graph-local type is exactly `EXTRACTED | INFERRED | AMBIGUOUS` at `.opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts:41-48`; no missing fourth graph-local value was found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Edge evidence type coverage: PASS. The graph-local type is exactly `EXTRACTED | INFERRED | AMBIGUOUS` at `.opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts:41-48`; no missing fourth graph-local value was found.

### Env flag fail-safe check: `isCodeGraphEdgeConfidenceDifferentiationEnabled()` returns `env[SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION] === 'true'`, so only the exact lowercase string enables the feature. Typos, uppercase `TRUE`, `1`, `yes`, and other truthy-looking values fail closed. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts:5`, `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts:7`] -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Env flag fail-safe check: `isCodeGraphEdgeConfidenceDifferentiationEnabled()` returns `env[SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION] === 'true'`, so only the exact lowercase string enables the feature. Typos, uppercase `TRUE`, `1`, `yes`, and other truthy-looking values fail closed. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts:5`, `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts:7`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Env flag fail-safe check: `isCodeGraphEdgeConfidenceDifferentiationEnabled()` returns `env[SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION] === 'true'`, so only the exact lowercase string enables the feature. Typos, uppercase `TRUE`, `1`, `yes`, and other truthy-looking values fail closed. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts:5`, `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts:7`]

### Other consumers: CONDITIONAL. `query-result-adapter.ts` passes metadata through safely, while `code-graph-context.ts` trace ambiguity logic mishandles the new explicit `AMBIGUOUS` class. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: Other consumers: CONDITIONAL. `query-result-adapter.ts` passes metadata through safely, while `code-graph-context.ts` trace ambiguity logic mishandles the new explicit `AMBIGUOUS` class.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Other consumers: CONDITIONAL. `query-result-adapter.ts` passes metadata through safely, while `code-graph-context.ts` trace ambiguity logic mishandles the new explicit `AMBIGUOUS` class.

### Raw metric deltas match the main prose claims. `metrics.json:37` through `metrics.json:65` records precision@3 delta `-0.1`, precision@5 delta `-0.06`, precision@8 delta `-0.0375`, recall deltas `-0.0139` for K 3/5/8 against the same-run flat baseline, nDCG@3 delta `-0.0574`, nDCG@5 delta `-0.0415`, and nDCG@8 delta `-0.0309`. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Raw metric deltas match the main prose claims. `metrics.json:37` through `metrics.json:65` records precision@3 delta `-0.1`, precision@5 delta `-0.06`, precision@8 delta `-0.0375`, recall deltas `-0.0139` for K 3/5/8 against the same-run flat baseline, nDCG@3 delta `-0.0574`, nDCG@5 delta `-0.0415`, and nDCG@8 delta `-0.0309`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Raw metric deltas match the main prose claims. `metrics.json:37` through `metrics.json:65` records precision@3 delta `-0.1`, precision@5 delta `-0.06`, precision@8 delta `-0.0375`, recall deltas `-0.0139` for K 3/5/8 against the same-run flat baseline, nDCG@3 delta `-0.0574`, nDCG@5 delta `-0.0415`, and nDCG@8 delta `-0.0309`.

### Script identity checks passed. `git diff --no-index` between the original tracked script at commit `f33835dbfe` under `.opencode/specs/system-spec-kit/.../seeded-ppr-impact-benchmark.mjs` and the current script under `.opencode/specs/system-speckit/.../seeded-ppr-impact-benchmark.mjs` produced no output. `git diff -- <current-script>` also produced no output, confirming no uncommitted local edits. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Script identity checks passed. `git diff --no-index` between the original tracked script at commit `f33835dbfe` under `.opencode/specs/system-spec-kit/.../seeded-ppr-impact-benchmark.mjs` and the current script under `.opencode/specs/system-speckit/.../seeded-ppr-impact-benchmark.mjs` produced no output. `git diff -- <current-script>` also produced no output, confirming no uncommitted local edits.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Script identity checks passed. `git diff --no-index` between the original tracked script at commit `f33835dbfe` under `.opencode/specs/system-spec-kit/.../seeded-ppr-impact-benchmark.mjs` and the current script under `.opencode/specs/system-speckit/.../seeded-ppr-impact-benchmark.mjs` produced no output. `git diff -- <current-script>` also produced no output, confirming no uncommitted local edits.

### Seeded-PPR graph traversal: node IDs, edge keys, and file paths are stored in `Map`/`Set` containers (`teleport`, adjacency, edge cache, candidate cache, node summaries, `whyIncludedByFile`). The PPR path does not write SQL, and its graph reads route through `queryEdgesFrom()` / `queryEdgesTo()`, which bind symbol IDs and edge types as prepared-statement parameters. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:481`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:494`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:680`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:712`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:716`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:865`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1941`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1971`] -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Seeded-PPR graph traversal: node IDs, edge keys, and file paths are stored in `Map`/`Set` containers (`teleport`, adjacency, edge cache, candidate cache, node summaries, `whyIncludedByFile`). The PPR path does not write SQL, and its graph reads route through `queryEdgesFrom()` / `queryEdgesTo()`, which bind symbol IDs and edge types as prepared-statement parameters. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:481`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:494`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:680`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:712`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:716`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:865`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1941`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1971`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Seeded-PPR graph traversal: node IDs, edge keys, and file paths are stored in `Map`/`Set` containers (`teleport`, adjacency, edge cache, candidate cache, node summaries, `whyIncludedByFile`). The PPR path does not write SQL, and its graph reads route through `queryEdgesFrom()` / `queryEdgesTo()`, which bind symbol IDs and edge types as prepared-statement parameters. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:481`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:494`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:680`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:712`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:716`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:865`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1941`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1971`]

### Shared-payload vocabulary: NOT APPLICABLE to this producer path. `.opencode/skills/system-code-graph/mcp_server/lib/shared/shared-payload.ts:33-67` defines a separate `GraphEdgeEnrichment.edgeEvidenceClass` vocabulary and is not the `CodeEdgeMetadata.evidenceClass` used by these CALLS edges. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: Shared-payload vocabulary: NOT APPLICABLE to this producer path. `.opencode/skills/system-code-graph/mcp_server/lib/shared/shared-payload.ts:33-67` defines a separate `GraphEdgeEnrichment.edgeEvidenceClass` vocabulary and is not the `CodeEdgeMetadata.evidenceClass` used by these CALLS edges.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shared-payload vocabulary: NOT APPLICABLE to this producer path. `.opencode/skills/system-code-graph/mcp_server/lib/shared/shared-payload.ts:33-67` defines a separate `GraphEdgeEnrichment.edgeEvidenceClass` vocabulary and is not the `CodeEdgeMetadata.evidenceClass` used by these CALLS edges.

### SQL write boundary: structural edge objects are persisted through prepared statements with bound values for `source_id`, `target_id`, `edge_type`, `weight`, and JSON metadata. The dynamic `IN (...)` placeholder lists are generated from array length only; the actual symbol IDs are still bound parameters. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1595`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1603`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1615`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1633`] -- BLOCKED (iteration 12, 1 attempts)
- What was tried: SQL write boundary: structural edge objects are persisted through prepared statements with bound values for `source_id`, `target_id`, `edge_type`, `weight`, and JSON metadata. The dynamic `IN (...)` placeholder lists are generated from array length only; the actual symbol IDs are still bound parameters. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1595`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1603`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1615`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1633`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: SQL write boundary: structural edge objects are persisted through prepared statements with bound values for `source_id`, `target_id`, `edge_type`, `weight`, and JSON metadata. The dynamic `IN (...)` placeholder lists are generated from array length only; the actual symbol IDs are still bound parameters. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1595`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1603`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1615`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1633`]

### Structural indexer confidence writes: confidence metadata uses fixed property names produced by `buildEdgeMetadata()` and `buildDifferentiatedCallsEdgeMetadata()`. File-derived strings such as symbol names, module specifiers, and paths are used as `Map` keys or fixed-field values, not as dynamic object property names. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:148`, `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:175`, `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1033`, `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1161`, `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2059`] -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Structural indexer confidence writes: confidence metadata uses fixed property names produced by `buildEdgeMetadata()` and `buildDifferentiatedCallsEdgeMetadata()`. File-derived strings such as symbol names, module specifiers, and paths are used as `Map` keys or fixed-field values, not as dynamic object property names. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:148`, `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:175`, `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1033`, `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1161`, `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2059`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Structural indexer confidence writes: confidence metadata uses fixed property names produced by `buildEdgeMetadata()` and `buildDifferentiatedCallsEdgeMetadata()`. File-derived strings such as symbol names, module specifiers, and paths are used as `Map` keys or fixed-field values, not as dynamic object property names. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:148`, `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:175`, `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1033`, `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1161`, `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2059`]

### The wider prose ranges are explainable when compared against both the original benchmark table and the current same-run flat baseline: original flat precision@5 `0.9800` in `benchmark-results.md:30` versus current PPR precision@5 `0.94` in `metrics.json:48` gives `-0.04`, while current same-run flat `1.0` in `metrics.json:47` gives `-0.06`; original precision@8 `0.9125` in `benchmark-results.md:31` versus current PPR precision@8 `0.8812` in `metrics.json:57` gives about `-0.031`, while current same-run flat `0.9187` in `metrics.json:56` gives `-0.0375`. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: The wider prose ranges are explainable when compared against both the original benchmark table and the current same-run flat baseline: original flat precision@5 `0.9800` in `benchmark-results.md:30` versus current PPR precision@5 `0.94` in `metrics.json:48` gives `-0.04`, while current same-run flat `1.0` in `metrics.json:47` gives `-0.06`; original precision@8 `0.9125` in `benchmark-results.md:31` versus current PPR precision@8 `0.8812` in `metrics.json:57` gives about `-0.031`, while current same-run flat `0.9187` in `metrics.json:56` gives `-0.0375`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The wider prose ranges are explainable when compared against both the original benchmark table and the current same-run flat baseline: original flat precision@5 `0.9800` in `benchmark-results.md:30` versus current PPR precision@5 `0.94` in `metrics.json:48` gives `-0.04`, while current same-run flat `1.0` in `metrics.json:47` gives `-0.06`; original precision@8 `0.9125` in `benchmark-results.md:31` versus current PPR precision@8 `0.8812` in `metrics.json:57` gives about `-0.031`, while current same-run flat `0.9187` in `metrics.json:56` gives `-0.0375`.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
