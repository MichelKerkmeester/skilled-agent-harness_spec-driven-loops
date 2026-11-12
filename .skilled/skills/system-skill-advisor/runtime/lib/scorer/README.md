---
title: "Scorer Library: Skill Advisor Ranking"
description: "Native advisor scorer modules for lane attribution, fusion, ambiguity handling, alias canonicalization, text scoring, weights and projection."
trigger_phrases:
  - "advisor scorer"
  - "skill advisor ranking"
  - "scorer lanes"
---

# Scorer Library: Skill Advisor Ranking

---

## 1. OVERVIEW

`lib/scorer/` contains the native scoring modules used by the skill advisor to rank candidate skills. It combines lane-specific evidence, text matching, age policy, ambiguity handling, explicit alias canonicalization, fusion and output projection into prompt-safe recommendation scores.

Current state:

- Defines scorer types, constants and configurable weights.
- Separates lane registration and lane implementations from fusion and projection.
- Canonicalizes narrow command/skill alias groups before campaign scoring compares expected and actual routes.
- Supports attribution and ablation helpers for advisor quality checks.

---

## 2. DIRECTORY TREE

```text
scorer/
+-- ablation.ts              # Scorer ablation helpers
+-- age-policy.ts            # Age-aware ranking policy
+-- aliases.ts               # Narrow command/skill alias canonicalization
+-- ambiguity.ts             # Ambiguity detection and handling
+-- attribution.ts           # Lane attribution assembly
+-- beta-reliability.ts      # Beta-posterior reliability primitive for the shadow learning loop
+-- feedback-calibration.ts  # Advisor feedback calibration reducer
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

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `fusion.ts` | Combines lane scores into final advisor ranking signals through RRF fusion, with a conflict-match rerank seam and a self-recommendation guard that penalizes advisor self-recommendations. `requireCommandPhraseAnchor` keeps a passing command row passing only when the explicit-author lane matched one of its own phrases or its slash string, or when it passes on meaning: a real embedder cosine of at least `COMMAND_MEANING_MIN_COSINE` (0.72) with a lead of `COMMAND_MEANING_MARGIN` (0.02) over the next command row. The word-overlap stand-in used under test never counts. `commandMeaningEligible` decides who may pass on meaning: a prompt matching `NO_EDIT_REQUEST`, the pattern `readOnlyRouteAllowed` also reads, rules out every command, and a read-only explainer admits only a command whose route only reads. `rankMeaningPassedCommandFirst` moves a meaning-passed command ahead of the top passing skill only when its cosine leads that skill's by the same margin. |
| `lane-registry.ts` | Registers available scoring lanes. |
| `aliases.ts` | Canonicalizes explicit command/skill alias groups for route comparisons. |
| `attribution.ts` | Builds prompt-safe lane attribution details. |
| `ambiguity.ts` | Detects close or unclear recommendation states. A command row and its `ownerSkill` count as one answer, so they never make each other ambiguous. |
| `feedback-calibration.ts` | Reduces advisor feedback into shadow calibration reports. |
| `projection.ts` | Projects scorer internals into caller-facing output. Its `COMMAND_BRIDGES` list is the generated block that `derive-command-bridges.cjs` writes, with an `ownerSkill` on each row. |
| `weights-config.ts` | Stores configurable lane and scorer weights. |
| `types.ts` | Defines scorer input, output and lane types. |

---

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

## 6. VALIDATION

Run from the repository root.

```bash
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/system-skill-advisor/runtime/lib/scorer/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../../tests/scorer/README.md`](../../tests/scorer/README.md)
