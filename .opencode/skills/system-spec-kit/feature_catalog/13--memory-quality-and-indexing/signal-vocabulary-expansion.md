---
title: "Signal vocabulary expansion"
description: "Signal vocabulary expansion adds CORRECTION and PREFERENCE categories to the trigger matcher for better intent detection."
trigger_phrases:
  - "signal vocabulary expansion"
  - "trigger matcher categories"
  - "correction and preference signals"
  - "intent detection"
  - "expand signal vocabulary"
version: 3.6.0.15
---

# Signal vocabulary expansion

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Signal vocabulary expansion adds CORRECTION and PREFERENCE categories to the trigger matcher for better intent detection.

The system listens for clues in your language to understand what you really mean. This feature taught it to recognize two new types of clues: when you are correcting a past mistake (words like "actually" or "wait") and when you are expressing a preference (words like "prefer" or "want"). Recognizing these patterns helps the system pull up the right memories for the situation.

---

## 2. HOW IT WORKS

The trigger matcher originally recognized six signal categories. Two new categories from the true-mem 8-category vocabulary were added: CORRECTION signals (words like "actually", "wait", "I was wrong") and PREFERENCE signals ("prefer", "like", "want").

Correction signals matter because they indicate the user is fixing a prior misunderstanding, which means different memories are relevant. Preference signals help the system detect intent behind requests like "I prefer the JSON format" where matching on preference-associated memories improves retrieval accuracy.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/parsing/trigger-matcher.ts` | Lib | Trigger phrase matching — CORRECTION and PREFERENCE signal categories added here |
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration defining signal category vocabulary |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/trigger-matcher.vitest.ts` | Automated test | Trigger matcher tests |
| `mcp_server/tests/trigger-config-extended.vitest.ts` | Automated test | Trigger config extended coverage |

---

## 4. SOURCE METADATA
- Group: Memory Quality And Indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `13--memory-quality-and-indexing/signal-vocabulary-expansion.md`
Related references:
- [verify-fix-verify-memory-quality-loop.md](verify-fix-verify-memory-quality-loop.md) — Verify-fix-verify memory quality loop
- [pre-flight-token-budget-validation.md](pre-flight-token-budget-validation.md) — Pre-flight token budget validation
