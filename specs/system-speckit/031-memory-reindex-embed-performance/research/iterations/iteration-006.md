# Iteration 6: Adversarial Re-verification of Owner-Lease Races

## Focus

This iteration independently traced owner-lease classification, stale reclamation, heartbeat refresh, launcher release, orphan adoption, respawn serialization, and final daemon launch. It treated iteration 5's stale-unlink and heartbeat findings as hypotheses, constructed exact interleavings, and separated lease-level split ownership from SQLite writer safety.

## Findings

### 1. The stale-owner unlink race is real, and `O_EXCL` does not close it

The exact stale-reclamation sequence is:

1. `acquireOwnerLeaseFile()` reads the current owner lease once. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:499-502]
2. `classifyOwnerLease()` calls `processLiveness(ownerPid)`; a dead PID is stale. It also treats a live PID reparented to PID 1 as orphaned and treats a missing/older-than-two-TTL heartbeat as reclaimable. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:480-496]
3. After classification, the caller does not re-read or compare the pathname. If its initial read found a stale lease, it unlinks whatever currently occupies that path. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:503-521]
4. It creates the replacement through `writeOwnerLeaseFileExclusive()`, whose `fs.openSync(path, 'wx', 0o600)` is Node's exclusive-create form (`O_CREAT | O_EXCL`), then writes and `fsync`s the new file. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:432-445]
5. A failed exclusive create returns `acquired:false`; a successful create sets the launcher's process-local `ownerLeasePid` and returns `acquired:true`. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:523-532]

Concrete interleaving:

- T1: Launcher A reads stale lease S.
- T2: Launcher B reads the same stale lease S.
- T3: A classifies S stale.
- T4: B classifies S stale.
- T5: A unlinks S.
- T6: A exclusively creates lease A and returns `acquired:true`.
- T7: Delayed B executes the unlink authorized by its old read and removes lease A, not S.
- T8: B exclusively creates lease B and also returns `acquired:true`.

`O_EXCL` protects T6 and T8 individually against creating over a path that exists at that instant. It does not bind T7's unlink to the inode/content B classified at T2, and therefore does not make the read/classify/unlink/create sequence a compare-and-swap. The comment claiming that only one racer can win is incorrect for this interleaving. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:511-515]

The immediate bad outcome is two launcher processes that have both returned `acquired:true`, while the pathname names only B. It is not, by itself, two SQLite writers. Each launcher next checks the daemon PID lease; a live holder causes bridge/exit, while a stale daemon path enters an exclusive respawn-lock section with a post-lock child-PID re-read. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1733-1745] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1800-1839]

If no usable daemon lease exists, both launchers can progress far enough to write/reprobe the launcher PID lease and spawn competing context-server children. The reprobe reduces but does not eliminate this possibility because the sequence `write lease -> reprobe -> spawn` is not one atomic transition. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1860-1869] The already-confirmed process-lifetime SQLite sidecar lock then admits only one context-server writer; the loser exits through the exit-86 handling path rather than concurrently writing the database. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1503-1509] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1554-1606] [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/deep-research-state.jsonl:6]

Verdict on iteration 5 Finding 1: **confirmed as a lease-election TOCTOU race, but its placement as a high-impact hardening item was exaggerated.** The demonstrated consequence is transient split ownership, extra child launches, exit-86/retry/bridge churn, and potentially misleading lease metadata. No interleaving found here bypasses the database lock or proves data loss.

### 2. The heartbeat overwrite race is also real; atomic rename prevents torn reads, not stale replacement

`refreshOwnerLeaseFile()` reads the lease and checks only `ownerPid`. It then calls `writeOwnerLeaseFile()`, which writes and fsyncs a unique temporary file before `renameSync(tmp, ownerLeasePath)`. Finally it re-reads and accepts success if the pathname's `ownerPid` equals the intended PID. There is no lease ID, generation, inode comparison, or shared mutation lock. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:535-547] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:415-430]

Concrete interleaving:

- T1: Owner A begins a delayed heartbeat and reads lease A; the PID check passes.
- T2: A stalls before `renameSync`, long enough for another launcher to classify A stale (for example, after heartbeat expiry).
- T3: Launcher B unlinks lease A, exclusively creates lease B, and returns `acquired:true`.
- T4: A resumes and atomically renames its already-prepared temporary file over lease B.
- T5: A re-reads lease A and returns success; B still has a local successful-acquisition result, but the shared pathname again names A.

The rename is valuable: readers see either a complete old lease or a complete new lease, never a partially written heartbeat. It is not a conditional rename and therefore does not prove that the target is still the lease A validated. Atomicity of publication does not fence stale writers.

The heartbeat loop adds a self-healing tendency: a later refresh that observes another PID returns false and shuts its launcher down to preserve ownership. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:557-571] That limits ordinary persistence of the confusion, but an adversarial schedule can still overwrite a successor before either side observes the mismatch. PID-only identity also leaves PID reuse unfenced.

Verdict on iteration 5's heartbeat claim: **confirmed and accurately described at the mechanism level.** Its practical consequence is again ownership/discovery instability unless combined with missing or stale daemon metadata; atomic rename makes the file durable and untorn, not election-safe.

### 3. “Release-for-discovery” is an accurate description, not durable supervisory re-election

With re-election enabled, the context server is detached and unreferenced from its launcher. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1480-1494] On signal shutdown, the launcher preserves the daemon PID/socket lease, removes the process `exit` cleanup that would clear both leases, clears only its owner lease, and exits without killing the daemon. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1622-1644]

A successor temporarily acquires the owner lease, observes that the launcher PID in the daemon lease is stale, checks the recorded live `childPid`, deep-probes the daemon, then clears its own owner lease and bridges to the orphan. It never refreshes the daemon's supervisory ownership or becomes its durable heartbeat owner. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1741-1799]

Verdict on iteration 5 Finding 2: **confirmed.** This is intentionally an ownerless warm-daemon discovery/adoption bridge. It is data-safe while the detached daemon retains the SQLite lock and remains reachable, but repeated sessions must repeat temporary election and probing. It is an availability and lifecycle-authority weakness, not evidence of split-brain writes.

### 4. Practical severity is moderate availability risk, low direct integrity risk

The strongest defensible assessment is neither “purely cosmetic” nor “genuine data-loss split brain.” The lease races are real and can cause two launchers to believe they won, overwrite discovery metadata, spawn an unnecessary competing child, or force heartbeat shutdown and reconnect cycles. Those effects matter because they occur on MCP startup and can consume client timeout budgets.

However, three independent barriers narrow the impact:

- A live daemon PID lease causes a contender to bridge rather than spawn. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1733-1745]
- Stale-daemon reap/respawn is serialized by an exclusive respawn lock and revalidates the snapshotted child PID under that lock. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1800-1839]
- If competing children are nevertheless spawned, the process-lifetime SQLite sidecar lock rejects the second writer through exit 86. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1503-1509] [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/deep-research-state.jsonl:6]

Therefore iteration 5 was **roughly correct about the race mechanisms and release semantics, but exaggerated their real-world severity and ranking**. Fencing remains worthwhile, especially for startup reliability under session storms, but the current evidence supports a medium availability-hardening item below the directly observed duplicate-probe startup timeout. It does not support “data-loss risk despite the DB lock.” Runtime frequency remains unmeasured.

## Sources Consulted

- `.opencode/bin/mk-spec-memory-launcher.cjs:395-457` - owner-lease parsing, atomic replacement, exclusive creation, and payload fields.
- `.opencode/bin/mk-spec-memory-launcher.cjs:480-547` - stale classification, unlink/create acquisition, and heartbeat refresh.
- `.opencode/bin/mk-spec-memory-launcher.cjs:557-606` - heartbeat failure shutdown and PID-checked cleanup.
- `.opencode/bin/mk-spec-memory-launcher.cjs:608-679` - daemon PID-lease liveness and bridge readiness.
- `.opencode/bin/mk-spec-memory-launcher.cjs:1480-1606` - detached launch, child exit, and exit-86 handling.
- `.opencode/bin/mk-spec-memory-launcher.cjs:1622-1644` - release-for-re-election signal path.
- `.opencode/bin/mk-spec-memory-launcher.cjs:1733-1874` - owner acquisition, stale-daemon adoption, respawn serialization, lease reprobe, and launch.
- `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/deep-research-state.jsonl:6-7` - previously confirmed database-lock property and iteration 5 hypotheses.
- `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/iterations/iteration-005.md:9-25` - claims evaluated only after the independent source trace.

## Assessment

- `newInfoRatio`: 0.48
- Novelty justification: The pass independently confirmed both TOCTOU mechanisms, supplied exact bad-outcome interleavings, established what atomic rename and `O_EXCL` do not protect, and materially downgraded the practical impact from high-risk split-brain concern to moderate startup/availability risk behind three writer-safety barriers.
- Confidence: High for the static interleavings and release/adoption semantics. High that the shown paths do not bypass the SQLite lock. Medium for real-world frequency and timeout magnitude because this report-only iteration did not run concurrent launchers against the shared daemon.

## Reflection

What worked: reading acquisition and write helpers before iteration 5's narrative exposed the precise pathname gap and the stale comment at lines 1800-1803. Following both owner and daemon leases through the main entrypoint prevented conflating “two launchers believe they own” with “two database writers exist.”

What failed or remained unavailable: the required memory trigger lookup timed out. No runtime race harness was executed because researched paths are read-only and the iteration forbids implementation; therefore occurrence probability is unmeasured.

Ruled out: `O_EXCL` as a full stale-reclamation CAS; atomic rename as a stale-writer fence; the lease race as a demonstrated SQLite split-brain or data-loss path; durable supervisory transfer during adoption.

## Recommended Next Focus

Re-rank the final hardening list using confirmed impact: keep probe deduplication/latency first, place owner-lease fencing as medium availability hardening, and explicitly preserve the SQLite sidecar lock as the final integrity boundary.

## SCOPE VIOLATIONS

None.
