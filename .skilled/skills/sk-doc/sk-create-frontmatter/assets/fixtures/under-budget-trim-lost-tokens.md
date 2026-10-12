---
title: Under-Budget Trim Fixture
description: A 56-character trim of the same description that passes the length check by deleting keep-list tokens, used as the input to the rejection scenario.
trigger_phrases:
  - "under budget trim fixture"
  - "trim that loses routing tokens"
  - "56 character description"
  - "keep list token loss example"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Under-budget trim fixture

The input document for `FMB-002`. The proposed trim below is the text to judge.

---

## 1. THE ORIGINAL

The same 547-character description as the sibling fixture, abbreviated here to its two ends:

```yaml
description: sk-notebook is a comprehensive, best-in-class notebook skill that captures, organizes, ... 40 shortcuts and a delightful zero-config onboarding experience that just works right out of the box.
```

The full text is in [`over-budget-description.md`](over-budget-description.md).

---

## 2. THE PROPOSED TRIM

56 characters, which is inside the soft target:

```yaml
description: Captures and reviews notes with templates and shortcuts.
```

---

## 3. WHAT THE TRIM LOST

| Keep-list token | In the original | In the trim |
|---|---|---|
| Skill-name token | `sk-notebook` | absent |
| Primary verb | `capture` | present as `Captures` |
| Primary domain noun | `notes` | present |
| Mode suffixes | `sk-notebook-capture`, `sk-notebook-review` | absent |
| Numeric specifics | `12 templates` | absent, replaced by the bare word `templates` |

Three of the five rows are gone. The length check passes anyway, because no tool in this packet reads the keep list. That is the point of the scenario: the trim is a routing regression that every available instrument reports as an improvement.
