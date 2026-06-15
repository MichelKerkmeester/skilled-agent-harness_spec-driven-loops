---
title: "Verification Checklist: Old-skill deletion and full-surface validation"
description: "Verification Checklist for phase 009 of the deep-loop-workflows merge: Old-skill deletion and full-surface validation."
trigger_phrases:
  - "deep-loop-workflows phase 009"
  - "old-skill-deletion-and-validation"
  - "deep loop merge verification checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/152-deep-loop-workflows/009-old-skill-deletion-and-validation"
    last_updated_at: "2026-06-15T20:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Built B1 council-graph doctor probe; verified 6/18 P0 gates"
    next_safe_action: "Run remaining 12 P0 gates: parity replay, skill-graph rebuild, validations"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-009-old-skill-deletion-and-validation-verificationchecklist"
      parent_session_id: null
    completion_pct: 33
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Old-skill deletion and full-surface validation

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

- [ ] CHK-001 [P0] Predecessor (phase 008) green and continuity read
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

- [ ] CHK-020 [P0] Phase 001 baseline evidence exists and covers 5 modes, 8 commands, advisor routing, and Lane-D dry-run parity.
  - **Evidence**: verified during phase 009 execution.
- [ ] CHK-021 [P0] Phase 008 handoff is green before deletion.
  - **Evidence**: verified during phase 009 execution.
- [x] CHK-022 [P0] deep-loop-workflows has exactly one hub graph-metadata.json and no per-mode graph metadata.
  - **Evidence**: `find .opencode/skills/deep-loop-workflows -name graph-metadata.json` returns exactly one hub file; no per-mode metadata (2026-06-15).
- [x] CHK-023 [P0] /doctor deep-loop covers both deep-loop-graph.sqlite and council-graph.sqlite.
  - **Evidence**: `doctor_deep-loop.yaml` + `_routes.yaml` extended with council scope/probe/staleness/replay recommendation (scope=council|all); live `status.cjs --loop-type council` returns status:ok, totalNodes:2 (2026-06-15).
- [x] CHK-024 [P0] Route validation passes.
  - **Evidence**: `route-validate.sh` → PASS, 9 routes, 0 errors; allowed_flags now accepts `--scope=research|review|council|both|all` (2026-06-15).
- [x] CHK-025 [P0] Runtime council graph status/query/convergence smoke checks pass.
  - **Evidence**: `status.cjs`/`query.cjs`/`convergence.cjs --loop-type council` all return status:ok (convergence decision:CONTINUE score:0.4; query unresolved_disagreements:0) (2026-06-15).
- [x] CHK-026 [P0] Exactly five old skill directories are deleted.
  - **Evidence**: `ls .opencode/skills/deep-*` → only deep-loop-runtime + deep-loop-workflows remain; the five old skill dirs (research/review/context/improvement/ai-council) are merged-and-deleted (2026-06-15).

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-060 [P0] Skill graph rebuild passes with rejectedEdges=0.
  - **Evidence**: verified during phase 009 execution.
- [ ] CHK-061 [P0] Advisor validation passes and asserts skill plus mode.
  - **Evidence**: verified during phase 009 execution.
- [ ] CHK-062 [P0] Agent three-way mirror parity passes.
  - **Evidence**: verified during phase 009 execution.
- [ ] CHK-063 [P0] Registry completeness passes.
  - **Evidence**: verified during phase 009 execution.
- [x] CHK-064 [P0] convergence.cjs still accepts exactly research\|review\|council\|context and no improvement loop type.
  - **Evidence**: `convergence.cjs:300` rejects any loopType outside research|review|council|context; no improvement loop type (2026-06-15).
- [ ] CHK-065 [P0] Full phase-001 parity rerun is byte-identical for all five modes and eight commands.
  - **Evidence**: verified during phase 009 execution.
- [ ] CHK-066 [P0] validate.sh --strict passes for phase 009 and parent recursive validation is green.
  - **Evidence**: verified during phase 009 execution.

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
| P0 Items | 18 | 6/18 |
| P1 Items | 6 | 0/6 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-06-15 (partial — council/route/deletion surface verified: CHK-022/023/024/025/026/064; parity-replay, skill-graph rebuild, advisor/mirror/registry, and process gates not yet run)
**Verified By**: claude-opus (B1 council-graph remediation under packet 156 deep-review)

<!-- /ANCHOR:summary -->
