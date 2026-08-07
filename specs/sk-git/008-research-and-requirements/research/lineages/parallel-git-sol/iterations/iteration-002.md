# Iteration 2: Workspace Isolation and Safe Freshness

## Focus
This iteration compared a shared working tree with one linked worktree or clone per AI session, then classified `fetch`, fast-forward-only updates, `pull --rebase --autostash`, `reset --keep`, and watch-triggered refresh by whether they can preserve concurrent uncommitted work. The narrow interpretation is filesystem and Git-state safety; publication ordering remains delegated to the serialized publisher established in iteration 1.

## Findings
1. One shared working tree cannot isolate concurrent sessions because the working files and index are common mutable state. Linked worktrees provide separate working directories plus per-worktree `HEAD` and index state while sharing the repository's object store and most `refs/*`; each session therefore needs its own linked worktree and its own branch, while a dedicated projection may check out the shared branch. Git normally refuses to check out one branch in multiple worktrees, which is a useful guard rather than a limitation to bypass. [SOURCE: https://git-scm.com/docs/git-worktree]
2. Linked worktrees are the strongest default on one host: they avoid duplicate object storage while keeping session indexes and working files separate. `worktree lock` protects a linked worktree's administrative record from pruning, moving, or deletion; it does not make dirty files durable, so session cleanup still needs an explicit clean/committed checkpoint and must never use forced removal as routine lifecycle management. [SOURCE: https://git-scm.com/docs/git-worktree] [INFERENCE: the documented lock and remove safeguards protect worktree administration, whereas uncommitted content exists only in that worktree's files and index.]
3. Independent clones provide a larger failure boundary because their refs, indexes, configuration, and object databases are separate, but cost more storage and fetch traffic. Local `clone --shared` or `--reference` is not an equivalent safe isolation boundary: it uses alternates, and Git warns that source-side pruning can remove objects still needed by the borrower and corrupt it; a local clone can also race concurrent source mutation. Use ordinary clones when repository-level isolation is required, or `--dissociate` after a reference-assisted clone. [SOURCE: https://git-scm.com/docs/git-clone]
4. `git fetch` is the only examined freshness primitive suitable inside active session worktrees: it downloads objects and updates remote-tracking refs, while Git refuses by default to fetch directly into the current branch. In a linked-worktree repository those remote-tracking refs are shared, but each worktree's `HEAD`, index, and files remain private, so fetch can expose the latest published tip without rebasing or rewriting a session's work. [SOURCE: https://git-scm.com/docs/git-fetch] [SOURCE: https://git-scm.com/docs/git-worktree]
5. The always-current IDE view should be a dedicated, non-authoring projection, refreshed by one serialized watcher/controller using `fetch` followed by `merge --ff-only` (or `pull --ff-only`) after a clean-tree check. `--ff-only` moves the projection branch only when the fetched tip descends from it and otherwise exits non-zero; watch events should coalesce and serialize because refresh commands mutate that projection's branch, index, and files. A failed or dirty projection should be quarantined/recreated rather than repaired by touching session worktrees. [SOURCE: https://git-scm.com/docs/git-fetch] [SOURCE: https://git-scm.com/docs/git-merge] [INFERENCE: a dedicated projection contains refresh mutations to disposable state, while serialized events prevent two refresh processes from racing on one index/worktree.]
6. `pull --rebase --autostash` is unsafe for unattended freshness in a session worktree: rebase rewrites local history, and Git warns that the temporary stash's final application can produce non-trivial conflicts. `reset --keep` is less destructive than `reset --hard`, but it still moves `HEAD`, rewrites the index, updates some working files, and aborts only for documented overlap/unmerged conditions; it is not a no-touch guarantee. Reserve `reset --keep <authoritative-tip>` for explicit recovery of a clean, disposable projection after verifying ancestry, never for active session worktrees. [SOURCE: https://git-scm.com/docs/git-pull] [SOURCE: https://git-scm.com/docs/git-reset]

## Ruled Out
- A single shared working tree for concurrent sessions: it shares the exact files and index whose isolation is required.
- `clone --shared` or long-lived `--reference` alternates as the default isolation boundary: source pruning can corrupt borrowers.
- Watch-triggered rebase, autostash, or reset in active session worktrees: these mutate the session branch, index, or files and can stop on conflicts.

## Dead Ends
- Treating `worktree lock` as protection for uncommitted content. It prevents administrative pruning/move/removal, not filesystem loss or overwrite by an unsafe command.
- Treating `reset --keep` as a general always-current refresh. Its safety checks are overlap-sensitive, and it can still discard local commits by moving the current branch.

## Edge Cases
- Ambiguous input: “always-current IDE checkout” could mean the operator edits in it. This iteration selects a read-only/non-authoring projection; allowing edits would reintroduce dirty-tree freshness conflicts and requires a separate authoring session.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none; official Git documentation covered all requested primitives and the workspace comparison.

## Sources Consulted
- https://git-scm.com/docs/git-worktree
- https://git-scm.com/docs/git-clone
- https://git-scm.com/docs/git-fetch
- https://git-scm.com/docs/git-merge
- https://git-scm.com/docs/git-pull
- https://git-scm.com/docs/git-reset

## Assessment
- New information ratio: 1.00
- Questions addressed: Which workspace model and update protocol keep session work isolated while maintaining an always-current IDE view?; What invariants prevent loss of concurrent uncommitted work during freshness updates?
- Questions answered: Which workspace model and update protocol keep session work isolated while maintaining an always-current IDE view?

## Reflection
- What worked and why: Topic-specific official Git manuals exposed the exact shared/per-worktree state and command abort/conflict semantics needed to draw an operation boundary.
- What did not work and why: The first broad clone-document retrieval did not surface the `--shared` warning within its excerpt; a narrow line-targeted reread recovered the authoritative details.
- What I would do differently: Next iteration should turn these command-level rules into explicit crash/recovery invariants and acceptance tests, including dirty projection, interrupted autostash, stale lock, and orphaned session branch cases.

## Recommended Next Focus
Define failure recovery and rollback around the selected topology: durable session checkpoints, stale/locked worktree cleanup, orphaned autostash detection, publisher crash recovery, rejected-push retry state, and projection rebuild criteria.
