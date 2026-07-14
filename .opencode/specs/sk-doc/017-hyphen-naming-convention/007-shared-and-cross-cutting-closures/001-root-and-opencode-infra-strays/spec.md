---
title: "Feature Specification: root and OpenCode infrastructure strays (017 phase 007 child 001)"
description: "Root-level and `.opencode` infrastructure names with snake_case that are not owned by one skill need an exemption-aware, reference-closed filesystem-name contract before downstream component work consumes them."
trigger_phrases:
  - "root and OpenCode infrastructure strays"
  - "hyphen naming root infrastructure closure"
  - "phase 007 root infra"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/007-shared-and-cross-cutting-closures"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/007-shared-and-cross-cutting-closures/001-root-and-opencode-infra-strays"
    last_updated_at: "2026-07-14T17:28:55Z"
    last_updated_by: "codex"
    recent_action: "Authored the root and OpenCode infrastructure closure contract"
    next_safe_action: "Execute the root-infrastructure closure from the frozen rename map"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/_routes.yaml"
      - ".opencode/commands/create/assets/create_feature_catalog_auto.yaml"
      - ".opencode/install_guides/install_scripts/_utils.sh"
      - "PUBLIC_RELEASE.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This child covers only root-level and `.opencode` infrastructure outside one skill-owned subtree"
      - "`.utcp_config.json`, `.mcp.json`, Python files, Python package directories, generated output, and frozen history are not rename candidates"
      - "Cross-skill symlink edges are handed to child 002 instead of being partially moved here"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Root and OpenCode Infrastructure Strays

> Child adjacency under the 007 parent (grouping order, not a runtime dependency): sibling `002-cross-skill-symlink-closure`; shared-script and active-spec closures are `003-hoisted-shared-script-closures` and `004-active-specs-and-docs`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/007-shared-and-cross-cutting-closures/001-root-and-opencode-infra-strays |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc / shared OpenCode infrastructure |
| **Origin** | Child 001 of the 007 shared and cross-cutting dependency-closures phase |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Root-level and `.opencode` infrastructure paths contain naming candidates outside a single skill-owned subtree. Examples include `.opencode/commands/doctor/_routes.yaml`, `.opencode/commands/create/assets/create_feature_catalog_auto.yaml`, `.opencode/install_guides/install_scripts/_utils.sh`, and the root-level `PUBLIC_RELEASE.md`. These names are consumed by shared dispatch, install, and release surfaces, so a local filesystem change can leave stale path values or silently alter an exact-name contract.

This child defines the census, semantic rename map, reference closure, and downstream handoff for those unowned infrastructure candidates. It describes the work only; no filesystem change is performed by this authoring pass.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-level filesystem-name candidates selected by the frozen 017 map.
- `.opencode/commands/**`, `.opencode/install_guides/**`, and adjacent `.opencode` infrastructure names not owned by one skill subtree.
- Command assets, install-guide scripts, shell sources, registries, and path-valued documentation that point at those candidates.
- Explicit classification of every observed candidate as rename, exempt, frozen, generated, or tool-mandated.
- A handoff of any cross-skill symlink edge to `002-cross-skill-symlink-closure`.

### Out of Scope
- Skill-owned files under `.opencode/skills/**`; shared script closures belong to child 003.
- Active spec folders and authored spec documents; those belong to child 004.
- Symlink target/link-node movement; child 002 owns the atomic symlink contract.
- Python `.py` files, Python import-package directories, tool-mandated names, generated/lockfile output, changelogs, `z_archive/`, and completed history.
- Code identifiers, JSON/YAML/TOML keys, frontmatter fields, and database columns.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Root-level candidate paths from the frozen map | Rename | Apply only explicitly classified in-scope filesystem-name targets |
| `.opencode/commands/**` infrastructure assets | Rename/reference rewrite | Keep command dispatch paths and asset references aligned |
| `.opencode/install_guides/**` infrastructure paths | Rename/reference rewrite | Keep installer and shell-source paths aligned |
| Root and `.opencode` path-valued references | Reference rewrite | Update path values without changing identifiers or data keys |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Build a complete root/infrastructure candidate ledger | Every candidate under the scoped root and `.opencode` surfaces is listed exactly once with its classification and evidence; no unknown bucket remains |
| REQ-002 | Use a semantic source-to-target map for in-scope names | Each rename has an explicit target, collision result, and rationale; no blanket underscore substitution creates leading-hyphen or malformed names |
| REQ-003 | Close command, installer, shell, registry, and documentation references | The reference checker resolves every changed path and reports zero broken in-scope references after the planned closure |
| REQ-004 | Preserve exemptions and exact-name contracts | `.utcp_config.json`, `.mcp.json`, Python files/package directories, generated/lockfile output, tool-mandated names, and frozen surfaces remain unchanged |
| REQ-005 | Isolate cross-boundary edges for the symlink child | Any link-node or target outside this child is recorded with its edge and handed to child 002; execution never leaves a partial pointer update |
| REQ-006 | Publish a downstream closure handoff | The handoff identifies changed paths, unchanged exemptions, reference evidence, and dependencies that phase 008 component children can declare |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the pinned BASE and frozen map, **when** the root/infrastructure census runs, **then** every scoped candidate has exactly one classification and every excluded name has an exemption reason.
- **SC-002**: **Given** an in-scope root or `.opencode` candidate, **when** its semantic target is applied, **then** the target is kebab-case, collision-free, and safe for leading-underscore and tool-contract edge cases.
- **SC-003**: **Given** a command asset, installer, shell source, registry, or path-valued document referencing a changed candidate, **when** the closure checker runs, **then** it resolves to the target with no stale source path.
- **SC-004**: **Given** a tool-mandated or Python exemption, **when** the closure map is applied, **then** the name and its contract remain byte-for-byte and path-for-path unchanged.
- **SC-005**: **Given** a cross-skill symlink edge, **when** child 001 closes its ledger, **then** the edge is handed to child 002 with enough path and mode evidence for atomic execution.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Impact | Mitigation |
|-------------------|--------|------------|
| The root or `.opencode` census includes a tool-mandated exact name | A rename can break startup, dispatch, or packaging | Classify exact-name contracts before producing rename targets; require an exemption reason |
| A shared asset points into a skill-owned subtree | A local update can split a dependency closure | Record the edge and hand it to child 002 or 003 rather than editing it here |
| A leading underscore is converted mechanically | The target can become an invalid or ambiguous path | Require semantic targets and collision checks from phase 005 |
| Phase 006 map or phase 005 tooling is unavailable | Execution cannot prove completeness | Block execution until the frozen map, BASE, and reference checker are pinned |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Execution resolves individual candidate dispositions from the frozen map and records any newly discovered edge in the child handoff rather than expanding scope silently.
<!-- /ANCHOR:questions -->
