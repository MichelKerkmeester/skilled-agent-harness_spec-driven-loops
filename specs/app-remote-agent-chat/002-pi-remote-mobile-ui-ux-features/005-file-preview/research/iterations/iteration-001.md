<!-- provenance: external-CLI orchestration pass; original file iter-01-sol.md -->
> **Source pass 1** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-1-sol.md`.

<!-- F6-file-preview | model=sol | lens=competitive-teardown | iter 1/10 | 2026-08-15T19:46:08.962Z -->

# 1. Findings for the competitive-teardown lens

_Research snapshot: 15 August 2026. “Documented” means supported by an official source; “observed” means visible in a cited screen or implementation. Mobbin’s public chat gallery exposes app names and interaction-pattern tags, but individual high-resolution flows require authentication, so inaccessible details are not inferred._

## Competitive matrix

| Product | In-chat representation | Opened surface and sequence | Actions and constraints | Implication for Pi Remote |
|---|---|---|---|---|
| **Claude iOS** | Substantial standalone output becomes an artifact; Anthropic describes artifacts as typically over 15 lines and supporting documents, code, HTML, SVG, diagrams, and React components. | Tap the artifact/code surface → a dedicated artifact window separate from chat. Mobile supports formatted code with syntax highlighting and interactive HTML/JS artifacts. | Copy and export through the iOS share sheet; artifacts are versioned. An Anthropic mobile engineer specifically listed code selection, copying, and system-share export as mobile features. [Anthropic announcement](https://www.anthropic.com/news/artifacts), [artifact documentation](https://support.anthropic.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them), [mobile-engineer launch post](https://www.reddit.com/r/ClaudeAI/comments/1f2o0gj/artifacts_now_available_in_claude_ios_android_apps/) | Closest interaction model: lightweight card in chat, dedicated viewing context, native sharing. Pi should improve on Claude by using the whole iPhone viewport and keeping dismissal obvious; mobile users report cramped or unreliable artifact viewing. |
| **Kimi / Kimi Code ecosystem** | Generated websites and presentations end with named result/version cards. Website cards include site name, version such as `V2`, and URL; an **All Files** card exposes the project files. Slides use a card explicitly prompting the user to tap to preview. | Card → preview/editor. Website preview exposes, in order: Preview/Code, Edit, Publish, Share, Full screen, device-mode switch, Refresh, Feedback, Close. Version cards reopen exact revisions. On mobile, users enter Websites, Docs, or Slides from the toolbar above/below the composer. | Mobile Slides exposes **Export** to other apps. Kimi handles PDF, Word, Excel, PPT, images, text, and video, up to 100 MB each and 50 files per session. [website viewer](https://www.kimi.com/help/websites/websites-overview), [Slides card and export flow](https://www.kimi.com/help/slides/ppt-stuck), [mobile/file limits](https://www.kimi.com/help/getting-started/overview) | Best prior art for explicit revision identity and a Preview/Code switch. Do not copy its overfilled toolbar: Pi only needs Close, title/revision, Share, and renderer-specific controls. |
| **ChatGPT iOS** | The publicly indexed Mobbin screen shows an attached PDF as a compact composer attachment before the prompt is sent. Mobbin categorizes ChatGPT’s mobile chat screens under Uploading & Downloading, toolbar, buttons, and selection patterns. | The visible flow is attachment-first rather than artifact-first: choose a file in the system picker, return to the composer with a named PDF chip, then send the prompt. The publicly documented/mobile-observable experience does not establish one consistent full-screen viewer for code, text, PDFs, and images. | ChatGPT’s strength is low-friction attachment and familiar system-file selection; its weakness for this benchmark is fragmentation between uploaded files, generated downloads, images, and Canvas-like content. [Mobbin Chat Bot gallery](https://mobbin.com/explore/mobile/screens/chat-bot) and [Mobbin PDF attachment screen](https://mobbin.com/explore/mobile/screens/chat-bot) | Copy the compact, tappable file card—not the fragmented viewer model. A single Pi preview shell should handle every renderer. |
| **Perplexity** | Generated documents, spreadsheets, presentations, and HTML apps are treated as first-class “assets.” | Generation automatically opens a preview; the documented desktop pattern is side panel → **Expand** → full screen. The same assets can be previewed on mobile. Follow-up prompts create new versions accessible through edit history. | Preview, version history, download, sharing, and Google Drive export are supported. Formats are DOCX/PDF, XLSX, PPTX, and HTML. [Perplexity asset documentation](https://www.perplexity.ai/help-center/en/articles/12528830-creating-assets-with-perplexity-overview) | Strong model for “the file is the result,” not merely a link. Pi should not auto-open every completed file, however; a remote-agent transcript may produce several files and unsolicited takeover would interrupt supervision. |
| **DeepSeek** | Uploads appear as filename chips inside the composer, with a visible parsing state while DeepThink/Search remain selected. | DeepSeek’s official app description promises file upload and text extraction, not a general preview surface. A current issue reports that uploaded files in conversation history can be visible yet unclickable. | The composer keeps attachment, prompt, and modes in one card, but supplies no thumbnail and little parsing progress. [official app announcement](https://api-docs.deepseek.com/news/news250115), [composer teardown](https://aiuxplayground.com/teardowns/deepseek/composer/), [history-file issue](https://github.com/deepseek-ai/DeepSeek-V3/issues/1260) | Negative benchmark: never make a filename-shaped element that cannot reopen. Every Pi artifact card must have a deterministic Ready, Unavailable, Redacted, or Unsupported result. |
| **Gemini iOS** | The composer’s Add files control expands to Files, Photos, Camera, Drive, and Notebooks; less common choices sit behind More Uploads. Up to 10 files can be added per prompt; non-video files may be up to 100 MB. | Canvas on mobile can hold documents, apps, slides, or code. Its top action is **Share & export**; text can be copied or exported to Google Docs. | A shared Canvas link cannot currently open in the Gemini mobile app, breaking app-to-app continuity. Uploaded Google Docs/Sheets are converted to PDF for analysis. [iPhone file flow](https://support.google.com/gemini/answer/14903178?co=GENIE.Platform%3DiOS&hl=en), [Canvas documentation](https://support.google.com/gemini/answer/16047321?hl=en), [Canvas launch](https://blog.google/products-and-platforms/products/gemini/gemini-collaboration-features/) | Useful progressive disclosure, but Pi should avoid format conversion and cross-surface discontinuity. Open the exact relay revision in place. |
| **Meta AI** | Image-first: generated or edited imagery appears directly in chat. General document analysis/editor support has historically been described as a limited test rather than the app’s core surface. | Tap image → image-focused view → three-dot control in the upper-right. | Save or Share from the menu, with direct routes to Instagram, Facebook, WhatsApp, or Messenger. Meta’s rich document editor was described as a web test in select countries. [Meta image workflow](https://ai.meta.com/learn/ai-creativity/how-to-edit-photos-with-ai/), [Meta AI app announcement](https://about.fb.com/news/2025/04/introducing-meta-ai-app-new-way-access-ai-assistant/) | Best reference for a nearly chromeless image viewer and short share path; poor reference for code, text, or PDF consistency. |

## What Mobbin corroborates

Mobbin’s public mobile-chat index places:

- ChatGPT and Gemini in **Uploading & Downloading** flows.
- Claude in flows involving top navigation and file upload/download.
- Perplexity in patterns involving a toolbar, carousel, bottom sheet, save, and delete.

This reinforces a common hierarchy: chat contains the compact object; secondary actions and richer navigation appear only after opening it. The public page does not expose enough detail to justify pixel measurements for the individual apps. [Mobbin mobile chat reference](https://mobbin.com/explore/mobile/screens/chat-bot)

## Strong patterns to carry forward

1. **Card first, viewer second.** Claude, Kimi, Perplexity, and ChatGPT all preserve transcript continuity by representing a file as a bounded object before opening a richer context.

2. **One dedicated preview shell.** Claude’s separate artifact window and Perplexity’s expanded asset preview outperform DeepSeek’s context-only attachment model.

3. **Revision identity belongs in the viewer.** Kimi’s `V2` cards and version-specific preview are particularly relevant to a revision-checked coding agent. A filename without a revision is ambiguous once the agent edits the file again.

4. **Share is a viewer action, not a chat action.** Claude, Kimi, Gemini, Meta AI, and Perplexity place export/share beside the opened artifact. This makes the shared object and revision inspectable before disclosure.

5. **Full-screen is correct on iPhone.** Apple recommends full-screen modality for focused media or document viewing and expects both an obvious toolbar dismissal control and the familiar swipe-down gesture. [Apple modality guidance](https://developer.apple.com/design/human-interface-guidelines/modality)

## Anti-patterns

- A filename chip that cannot be reopened, demonstrated by DeepSeek’s reported history behavior.
- Auto-opening every generated output, which is appropriate for a single Perplexity asset but disruptive in an agent transcript containing several files.
- Separate viewer conventions for uploaded, generated, and edited files.
- Sending users into Safari or Files merely to inspect content.
- Rendering untrusted HTML/SVG as an executable artifact. Claude and Kimi can support apps because they operate dedicated sandbox infrastructure; Pi’s requested scope is image/PDF/text/code, so executable preview adds risk without satisfying a requirement.
- Exposing the host path, underlying unredacted revision, PDF text layer, metadata, or downloadable source when the relay supplied only a sanitized preview.

## Remote-coding prior art

The open-source market confirms that file inspection is a core mobile-agent need, but implementation quality varies:

- **Claude Code Viewer** is an installable mobile PWA with dedicated inline image, embedded PDF, and formatted text previewers; it also supplies a right-side explorer and quick file previews. This is the closest technical prior art for Pi’s stack and deployment model. [Repository](https://github.com/d-kimuson/claude-code-viewer)
- **remote-agent** supports Pi, Claude Code, Codex, and others over a Tailscale-served PWA, with visual Read/Write/Edit viewers and a GitHub-like diff viewer. [Repository](https://github.com/d-kimuson/remote-agent)
- **MobileCLI** combines a remote file browser and editor with a Tailscale/trusted-network recommendation and challenge-response device pairing. [Repository](https://github.com/MobileCLI/mobilecli)
- **OpenCodex** provides a native iPhone tree, search, code viewer/editor, terminal, and approval sheet, but treats file inspection as a separate browser rather than a chat artifact. [Repository](https://github.com/mjmkk/opencodex)
- **Happy** demonstrates demand for an encrypted cross-platform mobile client, but its public description does not establish a richer multi-format preview model. [Repository](https://github.com/slopus/happy)

The opportunity for Pi Remote is to combine Claude’s chat-native artifact opening with the explicit, private file provenance of these remote-agent clients.

# 2. Concrete spec contribution for the build phase

## Product contract

A preview is an immutable, relay-issued snapshot. It must never resolve a local path from the browser or ask the host for content outside the relay artifact envelope.

```ts
type PreviewArtifact = {
  artifactId: string
  displayName: string
  mediaType: string
  renderer: "image" | "pdf" | "text" | "code" | "unsupported"
  revision: string
  byteLength: number
  payloadUrl?: string
  inlineText?: string
  language?: string
  redaction: "none" | "partial" | "full"
  truncated: boolean
  shareAllowed: boolean
  textLayerSafe?: boolean
  digest: string
}
```

Required invariants:

- `displayName` is relay-provided and contains no absolute host path.
- `payloadUrl` is a relay URL, never `file:`, a host filesystem URL, or a third-party URL.
- The viewer never attempts “open original.”
- Share exports only the received sanitized blob/text for the displayed `revision`.
- PDF selection/search is enabled only when `textLayerSafe === true`; otherwise render to canvas without exposing embedded text or annotations.
- A fully redacted artifact has no payload and opens an explanatory state.
- Artifact responses and service-worker rules use `Cache-Control: no-store`; previews may remain in memory for the current session but are not persisted by default.
- A later revision never silently replaces an open preview.

## Transcript card

Minimum size: **68 px high**, full available message width, **12 px** internal padding, **10 px** corner radius.

Layout:

- Leading preview/icon: **44 × 44 px**.
  - Image: cropped thumbnail.
  - PDF: first-page thumbnail only if the relay supplied one.
  - Text/code: file-type glyph; do not derive a thumbnail client-side.
- Center:
  - Filename: Inter, **15/20 px**, semibold, one line, middle truncation where possible.
  - Metadata: Inter, **12/16 px**: `PDF · 12 pages · rev 7`, `TypeScript · 8.4 KB`, or equivalent relay data.
- Trailing: 44 × 44 px disclosure button or the card’s open affordance.
- Redaction/truncation badge appears in the metadata line and is also part of the accessible name.
- The entire card is one button. Do not nest a second unlabeled tap target inside it.
- Press state: translate/scale no more than 1%, with a visible background change. Apple requires custom buttons to show a press state and recommends at least **44 × 44 pt** hit regions. [Apple button guidance](https://developer.apple.com/design/human-interface-guidelines/buttons)

Accessible name example:  
`Open package-lock.json, JSON code, revision 18, partially redacted.`

## Open and close sequence

1. User taps the card.
2. The viewer is mounted as a `react-aria-components` `ModalOverlay` + `Modal` + `Dialog`.
3. A browser-history entry is added so iOS edge-back/browser Back closes the viewer before leaving the conversation.
4. Initial focus lands on the static filename heading, not the Share or Close button, because the dialog contains long structured content.
5. Viewer opens full-screen at `100dvh`.
6. Close through any of:
   - Top-left Close button.
   - Swipe down.
   - `Escape`.
   - Browser Back/popstate.
7. Focus and scroll return to the exact originating card.

The modal must make the chat inert, contain its tab sequence, expose `aria-modal="true"`, close on Escape, and restore focus to its invoker. [WAI modal-dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

### Swipe-down arbitration

Swipe-down dismisses only when:

- Zoom is exactly `1`.
- The active document scroller is at `scrollTop === 0`.
- Gesture begins in the header or upper **56 px** of content.
- Vertical travel reaches **72 px**, or release velocity exceeds **0.65 px/ms**.
- Horizontal travel remains below half the vertical travel.

Otherwise, the gesture belongs to image pan, PDF/text scrolling, or code horizontal scrolling. Close must never depend on this gesture.

## Full-screen shell

Header height: **52 px plus `env(safe-area-inset-top)`**.

- Leading: Close, 44 × 44 px.
- Center: filename, maximum two lines; second line may display revision and file type.
- Trailing: Share, 44 × 44 px. If disallowed, omit it rather than showing an unexplained disabled icon.
- Optional overflow menu is deferred until there are at least two real secondary actions.
- Content bottom padding: `max(12px, env(safe-area-inset-bottom))`.
- Use `env(safe-area-inset-*)` for notches, rounded corners, and the Home indicator. [MDN safe-area documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/env)

No chat composer, plan controls, or mutation actions appear inside the viewer.

## Renderer specifications

| Renderer | Required behavior | Exact controls | Failure behavior |
|---|---|---|---|
| **Image** | `object-fit: contain`; preserve aspect ratio; neutral canvas; never upscale beyond native pixels until user zooms. | Pinch **1×–4×**; double-tap toggles **1×/2×** around the touched point; pan only above 1×; single tap does not hide the Close control. | Decode failure → filename, media type, byte size, “Preview unavailable,” Share if allowed. Images over **40 megapixels** enter metadata-only state to avoid iPhone memory termination. |
| **PDF** | Use PDF.js display layer with lazy page rendering; vertical continuous pages; retain real page colors in both themes. PDF.js provides a browser display layer and viewer UI rather than depending on iOS’s inconsistent inline PDF handling. [PDF.js guide](https://github.com/mozilla/pdf.js/blob/master/docs/contents/getting_started/index.md) | Sticky page indicator `3 of 18`; tap indicator for page list; pinch **1×–3×**; double-tap fit-width/100%; text selection/search only when `textLayerSafe`. | Password-protected, malformed, over **50 MiB**, or over **500 pages** → metadata-only state and sanitized Share. Render errors identify the failed page without closing the viewer. |
| **Text** | Source Serif 4, **17/27 px**, **18 px** side padding, selectable text, preserve paragraphs and whitespace where semantically required. | Native selection; optional Find only after MVP. No editing. | Over **2 MiB** or **20,000 lines** → render relay-provided excerpt and persistent `Preview truncated` notice; no hidden automatic fetch. |
| **Code** | Existing project monospace token, **13.5/20 px**; syntax highlighting from `language`; line numbers in a **48 px** gutter; no wrap by default; virtualize after **2,000 lines**. | Horizontal pan; a visible **Wrap lines** toggle may be added to the toolbar overflow; native selection and Copy selected text. | Unknown language → plain text. Invalid bytes → replacement characters plus “Encoding could not be fully decoded”; never execute or import the content. |
| **Unsupported** | Metadata sheet with filename, media type, size, revision, and redaction state. | Share sanitized file when allowed; Close. | No browser navigation and no “try opening original.” |

## State model and copy

| State | Visible result | Screen-reader announcement |
|---|---|---|
| `opening` | Skeleton matching the selected renderer; filename remains visible. | `Opening <filename>.` |
| `ready` | Renderer content. | `<filename>, <type>, revision <n>.` |
| `partial-redaction` | Persistent compact badge: `Some content redacted by relay`. Redaction spans use a constant-size placeholder, not width proportional to removed content. | Each placeholder: `Redacted by relay.` |
| `full-redaction` | Lock/veil illustration, filename, `Preview withheld by relay policy.` | Same text; no absent controls in tab order. |
| `truncated` | Sticky informational banner, not a toast: `Preview ends here. The relay supplied an excerpt.` | Announced once as polite status. |
| `newer-revision` | Nonblocking banner: `A newer revision is available` with `View latest`. Current revision remains rendered. | `Revision <n+1> available.` |
| `offline` | If the blob is already in memory, continue rendering with `Offline copy` badge. Otherwise: `Preview isn’t available offline.` | Assertive only if opening failed. |
| `unsupported` | Metadata-only surface. | `<type> preview is not supported.` |
| `error` | Stable error panel with `Try again` only when the same relay artifact can be re-requested read-only. | Focus the error heading after failure. |
| `sharing` | Keep viewer visible; native share sheet owns focus. | No success announcement until the promise resolves. |
| `share-failed` | Inline status under Share, not an alert modal. | `Couldn’t share this sanitized preview.` |

Do not reveal redacted byte counts, line counts, original dimensions, removed filenames, or placeholder widths that encode secret length.

## Sharing

Use `navigator.canShare({files: [file]})` before showing file sharing. Invoke `navigator.share()` directly from the button’s user activation; it requires HTTPS and transient activation. PDF, images, and common text formats are normally shareable, but support must be feature-detected. [MDN Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API), [shareable-file guidance](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)

Share payload:

- Filename: relay `displayName`.
- Bytes: exactly the sanitized displayed payload.
- Title: `displayName`.
- No Tailscale URL, host path, chat URL, ticket, revision token, or authorization header.
- If file sharing is unsupported, provide **Download sanitized copy** only when `shareAllowed`; otherwise provide no fallback that could disclose more data.

Before opening the system share sheet, show a confirmation only for `redaction === "partial"`:

> Share the sanitized revision shown here? Redacted content is not included.

This is disclosure confirmation, not mutation approval.

## Accessibility

- Every toolbar control has a visible or accessible label: `Close preview`, `Share sanitized <filename>`, `Page 3 of 18`.
- Dialog title is the visible filename.
- Keep a visible Close button in the tab order; WAI explicitly recommends one even when Escape is supported. [WAI dialog guidance](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- Minimum hit region: **44 × 44 px**.
- Body text starts at **17 px** and can enlarge to **200%** without clipping or overlapping controls. Apple recommends 17 pt as the iOS default and supporting enlargement to at least 200%. [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility/)
- Normal text contrast: at least **4.5:1**; large text and essential non-text boundaries: at least **3:1**. [WCAG contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
- Syntax colors must independently meet contrast requirements against both parchment and dark code surfaces; color cannot be the only indication of token class, error, redaction, or selection.
- A PDF canvas without a safe text layer is labeled by page and document title but is not falsely exposed as readable text. State: `Page 4 image; selectable PDF text is unavailable for this sanitized preview.`
- VoiceOver order: Close → title/revision → Share → status → document content.
- Orientation changes preserve page, scroll offset, and zoom where feasible.
- Keyboard: Escape closes; Tab remains in dialog; arrow/page keys scroll; `Cmd/Ctrl+C` copies selected text only.

## Visual system

- Modal shell: existing bone `#f8f8f6` and carbon tokens.
- Clay `#d97757`: active segmented control, focus ring, progress, and selected-page accent—not body copy.
- Filename and controls: Inter.
- Long-form text: Source Serif 4.
- Code: reuse the existing diff/code font token; do not introduce another display typeface.
- Border: one-pixel existing low-contrast ink border that still reaches **3:1** where it communicates a component boundary.
- PDF pages remain white/original-color in dark mode, surrounded by the dark carbon canvas.
- Image transparency uses a subtle theme-derived checkerboard; do not bake it into exported content.
- Cards and viewer use the same type icon, filename, and revision string to maintain object continuity.

## Motion

- Open: **220 ms**, opacity `0→1`, translate Y `12→0 px`, cubic-bezier `(0.22, 1, 0.36, 1)`.
- Close: **180 ms**, reverse.
- Card press: **90 ms**.
- Revision banner: opacity only, **160 ms**.
- Swipe dismissal tracks the finger exactly and settles within **180 ms**.
- Under `prefers-reduced-motion: reduce`, remove translation, scaling, spring/bounce, and zoom interpolation; use an **80 ms** opacity change or no animation. Apple recommends replacing large axis/depth transitions with fades, and the web preference reflects the iOS Reduce Motion setting. [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility/), [MDN reduced-motion guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

## Objective acceptance checks

1. Tapping every supported artifact card produces `ready`, `full-redaction`, `unsupported`, or an explicit error—never a dead tap.
2. Close button, Escape, browser Back, and qualifying swipe-down each close the viewer and restore focus to the originating card.
3. No preview request contains a host path or non-relay origin.
4. The service worker has no artifact payload in Cache Storage after closing and reloading.
5. Shared-file SHA-256 equals the displayed relay payload digest.
6. Opening revision 7 and receiving revision 8 leaves revision 7 visible until `View latest` is activated.
7. PDF text extraction, selection, and search are absent when `textLayerSafe` is false.
8. VoiceOver can identify filename, revision, renderer type, redaction state, Close, and Share without reading the chat behind the modal.
9. At 200% text enlargement, Close and Share remain visible and no filename obscures either control.
10. All text/theme combinations pass WCAG AA; all interactive hit regions are at least 44 × 44 px.
11. Reduced Motion removes translation and zoom animations.
12. A 40 MP image, 50 MiB PDF, 500-page PDF, 20,000-line text file, malformed PDF, unsupported MIME type, offline open, and share cancellation each reach the specified stable state without terminating the PWA.

# 3. Divergent / minority ideas worth considering

## Treat revision as the primary object, not the pathname

Most competitors foreground a human filename. In a coding-agent setting, `src/app.tsx` may change several times within one transcript. Display:

> `src/app.tsx`  
> `Revision 18 · produced after “Add preview viewer”`

This creates an auditable timeline and prevents a user from sharing a newer file while believing they are sharing the version discussed by the agent.

## “Freeze and compare” without entering diff mode

Allow a user to pin the currently open revision, then open a later revision side-by-side as two independently scrollable full-screen pages. This is not a rendered diff; it is visual comparison of two complete artifacts. It would be especially valuable for images and PDFs, where text diffs are inadequate.

## Redaction map as a first-class layer

Instead of silently replacing content, offer a noninteractive summary:

> `4 relay redaction regions · content and lengths withheld`

For PDFs/images, the relay could supply safe rectangular redaction coordinates without labels or hidden text. This makes privacy intervention visible while preserving fail-closed behavior. The risk is side-channel leakage through count or geometry, so it should remain opt-in until the threat model approves those fields.

## Ephemeral “peek” versus committed open

A touch-and-hold card could show a noninteractive Quick Look-style peek, while a normal tap opens the full viewer. This could accelerate inspection of many agent outputs, but it must never be the only way to preview and may conflict with VoiceOver/context menus.

## Deliberately omit download history

Competitors increasingly build asset libraries. Pi Remote could resist this and keep previews session-ephemeral: reopen from the transcript, share explicitly, and retain no general “Downloads” collection. For a private coding relay, less persistence may be a stronger product advantage than matching a consumer AI library.

## Image-first “lights out” mode

After opening an image, a second tap could hide every control except a small Close affordance, using carbon behind the image even in light mode. Meta AI and photo viewers point toward this direction, but Pi should not apply it to PDF/text/code where navigation and provenance need to remain visible.

# 4. Open questions and risks

1. **What exactly does the relay issue?** Inline sanitized bytes, a one-use read ticket, or a stable artifact URL lead to different offline, retry, range-request, and share implementations.

2. **Are sanitized PDFs flattened?** Visual black boxes are not sufficient if selectable text, annotations, form values, attachments, or incremental PDF revisions still contain secrets. Until guaranteed, `textLayerSafe` must default to false.

3. **May the browser transform relay content?** Client-side syntax highlighting is presentational, but OCR, EXIF display, SVG execution, PDF attachment extraction, and document conversion can reveal content not intended by the relay contract.

4. **Is sharing allowed for every preview?** A relay-level `shareAllowed` decision is safer than assuming that “visible” implies “exportable.” Screen capture remains possible, but explicit export can still be governed.

5. **How are revisions identified?** A monotonic revision, content digest, Git blob SHA, or relay event sequence is needed. Path plus timestamp is not sufficient.

6. **Can the relay serve HTTP Range requests?** PDF.js can progressively request visible ranges, reducing memory and latency, but each range must remain bound to the same artifact revision and authorization.

7. **What is the largest real artifact?** The proposed 40 MP, 50 MiB/500-page, and 2 MiB/20,000-line guardrails should be tested against actual Pi sessions before becoming product limits.

8. **SVG policy:** SVG is nominally an image but can include scripts, external references, animation, and embedded documents. Safest initial treatment is unsupported or relay-rasterized PNG.

9. **Markdown policy:** Rendering Markdown creates links, embedded images, and potentially HTML. Initial text preview should either render a strictly sanitized subset with external requests disabled or display source.

10. **iOS memory pressure:** Decoded images can consume far more memory than their compressed byte size; PDF canvases must release off-screen pages and cap device-pixel-ratio rendering.

11. **PWA lifecycle:** iOS may suspend or evict the app while the system share sheet is open. Viewer state must be reconstructible from non-secret metadata without persisting preview bytes.

12. **Share cancellation semantics:** `navigator.share()` behavior has varied across WebKit versions. Cancellation must not be shown as a security or upload failure, and the Share control must recover immediately.

13. **Toolbars versus content:** Claude’s mobile complaints show that a nominal artifact viewer can still fail if it uses an iPhone-sized inset or excessive chrome. Test on the smallest supported iPhone and with browser/PWA display modes separately.

14. **Mobbin evidence completeness:** The public index establishes relevant app/pattern pairings, but authenticated screen-by-screen flows should be rechecked during visual QA before claiming pixel-level parity.

# 5. Sources

## Competitive products

- [Mobbin — Mobile Chat UI reference](https://mobbin.com/explore/mobile/screens/chat-bot)
- [Anthropic — Artifacts are generally available](https://www.anthropic.com/news/artifacts)
- [Anthropic — What are artifacts and how do I use them?](https://support.anthropic.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them)
- [Anthropic mobile engineer — iOS/Android artifact capabilities](https://www.reddit.com/r/ClaudeAI/comments/1f2o0gj/artifacts_now_available_in_claude_ios_android_apps/)
- [Kimi — Websites preview interface](https://www.kimi.com/help/websites/websites-overview)
- [Kimi — Slides cards, preview, and mobile export](https://www.kimi.com/help/slides/ppt-stuck)
- [Kimi — Product overview and file limits](https://www.kimi.com/help/getting-started/overview)
- [Kimi — Docs and Sheets](https://www.kimi.com/help/docs-and-sheets/docs-and-sheets-overview)
- [Perplexity — Creating and previewing assets](https://www.perplexity.ai/help-center/en/articles/12528830-creating-assets-with-perplexity-overview)
- [DeepSeek — Official app introduction](https://api-docs.deepseek.com/news/news250115)
- [DeepSeek composer teardown](https://aiuxplayground.com/teardowns/deepseek/composer/)
- [DeepSeek — inaccessible uploaded files issue](https://github.com/deepseek-ai/DeepSeek-V3/issues/1260)
- [Google — Upload and analyze files on iPhone/iPad](https://support.google.com/gemini/answer/14903178?co=GENIE.Platform%3DiOS&hl=en)
- [Google — Gemini Canvas](https://support.google.com/gemini/answer/16047321?hl=en)
- [Google — Canvas launch](https://blog.google/products-and-platforms/products/gemini/gemini-collaboration-features/)
- [Meta — Image editing, opening, saving, and sharing](https://ai.meta.com/learn/ai-creativity/how-to-edit-photos-with-ai/)
- [Meta — Meta AI app and document-editor testing](https://about.fb.com/news/2025/04/introducing-meta-ai-app-new-way-access-ai-assistant/)

## iPhone, PWA, and accessibility

- [Apple HIG — Modality](https://developer.apple.com/design/human-interface-guidelines/modality)
- [Apple HIG — Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [Apple HIG — Activity views/share sheets](https://developer.apple.com/design/human-interface-guidelines/activity-views)
- [Apple HIG — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility/)
- [Apple HIG — Going full screen](https://developer.apple.com/design/human-interface-guidelines/going-full-screen)
- [W3C — Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [W3C — WCAG 2.2 contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
- [React Aria — Modal](https://react-spectrum.adobe.com/react-aria/Modal.html)
- [MDN — Safe-area environment variables](https://developer.mozilla.org/en-US/docs/Web/CSS/env)
- [MDN — Reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [MDN — Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)
- [MDN — `navigator.share()` and shareable files](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
- [Mozilla PDF.js — Getting started/display layer](https://github.com/mozilla/pdf.js/blob/master/docs/contents/getting_started/index.md)

## Remote coding-agent prior art

- [Claude Code Viewer](https://github.com/d-kimuson/claude-code-viewer)
- [remote-agent](https://github.com/d-kimuson/remote-agent)
- [MobileCLI](https://github.com/MobileCLI/mobilecli)
- [OpenCodex](https://github.com/mjmkk/opencodex)
- [Happy](https://github.com/slopus/happy)
