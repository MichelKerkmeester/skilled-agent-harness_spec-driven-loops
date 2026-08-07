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
  - "conformance benchmark"
  - "peer adapter benchmark"
version: 2.0.0.0
---

# sk-doc

> Document quality starts with structure. A deterministic script extracts and scores a document before a human or an AI judges it, so every document of a given type ships in the same shape and clears the same bar.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Markdown quality enforcement, component scaffolding and packaging, benchmark authoring, flowcharts, install guides, feature catalogs, testing playbooks, changelogs and local before/after document diffs |
| **Invoke with** | "create a skill", "validate doc", "conformance benchmark", "readme", "documentation", "flowchart", "changelog" or Gate 2 auto-routing on documentation keywords |
| **Works on** | Markdown files, OpenCode components (skills, agents, commands) and ASCII flowcharts |
| **Produces** | DQI scores, validated documents, packaged skill zips, templated component directories and self-contained HTML diff reports |

---

## 2. OVERVIEW

### Why This Skill Exists

Documentation drifts without a standard. Section order wanders. Frontmatter goes missing. Voice slides into filler and one author's README reads nothing like the next. A reader re-learns the layout every time. An AI assistant cannot parse the structure reliably. Hand-checking every document against a style guide does not scale and misses things.

sk-doc makes structure the first gate so these problems never reach production. The script catches what is wrong before the AI touches a line. A reader opens any install guide, any changelog, any skill README or any flowchart and knows exactly where to look and what to expect. An AI assistant loads a document and finds the same landmarks every time.

### What It Does

sk-doc is the single specialist for documentation and OpenCode components. Its core pipeline extracts a document to JSON with a quality score, a pass or fail checklist, a list of violations and the evaluation questions the AI answers, all computed before the AI judges the content. Beyond quality enforcement it scaffolds and packages skills, agents, commands and other OpenCode components, with validation as the gate before any package ships. It authors benchmark packages with deterministic conformance inputs for peer adapters, then builds ASCII flowcharts, five-phase install guides, feature catalogs that inventory current behavior and manual testing playbooks that prove it. Its sk-create-diff packet compares two versions of a document (text, Markdown, HTML, DOCX or text-PDF) without Git and renders the changes as a self-contained, zero-JavaScript HTML report with section-aware navigation.

It does not own code or spec folders. `sk-code` owns code standards and tests. `system-spec-kit` owns the spec-folder lifecycle together with memory and continuity. The two skills touch markdown but do not overlap: sk-doc judges document quality and system-spec-kit enforces the spec-packet contract.

### The Type-Aware Enforcement Layer

The validator reads the file path and content shape, then applies the matching enforcement level automatically. The detected type decides the strictness.

| Document class | Enforcement level |
|---|---|
| SKILL and command docs | Strict, with blocking violations that stop the gate |
| README docs | Usability-focused, with safe auto-fixes only and no blocking rules beyond the essential sections |
| Knowledge docs | Moderately strict |
| Active spec docs | Loose unless the task explicitly asks for enforcement |

---

## 3. QUICK START

**Step 1: Invoke it.** Gate 2 auto-routing fires on documentation keywords. Otherwise read the skill directly.

```bash
python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "validate my README" --threshold 0.8
```

The advisor prints a routing recommendation with a score. A score above the 0.8 threshold names sk-doc as the skill to load.

**Step 2: Score a document.** `extract_structure.py` returns the DQI, the checklist results, every violation and the evaluation questions in JSON.

```bash
python3 .opencode/skills/sk-doc/scripts/extract_structure.py path/to/document.md
```

Success looks like a JSON object with `dqi.total`, `dqi.band` and `checklist.passed`. A band of "excellent" or "good" means the document is ready. A band of "needs_work" means the checklist output tells you exactly what to fix and in what order.

**Step 3: Validate a README before delivery.** `validate_document.py` is the fast gate. It checks required sections, heading format and frontmatter.

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py README.md --type readme
```

Exit 0 means the document is valid and ready to ship. Exit 1 means a blocking format error, so fix the reported violations and re-run. Exit 2 means the file could not be read, so check the path.

---

## 4. HOW IT WORKS

### The Structure-First Pipeline

Every document passes through the same sequence. The script parses the markdown, extracts the heading tree along with the frontmatter and the code blocks, runs the checklist for the detected document type and computes the three-component DQI. It outputs flat JSON. The AI reads that JSON and answers the evaluation questions the script poses, then produces ranked recommendations. No document gets a quality pass without the script running first.

### The DQI

The Documentation Quality Index scores a document from 0 to 100 across three components:

| Component | Points | What it covers |
|---|---|---|
| Structure | 40 | checklist pass rate, heading hierarchy and section completeness |
| Content | 30 | word count in the right range, heading density, code examples, links and tables |
| Style | 30 | H2 format, section dividers, intro paragraph and HVR compliance |

The four bands tell you where you stand:

| Band | Score | What it means |
|---|---|---|
| Excellent | 90 to 100 | Production-ready, nothing to fix |
| Good | 75 to 89 | Shareable, minor improvements recommended |
| Acceptable | 60 to 74 | Functional but several areas need attention |
| Needs Work | Below 60 | Not ready, fix in priority order |

### Scripts Versus AI

The scripts own the deterministic work. `extract_structure.py` parses, measures, checks and reports. `validate_document.py` gates format at the exit-code level. `init_skill.py` scaffolds a directory. `package_skill.py` validates and bundles. `quick_validate.py` runs fast naming and frontmatter checks. `validate-flowchart.sh` checks box alignment and label consistency on ASCII diagrams. The AI owns the quality judgment: it reads the JSON, evaluates content depth and clarity, scores style against the Human Voice Rules and writes the recommendations. The split keeps the metrics repeatable and the judgment human-sounding.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for sk-doc when you create or edit a markdown document, when you scaffold a skill, an agent, a command or another OpenCode component and when you need a quality gate before publishing. Use it when you build an install guide, a feature catalog, a testing playbook, a flowchart, a changelog or a before/after diff of an edited document. Use it too when a document's DQI score drops and you need to know what to fix and why.

You reach it through eleven `/create:*` commands: `/create:agent`, `/create:skill`, `/create:skill-parent`, `/create:command`, `/create:feature-catalog`, `/create:manual-testing-playbook`, `/create:benchmark`, `/create:flowchart`, `/create:readme`, `/create:changelog` and `/create:diff`. `/create:benchmark --family=conformance_benchmark` authors and validates stable conformance inputs, then stops before adapter or deep-alignment execution. The `@markdown` agent handles template-first documentation authoring for these and other markdown targets.

Skip sk-doc when the task belongs to a neighbor:

- Code changes route to `sk-code`.
- Spec-folder lifecycle operations route to `system-spec-kit`.
- Git workflow orchestration routes to `sk-git`.

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

A: sk-doc judges document quality and creates components. system-spec-kit owns the spec-packet contract: Level 1 requires `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md`. Level 2 adds `checklist.md`. Packet metadata also includes `description.json` and `graph-metadata.json` for phase parents and save/resume state. The two do not overlap. Use sk-doc for a README, a skill scaffold, a changelog or any markdown component. Use system-spec-kit when you start a spec-folder-tracked change.

**Q: `validate_document.py` and `extract_structure.py`: which one do I run?**

A: Run `validate_document.py` as the fast delivery gate for README files. It exits 0 or 1 and checks only the formatting rules that block publishing. Run `extract_structure.py` when you want the full picture: the DQI score, the checklist pass rate, the violations and the evaluation questions. It works on any markdown document type. Use both in sequence.

**Q: What is the difference between a feature catalog and a manual testing playbook?**

A: A feature catalog documents current behavior. It inventories what a skill or system can do, organized by numbered categories, with source-file anchors and stable slugs. A testing playbook defines how to test that behavior manually, with deterministic prompts, expected signals, evidence requirements and a cross-reference back to the catalog. The catalog is the stable capability reference. The playbook links back to it through a cross-reference index. Build the catalog first.

**Q: Which `/create:*` command do I use?**

A: `/create:skill` for a new skill under `.opencode/skills/`. `/create:skill-parent` for a parent skill with nested mode packets. `/create:agent` for an agent under `.opencode/agents/`. `/create:command` for an OpenCode slash command set. `/create:feature-catalog` for a rooted feature inventory. `/create:manual-testing-playbook` for a manual testing package. `/create:benchmark` for MCP promotion and family-keyed benchmark authoring, including `conformance_benchmark`. `/create:flowchart` for a validated ASCII flowchart. `/create:readme` for a directory-level README. `/create:changelog` for a versioned changelog entry. `/create:diff` for a git-free before/after document review.

---

## 8. VERIFICATION

The skill ships the checks that prove a document is ready.

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py README.md --type readme` reports zero issues and exits 0 |
| Full quality | `python3 .opencode/skills/sk-doc/scripts/extract_structure.py document.md` returns the DQI, the checklist and the violations in JSON |
| Flowchart shape | `bash .opencode/skills/sk-doc/scripts/validate-flowchart.sh` checks box alignment and label consistency |
| Package gate | `python3 .opencode/skills/sk-doc/scripts/package_skill.py` validates a skill and bundles it to a zip |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the mode rules |
| [`references/quick-reference.md`](shared/references/quick-reference.md) | One-page command and gate cheat sheet |
| [`references/hvr-rules.md`](shared/references/hvr-rules.md) | Human Voice Rules, the writing standard all output must pass |
| [`references/validation.md`](shared/references/validation.md) | DQI scoring criteria, quality gates and assessment interpretation |
| [`references/core-standards.md`](shared/references/core-standards.md) | Filename conventions, heading rules and document-type requirements |
| [`sk-create-quality-control/references/workflows.md`](sk-create-quality-control/references/workflows.md) | Execution workflows by mode and task type |
| [`sk-create-quality-control/references/optimization.md`](sk-create-quality-control/references/optimization.md) | AI-friendly content transforms and the llms.txt format |
| [`references/evergreen-packet-id-rule.md`](shared/references/evergreen-packet-id-rule.md) | Why runtime-state docs must not cite mutable spec-packet numbers |
| [`references/skill-creation.md`](sk-create-skill/references/README.md) | The skill-creation workflow: understanding through packaging |
| [`references/README.md`](sk-create-agent/references/README.md) | Agent authority, permissions and the template-first workflow |
| [`references/README.md`](sk-create-readme/references/README.md) | README creation workflow and standards |
| [`references/install-guide/quality-and-standards.md`](sk-create-readme/references/install-guide/quality-and-standards.md) | Five-phase install guide standards and validation checkpoints |
| [`references/README.md`](sk-create-manual-testing-playbook/references/README.md) | Playbook package structure, scenario tables and cross-reference index |
| [`references/README.md`](sk-create-feature-catalog/references/README.md) | Feature catalog inventory standards and per-feature file structure |
| [`sk-create-benchmark/README.md`](sk-create-benchmark/README.md) | Benchmark family registry, including conformance authoring triggers and package boundaries |
| [`sk-create-diff/README.md`](sk-create-diff/README.md) | Git-free before/after document diff: snapshot lifecycle, comparison engine and the self-contained HTML report |
| [`sk-create-diff/references/workflow.md`](sk-create-diff/references/workflow.md) | The sk-create-diff capture/compare workflow and CLI reference |
| [`scripts/validate_document.py`](./scripts/validate_document.py) | Fast format validator, exit 0/1/2, supports `--json` and `--fix` |
| [`scripts/extract_structure.py`](./scripts/extract_structure.py) | Full DQI analysis with type-specific checklists and JSON output |
| [`scripts/init_skill.py`](./scripts/init_skill.py) | Skill directory scaffold from the template set |
| [`scripts/package_skill.py`](./scripts/package_skill.py) | Validate and package a skill to a zip file |
| [`assets/skill/`](./sk-create-skill/assets/skill/) | SKILL.md, README, reference and asset templates for skill creation |
| [`assets/flowcharts/`](./sk-create-flowchart/assets/) | Reusable ASCII flowchart patterns for workflows and decision trees |
| [`changelog/`](./changelog/) | Per-release entries, one file per version |
