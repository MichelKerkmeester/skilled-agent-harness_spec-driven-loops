# Upsert sample over current continuity blocks

Read-only run of `readThinContinuityRecord` and `upsertThinContinuityInMarkdown` from the built runtime over every Nth tracked `implementation-summary.md` that carries a `_memory.continuity` block, run on 2026-09-23.

- Summaries tracked: 4209; with a continuity block: 4075; sampled: 60.
- Blocks the strict reader accepts: 3 of 60.
- Frontmatter outside the continuity block changed by the upsert rewrite: 0 files.
- Bodies changed by the upsert rewrite: 0 files.

## Rejections by error code and field

- `MEMORY_007:next_safe_action`: 50
- `MEMORY_016:answered_questions`: 21
- `MEMORY_009:key_files`: 9
- `MEMORY_006:recent_action`: 6
- `MEMORY_015:open_questions`: 3
- `MEMORY_012:session_dedup.session_id`: 3
- `MEMORY_008:blockers`: 1

The resume ladder reads the same strict reader and skips a rejected block entirely, so these packets resume from their spec docs today.
