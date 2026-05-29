# Deep Review Report — 011 (opus-4.8 / Workflow-executed)

**Verdict: CONDITIONAL**  ·  Release-readiness: **converged**  ·  P0 **0** / P1 **9** / P2 **16**  ·  10/10 iterations  ·  4/4 dimensions  ·  adversarial P0 replays: 0 (no P0 raised)

> Executed via the Workflow tool with opus-4.8 agents per operator request, reproducing the deep-review skill contract (fresh context per iteration, P0/P1/P2 + `[SOURCE:file:line]`, per-iteration verdict, adversarial P0 replay, externalized state). Single state-writer: the main agent (mirrors `reduce-state.cjs`).

## 1. Executive Summary

Ten fresh-context opus-4.8 iterations reviewed the recent daemon-shutdown / memory-DB-lifecycle (008/009/010) and code-graph (012 + 15-bug) surface across all four deep-review dimensions. Result: **0 P0, 9 P1, 16 P2** (25 unique after content-hash dedup). **No P0** survived — in fact none were raised, so the adversarial-replay stage had nothing to refute. The verdict is **CONDITIONAL**: the shipped fixes are sound in their core paths, but nine P1s harden the edges — chiefly WAL-checkpoint completeness on non-active connections, a stale self-heal verification gate, and the daemon shutdown/lease lifecycle (much of which sits in the 007 launcher layer that was out of scope and needs confirmation before fixing).

## 2. Planning Trigger

CONDITIONAL verdict → a remediation packet is warranted (not release-blocking). The P1s are concentrated in two skills' daemon/lifecycle code; group them into the workstreams below. Several P1s are explicitly confidence-bounded by code that was out of this run's scope (the 007 launcher layer, multi-connection runtime topology) — confirm those before implementing.

## 3. Active Finding Registry

### P1 (CONDITIONAL — remediate or accept with rationale)

| ID | Sev | Source | Category | Conf |
|----|-----|--------|----------|------|
| IT10-CMP-01 | P1 | `owner-lease.ts:launcher.cjs:778-786; index.ts:46-58; owner-lease.ts:442-451` | cross-consumer reliability / silent cascade failure | 0.78 |
| IT10-CMP-03 | P1 | `index.ts:96-125, 139` | incomplete shutdown / lease leak on standalone run | 0.74 |
| IT02-CORR-01 | P1 | `ensure-ready.ts:632, 704, 718-730` | stale-verification-gate-after-self-heal | 0.82 |
| IT07-CORR-01 | P1 | `ensure-ready.ts:552-561` | cross-file edge prune correctness | 0.82 |
| IT10-CMP-02 | P1 | `owner-lease.ts:326-429 (acquireOwnerLease), 457-473 (releaseOwnerLease)` | dead code / duplicated single-writer implementation | 0.82 |
| IT08-CORR-1 | P1 | `shutdown-hooks.ts:125-148 (vs context-server.ts 1547-1552)` | double-shutdown / competing signal handlers | 0.82 |
| IT01-CORR-001 | P1 | `vector-index-store.ts:1289-1296` | WAL checkpoint lifecycle / corruption-prevention asymmetry | 0.78 |
| IT01-CORR-002 | P1 | `vector-index-store.ts:804-814, 1292` | Shard WAL checkpoint ordering on non-active connections | 0.7 |
| IT04-SA-001 | P1 | `implementation-summary.md:84-94 (verification table); 22-23 (continuity completion_pct: 90 / next_safe_action)` | completion-metadata-inconsistency | 0.9 |

### P2 (advisory)

| ID | Sev | Source | Category | Conf |
|----|-----|--------|----------|------|
| IT03-SEC-01 | P2 | `detect-changes.ts:138-144` | byte-safety / docs-vs-code | 0.9 |
| IT02-CORR-03 | P2 | `query.ts:912-913, 920-921` | cross-consumer-block-message-divergence | 0.7 |
| IT10-CMP-04 | P2 | `index.ts:53-56` | error-swallowing / observability gap | 0.7 |
| IT02-CORR-02 | P2 | `ensure-ready.ts:668-676, 726-728` | selfHeal-metadata-inconsistency-firstTimeAutoEstablish | 0.74 |
| IT07-CORR-02 | P2 | `owner-lease.ts:108-120` | lock-file resource lifecycle | 0.74 |
| IT07-CORR-03 | P2 | `structural-indexer.ts:2137-2160` | abort granularity / wasted work | 0.7 |
| IT03-SEC-02 | P2 | `tool-schemas.ts:239-257` | MCP input schema enforcement | 0.85 |
| IT09-COR-2 | P2 | `context-server.ts:1994` | correctness-confirmation | 0.9 |
| IT08-CORR-2 | P2 | `shutdown-hooks.ts:38, 129-134` | signal-vocabulary asymmetry | 0.9 |
| IT01-CORR-003 | P2 | `vector-index-store.ts:811-813, 1292` | Module-global telemetry coherence during multi-connection close | 0.66 |
| IT09-PROV-1 | P2 | `vector-index-store.ts:1313-1317` | provenance/WIP-status | 0.97 |
| IT09-COR-1 | P2 | `vector-index-store.ts:1305-1310` | correctness-confirmation | 0.93 |
| IT06-CM-01 | P2 | `vector-index-store.vitest.ts:78-102` | test-coverage-gap | 0.72 |
| IT05-TRACE-002 | P2 | `implementation-summary.md:92-101` | docs-traceability | 0.8 |
| IT05-TRACE-001 | P2 | `spec.md:77-86` | docs-traceability | 0.85 |
| IT04-SA-002 | P2 | `implementation-summary.md:117` | verification-evidence-gap | 0.85 |

Full per-finding evidence, rationale, and one-line fixes are in `iterations/iteration-001..010.md` (each cites `[SOURCE:file:line]`) and `deep-review-findings-registry.json`.

## 4. Remediation Workstreams

### WS-1 · spec-memory WAL-checkpoint completeness (non-active connections)
Findings: IT01-CORR-001, IT01-CORR-002

The checkpoint-on-close fix (008) truncates the WAL only for the ACTIVE db; tracked NON-active connections + their attached shards close without the same `wal_checkpoint(TRUNCATE)`, leaving a larger corruption window at rest in multi-path deployments. Mirror the active-db checkpoint block (main + shard) inside the db_connections close loop. NOTE: severity is gated by whether >1 connection ever co-exists at runtime — verify; drops toward P2 if only one connection is ever live.
- **IT01-CORR-001** [P1] `vector-index-store.ts:1289-1296` — fix: Before `conn.close()` in the loop, run `try { conn.pragma(`${ACTIVE_VECTOR_SCHEMA}.wal_checkpoint(TRUNCATE)`); } catch {}` and `try { conn.pragma('wal_checkpoint(TRUNCATE)'); } catch {}` mirroring the active-db block so all tracked connections checkpoint+truncate before close.
- **IT01-CORR-002** [P1] `vector-index-store.ts:804-814, 1292` — fix: In the close_db loop, checkpoint the shard WAL (`conn.pragma(`${ACTIVE_VECTOR_SCHEMA}.wal_checkpoint(TRUNCATE)`)` best-effort) before calling detachActiveVectorShard(conn), matching the active-db ordering.

### WS-2 · code-graph self-heal correctness
Findings: IT02-CORR-01, IT07-CORR-01

Two independent correctness defects in ensure-ready.ts: (a) `verificationGate` is captured once BEFORE the inline scan and reused stale, so a successful self-heal still returns a 'fail' gate and reads stay blocked until an explicit scan (false-safe in direction, but the self-heal cannot clear the gate); (b) cross-file edge-prune correctness at 552-561 flagged for review. Recompute the gate after a successful inline reindex; confirm the edge-prune path.
- **IT02-CORR-01** [P1] `ensure-ready.ts:632, 704, 718-730` — fix: Re-read gold verification AFTER the inline scan completes (recompute `verificationGate` from a fresh `getLastGoldVerification()` in the post-scan return at lines 718-730 and 750-765), or explicitly set verificationGate to 'absent' when inlineIndexPerformed is true and no verification was run inline.
- **IT07-CORR-01** [P1] `ensure-ready.ts:552-561` — fix: In ensure-ready.ts indexWithTimeout, persist with persistIndexedFileResult(result, { deferDanglingTargetPrune: true }) and call graphDb.pruneDanglingEdges() once after the loop (mirroring scan.ts:600/715), at least when results.length > 1.

### WS-3 · daemon shutdown + lease lifecycle
Findings: IT08-CORR-1, IT10-CMP-01, IT10-CMP-02, IT10-CMP-03

Cluster around the daemon-reliability layer: competing/duplicated signal handlers between shutdown-hooks.ts and context-server.ts (double-shutdown risk); a launcher handoff-failure that can cascade silently; dead/duplicated single-writer lease functions (owner-lease.ts:326-429); and an incomplete-shutdown / lease-leak path on the standalone index.ts entry. Consolidate signal handling, prune dead lease code, and ensure standalone shutdown releases the lease. NOTE: several rest on the 007-layer caller code that was OUT of scope this run — confirm against launcher.cjs before fixing.
- **IT08-CORR-1** [P1] `shutdown-hooks.ts:125-148 (vs context-server.ts 1547-1552)` — fix: Make shutdown-hooks' installProcessHooks() NOT auto-register process-level SIGTERM/SIGINT handlers when context-server owns teardown (e.g. gate behind an opt-in flag, or have context-server be the sole signal owner and call runShutdownHooks() itself — which it already does at line 1474).
- **IT10-CMP-01** [P1] `owner-lease.ts:launcher.cjs:778-786; index.ts:46-58; owner-lease.ts:442-451` — fix: Make the launcher handoff failure recoverable: retry refreshOwnerLeaseFile to childPid (bounded) or treat persistent handoff failure as fatal at launch (kill child + report) rather than logging and continuing into a 20s-delayed silent suicide.
- **IT10-CMP-02** [P1] `owner-lease.ts:326-429 (acquireOwnerLease), 457-473 (releaseOwnerLease)` — fix: Either delete the unused acquireOwnerLease/releaseOwnerLease (keep only refreshOwnerLease + helpers actually used) OR have the TS server/launcher consume them so a single implementation is authoritative; document the CJS launcher as the production lease owner if duplication is intentional.
- **IT10-CMP-03** [P1] `index.ts:96-125, 139` — fix: Either guard the heartbeat so a MISSING lease (vs a MOVED lease) does not trigger self-shutdown (only shut down when holder exists with a different pid), or have index.ts acquireOwnerLease on startup when no launcher handoff is detected so standalone runs are self-consistent.

### WS-4 · completion-metadata reconciliation
Findings: IT04-SA-001

A shipped packet's implementation-summary verification table claims completion state inconsistent with evidence. Reconcile the packet's status/verification metadata.
- **IT04-SA-001** [P1] `implementation-summary.md:84-94 (verification table); 22-23 (continuity completion_pct: 90 / next_safe_action)` — fix: Reconcile 009: either run/record the staged verification (node --check, build, vitest, regex, validate.sh) and fill the table with PASS rows + set completion_pct: 100, OR downgrade spec/impl Status to 'in-progress' until evidence exists.

## 5. Spec Seed

A follow-up fix packet (suggested home: `007-mcp-daemon-reliability/0NN-deep-review-011-remediation`) should specify: (REQ) checkpoint+truncate all tracked DB connections (not just active) before close; (REQ) recompute the code-graph verification gate after a successful inline self-heal; (REQ) consolidate daemon signal handling + release the lease on standalone shutdown + remove dead lease code; (REQ) reconcile the flagged completion-metadata table. Each fix ships with a regression test, per the deep-review fix-completeness gate.

## 6. Plan Seed

Order: WS-2 (self-heal gate — pure correctness, contained) → WS-1 (WAL completeness — extends the 008 pattern, low risk) → WS-4 (doc metadata — trivial) → WS-3 (shutdown/lease — LAST, requires reading the out-of-scope 007 launcher layer first to confirm severity; coordinate with the parallel session actively editing this code). Confirm the multi-connection runtime topology before sizing WS-1/3 (several P1s drop to P2 if only one connection is ever live).

## 7. Traceability Status

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code (008/009/010 ↔ spec-memory code) | COVERED | iteration-004 |
| spec_code (012 ↔ code-graph code) | COVERED | iteration-005 (PASS) |
| checklist_evidence (tests ↔ claims) | COVERED | iteration-006 (PASS) |
| Resource Map Coverage Gate | N/A | resource-map.md absent at init |

## 8. Deferred Items

All 16 P2 findings are advisory and deferred (style, docs-vs-code nits, telemetry coherence, test-coverage gaps, byte-safety doc drift, uncommitted-WIP provenance). They do not block. See the P2 table above + iteration files. Iteration-009 separately **confirmed the uncommitted working-tree enhancements** (`checkpointAllWal` + shard checkpoint-before-detach) are correct, flagged as not-yet-committed.

## 9. Audit Appendix

- **Method:** 10 fresh-context opus-4.8 iterations (Workflow `watmqyld2`, 780K tokens, 162 tool calls, ~4.5 min) across Correctness×5, Security×1, Spec-Alignment×2, Completeness×2; per-iteration verdict; adversarial P0 replay stage (0 P0 raised → no replays needed).
- **Read-only:** no file under review was modified.
- **Scope:** on-disk current files (working tree included a parallel session's uncommitted edits to context-server.ts / vector-index*.ts; iteration-009 reviewed those and flagged provenance).
- **Limits (from coverage notes):** the 007 launcher layer (`launcher.cjs` reap/respawn/RSS-watchdog) was OUT of scope and read only via grep — WS-3 severities are bounded by that. Multi-connection runtime topology not confirmed at runtime — WS-1 severity is bounded by it. No build/test was run (read-only). Several findings are confidence < 0.8 and self-flagged as needing runtime confirmation.
- **State:** `deep-review-config.json`, `deep-review-state.jsonl` (config + 10 iteration records), `deep-review-findings-registry.json`, `deep-review-strategy.md`, `deep-review-dashboard.md`, `iterations/iteration-001..010.md`.

