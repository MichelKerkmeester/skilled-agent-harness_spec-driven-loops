<!-- provenance: external-CLI orchestration pass; original file iter-03-sol.md -->
> **Source pass 3** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-3-sol.md`.

<!-- F6-file-preview | model=sol | lens=accessibility-i18n | iter 3/10 | 2026-08-15T19:55:02.406Z -->

# 1. Findings for the accessibility-i18n lens

## The viewer must behave as a document screen, not an enlarged card

A full-screen file preview is semantically a modal document surface: background chat becomes inert, focus remains inside, `Escape` closes it, and closing restores focus to the originating file card. For long or structured content, initial focus should land on the viewer title rather than the first toolbar button, and the dialog should omit `aria-describedby` so VoiceOver can navigate headings, paragraphs, and code in their actual structure. This follows the WAI modal-dialog pattern and is directly supported by React Aria’s modal and focus-management primitives. [WAI modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [React Aria Modal](https://react-aria.adobe.com/Modal), [React Aria FocusScope](https://react-aria.adobe.com/FocusScope)

Claude’s current product model supports this direction: artifacts appear in a dedicated window and expose code, copy, and download actions; on Claude Mobile, downloaded files open in the system preview or a suitable app. The target should preserve that separation while avoiding an unnecessary handoff for formats Pi Remote can safely render inline. [Claude artifacts](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them), [Claude mobile file handling](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude)

Open-source mobile-agent clients confirm that file inspection is a core remote-supervision task, not an auxiliary feature. OpenCodex provides a file tree, search, code viewing, and `path:line` jumps; Claude Code Viewer advertises image, PDF, and text previews in a Tailscale-accessible PWA; Happy combines mobile agent control with file icons, diff rendering, syntax tooling, sharing, and localization dependencies. These are useful prior-art boundaries, although none documents a complete VoiceOver/RTL contract for its viewer. [OpenCodex](https://github.com/mjmkk/opencodex), [Claude Code Viewer](https://github.com/d-kimuson/claude-code-viewer), [Happy](https://github.com/slopus/happy), [Happy application dependencies](https://github.com/slopus/happy/blob/main/packages/happy-app/package.json)

## Redaction must apply to the accessibility tree, selection, and sharing

Visual concealment is insufficient. Redacted text must never remain underneath a blur, black rectangle, syntax layer, PDF canvas, `aria-hidden` wrapper, offscreen accessible description, or copied DOM selection. The renderer must receive either the safe content or an explicit redaction placeholder such as “Redacted by relay”; it must not receive the concealed characters.

This is especially important for PDFs. PDF.js is a standards-based PDF renderer, but its selectable/searchable text layer is separate from the painted canvas. Enabling that layer can expose text that is invisible in the rendered page if the source PDF contains cosmetic rather than destructive redactions. PDF previews therefore need an explicit relay assertion such as `textLayerSafe: true`; otherwise Pi Remote should show painted pages without selectable/extracted text and announce that accessible text is unavailable. [PDF.js repository](https://github.com/mozilla/pdf.js), [PDF.js viewer architecture](https://mozilla.github.io/pdf.js/getting_started/)

Sharing must export exactly the relay-provided safe bytes—not the host path, a newly fetched source, reconstructed Markdown, `innerText`, or a public artifact URL. Use `navigator.canShare({files})` before file sharing and provide a local download fallback when the Web Share API rejects the MIME type. Apple recommends the standard Share button and system share sheet for document actions. [MDN `navigator.share`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share), [MDN `navigator.canShare`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare), [Apple activity views](https://developer.apple.com/design/human-interface-guidelines/activity-views)

## Each renderer needs a distinct accessibility model

- **Text and Markdown:** Render real headings, paragraphs, lists, links, tables, and code—not a canvas or flattened image. Preserve source language metadata where supplied. Do not set one enormous `aria-label` containing the document.

- **Code:** Use a focusable `<pre><code>` region with a visible language label. Line numbers and purely decorative syntax spans should be ignored by assistive technology; VoiceOver should read the source once, in logical order. Provide a visible “Wrap lines” control because code is one of the few cases where two-dimensional scrolling may be meaningful, but it need not be the only presentation. WCAG requires reflow without lost functionality at an equivalent width of 320 CSS pixels, with exceptions only where two-dimensional layout is essential. [WCAG 2.2 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)

- **Image:** An uploaded filename is not an image description. If the relay supplies trusted alternative text, use it. Otherwise announce “Image preview; description not provided,” alongside the filename and dimensions. Do not ask a remote image-captioning service to infer content. W3C requires informative images to have a text alternative conveying their relevant information, while decorative images use empty alternatives. [W3C Images Tutorial](https://www.w3.org/WAI/tutorials/images/), [Apple VoiceOver guidance](https://developer.apple.com/design/human-interface-guidelines/voiceover)

- **PDF:** Render canvas, text, annotation, and structure layers only when safe. Each page needs a programmatic label such as “Page 3 of 12.” Provide a “Document text” presentation when a safe text/structure layer exists. A scanned or unsafe PDF must state that accessible text is unavailable; do not silently expose an empty viewer.

- **Unsupported/binary:** Present the filename, localized type and size, “Preview unavailable,” Share/Download if allowed, and Close. Never present a blank surface.

Loading, completion, page changes, sharing completion, and errors need concise status announcements that do not steal focus. `role="status"` is appropriate for ordinary progress and success; `role="alert"` is reserved for an error requiring immediate attention. W3C explicitly cautions against overly chatty live regions. [WCAG Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)

## Dynamic Type cannot be approximated by a larger default font

Apple recommends supporting at least 200% text enlargement and testing Larger Accessibility Text Sizes, layout adaptation, icon scaling, and truncation at the largest sizes. [Apple accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility), [Apple typography](https://developer.apple.com/design/human-interface-guidelines/typography)

For an iPhone PWA, use WebKit’s Dynamic Type root metric and then retain the fixed type family:

```css
@supports (font: -apple-system-body) {
  @media (hover: none) {
    html {
      font: -apple-system-body;
      font-family: Inter, system-ui, sans-serif;
    }
  }
}
```

Viewer dimensions and typography should then use `rem`, `em`, logical spacing, and content-driven block sizes; fixed `px` font sizes or capped `clamp()` values would defeat enlargement. WebKit officially exposes values such as `-apple-system-body`, `-apple-system-headline`, and `-apple-system-caption1` for Dynamic Type behavior. [WebKit system font and Dynamic Type](https://webkit.org/blog/3709/using-the-system-font-in-web-content/)

At 200% text, the toolbar must change from one horizontal row to a two-row or wrapped layout. Filename, Close, Share, page controls, and wrapping controls must remain present. Apple specifically recommends stacked layouts when inline controls crowd enlarged text. [Apple typography](https://developer.apple.com/design/human-interface-guidelines/typography)

## The fixed clay accent fails important light-theme contrast uses

Using the WCAG relative-luminance formula:

- `#d97757` clay against `#f8f8f6` bone is approximately **2.94:1**.
- It therefore fails the **4.5:1** AA threshold for normal text and narrowly fails the **3:1** threshold for meaningful graphical boundaries.
- Black against clay is approximately **6.73:1**; thus a clay-filled control can use sufficiently dark carbon text, but bone/white text on clay does not pass for ordinary text.

Accordingly, clay may remain the accent fill or decorative highlight, but it cannot be the only indicator for a focus ring, selected state, link, syntax token, PDF control boundary, or redaction state on bone. Use a carbon outline, icon, underline, text label, or pattern as the second channel. Every actual light/dark token pair must be mechanically tested at 4.5:1 for normal text and 3:1 for controls, focus indicators, and meaningful graphics. [WCAG minimum contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum), [WCAG non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast), [Apple inclusive color](https://developer.apple.com/design/human-interface-guidelines/color)

## Touch gestures cannot be the sole controls

Apple’s preferred iOS control size is 44×44 points; WCAG 2.2’s AA floor is 24×24 CSS pixels, subject to limited exceptions. Pi Remote should use 44×44 CSS-pixel hit regions for Close, Share, zoom, page navigation, wrapping, and retry. [Apple accessibility control sizes](https://developer.apple.com/design/human-interface-guidelines/accessibility), [WCAG Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

Pinch-to-zoom, double-tap-to-fit, and swipe-down-to-close may be added, but equivalent buttons must remain available. WCAG requires a single-pointer alternative to authored dragging gestures. Avoid custom left/right page swipes because they conflict with VoiceOver navigation; expose Previous/Next buttons and an optional page-number control instead. [WCAG Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)

## RTL affects structure, while file content preserves its own direction

Use React Aria’s `I18nProvider`, obtain `{locale, direction}` with `useLocale`, and apply both `lang` and `dir` at the application root. React Aria explicitly recommends this so browser and assistive technology receive the interface language and direction. [React Aria I18nProvider](https://react-aria.adobe.com/I18nProvider), [React Aria `useLocale`](https://react-aria.adobe.com/useLocale)

All shell layout must use logical properties: `padding-inline`, `margin-inline`, `inset-inline`, `border-inline`, `text-align:start`, and `flex-start/end`. W3C recommends `dir="rtl"` at document level, logical CSS, and `dir="auto"` for unknown runtime text. [W3C structural RTL guidance](https://www.w3.org/International/questions/qa-html-dir)

Viewer content needs independent direction rules:

- Natural-language title, description, and Markdown blocks: `dir="auto"` where the source language is unknown.
- Repository paths, hashes, URLs, MIME types, and code: isolated LTR runs, even within an RTL shell.
- Filenames embedded in localized sentences: `<bdi>` isolation.
- Close/Share/toolbars mirror with the shell; source code and image orientation do not mirror.
- Dates, sizes, page counts, and plural forms use `Intl`, not concatenated strings such as `"Page " + n + " of " + total`.

Inter has historically lacked full Arabic support, so the fixed design system needs script-aware system fallbacks placed before Inter for Arabic rather than allowing isolated Inter glyphs to interrupt shaping. [Inter Arabic discussion](https://github.com/rsms/inter/discussions/463)

## Long strings are a primary mobile state, not an edge case

Repository paths, hashes, minified JSON, translated action labels, and unbroken URLs can all exceed an iPhone viewport. Every flex/grid child containing text needs `min-inline-size:0`; filenames and metadata use `overflow-wrap:anywhere`. The visible toolbar title may use two lines followed by middle truncation, but its accessible name and a details disclosure must expose the full value. Document body text must not be truncated.

Code defaults to wrapped lines on narrow screens, with the user’s wrap preference persisted locally. Unwrapped mode may scroll horizontally inside the code region without moving the modal or toolbar. WCAG also requires that increased line, paragraph, letter, and word spacing not clip or hide functionality. [WCAG Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing)

## Mobbin evidence must not be overstated

Mobbin’s public mobile catalogue identifies full-screen overlays, toolbars, bottom sheets, sharing, and upload/download flows as real shipped mobile patterns. However, its public unauthenticated index did not expose a verifiable Claude or Kimi file-viewer screen during this pass. Therefore, no screen-specific accessibility behavior should be attributed to either app from Mobbin without a captured screen URL and version. [Mobbin mobile catalogue](https://mobbin.com/explore/mobile), [Mobbin API search format](https://docs.mobbin.com/api/quickstart)

# 2. Concrete spec contribution a build phase can execute

## Viewer state machine

| State | Visible behavior | Programmatic behavior |
|---|---|---|
| Closed | Inline file card with name, type, size/status and preview affordance | One semantic `Button`; accessible name: “Open preview, {filename}, {localized type}, {localized size}” |
| Opening | Full-screen parchment surface; static progress label | Mount React Aria `ModalOverlay` + `Modal` + `Dialog`; background inert; focus viewer heading |
| Loading | “Loading preview…”; Close remains available | `aria-busy="true"` on content region; one polite status announcement, no repeated percentages unless meaningful |
| Ready—text/code | Semantic document or `<pre><code>`; wrap control | Heading hierarchy retained; line numbers `aria-hidden`; source available as one logical reading stream |
| Ready—image | Fit-to-screen image, metadata, zoom controls | Trusted alt text only; otherwise explicit “description not provided” |
| Ready—PDF safe | Painted pages plus safe text/structure and links | Page containers labeled “Page N of M”; Document Text mode available |
| Ready—PDF unsafe/scanned | Painted pages only; accessible-text warning | Never construct a selectable/AT text layer; warning connected to viewer heading |
| Redacted | Stable placeholder matching relay output | Concealed characters absent from DOM, canvas metadata, clipboard, accessible names, logs, and shared file |
| Unsupported | File metadata and explanatory empty state | “Preview unavailable for {type}”; Share/Download only if policy permits |
| Share pending | System share sheet | Viewer remains mounted; no custom modal above the share sheet |
| Share complete/cancelled | Return to same viewport and focus | Polite success only; cancellation is not announced as an error |
| Recoverable error | Error, Retry, Close | Error summary receives `role="alert"` once; focus remains stable |
| Revoked/expired | “Preview no longer available” and Close | No retry that silently refetches a broader resource; clear cached blob immediately |

## Layout and visual requirements

- Use `100dvh` with safe-area padding via `env(safe-area-inset-top/right/bottom/left)`. The body and chat must not scroll while the viewer is open. Apple recommends respecting safe areas, Dynamic Island, orientation, Dynamic Type, and locale-driven length/direction changes. [Apple layout](https://developer.apple.com/design/human-interface-guidelines/layout)

- Header order in logical DOM: Close, title region, Share. At large text sizes, title occupies its own row; Close and Share remain 44×44 controls.

- Content begins below the sticky header with `scroll-padding-block-start` equal to the header height, preventing keyboard focus from being hidden behind it. [WCAG Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)

- Focus style: at least a 2 CSS-pixel carbon outline with 2-pixel offset in light mode and a bone outline in dark mode. Clay may appear inside it but cannot be the sole focus indicator.

- Dark and light themes must independently pass contrast checks. Syntax highlighting, diff indicators, links, and PDF annotations cannot communicate meaning by hue alone.

## Gestures and controls

- Tap file card: open.
- Close button, `Escape`, browser-history close where safely integrated: close.
- Optional swipe down: close only after a deliberate threshold; Close button always remains.
- Pinch: zoom image/PDF.
- Double tap: toggle Fit and 100%.
- Explicit Zoom In, Zoom Out, Fit controls: always available to pointer, keyboard, Switch Control, Voice Control, and VoiceOver.
- Previous/Next PDF page buttons: always available; do not require horizontal swiping.
- All controls: minimum 44×44 hit target and concise localized visible or accessible label.

## Focus and VoiceOver contract

1. Activating a card records the trigger element and chat scroll offset.
2. Opening makes background content inert and focuses the visible `<Heading slot="title" tabIndex={-1}>`.
3. VoiceOver announces: “{filename}, file preview, dialog.”
4. Swipe order is Close → title/metadata → Share → renderer controls → content.
5. The viewer contains a visible Close button and traps keyboard focus.
6. Closing restores focus to the originating card without changing chat scroll. If virtualization removed it, restore to the containing message heading or nearest surviving file card.
7. Page changes, wrap changes, share completion, and retry completion use one atomic polite status message.
8. Repeated PDF render events, zoom-frame updates, and image tile loads are never live-announced.

## Motion

- Default opening: opacity plus at most 8 CSS pixels of vertical movement, 180–220 ms, no spring or scale bounce.
- Default closing: 140–180 ms.
- Under `prefers-reduced-motion: reduce`: remove translation, scale, spring, backdrop blur animation, shimmer, and animated zoom; open/close immediately or with a nonessential opacity change no longer than 100 ms.
- Gesture-following movement may track the finger directly, but must not bounce after release. Apple recommends replacing axis and depth transitions with fades and reducing repetitive, zoom, and blur motion. [Apple accessibility motion](https://developer.apple.com/design/human-interface-guidelines/accessibility), [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

## Localization and typography implementation

- Place all interface strings in message resources with named parameters and plural/select rules.
- Wrap the application in `I18nProvider`; set root `lang` and `dir`.
- Use `Intl.NumberFormat`, `Intl.DateTimeFormat`, and `Intl.ListFormat` for metadata.
- Never concatenate page counts, sizes, error fragments, or filename sentences.
- Apply script-aware fallbacks while retaining Inter/Source Serif 4 for supported scripts.
- Use `rem` for font and control-label metrics; test the iOS Dynamic Type bridge in installed standalone mode.
- Use logical CSS exclusively in viewer shell code.
- Isolate paths and filenames with `<bdi>`; retain code/source direction independently of UI direction.

## Pass/fail acceptance matrix

The build passes only if all of the following succeed:

- VoiceOver can open, inspect, share, and close every renderer without sighted assistance.
- Focus never enters chat while open and returns to the triggering file after close.
- Close and Share remain available at 200% text, 320 CSS-pixel width, portrait, and landscape.
- No non-code body content requires horizontal scrolling at 320 CSS pixels.
- Text-spacing overrides from WCAG 1.4.12 cause no clipping or overlap.
- Every target is at least 44×44 CSS pixels.
- Light and dark text pairs pass 4.5:1; interactive boundaries and focus indicators pass 3:1.
- Clay on bone is never the sole text, boundary, focus, or status signal.
- Reduce Motion produces no translation, scale, spring, shimmer, or animated zoom.
- Arabic RTL mirrors the shell while paths, hashes, URLs, code, and images preserve correct ordering.
- Pseudo-locales `en-XA` and `ar-XB`, German, Arabic, Japanese, and a 256-character filename cause no lost action or inaccessible truncation.
- A redaction fixture’s concealed marker string is absent from DOM text, accessibility snapshots, clipboard output, generated share file, logs, and cached storage.
- An unsafe PDF fixture produces no text layer; a safe tagged PDF exposes reading order, links, and page labels.
- Share capability failure yields a labeled download fallback.
- Automated accessibility tests report no serious violations, followed by manual testing in iPhone Safari and installed-PWA mode with VoiceOver, Larger Text, Reduce Motion, light/dark appearance, hardware keyboard, and landscape.

# 3. Divergent / minority ideas worth considering

## Make “Accessible text” a first-class renderer, not a fallback

For PDFs and syntax-highlighted code, expose a persistent View selector: **Visual / Accessible text**. This is more explicit than hoping a canvas text layer produces usable reading order. It also gives low-vision users a reflowable, high-contrast reading mode without changing the visual preview for sighted reviewers.

## Treat invisible Unicode as review-critical content

Source code can use bidirectional control characters to display tokens in a different order from their logical compilation order. Add an always-on warning when bidi controls or suspicious invisible characters are present, plus a “Show invisible characters” toggle that renders labeled tokens such as `U+202E`. Do not silently normalize or reorder the source. Trojan Source demonstrated this vulnerability across JavaScript, Python, Bash, SQL, and other coding languages and code viewers. [Trojan Source paper and repository](https://github.com/nickboucher/trojan-source)

## Prefer page controls over a native-feeling swipe pager

A horizontal PDF pager may look closer to a native media gallery, but it collides with VoiceOver swipes, RTL page-direction expectations, text selection, and zoom panning. A vertical document with explicit Previous/Next and page-number controls is less fashionable but more predictable.

## Offer a distraction-free reading mode without making it the default

Allow the toolbar to collapse after a deliberate “Hide controls” action, but never auto-hide it on a timer. Apple warns that timed dismissals can be problematic for users who need more time or traverse interfaces using assistive technologies. [Apple accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)

## Never publish an artifact merely to share it

Claude-style public artifact URLs are convenient, but they conflict with Pi Remote’s private-tailnet posture. Sharing the already-redacted file through the local iOS share sheet is safer and more understandable than minting a URL, even if URL sharing appears more “artifact-like.”

# 4. Open questions + risks

1. **What is the relay’s redaction contract for PDFs?** The UI needs a trustworthy distinction between destructively sanitized bytes and cosmetic visual redaction. Without it, selectable PDF text must fail closed.

2. **Does the relay supply image descriptions or document language?** Filenames are not adequate alt text, and automatic remote captioning would expand the disclosure boundary.

3. **Are generated HTML/SVG artifacts in scope?** Executing arbitrary HTML is materially different from previewing text, images, or PDFs. If included, it needs a sandboxed, network-disabled origin and a separate accessibility/security review.

4. **Does “Share” mean exact file bytes, rendered snapshot, or both?** The default should be exact safe bytes. A rendered snapshot needs an explicit label because it may lose selectable text and accessibility metadata.

5. **Can expired previews remain cached offline?** Blob URLs, service-worker caches, IndexedDB, recent-preview thumbnails, and iOS share temporaries must follow the ticket expiry/redaction policy.

6. **How reliably does iOS Dynamic Type propagate to an already-running installed PWA?** WebKit documents Dynamic Type font values, but standalone-mode behavior and live setting changes need device verification across the supported iOS range.

7. **What scripts must the first release support?** Inter and Source Serif 4 do not cover all scripts consistently. Arabic, Hebrew, CJK, Indic, and Southeast Asian fallbacks need an approved typography matrix.

8. **Can PDF.js preserve tagged-PDF structure and reading order for the supported Safari versions?** Its Safari support is described as “mostly” supported, with defects possible; Pi Remote needs representative tagged, untagged, scanned, form, and malformed fixtures. [PDF.js browser support](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions)

9. **How should virtualized chat restore focus?** If file cards unmount while the modal is open, the chat implementation needs stable message IDs and a deterministic fallback target.

10. **Mobbin reference gap:** a versioned Claude or Kimi file-viewer capture remains necessary before claiming pixel-level parity. The current public Mobbin catalogue supports pattern discovery but did not expose a verifiable target screen for this flow.

# 5. Sources

- [Apple Human Interface Guidelines — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Apple Human Interface Guidelines — VoiceOver](https://developer.apple.com/design/human-interface-guidelines/voiceover)
- [Apple Human Interface Guidelines — Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [Apple Human Interface Guidelines — Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [Apple Human Interface Guidelines — Color](https://developer.apple.com/design/human-interface-guidelines/color)
- [Apple Human Interface Guidelines — Activity views](https://developer.apple.com/design/human-interface-guidelines/activity-views)
- [WebKit — Using the System Font in Web Content](https://webkit.org/blog/3709/using-the-system-font-in-web-content/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WAI modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WCAG — Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [WCAG — Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing)
- [WCAG — Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
- [WCAG — Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- [WCAG — Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG — Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)
- [WCAG — Minimum Contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
- [WCAG — Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast)
- [W3C Images Tutorial](https://www.w3.org/WAI/tutorials/images/)
- [W3C — Structural markup and RTL text](https://www.w3.org/International/questions/qa-html-dir)
- [React Aria — Modal](https://react-aria.adobe.com/Modal)
- [React Aria — `useModalOverlay`](https://react-aria.adobe.com/Modal/useModalOverlay)
- [React Aria — FocusScope](https://react-aria.adobe.com/FocusScope)
- [React Aria — I18nProvider](https://react-aria.adobe.com/I18nProvider)
- [React Aria — `useLocale`](https://react-aria.adobe.com/useLocale)
- [MDN — Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)
- [MDN — `navigator.canShare`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare)
- [MDN — `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [PDF.js](https://github.com/mozilla/pdf.js)
- [PDF.js getting started and viewer architecture](https://mozilla.github.io/pdf.js/getting_started/)
- [Claude — What are artifacts?](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them)
- [Claude — Create and edit files](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude)
- [Kimi on the App Store](https://apps.apple.com/ca/app/kimi-%E6%99%BA%E8%83%BD%E5%8A%A9%E6%89%8B-%E5%85%A8%E8%83%BDai%E8%81%8A%E5%A4%A9%E9%97%AE%E7%AD%94%E5%8A%A9%E6%89%8B/id6474233312)
- [Mobbin mobile catalogue](https://mobbin.com/explore/mobile)
- [Mobbin API search documentation](https://docs.mobbin.com/api/quickstart)
- [OpenCodex](https://github.com/mjmkk/opencodex)
- [Happy](https://github.com/slopus/happy)
- [Claude Code Viewer](https://github.com/d-kimuson/claude-code-viewer)
- [HAPI](https://github.com/tiann/hapi)
- [Trojan Source](https://github.com/nickboucher/trojan-source)
- [Inter](https://github.com/rsms/inter)
- [Source Serif](https://github.com/adobe-fonts/source-serif)
