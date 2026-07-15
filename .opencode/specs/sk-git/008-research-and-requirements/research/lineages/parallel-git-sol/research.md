# Concurrent AI Session Git Autosync — Research Synthesis

## 1. Executive Summary

The recommended default is a **local supervised single-writer publisher** backed by a durable transaction journal and Git reachability refs, with four isolated planes:

1. **Authoring:** one linked Git worktree and one private branch per AI session. The coordinator never checks out, resets, rebases, stashes, cleans, or resolves conflicts in these worktrees.
2. **Capture:** a launch wrapper registers the session; submission captures an immutable source commit, pins it under `refs/autosync/pending/<tx>/source`, and records the transaction durably before acknowledgement.
3. **Integration/publication:** one daemon fetches the authoritative remote tip, preflights conflicts, constructs the next commit in a scratch index or disposable worktree, pins the candidate, and performs only fast-forward publication. It absorbs fetch/retry/non-fast-forward races internally and reconciles ambiguous push outcomes by observing the remote ref.
4. **Projection:** a separate non-authoring IDE view materializes verified remote revisions as immutable worktrees and atomically switches a stable pointer, or uses a clean dedicated worktree updated fast-forward-only. A dirty projection is rebuilt or quarantined; session worktrees are never used as the freshness surface.

This architecture can eliminate routine `N commits behind` and non-fast-forward blockers from the operator's working flow. It cannot make arbitrary overlapping intent merge correctly. Textual conflicts, dependency violations, and semantic-validator failures become durable `conflict-quarantined` transactions while the published branch and IDE projection remain clean. If “zero operator-visible blockers” literally includes never surfacing semantic adjudication, the requirement is impossible without silently dropping or arbitrarily choosing work. [SOURCE: https://git-scm.com/docs/git-push] [SOURCE: https://git-scm.com/docs/git-merge-tree]

## 2. Research Question and Scope

The research compared:

- rebase-and-retry, serialized publication, hosted merge queues, and scratch-index/ref-level commit construction;
- shared working trees, linked worktrees, and independent clones;
- fetch, fast-forward-only projection updates, autostash/rebase, and watch-driven refresh;
- reachability, crash recovery, remote acknowledgement, rollback, and force-push safety;
- hooks, launch wrappers, daemons, and remote bots;
- path partitioning, per-session subtrees, additive-only changes, and conflict quarantine;
- Kubernetes `git-sync`, GitJournal `git-auto-sync`, `mob`, Syncthing, GitHub merge queue, Git Town, and Gerrit.

Implementation and deployment were out of scope. The packet ran five evidence iterations under a hard `max-iterations` stop policy.

## 3. Decision

Adopt the four-plane local publisher architecture as the default. Use hosted merge queues or Gerrit only as optional validation/adjudication backends; they do not replace local capture or IDE projection. Enforce a single writer for the shared branch with branch protection or a receive-side policy. Never give ordinary sessions credentials that can update the shared branch directly.

The decisive reasons are:

- Git's remote branch update is the serialization point. Two independent descendants of the same old tip cannot both fast-forward the same ref; one must be integrated after the other. [SOURCE: https://git-scm.com/docs/git-push]
- Linked worktrees isolate `HEAD`, index, and working files while sharing objects and most refs, giving low-cost local session isolation. [SOURCE: https://git-scm.com/docs/git-worktree]
- Scratch-index plumbing and `commit-tree` construct commits without touching an authoring worktree. [SOURCE: https://git-scm.com/docs/git-read-tree] [SOURCE: https://git-scm.com/docs/git-write-tree] [SOURCE: https://git-scm.com/docs/git-commit-tree]
- `update-ref <ref> <new> <old>` supplies local compare-and-swap, but a hosted push still needs observation and retry around the remote receive path. [SOURCE: https://git-scm.com/docs/git-update-ref] [SOURCE: https://git-scm.com/docs/git-ls-remote]
- A durable queue plus live temporary refs closes the gap among process state, Git object reachability, and ambiguous remote acknowledgement.

## 4. System Model and Invariants

### Components

| Component | Owns | Must not own |
|---|---|---|
| Session launch wrapper | Allocate/validate worktree and branch; register stable session ID; verify daemon availability | Fetch/integrate/push retry loops or durable transaction truth |
| Session worktree | Dirty authoring state and private branch | Shared branch checkout or automated freshness mutation |
| Capture API | Immutable source OID, source pin, durable enqueue acknowledgement | Semantic merge decisions |
| Publisher daemon | Queue, journal, authentication, fetch, integration, push, remote reconciliation, recovery | Direct mutation of session files/index/`HEAD` |
| Integration workspace | Scratch index or disposable worktree for candidate construction and validation | Long-lived uncommitted user state |
| Projection controller | Verified revision materialization, pointer switch, IDE refresh acknowledgement | Authoring or conflict resolution |
| Remote enforcement | Reject non-fast-forward or unauthorized shared-branch writes | Local session capture or IDE state |

### Hard invariants

1. The publisher never runs checkout, reset, pull, rebase, stash, clean, or conflict resolution in a session worktree.
2. Every accepted source and candidate remains reachable through a live namespaced ref until remote containment, durable acknowledgement, and projection handoff are recorded.
3. Only the publisher identity may update the shared branch; it never uses force, force-with-lease, or a `+` refspec.
4. Every published tip descends from the previously verified remote tip.
5. Transport uncertainty is retryable state; semantic uncertainty is quarantined state.
6. The projection represents only a verified remote OID and is disposable.
7. Rollback is a new revert commit from the current tip, never backward ref movement.

## 5. Integration Strategy Comparison

| Strategy | Strength | Failure mode | Role in default |
|---|---|---|---|
| Per-session fetch/rebase/retry | Simple optimistic integration; eventually produces fast-forward candidates | Races remain between fetch and push; rebase conflicts mutate/stall authoring sessions | Do not use in active session worktrees; retry may be internal to a disposable publisher workspace |
| Serialized push multiplexer | Removes races among participating writers; centralizes authentication, retry, and audit | One ordered publication boundary; external writers can still advance the ref | Core authority |
| Hosted merge queue | FIFO speculative validation against the latest base and earlier queued changes | Conflicts/check failures/timeouts remove entries; PR lifecycle; no local dirty-state or IDE control | Optional hosted validation/backend |
| Scratch index + `commit-tree` + conditional refs | Constructs commits without checkout; keeps session worktrees untouched | Local ref CAS does not atomically update a hosted remote | Core integration mechanism inside the publisher |

The publisher should normally integrate one contribution at a time. It may batch disjoint contributions only when the combined candidate and every semantic validator pass; otherwise batching expands the blast radius and makes attribution harder.

## 6. Workspace Model

### Recommended

- One linked worktree and unique private branch per local AI session.
- One disposable publisher workspace or scratch index.
- One separate IDE projection that is explicitly non-authoring.
- Ordinary independent clones when sessions need process/repository isolation across machines or trust boundaries.

Linked worktrees share objects efficiently but isolate `HEAD`, index, and files. Git's refusal to check out one branch in multiple worktrees is a useful safety guard. `worktree lock` protects administrative metadata from pruning, not dirty file content. [SOURCE: https://git-scm.com/docs/git-worktree]

Avoid long-lived `clone --shared` or `--reference` borrowers as the safety boundary: source-side pruning can remove objects required by the borrower. Use normal clones or `--dissociate` when a larger isolation boundary is required. [SOURCE: https://git-scm.com/docs/git-clone]

## 7. Staying Current Safely

| Operation | Active session worktree | Clean IDE projection | Reason |
|---|---|---|---|
| `git fetch` | Allowed | Allowed | Updates objects/remote-tracking refs without rewriting session files; Git refuses fetching into the checked-out branch by default. [SOURCE: https://git-scm.com/docs/git-fetch] |
| `merge --ff-only` / `pull --ff-only` | Not automatic | Allowed after clean-tree check | Moves only to a descendant; aborts on divergence. [SOURCE: https://git-scm.com/docs/git-merge] |
| `pull --rebase --autostash` | Forbidden | Unnecessary | Rewrites history; final stash application can conflict. [SOURCE: https://git-scm.com/docs/git-pull] |
| `reset --keep` | Forbidden automatically | Recovery-only | Moves `HEAD`, index, and some files; overlap-sensitive rather than no-touch. [SOURCE: https://git-scm.com/docs/git-reset] |
| Watch-driven refresh | Fetch-only notification | Serialized/coalesced materialization | Two refresh processes must not race on one index/worktree. |

The strongest projection model borrows from `git-sync`: materialize the target revision in a versioned worktree, then atomically switch a stable symlink/pointer. If the IDE does not follow pointer replacement reliably, use a clean dedicated projection worktree, enforce non-authoring permissions/policy, and update it fast-forward-only. [SOURCE: https://github.com/kubernetes/git-sync]

“Always current” must mean: after remote verification, the projection acknowledges the same OID or a newer descendant within a configured service-level objective. It cannot mean an editable dirty checkout is unconditionally rewritten.

## 8. Safety, Recovery, and Rollback

### Reachability and transaction states

Minimum durable states:

`observed → source-pinned → queued → integrating → candidate-pinned → push-sent → remote-verified → projected → session-acked → released`

Exceptional states:

- `retryable-transport`: process exit, credential expiry, fetch failure, ref race, timeout, or ambiguous push response. Retain pins, observe the remote, and resume idempotently.
- `conflict-quarantined`: textual conflict, dependency violation, or semantic-validator failure. Retain pins and diagnostics; do not move the shared branch or projection.

Before acknowledging capture, create `refs/autosync/pending/<tx>/source`. Before pushing, create a candidate pin. An OID written only in an application journal is not a Git reachability root; reflogs expire and stash entries can become pruneable. [SOURCE: https://git-scm.com/docs/git-update-ref] [SOURCE: https://git-scm.com/docs/git-reflog] [SOURCE: https://git-scm.com/docs/git-gc]

### Remote acknowledgement

After a lost or ambiguous push response, query/fetch the exact remote ref. If it equals the candidate or a newer tip contains the candidate, record success; otherwise retain pins and reintegrate against the new tip. Do not blindly push again. [SOURCE: https://git-scm.com/docs/git-push] [SOURCE: https://git-scm.com/docs/git-ls-remote]

### Autostash

Autostash is excluded from the unattended path. `stash create` can produce a dangling commit until stored, `stash pop` may conflict, and rebase autostash can require non-trivial conflict handling. If an explicit recovery snapshot is ever added, immediately pin its OID under a transaction ref and use `apply` before any eventual drop. [SOURCE: https://git-scm.com/docs/git-stash] [SOURCE: https://git-scm.com/docs/git-rebase]

### Rollback

Publish a revert from the current shared tip through the same queue. Never reset or force-push the shared branch backward. Revert conflicts become quarantined transactions. [SOURCE: https://git-scm.com/docs/git-revert]

## 9. Automation Surface

| Surface | Correct authority |
|---|---|
| Client Git hooks | Optional enqueue/notification hints only; hooks are configurable, may be non-executable, and several are bypassable with `--no-verify`. [SOURCE: https://git-scm.com/docs/githooks] |
| Server receive hooks / protected branch | Authoritative rejection of unauthorized/non-fast-forward writes; not a queue or recovery engine. [SOURCE: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches] |
| Launch wrapper | Admission: create/validate worktree, assign IDs, register session, verify daemon. |
| Background daemon | Authoritative queue, journal, authentication, fetch, integration, push retry/reconciliation, projection refresh, and crash replay. |
| Remote bot | Optional publisher variant only if it implements the same durable IDs, pins/pending store, queue, and acknowledgement semantics; still needs a local capture/projection bridge. |

Use a supervisor to restart the daemon. Hooks and wrapper processes must never keep a second transaction truth. GitHub App/webhook deployments require scoped short-lived tokens, authenticated webhook delivery, asynchronous handling, and idempotency by delivery/transaction ID. [SOURCE: https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app] [SOURCE: https://docs.github.com/en/webhooks/using-webhooks/best-practices-for-using-webhooks]

## 10. Conflict Handling and Avoidance

1. Use a machine-readable path ownership manifest and queue-time path reservations.
2. Derive changed paths with `diff-tree`; simulate integration with `merge-tree --write-tree` against the latest verified base without checking out the shared branch. Re-run preflight when the base changes. [SOURCE: https://git-scm.com/docs/git-diff-tree] [SOURCE: https://git-scm.com/docs/git-merge-tree]
3. Prefer per-session subtrees or unique-ID additive records for high-concurrency generated content.
4. Generate shared indexes/manifests centrally from additive inputs rather than letting sessions edit the same derived file.
5. Run semantic validators after textual merge simulation; disjoint paths do not prove semantic independence.
6. Quarantine conflicts with source/candidate OIDs, base OID, changed paths, validator output, and dependency metadata.
7. Let later transactions bypass a quarantine only when dependency and changed-path proofs establish independence; otherwise preserve order.

CODEOWNERS can route review but is not a lock or reservation system. [SOURCE: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners]

## 11. Recommendations

1. Build the publisher as the only credentialed shared-branch writer.
2. Freeze the no-touch worktree invariant in tests before adding automation.
3. Define the journal schema, idempotency key, live pin lifecycle, and recovery transitions before selecting a service framework.
4. Make remote observation—not local process exit—the acknowledgement source of truth.
5. Keep the IDE projection non-authoring and OID-addressed.
6. Enforce branch protection/receive policy against force and unauthorized direct writes.
7. Treat semantic quarantine as an honest product state, distinct from infrastructure retry telemetry.
8. Start with strict FIFO; add dependency/path-proven bypass only after the safety suite passes.
9. Use hosted queues/Gerrit for checks or review only when their latency and conflict-removal semantics fit the workflow.
10. Benchmark freshness and throughput in the real repository before committing to numeric targets.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Uncoordinated direct pushes | The second divergent writer receives a non-fast-forward rejection after the first advances the branch | [SOURCE: https://git-scm.com/docs/git-push] | 1 |
| Force-pushing the shared branch | Disables ancestry safety and can erase concurrent commits | [SOURCE: https://git-scm.com/docs/git-push] | 1, 3, 5 |
| Per-session auto-rebase as the primary publication path | Optimistic race remains; conflicts rewrite/stall active sessions | [SOURCE: https://git-scm.com/docs/git-rebase] | 1, 2 |
| Hosted merge queue as the whole solution | Conflicted/failed entries are removed; no local dirty-state or projection control | [SOURCE: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue] | 1, 5 |
| One shared working tree | Shares exactly the files and index requiring isolation | [SOURCE: https://git-scm.com/docs/git-worktree] | 2 |
| Long-lived `clone --shared`/`--reference` as isolation | Source pruning can corrupt borrowers | [SOURCE: https://git-scm.com/docs/git-clone] | 2 |
| Watch-triggered rebase/autostash/reset in sessions | Mutates session history/index/files and can conflict | [SOURCE: https://git-scm.com/docs/git-pull] [SOURCE: https://git-scm.com/docs/git-reset] | 2, 3 |
| Journal-only OID retention | Application files are not Git reachability roots | [SOURCE: https://git-scm.com/docs/git-gc] [SOURCE: https://git-scm.com/docs/git-fsck] | 3 |
| Reflog-only retention | Reflogs expire and are policy-dependent | [SOURCE: https://git-scm.com/docs/git-reflog] | 3 |
| Hook-only or wrapper-only publisher | No single durable recovery/ordering owner; client hooks can be bypassed | [SOURCE: https://git-scm.com/docs/githooks] | 4 |
| CODEOWNERS as path locking | Routes review but does not reserve paths or serialize writers | [SOURCE: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners] | 4 |
| Syncthing conflict copies as Git integration | Preserves file conflicts but has no ancestry or semantic validation | [SOURCE: https://docs.syncthing.net/users/syncing.html] | 5 |
| `git-auto-sync` or Git Town as multi-session authority | Both mutate/stash an authoring workspace and lack the required durable multi-session publisher | [SOURCE: https://github.com/GitJournal/git-auto-sync] [SOURCE: https://www.git-town.com/commands/sync.html] | 5 |
| Arbitrary same-intent auto-merge guarantee | Git detects textual conflicts but cannot infer arbitrary semantic intent | [SOURCE: https://git-scm.com/docs/git-merge-tree] | 1, 4, 5 |

## Divergence Map

- Divergent convergence mode was not enabled; no pivot Council ran.
- Saturated directions: uncoordinated push, force-push rollback, shared working tree, unattended session autostash/rebase/reset, hook-only authority, and drop-in single-tool adoption.
- Productive directions: serialized publication, linked-worktree isolation, scratch-index construction, live reachability refs, remote reconciliation, immutable projection, and semantic quarantine.
- Failed pivots: none.
- Audited overrides: none.
- Remaining frontier: journal storage/`fsync` implementation, real IDE pointer-refresh behavior, repository-specific semantic validators, cross-machine session isolation, and empirical latency/throughput limits.

## 12. Open Questions

All five research questions are answered. Implementation must still decide and test:

- the journal storage engine and exact durability primitive;
- whether the target IDE handles atomic symlink/pointer replacement reliably;
- the initial path ownership/dependency schema;
- repository-specific semantic validators and adjudication workflow;
- the remote enforcement mechanism available on the chosen host;
- the measured projection freshness and publication throughput targets.

## 13. Existing Art Comparison

| System | Useful mechanism | Why it is not the full solution |
|---|---|---|
| Kubernetes `git-sync` | Immutable revision worktrees, atomic symlink publication, idempotent hook posture | Read-side sync only; no authoring capture, commit creation, multi-writer integration, or push serialization. [SOURCE: https://github.com/kubernetes/git-sync] |
| GitJournal `git-auto-sync` | File-watch trigger coalescing and background automation | Pull/rebase conflicts stop sync; mutates one authoring repository; no durable multi-session queue. [SOURCE: https://github.com/GitJournal/git-auto-sync] |
| `mob` | Explicit temporary branch and handoff boundary | Serial human handoff, not parallel autonomous integration. [SOURCE: https://github.com/remotemobprogramming/mob] |
| Syncthing | Temporary-file materialization and preservation of conflicting versions | No Git ancestry, commits, validation, or shared-branch authority. [SOURCE: https://docs.syncthing.net/users/syncing.html] |
| GitHub merge queue | Speculative predecessor-set validation and hosted checks | Removes conflicts/failures; lacks local session capture and projection. [SOURCE: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue] |
| Git Town | Branch-role taxonomy, explicit sync plan, undo metadata | User-invoked mutable workspace workflow using stash/restore, not a no-touch daemon. [SOURCE: https://www.git-town.com/commands/sync.html] |
| Gerrit | Pending changes/patch sets, submission gates, immutable audit trail | Conflicts still require resolution; no local uncommitted-state or IDE controller. [SOURCE: https://gerrit-review.googlesource.com/Documentation/intro-user.html] [SOURCE: https://gerrit-review.googlesource.com/Documentation/concept-changes.html] |

## 14. Testable Acceptance Conditions

1. **Concurrent publication:** submit at least 32 disjoint contributions from the same base. The final remote tip contains every acknowledged source exactly once in one descendant chain; no session receives a non-fast-forward task.
2. **Ref-race retry:** advance the remote between integration and push. The daemon rebuilds against the observed tip and publishes once without force or lost ancestry.
3. **Textual conflict:** incompatible same-line edits yield one publish and one durable quarantine with both OIDs and conflict paths; no false auto-merge claim.
4. **Semantic conflict:** textually clean changes failing a cross-file validator quarantine without shared-tip or projection movement for that transaction.
5. **Crash matrix:** inject `SIGKILL` before and after every durable state edge; restart converges idempotently with no duplicate publication or early pin deletion.
6. **No lost uncommitted work:** seed staged, unstaged, untracked, ignored, renamed, and deleted sentinels in every session. Hash files, index tree, `HEAD`, and porcelain status before/after; require equality.
7. **Ambiguous acknowledgement:** drop the client response after server ref update; restart observes remote containment and records exactly one publication.
8. **Operator-visible divergence:** routine ref races, retries, credential refresh, and ambiguous acknowledgement appear only in internal telemetry. Only semantic quarantine exposes adjudication, and it never dirties a worktree/projection.
9. **IDE freshness/atomicity:** after remote verification, the projection acknowledges that OID or a newer descendant within the configured SLA; repeated sampling never observes a mixed tree.
10. **Projection failure:** dirty/remove the projection and interrupt pointer switching; the controller preserves the last verified view or rebuilds without touching sessions.
11. **Forward rollback:** publish A, B, then request rollback of A while C arrives. Final history descends from B, contains C once, and includes a revert instead of backward movement.
12. **Force prohibition:** policy rejects `--force`, `--force-with-lease`, and `+` refspecs; remote enforcement rejects an injected non-fast-forward update; publisher audit shows zero force attempts.
13. **Reachability under GC:** expire reflogs and aggressively prune at every crash point; each non-released transaction's source/candidate resolves through a live ref or verified remote ancestry.
14. **Quarantine ordering:** with a conflict at queue head, one dependent and one provably independent item follow; only the independent item may bypass, with dependency/path proof journaled.
15. **Hook bypass:** disable/bypass every client hook and submit through the capture API; authoritative invariants still hold.
16. **Credential expiry:** expire credentials during push; pins remain, credentials refresh, and the transaction resumes without operator intervention or duplicate publication.

The proposed initial projection p95 target is under two seconds on a healthy local network, but this number is provisional until benchmarked against the real repository, validators, host, and IDE.

## 15. Implementation Boundaries

- The publisher may read session refs and Git objects; it may not mutate authoring worktrees.
- Capture accepts committed source OIDs. Uncommitted state remains in the isolated worktree until the session creates an explicit checkpoint.
- The publisher's scratch index/disposable worktree and temporary refs are internal implementation state.
- All user-visible branch/projection states come from verified remote ancestry.
- Remote service features are adapters, not transaction truth, unless the remote service is deliberately chosen as the publisher and satisfies the same state contract.
- Deleting a session worktree/branch is a separate lifecycle action after durable acknowledgement; forced deletion is never routine cleanup.

## 16. Trade-offs, Risks, and Convergence Report

### Trade-offs and risks

- Serialization favors correctness and simple recovery over maximum publish throughput.
- Worktrees are efficient on one host but share refs/config/object storage; independent clones are stronger across trust or machine boundaries.
- Strict FIFO can head-of-line block on quarantine; proven-independent bypass increases scheduler complexity.
- Immutable projection switching is atomic at the pointer level, but IDE watcher behavior may require an adapter or stable-worktree fallback.
- Semantic validators reduce silent mismerges but can produce false positives and add latency.
- A durable journal cannot be atomically committed with a hosted ref update, so reconciliation is a permanent design requirement.

### Convergence report

- Stop reason: `maxIterationsReached`
- Iterations completed: 5 / 5
- Questions answered: 5 / 5
- New-information ratios: `1.000, 1.000, 0.875, 0.929, 0.957`
- Mean new-information ratio: `0.952`
- Last-three rolling mean: `0.920`
- Convergence threshold: `0.05`
- Early convergence handling: telemetry only, per `max-iterations` stop policy
- Quality guards: source diversity passed; focus alignment passed; no finding depends on a single weak source
- Graph convergence: not applicable; no graph events were emitted
- State corruption: none

## 17. References

### Git documentation

- [SOURCE: https://git-scm.com/docs/git-push]
- [SOURCE: https://git-scm.com/docs/git-receive-pack]
- [SOURCE: https://git-scm.com/docs/git-fetch]
- [SOURCE: https://git-scm.com/docs/git-rebase]
- [SOURCE: https://git-scm.com/docs/git-worktree]
- [SOURCE: https://git-scm.com/docs/git-clone]
- [SOURCE: https://git-scm.com/docs/git-merge]
- [SOURCE: https://git-scm.com/docs/git-pull]
- [SOURCE: https://git-scm.com/docs/git-reset]
- [SOURCE: https://git-scm.com/docs/git-read-tree]
- [SOURCE: https://git-scm.com/docs/git-write-tree]
- [SOURCE: https://git-scm.com/docs/git-commit-tree]
- [SOURCE: https://git-scm.com/docs/git-update-ref]
- [SOURCE: https://git-scm.com/docs/git-merge-tree]
- [SOURCE: https://git-scm.com/docs/git-diff-tree]
- [SOURCE: https://git-scm.com/docs/git-stash]
- [SOURCE: https://git-scm.com/docs/git-reflog]
- [SOURCE: https://git-scm.com/docs/git-ls-remote]
- [SOURCE: https://git-scm.com/docs/git-revert]
- [SOURCE: https://git-scm.com/docs/git-gc]
- [SOURCE: https://git-scm.com/docs/git-fsck]
- [SOURCE: https://git-scm.com/docs/githooks]
- [SOURCE: https://git-scm.com/docs/gitcredentials]

### Hosted services and existing art

- [SOURCE: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue]
- [SOURCE: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches]
- [SOURCE: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners]
- [SOURCE: https://docs.github.com/en/webhooks/using-webhooks/best-practices-for-using-webhooks]
- [SOURCE: https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app]
- [SOURCE: https://github.com/kubernetes/git-sync]
- [SOURCE: https://github.com/GitJournal/git-auto-sync]
- [SOURCE: https://github.com/remotemobprogramming/mob]
- [SOURCE: https://docs.syncthing.net/users/syncing.html]
- [SOURCE: https://www.git-town.com/commands/sync.html]
- [SOURCE: https://gerrit-review.googlesource.com/Documentation/intro-user.html]
- [SOURCE: https://gerrit-review.googlesource.com/Documentation/concept-changes.html]

### Packet evidence

- `iterations/iteration-001.md`
- `iterations/iteration-002.md`
- `iterations/iteration-003.md`
- `iterations/iteration-004.md`
- `iterations/iteration-005.md`
- `resource-map.md`
