---
title: Common Skill-Creation Pitfalls
description: Eight common pitfalls when creating skills - generic or bloated descriptions, oversized SKILL.md, missing resources, unclear triggers, second-person voice, platform assumptions, multiline YAML, and misplaced references.
trigger_phrases:
  - "skill creation pitfalls"
  - "bloated skill description"
  - "skill not triggering fix"
  - "skill md too large"
  - "skill description trim rules"
importance_tier: normal
contextType: implementation
---

# Common Skill-Creation Pitfalls

The recurring mistakes that keep skills from triggering, bloat the context window, or fail packaging — each with a concrete before/after fix.

---

## 1. OVERVIEW

This reference catalogs the eight pitfalls that most often degrade a skill: from descriptions that are too vague or too bloated to trigger reliably, through second-person voice and platform-specific assumptions, to YAML and section-placement mistakes. Each pitfall pairs a wrong example with the corrected form.

**Core Principle**: Most failed skills fail at the description and the section boundaries — fix those first.

**When to Use**:
- A skill exists but does not trigger when expected
- SKILL.md is straining the context window
- Packaging or budget checks are failing
- Reviewing a freshly authored skill for common defects

> **Note on examples below**: illustrative SKILL.md headings inside the fenced examples are backslash-escaped (`\##`) so they read as content rather than as this document's own section headers.

---

## 2. COMMON PITFALLS

### Pitfall 1: Generic or Bloated Descriptions

**Problem**: Skill doesn't trigger because description is too vague — OR the project total exceeds Claude Code's 8,000-char `SLASH_COMMAND_TOOL_CHAR_BUDGET` and the harness silently drops the skill from auto-discovery.

**Example — too generic**:
```yaml
# Bad — vague, no routing keywords
description: Helps with markdown files
```

**Example — too bloated** (real trim, 545 → 125 chars):
```yaml
# Bad — enumerates stacks, lists libraries, marketing prose
description: "Multi-stack coding standards, references, and assets. Provides surface-aware code-quality patterns, checklists, and verification recipes for Webflow frontend (vanilla HTML/CSS/JS animation: Motion.dev, GSAP, Lenis, HLS, Swiper, FilePond, CDN deployment), cross-stack Motion.dev animation guidance, and OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC, MCP server code, agents, commands, skills). Smart-routing internals auto-detect the active stack and load matching standards; unsupported stacks ask for disambiguation."
```

**Example — well-balanced**:
```yaml
# Good — verb + domain noun + smart-router phrase, ≤ 130 chars
description: "Multi-stack coding standards and verification. Smart router auto-detects the active surface and loads matching code patterns."
```

**Trim rules** (see [`frontmatter_templates.md` § Description Budget & Trim Style](../../assets/frontmatter_templates.md) for the canonical reference):
- **Soft target**: ≤ 130 chars for skills, ≤ 110 for commands. Hard cap 1,536 (Claude Code). Project ceiling 5,600 (leaves headroom for built-ins under 8,000 default).
- **DROP**: product enumerations (ClickUp/Notion/Figma…), stack lists (Webflow/Motion.dev/GSAP…), marketing prose (`Mandatory for…`, `Provides…efficient…`), parenthetical jargon
- **KEEP**: skill name token, primary verb, primary domain noun, mode suffixes (`:auto`/`:confirm`), numeric specifics (`9 steps`, `5-dim scoring`)
- **Stack-agnostic rule** (memory-enforced): never enumerate Webflow/Go/Next.js etc. The smart router detects stacks at dispatch time; baked-in stack lists age poorly and dilute keyword density.

**Fix**: Apply the trim rules to your description. Run `python3 .opencode/skills/sk-doc/scripts/quick_validate.py <skill-dir>` — it warns when over soft target and hard-fails at 1,536. Periodically run `/doctor skill-budget :auto` to detect accumulated drift project-wide.

### Pitfall 2: Bloated SKILL.md

**Problem**: SKILL.md exceeds 5k words, straining context window.

**Example**:
```markdown
# Bad - Everything in SKILL.md
\## 4. HOW IT WORKS
[2000 words of detailed documentation]
[500 lines of examples]
[1000 words of API specs]

# Good - Progressive disclosure
\## 4. HOW IT WORKS
See [workflows.md](global/workflows.md) for execution modes.
See [optimization.md](global/optimization.md) for transformation patterns.
```

**Fix**: Move detailed content to references/, keep SKILL.md lean.

### Pitfall 3: Missing Bundled Resources

**Problem**: The agent recreates same code repeatedly instead of using scripts.

**Example**:
```markdown
# Bad - No script provided
\## HOW IT WORKS
Rotate PDF by writing Python code using PyPDF2...

# Good - Script provided
\## HOW IT WORKS
Use scripts/rotate_pdf.py to rotate PDF files.
```

**Fix**: Identify repeatedly needed code, create scripts.

### Pitfall 4: Unclear Triggers

**Problem**: Skill exists but never triggers because conditions are unclear.

**Example**:
```markdown
# Bad
\## 1. WHEN TO USE
Use this skill for documents.

# Good
\## 1. WHEN TO USE
Use this skill when validating markdown files after Write/Edit operations.
Manual optimization when:
- README needs major AI-friendliness improvements
- Creating critical documentation
- Quality assurance before sharing
```

**Fix**: Be specific about automatic vs manual triggers, clear use cases.

### Pitfall 5: Second-Person Language

**Problem**: Skill uses "you" instead of imperative form.

**Example**:
```markdown
# Bad
You should validate the file before processing.

# Good
Validate the file before processing.
```

**Fix**: Use imperative/infinitive form throughout.

### Pitfall 6: Platform Compatibility

**Problem**: Skill references automatic triggers or platform-specific features that don't work in OpenCode.

**Context**: Skills should be platform-agnostic. OpenCode uses AGENTS.md discipline for enforcement, not automatic triggers.

**Example**:
```markdown
# Bad - Claims automatic behavior
#### Automatic Enforcement
Enforcement runs automatically via triggers:
- After Write/Edit operations
- Before AI processes prompts

# Good - Manual workflow documentation
#### Validation Workflow
**Filename Validation** (after Write/Edit operations):
- Purpose: Filename enforcement
- Apply: After creating or editing files
- Verify: Before claiming completion
```

**Fix**: When documenting enforcement features:
1. Replace "runs automatically" with "verify manually"
2. Replace "blocks commits" with "verify before commits"
3. Replace "Automatic activation" with "Use this skill when"
4. Focus on AGENTS.md discipline, not automatic triggers

**Validation Check**: Search for outdated patterns before packaging:
```bash
grep -E "runs automatically|blocks commits|Automatic.*via|auto-enforced" SKILL.md
```

### Pitfall 7: Multiline YAML Description

**Problem**: Skill description uses YAML multiline block format which isn't parsed correctly.

**Example**:
```yaml
# Bad - Multiline block format (parser fails)
description:
  This is my skill description
  spanning multiple lines.

# Good - Single line after colon
description: This is my skill description all on one line.
```

**Cause**: Prettier and other formatters may auto-format long descriptions to multiline.

**Fix**: Keep description on a single line after the colon. If a formatter changes it, manually revert.

### Pitfall 8: File References in Wrong Section or Redundant Navigation Guide

**Problem**: File references placed in "WHEN TO USE" section, or routing logic duplicated across multiple tables/snippets.

**Example**:
```markdown
# Bad - File references in "When to Use"
\## 1. WHEN TO USE
See `references/guide.md` for details...

# Bad - Separate lookup table duplicates router logic
\## 2. SMART ROUTING

### Routing Table
| Intent     | Path                           |
| ---------- | ------------------------------ |
| Validation | `references/global/core_standards.md` |

### Smart Router Pseudocode
...

# Good - Detection + domains + one authoritative pseudocode block
\## 1. WHEN TO USE

### Activation Triggers
- User requests validation...

\## 2. SMART ROUTING

### [Primary Detection Signal]
```bash
[ -f "package.json" ] && STACK="NODEJS"
```

### Resource Domains
```text
references/[domain]/...
assets/[domain]/...
```

### Smart Router Pseudocode
```python
def route_request(context):
    if context.needs_validation:
        return load("references/global/core_standards.md")  # Validation rules
```
```

**Rule**:
```
"When to Use" = WHEN (triggers, conditions, use cases)
"Smart Routing" = HOW resources are selected and loaded

⚠️ ANTI-PATTERN: Do NOT duplicate routing logic in separate lookup tables
```

**Fix**: Keep Section 2 cohesive with detection context, merged resource domains/mapping, loading levels, and one authoritative Smart Router Pseudocode block.

---

## 3. RELATED RESOURCES

### Sibling Skill-Creation References
- [creation_workflow.md](./creation_workflow.md) - The 6-step skill creation process
- [overview.md](./overview.md) - Skill anatomy, SKILL.md required sections, and structure system
- [validation_and_packaging.md](./validation_and_packaging.md) - Validation requirements and distribution

### Templates
- [frontmatter_templates.md](../../assets/frontmatter_templates.md) - Frontmatter by document type, description budget and trim style
- [skill_md_template.md](../../assets/skill/skill_md_template.md) - SKILL.md section pattern

### Reference Files
- [core_standards.md](../global/core_standards.md) - Document type rules and structural requirements
