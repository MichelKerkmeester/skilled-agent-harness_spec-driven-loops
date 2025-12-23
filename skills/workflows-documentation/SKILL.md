---
name: workflows-documentation
description: "Unified markdown and skill management specialist providing document quality enforcement (structure, style), content optimization for AI assistants, complete skill creation workflow (scaffolding, validation, packaging), ASCII flowchart creation for visualizing complex workflows, user journeys, and decision trees, and install guide creation for MCP servers, plugins, and tools."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 5.1.0
---

<!-- Keywords: workflows-documentation, markdown-quality, skill-creation, document-validation, ascii-flowchart, llms-txt, content-optimization, extract-structure -->

# Documentation Creation Specialist - Unified Markdown & Skill Management

Unified specialist providing: (1) Document quality pipeline with structure enforcement and content optimization, (2) Skill creation workflow with scaffolding, validation, and packaging, and (3) ASCII flowchart creation for visualizing workflows and decision trees.

**Core principle**: Structure first, then content, then quality.

**Architecture**: Scripts handle deterministic parsing/metrics, AI handles quality judgment and recommendations.

---

## 1. 🎯 CAPABILITIES OVERVIEW

### Mode 1: Document Quality Management

Enforce markdown structure, optimize content for AI assistants, validate quality through script-assisted AI analysis.

**Use when**: Writing/optimizing markdown, enforcing structural standards, improving AI-friendliness, validating before release.

### Mode 2: Skill Creation & Management

Guide skill creation through 6-step workflow: Understanding → Planning → Initialization → Editing → Packaging → Iteration.

**Use when**: Creating new skills, scaffolding structure, validating SKILL.md quality, packaging for distribution.

**See**: [skill_creation.md](./references/skill_creation.md)

### Mode 3: Flowchart Creation

Create ASCII flowcharts for visualizing workflows, user journeys, and decision trees.

**Use when**: Documenting multi-step processes, decision trees, parallel execution, approval gates.

**See**: [assets/flowcharts/](./assets/flowcharts/)

### Mode 4: Install Guide Creation

Create and validate installation documentation for MCP servers, plugins, and tools using phase-based templates.

**Use when**: Creating install guides, documenting setup procedures, standardizing installation documentation.

**See**: [install_guide_standards.md](./references/install_guide_standards.md)

---

## 2. 🧭 SMART ROUTING & REFERENCES

### Mode Selection

```text
TASK CONTEXT
    │
    ├─► Improving markdown / documentation quality
    │   └─► MODE 1: Document Optimization
    │       └─► Execute: extract_structure.py → JSON output
    │       └─► AI evaluates JSON and provides recommendations
    │
    ├─► Creating new skill / skill maintenance
    │   └─► MODE 2: Skill Creation
    │       └─► Execute: init_skill.py, package_skill.py
    │
    ├─► Creating ASCII flowcharts / diagrams
    │   └─► MODE 3: ASCII Flowcharts
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

| Condition          | Resource                       | Purpose                                        |
| ------------------ | ------------------------------ | ---------------------------------------------- |
| Checking structure | `references/core_standards.md` | Filename conventions, structural violations    |
| Optimizing content | `references/optimization.md`   | Question coverage, AI-friendly transformations |
| Validating quality | `references/validation.md`     | DQI scoring, quality gates                     |
| Workflow guidance  | `references/workflows.md`      | Execution modes, enforcement patterns          |

**Mode 2 - Skill Creation:**

| Condition               | Resource                                         | Purpose                                   |
| ----------------------- | ------------------------------------------------ | ----------------------------------------- |
| Creating skill          | `references/skill_creation.md` + `init_skill.py` | 6-step workflow                           |
| Need template           | `assets/skill_md_template.md`                    | SKILL.md structure                        |
| Need asset template     | `assets/skill_asset_template.md`                 | Bundled assets                            |
| Need reference template | `assets/skill_reference_template.md`             | Reference docs                            |
| Need README template    | `assets/readme_template.md`                      | Comprehensive README guide (13 sections)  |
| Creating command        | `assets/command_template.md`                     | Command creation guide (19 sections)      |
| Packaging skill         | `scripts/package_skill.py`                       | Validation + zip                          |
| Quick validation        | `scripts/quick_validate.py`                      | Fast checks                               |

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

| Condition | Resource | Purpose |
|-----------|----------|---------|
| Creating install guide | `assets/install_guide_template.md` | Phase-based template |
| Need standards | `references/install_guide_standards.md` | Best practices |
| Validating guide | `scripts/extract_structure.py` | Quality check |

**General Utilities:**

| Condition           | Resource                          | Purpose                                       |
| ------------------- | --------------------------------- | --------------------------------------------- |
| Need frontmatter    | `assets/frontmatter_templates.md` | Frontmatter validation & templates (11 secs)  |
| Generating llms.txt | `assets/llmstxt_templates.md`     | llms.txt creation with decision framework     |
| Creating install    | `assets/install_guide_template.md`| 5-phase install guide template (14 sections)  |
| Analyzing docs      | `scripts/extract_structure.py`    | Parse to JSON for AI analysis                 |
| Quick reference     | `references/quick_reference.md`   | One-page cheat sheet                          |

**Key Insight**: Always run `extract_structure.py` first - it provides the structured JSON that enables accurate AI quality assessment. Without it, quality evaluation is subjective guesswork.

---

## 3. 🎯 WHEN TO USE

### Mode 1: Document Quality

**Validation Workflow** - Apply after Write/Edit operations:
- Auto-correct filename violations (ALL CAPS → lowercase, hyphens → underscores)
- Fix safe violations (separators, H2 case, emoji per rules)
- Check critical violations (missing frontmatter, wrong section order)

**Manual Optimization** - Run when:
- README needs optimization for AI assistants
- Creating critical documentation (specs, knowledge, skills)
- Pre-release quality checks
- Generating llms.txt for LLM navigation

### Mode 2: Skill Creation

**Use when**:
- User requests skill creation ("create a skill", "make a new skill")
- Scaffolding skill directory structure
- Validating SKILL.md quality
- Packaging skill for distribution

**6-Step Process**: Understanding (examples) → Planning (resources) → Initialization (`init_skill.py`) → Editing (populate) → Packaging (`package_skill.py`) → Iteration (test/improve)

### Mode 3: Flowchart Creation

**Use when**:
- Documenting multi-step processes with branching
- Creating decision trees with multiple outcomes
- Showing parallel execution with sync points
- Visualizing approval gates and revision cycles

### Mode 4: Install Guide Creation

**Use when**:
- Creating documentation for MCP server installation
- Documenting plugin setup procedures
- Standardizing tool installation across platforms
- Need phase-based validation checkpoints

**5-Phase Process**: Overview → Prerequisites → Installation → Configuration → Verification

### When NOT to Use (All Modes)

- Non-markdown files (only `.md` supported)
- Simple typo fixes (use Edit tool directly)
- Internal notes or drafts
- Auto-generated API docs
- Very simple 2-3 step processes (use bullet points)
- Code architecture (use mermaid diagrams)

---

## 4. ⚙️ HOW TO USE

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

### Mode 2: Skill Creation

**Progressive Disclosure Design**:
1. Metadata (name + description) - Always in context (~100 words)
2. SKILL.md body - When skill triggers (<5k words)
3. Bundled resources - As needed (unlimited)

**After packaging**: Run `extract_structure.py` on SKILL.md for final quality review.

**Typical Workflow**:
```bash
# 1. Initialize skill structure
scripts/init_skill.py my-skill --path .opencode/skills

# 2. Edit SKILL.md and bundled resources
# [User populates templates with content]

# 3. Quick validation check
scripts/quick_validate.py .opencode/skills/my-skill --json

# 4. Package with full validation
scripts/package_skill.py .opencode/skills/my-skill

# 5. Quality assurance (DQI scoring)
scripts/extract_structure.py .opencode/skills/my-skill/SKILL.md
```

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

## 5. 📋 RULES

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

### Mode 2: Skill Creation

#### ✅ ALWAYS

1. **ALWAYS start with concrete examples** (validate understanding)
2. **ALWAYS run init_skill.py** (proper scaffolding)
3. **ALWAYS identify bundled resources** (scripts/references/assets)
4. **ALWAYS use third-person** ("Use when..." not "You should use...")
5. **ALWAYS keep SKILL.md <5k words** (move details to references/)
6. **ALWAYS delete unused examples** (keep lean)
7. **ALWAYS validate before packaging**
8. **ALWAYS recommend final review** (run `extract_structure.py`)

#### ❌ NEVER

1. **NEVER use second-person** (imperative/infinitive only)
2. **NEVER duplicate SKILL.md/references/** (progressive disclosure)
3. **NEVER create without examples**
4. **NEVER skip validation**
5. **NEVER include excessive detail** (SKILL.md is orchestrator)
6. **NEVER use vague descriptions**

#### ⚠️ ESCALATE IF

1. Skill purpose unclear
2. No concrete examples
3. Validation fails repeatedly
4. Unsupported features
5. User input required (brand assets, API docs)

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

---

## 6. 🏆 SUCCESS CRITERIA

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

## 7. 🔌 INTEGRATION POINTS

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

| Skill                  | Integration                                           |
| ---------------------- | ----------------------------------------------------- |
| **system-memory**   | Context files can be optimized (flexible enforcement) |
| **system-spec-kit** | Validates spec folder documentation structure         |
| **workflows-git**      | Uses documentation quality for commit/PR descriptions |

### Workflow Integration

**Skill Creation → Document Quality**:
1. Initialize (`init_skill.py`)
2. Edit SKILL.md and resources
3. Package (`package_skill.py`)
4. Quality validation (`extract_structure.py`)
5. Iterate if needed

---

## 8. 📚 EXTERNAL RESOURCES

- **llms.txt specification**: https://llmstxt.org/
- **Context7 (external docs benchmark)**: https://context7.ai/
- **Anthropic documentation**: https://docs.anthropic.com/
- **CommonMark specification**: https://spec.commonmark.org/

---

## 9. 🚀 QUICK START

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