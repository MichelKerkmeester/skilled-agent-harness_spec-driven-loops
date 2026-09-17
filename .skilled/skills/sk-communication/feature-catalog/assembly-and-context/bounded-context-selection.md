---
title: "Bounded context selection"
description: "Selects a fresh, privacy-approved slice of the latest non-meta user message under an explicit codepoint limit and no-context fallback policy."
trigger_phrases:
  - "Bounded context selection"
  - "select bounded context"
  - "selectBoundedContext"
  - "rewrite context freshness"
version: 1.0.0.0
---

# Bounded context selection (selectBoundedContext)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Selects a fresh, privacy-approved slice of the latest non-meta user message under an explicit codepoint limit and no-context fallback policy.

The caller receives a validated bounded-context record plus ephemeral selected text. The text is deliberately separate from the contract so it can be discarded after the provider request instead of entering durable evidence.

---

## 2. HOW IT WORKS

The selector validates the transcript view, injected current time, privacy decision, maximum age, codepoint limit, and fallback mode. It considers user messages only, skips messages marked as meta, selects the latest eligible message, and truncates by Unicode codepoints rather than bytes or UTF-16 units.

Unavailable transcripts, missing user messages, meta-only history, stale transcript observations, or privacy denial produce an absent record with a typed reason and no selected text. The record still reports the measured truncation, freshness state, privacy decision, and whether the caller should use the exact original or rewrite without context.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-communication/cli-communication-projection/src/context/selector.ts` | Handler | Selects and bounds the request-scoped user context. |
| `.opencode/skills/sk-communication/cli-communication-projection/src/contracts/context.ts` | Shared | Defines bounded-context, privacy, freshness, and absence contracts. |
| `.opencode/skills/sk-communication/cli-communication-projection/src/contracts/validate-policy.ts` | Shared | Validates bounded-context and privacy records. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-communication/cli-communication-projection/test/core/context-selector.test.ts` | Unit | Covers selection, freshness, privacy, truncation, and absence reasons. |
| `.opencode/skills/sk-communication/cli-communication-projection/test/contracts/context-prompt-provider.test.ts` | Integration | Verifies context records alongside prompt and provider policy contracts. |

---

## 4. SOURCE METADATA

- Group: Assembly And Context
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `assembly-and-context/bounded-context-selection.md`

Related references:
- [generation-keyed-message-assembly.md](generation-keyed-message-assembly.md) — Complete-message state assembled before rewriting
