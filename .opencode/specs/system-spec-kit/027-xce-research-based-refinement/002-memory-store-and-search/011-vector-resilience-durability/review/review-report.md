# Deep Review Report — 027/020 vector-resilience durability

**Target:** commit `1ee9e1e767` — repair-pending sentinel at quarantine, boot resume, clear-stuck-degraded on non-repair reindex.
**Method:** 5 narrow-lens seats (cli-opencode gpt-5.5-fast, xhigh) → Fable 5 adversarial adjudication → gpt-5.5-xhigh remediation (3 coherent pieces) → Fable 5 re-verify → commit.

## Seat coverage (5 iterations)

| Seat | Lens | Raw outcome |
|------|------|-------------|
| 1 | Sentinel durability | P0 sentinel-write fail-open before destructive quarantine (+ 3 ruled_out: ordering, temp+rename, path) |
| 2 | Boot resume | P0 stale sentinel re-repairs healthy shard + P1 no idempotence guard |
| 3 | Clear-degraded | P0 non-repair reindex clears in-flight repair sentinel |
| 4 | Behavior preservation | P1 completion keyed on shard not jobId (counter skew) |
| 5 | Test rigor | P1 test gaps (+ ruled_out: live-shard safety, new-code hygiene) |

## Fable adjudication

- **D1 — sentinel fail-open: CONFIRMED P0** (worse than reported: a missing shard probes `ok` → silent empty-shard creation → recall loss with health=`healthy`). Fix: not "throw" (quarantine must proceed); surface the failure + boot backstop using the `*.quarantined-*` rename itself as the durable marker.
- **D2 — stale sentinel re-repairs healthy: P0→P1.** Wasted re-embed, not corruption. The seat's "probe-then-clear" fix is a TRAP (missing/empty shard probes ok); discriminator must be **completeness** (vec rowcount vs `memory_index` success count).
- **D3 — no idempotence guard: CONFIRMED P1** — deterministic (normal boot attaches twice → double repair). Shard-keyed in-flight guard.
- **D4 — non-repair clears in-flight sentinel: REFUTED.** The clear fires only after a same-shard reindex completed → intent satisfied; job-id gating would break the deliberate stuck-clear. Lock with a test.
- **D5 — completion keyed on shard not jobId: P2 DEFER** (cosmetic counter skew).
- **D6 — test gaps: CONFIRMED P1.**

## Remediation (3 coherent pieces around one primitive — shard completeness)

- **Piece 1:** `assess_vector_shard_repair_state` (completeness = probe-ok ∧ vecRows≥expected) drives a decision table at both attach branches: sentinel+complete → clear+no-rebuild (D2); sentinel+incomplete → resume; no-sentinel+incomplete+orphan-quarantine → schedule rebuild (D1 restart backstop). Orphan detection is exact-basename-prefix gated on `!shardComplete`, so it can't false-positive.
- **Piece 2:** in-flight repair guard in `startVectorShardRepairReindex` — dedup by resolved shardPath when status is queued/running (D3).
- **Piece 3:** sentinel write returns boolean; on failure still quarantine + schedule rebuild, log at error, surface `sentinelPersisted:false` in the degraded snapshot (D1 surface).
- **ACCEPT:** D4 untouched (no job-id gating); D5 left as-is.

## Fable re-verify: **SHIP**

All 3 pieces implemented exactly as specified; the completeness discriminator correctly handles the missing-shard-probes-ok trap (a legitimate sentinel still resumes because `vecRows=0 < expected`); the intended stuck-degraded-clear is untouched; 4/5 new tests fail on the old code (the sentinel-ordering test is a deliberate regression lock); fixture-safety + comment-hygiene PASS. Five P3 observations (count-based vs identity-join completeness; COUNT-error fails-toward-complete with backstop recovery; cosmetic re-attach skew; double probe; dist-rebuild deploy note) — none gate the commit.

## Verification after remediation

- `tsc --noEmit`: 0. `tests/vector-shard-read-path-resilience.vitest.ts`: 8/8 (incl. 4 new invariant locks). `validate.sh --strict`: 0/0. Comment hygiene + fixture safety: clean.
- No live `mcp_server/database/**` shard or host daemon touched.

**Deploy note:** the running daemon picks up the fix only after a `dist/` rebuild + recycle, which is left to the operator (this work never touches host daemons).

**Disposition:** 020 review complete; D1/D2/D3 fixed via one coherent completeness-based design; D4/D5 adjudicated as intended/deferred; D6 tests added.
