---
title: "Validation"
description: "Pre-flight gates for memory operations, save quality checks, and content safety limits."
trigger_phrases:
  - "validation"
  - "preflight"
  - "anchor format"
---

# Validation

## 1. OVERVIEW

`lib/validation/` checks content before memory operations proceed. It catches malformed anchors, duplicate content, token-budget issues, content-size problems, and low-signal save payloads before the storage path runs.

## 2. DATA FLOW

```text
content and save metadata
  -> runPreflight()
  -> anchor, duplicate, token, and size checks
  -> optional runQualityGate()
  -> structural, content-quality, and semantic-dedup checks
  -> pass or actionable rejection reasons
```

The output is a typed result that callers can return in an envelope or use to stop a write before embedding and storage work starts.

## 3. KEY FILES

| File | Purpose |
|---|---|
| `preflight.ts` | Runs anchor, duplicate, token, and content-size checks |
| `save-quality-gate.ts` | Scores save payloads with structural, content-quality, and semantic-dedup layers |

## 4. BOUNDARIES

This module reports whether content is safe to continue. It does not write memory records, create embeddings, rewrite markdown, or format MCP responses.

## 5. ENTRYPOINTS

| Entrypoint | Use |
|---|---|
| `runPreflight()` | Run the selected pre-flight checks in one call |
| `validateAnchorFormat()` | Check paired `ANCHOR` tags and anchor IDs |
| `checkDuplicate()` | Detect exact or similar existing content |
| `estimateTokens()` | Estimate token count for a payload |
| `checkTokenBudget()` | Compare content against token limits |
| `validateContentSize()` | Enforce minimum and maximum content length |
| `runQualityGate()` | Run save quality layers when enabled |
| `isQualityGateEnabled()` | Read the save-quality feature flag state |

## 6. VALIDATION

- Anchor failures use `PF001` through `PF003`.
- Duplicate failures use `PF010` through `PF012`.
- Token-budget failures use `PF020` and `PF021`.
- Content-size failures use `PF030` and `PF031`.
- Save quality checks return layer-specific reasons and a final `pass` value.
- Thresholds are environment-configurable through the `MCP_*` and `SPECKIT_SAVE_QUALITY_GATE` settings.

## 7. RELATED

- `../errors/README.md`
- `../search/README.md`
- `../storage/README.md`
- `../../context-server.ts`
