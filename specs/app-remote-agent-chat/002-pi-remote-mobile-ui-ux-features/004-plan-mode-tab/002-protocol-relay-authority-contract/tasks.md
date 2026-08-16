# Tasks — Phase 1 — Protocol and relay authority contract

- [ ] Update `packages/pi-rpc-protocol/src/types.ts` and `src/index.ts` with bounded `PlanArtifactDto`, plan snapshot/event payloads, plan validity values, and distinct `set_mode` and `execute_plan` command/outcome types; keep `planToken` opaque and never derived from text.
- [ ] Update `packages/pi-rpc-protocol/src/guards.ts` and `packages/pi-rpc-protocol/tests/guards.test.ts` to enforce exact keys, bounded strings/arrays, non-negative revisions, opaque IDs, valid `postRunMode`, and rejection of missing, replay-shaped, or host-only values.
- [ ] Extend `apps/pi-remote-relay/src/runtime/runtime-service.ts` with independent runtime and plan revisions, authoritative mode hydration, a single mutation lane, control-ID idempotency, and terminal delivery-unknown outcomes; do not dispatch after stale or invalid guards.
- [ ] Extend `apps/pi-remote-relay/src/runtime/plan-status.ts` to parse only the pinned host mode/status contract and map unknown or unhealthy status to `unknown`, never Build.
- [ ] Update `apps/pi-remote-relay/src/http/server.ts` and associated auth policy/rate limiter to authenticate both plan operations, require a live foreground device, consume one-use tickets, and return safe stale/unsupported/unavailable/delivery-unknown distinctions; keep `/api/runtime/state` read-only and use an allowlisted plan projector.
- [ ] Update `apps/pi-remote-relay/src/store/redaction.ts`, `src/replay/sync.ts`, and `src/store/relay-store.ts` so artifacts are redacted before persistence/replay/broadcast and status/control events cannot enter transcript projections; add a migration only if the schema requires plan metadata and never persist raw tokens.
- [ ] Add or extend `apps/pi-remote-relay/tests/runtime-control.test.ts`, `tests/plan-status.test.ts`, `tests/redaction.test.ts`, and a focused plan-control integration test for two clients, ticket replay, stale revisions, and transport failure.

