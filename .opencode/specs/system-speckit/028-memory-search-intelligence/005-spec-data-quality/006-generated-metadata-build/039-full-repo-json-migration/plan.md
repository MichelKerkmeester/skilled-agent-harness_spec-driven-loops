---
title: "Implementation Plan: Full-Repo Generated-JSON Migration [template:level_2/plan.md]"
description: "Build a Stage 3 migration driver that enumerates every spec folder in the repo including z_archive and z_future and regenerates each description.json and graph-metadata.json through the scoped per-folder generator with the J1 to J4 flags ON, never the legacy whole-tree walk, gated on a byte-stable second run, a zero-violation phase 036 validator pass and a validate-clean tree, landed as scoped commits batched by track."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/039-full-repo-json-migration"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the plan at PLANNED, scoped-loop migration with a three-part gate"
    next_safe_action: "Confirm J1 to J4 are done, then build the enumerator and the scoped loop"
    blockers:
      - "HARD-GATED on phases 033 through 036 being done and tested"
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts"
      - ".opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-039-full-repo-json-migration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Full-Repo Generated-JSON Migration

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
| **Language/Stack** | TypeScript, the spec-kit `scripts/graph` and `scripts/memory` generator tooling |
| **Framework** | The scoped per-folder backfill path plus the generated-metadata validator |
| **Storage** | Per-folder `description.json` and `graph-metadata.json` across the whole repo including the archive trees |
| **Testing** | One vitest proving full coverage, a no-diff second run, a zero-violation validator pass and no whole-tree walk |

### Overview
This phase delivers the Stage 3 migration. It builds a driver that enumerates every spec folder in the repo, including `z_archive` and `z_future`, and regenerates the `description.json` and `graph-metadata.json` for each one by calling the scoped per-folder generator with the J1 to J4 flags ON. The new format lands on every file, enum-clean `derived.status`, paths prefixed with `.opencode/specs/`, and preserved `parent_id` and `children_ids`. The migration is gated on three proofs, a byte-stable second run with no diff, a zero-violation pass under the phase 036 validator, and a clean `validate.sh` tree, and it lands as scoped commits batched by track. It never invokes the legacy whole-tree walk, so it does not regress the unscoped churn phase 034 removed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 033 through 036 confirmed done and tested
- [ ] The scoped `--spec-folder` generator path confirmed available
- [ ] The phase 036 validator confirmed enforcing the enum, path and parent-link rules

### Definition of Done
- [ ] Every generated JSON in the repo including the archives regenerated onto the new format
- [ ] A second run yields no diff and the validator reports zero violations
- [ ] Scoped commits batched by track with the archives as their own batch
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A scoped loop over a complete enumeration. One driver enumerates every folder, then calls the scoped per-folder generator once per folder with the hardened flags ON, then proves stability, conformance and completeness. No new generator logic, the driver composes the phase 034 scoped path and the phase 036 validator that already exist.

### Key Components
- **Folder enumerator**: walks the whole `.opencode/specs` tree including `z_archive` and `z_future` and yields every spec folder, so no folder is skipped.
- **Scoped regeneration loop**: calls the phase 034 backfill `--spec-folder` path once per enumerated folder with the J1 to J4 flags ON, so each folder is regenerated in isolation and the whole-tree walk is never used.
- **Conformance check**: runs the phase 036 generated-metadata validator over the regenerated tree and asserts zero enum, path and parent-link violations.
- **Idempotency check**: re-runs the migration and asserts an empty diff, relying on the phase 035 content-hashed writes.
- **Commit batching**: groups the regenerated files into scoped commits by track, with the archive trees as their own batch.

### Data Flow
The enumerator yields a folder, the loop calls the scoped generator on it with the flags ON, the generator rewrites the folder's `description.json` and `graph-metadata.json` onto the new format preserving the parent links, and the content-hashed write skips a folder that is already conformant. After the loop, the validator runs over the whole tree and `validate.sh` runs to confirm clean. The migration is then re-run, and an empty diff confirms idempotency. The result lands as scoped commits batched by track.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The scoped `--spec-folder` backfill path (phase 034) | Regenerates one folder's generated JSON in isolation | reuse as the only regeneration entry point, called once per enumerated folder | a test asserts the scoped path is called once per folder and the whole-tree walk is never called |
| The folder enumerator over `.opencode/specs` | Lists spec folders for tooling | extend or confirm it reaches `z_archive` and `z_future` so no folder is skipped | a test asserts an archive folder and a future folder are both enumerated and rewritten |
| The phase 036 generated-metadata validator | Enforces the enum-clean status, the path prefix and the preserved parent links | reuse as the zero-violation gate over the regenerated tree | the validator exits clean over the whole regenerated tree |
| The phase 035 content-hashed writes | Skip a write when the content is unchanged | rely on for the no-diff second run | a second migration run produces an empty diff |
| Per-folder `description.json` and `graph-metadata.json` repo-wide | Carry the legacy format the new contract rejects | regenerate onto the new format preserving the parent links | every regenerated file passes the validator and a folder with prior parent links keeps them |

Required inventories:
- Generated-JSON producers: `rg -n 'description.json|graph-metadata.json' .opencode/skills/system-spec-kit/scripts`.
- Whole-tree-walk entry points to avoid: `rg -n 'generateFolderDescriptions|ensureDescriptionCache|walk|tree' .opencode/skills/system-spec-kit/scripts/graph`.
- Coverage axes: top-level tracks, phase children, `z_archive`, `z_future`, a folder missing a prior file, a folder already conformant.
- Algorithm invariant: every folder is enumerated and regenerated through the scoped path only, the output passes the validator with zero violations, a second run yields no diff, and the parent links survive.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phases 033 through 036 are done and tested and the J1 to J4 flags are available to turn ON
- [ ] Confirm the scoped `--spec-folder` generator path accepts a single folder and the enumerator reaches the archive trees
- [ ] Decide the commit batching, by track with the archives as their own batch

### Phase 2: Core Implementation
- [ ] Build the enumerator over the whole `.opencode/specs` tree including `z_archive` and `z_future`
- [ ] Build the scoped regeneration loop that calls the per-folder generator once per folder with the flags ON
- [ ] Wire the phase 036 validator as the zero-violation conformance gate over the regenerated tree
- [ ] Add the per-folder coverage summary counting enumerated, rewritten and already-conformant folders

### Phase 3: Verification
- [ ] Run the migration, then run the validator and `validate.sh` and confirm zero violations
- [ ] Re-run the migration and confirm an empty diff, proving idempotency
- [ ] Confirm an archive folder and a future folder are both covered and rewritten onto the new format
- [ ] Land the result as scoped commits batched by track with the archives as their own batch
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The enumerator reaches every folder including the archives and the loop calls the scoped path once per folder | `migrate-generated-json.vitest.ts` |
| Integration | A migration over a temp fixture tree regenerates onto the new format, a second run yields no diff, and the validator reports zero violations | `migrate-generated-json.vitest.ts` over a fixture tree |
| Manual | Confirm the real repo migration lands clean under `validate.sh` and the scoped commits batch by track | migration run plus `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 033 through 036, the J1 to J4 generators | Internal | Blocked | HARD-GATED, the migration cannot run until all four are done and tested |
| The phase 034 scoped `--spec-folder` path | Internal | Blocked | The migration loops this path, absent it there is no scoped regeneration |
| The phase 036 generated-metadata validator | Internal | Blocked | The migration gates on it, absent it there is no zero-violation proof |
| The phase 035 content-hashed writes | Internal | Blocked | The no-diff second run relies on these, absent them the migration cannot prove idempotency |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The migration regresses a generated JSON, drops a parent link, or leaves a residual diff on the second run.
- **Procedure**: Revert the scoped commits for the affected track, leaving the rest of the migration intact, then re-run the scoped regeneration on that track after fixing the driver.
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
| Setup | J1 to J4 done | Core |
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
| Verification | Med | 2-4 hours |
| **Total** | | **7-12 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] J1 to J4 confirmed done and tested before the migration runs
- [ ] A dry run over a temp fixture tree proven to regenerate, settle on a no-diff second run and pass the validator
- [ ] The coverage summary confirmed to reconcile to the enumerated folder total

### Rollback Procedure
1. Revert the scoped commits for the affected track
2. Confirm the rest of the migrated tree still passes the validator and `validate.sh`
3. Fix the driver and re-run the scoped regeneration on the reverted track
4. Re-run the migration end to end and confirm an empty second-run diff

### Data Reversal
- **Has data migrations?** Yes, this phase regenerates generated JSON across the whole repo
- **Reversal procedure**: The generated JSON is reproducible from the docs by re-running the generators, so a revert of the scoped commits plus a re-run restores a consistent tree, the authored docs are never touched
<!-- /ANCHOR:enhanced-rollback -->

---
</content>
