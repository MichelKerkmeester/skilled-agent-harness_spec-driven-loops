---
title: "Implementation Plan: system-deep-loop subtree skill gate (017 phase 007/011)"
description: "Plan for aggregating phases 001-010 and running one read-only, exemption-aware whole-surface naming and reference gate. This phase performs no new migration work."
trigger_phrases:
  - "system-deep-loop skill gate implementation plan"
  - "deep loop subtree rollup gate"
  - "whole surface kebab-case verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/011-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/011-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored subtree gate phase plan"
    next_safe_action: "Aggregate sibling evidence and run the subtree gate"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: System-deep-loop subtree skill gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Complete `.opencode/skills/system-deep-loop/` plus phases 001-010 evidence |
| **Change class** | Read-only rollup verification |
| **Execution** | Pinned candidate/base comparison using the frozen map and exemption manifest |
| **Verification** | Sibling evidence, whole-tree naming scan, reference resolution, route/scenario/benchmark parity |

### Overview

Aggregate each child checklist and report, then scan the entire system-deep-loop surface rather than only changed files. The gate fails on an in-scope snake_case name, unresolved path, missing sibling evidence, zero discovery result, or unexpected mutation; it performs no repair.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Phases 001-010 have their authored L2 docs, checklists, and execution evidence available.
- [ ] The frozen map, exemption manifest, BASE/candidate SHAs, and generated-output dispositions are pinned.
- [ ] Whole-surface path/reference and behavior baselines are available.

### Definition of Done

- [ ] Every sibling has one accepted evidence row or an explicit blocking discrepancy.
- [ ] The scope-aware whole-tree naming scan reports zero in-scope snake_case names.
- [ ] References, routes, scenario IDs, benchmark paths, and parity gates are green with non-zero discovery.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Evidence aggregation**: reconcile each child owner, map hash, checklist status, and discrepancy before scanning the tree.
- **Scope-aware scan**: exclude Python/package, tool-mandated, generated/lockfile, identifier/key, and frozen-history classes explicitly.
- **Reference closure**: resolve Markdown, resource-map, module, shell, package, playbook, benchmark, and registry path consumers.
- **Read-only gate**: report findings to the owning child; do not alter the skill surface during rollup verification.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load phases 001-010 checklists/reports, frozen map, exemption manifest, and BASE/candidate SHAs.
- [ ] Confirm the scan root includes hub, shared, runtime, five packets, root playbook, and root benchmark.

### Phase 2: Core Implementation

- [ ] Aggregate sibling P0/P1 evidence and reconcile ownership/discrepancy rows.
- [ ] Run the full exemption-aware filesystem-name scan and the whole-surface reference resolver.
- [ ] Compare routes, resource discovery, test/scenario counts, benchmark paths/scores, and required parity against BASE.

### Phase 3: Verification

- [ ] Reject zero-file/zero-scenario scans and any stale or missing child receipt.
- [ ] Confirm no unexpected tracked mutation after verification.
- [ ] Emit one gate result with all receipts and owning phase for every failure.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Sibling evidence | Reconcile phases 001-010 checklist P0/P1 status, map hashes, SHAs, and discrepancies. |
| Naming gate | Scan all filesystem paths under the skill and report zero in-scope snake_case names after exclusions. |
| Reference integrity | Resolve all active path/link/import/registry consumers and report stale targets by owning phase. |
| Behavior parity | Run hub routes, workflow discovery, runtime tests, playbook IDs, benchmark paths/scores, and non-zero checks. |
| Non-mutation | Verify the rollup left no unexpected tracked mutation and did not repair findings. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Impact if Blocked |
|------------|------|-------------------|
| Phases 001-010 evidence | Internal | The aggregate gate cannot prove ownership or completeness. |
| Frozen map and exemption manifest | Internal | The naming scan cannot distinguish violations from allowed names. |
| Whole-surface resolver and behavior baselines | Internal | Clean paths cannot be separated from silently broken consumers. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any scan/reference/behavior failure or unexpected mutation.
- **Procedure**: No migration rollback is performed here; pin the finding to its owning child phase, stop the gate, and rerun the read-only rollup after that child supplies a corrected candidate.
<!-- /ANCHOR:rollback -->
