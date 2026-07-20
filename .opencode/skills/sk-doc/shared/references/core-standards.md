---
title: Core Standards - Structure and Validation Rules
description: Filename conventions, document type detection, and structural validation rules for markdown documentation.
trigger_phrases:
  - "core documentation standards"
  - "filename conventions markdown"
  - "document type detection"
  - "structural validation rules"
importance_tier: important
contextType: general
version: 1.8.0.22
---

# Core Standards - Structure and Validation Rules

Filename conventions, document type detection, and structural validation rules for markdown documentation.

---

## 1. OVERVIEW

### What Are Core Standards?

Core standards define the structural foundation for all OpenCode skill documentation. These standards ensure consistency, machine-readability, and quality across all documentation types through enforced conventions.

**Core Purpose**:
- **Structural validity** - Consistent markdown structure across all document types
- **Type-specific rules** - Tailored requirements for SKILL, Knowledge, Command, Spec, README files
- **Quality gates** - Filename, frontmatter, and heading standards

> **📍 Context**: This is a Level 3 reference file (loaded on-demand). For the complete progressive disclosure architecture, see [skill_creation/overview.md § Skill Structure System](../../create-skill/references/shared/overview.md#3-skill-structure-system).

This reference provides deep-dive technical guidance on structure validation, document type detection, and quality enforcement.

---

## 2. FILENAME CONVENTIONS

> **📍 Canonical rule**: Kebab-case (hyphens) is the sole canonical form for in-scope filesystem names. The single source of truth, including the complete exemption boundary, is [filesystem-naming-convention.md](filesystem-naming-convention.md).

**Rule**: Use lowercase kebab-case for in-scope filesystem names, including `.md` files.

**Transformations**:
1. ALL CAPS → lowercase: `MY-DOCUMENT.MD` → `my-document.md`
2. Underscores → hyphens: `my_document.md` → `my-document.md`
3. Spaces → hyphens: `my document.md` → `my-document.md`
4. Multiple hyphens → single: `my--document.md` → `my-document.md`

**Exceptions** (never rename):
- Python source files such as `validate_document.py`
- Python import-package directories such as `my_package/`
- Vendored or third-party trees such as `node_modules/`
- Generated and lockfile output such as `dist/` and `package-lock.json`
- Tool-mandated names such as `SKILL.md`, `README.md`, `.utcp_config.json`, `action.yml`, and `conftest.py`
- Test-runner magic such as `__snapshots__/`, `__mocks__/`, and `test_*.py`
- Frozen surfaces: `z_archive/`, changelogs, and completed spec-folder history

Numbered documents such as `NNN-name.md` use hyphens by default and conform to the canonical rule.

---

## 3. DOCUMENT TYPE DETECTION

**Priority order** (highest to lowest):

| Priority | Pattern | Type | Example |
|----------|---------|------|---------|
| 1 | Exact filename | README → readme | `/any/path/README.md` |
| 1 | Exact filename | SKILL → skill | `.opencode/skills/*/SKILL.md` |
| 1 | Exact filename | llms.txt → llmstxt | `/any/path/llms.txt` |
| 2 | Directory path | `.opencode/commands/**/*.md` → command | `.opencode/commands/deploy.md` |
| 2 | Directory path | `knowledge/*.md` → knowledge | `knowledge/api.md` |
| 2 | Directory path | `specs/**/*.md` → spec | `specs/042/spec.md` |
| 3 | Parent directory | `*/specs/*` → spec | `project/specs/plan.md` |
| 4 | Default | `*.md` → generic | Any other `.md` file |

**Enforcement Levels:**
- **Strict**: No violations allowed, blocks processing
- **Moderate**: Critical violations block, minor issues auto-fixed
- **Loose**: Best-effort validation, non-blocking
- **Flexible**: Minimal validation, user preference respected

**Enforcement levels by type**:

| Type | Enforcement | Frontmatter | H1 Subtitle | TOC Policy | Blocks |
|------|-------------|-------------|-------------|------------|--------|
| README | Flexible | None | Optional | ❌ Never | No |
| SKILL | Strict | Required | Required | ❌ Never | Yes |
| llms.txt | Strict | Forbidden | N/A | ❌ Never | Yes |
| Knowledge | Moderate | Forbidden | Required | ❌ Never | Yes |
| Command | Strict | Required | Forbidden | ❌ Never | Yes |
| Spec | Loose | Optional | Optional | ❌ Never | No |
| Generic | Flexible | Optional | Optional | ❌ Never | No |

**TOC Policy Summary**:
- ❌ **NEVER** add a Table of Contents to any document type. Tables of Contents and `<!-- ANCHOR -->` navigation comments are not used in skill documentation.

**Manual override**: Use `--type=` flag with validation scripts (e.g., `scripts/quick_validate.py --type=skill document.md`)

---

## 4. STRUCTURAL VIOLATIONS

### Safe Auto-Fixes (Non-Blocking)

**Applied automatically, logged, execution continues**:

1. **H2 case** - Convert to ALL CAPS: `## when to use` → `## WHEN TO USE`
2. **Missing separators** - Add `---` between major H2 sections (not between H3 subsections)

### Critical Violations (Blocking)

**Execution stops, manual fix required**:

**SKILL type**:
- Missing YAML frontmatter
- Missing required fields: `name`, `description`
- H1 missing subtitle
- Missing required sections: WHEN TO USE, HOW IT WORKS, RULES
- Wrong section order

**Knowledge type**:
- Has YAML frontmatter (should not have)
- H1 missing subtitle
- H2 sections not numbered
- Multiple H1 headers

**Command type**:
- Missing YAML frontmatter
- Missing required fields: `description`
- H1 has subtitle (should not have)
- Missing required sections: purpose, instructions
- (Recommended sections: contract, examples, notes)

**Fix template** (frontmatter):
```yaml
---
name: skill-name
description: Brief description
allowed-tools: Read, Write, Edit
---
```

**Fix template** (section order for SKILL):
```markdown
## 1. CAPABILITIES OVERVIEW
## 2. SMART ROUTING
## 3. REFERENCES
## 4. WHEN TO USE
## 5. HOW TO USE
## 6. RULES
## 7. SUCCESS CRITERIA
## 8. INTEGRATION POINTS
## 9. ADDITIONAL RESOURCES
## 10. QUICK START
```

**Note**: Not all sections are required. Minimum required sections: WHEN TO USE, HOW TO USE, RULES.

---

## 5. COMMON VIOLATIONS QUICK REFERENCE

| Violation | Detection | Fix | Auto |
|-----------|-----------|-----|------|
| ALL CAPS filename | `[A-Z]+\.md` | Lowercase | ❌ Manual |
| Underscored filename | `_` in non-exempt filename | Replace word-separating `_` with `-` | ❌ Manual |
| Missing frontmatter (SKILL) | No `---` at line 1 | Add YAML block | ❌ Manual |
| H1 no subtitle (SKILL/Knowledge) | Single `#` line | Add ` - Subtitle` (Format: `# Name - Brief Description`) | ❌ Manual |
| Multiple H1 | Count `^#\s` > 1 | Remove extras | ❌ Manual |
| H2 lowercase | `## [a-z]` | ALL CAPS | ✅ |
| Missing separator | No `---` between sections | Insert `---` | ✅ |
| Wrong section order | Sections out of sequence | Reorder | ❌ Manual |
| Skipped heading level | H2 → H4 | Add H3 | ❌ Manual |
| Frontmatter in Knowledge | Knowledge file has `---` | Remove YAML | ❌ Manual |
| No subtitle in Command | Command H1 has ` -` | Remove subtitle | ❌ Manual |
| Missing RULES section | SKILL without `## RULES` | Add section | ❌ Manual |
| Unclosed code fence | ` ``` ` count odd | Close fence | ✅ |
| Invalid frontmatter YAML | Parse error | Fix syntax | ❌ Manual |

**Validation**: Use `scripts/quick_validate.py --validate-only file.md` or `scripts/extract_structure.py file.md` for structure analysis.

---

## 6. DIVIDER USAGE RULES

### Horizontal Rule Placement

**CORRECT: Use `---` between major H2 sections**:
```markdown
## 1. SECTION ONE
Content...

---

## 2. SECTION TWO
Content...
```

**INCORRECT: Never use `---` between H3 subsections**:
```markdown
## 3. RULES

### ✅ ALWAYS
Content...

---  ❌ WRONG - No divider here

### ❌ NEVER
Content...
```

**Correct approach for H3 subsections**:
```markdown
## 3. RULES

### ✅ ALWAYS
Content...

### ❌ NEVER
Content...

### ⚠️ ESCALATE IF
Content...
```

**Key principle**: Horizontal rules create visual hierarchy between MAJOR sections (H2), not subsections (H3). Use blank lines to separate H3 subsections within the same H2 parent.

---

## 7. DOCUMENT TYPE REQUIREMENTS

### Document Type Standards

**SKILL.md**:
```yaml
Required frontmatter: name, description, allowed-tools
Required sections: WHEN TO USE, HOW TO USE, RULES
H1 format: "# Name - Subtitle"
Quality target: Production-ready (no critical gaps)
```

**Knowledge**:
```yaml
Frontmatter: None (forbidden)
H1 format: "# Topic - Subtitle"
H2 format: "## 1. SECTION"
Quality target: Good (minor gaps only)
```

**Command**:
```yaml
Required frontmatter: description, argument-hint, allowed-tools
Optional frontmatter: name, model, version, disable-model-invocation
Required sections: Purpose, Contract, Instructions, Example Usage
Optional sections: Example Output, Notes, Troubleshooting
H1 format: "# Command Title" (no subtitle)
H2 format: "## N. SECTION-NAME" (numbered, ALL CAPS, NO decorative emoji)
Quality target: Functional (clear and unambiguous)
Template: assets/command/command-template.md

# EMOJI POLICY: Commands use SEMANTIC emojis only
# - H1: No decorative emoji, semantic allowed (🚨 for mandatory/blocking)
# - H2: No decorative emoji, semantic allowed (🔒 for phases, ✅ ❌ ⚠️ for validation)
# - H3/H4: No emoji EXCEPT RULES headings
#   - `### ✅ ALWAYS`, `### ❌ NEVER`, `### ⚠️ ESCALATE IF`
#   - `#### ✅ ALWAYS`, `#### ❌ NEVER`, `#### ⚠️ ESCALATE IF`
# - Body text: No emoji (unless user data)
# 
# SEMANTIC emojis allowed:
#   🚨 = Critical/Blocking (mandatory gates)
#   🔒 = Locked/Required (required phases)
#   ✅ = Pass/Success
#   ❌ = Fail/Error
#   ⚠️ = Warning/Caution
#
# Rationale: Commands prioritize clarity. Semantic emojis provide
# instant visual recognition for blocking/validation states.
# Decorative emojis (📋 🎯 ⚡ etc.) add noise without meaning.

# Command Types:
Simple:      Single action, few args
Workflow:    Multi-step process with phases
Mode-Based:  Supports :auto/:confirm suffixes
Destructive: Requires --confirm flag
Namespace:   Grouped under directory (e.g., /index:search)

# Namespace Pattern:
Directory:   .opencode/commands/[namespace]/
File:        .opencode/commands/[namespace]/[action].md
Command:     /namespace:action
```

**README**:
```yaml
Frontmatter: None
H1 format: Flexible
Sections: Flexible
Quality target: High clarity (AI-friendly)
TOC: Never
Emojis: Allowed
```

**llms.txt**:
```yaml
Frontmatter: None (forbidden)
H1 format: Plain text only (no markdown headers)
Sections: Free-form plain text
Quality target: High clarity, no formatting
Emojis: Not allowed (plain text only)
Format: Plain text navigation file for LLMs
```

---

## 8. RELATED RESOURCES

### Reference Files
- [workflows.md](./workflows.md) - Execution modes and workflow details
- [optimization.md](./optimization.md) - Content transformation patterns
- [validation.md](./validation.md) - Quality scoring and validation workflows
- [quick-reference.md](./quick-reference.md) - Quick command reference
- [skill-creation.md](skill-creation.md) - Skill creation workflow
- [install-guide standards](../../create-readme/references/README.md) - Install guide standards and workflow

### Templates
- [skill-md-template.md](../assets/skill/skill-md-template.md) - SKILL.md file templates
- [skill-asset-template.md](../assets/skill/skill-asset-template.md) - Bundled asset structure
- [skill-reference-template.md](../assets/skill/skill-reference-template.md) - Reference doc structure
- [readme-template.md](../assets/readme/readme-template.md) - Comprehensive README guide (13 sections)
- [command-template.md](../assets/command/command-template.md) - Command creation guide (19 sections)
- [install-guide-template.md](../assets/readme/install-guide-template.md) - Install guide template (14 sections)
- [llmstxt-templates.md](../assets/llmstxt-templates.md) - llms.txt with decision framework
- [frontmatter-templates.md](../assets/frontmatter-templates.md) - Frontmatter by document type

### Additional Resources
- `document_style_guide.md` - Project-specific style guide (create if needed)
