---
title: sk-doc
description: Markdown and OpenCode component specialist: structure-first document quality, DQI scoring, component scaffolding and packaging, flowcharts, install guides, feature catalogs and manual testing playbooks.
trigger_phrases:
  - "documentation"
  - "readme"
  - "create skill"
  - "validate doc"
  - "changelog"
  - "flowchart"
  - "install guide"
  - "playbook"
  - "feature catalog"
version: 1.8.0.36
---

# sk-doc

> Document quality starts with structure. A deterministic script extracts and scores a document before the AI judges it, so every doc of a given type comes out the same shape and passes the same bar.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Markdown quality enforcement, component scaffolding and packaging, flowcharts, install guides, feature catalogs, testing playbooks and changelogs |
| **Invoke with** | "create a skill", "validate doc", "readme", "documentation", "flowchart", "changelog" or Gate 2 auto-routing on doc keywords |
| **Works on** | Markdown files, OpenCode components (skills, agents, commands) and ASCII flowcharts |
| **Produces** | DQI scores, validated documents, packaged skill zips and templated component directories |

---

## 2. OVERVIEW

### Why This Skill Exists

Documentation drifts without a standard. Section order wanders. Frontmatter goes missing. Voice slides into filler, and one author's README reads nothing like the next. A reader re-learns the layout every time. An AI assistant cannot parse the structure reliably. Hand-checking every document against a style guide does not scale and misses things.

sk-doc makes structure the first gate so these problems never reach production. The script catches what is wrong before the AI touches a line. A reader opens any install guide, any changelog or any skill README and knows exactly where to look and what to expect. An AI assistant loads a document and finds the same landmarks every time.

### What It Does

sk-doc is the single specialist for documentation and OpenCode components. Its core pipeline extracts a document to JSON with a quality score, a pass or fail checklist and a list of violations, all computed before the AI judges the content. Beyond quality enforcement it scaffolds, validates and packages skills, agents and commands. It builds ASCII flowcharts, five-phase install guides, feature catalogs that inventory current behavior and manual testing playbooks that prove it.

It does not own code or spec folders. `sk-code` owns code standards and tests. `system-spec-kit` owns the spec-folder lifecycle, memory and continuity. The two skills touch markdown but do not overlap: sk-doc judges document quality and system-spec-kit enforces the spec-packet contract.

---

## 3. QUICK START

**Step 1: Invoke it.** Gate 2 auto-routing fires on documentation keywords, or you read the skill directly.

```bash
# Auto-routing through the skill advisor
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "validate my README" --threshold 0.8

# Or read the runtime instructions
Read(".opencode/skills/sk-doc/SKILL.md")
```

**Step 2: Check a document's structure and score.** Run `extract_structure.py` on any markdown file. It returns the DQI, the checklist results and every detected violation in JSON.

```bash
python3 .opencode/skills/sk-doc/scripts/extract_structure.py path/to/document.md
```

Success looks like a JSON object with `dqi.total`, `dqi.band` and `checklist.passed` above zero. A band of "excellent" or "good" means the document is ready. A band of "needs_work" means the checklist output tells you exactly what to fix and in what order.

**Step 3: Validate a README before delivery.** `validate_document.py` is the fast gate. It checks required sections, heading format and frontmatter. Exit 0 means it passes.

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py README.md --type readme
```

Exit 0 means the document is valid and ready to ship. Exit 1 means a blocking format error (read the message, fix it and re-run). Exit 2 means the file could not be read (check the path).

---

## 4. HOW IT WORKS

### Structure-First Pipeline

Every document passes through the same sequence. The script parses the markdown, extracts the heading tree, the frontmatter and the code blocks, runs the checklist for the detected document type and computes the three-component DQI. It outputs flat JSON. The AI reads that JSON, answers the evaluation questions the script poses and produces ranked recommendations. No document gets a quality pass without the script running first.

### Scripts Versus AI

The scripts own the deterministic work. `extract_structure.py` parses, measures and checks. `validate_document.py` gates format at the exit-code level. `init_skill.py` scaffolds a directory. `package_skill.py` validates and bundles. `quick_validate.py` runs fast naming and frontmatter checks. `validate_flowchart.sh` checks box alignment and label consistency on ASCII diagrams. The AI owns the quality judgment: it reads the JSON, evaluates content depth and clarity, scores style against the Human Voice Rules and writes the recommendations. The split keeps the metrics repeatable and the judgment human-sounding.

### The DQI

The Documentation Quality Index scores a document from 0 to 100. Structure is worth 40 points (checklist pass rate, heading hierarchy, section completeness). Content is worth 30 points (word count in the right range, heading density, code examples, links and tables). Style is worth 30 points (H2 format, section dividers, intro paragraph and HVR compliance). The four bands tell you where you stand:

| Band | Score | What it means |
|---|---|---|
| Excellent | 90 to 100 | Production-ready, nothing to fix |
| Good | 75 to 89 | Shareable, minor improvements recommended |
| Acceptable | 60 to 74 | Functional but several areas need attention |
| Needs Work | Below 60 | Not ready, fix in priority order |

### Document-Type Enforcement

Enforcement is type-aware so a SKILL.md cannot ship with a missing frontmatter, a README does not fail on optional fields and an active spec document stays loose while it is under development. SKILL and command docs are strict (blocking violations stop the gate). README docs are usability-focused (safe auto-fixes only, no blocking format rules beyond the essential sections). Knowledge docs are moderately strict. Active spec docs are loose unless the task explicitly asks for enforcement. The validator reads the file path and content shape, detects the type and applies the right level automatically.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for sk-doc when you create or edit a markdown document, when you scaffold a skill, agent or command and when you need a quality gate before publishing. Use it when you build an install guide, a feature catalog, a testing playbook, a flowchart or a changelog. Use it too when a document's DQI score drops and you need to know what to fix and why.

You reach it through seven `/create:*` commands: `/create:agent`, `/create:sk-skill`, `/create:sk-skill-parent`, `/create:feature-catalog`, `/create:testing-playbook`, `/create:folder_readme` and `/create:changelog`. The `@markdown` agent handles template-first documentation authoring for these and other markdown targets.

Skip sk-doc for code changes (route to `sk-code`), for spec-folder lifecycle operations (route to `system-spec-kit`) and for git workflow orchestration (route to `sk-git`).

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Owns code standards and tests. sk-doc documents the skill and validates its README. |
| `system-spec-kit` | Owns spec folders, memory and continuity. sk-doc judges quality. The two do not overlap. |
| `sk-git` | Owns git workflow. sk-doc produces the commit and PR text quality. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| DQI below 60 ("needs_work") | Missing sections, no frontmatter on a strict file or multiple HVR violations | Fix in priority order: structure and section order first, then missing sections, then content density, then style. Re-run after each batch. |
| `validate_document.py` exits 1 | A blocking format issue: missing required H2, non-sequential numbering or malformed frontmatter | Read the error message line by line. Fix each reported violation and re-run. |
| `package_skill.py` fails | SKILL.md is over the 5000-word ceiling, a required section is missing or a subdirectory was not scaffolded | Run `extract_structure.py` on SKILL.md first. Move deep detail into `references/` files if the word count is too high. |
| Wrong document type detected | The file path or content shape misled the detector | Check the detected type in the JSON output. Override with `--type` on `validate_document.py`. |

---

## 7. FAQ

**Q: When do I use sk-doc instead of system-spec-kit? Both touch markdown.**

A: sk-doc judges document quality and creates components. system-spec-kit owns the spec-packet contract: Level 1 requires `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md`. Level 2 adds `checklist.md`. Packet metadata also includes `description.json` and `graph-metadata.json` for phase parents and save/resume state. The two do not overlap. Use sk-doc for a README, a skill scaffold or a changelog. Use system-spec-kit when you start a spec-folder-tracked change.

**Q: validate_document.py and extract_structure.py: which one do I run?**

A: Run `validate_document.py` as the fast delivery gate for README files. It exits 0 or 1 and checks only the formatting rules that block publishing. Run `extract_structure.py` when you want the full picture: the DQI score, the checklist pass rate, the violations and the evaluation questions. It works on any markdown document type. Use both in sequence.

**Q: What is the difference between a feature catalog and a manual testing playbook?**

A: A feature catalog documents current behavior. It inventories what a skill or system can do, organized by numbered categories, with source-file anchors and stable slugs. A testing playbook defines how to test that behavior manually, with deterministic prompts, expected signals and evidence requirements. The catalog is the stable capability reference. The playbook links back to it through a cross-reference index. Build the catalog first.

**Q: Which /create:* command do I use?**

A: `/create:sk-skill` for a new skill under `.opencode/skills/`. `/create:sk-skill-parent` for a parent skill with nested mode packets. `/create:agent` for an agent under `.opencode/agents/`. `/create:feature-catalog` for a rooted feature inventory. `/create:testing-playbook` for a manual testing package. `/create:folder_readme` for a directory-level README. `/create:changelog` for a versioned changelog entry.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the mode rules |
| [`references/global/quick_reference.md`](./references/global/quick_reference.md) | One-page command and gate cheat sheet |
| [`references/global/hvr_rules.md`](./references/global/hvr_rules.md) | Human Voice Rules, the writing standard all output must pass |
| [`references/global/validation.md`](./references/global/validation.md) | DQI scoring criteria, quality gates and assessment interpretation |
| [`references/global/core_standards.md`](./references/global/core_standards.md) | Filename conventions, heading rules and document-type requirements |
| [`references/global/workflows.md`](./references/global/workflows.md) | Execution workflows by mode and task type |
| [`references/global/optimization.md`](./references/global/optimization.md) | AI-friendly content transforms and the llms.txt format |
| [`references/global/evergreen_packet_id_rule.md`](./references/global/evergreen_packet_id_rule.md) | Why runtime-state docs must not cite mutable spec-packet numbers |
| [`references/skill_creation.md`](./references/skill_creation.md) | The skill-creation workflow: understanding through packaging |
| [`references/agent_creation.md`](./references/agent_creation.md) | Agent authority, permissions and the template-first workflow |
| [`references/readme_creation.md`](./references/readme_creation.md) | README creation workflow and standards |
| [`references/install_guide_creation.md`](./references/install_guide_creation.md) | Five-phase install guide standards and validation checkpoints |
| [`references/manual_testing_playbook_creation.md`](./references/manual_testing_playbook_creation.md) | Playbook package structure, scenario tables and cross-reference index |
| [`references/feature_catalog_creation.md`](./references/feature_catalog_creation.md) | Feature catalog inventory standards and per-feature file structure |
| [`references/benchmark_creation.md`](./references/benchmark_creation.md) | Benchmark folder standards, ten-section report shape and promotion workflow |
| [`scripts/validate_document.py`](./scripts/validate_document.py) | Fast format validator, exit 0/1/2, supports `--json` and `--fix` |
| [`scripts/extract_structure.py`](./scripts/extract_structure.py) | Full DQI analysis with type-specific checklists and JSON output |
| [`scripts/init_skill.py`](./scripts/init_skill.py) | Skill directory scaffold from the template set |
| [`scripts/package_skill.py`](./scripts/package_skill.py) | Validate and package a skill to a zip file |
| [`assets/skill/`](./assets/skill/) | SKILL.md, README, reference and asset templates for skill creation |
| [`assets/flowcharts/`](./assets/flowcharts/) | Reusable ASCII flowchart patterns for workflows and decision trees |
