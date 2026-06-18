---
title: "Tasks: Code vs sk-code Remediation (Track B)"
description: "Workstream ledger for the Track B code remediation: baseline, dispatch general+sk-code fixer seats, verify tsc/hygiene/syntax/tests, commit."
trigger_phrases:
  - "code remediation tasks"
  - "track B code remediation tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/004-code-remediation"
    last_updated_at: "2026-06-18T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All code remediation tasks completed"
    next_safe_action: "None — track complete"
    blockers: []
    completion_pct: 100
---

# Tasks: Code vs sk-code Remediation (Track B)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

- [x] **[P1]** Build confirmed-finding briefs (C1–C4; drop FP clusters). — `004/fixers` (shared with 003 fleet)
- [x] **[P1]** Dispatch general+sk-code fixer seats (pool 10, file-disjoint). — 19 seats, 0 empty
- [x] **[P0]** Comment-hygiene ephemeral-id cleanup (label dropped, WHY kept). — gate 0 violations / 87 files
- [x] **[P1]** Shell `set -euo pipefail` added where missing. — bash -n clean
- [x] **[P1]** `any[]`→typed public DB row. — `write-provenance.ts`; tsc clean
- [x] **[P1]** Verify tsc (spec-kit/advisor/code-graph) + node/py syntax + spot-test. — all clean; retrieval-rescue 6 passed
- [x] **[P1]** Commit scoped + dist rebuild + push. — `83f36b8050`; 3 dists rebuilt
