---
title: "Feature Specification: sk-git benchmark (017 phase 008/012/004)"
description: "The sk-git benchmark surface contains two snake_case live-profile directories and report content with historical path pointers. This phase moves the benchmark filesystem names to kebab-case and proves that benchmark evidence, fixture discovery, and storage-guide references remain intact."
trigger_phrases:
  - "sk-git benchmark kebab-case"
  - "017 benchmark profile rename"
  - "benchmark artifact path closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/012-sk-git/004-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/012-sk-git/004-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the benchmark phase from the live profile and report inventory"
    next_safe_action: "Execute the benchmark artifact map and reference closure on the pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/benchmark/"
      - ".opencode/skills/sk-git/benchmark/live_glm_5.2_high/"
      - ".opencode/skills/sk-git/benchmark/live_kimi_2.7/"
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: sk-git benchmark

> Phase adjacency under the sk-git component parent: predecessor 003-manual-testing-playbook; successor 005-changelog-verify. The siblings are independently scoped; the adjacency is an execution ordering hint for the component rollup.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/012-sk-git/004-benchmark |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-git |
| **Origin** | Phase 004 of the sk-git component migration under the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The live sk-git benchmark tree currently has two snake_case profile directories, live_glm_5.2_high and live_kimi_2.7. Each contains skill-benchmark-report.json and skill-benchmark-report.md, which are already kebab-compliant filenames, while benchmark evidence still contains historical path spellings that can become stale when the references and manual-playbook phases land. The live inventory contains no separate fixture directory or storage-guide file, so the execution census must record those categories as empty rather than inventing a rename set.

The purpose is to rename the observed benchmark profile directories to kebab-case, update any path-valued profile, fixture, report, registry, or storage-guide pointers, and prove that benchmark scenario IDs, scores, report keys, and evidence semantics are unchanged.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename live_glm_5.2_high -> live-glm-5.2-high and live_kimi_2.7 -> live-kimi-2.7 when the source directories are present.
- Keep the existing report filenames skill-benchmark-report.json and skill-benchmark-report.md unless the pinned census identifies an additional in-scope snake_case file.
- Update path-valued benchmark references in report JSON/Markdown, benchmark registries, SKILL.md/README.md, and storage or fixture guidance that addresses these profiles.
- Preserve JSON/YAML/TOML keys, report schemas, scenario IDs, scores, model labels, transcripts, and non-path evidence values.
- Record empty fixture and storage-guide inventories explicitly when the pinned baseline has none, and record no-op dispositions for already-compliant files.

### Out of Scope
- Reference, asset, manual-playbook, feature-catalog, changelog, script, code, Python, package, tool-mandated, or frozen-history names.
- Renaming skill-benchmark-report.json or skill-benchmark-report.md merely because they contain underscore characters in content values; filenames are already kebab-case.
- Changing benchmark behavior, scenarios, model configuration, report keys, scores, or historical response text except exact path-valued references required for resolution.
- Executing the benchmark rename during documentation authoring.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-git/benchmark/live_glm_5.2_high/ | Rename | Move the GLM profile directory to live-glm-5.2-high. |
| .opencode/skills/sk-git/benchmark/live_kimi_2.7/ | Rename | Move the Kimi profile directory to live-kimi-2.7. |
| .opencode/skills/sk-git/benchmark/*/skill-benchmark-report.{json,md} | Modify | Update exact path-valued references while preserving report data and evidence. |
| .opencode/skills/sk-git/SKILL.md and README.md | Modify | Repair benchmark path or verification pointers if present. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The benchmark filesystem map covers every observed profile, fixture, report, and storage-guide path. | The candidate report includes the two observed profile directories, four report files, and explicit empty/no-op dispositions for absent fixture and storage-guide categories. |
| REQ-002 | Profile and artifact path consumers use kebab-case. | The benchmark loader, registries, report path values, SKILL.md/README.md pointers, and storage/fixture guidance resolve with zero stale source paths. |
| REQ-003 | Benchmark evidence is semantically unchanged. | Scenario IDs, report keys, scores, model labels, fixtures, and storage semantics match the pre-rename baseline; only approved filesystem/path values differ. |
| REQ-004 | Already-compliant report filenames remain stable unless the frozen census identifies a real additional rename. | skill-benchmark-report.json and skill-benchmark-report.md remain present under both hyphenated profile directories. |
| REQ-005 | The 017 exemption boundary and component scope are honored. | No key, field, code identifier, Python/tool-mandated name, sibling surface, or frozen content is changed. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both observed benchmark profile directories are kebab-case and every profile/report pointer resolves.
- **SC-002**: The four report files remain discoverable with unchanged benchmark evidence and schema.
- **SC-003**: Fixture and storage-guide categories are either correctly migrated if discovered at BASE or explicitly evidenced as empty/no-op.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The phase depends on the frozen 017 map and the benchmark loader's path contract. Its main risks are treating report content as filesystem names, losing a profile during directory movement, or changing benchmark evidence while repairing a path. The checklist requires profile/report discovery parity, JSON/Markdown path resolution, and content/key/score parity.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The execution census must decide only whether additional nested fixture or storage-guide paths exist at its pinned BASE; the authoring inventory found none.
<!-- /ANCHOR:questions -->
