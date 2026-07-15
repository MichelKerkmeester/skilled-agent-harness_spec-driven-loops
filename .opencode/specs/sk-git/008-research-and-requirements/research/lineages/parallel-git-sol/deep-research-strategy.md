# Deep Research Strategy — Concurrent Git Autosync

## 2. TOPIC

Design and compare a system for many concurrent AI coding sessions to commit and continuously publish to one shared long-lived branch without operator-visible divergence blockers, while keeping an IDE checkout current and preserving every session's uncommitted work.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which integration strategy best guarantees continuous fast-forward publication under concurrent writers: rebase/retry, serialization, merge queue, or scratch-index/ref-level commit construction?
- [x] Which workspace model and update protocol keep session work isolated while maintaining an always-current IDE view?
- [x] What invariants, failure recovery, and rollback prevent lost uncommitted work, orphaned autostashes, rejected pushes, and force-push loss?
- [x] Which automation surface and conflict-avoidance rules are reliable enough for unattended AI sessions?
- [x] What does existing art prove, and what default architecture, trade-offs, and testable acceptance conditions follow?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Implementing or deploying the synchronization system.
- Modifying repository code, Git configuration, hooks, branches, remotes, worktrees, or the parent spec packet.
- Claiming that semantic merge conflicts can be made impossible for arbitrary overlapping edits.

## 5. STOP CONDITIONS

- Run exactly five evidence iterations; convergence before iteration five is telemetry only.
- Stop on unrecoverable packet-state corruption or inability to keep writes inside the lineage directory.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which integration strategy best guarantees continuous fast-forward publication under concurrent writers: rebase/retry, serialization, merge queue, or scratch-index/ref-level commit construction?
- Which workspace model and update protocol keep session work isolated while maintaining an always-current IDE view?
- What invariants, failure recovery, and rollback prevent lost uncommitted work, orphaned autostashes, rejected pushes, and force-push loss?
- Which automation surface and conflict-avoidance rules are reliable enough for unattended AI sessions?
- What does existing art prove, and what default architecture, trade-offs, and testable acceptance conditions follow?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Direct retrieval of specific official command documentation exposed exact ref-update, index, commit, and hosted-queue semantics without relying on secondary interpretations. (iteration 1)
- Topic-specific official Git manuals exposed the exact shared/per-worktree state and command abort/conflict semantics needed to draw an operation boundary. (iteration 2)
- Reading the exact Git plumbing and recovery manuals exposed the distinction between atomic local ref updates, expiring reflog evidence, durable reachability refs, and non-atomic remote acknowledgement. (iteration 3)
- separating authority by lifecycle exposed the design cleanly—hooks and wrappers are event surfaces, while a durable publisher owns every operation that must survive retries or crashes. Canonical Git plumbing documentation also provided a checkout-free preflight primitive. (iteration 4)
- Comparing mechanism boundaries rather than product labels made the synthesis concrete: atomic projections, pending-change stores, validation groups, temporary contribution refs, and conflict preservation each have a clear owner. (iteration 5)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The broad official-source search stalled and produced no evidence; it was unnecessary once canonical documentation URLs were known. (iteration 1)
- The first broad clone-document retrieval did not surface the `--shared` warning within its excerpt; a narrow line-targeted reread recovered the authoritative details. (iteration 2)
- A grouped three-document fetch stalled without returning evidence; narrowing the official URLs produced deterministic results. (iteration 3)
- the generated freedesktop.org systemd manual was inaccessible with HTTP 403. The upstream systemd repository was available, and the core conclusion is supervisor-agnostic. (iteration 4)
- Broad discovery did not reliably surface the canonical `git-sync` or `mob` README, so direct official repository retrieval was required. No named product met the end-to-end contract. (iteration 5)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### “Always current” without an OID-linked refresh acknowledgement and latency budget is not testable. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: “Always current” without an OID-linked refresh acknowledgement and latency budget is not testable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: “Always current” without an OID-linked refresh acknowledgement and latency budget is not testable.

### `clone --shared` or long-lived `--reference` alternates as the default isolation boundary: source pruning can corrupt borrowers. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `clone --shared` or long-lived `--reference` alternates as the default isolation boundary: source pruning can corrupt borrowers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `clone --shared` or long-lived `--reference` alternates as the default isolation boundary: source pruning can corrupt borrowers.

### A hook-only publisher: hooks are command-scoped, configurable/bypassable on clients, and lack one durable recovery owner. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A hook-only publisher: hooks are command-scoped, configurable/bypassable on clients, and lack one durable recovery owner.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A hook-only publisher: hooks are command-scoped, configurable/bypassable on clients, and lack one durable recovery owner.

### A hosted merge queue as the sole continuous autosync mechanism: it serializes accepted PRs but externalizes conflicts and check failures by removing queue entries. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A hosted merge queue as the sole continuous autosync mechanism: it serializes accepted PRs but externalizes conflicts and check failures by removing queue entries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A hosted merge queue as the sole continuous autosync mechanism: it serializes accepted PRs but externalizes conflicts and check failures by removing queue entries.

### A launch-wrapper-only publisher: its process lifetime does not cover delayed retries, remote ambiguity, or crash replay. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A launch-wrapper-only publisher: its process lifetime does not cover delayed retries, remote ambiguity, or crash replay.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A launch-wrapper-only publisher: its process lifetime does not cover delayed retries, remote ambiguity, or crash replay.

### A single shared working tree for concurrent sessions: it shares the exact files and index whose isolation is required. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A single shared working tree for concurrent sessions: it shares the exact files and index whose isolation is required.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A single shared working tree for concurrent sessions: it shares the exact files and index whose isolation is required.

### Adopting `git-auto-sync` or Git Town as the multi-session authority: both operate by mutating and potentially stashing an authoring workspace. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Adopting `git-auto-sync` or Git Town as the multi-session authority: both operate by mutating and potentially stashing an authoring workspace.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adopting `git-auto-sync` or Git Town as the multi-session authority: both operate by mutating and potentially stashing an authoring workspace.

### Backward rollback and force-push remain permanently excluded from the shared branch. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Backward rollback and force-push remain permanently excluded from the shared branch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Backward rollback and force-push remain permanently excluded from the shared branch.

### Blindly skipping a quarantined FIFO head: safe continuation requires explicit dependency and changed-path independence, not queue convenience. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Blindly skipping a quarantined FIFO head: safe continuation requires explicit dependency and changed-path independence, not queue convenience.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Blindly skipping a quarantined FIFO head: safe continuation requires explicit dependency and changed-path independence, not queue convenience.

### Claiming arbitrary overlapping edits always auto-merge: textual and semantic conflicts have a durable quarantine path instead. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Claiming arbitrary overlapping edits always auto-merge: textual and semantic conflicts have a durable quarantine path instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming arbitrary overlapping edits always auto-merge: textual and semantic conflicts have a durable quarantine path instead.

### Claiming that per-session subtrees or additive-only commits eliminate semantic conflicts is too strong; cross-file invariants and shared derived artifacts remain. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Claiming that per-session subtrees or additive-only commits eliminate semantic conflicts is too strong; cross-file invariants and shared derived artifacts remain.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming that per-session subtrees or additive-only commits eliminate semantic conflicts is too strong; cross-file invariants and shared derived artifacts remain.

### CODEOWNERS as a path lock: it routes review and approval; it does not reserve paths or prevent concurrent edits. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: CODEOWNERS as a path lock: it routes review and approval; it does not reserve paths or prevent concurrent edits.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: CODEOWNERS as a path lock: it routes review and approval; it does not reserve paths or prevent concurrent edits.

### Force-pushing the shared branch: Git documents that force disables safety checks and can make the remote lose commits. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Force-pushing the shared branch: Git documents that force disables safety checks and can make the remote lose commits.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Force-pushing the shared branch: Git documents that force disables safety checks and can make the remote lose commits.

### Hiding semantic quarantine as an infinite retry would turn an honest conflict into silent queue starvation. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Hiding semantic quarantine as an infinite retry would turn an honest conflict into silent queue starvation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hiding semantic quarantine as an infinite retry would turn an honest conflict into silent queue starvation.

### Making client hooks authoritative is structurally incompatible with unattended recovery and centralized ordering. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Making client hooks authoritative is structurally incompatible with unattended recovery and centralized ordering.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making client hooks authoritative is structurally incompatible with unattended recovery and centralized ordering.

### Moving the shared ref backward for rollback: it can remove later session history. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Moving the shared ref backward for rollback: it can remove later session history.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Moving the shared ref backward for rollback: it can remove later session history.

### Recording an accepted commit's OID only in the crash journal: application files are not Git reachability roots. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Recording an accepted commit's OID only in the crash journal: application files are not Git reachability roots.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recording an accepted commit's OID only in the crash journal: application files are not Git reachability roots.

### Reflog-only retention is time-bounded and configuration-dependent; it is useful forensic evidence, not the lifetime guarantee for accepted transactions. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reflog-only retention is time-bounded and configuration-dependent; it is useful forensic evidence, not the lifetime guarantee for accepted transactions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reflog-only retention is time-bounded and configuration-dependent; it is useful forensic evidence, not the lifetime guarantee for accepted transactions.

### Retrying an ambiguous push before observing the remote can duplicate integration work and complicate acknowledgement; reconcile first. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Retrying an ambiguous push before observing the remote can duplicate integration work and complicate acknowledgement; reconcile first.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Retrying an ambiguous push before observing the remote can duplicate integration work and complicate acknowledgement; reconcile first.

### Searching for a single drop-in tool is exhausted; the required guarantees cross local filesystem, Git object reachability, hosted ref publication, and IDE observation boundaries. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Searching for a single drop-in tool is exhausted; the required guarantees cross local filesystem, Git object reachability, hosted ref publication, and IDE observation boundaries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a single drop-in tool is exhausted; the required guarantees cross local filesystem, Git object reachability, hosted ref publication, and IDE observation boundaries.

### Treating `reset --keep` as a general always-current refresh. Its safety checks are overlap-sensitive, and it can still discard local commits by moving the current branch. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating `reset --keep` as a general always-current refresh. Its safety checks are overlap-sensitive, and it can still discard local commits by moving the current branch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `reset --keep` as a general always-current refresh. Its safety checks are overlap-sensitive, and it can still discard local commits by moving the current branch.

### Treating `worktree lock` as protection for uncommitted content. It prevents administrative pruning/move/removal, not filesystem loss or overwrite by an unsafe command. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating `worktree lock` as protection for uncommitted content. It prevents administrative pruning/move/removal, not filesystem loss or overwrite by an unsafe command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `worktree lock` as protection for uncommitted content. It prevents administrative pruning/move/removal, not filesystem loss or overwrite by an unsafe command.

### Treating a successful local command return as the only remote acknowledgement: a lost response after server acceptance is ambiguous until the remote ref is observed. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating a successful local command return as the only remote acknowledgement: a lost response after server acceptance is ambiguous until the remote ref is observed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a successful local command return as the only remote acknowledgement: a lost response after server acceptance is ambiguous until the remote ref is observed.

### Treating GitHub merge queue or Gerrit alone as the complete solution: neither protects local dirty work nor refreshes the IDE projection. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating GitHub merge queue or Gerrit alone as the complete solution: neither protects local dirty work nor refreshes the IDE projection.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating GitHub merge queue or Gerrit alone as the complete solution: neither protects local dirty work nor refreshes the IDE projection.

### Treating Syncthing-style last-writer selection or conflict copies as Git integration: preservation is borrowable, but ancestry and semantic validation are absent. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating Syncthing-style last-writer selection or conflict copies as Git integration: preservation is borrowable, but ancestry and semantic validation are absent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Syncthing-style last-writer selection or conflict copies as Git integration: preservation is borrowable, but ancestry and semantic validation are absent.

### Uncoordinated direct pushes as a zero-rejection guarantee: the second divergent writer is rejected after the first advances the branch. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Uncoordinated direct pushes as a zero-rejection guarantee: the second divergent writer is rejected after the first advances the branch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Uncoordinated direct pushes as a zero-rejection guarantee: the second divergent writer is rejected after the first advances the branch.

### Using temporary autostash state as the unattended recovery boundary: it mutates the session and can end in conflicts or a dangling commit window. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Using temporary autostash state as the unattended recovery boundary: it mutates the session and can end in conflicts or a dangling commit window.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using temporary autostash state as the unattended recovery boundary: it mutates the session and can end in conflicts or a dangling commit window.

### Watch-triggered rebase, autostash, or reset in active session worktrees: these mutate the session branch, index, or files and can stop on conflicts. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Watch-triggered rebase, autostash, or reset in active session worktrees: these mutate the session branch, index, or files and can stop on conflicts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Watch-triggered rebase, autostash, or reset in active session worktrees: these mutate the session branch, index, or files and can stop on conflicts.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- A hosted merge queue as the sole continuous autosync mechanism: it serializes accepted PRs but externalizes conflicts and check failures by removing queue entries. (iteration 1)
- Force-pushing the shared branch: Git documents that force disables safety checks and can make the remote lose commits. (iteration 1)
- Uncoordinated direct pushes as a zero-rejection guarantee: the second divergent writer is rejected after the first advances the branch. (iteration 1)
- `clone --shared` or long-lived `--reference` alternates as the default isolation boundary: source pruning can corrupt borrowers. (iteration 2)
- A single shared working tree for concurrent sessions: it shares the exact files and index whose isolation is required. (iteration 2)
- Treating `reset --keep` as a general always-current refresh. Its safety checks are overlap-sensitive, and it can still discard local commits by moving the current branch. (iteration 2)
- Treating `worktree lock` as protection for uncommitted content. It prevents administrative pruning/move/removal, not filesystem loss or overwrite by an unsafe command. (iteration 2)
- Watch-triggered rebase, autostash, or reset in active session worktrees: these mutate the session branch, index, or files and can stop on conflicts. (iteration 2)
- Backward rollback and force-push remain permanently excluded from the shared branch. (iteration 3)
- Moving the shared ref backward for rollback: it can remove later session history. (iteration 3)
- Recording an accepted commit's OID only in the crash journal: application files are not Git reachability roots. (iteration 3)
- Reflog-only retention is time-bounded and configuration-dependent; it is useful forensic evidence, not the lifetime guarantee for accepted transactions. (iteration 3)
- Retrying an ambiguous push before observing the remote can duplicate integration work and complicate acknowledgement; reconcile first. (iteration 3)
- Treating a successful local command return as the only remote acknowledgement: a lost response after server acceptance is ambiguous until the remote ref is observed. (iteration 3)
- Using temporary autostash state as the unattended recovery boundary: it mutates the session and can end in conflicts or a dangling commit window. (iteration 3)
- A hook-only publisher: hooks are command-scoped, configurable/bypassable on clients, and lack one durable recovery owner. (iteration 4)
- A launch-wrapper-only publisher: its process lifetime does not cover delayed retries, remote ambiguity, or crash replay. (iteration 4)
- Blindly skipping a quarantined FIFO head: safe continuation requires explicit dependency and changed-path independence, not queue convenience. (iteration 4)
- Claiming that per-session subtrees or additive-only commits eliminate semantic conflicts is too strong; cross-file invariants and shared derived artifacts remain. (iteration 4)
- CODEOWNERS as a path lock: it routes review and approval; it does not reserve paths or prevent concurrent edits. (iteration 4)
- Making client hooks authoritative is structurally incompatible with unattended recovery and centralized ordering. (iteration 4)
- “Always current” without an OID-linked refresh acknowledgement and latency budget is not testable. (iteration 5)
- Adopting `git-auto-sync` or Git Town as the multi-session authority: both operate by mutating and potentially stashing an authoring workspace. (iteration 5)
- Claiming arbitrary overlapping edits always auto-merge: textual and semantic conflicts have a durable quarantine path instead. (iteration 5)
- Hiding semantic quarantine as an infinite retry would turn an honest conflict into silent queue starvation. (iteration 5)
- Searching for a single drop-in tool is exhausted; the required guarantees cross local filesystem, Git object reachability, hosted ref publication, and IDE observation boundaries. (iteration 5)
- Treating GitHub merge queue or Gerrit alone as the complete solution: neither protects local dirty work nor refreshes the IDE projection. (iteration 5)
- Treating Syncthing-style last-writer selection or conflict copies as Git integration: preservation is borrowable, but ancestry and semantic validation are absent. (iteration 5)

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- Prior memory context: unavailable in this detached session.
- Code graph: unavailable at startup.
- Spec resource map: absent; skipping the coverage gate.
- The operator requires an evidence-backed architecture covering seven named research areas and a hard five-iteration stop policy.

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05
- Stop policy: max-iterations
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: false for leaf iterations; final synthesis is workflow-owned
- Allowed write root: `.opencode/specs/skilled-agent-orchestration/137-parallel-session-git-autosync/001-research-and-requirements/research/lineages/parallel-git-sol`
- Current generation: 1
- Started: 2026-07-14T04:44:35Z
