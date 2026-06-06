---
title: "/memory:search command routing"
description: "The /memory:search command routes no-args invocations to an interactive intent prompt, query text to retrieval mode with intent detection, and analysis subcommands to dedicated tools per a first-token routing table."
trigger_phrases:
  - "/memory:search command routing"
  - "memory search command"
  - "first-token routing"
  - "memory search subcommand dispatch"
---

# /memory:search command routing

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`/memory:search` is the operator entry point for retrieval and analysis tooling. Its routing layer dispatches on the first token of the argument string. No arguments triggers an interactive intent prompt covering add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision, and analysis tools. A free-form query triggers retrieval mode with auto-detected intent weighting. A recognized analysis subcommand routes to a dedicated tool such as preflight, postflight, history, causal, link, unlink, causal-stats, ablation, or dashboard.

Routing keeps the retrieval and analysis surfaces discoverable from a single entry point and gives operators predictable behavior across long-running session work.

---

## 2. HOW IT WORKS

The command file under `.opencode/commands/memory/search.md` defines the routing contract. Argument parsing is first-token oriented: a recognized analysis verb invokes its specific tool, an explicit `--intent:<name>` flag overrides auto-detection, and any other input is treated as a retrieval query. Intent detection applies multiplicative weight boosts to implementation, architecture, and pattern channels for the `add_feature` intent and equivalent boosts for the other intent labels.

- No-args path: interactive intent menu, then dispatch to retrieval with the chosen intent
- Retrieval path: `memory_search` with auto or explicit intent weighting
- Analysis path: dedicated tools (`task_preflight`, `task_postflight`, `memory_get_learning_history`, `memory_drift_why`, `memory_causal_link`, `memory_causal_unlink`, `memory_causal_stats`, `eval_run_ablation`, `eval_reporting_dashboard`)

The retrieval and analysis tools are owned by `mcp_server` handlers; the command layer is responsible only for argument routing and intent resolution.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/commands/memory/search.md` | Command | First-token routing logic, intent detection keywords, analysis-subcommand table |
| `mcp_server/handlers/memory-search.ts` | Handler | Retrieval implementation invoked for query mode |
| `mcp_server/handlers/memory-causal.ts` | Handler | Causal analysis tools invoked from the analysis subcommands |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/memory/memory-search-command-routing.vitest.ts` | Automated test | First-token routing, intent override, and subcommand dispatch coverage |

---

## 4. SOURCE METADATA
- Group: Retrieval
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--retrieval/memory-search-command-routing.md`
Related references:
- [bounded-graph-diagnostics.md](bounded-graph-diagnostics.md) — Bounded graph diagnostics
