---
title: "Feature Specification: create-benchmark resource names"
description: "The create-benchmark packet uses snake_case taxonomy directories and fixture, profile, guide, and storage filenames. This phase converts those non-exempt resource names to kebab-case and updates packet-local references while preserving benchmark schema fields, manifests, and Python package exemptions."
trigger_phrases:
  - "create-benchmark resource naming"
  - "benchmark fixture kebab-case phase"
  - "benchmark storage guide rename"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/007-create-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/007-create-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-benchmark phase docs"
    next_safe_action: "Build the create-benchmark rename map"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-benchmark/assets/", ".opencode/skills/sk-doc/create-benchmark/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: create-benchmark resource names

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `sk-doc/019-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/007-create-benchmark` |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc/create-benchmark |
| **Origin** | Phase 007 of the nested create-packets decomposition |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The create-benchmark packet organizes resources under snake_case benchmark taxonomies such as `behavior_benchmark`, `model_benchmark`, and `skill_benchmark`. Fixture, profile, authoring-guide, and storage-guide filenames repeat those names, creating a broad path-reference closure across assets and references.

The outcome is a consistent kebab-case benchmark resource taxonomy with updated links and unchanged benchmark payload contracts.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rename asset directories `behavior_benchmark/`, `model_benchmark/`, and `skill_benchmark/` to kebab-case.
- Rename their fixture/template files, including `behavior_benchmark_baseline_template.md`, `behavior_benchmark_index_template.md`, `behavior_benchmark_scenario_template.md`, `model_benchmark_code_task_fixture_template.md`, `model_benchmark_pattern_fixture_template.md`, `model_benchmark_profile_template.md`, and `skill_benchmark_readme_template.md`.
- Rename `assets/shared/benchmark_report_template.md` and `source_template.md` to kebab-case as packet-owned non-exempt assets.
- Rename reference directories `agent_improvement/`, `behavior_benchmark/`, `model_benchmark/`, and `skill_benchmark/` plus their underscore-bearing guide files.
- Rename `agent_improvement_authoring_guide.md`, `behavior_benchmark_guide.md`, `model_benchmark_fixture_guide.md`, and `skill_benchmark_storage_guide.md` to kebab-case.
- Rename `references/shared/case_studies.md` and `worked_example.md`.
- Update links and path values throughout the create-benchmark packet.

### Out of Scope

- `SKILL.md`, `README.md`, package manifests, changelogs, and tool-mandated names.
- Benchmark field names, IDs, profile keys, content identifiers, Python files, and Python package directories.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `create-benchmark/assets/{behavior_benchmark,model_benchmark,skill_benchmark}/` | Rename/reference update | Convert three taxonomy directories and seven fixture/profile/template names |
| `create-benchmark/assets/shared/{benchmark_report,source}_template.md` | Rename/reference update | Convert two packet-owned shared asset filenames |
| `create-benchmark/references/{agent_improvement,behavior_benchmark,model_benchmark,skill_benchmark}/` | Rename/reference update | Convert taxonomy directories and guide filenames |
| `create-benchmark/references/shared/{case_studies,worked_example}.md` | Rename/reference update | Convert two shared reference filenames |
| `create-benchmark/SKILL.md`, `README.md`, and docs | Modify | Repoint benchmark resource paths |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every listed benchmark resource directory and filename uses kebab-case | The full asset/reference manifest has one target per non-exempt path and no unknown candidate |
| REQ-002 | Benchmark resource links and taxonomy references resolve | All packet-local guides, templates, and indexes load through target paths |
| REQ-003 | Packet-owned shared benchmark assets are included | `benchmark_report_template.md` and `source_template.md` each have one kebab-case target |
| REQ-004 | Benchmark payload contracts remain unchanged | IDs, schema keys, profile fields, and content identifiers are not normalized |
| REQ-005 | Python exemptions remain exact | No Python `.py` basename or package directory appears in the rename diff |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The create-benchmark asset/reference taxonomy is kebab-case within scope.
- **SC-002**: Benchmark scaffolding and guide navigation resolve with unchanged benchmark semantics.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Cross-domain benchmark links | Guides point at missing fixtures | Search each old taxonomy token and resolve all targets |
| Risk | Packet-owned shared assets are missed by a taxonomy-only glob | Stale underscore names survive the phase | Include `assets/shared/` in the explicit manifest and target search |
| Risk | Benchmark field keys resemble resource names | Fixture/schema drift | Review payload diff independently from path diff |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Any generated benchmark path must be recorded with its producer and consumer before execution.
<!-- /ANCHOR:questions -->
