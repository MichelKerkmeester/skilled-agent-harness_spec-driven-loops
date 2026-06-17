---
title: "Verification Checklist: Runtime backend promotions"
description: "Verification Checklist for phase 002 of the deep-loop-workflows merge: Runtime backend promotions."
trigger_phrases:
  - "deep-loop-workflows phase 002"
  - "runtime-backend-promotions"
  - "deep loop merge verification checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/147-deep-loop-workflows/002-runtime-backend-promotions"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled verification checklist from parallel planning fleet"
    next_safe_action: "Execute phase 002 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-002-runtime-backend-promotions-verificationchecklist"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Runtime backend promotions

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

- [ ] CHK-001 [P0] Predecessor (phase 001) green and continuity read
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

- [ ] CHK-020 [P0] Phase-001 baseline manifest and runtime-ownership ADR are present before edits.
  - **Evidence**: verified during phase 002 execution.
- [ ] CHK-021 [P0] deep-loop-runtime contains promoted runtime-capabilities, artifact-root, loop-lock CLI, and lifecycle-taxonomy contracts.
  - **Evidence**: verified during phase 002 execution.
- [ ] CHK-022 [P0] emitResourceMap lives in workflow shared synthesis, not deep-loop-runtime.
  - **Evidence**: verified during phase 002 execution.
- [ ] CHK-023 [P0] Old research/review runtime-capabilities scripts remain byte-compatible shims.
  - **Evidence**: verified during phase 002 execution.
- [ ] CHK-024 [P0] Research, review, and context reducers import artifact-root from runtime without artifact byte changes.
  - **Evidence**: verified during phase 002 execution.
- [ ] CHK-025 [P0] Research and review reducers import resource-map emission from workflow shared synthesis without markdown byte changes.
  - **Evidence**: verified during phase 002 execution.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-060 [P0] Improvement journal imports runtime taxonomy and preserves validation outputs.
  - **Evidence**: verified during phase 002 execution.
- [ ] CHK-061 [P0] convergence.cjs still accepts exactly research\|review\|council\|context and no improvement loopType exists.
  - **Evidence**: verified during phase 002 execution.
- [ ] CHK-062 [P0] No MCP tools, MCP server files, deep-loop-workflows/SKILL.md, or nested graph-metadata.json are added.
  - **Evidence**: verified during phase 002 execution.
- [ ] CHK-063 [P0] Runtime unit/contract tests and cross-skill parity tests pass.
  - **Evidence**: verified during phase 002 execution.
- [ ] CHK-064 [P0] Phase 002 validate.sh --strict passes.
  - **Evidence**: verified during phase 002 execution.

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
