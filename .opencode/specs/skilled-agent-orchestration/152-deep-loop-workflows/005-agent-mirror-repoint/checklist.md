---
title: "Verification Checklist: Agent mirror repoint"
description: "Verification Checklist for phase 005 of the deep-loop-workflows merge: Agent mirror repoint."
trigger_phrases:
  - "deep-loop-workflows phase 005"
  - "agent-mirror-repoint"
  - "deep loop merge verification checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/152-deep-loop-workflows/005-agent-mirror-repoint"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled verification checklist from parallel planning fleet"
    next_safe_action: "Execute phase 005 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-005-agent-mirror-repoint-verificationchecklist"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Agent mirror repoint

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

- [ ] CHK-001 [P0] Predecessor (phase 004) green and continuity read
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

- [ ] CHK-020 [P0] Phase 001 baseline manifest located and used; no new baseline invented.
  - **Evidence**: verified during phase 005 execution.
- [ ] CHK-021 [P0] Phase 003 mode-registry.json exists and carries workflowMode/runtimeLoopType/backendKind.
  - **Evidence**: verified during phase 005 execution.
- [ ] CHK-022 [P0] Phase 004 command repoint is complete before agent-body edits begin.
  - **Evidence**: verified during phase 005 execution.
- [ ] CHK-023 [P0] .codex/agents/*.toml hand-maintained status confirmed before edits.
  - **Evidence**: verified during phase 005 execution.
- [ ] CHK-024 [P0] All 15 target agent mirror files repointed where they reference old deep-loop skill paths or skill ownership.
  - **Evidence**: verified during phase 005 execution.
- [ ] CHK-025 [P0] Agent names unchanged across all mirrors.
  - **Evidence**: verified during phase 005 execution.
- [ ] CHK-026 [P0] No command YAML, advisor graph, old skill directory, or deep-loop-runtime file changed.
  - **Evidence**: verified during phase 005 execution.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-060 [P0] deep-review keeps sk-code-review/references/review_core.md unchanged.
  - **Evidence**: verified during phase 005 execution.
- [ ] CHK-061 [P0] ai-council persist-artifacts.cjs and output_schema.md references updated in lockstep across all three mirrors.
  - **Evidence**: verified during phase 005 execution.
- [ ] CHK-062 [P0] Three-way normalized mirror body parity passes for all five agents with only Path Convention whitelisted.
  - **Evidence**: verified during phase 005 execution.
- [ ] CHK-063 [P0] Stale old-skill-path grep is empty inside the 15 target files.
  - **Evidence**: verified during phase 005 execution.
- [ ] CHK-064 [P0] Codex TOML parse succeeds for all five target TOML files.
  - **Evidence**: verified during phase 005 execution.
- [ ] CHK-065 [P0] Phase-001 artifact parity replay passes or behavior-preservation fallback is documented with explicit evidence.
  - **Evidence**: verified during phase 005 execution.
- [ ] CHK-066 [P0] validate.sh --strict passes on the phase 005 spec folder.
  - **Evidence**: verified during phase 005 execution.

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
| P0 Items | 18 | 0/18 |
| P1 Items | 6 | 0/6 |
| P2 Items | 2 | 0/2 |

**Verification Date**: pending execution
**Verified By**: pending

<!-- /ANCHOR:summary -->
