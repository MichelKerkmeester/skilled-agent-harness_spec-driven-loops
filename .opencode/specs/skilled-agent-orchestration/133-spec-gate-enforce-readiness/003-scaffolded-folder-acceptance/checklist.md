---
title: "Verification Checklist: Scaffolded-folder acceptance for the spec-gate binding path"
description: "Verification Date: 2026-07-11"
trigger_phrases:
  - "spec gate acceptance checklist"
  - "scaffolded folder verification"
  - "relaxed accept invariants"
  - "spec-gate deny default-off checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-spec-gate-enforce-readiness/003-scaffolded-folder-acceptance"
    last_updated_at: "2026-07-11T11:05:57.515Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the Level 2 verification checklist"
    next_safe_action: "Verify each P0 item with evidence once the relaxed accept is implemented"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-scaffolded-folder-acceptance"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Scaffolded-folder acceptance for the spec-gate binding path

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001 through REQ-006)
- [ ] CHK-002 [P0] Technical approach and the Option A vs Option B decision documented in plan.md
- [ ] CHK-003 [P1] Dependencies identified: `isExemptTargetPath` scaffold exemption and the `missing_metadata` reason payload
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --test spec-gate-core.test.mjs` green (existing + new)
- [ ] CHK-011 [P0] No stdout/stderr introduced on the OpenCode plugin path; the core stays transport-free
- [ ] CHK-012 [P1] Fail-open preserved: the added `statSync` is wrapped and the outer catch eviction is intact
- [ ] CHK-013 [P1] Comment hygiene: durable WHY only, no artifact ids or spec paths in code comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] WS3 accept scenario passes: scaffold `spec.md` -> answer "B, <folder>" -> `satisfied` -> `Write` under enforce -> `allow`
- [ ] CHK-021 [P0] Negatives keep the gate `open`: non-existent folder, folder without `spec.md`, out-of-tree, traversal (`../`)
- [ ] CHK-022 [P1] Deprecated folder carrying the full trio stays `open` (unchanged); symlink-escape rejected
- [ ] CHK-023 [P1] `MK_SPEC_GATE_DISABLED=1` is a full no-op across `classifyIntent` and `evaluateMutation`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class recorded: `class-of-bug` (an acceptance-path deadlock, not a single instance)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory of `satisfied` writers completed in `spec-gate-core.mjs`
- [ ] CHK-FIX-003 [P0] Consumer inventory for the status vocabulary completed; Option A adds no new consumer
- [ ] CHK-FIX-004 [P0] Adversarial table tests added for delimiter/joined-input-adjacent, outside-root, no-op, and symlink-escape cases
- [ ] CHK-FIX-005 [P1] Matrix axes and required row count listed before completion is claimed (see plan.md affected-surfaces)
- [ ] CHK-FIX-006 [P1] Hostile env variant executed: enforce on, enforce off, and `MK_SPEC_GATE_DISABLED=1`
- [ ] CHK-FIX-007 [P1] Evidence pinned to the fix SHA or an explicit diff range, not a moving branch range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] `MANDATORY_SPEC_METADATA_FILES` and `validateSpecFolderBinding` unchanged in the shared classifier
- [ ] CHK-031 [P0] Deny stays opt-in behind `MK_SPEC_GATE_ENFORCE=1`, default-off, and never widened beyond Write/Edit
- [ ] CHK-032 [P1] No `mcp_server/` dist rebuild; `shared/dist/` untouched; relaxation scoped to `source:'prior_answer'`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks/checklist synchronized
- [ ] CHK-041 [P1] Code comments adequate and hygienic
- [ ] CHK-042 [P2] README update - not applicable to this fix
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
| P0 Items | 11 | [ ]/11 |
| P1 Items | 12 | [ ]/12 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-07-11
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
