# Follow-up Design Iteration 05: Prioritization And Implementation Shape

## Focus

This iteration compares the four designs for implementation order, risk, and whether each should be done now.

## Priority Matrix

| Priority | Follow-up | Do now? | Effort | Risk | Rationale |
|---|---|---|---|---|---|
| 1 | Re-handshake protocol-version drift | Yes | Small | Low-medium | A front-proxy correctness invariant. Unit-testable and fail-closed. |
| 2 | Multi-client reconnect transparency | Yes | Medium | Medium | Completes design risk #9 and improves 2nd+ sessions without client config changes. |
| 3 | `memory_save` replay enrichment window | Yes, after proxy fixes | Medium-high | Medium | Prevents replay from permanently skipping secondary enrichment; needs schema migration. |
| 4 | Checkpoint-v2 `.needs-rebuild` sentinel | Defer unless already touching checkpoint restore | Small-medium | Low | Useful self-heal marker, but current restored base remains valid and next scan/health can repair part of the gap. |

## Design Integration Notes

### Multi-client reconnect transparency

Recommended implementation shape:

1. Keep the raw shared bridge as the default for all services.
2. Let `maybeBridgeLeaseHolder()` await an injected bridge function.
3. In `mk-spec-memory-launcher.cjs`, inject a proxy bridge that starts `createSessionProxy()`.
4. Do not let second launchers take ownership of daemon respawn after bridge start.

Why this is the smallest safe shape:

The proxy is already designed as one proxy per client stream. The IPC server already treats every secondary socket as its own MCP server instance. The lease holder owns backend lifecycle; bridged launchers own only their client stdio session. This maps exactly to one `createSessionProxy()` per bridged launcher.

### `memory_save` enrichment replay window

Recommended implementation shape:

1. Add a durable marker to `memory_index`.
2. Set marker `pending` inside the primary write transaction.
3. Mark result after `runPostInsertEnrichmentIfEnabled()` returns.
4. On unchanged/duplicate replay, repair incomplete marker before returning.
5. Add bounded backfill in `memory_index_scan` for rows left incomplete outside direct replay.

Why not one big transaction:

The enrichment pipeline can do async work and is explicitly designed as typed, non-fatal post-insert enrichment. Wrapping it in the primary transaction would trade a rare replay gap for a broader writer-lock and latency risk.

### Protocol-version drift

Recommended implementation shape:

1. Cache the first negotiated `result.protocolVersion` from the initialize response that is forwarded to the client.
2. Compare every internal re-handshake initialize response to that cached version.
3. On mismatch, emit non-retryable request errors for pending/queued requests and end the stream.

Why fail closed:

The client negotiated one protocol. If the backend re-handshake negotiates another protocol, the proxy cannot prove old-session frames remain valid. Closing forces the client to perform a clean initialize against the new backend.

### Checkpoint-v2 `.needs-rebuild` sentinel

Recommended implementation shape if done:

1. Refactor `runPostRestoreRebuilds()` to return a summary.
2. Write `checkpoints/.needs-rebuild` only when summary has failures or dependency-skips.
3. Check on boot and scan; rerun the same derived rebuild helper; clear only after success.

Why defer:

The restored base tables are valid. The gap is stale derived state, not lost source data. Existing health repair can rebuild FTS when it detects mismatch, and `memory_index_scan` eventually exercises derived maintenance. The sentinel improves operator confidence but is less urgent than the proxy session correctness and replay idempotency gaps.

## Cross-cutting Test Plan

| Area | Tests |
|---|---|
| Proxy bridge | Unit tests for async bridge injection and second-session proxy replay across socket close. |
| Protocol drift | Unit tests for same-version re-handshake success, different-version fail-closed, and missing-version fail-closed. |
| Save enrichment | Schema migration test, pending marker write test, replay repair test, complete marker no-op test, deferred marker semantics test. |
| Checkpoint sentinel | Restore success with failed derived rebuild writes sentinel; boot/scan repair clears sentinel; repeated failure leaves sentinel. |

## Recommended Implementation Order

1. Protocol drift fail-closed check.
2. Multi-client proxy bridge injection.
3. `memory_save` enrichment marker and replay repair.
4. Checkpoint `.needs-rebuild` sentinel only if checkpoint restore reliability remains an active near-term concern.

## Net Recommendation

Do the first three now. They close correctness gaps in the merged front-proxy replay story. Defer the checkpoint sentinel unless the next implementation packet is already checkpoint-focused; the design is straightforward and can be implemented later without blocking the proxy follow-ups.
