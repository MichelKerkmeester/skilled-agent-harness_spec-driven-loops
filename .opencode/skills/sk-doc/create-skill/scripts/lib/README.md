---
title: "Create Skill Scripts Lib: leaf-resource identity contract"
description: "Pure library that pairs a hub packet's resource path with its resolving workflow mode into one typed, uniqueness-checked identity."
---

# Create Skill Scripts Lib

---

## 1. OVERVIEW

`create-skill/scripts/lib/` holds the pure libraries the create-skill CLIs and their tests build on. Neither does any filesystem access: callers own reading and walking, these modules only shape and judge what the callers hand them.

`leaf-resource-contract.cjs` answers *what is this leaf resource called*. A hub packet resolves resources as packet-root-relative paths; a router separately selects a workflow mode. This library is the single conversion boundary that pairs the two into a typed `{ workflowMode, leafResourceId }` value, so every caller (fixtures, replay, dispatch, guards) agrees on the name.

`skill-root-metadata-contract.cjs` answers *which root-level metadata files does this skill need*. It classifies a root from the one declaration its author writes by hand, then reports the required, forbidden, overlay, and generated sets for that class — so a gate can flag a file that was never written, which a scanner starting from existing files structurally cannot do.

`command-metadata-schema.cjs` answers *is this hub's command surface coherent*. It validates each command-metadata entry's core fields, binds owner modes to the caller-supplied registry, and checks choreography order — with existence probes injected by the caller so the module itself never touches disk.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `leaf-resource-contract.cjs` | Normalizes a resource path plus workflow mode into a typed pair, enforces per-mode composite-key uniqueness and rejects out-of-root or prefix-stripped inputs. |
| `skill-root-metadata-contract.cjs` | Decides a skill root's class from its authored registry/router declaration, then reports which root-level metadata files that class requires, forbids, allows as an overlay, and may generate. |
| `command-metadata-schema.cjs` | Validates a hub's command-metadata entries against the core schema: command ids, registry owner modes, routing-signal uniqueness, and strictly ordered choreography with resolvable resources. |

## 3. TESTS

- `.opencode/skills/sk-doc/create-skill/scripts/tests/leaf-resource-contract.test.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs`

## 4. RELATED

- [`../generate-leaf-manifest.cjs`](../generate-leaf-manifest.cjs), the CLI wrapper that consumes this contract.
- [`SKILL.md`](../../SKILL.md)
- [`README.md`](../../README.md)
