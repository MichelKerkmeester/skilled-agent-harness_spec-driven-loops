<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 2 — Complete runtime state machine and mutation boundary

## Summary

This phase hardens the web runtime lifecycle before the canonical sheet is attached. Confirmed state remains non-optimistic, every mutation has one guarded request, failure states are recoverable and redacted, and read-only rehydration occurs at the required moments.

## Problem & Goal

The browser needs to enforce the synthesis lifecycle at its final mutation boundary: pending intent must stay separate from host-confirmed state, duplicate input must be locked synchronously, and timeout or transport ambiguity must never trigger replay. The goal is a complete local state machine and refresh coordinator that uses the Phase 1 reconcile contract while keeping existing controls on the hardened path.

## Scope

### In scope

- Web issue-code union and bounded local copy.
- Web relay hydration, validation, transport normalization, ticket timing, control IDs, and bounded retry metadata.
- Runtime reducer/hook states, synchronous in-flight locking, deadline handling, reconcile behavior, refresh triggers, and mutation locking.
- App-level live-transition plumbing and one document-level polite atomic status region.
- Runtime lifecycle, transport, issue, RuntimeStrip, and security-isolation tests.

### Out of scope

- Replacing the existing effort visual surface; existing controls may still render their old surfaces.
- A new effort sheet, radio group, or other visual picker.
- Changes to the fixed ink-on-parchment design system, typography, themes, or WCAG AA baseline.
- Automatic mutation retries, ticket persistence/prefetching, foreground-authority transfer, Build/Plan changes, approval grants, or tool permissions.

## User-facing behavior + states

The existing controls use the hardened state and request path. The runtime represents `checking`, `ready-adjustable`, `ready-off-only`, `ready-empty`, `streaming`, `pending`, `accepted`, `stale`, `unsupported`, `offline`, `foreground-required`, `rate-limited`, `host-unavailable`, `delivery-unknown`, and `inconsistent-state` without duplicating confirmed state.

- The confirmed effort value never changes on control start, timeout, unsupported, unavailable, or delivery-unknown.
- Streaming sends no ticket and no mutation; idle re-enables only after a confirmed hydrate.
- Stale and unsupported reconcile once and never retry the original mutation automatically.
- Delivery-unknown is terminal until a read-only hydrate confirms the current host state.
- Offline, foreground-required, rate-limited, host-unavailable, and invalid responses use bounded local copy and recover only through the specified read-only paths and a new deliberate selection where required.

## Acceptance criteria

- The confirmed effort value never changes on `control-start`, timeout, unsupported, unavailable, or delivery-unknown.
- A selection creates one ticket/control ID/operation tuple; same-tick repeats and further input while pending are ignored.
- Streaming sends zero tickets and zero mutations. Idle re-enables only after a confirmed hydrate.
- Stale and unsupported cause one read-only reconcile and zero automatic mutation retries. Delivery-unknown remains terminal until a read-only read-back.
- Offline, foreground-required, rate-limited, host-unavailable, and invalid responses render only local bounded copy and recover according to the state table.

## Security & Redaction

The hook requests a fresh one-use ticket immediately before each explicit runtime mutation and generates a unique control ID per attempt; neither is cached or persisted. A synchronous in-flight ref blocks same-tick double taps before dispatch. A cross-browser 10-second deadline classifies unresolved delivery as unknown, clears no ticket, and never replays. Raw status, response bodies, server reasons, host reasons, and RPC reasons remain internal metadata only. Reconcile is read-only and deduplicated; reconnect, foreground refresh, and recovery never take authority or resubmit. Model, effort, and mode controls lock during a pending runtime mutation without changing Build/Plan or tool authority.

## Dependencies & affected areas

- `apps/pi-remote-web/src/runtime-issues.ts`
- `apps/pi-remote-web/src/relay.ts`
- `apps/pi-remote-web/src/runtime.ts`
- `apps/pi-remote-web/src/App.tsx`
- `apps/pi-remote-web/tests/runtime.test.tsx`
- New web transport and issue tests under `apps/pi-remote-web/tests/`
- `apps/pi-remote-web/tests/RuntimeStrip.test.tsx`
- Phase 1 `RuntimeSnapshotDto`, issue codes, and `POST /api/runtime/reconcile`
- Existing session connection/live transition and runtime control endpoint

The fixed read-only-by-default security posture, foreground sync socket, and existing relay ticket/revision contract are dependencies, not new authority.
