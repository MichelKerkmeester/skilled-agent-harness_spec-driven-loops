---
title: Doc-Quality References
description: Route map over the doc-quality reference set - execution modes, validation and enforcement, optimization procedure, and the transformation pattern catalog.
trigger_phrases:
  - "doc quality references"
  - "doc quality reference map"
  - "optimization workflows index"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Doc-Quality References

Route map over the `doc-quality` reference set. The operating logic lives in [`../SKILL.md`](../SKILL.md) (primary); these references are single-concern overflow — worked examples, exhaustive detail, and templates loaded on demand. Open only the file the current task needs.

---

## 1. OVERVIEW

This file is the reference route map for the `doc-quality` packet: it indexes five single-concern reference files — execution modes, validation and enforcement, worked examples, optimization procedure, and the transformation pattern catalog — so each loads only when the current task needs its depth.

---

## 2. REFERENCE MAP

Load the file that matches the current task:

| Concern | Reference | Load When |
| --- | --- | --- |
| **Execution modes** — the four modes (script-assisted review, structure checks, content optimization, audit snapshot) and how to pick one | [workflows.md](./workflows.md) | Choosing how to run a doc-quality pass, or mapping a mode to its scripts/phases/output |
| **Validation & enforcement operations** — validation touchpoints, enforcement approval-prompt templates, phase chaining, troubleshooting | [validation_and_enforcement.md](./validation_and_enforcement.md) | Wording an enforcement prompt, sequencing validation manually, or a run breaks |
| **Worked examples & batch** — copy-paste command recipes and multi-file/batch processing | [workflow_examples.md](./workflow_examples.md) | Needing a starting command for a common run, or processing many docs at once |
| **Optimization procedure** — quality heuristics, analysis workflow, README priority strategy, snippet checklist, iteration loop | [optimization.md](./optimization.md) | The user asked to improve/optimize an existing doc for AI-friendliness |
| **Transformation pattern catalog** — the 16 patterns with worked before/after code | [transformation_patterns.md](./transformation_patterns.md) | You need the exact before/after shape for a specific pattern |

> `workflows.md` and `optimization.md` are the two externally cited entry files (the `/doc:quality` command and the `sk-doc` hub README point at them). They stay as the route/entry files for their concern; their overflow lives in the siblings above.

---

## 3. RELATED RESOURCES

### Packet
- [../SKILL.md](../SKILL.md) - Authoritative doc-quality workflow contract (primary)
- [../README.md](../README.md) - Human orientation for the packet

### Shared Backbone
- [core_standards.md](../../shared/references/global/core_standards.md) - Document type detection and structural standards
- [validation.md](../../shared/references/global/validation.md) - DQI bands and validation severity
- [hvr_rules.md](../../shared/references/global/hvr_rules.md) - Human Voice Rules for natural documentation style
- [quick_reference.md](../../shared/references/global/quick_reference.md) - Command and quality-gate cheat sheet

### Scripts
- [extract_structure.py](../../shared/scripts/extract_structure.py) - Structure metrics, checklist, and DQI (source of truth)
- [validate_document.py](../../shared/scripts/validate_document.py) - Pre-delivery markdown validation gate
- [quick_validate.py](../../shared/scripts/quick_validate.py) - Fast validation for files, folders, or skill packets

---

*End of doc-quality references route map — depth lives in the single-concern files above.*
