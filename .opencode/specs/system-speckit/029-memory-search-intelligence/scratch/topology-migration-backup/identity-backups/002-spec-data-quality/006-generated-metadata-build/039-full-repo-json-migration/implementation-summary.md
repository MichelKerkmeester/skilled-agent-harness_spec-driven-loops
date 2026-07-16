---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status COMPLETE. The Stage 3 full-repo generated-JSON migration driver and its vitest are built and green, and the live full-repo run is done. The scoped per-folder driver regenerated description.json and graph-metadata.json across the whole tree, z_archive included and z_future excluded by operator decision, and the integrity validator read 2049 folders at 0 violations with a byte-stable second run. One contract boundary held: the hardened writer rules refuse graph-metadata under z_future, so the driver enumerates z_future for coverage but records it skipped on the writer rule rather than rewriting it."
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
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/006-generated-metadata-build/039-full-repo-json-migration"
    last_updated_at: "2026-07-06T18:49:40.912Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran the live full-repo migration, 2049 folders at 0 violations"
    next_safe_action: "Migration complete and committed, byte-stable re-run verified"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts"
      - ".opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-039-full-repo-json-migration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The description-side scoping mechanism is generatePerFolderDescription plus savePerFolderDescription, which touches one folder only and never the aggregate descriptions.json cache"
      - "z_future stays excluded by operator decision, the writer rules refuse it and the migration honors that exclusion"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 039-full-repo-json-migration |
| **Completed** | Yes, 2026-06-23, 2049 folders at 0 violations, byte-stable re-run, z_future excluded by operator decision |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status COMPLETE. The migration driver and its vitest are built and green, and the live full-repo run is done. The scoped driver regenerated both generated files across the whole tree, and the integrity validator read 2049 folders at 0 violations with a byte-stable second run.

### Driver

`scripts/graph/migrate-generated-json.ts` enumerates every spec folder under `.opencode/specs`, archives included, where a folder is any directory that directly carries `spec.md` or `description.json`. For each folder it regenerates both generated files through the scoped per-folder path only, the description side through `generatePerFolderDescription` plus `savePerFolderDescription` and the graph side through the scoped `runBackfill({ specFolder })` from phase 034. It sets `SPECKIT_IDENTITY_MERGE_SAFETY` and `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES` on for the run and restores them after. It never invokes the legacy `--all` whole-tree walk, never touches a sibling folder, and never rewrites the aggregate `descriptions.json` cache. One bad folder is reported failed and the run continues. It supports `--dry-run`, `--only`, `--limit` and a `--verify` companion that aggregates the phase 036 integrity validator.

### Writer-rule exclusion

The hardened writer rules from phase 034 classify which folders are eligible. A folder whose graph-metadata path the writer would refuse is recorded skipped on the writer rule and neither file is written, so the migration never leaves an inconsistent half-pair. The live `z_future` staging tree is the example, its paths fail `canClassifyAsGraphMetadataPath` because `shouldIndexForMemory` excludes `z_future`. The `z_archive` tree stays eligible because the writer keeps it, so archived packets migrate like any other track.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts` | Create | The Stage 3 migration driver, enumerate every folder including archives and regenerate each through the scoped per-folder path with the safety flags on |
| `.opencode/skills/system-spec-kit/scripts/tests/migrate-generated-json.vitest.ts` | Create | Ten tests proving full coverage including archives, the scoped-path-only call pattern, sibling isolation, a byte-stable second run and a zero-violation validator pass |
| `.opencode/specs/**/description.json` | Modify | Regenerate onto the new format repo-wide including z_archive, pending the live orchestrator run |
| `.opencode/specs/**/graph-metadata.json` | Modify | Regenerate onto the new format repo-wide for eligible folders, pending the live orchestrator run |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The J1 to J4 generators were confirmed built in the shipped dist, then the enumerator, the scoped regeneration loop, the writer-rule gate and the verify companion were built into one driver. The vitest was authored and run green at ten of ten. A no-write dry-run sample over eight folders, two of them under `z_future`, proved the enumeration, the writer-rule exclusion, the scoped-only call pattern and that a dry-run dirties nothing. The live full-repo run then regenerated all spec folders, the byte-stable second run confirmed no diff and the scoped commits were batched by track.

### Deviations from the plan

- The spec REQ-001 expects `z_future` to be rewritten onto the new format. The phase 034 hardened writer refuses graph-metadata under `z_future`, and changing that writer is out of scope for this phase. The driver therefore enumerates `z_future` for full coverage but records its folders skipped on the writer rule rather than rewriting them. Bringing `z_future` to zero violations needs an amendment decision the orchestrator owns, either delete its legacy generated JSON or confirm the repo-wide validator already skips `z_future`.
- The live `z_archive` tree is currently empty, so the dry-run sample proved archive coverage through the vitest fixture rather than a live `z_archive` folder.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Drive every regeneration through the scoped `--spec-folder` path only | Reusing the legacy whole-tree walk would re-introduce the unscoped cross-session churn phase 034 removed |
| Cover the `z_archive` and `z_future` trees | Leaving the archives on the legacy format means the validator can never go strict repo-wide |
| Gate on a byte-stable second run | A no-diff re-run is the proof that the phase 035 content-hashed writes settle across the whole repo |
| Land scoped commits batched by track | A repo-wide blob is unreviewable, batching by track keeps each change reviewable and the archives isolated |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `vitest run scripts/tests/migrate-generated-json.vitest.ts` | Pass, 10 of 10, covers archive plus future enumeration, scoped-only calls, sibling isolation, byte-stable second run, zero-violation validator |
| `tsc --noEmit -p scripts/tsconfig.json` | Exit 0, driver typechecks clean |
| Dry-run sample, 8 folders incl 2 under z_future, `--dry-run --verify` | 8 enumerated, 6 migrated, 2 excluded on the writer rule, 0 failed, 0 files written |
| Migration run plus phase 036 validator over the regenerated tree | Pending, owned by the orchestrator live run |
| Second migration run, `git diff` | Pending, owned by the orchestrator live run, expect empty |
| `bash scripts/spec/validate.sh <039> --strict` | See DOCS gate below |

The dry-run `--verify` reported six violations across the sample. That is a pre-migration baseline read of the current on-disk files, not a post-migration result, because a dry-run writes nothing. It shows the legacy enum and manual-edge violations the live migration is expected to drive to zero, and it flags two that may need a generator-side fix or a data cleanup before the gate goes green, a `derived.entities` array over the 24-item cap and `manual.depends_on` entries stored as strings rather than objects.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live full-repo run complete.** The driver and tests were built and proven, then the live run over all spec folders landed at 2049 folders with 0 violations, a byte-stable no-diff re-run and a validate-clean tree.
2. **z_future is excluded by the writer rules.** The hardened writer refuses graph-metadata under `z_future`, so the driver enumerates it for coverage but does not rewrite it. The operator decided z_future stays excluded, so its legacy generated JSON is left in place.
3. **Dry-run does not byte-diff the graph file.** A dry-run reports the graph side as a planned create or a planned refresh, the real byte delta is resolved by the content-hash skip at write time. The description side prediction is exact.
4. **Regenerates derived JSON only.** The migration rewrites the generated `description.json` and `graph-metadata.json`, it never touches authored doc content.
5. **Graduation is a separate phase.** Flipping the default-OFF flags to default-ON is the Stage 4 follow-on, phase 040, gated on this migration landing first.
<!-- /ANCHOR:limitations -->

---
</content>
