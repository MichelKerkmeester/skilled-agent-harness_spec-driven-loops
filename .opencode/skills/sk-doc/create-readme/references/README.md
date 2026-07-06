---
title: create-readme Reference Map
description: Overflow-only route map for README and install-guide authoring, grouped into readme/ and install_guide/ single-concern references.
trigger_phrases:
  - "readme reference map"
  - "install guide reference map"
  - "readme creation standards"
  - "install guide standards"
  - "create-readme references"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# create-readme Reference Map

Overflow route map for the `create-readme` packet. The complete authoring workflows live in [`../SKILL.md`](../SKILL.md); this set holds only the deep detail those workflows point to.

---

## 1. OVERVIEW

`SKILL.md` is primary and self-sufficient: it carries the full README authoring workflow (Section 4), the general and code-folder output shapes (Sections 5 and 6), and the five-phase install-guide workflow (Section 7). Open a file below only when a task needs the extra depth, and load the single file that matches the concern rather than a large monolith.

The overflow is grouped by sub-workflow:

- `readme/` holds README type, voice, writing-pattern and quality detail.
- `install_guide/` holds install-guide section examples, platform config and quality standards.

---

## 2. REFERENCE MAP

Load the file that matches the current task.

| Concern | Reference | Load When |
| --- | --- | --- |
| **README types and voice** — the five README types, progressive-disclosure stages and two-tier voice with worked examples | [readme/types_and_voice.md](readme/types_and_voice.md) | Deciding which README type to write, or how narrative and reference voice should split inside one file |
| **README writing patterns** — per-section writing tips, heading hierarchy, analogy patterns, recommended table patterns, code-block and placeholder conventions | [readme/writing_patterns.md](readme/writing_patterns.md) | Drafting individual README sections, or reaching for a proven table or formatting pattern |
| **README quality and checklist** — DQI weighting, per-section quality checks and the full pre-publish checklist | [readme/quality_and_checklist.md](readme/quality_and_checklist.md) | Reviewing a drafted README before delivery |
| **Install-guide section examples** — Section 0/1/2 worked examples plus multi-platform and tool-specific configuration patterns | [install_guide/section_examples.md](install_guide/section_examples.md) | Writing the AI-First prompt, Overview, Prerequisites or platform configuration of an install guide |
| **Install-guide quality and standards** — troubleshooting standards, DQI weighting, minimum requirements, common issues and the pre-publish checklist | [install_guide/quality_and_standards.md](install_guide/quality_and_standards.md) | Writing the troubleshooting section, or reviewing an install guide before delivery |

---

## 3. RELATED RESOURCES

### Overflow Subfolders
- [readme/types_and_voice.md](readme/types_and_voice.md) - README types, progressive disclosure and two-tier voice
- [readme/writing_patterns.md](readme/writing_patterns.md) - Section writing tips and formatting patterns
- [readme/quality_and_checklist.md](readme/quality_and_checklist.md) - README quality criteria and pre-publish checklist
- [install_guide/section_examples.md](install_guide/section_examples.md) - Install-guide section and configuration examples
- [install_guide/quality_and_standards.md](install_guide/quality_and_standards.md) - Install-guide troubleshooting, quality and checklist

### Templates
- [readme_template.md](../assets/readme/readme_template.md) - Fillable scaffold for project, skill, feature and component READMEs
- [readme_code_template.md](../assets/readme/readme_code_template.md) - Code-folder README scaffold with diagram examples
- [install_guide_template.md](../assets/readme/install_guide_template.md) - Full install-guide scaffold and platform config patterns

### Shared Standards
- [core_standards.md](../../shared/references/global/core_standards.md) - Document formatting rules
- [hvr_rules.md](../../shared/references/global/hvr_rules.md) - Human Voice Rules
- [validation.md](../../shared/references/global/validation.md) - Quality scoring (DQI)

---

*End of create-readme reference map — depth lives in the `readme/` and `install_guide/` groups.*
