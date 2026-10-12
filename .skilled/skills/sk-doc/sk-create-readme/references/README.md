---
title: create-readme Reference Map
description: Overflow-only route map for README authoring, grouped into readme/ single-concern references.
trigger_phrases:
  - "readme reference map"
  - "readme creation standards"
  - "create-readme references"
importance_tier: normal
contextType: implementation
version: 1.1.0.7
---

# create-readme Reference Map

Overflow route map for the `create-readme` packet. The complete authoring workflows live in [`../SKILL.md`](../SKILL.md); this set holds only the deep detail those workflows point to.

---

## 1. OVERVIEW

`SKILL.md` is primary and self-sufficient: it carries the full README authoring workflow (Section 4) and the general and code-folder output shapes (Sections 5 and 6). Open a file below only when a task needs the extra depth, and load the single file that matches the concern rather than a large monolith.

The overflow sits in one group: `readme/` holds README type, voice, writing-pattern and quality detail.

---

## 2. REFERENCE MAP

Load the file that matches the current task.

| Concern | Reference | Load When |
| --- | --- | --- |
| **README types and voice**: the five README types, progressive-disclosure stages and two-tier voice with worked examples | [readme/types-and-voice.md](readme/types-and-voice.md) | Deciding which README type to write, or how narrative and reference voice should split inside one file |
| **README writing patterns**: per-section writing tips, heading hierarchy, analogy patterns, recommended table patterns, code-block and placeholder conventions | [readme/writing-patterns.md](readme/writing-patterns.md) | Drafting individual README sections, or reaching for a proven table or formatting pattern |
| **README quality and checklist**, DQI weighting, per-section quality checks and the full pre-publish checklist | [readme/quality-and-checklist.md](readme/quality-and-checklist.md) | Reviewing a drafted README before delivery |

---

## 3. RELATED RESOURCES

### Overflow Subfolder
- [readme/types-and-voice.md](readme/types-and-voice.md) - README types, progressive disclosure and two-tier voice
- [readme/writing-patterns.md](readme/writing-patterns.md) - Section writing tips and formatting patterns
- [readme/quality-and-checklist.md](readme/quality-and-checklist.md) - README quality criteria and pre-publish checklist

### Templates
- [readme-template.md](../assets/readme-template.md) - Fillable scaffold for project, skill, feature and component READMEs
- [readme-code-template.md](../assets/readme-code-template.md) - Code-folder README scaffold with diagram examples

### Shared Standards
- [core-standards.md](../../shared/references/core-standards.md) - Document formatting rules
- [hvr-rules.md](../../sk-create-with-human-voice/references/hvr-rules.md) - Human Voice Rules
- [validation.md](../../shared/references/validation.md) - Quality scoring (DQI)

---

*End of create-readme reference map: depth lives in the `readme/` group.*
