---
title: "Depth-calibrated explanation"
description: "Three depth levels for an explanation, bound by the rule that simplification changes words, never facts, so protected spans stay byte-exact at every depth."
trigger_phrases:
  - "depth-calibrated explanation"
  - "expert plain novice depth"
  - "simplify words not facts"
  - "explanation depth rubric"
  - "protected span byte-exact"
version: 1.0.0.0
---

# Depth-calibrated explanation

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Three depth levels for an explanation, bound by the rule that simplification changes words, never facts, so protected spans stay byte-exact at every depth.

`expert` assumes a peer and uses real identifiers with no glossing; `plain` keeps real names but glosses each jargon term once at first use for an intelligent non-specialist; `novice` leads with the picture, uses everyday words and a familiar analogy in place of the precise term, and assumes no background at all. All three explain the same subject; only the vocabulary and the amount shown change.

---

## 2. HOW IT WORKS

`/rewrite:explain-visually` reads `--depth`, defaulting to `expert` when the flag is absent, and rejects an unrecognized value with `STATUS=FAIL ERROR="unknown depth"`. Step 4 of the command applies the matching rubric while the visual is composed, and Step 5 identifies every protected span in the subject before that composition begins.

Protected spans — fenced and inline code, file and directory paths, terminal commands and flags, URLs and endpoints, exact numbers and timestamps, and identifiers such as variables, functions, classes, parameters, and config keys — are reproduced byte-for-byte at every depth. Depth changes prose, framing, and how much is shown; it never rewrites a value, so a `novice` answer may be incomplete but is never permitted to be wrong.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/rewrite/explain-visually.md` | Command | Steps 4 ("Apply The Depth Rubric") and 5 ("Identify Protected Spans") apply the depth and the byte-exact reproduction rule. |
| `.opencode/skills/sk-communication/references/visual-explanation.md` | Reference | Sections 3 ("Depth") and 4 ("Protected Spans") hold the three-level rubric and the protected-span list. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-communication/manual-testing-playbook/explanation/depth-flag-changes-words-not-facts.md` (COMM-011) | Manual | Operator scenario verifying `--depth=expert` and `--depth=novice` on the same subject change vocabulary while every identifier, path, and number stays identical. |

No automated test exists for this lane: it is a prompt contract with no package surface, so the manual playbook scenario above is the verification surface.

---

## 4. SOURCE METADATA

- Group: Explanation
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `explanation/depth-calibrated-explanation.md`

Related references:
- [modality-selection.md](modality-selection.md) — The first dial, chosen before depth is applied
