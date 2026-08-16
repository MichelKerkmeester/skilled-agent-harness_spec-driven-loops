<!-- provenance: external-CLI orchestration pass; original file iter-02-sol.md -->
> **Source pass 2** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-2-sol.md`.

<!-- F6-file-preview | model=sol | lens=interaction-gesture | iter 2/10 | 2026-08-15T19:51:36.518Z -->

# Interaction and gesture research report — iteration 2 of 10

## 1. Findings for the interaction-gesture lens

### A full-screen modal is the correct iPhone translation of the desktop artifact pane

Claude’s desktop artifact pattern preserves chat beside a dedicated artifact surface, but iPhone lacks room for a useful split view. Apple recommends full-screen modal presentation for focused document, photo, and media viewing, with an obvious toolbar dismissal control and, where appropriate, swipe-down dismissal. Claude’s mobile team has likewise described artifacts as opening in a separate window with system sharing, while Kimi exposes explicit preview, full-screen, share, and close actions in its artifact chrome. [Apple HIG: Modality](https://developer.apple.com/design/human-interface-guidelines/modality), [Apple HIG: Going full screen](https://developer.apple.com/design/human-interface-guidelines/going-full-screen), [Claude mobile artifact announcement](https://www.reddit.com/r/ClaudeAI/comments/1f2o0gj), [Kimi Websites preview interface](https://www.kimi.com/help/websites/websites-overview)

The viewer should therefore be a full-screen modal takeover—not a bottom drawer pretending to be a document reader. It must preserve the exact chat scroll position and return focus to the originating file card when closed.

### The entire file card should be the primary preview target

Apple’s default iOS control size is 44×44 pt, while WCAG 2.2 AA requires at least 24×24 CSS px or sufficient spacing. For a frequently used, one-handed chat action, the implementation target should be at least 44×44 CSS px, ideally a 56 px-high card row. [Apple HIG: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility/), [WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

Use a semantic React Aria `Button` or `Pressable`, not an `onClick` on a generic card. React Aria’s `onPress` normalizes touch, mouse, and keyboard activation; activation on release also lets a user cancel by moving their finger away before lifting. [React Aria Button](https://react-spectrum.adobe.com/react-aria/Button.html), [WCAG pointer cancellation](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation)

### Gesture ownership must change by renderer

A universal “swipe anywhere” model would collide with essential content gestures:

- Code needs vertical and horizontal scrolling plus native text selection.
- PDFs need vertical scrolling, text selection, page navigation, and zoom.
- Images need pinch zoom and panning.
- iOS reserves screen edges and top/bottom regions for system navigation.
- `touch-action: none` on a broad ancestor can inhibit browser zoom and should never be applied to the modal root. [Apple HIG: Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures), [MDN: `touch-action`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action)

Consequently, swipe-down dismissal should begin only from a dedicated grabber/toolbar region. Do not recognize dismissal drags from the document body. Horizontal swiping between files should not ship in the first build: it conflicts with code scrolling and zoomed-image panning, and edge-only variants conflict with iOS navigation.

### Long-press is appropriate for secondary actions, not for opening

Apple associates touch-and-hold with revealing additional functionality. React Aria provides a normalized long-press interaction with a 500 ms default threshold, cancellation after pointer movement, context-menu suppression, and an accessibility description—but explicitly requires a keyboard-accessible alternative. [Apple HIG: Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures), [React Aria `useLongPress`](https://react-spectrum.adobe.com/react-aria/useLongPress.html)

Use tap for preview. Use a 500 ms long-press on the chat card for the same menu exposed by a visible 44×44 “More” button. Never override long-press inside text, code, or PDF text layers; there it must remain available for native selection and copying.

### React Aria should own modality and focus containment

The viewer maps directly to React Aria’s `ModalOverlay` → `Modal` → `Dialog` structure. React Aria exposes entering/exiting states, blocks outside interaction, supports Escape dismissal, and supplies visual-viewport dimensions useful around the iOS keyboard. WAI requires focus to remain inside a modal and return to its invoker after closing. For a large structured document, WAI recommends initially focusing a static heading rather than making a screen reader consume the entire document as one description. [React Aria Modal](https://react-spectrum.adobe.com/react-aria/Modal.html), [WAI modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

Use `aria-modal="true"` and an accessible title. Omit `aria-describedby` for the renderer because code, Markdown, and multipage documents are too structurally complex to announce as a single description.

### Native feel comes from immediate, interruptible feedback

Apple recommends brief, precise motion that follows the user’s gesture, can be interrupted, and does not add waiting to frequent actions. Reduced Motion should replace large translations and scaling with a short opacity transition. [Apple HIG: Motion](https://developer.apple.com/design/human-interface-guidelines/motion), [Apple reduced-motion criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria), [MDN: `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)

The important micro-interactions are therefore:

- Immediate pressed state on touch-down.
- Activation only on release.
- Viewer chrome available before content finishes decoding.
- Dragged modal tracking the finger 1:1.
- Cancelable dismissal.
- Preserved document and chat positions.
- No decorative bouncing, parallax, or delayed toolbar reveal.

### Safe areas and scroll containment are functional requirements

A Home Screen PWA using `viewport-fit=cover` must apply `env(safe-area-inset-*)` to interactive chrome so the toolbar is not obscured by the sensor housing or Home indicator. React Aria exposes visual-viewport sizing, and the browser’s visual viewport can shrink independently of the layout viewport during keyboard display or page zoom. [WebKit: Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/), [MDN: VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport), [React Aria Modal](https://react-spectrum.adobe.com/react-aria/Modal.html)

The document scroller should use `overscroll-behavior: contain` to stop scroll chaining into the chat. This property has compatibility qualifications, so the implementation must also lock the underlying chat scroll and restore its saved position on close. [MDN: `overscroll-behavior`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overscroll-behavior)

### Sharing must be prepared before the user taps

Apple places sharing in document toolbars. On the web, `navigator.share()` requires HTTPS, supported share data, and transient user activation. `navigator.canShare()` should be checked first. [Apple HIG: Collaboration and sharing](https://developer.apple.com/design/human-interface-guidelines/collaboration-and-sharing), [MDN: Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)

Prepare the `File` or `Blob` from the already-redacted relay payload before enabling Share. The Share press must call `navigator.share()` directly; fetching or transforming after the press risks losing transient activation. Never share a relay URL, access ticket, original host path, or unredacted source.

### Existing agent clients establish the minimum credible behavior

The open-source OpenCode iOS client already advertises Markdown preview, image zoom/pan, code with line numbers, a file browser, and session diffs. MindFS similarly ships dedicated Markdown, image, and code renderers. Kimi Code added a dedicated full-screen viewer rather than expanding long file content inline. These precedents show that “styled diff cards only” is below the mobile coding-client baseline. [OpenCode iOS client](https://github.com/grapeot/opencode_ios_client), [MindFS](https://github.com/a9gent/mindfs), [Kimi Code changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)

PDF.js is a suitable web-native baseline because it accepts raw `Uint8Array` data, supports a complete viewer, and avoids requiring the document to be exposed at a routable URL. [Mozilla PDF.js](https://github.com/mozilla/pdf.js), [PDF.js FAQ](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions)

## 2. Concrete specification contribution

### Surface structure

```text
Chat message
└── File card group
    ├── Preview button: icon + safe filename + type/size/status
    └── More button

Full-screen modal
├── Safe-area top
├── Dismiss grabber
├── Toolbar
│   ├── Close
│   ├── Title + metadata
│   ├── Share
│   └── More
├── Status/banner region
├── Renderer viewport
└── Renderer-specific controls
```

Implement the modal using controlled React Aria `ModalOverlay`, `Modal`, and `Dialog`. Do not enable outside-click dismissal; there is no meaningful outside area in the full-screen presentation. Keep Escape dismissal enabled.

### State model

Treat lifecycle, content, modifiers, and sharing as orthogonal state machines.

#### Modal lifecycle

| State | Entry | Required behavior | Exit |
|---|---|---|---|
| `closed` | Initial or dismissal complete | Chat remains interactive | File-card press |
| `entering` | File-card activation | Lock chat scroll; push one local history state; render dialog chrome immediately | After 180 ms, or immediately under Reduced Motion |
| `open` | Entry complete | Trap focus; renderer owns content interaction | Close, Escape, history back, or committed dismiss drag |
| `exiting` | Dismissal requested | Ignore duplicate close requests; revoke renderer interaction | After 160 ms, or immediately under Reduced Motion |
| `closed` | Exit complete | Restore chat scroll and card focus; revoke object URLs | — |

#### Content state

| State | UI | Allowed actions |
|---|---|---|
| `idle` | Empty renderer before request starts | Close |
| `loading` | Filename, type, skeleton, “Loading preview” status | Close |
| `ready:image` | Contained image and zoom controls | Zoom, pan, share, close |
| `ready:pdf` | Continuous page-width document | Scroll, select, search, zoom, share, close |
| `ready:text` | Selectable formatted text | Scroll, select, search, share, close |
| `ready:code` | Selectable highlighted code with line numbers | Scroll both axes, select, search, wrap toggle, share, close |
| `unsupported` | Generic file presentation with type/size | Share exact relay payload if policy allows; close |
| `error-retryable` | Error explanation and Retry | Retry, close |
| `error-terminal` | “Preview unavailable” explanation | Close |
| `revoked` | Content immediately removed from DOM | Close only |

Use modifiers rather than duplicating ready states:

- `redacted`: persistent “Relay-redacted preview” banner.
- `truncated`: persistent “Preview limited to received content” banner.
- `stale`: “New revision available” banner with `View latest`.
- `offline`: retain an already-open in-memory snapshot, but disable Retry and View latest.
- `share-disabled`: explain the policy or platform limitation in the More menu.

#### Required transitions

| Event | From | To |
|---|---|---|
| File-card release inside target | `closed` | `entering` + `loading` |
| Payload decoded and renderer supported | `loading` | Matching `ready:*` |
| Payload received but renderer unsupported | `loading` | `unsupported` |
| Recoverable transport/decode failure | `loading` | `error-retryable` |
| Explicit access revocation | Any open content state | `revoked`; purge bytes, canvases, text, and object URLs |
| New revision event | Any `ready:*` | Same state + `stale` |
| `View latest` | `ready:* + stale` | `loading`; preserve old snapshot until replacement passes validation |
| Generic disconnect after ready | `ready:*` | Same state + `offline` |
| Close/Escape/history back | Any open state | `exiting` |
| Dismiss drag below threshold | `open` | `open`; animate back |
| Dismiss drag past threshold | `open` | `exiting` |

Do not auto-replace an open file with a newer revision: that would move text under the user’s finger, destroy selection, and change what Share exports without explicit consent.

### File-card interaction

- Minimum card height: 56 px.
- Minimum primary button and More target: 44×44 CSS px.
- Card activation: React Aria `onPress`.
- Press feedback begins immediately: carbon border darkens and card scales to `0.985`.
- If the finger leaves the target before release, cancel activation and restore the card.
- Long-press threshold: 500 ms.
- Long-press menu and More menu contain the same actions:

  1. Preview
  2. Share, only if prepared and permitted
  3. Copy filename
  4. Copy safe display path, only when that path was explicitly supplied by the relay

- Once long-press commits, suppress the subsequent normal press.
- Never place the More button inside the preview button; use sibling controls within a grouped card.

Accessible card name:

> “Preview `filename`, PNG image, 842 kilobytes, relay-redacted.”

The visible filename must appear verbatim in the accessible name so Voice Control can target it.

### Toolbar and dismissal

- Total toolbar block: safe-area top inset + 56 px.
- Close, Share, and More each receive 44×44 px targets.
- Filename is single-line and middle-truncated visually; the full safe filename remains in the accessible title.
- Close uses the familiar close symbol and `aria-label="Close preview"`.
- Share uses `aria-label="Share filename"`.
- A 36×5 px grabber appears above the toolbar.

Dismiss drag recognition:

1. Gesture must begin on the grabber strip or noninteractive toolbar background.
2. Do not claim the gesture until vertical movement exceeds 12 px and is greater than horizontal movement.
3. Track downward movement 1:1; clamp upward movement to 8 px.
4. Fade the underlying scrim proportionally, but never below 40% before commitment.
5. Commit when downward travel exceeds 28% of the visual viewport or velocity exceeds `0.8 px/ms`.
6. Otherwise return to rest within 180 ms.
7. `pointercancel`, a second pointer, or orientation change cancels the drag.
8. The Close button, Escape key, and browser/history back remain equivalent alternatives.

This keeps content scrolling and text selection independent from dismissal, while following Apple’s expectation that modal media can be closed from a top control or vertical swipe. [Apple HIG: Modality](https://developer.apple.com/design/human-interface-guidelines/modality)

### Gesture arbitration

| Priority | Region/condition | Gesture ownership |
|---:|---|---|
| 1 | Text, code, or PDF text layer | Native selection and context menu |
| 2 | Image with two active pointers | Image zoom |
| 3 | Image zoomed above fit scale | Image pan |
| 4 | Renderer scroll container | Document scrolling |
| 5 | Grabber/empty toolbar only | Modal dismissal |
| 6 | File card | Press or long-press |

Do not implement global horizontal file paging in phase one. If multiple files belong to one artifact, expose 44×44 Previous and Next buttons with an “N of M” label.

### Image renderer

- Initial scale: contain image within available viewport; never upscale above 1× unless the user zooms.
- Pinch range: fit scale through 4× intrinsic scale.
- Double tap: fit → 2× around the tapped point; second double tap → fit.
- One-finger pan activates only above fit scale.
- Pan is bounded so at least 48 px of image remains visible on each occupied axis.
- Dismiss drag remains available only from the toolbar.
- Show persistent 44×44 Zoom out, Reset/Fit, and Zoom in controls. This supplies a single-pointer alternative to pinch, as required for multipoint gesture functionality. [WCAG pointer gestures](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures)
- Apply custom `touch-action` only to the image stage, never the dialog or application root.
- Render a real `<img>`. Prefer relay-supplied alternative text; otherwise use “Preview of filename,” without inventing a semantic description.

### PDF renderer

- Feed PDF.js raw bytes rather than a remotely fetchable file URL.
- Default layout: continuous vertical scrolling, page-width zoom.
- Show current page and total pages in a status control, for example “3 of 18.”
- Provide 44×44 Zoom out, Fit width, Zoom in, Previous page, and Next page controls.
- Preserve PDF text-layer selection and links.
- Tapping an external link requires a confirmation surface showing the sanitized destination host before leaving Pi Remote.
- Search opens inside the viewer; do not depend on browser chrome that may be absent in standalone PWA mode.
- Large PDFs render visible and adjacent pages progressively rather than painting every page at full resolution. PDF.js itself warns against rendering all pages at high resolution. [PDF.js FAQ](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions)

### Text and code renderers

- Use actual DOM text, never canvas-rendered code.
- Vertical scroll is the outer renderer scroll.
- Code has an inner horizontal scroll region when wrapping is off.
- Long-press remains native selection.
- Line numbers are `aria-hidden` and excluded from copied text.
- More menu contains `Wrap lines`, `Find`, and `Copy all received content`.
- Changing wrap preserves the first visible logical line.
- `Copy all` copies only the received/redacted payload and announces completion through the shared polite status region.
- At `stale`, current selection and scroll position remain untouched until `View latest` is pressed.

### Keyboard behavior

- `Enter` or `Space`: activate focused buttons through React Aria.
- `Tab` / `Shift+Tab`: cycle within the modal.
- `Escape`: close an open menu first; a second Escape closes the viewer.
- `Command+F`: open in-view search for text, code, and PDF.
- `+` or `=`: zoom in when renderer—not a text field—has focus.
- `-`: zoom out.
- `0`: return to fit.
- `Page Up` / `Page Down`: PDF page movement.
- `Home` / `End`: beginning/end of text, code, or PDF.
- Do not capture plain Left/Right arrows for file changes; they remain available for code scrolling, selection, and assistive technology.

### Focus and VoiceOver order

On open:

1. Focus the modal’s visible `h1` using `tabindex="-1"`.
2. Announce title, type, redaction/truncation status, and “dialog.”
3. First Tab lands on Close.

Sequential order:

1. Close
2. Share
3. More
4. Status-banner action, such as View latest
5. Renderer controls
6. Renderer links or interactive document content

On close, restore focus to the exact originating file card. If streaming or virtualization removed it, move focus to the containing chat message heading; if that is also absent, focus the chat transcript.

Loading, ready, copied, page-change, and failure messages use a pre-existing `role="status"`/`aria-live="polite"` region and do not steal focus. [WAI live-region technique](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA25)

Use a two-color focus treatment: a 2 px carbon/bone outline plus a 2 px clay outer halo. Do not rely on clay alone against bone, because the focus indicator must remain perceptible at sufficient contrast. [WCAG focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)

### Share interaction

Share substate:

| State | Behavior |
|---|---|
| `preparing` | Construct sanitized `File`; Share remains unavailable |
| `ready` | `navigator.canShare({files})` passed |
| `fallback-only` | More menu offers Copy or Save instructions |
| `invoking` | Call `navigator.share()` directly from the press handler |
| `returned` | Viewer remains open; announce “Share sheet closed” |
| `aborted` | Return silently to `ready` |
| `failed` | Nonmodal error status; retain retry |

If the payload is marked redacted or truncated, encode that state in the shared filename or an accompanying text field. Do not imply the exported file is complete.

### Motion and visual behavior

Normal motion:

- Card press: 80 ms.
- Modal entry: 180 ms, opacity `0→1`, translate Y `12 px→0`.
- Modal exit: 160 ms reverse.
- Scrim: carbon at 35% in light mode and 55% in dark mode.
- Dismiss drag: direct manipulation with no easing while the pointer is down.
- Failed dismiss: 180 ms ease-out return.
- Toolbar button response: immediate pressed fill using the clay accent at a contrast-safe opacity.

Reduced Motion:

- No card scaling.
- No modal translation, zoom, or spring.
- 100 ms opacity transition only.
- Drag dismissal remains functional but the modal does not scale or produce depth effects.

### PWA viewport behavior

- Use `viewport-fit=cover`.
- Modal height follows React Aria’s `--visual-viewport-height` or `100dvh`, with a tested fallback.
- Toolbar padding includes `env(safe-area-inset-top)`.
- Bottom controls include `env(safe-area-inset-bottom)`.
- Landscape padding includes left and right safe-area insets.
- Underlying chat body is position-locked while open; save and restore its exact scroll offset.
- Renderer uses `overscroll-behavior: contain`.
- Rotation preserves filename, renderer state, page/line position, and zoom where geometrically possible; otherwise clamp zoom and announce “Preview fit to new orientation.”

### Objective build checks

- Every visible control measures at least 44×44 CSS px on an iPhone viewport.
- Card activation fires only on pointer release inside the target.
- Long-press opens the same commands as More and never also opens the file.
- Native selection still works in text, code, and PDF text layers.
- Dismiss dragging cannot begin in the document body.
- At image zoom above fit, one-finger movement pans and never changes file.
- Every pinch, drag, or long-press function has an onscreen single-tap alternative.
- Tab never escapes the dialog; Escape closes it; closing restores trigger focus.
- VoiceOver announces filename, type, redaction/truncation state, control labels, and loading/error changes.
- Reduced Motion produces no scaling or large-axis translation.
- Chat scroll position is pixel-identical before opening and after closing.
- Preview opening causes no network request other than the authorized relay payload.
- Share-file bytes equal the received sanitized payload.
- Explicit revocation removes text, canvases, blobs, and object URLs before the next animation frame.
- Test in Safari and installed standalone mode, portrait and landscape, with iPhone SE-class and sensor-housing viewports.

## 3. Divergent or minority ideas worth considering

### Press-and-hold “peek”

A file card could reveal a temporary, noninteractive preview while held, disappearing on release. This would make fast inspection unusually efficient and aligns with up-event reversal under WCAG pointer cancellation. It should remain experimental because it competes with the more conventional long-press action menu and has no natural VoiceOver equivalent. [WCAG pointer cancellation](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation)

### A half-height reading detent before full screen

Small text artifacts could first open in a near-full-height sheet that preserves visible chat context, with a clear Expand control. Apple supports sheet detents and grabbers, but recommends full-screen presentation for prolonged documents and media. This option is best restricted to short plain-text outputs, never PDFs or zoomable images. [Apple HIG: Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets)

### A one-handed image loupe

Instead of requiring two-finger zoom, touch-and-hold on an image could open a movable magnifying lens. This would help users operating the phone with one hand. It must coexist with permanent zoom buttons and cannot replace pinch zoom.

### No swipe-to-dismiss at all

A conservative PWA variant would use only Close, Escape, and history back. This sacrifices some iOS familiarity but eliminates gesture competition, pull-to-refresh interactions, and WebKit edge cases. It is worth A/B testing against the grabber-only implementation.

### Revision “filmstrip” rather than latest-only replacement

If the relay supplies multiple authorized revisions, expose a horizontal revision strip below the toolbar. Selecting a revision is explicit and never overwrites the current reading position. This would exceed Claude-style viewing by making temporal provenance visible, but it increases cognitive load and must not imply that unavailable revisions can be fetched.

### Redaction as provenance, not merely a warning

Make “Relay-redacted snapshot” a tappable metadata disclosure showing revision, received timestamp, truncation state, and allowed export behavior. This turns the security boundary into understandable document provenance rather than a generic caution banner.

## 4. Open questions and risks

1. **Relay schema:** Does each payload include sanitized filename, safe display path, MIME type, byte count, revision, redaction status, truncation status, and revocation events? Gesture and state behavior depends on these being explicit rather than inferred.

2. **Share policy:** Is sharing always allowed for already-delivered content, or can the relay mark a preview viewable but nonexportable? The UI must not equate “readable” with “shareable.”

3. **Disconnected snapshots:** May an already-rendered in-memory preview remain visible after Tailscale or relay disconnection? The proposed behavior preserves it unless an explicit revocation arrives, but policy may require immediate purge.

4. **Persistence:** Can the service worker, HTTP cache, browser history snapshot, or crash restoration retain preview bytes? If not, responses need `no-store`, and preview object URLs must be memory-only.

5. **PDF semantics:** PDF.js canvas output alone is not an accessible document. The build needs text layers, logical page labels, and real-device VoiceOver verification; malformed or scanned PDFs need a declared fallback.

6. **Object zoom versus browser zoom:** Custom image zoom may require restrictive `touch-action` within the image stage. The team must verify that browser page zoom and iOS system Zoom remain available elsewhere and that the explicit zoom controls reach at least 200%.

7. **External document links:** Opening links can leak that a document was viewed and may leave the private tailnet context. Confirm whether all external navigation requires an interstitial or should be disabled.

8. **Large-file limits:** Maximum bytes, decoded image dimensions, PDF page count, and code-line count need explicit thresholds and corresponding `truncated`, `unsupported`, or `error-terminal` behavior.

9. **HTML/SVG artifacts:** Claude artifacts include interactive sites and graphics, but the desired scope names image, PDF, text, and code. Executable HTML and active SVG should remain unsupported until sandboxing, networking, focus, and gesture containment have separate specifications.

10. **Multi-file membership:** Previous/Next navigation requires an authoritative ordered set. “Files in this message,” “files in this agent turn,” and “all session files” produce different user expectations.

11. **iOS PWA regressions:** Safe-area behavior has had WebKit regressions in Home Screen apps. Real-device checks must be repeated on supported iOS versions rather than inferred from desktop responsive mode. [WebKit safe-area issue](https://bugs.webkit.org/show_bug.cgi?id=236445)

12. **Mobbin evidence gap:** No publicly indexable Claude or Kimi file-preview screen/flow could be verified, and the interactive Mobbin catalog was unavailable in this research environment. No visual claim in this report is therefore attributed to Mobbin; a later pass with authenticated catalog access should capture the exact tap-open-close-share flows.

## 5. Sources

### Apple

- [Human Interface Guidelines: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility/)
- [Human Interface Guidelines: Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures)
- [Human Interface Guidelines: Modality](https://developer.apple.com/design/human-interface-guidelines/modality)
- [Human Interface Guidelines: Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets)
- [Human Interface Guidelines: Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Human Interface Guidelines: Going full screen](https://developer.apple.com/design/human-interface-guidelines/going-full-screen)
- [Human Interface Guidelines: Toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars)
- [Human Interface Guidelines: Collaboration and sharing](https://developer.apple.com/design/human-interface-guidelines/collaboration-and-sharing)
- [Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [WebKit safe-area regression report](https://bugs.webkit.org/show_bug.cgi?id=236445)

### React Aria and web platform

- [React Aria Modal](https://react-spectrum.adobe.com/react-aria/Modal.html)
- [React Aria Button](https://react-spectrum.adobe.com/react-aria/Button.html)
- [React Aria `useLongPress`](https://react-spectrum.adobe.com/react-aria/useLongPress.html)
- [MDN: Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)
- [MDN: VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)
- [MDN: `touch-action`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action)
- [MDN: `overscroll-behavior`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overscroll-behavior)
- [MDN: `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [PhotoSwipe interaction options](https://photoswipe.com/options/)

### Accessibility standards

- [WAI modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WCAG 2.2: Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG 2.2: Pointer Cancellation](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation)
- [WCAG 2.2: Pointer Gestures](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures)
- [WCAG 2.2: Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)
- [WCAG 2.2: Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- [WAI live-region progress technique](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA25)

### Claude and Kimi references

- [Claude: Build artifacts](https://claude.com/blog/build-artifacts)
- [Claude Help: What are artifacts?](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them)
- [Claude mobile artifact announcement](https://www.reddit.com/r/ClaudeAI/comments/1f2o0gj)
- [Kimi Websites feature overview](https://www.kimi.com/help/websites/websites-overview)
- [Kimi Code changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)
- [Kimi Code interaction guide](https://moonshotai.github.io/kimi-code/en/guides/interaction.html)

### Prior art and renderer implementations

- [OpenCode iOS client](https://github.com/grapeot/opencode_ios_client)
- [OpenCode Mobile PWA](https://github.com/newlandjia/opencode-mobile)
- [MindFS](https://github.com/a9gent/mindfs)
- [1Code](https://github.com/21st-dev/1code)
- [Mozilla PDF.js](https://github.com/mozilla/pdf.js)
- [PDF.js FAQ](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions)
