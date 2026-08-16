<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 3 — Canonical sheet, effort rows, and shared entry points

## Summary

This phase replaces the effort selects with one build-ready, controlled sheet and converges the header and RuntimeStrip on the same interaction path. It exposes the Phase 2 runtime state machine through a React Aria radio-row surface while preserving the fixed design system and host-confirmed behavior.

## Problem & Goal

The existing model sheet contains a nested effort `Select`, while RuntimeStrip owns a second effort control. That split makes order, explanations, focus, pending behavior, and mutation routing inconsistent. The goal is one shared Model and Effort sheet with one controlled effort radio group, host-order rendering, explicit initial sections, and no local committed runtime state.

## Scope

### In scope

- The effort catalog and safe local formatting helpers.
- Controlled React Aria effort radio rows with descriptions, confirmed/pending indicators, and read-only guards.
- One controlled `ModelEffortSheet` with model and effort sections, shared open state, hydration on open, scrolling, safe-area padding, and pending dismissal.
- Header and RuntimeStrip shared entry points and focus restoration.
- Composer/App wiring for one sheet instance per session view.
- Responsive light/dark styling and component-level DOM, keyboard, focus, routing, and edge-state tests.

### Out of scope

- A second effort picker in the composer, header, or RuntimeStrip.
- Changes to the Phase 2 runtime mutation API or ownership semantics.
- Adaptive segmented controls, sliders, swipe-to-change, long-press actions, custom haptics/audio, or custom swipe dismissal.
- A `Default` marker, raw host metadata, cost/rank/latency/quality promises, or host-authored per-level reasons.
- Changes to the fixed bone/carbon/clay design system, typography, themes, or WCAG AA baseline.

## User-facing behavior + states

- Header and RuntimeStrip open one controlled sheet; the header starts at `initialSection="model"` and RuntimeStrip starts at `initialSection="effort"`.
- The effort section is a full-width React Aria radio-row list in the host-advertised order and subset. Known IDs use local labels/descriptions; unknown IDs remain selectable internally and render only bounded ordinal labels.
- The checked row is the confirmed host value. During pending, only the requested row shows its indicator, the group is `aria-busy`, radios remain focusable but read-only, and dismissing the sheet does not cancel the request.
- Streaming, empty, off-only, inconsistent, offline, foreground-required, rate-limited, host-unavailable, stale, unsupported, and delivery-unknown fixtures remain distinct.

## Acceptance criteria

- Header and RuntimeStrip open the same controlled sheet and only differ in initial section.
- The effort group is a full-width radio-row list with the exact host order/subset, local explanations, 44px targets, and no raw unknown IDs.
- No local committed model or effort state exists in the sheet, header, or RuntimeStrip. Only the runtime hook can change confirmed state.
- Pending state shows the confirmed check unchanged, the requested-row indicator, `aria-busy`, read-only radios, and bounded status copy. Closing the sheet does not cancel the request.
- Streaming, empty, off-only, inconsistent, offline, foreground-required, rate-limited, host-unavailable, stale, unsupported, and delivery-unknown fixtures render the specified distinct states.

## Security & Redaction

All mutations route through the Phase 2 runtime hook; the sheet, header, and RuntimeStrip do not own committed model or effort state and do not create tickets or control IDs. Only an explicit row selection can request a mutation. Confirmed values move only from accepted host state. Unknown IDs are formatted locally as bounded ordinals, and raw IDs, host labels, issue codes, RPC reasons, HTTP bodies, and server strings never enter visible or accessible copy. Pending dismissal leaves the existing guarded operation running. Build/Plan authority, approval grants, tool permissions, foreground ownership, and redaction remain unchanged.

## Dependencies & affected areas

- `apps/pi-remote-web/src/effort.ts`
- `apps/pi-remote-web/src/EffortRadioGroup.tsx`
- `apps/pi-remote-web/src/ModelEffortSheet.tsx`
- `apps/pi-remote-web/src/SessionHeader.tsx`
- `apps/pi-remote-web/src/RuntimeStrip.tsx`
- `apps/pi-remote-web/src/SessionComposer.tsx`
- `apps/pi-remote-web/src/App.tsx`
- `apps/pi-remote-web/src/style.css`
- `apps/pi-remote-web/tests/EffortRadioGroup.test.tsx`
- `apps/pi-remote-web/tests/ModelEffortSheet.test.tsx`
- `apps/pi-remote-web/tests/RuntimeStrip.test.tsx`
- `apps/pi-remote-web/tests/App.test.tsx`
- SessionHeader coverage under `apps/pi-remote-web/tests/`
- Phase 2 `apps/pi-remote-web/src/runtime.ts` and runtime issue/copy contract

Dependencies are the existing React 19, Vite, Tailwind 4, React Aria Components, runtime hook, relay, session connection, and design tokens.
