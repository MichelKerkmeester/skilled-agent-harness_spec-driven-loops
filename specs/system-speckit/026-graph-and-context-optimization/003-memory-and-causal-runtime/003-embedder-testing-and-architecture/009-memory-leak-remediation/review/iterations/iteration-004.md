# Iteration 004 — maintainability

## Metadata
- Iteration: 4 of 10
- Dimension: maintainability
- Timestamp: 2026-05-22T16:59:15Z
- Findings this iter: 8

## Summary
Reviewed the arc 009 lifecycle surfaces for cohesion, exported API stability, documentation drift, operational naming, and mirrored implementation risk. The highest-risk maintainability issues are duplicated lifecycle contracts across runtime languages: the rerank sidecar has two public ensure helpers with different ownership semantics, and the Code Graph owner lease has a TypeScript implementation plus a bootstrap CJS copy that must be manually kept in parity.

## New Findings

### P0 — Blockers
None

### P1 — Required

#### Rerank sidecar ensure helpers have incompatible ownership contracts
- **Fingerprint:** `maintainability:rerank-sidecar:ensure-helper-contract-drift`
- **File(s):** `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:7`, `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:154`, `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:201`, `.opencode/bin/lib/ensure-rerank-sidecar.cjs:84`, `.opencode/bin/lib/ensure-rerank-sidecar.cjs:93`
- **Evidence:** The Python helper says it mirrors the Node helper, then computes an owner token/config hash, consults `find_reusable_sidecar()`, switches port on an already healthy unknown owner, and writes a `SidecarLedgerRow`. The Node helper returns on any healthy port with `{ spawned: false, port, ownerPid: null }`, then spawns `start.sh` without owner-token, config-hash, or ledger recording.
- **Reasoning:** These are both public launcher paths for the same sidecar, but only one now carries the phase 008 ownership contract. Future fixes to port reuse, ledger schema, config identity, or unknown-owner handling can land in one helper and silently miss the other, which is already what the code shape shows.
- **Suggested fix:** Extract the sidecar ownership protocol into a shared contract with parity tests, or port the ledger/token/config-hash behavior to the Node helper and add a cross-runtime fixture that proves both helpers classify the same healthy, stale, mismatched, and unknown-owner cases.

#### Code Graph owner lease protocol is hand-copied in TS and CJS
- **Fingerprint:** `maintainability:code-graph-owner-lease:mirrored-ts-cjs-protocol`
- **File(s):** `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:31`, `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:180`, `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:208`, `.opencode/bin/mk-code-index-launcher.cjs:189`, `.opencode/bin/mk-code-index-launcher.cjs:248`
- **Evidence:** The TypeScript helper exports `OwnerClassification`, including `symlink-alias`, and `acquireOwnerLease()` blocks live, symlink, and EPERM holders. The launcher separately validates the same JSON shape, separately classifies owners, and returns only `stale-pid`, `unknown-eperm`, `ppid-1-orphan`, `stale-heartbeat-reclaim`, or `live-owner`.
- **Reasoning:** The launcher has to run before the TS build, but the current duplication gives the lease protocol two sources of truth. Every new field, classification, atomic-write rule, or recovery policy now needs two edits and two test matrices. The earlier correctness race appearing in both implementations is a symptom of that duplication pressure, not just a one-off bug.
- **Suggested fix:** Move the wire-schema and classification rules into a tiny bootstrap-safe CommonJS module, or generate both implementations from one fixture-backed contract. At minimum, add a parity test that feeds the same lease cases through both classifiers and fails on drift.

#### Daemon task registry silently overwrites duplicate task IDs
- **Fingerprint:** `maintainability:cocoindex-daemon-task-registry:silent-task-id-overwrite`
- **File(s):** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py:75`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py:96`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py:151`
- **Evidence:** `add_task()` and `add_future()` both assign `self._rows[task_id] = row` without checking whether a live row already exists. The done callbacks later call `_mark_task_done(ident, done)` or `_mark_future_done(ident, done)`, and those methods look up the current row by the same `task_id`.
- **Reasoning:** `task_id` is the registry's public identity boundary, but reuse is not guarded. If two callers accidentally reuse an index/request-derived ID, the older task's completion callback can mark the newer row complete or attach the wrong error. That makes lifecycle diagnostics unreliable and makes future callers depend on undocumented global uniqueness.
- **Suggested fix:** Reject duplicate live `task_id` registrations with a clear exception, or return an opaque registration handle that callbacks use instead of a mutable public string key. Add a regression where a duplicate registration is attempted before the first task completes.

### P2 — Suggestions

#### ActiveWorkRegistry's `retain_stale` flag reads backwards
- **Fingerprint:** `maintainability:cocoindex-active-work:retain-stale-flag-inverted`
- **File(s):** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py:104`
- **Evidence:** `mark_complete(..., retain_stale=True)` calls `_remember_completed(row)`, while `retain_stale=False` calls `_remember_stale(row)` immediately and removes the row from `_rows`.
- **Reasoning:** The flag name suggests `False` disables stale retention, but it records the identity as stale right away. Current tests encode that behavior, so this is not a duplicate correctness finding; it is an exported API naming hazard that invites future callers to choose the wrong retention mode.
- **Suggested fix:** Rename the parameter to something like `retain_completed_row` or `evict_to_stale`, keep a compatibility shim if needed, and document the distinction between completed-row retention and stale-identity retention.

#### Lifecycle READMEs omit the arc 009 helper surfaces
- **Fingerprint:** `maintainability:lifecycle-docs:readmes-omit-arc009-surfaces`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/README.md:37`, `.opencode/skills/system-code-graph/mcp_server/lib/README.md:81`, `.opencode/skills/system-spec-kit/scripts/ops/README.md:59`, `.opencode/skills/system-spec-kit/scripts/ops/README.md:70`
- **Evidence:** The deep-loop README directory tree lists only executor config/audit/validation/prompt-pack helpers, omitting `loop-lock.ts`, `jsonl-repair.ts`, and `atomic-state.ts`. The Code Graph lib README omits `owner-lease.ts`, `canonical-db-dir.ts`, and close-DB lifecycle helpers. The ops README key-file table omits `process-memory-harness.ts` and `process-sweep.ts`, and its validation command points at `.opencode/skills/sk-code/scripts/verify_alignment_drift.py`, while the actual script lives under `assets/scripts/`.
- **Reasoning:** These READMEs are the local maintainer maps for exactly the lifecycle code arc 009 changed. Leaving them stale increases the chance that follow-up work patches the wrong module or misses the new ownership helpers entirely.
- **Suggested fix:** Update the three READMEs to include the new lifecycle modules, owner boundaries, and the real alignment verifier path. Treat README/key-file drift as part of the completion checklist for future lifecycle phases.

#### `TtlMap.has()` treats stored `undefined` as missing
- **Fingerprint:** `maintainability:memory-ttl-map:has-treats-undefined-as-missing`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:85`, `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:99`, `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:103`
- **Evidence:** `TtlMap<K, V>.set()` accepts any generic `V`, but `has(key)` is implemented as `this.get(key) !== undefined`.
- **Reasoning:** The class exposes Map-like methods, so callers can reasonably expect `has()` to mean "an unexpired entry exists" even if the stored value is `undefined`. The current implementation silently collapses "present with undefined" and "absent", which is a small API stability trap for a shared cache helper.
- **Suggested fix:** Implement `has()` by checking the internal entry and expiry directly, or explicitly constrain/document the value type as non-undefined. Add a unit case for `set(key, undefined)` if the generic API remains unconstrained.

#### `process-sweep apply --confirmed` is still a dry-run command
- **Fingerprint:** `maintainability:process-sweep:apply-command-is-dry-run`
- **File(s):** `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:126`, `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:151`
- **Evidence:** The CLI help advertises `node scripts/dist/ops/process-sweep.js apply --confirmed <token>`, but the returned payload always includes `dryRun: true`; the `apply` note says live termination is deferred.
- **Reasoning:** This was intentional for phase 005 safety, but as an operator-facing API it is now misleading. A command named `apply` with a confirmation token normally signals side effects, while here scripts must inspect the JSON note to learn nothing was applied.
- **Suggested fix:** Rename the command to `apply-plan`/`confirm-plan`, or make unsupported `apply` exit with a clear non-zero "no destructive apply exists" message until a real operator policy is implemented.

#### Phase 013 summary points at the wrong phase number
- **Fingerprint:** `maintainability:owner-lease-summary:phase-number-drift`
- **File(s):** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/implementation-summary.md:55`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/implementation-summary.md:153`
- **Evidence:** The phase 013 implementation summary opens with `Phase 003 closes the owner-lease stale-heartbeat gap`, and its suggested commit message uses `feat(010/003)` even though the folder and metadata are phase 013.
- **Reasoning:** This is a small but concrete continuity hazard. The review loop and future memory retrieval rely on phase numbers and packet paths; wrong phase labels make it harder to find the closure for the phase 007 owner-lease limitation.
- **Suggested fix:** Correct the summary text and suggested commit prefix to phase 013, then regenerate or refresh the packet metadata if any indexed trigger text was derived from the stale wording.

## Convergence Signal
- New findings this iter: 8
- Cumulative finding count after iter: 26
- New-findings ratio: 0.31
- Continue / converged signal: `continue`

## Files Touched (this iter)
- `iterations/iteration-004.md`
- `deltas/iter-004.jsonl`
- `deep-review-findings-registry.json`
- `deep-review-state.jsonl`
- `deep-review-dashboard.md`
