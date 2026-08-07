# Iteration 1: Git Publication Invariants and Integration Strategies

## Focus
This iteration compared direct fetch/rebase/retry, a serialized publisher, hosted merge queues, and scratch-index/ref-level commit construction. The narrow question was which mechanism can keep a shared long-lived branch fast-forward-only under concurrent writers, and which guarantees stop at the local repository boundary.

## Findings
1. A branch update is fast-forward only when the proposed new tip descends from the destination's current tip. If two writers start from the same tip and independently produce different descendants, the first accepted push advances the branch and the second becomes non-fast-forward; Git rejects it by default to avoid losing the first history. [SOURCE: https://git-scm.com/docs/git-push]
2. Fetch/rebase/retry can make each eventually accepted push fast-forward by rebuilding work atop the latest remote tip, but it remains optimistic concurrency: another writer can advance the ref between fetch and push, and overlapping changes can stop integration for conflict resolution. Explicit `--force-with-lease=<ref>:<expected>` is a compare-and-swap safeguard, not a way to guarantee progress; blind force can discard concurrent commits. [SOURCE: https://git-scm.com/docs/git-push] [SOURCE: https://git-scm.com/docs/git-rebase]
3. A single serialized publisher is the strongest default for continuous linear publication: accept immutable session contributions, order them, construct each next commit on the last accepted tip, then publish one candidate at a time. This removes races among participating writers, but only if all shared-branch writes pass through that authority; the publisher must still re-read and retry if an external writer advances the hosted ref. [INFERENCE: Git's fast-forward rejection and `update-ref <new> <old>` conditional update semantics make serialization the only compared strategy that removes participating-writer races rather than reacting to them.]
4. Scratch-index plumbing isolates commit construction from a session's index and working tree. `read-tree -i` is intended for merges in a temporary index; `write-tree` emits a tree from a fully merged index; `commit-tree` creates a commit with explicit parent(s); and `update-ref <ref> <new> <old>` updates only if the old value still matches. This can preserve concurrent uncommitted work by never checking out or resetting the session worktree, but the conditional ref update is local—publishing to a hosted remote still goes through the remote's receive path. [SOURCE: https://git-scm.com/docs/git-read-tree] [SOURCE: https://git-scm.com/docs/git-write-tree] [SOURCE: https://git-scm.com/docs/git-commit-tree] [SOURCE: https://git-scm.com/docs/git-update-ref]
5. A GitHub merge queue validates a queued change against the latest base plus earlier queued changes and merges successful groups in FIFO order. It is hosted serialization with integrated checks, but conflicts, failed checks, and timeouts remove entries; it therefore cannot promise uninterrupted publication for arbitrary session output, and its PR/check lifecycle is a poorer fit for low-latency continuous autosync than a dedicated publisher. [SOURCE: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue]
6. “Zero operator-visible divergence blockers” is achievable only as an orchestration property: the system can keep rejected pushes and retries inside a coordinator. It cannot mean that arbitrary overlapping intent is always merged correctly, because the next commit must select one concrete tree and Git may expose unmerged entries when both sides change the same content; a policy must defer, reject, or resolve that conflict. [INFERENCE: Git requires a combined descendant before both divergent histories can be retained, and GitHub's queue explicitly removes entries that conflict with the base.]

## Ruled Out
- Uncoordinated direct pushes as a zero-rejection guarantee: the second divergent writer is rejected after the first advances the branch.
- Force-pushing the shared branch: Git documents that force disables safety checks and can make the remote lose commits.
- A hosted merge queue as the sole continuous autosync mechanism: it serializes accepted PRs but externalizes conflicts and check failures by removing queue entries.

## Dead Ends
No strategy category is exhausted. The initial broad official-source discovery query stalled, so the iteration recovered with direct, known official Git and GitHub documentation URLs.

## Edge Cases
- Ambiguous input: “zero operator-visible divergence” was interpreted as hiding publication races from the operator, not as making semantic conflicts impossible. The latter contradicts the packet non-goal.
- Contradictory evidence: none.
- Missing dependencies: the broad documentation search timed out; direct official documentation retrieval provided the required primary evidence.
- Partial success: one discovery action failed, but direct primary-source retrieval covered every comparison in scope; status remains `complete`.

## Sources Consulted
- https://git-scm.com/docs/git-push
- https://git-scm.com/docs/git-receive-pack
- https://git-scm.com/docs/git-fetch
- https://git-scm.com/docs/git-rebase
- https://git-scm.com/docs/git-read-tree
- https://git-scm.com/docs/git-write-tree
- https://git-scm.com/docs/git-commit-tree
- https://git-scm.com/docs/git-update-ref
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue

## Assessment
- New information ratio: 1.0
- Questions addressed: Which integration strategy best guarantees continuous fast-forward publication under concurrent writers?
- Questions answered: A serialized publisher, using isolated scratch-index commit construction and conditional tip checks, gives the strongest guarantee among the compared strategies; rebase/retry and merge queues remain useful subordinate mechanisms.

## Reflection
- What worked and why: Direct retrieval of specific official command documentation exposed exact ref-update, index, commit, and hosted-queue semantics without relying on secondary interpretations.
- What did not work and why: The broad official-source search stalled and produced no evidence; it was unnecessary once canonical documentation URLs were known.
- What I would do differently: Start with the canonical command manuals and host documentation, then use search only to fill a named evidence gap.

## Recommended Next Focus
Define the workspace model and update protocol around the serialized publisher: per-session worktrees or repositories, immutable contribution refs, scratch indexes, and a separately refreshed IDE projection that never mutates an active session's uncommitted state.

