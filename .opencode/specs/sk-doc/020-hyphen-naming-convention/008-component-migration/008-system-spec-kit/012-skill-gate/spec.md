---
title: "Feature Specification: System-spec-kit skill gate (020 subtree 008 phase 012)"
description: "This rollup gate aggregates phases 001-011 and verifies that the complete system-spec-kit naming surface is kebab-clean outside the declared exemption set. It adds no migration work: acceptance depends on sibling evidence, a scope-aware whole-tree scan, reference closure, and coherent release evidence."
trigger_phrases:
  - "system-spec-kit skill gate"
  - "system-spec-kit subtree naming gate"
  - "kebab-clean system-spec-kit"
  - "system-spec-kit phase 012"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/012-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored system-spec-kit gate docs"
    next_safe_action: "Aggregate phases 001-011 and run the scope-aware naming gate"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: System-spec-kit skill gate

> Rollup gate under the 008 system-spec-kit subtree. No new migration work is introduced here.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/012-skill-gate |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | system-spec-kit |
| **Origin** | Phase 012 rollup gate for the complete 008 system-spec-kit component surface |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The sibling phases own independent path families, so a green local phase does not by itself prove that the complete system-spec-kit surface has no remaining in-scope snake_case filesystem name or stale path reference. This phase provides the single blocking rollup contract: every sibling phase must supply evidence, and a whole-tree scan must distinguish true candidates from Python, tool-mandated, generated, lockfile, vector/checkpoint, test-magic, and frozen-history exemptions.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Aggregate the checklists, maps, reference ledgers, zero-candidate report, changelog evidence, and scoped diffs from phases 001-011.
- Scan the complete `.opencode/skills/system-spec-kit/` tree for permitted snake_case filesystem names and unresolved active references.
- Confirm the program exemption set is applied consistently and no unknown disposition is accepted.
- Record the final subtree result for the parent packet.

### Out of Scope
- Any new filesystem rename, consumer rewrite, release edit, or source-content change.
- Reopening a sibling concern without evidence of a rollup failure.
- Treating Python `.py` files/package directories, tool-mandated names, generated/lockfile/vector/checkpoint artifacts, test magic, identifiers/keys, or frozen history as in-scope candidates.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every sibling phase is accepted. | Phases 001-011 each have a passing blocking checklist and evidence ledger. |
| REQ-002 | The whole naming surface is clean. | The scope-aware scan finds no in-scope snake_case filesystem name anywhere under system-spec-kit. |
| REQ-003 | Active references are closed. | No unresolved active path, link, registry, manifest, runner, or path-valued consumer points to an old permitted name. |
| REQ-004 | Exemptions are fail-closed. | Every remaining underscore-bearing name is classified as an allowed exemption or blocks acceptance as unknown. |
| REQ-005 | Release evidence agrees. | Phase 011 evidence covers the complete subtree and matches the candidate version metadata. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phases 001-011 have complete, evidence-pinned acceptance results.
- **SC-002**: The whole system-spec-kit scan is kebab-clean within the exemption boundary.
- **SC-003**: Active references and path-valued consumers have no unresolved permitted old paths.
- **SC-004**: The final report contains no unknown candidate or contradictory sibling status.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

A broad scan can produce false failures by counting generated databases, lockfiles, Python packages, test magic, or tool names; a narrow scan can miss an owned path family. The gate therefore requires both sibling evidence and an explicit disposition ledger, and it fails closed on unknown paths, stale reports, or contradictory release evidence.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No blocking questions. The gate executor must use the pinned candidate/base context and preserve the final scan, ledger, sibling-status matrix, and release evidence as the rollup record.
<!-- /ANCHOR:questions -->
