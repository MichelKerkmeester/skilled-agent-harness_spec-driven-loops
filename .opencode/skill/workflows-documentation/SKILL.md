---
name: workflows-documentation
description: "Unified markdown and OpenCode component specialist providing document quality enforcement (structure, style), content optimization for AI assistants, complete component creation workflows (skills, agents, commands with scaffolding, validation, packaging), ASCII flowchart creation for visualizing complex workflows, and install guide creation for MCP servers, plugins, and tools."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 5.2.0
---

<!-- Keywords: workflows-documentation, markdown-quality, skill-creation, document-validation, ascii-flowchart, llms-txt, content-optimization, extract-structure -->

# Documentation Creation Specialist - Unified Markdown & Component Management

Unified specialist providing: (1) Document quality pipeline with structure enforcement and content optimization, (2) OpenCode component creation (skills, agents, commands) with scaffolding, validation, and packaging, (3) ASCII flowchart creation for visualizing workflows, and (4) Install guide creation for setup documentation.

**Core Principle**: Structure first, then content, then quality.

**Architecture**: Scripts handle deterministic parsing/metrics, AI handles quality judgment and recommendations.

---

## 1. 🎯 WHEN TO USE

### Use Case: Document Quality Management

Enforce markdown structure, optimize content for AI assistants, validate quality through script-assisted AI analysis.

**README Creation** - Use `readme_template.md` when:
- Creating new README for any folder or project
- User requests "create a README", "add documentation"
- Folder needs comprehensive documentation

**Frontmatter Validation** - Use `frontmatter_templates.md` when:
- Validating YAML frontmatter in any document
- Checking required fields for document types
- Fixing frontmatter syntax errors

**Validation Workflow** - Apply after Write/Edit operations:
- Auto-correct filename violations (ALL CAPS → lowercase, hyphens → underscores)
- Fix safe violations (separators, H2 case, emoji per rules)
- Check critical violations (missing frontmatter, wrong section order)

**Manual Optimization** - Run when:
- README needs optimization for AI assistants
- Creating critical documentation (specs, knowledge, skills)
- Pre-release quality checks
- Generating llms.txt for LLM navigation

### Use Case: OpenCode Component Creation

Create and manage OpenCode components: skills, agents, and commands. Each component type has templates, validation, and quality standards.

**Component Types:**
- **Skills** (.opencode/skill/) - Knowledge bundles with workflows → [skill_creation.md](./references/skill_creation.md)
- **Agents** (.opencode/agent/) - AI personas with tool permissions → [agent_template.md](./assets/opencode/agent_template.md)
- **Commands** (.opencode/command/) - Slash commands for user invocation → [command_template.md](./assets/opencode/command_template.md)

**Use when**:
- User requests skill creation ("create a skill", "make a new skill")
- User requests agent creation ("create an agent", "make a new agent")
- User requests command creation ("create a command", "add a slash command")
- Scaffolding component structure
- Validating component quality
- Packaging skill for distribution

**Skill Process (6 steps)**: Understanding (examples) → Planning (resources) → Initialization (`init_skill.py`) → Editing (populate) → Packaging (`package_skill.py`) → Iteration (test/improve)

**Agent Process**: Load `agent_template.md` → Define frontmatter (tools, permissions) → Create sections (workflow, capabilities, anti-patterns) → Validate → Test

**Command Process**: Load `command_template.md` → Define frontmatter (name, description) → Create execution logic → Add to command registry → Test

### Use Case: Flowchart Creation

Create ASCII flowcharts for visualizing workflows, user journeys, and decision trees.

**Use when**:
- Documenting multi-step processes with branching
- Creating decision trees with multiple outcomes
- Showing parallel execution with sync points
- Visualizing approval gates and revision cycles

**See**: [assets/flowcharts/](./assets/flowcharts/)

### Use Case: Install Guide Creation

Create and validate installation documentation for MCP servers, plugins, and tools using phase-based templates.

**Use when**:
- Creating documentation for MCP server installation
- Documenting plugin setup procedures
- Standardizing tool installation across platforms
- Need phase-based validation checkpoints

**5-Phase Process**: Overview → Prerequisites → Installation → Configuration → Verification

**See**: [install_guide_standards.md](./references/install_guide_standards.md)

### When NOT to Use (All Modes)

- Non-markdown files (only `.md` supported)
- Simple typo fixes (use Edit tool directly)
- Internal notes or drafts
- Auto-generated API docs
- Very simple 2-3 step processes (use bullet points)
- Code architecture (use mermaid diagrams)

---

## 2. 🧭 SMART ROUTING & REFERENCES

### Mode Selection

```text
TASK CONTEXT
    │
    ├─► Improving markdown / documentation quality
    │   └─► MODE 1: Document Quality
    │       ├─► README creation: readme_template.md
    │       ├─► Knowledge files, general markdown
    │       ├─► Frontmatter validation: frontmatter_templates.md
    │       ├─► Quality analysis: extract_structure.py → JSON
    │       └─► llms.txt generation (ask first)
    │
    ├─► Creating OpenCode components (skills, agents, commands)
    │   └─► MODE 2: Component Creation
    │       ├─► Skills: init_skill.py + skill_md_template.md
    │       ├─► Agents: agent_template.md
    │       └─► Commands: command_template.md
    │
    ├─► Creating ASCII flowcharts / diagrams
    │   └─► MODE 3: Flowchart Creation
    │       └─► Load flowchart assets by pattern type
    │
    ├─► Creating install guide / setup documentation
    │   └─► MODE 4: Install Guide Creation
    │       └─► Load: install_guide_template.md
    │
    └─► Quick reference / standards lookup
        └─► Load: quick_reference.md
```

### Resource Router

**Mode 1 - Document Quality:**

| Condition              | Resource                          | Purpose                                        |
| ---------------------- | --------------------------------- | ---------------------------------------------- |
| Checking structure     | `references/core_standards.md`    | Filename conventions, structural violations    |
| Optimizing content     | `references/optimization.md`      | Question coverage, AI-friendly transformations |
| Validating quality     | `references/validation.md`        | DQI scoring, quality gates                     |
| Workflow guidance      | `references/workflows.md`         | Execution modes, enforcement patterns          |
| **Creating README**    | `assets/documentation/readme_template.md`       | README structure (13 sections)                 |
| **Validating frontmatter** | `assets/documentation/frontmatter_templates.md` | Frontmatter validation & templates (11 types) |

**Mode 2 - OpenCode Component Creation:**

| Category | Condition               | Resource                                         | Purpose                                  |
| -------- | ----------------------- | ------------------------------------------------ | ---------------------------------------- |
| **Skills** | Creating skill        | `references/skill_creation.md` + `init_skill.py` | 6-step workflow                          |
|          | SKILL.md template       | `assets/opencode/skill_md_template.md`                    | SKILL.md structure                       |
|          | Reference template      | `assets/opencode/skill_reference_template.md`             | Reference docs in references/            |
|          | Asset template          | `assets/opencode/skill_asset_template.md`                 | Bundled assets in assets/                |
|          | Packaging skill         | `scripts/package_skill.py`                       | Validation + zip                         |
| **Agents** | Creating agent        | `assets/opencode/agent_template.md`                       | Agent file with frontmatter & permissions |
| **Commands** | Creating command    | `assets/opencode/command_template.md`                     | Command creation guide (19 sections)     |
| **Shared** | Component README      | `assets/documentation/readme_template.md`                      | README for skill/agent/command folders   |
|          | Quick validation        | `scripts/quick_validate.py`                      | Fast validation checks                   |

**Mode 3 - Flowcharts:**

| Pattern       | Resource                                            | Use Case         |
| ------------- | --------------------------------------------------- | ---------------- |
| Linear        | `assets/flowcharts/simple_workflow.md`              | Sequential steps |
| Decision      | `assets/flowcharts/decision_tree_flow.md`           | Branching logic  |
| Parallel      | `assets/flowcharts/parallel_execution.md`           | Concurrent tasks |
| Nested        | `assets/flowcharts/user_onboarding.md`              | Sub-processes    |
| Loop/Approval | `assets/flowcharts/approval_workflow_loops.md`      | Review cycles    |
| Swimlane      | `assets/flowcharts/system_architecture_swimlane.md` | Multi-stage      |

**Mode 4 - Install Guide Creation:**

| Condition              | Resource                                | Purpose              |
| ---------------------- | --------------------------------------- | -------------------- |
| Creating install guide | `assets/documentation/install_guide_template.md`      | Phase-based template |
| Need standards         | `references/install_guide_standards.md` | Best practices       |
| Validating guide       | `scripts/extract_structure.py`          | Quality check        |

**General Utilities:**

| Condition           | Resource                           | Purpose                                      |
| ------------------- | ---------------------------------- | -------------------------------------------- |
| Need frontmatter    | `assets/documentation/frontmatter_templates.md`  | Frontmatter validation & templates (11 secs) |
| Generating llms.txt | `assets/documentation/llmstxt_templates.md`      | llms.txt creation with decision framework    |
| Creating install    | `assets/documentation/install_guide_template.md` | 5-phase install guide template (14 sections) |
| Analyzing docs      | `scripts/extract_structure.py`     | Parse to JSON for AI analysis                |
| Quick reference     | `references/quick_reference.md`    | One-page cheat sheet                         |

### Core References

| Document | Purpose | Key Insight |
|----------|---------|-------------|
| [skill_creation.md](references/skill_creation.md) | Complete skill creation workflow | Template structure, validation |
| [validation.md](references/validation.md) | DQI scoring criteria | Quality gates |
| [optimization.md](references/optimization.md) | Content optimization | AI context efficiency |
| [core_standards.md](references/core_standards.md) | Structural standards | Section ordering |
| [workflows.md](references/workflows.md) | Execution modes | Mode selection |
| [quick_reference.md](references/quick_reference.md) | Command cheat sheet | Common operations |

### Templates

| Template | Purpose | Usage |
|----------|---------|-------|
| [skill_md_template.md](assets/opencode/skill_md_template.md) | SKILL.md template | New skill creation |
| [skill_reference_template.md](assets/opencode/skill_reference_template.md) | Reference file template | Bundled resources |
| [readme_template.md](assets/documentation/readme_template.md) | README template | Project documentation |
| [command_template.md](assets/opencode/command_template.md) | Command template | Slash commands |
| [agent_template.md](assets/opencode/agent_template.md) | Agent template | Custom agents |

### Resource Router

```python
def route_documentation_resources(task):
    """Route to appropriate documentation resources."""
    
    # Mode 1: Skill Creation
    if task.involves("skill creation") or task.involves("new skill"):
        load("references/skill_creation.md")
        load("assets/opencode/skill_md_template.md")
        return "Mode 1: Skill Creation"
    
    if task.involves("reference file") or task.involves("bundled resource"):
        load("assets/opencode/skill_reference_template.md")
        return "Mode 1: Reference Creation"
    
    # Mode 2: Document Quality
    if task.involves("DQI") or task.involves("quality score"):
        load("references/validation.md")
        return "Mode 2: Document Quality"
    
    # Mode 3: Content Optimization
    if task.involves("optimize") or task.involves("AI context"):
        load("references/optimization.md")
        return "Mode 3: Content Optimization"
    
    # Mode 4: Flowchart Creation
    if task.involves("flowchart") or task.involves("ASCII diagram"):
        load("assets/flowcharts/")
        return "Mode 4: Flowchart Creation"
    
    # Mode 5: Install Guide
    if task.involves("install guide") or task.involves("setup instructions"):
        load("assets/documentation/install_guide_template.md")
        return "Mode 5: Install Guide"
    
    # Default
    load("references/quick_reference.md")
    return "Quick Reference"
```

**Key Insight**: Always run `extract_structure.py` first - it provides the structured JSON that enables accurate AI quality assessment. Without it, quality evaluation is subjective guesswork.

---

## 3. 🛠️ HOW IT WORKS

### Mode 1: Document Quality

**Script-Assisted AI Analysis**:

```bash
# 1. Extract document structure to JSON
scripts/extract_structure.py path/to/document.md

# 2. AI receives JSON with:
#    - Frontmatter, structure, metrics
#    - Checklist results, DQI score
#    - Evaluation questions

# 3. AI reviews and provides recommendations
```

**Document Type Detection** (auto-applies enforcement):

| Type      | Enforcement | Frontmatter | Notes                            |
| --------- | ----------- | ----------- | -------------------------------- |
| README    | Flexible    | None        | Focus on quick-start usability   |
| SKILL     | Strict      | Required    | No structural checklist failures |
| Knowledge | Moderate    | Forbidden   | Consistent, scannable reference  |
| Command   | Strict      | Required    | Must be executable               |
| Spec      | Loose       | Optional    | Working docs; avoid blocking     |
| Generic   | Flexible    | Optional    | Best-effort structure            |

### Mode 2: OpenCode Component Creation

#### Skill Creation

**Progressive Disclosure Design**:
1. Metadata (name + description) - Always in context (~100 words)
2. SKILL.md body - When skill triggers (<5k words)
3. Bundled resources - As needed (unlimited)

**After packaging**: Run `extract_structure.py` on SKILL.md for final quality review.

**Typical Workflow**:
```bash
# 1. Initialize skill structure
scripts/init_skill.py my-skill --path .opencode/skill

# 2. Edit SKILL.md and bundled resources
# [User populates templates with content]

# 3. Quick validation check
scripts/quick_validate.py .opencode/skill/my-skill --json

# 4. Package with full validation
scripts/package_skill.py .opencode/skill/my-skill

# 5. Quality assurance (DQI scoring)
scripts/extract_structure.py .opencode/skill/my-skill/SKILL.md
```

#### Agent Creation

**Template-First Workflow**:
1. Load `agent_template.md` for structure reference
2. Create agent file in `.opencode/agent/`
3. Define YAML frontmatter (name, tools, permissions)
4. Create required sections (workflow, capabilities, anti-patterns)
5. Validate frontmatter syntax
6. Test with real examples

**Key Difference from Skills**: Agents have tool permissions (true/false per tool) and action permissions (allow/deny), not just allowed-tools array.

#### Command Creation

**Template-First Workflow**:
1. Load `command_template.md` for structure reference
2. Create command file in `.opencode/command/`
3. Define YAML frontmatter (name, description, triggers)
4. Create execution logic and examples
5. Add to command registry
6. Test invocation

### Mode 3: Flowchart Creation

**Building Blocks**:
```text
Process Box:        Decision Diamond:     Terminal:
┌─────────────┐         ╱──────╲           ╭─────────╮
│   Action    │        ╱ Test?  ╲          │  Start  │
└─────────────┘        ╲        ╱          ╰─────────╯
                        ╲──────╱
```

**Flow Control**:
```text
Standard Flow:      Branch:           Parallel:         Merge:
     │              │   │   │         ┌────┬────┐         │
     ▼              ▼   ▼   ▼         │    │    │      ───┴───
                                      ▼    ▼    ▼         │
```

**7 Core Patterns**:

| Pattern              | Use Case                       | Reference File                    |
| -------------------- | ------------------------------ | --------------------------------- |
| 1: Linear Sequential | Step-by-step without branching | `simple_workflow.md`              |
| 2: Decision Branch   | Binary or multi-way decisions  | `decision_tree_flow.md`           |
| 3: Parallel          | Multiple tasks run together    | `parallel_execution.md`           |
| 4: Nested            | Embedded sub-workflows         | `user_onboarding.md`              |
| 5: Approval Gate     | Review/approval required       | `approval_workflow_loops.md`      |
| 6: Loop/Iteration    | Repeat until condition met     | `approval_workflow_loops.md`      |
| 7: Pipeline          | Sequential stages with gates   | `system_architecture_swimlane.md` |

**Workflow**: Select pattern → Build with components → Validate (`validate_flowchart.sh`) → Document

---

## 4. 📋 RULES

### Mode 1: Document Quality

#### ✅ ALWAYS

1. **ALWAYS validate filename conventions** (snake_case, preserve README.md/SKILL.md)
2. **ALWAYS detect document type first** (applies correct enforcement level)
3. **ALWAYS verify frontmatter** for SKILL.md and Command types
4. **NEVER add TOC** (only allowed in README files)
5. **ALWAYS ask about llms.txt generation** (never auto-generate)
6. **ALWAYS apply safe auto-fixes** (H2 case, separators, filenames)
7. **ALWAYS validate before completion** (structure + content + style)
8. **ALWAYS provide metrics** (before/after counts from script output)

#### ❌ NEVER

1. **NEVER modify spec files during active development** (loose enforcement)
2. **NEVER delete original content without approval**
3. **NEVER block for safe violations** (only block: missing frontmatter, wrong order)
4. **NEVER generate llms.txt without asking**
5. **NEVER apply wrong enforcement level**

#### ⚠️ ESCALATE IF

1. Document type ambiguous
2. Critical violations detected
3. Major restructuring needed
4. Style guide missing
5. Conflicts with user intent

### Mode 2: OpenCode Component Creation

#### Skills

##### ✅ ALWAYS

1. **ALWAYS start with concrete examples** (validate understanding)
2. **ALWAYS run init_skill.py** (proper scaffolding)
3. **ALWAYS identify bundled resources** (scripts/references/assets)
4. **ALWAYS use third-person** ("Use when..." not "You should use...")
5. **ALWAYS keep SKILL.md <5k words** (move details to references/)
6. **ALWAYS delete unused examples** (keep lean)
7. **ALWAYS validate before packaging**
8. **ALWAYS recommend final review** (run `extract_structure.py`)

##### ❌ NEVER

1. **NEVER use second-person** (imperative/infinitive only)
2. **NEVER duplicate SKILL.md/references/** (progressive disclosure)
3. **NEVER create without examples**
4. **NEVER skip validation**
5. **NEVER include excessive detail** (SKILL.md is orchestrator)
6. **NEVER use vague descriptions**

##### ⚠️ ESCALATE IF

1. Skill purpose unclear
2. No concrete examples
3. Validation fails repeatedly
4. Unsupported features
5. User input required (brand assets, API docs)

#### Agents

##### ✅ ALWAYS

1. **ALWAYS load agent_template.md first** (template-first workflow)
2. **ALWAYS validate frontmatter** (name, mode, temperature, tools, permission)
3. **ALWAYS include CORE WORKFLOW section** (numbered steps)
4. **ALWAYS include ANTI-PATTERNS section** (what NOT to do)
5. **ALWAYS set explicit tool permissions** (true/false for each tool)
6. **ALWAYS test with real examples** before deployment

##### ❌ NEVER

1. **NEVER create agents without @write agent** (bypasses quality gates)
2. **NEVER skip frontmatter validation** (causes discovery failures)
3. **NEVER use vague tool permissions** (be explicit: true or false)
4. **NEVER omit anti-patterns** (agents need clear boundaries)

##### ⚠️ ESCALATE IF

1. Agent purpose overlaps with existing agent
2. Tool permissions unclear
3. Behavioral rules conflict with AGENTS.md

#### Commands

##### ✅ ALWAYS

1. **ALWAYS load command_template.md first** (template-first workflow)
2. **ALWAYS define clear triggers** (what invokes the command)
3. **ALWAYS include usage examples** (copy-paste ready)
4. **ALWAYS validate command name** (lowercase, colon-separated)

##### ❌ NEVER

1. **NEVER create commands without frontmatter** (required for discovery)
2. **NEVER use ambiguous triggers** (must be unique)
3. **NEVER skip testing** (commands must work on first invocation)

##### ⚠️ ESCALATE IF

1. Command conflicts with existing command
2. Trigger phrase is ambiguous
3. Command requires special permissions

### Mode 3: Flowchart Creation

#### ✅ ALWAYS

1. **ALWAYS use consistent box styles** (single-line process, rounded terminals, diamond decisions)
2. **ALWAYS label all decision branches** (Yes/No or specific outcomes)
3. **ALWAYS align elements** (no diagonal lines, consistent spacing)
4. **ALWAYS show complete paths** (every box has entry/exit)
5. **ALWAYS validate readability**

#### ❌ NEVER

1. **NEVER create ambiguous arrow connections**
2. **NEVER leave decision outcomes unlabeled**
3. **NEVER exceed 40 boxes** (break into sub-workflows)
4. **NEVER mix box styles inconsistently**
5. **NEVER skip spacing and alignment**

#### ⚠️ ESCALATE IF

1. Process exceeds ~40 boxes
2. Interactive/exportable format needed
3. Collaborative editing required
4. Pattern unclear

### Mode 4: Install Guide Creation

#### ✅ ALWAYS

1. **ALWAYS include AI-first install prompt** at the top
2. **ALWAYS use phase validation checkpoints** (phase_N_complete pattern)
3. **ALWAYS provide platform-specific configurations** (OpenCode, Claude Code, Claude Desktop)
4. **ALWAYS include troubleshooting section** with Error → Cause → Fix format
5. **ALWAYS verify commands are copy-paste ready**

#### ❌ NEVER

1. **NEVER skip validation checkpoints** (each phase must validate)
2. **NEVER assume prerequisites** (always list and verify)
3. **NEVER mix platform instructions** (separate clearly)
4. **NEVER use relative paths** in command examples

#### ⚠️ ESCALATE IF

1. Multi-platform complexity requires testing
2. External dependencies unavailable
3. Installation requires special permissions

### Emoji Usage Rules

| Heading Level    | Emoji Rule      | Example                      |
| ---------------- | --------------- | ---------------------------- |
| **H1** (`#`)     | ❌ NEVER         | `# Documentation Specialist` |
| **H2** (`##`)    | ✅ ALWAYS        | `## 1. 🎯 CAPABILITIES`       |
| **H3** (`###`)   | ⚠️ SEMANTIC ONLY | `### ✅ ALWAYS` (RULES only)  |
| **H4+** (`####`) | ❌ NEVER         | `#### Success Metrics`       |

**Body Text**: ✅ Status indicators (✅ ❌ ⚠️), priority markers (🔴 🟡 🔵), visual indicators (📊 🔍 ⚡) - only when enhancing clarity.

**H3 Semantic Exception**: Emojis ✅ ❌ ⚠️ REQUIRED on H3 in RULES sections for functional signaling.

### H2 Emoji Enforcement by Document Type

| Document Type | Emoji Required | Enforcement Level | Missing Emoji Severity |
|---------------|----------------|-------------------|------------------------|
| **SKILL.md** | ✅ Yes | Strict | `error` (BLOCKING) |
| **README.md** | ✅ Yes | Strict | `error` (BLOCKING) |
| **Asset files** | ✅ Yes | Strict | `error` (BLOCKING) |
| **Reference files** | ✅ Yes | Strict | `error` (BLOCKING) |
| **Command files** | ⚠️ Semantic only | Moderate | `warning` |
| **Spec files** | ❌ No | Loose | N/A |
| **Generic** | ❌ No | Flexible | N/A |

**CRITICAL**: For template-based documents (SKILL, README, asset, reference), missing H2 emojis are BLOCKING errors. The `extract_structure.py` script will return `severity: 'error'` for these violations.

**Prevention**: Always COPY headers from templates. Never reconstruct from memory.

---

## 5. 🏆 SUCCESS CRITERIA

### Document Quality Index (DQI)

The `extract_structure.py` script computes a **DQI** (0-100) based on measurable attributes:

| Component     | Max | Measures                                          |
| ------------- | --- | ------------------------------------------------- |
| **Structure** | 40  | Checklist pass rate (type-specific)               |
| **Content**   | 30  | Word count, heading density, code examples, links |
| **Style**     | 30  | H2 formatting, dividers, intro paragraph          |

**Quality Bands**:

| Band           | Score  | Action                            |
| -------------- | ------ | --------------------------------- |
| **Excellent**  | 90-100 | None needed                       |
| **Good**       | 75-89  | Minor improvements                |
| **Acceptable** | 60-74  | Several areas need attention      |
| **Needs Work** | <60    | Significant improvements required |

**Example DQI Output** (from `extract_structure.py`):
```json
{
  "dqi": {
    "total": 96,
    "band": "excellent",
    "components": {
      "structure": 40,
      "content": 26,
      "style": 30
    }
  },
  "checklist": { "passed": 12, "failed": 0, "skipped": 2 },
  "documentType": "SKILL"
}
```

### Completion Checklists

**Document Quality Complete**:
- ✅ `extract_structure.py` executed, JSON parsed
- ✅ Document type detected, checklist reviewed
- ✅ Evaluation questions answered, recommendations generated
- ✅ All critical issues addressed

**Skill Creation Complete**:
- ✅ YAML frontmatter with name + description (third-person, specific)
- ✅ SKILL.md under 5k words, bundled resources organized
- ✅ Unused examples deleted, passes `package_skill.py`
- ✅ Final AI review completed, tested on real examples

**Agent Creation Complete**:
- ✅ YAML frontmatter with name, mode, temperature, tools, permission
- ✅ Tool permissions explicitly set (true/false for each)
- ✅ CORE WORKFLOW section with numbered steps
- ✅ ANTI-PATTERNS section with clear boundaries
- ✅ RELATED RESOURCES section with links
- ✅ Tested with real examples

**Command Creation Complete**:
- ✅ YAML frontmatter with name, description, triggers
- ✅ Clear usage examples (copy-paste ready)
- ✅ Execution logic defined
- ✅ Added to command registry
- ✅ Tested invocation works

**Flowchart Complete**:
- ✅ All paths clear, decisions labeled, parallel blocks resolve
- ✅ Spacing consistent, understandable without explanation
- ✅ Size limits: ≤40 boxes, ≤8 depth levels, ≤200 lines

**Install Guide Complete**:
- ✅ AI-first prompt included, copy-paste ready
- ✅ All 5 phases have validation checkpoints
- ✅ Platform configurations provided (at least OpenCode)
- ✅ Troubleshooting covers common errors
- ✅ Commands tested and working

### Document-Type Gates

| Type      | Structure               | Content              | Required                    |
| --------- | ----------------------- | -------------------- | --------------------------- |
| SKILL.md  | Strict (no failures)    | High AI-friendliness | Frontmatter, WHEN/HOW/RULES |
| README.md | Flexible                | High AI-friendliness | Quick Start, examples       |
| Knowledge | Strict (no frontmatter) | Good AI-friendliness | Numbered H2s                |

---

## 6. 🔌 INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

### Scripts

| Script                  | Purpose                   | Usage                                       |
| ----------------------- | ------------------------- | ------------------------------------------- |
| `extract_structure.py`  | Parse document to JSON    | `scripts/extract_structure.py doc.md`       |
| `init_skill.py`         | Scaffold skill structure  | `scripts/init_skill.py <name> --path <dir>` |
| `package_skill.py`      | Validate + package to zip | `scripts/package_skill.py <skill-path>`     |
| `quick_validate.py`     | Fast validation checks    | `scripts/quick_validate.py <skill-path>`    |
| `validate_flowchart.sh` | Flowchart validation      | `scripts/validate_flowchart.sh <file>`      |

### Tool Usage

| Tool      | Purpose                                  |
| --------- | ---------------------------------------- |
| **Read**  | Examine files before optimization        |
| **Write** | Create optimized versions or llms.txt    |
| **Edit**  | Apply specific transformations           |
| **Bash**  | Execute scripts                          |
| **Glob**  | Find markdown files for batch processing |
| **Grep**  | Search for patterns/violations           |

### Related Skills

| Skill               | Integration                                           |
| ------------------- | ----------------------------------------------------- |
| **system-spec-kit** | Context files can be optimized; validates spec folder documentation structure |
| **workflows-git**   | Uses documentation quality for commit/PR descriptions |

### Workflow Integration

**Skill Creation → Document Quality**:
1. Initialize (`init_skill.py`)
2. Edit SKILL.md and resources
3. Package (`package_skill.py`)
4. Quality validation (`extract_structure.py`)
5. Iterate if needed

---

## 7. 📚 EXTERNAL RESOURCES

- **llms.txt specification**: https://llmstxt.org/
- **Context7 (external docs benchmark)**: https://context7.ai/
- **Anthropic documentation**: https://docs.anthropic.com/
- **CommonMark specification**: https://spec.commonmark.org/

---

## 8. 🔗 RELATED RESOURCES

### For Document Quality

1. Read Sections 3-6 (When/How/Rules/Success)
2. Navigate: [workflows.md](./references/workflows.md) for execution modes
3. Run enforcement, optimization, or validation as needed

### For Skill Creation

1. Read Sections 3-6 (When/How/Rules/Success)
2. Navigate: [skill_creation.md](./references/skill_creation.md) for workflow
3. Use Scripts: `init_skill.py` → edit → `package_skill.py`
4. Validate: Run Document Quality validation on SKILL.md

### Quick Reference

Need fast navigation? See [quick_reference.md](./references/quick_reference.md)

---

**Remember**: This skill operates in four modes - Document Quality, Skill Creation, Flowchart Creation, and Install Guide Creation. All modes integrate seamlessly for creating and validating high-quality documentation and skills.