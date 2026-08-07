---
title: sk-doc
description: Markdown and OpenCode component specialist that enforces structure, scores quality and scaffolds components so every document of a given type comes out the same shape.
trigger_phrases:
  - "documentation"
  - "readme"
  - "create skill"
  - "validate doc"
  - "changelog"
---

# sk-doc

> A deterministic script scores your document before the AI ever touches it, so quality is measurable and repeatable.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Enforcing markdown structure, scoring document quality, scaffolding components and building flowcharts, install guides, playbooks and catalogs |
| **Invoke with** | `/create:*` commands, `@markdown` agent or auto-routing on documentation keywords |
| **Works on** | Markdown files, OpenCode component directories (skills, agents, commands) and ASCII flowcharts |
| **Produces** | A DQI score, a violation list, auto-fixed documents, scaffolded components and packaged deliverables |

---

## 2. OVERVIEW

### Why This Skill Exists

Documentation drifts without a standard. Section order wanders, frontmatter goes missing and one author's README looks nothing like the next. A reader re-learns the layout every time. An AI assistant cannot parse the structure reliably. Hand-checking every doc against a style guide does not scale, and it misses things. You need a gate that runs the same checks on every document of the same type, every time.

### What It Does

sk-doc makes structure the first gate. A deterministic script extracts the document, scores it and lists violations before the AI judges quality and recommends fixes. That split is the core: scripts handle the measurable parts (section order, frontmatter, heading density, word count) and the AI handles the judgment calls (clarity, relevance, voice). The result is that every document of a given type passes the same bar.

It also scaffolds and packages OpenCode components, builds ASCII flowcharts from several pattern families, and produces install guides, manual testing playbooks, feature catalogs and benchmark folders.

---

## 3. QUICK START

**Step 1: Validate a document.** Point the validator at any markdown file and tell it the document type.

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py ./README.md --type readme
```

```
✅ VALID: ./README.md
  Document type: readme
  Checks passed: 12
  Warnings: 0
  Blocking errors: 0
```

Exit 0 means the document passes. Exit 1 means blocking errors exist and the message names them.

**Step 2: Extract structure and get a DQI score.**

```bash
python3 .opencode/skills/sk-doc/scripts/extract_structure.py ./README.md
```

```json
{
  "document_type": "readme",
  "dqi": {
    "total": 82,
    "structure": 36,
    "structure_max": 40,
    "content": 24,
    "content_max": 30,
    "style": 22,
    "style_max": 30
  },
  "sections_found": ["AT A GLANCE", "OVERVIEW", "QUICK START"],
  "checklist": { "pass": 10, "fail": 2, "warn": 1 },
  "violations": []
}
```

The DQI is out of 100: structure worth 40, content worth 30, style worth 30. Read the score against the bands (see How It Works) and fix in priority order: structure first, then content, then style.

**Step 3: Scaffold a new skill.**

```bash
python3 .opencode/skills/sk-doc/scripts/init_skill.py my-new-skill
```

```
Created skill directory: .opencode/skills/my-new-skill/
  SKILL.md           (from template)
  README.md          (from template)
  references/        (empty)
  assets/            (empty)
```

---

## 4. HOW IT WORKS

### The Structure-First Pipeline

Every document passes through the same sequence. A script parses the markdown into structured JSON (sections, headings, frontmatter, word counts, code blocks, links). That JSON feeds a deterministic DQI score. The AI then reads the JSON and the score to judge quality, flag issues and recommend fixes. The script never guesses. The AI never measures. Each does what it does best.

The validator (`validate_document.py`) runs format checks: missing required sections, non-sequential numbering, missing frontmatter. It exits 0 on success, 1 on blocking errors. The extractor (`extract_structure.py`) runs the deeper analysis: DQI scoring, checklist pass rates, violation lists and detected document type. Both read the same parsed representation.

### DQI Bands

| Band | Score | Meaning |
|---|---|---|
| Excellent | 90 to 100 | Production-ready |
| Good | 75 to 89 | Shareable, minor improvements recommended |
| Acceptable | 60 to 74 | Functional, several areas need attention |
| Needs Work | below 60 | Not ready, significant improvements required |

A failing DQI does not mean the document is bad. It means the script found measurable gaps. Fix in priority order: structure and section order first, then missing sections, then content density, then style. Re-run after each batch.

### Document-Type Enforcement

Not every document needs the same strictness. The skill detects the document type from location, shape and frontmatter, then applies the matching gate.

| Document type | Strictness | Behaviour |
|---|---|---|
| SKILL and command docs | Strict | Frontmatter required, blocks on violations |
| README docs | Usability-focused | Safe auto-fixes only, no hard blocks |
| Knowledge docs | Moderate | Structural checks with soft warnings |
| Active spec docs | Loose | Enforcement only when the task requests it |

A SKILL.md without frontmatter fails hard. A README with a missing divider gets an auto-fix suggestion. This keeps the gate tight where it matters and practical where a human is still editing.

### The Scripts

The core scripts live under `scripts/` and each one does one thing:

| Script | Purpose |
|---|---|
| `validate_document.py` | Fast format validation with type-aware gates |
| `extract_structure.py` | Parses markdown to JSON with DQI score and violations |
| `init_skill.py` | Scaffolds a new skill directory from templates |
| `package_skill.py` | Validates and packages a skill to a zip; `--check` validates only |
| `quick_validate.py` | Fast frontmatter and naming checks for a skill |
| `validate_flowchart.sh` | Box-alignment, arrow and label checks for ASCII flowcharts |

Additional scripts handle auditing README coverage across the workspace and validating model references in documentation.

### Component Scaffolding

Beyond document quality, sk-doc scaffolds OpenCode components. `init_skill.py` creates the directory layout from the skill templates. `package_skill.py` validates the result against the SKILL.md word ceiling and required sections, then zips it for distribution. The same template-driven approach applies to agents and commands through the `/create:*` commands.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for sk-doc when a markdown file needs structural validation, when you are creating or refreshing a README, when you need to scaffold a new skill, agent or command, or when a document needs a quality score before shipping. Reach for it too when you want an ASCII flowchart, an install guide, a testing playbook or a feature catalog.

Skip it for code changes (that is `sk-code`) and for spec-folder lifecycle work (that is `system-spec-kit`). A code change routes to sk-code. A spec-folder save routes to system-spec-kit. sk-doc judges document quality; it does not own code standards or the spec packet contract.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Owns code standards, surface detection and tests. sk-doc does not touch code files. |
| `system-spec-kit` | Owns spec folders, memory and continuity. Both touch markdown, but sk-doc judges quality and system-spec-kit owns the packet contract. |
| `@markdown` agent | A LEAF documentation executor that authors template-first markdown. It is the write-capable surface that invokes sk-doc templates and validation. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| DQI below 60 | Structure, content or style gaps | Fix in priority order: section order, missing sections, content density, style. Re-run after each batch. |
| `validate_document.py` exits 1 | Blocking format issue | Read the message. It names the missing section or numbering error. |
| `package_skill.py` fails | SKILL.md over word ceiling, or a required section is missing | Trim the SKILL.md to under 5000 words (3000 recommended) or add the missing section. |
| Wrong document type detected | File location or shape misled detection | Check the `document_type` field in the JSON output from `extract_structure.py`. |

---

## 7. FAQ

**Q: How does sk-doc differ from system-spec-kit?**

A: sk-doc judges the quality of a markdown document (structure, content, style). system-spec-kit owns the spec-folder lifecycle, memory and continuity. Both touch markdown, but they do not overlap. A spec-folder validation runs through system-spec-kit. A README quality check runs through sk-doc.

**Q: When do I use `validate_document.py` versus `extract_structure.py`?**

A: Use `validate_document.py` for a fast pass/fail check before delivery. Use `extract_structure.py` when you need the DQI score, the checklist breakdown or the detected document type. The validator answers "does it pass?" The extractor answers "how good is it?"

**Q: What is the difference between a feature catalog and a manual testing playbook?**

A: A feature catalog is an inventory: one file per feature with metadata, status and notes. A manual testing playbook is a validation package: ordered scenarios with steps and expected results. A catalog answers "what exists." A playbook answers "does it work."

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-doc/README.md --type readme` reports zero issues |
| DQI score | `python3 .opencode/skills/sk-doc/scripts/extract_structure.py .opencode/skills/sk-doc/README.md` returns a DQI of 75 or higher |
| Flowchart validation | `bash .opencode/skills/sk-doc/scripts/validate_flowchart.sh <flowchart-file>` passes on well-formed ASCII charts |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, use cases, mode rules and document-type gates |
| [`references/global/validation.md`](./references/global/validation.md) | DQI scoring criteria and quality gates |
| [`references/global/hvr_rules.md`](./references/global/hvr_rules.md) | Human Voice Rules, the voice standard for all documentation |
| [`references/global/core_standards.md`](./references/global/core_standards.md) | Filename conventions and document-type rules |
| [`references/global/optimization.md`](./references/global/optimization.md) | Content optimization patterns |
| [`references/global/workflows.md`](./references/global/workflows.md) | Doc-quality execution modes |
| [`references/skill_creation.md`](./references/skill_creation.md) | Skill creation workflow and lifecycle guidance |
| [`references/readme_creation.md`](./references/readme_creation.md) | README creation workflow |
| [`assets/skill/skill_readme_template.md`](./assets/skill/skill_readme_template.md) | Template for skill README files |
