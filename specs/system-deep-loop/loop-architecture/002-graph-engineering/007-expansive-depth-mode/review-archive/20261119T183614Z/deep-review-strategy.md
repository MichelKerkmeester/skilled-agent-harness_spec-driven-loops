---
title: "Deep Review Strategy: expansive-depth program logic, generation 2"
description: "Session tracking for the three-iteration deep review of the code the expansive-depth program added or changed."
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.1.0
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
commit range 21c4b325b5a..f30fcdb42f6 (expansive-depth program logic: code, command YAML assets and tests under .skilled/skills/system-deep-loop/ and .skilled/commands/deep/; docs, playbooks and specs excluded).

Generation 2 of the review lineage. Generation 1 (session 2026-11-19T04:20:12.962Z) reviewed 21c4b325b5a..1d2b49e4306 across code, docs and specs in ten iterations and is archived under review-archive/.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] traceability

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Docs, manual testing playbooks, feature catalogs and spec folders: excluded from the target.
- Traceability: not a configured dimension for this run, so no core traceability protocol is owed at stop.
- Code outside the range diff: read it only to judge a changed line.

---

## 5. STOP CONDITIONS
- Exactly three iterations: maxIterations 3 and antiConvergence.minIterations 3, so the run stops at maxIterationsReached after iteration 3.
- maxDurationMinutes 120 from createdAt.
- Dimension order: correctness (1), security (2), maintainability with the overengineering and sk-code-alignment rubrics (3).

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 3
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Following one value across producers and consumers (the dimension set from config through reducer, YAML next_dimension and convergence) surfaced the contradiction that a per-file read missed (iteration 1).
- Tracing each shell-interpolated value back to its producer (node id minting, registry binding, file-tool writes) cleared the YAML shell steps quickly, and comparing sibling normalizers in fanout-run.cjs exposed the one unnormalized operator text (iteration 2).
- Listing every function the range added in production files, then grepping shared constants across them, exposed the parallel frontier implementations in one pass. Indexing all added lines by file:line made a range-wide comment-hygiene grep cheap (iteration 3).
- Reading the whole new frontier-admit.cjs before its consumers made the admission and close invariants quick to confirm clean (iteration 1).

---

## 9. WHAT FAILED
- The full 68-file range does not fit one 24-call iteration: fanout-run.cjs, upsert.cjs, dispatch-iteration.cjs, verify-iteration.cjs, the deep-research reducer, ledger schemas and divergent-pivot changes stayed unread under correctness (iteration 1).
- The ledger schema files did not fit the iteration 2 budget under security (iteration 2).
- Test-what-changed across about 38 test files (roughly 10k added lines) did not fit the iteration 3 budget, so it was sampled only and recorded as deferred (iteration 3).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Comment hygiene violations: none in 14112 added lines. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Comment hygiene violations: none in 14112 added lines.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Comment hygiene violations: none in 14112 added lines.

### Commit-range relevance check: the target string tokenizes to a revision range and admission falls back to `reviewScopeFiles`; an empty file list admits every scope by stated design, not by accident (frontier-admit.cjs:534). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Commit-range relevance check: the target string tokenizes to a revision range and admission falls back to `reviewScopeFiles`; an empty file list admits every scope by stated design, not by accident (frontier-admit.cjs:534).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Commit-range relevance check: the target string tokenizes to a revision range and admission falls back to `reviewScopeFiles`; an empty file list admits every scope by stated design, not by accident (frontier-admit.cjs:534).

### Convergence-signal forgery through upsert derivations: no new capability. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Convergence-signal forgery through upsert derivations: no new capability.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Convergence-signal forgery through upsert derivations: no new capability.

### Duplicated `node -e` extend scripts in the two YAML assets: inline `node -e` steps were already the convention before the range (6 in deep-review.yaml, 5 in deep-research.yaml at 21c4b325b5a). The tests run both extracted steps (workflow-restart-lifecycle.vitest.ts:721, 1006). The differences between the copies track real config-shape differences: research nests lineage fields and has an inbox, review does not. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Duplicated `node -e` extend scripts in the two YAML assets: inline `node -e` steps were already the convention before the range (6 in deep-review.yaml, 5 in deep-research.yaml at 21c4b325b5a). The tests run both extracted steps (workflow-restart-lifecycle.vitest.ts:721, 1006). The differences between the copies track real config-shape differences: research nests lineage fields and has an inbox, review does not.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Duplicated `node -e` extend scripts in the two YAML assets: inline `node -e` steps were already the convention before the range (6 in deep-review.yaml, 5 in deep-research.yaml at 21c4b325b5a). The tests run both extracted steps (workflow-restart-lifecycle.vitest.ts:721, 1006). The differences between the copies track real config-shape differences: research nests lineage fields and has an inbox, review does not.

### Env leakage through research CLAUDE_CONFIG_DIR: same validator and allowlist as review. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Env leakage through research CLAUDE_CONFIG_DIR: same validator and allowlist as review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Env leakage through research CLAUDE_CONFIG_DIR: same validator and allowlist as review.

### fanout-merge.cjs partition guard compares partition ids against a flat set of lineage-local ids across all lineages; collision would need two lineages to report the same depth-1 id, and depth-1 ids are minted only by the single seed, so a missing node cannot be masked in practice. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: fanout-merge.cjs partition guard compares partition ids against a flat set of lineage-local ids across all lineages; collision would need two lineages to report the same depth-1 id, and depth-1 ids are minted only by the single seed, so a missing node cannot be masked in practice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: fanout-merge.cjs partition guard compares partition ids against a flat set of lineage-local ids across all lineages; collision would need two lineages to report the same depth-1 id, and depth-1 ids are minted only by the single seed, so a missing node cannot be masked in practice.

### Path traversal through review proposal scope: normalized and refused. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Path traversal through review proposal scope: normalized and refused.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Path traversal through review proposal scope: normalized and refused.

### Prompt-row breakage by leaf proposals: control characters stripped. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Prompt-row breakage by leaf proposals: control characters stripped.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prompt-row breakage by leaf proposals: control characters stripped.

### Regex injection through node ids in the research reducer: escaped. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Regex injection through node ids in the research reducer: escaped.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Regex injection through node ids in the research reducer: escaped.

### Shell injection through `{active_frontier_node}`: ids are minted, not leaf-chosen. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Shell injection through `{active_frontier_node}`: ids are minted, not leaf-chosen.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shell injection through `{active_frontier_node}`: ids are minted, not leaf-chosen.

### upsert.cjs finding-id prefix folding as overengineering: the tests pin the `FIND-`, `finding-` and lowercase spellings (upsert-script.vitest.ts:400, 530, 567). The `node:finding:` spelling is one regex alternate. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: upsert.cjs finding-id prefix folding as overengineering: the tests pin the `FIND-`, `finding-` and lowercase spellings (upsert-script.vitest.ts:400, 530, 567). The `node:finding:` spelling is one regex alternate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: upsert.cjs finding-id prefix folding as overengineering: the tests pin the `FIND-`, `finding-` and lowercase spellings (upsert-script.vitest.ts:400, 530, 567). The `node:finding:` spelling is one regex alternate.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- fanout-merge.cjs frontier partition guard masking a missing node: depth-1 ids come only from the single seed, so a flat id set cannot collide (iteration 1, evidence: fanout-merge.cjs mergeResearchFrontier, frontier-admit.cjs seedNodes).
- Commit-range relevance admitting every scope: only when reviewScopeFiles is empty, by stated design (iteration 1, evidence: frontier-admit.cjs:534).
- Shell injection through `{active_frontier_node}`: ids are minted F-<depth>-<serial> and bound from the reducer-projected registry (iteration 2, frontier-admit.cjs:672, deep-review.yaml:1193).
- Path traversal through review proposal scope: path.posix.normalize plus prefix check refuses climbing and absolute paths (iteration 2, frontier-admit.cjs:467).
- Prompt-row breakage by leaf proposals: control characters stripped, length capped (iteration 2, frontier-admit.cjs:136).
- Upsert signal forgery and research CLAUDE_CONFIG_DIR leakage: no new capability, same validator (iteration 2).
- Duplicated YAML extend node -e scripts: inline node -e was already the convention before the range, and the tests run both extracted steps (iteration 3, workflow-restart-lifecycle.vitest.ts:721, :1006).
- upsert.cjs finding-id folding as overengineering: the tests pin the spellings (iteration 3, upsert-script.vitest.ts:400, :530, :567).
- Comment hygiene: zero ephemeral labels in 14112 added lines (iteration 3).
- Review budget closing answered nodes: answered is derived before the budget pass (iteration 3, runtime/scripts/reduce-state.cjs:2026, :2041).
- Per-mode ledger-schema extension validators: these follow the existing per-mode architecture (iteration 3).

### Carry-forward edge cases
- Read under security in iteration 2: fanout-run.cjs, upsert.cjs, dispatch-iteration.cjs, verify-iteration.cjs, deep-research/scripts/reduce-state.cjs, divergent-pivot changes, fanout-merge.cjs. Still unread: the deep-research and deep-review ledger schema files.
- R2-P2-001: researchTopic only trimmed (fanout-run.cjs:3712) while review focus and target collapse whitespace.
- Verdict-line mapping differs between the prompt pack (this iteration's findings) and the agent contract (active findings); iteration 2 used the agent contract, CONDITIONAL while R1-P1-001 is active.
- R1-P1-001 downgrade trigger: a governing doc stating an expansive review node needs all canonical dimensions regardless of reviewDimensions.
- Ledger schemas were read in iteration 3, which closes the earlier carry-forward. frontier-admit.cjs:381 (reviewDimensionCount) is a further affected surface of R1-P1-001.
- R3-P2-001: the frontier status vocabulary, store reader and band budget are duplicated across the two reducers and fanout-merge. The collapse target is a runtime/lib/deep-loop module.
- Test-what-changed is deferred and unreviewed, not clean (iteration 3).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
traceability

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
- Continuity ladder: no handover.md; implementation-summary.md continuity names the generation 2 research synthesis. The free-text recipe over the target text returned a clean no-hit (rg exit 1).
- Prior lineage (archived): generation 1 ended at its cap with verdict FAIL, 2 P1 and 14 P2, over a wider target that included docs. Its report is review-archive/20261119T153733Z/review-report.md; do not re-report a finding the later commits fixed.

- resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: the 68 files in reviewScopeFiles; diff each with git diff 21c4b325b5a..f30fcdb42f6 -- <file>.
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
| .skilled/commands/deep/assets/deep-research.yaml | none | 0 | 0 | pending |
| .skilled/commands/deep/assets/deep-review.yaml | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/lib/deep-review-reducers/deep-review-reducer.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/divergent-pivot.cjs | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/executor-audit-cli-branch-receipts.test.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/fanout-review-focus.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/integration/convergence-script.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/integration/divergent-pivot.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/integration/review-depth-convergence.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/integration/upsert-script.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/append-mode-event-legacy-seam.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/check-ledger-stem-producers.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/continuity-thread.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/coverage-graph-signals.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-graph-upsert.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-ledger-schema.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-projections-contract.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reducers.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-deltas-contract.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-ledger-schema.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-reducers.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/dispatch-iteration.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/divergent-pivot-cli.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/divergent-pivot-seat-scope.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit-review.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/loop-counters-derivation.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/loop-heartbeat.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/operator-text-shell-steps.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/optimizer-manifest-anti-convergence.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/research-depth-mode-golden.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/review-depth-mode-golden.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision-yaml-contract.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/terminal-gates.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts | none | 0 | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts | none | 0 | 0 | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-11-19T15:38:08.666Z, parentSessionId=2026-11-19T04:20:12.962Z, generation=2, lineageMode=restart
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-11-19T15:38:08.666Z
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
