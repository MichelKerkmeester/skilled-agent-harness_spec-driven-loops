---
title: "Task Breakdown: code-review Routing Optimization"
description: "Task-level status for wiring code-review's orphan references, aligning its gold, and re-benchmarking."
trigger_phrases:
  - "code-review optimization tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-smart-routing-benchmark-program/002-code-review-optimization"
    last_updated_at: "2026-07-09T05:03:21Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the code-review routing-optimization tasks"
    next_safe_action: "Wire orphan refs into intents, align gold, re-benchmark"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/code-review/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01Ht7J9NZTEBBXwzTeNvras9"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions:
      - "Wire orphans + map ALWAYS into intents; no thoroughness change — operator-locked"
---
# Task Breakdown: code-review Routing Optimization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation
Legend: `[x]` done · `[~]` in progress · `[ ]` not started.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Phase 1: Router
- [~] Add `CORE`/`COMPLETENESS`/`PR_STATE`/`SETUP` intents + RESOURCE_MAP entries (additive only)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase 2: Gold
- [~] Prepend `review_core` + `review_ux_single_pass` to each of the 7 scenarios' `expected_resources`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Phase 3: Re-benchmark
- [ ] Mode-A (verdict PASS, D5 = 100, D3 > 0)
- [ ] Mode-B live (aggregate materially above 69)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [~] Orphans wired, gold aligned, re-benchmark captured, parent meter updated.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent program**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
