---
title: "Skills Library"
description: "Domain-specific, on-demand capabilities providing specialized workflows for code, documentation, git, browser debugging and external tool integration"
trigger_phrases:
  - "skills library"
  - "available skills"
  - "skill overview"
  - "what skills exist"
  - "skill routing"
  - "skill advisor"
importance_tier: "normal"
---

# Skills Library

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. SKILLS CATALOG](#4--skills-catalog)
- [5. SKILL ROUTING](#5--skill-routing)
- [6. CREATING SKILLS](#6--creating-skills)
- [7. RELATED](#7--related)

<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The Skills Library contains 9 domain-specific skills across 5 categories. Each skill provides specialized workflows for complex, multi-step tasks.

Skills differ from passive knowledge files in two ways. They are explicitly invoked (on-demand, not always-on). They provide step-by-step workflow instructions with bundled resources, scripts and templates.

Skills load on-demand through Gate 2 routing via `skill_advisor.py` or through explicit invocation. Once loaded, a skill injects its instructions and resource paths into the conversation context.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:quick-start -->
## 2. QUICK START

Three ways to use a skill:

**1. Automatic routing (Gate 2)**

```bash
python3 .opencode/skill/scripts/skill_advisor.py "[your request]" --threshold 0.8
```

If confidence is 0.8 or higher, the recommended skill is invoked automatically.

**2. Explicit invocation**

```
Read(".opencode/skill/<skill-name>/SKILL.md")
```

**3. Skill tool**

```
skill(name: "<skill-name>")
```

**Loading protocol:**

```
Invoke skill → SKILL.md loads → instructions + resource paths injected → follow to completion
```

Do not re-invoke a skill already in context.

<!-- /ANCHOR:quick-start -->

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```
.opencode/skill/
├── mcp-code-mode/
├── mcp-figma/
├── system-spec-kit/
├── workflows-chrome-devtools/
├── workflows-code--full-stack/
├── workflows-code--opencode/
├── workflows-code--web-dev/
├── workflows-documentation/
├── workflows-git/
└── README.md              ← this file
```

Each skill folder contains:

| Directory          | Purpose                                                    |
| ------------------ | ---------------------------------------------------------- |
| `SKILL.md`         | Entry point. Loaded when the skill is invoked.             |
| `references/`      | Domain knowledge, coding standards and pattern libraries   |
| `scripts/`         | Automation scripts (validation, generation, indexing)       |
| `assets/`          | Templates, configs and static resources                    |
| `constitutional/`  | Core memory files that always surface in memory searches    |

Not every skill uses all directories. `SKILL.md` is the only required file.

<!-- /ANCHOR:structure -->

<!-- ANCHOR:skills-catalog -->
## 4. SKILLS CATALOG

### Core System

#### `system-spec-kit` (v2.2.9.0)

Unified documentation and context preservation. Spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation and Spec Kit Memory for cognitive context preservation. The foundational skill that all others depend on.

- Spec folder creation with tiered documentation levels (1 through 3+)
- Template-driven document generation with CORE + ADDENDUM architecture
- Validation scripts for structure, content quality and completeness
- Cognitive memory system for cross-session context preservation

---

### Code Workflows

#### `workflows-code--full-stack` (v1.0.0.0)

Stack-agnostic development orchestrator. Auto-detects Go, Node.js, React, React Native and Swift via marker files. Implementation, Debugging and Verification lifecycle.

- Automatic stack detection through marker files (`package.json`, `go.mod`, `Podfile`, `Package.swift`)
- Three-phase lifecycle: Implementation, Debugging, Verification
- Stack-specific coding standards and testing patterns
- Language-aware linting and build verification

#### `workflows-code--web-dev` (v1.0.5.0)

Frontend development orchestrator with Webflow integration. Implementation, Debugging and Verification across 6 specialized code quality sub-skills.

- Webflow-specific patterns for custom code, attributes and embeds
- 6 code quality sub-skills for style enforcement
- Async handling, validation and error boundary patterns
- Browser verification at multiple viewports (mandatory before completion)

#### `workflows-code--opencode` (v1.0.5.0)

Multi-language code standards for OpenCode system code (JavaScript, TypeScript, Python, Shell and JSON/JSONC) with language detection routing and universal patterns.

- Language detection routing across 5 language targets
- Universal patterns applied regardless of language
- Quality checklists per language
- OpenCode-specific conventions and file organization

---

### Development Ops

#### `workflows-git` (v1.0.2.0)

Git development orchestrator guiding workspace setup (worktrees), clean commits (Conventional Commits) and work completion (merge, PR and cleanup).

- Git worktree management for parallel development
- Conventional Commits enforcement with scope validation
- PR creation and merge workflows
- Branch cleanup and workspace teardown

#### `workflows-chrome-devtools` (v1.0.1.0)

Chrome DevTools orchestrator with CLI (bdg) and MCP approaches. Browser debugging, screenshots, HAR files, console logs and network inspection.

- CLI-first approach via `bdg` for speed and token efficiency
- MCP fallback for multi-tool integration scenarios
- Screenshot capture, HAR recording and console log extraction
- Network inspection and performance analysis

---

### Documentation

#### `workflows-documentation` (v1.0.6.0)

Document quality enforcement and content optimization. Component creation workflows for skills, agents and commands. ASCII flowcharts and install guides.

- DQI (Document Quality Index) scoring and validation
- Template-aligned output for all document types
- Component creation workflows (skills, agents, commands)
- ASCII flowchart generation and install guide formatting

---

### MCP Integrations

#### `mcp-code-mode` (v1.0.4.0)

TypeScript execution with 200+ MCP tools via progressive disclosure. 98.7% context reduction, 60% faster execution and type-safe invocation for all external tool integration.

- Progressive tool discovery with `search_tools()` and `tool_info()`
- Type-safe TypeScript execution via `call_tool_chain()`
- Supports Webflow, ClickUp, Notion, GitHub and Chrome DevTools
- Manual registration for custom tool providers

#### `mcp-figma` (v1.0.2.0)

Figma design file access via MCP providing 18 tools for file retrieval, image export, component and style extraction, team management and collaborative commenting.

- File and node retrieval with selective depth control
- Image export in multiple formats and scales
- Component and style library extraction
- Team project management and comment threading

<!-- /ANCHOR:skills-catalog -->

<!-- ANCHOR:skill-routing -->
## 5. SKILL ROUTING

Gate 2 in the mandatory pre-execution gates handles skill routing. The `skill_advisor.py` script analyzes each request and returns a confidence score with a recommended skill.

**Routing flow:**

```
Request → skill_advisor.py → confidence >= 0.8? → MUST invoke skill
                           → confidence <  0.8? → General approach OK
```

**How it works:**

1. The script receives the user request as a quoted string
2. It matches against trigger phrases, skill descriptions and task patterns
3. It returns a confidence score (0.0 to 1.0) and the best-matching skill
4. At 0.8 or above, invocation is mandatory (not optional)

**Multi-stack detection:**

For code workflow skills, the advisor also checks marker files in the project root:

| Marker File      | Detected Stack  | Routed Skill                  |
| ---------------- | --------------- | ----------------------------- |
| `package.json`   | Node.js / React | `workflows-code--web-dev`     |
| `go.mod`         | Go              | `workflows-code--full-stack`  |
| `Podfile`        | iOS / Swift     | `workflows-code--full-stack`  |
| `Package.swift`  | Swift           | `workflows-code--full-stack`  |

**Running the advisor manually:**

```bash
python3 .opencode/skill/scripts/skill_advisor.py "build a new React component" --threshold 0.8
```

<!-- /ANCHOR:skill-routing -->

<!-- ANCHOR:creating-skills -->
## 6. CREATING SKILLS

To create a new skill, use the `workflows-documentation` skill with the skill creation template.

**Template location:**

```
.opencode/skill/workflows-documentation/references/skill_creation.md
```

**Asset templates:**

```
.opencode/skill/workflows-documentation/assets/opencode/skill_md_template.md
.opencode/skill/workflows-documentation/assets/opencode/skill_reference_template.md
.opencode/skill/workflows-documentation/assets/opencode/skill_asset_template.md
```

**Key files in every skill:**

| File / Directory   | Role                                              |
| ------------------ | ------------------------------------------------- |
| `SKILL.md`         | Entry point, loaded on invocation (required)       |
| `references/`      | Domain knowledge and pattern libraries             |
| `scripts/`         | Automation (validation, generation, indexing)       |
| `assets/`          | Templates, configs and static files                |

After creating a skill, validate its structure against the template and test invocation before committing.

<!-- /ANCHOR:creating-skills -->

<!-- ANCHOR:related -->
## 7. RELATED

**Framework:**

- [Main Framework README](../README.md)
- [AGENTS.md](../../AGENTS.md) (agent routing and behavioral framework)
- [skill_advisor.py](scripts/skill_advisor.py)

**Individual skill READMEs:**

- [system-spec-kit](system-spec-kit/)
- [workflows-code--full-stack](workflows-code--full-stack/)
- [workflows-code--web-dev](workflows-code--web-dev/)
- [workflows-code--opencode](workflows-code--opencode/)
- [workflows-git](workflows-git/)
- [workflows-chrome-devtools](workflows-chrome-devtools/)
- [workflows-documentation](workflows-documentation/)
- [mcp-code-mode](mcp-code-mode/)
- [mcp-figma](mcp-figma/)

<!-- /ANCHOR:related -->
