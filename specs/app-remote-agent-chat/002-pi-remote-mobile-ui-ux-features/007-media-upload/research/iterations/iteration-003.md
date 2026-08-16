<!-- provenance: external-CLI orchestration pass; original file iter-03-sol.md -->
> **Source pass 3** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-3-sol.md`.

<!-- F5-media-upload | model=sol | lens=accessibility-i18n | iter 3/15 | 2026-08-15T20:18:08.850Z -->

## 1. Findings for the accessibility–internationalization lens

### 1.1 The picker must expose gallery and camera as separate, named actions

A generic paperclip that immediately opens an ambiguous system picker is weaker for VoiceOver, Voice Control, and people with cognitive disabilities. Use one 44×44 CSS-pixel `Attach media` button that opens a short, modal action sheet containing:

1. `Choose photos`
2. `Take photo`
3. `Cancel`

Implement the two sources with separate React Aria `FileTrigger` instances. `FileTrigger` supplies the visually hidden native file input and supports multiple selection, accepted MIME types, and `defaultCamera="environment"` for rear-camera capture. An icon-only trigger requires an explicit accessible label. [`FileTrigger` documentation](https://react-spectrum.adobe.com/v3/FileTrigger.html)

The native mechanisms should be:

- Gallery: `multiple`, without `capture`.
- Camera: single selection with `capture="environment"`.
- Both: an explicit `accept` list.

The HTML `capture` value is only a request to use a camera and may fall back to the user agent’s preferred mechanism. Likewise, `accept` only guides the picker; it does not validate the returned bytes. [`capture` reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture), [`accept` reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept)

All attach, remove, retry, reveal, and cancel controls should use at least 44×44 CSS-pixel hit regions. Apple recommends 44×44 points for iOS controls, exceeding WCAG 2.2’s 24×24 CSS-pixel AA floor. [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility), [WCAG target-size criterion](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

### 1.2 Selection should be local; transmission should occur only on Send

Opening Photos, choosing an image, and previewing it should cause no network or host mutation. This creates a comprehensible boundary:

- `Attached locally` means the image remains on the iPhone/PWA.
- `Sending` means bytes are crossing to the relay and Pi.
- `Sent to Pi` means Pi accepted the image-bearing prompt.

The visible status and VoiceOver announcement must use those distinctions. Avoid the vague word `Uploaded` before Pi accepts the prompt.

This design also makes the composer’s existing Send action the explicit disclosure gesture. Removing a preview or abandoning the draft leaves no host-side artifact.

### 1.3 Pi’s normal persistence is a release blocker unless image messages are redacted at the storage boundary

Pi RPC accepts base64 `ImageContent` objects in `prompt`, `steer`, and `follow_up`, so the relay can deliver normalized image bytes directly without placing user-controlled files in the project directory. [Pi RPC documentation](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md)

However, Pi’s session format stores user message content—including `ImageContent.data`—inside its JSONL message entries. Standard persisted sessions would therefore retain the complete base64 image, not merely a transcript placeholder. [Pi session-format documentation](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/session.md)

The feature must remain disabled until one of these is true:

- Pi is instantiated with an in-memory `SessionManager` and the relay maintains a separate, text-only durable transcript; or
- a relay-owned session adapter serializes image blocks as opaque redacted attachment references and only rehydrates them in memory while an authorized attachment still exists.

Pi officially provides `SessionManager.inMemory()` for no-file persistence. [Pi SDK documentation](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/sdk.md)

Post-processing an already-written JSONL file is insufficient: it leaves a plaintext interval, creates crash-recovery leakage, and conflicts with append-only/tree history.

### 1.4 Current Pi transport supports images, not general iOS “media”

Pi’s core message type supports text and images; model metadata separately identifies whether the selected model accepts image input. Pi’s documentation warns that images passed to a non-vision model may otherwise be ignored. [Pi AI image-input documentation](https://github.com/badlogic/pi-mono/blob/main/packages/ai/README.md), [Pi content types](https://github.com/badlogic/pi-mono/blob/main/packages/ai/src/types.ts)

Therefore the truthful first release is **still-image attachment**, not unrestricted “media upload”:

- Accept JPEG, PNG, WebP, HEIC, and HEIF as inputs.
- Reject video, audio, PDF, ProRAW/DNG, SVG, animated GIF/APNG/WebP, and Live Photo video components.
- Disable Attach with the visible reason `This model can’t view images` when the active Pi model lacks image capability.
- Recheck model capability at commit time in case the model changed while the draft was open.

Kimi’s current product documentation advertises images and video, while Claude documents JPEG, PNG, GIF, and WebP uploads. Matching Kimi video requires a separate audited frame-extraction or native-video content protocol; silently taking only frame one would misrepresent what Pi received. [Kimi multimodal documentation](https://www.kimi.com/help/getting-started/agentic-chat), [Claude upload documentation](https://support.claude.com/en/articles/8241126-upload-files-to-claude)

HEIC/HEIF cannot simply be excluded: Apple recommends HEIF/HEVC capture and iPhones may produce it depending on Camera settings. [Apple HEIF/HEVC guidance](https://support.apple.com/en-gb/116944)

### 1.5 Previews and transcript attachments need different privacy semantics

Before Send, the user needs enough visual information to detect a mistaken selection. Show a local thumbnail, ordinal, type, and localized size. Do not upload or OCR it.

After Send, transcript rendering should default to a redacted placeholder:

- Visual: obscured thumbnail or non-image hatch, lock icon, and `Photo 1 · redacted`.
- Screen reader: `Photo attachment 1, content redacted, JPEG, 2.4 megabytes`.
- Action: `Reveal photo 1 temporarily`.
- Reveal expires when the message leaves the viewport, the app backgrounds, the session locks, or after 30 seconds.
- Original filename, camera date, GPS, device model, OCR, and generated descriptions are not exposed in the default transcript or accessibility tree.

This matters because iPhone photos can contain embedded location metadata. Apple states that a third party receiving the photo may gain access to that metadata. [Apple location-metadata guidance](https://support.apple.com/guide/personal-safety/manage-location-metadata-in-photos-ips0d7a5df82/web)

The server must decode and rewrite accepted images, baking orientation and discarding EXIF, XMP, GPS, depth, thumbnail, edit-history, and Live Photo associations. OWASP recommends allowlisting, signature verification, random server filenames, size limits, least-privilege storage, and image rewriting rather than trusting the supplied MIME type. [OWASP file-upload guidance](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html), [OWASP input-validation guidance](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

### 1.6 VoiceOver needs coarse-grained announcements, not token or byte chatter

Use a persistent empty `role="status"` region for normal state changes. A status region is implicitly polite and atomic, and its updates should not receive focus. [ARIA `status` reference](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role)

Recommended announcements:

- `2 photos attached locally.`
- `Preparing 2 photos.`
- `Uploading, 25 percent.`
- `Uploading, 50 percent.`
- `Uploading, 75 percent.`
- `Photos sent to Pi.`
- `Upload canceled. Photos remain attached locally.`

Do not announce every network progress event. Use a native `<progress>` element for visual and programmatic progress and update the live-region text only at meaningful milestones. W3C’s upload technique explicitly calls for announcing progress without moving focus. [W3C ARIA25 upload technique](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA25), [`progressbar` reference](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/progressbar_role)

Use `role="alert"` once for blocking failure, without adding redundant `aria-live="assertive"`; that combination can double-speak in iOS VoiceOver. [ARIA live-region guidance](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions)

For the chat transcript:

- Expose the completed semantic conversation as a named `role="log"`.
- Do not mutate the accessible log token-by-token.
- Keep the visual streaming fragment `aria-hidden="true"`.
- Append the complete assistant message to the semantic log once, then announce `Pi response complete`.

A `log` is designed for ordered chat history and is implicitly polite. [`log` role reference](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/log_role)

### 1.7 Focus must remain predictable across the system picker, modal sheet, errors, and deletion

The source sheet should use React Aria modal/dialog behavior:

- Move focus into the sheet, initially to `Choose photos`.
- Contain focus while open.
- Escape or Cancel closes it.
- Restore focus to `Attach media`.

React Aria’s focus utilities support containment and restoration, matching the ARIA modal-dialog pattern. [React Aria `FocusScope`](https://react-aria.adobe.com/FocusScope), [WAI modal-dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

After the Photos or Camera UI returns:

- If focus returned to a meaningful element, preserve it.
- If WebKit leaves focus on `body`, restore focus to `Attach media`.
- Do not jump focus to the new preview; announce the selection instead.
- The next swipe/tab after Attach reaches the first attachment card and its Remove button.

After removal:

- Focus the next attachment’s Remove button.
- If none remains, focus Attach.
- Announce `Photo 2 removed. One photo remains.`

Upload errors remain inline and persistent. Announce them, but do not move focus unless the current control disappeared. Alerts should not steal focus. [WAI alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)

### 1.8 Dynamic Type requires an explicit PWA strategy because the typography is fixed

Apple expects interfaces to support at least 200% text enlargement and to reflow without truncation. [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility), [Apple typography guidance](https://developer.apple.com/design/human-interface-guidelines/typography)

WebKit offers Dynamic Type CSS font shorthands such as `font: -apple-system-body`, but those replace the chosen font with Apple’s system text style. [WebKit Dynamic Type guidance](https://webkit.org/blog/3709/using-the-system-font-in-web-content/)

Because Pi Remote’s fixed system uses Inter and Source Serif 4:

- Keep `-webkit-text-size-adjust: 100%`; never use `none`.
- Do not disable pinch zoom with `user-scalable=no` or `maximum-scale=1`.
- Use `rem` for type and spacing.
- Provide `Text size: 100%, 115%, 130%, 150%, 200%` in Accessibility settings.
- Set the base composer and transcript text to approximately 17 CSS pixels at 100%.
- At 150% and above, convert the attachment rail from a horizontal row into a vertical list.
- At 200%, retain full labels, progress, Remove, Retry, and Send without two-dimensional scrolling at 320 CSS pixels.

WCAG AA requires 200% resizing and reflow at a width equivalent to 320 CSS pixels. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

Inter and Source Serif should be followed by script-capable system fallbacks. Never force letter spacing or Latin font metrics onto Arabic, Hebrew, Japanese, or Chinese text.

### 1.9 Contrast and motion require special handling with the fixed palette

Using the WCAG relative-luminance formula, clay `#d97757` against bone `#f8f8f6` is approximately **2.94:1**. It therefore fails:

- 4.5:1 for normal text; and
- the 3:1 non-text threshold for essential component boundaries.

White on clay is approximately 3.12:1, also insufficient for normal text. Use carbon ink for text and essential icons on clay. On bone, use a carbon border or adjacent non-color cue around clay controls. Clay may remain decorative or serve as a filled background when the foreground carbon token passes 4.5:1. WCAG requires 4.5:1 for normal text and 3:1 for large text and essential non-text UI. [WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum), [WCAG 2.2 non-text contrast](https://www.w3.org/TR/WCAG22/)

Every state needs text or shape in addition to color:

- Ready: check icon + `Ready`.
- Uploading: progress bar + `Uploading`.
- Rejected: warning icon + reason.
- Redacted: lock icon + hatch pattern + `Redacted`.

With `prefers-reduced-motion: reduce`:

- Remove sheet translation and scale.
- Use an immediate opacity change.
- Disable shimmer, rotating spinners, thumbnail zoom, and spring bounce.
- Keep the determinate progress bar, but update its width without transition.

Apple recommends replacing spatial transitions with fades and reducing repetitive, scaling, and bouncing motion. [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility)

### 1.10 RTL and untrusted filenames are both layout and security concerns

Apply the locale at the root through React Aria’s `I18nProvider`, and keep `<html lang>` and `<html dir>` synchronized. React Aria localizes built-in accessibility strings and interaction direction but leaves application strings and styling to the app. [React Aria internationalization](https://reactspectrum.blob.core.windows.net/reactspectrum/51e34f08766d940136a5e6b24d752546b5966441/docs/react-aria/internationalization.html)

Requirements:

- Use logical CSS properties: `padding-inline`, `margin-inline`, `inset-inline`, `border-inline`.
- Let flex/grid mirror from document direction.
- Mirror directional chevrons; do not mirror camera, paperclip, lock, remove, or progress icons.
- Use localized plural messages rather than concatenation.
- Use `Intl.NumberFormat` for percentages and file sizes.
- Use `Intl.ListFormat` for summaries such as `2 photos and 1 screenshot`.
- Render natural-language user content with `dir="auto"`.
- Render MIME types, IDs, hashes, and error reference codes as isolated LTR text.
- Wrap any displayed filename in `<bdi dir="auto">`.

W3C recommends document-level `dir` for RTL layouts and bidi isolation for inserted strings whose direction is unknown. [W3C RTL guidance](https://www.w3.org/International/questions/qa-html-dir.en.html), [W3C strings and bidi](https://www.w3.org/international/articles/strings-and-bidi/)

Never use the original filename as a server path or default transcript label. For optional details:

- Normalize to Unicode NFC.
- Strip control characters and bidi overrides.
- Limit display to 80 grapheme clusters using `Intl.Segmenter`.
- Preserve the sanitized extension during middle truncation.
- Give the visual string `overflow-wrap:anywhere; min-inline-size:0`.
- Keep the complete sanitized value in the accessible description.

## 2. Concrete build-phase specification

### 2.1 Component structure

```text
Composer
├── Attach media button
├── Attachment draft list
│   └── Attachment card
│       ├── Decorative local thumbnail
│       ├── Neutral label: Photo 1
│       ├── Localized type and size
│       ├── State text/progress
│       └── Remove or Retry button
├── Prompt textarea
├── Send button
├── Persistent polite status region
└── Persistent inline error region
```

Use React Aria Components for Button, FileTrigger, Modal, Dialog, and focus handling. Do not replace native buttons with clickable `div` elements; React Aria’s button behavior exists to normalize keyboard, touch, focus, and ARIA behavior. [React Aria button behavior](https://react-aria.adobe.com/Button/useButton.html)

### 2.2 State and focus contract

| State | Visible UI | Accessible announcement | Focus |
|---|---|---|---|
| Idle | Attach + empty composer | None | Existing composer order |
| Source sheet | Choose photos, Take photo, Cancel | Dialog title: `Attach media` | First source action |
| Picker canceled | Composer unchanged | None | Restore Attach if focus is lost |
| Selected locally | Thumbnail cards marked `Ready` | `N photos attached locally` | Preserve trigger/composer focus |
| Client rejection | Persistent card/error with reason | One alert | Preserve focus |
| Preparing | Static preparation icon/text | `Preparing N photos` | Preserve focus |
| Ticketing | `Securing upload` | One polite announcement | Preserve focus |
| Uploading | Aggregate `<progress>` and per-file state | 25/50/75% milestones | Preserve focus |
| Verifying | `Checking photos` | One polite announcement | Preserve focus |
| Committing | `Sending to Pi` | One polite announcement | Preserve focus |
| Sent | Draft cleared; redacted transcript cards | `Photos sent to Pi` | Composer textarea |
| Network failure | `Couldn’t send · Retry` | One alert | Preserve focus; Retry is next |
| Revision conflict | `Conversation changed · Review latest` | One alert | Preserve focus |
| Security rejection | Stable localized reason; no Retry if permanent | One alert | Preserve focus |
| Canceled upload | Draft remains local | `Upload canceled; photos remain attached` | Cancel/Retry location |

All state copy must remain visible until the state changes or the user dismisses it. No auto-expiring error toasts.

### 2.3 File policy

| Property | Required value |
|---|---|
| Maximum selected | 4 still images per message |
| Maximum source size | 20 MiB each |
| Maximum source aggregate | 40 MiB |
| Accepted picker inputs | `.jpg,.jpeg,.png,.webp,.heic,.heif,image/jpeg,image/png,image/webp,image/heic,image/heif` |
| Maximum decoded area | 48 megapixels |
| Normalized dimensions | Maximum 2000×2000 pixels, preserving aspect ratio |
| Maximum normalized size | 6 MiB each |
| Normalized outputs | JPEG or PNG only |
| JPEG quality | 85, with orientation baked |
| Metadata | Strip all non-pixel metadata |
| Animation | Reject in version 1 |
| Live Photos | Still component only; disclose before Send |
| Video/audio/document/SVG/DNG | Reject before ticket issuance |
| Model capability | Must include image input at ticket issuance and commit |

The 2000×2000 normalized maximum aligns with Pi’s default image auto-resize behavior. [Pi image settings](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/settings.md)

### 2.4 Mutation protocol

#### Ticket issuance

```http
POST /v1/sessions/{sessionId}/attachment-sets
Authorization: Bearer <session credential>
Content-Type: application/json
If-Match: "<sessionRevision>"
Idempotency-Key: <draftId>
```

```json
{
  "expectedRevision": 184,
  "draftId": "random-128-bit-id",
  "files": [
    {
      "clientId": "local-random-id",
      "declaredType": "image/heic",
      "byteLength": 4832911,
      "sha256": "base64url-digest"
    }
  ]
}
```

The host must verify:

- authenticated tailnet client;
- current session;
- host and extension plan-mode enforcement;
- exact revision;
- model image capability;
- count and byte ceilings;
- ticket quota;
- nonce and draft idempotency.

The response contains:

- one single-use, attachment-specific PUT capability per file;
- one single-use commit capability;
- a 60-second expiry;
- no filesystem path.

A ticket is bound to session ID, revision, draft ID, file digest, byte length, part ordinal, declared type, and authenticated client. Reuse, expiry, changed revision, or changed request metadata returns a stable machine error code and no partial success.

#### Part upload

```http
PUT /v1/attachment-sets/{setId}/parts/{partId}
Authorization: UploadTicket <single-use-token>
Content-Length: <exact-length>
Digest: sha-256=<digest>
```

The relay must:

1. Stream into a private relay staging directory outside the project.
2. Use a generated identifier and mode `0600`.
3. Enforce the content length while streaming.
4. Recompute the digest.
5. Inspect magic bytes.
6. Decode inside a resource-limited worker.
7. reject polyglots, malformed files, animation, or excessive dimensions;
8. rewrite to normalized JPEG/PNG;
9. delete the source bytes immediately after normalization;
10. retain normalized bytes for at most 15 minutes before commit.

Interrupted or failed PUTs consume their capability and delete the partial body. Retry requires a fresh ticket, preventing replay ambiguity.

#### Atomic prompt commit

```http
POST /v1/sessions/{sessionId}/messages
Authorization: UploadCommit <single-use-token>
If-Match: "<sessionRevision>"
Idempotency-Key: <draftId>
```

```json
{
  "expectedRevision": 184,
  "text": "What caused this layout overflow?",
  "attachmentSetId": "opaque-id",
  "attachmentIds": ["opaque-photo-id"]
}
```

Commit succeeds only if every attachment is verified and the session revision still matches. The relay reads normalized bytes into memory, base64-encodes them, and calls Pi RPC with `message` plus `images`. No project-visible path is created.

Only after Pi acknowledges the prompt may the relay:

- append a redacted descriptor to its durable transcript;
- increment the session revision;
- delete staged normalized files;
- acknowledge success to the PWA.

On ambiguous Pi failure, the idempotency key determines whether to return the prior result or fail closed; never resubmit blindly.

### 2.5 Persistence and transcript schema

Durable transcript entry:

```json
{
  "kind": "attachment-redacted",
  "attachmentId": "opaque-id",
  "ordinal": 1,
  "mediaClass": "image",
  "normalizedType": "image/jpeg",
  "sizeBucket": "2–5 MB",
  "widthBucket": "large",
  "status": "delivered",
  "contentRetained": false
}
```

Forbidden in the transcript, browser persistence, service-worker cache, analytics, logs, crash reports, URLs, and accessible tree:

- original bytes or base64;
- preview object URL;
- original filename;
- SHA-256 digest;
- EXIF;
- OCR;
- GPS;
- local path;
- raw server exception;
- ticket or commit token.

The preview should use an object URL held only in component state. Revoke it on removal, successful send, session change, app lock, or component unmount.

### 2.6 Attachment semantics

Each draft attachment is a list item and named group:

```text
Photo attachment 1
JPEG, 2.4 megabytes
Ready
Remove photo 1, button
```

The thumbnail should use `alt=""` because the card already provides the accessible identity and the app does not have an honest textual description of the image.

If the user adds an optional description, expose:

```text
User description: Login screen showing an untranslated error.
```

Do not generate alternative text through background OCR or a model. Generated descriptions can disclose content unexpectedly and may be inaccurate.

A sent, redacted card should expose:

```text
Photo attachment 1
Content redacted
JPEG, 2.4 megabytes
Reveal photo 1 temporarily, button
```

Reveal must be an ordinary button, not a long-press or swipe-only gesture. Apple explicitly recommends onscreen alternatives for gesture actions. [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility)

### 2.7 Layout, type, and keyboard behavior

- Composer height is content-driven; do not impose a fixed height.
- Use `min-block-size: 100dvh` with a tested fallback.
- Add `env(safe-area-inset-bottom)` to composer padding.
- Measure the sticky composer using `ResizeObserver`.
- Apply the measured value to transcript `scroll-padding-block-end`.
- At 150–200% text, stack attachment metadata and actions rather than truncating them.
- Let filenames and localized messages wrap; never make a filename determine card width.
- At 320 CSS pixels, the only permitted horizontal scrolling is inside user-authored code blocks, not the composer or attachment controls.
- When the software keyboard opens, the focused textarea, attachment action, and focus outline must remain fully visible.

Safe-area environment values exist to keep content out of iPhone cutouts and system UI. W3C recommends `scroll-padding` to prevent sticky content from obscuring focused controls. [CSS safe-area reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env), [W3C focus-unobscured technique](https://www.w3.org/WAI/WCAG22/Techniques/css/C43)

### 2.8 Visual and motion specification

- Attach button: 44×44 minimum, visible press state, paperclip plus localized accessible name.
- Source sheet: bone/carbon surface, carbon boundary; clay only for emphasis.
- Preview thumbnail: 64×64 at standard size, 72×72 at enlarged text, `object-fit: cover`.
- Remove: visible × icon plus accessible name; destructive state is icon, text, and color.
- Focus indicator: two-color 2px inner/2px outer ring so one edge contrasts against both component and page.
- Upload progress: 4px visual bar plus textual percentage; `<progress>` remains programmatically named.
- Redaction: hatch/lock pattern rather than blur alone.
- Normal motion: sheet fade plus at most 8px translation over 160ms; thumbnail insertion opacity over 120ms.
- Reduced motion: zero translation, zero scale, zero shimmer, zero rotation, and no progress-width transition.

### 2.9 Localization contract

All user-facing and accessible strings are translation keys, including:

- button labels;
- dialog title;
- picker actions;
- plural attachment counts;
- progress milestones;
- validation errors;
- retry and revision-conflict text;
- redaction/reveal labels;
- model-capability reason;
- image-only Send label;
- size-limit explanation.

Server responses return error codes such as:

```text
ATTACHMENT_TOO_LARGE
TYPE_NOT_ALLOWED
IMAGE_DECODE_FAILED
ANIMATION_NOT_ALLOWED
MODEL_NO_IMAGE_INPUT
REVISION_MISMATCH
TICKET_EXPIRED
TICKET_REUSED
UPLOAD_INCOMPLETE
PLAN_MODE_REQUIRED
```

The client maps codes to localized copy. Never display or speak the server’s raw error message.

Use ICU-style pluralization; do not construct `count + " photos"`. Test at least:

- English;
- German pseudo-expansion at +40%;
- Arabic and Hebrew RTL;
- Japanese;
- a pseudo-locale with doubled text and accented glyphs.

### 2.10 Objective release gates

The feature passes only if all of the following are reproducible:

- VoiceOver can select gallery, camera, remove, retry, cancel, and reveal without touch exploration guessing.
- Source-sheet close restores focus to Attach.
- Selection and progress announcements occur once at the specified milestones.
- Streaming assistant tokens are not repeatedly announced.
- Every interactive target is at least 44×44 CSS pixels.
- No focused control is obscured by the composer or keyboard.
- At 200% text and 320 CSS pixels, all attachment functions remain available without horizontal page scrolling.
- Arabic and Hebrew layouts mirror while hashes, MIME types, and mixed-direction filenames remain readable.
- German pseudo-localization produces no clipping or icon overlap.
- `prefers-reduced-motion: reduce` produces no transform, scale, shimmer, rotation, or spring animation.
- Clay is never the sole boundary between a control and bone.
- Wrong extension, spoofed MIME, malformed image, decompression bomb, oversized file, animated file, expired ticket, reused ticket, and stale revision all fail closed.
- Selecting and then canceling creates no relay file or transcript entry.
- No original filename, metadata, ticket, digest, image bytes, or base64 appears in relay logs, browser storage, service-worker cache, crash output, or persistent Pi JSONL.
- A non-vision model cannot accept or silently discard an attachment.
- Network retry cannot duplicate the Pi prompt.
- The plan-mode enforcement extension remains active for the complete image-bearing turn.

## 3. Divergent / minority ideas worth considering

### 3.1 Privacy-first abstract previews

Offer an accessibility/privacy setting that replaces local thumbnails with neutral cards immediately after selection. A `Reveal locally` button gives temporary visual access. This protects against shoulder surfing and bright-image flashes while retaining mistake recovery.

### 3.2 “Send description only”

Allow the user to attach a photo locally, manually write a description, then choose `Send description without photo`. This supports sensitive screenshots, users on constrained networks, and users who want Pi to reason from a curated description rather than raw pixels.

It must be explicit and must not use hidden OCR.

### 3.3 Per-attachment retention consent

Provide two choices at Send:

- `Use once` — bytes exist only for the active Pi turn.
- `Keep encrypted for this session` — permits later rehydration but requires an encrypted attachment store, retention disclosure, and a Delete action.

`Use once` should remain the default.

### 3.4 Single-image default with an advanced multi-select option

Four-image selection increases network cost, focusable-card count, and screen-reader verbosity. A single-image default with `Select multiple` as an explicit secondary action could better fit a remote coding-agent workflow, where screenshots are usually inspected sequentially.

### 3.5 User-authored spoken descriptions

An optional `Describe for transcript` field could become both:

- the attachment’s accessible description; and
- a text block sent beside the image to Pi.

This gives blind users control over how an attachment is identified and gives Pi more task context without inventing model-generated alt text.

### 3.6 A dedicated ephemeral vision turn

Instead of teaching the main persistent Pi session to retain image content, run the image through a temporary in-memory Pi turn and inject only a user-approved textual result into the durable session. This sharply limits persistence but changes conversational semantics and must be labeled as `Analyze privately`, not presented as a normal attachment.

## 4. Open questions and risks

1. **Persistent-session architecture is the primary blocker.** Will Pi Remote accept in-memory Pi sessions plus a relay-owned redacted transcript, or must Pi core gain a redacting persistence adapter?

2. **Video scope must be decided explicitly.** “Media” suggests video, but current Pi message types expose image input only. An isolated frame-extraction pipeline is materially larger and riskier than image upload.

3. **HEIC conversion needs an audited decoder.** Which sandboxed library and operating-system package will perform HEIC/HEIF decoding, and what CPU, memory, pixel, and wall-clock limits will contain malformed inputs?

4. **Model changes during drafting need a UX decision.** If the user attaches images and then selects a text-only model, should attachments remain local while Send is disabled, or should the app offer to remove them?

5. **Live Photos need device testing.** Confirm exactly what iOS Safari and the installed PWA return for gallery selection and camera capture across supported iOS versions.

6. **Dynamic Type remains imperfect with fixed custom fonts.** The in-app text-scale control is necessary, but it is not identical to automatic native Dynamic Type. Decide whether an optional `Use system typography` accessibility setting may override Inter and Source Serif.

7. **Reveal authorization is unresolved.** Should revealing a redacted transcript attachment require only a tap, recent device/session unlock, or a fresh one-use reveal ticket?

8. **Context continuity after deletion needs definition.** Pi may retain an image in active memory after relay bytes are deleted. Specify whether `Use once` means deletion after provider submission, after the complete Pi turn, or after the in-memory session ends.

9. **Service-worker behavior must be audited.** Upload endpoints, preview URLs, and attachment responses must bypass all runtime caching even while the rest of the PWA remains offline-capable.

10. **Accessibility of failure recovery needs real-device validation.** VoiceOver behavior after returning from Photos/Camera varies by WebKit version; test browser Safari and standalone display mode separately.

11. **Font coverage must be verified.** Inter and Source Serif 4 do not guarantee acceptable rendering for every target script. Arabic, Hebrew, CJK, emoji, combining marks, and mixed-script filenames need visual and VoiceOver testing.

12. **Mobbin evidence gap.** Mobbin’s authenticated API/MCP returns screen images and stable screen links, but its public discovery shell did not expose usable Claude or Kimi attachment-screen URLs in this pass. No screen-specific Mobbin assertion has therefore been fabricated. [Mobbin API documentation](https://docs.mobbin.com/api/quickstart), [Mobbin public iOS discovery](https://mobbin.collaboo.co/discover/apps/ios/latest)

## 5. Sources

### Apple and iPhone

- [Apple Human Interface Guidelines — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Apple Human Interface Guidelines — Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [Apple Human Interface Guidelines — VoiceOver](https://developer.apple.com/design/human-interface-guidelines/voiceover)
- [Apple — Manage location metadata in Photos](https://support.apple.com/guide/personal-safety/manage-location-metadata-in-photos-ips0d7a5df82/web)
- [Apple — Using HEIF or HEVC media](https://support.apple.com/en-gb/116944)
- [WebKit — Using the System Font in Web Content](https://webkit.org/blog/3709/using-the-system-font-in-web-content/)

### Accessibility and internationalization standards

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WCAG — Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG — Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
- [W3C — Upload progress live-region technique](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA25)
- [W3C — Focus Not Obscured with scroll-padding](https://www.w3.org/WAI/WCAG22/Techniques/css/C43)
- [WAI-ARIA modal-dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [MDN — ARIA status role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role)
- [MDN — ARIA log role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/log_role)
- [MDN — ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions)
- [W3C — Structural markup and RTL text](https://www.w3.org/International/questions/qa-html-dir.en.html)
- [W3C — Strings and bidirectional text](https://www.w3.org/international/articles/strings-and-bidi/)

### Web and React Aria implementation

- [React Aria — FileTrigger](https://react-spectrum.adobe.com/v3/FileTrigger.html)
- [React Aria — Internationalization](https://reactspectrum.blob.core.windows.net/reactspectrum/51e34f08766d940136a5e6b24d752546b5966441/docs/react-aria/internationalization.html)
- [React Aria — FocusScope](https://react-aria.adobe.com/FocusScope)
- [MDN — File input](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file)
- [MDN — `accept` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept)
- [MDN — `capture` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture)
- [MDN — CSS environment and safe-area variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env)

### Security

- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

### Pi and remote-agent prior art

- [Pi RPC image protocol](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md)
- [Pi SDK and in-memory sessions](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/sdk.md)
- [Pi session persistence format](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/session.md)
- [Pi image settings](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/settings.md)
- [Pi image tools — local preview before sending](https://github.com/MasuRii/pi-image-tools)
- [MobileCLI — phone photo/file/camera upload to host](https://github.com/MobileCLI/mobilecli)
- [grok-remote — PWA upload and image content blocks](https://github.com/daniel-farina/grok-remote)
- [claude-code-web — picker, paste, and drag/drop attachments](https://github.com/fafawlf/claude-code-web)

### Product benchmarks and Mobbin

- [Claude — Upload files and photos](https://support.claude.com/en/articles/8241126-upload-files-to-claude)
- [Claude — iOS photo controls and shortcuts](https://support.claude.com/en/articles/10263469-use-claude-app-intents-shortcuts-and-widgets-on-ios)
- [Kimi — Multimodal input](https://www.kimi.com/help/getting-started/agentic-chat)
- [Mobbin API — screen-search access and returned screen links](https://docs.mobbin.com/api/quickstart)
- [Mobbin public iOS discovery](https://mobbin.collaboo.co/discover/apps/ios/latest)
