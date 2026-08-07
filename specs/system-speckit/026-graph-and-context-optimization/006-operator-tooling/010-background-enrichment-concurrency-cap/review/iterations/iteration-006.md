# Deep-Review Iteration 6 (opus-4.8) — codebase consistency + contract

## Verdict: CONDITIONAL — 1 NEW P2 (P1 parity), 1 confirms-prior P2; contract/types SOUND.

- **F-008 (P2, P1-parity, NEW): Enrichment scheduler unfenced in `fatalShutdown` → post-close DB write re-dirties WAL.** `fatalShutdown` (`context-server.ts:1606-1683`) deliberately fences `fileWatcher` (1634-39) and `ingestWorker` (1640-45) *before* `closeDb()` (1646), because `requireDb()` REOPENS a closed DB (`vector-index-store.ts:2049/2081`; `close_db` sets `db=null` 2280) — not throws. The enrichment scheduler is **absent from that fence list**, so the run's `try{db=requireDb()}catch{return}` does NOT trip on a clean close; it proceeds to `recordEnrichmentResult` (a WRITE) after the shutdown checkpoint, re-dirtying the WAL + unclean-shutdown marker. Window is real (later shutdown `await`s let queued `setImmediate(run)`s fire). **Fix:** add enrichment to the fence before `closeDb` (a `shuttingDown` flag + clear queue; route DB access through a shutdown-refusing accessor mirroring `job-queue.ts:192-197`). P2: WAL bounded by `wal_autocheckpoint=256`, data backfill-recovered, harm operational (needless boot rebuild). Parity (codebase fences this twice) → argues P1.
- **F-007 confirmed** (queue unbounded) — sibling `job-queue.ts:711-723` caps `pendingQueue` + evicts oldest; this queue should mirror that.
- Sibling idiom: the `setImmediate` re-arm MATCHES `job-queue.ts` (justified bespoke; no shared util to reuse). Call-site contract, TS strict types, `void` discard: all SOUND.

## Convergence impact: CONDITIONAL — shutdown-fence gap is a real new finding.
