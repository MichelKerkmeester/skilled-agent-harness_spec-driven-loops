---
title: README Creation - Workflow and Quality Standards
description: Standards and workflow for creating README files with scannable structure, progressive disclosure and two-tier voice.
trigger_phrases:
  - "readme creation"
  - "create readme"
  - "readme standards"
  - "readme workflow"
  - "readme quality"
importance_tier: normal
contextType: implementation
---

# README Creation - Workflow and Quality Standards

Standards and workflow for creating README files with scannable structure and progressive disclosure.

---

## 1. OVERVIEW

This reference defines standards for README documentation. READMEs are the entry point to any project, component or feature. They answer "What is this?" and "How do I use it?" in a scannable, progressive format.

**Core Philosophy**: "Help users succeed in under 2 minutes, then provide depth for those who need it."

**Goals**:
- **Orientation** -- Users understand what this is within 10 seconds
- **Self-service** -- Users can get started without asking anyone
- **AI-friendly** -- Parseable structure with a consistent heading hierarchy
- **Consistency** -- Same format across all project documentation

**Requirements**:
- Use only the sections that fit the audience and folder purpose
- Overview must answer "what is this?" in 2-3 sentences
- Add Quick Start, Features, FAQ or Troubleshooting only when the reader needs setup, capability explanation or known-problem help
- All content follows Human Voice Rules ([hvr_rules.md](global/hvr_rules.md))

---

## 2. CORE PRINCIPLES

### README Type Decision Tree

```
Is this a project root?
├─ YES → General README using the sections the audience needs
└─ NO → Is this a reusable component?
        ├─ YES → Component README trimmed to API, examples, configuration and known issues
        └─ NO → Is someone likely to "land here"?
                ├─ YES → Focused README with Overview plus needed navigation or usage
                └─ NO → Skip README, use inline comments
```

### Five README Types

| Type | Location | Audience | Voice |
|------|----------|----------|-------|
| **Project** | `/README.md` | New contributors, evaluators | Two-tier (narrative + reference) |
| **Skill** | `.opencode/skills/[name]/README.md` | Humans understanding the skill | Two-tier (narrative + reference) |
| **Feature** | `/docs/features/[name]/README.md` | Developers implementing or maintaining | Two-tier (narrative + reference) |
| **Component** | `/src/components/[name]/README.md` | Developers using the component | Technical (reference only) |
| **Code Folder** | `[code-dir]/README.md` | Developers reading or modifying code | Technical (reference only) |

### Progressive Disclosure

Essential information first, details on demand.

| Stage | Time | What the Reader Gets |
|-------|------|---------------------|
| Title + one-line tagline | 10 seconds | "What is this?" |
| Overview section | 30 seconds | "Should I care?" |
| Quick Start | 2 minutes | "How do I get it working?" |
| Full documentation | As needed | "How does everything work?" |

### Two-Tier Voice

Documents serving mixed audiences (newcomers through experts) use two writing voices in the same file.

**Narrative tier** -- explains what things do and why they matter. Uses analogies, plain language and active voice. Appears in section intros, Overview, Quick Start and the narrative half of Features (e.g., "3.1 How It Works").

**Reference tier** -- precise parameter tables, configuration flags, tool signatures. Terse and scannable. Appears in the reference half of Features (e.g., "3.2 Tool Reference"), Configuration and Related Documents.

Project, Skill and Feature READMEs use both tiers. Component and Code Folder READMEs use the reference tier only.

---

## 3. REQUIRED SECTIONS

README sections are fit-for-purpose, not a fixed 9-section contract. For include-when guidance by section and README type, see [readme_template.md](../assets/readme/readme_template.md) Section 2 and [readme_code_template.md](../assets/readme/readme_code_template.md) for code-folder READMEs.

**Minimum viable README**: Overview plus the navigation, usage or related-resource links the reader actually needs. Code-folder READMEs must not force Quick Start, Features, FAQ or Troubleshooting unless the directory has runnable commands, meaningful capabilities or known reader problems.

---

## 4. SECTION WRITING STANDARDS

For the current fillable scaffold, see [readme_template.md](../assets/readme/readme_template.md) Section 6. This section covers workflow guidance and writing tips for sections you choose to include.

### Overview (Section 1)

**Purpose**: Establish what this is, why it exists and key metrics.

**Writing tip**: The comparison table is the most persuasive element. Lead with the user's problem, then how this solves it. Show concrete differences, not marketing claims.

### Quick Start (Section 2)

**Purpose**: Get users to a working state in under 2 minutes.

**Writing tip**: "30-Second Setup" is aspirational. Aim for it. Assume nothing is installed (or state prerequisites clearly).

### Features (Section 3)

**Purpose**: Comprehensive feature documentation with two-tier structure.

Split into a narrative subsection (`### 3.1 HOW IT WORKS`) and a reference subsection (`### 3.2 TECHNICAL REFERENCE`). Use numbered H3 ALL CAPS subsections with `---` dividers between them. Use numbered H4 ALL CAPS sub-subsections (3.1.1, 3.1.2) within narrative subsections.

**Writing tip**: Each sub-subsection should open with 1-2 sentences explaining what this capability does in plain language. Bold key term names on first use.

### Structure (Section 4)

**Purpose**: Help users navigate the project. ASCII tree with purpose annotations, 2-3 levels deep.

### Configuration (Section 5)

**Purpose**: Complete configuration reference.

**Writing tip**: Show a complete example config (not fragments). Explain the "why" not the "what."

### Usage Examples (Section 6)

**Purpose**: Real-world usage patterns users can copy. Build complexity progressively from basic to advanced.

### Troubleshooting (Section 7)

**Purpose**: Self-service problem resolution.

**Writing tip**: Lead with what the user sees in their own words, not internal error names. Use "What you see / Common causes / Fix" format. Separate issues with `---` dividers. Keep each issue self-contained.

### FAQ (Section 8)

**Purpose**: Answer frequently asked questions. Bold **Q:** with A: format. 2-3 sentence answers.

### Related Documents (Section 9)

**Purpose**: Guide users to additional resources. Use relative paths for internal docs.

---

## 5. WRITING PATTERNS

### Two-Tier Voice Examples

**Narrative tier** (for Overview, Quick Start, Features 3.1):
> When you search for something, the system does not just look in one place. It checks several sources at once, like a librarian who checks the card catalog, the shelf labels and the reading room sign-out sheet all at the same time.

**Reference tier** (for Features 3.2, Configuration):

| Parameter | Type | Notes |
|-----------|------|-------|
| `query` | string | Free-text search query |
| `limit` | number | 1-100 results (default 10) |

### Structural Format Rules

These rules define how READMEs are formatted at the document level.

**Heading hierarchy**:

| Level | Format | Example |
|-------|--------|---------|
| **H1** | Plain title, no number | `# Project Name` |
| **H2** | Numbered, ALL CAPS | `## 1. OVERVIEW` |
| **H3 (numbered)** | Numbered, ALL CAPS | `### 3.1 TOPIC NAME` |
| **H3 (unnumbered)** | Title Case | `### Configuration` |
| **H4 (numbered)** | Numbered, ALL CAPS | `#### 3.1.1 SUBTOPIC` |
| **H4 (unnumbered)** | Title Case | `#### Options` |

Numbered subsections appear inside Feature sections (3.1, 3.2 at H3 and 3.1.1, 3.1.2 at H4). Unnumbered subsections appear everywhere else.

**Blockquote tagline**: Place a one-sentence description in a blockquote immediately after the H1 title, before the first `---`.

```markdown
# Spec Kit Memory - MCP Server

> AI memory that persists across sessions, models and tools without poisoning your context window.

---
```

**Table of Contents**: Do not add a Table of Contents. READMEs rely on their numbered H2 heading hierarchy for navigation; no TOC block and no `<!-- ANCHOR -->` navigation comments are used.

**Section dividers**: Use `---` horizontal rules between H2 sections.

### Analogy Patterns

Analogies make technical concepts stick. Use them in narrative sections of Project, Skill and Feature READMEs. Do not use analogies in Component or Code Folder READMEs.

| Analogy | Good For |
|---------|----------|
| **Librarian** | Search, retrieval, filing, organization |
| **Filing cabinet** | Storage, folders, hierarchy |
| **Bouncer at the door** | Quality gates, validation, rejection |
| **Save point in a video game** | Checkpoints, snapshots, rollback |
| **Triage nurse** | Routing, classification, priority |
| **Assembly line** | Pipelines, stages, sequential processing |

**Rules**: One analogy per concept. Place after the technical statement, not before. Drop the analogy if the concept is already clear from plain language. Max 2 "Think of it as/like" per document.

### Table-First Approach

Tables are scannable. Use them for feature comparisons, configuration options, file listings, requirements and quick reference data.

### Recommended Table Patterns

**"How This Compares"** -- Show capability comparison. Place in Overview.

```markdown
| Capability | Without [Project] | With [Project] |
|------------|-------------------|----------------|
| Documentation | Ad hoc, inconsistent | Templated at 4 levels |
| Search | Ctrl+F in files | 5-channel hybrid search |
```

**Key Statistics** -- Metrics at a glance. Place in Overview after the description.

```markdown
| Category | Count | Details |
|----------|-------|---------|
| Spec Memory tools | 39 | MCP registration and full-parity daemon-backed CLI |
| Commands | 14 | 8 spec_kit + 6 memory |
```

**Key Features** -- Summarize capabilities. Place in Overview.

```markdown
| Feature | What It Does |
|---------|-------------|
| **Spec Folder Workflow** | Creates documentation for every file-modifying conversation |
| **Hybrid Search** | Checks 5 sources at once and fuses results |
```

**Before/After** -- Show the contrast. Use in Overview or Features.

```markdown
| Without [Project] | With [Project] |
|--------------------|----------------|
| Manual config for each file | Zero-config with smart defaults |
| Errors discovered in production | Caught at build time |
```

**Parameter** -- Reference-tier table. Use in Features reference subsections and Configuration.

```markdown
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | required | Free-text search query |
| `limit` | number | `10` | Results to return (1-100) |
```

### Code Block Standards

Always specify language for syntax highlighting. Show expected output for verification commands.

```bash
# Install dependencies
npm install

npm --version
# Expected: 10.2.0 or higher
```

### Placeholder Conventions

Use `[PLACEHOLDER]` format with descriptive names:

| Placeholder | Purpose |
|-------------|---------|
| `[PROJECT_NAME]` | Name of the project |
| `[DESCRIPTION]` | Brief description |
| `[COMMAND]` | Actual command to run |
| `[VERSION]` | Version number |
| `[PATH]` | File or directory path |

---

## 6. QUALITY CRITERIA

### DQI Components for READMEs

| Component | Weight | What It Measures |
|-----------|--------|------------------|
| **Structure** | 40% | Section organization, heading hierarchy, dividers |
| **Content** | 35% | Commands tested, expected outputs shown, examples provided, completeness |
| **Style** | 25% | HVR compliance, consistent formatting, code blocks with language tags |

### Quality Checks For Included Sections

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

## 7. PRE-PUBLISH CHECKLIST

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
- [ ] Numbered H3/H4 subsections use ALL CAPS (e.g., `### 3.1 HYBRID SEARCH`)
- [ ] Unnumbered H3/H4 use Title Case (e.g., `### Configuration`)
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
- [ ] No banned words (see [hvr_rules.md](global/hvr_rules.md) Section 6)
- [ ] No banned phrases (see [hvr_rules.md](global/hvr_rules.md) Section 7)
- [ ] Active voice throughout. Direct address. Simple words.
- [ ] "However" used max 2 times per file
- [ ] Max 1 ellipsis per file
- [ ] Max 2 "Think of it as/like" per document

---

## 8. CROSS-REFERENCES

### Templates
- [readme_template.md](../assets/readme/readme_template.md) - Selection guide and copy-paste scaffold for new READMEs
- [readme_code_template.md](../assets/readme/readme_code_template.md) - Code-folder README template for developer topology and boundaries

### Standards
- [hvr_rules.md](global/hvr_rules.md) - Human Voice Rules (writing standards)
- [core_standards.md](global/core_standards.md) - Document formatting rules
- [validation.md](global/validation.md) - Quality scoring (DQI)

### Related Creation Guides
- [install_guide_creation.md](./install_guide_creation.md) - Install guide creation workflow
- [skill_creation.md](./skill_creation.md) - Skill creation workflow
- [feature_catalog_creation.md](./feature_catalog_creation.md) - Feature catalog creation workflow
