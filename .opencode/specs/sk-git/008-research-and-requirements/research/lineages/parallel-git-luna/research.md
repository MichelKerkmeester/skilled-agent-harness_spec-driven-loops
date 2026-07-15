# Research: Concurrent AI session autosync to one long-lived Git branch

<!-- ANCHOR:references -->
**Spec:** `.opencode/specs/skilled-agent-orchestration/137-parallel-session-git-autosync/001-research-and-requirements`

**Lineage:** `research/lineages/parallel-git-luna`

**Method:** Five detached evidence iterations using `cli-codex model=gpt-5.6-luna`; convergence was recorded as telemetry only because `stopPolicy` was `max-iterations`.
<!-- /ANCHOR:references -->

## 1. Executive Summary

The recommended default is a local, durable publication service with one isolated Git worktree or clone per AI session, plus a separate clean current-view worktree for the IDE. Sessions save their work in their own worktree and submit immutable commits or patches to a queue. One publisher owns the shared `v4` ref, preflights each contribution with `git merge-tree` or a scratch index, creates the candidate commit with `git commit-tree`, and publishes with an explicit expected-old-tip compare-and-swap. The publisher retries races internally; sessions do not force-push or repeatedly surface non-fast-forward errors. [SOURCE: https://git-scm.com/docs/git-worktree] [SOURCE: https://git-scm.com/docs/git-merge-tree] [SOURCE: https://git-scm.com/docs/git-commit-tree] [SOURCE: https://git-scm.com/docs/git-update-ref] [SOURCE: https://git-scm.com/docs/git-push]

This architecture satisfies the strongest useful interpretation of “zero operator-visible divergence blockers”: clean, disjoint submissions are continuously integrated; publication races are hidden behind durable retry; dirty session worktrees are not rewritten; and ambiguous overlap becomes a durable, recoverable queue state rather than silent data loss. It cannot make arbitrary overlapping edits semantically conflict-free, and it cannot protect editor buffers that have never been written to disk. Those boundaries must be part of the contract. [SOURCE: https://git-scm.com/docs/git-merge-tree] [SOURCE: https://git-scm.com/docs/git-bundle]

The clean IDE current view is a separate concern. A watcher may fetch frequently without touching any worktree, then fast-forward the clean view. A dirty session worktree should be left alone; `pull --rebase --autostash` is useful only as a guarded, recoverable operation, not as a blanket no-loss guarantee. [SOURCE: https://git-scm.com/docs/git-fetch] [SOURCE: https://git-scm.com/docs/git-merge] [SOURCE: https://git-scm.com/docs/git-rebase]

## 2. Research Scope and Contract

The research evaluated seven questions:

- RQ1: auto-rebase-and-retry, a serialized push multiplexer/daemon, merge queues, and ref-level scratch-index/`commit-tree` publication.
- RQ2: one shared working tree versus one isolated worktree or clone per session.
- RQ3: fetch-only freshness, `pull --rebase --autostash`, fast-forward-only updates, and non-disturbing checkout refresh.
- RQ4: orphaned autostashes, overwritten files, force-push loss, crash recovery, and rollback.
- RQ5: hooks, launch wrappers, background daemons, remote-side bots, GitHub merge queue, and Gerrit.
- RQ6: path partitioning, per-session subtrees, additive-only commits, merge drivers, and conflict handling.
- RQ7: existing art including `git-sync`, `git-autosync`, mob, Syncthing, GitHub merge queue, Git Town, and Gerrit.

The target contract is narrower than “Git never reports a conflict.” The system must provide:

1. no blind force-pushes or silent deletion of another session's commit;
2. no manual response to ordinary publication races or stale-ref retries;
3. no overwrite of saved uncommitted files in a managed session worktree;
4. durable status and recovery material for conflicts and crashes;
5. a clean IDE view that can advance independently of dirty session worktrees; and
6. explicit acknowledgement that arbitrary semantic overlap and unsaved editor buffers are outside the automatic no-loss guarantee.

## 3. Method and Evidence

The loop ran exactly five iterations, as required by the max-iteration stop policy. It checked the official Git manuals for ref updates, push safety, worktrees, merge preflight, fetch, pull, reset, rebase, stash, reflog, merge drivers, sparse checkout, bundles, and object reachability. It also checked primary documentation for GitHub merge queues, Gerrit submit requirements, Git Town, mob, Syncthing, and the named synchronization projects.

The strongest claims below are direct consequences of documented Git behavior. The architecture recommendation is an inference from combining those primitives under the stated no-force, no-overwrite, low-latency constraints. Where an inference is made, it is labelled as such rather than presented as a guarantee supplied by Git.

## 4. RQ1 — Integration Strategies

### Auto-rebase-and-retry

An optimistic loop can fetch the current tip, rebase a candidate, and retry after a race. This improves liveness for clean, finite, disjoint patches. It does not remove overlap conflicts, generated-file contention, starvation, or the need for durable retry ownership. A retry loop outside a shared queue also leaves each session responsible for interpreting push failures. [SOURCE: https://git-scm.com/docs/git-push] [SOURCE: https://git-scm.com/docs/git-rebase]

Use this as a bounded fast path inside the publisher, not as the system's coordination model. The publisher should retain the immutable submission and retry against the newly observed tip; it should stop and queue a conflict when the patch cannot be applied safely.

### Serialized push multiplexer or daemon

A single publisher owns the shared branch's compare-and-swap sequence. It dequeues one immutable submission, observes the current tip, constructs a candidate with that tip as parent, and conditionally publishes it. A race is an internal retry or rebuild, not a session-visible non-fast-forward failure. `git-update-ref` exposes the expected-old-object-id pattern directly for local refs, and `git-push` provides explicit lease checks for remote refs. [SOURCE: https://git-scm.com/docs/git-update-ref] [SOURCE: https://git-scm.com/docs/git-push]

This is the best fit for continuous low-latency publication, provided the queue, fairness policy, recovery anchors, and conflict states are durable. Serialization is not a guarantee that every submission merges; it is the ownership boundary that makes the result deterministic and observable.

### Merge queues

GitHub's merge queue creates temporary merge-group branches and orders pull requests through required checks before updating the target branch. Gerrit similarly separates review changes from submission and evaluates submit requirements. These are strong remote-side ordering and policy models, but their unit is a review/change, not a dirty local worktree. They add CI and review latency and are better when tested integration is the governing constraint. [SOURCE: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue] [SOURCE: https://gerrit-review.googlesource.com/Documentation/intro-quick.html] [SOURCE: https://gerrit-review.googlesource.com/Documentation/submit-requirements.html]

### Scratch index and ref-level publication

`git read-tree` can populate a private index without updating the current worktree; `git write-tree` and `git commit-tree` can then construct a candidate tree and commit. With `GIT_INDEX_FILE` pointing at a publisher-owned scratch index, the IDE's index and files remain untouched. `git merge-tree --write-tree` provides a non-destructive three-way merge preflight. [SOURCE: https://git-scm.com/docs/git-read-tree] [SOURCE: https://git-scm.com/docs/git-update-index] [SOURCE: https://git-scm.com/docs/git-commit-tree] [SOURCE: https://git-scm.com/docs/git-merge-tree]

This is a publication engine, not an automatic semantic conflict solver. The publisher must fail closed or queue a durable conflict when overlapping paths cannot be merged under an explicit, tested policy.

## 5. RQ2 — Workspace Models

### One shared working tree

A shared working tree gives every session the same files and index. Concurrent edits can overwrite or interleave before Git sees a commit, and a checkout or reset by one actor changes the state observed by the others. Hooks and conventions can reduce risk but do not create file ownership. This model cannot satisfy no-loss for concurrent uncommitted work.

### One linked worktree or clone per session

Linked worktrees provide separate `HEAD`, index, and working files while sharing repository objects and ref coordination. A clone provides stronger filesystem/process isolation at higher storage and fetch cost. Either model prevents one AI session from directly overwriting another session's saved files; neither alone serializes updates to the shared branch. [SOURCE: https://git-scm.com/docs/git-worktree] [SOURCE: https://git-scm.com/docs/git-push]

The default should be one managed linked worktree per local session, with a stable session id, lifecycle record, and optional path-ownership manifest. Use a clone when process isolation, independent object maintenance, or remote placement matters more than local object sharing.

### Separate clean current-view worktree

The IDE's always-current file view should be a distinct clean worktree. It can be fetched and fast-forwarded without touching any AI session's dirty worktree. If the user instead opens a dirty session worktree as the current view, the system must choose between leaving it untouched and showing freshness metadata, or integrating incoming changes with a possible conflict. Git cannot simultaneously apply arbitrary incoming files and preserve arbitrary overlapping uncommitted edits without making an integration decision. [SOURCE: https://git-scm.com/docs/git-fetch] [SOURCE: https://git-scm.com/docs/git-merge] [SOURCE: https://git-scm.com/docs/git-reset]

## 6. RQ3 — Staying Current Safely

`git fetch` downloads objects and updates remote-tracking refs without merging, rebasing, or rewriting the worktree. It is the safe primitive for a watch-based freshness loop. A fetch watcher tells the system what the remote tip is; it does not by itself make checked-out files current. [SOURCE: https://git-scm.com/docs/git-fetch]

Fast-forward-only refresh is the conservative update policy for a clean current-view worktree. `git merge --ff-only` and `git pull --ff-only` refuse when histories diverge instead of creating an implicit merge or overwriting local commits. In the clean-view worktree, such a refusal is an automation state to retry or diagnose; it is not exposed as a push failure to every session. [SOURCE: https://git-scm.com/docs/git-merge] [SOURCE: https://git-scm.com/docs/git-pull]

`pull --rebase --autostash` may preserve a dirty worktree temporarily, but Git documents that applying the autostash after the rebase can conflict. Rebase also has distinct abort, continue, and quit states; `--quit` may leave the autostash in the stash list. The wrapper must identify the stash, capture old `HEAD` and worktree state, retain recovery material, and verify the resulting tree before cleanup. [SOURCE: https://git-scm.com/docs/git-pull] [SOURCE: https://git-scm.com/docs/git-rebase] [SOURCE: https://git-scm.com/docs/git-stash]

`git reset --keep` is a guarded operation that refuses when local changes would be overwritten. `git reset --hard` can replace tracked files and remove obstructing untracked files, so it is incompatible with a blanket no-loss promise. [SOURCE: https://git-scm.com/docs/git-reset]

The practical currentness contract is therefore two-tiered: refs and remote knowledge can be continuously current through fetch, while a clean current-view worktree can continuously fast-forward. A dirty session worktree remains untouched and reports its relationship to the current tip rather than pretending its files were updated.

## 7. RQ4 — Safety and Rollback

### Ref safety

Normal Git pushes reject non-fast-forward updates, which protects another writer's commits but exposes a race. Blind `--force` disables that protection and can discard remote history. A publisher must retain an explicit expected old tip and use conditional publication; if the expected value changed, it rebuilds or retries. The shorthand lease tied to a moving remote-tracking ref is weaker than an explicitly recorded expected object id. [SOURCE: https://git-scm.com/docs/git-push]

### Worktree safety

Publication, merge preflight, fetch, and queue recovery must run in a publisher-owned worktree, scratch index, or clean current-view worktree. They must not run against a dirty session worktree. This prevents the publisher from converting a ref race into file loss. [SOURCE: https://git-scm.com/docs/git-worktree] [SOURCE: https://git-scm.com/docs/git-read-tree]

### Autostash safety

An autostash is temporary state, not proof of preservation. Record `(operation_id, old_HEAD, index/worktree identity, stash identity, target_HEAD, result, recovery_reference)`. Retain the stash or a patch/bundle until post-apply content verification succeeds; if application conflicts, leave the recovery reference and mark the operation recoverable. The reflog is a more reliable historical reference than assuming `ORIG_HEAD` will remain unchanged across later commands. [SOURCE: https://git-scm.com/docs/git-rebase] [SOURCE: https://git-scm.com/docs/git-reflog] [SOURCE: https://git-scm.com/docs/git-stash]

### Crash and ambiguous acknowledgement safety

Write the submission record before constructing objects. Anchor the pending commit with a private ref such as `refs/autosync/pending/<submission-id>` or a verified bundle, and delete that anchor only after the shared ref and queue record agree. `git fsck` can find dangling objects, but discovery is not durable queue ownership. [SOURCE: https://git-scm.com/docs/git-fsck] [SOURCE: https://git-scm.com/docs/git-bundle]

If the network fails after a remote accepts an update, retain the candidate object id and operation id, read the remote ref again, and classify the result. If the candidate is reachable, mark published; if the old tip remains, retry the same immutable candidate under CAS; if an unexpected tip exists, rebuild against it. This is an architecture inference from Git's conditional update semantics. [SOURCE: https://git-scm.com/docs/git-update-ref] [SOURCE: https://git-scm.com/docs/git-push]

### No-loss boundary

The system can guarantee no loss of saved files in managed isolated worktrees and no loss of submitted commits while their queue record or recovery anchor exists. It cannot guarantee an editor buffer never written to disk, and it cannot preserve both semantic meanings of arbitrary overlapping edits without selecting a result. `git-bundle` backs up reachable Git objects, not the working tree, index, stash, hooks, or configuration. [SOURCE: https://git-scm.com/docs/git-bundle]

## 8. RQ5 — Automation Surface

Git hooks are useful synchronous guardrails for validation, metadata, and refusal of unsafe local commands. They are not a durable shared serializer: hooks are local, can be bypassed, and do not own a cross-session queue. [SOURCE: https://git-scm.com/docs/githooks]

A launch wrapper is the right place to allocate a worktree or clone, write the session manifest, and register the submission endpoint. It cannot serialize publication by itself. A background daemon is the best local lifecycle surface because it can own queue state, fetch, retries, fairness, status, conflict retention, crash recovery, and IDE refresh independently of session processes.

Remote merge queues and Gerrit are stronger when CI, review, submit requirements, and policy gates are more important than local latency. They should be treated as a possible outer boundary around the local publisher, not as a solution to dirty-worktree safety. [SOURCE: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue] [SOURCE: https://gerrit-review.googlesource.com/Documentation/submit-requirements.html]

## 9. RQ6 — Conflict Avoidance and Handling

The strongest first-line rule is a path-ownership manifest: each session declares the paths it may modify, and the publisher rejects undeclared paths. Per-session subtrees and unique additive keys reduce conflicts only when names are genuinely unique. Shared generated files, duplicate keys, renames, deletes, schema changes, and cross-cutting edits still require serialization or a domain-specific merge policy.

`git merge-tree --write-tree` can preflight a three-way merge without changing the worktree. A clean result may be published; a conflicted result should persist the base, current, submission SHAs and paths, retain the submission, and leave the shared branch unchanged. [SOURCE: https://git-scm.com/docs/git-merge-tree]

`rerere` can reuse a previously recorded human resolution, and custom merge drivers can merge narrow structured formats. Both are assistive policy layers, not proof that the selected result is semantically correct. Drivers should fail closed on malformed data, duplicate keys, incompatible schema changes, and ambiguous output; “ours” or “theirs” is acceptable only for explicitly disposable paths whose discarded input remains recoverable. [SOURCE: https://git-scm.com/docs/git-rerere] [SOURCE: https://git-scm.com/docs/gitattributes]

Sparse checkout reduces the files populated in a worktree, but it is a projection optimization rather than ref or path ownership. Changing sparse patterns can remove files from the working directory, so sparse checkout must not be used as the concurrency boundary. [SOURCE: https://git-scm.com/docs/git-sparse-checkout]

## 10. RQ7 — Existing Art

The surveyed systems validate individual pieces of the design, but none supplies the complete local contract of concurrent dirty sessions, continuous shared-branch publication, and no silent loss.

| Existing art | What it demonstrates | What it does not establish |
|---|---|---|
| GitHub merge queue | Ordered merge groups, required checks, and remote target-branch integration | Lossless dirty local worktree sync or zero CI latency [SOURCE: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue] |
| Gerrit | Review changes and explicit submit requirements before target-branch update | A local multi-writer worktree or arbitrary dirty-file preservation [SOURCE: https://gerrit-review.googlesource.com/Documentation/intro-quick.html] [SOURCE: https://gerrit-review.googlesource.com/Documentation/submit-requirements.html] |
| Git Town | Stash, sync, undo, continue, and skip workflows for developer branches | A central serialized publisher for many AI sessions [SOURCE: https://www.git-town.com/commands/sync] |
| mob | Human handoff around a shared WIP branch | Concurrent independent writers with durable merge arbitration [SOURCE: https://mob.sh/] |
| `simonthum/git-sync` and `git-auto-sync` | Fetch, auto-commit, fast-forward/rebase, push, and watcher automation | A universal no-loss conflict solver; non-trivial conflicts still require intervention [SOURCE: https://github.com/simonthum/git-sync] [SOURCE: https://pkg.go.dev/github.com/findingjimoh/git-auto-sync] |
| `wei/git-sync` | File mirroring with a backup-oriented workflow | Safe shared-branch default when its force-push behavior is enabled [SOURCE: https://github.com/wei/git-sync] |
| Syncthing | Continuous file replication and conflict-copy handling | Git parentage, ref CAS, commit ordering, or merge-queue semantics [SOURCE: https://docs.syncthing.net/users/faq.html] [SOURCE: https://github.com/syncthing/syncthing] |

The result is compositional: use worktrees for local ownership, a daemon for queue ownership, Git's plumbing for non-worktree publication, and a remote queue when CI/review policy is required.

## 11. Recommended Default Architecture

### Components

1. **Session launcher.** Creates one linked worktree or clone per AI session, records session id and allowed paths, and gives the session a submission client.
2. **Session commit boundary.** A saved commit or immutable patch is the unit submitted to the queue. Unsaved editor buffers are outside the guarantee.
3. **Durable publisher queue.** Stores submission id, source/base SHA, candidate SHA, path manifest, attempt count, state, timestamps, error, recovery anchor, and last observed remote tip.
4. **Single publisher.** Owns fetch, merge preflight, scratch-index or `merge-tree` construction, commit creation, explicit old-tip CAS, retry, and conflict classification.
5. **Clean IDE current view.** A separate worktree follows the published branch through fetch and fast-forward-only update. It is never the worktree in which AI sessions hold private uncommitted files.
6. **Recovery and observability.** Pending refs or bundles remain until publication is verified; every submission exposes `accepted`, `queued`, `retrying`, `published`, `conflicted`, `recovered`, or `failed` with reason and SHAs.

This is an architecture recommendation inferred from Git's worktree, merge-tree, commit-tree, update-ref, and push primitives. Those commands provide the building blocks; the daemon supplies the missing durable ownership and lifecycle semantics. [SOURCE: https://git-scm.com/docs/git-worktree] [SOURCE: https://git-scm.com/docs/git-merge-tree] [SOURCE: https://git-scm.com/docs/git-commit-tree] [SOURCE: https://git-scm.com/docs/git-update-ref] [SOURCE: https://git-scm.com/docs/git-push]

### Strategy trade-offs

| Strategy | Correctness | Liveness | Operator surface | Recommendation |
|---|---|---|---|---|
| Independent rebase/retry loops | Safe only while force is forbidden; races and retry ownership leak to clients | Good for clean finite patches; weak under conflict storms or starvation | Repeated push/rebase states | Use only as a bounded inner fast path |
| Serialized local daemon | One owner for CAS, fairness, conflict records, and recovery | Strongest local behavior if storage is durable | Sessions see queue states, not non-FF push failures | Default |
| GitHub merge queue or Gerrit | Strong ordering, checks, and policy | Higher CI/review latency; changes may be rebuilt | Excellent remote status | Use when review/CI governs publication |
| Scratch-index/ref publisher | Does not touch the IDE worktree; clean merges are fast | High for disjoint work; overlap needs policy | Requires daemon tooling | Core publication engine behind the queue |

### Operational sequence

1. The launcher creates the session worktree and path manifest.
2. The session saves and commits its work, then submits the commit id and manifest. The queue writes the submission record and pending recovery anchor before publication work begins.
3. The publisher fetches current refs, verifies the contribution is rooted in the recorded base, checks path ownership, and runs `merge-tree` or a private-index merge.
4. For a clean result, it creates a candidate commit whose parent is the current `v4` tip and publishes with an explicit expected old tip. A race causes a rebuild/retry, never a blind force-push.
5. For an ambiguous result, it retains the submission and recovery anchor, records the paths and SHAs, and leaves `v4` unchanged until an explicit resolution is accepted.
6. The current-view watcher fetches and advances the clean IDE worktree by fast-forward only. Dirty session worktrees are not refreshed by reset or pull.
7. After read-after-write verification and tree/hash checks, the publisher marks the submission published and only then releases temporary recovery material.

## Eliminated Alternatives

| Alternative | Why it is eliminated as the default | Evidence | Iterations |
|---|---|---|---|
| Blind `git push --force` | Can discard another writer's commits | [git-push](https://git-scm.com/docs/git-push) | 1, 5 |
| Independent client push loops | No durable shared retry owner, fairness, or hidden race boundary | [git-push](https://git-scm.com/docs/git-push) | 1, 5 |
| Scratch index as a conflict solver | Isolates files but does not decide incompatible edits | [git-read-tree](https://git-scm.com/docs/git-read-tree), [git-merge-tree](https://git-scm.com/docs/git-merge-tree) | 1, 4 |
| One shared working tree | Sessions can overwrite each other's files and index | [git-worktree](https://git-scm.com/docs/git-worktree) | 1, 5 |
| Dirty `pull --rebase --autostash` as no-loss | Autostash reapplication can conflict or remain after quit | [git-pull](https://git-scm.com/docs/git-pull), [git-rebase](https://git-scm.com/docs/git-rebase) | 2 |
| `reset --hard` freshness | Can overwrite tracked edits and remove obstructing untracked files | [git-reset](https://git-scm.com/docs/git-reset) | 2 |
| Fast-forward-only as complete integration | Correctly refuses divergence; it does not reconcile it | [git-merge](https://git-scm.com/docs/git-merge) | 2 |
| Hooks as the sole serializer | Local guardrails do not own a durable multi-session queue | [githooks](https://git-scm.com/docs/githooks) | 3 |
| Force-push mirroring | The cited workflow relies on force-push behavior and backup warnings | [wei/git-sync](https://github.com/wei/git-sync) | 3 |
| Syncthing as Git integration | Replicates files but does not provide ref parentage or CAS | [Syncthing FAQ](https://docs.syncthing.net/users/faq.html) | 3 |
| Additive-only without unique paths/keys | Shared generated files and duplicate keys still collide | [git-merge-tree](https://git-scm.com/docs/git-merge-tree) | 4 |
| Sparse checkout as isolation | Changes the file projection, not ref or ownership semantics | [git-sparse-checkout](https://git-scm.com/docs/git-sparse-checkout) | 4 |
| Unconditional `rerere` or ours/theirs | Can encode an unverified semantic choice | [git-rerere](https://git-scm.com/docs/git-rerere), [gitattributes](https://git-scm.com/docs/gitattributes) | 4 |
| `git fsck` as a queue | Finds recovery objects but is not submission ownership | [git-fsck](https://git-scm.com/docs/git-fsck) | 5 |
| Unsaved buffers in the no-loss promise | Git bundles and refs do not capture editor state that was never saved | [git-bundle](https://git-scm.com/docs/git-bundle) | 5 |

## Divergence Map

- Saturated directions: none recorded.
- Completed pivots: none.
- Failed pivots or audited overrides: none.
- Remaining frontier: none for the seven research questions; implementation-specific queue storage and IDE protocol remain outside this loop.

## 12. Open Questions

No research question remains unanswered. Implementation work still has to choose the queue store, daemon transport, fairness/backoff policy, branch authentication, path-manifest format, and the exact IDE integration API. Those are design parameters, not unresolved evidence gaps in this research pass.

## 13. Testable Acceptance Conditions

1. **Publication race:** two submissions from the same base both retain their objects and eventually publish through serialized conditional updates; no force-push is used and no session receives a non-fast-forward error.
2. **Disjoint liveness:** every finite set of disjoint submissions eventually reaches `published` under a fair scheduler; starvation is a durable alert, not an invisible retry loop.
3. **Overlap:** an incompatible overlap persists `base_sha`, `current_sha`, `submission_sha`, paths, reason, and recovery reference; the shared branch remains unchanged until explicit resolution.
4. **Dirty worktree:** fetch, merge preflight, publication, and current-view refresh leave each session worktree's files and index byte-for-byte equivalent to their pre-operation state.
5. **IDE freshness:** the clean current-view worktree reaches each published tip after its next successful fetch/update cycle, using fast-forward-only behavior.
6. **Crash before publication:** restart finds the queue record and pending ref/bundle and replays the same immutable submission without loss or duplicate semantic publication.
7. **Crash after remote update:** read-after-write reconciliation marks the operation published when the candidate is reachable; otherwise it retries or rebuilds under CAS.
8. **Rollback:** the previous branch tip and submission recovery artifact remain addressable until postconditions are verified; rollback preserves an audit record.
9. **Path safety:** undeclared paths, duplicate additive keys, generated-file collisions, rename/delete conflicts, and binary conflicts are rejected or queued rather than resolved by an unrecorded default.
10. **Autostash recovery:** a failed rebase or stash application leaves a named, inspectable recovery reference and never silently deletes the original work.
11. **Observability:** each submission exposes a stable id and one of `accepted`, `queued`, `retrying`, `published`, `conflicted`, `recovered`, or `failed`, with reason and relevant SHAs.
12. **Reachability:** cleanup of pending refs, bundles, or stashes occurs only after the queue record, shared ref, candidate tree, and recovery verification agree.

## 14. Trade-offs and Failure Modes

- **Latency versus policy:** a local daemon can publish quickly but needs its own authorization, durability, and monitoring. GitHub merge queue or Gerrit supplies mature remote policy at the cost of CI/review latency.
- **Serialization versus throughput:** one publisher removes ref races but is a throughput bottleneck. It can batch or parallelize non-conflicting preflight, but final ref publication remains ordered.
- **Automatic merge versus semantic safety:** path partitioning and tested domain drivers improve automation. Unknown overlap must remain a conflict; silently choosing ours/theirs violates no-loss.
- **Freshness versus dirty preservation:** fetch keeps knowledge current without changing files. Automatically current files require a clean view or an explicit merge decision.
- **Recovery versus garbage collection:** pending refs and bundles preserve crash recovery but require retention and cleanup policy. Early deletion reintroduces orphan risk.
- **Local object sharing versus isolation:** linked worktrees are efficient and share objects; clones are more isolated but consume more storage and fetch bandwidth.
- **Contract ambiguity:** “uncommitted work” must mean saved files in a managed worktree. Unsaved editor buffers need editor-level snapshotting if they are in scope.

## 15. Operational Sequence

The normal path is:

`launch worktree → save/commit → durable queue record → fetch current tip → path check → merge-tree or scratch-index preflight → commit-tree candidate → explicit CAS publish → read-after-write verify → update clean IDE view → retain audit/recovery record`

The conflict path is:

`preflight conflict → persist base/current/submission SHAs and paths → retain pending ref/bundle → leave shared branch unchanged → resolve explicitly → replay candidate → verify → clean up recovery anchor`

The crash path is:

`restart → scan durable queue → reconcile pending ref/bundle with remote tip → mark published, retry immutable candidate, or rebuild against observed tip → never infer success from process exit alone`

## 16. Confidence and Evidence Limits

Confidence is high for the documented Git command behavior and for the fact that linked worktrees isolate files and indexes while refs still need coordination. Confidence is high for the recommendation under the stated constraints because it directly separates file ownership, ref ownership, and current-view ownership.

Confidence is medium for throughput and latency. Those depend on repository size, queue storage, network behavior, fairness, conflict frequency, and whether a remote merge queue or CI gate is inserted. No benchmark was run in this lineage, so no performance number is claimed.

The “zero operator-visible divergence blockers” outcome is an architectural target, not a guarantee supplied by a single Git option. It is testable for publication races and clean disjoint submissions. It is not honest to extend it to arbitrary overlapping semantic changes or unsaved editor state.

## 17. References

- [Git push](https://git-scm.com/docs/git-push)
- [Git update-ref](https://git-scm.com/docs/git-update-ref)
- [Git worktree](https://git-scm.com/docs/git-worktree)
- [Git merge-tree](https://git-scm.com/docs/git-merge-tree)
- [Git read-tree](https://git-scm.com/docs/git-read-tree)
- [Git update-index](https://git-scm.com/docs/git-update-index)
- [Git commit-tree](https://git-scm.com/docs/git-commit-tree)
- [Git fetch](https://git-scm.com/docs/git-fetch)
- [Git pull](https://git-scm.com/docs/git-pull)
- [Git merge](https://git-scm.com/docs/git-merge)
- [Git reset](https://git-scm.com/docs/git-reset)
- [Git rebase](https://git-scm.com/docs/git-rebase)
- [Git stash](https://git-scm.com/docs/git-stash)
- [Git reflog](https://git-scm.com/docs/git-reflog)
- [Git fsck](https://git-scm.com/docs/git-fsck)
- [Git bundle](https://git-scm.com/docs/git-bundle)
- [Git hooks](https://git-scm.com/docs/githooks)
- [Git rerere](https://git-scm.com/docs/git-rerere)
- [Git attributes and merge drivers](https://git-scm.com/docs/gitattributes)
- [Git sparse-checkout](https://git-scm.com/docs/git-sparse-checkout)
- [GitHub merge queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue)
- [Gerrit quick introduction](https://gerrit-review.googlesource.com/Documentation/intro-quick.html)
- [Gerrit submit requirements](https://gerrit-review.googlesource.com/Documentation/submit-requirements.html)
- [Git Town sync](https://www.git-town.com/commands/sync)
- [mob](https://mob.sh/)
- [simonthum/git-sync](https://github.com/simonthum/git-sync)
- [git-auto-sync package](https://pkg.go.dev/github.com/findingjimoh/git-auto-sync)
- [wei/git-sync](https://github.com/wei/git-sync)
- [Syncthing FAQ](https://docs.syncthing.net/users/faq.html)
- [Syncthing](https://github.com/syncthing/syncthing)

## Convergence Report

- Stop reason: `maxIterationsReached`.
- Total iterations: 5 of 5 required.
- Questions answered: 7 / 7.
- Remaining research questions: 0.
- New-information ratios: iteration 3 = 0.82, iteration 4 = 0.76, iteration 5 = 0.68.
- Convergence threshold: 0.05; convergence was telemetry only and did not terminate the loop early.
- Divergence: no unresolved divergent pivots were recorded.
- Final recommendation: isolated session worktrees plus a durable serialized merge-tree/scratch-index publisher with explicit CAS, and a separate clean IDE current-view worktree.
