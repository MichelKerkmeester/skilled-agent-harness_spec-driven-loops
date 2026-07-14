# Deep-Research Iteration 004

## Focus

Conflict avoidance and handling: path ownership, per-session subtrees, additive-only commits, merge-tree preflight, custom drivers, rerere, and acceptance conditions.

## Actions Taken

1. Read the lineage state and strategy before selecting the next focus.
2. Checked the current Git `merge-tree`, `rerere`, `gitattributes`, `sparse-checkout`, `submodule`, and `merge` manuals.
3. Converted the documented merge primitives into explicit conflict-policy rules and testable safety conditions.

## Findings

- Disjoint path ownership is the only structural conflict-avoidance rule that can make arbitrary session contributions commute without content merging.
- Per-session subtrees and additive-only records help only when path/key ownership is unique; shared generated, renamed, deleted, or cross-cutting files remain serialized resources.
- `git merge-tree --write-tree` provides a worktree/index-free three-way merge preflight with a clean/conflicted exit status and a candidate tree.
- `rerere` can reuse a previously recorded human resolution, but it is an acceleration mechanism, not proof that a new conflict should resolve the same way.
- Custom merge drivers can encode domain-specific deterministic merges, while binary/opaque paths should remain explicit conflicts; neither mechanism can invent correct semantics.
- Sparse checkout limits files populated in a worktree but does not grant ref isolation or ownership of paths across concurrent writers.
- Acceptance tests must verify no silent content choice, no force update, durable conflict retention, exact rollback, and eventual publication for disjoint contributions.

### F1 — Path partitioning is the strongest conflict-avoidance guarantee

If each session is authorized to modify a disjoint set of paths, the publisher can validate the changed-path set before integration and accept contributions without a content conflict. This is an architectural invariant rather than a Git feature: Git's merge machinery can tell whether a particular pair of trees merges cleanly, but it does not know which paths a session was socially or semantically allowed to own. The manifest must therefore be enforced at submission and publication time.

Path partitioning must include renames, deletes, directory/file collisions, submodule gitlinks, and generated outputs. A session that edits a shared lockfile, schema registry, build graph, or formatter output is not additive merely because its primary source files are in its assigned subtree. [SOURCE: https://git-scm.com/docs/git-merge-tree] [SOURCE: https://git-scm.com/docs/git-merge]

### F2 — Per-session subtrees and additive-only commits reduce conflicts but do not prove semantic independence

Putting each session's artifacts under a unique subtree or assigning unique keys in an append-only data structure makes the tree union-like and easy to publish with a scratch index. The invariant is path/key uniqueness, not the word “additive”: two sessions can still collide on the same filename, directory entry, generated index, or semantic identifier. Deletes and renames are non-additive and require an owner or serialized policy.

Subtrees are therefore a preferred input shape for high-throughput AI sessions, but the publisher must reject a contribution that escapes its path manifest or collides with another session's namespace. The final aggregate may still need a deterministic generation step for cross-cutting files, and that step should be a separate publisher-owned contribution.

### F3 — `git merge-tree --write-tree` is an appropriate non-destructive merge preflight

Git documents `merge-tree --write-tree` as performing a three-way merge without reading or writing the working tree or index. It creates a candidate top-level tree, returns status `0` for a clean merge and `1` for a conflicted merge, and exposes conflicted file information. The documented plumbing sequence then feeds a clean tree to `git commit-tree` and updates a ref. This directly supports a publisher that never touches the IDE checkout. [SOURCE: https://git-scm.com/docs/git-merge-tree] [SOURCE: https://git-scm.com/docs/git-commit-tree] [SOURCE: https://git-scm.com/docs/git-update-ref]

The publisher must check the exit status, not infer cleanliness from whether a conflict filename list is empty: Git explicitly documents conflict classes that are not represented one-to-one by file entries. On clean output, it creates a commit with the current branch tip as parent and uses an explicit old-tip compare-and-swap. On status `1`, it stores the candidate/tree metadata and marks the submission conflicted without updating the shared branch.

### F4 — `rerere` reduces repeated human work, but cannot be the safety policy

`git rerere` records a manually resolved conflicted automerge and can apply that recorded resolution when the corresponding conflict recurs. This is useful for deterministic, repeated conflicts in generated or mechanically stable files. It does not establish that the old resolution is semantically correct for a new context, and it says nothing about the branch publication race or rollback state. [SOURCE: https://git-scm.com/docs/git-rerere]

Use rerere only after a conflict is identified, the resolution is reviewed or test-validated, and the resulting commit is still published through the normal CAS path. Never use “rerere applied” as the condition for deleting the original submission or recovery artifact.

### F5 — Custom merge drivers can encode real domain semantics, but a non-zero result must remain a conflict

Git attributes can select a custom three-way merge driver for a path. The driver receives the common ancestor, current side, and other side, must write the result to the designated file, and must return zero only when it merged cleanly; binary/opaque files can instead be declared conflicted. This makes deterministic structured-data merging possible for narrowly defined formats, but the driver is an application policy with its own tests and failure modes. [SOURCE: https://git-scm.com/docs/gitattributes]

The safe default is fail-closed: a driver must refuse ambiguous duplicate keys, incompatible schema changes, or malformed output. “Take ours” or “take theirs” is not a conflict policy for a no-loss system unless the path is explicitly disposable and the discarded side is retained elsewhere.

### F6 — Sparse checkout is a projection optimization, not a concurrency boundary

Sparse checkout can populate only selected directories and stores the selection per worktree when worktree-specific configuration is enabled. It uses skip-worktree bits to omit files from the working directory, which reduces local file volume but does not change shared refs or grant a session ownership of paths. The documentation also warns that changing sparse patterns can delete ignored files from directories that leave the sparse set and that worktree-updating operations still have edge cases. [SOURCE: https://git-scm.com/docs/git-sparse-checkout]

Use sparse checkout to reduce checkout cost inside an already isolated worktree, not as a substitute for a linked worktree/clone or a path-ownership manifest. A publisher should operate on the full tree or scratch index so omitted paths are not accidentally treated as absent contributions.

### F7 — Acceptance conditions must make conflict visibility and losslessness executable

The minimum acceptance suite for the proposed architecture is:

- Two disjoint session commits submitted from the same base both eventually publish, with each commit's tree content present and no non-fast-forward error exposed to the sessions.
- Two overlapping edits produce a durable `conflicted` record naming the submission, base SHA, current SHA, paths/merge status, and recovery reference; the shared branch remains unchanged until an explicit resolution is accepted.
- A publisher crash before or after object creation cannot lose a submission: the queue record, commit/tree object, or recovery bundle permits retry or replay, and a second attempt is idempotent.
- A CAS race causes reconstruction/retry against the new tip; it never uses `--force` or silently drops the other writer's commit.
- A dirty IDE worktree remains byte-for-byte and index-for-index unchanged while fetch, merge-tree preflight, conflict classification, and publication run elsewhere.
- A failed autostash/merge/refresh leaves the old HEAD and a named recoverable patch or stash; cleanup is permitted only after post-apply tree/hash verification.
- A clean current-view worktree advances by fast-forward-only update and never overwrites session work because no AI session owns that worktree.
- A path-manifest violation, duplicate additive key, generated-file collision, rename/delete conflict, or binary conflict is rejected or queued, never resolved by an unrecorded “ours/theirs” choice.

These conditions define “zero operator-visible divergence blockers” as no manual response to push races or stale branch state, not as an impossible promise that arbitrary overlapping edits need no decision. Conflicts may remain as durable queue states; they must not appear as hidden data loss or a repeatedly failing client push.

## Questions Answered

- RQ6: Answered with a qualification. Enforce path ownership and unique additive namespaces first; use merge-tree preflight for clean merges; use narrowly tested merge drivers/rerere only as assistive mechanisms; queue all ambiguous overlap.
- RQ1: Refined. Low-latency publication should use merge-tree/scratch-index construction plus serialized CAS, while a remote merge queue is appropriate when CI-gated review is the priority.

## Questions Remaining

- Which complete default architecture best combines these primitives and surfaces?
- What trade-offs remain between a local daemon, remote merge queue, and hybrid deployment?
- Which rollback, observability, and latency conditions must be stated in the final recommendation?

## Ruled-Out Directions

- Treating “additive-only” as a semantic guarantee without unique paths or keys: generated files, duplicate names, renames, and shared indexes can still conflict. [SOURCE: https://git-scm.com/docs/git-merge-tree]
- Using sparse checkout as session isolation: it changes file population, not shared ref ownership. [SOURCE: https://git-scm.com/docs/git-sparse-checkout]
- Auto-applying rerere or custom “ours/theirs” drivers as unconditional conflict resolution: both can encode an incorrect choice unless the domain policy is explicit and verified. [SOURCE: https://git-scm.com/docs/git-rerere] [SOURCE: https://git-scm.com/docs/gitattributes]

## Negative Knowledge

Arbitrary overlapping edits are not a scheduling problem that Git can make disappear. Any system claiming zero conflicts must either constrain the edit domain, serialize every overlap, or silently discard a side. The third option violates the no-loss requirement; the first two are the only honest designs.

## Recommended Next Focus

Iteration 5: adversarial architecture review and final acceptance matrix—compare optimistic retry, serialized local publisher, remote merge queue, and hybrid deployment against all RQ1–RQ7.

## Confidence

High for `merge-tree`, `rerere`, merge-driver, and sparse-checkout semantics. High for the structural path-partitioning rule; medium-high for the proposed acceptance suite because implementation details such as queue storage, crash recovery, and IDE integration still need a final architecture pass.

## Sources Consulted

- https://git-scm.com/docs/git-merge-tree
- https://git-scm.com/docs/git-commit-tree
- https://git-scm.com/docs/git-update-ref
- https://git-scm.com/docs/git-rerere
- https://git-scm.com/docs/gitattributes
- https://git-scm.com/docs/git-sparse-checkout
- https://git-scm.com/docs/git-merge
