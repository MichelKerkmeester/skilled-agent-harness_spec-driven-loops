# Resource Map: End-User Scope Default Research

## Summary

- Total references: 39
- Missing on disk: 0
- Scope: files investigated, files created or updated by the research loop, likely implementation paths, and paths expected to remain read-only.
- Generated: 2026-05-02T11:18:20Z

## Paths Investigated

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/008-end-user-scope-default/spec.md` | Analyzed | OK | Packet framing and research questions |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/008-end-user-scope-default/research/deep-research-config.json` | Analyzed | OK | Loop settings |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/008-end-user-scope-default/research/deep-research-strategy.md` | Updated | OK | Loop strategy |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/008-end-user-scope-default/research/deep-research-state.jsonl` | Updated | OK | Iteration state |
| `.opencode/skills/sk-deep-research/SKILL.md` | Analyzed | OK | Protocol overview |
| `.opencode/skills/sk-deep-research/references/loop_protocol.md` | Analyzed | OK | Loop contract |
| `.opencode/skills/sk-deep-research/references/convergence.md` | Analyzed | OK | Stop rules |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` | Analyzed | OK | Scan entry point and pruning |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts` | Analyzed | OK | Default globs |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts` | Analyzed | OK | Candidate walk |
| `.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts` | Analyzed | OK | Scope guard |
| `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts` | Analyzed | OK | Env flag patterns |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts` | Analyzed | OK | Default-on helper behavior |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Analyzed | OK | Tool schema |
| `opencode.json` | Analyzed | OK | MCP env setup |
| `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts` | Analyzed | OK | Non-runtime gate model |
| `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.sh` | Analyzed | OK | Renderer wrapper |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts` | Analyzed | OK | Readiness and migration gap |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts` | Analyzed | OK | DB schema and row deletion |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Analyzed | OK | Skill graph and graph context wiring |
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts` | Analyzed | OK | Separate skill graph DB |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts` | Analyzed | OK | Advisor status scan |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts` | Analyzed | OK | Query readiness |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts` | Analyzed | OK | Context readiness |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/status.ts` | Analyzed | OK | Status readiness |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/ccc-reindex.ts` | Analyzed | OK | CocoIndex bridge |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/ccc-status.ts` | Analyzed | OK | CocoIndex status |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts` | Analyzed | OK | Read-only readiness |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/verify.ts` | Analyzed | OK | Verification readiness |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts` | Analyzed | OK | Startup graph summary |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/README.md` | Analyzed | OK | Existing scan docs |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts` | Analyzed | OK | Dispatch path |
| `.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts` | Analyzed | OK | Schema tests |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts` | Analyzed | OK | Default config tests |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/002-template-greenfield-redesign/decision-record.md` | Analyzed | OK | ADR-005 workflow invariance |
| `.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl` | Analyzed | OK | Ledger format reference |

## Paths Likely to Be Modified

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` | Planned | OK | Add `includeSkills` handling |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts` | Planned | OK | Add default exclude and scope option |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts` | Planned | OK | Thread opt-in through candidate walk |
| `.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts` | Planned | OK | Make code graph scope guard opt-in aware |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Planned | OK | Add `includeSkills` schema field |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts` | Planned | OK | Add scope fingerprint readiness |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/status.ts` | Planned | OK | Surface scope mismatch |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts` | Planned | OK | Surface scope mismatch in startup summary |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/README.md` | Planned | OK | Document default and opt-in |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Planned | OK | Document env opt-in |
| `.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts` | Planned | OK | Add schema case |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts` | Planned | OK | Add default exclude and opt-in cases |

## Paths to Be Deleted

| Path | Action | Status | Note |
|------|--------|--------|------|
| None | Planned | OK | Code rows are deleted from SQLite by full scan; no source files should be removed |

## Paths to Remain Unchanged

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts` | Cited | OK | Separate skill graph storage |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts` | Cited | OK | Separate advisor status path |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/ccc-reindex.ts` | Cited | OK | CocoIndex follow-up only |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/ccc-status.ts` | Cited | OK | CocoIndex follow-up only |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/002-template-greenfield-redesign/decision-record.md` | Cited | OK | ADR-005 source only |
