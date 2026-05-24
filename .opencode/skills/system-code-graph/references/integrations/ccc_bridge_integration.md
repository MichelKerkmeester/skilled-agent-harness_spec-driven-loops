---
title: "System Code Graph CCC Bridge Integration"
description: "When and how to use ccc_status / ccc_reindex / ccc_feedback alongside the CocoIndex MCP server for hybrid semantic + structural queries."
trigger_phrases:
  - "ccc_status"
  - "ccc_reindex"
  - "ccc_feedback"
  - "cocoindex bridge"
  - "hybrid semantic structural"
---

# System Code Graph CCC Bridge Integration

A primer on the three `ccc_*` tools and how they coordinate with the CocoIndex MCP server for hybrid semantic + structural workflows.

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

### Purpose

Explain the `ccc_*` bridge tools that let code-graph workflows coordinate CocoIndex lifecycle state.

### When to Use

- Checking CocoIndex availability before hybrid semantic plus structural workflows.
- Triggering CocoIndex reindexing from a code-graph automation.
- Sending feedback on semantic search result quality.

### Core Principle

`ccc_*` coordinates semantic-index lifecycle; semantic search itself still belongs to the CocoIndex skill.

### Key Sources

CocoIndex provides semantic (vector embedding) search; this skill provides structural (AST graph) queries. Many real workflows benefit from both — find conceptually related code with CocoIndex, then expand structural neighborhoods around the hits.

The three `ccc_*` tools expose CocoIndex's lifecycle (`status`, `reindex`, `feedback`) through `mk_code_index` so an agent that holds the code-graph MCP namespace can coordinate semantic and structural state without holding the CocoIndex MCP namespace separately. The actual `search` operation is **not** bridged — semantic search calls still go to `mcp__cocoindex_code__search`.

### Decision rule

- **Need a tool name only the code-graph MCP exposes?** Call `mcp__mk_code_index__ccc_*`.
- **Need semantic search results?** Call `mcp__cocoindex_code__search` directly.
- **Need hybrid (semantic seed → structural expansion)?** CocoIndex search → pass results to `code_graph_context` with `provider: "cocoindex"` seeds. No `ccc_*` call needed in the hot path.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-tools -->
## 2. THE THREE TOOLS

### `ccc_status`

| Field | Value |
|---|---|
| Purpose | Check CocoIndex availability and index state. |
| Returns | `available`, `binaryPath`, `indexExists`, `indexSize`, `recommendation`. |
| Preconditions | None. Probe is non-destructive. |
| When to use | Before any `cocoindex_code__search` from a multi-step workflow that depends on it. Lets the agent fail fast instead of mid-pipeline. |

```python
ccc_status()
returns = {available: true, binaryPath: "/usr/local/bin/ccc", indexExists: true, indexSize: 12345, recommendation: "ready"}
```

### `ccc_reindex`

| Field | Value |
|---|---|
| Purpose | Trigger CocoIndex incremental (default) or full re-index. |
| Returns | Reindex result metadata. |
| Preconditions | CocoIndex binary installed and on PATH. |
| When to use | After a large workspace change before running semantic search. Incremental is fast; full takes minutes. |

```python
ccc_reindex({full: false})  # incremental
ccc_reindex({full: true})   # full
```

### `ccc_feedback`

| Field | Value |
|---|---|
| Purpose | Submit quality feedback on a CocoIndex search result. |
| Returns | Acknowledgement; no payload. |
| Preconditions | `query` and `rating` are required. `rating` ∈ `{helpful, not_helpful, partial}`. |
| When to use | After consuming a `cocoindex_code__search` result. Closes the loop so future search rankings improve. |

```python
ccc_feedback({
  query: "trigger extraction logic",
  resultFile: "system-spec-kit/mcp_server/lib/trigger-extractor.ts",
  rating: "helpful",
  comment: "Exact match for what I needed.",
})
```

---

<!-- /ANCHOR:2-tools -->

<!-- ANCHOR:3-typical-hybrid-flow -->
## 3. TYPICAL HYBRID FLOW (Semantic → Structural)

A common pattern: ask "what code in the repo handles X" without knowing exact names, then expand to "what does it call and what calls it."

```text
STEP 0  ccc_status               → confirm CocoIndex is ready
                                   (skip if known fresh)

STEP 1  cocoindex_code__search   → semantic hits with file paths + line ranges
        { query: "...", num_results: 5 }

STEP 2  code_graph_status        → confirm graph is fresh
                                   blocked → code_graph_scan, retry

STEP 3  code_graph_context       → pass CocoIndex hits as seeds with provider="cocoindex"
        { seeds: [
            {provider: "cocoindex", file: "...", range: {start, end}, score, snippet},
            ...
          ],
          queryMode: "neighborhood",
          budgetTokens: 1200 }

STEP 4  Optionally code_graph_query (blast_radius) on the chosen symbol
        before recommending edits

STEP 5  ccc_feedback             → close the loop on the seed quality
        (helpful / not_helpful / partial)
```

`code_graph_context` accepts a `provider: "cocoindex"` seed schema specifically so semantic hits flow into structural expansion without manual translation.

---

<!-- /ANCHOR:3-typical-hybrid-flow -->

<!-- ANCHOR:4-anti-patterns -->
## 4. ANTI-PATTERNS

- **Calling `ccc_reindex` before every workflow.** It is slow; check `ccc_status.indexExists` and `indexSize` first.
- **Treating `ccc_*` as a replacement for `mcp__cocoindex_code__search`.** Search is not bridged. The bridge tools are lifecycle-only.
- **Calling `cocoindex_code__search` without first checking `ccc_status` in a multi-step automation.** Fail-fast is cheap; mid-pipeline failure is not.
- **Skipping `ccc_feedback`.** Feedback drives ranking quality over time. Closing the loop costs nothing.
- **Using semantic seeds without a fresh structural graph.** `code_graph_context` will return `blocked` and you will waste the semantic-search budget.

---

<!-- /ANCHOR:4-anti-patterns -->

<!-- ANCHOR:5-related-resources -->
## 5. RELATED RESOURCES

- [`../runtime/tool_surface.md`](../runtime/tool_surface.md) — the three `ccc_*` tools in the broader 11-tool surface.
- [`../readiness/readiness_and_scope_fingerprint.md`](../readiness/readiness_and_scope_fingerprint.md) — readiness gate that `code_graph_context` enforces on the hybrid flow.
- `mcp-coco-index` skill (`.opencode/skills/mcp-coco-index/`) — owns the `search` surface and CocoIndex installation guidance.

<!-- /ANCHOR:5-related-resources -->
