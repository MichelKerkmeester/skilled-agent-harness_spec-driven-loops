---
title: SKILL.md File Templates - Creation Guide
description: Templates and guidelines for creating effective SKILL.md files for AI agent skills with complete scaffolds and section guidance.
---

# SKILL.md File Templates - Creation Guide

Templates for creating SKILL.md files with proper structure, frontmatter, and required sections.

---

## 1. 📖 OVERVIEW

### Purpose of SKILL.md Files

SKILL.md files define AI agent skills - reusable capabilities that extend an agent's functionality for specific domains or workflows. A well-crafted SKILL.md:

- **Triggers automatically** when relevant patterns are detected
- **Guides the agent** through specialized workflows
- **Maintains consistency** across conversations
- **Encodes expertise** in specific domains

### Template Overview

This guide provides **one comprehensive SKILL template** (Section 3) that covers all skill types from simple single-purpose tools to complex multi-mode orchestrators.

**The template is flexible:**
- **Simple skills**: Use core sections only (WHEN TO USE, HOW IT WORKS, RULES)
- **Skills with bundled resources**: Add file refs to Activation Detection flowchart and Resource Router, use references folder, assets folder, scripts folder
- **Multi-mode skills**: Expand WHEN TO USE and HOW IT WORKS sections by mode
- **All skills**: MUST include Section 2 (SMART ROUTING & REFERENCES) with integrated resource catalog

**Target size**: 800-2000 lines for SKILL.md (<5k words total)

**Examples**:
- Simple: Unit test generator, documentation formatter (no bundled resources)
- Moderate: API client, specialized code reviewer (with references and assets)
- Complex: Workflow orchestrator, document quality pipeline (multi-mode with extensive resources)

### Progressive Disclosure Principle

SKILL.md architecture follows progressive disclosure:

1. **Metadata** (YAML frontmatter) - Always in context (~100 words)
2. **SKILL.md body** - When skill activates (<5k words)
3. **Bundled resources** - Loaded as needed (unlimited size)

**Critical**: Keep SKILL.md <5k words. Move detailed content to `references/`, `scripts/`, or `assets/`.

### Document Type Requirements

**Enforcement Level**: STRICT (SKILL.md files require perfect structure)

**Required Elements**:
- ✅ YAML frontmatter with required fields
- ✅ H1 title with subtitle
- ✅ Numbered H2 sections with emojis (ALL CAPS)
- ✅ Section separators (`---`)
- ✅ No table of contents (forbidden in SKILL.md)

**Quality Targets**:
- Structure: 100/100
- Content quality: High (AI-evaluated)
- Overall: High (human/AI judgment)

---

## 2. 📋 FRONTMATTER REQUIREMENTS

### Required Fields

| Field | Required | Format | Example |
|-------|----------|--------|---------|
| `name` | ✅ | hyphen-case | `my-skill-name` |
| `description` | ✅ | Single line, 150-300 chars | `"Handles X when Y occurs"` |
| `allowed-tools` | ✅ | Array: `[Tool1, Tool2]` | `[Read, Write, Edit, Bash]` |
| `version` | ⭐ | Semver | `1.0.0` |

### Template

```yaml
---
name: workflows-example
description: Example workflow skill demonstrating proper frontmatter format with specific capabilities, use cases, and key differentiators for AI agent discovery.
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.0.0
---
```

### Key Rules

- **name**: Must match folder name exactly, hyphen-case only
- **description**: Third-person voice, single line, no `<>` brackets
- **allowed-tools**: Use brackets `[...]`, not comma-separated string

> **Complete Reference**: For validation rules, edge cases, array formats, and all document type frontmatter, see [frontmatter_templates.md](frontmatter_templates.md)

---

## 3. 🔧 SKILL TEMPLATE (WITH BUNDLED RESOURCES)

**Use for**: Skills with bundled resources (references, scripts, or assets)

**Target**: 800-2000 lines (SKILL.md <1000 lines, rest in resources)

**Size Constraints** (package_skill.py validation):
- Max 5000 words (3000 recommended)
- Max 3000 lines

**Required Sections**: WHEN TO USE, HOW IT WORKS, RULES (with ✅ ALWAYS, ❌ NEVER, ⚠️ ESCALATE IF)

**Recommended Sections**: SMART ROUTING, SUCCESS CRITERIA, INTEGRATION POINTS

### Template

---
name: example-skill
description: Example skill demonstrating proper template structure with specific capabilities for semantic code search and context preservation workflows.
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.0.0
---

<!-- Keywords: [KEYWORDS] -->

# [Skill Title - Comprehensive Name]

[One-sentence tagline followed by key capabilities overview]

---

## 1. 🎯 WHEN TO USE

<!-- CRITICAL: This section contains ONLY activation triggers and use cases.
     NO file references or navigation guides here - those go in Section 2. -->

### Activation Triggers

**Use when**:
- [Scenario 1 with context]
- [Scenario 2 with context]
- [Scenario 3 with context]

**Keyword Triggers** (if applicable):
- [Pattern 1 that triggers skill]
- [Pattern 2 that triggers skill]

### Use Cases

### [Primary Use Case Category]

[Content for primary use cases]

### [Secondary Use Case Category]

[Content for secondary use cases]

### When NOT to Use

**Do not use for**:
- [Anti-pattern with rationale]
- [Anti-pattern with rationale]
- [Anti-pattern with rationale]

---

## 2. 🧭 SMART ROUTING

<!-- CRITICAL: This section contains:
     1. Activation Detection (flowchart WITH file refs inline)
     2. Resource Router (Python pseudocode WITH descriptive comments and load() calls)
     
     ⚠️ ANTI-PATTERN: Do NOT create a separate "Navigation Guide" subsection 
     listing files - this is REDUNDANT because files are already referenced
     in the flowchart branches and Resource Router load() calls. -->

### Activation Detection

```
TASK CONTEXT
    │
    ├─► [Condition 1 - e.g., "User needs detailed guide"]
    │   └─► Load: references/[name].md
    │
    ├─► [Condition 2 - e.g., "Creating new content"]
    │   └─► Load: assets/[template].md
    │
    ├─► [Condition 3 - e.g., "Automation needed"]
    │   └─► Execute: scripts/[script].py
    │
    └─► [Default - e.g., "Quick task"]
        └─► Use SKILL.md only
```

### Resource Router

```python
def route_[skill_name]_resources(task):
    """
    Resource Router for [skill-name] skill
    Load references based on task context
    """

    # ──────────────────────────────────────────────────────────────────
    # [CATEGORY 1 NAME]
    # Purpose: [One-line description of what this file provides]
    # Key Insight: [The most important thing to know about this resource]
    # ──────────────────────────────────────────────────────────────────
    if task.[condition_1]:
        return load("references/[filename].md")  # [Brief description]

    # ──────────────────────────────────────────────────────────────────
    # [CATEGORY 2 NAME]
    # Purpose: [Description]
    # Key Insight: [Most important thing]
    # ──────────────────────────────────────────────────────────────────
    if task.[condition_2]:
        load("references/[filename].md")  # [Brief description]
        return load("assets/[template].md")  # [Brief description]

    # ──────────────────────────────────────────────────────────────────
    # [CATEGORY 3 NAME]
    # Purpose: [Description]
    # Key Insight: [Most important thing]
    # ──────────────────────────────────────────────────────────────────
    if task.[condition_3]:
        return execute("scripts/[script].py")  # [Brief description]

    # quick lookup
    if task.needs_quick_reference:
        return load("references/quick_reference.md")  # one-page cheat sheet

    # Default: SKILL.md covers basic cases

# ══════════════════════════════════════════════════════════════════════
# STATIC RESOURCES (always available, not conditionally loaded)
# ══════════════════════════════════════════════════════════════════════
# templates/[template].md    → [Purpose description]
# config.jsonc               → [Configuration file purpose]
```

---

## 3. 🛠️ HOW IT WORKS

### [Primary Workflow] Overview

[2-3 sentence explanation of the workflow]

**Process Flow**:
```
STEP 1: [Action Name]
       ├─ [Sub-action with detail]
       ├─ [Sub-action with detail]
       └─ [Output description]
       ↓
STEP 2: [Action Name]
       ├─ [Sub-action with detail]
       └─ [Output description]
       ↓
STEP 3: [Action Name]
       └─ [Final output]
```

See [workflow-details.md](./references/workflow-details.md) for complete step-by-step guidance.

### [Key Component or Pattern]

[Explanation of important architectural pattern or component]

**Structure**:
```[language]
# Show structure or pattern
# With explanatory comments
```

### [Resource Usage Pattern]

**How to use bundled resources**:

**Scripts**: [When and how to invoke scripts]
```bash
# Example script invocation
[command-line-example]
```

**References**: [When to load reference files]

**Assets**: [When to use template/asset files]

### [Configuration or Setup]

[Setup requirements, if any]

---

<!-- NOTE: RULES section is REQUIRED by package_skill.py validation.
     Subsections with semantic emojis (✅ ALWAYS, ❌ NEVER, ⚠️ ESCALATE IF) are REQUIRED.
     Do NOT remove these emojis. Do NOT add horizontal dividers (---) between H3 subsections. -->

## 4. 📋 RULES

<!-- REQUIRED SUBSECTIONS (package_skill.py validation): -->
<!-- - ✅ ALWAYS (or "ALWAYS") -->
<!-- - ❌ NEVER (or "NEVER") -->
<!-- - ⚠️ ESCALATE IF (or "ESCALATE IF" or "ESCALATE WHEN") -->

### ✅ ALWAYS

**ALWAYS do these without asking:**

1. **ALWAYS [critical rule with resource tie-in]**
   - [Implementation detail]
   - [Reference to bundled resource if applicable]

2. **ALWAYS [critical rule 2]**
   - [Detail]

3. **ALWAYS [critical rule 3]**
   - [Detail]

4. **ALWAYS [critical rule 4]**
   - [Detail]

5. **ALWAYS [critical rule 5]**
   - [Detail]

### ❌ NEVER

**NEVER do these:**

1. **NEVER [anti-pattern]**
   - [Why problematic]
   - [Alternative approach]

2. **NEVER [anti-pattern]**
   - [Why problematic]

3. **NEVER [anti-pattern]**
   - [Why problematic]

### ⚠️ ESCALATE IF

**Ask user when:**

1. **ESCALATE IF [ambiguous case]**
   - [What's unclear]
   - [What to ask]

2. **ESCALATE IF [blocking issue]**
   - [What's blocked]
   - [Resolution path]

---

## 5. 🏆 SUCCESS CRITERIA

### [Primary Workflow] Completion Checklist

**[Workflow name] complete when**:
- ✅ [Criterion 1]
- ✅ [Criterion 2]
- ✅ [Criterion 3]
- ✅ [Criterion 4]
- ✅ [Criterion 5]

### Quality Targets

**Target metrics** (if applicable):
- **[Metric 1]**: [Target value/threshold]
- **[Metric 2]**: [Target value/threshold]
- **[Metric 3]**: [Target value/threshold]

### Validation Success

**Validation passes when**:
- ✅ [Validation check 1]
- ✅ [Validation check 2]
- ✅ [Validation check 3]

---

## 6. 🔌 INTEGRATION POINTS

### [Integration System 1 - e.g., Validation Workflow]

**[Validation Name]** (if applicable):
- Triggers: [When it runs]
- Purpose: [What it does]
- Execution: [Performance characteristics]
> **Note:** Run validation manually after file operations, or configure your environment for automatic execution.

### [Integration System 2 - e.g., Related Skills]

**[skill-name]**: [How they integrate]

### Tool Usage Guidelines

**[Tool Name]**: [Specific usage pattern]

**[Tool Name]**: [Specific usage pattern]

**[Tool Name]**: [Specific usage pattern]

### Knowledge Base Dependencies

**Required**:
- `file-path` – Purpose, what happens if missing

**Optional**:
- `file-path` – Enhancement provided

### External Tools

**[Tool Name]** (if needed):
- Installation: [How to install]
- Purpose: [Why needed]
- Fallback: [What happens if unavailable]

---

## 7. 🔗 RELATED RESOURCES

### Reference Files
- [reference-name.md](./references/reference-name.md) - Description of reference file
- [guide-name.md](./references/guide-name.md) - Description of guide file

### Templates
- [template-name.md](./assets/template-name.md) - Description of template
- [example-name.md](./assets/example-name.md) - Description of example

### Related Skills
- `skill-name` - How it relates to this skill
- `other-skill-name` - How it relates to this skill

**Word Count Targets**:
- Section 1 (WHEN TO USE): 150-200 lines
- Section 2 (SMART ROUTING & REFERENCES): 80-200 lines (routing logic + resource catalog)
- Section 3 (HOW IT WORKS): 200-300 lines
- Section 4 (RULES): 150-200 lines
- Section 5 (SUCCESS CRITERIA): 80-120 lines
- Section 6 (INTEGRATION POINTS): 100-150 lines

**Bundled Resources Structure**:
```
.opencode/skill/skill-name/       # Note: .opencode/skill/ (singular, NOT skills)
├── SKILL.md (800-1000 lines)
└── Bundled Resources
    ├── scripts/          - Executable automation
    ├── references/       - Detailed documentation (FLAT - no subfolders)
    └── assets/           - Templates and examples (subfolders OK)
        ├── opencode/     - OpenCode component templates (skills, agents, commands)
        └── documentation/ - Document templates (README, install guides)
```

**Folder Organization Principle**:
- **references/** = Keep FLAT (files directly in folder, no subfolders)
  - Simpler navigation, easier discovery
  - Example: `references/core_standards.md`, `references/validation.md`
- **assets/** = Subfolders ALLOWED when organizing many files by category
  - Group related templates together
  - Example: `assets/opencode/`, `assets/documentation/`, `assets/flowcharts/`
- **scripts/** = Typically flat, but subfolders OK for large script collections

**Native Discovery**:
- Skills auto-discovered from `.opencode/skill/*/SKILL.md` frontmatter
- Skill name in frontmatter MUST match folder name
- Skills appear as `skills_<name>` functions in OpenCode (hyphens → underscores)
- Invoke via `Read(".opencode/skill/<name>/SKILL.md")`

---

## 4. 📝 SECTION-BY-SECTION CONTENT GUIDANCE

### Section 1: WHEN TO USE

**Purpose**: Help the AI agent and users understand WHEN to activate this skill

**Section Boundary Rule**: "When to Use" = WHEN (triggers only). File references belong in Section 2 (Smart Routing).

**Essential Content** (ONLY these belong here):
- Activation triggers (what conditions activate this skill)
- Use case categories (2-4 categories)
- Specific scenarios (3-5 per category)
- Anti-patterns ("When NOT to Use")
- Keyword triggers (optional)

**Content that does NOT belong here** (move to Section 2 inline):
- ❌ File references
- ❌ Resource paths
- ❌ Resource tables

**Structure**:

### Activation Triggers

**Use when**:
- [Specific scenario with context]
- [Specific scenario with context]

**Keyword Triggers**:
- [Pattern that activates skill]

### Use Cases

### [Use Case Category]

[Content for use case]

### When NOT to Use

**Skip this skill when:**
- [Anti-pattern with rationale]

**Writing Tips**:
- Be specific: "Generate JSDoc for functions" not "document code"
- Include context: Why each scenario benefits from this skill
- Clear boundaries: Explicitly state what's out of scope
- Trigger patterns: What keywords/patterns auto-activate skill
- **NO file references** - those go in Section 2 (Smart Routing)

**Word Budget**: 100-200 lines

---

### Section 2: SMART ROUTING (Required for All Skills)

**Purpose**: Provide routing logic for bundled resources with file references inline

**Critical Rule**:
```
❌ WRONG: Navigation Guide in "When to Use"
❌ WRONG: Separate "Navigation Guide" subsection listing files
✅ RIGHT: File references inline in Activation Detection flowchart and Resource Router

Section 2 contains TWO subsections:
1. Activation Detection (flowchart WITH file refs inline in each branch)
2. Resource Router (Python pseudocode WITH descriptive comments and load() calls)

⚠️ ANTI-PATTERN: Do NOT create a separate "Navigation Guide" listing files - 
   this is REDUNDANT because files are already referenced in the flowchart 
   branches and Resource Router load() calls.
```

**Placement**: After Section 1 (WHEN TO USE), before Section 3 (HOW IT WORKS)

**Essential Content**:
- **Activation Detection** - Flowchart with file refs inline (e.g., `└─► Load: file.md`)
- **Resource Router** - Python pseudocode with descriptive comments and `load()` calls
- **STATIC RESOURCES** comment section for non-conditionally loaded files

**Structure**:

## 2. 🧭 SMART ROUTING

### Activation Detection

```
TASK CONTEXT
    │
    ├─► Detailed guidance needed
    │   └─► Load: references/detailed_guide.md
    │
    ├─► Creating new content
    │   └─► Load: assets/output_template.md
    │
    └─► Quick task
        └─► Use SKILL.md only
```

### Resource Router

```python
def route_request(context):
    """
    Resource Router for [skill-name] skill
    Load references based on task context
    """

    # ──────────────────────────────────────────────────────────────────
    # Detailed Guide
    # Purpose: Complete step-by-step instructions for complex tasks
    # Key Insight: Use when user needs comprehensive guidance
    # ──────────────────────────────────────────────────────────────────
    if context.needs_detailed_guide:
        return load("references/detailed_guide.md")  # Step-by-step instructions

    # ──────────────────────────────────────────────────────────────────
    # Output Template
    # Purpose: Starting template for content creation
    # Key Insight: Provides consistent structure for outputs
    # ──────────────────────────────────────────────────────────────────
    if context.needs_template:
        return load("assets/output_template.md")  # Content template

    # Default: SKILL.md covers basic cases

# ══════════════════════════════════════════════════════════════════════
# STATIC RESOURCES (always available, not conditionally loaded)
# ══════════════════════════════════════════════════════════════════════
# templates/output.md    → Output format template
# config.jsonc           → Runtime configuration
```

**Writing Tips**:
- **Activation Detection**: Include file refs inline (e.g., `└─► Load: references/file.md`)
- **Resource Router**: Include file refs in load() calls with brief description comments
- **Function names**: Use descriptive names like `route_request()`, `select_resource()`
- **Conditions**: Match skill's actual use cases and decision points
- **Comment blocks**: Use visual separators (────) and include Purpose + Key Insight
- **Resource paths**: Use actual file paths from the skill's bundled resources
- **Fallback**: Always include a default comment
- **Static Resources**: List all non-routed files (templates, configs) at the end
- **Visual hierarchy**: Use ──── for routes, ════ for static resources section
- **NO Navigation Guide**: File references are already in flowchart and Router - don't duplicate

**Word Budget**: 80-200 lines

---

### Section 3: HOW IT WORKS

**Purpose**: Explain the skill's workflow, architecture, and key patterns

**Essential Content**:
- Process flow (visual diagram using ASCII)
- Key capabilities or components
- Configuration or setup requirements
- Examples of primary workflows
- Flowchart supplements for complex logic (NEW - when logic blocks present)

**Structure**:

### [Primary Workflow Name]

[Brief explanation]

**Process Flow**:
\`\`\`
STEP 1: [Action]
   ├─ [Sub-task]
   └─ [Output]
   ↓
STEP 2: [Action]
   └─ [Output]
\`\`\`

**Example**:
\`\`\`[language]
# Realistic example
\`\`\`

**Writing Tips**:
- Visual flows help comprehension (use ASCII diagrams)
- Show, don't just tell (include code examples)
- Progressive detail: Overview → specifics → edge cases
- Link to references for deep dives
- **Flowchart Supplements**: Add visual flowcharts before/after complex Python/YAML logic (see below)

**Word Budget**: 150-300 lines

### Flowchart Supplements (For Complex Logic)

**Purpose**: Add visual clarity to complex Python/YAML logic blocks without removing structured code

**When to Use**:
- Complex conditional logic (nested if/else, multiple branches)
- Mode detection algorithms
- Multi-step decision trees
- Workflow routing logic
- State machine transitions

**Approach**:
- **Supplement, don't replace**: Keep existing Python/YAML code intact
- **Add flowcharts**: Place ASCII flowchart before or after code block
- **Visual aid purpose**: Help quick understanding of logic flow

**Structure**:

### [Logic Section Name]

**[Brief explanation of what this logic does]**

**Logic Flow**:
\`\`\`
START
  ↓
[Check Condition A]
  ↓
A True? ─── NO ──→ [Path B]
  │                    ↓
  │              [Process B]
  │                    ↓
  YES              [Continue]
  ↓
[Process A]
  ↓
RESULT
\`\`\`

**Implementation**:
\`\`\`python
def example_logic(input):
    """Original Python logic preserved"""
    if condition_a:
        return process_a(input)
    else:
        return process_b(input)
\`\`\`

**OR for configuration:**

\`\`\`yaml
mode_detection:
  trigger_patterns:
    ticket: ["$ticket", "create ticket"]
    story: ["$story", "user story"]
  defaults:
    mode: interactive
    depth: 10
\`\`\`

**Writing Tips**:
- **Keep code**: Don't remove Python/YAML - it's precise and complete
- **Add diagrams**: Flowcharts provide at-a-glance understanding
- **Placement**:
  - Flowchart FIRST if it aids comprehension before reading code
  - Flowchart AFTER if it summarizes complex code
  - Both before AND after for very complex logic
- **Consistency**: Use same ASCII flowchart style as Smart Routing Diagram
- **When to skip**: Simple 2-3 line logic doesn't need flowcharts

**Example Use Cases**:
- Mode detection with 5+ conditions → Flowchart + Python code
- YAML configuration with complex triggers → Keep YAML, add decision tree diagram
- Multi-step workflow routing → Flowchart showing paths, keep implementation code

**Word Budget**: Variable (adds 10-30 lines per complex logic block)

---

### Section 4: RULES (REQUIRED)

**Purpose**: Define mandatory behaviors, prohibited actions, and escalation triggers

**Validation**: package_skill.py requires this section with specific subsections

**Essential Content** (all three subsections REQUIRED):
- ✅ ALWAYS rules (4-7 critical requirements)
- ❌ NEVER rules (3-5 anti-patterns to avoid)
- ⚠️ ESCALATE IF (3-5 situations requiring user input)

**Structure**:

### ✅ ALWAYS

**ALWAYS do these without asking:**

1. **ALWAYS [requirement]**
   - [Why this matters]
   - [Implementation detail]

### ❌ NEVER

**NEVER do these:**

1. **NEVER [anti-pattern]**
   - [Why problematic]
   - [Alternative approach]

### ⚠️ ESCALATE IF

**Ask user when:**

1. **ESCALATE IF [ambiguous situation]**
   - [What's unclear]
   - [What clarification needed]

**Writing Tips**:
- Use semantic emojis with ALL CAPS for subsection headers (✅ ALWAYS, ❌ NEVER, ⚠️ ESCALATE IF)
- Alternative formats accepted: "ALWAYS", "NEVER", "ESCALATE IF", "ESCALATE WHEN"
- Be specific and actionable
- Explain *why* for each rule (rationale matters)
- Include implementation guidance
- Present options to user for ESCALATE IF cases

**Word Budget**: 100-200 lines

---

### Section 5: SUCCESS CRITERIA

**Purpose**: Define completion conditions and quality standards

**Essential Content**:
- Completion checklist (5-10 items)
- Quality gates or thresholds
- Validation requirements

**Structure**:

### Task Completion Checklist

**[Workflow name] Complete When:**

- [ ] [Success criterion 1]
- [ ] [Success criterion 2]
- [ ] [Success criterion 3]

### Quality Gates

**Before marking complete:**

- **[Dimension]**: [Specific requirement]
- **[Dimension]**: [Specific requirement]

**Writing Tips**:
- Use checkbox format `- [ ]` for checklists
- Specific and measurable criteria
- Include both completion and quality checks
- Define thresholds numerically where possible

**Word Budget**: 50-120 lines

---

### Section 6: INTEGRATION POINTS

**Purpose**: Document how skill integrates with systems, tools, and other skills

**Essential Content**:
- Validation workflow integration
- Related skills and complementary workflows
- Tool usage patterns
- Knowledge base dependencies
- External tool requirements

**Structure**:

### Validation Workflow Integration

**[Validation Name]**:
- Triggers: [When to run]
- Purpose: [What it validates]

### Related Skills

**[skill-name]**: [How they integrate]

### Tool Usage Guidelines

**[Tool]**: [Usage pattern]

### Knowledge Base Dependencies

**Required**: [Files needed]
**Optional**: [Enhancing files]

### External Tools

**[Tool Name]**:
- Installation: [How]
- Purpose: [Why]

**Writing Tips**:
- Distinguish required vs. optional dependencies
- Provide installation/setup instructions for external tools
- Explain fallback behavior if optional resources missing
- Link related skills by name

**Word Budget**: 50-150 lines

---

## 5. ⚠️ COMMON PITFALLS

For the complete list of 8 common pitfalls with before/after examples, see:
→ **[skill_creation.md § 7. COMMON PITFALLS](../../references/skill_creation.md#7--common-pitfalls)**

**Quick Summary:**
1. Generic descriptions → Be specific about capabilities
2. Bloated SKILL.md → Move details to references/
3. Missing bundled resources → Identify repeated code/docs
4. Unclear triggers → Specific activation conditions
5. Second-person language → Use imperative form
6. Platform-specific claims → Stay platform-agnostic
7. Multiline YAML descriptions → Keep single line
8. Redundant Navigation Guide → Inline file refs in flowchart

### Writing Style Quick Reference

**DO**: Third-person voice (descriptions), imperative form (instructions), specific examples, rationale for rules

**DON'T**: Second-person ("You should..."), vague descriptions, duplicate content, angle brackets in frontmatter

---

## 6. 🔍 QUALITY CHECKLIST & QUICK REFERENCE

### Pre-Packaging Checklist

**Before running package_skill.py:**

Frontmatter:
□ YAML frontmatter present and valid
□ Required fields: name, description, allowed-tools
□ Name is hyphen-case (matches directory)
□ Description uses third-person voice
□ Description is specific (not generic)
□ No angle brackets in description
□ allowed-tools lists all tools used

Structure:
□ H1 title with descriptive subtitle
□ Numbered H2 sections (1. 🎯 WHEN TO USE, 2. 🧭 SMART ROUTING & REFERENCES, etc.)
□ H2 headings use ALL CAPS + emoji
□ Section separators (---) between major sections
□ No table of contents (forbidden in SKILL.md)
□ Proper heading hierarchy (H1 → H2 → H3)
□ SMART ROUTING & REFERENCES section placed after WHEN TO USE, before HOW IT WORKS

Content - Standard Sections:
□ WHEN TO USE section includes use cases + anti-patterns
□ HOW IT WORKS section explains workflow clearly
□ RULES section has ALWAYS, NEVER, ESCALATE IF
□ SUCCESS CRITERIA section defines completion
□ INTEGRATION POINTS section documents dependencies
□ All bundled resources referenced from SKILL.md
□ No duplication between SKILL.md and references/

Content - NEW Standardization (2025):
□ Section 1 (WHEN TO USE) contains ONLY activation triggers and use cases
□ Section 1 does NOT contain Navigation Guide or file references
□ SMART ROUTING section exists (Section 2 - REQUIRED for all skills)
□ Section 2 has TWO subsections: Activation Detection, Resource Router
□ Section 2 does NOT have separate "Navigation Guide" (anti-pattern - redundant)
□ File refs inline in Activation Detection flowchart (e.g., └─► Load: file.md)
□ File refs inline in Resource Router load() calls with brief descriptions
□ Section 2 uses structured comment blocks with Purpose + Key Insight
□ Section 2 includes STATIC RESOURCES comment section for non-routed files
□ Flowchart supplements added to complex logic blocks in Section 3 (where applicable)
□ Python/YAML code preserved (supplements, not replacements)
□ All ASCII diagrams use consistent style (↓, →, ───, │, [boxes])

Quality:
□ SKILL.md under 5k words (<3k preferred)
□ Concrete examples included
□ Rationale provided for rules
□ Language is third-person (descriptions) or imperative (instructions)
□ Consistent emoji usage
□ All code blocks specify language
□ Links work correctly
□ Section 1 contains ONLY triggers/use cases (NO file references)
□ Section 2 Activation Detection flowchart includes file refs inline
□ Section 2 Resource Router load() calls include file refs with descriptions
□ Section 2 does NOT have separate "Navigation Guide" (anti-pattern)
□ Section 2 comment blocks include Purpose and Key Insight for each resource


### Quick Reference Table

| Element               | Requirement                | Example                                                                                            |
| --------------------- | -------------------------- | -------------------------------------------------------------------------------------------------- |
| **Filename**          | `SKILL.md` (exact case)    | ✅ `SKILL.md`  ❌ `skill.md`                                                                         |
| **Frontmatter**       | Required YAML with fields  | `name`, `description`, `allowed-tools`                                                             |
| **Name Format**       | `hyphen-case`              | ✅ `workflows-chrome-devtools`  ❌ `devtools_cli`                                                    |
| **Description Voice** | Third-person               | ✅ "Use when..."  ❌ "You should..."                                                                 |
| **H2 Format**         | Number + Emoji + ALL CAPS  | ✅ `## 1. 🎯 WHEN TO USE`                                                                            |
| **TOC**               | Forbidden in SKILL.md      | ❌ No table of contents                                                                             |
| **Sections**          | 6 required sections        | WHEN TO USE (triggers only), SMART ROUTING (flowchart + router), HOW IT WORKS, RULES, SUCCESS CRITERIA, INTEGRATION POINTS |
| **File Size**         | <5k words (<3k preferred)  | Move details to references/                                                                        |
| **Rules Format**      | ALWAYS, NEVER, ESCALATE IF | All caps headers, specific rules                                                                   |
| **Examples**          | Concrete and realistic     | Show actual use cases                                                                              |

### Template Selection Matrix

| Characteristic        | Simple                    | Moderate                         | Complex                             |
| --------------------- | ------------------------- | -------------------------------- | ----------------------------------- |
| **Workflows**         | Single                    | Single                           | Multiple modes                      |
| **Bundled Resources** | None                      | Some (refs/scripts/assets)       | Extensive                           |
| **Total Lines**       | 400-800                   | 800-2000                         | 2000-5000                           |
| **SKILL.md Lines**    | 400-800                   | 800-1000                         | <3000                               |
| **Sections**          | 6 core                    | 6 core + navigation              | 6 core per mode + overview          |
| **Example Skills**    | workflows-chrome-devtools | system-spec-kit, workflows-code | workflows-documentation, workflows-git |

### Validation Command Reference

```bash
# Validate skill structure (REQUIRED before claiming complete)
python .opencode/skill/workflows-documentation/scripts/package_skill.py .opencode/skill/[skill-name] --check

# Validation checks:
# - Frontmatter: name (hyphen-case), description (no <>), allowed-tools (array format), version
# - Required sections: WHEN TO USE, HOW IT WORKS, RULES
# - RULES subsections: ✅ ALWAYS, ❌ NEVER, ⚠️ ESCALATE IF
# - Size constraints: max 5000 words, max 3000 lines

# Native discovery:
# - Skills auto-discovered from .opencode/skill/*/SKILL.md frontmatter
# - Skills appear as skills_* functions in OpenCode
# - Invoke via Read(".opencode/skill/<name>/SKILL.md")
```

---

## 7. 🔗 RELATED RESOURCES

### Templates
- [frontmatter_templates.md](../documentation/frontmatter_templates.md) - Frontmatter by document type
- [skill_asset_template.md](./skill_asset_template.md) - Asset file creation guide
- [skill_reference_template.md](./skill_reference_template.md) - Reference file templates

### Standards
- [core_standards.md](../../references/core_standards.md) - Document type rules
- [skill_creation.md](../../references/skill_creation.md) - Complete skill creation workflow