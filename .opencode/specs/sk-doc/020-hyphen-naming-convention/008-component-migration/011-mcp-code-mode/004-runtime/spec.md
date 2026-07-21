---
title: "Feature Specification: mcp-code-mode runtime (020 component 011 phase 004)"
description: "The runtime tree must be checked independently because hook and library paths are executed by Node and referenced by manual scenarios. The current runtime names are already kebab-case, so this phase records a zero-candidate proof at the pinned baseline and closes any runtime path references if a later inventory reveals an eligible name."
trigger_phrases:
  - "mcp-code-mode runtime naming"
  - "mcp-code-mode phase 004"
  - "runtime kebab-case audit"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/004-runtime"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored runtime audit docs"
    next_safe_action: "Execute the runtime census after earlier closures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: mcp-code-mode runtime
> Phase adjacency — predecessor `003-references-and-assets`; successor `005-manual-testing-playbook`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/004-runtime |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 004 of the 020 mcp-code-mode component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The runtime tree contains executable hook and library files whose paths are embedded in manual scenarios and can be loaded directly by Node. A runtime rename that misses one consumer would break the route guard, while a broad underscore sweep could alter executable semantics or exempt identifiers.

The current tree is already compliant: runtime/hooks/claude/mcp-route-guard.cjs, runtime/hooks/codex/mcp-route-guard.cjs, runtime/lib/mcp-route-guard.cjs, and runtime/lib/mcp-route-guard.test.cjs contain no eligible snake_case filesystem name. This phase makes that result verifiable and applies a targeted closure only if the pinned execution census differs.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- runtime/hooks/claude/mcp-route-guard.cjs.
- runtime/hooks/codex/mcp-route-guard.cjs.
- runtime/lib/mcp-route-guard.cjs and runtime/lib/mcp-route-guard.test.cjs.
- Any additional runtime directory or filename with an eligible underscore discovered by the pinned census, plus active references to it.
- Node syntax, runtime path, and manual-scenario reference evidence for the runtime files.

### Out of Scope
- The manual-playbook file plugins_and_hooks/mcp_route_guard.md and its category tree, which phase 005 owns.
- Python files and package directories, identifiers, environment variable names, JSON/YAML/TOML keys, frozen changelogs, and generated metadata content.
- The mcp-server, scripts, references/assets, other skills, and any migration execution during this authoring pass.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The runtime tree is completely classified | The census lists both hook adapters and both library files and has no unknown filesystem name |
| REQ-002 | Eligible runtime names use kebab-case | The current empty rename set is accepted only when the census proves every observed runtime name is compliant or exempt |
| REQ-003 | Any discovered runtime rename has a complete reference closure | Active manual-scenario, guide, test, and loader references contain no stale eligible path |
| REQ-004 | Runtime behavior is preserved | node --check and the runtime route-guard test path pass without changing tool names, decisions, or environment contracts |
| REQ-005 | The phase leaves explicit evidence | The report records the runtime inventory, map result, reference dispositions, and verification exit codes |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The runtime tree has zero in-scope snake_case filesystem names, with the current compliant tree explicitly evidenced.
- **SC-002**: Every active runtime path resolves and the route-guard executable/test contracts remain unchanged.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main risk is a false no-op: a runtime path can be compliant while a consumer still points to a prior name. The phase depends on the semantic reference checker, Node syntax/test tooling, and the earlier package/scripts/reference closures; phase 005 owns the manual-playbook filenames themselves.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; the execution census is authoritative if the runtime tree changes before this phase runs.
<!-- /ANCHOR:questions -->
