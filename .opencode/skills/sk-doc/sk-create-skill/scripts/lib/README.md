---
title: "Create-skill scripts lib"
description: "Pure contracts for leaf-resource identities, root metadata classes and command metadata schemas."
trigger_phrases:
  - "create-skill library"
  - "leaf-resource contract"
  - "skill-root metadata contract"
---

# Create-skill scripts lib

---

## 1. OVERVIEW

`lib/` contains pure libraries used by the create-skill generators and tests. Callers own filesystem access and pass validated data into these modules.

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `command-metadata-schema.cjs` | Validates command metadata fields, owner modes, routing signals and choreography order. |
| `leaf-resource-contract.cjs` | Normalizes resource paths and workflow modes into unique typed leaf identities. |
| `s-class-config-defaults.json` | Stores defaults for skill-root class configuration. |
| `skill-root-metadata-contract.cjs` | Classifies skill roots and derives required, forbidden, overlay and generated metadata sets. |

## 3. BOUNDARIES

The modules do not read or write the filesystem. Existence probes and package traversal remain in the caller scripts.

## 4. VALIDATION

Run the library-focused tests from the repository root:

```bash
node .opencode/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs
node .opencode/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs
```

## 5. RELATED

- [`Create-skill scripts`](../README.md)
- [`Create-skill tests`](../tests/README.md)
