---
description: "Workflows for creating Skills, Agents, and Commands in OpenCode."
---
# Component Creation Mode

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

**Key Difference from Skills**: Agents have tool permissions (true/false per tool) and action permissions (allow/deny), not an allowed-tools array.

#### Command Creation

**Template-First Workflow**:
1. Load `command_template.md` for structure reference
2. Create command file in `.opencode/command/`
3. Define YAML frontmatter (name, description, triggers)
4. Create execution logic and examples
5. Add to command registry
6. Test invocation

