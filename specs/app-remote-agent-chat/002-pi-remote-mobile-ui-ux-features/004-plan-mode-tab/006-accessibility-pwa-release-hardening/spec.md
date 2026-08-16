<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 5 — Accessibility, PWA layout, and release hardening

## Summary

This phase proves the complete Plan-mode feature is usable and safe on the target iPhone PWA across narrow layouts, themes, assistive technology, reduced motion, hardware keyboards, and lifecycle changes. It adds final verification and rollback evidence without changing the feature’s authority or visual-system contracts.

## Problem & Goal

The feature spans a sticky composer, sheets, keyboard shortcuts, live authority, and a bounded execution handoff; correctness on a desktop viewport is not enough for the target phone PWA. The goal is to prove readable, focusable, redaction-safe behavior at the required widths and text scale, during resume/reconnect/cache transitions, and in manual Safari and installed-PWA use before release.

## Scope

### In scope

- Final styling for focus contrast, logical properties, 320px/375px/390px/430px layouts, 200% text, `dir="auto"`, isolated LTR revision/shortcut rendering, and reduced motion.
- `viewport-fit=cover`, safe-area behavior, and service-worker/cache behavior that cannot expose enabled controls or stale plan tokens.
- Axe/DOM assertions for names, roles, focus order, inert sheets, target size, announcement duplication, and clay contrast.
- Exact-width CDP regression coverage and the full acceptance matrix in light and dark themes.
- Manual Safari/installed-standalone PWA checks for software and hardware keyboards, Full Keyboard Access, VoiceOver, rotation, background/resume, reconnect, safe area, Back, reduced motion, and 200% text.
- Existing release verification, rollback drills, host capability/health gating, and proof that disabling the capability leaves the old read-only UI safe.

### Out of scope

- New Plan or Build semantics, new execution authority, new permission systems, or changes to the host/relay security boundary.
- Replacing the bone `#f8f8f6` / carbon / clay `#d97757` system, Inter + Source Serif 4 typography, or the light/dark theme model.
- Auto-execution, queued offline mutations, cached authority, or any relaxation of redaction.

## User-facing behavior + states

- At exact 320px, 375px, 390px, and 430px widths and 200% text, all controls remain visible, labeled, focusable, and unobscured in light and dark themes. Mode is never conveyed by color alone, and clay is not used for normal text or critical focus/state boundaries.
- Hydrating, Build, Plan, Plan ready, review, execute pending, executing, stale, delivery unknown, offline, forbidden, unsupported, extension-error, and superseded-plan states remain legible and safe; mutation controls become available only after authoritative hydration.
- VoiceOver announces each settled transition once, opens review with initial focus on `Keep planning`, and does not move focus when a plan becomes ready. Bare `Tab` and configured `Shift+Tab` retain their specified keyboard behavior.
- Reduced motion removes positional or continuous animation while retaining immediate textual state changes. Rotation, background/resume, reconnect, relay restart, browser Back, and service-worker cache changes preserve safe authority and redaction boundaries.
- Safari and installed standalone PWA behavior is verified with software keyboard, hardware keyboard/Full Keyboard Access, VoiceOver, safe-area insets, and the release capability gate; disabling the gate leaves the prior read-only UI safe and hides Execute.

## Acceptance criteria

- All controls remain visible, labeled, focusable, and unobscured at 320px, 375px, 390px, and 430px, both themes, and 200% text scaling.
- Mode state is never communicated by color alone; contrast checks reject clay-on-bone normal text and clay-only focus/state boundaries.
- VoiceOver announces each settled transition once, starts review on `Keep planning`, and never moves focus when a plan becomes ready.
- Bare Tab and configured Shift+Tab behavior pass physical keyboard testing; the setting restores reverse focus navigation when disabled.
- Reduced motion removes positional/continuous animation while retaining immediate textual state changes.
- Background/resume, rotation, reconnect, offline, relay restart, and service-worker cache behavior all force or await safe authoritative hydration before mutation controls become available.
- Release verification has no stray source-file changes, no unredacted artifacts, and a documented capability-gate rollback path.

## Security & Redaction

Hardening must preserve the existing host-enforced, one-use-ticketed, revision-checked, foreground-bound, fail-closed posture. Service-worker and browser caches may retain only redacted history and must never enable controls or retain plan tokens; resume, reconnect, restart, and capability-health changes require safe authoritative hydration. Accessibility names, announcements, screenshots, diagnostics, and manual verification artifacts must omit tickets, tokens, principals, host IDs, paths, raw tool arguments, and unredacted plan content. The rollback gate must disable the feature without exposing Execute or restoring an unsafe cached authority.

## Dependencies & affected areas

| Area | Files/components | Phase responsibility |
| --- | --- | --- |
| Web styling | `apps/pi-remote-web/src/style.css` | Exact focus contrast, logical properties, all required widths, 200% text, direction handling, isolated LTR values, and reduced motion. |
| PWA shell/cache | `apps/pi-remote-web/index.html`, `apps/pi-remote-web/public/manifest.webmanifest`, `apps/pi-remote-web/public/service-worker.js` | `viewport-fit=cover`, safe-area behavior, and history-only cache behavior with no stale tokens or enabled controls. |
| Web tests | `apps/pi-remote-web/tests/contrast.test.tsx`, `tests/App.test.tsx`, component tests, focused CDP fixture/script under `apps/pi-remote-web/tests/` if needed | Axe/DOM, focus, target-size, announcement, contrast, theme, width, text-scale, and state-matrix coverage. |
| Manual/release verification | Safari, installed standalone PWA, release verification and rollback drills | Physical keyboard, Full Keyboard Access, VoiceOver, rotation, lifecycle, safe-area, reduced-motion, capability-gate, and rollback sign-off. |

