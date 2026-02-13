---
title: README Creation - Templates and Standards
description: Templates for creating comprehensive, AI-optimized README files with consistent structure and progressive disclosure.
---

# README Creation - Templates and Standards

Templates for creating README files with scannable structure and progressive disclosure.

---

## 1. 📖 OVERVIEW

**Purpose**: README files are the entry point to any project, component, or feature. They answer "What is this?" and "How do I use it?" in a scannable, progressive format.

**Key Characteristics**:
- **Entry point**: First document users encounter
- **Scannable**: Designed for quick evaluation, not linear reading
- **Progressive disclosure**: Quick Start first, details later
- **Self-contained**: Can be understood without reading other docs
- **Multi-audience**: Serves evaluators, users, and troubleshooters

**Location**: Project root (`README.md`) or component/feature directories

**Core Philosophy**: "Help users succeed in under 2 minutes, then provide depth for those who need it."

A good README lets someone:
1. Understand what this is (10 seconds)
2. Decide if it's relevant (30 seconds)
3. Get it working (2 minutes)
4. Find advanced details (when needed)

**Benefits**:
- Reduces "what is this?" questions
- Enables self-service onboarding
- AI assistants can parse and extract information reliably
- Consistent experience across all project documentation

### How READMEs Compare to Other Documents

| Aspect | README | Install Guide | SKILL.md |
|--------|--------|---------------|----------|
| **Primary purpose** | Orientation + navigation | Step-by-step setup | AI agent instructions |
| **Reading pattern** | Scanned, non-linear | Sequential, phased | Referenced during execution |
| **Key metric** | Time to understand | Time to working install | Agent task success rate |
| **Primary audience** | Humans evaluating/using | Humans installing | AI agents executing |
| **Tone** | Welcoming, explanatory | Precise, imperative | Instructional, rule-based |

---

## 2. 🎯 WHEN TO CREATE READMEs

**Create READMEs when**:
- Starting a new project (root-level README is mandatory)
- Creating a reusable component or module
- Building a user-facing feature that needs documentation
- Supplementing a SKILL.md with user-oriented context
- Any directory that someone might "land in" and need orientation

**Keep minimal when**:
- Simple utility scripts (inline comments may suffice)
- Internal implementation details (code comments better)
- Content already well-documented elsewhere (link instead)
- Temporary or experimental code



**Decision Tree**:
```
Is this a project root?
├─ YES → Create comprehensive README (all sections)
└─ NO → Is this a reusable component?
        ├─ YES → Create component README (Overview, Quick Start, Usage, Troubleshooting)
        └─ NO → Is someone likely to "land here"?
                ├─ YES → Create minimal README (Overview, Quick Start)
                └─ NO → Skip README, use inline comments
```

---

## 3. 📂 README TYPES

| Type | Purpose | Location | Audience | Key Focus |
|------|---------|----------|----------|-----------|
| **Project** | Root-level documentation for the entire project | `/README.md` | New contributors, evaluators, users | What is this project? How do I get started? Where do I find things? |
| **Component** | Documentation for a reusable module or library | `/src/components/[component]/README.md` or `/packages/[pkg]/README.md` | Developers using the component | What does this component do? How do I use it? What are the options? |
| **Feature** | Documentation for a specific feature or system | `/docs/features/[feature]/README.md` or `/src/features/[feature]/README.md` | Developers implementing or maintaining the feature | How does this feature work? How do I configure it? |
| **Skill** | Supplementary documentation for an AI skill (alongside SKILL.md) | `.opencode/skill/[skill-name]/README.md` | Humans who want to understand the skill before using it | What does this skill do? When should I use it? What are common patterns? |

### Section Requirements by Type

| Section | Project | Component | Feature | Skill |
|---------|---------|-----------|---------|-------|
| 1. Overview | ✅ Required | ✅ Required | ✅ Required | ✅ Required |
| 2. Quick Start | ✅ Required | ✅ Required | ✅ Required | ✅ Required |
| 3. Structure | ✅ Required | ⚠️ Optional | ⚠️ Optional | ⚠️ Optional |
| 4. Features | ⚠️ Optional | ✅ Required | ✅ Required | ✅ Required |
| 5. Configuration | ⚠️ Optional | ⚠️ Optional | ✅ Required | ⚠️ Optional |
| 6. Usage Examples | ⚠️ Optional | ✅ Required | ✅ Required | ✅ Required |
| 7. Troubleshooting | ✅ Required | ✅ Required | ✅ Required | ✅ Required |
| 8. FAQ | ⚠️ Optional | ⚠️ Optional | ⚠️ Optional | ✅ Required |
| 9. Related Documents | ✅ Required | ⚠️ Optional | ⚠️ Optional | ⚠️ Optional |

---

## 4. 🏗️ STANDARD README STRUCTURE

Every README follows a 9-section structure. Use what's needed, remove what's not.

| # | Section | Purpose | Key Content |
|---|---------|---------|-------------|
| 1 | **Overview** | Establish context | What is this, statistics, features, requirements |
| 2 | **Quick Start** | Enable fast success | 30-second setup, verification, first use |
| 3 | **Structure** | Aid navigation | Directory tree, key files table |
| 4 | **Features** | Document capabilities | Feature groups, options, comparisons |
| 5 | **Configuration** | Reference settings | Config files, options, env vars |
| 6 | **Usage Examples** | Show patterns | 3+ examples, common patterns table |
| 7 | **Troubleshooting** | Enable self-service | Common issues, quick fixes, diagnostics |
| 8 | **FAQ** | Answer common questions | Q&A format, general + technical |
| 9 | **Related Documents** | Guide to more info | Internal docs, external resources |



---

## 5. 📝 SECTION DEEP DIVES

> 📋 See §13 Complete Template for the copy-paste scaffold.

**Universal Writing Tips**:
- Test every command before documenting
- Show expected output for verification
- Use tables for scannable data
- Order content by frequency (most common first)

### Overview Section (1)

**Purpose**: Establish what this is, why it exists, and key metrics at a glance.

**Must include**:
- Brief description (2-3 sentences)
- Key statistics table (if metrics exist)
- Key features table (3-6 items)
- Requirements/prerequisites

**Writing Tips**:
- Lead with value proposition (why should I care?)
- Keep descriptions action-oriented ("enables X" not "is designed for X")
- Statistics build credibility - include if available

### Advanced Overview Patterns

These patterns appear in mature project READMEs and go beyond the basic template:

**Badge Shields**: Display project status badges above the H1 title using a left-aligned wrapper:
```markdown
<div align="left">

[![Stars](https://img.shields.io/github/stars/org/repo)](https://github.com/org/repo)
[![License](https://img.shields.io/github/license/org/repo)](./LICENSE)

</div>
```

**Architecture Diagrams**: Use ASCII box diagrams to show system connections (beyond directory trees):
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client   │────▶│  Server  │────▶│ Database │
└──────────┘     └────┬─────┘     └──────────┘
                      │
                 ┌────▼─────┐
                 │  Cache    │
                 └──────────┘
```

**Innovation/Differentiator Tables**: Showcase what makes the project unique:
```markdown
| Innovation | Impact | Description |
|------------|--------|-------------|
| **[Name]** | [Metric] | [What it does differently] |
```

**Before/After Comparisons**: Persuasive two-column layout for positioning:
```markdown
| Without [PROJECT] | With [PROJECT] |
|--------------------|----------------|
| Manual config for each file | Zero-config with smart defaults |
| Errors discovered in production | Caught at build time |
| 30-minute onboarding | 2-minute Quick Start |
```

### Quick Start Section (2)

**Purpose**: Get users to a working state in under 2 minutes.

**Must include**:
- Numbered setup steps with copy-paste commands
- Verification command to confirm success
- Simplest possible first use example

**Writing Tips**:
- Assume nothing is installed (or state prerequisites clearly)
- "30-Second Setup" is aspirational - aim for it

### Structure Section (3)

**Purpose**: Help users navigate the project/component.

**Must include**:
- ASCII directory tree
- Purpose annotations for key directories/files
- Key files table

**Writing Tips**:
- Only show relevant structure (not every file)
- Annotate with `# Purpose` comments in tree
- 2-3 levels deep is usually sufficient

### Features Section (4)

**Purpose**: Comprehensive feature documentation with examples.

**Must include**:
- Feature groupings by category
- Usage examples for each feature
- Options/flags tables where applicable

**Writing Tips**:
- Show before/after or input/output examples
- Include comparison tables when multiple options exist

### Configuration Section (5)

**Purpose**: Complete configuration reference.

**Must include**:
- Config file location and format
- All options with types, defaults, descriptions
- Environment variables

**Writing Tips**:
- Show complete example config (not fragments)
- Document ALL defaults
- Explain the "why" not just the "what"

### Usage Examples Section (6)

**Purpose**: Real-world usage patterns users can copy.

**Must include**:
- 3+ examples from simple to advanced
- Common patterns table
- Expected results for each example

**Writing Tips**:
- Build complexity progressively (basic → advanced)
- Use realistic examples, not toy data

### Troubleshooting Section (7)

**Purpose**: Self-service problem resolution.

**Must include**:
- Common issues with symptom/cause/solution
- Quick fixes table
- Diagnostic commands

**Writing Tips**:
- Lead with user-visible symptoms (what they SEE)
- Provide copy-paste solutions

### FAQ Section (8)

**Purpose**: Answer frequently asked questions.

**Must include**:
- General questions (what/why)
- Technical questions (how)
- Bold Q: with A: format

**Writing Tips**:
- Keep answers concise (2-3 sentences max)
- Actually answer the question asked

### Related Documents Section (9)

**Purpose**: Guide users to additional resources.

**Must include**:
- Internal documentation links
- External resource links
- Purpose description for each

**Writing Tips**:
- Use relative paths for internal docs
- Verify all links work

---

## 6. ✍️ WRITING PATTERNS

### Progressive Disclosure

Essential information first, details on demand: title + one-line (10s) → overview (30s) → quick start (2m) → full docs (as needed).

### Table-First Approach

Tables are scannable. Use them for feature comparisons, configuration options, file listings, requirements, and quick reference.

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18+ | 20+ |
| npm | 9+ | 10+ |

### Code Block Standards

Always specify language for syntax highlighting:

```bash
# Install dependencies
npm install

npm --version
# Expected: 10.2.0 or higher
```

### Placeholder Conventions

Use `[PLACEHOLDER]` format with descriptive names:

```markdown
[PROJECT_NAME]      # Name of the project
[DESCRIPTION]       # Brief description
[COMMAND]           # Actual command to run
[VERSION]           # Version number
[PATH]              # File or directory path
```

For optional content:
```markdown
<!-- Optional: Remove if not applicable -->
[Optional section content]
```

---

## 7. 🎨 STYLE REFERENCE

### Emoji Usage

| Element | Rule | Example |
|---------|------|---------|
| H1 | Never | `# Project Name` |
| H2 | Always (numbered) | `## 1. 📖 OVERVIEW` |
| H3 | Never | `### Configuration` |
| H4+ | Never | `#### Options` |

**Standard Section Emojis**:
- 📖 Overview
- 🚀 Quick Start
- 📁 Structure
- ⚡ Features
- ⚙️ Configuration
- 💡 Usage Examples
- 🛠️ Troubleshooting
- ❓ FAQ
- 📚 Related Documents

### Formatting Conventions

| Element | Format | Example |
|---------|--------|---------|
| File paths | Backticks | \`path/to/file.md\` |
| Commands | Fenced code blocks | \`\`\`bash ... \`\`\` |
| Options/flags | Backticks | \`--flag\` |
| Key terms | Bold | **term** |
| Variables | Backticks + caps | \`VAR_NAME\` |
| Placeholders | Brackets | `[PLACEHOLDER]` |

### Section Numbering

- Always use `N. ` prefix before emoji: `## 1. 📖 OVERVIEW`
- Maintain sequential numbering
- Update TOC links when removing sections
- Link format: `#n--section-name` (number + double-dash + lowercase-hyphenated)

### TOC Link Format

```markdown
- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
```

Note the double-dash after the number in the anchor.

### Anchor Tag Placement

Anchors open AFTER the H2 heading line, and content sits between the open/close tags:
```markdown
## N. 📖 SECTION_NAME
<!-- ANCHOR:section-name -->
[section content here]
<!-- /ANCHOR:section-name -->
```

Never place anchor tags before the heading. Each `<!-- ANCHOR:name -->` must have a matching `<!-- /ANCHOR:name -->`.

### TOC Consistency Rule

Every TOC entry MUST have a matching H2 heading. Every H2 heading SHOULD have a TOC entry. No phantom links allowed — if a TOC link points to a heading that doesn't exist, it's a broken document.

### Badge Placement

Badges go above H1 in a `<div align="left">` wrapper. The blockquote tagline goes immediately after H1, before the first horizontal rule (`---`).

---

## 8. ✅ README CHECKLIST

Before finalizing a README, verify all applicable items:

### Structure
- [ ] Title with one-line description (blockquote)
- [ ] Table of contents with working anchor links
- [ ] All included sections have content (no empty sections)
- [ ] Section numbers are sequential
- [ ] Horizontal rules between major sections
- [ ] Every `<!-- ANCHOR:name -->` has a matching `<!-- /ANCHOR:name -->`
- [ ] No orphaned opening or closing anchor tags
- [ ] TOC entries match actual H2 headings (no phantom links)
- [ ] Section numbers in H2 headings match TOC order

### Content
- [ ] All `[PLACEHOLDER]` markers replaced with actual content
- [ ] Overview explains what AND why
- [ ] Quick Start achievable in <2 minutes
- [ ] All commands tested and working
- [ ] Expected outputs shown for verification commands
- [ ] At least 3 usage examples (simple to advanced)
- [ ] At least 3 troubleshooting entries

### Quality
- [ ] All code blocks specify language
- [ ] All internal links verified working
- [ ] All external links verified working
- [ ] Tables are properly formatted
- [ ] No spelling or grammar errors
- [ ] Consistent terminology throughout

### Style
- [ ] Emoji only on H2 headings
- [ ] TOC links match section headers exactly
- [ ] File paths in backticks
- [ ] Commands in fenced code blocks
- [ ] Key terms bolded consistently

---

## 9. 💡 PATTERNS FROM EXISTING READMES

### Effective Overview Pattern

From well-structured project READMEs:

```markdown
## 1. 📖 OVERVIEW

### What is [Project]?

[Project] is a [category] that [primary action]. It provides [key benefit 1] 
and [key benefit 2] for [target audience].

### Key Statistics

| Metric | Value | Notes |
|--------|-------|-------|
| Components | 42 | Across 8 categories |
| Test coverage | 94% | Unit + integration |
| Install time | <2 min | Via npm |

### Key Features

| Feature | Description |
|---------|-------------|
| **Fast Setup** | Working in under 2 minutes |
| **Zero Config** | Sensible defaults, optional customization |
| **Type Safe** | Full TypeScript support |
```

**Additional patterns** (Quick Start, Troubleshooting, Showcase, Before/After) follow the same principles demonstrated above. See §5 for section-specific writing tips.

---

## 10. 🔄 README MAINTENANCE

### When to Update

| Trigger | Update Timing |
|---------|---------------|
| New features added | Immediately |
| Breaking changes introduced | Immediately |
| Installation process changes | Immediately |
| Dependencies change significantly | Immediately |
| Version number bumps | Periodically |
| Link rot (broken external links) | Periodically |
| Outdated screenshots or examples | Periodically |
| User-reported confusion | Periodically |

### Version Tracking

Include version info in major READMEs:

```markdown
---
*Documentation version: 2.1 | Last updated: 2025-01-15 | Project version: 1.4.0*
```

### Link Maintenance

Regularly verify:
- Internal links still resolve
- External links haven't moved
- Anchor links match section headers

```bash
# Check for broken links (if using markdown-link-check)
markdown-link-check README.md
```

### Deprecation

If deprecating a project/component:

1. Add notice at top:
```markdown
> ⚠️ **DEPRECATED**: This project is no longer maintained. 
> See [Alternative](./path/to/alternative) for a replacement.
```

2. Keep README available for existing users
3. Update "Related Documents" to point to replacement

---

## 11. 📄 YAML FRONTMATTER SCHEMA

README files that should be indexed by the Spec Kit Memory system can include YAML frontmatter at the very top of the file. This metadata enables semantic search, trigger-phrase matching, and importance-based ranking.

### Frontmatter Format

```yaml
---
title: "Human-readable title"
description: "Brief description for memory indexing"
trigger_phrases:
  - "phrase that should surface this document"
  - "another trigger phrase"
importance_tier: "normal"  # constitutional | critical | important | normal | temporary
---
```

### Field Reference

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `title` | Yes | string | Human-readable title used in search results and memory listings |
| `description` | Yes | string | Brief summary (1-2 sentences) used for indexing and display |
| `trigger_phrases` | No | string[] | Phrases that cause this document to surface during `memory_match_triggers()` |
| `importance_tier` | No | enum | Controls ranking priority in search results (default: `normal`) |

### Importance Tiers

| Tier | Weight | Use When |
|------|--------|----------|
| `constitutional` | Highest | Core rules and constraints that must always surface |
| `critical` | High | Key decisions, architectural patterns |
| `important` | Medium-High | Significant features, important references |
| `normal` | Medium | Standard documentation (default for READMEs) |
| `temporary` | Low | Ephemeral content, session-specific notes |

### When Frontmatter is Needed

| Context | Needed? | Reason |
|---------|---------|--------|
| README inside `.opencode/skill/` and should be discoverable by memory system | ✅ Required | Enables semantic search and trigger-phrase matching |
| Document contains decision rationale or architectural context for future sessions | ✅ Required | Context preservation and memory retrieval |
| Specific trigger phrases should surface the document during prompt matching | ✅ Required | Automatic context surfacing |
| Standard project root `README.md` (not memory-indexed) | ⚠️ Optional | Not indexed by memory system |
| File is inside `scratch/` directory (temporary) | ⚠️ Optional | Temporary by nature |
| Content already captured in dedicated memory files | ⚠️ Optional | Redundant with existing memories |
| Purely for human consumption with no AI retrieval intent | ❌ Not needed | No memory indexing required |
| One-off guide unlikely to be referenced again | ❌ Not needed | No future retrieval expected |

### Example: Skill README with Frontmatter

```markdown
---
title: "Chrome DevTools Workflow"
description: "Instructions for browser debugging via CLI and MCP approaches"
trigger_phrases:
  - "debug in browser"
  - "chrome devtools"
  - "inspect element"
  - "console errors"
importance_tier: "important"
---

# Chrome DevTools Workflow

> Browser debugging orchestrator for CLI and MCP approaches.

...
```

---

## 12. 🏷️ ANCHOR TEMPLATES FOR STRUCTURED RETRIEVAL

Memory files and spec folder documents (including READMEs) use a standardized set of **retrieval anchors** for fine-grained context extraction. These anchors enable the memory system to pull specific sections without loading entire files.

### Memory Anchor Format

```markdown
<!-- ANCHOR: anchor-name -->
Content for this section...
<!-- /ANCHOR: anchor-name -->
```

### Standard Memory Anchors

These anchor names are recognized by `memory_search()` and `memory_context()` for targeted retrieval:

| Anchor | Purpose | Typical Content |
|--------|---------|-----------------|
| `summary` | Brief overview of the document | 2-3 sentence description of purpose and key content |
| `state` | Current status | Implementation progress, what's done vs remaining |
| `decisions` | Decision rationale | Why choices were made, alternatives considered |
| `context` | Background information | Prerequisites, assumptions, environmental context |
| `artifacts` | Files and outputs | List of files created, modified, or referenced |
| `next-steps` | Planned future work | What to do next, continuation instructions |
| `blockers` | Issues preventing progress | Problems encountered, dependencies, open questions |

### Anchor Template

Use this skeleton when creating memory-indexed documents:

```markdown
<!-- ANCHOR: summary -->
Brief overview of this document's purpose and key content.
<!-- /ANCHOR: summary -->

<!-- ANCHOR: state -->
Current status and implementation state.
- Completed: [what's done]
- Remaining: [what's left]
<!-- /ANCHOR: state -->

<!-- ANCHOR: decisions -->
Key decisions and their rationale.
- Decision: [what was decided]
  - Reason: [why]
  - Alternatives considered: [what else was evaluated]
<!-- /ANCHOR: decisions -->

<!-- ANCHOR: context -->
Background information needed to understand this work.
<!-- /ANCHOR: context -->

<!-- ANCHOR: artifacts -->
Files created or modified:
- `path/to/file.ts` - [purpose]
<!-- /ANCHOR: artifacts -->

<!-- ANCHOR: next-steps -->
What to do next:
1. [First priority]
2. [Second priority]
<!-- /ANCHOR: next-steps -->

<!-- ANCHOR: blockers -->
Issues preventing progress:
- [Blocker description and any known workarounds]
<!-- /ANCHOR: blockers -->
```

### Anchor Rules

- **Format**: `<!-- ANCHOR: name -->` to open, `<!-- /ANCHOR: name -->` to close (note the space after `ANCHOR:`)
- **IDs**: Lowercase with hyphens only (e.g., `next-steps`, not `NextSteps`)
- **No nesting**: Anchors must not overlap or nest inside each other
- **Include only what applies**: Not every document needs all seven anchors; use what's relevant
- **Minimum for memory files**: `summary` anchor is strongly recommended for all indexed documents
- **Retrieval**: Use `memory_search({ query: "...", anchors: ["state", "next-steps"] })` to extract specific sections

### README Anchors and Memory Integration

README files under `.opencode/skill/` are automatically indexed by the Spec Kit Memory system. They use **section-based anchor names** like `overview`, `quick-start`, `features`, `troubleshooting`, etc. (matching H2 sections). These differ from **memory-specific anchors** (`summary`, `state`, `decisions`, `next-steps`) used in memory files for session continuity.

**README Anchor Conventions**:
- Match H2 section names (e.g., `<!-- ANCHOR:overview -->` for the Overview section)
- Lowercase, alphanumeric with hyphens only (e.g., `quick-start`, not `Quick Start`)
- No session IDs (unlike memory files)
- Minimum: Every README should have at least an `overview` anchor

**How README Indexing Works**:
- Discovered by `findSkillReadmes()` during `memory_index_scan()`
- Classified as `semantic` memory type (documentation describing concepts)
- Assigned `normal` tier with reduced importance weight (0.3) — surfaces when relevant but never outranks user work memories
- Searchable via `memory_search({ query: "..." })` alongside memory files
- Grouped under `skill:SKILL-NAME` spec folder identifier

---

## 13. 📋 COMPLETE TEMPLATE

Copy and customize this template. Replace all `[PLACEHOLDER]` markers with actual content. Remove sections that don't apply (keep minimum: Overview, Quick Start, Troubleshooting).

```markdown
<!-- Optional: for memory-indexed READMEs
---
title: "[PROJECT_NAME]"
description: "[Brief description for memory indexing]"
---
-->

<!-- Optional: GitHub badges
<div align="left">

[![Stars](https://img.shields.io/github/stars/org/repo)](https://github.com/org/repo)
[![License](https://img.shields.io/github/license/org/repo)](./LICENSE)

</div>
-->

# [PROJECT_NAME]

> [One-sentence description of what this is and its primary purpose. Keep under 150 characters.]

---

## TABLE OF CONTENTS
<!-- ANCHOR:toc -->

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. ⚙️ CONFIGURATION](#5--configuration)
- [6. 💡 USAGE EXAMPLES](#6--usage-examples)
- [7. 🛠️ TROUBLESHOOTING](#7--troubleshooting)
- [8. ❓ FAQ](#8--faq)
- [9. 📚 RELATED DOCUMENTS](#9--related-documents)

<!-- /ANCHOR:toc -->

---

## 1. 📖 OVERVIEW
<!-- ANCHOR:overview -->

### What is [PROJECT_NAME]?

[2-3 sentences explaining what this is and why it exists.]

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| [Category 1] | [N] | [Brief detail] |
| [Category 2] | [N] | [Brief detail] |

### Key Features

| Feature | Description |
|---------|-------------|
| **[Feature 1]** | [What it does and why it matters] |
| **[Feature 2]** | [What it does and why it matters] |
| **[Feature 3]** | [What it does and why it matters] |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| [Runtime/Tool] | [Version] | [Version] |

<!-- /ANCHOR:overview -->

---

## 2. 🚀 QUICK START
<!-- ANCHOR:quick-start -->

### 30-Second Setup

```bash
# 1. [First step description]
[command]

# 2. [Second step description]
[command]

# 3. [Third step description]
[command]
```

### Verify Installation

```bash
# Confirm everything is working
[verification command]

# Expected output:
# [example output]
```

### First Use

```bash
# Basic usage
[minimal usage command or code]
```

<!-- /ANCHOR:quick-start -->

---

## 3. 📁 STRUCTURE
<!-- ANCHOR:structure -->

```
[root-directory]/
├── [dir-or-file-1]/          # [Purpose]
│   ├── [subitem-1]           # [Purpose]
│   └── [subitem-2]           # [Purpose]
├── [dir-or-file-2]/          # [Purpose]
└── [dir-or-file-3]           # [Purpose]
```

### Key Files

| File | Purpose |
|------|---------|
| `[filename-1]` | [What it does] |
| `[filename-2]` | [What it does] |

<!-- /ANCHOR:structure -->

---

## 4. ⚡ FEATURES
<!-- ANCHOR:features -->

### [Feature Category 1]

**[Feature Name]**: [Description of what it does]

| Aspect | Details |
|--------|---------|
| **Purpose** | [Why this feature exists] |
| **Usage** | [How to use it] |
| **Options** | [Available options/flags] |

### [Feature Category 2]

**[Feature Name]**: [Description]

```bash
# Example usage
[command or code example]
```

<!-- /ANCHOR:features -->

---

## 5. ⚙️ CONFIGURATION
<!-- ANCHOR:configuration -->

### Configuration File

**Location**: `[path/to/config.file]`

```[format]
# Example configuration
[key]: [value]
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `[option-1]` | [type] | `[default]` | [What it controls] |
| `[option-2]` | [type] | `[default]` | [What it controls] |

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `[VAR_NAME]` | [Yes/No] | [What it controls] |

<!-- /ANCHOR:configuration -->

---

## 6. 💡 USAGE EXAMPLES
<!-- ANCHOR:examples -->

### Example 1: [Use Case Name]

```bash
# [Description of what this example does]
[command or code]
```

**Result**: [What happens / expected output]

### Example 2: [Use Case Name]

```bash
# [Description]
[command or code]
```

### Example 3: [Advanced Use Case]

```bash
# [Description]
[command or code]
```

### Common Patterns

| Pattern | Command/Code | When to Use |
|---------|--------------|-------------|
| [Pattern 1] | `[code]` | [Scenario] |
| [Pattern 2] | `[code]` | [Scenario] |

<!-- /ANCHOR:examples -->

---

## 7. 🛠️ TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### [Issue 1: Descriptive Name]

**Symptom**: [What the user sees/experiences]

**Cause**: [Why this happens]

**Solution**:
```bash
[fix command]
```

#### [Issue 2: Descriptive Name]

**Symptom**: [What the user sees]

**Cause**: [Why this happens]

**Solution**: [Step-by-step fix]

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| [Problem 1] | `[command or action]` |
| [Problem 2] | `[command or action]` |

### Diagnostic Commands

```bash
# Check status
[diagnostic command 1]

# View logs
[diagnostic command 2]
```

<!-- /ANCHOR:troubleshooting -->

---

## 8. ❓ FAQ
<!-- ANCHOR:faq -->

### General Questions

**Q: [Common question about what this is or does]?**

A: [Clear, concise answer. 2-3 sentences max.]

---

**Q: [Common question about usage]?**

A: [Answer with example if helpful.]

---

### Technical Questions

**Q: [Technical question]?**

A: [Answer with code if applicable.]

```bash
[example]
```

<!-- /ANCHOR:faq -->

---

## 9. 📚 RELATED DOCUMENTS
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [Document Name](./path/to/doc.md) | [What it covers] |

### External Resources

| Resource | Description |
|----------|-------------|
| [Resource Name](https://url) | [What it provides] |

<!-- /ANCHOR:related -->

---

*[Optional: Footer with version info or maintainer contact]*
```

---

## 14. 🔗 RELATED RESOURCES

### Templates
- [skill_asset_template.md](../opencode/skill_asset_template.md) - Pattern reference for this document
- [install_guide_template.md](./install_guide_template.md) - For installation documentation
- [frontmatter_templates.md](./frontmatter_templates.md) - YAML frontmatter examples

### Standards
- [core_standards.md](../../references/core_standards.md) - Document formatting rules
- [validation.md](../../references/validation.md) - Quality scoring (DQI)

### Examples
- Project READMEs in `/specs/` folders
- Skill READMEs in `.opencode/skill/` folders

### Skill Reference
- [workflows-documentation SKILL.md](../../SKILL.md) - Parent skill documentation
