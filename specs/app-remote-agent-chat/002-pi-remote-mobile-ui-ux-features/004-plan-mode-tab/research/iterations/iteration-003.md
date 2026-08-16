<!-- provenance: external-CLI orchestration pass; original file iter-03-sol.md -->
> **Source pass 3** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-3-sol.md`.

<!-- F4-plan-mode-tab | model=sol | lens=accessibility-i18n | iter 3/10 | 2026-08-15T19:34:42.363Z -->

## 1. Findings for the accessibility–i18n lens

### Mode must be exposed as state, not merely decoration

Build and Plan are mutually exclusive session states. The most accurate web semantics are therefore a labeled radio group, visually styled as a segmented control, or a mode button that opens such a group. React Aria’s `RadioGroup` is specifically intended for one choice among mutually exclusive options and provides controlled value state; the WAI-ARIA radio pattern defines selected-state announcements and arrow-key behavior. This is clearer to VoiceOver than two unrelated buttons or a switch whose label changes. [React Aria RadioGroup](https://react-aria.adobe.com/RadioGroup), [WAI-ARIA radio-group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)

A single toggle labeled alternately “Build” and “Plan” is weaker: ARIA requires a toggle button’s accessible label to remain stable while `aria-pressed` communicates its state. Apple likewise expects VoiceOver to expose both control type and current value/state without embedding “selected” or “checked” in the label. [WAI-ARIA button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/), [Apple VoiceOver evaluation criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/voiceover-evaluation-criteria)

### The mode must remain perceivable after the popover closes

Claude exposes mode selection beside the prompt on web/mobile and keeps the current permission mode visible; its CLI keeps the mode in the status bar. Kimi changes both the prompt marker and bottom status bar when Plan is active. The common pattern is therefore redundant, persistent signaling near the composer—not a choice hidden only under “+”. [Claude permission modes](https://code.claude.com/docs/en/permission-modes), [Kimi work modes](https://www.kimi.com/en-cn/help/kimi-code/cli-work-modes)

Plan needs at least three simultaneous cues:

- Persistent text: `Plan · read-only`.
- A non-color signifier: plan/document or lock glyph plus selected shape.
- Color/fill treatment using clay.

This follows Apple’s requirement that important information not depend on color alone. [Apple accessibility-feature testing](https://developer.apple.com/documentation/accessibility/testing-system-accessibility-features-in-your-app)

### Bare Tab must remain focus navigation

Kimi and Claude CLI both use `Shift+Tab` for Plan mode. Claude Desktop does not inherit the terminal shortcut; it uses a mode menu and `Cmd+Shift+M`, demonstrating that shortcuts should be adapted to the interaction surface rather than copied mechanically. [Kimi keyboard shortcuts](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/keyboard), [Claude Desktop shortcuts](https://code.claude.com/docs/en/desktop)

For a web PWA, `Tab` and `Shift+Tab` are also the conventional forward/backward focus commands. Apple explicitly says standard Tab and arrow navigation should continue working with VoiceOver, while WAI-ARIA advises against shortcuts that inhibit browser, OS, or assistive-technology functions. [Apple VoiceOver evaluation criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/voiceover-evaluation-criteria), [WAI-ARIA `aria-keyshortcuts`](https://www.w3.org/TR/wai-aria/#aria-keyshortcuts)

Consequences:

- Never bind bare `Tab` to mode switching.
- Never intercept `Shift+Tab` document-wide.
- Offer `Cmd+Shift+M` as the default hardware-keyboard command.
- Support CLI-compatible `Shift+Tab` only as an explicit user option, scoped to the composer.
- Keep the visible touch control as the complete alternative for software keyboards.

`aria-keyshortcuts` exposes an implemented shortcut but does not implement it, so JavaScript behavior, discoverability, and conflict handling remain required. [MDN `aria-keyshortcuts`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-keyshortcuts)

### Mode changes should not move focus

Changing mode is an advisory state update, not navigation. Focus should remain on the activating radio, mode button, or composer when a shortcut is used. Pending and successful transitions belong in a pre-existing `role="status"` live region; errors that need immediate attention belong in `role="alert"`. A status region is implicitly polite and atomic and should not receive focus. [MDN status role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role), [WCAG 2.2 status messages](https://www.w3.org/TR/WCAG22/#status-messages)

When a selector popover opens, focus should enter on the currently selected mode. On dismissal it returns to its trigger—or to the composer if opened using the composer shortcut. Plan-completion messages arriving in the background must not reset the VoiceOver reading position; Apple explicitly tests for this. [Apple VoiceOver evaluation criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/voiceover-evaluation-criteria)

### The UI must distinguish confirmed, pending, and unknown state

The displayed mode cannot update optimistically. Revision-checked, fail-closed mutations mean the UI needs at least:

- Last server-confirmed Build.
- Last server-confirmed Plan.
- Switching/verifying.
- Unknown or disconnected.

If a request fails, the selected radio and persistent badge stay on the previous confirmed mode. If reconnecting cannot verify mode, show `Mode unavailable` rather than a stale unqualified Build/Plan claim, and disable mutation and execution controls.

This is also supported by remote-client prior art: Happy documented a dead-end caused by stale permission state and an automatically approved `ExitPlanMode`; its fix routes plan exit through an explicit permission request. Happier exposes Build/Plan as session controls and treats `ExitPlanMode` as an attention/approval event. [Happy plan-mode fix](https://github.com/slopus/happy/blob/main/docs/plans/agent-sdk-upgrade-plan-mode-fix.md), [Happier repository](https://github.com/happier-dev/happier)

### Plan exit and plan execution are different actions

Changing from Plan to Build must mean only “leave read-only planning.” It must not silently execute the plan. A completed plan needs a separate `Execute current plan…` action that:

1. Identifies the reviewed revision.
2. Obtains the one-use mutation ticket.
3. Switches to the intended execution mode.
4. Starts execution only if the revision and ticket are accepted.

Claude follows this distinction: leaving Plan can happen without approval, while approving a plan selects an execution permission mode. [Claude plan review and approval](https://code.claude.com/docs/en/permission-modes#review-and-approve-a-plan)

### Dynamic Type requires explicit PWA treatment

Apple expects layouts to remain usable at all text sizes, avoid truncation, and change from horizontal to stacked layouts when enlarged text crowds controls. WCAG AA separately requires text to resize to 200% without loss and content to reflow at a 320 CSS-pixel-wide viewport. [Apple typography](https://developer.apple.com/design/human-interface-guidelines/typography), [WCAG resize text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text), [WCAG reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html)

WebKit’s native Dynamic Type CSS styles use `font: -apple-system-body` and related system-font tokens. Because Pi Remote’s fixed typography uses Inter and Source Serif 4, it should not assume native iOS Dynamic Type will scale those fonts equivalently. It needs relative units, browser zoom support, and an in-app 100–200% text-size preference. [WebKit system font and Dynamic Type](https://webkit.org/blog/3709/using-the-system-font-in-web-content/)

### Clay cannot carry critical foreground information on bone

Using the WCAG relative-luminance formula, clay `#d97757` against bone `#f8f8f6` is approximately **2.94:1**. It therefore fails:

- 4.5:1 for ordinary text.
- 3:1 for large text.
- 3:1 for essential control boundaries and graphical state indicators.

Do not use clay alone for Plan text, a thin selected outline, or the focus ring on bone. Use clay as a fill/tint with carbon text and a carbon boundary, subject to token-level contrast verification. WCAG requires 4.5:1 for ordinary text and 3:1 for meaningful non-text UI. [WCAG 2.2 contrast requirements](https://www.w3.org/TR/WCAG22/#contrast-minimum)

### RTL requires semantic direction, not visual flipping hacks

Set the document’s `lang` and `dir` from locale. Use CSS logical properties (`padding-inline-*`, `margin-inline-*`, `inset-inline-*`, `text-align:start`) rather than left/right declarations. The DOM order can remain Build then Plan; the RTL layout places the first item at the right-side start while assistive-technology reading order remains logical. Apple expects RTL interfaces and alignment to reverse where appropriate. [Apple RTL guidance](https://developer.apple.com/design/human-interface-guidelines/right-to-left)

Agent messages, filenames, commands, and prompts may contain mixed scripts. Use `dir="auto"` for user/agent prose and the textarea; use `<bdi dir="ltr">` for `/plan`, filenames, revision fragments, and keyboard legends. W3C specifically recommends `dir="auto"` for chat and form content whose direction is not known in advance. [W3C structural bidi guidance](https://www.w3.org/International/questions/qa-html-dir), [W3C RTL authoring practices](https://www.w3.org/International/docs/bp-html-bidi/Overview)

## 2. Concrete spec contribution a build phase can execute

### Persistent control

Move mode out of the “+” overflow as its primary surface.

Place a `ModeStatusButton` immediately above or beside the composer:

- Build: tool glyph + `Build`.
- Plan: plan/document glyph + `Plan · read-only`.
- Pending: spinner glyph + `Switching to Plan…` or `Switching to Build…`.
- Unknown: warning glyph + `Mode unavailable`.

The entire button is at least `44px × 44px`, matching Apple’s touch-target guidance and exceeding WCAG 2.2’s 24 CSS-pixel minimum. [Apple hit-target guidance](https://developer.apple.com/go/?id=app-review-design-tips), [WCAG target-size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

Activating it opens a React Aria popover containing:

```text
Agent mode

○ Build
  Pi may execute approved changes.

● Plan
  Read-only exploration and planning.

Keyboard shortcuts…
```

Implement the choices with controlled `RadioGroup value={confirmedMode}` and two `Radio` elements. The selected value changes only after the server confirms `set_mode`.

### State model

| UI state | Persistent text | Controls | Announcement |
|---|---|---|---|
| `build.confirmed` | `Build` | Enabled | `Build mode active.` |
| `plan.confirmed` | `Plan · read-only` | Enabled | `Plan mode active. Changes are blocked.` |
| `switching.toPlan` | `Switching to Plan…` | Mode choices disabled | Same text through `role="status"` |
| `switching.toBuild` | `Switching to Build…` | Mode choices disabled | Same text through `role="status"` |
| `plan.ready` | `Plan · ready for review` | Review and execute actions enabled | `Plan ready. Review it before execution.` |
| `mode.unknown` | `Mode unavailable` | All mutations disabled | `Mode could not be verified. Changes remain blocked.` |
| `transition.failed` | Previous confirmed mode | Re-enabled | Alert: `Mode was not changed. Try again.` |
| `revision.stale` | `Plan · review required` | Execute disabled until refreshed | Alert: `The plan changed. Review the latest version before executing.` |

Maintain one live-region node from initial render:

```html
<div role="status" aria-live="polite" aria-atomic="true" class="sr-only"></div>
<div role="alert" aria-atomic="true" class="sr-only"></div>
```

Update its text; do not mount it only after the event.

### Touch and keyboard interaction

- Tap the persistent mode button: open selector and focus the selected radio.
- Arrow keys: move between Build and Plan using React Aria’s locale-aware radio behavior.
- `Space`: select the focused mode.
- `Escape`: dismiss without changing mode and restore focus.
- Bare `Tab`/`Shift+Tab`: normal focus traversal.
- Default hardware shortcut: `Meta+Shift+M` opens the selector and leaves mode selection explicit.
- Optional setting, `CLI-style Shift+Tab shortcut`: when enabled, `Shift+Tab` toggles mode only while the composer textarea has DOM focus.
- Expose only enabled shortcuts through `aria-keyshortcuts`.
- Ignore shortcut handling during IME composition, while a dialog/popover is open, during a mode request, on key repeat, or when disconnected. `KeyboardEvent.isComposing` identifies events occurring inside an active composition session. [MDN `isComposing`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing)
- Call `preventDefault()` only after all shortcut guards pass.
- Keep focus in the composer after a shortcut-triggered switch.

Present the shortcut visually as localized text plus a direction-isolated key legend:

```html
<span>Switch mode</span>
<bdi dir="ltr"><kbd>⇧</kbd><kbd>Tab</kbd></bdi>
```

Do not create an on-screen fake Tab key for software keyboards; the persistent mode button is the touch equivalent.

### Plan-to-execute handoff

When a plan reaches `ready`, render a transcript card headed `Plan ready` with three actions:

1. `Continue planning`
2. `Leave Plan mode`
3. `Execute current plan…`

`Execute current plan…` opens a modal bottom sheet:

- Accessible name: `Execute current plan`.
- Description: `This leaves read-only Plan mode and starts work from the reviewed plan revision.`
- Primary action: `Execute this revision`.
- Secondary action: `Cancel`.
- Background content is inert.
- Initial focus is the sheet heading or primary action.
- `Escape` closes and returns focus to `Execute current plan…`.

On approval:

1. Announce `Verifying plan revision…`.
2. Submit the reviewed revision and one-use ticket.
3. Do not show Build until the host confirms it.
4. On acceptance, announce `Build mode active. Executing the approved plan.`
5. On stale revision, remain in Plan and focus the updated plan heading after the alert.
6. If Build succeeds but starting execution fails, announce the safety-critical split state: `Build mode is active, but execution did not start.`

A direct Plan → Build selection must show: `Leave Plan mode? The plan remains saved, and nothing will execute.` This confirmation is required only when a reviewable plan exists.

### Screen-reader semantics and focus

- Mode status button accessible name equals its visible text; do not add “button” or “selected” manually.
- Selector label: `Agent mode`.
- Build description: `Pi may execute approved changes.`
- Plan description: `Read-only exploration and planning.`
- Decorative glyphs: `aria-hidden="true"`.
- Spinner text remains available to VoiceOver.
- Never send focus to a toast or live region.
- Do not force focus to a newly completed plan while the user is reading or typing; announce readiness politely and expose a `Review plan` action.
- Ensure the composer, mode control, plan card, and handoff sheet are reachable in both forward and reverse order without loops.

### Visual and contrast specification

- Minimum mode-button block size: `44px`.
- Default text: at least `1rem`; status detail at least `0.875rem`.
- Plan state: clay `#d97757` fill, carbon text, carbon boundary, document/lock glyph.
- Do not use clay text or a clay-only outline on bone.
- Focus indicator: two-color ring so it survives both themes and the clay fill:
  - Inner `2px` carbon.
  - Outer `2px` bone.
  - `2px` offset from the target.
- Focus ring must meet at least 3:1 against both the component and adjacent surface; WCAG’s enhanced focus reference uses the area of a 2 CSS-pixel perimeter. [WCAG focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- Plan mode may tint the composer boundary, but text, icon, and shape must remain the primary signal.
- Never use opacity alone to represent read-only mode.

### Motion

- Default transition: color/background fade, `140ms ease-out`.
- No sliding selector thumb, bounce, scale, or viewport movement.
- Under `@media (prefers-reduced-motion: reduce)`, set transition duration to `0ms`; the new label, icon, and selected shape appear immediately.
- Pending spinners may rotate only when necessary; replace with a static progress glyph under reduced motion. The media query reflects the iOS Reduce Motion preference. [MDN `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)

### Dynamic text and long strings

- Use `rem` for text and `em`/content sizing for controls.
- Provide app text sizes: 100%, 125%, 150%, 200%.
- Do not set `user-scalable=no` or restrictive maximum scale.
- At 150% or when localized labels no longer fit, place the mode button on a full-width row above the textarea.
- Let status text wrap to two or more lines; do not ellipsize `Plan · read-only`, error messages, or handoff actions.
- Apply `min-inline-size:0`, `overflow-wrap:anywhere` where identifiers can be long, and content-driven block heights.
- At 200%, the mode selector becomes a full-width vertical list rather than two compressed horizontal segments.
- The composer and focused control must remain visible above the iOS software keyboard and sticky footer. Sticky content must not completely obscure focused elements. [WCAG focus-not-obscured guidance](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)

### Localization and RTL

All visible and accessibility strings are translation resources. Do not construct announcements by concatenating fragments such as `"Plan" + " active"`; use complete messages with named variables.

Required localization fixtures:

- German or Finnish with strings expanded by at least 40%.
- Arabic in full RTL.
- Hebrew with LTR repository names and paths.
- Japanese using an active IME.
- Pseudolocale with doubled accents and 50% expansion.

Implementation requirements:

- Set `<html lang>` and `<html dir>`.
- Wrap transcript prose and composer with `dir="auto"`.
- Wrap filenames, slash commands, revision fragments, and shortcut legends in `<bdi dir="ltr">`.
- Use Tailwind logical utilities such as `ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, and `end-*`.
- Do not uppercase localized mode labels.
- Do not mirror document/lock icons; do mirror directional chevrons.
- Let React Aria’s locale provider determine radio-group direction and arrow behavior.

### Objective acceptance checks

- VoiceOver on iPhone can identify `Agent mode`, hear Build/Plan selection, change it, review a plan, cancel handoff, and execute a confirmed revision without sighted assistance.
- Full Keyboard Access completes the same flow using only Tab, arrows, Space, Enter, and Escape.
- Bare Tab never changes mode.
- With CLI-style shortcuts disabled, Shift+Tab always moves focus backward.
- With it enabled, Shift+Tab toggles only from the composer and never during IME composition.
- iOS software keyboard leaves the persistent mode control operable.
- At 200% text and a 320 CSS-pixel viewport: no clipped labels, overlap, hidden actions, or two-dimensional page scrolling.
- Arabic RTL produces logical reading order and correctly isolated paths/shortcuts.
- Clay-on-bone is absent from normal text and essential outline-only indicators.
- Reduce Motion removes translation, scale, and rotation effects.
- A failed or stale mutation never changes the displayed confirmed mode.
- Disconnect/reconnect never presents an unverified mode as current.
- Plan → Build alone never starts execution.
- Execute rejects a stale revision and remains in Plan.
- Automated accessibility checks report no name/role/value, contrast, target-size, or focus-order violations; manual VoiceOver and hardware-keyboard checks also pass.

## 3. Divergent / minority ideas worth considering

### Make Plan the session’s visual “safe state”

Instead of treating Build as normal and Plan as a special accent, give Plan a persistent narrow rule around the entire composer and transcript viewport. This turns read-only state into environmental context rather than a small badge. Keep the label and icon so the border is not the sole cue.

### Require an explicit “unlock” gesture to leave Plan

When a reviewable plan exists, replace direct Plan → Build switching with `Hold to leave Plan` or a confirm sheet. This increases friction but may be appropriate because leaving a fail-closed mode changes the session’s authority. It must still have an equivalent single-pointer and keyboard action; dragging or holding cannot be the only path. [WCAG dragging alternatives](https://www.w3.org/TR/WCAG22/#dragging-movements)

### Separate “Mode” from “Authority”

Expose two fields:

```text
Mode: Plan
Authority: Read-only
```

This is more verbose but avoids equating a product label with its security consequence. It also scales if future modes have different approval policies.

### Make CLI parity opt-in, not default

The obvious approach is to copy Claude/Kimi’s `Shift+Tab`. The accessibility-first alternative is:

- Default: `Cmd+Shift+M`.
- User setting: `Use CLI-style Shift+Tab`.
- Persistent explanation: `This replaces backward focus navigation while the composer is active.`

This resists convention where convention conflicts with web keyboard semantics.

### Treat approved plans as immutable named artifacts

The handoff could identify plans with a human-readable title and version—`Authentication migration · version 3`—rather than an opaque revision hash. This would improve VoiceOver comprehension and stale-plan recovery while the hidden revision remains the security authority.

## 4. Open questions + risks

- **Shift+Tab remains the largest accessibility risk.** A web PWA has no reliable, standard method to detect VoiceOver or Full Keyboard Access and automatically disable the collision. Default-on CLI parity cannot guarantee backward focus navigation.
- **Dynamic Type parity is not automatic with Inter.** The build must decide whether the fixed typeface outweighs native `-apple-system-body` scaling or whether an in-app text-size control is mandatory.
- **Mode authority may change outside this client.** The persistent indicator needs a freshness contract: push updates, revision polling, and a defined threshold at which “confirmed” becomes “unknown.”
- **Large-text composer height may consume most of an iPhone viewport.** Test the installed PWA—not only Safari—with the software keyboard, 200% text, landscape, and safe-area insets.
- **Live-region duplication is possible.** VoiceOver may announce both radio selection and the success status. Test whether success announcements should be suppressed when focus remains on the changed radio.
- **Plan-ready confirmation policy needs product agreement.** Confirming every exit slows fast mode switching; confirming only when a reviewable plan exists is the proposed boundary.
- **RTL code content is inherently mixed-direction.** Code blocks should remain LTR and horizontally scrollable, while surrounding prose uses `dir="auto"`.
- **Clay token usage needs theme-specific verification.** Its 2.94:1 ratio against bone is insufficient; the actual carbon and dark-surface tokens must be measured rather than assumed.
- **Mobbin screen-level evidence remains unverified.** Mobbin’s official API returns screen URLs only with authenticated Team/Enterprise access, and no stable public Claude/Kimi Plan-mode screen URL was available. Do not claim a Mobbin visual match until an authenticated search captures the exact screens and version dates. [Mobbin API quick start](https://docs.mobbin.com/api/quickstart)

## 5. Sources

- [Apple Human Interface Guidelines — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Apple Human Interface Guidelines — Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards)
- [Apple Human Interface Guidelines — Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [Apple Human Interface Guidelines — Right to left](https://developer.apple.com/design/human-interface-guidelines/right-to-left)
- [Apple VoiceOver evaluation criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/voiceover-evaluation-criteria)
- [Apple testing system accessibility features](https://developer.apple.com/documentation/accessibility/testing-system-accessibility-features-in-your-app)
- [Apple UI design hit-target guidance](https://developer.apple.com/go/?id=app-review-design-tips)
- [WebKit — Using the system font and Dynamic Type](https://webkit.org/blog/3709/using-the-system-font-in-web-content/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WCAG — Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text)
- [WCAG — Reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html)
- [WCAG — Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG — Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- [WCAG — Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)
- [WAI-ARIA radio-group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [WAI-ARIA button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [WAI-ARIA `aria-keyshortcuts`](https://www.w3.org/TR/wai-aria/#aria-keyshortcuts)
- [React Aria RadioGroup](https://react-aria.adobe.com/RadioGroup)
- [React Aria Popover](https://react-aria.adobe.com/Popover)
- [MDN status role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role)
- [MDN `aria-keyshortcuts`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-keyshortcuts)
- [MDN `KeyboardEvent.isComposing`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing)
- [MDN `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [W3C — Structural markup and RTL text](https://www.w3.org/International/questions/qa-html-dir)
- [W3C — RTL HTML authoring practices](https://www.w3.org/International/docs/bp-html-bidi/Overview)
- [Claude Code permission and Plan modes](https://code.claude.com/docs/en/permission-modes)
- [Claude Code Desktop shortcuts](https://code.claude.com/docs/en/desktop)
- [Kimi Code keyboard shortcuts](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/keyboard)
- [Kimi Code work modes](https://www.kimi.com/en-cn/help/kimi-code/cli-work-modes)
- [Happy — documented Plan-mode handoff failure](https://github.com/slopus/happy/blob/main/docs/plans/agent-sdk-upgrade-plan-mode-fix.md)
- [Happier — mobile/web coding-agent client](https://github.com/happier-dev/happier)
- [Tether — Pi-compatible mobile PWA](https://github.com/larsderidder/tether)
- [Harness Remote — Pi/Claude/OpenCode PWA](https://github.com/giuliastro/harness-remote)
- [MobileCLI — iPhone remote CLI client](https://github.com/MobileCLI/mobilecli)
- [Mobbin API quick start](https://docs.mobbin.com/api/quickstart)
- [Mobbin design-reference catalog](https://mobbin.com/mcp)
