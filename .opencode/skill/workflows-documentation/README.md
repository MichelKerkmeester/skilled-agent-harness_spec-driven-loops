---
title: "Workflows Documentation"
description: "Unified markdown and OpenCode component specialist providing document quality enforcement, content optimization, component creation workflows, ASCII flowcharts, and install guides"
trigger_phrases:
  - "documentation quality enforcement"
  - "opencode component creation workflow"
  - "markdown DQI scoring validation"
importance_tier: "normal"
---

# Workflows Documentation

> Unified markdown and OpenCode component specialist providing document quality enforcement, content optimization, component creation workflows, ASCII flowcharts, and install guides.

---

<!-- ANCHOR:table-of-contents -->

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. ⚙️ CONFIGURATION](#5--configuration)
- [6. 💡 EXAMPLES](#6--examples)
- [7. 🛠️ TROUBLESHOOTING](#7--troubleshooting)
- [8. 📚 RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

---

## 1. 📖 OVERVIEW
<!-- ANCHOR:overview -->

This skill is the central documentation engine for OpenCode projects. It operates in four modes: **Document Quality** (structure enforcement, DQI scoring, content optimization), **Component Creation** (skills, agents, commands with templates and validation), **Flowchart Creation** (ASCII diagrams for workflows and decision trees), and **Install Guide Creation** (phase-based setup documentation).

The architecture follows a script-assisted AI analysis model: Python scripts handle deterministic parsing and metrics extraction, while the AI handles quality judgment and recommendations. The core principle is **structure first, then content, then quality**.

Use this skill when creating or improving markdown documentation, scaffolding new OpenCode components (skills, agents, commands), visualizing workflows as ASCII flowcharts, or writing installation guides. Do not use it for non-markdown files, simple typo fixes, or auto-generated API docs.

<!-- /ANCHOR:overview -->

---

## 2. 🚀 QUICK START
<!-- ANCHOR:quick-start -->

The skill is invoked automatically via Gate 2 routing when documentation tasks are detected, or manually via the `skill` tool:

```
skill("workflows-documentation")
```

**Common operations:**

```bash
# Validate a document's quality (DQI score)
python3 scripts/extract_structure.py path/to/document.md

# Scaffold a new skill
python3 scripts/init_skill.py my-skill --path .opencode/skill

# Package and validate a skill
python3 scripts/package_skill.py .opencode/skill/my-skill

# Validate a README
python3 scripts/validate_document.py path/to/README.md
```

<!-- /ANCHOR:quick-start -->

---

## 3. 📁 STRUCTURE
<!-- ANCHOR:structure -->

```
workflows-documentation/
├── SKILL.md                          # Entry point with routing logic
├── README.md                         # This file
├── CHANGELOG.md                      # Version history
├── assets/
│   ├── documentation/                # Document templates
│   │   ├── frontmatter_templates.md  # Frontmatter validation (11 types)
│   │   ├── install_guide_template.md # 5-phase install guide template
│   │   ├── llmstxt_templates.md      # llms.txt generation templates
│   │   └── readme_template.md        # README structure (14 sections)
│   ├── flowcharts/                   # ASCII flowchart patterns (6 types)
│   │   ├── simple_workflow.md        # Linear sequential
│   │   ├── decision_tree_flow.md     # Branching logic
│   │   ├── parallel_execution.md     # Concurrent tasks
│   │   ├── user_onboarding.md        # Nested sub-processes
│   │   ├── approval_workflow_loops.md# Review cycles
│   │   └── system_architecture_swimlane.md # Multi-stage pipelines
│   ├── opencode/                     # Component templates
│   │   ├── skill_md_template.md      # SKILL.md template
│   │   ├── skill_reference_template.md
│   │   ├── skill_asset_template.md
│   │   ├── agent_template.md         # Agent creation template
│   │   └── command_template.md       # Command creation template
│   └── template_rules.json           # Template enforcement rules
├── references/                       # Domain knowledge
│   ├── core_standards.md             # Filename conventions, structure
│   ├── optimization.md               # AI-friendly content transforms
│   ├── validation.md                 # DQI scoring criteria
│   ├── workflows.md                  # Execution modes
│   ├── skill_creation.md             # 6-step skill creation workflow
│   ├── install_guide_standards.md    # Install guide best practices
│   └── quick_reference.md            # One-page cheat sheet
└── scripts/                          # Automation
    ├── extract_structure.py           # Parse document to JSON + DQI
    ├── validate_document.py           # README format validation
    ├── init_skill.py                  # Scaffold skill structure
    ├── package_skill.py               # Validate + package to zip
    ├── quick_validate.py              # Fast validation checks
    └── validate_flowchart.sh          # Flowchart validation
```

<!-- /ANCHOR:structure -->

---

## 4. ⚡ FEATURES
<!-- ANCHOR:features -->

**Mode 1 - Document Quality:**
- Document Quality Index (DQI) scoring on a 0-100 scale across structure, content, and style
- Auto-detection of document types (README, SKILL, Knowledge, Command, Spec, Generic)
- Safe auto-fixes for common violations (H2 case, separators, filenames)
- Frontmatter validation for 11 document types

**Mode 2 - Component Creation:**
- Skill scaffolding via `init_skill.py` with 6-step workflow
- Agent creation with tool permission management and frontmatter validation
- Command creation with trigger definition and registry integration
- Packaging and validation via `package_skill.py`

**Mode 3 - Flowchart Creation:**
- 7 core ASCII patterns: linear, decision, parallel, nested, approval, loop, pipeline
- Consistent box styles (process, decision diamond, terminal)
- Validation via `validate_flowchart.sh`

**Mode 4 - Install Guide Creation:**
- 5-phase template: Overview, Prerequisites, Installation, Configuration, Verification
- Platform-specific configurations (OpenCode, Claude Code, Claude Desktop)
- Phase validation checkpoints

<!-- /ANCHOR:features -->

---

## 5. ⚙️ CONFIGURATION
<!-- ANCHOR:configuration -->

No configuration required. The skill auto-detects document types and applies the appropriate enforcement level:

| Document Type | Enforcement | Frontmatter |
|---------------|-------------|-------------|
| SKILL.md      | Strict      | Required    |
| README.md     | Flexible    | None        |
| Knowledge     | Moderate    | Forbidden   |
| Command       | Strict      | Required    |
| Spec          | Loose       | Optional    |

Template rules are defined in `assets/template_rules.json`.

<!-- /ANCHOR:configuration -->

---

## 6. 💡 EXAMPLES
<!-- ANCHOR:examples -->

**Validate document quality:**
```bash
python3 .opencode/skill/workflows-documentation/scripts/extract_structure.py path/to/doc.md
# Returns JSON with DQI score, checklist results, and recommendations
```

**Create a new skill:**
```bash
python3 .opencode/skill/workflows-documentation/scripts/init_skill.py my-new-skill --path .opencode/skill
# Creates scaffolded directory with SKILL.md, references/, assets/, scripts/
```

**Validate a README before delivery:**
```bash
python3 .opencode/skill/workflows-documentation/scripts/validate_document.py README.md
# Exit 0 = pass, Exit 1 = warnings, Exit 2 = errors
```

<!-- /ANCHOR:examples -->

---

## 7. 🛠️ TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

| Issue | Cause | Fix |
|-------|-------|-----|
| DQI score below 60 | Missing structure or content | Run `extract_structure.py`, address flagged violations |
| `validate_document.py` exit 2 | Blocking errors (missing frontmatter, wrong section order) | Fix critical violations before re-running |
| `package_skill.py` fails | SKILL.md over 5k words or missing required sections | Move detail to `references/`, ensure all required sections present |
| Missing H2 emojis flagged as error | Template-based docs require H2 emojis | Copy headers from templates rather than writing from memory |

<!-- /ANCHOR:troubleshooting -->

---

## 8. 📚 RELATED
<!-- ANCHOR:related -->

- **system-spec-kit** - Spec folder documentation structure and validation
- **workflows-git** - Uses documentation quality for commit/PR descriptions
- **workflows-code--web-dev** - Code implementation lifecycle (pairs with documentation for verification)
- [CommonMark specification](https://spec.commonmark.org/) - Markdown rendering standard
- [llms.txt specification](https://llmstxt.org/) - LLM navigation format

<!-- /ANCHOR:related -->
