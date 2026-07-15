---
title: "Research: 031 Generated JSON Quality and Safety Study [template:research]"
description: "A 10-angle deep-research study on improving the quality and safety of the spec-kit generated JSON metadata, description.json and graph-metadata.json, and the generators that produce them. Finds that two safety classes dominate, broad-walk over-reach and non-idempotent writes, both of which produce unscoped cross-session commit churn, and that a single shared identity resolver plus a first-class generated-metadata validator are the convergent fixes that four and three angles reached independently. Confirms the z_future backfill crash fix already shipped this session and scopes the residual to the split exclusion policy. Produces 14 ranked proposals across four themes with a recommended build order."
trigger_phrases:
  - "generated json quality research"
  - "graph metadata safe regeneration"
  - "description json scoping fix"
  - "spec folder identity canonicalizer"
  - "generated metadata validator"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/005-shared-engine-and-research/006-generated-metadata-quality-research"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Synthesized and skeptically cross-checked the 10-angle generated-JSON research"
    next_safe_action: "Decide build phases and scope the shared identity resolver first"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Research: 031 Generated JSON Quality and Safety Study

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

The spec-kit generators that produce `description.json` and `graph-metadata.json` over-reach and churn. They walk the whole specs tree ignoring the folder arg, they bump timestamps on unchanged content, they admit free-text statuses with em-dashes, the `causal_summary` drifts from the doc, `parent_id` is sometimes set null, the `specFolder` path shape is inconsistent, and the global `descriptions.json` regen pulls in other sessions' folders. Ten angle-diverse research seats, each reading the live generator, parser, schema, and discovery code, converged on a clear set of fixes.

The diagnosis is that two safety classes dominate and both produce the same visible symptom, unscoped cross-session commit churn. Class one is broad-walk over-reach, the backfill CLI ignores a positional folder and defaults to the repo-wide root, and runtime search regenerates a global cache as a side effect. Class two is non-idempotent writes, the description path stamps wall-clock time and writes unconditionally so a rerun dirties unchanged folders. A re-derive can also erase valid lineage, `mergeGraphMetadata` spreads the refreshed payload and does not preserve a non-null `parent_id` or an append-only `children_ids`, so a scoped or racing scan deletes relationships.

The fix is convergent. Four independent angles arrived at one shared spec-folder identity resolver, a single helper that returns a specs-root-relative `specFolder`, `parentId`, and `childrenIds` from the absolute path, used by both generators, which removes the path-shape drift and gives the merge path a safe parent-preservation rule. Three angles arrived at a first-class generated-metadata validator wired into `validate.sh` strict mode, which turns the shallow warning-level shell checks into a real completion gate and closes the status enum at the schema boundary.

Two facts shape the build order. First, the z_future backfill crash is already fixed this session, `EXCLUDED_DIRS` includes `z_future` at `backfill-graph-metadata.ts:27` and `ARCHIVE_SEGMENT_RE` guards traversal at `:28`, so any z_future proposal is already-done. The residual the seats found is real but smaller, the exclusion policy is split across backfill, memory-index, code-graph, and description discovery, and the z_archive divergence between memory and code-graph is documented and by-design, not a bug. Second, graph metadata is already idempotent, `graphMetadataEqualIgnoringVolatile` plus a no-op skip at `:1275-1286` already prevents timestamp-only graph churn, so the determinism work is description-side only and the graph fingerprint is a hardening nicety not a fix.
<!-- /ANCHOR:summary -->

---

## 2. METHOD

- **Ten angle-diverse research seats** run in parallel through a Workflow, each scoped to its files and read-only. Angles spanned generator over-reach, z_future exclusion residual, write determinism, the status enum, causal-summary drift, parent_id integrity, path-format canonicalization, the global index regen, a first-class JSON validator, and the unifying safe-regeneration contract.
- **Skeptical cross-model verification**, the load-bearing claims were independently re-checked against the live code by this synthesis model, a different model than the gpt-5.5 seats that surfaced them. The check confirmed the status normalizer leak, the parent_id merge gap, and the z_future already-shipped fix, and it downgraded the claims listed in section 6.
- **40 raw proposals**, four per angle, deduplicated and merged into 14 ranked entries. Several angles converged, so the scoped-boundary, identity-resolver, idempotent-write, and validator clusters each fold three or four source findings into one ranked proposal. Every proposal cites a file the seat read, an unevidenced claim was downgraded in synthesis.

---

## 3. THE FOUR SAFETY CLASSES

| Class | What it is | Proposals | Shared code |
|-------|-----------|-----------|-------------|
| A: broad-walk over-reach | Backfill ignores the folder arg and walks the repo-wide root, runtime search regenerates a global cache as a side effect | ranks 1, 4, 8 | backfill collectSpecFolders + folder-discovery cache |
| B: non-idempotent writes | Description and global cache stamp wall-clock time and write unconditionally, so reruns churn unchanged folders | ranks 5, 7 | folder-discovery write helpers |
| C: relationship and identity drift | parent_id set null and children_ids replaced on re-derive, plus inconsistent specFolder path shapes | ranks 2, 3 | graph-metadata-parser merge + spec-doc-paths |
| D: weak generated-JSON contract | Free-text statuses leak, the validator is shallow and warning-level, drift is not detected | ranks 6, 9, 10, 11, 12 | graph-metadata-schema + validate.sh registry |

Classes A and B share the visible symptom of unscoped cross-session commit churn. Class C is the lineage-loss safety risk. Class D is the missing enforcement that lets all three regress silently.

---

## 4. RANKED PROPOSALS

### P0, the unblockers and the root-cause fixes
- **[1] P0/M Add an explicit scoped backfill boundary.** From angles 01, 06, 10. The backfill CLI ignores a positional folder and defaults to the repo-wide root, then refreshes every collected folder, and unsupported paths only fail later inside `refreshGraphMetadataForSpecFolder`. Add `--spec-folder` or a required positional target that refreshes one packet only, reject unknown args, validate the resolved folder through supported-root checks, and keep broad mode behind explicit `--all`. The single highest-leverage scope fix.
- **[2] P0/M Centralize a shared spec-folder identity resolver with parent preservation.** From angles 06, 07, 10. `description.json` stores a caller-base-relative path while graph metadata strips to specs-root-relative, and `mergeGraphMetadata` spreads the refreshed payload without preserving a non-null existing `parent_id`. Introduce one `resolveSpecFolderIdentity(absFolder)` returning a specs-root-relative `specFolder`, `parentId`, and `childrenIds`, used by both generators, and in the merge preserve an existing non-null parent when recomputation returns null with a review flag. The convergent root-cause fix.
- **[3] P0/M Make children_ids append-only and parent_id reconciled in mergeGraphMetadata.** From angle 06. The merge takes top-level `parent_id` and `children_ids` from the refreshed snapshot, so a scoped or racing scan deletes children and a null-deriving parent erases lineage. Default `children_ids` to a stable union of existing and refreshed, reconcile `parent_id` as `refreshed ?? existing ?? null`, and require an explicit prune or repair mode to remove relationships.
- **[5] P0/M Make description.json and the global cache content-hash gated.** From angles 03, 08. The description path stamps `lastUpdated` with `new Date` and writes unconditionally, and the aggregate cache stamps `generated` and folder `lastUpdated` with wall-clock time, so reruns dirty unchanged folders. Add a deterministic fingerprint, preserve timestamps on no semantic delta, and skip the write when content is unchanged. Keep canonical-save tracking allowed to bump `lastUpdated`.
- **[6] P0/S Close the derived.status type at the schema boundary.** From angles 04, 09. `normalizeDerivedStatus` returns the raw normalized string for any unknown value and the Zod schema accepts any non-empty string, so em-dash prose becomes a valid status. Add a shared `GRAPH_METADATA_STATUS_VALUES` const, switch the schema to `z.enum`, and make the normalizer return only an enum value or null.
- **[8] P0/M Add a targeted global-cache upsert and split incremental from rebuild.** From angle 08. Running the per-folder generator triggers `ensureDescriptionCache` to regenerate the whole tree by scanning every base path, pulling unrelated sessions' folders into a scoped commit. Add `upsertDescriptionCacheEntry` that replaces only the target entry and writes only when it changed, and reserve full rebuild for structural changes like delete or rename.
- **[9] P0/M First-class generated-metadata validator wired into strict mode.** From angles 04, 07, 09. The current `GRAPH_METADATA_SHAPE` and `DESCRIPTION_SHAPE` checks are shallow shell guards registered as warnings, while the real schemas already exist. Add a TypeScript rule bridge `GENERATED_METADATA_INTEGRITY` that validates both JSON files through the shared schemas plus path-prefix and enum invariants, registered as error in strict mode with a grandfather report mode for first rollout.

### P1, the corroboration and hardening
- **[4] P1/M Make backfill collection match writer rules and isolate failures.** From angles 01, 02. Skip candidates whose `graph-metadata.json` path fails `canClassifyAsGraphMetadataPath`, and wrap each folder refresh so one corrupt folder reports skipped or failed without aborting the whole run. This is the structural form of the z_future crash class.
- **[7] P1/M Stop preserving legacy bad statuses and re-derive on the closed enum.** From angle 04. When a packet has no `implementation-summary.md`, the parser preserves the existing status after a normalization that admits arbitrary strings. Preserve an existing status only when it is already an enum value, otherwise re-derive or fall back to planned plus a review flag.
- **[10] P1/L Add a generated-metadata drift gate.** From angles 05, 09, 10. There is no persisted proof that a stored `causal_summary` or `description` matches current docs, and `memory_save` only emits an advisory. Add `checkGeneratedMetadataDrift(specFolder)` used by strict validation and dry-run backfill that re-derives one folder, compares generated fields ignoring volatile timestamps, and reports drift. Pairs with adding `source_doc_hashes`.
- **[11] P1/M Use one shared synopsis extractor for both fields.** From angle 05. `description` and `causal_summary` use two different extractors, so they legitimately diverge from the same doc. Create one `derivePacketSynopsis` helper with explicit precedence used for both fields with field-specific length limits.
- **[12] P1/M Authoritative z_* exclusion helper and descriptions.json guard.** From angle 02. The z_future backfill fix shipped, but the exclusion policy is split across backfill, memory-index, code-graph, and description discovery. Add one helper used at traversal boundaries, apply it to the description scanner whose local skip list omits z_*, and keep memory z_archive inclusion by-design via a separate generatedMetadata policy.

### P2, the refinements
- **[13] P2/M Persist a graph-metadata source fingerprint and unify the phase-child contract.** From angles 03, 06. Graph metadata is already idempotent via the volatile-ignoring compare, so a persisted `source_fingerprint` is hardening not a fix. Pair it with one shared `listPhaseChildren` helper so `isPhaseParent` and `resolveChildrenIds` agree on what a child is.
- **[14] P2/L Separate access and freshness telemetry from generated JSON.** From angle 03. `last_accessed_at` and phase-parent pointer updates mutate metadata files on reads and resumes. Keep access events in the DB or index layer so generated JSON changes only on source or structural change. Kept as a larger refactor, scoped after the P0 and P1 work lands.

---

## 5. CROSS-CUTTING THEMES

1. Two safety classes dominate, broad-walk over-reach and non-idempotent writes, and both surface as the same symptom, unscoped cross-session commit churn that buries real diffs.
2. A single shared spec-folder identity resolver is the convergent fix four angles reached independently, it removes path-shape drift and gives the merge path a safe parent-preservation rule.
3. A first-class generated-metadata validator in strict mode is the convergent enforcement three angles reached, it turns shallow warning-level shell checks into a real completion gate and closes the status enum.
4. The z_future backfill crash is already fixed, so the residual is the split exclusion policy, and the z_archive divergence between memory and code-graph is documented and by-design, not a bug.
5. Graph metadata is already idempotent, so the determinism work is description-side only and the graph fingerprint is hardening not a fix.
6. The relationship-loss risk is the merge path, not the resolvers, `mergeGraphMetadata` discards top-level `parent_id` and `children_ids` even though it preserves manual and selected derived fields.
7. Every behavioral fix should ship behind a default-off flag or a grandfather report mode and graduate only after a scoped migration, because many existing files carry the very prose statuses and prefixed paths the new contract rejects.

---

## 6. VERIFICATION

The load-bearing claims were independently re-checked against the live code by this synthesis model, a different model than the gpt-5.5 seats that surfaced them. The core findings are confirmed by direct file evidence. The skeptical pass downgraded four claims and marked one already-done, none of the P0 root-cause fixes was refuted.

| Claim | Verdict | Confirmed, and the skeptical note |
|-------|---------|-----------------------------------|
| Status normalizer admits prose (ranks 6, 7) | CONFIRMED | Verified `normalizeDerivedStatus` returns the raw normalized string in the default branch at `graph-metadata-parser.ts:179-180`, so em-dash prose is admitted. The fix is feasible at the schema boundary. |
| mergeGraphMetadata drops parent_id and children_ids (ranks 2, 3) | CONFIRMED | Verified `mergeGraphMetadata` spreads `...refreshed` at `graph-metadata-parser.ts:1149-1161` and preserves only manual and selected derived fields, so top-level `parent_id` and `children_ids` come from the refreshed snapshot and a null-deriving re-derive erases lineage. |
| z_future backfill crash fix shipped (angle 02) | ALREADY-DONE | Verified `EXCLUDED_DIRS` includes `z_future` at `backfill-graph-metadata.ts:27` and `ARCHIVE_SEGMENT_RE` at `:28`. The residual is the split policy only, ranked P1 not P0. |
| z_archive memory vs code-graph divergence is a bug | DOWNGRADED | The seats framed the memory-vs-code-graph z_archive split as inconsistency to fix. It is documented and by-design, `EXCLUDED_FOR_MEMORY` keeps z_archive in the memory index deprioritized by ARCHIVE_MULTIPLIERS 0.1 at `index-scope.ts:183-186`. Scoped to a separate generatedMetadata policy, not an exclusion change. |
| Graph metadata is non-deterministic (angle 03 framing) | DOWNGRADED | The seed framing said the generators bump `last_save_at` on unchanged content. True for description, but graph metadata is already idempotent via `graphMetadataEqualIgnoringVolatile` and the no-op skip at `graph-metadata-parser.ts:1275-1286`. The graph fingerprint (rank 13) is hardening, not a fix, so it dropped to P2. |
| Description discovery has unconditional write side effects (rank, angle 01) | CONFIRMED, scope-narrowed | Verified the side-effect write exists, but the cleanest fix is the scoped upsert at rank 8 plus the read-only-by-default search path, not a broad rewrite of discovery. The angle-01 read-only proposal folds into rank 8. |
| Causal-summary drift detection needs source hashes (angle 05) | CONFIRMED, merged | Verified there are no persisted source hashes, so drift cannot be proven. Three near-identical drift proposals across angles 05, 09, 10 merged into rank 10 to avoid triple-counting one fix. |

Net effect, the convergent identity-resolver and validator fixes and the merge-path lineage-preservation guard are all verified against live code. The single material correction to the seed framing is that two of its premises, z_future-exclusion and graph non-determinism, are already solved, so the priority shifts onto the description-side writes, the merge path, and the status enum.

---

## 7. RECOMMENDED BUILD ORDER

1. **Ship the scoped boundary and the identity resolver first** (ranks 1 then 2), they are the highest-leverage scope and drift fixes and the resolver is a dependency for the validator path invariants and the merge guard.
2. **Then the merge-path lineage guard and the description idempotency** (ranks 3 and 5) behind a default-off or grandfather mode, validated against a scoped migration so existing files do not mass-fail.
3. **Then the status enum and the global-cache upsert** (ranks 6 and 8), small and independent, then the validator (rank 9) once the resolver and enum exist for it to assert against.
4. **Then the P1 hardening** (ranks 4, 7, 10, 11, 12), the failure-isolation, the legacy-status re-derive, the drift gate, the shared synopsis extractor, and the authoritative z_* helper.
5. **Defer the P2 refinements** (ranks 13 and 14) to a backlog, the graph fingerprint is hardening and the telemetry split is a larger refactor.

---

<!-- ANCHOR:references -->
## 8. REFERENCES

- `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` the backfill CLI, scoping, and the shipped z_future exclusion.
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` the status normalizer, the merge path, and the idempotency compare.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` the description generation, the global cache, and the write helpers.
- `.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts` the split exclusion policy and the by-design z_archive memory inclusion.
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` the permissive status and path-identity schemas to close.
- `.opencode/skills/system-spec-kit/scripts/rules/` and `validator-registry.json` the shallow warning-level checks to replace with a strict-mode rule.
- `research/deltas/` the ten per-angle finding sets.
<!-- /ANCHOR:references -->
