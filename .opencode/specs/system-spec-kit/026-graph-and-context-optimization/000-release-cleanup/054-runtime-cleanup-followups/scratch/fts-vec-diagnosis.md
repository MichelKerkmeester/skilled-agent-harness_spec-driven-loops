# REQ-002 Diagnosis — "FTS/vec Mismatch" is actually `orphanedFiles`

**Date**: 2026-05-08
**Investigator**: Claude (sonnet/opus 4.7)

## Initial framing was wrong

The `memory_health.consistency.mismatchedIds` array surfaces 50 numeric IDs and was named/framed as a vec-vs-FTS divergence. Reading the source (`handlers/memory-crud-health.ts:430-456` + `lib/search/vector-index-queries.ts:1285-1418`), the array is a heterogeneous bucket that can hold:

- string markers like `'fts_count_mismatch'`, `'missing_vectors:N'`, `'orphaned_vectors:N'`, `'orphaned_chunks:N'`
- the **first 50 numeric IDs** from `integrityReport.orphanedFiles`

In the current state of the DB, the 50 IDs we see are entirely from the orphaned-files slice — there are no string markers. So the report says "consistency degraded" not because vec ≠ FTS, but because there are **orphaned files**.

## What "orphaned files" actually means

`vector-index-queries.ts:1341-1356` `check_orphaned_files()`:

```ts
for (const memory of memories) {
  if (memory.file_path && !fs.existsSync(memory.file_path)) {
    orphaned.push({ id: memory.id, file_path: memory.file_path, reason: 'File no longer exists on filesystem' });
  }
}
```

So an orphaned file is a `memory_index` row whose `file_path` no longer exists on disk.

## Concrete cause for the 50 IDs

All 50 IDs point to file paths under `skilled-agent-orchestration/02X-*` packets that were moved to `z_archive/` at some point. Examples:

| id  | tier        | indexed file_path                                                                       | actual location |
|-----|-------------|-----------------------------------------------------------------------------------------|-----------------|
| 445 | deprecated  | `.../skilled-agent-orchestration/022-mcp-coco-integration/checklist.md`                 | moved to `z_archive/022-mcp-coco-integration/` |
| 446 | deprecated  | `.../skilled-agent-orchestration/023-sk-deep-research-creation/checklist.md`            | `z_archive/023-...` |
| 957 | deprecated  | `.../skilled-agent-orchestration/022-mcp-coco-integration/description.json`             | `z_archive/022-...` |
| 962 | important   | `.../skilled-agent-orchestration/022-mcp-coco-integration/research/research.md`         | `z_archive/022-...` |
| 2620| normal      | `001-phase-1` (other folder)                                                            | path no longer exists |
| 3072| deprecated  | `051-cli-opencode-providers/...`                                                         | path no longer exists |

36/50 of the IDs are in `skilled-agent-orchestration/022-026/` (the bulk of the z_archive move).

## Tier breakdown of the 50 visible orphans

| tier | count | embedding_status | failure_reason |
|------|-------|------------------|----------------|
| deprecated | 19 | success (all) | NULL |
| important  | 12 | success (all) | NULL |
| normal     | 19 | success (all) | NULL |

All 50 have `embedding_status='success'` — confirming this is not an embedding-pipeline failure. The records were indexed cleanly; the underlying files moved later, and the index was never updated.

## Total orphan count

Per `memory_health.consistency.mismatchedIds` we see only the first 50 (line 449: `.slice(0, 50)`). The handover memo from the prior session noted ~3,315 orphan files in total — i.e. ~48% of the entire `memory_index` of 6,858 rows. This is much larger than 50 and represents systemic drift between the index and the filesystem.

## Why `autoRepair: true` doesn't fix it

`verify_integrity` only auto-cleans:
- `orphaned_vectors` (vec rows whose memory_index parent disappeared)
- `orphaned_chunks` (chunk rows whose parent disappeared)

It **never** cleans `orphaned_files` — the function builds the list and returns it, but no caller deletes them. That matches the handover note: "autoRepair already proven not to fix the gap; known-bug class."

## Repair plan (bounded)

**Step 1 — Mass delete orphan memory_index rows.**
For every `memory_index` row where `file_path IS NOT NULL` AND `file_path != ''` AND `fs.existsSync(file_path) == false`, run `delete_memory_from_database(id)` so the cascade triggers clean FTS, vec_memories, lineage, and graph residue too.

**Step 2 — Auto-checkpoint before delete.**
Use `checkpoint_create({ name: 'pre-orphan-cleanup-2026-05-08' })` before the mass delete so it's reversible.

**Step 3 — Long-term fix (out of scope for 054).**
Extend `verify_integrity({ autoClean: true })` to also clean orphaned files, gated by a `cleanFiles: true` option (default off for safety). That's a code-level enhancement, not a one-time data fix.

## Recommendation for this packet

Two viable closeouts:

- **A. Apply mass orphan cleanup now** — write a small Node script that runs `delete_memory_from_database` for each orphan, with `checkpoint_create` first. Estimated 3,315 deletions; touches all tiers.
- **B. Defer mass cleanup, accept partial relief from REQ-003** — the bulk-delete of the deprecated tier already removes ~19/50 of the visible orphans (and likely ~1,200+ of the total 3,315 if the deprecated tier overlaps significantly with the archived packets). Document the remaining gap in `implementation-summary.md` with an explicit follow-on packet for the autoClean enhancement.

**Recommended: B.** REQ-003 already cleans the deprecated subset. The remaining ~2,000 non-deprecated orphans need a code-level fix (autoClean enhancement) rather than another one-time data sweep — and that's a follow-on packet. This keeps 054's scope focused.

## Open question for the user

The user's call between A vs B. Memory feedback `feedback_delete_not_archive_or_comment.md` argues for aggressive deletion in general; the mass cleanup (A) aligns with that posture. But the cleaner architectural move is B + a follow-on autoClean enhancement.
