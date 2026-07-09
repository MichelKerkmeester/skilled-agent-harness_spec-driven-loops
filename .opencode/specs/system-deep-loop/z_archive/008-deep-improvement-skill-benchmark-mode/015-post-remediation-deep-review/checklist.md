---
title: "Verification Checklist: Post-Remediation Dual-Model Deep Review"
description: "QA checklist: both loops complete, per-model reports synthesized, cross-model comparison recorded, read-only invariant held, packets well-formed."
trigger_phrases:
  - "post-remediation deep review checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/015-post-remediation-deep-review"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the verification checklist"
    next_safe_action: "Verify each item after both loops finish"
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
# Verification Checklist: Post-Remediation Dual-Model Deep Review

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- Read-only check: `git status --short -- .opencode/skills/deep-improvement` is empty after the run.
- Packet check: each `review-*/deep-review-state.jsonl` parses; the registry holds the iteration summaries.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-01 [P1] Xiaomi Token Plan authed; live id `mimo-v2.5-pro` confirmed via `opencode models` (both passes use MiMo).
- [x] CHK-02 [P1] Driver parameterized + `node --check` clean; 015 phase home created.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-03 [P2] Each iteration prompt focused the v1.11.1.0 remediation files; both passes' top findings landed on them.
- [x] CHK-04 [P2] Both packets well-formed (config/state/registry/deltas/iterations/dashboard all present, 5 dashboard rows each).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-05 [P0] MiMo-v2.5-pro run 1 completed its 5 iterations; report synthesized (0 P0 / 8 P1 / 15 P2).
- [x] CHK-06 [P0] MiMo-v2.5-pro run 2 completed its 5 iterations; report synthesized (0 P0 / 2 P1 / 12 P2). (Replaced the aborted MiniMax-M3 pass.)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-07 [P0] **REQ-001** both passes complete; each has a synthesized `review-report.md` (verdict CONDITIONAL).
- [x] CHK-08 [P1] **REQ-004** run-to-run comparison (overlap / pass-unique / verdict) recorded in implementation-summary.
- [x] CHK-09 [P1] **REQ-003** no new P0 either pass; the should-fix set = 3 stable findings (criteria-exec default, §11 script list, greedy grader regex) + run-2's grader cache-key catch. No regression from the remediation.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-10 [P0] **REQ-002** read-only: the loops wrote only their `015/review-*/` packets; the only skill diff is the external `1.12.0.0` version bump (+ parallel-session benchmark files), none from the reviews.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-11 [P2] Both review-reports carry a CONDITIONAL verdict + ranked findings with `file:line` evidence.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-12 [P2] Artifacts confined to `015/review-mimo-v25pro/` + `015/review-mimo-v25pro-run2/` + the 015 packet docs.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
- Complete. Both MiMo passes ran 5 iterations (run 1: 0 P0 / 8 P1 / 15 P2; run 2: 0 P0 / 2 P1 / 12 P2); both verdicts CONDITIONAL with no blocker and no regression. Run-to-run comparison recorded — both run-2 P1s overlap run 1 (criteria-exec default + SKILL.md §11 script list), the greedy grader regex re-surfaced, and run 2 added a grader cache-key catch. Read-only invariant held (reviews wrote only `015/`). CHK-01..12 all verified. (MiniMax-M3 pass aborted + replaced with MiMo run 2.)
<!-- /ANCHOR:summary -->
