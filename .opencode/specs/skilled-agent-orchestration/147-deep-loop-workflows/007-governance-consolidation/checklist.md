---
title: "Verification Checklist: Governance consolidation"
description: "Verification Checklist for phase 007 of the deep-loop-workflows merge: Governance consolidation."
trigger_phrases:
  - "deep-loop-workflows phase 007"
  - "governance-consolidation"
  - "deep loop merge verification checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/147-deep-loop-workflows/007-governance-consolidation"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled verification checklist from parallel planning fleet"
    next_safe_action: "Execute phase 007 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-007-governance-consolidation-verificationchecklist"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Governance consolidation

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

- [ ] CHK-001 [P0] Predecessor (phase 006) green and continuity read
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

- [ ] CHK-020 [P0] Hub-level feature_catalog exists with five mode partitions and one merged root index.
  - **Evidence**: verified during phase 007 execution.
- [ ] CHK-021 [P0] Hub-level manual_testing_playbook exists with five mode partitions and one merged root index.
  - **Evidence**: verified during phase 007 execution.
- [ ] CHK-022 [P0] Council catalog casing is normalized to ai-council/feature_catalog.md.
  - **Evidence**: verified during phase 007 execution.
- [ ] CHK-023 [P0] No nested mode graph-metadata.json exists under deep-loop-workflows mode packets.
  - **Evidence**: verified during phase 007 execution.
- [ ] CHK-024 [P0] Merged root indexes mode-qualify CP collisions without renumbering per-mode files.
  - **Evidence**: verified during phase 007 execution.
- [ ] CHK-025 [P0] Declared scenario totals reconcile to 198 total across the five modes.
  - **Evidence**: verified during phase 007 execution.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-060 [P0] No orphaned CP IDs exist in root indexes or mode partitions.
  - **Evidence**: verified during phase 007 execution.
- [ ] CHK-061 [P0] Old skill-rooted paths are absent from new governance roots while deep-loop-runtime refs are preserved.
  - **Evidence**: verified during phase 007 execution.
- [ ] CHK-062 [P0] The CP sandbox helpers are deduped behind one shared mode-aware helper with behavior preserved.
  - **Evidence**: verified during phase 007 execution.
- [ ] CHK-063 [P0] Known drift is reconciled: false council catalog prose, duplicate headings, and stale count checks fixed.
  - **Evidence**: verified during phase 007 execution.
- [ ] CHK-064 [P0] Phase-001 byte-identical artifact parity passes for all modes and commands.
  - **Evidence**: verified during phase 007 execution.
- [ ] CHK-065 [P0] validate.sh --strict passes for phase 007.
  - **Evidence**: verified during phase 007 execution.

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
| P0 Items | 16 | 0/16 |
| P1 Items | 6 | 0/6 |
| P2 Items | 2 | 0/2 |

**Verification Date**: pending execution
**Verified By**: pending

<!-- /ANCHOR:summary -->
