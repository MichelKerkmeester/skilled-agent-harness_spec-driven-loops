---
title: "Skill Advisor Data: Static Runtime Inputs"
description: "Data folder for tracked advisor JSON inputs plus ignored opt-in shadow delta logs."
trigger_phrases:
  - "advisor data"
  - "shadow deltas"
---

# Skill Advisor Data: Static Runtime Inputs

<!-- sk-doc-template: skill_readme -->

---

## 1. OVERVIEW

`skill_advisor/data/` stores tracked JSON inputs copied into advisor dist during build. Shadow delta JSONL logs may appear here only when shadow-delta recording is explicitly enabled, and they are ignored runtime state.

Current state:

- Tracks `prompt-policy.default.json` as the default prompt policy input.
- Copies tracked `*.json` files into `dist/mcp-server/data` during `npm run build`.
- Ignores `shadow-deltas.jsonl` because it is opt-in observed runtime telemetry.

---

## 2. DIRECTORY TREE

```text
data/
+-- prompt-policy.default.json  # Tracked prompt policy input copied into dist
+-- shadow-deltas.jsonl         # Ignored runtime telemetry when shadow-delta recording is enabled
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `prompt-policy.default.json` | Default prompt policy input copied into build output. |
| `shadow-deltas.jsonl` | Ignored opt-in shadow-delta records for comparison or diagnostics. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | JSON data files are read by advisor runtime code, not imported as modules. |
| Exports | This folder exports no runtime code. |
| Ownership | Track static JSON inputs here. Put runtime logs here only as ignored local state via `.opencode/.gitignore`. |

Main flow:

```text
build or runtime path
  -> read tracked JSON input
  -> copy to dist/mcp-server/data during build
  -> append ignored shadow telemetry only when enabled by env
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `prompt-policy.default.json` | Data file | Default prompt policy input. |
| `shadow-deltas.jsonl` | Runtime file | Ignored opt-in shadow delta record store. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp-server/data/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../lib/shadow/README.md`](../lib/shadow/README.md)
