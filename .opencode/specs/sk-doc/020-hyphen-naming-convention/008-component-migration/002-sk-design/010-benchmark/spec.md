---
title: "Feature Specification: Benchmark (020 phase 010)"
description: "Benchmark run snapshots use underscore-bearing after-label directories, while the benchmark README and changelog describe those paths as comparison artifacts."
trigger_phrases:
  - "benchmark naming phase"
  - "sk-design benchmark phase"
  - "020 benchmark"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/010-benchmark"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored benchmark spec"
    next_safe_action: "Execute phase on pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/benchmark/README.md"
      - ".opencode/skills/sk-design/benchmark/baseline/"
      - ".opencode/skills/sk-design/benchmark/after_009/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Benchmark (020 phase 010)

> Phase 010 of the sk-design component migration under `sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design`. This document defines the future execution scope; this authoring pass performs no migration.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/010-benchmark |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-design |
| **Origin** | Phase 10 of the sk-design subtree in the 020 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Benchmark run snapshots use underscore-bearing after-label directories, while the benchmark README and changelog describe those paths as comparison artifacts.

**Purpose:** Rename non-exempt benchmark artifact paths to kebab-case and update storage-guide and README references while preserving frozen report content and baseline identity.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory the benchmark run-label directories and all README/changelog/storage-guide references to them.
- Rename the six underscore-bearing after snapshot directories and update path references.
- Preserve report JSON keys, scenario IDs, scoring values, rendered-report content, baseline directory identity, and renderer-owned filenames.
- Record absent local profile/storage-guide candidates as no-op inventory results rather than inventing paths.

### Live candidate boundary
- `after_009/` → `after-009/`
- `after_012_routing_rigor/` → `after-012-routing-rigor/`
- `after_016_hub_routing/` → `after-016-hub-routing/`
- `after_018_transport_integration/` → `after-018-transport-integration/`
- `after_022_coverage_fill/` → `after-022-coverage-fill/`; `after_d3_proxy/` → `after-d3-proxy/`
- Keep `baseline/`, `report.json`, `report.md`, and `skill-benchmark-report.*` exact where already hyphenated or tool-defined

### Out of Scope
- Changing benchmark scores, scenario content, report schemas, baseline data, generator behavior, or benchmark execution.
- Renaming external create-benchmark templates or tool-mandated report filenames.
- Feature catalogs, playbooks, component files, changelog verification, and the final rollup gate.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|-------|-------|-------|
| REQ-001 | All benchmark filesystem candidates are classified. | The map covers six after-label directories and proves baseline/report filenames are unchanged or explicitly exempt. |
| REQ-002 | Benchmark navigation resolves. | README.md and any path-valued changelog/storage-guide references point to the new directories. |
| REQ-003 | Benchmark evidence is byte/semantic stable. | Report JSON keys, scenario IDs, score values, and baseline identity are unchanged. |
| REQ-004 | No speculative artifact is introduced. | Profiles or storage guides not present under this benchmark tree are recorded as absent, not fabricated. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No in-scope underscore-bearing benchmark directory remains.
- **SC-002**: The benchmark README resolves every saved run label and still identifies baseline as the frozen comparison anchor.
- **SC-003**: A pre/post report comparison shows only path-context changes where applicable.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|-------|-------|-------|-------|
| Risk | Historical run labels are treated as disposable names. | Medium | Preserve every snapshot and compare report content; change only physical path segments and path references. |
| Risk | A generated report is hand-edited during path repair. | High | Update source/path references only and leave renderer-owned report content untouched. |

Dependencies: the canonical convention and exemption boundary in `001-convention-policy-and-scope/`; the pinned BASE and rename-map evidence from the program's earlier baseline/tooling phases; and the sibling handoffs named in this phase's plan.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- No blocking questions; the live benchmark tree supplies the six run-label targets and the absence of local profile/storage-guide files is verifiable.
<!-- /ANCHOR:questions -->
