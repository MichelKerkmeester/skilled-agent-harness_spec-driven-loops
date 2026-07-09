---
title: "Verification Checklist: Drift-Marker Native Consolidation [template:level_2/checklist.md]"
description: "Verification Date: TBD, scaffold not yet built"
trigger_phrases:
  - "drift marker native consolidation"
  - "git hook embedded heredoc duplication"
  - "drift marker lock staleness constant mismatch"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/022-drift-marker-native-consolidation"
    last_updated_at: "2026-07-09T20:31:22.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored verification checklist scaffold"
    next_safe_action: "Build per plan.md, then verify each item"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Drift-Marker Native Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims and hidden blocker deferrals.
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md, including the resolved staleness-parameter and diff-transport decisions
- [ ] CHK-003 [P1] Dependencies identified (013-drift-marker-pipeline-resilience, shipped; api-barrel precedent, shipped)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented (boundary-violation throw caught non-fatal per NFR-R01; malformed-marker fallback preserved per NFR-R02)
- [ ] CHK-013 [P1] Code follows project patterns (CLI-script convention matching generate-description.ts/backfill-graph-metadata.ts; barrel-export pattern matching computeMemoryQualityScore precedent)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001 single-implementation reuse, REQ-002 boundary enforcement, REQ-003 byte-identical no-override output, REQ-004 lock-reclaim reuse without staleness regression)
- [ ] CHK-021 [P0] Manual testing complete (a real post-commit run against a live commit touching .opencode/specs)
- [ ] CHK-022 [P1] Edge cases tested (not-yet-existing override directory, racing lock acquisition, malformed existing marker JSON)
- [ ] CHK-023 [P1] Error scenarios validated (boundary-violation throw caught non-fatal, node unavailable, empty diff, stale lock owner dead vs. unknown)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each of the four duplicated behaviors (DB-path precedence + boundary check, dedup key, atomic write, lock reclaim) is confirmed reused from its single existing TS source, not re-implemented a second time anywhere.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n "keyFor\|tempPath.*tmp-\|runtimeDbDir\|runtimeDbPath\|LOCK_STALE_MS"` across the repo confirms no remaining shell-embedded duplicate of any of the four behaviors.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the staleness-parameterization change: every existing `isReclaimableLock` call site confirmed to still receive the default (5-minute) threshold except the new drift-marker entrypoint.
- [ ] CHK-FIX-004 [P0] The boundary-enforcement fix (REQ-002) includes an adversarial test for an override that resolves outside all three allowed prefixes (process.cwd()/os.homedir()/os.tmpdir()).
- [ ] CHK-FIX-005 [P1] Matrix axes listed before completion is claimed: {override present/absent} x {lock free/stale-dead-owner/stale-unknown-owner/live-owner} x {existing marker present/absent/malformed}.
- [ ] CHK-FIX-006 [P1] A hostile-env variant executed: `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR`/`MEMORY_DB_PATH` set simultaneously, confirming the same precedence order `computeDatabasePaths()` already enforces is observed by the new entrypoint (not re-derived differently).
- [ ] CHK-FIX-007 [P1] Evidence pinned to the fix commit SHA, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Boundary enforcement reused verbatim from computeDatabasePaths() -- an override resolving outside the allowed prefixes is refused, not silently written to (REQ-002)
- [ ] CHK-032 [P1] Atomic writes keep an interrupted marker write from leaving a torn file, reused verbatim from atomicWriteFile (unchanged guarantee)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate (durable WHY only, no spec/packet/ADR/task IDs embedded, per repo comment-hygiene rule)
- [ ] CHK-042 [P2] README updated (if applicable -- `.opencode/scripts/git-hooks/README.md`)
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
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: TBD
<!-- /ANCHOR:summary -->
