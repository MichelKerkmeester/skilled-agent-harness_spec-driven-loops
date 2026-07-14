# Iteration 5: Existing Art, Default Architecture, and Acceptance Contract

## Focus

This final evidence iteration compared seven existing systems against the packet's exact problem: many concurrent AI sessions must contribute continuously to one fast-forward-only shared branch without mutating active dirty worktrees or exposing routine publication races to the operator. It then synthesized all five iterations into a default architecture, an exact semantic-conflict state transition, and testable acceptance conditions. “Zero operator-visible divergence blockers” is treated as containment of transport and concurrency mechanics, not a claim that arbitrary overlapping intent can always be merged correctly.

## Findings

1. **Existing art supplies separable mechanisms, not the complete system.** No examined tool simultaneously isolates dirty authoring sessions, durably captures contributions, serializes one shared-branch writer, reconciles ambiguous remote acknowledgement, quarantines semantic conflicts, and atomically refreshes a read projection.

   | Existing art | What it solves | What it does not solve for this packet | Mechanism to borrow |
   |---|---|---|---|
   | Kubernetes `git-sync` | Polls/fetches one upstream revision and publishes a complete checkout through a versioned worktree plus atomic symlink change; post-sync hooks must tolerate duplicate invocation | No authoring capture, commit creation, multi-writer integration, push serialization, or semantic-conflict policy | Immutable revision directories, atomic projection pointer, idempotent post-refresh notification |
   | GitJournal `git-auto-sync` | Watches one repository, automatically commits, pulls/rebases, and pushes | A rebase conflict aborts and stops synchronization; it mutates the watched authoring repository and has no durable multi-session queue | Trigger coalescing and supervised background execution only |
   | `mob` | Explicit, serial code handover via a temporary branch and WIP commits, then returns staged work to the main branch | Deliberately serial human handoff, not parallel authorship, autonomous conflict adjudication, or final publication authority | Explicit handoff boundary and temporary contribution ref |
   | Syncthing | Multi-device block transfer, convergent file-version tracking, temporary destination files, and preservation/propagation of conflicting copies | No Git ancestry, commits, validation, or semantic choice between conflicting edits | Preserve both conflict inputs, atomic materialization, unresolved conflict as a first-class artifact |
   | GitHub merge queue | FIFO speculative groups against the latest base plus earlier queued changes, with required checks before merge | PR/check lifecycle, hosted-only visibility, and removal of conflicted/failed entries; no local dirty-work capture or IDE refresh | Validate a candidate against the actual predecessor set; batch only when the combined group passes |
   | Git Town | Synchronizes local branch hierarchies, stashes/restores dirty changes, pushes, and offers undo | Mutates local authoring branches and relies on stash/restore; it is a user-invoked workspace workflow, not a durable publisher | Explicit transaction plan/undo metadata and branch-role taxonomy, not session mutation |
   | Gerrit | Stores pending changes and patch sets separately from the target branch, applies submit requirements, and supports configurable submission strategies | Conflicted changes still require rebase/resolution; no local uncommitted-work durability or read-projection controller | Server-visible pending store, replaceable candidate versions, submission gates, immutable audit trail |

   [SOURCE: https://github.com/kubernetes/git-sync] [SOURCE: https://github.com/GitJournal/git-auto-sync] [SOURCE: https://github.com/remotemobprogramming/mob] [SOURCE: https://docs.syncthing.net/users/syncing.html] [SOURCE: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue] [SOURCE: https://www.git-town.com/commands/sync.html] [SOURCE: https://gerrit-review.googlesource.com/Documentation/intro-user.html]

2. **The concrete default is a local supervised single-writer publisher with four isolated planes.** The authoring plane gives every AI session its own linked worktree and branch; the coordinator never mutates its files, index, or `HEAD`. The capture plane accepts only a committed source OID, creates `refs/autosync/pending/<tx>/source`, and fsyncs an append-only transaction record before acknowledgement. The integration plane has one publisher that fetches the authoritative remote tip, reserves paths/dependencies, runs `merge-tree` and semantic validators, constructs a candidate in a scratch index or disposable worktree, pins it, and sends only a fast-forward push from the expected remote base. The projection plane materializes verified remote revisions as immutable worktrees and atomically switches a stable pointer, then emits an idempotent IDE-refresh notification. [INFERENCE: iterations 1-4 established serialization, no-touch worktrees, live reachability refs, remote reconciliation, and quarantine; git-sync independently demonstrates the immutable-worktree plus atomic-pointer projection mechanism.]

3. **The transaction state machine separates hidden retry from semantic quarantine.** Its minimum durable states are `observed → source-pinned → queued → integrating → candidate-pinned → push-sent → remote-verified → projected → session-acked → released`, plus `retryable-transport` and `conflict-quarantined`. Process exits, credential expiry, ref races, timeouts, and ambiguous push responses enter `retryable-transport`: keep both pins, observe the remote ref, and resume idempotently without surfacing a divergence task. A textual merge conflict, dependency violation, or semantic-validator failure enters `conflict-quarantined`: retain both pins and diagnostics, do not advance the shared branch or projection, do not mutate any session, and require a new linked resolution transaction. Later transactions may pass only when declared dependencies and changed-path reservations prove independence; otherwise they remain ordered behind the quarantine. [SOURCE: https://docs.syncthing.net/users/syncing.html] [SOURCE: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue] [SOURCE: https://gerrit-review.googlesource.com/Documentation/intro-user.html] [INFERENCE: transport uncertainty is mechanically observable and retryable, while semantic intent is not.]

4. **The irreducible trade-offs are explicit.** Serialization removes participating-writer races but caps publication throughput at one ordered commit boundary; safe batching recovers throughput only when the whole merge group validates. A non-authoring projection can be current and disposable, whereas an editable IDE checkout cannot also accept unconditional automated refresh without dirty-tree conflicts. Quarantine prevents lost or silently mismerged work but cannot guarantee every contribution reaches the shared branch without adjudication. Atomic symlink projection prevents partial trees, but some IDEs need an explicit file-watcher refresh or a stable-worktree fallback; freshness therefore needs an SLA and observed acknowledgement rather than “instant” wording. [SOURCE: https://github.com/kubernetes/git-sync] [SOURCE: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue] [SOURCE: https://www.git-town.com/commands/sync.html] [INFERENCE: authoring mutability, semantic correctness, strict ordering, and unlimited throughput cannot all be maximized simultaneously.]

5. **Hosted systems are optional enforcement/adjudication backends, not the default local control plane.** GitHub's queue or Gerrit's pending changes can supply required checks, review state, and a hosted audit trail, but both externalize conflict resolution and lack access to local uncommitted files and IDE state. A hosted variant is valid only when a local capture/projection bridge remains and the remote service implements the same durable IDs, pending refs, idempotency, and acknowledgement reconciliation. [SOURCE: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue] [SOURCE: https://gerrit-review.googlesource.com/Documentation/intro-user.html] [INFERENCE: hosted submission state and local filesystem safety have different authority boundaries.]

6. **Candidate acceptance tests must verify outcomes under concurrency and faults, not command success.**

   1. **Concurrent publication:** submit at least 32 contributions from the same base with disjoint unique sentinels; the final remote tip contains every acknowledged source exactly once in one descendant chain, and no session receives a non-fast-forward task.
   2. **Ref-race retry:** advance the remote between integration and push; the publisher rebuilds against the observed tip and publishes once without force, lost ancestry, or operator-visible divergence.
   3. **Overlapping textual conflict:** submit incompatible same-line edits; one may publish, while the other becomes `conflict-quarantined` with both OIDs and conflict paths retained. The system never claims successful auto-merge.
   4. **Semantic conflict:** submit textually clean changes that fail a cross-file invariant validator; require the same quarantine behavior, with no shared-tip or projection movement for that transaction.
   5. **Crash recovery:** inject `SIGKILL` before and after every durable state edge; restart converges to one valid state, never duplicates publication, and never releases a pin before remote verification plus durable acknowledgement.
   6. **No lost uncommitted work:** seed staged, unstaged, untracked, ignored, rename, and deletion sentinels in every session; hash files, index tree, `HEAD`, and porcelain status before load/fault tests and require byte-for-byte/state equality afterward.
   7. **Ambiguous push acknowledgement:** sever the response after the server updates the ref; restart observes remote containment and records exactly one publication rather than pushing a rewritten duplicate.
   8. **Visible divergence:** instrument user-facing logs/UI; routine ref races, fetch retries, credential refresh, and ambiguous acknowledgement appear only as internal retry telemetry, while only `conflict-quarantined` exposes an adjudication item and never dirties the IDE projection.
   9. **IDE freshness and atomicity:** after remote verification, require the projection's reported OID and sampled files to switch from one complete revision to the next within the configured SLA; repeated sampling never observes a mixed tree, and the IDE refresh acknowledgement references that OID.
   10. **Projection failure:** make the current projection dirty, remove it, and interrupt pointer switching; the controller preserves the last verified view or rebuilds a disposable one without touching any authoring worktree.
   11. **Forward-only rollback:** publish A then B, request rollback of A, and concurrently submit C; the final tip descends from B, contains C exactly once in serialized order, and includes a revert commit rather than backward ref movement.
   12. **Force-push prohibition:** reject commands containing `--force`, `--force-with-lease`, or a `+` refspec at the publisher policy layer, and require branch protection/receive policy to reject an injected non-fast-forward update; audit logs show zero force attempts by the publisher.
   13. **Reachability under GC:** expire reflogs and run aggressive prune at every crash point; each non-released transaction's source and candidate still resolve through a live namespaced ref or verified remote ancestry.
   14. **Quarantine ordering:** place a conflict at the queue head, then submit one dependent and one provably independent change; only the independent change may pass, and the journal contains the dependency/path proof used for bypass.

   [INFERENCE: these tests directly operationalize the safety, crash, visibility, freshness, rollback, and conflict boundaries established across iterations 1-5.]

7. **Acceptance is conjunctive, and “always current” needs a measurable definition.** A contribution is complete only when the remote shared tip contains the candidate, the journal durably records verification, the projection acknowledges the same or a newer descendant OID, and the session acknowledgement is durable. Proposed initial service targets are configurable: projection p95 freshness under 2 seconds on a healthy local network, retry recovery without operator action, and zero mutation of session state. Any target not benchmarked in the implementation environment remains provisional. [SOURCE: https://github.com/kubernetes/git-sync] [INFERENCE: exact latency depends on repository size, network, validators, and IDE behavior; correctness can be fixed now, while the numeric SLA must be validated empirically.]

## Ruled Out

- Adopting `git-auto-sync` or Git Town as the multi-session authority: both operate by mutating and potentially stashing an authoring workspace.
- Treating Syncthing-style last-writer selection or conflict copies as Git integration: preservation is borrowable, but ancestry and semantic validation are absent.
- Treating GitHub merge queue or Gerrit alone as the complete solution: neither protects local dirty work nor refreshes the IDE projection.
- Claiming arbitrary overlapping edits always auto-merge: textual and semantic conflicts have a durable quarantine path instead.

## Dead Ends

- Searching for a single drop-in tool is exhausted; the required guarantees cross local filesystem, Git object reachability, hosted ref publication, and IDE observation boundaries.
- “Always current” without an OID-linked refresh acknowledgement and latency budget is not testable.
- Hiding semantic quarantine as an infinite retry would turn an honest conflict into silent queue starvation.

## Edge Cases

- Ambiguous input: “existing art” includes both Git-native workflows and filesystem synchronization. They were compared by mechanism, not treated as interchangeable products.
- Contradictory evidence: Git Town describes sync/undo without losing changes, while this packet forbids automated mutation of active sessions. The claims apply to different boundaries: Git Town protects a user-invoked mutable workflow; this architecture requires a coordinator no-touch invariant.
- Missing dependencies: None. Official project repositories and documentation covered all named systems.
- Partial success: None. The fifth question is answered; numeric freshness and throughput targets remain provisional until implementation benchmarks exist.

## Sources Consulted

- https://github.com/kubernetes/git-sync
- https://github.com/GitJournal/git-auto-sync
- https://github.com/remotemobprogramming/mob
- https://docs.syncthing.net/users/syncing.html
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue
- https://www.git-town.com/commands/sync.html
- https://gerrit-review.googlesource.com/Documentation/intro-user.html
- https://gerrit-review.googlesource.com/Documentation/concept-changes.html
- iterations/iteration-001.md
- iterations/iteration-002.md
- iterations/iteration-003.md
- iterations/iteration-004.md

## Assessment

- New information ratio: 0.957
- Questions addressed: What does existing art prove, and what default architecture, trade-offs, and testable acceptance conditions follow?
- Questions answered: What does existing art prove, and what default architecture, trade-offs, and testable acceptance conditions follow?

## Reflection

- What worked and why: Comparing mechanism boundaries rather than product labels made the synthesis concrete: atomic projections, pending-change stores, validation groups, temporary contribution refs, and conflict preservation each have a clear owner.
- What did not work and why: Broad discovery did not reliably surface the canonical `git-sync` or `mob` README, so direct official repository retrieval was required. No named product met the end-to-end contract.
- What I would do differently: In implementation planning, define the journal schema and OID-linked projection acknowledgement before selecting the supervisor or hosted backend.

## Recommended Next Focus

The five-iteration hard maximum is reached. Run the mandated synthesis/reducer pass next; do not start a sixth evidence iteration. The synthesis should freeze the four-plane default, transaction states, exact quarantine transition, and acceptance suite, while marking the 2-second freshness target as provisional pending benchmarks.

