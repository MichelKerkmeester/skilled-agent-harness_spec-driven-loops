---
title: "Feature Specification: doctor command namespace naming (032 phase 008/013/004)"
description: "The doctor command namespace has maintained workflow assets with snake_case filenames, a route manifest with an exact tool-facing name, and a Python helper that is exempt by language. This phase renames only the maintained non-Python assets, repairs route path values, and preserves route IDs and tool contracts."
trigger_phrases:
  - "doctor command namespace naming"
  - "kebab-case doctor assets"
  - "doctor route manifest paths"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands/004-doctor-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored doctor namespace docs"
    next_safe_action: "Execute the doctor asset closure against the frozen map"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/_routes.yaml"
      - ".opencode/commands/doctor/assets/"
      - ".opencode/commands/doctor/scripts/"
      - ".opencode/commands/doctor/mcp.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "_routes.yaml is an exact route-manifest name and remains unchanged."
      - "audit_descriptions.py remains unchanged under the Python filename exemption."
      - "Route IDs and YAML keys remain exact; only filesystem path values change."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Doctor command namespace naming

> Phase adjacency under the commands component parent: predecessor `003-design-namespace`; successor `005-memory-namespace`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands/004-doctor-namespace |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 004 of the commands-surface migration under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The doctor asset tree contains route targets such as `doctor_mcp_debug.yaml`, `doctor_mcp_install.yaml`, `doctor_skill_graph_freshness.yaml`, and `doctor_update_presentation.txt`. The same namespace also contains the exact `_routes.yaml` manifest and `scripts/audit_descriptions.py`, so an undifferentiated rename would alter a tool-facing name or an exempt Python filename.

### Purpose

Rename the 16 maintained non-Python doctor asset files to kebab-case, update every route and presentation path value, and keep the route manifest name, route IDs, Python helper, and doctor behavior stable.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The 16 maintained asset files under `.opencode/commands/doctor/assets/`: `doctor_causal-graph.yaml`, `doctor_code-graph.yaml`, `doctor_deep-loop.yaml`, `doctor_embeddings.yaml`, `doctor_fable-mode.yaml`, `doctor_mcp_debug.yaml`, `doctor_mcp_install.yaml`, `doctor_mcp_presentation.txt`, `doctor_memory.yaml`, `doctor_parent-skill.yaml`, `doctor_skill-advisor.yaml`, `doctor_skill-budget.yaml`, `doctor_skill-graph-freshness.yaml`, `doctor_speckit_presentation.txt`, `doctor_update.yaml`, and `doctor_update_presentation.txt`.
- Path-valued route entries in `_routes.yaml`, doctor command markdown, asset-local pointers, tests, indexes, and external consumers.
- A disposition record proving the exact-name and Python exemptions before the asset rename.

### Out of Scope

- `.opencode/commands/doctor/_routes.yaml`, which is an exact route-manifest/tool contract.
- `.opencode/commands/doctor/scripts/audit_descriptions.py`, which remains under the Python script exemption; all other already-compliant script names remain unchanged.
- The already-compliant `mcp.md`, `speckit.md`, `update.md`, `scripts/` directory, command IDs, YAML keys, route IDs, frontmatter fields, generated/lockfile output, and frozen history.
- Other commands namespaces and the shared asset rollup owned by sibling phases.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every maintained doctor asset candidate maps once to a kebab-case target | The frozen-map report lists 16 sources, 16 distinct targets, and no unknown disposition. |
| REQ-002 | Route and command path values resolve after the rename | `_routes.yaml`, doctor markdown, asset-local pointers, and external consumers point to existing targets with no old active asset path. |
| REQ-003 | Exact and language exemptions are preserved | `_routes.yaml` and `audit_descriptions.py` retain their exact names, modes, and content contract. |
| REQ-004 | Doctor routing and workflow behavior remain equivalent | Route selection, doctor workflow loading, presentation loading, and helper invocation match BASE outcomes. |
| REQ-005 | Evidence covers the full doctor closure | The report includes candidate dispositions, route/path resolution, exemption proof, and the path-scoped diff. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 16 maintained doctor asset filenames are kebab-case and all route/path consumers resolve.
- **SC-002**: `_routes.yaml`, `audit_descriptions.py`, route IDs, and YAML keys remain exact.
- **SC-003**: Doctor route and workflow outcomes match the pinned BASE evidence.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

`_routes.yaml` mixes path-valued `yaml` entries with route metadata, and the doctor directory includes Python and shell helpers. The mitigation is a pre-classified map and a route-aware reference scan that edits only filesystem path values. The phase depends on the 005 tooling, 006 frozen map, 000 mode/route baseline, and the decision record below.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must attach every route entry to a path/key disposition and must stop if the route loader treats a candidate basename as a public tool ID rather than a path value.
<!-- /ANCHOR:questions -->
