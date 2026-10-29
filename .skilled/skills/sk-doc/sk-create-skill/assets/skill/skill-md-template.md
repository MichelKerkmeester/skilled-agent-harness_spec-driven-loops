---
title: SKILL.md File Templates - Creation Guide
description: Templates and guidelines for creating effective SKILL.md files for AI agent skills with complete scaffolds and section guidance.
trigger_phrases:
  - "skill md template"
  - "skill file scaffold"
  - "skill frontmatter requirements"
  - "skill section guidance"
importance_tier: normal
contextType: general
version: 1.2.6.0
---

# SKILL.md File Templates - Creation Guide

Templates for creating SKILL.md files with proper structure, frontmatter, and required sections.

---

## 1. OVERVIEW

### Purpose of SKILL.md Files

SKILL.md files define AI agent skills - reusable capabilities that extend an agent's functionality for specific domains or workflows. A well-crafted SKILL.md:

- **Triggers automatically** when relevant patterns are detected
- **Guides the agent** through specialized workflows
- **Maintains consistency** across conversations
- **Encodes expertise** in specific domains

### Template Overview

This guide provides **one comprehensive SKILL template** (Section 3) that covers all skill types from simple single-purpose tools to complex multi-mode orchestrators.

**The template is flexible:**
- **Simple skills**: Use required core sections only (WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES)
- **Skills with bundled resources**: Say in Section 2 what selects the skill and what it loads first, and put the router in the sibling `ROUTER.md`. Use `references/`, `assets/`, and `scripts/`
- **Multi-mode skills**: Expand WHEN TO USE and HOW IT WORKS sections by mode
- **All skills**: Section 2 (SMART ROUTING) is required: 8 to 12 non-blank lines of plain prose

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
- ✅ Numbered H2 sections (ALL CAPS)
- ✅ Section separators (`---`)
- ✅ No table of contents (forbidden in SKILL.md)

**Quality Targets**:
- Structure: 100/100
- Content quality: High (AI-evaluated)
- Overall: High (human/AI judgment)

---

## 2. FRONTMATTER REQUIREMENTS

### Required Fields

| Field | Required | Format | Example |
|-------|----------|--------|---------|
| `name` | ✅ | hyphen-case | `my-skill-name` |
| `description` | ✅ | Single line, **≤ 130 chars** for skills (≤ 110 for commands), 1,536-char hard cap | `"Handles X when Y occurs"` |
| `allowed-tools` | ✅ | Array: `[Tool1, Tool2]` | `[Read, Write, Edit, Bash]` |
| `version` | ✅ | 4-part X.Y.Z.W | `1.0.0.0` |

> **Hard rules**: not a frontmatter key. They live in `hard-rules.json` beside the skill's `SKILL.md`, a JSON array of `{id, check, message, severity}` objects that the dispatch preflight reads.

> **Description budget & trim style**: see [`frontmatter-templates.md` § Description Budget & Trim Style](../../../sk-create-frontmatter/assets/frontmatter-templates.md).
> Keep total project descriptions under the ~6,400-character ceiling. This leaves headroom below the 8,000-character auto-discovery limit.
> Drop product and stack lists. Drop marketing prose. Keep the skill name, primary verb, domain noun and mode suffixes (`:auto` or `:confirm`).

### Template

```yaml
---
name: sk-example
description: Example workflow skill demonstrating proper frontmatter format with specific capabilities, use cases, and key differentiators for AI agent discovery.
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.0.0.0
---
```

### Key Rules

- **name**: Must match folder name exactly, hyphen-case only
- **description**: Third-person voice, single line, no `<>` brackets
- **allowed-tools**: Use brackets `[...]`, not comma-separated string
- **hard rules**: Not a frontmatter key. They live in `hard-rules.json` beside `SKILL.md`, a JSON array of `{id, check, message, severity}` objects the dispatch preflight reads.

> **Complete Reference**: For validation rules, edge cases, array formats, and all document type frontmatter, see [frontmatter-templates.md](../../../sk-create-frontmatter/assets/frontmatter-templates.md)

---

## 3. SKILL TEMPLATE (WITH BUNDLED RESOURCES)

**Use for**: Skills with bundled resources (references, scripts, or assets)

**Target**: 800-2000 lines (SKILL.md <1000 lines, rest in resources)

**Size Constraints** (package_skill.py validation):
- Max 5000 words (3000 recommended)
- Max 3000 lines

**Required Sections**: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES (with ✅ ALWAYS, ❌ NEVER, ⚠️ ESCALATE IF), REFERENCES (or combined `SMART ROUTING & REFERENCES`)

Packaging enforcement note:
- `package_skill.py` fails if `REFERENCES` is missing and no approved combined `SMART ROUTING & REFERENCES` structure exists.

**Recommended Sections**: SUCCESS CRITERIA, INTEGRATION POINTS, REFERENCES AND RELATED RESOURCES

### Template

---
name: example-skill
description: Example skill demonstrating proper template structure with specific capabilities for semantic code search and context preservation workflows.
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.0.0.0
---

<!-- Keywords: [KEYWORDS] -->

# [Skill Title - Comprehensive Name]

[One-sentence tagline followed by key capabilities overview]

<!-- OPTIONAL: Include this block if skill has a supplemental navigation layer.
     See skill-creation.md for authoring rules. -->
<!-- Remove comment markers to activate:

\## 1. WHEN TO USE

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

\## 2. SMART ROUTING

Use this skill when the request is [domain] work: [trigger 1], [trigger 2], or [trigger 3].
The first signal is [project/stack/mode detection], because it picks the knowledge folder before any intent scoring.
Load `references/[default].md` first on every run. It holds the baseline rules the other files assume.
Then load what the matched intent maps to: [intent A] reads `references/[domain]/[a].md`, and [intent B] reads `assets/[domain]/[b].md`.
Keep every path inside this skill folder, and load a file only when it exists.
When two intents score close together, follow both in rank order.
When nothing matches, report `UNKNOWN_FALLBACK` with the checklist from the machine router instead of guessing.
The machine router lives in [`ROUTER.md`](./ROUTER.md). Read it before selecting a resource; the pseudocode stays there, not here.

---

\## 3. HOW IT WORKS

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
     Subsections MUST be named ALWAYS, NEVER, and ESCALATE IF (or ESCALATE WHEN).
     Use H3 by default. H4 is allowed when nested under phase headings.
     Do NOT add horizontal dividers (---) between RULES subsections. -->

\## 4. RULES

<!-- REQUIRED SUBSECTIONS (package_skill.py validation): -->
<!-- - ALWAYS -->
<!-- - NEVER -->
<!-- - ESCALATE IF (or "ESCALATE WHEN") -->

### ALWAYS

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

### NEVER

**NEVER do these:**

1. **NEVER [anti-pattern]**
   - [Why problematic]
   - [Alternative approach]

2. **NEVER [anti-pattern]**
   - [Why problematic]

3. **NEVER [anti-pattern]**
   - [Why problematic]

### ESCALATE IF

**Ask user when:**

1. **ESCALATE IF [ambiguous case]**
   - [What's unclear]
   - [What to ask]

2. **ESCALATE IF [blocking issue]**
   - [What's blocked]
   - [Resolution path]

---

\## 5. REFERENCES

### Core References

- [reference-name.md](./references/reference-name.md) - Primary operational guidance
- [workflow-name.md](./references/workflow-name.md) - End-to-end execution flow

### Templates and Assets

- [template-name.md](./assets/template-name.md) - Reusable output template
- [checklist-name.md](./assets/checklist-name.md) - Validation checklist

### Reference Loading Notes

- Load only references needed for current intent.
- Keep `SMART ROUTING` as the plain-word summary of what loads, and the sibling `ROUTER.md` as the router that does it.
- Use combined heading `SMART ROUTING & REFERENCES` only if both concerns stay clear.

---

\## 6. SUCCESS CRITERIA

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

\## 7. INTEGRATION POINTS

### [Integration System 1 - e.g., Validation Workflow]

**[Validation Name]** (if applicable):
- Triggers: [When it runs]
- Purpose: [What it does]
- Execution: [Performance characteristics]
> **Note:** Run validation manually after file operations, or configure your environment for automatic execution.

### [Integration System 2 - e.g., Cross-Workflow Contract]

**[Contract Name]**: [When it applies and what the skill must hand off]

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

\## 8. REFERENCES AND RELATED RESOURCES

The router in `ROUTER.md` discovers reference, asset, and script docs dynamically. Start with `references/[primary].md`, `assets/[template].md`, and any skill-specific automation under `scripts/`, then load task-specific resources according to Section 2.

Scripts: `scripts/[primary-helper]` when the skill ships automation. Omit this line when no scripts exist.

Related skills: `[related-skill]` for [relationship], `[other-skill]` for [relationship], and `system-spec-kit` when packet documentation or memory continuity applies.

Install guide: [INSTALL-GUIDE.md](INSTALL-GUIDE.md) when the skill has installation or configuration steps.

---

**Word Count Targets**:
- Section 1 (WHEN TO USE): 150-200 lines
- Section 2 (SMART ROUTING): 8-12 non-blank lines of plain prose (the router block lives in the sibling `ROUTER.md`)
- Section 3 (HOW IT WORKS): 200-300 lines
- Section 4 (RULES): 150-200 lines
- Section 5 (REFERENCES): 40-120 lines
- Section 6 (SUCCESS CRITERIA): 80-120 lines
- Section 7 (INTEGRATION POINTS): 100-150 lines
- Section 8 (REFERENCES AND RELATED RESOURCES): 20-60 lines

**Bundled Resources Structure (Monolithic)**:
```
.skilled/skills/skill-name/       # Note: .skilled/skills/ (singular, NOT skills)
├── SKILL.md (800-1000 lines)
└── Bundled Resources
    ├── scripts/          - Executable automation
    ├── references/       - Detailed documentation (flat or domain subfolders)
    └── assets/           - Templates and examples (subfolders OK)
        ├── opencode/     - OpenCode component templates (skills, agents, commands)
        └── readme/        - README-shaped scaffolds (README, install guide)
```

**Folder Organization Principle**:
- **references/** = flat for small skills, domain subfolders for medium/complex skills
  - Flat example: `references/core-standards.md`, `references/validation.md`
  - Domain example: `references/backend/go/`, `references/frontend/react/`
- **assets/** = Subfolders ALLOWED when organizing many files by category
  - Group related templates together
  - Example: `assets/skill/`, `assets/readme/`, `assets/flowcharts/`
- **scripts/** = Typically flat, but subfolders OK for large script collections

**Native Discovery**:
- Skills auto-discovered from `.skilled/skills/*/SKILL.md` frontmatter
- Skill name in frontmatter MUST match folder name
- Skills appear as `skills_<name>` functions in OpenCode (hyphens → underscores)
- Invoke via `Read(".skilled/skills/<name>/SKILL.md")`

---

## 4. SECTION-BY-SECTION CONTENT GUIDANCE

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

**Purpose**: Use this section to explain how you route a request to this skill's resources.

**Three skill kinds, one shape**:

| Kind | How to tell | What Section 2 says |
|------|-------------|---------------------|
| Hub | the folder holds `mode-registry.json` and `hub-router.json` | how a prompt reaches a mode, and where the root `ROUTER.md` is |
| Mode packet | a packet folder inside a hub | what selects this packet, what it loads first, and where its own `ROUTER.md` is |
| Standalone | neither hub file | the same as a mode packet, with the router in its own `ROUTER.md` |

**The limit**: 12 non-blank lines and 180 words are the hard ceilings the check enforces. Aim for 8 to 12 lines. A packet or standalone skill says three things: what selects it, what it loads first, and where the machine router is.

**The sibling router**: the machine router lives in `ROUTER.md` beside `SKILL.md`, under a final `## MACHINE ROUTER` heading.
That heading is the one every reader parses. Its section number is optional, so `## MACHINE ROUTER` and `## 9. MACHINE ROUTER` both count, and the check ignores the number.
Keep pseudocode out of SMART ROUTING and put it in that section.
`SKILL.md` carries no `## MACHINE ROUTER` section of its own: two homes for one router is the dual declaration the check reports.

**The link line**: Section 2 names the router file with a relative markdown link, [`ROUTER.md`](./ROUTER.md), and its target resolves on disk. A sentence that mentions the name without a link fails, because a reader cannot follow it to a file that is not there.

**One router per folder**: every skill and every mode packet owns `ROUTER.md` inside its own folder, linked from its own `SKILL.md`. A router file whose real path leaves the folder is not that skill's router.

**The no-match outcome** is named `UNKNOWN_FALLBACK` everywhere. Low confidence returns a disambiguation checklist, never an empty result and never a guess.

**Validation**: `package_skill.py --strict` reports the routing shape with five codes:

| Code | Finding |
|------|---------|
| `RS-001` | SMART ROUTING is longer than the limit (12 lines or 180 words by default) |
| `RS-002` | `SKILL.md` carries a `## MACHINE ROUTER` section, with or without a code block |
| `RS-003` | A `## MACHINE ROUTER` section is not the last H2 of the document that holds it |
| `RS-004` | the skill has no sibling `ROUTER.md`, or its real path leaves the skill folder |
| `RS-005` | `SKILL.md` has no relative markdown link to `./ROUTER.md` that resolves |

The machine block itself is a fenced block or an unfenced run of indented lines.
It declares the router with one of these markers: `INTENT_SIGNALS =`, `RESOURCE_MAP =`, `DEFAULT_RESOURCE =`, `UNKNOWN_FALLBACK_CHECKLIST =`, `def discover_markdown_resources` or `def _guard_in_skill`.
A fence closes only on a run of the same character that is at least as long as its opening run.

**Known debt** is listed in `sk-create-skill/scripts/routing-shape-known-debt.json`.
Entries use skill paths relative to `.skilled/skills`, such as `sk-code/sk-code-review`.
A folder outside that root is never debt.
Each entry records `{"lines", "words", "machineBlocks", "codes"}`.
A listed skill fails if its line count, word count or machine blocks left in `SKILL.md` exceed the record, or if it adds an unrecorded code.
The checker ignores entries in any other form.
Remove an entry when the skill follows the canon.

**Placement**: the SMART ROUTING section sits after Section 1 (WHEN TO USE) and before HOW IT WORKS, and `ROUTER.md` sits beside `SKILL.md` at the skill root.

**Worked example** (a canon Section 2 and its sibling router, nothing else):

\## 2. SMART ROUTING

Use this skill for [domain] work: [trigger 1], [trigger 2], or [trigger 3].
The first signal is [project/stack/mode detection], because it picks the knowledge folder before any intent scoring.
Load `references/[default].md` first on every run. The other files assume it.
Then load what the matched intent maps to: [intent A] reads `references/[domain]/[a].md`, and [intent B] reads `assets/[domain]/[b].md`.
Keep every path inside this skill folder and load a file only when it exists.
When two intents score close together, follow both in rank order.
When nothing matches, report `UNKNOWN_FALLBACK` with the checklist from the machine router instead of guessing.
The machine router lives in [`ROUTER.md`](./ROUTER.md); read it before selecting a resource.

---

The link resolves to the sibling file, whose one heading the readers parse is:

\## MACHINE ROUTER

```python
DEFAULT_RESOURCE = "references/[default].md"
INTENT_SIGNALS = {"PRIMARY": {"weight": 4, "keywords": [("[keyword]", 4), ("[phrase]", 3)]}}
RESOURCE_MAP = {"PRIMARY": ["references/[domain]/[primary].md"]}
UNKNOWN_FALLBACK_CHECKLIST = ["Confirm the routing key", "Confirm the intent", "Provide one concrete input"]

def route_[skill_name]_resources(user_request, task=None):
    inventory = discover_markdown_resources()
    primary, secondary, scores = classify_intents(user_request, task)
    if max(scores.values() or [0]) < 0.5:
        return {"load_level": "UNKNOWN_FALLBACK", "checklist": UNKNOWN_FALLBACK_CHECKLIST}
    return {"routing_key": get_routing_key(task, [primary]), "resources": inventory}
```

The full resilience pattern (guarded paths, recursive discovery, routing keys) is in [skill-smart-router.md](./skill-smart-router.md).

**Writing Tips**:
- Open Section 2 with the signal that actually picks this skill's files.
- Name the first file to load, so a reader knows where to start.
- Name the router file with a markdown link, so a reader can open it.
- Keep `UNKNOWN_FALLBACK` as the named no-match outcome.
- Edit `INTENT_SIGNALS` and `RESOURCE_MAP` in `ROUTER.md` when the skill gains a domain.
- Avoid duplicate lookup tables, static file inventories, and unguarded `load()` calls.

**Word Budget**: 8-12 non-blank lines of prose

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
- Use Mermaid for flow diagrams so a parser can read them.
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
- **Consistency**: Use the same ASCII flowchart style as the other diagrams in the file
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
- ALWAYS rules (4-7 critical requirements)
- NEVER rules (3-5 anti-patterns to avoid)
- ESCALATE IF (3-5 situations requiring user input)

**Structure**:

### ALWAYS

**ALWAYS do these without asking:**

1. **ALWAYS [requirement]**
   - [Why this matters]
   - [Implementation detail]

### NEVER

**NEVER do these:**

1. **NEVER [anti-pattern]**
   - [Why problematic]
   - [Alternative approach]

### ESCALATE IF

**Ask user when:**

1. **ESCALATE IF [ambiguous situation]**
   - [What's unclear]
   - [What clarification needed]

**Writing Tips**:
- Use ALL CAPS for subsection headers: `ALWAYS`, `NEVER`, `ESCALATE IF` (or `ESCALATE WHEN`)
- Be specific and actionable
- Explain *why* for each rule (rationale matters)
- Include implementation guidance
- Present options to user for ESCALATE IF cases

**Word Budget**: 100-200 lines

---

### Section 5: REFERENCES

**Purpose**: Expose the operational references and templates the skill depends on.

**Essential Content**:
- Core references used during execution
- Templates/assets used during output generation
- Loading notes that stay consistent with Section 2 (SMART ROUTING)

**Structure**:

### Core References
- [reference-name.md](./references/reference-name.md) - Primary guidance

### Templates and Assets
- [template-name.md](./assets/template-name.md) - Reusable output template

### Reference Loading Notes
- Load only what current intent requires.
- Keep Smart Routing as the single routing authority.

**Word Budget**: 40-120 lines

---

### Section 6: SUCCESS CRITERIA

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

### Section 7: INTEGRATION POINTS

**Purpose**: Document how skill integrates with systems, tools, and workflow contracts

**Essential Content**:
- Validation workflow integration
- Required workflow contracts and handoff rules
- Tool usage patterns
- Knowledge base dependencies
- External tool requirements

**Structure**:

### Validation Workflow Integration

**[Validation Name]**:
- Triggers: [When to run]
- Purpose: [What it validates]

### Cross-Workflow Contracts

**[Contract Name]**: [When it applies and what the skill must hand off]

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

## 5. COMMON PITFALLS

For the complete list of 8 common pitfalls with before/after examples, see:
→ **[common-pitfalls.md](../../references/shared/common-pitfalls.md)**

**Quick Summary:**
1. Generic descriptions → Be specific about capabilities
2. Bloated SKILL.md → Move details to references/
3. Missing bundled resources → Identify repeated code/docs
4. Unclear triggers → Specific activation conditions
5. Distant instructions → Use the [Prose Clarity Checklist](../../references/skill/creation-workflow.md#prose-clarity-checklist)
6. Platform-specific claims → Stay platform-agnostic
7. Multiline YAML descriptions → Keep single line
8. Redundant routing tables → Keep routing authority in pseudocode

### Writing Style Quick Reference

For instructions and README prose, use the [Prose Clarity Checklist](../../references/skill/creation-workflow.md#prose-clarity-checklist).

---

## 6. QUALITY CHECKLIST & QUICK REFERENCE

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
□ Numbered H2 sections for the body (1. WHEN TO USE, 2. SMART ROUTING, etc.)
□ H2 headings use ALL CAPS
□ Section separators (---) between major sections
□ No table of contents (forbidden in SKILL.md)
□ Proper heading hierarchy (H1 → H2 → H3)
□ SMART ROUTING section placed after WHEN TO USE, before HOW IT WORKS

Content - Standard Sections:
□ WHEN TO USE section includes use cases + anti-patterns
□ HOW IT WORKS section explains workflow clearly
□ RULES section has ALWAYS, NEVER, ESCALATE IF
□ REFERENCES section lists core references/templates explicitly
□ SUCCESS CRITERIA section defines completion
□ INTEGRATION POINTS section documents dependencies
□ All bundled resources referenced from SKILL.md
□ No duplication between SKILL.md and references/

Content - Routing Canon:
□ Section 1 (WHEN TO USE) contains ONLY activation triggers and use cases
□ Section 1 does NOT contain file-path routing logic
□ SMART ROUTING section exists (Section 2 - REQUIRED for all skills)
□ Section 2 is 8-12 non-blank lines of plain prose: what selects this skill, what it loads first, where the machine router is
□ Section 2 names the no-match outcome `UNKNOWN_FALLBACK`
□ Any machine router block sits in the sibling `ROUTER.md`, never inside SMART ROUTING
□ `SKILL.md` carries no `## MACHINE ROUTER` section of its own
□ Section 2 links to [`ROUTER.md`](./ROUTER.md) with a relative markdown link that resolves
□ `ROUTER.md` sits beside `SKILL.md`, and every path in it stays inside the skill folder
□ Flowchart supplements added to complex logic blocks in Section 3 (where applicable)
□ Python/YAML code preserved (supplements, not replacements)
□ Mermaid diagrams use valid syntax (when used)

Quality:
□ SKILL.md under 5k words (<3k preferred)
□ Concrete examples included
□ Rationale provided for rules
□ Instructions follow the [Prose Clarity Checklist](../../references/skill/creation-workflow.md#prose-clarity-checklist)
□ Consistent heading format
□ All code blocks specify language
□ Links work correctly
□ Section 1 contains ONLY triggers/use cases (NO file references)
□ `MACHINE ROUTER` pseudocode guards every path and checks that the file exists

### Quick Reference Table

| Element               | Requirement                | Example                                                                                            |
| --------------------- | -------------------------- | -------------------------------------------------------------------------------------------------- |
| **Filename**          | `SKILL.md` (exact case)    | ✅ `SKILL.md`  ❌ `skill.md`                                                                         |
| **Frontmatter**       | Required YAML with fields  | `name`, `description`, `allowed-tools`                                                             |
| **Name Format**       | `hyphen-case`              | ✅ `mcp-chrome-devtools`  ❌ `devtools_cli`                                                    |
| **Description Voice** | Third-person               | ✅ "Use when..."  ❌ "You should..."                                                                 |
| **H2 Format**         | Number + ALL CAPS          | ✅ `## 1. WHEN TO USE`                                                                            |
| **TOC**               | Forbidden in SKILL.md      | ❌ No table of contents                                                                             |
| **Sections**          | 5 required + 3 recommended | Required: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES (or combined `SMART ROUTING & REFERENCES`). Recommended: SUCCESS CRITERIA, INTEGRATION POINTS, REFERENCES AND RELATED RESOURCES |
| **Sibling Router**   | `ROUTER.md` beside `SKILL.md` | Its `## MACHINE ROUTER` section holds the only router pseudocode, and Section 2 links to the file |
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
| **Sections**          | 5 required core           | 5 required + recommended sections | 5 required per mode + overview       |
| **Example Skills**    | mcp-chrome-devtools | system-spec-kit, sk-code | sk-doc, sk-git |

### Validation Command Reference

```bash
# Validate skill structure (REQUIRED before claiming complete)
python .skilled/skills/sk-doc/scripts/package_skill.py .skilled/skills/[skill-name] --check

# Validation checks:
# - Frontmatter: name (hyphen-case), description (no <>), allowed-tools (array format), version
# - Required sections: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES
# - RULES subsections: ✅ ALWAYS, ❌ NEVER, ⚠️ ESCALATE IF
# - Routing shape: SMART ROUTING 8-12 non-blank lines, a sibling ROUTER.md with a final `## MACHINE ROUTER` section, and a relative link to it from SKILL.md (RS-001 to RS-005 under --strict)
# - Size constraints: max 5000 words, max 3000 lines

# Native discovery:
# - Skills auto-discovered from .skilled/skills/*/SKILL.md frontmatter
# - Skills appear as skills_* functions in OpenCode
# - Invoke via Read(".skilled/skills/<name>/SKILL.md")
```

---

## 7. REFERENCES AND RELATED RESOURCES

### Templates
- [frontmatter-templates.md](../../../sk-create-frontmatter/assets/frontmatter-templates.md) - Frontmatter by document type
- [skill-asset-template.md](./skill-asset-template.md) - Asset file creation guide
- [skill-reference-template.md](./skill-reference-template.md) - Reference file templates
- [skill-router-template.md](./skill-router-template.md) - Sibling `ROUTER.md` scaffold and its machine router

### Standards
- [core-standards.md](../../../shared/references/core-standards.md) - Document type rules
- [skill-creation.md](../../references/README.md) - Complete skill creation workflow
