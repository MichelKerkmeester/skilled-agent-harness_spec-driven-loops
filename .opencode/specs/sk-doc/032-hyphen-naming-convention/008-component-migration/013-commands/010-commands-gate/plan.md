---
title: "Implementation Plan: commands subtree rollup gate (032 phase 008/013/010)"
description: "Aggregate child checklists, scan the complete commands tree, and issue a blocking naming and reference closure verdict without performing migration work."
trigger_phrases:
  - "commands rollup gate plan"
  - "command subtree verification plan"
  - "commands kebab closure plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands/010-commands-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands/010-commands-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored commands rollup plan"
    next_safe_action: "Collect all sibling command evidence"
    blockers: []
    key_files:
      - ".opencode/commands/"
      - "008-component-migration/013-commands/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Commands subtree rollup gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

The gate is a read-only acceptance pass over the ten sibling phases and the complete commands surface. It verifies checklist receipts, ownership uniqueness, kebab-case closure, exemption evidence, reference integrity, collision results, and behavior evidence. It produces no new migration edits.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] All nine migration/audit children have accepted checklists and evidence.
- [ ] The merged manifest covers every file and directory exactly once.
- [ ] Each remaining exception has a policy-backed reason and evidence.

### Definition of Done

- [ ] Whole-tree scans and behavior checks pass with pinned BASE/candidate receipts.
- [ ] No active old path, duplicate owner, unclassified name, or unresolved child blocker remains.
- [ ] The final report identifies PASS or the owning child and blocker without editing sibling files.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Child phases own local migration decisions; this phase owns only aggregation and independent whole-surface verification. Its manifest must preserve the distinction between filesystem names, public command IDs, semantic keys, generated output, fixtures, and tool-mandated paths.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Collect each sibling checklist, disposition map, exception ledger, test receipt, and scoped diff.
- [ ] Pin the BASE and candidate revisions and confirm the complete `.opencode/commands/**` inventory.

### Phase 2: Implementation

- [ ] Merge maps and reject missing rows, conflicting owners, or unresolved statuses.
- [ ] Scan `.opencode/commands/**` for underscore-bearing basenames and compare every result with the exemption ledger.

### Phase 3: Verification

- [ ] Run whole-tree active-path, link, and reference checks, exact/casefold/NFC collision checks, and relevant command behavior/reference checks.
- [ ] Issue PASS only when every blocking condition is satisfied; otherwise identify the owning child and blocker.
- [ ] Publish the rollup evidence without performing migration edits.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The gate requires an inventory count, ownership-uniqueness result, snake_case scan, exemption ledger, old/new path search, link resolution, command discovery, relevant checker/self-test output, collision results, and behavior receipts. The gate report must pin BASE/candidate revisions and the path-scoped diff.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child checklists `001-create-namespace` through `009-command-assets` | Internal | Required | The rollup cannot accept child evidence or ownership. |
| Program policy and exemptions | Internal | Required | Remaining underscore names cannot be classified safely. |
| Commands inventory and reference surfaces | Local | Required | Whole-tree naming and active-path closure cannot be proven. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The gate makes no migration changes. If its evidence is inconsistent, retain the child state, identify the failing owner, and rerun the gate after that child supplies corrected evidence; do not edit command files from the rollup phase.
<!-- /ANCHOR:rollback -->
