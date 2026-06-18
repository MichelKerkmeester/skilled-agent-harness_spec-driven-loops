# Deep Review Report — 027/023 idempotency flag-ON correctness

**Target:** `lib/storage/idempotency-receipts.ts` + `handlers/memory-save.ts` idempotency path (`SPECKIT_MEMORY_IDEMPOTENCY`, default OFF) + the idempotency test.
**Method:** 3 narrow-lens seats (cli-opencode gpt-5.5-fast, xhigh) → Fable 5 adversarial verify → remediation → re-verification → commit.

## Seat coverage (3 iterations)

| Seat | Lens | Outcome |
|------|------|---------|
| 1 | Idempotency correctness | 1× P0 (concurrency race) + 4 ruled_out (replay exact, receipt_key PK, guard correct, conflict semantics correct) |
| 2 | Flag-off / scope / hygiene | Clean (findings []) |
| 3 | Adversarial / tests | 1× P0 (same concurrency race, corroborated) + 1× P1 (flag-off no-op not asserted) + 3 ruled_out (failed-save leaves no blocking receipt, normalization stable, near-duplicate not double-applied) |

## Implementation fixes (the original #31 change)

- **Replay exactness:** replay now returns the original stored MCP response verbatim (was injecting a `replayed` marker).
- **Immutable first-write:** `ON CONFLICT(receipt_key) DO NOTHING` (was `DO UPDATE`, which let a later same-key write overwrite the original).
- **Narrowed receipt-write guard:** stores only non-error `indexed`/`updated`/`deferred` saves with id > 0 (so duplicate/unchanged/error/abort never leave a blocking receipt).

## Fable adversarial verdict: SHIP-WITH-FIXES

All six adversarial items PASS (replay exactness, immutable first-write, receipt-write guard, flag-off no-op, normalization, tests genuinely discriminate pre/post-fix). Fable **downgraded the seats' concurrency P0 to LOW**: there is **no duplicate side effect** — a concurrent loser that misses the lookup re-runs the save, but the `idx_memory_logical_key_active_unique` constraint + dedup make it `unchanged`/`duplicate`, and the narrowed guard then skips the loser's receipt write entirely. The only divergence was the loser returning its own honest result instead of the winner's replay on a rare concurrent first-collision — "not a correctness lie," bounded.

## Remediation applied here

- **Concurrency loser-replay (Fable's suggested fix):** `storeIdempotencyReceipt` now returns won/lost (INSERT `changes`). On a lost first-write race, the memory-save call site re-reads via the new `lookupIdempotencyReceiptByKey` and replays the winner's response instead of returning its own. Closes the one residual the seats raised.
- **P1 test-gap (seat 3):** added a flag-off no-op assertion (`isMemoryIdempotencyEnabled()` false by default) — the suite's `beforeEach` forces the flag ON, so flag-off had no direct coverage. Added a won/lost-replay test covering the new path.

## Rollout-gating follow-ons (documented, NOT fixed here — for the eventual flag-ON enablement packet)

1. **Stale compiled `dist/`** — the running daemon executes the old `DO UPDATE`/replay-marker behavior until `npm run build` + a daemon restart. Operator deploy step (this work never touches host daemons). The flag stays default-OFF, so live behavior is unaffected.
2. **Pre-existing (defect 3):** a `force: true` retry of identical content yields `idempotency_key_conflict` (`force` is in the payload hash but not the fingerprint); receipts have no TTL and survive memory deletion, so a save retried after deletion replays a stale response. Both predate this phase — candidates for the enablement packet.
3. **(P3):** guard test lacks positive `updated`/`deferred` cases.

## Verification after remediation

- `tsc --noEmit`: 0. `SPECKIT_MEMORY_IDEMPOTENCY=true vitest memory-idempotency-and-near-duplicate`: 12/12 (was 10; +won/lost-replay +flag-off). Flag-off run: green (no regression). Comment hygiene: clean. Flag remains default-OFF.

**Disposition:** 023 review complete. The three core flag-ON correctness fixes are confirmed correct; the concurrency loser-replay residual is fixed; the flag-off test-gap is closed. Enablement remains gated pending the dist rebuild + the documented follow-ons.
