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

> **Naming note — shadow-*delta* vs shadow-*delivery*.** This directory is the shadow-*delta* sink: it records telemetry deltas for comparison. It is distinct from the shadow-*delivery* state machine in [`../policy-plan.ts`](../policy-plan.ts), which tracks per-block delivery confirmation (observed receipts with `lifecycleEpoch >= 1`) for the default-off suppression path. The two share the word "shadow" but are unrelated subsystems.

Current state:

- Provides a single shadow sink module.
- Keeps shadow behavior isolated from production recommendation output.
- Records durable JSONL only when `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` is set or `SPECKIT_ADVISOR_SHADOW_DELTA_ENABLED=1` / `true` enables the default path.
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
| `shadow-sink.ts` | Resolves the opt-in shadow-delta sink and records shadow-mode advisor data when enabled. |

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
  -> store only when env enables durable shadow deltas
  -> test or diagnostic consumes result
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `shadow-sink.ts` | TypeScript module | Shadow-mode sink helper with default-off durable writes. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp-server/lib/shadow/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../../tests/README.md`](../../tests/README.md)
