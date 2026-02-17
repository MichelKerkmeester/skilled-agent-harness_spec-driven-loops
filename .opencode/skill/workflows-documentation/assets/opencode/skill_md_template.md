---
title: SKILL.md File Templates - Creation Guide
description: Templates and guidelines for creating effective SKILL.md files for AI agent skills with complete scaffolds and section guidance.
---

# SKILL.md File Templates - Creation Guide

Templates for creating SKILL.md files with proper structure, frontmatter, and required sections.

---

<!-- ANCHOR:overview -->
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
- **Simple skills**: Use core sections only (WHEN TO USE, HOW IT WORKS, RULES)
- **Skills with bundled resources**: Keep router pseudocode first, then loading levels + routing authority + resource domains; use references folder, assets folder, scripts folder
- **Multi-mode skills**: Expand WHEN TO USE and HOW IT WORKS sections by mode
- **All skills**: MUST include Section 2 (SMART ROUTING) with integrated resource catalog

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

<!-- /ANCHOR:overview -->
<!-- ANCHOR:frontmatter-requirements -->
## 2. FRONTMATTER REQUIREMENTS

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

<!-- /ANCHOR:frontmatter-requirements -->
<!-- ANCHOR:a-retrieval-anchor-convention -->
## 2A. RETRIEVAL ANCHOR CONVENTION

Use retrieval anchors for every H2 section so section-level loading can target stable IDs.

**Format**:
- Open marker immediately before each H2: `<!-- ANCHOR:section-slug -->`
- Close marker immediately before the next H2 (or EOF): `<!-- /ANCHOR:section-slug -->`
- Slug rules: kebab-case from H2 text, strip numbering/emojis/punctuation
- Duplicate slugs: append `-2`, `-3`, etc.

**Example**:

```markdown
## 1. WHEN TO USE

[Section content]

## 2. SMART ROUTING
```

---

<!-- /ANCHOR:a-retrieval-anchor-convention -->
<!-- ANCHOR:skill-template-with-bundled-resources -->
## 3. SKILL TEMPLATE (WITH BUNDLED RESOURCES)

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

<!-- /ANCHOR:skill-template-with-bundled-resources -->
<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

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

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

<!-- CRITICAL: This section starts with router pseudocode and remains the single routing authority.
     Do NOT add Activation Detection flowcharts, navigation guides, or separate use-case tables. -->

### Resource Router

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/workflows/quick_reference.md"

INTENT_SIGNALS = {
    "PRIMARY": {"weight": 3, "keywords": ["[primary keyword]", "[primary phrase]"]},
    "SECONDARY": {"weight": 3, "keywords": ["[secondary keyword]", "[secondary phrase]"]},
    "DEBUG": {"weight": 4, "keywords": ["error", "failed", "debug", "stuck"]},
}

RESOURCE_MAP = {
    "PRIMARY": ["references/[primary-guide].md"],
    "SECONDARY": ["references/[secondary-guide].md", "assets/[template].md"],
    "DEBUG": ["references/[troubleshooting].md"],
}

COMMAND_BOOSTS = {
    "/[skill]:[primary]": "PRIMARY",
    "/[skill]:[secondary]": "SECONDARY",
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["deep dive", "full checklist", "full template"],
    "ON_DEMAND": ["references/[deep-dive].md"],
}


def _task_text(task) -> str:
    parts = [
        str(getattr(task, "query", "")),
        str(getattr(task, "text", "")),
        " ".join(getattr(task, "keywords", []) or []),
        str(getattr(task, "command", "")),
    ]
    return " ".join(parts).lower()


def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()


def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}


def score_intents(task) -> dict[str, float]:
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}

    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]

    command = str(getattr(task, "command", "")).lower()
    for prefix, intent in COMMAND_BOOSTS.items():
        if command.startswith(prefix):
            scores[intent] += 6

    return scores


def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["PRIMARY"]

    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])

    return selected[:2]


def route_[skill_name]_resources(task):
    inventory = discover_markdown_resources()
    intents = select_intents(score_intents(task), ambiguity_delta=1.0)
    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    return {"intents": intents, "resources": loaded}
```

### Resource Loading Levels

| Level       | When to Load             | Resources                    |
| ----------- | ------------------------ | ---------------------------- |
| ALWAYS      | Every skill invocation   | Shared patterns + SKILL.md   |
| CONDITIONAL | If intent signals match  | Intent-mapped references     |
| ON_DEMAND   | Only on explicit request | Deep-dive quality standards  |

### Routing Authority

Intent scoring and the in-code resource map in this section are the authoritative routing source. Do not maintain separate use-case routing tables.

### Resource Domains

- `references/[domain]/` for in-depth guidance and standards.
- `assets/[domain]/` for templates, examples, and reusable outputs.
- `scripts/` for optional automation entrypoints when needed.

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

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
     Use H3 by default; H4 is allowed when nested under phase headings.
     Do NOT remove these emojis. Do NOT add horizontal dividers (---) between RULES subsections. -->

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

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

<!-- /ANCHOR:rules -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

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

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:integration-points -->
## 6. INTEGRATION POINTS

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

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

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
- Section 2 (SMART ROUTING): 80-200 lines (routing logic + resource catalog)
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

<!-- /ANCHOR:related-resources -->
<!-- ANCHOR:section-by-section-content-guidance -->
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

**Purpose**: Provide authoritative resource routing with scoped guards, recursive discovery, weighted scoring, and ambiguity handling.

**Critical Rule**:
```
❌ WRONG: Activation Detection flowcharts as the primary routing source
❌ WRONG: Separate use-case routing tables or navigation guides
✅ RIGHT: Router pseudocode first, then loading levels + routing authority + resource domains

Section 2 contains four subsections:
1. Resource Router (pseudocode first)
2. Resource Loading Levels
3. Routing Authority
4. Resource Domains
```

**Placement**: After Section 1 (WHEN TO USE), before Section 3 (HOW IT WORKS)

**Essential Content**:
- **Resource Router** - pseudocode with scoped path guard, recursive discovery, weighted intent scoring, and top-2 ambiguity handling
- **Resource Loading Levels** - ALWAYS/CONDITIONAL/ON_DEMAND table aligned to in-code behavior
- **Routing Authority** - single-source rule that points to the router code + resource map
- **Resource Domains** - concise domain-level paths (no static file inventories)

**Structure**:

<!-- /ANCHOR:section-by-section-content-guidance -->
<!-- ANCHOR:smart-routing-2 -->
## 2. SMART ROUTING

### Resource Router

```python
# Pseudocode-first router (authoritative)
# 1) Scope guard resource paths to current skill root
# 2) Discover markdown resources recursively
# 3) Score intents with weighted keyword + command boosts
# 4) Select top-2 intents when scores are close
# 5) Load ALWAYS resources, then CONDITIONAL intent resources, then ON_DEMAND resources
```

### Resource Loading Levels

| Level       | When to Load             | Resources                    |
| ----------- | ------------------------ | ---------------------------- |
| ALWAYS      | Every skill invocation   | Shared patterns + SKILL.md   |
| CONDITIONAL | If intent signals match  | Intent-mapped references     |
| ON_DEMAND   | Only on explicit request | Deep-dive quality standards  |

### Routing Authority

Intent scoring and the in-code resource map in this section are the authoritative routing source. Do not maintain separate use-case routing tables.

### Resource Domains

- `references/[domain]/` for guidance, standards, and troubleshooting.
- `assets/[domain]/` for templates and examples.
- `scripts/` for optional automation where needed.

**Writing Tips**:
- Put router pseudocode first under SMART ROUTING.
- Keep conditions measurable and tied to resource paths.
- Keep `RESOURCE_MAP` and loading levels synchronized.
- Require scoped guards and recursive discovery in every router.
- Use top-2 ambiguity handling when intent scores are close.
- Avoid static use-case tables and activation flowcharts.

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

<!-- /ANCHOR:smart-routing-2 -->
<!-- ANCHOR:common-pitfalls -->
## 5. COMMON PITFALLS

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
8. Redundant routing tables → Keep routing authority in pseudocode

### Writing Style Quick Reference

**DO**: Third-person voice (descriptions), imperative form (instructions), specific examples, rationale for rules

**DON'T**: Second-person ("You should..."), vague descriptions, duplicate content, angle brackets in frontmatter

---

<!-- /ANCHOR:common-pitfalls -->
<!-- ANCHOR:quality-checklist-quick-reference -->
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
□ Numbered H2 sections (1. WHEN TO USE, 2. SMART ROUTING, etc.)
□ H2 headings use ALL CAPS
□ Section separators (---) between major sections
□ No table of contents (forbidden in SKILL.md)
□ Proper heading hierarchy (H1 → H2 → H3)
□ SMART ROUTING section placed after WHEN TO USE, before HOW IT WORKS

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
□ Section 1 does NOT contain file-path routing logic
□ SMART ROUTING section exists (Section 2 - REQUIRED for all skills)
□ Section 2 first subsection is Resource Router pseudocode
□ Section 2 includes scoped guard + recursive discovery markers
□ Section 2 includes weighted intent scoring + top-2 ambiguity handling
□ Section 2 includes Resource Loading Levels table
□ Section 2 includes Routing Authority statement
□ Section 2 includes domain-level resource paths (not static inventories)
□ Flowchart supplements added to complex logic blocks in Section 3 (where applicable)
□ Python/YAML code preserved (supplements, not replacements)
□ All ASCII diagrams use consistent style (when used)

Quality:
□ SKILL.md under 5k words (<3k preferred)
□ Concrete examples included
□ Rationale provided for rules
□ Language is third-person (descriptions) or imperative (instructions)
□ Consistent heading format
□ All code blocks specify language
□ Links work correctly
□ Section 1 contains ONLY triggers/use cases (NO file references)
□ Section 2 Resource Router load() calls include file refs with descriptions


### Quick Reference Table

| Element               | Requirement                | Example                                                                                            |
| --------------------- | -------------------------- | -------------------------------------------------------------------------------------------------- |
| **Filename**          | `SKILL.md` (exact case)    | ✅ `SKILL.md`  ❌ `skill.md`                                                                         |
| **Frontmatter**       | Required YAML with fields  | `name`, `description`, `allowed-tools`                                                             |
| **Name Format**       | `hyphen-case`              | ✅ `workflows-chrome-devtools`  ❌ `devtools_cli`                                                    |
| **Description Voice** | Third-person               | ✅ "Use when..."  ❌ "You should..."                                                                 |
| **H2 Format**         | Number + ALL CAPS          | ✅ `## 1. WHEN TO USE`                                                                            |
| **TOC**               | Forbidden in SKILL.md      | ❌ No table of contents                                                                             |
| **Sections**          | 6 required sections        | WHEN TO USE (triggers only), SMART ROUTING (router-first + loading levels + authority), HOW IT WORKS, RULES, SUCCESS CRITERIA, INTEGRATION POINTS |
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

<!-- /ANCHOR:quality-checklist-quick-reference -->
<!-- ANCHOR:related-resources-2 -->
## 7. RELATED RESOURCES

### Templates
- [frontmatter_templates.md](../documentation/frontmatter_templates.md) - Frontmatter by document type
- [skill_asset_template.md](./skill_asset_template.md) - Asset file creation guide
- [skill_reference_template.md](./skill_reference_template.md) - Reference file templates

### Standards
- [core_standards.md](../../references/core_standards.md) - Document type rules
- [skill_creation.md](../../references/skill_creation.md) - Complete skill creation workflow
<!-- /ANCHOR:related-resources-2 -->
