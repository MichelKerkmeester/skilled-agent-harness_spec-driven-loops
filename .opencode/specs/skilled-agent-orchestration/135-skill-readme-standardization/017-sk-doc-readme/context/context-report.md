# Context Report: sk-doc README rewrite

Two-iteration by-model sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only). Both iterations converge with cited file:line evidence on the use cases, the structure-first principle, the scripts-versus-AI split, the DQI score and the document-type enforcement. Both flag the same heavy count drift in the current README (version, script count, reference count, flowchart count, template count). This is the doc-standards skill itself, so its README should be exemplary.

---

## 1. PURPOSE

`sk-doc` is the documentation and OpenCode-component specialist. It enforces markdown structure, scores and optimizes content, scaffolds and packages components (skills, agents, commands), and builds flowcharts, install guides, manual testing playbooks, feature catalogs and benchmark folders, with deterministic scripts handling the metrics and the AI handling the quality judgment.

## 2. PROBLEM

Documentation drifts without a standard. Section order wanders, frontmatter goes missing, the voice slides into filler, and one author's README looks nothing like the next, so a reader re-learns the layout every time and an AI assistant cannot parse the structure reliably. Hand-checking every doc against a style guide does not scale and misses things. This skill makes structure the first gate: a deterministic script extracts the document, scores it and lists violations, then the AI judges quality and rewrites, so every doc of a given type comes out the same shape and passes the same bar.

## 3. MODES & CAPABILITIES

- Document quality: structure enforcement, content optimization, frontmatter validation, llms.txt generation, all scored by a Documentation Quality Index.
- Component creation: scaffold, validate and package skills, agents and commands.
- Flowcharts: ASCII workflow, decision-tree, parallel, swimlane and approval-loop patterns.
- Install guides: a five-phase setup-doc structure with validation checkpoints.
- Testing packages: manual testing playbooks and feature catalogs with per-feature files.
- Benchmark folders: skill-local benchmark reports promoted from a spec packet.
- The core principle is structure first, then content, then quality. Scripts handle deterministic parsing and metrics; the AI handles quality judgment and recommendations.

## 4. THE DQI AND DOCUMENT-TYPE ENFORCEMENT (verified)

The Documentation Quality Index scores a document out of 100: structure 40 points, content 30 points, style 30 points, in four bands (Excellent 90 and up, Good 75 to 89, Acceptable 60 to 74, Needs Work below 60) (`SKILL.md`, `references/global/validation.md`). Enforcement is document-type-aware (`SKILL.md:355`): SKILL and command docs are strict (frontmatter required, blocks on violations), README docs are usability-focused with safe auto-fixes only, knowledge docs are moderately strict, and active spec docs are loose unless the task asks for enforcement.

## 5. INVOCATION (verified)

The skill is reached through the `/create:*` commands (`/create:agent`, `/create:sk-skill`, `/create:feature-catalog`, `/create:testing-playbook`, `/create:folder_readme`, `/create:changelog`) and the `@markdown` agent, a LEAF write-capable documentation executor that authors template-first. The core scripts under `scripts/`:

- `validate_document.py <file> --type <type>`: fast format validation, exit 0 valid, 1 blocking errors, 2 not-found. Supports `--json`, `--fix` and `--blocking-only`.
- `extract_structure.py <file>`: parses any markdown to JSON with the DQI score, the checklist, the violations and the detected document type.
- `init_skill.py <name>`: scaffolds a new skill directory from the templates.
- `package_skill.py <path>`: validates and packages a skill to a zip (`--check` validates only); the SKILL.md word ceiling is 5000 with a 3000 recommendation.
- `quick_validate.py <path>`: fast frontmatter and naming checks for a skill.
- `validate_flowchart.sh <file>`: box-alignment, arrow and label checks for ASCII flowcharts.

## 6. KEY FILES (real, host-verified)

| Path | Role |
|------|------|
| `SKILL.md` | The smart router, the use cases, the mode rules and the document-type gates |
| `references/global/hvr_rules.md` | The Human Voice Rules ruleset |
| `references/global/validation.md` | The DQI scoring criteria and validation gates |
| `references/global/core_standards.md` | Filename conventions and document-type rules |
| `references/global/optimization.md` | Content optimization patterns |
| `references/global/workflows.md` | The doc-quality execution modes |
| `references/skill_creation.md` | The skill-creation workflow |
| `references/readme_creation.md` | The README creation workflow |
| `references/agent_creation.md` | The agent creation workflow |
| `references/install_guide_creation.md` | The install-guide workflow |
| `references/manual_testing_playbook_creation.md` | The playbook workflow |
| `references/feature_catalog_creation.md` | The feature-catalog workflow |
| `references/benchmark_creation.md` | The benchmark-folder workflow |
| `assets/skill/` | The SKILL.md, skill README, reference and asset templates plus the smart-router pattern |
| `assets/readme/` | The README and install-guide scaffolds |
| `assets/flowcharts/` | The reusable flowchart patterns |
| `assets/feature_catalog/`, `assets/testing_playbook/`, `assets/benchmark/` | The catalog, playbook and benchmark package templates |
| `assets/changelog_template.md`, `assets/frontmatter_templates.md`, `assets/llmstxt_templates.md` | The cross-cutting templates |
| `scripts/validate_document.py`, `extract_structure.py`, `init_skill.py`, `package_skill.py`, `quick_validate.py`, `validate_flowchart.sh` | The deterministic pipeline scripts |

## 7. BOUNDARIES

sk-doc owns markdown and component scaffolds. It does not own code (`sk-code`, the surface-aware code skill) or the spec-folder lifecycle and its validation (`system-spec-kit`). It handles only markdown files. A code change routes to sk-code; a spec-folder save routes to system-spec-kit. sk-doc and system-spec-kit do not overlap, even though both touch markdown, because sk-doc judges document quality and system-spec-kit owns the spec packet contract.

## 8. TROUBLESHOOTING & FAQ MATERIAL

- DQI below 60: fix in priority order, structure and section order first, then missing sections, then content density, then style. Re-run after each batch.
- `validate_document.py` exits 1: a blocking format issue (missing section, non-sequential numbering, a missing required H2). Read the message and fix.
- `package_skill.py` fails: the SKILL.md is over the word ceiling, or a required section, the frontmatter or a subdirectory is missing.
- Wrong document type detected: the file location or shape misled detection. Check the detected type in the JSON output.
- FAQ: how sk-doc differs from system-spec-kit, when to use `validate_document.py` versus `extract_structure.py`, the difference between a feature catalog and a manual testing playbook, and which `/create:*` command to use.

## 9. STALE FACTS

The current README is heavily count-stale. The narrative template drops version lines and brittle counts, so they resolve on rewrite:

- Version: the README says 1.6.0.0, SKILL.md says 1.5.0.0, and the newest changelog is 1.7.0.0. Drop the version line.
- Script count: the README says six scripts, there are eight (the six core plus `audit_readmes.py` and `validate-doc-model-refs.js`). Do not pin a count.
- Reference count: the README says thirteen (six global, seven creation), there are fourteen (seven global, seven creation). Do not pin a count.
- Flowchart count: the README says seven patterns, there are six files (approval and loop share one file). Do not pin a count.
- Skill template count: the README lists three under `assets/skill/`, there are five. Do not pin a count.
- The structure tree omits several real files and folders. The narrative RELATED DOCUMENTS lists the families, not an exhaustive tree.

## 10. METHODOLOGY

Two iterations, by-model-shared-scope (DeepSeek + MiMo, read-only). Iteration 1 gathered purpose, the use cases and the pipeline; iteration 2 verified the scripts, the DQI, the enforcement levels and the stale facts, each cited to a file and line. Both models found the same heavy count drift and agreed on the DQI bands and the command set. Converged before the three-iteration ceiling.
