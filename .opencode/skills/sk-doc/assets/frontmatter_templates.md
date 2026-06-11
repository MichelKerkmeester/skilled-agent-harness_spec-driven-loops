---
title: YAML Frontmatter Templates
description: Templates and validation rules for YAML frontmatter across all document types in the OpenCode ecosystem.
trigger_phrases:
  - "yaml frontmatter templates"
  - "frontmatter validation rules"
  - "frontmatter by document type"
  - "skill reference asset frontmatter"
  - "five field frontmatter block"
importance_tier: important
contextType: general
---

# YAML Frontmatter Templates - Document Type Reference

Templates and validation rules for YAML frontmatter by document type.

---

## 1. OVERVIEW

### What Is YAML Frontmatter?

**YAML frontmatter** is a metadata block at the beginning of markdown files, delimited by `---` markers. It provides machine-readable configuration that controls how AI agents and tools process the document.

```yaml
---
name: skill-name
description: What this skill does
allowed-tools: Read, Write, Bash
---

# Document Content Starts Here
```

**Core Purpose**:
- **Tool configuration** - Define which AI tools a skill/command can use
- **Discovery** - Enable programmatic listing and searching of skills/commands
- **Argument parsing** - Specify expected inputs for commands
- **Metadata storage** - Version, category, tags for organization

**Key Difference from Inline Metadata**:
- YAML frontmatter = Machine-parseable, strict format, at file start
- Inline metadata = Human-readable, flexible format, anywhere in document

### Document Types and Frontmatter Requirements

| Document Type | Frontmatter Required? | Reason |
|---------------|----------------------|--------|
| **SKILL.md** | ✅ **Required** | AI needs metadata to discover and invoke skills |
| **Command** | ✅ **Required** | Arguments and tools must be declared |
| **Skill Reference/Asset** | ✅ **Required** | Skill Advisor harvests the 5-field block as routing signal |
| **Knowledge (outside skills)** | ❌ **Forbidden** | Pure content, no programmatic interface |
| **Spec** | ❌ **Not recommended** | Use inline metadata for flexibility |
| **README** | ⚪ **Optional** | Usually none, unless documenting a skill |

### Core Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Delimiter syntax** | Must start and end with `---` on separate lines |
| **Position** | Must be at the very beginning of the file (line 1) |
| **YAML format** | Key-value pairs, no nested objects for required fields |
| **Single-line values** | Description must be on one line (parser limitation) |
| **Case-sensitive** | Field names are lowercase (`name`, not `Name`) |

### How Frontmatter Is Parsed

```
File loaded by OpenCode
         │
         ├─► Check line 1 for opening `---`
         │   └─► Not found? → No frontmatter (may be error for SKILL/Command)
         │
         ├─► Find closing `---` (within first 20 lines)
         │   └─► Not found? → Malformed frontmatter error
         │
         ├─► Parse YAML between delimiters
         │   └─► Invalid YAML? → Parse error
         │
         └─► Validate required fields by document type
             └─► Missing required? → Validation error
```

### Progressive Validation

```
Level 1: Structural Check
         └─ Delimiters present and properly formatted
            ↓
Level 2: Field Presence
         └─ Required fields exist for document type
            ↓
Level 3: Field Format
         └─ Values match expected patterns (e.g., lowercase-with-hyphens)
```

---

## 2. WHEN TO ADD FRONTMATTER

### Add Frontmatter When

**Programmatic Interface Needed**:
- Document is a SKILL.md that AI agents invoke
- Document is a command triggered via `/command-name`
- Document needs tool restrictions (`allowed-tools`)
- Document requires argument specification

**Discovery Required**:
- Skills/commands need to appear in listings
- Metadata enables search and filtering
- Version tracking needed

**By Document Type**:

| Document Type | Add Frontmatter? | Required Fields | Optional Fields |
|---------------|------------------|-----------------|-----------------|
| **SKILL.md** | ✅ Always | `name`, `description`, `allowed-tools` | `tags`, `category`, `version` |
| **Command** | ✅ Always | `description`, `argument-hint`, `allowed-tools` | `name`, `model`, `version` |
| **Skill Reference/Asset** | ✅ Always | `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType` | — |
| **Knowledge (outside skills)** | ❌ Never | — | — |
| **Spec** | ❌ Avoid | — | Use inline metadata instead |
| **README** | ⚪ Rarely | Only if in `.opencode/skills/*/` | — |

### Remove Frontmatter When

**Content-Only Documents**:
- Knowledge files outside skill folders (general reference documentation)
- Spec files (planning documents)
- General markdown files

**Why Remove from Knowledge/Spec**:
- Frontmatter implies programmatic interface
- These documents are pure content
- Adds confusion about document purpose

**Exception — skill references and assets**: docs under `.opencode/skills/*/references/` and `.opencode/skills/*/assets/` are NOT frontmatter-free knowledge files. They carry the full 5-field block (see the Skill Reference/Asset entry above and the template in Section 4); skill and folder `README.md` files are exempt.

### Decision Framework

```
Is this document invoked programmatically?
├─► YES
│   │
│   ├─► Is it a SKILL.md?
│   │   └─► Add frontmatter: name, description, allowed-tools
│   │
│   └─► Is it a Command?
│       └─► Add frontmatter: description, argument-hint, allowed-tools
│
└─► NO
    │
    ├─► Is it a skill reference/asset (.opencode/skills/*/references/ or assets/)?
    │   └─► Add the 5-field block: title, description, trigger_phrases,
    │       importance_tier, contextType (READMEs exempt)
    │
    ├─► Is it a Knowledge file outside skill folders?
    │   └─► Remove frontmatter if present
    │
    ├─► Is it a Spec file?
    │   └─► Remove frontmatter, use inline metadata
    │
    └─► Is it a README?
        ├─► In .opencode/skills/*/? → Optional skill-style frontmatter
        └─► Elsewhere? → No frontmatter needed
```

### Frontmatter Field Summary

| Field | SKILL.md | Command | Purpose |
|-------|----------|---------|---------|
| `name` | ✅ Required | ⚪ Optional | Identifier (lowercase-with-hyphens) |
| `description` | ✅ Required | ✅ Required | One-line explanation of purpose |
| `allowed-tools` | ✅ Required | ✅ Required | Comma-separated tool list |
| `argument-hint` | ❌ N/A | ✅ Required | Syntax hint: `<required> [optional]` |
| `model` | ❌ N/A | ⚪ Optional | Override default model (rarely used) |
| `version` | ⚪ Optional | ⚪ Optional | Semantic version |
| `tags` | ⚪ Optional | ❌ N/A | Categorization keywords |

---

## 3. FIELD REFERENCE

### `name` Field

**Purpose**: Unique identifier for skills

**Format Requirements**:
- Pattern: `^[a-z][a-z0-9-]*$`
- Style: `lowercase-with-hyphens`
- Should match directory name

**Examples**:
```yaml
# GOOD
name: document-style-validator
name: git-commit
name: system-spec-kit

# BAD
name: DocumentStyleValidator  # No uppercase
name: document_style_validator  # No underscores
name: 123-skill  # Cannot start with number
```

### `description` Field

**Purpose**: Human-readable explanation of what the skill/command does. Also feeds the Skill Advisor's lexical-lane scoring — the description's keyword density is what makes the skill discoverable to the model.

**Format Requirements**:
- One to two sentences maximum
- **MUST be on a single line** (parser limitation)
- See **Description Budget & Trim Style** below for length targets and content rules

**Critical Warning**:

> ⚠️ **YAML Multiline Strings Are Not Parsed**
>
> The skill parser does not handle YAML multiline block format. Keep your description on a single line after the colon.
>
> ```yaml
> # ❌ BAD - Will not be parsed correctly
> description:
>   This is my skill description
>   spanning multiple lines.
>
> # ✅ GOOD - Single line after colon
> description: This is my skill description all on one line.
> ```
>
> **Note**: Prettier and other formatters may auto-format long descriptions to multiline. If this happens, manually revert to single-line format.

**Examples**:
```yaml
# GOOD
description: Validates markdown document structure against style guide requirements
description: Four-phase debugging framework for browser console errors and CSS issues

# BAD
description: Validates  # Too short
description:  # Empty
```

### Description Budget & Trim Style

The Claude Code harness imposes two limits that authors don't see directly:

| Constant | Value | Source |
|----------|------:|--------|
| Per-skill soft target | **≤ 130 chars** | Project convention; routing-keyword density stays high |
| Per-command soft target | **≤ 110 chars** | Project convention; commands are terser by nature |
| Per-item hard cap | **1,536 chars** | Claude Code internal limit (combined `description` + `when_to_use`) |
| Project soft-ceiling | **5,600 chars** | Total of all project descriptions; leaves ~2,400-char headroom for Claude Code built-ins under the default `SLASH_COMMAND_TOOL_CHAR_BUDGET = 8000` |

When project total exceeds the 8,000-char default, Claude Code **silently drops** the longest descriptions from its available-skills list. Skills stay invocable explicitly, but the model can no longer auto-suggest them. (Packet 083 had to trim 36 descriptions because the project had grown to ~10,050 chars and 15 skills were dropped.)

**Trim style — DROP**:
- Product enumerations (`ClickUp/Notion/Figma/Chrome…`)
- Stack lists (`Webflow/HTML/CSS/JS/Motion.dev/GSAP…`) — see *Stack-agnostic phrasing* below
- Marketing prose (`Mandatory for…`, `Provides…efficient…`, `…best-in-class…`)
- Parenthetical jargon (`(gold battery, staleness model, exclude-rule confidence tiers)`)

**Trim style — KEEP**:
- Skill name token (the literal skill name appearing in the description boosts the explicit-author lane)
- Primary verb (`orchestrate`, `validate`, `dispatch`, `audit`)
- Primary domain noun (`MCP`, `code-review`, `prompts`, `git workflow`)
- Mode suffixes (`:auto`, `:confirm`, `:apply`) — these are advisor trigger tokens
- Numeric specifics (`9 steps`, `5-dim scoring`, `4 MCP servers`) — they signal real capability

**Stack-agnostic phrasing** (project rule): never enumerate specific stacks (Webflow / Go / Next.js / Python frameworks…) in skill descriptions. The smart router detects the active stack at dispatch time; baking stacks into the description ages poorly and consumes routing-keyword budget that should go to the verb + domain noun.

**Before/after example** (sk-code, packet 083, 545 → 125 chars):

```yaml
# Before — 545 chars: enumerated stacks + library lists + marketing prose
description: "Multi-stack coding standards, references, and assets. Provides surface-aware code-quality patterns, checklists, and verification recipes for Webflow frontend (vanilla HTML/CSS/JS animation: Motion.dev, GSAP, Lenis, HLS, Swiper, FilePond, CDN deployment), cross-stack Motion.dev animation guidance, and OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC, MCP server code, agents, commands, skills). Smart-routing internals auto-detect the active stack and load matching standards; unsupported stacks ask for disambiguation."

# After — 125 chars: skill name implicit, verb+domain noun preserved, smart-router phrase kept
description: "Multi-stack coding standards and verification. Smart router auto-detects the active surface and loads matching code patterns."
```

The trimmed version retains every routing-keyword the advisor cares about (`coding`, `standards`, `verification`, `surface`, `code patterns`) while losing the brittle stack enumeration that would have to be edited every time a library is added.

**Validation at create-time**: `quick_validate.py` warns when descriptions exceed the soft target and hard-fails at 1,536 chars. Run `/doctor skill-budget :auto` periodically to detect accumulated drift across the project.

### `allowed-tools` Field

**Purpose**: Restricts which AI tools the skill/command can use

**Format Requirements**:
- Comma-separated list
- Order by frequency of use (most common first)
- Use exact tool names

**Common Tools**:
| Tool | Purpose |
|------|---------|
| `Read` | Read file contents |
| `Write` | Create/overwrite files |
| `Edit` | Modify existing files |
| `Bash` | Execute shell commands |
| `Grep` | Search file contents |
| `Glob` | Find files by pattern |
| `WebFetch` | Fetch web content |
| `Task` | Spawn sub-agents |

**Examples**:
```yaml
# Common patterns
allowed-tools: Read, Write, Edit, Bash
allowed-tools: Read, Grep, Glob
allowed-tools: Read, Bash, WebFetch

# MCP tools
allowed-tools: Read, mcp__semantic-search__semantic_search
```

### `argument-hint` Field (Commands Only)

**Purpose**: Shows expected command syntax in `/help` output

**Format Conventions**:
| Syntax | Meaning | Example |
|--------|---------|---------|
| `<arg>` | Required argument | `<query>` |
| `[arg]` | Optional argument | `[--verbose]` |
| `[:mode]` | Mode suffix | `[:auto\|:confirm]` |

**Examples**:
```yaml
argument-hint: <query>
argument-hint: <task> [:auto|:confirm]
argument-hint: <name> [type] [--force]
argument-hint: [--confirm]
```

### `model` Field (Commands Only)

**Purpose**: Override default AI model for command execution

**Usage**: Use sparingly - only for commands requiring complex reasoning

```yaml
# Only use for genuinely complex workflows
model: opus
```

### Skill Reference/Asset Fields

**Purpose**: Routing metadata on every skill reference/asset doc. The Skill Advisor harvests these fields (flag-gated via `SPECKIT_ADVISOR_DOC_TRIGGERS`) and surfaces matching docs as `matchedDocs` pointers when ranking skills. Spec Kit Memory deliberately does not index skill docs.

| Field | Format | Rules |
|-------|--------|-------|
| `title` | Plain string | Non-empty; usually mirrors the H1 |
| `description` | Single line | Non-empty; no folded (`>`) or multiline scalars |
| `trigger_phrases` | YAML block list | 3-8 items; distinctive lowercase multi-word phrases drawn from the doc's content |
| `importance_tier` | Enum | `constitutional` \| `critical` \| `important` \| `normal` \| `temporary` \| `deprecated` — default `normal`; `important` only for formal contract/invariant docs |
| `contextType` | Enum | `planning` \| `research` \| `implementation` \| `general` |

**Trigger phrase quality**:
```yaml
# GOOD - distinctive, multi-word, content-derived
trigger_phrases:
  - "dqi scoring bands"
  - "install guide scaffold"

# BAD - generic single words or boilerplate
trigger_phrases:
  - "documentation"
  - "reference"
```

---

## 4. DOCUMENT TYPE TEMPLATES

### SKILL.md Frontmatter Template

**Required Fields**: `name`, `description`, `allowed-tools`

```yaml
---
name: skill-name
description: Brief one-line description of what this skill does and when to use it
allowed-tools: Read, Write, Edit, Bash, Grep
---
```

**Complete Example**:
```yaml
---
name: code-systematic-debugging
description: Four-phase debugging framework for browser console errors, CSS layout issues, JavaScript animations, and platform-specific frontend bugs
allowed-tools: Read, Bash, Grep
---
```

### Command Frontmatter Template

**Required Fields**: `description`, `argument-hint`, `allowed-tools`

```yaml
---
description: Brief description of what this command does
argument-hint: <required_arg> [optional_arg]
allowed-tools: Read, Write, Bash
---
```

**Complete Example**:
```yaml
---
description: Generate properly structured command files with correct YAML frontmatter
argument-hint: <name> [purpose]
allowed-tools: Read, Write, Bash
---
```

### Skill Reference/Asset Frontmatter Template

**Required Fields**: `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`

Every doc under `.opencode/skills/*/references/` and `.opencode/skills/*/assets/` carries this full 5-field block (`README.md` files are exempt). The Skill Advisor harvests it as a flag-gated routing signal (`SPECKIT_ADVISOR_DOC_TRIGGERS`) with doc-level `matchedDocs` pointers. Spec Kit Memory never indexes skill docs — these fields exist for advisor routing, not memory search.

```yaml
---
title: Doc Title - What This File Covers
description: One-line description of what this doc provides (single line, no folded scalars)
trigger_phrases:
  - "distinctive phrase one"
  - "distinctive phrase two"
  - "distinctive phrase three"
importance_tier: normal
contextType: general
---
```

**Complete Example**:
```yaml
---
title: Human Voice Rules (HVR) - Writing Standards Reference
description: Linguistic standards that eliminate detectable AI patterns and enforce natural human writing across all documentation.
trigger_phrases:
  - "hvr voice rules"
  - "ai writing tells"
  - "banned vocabulary list"
importance_tier: important
contextType: general
---
```

Verify with `check-skill-doc-frontmatter.sh` (system-skill-advisor `mcp_server/scripts/`), which enforces this contract in coverage mode.

### Knowledge File Outside Skill Folders (No Frontmatter)

**Rule**: Knowledge files outside `.opencode/skills/*/` should **NOT** have YAML frontmatter. (Skill references/assets are covered by the 5-field block above instead.)

```markdown
# ❌ BEFORE (incorrect)
---
name: document-style-guide
description: Style guide for documentation
---

# Document Style Guide

Content...

# ✅ AFTER (correct)
# Document Style Guide

Content...
```

### Spec File (Inline Metadata Instead)

**Rule**: Specs use inline metadata, not YAML frontmatter.

```markdown
# Feature Name - Spec

**Date**: 2025-01-15
**Version**: 1.0
**Priority**: HIGH

Brief introduction...
```

**Rationale**: Specs evolve rapidly during planning. YAML frontmatter adds formality that slows iteration.

---

## 5. VALIDATION RULES

### Validation by Document Type

```yaml
validation_rules:
  SKILL:
    frontmatter_required: true
    required_fields:
      - name
      - description
      - allowed-tools
    optional_fields:
      - tags
      - category
      - version
    field_formats:
      name:
        pattern: "^[a-z][a-z0-9-]*$"
        description: "lowercase-with-hyphens"
      description:
        min_length: 10
        max_length: 200
      allowed-tools:
        type: "comma-separated-list"

  Command:
    frontmatter_required: true
    required_fields:
      - description
      - argument-hint
      - allowed-tools
    optional_fields:
      - name
      - model
      - version
    field_formats:
      description:
        min_length: 10
        max_length: 100
      argument-hint:
        pattern: "contains < or ["

  SkillReferenceAsset:
    # .opencode/skills/*/references/ and assets/ docs; README.md exempt
    frontmatter_required: true
    required_fields:
      - title
      - description
      - trigger_phrases
      - importance_tier
      - contextType
    field_formats:
      description:
        type: "single-line"
      trigger_phrases:
        type: "block-list"
        min_items: 3
        max_items: 8
      importance_tier:
        enum: [constitutional, critical, important, normal, temporary, deprecated]
      contextType:
        enum: [planning, research, implementation, general]

  Knowledge:
    # knowledge files OUTSIDE skill folders only
    frontmatter_required: false
    action_if_present: "remove"

  Spec:
    frontmatter_required: false
    action_if_present: "suggest_removal"

  README:
    frontmatter_required: false
    action_if_present: "no_action"
```

### Validation Checklist

**Structural Checks**:
- [ ] File starts with `---` on line 1
- [ ] Closing `---` found within first 20 lines
- [ ] Valid YAML syntax between delimiters

**Field Presence (SKILL.md)**:
- [ ] `name` field present
- [ ] `description` field present
- [ ] `allowed-tools` field present

**Field Presence (Command)**:
- [ ] `description` field present
- [ ] `argument-hint` field present
- [ ] `allowed-tools` field present

**Field Format**:
- [ ] `name` is lowercase-with-hyphens
- [ ] `description` is single line, 10-200 chars
- [ ] `allowed-tools` is comma-separated list
- [ ] `argument-hint` uses `<required>` and `[optional]` syntax

---

## 6. COMMON FIXES

### Missing Frontmatter

**SKILL.md without frontmatter**:
```yaml
# ADD at beginning of file:
---
name: inferred-from-directory
description: Inferred from H1 subtitle or first paragraph
allowed-tools: Read, Write, Bash
---
```

### Missing Fields

```yaml
# BEFORE (missing allowed-tools)
---
name: my-skill
description: My skill description
---

# AFTER (field added)
---
name: my-skill
description: My skill description
allowed-tools: Read, Write, Bash
---
```

### Incorrect Field Names

```yaml
# BEFORE (wrong field names)
---
Name: my-skill       # Should be lowercase
desc: Description    # Should be 'description'
tools: Read          # Should be 'allowed-tools'
---

# AFTER (corrected)
---
name: my-skill
description: Description
allowed-tools: Read
---
```

### Malformed Delimiters

```yaml
# BEFORE (missing closing delimiter)
---
name: my-skill
description: Description
allowed-tools: Read

# Content starts here...

# AFTER (delimiter added)
---
name: my-skill
description: Description
allowed-tools: Read
---

# Content starts here...
```

### Multiline Description Fix

```yaml
# BEFORE (multiline - won't parse)
---
name: my-skill
description:
  This is a long description
  that spans multiple lines
allowed-tools: Read
---

# AFTER (single line)
---
name: my-skill
description: This is a long description that spans multiple lines
allowed-tools: Read
---
```

### Remove from Knowledge File (Outside Skill Folders)

```yaml
# BEFORE (non-skill knowledge file with frontmatter)
---
name: style-guide
description: Documentation standards
---

# Style Guide

Content...

# AFTER (frontmatter removed)
# Style Guide

Content...
```

---

## 7. AUTO-GENERATION GUIDELINES

### Field Inference Rules

When auto-generating frontmatter, infer values from document content:

**`name` Field**:
```
Source: Parent directory name
Method: Extract from file path

Example:
  Input: .opencode/skills/my-skill/SKILL.md
  Output: my-skill
```

**`description` Field**:
```
Source: H1 subtitle or first paragraph
Method: 
  1. Look for " - " in H1 (e.g., "# Skill Name - Description")
  2. Fallback to first paragraph after H1

Example:
  H1: "# My Skill - Brief description of purpose"
  Output: "Brief description of purpose"
```

**`argument-hint` Field** (Commands):
```
Source: INPUTS section or CONTRACT section
Method: Extract from Required/Optional input lists

Example:
  Content:
    ### Required Inputs
    - `name`: Skill name
    ### Optional Inputs  
    - `version`: Version number
  
  Output: <name> [version]
```

**`allowed-tools` Field**:
```
Source: WORKFLOW section code examples
Method: Extract tool names from code blocks

Example:
  Content:
    ```
    Read("file.md")
    Write("output.md", content)
    Bash("ls -la")
    ```
  
  Output: Read, Write, Bash
```

### Auto-Generation Decision Tree

```
Document type detected?
├─► SKILL.md
│   ├─ Has frontmatter? → Validate fields
│   └─ Missing frontmatter? → Auto-generate + ask user to review
│
├─► Command
│   ├─ Has frontmatter? → Validate fields
│   └─ Missing frontmatter? → Auto-generate from content
│
├─► Skill Reference/Asset
│   ├─ Has 5-field block? → Validate fields (trigger_phrases 3-8, enums)
│   └─ Missing fields? → Author from doc content (title from H1, phrases from headings)
│
├─► Knowledge (outside skills)
│   ├─ Has frontmatter? → Remove it
│   └─ No frontmatter? → Valid (no action)
│
├─► Spec
│   ├─ Has frontmatter? → Validate required fields (title, description, trigger_phrases, importance_tier, _memory.continuity)
│   └─ No frontmatter? → Auto-generate from Spec Kit template
│
└─► README
    ├─ In .opencode/skills/*/? → Optional skill-style
    └─ Elsewhere? → No frontmatter needed
```

---

## 8. INTERACTIVE WORKFLOW

### Adding Frontmatter Interactively

**Step 1: Present Inferred Template**
```
STRUCTURAL FIX: Add YAML Frontmatter

File: .opencode/skills/new-skill/SKILL.md
Type: SKILL.md (frontmatter required)

Proposed frontmatter (inferred from document):
---
name: new-skill
description: Brief description inferred from H1 subtitle
allowed-tools: Read, Write, Bash
---

Options:
1. Accept as-is
2. Edit values before applying
3. Skip (leave non-compliant)

Choice:
```

**Step 2: Edit Values (if selected)**
```
Edit frontmatter values:

name [new-skill]: _
description [Brief description...]: _
allowed-tools [Read, Write, Bash]: _

Press Enter to keep default, or type new value.
```

**Step 3: Apply**
```bash
# Insert at beginning of file
{
  echo "---"
  echo "name: $name"
  echo "description: $description"
  echo "allowed-tools: $allowed_tools"
  echo "---"
  echo ""
  cat original_file.md
} > updated_file.md
```

---

## 9. BEST PRACTICES SUMMARY

### DO

| Practice | Reason |
|----------|--------|
| Keep description on single line | Parser limitation |
| Match `name` to directory name | Consistency, discoverability |
| Order tools by frequency | Most used first |
| Use exact tool names | Case-sensitive matching |
| Validate before committing | Catch errors early |

### DON'T

| Anti-Pattern | Problem |
|--------------|---------|
| Multiline descriptions | Won't parse correctly |
| Uppercase in `name` | Violates format requirement |
| Frontmatter on knowledge files outside skills | Implies programmatic interface |
| Bare title+description on skill references/assets | Advisor doc harvest needs the full 5-field block |
| Empty required fields | Validation failure |
| Made-up tool names | Tools won't be available |

---

## 10. QUICK REFERENCE

### Frontmatter Decision Tree

```
Document type?
├─► SKILL.md             → MUST have: name, description, allowed-tools
├─► Command              → MUST have: description, argument-hint, allowed-tools
├─► Skill Reference/Asset → MUST have: title, description, trigger_phrases,
│                           importance_tier, contextType (README.md exempt)
├─► Knowledge (outside skills) → MUST NOT have frontmatter (remove if present)
├─► Spec                 → SHOULD NOT have frontmatter (use inline metadata)
└─► README               → No requirement (usually none)
```

### Field Requirements Matrix

| Document Type | name | description | argument-hint | allowed-tools |
|---------------|------|-------------|---------------|---------------|
| **SKILL.md** | ✅ Required | ✅ Required | ❌ N/A | ✅ Required |
| **Command** | ⚪ Optional | ✅ Required | ✅ Required | ✅ Required |
| **Skill Reference/Asset** | ❌ Not used (uses `title`) | ✅ Required | ❌ N/A | ❌ N/A |
| **Knowledge (outside skills)** | ❌ Forbidden | ❌ Forbidden | ❌ Forbidden | ❌ Forbidden |
| **Spec** | ❌ Not used | ❌ Not used | ❌ Not used | ❌ Not used |

Skill references/assets additionally require `trigger_phrases` (3-8), `importance_tier`, and `contextType` — see Section 3.

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Non-skill knowledge file with frontmatter | Remove frontmatter |
| Skill reference/asset missing the 5-field block | Author trigger_phrases (3-8), importance_tier, contextType |
| SKILL.md missing `name` | Add with directory name |
| Command missing `argument-hint` | Infer from content or ask |
| Spec with YAML frontmatter | Convert to inline metadata |
| Wrong field names (Name vs name) | Use lowercase field names |
| Multiline description | Collapse to single line |

---

## 11. RELATED RESOURCES

### Templates
- [skill_md_template.md](./skill/skill_md_template.md) - SKILL.md file templates
- [command_template.md](./command_template.md) - Command file templates

### Standards
- [core_standards.md](../references/global/core_standards.md) - Document type rules
- [validation.md](../references/global/validation.md) - Quality scoring
