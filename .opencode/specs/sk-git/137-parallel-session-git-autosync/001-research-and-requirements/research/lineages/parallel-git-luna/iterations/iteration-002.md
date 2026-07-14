# Deep-Research Iteration 002

## Focus

Safe freshness for the IDE-facing checkout: fetch-only watchers, fast-forward-only updates, autostash behavior, preservation of dirty files, and rollback.

## Actions Taken

1. Read the lineage state and strategy before selecting the next focus.
2. Checked the current Git `fetch`, `pull`, `merge`, `reset`, `rebase`, `stash`, and `reflog` manuals.
3. Distinguished ref freshness from working-tree freshness and tested each candidate against the no-loss requirement.

## Findings

- Fetch-only watchers refresh remote-tracking refs without rewriting the IDE worktree.
- Fast-forward-only refresh is conservative and data-preserving, but it intentionally refuses divergent histories.
- `pull --rebase --autostash` is a convenience mechanism; autostash reapplication can conflict and leave recovery state.
- `reset --keep` refuses overlapping updates while `reset --hard` can overwrite tracked edits and remove obstructing untracked files.
- Always-current files and lossless arbitrary dirty edits require separate checkout ownership or an explicit freshness/status distinction.
- Rollback needs persisted old state, identifiable recovery material, and post-operation tree verification.

### F1 — Fetch is the safe freshness primitive because it does not rewrite the checkout

`git fetch` downloads objects and updates remote-tracking references; it does not merge, rebase, or update the working-tree files. A watcher can therefore fetch the shared branch repeatedly without touching the IDE's `HEAD`, index, or files. `--atomic` makes the local remote-tracking ref update transactional when a fetch updates multiple refs. This provides current knowledge of the remote tip, not an automatically current set of checked-out files. [SOURCE: https://git-scm.com/docs/git-fetch]

The safe daemon boundary is consequently “fetch and report,” followed by an explicit publication/checkout decision. A fetch loop can remove the operator-visible stale-ref mystery, but it cannot promise that a dirty editor view has already incorporated every new commit. That distinction should be visible in status telemetry rather than disguised as a clean checkout.

### F2 — Fast-forward-only refresh is conservative, but it intentionally fails on divergence

`git pull --ff-only` and `git merge --ff-only` refuse to create a merge commit or otherwise reconcile divergent histories. They succeed when the local branch can advance by fast-forward and fail when local commits or another history shape require integration. That is the correct data-preserving behavior, but it does not satisfy “zero blockers” if the IDE checkout itself is the place where all session commits accumulate. [SOURCE: https://git-scm.com/docs/git-pull] [SOURCE: https://git-scm.com/docs/git-merge]

In the recommended architecture, fast-forward-only updates belong on a clean, disposable current-view worktree or on a ref/publisher checkout, not on an arbitrary session worktree containing private edits. The failure is then an automation event with a retry or conflict-queue path, rather than a human-facing “N commits behind” interruption.

### F3 — `pull --rebase --autostash` is a convenience mechanism, not a no-loss invariant

`git pull --rebase --autostash` can create a temporary stash before rebasing and attempt to apply it after the rebase. Git documents that the final stash application can produce conflicts; `git rebase --quit` also leaves an autostash in the stash list instead of removing it. Rebase itself can stop on conflicts and offers `--abort`, `--continue`, and `--quit`, but those outcomes are state transitions an automated system must record and reconcile. [SOURCE: https://git-scm.com/docs/git-pull] [SOURCE: https://git-scm.com/docs/git-rebase]

Therefore an automation loop cannot claim “no loss” merely because it passed `--autostash`. It must record the pre-operation `HEAD`, index/worktree status, stash object identity, and post-operation tree; verify that the original patch is present after application; retain the stash or a patch/bundle until that verification succeeds; and surface a durable recovery record if application conflicts. The required guarantee comes from the surrounding transaction protocol, not from the flag alone. This is an architecture inference grounded in the documented behavior.

### F4 — `reset --keep` protects overlapping local changes by refusing, while `reset --hard` violates the contract

`git reset --keep` updates the target state while preserving local modifications when possible, but aborts if a local change would be overwritten. That makes it a useful guarded operation for a disposable or explicitly managed checkout, not a mechanism that can always advance a dirty IDE. `git reset --hard` replaces tracked working-tree files and can remove untracked files or directories that obstruct the target, so it is incompatible with a blanket no-loss guarantee. [SOURCE: https://git-scm.com/docs/git-reset]

The negative result is decisive: no working-tree update command can both apply an arbitrary new tree and preserve arbitrary uncommitted edits on the same paths without performing a merge/rebase or declining the update. A system that promises both properties must move the current-view update to a clean worktree, or leave the dirty worktree untouched and expose freshness through refs/status.

### F5 — The always-current IDE view and lossless arbitrary uncommitted work require separate ownership

The “always-current local checkout” requirement is ambiguous unless checkout means refs or files. If it means files, a single worktree cannot be advanced to arbitrary incoming trees while preserving uncommitted edits that overlap those incoming paths; Git's guarded commands either integrate, refuse, or overwrite. If it means the local repository's knowledge of the shared branch, a fetch-only watcher satisfies it without disturbing files. This is an impossibility boundary inferred from the documented `fetch`, `pull`, `merge`, and `reset` semantics. [SOURCE: https://git-scm.com/docs/git-fetch] [SOURCE: https://git-scm.com/docs/git-merge] [SOURCE: https://git-scm.com/docs/git-reset]

The practical default is two-tiered: each AI session gets an isolated worktree for uncommitted work, while the IDE opens a clean current-view worktree that advances by fast-forward-only operations. If the IDE must remain the session's dirty worktree, the daemon must fetch only and never rewrite its files; “current” then means current remote-tracking state plus an explicit behind/ahead indicator, not silently updated source files.

### F6 — Rollback must be explicit and observable, not inferred from a successful command exit

Git exposes recovery points through `ORIG_HEAD`, branch reflogs, rebase abort, and preserved stash entries, but the rebase manual warns that `ORIG_HEAD` can be changed by later commands and that the previous tip is reliably reachable through the branch reflog. A robust sync operation should therefore persist the exact old commit id and the stash/patch id before mutation, use a private operation lock, and verify the final tree before deleting recovery material. [SOURCE: https://git-scm.com/docs/git-rebase] [SOURCE: https://git-scm.com/docs/git-reflog] [SOURCE: https://git-scm.com/docs/git-stash]

The minimum rollback record is `(operation_id, old_HEAD, old_index/worktree patch identity, target_HEAD, result, recovery_reference)`. A failed refresh must leave either the original checkout untouched or a named, recoverable stash/patch. “Command returned zero” is not sufficient evidence that the user's dirty state survived.

## Questions Answered

- RQ3: Answered with a qualification. Use a fetch-only watcher for non-disturbing freshness; use a clean current-view worktree for always-current files. Do not auto-rebase a shared dirty IDE checkout as the lossless default.
- RQ4: Partially answered. The invariants are explicit old-state capture, private and identifiable autostash/patch records, post-apply verification, reflog/patch retention until verification, and no destructive reset. Queue and daemon implementations still need comparison.

## Questions Remaining

- Which queue/daemon/remote-side systems already serialize publication and provide these recovery boundaries?
- Which automation surface gives the best observability and lifecycle behavior for session launch, retry, conflict, and rollback?
- Which conflict-avoidance policies make additive concurrent work tractable?
- What existing tools demonstrate, and what guarantees do they explicitly not provide?

## Ruled-Out Directions

- Blind `git pull --rebase --autostash` in the shared dirty IDE worktree as a no-loss guarantee: autostash reapplication can conflict and can remain behind after `--quit`. [SOURCE: https://git-scm.com/docs/git-pull] [SOURCE: https://git-scm.com/docs/git-rebase]
- Blind `git reset --hard` for freshness: it can overwrite tracked edits and remove obstructing untracked files. [SOURCE: https://git-scm.com/docs/git-reset]
- Treating fast-forward-only failure as an integration solution: it preserves history but only works when no reconciliation is needed. [SOURCE: https://git-scm.com/docs/git-merge]

## Negative Knowledge

No single Git command provides all three properties simultaneously: an arbitrary dirty worktree remains lossless, its files immediately become the latest shared branch, and overlapping changes require no conflict decision. A fetch-only watcher, guarded update, or autostash loop can each preserve a subset; the architecture must separate ownership or expose a conflict state.

## Recommended Next Focus

Iteration 3: integration and automation surfaces—serialized publisher/daemon, optimistic rebase-and-retry, merge queues, remote-side bots, hooks, launch wrappers, and existing art.

## Confidence

High for the documented command semantics. Medium-high for the separation-of-workspaces recommendation; it follows directly from the no-overwrite constraint, but the best operational surface and conflict policy remain to be compared against existing systems.

## Sources Consulted

- https://git-scm.com/docs/git-fetch
- https://git-scm.com/docs/git-pull
- https://git-scm.com/docs/git-merge
- https://git-scm.com/docs/git-reset
- https://git-scm.com/docs/git-rebase
- https://git-scm.com/docs/git-stash
- https://git-scm.com/docs/git-reflog
