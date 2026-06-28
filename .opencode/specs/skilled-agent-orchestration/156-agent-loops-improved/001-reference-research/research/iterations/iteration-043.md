# Iteration 43: S6-02 Atomic State Stack Portability

## Focus

[S6-02] Is kasper's full atomic-state stack - debounce, version guard, read-merge-write, and integrity hash - a quick-win drop-in or a deep rewrite given our append-only JSONL contract, and which layers port cleanly to `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`?

## Actions Taken

1. Read the deep-research skill contract and state output reference to confirm this leaf iteration should write only the iteration narrative and per-iteration delta.
2. Re-read prior S2-07, S2-08, S2-09, S3-03, S3-04, and S3-05 iteration outputs so this pass synthesized portability rather than duplicating individual mechanism mining.
3. Mined kasper's `KasperStateStore` around store fields, dirty debounce, versioned flush, lock-held read-merge-write, running aggregate cache, and integrity stamping.
4. Compared those mechanisms against our current atomic writer, JSONL repair helper, and reducer write boundary.

## Findings

### Finding 1: The full kasper store is a deep rewrite, not a drop-in for `atomic-state.ts`

Reference mechanism: kasper's persistence layer is a long-lived store with in-memory state, `dirty`, `flushTimer`, `flushingPromise`, and `version` fields [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:112`]. It batches mutations through `markDirty()` [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:886`], flushes under a state-file lock with `mergeExternalState()` before `doFlush()` [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:920`], and materializes one whole JSON object at the end [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:1030`].

Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`. Our target currently exposes stateless synchronous helpers, `writeStateAtomic()` and `writeTextAtomic()`, around temp-file, fsync, rename, and parent-directory fsync [TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:42`; TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:58`]. The full kasper store would change the helper's contract from "write these bytes durably now" into "own mutable state and lifecycle"; that crosses into reducer and JSONL semantics.

Port-difficulty: hard. Tag: deep-rewrite. Why it helps: this prevents the backlog from treating the whole state store as a quick-win and keeps `atomic-state.ts` as shared durability plumbing unless a separate store abstraction is explicitly designed.

### Finding 2: Integrity hashing ports cleanly for snapshot JSON, but JSONL integrity needs a sidecar/checkpoint design

Reference mechanism: kasper computes SHA-256 over the state object with `_integrity` removed [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:150`], verifies it during init and logs a warning while continuing on mismatch [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:165`; SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:169`], then stamps `_integrity` immediately before the whole-object write [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:1058`].

Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`. Add opt-in helpers such as `computeIntegrityHash()`, `stampIntegrity()`, and `verifyIntegrity()` for registry-style JSON snapshots. Do not copy a single top-level `_integrity` field onto append-only JSONL records; the JSONL path currently repairs malformed tails and appends independent records [TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:77`; TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:105`].

Port-difficulty: easy for snapshot helpers, hard for JSONL end-to-end integrity. Tag: quick-win for snapshot helpers; deep-rewrite for JSONL integrity. Why it helps: registry/dashboard-style JSON can gain tamper detection quickly, while append-only state logs keep their current record contract until a sidecar manifest or per-record hash chain is designed.

### Finding 3: Debounce plus version guard ports cleanly only as a per-path deferred writer for derived outputs

Reference mechanism: kasper coalesces mutations by scheduling one 2s flush in `markDirty()` [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:889`; SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:890`]. `flush()` captures the current version [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:897`], and `execFlush()` schedules an immediate reflush when the version changed during the write [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:939`; SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:945`].

Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`. The clean port is a `createDeferredAtomicWriter()`-style helper that coalesces superseded content per path, exposes `flushNow()`/`close()`, and still delegates the physical write to `writeTextAtomic()`. Integration should start at `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`, where `writeUtf8()` is direct `fs.writeFileSync()` [TARGET: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:30`] and the reducer writes registry, strategy, and dashboard in one cluster [TARGET: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:1055`].

Port-difficulty: med. Tag: quick-win. Why it helps: derived markdown/JSON snapshots can avoid repeated full-file rewrites during reducer refreshes, but append-only JSONL iteration records and delta files should stay immediate so reducer-visible audit events are not delayed.

### Finding 4: Read-merge-write belongs in `jsonl-repair.ts`, not inside the atomic byte writer

Reference mechanism: kasper's flush path rereads the current disk state under lock [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:958`; SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:961`], unions monotonic collections by stable identity [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:973`; SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:981`; SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:988`], then recomputes aggregate state when new source sessions were found [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:1002`; SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:1013`].

Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts`. Keep `atomic-state.ts` as durable replacement for complete payloads; put JSONL set-union and stable-record identity in `jsonl-repair.ts`, which currently only truncates corrupt tails and blindly appends [TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:77`; TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:105`].

Port-difficulty: med. Tag: quick-win once record identity is specified. Why it helps: concurrent fan-out or salvage paths can preserve both writers' records without turning the low-level atomic writer into a domain-specific reducer.

### Finding 5: Kasper's cached running aggregate is non-portable unless introduced as an explicit reducer checkpoint

Reference mechanism: kasper rebuilds running aggregate maps from `sessions` when cache shape is missing or stale [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:201`; SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:682`], restores `_running` when it matches session count [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:722`], and writes `_running` into the same whole-object state snapshot [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:1051`].

Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`. Our reducer reconstructs registry/dashboard outputs from parsed iteration/delta state rather than maintaining a mutable in-process store, and writes generated surfaces after reduction [TARGET: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:1055`]. A kasper-style cache should therefore be a named reducer checkpoint with invalidation rules, not an implicit `_running` field hidden in `atomic-state.ts`.

Port-difficulty: hard. Tag: deep-rewrite. Why it helps: it preserves append-only provenance while still leaving room for performance checkpoints if reducer rebuild time becomes measured pain.

## Questions Answered

- S6-02 answered: kasper's full atomic-state stack is not a quick-win drop-in for our append-only JSONL system.
- Cleanly portable layers: snapshot integrity helpers, deferred per-path writer with dirty-again versioning, and a JSONL merge helper if it lives in `jsonl-repair.ts` with stable record identities.
- Deep rewrites: whole-store ownership in `atomic-state.ts`, JSONL end-to-end integrity/hash chaining, and cached reducer aggregates.

## Questions Remaining

- Define the stable identity table for JSONL records before implementing set-union: iteration records, findings, observations, graph events, and generic events need different keys.
- Decide whether JSONL integrity should be a sidecar manifest, periodic checkpoint record, per-record hash, or hash chain.
- Measure reducer write amplification before prioritizing the deferred writer; the current evidence supports the design, not the performance payoff.

## Next Focus

[S6-04] What ADR-level contract makes anti-convergence (`minIterations`/`convergenceMode`) consistent across research/review/context/council so the optimizer cannot tune past the floor?
