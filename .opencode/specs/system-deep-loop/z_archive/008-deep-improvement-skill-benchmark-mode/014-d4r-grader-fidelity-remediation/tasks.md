---
title: "Tasks: D4-R Grader Fidelity + Doc Reconciliation Remediation"
description: "Task breakdown: worktree setup, the gpt-5.5 outsourced remediation of all 28 findings (5 workstreams), and the reviewed integration into main with full-suite + drift-guard validation."
trigger_phrases:
  - "d4r remediation tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/014-d4r-grader-fidelity-remediation"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Listed tasks"
    next_safe_action: "Await the gpt-5.5 diff; review + integrate"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d4r-grader-fidelity-remediation"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Tasks: D4-R Grader Fidelity + Doc Reconciliation Remediation

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

- [x] T-101 Recorded HEAD baseline `b697b0a1d1` (RM-8 L3); created `wt/0007-d4r-remediation` off it.
- [x] T-102 Composed the RM-8-scoped per-finding remediation prompt (BANNED/ALLOWED + 28 fixes + behavior-preserving + hygiene + Gate-3 pre-answer).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-201 WS-1 grader fidelity — `dimId` threaded through compose + all fallbacks + cache key in `harness.cjs`; `normalizeParsedPayload` stamps/normalizes dim on every path; no hardcoded 'D4'; real dispatch moved to verified `--append-system-prompt`.
- [x] T-202 WS-2 answer fairness — named `GRADED_RESPONSE_MAX_CHARS=8000` cap; `model || DEFAULT_MODEL`; string-aware `collectBraceBalancedObjects` scan in `live-executor.cjs`.
- [x] T-203 WS-3 doc↔code sync — SKILL.md router runtime_assets branch + 6 scripts; README ref/script/structure/trigger reconciled; scoring_contract funnel + advisorySignals; changelog DEFAULT_D4R_SCENARIOS link.
- [x] T-204 WS-4 hardening — `shellQuote` POSIX-escapes the resume path + ENOENT-vs-parse config diagnostic (`dispatch-model.cjs`); `criteriaExecAllowed` warn+document, default preserved suite-safe (`score-model-variant.cjs`, also removed a pre-existing hygiene-violating comment).
- [x] T-205 WS-5 maintainability — `scoreScenario` split into named helpers (byte-identical formulas); magic numbers named; mode-A aligned to WEIGHTS; `wastedCount` clarified; shared grader-base builder (d4-ablation) + shared event-stream parser (sweep-benchmark).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-301 Reviewed the worktree diff (all 28 fixes, behavior-preserving, hygiene-clean, `--append-system-prompt` flag verified); integrated the 11 files to main — all 11 clean at HEAD `b697b0a1d1`, no collisions with the parallel session.
- [x] T-302 Full suite `npx vitest run` 358/358 + drift guard 4/4 green on main; gpt-5.5 report copied to `proposals/REMEDIATION.md`; worktree + branch removed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Done when all 28 findings are fixed (or explicitly deferred with reason), the full suite is 349+/0 and the drift guard is green on main after a reviewed integration, comment hygiene is clean, and gpt-5.5's per-finding report is preserved in `proposals/`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Findings source: `013-skill-benchmark-fidelity-track/review/review-report.md` (28 findings, 5 workstreams). Spec: `spec.md` (REQ-001..005). Plan: `plan.md`.
<!-- /ANCHOR:cross-refs -->
