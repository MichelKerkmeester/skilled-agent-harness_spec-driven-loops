---
title: README Quality and Pre-Publish Checklist
description: DQI weighting, per-section quality checks and the full pre-publish checklist for README documents.
trigger_phrases:
  - "readme quality criteria"
  - "readme dqi"
  - "readme pre-publish checklist"
  - "readme section quality checks"
  - "readme review checklist"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# README Quality and Pre-Publish Checklist

Overflow detail behind `SKILL.md` Section 8 (validation and audit). Use it to review a drafted README before delivery. `SKILL.md` lists the short pre-publish checks; this file carries the DQI weighting, per-section checks and the full itemized checklist.

---

## 1. OVERVIEW

Quality for a README is weighted toward structure and content, then style. Score against the components below, then walk the pre-publish checklist for the sections the README actually includes.

**Core Principle**: Apply every check only to the sections that fit the README's audience and purpose. Do not force sections a code folder never needed.

**When to Use**:
- Scoring a drafted README before delivery
- Confirming an included section meets its quality bar
- Running the final pre-publish pass

---

## 2. DQI COMPONENTS

| Component | Weight | What It Measures |
|-----------|--------|------------------|
| **Structure** | 40% | Section organization, heading hierarchy, dividers |
| **Content** | 35% | Commands tested, expected outputs shown, examples provided, completeness |
| **Style** | 25% | HVR compliance, consistent formatting, code blocks with language tags |

---

## 3. QUALITY CHECKS FOR INCLUDED SECTIONS

Apply these checks only to sections that fit the README audience and purpose.

| Section | Requirements |
|---------|-------------|
| **Overview** | 2-3 sentence description, at least one table (statistics, comparison or features) |
| **Quick Start** | Numbered steps, copy-paste commands, verification command |
| **Features** | Grouped by category, usage examples for key features |
| **Structure** | ASCII tree, key files table |
| **Configuration** | File path, all options table, environment variables |
| **Usage Examples** | 3+ examples (simple to advanced), common patterns table |
| **Troubleshooting** | 3+ issues, "What you see / Causes / Fix" format, diagnostic commands |
| **FAQ** | 2+ questions per category, bold Q:/A: format |
| **Related Documents** | Internal links table, external links table |

---

## 4. PRE-PUBLISH CHECKLIST

### Structure

- [ ] Title with one-line blockquote tagline
- [ ] No Table of Contents and no `<!-- ANCHOR -->` navigation comments
- [ ] All included sections have content (no empty sections)
- [ ] Section numbers are sequential
- [ ] Horizontal rules between H2 sections

### Content

- [ ] All `[PLACEHOLDER]` markers replaced with actual content
- [ ] Overview explains what AND why
- [ ] Quick Start achievable in under 2 minutes
- [ ] All commands tested and working
- [ ] Expected outputs shown for verification commands
- [ ] At least 3 usage examples (simple to advanced)
- [ ] At least 3 troubleshooting entries

### Quality

- [ ] All code blocks specify language
- [ ] All internal links verified working
- [ ] Tables properly formatted
- [ ] No spelling or grammar errors
- [ ] Consistent terminology throughout

### Style

- [ ] H2 headings use numbered ALL CAPS format
- [ ] Numbered H3/H4 subsections use ALL CAPS (for example, `### 3.1 HYBRID SEARCH`)
- [ ] Unnumbered H3/H4 use Title Case (for example, `### Configuration`)
- [ ] File paths in backticks
- [ ] Commands in fenced code blocks
- [ ] Key terms bolded consistently

### HVR Compliance

- [ ] No em dashes. Use commas, periods or colons instead.
- [ ] No semicolons. Split into two sentences or use "and".
- [ ] No Oxford commas. Remove comma before final "and/or" in lists.
- [ ] No "not just X, but also Y" patterns
- [ ] No exactly three-item inline lists. Use 2, 4 or 5 items (tables and bullet lists exempt).
- [ ] No setup language ("Let's explore", "dive in", "when it comes to")
- [ ] No banned words (see [hvr_rules.md](../../../shared/references/hvr_rules.md) Section 6)
- [ ] No banned phrases (see [hvr_rules.md](../../../shared/references/hvr_rules.md) Section 7)
- [ ] Active voice throughout. Direct address. Simple words.
- [ ] "However" used max 2 times per file
- [ ] Max 1 ellipsis per file
- [ ] Max 2 "Think of it as/like" per document

---

## 5. CROSS-REFERENCES

- [types_and_voice.md](types_and_voice.md) - README types, progressive disclosure and two-tier voice
- [writing_patterns.md](writing_patterns.md) - Section writing tips and formatting patterns
- [validation.md](../../../shared/references/validation.md) - Quality scoring (DQI)
- [hvr_rules.md](../../../shared/references/hvr_rules.md) - Human Voice Rules
