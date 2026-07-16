---
title: "Tasks: Resolve system-deep-loop archive gap and active discontinuity (decision-gated)"
description: "Task breakdown for verifying the archive/active number sets, tracing both discontinuities to git history evidence, and gating further action on an operator decision between Option A and Option B."
trigger_phrases:
  - "system-deep-loop renumber tasks"
  - "archive gap tasks"
  - "decision gate tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/002-system-deep-loop-renumber"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Completed setup and investigation tasks"
    next_safe_action: "Present decision gate T009 to operator"
    blockers:
      - "T009 blocked on operator decision (Option A vs Option B)."
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the operator select Option A or Option B?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Resolve system-deep-loop archive gap and active discontinuity (decision-gated)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

**Setup / Verification**

- [x] T001 `ls z_archive/`, extract and sort 3-digit prefixes, confirm the exact set `001`-`011`, `013`-`023` (22 folders, `012` missing)
- [x] T002 `ls system-deep-loop/` (active track), extract and sort 3-digit prefixes, confirm the exact set `029, 030, 031, 032, 033, 035, 038, 052, 054, 059, 063, 065, 066, 067, 068` (15 folders)
- [x] T003 Confirm no overlap between archive (`≤023`) and active (`≥029`) number sets
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Root-Cause Investigation**

- [x] T004 `git log --all --full-history` on the exact former `z_archive/012-deep-improvement-guarded-refine-hardening` path; identify the deleting commit `418edf13d87ff7235e8ccf713d2c8c5faf1afe04` and read its full message
- [x] T005 `git log --diff-filter=R --summary --all` over `z_archive/*` to confirm the prior bulk archive renumber (old scheme → `001`-`023`) and specifically that old-scheme `027-deep-improvement-guarded-refine-hardening` became new-scheme `012-...`
- [x] T006 [P] Sample-trace 5 internal active gaps (`034`, `036`, `037`, `051`, `055`) via `find`-by-slug and `git log --diff-filter=R`; confirm all 5 resolved to nested locations under commit `233ea9564bb` ("regroup flat spec folders into phase-parents")
- [x] T007 Attempt to trace the pre-active-start gap (`024`-`028`) via `git log --diff-filter=R`; record as UNKNOWN (no rename evidence found)
- [x] T008 Note the stale `graph-metadata.json` `children_ids` entries (nested-away paths still listed flat, plus one untraceable `133-runtime-remediation-from-dogfood-findings` entry) as a related, out-of-scope finding
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**Decision Gate**

- [B] T009 Present Option A (recommended, minimal — document gaps, archive-012 already investigated and closed, no active renumber) vs Option B (full active renumber `029→024`..., very-high-blast, not recommended) to the operator (blocked on operator response)
- [ ] T010 Record the operator's answer in this packet's `_memory.continuity.answered_questions`
- [ ] T011 [B] If Option A selected: confirm no further execution packet is required (optional: add a short historical note inside `z_archive` if the operator wants one there too)
- [ ] T012 [B] If Option B selected: scaffold a new, separately-scoped implementation packet (NOT an expansion of this packet's scope) covering the full ~15-packet / ~5,000-file renumber, its own inventory, dry-run, and rollback plan
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks marked `[x]` with evidence in `checklist.md`
- [ ] T009 (decision gate) answered by the operator — this is the one task allowed to remain `[B]` blocked at packet handoff
- [ ] Strict packet validation passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
