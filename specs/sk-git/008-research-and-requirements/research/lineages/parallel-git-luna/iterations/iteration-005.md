# Deep-Research Iteration 005

## Focus

Adversarial architecture review and acceptance matrix for the five candidate integration families: optimistic retry, serialized local publisher, remote merge/submit queue, and hybrid.

## Actions Taken

1. Read the lineage state and strategy before the final evidence pass.
2. Rechecked Git's conditional ref update, push safety, worktree, merge-tree, fsck, and bundle semantics.
3. Audited crash windows, ambiguous network acknowledgments, object reachability, rollback, freshness, and the exact limits of the no-loss claim.

## Findings

- The recommended low-latency default is isolated session worktrees plus one serialized publisher daemon using merge-tree/scratch-index construction and explicit old-tip CAS publication.
- Optimistic rebase-and-retry is a useful fast path inside that publisher, but independent session push loops cannot provide queue fairness, durable retry ownership, or zero visible push failures.
- A remote merge queue or Gerrit is stronger when CI/review is the governing constraint; a hybrid can submit the daemon's immutable contributions to that queue while keeping local IDE freshness separate.
- Pending submissions need durable reachability and idempotent operation records across crashes and ambiguous push acknowledgments; object creation alone is not durable publication.
- The strongest honest contract is lossless for saved files and commits in isolated worktrees, no force/non-fast-forward errors on the session path, and explicit durable conflict states; arbitrary semantic overlap and unsaved editor buffers remain outside the guarantee.
- Acceptance must test publication, conflict, crash, rollback, freshness, ownership, and observability separately rather than treating a successful `git push` as proof of end-to-end safety.

### F1 — Recommended default: local serialized publisher with isolated session worktrees

Each AI session should receive its own linked worktree or clone, with a stable session id and an optional path-ownership manifest. The launch wrapper starts the session there and submits a saved commit or immutable patch record to one publisher daemon. The daemon owns the shared `v4` publication queue, fetches current refs, runs `git merge-tree --write-tree` or an equivalent scratch-index construction, creates a commit with `git commit-tree`, and publishes with an explicit expected old tip. A CAS race causes the daemon to retry against the newly observed tip; it never asks the session to force-push. [SOURCE: https://git-scm.com/docs/git-worktree] [SOURCE: https://git-scm.com/docs/git-merge-tree] [SOURCE: https://git-scm.com/docs/git-commit-tree] [SOURCE: https://git-scm.com/docs/git-update-ref] [SOURCE: https://git-scm.com/docs/git-push]

The IDE should open a separate clean current-view worktree for `v4`. A watcher fetches the branch without touching the dirty AI worktrees; after a successful publication it fast-forwards the clean view. If the user insists on using one dirty worktree as the IDE view, the daemon must fetch only and report freshness; it cannot also guarantee silently updated files and arbitrary overlapping edits without an integration decision.

### F2 — Strategy comparison: serialized publication wins low-latency correctness, while retry is an implementation detail

| Strategy | Correctness | Liveness | Operator surface | Best use |
|---|---|---|---|---|
| Independent auto-rebase-and-retry push loops | Preserves fast-forward safety if force is forbidden; races remain client-visible | Good for clean, finite, disjoint patches; weak under conflict storms and starvation | Repeated rejection/rebase states leak to sessions | Small controlled workflows or as a publisher fast path |
| One serialized push multiplexer/daemon | One queue owns CAS, retries, conflict records, and fairness | Strongest local liveness if queue and recovery storage are durable | Sessions see accepted/queued/published/conflict statuses, not non-FF pushes | Recommended low-latency default |
| GitHub merge queue/Gerrit submit queue | Strong remote ordering, policy, and tested integration | CI/review latency and removal/rebuild states | Excellent remote status; not a dirty checkout sync | Review- or CI-governed repositories |
| Scratch-index/ref-level publisher without a working-tree touch | Excellent checkout isolation; merge semantics still need policy | High for disjoint changes; overlaps become durable conflicts | Requires daemon status and conflict tooling | Core publication engine, usually behind a queue |

This comparison is an architecture judgment grounded in the Git safety rules: branch updates are fast-forward constrained, conditional ref updates are available, and clean merges can be computed without a worktree. The daemon is the missing ownership boundary that converts those primitives into a continuous service. [SOURCE: https://git-scm.com/docs/git-push] [SOURCE: https://git-scm.com/docs/git-update-ref] [SOURCE: https://git-scm.com/docs/git-merge-tree]

### F3 — Crash safety requires a durable queue record and a reachability anchor

`git merge-tree` and `git commit-tree` can create objects before the final ref update. If the process dies before publication, those objects may be dangling; `git fsck` explicitly distinguishes unreachable/dangling objects and can report or recover them, but that is not a queue protocol. The daemon should write the immutable submission metadata first, create a private pending ref such as `refs/autosync/pending/<submission-id>` or retain a verified bundle, and remove that anchor only after the shared branch and submission record agree. [SOURCE: https://git-scm.com/docs/git-fsck] [SOURCE: https://git-scm.com/docs/git-merge-tree]

`git bundle` is useful for commit/object backup and replay, but Git documents that it includes refs and reachable commits, not the working tree, index, stash, hooks, or repository configuration. It therefore backs up committed submission state, not arbitrary uncommitted files; those files need their isolated worktree plus a patch/snapshot record if the daemon is responsible for extra protection. [SOURCE: https://git-scm.com/docs/git-bundle]

### F4 — Ambiguous push acknowledgments need read-after-write reconciliation

A network failure after the remote accepts a ref update can leave the client unsure whether publication happened. The publisher must retain the candidate commit id and operation id, fetch or query the remote ref, and classify the result: candidate reachable from the remote tip means published; the old tip still current means retry the same candidate under CAS; an unexpected tip means rebuild/merge against it. Retrying the same immutable candidate is idempotent; reconstructing or force-pushing blindly is not. This is an architecture inference from Git's explicit old-value checks and fast-forward rules. [SOURCE: https://git-scm.com/docs/git-update-ref] [SOURCE: https://git-scm.com/docs/git-push]

### F5 — The strongest no-loss claim has a precise boundary

The system can guarantee that saved uncommitted files in isolated worktrees are not overwritten by other sessions, and that submitted commits/patches remain recoverable until publication or explicit conflict resolution. It cannot guarantee an editor buffer that has never been written to disk, nor can it automatically preserve the semantic intent of two arbitrary overlapping edits without choosing a merge result. The honest contract is therefore:

- no loss of saved work under the managed worktree and queue boundary;
- no force pushes, silent “ours/theirs” choices, or session-visible non-fast-forward retries;
- no manual response required for disjoint publication races;
- explicit, durable, recoverable conflict state for ambiguous overlap;
- clean IDE current-view worktree updated independently of dirty session worktrees.

Anything stronger would require either constraining all edits to conflict-free namespaces or accepting silent data loss. Git's own push documentation describes the need to merge or rebase both histories before a divergent update can be published safely. [SOURCE: https://git-scm.com/docs/git-push] [SOURCE: https://git-scm.com/docs/git-merge-tree]

### F6 — Final acceptance matrix

| Area | Acceptance condition | Failure response |
|---|---|---|
| Publication race | Two submissions from the same base both retain their objects; the branch advances through a serialized CAS sequence and never uses force | Rebuild/retry in daemon; never expose a push rejection to the session |
| Disjoint liveness | Every finite set of disjoint submissions is eventually published under a fair scheduler | Durable queue retry with backoff and alert on starvation |
| Overlap | Conflicted path/key set and base/current/submission SHAs are persisted; shared branch is unchanged until explicit resolution | Queue status `conflicted`; retain submission and recovery anchor |
| Dirty worktree | Fetch, merge-tree, publication, and current-view refresh leave each session worktree's files/index unchanged | Abort operation and retain patch/stash/recovery reference |
| IDE freshness | The clean current-view worktree fast-forwards to each published tip after its next successful fetch/update cycle | Keep it at last known good tip and report freshness lag; never reset a dirty session worktree |
| Crash before ref update | Restart finds queue record and pending ref/bundle and can replay the same candidate | Reconcile/replay; do not discard dangling candidates automatically |
| Crash after remote update | Read-after-write reconciliation marks the operation published if candidate is reachable | Retry/rebuild only when remote lacks candidate; never duplicate or force-rewrite |
| Rollback | Previous branch tip and submission recovery artifact remain addressable until verified completion | Restore by explicit ref update/revert procedure; preserve audit record |
| Path safety | Manifest violation, duplicate key, rename/delete, binary, or generated-file collision is rejected or queued | No unrecorded merge-driver or ours/theirs choice |
| Observability | Every submission has a stable id and states `accepted`, `queued`, `retrying`, `published`, `conflicted`, `recovered`, or `failed` with reason and SHAs | Alert on terminal failure; session never interprets a transient race as branch divergence |

## Questions Answered

- RQ1: Answered. The default is a serialized publisher with merge-tree/scratch-index construction and explicit CAS; optimistic rebase is only a bounded fast path, and remote queues are the CI/review alternative.
- RQ2: Answered. Use one linked worktree or clone per session, plus a separate clean current-view worktree; a shared working tree cannot protect concurrent indexes/files.
- RQ3: Answered. Fetch-only watchers preserve dirty work; a clean current-view worktree can fast-forward; a dirty shared IDE checkout cannot be both silently current and universally lossless.
- RQ4: Answered. Capture old state, retain identifiable queue/recovery anchors, verify postconditions, reconcile ambiguous acknowledgments, and forbid force/destructive reset.
- RQ5: Answered. Use a launch wrapper plus background publisher daemon; hooks are guardrails; use GitHub merge queue/Gerrit when remote CI/review is required.
- RQ6: Answered. Enforce path/key ownership, prefer additive unique namespaces, preflight with merge-tree, and queue all ambiguous overlap.
- RQ7: Answered. Existing art validates pieces of the design but none supplies the complete local no-loss multi-writer contract.

## Questions Remaining

- None for the stated research scope; implementation-specific queue storage, daemon protocol, and IDE integration remain design work outside this research loop.

## Ruled-Out Directions

- Independent session push loops as the default: they cannot own durable retries or hide races without central coordination. [SOURCE: https://git-scm.com/docs/git-push]
- Treating unreachable objects or `git fsck` discovery as the queue: recovery scanning is not durable submission ownership. [SOURCE: https://git-scm.com/docs/git-fsck]
- Claiming uncommitted work includes unsaved editor buffers: Git only sees filesystem/index state, so the boundary must be stated explicitly. [SOURCE: https://git-scm.com/docs/git-bundle]

## Negative Knowledge

“Zero operator-visible divergence blockers” is achievable for publication races and clean disjoint contributions by moving publication behind a durable single writer. “Zero conflicts and zero operator decisions” is not achievable for arbitrary overlapping edits without narrowing the edit domain or discarding one side. “No loss of any uncommitted work” is achievable only for saved work inside managed isolated worktrees; unsaved editor state is outside Git's observable boundary.

## Recommended Next Focus

Phase synthesis: consolidate five iterations into the canonical evidence-backed research report and convergence report, preserving all citations and acceptance conditions.

## Confidence

High for the Git primitive and official queue semantics cited here. High for the recommended default under the stated low-latency/no-force/no-worktree-overwrite constraints. Medium for operational throughput and latency because those depend on queue storage, CI duration, repository size, and the implementation's fairness/backoff policy.

## Sources Consulted

- https://git-scm.com/docs/git-push
- https://git-scm.com/docs/git-update-ref
- https://git-scm.com/docs/git-worktree
- https://git-scm.com/docs/git-merge-tree
- https://git-scm.com/docs/git-commit-tree
- https://git-scm.com/docs/git-fsck
- https://git-scm.com/docs/git-bundle
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue
