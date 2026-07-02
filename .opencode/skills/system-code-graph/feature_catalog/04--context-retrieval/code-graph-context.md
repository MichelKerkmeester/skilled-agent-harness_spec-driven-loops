---
title: "code_graph_context"
description: "LLM-oriented context retrieval surface that expands seeds into compact graph neighborhoods while preserving readiness and partial-output metadata."
trigger_phrases:
  - "code_graph_context"
  - "system-code-graph feature catalog"
importance_tier: "important"
version: 1.2.0.14
---

# code_graph_context

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`code_graph_context` returns compact structural neighborhoods for LLM use. It accepts manual, graph and Code Graph seeds and embeds readiness metadata in both success and blocked responses.

## 2. HOW IT WORKS

### Trigger / Auto-Fire Path

Manual tool call only. `code_graph_context` auto-fire is half because readiness work happens only after requested dispatch.

### Class

half. The tool self-checks readiness on invocation. No ambient hook calls it automatically.

### Caveats / Fallback

Blocked responses omit graph answers. Follow `requiredAction:"code_graph_scan"` or use semantic search plus `rg`.

Debug callers can pass `includeTrace:true` to request `graphContext[].why_included` breadcrumbs. Each breadcrumb now carries `edgeChain`, a sequence of one-or-more call/import/export edge steps (not a single one-hop edge) describing the full inclusion path from anchor to the included file, each step with its own confidence, provenance, evidence class, reason and step label. `confidence` on the breadcrumb itself is the minimum confidence across every step in the chain, and `ambiguous` is set if any step in the chain has an `INFERRED` or `AMBIGUOUS` evidence class. For most anchors/sections `edgeChain` holds a single one-hop step, matching prior behavior. When the default-off `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` flag is on and `queryMode` is `"impact"`, ranked candidates are instead selected by a bounded seeded Personalized PageRank walk (up to 3 hops), and `edgeChain` reconstructs the real multi-hop path back to the anchor using a lazily-loaded weighted-walk traversal (`predecessor` field) shared with the spec-kit memory graph. Default responses omit `why_included` to preserve the compact response shape. See [`../09--edge-confidence-and-provenance/seeded-ppr-impact-ranking.md`](../09--edge-confidence-and-provenance/seeded-ppr-impact-ranking.md) for the flag, the lazy-loaded walker and the benchmark verdict (CUT stands, not intended to ship enabled), and [`../09--edge-confidence-and-provenance/edge-evidence-classification.md`](../09--edge-confidence-and-provenance/edge-evidence-classification.md) for how each step's confidence/evidence-class is normalized.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:154-169` | Handler | runs read-path readiness with selective indexing allowed and full scans suppressed |
| `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:184-229` | Handler | returns blocked payloads with required action and fallback decision |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` | Library | emits trace-only context breadcrumbs; owns the lazy-loaded seeded-PPR walk and multi-hop `edgeChain` reconstruction |
| `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts` | Library | writes the differentiated cross-file `CALLS` confidence that `why_included` and impact ranking read back |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts:20-24` | Library | shared weighted-walk traversal; its `predecessor` field is what makes multi-hop `edgeChain` reconstruction possible |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:79-117` | Schema | defines the public schema, seed formats and blocked-read contract |
| `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:75-76` | Tool surface | dispatches the handler |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/04--context-retrieval/` | Manual Playbook | Operator-facing manual scenarios for this feature category |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts` | Automated test | trace-on and default-off breadcrumb behavior, AMBIGUOUS-class ambiguity flag, mid-session flag toggle, IMPORTS-edges-unaffected coverage |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-lazy-weighted-walk.vitest.ts` | Automated test | lazy-load behavior of the shared weighted-walk module |
| `.opencode/skills/system-code-graph/mcp_server/tests/weighted-walk-predecessor.vitest.ts` | Automated test | `predecessor` field correctness in the shared walker |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-ranking.vitest.ts` | Automated test | seeded-PPR ranking and scoring behavior |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-flag-on-path.vitest.ts` | Automated test | flag-on `impact`-mode dispatch path |

## 4. SOURCE METADATA

- Group: Context retrieval
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--context-retrieval/code-graph-context.md`

Related references:

- [02-context-handler.md](./context-handler.md)
- [../01--read-path-freshness/ensure-code-graph-ready.md](../01--read-path-freshness/ensure-code-graph-ready.md)
- [../09--edge-confidence-and-provenance/seeded-ppr-impact-ranking.md](../09--edge-confidence-and-provenance/seeded-ppr-impact-ranking.md)
- [../09--edge-confidence-and-provenance/edge-evidence-classification.md](../09--edge-confidence-and-provenance/edge-evidence-classification.md)
- [../../manual_testing_playbook/04--context-retrieval/code-graph-context-readiness-block.md](../../manual_testing_playbook/04--context-retrieval/code-graph-context-readiness-block.md)
