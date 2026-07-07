---
title: Skill Creation Process
description: The core six-step workflow for creating a skill from concept to packaged distributable, with frontmatter and SKILL.md authoring guidance.
trigger_phrases:
  - "skill creation process"
  - "create new skill steps"
  - "init skill workflow"
  - "skill md authoring"
  - "skill frontmatter completion"
importance_tier: normal
contextType: implementation
version: 1.8.0.3
---

# Skill Creation Process

The step-by-step workflow from concept to packaged skill: understanding, planning, initialization, editing, packaging, and iteration.

---

## 1. OVERVIEW

This reference is the core create workflow for a skill. It walks the six ordered steps from understanding the skill's purpose through iterating on real usage, and includes the SKILL.md authoring questions and the frontmatter completion contract.

**Core Principle**: Build the skill for another AI agent instance to use — favor information that is beneficial and non-obvious.

**When to Use**:
- Creating a brand new skill from scratch
- Re-scaffolding or substantially rebuilding an existing skill
- Authoring or correcting a skill's SKILL.md sections and frontmatter

**Key Sources**:
- `scripts/init_skill.py` - scaffolds the skill directory
- `scripts/package_skill.py` - validates and packages the skill
- [skill_md_template.md](../../assets/skill/skill_md_template.md) - SKILL.md section pattern
- [frontmatter_templates.md](../../../shared/assets/frontmatter_templates.md) - frontmatter field rules

---

## 2. SKILL CREATION PROCESS

Follow these steps in order, skipping only if there is a clear reason they are not applicable.

### Step 1: Understanding the Skill with Concrete Examples (~5 min)

**Objective**: Gain clear understanding of skill's purpose through concrete examples.

**Skip only when**: Skill's usage patterns are already clearly understood.

**Process**:
1. Understand concrete examples of how skill will be used
2. Examples can come from direct user input or generated and validated
3. Ask focused questions about functionality and use cases

**Example Questions** (for image-editor skill):
- "What functionality should the image-editor skill support?"
- "Can you give examples of how this would be used?"
- "What would a user say that should trigger this skill?"

**Best Practice**: Avoid overwhelming users—ask most important questions first, follow up as needed.

**Conclude when**: Clear sense of functionality the skill should support.

**Example Dialogue**:
```
AI: What functionality should the markdown-editor skill support?
User: I want to enforce markdown structure and optimize content for AI.

AI: Can you give specific examples of what you want enforced?
User: Filename conventions, frontmatter format, heading hierarchy.

AI: What optimization do you want for AI readability?
User: Convert documentation to question-answering format, remove metadata.
```

### Step 2: Planning Reusable Skill Contents (~5 min)

**Objective**: Identify scripts, references, and assets that will be reused across skill invocations.

**Process**:
1. Consider how to execute each example from scratch
2. Identify scripts, references, and assets helpful for repeated execution
3. Categorize resources by type (scripts/references/assets)

**Example 1: PDF Editor Skill**
- **Query**: "Help me rotate this PDF"
- **Analysis**: Rotating PDF requires re-writing same code each time
- **Solution**: Create `scripts/rotate_pdf.py`
- **Rationale**: Deterministic operation, same code repeatedly needed

**Example 2: Frontend Webapp Builder**
- **Query**: "Build me a todo app"
- **Analysis**: Requires same boilerplate HTML/React each time
- **Solution**: Create `assets/hello-world/` template
- **Rationale**: Starting point for every app, consistent structure

**Example 3: BigQuery Skill**
- **Query**: "How many users logged in today?"
- **Analysis**: Re-discovering table schemas each time
- **Solution**: Create `references/schema.md`
- **Rationale**: Schema documentation needed for query construction

**Example 4: Markdown Optimizer Skill**
- **Query**: "Optimize this documentation for AI"
- **Analysis**: Need to parse document structure consistently
- **Solution**: Create `scripts/extract_structure.py` and `references/global/optimization.md`
- **Rationale**: Document parsing better in Python, AI evaluates the output

**Output**: List of reusable resources (scripts, references, assets) with rationale.

### Step 3: Initializing the Skill (~2 min)

**Objective**: Create skill directory structure with template files.

**Skip only when**: Skill already exists and iteration is needed.

**Command**:
```bash
scripts/init_skill.py <skill-name> --path <output-directory>
```

**Default path**: If `--path` not specified, creates in current directory.

**Script Actions**:
1. Creates skill directory at specified path
2. Generates SKILL.md template with proper frontmatter and TODO placeholders
3. Creates example resource directories: `scripts/`, `references/`, `assets/`
4. Adds example files that can be customized or deleted

**Generated SKILL.md**: `init_skill.py` creates a starter SKILL.md. Normalize it to the required section order (WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES) and add recommended sections (SUCCESS CRITERIA, INTEGRATION POINTS, RELATED RESOURCES) as you complete the skill.

**After initialization**: Customize or remove generated files as needed.

**Example Usage**:
```bash
# Create skill in .opencode/skills/ directory
scripts/init_skill.py markdown-optimizer --path .opencode/skill

# Creates:
# .opencode/skills/markdown-optimizer/
# ├── SKILL.md (with TODO placeholders)
# ├── scripts/example_script.py
# ├── references/example_reference.md
# └── assets/example_asset.txt
```

### Step 4: Edit the Skill (~10-15 min)

**Objective**: Populate skill with instructions and bundled resources.

**Remember**: Creating this skill for another AI agent instance to use. Focus on information that would be beneficial and non-obvious.

#### Start with Reusable Skill Contents

Begin with resources identified in Step 2: `scripts/`, `references/`, and `assets/` files.

**Process**:
1. Create scripts identified in planning phase
2. Add reference documentation — start each `references/*.md` from [skill_reference_template.md](../../assets/skill/skill_reference_template.md) so it ships the full 5-field + `version` frontmatter block; name files **snake_case**
3. Include asset files — start each `assets/*.md` from [skill_asset_template.md](../../assets/skill/skill_asset_template.md) so it ships the full 5-field + `version` frontmatter block; name files **snake_case**
4. Add procedure cards only when the skill has multiple distinct, individually-triggered internal procedures — start each from [skill_procedure_template.md](../../assets/skill/skill_procedure_template.md), placed under `references/procedures/`; skip this step entirely for a skill with one dominant workflow
5. Delete example files generated during initialization

**Note**: May require user input (e.g., brand assets, documentation templates).

**Important**: Delete example files and directories not needed for the skill.

**Example - Markdown Optimizer Skill**:
```bash
# Keep needed directories
scripts/
  ├── extract_structure.py    # Created
  └── example_script.py       # DELETE

references/
  ├── core_standards.md       # Created
  ├── workflows.md            # Created
  ├── optimization.md         # Created
  ├── validation.md           # Created
  └── example_reference.md    # DELETE

assets/
  ├── frontmatter_templates.md  # Created
  └── example_asset.txt         # DELETE
```

#### Update SKILL.md

Answer these questions in SKILL.md:

1. **What is the purpose of the skill, in a few sentences?**
   - Write clear, concise summary
   - Include in subtitle under H1

2. **When should the skill be used?**
   - Section 1: WHEN TO USE
   - **ONLY activation triggers and use cases belong here**
   - Include: Activation triggers, Use cases, When NOT to use, Keyword triggers
   - **DO NOT include**: File references, navigation guides, resource paths
   - Example content:
     ```markdown
     ## 1. WHEN TO USE

     ### Activation Triggers
     - User requests document quality review
     - After Write/Edit operations on markdown files

     ### Use Cases
     - Validating markdown structure before commits
     - Optimizing documentation for AI readability

     ### When NOT to Use
     - Simple text edits without structural changes
     - Non-markdown file types
     ```

3. **How should the agent route to the right resources?**
   - Section 2: SMART ROUTING
   - Follow the SMART ROUTING template generated in Step 3. Populate the five subsections: Primary Detection Signal, Phase Detection, Resource Domains, Resource Loading Levels, and Smart Router Pseudocode.
   - **Seed the pseudocode from the canonical resilience pattern**: copy the four patterns from [skill_smart_router.md](../../assets/skill/skill_smart_router.md) §2 (runtime discovery, existence-check-before-load, extensible routing key, multi-tier fallback) into the Smart Router Pseudocode subsection, then adapt the routing key and resource map to this skill's domain. A SKILL.md with an empty or missing Smart Router Pseudocode subsection is incomplete.
   - **Anti-pattern**: Do NOT duplicate routing logic in separate lookup tables; do NOT ship a SMART ROUTING section without the resilience pseudocode

4. **How should bundled resources be organized for routing clarity?**
   - Keep domain structure explicit (for example `references/backend/go/`)
   - Mirror key domains under `assets/` when templates/checklists are stack-specific
   - Keep one source of truth for mapping in `Resource Domains`

5. **How should the agent use the skill in practice?**
   - Section 3: HOW IT WORKS
   - Reference all bundled resources
   - Explain workflow and decision points

6. **What rules govern skill usage?**
   - Section 4: RULES
   - ALWAYS rules (required actions)
   - NEVER rules (forbidden actions)
   - ESCALATE IF (when to ask user)

7. **What references should the skill expose explicitly?**
   - Section 5: REFERENCES
   - Include core references and templates, or use combined `SMART ROUTING & REFERENCES` if preferred.

**Writing Style Reminders**:
- Use imperative/infinitive form (verb-first: "Run validation", "Check structure")
- Third-person descriptions ("This skill should be used when...")
- Objective, instructional language
- Keep total under 5k words

**Frontmatter Completion**:

SKILL.md requires all four fields. `package_skill.py --check` hard-fails when any is missing — `version` is **not** optional.

| Field           | Required | Quick Note                                     |
| --------------- | -------- | ---------------------------------------------- |
| `name`          | ✅        | Must match folder name, lowercase-with-hyphens |
| `description`   | ✅        | Single line, ≤ 130 chars (skill) / ≤ 110 (command); see Pitfall 1 in [common_pitfalls.md](../shared/common_pitfalls.md) for trim rules |
| `allowed-tools` | ✅        | Array format (`[Read, Write, ...]`)           |
| `version`       | ✅        | 4-part `X.Y.Z.W` (e.g., `1.0.0.0`); see [frontmatter_versioning.md](../../../shared/references/global/frontmatter_versioning.md) |

```yaml
---
name: markdown-optimizer
description: Complete document quality pipeline with structure enforcement, content optimization (AI-friendly), and style guide compliance
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.0.0.0
---
```

**Every authored `.md` carries `version`** — not just SKILL.md:
- **`references/*.md` and `assets/*.md`** carry the full 5-field block (`title`, `description`, `trigger_phrases` 3-8, `importance_tier`, `contextType`) **plus `version`** (4-part `X.Y.Z.W`). Seed each new file from [skill_reference_template.md](../../assets/skill/skill_reference_template.md) / [skill_asset_template.md](../../assets/skill/skill_asset_template.md) so the block is present by construction. Use **snake_case** filenames (`package_skill.py --check` warns on non-snake_case in `references/` and `assets/`).
- **`README.md`** is exempt from the 5-field reference block but still carries `title`, `description`, and `version` per [skill_readme_template.md](../../assets/skill/skill_readme_template.md).

> **Complete Reference**: For validation rules, format specifications, and all document types, see [frontmatter_templates.md](../../../shared/assets/frontmatter_templates.md)

### Step 5: Packaging a Skill (~2 min)

**Objective**: Validate skill and package into distributable zip file.

**Completion gate (run before claiming the skill is done)**:
```bash
scripts/package_skill.py <path/to/skill-folder> --check
```
`--check` runs validation only (no zip). It is the authoritative gate: it hard-fails on a missing `version` (or non-4-part `X.Y.Z.W`), a `name` that does not match the folder, and a missing required SKILL.md section, and warns on non-snake_case filenames in `references/` and `assets/`. Do not claim the skill is complete until `--check` passes.

**Command** (validate + package into a zip):
```bash
scripts/package_skill.py <path/to/skill-folder>
```

**Optional output directory**:
```bash
scripts/package_skill.py <path/to/skill-folder> ./dist
```

**Packaging Process**:

**Phase 1: Validation** (automatic):
- YAML frontmatter format and required fields
- Skill naming conventions (hyphen-case)
- Description completeness and quality (no angle brackets, no generic text)
- Directory structure validation
- File organization check

**Validation Checks**:
1. SKILL.md exists
2. Frontmatter starts with `---`
3. Frontmatter has closing `---`
4. Required SKILL.md fields present: `name`, `description`, `allowed-tools`, `version` (all four — `version` is required)
5. `version` is 4-part `X.Y.Z.W`
6. Name is hyphen-case (lowercase, hyphens, no underscores) and matches the folder name
7. Name doesn't start/end with hyphen; no consecutive hyphens
8. No angle brackets in description (e.g., `<skill-name>`); description is complete (not just a TODO placeholder)
9. `references/` and `assets/` filenames are snake_case (warning otherwise)

**Phase 2: Packaging** (if validation passes):
- Creates zip file named after skill (e.g., `markdown-optimizer.zip`)
- Includes all files with proper directory structure
- Preserves executable permissions for scripts
- Creates in output directory or skill parent directory

**If validation fails**:
- Error messages printed to console
- Specific issues highlighted
- Fix errors and run packaging command again

**Success Output**:
```
✅ Validation passed
📦 Packaging skill: markdown-optimizer
✅ Successfully packaged skill to: ./dist/markdown-optimizer.zip

💡 Recommended next step:
   Do a final quality pass to ensure production readiness:
   markdown-document-specialist extract markdown-optimizer/SKILL.md
   Review the JSON output + re-read the doc for clarity and completeness
```

### Step 6: Iterate (ongoing)

**Objective**: Test and improve based on real usage.

**Iteration Workflow**:
1. Use skill on real tasks
2. Notice struggles or inefficiencies
3. Identify SKILL.md or bundled resource updates needed
4. Implement changes
5. Repackage and test again

**Best Time to Iterate**: Right after using skill, with fresh context of performance.

**Common Iteration Patterns**:

**Pattern 1: Unclear Instructions**
- Symptom: The agent misinterprets skill guidance
- Fix: Add examples to SKILL.md, clarify wording
- Location: Typically in HOW IT WORKS or RULES sections

**Pattern 2: Missing Resources**
- Symptom: The agent recreates same code/content repeatedly
- Fix: Add script or reference file
- Location: New file in scripts/ or references/

**Pattern 3: Overly Detailed SKILL.md**
- Symptom: SKILL.md exceeds 5k words, context window strain
- Fix: Move detailed content to references/ files
- Location: Extract sections to references/, add pointers in SKILL.md

**Pattern 4: Skill Not Triggering**
- Symptom: The agent doesn't use skill when appropriate
- Fix: Improve description in frontmatter, be more specific about triggers
- Location: YAML frontmatter `description` field

**Iteration Example - Markdown Optimizer**:
```
Initial Version:
- SKILL.md: 800 words
- description: "Optimizes markdown files"
- Problem: Too generic, skill didn't trigger

Iteration 1:
- Updated description: "Complete document quality pipeline with structure enforcement, content optimization (AI-friendly), and style guide compliance"
- Result: Better triggering, but users confused about modes

Iteration 2:
- Added workflows.md reference with detailed mode explanations
- Added examples section with before/after
- Result: Clear usage, high adoption

Iteration 3:
- Added extract_structure.py script for document parsing
- Result: AI can now evaluate structured JSON output reliably
```

---

## 3. RELATED RESOURCES

### Sibling Skill-Creation References
- [overview.md](../shared/overview.md) - Skill anatomy and structure system
- [validation_and_packaging.md](../shared/validation_and_packaging.md) - Validation requirements and distribution
- [common_pitfalls.md](../shared/common_pitfalls.md) - Common skill-creation pitfalls and fixes
- [examples_and_maintenance.md](./examples_and_maintenance.md) - Example skills and maintenance workflow

### Templates
- [skill_md_template.md](../../assets/skill/skill_md_template.md) - SKILL.md file templates
- [skill_procedure_template.md](../../assets/skill/skill_procedure_template.md) - Private procedure card templates and guidelines
- [frontmatter_templates.md](../../../shared/assets/frontmatter_templates.md) - Frontmatter by document type

### Reference Files
- [core_standards.md](../../../shared/references/global/core_standards.md) - Document type rules and structural requirements
