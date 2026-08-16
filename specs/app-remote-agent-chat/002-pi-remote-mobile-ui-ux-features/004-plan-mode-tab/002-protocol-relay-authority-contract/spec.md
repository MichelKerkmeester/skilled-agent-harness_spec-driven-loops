<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 1 — Protocol and relay authority contract

## Summary

This phase delivers the typed, redacted, revision-checked contract for host-confirmed mode and reviewed-plan control. It adds authoritative relay hydration and safe control ingress while keeping the existing model and thinking controls working.

## Problem & Goal

The new Plan journey needs distinct `set_mode` and `execute_plan` operations, independent runtime and plan revisions, and safe reconciliation when a response is stale or its delivery is unknown. The goal is to establish that contract without creating a client-side authority shortcut or persisting raw plan credentials.

## Scope

### In scope

- Protocol DTOs and guards for bounded plan artifacts, plan snapshots/events, validity values, and distinct `set_mode`/`execute_plan` commands and outcomes.
- Relay read/hydration, authenticated mode-control ingress, plan-artifact projection, control-ID idempotency, single-flight behavior, stale responses, and delivery-unknown reconciliation.
- One-use-ticket and foreground/session/revision validation at the relay boundary.
- Redaction before plan artifacts are persisted, replayed, synchronized, broadcast, or projected to the client.
- Continued compatibility for the existing model and thinking controls.

### Out of scope

- Host capability classification, structured lifecycle publication, execution leases, or `/plan` prompt/catalog cleanup; those are Phase 2 work.
- Composer UI, keyboard affordances, review sheets, or Execute presentation; those are Phases 3 and 4.
- Final PWA accessibility, layout, device verification, and release hardening; that is Phase 5.

## User-facing behavior + states

N/A — internal protocol and relay contract. The verification smoke route may inspect the existing shell in hydration or unavailable states, but this phase does not introduce a new user-facing control.

## Acceptance criteria

- Protocol guards reject extra keys, invalid IDs/tokens, mismatched revisions, and `execute_plan` without `postRunMode: "plan"`.
- Two clients using one runtime revision produce exactly one accepted mutation and one stale outcome.
- Ten repeated control submissions with one control ID cause one host mutation and one replayed response.
- Ticket expiry, consumption, replay, wrong session, non-foreground principal, and unavailable host cause no host mutation.
- A lost response produces delivery-unknown and does not trigger an automatic second request.
- Serialized plan DTOs and sync envelopes contain no raw token, secret, principal, host identifier, absolute path, or unredacted plan field.

## Security & Redaction

Both control discriminants are authenticated, foreground-only, single-flight, rate-limited, idempotent-by-control-ID, and one-use-ticketed. The relay binds each request to the session, foreground principal, host/workspace context, and expected runtime revision; `execute_plan` also carries the plan binding and exact `postRunMode` contract. Guards and stale checks run before host dispatch, and a timeout becomes delivery-unknown rather than an automatic retry. Allowlisted projectors redact plan artifacts before persistence, replay, sync, broadcast, and DTO creation; raw `planToken` values are never persisted or placed in transcript projections.

## Dependencies & affected areas

| Area | Files/components | Phase responsibility |
| --- | --- | --- |
| Protocol | `packages/pi-rpc-protocol/src/types.ts`, `packages/pi-rpc-protocol/src/index.ts`, `packages/pi-rpc-protocol/src/guards.ts`, `packages/pi-rpc-protocol/tests/guards.test.ts` | Add bounded DTOs, exact control discriminants, validity states, guarded outcomes, and rejection of unknown or host-only values. |
| Relay runtime | `apps/pi-remote-relay/src/runtime/runtime-service.ts`, `apps/pi-remote-relay/src/runtime/plan-status.ts` | Track authoritative runtime/plan revisions, mode hydration, single-flight mutations, idempotency, stale results, and delivery uncertainty. |
| Relay HTTP/auth | `apps/pi-remote-relay/src/http/server.ts`, `apps/pi-remote-relay/src/auth/rate-limit.ts`, `apps/pi-remote-relay/src/auth/policy.ts` | Authenticate the two operations, require a live foreground device, consume one-use tickets, and expose safe outcome distinctions. |
| Relay storage/sync | `apps/pi-remote-relay/src/store/redaction.ts`, `apps/pi-remote-relay/src/replay/sync.ts`, `apps/pi-remote-relay/src/store/relay-store.ts` | Redact before storage/replay/broadcast and keep control-plane events out of transcript projections; add metadata migration only if required by the current schema. |
| Verification | `apps/pi-remote-relay/tests/runtime-control.test.ts`, `apps/pi-remote-relay/tests/plan-status.test.ts`, `apps/pi-remote-relay/tests/redaction.test.ts`, focused plan-control integration tests | Prove two-client stale handling, ticket replay rejection, idempotency, transport failure, and redaction. |

