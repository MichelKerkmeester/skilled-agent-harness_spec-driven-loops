# Containment record — commit 2140e8740d

Phase 006's commit contains 155 files that were not part of this phase. This records what happened,
why it is harmless, and why repairing it would cost more than leaving it.

## What happened

`git add <paths>` stages the named paths. `git commit` then commits **the entire index**, not only
what the caller staged. A concurrent session had its own files staged when phase 006 committed, so
they rode along.

The per-phase containment check that ran before every commit inspects `git status --porcelain`, which
reports the **working tree**. It was structurally blind to index contents that were already staged by
someone else. That is the defect: the check verified the wrong surface.

## What was captured

155 files, every one a 100%-similarity rename from the concurrent session's benchmark reorganization
(`benchmark/<run>` moving to `benchmark/reports/<run>`).

| Measure | Value |
|---------|-------|
| Renames | 155 |
| Deletions | 0 |
| Content modifications | 0 |
| Files with any line change | 0 |

## Why it is harmless

The concurrent session's own commit `bab4b988e6` carries 565 files including 321 renames — the
remainder of the same operation, plus its content edits. Their reorganization completed intact. Every
renamed file exists at its new path and all 14 `reports/` directories are present.

No content was lost, altered, or made unreachable. The only damage is attributional: 155 of roughly
476 renames are recorded under a phase-006 commit message instead of the benchmark refactor that owns
them.

## Operator ruling: accepted as-is (2026-07-27)

The operator reviewed the evidence and ruled that the commit stands. This is a closed decision, not
an outstanding defect. The reasoning below is retained because it is the basis of that ruling.

One fact strengthened the case after the ruling was framed: the 155 renames captured here and the 321
in the concurrent session's own commit share **zero directories**. They are disjoint halves of one
migration touching different subtrees, not an entangled set. A repair would therefore have been
structurally clean — the reason to decline was never conflict risk, only the cost of rewriting six
commits on a branch with a live writer to correct an attribution that costs nothing.

## Why repair was declined

Repair means rewriting `2140e8740d`. By the time the breach was diagnosed, history had become
interleaved:

```
2140e8740d  phase 006          (mine, breached)
bab4b988e6  benchmark refactor (theirs)
f5da80e1b5  benchmark docs     (theirs)
1039aa5d82  phase 007          (mine)
649b51bc16  phase 008          (mine)
e819b38bc2  phase 009          (mine)
763f7f6e6f  benchmark paths    (theirs)
```

Rewriting the breached commit requires rebasing six commits, three of which belong to a session that
committed within the last thirty minutes and is still active. The repair risks destroying live work
to fix an attribution error that costs nothing.

Nothing has been pushed, so the history is still local and a rewrite remains technically possible.
The operator has ruled against it: the attribution error costs nothing, and the rewrite would risk a
live session's work to fix bookkeeping.

## The forward fix, already applied

Phases 007, 008 and 009 committed with `git commit --only <paths>`, which commits exactly the named
paths regardless of index state. All three are verifiably clean:

| Commit | Files | Renames |
|--------|-------|---------|
| `1039aa5d82` | 8 | 0 |
| `649b51bc16` | 3 | 0 |
| `e819b38bc2` | 2 | 0 |

Phases 002 through 005 were audited after the fact and are also clean — every file in each commit is
accounted for. Phase 006 is the only breach, because it is the only phase during which the concurrent
session happened to have a large set staged.

## Lesson

A containment check must inspect the same surface the operation will act on. Checking the working
tree before an operation that commits the index is not a weaker check; it is a check of something
else entirely. Use `git commit --only` whenever a repository is shared with another writer.
