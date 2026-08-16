<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 4 — Explicit Send integration and iPhone/PWA hardening

## Summary

This phase connects a drafted slash binding to the existing explicit Send path and closes revision-race, running-state, PWA, accessibility, and physical-iPhone release gaps. It preserves drafts on failure, never retries automatically, and keeps host/extension policy enforcement authoritative.

## Problem & Goal

A selected command is only a local draft until Send revalidates its identity and current availability. The goal is to connect drafted bindings to one fresh ticket and one revision-checked submission, handle stale/offline/running-state behavior safely, and complete the installed-PWA and physical-iPhone release bar.

## Scope

### In scope

- Add client-side slash-submit orchestration over the Phase 1 relay contract.
- Make primary Send, ordinary Enter, running, offline, reconnect, foreground, and catalog-refresh behavior consult slash state correctly.
- Preserve drafts on stale or denied outcomes and never retry automatically.
- Complete locale direction, bidi/control safety, visual-viewport, keyboard-language, rotation, PWA foreground, VoiceOver, and reduced-motion hardening.
- Run final security, accessibility, performance, CDP, and physical-device verification.

### Out of scope

- Implicit execution on typing or selection, automatic retry, send-as-text fallback, or silent conversion to `steer`/`followUp`.
- New command capabilities, client-side plan-mode policy, command authoring, installation, settings, persistence, telemetry-content logging, or a new database layer.
- Changes to the fixed bone/carbon/clay design system, typography, light/dark modes, WCAG AA target, or read-only-by-default posture.

## User-facing behavior + states

After local insertion, the composer enters `drafted`; explicit Send alone may enter `submit.revalidating`, request one fresh ticket, and submit one expected-revision envelope. A stale race preserves the draft, clears the unsafe binding, refreshes the catalog, and shows the reselection error. Denied, forbidden, incompatible, malformed, unavailable, or delivery-unknown outcomes preserve the draft and do not retry. Running-state availability comes from the relay; missing authoritative availability disables slash Send rather than guessing or mapping the command to steer/follow-up. Offline, reconnect, session-switch, foreground, rotation, keyboard, VoiceOver, and installed-PWA transitions retain safe focus and draft behavior.

## Acceptance criteria

- A valid slash draft sends only after one fresh ticket and one revision-checked prompt request; the host sees the canonical command plus user arguments exactly once.
- A catalog/session/host revision race makes zero Pi calls, preserves the draft, clears the unsafe binding, refreshes the catalog, and asks for reselection.
- Disabled, hidden, malformed, unknown, stale, forbidden, incompatible, and delivery-unknown paths fail closed with no automatic retry or send-as-text fallback.
- A running turn never causes a slash command to become steer/follow-up implicitly; missing authoritative running-state availability disables slash Send.
- Foreground, reconnect, and session switches cannot display another session’s rows or retain another session’s binding.
- Installed-PWA screenshots and physical-device checks pass at true 390px in light and dark, with no page horizontal scroll, keyboard obstruction, focus loss, unsafe zoom behavior, or accessibility-tree regression.
- Security review signs off on the final client-to-relay execution path, including ticket use, expected revisions, redaction, plan-mode enforcement, and telemetry/storage inspection.

## Security & Redaction

Slash selection remains a local, read-only draft operation. Send is allowed only through the existing ticketed relay boundary: resolve the exact canonical name in the current filtered catalog, require the current host/session/catalog binding, obtain one fresh one-use ticket, submit expected revisions, and fail closed before Pi on any mismatch. No stale, disabled, hidden, malformed, denied, unavailable, incompatible, or delivery-unknown outcome is retried or converted to ordinary text. Running and plan-mode policy remains host/extension-enforced. Catalogs, bindings, queries, tickets, arguments, and prompt content are not written to persistence, URLs, service-worker responses, telemetry, crash reports, or diagnostic logs; all relay responses remain redacted and bounded.

## Dependencies & affected areas

| Area | Files/components | Phase responsibility |
|---|---|---|
| Slash submit | `apps/pi-remote-web/src/submitSlashDraft.ts`, `apps/pi-remote-web/src/relay.ts` | Current binding/catalog resolution, live-state gate, one ticket, expected revisions, guarded outcome mapping, and observable request counts. |
| App/session orchestration | `apps/pi-remote-web/src/App.tsx`, `apps/pi-remote-web/src/SessionComposer.tsx` | Host/session/catalog context, transition revalidation, explicit Send progress, draft preservation, running-state gating, and ordinary non-slash compatibility. |
| Catalog/state lifecycle | `apps/pi-remote-web/src/commands.ts`, `apps/pi-remote-web/src/state.ts` | Refreshing, stale-offline, forbidden/incompatible transitions, binding invalidation, and foreground refresh after 30 seconds. |
| PWA/mobile hardening | `apps/pi-remote-web/src/style.css`, `apps/pi-remote-web/src/useVisualViewportAnchor.ts`, `apps/pi-remote-web/index.html` | Installed-PWA viewport, safe-area, rotation, keyboard-language, visual-viewport, high-contrast, reduced-motion, and focus retention. |
| Verification | `apps/pi-remote-web/tests/submitSlashDraft.test.ts`, `App.test.tsx`, `SessionComposer.test.tsx`, relay integration tests, `apps/pi-remote-relay/tests/security/negative-controls.test.ts` | Ticket/request counts, races, denied rows, running/plan policy, draft preservation, and security negatives. |
| Device release | Physical-iPhone release checklist | VoiceOver, Voice Control, Switch Control, Full Keyboard Access, Bluetooth keyboard, IME, zoom, rotation, background/foreground, offline/reconnect, themes, and reduced motion. |

