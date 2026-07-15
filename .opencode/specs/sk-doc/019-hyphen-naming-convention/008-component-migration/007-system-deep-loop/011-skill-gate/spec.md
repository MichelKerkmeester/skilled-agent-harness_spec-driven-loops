---
title: "Feature Specification: system-deep-loop subtree skill gate (017 phase 007/011)"
description: "The system-deep-loop subtree needs one blocking rollup gate after its ten scoped child phases. This verification-only phase aggregates sibling evidence and proves the complete surface has no in-scope snake_case filesystem name outside the 017 exemption set, with no new rename work."
trigger_phrases:
  - "system-deep-loop skill gate"
  - "deep loop subtree naming gate"
  - "system-deep-loop kebab-case rollup"
  - "deep loop zero snake filesystem check"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/007-system-deep-loop/011-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/007-system-deep-loop/011-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored subtree gate phase spec"
    next_safe_action: "Aggregate sibling evidence and run the subtree gate"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This child performs rollup verification only and adds no new migration work."
      - "The gate covers siblings 001-010 and the complete .opencode/skills/system-deep-loop surface."
      - "Python/package, tool-mandated, generated/lockfile, identifier/key, and frozen-history exemptions are scope-aware."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: System-deep-loop subtree skill gate

> Final child under the system-deep-loop component parent: predecessor `010-changelog-verify`; successor `None`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-hyphen-naming-convention/008-component-migration/007-system-deep-loop/011-skill-gate |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | system-deep-loop |
| **Origin** | Rollup gate phase 011 of the system-deep-loop component migration under the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The ten preceding children own different path closures: hub/shared, runtime, five workflow packets, the root playbook, root benchmark storage, and changelog evidence. A child can pass while another subtree or a cross-child reference still carries an in-scope underscore name; the final gate therefore needs to aggregate every sibling receipt and scan the complete skill surface under one exemption-aware contract.

This phase verifies sibling completion, reference integrity, exact-name exemptions, and whole-surface kebab cleanliness. It performs no new rename or repair.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The phase reports/checklists for `001-hub-root-and-shared` through `010-changelog-verify`, including any declared decision records and the final changelog/version evidence.
- The complete `.opencode/skills/system-deep-loop/` tree: hub, shared, runtime, all five workflow packets, root manual-testing playbook, root benchmark storage, and active path consumers.
- A scope-aware filesystem-name scan that excludes Python `.py` files/package directories, tool-mandated names, generated/lockfile output, identifiers/data keys, and frozen history.
- Whole-surface path/reference, link, route, scenario, benchmark, and behavior-parity receipts needed by the parent packet.

### Out of Scope

- Any new filesystem rename, reference rewrite, code change, benchmark mutation, changelog rewrite, or sibling repair.
- Reclassifying a name without evidence from the frozen map or changing the program exemption boundary.
- Files outside `.opencode/skills/system-deep-loop/` except the child packet evidence needed for aggregation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-010 child checklists and reports` | Verification input | Confirm every owned phase has blocking evidence and no unresolved discrepancy. |
| `.opencode/skills/system-deep-loop/` | Verification target | Prove the complete naming and reference surface is clean within scope. |
| `011-skill-gate/checklist.md` | Acceptance contract | Record the aggregate gate evidence; do not mutate the skill surface. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every sibling phase is complete or explicitly blocked | The gate report has one evidence row for phases 001-010, including checklist P0/P1 status and any approved discrepancy. |
| REQ-002 | The whole skill surface is kebab-clean within scope | The scan reports zero in-scope snake_case filesystem names outside the declared exemption/frozen/generated/tool classes. |
| REQ-003 | Cross-child references resolve | Active Markdown links, resource maps, imports/requires, package paths, playbook indexes, benchmark paths, and registry consumers have zero unresolved renamed targets. |
| REQ-004 | Behavior and coverage remain intact | Hub routes, workflow resource discovery, runtime tests, playbook scenario IDs, benchmark corpus/report paths, and required parity counts are non-zero and match their baselines. |
| REQ-005 | The gate is non-mutating | Verification leaves no unexpected tracked mutation and records findings for repair rather than repairing them inside the rollup phase. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All sibling evidence is present, internally consistent, and accepted by the rollup checklist.
- **SC-002**: The entire system-deep-loop surface contains zero in-scope snake_case filesystem names.
- **SC-003**: Path/reference, route, scenario, benchmark, and behavior gates are green with no hidden zero-scan result.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The rollup can produce a false green if it scans only changed files, treats a zero-file scan as success, or accepts sibling reports without checking their path ownership. The gate depends on the frozen map, all phase reports, the exemption manifest, and the whole-surface reference checker. It must remain read-only so a failure cannot hide the evidence it was meant to inspect.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Any discrepancy belongs in the gate report with its owning child phase; this child does not create a new migration scope.
<!-- /ANCHOR:questions -->
