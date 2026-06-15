---
title: Skill Validation and Packaging
description: Validation requirements and distribution steps for skills - minimal and comprehensive validation, packaging for distribution, and installation.
trigger_phrases:
  - "skill validation requirements"
  - "skill packaging distribution"
  - "quick validate skill"
  - "comprehensive skill validation"
  - "skill installation steps"
importance_tier: normal
contextType: implementation
---

# Skill Validation and Packaging

How to validate a skill before release and package it for distribution, covering both the minimal pre-package check and the comprehensive quality pass.

---

## 1. OVERVIEW

This reference covers the two validation tiers a skill passes before release and the distribution steps that follow. Minimal validation is a fast pre-packaging sanity check; comprehensive validation is a full quality pass before distribution.

**Core Principle**: Validate before you package, and package before you distribute.

**When to Use**:
- Before packaging a skill into a distributable zip
- Before releasing or sharing a skill
- When diagnosing why `package_skill.py` rejected a skill

**Key Sources**:
- `scripts/quick_validate.py` - minimal frontmatter sanity check
- `scripts/extract_structure.py` - structure checklist for comprehensive validation
- `scripts/package_skill.py` - validation plus packaging

---

## 2. VALIDATION REQUIREMENTS

### Minimal Validation (quick_validate.py)

**Purpose**: Pre-packaging sanity check for essential frontmatter requirements.

**Checks**:
1. SKILL.md file exists
2. YAML frontmatter present
3. Required fields: name, description
4. Name format: hyphen-case
5. No angle brackets in description
6. **Platform compatibility** - Features work across different AI agent environments

**Output**: Pass/fail with error messages

**When to use**: Automatically during packaging

### Comprehensive Validation (markdown-document-specialist)

**Purpose**: Full quality assurance for production-ready skills.

**What “comprehensive validation” means in this repo**:

- **Structure checklist (script)**: Deterministic checks from `extract_structure.py` (frontmatter, headings, required sections, fenced code blocks).
- **Content quality (AI)**: Judgement based on the extracted JSON + the actual text (clarity, completeness, examples).
- **Style compliance (AI)**: Judgement against `core_standards.md` (headings format, bullets, emoji rules, consistency).

**Quality gate (qualitative)**:
- **SKILL.md must have zero checklist failures**.
- If content is unclear/incomplete, iterate until the doc is production-ready (no major gaps).

**When to use**: After packaging, before distribution

**Command**:
```bash
scripts/extract_structure.py .opencode/skills/my-skill/SKILL.md
# AI evaluates the JSON output and provides quality assessment
```

---

## 3. DISTRIBUTION

### Packaging for Distribution

**Command**:
```bash
scripts/package_skill.py <path/to/skill> <output-directory>
```

**Output**: Zip file ready for distribution

**Distribution Checklist**:
- ✅ Validation passed
- ✅ Final review completed (no critical gaps)
- ✅ All bundled resources included
- ✅ README or documentation provided
- ✅ Version number in frontmatter
- ✅ License information (if applicable)

### Installation

**User installation**:
1. Download skill zip file
2. Extract to `.opencode/skills/` directory
3. Skill automatically available to the agent

**Verification**:
- Check skill appears in the agent's skill list
- Test skill with example use case
- Verify bundled resources accessible

---

## 4. RELATED RESOURCES

### Sibling Skill-Creation References
- [creation_workflow.md](./creation_workflow.md) - The 6-step skill creation process
- [common_pitfalls.md](./common_pitfalls.md) - Common skill-creation pitfalls and fixes
- [overview.md](./overview.md) - Skill anatomy and structure system

### Reference Files
- [core_standards.md](../global/core_standards.md) - Document type rules and structural requirements
- [validation.md](../global/validation.md) - Quality scoring and validation workflows
