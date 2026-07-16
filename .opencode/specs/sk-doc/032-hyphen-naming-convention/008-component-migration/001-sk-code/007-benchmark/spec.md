---
title: "Feature Specification: sk-code benchmark artifacts (032 phase 008/007)"
description: "Tracked sk-code benchmark storage uses snake_case labels such as d4r_live, live_mode_b, live_final, live_remediated, router_baseline, router_final, and fixtures/sk_code. This phase renames the in-scope fixture/profile/storage paths and updates benchmark navigation while preserving generated report content and the benchmark corpus."
trigger_phrases:
  - "sk-code benchmark naming"
  - "benchmark artifact kebab-case"
  - "benchmark storage path rename"
  - "sk-code fixture directory migration"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code/007-benchmark"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored benchmark phase spec"
    next_safe_action: "Execute the tracked benchmark path rename closure"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/benchmark/README.md"
      - ".opencode/skills/sk-code/benchmark/d4r_live/"
      - ".opencode/skills/sk-code/benchmark/fixtures/sk_code/"
      - ".opencode/skills/sk-code/benchmark/live_final/"
      - ".opencode/skills/sk-code/benchmark/live_mode_b/"
      - ".opencode/skills/sk-code/benchmark/live_remediated/"
      - ".opencode/skills/sk-code/benchmark/router_baseline/"
      - ".opencode/skills/sk-code/benchmark/router_final/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The tracked benchmark storage labels are the rename candidates; generated report contents remain generated output."
      - "skill-benchmark-report.json/md and d4-ablation.json already use compliant names and are not rewritten for naming."
      - "The manual-testing-playbook corpus is renamed by 006; this child updates its benchmark path consumers only."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: sk-code benchmark artifacts

> Phase adjacency under the sk-code component parent: predecessor 006-manual-testing-playbook; successor 008-changelog-verify.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code/007-benchmark |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-code |
| **Origin** | Phase 007 of the sk-code component migration under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The tracked benchmark tree mixes compliant run names with underscore-bearing storage labels: d4r_live/, fixtures/sk_code/, live_final/, live_mode_b/, live_remediated/, router_baseline/, and router_final/. benchmark/README.md and command examples point at these labels, while the reports inside them are renderer-owned artifacts whose contents must not be rewritten as part of a filesystem naming pass.

### Purpose

Rename the in-scope benchmark fixture/profile/storage directories to kebab-case, update benchmark commands and documentation to the new paths, and prove that the same scenario corpus and report artifacts remain discoverable without modifying generated report content.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- d4r_live/ to d4r-live/.
- fixtures/sk_code/ to fixtures/sk-code/.
- live_final/, live_mode_b/, live_remediated/, router_baseline/, and router_final/ to their kebab-case equivalents.
- benchmark/README.md, d4r_live/README.md, command examples, report-navigation links, and the path consumers that point to these storage labels.
- A disposition for already-compliant baseline/, after/, full/, and live/ directories and for every tracked file/path under the renamed storage roots.

### Out of Scope

- Generated report content, renderer-owned report filenames skill-benchmark-report.json/md, d4-ablation.json, and generated/lockfile output.
- The manual-testing-playbook root and scenario file physical renames; 006 owns them. This child updates the corpus path after that handoff.
- Code identifiers, JSON/YAML/TOML keys, frontmatter fields, package/Python names, tool-mandated names, and frozen changelog/history.
- Re-running or re-scoring the benchmark as a migration step; only path/discovery parity is required here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-code/benchmark/{d4r_live,fixtures/sk_code,live_final,live_mode_b,live_remediated,router_baseline,router_final} | Rename | Rename tracked storage labels through the semantic map. |
| .opencode/skills/sk-code/benchmark/README.md | Reference update | Update structure tables, command output paths, and report navigation. |
| Tracked benchmark docs/readmes under renamed roots | Reference update | Repair relative links without rewriting generated report data. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every in-scope benchmark storage label has a unique kebab-case target | The map covers all seven listed labels and every nested path has a consistent new prefix. |
| REQ-002 | Benchmark navigation and commands use the new paths | README command examples, storage tables, report links, and corpus references resolve with no active old storage label. |
| REQ-003 | Generated artifacts and corpus content are preserved | Report filenames/content, fixture files, scenario IDs, and report schemas are unchanged apart from path-derived links explicitly in scope. |
| REQ-004 | Benchmark discovery remains equivalent | The benchmark harness finds the same corpus and existing report artifacts through the renamed paths; no silent empty-output condition occurs. |
| REQ-005 | Exemptions and frozen surfaces remain intact | Generated/lockfile, keys, identifiers, tool-mandated, Python/package, and frozen names are not renamed. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The tracked benchmark storage labels are kebab-case.
- **SC-002**: benchmark/README.md and command/report paths resolve with no active old storage label.
- **SC-003**: Corpus membership, report discovery, filenames, and generated content match BASE.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Benchmark output directories can look like ordinary tracked folders even when their contents are generated. Renaming the wrong generated surface or editing report JSON would make the baseline incomparable. The mitigation is a frozen-map classification for each directory/file, a byte/content comparison for generated artifacts, and a non-zero discovery check through the existing harness. The phase depends on the 006 corpus-path handoff and the 032 map.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must use the map's generated-output classification rather than assuming every tracked report directory is renameable.
<!-- /ANCHOR:questions -->
