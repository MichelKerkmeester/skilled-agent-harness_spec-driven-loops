---
title: "Feature Specification: sk-doc root benchmark artifact boundary"
description: "The root sk-doc benchmark directory is assigned a naming phase for fixtures, profiles, and storage-guide artifacts, but the pinned surface currently contains only .gitkeep. This phase records the empty baseline, verifies no hidden or referenced snake_case artifact is missed, and keeps create-benchmark packet resources in their separate phase."
trigger_phrases:
  - "sk-doc benchmark artifact naming"
  - "root benchmark kebab-case audit"
  - "032 benchmark phase"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/005-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/005-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored root benchmark audit docs"
    next_safe_action: "Confirm the root benchmark census"
    blockers: []
    key_files: [".opencode/skills/sk-doc/benchmark/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: sk-doc root benchmark artifact boundary

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/005-benchmark` |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 005 of the sk-doc component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The root `benchmark/` boundary is reserved for sk-doc benchmark artifacts, but the current tree contains only `.gitkeep`; the fixtures, profiles, and storage guides described by the surface contract are not present at this baseline. A rollup gate still needs evidence that this phase did not overlook a snake_case artifact or confuse the root boundary with the `create-benchmark` packet resources.

The outcome is an evidence-pinned root benchmark census. If the pinned execution baseline remains empty, no rename is performed; any actual artifact is classified and handled only within this phase's root boundary.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Census `.opencode/skills/sk-doc/benchmark/`, including hidden files and referenced paths.
- Confirm the current `.gitkeep`-only baseline and record a zero-row rename map if unchanged.
- If the pinned baseline contains root fixtures, profiles, or storage guides, rename their non-exempt filesystem names to kebab-case and update root-benchmark references.
- Preserve root boundary ownership and report any artifact reference owned by `create-benchmark` phase 007.

### Out of Scope

- The `create-benchmark/` packet assets/references, handled by nested phase 007.
- Benchmark payload keys, profile fields, fixture identifiers, content names, and tool-mandated files.
- Creating benchmark artifacts or running a migration during this authoring pass.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/benchmark/` | Verify/rename if present | Census root artifacts; current baseline is `.gitkeep` only |
| `005-benchmark/` | Documentation only | Record the zero-row or baseline-specific acceptance contract |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The root benchmark inventory is complete | Hidden files, regular files, directories, and consumers are listed at BASE |
| REQ-002 | The empty baseline is proven or actual artifacts are classified | The report records `.gitkeep`-only count or a complete root artifact rename map |
| REQ-003 | Root benchmark references remain valid | No stale root-benchmark path exists after any scoped rename |
| REQ-004 | Create-benchmark packet ownership remains separate | Packet resources are not renamed or counted as root artifacts |
| REQ-005 | Benchmark content contracts remain stable | Keys, fields, identifiers, and tool names are unchanged |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The root benchmark boundary has a complete, evidence-pinned naming census.
- **SC-002**: No root artifact is missed and no create-benchmark packet resource is double-counted.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Pinned root benchmark baseline | Empty result may be mistaken for missing work | Record full listing and count, including `.gitkeep` |
| Risk | `create-benchmark/` is conflated with root `benchmark/` | Cross-phase rename collision | Use exact path ownership in the manifest |
| Risk | Hidden/generated artifact is missed | Gate reports false clean state | Include hidden files and reference search in census |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. A non-empty root benchmark baseline requires a manifest amendment before execution.
<!-- /ANCHOR:questions -->
