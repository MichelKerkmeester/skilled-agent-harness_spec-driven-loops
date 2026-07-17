---
title: "Feature Specification: cli-external-orchestration subtree rollup gate (032 phase 005.008)"
description: "This read-only rollup gate aggregates phases 001–007 and proves that the complete cli-external-orchestration naming surface is kebab-clean within the 032 exemption boundary. It performs no new rename, reference rewrite, changelog repair, or metadata mutation."
trigger_phrases:
  - "cli-external subtree rollup gate"
  - "cli-external kebab-clean verifier"
  - "cli-external phase 008 acceptance"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/008-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/008-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored cli-external rollup gate"
    next_safe_action: "Collect sibling verdicts and final census"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/"
      - ".opencode/skills/cli-external-orchestration/"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/"
      - ".opencode/skills/cli-external-orchestration/cli-claude-code/"
      - ".opencode/skills/cli-external-orchestration/cli-codex/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The gate aggregates sibling evidence and does not absorb new migration work."
      - "Approved Python/package, tool-mandated, generated, frozen, and content-key exemptions remain scope-aware."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: cli-external-orchestration subtree rollup gate

> Final child under the cli-external-orchestration component parent; predecessor `007-changelog-verify`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/008-skill-gate |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | cli-external-orchestration |
| **Origin** | Rollup gate phase 008 of the cli-external-orchestration subtree under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Individual path phases can report success while a path introduced outside their maps, a stale cross-tree reference, an unresolved release contradiction, or an approved exemption is misclassified. The complete surface includes the hub, three CLI components, four playbook trees, and the benchmark boundary, so sibling status alone is insufficient.

This gate joins all sibling evidence with a final scope-aware census and active-reference scan. It returns pass/block evidence and routes failures to the owning child without performing migration work.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read phases 001–007 checklists, path maps, benchmark dispositions, release-evidence matrix, and handoffs.
- Enumerate the complete `.opencode/skills/cli-external-orchestration/` tree, including root files, three CLI components, four playbook roots, and `benchmark/`.
- Reconcile every retained non-kebab filesystem name with an approved 032 exemption, generated/frozen disposition, tool contract, or sibling map.
- Resolve active path references against all sibling source-target maps and verify no stale in-scope source path remains.
- Publish a reproducible pass/block matrix for the parent packet and central validation.

### Out of Scope
- Any new rename, reference rewrite, metadata repair, changelog edit, benchmark/playbook edit, or content migration.
- Changing Python/package names, tool-mandated names, JSON/YAML/TOML keys, code identifiers, frontmatter fields, generated output, or frozen history.
- Absorbing a newly discovered candidate; route it back to its owning phase.

### Files to Inspect

| File Path | Verification |
|-----------|--------------|
| `001-hub-root-and-shared/` through `006-benchmark/` | Read child maps, checklists, and ownership evidence |
| `007-changelog-verify/` | Read four-surface release-evidence matrix and version verdict |
| `.opencode/skills/cli-external-orchestration/` | Run final scope-aware filesystem and active-reference census |
| `001-convention-policy-and-scope/decision-record.md` | Apply the canonical exemption boundary |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 [P0] | Sibling evidence is complete | Every phase 001–007 has a passing blocking checklist, map/evidence handoff, and no unresolved ownership contradiction |
| REQ-002 [P0] | Final naming census is clean | No in-scope authored snake_case filesystem name remains anywhere in the hub, CLI components, playbooks, or benchmark surface outside the approved exemption set |
| REQ-003 [P0] | Active references close | All final source-target maps resolve and no stale active path remains across skill, README, router/resource, playbook, asset, and benchmark consumers |
| REQ-004 [P1] | Exemptions are not over-applied | Every retained non-kebab name has an evidence-backed Python/package, tool-mandated, generated, frozen, or other approved disposition; unknown fails the gate |
| REQ-005 [P1] | Rollup evidence is reproducible | Final census, sibling verdict matrix, map hashes, commands, exit codes, release verdict, and unresolved findings are recorded for central validation |
| REQ-006 [P1] | The gate performs no migration | The gate diff contains no rename, reference rewrite, metadata repair, changelog edit, or content migration |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All sibling P0 contracts pass and their maps do not conflict.
- **SC-002**: The final scope-aware census finds no unknown or in-scope snake_case filesystem name.
- **SC-003**: Active references resolve and the release evidence is coherent.
- **SC-004**: The gate publishes a pass/block handoff without changing the skill surface.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main risk is declaring the subtree clean from child status alone and missing a retained path or stale cross-tree reference. The gate depends on all child evidence and must fail closed on census mismatch, unknown classification, stale link, conflicting map, or unresolved phase 007 release finding.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Any newly discovered path is a gate failure routed to its owner; this phase must not absorb new scope.
<!-- /ANCHOR:questions -->

