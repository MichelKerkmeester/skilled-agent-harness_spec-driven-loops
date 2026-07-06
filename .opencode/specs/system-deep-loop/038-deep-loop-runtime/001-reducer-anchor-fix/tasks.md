---
title: "Tasks: Deep Research Reducer-Anchor Template Fix (028/004)"
description: "Task Format: T### [P?] Description (file path), all tasks DONE, recorded against commit 738e118751"
trigger_phrases:
  - "reducer anchor fix tasks"
  - "Q6 anchor tasks"
  - "deep research strategy template tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-deep-loop-runtime/001-reducer-anchor-fix"
    last_updated_at: "2026-06-19T08:10:00+02:00"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-1 tasks for the DONE Q6-anchor fix, pre-checked with evidence"
    next_safe_action: "None, all tasks COMPLETE (commit 738e118751)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-001-replan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Research Reducer-Anchor Template Fix (028/004)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

> All tasks below are COMPLETE. The Q6-anchor candidate landed in commit `738e118751` (recorded). This sub-phase documents the shipped fix against that commit.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the 7 reducer-target anchor ids + call sites (`.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:734-745`), verified: `key-questions`, `answered-questions`, `what-worked`, `what-failed`, `exhausted-approaches`, `ruled-out-directions`, `next-focus`
- [x] T002 Confirm the shipped template carried ZERO anchor markers pre-fix (`.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md`), grep count = 0
- [x] T003 [P] Reference the hand-patched working copy for the target shape (`.opencode/specs/system-deep-loop/038-deep-loop-runtime/research/deep-research-strategy.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Wrap `key-questions` heading (§3) in its `ANCHOR:key-questions` / `/ANCHOR:key-questions` HTML-comment pair (`deep_research_strategy.md`), commit `738e118751`
- [x] T005 Wrap `answered-questions` heading (§6) in its anchor pair (`deep_research_strategy.md`), commit `738e118751`
- [x] T006 Wrap `what-worked` heading (§7) in its anchor pair (`deep_research_strategy.md`), commit `738e118751`
- [x] T007 Wrap `what-failed` heading (§8) in its anchor pair (`deep_research_strategy.md`), commit `738e118751`
- [x] T008 Wrap `exhausted-approaches` heading (§9) in its anchor pair (`deep_research_strategy.md`), commit `738e118751`
- [x] T009 Wrap `ruled-out-directions` heading (§10) in its anchor pair (`deep_research_strategy.md`), commit `738e118751`
- [x] T010 Wrap `next-focus` heading (§11) in its anchor pair (`deep_research_strategy.md`), commit `738e118751`
- [x] T011 Preserve all existing headings + the `<!-- MACHINE-OWNED: START -->` marker (additive-only, no heading moved/renamed)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Verify the template now carries 14 anchor-marker comments (7 pairs), grep of the open-marker comment = 14 (all 7 ids present at lines 39/58/66/74/82/98/106)
- [x] T013 Verify each of the 7 ids matches `replaceAnchorSection`'s regex (no `Missing anchor section` throw on a fresh copy), reducer regex verified against all 7 (030 §14: "reducer regex verified (all 7 match)")
- [x] T014 Confirm template-only diff, no runtime-code change, commit `738e118751` touches only `deep_research_strategy.md` (+14) plus the 030 scaffold. `reduce-state.cjs` unchanged
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Reducer regex matches all 7 anchor ids on the shipped template (no `Missing anchor section` on a fresh copy)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Shipped record**: Wave-0 record (commit `738e118751`)
<!-- /ANCHOR:cross-refs -->
