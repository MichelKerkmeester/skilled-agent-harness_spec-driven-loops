---
title: "Verification Checklist: Compact fable-5 governor capsule on the live per-turn skill-advisor hook reminder"
description: "Priority-tagged acceptance checks for the B2 governor capsule: capsule surfaces in the per-turn reminder, is <=~90 words and generic, inherits G4 honesty, and does not regress the existing render reminder."
trigger_phrases:
  - "fable-5 governor capsule checklist"
  - "B2 acceptance checks"
  - "render.ts governor checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/144-operate-like-fable-5/005-governor-capsule-hook"
    last_updated_at: "2026-06-15T14:06:37Z"
    last_updated_by: "planning-author"
    recent_action: "Authored acceptance checklist for the B2 governor capsule"
    next_safe_action: "Verify items as implementation lands"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/constitutional/fable-governor.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/render.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-skilled-agent-orchestration/144-operate-like-fable-5/005-governor-capsule-hook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Compact fable-5 governor capsule on the live per-turn skill-advisor hook reminder

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

- [ ] CHK-001 [P0] Requirements REQ-001..REQ-008 documented in spec.md with acceptance criteria
- [ ] CHK-002 [P0] Technical approach (constant-beside-`HYGIENE_DIRECTIVE` + append + rebuild) defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified: 003 baseline (before/after), 004 doctrine spine, 006 subagent channel
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `render.ts` typechecks and the advisor artifact rebuilds clean
- [ ] CHK-011 [P0] No build errors or warnings introduced by the capsule constant
- [ ] CHK-012 [P1] Capsule is appended after the existing instruction-label sanitization (no new injection surface)
- [ ] CHK-013 [P1] Capsule mirrors the `HYGIENE_DIRECTIVE` pattern (static constant, WHY comment, same emission path)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Governor capsule surfaces in the rendered per-turn advisor reminder (`vitest` assertion green) — REQ-001
- [ ] CHK-021 [P0] Capsule paragraph is <=~90 words and contains no model-family name (generic, not Opus-specific) — REQ-003, SC-002
- [ ] CHK-022 [P0] Capsule inherits G4 honesty: steers efficiency not capability; no rule tells the agent to skip verification/tests/gates — REQ-005
- [ ] CHK-023 [P1] Existing render suite still green (hygiene directive present, sanitization + token-cap unchanged); no regression vs the 003 baseline — REQ-007
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

- [ ] CHK-030 [P0] Capsule text contains no secrets, no spec paths, and no artifact ids (durable WHY only)
- [ ] CHK-031 [P0] Capsule is a static constant, not user-derived; appended after sanitization so it adds no injection surface — NFR-S01
- [ ] CHK-032 [P1] Cross-runtime carriers documented (Claude/Codex `additionalContext`, OpenCode `chat.system.transform`) — REQ-006
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/checklist synchronized and `validate.sh --strict` PASSED
- [ ] CHK-041 [P1] `render.ts` capsule constant has a WHY comment (matches the `HYGIENE_DIRECTIVE` comment style); `fable-governor.md` is the human-review source-of-truth
- [ ] CHK-042 [P2] `fable-governor.md` cross-links B2 in the 002 research recommendations for provenance
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
| P0 Items | 11 | 0/11 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-06-15 (planning authored; verification pending implementation)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->

