---
title: "Tasks: Post-Remediation Dual-Model Deep Review"
description: "Task breakdown: provider pre-flight + driver setup, the two parallel cli-opencode deep-review loops (MiMo-v2.5-pro + MiniMax-M3, 5 iterations each), and the per-model report synthesis + cross-model comparison."
trigger_phrases:
  - "post-remediation deep review tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/015-post-remediation-deep-review"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Listed tasks"
    next_safe_action: "Await both loops; synthesize + compare"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "post-remediation-deep-review"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Tasks: Post-Remediation Dual-Model Deep Review

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` done · `[~]` in progress. Tasks map to the plan's phases.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-101 Pre-flight: confirmed Xiaomi Token Plan provider authed; live id `xiaomi-token-plan-ams/mimo-v2.5-pro` via `opencode models`. (MiniMax-M3 was also confirmed but its pass was later aborted.)
- [x] T-102 Parameterized the cli-opencode deep-review driver (model/variant/output-dir/session/iterations); `node --check` clean; created the 015 phase home.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-201 MiMo-v2.5-pro run 1 (`--variant high`) 5-iteration loop → `review-mimo-v25pro/`; done (0 P0 / 8 P1 / 15 P2).
- [x] T-202 MiMo-v2.5-pro run 2 (`--variant high`) 5-iteration loop → `review-mimo-v25pro-run2/`; done (0 P0 / 2 P1 / 12 P2). Replaced the aborted MiniMax-M3 pass.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-301 Synthesized each pass's `review-report.md` (verdict CONDITIONAL + ranked findings with file:line) from its registry.
- [x] T-302 Run-to-run comparison (overlap / pass-unique / verdict) recorded in implementation-summary; read-only confirmed (skill diff is only the external version bump; loops wrote only `015/`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Done when both loops have run their iterations, each model has a synthesized `review-report.md`, the cross-model comparison + combined verdict is recorded, and the read-only invariant is confirmed (the deep-improvement skill is unchanged).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Review target: `skill:deep-improvement` (v1.11.1.0). Remediation under review: sibling phase `014-d4r-grader-fidelity-remediation`. Prior single-model review: `013/review/review-report.md`.
<!-- /ANCHOR:cross-refs -->
