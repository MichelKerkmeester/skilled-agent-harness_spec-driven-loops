<!-- provenance: external-CLI orchestration pass; original file iter-02-sol.md -->
> **Source pass 2** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-2-sol.md`.

<!-- F4-plan-mode-tab | model=sol | lens=interaction-gesture | iter 2/10 | 2026-08-15T19:28:35.685Z -->

# 1. Findings for the interaction-and-gesture lens

## The mode must live beside the composer, not behind “+”

Plan mode changes what the next prompt is allowed to do, so its confirmed state belongs in the composer’s persistent control strip. Apple recommends integrating status feedback near the item it describes, while Claude’s mobile interface places its mode dropdown next to the prompt box. Claude’s CLI separately keeps the current permission mode in its status bar. [Apple HIG: Feedback](https://developer.apple.com/design/human-interface-guidelines/feedback), [Claude Code permission modes](https://code.claude.com/docs/en/permission-modes)

Use one always-visible, tappable mode pill:

- Build: `Build`
- Plan: `Plan · Read-only`
- Completed plan: `Plan ready`
- Pending transition: `Build → Plan…` or `Plan → Build…`
- Unverified connection: `Plan · Unverified`

Keep the existing “+” menu entry as a duplicate route, but drive both surfaces from the same authoritative session state.

This follows established coding-agent behavior without copying desktop UI literally:

- Claude exposes `Shift+Tab` in the CLI, a persistent status-bar mode, and a dropdown beside the mobile composer. Its plan handoff offers execution modes as well as “keep planning.” [Claude Code permission modes](https://code.claude.com/docs/en/permission-modes)
- Kimi supports `Shift+Tab`, `/plan`, startup flags, and AI-requested entry; while planning it changes both the prompt icon and a status badge. Its completed-plan surface supports approve, reject, reject-and-exit, and revision feedback. [Kimi interaction guide](https://moonshotai.github.io/kimi-cli/en/guides/interaction.html)
- Pi’s example extension likewise treats status as persistent UI and distinguishes planning from execution progress. Pi’s RPC protocol can surface extension status and interactive confirmations to remote clients. [Pi plan-mode example](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/plan-mode/index.ts), [Pi RPC extension UI](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md)
- A current Pi community implementation persists `plan active` versus `plan ready` and makes implement, stay, revise, and discard distinct actions. [pi-plan-mode](https://github.com/narumiruna/pi-extensions/tree/main/extensions/pi-plan-mode)

## “Tab affordance” must not mean hijacking plain Tab

On iPhone Full Keyboard Access, `Tab` moves focus forward and `Shift+Tab` moves it backward. Those are also the WAI-ARIA conventions for navigation between web controls. A global plain-Tab binding would therefore break the expected focus model; a global `Shift+Tab` binding conflicts with reverse focus navigation. [Apple: Control iPhone with an external keyboard](https://support.apple.com/en-ie/guide/iphone/ipha4375873f/26/ios/26), [WAI-ARIA keyboard interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)

The least harmful target-parity interpretation is:

- Never bind plain `Tab`.
- Support `Shift+Tab` only while the composer textarea itself has focus.
- Do not intercept it while a menu, dialog, plan viewer, transcript control, or other field has focus.
- Provide `Command+Shift+P` as the non-conflicting app shortcut; Apple recommends Command as the principal modifier for custom shortcuts. [Apple HIG: Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards)
- Show `⇧Tab` and `⌘⇧P` in the mode menu, rather than expecting users to discover them accidentally.
- Provide a “CLI shortcuts” preference that can disable the contextual `Shift+Tab` mapping for Full Keyboard Access users.

The brief’s soft-keyboard limitation makes the persistent touch control mandatory: keyboard shortcuts are accelerators, never the only entry or exit path. Apple’s configurable software-keyboard surface is centered on keyboard type and Return-key behavior, whereas hardware keyboard commands are a separate input path. [Apple `UITextField` documentation](https://developer.apple.com/documentation/uikit/uitextfield), [Apple `UIKeyCommand`](https://developer.apple.com/documentation/uikit/uikeycommand)

## Plan mode is an acknowledged remote state, not a local toggle

The visual mode must change only after the host confirms the revision-checked request. A remote client can otherwise display Plan while the host remains write-capable. This is not theoretical: Happy’s Claude bridge contains an explicit warning that resetting mode defaults can silently desynchronize a picker from what the next turn actually runs. [Happy mode synchronization source](https://github.com/slopus/happy/blob/main/packages/happy-cli/src/claude/runClaude.ts)

Consequences for interaction design:

- Never optimistically recolor `Build` into `Plan`.
- While a request is pending, preserve the confirmed source mode in the label: `Build → Plan…`.
- Disable repeated mode requests until acknowledgment, rejection, or resynchronization.
- On disconnect, retain the last confirmed value but append `Unverified`; disable Build escalation and execution.
- A stale-revision rejection leaves the session in Plan and offers `Refresh session`, never “try anyway.”
- Entering Plan can be one-step because it reduces capabilities.
- Leaving Plan increases capabilities and therefore requires an explicit confirmation.

Remote-agent precedents reinforce the need for visible state, approval, and recovery rather than terminal emulation alone: CC Pocket includes mobile approvals, missed-event recovery, queued sends, and Tailscale connectivity; Harness Remote uses persistent `idle`/`busy`/`retry` status pills and deliberately excludes live agent requests from its PWA cache. [CC Pocket](https://github.com/K9i-0/ccpocket), [Harness Remote](https://github.com/giuliastro/harness-remote)

## Plan completion is a new state, not automatic permission to execute

Claude and Kimi both stop at a review boundary. Claude allows approval into different execution modes or continued planning; Kimi allows approve, revise, reject, and reject-and-exit. Neither pattern treats a completed plan as implicit authorization to mutate. [Claude Code permission modes](https://code.claude.com/docs/en/permission-modes), [Kimi interaction guide](https://moonshotai.github.io/kimi-cli/en/guides/interaction.html)

Pi Remote therefore needs three distinct user concepts:

1. `Plan active`: exploration is still occurring.
2. `Plan ready`: a specific plan revision can be reviewed.
3. `Executing`: the user approved that exact plan revision and the host accepted the handoff.

“Switch to Build” and “Execute this plan” must remain different:

- Switch to Build changes capability for later prompts but sends nothing.
- Execute this plan binds an explicit execution request to the reviewed plan revision.

## Touch should be conservative because this control changes authority

Apple assigns tap to activation, touch-and-hold to contextual controls, and swipe to revealing actions, dismissing views, or scrolling. It also advises against repurposing familiar gestures for unique app commands and requires alternate input paths. [Apple HIG: Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures)

For this feature:

- Tap opens or activates explicit controls.
- Long-press does not switch modes.
- Horizontal swipe does not switch modes.
- Pulling the review sheet down is equivalent to “Keep planning,” never approval.
- A mode change commits on release inside the target, not on touch-down; this preserves pointer cancellation.
- Double-tap has no special meaning.

The mode button and every sheet action should have a minimum 44×44 CSS-pixel hit region, operationalizing Apple’s 44×44-point recommendation and exceeding WCAG 2.2’s 24×24 CSS-pixel AA minimum. [Apple HIG: Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons), [WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

## Color and animation cannot carry mode semantics alone

Clay `#d97757` against bone `#f8f8f6` calculates to approximately 2.94:1 using the WCAG relative-luminance formula—just below the 3:1 non-text threshold. Clay may decorate Plan mode, but cannot be the only border, icon, or status cue. Use the words `Plan · Read-only`, a plan icon, and a carbon-contrast outline; clay is the redundant accent. [WCAG contrast requirements](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)

Motion should confirm causality without delaying use. Apple recommends brief, purposeful, cancellable animation and warns against unnecessary motion on frequent interactions. [Apple HIG: Motion](https://developer.apple.com/design/human-interface-guidelines/motion)

A web PWA should not promise iPhone haptics: the standardized Vibration API remains limited and is not implemented in current WebKit-based browsers. [W3C Vibration API implementation report](https://w3c.github.io/vibration/reports/implementation.html)

## Mobbin evidence boundary

Mobbin was consulted as the requested reference library, but its public iOS catalog exposed only the catalog shell during this pass; screen images are delivered through its authenticated MCP/API. No Claude or Kimi gesture behavior is inferred from an inaccessible screenshot. Official product documentation is used for those behavioral claims. [Mobbin iOS catalog](https://mobbin.com/discover/apps/ios), [Mobbin MCP introduction](https://docs.mobbin.com/mcp/introduction)

# 2. Concrete spec contribution a build phase can execute

## Persistent composer control

Place the mode control between the attachment/“+” button and the text composer:

`[ + ] [ Plan · Read-only ] [ Message Pi… ] [ Send ]`

Specifications:

- Component: React Aria `Button` opening a single-selection `Menu`; do not model it as a binary switch.
- Reason: the visible content changes between Build, Plan, Plan ready, and unverified states. React Aria specifically reserves toggle buttons for stable-content pressed states; its menu supports selected items, textual descriptions, and visible keyboard-shortcut hints. [React Aria ToggleButton](https://react-aria.adobe.com/ToggleButton), [React Aria Menu](https://react-aria.adobe.com/Menu)
- Height: 44px.
- Minimum width: 104px; maximum width: 152px.
- Horizontal padding: 12px; gap: 6px.
- Label: Inter, 14px/18px, weight 600.
- Status explanation in menu: Source Serif 4, 13px/18px.
- Shape: full pill radius.
- Light mode: bone background, carbon text and carbon-contrast outline; clay plan icon/dot is decorative.
- Dark mode: carbon surface, bone text and outline; clay remains a secondary accent.
- Focus: 2px solid focus ring with at least 3:1 contrast and 2px offset. WCAG describes a two-CSS-pixel perimeter as the simplest conforming focus treatment. [WCAG focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- Accessible name examples:
  - `Mode: Build. Activate to change mode.`
  - `Mode: Plan, read-only. Activate to change mode.`
  - `Plan ready. Activate to review or change mode.`

## Authoritative state model

Maintain these independent fields rather than one `isPlan` boolean:

```text
confirmedMode: "build" | "plan"
modeRevision: integer
transition: null | { target, requestId, startedAt }
connection: "synced" | "resyncing" | "offline" | "error"
planPhase: "none" | "active" | "ready" | "executing"
planRevision: null | integer
```

Render the combined states as follows:

| State | Persistent label | Allowed action |
|---|---|---|
| Synced Build | `Build` | Enter Plan |
| Requesting Plan | `Build → Plan…` | Cancel menu only |
| Synced Plan, drafting | `Plan · Read-only` | Continue planning; request Build |
| Plan complete | `Plan ready` | Review plan; continue planning; request Build |
| Requesting Build | `Plan → Build…` | Cancel confirmation only |
| Execution accepted | `Build · Executing` | Stop execution |
| Offline from Build | `Build · Unverified` | No mode mutation |
| Offline from Plan | `Plan · Unverified` | No exit or execution |
| Revision conflict | Current server-confirmed mode plus `Updated` | Refresh/reopen selector |

A reconnect must fetch the host’s current mode and revision before enabling mode controls.

## Mode-entry transition

### Touch

1. Tap the persistent mode pill.
2. Open a bottom-anchored menu above the composer.
3. Focus/check the current mode.
4. Menu rows:
   - `Build` — `Pi may use write-capable tools`
   - `Plan` — `Read-only exploration and planning`
5. Selecting Plan closes the menu and sends one `set_mode(plan)` request bound to the expected session revision and a one-use ticket.
6. Keep the label `Build → Plan…` until acknowledgment.
7. On success:
   - Change to `Plan · Read-only`.
   - Keep composer focus if it had focus before the menu.
   - Announce once: `Plan mode on. Pi is read-only.`
8. On rejection:
   - Restore `Build`.
   - Keep the user’s draft untouched.
   - Show an inline message above the composer: `Couldn’t enter Plan mode. Session state changed.`
   - Offer `Refresh`.

Entering Plan must not interrupt or relabel an already-running Build action. If Pi is busy, show `Plan after current turn` only if the host implements an explicit queued-boundary guarantee; otherwise disable the choice with `Stop the current turn before changing mode`.

## Mode-exit transition

Selecting Build from confirmed Plan opens a confirmation sheet:

**Switch to Build mode?**

`Pi will regain write-capable tools. This does not execute the current plan.`

Actions, in DOM and focus order:

1. `Keep Plan mode`
2. `Switch to Build`

Default focus is `Keep Plan mode`. A swipe-down dismissal, Escape, or backdrop tap performs the first action.

After confirmation:

- Send `set_mode(build)` with the current expected revision and one-use ticket.
- Render `Plan → Build…`.
- Do not enable write-oriented UI until acknowledgment.
- On stale revision, remain in Plan and explain that the session changed.
- On success, render `Build`; do not automatically submit the draft or execute a stored plan.

## Hardware-keyboard behavior

### Required mappings

- `Tab`: always normal forward focus.
- `Shift+Tab`:
  - Toggle Build/Plan only while the composer textarea has DOM focus.
  - Otherwise retain normal reverse-focus behavior.
- `Command+Shift+P`: open the mode menu from anywhere inside the app, except while an OS/browser shortcut has already consumed the event.
- `Escape`: close the topmost menu or sheet without changing mode.
- `Arrow Up`/`Arrow Down`: move between menu items.
- `Enter`/`Space`: select the focused menu item.

### Event guards

Ignore a shortcut when:

- `event.isComposing` is true;
- `event.repeat` is true;
- a modal, menu, or plan-review surface is open;
- the target is another editable field;
- the session is offline, resynchronizing, or already transitioning;
- the event has already been prevented.

Use `event.key`, not deprecated numeric key codes. Keep focus in the composer after a successful composer-scoped shortcut. Add `aria-keyshortcuts="Shift+Tab Meta+Shift+P"` to the mode control.

The menu displays right-aligned keycaps using React Aria’s `Keyboard` presentation:

- `Plan / Build` — `⇧Tab`
- `Open mode menu` — `⌘⇧P`

Include a settings toggle: `CLI-style Shift+Tab in composer`. Disabling it restores normal reverse focus everywhere.

## Focus order

Use DOM order rather than positive `tabindex` values:

1. Transcript’s next actionable control
2. Attachment/“+”
3. Mode pill
4. Composer textarea
5. Send or Stop

When the mode menu opens:

- Move focus to the checked item.
- Arrow keys move inside the menu.
- Tab leaves or dismisses according to React Aria’s standard overlay behavior.
- Escape dismisses.
- Closing restores focus to the mode pill, except when the menu was invoked from the composer shortcut; then restore the composer and its selection.

For the Build confirmation and plan-review dialog:

- Trap focus within the modal.
- Put the safe/non-mutating action first.
- Restore focus to the invoker on dismissal.
- Never change mode merely because an item received focus; WCAG prohibits focus alone from causing a context change. [WCAG: On Focus](https://www.w3.org/WAI/WCAG22/Understanding/on-focus.html)

## Plan-ready and execution handoff

When the host publishes a completed plan:

- Change the pill from `Plan · Read-only` to `Plan ready`.
- Add a transcript-end card:
  - heading `Plan ready`
  - metadata `Revision 7 · Read-only`
  - button `Review plan`
- Do not open the sheet automatically and do not steal focus.

The review sheet contains:

1. Full plan content.
2. Revision and generation timestamp.
3. `Continue planning`
4. `Execute this plan…`
5. Secondary overflow action: `Exit Plan and discard`

`Continue planning` dismisses the sheet and preserves Plan mode. Submitting revision feedback immediately changes `planPhase` from `ready` back to `active`, so the superseded plan cannot still be executed.

`Execute this plan…` opens a second, compact confirmation:

**Execute plan revision 7 in Build mode?**

`Pi may modify files and run write-capable tools. Execution applies only to this reviewed plan revision.`

Actions:

1. `Cancel`
2. `Execute in Build`

On confirmation, send one atomic handoff request bound to:

```text
sessionId
expectedSessionRevision
expectedPlanRevision
planDigest
targetMode = "build"
action = "execute_plan"
oneUseTicket
```

The host must atomically validate the ticket and both revisions, switch mode, and enqueue the bound plan. Two independent client calls—first Build, then “execute”—create an unsafe intermediate state and are not acceptable.

Success:

- Dismiss the sheet.
- Render `Build · Executing`.
- Add a transcript event: `Executing plan revision 7`.
- Announce: `Plan approved. Build mode on. Execution started.`

Failure:

- Keep the sheet open.
- Remain visibly in Plan.
- Preserve scroll position.
- Show the specific recoverable reason:
  - `Plan changed—review the latest revision.`
  - `Session changed—refresh before executing.`
  - `Connection lost—execution was not authorized.`

## Accessibility announcements

Mount a persistent empty status node at application startup:

```html
<div role="status" aria-live="polite" aria-atomic="true"></div>
```

Use it for successful mode changes and resynchronization. A status role is implicitly polite and atomic and must not receive focus when updated. [ARIA status role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role)

Announce only terminal state changes, not spinner frames:

- `Switching to Plan mode.` after an 800ms delay, if still pending.
- `Plan mode on. Pi is read-only.`
- `Build mode on.`
- `Plan ready for review.`
- `Mode could not be verified. Controls disabled.`

Use a visible inline error plus `role="alert"` only for failures requiring immediate correction. Avoid combining redundant assertive attributes because VoiceOver on iOS can double-announce them. [MDN: ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions)

## Motion and press feedback

- Button press: immediate background/opacity state; return over 80ms.
- Menu open: 140ms opacity plus 2px vertical translation.
- Confirmation sheet: 180ms ease-out from the bottom.
- Confirmed mode change: 120ms cross-fade of label and icon.
- No celebratory animation, lateral swipe, bounce, or continuous pulsing.
- Pending indicator: one low-motion spinner beside persistent text.
- Under `prefers-reduced-motion: reduce`, remove transforms and use an immediate opacity/state change.
- Never wait for animation completion before enabling the next safe action.

## iPhone viewport behavior

Use `viewport-fit=cover` and pad the composer with `max(base-spacing, env(safe-area-inset-bottom))`; WebKit documents these environment variables specifically to keep controls clear of the home indicator. [WebKit safe-area guidance](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)

When the software keyboard appears:

- Keep the mode pill in the same composer row, above the obscured region.
- Observe `window.visualViewport` resize/scroll events and position against the visible viewport; the on-screen keyboard can shrink the visual viewport without changing the layout viewport. [MDN VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)
- Do not rely solely on `100vh`.
- Test installed standalone mode separately from Safari because WebKit has documented PWA safe-area inconsistencies. [WebKit safe-area PWA bug](https://bugs.webkit.org/show_bug.cgi?id=236445)

## Objective interaction checks

A build passes only if all are true:

- Plain Tab traverses every control in logical DOM order.
- Shift+Tab outside the composer moves focus backward and never changes mode.
- Composer-scoped Shift+Tab produces exactly one request per physical press.
- IME composition and held-key repeat produce no mode request.
- Every touch target is at least 44×44 CSS px.
- Dragging away before release does not activate a mode.
- Long-press and horizontal swipe never change mode.
- Entering Plan is not visually confirmed before the matching host acknowledgment.
- Offline, timeout, duplicate-ticket, and stale-revision cases never expose Build as confirmed.
- Swipe-down, Escape, backdrop tap, and browser back cannot approve execution.
- Execute binds to the displayed plan revision and fails closed if either revision changes.
- VoiceOver announces each completed transition once without moving focus.
- Focus remains visible and unobscured with the software keyboard open.
- Light and dark mode retain textual/icon state distinctions without relying on clay alone.
- Reduced Motion removes positional transitions.
- Draft text, selection, and scroll position survive all successful and failed transitions.

# 3. Divergent / minority ideas worth considering

## Make Plan the composer’s default, and treat Build as temporary elevation

Instead of a symmetric Build/Plan toggle, default every resumed mobile session to Plan. `Execute` grants Build capability only for the approved plan or next turn, then automatically returns to Plan. This matches the product’s fixed read-only posture more closely than a persistent Build mode and sharply limits forgotten escalation.

The cost is behavioral divergence from desktop sessions and more frequent authorization.

## Replace “Build” with a bounded capability label

`Build` is friendly but vague. A more legible pair is:

- `Read-only`
- `Can modify`

The brand-level labels can remain Plan/Build, with the capability shown persistently underneath. This is less elegant but harder to misread during remote supervision.

## Use a press-and-slide mode chooser

Touching the mode pill could open two enlarged targets directly under the finger; sliding onto Plan or Build and releasing selects. It would feel fast and tactile, but should remain an accelerator over ordinary tap-menu selection because custom gestures must never be required. It also needs careful pointer-cancellation testing.

## Treat Shift+Tab as opt-in parity, not default behavior

The strongest accessibility position is to reserve both Tab combinations for focus navigation and ship only `Command+Shift+P`. The mode menu could offer `Enable Claude/Kimi-style ⇧Tab in the composer`. This sacrifices instant terminal parity but avoids silently breaking iPhone Full Keyboard Access.

## Add an explicit on-screen `⇧Tab` keycap

A 44px keycap beside the mode pill could provide perfect visual parity and work without a hardware keyboard. This is highly discoverable but duplicates the mode control, consumes scarce composer width, and may imply that it inserts a tab character. If tested, label it `Plan` with a secondary `⇧Tab` legend rather than using `Tab` as the primary label.

## Separate “approved plan” from “Build mode” entirely

Execution could use a capability token limited to the reviewed plan while the session continues to display `Plan`. This is safer than broad Build elevation and makes “execute the plan” conceptually precise, but it requires host support for per-operation capabilities rather than today’s session-level mode.

# 4. Open questions + risks

- Does the host guarantee that entering Plan while a turn is running blocks every subsequent write, including already-dispatched tools? If not, mode changes must be idle-only.
- Can the existing `set_mode` response return the authoritative mode and revision, or does the client need a subsequent state fetch?
- Can plan execution be made atomic with the mode transition? A two-request implementation leaves an unsafe Build-mode gap.
- What exactly invalidates a plan revision: any new user message, only planning feedback, branch changes, host reconnect, or repository changes?
- Is Build a durable session mode or a one-turn capability? The latter better matches read-only-by-default security.
- Should direct Plan exit discard a stored plan, preserve it as reference, or require a separate discard action? Kimi and current Pi extensions distinguish these outcomes.
- How should a mode change behave when the same session is open on desktop and iPhone? The phone must display the host winner, not last-write-wins local state.
- There is no reliable standardized web API for deciding that a hardware keyboard is attached. Shortcut hints should therefore be harmless when always visible or revealed after actual keyboard input, rather than gating behavior on guessed hardware state.
- Composer-scoped `Shift+Tab` still conflicts with reverse focus for Full Keyboard Access users. This needs real-device testing with VoiceOver and Full Keyboard Access, plus a readily reachable disable setting.
- WebKit keyboard and safe-area behavior varies between Safari and installed standalone PWAs. Test both, including portrait, landscape, Dynamic Island devices, and reopening after background suspension.
- Clay-on-bone is below 3:1, so future styling changes could accidentally turn the decorative accent into the sole state cue.
- “Plan · Read-only” must describe actual host enforcement, including extension/custom tools and shell escape routes—not merely the visible tool list.
- The Mobbin screen catalog could not be inspected at screen level in this pass. A later authenticated Mobbin pass should verify exact Claude iOS and comparable AI-chat composer placements before pixel-level visual matching.

# 5. Sources

- [Apple Human Interface Guidelines — Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [Apple Human Interface Guidelines — Feedback](https://developer.apple.com/design/human-interface-guidelines/feedback)
- [Apple Human Interface Guidelines — Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures)
- [Apple Human Interface Guidelines — Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards)
- [Apple Human Interface Guidelines — Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Apple — Control iPhone with an external keyboard](https://support.apple.com/en-ie/guide/iphone/ipha4375873f/26/ios/26)
- [Apple `UIKeyCommand`](https://developer.apple.com/documentation/uikit/uikeycommand)
- [Apple `UITextField`](https://developer.apple.com/documentation/uikit/uitextfield)
- [WebKit — Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [WebKit bug 236445 — PWA safe-area behavior](https://bugs.webkit.org/show_bug.cgi?id=236445)
- [WAI-ARIA Authoring Practices — Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
- [WCAG 2.2 — Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- [WCAG 2.2 — Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)
- [WCAG 2.2 — On Focus](https://www.w3.org/WAI/WCAG22/Understanding/on-focus.html)
- [WCAG 2.2 — Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG 2.2 — Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
- [MDN — ARIA status role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role)
- [MDN — ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions)
- [MDN — VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)
- [W3C — Vibration API implementation report](https://w3c.github.io/vibration/reports/implementation.html)
- [React Aria — ToggleButton](https://react-aria.adobe.com/ToggleButton)
- [React Aria — Menu](https://react-aria.adobe.com/Menu)
- [React Aria — Popover](https://react-aria.adobe.com/Popover)
- [Claude Code — Permission modes and plan handoff](https://code.claude.com/docs/en/permission-modes)
- [Claude Code — Remote Control](https://code.claude.com/docs/en/remote-control)
- [Kimi Code — Interaction and plan mode](https://moonshotai.github.io/kimi-cli/en/guides/interaction.html)
- [Pi — Plan-mode extension example](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/plan-mode/index.ts)
- [Pi — RPC extension UI protocol](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md)
- [pi-plan-mode](https://github.com/narumiruna/pi-extensions/tree/main/extensions/pi-plan-mode)
- [Happy coding-agent remote client](https://github.com/slopus/happy)
- [CC Pocket](https://github.com/K9i-0/ccpocket)
- [Harness Remote](https://github.com/giuliastro/harness-remote)
- [OpenCodex](https://github.com/mjmkk/opencodex)
- [Mobbin iOS app catalog](https://mobbin.com/discover/apps/ios)
- [Mobbin MCP introduction](https://docs.mobbin.com/mcp/introduction)
