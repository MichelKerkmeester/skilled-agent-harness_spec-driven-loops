# Iteration 3: Crash-Safe Publication and Forward Recovery

## Focus

This iteration stressed the safety and recovery contract for the serialized publisher: dirty session worktrees must remain untouched, accepted commits must remain reachable through crashes, publication acknowledgement must survive an ambiguous network result, temporary stashes must not become the durability boundary, and rollback must preserve every other session's history. The narrow interpretation is coordinator-level recovery; semantic conflict resolution remains deferred.

## Findings

1. **No-touch session invariant.** Once a session has a dedicated worktree/branch, the coordinator may read its ref and objects but must never run checkout, reset, pull, rebase, stash, clean, or conflict resolution in that worktree. Stash explicitly saves and then rolls back the working tree/index, while rebase changes `HEAD`, replays commits, and can stop with conflict state; those are mutations, not observation. Integration must occur in a disposable publisher worktree or scratch index. Acceptance: seed staged, unstaged, untracked, and ignored sentinels in two session worktrees; inject coordinator crashes at every publication phase; require byte-for-byte files, index tree, `HEAD`, and status to remain unchanged. [SOURCE: https://git-scm.com/docs/git-stash] [SOURCE: https://git-scm.com/docs/git-rebase] [INFERENCE: excluding every documented mutator from session worktrees is the only enforceable no-touch boundary.]

2. **Acceptance requires a real ref, not an OID in a journal.** Before the coordinator reports a session contribution accepted or permits session-branch cleanup, it must create a namespaced pin such as `refs/autosync/pending/<tx>/source` with `update-ref <ref> <oid> <zero>`; the expected-old value is compare-and-swap, and `--create-reflog` adds local recovery history. A journal string containing an OID is not a Git reachability root. Keep source and synthesized-candidate pins until the remote shared tip is verified to contain the candidate and the session acknowledgement is durable. Acceptance: kill after object creation, after pin creation, and after acknowledgement; run aggressive reflog expiry plus prune; every transaction that crossed “accepted” must still resolve through a live ref or the verified remote history. [SOURCE: https://git-scm.com/docs/git-update-ref] [SOURCE: https://git-scm.com/docs/git-gc] [SOURCE: https://git-scm.com/docs/git-fsck] [INFERENCE: Git's reachability traversal follows refs/reflogs, not arbitrary OIDs in an application file.]

3. **Local ref publication is CAS-transactional, but the application journal closes the cross-system gap.** `update-ref --stdin` supports `start`, `prepare`, `commit`, and `abort`; it locks all queued refs, verifies expected old OIDs, and changes none when a lock or comparison fails. Git also warns that concurrent readers may observe a subset of a multi-ref transaction. Therefore the coordinator needs an append-only, fsync-before-transition journal with at least transaction ID, source OID, candidate OID, expected shared-base OID, pin refs, phase, and remote verification result. On restart it scans both the journal and `refs/autosync/**`, treating unmatched pins as recoverable transactions rather than deleting them. Acceptance: SIGKILL at every state edge (`captured → pinned → integrated → push-sent → remote-verified → session-acked → released`) and require idempotent recovery without duplicate publication or early pin deletion. [SOURCE: https://git-scm.com/docs/git-update-ref] [INFERENCE: no Git ref transaction can atomically commit an external application journal and a hosted remote update, so explicit reconciliation is required.]

4. **Remote acknowledgement is a reconciled fact, not merely a process exit.** `push --porcelain` provides machine-readable per-ref status, and an atomic push either updates all requested remote refs or none when the server supports it. A coordinator can still lose the response after the server accepts the update. After any ambiguous transport failure, query the exact remote ref with `ls-remote`; if it equals the candidate, or a fetched newer tip contains the candidate, record remote verification instead of blindly retrying or rewriting. If the remote does not contain it, retain both pins and integrate again against the newly observed tip. Acceptance: cut the client connection after server-side ref update but before the client receives status; restart must classify the candidate as published exactly once. [SOURCE: https://git-scm.com/docs/git-push] [SOURCE: https://git-scm.com/docs/git-ls-remote] [SOURCE: https://git-scm.com/docs/git-fetch] [INFERENCE: remote ref observation disambiguates “server committed, response lost” from “server never committed.”]

5. **Autostash cannot be the durability mechanism.** A normal stash is anchored at `refs/stash`, with older entries in its reflog; `stash create` returns a dangling commit until `stash store` attaches it. A failed `stash pop` keeps the entry, and `rebase --quit` moves its temporary autostash into the stash list, but successful rebase can still end with non-trivial conflicts while reapplying it. The system should not autostash active sessions at all. If an explicit operator recovery ever snapshots dirty state, it must immediately pin the returned commit under a transaction-specific ref, verify the ref, and use `apply` before any eventual drop. Acceptance: interrupt between stash creation/storage/application and prove either the original worktree is untouched or a named ref resolves to the snapshot; no recovery may depend on an unreferenced stash-create OID. [SOURCE: https://git-scm.com/docs/git-stash] [SOURCE: https://git-scm.com/docs/git-rebase]

6. **Fetch/rebase failures are explicit states, never cleanup signals.** `fetch --atomic` makes local ref updates all-or-none. Rebase stops at the first conflicting commit; `--abort` restores the original branch, whereas `--quit` leaves `HEAD`, index, and working tree unchanged from the stopped state and saves an autostash to the stash list. An unattended publisher must record conflict/stopped state, preserve all pins, and either retry in a new disposable integration workspace or escalate; it must not skip a commit, delete the source branch, or touch the originating session. Acceptance: inject a content conflict and failures before/after fetch ref updates; require no shared-branch movement, no session mutation, and complete transaction evidence. [SOURCE: https://git-scm.com/docs/git-fetch] [SOURCE: https://git-scm.com/docs/git-rebase]

7. **Rollback is forward-only.** After a candidate is published, moving the shared ref backward—or force-pushing an alternative history—can erase later session commits. `git revert` records a new commit that reverses selected changes, so the coordinator must synthesize the revert from the current shared tip and publish it through the same serialized fast-forward path. Revert conflicts are a blocked transaction, not permission to reset history. Acceptance: publish A then B, request rollback of A, and require the resulting tip to descend from B while B remains reachable; a simultaneous C must either precede or follow the revert in the serialized log, never disappear. [SOURCE: https://git-scm.com/docs/git-revert] [SOURCE: https://git-scm.com/docs/git-push] [INFERENCE: a descendant revert preserves intervening ancestry, while backward ref movement does not.]

8. **Reachability must outlive reflog policy and garbage collection.** Reflogs record prior ref tips and aid recovery, but they expire; stash clear/drop similarly makes entries pruneable. Pending and accepted-but-unacknowledged objects therefore need live temporary refs, not reflog-only retention. The release precondition is conjunctive: remote verification proves the candidate reachable from the hosted shared tip, the durable journal records that fact, and the session acknowledgement/cleanup handoff is committed. Acceptance: configure immediate reflog expiry, run `gc`/`prune` at every injected crash point, use `fsck` to detect dangling objects, and require all non-released transactions to retain their source and candidate commits. [SOURCE: https://git-scm.com/docs/git-reflog] [SOURCE: https://git-scm.com/docs/git-stash] [SOURCE: https://git-scm.com/docs/git-gc] [SOURCE: https://git-scm.com/docs/git-fsck] [INFERENCE: a live namespaced ref makes retention independent of reflog age.]

## Ruled Out

- Recording an accepted commit's OID only in the crash journal: application files are not Git reachability roots.
- Using temporary autostash state as the unattended recovery boundary: it mutates the session and can end in conflicts or a dangling commit window.
- Treating a successful local command return as the only remote acknowledgement: a lost response after server acceptance is ambiguous until the remote ref is observed.
- Moving the shared ref backward for rollback: it can remove later session history.

## Dead Ends

- Reflog-only retention is time-bounded and configuration-dependent; it is useful forensic evidence, not the lifetime guarantee for accepted transactions.
- Retrying an ambiguous push before observing the remote can duplicate integration work and complicate acknowledgement; reconcile first.
- Backward rollback and force-push remain permanently excluded from the shared branch.

## Edge Cases

- Ambiguous input: The target spans both session-file durability and hosted publication. This iteration treats “accepted” as the coordinator's acknowledgement boundary; work not yet acknowledged remains protected by the untouched session branch/worktree.
- Contradictory evidence: None. Reflogs improve recovery but their documented expiry means they complement rather than replace live pins.
- Missing dependencies: One grouped official-document fetch stalled. Narrow canonical Git documentation requests recovered the required stash, rebase, fetch, push, ref, reflog, rollback, and GC evidence.
- Partial success: None. The main recovery question is answered; exact filesystem durability primitives for the application journal remain an implementation choice.

## Sources Consulted

- https://git-scm.com/docs/git-update-ref
- https://git-scm.com/docs/git-reflog
- https://git-scm.com/docs/git-show-ref
- https://git-scm.com/docs/git-stash
- https://git-scm.com/docs/git-rebase
- https://git-scm.com/docs/git-fetch
- https://git-scm.com/docs/git-push
- https://git-scm.com/docs/git-ls-remote
- https://git-scm.com/docs/git-revert
- https://git-scm.com/docs/git-gc
- https://git-scm.com/docs/git-fsck

## Assessment

- New information ratio: 0.875
- Questions addressed: What invariants, failure recovery, and rollback prevent lost uncommitted work, orphaned autostashes, rejected pushes, and force-push loss?
- Questions answered: What invariants, failure recovery, and rollback prevent lost uncommitted work, orphaned autostashes, rejected pushes, and force-push loss?

## Reflection

- What worked and why: Reading the exact Git plumbing and recovery manuals exposed the distinction between atomic local ref updates, expiring reflog evidence, durable reachability refs, and non-atomic remote acknowledgement.
- What did not work and why: A grouped three-document fetch stalled without returning evidence; narrowing the official URLs produced deterministic results.
- What I would do differently: Query exact option anchors from the outset and reserve one source request specifically for remote status reconciliation.

## Recommended Next Focus

Define the unattended automation surface and conflict-avoidance policy: single-writer locking/leases, process supervision, trigger coalescing, journal durability primitives, hook boundaries, backpressure, and the exact conditions that quarantine a transaction instead of retrying it.

