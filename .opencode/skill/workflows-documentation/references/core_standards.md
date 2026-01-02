---
title: Core Standards - Structure and Validation Rules
description: Filename conventions, document type detection, and structural validation rules for markdown documentation.
---

# Core Standards - Structure and Validation Rules

Filename conventions, document type detection, and structural validation rules for markdown documentation.

---

## 1. 📖 OVERVIEW

### What Are Core Standards?

Core standards define the structural foundation for all OpenCode skill documentation. These standards ensure consistency, machine-readability, and quality across all documentation types through enforced conventions.

**Core Purpose**:
- **Structural validity** - Consistent markdown structure across all document types
- **Type-specific rules** - Tailored requirements for SKILL, Knowledge, Command, Spec, README files
- **Quality gates** - Filename, frontmatter, heading, and emoji standards

> **📍 Context**: This is a Level 3 reference file (loaded on-demand). For the complete progressive disclosure architecture, see [skill_creation.md § Progressive Disclosure](./skill_creation.md#progressive-disclosure).

This reference provides deep-dive technical guidance on structure validation, document type detection, and quality enforcement.

---

## 2. 📄 FILENAME CONVENTIONS

**Rule**: lowercase snake_case for all `.md` files

**Transformations**:
1. ALL CAPS → lowercase: `README.MD` → `readme.md`
2. Hyphens → underscores: `my-document.md` → `my_document.md`
3. Mixed case → snake_case: `MyDocument.md` → `my_document.md`
4. Spaces → underscores: `my document.md` → `my_document.md`
5. Multiple underscores → single: `my__doc.md` → `my_doc.md`

**Exceptions** (never modify):
- `README.md` (standard convention)
- `SKILL.md` (in `.opencode/skill/` only)

---

## 3. 🔍 DOCUMENT TYPE DETECTION

**Priority order** (highest to lowest):

| Priority | Pattern | Type | Example |
|----------|---------|------|---------|
| 1 | Exact filename | README → readme | `/any/path/README.md` |
| 1 | Exact filename | SKILL → skill | `.opencode/skill/*/SKILL.md` |
| 1 | Exact filename | llms.txt → llmstxt | `/any/path/llms.txt` |
| 2 | Directory path | `.opencode/command/**/*.md` → command | `.opencode/command/deploy.md` |
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

| Type | Enforcement | Frontmatter | H1 Subtitle | TOC Policy | Emojis Allowed | Blocks |
|------|-------------|-------------|-------------|------------|----------------|--------|
| README | Flexible | None | Optional | ✅ Allowed | ✅ Yes | No |
| SKILL | Strict | Required | Required | ❌ Never | ✅ Required (H2) | Yes |
| llms.txt | Strict | Forbidden | N/A | ❌ Never | ❌ No | Yes |
| Knowledge | Moderate | Forbidden | Required | ❌ Never | ✅ Yes | Yes |
| Command | Strict | Required | Forbidden | ❌ Never | ⚠️ Semantic¹ | Yes |
| Spec | Loose | Optional | Optional | ❌ Never | ✅ Yes | No |
| Generic | Flexible | Optional | Optional | ❌ Never | ✅ Yes | No |

¹ **Semantic emojis for Commands**: Only 🚨 🔒 ✅ ❌ ⚠️ allowed (blocking/validation states). No decorative emojis.

**TOC Policy Summary**:
- ❌ **NEVER** add TOC: SKILL, llms.txt, Knowledge, Command, Spec, Generic
- ✅ **ALLOWED** (optional): README only

**Manual override**: Use `--type=` flag with validation scripts (e.g., `scripts/quick_validate.py --type=skill document.md`)

---

## 4. ⚠️ STRUCTURAL VIOLATIONS

### Safe Auto-Fixes (Non-Blocking)

**Applied automatically, logged, execution continues**:

1. **Filename violations** - Convert to snake_case
2. **H2 case** - Convert to ALL CAPS: `## when to use` → `## WHEN TO USE`
3. **Missing separators** - Add `---` between major H2 sections (not between H3 subsections)
4. **Emoji standardization** - Normalize emoji in H2 headings

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
- Missing required sections: INPUTS, WORKFLOW, OUTPUTS

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
## 1. 🎯 CAPABILITIES OVERVIEW
## 2. 🧭 SMART ROUTING
## 3. 🗂️ REFERENCES
## 4. 🎯 WHEN TO USE
## 5. ⚙️ HOW TO USE
## 6. 📋 RULES
## 7. 🏆 SUCCESS CRITERIA
## 8. 🔌 INTEGRATION POINTS
## 9. 📚 ADDITIONAL RESOURCES
## 10. 🚀 QUICK START
```

**Note**: Not all sections are required. Minimum required sections: WHEN TO USE, HOW TO USE, RULES.

---

## 5. 📋 COMMON VIOLATIONS QUICK REFERENCE

| Violation | Detection | Fix | Auto |
|-----------|-----------|-----|------|
| ALL CAPS filename | `[A-Z]+\.md` | Lowercase | ✅ |
| Hyphenated filename | `-` in filename | Replace with `_` | ✅ |
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

### H2 Emoji Violations (BLOCKING)

For template-based document types (SKILL, README, asset, reference), missing H2 emojis are **BLOCKING errors**.

| Violation | Detection | Severity | Fix |
|-----------|-----------|----------|-----|
| H2 missing emoji (SKILL) | `## 1. SECTION` without emoji | `error` | Add emoji: `## 1. 🎯 SECTION` |
| H2 missing emoji (README) | `## 1. SECTION` without emoji | `error` | Add emoji: `## 1. 📖 SECTION` |
| H2 missing emoji (asset) | `## 1. SECTION` without emoji | `error` | Add emoji from template |
| H2 missing emoji (reference) | `## 1. SECTION` without emoji | `error` | Add emoji from template |

**Root Cause**: Headers reconstructed from memory instead of copied from template.

**Prevention**:
1. Always LOAD template before creating document
2. COPY header skeleton verbatim (including emojis)
3. Never type headers from memory
4. Validate with `extract_structure.py` before delivery

**Standard Section Emojis**:
```
📖 OVERVIEW       🚀 QUICK START    📁 STRUCTURE
⚡ FEATURES       ⚙️ CONFIGURATION   💡 USAGE EXAMPLES
🛠️ TROUBLESHOOTING  ❓ FAQ           📚 RELATED DOCUMENTS
🎯 WHEN TO USE    🧭 SMART ROUTING  📋 RULES
🔄 CORE WORKFLOW  🚫 ANTI-PATTERNS  🔗 RELATED RESOURCES
```

---

## 6. 🔀 DIVIDER USAGE RULES

### Horizontal Rule Placement

**CORRECT: Use `---` between major H2 sections**:
```markdown
## 1. 🎯 SECTION ONE
Content...

---

## 2. 🛠️ SECTION TWO
Content...
```

**INCORRECT: Never use `---` between H3 subsections**:
```markdown
## 3. 📖 RULES

### ✅ ALWAYS
Content...

---  ❌ WRONG - No divider here

### ❌ NEVER
Content...
```

**Correct approach for H3 subsections**:
```markdown
## 3. 📖 RULES

### ✅ ALWAYS
Content...

### ❌ NEVER
Content...

### ⚠️ ESCALATE IF
Content...
```

**Key principle**: Horizontal rules create visual hierarchy between MAJOR sections (H2), not subsections (H3). Use blank lines to separate H3 subsections within the same H2 parent.

---

## 7. 📚 DOCUMENT TYPE REQUIREMENTS

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
H2 format: "## 1. 🎯 SECTION"
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
Template: assets/command_template.md

# EMOJI POLICY: Commands use SEMANTIC emojis only
# - H1: No decorative emoji, semantic allowed (🚨 for mandatory/blocking)
# - H2: No decorative emoji, semantic allowed (🔒 for phases, ✅ ❌ ⚠️ for validation)
# - H3/H4: No emoji
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
Directory:   .opencode/command/[namespace]/
File:        .opencode/command/[namespace]/[action].md
Command:     /namespace:action
```

**README**:
```yaml
Frontmatter: None
H1 format: Flexible
Sections: Flexible
Quality target: High clarity (AI-friendly)
TOC: Allowed (optional)
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

## 8. 🎨 EMOJI USAGE RULES

### Primary Rule

**H2 numbered headers ALWAYS have emoji**:
```markdown
## 1. 🎯 WHEN TO USE
## 2. 🧠 SMART ROUTING
## 3. 🗂️ REFERENCES
## 4. 🛠️ HOW IT WORKS
```

**Standard H2 emoji assignments**:
- 🎯 WHEN TO USE, PURPOSE, OBJECTIVE
- 🧠 SMART ROUTING
- 🗂️ REFERENCES
- 🛠️ HOW IT WORKS, IMPLEMENTATION
- 📝 INPUTS
- 📖 RULES
- 🚀 WORKFLOW
- 🎓 SUCCESS CRITERIA
- 🔗 INTEGRATION POINTS
- 🏎️ QUICK REFERENCE

### Secondary Rule (Semantic Emojis on H3)

**H3 headers MAY have emoji if semantically meaningful (use sparingly)**:

**Allowed semantic emojis**:
- ✅ **ALWAYS Rules** - Positive requirements
- ❌ **NEVER Rules** - Forbidden actions
- ⚠️ **ESCALATE IF** - Warning/escalation conditions

**Not allowed decorative emojis**:
- 🔧 Pattern 1 (category marker)
- 💡 Examples (category marker)
- 📦 Packaging (category marker)
- 🎯 Step 1 (category marker)

**Criterion**: Does the emoji provide instant visual recognition beyond the text?
- **YES** → Semantic (allowed) - e.g., ✅ ❌ ⚠️
- **NO** → Decorative (remove) - e.g., 🔧 💡 📦

### RULES Section Exception

**Special case: RULES sections REQUIRE semantic emojis on H3 subsections**:

| H3 Subsection | Emoji | Purpose | Required |
|---------------|-------|---------|----------|
| `### ✅ ALWAYS` | ✅ | Positive requirements | ✅ Yes |
| `### ❌ NEVER` | ❌ | Forbidden actions | ✅ Yes |
| `### ⚠️ ESCALATE IF` | ⚠️ | Warning conditions | ✅ Yes |

**Correct pattern**:
```markdown
## 3. 📖 RULES

### ✅ ALWAYS

- Detect spec folder before creating memory documentation
- Use single `memory/` folder with timestamped files

### ❌ NEVER

- Fabricate decisions that weren't made
- Include sensitive data (passwords, API keys)

### ⚠️ ESCALATE IF

- Cannot create conversation summary
- Script execution fails with errors
```

**Key points**:
- Semantic emojis (✅ ❌ ⚠️) are REQUIRED on these H3 subsections
- No horizontal dividers (`---`) between H3 subsections (blank lines only)
- This exception applies ONLY to RULES sections

### Header-Level Rules

| Level | Emoji Usage | Examples |
|-------|-------------|----------|
| **H1** | ❌ Never | `# Title - Subtitle` (no emoji) |
| **H2 numbered** | ✅ Always | `## 1. 🎯 WHEN TO USE` |
| **H2 non-numbered** | ❌ Never | `## PROBLEM STATEMENT` |
| **H3** | ⚠️ Sparingly | `### ✅ ALWAYS Rules` (semantic only) |
| **H4** | ❌ Never | `#### Success Metrics` (no emoji) |
| **H5-H6** | ❌ Never | `##### Subsection` (no emoji) |

### Validation Rules

**Auto-fix (safe)**:
- Remove emojis from H1 headers
- Remove decorative emojis from H3/H4/H5/H6
- Preserve semantic emojis on H3 (✅ ❌ ⚠️)

**Manual review required**:
- H2 numbered section missing emoji
- Questionable H3 emoji (neither clearly semantic nor clearly decorative)

### Examples

**Correct usage**:
```markdown
## 1. 🎯 WHEN TO USE

### ✅ ALWAYS Rules
- Rule 1
- Rule 2

### ❌ NEVER Rules
- Anti-pattern 1

### ⚠️ ESCALATE IF
- Condition 1
```

**Incorrect usage**:
```markdown
## 1. 🎯 WHEN TO USE

### 🔧 Manual Optimization    ❌ Decorative emoji
### 💡 Examples                ❌ Decorative emoji
### 📦 Packaging Steps         ❌ Decorative emoji
```

**Edge case - Pattern sections**:
```markdown
## 2. 🔁 TRANSFORMATION PATTERNS

### Pattern 1: API Reference → Usage Example    ✅ No emoji (descriptive text)
### Pattern 2: Import-Only → Complete Setup     ✅ No emoji (descriptive text)
```

### Enforcement

**Validation tools**:
- `scripts/quick_validate.py` - Fast validation with emoji checking
- `scripts/extract_structure.py` - Structure analysis including emoji usage

**Auto-fix behavior**:
- Removes emojis from H1, H3 (decorative), H4, H5, H6
- Preserves emojis on H2 numbered
- Preserves semantic emojis on H3 (✅ ❌ ⚠️)
- Converts H2 to ALL CAPS

---

## 9. 🔗 RELATED RESOURCES

### Reference Files
- [workflows.md](./workflows.md) - Execution modes and workflow details
- [optimization.md](./optimization.md) - Content transformation patterns
- [validation.md](./validation.md) - Quality scoring and validation workflows
- [quick_reference.md](./quick_reference.md) - Quick command reference
- [skill_creation.md](./skill_creation.md) - Skill creation workflow
- [install_guide_standards.md](./install_guide_standards.md) - Install guide standards

### Templates
- [skill_md_template.md](../assets/opencode/skill_md_template.md) - SKILL.md file templates
- [skill_asset_template.md](../assets/opencode/skill_asset_template.md) - Bundled asset structure
- [skill_reference_template.md](../assets/opencode/skill_reference_template.md) - Reference doc structure
- [readme_template.md](../assets/documentation/readme_template.md) - Comprehensive README guide (13 sections)
- [command_template.md](../assets/opencode/command_template.md) - Command creation guide (19 sections)
- [install_guide_template.md](../assets/documentation/install_guide_template.md) - Install guide template (14 sections)
- [llmstxt_templates.md](../assets/documentation/llmstxt_templates.md) - llms.txt with decision framework
- [frontmatter_templates.md](../assets/documentation/frontmatter_templates.md) - Frontmatter by document type

### Additional Resources
- `document_style_guide.md` - Project-specific style guide (create if needed)
