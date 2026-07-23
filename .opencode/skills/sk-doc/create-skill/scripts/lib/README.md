---
title: "Create Skill Scripts Lib: leaf-resource identity contract"
description: "Pure library that pairs a hub packet's resource path with its resolving workflow mode into one typed, uniqueness-checked identity."
---

# Create Skill Scripts Lib

---

## 1. OVERVIEW

`create-skill/scripts/lib/` holds the one pure library that `generate-leaf-manifest.cjs` and its tests build on. A hub packet resolves resources as packet-root-relative paths. A router separately selects a workflow mode. `leaf-resource-contract.cjs` is the single conversion boundary that pairs the two into a typed `{ workflowMode, leafResourceId }` value, so every caller (fixtures, replay, dispatch, guards) agrees on what a leaf resource is called. It does no filesystem access.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `leaf-resource-contract.cjs` | Normalizes a resource path plus workflow mode into a typed pair, enforces per-mode composite-key uniqueness and rejects out-of-root or prefix-stripped inputs. |

## 3. TESTS

- `.opencode/skills/sk-doc/create-skill/scripts/tests/leaf-resource-contract.test.cjs`

## 4. RELATED

- [`../generate-leaf-manifest.cjs`](../generate-leaf-manifest.cjs), the CLI wrapper that consumes this contract.
- [`SKILL.md`](../../SKILL.md)
- [`README.md`](../../README.md)
