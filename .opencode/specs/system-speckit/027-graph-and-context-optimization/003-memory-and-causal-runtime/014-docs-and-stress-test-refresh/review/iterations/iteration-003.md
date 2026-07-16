# Deep Review Iteration 003

## Dimension

- Focus: traceability
- Mode: review
- Scope class: complex
- Graph coverage: graphless fallback; prior strategy records code graph traversal as stale/blocked.

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-config.json:104`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-strategy.md:16`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1014`
- `.opencode/skills/system-spec-kit/mcp_server/package.json:3`
- `.opencode/skills/system-spec-kit/mcp_server/package.json:4`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:670`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:716`
- `.opencode/skills/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:117`
- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:48`
- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:60`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update/spec.md:43`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update/implementation-summary.md:109`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update/spec.md:134`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update/implementation-summary.md:72`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/001-manual-testing-playbook-update/checklist.md:16`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/001-manual-testing-playbook-update/checklist.md:26`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/001-manual-testing-playbook-update/implementation-summary.md:27`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update/checklist.md:16`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update/checklist.md:26`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update/implementation-summary.md:26`
- `.opencode/skills/system-spec-kit/feature_catalog/pipeline-architecture/mcp-launcher-front-proxy.md:32`
- `.opencode/skills/system-spec-kit/feature_catalog/pipeline-architecture/mcp-launcher-front-proxy.md:46`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/pipeline-architecture/front-proxy-reconnect-and-backend-only.md:14`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/sk-git-worktree-convention.md:10`
- `.opencode/skills/sk-git/SKILL.md:291`

## Findings By Severity

### P0

- None.

### P1

#### R3-P1-001 [P1] ServerInfo traceability still cites the pre-fix `1.7.2` value

- Claim: The reviewed work includes a serverInfo `1.7.2` to `1.8.0` fix, and traceability docs should point at the current deployed source anchor.
- Evidence: `context-server.ts` now advertises `{ name: 'mk-spec-memory', version: '1.8.0' }`, and `mcp_server/package.json` is also `1.8.0`; however multiple packet docs still record `context-server.ts:1014` as `version: '1.7.2'`, including the 002 feature-catalog spec and implementation-summary and the 003 README-cluster spec and implementation-summary. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1014`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/package.json:3`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update/spec.md:43`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update/implementation-summary.md:109`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update/spec.md:134`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update/implementation-summary.md:72`]
- Counterevidence sought: Checked whether the stale value was only a historical review-target label; it is not isolated to history prose because the rows say the deployed source anchor was verified or passed.
- Alternative explanation: These could have been authored before the later serverInfo bump, but the current review target explicitly includes the `1.8.0` fix and the docs now contradict it.
- Final severity: P1.
- Confidence: 0.94.
- Downgrade trigger: Downgrade to P2 only if the packet declares those rows as immutable historical snapshots and a newer canonical traceability surface supersedes them.

#### R3-P1-002 [P1] Tool-count traceability contradicts the canonical `TOOL_DEFINITIONS.length`

- Claim: The 014 README/catalog refresh preserves the mk-spec-memory 36-tool count and avoids conflating it with other tool surfaces.
- Evidence: `TOOL_DEFINITIONS` contains 36 exported registrations, and the package-local drift test asserts 36. The same reviewed surface still contains incompatible counts: `mcp_server/package.json` says the server provides 35 tools, while the feature catalog says `TOOL_DEFINITIONS.length` is 55 and later says `54-tool server count`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:670`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:716`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:117`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/package.json:4`] [SOURCE: `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:48`] [SOURCE: `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:60`]
- Counterevidence sought: Checked whether `55`/`54` was described as a cross-server surface; line 48 names `TOOL_DEFINITIONS.length` in `mcp_server/tool-schemas.ts` as the canonical source, so the count is not merely a broader ecosystem total.
- Alternative explanation: The package description may be stale metadata predating the schema split, but it is in the current review scope and remains user-visible.
- Final severity: P1.
- Confidence: 0.91.
- Downgrade trigger: Downgrade to P2 if the catalog is revised to explicitly separate a broader non-server count from the 36-tool `mk-spec-memory` server count and the package manifest is treated as non-authoritative marketing text.

### P2

#### R3-P2-001 [P2] Setup-era checklist frontmatter conflicts with completed child continuity

- Evidence: The 001 and 002 checklist frontmatter still says `completion_pct: 0` and points at next sibling setup actions, while the corresponding implementation summaries report completion_pct 100 and shipped/validated work. The implementation summaries are the canonical resume ladder source, so this is advisory, but indexed checklist records can still surface stale next actions. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/001-manual-testing-playbook-update/checklist.md:16`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/001-manual-testing-playbook-update/checklist.md:26`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/001-manual-testing-playbook-update/implementation-summary.md:27`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update/checklist.md:16`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update/checklist.md:26`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update/implementation-summary.md:26`]
- Finding class: matrix/evidence.
- Scope proof: Same stale setup pattern was checked in both early child checklists and compared against their implementation-summary continuity fields; 003 and 004 summaries/checklists do not show the same `completion_pct: 0` setup-era state in the evidence sampled.
- Recommendation: Reconcile non-canonical checklist frontmatter to completion_pct 100 and non-binding next actions, or strip checklist `_memory.continuity` blocks if only implementation-summary continuity is intended to be canonical.

## Traceability Checks

- `spec_code`: FAIL. ServerInfo source is 1.8.0, but current child specs/summaries still cite 1.7.2.
- `checklist_evidence`: FAIL. Tool-count and serverInfo verification rows claim current source-anchor checks that no longer match source.
- `feature_catalog_code`: FAIL. Feature catalog root count claims conflict with the package-local `TOOL_DEFINITIONS` source.
- `playbook_capability`: PASS for sampled high-risk overlays. EX-040 and EX-041 scenario claims match the front-proxy and sk-git source anchors sampled.
- `skill_agent`: PASS for sk-git worktree convention; the catalog/playbook wording matches `sk-git` source.
- `agent_cross_runtime`: N/A for this iteration. The reviewed 014 deltas sampled here did not add a cross-runtime agent capability beyond existing root playbook orchestration notes.

## SCOPE VIOLATIONS

- None. Reviewed target files were read-only; no fixes were applied.

## Verdict

- CONDITIONAL. Two P1 traceability findings are new and must be reconciled before this review can converge to PASS.

## Next Dimension

- maintainability
Review verdict: CONDITIONAL
