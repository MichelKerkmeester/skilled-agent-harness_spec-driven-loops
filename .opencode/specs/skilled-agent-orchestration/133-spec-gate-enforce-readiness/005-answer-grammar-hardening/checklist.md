---
title: "Verification Checklist: Answer-grammar hardening for the spec-gate Gate-3 parser"
description: "Verification Date: 2026-07-11"
trigger_phrases:
  - "answer grammar hardening checklist"
  - "spec-gate skip regex checklist"
  - "answerParse verification"
  - "gate-3 grammar checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-spec-gate-enforce-readiness/005-answer-grammar-hardening"
    last_updated_at: "2026-07-11T11:05:58.098Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 2 verification checklist for answer-grammar hardening"
    next_safe_action: "Verify P0/P1 items after the parser change lands"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-answer-grammar-hardening"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Answer-grammar hardening for the spec-gate Gate-3 parser

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..006)
- [ ] CHK-002 [P0] Technical approach and affected-surfaces table defined in plan.md
- [ ] CHK-003 [P1] Phase `001-advise-telemetry` detail-shape coordination confirmed before editing the shared detail region
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --test spec-gate-core.test.mjs` passes on the changed tree
- [ ] CHK-011 [P0] No `console.log/warn/error/info/debug` added to `spec-gate-core.mjs` (static-shape test still passes)
- [ ] CHK-012 [P1] Fail-open paths, `MK_SPEC_GATE_DISABLED` no-op, and the `evaluateMutation` control flow are unchanged apart from the deny `detail` value
- [ ] CHK-013 [P1] Change follows the runtime-neutral core pattern; no comment carries artifact ids or spec paths (comment hygiene)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria (SC-001..004) demonstrated by tests
- [ ] CHK-021 [P0] Expanded corpus runs at 0 false positives and 0 false negatives (`answerParse` corpus tests)
- [ ] CHK-022 [P1] Edge cases tested: "skip X do Y", standalone-D vs "D <prose>", ambiguous letter-only, prose with a `\d{3}-slug` token
- [ ] CHK-023 [P1] `isOpen=false` still returns `null` for every answer class (state-gate structural test)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `algorithmic` (parser grammar) and `matrix/evidence` (corpus)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n 'SKIP_WORD_REGEX|ANSWER_LETTER_PREFIX_REGEX' .opencode/skills/system-spec-kit/runtime/lib/spec-gate`
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for `GATE_3_QUESTION`, new `GATE_3_DENY_DETAIL`, `answerParse`, and `result.detail` across core, adapters, plugin, and tests
- [ ] CHK-FIX-004 [P0] Parser adversarial table tested for delimiter ("skip X do Y"), joined-input (letter + trailing prose), no-op (`isOpen=false`), and fallback (ambiguous -> `null`) cases
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion (answer class x isOpen x folder validity)
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed: `MK_SPEC_GATE_DISABLED=1` no-op and `MK_SPEC_GATE_ENFORCE` unset/`=1` deny matrix re-run
- [ ] CHK-FIX-007 [P1] Evidence pinned to the fix SHA or explicit diff range, not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets; `GATE_3_DENY_DETAIL` is a fixed string with no classifier internals echoed
- [ ] CHK-031 [P0] Deny predicate breadth unchanged (`DENY_CAPABLE_TOOLS` still exactly Write/Edit); deny stays opt-in behind `MK_SPEC_GATE_ENFORCE=1`
- [ ] CHK-032 [P1] No `mcp_server/` dist rebuild; change confined to `spec-gate-core.mjs` and its test
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md / plan.md / tasks.md synchronized with the shipped grammar and deny-detail wording
- [ ] CHK-041 [P1] Code comments explain the conservative "ambiguous -> stay open" rationale without artifact ids
- [ ] CHK-042 [P2] Parent phase map status updated when this phase closes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files (baseline captures) in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | [ ]/12 |
| P1 Items | 12 | [ ]/12 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: 2026-07-11
<!-- /ANCHOR:summary -->
