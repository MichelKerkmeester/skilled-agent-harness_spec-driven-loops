---
title: "Lifecycle Library: Advisor Skill State Transitions"
description: "Age, archive and status helpers for skill-advisor lifecycle metadata."
trigger_phrases:
  - "advisor lifecycle"
---

# Lifecycle Library: Advisor Skill State Transitions

---

## 1. OVERVIEW

`lib/lifecycle/` contains helpers for advisor-facing skill lifecycle metadata. It covers age haircuts, archive handling and status values.

Current state:

- Applies age and archive rules to skill metadata.
- Encodes lifecycle status values.

---

## 2. DIRECTORY TREE

```text
lifecycle/
+-- age-haircut.ts        # Age-based ranking adjustment helpers
+-- archive-handling.ts   # Archive state handling
+-- status-values.ts      # Lifecycle status constants
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `age-haircut.ts` | Applies age-based adjustment to lifecycle-aware ranking. |
| `archive-handling.ts` | Handles archived skill metadata. |
| `status-values.ts` | Defines lifecycle status constants. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | May use lifecycle schemas and derived metadata helpers. |
| Exports | Export lifecycle metadata helpers only. |
| Ownership | Put skill lifecycle state here. Put freshness and daemon state in sibling folders. |

Main flow:

```text
skill lifecycle metadata
  -> archive and age adjustment
  -> status evaluation
  -> advisor ranking or redirect decision
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `status-values.ts` | TypeScript module | Lifecycle status constants. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/system-skill-advisor/runtime/lib/lifecycle/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../freshness/README.md`](../freshness/README.md)
- [`../derived/README.md`](../derived/README.md)
