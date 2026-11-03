---
title: Native Platform Differences
description: React Native iOS and Android differences in shadows, input feedback, back handling, safe areas and status bars.
trigger_phrases:
  - "react native platform differences"
  - "android edge to edge"
  - "ios android safe areas"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Native Platform Differences

Support figures are from the React Native 0.83 documentation and source, checked 2026-11-03. React Native 0.76 is inferred, not verified.

The stack layer keeps the shared layout and safe-area baseline in [`react-native-layout-and-a11y.md`](react-native-layout-and-a11y.md). This file covers behavior that needs a platform-specific decision.

---

## 1. SHADOWS AND PRESS FEEDBACK

### N-P1. Platform shadows

**Rule.** Treat `boxShadow` as a feature-detected enhancement, with iOS `shadow*` props and Android `elevation` as the baseline.
**Why.** iOS exposes `shadowColor` and `shadowOffset` alongside `shadowOpacity` and `shadowRadius`. Android `elevation` adds a native shadow and affects z-order. React Native added `boxShadow` as a New Architecture-only style prop in 0.76, and the 0.76-stable and 0.83.10 `StyleSheetTypes.d.ts` both declare it.
**When not to.** Use a border or surface-color contrast when the design does not need a shadow.
**Pitfall.** Relying on `boxShadow` alone leaves a legacy-architecture build without a visible shadow.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified. The New Architecture setting is unconfirmed. Keep `shadow*` or `elevation` where a screen must render on the legacy architecture.
**See also.** https://reactnative.dev/docs/view-style-props

### N-P2. Android Pressable ripple

**Rule.** Add `android_ripple` to `Pressable` when Android needs its native touch feedback.
**Why.** The prop configures an Android ripple whose `foreground` option draws above child backgrounds that would otherwise cover it.
**When not to.** Use a shared pressed-state style when the interaction needs identical visual feedback on iOS and Android.
**Pitfall.** A child with an opaque background can hide a ripple drawn behind it.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/pressable

---

## 2. BACK, EDGE-TO-EDGE AND SAFE AREAS

### N-P3. Router and hardware back

**Rule.** Let the navigation router handle ordinary stack back and intercept Android back with `BackHandler` only for a screen-specific action.
**Why.** Back handlers run in reverse registration order. Returning `true` consumes the event, while returning `false` lets an earlier handler or the system respond.
**When not to.** Skip a custom handler when the router should simply pop the current screen.
**Pitfall.** A stale handler can consume the router's back action after its screen is no longer active.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/backhandler

### N-P4. Android 15 edge-to-edge

**Rule.** Handle system-bar insets explicitly on every Android screen, because Android 15 draws apps edge-to-edge once they target API 35 or later.
**Why.** Android 15 enforces edge-to-edge for apps targeting API 35 or later. The target SDK and Expo settings determine whether the platform enforces edge-to-edge. Confirm them in the app configuration.
**When not to.** On Android 14 and earlier, or below a target of API 35, the system does not force edge-to-edge, but the same inset handling still works.
**Pitfall.** Changing status-bar colors does not move content out from under a system bar.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified. The target SDK is unconfirmed, so API 35 enforcement cannot be determined.
**See also.** https://developer.android.com/about/versions/15/behavior-changes-15#edge-to-edge

### N-P5. Safe-area insets

**Rule.** Follow the safe-area approach documented by the active mode, as the [stack layer](react-native-layout-and-a11y.md#1-overview-and-boundary) routes to, and read `react-native-safe-area-context` insets at the container that owns screen content.
**Why.** Insets vary with device cutouts and system bars. The context provides their current values to React Native layout.
**When not to.** Let a decorative background extend behind system bars while its interactive content stays within the inset area.
**Pitfall.** Applying safe-area padding in both a navigator and every nested screen adds the same inset more than once.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://docs.expo.dev/versions/latest/sdk/safe-area-context/

---

## 3. PLATFORM FILES AND STATUS BAR

### N-P6. Platform-specific modules

**Rule.** Choose `.ios.tsx` or `.android.tsx` files for substantial platform behavior and use `Platform.select` for small values.
**Why.** React Native resolves platform file extensions at import time, while `Platform.select` chooses a value in shared code.
**When not to.** Keep one shared module when only one style value differs between the platforms.
**Pitfall.** Splitting a component can duplicate business rules and let platform implementations drift apart.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/platform-specific-code

### N-P7. Status bar appearance

**Rule.** Set status-bar content style to contrast with the screen and let safe-area insets control content placement.
**Why.** Status-bar appearance changes system icons and background treatment, while insets determine where app content begins.
**When not to.** Hide the status bar for an intentional immersive view such as full-screen media.
**Pitfall.** Choosing light or dark status-bar content without checking the screen behind it can leave the system icons unreadable.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/statusbar
