---
title: "Empty result recovery"
description: "Empty result recovery generates structured recovery payloads when search returns no results, low-confidence results, or only partial matches, providing the calling agent with actionable next steps, gated by the SPECKIT_EMPTY_RESULT_RECOVERY_V1 flag."
trigger_phrases:
  - "empty result recovery"
  - "SPECKIT_EMPTY_RESULT_RECOVERY_V1"
  - "no results recovery payload"
  - "low-confidence result handling"
  - "search failure recovery"
---

# Empty result recovery

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Empty result recovery generates structured recovery payloads when search returns no results, low-confidence results, or only partial matches, providing the calling agent with actionable next steps, gated by the `SPECKIT_EMPTY_RESULT_RECOVERY_V1` flag.

When a search comes back empty or with poor results, the user gets no guidance on what to do next. This feature detects three failure states (no results, low confidence, partial matches) and generates a structured payload that tells the calling agent why the search failed and what action to take. Suggested alternatives might include broadening the query, switching search mode, saving a new spec-doc record to fill the knowledge gap, or asking the user for clarification.

---

## 2. HOW IT WORKS

### Core Behavior

Enabled by default (graduated). Set `SPECKIT_EMPTY_RESULT_RECOVERY_V1=false` to disable.

The recovery payload module (`recovery-payload.ts`) classifies search outcomes into three statuses:
- **no_results**: Zero results returned.
- **low_confidence**: Results returned but average confidence is below `DEFAULT_LOW_CONFIDENCE_THRESHOLD = 0.4`.
- **partial**: Fewer than `PARTIAL_RESULT_MIN = 3` results returned.

### Post-Action Behavior

For each status, the module identifies a root cause reason:
- `spec_filter_too_narrow`: A specFolder filter was applied and likely excluded relevant results.
- `low_signal_query`: The query itself lacks distinctive terms.
- `knowledge_gap`: The system simply does not have relevant memories.

The recommended actions are: `retry_broader`, `switch_mode`, `save_memory`, or `ask_user`. Suggested alternative queries are generated based on the original query and failure context.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/recovery-payload.ts` | Lib | Recovery status classification, reason inference, suggested query generation, payload construction |
| `mcp_server/lib/search/search-flags.ts` | Lib | Central flag registry reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/d5-recovery-payload.vitest.ts` | Automated test | Recovery payload generation, status classification, flag gating |

---

## 4. SOURCE METADATA
- Group: Ux Hooks
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `18--ux-hooks/empty-result-recovery.md`
Related references:
- [retrieval-session-state.md](retrieval-session-state.md) — Retrieval session state
- [result-confidence.md](result-confidence.md) — Result confidence scoring
