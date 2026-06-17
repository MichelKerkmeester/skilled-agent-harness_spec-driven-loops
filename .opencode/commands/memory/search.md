---
description: Unified continuity retrieval: spec-doc search, baselines, memory causal graph, ablations, dashboards.
argument-hint: "<query> [--intent:<type>] | preflight <specFolder> <taskId> | postflight <specFolder> <taskId> | history <specFolder> | causal <memoryId> | link <sourceId> <targetId> <relation> | unlink <edgeId> | causal-stats | ablation | dashboard"
allowed-tools: Read, mcp__mk_spec_memory__memory_context, mcp__mk_spec_memory__memory_quick_search, mcp__mk_spec_memory__memory_search, mcp__mk_spec_memory__memory_match_triggers, mcp__mk_spec_memory__task_preflight, mcp__mk_spec_memory__task_postflight, mcp__mk_spec_memory__memory_drift_why, mcp__mk_spec_memory__memory_causal_link, mcp__mk_spec_memory__memory_causal_stats, mcp__mk_spec_memory__memory_causal_unlink, mcp__mk_spec_memory__eval_run_ablation, mcp__mk_spec_memory__eval_reporting_dashboard, mcp__mk_spec_memory__memory_get_learning_history, mcp__mk_code_index__code_graph_query, mcp__mk_code_index__code_graph_context
---

# /memory:search

Thin router for memory retrieval and analysis.

## 0. ARGUMENT RESOLUTION (deterministic — read this first)

The shell line below is evaluated before you read any policy. It is the ground truth for this invocation. The `bash -c` wrapper joins every `$ARGUMENTS` word into one string (the injection expands `$ARGUMENTS` like `"$@"`, one word per argument, so the renderer must join argv itself) and reports whether any argument was supplied.

!`bash -c 'if [ "$#" -gt 0 ]; then q="$*"; q="${q//\"/\\\"}"; printf "ARGS_PRESENT=true\nQUERY=\"%s\"\n" "$q"; else printf "ARGS_PRESENT=false\nQUERY=\"\"\n"; fi' -- $ARGUMENTS`

Bind your control flow to the two values above — never re-derive arg-presence from your own reading of the prompt:

- **When `ARGS_PRESENT=true`: you MUST execute retrieval (or the analysis route) on `QUERY` now.** Do NOT ask the startup question, and do NOT treat a populated `QUERY` as empty. Go to §3 RETRIEVAL MODE, or §4 ANALYSIS MODE when the first token of `QUERY` is a known analysis subcommand.
- **ONLY IF `ARGS_PRESENT=false`:** go to §5 STARTUP ROUTING and ask the one open-ended question.

## 1. ROUTING ASSETS

| Asset | Path | Status | Purpose |
| --- | --- | --- | --- |
| Workflow | _No memory workflow YAML exists in this checkout_ | Missing upstream asset | Keep retrieval and analysis routing in this file until a workflow YAML is introduced by a separate workflow-asset change. Do not invent or edit YAML from this command. |
| Presentation | `.opencode/commands/memory/assets/search_presentation.txt` | Required | Startup question policy, analysis overview, result tables, empty-result fallback, and clean GPT-via-opencode display rules. |

Before asking startup questions or displaying results, read the presentation asset and use it as the display source of truth.

## 2. EXECUTION ORDER

1. Read the §0 ARGUMENT RESOLUTION header output: `ARGS_PRESENT` and `QUERY` are already computed for you.
2. Read `.opencode/commands/memory/assets/search_presentation.txt` before rendering any response.
3. **If `ARGS_PRESENT=true`:** route `QUERY` to retrieval mode (§3), or to analysis mode (§4) when the first token of `QUERY` is a known analysis subcommand. Execute now — do NOT ask the startup question.
4. **ONLY IF `ARGS_PRESENT=false`:** go to startup routing (§5) and ask the one open-ended question.
5. Render the response from the presentation contract; retrieval results must use the inline contract below.

## 3. RETRIEVAL MODE

Enter this mode when `ARGS_PRESENT=true` and `QUERY` is not an analysis subcommand. Parse an optional `--intent:<type>` from `QUERY`; otherwise let the server or local router infer intent from the query.

1. Extract `query` (the resolved `QUERY`) and optional intent override.
2. Prefer `memory_context({ input: query, mode: "auto", intent, includeContent: true, enableDedup: true })`.
3. Use `memory_quick_search` for fast query-only fallback.
4. Use `memory_search` only when fine-grained search parameters are needed.
5. Use `memory_match_triggers` as a supplemental fallback, not as a replacement for direct retrieval.
6. For structural code questions, use the stable code-graph tools before semantic or lexical memory channels when available.
7. Render compact, parseable output using the presentation asset and the contract below.

MUST emit exactly this shape for retrieval results:

```text
MEMORY:SEARCH "<query>" intent=<detected_intent> results=<count>
--------------------------------------------------
<leaf-folder>/
  <score>  #<id>  <title>
  <score>  #<id>  <title>

<leaf-folder>/
  <score>  #<id>  <title>

STATUS=OK RESULTS=<count> INTENT=<detected_intent>
```

Arg-echo rule: the query echoed in `"<query>"` MUST equal the resolved `QUERY`. A mismatch means the query was dropped — re-emit with `QUERY`.

Slot rule: `<score>` is the 0–1 similarity rendered to two decimals (`0.79`, never `79.44` — divide percentage-scaled scores by 100).

Self-check: before finishing, verify the emitted block includes the `MEMORY:SEARCH` header and `STATUS` footer.

Supported intents:
- `add_feature`
- `fix_bug`
- `refactor`
- `security_audit`
- `understand`
- `find_spec`
- `find_decision`

## 4. ANALYSIS MODE

Enter this mode when `ARGS_PRESENT=true` and the first token of `QUERY` is one of the analysis subcommands below.

Known analysis subcommands:
- `preflight`
- `postflight`
- `history`
- `causal`
- `link`
- `unlink`
- `causal-stats`
- `ablation`
- `dashboard`

| Subcommand | Tool | Purpose |
| --- | --- | --- |
| `preflight <specFolder> <taskId>` | `task_preflight` | Capture epistemic baseline. |
| `postflight <specFolder> <taskId>` | `task_postflight` | Capture learning delta. |
| `history <specFolder>` | `memory_get_learning_history` | Show learning cycles. |
| `causal <memoryId>` | `memory_drift_why` | Trace decision lineage. |
| `link <sourceId> <targetId> <relation>` | `memory_causal_link` | Create causal relation. |
| `unlink <edgeId>` | `memory_causal_unlink` | Remove causal relation. |
| `causal-stats` | `memory_causal_stats` | Show graph coverage. |
| `ablation` | `eval_run_ablation` | Run channel ablation when enabled. |
| `dashboard` | `eval_reporting_dashboard` | Show evaluation trends. |

## 5. STARTUP ROUTING

**Reach this section ONLY IF `ARGS_PRESENT=false`.** A populated `QUERY` never reaches here — if `ARGS_PRESENT=true`, you already executed §3 or §4.

When `ARGS_PRESENT=false`, ask one open-ended question from the presentation asset. Do not dump the full intent/menu list at startup. Treat a custom answer as the retrieval query.

## 6. HARD RULES

- Do not infer a query from prior conversation when `ARGS_PRESENT=false`; ask the open-ended startup question.
- Ask targeted follow-up questions only when the query is genuinely ambiguous.
- Do not display the old option dump at startup.
- Do not use forbidden memory/result labels listed in the presentation asset.
- Do not open raw SQLite or edit memory DB files.
- Do not create or modify workflow YAML from this command.

## 7. PRESENTATION BOUNDARY

The full presentation contract lives in `.opencode/commands/memory/assets/search_presentation.txt`. This router may only inline the compressed retrieval result shape above as a hard render reminder.

The following content must come from the presentation asset, not from router prose:

- Empty-argument startup question and targeted follow-up wording.
- Analysis overview, preflight, postflight, history, causal, link, unlink, causal-stats, ablation, dashboard, empty-result, and error displays.
- Forbidden vocabulary, result labels, fallback labels, examples, and recovery text.

## 8. RELATED COMMANDS

- `/memory:save`: Save conversation context.
- `/memory:manage`: Database management, checkpoints, ingest, retention, and health.
- `/memory:learn`: Constitutional rules.
- `/speckit:resume`: Session recovery and continuation.
