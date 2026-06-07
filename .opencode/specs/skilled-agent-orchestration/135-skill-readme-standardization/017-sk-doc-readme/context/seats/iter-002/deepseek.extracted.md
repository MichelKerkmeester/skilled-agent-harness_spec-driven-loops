Below is the full verification report.

---

# 1. EXACT INVOCATION

## Python scripts (all live under `scripts/`)

**`validate_document.py`** — `.opencode/skills/sk-doc/scripts/validate_document.py:12-17`
```
validate_document.py <document.md> [--type readme|skill|reference|asset|agent|command|install_guide|spec|changelog]
validate_document.py <document.md> --json
validate_document.py <document.md> --fix [--dry-run]
validate_document.py <document.md> --blocking-only
```
Exit codes: `0` = valid, `1` = blocking errors, `2` = file not found / parse error (line 18-21).

**`extract_structure.py`** — `.opencode/skills/sk-doc/scripts/extract_structure.py:1-20`
No argument parser is shown in the top 80 lines; the script outputs "JSON to stdout for AI agent processing" (line 19). `quick_reference.md:29-31` confirms:
```bash
scripts/extract_structure.py document.md
# Outputs JSON: frontmatter, structure, metrics, checklist, questions
```

**`init_skill.py`** — `.opencode/skills/sk-doc/scripts/init_skill.py:10-12`
```
init_skill.py <skill-name> --path <path>
```
Scaffolds a new skill directory with `SKILL.md`, subdirs (`references/`, `assets/`, `scripts/`), and populated frontmatter.

**`package_skill.py`** — `.opencode/skills/sk-doc/scripts/package_skill.py:16-17`
```
python package_skill.py <path/to/skill-folder> [output-directory]
python package_skill.py <path/to/skill-folder> --check   # Validate only, don't package
```
Creates a distributable zip. `--check` runs validation without packaging.

**`quick_validate.py`** — `.opencode/skills/sk-doc/scripts/quick_validate.py:7-28`
```
quick_validate.py .opencode/skills/my-skill          # Human-readable (default)
quick_validate.py .opencode/skills/my-skill --json   # Machine-readable
```
Checks: SKILL.md exists, YAML frontmatter present, required fields (`name`, `description`), optional fields (`allowed-tools`, `version`), name format (hyphen-case), description budget (soft warn at 130/110 chars, hard fail at 1536). Line 12-16 confirm exact checks.

**`validate_flowchart.sh`** — `.opencode/skills/sk-doc/scripts/validate_flowchart.sh:6`
```
./validate_flowchart.sh <flowchart.md>
```
Checks box alignment, arrows, decision labels. Counts errors and warnings.

## Additional scripts (not listed in README structure tree but present on disk)

- **`audit_readmes.py`** — `.opencode/skills/sk-doc/scripts/audit_readmes.py:1-23` — README audit for template alignment and freshness drift.
- **`validate-doc-model-refs.js`** — `.opencode/skills/sk-doc/scripts/validate-doc-model-refs.js:1-6` — Doc-model-reference validator for embedder name drift.
- **`scripts/tests/`** — `.opencode/skills/sk-doc/scripts/tests/` — Contains `test_validator.py`, `test_extract_structure_regressions.py`, `test_package_skill_regressions.py`, `test_changelog_validator.py`, `test_quick_validate_086.py`, `test_flowchart_validator.sh`, plus fixture folders (`command/`, `specs/`) and test `.md` fixtures.

## `/create:*` Commands

SKILL.md line 44 references `/create:changelog` as the only directly cited command. The v1.5.0.0 changelog (`.opencode/skills/sk-doc/changelog/v1.5.0.0.md:25`) enumerates the full family:

`/create:agent`, `/create:sk-skill`, `/create:feature-catalog`, `/create:testing-playbook`, `/create:folder_readme`, `/create:changelog`

## `@markdown` Agent Dispatch

The `@markdown` agent (renamed from `@create` in v1.5.0.0 Phase 003) is a LEAF write-capable documentation executor. Runtime mirrors:
- `.opencode/agents/markdown.md`
- `.claude/agents/markdown.md`
- `.codex/agents/markdown.toml`

Its role per `SKILL.md` AGENTS.md description: "Template-first `/create:*`, spec-doc, and scoped markdown authoring." The `/create:*` commands internally route component-authoring work through `@markdown` (changelog v1.5.0.0:87).

---

# 2. CAPABILITY ROSTER

From `SKILL.md:10-13`:
> "Unified specialist providing: (1) Document quality pipeline with structure enforcement and content optimization, (2) OpenCode component creation (skills, agents, commands) with scaffolding, validation and packaging, (3) ASCII flowchart creation for visualizing workflows, (4) Install guide creation for setup documentation and (5) Feature catalog and manual testing playbook creation for inventory and validation packages."

Plus (6) Benchmark Folder Creation, added in v1.6.0.0 (`.opencode/skills/sk-doc/changelog/v1.6.0.0.md:11-13`).

## Full Use-Case Set (from SKILL.md §1 WHEN TO USE):
1. Document Quality Management (README, Skill README, frontmatter validation, changelogs, validation workflow, manual optimization, llms.txt generation)
2. OpenCode Component Creation (Skills, Agents, Commands)
3. Flowchart Creation (ASCII diagrams)
4. Install Guide Creation (5-phase process)
5. Manual Testing Playbook Creation
6. Feature Catalog Creation
7. Benchmark Folder Creation

## Core Principle
`SKILL.md:14`: "Structure first, then content, then quality."

## Scripts-vs-AI Split
`SKILL.md:16`: "Scripts handle deterministic parsing/metrics. AI handles quality judgment and recommendations."

## DQI Score
From `SKILL.md` §6 Document-Type Gates and `references/global/validation.md:76-81`:
- Structure: 40 pts (checklist pass rate)
- Content: 30 pts (word count, code examples, links)
- Style: 30 pts (H2 format, dividers, intro)
- Bands: Excellent (90+), Good (75-89), Acceptable (60-74), Needs Work (<60)

## Document-Type Enforcement Levels
`SKILL.md:355`: "Detect document type first, then apply the right enforcement level: SKILL and command docs are strict, README docs are usability-focused, knowledge docs are moderately strict, and active spec docs are loose unless the task explicitly asks for enforcement."

From `quick_reference.md:103-131`:
| Type | Enforcement | Key Rules |
|------|------------|-----------|
| SKILL.md | Strict | YAML fm required, blocks on violations |
| Command | Strict | YAML fm required, H1 without subtitle |
| Knowledge | Moderate | No fm, numbered H2s |
| README | Flexible | Fm optional, safe auto-fixes only |
| Spec | Loose | Suggestions only, never blocks |
| llms.txt | Moderate | Plain text, not markdown |

---

# 3. KEY FILES

| Path | Role |
|------|------|
| `.opencode/skills/sk-doc/SKILL.md` | Entry point with smart routing, mode rules, version 1.5.0.0 |
| `.opencode/skills/sk-doc/README.md` | Human-facing skill README |
| `references/global/core_standards.md` | Filename conventions, document-type rules |
| `references/global/evergreen_packet_id_rule.md` | Prohibits mutable packet IDs in runtime docs |
| `references/global/hvr_rules.md` | Human Voice Rules full ruleset |
| `references/global/optimization.md` | Content optimization patterns |
| `references/global/quick_reference.md` | One-page command/gate cheat sheet |
| `references/global/validation.md` | DQI scoring criteria and validation gates |
| `references/global/workflows.md` | Mode 1 execution modes and validation patterns |
| `references/agent_creation.md` | Agent authority, permissions, creation workflow |
| `references/benchmark_creation.md` | Benchmark folder standards and workflow |
| `references/feature_catalog_creation.md` | Feature catalog standards and workflow |
| `references/install_guide_creation.md` | Install guide standards and workflow |
| `references/manual_testing_playbook_creation.md` | Playbook standards and workflow |
| `references/readme_creation.md` | README creation workflow |
| `references/skill_creation.md` | 6-step skill creation workflow |
| `assets/agent_template.md` | Agent definition template |
| `assets/command_template.md` | Slash command template |
| `assets/changelog_template.md` | Changelog/release-notes template |
| `assets/frontmatter_templates.md` | YAML fm templates (11 doc types) |
| `assets/llmstxt_templates.md` | llms.txt generation templates |
| `assets/template_rules.json` | Template enforcement rules per doc type |
| `assets/readme/readme_template.md` | README structure scaffold |
| `assets/readme/readme_code_template.md` | README for code repos |
| `assets/readme/install_guide_template.md` | 5-phase install guide template |
| `assets/skill/skill_md_template.md` | SKILL.md canonical template |
| `assets/skill/skill_readme_template.md` | Skill README scaffold |
| `assets/skill/skill_reference_template.md` | Reference file template |
| `assets/skill/skill_asset_template.md` | Asset file template |
| `assets/skill/skill_smart_router.md` | Smart-router resilience pattern |
| `assets/flowcharts/simple_workflow.md` | Linear sequential pattern |
| `assets/flowcharts/decision_tree_flow.md` | Branching logic pattern |
| `assets/flowcharts/parallel_execution.md` | Concurrent tasks pattern |
| `assets/flowcharts/user_onboarding.md` | Nested sub-processes pattern |
| `assets/flowcharts/approval_workflow_loops.md` | Approval cycles AND loops (two patterns in one file) |
| `assets/flowcharts/system_architecture_swimlane.md` | Multi-stage pipelines pattern |
| `assets/feature_catalog/feature_catalog_template.md` | Root feature catalog template |
| `assets/feature_catalog/feature_catalog_snippet_template.md` | Per-feature catalog file template |
| `assets/testing_playbook/manual_testing_playbook_template.md` | Root playbook template |
| `assets/testing_playbook/manual_testing_playbook_snippet_template.md` | Per-feature playbook scenario template |
| `assets/benchmark/benchmark_report_template.md` | Ten-section benchmark report scaffold |
| `assets/benchmark/source_template.md` | SOURCE.md wayfinding pointer scaffold |
| `scripts/extract_structure.py` | Parse document to JSON + DQI score |
| `scripts/validate_document.py` | Format validation with exit 0/1/2 |
| `scripts/init_skill.py` | Scaffold new skill directory |
| `scripts/package_skill.py` | Validate + package skill to zip |
| `scripts/quick_validate.py` | Fast skill frontmatter/description checks |
| `scripts/validate_flowchart.sh` | Flowchart alignment and style check |
| `scripts/audit_readmes.py` | Batch README audit for template alignment |
| `scripts/validate-doc-model-refs.js` | Embedder name drift check |
| `scripts/tests/` | Test fixtures and regression tests (18 entries) |
| `changelog/v1.5.0.0.md` | v1.5.0.0 release notes |
| `changelog/v1.6.0.0.md` | v1.6.0.0 release notes (benchmark mode) |
| `changelog/v1.7.0.0.md` | v1.7.0.0 release notes (validator fixes) |
| `graph-metadata.json` | Skill graph metadata |
| `manual_testing_playbook/` | Playbook package (7 category folders) |

---

# 4. WORKFLOWS & OUTPUTS

## Document Quality Workflow
Reference: `.opencode/skills/sk-doc/references/global/workflows.md:45-51`

Four execution modes:
1. **Script-assisted review** (Phases 1+2): `extract_structure.py` + AI eval. Output: JSON + qualitative assessment + recommendations.
2. **Structure checks** (Phase 1): `quick_validate.py`. Output: Checklist results + fix list.
3. **Content optimization** (Phase 2): `extract_structure.py` + AI eval. Output: Recommendations for AI-friendliness.
4. **Audit snapshot** (Phase 1, JSON only): `extract_structure.py`. Output: JSON report for another agent.

Validation integration (workflows.md:64-98):
- **Pre-Delivery** (MANDATORY for READMEs): `validate_document.py <file>` — exit 0 required.
- **Post-Write**: `quick_validate.py <path>` — filename corrections, non-blocking.
- **Pre-Submit**: `extract_structure.py <file>` — structure + AI quality assessment.

## Skill Creation Process
Reference: `.opencode/skills/sk-doc/references/skill_creation.md` and `SKILL.md:83`

6 steps: Understanding (examples) → Planning (resources) → Initialization (`init_skill.py`) → Editing (populate templates) → Packaging (`package_skill.py`) → Iteration (test/improve).

Outputs: Scaffolded skill directory with `SKILL.md`, `references/`, `assets/`, `scripts/` populated from templates under `assets/skill/`. Final DQI check via `extract_structure.py` on the completed `SKILL.md`.

## Validation Workflow
Reference: `references/global/workflows.md:84-98` and `references/global/validation.md:36-59`

```
Run validate_document.py → Exit 0 = continue, Exit 1 = fix and re-run
  → Run quick_validate.py → review output, fix issues
    → Run extract_structure.py → safe violations fix, critical violations block
```

Output: `validate_document.py` produces exit codes and violation text; `extract_structure.py` produces JSON with `dqi`, `checklist`, `violations`, `documentType`.

## Flowchart Validation
Reference: `scripts/validate_flowchart.sh:36-79`

Checks box_alignment (width variation >3 = warning, >5 = error), arrows (boxes without connectors = error), decision_labels. Produces pass/fail output to stdout.

---

# 5. TROUBLESHOOTING & FAQ

## Failure Modes (from `references/global/workflows.md:276-283`)
| Issue | Cause | Solution |
|-------|-------|----------|
| "Execution blocked" | Critical violation | Read error message, apply suggested fix |
| JSON parse error | Invalid markdown structure | Check for unclosed code blocks or frontmatter |
| Wrong document type detected | File location mismatch | Check document type detection in JSON output |
| Checklist failures | Structure issues | Review checklist results in JSON, fix violations |
| Validation not running | Environment difference | Apply checks manually |
| Safe fix not applied | Permission issue | Check file permissions |

## README Troubleshooting (from `README.md:312-349`)
1. **DQI score below 60** — fix priority: (1) frontmatter/section order, (2) missing sections, (3) content density, (4) style. Re-run after each batch.
2. **`validate_document.py` exits code 1** — H2 emojis missing, sections absent, or non-sequential numbering.
3. **`package_skill.py` fails** — SKILL.md >5,000 words, missing required sections, missing frontmatter, or missing subdirectories.
4. **HVR violations** — banned words, em dashes, semicolons, passive voice in output.

## FAQ (from `README.md:354-365`)
**Q: sk-doc vs system-spec-kit?** — sk-doc handles markdown quality/component creation. system-spec-kit handles spec folder lifecycle. They do not overlap.

**Q: `validate_document.py` vs `extract_structure.py`?** — `validate_document.py` is a fast format validator for READMEs (exit 0/1). `extract_structure.py` is the full DQI analysis tool for any markdown type.

**Q: Feature Catalog vs Manual Testing Playbook?** — Catalog documents what exists (current behavior, source anchors). Playbook defines how to test it (deterministic prompts, evidence requirements). Build catalog first.

**Q: When to use sk-doc for changelogs?** — Use `assets/changelog_template.md` via `/create:changelog` (auto or confirm). Compact layout for <10 changes, expanded for 10+.

**Q: What `/create:*` commands exist?** — Six: `/create:agent`, `/create:sk-skill`, `/create:feature-catalog`, `/create:testing-playbook`, `/create:folder_readme`, `/create:changelog`.

---

# 6. STALE FACTS IN CURRENT README

| # | README Claim | Reality | Source |
|---|-------------|---------|--------|
| 1 | "version 1.6.0.0" (line 35) | SKILL.md frontmatter says `version: 1.5.0.0`; changelogs exist for v1.5.0.0, v1.6.0.0, and **v1.7.0.0** (latest). Both doc versions are stale. | `SKILL.md:5`, `changelog/v1.7.0.0.md` |
| 2 | "six automation scripts" (line 35) | `scripts/` contains 8 standalone scripts: `extract_structure.py`, `validate_document.py`, `init_skill.py`, `package_skill.py`, `quick_validate.py`, `validate_flowchart.sh`, `audit_readmes.py`, `validate-doc-model-refs.js` (plus `tests/` with 6 test files). | `scripts/` directory listing |
| 3 | "thirteen reference files (six global and seven creation guides)" (line 35) | `references/global/` has **7** files (not 6): `core_standards.md`, `evergreen_packet_id_rule.md`, `hvr_rules.md`, `optimization.md`, `quick_reference.md`, `validation.md`, `workflows.md`. `references/` root has **7** creation guides. Total: **14**, not 13. | `references/global/` and `references/` directory listings |
| 4 | "7 flowchart patterns" and pattern-to-file mapping (lines 126-134) | `assets/flowcharts/` contains only **6** files. Patterns 5 (Approval Gate) and 6 (Loop/Iteration) are both mapped to `approval_workflow_loops.md`. | `assets/flowcharts/` directory listing |
| 5 | `assets/skill/` lists only 3 templates (lines 200-203) | `assets/skill/` actually contains **5** files: the three listed plus `skill_readme_template.md` and `skill_smart_router.md` (both added in v1.5.0.0 Phase 002). | `assets/skill/` directory listing, `changelog/v1.5.0.0.md:19` |
| 6 | Structure tree (lines 181-233) omits `scripts/tests/`, `scripts/validate-doc-model-refs.js`, `assets/benchmark/`, `references/evergreen_packet_id_rule.md` (in global/), `assets/feature_catalog/feature_catalog_snippet_template.md`, `assets/testing_playbook/manual_testing_playbook_snippet_template.md`, `skill_readme_template.md`, `skill_smart_router.md`. | All these files/folders exist on disk. | Directory listings reported above |
| 7 | SKILL.md mode count: README says "six modes" (line 25); SKILL.md §7 (Remember) says "six modes" (line 456). Both agree. | But `SKILL.md` only documents **5** labeled modes in §3 (Mode 1-5). Mode 6 (Benchmark) is mentioned in the use-case list (§1) but no "Mode 6" heading exists. This is a SKILL.md inconsistency, not README. | `SKILL.md:349-388` |
| 8 | README claims SKILL.md must stay "under 5k words" (line 117) | `package_skill.py:77` confirms `MAX_SKILL_MD_WORDS = 5000`. The claim is correct but the README omits the companion recommendation from `package_skill.py:78`: `RECOMMENDED_MAX_WORDS = 3000`. | `scripts/package_skill.py:77-78` |

---

**`quick_reference.md` internal staleness** (not README but a skill file worth noting):
- `quick_reference.md:169-174` references `references/specific/` (6 creation guides), a directory that was relocated to `references/` root in v1.5.0.0 (`.opencode/skills/sk-doc/changelog/v1.5.0.0.md:13`). The directory no longer exists.
- `quick_reference.md:365` references `git-commit` as a related skill; the actual skill is named `sk-git`.