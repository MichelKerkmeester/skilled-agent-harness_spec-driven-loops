---
title: "Scorer Library: Skill Advisor Ranking"
description: "Native advisor scorer modules for lane attribution, fusion, ambiguity handling, alias canonicalization, text scoring, weights and projection."
trigger_phrases:
  - "advisor scorer"
  - "skill advisor ranking"
  - "scorer lanes"
---

# Scorer Library: Skill Advisor Ranking

<!-- sk-doc-template: skill_readme -->

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES AND FLOW](#4--boundaries-and-flow)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

---

<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

`lib/scorer/` contains the native scoring modules used by the skill advisor to rank candidate skills. It combines lane-specific evidence, text matching, age policy, ambiguity handling, explicit alias canonicalization, fusion and output projection into prompt-safe recommendation scores.

Current state:

- Defines scorer types, constants and configurable weights.
- Separates lane registration and lane implementations from fusion and projection.
- Canonicalizes narrow command/skill alias groups before campaign scoring compares expected and actual routes.
- Supports attribution and ablation helpers for advisor quality checks.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-directory-tree -->
## 2. DIRECTORY TREE

```text
scorer/
+-- ablation.ts              # Scorer ablation helpers
+-- age-policy.ts            # Age-aware ranking policy
+-- aliases.ts               # Narrow command/skill alias canonicalization
+-- ambiguity.ts             # Ambiguity detection and handling
+-- attribution.ts           # Lane attribution assembly
+-- fusion.ts                # Score fusion logic
+-- lane-registry.ts         # Lane registration
+-- lanes/                   # Lane-specific scoring modules
+-- projection.ts            # Output projection helpers
+-- scoring-constants.ts     # Scoring constants
+-- text.ts                  # Text matching helpers
+-- types.ts                 # Scorer types
+-- weights-config.ts        # Weight configuration
`-- README.md
```

---

<!-- /ANCHOR:2-directory-tree -->

<!-- ANCHOR:3-key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `fusion.ts` | Combines lane scores into final advisor ranking signals. |
| `lane-registry.ts` | Registers available scoring lanes. |
| `aliases.ts` | Canonicalizes explicit command/skill alias groups for route comparisons. |
| `attribution.ts` | Builds prompt-safe lane attribution details. |
| `ambiguity.ts` | Detects close or unclear recommendation states. |
| `projection.ts` | Projects scorer internals into caller-facing output. |
| `weights-config.ts` | Stores configurable lane and scorer weights. |
| `types.ts` | Defines scorer input, output and lane types. |

---

<!-- /ANCHOR:3-key-files -->

<!-- ANCHOR:4-boundaries-and-flow -->
## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | May import derived metadata, corpus weighting and schema types needed for scoring. |
| Exports | Export scorer functions and types, not handler response formatting. |
| Ownership | Put scoring and attribution here. Put prompt-safe rendering in `../render.ts` and handler orchestration in `../../handlers/`. |
| Aliases | Keep command/skill aliases fixed and explicit. Do not use fuzzy or prefix matching. |

Main flow:

```text
prompt and candidate skills
  -> lane scoring and text evidence
  -> score fusion and ambiguity checks
  -> alias-aware route comparison when scenario expectations use command ids
  -> attribution and projection
  -> caller renders recommendation
```

---

<!-- /ANCHOR:4-boundaries-and-flow -->

<!-- ANCHOR:5-entrypoints -->
## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `fusion.ts` | TypeScript module | Score fusion logic. |
| `aliases.ts` | TypeScript module | Canonical command/skill alias helpers. |
| `lane-registry.ts` | TypeScript module | Lane registration. |
| `projection.ts` | TypeScript module | Output projection. |
| `types.ts` | TypeScript module | Scorer contracts. |
| `lanes/` | Folder | Lane-specific scoring modules. |

---

<!-- /ANCHOR:5-entrypoints -->

<!-- ANCHOR:6-validation -->
## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/README.md
```

Expected result: exit code `0`.

---

<!-- /ANCHOR:6-validation -->

<!-- ANCHOR:7-related -->
## 7. RELATED

- [`../README.md`](../README.md)
- [`../../tests/scorer/README.md`](../../tests/scorer/README.md)
- [`../corpus/README.md`](../corpus/README.md)

<!-- /ANCHOR:7-related -->
