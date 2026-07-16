# Batch Still-Real Verification — L3 Idempotency Flag-ON Blockers

> **Verifier:** Fable 5 (fresh context) · **Date:** 2026-06-12
> **Scope:** 5 findings on the `SPECKIT_MEMORY_IDEMPOTENCY` flag-ON path (receipt key variance, loser replay, update-path winner semantics) in the spec-memory mcp_server.
> **Method:** Every verdict read against CURRENT code; banked line numbers re-derived, not trusted.

---

## Summary

| id | verdict | current evidence | fix class |
|----|---------|------------------|-----------|
| tri-000 | STILL-REAL | `mcp_server/handlers/memory-save.ts:3463-3475` (fingerprint omits `force`, payload spreads full args); `mcp_server/lib/storage/idempotency-receipts.ts:87-102` (receiptKey excludes payloadHash) | code-small |
| tri-001 | STILL-REAL | `mcp_server/handlers/memory-save.ts:3620-3637` (lost-store winner returned only on `replay`; `conflict` falls through to loser's own response); `mcp_server/lib/storage/idempotency-receipts.ts:136-137` | code-careful |
| tri-002 | STILL-REAL | `mcp_server/handlers/memory-crud-update.ts:549-555` (store boolean ignored, no winner lookup); contrast `memory-save.ts:3620-3631` | code-small |
| tri-048 | STILL-REAL | `mcp_server/lib/search/vector-index-schema.ts:656-670` (timestamps + `ON DELETE SET NULL` FK only); repo-wide search finds no TTL config, no expiry query, no `DELETE FROM memory_idempotency_receipts` outside tests | code-small |
| tri-095 | STILL-REAL | `mcp_server/README.md:262` (replayable "because it relies on primary-row dedup", no caveat) vs `.opencode/bin/lib/launcher-session-proxy.cjs:146-153` (explicit KNOWN GAP: duplicate secondary-index rows) | doc-only |

**Result: 5/5 STILL-REAL.** None moved, none overtaken. The recent single-writer kernel DB lock, source-kind guards, and scrubber relocation do not touch any of these paths.

**Interlock:** tri-000 + tri-001 + tri-002 must ship together (see below). tri-048 and tri-095 are independent.

---

## Per-Item Notes

### tri-000 (P1) — Force retries share the save receipt key but change the payload hash — STILL-REAL

- **Current evidence:** `memory-save.ts:3460-3476` — `requestFingerprint` is `{filePath, contentHash, routeAs, mergeModeHint, targetAnchorId, scope}` with no `force` field (3463-3470), while `payload` spreads the full args record (3471-3475), which carries `force` (threaded through the handler, e.g. `memory-save.ts:3508` `{ force }`). `idempotency-receipts.ts:87-102` — `deriveIdempotencyReceiptKey` builds `receiptKey` from `{operation, contentHash, requestFingerprintHash}` only; `payloadHash` is computed but excluded from the key material. `normalizeForHash` (lines 59-79) strips only client idempotency-token keys, not `force`.
- **Consequence confirmed:** after a successful save stores a receipt, retrying the identical file with only `force` flipped yields the same `receiptKey` but a different `payloadHash` → `lookupIdempotencyReceiptByKey` returns `conflict` (`idempotency-receipts.ts:136-137`) → handler returns `idempotency_key_conflict` (`memory-save.ts:3481-3491`) instead of executing the intentional forced write.
- **Risk note:** with the flag ON, an operator cannot force past a stale receipt — forced retries are hard-blocked until the receipt row is manually removed (and per tri-048 there is no expiry to age it out).
- **Fix class:** code-small — include `force`/retry intent in the server-derived fingerprint, or define a forced-write policy that bypasses/refreshes the receipt.
- **Interlocks:** with tri-001/tri-002 — changing fingerprint composition changes which requests collide, which changes when the lost-store `conflict` branch (tri-001) can occur. Ship as one unit.

### tri-001 (P1) — Concurrent changed-payload save loser mutates but does not fail or replay — STILL-REAL

- **Current evidence:** `memory-save.ts:3620-3631` — on lost first-write race (`storeIdempotencyReceipt` returns false; `idempotency-receipts.ts:163` `ON CONFLICT(receipt_key) DO NOTHING`, 173-175), the handler looks up the winner and returns it **only** when `winner.status === 'replay'` (3628-3629). When the winner's stored `payload_hash` differs (possible because `payloadHash` is not part of `receiptKey` — see tri-000), lookup returns `conflict` (`idempotency-receipts.ts:136-137`) and control falls through to `return response` at 3637: the loser's own, already-mutated, divergent success response with no conflict signal.
- **Overtaken check:** changelog `v3.6.0.0.md:63` records the same-payload loser-replays-winner fix — that shipped path is the `replay` branch at 3627-3630. The changed-payload (`conflict`) branch of the same race was NOT covered by that fix and remains open. Not overtaken.
- **Risk note:** under same-key/different-payload contention, both callers' mutations land but only the winner's response is canonical in the receipt — the loser silently reports a success the receipt system will later contradict (replay or conflict on retry).
- **Fix class:** code-careful — requires a decision on loser semantics (rollback the loser's mutation vs deterministic conflict response); touches the post-mutation race window.
- **Interlocks:** with tri-000 (key composition determines when this branch is reachable) and tri-002 (the update handler needs the same semantics). Ship as one unit.

### tri-002 (P1) — memory_update lost-store path ignores immutable receipt winner — STILL-REAL

- **Current evidence:** `memory-crud-update.ts:549-555` — `storeIdempotencyReceipt(database, idempotencyKey, response, ...)` is called as a bare statement at line 551; the returned boolean is discarded and there is no winner lookup. The handler's import list (`memory-crud-update.ts:31-34`) does not even import `lookupIdempotencyReceiptByKey`. Contrast the save handler, which checks `won` and replays the winner (`memory-save.ts:3620-3631`).
- **Consequence confirmed:** concurrent same-key `memory_update` losers return their own response instead of the canonical first response, so the "first write wins, retries replay" contract holds only for `memory_save`.
- **Risk note:** divergent client-visible results for concurrent identical updates; receipt table then replays a response some clients never saw.
- **Fix class:** code-small — mirror the save handler's lost-store winner lookup, including whatever explicit `conflict` handling tri-001 settles on.
- **Interlocks:** with tri-001 — the conflict-branch semantics chosen there must be mirrored here; ship as one unit with tri-000/tri-001.

### tri-048 (P2) — Receipt TTL is not implemented — STILL-REAL

- **Current evidence:** `vector-index-schema.ts:656-670` — `memory_idempotency_receipts` carries `created_at`/`updated_at` defaults and `FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE SET NULL` (line 668): a memory delete at most nulls the pointer, it never removes the receipt. Repo-wide search (`rg "DELETE FROM memory_idempotency_receipts|idempotency.*TTL|receipt.*TTL" .opencode/skills/system-spec-kit`, case-insensitive) returns no expiry/cleanup hit; the only deletes appear in test fixtures. The delete-helper modules (`lib/search/vector-index-mutations.ts`, `lib/search/vector-index-queries.ts`, `lib/storage/reconsolidation.ts`) contain zero references to the receipts table. Replay lookup (`idempotency-receipts.ts:123-144`) performs no validity check on the referenced memory — a receipt pointing at a deleted/superseded memory still replays its stored response verbatim.
- **Risk note:** unbounded receipt growth plus indefinite stale replays/conflicts — including permanently blocking forced retries (compounds tri-000) — with no operational escape hatch short of manual SQL.
- **Fix class:** code-small for the documented TTL + cleanup sweep; the replay-time validity check (what to do when `memory_id` is NULL or the row is tombstoned) should be designed consistently with the tri-000/001/002 conflict semantics but can ship separately.

### tri-095 (P2) — memory_save replay documented as idempotent despite admitted duplicate-index gap — STILL-REAL

- **Current evidence:** `mcp_server/README.md:262` — the front-proxy row states the proxy "transparently replays read and idempotent-write tools across the recycle (`memory_save` is replayable because it relies on primary-row dedup)" with no mention of the secondary-index caveat. `.opencode/bin/lib/launcher-session-proxy.cjs:146-153` — the source comment explicitly states the **KNOWN GAP**: a commit-then-die that finished the primary insert but not the secondary-index write can, on replay, append duplicate secondary-index rows because that path "is not yet keyed by an idempotency token."
- **Overtaken check:** today's doc-reconciliation batch did not touch this row — the README text matches the banked wording. The receipt system (tri-000-002 paths) is flag-OFF by default and, per the proxy comment, deliberately out of scope for the proxy-layer classifier, so it does not close the gap. Not overtaken.
- **Risk note:** operators reading the README assume full replay safety after backend recycle; derived-index duplication under contention is hidden and only discoverable from a source comment.
- **Fix class:** doc-only — add the partial-idempotency caveat (primary-row guarantee, secondary-index KNOWN GAP) to README.md:262; the request-id/token threading is already tracked in the fix sketch as a separate code follow-on.

---

## Interlock Summary

- **Must ship together:** tri-000, tri-001, tri-002. All three define the receipt-key/conflict contract of the flag-ON path. Fixing tri-000 (fingerprint composition) alters when tri-001's `conflict` branch fires; tri-002 must mirror whatever loser semantics tri-001 establishes. A partial fix risks shipping a contract that the other two handlers contradict.
- **Independent:** tri-048 (TTL/cleanup — its replay-validity behavior should follow the trio's settled semantics but is separable), tri-095 (doc-only, different layer: proxy replay vs receipt system).
