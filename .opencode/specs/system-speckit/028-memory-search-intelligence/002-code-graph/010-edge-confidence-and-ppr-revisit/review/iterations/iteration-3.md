## Dimension

Security/reliability: recovered eval script filesystem operations, env handling, and edge-confidence write paths.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:28`
- `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/quick_reference.md:166`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/review/deep-review-state.jsonl:1`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/review/deep-review-strategy.md:119`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/review/deep-review-findings-registry.json:9`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/spec.md:156`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/plan.md:86`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/tasks.md:61`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/checklist.md:89`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/decision-record.md:60`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/implementation-summary.md:57`
- `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts:7`
- `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:84`
- `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1502`
- `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2039`
- `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2132`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:138`
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cross-file-edges.vitest.ts:179`
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:1502`
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-flag-on-path.vitest.ts:125`
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-ranking.vitest.ts:154`
- `.opencode/skills/system-code-graph/mcp_server/scripts/eval/score-seeded-ppr-retrieval.mjs:86`
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:326`

## Findings by Severity

### P0

None.

### P1

None new. Prior active P1 findings remain in the registry and were not re-emitted: P1-001, P1-002, P1-003.

### P2

#### P2-004 [P2] Eval harness cleanup is not failure-safe

- Claim: `score-seeded-ppr-retrieval.mjs` writes a generated child module into `scripts/eval/` and creates per-run copied DB directories, but cleanup is only on the successful linear path. If `copyFileSync`, the child process, JSON parsing, or any topology run fails, the generated `ppr-impact-child.mjs` and sometimes a `vitest-tmp/ppr-eval-*` work directory can be left behind in the repo tree.
- Evidence: `writeFileSync(CHILD, CHILD_SOURCE, 'utf8')` writes the helper at `.opencode/skills/system-code-graph/mcp_server/scripts/eval/score-seeded-ppr-retrieval.mjs:116`; `rmSync(CHILD, { force: true })` only runs after every topology finishes at `.opencode/skills/system-code-graph/mcp_server/scripts/eval/score-seeded-ppr-retrieval.mjs:133`; `runChild()` creates `workDir` and copies the live DB at lines 87-88 but only removes `workDir` after `spawnSync` returns at line 103.
- Counterevidence sought: Checked for shell execution and untrusted path construction. The child is launched through `spawnSync(process.execPath, [CHILD, workDir, topology])` without a shell at line 98, `topology` values come from the local `TOPOLOGIES` object at lines 81-84, and the DB writes use prepared statements inside the copied database at lines 31-43. That rules out command injection or traversal as the finding class.
- Alternative explanation: The script is an operator eval harness, not production request handling, and the paths are fixed under the code-graph MCP server. This limits the impact to reliability/worktree hygiene rather than a security vulnerability.
- Final severity: P2.
- Confidence: 0.86.
- Downgrade trigger: Downgrade to no finding if cleanup is wrapped in `try/finally` for both `workDir` and `CHILD`, or if the child source is generated inside the per-run temp directory and removed with that directory.
- Finding class: instance-only.
- Scope proof: Grep over the reviewed script's filesystem operations found only `mkdtempSync`, `copyFileSync`, `writeFileSync`, and `rmSync` in this single eval harness; the implementation write paths in `structural-indexer.ts` and `cross-file-edge-resolver.ts` use fixed SQL updates/prepared statements and do not perform filesystem cleanup.
- Affected surface hints: eval harness, benchmark reproducibility, repo worktree hygiene.

## Traceability Checks

- `spec_code` core: PASS for this dimension. `spec.md:156` requires no destructive shell commands; the eval script does not use shell invocation and the reviewed cleanup targets are fixed paths.
- `checklist_evidence` core: CONDITIONAL inherited from P1-003. This iteration did not re-adjudicate completion-state drift, but did confirm `checklist.md:89` records recovered-code security review intent.
- `security/reliability` overlay: PASS with advisory. No injection/traversal/unsafe env parsing found in reviewed code paths; one failure-cleanup reliability advisory was recorded.

## Verdict

CONDITIONAL. No new P0/P1 findings were found in the security/reliability pass, but three prior active P1s remain unresolved, and this iteration adds one P2 advisory.

## Next Dimension

Iteration 4 should continue under `stopPolicy=max-iterations` and broaden to maintainability/traceability overlays: verify overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`) and check whether recovered PPR code and docs expose clear ownership boundaries for future disabled-code maintenance.
Review verdict: CONDITIONAL
