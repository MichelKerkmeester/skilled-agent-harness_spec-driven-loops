---
title: "Implementation Plan: Convergence Threshold Alignment and Forced-Depth Flag"
description: "Plan for aligning convergence-threshold defaults and documenting --stop-policy."
trigger_phrases:
  - "convergence threshold alignment plan"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/009-research-backlog-remediation/008-convergence-threshold-and-forced-depth-flag"
    last_updated_at: "2026-07-01T08:10:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan"
    next_safe_action: "Dispatch implementation to MiMo v2.5 ultraspeed via cli-opencode"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Convergence Threshold Alignment and Forced-Depth Flag

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Read `deep-research/SKILL.md`'s "Convergence Threshold Semantics" section to confirm 0.05 is the intended canonical default (it explicitly states this). Change `fanout-run.cjs:846`'s `?? 0.1` to `?? 0.05`. Then add `--stop-policy <convergence|max-iterations>` to the argument-hint line and a flag-table row in both `research.md` and `review.md`, describing exactly what this session already confirmed operationally: `max-iterations` makes convergence telemetry-only and forces the loop to `config.maxIterations`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Confirmed 0.05 (not 0.1) is the documented-correct default before changing.
- Flag documentation matches actual observed behavior (already operationally verified this session).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Verify before flipping the default.** Don't assume which value is "wrong" — read the semantics doc as the tie-breaker.
- **Document what's already proven to work**, don't redesign the flag — it's already correctly implemented and was used successfully this session.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Read `SKILL.md` semantics section; confirm the correct default direction.
2. Fix the fanout-run.cjs default.
3. Document `--stop-policy` on both commands.
4. Run relevant tests.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

1. Existing fanout-run tests should still pass; add/adjust one asserting the new 0.05 default when no `--convergence` is given.
2. Manual read-through confirming the documented flag table is accurate.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## 8. AFFECTED SURFACES (reference)

| Surface | Change |
|---------|--------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Default value fix |
| `.opencode/commands/deep/research.md`, `.opencode/commands/deep/review.md` | Flag documentation |
<!-- /ANCHOR:affected-surfaces -->
