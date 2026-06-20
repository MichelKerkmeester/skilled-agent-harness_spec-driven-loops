---
title: "Verification Checklist: Red-Team Probe Gate [system-spec-kit/028-memory-search-intelligence/001-speckit-memory/006-redteam-probe-gate/checklist]"
description: "Verification Date: PENDING - both candidates unimplemented, this checklist gates the future implementation of the red-team probe gate + no-querytext exfil-audit."
trigger_phrases:
  - "red-team probe gate checklist"
  - "memory injection ci gate verification"
  - "zero success ceiling verification"
  - "exfil audit no querytext checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/006-redteam-probe-gate"
    last_updated_at: "2026-06-19T07:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level 2 verification checklist for the red-team probe gate"
    next_safe_action: "Operator review before any gate implementation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-redteam-probe-gate-replan-2026-06-19"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
# Verification Checklist: Red-Team Probe Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

> **Status:** Partial implementation. The MCP-server red-team gate and no-querytext denial audit are implemented, the sibling deep-loop prompt-pack probe and independent adversarial review remain pending.

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-010)
- [x] CHK-002 [P0] Technical approach defined in plan.md (gate aggregator + 3 families + prompt-pack probe + exfil-audit)
- [x] CHK-003 [P1] Dependencies identified: C8/SB8 escaper status, prompt-pack dead-code status, namespace-denial audit GAP confirmed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `tsc`/build green, the gate + probes lint clean
- [x] CHK-011 [P0] No console errors or warnings from the gate run
- [x] CHK-012 [P1] Probe error handling: a thrown sanitizer is a FAIL unless it is the intended typed rejection
- [x] CHK-013 [P1] Gate follows the existing Vitest + `run-tests.mjs` lane patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001..REQ-007 P0, REQ-008..REQ-010 P1) - pending REQ-006 sibling-runtime probe
- [x] CHK-021 [P0] The named gate runs as one group with a zero-success ceiling and a structured per-probe report (REQ-001, REQ-002, REQ-008)
- [x] CHK-022 [P1] Edge cases tested: empty/no-op payload negative control, nested-wrapper, unicode-instructional, compact-vs-full recall (REQ-009)
- [ ] CHK-023 [P1] Deep-loop prompt-pack render probe passes and reports dormant-caller status (REQ-006) - pending sibling-runtime edit
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded for the exfil-audit edit (`cross-consumer` / `algorithmic`) and for each probe family
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg 'sanitizeSkillLabel|ignore previous instructions|promptPoisoning|unicodeInstructional'` - all injection seams enumerated and covered by the gate
- [x] CHK-FIX-003 [P0] Consumer inventory for the render boundary + the audit path (`rg 'formatSearchResults|memory-triggers|getTieredContent|namespace_denied|audit'`)
- [x] CHK-FIX-004 [P0] Adversarial table tests cover delimiter, joined-input, outside-wrapper, no-op, and fallback cases across poisoned-RAG / query-only-injection / wrapper-breakout
- [x] CHK-FIX-005 [P1] Matrix axes listed: {attack family} × {full, compact recall} × {payload class} with the row count
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed (the gate reads no process-wide relaxation knob - proven by grep)
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA / explicit diff range, not a moving branch-relative range - pending commit hash by user instruction
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in fixtures or the gate
- [x] CHK-031 [P0] Zero-success ceiling enforced: any probe success fails the gate, no relaxation knob exists (audit-coverage floor 1.0) (REQ-002)
- [x] CHK-032 [P0] No-querytext exfil-audit proven: the stored namespace-denial record contains no verbatim probe query text (REQ-007), audit fails closed on a missing record
- [x] CHK-033 [P1] Poisoned-RAG threat model scoped to the confirmed `memory_save → recall` path (not the refuted cross-cutting generalization) (REQ-003)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist synchronized, candidate STATUS rows accurate
- [x] CHK-041 [P1] Gate comments name the WHY (durable intent), no ephemeral artifact labels per comment-hygiene
- [ ] CHK-042 [P2] `tests/security/README.md` updated to list the new named gate
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp/probe scratch in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 12 | 9/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-06-19 (partial implementation, prompt-pack probe pending)
<!-- /ANCHOR:summary -->
