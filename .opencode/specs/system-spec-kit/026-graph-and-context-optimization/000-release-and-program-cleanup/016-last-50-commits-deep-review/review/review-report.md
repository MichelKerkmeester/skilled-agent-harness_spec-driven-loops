---
title: "Deep Review: last 50 commits (a9e9bdb0a5^..HEAD)"
description: "20-iteration deep review across 9 research angles of the last 50 commits. Verdict CONDITIONAL: 0 P0, 3 actionable P1 (all recoverable), ~17 P2 advisories. Many seeded P0 hypotheses adversarially refuted."
trigger_phrases:
  - "last 50 commits deep review"
  - "016 deep review findings"
  - "ingest worker shutdown durability finding"
  - "socket-server TOCTOU review"
importance_tier: "important"
contextType: "implementation"
---

# Deep Review Report — last 50 commits

> Target: git range `a9e9bdb0a5^..HEAD` (50 commits, HEAD `12de3d3a7e`). Read-only. 20 iterations, 9 research angles, native `@deep-review` (opus), parallel fan-out.

## Verdict: CONDITIONAL (hasAdvisories=true)

- **P0: 0** — no data loss, security escalation, or corruption found (explicitly checked; see Refuted).
- **P1: 3 actionable** (all recoverable / process-level, none a release blocker on their own).
- **P2: ~17** hardening + advisory items.

No active P0 → not FAIL. Multiple active P1 → not PASS. Route P1s to a remediation packet (`/speckit:plan`).

## Method
20 iterations: inventory (1) → correctness A1-A4 (2-5) → security A5 (6) → maintainability A6 (7) → traceability A7-A9 (8-10) → adversarial verification of every candidate P1 (11-15) → deepen latent items (16-18) → cross-cutting synthesis (19) → completeness critic (20). Every P1 carries a concrete file:line failure trace. Round-2 skeptic passes downgraded 4 of 5 candidate P1s — see Refuted.

---

## P1 — actionable

### F-A4-01 (P1, correctness/lifecycle) — ingest worker not fenced on shutdown
`context-server.ts:1563-1610` (`fatalShutdown` cleanup list has no job-queue stop) · `job-queue.ts:694-722,746-785` (worker loop has only a `workerActive` re-entrancy latch, no `shuttingDown`/abort guard, exports no stop fn) · `vector-index-store.ts:1644-1664,1491-1562,1975` (`requireDb→getDb=get_db=initialize_db` is the reopen path; `tryGetDb` non-reopen is never used by the worker).
**Trace:** SIGTERM → `fatalShutdown` runs cleanup *without stopping the ingest worker* → `close_db` does `wal_checkpoint(TRUNCATE)` + close + removes `.unclean-shutdown` + `db=null` → the still-live worker's `requireDb()` reopens a fresh DB, re-writes the `.unclean-shutdown` marker, and writes new WAL frames with no subsequent checkpoint → at rest: dirty marker + non-empty WAL (the exact window `close_db` exists to close). Verified (iter-12) that NO fence exists anywhere.
**Severity:** P1 not P0 — boot repairs the marker and re-enqueues incomplete jobs (recoverable). Operationally reachable under the concurrent-session daemon.
**Fix:** add a job-queue `stopWorker()`/drain-fence called in `fatalShutdown` before `vectorIndex.closeDb()` (mirror the existing file-watcher-first ordering at `:1586-1592`), and/or have the worker switch to `tryGetDb()` once a shared shutting-down signal is set.

### F-X19-02 (P1, correctness/lifecycle) — compound shutdown failure under concurrent-session SIGTERM
Divergent signal-handler stacks: `context-server.ts:1681-1692` (exit 0) vs `lib/runtime/shutdown-hooks.ts:129-148` (exit 143/130). They can race and **bypass** `fatalShutdown`'s ordered drain that F-A4-01's recoverability implicitly assumes, coupling F-A4-01 (dirty WAL) + F-A4-03 (non-re-entrant socket server → forced EADDRINUSE reclaim branch) into a worse combined failure. Subsumes F-A4-02 (non-deterministic exit code) + F-A4-03.
**Fix:** unify to one ordered shutdown path with a deterministic exit code; this is the highest-leverage lifecycle remediation (keystone for the A4 cluster).

### F-X19-01 (P1 systemic → see nuance) — runtime copy-paste forks without complete drift guards
The repo ships a generic drift-verify harness (`deep-improvement/scripts/lib/mirror-sync-verify.cjs`) for agent mirrors but it is not aimed at runtime code forks. `processLiveness` is forked into `mk-code-index-launcher.cjs:296-306`. **Nuance (iter-15):** the highest-risk fork — `system-code-graph/.../socket-server.ts` (byte-identical to `shared/ipc/socket-server.ts`) — *is* already guarded by `system-code-graph/mcp_server/tests/lib/ipc-socket-drift.vitest.ts`, so the security-amplifier framing is mitigated for that file. Residual P1: other runtime forks (processLiveness, and any future shared-only fix) lack equivalent guards.
**Fix:** point a drift guard at the remaining runtime forks; treat "fork a runtime module" as requiring a sync test.

### F-CC-01 (P1 process/coverage — code SOUND, no defect)
The security pass (iter-6) covered only socket TOCTOU + validator DoS and never opened the range's primary cross-tenant hardening: `memory-search.ts` (IDOR guard `resolveTrustedSession` + `filterRowsByScope`) and `memory-context.ts` (`resolveNoSessionAnchor`). Iter-20 read them — **the fixes are sound**. This is a review-coverage gap, now closed, with no code finding. Recorded for honesty, not for remediation.

---

## P2 — advisories (grouped; ~17)

**Lifecycle / IPC hardening**
- F-002 lease EPERM reclaim double-block (`mk-spec-memory-launcher.cjs:339,346-348,361,643`) — confirmed structural but EPERM-on-live is the documented-correct cross-sandbox semantic; only the cross-uid PID-reuse corner wedges. F-004 lease reclaim fsync asymmetry (`:281-285` vs `:294`) — advisory (atomic rename, self-heal via 30s heartbeat).
- F-A5-01 + F-A5-03 socket tail-symlink TOCTOU on fresh bind + fail-open canonicalization (`shared/ipc/socket-server.ts:238,355,94-98`; byte-identical in code-graph fork). Bounded to DoS-on-contested-dir / same-uid self-race by the bind-time uid/mode fence (`:244-260`); no cross-uid hijack (launcher creates a 0700 service subdir, never bare `/tmp`). Fix both forks: lstat-reject symlink tail on fresh bind, `open(O_NOFOLLOW)`+`fchmod`, fail-closed canonicalize.
- F-A5-02 validator unbounded DFS (`orchestrator.ts:292-321`) on every `--strict` run — DoS amplification; add node/depth/time caps. F-A4-03 non-re-entrant `startIpcSocketServer` (module-global `activeServer/activeSockets`).

**Memory-write / causal**
- F-A2-01 enrichment skip-guard checks only `deprecated`, not `archived` (`memory-save.ts:2877` vs `hybrid-search.ts:2061`) — DORMANT (no writer emits `archived`; triple-locked by DB CHECK + MCP enum + writer census). F-A2-02 stale doc-comment call sites (`entity-density.ts:156-157`). F-A2-03 E089 `'access denied'` over-broad substring (`response-builder.ts:526`) — benign (Node uses `'permission denied'`).
- F-A3-01 opt-in `contradicts` collector can materialize reciprocal pairs the directional model never reconciles — no consumer assumes mutual exclusivity; trust-tree is dormant in prod (`memory_context`/`memory_search` pass no `causal:` key). F-A3-02 dryRun default clarity (fail-safe confirmed).

**Contract / config / docs / tests**
- F-A7-01 `embedder_list/set/status` advertise `[L7:Maintenance]` but are absent from `TOOL_LAYER_MAP` (`tool-schemas.ts:609-633` vs `layer-definitions.ts`) — served ListTools output is correct; programmatic `getLayerForTool` returns null.
- F-A8-01 dangling `.gemini/agents/` refs survive in `.claude/agents/` + `.codex/agents/` mirrors (`orchestrate.md:21` etc.) — inert (no runtime resolves them). F-A8-02 `_NOTE_HF_EMBED_SOCKET`/`_NOTE_TOTAL_MCP_BUDGET` missing from `.codex/config.toml` + `.devin/config.json` — the load-bearing `HF_EMBED_SERVER_URL` value is already identical, only the warning note is absent.
- F-A9-01 `changelog-000-015-docs-drift-review.md:24` says "2 P0" — faithful transcription of the 015 review-report's own summary-table miscount (its per-finding table lists 1 P0). Upstream defect; route to a 015 follow-on. (The 33 changelogs were otherwise verified remarkably accurate.)
- F-A6-01 auto-fix integrated OR-path (`quality-loop.ts:591`) untested end-to-end — the default-true flag IS unit-covered (`search-flags.vitest.ts:254`); add one advisory+unset integration test. F-A6-02 contradiction-cycle test gap (`relation-backfill-conflict.vitest.ts` only 2-node). F-A6-03 fixtures written into the working tree + ~7 no-op guarded assertions. F-X19-03 default-on flips share an untested `SPECKIT_ROLLOUT_PERCENT` bucketing branch (`rollout-policy.ts:46-74`). F-CC-P2-01/02 unreviewed low-risk tooling/CI scripts (doctor, deep-improvement, comment-hygiene).

---

## Refuted / no-drift (adversarial honesty)
Seeded hypotheses tested and DISPROVEN by reading HEAD — recorded so they are not re-raised:
- Lease-CAS reclaim TOCTOU + LEASE_HELD_BY/proxy-stdout collision (re-read serializes racers; proxy owns stdout).
- "No final WAL checkpoint on shutdown" — `close_db` does `wal_checkpoint(TRUNCATE)` on all connections before close.
- Fan-out non-zero-exit/timeout counted as success — `fanout-run.cjs:464,471-480` throws; `fanout-pool` counts only fulfilled (memory `deep-loop-fanout-spawnsync-serialization` no longer live at HEAD).
- Validator entry-guard "bypass" as a security hole — `validateFolder()` gates no privileged action; bypass skips a report, not a gate.
- `backfillJob.implemented=false` contract dishonesty — stale; HEAD re-wired a real bounded backfill (`relation-coverage.ts:110-115`).
- Launcher-lease socketPath test race — test waits for socket existence AND `STUB_DAEMON_LISTENING` (emitted inside `listen()` callback).
- "code-index missing owner-lease" — refuted (has 9 owner-lease tokens); session-proxy asymmetry is intentional (secondaries bridge, don't wedge).
- Async-enrichment pre-commit mutation / exec-status collapse / entity-density invalidation gaps — all defended in code.

## Remediation order (for /speckit:plan)
1. **F-X19-02** unify the shutdown signal-handler stack (keystone — unblocks the A4 cluster).
2. **F-A4-01** fence/stop the ingest worker before `close_db`.
3. **F-X19-01** drift guard for the remaining runtime forks.
4. P2 batch: socket-bind hardening (F-A5-01/03, both forks), validator DFS caps (F-A5-02), the auto-fix + rollout-bucket tests (F-A6-01/F-X19-03), config-note parity (F-A8-02), the 015 changelog miscount (F-A9-01).

## Coverage & residual
High-churn hotspots fully reviewed (relation-backfill 748, launcher 416, socket-server 402, memory-save 307, causal-graph 189, fanout-run 169) + the IDOR/scope handlers (iter-20). Residual un-reviewed: low-risk tooling/CI scripts (F-CC-P2-01/02). No angle relied on inference without code reads; no P1 lacks a file:line trace.
