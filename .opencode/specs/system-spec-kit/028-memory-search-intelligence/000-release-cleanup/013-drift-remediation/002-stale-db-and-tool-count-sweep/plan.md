---
title: "Implementation Plan: Stale DB-Name and Tool-Count Sweep"
description: "Plan for remediation phase 2: fix and verify 10 findings."
trigger_phrases:
  - "028 drift remediation"
  - "implementation plan: stale db-name and tool-count sweep"
  - "drift fix verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded plan for phase 2"
    next_safe_action: "Execute the fix-verify loop"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

# Implementation Plan: Stale DB-Name and Tool-Count Sweep

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
10 findings, fixed by gpt-5.5-fast (variant high) via cli-opencode, verified by opus.
### Overview
Triage -> fix -> re-verify each finding; batch edits that share a root cause.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
Ledger entries loaded; cited files present.
### Definition of Done
All this phase's entries terminal; validate.sh --strict exit 0; no regressions.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Evidence-driven minimal scoped edits; opus verifies every touched file.
### Key Components
remediation-ledger.jsonl; the cited source files.
### Data Flow
ledger(open) -> triage -> fix -> verify -> ledger(terminal).
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
Single batch for this phase, grouped by shared root cause.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING
opus re-reads each touched file; run affected unit tests / validators where a finding touches code or a test.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
The converged drift-audit findings; cli-opencode (gpt-5.5-fast).
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK
Each fix is a small scoped git diff; revert the specific commit if a regression surfaces.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:l2-phase-deps -->
## 8. PHASE DEPENDENCIES
P0s (phase 1) and the mechanical sweeps (phase 2) land before later phases that depend on the corrected names.
<!-- /ANCHOR:l2-phase-deps -->

<!-- ANCHOR:l2-effort -->
## 9. EFFORT
10 findings; mostly small doc/config edits.
<!-- /ANCHOR:l2-effort -->

<!-- ANCHOR:l2-rollback -->
## 10. ROLLBACK DETAIL
Per-finding revert via its scoped commit; the ledger records what changed.
<!-- /ANCHOR:l2-rollback -->
