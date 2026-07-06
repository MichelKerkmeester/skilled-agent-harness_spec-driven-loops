---
title: README Types and Voice
description: The five README types, progressive-disclosure stages and two-tier voice that decide a README's shape and register.
trigger_phrases:
  - "readme types"
  - "readme voice"
  - "two-tier voice"
  - "progressive disclosure readme"
  - "component readme voice"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# README Types and Voice

Overflow detail behind `SKILL.md` Section 4 (README authoring). Use it to choose a README type and set the writing voice before drafting sections.

---

## 1. OVERVIEW

A README answers "What is this?" and "How do I use it?" in a scannable, progressive format. The type and voice decisions below shape every section that follows, so make them before copying a template.

**Core Principle**: Help users succeed in under 2 minutes, then provide depth for those who need it.

**When to Use**:
- Deciding which of the five README types a folder needs
- Setting how much a reader gets at each disclosure stage
- Splitting narrative and reference voice inside one file

The README type decision tree lives in `SKILL.md` Section 2. This reference covers the type table, disclosure stages and voice split that the tree feeds into.

---

## 2. FIVE README TYPES

| Type | Location | Audience | Voice |
|------|----------|----------|-------|
| **Project** | `/README.md` | New contributors, evaluators | Two-tier (narrative + reference) |
| **Skill** | `.opencode/skills/[name]/README.md` | Humans understanding the skill | Two-tier (narrative + reference) |
| **Feature** | `/docs/features/[name]/README.md` | Developers implementing or maintaining | Two-tier (narrative + reference) |
| **Component** | `/src/components/[name]/README.md` | Developers using the component | Technical (reference only) |
| **Code Folder** | `[code-dir]/README.md` | Developers reading or modifying code | Technical (reference only) |

Project, Skill and Feature READMEs use both voice tiers. Component and Code Folder READMEs use the reference tier only.

---

## 3. PROGRESSIVE DISCLOSURE

Essential information first, details on demand.

| Stage | Time | What the Reader Gets |
|-------|------|---------------------|
| Title + one-line tagline | 10 seconds | "What is this?" |
| Overview section | 30 seconds | "Should I care?" |
| Quick Start | 2 minutes | "How do I get it working?" |
| Full documentation | As needed | "How does everything work?" |

Title and tagline answer "what is this". Overview helps the reader decide relevance. Quick Start appears only when there is a runnable path. Detailed reference comes last.

---

## 4. TWO-TIER VOICE

Documents serving mixed audiences (newcomers through experts) use two writing voices in the same file.

**Narrative tier** explains what things do and why they matter. It uses analogies, plain language and active voice. It appears in section intros, Overview, Quick Start and the narrative half of Features (for example, "3.1 How It Works").

**Reference tier** carries precise parameter tables, configuration flags and tool signatures. It is terse and scannable. It appears in the reference half of Features (for example, "3.2 Tool Reference"), Configuration and Related Documents.

### Worked Examples

**Narrative tier** (for Overview, Quick Start, Features 3.1):

> When you search for something, the system does not just look in one place. It checks several sources at once, like a librarian who checks the card catalog, the shelf labels and the reading room sign-out sheet all at the same time.

**Reference tier** (for Features 3.2, Configuration):

| Parameter | Type | Notes |
|-----------|------|-------|
| `query` | string | Free-text search query |
| `limit` | number | 1-100 results (default 10) |

---

## 5. CROSS-REFERENCES

- [writing_patterns.md](writing_patterns.md) - Per-section writing tips, analogy patterns and table patterns
- [quality_and_checklist.md](quality_and_checklist.md) - Quality criteria and pre-publish checklist
- [readme_template.md](../../assets/readme/readme_template.md) - Fillable general README scaffold
- [hvr_rules.md](../../../shared/references/global/hvr_rules.md) - Human Voice Rules
