---
title: "Verification Checklist: Shared Identity Resolver and Merge Safety [template:level_2/checklist.md]"
description: "Verification Date: Pending (scaffold, not yet verified)"
trigger_phrases:
  - "shared spec folder identity resolver"
  - "merge graph metadata parent preservation"
  - "children ids append only"
  - "parent id reconciled merge"
  - "spec folder identity canonicalizer"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/001-identity-resolver-merge-safety"
    last_updated_at: "2026-07-04T17:11:53.814Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified the resolver path shape and the merge preservation invariants against passing vitest"
    next_safe_action: "Build the grandfather report listing then graduate the flag behind a scoped migration"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/identity-resolver-merge-safety.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Shared Identity Resolver and Merge Safety

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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Canonical specs-root anchor (`.opencode/specs`), the consolidated resolver call sites (`resolveBuildIdentity`, `resolveSpecFolderForDescription`), and the default-OFF flag plumbing (`SPECKIT_IDENTITY_MERGE_SAFETY`) identified
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Both generators consume the shared `resolveSpecFolderIdentity` (via `resolveBuildIdentity` and `resolveSpecFolderForDescription`) and the split identity computations are consolidated, with no path-shape duplication
- [x] CHK-011 [P0] No console errors or warnings from a derive or a merge on a valid run, confirmed across the 11/11 new and 385 regression assertions
- [x] CHK-012 [P1] Outside-root rejection, null-parent preservation, and prune-only removal branches handled and asserted
- [x] CHK-013 [P1] Change follows the existing parser and discovery patterns, reusing `isSpecLeafSegment` and the existing flag-module idiom
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Acceptance criteria REQ-001 through REQ-005, REQ-007, and REQ-008 met. REQ-006 is partially met: the default-OFF flag and flag-OFF byte-identical behavior ship and are asserted, the grandfather report listing is deferred (see T009)
- [x] CHK-021 [P0] A null-deriving re-derive preserves an existing non-null `parent_id` with a review flag, not the silent-erase path, asserted in the merge-safety suite
- [x] CHK-022 [P1] `description.json` `specFolder` and `graph-metadata.json` `spec_folder` carry the identical specs-root-relative string for one folder, asserted under the flag ON
- [x] CHK-023 [P1] A scoped scan missing a child leaves the union intact, only prune mode removes a child, and the flag OFF passes through unchanged, all asserted
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class is `algorithmic` (shared identity computation) coupled with `cross-consumer` (two generators plus the merge consume it).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the caller-base identity at `_processSpecFolder` and the duplicate at `generatePerFolderDescription` were both found and routed, and the split `resolveParentId`/`resolveChildrenIds` consolidated into the resolver.
- [x] CHK-FIX-003 [P0] Consumer inventory completed: `mergeGraphMetadata` (new options arg, default-safe), the `parent_id_review_required` schema field (optional, back-compatible), and both generator call sites.
- [x] CHK-FIX-004 [P0] Adversarial cases asserted: outside-root rejection, the no-op rerun stability of the union, the flag-OFF fallback path, and the prune-only removal branch.
- [x] CHK-FIX-005 [P1] Matrix axes asserted: resolver shape, outside-root error, null-over-existing parent, differing non-null parent, missing child union, prune removal, flag-OFF passthrough, both-generator parity. 11 rows.
- [x] CHK-FIX-006 [P1] Hostile env variant executed: the flag is process-env-global and the suite flips `SPECKIT_IDENTITY_MERGE_SAFETY` on and off per case with restore in `beforeEach`/`afterEach`.
- [ ] CHK-FIX-007 [P1] Evidence pinned to working-tree diff (unstaged for orchestrator review), no fix SHA exists yet because nothing is committed. DEFERRED to commit time.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] The resolver rejects an outside-root absolute path with `SpecFolderIdentityError` rather than fabricating a relative one, asserted
- [x] CHK-032 [P1] No new execution surface introduced by the resolver or the merge guard, path-segment math plus one existing-style readdir only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized, with the module-location and second-call-site deviations recorded in tasks.md and the summary
- [x] CHK-041 [P1] Code comments adequate, durable WHY only, no artifact ids or spec paths embedded
- [x] CHK-042 [P2] README update not applicable, no public surface or install step changed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files created, the suite uses `mkdtempSync` under the OS temp dir and cleans it in `afterEach`
- [x] CHK-051 [P1] No scratch/ artifacts to clean
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 11/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-22. Two P1 items carry documented deferrals: CHK-FIX-007 (no fix SHA, changes left unstaged for the orchestrator) and the T009 grandfather report listing (scoped to the follow-up pass). All P0 items verified against passing vitest.
<!-- /ANCHOR:summary -->

---
