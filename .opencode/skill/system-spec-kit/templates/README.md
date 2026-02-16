---
title: "Templates"
description: "System Spec Kit template architecture and level routing."
trigger_phrases:
  - "templates"
  - "level architecture"
  - "core addendum"
importance_tier: "normal"
---

# Templates

Source of truth for Spec Kit documentation templates.

## Overview
<!-- ANCHOR:overview -->

Templates follow CORE + ADDENDUM v2.2:
- Core files define shared structure.
- Addendums append level-specific sections.
- `level_1` through `level_3+` contain ready-to-copy templates.

Use level templates for real work. Do not copy from `core/` or `addendum/` directly.

<!-- /ANCHOR:overview -->

## Structure
<!-- ANCHOR:structure -->

| Path | Role |
|---|---|
| `core/` | Base template components |
| `addendum/` | Level-specific extension blocks |
| `level_1/` | Core-only templates for small tasks |
| `level_2/` | Level 1 + verification (`checklist.md`) |
| `level_3/` | Level 2 + architecture (`decision-record.md`) |
| `level_3+/` | Level 3 + governance extensions |
| `examples/` | Filled references only |
| `memory/` | Memory workflow notes (no manual memory files) |

<!-- /ANCHOR:structure -->

## Level Selection
<!-- ANCHOR:level-selection -->

| Level | Typical Size | Required Spec Files |
|---|---|---|
| 1 | <100 LOC | `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` |
| 2 | 100-499 LOC | Level 1 + `checklist.md` |
| 3 | >=500 LOC or architecture risk | Level 2 + `decision-record.md` |
| 3+ | High governance complexity | Level 3 with governance-expanded sections |

LOC is guidance, not a hard limit. Risk and complexity can move work up a level.

<!-- /ANCHOR:level-selection -->

## Workflow Notes
<!-- ANCHOR:workflow-notes -->

- Gate 3 spec-folder choice applies before implementation work.
- `implementation-summary.md` is required for all levels and finalized after implementation.
- Level 2+ completion uses checklist verification (P0, then P1, then P2).
- Memory context is saved via `scripts/dist/memory/generate-context.js`, never manual file creation.

<!-- /ANCHOR:workflow-notes -->

## Related
<!-- ANCHOR:related -->

- `../../references/templates/level_specifications.md`
- `../../references/templates/template_guide.md`
- `../../references/validation/validation_rules.md`
- `../examples/README.md`

<!-- /ANCHOR:related -->
