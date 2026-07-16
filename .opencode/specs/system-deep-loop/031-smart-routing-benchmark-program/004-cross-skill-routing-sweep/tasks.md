---
title: "Task Breakdown: Cross-Skill Routing Sweep"
description: "Task-level status for the review-hardened cross-skill routing sweep: diagnostic, triage, hand-sweep, optimizer, fan-out."
trigger_phrases:
  - "cross-skill routing sweep tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-smart-routing-benchmark-program/004-cross-skill-routing-sweep"
    last_updated_at: "2026-07-09T06:41:48Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran Phase 0 read-only triage for the cross-skill routing sweep"
    next_safe_action: "Hand-sweep deep-improvement, then build the optimizer from two shapes"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/routing_optimization.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01Ht7J9NZTEBBXwzTeNvras9"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions:
      - "D3 = Option G + non-scoring diagnostic; detector-first / hand-sweep-hardest — two fresh reviews converged"
---
# Task Breakdown: Cross-Skill Routing Sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation
Legend: `[x]` done · `[~]` in progress · `[ ]` not started.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Phase 0: Diagnostic + triage (read-only)
- [x] Non-scoring `D3-ex-default` diagnostic computed per skill (artifact vs genuine)
- [~] Orphan classification (routable / exempt / prune) for all 27 orphans
- [~] Per-skill DEFAULT-tier leanness recorded (all 1-2 files -> gold=design honest)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase 1: Detector + hand-sweep
- [ ] Read-only detector
- [ ] Hand-sweep deep-improvement (independent sign-off)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Phase 2-3: Optimizer + fan-out + baselines
- [ ] Optimizer on 2 shapes + negative test
- [ ] Fan-out remaining skills (human-approved patches)
- [ ] Re-baseline + CI gate + doctrine update
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [~] Phase 0 triage produced; downstream phases gated on operator go-ahead.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Audit worklist**: See `../003-routing-optimization-mode/assets/cross-skill-routing-audit.md`
<!-- /ANCHOR:cross-refs -->
