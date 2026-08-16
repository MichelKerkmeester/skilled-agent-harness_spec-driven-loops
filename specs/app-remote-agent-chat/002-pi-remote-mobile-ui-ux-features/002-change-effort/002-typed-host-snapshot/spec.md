<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 1 — Typed host snapshot, reconciliation, and redacted outcomes

## Summary

This phase gives the relay and protocol one safe, read-only way to rehydrate the authoritative model, effort, streaming, mode, revision, and advertised-level state. It also replaces arbitrary runtime failure text at the browser boundary with bounded issue codes while keeping existing runtime controls usable during rollout.

## Problem & Goal

The relay and browser need a guarded snapshot contract before the effort surface can depend on rehydration and cause-specific recovery. The goal is to add an atomic, redacted reconcile path that preserves Pi’s advertised order and subset, carries host-confirmed state, and fails closed without exposing raw host or transport text.

## Scope

### In scope

- Protocol DTOs, guards, exports, and bounded runtime issue codes.
- Relay runtime projection, read-only snapshot hydration, error mapping, and reconcile endpoint policy.
- The smallest web transport adapter needed to compile against the new response shapes.
- Compatibility for `/api/runtime/state`, `/api/runtime/models`, and `/api/runtime/control` during rollout.
- Protocol, relay, security, and focused reconcile tests.

### Out of scope

- A new effort visual surface or replacement picker.
- Changes to the ink-on-parchment design system, typography, themes, or WCAG AA baseline.
- Changes to read-only-by-default authority, ticketed revision-checked mutations, foreground ownership, redaction, or host/extension-enforced Plan mode.

## User-facing behavior + states

N/A — internal. Existing controls remain usable; browser-visible runtime failures expose only bounded machine/issue codes, never arbitrary host reasons or HTTP bodies.

## Acceptance criteria

- A reconcile request returns one redacted, guarded snapshot containing host order/subset, current confirmed value, streaming, mode, model, and revision.
- Reconcile never requests or consumes a mutation ticket and never calls `set_thinking_level`.
- Runtime control responses and HTTP failures contain only bounded machine/issue codes; raw host reasons and HTTP bodies are not browser-visible.
- Existing runtime control tests still prove stale revisions fail closed, duplicate control IDs do not send a second Pi command, and foreground authority is required.

## Security & Redaction

Keep the runtime projection allowlisted and bounded. Guards reject unknown issue codes, extra keys, unbounded strings, invalid revisions, invalid levels, and snapshots whose session IDs do not match. The read-only reconcile endpoint uses `runtime:read`, consumes no mutation ticket, forwards no intent, preserves foreground and revision checks on the existing mutation lane, and maps host rejection, unsupported capability, and ambiguous transport failures to the fixed issue-code allowlist. Unknown thinking IDs may remain internal values but must not become user-facing labels or reasons. Plan mode and tool authority remain untouched.

## Dependencies & affected areas

- `packages/pi-rpc-protocol/src/types.ts`
- `packages/pi-rpc-protocol/src/guards.ts`
- `packages/pi-rpc-protocol/src/index.ts`
- `packages/pi-rpc-protocol/tests/guards.test.ts`
- `apps/pi-remote-relay/src/store/redaction.ts`
- `apps/pi-remote-relay/src/runtime/runtime-service.ts`
- `apps/pi-remote-relay/src/http/server.ts`
- `apps/pi-remote-relay/src/auth/policy.ts`
- `apps/pi-remote-relay/tests/runtime-control.test.ts`
- `apps/pi-remote-relay/tests/security/negative-controls.test.ts`
- Focused reconcile tests under `apps/pi-remote-relay/tests/`
- `apps/pi-remote-web/src/relay.ts`

Dependencies are limited to the existing Pi RPC commands, loopback relay, authenticated session, foreground sync socket, and current runtime control contract.
