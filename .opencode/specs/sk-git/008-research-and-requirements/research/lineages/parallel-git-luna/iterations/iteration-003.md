# Deep-Research Iteration 003

## Focus

Automation surfaces and existing art: local hooks, launch wrappers, background daemons, remote merge queues, and the named Git synchronization/collaboration tools.

## Actions Taken

1. Read the lineage state and strategy before selecting the next focus.
2. Checked official/project-owned documentation for Git hooks, GitHub merge queues, Gerrit submit requirements, Git Town, mob, Syncthing, `git-sync`, and `git-auto-sync`.
3. Compared each system's ownership boundary, conflict behavior, and recovery story against the shared-branch no-loss contract.

## Findings

- Git hooks are useful synchronous guardrails, but local hooks are not a shared serialization service and can be bypassed.
- A launch wrapper is the right place to allocate a session worktree and register it with a publisher, but it cannot serialize writers by itself.
- A background daemon is the best local lifecycle surface for fetch, queueing, retries, status, and recovery when it owns a clean publisher worktree or scratch index.
- GitHub merge queues serialize pull-request integration and validate the queued result, but they are not a live dirty-worktree synchronizer.
- Gerrit's pending-change and submit-requirement model gives a strong remote integration boundary, but it introduces review/submit state rather than direct continuous branch appends.
- Git Town, mob, `git-sync`, and `git-auto-sync` demonstrate useful wrappers and recovery patterns, but each assumes a bounded workflow or stops on conflicts rather than guaranteeing concurrent lossless publication.
- Syncthing-style mirroring replicates file content and creates conflict handling at the file layer; it is not a Git ref publication protocol.

### F1 — Hooks are guardrails, not the multi-writer coordinator

The Git hooks contract exposes local `pre-push` validation and server-side `pre-receive`/`update` rejection points. A `pre-push` hook can inspect the proposed remote object id and refuse a push, but it runs in the initiating repository and does not provide a durable shared queue. Server-side hooks can reject or accept a receive operation, yet a hook alone still has to implement queue persistence, retry, conflict staging, and operator-visible status if it is to behave like a publisher. [SOURCE: https://git-scm.com/docs/githooks]

Hooks therefore belong at the edges: reject force pushes, require provenance metadata, or notify the daemon after a local commit. The correctness-critical serialization should live in a process or service with one durable queue and an explicit ref compare-and-swap, not in per-session client hooks.

### F2 — A launch wrapper solves session lifecycle and workspace allocation, not shared publication

The named requirement needs each session to start in an isolated worktree/clone and to register a stable session id, input commit, path scope, and recovery directory. A launch wrapper is the natural place to perform that allocation, set `GIT_DIR`/`GIT_WORK_TREE` or worktree paths, and start the local agent. It cannot by itself coordinate later writers: two wrappers can still race on the same remote ref unless both submit to one queue or use conditional publication.

This is an architecture inference from the Git worktree and push primitives. The wrapper is a valuable control plane, but it should hand off publication to a shared daemon or remote queue and never let every session run an independent blind push loop.

### F3 — A background daemon is the right local surface for continuous local behavior

The `git-auto-sync` project documents both manual and daemon modes. Its sync command commits, pulls with rebase, and pushes; its daemon watches repositories, polls periodically, and aborts/stops syncing with a notification on rebase conflict. It also documents a fork changing the pull command to `git pull --rebase --autostash`. This proves that a local daemon can own filesystem observation and user notification, but it also makes the missing guarantees explicit: a single dirty checkout, rebase conflict as a stop state, and no shared multi-writer queue. [SOURCE: https://pkg.go.dev/github.com/findingjimoh/git-auto-sync]

The recommended daemon should keep the watcher responsibilities while changing the ownership boundary: session worktrees emit immutable commit/patch submissions; the daemon publishes from a clean integration worktree or scratch index, stores pending submissions durably, retries conditional pushes, and keeps conflicts in a named queue. Its status API should report accepted, published, conflicted, retrying, and recoverable states instead of converting them into a misleading clean/dirty indicator.

### F4 — GitHub merge queue is the strongest existing remote-side analogue, with a different latency contract

GitHub's merge queue forms temporary merge-group branches from the latest target branch and the pull requests ahead in FIFO order, waits for required CI, and merges the group when checks pass. If checks fail or the group conflicts, the affected pull request is removed or the group is rebuilt. This is a real serialization and validation boundary, stronger than client-side push retries. [SOURCE: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue]

It does not solve the local requirements by itself. Contributions must be represented as pull requests, CI introduces queue latency, conflicts are a removal/rebuild outcome, and an IDE's uncommitted files remain outside the queue. It is a good remote integration backend if the local daemon submits short-lived branches or PRs, but a poor direct implementation of “every AI session continuously appends commits to v4.”

### F5 — Gerrit provides pending changes, submit requirements, and configurable integration semantics

Gerrit separates uploaded changes from the authoritative branch and evaluates submit requirements whenever a change is updated. Its submit requirements expose explicit `SATISFIED`, `UNSATISFIED`, `OVERRIDDEN`, and error states through the API, while the project configuration chooses how a change is submitted and whether concurrent content merges are attempted. This supplies strong remote observability and policy enforcement, but the unit of work is a reviewed pending change, not a transparent local working-tree mutation. [SOURCE: https://gerrit-review.googlesource.com/Documentation/intro-how-gerrit-works.html] [SOURCE: https://gerrit-review.googlesource.com/Documentation/config-submit-requirements.html] [SOURCE: https://gerrit-review.googlesource.com/Documentation/intro-project-owner.html]

Gerrit is therefore a viable replacement for a custom remote queue when review and server-side policy are acceptable. It still requires isolated local workspaces and an explicit client/daemon adapter; it does not make arbitrary overlapping edits conflict-free.

### F6 — Git Town packages stash, sync, and undo into a useful local workflow, not a shared branch multiplexer

Git Town documents a `sync` command that can pull and push according to branch configuration, safely stash and restore uncommitted changes, and undo the sync back to the exact prior repository state. It also provides explicit `continue`, `skip`, and `undo` paths when conflicts occur. That is a useful recovery UX and evidence that rollback can be made a first-class operation. Its model remains branch-oriented and command-invoked; it does not provide a central queue that accepts many concurrent writers to one branch. [SOURCE: https://www.git-town.com/commands/sync]

### F7 — `git-sync` and `git-auto-sync` are instructive precisely where they stop

The `simonthum/git-sync` script auto-commits, fetches, fast-forwards or rebases, pushes, and asserts sync state, but explicitly says it exits with an error when non-trivial intervention is needed and gives no blanket guarantee. Its filesystem watcher variants may miss changes until the next poll, and one documented watcher does not poll upstream except at startup. [SOURCE: https://github.com/simonthum/git-sync]

The `wei/git-sync` GitHub Action is a different tool: it synchronizes independent repositories with force push and tells users to make a full mirror backup first. That is a valid mirroring use case, but it is directly incompatible with a no-force-push/no-loss shared branch default. [SOURCE: https://github.com/wei/git-sync]

Together with `git-auto-sync`, these tools show the common trade-off: wrappers can remove repetitive operator steps, but a single checkout plus automatic rebase/push still turns overlap into a stop/error state. The missing ingredient is a durable multi-submission integration boundary, not another retry flag.

### F8 — mob and Syncthing solve adjacent collaboration problems

mob uses temporary WIP branches and commands such as `start`, `next`, and `done` to hand over one active coding session. It keeps the base branch clean and moves changes through a dedicated WIP branch, which is a good isolation pattern, but it coordinates handover rather than concurrent independent writers. [SOURCE: https://mob.sh/]

Syncthing continuously replicates file contents across devices and documents a conflict procedure when peers modify the same file; it is a file replication layer, not a Git commit/ref queue. It can inform a design for conflict copies and offline recovery, but syncing a Git working tree does not establish commit parentage, fast-forward publication, or branch rollback semantics. [SOURCE: https://docs.syncthing.net/users/faq.html] [SOURCE: https://github.com/syncthing/syncthing]

## Questions Answered

- RQ5: Answered. Use a launch wrapper for isolated-worktree lifecycle, a background daemon for local observation/queue/retry/status, and hooks only as guardrails; use a remote merge/submit queue when central CI or review is required.
- RQ7: Partially answered. GitHub merge queue and Gerrit provide the strongest existing remote integration analogues; Git Town provides the clearest local undo UX; mob provides WIP isolation; `git-sync`/`git-auto-sync` show the limits of single-checkout automation; Syncthing is adjacent file mirroring.

## Questions Remaining

- Which conflict-avoidance policies make concurrent additive work tractable?
- Which integration strategy should be the default when low latency matters more than CI-gated queueing?
- Which safety and rollback invariants must be made acceptance tests rather than documentation claims?
- What exact architecture best combines ref-level publishing with the IDE current-view worktree?

## Ruled Out Directions

- Client hooks as the sole serializer: hooks can reject or notify, but do not supply a durable shared queue or retry ownership. [SOURCE: https://git-scm.com/docs/githooks]
- `wei/git-sync`-style force-push mirroring as the shared-branch default: its own documentation requires a mirror backup and explicitly uses force push. [SOURCE: https://github.com/wei/git-sync]
- Syncthing-style file mirroring as Git branch integration: it replicates file contents and handles file conflicts, not Git ref parentage or fast-forward publication. [SOURCE: https://docs.syncthing.net/users/faq.html]

## Negative Knowledge

No named existing tool simultaneously provides all requested guarantees. The closest remote systems serialize reviewed changes but do not preserve dirty local edits; the closest local tools preserve or stash one checkout but stop on conflicts; file mirroring avoids Git push races by leaving Git's ref semantics outside the protocol.

## Recommended Next Focus

Iteration 4: conflict avoidance and integration policy—path partitioning, per-session subtrees, additive-only commits, merge/rebase behavior, and explicit acceptance tests for loss and rollback.

## Confidence

High for the documented behavior of the named tools and Git hooks. Medium-high for the surface recommendation: a daemon plus clean publisher is the best fit for low-latency local continuous integration, while GitHub merge queue/Gerrit are stronger when CI/review latency is acceptable.

## Sources Consulted

- https://git-scm.com/docs/githooks
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue
- https://gerrit-review.googlesource.com/Documentation/intro-how-gerrit-works.html
- https://gerrit-review.googlesource.com/Documentation/config-submit-requirements.html
- https://gerrit-review.googlesource.com/Documentation/intro-project-owner.html
- https://www.git-town.com/commands/sync
- https://pkg.go.dev/github.com/findingjimoh/git-auto-sync
- https://github.com/simonthum/git-sync
- https://github.com/wei/git-sync
- https://mob.sh/
- https://docs.syncthing.net/users/faq.html
- https://github.com/syncthing/syncthing
