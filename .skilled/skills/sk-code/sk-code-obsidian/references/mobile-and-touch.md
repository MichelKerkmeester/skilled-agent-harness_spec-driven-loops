---
title: Mobile and Touch Support
description: isDesktopOnly is false — Platform.isMobile/isTablet reads in src/data/touch-environment.ts, the coarse-pointer and narrow-container fallbacks, the is-phone body class, and the known P0 passive-listener gap.
trigger_phrases:
  - "obsidian plugin mobile support"
  - "istouchdevice touchenvironment"
  - "is-phone body class"
  - "coarse pointer narrow container"
  - "attachlongpress passive listener"
  - "platform.ismobile istablet"
importance_tier: normal
contextType: implementation
version: 0.1.0.0
---

# Mobile and Touch Support

`manifest.json` declares `isDesktopOnly: false` — the plugin must work on Obsidian mobile. This
reference is how touch/mobile detection actually works in the source, and one recorded gap in it.

---

## 1. OVERVIEW

### Core Principle

Touch is detected three ways, combined with OR: Obsidian's own platform flag, CSS coarse-pointer
media query, and container width — because a "mobile" experience in this plugin is not only about
the device, it is also about a narrow split-pane on a wide window. `src/data/touch-environment.ts`
is the one module that makes this decision; nothing else in the tree re-implements it.

### When to Use

- Adding an interaction that must behave differently on touch (long-press, drag-and-drop)
- Testing or capturing a mobile-layout surface
- Deciding whether a change needs `isDesktopOnly` to change from `false`
- Investigating the recorded passive-listener gap (§4)

### Key Sources

- `src/data/touch-environment.ts` — `isTouchDevice`, `observeTouchEnvironment`, `attachLongPress`
- `manifest.json` — `"isDesktopOnly": false`
- `tools/screenshots/capture.mjs` — the `is-phone` body class the capture harness sets

---

## 2. `isTouchDevice(...)` — THE THREE SIGNALS

```ts
export function isTouchDevice(
  container?: HTMLElement | null,
  ownerWindow: Window | undefined = getDefaultWindow(),
): boolean {
  const platformTouch = Boolean(Platform.isMobile || Platform.isTablet);
  const coarsePointer = Boolean(ownerWindow?.matchMedia?.("(pointer: coarse)").matches);
  const width = getContainerWidth(container);
  const narrowContainer = width != null && width <= TOUCH_LAYOUT_MAX_WIDTH; // 760px
  return platformTouch || coarsePointer || narrowContainer;
}
```

Any one signal is sufficient: Obsidian's own `Platform.isMobile` / `Platform.isTablet` flags cover
native mobile; `(pointer: coarse)` covers tablets and touch laptops Obsidian's own flags miss; the
760px container-width fallback keeps a narrow split pane on an otherwise-wide desktop window
usable with touch affordances even when neither platform flag nor pointer type says "touch."
`observeTouchEnvironment(...)` wraps this in a `ResizeObserver` so a view re-evaluates touch mode
live as its container is resized (a split pane dragged narrower, for example).

---

## 3. `attachLongPress(...)` — THE TOUCH GESTURE

Long-press is the plugin's substitute for a touch context menu. `attachLongPress` listens to
`pointerdown` / `pointermove` / `pointerup` / `pointercancel` / `pointerleave`, filters to primary
button plus `touch`/`pen` pointer types, requires `isTouchDevice(target)` before arming, and fires
after a default 450ms hold (configurable) if the pointer has not moved more than a 10px tolerance.
On fire it calls `preventDefault()`/`stopPropagation()` and, when available,
`navigator.vibrate?.(20)`.

---

## 4. THE `is-phone` BODY CLASS

Obsidian marks phone-width layouts by adding `is-phone` to `<body>`, and a large part of the
plugin's responsive CSS in `styles.css` keys off that class rather than a raw media query — this
lets the plugin match Obsidian's own phone/tablet boundary instead of guessing one. The screenshot
harness's `DEVICES` array (`tools/screenshots/capture.mjs`) sets `bodyClass: "is-phone"` for its
`mobile` device (`402x874`); a capture or a manual test that omits this class on a narrow viewport
renders only a cramped desktop layout, never the actual mobile design. See `screenshot-harness.md`
§5.

---

## 5. KNOWN GAP — PASSIVE LISTENERS (P0, RECORDED)

`specs/public/HANDOVER.md` (plugin repository) records an unresolved P0: the pointer listeners in
`src/data/touch-environment.ts:91-95` (the `attachLongPress` binding block) register with no
options argument, so they are not passive. The passive bindings that do exist in the tree are in
`CalendarTimelineRenderer.ts`, `BoardRenderer.ts`, and `ActiveViewControlsRenderer.ts` — none of
which the original requirement cited. This is evidence this packet records, not a gap it fixes:
either make the long-press listeners passive, or determine passive is wrong here (a long-press
handler that calls `preventDefault()` on fire cannot be `{ passive: true }`) and correct the
originating requirement instead of the code. Do not silently "fix" this as a side effect of an
unrelated touch change.

---

## 6. RELATED REFERENCES

- `theme-variables.md` — `runtime-vars.css`'s viewport-derived values, the companion runtime
  stand-in to the `is-phone` class.
- `screenshot-harness.md` §5 — the harness's own device/body-class handling.
- `accessibility.md` — the touch target size guarantee that intersects with `isTouchDevice`.
