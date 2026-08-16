<!-- provenance: external-CLI orchestration pass; original file iter-01-sol.md -->
> **Source pass 1** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-1-sol.md`.

<!-- F8-inbound-media | model=sol | lens=competitive-teardown | iter 1/15 | 2026-08-16T04:35:14.508Z -->

# 1. Findings for the competitive-teardown lens

## Competitive pattern matrix

| Product | Inline presentation | Expansion and actions | Persistence/security behavior | Lesson for Pi Remote |
|---|---|---|---|---|
| **Claude iOS** | Claude does not natively generate photos or illustrations. Its closest output analogues are artifacts and generated PNG visualizations/files. A current real-device screen catalog includes a dedicated **Artifacts** screen, but generated files on mobile open in the system preview or another app rather than a purpose-built transcript viewer. [Anthropic capability note](https://support.claude.com/en/articles/9002504-can-claude-produce-images), [file creation behavior](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude), [iOS screen catalog](https://techdevnotes.com/apps/ios/claude/6473753684/screenshots) | Attachment/artifact → tap Download → system preview or associated app. This interrupts transcript context. Public feedback on Mobbin’s new inline results in Claude specifically criticizes thumbnails as too small and the absence of convenient fullscreen viewing. [Mobbin MCP discussion](https://www.linkedin.com/posts/liaujianjie_the-mobbin-mcp-now-displays-the-screens-inline-activity-7465351105502294016-qvs1) | Claude supports sandboxed file creation and can disable network egress, explicitly treating egress as a prompt-injection risk. [Anthropic security guidance](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude) | Match Claude’s restrained, work-oriented card treatment, but avoid handing an image off to an external preview. Pi Remote should own fullscreen viewing and preserve scroll position. |
| **Kimi Code** | This is the closest prior art. `ReadMediaFile` results appear as **clickable image/video thumbnails** inside tool output; images also render directly in chat. Mobile uses a collapsible drawer rather than changing the transcript model. [Kimi Web UI documentation](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html) | Thumbnail → click/tap → enlarged image. Kimi separately added click-to-enlarge for uploaded images. [Kimi changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md) | Kimi detects type from headers, blocks unsupported formats, caps model-read images at a 2,000-pixel longest edge and 256 KB by default, and replaces older media with text markers when request size is exceeded. Screenshots remain PNG until the budget requires JPEG. [Kimi changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md) | Adopt the transcript-native thumbnail, explicit failure marker and bounded-media behavior. Improve on Kimi by separating durable metadata from short-lived bytes, adding digest verification and using a true iPhone fullscreen viewer. |
| **ChatGPT** | Images are first-class conversation objects. Generation can continue asynchronously while the user keeps using ChatGPT. Generated images also appear in a separate Images library. [OpenAI image documentation](https://help.openai.com/en/articles/11084440-chatgpt-image-library) | Inline image → tap → mobile editor. From the image surface, Copy, Save and Share are available. Editing adds region selection, undo/redo and a follow-up conversation panel. [OpenAI image documentation](https://help.openai.com/en/articles/11084440-chatgpt-image-library) | Input supports PNG, JPEG and non-animated GIF up to 20 MB; images are resized for analysis and original filenames/metadata are not processed. [OpenAI image-input FAQ](https://help.openai.com/en/articles/8400551-image-inputs-for-chatgpt-faq%3F.svgz) | Copy the direct tap-to-expand path and reserved loading space. Do not copy the automatic permanent image library: private coding screenshots should not silently gain a second durable home. |
| **Perplexity** | Images are interleaved with answer text and citations rather than isolated at the end. App Store material shows an “Answer” section where a large image is placed immediately before or alongside explanatory text, after source indicators. [Perplexity App Store page](https://apps.apple.com/us/app/perplexity-ask-anything/id1668000334), [captured answer layout](https://www.appbrain.com/appstore/perplexity-ai-search-chat/ios-1668000334) | Generated assets automatically open a preview; a side-panel preview has an explicit Expand action for fullscreen, followed by download/share and version history. Mobile can preview supported assets. [Perplexity asset workflow](https://www.perplexity.ai/help-center/en/articles/12528830-creating-assets-with-perplexity-overview) | Image uploads accept JPEG, HEF, PNG and PDF up to 40 MB and are reformatted. Perplexity states that uploaded images are not retained on its servers. [Perplexity upload documentation](https://www.perplexity.ai/help-center/en/articles/10354840-uploading-images-on-perplexity) | Copy the association between an artifact and an explicit revision. Keep source/context adjacent to the image, but avoid search-style image carousels that make technical screenshots too small. |
| **Gemini** | Google describes Gemini responses as interleaving images, timelines and interactive visuals instead of producing a separate media section. [Google Play product description](https://play.google.com/store/apps/details?id=com.google.android.apps.bard) | On mobile, touch and hold an image, then choose Save or Share. Share creates a public link. [Gemini image help](https://support.google.com/gemini/answer/14286560?co=GENIE.Platform%3DAndroid&hl=en) | Generated imagery uses provenance mechanisms including SynthID; some tiers also add a visible mark. | Interleaving is useful. Long-press alone is insufficiently discoverable for expansion, and public-link sharing is inappropriate for private repository screenshots. |
| **Meta AI** | Generated and edited images sit directly inside the conversation and can be iterated through text. Meta also routes creations into a Discover/remix ecosystem. [Meta AI launch](https://about.fb.com/news/2025/04/introducing-meta-ai-app-new-way-access-ai-assistant/) | Tap image → three-dot control in the upper-right → Save or Share to Instagram, Facebook, WhatsApp or Messenger. [Meta photo-editing guide](https://ai.meta.com/learn/ai-creativity/how-to-edit-photos-with-ai/) | The interface optimizes for distribution and remixing rather than confidentiality. | Borrow the familiar upper toolbar placement, not the social defaults. Pi Remote should never expose “public link,” Discover or remix actions. |
| **DeepSeek** | DeepSeek historically treated uploaded files as extracted text. Its 2026 iOS releases added Vision mode and improved photo/file uploads, but first-party material does not document an assistant-produced inline-image object comparable to Kimi or ChatGPT. [DeepSeek launch documentation](https://api-docs.deepseek.com/news/news250115/), [current App Store history](https://apps.apple.com/us/app/deepseek-ai-assistant/id6737597349) | DeepSeek has explicitly added copy, download and fullscreen preview for tables, showing that it treats complex output as a separate preview surface. [App Store version history](https://apps.apple.com/de/app/deepseek-ki-assistent/id6737597349) | Current image work is input-oriented Vision mode. | This is the laggard pattern: image understanding without a durable output-media model. Pi Remote should not represent an inbound screenshot as text, Markdown or an ordinary tool-result URL. |

## Cross-product conclusions

1. **The successful entry point is a large, tappable transcript object.** Kimi’s clickable tool-result thumbnail and ChatGPT’s tappable inline image are closer to the requested workflow than Claude’s mobile file handoff. The card must be visually primary, not a filename chip.

2. **Expansion and secondary actions are different interactions.** ChatGPT uses tap for the primary open/edit path; Gemini uses long-press for Save/Share; Meta places secondary actions behind an upper-right menu. Pi Remote should use:

   - Tap or Enter/Space: open viewer.
   - Long-press: optional redacted-copy menu.
   - Visible toolbar: Close, zoom reset and overflow.
   - Never require long-press to discover fullscreen.

3. **Technical screenshots need `contain`, not lifestyle-image cropping.** Perplexity’s editorial image treatment works for illustrative search results, but a code or terminal screenshot may contain relevant pixels at every edge. Pi Remote must preserve the complete frame in both thumbnail and viewer.

4. **Media decay must be legible.** Kimi’s replacement of unavailable older media with textual markers is a better transcript model than broken-image icons. An expired Pi artifact must remain a stable transcript entry with dimensions, digest prefix, redaction status and an explicit “Preview expired” state.

5. **Revision is a UX concept, not merely protocol metadata.** Perplexity exposes asset version history. Pi Remote should show the exact referenced revision and never silently substitute the latest bytes for an older transcript block.

6. **Private coding media should not inherit consumer-AI distribution features.** ChatGPT’s library, Gemini’s public links and Meta’s social sharing improve consumer creation workflows but create unnecessary persistence and egress for repository screenshots.

7. **Mobbin evidence reinforces the fullscreen requirement.** Mobbin provides interactive screen-by-screen flows and searchable real-product screens; its crawlable ChatGPT iOS file-selection reference categorizes the flow under both selection and upload/download. The public reaction to Mobbin thumbnails inside Claude explicitly identifies small previews and missing fullscreen as usability failures. [Mobbin flow model](https://mobbin.collaboo.co/), [ChatGPT iOS file-selection screen](https://mobbin.collaboo.co/explore/screens/e720a107-8c35-4e6b-944f-adcbd07d328c)

# 2. Concrete spec contribution a build phase can execute

## 2.1 Protocol and durable transcript

Introduce one durable transcript kind:

```json
{
  "kind": "inbound_image",
  "artifact": {
    "id": "art_7MC2VQK8K8JG1X9YJ6X4R2NPW4",
    "revision": 3,
    "digest": "sha256-wJKr3j1cR6gkT0uS4Qx9wR3mBRbYjN2m4H8V9abCDe0",
    "mediaType": "image/png",
    "width": 1290,
    "height": 2796,
    "byteLength": 1842210,
    "thumbnailDigest": "sha256-A5H4...",
    "thumbnailWidth": 346,
    "thumbnailHeight": 750,
    "thumbnailByteLength": 148220
  },
  "presentation": {
    "label": "Screenshot from pi",
    "alt": "Mobile application settings screen; three sensitive regions redacted.",
    "redaction": {
      "state": "verified",
      "count": 3,
      "categories": ["credential", "host_path"]
    }
  }
}
```

Rules:

- `artifact.id` is at least 128 bits of cryptographic randomness, encoded without host-derived text.
- `revision` is a positive integer. Bytes at `(id, revision)` are immutable.
- `digest` is SHA-256 over the exact sanitized bytes served to the client.
- Durable state contains no filesystem path, filename, source URL, authorization ticket, OCR transcript, EXIF, base64 or raw bytes.
- `label` and `alt` are generated only from sanitized pixels and scrubbed text. If that cannot be guaranteed, use the generic label and alt text.
- Unknown image kinds fail schema validation. Existing clients render an “Unsupported media block” placeholder rather than attempting Markdown interpretation.
- A later revision never updates an earlier transcript entry. A new transcript event must reference the new revision.

## 2.2 Host-to-relay ingestion

Treat image publication as controlled data egress even though it is not a host mutation:

1. Pi emits an ephemeral `artifact.offer` to the host extension.
2. The extension resolves the proposed source to an already-open file descriptor or opaque local handle. A raw path never crosses into transcript or relay logs.
3. The extension enforces session ownership, approved workspace/temp roots, no symlink traversal and plan-mode policy.
4. Relay streams no more than **12 MiB** of input. It rejects additional bytes without buffering them.
5. Signature-sniff and decode only JPEG, PNG or WebP. Reject SVG, animated GIF/WebP, HEIC, PDF, TIFF, BMP and ICO.
6. Reject dimensions over **8192 px on either axis** or **16 megapixels total** before full decode.
7. Decode in a sandboxed worker with a **64 MiB decoded-pixel budget**, **2-second CPU budget** and no network access.
8. Apply EXIF orientation to pixels, convert to sRGB and perform a fresh raster encode. Discard all metadata, embedded thumbnails, ICC payloads, comments and filenames.
9. Run OCR and secret detection over the raster. Cover confirmed sensitive regions using solid opaque fills with a 6-pixel expansion. Never blur or pixelate secrets.
10. Fail closed unless redaction completes with `state: verified`. On timeout or unavailable OCR, publish only a blocked metadata placeholder.
11. Generate the thumbnail from the already-redacted raster, never from the source.
12. Full output limits: **4096-pixel longest edge**, **6 MiB**. Thumbnail limits: **768-pixel longest edge**, **256 KiB**.
13. Preserve screenshot-like content as PNG where it fits. Otherwise use JPEG at progressively reduced quality, with a floor of quality 82; reject rather than degrade below the floor.
14. Per assistant turn: maximum **4 images** and **24 MiB** of sanitized output. Per session: maximum **50 MiB** live artifact storage.

OWASP recommends allowlisting necessary types, distrusting declared `Content-Type`, validating signatures, generating storage names, enforcing limits and rewriting images to destroy injected content. It also warns that apparently valid JPEGs can be polyglots with malicious metadata. [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html), [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html), [PortSwigger polyglot example](https://portswigger.net/web-security/file-upload)

## 2.3 Delivery

Do not place a signed URL directly in `<img src>`.

1. When a card enters a 600-pixel viewport margin, request a one-use read ticket bound to:

   - authenticated PWA session;
   - artifact id;
   - revision;
   - digest;
   - variant: thumbnail or full;
   - 30-second expiry.

2. Fetch with the ticket in an authorization header. Consume it atomically. Mint a new ticket after any interrupted request; never retry the same ticket.

3. The response returns no redirect and includes:

```text
Content-Type: image/png
Content-Length: …
Content-Disposition: inline; filename="pi-preview.png"
Cache-Control: private, no-store, max-age=0
X-Content-Type-Options: nosniff
Cross-Origin-Resource-Policy: same-origin
Referrer-Policy: no-referrer
```

Correct MIME types plus `nosniff` prevent uploaded content from being reinterpreted as HTML; sensitive content should use `no-store`. [MDN `nosniff`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Content-Type-Options), [OWASP HTTP headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)

4. The client computes SHA-256 with WebCrypto before rendering. Digest mismatch produces a permanent “Integrity check failed” state and discards the blob.

5. Render through a blob URL and revoke it when the card unmounts or viewer closes. `URL.revokeObjectURL()` explicitly releases the object URL reference. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL_static)

6. The service worker must use network-only handling for `/artifacts/**`; it must never write these responses to Cache Storage or IndexedDB.

7. Response semantics:

| Result | UI |
|---|---|
| `200` | Render only after digest verification. |
| `401/403` | “Preview unavailable for this session.” |
| `409` | “Preview revision changed. Refresh the transcript.” |
| `410` | “Preview expired.” |
| `413/415` | “Preview blocked: unsupported or oversized image.” |
| `423` | “Preview withheld: redaction could not be verified.” |
| Digest mismatch | “Integrity check failed.” No automatic retry. |
| Offline | Retain metadata card and show “Connect to tailnet to load.” |

## 2.4 Inline card

For a 375-CSS-pixel iPhone viewport:

- Transcript gutters: **16 px**; card width: **343 px**.
- Border: 1 px carbon at 12% opacity; radius: **16 px**.
- Image well: width 100%, height **216 px**, `object-fit: contain`.
- Background: bone darkened by 2% in light mode; near-carbon neutral in dark mode.
- Footer: **48 px** minimum height, 12 px horizontal padding.
- Title: Inter 15/20, semibold, “Screenshot from pi.”
- Metadata: Inter 12/16, e.g. `1290 × 2796 · r3 · 3 redactions`.
- Redaction state uses icon plus text; clay alone must not carry meaning.
- Loading reserves the full 216-pixel image well. Use a static parchment placeholder after 800 ms rather than a continuously shimmering skeleton.
- The entire card is a `react-aria-components` `Button`, not a click handler on a `div`.

Accessible name:

> Open screenshot preview, 1290 by 2796 pixels, revision 3, three sensitive regions redacted.

The thumbnail inside the named button uses `alt=""` to avoid duplicate announcements. WCAG requires text alternatives for non-text content and at least 24×24 CSS-pixel targets; use Apple’s more comfortable **44×44 px** control convention throughout. [WCAG 2.2 non-text content](https://www.w3.org/TR/WCAG22/), [WCAG target-size explanation](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility/)

## 2.5 Fullscreen viewer

Reuse F6 as a `DialogTrigger` → `ModalOverlay` → `Modal` → `Dialog` composition. React Aria provides modal focus management, scroll locking and accessibility behavior; modal focus must remain trapped until dismissal. [React Aria overview](https://react-spectrum.adobe.com/react-aria/.../getting-started.html), [dialog behavior](https://react-spectrum.adobe.com/v3/DialogTrigger.html)

Layout:

- `position: fixed; inset: 0`.
- Carbon viewer background, independent of app theme, to preserve image contrast.
- Top toolbar begins at `env(safe-area-inset-top) + 8px`.
- Close button: 44×44 px, left 8 px.
- Center label: `Screenshot · r3`.
- Overflow/details button: 44×44 px, right 8 px.
- Bottom zoom controls sit above `env(safe-area-inset-bottom) + 12px`.
- Image viewport fills the remaining area with 12 px side clearance.
- Initial scale is contain-fit; never upscale beyond native resolution automatically.

Interactions:

- Tap card: open viewer.
- Tap viewer background: toggle chrome.
- Double tap image: fit → 2.5× around the tap point → fit.
- Pinch: continuous 1×–4× zoom.
- Pan: only while zoomed above fit.
- Swipe down to dismiss only at fit scale, after 96 px displacement or 800 px/s downward velocity.
- Escape: close.
- `+`, `-`, `0`: zoom in, zoom out, reset.
- Explicit Zoom In, Zoom Out and Reset buttons provide alternatives to multipointer gestures, following WCAG pointer-gesture requirements.
- Closing restores focus to the originating card and restores the transcript’s exact scroll offset.

Apple identifies double tap as the conventional zoom toggle and advises familiar tap/swipe gestures for restoring controls or dismissing fullscreen content. [Apple gestures](https://developer.apple.com/design/human-interface-guidelines/gestures/), [Apple fullscreen guidance](https://developer.apple.com/design/human-interface-guidelines/going-full-screen)

Fullscreen `<img>` alt:

> Screenshot from pi showing a mobile application settings screen. Three sensitive regions are covered with solid redaction blocks.

If no safe semantic description exists:

> Screenshot from pi. Three sensitive regions redacted.

## 2.6 Secondary actions

The first release should expose:

- Details: dimensions, sanitized byte size, revision, digest prefix, expiry and redaction categories.
- Share redacted copy: only when `navigator.canShare({files})` succeeds and an organization policy enables it.
- Copy digest.
- Report redaction problem.

Do not expose:

- View original.
- Raw path.
- Open on host.
- Public link.
- Automatic Photos-library save.
- Social destination shortcuts.

The Web Share API requires HTTPS, user activation and runtime capability checking. Share only the verified sanitized blob. [MDN Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API), [PWA file sharing](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Share_data_between_apps)

## 2.7 Visual and motion specification

- Open: 180 ms opacity plus 0.98→1 scale using `cubic-bezier(.2,.8,.2,1)`.
- Close: 160 ms reverse.
- Toolbar show/hide: 120 ms opacity.
- No spring overshoot; it makes screenshots appear to wobble.
- Under `prefers-reduced-motion: reduce`, use an immediate state change with no scale or swipe-dismiss animation.
- The clay accent appears on focus rings, active zoom controls and redaction-status outlines—not across the image.
- Focus ring: 2 px clay plus 2 px background separation.
- Redaction blocks inside the raster are carbon, not clay, so the mask remains opaque in both themes.

## 2.8 Objective acceptance checks

| Check | Pass condition |
|---|---|
| Path hygiene | Serialized transcript, relay logs and browser history contain zero matches for the source path or filename. |
| Byte hygiene | Transcript JSON contains no `data:`, base64 payload or artifact URL. |
| Type rejection | SVG, animated images, HEIC, TIFF, polyglot and spoofed-MIME fixtures all produce blocked placeholders. |
| Size rejection | 12 MiB + 1 byte, 16 MP + 1 pixel and 8193-pixel-axis fixtures fail before full decode. |
| Redaction | Every seeded credential/path fixture is covered by opaque raster pixels in both full and thumbnail outputs. |
| Fail closed | Killing OCR/redaction produces `redaction.state=blocked`; no retrieval ticket can be minted. |
| Integrity | Flipping one served byte produces digest failure and no rendered image. |
| Revision | Requesting r2 with an r3 ticket, digest or resource produces `409`; no fallback to latest. |
| Ticket replay | A second fetch using the same read ticket fails. |
| Cache | Artifact responses are absent from HTTP cache inspection, Cache Storage and IndexedDB after viewing. |
| Blob lifetime | Closing the viewer revokes the full-image blob URL. |
| Accessibility | VoiceOver announces one coherent card label; modal focus is trapped; close restores focus; every control is at least 44×44 px. |
| Gesture alternative | Fullscreen zoom and dismissal remain fully operable without pinch, drag or swipe. |
| Reduced motion | All scale and swipe animations are absent when reduced motion is enabled. |
| Narrow viewport | At 320 CSS px, no transcript control requires horizontal page scrolling. |
| Expiry | After TTL, metadata remains visible and bytes return `410`; the UI shows “Preview expired,” not a broken icon. |
| Offline | Previously seen bytes are not displayed from durable browser caches; metadata card remains usable and explains reconnection. |

# 3. Divergent / minority ideas worth considering

1. **Render an OCR text companion, not just alt text.** A “Read screenshot text” disclosure could expose a separately redacted OCR transcript, making terminal screenshots searchable and accessible without zoom. It must be derived from sanitized pixels and separately digest-bound.

2. **Use a redaction heat-map review before remote delivery.** Instead of immediately publishing, pi could first send only a tiny, aggressively blurred contact sheet with the number and categories of proposed redactions. The user would then authorize delivery of the sanitized full image. This is safer but adds friction.

3. **Make artifacts deliberately ephemeral even while transcript metadata is permanent.** A 24-hour byte TTL with permanent digest/revision tombstones is more aligned with remote-control use than ChatGPT’s automatic image library. Re-requesting the same image would require pi to republish a new revision.

4. **Permit only images created during the active agent turn.** Reject arbitrary existing repository images, even inside the workspace. This narrows the feature to screenshots and generated previews and substantially reduces accidental data export.

5. **Add “compare revisions” before galleries.** For UI work, a two-up r2/r3 comparison with a draggable divider may be more valuable than consumer-style left/right image paging. It should still load two independently verified artifacts.

6. **Use a safe visual fingerprint.** Show a four-word digest-derived phrase such as `clay-linen-ember-fern` in Details. Humans can compare revisions without reading hexadecimal, while the cryptographic digest remains authoritative.

7. **Never provide Save, even for sanitized output.** The strongest interpretation of the private-tailnet posture is a memory-only viewer. OS screenshots remain possible, but the product would avoid creating additional copies itself.

# 4. Open questions + risks

- **What constitutes verified pixel redaction?** OCR-based secret detection has both false negatives and destructive false positives. The product needs an explicit minimum detector set and language coverage.
- **Should redaction failure block all images or permit low-risk generated diagrams?** Type or provenance-based exemptions weaken the fail-closed invariant unless provenance is cryptographically trustworthy.
- **Who is allowed to publish?** A normal assistant text response, a dedicated host extension and a tool result have different trust boundaries. The safest design accepts only extension-originated offers.
- **How is screenshot capture authorized?** Capturing an application window or desktop is more invasive than reading an image already created in an approved artifact directory.
- **What is the byte TTL?** Short TTLs protect data but make older transcripts less useful. Long TTLs turn the relay into a private image archive.
- **What happens after relay restart?** If artifact storage is memory-only, all cards become expired. If encrypted disk storage is used, key rotation, deletion and backup exclusion require specification.
- **Are full-page screenshots supported?** The 16 MP decode ceiling will reject some long browser captures. Tiling would preserve detail but complicate digests, gestures and redaction.
- **Can safe alt text be generated without a second model call?** A model-generated description can repeat secrets that pixel redaction removed. Generic alt text is safer but less useful.
- **iPhone memory pressure remains material.** A 16 MP image expands to roughly 64 MiB in RGBA before browser overhead. Viewer tests must include older supported iPhones and rapid open/close cycles.
- **Tailnet transport is not sufficient for PWA APIs.** Installation, WebCrypto and Web Share rely on a secure browser context; the tailnet endpoint still needs correctly configured HTTPS.
- **The OS can retain pixels.** App-switcher snapshots, screen recording, user screenshots and the system share sheet are outside the PWA’s complete control.
- **Digest equality leaks duplicate content within a session.** If that is sensitive, expose a keyed digest to clients while retaining the canonical SHA-256 only inside the relay.
- **Redaction count itself may leak context.** “12 credentials redacted” is useful operationally but reveals information about the underlying screenshot. Organizations may prefer only “Sensitive content redacted.”
- **Share behavior needs a policy decision.** ChatGPT, Gemini and Meta normalize sharing; Pi Remote’s security posture argues for either policy-gated sharing or no sharing in the first release.

# 5. Sources

- [Mobbin — mobile and web UI reference library](https://mobbin.collaboo.co/)
- [Mobbin — ChatGPT iOS File Selection screen](https://mobbin.collaboo.co/explore/screens/e720a107-8c35-4e6b-944f-adcbd07d328c)
- [Mobbin MCP inline-screen discussion](https://www.linkedin.com/posts/liaujianjie_the-mobbin-mcp-now-displays-the-screens-inline-activity-7465351105502294016-qvs1)
- [Claude iOS real-device screen catalog](https://techdevnotes.com/apps/ios/claude/6473753684/screenshots)
- [Anthropic — Can Claude produce images?](https://support.claude.com/en/articles/9002504-can-claude-produce-images)
- [Anthropic — Create and edit files with Claude](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude)
- [Anthropic — Upload files to Claude](https://support.claude.com/en/articles/8241126-upload-files-to-claude)
- [Kimi Code — Web UI reference](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html)
- [Kimi Code repository](https://github.com/MoonshotAI/kimi-code)
- [Kimi Code changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)
- [TelePi — Pi mobile bridge with screenshot prompts](https://github.com/benedict2310/TelePi)
- [VibeCodingAgent — inline generated-image artifacts](https://github.com/tiancizhou/VibeCodingAgent)
- [Shelly — mobile coding UI with image preview pane](https://github.com/RYOITABASHI/Shelly)
- [OpenAI — Images in ChatGPT](https://help.openai.com/en/articles/11084440-chatgpt-image-library)
- [OpenAI — ChatGPT Image Inputs FAQ](https://help.openai.com/en/articles/8400551-image-inputs-for-chatgpt-faq%3F.svgz)
- [Perplexity App Store page](https://apps.apple.com/us/app/perplexity-ask-anything/id1668000334)
- [Perplexity — Uploading images](https://www.perplexity.ai/help-center/en/articles/10354840-uploading-images-on-perplexity)
- [Perplexity — Creating and previewing assets](https://www.perplexity.ai/help-center/en/articles/12528830-creating-assets-with-perplexity-overview)
- [Perplexity — iOS redesign](https://www.perplexity.ai/changelog/what-we-shipped-september-5th)
- [Google — Generate and manage images with Gemini](https://support.google.com/gemini/answer/14286560?co=GENIE.Platform%3DAndroid&hl=en)
- [Google Play — Gemini](https://play.google.com/store/apps/details?id=com.google.android.apps.bard)
- [Meta — Meta AI app launch](https://about.fb.com/news/2025/04/introducing-meta-ai-app-new-way-access-ai-assistant/)
- [Meta — Edit, save and share photos with Meta AI](https://ai.meta.com/learn/ai-creativity/how-to-edit-photos-with-ai/)
- [DeepSeek — Introducing the DeepSeek app](https://api-docs.deepseek.com/news/news250115/)
- [DeepSeek iOS App Store page](https://apps.apple.com/us/app/deepseek-ai-assistant/id6737597349)
- [Apple HIG — Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures/)
- [Apple HIG — Going full screen](https://developer.apple.com/design/human-interface-guidelines/going-full-screen)
- [Apple HIG — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WCAG 2.2 — Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [OWASP — File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [OWASP — Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [OWASP — HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [MDN — `X-Content-Type-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Content-Type-Options)
- [MDN — Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
- [MDN — Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)
- [MDN — Sharing data between PWAs and apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Share_data_between_apps)
- [MDN — `URL.revokeObjectURL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL_static)
- [React Aria — Getting started](https://react-spectrum.adobe.com/react-aria/.../getting-started.html)
- [React Aria/Spectrum — Modal dialog behavior](https://react-spectrum.adobe.com/v3/DialogTrigger.html)
