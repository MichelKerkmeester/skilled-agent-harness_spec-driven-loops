---
title: "Verification Checklist: Trigger-turn self-binding for the spec-gate"
description: "Verification checklist for the trigger-turn self-binding and options-threading fix in the spec-gate core."
trigger_phrases:
  - "spec gate self binding checklist"
  - "classifyIntent verification"
  - "trigger turn binding checklist"
  - "spec-gate-core checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-spec-gate-enforce-readiness/002-trigger-turn-self-binding"
    last_updated_at: "2026-07-11T11:05:57.148Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level-2 verification checklist for trigger-turn self-binding"
    next_safe_action: "Verify each item against real test runs during implementation"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-trigger-turn-self-binding"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Trigger-turn self-binding for the spec-gate

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-008)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (self-binding + options threading)
- [ ] CHK-003 [P1] Dependencies identified and available (classifier dist, phases 001/003)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Self-binding closes the gate `satisfied` on the triggering turn for a valid folder (REQ-001)
- [ ] CHK-011 [P0] `ClassificationOptions` threaded into `classifyPrompt`; `satisfiedBy` non-null maps to `satisfied` (REQ-002)
- [ ] CHK-012 [P1] No-folder / invalid-folder triggering prompts still open the gate (REQ-003)
- [ ] CHK-013 [P1] `answerParse` and its `isOpen` contract left untouched; new logic uses a separate extractor
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria (the six Given/When/Then blocks in spec.md) met with test evidence
- [ ] CHK-021 [P0] `node --test spec-gate-core.test.mjs` green, including the module-mock cases under `--experimental-test-module-mocks`
- [ ] CHK-022 [P1] Edge cases tested: valid path token, valid bare `NNN-slug`, invalid/nonexistent folder, no token
- [ ] CHK-023 [P1] Options-threading regression: `requiresGate3Prompt` true still opens the gate
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (`rg -n "status: 'satisfied'"`).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for `classifyIntent`/`classifyPrompt` (core, both Claude hooks, OpenCode plugin, tests).
- [ ] CHK-FIX-004 [P0] Adversarial token table tested: `404-not-found` false positive, `../etc` traversal, ambiguous bare slug, deprecated/superseded, phase-parent-without-active-child.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion is claimed (`triggersGate3` x token x options x prior-state).
- [ ] CHK-FIX-006 [P1] Hostile env variant executed: `MK_SPEC_GATE_DISABLED=1` full no-op and enforce-unset never denies.
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Token inputs validated solely by `validateSpecFolderBinding`; traversal/out-of-tree/ambiguous rejected before any bind
- [ ] CHK-032 [P1] The guard never echoes the classifier's matched-token arrays; only `GATE_3_QUESTION` is surfaced
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/checklist synchronized
- [ ] CHK-041 [P1] Code comments carry the durable WHY only - no spec paths or artifact ids (comment hygiene)
- [ ] CHK-042 [P2] Decision-record / changelog updated on phase close (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P1] No edits under `shared/` or `mcp_server/`; no dist rebuild (REQ-008)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | [ ]/11 |
| P1 Items | 14 | [ ]/14 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: 2026-07-11
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
