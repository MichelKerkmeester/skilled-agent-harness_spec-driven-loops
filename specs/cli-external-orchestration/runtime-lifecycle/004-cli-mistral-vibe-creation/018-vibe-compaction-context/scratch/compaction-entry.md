# Compaction entry shape

Source: phase 014 `scratch/facts.md` Q3 and the recorded excerpts under
`../014-vibe-journal-fixture-and-reader/scratch/journal-excerpts/`.

- entry type: a projection `checkpoint` entry with `kind: "compaction"`; the same compaction also appears as a `context_compacted` observation in the `core_input` transition shape.
- id field: the entry id is `checkpoint-compaction-<compaction_id>`, and the action intent and completion action both carry that id.
- journal file: `<transcript_path>/journal/0000000000000001.jsonl`, one JSON record per line, ordered by `sequence`.

## Position

The compaction is written as an `append_entry` with `generationStatus:
"in_progress"` at sequence 5, then a `replace_entry` with
`generationStatus: "completed"` at sequence 8. The completed record carries
`details.trigger: "automatic"`, `details.attempt: 1` and
`details.summaryLength: 679`. The reader's `compactionsSince` dedupes by id and
keeps the last write, so the watermark is the completed record's sequence (8).

## Fixture

`L/fixtures/compaction-journal/` holds the redacted session root: `meta.json`
and `journal/0000000000000001.jsonl`. The journal is the recorded forced
compaction from phase 014, with the prompt lines and summary left as recorded.

## History lookup baseline

Command, from `.skilled/skills/system-spec-kit/runtime`:

```bash
npx vitest run tests/history-locator.vitest.ts tests/history-locator-adapters.vitest.ts tests/history-lookup-cli.vitest.ts
```

Observed: `Test Files  3 passed (3)`, `Tests  95 passed (95)`, no failure
line. Baseline pass count: **95**.
