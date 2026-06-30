---
title: "Verification Checklist: Command surface repoint"
description: "Verification Checklist for phase 004 of the deep-loop-workflows merge: Command surface repoint."
trigger_phrases:
  - "deep-loop-workflows phase 004"
  - "command-surface-repoint"
  - "deep loop merge verification checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/029-deep-loop-workflows/004-command-surface-repoint"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled verification checklist from parallel planning fleet"
    next_safe_action: "Execute phase 004 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-004-command-surface-repoint-verificationchecklist"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Command surface repoint

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

- [ ] CHK-001 [P0] Predecessor (phase 003) green and continuity read
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

- [ ] CHK-020 [P0] Phase-003 deep-loop-workflows hub, mode packets, and mode-registry.json exist before edits.
  - **Evidence**: verified during phase 004 execution.
- [ ] CHK-021 [P0] Per-mode graph-metadata.json files are absent; only hub graph-metadata survives.
  - **Evidence**: verified during phase 004 execution.
- [ ] CHK-022 [P0] The finalized {skill,mode} command contract is applied consistently.
  - **Evidence**: verified during phase 004 execution.
- [ ] CHK-023 [P0] All 8 command markdown routers are repointed where they reference old skill IDs or old skill paths.
  - **Evidence**: verified during phase 004 execution.
- [ ] CHK-024 [P0] All 12 YAML workflow assets use deep-loop-workflows plus registry-backed mode discrimination.
  - **Evidence**: verified during phase 004 execution.
- [ ] CHK-025 [P0] All 6 presentation contracts remove stale old skill package paths without changing rendered behavior.
  - **Evidence**: verified during phase 004 execution.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-060 [P0] Lane C and Lane D remain markdown-only; no YAML is added for symmetry.
  - **Evidence**: verified during phase 004 execution.
- [ ] CHK-061 [P0] All deep-loop-runtime references remain unchanged.
  - **Evidence**: verified during phase 004 execution.
- [ ] CHK-062 [P0] No agent body, advisor graph, doctor asset, or framework doc file is modified.
  - **Evidence**: verified during phase 004 execution.
- [ ] CHK-063 [P0] rg finds no stale .opencode/skills/deep-{research,review,context,ai-council,improvement} paths or skill: deep-* keys under .opencode/commands/deep.
  - **Evidence**: verified during phase 004 execution.
- [ ] CHK-064 [P0] Phase-001 command parity harness passes byte-for-byte for all 8 commands.
  - **Evidence**: verified during phase 004 execution.
- [ ] CHK-065 [P0] validate.sh --strict passes for phase 004.
  - **Evidence**: verified during phase 004 execution.

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
