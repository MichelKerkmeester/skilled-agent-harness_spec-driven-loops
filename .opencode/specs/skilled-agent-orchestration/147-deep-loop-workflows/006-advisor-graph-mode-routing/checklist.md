---
title: "Verification Checklist: Advisor graph mode-routing collapse"
description: "Verification Checklist for phase 006 of the deep-loop-workflows merge: Advisor graph mode-routing collapse."
trigger_phrases:
  - "deep-loop-workflows phase 006"
  - "advisor-graph-mode-routing"
  - "deep loop merge verification checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/147-deep-loop-workflows/006-advisor-graph-mode-routing"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled verification checklist from parallel planning fleet"
    next_safe_action: "Execute phase 006 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-006-advisor-graph-mode-routing-verificationchecklist"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Advisor graph mode-routing collapse

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

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Predecessor (phase 005) green and continuity read
  - **Evidence**: gating dependency confirmed before start.
- [ ] CHK-002 [P0] Phase-001 parity baseline available
  - **Evidence**: baseline snapshot loaded for affected surfaces.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Edits stay in this phase's frozen scope (no adjacent cleanup)
  - **Evidence**: changed-file list matches `spec.md` scope.
- [ ] CHK-011 [P1] Changes follow existing project conventions
  - **Evidence**: sk-code surface conventions honored.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] family=deep-loop for deep-ai-council+deep-improvement (G1) and merged node
  - **Evidence**: verified during phase 006 execution.
- [ ] CHK-021 [P0] both routing-parity fixtures assert deep-loop-workflows AND concrete mode; vitest green
  - **Evidence**: verified during phase 006 execution.
- [ ] CHK-022 [P0] skill_graph_scan rejectedEdges=0; UNKNOWN-TARGET grep empty
  - **Evidence**: verified during phase 006 execution.
- [ ] CHK-023 [P0] 5 old graph-metadata.json deleted; 5 old nodes in deletedNodes; old dirs intact
  - **Evidence**: verified during phase 006 execution.
- [ ] CHK-024 [P0] only hub graph-metadata.json under deep-loop-workflows (no per-mode); scanner does not throw
  - **Evidence**: verified during phase 006 execution.
- [ ] CHK-025 [P0] 5 external inbound edges repointed + deduped; advisor_validate symmetry clean
  - **Evidence**: verified during phase 006 execution.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-060 [P0] deep-context decision recorded (metadata-routed) consistent across aliases.ts/skill_advisor.py/fixtures
  - **Evidence**: verified during phase 006 execution.
- [ ] CHK-061 [P0] aliases.ts nested schema landed; native-scorer SKILL_ALIAS_GROUPS assertion passes; canonicalSkillId consumers intact
  - **Evidence**: verified during phase 006 execution.
- [ ] CHK-062 [P0] PHRASE_BOOSTS + CATEGORY_HINTS + Python intent maps repointed; alias->mode validated against mode-registry.json
  - **Evidence**: verified during phase 006 execution.
- [ ] CHK-063 [P0] deep-loop-runtime MCP-free + loop behavior unchanged
  - **Evidence**: verified during phase 006 execution.
- [ ] CHK-064 [P0] validate.sh --strict exit 0 on phase folder
  - **Evidence**: verified during phase 006 execution.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets introduced
  - **Evidence**: doc/structure reorg only; no credentials.
- [ ] CHK-031 [P1] deep-loop-runtime stays MCP-free
  - **Evidence**: no MCP tool added to the backend.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks synchronized for this phase
  - **Evidence**: this packet's docs describe the same scope.
- [ ] CHK-041 [P2] Cross-repo doc references updated (if this phase touches them)
  - **Evidence**: handled in phase 008 unless owned here.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No stray temp files committed
  - **Evidence**: scratch artifacts kept out of the packet.
- [ ] CHK-051 [P1] Old skill directories untouched (until phase 009)
  - **Evidence**: build is additive; deletion is phase 009 only.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 6 | 0/6 |
| P2 Items | 2 | 0/2 |

**Verification Date**: pending execution
**Verified By**: pending

<!-- /ANCHOR:summary -->
