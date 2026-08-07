---
title: "Implementation Plan: Scoped Backfill Boundary and Exclusion Unification [template:level_2/plan.md]"
description: "Add an explicit scoped backfill boundary that refreshes one packet by default with broad mode behind a default-off --all flag, make collection match the writer rules and isolate per-folder failures, and introduce one authoritative z_* exclusion helper with a descriptions.json guard that closes the description-scanner gap, every behavioral fix shipping behind a default-off flag or a grandfather report mode and the by-design z_archive memory inclusion preserved through a separate generatedMetadata policy."
trigger_phrases:
  - "scoped backfill boundary"
  - "backfill spec folder positional"
  - "collection matches writer rules"
  - "authoritative z exclusion helper"
  - "descriptions json z guard"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/002-scoped-backfill-boundary"
    last_updated_at: "2026-07-04T17:11:58.400Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Planned scoped boundary, writer-rule collection, exclusion helper"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts"
      - ".opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-034-scoped-backfill-boundary"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Scoped Backfill Boundary and Exclusion Unification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript spec-kit scripts plus the compiled dist, Node ESM |
| **Framework** | spec-kit backfill CLI and the MCP folder-discovery and index-scope helpers |
| **Storage** | The per-folder `graph-metadata.json` and the global `descriptions.json` cache |
| **Testing** | A new vitest plus a dist rebuild and a scoped grep proof of the unified helper |

### Overview
This phase ships the three boundary-and-exclusion recs the 031 research ranked as the highest-leverage scope fix and its P1 hardening. Rec 1 adds an explicit scoped backfill boundary so a default run refreshes one packet only, rejects unknown args, validates the resolved folder through the supported-root checks, and keeps broad mode behind a default-off `--all` flag. Rec 4 makes collection match the writer rules by skipping candidates whose `graph-metadata.json` path fails `canClassifyAsGraphMetadataPath` and wraps each refresh so one corrupt folder reports skipped or failed without aborting the run. Rec 12 introduces one authoritative z_* exclusion helper used at every traversal boundary, applies it to the description scanner whose local skip list omits z_*, and preserves the by-design z_archive memory inclusion through a separate generatedMetadata policy. Every behavioral fix ships behind a default-off flag or a grandfather report mode, because existing files carry the prose statuses and prefixed paths the new contract rejects and a hard cutover would mass-fail them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three independent surgical changes over existing CLI and helper code, no merge-path or schema change. The backfill CLI gains a scoped boundary and a failure-isolating collection loop, the description scanner adopts a shared exclusion helper, and one helper plus a separate generatedMetadata policy replace four divergent skip lists. Every behavioral change is gated behind a default-off flag or a grandfather report mode so the live tree does not mass-fail.

### Key Components
- **`backfill-graph-metadata.ts`**: the backfill CLI. It gains a required positional target or `--spec-folder` that refreshes one packet, rejects unknown args, validates through the supported-root checks, keeps broad mode behind a default-off `--all`, matches the writer rules in collection via `canClassifyAsGraphMetadataPath`, and wraps each refresh so a corrupt folder reports skipped or failed without aborting.
- **`backfill-graph-metadata.js`**: the compiled dist the live CLI runs. It is rebuilt from the source change so the scoped boundary and the failure isolation ship live.
- **`folder-discovery.ts`**: the description generation and global cache. Its description scanner adopts the authoritative z_* exclusion helper in place of its local skip list, behind a default-off flag or a grandfather report mode.
- **`index-scope.ts`**: the split exclusion policy. It gains the one authoritative z_* exclusion helper and the separate generatedMetadata policy that preserves the by-design z_archive memory inclusion and the ARCHIVE_MULTIPLIERS deprioritization.
- **`scoped-backfill-boundary.vitest.ts`**: the proof. It covers the single-packet default run, the unknown-arg and supported-root rejections, the corrupt-folder isolation, and the z_* prefixed folder refused by the description scanner.

### Data Flow
A scoped invocation resolves one folder, validates it through the supported-root checks, and refreshes only that packet, touching no sibling. An explicit `--all` invocation collects candidates, skips any whose `graph-metadata.json` path fails the writer rule, and wraps each refresh so a corrupt folder reports skipped or failed while every healthy folder still refreshes. The description scanner walks discovery folders through the authoritative z_* exclusion helper, so a z_* prefixed folder never enters the `descriptions.json` cache, while the memory index keeps the by-design z_archive inclusion through the separate generatedMetadata policy.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `backfill-graph-metadata.ts` CLI args | Ignores a positional folder and defaults to the repo-wide root, refreshing every collected folder | add a required positional target or `--spec-folder` that refreshes one packet, reject unknown args, validate through the supported-root checks, keep broad mode behind a default-off `--all` | a default run with one folder refreshes only that packet, an unknown arg or a missing target exits non-zero, and a non-root target is rejected before any write |
| `backfill-graph-metadata.ts` collection | Admits candidates the writer would reject and aborts the whole run on one corrupt folder | skip candidates whose `graph-metadata.json` path fails `canClassifyAsGraphMetadataPath`, wrap each refresh so one corrupt folder reports skipped or failed without aborting | a writer-rejected candidate is skipped during collection and an `--all` run over a set with one corrupt folder completes with that folder reported and every healthy folder refreshed |
| `backfill-graph-metadata.js` dist | The compiled CLI the live runtime executes | rebuild the dist from the source change so the scoped boundary and the failure isolation ship live | the dist carries the new positional or flag and the failure-isolating loop, and a grep confirms the source and dist agree |
| `folder-discovery.ts` description scanner | A local skip list that omits z_*, so the `descriptions.json` cache can admit a z_* prefixed folder | apply the authoritative z_* exclusion helper in place of the local skip list, behind a default-off flag or a grandfather report mode | the scanner uses the shared helper, a z_* prefixed folder never enters the cache, and a grep shows no divergent skip list remaining in the description path |
| `index-scope.ts` exclusion policy | The split exclusion policy across backfill, memory-index, code-graph, and description discovery, plus the by-design z_archive memory inclusion | add one authoritative z_* exclusion helper and a separate generatedMetadata policy that preserves the z_archive memory inclusion and the ARCHIVE_MULTIPLIERS deprioritization | the helper is the single source of truth at every traversal boundary, the memory index still includes z_archive deprioritized, and a unit assertion confirms the two policies do not collide |
| Behavioral cutover surface | The live tree carries prose statuses and prefixed paths the new contract rejects | gate every behavioral fix behind a default-off flag or a grandfather report mode that reports offenders without failing | toggling the flag off restores prior behavior and the grandfather mode reports the existing prefixed-path and prose-status offenders without mass-failing the tree |

Required inventories:
- Same-class producers: `rg -n 'EXCLUDED_DIRS|z_future|z_archive|canClassifyAsGraphMetadataPath' .opencode/skills/system-spec-kit`.
- Consumers of the exclusion policy: `rg -n 'EXCLUDED_FOR_MEMORY|ARCHIVE_MULTIPLIERS|skip|exclude' .opencode/skills/system-spec-kit/mcp_server/lib`.
- Matrix axes: scoped single-packet run, missing target, unknown arg, non-root target, broad `--all` run, corrupt-folder isolation, z_* prefixed folder refused by the scanner, grandfather report mode over existing offenders.
- Algorithm invariant: a default run refreshes one packet only, broad mode requires `--all`, collection matches the writer rules and isolates failures, one helper governs every traversal boundary, the by-design z_archive memory inclusion is preserved, and every behavioral fix is reachable behind a default-off flag or a grandfather report mode.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the backfill CLI default path and the positional or flag the scoped boundary will use, with broad mode behind a default-off `--all`
- [ ] Confirm `canClassifyAsGraphMetadataPath` is the writer rule collection must match and locate the per-folder refresh call to wrap
- [ ] Inventory the four divergent z_* skip lists and confirm the description scanner is the one whose list omits z_*
- [ ] Confirm the by-design z_archive memory inclusion at `index-scope.ts:183-186` and the ARCHIVE_MULTIPLIERS deprioritization to preserve

### Phase 2: Core Implementation
- [ ] Add the scoped backfill boundary, a required positional target or `--spec-folder` that refreshes one packet, reject unknown args, validate through the supported-root checks, and keep broad mode behind a default-off `--all`
- [ ] Make collection match the writer rules by skipping candidates whose `graph-metadata.json` path fails `canClassifyAsGraphMetadataPath`, and wrap each refresh so one corrupt folder reports skipped or failed without aborting
- [ ] Add one authoritative z_* exclusion helper, apply it to the description scanner in place of its local skip list, and add the separate generatedMetadata policy that preserves the z_archive memory inclusion, all behind a default-off flag or a grandfather report mode
- [ ] Rebuild the dist so the scoped boundary and the failure isolation ship live

### Phase 3: Verification
- [ ] A default run with one folder refreshes only that packet and touches no sibling, and a run without `--all` never walks the repo-wide root
- [ ] An `--all` run over a set with one corrupt folder completes with that folder reported skipped or failed and every healthy folder refreshed
- [ ] A z_* prefixed folder never enters the `descriptions.json` cache through the scanner, and a grep shows one authoritative helper rather than four divergent skip lists
- [ ] The grandfather report mode reports existing prefixed-path and prose-status offenders without mass-failing the tree
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The scoped boundary rejects a missing target, an unknown arg, and a non-root target, the writer rule skips a rejected candidate, and the exclusion helper refuses a z_* prefixed folder while the generatedMetadata policy preserves the z_archive memory inclusion | `scoped-backfill-boundary.vitest.ts` |
| Integration | A default single-packet run touches no sibling, and an `--all` run over a set with one corrupt folder isolates the failure and refreshes every healthy folder | `scoped-backfill-boundary.vitest.ts` over a fixture spec tree |
| Manual | A grep confirms one authoritative exclusion helper at every traversal boundary, the source and dist agree, and the grandfather report mode reports offenders without failing | grep plus a dry-run grandfather report |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The backfill CLI arg parsing and the supported-root checks | Internal | Green | The scoped boundary cannot reject a non-root target without the existing root check |
| The writer rule `canClassifyAsGraphMetadataPath` | Internal | Green | Collection cannot match the writer rules without the shared path classifier |
| The by-design z_archive memory policy at `index-scope.ts:183-186` | Internal | Green | The exclusion unification must preserve this documented inclusion |
| A dist rebuild path for the backfill script | Internal | Green | The scoped boundary does not ship live until the dist is rebuilt |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The scoped boundary blocks a legitimate broad-walk caller, the failure isolation hides a real abort, or the exclusion unification drops the by-design z_archive memory inclusion.
- **Procedure**: Toggle the default-off flag back to the prior behavior, or revert the CLI and helper changes and rebuild the dist. The grandfather report mode means no existing file was hard-failed, so no data reversal is needed.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 4-6 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The default-off flag and the grandfather report mode proven before any default-on graduation
- [ ] The by-design z_archive memory inclusion preserved by a unit assertion
- [ ] The dist rebuilt and confirmed to match the source

### Rollback Procedure
1. Toggle the default-off flag back to the prior backfill and scanner behavior
2. If needed, revert the `backfill-graph-metadata.ts`, `folder-discovery.ts`, and `index-scope.ts` changes
3. Rebuild the dist so the live CLI returns to its prior state
4. Re-run the vitest to confirm the tree returns to its shipped behavior

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change adds CLI args, helper logic, and a vitest, and the grandfather report mode means no existing file was hard-failed
<!-- /ANCHOR:enhanced-rollback -->

---
