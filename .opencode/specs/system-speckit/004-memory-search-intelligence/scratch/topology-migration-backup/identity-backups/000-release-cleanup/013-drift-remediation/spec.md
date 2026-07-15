---
title: "Feature Specification: 028 Drift Remediation"
description: "Phase-parent track remediating all 175 converged 028 drift-audit findings (6 P0 / 91 P1 / 78 P2) across six phase children; gpt-5.5 high implements, opus verifies, the ledger tracks every finding to terminal."
trigger_phrases:
  - "028 drift remediation"
  - "feature specification: 028 drift remediation"
  - "drift fix verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/000-release-cleanup/013-drift-remediation"
    last_updated_at: "2026-07-04T17:31:29.681Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the remediation track"
    next_safe_action: "Work phase 001 (P0s)"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: 028 Drift Remediation

<!-- ANCHOR:metadata -->
## 1. METADATA
Phase-parent track. Lean trio at parent; heavy docs in the phase children.
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
The 028 drift audit produced 175 converged findings (6 P0 / 91 P1 / 78 P2).
### Purpose
Fix and verify every finding, tracked to terminal status in remediation-ledger.jsonl.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
The six phase children and the ledger.
### Out of Scope
New features; anything not cited by an audit finding.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## 4. PHASE MAP
- 001-p0-fixes — 6 findings
- 002-stale-db-and-tool-count-sweep — 10 findings
- 003-opencode-go-and-codex-pins — 16 findings
- 004-tool-grant-reconciliation — 25 findings
- 005-spec-housekeeping — 35 findings
- 006-remaining-p1-p2 — 83 findings
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:questions -->
## 5. OPEN QUESTIONS
None.
<!-- /ANCHOR:questions -->
