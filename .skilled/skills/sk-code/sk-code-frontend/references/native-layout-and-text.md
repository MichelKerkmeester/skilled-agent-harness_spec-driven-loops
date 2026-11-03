---
title: Native Layout and Text
description: React Native Yoga sizing, text scaling, truncation and platform text metrics for native frontend work.
trigger_phrases:
  - "react native flex basis"
  - "native text scaling"
  - "android text metrics"
importance_tier: important
contextType: implementation
version: 1.0.1.0
---

# Native Layout and Text

Support figures are from the React Native 0.83 documentation and source, checked 2026-11-03. React Native 0.76 is inferred, not verified.

Yoga defaults and baseline text-scaling rules stay in [`react-native-layout-and-a11y.md`](react-native-layout-and-a11y.md). This file covers sizing and text decisions that need platform-specific detail.

---

## 1. OVERVIEW AND FLEX AND GEOMETRY

### N-L1. Flex basis and width

**Rule.** Use positive `flex` for proportional growth and set `flexBasis` when a child needs a main-axis starting size.
**Why.** In React Native, a positive `flex` sets `flexGrow` to that value with a zero `flexBasis`, and `flexShrink` keeps the Yoga default of zero unless it is set. The `flexBasis` property sets the main-axis size before grow and shrink calculations, acting like `width` in a row and `height` in a column. The React Native documentation describes a positive `flex` as also setting `flexShrink: 1`, while `resolveFlexShrink` in the Yoga `Node.cpp` bundled with React Native 0.83.10 resolves an unset `flexShrink` to 0 unless `flex` is negative. Set `flexShrink` explicitly whenever shrinking matters.
**When not to.** Set `width` or `height` directly when the child needs a fixed cross-axis size and should not share main-axis space.
**Pitfall.** Pairing positive `flex` with a fixed width can suggest that the width anchors the layout even though a zero basis starts flex calculation.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/layout-props

### N-L2. Flex gaps

**Rule.** Use `gap` for even gutters or set `rowGap` and `columnGap` separately when the axes need different values.
**Why.** These properties add a gutter between rows or columns without adding space around the group's outer edges.
**When not to.** Use a child margin when one item needs a unique offset or the spacing must differ on its two sides.
**Pitfall.** Combining a group gap with margins on every child doubles the intended spacing.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/flexbox

### N-L3. Absolute layers and stacking

**Rule.** Use absolute positioning only for an overlay with a clear anchor, then set stacking and shadow behavior for each platform.
**Why.** An absolute child leaves normal flex flow. The `zIndex` prop controls stacking, while Android `elevation` adds a native shadow and affects z-order. For cross-platform shadow behavior, see [native platform differences](native-platform-differences.md#1-overview-and-shadows-and-press-feedback).
**When not to.** Keep content in the flex flow when its size should move or resize sibling content.
**Pitfall.** Raising `zIndex` alone can place an Android view above a sibling without giving it the expected native shadow.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/view-style-props

### N-L4. Aspect ratio

**Rule.** Set `aspectRatio` when one measured dimension should determine the other.
**Why.** Yoga derives the missing dimension from the supplied width or height and the ratio.
**When not to.** Use content-driven sizing when text or media should determine its own height instead of preserving a fixed proportion.
**Pitfall.** Supplying conflicting fixed dimensions can prevent the ratio from producing the intended frame.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/layout-props

---

## 2. FONT SCALE AND TRUNCATION

### N-L5. OS font scale ownership

**Rule.** Leave OS font scaling enabled and use an app-level width scale only for the design tokens that own it.
**Why.** The `allowFontScaling` prop applies the user's accessibility text setting. The `maxFontSizeMultiplier` prop caps that multiplier without disabling it. A width-based `fontScale` design helper is separate from OS font scaling. A module-scope `Dimensions.get('window')` read does not update after rotation or split-screen changes.
**When not to.** Skip the width helper when a token should respond only to the user's OS font setting.
**Pitfall.** Calling the app's `fontScale` helper an OS font setting or setting `allowFontScaling={false}` can remove the accessibility scale from the final text size.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/text

### N-L6. Line limits and font fitting

**Rule.** Use `numberOfLines` with a deliberate `ellipsizeMode` for compact text and reserve `adjustsFontSizeToFit` for boxes with a known minimum size.
**Why.** React Native computes the line limit after wrapping. On Android, multiline text supports only the `tail` ellipsis mode. The `adjustsFontSizeToFit` prop shrinks text to fit its constraints.
**When not to.** Let text wrap and grow when a reader needs the full copy at the user's chosen font scale.
**Pitfall.** Combining a tight line limit with font fitting can reduce a label below the size a person expects from the system setting.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/text

---

## 3. ANDROID TEXT METRICS

### N-L7. Font padding and nested text

**Rule.** Change Android `includeFontPadding` only after checking the typeface's vertical metrics.
**Why.** Android text defaults to `includeFontPadding: true`, which adds extra space above and below the glyphs. The `textAlignVertical` prop controls placement inside an input. Nested `Text` inherits styles within its text tree, not across an intervening `View`.
**When not to.** Keep the default font padding when the typeface needs its extra ascent and descent space and leave single-line input alignment at its platform default.
**Pitfall.** Removing font padding for one typeface can clip accents or descenders in another.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/text
