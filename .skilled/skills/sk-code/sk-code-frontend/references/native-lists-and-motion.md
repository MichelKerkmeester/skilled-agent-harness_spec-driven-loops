---
title: Native Lists and Motion
description: React Native virtualized list costs, FlashList recycling and reduced-motion patterns for native frontend work.
trigger_phrases:
  - "native list recycling"
  - "flashlist v2 hooks"
  - "reanimated reduced motion"
importance_tier: important
contextType: implementation
version: 1.0.1.0
---

# Native Lists and Motion

Support figures are from the React Native 0.83 documentation and source, checked 2026-11-03. React Native 0.76 is inferred, not verified.

The stack layer keeps the baseline list and accessibility rules in [`react-native-layout-and-a11y.md`](react-native-layout-and-a11y.md). This file covers virtualization, recycled row state and animation costs.

---

## 1. OVERVIEW AND VIRTUALIZED LISTS

### N-M1. FlatList window and batches

**Rule.** Set FlatList window and batch props to match the row cost and add `getItemLayout` only for fixed item dimensions.
**Why.** The default `windowSize` of 21 keeps ten viewports on either side of the visible area. The `initialNumToRender` prop controls the first batch. The `maxToRenderPerBatch` prop trades fill rate against JavaScript responsiveness. The `removeClippedSubviews` prop detaches offscreen views and defaults to true on Android. The `getItemLayout` prop skips measurement when row dimensions are fixed.
**When not to.** Keep the defaults for a short list that already fills and scrolls without blank cells or slow interactions.
**Pitfall.** Clipping can hide content with transforms or absolute positioning, while an incorrect item length or separator offset sends `scrollToIndex` to the wrong position.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/optimizing-flatlist-configuration

### N-M2. Stable keys and renderers

**Rule.** Return stable item IDs from `keyExtractor` and memoize `renderItem` and row components when repeated row work is measurable.
**Why.** Stable keys let the list track reordered items, while a stable renderer and memoized row can avoid work when their inputs have not changed.
**When not to.** Skip extra memoization for a short static list with trivial rows.
**Pitfall.** Memoization cannot prevent rerenders when each parent pass creates new row props or keys from the array index.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/optimizing-flatlist-configuration

### N-M3. FlashList 2 recycling hooks

**Rule.** Treat FlashList 2 as an enhancement, feature-detect its installed version and architecture before using its hooks and keep FlatList as the baseline.
**Why.** FlashList 2 removes `estimatedItemSize`. Recycled cells keep local state as their item changes. Store item-owned state in the data or reset local state with `useRecyclingState`. The `useLayoutState` hook reports state changes that resize a row. The `useMappingHelper` hook creates mapping keys for nested `.map()` calls.
**When not to.** Skip recycling hooks when a row has no local state or layout changes. Use FlatList when FlashList 2 is not installed.
**Pitfall.** Local state can leak from one recycled item into the next. The v1 `estimatedItemSize` prop does not size a FlashList 2 list.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified. FlashList 2.0.2 is a cited version; installation is unconfirmed. FlatList remains the baseline.
**See also.** https://shopify.github.io/flash-list/docs/v2-changes/

### N-M4. Heterogeneous row types

**Rule.** Treat FlashList item-type recycling as an enhancement and feature-detect library availability before using `getItemType`, with FlatList as the baseline.
**Why.** FlashList uses the returned type to recycle a compatible view for each row structure.
**When not to.** Omit item types when all rows share one view structure or the screen uses FlatList.
**Pitfall.** Returning a new type for cosmetic variants fragments the recycle pools and reduces reuse.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified. FlashList 2.0.2 is a cited version; installation is unconfirmed. FlatList remains the baseline.
**See also.** https://shopify.github.io/flash-list/docs/usage/

---

## 2. ANIMATION SUPPORT

### N-M5. Reanimated 4 architecture gate

**Rule.** Treat Reanimated 4 as an enhancement by feature-detecting the New Architecture and worklets dependency at build time while preserving a React Native Animated or static-state baseline.
**Why.** Reanimated 4 supports only the New Architecture and moves worklet support into `react-native-worklets`, which requires a native rebuild.
**When not to.** Avoid Reanimated 4 in builds that use the legacy architecture or lack the worklets package.
**Pitfall.** Updating the JavaScript package without rebuilding native code leaves the app without the matching worklet runtime.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified. Reanimated 4.4.1 and 4.5.3 are cited versions; availability is unconfirmed. Reanimated 3 is inferred, not verified.
**See also.** https://docs.swmansion.com/react-native-reanimated/docs/guides/migration-from-3.x/

### N-M6. Reduced motion

**Rule.** Read `useReducedMotion()` in the component and pass `reduceMotion: ReduceMotion.System` in animation configs, with a static state as the reduced path.
**Why.** The hook returns a boolean for the system preference at app start and does not rerender when the setting changes. `ReduceMotion.System` applies the preference through the animation config.
**When not to.** Use a static state when the app has no motion to control or its installed Reanimated version does not expose these APIs.
**Pitfall.** Calling the hook inside a worklet violates React hook rules. The hook also does not update the component after a preference change.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified. Reanimated 4.4.1 and 4.5.3 are cited versions. Reanimated 3 documentation also describes these APIs, but installed-version support is unconfirmed. This entry is not Reanimated 4 content.
**See also.** https://docs.swmansion.com/react-native-reanimated/docs/device/useReducedMotion/

### N-M7. Transform and layout motion

**Rule.** Animate `transform` and `opacity` when an element can move without changing surrounding layout.
**Why.** These properties change visual position or visibility without recalculating sibling layout, while layout animations must measure and position affected views again.
**When not to.** Use a layout animation when expansion or reordering must move surrounding content with the element.
**Pitfall.** Animating layout across many rows can multiply layout work during scrolling and produce dropped frames.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/animations
