Now let me read the latest changelog and a few key reference files to verify specific claims:
## 1. PURPOSE

sk-doc is the unified markdown and OpenCode component specialist: it enforces document quality (structure, DQI scoring, content optimization), scaffolds OpenCode components (skills, agents, commands), creates ASCII flowcharts, install guides, feature catalogs, manual testing playbooks, and skill-local benchmark folders, using a "structure first, then content, then quality" pipeline where deterministic Python scripts extract metrics and the AI applies quality judgment and recommendations.

## 2. PROBLEM

Markdown documentation degrades silently because writers lack automated enforcement: READMEs drift from templates, headings lose consistent numbering, banned words creep in, and AI-authored text carries telltale patterns (em dashes, semicolons, overused buzzwords) that erode reader trust. OpenCode component creation (skills, agents, commands) also lacks a single disciplined scaffold-to-package workflow, so new components vary wildly in structure, missing required sections, malformed YAML frontmatter, or ambiguous permission declarations. A script-assisted AI pipeline fixes both problems: deterministic scripts (`extract_structure.py`, `validate_document.py`, `package_skill.py`) supply objective parsing, metrics, and hard gates, while the AI interprets those results to generate content- and style-level recommendations. Document-type detection then applies the right enforcement level (strict for SKILL/Command docs, flexible for READMEs, moderate for knowledge docs, loose for spec files) so rigidity matches risk.

## 3. MODES & CAPABILITIES

- **Document Quality** — `extract_structure.py` outputs a JSON structural snapshot plus DQI score (0–100 across Structure 40 / Content 30 / Style 30), checklist pass/fail, and violations; the AI reads that output, detects document type, applies the appropriate enforcement level, and produces ranked recommendations with safe auto-fixes (H2 case, separators, filenames) while escalating critical violations (missing frontmatter, wrong section order).
- **Component Creation (skills/agents/commands)** — `init_skill.py` scaffolds a skill directory with SKILL.md, README.md, references/, assets/, and a resilient smart-router skeleton; `package_skill.py` validates structure, frontmatter, word count (<5k for SKILL.md) and packages a zip; agents use `agent_template.md` with explicit true/false tool permissions; commands use `command_template.md` with discoverable trigger phrases.
- **Flowchart Creation** — six ASCII flowchart patterns (`assets/flowcharts/`) covering linear sequential, decision branch, parallel execution, nested sub-workflows, approval gate/loop, and multi-stage pipeline; `validate_flowchart.sh` checks alignment, box styles, labeled branches, and entry/exit paths.
- **Install Guide Creation** — five-phase template (Overview → Prerequisites → Installation → Configuration → Verification) with per-phase validation checkpoints and an AI-first install prompt at the top; template at `assets/readme/install_guide_template.md`.
- **Manual Testing Playbook Creation** — nine-column scenario tables with deterministic prompts, Feature IDs (PREFIX-NNN format), evidence requirements; root `manual_testing_playbook.md` with numbered category folders holding one per-feature file per Feature ID; template at `assets/testing_playbook/manual_testing_playbook_template.md`.
- **Feature Catalog Creation** — rooted `FEATURE_CATALOG.md` with numbered category sections and per-feature files with source-file anchors and stable slugs; template at `assets/feature_catalog/feature_catalog_template.md`.
- **Benchmark Folder Creation** — scaffolds `mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/` folders with `benchmark_report.md` (ten-section curated narrative), `SOURCE.md` (wayfinding pointer), `results.csv`, `*.jsonl`, and optional sidecars; templates at `assets/benchmark/`.
- **Core principle** — "structure first, then content, then quality" with hard split: scripts handle deterministic parsing and metrics, AI handles qualitative judgment and recommendations.
- **DQI score** — composite 0–100 across Structure (40 pts), Content (30 pts), Style (30 pts); bands: Excellent (90–100), Good (75–89), Acceptable (60–74), Needs Work (<60).
- **Document-type-aware enforcement** — Strict (SKILL.md, Command: no structural checklist failures), Flexible (README: usability focus), Moderate (Knowledge: no frontmatter, numbered H2s), Loose (Spec: working docs, avoid blocking on violations).
- **HVR (Human Voice Rules)** — mandatory style enforcement across all output; banned words (leverage, robust, seamless, utilize, delve, etc.), no em dashes, no semicolons, no Oxford commas, active voice; violations reduce the Style DQI component; full ruleset at `references/global/hvr_rules.md`.

## 4. INVOCATION

The skill is invoked through three paths:

- **`/create:*` commands** — the command family (`/create:skill`, `/create:agent`, `/create:command`, `/create:changelog`, `/create:readme`, etc.) is routed to sk-doc via Gate 2 (Skill Advisor). SKILL.md §1 references `/create:changelog` explicitly; the broader family is surface-stable per the v1.5.0.0 changelog.
- **`@markdown` agent** — the LEAF write-capable agent loads sk-doc on every invocation for template-first markdown/documentation execution; it handles `/create:*` commands, orchestrator-scoped spec-doc authoring, and any explicitly scoped markdown write with a resolved output path.
- **Direct script runs** — the six core Python/shell scripts are runnable from the repository root:
  - `python3 .opencode/skills/sk-doc/scripts/extract_structure.py <file.md>` → JSON report with DQI score, checklist, violations, document type, quality band.
  - `python3 .opencode/skills/sk-doc/scripts/validate_document.py <README.md>` → exit 0 for valid, exit 1 for blocking errors, exit 2 for parse errors.
  - `python3 .opencode/skills/sk-doc/scripts/init_skill.py <name> --path .opencode/skills` → scaffolds a complete skill directory with SKILL.md stub, README.md, references/, assets/, graph-metadata.json, and the smart-router skeleton.
  - `python3 .opencode/skills/sk-doc/scripts/package_skill.py <skill-dir>` → validates structure, frontmatter, word count, required sections, and produces a distributable zip.
  - `python3 .opencode/skills/sk-doc/scripts/quick_validate.py <skill-dir> --json` → fast pre-packaging validation checks.
  - `bash .opencode/skills/sk-doc/scripts/validate_flowchart.sh <flowchart.md>` → checks ASCII alignment, box styles, labeled decisions, entry/exit path completeness.

Two additional scripts exist in the directory (`audit_readmes.py` for batch README auditing and `validate-doc-model-refs.js` for doc-model reference validation) but are not called out in SKILL.md §5's script list.

## 5. KEY FILES

| Path | Purpose |
|---|---|
| `SKILL.md` | Entry point with full routing pseudocode, six-mode operation rules, and all intent signals |
| `README.md` | Human-facing overview, quick start, feature tables, troubleshooting, FAQ |
| `graph-metadata.json` | Machine-readable skill graph metadata (edges, intents, derived stats) |
| `references/global/quick_reference.md` | One-page command and gate cheat sheet (loaded ALWAYS) |
| `references/global/core_standards.md` | Filename conventions, structure rules |
| `references/global/hvr_rules.md` | Complete Human Voice Rules: banned words, punctuation, voice directives, scoring |
| `references/global/validation.md` | DQI scoring criteria, quality gates, document-type thresholds |
| `references/global/workflows.md` | Execution workflows by document mode |
| `references/global/optimization.md` | AI-friendly content transforms, llms.txt generation guidance |
| `references/global/evergreen_packet_id_rule.md` | Rule forbidding mutable spec/phase packet numbers in runtime docs |
| `references/skill_creation.md` | Six-step skill creation workflow with progressive disclosure |
| `references/agent_creation.md` | Agent authority, permissions, and creation workflow |
| `references/readme_creation.md` | README creation workflow |
| `references/install_guide_creation.md` | Install guide five-phase standards and workflow |
| `references/feature_catalog_creation.md` | Feature catalog package standards and workflow |
| `references/manual_testing_playbook_creation.md` | Manual testing playbook package standards and workflow |
| `references/benchmark_creation.md` | Benchmark folder ten-section format, promotion rules, workflow |
| `assets/readme/readme_template.md` | README structure scaffold with HVR rules embedded |
| `assets/readme/readme_code_template.md` | README scaffold for code repos/projects |
| `assets/readme/install_guide_template.md` | Five-phase install guide template |
| `assets/skill/skill_md_template.md` | Canonical SKILL.md template |
| `assets/skill/skill_readme_template.md` | Template for skill README.md (human-facing overview) |
| `assets/skill/skill_reference_template.md` | Template for reference file under references/ |
| `assets/skill/skill_asset_template.md` | Template for asset file under assets/ |
| `assets/skill/skill_smart_router.md` | Resilient smart-router skeleton injected into new skills |
| `assets/agent_template.md` | Agent creation template (YAML frontmatter, CORE WORKFLOW, ANTI-PATTERNS) |
| `assets/command_template.md` | Command creation template (name, description, triggers, execution) |
| `assets/frontmatter_templates.md` | Frontmatter validation for 11 document types |
| `assets/llmstxt_templates.md` | Templates for llms.txt generation |
| `assets/changelog_template.md` | Global changelog and GitHub release notes template |
| `assets/template_rules.json` | JSON rules governing required/advisory/skipped checklist items per document type |
| `assets/feature_catalog/feature_catalog_template.md` | Feature catalog root document template |
| `assets/feature_catalog/feature_catalog_snippet_template.md` | Per-feature catalog file template |
| `assets/testing_playbook/manual_testing_playbook_template.md` | Playbook root document template |
| `assets/testing_playbook/manual_testing_playbook_snippet_template.md` | Per-feature playbook scenario file template |
| `assets/flowcharts/simple_workflow.md` | Pattern 1: linear sequential flow |
| `assets/flowcharts/decision_tree_flow.md` | Pattern 2: decision branch flow |
| `assets/flowcharts/parallel_execution.md` | Pattern 3: parallel execution flow |
| `assets/flowcharts/user_onboarding.md` | Pattern 4: nested sub-workflow flow |
| `assets/flowcharts/approval_workflow_loops.md` | Patterns 5 & 6: approval gate and loop/iteration flows |
| `assets/flowcharts/system_architecture_swimlane.md` | Pattern 7: multi-stage pipeline/swimlane flow |
| `assets/benchmark/benchmark_report_template.md` | Ten-section curated benchmark report scaffold |
| `assets/benchmark/source_template.md` | SOURCE.md wayfinding pointer scaffold |
| `scripts/extract_structure.py` | Parses markdown to JSON: frontmatter, headings, checklist, DQI score, document type |
| `scripts/validate_document.py` | README format validator: TOC, anchors, H2 emojis, required sections (exit 0/1/2) |
| `scripts/init_skill.py` | Scaffolds a new skill directory with all required subdirectories and template stubs |
| `scripts/package_skill.py` | Validates and packages a skill into a distributable zip |
| `scripts/quick_validate.py` | Fast pre-packaging validation checks (exit code + optional JSON) |
| `scripts/validate_flowchart.sh` | ASCII flowchart alignment, box style, and branch-label checker |
| `scripts/audit_readmes.py` | Batch README audit across multiple directories |
| `scripts/validate-doc-model-refs.js` | Validates document model references |
| `scripts/tests/` | Test fixtures and regression tests for extract_structure, validate_document, package_skill, quick_validate, flowchart validator, and changelog validator |
| `changelog/` | Versioned changelogs: v1.5.0.0.md, v1.6.0.0.md, v1.7.0.0.md |
| `manual_testing_playbook/` | Sk-doc's own manual testing playbook with 6 category folders (01–06) |

## 6. BOUNDARIES

- **Code**: sk-doc does NOT handle source-code quality, coding standards, surface detection, or code verification. Those belong to `sk-code` (`.opencode/skills/sk-code/`).
- **Spec-folder docs and validation**: sk-doc does NOT manage spec-folder lifecycle (creating `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`), nor does it run `validate.sh --strict` on spec folders. That belongs to `system-spec-kit` (`.opencode/skills/system-spec-kit/`). sk-doc explicitly states it "must not write inside spec folders" (per README FAQ). Its own integration point with spec-kit is treating canned spec docs as canonical continuity surfaces during `/speckit:resume`.
- **Markdown only**: sk-doc handles only `.md` files. Non-markdown files (code, JSON configs, binaries, API docs) are explicitly excluded in the "When NOT to Use" section.
- **Git workflows**: sk-doc does NOT own commit, branch, PR, merge, or worktree management. That belongs to `sk-git` (`.opencode/skills/sk-git/SKILL.md`), though sk-doc may assist with commit/PR text quality.
- **Changelog scope**: Global component changelogs at `.opencode/changelog/{NN--component}/` use sk-doc's `changelog_template.md`. Nested packet-local changelogs use system-spec-kit templates instead.

## 7. TROUBLESHOOTING & FAQ MATERIAL

**Common failure modes:**

1. **DQI score below 60** — Caused by missing required sections, absent frontmatter on strict document types, low word count, missing H2 emojis/numbers, or multiple HVR violations. Fix in priority order: frontmatter and section order first, then missing sections, then content density, then style issues. Re-run `extract_structure.py` after each batch.
2. **`validate_document.py` exit code 1** — Blocking errors: H2 headers missing emojis, required sections absent, or non-sequential section numbering. Read error output line by line; ensure every H2 has the correct emoji and sections are numbered sequentially (1, 2, 3).
3. **`package_skill.py` failure** — SKILL.md exceeds 5,000 words, a required section is missing (WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES), frontmatter is malformed, or expected subdirectories are absent. Run `extract_structure.py` on SKILL.md first and move overflow content to `references/` files.
4. **HVR violations in DQI output** — Style score lowered by banned words (robust, seamless, utilize, delve, etc.), em dashes, semicolons, or passive voice. Read `references/global/hvr_rules.md` for the complete banned list; search document for each violation pattern and rewrite.

**Gotchas:**

- **Document-type detection is automatic but must be correct** — a misidentified document type applies the wrong enforcement level (e.g., a SKILL.md flagged as Generic gets flexible enforcement instead of strict). Check the `"documentType"` field in `extract_structure.py` JSON output.
- **`validate_document.py` ≠ `extract_structure.py`** — the former is a fast README-only format gate (exit 0/1); the latter is the full DQI analysis tool for any document type with a three-component score and checklist. Do not substitute one for the other.
- **Mode 4 (Install Guide) has no dedicated Mode N heading in SKILL.md §3** — the HOW IT WORKS section jumps from Mode 3 to Mode 5, but the install guide use case and five-phase process are fully defined in §1 and the `references/install_guide_creation.md` reference.

**Users actually ask:**

1. When should I use sk-doc versus system-spec-kit? — sk-doc for markdown quality, READMEs, install guides, catalogs, playbooks, flowcharts, and component scaffolding. system-spec-kit for spec-folder lifecycle (spec.md, plan.md, tasks.md). They do not overlap.
2. What is the difference between `validate_document.py` and `extract_structure.py`? — `validate_document.py` is a fast README-only format gate; `extract_structure.py` is the full DQI analysis tool for any document type.
3. What is the difference between a Feature Catalog and a Manual Testing Playbook? — Catalog documents current behavior (what the skill can do). Playbook defines how to test that behavior manually (deterministic prompts, expected signals, evidence requirements). Build catalog first, then use it as the source of truth for playbook scenarios.

## 8. STALE FACTS

The following items in the current `README.md` are inaccurate versus the real files and `SKILL.md`:

1. **Version** — README §1 says "The skill runs version 1.6.0.0"; `SKILL.md` frontmatter says `version: 1.5.0.0`; the latest changelog entry is `changelog/v1.7.0.0.md`. The correct current version is **1.7.0.0** — both `SKILL.md` and `README.md` are stale.

2. **Script count** — README §1 says "six automation scripts"; the actual `scripts/` directory contains **8** executable/script files (`audit_readmes.py`, `extract_structure.py`, `init_skill.py`, `package_skill.py`, `quick_validate.py`, `validate_document.py`, `validate_flowchart.sh`, `validate-doc-model-refs.js`). `SKILL.md` §5 lists only 6 scripts (omitting `audit_readmes.py` and `validate-doc-model-refs.js`). Count in README should be **eight** (or seven if counting only the Python/shell scripts called out in `SKILL.md` §5, but "six" is wrong either way).

3. **Reference file count** — README §1 says "thirteen reference files (six global and seven creation guides)"; the actual counts are **7 global** files (`references/global/`) and **7 creation guides** (`references/` root) = **14 total**, not 13.

4. **Flowchart pattern count** — README §1 says "seven core patterns" and §3 shows a 7-row patterns table; `assets/flowcharts/` contains **6 files** (`approval_workflow_loops.md` covers two patterns). The statement "seven core patterns" is conceptually debatable (6 files, 7 labeled patterns) but "seven" is structurally inaccurate relative to file count.

5. **Skill template count in structure tree** — README §4 STRUCTURE tree lists only 3 files under `assets/skill/`: `skill_md_template.md`, `skill_reference_template.md`, `skill_asset_template.md`. The actual directory contains **5 files**, omitting `skill_readme_template.md` and `skill_smart_router.md`.

6. **Missing directories in structure tree** — README §4 STRUCTURE tree omits: (a) `assets/testing_playbook/` subdirectory and its two template files, (b) `scripts/tests/` subdirectory, (c) `manual_testing_playbook/` at the skill root, (d) `changelog/` at the skill root, (e) `assets/feature_catalog/feature_catalog_snippet_template.md` (only the root template is shown).