# Deep-Research Iteration 8 — K2.2 (regex constraints) + K2.3 (per-tool prefix redundancy)

## BINDING CONTRACT (pre-answered)

- **Gate 3**: **A) Use existing** = `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/009-cocoindex-memory-port-research/`. Do NOT ask.
- **Skill routing**: Do NOT invoke other skills. You ARE the iteration.
- **Sub-agent dispatch**: FORBIDDEN. LEAF.
- **Mode**: Execute directly.

## STATE

Iteration: 8 of 10
Answered: K2.4, K1.1, K1.2, K1.3, K1.4, K1.5, K1.6, K2.1
Remaining: **K2.2, K2.3** (this iter — bundled), K2.5
Stuck: 0

## CRITICAL CONTEXT FROM ITER-7

K2.1 revealed a **major Gemini constraint**:
- Gemini composes MCP tool FQNs as `mcp_<server>_<tool>` (single underscore separator, NOT double).
- Gemini's policy parser splits after `mcp_` so server names containing underscores are policy-ambiguous.
- Gemini sanitizes to `[a-zA-Z0-9_.\-:]` and truncates at 63 chars.

This makes our current `spec_kit_memory` already problematic for Gemini policy filtering, and any underscore-containing alternative (`mk_memory`) inherits the same issue.

## FOCUS

### Part A — K2.2: Regex/charset constraints for the proposed server name

**Question**: Does `mk_*` (e.g., `mk_memory`) survive across all 4 runtimes + known provider regex rejections (DeepSeek/Moonshot reject `:`, opencode-skills `@` issue)? If underscores are problematic on Gemini, what alternatives work cleanly?

**Investigation:**
1. Test candidate server names against Gemini's documented sanitization rule + policy-parser split-on-`mcp_` issue:
   - `mk_memory` → Gemini FQN: `mcp_mk_memory_<tool>` — POLICY-AMBIGUOUS (two underscores after `mcp_`)
   - `mk-memory` → Gemini FQN: `mcp_mk-memory_<tool>` — UNAMBIGUOUS
   - `mk` → Gemini FQN: `mcp_mk_<tool>` — UNAMBIGUOUS but very generic
   - `mkmem` → Gemini FQN: `mcp_mkmem_<tool>` — UNAMBIGUOUS, compact
2. Check Codex `.codex/config.toml` syntax: does TOML allow hyphens in `[mcp_servers.<name>]` table keys? (TOML bare keys are `[A-Za-z0-9_-]+`; hyphenated keys need quoting but work.)
3. Check Claude Code: any documented regex constraint on server names? (Memory `feedback_opencode_skills_node_modules_recursion` mentioned `@` issues; recap charset.)
4. Check OpenCode's `opencode.json`: any regex constraint on server-name keys?
5. Re-check provider-side rejections (DeepSeek/Moonshot `:` rejection, opencode-skills `@` issue) — do hyphens trigger any of these?

### Part B — K2.3: Per-tool prefix redundancy

**Question**: If server name becomes `mk_memory` (or `mk-memory`), tools like `memory_context` become `mcp__mk_memory__memory_context` — still 30+ chars and `memory_` is redundant. Options:
- (a) Keep tools as-is (`memory_context`) + rename server only → tools become `mcp__<new-server>__memory_context`.
- (b) Drop redundant `memory_` from tool names → `mcp__mk_memory__context`, `mcp__mk_memory__search`.
- (c) Shorten server to bare `mk` + keep memory_ tools → `mcp__mk__memory_context`.
- (d) Bare `mk` server + drop `memory_` → `mcp__mk__context`, `mcp__mk__search`. (Shortest, but `mk` is too generic if we ever add a `mk_code` server.)

**Investigation:**
1. List all 45 tool names from `tool-schemas.ts` (the `TOOL_DEFINITIONS` array at line 1038). Group by prefix family:
   - `memory_*` (most numerous): how many?
   - `code_graph_*`: how many?
   - `skill_graph_*`: how many?
   - `checkpoint_*`, `ccc_*`, `session_*`, `task_*`, `eval_*`, `deep_loop_graph_*`, `council_graph_*`: how many?
   - Others (`detect_changes`, `memory_index_scan` standalones): how many?
2. Per-family rename feasibility: which families would benefit from dropping their prefix, which would lose semantic clarity? (E.g., `code_graph_query` → `query` is too ambiguous if there's also `skill_graph_query`.)
3. Recommend grouping: 1 server with 45 tools, or split into multiple semantic-clustered servers (`mk_memory`, `mk_code_graph`, `mk_skill_graph`)?

## ANALYSIS DELIVERABLE

**K2.2 recommendation:** server-name candidate matrix + recommended choice.

| Candidate | Claude Code | OpenCode | Codex | Gemini policy | Provider regex | Chars saved/tool |
|-----------|-------------|----------|-------|---------------|----------------|------------------|
| `spec_kit_memory` (current) | OK | OK | OK | AMBIGUOUS | OK | 0 (baseline) |
| `mk_memory` | OK | OK | OK | AMBIGUOUS | OK | 6 |
| `mk-memory` | ? | ? | ? | OK | ? | 6 |
| `mk` | OK | OK | OK | OK | OK | 13 |
| `mkmem` | OK | OK | OK | OK | OK | 10 |

**K2.3 recommendation:** tool-rename matrix + recommendation.

| Approach | Example | Tools to rename | Risk |
|----------|---------|-----------------|------|
| (a) Server-only | `mcp__mk__memory_context` | 0 | Lowest churn |
| (b) Drop `memory_` from memory tools | `mcp__mk__context` | ~15 | Medium |
| (d) Split into multiple servers + drop prefixes | `mcp__mk-memory__context`, `mcp__mk-graph__query` | All 45 | Highest churn, cleanest result |

**Final verdict (K2.2 + K2.3 combined):** recommended path (server name + tool-naming convention + grouping).

## CONSTRAINTS

- LEAF. Max 12 tool calls. Cite file:line.
- No special regex chars in JSONL `focus`.

## OUTPUT CONTRACT

1. `research/iterations/iteration-008.md` — Focus, Actions Taken, Part A (K2.2), Part B (K2.3), Combined Verdict + Recommendation, Questions Answered, Questions Remaining, Next Focus (K2.5 synthesis).

2. JSONL appended `{"type":"iteration","iteration":8,...,"focus":"k2-2-regex-constraints-and-k2-3-prefix-redundancy",...,"answeredQuestions":["K2.2","K2.3"]}`.

3. `research/deltas/iter-008.jsonl`.

Stop: 10 min wall, ≤12 tool calls.

Go.
