# Deep-Research Iteration 001

## Focus

Git's publication primitives: non-fast-forward races, compare-and-swap ref updates, scratch-index/`commit-tree` publishing, and linked worktree isolation.

## Actions Taken

1. Read the lineage state and strategy before research.
2. Checked the current Git `push`, `worktree`, `read-tree`, `update-index`, `update-ref`, `commit-tree`, and `rebase` manuals.
3. Compared what each primitive guarantees against the requested “always current, no lost work” contract.

## Findings

- A shared branch requires explicit compare-and-swap publication; blind force-push is unsafe.
- Auto-rebase-and-retry improves liveness for clean patches but cannot eliminate overlapping conflicts or starvation.
- A serialized publisher can hide push races from operators while retaining conditional ref-update correctness.
- A scratch index plus `read-tree`/`commit-tree` can construct commits without touching the IDE checkout, but it does not resolve conflicts automatically.
- Linked worktrees isolate each session's files and index while leaving shared ref coordination to the publisher.

### F1 — A shared branch is a compare-and-swap resource, not a lock-free append log

`git push` updates a remote ref from a local object and normally refuses a target update when the remote tip is not an ancestor of the proposed tip. That refusal is the expected protection against silently discarding another writer's commit, but it is exactly the operator-visible non-fast-forward blocker the target system wants to hide. The safe way to remove the visible retry from the human path is to move the retry into a serialized publisher or queue; disabling the check with `--force` violates the no-loss requirement. [SOURCE: https://git-scm.com/docs/git-push]

The Git manual describes `--force-with-lease=<ref>:<expect>` as an explicit expected-old-value check: the remote ref is replaced only if it still equals the expected object id. That is a usable compare-and-swap primitive for a publisher. The same manual warns that the shorthand lease can be defeated by background fetch updating the remote-tracking ref, so a daemon must retain an explicit observed base rather than treating a moving tracking ref as its lease. [SOURCE: https://git-scm.com/docs/git-push]

### F2 — Auto-rebase-and-retry improves liveness, but it does not eliminate conflicts

An optimistic loop can fetch the latest tip, rebase the candidate, and retry the push after a race. This converts a push rejection into an automated retry when the patch applies cleanly. It cannot guarantee progress when two sessions edit overlapping lines, when a generated file changes every cycle, or when writers arrive faster than the retry loop can rebase. The loop therefore needs bounded retries, a durable pending patch/commit queue, and a conflict state that is visible to automation even if it is hidden from the IDE status bar. This is an inference from Git's fast-forward rule and rebase's documented conflict/abort behavior, not a Git guarantee. [SOURCE: https://git-scm.com/docs/git-push] [SOURCE: https://git-scm.com/docs/git-rebase]

### F3 — A serialized publisher can provide a clean publication invariant

A single writer can dequeue one session contribution, observe the current branch tip, construct a candidate commit with that tip as parent, and publish it with an explicit old-tip check. If the check fails, the publisher rereads the ref and reconstructs the candidate; no operator sees a non-fast-forward rejection because the only actor talking to the shared branch is the publisher. `git push --atomic` is available when a transaction must update multiple refs, but it does not replace the single-branch compare-and-swap discipline. [SOURCE: https://git-scm.com/docs/git-push]

The local `git update-ref` plumbing command makes the same pattern concrete for local refs: an `update` can verify an old object id, and a transaction prepares locks for all queued ref updates before committing. It is evidence that ref-level conditional publication is a first-class Git primitive, not an application-level guess. [SOURCE: https://git-scm.com/docs/git-update-ref]

### F4 — A scratch index plus `read-tree`/`write-tree`/`commit-tree` can publish without touching the IDE worktree

`git read-tree <tree>` reads a tree into the index but does not update cached working-tree files. Its `-i` mode is specifically intended for merges into a temporary index when the current working-tree status should not be the gate. A publisher can therefore set `GIT_INDEX_FILE` to a private scratch index, load the current branch tree, apply a session's path/object entries, write a new tree, and create a commit with `git commit-tree`; `commit-tree` emits a commit object from a tree and explicit parent(s). [SOURCE: https://git-scm.com/docs/git-read-tree] [SOURCE: https://git-scm.com/docs/git-commit-tree] [SOURCE: https://git-scm.com/docs/git-update-index]

This design is the strongest fit for “do not disturb an IDE checkout”: the publisher mutates object storage and its own temporary index, not the checkout's index or files. It is not magic conflict resolution. If the session contribution and the current branch both changed the same path incompatibly, the scratch-index merge must stop or apply a declared policy; otherwise the publisher would overwrite one contribution while still producing a valid commit. [SOURCE: https://git-scm.com/docs/git-read-tree]

### F5 — Linked worktrees isolate indexes and working files while retaining shared refs

Git linked worktrees share a repository's object database and most refs, but each worktree has its own `HEAD`, index, and working files. Git also prevents checking out the same branch in another worktree by default. This makes one isolated worktree or clone per AI session the safe default for session-local edits; a shared working tree is a separate coordination problem because every session operates on the same files and index. [SOURCE: https://git-scm.com/docs/git-worktree]

The trade-off is that worktrees do not make a single shared branch magically multi-writer-safe: refs are shared, so a publisher still needs serialization or conditional updates. Worktrees solve file/index ownership; they do not solve remote ref races. [SOURCE: https://git-scm.com/docs/git-worktree] [SOURCE: https://git-scm.com/docs/git-push]

## Questions Answered

- RQ1: Partially answered. A serialized publisher using explicit ref compare-and-swap is the cleanest correctness boundary; rebase-and-retry is a useful inner strategy for clean patches but cannot guarantee conflict-free progress.
- RQ2: Partially answered. Per-session linked worktrees or clones isolate uncommitted files and indexes; a shared worktree cannot provide that isolation.
- RQ3: Seeded. Ref publication can avoid touching the IDE worktree; safe checkout refresh needs a separate watcher/fast-forward policy and is the next focus.
- RQ4: Seeded. Never use blind `--force`; retain explicit expected old tips and private scratch indexes.

## Questions Remaining

- How should an IDE-facing checkout consume new commits without overwriting dirty files?
- What exact autostash, fetch, fast-forward-only, and rollback invariants are enforceable?
- Which queue/daemon/remote-side systems already implement these boundaries?

## Ruled-Out Directions

- Blind `git push --force` as the default integration mechanism: Git documents that it can lose remote commits. [SOURCE: https://git-scm.com/docs/git-push]
- A scratch index as a complete conflict solver: it isolates the worktree but still requires an explicit policy for overlapping path changes. [SOURCE: https://git-scm.com/docs/git-read-tree]

## Recommended Next Focus

Iteration 2: safe current-checkout refresh, autostash failure modes, file watchers, fast-forward-only updates, and rollback evidence.

## Confidence

High for the documented Git primitive behavior; medium for the architecture inference that a serialized scratch-index publisher is the best default because queue liveness and patch conflict policy remain to be validated against existing systems.

## Sources Consulted

- https://git-scm.com/docs/git-push
- https://git-scm.com/docs/git-rebase
- https://git-scm.com/docs/git-read-tree
- https://git-scm.com/docs/git-update-index
- https://git-scm.com/docs/git-update-ref
- https://git-scm.com/docs/git-commit-tree
- https://git-scm.com/docs/git-worktree
