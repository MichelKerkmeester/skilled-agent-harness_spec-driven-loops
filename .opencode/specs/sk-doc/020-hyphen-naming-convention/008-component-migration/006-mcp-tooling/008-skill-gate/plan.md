---
title: "Implementation Plan: mcp-tooling subtree rollup gate (032 phase 008)"
description: "This plan aggregates the sibling SOL contracts and runs the complete exemption-aware naming and reference checks for mcp-tooling without adding a new migration batch."
trigger_phrases:
  - "mcp-tooling subtree gate plan"
  - "mcp tooling rollup verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/008-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/008-skill-gate"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the mcp-tooling rollup gate plan"
    next_safe_action: "Aggregate sibling evidence before the whole-surface scan"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/"
      - ".opencode/skills/mcp-tooling/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: mcp-tooling Subtree Rollup Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Entire .opencode/skills/mcp-tooling subtree and sibling phase evidence |
| **Change class** | Read-only rollup verification |
| **Execution** | Aggregate evidence, then run the exemption-aware whole-surface gate |

### Overview
The rollup gate does not provide another rename batch. It first checks the P0/P1 state of phases 001-007, then scans every mcp-tooling path and reference against the frozen 032 exemption set. Any failure is returned to the owning phase; phase 008 never repairs a leftover path opportunistically.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] All sibling checklists and candidate reports are available
- [ ] BASE SHA and final rename-map hash are recorded
- [ ] The mcp-tooling root and all three component boundaries are known
- [ ] Exemption and frozen-history rules are loaded

### Definition of Done
- [ ] Every sibling P0 item passes with evidence
- [ ] Whole-surface naming and reference scans are clean
- [ ] The gate performs no new migration mutation
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Evidence aggregation**: read phases 001-007 checklists, maps, counts, and reports; fail closed on missing P0 evidence.
- **Naming gate**: scan all mcp-tooling descendants and classify remaining underscores through the 032 exemption boundary.
- **Reference gate**: resolve cross-component Markdown links, path-valued metadata, route resources, catalog/playbook indexes, and benchmark references.
- **Mutation guard**: compare the candidate tree before and after verification and reject any gate-created rename or repair.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Pin the candidate and BASE SHAs and record the final map hash
- [ ] Load sibling checklists and confirm non-zero evidence for applicable scenario/catalog checks
- [ ] Build the rollup path inventory with delegated/frozen/exempt classes

### Phase 2: Implementation
- [ ] Aggregate phase 001-007 status and evidence
- [ ] Run the whole mcp-tooling naming scan
- [ ] Run the cross-surface link, route, catalog/playbook, and benchmark reference scans
- [ ] Do not edit or rename any target path in response to a finding

### Phase 3: Verification
- [ ] Confirm zero in-scope snake_case filesystem names
- [ ] Confirm all remaining underscores have approved classifications
- [ ] Confirm all references resolve and all sibling P0 checks remain green
- [ ] Confirm verification caused no tracked mutation
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Sibling evidence | Phases 001-007 P0/P1 state and report integrity | checklist aggregation, evidence ledger |
| Naming | All mcp-tooling filesystem descendants and exemption classes | scope-aware guard, find, git ls-files |
| References | Links, route resources, catalog/playbook indexes, benchmark paths | Markdown/link resolver, JSON parser, rg |
| Mutation | Gate creates no rename or repair | git status, git diff-index |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001-007 | Internal | Required | No valid rollup evidence |
| Final 032 rename map | Internal | Required | Cannot classify the full surface |
| Exemption/frozen-history policy | Program rule | Required | False positives or missed debt |
| Scope-aware naming/reference gates | Internal verifier | Required | Whole-surface cleanliness cannot be proven |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any gate-created mutation, missing sibling evidence, in-scope snake_case name, unresolved reference, or unclassified exemption.
- **Procedure**: Discard only the gate's unauthorized mutation, route the finding to the owning phase, and rerun the rollup after that phase supplies corrected evidence.
<!-- /ANCHOR:rollback -->
