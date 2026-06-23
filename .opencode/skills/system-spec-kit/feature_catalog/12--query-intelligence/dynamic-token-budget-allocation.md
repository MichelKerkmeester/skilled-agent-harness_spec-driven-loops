---
title: "Dynamic token budget allocation"
description: "Dynamic token budget allocation scales the token budget returned per query based on query complexity tier."
trigger_phrases:
  - "dynamic token budget allocation"
  - "token budget per query"
  - "scale response by complexity"
  - "context window budget"
  - "SPECKIT_CONTEXT_HEADERS token overhead"
version: 3.6.0.17
---

# Dynamic token budget allocation

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Dynamic token budget allocation scales the token budget returned per query based on query complexity tier.

Every answer the system gives takes up space in a limited response window. This feature gives simple questions a small response budget and saves the big budget for complex questions that genuinely need more room. Think of it like packing a lunch bag versus a suitcase: you match the container to what you actually need to carry.

---

## 2. HOW IT WORKS

Returning 4,000 tokens for a simple trigger-phrase lookup wastes context window. Token budgets now scale with query complexity: simple queries receive 1,500 tokens, moderate queries 2,500 and complex queries 4,000.

The budget is computed early in the pipeline (before channel execution) so downstream stages can enforce it. When contextual tree headers are enabled (`SPECKIT_CONTEXT_HEADERS`), the effective budget is reduced by header overhead of about `~26` tokens per result (`CONTEXT_HEADER_TOKEN_OVERHEAD = Math.ceil((100 + 1) / 4)`, floor 200 tokens) before truncation (CHK-060). When the flag is disabled, all queries fall back to the 4,000-token default.

The savings add up. If 60% of your queries are simple, you recover roughly 40% of the token budget that was previously wasted on over-delivering.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/dynamic-token-budget.ts` | Lib | Token budget computation |
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Budget adjustment with header overhead (CHK-060) |
| `mcp_server/lib/search/query-classifier.ts` | Lib | Query complexity classification |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/dynamic-token-budget.vitest.ts` | Automated test | Token budget computation |
| `mcp_server/tests/query-classifier.vitest.ts` | Automated test | Query classification accuracy |
| `mcp_server/tests/token-budget.vitest.ts` | Automated test | Token budget tests + CHK-023 adjustedBudget formula |

---

## 4. SOURCE METADATA
- Group: Query Intelligence
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `12--query-intelligence/dynamic-token-budget-allocation.md`
Related references:
- [confidence-based-result-truncation.md](confidence-based-result-truncation.md) — Confidence-based result truncation
- [query-expansion.md](query-expansion.md) — Query expansion
