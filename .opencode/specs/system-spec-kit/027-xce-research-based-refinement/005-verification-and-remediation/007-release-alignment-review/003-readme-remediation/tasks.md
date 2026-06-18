---
title: "Tasks: README Currency Remediation (Track A)"
description: "Workstream ledger for the Track A README remediation: build briefs, dispatch markdown fixer seats, audit accuracy, correct the long tail, verify, commit."
trigger_phrases:
  - "readme remediation tasks"
  - "track A doc remediation tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/003-readme-remediation"
    last_updated_at: "2026-06-18T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All README remediation tasks completed"
    next_safe_action: "None — track complete"
    blockers: []
    completion_pct: 100
---

# Tasks: README Currency Remediation (Track A)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

- [x] **[P1]** Build per-file confirmed-finding briefs (drop refuted clusters). — `fixers/*.prompt.txt`
- [x] **[P1]** Dispatch markdown fixer seats (pool 10, file-disjoint, gpt-5.5-fast high). — 20 seats, 0 empty
- [x] **[P1]** Collect fixed/refuted reports. — 252 fixed / 8 refuted (both tracks)
- [x] **[P1]** Doc-accuracy audit over the rewrites. — 13 audit seats, 23 wrong flagged / 112 ok
- [x] **[P1]** Correct the audit-flagged wrong values. — 12 correction seats, 22 corrected / 1 reworded
- [x] **[P2]** Verify stale signatures gone (re-grep) + spot-checks. — CLI=37, --agent guidance, rosters confirmed
- [x] **[P1]** Commit scoped + push. — `83f36b8050`, `4fd438323e`
