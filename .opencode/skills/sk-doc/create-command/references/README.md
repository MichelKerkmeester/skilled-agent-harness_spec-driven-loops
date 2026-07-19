---
title: Command Creation Reference Map
description: Route map over the command-creation overflow references - worked split example, router/presentation split, argument-hint and mode design, and common pitfalls.
trigger_phrases:
  - "command creation reference"
  - "slash command worked example"
  - "router presentation split"
  - "argument hint design"
  - "auto confirm command modes"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Command Creation Reference Map

Routing hub for the command-creation overflow set. `create-command/SKILL.md` is the authoritative numbered workflow; the depth that would bloat it lives here as single-concern files, and this map points each concern to its file.

---

## 1. OVERVIEW

This file is a thin index over the command-creation reference set. Every piece of overflow — the fully worked split example, how to separate a router from its presentation, how to design argument hints and `:auto`/`:confirm` modes, and the mistakes to avoid — lives in its own focused file. Open only the one the current task needs.

**Core principle**: Commands are executable entry points. Keep reusable doctrine in skills, long display language in presentation assets, and runtime role boundaries in agents. These references are examples and edge cases, never a replacement for the SKILL.md workflow.

---

## 2. REFERENCE MAP

Load the file that matches the current task:

| Concern | Reference | Load When |
| --- | --- | --- |
| **A complete worked command** — the canonical file contract, its invariants, and a fully worked mode-based split (router `.md` plus presentation `.txt`) | [worked-example.md](worked-example.md) | Modeling the output package shape for a new namespace or split command |
| **Splitting a router from its presentation** — ownership recap, the before/after transformation, and the behavior-preserving rule | [router-presentation-split.md](router-presentation-split.md) | Refactoring a mode-based command into a thin router plus a presentation asset |
| **Declaring arguments and modes** — argument-hint design patterns, `:auto`/`:confirm` mode design, and frontmatter/description/`allowed-tools` budget tips | [argument-hints-and-modes.md](argument-hints-and-modes.md) | Writing `argument-hint`, choosing modes, or tightening frontmatter |
| **Choosing right and common mistakes** — command vs skill vs agent selection and the recurring command-authoring defects with fixes | [common-pitfalls.md](common-pitfalls.md) | Deciding whether a command is even the right component, or reviewing a drafted command |

---

## 3. RELATED RESOURCES

### Command-Creation References
- [worked-example.md](worked-example.md) - Canonical file contract and a fully worked split command
- [router-presentation-split.md](router-presentation-split.md) - Router/presentation separation transformation
- [argument-hints-and-modes.md](argument-hints-and-modes.md) - Argument-hint patterns, mode design, and frontmatter budget
- [common-pitfalls.md](common-pitfalls.md) - Component selection and common command mistakes

### Templates
- [command-template.md](../assets/command/command-template.md) - Command type templates, gates, dispatch, modes, and validation checklist
- [command-presentation-template.md](../assets/command/command-presentation-template.md) - Presentation asset skeleton for split command families

### Shared Reference Files
- [core-standards.md](../../shared/references/core-standards.md) - Document type rules and structural requirements
- [validation.md](../../shared/references/validation.md) - Quality scoring and validation workflows
- [validate_document.py](../../shared/scripts/validate_document.py) - Blocking structure validator
- [extract_structure.py](../../shared/scripts/extract_structure.py) - Structure extraction helper

---

*End of Command Creation reference map — the authoritative workflow lives in `create-command/SKILL.md`.*
