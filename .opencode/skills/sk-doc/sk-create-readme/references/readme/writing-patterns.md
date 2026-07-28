---
title: README Writing Patterns
description: Per-section writing tips, heading hierarchy, analogy patterns, recommended table patterns and code-block conventions for READMEs.
trigger_phrases:
  - "readme writing patterns"
  - "readme section standards"
  - "readme table patterns"
  - "readme analogy patterns"
  - "readme heading hierarchy"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# README Writing Patterns

Overflow detail behind `SKILL.md` Sections 5 and 6 (output shapes). Use it while drafting individual sections or reaching for a proven formatting pattern. The output-shape tables in `SKILL.md` decide which sections to include; this file covers how to write them well.

---

## 1. OVERVIEW

These are the writing patterns that make a README scannable and consistent: what each section is for, how headings nest, when an analogy helps, and which table shapes carry which content.

**Core Principle**: Show it in a table when the content is comparable, and lead every section with what the reader needs first.

**When to Use**:
- Drafting a specific README section and wanting a writing tip
- Choosing a table pattern for comparison, statistics or parameters
- Confirming heading, code-block or placeholder conventions

---

## 2. SECTION WRITING STANDARDS

Workflow guidance for the sections you choose to include. The fillable scaffold is [readme-template.md](../../assets/readme/readme-template.md) Section 6.

### Overview

Establish what this is, why it exists and key metrics. The comparison table is the most persuasive element: lead with the user's problem, then how this solves it. Show concrete differences, not marketing claims.

### Quick Start

Get users to a working state in under 2 minutes. "30-Second Setup" is aspirational, so aim for it. Assume nothing is installed, or state prerequisites clearly.

### Features

Comprehensive feature documentation with two-tier structure. Split into a narrative subsection (`### 3.1 HOW IT WORKS`) and a reference subsection (`### 3.2 TECHNICAL REFERENCE`). Use numbered H3 ALL CAPS subsections with `---` dividers between them, and numbered H4 ALL CAPS sub-subsections (3.1.1, 3.1.2) within narrative subsections. Open each sub-subsection with 1-2 plain-language sentences, and bold key term names on first use.

### Structure

Help users navigate the project. Use an ASCII tree with purpose annotations, 2-3 levels deep.

### Configuration

Complete configuration reference. Show a complete example config, not fragments, and explain the "why" not the "what".

### Usage Examples

Real-world usage patterns users can copy. Build complexity progressively from basic to advanced.

### Troubleshooting

Self-service problem resolution. Lead with what the user sees in their own words, not internal error names. Use "What you see / Common causes / Fix" format, separate issues with `---` dividers and keep each issue self-contained.

### FAQ

Answer frequently asked questions. Bold **Q:** with A: format, 2-3 sentence answers.

### Related Documents

Guide users to additional resources. Use relative paths for internal docs.

---

## 3. STRUCTURAL FORMAT RULES

### Heading Hierarchy

| Level | Format | Example |
|-------|--------|---------|
| **H1** | Plain title, no number | `# Project Name` |
| **H2** | Numbered, ALL CAPS | `## 1. OVERVIEW` |
| **H3 (numbered)** | Numbered, ALL CAPS | `### 3.1 TOPIC NAME` |
| **H3 (unnumbered)** | Title Case | `### Configuration` |
| **H4 (numbered)** | Numbered, ALL CAPS | `#### 3.1.1 SUBTOPIC` |
| **H4 (unnumbered)** | Title Case | `#### Options` |

Numbered subsections appear inside Feature sections (3.1, 3.2 at H3 and 3.1.1, 3.1.2 at H4). Unnumbered subsections appear everywhere else.

### Blockquote Tagline

Place a one-sentence description in a blockquote immediately after the H1 title, before the first `---`.

```markdown
# Spec Kit Memory - MCP Server

> AI memory that persists across sessions, models and tools without poisoning your context window.

---
```

Do not add a Table of Contents and do not add `<!-- ANCHOR -->` navigation comments. READMEs rely on the numbered H2 hierarchy for navigation. Use `---` horizontal rules between H2 sections.

---

## 4. ANALOGY PATTERNS

Analogies make technical concepts stick. Use them in narrative sections of Project, Skill and Feature READMEs. Do not use analogies in Component or Code Folder READMEs.

| Analogy | Good For |
|---------|----------|
| **Librarian** | Search, retrieval, filing, organization |
| **Filing cabinet** | Storage, folders, hierarchy |
| **Bouncer at the door** | Quality gates, validation, rejection |
| **Save point in a video game** | Checkpoints, snapshots, rollback |
| **Triage nurse** | Routing, classification, priority |
| **Assembly line** | Pipelines, stages, sequential processing |

**Rules**: One analogy per concept. Place it after the technical statement, not before. Drop the analogy if the concept is already clear from plain language. Maximum 2 "Think of it as/like" per document.

---

## 5. TABLE PATTERNS

Tables are scannable. Use them for feature comparisons, configuration options, file listings, requirements and quick-reference data.

**"How This Compares"** shows capability comparison. Place it in Overview.

```markdown
| Capability | Without [Project] | With [Project] |
|------------|-------------------|----------------|
| Documentation | Ad hoc, inconsistent | Templated at 4 levels |
| Search | Ctrl+F in files | 5-channel hybrid search |
```

**Key Statistics** shows metrics at a glance. Place it in Overview after the description.

```markdown
| Category | Count | Details |
|----------|-------|---------|
| Spec Memory tools | 39 | MCP registration and full-parity daemon-backed CLI |
| Commands | 14 | 8 spec_kit + 6 memory |
```

**Key Features** summarizes capabilities. Place it in Overview.

```markdown
| Feature | What It Does |
|---------|-------------|
| **Spec Folder Workflow** | Creates documentation for every file-modifying conversation |
| **Hybrid Search** | Checks 5 sources at once and fuses results |
```

**Before/After** shows the contrast. Use it in Overview or Features.

```markdown
| Without [Project] | With [Project] |
|--------------------|----------------|
| Manual config for each file | Zero-config with smart defaults |
| Errors discovered in production | Caught at build time |
```

**Parameter** is a reference-tier table. Use it in Features reference subsections and Configuration.

```markdown
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | required | Free-text search query |
| `limit` | number | `10` | Results to return (1-100) |
```

---

## 6. CODE-BLOCK AND PLACEHOLDER CONVENTIONS

Always specify language for syntax highlighting, and show expected output for verification commands.

```bash
# Install dependencies
npm install

npm --version
# Expected: 10.2.0 or higher
```

Use `[PLACEHOLDER]` format with descriptive names:

| Placeholder | Purpose |
|-------------|---------|
| `[PROJECT_NAME]` | Name of the project |
| `[DESCRIPTION]` | Brief description |
| `[COMMAND]` | Actual command to run |
| `[VERSION]` | Version number |
| `[PATH]` | File or directory path |

---

## 7. CROSS-REFERENCES

- [types-and-voice.md](types-and-voice.md) - README types, progressive disclosure and two-tier voice
- [quality-and-checklist.md](quality-and-checklist.md) - Quality criteria and pre-publish checklist
- [readme-template.md](../../assets/readme/readme-template.md) - Fillable general README scaffold
- [readme-code-template.md](../../assets/readme/readme-code-template.md) - Code-folder README scaffold
- [core-standards.md](../../../shared/references/core-standards.md) - Document formatting rules
