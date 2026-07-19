---
title: "Feature Specification: mcp-tooling hub root and shared naming closure (020 phase 001)"
description: "The mcp-tooling hub owns routing metadata and shared navigation for three independent packets, but its root-level path ownership is not explicitly separated from the component and playbook phases. This phase classifies root/shared filesystem names, preserves exact tool contracts, and closes the hub's path references."
trigger_phrases:
  - "mcp-tooling hub root naming"
  - "mcp-tooling shared assets kebab-case"
  - "020 mcp-tooling phase 001"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored phase 001 from the mcp-tooling root census"
    next_safe_action: "Execute the root/shared census and path-reference closure"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/SKILL.md"
      - ".opencode/skills/mcp-tooling/README.md"
      - ".opencode/skills/mcp-tooling/hub-router.json"
      - ".opencode/skills/mcp-tooling/mode-registry.json"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: mcp-tooling Hub Root and Shared Naming Closure

> Phase adjacency under the 006-mcp-tooling parent: predecessor 005-rename-and-reference-tooling; successor 002-mcp-chrome-devtools.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/001-hub-root-and-shared |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 001 of the mcp-tooling component naming migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The mcp-tooling hub's routing documents refer to child packet paths, while the root surface also acts as the shared navigation boundary for those packets. The current baseline has no physical root-level shared/ directory, so the phase must distinguish real root/shared candidates from the hub-level manual-testing-playbook and benchmark trees owned by later child phases. Without that classification, a root sweep could rename the wrong child surface or change a tool-mandated contract.

This phase leaves the hub routable with kebab-case filesystem paths, preserves exact contract names, and records a zero-candidate result for any absent shared directory instead of creating a synthetic one.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The root-owned files under .opencode/skills/mcp-tooling/: SKILL.md, README.md, description.json, graph-metadata.json, hub-router.json, and mode-registry.json, for path-reference review.
- Any physically present root shared/ assets or references discovered by the execution census; the current baseline has no shared/ directory.
- Root path values and Markdown links that point to mcp-chrome-devtools, mcp-click-up, mcp-figma, manual-testing-playbook, or benchmark.
- The semantic source-to-target inventory for root/shared candidates.

### Out of Scope
- The root manual_testing_playbook/ tree, owned by phase 005.
- The benchmark/ tree, owned by phase 006.
- The three component packet trees, owned by phases 002-004.
- Renaming SKILL.md, mode-registry.json, JSON keys, frontmatter fields, or code identifiers.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/mcp-tooling/SKILL.md | Modify | Update root-owned path references only |
| .opencode/skills/mcp-tooling/README.md | Modify | Update navigation paths only |
| .opencode/skills/mcp-tooling/hub-router.json | Modify | Update path values while preserving routing keys |
| .opencode/skills/mcp-tooling/mode-registry.json | Modify | Update path values while preserving registry field names |
| .opencode/skills/mcp-tooling/shared/ | Rename if present | Rename real shared assets or references identified by the frozen map; no directory is created if absent |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Classify every root/shared filesystem candidate | The execution census records each candidate as rename, exempt, frozen, generated, or tool-mandated, and records that shared/ is absent at the current baseline |
| REQ-002 | Rename only in-scope root/shared names | Every renamed root/shared segment uses a semantic kebab-case target; no child phase surface is moved early |
| REQ-003 | Close root path references | SKILL.md, README.md, router metadata, and path-valued fields resolve to the post-rename child locations |
| REQ-004 | Preserve exact contracts and identifiers | SKILL.md and mode-registry.json remain exact filenames; JSON/YAML/TOML keys, frontmatter fields, and routing identifiers are unchanged |
| REQ-005 | Prove the hub still routes | Parent-hub checks and path/link scans pass with non-zero discovered route resources |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Root/shared candidates have a complete classified rename map with no synthetic shared tree.
- **SC-002**: All root-owned route references resolve after the child phases' canonical names are applied.
- **SC-003**: Tool-mandated filenames and non-filesystem identifiers remain byte-for-byte unchanged.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The phase depends on the frozen map and the 020 exemption boundary. The primary risk is accidentally absorbing the root playbook, benchmark, or component trees into this phase; the mitigation is a path-owner allowlist checked before any rename. A second risk is changing JSON keys while updating path values; the mitigation is a key-versus-value diff review.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The current census answers the only surface question: no physical root-level shared/ directory exists.
<!-- /ANCHOR:questions -->
