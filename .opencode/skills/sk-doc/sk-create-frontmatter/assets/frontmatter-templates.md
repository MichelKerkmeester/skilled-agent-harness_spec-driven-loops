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
version: 1.0.0.28
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
| **Spec** | ✅ **Required**, and governed elsewhere | `system-spec-kit` templates emit the block and its validator fails without it |
| **README** | ✅ **Required** beside a `SKILL.md` | Carries `version` per the versioning standard. Optional for every other README |
| **Feature Catalog** | ✅ **Required** | The block carries the title and the terms a reader searches the inventory on |
| **Testing Playbook** | ✅ **Required** | Root index and scenario leaves are both addressed by title and version |
| **Agent** | ✅ **Required** | The runtime reads the authority key, and a file without one inherits the full tool set |

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
| **SKILL.md** | ✅ Always | `name`, `description`, `allowed-tools`, `version` | `tags`, `category` |
| **Command** | ✅ Always | `description`, `argument-hint`, `allowed-tools` | `name`, `model`, `version` |
| **Skill Reference/Asset** | ✅ Always | `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`, `version` | n/a |
| **Knowledge (outside skills)** | ❌ Never | n/a | n/a |
| **Spec** | ✅ Always, per `system-spec-kit` | Owned by that skill, not by this contract | n/a |
| **README** (beside a `SKILL.md`) | ✅ Always | `title`, `description`, `trigger_phrases`, `version` | `importance_tier`, `contextType` |
| **README** (anywhere else) | ⚪ Optional | n/a | Add a block only when the doc should be discoverable |
| **Feature Catalog** | ✅ Always | `title`, `description`, `trigger_phrases`, `version` | `importance_tier`, plus `last_updated` on the root index |
| **Testing Playbook** | ✅ Always | `title`, `description`, `version` | Runner-specific keys only, added one at a time when a runner reads them |
| **Agent** | ✅ Always | `name`, `description`, and the runtime's authority key: `permission:` under `.opencode/agents/`, `tools:` elsewhere | `mode`, `temperature`, `mcpServers` |

> **`version` is the 4-part `X.Y.Z.W` field** carried by every in-scope skill doc (SKILL.md, README, references, assets, feature catalogs, testing playbooks). Format, derivation, and rollout live in [frontmatter-versioning.md](../references/frontmatter-versioning.md). Commands and agents are out of scope (their `version` stays optional).

### Remove Frontmatter When

**Content-Only Documents**:
- Knowledge files outside skill folders (general reference documentation)
- General markdown files

Spec-folder documents are not in this group. They carry frontmatter and `system-spec-kit` owns their block.

**Why Remove from Knowledge**:
- Frontmatter implies programmatic interface
- These documents are pure content
- Adds confusion about document purpose

**Exception for skill references and assets**: docs under `.opencode/skills/*/references/` and `.opencode/skills/*/assets/` are NOT frontmatter-free knowledge files. They carry the full 5-field block (see the Skill Reference/Asset entry above and the template in Section 4). Skill and folder `README.md` files are exempt.

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
    ├─► Is it a document under specs/?
    │   └─► Keep the block system-spec-kit's template emits, since that skill owns it
    │
    └─► Is it a README?
        ├─► Beside a SKILL.md? → Add title, description, trigger_phrases,
        │                        version (Section 4)
        └─► Elsewhere? → Optional, add a block only for discoverability
```

### Frontmatter Field Summary

| Field | SKILL.md | Command | Feature Catalog | Testing Playbook | Agent | Purpose |
|-------|----------|---------|-----------------|------------------|-------|---------|
| `name` | ✅ Required | ⚪ Optional | ❌ Uses `title` | ❌ Uses `title` | ✅ Required | Identifier (lowercase-with-hyphens) |
| `title` | ❌ Uses `name` | ❌ Uses `name` | ✅ Required | ✅ Required | ❌ Uses `name` | Human-readable heading for the document |
| `description` | ✅ Required | ✅ Required | ✅ Required | ✅ Required | ✅ Required | One-line explanation of purpose |
| `trigger_phrases` | ❌ N/A | ❌ N/A | ✅ Required | ❌ Not used | ❌ N/A | Search terms, in the per-class shape Section 4 sets out |
| `allowed-tools` | ✅ Required | ✅ Required | ❌ N/A | ❌ N/A | ❌ Uses `permission:` or `tools:` | Comma-separated tool list |
| `argument-hint` | ❌ N/A | ✅ Required | ❌ N/A | ❌ N/A | ❌ N/A | Syntax hint: `<required> [optional]` |
| `model` | ❌ N/A | ⚪ Optional | ❌ N/A | ❌ N/A | ❌ N/A | Override default model (rarely used) |
| `version` | ✅ Required | ⚪ Optional | ✅ Required | ✅ Required | ❌ Out of scope | 4-part `X.Y.Z.W` for skill docs. See [frontmatter-versioning.md](../references/frontmatter-versioning.md) |
| `tags` | ⚪ Optional | ❌ N/A | ❌ N/A | ❌ N/A | ❌ N/A | Categorization keywords |

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

**Purpose**: Human-readable explanation of what the skill/command does. Also feeds the Skill Advisor's lexical-lane scoring, where the description's keyword density is what makes the skill discoverable to the model.

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
| Per-skill soft target | **≤ 130 chars** | Project convention, keeping routing-keyword density high |
| Per-command soft target | **≤ 110 chars** | Project convention, since commands are terser by nature |
| Per-item hard cap | **1,536 chars** | Claude Code internal limit (combined `description` + `when_to_use`) |
| Project soft-ceiling | **5,600 chars** | Total of all project descriptions, leaving ~2,400-char headroom for Claude Code built-ins under the default `SLASH_COMMAND_TOOL_CHAR_BUDGET = 8000` |

When project total exceeds the 8,000-char default, Claude Code **silently drops** the longest descriptions from its available-skills list. Skills stay invocable explicitly, but the model can no longer auto-suggest them. (Packet 083 had to trim 36 descriptions because the project had grown to ~10,050 chars and 15 skills were dropped.)

**Trim style, what to DROP**:
- Product enumerations (`ClickUp/Notion/Figma/Chrome…`)
- Stack lists (`Webflow/HTML/CSS/JS/Motion.dev/GSAP…`), covered by *Stack-agnostic phrasing* below
- Marketing prose (`Mandatory for…`, `Provides…efficient…`, `…best-in-class…`)
- Parenthetical jargon (`(gold battery, staleness model, exclude-rule confidence tiers)`)

**Trim style, what to KEEP**:
- Skill name token (the literal skill name appearing in the description boosts the explicit-author lane)
- Primary verb (`orchestrate`, `validate`, `dispatch`, `audit`)
- Primary domain noun (`MCP`, `code-review`, `prompts`, `git workflow`)
- Mode suffixes (`:auto`, `:confirm`, `:apply`), which are advisor trigger tokens
- Numeric specifics (`9 steps`, `5-dim scoring`, `4 MCP servers`), which signal real capability

**Stack-agnostic phrasing** (project rule): never enumerate specific stacks (Webflow / Go / Next.js / Python frameworks…) in skill descriptions. The smart router detects the active stack at dispatch time. Baking stacks into the description ages poorly and consumes routing-keyword budget that should go to the verb + domain noun.

**Before/after example** (sk-code, packet 083, 545 → 125 chars):

```yaml
# Before (545 chars): enumerated stacks + library lists + marketing prose
description: "Multi-stack coding standards, references, and assets. Provides surface-aware code-quality patterns, checklists, and verification recipes for Webflow frontend (vanilla HTML/CSS/JS animation: Motion.dev, GSAP, Lenis, HLS, Swiper, FilePond, CDN deployment), cross-stack Motion.dev animation guidance, and OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC, MCP server code, agents, commands, skills). Smart-routing internals auto-detect the active stack and load matching standards; unsupported stacks ask for disambiguation."

# After (125 chars): skill name implicit, verb+domain noun preserved, smart-router phrase kept
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

**Purpose**: Routing metadata on every skill reference/asset doc. The Skill Advisor harvests these fields (flag-gated via `SPECKIT_ADVISOR_DOC_TRIGGERS`) and surfaces matching docs as `matchedDocs` pointers when ranking skills.

| Field | Format | Rules |
|-------|--------|-------|
| `title` | Plain string | Non-empty, and usually mirrors the H1 |
| `description` | Single line | Non-empty, with no folded (`>`) or multiline scalars |
| `trigger_phrases` | YAML block list | 3-8 distinctive lowercase multi-word phrases drawn from the doc's content |
| `importance_tier` | Enum | `constitutional` \| `critical` \| `important` \| `normal` \| `temporary` \| `deprecated`. Default `normal`, with `important` only for formal contract/invariant docs |
| `contextType` | Enum | `planning` \| `research` \| `implementation` \| `general` |
| `version` | `X.Y.Z.W` | Required, 4-part, inserted as the last key in the block, derived per [frontmatter-versioning.md](../references/frontmatter-versioning.md) |

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
version: 1.0.0.0
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

Every doc under `.opencode/skills/*/references/` and `.opencode/skills/*/assets/` carries this full 5-field block (`README.md` files are exempt). The Skill Advisor harvests it as a flag-gated routing signal (`SPECKIT_ADVISOR_DOC_TRIGGERS`) with doc-level `matchedDocs` pointers. These fields exist for advisor routing: `/memory:search` reaches skill docs lexically with ripgrep and never reads this block.

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
version: 1.0.0.0
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
version: 1.7.0.0
---
```

Verify with `check-skill-doc-frontmatter.sh` (system-skill-advisor `mcp-server/scripts/`), which enforces this contract in coverage mode.

### Skill README Frontmatter Template

**Required Fields**: `title`, `description`, `trigger_phrases`, `version`

This is the `README.md` that sits beside a `SKILL.md`. [frontmatter-versioning.md](../references/frontmatter-versioning.md) lists `README.md` among the classes that must carry `version`, so the block is required there rather than optional.

```yaml
---
title: "skill-or-mode-name"
description: "One line saying what the skill does and who reaches for it."
trigger_phrases:
  - "distinctive phrase one"
  - "distinctive phrase two"
  - "distinctive phrase three"
version: 1.0.0.0
---
```

**Complete Example** (`sk-doc/sk-create-changelog/README.md`):

```yaml
---
title: "create-changelog"
description: "Writes a correctly versioned, correctly placed changelog entry from a spec folder, a component hint or git history, for anyone recording a shipped change."
trigger_phrases:
  - "create changelog"
  - "release notes"
version: 1.0.0.10
---
```

- `importance_tier` and `contextType` are optional here. A minority of skill READMEs carry them. No validator asks for them.
- READMEs deeper in a skill tree are a different class. Most carry no block at all. `sk-create-readme`'s own template treats frontmatter as optional for a normal project README, so add a block to one of those only when the document should be discoverable.
- Nothing enforces the field set. `check-skill-doc-frontmatter.sh` exempts `README.md`, so the version gate is the only automated check a README block faces.
- `trigger_phrases` lengths across skill READMEs run from 2 items to 13. The 3 to 8 range in Section 3 is the reference and asset rule, not a README rule.

### Feature Catalog Frontmatter Template

**Required Fields**: `title`, `description`, `trigger_phrases`, `version`

A catalog has two document shapes and they differ by one field. Per-feature leaf card:

```yaml
---
title: "Feature name"
description: "One line, shown in the root catalog table."
trigger_phrases:
  - "the H3 feature heading from the root catalog"
  - "a natural-language alternate"
  - "the tool or command name"
version: 1.0.0.0
---
```

Root index, which adds `last_updated`:

```yaml
---
title: "<skill>: Feature Catalog"
description: "Current-state inventory for <skill>, covering <surfaces>."
trigger_phrases:
  - "<skill> feature catalog"
  - "<skill> capabilities"
last_updated: "2026-08-23"
version: 0.1.2.0
---
```

- The four leaf fields are the settled shape. 809 of the 878 leaf cards in the tree use exactly those and no others.
- `last_updated` is a root habit rather than a leaf one. It appears on 19 of 27 roots against 6 of 878 leaves, always as a quoted ISO date.
- `importance_tier` is optional and `contextType` is not part of this class. Each appears on well under a tenth of leaves.
- Catalog `trigger_phrases` route nothing today, because the advisor doc-trigger harvest scans `references/` and `assets/` only. The field is still required. It is what a reader searches on, so match it to the root catalog H3 heading.
- The field-by-field contract lives in `sk-create-feature-catalog/assets/feature-catalog-snippet-template.md` Section 2.

### Testing Playbook Frontmatter Template

**Required Fields**: `title`, `description`, `version`

Those three are the whole settled block, for the root index and for a per-feature scenario alike. `trigger_phrases` is not part of this class.

```yaml
---
title: "OBS-009 -- Register and inspect the official CLI"
description: "This scenario validates official obsidian CLI registration and help output in an app-backed environment."
version: 0.1.0.0
---
```

Root index, same three fields with a `<skill>: Manual Testing Playbook` title:

```yaml
---
title: "create-frontmatter: Manual Testing Playbook"
description: "Operator-facing reference combining the testing directory, execution expectations and the per-feature validation files for this packet."
version: 1.0.0.4
---
```

**Past those three fields this class has no settled convention.** Playbook leaves in this repository carry a long tail of runner-specific keys, among them `id`, `stage`, `category`, `expected_intent`, `expected_resources`, `expected_workflow_mode`, `expected_leaf_resources`, `matrix_cell`, `test_file`, `test_name` and `playbook_path`. No set of them is standard: the largest shape past the core covers 193 of 1,728 leaves. Each key belongs to whichever runner reads it. Add one only when a runner reads it. Never copy a set across from a neighbouring playbook.

Two of those keys change behavior rather than describing it:

| Key | What it does |
|-----|--------------|
| `id`, `expected_intent`, `expected_resources` | The Lane C scenario loader skips any feature file whose block carries none of the three, so a routing scenario without them is silently absent from the benchmark. |
| `stage` | Benchmark tier, one of `routing`, `holdout` or `negative`. It carries what a numbered filename prefix used to encode. |

Both are documented in `sk-create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md` Section 2.

### Agent Frontmatter Template

**Required Fields**: `name`, `description`, plus the authority key its own runtime reads.

An agent has no single block. The field set is chosen by the directory the file lives in. The other runtime authority key is silently ignored rather than rejected, which is why the wrong one is a security defect and not a validation error.

`.opencode/agents/` uses a `permission:` object:

```yaml
---
name: agent-name
description: One line covering purpose, authority and the main boundary.
mode: subagent
temperature: 0.1
permission:
  read: allow
  write: allow
  edit: allow
  bash: allow
  grep: allow
  glob: allow
  list: allow
  memory: allow
  webfetch: deny
  chrome_devtools: deny
  task: deny
  patch: deny
mcpServers:
  - system_skill_advisor
---
```

`.claude/agents/` and `.cursor/agents/` use a `tools:` allow-list:

```yaml
---
name: agent-name
description: One line covering purpose, authority and the main boundary.
tools: Read, Write, Edit, Bash, Grep, Glob
---
```

`.pi/agents/` carries the same three keys with `tools` as a block list of lowercase names.

- **No `version`.** The versioning standard puts `.opencode/agents/*.md` out of scope. No agent file in the tree carries one.
- `validate_document.py` blocks a `.claude/agents/` file that has no non-empty `tools:`, because Claude Code enforces only `tools:` and an absent list inherits the parent session full, unrestricted tool set. It blocks a `.opencode/agents/` file with no `permission:` and warns on a stray `tools:` there.
- `mode` is `subagent` on all but two OpenCode agents in the tree. `temperature` sits at 0.1 or 0.2. `mcpServers` is optional and rare.
- Keep `description` at 130 characters or fewer. Agent descriptions share the Claude Code metadata budget described above.
- `template-rules.json` lists `name`, `description`, `mode`, `temperature` and `permission` as required for the agent type without splitting by runtime. That list is not read for agents, since `validate_document.py` consults `frontmatterFields.required` only on the command path. The runtime split is what runs.
- The fuller field reference is `sk-create-agent/assets/agent-template.md` Section 2.

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

### Spec File (Governed by `system-spec-kit`)

**Rule**: Spec-folder documents carry YAML frontmatter, and this contract does not define it.

`system-spec-kit` owns the block. Its `templates/core/spec.md.tmpl` emits one at every level, and
`validate.sh --strict` reports `SPECDOC_FRONTMATTER_001` and `RESULT: FAILED` on a `spec.md` whose
block is missing. The keys are that skill's, including the `_memory.continuity` mapping no other
class carries, so read them there rather than composing a block from this section.

```yaml
---
title: "Feature Specification: <name>"
description: "One line on what the packet does."
trigger_phrases:
  - "distinctive phrase"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "<track>/<packet>"
---
```

**Where to go**: the templates under `system-spec-kit/templates/`, and the scaffold that fills them.
Never hand-author a spec block from this page, and never strip one you find.

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
      - version
    optional_fields:
      - tags
      - category
    field_formats:
      version:
        pattern: "^\\d+\\.\\d+\\.\\d+\\.\\d+$"
        description: "4-part X.Y.Z.W, see frontmatter-versioning.md"
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
    # .opencode/skills/*/references/ and assets/ docs, README.md exempt
    frontmatter_required: true
    required_fields:
      - title
      - description
      - trigger_phrases
      - importance_tier
      - contextType
      - version
    field_formats:
      version:
        pattern: "^\\d+\\.\\d+\\.\\d+\\.\\d+$"
        description: "4-part X.Y.Z.W, last key in the block, see frontmatter-versioning.md"
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
    # a README.md sitting beside a SKILL.md. Every other README is optional
    frontmatter_required: true
    required_fields:
      - title
      - description
      - trigger_phrases
      - version
    optional_fields:
      - importance_tier
      - contextType
    field_formats:
      version:
        pattern: "^\\d+\\.\\d+\\.\\d+\\.\\d+$"
        description: "4-part X.Y.Z.W, last key in the block"
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
├─► Spec folder document
│   ├─ Has frontmatter? → Validate required fields (title, description, trigger_phrases, importance_tier, _memory.continuity)
│   └─ No frontmatter? → Auto-generate from Spec Kit template
│
└─► README
    ├─ Beside a SKILL.md? → Validate title, description,
    │                      trigger_phrases, version
    └─ Elsewhere? → Optional, no action when absent
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
├─► Spec folder doc      → MUST have frontmatter (system-spec-kit owns the block)
└─► README               → Beside a SKILL.md: title, description,
                            trigger_phrases, version. Elsewhere optional
```

### Field Requirements Matrix

| Document Type | name | description | argument-hint | allowed-tools |
|---------------|------|-------------|---------------|---------------|
| **SKILL.md** | ✅ Required | ✅ Required | ❌ N/A | ✅ Required |
| **Command** | ⚪ Optional | ✅ Required | ✅ Required | ✅ Required |
| **Skill Reference/Asset** | ❌ Not used (uses `title`) | ✅ Required | ❌ N/A | ❌ N/A |
| **Knowledge (outside skills)** | ❌ Forbidden | ❌ Forbidden | ❌ Forbidden | ❌ Forbidden |
| **Spec** | n/a | n/a | n/a | n/a (see `system-spec-kit`) |
| **Feature Catalog** | ❌ Not used (uses `title`) | ✅ Required | ❌ N/A | ❌ N/A |
| **Testing Playbook** | ❌ Not used (uses `title`) | ✅ Required | ❌ N/A | ❌ N/A |
| **Agent** | ✅ Required | ✅ Required | ❌ N/A | ❌ N/A (uses `permission:` or `tools:`) |

Skill references/assets additionally require `trigger_phrases` (3-8), `importance_tier`, and `contextType`. See Section 3.
Feature catalogs additionally require `trigger_phrases` and `version`. Testing playbooks require `title` and `version`. Agents require the authority key their own runtime reads, and carry no `version`. Section 4 has all three.

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Non-skill knowledge file with frontmatter | Remove frontmatter |
| Skill reference/asset missing the 5-field block | Author trigger_phrases (3-8), importance_tier, contextType |
| SKILL.md missing `name` | Add with directory name |
| Command missing `argument-hint` | Infer from content or ask |
| Spec folder doc missing its block | Restore it from the `system-spec-kit` template |
| Wrong field names (Name vs name) | Use lowercase field names |
| Multiline description | Collapse to single line |

---

## 11. RELATED RESOURCES

### Templates
- [skill-md-template.md](../../sk-create-skill/assets/skill/skill-md-template.md) - SKILL.md file templates
- [command-template.md](../../sk-create-command/assets/command-template.md) - Command file templates

### Standards
- [core-standards.md](../../shared/references/core-standards.md) - Document type rules
- [validation.md](../../shared/references/validation.md) - Quality scoring
