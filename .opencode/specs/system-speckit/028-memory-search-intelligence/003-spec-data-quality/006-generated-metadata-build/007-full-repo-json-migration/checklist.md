---
title: "Verification Checklist: Full-Repo Generated-JSON Migration [template:level_2/checklist.md]"
description: "Verification Date: Pending (scaffold, not yet verified)"
trigger_phrases:
  - "full repo json migration"
  - "stage 3 generated json migration"
  - "scoped per folder generator loop"
  - "byte stable second run gate"
  - "regenerate description and graph metadata repo wide"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/007-full-repo-json-migration"
    last_updated_at: "2026-07-04T17:11:58.036Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the checklist at PLANNED, all items pending verification"
    next_safe_action: "Build the migration driver, then verify each item with evidence"
    blockers:
      - "HARD-GATED on phases 033 through 036 being done and tested"
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-039-full-repo-json-migration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Full-Repo Generated-JSON Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
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
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P0] Phases 033 through 036 confirmed done and tested before the migration runs
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The migration calls the scoped per-folder generator only and never the whole-tree walk
- [ ] CHK-011 [P0] No console errors or warnings, the driver and vitest run clean and typecheck clean
- [ ] CHK-012 [P1] The missing-prior-file, already-conformant and archive-folder branches are handled and tested
- [ ] CHK-013 [P1] The driver follows the existing `scripts/graph` tooling patterns and reuses the phase 034 scoped path
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Acceptance criteria met, REQ-001 through REQ-005 proven by the migration run and the vitest
- [ ] CHK-021 [P0] A second run yields an empty diff, proving the content-hashed writes settle repo-wide
- [ ] CHK-022 [P1] An archive folder and a future folder are both covered and rewritten onto the new format
- [ ] CHK-023 [P1] The phase 036 validator and `validate.sh` both report zero violations over the regenerated tree
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The migration is `class-of-bug`, the whole repo carries the legacy generated-JSON format the new contract rejects, this regenerates all of it
- [ ] CHK-FIX-002 [P0] Same-class producer inventory run, `rg description.json|graph-metadata.json` over `scripts/graph`, the scoped generator is the single producer routed through
- [ ] CHK-FIX-003 [P0] Whole-tree-walk entry points inventoried and confirmed never called by the driver
- [ ] CHK-FIX-004 [P0] The archive trees `z_archive` and `z_future` are enumerated, no folder is silently skipped
- [ ] CHK-FIX-005 [P1] Coverage axes listed, top-level tracks, phase children, archives, missing-prior-file, already-conformant
- [ ] CHK-FIX-006 [P1] The J1 to J4 flags are set ON for the migration run and confirmed not leaked into unrelated suites
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the migration run and the scoped commits, the prompt directs commit nothing for the scaffold so no SHA is available yet
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] The migration regenerates derived JSON from existing docs and introduces no new untrusted input
- [ ] CHK-032 [P1] No new execution surface, the driver reuses the existing scoped generator and validator
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/implementation-summary synchronized to the migration outcome with no conflicting state
- [ ] CHK-041 [P1] Code comments carry the durable why with no artifact ids or spec paths
- [ ] CHK-042 [P2] The commit batching by track recorded in the implementation summary
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No temp files written into the repo, tests use OS tmpdir fixtures
- [ ] CHK-051 [P1] No scratch artifacts to clean
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending, scaffold at PLANNED, HARD-GATED on phases 033 through 036
<!-- /ANCHOR:summary -->

---
</content>
