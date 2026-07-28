---
title: Create-Flowchart Reference Route-Map
description: Index over the create-flowchart overflow references - worked example, validator mechanics and notation, and pattern selection - mapping each concern to its focused file.
trigger_phrases:
  - "flowchart creation reference"
  - "ascii flowchart examples"
  - "flowchart validator pitfalls"
  - "flowchart pattern selection"
  - "flowchart reference map"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Create-Flowchart References

Route-map for create-flowchart overflow guidance. `../SKILL.md` is the authoritative workflow contract; these references carry only the depth that does not belong inline — a worked example, validator mechanics, and pattern-selection detail. Open only the file the current task needs.

---

## 1. OVERVIEW

The numbered creation workflow, notation rules, pattern-selection table, pattern-specific build rules, and the validator contract all live in `../SKILL.md`. This reference set is overflow: concrete examples and mechanics an author reaches for when the primary workflow is already clear but the diagram needs deeper shaping. Each concern lives in its own single-concern file.

## 2. REFERENCE MAP

Load the file that matches the current task:

| Concern | Reference | Load When |
| --- | --- | --- |
| **Worked example** — a compact validator-passing decision tree and why its labels, connectors, and widths pass | [worked-example.md](worked-example.md) | Modeling a real decision tree on a proven, validator-safe shape |
| **Validator mechanics and notation** — how the validator inspects a file, box-width consistency and fixes, common mistakes, and the judgment the validator cannot supply | [notation-and-validator.md](notation-and-validator.md) | A flowchart fails validation, hits the box-width error, or you need validator-passing notation |
| **Pattern selection and splitting** — choosing a pattern by workflow shape with best-fit and avoid-when detail, plus when to split a large diagram | [pattern-selection.md](pattern-selection.md) | Deciding which pattern fits, or whether a diagram is too large for one figure |

---

## 3. RELATED RESOURCES

- [worked-example.md](worked-example.md) - Validator-passing decision-tree example and why it passes
- [notation-and-validator.md](notation-and-validator.md) - Validator mechanics, box-width notation, common mistakes, and author judgment
- [pattern-selection.md](pattern-selection.md) - Pattern selection deep dive and split heuristics
- `../SKILL.md` - Authoritative create-flowchart workflow contract
- `../scripts/validate-flowchart.sh` - Packet-local validator and actual threshold source
- `../assets/*` - Six pattern assets, one per workflow shape

---

*End of create-flowchart reference route-map — depth lives in the three single-concern files above.*
