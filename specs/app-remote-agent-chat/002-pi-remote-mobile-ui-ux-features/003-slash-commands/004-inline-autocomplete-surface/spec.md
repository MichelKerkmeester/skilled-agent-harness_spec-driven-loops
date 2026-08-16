<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 3 — Inline terminal-style autocomplete surface

## Summary

This phase ships the nonmodal inline command surface above the existing multiline textarea. It uses the Phase 1 protocol boundary and Phase 2 engine to provide the complete keyboard, touch, IME, accessibility, state, and mobile-safe behavior without adding another editing field or client fallback.

## Problem & Goal

Users need terminal-style command discovery while remaining in the Pi composer. The goal is to render a keyboard- and touch-operable list for the exact leading-slash predicate, keep DOM focus and editing in the one textarea, expose the complete state model, and preserve stable accessible mobile layout.

## Scope

### In scope

- Render inline completion only for the exact leading-slash predicate.
- Keep the existing textarea as the only editing field and use virtual focus for options.
- Implement loading, ready, refreshing, empty, error, disabled, committing, and drafted states.
- Implement keyboard, touch, IME, outside-tap, Escape, `+` mutual exclusion, visual-viewport anchoring, safe-area, light/dark, reduced-motion, and responsive text behavior.
- Use the shared Phase 2 catalog/ranking/insertion engine and Phase 1 protocol boundary with no client fallback.

### Out of scope

- Auto-submit, auto-ticket, implicit host execution, send-as-text fallback, or changing the explicit Send gate.
- A second editing field, modal sheet, mobile tray, backdrop, full-screen inline browser, or command authoring surface.
- Changes to the fixed bone/carbon/clay design system, typography, light/dark modes, WCAG AA target, PWA architecture, or host/extension-enforced plan mode.

## User-facing behavior + states

Typing ASCII `/` at character zero with a collapsed caret in the first token opens a compact nonmodal card above the composer; committed text filters the in-memory catalog locally. The textarea retains DOM focus, while rows use virtual focus and `aria-activedescendant`. Enabled tap, Enter, or the local Insert action replaces the leading token with the canonical `/${name} `, restores focus, closes the panel, announces “Inserted slash command name. Not sent.”, and never sends. Disabled rows are visible only when deliberately disclosed and cannot activate.

The surface must cover `closed`, `loading.initial`, `ready.unfiltered`, `ready.filtered`, `refreshing.current`, `ready.emptyCatalog`, `ready.noMatches`, `ready.staleOffline`, `error.noSnapshot`, `error.hostUnavailable`, `error.forbidden`, `error.incompatible`, `row.disabled`, `committing`, `drafted`, `submit.revalidating`, `submit.stale`, `submit.denied`, and `session.running` states as defined by the feature spec. The panel and `+` browser are mutually exclusive; Escape, outside tap, Tab, Shift+Enter, IME composition, scrolling, and native textarea selection follow the specified interaction rules.

## Acceptance criteria

- Typing `/` at index zero opens the panel within one rendered frame; every invalid trigger case remains closed.
- Filtering is immediate and local; the panel shows specified ranking, host order, descriptions, hints, source text, confirmation markers, and disabled reasons without unsafe strings.
- Enabled tap, Enter, and Insert action each insert once, retain textarea focus, place the caret after the trailing space, close the panel, announce “Not sent,” and make no network request.
- Arrow keys, Tab, Escape, Shift+Enter, outside tap, scrolling, long press, pointer/mouse compatibility handling, and IME behavior match the interaction table.
- All UI states in the feature spec have objective DOM assertions and no state accidentally enables submission.
- At 390px in light/dark and at 320px with 200% text, the panel meets target sizes, safe-area/visual-viewport constraints, WCAG contrast, and no-displacement requirements.
- The existing `+` browser and inline panel are mutually exclusive and remain backed by one shared catalog and insertion reducer.

## Security & Redaction

The inline surface consumes only the authenticated, relay-filtered catalog and displays authoritative fields. It never derives aliases, argument syntax, paths, capabilities, source locations, or availability from untrusted strings; unsafe control or bidi-override names are rejected or visibly escaped, canonical names are isolated LTR, and descriptions use safe direction metadata. Opening, filtering, closing, keyboard navigation, and insertion make no network, ticket, prompt, mutation, telemetry-content, or Pi RPC request. Disabled/hidden/malformed rows cannot activate, and host/extension-enforced plan mode remains outside the client UI boundary. Catalog, query, binding, and completion state remain in memory only.

## Dependencies & affected areas

| Area | Files/components | Phase responsibility |
|---|---|---|
| Autocomplete surface | `apps/pi-remote-web/src/ComposerCommandAutocomplete.tsx`, `apps/pi-remote-web/src/CommandOption.tsx` | React Aria relationships, nonmodal panel, list state, virtual focus, status announcements, safe authoritative row metadata, and disabled behavior. |
| Composer integration | `apps/pi-remote-web/src/SessionComposer.tsx` | Integrate above the composer, route Enter/primary action, preserve multiline behavior, and prevent panel interaction from submitting. |
| Mobile layout | `apps/pi-remote-web/src/useVisualViewportAnchor.ts`, `apps/pi-remote-web/src/style.css`, `apps/pi-remote-web/index.html`, existing app viewport helpers | Keyboard-safe anchoring, safe areas, logical layout, responsive targets, themes, focus, zoom, and reduced motion. |
| Shared engine boundary | Phase 1 protocol/relay contract and Phase 2 catalog/ranking/insertion modules | Authoritative catalog, local ranking, canonical insertion, and revision binding. |
| Web tests | `apps/pi-remote-web/tests/ComposerCommandAutocomplete.test.tsx`, `SessionComposer.test.tsx`, `CommandPalette.test.tsx`, `App.test.tsx`, accessibility assertions | State, DOM relationships, key/pointer/IME behavior, focus/caret, no-submit guarantee, and route parity. |

