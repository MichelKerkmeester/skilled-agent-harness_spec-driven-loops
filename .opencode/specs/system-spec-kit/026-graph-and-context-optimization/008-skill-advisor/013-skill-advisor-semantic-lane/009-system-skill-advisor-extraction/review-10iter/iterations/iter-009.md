# iter-009 — MAINTAINABILITY

**Dimension**: Maintainability — Code conventions (sk-code), naming consistency, doc/spec alignment, tech debt
**Date**: 2026-05-15
**Files Reviewed**: skill-graph-tools.ts, types.ts, all 4 skill-graph handlers, skill_advisor.py, advisor-server.ts, index.ts, plugin bridge

## Findings

| ID | Severity | Title | Location | Category |
|----|----------|-------|----------|----------|
| M-001 | P2 | Parent `handover.md` has grown to 588 lines with append-only updates — early sections contain stale status | `013/009/handover.md` | maintainability/doc-drift |
| M-002 | P2 | Parent `spec.md` `_memory.continuity.completion_pct: 0` disagrees with actual 100% completion | `013/009/spec.md:27` | maintainability/metadata-drift |
| M-003 | P2 | Dual dispatch tool registration across two `dispatchTool` and `TOOL_DEFINITIONS` in two modules | `advisor-server.ts` + `tools/index.ts` | maintainability/duplication |

## Analysis

### Code conventions: CLEAN

The advisor package follows consistent conventions throughout:
- **Module header**: Every file has `// ─── MODULE: Name ───` comment block
- **Handler naming**: `export async function handleXxx(args)` — consistent camelCase
- **Schema validation**: Zod schemas used throughout
- **Type exports**: `export interface`, `export type` patterns consistent
- **Response shape**: `{ content: Array<{ type: string; text: string }> }` normalized via `HandlerResponse` type alias
- **Tool definitions**: `ToolDefinition` interface with `name`, `description`, `inputSchema` — consistent across all 8 tools
- **Error handling**: Try/catch with `error instanceof Error ? error.message : String(error)` — normalized

### Tech debt: ZERO

Grep for `TODO`, `FIXME`, `HACK`, `XXX`, `DEPRECATED` across all advisor source code returned **zero results**. No lingering deprecation markers, no hack comments, no deferred TODOs.

### Doc/spec alignment: MINOR DRIFT

M-001: `handover.md` is the most notable maintainability concern. It has grown to 588 lines across 10 appended sections. Section 1 ("When to use this handover") still shows the early-session status ("60 vitest + hook smoke failures block 'complete' claim") while sections 6-10 document that both were resolved. This is an append-only handover pattern where early sections are snapshots and later sections update reality. No data is technically wrong when reading chronologically, but the early-session snapshot at the top could mislead a quick reader.

M-002: `spec.md:27` shows `completion_pct: 0` while the entire 16-child extraction line completed at 100%. The frontmatter metadata was never updated from the initial scaffold state.

### Naming consistency: STRONG

- All 8 public tool ids stable across the 015 rename: `advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate`
- Server id: `mk_skill_advisor` (consistent across all 4 runtime configs and `advisor-server.ts`)
- Package folder: `system-skill-advisor` (kebab-case, matches skill convention)
- Launcher: `mk-skill-advisor-launcher.cjs` (kebab-case binary name)
- State file: `.mk-skill-advisor-launcher.json` (prefixed dotfile)

## Verdict: PASS with 3 P2 advisories
