---
title: "Semantic trigger shadow matcher and hybrid handler"
description: "Default-off semantic trigger matching for memory_match_triggers, with shadow metadata by default and an explicit union mode that can supplement weak lexical matches."
trigger_phrases:
  - "semantic trigger shadow matcher and hybrid handler"
  - "SPECKIT_SEMANTIC_TRIGGERS"
  - "SPECKIT_SEMANTIC_TRIGGERS_MODE"
  - "semantic union fallback"
version: 3.6.0.1
---

# Semantic trigger shadow matcher and hybrid handler

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Default-off semantic trigger matching augments `memory_match_triggers` without changing lexical trigger behavior unless an operator explicitly enables union mode.

With `SPECKIT_SEMANTIC_TRIGGERS` unset, the handler does not initialize the semantic matcher. With the flag set, shadow mode returns semantic diagnostics only. `SPECKIT_SEMANTIC_TRIGGERS_MODE=union` lets semantic hits supplement weak lexical results while preserving lexical precedence.

---

## 2. HOW IT WORKS

The semantic matcher reads cached prompt and trigger embeddings, computes cosine scores, and applies threshold, margin, and max-result gates. It does not generate query embeddings in the hot path; cache misses return diagnostic status and fall back to lexical-only behavior.

The hybrid handler runs lexical matching first. Shadow mode appends metadata without changing returned records. Union mode deduplicates semantic hits by memory id, orders lexical records first, tags semantic-only records with `matchSource`, `semanticScore`, and matched phrases, and caps semantic activation below lexical activation.

Cold-start, cache-miss, and matcher-error cases degrade to lexical-only output with status annotations rather than failing the trigger call.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp_server/lib/triggers/semantic-trigger-matcher.ts` | Shared | Cached-embedding semantic matcher, cosine gates, and shadow stats |
| `mcp_server/handlers/memory-triggers.ts` | Handler | Default-off wiring, shadow metadata, union supplement path, lexical fallback |
| `mcp_server/handlers/mutation-hooks.ts` | Handler | Clears semantic trigger cache on write with existing mutation cache invalidation |
| `mcp_server/ENV_REFERENCE.md` | Reference | Documents semantic trigger flags and defaults |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/semantic-trigger-matcher.vitest.ts` | Automated test | Cosine, gate, cache, default-off, and shadow-stat coverage |
| `mcp_server/tests/hybrid-trigger-handler.vitest.ts` | Automated test | Union supplement and activation-guard coverage |
| `mcp_server/tests/lexical-parity.vitest.ts` | Automated test | Flag-off and shadow-default lexical parity |
| `mcp_server/tests/handler-memory-triggers.vitest.ts` | Automated test | Handler-level default-off and shadow regression coverage |

---

## 4. SOURCE METADATA

- Group: Retrieval
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `retrieval/semantic_trigger_shadow_matcher_and_hybrid_handler.md`

Related references:
- [trigger-embedding-backfill.md](trigger_embedding_backfill.md) - Storage substrate for trigger embeddings
- [trigger-phrase-matching-memorymatchtriggers.md](trigger_phrase_matching_memorymatchtriggers.md) - Lexical trigger matcher entry point
