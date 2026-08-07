---
title: "Implementation Plan: Phase Documentation Map and Completion-Pct Sync"
description: "Plan for backfilling 40 stale phase-map rows and 50+ stale completion_pct fields via a reusable sync script."
trigger_phrases:
  - "phase documentation map sync plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/009-research-backlog-remediation/004-phase-doc-map-and-completion-pct-sync"
    last_updated_at: "2026-07-01T07:30:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan"
    next_safe_action: "Dispatch implementation to MiMo v2.5 ultraspeed via cli-opencode"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase Documentation Map and Completion-Pct Sync

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Write a Node/TS script that, given a phase-parent path: globs its `[0-9]{3}-*/` children, reads each child's `spec.md` METADATA table Status field (regex on the `| **Status** |` row) and its `implementation-summary.md` presence/completion_pct, then (a) rewrites the parent's own Phase Documentation Map table row for that child to the real status, and (b) if the child's own frontmatter `completion_pct` disagrees with what its `implementation-summary.md` implies (100 when a summary exists and claims completion), rewrites the child's frontmatter too. Run it against phases 002-007.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Idempotent (second run = no-op).
- Never overwrites a genuinely in-progress child to "Complete."
- `validate.sh --recursive` clean after.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Read-status-from-source-of-truth, not assume.** The child's own `spec.md` Status field (and `implementation-summary.md` presence) is authoritative; the parent's map is what gets corrected, never the reverse.
- **One script, two write targets.** Same read pass drives both the phase-map row rewrite and the continuity `completion_pct` backfill, since both bugs share the same root cause (nothing re-syncs after completion).
- **Script lives alongside existing spec-kit scripts**, not as a one-off throwaway, so it can be rerun for future phases without re-deriving the logic.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Write the script with a dry-run mode first (print diffs without writing).
2. Unit-test it against fixture folders (a stale-Draft case, an already-correct case, an in-progress case that must NOT be overwritten).
3. Dry-run against phases 002-007; manually spot-check the printed diff for sanity.
4. Run for real; verify with `validate.sh --recursive`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

1. Fixture-based unit tests: stale-Draft-row gets corrected; already-correct row is a no-op; in-progress child is never force-completed.
2. Idempotency test: run twice, second run's diff is empty.
3. Manual spot-check of at least 3 real edited files across different phases post-run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Depends on 001-003 (Tier 0) having landed first, per the parent phase's own transition rule — this phase trusts the doc-hygiene tooling Tier 0 fixed.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit touching the 40+ edited spec.md files plus the new script. All edits are field-level text changes with the old values visible in git history.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## 8. AFFECTED SURFACES (reference)

| Surface | Change |
|---------|--------|
| `.opencode/skills/system-spec-kit/scripts/spec/sync-phase-map-status.ts` (new) | The sync script |
| `024-deep-loop-improved/{002..007}/spec.md` | Phase map rows |
| `024-deep-loop-improved/{002..007}/**/spec.md` | `completion_pct` frontmatter |
<!-- /ANCHOR:affected-surfaces -->
