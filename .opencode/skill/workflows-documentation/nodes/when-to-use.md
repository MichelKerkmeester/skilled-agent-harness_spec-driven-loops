---
description: "Triggers for document validation, README creation, component scaffolding, and flowchart generation."
---
# When To Use Workflows Documentation

## 1. WHEN TO USE

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
- Auto-correct filename violations (ALL CAPS to lowercase, hyphens to underscores)
- Fix safe violations (separators, H2 case)
- Check critical violations (missing frontmatter, wrong section order)

**Manual Optimization** - Run when:
- README needs optimization for AI assistants
- Creating critical documentation (specs, knowledge, skills)
- Pre-release quality checks
- Generating llms.txt for LLM navigation

### Use Case: OpenCode Component Creation

Create and manage OpenCode components (skills, agents, commands). Each component type has templates and validation with quality standards.

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

Create ASCII flowcharts for visualizing workflows, user journeys and decision trees.

**Use when**:
- Documenting multi-step processes with branching
- Creating decision trees with multiple outcomes
- Showing parallel execution with sync points
- Visualizing approval gates and revision cycles

**See**: [assets/flowcharts/](./assets/flowcharts/)

### Use Case: Install Guide Creation

Create and validate installation documentation for MCP servers, plugins and tools using phase-based templates.

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
- Short 2-3 step processes (use bullet points)

---

