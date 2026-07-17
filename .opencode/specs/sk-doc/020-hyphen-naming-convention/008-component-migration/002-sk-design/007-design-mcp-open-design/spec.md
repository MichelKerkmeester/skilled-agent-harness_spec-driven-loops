---
title: "Feature Specification: Design-mcp-open-design (032 phase 007)"
description: "The nested Open Design transport packet contains underscore-bearing install, transport-reference, and shell-helper names, and the shell helper is sourced by multiple scripts."
trigger_phrases:
  - "design-mcp-open-design naming phase"
  - "sk-design design-mcp-open-design phase"
  - "032 design-mcp-open-design"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/007-design-mcp-open-design"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored design-mcp-open-design spec"
    next_safe_action: "Execute phase on pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-mcp-open-design/README.md"
      - ".opencode/skills/sk-design/design-mcp-open-design/references/"
      - ".opencode/skills/sk-design/design-mcp-open-design/scripts/doctor.sh"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Design-mcp-open-design (032 phase 007)

> Phase 007 of the sk-design component migration under `sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design`. This document defines the future execution scope; this authoring pass performs no migration.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/007-design-mcp-open-design |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-design |
| **Origin** | Phase 7 of the sk-design subtree in the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The nested Open Design transport packet contains underscore-bearing install, transport-reference, and shell-helper names, and the shell helper is sourced by multiple scripts.

**Purpose:** Rename the transport packet's non-exempt filesystem names to kebab-case, choose a valid target for the private shell helper, and update all transport references.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Apply the phase-local decision record: use common.sh rather than an invalid leading-hyphen target.
- Rename the install guide and all listed reference files, then update README.md, scripts, shellcheck directives, and local links.
- Preserve shell behavior, executable bits, source order, tool surfaces, frontmatter fields, and transport identifiers.
- Keep catalog/playbook work in the later sibling phases.

### Live candidate boundary
- `INSTALL_GUIDE.md` → `INSTALL-GUIDE.md`
- `references/cli_child_pairing.md`, `design_parity_transport.md`, `freshness_invalidation.md`, `guarded_proxy.md`, `inner_generator_binding.md`, `mcp_wiring.md`, `od_cli_reference.md`, `smart_router_pseudocode.md`, and `tool_surface.md` become hyphenated
- `scripts/_common.sh` → `scripts/common.sh`; `doctor.sh` and `install.sh` stay exact while their source and shellcheck references change
- Feature-catalog and manual-testing-playbook paths remain owned by phases 008 and 009

### Out of Scope
- Changing Open Design CLI/MCP behavior, daemon paths, tool names, or shell helper logic.
- Feature-catalog, manual-testing-playbook, shared, benchmark, changelog, Python, and package-manifest surfaces.
- Renaming tool-mandated SKILL.md, mode-registry.json, or package manifest names.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|-------|-------|-------|
| REQ-001 | The transport reference map is complete. | All underscore-bearing reference paths plus INSTALL_GUIDE.md and _common.sh have explicit target/disposition entries. |
| REQ-002 | The shell helper remains sourceable. | doctor.sh and install.sh source common.sh, shellcheck points to common.sh, and mode/executable behavior is preserved. |
| REQ-003 | The target naming decision is documented. | The phase decision record explains why common.sh is the valid target and why -common.sh is rejected. |
| REQ-004 | Transport references remain resolvable. | README.md, reference links, and script-adjacent path values contain no stale old path. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The transport packet outside catalog/playbook is kebab-clean, with common.sh as the deliberate leading-underscore resolution.
- **SC-002**: Shell source and shellcheck references resolve and preserve executable behavior.
- **SC-003**: The decision record, path map, and stale-reference sweep are attached to the phase evidence.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|-------|-------|-------|-------|
| Risk | A mechanical underscore substitution creates -common.sh. | High | Use the decision record and semantic map; reject leading-hyphen targets before rename execution. |
| Risk | A shell source reference is missed because it is not Markdown. | High | Sweep shell, shellcheck, and README references separately and run shell syntax checks after execution. |

Dependencies: the canonical convention and exemption boundary in `001-convention-policy-and-scope/`; the pinned BASE and rename-map evidence from the program's earlier baseline/tooling phases; and the sibling handoffs named in this phase's plan.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- No blocking questions; the helper target is resolved in the phase decision record.
<!-- /ANCHOR:questions -->
