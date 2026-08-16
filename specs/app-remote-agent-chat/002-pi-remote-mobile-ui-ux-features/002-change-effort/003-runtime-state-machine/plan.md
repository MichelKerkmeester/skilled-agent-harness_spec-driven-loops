# Plan — Complete runtime state machine and mutation boundary

## Approach

Build the browser state machine around the Phase 1 snapshot and bounded issue contract. Keep the last host-confirmed runtime snapshot separate from pending intent and issue state, centralize fresh ticket/control-ID creation in the transport path, and make every refresh read-only. Use a synchronous guard and a deadline around the existing mutation lane, then expose connection transitions and one status region without coupling runtime state to transcript state.

## Steps

1. Define the local issue union and bounded copy allowlist in `runtime-issues.ts`, accepting only local catalog labels for formatting.
2. Route hydration through `/api/runtime/reconcile`, validate `RuntimeSnapshotDto`, normalize offline/403/429/503/invalid/abort/timeout outcomes, and parse only bounded `Retry-After` metadata.
3. Generate a fresh ticket and unique control ID immediately before each mutation; never cache or persist them.
4. Expand `runtime.ts` to represent the complete state table while keeping confirmed state, pending operation, and issue state separate.
5. Add synchronous in-flight locking, the cross-browser 10-second delivery deadline, one-time stale/unsupported reconcile, connectivity recovery, and the required sheet-open, visibility, online, and live-sync refresh triggers with deduplication.
6. Lock model, effort, and mode mutation controls during pending; pass session live transitions through `App.tsx`; mount one polite atomic runtime status region.
7. Extend runtime, transport, issue, RuntimeStrip, and security tests for request counts, redaction, deadlines, refresh triggers, and Plan-mode isolation.

## Files to change

- `apps/pi-remote-web/src/runtime-issues.ts`
- `apps/pi-remote-web/src/relay.ts`
- `apps/pi-remote-web/src/runtime.ts`
- `apps/pi-remote-web/src/App.tsx`
- `apps/pi-remote-web/tests/runtime.test.tsx`
- New transport and issue tests under `apps/pi-remote-web/tests/`
- `apps/pi-remote-web/tests/RuntimeStrip.test.tsx`

## Verification gate

- `npm run typecheck` exits 0.
- `npm test` and `npm run test:web` exit 0, including all Phase 1 protocol/relay tests and the expanded runtime state-machine tests.
- Run the existing web flow through CDP at exactly 390 CSS px in light and dark themes. Capture checking, ready, pending, streaming, offline, and delivery-unknown fixtures; confirm no horizontal overflow and no raw issue text in the DOM or accessibility tree.
