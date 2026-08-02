---
title: "Command bridges"
description: "Authored command-bridge inputs, compatibility evidence and the generated projection consumed by advisor scoring surfaces."
trigger_phrases:
  - "command bridges"
  - "generated command bridge projection"
  - "command bridge compatibility"
---

# Command bridges

---

## 1. OVERVIEW

`command-bridges/` is the source boundary for command metadata that is not yet represented uniformly by every scoring surface. The deriver combines live skill metadata with the authored compatibility inputs and writes the generated JSON projection.

---

## 2. CONTENTS

| File | Responsibility | Authority |
|---|---|---|
| `allow-list.json` | Records compatibility bridges for live commands without command metadata. | Authored input |
| `command-bridges.generated.json` | Stores the derived command-bridge projection. | Generated, do not edit |
| `derive-command-bridges.cjs` | Reads live metadata and authored inputs, validates uniqueness and writes the projection. | Authored deriver |
| `scoring-compatibility.json` | Holds TypeScript and Python scoring compatibility mappings. | Authored input |
| `shadow-diff.md` | Records comparison evidence between generated and live bridge authorities. | Authored evidence |

---

## 3. DERIVATION FLOW

```text
skill command metadata files
allow-list.json + scoring-compatibility.json
                         |
                         v
              derive-command-bridges.cjs
                         |
                         v
              command-bridges.generated.json
```

The deriver also updates generated projection blocks in the live TypeScript and Python scoring sources. The generated JSON and generated source blocks are outputs, not hand-edited inputs.

---

## 4. HUMAN EDIT BOUNDARY

Humans may edit `allow-list.json`, `derive-command-bridges.cjs`, `scoring-compatibility.json` and `shadow-diff.md`. Regenerate `command-bridges.generated.json` after changing an authored input or the deriver. Do not edit the generated JSON directly.

---

## 5. VALIDATION

Run the deriver in check mode from the repository root:

```bash
node .opencode/skills/system-skill-advisor/mcp-server/scripts/command-bridges/derive-command-bridges.cjs --check
```

---

## 6. RELATED

- [`Skill-advisor scripts`](../README.md)
