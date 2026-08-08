---
title: "Tasks: sk-code Alignment and README Freshness Audit"
description: "Task breakdown for the injection-bloat sk-code alignment audit and the verified must-fix implementation (comment-hygiene label strips and three README corrections)."
trigger_phrases:
  - "sk-code alignment tasks"
  - "readme freshness tasks"
importance_tier: "supporting"
contextType: "tasks"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/008-sk-code-alignment"
    last_updated_at: "2026-08-07T05:30:00Z"
    last_updated_by: "claude"
    recent_action: "Completed audit and must-fix implementation tasks"
    next_safe_action: "Optionally schedule the deferred polish tasks"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/README.md"
    session_dedup:
      fingerprint: "sha256:ce150371171ffce5532a8de34b9c2095f4f74bd0ac515ac7ffdfaab3e8333af1"
      session_id: "2026-08-07-hooks-002-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: sk-code Alignment and README Freshness Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` pending, `[~]` deferred with rationale.
- `T-NNN` task ids are stable within this packet only.
- Each verification task names the command and its observed result.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Seed the packet `spec.md` and generate `description.json` / `graph-metadata.json`
- [x] T-002 Launch the 5-iteration `deepseek-v4-flash` deep-research loop over the committed surface (`--stop-policy max-iterations`)
- [x] T-003 Collect the synthesized findings from `research/lineages/deepseek-flash/research.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-004 Verify each must-fix finding against the real file (labels present, README omissions real, cited API/env names real)
- [x] T-005 Strip the ephemeral `(fix 3)` / `(fix 2)` labels in `spec-gate-core.mjs` (3 comments) and `(P1 fix)` in `mk-spec-gate.js` (1 comment)
- [x] T-006 Add `policy-plan.ts` to both directory trees in `lib/README.md`
- [x] T-007 Add the delivery-observation entrypoint row to `lib/spec-gate/README.md`
- [x] T-008 Add the Spec Gate (Gate-3) env subsection to `ENV-REFERENCE.md`
- [x] T-009 Named the candidate literals with per-file constants (`OBSERVED_ADVISOR_POLICY_CANDIDATE` / `GATE_3_RELAY_CANDIDATE` / `PI_DISPATCH_CANDIDATE`) across the 5 sites; cross-package sharing is not feasible so each is per-file; behavior unchanged, suites green
- [x] T-010 Added the shadow-delta vs shadow-delivery cross-reference note to `lib/shadow/README.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-011 `node --check` both edited code files — OK
- [x] T-012 `grep` sweep confirms 0 ephemeral labels remain across the changed surface
- [x] T-013 `spec-gate-core.test.mjs` — 84 pass, 0 fail, 3 skipped
- [x] T-014 `policy-plan` + negative-controls + observation-sink — 36 passed
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every must-fix finding implemented and verified against the real file
- [x] Behavior unchanged (comment-only code edits; additive README edits)
- [x] Deferred optional items recorded with rationale
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — audit scope and requirements
- `plan.md` — audit-then-fix architecture
- `research/lineages/deepseek-flash/research.md` — synthesized findings
- `implementation-summary.md` — final state and verification evidence
<!-- /ANCHOR:cross-refs -->
