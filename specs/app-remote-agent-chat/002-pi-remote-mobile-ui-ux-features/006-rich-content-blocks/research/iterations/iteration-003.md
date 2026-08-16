<!-- provenance: external-CLI orchestration pass; original file iter-03-sol.md -->
> **Source pass 3** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-3-sol.md`.

<!-- F7-rich-content-blocks | model=sol | lens=accessibility-i18n | iter 3/10 | 2026-08-16T04:21:36.983Z -->

# 1. Findings for the accessibility–internationalization lens

## Accessibility architecture

The rich blocks should remain document content, not become mini-applications. Use native `<button>`, headings, `<pre><code>`, paragraphs, lists, and disclosure/dialog semantics. Do not apply `role="application"` or make every card a `region`; excessive landmarks reduce their navigational value, while VoiceOver users can already navigate web content by headings, buttons, controls, and landmarks through the rotor. [W3C recommends keeping landmarks to major page areas](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/), and [Apple documents rotor navigation by headings, buttons, and form controls](https://support.apple.com/guide/iphone/use-voiceover-in-apps-iphe4ee74be8/26/ios/26).

Cards need separate controls rather than a single clickable wrapper:

- A disclosure button owns expansion and exposes `aria-expanded`.
- Copy and Open are sibling buttons, never children of the disclosure button.
- Text selection remains enabled in command, output, code, and artifact previews.
- The card can be an `<article>` or neutral `<div>` with a visible heading; it should not automatically become a landmark.

This aligns with React Aria’s `Disclosure` structure and its explicit warning that headings and buttons must not contain interactive children. [React Aria Disclosure](https://react-aria.adobe.com/Disclosure)

## Full-screen viewer and focus

Reusing the F6 viewer shell as a real modal is preferable to a visually full-screen `<div>`. A modal must make the transcript behind it inert, contain keyboard focus, expose `role="dialog"` and `aria-modal="true"`, have a visible title, and return focus to the exact Open button when dismissed. The WAI-ARIA dialog pattern requires contained focus, Escape dismissal, a visible close control, and focus restoration. For long structured content it specifically recommends initially focusing a static title or first paragraph rather than a later action button. [WAI-ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

React Aria supplies the appropriate `DialogTrigger`/`Modal`/`Dialog` composition, Escape behavior, and visual-viewport variables. Its `--visual-viewport-height` and `--visual-viewport-width` account for the usable area above the iOS software keyboard. [React Aria Modal](https://react-aria.adobe.com/Modal)

Apple considers full-screen modality suitable for in-depth content, but requires an obvious dismissal method and discourages stacked modals. [Apple HIG: Modality](https://developer.apple.com/design/human-interface-guidelines/modality)

The viewer should therefore:

- Focus its title with `tabIndex="-1"` on entry.
- Trap focus within the viewer.
- Keep Close permanently visible.
- Support Escape on an attached keyboard.
- Make browser/PWA Back close the viewer before leaving the transcript.
- Restore transcript scroll position and focus on close.
- Never auto-scroll the underlying transcript while the viewer is open.

## Screen-reader announcements

Do not expose streaming command output or token-by-token code as an assertive live region. A transcript may use `role="log"`, whose implicit behavior is already `aria-live="polite"`; nested rapid updates can otherwise flood speech. [ARIA `log` role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/log_role)

Expose lifecycle changes through one persistent, visually hidden `role="status"` region:

- “Command started.”
- “Command completed, exit code 0.”
- “Command failed, exit code 1.”
- “Copied command.”
- “Copy failed.”

`role="status"` has implicit polite announcement behavior and meets WCAG’s requirement that non-focus-moving status changes be programmatically determinable. [W3C ARIA22](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22)

The full output itself should be read only when the user navigates into it. Syntax-highlighting spans must remain semantically neutral so VoiceOver encounters one coherent code sequence rather than a sequence of token labels.

## Copy behavior

Copy must use the original, already-redacted source string, not `innerText`, highlighted markup, a rendered screenshot, typographic substitutions, or a visually wrapped reconstruction. This prevents smart quotes, omitted whitespace, reordered bidirectional text, and line-number contamination.

Invoke `navigator.clipboard.writeText(rawText)` directly inside the React Aria `Button` `onPress` event. WebKit requires a secure context and a live user gesture; deferring the write until after unrelated asynchronous work can cause rejection. [WebKit Async Clipboard API](https://webkit.org/blog/10855/async-clipboard-api/), [MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)

On success, the button may visibly change from “Copy” to “Copied” for two seconds, but:

- Focus must not move.
- The persistent status region retains “Copied …” after the visible label resets.
- There is no toast that steals focus or covers another control.
- Failure exposes persistent inline recovery text: “Copy failed. Touch and hold to select the text.”

Visible and accessible labels must match or begin with the same words so iOS Voice Control can activate “Copy” and “Open.” This is WCAG 2.5.3 Label in Name. [W3C Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html)

## Dynamic Type and reflow

Apple asks iPhone interfaces to support text enlargement to at least 200%, keep useful content available at the largest sizes, and avoid truncation. Its default iOS body size is 17 pt, with 11 pt as the recommended absolute minimum. [Apple HIG: Typography](https://developer.apple.com/design/human-interface-guidelines/typography), [Apple HIG: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)

A PWA using fixed custom-font sizes will not automatically achieve this. WebKit supports Dynamic Type CSS text styles such as `font: -apple-system-body`; the resulting size and weight can be retained while overriding only `font-family` back to Inter or Source Serif 4. [WebKit: Using the System Font in Web Content](https://webkit.org/blog/3709/using-the-system-font-in-web-content/)

Recommended root strategy:

```css
html {
  font: -apple-system-body;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  -webkit-text-size-adjust: 100%;
}

.prose {
  font-family: "Source Serif 4", ui-serif, Georgia, serif;
}

.code {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Monaco, monospace;
}
```

All component sizes should then use `rem`, `em`, `lh`, intrinsic sizing, or content-driven padding—never fixed block heights. Verify the behavior on real installed-PWA builds because Dynamic Type behavior can differ from Safari tab page zoom.

At a 320 CSS-pixel viewport or 200% text:

- Human-language text must reflow without page-level horizontal scrolling.
- Long URLs, hashes, and identifiers use `overflow-wrap:anywhere`.
- Code may retain horizontal scrolling only inside its own `<pre>`.
- The viewer toolbar must wrap into two rows rather than truncate labels.
- Focused controls must not sit behind the sticky viewer toolbar or Home-indicator padding.

WCAG 1.4.10 requires reflow at 320 CSS pixels while allowing isolated two-dimensional content where layout carries meaning. W3C specifically recognizes code indentation as potentially meaningful but recommends wrapping or a user-controlled wrap mechanism where it is not. [WCAG Reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html), [W3C G224 for code indentation](https://www.w3.org/WAI/WCAG22/Techniques/general/G224), [W3C C33 for long strings](https://www.w3.org/WAI/WCAG22/Techniques/css/C33.html)

## Touch, focus, and contrast

Every Copy, Open, Close, Wrap, and disclosure target should have a minimum 44×44 CSS-pixel hit region, even if the icon is visually 18–20 px. Apple recommends 44×44 pt; WCAG 2.2 AA requires at least 24×24 CSS pixels or sufficient spacing. [Apple HIG: Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons), [WCAG Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

All syntax tokens and labels below the large-text threshold require 4.5:1 contrast; borders, focus indicators, and state icons require at least 3:1 against adjacent colors. [WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum), [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

Using the WCAG relative-luminance calculation, clay `#d97757` against bone `#f8f8f6` is approximately **2.94:1**. Therefore clay alone fails even the 3:1 threshold for meaningful icons, borders, focus indicators, and large text on the light surface. Use clay as:

- A fill behind carbon text.
- A decorative accent paired with a carbon icon or label.
- A secondary highlight whose meaning is duplicated by text and shape.

Do not use clay-only syntax tokens, link text, status dots, or focus rings on bone. Recalculate every dark-theme surface/token pairing independently.

Focus styling should use a two-color ring—2 px high-contrast inner ring plus 2 px surface-colored offset—so it survives parchment, clay, and dark surfaces. Sticky headers must use `scroll-padding-block-start`/`scroll-margin-block` so focused elements remain visible. [WCAG Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)

## Reduced motion

Use a restrained 140–180 ms opacity transition for modal and disclosure state changes. Avoid spring bounce, background parallax, large scaling, or lateral slide transitions.

Under `prefers-reduced-motion: reduce`:

- Set modal and disclosure transition duration to zero.
- Remove height interpolation; reveal the final panel immediately.
- Do not animate chevron rotation.
- Preserve the pressed/focus state through color, border, or weight rather than movement.

Apple recommends replacing axis and depth movement with fades when Reduce Motion is active, while W3C recognizes `prefers-reduced-motion` as the web mechanism for disabling interaction-triggered motion. [Apple HIG: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility), [W3C C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39)

## RTL, mixed-direction content, and localization

Use React Aria `I18nProvider`/`useLocale` at the root and apply its BCP-47 locale and direction to the application’s `lang` and `dir` attributes. React Aria detects system locale/direction, but styling remains the application’s responsibility. [React Aria `useLocale`](https://react-aria.adobe.com/useLocale)

Use CSS logical properties throughout: `padding-inline`, `margin-inline`, `inset-inline-end`, `border-inline-start`, and `text-align:start`. Physical `left`/`right` placement will not mirror correctly. [MDN logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Logical_properties_and_values/Margins_borders_padding), [Apple HIG: Right to left](https://developer.apple.com/design/human-interface-guidelines/right-to-left)

Direction rules differ by content type:

- Application chrome mirrors with the locale.
- Human-language transcript/artifact text uses `dir="auto"` at the block or paragraph boundary.
- Bash commands, file paths, stack traces, and source code remain `dir="ltr"` with start alignment.
- Dynamic labels such as filenames should be isolated with `<bdi>` so punctuation cannot leak into surrounding RTL text.
- UI labels, plural forms, and status messages are translated; commands, output, code, filenames, hashes, and clipboard payloads are never translated or numeral-shaped.

W3C recommends `dir="auto"` for runtime-inserted multilingual text and `<bdi>` for isolated inline strings. [W3C structural markup and RTL text](https://www.w3.org/International/questions/qa-html-dir)

React Aria supplies locale/direction, not the translation catalog. Copy, Open, Close, Command, Output, Running, Completed, Failed, line counts, and error messages still need ICU-style pluralized messages. Count thresholds should use Unicode grapheme clusters via `Intl.Segmenter`, not JavaScript UTF-16 `.length`, so emoji and combining sequences are not overcounted.

Font stacks must permit per-script fallback. Inter and Source Serif 4 cannot be assumed to contain every Arabic, Hebrew, CJK, Indic, or emoji glyph; do not disable system fallback or force artificial letter spacing on scripts that do not use it.

## Comparative evidence

Claude’s artifact model supports substantial content in a dedicated window and exposes clipboard copying, which supports using the F6 viewer rather than expanding indefinitely inside the transcript. [Claude Artifacts help](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them)

Kimi Code’s public changelog documents expandable Bash cards, complete multi-line commands in expanded state, and fixes for narrow layouts containing CJK and emoji. Its web UI documents message copying, code highlighting, tool output, and mobile navigation. These are useful behavioral precedents, but not evidence of accessibility conformance. [Kimi Code changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md), [Kimi Code Web UI](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html)

Open-source mobile prior art includes [Happy](https://github.com/slopus/happy), [OpenCode Mobile](https://github.com/dzianisv/opencode-mobile), and the [native OpenCode iOS client](https://github.com/grapeot/opencode_ios_client). They demonstrate demand for mobile tool-call, diff, and code inspection, but their screenshots or feature lists must not be treated as proof of VoiceOver, focus, or RTL quality.

Mobbin returns shipped-product screen images and links, but screenshots cannot reveal the accessibility tree, focus restoration, reduced-motion behavior, or clipboard integrity. Authenticated Claude/Kimi screen records were unavailable in this pass, so no Mobbin screen identifier is fabricated. [Mobbin API behavior](https://docs.mobbin.com/api/quickstart)

# 2. Concrete spec contribution a build phase can execute

## Block classification

| Input | Rendered component | Default presentation |
|---|---|---|
| Bash/shell `tool_call` plus matching `tool_result` | Command + Output card | Status and command preview always visible |
| Fenced code | Code card | Language, line count, Copy, Open, up to 12 preview lines |
| Goal/prompt metadata | Prompt artifact | Label, six-line preview, Copy, Open |
| Plain text over 900 grapheme clusters or 10 source lines | Text artifact | Label, six-line preview, Copy, Open |
| Short assistant prose | Existing semantic prose | No extra card |

Classification changes presentation only. It must not request filesystem content, reread the host, or mutate the transcript.

## Command + Output states

| State | Visual state | Accessible state |
|---|---|---|
| `running` | Expanded; spinner plus “Running”; command and latest six output lines | Disclosure expanded; polite “Command started”; output itself not live |
| `succeeded`, exit 0 | Collapsed by default; check icon plus “Completed”; first command line | Text exposes “Completed, exit code 0”; never color-only |
| `failed`, nonzero | Expanded by default; error icon plus “Failed”; first eight output lines | Polite “Command failed, exit code N” |
| `interrupted` | Expanded; stop icon plus “Interrupted” | Text exposes interruption |
| missing/unmatched result | Expanded; neutral warning “Output unavailable” | No invented exit status |

User expansion state wins over automatic defaults. Never collapse a card while it or one of its controls has focus.

Card controls:

- Disclosure: visible label contains the command’s first logical line, status, and expansion chevron.
- `Copy command`
- `Copy output`, disabled only when no output exists
- `Open full screen`

Each target is at least 44×44 px. React Aria `Button onPress` handles touch, pointer, and keyboard consistently. [React Aria Button](https://react-aria.adobe.com/Button)

## Code card

- Header: localized language label or “Code”, localized line count, Copy, Open.
- Body: `<pre tabindex="0"><code>…</code></pre>`.
- Line numbers are `aria-hidden` and excluded from copied text.
- Highlight spans have no ARIA role or label.
- Default transcript preview: maximum 12 logical lines.
- Default full-screen mode: no wrapping for source code; toolbar provides a `Wrap lines` toggle.
- Wrapped mode: `white-space:pre-wrap; overflow-wrap:anywhere`.
- Unwrapped mode: horizontal scrolling remains confined to `<pre>`.
- Text selection and long-press selection remain enabled.
- Copy always writes the source string, including original whitespace and final newline.

## Text/prompt artifact

- Visible type label: `Prompt`, `Goal`, or `Text`; use source metadata when available and never infer “Prompt” from wording alone.
- Visible title: supplied title, otherwise localized “Prompt artifact” or “Text artifact.”
- Preview: first six logical lines with a visible “Preview truncated” indication.
- Expanded inline state preserves real paragraphs, headings, lists, and links.
- Full-screen mode uses semantic prose rather than one giant `<pre>`.
- Human-language content uses `dir="auto"`; embedded filenames and identifiers use `<bdi>`.
- `Copy` writes the original redacted plain text or Markdown, not rendered HTML.

## Full-screen F6 viewer

DOM and interaction contract:

1. `DialogTrigger` is the block’s Open button.
2. `ModalOverlay` fills `--visual-viewport-height` and includes safe-area padding.
3. `Dialog` has a visible `<Heading slot="title">`.
4. The title receives initial programmatic focus.
5. Toolbar order is Close, title, Copy, Wrap where applicable.
6. Content is one independently scrollable region with `tabIndex="0"` only when it actually overflows.
7. Close works through the visible button, Escape, and PWA Back.
8. Focus returns to the originating Open button.
9. If that button was removed by transcript reconciliation, focus moves to the owning card heading.
10. Opening or closing never changes the transcript scroll position.

Do not rely on backdrop tap, swipe-down, or a drag handle as the sole dismissal method.

## Internationalized messages

At minimum, localize:

- Command, Output, Code, Prompt, Text
- Running, Completed, Failed, Interrupted
- Expand, Collapse, Open full screen, Close
- Copy command, Copy output, Copy code, Copy text
- Copied command/output/code/text
- Copy failed
- Wrap lines
- One line / N lines
- Exit code N
- Preview truncated / Output unavailable

Accessible names must start with the visible localized label: visible “Copy” may have the accessible name “Copy command,” but not an unrelated name such as “Save snippet.”

## Visual and motion rules

- Prose: Source Serif 4, minimum `1rem`, line height 1.5–1.65.
- UI: Inter, minimum `0.875rem`; primary controls `1rem`.
- Code: `0.875rem`, line height 1.45; user scaling may enlarge it to 200%.
- No fixed-height text containers.
- Clay is decorative or a fill with dark text; never clay-only meaningful text/iconography on bone.
- All syntax tokens: at least 4.5:1 in light and dark themes.
- Borders, focus rings, status icons: at least 3:1.
- Normal transition: opacity 160 ms; disclosure height 180 ms maximum.
- Reduced motion: zero-duration state changes, no transform or height interpolation.
- Use `scroll-padding-block-start` and bottom safe-area padding so focus is never obscured.

## Pass/fail verification matrix

A build is acceptable only if all checks pass:

| Test | Pass condition |
|---|---|
| VoiceOver, installed PWA | Rotor finds viewer heading and all buttons; expansion state is announced; background transcript is unreachable while modal is open |
| Focus restoration | Open viewer, close by button and Escape; focus returns to the same Open control |
| Copy integrity | Pasted value is string-equal to the redacted source, including tabs, quotes, emoji, RTL text, and terminal newline |
| Copy failure | Rejected clipboard promise produces visible recovery text and a screen-reader announcement without moving focus |
| 200% text | No clipped labels/content; toolbar wraps; all actions remain operable |
| 320 CSS px | No page-level horizontal scrolling; only code/output containers may scroll horizontally |
| Reduced Motion | Modal and disclosures change without translation, scale, bounce, or height animation |
| RTL Arabic | Application chrome mirrors; Close/Copy order follows design direction; code and shell content remain LTR; filenames do not reorder punctuation |
| Long strings | 500-character URL/hash cannot widen the page |
| Contrast | Every syntax token passes 4.5:1; every meaningful non-text state/focus indicator passes 3:1 in both themes |
| Touch | Every action’s computed hit box is at least 44×44 px |
| Focus visibility | External-keyboard traversal never places focus entirely behind sticky bars |
| Streaming | VoiceOver receives one lifecycle announcement, not every appended output token |
| Orientation | Portrait and landscape remain operable; content is not locked to one orientation |
| Regression devices | Test at least 320×568 and 393×852 viewports in Safari and standalone display modes |

Manual testing must include VoiceOver, Voice Control, external keyboard, Reduce Motion, Larger Text, light/dark mode, Arabic, German pseudo-localization at +40% length, CJK, emoji/combining characters, and a deliberately unbroken 500-character token. Apple recommends testing with VoiceOver, Voice Control, and Switch Control rather than relying only on automated inspection. [Apple accessibility testing](https://developer.apple.com/documentation/accessibility/performing-accessibility-testing-for-your-app)

# 3. Divergent / minority ideas worth considering

## A screen-reader “linear reading” mode

Offer an optional viewer mode that removes line numbers and visual highlighting from the accessibility tree and presents:

1. Block type and language.
2. Line count/status.
3. Plain source text.
4. Actions after the content.

This can substantially reduce VoiceOver rotor noise in large code blocks. It should be opt-in because duplicating visual and accessible representations can drift.

## Bidirectional-control warnings

Detect Unicode bidi-control characters in code, commands, and paths and display a non-destructive warning: “This block contains bidirectional control characters.” Provide a “Show invisible characters” presentation while keeping Copy byte-for-byte faithful to the source.

GitHub warns because bidi controls can make code appear in a different order from its logical interpretation; Unicode’s source-code guidance recommends special handling for program text. [GitHub bidi warning](https://github.blog/changelog/2021-10-31-warning-about-bidirectional-unicode-text/), [Unicode UTS #55](https://www.unicode.org/reports/tr55/)

## Wrap policy by content semantics

Instead of one global wrap preference:

- Human prose and ordinary output: wrap by default.
- Commands: wrap, but preserve explicit newlines.
- Source code: preserve layout by default.
- Detected table/column output: preserve layout and expose “Wrap columns.”
- Persist preferences locally per block type, never on the host.

This is more complex than one toggle but better matches WCAG’s distinction between text that should reflow and layouts whose spatial relationships carry meaning.

## “Skip block” navigation

For output over 100 lines, add visually hidden in-page links before and after the block: “Skip output” and “Return to command.” VoiceOver users otherwise may need hundreds of swipes. Keep these as links, not landmarks.

## No timer-based feedback

A minority but defensible option is to leave the button visibly labeled “Copied” until focus leaves it, rather than reverting after two seconds. Apple cautions that timed interface elements can be difficult for users who need longer to process content. [Apple HIG: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)

# 4. Open questions + risks

- **Dynamic Type with fixed brand fonts:** Confirm on every supported iOS/WebKit version that `font:-apple-system-body` followed by the Inter/Source Serif family override retains the user’s size category. If not, Pi Remote needs a local 100–200% text-size preference.
- **Transcript live-region policy:** If the existing transcript is already a polite `role="log"`, test whether nested streaming updates double-announce. The block renderer may require coordination with the transcript container rather than a local fix.
- **Default code wrapping:** Preserve-layout is technically defensible, but wrap-on may be more usable on iPhone. Validate with low-vision and screen-reader users rather than copying desktop conventions.
- **Unknown content language:** `dir="auto"` solves base direction, not pronunciation. If pi does not send a language tag, VoiceOver may use the app voice for foreign-language artifacts.
- **Very large output:** Rendering thousands of syntax-highlighted lines can cause memory and focus instability. Virtualization must not remove the currently focused line or make content inaccessible to VoiceOver; a plain-text full-screen fallback may be safer.
- **ANSI and control characters:** Decide whether output copying preserves ANSI sequences or copies the visible normalized text. Whichever contract is chosen must be explicit and tested; it must never copy line numbers or UI status text.
- **Bidi-security boundary:** “Already redacted” does not imply safe visual ordering. Source code containing hidden bidi controls needs a display policy.
- **Modal history integration:** Closing through browser/PWA Back must not accidentally leave the transcript route or create an unbounded history entry per block.
- **Mobbin verification:** A connected Mobbin account is still needed to record exact Claude iOS and Kimi screen URLs and compare their visible action placement. Screenshots alone remain insufficient for accessibility claims.
- **Translation ownership:** React Aria provides direction and interaction semantics but not Pi Remote’s message translations. Define catalog ownership, fallback locale, and release checks before exposing an RTL locale.

# 5. Sources

- [Apple Human Interface Guidelines — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Apple Human Interface Guidelines — Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [Apple Human Interface Guidelines — Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [Apple Human Interface Guidelines — Modality](https://developer.apple.com/design/human-interface-guidelines/modality)
- [Apple Human Interface Guidelines — Right to left](https://developer.apple.com/design/human-interface-guidelines/right-to-left)
- [Apple — Use VoiceOver in apps and Safari](https://support.apple.com/guide/iphone/use-voiceover-in-apps-iphe4ee74be8/26/ios/26)
- [Apple — Performing accessibility testing](https://developer.apple.com/documentation/accessibility/performing-accessibility-testing-for-your-app)
- [WebKit — Using the System Font in Web Content](https://webkit.org/blog/3709/using-the-system-font-in-web-content/)
- [WebKit — Async Clipboard API](https://webkit.org/blog/10855/async-clipboard-api/)
- [React Aria — Disclosure](https://react-aria.adobe.com/Disclosure)
- [React Aria — Button](https://react-aria.adobe.com/Button)
- [React Aria — Modal](https://react-aria.adobe.com/Modal)
- [React Aria — useLocale](https://react-aria.adobe.com/useLocale)
- [WAI-ARIA Authoring Practices — Modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WAI-ARIA Authoring Practices — Landmark regions](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WCAG — Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
- [WCAG — Reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html)
- [WCAG — Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG — Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)
- [WCAG — Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html)
- [W3C G224 — Meaningful text indentation and code reflow](https://www.w3.org/WAI/WCAG22/Techniques/general/G224)
- [W3C C33 — Reflow for long strings](https://www.w3.org/WAI/WCAG22/Techniques/css/C33.html)
- [W3C C39 — Prefers Reduced Motion](https://www.w3.org/WAI/WCAG22/Techniques/css/C39)
- [W3C ARIA22 — Status messages](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22)
- [W3C Internationalization — Structural markup and RTL text](https://www.w3.org/International/questions/qa-html-dir)
- [MDN — Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [MDN — ARIA log role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/log_role)
- [MDN — CSS logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Logical_properties_and_values/Margins_borders_padding)
- [MDN — overflow-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow-wrap)
- [Claude Help — What are artifacts?](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them)
- [Kimi Code Web UI](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html)
- [Kimi Code changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)
- [Happy — mobile/web Codex and Claude Code client](https://github.com/slopus/happy)
- [OpenCode Mobile](https://github.com/dzianisv/opencode-mobile)
- [OpenCode native iOS client](https://github.com/grapeot/opencode_ios_client)
- [GitHub — Warning about bidirectional Unicode text](https://github.blog/changelog/2021-10-31-warning-about-bidirectional-unicode-text/)
- [Unicode Technical Standard #55 — Source Code Handling](https://www.unicode.org/reports/tr55/)
- [Mobbin API Quick Start](https://docs.mobbin.com/api/quickstart)
