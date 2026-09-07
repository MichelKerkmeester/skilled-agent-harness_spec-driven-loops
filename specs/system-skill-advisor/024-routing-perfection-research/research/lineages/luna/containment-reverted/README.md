# What this directory holds, and who needs to know

The write-containment guard reverted paths this lineage touched outside its own
spec folder. Untracked paths were preserved. **One tracked file was restored from
HEAD, and that discarded another session's work.**

## The damage

`specs/system-speckit/035-spec-kit-simplification-research/001-ripgrep-search-system/research/observability-events.jsonl`

18 `orchestration-status` events from a concurrently running
`deepseek-v4-flash-ripgrep-search` lineage were appended to that file by its own
session, then rolled back to HEAD by this session's guard at 2026-09-07T05:37:51Z.
They were never committed, so they exist nowhere else in the repository.

`RECOVERED-events-for-035-001.jsonl` in this directory is the only surviving copy,
extracted from the patch beside it. The patch is the full record; the extract is
the 18 lines that matter.

## Why nothing was restored automatically

The file belongs to another session's active packet. Appending 18 events back into
a file that session may be reasoning about, without that session knowing, risks a
second surprise on top of the first. The events are preserved here and the owner
decides.

To restore, append `RECOVERED-events-for-035-001.jsonl` to the target file and
confirm the ordering is still sensible against whatever has been written since.

## The lesson worth keeping

Write containment protects the packet boundary, not the other session. It reverts
a tracked file to HEAD without asking whether HEAD is what the other writer wanted,
and it reports this as a successful guard action rather than as data loss. Before
running a fan-out in a shared checkout, record `git status --porcelain` and treat
every dirty path in it as something the guard may silently roll back.
