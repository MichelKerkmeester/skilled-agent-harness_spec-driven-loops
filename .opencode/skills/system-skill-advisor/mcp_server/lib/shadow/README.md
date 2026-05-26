---
title: "Shadow Library: Advisor Shadow Sink"
description: "Shadow-mode sink helper for skill-advisor telemetry and comparison paths."
trigger_phrases:
  - "advisor shadow sink"
  - "shadow telemetry"
---

# Shadow Library: Advisor Shadow Sink

<!-- sk-doc-template: skill_readme -->

---

## 1. OVERVIEW

`lib/shadow/` contains the advisor shadow sink. It supports shadow-mode recording or comparison paths without mixing that behavior into scoring, rendering or handler code.

Current state:

- Provides a single shadow sink module.
- Keeps shadow behavior isolated from production recommendation output.
- Supports tests that verify shadow sink behavior independently.

---

## 2. DIRECTORY TREE

```text
shadow/
+-- shadow-sink.ts   # Shadow-mode sink helper
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `shadow-sink.ts` | Receives or records shadow-mode advisor data. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Keep dependencies limited to shadow sink needs. |
| Exports | Export shadow sink helpers only. |
| Ownership | Put shadow-mode capture here. Put scoring in `../scorer/` and rendering in `../render.ts`. |

Main flow:

```text
advisor shadow payload
  -> shadow sink
  -> stored or compared shadow data
  -> test or diagnostic consumes result
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `shadow-sink.ts` | TypeScript module | Shadow-mode sink helper. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp_server/lib/shadow/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../../tests/README.md`](../../tests/README.md)
