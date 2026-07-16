# Review Resource Map

## Scope
Generated from the codex-1 deep-review deltas. The target spec did not contain an input `resource-map.md`, so this map records reviewed implementation evidence rather than a source-map coverage gate.

## Reviewed Surfaces
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`
- `.opencode/skills/deep-review/scripts/reduce-state.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts`
- `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts`
- `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts`
- `.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts`

## Finding Coverage
| Finding | Evidence Path | Category |
|---|---|---|
| F001 | `.opencode/skills/deep-review/scripts/reduce-state.cjs:1673` | fanout-artifact-routing |
| F002 | `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344` | fanout-concurrency |
| F003 | `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:154` | executor-config |
| F004 | `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:177` | executor-contract |
| F005 | `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:348` | executor-recursion-guard |
| F006 | `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:83` | sandbox-scope |
| F007 | `.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:7` | comment-hygiene |

## Phase-5 Augmentation
- Novel logic gaps: reducer artifact-dir override mismatch; fanout-run synchronous worker; fanout-run executor guard bypass.
- Empty-result cases: no code-graph or skill-advisor public tool ID drift found.
