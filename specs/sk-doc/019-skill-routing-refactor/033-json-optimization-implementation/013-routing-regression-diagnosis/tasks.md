---
title: "Task Breakdown: Routing Regression Diagnosis and Disposition"
description: "Tasks for routing regression diagnosis and disposition."
trigger_phrases:
  - "regression diagnosis task breakdown"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/013-routing-regression-diagnosis"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Diagnosed and fixed the routing regression"
    next_safe_action: "Proceed to phase 014"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/013-routing-regression-diagnosis"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Task Breakdown: Routing Regression Diagnosis and Disposition

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Reproduce the full metric set at HEAD and record it with the corpus file hashes alongside [evidence: `evidence/capture-before-fix.json` — 51/72, 8/11, hashes recorded]
- [x] T-02 Confirm the corpus hashes match the pinned values, voiding the comparison if they do not [evidence: corpus/holdout/ambiguity sha256 byte-identical to `002-baseline-capture/baseline/` pins; comparison valid]
- [x] T-03 Enumerate every prompt whose prediction differs from the baseline, with expected, baseline and current values [evidence: `diagnosis-results.md` §2 — `MiniMax-M3` and `Kimi`, both expected `cli-opencode`, with baseline/pre-fix/post-fix predictions]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-04 Bisect each changed prompt across the skill-root metadata surface and the advisor scorer surface separately [evidence: reverting only the scorer path (metadata held at HEAD) closed the full drop → scorer surface, `diagnosis-results.md` §3]
- [x] T-05 Check out and measure the baseline sha to establish whether holdout top-1 was already 51/72 before the program [evidence: pin captured at `capturedAtSha 1e0ad1d9ba` = 53/72, not 51 → caused, not inherited; rebuild infeasible/redundant per Amendment A-001]
- [x] T-06 Record the disposition — fix scorer, fix metadata, or accept with rationale — against what the bisect attributed [evidence: ADR-004 in `decision-record.md` — fix scorer path]
- [x] T-07 If the disposition is fix, land it as one revertible commit behind the corpus gate [evidence: `executor-delegation.ts` path literal corrected; single revertible change verified behind the capture gate]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-08 Re-measure the full metric set and compare against both the pin and the pre-fix state [evidence: `diagnosis-results.md` §1 table — post-fix 53/55/10 equals the pin, up from pre-fix 51/53/8; other metrics held]
- [x] T-09 Confirm no baseline artifact was modified during the phase [evidence: `git status` clean for `002-baseline-capture/`; `--write` never run — CHK-019]
- [x] T-10 State any remaining shortfall numerically rather than describing it qualitatively [evidence: no shortfall — all three regressed metrics restored exactly to pin; the only residual (codex-abstain miss) was pre-existing at 10/11 and is stated as such, not as a shortfall of this fix]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The full metric set is captured with corpus hashes before any change; every changed prompt is enumerated individually; attribution names a commit or states UNKNOWN; the baseline sha is measured directly to settle caused-versus-inherited; and every file under the baseline directory is byte-identical at close.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements and acceptance criteria
- `plan.md` — architecture, sequencing and rollback
- `../spec.md` — parent program
<!-- /ANCHOR:cross-refs -->
