## Dimension: security

## Files Reviewed (path:line list)

- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:197-235`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:340-380`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/utils/workspace-path.ts:21-49`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:30-50`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:140-166`
- `.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts:56-65`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1292-1305`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1375-1448`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1556-1580`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2070-2095`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:314-359`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:312-346`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:348-392`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/README.md:252-270`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/008-end-user-scope-default-and-opt-in/spec.md:119-128`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/008-end-user-scope-default-and-opt-in/checklist.md:85-88`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/008-end-user-scope-default-and-opt-in/decision-record.md:162-181`

## Findings by Severity

### P0

None.

### P1

None.

### P2

None.

## Traceability Checks

- `spec_code`: PASS. F1 requires default scans to exclude `.opencode/skills/`; `handleCodeGraphScan()` canonicalizes `rootDir` before `getDefaultConfig()`, and the default config carries `includeSkills:false` plus `**/.opencode/skills/**`.
- `checklist_evidence`: PASS. CHK-032 remains evidenced by the shared `shouldIndexForCodeGraph()` deny-by-default policy and by tests covering direct skill fixtures, symlinked skill roots, and scan-handler canonical-root propagation.
- `skill_agent`: PASS. This iteration stayed read-only for review-target code and wrote only review packet artifacts.
- `feature_catalog_code`: PASS. The code preserves the documented scope opt-in boundary while keeping skill internals excluded by default.

Additional edge checks:

- Symlink loop: PASS. A root-level circular symlink causes `realpathSync()` to throw `ELOOP`; `canonicalizeWorkspacePaths()` catches realpath failures and the scan handler returns a typed invalid-root error before indexing.
- Symlink to file: PASS. `realpathSync()` resolves the target file; `indexFiles()` attempts to walk the canonical file path, `readdirSync()` fails and is caught, and no directory descent or indexing occurs.
- `rootDir` under real `.opencode/skill`: PASS. A canonical root such as `/tmp/foo/.opencode/skills/bar` is passed into `getDefaultConfig()`, and every child candidate still contains `/.opencode/skills/`, so `shouldIndexForCodeGraph()` excludes it by default.

## Run-1 Regression Check (state which closed finding(s) you re-verified, with PASS/FAIL)

- `R3-P1-001` symlink rootDir bypass: PASS. `handleCodeGraphScan()` computes `canonicalRootDir` via `canonicalizeWorkspacePaths()` before calling `getDefaultConfig(canonicalRootDir, scopePolicy)`, the walker starts from the canonical root, and the structural-indexer symlink regression test confirms a symlink alias to real `.opencode/skills/example.ts` is not indexed by default.

## Verdict — PASS / CONDITIONAL / FAIL with one-line reason

PASS — no security regression or new security finding was found in the FIX-009 symlink scope path.

## Next Dimension

Security should continue in iteration 7 with cross-handler parity and remaining trust-boundary checks.
