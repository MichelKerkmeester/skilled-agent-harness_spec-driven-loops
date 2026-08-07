---
title: "Verification Checklist: Parity baseline and runtime-ownership ADR"
description: "Verification Checklist for phase 001 of the deep-loop-workflows merge: Parity baseline and runtime-ownership ADR."
trigger_phrases:
  - "deep-loop-workflows phase 001"
  - "parity-baseline-and-runtime-ownership-adr"
  - "deep loop merge verification checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/023-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled verification checklist from parallel planning fleet"
    next_safe_action: "Execute phase 001 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-001-parity-baseline-and-runtime-ownership-adr-verificationchecklist"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Parity baseline and runtime-ownership ADR

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

- [ ] CHK-001 [P0] Predecessor (none (first phase)) green and continuity read
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

- [ ] CHK-020 [P0] Phase plan, tasks, checklist, and implementation summary exist and validate with no placeholders.
  - **Evidence**: verified during phase 001 execution.
- [ ] CHK-021 [P0] Source-surface manifest covers all five old skills, deep-loop-runtime, command surfaces, and current OpenCode agent files.
  - **Evidence**: verified during phase 001 execution.
- [ ] CHK-022 [P0] Per-mode baselines exist for context, research, review, ai-council, and improvement.
  - **Evidence**: verified during phase 001 execution.
- [ ] CHK-023 [P0] All seven /deep:* command baselines exist.
  - **Evidence**: verified during phase 001 execution.
- [ ] CHK-024 [P0] Advisor routing baseline records current winners and future concrete mode expectations.
  - **Evidence**: verified during phase 001 execution.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-060 [P0] Nested discovery gate proves only hub graph-metadata.json survives and per-mode graph-metadata.json files are dropped.
  - **Evidence**: verified during phase 001 execution.
- [ ] CHK-061 [P0] Runtime-ownership ADR preserves MCP-free runtime and authorizes only named phase-002 promotions.
  - **Evidence**: verified during phase 001 execution.
  - **Evidence**: verified during phase 001 execution.
- [ ] CHK-063 [P0] Final diff is restricted to the phase-001 spec folder.
  - **Evidence**: verified during phase 001 execution.
- [ ] CHK-064 [P0] validate.sh --strict passes for phase 001.
  - **Evidence**: verified during phase 001 execution.

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
| P0 Items | 14 | 0/14 |
| P1 Items | 6 | 0/6 |
| P2 Items | 2 | 0/2 |

**Verification Date**: pending execution
**Verified By**: pending

<!-- /ANCHOR:summary -->
