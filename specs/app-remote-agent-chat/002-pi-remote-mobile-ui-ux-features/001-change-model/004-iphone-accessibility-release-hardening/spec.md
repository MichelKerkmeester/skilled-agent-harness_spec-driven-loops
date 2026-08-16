<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 3 — iPhone interaction, accessibility, visual, and release hardening

## Summary

This phase closes the final interaction, accessibility, responsive, motion, redaction, and release-evidence gaps for the functional model sheet on an installed iPhone PWA. It preserves the Phase 1/2 authority model while proving the experience at real mobile viewport sizes, zoom, themes, input modes, and failure states.

## Problem & Goal

The functional sheet still needs native-feeling installed-PWA behavior and complete evidence for focus, keyboard, safe-area, visual-viewport, reduced-motion, responsive, accessibility, and security-regression requirements. The goal is to make opening, searching, staging, committing, dismissing, and reconciling reliable on iPhone without changing the authority boundary or fixed visual system.

## Scope

### In scope

- Header-only swipe dismissal, native list scrolling, backdrop/keyboard behavior, focus containment, and focus restoration.
- WCAG AA focus/contrast, minimum target sizes, 320px/200% zoom, logical properties, bidirectional IDs, announcements, and message-catalog coverage.
- Visual-viewport and safe-area sizing, `viewport-fit=cover`, light/dark treatment, reduced motion, portrait/landscape, and software-keyboard behavior.
- Final relay/protocol security regression, redaction checks, service-worker cache checks, visual evidence, manual installed-PWA checks, and release diff/no-stray-file evidence.

### Out of scope

- Changing the protocol, ticket binding, revisions, host authority, or mutation semantics established in Phases 1 and 2.
- Adding providers, models, host RPC methods, cloud APIs, database migrations, persistence, logging, analytics, vibration, or WebAudio feedback.
- Changing the fixed bone/carbon/clay design system, Inter and Source Serif 4 typography, light/dark themes, or WCAG AA target.
- Adding a second body scroll lock or intercepting iOS edge navigation.
- Optimistic updates, automatic retries, ticket reuse, or combining model switching with effort, plan mode, prompts, approvals, or other commands.

## User-facing behavior + states

The sheet remains one labelled RAC modal. Before commit, backdrop, close, Escape, and a header-only downward swipe dismiss it; while committing they are inert until a terminal result or bounded delivery-unknown state. List scrolling remains native and does not drag the sheet. Initial focus lands on the current row, focus is contained and restored to the trigger with `preventScroll`, and keyboard users can open, navigate, stage, cancel, and explicitly switch. Escape clears a non-empty query before dismissing.

The layout uses visual-viewport height, safe-area padding, `viewport-fit=cover`, logical properties, wrapped labels, isolated LTR IDs, and no horizontal overflow at 320 CSS pixels or 200% zoom. Targets and rows meet minimum sizes; focus rings and state text remain visible in light and dark themes. Reduced-motion users receive the same states without transforms, springs, stagger, or spinning indicators. Installed-PWA portrait, landscape, software-keyboard, VoiceOver, Switch Control, Full Keyboard Access, foreground/background, offline, stale, rejected, and delivery-unknown paths are manually checked with redacted evidence.

## Acceptance criteria

- The sheet opens, searches, stages, commits, dismisses, and reconciles without focus loss on a real 390px mobile viewport.
- All controls and rows meet minimum target sizes; 320px and 200% zoom have no horizontal scroll.
- Light and dark states use the fixed semantic palette and pass contrast/focus checks; clay is never the sole small-text/UI-state signal.
- Reduced-motion users receive the same state information without transform, spring, stagger, or spinning-indicator motion.
- Installed-PWA safe-area, visual-viewport, portrait, landscape, and software-keyboard layouts do not clip the dialog or footer.
- VoiceOver, Switch Control, Full Keyboard Access, and hardware keyboard users can open, navigate, stage, cancel, and explicitly switch without committing from row activation.
- No sensitive ticket, raw payload, provider/model ID, query, host error, or catalog data appears in logs, analytics, URLs, persistent storage, service-worker caches, screenshots, or telemetry.
- Final release evidence contains clean typecheck, tests, security review, and true-390px light/dark CDP screenshots.

## Security & Redaction

This phase introduces no new authority, but interaction and instrumentation must not reopen dismissal, retry, storage, logging, or mutation paths. The Phase 1/2 exact-target, two-revision, one-use ticket checks, foreground enforcement, host rejection handling, redaction, rate limits, and plan-mode/host-extension policy remain unchanged and are rerun in the security and negative-control suites.

Manual and CDP evidence must be redacted. Provider/model IDs, tickets, raw payloads, raw host errors, queries, and catalog data must not enter logs, analytics, URL state, persistent storage, IndexedDB, service-worker caches, screenshots, or telemetry. Service-worker cache inspection must prove that model/ticket data is absent. No device instrumentation may capture sensitive values.

## Dependencies & affected areas

- Web UI and behavior: `apps/pi-remote-web/src/ModelSwitcherSheet.tsx`, `apps/pi-remote-web/src/SessionHeader.tsx`, and `apps/pi-remote-web/src/style.css`.
- Viewport/document: `apps/pi-remote-web/index.html`.
- Message catalog support for sheet labels, states, reason mappings, count/success announcements, and the reconcile barrier.
- Web tests: `apps/pi-remote-web/tests/ModelSwitcherSheet.test.tsx`, `apps/pi-remote-web/tests/App.test.tsx`, and `apps/pi-remote-web/tests/contrast.test.tsx`.
- Regression evidence: relay/protocol security and negative-control suites, installed-PWA manual checks, CDP viewport/zoom/reduced-motion checks, and final diff/no-stray-file sweep.
- Fixed dependencies: Phase 1/2 relay/protocol authority and the established ink-on-parchment light/dark semantic tokens.

