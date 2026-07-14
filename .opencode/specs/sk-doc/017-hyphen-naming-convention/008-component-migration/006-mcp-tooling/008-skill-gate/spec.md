---
title: "Feature Specification: mcp-tooling subtree rollup gate (017 phase 008)"
description: "The mcp-tooling subtree needs one blocking rollup contract after its independent hub, component, playbook, benchmark, and changelog phases. This gate performs no new migration work; it aggregates sibling evidence and proves that the complete in-scope surface is kebab-clean with the 017 exemption set intact."
trigger_phrases:
  - "mcp-tooling skill gate"
  - "mcp tooling subtree rollup"
  - "017 mcp tooling phase 008"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling/008-skill-gate"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored phase 008 as the mcp-tooling subtree rollup gate"
    next_safe_action: "Aggregate sibling checklists and run the whole-surface naming scan"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling/spec.md"
      - ".opencode/specs/sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling/001-hub-root-and-shared/checklist.md"
      - ".opencode/specs/sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling/007-changelog-verify/checklist.md"
      - ".opencode/skills/mcp-tooling/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: mcp-tooling Subtree Rollup Gate

> Phase adjacency under the 006-mcp-tooling parent: predecessor 007-changelog-verify; successor None.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling/008-skill-gate |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 008 of the mcp-tooling component naming migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The sibling phases prove separate dependency closures, but their evidence does not by itself prove that the full mcp-tooling surface is free of in-scope snake_case names or stale cross-phase references. A rollup gate must also distinguish exempt Python/tool/frozen names from unresolved migration debt and must not perform a final cleanup rename outside the approved sibling scopes.

This phase aggregates the eight-child packet, runs the whole-subtree naming and reference checks, and blocks handoff until every sibling contract and the complete exemption-aware surface scan are green.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The eight sibling phase checklists and their evidence.
- Every filesystem name under .opencode/skills/mcp-tooling/ for the exemption-aware rollup scan.
- Cross-component Markdown links, path-valued metadata, route resources, catalog/playbook discovery, and benchmark boundary evidence.
- Confirmation that tool-mandated names, Python paths/package directories, generated/lockfile output, and frozen changelog history are excluded correctly.

### Out of Scope
- Any new rename, reference rewrite, changelog edit, code change, or repair of an individual sibling phase.
- Renaming code identifiers, JSON/YAML/TOML keys, frontmatter fields, Python files/package directories, tool-mandated names, or frozen history.
- Other 017 component-migration subtrees and the central whole-repo gate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| 001-*/checklist.md through 007-*/checklist.md | Read | Aggregate sibling P0/P1 evidence |
| .opencode/skills/mcp-tooling/ | Read | Run the complete exemption-aware filesystem/reference scan |
| 008-skill-gate/checklist.md | Read/Record | Record rollup evidence; the gate performs no migration mutation |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Aggregate sibling completion | Phases 001-007 have passing P0 checks, evidence, and no unresolved blocker |
| REQ-002 | Prove whole-surface naming cleanliness | The exemption-aware scan finds zero in-scope snake_case filesystem names under mcp-tooling |
| REQ-003 | Prove reference closure | Markdown links, path-valued metadata, routes, catalog/playbook indexes, and benchmark references resolve |
| REQ-004 | Reconcile exemptions | Every remaining underscore is classified as Python, package, tool-mandated, generated/lockfile, frozen, or otherwise approved |
| REQ-005 | Keep the gate mutation-free | Phase 008 performs no new rename or repair and leaves the tracked surface unchanged after verification |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All sibling phase contracts are complete and evidence-pinned.
- **SC-002**: The whole mcp-tooling surface is kebab-clean outside the approved exemption set.
- **SC-003**: Cross-surface references resolve and the rollup gate introduces no migration changes.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main risk is allowing the rollup gate to become an unreviewed cleanup phase. The checklist therefore fails on any remaining in-scope name and routes the finding back to the owning sibling instead of authorizing an opportunistic rename. A second risk is treating every underscore as debt; the final scan must use the 017 exemption and frozen-history boundary.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Any failure is an evidence or scope finding for the owning sibling phase, not new work for the rollup gate.
<!-- /ANCHOR:questions -->
