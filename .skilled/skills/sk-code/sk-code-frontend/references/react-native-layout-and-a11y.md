---
title: React Native Layout and Accessibility Practice
description: Native rules for the frontend-practice core, covering Yoga layout, accessibility, text scaling, inputs, images, lists and capture limits.
trigger_phrases:
  - "react native layout practice"
  - "react native accessibility props"
  - "react native font scaling"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# React Native Layout and Accessibility Practice

The native layer for frontend practice, with React Native mechanics kept beside the rules they express.

---

## 1. OVERVIEW AND BOUNDARY

This file is the native layer of [`frontend-practice.md`](frontend-practice.md). It expresses all eleven core principles through React Native and Yoga behavior.

Yoga is not the browser. Start from its defaults, describe every control to the screen reader and keep the user's font size available.

This file covers what project standards do not. It does not own:

- **Tokens, `StyleSheet`, scaling helpers, typography components and safe areas.** Follow the active mode's documented design-system and safe-area conventions.
- **Token names and versions.** Use the project's installed design tokens. The core's [token rule](frontend-practice.md#3-values-and-precedence) says to report a missing token.
- **Values.** Spacing, type, color and target sizes come from [`sk-design-fundamentals`](../../../sk-design/sk-design-fundamentals/SKILL.md), with the cross-stack subset in [core Section 3](frontend-practice.md#3-values-and-precedence).
- **Figma translation.** The shared rules and five-pass check are in [`figma-to-code.md`](figma-to-code.md) and [core Section 4](frontend-practice.md#4-figma-as-reference).
- **Visual style and motion.** Use the active design system's guidance for a screen's visual style. Follow the mode's reference for its reduced-motion mechanism. This layer prescribes no API that a mode's docs do not name.

A project mode may replace, extend or disable one core or stack-layer statement. Follow the core's [overrides rule](frontend-practice.md#5-overrides). The mode declares its choice under a Frontend overrides heading in its own SKILL.md.

---

## 2. LAYOUT

- Yoga defaults differ from the web: `flexDirection: 'column'`, `alignItems: 'stretch'`, `flexShrink: 0`, no grid and no margin collapsing. Write layout for these defaults instead of porting web CSS.
- Space siblings with `gap`, `rowGap` and `columnGap` instead of a margin on every child. This expresses [core principle 4](frontend-practice.md#2-the-eleven-principles).
- Use `position: 'absolute'` for overlays, badges and floating buttons. Ordinary content stays in the flex flow, as [core principle 4](frontend-practice.md#2-the-eleven-principles) requires.
- Keep media proportional with `aspectRatio` rather than a fixed width and height.
- Read screen size with `useWindowDimensions()`, which updates on rotation and split screen. `Dimensions.get()` at module scope captures one size forever. This supports [core principle 9](frontend-practice.md#2-the-eleven-principles).
- Use `onLayout` only when a measurement is truly required. It costs an extra render.
- Text inside a row needs `flexShrink: 1` or `flex: 1`, so it wraps or truncates instead of pushing siblings off screen.
- Never set a fixed `height` on a container that holds text. Larger font settings will clip it. Use `minHeight` to support [core principles 4 and 5](frontend-practice.md#2-the-eleven-principles).


**Deeper:** [Layout and text](native-layout-and-text.md) and [platform differences](native-platform-differences.md).
---

## 3. ACCESSIBILITY PROPS

- Give every interactive element a role with `accessibilityRole` or `role` on newer React Native versions where the app already uses it. Common roles include `button`, `link`, `header`, `switch`, `checkbox`, `tab` and `image`.
- Give every control an `accessibilityLabel` that says what it does. Add an `accessibilityHint` only when the result is not obvious from the label.
- Expose state with `accessibilityState` (`disabled`, `selected`, `checked`, `expanded` and `busy`). Expose slider and progress values with `accessibilityValue` (`min`, `max`, `now` and `text`). These express [core principle 2](frontend-practice.md#2-the-eleven-principles).
- Group a card or row into one focus stop with `accessible` on the parent, so the screen reader does not stop on every text node inside it.
- Hide decoration from assistive technology with `accessibilityElementsHidden` on iOS and `importantForAccessibility="no-hide-descendants"` on Android.
- Announce changes that happen without navigation with `AccessibilityInfo.announceForAccessibility(message)` or `accessibilityLiveRegion="polite"` on Android.
- Reach the minimum target size with `hitSlop` when the visible element is smaller. Core Section 3 states the cross-stack target sizes.
- Use `Pressable` and style its `pressed` state, so every press shows feedback.
- Keep `testID` on elements the tests address. Accessibility props do not replace it.


**Deeper:** [Accessibility](native-accessibility.md).
---

## 4. TEXT AND SCALING

- Leave `allowFontScaling` on. People who raise the system font size need it. This expresses [core principle 5](frontend-practice.md#2-the-eleven-principles).
- When a layout cannot grow without limit, cap it with `maxFontSizeMultiplier`, for example on a tab label, instead of turning scaling off.
- Truncate deliberately with `numberOfLines` and `ellipsizeMode`. Make sure the full text remains reachable elsewhere or through the label.


**Deeper:** [Layout and text](native-layout-and-text.md).
---

## 5. INPUTS

- Match the keyboard to the data with `keyboardType` (`email-address`, `phone-pad`, `number-pad`, `decimal-pad` or `url`).
- Enable autofill with `textContentType` on iOS and `autoComplete` on Android for email, password, new password, one-time code, name and telephone or postal-code fields.
- Set `autoCapitalize` (`none` for email and usernames, `words` for names). Turn `autoCorrect` off for codes, emails and usernames.
- Use `secureTextEntry` for passwords.
- Chain fields with `returnKeyType="next"` and `onSubmitEditing` that focuses the next input through a ref. Set `returnKeyType="done"` on the last field.
- Keep inputs visible above the keyboard with `KeyboardAvoidingView` or the app's keyboard library. Set `keyboardShouldPersistTaps="handled"` on a `ScrollView` that contains inputs, so tapping a button does not only dismiss the keyboard.
- Give every input a visible label and an `accessibilityLabel`. A placeholder is not a label. This expresses [core principle 3](frontend-practice.md#2-the-eleven-principles).


**Deeper:** [Inputs and keyboard](native-inputs-and-keyboard.md).
---

## 6. IMAGES AND LISTS

- Give a meaningful image `accessible` and an `accessibilityLabel`. Give a decorative image `accessible={false}` and hide it from the screen reader. This expresses [core principle 6](frontend-practice.md#2-the-eleven-principles).
- Give every image an explicit size or an `aspectRatio`, so it does not collapse to zero or shift the layout when it loads.
- Choose the fit with `resizeMode` on `Image` or `contentFit` on `expo-image`, whichever the app uses.
- Render long or unbounded content in a virtualized list (`FlatList`, `SectionList` or an installed list library), never in a `ScrollView` with `map`. Choose the list component according to the screen's row and section behavior.

### Figma Check on Native

Passes 1, 2 and 5 are human checks on a device or simulator at frame width W in points, supported by testID-addressed component tests for states. No automated native screenshot capture is claimed.

For Pass 2, check every design variant and each empty, loading, error and disabled state named in the workflow. Record absent design states as not in design. Use the `testID` guidance in [accessibility props](#3-accessibility-props) to address the same elements in component tests. Capture states manually on a device or simulator. Check dark mode only where the mode supports it.

For Pass 3a, read resolved style props in those tests or the app's token constants. For Pass 3b, inspect changed source for literals where tokens exist and run the repository token checker if it has one.

For Pass 5, check below and above W as the mode supports. Use the largest system font scale, VoiceOver or TalkBack, and text and control contrast against their backgrounds. Record a verdict for each check.


**Deeper:** [Accessibility](native-accessibility.md), [lists and motion](native-lists-and-motion.md) and [platform differences](native-platform-differences.md).
---

## 7. PRE-COMPLETION CHECKLIST

- [ ] Layout uses flex flow with `gap`. `position: 'absolute'` appears only for overlays.
- [ ] Text in rows can shrink, and no text container has a fixed `height`.
- [ ] Screen size comes from `useWindowDimensions()`, not module-scope `Dimensions.get()`.
- [ ] Every interactive element has a role, a label and its state.
- [ ] Decorative elements are hidden from the screen reader, and related content is grouped.
- [ ] Every target reaches the minimum size directly or through `hitSlop`.
- [ ] Inputs have the right keyboard, autofill hint, capitalization and focus chaining, and stay above the keyboard.
- [ ] Long lists are virtualized.
- [ ] The Figma five-pass check and its verdicts were recorded, including a reason for any `NOT RUN` pass.
- [ ] The screen was checked with VoiceOver or TalkBack and at the largest system font scale.
- [ ] Content respects the safe-area approach documented by the active mode.
- [ ] Non-essential motion respects the platform reduced-motion setting using the mechanism documented by the mode.
- [ ] Text and controls meet the contrast target on every supported theme.
