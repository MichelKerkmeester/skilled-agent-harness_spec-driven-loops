<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 1 — Protocol, redaction, and bound runtime authority

## Summary

This phase makes the model catalog and model-mutation contract build-ready while the existing visible picker remains in place. It delivers host-authoritative metadata, two-revision validation, and a one-use runtime ticket path so the existing control already uses the bounded authority model.

## Problem & Goal

The model switch path currently lacks the expanded catalog contract and an exact-target, revision-bound mutation boundary. The goal is to harden the protocol, relay, authorization, redaction, and web runtime types without changing the visible picker, so every model mutation is validated by the host and failures are terminal and non-retrying.

## Scope

### In scope

- Extend protocol DTOs, guards, exports, tests, and the `set_model` control contract.
- Project only host-authoritative, bounded model metadata and catalog state.
- Add catalog revision, current-model, streaming, and host-authored switching capability fields.
- Add a runtime-specific, short-lived, one-use bound-ticket issuance path.
- Reject mismatched, stale, unauthorized, duplicate, and uncertain operations without retrying.
- Update web relay and runtime types to consume the expanded contract while retaining the nested picker as a temporary presentation layer.
- Complete the explicit security posture review before enabling the new route outside tests.

### Out of scope

- Replacing the nested picker with the bottom sheet or changing visible picker presentation.
- iPhone interaction, accessibility, motion, responsive, and visual hardening.
- Adding providers, models, host RPC methods, cloud APIs, or database migrations.
- Broadening prompt, approval, extension, plan-mode, full-access, or thinking-effort permissions.
- Optimistic header updates, automatic retries, ticket reuse, or any mutation outside explicit model switching.
- Changing the fixed ink-on-parchment design system, typography, color tokens, light/dark themes, or WCAG AA target.

## User-facing behavior + states

N/A — internal. The existing picker remains usable and visually unchanged. The confirmed header model remains host-authoritative, with no optimistic text change during pending, stale, rejected, or delivery-unknown outcomes.

## Acceptance criteria

- The expanded DTO/catalog passes positive and negative protocol guard tests.
- `/api/runtime/models` remains read-only and returns no raw host fields.
- A model ticket cannot be issued for an unknown target, consumed by another session/device, replayed, or used with a changed target or either revision.
- The existing picker’s model switch reaches a host-confirmed response through the bound path; no optimistic header change is introduced.
- A stale, rejected, or delivery-unknown result produces one settled response and zero automatic retries.
- Existing auth, policy, foreground, redaction, plan-mode, and rate-limit tests remain green.

## Security & Redaction

The browser remains read-only by default: catalog reads and staging consume no ticket, and only the existing explicit model action crosses the mutation boundary. The runtime ticket is short-lived, in-memory, one-use, and bound to the authenticated principal/session, `runtime:control`, session ID, exact provider/model target, expected runtime revision, expected catalog revision, operation type, and expiry. It is consumed before command execution and cannot be replayed or substituted.

The foreground authenticated device, both revisions, fresh target membership, host liveness, streaming capability, and runtime authority are checked before `set_model`. Raw pi rows, raw errors, secrets, paths, URLs, credentials, and undeclared fields are dropped by the redaction projection; reason codes are bounded and allowlisted. No ticket or binding is persisted or logged. Existing plan-mode, host/extension policy, session revocation, foreground checks, rate limits, and redaction controls remain in force.

## Dependencies & affected areas

- Protocol: `packages/pi-rpc-protocol/src/types.ts`, `packages/pi-rpc-protocol/src/guards.ts`, `packages/pi-rpc-protocol/src/index.ts`, and `packages/pi-rpc-protocol/tests/guards.test.ts`.
- Relay: `apps/pi-remote-relay/src/store/redaction.ts`, `apps/pi-remote-relay/src/runtime/runtime-service.ts`, `apps/pi-remote-relay/src/auth/auth-service.ts`, `apps/pi-remote-relay/src/auth/policy.ts`, `apps/pi-remote-relay/src/http/server.ts`, and the listed relay security/runtime tests.
- Web contract consumers: `apps/pi-remote-web/src/relay.ts` and `apps/pi-remote-web/src/runtime.ts`; the existing picker remains the temporary presentation layer.
- Verification: repository typecheck/tests, relay negative controls, and an unchanged true-390px light/dark capture of the visible model control.

