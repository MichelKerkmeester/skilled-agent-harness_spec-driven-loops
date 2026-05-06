# Synthesis Report - Native Rerun

## Verdict By Axis

| Axis | Sandbox verdict (001) | Native verdict (002) |
|---|---|---|
| Code graph | USEFUL | **OVERHEAD** - scope-policy, drift-detector, parser-crash, and zero-node persistence failures make it unusable for day-to-day work in non-end-user code. Index wipes on scope mismatch. |
| Hooks | MIXED | **USEFUL** - advisor probes were 3/3 correct in live MCP; both backlog items were fixed; compaction recovery formatting was confirmed. |
| Plugin/runtime integration | OVERHEAD (sandbox-bound) | **DEFERRED** - needs a separate live-runtime campaign with authenticated cli-copilot/gemini and live Claude Code/OpenCode sessions; this run only validated MCP-bridged surfaces. |

## Native Code Graph Findings

The native code graph result is worse than the sandbox result. The first `includeSkills: true` scan succeeded with 9,280 indexed files, 56,843 nodes, and 36,347 edges in 13,376 ms. The graph then failed on normal read queries because the candidate manifest had drifted. A default-scope scan returned zero nodes and persisted that empty state over the previously populated index. A later `includeSkills: true` scan did not recover.

The failure chain is the important part:

1. Broad scan succeeds.
2. Read queries block on candidate manifest drift.
3. Default-scope scan excludes the active system code and persists `totalNodes: 0`.
4. Parser crashes skip valid TypeScript files with `memory access out of bounds`.
5. Repeating the original scan flags still leaves the graph empty.

That is not a sandbox limitation. It is a native workflow failure.

## Native Hook Findings

Advisor routing is useful under native MCP. The three live probes routed correctly:

| Prompt | Top-1 | Score | Verdict |
|---|---|---:|---|
| `implement a frontend component with motion animations` | `sk-code` | 0.86 | CORRECT |
| `save context for current session` | `system-spec-kit` over `memory:save` | 0.80 / 0.70 | CORRECT |
| `create new spec folder for refactor work` | `system-spec-kit` | 0.80 | CORRECT |

Compaction recovery is partial. The native session surfaced `[SOURCE: hook-cache, cachedAt: 2026-05-05T17:46:32.487Z]` after compaction, so formatting and injection work. Relevance quality still needs a controlled trigger.

## Backlog From 001, Now Fixed

- `mcp_server/hooks/codex/session-start.ts:5`: added `--smoke` mode. Verified by `node ...session-start.js --smoke`, which returned `{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"[smoke] codex session-start hook envelope OK"}}`.
- `mcp_server/hooks/copilot/README.md:27`: added an "Offline / Unauthenticated Preflight" section. Verified by offline preflight output containing two `SPEC-KIT-COPILOT-CONTEXT` markers.

## Native-Derived Improvement Backlog

### P0

- `mcp_server/code_graph/lib/index-scope-policy.ts`: default scope excludes the system code most users will be working on. Either expand the default to include skill subdirs, or surface a clear "0 nodes indexed for your active CWD" warning at scan time so users know to add `includeSkills`.
- `mcp_server/code_graph/handlers/scan.ts`: when a scan with mismatched scope returns `totalNodes: 0`, do not persist that as the live state if a previous scan had more than zero nodes. Either reject the scan or warn loudly.
- `mcp_server/code_graph/lib/structural-indexer.ts`: 10 or more `memory access out of bounds` errors occurred on valid TypeScript files. Parser crashes silently skip files and need visible diagnostics with file:line citations from the native trial log.

### P1

- `mcp_server/code_graph/handlers/query.ts`: drift detector trips when scan scope differs from query scope. Either auto-rescan with the union scope, or fail with an actionable message such as "re-run scan with includeSkills: true".

## Recommended Day-To-Day Workflow Until Code Graph Is Fixed

Use `rg` and direct file reads for orientation and blast-radius checks. Keep using advisor/hooks for routing, because native evidence supports them. Treat code graph as a post-fix verification surface only when a fresh scan reports non-zero nodes for the active scope and read queries do not trip drift detection.

## Confidence Note

Confidence is high for the code graph verdict because the native run exercised scan, query, default-scope, and recovery paths in sequence. Confidence is high for advisor routing on the three sampled prompts, but the sample is small. Confidence is medium for compaction recovery because formatting was observed but relevance quality was not controlled. Plugin/runtime integration remains explicitly unscored by this packet.
