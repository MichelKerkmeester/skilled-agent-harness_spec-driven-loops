---
title: "Verification Checklist: Merged hub and mode packets"
description: "Verification Checklist for phase 003 of the deep-loop-workflows merge: Merged hub and mode packets."
trigger_phrases:
  - "deep-loop-workflows phase 003"
  - "merged-hub-and-mode-packets"
  - "deep loop merge verification checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-workflows/003-merged-hub-and-mode-packets"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled verification checklist from parallel planning fleet"
    next_safe_action: "Execute phase 003 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-003-merged-hub-and-mode-packets-verificationchecklist"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Merged hub and mode packets

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

- [ ] CHK-001 [P0] Predecessor (phase 002) green and continuity read
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

- [ ] CHK-020 [P0] deep-loop-workflows/ exists; hub SKILL.md routes by mode with no per-mode logic (grep-verified)
  - **Evidence**: verified during phase 003 execution.
- [ ] CHK-021 [P0] hub graph-metadata.json skill_id==name==folder==deep-loop-workflows, family=deep-loop
  - **Evidence**: verified during phase 003 execution.
- [ ] CHK-022 [P0] exactly one graph-metadata.json under deep-loop-workflows/ (keystone)
  - **Evidence**: verified during phase 003 execution.
- [ ] CHK-023 [P0] mode-registry.json: 7 workflowModes each with workflowMode + runtimeLoopType(value\|explicit null) + backendKind + aliases + packetPath + permissions + commandNames + artifactRoot
  - **Evidence**: verified during phase 003 execution.
- [ ] CHK-024 [P0] registry completeness test (R4) green incl explicit-null negative test and backendKind<->nullability consistency
  - **Evidence**: verified during phase 003 execution.
- [ ] CHK-025 [P0] 5 packets copied verbatim; per-packet source-verbatim diff clean except dropped graph-metadata.json
  - **Evidence**: verified during phase 003 execution.
- [ ] CHK-026 [P0] anchored string rewrite applied; full-tree residual self-path grep empty; no spec-folder false positives rewritten
  - **Evidence**: verified during phase 003 execution.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-060 [P0] every escaping __dirname walk +1 '..'; all 8 ai-council requires ->../../../; packet-internal walks + repo-root finders unchanged; every rewritten .cjs loads
  - **Evidence**: verified during phase 003 execution.
- [ ] CHK-061 [P0] each packet internal refs resolve; ~15 cross-mode refs resolve under new root
  - **Evidence**: verified during phase 003 execution.
- [ ] CHK-062 [P0] nested-SKILL.md discovery test shows zero extra rankable packet nodes
  - **Evidence**: verified during phase 003 execution.
- [ ] CHK-063 [P0] per-mode single-executor artifact byte-parity vs phase-001 baseline
  - **Evidence**: verified during phase 003 execution.
- [ ] CHK-064 [P0] validate.sh --strict exit 0 on phase folder
  - **Evidence**: verified during phase 003 execution.
- [ ] CHK-065 [P0] git diff empty on deep-loop-runtime/ and on all 5 old deep-<name>/ dirs
  - **Evidence**: verified during phase 003 execution.

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
| P0 Items | 17 | 0/17 |
| P1 Items | 6 | 0/6 |
| P2 Items | 2 | 0/2 |

**Verification Date**: pending execution
**Verified By**: pending

<!-- /ANCHOR:summary -->
