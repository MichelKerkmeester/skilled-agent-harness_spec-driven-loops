---
title: Skill Anatomy and Structure System
description: What an AI agent skill is - anatomy, SKILL.md requirements, bundled-resource directories, and the layered-doc structure system.
trigger_phrases:
  - "skill anatomy"
  - "skill md requirements"
  - "bundled resources directories"
  - "layered skill docs"
  - "progressive disclosure skills"
importance_tier: normal
contextType: implementation
version: 1.8.0.1
---

# Skill Anatomy and Structure System

What a skill is, how its files and bundled resources are organized, and how to keep large skills maintainable through layered docs.

---

## 1. OVERVIEW

Level 3 reference for what a skill *is*: its anatomy, the required `SKILL.md` contract, the optional bundled-resource directories, and the layered-doc structure system that keeps large skills maintainable.

**Core Principle**: Progressive disclosure maximizes value, minimizes cost.

```
Level 1: SKILL.md metadata (name + description) — Always in context (~100 words)
Level 2: SKILL.md body — When skill triggers (<5k words)
Level 3: Bundled resources (this document) — Loaded as needed
```

Skills are modular packages that extend an AI agent with specialized workflows, tool integrations, domain expertise, and bundled resources (scripts, references, assets).

---

## 2. SKILL ANATOMY

Every skill consists of a required SKILL.md file and optional human-facing README plus bundled resources:

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter metadata (required)
│   │   ├── name: (required)
│   │   └── description: (required)
│   └── Markdown instructions (required)
├── README.md (optional, human-facing orientation)
└── Bundled Resources (optional)
    ├── scripts/          - Executable code (Python/Bash/etc.)
    ├── references/       - Documentation (flat or domain subfolders)
    └── assets/           - Files used in output (subfolders OK for organization)
        ├── skill/         - Skill creation templates (SKILL.md, README, reference, asset)
        ├── agents/        - Agent and command creation templates
        └── readme/ - README-shaped scaffolds (README, install guide)
```

**Folder Organization Principle**:
- **references/** = flat for small skills, domain subfolders for medium/complex skills
  - Grouped example: `references/global/core_standards.md`, `references/global/validation.md`
  - Domain example: `references/backend/go/`, `references/frontend/react/`
- **assets/** = Subfolders ALLOWED when organizing many files by category
  - Group related templates together for clarity
  - Example: `assets/skill/`, `assets/readme/`, `assets/flowcharts/`
- **scripts/** = Typically flat, but subfolders OK for large script collections

### SKILL.md Requirements

**Metadata Quality**: The `name` and `description` in YAML frontmatter determine when the AI agent will use the skill. Be specific about what the skill does and when to use it.

**Writing Style Guidelines**:
- Use **third-person** in descriptions (e.g., "This skill should be used when..." instead of "Use this skill when...")
- Write using **imperative/infinitive form** (verb-first instructions), not second person
- Use objective, instructional language (e.g., "To accomplish X, do Y" rather than "You should do X")
- Keep SKILL.md body under **5k words**

**Required Sections** (enforced by markdown-document-specialist validation):
1. WHEN TO USE (activation triggers and use cases ONLY)
2. SMART ROUTING (detection guidance + merged resource domains/mapping + loading levels + authoritative pseudocode)
3. HOW IT WORKS
4. RULES (ALWAYS/NEVER/ESCALATE IF)
5. REFERENCES (or combined `SMART ROUTING & REFERENCES`)

Validation reminder:
- `scripts/package_skill.py` fails if `REFERENCES` is missing and no approved combined heading variant is present.

### README.md Guidance

Create `README.md` when the skill needs human-facing orientation beyond runtime routing. Use [skill_readme_template.md](../../assets/skill/skill_readme_template.md) for skill package READMEs rather than the generic folder README template.

Include a skill README when:
- Operators need a quick start, examples, troubleshooting or FAQ.
- The skill has multiple modes, resource domains, scripts or validation commands.
- Readers need a concise map that explains how `SKILL.md`, `references/`, `assets/` and `scripts/` fit together.

Keep boundaries clear:
- `SKILL.md` is the runtime instruction and routing surface.
- `README.md` is the human orientation and navigation surface.
- Long conceptual depth belongs in focused `references/` files.

**Recommended Sections**:
6. SUCCESS CRITERIA
7. INTEGRATION POINTS
8. RELATED RESOURCES

### Routing Authority Standard

Intent scoring and the in-code resource map in SMART ROUTING are the authoritative routing source. Do not maintain separate use-case routing tables.

Router parity checklist for modern skills:
- Guarded in-skill loading (`_guard_in_skill`)
- Recursive markdown discovery (`discover_markdown_resources`)
- Weighted intent scoring (`score_intents`)
- Ambiguity handling (`select_intents`)
- Explicit loading levels with ON_DEMAND triggers
- Optional `UNKNOWN_FALLBACK_CHECKLIST` for low-confidence requests

Smart-router resilience reference:
- Use [skill_smart_router.md](../../assets/skill/skill_smart_router.md) as the canonical pattern for runtime markdown discovery, guarded existence-checked loading, extensible routing keys, and multi-tier fallback behavior.
- Preserve each skill's domain-specific intent model, resource map, and loading levels; only standardize discovery, loading, routing-key, and fallback mechanics.

**Section Boundary Rules:**
```
❌ WRONG: File references or routing logic in "WHEN TO USE"
❌ WRONG: Separate use-case routing tables or navigation guides
✅ RIGHT: Detection context plus merged domains/mapping and one authoritative pseudocode block

"WHEN TO USE" = WHEN (triggers, conditions, use cases)
"SMART ROUTING" = HOW resources are selected and loaded (authoritative)
```

### Bundled Resources (Optional)

#### Scripts Directory (`scripts/`)

Executable code for tasks requiring deterministic reliability or repeatedly rewritten.

**When to include scripts**:
- Same code being rewritten repeatedly by the agent
- Deterministic reliability needed
- Performance optimization required
- Complex logic better handled by programming language

**Examples**:
- `scripts/rotate_pdf.py` - PDF rotation tasks
- `scripts/extract_structure.py` - Document structure extraction
- `scripts/init_skill.py` - Skill scaffolding

**Benefits**:
- Token efficient (may execute without loading into context)
- Deterministic behavior
- Reusable across skill invocations

**Note**: Scripts may still need to be read for patching or environment adjustments.

#### References Directory (`references/`)

Documentation loaded as needed to inform the agent's process and thinking.

**When to include references**:
- Documentation the agent should reference while working
- Detailed domain knowledge
- API specifications
- Database schemas
- Company policies

**Examples**:
- `references/schema.md` - Database schema documentation
- `references/api_docs.md` - API endpoint specifications
- `references/policies.md` - Company policies and guidelines
- `references/global/workflows.md` - Detailed workflow documentation

**Benefits**:
- Keeps SKILL.md lean
- Loaded only when needed
- Supports deep, detailed documentation

**Best practice**:
- If files are large (>10k words), include grep search patterns in SKILL.md
- Avoid duplication between SKILL.md and references
- Keep only essential instructions in SKILL.md
- Move detailed reference material to references files

**Frontmatter contract**: every reference and asset markdown file carries the full 5-field block (`title`, `description`, `trigger_phrases` 3-8, `importance_tier`, `contextType`); `README.md` files are exempt. The Skill Advisor harvests these fields as routing signal — see [frontmatter_templates.md](../../../shared/assets/frontmatter_templates.md) for the template and field rules.

#### Assets Directory (`assets/`)

Files used within the output the agent produces (not loaded into context).

**When to include assets**:
- Skill needs files for final output
- Templates for document generation
- Boilerplate code
- Images, icons, logos

**Examples**:
- `assets/logo.png` - Brand logo
- `assets/template.html` - HTML template
- `assets/font.ttf` - Custom font
- `assets/frontmatter_templates.md` - YAML frontmatter examples

**Benefits**:
- Separates output resources from documentation
- Keeps context window clean
- Provides consistent output resources

---

## 3. SKILL STRUCTURE SYSTEM

### Why Layered Skill Docs

Large skills eventually outgrow one `SKILL.md` file. The maintainable pattern is to keep routing in `SKILL.md` and split depth into focused reference files that can be loaded on demand.

### Core Structure

```
skill-name/
├── SKILL.md                # Primary entrypoint (activation rules, routing, core behavior)
├── references/
│   ├── topic-a.md
│   ├── topic-b.md
│   └── topic-c.md
├── assets/
└── scripts/
```

### Design Logic

1. Start with `SKILL.md` for trigger/routing behavior.
2. Use `README.md` or the SKILL navigation section as a concise map.
3. Load only the specific `references/` files required by the active task.
4. Keep progressive disclosure strict to control context size.

### How AI Should Use Layered Skills

Use this operating pattern:

1. Read `SKILL.md` for trigger and routing rules.
2. Open `README.md` if additional navigation is needed.
3. Read one focused reference at a time and summarize locally.
4. Follow markdown links only when they advance the current objective.
5. Stop once confidence is high and required context is complete.

### Authoring Rules

- Keep each reference file scoped to one complete concept.
- Keep reference content concise and practical.
- Add one-line YAML `description` to long-form docs.
- Put links inside meaningful prose, not isolated link dumps.
- Validate markdown links after edits.

### Templates

Use these templates when authoring layered skills:
- Skill template: `../../assets/skill/skill_md_template.md`
- Skill README template: `../../assets/skill/skill_readme_template.md`
- Reference template: `../../assets/skill/skill_reference_template.md`
- Asset template: `../../assets/skill/skill_asset_template.md`

---

## 4. RELATED RESOURCES

### Sibling Skill-Creation References
- [creation_workflow.md](./creation_workflow.md) - The 6-step skill creation process
- [validation_and_packaging.md](./validation_and_packaging.md) - Validation requirements and distribution
- [parent_skills_nested_packets.md](./parent_skills_nested_packets.md) - Parent skills with nested mode packets

### Templates
- [skill_md_template.md](../../assets/skill/skill_md_template.md) - SKILL.md file templates
- [skill_readme_template.md](../../assets/skill/skill_readme_template.md) - Skill README file template
- [skill_reference_template.md](../../assets/skill/skill_reference_template.md) - Reference file templates
- [skill_asset_template.md](../../assets/skill/skill_asset_template.md) - Asset file templates
- [frontmatter_templates.md](../../../shared/assets/frontmatter_templates.md) - Frontmatter by document type

### Reference Files
- [core_standards.md](../../../shared/references/global/core_standards.md) - Document type rules and structural requirements
- [validation.md](../../../shared/references/global/validation.md) - Quality scoring and validation workflows
