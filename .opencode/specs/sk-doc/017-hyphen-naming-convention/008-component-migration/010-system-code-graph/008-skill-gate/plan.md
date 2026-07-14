---
title: "Implementation Plan: system-code-graph subtree rollup gate (017 phase 008)"
description: "This plan aggregates phases 001–007 and runs the complete exemption-aware naming and active-reference checks for system-code-graph without adding a new migration batch."
trigger_phrases:
  - "system-code-graph subtree gate plan"
  - "system-code-graph rollup verification"
  - "code graph whole-surface naming gate"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/010-system-code-graph/008-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/010-system-code-graph/008-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored subtree gate plan"
    next_safe_action: "Aggregate sibling checklist evidence"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/017-hyphen-naming-convention/008-component-migration/010-system-code-graph/"
      - ".opencode/skills/system-code-graph/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: system-code-graph Subtree Rollup Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Entire `.opencode/skills/system-code-graph/` tree and phases 001–007 evidence |
| **Change class** | Read-only rollup verification |
| **Execution** | Aggregate sibling evidence, then run the exemption-aware whole-surface gate |

### Overview
The rollup gate does not provide another rename batch. It first checks the P0/P1 state of phases 001–007, then scans
every system-code-graph path and active reference against the frozen 017 exemption set. Any failure is returned to the
owning phase; phase 008 never repairs a leftover path opportunistically.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] All sibling checklists, maps, reports, and applicable counts are available
- [ ] Candidate SHA, BASE SHA, and final rename-map hash are recorded
- [ ] The system-code-graph root and all phase-owned surfaces are known
- [ ] Exemption, frozen-history, and active-reference rules are loaded

### Definition of Done
- [ ] Every sibling P0 item passes with evidence
- [ ] Whole-surface naming and active-reference scans are clean
- [ ] The gate performs no new migration mutation
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Evidence aggregation**: read phases 001–007 checklists, maps, counts, and reports; fail closed on missing P0
  evidence or unresolved blockers.
- **Naming gate**: scan every system-code-graph descendant and classify remaining underscores through the 017
  filesystem exemption boundary.
- **Reference gate**: resolve active Markdown links, path-valued metadata, catalog/playbook indexes, launcher/config
  paths, and cross-phase handoffs while excluding frozen-history content by policy.
- **Mutation guard**: compare the candidate tree before and after verification and reject any gate-created rename,
  reference repair, changelog edit, or code change.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Pin the candidate and BASE SHAs and record the final rename-map hash.
- [ ] Load the seven sibling checklists and confirm non-zero evidence for applicable inventory, link, scenario,
  catalog, and release checks.
- [ ] Build the complete system-code-graph path inventory with delegated, exempt, generated, tool-mandated, and frozen
  classifications.

### Phase 2: Implementation
- [ ] Aggregate phase 001–007 status and fail on missing P0 evidence or unresolved blockers.
- [ ] Run the whole system-code-graph exemption-aware snake_case filesystem scan.
- [ ] Run active Markdown, path-value, catalog/playbook, launcher/configuration, and stale-old-name checks.
- [ ] Do not edit or rename any path in response to a rollup finding.

### Phase 3: Verification
- [ ] Confirm zero in-scope snake_case filesystem names under the system-code-graph root.
- [ ] Confirm all remaining underscores have approved classifications and are not mistaken for path debt.
- [ ] Confirm active references resolve and every sibling P0 contract remains green.
- [ ] Confirm verification caused no tracked mutation.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Sibling evidence | Phases 001–007 P0/P1 state and report integrity | checklist aggregation, evidence ledger |
| Naming | All system-code-graph filesystem descendants and exemption classes | scope-aware guard, find, git ls-files |
| References | Active links, path values, catalog/playbook indexes, launcher/config paths, and stale names | Markdown/path resolver, JSON parser, rg |
| Mutation | Gate creates no rename, repair, or code/doc migration change | git status, git diff-index |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001–007 | Internal | Required | No valid rollup evidence |
| Final 017 rename map | Internal | Required | Cannot classify the full surface |
| Exemption/frozen-history policy | Program rule | Required | False positives or missed debt |
| Scope-aware naming/reference gates | Internal verifier | Required | Whole-surface cleanliness cannot be proven |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any gate-created mutation, missing sibling evidence, in-scope snake_case name, unresolved active
  reference, or unclassified exemption.
- **Procedure**: Discard only the gate's unauthorized mutation if one exists, route the finding to the owning phase, and
  rerun the rollup after that phase supplies corrected evidence.
<!-- /ANCHOR:rollback -->
