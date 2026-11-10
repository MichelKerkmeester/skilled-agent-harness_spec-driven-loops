# Iteration 006: Import Direction And Root Resolution

## Focus
Review nested CLI imports, policy regexes, handler-root candidate resolution and public runtime API comments after the move.

## Sources Reviewed
- `.opencode/skills/system-spec-kit/runtime/cli/evals/import-policy-rules.ts:16-31,37-89`
- `.opencode/skills/system-spec-kit/runtime/cli/evals/check-handler-cycles-ast.ts:21-41,74-103`
- `.opencode/skills/system-spec-kit/runtime/cli/evals/check-no-mcp-lib-imports-ast.ts:75-126`
- `.opencode/skills/system-spec-kit/runtime/api/index.ts:1-8,12-44`
- `.opencode/skills/system-spec-kit/runtime/cli/tsconfig.json:10-19`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/task-enrichment.vitest.ts:1-14`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-registry.vitest.ts:25-51`

## Findings
### P1, Correctness
- **F011**: Import policy and handler-cycle tooling explicitly account for the nested `runtime/cli` layout. The AST checker uses `SCRIPTS_ROOT = path.resolve(moduleDir, '..')`, and handler candidates distinguish source `../../handlers` from compiled `../../../runtime/handlers`. No new relative-import defect is established from direct inspection.

### P2, Maintainability
- **F012**: `runtime/api/index.ts:4-8,12,30,43` still describes consumers as `scripts/` and refers to `scripts/spec-folder` and `scripts/core`, while the public package consumer is `runtime/cli`. This comment-level drift weakens the boundary documentation but does not change imports.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | pass | hard | `import-policy-rules.ts:22-31`; `check-handler-cycles-ast.ts:21-29` | Nested layout handling is explicit. |
| checklist_evidence | partial | hard | `implementation-summary.md:89-117` | The summary describes direction flips, but no command replay is possible here. |

## Assessment
- New findings ratio: 0.40
- Dimensions addressed: correctness, maintainability
- Novelty justification: import and root-resolution logic was confirmed; only public API prose residue was admitted.

## Ruled Out
- Bare `../lib` policy false-positive: ruled out by the documented two-level escape rule and explicit regex at `import-policy-rules.ts:22-31`.
- Handler root doubled-runtime path: ruled out by current source and compiled candidates at `check-handler-cycles-ast.ts:21-29`.

## Recommended Next Focus
Review CI workflows, hook/plugin consumers, runtime mirrors and generated command assets for stale external references.

Review verdict: PASS
