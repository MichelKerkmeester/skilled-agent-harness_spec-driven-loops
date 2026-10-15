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

The doctor commands are a third source: the deriver reads `.skilled/commands/doctor/_routes.yaml` and writes one bridge per doctor route and per standalone doctor command.

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
.skilled/commands/doctor/_routes.yaml
                         |
                         v
              derive-command-bridges.cjs
                         |
                         v
              command-bridges.generated.json
```

The deriver also updates generated projection blocks in the live TypeScript and Python scoring sources. It writes a generated block of runnable doctor command strings into `lib/render.ts`. The generated JSON and generated source blocks are outputs, not hand-edited inputs.

---

## 4. DOCTOR BRIDGES

Ids are `command-doctor-<command>-<target>` when the doctor command owns more than one route, and `command-doctor-<command>` otherwise. `skillId` and `ownerMode` come from the router's `skill_agent` tag. A router without the tag fails the deriver with a named error.

The runnable string is the command plus its target when the command owns more than one route. A standalone entry may set `runnable`, as `/doctor:env` does with `/doctor:env list`.

An entry in `scoring-compatibility.json` activates a doctor bridge. It carries only `inventoryId`, `order`, `id` (equal to `inventoryId`) and an empty `description`.

The deriver fills the TypeScript name, keywords, intent signals and domains from the manifest, and the Python slash marker from the runnable string only, so Python matches a doctor bridge only on a typed slash command.

A doctor bridge surfaces only on its own wording (an explicit-author phrase match). It never ranks above a passing skill unless the prompt types a doctor slash command. The brief then shows the runnable string as a second line.

`/doctor:deep-loop` and the `/doctor:mcp` sub-actions stay inactive until a later wave. `/doctor:deep-loop` is in the inventory without a compatibility entry, and the `mcp_subroutes` are not read.

Check every admitted phrase with `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs`.

---

## 5. HUMAN EDIT BOUNDARY

Humans may edit `allow-list.json`, `derive-command-bridges.cjs`, `scoring-compatibility.json` and `shadow-diff.md`. Regenerate `command-bridges.generated.json` after changing an authored input or the deriver. Do not edit the generated JSON directly.

---

## 6. VALIDATION

Run the deriver in check mode from the repository root:

```bash
node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check
```

---

## 7. RELATED

- [`Skill-advisor scripts`](../README.md)
