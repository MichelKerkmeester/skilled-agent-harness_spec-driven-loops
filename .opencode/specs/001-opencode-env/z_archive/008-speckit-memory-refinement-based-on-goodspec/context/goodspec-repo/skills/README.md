# GoopSpec Skills

Skills are reusable knowledge modules that can be loaded by agents to provide specialized expertise. This directory contains bundled skills that ship with GoopSpec.

## Skill Resolution

GoopSpec resolves skills using a priority-based system:

### Resolution Order (Highest Priority First)

1. **Project Overrides**: `.goopspec/skills/` in your project
2. **Bundled Skills**: `skills/` in the GoopSpec package

This allows you to:
- Override bundled skills with project-specific versions
- Create custom skills for your project
- Share skills across projects by placing them in the bundled directory

### File Formats

Skills can be defined in two formats:

#### 1. Flat File Format

A single markdown file with frontmatter:

```
skills/
  my-skill.md
```

**Example: `my-skill.md`**
```markdown
---
name: my-skill
description: A custom skill for my project
tags: [custom, example]
---

# My Skill

This is the skill content that will be loaded into the agent's context.

## Usage

Instructions for using this skill...
```

#### 2. Directory-Based Format

A directory containing a `skill.md` file:

```
skills/
  my-skill/
    skill.md
    additional-file.txt
```

**Example: `my-skill/skill.md`**
```markdown
---
name: my-skill
description: A custom skill with additional resources
tags: [custom, example]
---

# My Skill

This skill can reference additional files in the same directory.

## Usage

Instructions for using this skill...
```

**Why use directory format?**
- Include additional resources (examples, templates, data files)
- Better organization for complex skills
- Easier to version control as a unit

### Resolution Examples

Given these files:
```
.goopspec/skills/
  testing.md                    # Project override
  custom-skill.md               # Project-specific skill

skills/                         # Bundled (GoopSpec package)
  testing.md                    # Bundled version
  goop-core/
    skill.md                    # Directory-based skill
```

Resolution results:
- `testing` → `.goopspec/skills/testing.md` (project override wins)
- `custom-skill` → `.goopspec/skills/custom-skill.md` (project-only)
- `goop-core` → `skills/goop-core/skill.md` (bundled directory-based)

## Creating Custom Skills

### 1. Create a Project Skill

Create `.goopspec/skills/` in your project:

```bash
mkdir -p .goopspec/skills
```

Create your skill file:

```bash
cat > .goopspec/skills/my-custom-skill.md << 'EOF'
---
name: my-custom-skill
description: Custom skill for my project
tags: [custom]
---

# My Custom Skill

Skill content here...
EOF
```

### 2. Reference in Agent

In your agent definition (`.goopspec/agents/my-agent.md`):

```yaml
---
name: my-agent
skills:
  - my-custom-skill
  - goop-core
---

Agent instructions...
```

### 3. Load Dynamically

Skills can also be loaded dynamically using the `goop-skill` tool:

```
Use the goop-skill tool to load the "my-custom-skill" skill.
```

## Skill Frontmatter Format

All skills should include frontmatter with these fields:

```yaml
---
name: skill-name              # Required: Unique identifier
description: Brief description # Required: What this skill provides
tags: [tag1, tag2]            # Optional: Categorization tags
version: 1.0.0                # Optional: Semantic version
author: Your Name             # Optional: Skill author
requires: [other-skill]       # Optional: Skill dependencies
---
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier for the skill (kebab-case recommended) |
| `description` | Yes | Brief description of what the skill provides |
| `tags` | No | Array of tags for categorization and search |
| `version` | No | Semantic version (e.g., "1.0.0") |
| `author` | No | Skill author name or organization |
| `requires` | No | Array of skill names this skill depends on |

## Skill Content Guidelines

### Structure

A well-structured skill should include:

1. **Title**: Clear, descriptive heading
2. **Purpose**: What problem does this skill solve?
3. **Principles**: Core concepts and best practices
4. **Examples**: Concrete examples of usage
5. **Anti-patterns**: What to avoid

### Example Structure

```markdown
---
name: example-skill
description: Example skill structure
---

# Example Skill

## Purpose
Explain what this skill helps with...

## Principles

1. **Principle 1** - Explanation
2. **Principle 2** - Explanation

## Usage

### Basic Usage
Example of basic usage...

### Advanced Usage
Example of advanced usage...

## Examples

### Example 1: Common Case
Code or instructions...

### Example 2: Edge Case
Code or instructions...

## Anti-Patterns

### Don't Do This
Explanation of what to avoid...

### Do This Instead
Better approach...

## References

- [External Resource](https://example.com)
- Related skills: `other-skill`, `another-skill`
```

## Best Practices

### Naming Conventions

- Use kebab-case: `my-skill-name`
- Be descriptive: `api-testing` not `test`
- Avoid generic names: `react-hooks` not `hooks`

### Content Guidelines

- **Be concise**: Skills should be focused and scannable
- **Use examples**: Show, don't just tell
- **Include context**: Explain when to use the skill
- **Link related skills**: Help agents discover related knowledge
- **Version carefully**: Breaking changes should increment major version

### Organization

- **One skill, one purpose**: Don't create mega-skills
- **Compose skills**: Use `requires` to build on other skills
- **Group related skills**: Use tags for discoverability

## Bundled Skills

GoopSpec ships with these bundled skills:

| Skill | Description |
|-------|-------------|
| `goop-core` | Core GoopSpec workflow and principles |
| `atomic-commits` | Git commit best practices |
| `code-review` | Code review guidelines |
| `testing` | Testing strategies and patterns |
| `debugging` | Systematic debugging approach |
| `documentation` | Documentation writing guidelines |
| `research` | Research and exploration techniques |
| `task-decomposition` | Breaking down complex tasks |
| `memory-usage` | Using the memory system effectively |

See individual skill files for detailed documentation.

## Troubleshooting

### Skill Not Found

If a skill isn't loading:

1. Check the skill name matches the filename (without `.md`)
2. Verify frontmatter includes `name` field
3. Check file is in correct directory (`.goopspec/skills/` or `skills/`)
4. For directory-based skills, ensure file is named `skill.md`

### Skill Not Loading

If a skill loads but doesn't work:

1. Verify frontmatter is valid YAML
2. Check for syntax errors in markdown
3. Ensure required dependencies are available
4. Check agent configuration includes the skill

### Override Not Working

If project override isn't taking effect:

1. Ensure file is in `.goopspec/skills/` (not `skills/`)
2. Check filename matches exactly (case-sensitive)
3. Verify frontmatter `name` field matches
4. Clear any caches (restart agent)

## Advanced Topics

### Skill Dependencies

Skills can depend on other skills using the `requires` field:

```yaml
---
name: advanced-testing
requires:
  - testing
  - debugging
---
```

When loaded, GoopSpec will automatically load required skills first.

### Skill Versioning

Use semantic versioning to manage skill evolution:

- **Major** (1.0.0 → 2.0.0): Breaking changes
- **Minor** (1.0.0 → 1.1.0): New features, backward compatible
- **Patch** (1.0.0 → 1.0.1): Bug fixes, clarifications

### Skill Templates

Create skill templates for common patterns:

```bash
# Create from template
cp skills/_template.md .goopspec/skills/my-new-skill.md
```

### Skill Testing

Test skills by:

1. Creating a test agent that loads the skill
2. Running the agent on sample tasks
3. Verifying the agent follows skill guidelines
4. Checking for conflicts with other skills

## Contributing Skills

To contribute a skill to GoopSpec:

1. Create the skill in `skills/` directory
2. Follow the structure and guidelines above
3. Add tests if applicable
4. Update this README with the new skill
5. Submit a pull request

## Resources

- [GoopSpec Documentation](../README.md)
- [Agent Configuration](../agents/README.md)
- [Resource Resolution](../src/core/resolver.ts)
