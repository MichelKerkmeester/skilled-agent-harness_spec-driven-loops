---
title: "Implementation Plan: Skill Routing Optimization Mode"
description: "Plan to add a routing-optimization capability + command to deep-improvement Lane C: cross-skill audit, methodology reference, and an optimize mode that proposes router/gold fixes and re-baselines."
trigger_phrases:
  - "routing optimization mode plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/003-routing-optimization-mode"
    last_updated_at: "2026-07-09T05:03:26Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the routing-optimization-mode plan"
    next_safe_action: "Implement the optimize mode + command; run the cross-skill audit"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01Ht7J9NZTEBBXwzTeNvras9"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions:
      - "Optimize parent-router + per-child routing in deep-improvement with a command — operator-locked"
---
# Implementation Plan: Skill Routing Optimization Mode

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---
<!-- ANCHOR:summary -->
## 1. SUMMARY
Extend Lane C from diagnose-only to diagnose-and-optimize: a cross-skill audit, a methodology reference, and an `optimize` command mode that proposes router/gold fixes (apply behind a flag) and re-baselines.
<!-- /ANCHOR:summary -->

---
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- Propose-by-default; apply only behind an explicit flag.
- Every proposed change re-benchmarks + passes the drift guard before it is kept.
- The methodology carries an explicit anti-gaming guard.
<!-- /ANCHOR:quality-gates -->

---
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
The mode reads the benchmark's own signals — D5 orphan_reference, D3 over-routing, gold-vs-router-load gap — and maps each to a concrete fix class (orphan-wiring, ALWAYS-mapping, gold-alignment, over-routing gating). The parent hub stays a union projection of its children (existing drift guard). code-review (packet 002) is the worked reference example.
<!-- /ANCHOR:architecture -->

---
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Cross-skill routing audit (all children + both hubs).
2. Methodology reference + Lane C SKILL.md note.
3. Command optimize mode (argument-hint + propose/apply posture).
<!-- /ANCHOR:phases -->

---
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
The audit is validated against the known code-review defects; the command mode is exercised in propose (dry) form; any applied fix is gated by re-benchmark + drift guard.
<!-- /ANCHOR:testing -->

---
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| Lane C benchmark engine (D5/D3) | Met | The signals the mode consumes |
| code-review worked example (002) | In progress | The reference the methodology cites |
<!-- /ANCHOR:dependencies -->

---
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
- **Trigger**: The optimize mode proposes a metric-gaming or misrouting change.
- **Procedure**: The mode never auto-applies; drop the proposal. Revert the command/reference docs if needed.
<!-- /ANCHOR:rollback -->
