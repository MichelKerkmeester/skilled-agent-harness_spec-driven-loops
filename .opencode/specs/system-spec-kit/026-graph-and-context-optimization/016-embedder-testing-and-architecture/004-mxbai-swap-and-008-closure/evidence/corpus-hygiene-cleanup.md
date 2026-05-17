# Corpus Hygiene Cleanup

## Phase A Summary

Active DB:

`.opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite`

The pre-cleanup liveness scan found `5446` orphaned `memory_index` rows out of `12937` total rows. Every orphan had a `file_path` that no longer existed on disk.

Because this was large and risky, direct no-checkpoint SQL deletion was not used. `checkpoint_create` was attempted first with checkpoint name `cat24-orphan-prune-pre-surgery-2026-05-17`, but the MCP checkpoint failed before persisting with `Invalid string length`. I then used the conservative fallback:

- forced a WAL checkpoint: `PRAGMA wal_checkpoint(TRUNCATE)` returned `0|0|0`
- created manual DB backup checkpoint `cat24-orphan-prune-pre-surgery-2026-05-17`
- backup path: `/tmp/cat24-orphan-prune-pre-surgery-2026-05-17/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite`
- backup SHA-256: `7a82138526398e39c73fd8e25b4fdf375b03b396bb8788aa0b4ab6257cd5132d`

Deletion used `delete_memory_from_database()` from `mcp_server/lib/search/vector-index-mutations.ts`, not raw `DELETE FROM memory_index`, so the vector row, FTS row, ancillary memory rows, embedding cache, and search caches followed the normal memory-delete cleanup path.

## Before / After

| Metric | Before | After |
|---|---:|---:|
| `memory_index` rows | 12937 | 7491 |
| embedded rows | 12937 | 7491 |
| orphaned `file_path` rows | 5446 | 0 |
| rows pruned | 5446 | n/a |
| delete failures | 0 | 0 |

## Remap Verification Notes

The stale audit remaps were rechecked against the post-prune corpus:

| Stale ID | Audit remap | Current result |
|---:|---|---|
| 4437 | 5143 | `5143` was also orphaned; current live successor is `7007` at `014-local-embeddings-migration/041-v-rule-cross-spec-overreach/checklist.md` |
| 4400 | 8048 | `8048` exists, has `embedding_status = success`, and its file exists |
| 1534 | 7636 / 7639 / 4356 | `7636` and `7639` exist, have `embedding_status = success`, and their files exist; `4356` was orphaned and pruned |

## Fixture Repair Direction

cat-24/409 now uses deterministic fixture file:

`.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/409-fixture.json`

The fixture has 10 live IDs, all with `embedding_status = success`, existing source files, and content length above 500 characters. Difficulty distribution:

- easy: 3
- medium: 4
- hard: 3

Domain coverage includes:

- cat-13 area: fixture row 10 references the 016/004 pass-sample tasking that included cat-13 preservation sampling.
- cat-14 area: fixture row 9 references the 008 stress-test task list tracking cat-14 pipeline gaps.
- cat-16 area: fixture row 9 also references cat-16 tooling fixes and follow-ons.

## Post-Surgery Rerun Summary

After the prune and fixture repair, `nomic-embed-text-v1.5` was reactivated through job `emb-swap-2026-05-17T11-22-01-939Z-210a8d4a`, which completed `7491/7491` rows. The active vector metadata reports:

```text
active_embedder_name = nomic-embed-text-v1.5
active_embedder_dim  = 768
```

cat-24/409 improved from the stale-fixture Nomic result of `5/10` top-3 to `6/10` top-3 against `409-fixture.json`. This is a PARTIAL scenario band but still below the `8/10` closure gate, so packet 008 cannot be marked closed.

Post-surgery cat-24 rerun rows were appended to `evidence/cat-24-rerun.jsonl` with `fixture_version: "post-surgery"`:

| Scenario | Post-surgery result | Notes |
|---|---:|---|
| 402 | FAIL | Memory pairs now use live targets, but top-5 Jaccard remained `11.11%`, `11.11%`; CocoIndex pairs remained `0%`, `0%` |
| 408 | FAIL | Only the factory/cascade constituent appeared via mirrored implementation paths; `1/4` top-3 and `1/4` top-5 |
| 409 | FAIL gate / PARTIAL band | `6/10` top-3; required `8/10` |
