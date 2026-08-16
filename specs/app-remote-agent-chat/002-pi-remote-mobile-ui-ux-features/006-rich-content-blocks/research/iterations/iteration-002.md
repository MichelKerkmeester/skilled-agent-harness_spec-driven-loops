<!-- provenance: external-CLI orchestration pass; original file iter-02-sol.md -->
> **Source pass 2** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-2-sol.md`.

<!-- F7-rich-content-blocks | model=sol | lens=interaction-gesture | iter 2/10 | 2026-08-16T04:14:02.920Z -->

# 1. Findings for the interaction-and-gesture lens

## Native-feeling means explicit controls first, gestures second

Pi Remote should expose visible `Open` and `Copy` buttons on every rich block. Gestures may accelerate those actions, but must never be the only way to perform them. Apple recommends familiar, simple gestures and an onscreen alternative for gesture-driven actions; it also identifies tap as activation, touch-and-hold as revealing contextual functionality, and swipe as scrolling, revealing actions, or dismissing views. [Apple HIG: Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures/) and [Apple HIG: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility).

This rules out swipe-to-copy, double-tap-to-open, or long-press-only menus as primary interactions. Those gestures collide with:

- horizontal panning in code;
- vertical transcript scrolling;
- iOS edge-back navigation;
- native text selection and its Copy menu;
- VoiceOver’s remapped touch gestures.

Apple also requires an obvious modal-dismissal control even where swipe-down dismissal exists. [Apple HIG: Modality](https://developer.apple.com/design/human-interface-guidelines/modality).

## The full-screen viewer is the correct second interaction level

Long code, command output, and substantial text are focused reading tasks. Apple describes full-screen modality as appropriate when concentration or in-depth content benefits from removing distractions. [Apple HIG: Modality](https://developer.apple.com/design/human-interface-guidelines/modality). Mobbin likewise classifies its Apple Health article-detail reference as an `Article Detail` with `Full-Screen Overlay` and `Toolbar`, supporting a transcript-card-to-reading-surface hierarchy rather than uncontrolled inline expansion. [Mobbin: Apple Health iOS Article Detail](https://mobbin.collaboo.co/explore/screens/e72408d7-3f84-492c-960d-a855165e2e3c).

Claude’s documented artifact model also treats significant, self-contained content—typically more than 15 lines—as content suited to a dedicated window separate from the conversation. [Claude Help: What are artifacts?](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them). A current real-device Claude iOS capture set includes both an `Artifacts Screen` and modal interaction screens, although it does not expose enough public interaction metadata to prove exact gesture behavior. [Claude iOS real-device screen index](https://techdevnotes.com/apps/ios/claude/6473753684/screenshots).

Therefore:

- The transcript stays compact and scannable.
- Every rich block offers a bounded preview.
- Full content opens in the existing F6 viewer shell.
- Closing the viewer restores the exact transcript position and invoking control.

## Long press should preserve native selection

Do not attach a custom long-press recognizer to command, output, code, or artifact content. React Aria documents that `useLongPress` suppresses touch text selection and browser/OS context menus; it also requires a separate keyboard-accessible alternative. [React Aria: useLongPress](https://react-aria.adobe.com/useLongPress).

For a read-only developer tool, native selection is valuable functionality. Long-pressing content should therefore produce the iOS loupe/selection handles and native edit menu. Custom long press is defensible only on a non-text header or action button and only as a redundant shortcut.

## Copy must be immediate, exact, and visibly recoverable

Clipboard writing is restricted to secure contexts, and browsers may require transient user activation. [MDN: Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API). The copy operation must consequently execute directly inside the button’s press handler, using the already-rendered, already-redacted in-memory string. It must not wait for a fetch, import, host read, or other asynchronous prerequisite.

React Aria’s button and press primitives normalize touch, mouse, keyboard, and screen-reader activation; `usePress` also cancels a press when scrolling begins, which prevents an intended transcript scroll from becoming an accidental copy or open action. [React Aria: Button](https://react-aria.adobe.com/Button) and [React Aria: usePress](https://react-aria.adobe.com/usePress).

Prior art confirms that these details matter in mobile coding-agent clients. Happy has shipped a code-block copy button, fixes for mobile content overflow, suppression of unintended web overscroll/pull-to-refresh, and a chat scroll-to-bottom affordance. [Happy releases](https://github.com/slopus/happy/releases). Its existence alongside Happier, OpenCode iOS, MobileCLI, and other remote-agent clients also establishes that monitoring tool calls and code from a phone is a real, active interaction category rather than a scaled-down desktop terminal. [Happy](https://github.com/slopus/happy), [Happier](https://github.com/happier-dev/happier), [OpenCode iOS](https://github.com/grapeot/opencode_ios_client), and [MobileCLI](https://github.com/MobileCLI/mobilecli).

## Full-screen focus behavior must be modal, not merely visual

A modal dialog must:

- make the underlying transcript inert;
- move focus inside on opening;
- contain `Tab` and `Shift+Tab`;
- close on `Escape`;
- restore focus to the invoking control.

For large structured content, WAI recommends initially focusing a static title at the beginning rather than a later action that might scroll the content’s start out of view. It also recommends omitting `aria-describedby` when the dialog contains multiple paragraphs or semantic structures that should be navigated individually. [WAI-ARIA APG: Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

React Aria’s `Modal`, `DialogTrigger`, and `Dialog` already supply the correct foundation and expose visual-viewport dimensions for positioning above a software keyboard. [React Aria: Modal](https://react-aria.adobe.com/Modal).

## Mobile code needs two-axis navigation without hijacking system gestures

Code and command output may legitimately need horizontal scrolling. WCAG’s reflow criterion permits two-dimensional scrolling for content whose meaning depends on a two-dimensional layout, while requiring the rest of the interface to reflow. [WCAG 2.2, SC 1.4.10](https://www.w3.org/TR/WCAG22/#reflow).

Accordingly:

- Card chrome, labels, and actions must never cause page-level horizontal scrolling.
- Only the code/output viewport may pan horizontally.
- Horizontal pans beginning inside code must not open, dismiss, or navigate between blocks.
- The app must not capture the iPhone’s left-edge back gesture.
- Pinch zoom must remain enabled.

## Safe areas and visual viewport are functional requirements

With `viewport-fit=cover`, WebKit provides `safe-area-inset-*` variables specifically to keep controls clear of rounded corners, sensor housings, and the Home indicator. [WebKit: Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/). The visual viewport can also shrink independently of the layout viewport because of browser UI, zoom, or the software keyboard. [MDN: VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport).

The viewer shell must therefore size against React Aria’s `--visual-viewport-height`, not a bare `100vh`, and all toolbars must combine normal spacing with `env(safe-area-inset-*)`.

## Native polish comes from restrained feedback

Apple requires a visible pressed state for custom buttons and recommends brief, purposeful motion rather than decorative motion on frequent actions. [Apple HIG: Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons) and [Apple HIG: Motion](https://developer.apple.com/design/human-interface-guidelines/motion).

For Pi Remote, the native-feeling treatment is:

- immediate tint or opacity change on contact;
- no Material-style ripple;
- no bouncing Copy button;
- no per-line animation while output streams;
- a short spatial transition into the viewer;
- a crossfade or instant state change under `prefers-reduced-motion`.

The CSS media feature directly reflects the user’s iOS Reduce Motion preference. [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion).

## Evidence boundary around the named benchmarks

The available Claude evidence establishes a dedicated artifact surface and current iOS modal patterns, but not every hidden gesture. Kimi’s official material confirms a mobile app and a separate Kimi Code product, but does not publish its code-card gesture contract. [Kimi overview](https://www.kimi.com/help/getting-started/overview). Exact Claude/Kimi parity should therefore be validated with current device recordings rather than inferred from static screenshots.

# 2. Concrete spec contribution for the build phase

## 2.1 Block classification and inline presentation

| Block | Inline preview | Primary controls | Full-screen title |
|---|---|---|---|
| Bash command/result | Command: 2 visual lines. Output: last 6 lines or 144 px. Show `Last 6 of N lines` when truncated. | `Open`, `Copy command`; `Copy output` when output exists | `Bash command` |
| Fenced code | First 12 lines or 240 px; show language and `12 of N lines` | `Open`, `Copy code` | Filename if known, otherwise `{Language} code` |
| Long text/prompt artifact | First 8 lines or 192 px | `Open`, `Copy text` | Upstream label, otherwise `Prompt` or `Text artifact` |
| Unsupported tool | Existing quiet Activity disclosure | Existing behavior | None |

Classify text as an artifact when it is explicitly typed as a goal/prompt or when it is self-contained and exceeds 15 lines. As a deterministic fallback, also classify at more than 1,200 Unicode code points. The 15-line boundary follows Claude’s documented artifact heuristic; the character boundary is a Pi Remote implementation decision for paragraph-heavy text. [Claude Help: artifacts](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them).

Render only the preview substring in the inline accessibility tree. Do not place the entire visually clipped payload in the DOM, because a screen reader would otherwise encounter content that sighted users cannot see.

## 2.2 Command lifecycle states

| State | Presentation | Announcement | Transition |
|---|---|---|---|
| `running` | `Running` label; capped tail preview; `aria-busy="true"` | Announce once: `Bash command started` | Tool call without terminal result |
| `succeeded` | `Completed`; exit code `0` if supplied | `Bash command completed` | Matching successful result |
| `failed` | `Failed`; exit code if supplied | `Bash command failed, exit code N` | Nonzero/error result |
| `interrupted` | `Interrupted` | `Bash command interrupted` | Explicit cancellation/abort |
| `result-unavailable` | `Output unavailable`; no invented empty output | `Command output unavailable` | Missing or malformed result |
| `redacted` | Preserve upstream redaction tokens exactly | No special announcement of redacted text | Upstream redacted payload |
| `copy-error` | Persistent inline message: `Copy failed — open to select text` | Same text through `role="status"` | Clipboard rejection |

Do not put streaming output in a live region. Only state transitions are announced; otherwise VoiceOver would speak every appended fragment. `role="status"` is a polite live region intended for advisory updates. [MDN: ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions).

While running, update the fixed-height tail preview without growing the transcript. In the viewer:

- follow the tail only while the user is within 48 px of the bottom;
- scrolling upward disables follow mode;
- show a 44 × 44 px-or-larger `Jump to latest` button;
- tapping it scrolls to the current end and restores follow mode;
- completion does not force-scroll a user who is reading earlier output.

## 2.3 Copy contract

The copied string must come from canonical redacted content, never from `innerText`.

| Control | Exact copied value |
|---|---|
| `Copy command` | Raw command only; exclude decorative `$`, line numbers, labels, and status |
| `Copy output` | Raw output only; preserve line endings and redaction tokens |
| `Copy code` | Raw fenced-code body; exclude backticks, language label, and line numbers |
| `Copy text` | Raw artifact text |
| Viewer `Copy all` for Bash | `command + "\n\n" + output`; omit the separator if output is empty |

Copy transition:

1. `idle`: label `Copy`.
2. On `onPress`, synchronously call `navigator.clipboard.writeText(value)`.
3. `success`: checkmark plus `Copied` for 2 seconds; persistent hidden `role="status"` announces `Copied code`, `Copied command`, or equivalent.
4. Return visually to `Copy`.
5. `failure`: retain the normal button and add a persistent error message with an `Open` route to native selection. Do not silently claim success and do not fetch a fallback copy.

## 2.4 Tap and touch behavior

All actionable hit regions must be at least 44 × 44 CSS px, using invisible padding where the visible icon is smaller. Apple recommends a minimum 44 × 44 pt hit region; WCAG 2.2 AA independently sets a lower 24 CSS px minimum, so the Apple value is the operative bar here. [Apple HIG: Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons) and [WCAG 2.2 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

- The title/metadata area is one large `Open … full screen` button.
- `Copy` is a separate sibling button, never nested inside the Open button.
- The preview body is selectable text, not an invisible full-card button.
- A press begins visual feedback immediately.
- Dragging more than 8 px or initiating scroll cancels the press.
- Releasing outside the original target cancels the action.
- Double tap has no app-specific behavior.
- Long press on content invokes native selection.
- Horizontal swipe inside code/output pans that viewport.
- Horizontal swipe elsewhere has no block action.

## 2.5 Full-screen viewer behavior

Use the existing F6 viewer shell with React Aria:

```text
DialogTrigger
└── ModalOverlay
    └── Modal
        └── Dialog
            ├── title
            ├── toolbar
            └── content region
```

Opening:

- Push one ephemeral history entry for the viewer.
- Preserve transcript `scrollTop` and the invoking element.
- Make the transcript inert and lock its scroll.
- Focus the viewer title with `tabIndex="-1"`.
- Start at the top on first open for completed content.
- Start at the live tail for a running command.
- On subsequent opens during the same mounted conversation, restore that block’s last viewer scroll position.

Closing:

- Close button, `Escape`, browser/history back, or qualified pull-down closes the viewer.
- Restore transcript scroll before restoring focus.
- Return focus to the exact Open button.
- If that button no longer exists, focus the corresponding block heading; otherwise focus the transcript heading.
- Never stack another modal above the viewer.

The dialog must be named by its visible title, set `aria-modal="true"`, and omit `aria-describedby` for multi-paragraph or structured content. These rules follow the WAI modal-dialog pattern. [WAI-ARIA APG: Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

## 2.6 Pull-down and back gestures

Pull-down dismissal is an enhancement, not a requirement to close.

- Gesture may begin only in the 44 px-high viewer drag zone immediately below the top safe area.
- It may also begin in the content region only when `scrollTop === 0`.
- Claim the gesture after 12 px of movement when vertical displacement is at least 1.5 times horizontal displacement.
- Track the viewer one-to-one with the finger.
- Dismiss when downward displacement is at least 96 px, or after at least 40 px when release velocity is at least 0.8 px/ms.
- Otherwise return to the open position over 180 ms.
- Do not claim a gesture starting within 24 px of the left screen edge; allow system/history navigation.
- Do not allow pull-down from horizontally scrollable code until the gesture is clearly vertical.
- Close remains available at all times.

## 2.7 Keyboard and focus order

Inline focus order per block:

1. `Open {block title} full screen`
2. `Copy command/code/text`
3. `Copy output`, when present

Do not add every preview body to the tab sequence.

Viewer focus order:

1. Initial programmatic focus: title
2. `Close`
3. `Copy all`
4. Section-specific Copy buttons, if present
5. Content scroll region
6. `Jump to latest`, when present

Keyboard contract:

- `Enter` or `Space`: activate focused buttons.
- `Escape`: close viewer.
- `Tab`/`Shift+Tab`: remain inside the viewer.
- Arrow keys, Page Up/Down, Home/End: scroll the focused content region.
- `Command+C`/`Control+C`: retain native behavior for selected text.
- Do not intercept `Command+W`, browser find, or operating-system shortcuts.

Syntax-highlight spans and line numbers are never focusable. Line numbers use `aria-hidden="true"`. Code remains semantic `<pre><code>`, output uses `<pre>`, and long text uses `<article>` with real headings and paragraphs.

## 2.8 Visual and motion specification

- Controls: Inter; long-text reading surface: Source Serif 4; code/output: system `ui-monospace`.
- Pressed state: immediate ink/clay tint change and opacity `0.88`; no ripple or bounce.
- Press-state release: 80 ms.
- Viewer entry: 200 ms, opacity `0 → 1` plus `translateY(8px → 0)`.
- Viewer exit: 160 ms reverse.
- Copy icon-to-check transition: 120 ms crossfade.
- Streaming lines: no per-line animation.
- Running indicator: rotation allowed, but becomes a static activity glyph under reduced motion.
- `prefers-reduced-motion: reduce`: remove translation, rotation, springing, and chevron rotation; use an 80 ms crossfade or an instant state change. [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion).

Keyboard focus uses a two-color ring equivalent to at least a 2 CSS px perimeter and verified at 3:1 against adjacent colors. This deliberately adopts the stronger WCAG focus-appearance metric even though the fixed product target is AA. [WCAG 2.2 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html).

## 2.9 Viewport and scrolling

- Viewer height: React Aria `--visual-viewport-height`, with `100dvh` fallback.
- Top padding: `max(12px, env(safe-area-inset-top))`.
- Left/right padding: `max(12px, env(safe-area-inset-left/right))`.
- Bottom padding: `max(12px, env(safe-area-inset-bottom))`.
- Viewer owns vertical scrolling; transcript cannot move underneath.
- Code/output containers use `overflow: auto`, momentum scrolling, and `touch-action: pan-x pan-y pinch-zoom`.
- Prevent scroll chaining from the viewer into the transcript.
- Do not disable user scaling in the viewport meta tag.

## 2.10 Objective acceptance checks

The build passes only when all checks below succeed:

1. Every visible Open, Copy, Close, and Jump target reports at least 44 × 44 px via `getBoundingClientRect()`.
2. At 320, 390, and 430 CSS px widths, portrait and landscape, the page has no horizontal overflow outside code/output containers.
3. Opening or copying a block produces zero network requests and zero host-filesystem calls.
4. Clipboard tests verify byte-for-byte equality with the canonical redacted source and confirm that fences, prompts, labels, and line numbers are excluded.
5. Clipboard rejection produces the persistent failure state and never shows `Copied`.
6. Touch-scroll beginning on Open or Copy does not activate the control.
7. Long press on preview and viewer text produces native selection rather than an app menu.
8. Horizontal panning inside code never opens or dismisses the viewer.
9. Pull-down below threshold returns to the open position; pull-down above either threshold closes.
10. Left-edge history navigation closes the viewer without navigating away from the conversation.
11. `Tab` cannot escape the modal; `Escape` closes it; focus returns to the invoker.
12. VoiceOver reads title, block type, truncation metadata, status, and distinctly named actions without reading decorative syntax tokens or line numbers.
13. Streaming output does not cause continuous VoiceOver announcements or move a reader who has scrolled away from the tail.
14. With Reduce Motion enabled, computed transform animations and rotating indicators are absent.
15. Closing the viewer restores transcript scroll within 1 CSS px.
16. Light and dark themes meet WCAG AA for text and 3:1 non-text control/state contrast.
17. A 1 MB output fixture remains scrollable and Copy all returns the entire in-memory redacted string.
18. A malformed or unpaired tool result renders `Output unavailable` without retrying, guessing, or reading the host.

# 3. Divergent / minority ideas worth considering

## A header-only long-press action menu

Long-pressing the non-text header could offer `Copy command`, `Copy output`, `Copy all`, and `Open`. This is faster for expert users but must remain redundant with visible controls and must include a keyboard-accessible menu. It should never be attached to the selectable body because React Aria’s long-press handling suppresses native selection and context menus. [React Aria: useLongPress](https://react-aria.adobe.com/useLongPress).

## Tail-first completed output

Open completed Bash results at the final line, not the first. This matches terminal-monitoring behavior and foregrounds exit summaries, but it is worse for narrative command output. A controlled test should compare:

- completed output opens at top;
- completed output opens at bottom with a visible `Start of output` button.

Running output should remain tail-first in either design.

## Bottom action shelf in the viewer

Keep `Close` in the conventional top toolbar but duplicate the frequent `Copy all` action in a bottom safe-area shelf. Apple notes that middle and lower-screen controls are easier to reach on iPhone. [Apple HIG: Designing for iOS](https://developer.apple.com/design/human-interface-guidelines/designing-for-ios/). The tradeoff is lost reading space and duplicated focus stops.

## Press-and-hold “peek”

A header press-and-hold could temporarily enlarge a block, returning to the transcript on release. It would feel more spatial than a modal but has poor accessibility, fights selection expectations, and is difficult to discover. It should be explored only as an optional expert shortcut after the explicit viewer is complete.

## Command/output scrubber

For very large output, a right-edge scrubber could mark command start, stderr regions, redactions, and exit. This goes beyond Claude parity and treats output as a log-navigation object. It may be valuable for remote-agent supervision, but requires trustworthy structured offsets from the existing payload; it must not infer sensitive semantics client-side.

## No custom dismissal gesture at all

A strict alternative is to omit pull-down and rely on Close, `Escape`, and history back. This removes the hardest gesture conflict with nested code scrolling and may be the correct choice if the F6 shell cannot distinguish scroll-at-top reliably on iOS.

# 4. Open questions and risks

1. **F6 shell contract:** Does it already own history, focus restoration, scroll locking, safe-area padding, and reduced-motion behavior? Duplicating any of these would cause double history pops or focus jumps.

2. **Tool correlation:** Which stable identifiers pair `tool_call` with `tool_result`, and can results arrive late, out of order, or after reconnect? The card must update in place without reordering the transcript.

3. **Status metadata:** Does pi send exit code, stderr separation, cancellation, and truncation explicitly? The UI must not infer success from output wording.

4. **Clipboard security context:** Is the installed Tailscale PWA always served from an origin that Safari treats as secure? Clipboard writes may fail otherwise. [MDN: Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API).

5. **Redaction replacement:** Can an already-rendered payload later be replaced by a more-redacted revision? Copy state and open viewers must immediately reference the revised canonical string.

6. **Huge payload strategy:** Full syntax highlighting of very large code/output can block the main thread. Decide whether to disable highlighting above a measured byte/line threshold while retaining complete plain-text viewing and Copy all.

7. **Selection versus virtualization:** DOM virtualization can make native selection and Copy Range incomplete. Prefer chunked in-memory rendering or `content-visibility` unless device testing proves virtualization preserves selection semantics.

8. **Syntax-language availability:** Highlighting must be bundled and offline. Unknown languages need a plain-code state; opening a block must not initiate a CDN or host read.

9. **Gesture reliability:** Safari’s elastic scrolling and visual-viewport changes can make `scrollTop === 0` noisy. Pull-down dismissal requires real-device testing in standalone PWA mode, not only desktop emulation.

10. **VoiceOver rotor behavior:** Validate `<pre>` navigation, truncated-preview announcements, modal focus, and live status on current iOS. Automated ARIA tests cannot prove rotor or touch-exploration quality.

11. **Benchmark evidence:** Current public Claude captures prove artifact and modal surfaces, but not the complete gesture contract. Kimi’s public documentation does not expose code-card interaction details. Record the current Claude iOS and Kimi mobile flows before claiming pixel- or gesture-level parity.

12. **Copied-data expectations:** Copying deliberately moves redacted transcript content outside Pi Remote into the system clipboard. The product should confirm that this is acceptable within the fixed threat model and should never copy an unredacted backing value.

# 5. Sources

- https://developer.apple.com/design/human-interface-guidelines/accessibility
- https://developer.apple.com/design/human-interface-guidelines/buttons
- https://developer.apple.com/design/human-interface-guidelines/designing-for-ios/
- https://developer.apple.com/design/human-interface-guidelines/gestures/
- https://developer.apple.com/design/human-interface-guidelines/modality
- https://developer.apple.com/design/human-interface-guidelines/motion
- https://webkit.org/blog/7929/designing-websites-for-iphone-x/
- https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- https://www.w3.org/TR/WCAG22/
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
- https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
- https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion
- https://react-aria.adobe.com/Button
- https://react-aria.adobe.com/Disclosure
- https://react-aria.adobe.com/Modal
- https://react-aria.adobe.com/useClipboard
- https://react-aria.adobe.com/useLongPress
- https://react-aria.adobe.com/usePress
- https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them
- https://techdevnotes.com/apps/ios/claude/6473753684/screenshots
- https://www.kimi.com/help/getting-started/overview
- https://mobbin.collaboo.co/explore/screens/e72408d7-3f84-492c-960d-a855165e2e3c
- https://github.com/slopus/happy
- https://github.com/slopus/happy/releases
- https://github.com/happier-dev/happier
- https://github.com/grapeot/opencode_ios_client
- https://github.com/MobileCLI/mobilecli
- https://github.com/gotoplanb/Hermit
- https://github.com/QuivrHQ/247-claude-code-remote
