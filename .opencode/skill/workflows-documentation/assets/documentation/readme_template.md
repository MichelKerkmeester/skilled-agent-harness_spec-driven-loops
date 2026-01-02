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

**README vs Other Documentation**:
```
Need orientation/overview?       → README
Need installation steps?         → Install Guide (link from README)
Need AI agent instructions?      → SKILL.md
Need API reference?              → API docs (link from README)
Need architecture decisions?     → ADRs (link from README)
```

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

### Project README
**Purpose**: Root-level documentation for the entire project

**Location**: `/README.md`

**Audience**: New contributors, evaluators, users

**Required Sections**: Overview, Quick Start, Structure, Troubleshooting, Related Documents

**Key Focus**: What is this project? How do I get started? Where do I find things?

### Component README
**Purpose**: Documentation for a reusable module or library

**Location**: `/src/components/[component]/README.md` or `/packages/[pkg]/README.md`

**Audience**: Developers using the component

**Required Sections**: Overview, Quick Start, Features, Usage Examples, Troubleshooting

**Key Focus**: What does this component do? How do I use it? What are the options?

### Feature README
**Purpose**: Documentation for a specific feature or system

**Location**: `/docs/features/[feature]/README.md` or `/src/features/[feature]/README.md`

**Audience**: Developers implementing or maintaining the feature

**Required Sections**: Overview, Quick Start, Features, Configuration, Usage Examples

**Key Focus**: How does this feature work? How do I configure it?

### Skill README
**Purpose**: Supplementary documentation for an AI skill (alongside SKILL.md)

**Location**: `.opencode/skill/[skill-name]/README.md`

**Audience**: Humans who want to understand the skill before using it

**Required Sections**: Overview, Quick Start, Features, Usage Examples, FAQ

**Key Focus**: What does this skill do? When should I use it? What are common patterns?

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

### Section Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        EVALUATION PHASE                         │
│  Reader decides: "Is this relevant to me?"                      │
├─────────────────────────────────────────────────────────────────┤
│  1. OVERVIEW          → What is this? Key stats? Features?      │
│  2. QUICK START       → Can I get it working quickly?           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        EXPLORATION PHASE                        │
│  Reader investigates: "How does this work?"                     │
├─────────────────────────────────────────────────────────────────┤
│  3. STRUCTURE         → Where are things located?               │
│  4. FEATURES          → What can it do?                         │
│  5. CONFIGURATION     → How do I customize it?                  │
│  6. USAGE EXAMPLES    → Show me real patterns                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         SUPPORT PHASE                           │
│  Reader needs help: "Something's wrong" or "I have a question"  │
├─────────────────────────────────────────────────────────────────┤
│  7. TROUBLESHOOTING   → Fix common problems                     │
│  8. FAQ               → Answer common questions                 │
│  9. RELATED DOCUMENTS → Find more information                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. 📝 SECTION DEEP DIVES

### Overview Section (1)

**Purpose**: Establish what this is, why it exists, and key metrics at a glance.

**Must include**:
- Brief description (2-3 sentences)
- Key statistics table (if metrics exist)
- Key features table (3-6 items)
- Requirements/prerequisites

**Template**:
```markdown
### What is [PROJECT_NAME]?

[2-3 sentences explaining what this is and why it exists]

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| [Category] | [N] | [Brief detail] |

### Key Features

| Feature | Description |
|---------|-------------|
| **[Feature]** | [What it does and why it matters] |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| [Tool] | [Version] | [Version] |
```

**Writing Tips**:
- Lead with value proposition (why should I care?)
- Use tables for scannable data
- Keep descriptions action-oriented ("enables X" not "is designed for X")
- Statistics build credibility - include if available

### Quick Start Section (2)

**Purpose**: Get users to a working state in under 2 minutes.

**Must include**:
- Numbered setup steps with copy-paste commands
- Verification command to confirm success
- Simplest possible first use example

**Template**:
```markdown
### 30-Second Setup

```bash
# 1. [First step]
[command]

# 2. [Second step]
[command]
```

### Verify Installation

```bash
[verification command]
# Expected output: [example]
```

### First Use

```bash
[minimal usage example]
```
```

**Writing Tips**:
- Test every command before documenting
- Show expected output for verification
- Assume nothing is installed (or state prerequisites clearly)
- "30-Second Setup" is aspirational - aim for it

### Structure Section (3)

**Purpose**: Help users navigate the project/component.

**Must include**:
- ASCII directory tree
- Purpose annotations for key directories/files
- Key files table

**Template**:
```markdown
```
project/
├── src/                    # Source code
│   ├── components/         # Reusable components
│   └── utils/              # Utility functions
├── docs/                   # Documentation
└── README.md               # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `config.json` | Main configuration |
| `src/index.js` | Entry point |
```

**Writing Tips**:
- Only show relevant structure (not every file)
- Annotate with `# Purpose` comments in tree
- Group related items together
- 2-3 levels deep is usually sufficient

### Features Section (4)

**Purpose**: Comprehensive feature documentation with examples.

**Must include**:
- Feature groupings by category
- Usage examples for each feature
- Options/flags tables where applicable

**Template**:
```markdown
### [Feature Category]

**[Feature Name]**: [Description]

| Aspect | Details |
|--------|---------|
| **Purpose** | [Why this feature exists] |
| **Usage** | [How to use it] |
| **Options** | [Available options] |

```bash
# Example
[command]
```
```

**Writing Tips**:
- Group related features under category headings
- Show before/after or input/output examples
- Include comparison tables when multiple options exist
- Lead with the most-used features

### Configuration Section (5)

**Purpose**: Complete configuration reference.

**Must include**:
- Config file location and format
- All options with types, defaults, descriptions
- Environment variables

**Template**:
```markdown
### Configuration File

**Location**: `path/to/config.json`

```json
{
  "option": "value"
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `option` | string | `"default"` | [What it controls] |

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VAR_NAME` | Yes/No | [What it controls] |
```

**Writing Tips**:
- Show complete example config (not fragments)
- Document ALL defaults
- Group related options together
- Explain the "why" not just the "what"

### Usage Examples Section (6)

**Purpose**: Real-world usage patterns users can copy.

**Must include**:
- 3+ examples from simple to advanced
- Common patterns table
- Expected results for each example

**Template**:
```markdown
### Example 1: [Basic Use Case]

```bash
# [Description]
[command]
```

**Result**: [Expected output]

### Common Patterns

| Pattern | Command | When to Use |
|---------|---------|-------------|
| [Pattern] | `[code]` | [Scenario] |
```

**Writing Tips**:
- Start with most common use case
- Build complexity progressively (basic → advanced)
- Include output/results for verification
- Use realistic examples, not toy data

### Troubleshooting Section (7)

**Purpose**: Self-service problem resolution.

**Must include**:
- Common issues with symptom/cause/solution
- Quick fixes table
- Diagnostic commands

**Template**:
```markdown
### Common Issues

#### [Issue Name]

**Symptom**: [What the user sees]

**Cause**: [Why this happens]

**Solution**:
```bash
[fix command]
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| [Problem] | `[command]` |

### Diagnostic Commands

```bash
# Check status
[command]

# View logs
[command]
```
```

**Writing Tips**:
- Lead with user-visible symptoms (what they SEE)
- Provide copy-paste solutions
- Include diagnostic commands for investigation
- Order by frequency (most common first)

### FAQ Section (8)

**Purpose**: Answer frequently asked questions.

**Must include**:
- General questions (what/why)
- Technical questions (how)
- Bold Q: with A: format

**Template**:
```markdown
### General Questions

**Q: [Question]?**

A: [2-3 sentence answer]

---

### Technical Questions

**Q: [Question]?**

A: [Answer with code example if helpful]

```bash
[example]
```
```

**Writing Tips**:
- Keep answers concise (2-3 sentences max)
- Include code examples where helpful
- Use horizontal rules between Q&A pairs
- Actually answer the question asked

### Related Documents Section (9)

**Purpose**: Guide users to additional resources.

**Must include**:
- Internal documentation links
- External resource links
- Purpose description for each

**Template**:
```markdown
### Internal Documentation

| Document | Purpose |
|----------|---------|
| [Doc](./path.md) | [What it covers] |

### External Resources

| Resource | Description |
|----------|-------------|
| [Resource](https://url) | [What it provides] |
```

**Writing Tips**:
- Use relative paths for internal docs
- Verify all links work
- Describe what each resource provides
- Order by relevance (most useful first)

---

## 6. ✍️ WRITING PATTERNS

### Progressive Disclosure

Structure content so users get essential information first, details on demand:

```
Level 1: Title + one-line description (10 seconds)
Level 2: Overview section (30 seconds)
Level 3: Quick Start (2 minutes)
Level 4: Full documentation (as needed)
```

**Example**:
```markdown
# MyTool

> Fast, simple task automation for development workflows.

## 1. 📖 OVERVIEW
[2 paragraphs: what it is, why it exists]

## 2. 🚀 QUICK START
[3 commands to working state]

## 4. ⚡ FEATURES
[Detailed feature documentation]
```

### Table-First Approach

Tables are scannable. Use them for:
- Feature comparisons
- Configuration options
- File/directory listings
- Requirements
- Quick reference

**Instead of**:
```markdown
The tool requires Node.js version 18 or higher. We recommend version 20
for best performance. You also need npm version 9 or higher.
```

**Use**:
```markdown
| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18+ | 20+ |
| npm | 9+ | 10+ |
```

### Code Block Standards

Always specify language for syntax highlighting:
```markdown
```bash
npm install package
```

```json
{ "key": "value" }
```

```javascript
const x = 1;
```
```

Include comments in commands:
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Show expected output:
```bash
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

---

## 8. ✅ README CHECKLIST

Before finalizing a README, verify all applicable items:

### Structure
- [ ] Title with one-line description (blockquote)
- [ ] Table of contents with working anchor links
- [ ] All included sections have content (no empty sections)
- [ ] Section numbers are sequential
- [ ] Horizontal rules between major sections

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

### Effective Quick Start Pattern

```markdown
## 2. 🚀 QUICK START

### Prerequisites

- Node.js 18+ (`node --version`)
- npm 9+ (`npm --version`)

### 30-Second Setup

```bash
# 1. Install
npm install -g my-tool

# 2. Initialize
my-tool init

# 3. Verify
my-tool --version
# Expected: my-tool v1.2.3
```

### First Use

```bash
# Run with default settings
my-tool run

# Output:
# ✓ Task completed successfully
```
```

### Effective Troubleshooting Pattern

```markdown
## 7. 🛠️ TROUBLESHOOTING

### Common Issues

#### Command not found

**Symptom**: `command not found: my-tool`

**Cause**: Binary not in PATH after installation

**Solution**:
```bash
# Add to PATH
export PATH="$HOME/.local/bin:$PATH"

# Or reinstall globally
npm install -g my-tool
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Permission denied | `sudo npm install -g my-tool` |
| Old version | `npm update -g my-tool` |
| Corrupted install | `npm uninstall -g my-tool && npm install -g my-tool` |

### Diagnostic Commands

```bash
# Check installation
which my-tool

# Check version
my-tool --version

# Run diagnostics
my-tool doctor
```
```

---

## 10. 🔄 README MAINTENANCE

### When to Update

**Update immediately when**:
- New features are added
- Breaking changes are introduced
- Installation process changes
- Dependencies change significantly

**Update periodically for**:
- Version number bumps
- Link rot (broken external links)
- Outdated screenshots or examples
- User-reported confusion

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

## 11. 🎓 BEST PRACTICES SUMMARY

**DO**:
- ✅ Lead with value proposition (why should I care?)
- ✅ Enable success in under 2 minutes (Quick Start)
- ✅ Test every command before documenting
- ✅ Use tables for scannable data
- ✅ Show expected output for commands
- ✅ Provide copy-paste solutions in troubleshooting
- ✅ Verify all links work
- ✅ Update when features change

**DON'T**:
- ❌ Skip the Quick Start section (most important for adoption)
- ❌ Leave `[PLACEHOLDER]` markers in published docs
- ❌ Write walls of text (use tables, lists, code blocks)
- ❌ Assume readers have context (explain the "what" first)
- ❌ Document features without examples
- ❌ Let links rot (check periodically)
- ❌ Mix instructions for different platforms without labels
- ❌ Forget to update after breaking changes

---

## 12. 📋 COMPLETE TEMPLATE

Copy and customize this template. Replace all `[PLACEHOLDER]` markers with actual content. Remove sections that don't apply (keep minimum: Overview, Quick Start, Troubleshooting).

```markdown
# [PROJECT_NAME]

> [One-sentence description of what this is and its primary purpose. Keep under 150 characters.]

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. ⚙️ CONFIGURATION](#5--configuration)
- [6. 💡 USAGE EXAMPLES](#6--usage-examples)
- [7. 🛠️ TROUBLESHOOTING](#7--troubleshooting)
- [8. ❓ FAQ](#8--faq)
- [9. 📚 RELATED DOCUMENTS](#9--related-documents)

---

## 1. 📖 OVERVIEW

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

---

## 2. 🚀 QUICK START

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

---

## 3. 📁 STRUCTURE

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

---

## 4. ⚡ FEATURES

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

---

## 5. ⚙️ CONFIGURATION

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

---

## 6. 💡 USAGE EXAMPLES

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

---

## 7. 🛠️ TROUBLESHOOTING

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

---

## 8. ❓ FAQ

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

---

## 9. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [Document Name](./path/to/doc.md) | [What it covers] |

### External Resources

| Resource | Description |
|----------|-------------|
| [Resource Name](https://url) | [What it provides] |

---

*[Optional: Footer with version info or maintainer contact]*
```

---

## 13. 🔗 RELATED RESOURCES

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
