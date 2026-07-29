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
Review of the .opencode/runtime-hooks/ hook relocation. Target: worktree diff .worktrees/0118-skilled-hook-runtime-relocation (branch skilled/0118-hook-runtime-relocation) vs skilled/v4.0.0.0, single commit 40d5f0d2b3 (84 files changed: 25 git-mv renames, 58 modified, 1 added). reviewTargetType=files.

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
Not assessing: whether the relocation should be merged (operator decision), the design/necessity of the hooks themselves, or unrelated pre-existing repo issues (e.g. mcp-code-mode parent-skill-check failures, confirmed pre-existing on the unmodified main tree).

---

## 5. STOP CONDITIONS
stop_policy=max-iterations: run all 5 iterations regardless of apparent convergence (operator directive to force full depth, no early stop).

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 2 | Shared-core, import, wiring, and fail-open checks passed; Codex multi-file patches check only the first changed file. |
| D2 Security | CONDITIONAL | 3 | Prompt-only iteration markers bypass loop-repeat enforcement; raw command auditing leaks unrecognized credential formats. |
| D3 Traceability | CONDITIONAL | 4 | Live playbooks retain removed paths, and six-runtime post-move evidence is incomplete; selected feature-catalog mappings align. |
| D4 Maintainability | CONDITIONAL | 5 | Five adapters retain a system-spec-kit dependency; Cursor guards couple to Claude executable envelopes. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 6 active
- **P2 (Minor):** 4 active
- **Delta this iteration:** +0 P0, +1 P1, +1 P2

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
- Changed-file exact-path search: isolated stale relocation references without treating historical spec archives as live consumers (iteration 1).
- Wiring plus loader checks: direct config reads, symlink resolution, intended-runner tests, and plugin import smoke tests efficiently covered the highest-risk inventory boundaries (iteration 1).
- Concern-level runner separation plus adapter/config comparison covered import, payload, fail-open, and shared-core correctness without conflating runtime protocols (iteration 2).
- Trust-boundary tracing plus targeted core reproductions exposed prompt-derived authority and persistent-secret containment failures without requiring proprietary runtime replay (iteration 3).
- Requirement-to-playbook reconciliation exposed stale executable paths and separated historical live evidence from post-relocation proof (iteration 4).
- Ownership-boundary search plus direct adapter comparison separated real cross-skill/cross-runtime coupling from runtime-specific envelope translation (iteration 5).

---

## 9. WHAT FAILED
- Running every co-located test under `node --test` failed because `dispatch-audit.test.mjs` is a Vitest suite; runner selection must follow each test's declared harness (iteration 1).

---

## 10. EXHAUSTED APPROACHES (do not retry)
[Populated when a review approach has been tried from multiple angles without yielding new findings]

### [Category Name] -- BLOCKED (iteration N, N attempts)
- What was tried: [specific review approaches attempted]
- Why blocked: [root cause of exhaustion]
- Do NOT retry: [explicit prohibition]

### [Category Name] -- PRODUCTIVE (iteration N)
- What worked: [successful review approaches in this category]
- Prefer for: [related dimensions where this category may help]

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])
- Executable changed-scope consumers still use moved skill roots: exact search found no executable hit; the sole changed-scope hit is a stale documentation row (iteration 1, evidence: `.opencode/skills/sk-code/code-opencode/references/shared/hooks.md:89`).
- Runtime discovery mirrors broke during relocation: all 17 reviewed mirrors are symlinks whose targets resolve (iteration 1).
- Relocated shared cores or adapter imports changed behavior: 46 Node tests, 38 Vitest tests, syntax checks, and exact import review passed (iteration 2).
- Selected Codex/Cursor/Devin adapter registrations use mismatched tool names or cwd fields: direct adapter/config comparison found matching runtime names and normalized project roots (iteration 2).
- Post-edit path traversal reaches checker execution: `relativeSegments()` rejects paths outside `projectDir` before dispatch resolution (iteration 3, evidence: `.opencode/runtime-hooks/post-edit-quality/lib/post-edit-router.cjs:89-98,156-165`).
- Edited filenames reach a shell interpolation boundary: checker execution uses `spawnSync(checkerPath, args)` with a separate argv array and no shell option (iteration 3, evidence: `.opencode/runtime-hooks/post-edit-quality/lib/post-edit-router.cjs:320-379`).
- Selected Cursor feature-catalog and MCP route-guard capability ownership is stale: direct source tables and commands consistently use `.opencode/runtime-hooks/` and preserve confirmed-versus-unavailable distinctions (iteration 4, evidence: `.opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:44-69`; `.opencode/skills/mcp-code-mode/manual-testing-playbook/plugins-and-hooks/mcp-route-guard.md:24-31,231-239`).
- Concern policy is duplicated across representative direct adapters: dispatch and post-edit adapters delegate policy/routing to concern-local cores; remaining branches translate runtime envelopes and budgets (iteration 5, evidence: `.opencode/runtime-hooks/dispatch/codex/dispatch-preflight-lint.mjs:21-38,71-105`; `.opencode/runtime-hooks/post-edit-quality/codex/post-edit-quality.cjs:21,96-150`).

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
All configured dimensions are covered. Next focus: reducer validation and synthesis; do not dispatch another review dimension.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT
No prior deep-review exists for this relocation. Operator-stated focus areas: (1) any remaining stale path reference missed during relocation, (2) correctness of every relocated relative-import depth, (3) whether any runtime wiring config still points at an old path, (4) whether the two confirmed non-moved-hook boundaries (spec-gate/session-lifecycle staying in system-spec-kit, git-preflight-advisory staying in sk-git) are correct given real code dependencies.

### Bounded Context Snapshot

- Target pointers: `.opencode/runtime-hooks/`, four runtime hook configs, four discovery-mirror directories, `.opencode/plugins/`, and `.pi/extensions/`.
- Behavior claims: moved hooks remain live under every runtime; relative imports resolve; unmoved spec/session/git boundaries remain skill-owned; documentation and playbooks name the canonical paths.
- Reuse and conventions: thin runtime adapters call concern-local `lib/` cores; runtime configs point to real adapters; discovery mirrors are symlinks only.
- Review risks and gaps: changed-file path search is graphless; runtime payload branch behavior and full spec/checklist evidence remain unaudited after inventory.
- Out of scope: redesigning hook policy, changing source or docs under review, and unrelated archived/spec-history references.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 4 | Documentation acceptance is contradicted by current old-root playbook references. |
| `checklist_evidence` | core | fail | 4 | Stale-path closure and six-runtime live evidence are overstated. |
| `skill_agent` | overlay | fail | 4 | Live skill-owned playbooks retain relocated adapter and test roots. |
| `agent_cross_runtime` | overlay | partial | 4 | Wiring is inventoried; post-move live proof is recorded only for Pi and OpenCode. |
| `feature_catalog_code` | overlay | pass | 4 | Reviewed Cursor source mappings use the relocated tree and preserve delivery-status distinctions. |
| `playbook_capability` | overlay | fail | 4 | MCP route-guard mapping aligns, but dispatch/Codex playbooks retain stale current-state paths. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/runtime-hooks/dispatch/**` | D1, D2, D4 | 5 | 1 P1 | reviewed |
| `.opencode/runtime-hooks/mcp-route-guard/**` | D1, D2, D4 | 5 | 1 P1, 1 P2 | reviewed |
| `.opencode/runtime-hooks/post-edit-quality/**` | D1, D2, D4 | 5 | 1 P1 | reviewed |
| `.opencode/runtime-hooks/task-dispatch/**` | D1, D2, D4 | 5 | 2 P1, 1 P2 | reviewed |
| `.codex/hooks.json` | D1 | 2 | 1 P1 consumer | partial |
| `.devin/hooks.v1.json` | D1 | 2 | 0 | partial |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: [from config]
- Convergence threshold: [from config]
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=[from config.sessionId], parentSessionId=[from config.parentSessionId], generation=[from config.generation], lineageMode=[from config.lineageMode]
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Severity threshold: [from config.severityThreshold]
- Review target type: [from config.reviewTargetType]
- Cross-reference checks: core=[from config.crossReference.core], overlay=[from config.crossReference.overlay]
- Started: [timestamp]
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .opencode/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .opencode/skills/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts
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
- P1 (Required): 6
- P2 (Suggestions): 4
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `agent_cross_runtime`: partial. Claude, Codex, Cursor, Devin, OpenCode, and Pi wiring surfaces were inventoried; runtime behavior parity remains for later dimensions. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `agent_cross_runtime`: partial. Claude, Codex, Cursor, Devin, OpenCode, and Pi wiring surfaces were inventoried; runtime behavior parity remains for later dimensions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: partial. Claude, Codex, Cursor, Devin, OpenCode, and Pi wiring surfaces were inventoried; runtime behavior parity remains for later dimensions.

### `agent_cross_runtime`: partial. Payload translations were inspected across Codex, Cursor, and Devin; live-runtime replay remains outside this iteration. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `agent_cross_runtime`: partial. Payload translations were inspected across Codex, Cursor, and Devin; live-runtime replay remains outside this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: partial. Payload translations were inspected across Codex, Cursor, and Devin; live-runtime replay remains outside this iteration.

### `agent_cross_runtime`: partial. Shared-core blast radius was mapped across the runtime adapters; live hostile-payload replay was limited to the core entrypoints. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `agent_cross_runtime`: partial. Shared-core blast radius was mapped across the runtime adapters; live hostile-payload replay was limited to the core entrypoints.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: partial. Shared-core blast radius was mapped across the runtime adapters; live hostile-payload replay was limited to the core entrypoints.

### `checklist_evidence`: pending for the traceability dimension. -- BLOCKED (iteration 3, 2 attempts)
- What was tried: `checklist_evidence`: pending for the traceability dimension.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: pending for the traceability dimension.

### `checklist_evidence`: pending. Inventory established the validation mismatch but did not adjudicate the implementation packet checklist. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: pending. Inventory established the validation mismatch but did not adjudicate the implementation packet checklist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: pending. Inventory established the validation mismatch but did not adjudicate the implementation packet checklist.

### `feature_catalog_code`: pending. -- BLOCKED (iteration 3, 3 attempts)
- What was tried: `feature_catalog_code`: pending.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: pending.

### `playbook_capability`: pending. -- BLOCKED (iteration 3, 3 attempts)
- What was tried: `playbook_capability`: pending.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: pending.

### `skill_agent`: partial, unchanged from iteration 1. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `skill_agent`: partial, unchanged from iteration 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: partial, unchanged from iteration 1.

### `skill_agent`: partial, unchanged. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `skill_agent`: partial, unchanged.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: partial, unchanged.

### `skill_agent`: partial. The old-root scan found one stale documentation consumer and no executable consumer in the changed scope. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent`: partial. The old-root scan found one stale documentation consumer and no executable consumer in the changed scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: partial. The old-root scan found one stale documentation consumer and no executable consumer in the changed scope.

### `spec_code`: partial. Live runtime configs point to the relocated tree, all 17 discovery symlinks resolve, and the five changed OpenCode plugin entrypoints import successfully. Full behavioral/spec acceptance alignment remains for the traceability iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: partial. Live runtime configs point to the relocated tree, all 17 discovery symlinks resolve, and the five changed OpenCode plugin entrypoints import successfully. Full behavioral/spec acceptance alignment remains for the traceability iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. Live runtime configs point to the relocated tree, all 17 discovery symlinks resolve, and the five changed OpenCode plugin entrypoints import successfully. Full behavioral/spec acceptance alignment remains for the traceability iteration.

### `spec_code`: partial. Relocated adapters load, runtime registrations resolve, and shared behavior suites pass; the Codex multi-file branch does not preserve per-edited-file quality coverage. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code`: partial. Relocated adapters load, runtime registrations resolve, and shared behavior suites pass; the Codex multi-file branch does not preserve per-edited-file quality coverage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. Relocated adapters load, runtime registrations resolve, and shared behavior suites pass; the Codex multi-file branch does not preserve per-edited-file quality coverage.

### `spec_code`: partial. Security behavior was checked against the shared-core comments and adapter contracts; full acceptance alignment remains for the traceability iteration. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code`: partial. Security behavior was checked against the shared-core comments and adapter contracts; full acceptance alignment remains for the traceability iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. Security behavior was checked against the shared-core comments and adapter contracts; full acceptance alignment remains for the traceability iteration.

### Resource-map gate: skipped because `resource-map.md` was absent at initialization. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Resource-map gate: skipped because `resource-map.md` was absent at initialization.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Resource-map gate: skipped because `resource-map.md` was absent at initialization.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
