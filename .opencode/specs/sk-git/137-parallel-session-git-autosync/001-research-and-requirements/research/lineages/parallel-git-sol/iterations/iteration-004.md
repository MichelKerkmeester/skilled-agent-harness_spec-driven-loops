# Iteration 4: Automation Authority and Conflict Quarantine

## Focus
This iteration compared Git hooks, a supervised background publisher, a session launch wrapper, and a remote-side bot for unattended AI sessions. It also examined checkout-free conflict preflight, path partitioning, per-session subtrees, additive-only changes, and quarantine of unavoidable semantic conflicts. “Remote-side bot” is interpreted broadly enough to cover a hosted GitHub App and a self-hosted receive-side service; those have different enforcement reach, which is called out below.

## Findings
1. **One supervised publisher should own every stateful publication function.** The queue and append-only transaction journal belong together because ordering, retry, acknowledgement, and crash recovery are one state machine. The same publisher should broker authentication, fetch the authoritative remote tip, run integration in a disposable workspace or scratch index, serialize compare-and-swap pushes, reconcile ambiguous push outcomes, and refresh the clean IDE projection. Hooks may enqueue hints and the launch wrapper may register sessions, but neither should advance durable transaction state. A remote bot can replace the local publisher only if it also implements the same durable queue, journal, idempotency, and recovery contract; it still needs a local bridge for session capture and IDE refresh. [INFERENCE: Git hooks are point-in-command callbacks, Git credentials are acquired per remote operation through helpers, GitHub webhook consumers must handle deliveries asynchronously and idempotently, and prior packet evidence requires transaction recovery across process and transport failures.]

   | Capability | Authoritative owner | Supporting surfaces |
   |---|---|---|
   | Queue and ordering | Supervised publisher | Hook/wrapper submits immutable transaction IDs |
   | Durable journal | Supervised publisher | None; hooks must not maintain a second truth |
   | Authentication | Publisher credential broker or hosted App | Git credential helper / short-lived App installation token |
   | Fetch and integration | Supervised publisher | Remote bot may perform both if it is the publisher |
   | Push retry and remote reconciliation | Supervised publisher | Protected branch or receive hook enforces policy |
   | IDE projection refresh | Local supervised publisher | Launch wrapper locates/registers the projection |
   | Crash recovery | Supervisor restarts publisher; publisher replays journal | Durable refs remain the Git reachability boundary |

2. **Client-side Git hooks are advisory, not authoritative.** Git runs hooks only at documented command points; non-executable hooks are ignored, the hook directory is configurable, and several commit hooks are bypassable with `--no-verify`. `pre-push` can reject one invocation, while post hooks are notification-only and cannot reverse completed work. Server-side `pre-receive`/`update` hooks are authoritative for a self-hosted receive path because they can reject ref updates, but they still do not provide the publisher's queue, journal, local session visibility, projection refresh, or crash-recovery state machine. On a hosted service, protected-branch rules are the corresponding enforcement boundary. [SOURCE: https://git-scm.com/docs/githooks] [SOURCE: https://git-scm.com/docs/git-push] [SOURCE: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches]

3. **The launch wrapper owns admission, not steady-state synchronization.** It should allocate or validate the session worktree and branch, assign a stable session/transaction identity, verify that the publisher service is reachable, and register the session. Publication may outlive the launching shell and needs retries after later network or process failures, so putting fetch/integrate/push logic in the wrapper creates an unsupervised second publisher and loses recovery once the wrapper exits. [INFERENCE: the wrapper has a launch-scoped lifetime, while the queue/journal state machine must survive session and transport lifetimes.]

4. **A remote-side bot is useful for enforcement and hosted execution, but webhook delivery is not a transaction journal.** A GitHub App installation token can be permission- and repository-scoped and is regenerated after expiry; Git's credential-helper interface similarly lets a publisher acquire credentials without distributing them to each session. GitHub's webhook guidance requires secret validation, fast acknowledgement with asynchronous work, and checking delivery IDs to avoid duplicate processing. Therefore a hosted bot needs durable idempotency and its own queue before it can be the publisher. It cannot discover a local session's uncommitted files or refresh a local IDE projection, and branch protection can reject nonconforming writes but cannot integrate them. [SOURCE: https://git-scm.com/docs/gitcredentials] [SOURCE: https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app] [SOURCE: https://docs.github.com/en/webhooks/using-webhooks/best-practices-for-using-webhooks] [SOURCE: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches]

5. **Conflict preflight does not require checking out the shared branch.** `git merge-tree --write-tree <base> <candidate>` performs a real merge without touching the working tree or index, reports conflicted-file information, and uses a non-zero status for conflicts. `git diff-tree -r --name-only <base> <candidate>` can derive the candidate's changed-path set directly from trees. The publisher can fetch, simulate against the latest remote tip, compare that path set with ownership and in-flight reservations, then integrate only in a scratch index or disposable publisher worktree. The result is a preflight snapshot, not a lock: the publisher must revalidate after any base-tip change and immediately before its serialized push. [SOURCE: https://git-scm.com/docs/git-merge-tree] [SOURCE: https://git-scm.com/docs/git-diff-tree] [INFERENCE: a preflight result is valid for the exact pair of input trees and becomes stale when the shared tip changes.]

6. **Path ownership is an admission-control mechanism; CODEOWNERS is not mutual exclusion.** A machine-readable partition manifest plus queue-time path reservations can reject or defer overlapping writers before integration. GitHub CODEOWNERS automatically requests reviews and can be coupled to required owner approval, but it does not lock paths or serialize writers. Per-session subtrees make the partition structural, and additive-only records with unique IDs avoid same-path edits, but shared manifests, generated indexes, renames, and cross-tree invariants remain coordination points. Those shared artifacts should be generated by the publisher from additive inputs or handled as separately serialized transactions. [SOURCE: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners] [SOURCE: https://git-scm.com/docs/git-diff-tree] [INFERENCE: disjoint changed paths remove textual same-path overlap but do not prove semantic independence across files.]

7. **Unavoidable semantic conflicts must be quarantined as transaction state, not exposed as branch divergence.** When merge simulation conflicts or semantic validators fail, the publisher should retain the source/candidate pins, journal `conflict-quarantined`, attach machine-readable conflict paths and validator output, and leave the shared branch and every session worktree untouched. Independent queued items may pass the quarantined item only when declared dependencies and changed-path reservations prove independence; otherwise strict FIFO causes head-of-line blocking. This preserves “zero operator-visible divergence blockers” as an infrastructure property—the IDE remains on a clean published tip and sessions are not forced into rebase/conflict state—while honestly retaining a blocked transaction for later automated regeneration or explicit adjudication. [SOURCE: https://git-scm.com/docs/git-merge-tree] [INFERENCE: Git can identify textual merge conflicts but cannot decide arbitrary semantic intent; quarantine contains that uncertainty without rewriting or dirtying user-visible worktrees.]

## Ruled Out
- A hook-only publisher: hooks are command-scoped, configurable/bypassable on clients, and lack one durable recovery owner.
- A launch-wrapper-only publisher: its process lifetime does not cover delayed retries, remote ambiguity, or crash replay.
- CODEOWNERS as a path lock: it routes review and approval; it does not reserve paths or prevent concurrent edits.
- Blindly skipping a quarantined FIFO head: safe continuation requires explicit dependency and changed-path independence, not queue convenience.

## Dead Ends
- Making client hooks authoritative is structurally incompatible with unattended recovery and centralized ordering.
- Claiming that per-session subtrees or additive-only commits eliminate semantic conflicts is too strong; cross-file invariants and shared derived artifacts remain.

## Edge Cases
- Ambiguous input: “remote-side bot” could mean a self-hosted receive hook/service or a hosted GitHub App. Both were assessed; only a service with a durable publisher state machine can own publication.
- Contradictory evidence: none. Client hooks and receive-side enforcement have different authority boundaries rather than conflicting semantics.
- Missing dependencies: the generated freedesktop.org systemd manual returned HTTP 403; the authoritative systemd repository source was consulted instead. The ownership conclusion does not depend on a systemd-specific restart policy.
- Partial success: none. The automation-surface question is answered; specific default architecture and acceptance-test synthesis remains iteration 5 work.

## Sources Consulted
- https://git-scm.com/docs/githooks
- https://git-scm.com/docs/git-push
- https://git-scm.com/docs/gitcredentials
- https://git-scm.com/docs/git-merge-tree
- https://git-scm.com/docs/git-diff-tree
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app
- https://docs.github.com/en/webhooks/using-webhooks/best-practices-for-using-webhooks
- https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners
- https://github.com/systemd/systemd/blob/main/man/systemd.service.xml

## Assessment
- New information ratio: 0.929
- Questions addressed: Which automation surface and conflict-avoidance rules are reliable enough for unattended AI sessions?
- Questions answered: Which automation surface and conflict-avoidance rules are reliable enough for unattended AI sessions?

## Reflection
- What worked and why: separating authority by lifecycle exposed the design cleanly—hooks and wrappers are event surfaces, while a durable publisher owns every operation that must survive retries or crashes. Canonical Git plumbing documentation also provided a checkout-free preflight primitive.
- What did not work and why: the generated freedesktop.org systemd manual was inaccessible with HTTP 403. The upstream systemd repository was available, and the core conclusion is supervisor-agnostic.
- What I would do differently: iteration 5 should turn these ownership boundaries into an explicit default architecture, failure matrix, and measurable acceptance suite rather than gather more surface-specific mechanisms.

## Recommended Next Focus
Synthesize existing art into the default architecture and testable acceptance conditions. Reconcile the local supervised-publisher default with the remote-bot variant, specify the transaction/queue schema and conflict-quarantine lifecycle, and produce fault-injection tests for hooks bypass, duplicate webhooks, stale preflight, path-reservation races, semantic conflicts, publisher restarts, credential expiry, ambiguous push acknowledgement, and projection refresh.
