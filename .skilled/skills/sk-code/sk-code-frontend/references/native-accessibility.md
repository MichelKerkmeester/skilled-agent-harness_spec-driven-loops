---
title: Native Accessibility
description: React Native accessibility aliases, announcements, focus containment and touch bounds for native frontend work.
trigger_phrases:
  - "react native accessibility"
  - "native accessibility aliases"
  - "native accessibility actions"
importance_tier: important
contextType: implementation
version: 1.0.1.0
---

# Native Accessibility

Support figures are from the React Native 0.83 documentation and source, checked 2026-11-03. React Native 0.76 is inferred, not verified.

The native layer keeps layout, text scaling and baseline accessibility guidance in [`react-native-layout-and-a11y.md`](react-native-layout-and-a11y.md). This file covers native accessibility API mappings and behavior. Support lines name React Native versions and preserve unresolved caveats.

---

## 1. OVERVIEW AND ROLE AND STATE ALIASES

### N-A1. Role and ARIA aliases

**Rule.** Choose one role and state naming dialect per element, and prefer the props declared for the installed React Native version.
**Why.** React Native gives `role` precedence over `accessibilityRole`, maps `aria-label` over `accessibilityLabel` and gives each supplied `aria-*` state value precedence over its matching `accessibilityState` value.
**When not to.** Keep the existing accessibility props when a migration would change the public component contract without a platform need.
**Pitfall.** Conflicting duplicate props can make the exposed role or state differ from the one the component code appears to set.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/accessibility

### N-A2. State aliases

**Rule.** Map `aria-checked`, `aria-disabled`, `aria-expanded`, `aria-selected` and `aria-busy` to the matching state rather than setting conflicting duplicates.
**Why.** React Native forwards each ARIA state alias into the corresponding native accessibility state, with the alias taking precedence when both are supplied.
**When not to.** Use only the accessibility state props when the installed version or component does not declare the ARIA aliases.
**Pitfall.** Updating `accessibilityState` while a stale `aria-*` prop remains set leaves the exposed value unchanged.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/accessibility

---

## 2. NAMES AND ACTIONS

### N-A3. Names, hints and grouped controls

**Rule.** Use `accessible` to group a composite only when its descendants are not independent controls, provide one concise `accessibilityLabel` and use `accessibilityHint` only for a non-obvious action result.
**Why.** Grouping exposes one focus stop, while a separate hint adds context after the name and role are announced.
**When not to.** Leave child buttons and links individually accessible when each can be operated on its own.
**Pitfall.** A label that repeats the role adds no identifying information, and grouping independent controls can hide them from sequential navigation.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/accessibility

### N-A4. Custom accessibility actions

**Rule.** Expose a non-standard operation through `accessibilityActions` and handle it in `onAccessibilityAction`.
**Why.** The action list lets assistive technology discover operations that a standard press action does not represent.
**When not to.** Use the normal press action when the control performs only its ordinary activation.
**Pitfall.** Declaring an action without handling its matching event exposes an operation that does nothing.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/accessibility#accessibility-actions

---

## 3. ANNOUNCEMENTS AND VISIBILITY

### N-A5. Accessibility announcements

**Rule.** Announce important asynchronous updates with `AccessibilityInfo.announceForAccessibility`, and use `accessibilityLiveRegion` for Android text that updates in place.
**Why.** The announcement API sends an explicit spoken event, while Android live-region modes report changes to an existing view.
**When not to.** Do not announce a change that navigation or focus already communicates.
**Pitfall.** Sending the same status through a live region and an explicit announcement can make it speak twice.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/accessibilityinfo

### N-A6. Hiding a subtree

**Rule.** Hide an inaccessible background subtree with `importantForAccessibility="no-hide-descendants"` on Android, `accessibilityElementsHidden` on iOS or `aria-hidden` where its alias is supported.
**Why.** These props remove descendants from assistive-technology traversal through platform-specific accessibility trees.
**When not to.** Keep the subtree exposed when its controls remain available to the user.
**Pitfall.** Hiding a subtree that contains focus leaves accessibility focus on content that cannot be reached.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/accessibility

---

## 4. MODAL CONTAINMENT AND TOUCH BOUNDS

### N-A7. Modal containment

**Rule.** Mark a custom modal with `accessibilityViewIsModal` on iOS and `aria-modal` when using the React Native ARIA alias.
**Why.** The modal marker tells assistive technology to treat content outside the modal as unavailable while it is open.
**When not to.** Do not mark a non-modal panel as modal when the surrounding screen remains operable.
**Pitfall.** A modal marker does not move focus into the modal or return it after dismissal.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/accessibility

### N-A8. Hit slop

**Rule.** Use `hitSlop` to reach the [native target-size rule](react-native-layout-and-a11y.md#3-accessibility-props) when the visible control cannot grow without changing the layout.
**Why.** The touch area can extend beyond the rendered bounds but remains clipped by its parent and loses overlaps to a higher-priority sibling.
**When not to.** Increase the visible control instead when hit slop would overlap a neighboring action.
**Pitfall.** A large hit area does not escape parent bounds or guarantee that it wins a touch against a sibling.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/view#hitslop
