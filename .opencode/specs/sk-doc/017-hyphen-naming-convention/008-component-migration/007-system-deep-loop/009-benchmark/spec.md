---
title: "Feature Specification: system-deep-loop benchmark storage names (017 phase 007/009)"
description: "The root system-deep-loop benchmark boundary contains three underscore-separated storage directories—after_d3_proxy, live_mode_b, and router_mode_a—while its report filenames are already kebab-case. This phase renames authored storage labels, repairs benchmark index/path references, and classifies fixture/profile and generated-output ownership without changing report payloads or benchmark scores."
trigger_phrases:
  - "system-deep-loop benchmark naming"
  - "benchmark storage kebab-case"
  - "deep loop benchmark path repair"
  - "benchmark fixture profile naming"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/009-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/009-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored benchmark phase spec"
    next_safe_action: "Execute the root benchmark rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The root benchmark tree has three underscore-bearing storage directories and no underscore-bearing report filenames."
      - "The component-owned deep-improvement fixture/profile and benchmark trees are not duplicated here; their ownership is classified explicitly."
      - "Report JSON keys and generated report content are data/output contracts, not filesystem rename targets."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: System-deep-loop benchmark storage names

> Phase adjacency under the system-deep-loop component parent: predecessor `008-manual-testing-playbook`; successor `010-changelog-verify`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/009-benchmark |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | system-deep-loop |
| **Origin** | Phase 009 of the system-deep-loop component migration under the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The root benchmark boundary stores comparison runs beside the skill. Its current storage labels are `after_d3_proxy/`, `live_mode_b/`, and `router_mode_a/`; `baseline/` is already compliant, and the report files are already named `skill-benchmark-report.json` and `skill-benchmark-report.md`. The README and runner commands use these directory names as path values, while fixture/profile assets live in the deep-improvement component.

This phase renames the root benchmark storage labels to kebab-case, repairs all path-valued references, and records the fixture/profile/generated-output boundary without changing report schemas, scenario IDs, or benchmark results.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.opencode/skills/system-deep-loop/benchmark/after_d3_proxy/` → `after-d3-proxy/`.
- `.opencode/skills/system-deep-loop/benchmark/live_mode_b/` → `live-mode-b/`.
- `.opencode/skills/system-deep-loop/benchmark/router_mode_a/` → `router-mode-a/`.
- `benchmark/README.md`, report-path references, storage guides, and any runner/consumer path values that point at those directories.
- Ownership and disposition evidence for the `deep-improvement` fixture/profile artifacts and generated report output; those files are not duplicated or reclassified as root benchmark candidates.

### Out of Scope

- `benchmark/baseline/`, report filenames, generated report payloads, JSON keys, scenario IDs, benchmark scores, and the deep-improvement-owned fixture/profile tree.
- The root playbook, workflow packet trees, Python `.py` files/package directories, tool-mandated names, code identifiers, frontmatter fields, and frozen changelog/history.
- Changing benchmark algorithms, scoring dimensions, trace modes, or the report renderer.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/benchmark/after_d3_proxy/` | Rename | Rename the authored storage label and preserve its report files. |
| `.opencode/skills/system-deep-loop/benchmark/live_mode_b/` | Rename | Rename the authored storage label and preserve its report files. |
| `.opencode/skills/system-deep-loop/benchmark/router_mode_a/` | Rename | Rename the authored storage label and preserve its report files. |
| `.opencode/skills/system-deep-loop/benchmark/README.md` and consumers | Reference update | Repair baseline/run directory links and commands. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Root benchmark storage labels use kebab-case | The three listed directories move to their exact hyphenated targets with no collision or stale active path. |
| REQ-002 | Report files and payloads remain stable | Every report remains present, parseable, and associated with the same run label, trace mode, scenario IDs, verdict, and score. |
| REQ-003 | Benchmark path consumers are repaired | README links, runner output paths, baseline comparisons, and storage-guide references resolve to the renamed directories. |
| REQ-004 | Fixture/profile ownership is explicit | The report identifies deep-improvement-owned fixtures/profiles and generated output as separate dispositions, with no duplicate root move. |
| REQ-005 | Benchmark behavior remains equivalent | Router/live benchmark discovery and D5 connectivity see the same corpus and report semantics after path changes. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No in-scope snake_case storage directory remains under the root `benchmark/` boundary.
- **SC-002**: Baseline/run report paths, contents, scenario IDs, and scores remain equivalent.
- **SC-003**: Fixture/profile and generated-output ownership is recorded without scope leakage into phase 006.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The report files are generated artifacts, but their parent storage labels are authored path contracts used by README and benchmark tooling. Moving or rewriting the reports together could erase baseline evidence or alter payloads. The phase depends on the benchmark manifest, the root playbook phase, and the deep-improvement ownership disposition.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must record whether each report file is generated or authored while preserving its path and content contract under the renamed storage directory.
<!-- /ANCHOR:questions -->
