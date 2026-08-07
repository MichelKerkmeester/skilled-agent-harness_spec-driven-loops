Now let me verify a couple more details. The README references `assets/skill/skill_readme_template.md` — let me confirm it exists and check the scripts `tests/` directory.
1. PURPOSE

sk-doc is the unified markdown and OpenCode component specialist that enforces document structure and quality, scaffolds skills/agents/commands, creates ASCII flowcharts, install guides, feature catalogs, manual testing playbooks, and skill-local benchmark folders.

2. PROBLEM

Without enforcement, markdown documentation drifts in structure, heading order, frontmatter completeness, and voice consistency — every author reinvents section layout and quality bar. A structure-first pipeline with deterministic scripts (parsing, DQI scoring, checklist extraction) plus AI judgment (quality recommendations, content optimization) fixes this by making the quality bar machine-readable and the remediation path explicit. The scripts catch what is objective (missing sections, wrong heading order, frontmatter syntax); the AI handles what requires judgment (content density, readability, HVR rewriting).

3. MODES & CAPABILITIES

- **Document Quality**: structure enforcement via `extract_structure.py`, DQI scoring (Structure 40 + Content 30 + Style 30 = 100), checklist pass/fail/skip, document-type-aware enforcement levels (Strict for SKILL/Command, Flexible for README, Moderate for Knowledge, Loose for Spec), safe auto-fixes (H2 case, separators, filename), critical violations escalated to human.
- **Component Creation**: skill lifecycle (6-step: understand → plan → scaffold via `init_skill.py` → populate → package via `package_skill.py` → iterate), agent creation (template-first with explicit true/false tool permissions), command creation (frontmatter + trigger + registry wiring).
- **Flowchart Creation**: 6 ASCII patterns in `assets/flowcharts/` (linear, decision branch, parallel, nested, approval gate/loop, pipeline/swimlane); validated by `validate_flowchart.sh`.
- **Install Guide Creation**: 5-phase template (Prerequisites → Installation → Configuration → Verification → Troubleshooting) with per-phase validation checkpoints.
- **Manual Testing Playbook Creation**: 9-column scenario tables, deterministic prompts, Feature IDs (PREFIX-NNN), Evidence Requirements, root playbook plus numbered category folders with per-feature files.
- **Feature Catalog Creation**: rooted `FEATURE_CATALOG.md` inventory with numbered category folders and per-feature files with source-file anchors and stable slugs.
- **Benchmark Folder Creation**: skill-local `mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/` folders with ten-section `benchmark_report.md`, `SOURCE.md` wayfinding pointer, `results.csv`, optional `*.jsonl` and sidecars.
- **Structure-first principle**: structure first, then content, then quality.
- **Scripts-vs-AI split**: scripts handle deterministic parsing/metrics; AI handles quality judgment and recommendations.

4. INVOCATION

- **Trigger paths**: Gate 2 skill advisor routing on documentation intent; `@markdown` agent dispatch; `/create:*` slash commands (e.g., `/create:changelog`); direct script runs from repo root.
- **Key scripts**:
  - `scripts/extract_structure.py <file.md>` — parses any markdown to JSON: frontmatter, heading structure, DQI score (0–100 with three components), checklist pass/fail/skip, violations, quality band.
  - `scripts/validate_document.py <README.md>` — fast README format validator: TOC, anchor format, H2 emoji rules, required sections. Exit 0 = pass, 1 = blocking errors, 2 = file/parse error.
  - `scripts/init_skill.py <name> --path <dir>` — scaffolds a new skill directory with SKILL.md skeleton, references/, assets/ subdirs.
  - `scripts/package_skill.py <skill-dir>` — validates (word count < 5000, required sections present, frontmatter valid) and packages to zip.
  - `scripts/quick_validate.py <dir> [--json]` — fast validation checks during editing.
  - `scripts/validate_flowchart.sh` — checks ASCII flowchart alignment, box style consistency, labeled decisions, entry/exit paths.
  - `scripts/audit_readmes.py` — batch README audit across directories.
  - `scripts/validate-doc-model-refs.js` — detects markdown drift where docs cite non-canonical model names as defaults.

5. KEY FILES

| Path | Purpose |
|---|---|
| `SKILL.md` | Entry point: routing logic, smart router pseudocode, mode rules, 466 lines |
| `README.md` | Human-facing documentation: overview, quick start, features, structure tree, config, examples, troubleshooting, FAQ |
| `graph-metadata.json` | Skill graph metadata: family `sk-util`, category `utility`, edges, intent signals |
| `references/global/quick_reference.md` | One-page command and gate cheat sheet |
| `references/global/core_standards.md` | Filename conventions, structure rules |
| `references/global/hvr_rules.md` | Human Voice Rules: banned words, punctuation bans, active voice enforcement |
| `references/global/validation.md` | DQI scoring criteria and blocking rules |
| `references/global/optimization.md` | AI-friendly content transforms |
| `references/global/workflows.md` | Execution workflows by task type |
| `references/global/evergreen_packet_id_rule.md` | Rule preventing evergreen docs from citing mutable packet numbers |
| `references/skill_creation.md` | 6-step skill creation workflow |
| `references/agent_creation.md` | Agent authority, permissions, creation workflow |
| `references/readme_creation.md` | README creation workflow |
| `references/install_guide_creation.md` | Install guide standards and workflow |
| `references/feature_catalog_creation.md` | Feature catalog standards and workflow |
| `references/manual_testing_playbook_creation.md` | Playbook standards and workflow |
| `references/benchmark_creation.md` | Benchmark folder standards and promotion workflow |
| `assets/readme/readme_template.md` | README structure with HVR rules |
| `assets/readme/readme_code_template.md` | README for code repos/projects |
| `assets/readme/install_guide_template.md` | 5-phase install guide template |
| `assets/skill/skill_md_template.md` | Canonical SKILL.md template |
| `assets/skill/skill_readme_template.md` | Human-facing skill README template |
| `assets/skill/skill_reference_template.md` | Reference file template |
| `assets/skill/skill_asset_template.md` | Asset file template |
| `assets/skill/skill_smart_router.md` | Resilient smart-router skeleton for new skills |
| `assets/agent_template.md` | Agent creation template |
| `assets/command_template.md` | Command creation template |
| `assets/changelog_template.md` | Global changelog and GitHub release notes template |
| `assets/frontmatter_templates.md` | Frontmatter validation templates (11 types) |
| `assets/llmstxt_templates.md` | llms.txt generation templates |
| `assets/template_rules.json` | Machine-readable template enforcement rules (version 1.2.0, 613 lines) |
| `assets/flowcharts/` | 6 ASCII flowchart pattern files (simple_workflow, decision_tree_flow, parallel_execution, user_onboarding, approval_workflow_loops, system_architecture_swimlane) |
| `assets/benchmark/benchmark_report_template.md` | Ten-section curated report scaffold |
| `assets/benchmark/source_template.md` | SOURCE.md wayfinding pointer scaffold |
| `assets/feature_catalog/feature_catalog_template.md` | Feature catalog root template |
| `assets/feature_catalog/feature_catalog_snippet_template.md` | Per-feature snippet template |
| `assets/testing_playbook/manual_testing_playbook_template.md` | Playbook root template |
| `assets/testing_playbook/manual_testing_playbook_snippet_template.md` | Per-feature playbook snippet template |
| `scripts/extract_structure.py` | Parse markdown to JSON + DQI score |
| `scripts/validate_document.py` | README format validation (exit 0/1/2) |
| `scripts/init_skill.py` | Scaffold new skill directory |
| `scripts/package_skill.py` | Validate + package skill to zip |
| `scripts/quick_validate.py` | Fast validation checks |
| `scripts/validate_flowchart.sh` | Flowchart alignment and style check |
| `scripts/audit_readmes.py` | Batch README audit across directories |
| `scripts/validate-doc-model-refs.js` | Doc-model reference drift detector |
| `scripts/tests/` | 7 test files + 6 fixture markdown files + 2 subdirs |
| `manual_testing_playbook/` | sk-doc's own playbook: root `.md` + 6 numbered category folders |
| `changelog/` | Skill changelog: v1.5.0.0, v1.6.0.0, v1.7.0.0 |

6. BOUNDARIES

- **Code** (`sk-code`): sk-doc does not handle application code, coding standards, or code verification. That is `sk-code`'s domain.
- **Spec-folder docs and validation** (`system-spec-kit`): sk-doc does not write inside spec folders or manage spec folder lifecycle (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, decision-record.md). That is `system-spec-kit`'s domain. The two skills do not overlap; sk-doc enhances `system-spec-kit` for doc creation quality (graph-metadata edge: `enhances` weight 0.5).
- **Markdown only**: sk-doc only operates on `.md` files. Non-markdown files, auto-generated API docs, and simple typo fixes are out of scope.
- **Git workflows** (`sk-git`): commit/PR text and git workflow orchestration belong to `sk-git`.
- **`@markdown` agent**: is a leaf agent that dispatches sk-doc for scoped markdown writing tasks; it is not a separate skill.

7. TROUBLESHOOTING & FAQ MATERIAL

**Common failure modes:**
- DQI score below 60: missing required sections, no frontmatter on SKILL/Command files, low word count, no code examples, H2 headers missing emoji/numbers, multiple HVR violations. Fix: review `checklist` array in JSON output, address in priority order (frontmatter → sections → content density → style).
- `validate_document.py` exits 1: H2 headers missing emojis, required sections absent, non-sequential section numbering. Fix: read error output, correct each issue, re-run.
- `package_skill.py` fails: SKILL.md exceeds 5,000 words, required section missing (WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES), frontmatter malformed, missing subdirectories. Fix: run `extract_structure.py` first, move deep content to references/.
- HVR violations in DQI output: banned words (robust, seamless, utilize, delve, cutting-edge, etc.), em dashes, semicolons, passive voice. Fix: read `references/global/hvr_rules.md`, search and rewrite.
- Document-type detection: the type is auto-detected and drives enforcement level; mis-detection causes wrong enforcement. If unclear, escalate.
- `validate_document.py` vs `extract_structure.py`: they serve different purposes — `validate_document.py` is a fast README-only format gate; `extract_structure.py` is the full DQI analysis tool for any markdown type.

**FAQ (2–4 questions users actually ask):**
1. When should I use sk-doc vs system-spec-kit? — sk-doc for markdown quality, document creation, component scaffolding; system-spec-kit for spec folder lifecycle. No overlap.
2. Does `validate_document.py` check everything `extract_structure.py` checks? — No. `validate_document.py` is a fast README format validator (TOC, anchors, H2 emojis, sections). `extract_structure.py` is the full DQI analysis (three-component scores, checklist, violations, quality band).
3. What is the difference between a Feature Catalog and a Manual Testing Playbook? — Catalog documents current behavior (what it can do); playbook defines how to test it (deterministic prompts, evidence, triage). Build catalog first, then playbook links back via Cross-Reference Index.
4. How do I scaffold and package a new skill? — `init_skill.py` to scaffold, populate templates, `quick_validate.py` during editing, `package_skill.py` for final validation, `extract_structure.py` for DQI check on SKILL.md.

8. STALE FACTS

- **Version**: README states "version 1.6.0.0" in Key Statistics. SKILL.md frontmatter says `version: 1.5.0.0`. The `changelog/` folder contains v1.5.0.0, v1.6.0.0, and v1.7.0.0. The current SKILL.md version field is stale relative to the changelog.
- **Flowchart count**: README claims "7 flowchart patterns" and "7 core patterns." `assets/flowcharts/` contains exactly 6 files. SKILL.md does not claim 7. The README count is wrong.
- **Reference file count**: README claims "thirteen reference files (six global and seven creation guides)." Actual count: 7 global files in `references/global/` (core_standards, evergreen_packet_id_rule, hvr_rules, optimization, quick_reference, validation, workflows) and 7 creation guides in `references/` root (agent_creation, benchmark_creation, feature_catalog_creation, install_guide_creation, manual_testing_playbook_creation, readme_creation, skill_creation) = 14 total. The "six global" count is wrong (it is 7); the "thirteen" total is wrong (it is 14).
- **Script count**: README claims "six automation scripts" in Key Statistics and lists 7 in the structure tree (extract_structure, validate_document, init_skill, package_skill, quick_validate, validate_flowchart, audit_readmes). The actual directory contains 10 entries including `validate-doc-model-refs.js` (a Node script) and `README.md` plus `tests/`. The "six scripts" claim is wrong; there are 8 scripts (7 Python/shell + 1 JS) or 7 if counting only the ones listed in SKILL.md.
- **SKILL.md script list**: SKILL.md §5 and §8 list 6 scripts (extract_structure, validate_document, init_skill, package_skill, quick_validate, validate_flowchart). It omits `audit_readmes.py` and `validate-doc-model-refs.js`. The README structure tree omits `validate-doc-model-refs.js`.
- **Asset template count**: README Key Statistics says "over a dozen templates across five asset categories." Actual template files: counting distinct `.md` templates across `assets/` subfolders and root = at least 17 template files across 7 subdirectories (benchmark, feature_catalog, flowcharts, readme, skill, testing_playbook, plus root-level templates). "Five asset categories" is wrong if counting subdirectories (there are 7: benchmark, feature_catalog, flowcharts, readme, skill, testing_playbook, plus root assets). "Over a dozen" is technically true but understates the count.
- **Missing `evergreen_packet_id_rule.md`**: The README `references/global/` structure tree lists only 6 files (core_standards, hvr_rules, optimization, validation, workflows, quick_reference). It omits `evergreen_packet_id_rule.md`, which exists as the 7th file in `references/global/`.
- **`skill_readme_template.md` missing from README structure tree**: The `assets/skill/` directory contains 5 files (skill_asset_template, skill_md_template, skill_readme_template, skill_reference_template, skill_smart_router). The README structure tree lists only 3 (skill_md_template, skill_reference_template, skill_asset_template), omitting `skill_readme_template.md` and `skill_smart_router.md`.