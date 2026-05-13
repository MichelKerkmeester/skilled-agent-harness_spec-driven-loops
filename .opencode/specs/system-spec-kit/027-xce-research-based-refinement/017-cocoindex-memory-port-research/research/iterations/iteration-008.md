# Iteration 008 - K2.2 regex constraints and K2.3 prefix redundancy

## Focus

This iteration answers the bundled namespace questions left by iteration 7.

K2.2 asks whether `mk_*`-style MCP server shortening survives the four local runtime config surfaces plus known provider tool-name regex failures. The binding wrinkle is Gemini: it composes MCP FQNs as `mcp_<server>_<tool>`, and its policy parser misreads server aliases containing underscores.

K2.3 asks whether shortening the server name should also remove redundant per-tool prefixes such as `memory_` from `memory_context`.

## Actions Taken

- Re-read the iteration 7 namespace result and the iteration 8 prompt.
- Read the local runtime config keys for Claude Code, OpenCode, Codex, and Gemini.
- Re-read `tool-schemas.ts` around raw tool-name definitions and the `TOOL_DEFINITIONS` aggregation.
- Counted current MCP tool-name families from the live source. The prompt's "45 tools" figure is stale; the current aggregate has 59 registrations when the four imported advisor tools are included.
- Checked prior local provider-regex evidence for DeepSeek-family rejection of `:` and `@`-related skill/tool-name risk.
- Checked the current TOML and Gemini public docs for hyphen and underscore behavior.

## Part A - K2.2 Regex and Charset Constraints

Iteration 7 already established that our MCP server defines raw tool names without host prefixes: `ToolDefinition.name` is a plain string (`.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:35-39`), with examples such as `memory_context` and `memory_search` (`.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:47-56`). The configured server alias is what hosts fold into their visible tool names.

The local runtime keys are all JSON/TOML object or table keys today: Claude Code registers `mcpServers.spec_kit_memory` (`.claude/mcp.json:1-15`), OpenCode registers `mcp.spec_kit_memory` (`opencode.json:10-24`), Codex registers `[mcp_servers.spec_kit_memory]` (`.codex/config.toml:9-13`), and Gemini registers `mcpServers.spec_kit_memory` (`.gemini/settings.json:17-49`). Those config surfaces can all represent hyphenated aliases as strings or keys. For Codex specifically, TOML 1.0 bare keys allow ASCII letters, digits, underscores, and dashes, so `[mcp_servers.mk-memory]` does not need quoting by TOML syntax. Source: TOML v1.0.0 keys section, `https://toml.io/en/v1.0.0`.

Gemini is the tightest host constraint. Its current docs say names are sanitized to letters, numbers, underscore, hyphen, dot, and colon, truncated beyond 63 characters, and every MCP tool receives `mcp_{serverName}_{toolName}`. The same docs warn not to use underscores in MCP server names because policy parsing splits after the `mcp_` prefix. Source: Gemini CLI MCP docs, `https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md`; this matches iteration 7's recorded finding (`research/iterations/iteration-007.md:63-72`).

Provider-side regex evidence points the same way: avoid colon and at-sign, but hyphen is inside the known safe class. The research scope names the known hazards as DeepSeek/Moonshot `:` rejection and an opencode-skills `@` issue (`spec.md:123-125`; `research/deep-research-strategy.md:36`). A prior DeepSeek smoke recorded the provider pattern as `^[a-zA-Z0-9_-]+$`, rejecting tool names with `:` (`.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/007-track-rereview/plan.md:50-51`, `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/007-track-rereview/review/iterations/iteration-001.md:140-146`). Another packet records `:` or `@` risk for DeepSeek tool-name regex (`.opencode/specs/skilled-agent-orchestration/102-sk-doc-skill-readme-and-structure/004-sk-doc-playbook-markdown-agent-coverage/spec.md:133`). None of those constraints reject hyphen.

### Candidate Matrix

| Candidate | Claude Code | OpenCode | Codex | Gemini policy | Provider regex | Chars saved/tool | Verdict |
| --- | --- | --- | --- | --- | --- | ---: | --- |
| `spec_kit_memory` | OK locally | OK locally | OK locally | AMBIGUOUS | OK | 0 | Current name works operationally but is policy-ambiguous in Gemini. |
| `mk_memory` | OK locally | OK locally | OK locally | AMBIGUOUS | OK | 6 | Better length, still inherits the Gemini underscore failure. |
| `mk-memory` | OK by JSON key/TOML key syntax | OK by JSON key syntax | OK by TOML key syntax | OK | OK | 6 | Best semantic short alias if we want a named memory server. |
| `mk` | OK | OK | OK | OK | OK | 13 | Shortest stable alias, but too generic for future `mk-code` or `mk-graph` siblings. |
| `mkmem` | OK | OK | OK | OK | OK | 10 | Compact and safe, but less readable than `mk-memory`. |

K2.2 recommendation: do not choose `mk_memory`. The clean candidates are `mk-memory`, `mkmem`, and `mk`. I would choose `mk-memory` for a single memory server because it avoids Gemini policy ambiguity while preserving enough semantic meaning. If token length dominates over readability, `mkmem` is the compact alternative. I would reserve bare `mk` only if the long-term plan is a single permanent server, because it consumes the root namespace.

## Part B - K2.3 Per-Tool Prefix Redundancy

The prompt says "45 tool names", but the live source has moved. `TOOL_DEFINITIONS` currently aggregates 59 registrations: the local block starts at `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:1038` and runs through `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:1110`, including four imported advisor tools at `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:1092-1095`. Those imported advisor tool descriptors define `advisor_recommend`, `advisor_rebuild`, `advisor_status`, and `advisor_validate` in `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tools/advisor-recommend.ts:25-26`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tools/advisor-rebuild.ts:8-9`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tools/advisor-status.ts:7-8`, and `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tools/advisor-validate.ts:16-17`.

Current prefix-family counts:

| Family | Count | Notes |
| --- | ---: | --- |
| `memory_*` | 22 | Biggest family; prefix is partly redundant under a memory-only server. |
| `code_graph_*` | 6 | Prefix carries essential domain meaning because `query`, `status`, and `context` would collide semantically. |
| `skill_graph_*` | 4 | Same reason as code graph; dropping to `query` or `status` would be ambiguous. |
| `checkpoint_*` | 4 | Could be shorter under a checkpoint server, but not under one mixed server. |
| `ccc_*` | 3 | Already compact; "ccc" is less discoverable but short. |
| `session_*` | 3 | Useful distinction from memory context and health. |
| `task_*` | 2 | Useful distinction for preflight/postflight. |
| `eval_*` | 2 | Useful distinction for ablation/reporting. |
| `deep_loop_graph_*` | 4 | Long, but dropping to graph verbs would collide with code/skill/council graph tools. |
| `council_graph_*` | 4 | Same collision problem. |
| `advisor_*` | 4 | Separate imported skill-advisor family. |
| Other | 1 | `detect_changes`; already standalone. |

### Tool-Rename Matrix

| Approach | Example | Tools to rename | Risk |
| --- | --- | ---: | --- |
| (a) Server-only | `mcp__mk-memory__memory_context` / Gemini `mcp_mk-memory_memory_context` | 0 | Lowest churn. Fixes Gemini server-alias ambiguity if the server name uses no underscore. Keeps all raw tool names stable. |
| (b) Drop `memory_` only | `mcp__mk-memory__context` | 22 | Medium. Good savings for the largest family, but high callsite churn and some names become too generic: `list`, `stats`, `health`, `delete`, `update`, `validate`. |
| (c) Bare `mk` server, keep tools | `mcp__mk__memory_context` | 0 | Low implementation churn, but the server alias is too generic and leaves Gemini with `mcp_mk_memory_context`, which is parseable but visually close to the rejected `mk_memory` alias. |
| (d) Split servers plus drop prefixes | `mcp__mk-memory__context`, `mcp__mk-code-graph__query`, `mcp__mk-skill-graph__query` | 59 | Highest churn. Clean conceptually, but multiplies runtime config, permissions, docs, tool filters, and migration surface. |

Per-family rename feasibility is uneven. Dropping `memory_` is the only family where the prefix is truly redundant, and even there it weakens standalone meaning for mutation and diagnostic tools. Dropping `code_graph_`, `skill_graph_`, `deep_loop_graph_`, or `council_graph_` is actively harmful inside one server because `query`, `status`, `context`, `upsert`, and `convergence` repeat across families. Splitting into multiple semantic servers would make prefix removal cleaner, but it creates more host aliases and more permission policy surfaces. Given K2.4 already counted substantial migration cost, this is not a good first migration step.

K2.3 recommendation: keep raw tool names unchanged for the first namespace migration. Rename only the server alias. If a later K2.5 synthesis wants deeper cleanup, limit tool renames to a second packet after measuring actual callsite and policy churn.

## Combined Verdict and Recommendation

Recommended path: one server, renamed from `spec_kit_memory` to `mk-memory`, with all 59 raw tool names unchanged.

This choice fixes the only hard new compatibility issue found in K2.1/K2.2: Gemini policy ambiguity from underscores in the server alias. It also avoids DeepSeek/Moonshot and opencode-skills character hazards by staying within `A-Za-z0-9_-` and avoiding `:` and `@`. The cost is smaller token savings than `mk`, but the readability and future namespace room are better.

Do not choose `mk_memory`; it saves six characters but keeps the Gemini problem. Do not drop `memory_` in this pass; the surface is no longer just memory retrieval, and graph/advisor/session/eval families need their prefixes to remain intelligible under a mixed server.

## Questions Answered

- K2.2 answered: underscore-containing aliases are not clean across all four runtimes because Gemini policy parsing makes them ambiguous; `mk-memory` and `mkmem` are the best clean candidates.
- K2.3 answered: server-only rename is the right first move; per-tool prefix removal is higher churn and only partly semantically safe.

## Questions Remaining

- K2.5: final synthesis should combine K2.2/K2.3 with K2.4 migration cost and decide whether `mk-memory` is worth a straight rename now.

## Next Focus

K2.5 synthesis. The synthesis should recommend either a straight server alias rename to `mk-memory` with no raw tool-name changes, or a no-go if K2.4 callsite churn outweighs the Gemini policy and token-savings benefits.
