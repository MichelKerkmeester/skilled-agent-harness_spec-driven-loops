---
title: Native Inputs and Keyboard
description: React Native text input semantics, keyboard avoidance, autofill and focus behavior for native frontend work.
trigger_phrases:
  - "react native keyboard avoidance"
  - "native text input props"
  - "keyboard focus chaining"
importance_tier: important
contextType: implementation
version: 1.0.1.0
---

# Native Inputs and Keyboard

Support figures are from the React Native 0.83 documentation and source, checked 2026-11-03. React Native 0.76 is inferred, not verified.

Baseline input props and labels stay in [`react-native-layout-and-a11y.md`](react-native-layout-and-a11y.md). This file covers keyboard movement and input behavior that changes by screen or platform.

---

## 1. OVERVIEW AND KEYBOARD AVOIDANCE

### N-K1. One keyboard strategy per screen

**Rule.** Choose one keyboard avoidance strategy for each screen and never nest `KeyboardAvoidingView` with `KeyboardAwareScrollView`.
**Why.** Each wrapper adjusts keyboard movement independently, so nesting compounds the displacement. Usage counts alone cannot establish whether a screen nests both `KeyboardAvoidingView` and `KeyboardAwareScrollView`.
**When not to.** Skip a wrapper when the screen's native window-resize strategy already keeps the focused input visible.
**Pitfall.** Adding a second wrapper to compensate for a bad offset can shift the form twice.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/keyboardavoidingview

### N-K2. Keyboard vertical offset

**Rule.** Set `keyboardVerticalOffset` to the header height plus the top safe-area inset.
**Why.** The prop measures the distance between the screen top and the avoiding view, so a fixed device-independent constant misses the current header and inset.
**When not to.** Use zero when the avoiding view starts at the screen top and no header or top inset precedes it.
**Pitfall.** Counting an inset twice when a parent already positions the view below the safe area leaves a gap above the keyboard.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/keyboardavoidingview

### N-K3. Platform keyboard behavior

**Rule.** Set `KeyboardAvoidingView` behavior for each platform and verify it inside the screen's real container.
**Why.** The `padding` behavior adds keyboard height to bottom padding. The `position` behavior shifts the content container. The `height` behavior reduces the view height.
**When not to.** Leave behavior unset when the screen uses no `KeyboardAvoidingView`.
**Pitfall.** Leaving behavior implicit can produce different keyboard movement on iOS and Android.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/keyboardavoidingview

### N-K4. Android soft-input mode

**Rule.** Check Android's soft-input mode and system-bar insets together when a screen uses edge-to-edge layout.
**Why.** Expo's `softwareKeyboardLayoutMode` maps to Android `windowSoftInputMode`. Android 15 enforces edge-to-edge for apps targeting API 35 or later, so keyboard movement and system-bar insets need one device check. Compare the [platform edge-to-edge guidance](native-platform-differences.md#2-back-edge-to-edge-and-safe-areas).
**When not to.** Apply this check only to Android screens that can show the software keyboard or draw under system bars.
**Pitfall.** Applying a keyboard-avoidance offset on top of window panning can move a focused field twice.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified. Expo soft-input mode is unconfirmed.
**See also.** https://docs.expo.dev/versions/latest/config/app/#softwarekeyboardlayoutmode

---

## 2. INPUT SEMANTICS

### N-K5. Keyboard and submit hints

**Rule.** Use `inputMode` to choose the keyboard and set `submitBehavior` for submission, with `enterKeyHint` or `returnKeyType` to label the return key.
**Why.** The `inputMode` prop takes precedence over `keyboardType`. The `enterKeyHint` prop takes precedence over `returnKeyType`. The `submitBehavior` prop replaces deprecated `blurOnSubmit`.
**When not to.** Use `keyboardType` directly when a platform-specific keypad value is not available through `inputMode`.
**Pitfall.** Conflicting input and return-key hints can show one action while the handler performs another.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/textinput

### N-K6. Autofill and password fields

**Rule.** Use `textContentType` on iOS, the matching `autoComplete` value where supported and `secureTextEntry` for password secrets.
**Why.** The platform hint identifies the kind of data a field accepts, while secure entry masks the password text.
**When not to.** Leave autofill hints off when the field is intentionally excluded from saved data or holds a transient secret.
**Pitfall.** A current-password hint on a new-password field can lead the OS to offer the wrong saved value. On iOS, `textContentType` takes precedence when both it and `autoComplete` are set. Keep both hints consistent or set only the one each platform reads.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/textinput

---

## 3. FOCUS AND SCROLL TAPS

### N-K7. Focus chaining and persistent taps

**Rule.** Focus the next mounted input through its ref and set `keyboardShouldPersistTaps="handled"` on its parent scroll view when buttons must work with the keyboard open.
**Why.** A ref targets the next native input directly, while `handled` lets a child process a tap without the scroll view first dismissing the keyboard.
**When not to.** Skip focus chaining for a single-field form with no next input.
**Pitfall.** A submit handler can focus a stale ref when conditional rendering has already removed the next field.
**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.
**See also.** https://reactnative.dev/docs/scrollview
