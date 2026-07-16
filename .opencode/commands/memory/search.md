---
description: Unified continuity retrieval: spec-doc search, baselines, memory causal graph, ablations, dashboards.
argument-hint: "<query> [--intent <type>|--intent=<type>] | preflight <specFolder> <taskId> | postflight <specFolder> <taskId> | history <specFolder> | causal <memoryId> | link <sourceId> <targetId> <relation> | unlink <edgeId> | causal-stats | ablation | dashboard"
allowed-tools: Read, mcp__mk_spec_memory__memory_context, mcp__mk_spec_memory__memory_quick_search, mcp__mk_spec_memory__memory_search, mcp__mk_spec_memory__memory_match_triggers, mcp__mk_spec_memory__task_preflight, mcp__mk_spec_memory__task_postflight, mcp__mk_spec_memory__memory_drift_why, mcp__mk_spec_memory__memory_causal_link, mcp__mk_spec_memory__memory_causal_stats, mcp__mk_spec_memory__memory_causal_unlink, mcp__mk_spec_memory__eval_run_ablation, mcp__mk_spec_memory__eval_reporting_dashboard, mcp__mk_spec_memory__memory_get_learning_history, mcp__mk_code_index__code_graph_query, mcp__mk_code_index__code_graph_context
---

# /memory:search

Thin router for memory retrieval and analysis.

## 1. ROUTER CONTRACT

> **Contract register (COSTAR).** This contract is written objective-first for an automated-pipeline audience: a fixed response shape, no preamble, no conversational framing inside the rendered block. Weak instruction-followers tolerate this register best, so it is the contract's own wording style — not a prompt framework imposed on callers, and not a single global framework applied to every command.

Argument resolution (deterministic, read this first). The shell line below is evaluated before you read any policy. It is the ground truth for this invocation. The renderer substitutes the raw query text where `$ARGUMENTS` appears as one positional argument after `--`, so the wrapper treats shell metacharacters in the query (`*`, `$(…)`, backticks, `;`, `|`) as literal query text. The wrapper then joins the provided positional argument into one string and reports whether any argument was supplied.

!`bash -c 'if [ "$#" -gt 0 ]; then q="$*"; q="${q//\"/\\\"}"; printf "ARGS_PRESENT=true\nQUERY=\"%s\"\n" "$q"; else printf "ARGS_PRESENT=false\nQUERY=\"\"\n"; fi' -- '$ARGUMENTS'`

Bind your control flow to the two values above — never re-derive arg-presence from your own reading of the prompt:

- **When `ARGS_PRESENT=true`: you MUST execute retrieval (or the analysis route) on `QUERY` now.** Do NOT ask the startup question, and do NOT treat a populated `QUERY` as empty. Go to the retrieval route in §4 EXECUTION TARGETS, or the analysis route in §4 EXECUTION TARGETS when the first token of `QUERY` is a known analysis subcommand.
- **ONLY IF `ARGS_PRESENT=false`:** follow startup routing in §3 MODE ROUTING and ask the one open-ended question.

Guardrails:
- Do not infer a query from prior conversation when `ARGS_PRESENT=false`; ask the open-ended startup question.
- Ask targeted follow-up questions only when the query is genuinely ambiguous.
- Do not display the old option dump at startup.
- Do not use forbidden memory/result labels listed in the presentation asset.
- Do not open raw SQLite or edit memory DB files.
- This is a direct-dispatch command with no workflow YAML by design; do not create or modify workflow YAML from this command.

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation | `.opencode/commands/memory/assets/search_presentation.txt` |

This is a direct-dispatch command: it routes straight to the memory and code-graph MCP tools and owns no workflow YAML by design. There is no `_auto`/`_confirm` workflow YAML for the memory family and none is missing.

Before asking startup questions or displaying results, read the presentation asset and use it as the display source of truth.

## 3. MODE ROUTING

Execution order:

1. Read the §1 ROUTER CONTRACT argument-resolution output: `ARGS_PRESENT` and `QUERY` are already computed for you.
2. Read `.opencode/commands/memory/assets/search_presentation.txt` before rendering any response.
3. **If `ARGS_PRESENT=true`:** route `QUERY` to the retrieval route (§4 EXECUTION TARGETS), or to the analysis route (§4 EXECUTION TARGETS) when the first token of `QUERY` is a known analysis subcommand. Execute now — do NOT ask the startup question.
4. **ONLY IF `ARGS_PRESENT=false`:** follow startup routing (below) and ask the one open-ended question.
5. Render the response from the presentation contract; retrieval results must use the inline contract in §4 EXECUTION TARGETS.

Startup routing. **Reach this ONLY IF `ARGS_PRESENT=false`.** A populated `QUERY` never reaches here — if `ARGS_PRESENT=true`, you already executed the retrieval or analysis route in §4 EXECUTION TARGETS. When `ARGS_PRESENT=false`, ask one open-ended question from the presentation asset. Do not dump the full intent/menu list at startup. Treat a custom answer as the retrieval query.

## 4. EXECUTION TARGETS

### Retrieval route

Enter this route when `ARGS_PRESENT=true` and `QUERY` is not an analysis subcommand. Parse an optional `--intent <type>` or `--intent=<type>` from `QUERY`; otherwise let the server or local router infer intent from the query.

1. Extract `query` (the resolved `QUERY`) and optional intent override.
2. Prefer `memory_context({ input: query, mode: "auto", intent, limit: 10, enableDedup: true })`.
3. Use `memory_quick_search` for fast query-only fallback.
4. Use `memory_search` only when fine-grained search parameters are needed.
5. Use `memory_match_triggers` as a supplemental fallback, not as a replacement for direct retrieval.
6. For structural code questions, use the stable code-graph tools before semantic or lexical memory channels when available.
7. Render compact, parseable output using the presentation asset and the contract below.

MUST emit exactly this shape for retrieval results:

```text
MEMORY:SEARCH "<query>" intent=<detected_intent> results=<count>
--------------------------------------------------
<specFolder>/
  <score>  #<id>  <title>
  <score>  #<id>  <title>

<specFolder>/
  <score>  #<id>  <title>

STATUS=OK RESULTS=<count> INTENT=<detected_intent>
```

Core-slot mandate: every retrieval response MUST render all five core slots — (1) the query echo `"<query>"`, (2) the `<score>` similarity, (3) `#<id>`, (4) `<title>`, and (5) the `STATUS` footer carrying `RESULTS` and `INTENT`. None is optional; the only exception is an empty result set, which uses the empty-result fallback in the presentation asset.

Score mandate — one score, one scale, one name: `<score>` is `similarity` on a 0–1 scale rendered to two decimals (`0.79`), and it is the SOLE ranking metric per row. Never render `confidence`, and never render a percentage — divide any percentage-scaled value by 100 before emitting (`79.44` → `0.79`). Do not add a second ranking number under any other name.

Arg-echo rule: the query echoed in `"<query>"` MUST equal the resolved `QUERY`. A mismatch means the query was dropped — re-emit with `QUERY`.

Surface-parity clause: the five core slots and the similarity 0–1 / two-decimal scale are mandatory when this command contract is loaded through `--command` dispatch or another route that explicitly reads the presentation asset. Raw one-shot natural-language prompts that bypass this command contract cannot guarantee the same render policy. Conversational phrasing may wrap the block in prose, but once this contract is loaded the core field set, field names, and scale never change.

Verdict render slots: `requestQuality` and `citationPolicy` are the only sanctioned extras beyond the core slots. When present, render each as a named trailing field per the presentation asset, never as an unnamed, renamed, or ad-hoc metric, and their presence must be unambiguous.

Under the default contract their absence is valid. `SPECKIT_ENVELOPE_FIDELITY` is default-ON; set it to `false`, `0`, or `off` to opt out. When enabled, the two fields become conditionally-mandatory render slots, required-when-present: a verdict field the tool response carries MUST appear unaltered in the rendered block, and the tool ships a ready-to-paste `data.envelopeRender` fragment the render pastes verbatim instead of transcribing the fields.

Self-check: before finishing, verify the emitted block includes the `MEMORY:SEARCH` header, all five core slots, and the `STATUS` footer, and that no row carries `confidence` or a percentage score. When envelope fidelity is enabled, also verify that every verdict field the tool response carries (`requestQuality` and `citationPolicy`) is present in the rendered block, and re-emit from `data.envelopeRender` any verdict field the tool shipped but the render dropped.

Supported intents:
- `add_feature`
- `fix_bug`
- `refactor`
- `security_audit`
- `understand`
- `find_spec`
- `find_decision`

### Analysis route

Enter this route when `ARGS_PRESENT=true` and the first token of `QUERY` is one of the analysis subcommands below.

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
| `ablation` | `eval_run_ablation` | Run enabled channel ablation through the eval harness. The active DB lets the harness reject a cold or incomplete golden-set vector index before scoring. |
| `dashboard` | `eval_reporting_dashboard` | Show stored eval snapshot trends and channel metrics. Stored ablation runs carry the diagnostic gate-verdict, calibration and cold-lane payload in baseline metadata. |

`ablation` invokes `eval_run_ablation` with the active DB and diagnostic snapshots enabled. It may fail before scoring when the coverage guard finds golden-set parent embeddings below the threshold. The recovery is corpus reindex plus embedding reconcile, then the ground-truth remap if alignment still drifts.

`dashboard` invokes `eval_reporting_dashboard` against stored eval snapshots. It reports persisted metric trends and channel breakdowns. C9 gate-verdict and calibration values are produced by stored ablation runs in the baseline metadata. They are not recomputed by the dashboard command.

## 5. PRESENTATION BOUNDARY

The full presentation contract lives in `.opencode/commands/memory/assets/search_presentation.txt`. This router may only inline the compressed retrieval result shape above as a hard render reminder.

The following content must come from the presentation asset, not from router prose:

- Empty-argument startup question and targeted follow-up wording.
- Analysis overview, preflight, postflight, history, causal, link, unlink, causal-stats, ablation, dashboard, empty-result, and error displays.
- Forbidden vocabulary, result labels, fallback labels, examples, and recovery text.
- Verdict render-slot placement, exact field names (`requestQuality` and `citationPolicy`), the conditionally-mandatory required-when-present rule, and the `data.envelopeRender` paste fragment.

## 6. WORKFLOW SUMMARY

The router binds control flow to the deterministic `ARGS_PRESENT`/`QUERY` resolution: with arguments present it dispatches the retrieval route (memory context/search tools plus code-graph tools, rendered through the fixed five-core-slot contract) or the analysis route (preflight, postflight, history, causal, link, unlink, causal-stats, ablation, dashboard) when the first token is a known subcommand; with no arguments it asks the one open-ended startup question. Every user-facing string renders through the presentation asset. It is a direct-dispatch command with no workflow YAML by design.

Related commands: `/memory:save` (save conversation context); `/memory:manage` (database management, checkpoints, ingest, retention, and health); `/memory:learn` (constitutional rules); `/speckit:resume` (session recovery and continuation).
