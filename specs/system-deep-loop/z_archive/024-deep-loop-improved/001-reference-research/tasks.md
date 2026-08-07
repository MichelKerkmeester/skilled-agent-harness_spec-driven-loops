---
title: "Tasks: Reference Research — Loop-Systems Improvement"
description: "Task ledger for the 51-iteration deep-research run mining loop-cli-main + kasper."
trigger_phrases:
  - "loop reference research tasks"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/001-reference-research"
    last_updated_at: "2026-07-02T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored real task ledger from research artifacts"
    next_safe_action: "No implementation action remaining"
    blockers: []
    key_files:
      - ".opencode/specs/system-deep-loop/024-deep-loop-improved/001-reference-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-content-remediation-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Reference Research — Loop-Systems Improvement

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Vendor `external/loop-cli-main` and `external/kasper` reference codebases into the packet.
- [x] T002 Author `research/deep-research-config.json` and `research/deep-research-strategy.md` (segment progression S1-S6, dimension rotation D1-D4, wildcards W-06/W-10).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run iterations 1-25 (S1-S2: mine `loop-cli-main` and `kasper` source). Evidence: `research/iterations/iteration-001.md` through `iteration-025.md`.
- [x] T004 Run iterations 26-45 (S3-S4: map mechanisms to OUR runtime/workflows/speckit surfaces). Evidence: `research/iterations/iteration-026.md` through `iteration-045.md`.
- [x] T005 Run iterations 46-51 (S5-S6: cross-cutting themes and synthesis, `proper_count >= 50` gate reached). Evidence: `research/iterations/iteration-046.md` through `iteration-051.md`.
- [x] T006 Maintain `findings-registry.json` and per-iteration delta files throughout. Evidence: `research/deltas/`, `research/findings-registry.json`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Confirm zero early-stop events across all 51 iterations. Evidence: `research/deep-research-state.jsonl` final `convergenceScore` 0.66, terminated on the proper-count gate not convergence.
- [x] T008 Synthesize and rank the final 40-item backlog with evidence citations. Evidence: `research/research.md` (40 items, each with reference `file:line`, OUR target file, difficulty tag).
- [x] T009 Author `research/resource-map.md` coverage map from convergence evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed (`validate.sh --strict` exits 0 for this folder).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->
