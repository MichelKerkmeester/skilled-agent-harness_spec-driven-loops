---
title: "Verification Checklist: Doctrine quick-wins: fix the AGENTS.md dead hook pointer plus a pointer-resolution check, add an efficiency doctrine spine, and a scar-tissue cold-successor handoff discipline [template:level_2/checklist.md]"
description: "Verification Date: 2026-06-15"
trigger_phrases:
  - "verification"
  - "checklist"
  - "name"
  - "template"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/004-doctrine-quick-wins"
    last_updated_at: "2026-06-15T14:06:36Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-doctrine-quick-wins"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Doctrine quick-wins: fix the AGENTS.md dead hook pointer plus a pointer-resolution check, add an efficiency doctrine spine, and a scar-tissue cold-successor handoff discipline

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] CHK-001 [P0] A1/A2/A3 requirements documented in spec.md with measurable acceptance criteria (REQ-001 to REQ-006)
- [ ] CHK-002 [P0] Technical approach and ordered steps defined in plan.md (check exists before final verification)
- [ ] CHK-003 [P1] Dependencies identified: none (self-contained land-first phase); POSIX shell + grep available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `check-doc-pointers.sh` is valid POSIX shell (`bash -n` passes) and is executable
- [ ] CHK-011 [P0] No hyphenated `skill-advisor-hook.md` reference remains in AGENTS.md or CLAUDE.md (`rg skill-advisor-hook.md` returns nothing)
- [ ] CHK-012 [P1] The check handles error inputs: missing input file fails, every unresolved pointer is reported (no stop-at-first)
- [ ] CHK-013 [P1] The check follows the `scripts/rules/check-*.sh` family conventions (fail-loud, named offenders on stderr)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Dead pointer resolves: cited file exists and `grep skill_advisor_hook.md AGENTS.md` matches the repaired form
- [ ] CHK-021 [P0] `check-doc-pointers.sh` exits non-zero on a deliberately broken pointer AND exits 0 on the repaired tree (both directions proven)
- [ ] CHK-022 [P1] AGENTS.md ≡ CLAUDE.md byte-synced (`diff -q` clean) and each at or under ~500 lines (`wc -l`)
- [ ] CHK-023 [P1] Pointer-absent and missing-input-file edge cases behave as specified
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets, tokens, or credentials introduced by any of the four changes
- [ ] CHK-031 [P0] The check only reads files (no writes, no network, no shell-expansion of matched paths)
- [ ] CHK-032 [P1] N/A - no auth/authz surface touched by this doc-and-check phase
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/implementation-summary synchronized and placeholder-free
- [ ] CHK-041 [P1] Efficiency doctrine spine present in §1 of both twins (root conviction, two-register voice, letter-vs-intent)
- [ ] CHK-042 [P1] Handover template carries the scar-tissue ledger and numbered cold-read order with all anchors preserved
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 14 | 0/14 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending - this phase is PLANNED; verification runs at implementation.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->

