<!-- provenance: external-CLI orchestration pass; original file iter-05-sol.md -->
> **Source pass 5** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-5-sol.md`.

<!-- F4-plan-mode-tab | model=sol | lens=react-implementation | iter 5/10 | 2026-08-15T19:45:12.519Z -->

# 1. Findings for the react-implementation lens

## The interaction should be a persistent composer control, not another hidden setting

The repository already has the correct authority model: `useRuntime` retains the last host-confirmed state, sends `expectedRevision`, and does not optimistically commit mode changes. The implementation gap is presentation: `SessionComposer.tsx` buries the only rendered Build/Plan selector in the `+` popover, while the separate `RuntimeStrip` is not mounted by `App.tsx`.

Both target products put mode near the prompt:

- Claude Code mobile exposes a mode dropdown beside the prompt box. Its Plan state is explicitly read-only, and approval exits Plan into a chosen execution-permission mode. [Claude Code permission modes](https://code.claude.com/docs/en/permission-modes)
- Kimi Code’s web UI puts a Plan toggle in the input toolbar, adds a dashed blue composer border while active, persists the state across restarts, and emits a corrected status update when tools change the mode. [Kimi CLI changelog](https://github.com/MoonshotAI/kimi-cli/blob/main/CHANGELOG.md)
- Kimi’s terminal surface additionally changes the prompt glyph and displays a blue `plan` status-bar badge. [Kimi interaction guide](https://github.com/MoonshotAI/kimi-cli/blob/main/docs/en/guides/interaction.md)

For Pi Remote, extract a single controlled `PlanModeControl` and render it persistently in the composer toolbar, between `+` and the right-hand actions. Keep the copy inside the popover as a secondary route, but have both instances consume the same derived state rather than duplicating mode logic.

## Use Shift+Tab, not bare Tab

Claude Code and Kimi Code independently standardize on `Shift+Tab` for Plan mode. Claude cycles permission modes with it; Kimi directly toggles Plan mode. [Claude Code cheatsheet](https://support.claude.com/en/articles/14553413-claude-code-cheatsheet), [Kimi interaction guide](https://github.com/MoonshotAI/kimi-cli/blob/main/docs/en/guides/interaction.md)

Bare Tab should remain sequential focus navigation:

- Apple says custom shortcuts should not repurpose standard keyboard behavior and recommends Command as the primary modifier for unrelated custom commands. [Apple HIG: Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards)
- WCAG requires all functionality to remain keyboard operable. Consuming bare Tab inside the principal input risks making adjacent controls unreachable. [WCAG 2.2: Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
- WebKit explicitly supports hardware-keyboard focus navigation. [WebKit: Safari 13 keyboard support](https://webkit.org/blog/9674/new-webkit-features-in-safari-13/)

Implement `Shift+Tab` only while the message textarea has focus. Do not install an application-wide bare-Tab listener. A visible touch control remains mandatory because the standard iPhone software keyboard does not provide this hardware shortcut.

The handler must use `KeyboardEvent.key === "Tab"`, reject repeat and composition events, and call `preventDefault()` only after every eligibility check passes. `KeyboardEvent.key` is layout-aware; held keys generate repeated `keydown` events with `repeat=true`. [MDN: KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key), [MDN: KeyboardEvent.repeat](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)

```tsx
const onPromptKeyDown = useCallback(
  (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const toggle =
      event.key === 'Tab' &&
      event.shiftKey &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.repeat &&
      !event.nativeEvent.isComposing &&
      !event.defaultPrevented &&
      canChangeMode;

    if (!toggle) return;

    event.preventDefault();
    void setMode(mode === 'plan' ? 'build' : 'plan');
  },
  [canChangeMode, mode, setMode],
);
```

No hotkey library is warranted for one scoped shortcut. A local React handler also avoids global-listener cleanup and stale-closure problems. If the shortcut later becomes application-wide, React 19’s `useEffectEvent` can let one effect-installed listener read current state without being reinstalled on every render. [React: useEffectEvent](https://react.dev/reference/react/useEffectEvent)

## React Aria already supplies the correct selection primitive

Retain `ToggleButtonGroup` with:

- `selectionMode="single"`
- `disallowEmptySelection`
- controlled `selectedKeys`
- stable IDs `build` and `plan`
- group label `aria-label="Agent mode"`

React Aria maps each button ID into `selectedKeys`, supplies keyboard interaction, and exposes `data-selected`, `data-pressed`, `data-focus-visible`, and `data-disabled` for styling. [React Aria: ToggleButtonGroup](https://react-aria.adobe.com/ToggleButtonGroup), [React Aria: ToggleButton](https://react-aria.adobe.com/ToggleButton)

Use React Aria `Button` and `onPress` for Plan-review actions rather than raw click handlers; `onPress` normalizes mouse, touch, and keyboard activation. [React Aria: Button](https://react-aria.adobe.com/Button)

Do not add manual `role="radio"`, `aria-checked`, roving-tabindex code, or click-to-keyboard emulation on top of React Aria.

## Preserve host-confirmed state during pending and failure

The selected segment must never move when the request starts. The current confirmed segment stays selected while the requested segment contains a small spinner and the whole group becomes unavailable.

This prevents a dangerous visual lie: a locally selected Build state could imply that Plan’s read-only enforcement has ended before Pi confirms it. Happy’s plan-mode incident demonstrates the same class of failure: stale permission state caused exit-plan approval UI to be skipped, so Happy changed `ExitPlanMode` to always pass through an explicit permission request. [Happy plan-mode fix](https://github.com/slopus/happy/blob/main/docs/plans/agent-sdk-upgrade-plan-mode-fix.md), [Happy permission handler](https://github.com/slopus/happy/blob/main/packages/happy-cli/src/claude/utils/permissionHandler.ts)

A single, permanently mounted `role="status"` should announce settled transitions. A status live region is implicitly polite and atomic, and should not receive focus when it updates. [MDN: `status` role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role)

Use full messages rather than fragments:

- `Plan mode on. Pi is read-only.`
- `Build mode on.`
- `Mode changed on the host. Plan mode is on.`
- `Switch failed. Plan mode remains on.`
- `Mode is uncertain. Reconcile before changing it.`

## Treat `executing-plan` as distinct from `plan`

The current UI computes `planActive` as `plan || executing-plan`, which visually presents execution as read-only Plan. That is semantically incorrect: the extension restores write-capable tools before publishing `executing-plan`.

Render three distinct statuses:

- `build`: ordinary write-capable workflow, still subject to ticketed approval.
- `plan`: read-only exploration.
- `executing-plan`: execution of an explicitly approved proposal.

`executing-plan` is status/provenance, not a third manually selectable segment. Show `Executing approved plan` in the persistent badge, disable direct mode changes while the turn is running, and leave Stop available. After stopping or completing, require a host-confirmed transition to Build or Plan.

Kimi similarly separates plan submission from execution: `ExitPlanMode` displays the complete plan and requires approval; the user can approve, revise, reject, or reject-and-exit. [Kimi interaction guide](https://github.com/MoonshotAI/kimi-cli/blob/main/docs/en/guides/interaction.md)

## iOS PWA layout must avoid dependence on JavaScript viewport measurements

Keep the mode control inside the existing sticky composer rather than in a separately fixed overlay. Use `env(safe-area-inset-bottom)` and `viewport-fit=cover` for the Home indicator. [WebKit: Designing for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)

The Visual Viewport API accounts for the software keyboard, but WebKit has documented installed-PWA cases where its height becomes stale after keyboard use and rotation. [WebKit: Visual Viewport API](https://webkit.org/blog/9674/new-webkit-features-in-safari-13/), [WebKit bug 218983](https://bugs.webkit.org/show_bug.cgi?id=218983) A later report also documents extra bottom scroll space equal to the safe-area inset while the keyboard is open. [WebKit bug 292603](https://bugs.webkit.org/show_bug.cgi?id=292603)

Consequences:

- Do not position the mode control from `visualViewport.height`.
- Do not close or blur the textarea on a keyboard shortcut; the keyboard and caret should remain stable.
- Keep the plan review card in transcript flow rather than opening it automatically as a keyboard-obscured bottom sheet.
- Test rotation, suspend/resume, and software-to-hardware keyboard changes on a physical installed PWA.

Tailwind 4’s stated minimum Safari version is 16.4. Supporting older iPhones requires an explicit fallback pass rather than assuming all v4 utilities work. [Tailwind browser compatibility](https://tailwindcss.com/docs/compatibility)

## Mobbin evidence boundary

No screen-level Claude or Kimi record could be independently verified through Mobbin’s public catalog surface; its programmatic screen search requires an authenticated paid MCP/API flow. [Mobbin MCP documentation](https://docs.mobbin.com/), [Mobbin iOS catalog](https://mobbin.com/discover/apps/ios) Therefore, this report uses first-party Claude and Kimi documentation for mode behavior and does not treat unidentified screenshots as product evidence.

# 2. Concrete spec contribution for the build phase

## Component structure

### `PlanModeControl`

Render persistently in `SessionComposer`:

```text
[ + ]  [ Build | Plan  ⇧Tab ]                [ Send ]
```

Requirements:

- `ToggleButtonGroup`, single selection, no empty selection.
- Minimum 44×44 CSS-pixel hit area per segment; Apple recommends 44×44 points for iOS touch controls. [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- Visible labels remain exactly `Build` and `Plan`.
- Visual `⇧Tab` keycap sits inside the Plan segment or immediately after the group.
- `aria-keyshortcuts="Shift+Tab"` on the group. This attribute only advertises the shortcut; JavaScript must still implement it. [MDN: aria-keyshortcuts](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-keyshortcuts)
- Hidden description: `Plan mode is read-only. Press Shift plus Tab while the message field is focused to switch modes.`
- At widths below 360px, hide only the visual keycap; preserve `aria-keyshortcuts` and both mode labels.
- The `+` popover may repeat the selector, but it must reuse the same component and state model.

### `usePlanModeShortcut`

Inputs:

```ts
{
  mode: 'build' | 'plan' | 'executing-plan' | 'unknown';
  runtimeStatus: RuntimeStatus;
  isTurnRunning: boolean;
  setMode: (mode: 'build' | 'plan') => Promise<void>;
}
```

Eligibility:

- Message textarea focused.
- Exact `Shift+Tab`.
- No other modifier.
- Not composing.
- Not repeating.
- Runtime status is `ready`.
- Host mode is `build` or `plan`.
- No mode mutation is pending.
- Current turn is not running.

Bare Tab, modified Tab variants, and Shift+Tab anywhere outside the textarea retain browser behavior.

### `PlanModeStatus`

A permanently mounted status region below or beside the composer disclaimer:

```tsx
<span role="status" className="sr-only">
  {announcement}
</span>
```

Do not remount it per message. Do not move focus after a successful mode change. Apple recommends passive status feedback close to the object it describes, reserving interruptions for consequential warnings. [Apple HIG: Feedback](https://developer.apple.com/design/human-interface-guidelines/feedback)

### `PlanProposalCard`

A structured transcript item produced only by a host event—not by parsing assistant prose.

Content:

- Heading: `Plan ready`
- Full redacted proposal rendered inline.
- Optional 1–3 labeled approaches.
- Secondary action: `Keep planning`
- Primary action: `Review & execute`

`Keep planning` focuses the composer and changes its placeholder to `Tell Pi what to revise`. It does not exit Plan mode.

### `ExecutePlanDialog`

Open only after `Review & execute`.

Use React Aria `DialogTrigger`, `ModalOverlay`, `Modal`, `Dialog`, and `RadioGroup` when multiple approaches exist. It must contain:

- Title: `Execute this plan?`
- The immutable proposal revision being approved.
- Selected approach.
- Explanation: `Pi will leave read-only Plan mode and may modify the workspace under the existing approval policy.`
- `Cancel`
- `Execute plan`

On close, focus returns to `Review & execute`.

## Exact state model

| Host/runtime state | Selected UI | Composer treatment | Allowed action |
|---|---|---|---|
| `checking` / `unknown` | None; disabled | Neutral border; `Checking mode…` | None |
| Ready `build` | Build | Neutral carbon border | Enter Plan |
| Pending `set_mode: plan` | Build remains selected | Plan spinner; group `aria-busy=true` | None |
| Ready `plan` | Plan | Clay inset ring; lock icon; `Plan · read-only` | Return to Build or continue planning |
| Pending `set_mode: build` | Plan remains selected | Build spinner; group busy | None |
| `executing-plan` | No false Plan selection | Badge `Executing approved plan` | Stop current turn |
| `stale` | Returned host state | `Mode changed on host` | Explicit refresh/retry |
| `delivery-unknown` | Last confirmed state, marked uncertain | Warning surface | Reconcile only; never retry automatically |
| Offline | Last confirmed state plus `Offline` | Controls disabled | Reconnect |

Set `aria-busy="true"` only during the mutation and return it to false after the complete settled update. [MDN: aria-busy](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy)

## Plan-to-execute protocol requirement

The current `set_mode` operation cannot represent approval of a specific plan. Add a separate typed mutation, conceptually:

```ts
{
  type: 'execute_plan';
  planId: string;
  planRevision: number;
  selectedApproachId: string | null;
}
```

The relay request must also carry:

- session ID;
- expected runtime revision;
- one-use ticket/control ID;
- the proposal revision shown in the dialog.

Settlement rules:

- `accepted`: host publishes `executing-plan`; then and only then change the persistent status.
- `stale`: replace the displayed proposal/mode with the host response and require another review.
- `unavailable`: remain in Plan.
- `delivery-unknown`: disable execution, reconcile state, and never auto-repeat.

Kimi’s Wire protocol uses a structured `PlanDisplay` event for inline plan content, and Happy’s fix relies on a concrete tool-use ID for the plan-exit approval. Both support binding approval to a specific proposal rather than interpreting free-form text. [Kimi changelog](https://github.com/MoonshotAI/kimi-cli/blob/main/CHANGELOG.md), [Happy plan-mode fix](https://github.com/slopus/happy/blob/main/docs/plans/agent-sdk-upgrade-plan-mode-fix.md)

## Visual specification

### Build

- Composer border: existing `--line-strong`.
- Build segment: carbon ink on `--surface-muted`.
- No mode animation after initial render.

### Plan

- Retain the one-pixel border to prevent layout shift.
- Add an inset one-pixel ring using `--accent`.
- Selected segment: `--accent-soft` background and `--accent-ink` text.
- Lock glyph plus persistent `Plan · read-only` copy outside the segmented label.
- Do not use raw clay `#d97757` for small text on bone: its computed contrast is about 2.94:1. Use the existing light-theme `--accent-ink` instead; it computes to about 6.64:1. WCAG AA requires 4.5:1 for normal-size text. [WCAG contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- Dark mode should use the existing `--accent-ink`/`--accent-soft` pair, not a light-theme hardcoded value.

### Motion

- 120–180ms color and inset-ring transition.
- No bounce, scale, or composer movement on mode change.
- Pending spinner may rotate.
- Apply `motion-reduce:transition-none` and suppress spinner rotation under reduced motion. Tailwind exposes `motion-reduce`, focus-visible, ARIA, and React-Aria-compatible data-attribute variants. [Tailwind state variants](https://tailwindcss.com/docs/hover-focus-and-other-states)

Example Tailwind 4 state mapping:

```tsx
className={[
  'min-h-11 px-3 text-sm font-semibold',
  'data-selected:bg-[var(--accent-soft)]',
  'data-selected:text-[var(--accent-ink)]',
  'data-focus-visible:outline-3',
  'data-focus-visible:outline-[var(--focus)]',
  'data-disabled:opacity-50',
  'motion-reduce:transition-none',
].join(' ')}
```

## Accessibility acceptance checks

- Touch: every segment and action is at least 44×44.
- Keyboard: bare Tab moves focus normally; Shift+Tab toggles only from the textarea.
- VoiceOver: mode control announces label, selected state, and shortcut; settled transitions are announced once.
- Visual: state is conveyed by label, selection, icon, border, and live text—not color alone.
- Focus: a three-pixel visible focus ring remains distinguishable in light and dark themes. [WCAG focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- Zoom/reflow: at 200% and 320px width, Build and Plan remain visible; only the keycap may disappear.
- Offline/cached state: no cached plan card can enable Execute until the live host confirms the same plan and runtime revisions.

## Automated and device verification

Unit/component tests:

1. Build and Plan map only from host-confirmed state.
2. `executing-plan` is not rendered as read-only Plan.
3. Shift+Tab from the textarea calls `setMode` exactly once.
4. Bare Tab, repeat, composition, extra modifiers, pending, unknown, offline, and running-turn cases do not call it.
5. Pending retains the prior selection.
6. Stale adopts returned host state without retry.
7. Delivery-unknown disables the control and exposes Reconcile.
8. `aria-keyshortcuts`, group label, descriptions, busy state, and live-region text are present.
9. Execute sends the displayed `planId`, plan revision, selected approach, and runtime revision.
10. A changed proposal invalidates the prior dialog and ticket.

Physical installed-PWA matrix:

- Light and dark modes.
- iPhone widths 320, 390, and 430px.
- Software keyboard open/closed.
- Bluetooth/Magic Keyboard attached and detached.
- Portrait-to-landscape rotation with keyboard open.
- Background/resume and relay reconnect.
- VoiceOver with and without Full Keyboard Access.
- Slow, stale, rejected, and delivery-unknown mode responses.

Playwright WebKit is useful for DOM regression but is not a substitute for installed iPhone PWA testing because the documented viewport and keyboard defects are specific to iOS standalone behavior.

# 3. Divergent / minority ideas worth considering

## Opt-in CLI keymap with bare Tab

A user setting could make bare Tab toggle Plan only while the textarea is focused, matching terminal muscle memory more aggressively. It should default off, display a persistent warning that Tab no longer moves to adjacent controls from the editor, and provide Escape-then-Tab as an exit path. This is unsuitable as the default because it conflicts with web focus navigation.

## One-prompt Plan

Claude supports prefixing a single prompt with `/plan`. Pi Remote could expose `Plan once`, automatically returning to the previously confirmed mode after the plan response settles. [Claude permission modes](https://code.claude.com/docs/en/permission-modes) This reduces mode leakage across sessions but creates another lifecycle requiring host authority.

## Execution lease

Instead of transitioning permanently to Build, approving a proposal could grant a one-plan execution lease tied to its revision. When the approved execution finishes or is stopped, Pi automatically returns to Plan. This is stricter than conventional Claude/Kimi behavior and fits Pi Remote’s ticketed, fail-closed posture.

## Whole-composer dashed border

Kimi uses a dashed blue composer border while Plan is active. Pi Remote could translate that into a dashed clay inset ring. [Kimi changelog](https://github.com/MoonshotAI/kimi-cli/blob/main/CHANGELOG.md) It is highly legible but visually louder than Claude’s calmer mobile treatment; test it as an alternate theme rather than adopting it automatically.

## Swipe between Build and Plan

A horizontal swipe on the segmented control could switch modes without opening anything. This should remain experimental: accidental exits from read-only mode are more consequential than the small speed gain, and swipe-only interactions are less discoverable than the visible buttons.

# 4. Open questions + risks

1. **Shortcut contract:** Does “Tab affordance” explicitly require bare Tab, or can the product adopt the Claude/Kimi-standard Shift+Tab? The latter should be the default.
2. **Proposal transport:** The relay currently lacks a structured plan proposal DTO and `execute_plan` operation. Free-form transcript parsing is not acceptable for approval binding.
3. **`executing-plan` termination:** Which host event returns it to Build or Plan after completion, interruption, failure, or reconnect? The UI cannot infer this from turn status.
4. **Running-turn switching:** Should users be able to enter Plan while Pi is already executing? The safest rule is Stop first, then switch.
5. **Remote competition:** If desktop Pi changes mode while the PWA dialog is open, the proposal ticket and dialog must be invalidated immediately.
6. **Session isolation:** Shortcut state, pending operations, announcements, and proposal dialogs must be keyed by session. A late response from session A must not alter session B.
7. **Installed-PWA floor:** Tailwind 4 targets Safari 16.4+. The supported iOS version needs to be explicit.
8. **Popover duplication:** Keeping both the persistent selector and `+`-popover selector is useful, but only if both render the same shared controlled component.
9. **Cached plans:** Service-worker or transcript caches may display old proposal content; all execution actions must remain disabled until live reconciliation.
10. **Mobbin traceability:** Screen-level Mobbin URLs should be added in a later authenticated design-reference pass. Until then, first-party Claude/Kimi behavior is the evidentiary baseline.

# 5. Sources

- [Claude Code — Choose a permission mode](https://code.claude.com/docs/en/permission-modes)
- [Claude Code — How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)
- [Claude Code cheatsheet](https://support.claude.com/en/articles/14553413-claude-code-cheatsheet)
- [Claude Code VS Code integration](https://code.claude.com/docs/en/ide-integrations)
- [Kimi CLI — Interaction and input](https://github.com/MoonshotAI/kimi-cli/blob/main/docs/en/guides/interaction.md)
- [Kimi CLI changelog](https://github.com/MoonshotAI/kimi-cli/blob/main/CHANGELOG.md)
- [Kimi Code plan-mode tools](https://github.com/MoonshotAI/kimi-code/blob/main/docs/en/reference/tools.md)
- [Happy mobile/web remote-agent client](https://github.com/slopus/happy)
- [Happy plan-mode fix](https://github.com/slopus/happy/blob/main/docs/plans/agent-sdk-upgrade-plan-mode-fix.md)
- [Happy permission handler](https://github.com/slopus/happy/blob/main/packages/happy-cli/src/claude/utils/permissionHandler.ts)
- [OpenCode Mobile PWA](https://github.com/newlandjia/opencode-mobile)
- [Harness Remote mobile PWA](https://github.com/giuliastro/harness-remote)
- [Remote Agent multi-provider PWA](https://github.com/d-kimuson/remote-agent)
- [React Aria — ToggleButtonGroup](https://react-aria.adobe.com/ToggleButtonGroup)
- [React Aria — ToggleButton](https://react-aria.adobe.com/ToggleButton)
- [React Aria — Button](https://react-aria.adobe.com/Button)
- [React 19 — useEffectEvent](https://react.dev/reference/react/useEffectEvent)
- [Tailwind CSS — State and data-attribute variants](https://tailwindcss.com/docs/hover-focus-and-other-states)
- [Tailwind CSS — Browser compatibility](https://tailwindcss.com/docs/compatibility)
- [Apple HIG — Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards)
- [Apple HIG — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Apple HIG — Feedback](https://developer.apple.com/design/human-interface-guidelines/feedback)
- [WebKit — Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [WebKit — Safari 13 hardware keyboard and Visual Viewport](https://webkit.org/blog/9674/new-webkit-features-in-safari-13/)
- [WebKit bug 218983 — standalone PWA Visual Viewport height](https://bugs.webkit.org/show_bug.cgi?id=218983)
- [WebKit bug 292603 — keyboard and safe-area bottom offset](https://bugs.webkit.org/show_bug.cgi?id=292603)
- [MDN — KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
- [MDN — KeyboardEvent.repeat](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)
- [MDN — aria-keyshortcuts](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-keyshortcuts)
- [MDN — status role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role)
- [MDN — aria-busy](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy)
- [WCAG 2.2 — Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
- [WCAG 2.2 — Contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [WCAG 2.2 — Focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- [Mobbin MCP/API documentation](https://docs.mobbin.com/)
- [Mobbin iOS app catalog](https://mobbin.com/discover/apps/ios)
