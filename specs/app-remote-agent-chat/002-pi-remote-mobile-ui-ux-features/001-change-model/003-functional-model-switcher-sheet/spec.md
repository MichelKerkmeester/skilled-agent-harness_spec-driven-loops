<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 2 — Functional model switcher sheet and state machine

## Summary

This phase replaces the nested picker with a complete functional RAC bottom sheet for browsing, grouping, searching, staging, and explicitly committing a model change. It delivers the end-to-end state machine, host reconciliation, and readable base styling while leaving final iPhone motion and device hardening to Phase 3.

## Problem & Goal

The existing picker combines selection and mutation and cannot express the required catalog, streaming, failure, or delivery-unknown states. The goal is a usable end-to-end model switcher that keeps confirmed host state separate from local draft state, performs fresh reads, and sends exactly one bound mutation only after explicit confirmation.

## Scope

### In scope

- Add pure catalog helpers for identity, grouping, ordering, retired-current handling, availability/capability display, and search.
- Build one RAC `ModalOverlay`/`Modal`/`Dialog`/`Autocomplete`/`SearchField`/`ListBox` sheet for every catalog size.
- Separate host-confirmed model state from draft selection and implement current/draft semantics.
- Implement fresh-open, refresh, foreground, offline, unreachable, access-denied, streaming, stale, rejection, and delivery-unknown states.
- Keep thinking effort as a separately labelled sibling control with no shared model draft or ticket.
- Add functional styling for a readable 320–430px sheet using the established light/dark semantic tokens.
- Add pure, DOM, runtime, and app tests for the complete functional state matrix.
- Complete the second security posture review before rollout.

### Out of scope

- Final header-only swipe thresholds, focus polish, reduced-motion completion, 200% zoom proof, installed-PWA manual pass, and release evidence hardening reserved for Phase 3.
- Any new authority model beyond the Phase 1 bound-ticket/revision contract.
- Optimistic headers, automatic retries, ticket reuse, persistent cache, URL state, or local model history.
- Combining model switching with thinking effort, plan mode, prompts, approvals, or other commands.
- Changing the fixed ink-on-parchment design system, typography, color tokens, light/dark themes, or WCAG AA target.
- Adding providers, models, host RPC methods, cloud APIs, or a second overlay/search popover.

## User-facing behavior + states

The model trigger opens one labelled bottom-sheet dialog for all catalog sizes. The sheet starts a fresh catalog read, shows four skeleton rows while opening, groups rows by provider, pins the host-confirmed current model, and shows search in the same dialog when the authoritative catalog contains at least eight models. Seven models render without search. A staged row is local UI state only; row activation never sends a ticket or mutation and never changes the header.

The current row exposes visible **Current** and `aria-current="true"`; the staged row exposes visible **Selected** and `aria-selected="true"`. **Switch model** is enabled only for a different available row after the fresh catalog and commit gates settle. An accepted host response alone updates the header, closes the sheet, restores focus, and announces success. Stale, unavailable, policy-blocked, and delivery-unknown outcomes retain the confirmed model and never retry; delivery-unknown requires read-only reconciliation before another commit. During streaming, browsing and staging remain available, while commit is disabled unless the host explicitly permits it. Foreground return starts reconciliation. Offline, unreachable, and access-denied states expose only their bounded recovery behavior.

## Acceptance criteria

- Opening always begins a fresh catalog read, and an older response cannot replace a newer response.
- Seven models render without search; eight models render search in the same dialog.
- Provider grouping and current-model ordering are deterministic; retired current and unavailable rows are visible with mapped reasons.
- Tapping or pressing Enter on a row changes only draft UI state and makes no network mutation.
- One activation of **Switch model** produces one target/revision-bound ticket and one control command; dismissal and repeat controls are disabled while in flight.
- Accepted changes update the header only from host state, close the sheet, restore focus, and announce success.
- Stale, unavailable, policy-blocked, and delivery-unknown outcomes keep the confirmed model, show the correct inline/barrier state, and never retry.
- A running turn permits browse/stage but blocks commit unless the host capability permits it; next-turn text appears only after host confirmation.
- Foreground reconciliation, offline, unreachable, access-denied, keyboard, and Escape/search-clear paths are covered by automated tests.

## Security & Redaction

Browsing, searching, and staging remain read-only. Only **Switch model** may invoke the Phase 1 ticket/control sequence, and the browser test plus relay trace must prove that row activation cannot issue a ticket. The staged key is local and separate from the confirmed header model; pending, stale, rejected, offline, access-denied, and delivery-unknown states cannot enable a mutation path or present a target as current.

Catalog data remains authenticated, bounded, host-authored, and in memory only. Provider/model identity uses the validated key and never enters URL state, persistent storage, service-worker caches, logs, analytics, or raw DOM HTML. Raw host errors and payloads are not rendered; availability reasons use static mapped reason codes. The ticket remains exact-target, two-revision, one-use, foreground-bound, and non-retrying, with plan-mode and host/extension policy enforced at the host boundary.

## Dependencies & affected areas

- Web catalog and UI: `apps/pi-remote-web/src/model-catalog.ts`, `apps/pi-remote-web/src/ModelSwitcherSheet.tsx`, `apps/pi-remote-web/src/SessionHeader.tsx`, `apps/pi-remote-web/src/runtime.ts`, `apps/pi-remote-web/src/relay.ts`, `apps/pi-remote-web/src/App.tsx`, and `apps/pi-remote-web/src/style.css`.
- Web tests: `apps/pi-remote-web/tests/model-catalog.test.ts`, `apps/pi-remote-web/tests/ModelSwitcherSheet.test.tsx`, `apps/pi-remote-web/tests/runtime.test.tsx`, and `apps/pi-remote-web/tests/App.test.tsx`.
- Relay/protocol dependency: the Phase 1 expanded catalog, runtime revision, catalog revision, streaming capability, and bound-ticket/control contracts.
- Fixed design/security areas: established ink-on-parchment tokens, light/dark themes, WCAG AA target, read-only-by-default behavior, redaction, foreground enforcement, and host/extension plan-mode policy.

