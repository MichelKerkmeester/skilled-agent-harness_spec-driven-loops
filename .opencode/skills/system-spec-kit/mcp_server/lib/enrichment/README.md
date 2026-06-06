---
title: "Enrichment: Passive Response Hints"
description: "Bounded response enrichment that adds code-graph and session-continuity hints without changing primary tool results."
trigger_phrases:
  - "passive enrichment"
  - "response enrichment"
---

# Enrichment: Passive Response Hints

---

## 1. OVERVIEW

`lib/enrichment/` owns passive response enrichment for MCP tool output. It appends optional hints after the primary response is available.

Current responsibilities:

- Detect file paths mentioned in response text.
- Add nearby code-graph symbols when the code graph database is available.
- Add session-continuity warnings when context quality is degraded or critical.
- Stay within the configured latency deadline, token budget, and recursion guard.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                  LIB ENRICHMENT                                  │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌──────────────────────┐      ┌───────────────────┐
│ Tool response  │ ───▶ │ runPassiveEnrichment │ ───▶ │ EnrichmentResult  │
└────────────────┘      └──────────┬───────────┘      └───────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
        ┌──────────────────────┐      ┌──────────────────────┐
        │ Code-graph symbols   │      │ Session warning      │
        │ dynamic import       │      │ dynamic import       │
        └──────────────────────┘      └──────────────────────┘

Dependency direction: enrichment ───▶ code_graph/lib and lib/session only through dynamic imports
```

---

## 3. DIRECTORY TREE

```text
lib/enrichment/
+-- passive-enrichment.ts   # Enrichment pipeline, guards, hint builders, and test export
`-- README.md
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `passive-enrichment.ts` | Extracts mentioned paths, builds bounded hints, imports optional providers, and returns `EnrichmentResult`. |
| `README.md` | Explains the folder contract for developers changing enrichment behavior. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Primary results | Enrichment must not change the main tool payload. |
| Runtime cost | `runPassiveEnrichment()` uses a default 250 ms deadline and 200 token budget. |
| Recursion | The module blocks nested enrichment with `enrichmentInProgress`. |
| Optional providers | Code graph and session metrics are dynamically imported so missing providers are non-fatal. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ Response text                             │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ runPassiveEnrichment()                   │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Extract up to five mentioned paths       │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Add code-graph hints within budget       │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Add session warning when quality is low  │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ EnrichmentResult                         │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `runPassiveEnrichment()` | Function | Adds bounded passive hints to response text. |
| `extractMentionedPaths()` | Function | Test-facing path extractor used by the enrichment pipeline. |
| `EnrichmentResult` | Type | Response contract for hints, token count, latency, and skip state. |

---

## 7. VALIDATION

Run from `.opencode/skills/system-spec-kit/mcp_server`.

```bash
npx vitest run tests/stage2b-enrichment-extended.vitest.ts
```

Expected result: the enrichment suite passes without deadline, recursion, or path extraction regressions.

---

## 8. RELATED

- [`../../code_graph/README.md`](../../../../system-code-graph/mcp_server/README.md)
- [`../response/README.md`](../response/README.md)
- [`../session/README.md`](../session/README.md)
