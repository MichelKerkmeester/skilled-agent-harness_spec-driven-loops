---
title: "Verification Checklist: Framework documentation sweep"
description: "Verification Checklist for phase 008 of the deep-loop-workflows merge: Framework documentation sweep."
trigger_phrases:
  - "deep-loop-workflows phase 008"
  - "framework-docs-sweep"
  - "deep loop merge verification checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/029-deep-loop-workflows/008-framework-docs-sweep"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled verification checklist from parallel planning fleet"
    next_safe_action: "Execute phase 008 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-008-framework-docs-sweep-verificationchecklist"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Framework documentation sweep

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

- [ ] CHK-001 [P0] Predecessor (phase 007) green and continuity read
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

- [ ] CHK-020 [P0] Phase 007 dependency preflight is green
  - **Evidence**: verified during phase 008 execution.
- [ ] CHK-021 [P0] deep-loop-workflows mode-registry.json is the terminology source
  - **Evidence**: verified during phase 008 execution.
- [ ] CHK-022 [P0] Only hub deep-loop-workflows/graph-metadata.json exists
  - **Evidence**: verified during phase 008 execution.
- [ ] CHK-023 [P0] README.md documents the two-skill architecture
  - **Evidence**: verified during phase 008 execution.
- [ ] CHK-024 [P0] Skills catalog counts and deep-loop rows match the new architecture
  - **Evidence**: verified during phase 008 execution.
- [ ] CHK-025 [P0] CLAUDE.md and AGENTS.md remain mirrored for deep-loop policy
  - **Evidence**: verified during phase 008 execution.
- [ ] CHK-026 [P0] deep-loop-runtime README preserves frozen MCP-free backend boundary
  - **Evidence**: verified during phase 008 execution.
- [ ] CHK-027 [P0] Constitutional deep workflow rule points at deep-loop-workflows workflows
  - **Evidence**: verified during phase 008 execution.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-060 [P0] system-spec-kit and cli-opencode related-skill/protocol links no longer point at old workflow skill paths
  - **Evidence**: verified during phase 008 execution.
- [ ] CHK-061 [P0] deep-loop-workflows is stamped v1.0.0
  - **Evidence**: verified during phase 008 execution.
- [ ] CHK-062 [P0] Per-mode changelog history is byte-identical to baseline
  - **Evidence**: verified during phase 008 execution.
- [ ] CHK-063 [P0] SYNC.md and loop.py are updated if present or verified absent
  - **Evidence**: verified during phase 008 execution.
- [ ] CHK-064 [P0] No Barter contract-version bump appears
  - **Evidence**: verified during phase 008 execution.
- [ ] CHK-065 [P0] Stale old workflow skill-path grep is clean with approved excludes
  - **Evidence**: verified during phase 008 execution.
- [ ] CHK-066 [P0] Phase-001 parity harness remains byte-identical
  - **Evidence**: verified during phase 008 execution.
- [ ] CHK-067 [P0] Phase 008 validate.sh --strict exits 0
  - **Evidence**: verified during phase 008 execution.

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
| P0 Items | 20 | 0/20 |
| P1 Items | 6 | 0/6 |
| P2 Items | 2 | 0/2 |

**Verification Date**: pending execution
**Verified By**: pending

<!-- /ANCHOR:summary -->
