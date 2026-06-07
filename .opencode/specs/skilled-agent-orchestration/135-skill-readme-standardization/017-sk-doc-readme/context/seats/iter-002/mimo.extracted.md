Now let me read the script files to verify their flags and outputs.
1. EXACT INVOCATION

- `extract_structure.py`: `python3 .opencode/skills/sk-doc/scripts/extract_structure.py <file.md>` — parses any markdown to JSON with DQI score, checklist, violations, documentType. No required flags. Output: JSON to stdout. (`.opencode/skills/sk-doc/scripts/extract_structure.py:1-20`)

- `validate_document.py`: `python3 .opencode/skills/sk-doc/scripts/validate_document.py <file.md> [--type readme|skill|reference|asset|agent|command|install_guide|spec|changelog] [--json] [--fix [--dry-run]] [--blocking-only]` — Exit 0 = valid, 1 = blocking errors, 2 = file/parse error. (`.opencode/skills/sk-doc/scripts/validate_document.py:13-27`)

- `init_skill.py`: `python3 .opencode/skills/sk-doc/scripts/init_skill.py <skill-name> --path <path>` — scaffolds a skill directory from template. (`.opencode/skills/sk-doc/scripts/init_skill.py:9-15`)

- `package_skill.py`: `python3 .opencode/skills/sk-doc/scripts/package_skill.py <path/to/skill-folder> [output-directory]` or `--check` (validate only). Validates frontmatter, required sections, word count (max 5000), then packages to zip. (`.opencode/skills/sk-doc/scripts/package_skill.py:16-22`)

- `quick_validate.py`: `python3 .opencode/skills/sk-doc/scripts/quick_validate.py <path> [--json]` — fast frontmatter/structure check. Auto-detects skill vs command. Description budget: soft 130 (skill) / 110 (command), hard cap 1536. (`.opencode/skills/sk-doc/scripts/quick_validate.py:7-29`)

- `validate_flowchart.sh`: `./validate_flowchart.sh <flowchart.md>` — checks box alignment, arrow presence, decision labels, entry/exit paths. Exit 1 on errors. (`.opencode/skills/sk-doc/scripts/validate_flowchart.sh:1-7`)

- Two additional scripts not in SKILL.md's canonical list:
  - `audit_readmes.py`: batch README audit across directories (`.opencode/skills/sk-doc/scripts/audit_readmes.py:7-23`)
  - `validate-doc-model-refs.js`: doc-model cross-reference validator (`.opencode/skills/sk-doc/scripts/validate-doc-model-refs.js:1-6`)

- `/create:*` commands: Referenced in SKILL.md line 44 (`/create:changelog` auto + confirm). The `@markdown` agent dispatch is referenced in the system prompt as handling `/create:*` commands.

2. CAPABILITY ROSTER

Six modes documented in SKILL.md (line 12, line 456):

1. **Document Quality** — markdown structure enforcement, DQI scoring (0-100), content optimization, llms.txt generation
2. **Component Creation** — skills, agents, commands with scaffolding, validation, packaging
3. **Flowchart Creation** — ASCII diagrams for workflows and decision trees
4. **Install Guide Creation** — phase-based setup documentation
5. **Catalog/Playbook Creation** — feature catalogs and manual testing playbooks
6. **Benchmark Folder Creation** — curated `mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/` folders

**Structure-first principle**: "Structure first, then content, then quality." (SKILL.md line 14)

**Scripts-vs-AI split**: "Scripts handle deterministic parsing/metrics. AI handles quality judgment and recommendations." (SKILL.md line 16)

**DQI score**: Structure (40 pts) + Content (30 pts) + Style (30 pts) = 0-100. Four bands: Excellent (90-100), Good (75-89), Acceptable (60-74), Needs Work (<60). (SKILL.md line 440-445, README.md line 39)

**Document-type enforcement levels** (SKILL.md lines 440-445):
- SKILL.md: Strict (no failures), frontmatter required, sections: WHEN/SMART/HOW/RULES/REFERENCES
- README.md: Flexible, no frontmatter required, focus on quick-start
- Knowledge: Strict (no frontmatter forbidden), consistent reference format
- Command: Strict, frontmatter required, must be executable and discoverable
- Spec: Loose, optional frontmatter, avoid blocking
- Generic: Flexible, optional frontmatter

3. KEY FILES

| Path | Role |
|------|------|
| `SKILL.md` | Entry point with routing logic, mode definitions, rules, success criteria |
| `README.md` | Human-facing overview, quick start, features, structure, troubleshooting, FAQ |
| `graph-metadata.json` | Skill graph metadata (family, edges, intent signals, derived key_files) |
| **references/** | |
| `references/skill_creation.md` | 6-step skill creation workflow |
| `references/agent_creation.md` | Agent authority and creation workflow |
| `references/readme_creation.md` | README creation workflow |
| `references/install_guide_creation.md` | Install guide standards and workflow |
| `references/feature_catalog_creation.md` | Feature catalog standards and workflow |
| `references/manual_testing_playbook_creation.md` | Playbook standards and workflow |
| `references/benchmark_creation.md` | Benchmark folder standards and promotion workflow |
| **references/global/** | |
| `references/global/core_standards.md` | Filename conventions, structure rules |
| `references/global/hvr_rules.md` | Human Voice Rules full ruleset |
| `references/global/optimization.md` | AI-friendly content transforms |
| `references/global/validation.md` | DQI scoring criteria |
| `references/global/workflows.md` | Execution modes by task type |
| `references/global/quick_reference.md` | One-page command and gate cheat sheet |
| `references/global/evergreen_packet_id_rule.md` | Rule: runtime docs must not cite mutable spec packet numbers |
| **assets/** | |
| `assets/changelog_template.md` | Global changelog and GitHub release notes template |
| `assets/frontmatter_templates.md` | Frontmatter validation (11 types per README) |
| `assets/llmstxt_templates.md` | llms.txt generation templates |
| `assets/agent_template.md` | Agent creation template |
| `assets/command_template.md` | Command creation template |
| `assets/template_rules.json` | Enforcement rules per document type |
| **assets/skill/** | |
| `assets/skill/skill_md_template.md` | Canonical SKILL.md template |
| `assets/skill/skill_readme_template.md` | Skill README template |
| `assets/skill/skill_reference_template.md` | Reference file template |
| `assets/skill/skill_asset_template.md` | Asset file template |
| `assets/skill/skill_smart_router.md` | Resilient smart-router skeleton for new skills |
| **assets/readme/** | |
| `assets/readme/readme_template.md` | README structure with HVR rules |
| `assets/readme/readme_code_template.md` | README for code repos/projects |
| `assets/readme/install_guide_template.md` | 5-phase install guide template |
| **assets/flowcharts/** | |
| `assets/flowcharts/simple_workflow.md` | Linear sequential pattern |
| `assets/flowcharts/decision_tree_flow.md` | Branching logic pattern |
| `assets/flowcharts/parallel_execution.md` | Concurrent tasks pattern |
| `assets/flowcharts/user_onboarding.md` | Nested sub-processes pattern |
| `assets/flowcharts/approval_workflow_loops.md` | Review cycles and loops pattern |
| `assets/flowcharts/system_architecture_swimlane.md` | Multi-stage pipelines pattern |
| **assets/benchmark/** | |
| `assets/benchmark/benchmark_report_template.md` | Ten-section curated report scaffold |
| `assets/benchmark/source_template.md` | SOURCE.md wayfinding pointer scaffold |
| **assets/feature_catalog/** | |
| `assets/feature_catalog/feature_catalog_template.md` | Root feature catalog template |
| `assets/feature_catalog/feature_catalog_snippet_template.md` | Per-feature snippet template |
| **assets/testing_playbook/** | |
| `assets/testing_playbook/manual_testing_playbook_template.md` | Root playbook template |
| `assets/testing_playbook/manual_testing_playbook_snippet_template.md` | Per-feature snippet template |
| **scripts/** | |
| `scripts/extract_structure.py` | Document structure extractor → JSON + DQI |
| `scripts/validate_document.py` | README/doc format validator (exit 0/1/2) |
| `scripts/init_skill.py` | Skill directory scaffolder |
| `scripts/package_skill.py` | Skill packager and validator (→ zip) |
| `scripts/quick_validate.py` | Fast frontmatter/structure validator |
| `scripts/validate_flowchart.sh` | Flowchart alignment and style checker |
| `scripts/audit_readmes.py` | Batch README audit across directories |
| `scripts/validate-doc-model-refs.js` | Doc-model reference validator (Node.js) |
| `scripts/tests/` | Test suite (7 test files + fixtures) |

4. WORKFLOWS & OUTPUTS

**Doc Quality Workflow** (SKILL.md §3 Mode 1, lines 351-355):
1. Run `extract_structure.py` → JSON snapshot with DQI score, checklist, violations
2. AI reviews snapshot, generates ranked recommendations
3. Safe auto-fixes applied (H2 case, separators, filename conventions)
4. Critical violations flagged for human review (missing frontmatter, wrong section order)
5. Output: validated document with DQI score and clean checklist

**Skill Creation Process** (SKILL.md §3 Mode 2, lines 83-84):
1. Understanding — gather use cases with examples
2. Planning — define bundled resources
3. Initialization — `init_skill.py` scaffolds directory
4. Editing — populate SKILL.md and templates
5. Packaging — `package_skill.py` validates and zips
6. Iteration — test and improve
Output: skill directory + packaged zip

**Agent Creation** (SKILL.md §3 Mode 2, lines 85-86): Load `agent_template.md` → define YAML frontmatter with explicit tool permissions (true/false per tool, not a loose allowed-tools array) → create CORE WORKFLOW and ANTI-PATTERNS sections → validate → test.

**Command Creation** (SKILL.md §3 Mode 2, lines 87-88): Load `command_template.md` → define name/description/triggers → write execution logic → add registry wiring → test.

**Install Guide Workflow** (SKILL.md §1, lines 105-115): 5-phase process: Overview → Prerequisites → Installation → Configuration → Verification. Each phase has a validation checkpoint.

**Playbook Workflow** (SKILL.md §3 Mode 5, lines 383-384): Root `manual_testing_playbook.md` owns package guidance; per-feature files live under numbered category folders (9-column scenario tables, deterministic prompts, cross-reference index).

**Benchmark Workflow** (SKILL.md §1, lines 148-161): ADR lands → stable headline confirmed → create `benchmark-<YYYY-MM-DD>/` folder with `benchmark_report.md` (ten-section narrative), `SOURCE.md` (wayfinding pointer), `results.csv`, `*.jsonl`, optional sidecars.

5. TROUBLESHOOTING & FAQ

**Failure Modes:**

- **Wrong document type detected**: The auto-detector picks the wrong type (e.g., Knowledge instead of SKILL), causing enforcement level mismatch. Fix: pass `--type` flag explicitly to `validate_document.py`. (README.md §7, lines 310-318)

- **DQI score below 60**: Missing required sections, no frontmatter, low word count, no code examples, H2 missing emoji/numbers, multiple HVR violations. Fix: review `checklist` array in JSON output, address failed items in priority order. (README.md §7, lines 312-318)

- **`validate_document.py` exits code 1**: H2 headers missing emojis, required sections absent, non-sequential section numbering. Fix: read error output, correct each issue, re-run. (README.md §7, lines 322-328)

- **`package_skill.py` fails**: SKILL.md exceeds 5,000 words, missing required sections (WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES), frontmatter absent/malformed. Fix: run `extract_structure.py` first, move content to references if over word limit. (README.md §7, lines 332-338)

- **HVR violations in DQI output**: Style component score reduced by banned words (robust, seamless, utilize, delve, cutting-edge), em dashes, semicolons, passive voice. Fix: read `references/global/hvr_rules.md`, rewrite affected sentences. (README.md §7, lines 342-348)

- **Filename violations**: ALL CAPS filenames, hyphens instead of underscores. Auto-corrected by validation workflow. (SKILL.md §1, lines 47-49)

**FAQ (from README.md §8):**

1. **Q: When should I use sk-doc vs. system-spec-kit?** A: sk-doc for markdown quality, document creation, component scaffolding. system-spec-kit for spec folder lifecycle. They do not overlap. (lines 354-356)

2. **Q: Does `validate_document.py` check everything that `extract_structure.py` checks?** A: No. `validate_document.py` is a fast README-only format validator (TOC, anchor, H2 emoji). `extract_structure.py` is the full DQI analysis tool for any markdown type. (lines 358-360)

3. **Q: What is the difference between a Feature Catalog and a Manual Testing Playbook?** A: Catalog documents current behavior (what it can do). Playbook defines how to test it (deterministic prompts, expected signals, evidence). Build catalog first, then playbook. (lines 362-364)

4. **Q: How does DQI scoring work?** A: Three components — Structure (40), Content (30), Style (30) = 0-100. Four bands: Excellent 90-100, Good 75-89, Acceptable 60-74, Needs Work <60. (README.md lines 39, 103-109)

6. STALE FACTS IN CURRENT README

1. **Version mismatch**: README line 35 says "version 1.6.0.0". SKILL.md frontmatter line 5 says `version: 1.5.0.0`. Changelog directory contains `v1.7.0.0.md` — so neither value matches the latest changelog entry.

2. **Global reference count wrong**: README line 35 says "six global" reference files. Actual count is 7: `core_standards.md`, `hvr_rules.md`, `optimization.md`, `validation.md`, `workflows.md`, `quick_reference.md`, `evergreen_packet_id_rule.md` (`.opencode/skills/sk-doc/references/global/`).

3. **Total reference count wrong**: README line 35 says "thirteen reference files (six global and seven creation guides)". Actual count is 14 (7 global + 7 creation guides).

4. **Script count wrong**: README line 35 says "six automation scripts". Actual count is 8 scripts: the 6 listed in SKILL.md plus `audit_readmes.py` and `validate-doc-model-refs.js` (`.opencode/skills/sk-doc/scripts/`).

5. **Flowchart pattern count wrong**: README line 45 says "7 flowchart patterns". The `assets/flowcharts/` directory contains 6 files. The README's own table (lines 127-134) lists 7 conceptual patterns but maps them to only 6 files (Loop/Iteration shares `approval_workflow_loops.md` with Approval Gate).

6. **Asset category count wrong**: README line 35 says "five asset categories". Actual distinct subdirectories under `assets/` are 7: `readme/`, `skill/`, `flowcharts/`, `benchmark/`, `feature_catalog/`, `testing_playbook/`, plus 6 root-level template files.

7. **Template count understated**: README line 35 says "over a dozen templates". Actual count of `.md` templates across all `assets/` subdirectories and root is 25.

8. **Structure tree omits files**: The README structure section (lines 181-233) omits:
   - `assets/skill/skill_smart_router.md` (referenced in SKILL.md line 365)
   - `assets/feature_catalog/feature_catalog_snippet_template.md` (exists in directory)
   - `assets/testing_playbook/manual_testing_playbook_snippet_template.md` (exists in directory)
   - `scripts/audit_readmes.py` (exists but not shown in tree)
   - `scripts/validate-doc-model-refs.js` (exists but not shown in tree)
   - `scripts/tests/` directory (exists with 18 entries)
   - `scripts/README.md` (exists)

9. **Missing `evergreen_packet_id_rule.md`**: README's "Related Documents" table (lines 369-388) does not list `references/global/evergreen_packet_id_rule.md`, which is actively referenced in SKILL.md line 353 and in the RESOURCE_MAP (line 231).