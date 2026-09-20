# Synthesis: answers to the two blocking worktree questions

Five iterations, SWE-2 at max through cli-devin, sequential and read-only. They converge, so
this records one design rather than a menu.

## The governing insight

Both questions were being asked as "how do we arbitrate a shared resource". The better answer in
each case is to stop sharing it, and use the existing lease only for the one thing a lease is
genuinely good at: deciding whether a leftover is still owned by something alive.

The repository already has the mechanism. `acquireLoopLock`, `refreshLoopLock`, `releaseLoopLock`
and `isStaleLoopLock` accept arbitrary paths and already carry TTL, heartbeat, owner PID, nonce
and fenced reclaim. Nothing new needs inventing. What matters is using it as evidence rather than
as a mutex.

## Question one: how the sweep proves a worktree is dead

**Write a lease into each worktree root at creation**, refreshed on the progress heartbeat the
runner already runs, with a time-to-live of roughly three heartbeat intervals.

**Removal requires positive proof of death, never absence of evidence.** Three conjuncts, all
required: the heartbeat is older than twice the time-to-live, the owner process does not answer a
zero-signal probe, and no process has the directory as its working directory. That last check
already exists in the git reaper and should be lifted rather than rewritten.

**An unmarked or unparseable worktree is kept**, not reaped, past a creation grace window. A
worktree whose lease is missing is most likely one being created right now.

**Give the lease a terminal state**, moving from active to either claimed or retained. Only an
active lease that fails all three liveness conjuncts may be swept. A retained worktree, left
behind deliberately after a failed publish, is never auto-reaped and is released only by the same
label publishing successfully or by an operator.

**Take a lease on the shared prefix itself** for the duration of the claim and sweep window,
because the prefix outlives any single run's directory lock.

## Question two: copy-back's write semantics

**Key the published directory by run.** This is the move that removes the hazard instead of
arbitrating it. Two runs using the same lineage label stop colliding because they no longer
target the same path.

**Never write in place.** Stage a complete copy in the main checkout, on the same filesystem so
the final rename is atomic, write its manifest last as the completion marker, then rename. Staging
inside the worktree risks a cross-device rename that is not atomic.

**Hold the claim lease across the whole check-and-rename**, which closes the gap between deciding
the target is free and taking it.

**Never delete an existing published directory.** Rename it aside into an attic. That covers the
case nobody planned for, where an operator edited a published lineage directory, because their
edits move with it rather than disappearing.

**Sweep staging residue too**, so a publisher that dies mid-transaction leaves reclaimable state
rather than a permanent block.

## Ordering, which is where the remaining danger sits

Startup must run: take the run lock, read the ledger for orphaned lanes, claim what the ledger
says is resumable, and only then sweep. A sweep that runs before the ledger read can delete the
very lanes a resume is about to requeue. Record each worktree's path on its lane ledger event so
claim and release key off the ledger rather than parsing directory names.

## The verification gap, which is larger than one criterion

The current teardown criterion reads "no worktree remains", which a destructive sweep satisfies
perfectly. It needs four changes, not one.

1. Scope it to this run: no worktree **of this run** remains, excluding retained ones.
2. Add the concurrent negative control: run B starts while run A is live, and every one of A's
   worktrees survives with intact bytes.
3. Add a content assertion: each published lineage directory hash-equals its worktree source.
   Teardown proving absence is not the same as publication proving content.
4. Assert the boundary moved rather than the guard going quiet. A lane writing outside its
   lineage directory **inside its own worktree** must still produce a violation naming the
   worktree root, while a neighbour writing in the main checkout during that run must produce
   none and stay byte-identical.

Emit a per-entry keep-or-remove decision with its reason to the ledger, so a test can assert the
sweep discriminated rather than merely that the outcome looked right.
