<!-- provenance: external-CLI orchestration pass; original file iter-10-grok.md -->
> **Source pass 10** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-10-grok.md`.

<!-- F5-media-upload | model=grok | lens=interaction-gesture | iter 10/15 | 2026-08-15T20:26:47.910Z -->

# Iteration 10 — Interaction + gesture design  
**Lens:** every state, transition, touch target, long-press, swipe, keyboard, focus order, and micro-interaction for iPhone PWA media attach  
**Stack:** React 19 + Vite + Tailwind 4 + react-aria-components · ink-on-parchment · read-only-by-default mutations  
**Mobbin MCP:** unavailable this pass (empty tool catalog). Public Mobbin URLs below are cited from crawl, not live `search_screens` calls.

---

## 1. Findings for this lens

### 1.1 The composer already owns the only legal attach entry — and it is already over-committed

Pi Remote’s composer is one sticky tray: left `+` (`aria-label="Mode and commands"`), growing `textarea`, circular send/steer/stop. The `+` is a 2.5rem (40 CSS px) circle; send matches. ([`SessionComposer.tsx`](apps/pi-remote-web/src/SessionComposer.tsx), [`style.css` `.composer-plus` / `.composer-primary`](apps/pi-remote-web/src/style.css).)

Apple’s published hit-target floor is **44 × 44 pt**, not 40. ([Apple HIG Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons); [Apple UI Design Dos and Don’ts](https://developer.apple.com/design/tips/).) WCAG 2.2 **2.5.8 Target Size (Minimum)** is 24 × 24 CSS px at AA; **2.5.5** is 44 × 44 at AAA. ([W3C Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).) Claude iOS and Kimi mobile both put the plus/paperclip in a **44 pt** hit area. ([internal reconstruction](docs/design-reference/mobile-chat-apps/research-gpt-luna.md); [Kimi new-user guide](https://www.kimi.com/zh-cn/help/new-user-guide/overview).)

The council already reserved `+` → Attach *only when a real path exists*. ([council-gpt-sol.md](docs/design-reference/mobile-chat-apps/council-gpt-sol.md).) Native Claude puts Camera / Photos / Files behind that same plus. ([Claude Help: Get started](https://support.claude.com/en/articles/8114491-get-started-with-claude); Mobbin flow [Chatting with Claude (image input)](https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1).) ChatGPT iOS also uses `+` for Attach Photos / Take Photo / Attach Files, not a paperclip. ([DEV teardown](https://dev.to/amullagaliev/osd700-how-llms-and-messengers-handling-attachments-ui-4264); Mobbin [ChatGPT iOS chat interface](https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1).)

**Gesture collision, not a visual one:** adding a second left icon (paperclip *and* `+`) splits the thumb cluster below 44 pt and fights Claude’s silhouette. Long-press-on-`+` = attach is worse: iOS context menus are **touch-and-hold**, and HIG says give an item either a context menu *or* an edit menu, not both. ([Apple HIG Context menus](https://developer.apple.com/design/human-interface-guidelines/context-menus).) The `+` already opens a RAC `Popover`/`Dialog`. Binding a second hold-gesture on the same target is undiscoverable and fights VoiceOver’s custom actions.

### 1.2 A PWA cannot copy Claude’s Camera/Photos rows without creating a double sheet — unless capture is split

Native apps own `PHPickerViewController` / `UIImagePickerController`. A PWA does not. WebKit’s file input presents `WKFileUploadPanel`, whose action-sheet titles (when `accept` includes images and `capture` is unset) are:

- **Photo Library**
- **Take Photo** (or **Take Photo or Video** if video is accepted)
- **Browse / Choose Files**

Source: WebKit [`WKFileUploadPanel.mm` `currentAvailableActionTitles`](https://github.com/WebKit/WebKit/blob/main/Source/WebKit/UIProcess/ios/forms/WKFileUploadPanel.mm).

HTML `capture` changes that sheet. If `capture` is present (`user` | `environment`), the UA prefers the camera and **skips the library choice**. ([MDN `<input type="file">` `capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file); [web.dev media capturing](https://web.dev/articles/media-capturing-images).) React Aria `FileTrigger` maps this 1:1 via `defaultCamera`. ([React Aria FileTrigger](https://react-aria.adobe.com/FileTrigger).)

Apple HIG Sheets: **display only one sheet at a time**; closing a sheet should return to the parent, not to another sheet. ([Apple HIG Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets).)

Therefore the naive Claude clone — tap `+` (app popover) → tap Photos → iOS action sheet → PHPicker — is **two author-owned layers plus one system sheet**. That is the opposite of native feel on a PWA.

**The gesture-native PWA mappings are only two:**

| Pattern | What the thumb does | System sheet |
|---|---|---|
| **A. Split FileTriggers** | `+` → **Photos** (no `capture`, `multiple`) or **Camera** (`capture="environment"`, single) | Skipped / collapsed to the right picker |
| **B. One Attach row** | `+` → **Attach** (no `capture`) | WebKit sheet is the menu: Photo Library / Take Photo / Browse |

Pattern A matches Claude/Kimi *labels* without stacking sheets. Pattern B matches iOS itself and is one tap cheaper. Do not do both.

The enrollment QR control already uses Pattern B’s markup: `<label>` wrapping `<input type="file" accept="image/*">` with **no** `capture`. ([`App.tsx` enrollment](apps/pi-remote-web/src/App.tsx).) That is the only file input in the product today. Copy its activation model, not a synthetic `input.click()` from inside a modal.

### 1.3 FileTrigger’s `click()` is the wrong activation primitive on iOS if it lives inside the tools dialog

`FileTrigger` clears `input.value` then calls `input.click()` from the pressable child’s press. ([FileTrigger source](https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/FileTrigger.tsx).) That is a valid user activation *if* it is the same turn as the tap. It is not valid if:

1. The tools `Dialog` closes first (focus moves, activation token dies).
2. The hidden input is `display: none` / off-screen. MDN’s own file-input guide hides with **`opacity: 0`**, because `display: none` / `visibility: hidden` is treated as non-interactive by AT and some UAs. ([MDN file input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file).)
3. Chrome on iOS: `FileTrigger` `onSelect` missing on first pick, then a `cancel` on later picks. ([Stack Overflow, RAC 1.2.1 / Chrome iOS 140](https://stackoverflow.com/questions/79775667/react-aria-filetrigger-onselect-not-firing-on-first-file-selection-in-chrome-ios).)
4. `FileTrigger` inside `DropZone` scrolls a hidden a11y target into view and jumps the transcript. ([adobe/react-spectrum#10092](https://github.com/adobe/react-spectrum/issues/10092).)

**Executable implication:** keep two visually-hidden `<input type="file">` nodes as **siblings of the tray**, not children of `ComposerTools` `Dialog`. Menu rows are RAC `Button`s whose `onPress` (up-event) closes the popover *and* calls `input.click()` in the same synchronous stack. Prefer a wrapping `<label>` for the Photos row if `click()` flakes in standalone PWA.

React Aria `usePress` activates on **pointer up**, which is exactly WCAG **2.5.2 Pointer Cancellation** (no down-event execute; slide-off cancels). ([W3C Understanding 2.5.2](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html).) Do not open the picker on `touchstart` / `pointerdown` to “feel faster.”

### 1.4 On iPhone, the dominant coding-agent attach gesture is not the gallery — it is screenshot → long-press Paste

Hardware side buttons (or AssistiveTouch) capture a screenshot. The system banner offers copy. The composer’s textarea already has iOS’s **touch-and-hold → Select / Paste / …** edit menu. There is **no** paste handler on `SessionComposer` today.

Safari often leaves `clipboardData.files` empty and puts the image on `clipboardData.items` (`kind === 'file'`, `type` starting `image/`). If you do not `preventDefault()`, the textarea inserts the **filename** (`image.png`). ([clipboard items vs files, Safari](https://codesnatch.io/community/code-snippets/paste-image-from-clipboard-handler).)

iOS has **no Web Share Target**. Users cannot Share from Photos into this PWA. Drag-from-Photos is an iPad split-view behavior, not iPhone. Advertising a drop zone on iPhone is a dead gesture.

Kimi Code’s web composer treats paste/drag as no-ops unless `uploadImage` is provided, and **hides the attach button** in that case — same capability-gating rule the council already set. ([Kimi `Composer.vue`](https://github.com/xy200303/spec-kimi-code/blob/main/apps/kimi-web/src/components/chat/Composer.vue); [`useAttachmentUpload.ts`](https://github.com/xy200303/spec-kimi-code/blob/main/apps/kimi-web/src/composables/useAttachmentUpload.ts).) Open remote-CLI PWAs that already learned this: supermux (“native file picker on mobile, tap-to-upload action sheet… paste-image-from-clipboard”), concierge (long-press message actions + uploads over Tailscale). ([sanderbz/supermux](https://github.com/sanderbz/supermux); [nanodan/concierge](https://github.com/nanodan/concierge).)

### 1.5 Enter-to-send will fire the instant attachments exist

Current handler:

```119:123:apps/pi-remote-web/src/SessionComposer.tsx
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
```

There is no `enterKeyHint`, no IME `isComposing` / keyCode 229 guard, no coarse-pointer branch. On iPhone the Return key is a single-pointer path-based *looking* control that users treat as newline (iMessage, WhatsApp, Slack, ChatGPT, Claude.ai). Shipping Enter-to-send on a touch-primary device is a known composer-library defect. ([assistant-ui#4091](https://github.com/assistant-ui/assistant-ui/issues/4091).) Kimi’s web composer only makes Enter = send on desktop; expanded editor forces newline + explicit send. ([Kimi `Composer.vue` Enter comments](https://github.com/xy200303/spec-kimi-code/blob/main/apps/kimi-web/src/components/chat/Composer.vue).)

Council already specified: *Return on mobile inserts a newline; desktop keeps Enter-to-send.* That rule becomes **mandatory** once a chip can sit above the field: the first Return after picking a screenshot otherwise tickets a mutation with a half-typed caption.

Also ignore Enter while `event.nativeEvent.isComposing` (Chinese/Japanese IME on iOS).

### 1.6 Keyboard geometry will eat the new chip row unless the tray is pre-lifted

Composer is `position: sticky; bottom: 0` with `padding-bottom: max(var(--space-3), env(safe-area-inset-bottom))`. Viewport meta is `width=device-width, initial-scale=1.0` — **no** `interactive-widget`, **no** `viewport-fit=cover`. ([`index.html`](apps/pi-remote-web/index.html).)

iOS Safari does not honor `interactive-widget=resizes-content` the way Chrome 108+ does. The layout viewport stays tall; the **visual** viewport shrinks; sticky/fixed footers sit under the keyboard. ([W3C css-viewport discussion, iPhone Safari 17.4](https://github.com/w3c/csswg-drafts/issues/10464); [SO polyfill thread](https://stackoverflow.com/questions/78844736/how-to-polyfill-interactive-widget-resizes-content-for-meta-viewport-tag-on).)

Working recipe used by chat PWAs: layout shell (`html, body { overflow: hidden }`, only the transcript scrolls) + **pre-lift on `mousedown`/`pointerdown` before focus** using last-known keyboard height + `focus({ preventScroll: true })` + `visualViewport` resize with an ~80 ms settle (emoji keyboard / globe key has no DOM event). ([Crscristi28/ios-pwa-keyboard-fix](https://github.com/Crscristi28/ios-pwa-keyboard-fix); [cameronapak ios-composer.md](https://github.com/cameronapak/polyfill-virtual-keyboard-api/blob/master/docs/ios-composer.md).)

Standalone PWA extra: first keyboard open can **permanently shrink** `innerHeight` / `dvh` until force-quit. ([DEV: iOS standalone PWA keyboard shrink](https://dev.to/cederhook/fixing-the-ios-standalone-pwa-keyboard-bug-that-shrinks-your-viewport-for-good-63d).) Attachment chips add ~56–72 pt of tray height. Without a lift, the chip **Remove** control is under the keyboard — a 44 pt target you cannot hit is not a target.

Picker return: iOS **dismisses** the keyboard. Do not auto-refocus the textarea (that re-opens the keyboard over the new chips and can retrigger the shrink bug). Leave focus on the chip that was just inserted, then a single tap on the field is the user’s choice. Announce via `aria-live="polite"`: “2 photos attached.”

### 1.7 Swipe-to-remove is illegal as the only remove path, and it fights the chip strip

WCAG **2.5.1 Pointer Gestures** (Level A): any path-based gesture (swipe-off chip, swipe-down lightbox, pinch-zoom preview) **must** have a single-pointer alternative (tap X, tap Close, tap +/−). ([W3C Understanding 2.5.1](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html).) **2.5.7 Dragging Movements** (AA): if reorder-by-drag is offered, offer buttons too.

iPhone also reserves **left-edge swipe** for system Back in standalone PWAs. A leading-edge swipe-to-delete on the first chip will steal Back.

Kimi’s chips: tap media → lightbox; generic file → open; explicit remove; uploading blocks send. ([Kimi `Composer.vue` chip primary action](https://github.com/xy200303/spec-kimi-code/blob/main/apps/kimi-web/src/components/chat/Composer.vue).) Mail-style swipe-delete is optional sugar **on top of** a 44 pt remove control, not instead of it. Horizontal chip overflow should be `overflow-x: auto; touch-action: pan-x; overscroll-behavior-x: contain` so it does not rubber-band the transcript.

### 1.8 Haptics will not make this feel native — pressed states will

`navigator.vibrate` is **not implemented** on iOS WebKit (re-proposal: [WebKit bug 288846](https://bugs.webkit.org/show_bug.cgi?id=288846)). Apple HIG haptics assume `UIFeedbackGenerator` in a native app. ([HIG Playing haptics](https://developer.apple.com/design/human-interface-guidelines/playing-haptics).) Switch-element Taptic hacks exist and are a11y-hostile (invisible `role=switch` under every button). The tray already has RAC `data-pressed` / `data-hovered` and 120 ms state transitions. That is the legal micro-interaction budget. Do not add a haptic dependency for attach.

### 1.9 Bytes cannot ride `prompt.submit` today — the send gesture must wait on a second ticketed lane

Host RPC already accepts images:

```12:48:packages/pi-rpc-protocol/src/types.ts
export interface ImageContent extends JsonObject {
  readonly type: 'image';
  readonly data: string;
  readonly mimeType: string;
}
export interface PromptCommand {
  readonly type: 'prompt';
  readonly message: string;
  readonly images?: readonly ImageContent[];
  ...
}
```

The **PWA** command does not: `PromptSubmitCommand` is `{ message, ticket, submissionId, sessionId, streamingBehavior? }`. HTTP body cap is **16_384 bytes**. ([`apps/pi-remote-relay/src/http/server.ts` `MAX_HTTP_BODY_BYTES`](apps/pi-remote-relay/src/http/server.ts).) A JPEG thumbnail already exceeds that. `images` appears nowhere in the web client. PromptService persists a redacted **text** user block only.

This is an interaction fact, not only a backend fact: if Send is tappable while chips are still local blobs, the user will watch the clay send spinner, see their text land, and lose the photo — the exact failure Claude Code’s mobile attach path is hitting now (preview on device, text arrives, image silently dropped). ([anthropics/claude-code#57882](https://github.com/anthropics/claude-code/issues/57882).)

Kimi’s send gate is the correct gesture: `canSubmit` requires every chip `fileId && !uploading && !error`; image-only send is allowed; failed upload keeps text + chips. ([Kimi `Composer.vue`](https://github.com/xy200303/spec-kimi-code/blob/main/apps/kimi-web/src/components/chat/Composer.vue).)

### 1.10 Plan mode and running turns change the primary control; attach must not

`showStop = running && !hasText`. An image-only draft must count as “has payload” so the primary control stays **Steer/Send**, not Stop. Attach during Plan is a *read* of pixels (UI screenshot → “what is this component?”) and must stay enabled; the mutation is still ticketed prompt submit, not a write to the workspace. Disable attach only when `connection !== 'live'` or snapshot/reconciling — same as the textarea — and **hide** the rows entirely until the upload lane exists (council: no dead affordances).

### 1.11 Transcript gestures for sent media are not the composer’s gestures

Council: user attachments sit with the user bubble; long-press currently reserved for timestamps / turn actions. ([council-gpt-sol.md](docs/design-reference/mobile-chat-apps/council-gpt-sol.md).) After send, the composer chips **must vanish** (they are a draft, not a second copy of the transcript). The transcript card is a **redacted** object: thumbnail from a relay preview URL, type/size, no EXIF map, no raw path. Long-press on that card: Preview / Share via `navigator.share({ files })` (iOS 15+ Safari) / Copy. Do not offer “Save to Photos” via `<a download>` — iOS PWAs do not reliably write the Camera Roll. Pinch-zoom in a lightbox needs +/−. Swipe-down-to-dismiss needs a Close button (2.5.1). Claude’s camera-permission screen is a **system** alert, not an in-app modal. ([Mobbin Claude camera access](https://mobbin.com/explore/screens/f2a2127a-3258-4ac9-aa6d-ca1494e25ead).) A PWA `capture` input uses the same system permission; never draw a fake permission dialog.

---

## 2. Concrete spec a build phase can execute

### 2.1 Affordances (iPhone, 390 pt)

| Control | Size | Activation | Notes |
|---|---|---|---|
| `+` | **44 × 44 pt** (change from 40) | tap = tools popover | `aria-label="Attach, mode, and commands"` once attach ships |
| Photos row | 44 pt min-height, full popover width | tap | closes popover, opens gallery input |
| Camera row | 44 pt min-height | tap | closes popover, opens camera input |
| Chip | 56 × 56 pt thumb + 44 × 44 pt remove | tap chip = preview; tap × = remove | remove may visually overlay the thumb **if** the 44 pt hit box is real (padding), not a 16 pt glyph |
| Send/Steer/Stop | **44 × 44 pt** | RAC `Button` up-event | unchanged morph rules, except payload includes ready chips |
| Lightbox Close | 44 × 44 pt, top-trailing, above safe-area | tap | plus swipe-down as extra |

Do **not** add a paperclip beside `+`. Do **not** bind attach to long-press on `+`.

`touch-action: manipulation` on `+`, send, chip ×, Photos/Camera rows (kills double-tap-zoom delay without disabling pan on the transcript).

### 2.2 Hidden inputs (two, never one with `capture`)

Place as visually-hidden (`opacity: 0; position: absolute; width: 1px; height: 1px; overflow: hidden;`) **siblings** of `.composer-tray`, not inside the popover.

**Photos**

```html
<input id="attach-library" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/gif"
       multiple />
```

No `capture`. `allowsMultiple` true. WebKit sheet/picker → Photo Library (and Browse as WebKit’s third action).

**Camera**

```html
<input id="attach-camera" type="file" accept="image/jpeg,image/png,image/webp"
       capture="environment" />
```

Single file. Skips library. Rear camera.

Trigger only from `Button onPress` / `<label for>` in the **same** event turn after `close()` on the RAC popover. Reset `.value = ''` before each open so re-picking the same screenshot fires `change`. Listen for `cancel` (MDN): restore prior focus, **no** chip changes, no error toast.

If `FileTrigger` is used, set `acceptedFileTypes` and `defaultCamera` as above, but **do not nest it in `Dialog`**. Keep a native `onChange` fallback: Chrome iOS `onSelect` is not trustworthy.

Capability gate: if `/api/attachments` is absent, omit both rows and both inputs. Paste handler is a no-op. Same as Kimi’s `uploadImage == undefined`.

### 2.3 State machine (composer-local; fail closed)

Chip `status`: `staging` → `uploading` → `ready` | `error` | `rejected`.

| Event | Transition | UI |
|---|---|---|
| Picker `change` with 1..N files | each file → `staging` immediately (blob URL thumb) | chips insert LTR, 120 ms opacity/translateY; `prefers-reduced-motion: reduce` = instant |
| Client MIME/size fail | `rejected` | chip with “Not a supported photo”; × still 44 pt; no upload |
| Auto-upload starts | `uploading` | determinate arc on thumb (or 8 pt clay hairline progress); send disabled |
| Ticket + POST 2xx with `attachmentId` | `ready` | checkmark 400 ms then idle thumb; send enabled if all ready |
| Network/4xx/5xx | `error` | “Couldn’t attach — tap to retry”; tap retries **once** with a **new** ticket; no auto-retry loop |
| User × | chip removed; `URL.revokeObjectURL`; if uploading, `AbortController.abort()` | optional 4 s “Undo” live region (single-pointer). Not required if × is obvious |
| Picker `cancel` | no-op | — |
| Send | freeze chips (`pointer-events: none`, `aria-disabled`) until prompt ack | spinner in send |
| Prompt 2xx with redacted attachment block | clear chips + text (existing draft-clear) | transcript card appears; **do not** keep composer thumbs |
| Prompt fail / delivery-unknown | unfreeze; keep chips + text | existing promptError; never invent a transcript image |

**Limits (client, then relay re-checks):** max **4** chips (fits one 390 pt row of 56 pt thumbs + gutters). Max **10 MiB** decoded file each, **20 MiB** staging total. Allow `image/jpeg|png|webp|heic|heif|gif`. Reject video, PDF, HEIC sequences, Live Photo video companion. Over-limit: do not insert extra chips; `aria-live` “You can attach up to 4 photos.”

**EXIF:** strip GPS/orientation-as-location in the relay before host forward. Composer preview uses a **canvas-redrawn** JPEG/WebP without GPS (client-side) so the lightbox cannot leak a map. Do not render `file.name` if it contains a path; show `Photo` / `Screenshot` from `file.type` + human size.

**Plan mode:** attach remains enabled. Disclaimer stays “actions stay read-only”.

**Running turn:** attach allowed. Image-only or text+image uses existing `steer` / `Later`/`followUp`. `hasPayload = prompt.trim().length > 0 || readyCount > 0`. `showStop = running && !hasPayload`.

**Idle empty + no chips:** send stays disabled (voice still out of scope).

### 2.4 Upload + redaction + security (what Send is allowed to mean)

1. **Staging is local and not a mutation.** Blob URLs never leave the device. No ticket yet.
2. **Upload is a mutation.** `POST /api/auth/ticket` → `POST /api/attachments` (`multipart/form-data` **or** a resumable body **outside** the 16 KiB JSON cap). Body: one file, `sessionId`, `ticket`. Fail closed on reused ticket, stale session, disallowed MIME, oversize, plan-host rejection. Response: `{ attachmentId, mimeType, bytes, width, height, sha256 }` — **no** raw pixels in JSON.
3. **Prompt submit stays JSON and small.** Extend `PromptSubmitCommand` with `attachmentIds: string[]` (max 4), **not** `images[].data`. Relay loads bytes, builds host `PromptCommand.images[]`, then **drops** pixels from the ledger. Durable user block: `{ kind: 'user_text', text, attachments: [{ attachmentId, mimeType, bytes, width, height }] }` plus existing redaction envelope. Never persist data-URIs or EXIF.
4. **Transcript preview:** `GET /api/attachments/{id}/preview` (auth cookie, short TTL, stripped JPEG ≤ 256 px). 404 after TTL → glyph + “Photo (preview expired)”. Client must not fall back to the staging blob after send.
5. **One-use tickets, no automatic retry** of a `delivery-unknown` prompt (already PromptService law). Upload retry is a **new** ticket from an explicit tap.
6. **Host/extension plan mode** still gates workspace writes. Images are prompt parts, not files written to the repo, unless a later host tool does that — out of this feature.

If the host `images[]` path is unavailable, **do not** show Photos/Camera. Silent drop is forbidden (Claude Code #57882).

### 2.5 Keyboard, focus order, AT

**Keyboard**

- Coarse pointer (`(pointer: coarse) and (not (any-pointer: fine))`): Return = newline. Send = circular button only. `enterKeyHint="enter"`.
- Fine pointer: keep Enter send / Shift+Enter newline. `enterKeyHint="send"` optional on desktop.
- Guard `isComposing` / keyCode 229.
- Paste: on `textarea` `paste`, walk `clipboardData.items`; if any `image/*` `getAsFile()`, `preventDefault()` those items, stage like picker files; let remaining plain text paste natively.
- After picker dismiss: **do not** steal focus back to textarea. Focus the last new chip (`tabIndex={0}`).
- After successful send: focus textarea (existing), chips gone.
- Tools popover: existing RAC focus trap. Photos/Camera are first two rows, then Mode, then Commands. Escape closes without opening a picker.
- Lightbox: RAC `Modal`/`Dialog`; initial focus Close; Escape dismisses; restore focus to the chip.

**Focus order (open composer, chips present)**  
`+` → chip1 → chip1 × → chip2 → … → textarea → Later (if any) → Send.

VoiceOver chip name: `Photo 1 of 2, 1.2 megabytes, JPEG, ready. Button.` Rotor actions: **Preview**, **Remove**. Uploading: `attaching, 40 percent`. Error: `Couldn’t attach, button, tap to retry`. `aria-describedby` on textarea: “Photos attached will be sent with this message. Pi can make mistakes.”

Switch Control / Full Keyboard Access: chips are `Button`, not `div onClick`.

### 2.6 Gesture table (authoritative)

| Gesture | Target | Result | Single-pointer alternative |
|---|---|---|---|
| Tap | `+` | open tools | — |
| Tap | Photos / Camera | picker | — |
| Slide off `+` or menu row before up | — | cancel (2.5.2) | — |
| System Haptic Touch on chip | chip | context menu: Preview, Remove | the same two as tap / × |
| Tap chip | chip | lightbox | — |
| Tap × | × | remove | — |
| Horizontal pan | chip strip | scroll chips | — (overflow only; not a command) |
| Swipe down | lightbox | dismiss | Close |
| Pinch | lightbox | zoom | +/− buttons |
| Double-tap | lightbox image | toggle 1×/2× | +/− |
| Long-press textarea | system edit menu | Paste (images intercepted) | Photos row |
| Long-press transcript card | Preview / Share | — | visible overflow on latest turn |
| Left-edge swipe | screen | **system Back** — do not bind | — |
| Enter (coarse) | textarea | newline | Send button |
| Enter (fine, not composing) | textarea | send if `canSubmit` | Send button |

**Forbidden as sole paths:** swipe-to-delete chip; swipe-up-on-tray to attach; long-press-`+` to attach; pinch-only zoom; drop-only attach.

### 2.7 Visual / motion (fixed design system)

- Tray, chips, lightbox: bone `#f8f8f6` / carbon ink / clay `#d97757`. Hairline `var(--line)`. Radius: chips 12 pt; lightbox 16 pt; keep tray `1.75rem`.
- Thumbs: `object-fit: cover`; no distortion (Apple tips). Dark theme: same tokens, already themed.
- Insert: 120 ms `var(--ease-out)` opacity + 8 pt translateY (matches `.composer-primary` duration). Reduced motion: skip.
- Upload arc: clay stroke, 1.5 s max to first byte then determinate; reduced motion: static “Attaching…”.
- Send freeze: existing spinner; chips at `opacity: 0.55` (same as disabled textarea).
- Lightbox: 200 ms fade; no blur/filter (PWA jank). Swipe-down follows finger; cancel if `< 80 pt`.
- Contrast: remove × ink on parchment ≥ 4.5:1; error text uses existing `.inline-alert`.
- Safe area: lightbox Close uses `env(safe-area-inset-top)`; tray already uses bottom inset **plus** `--keyboard-inset-height` from the visualViewport helper.

### 2.8 Keyboard-occlusion helper (required for the chip row)

- Add `viewport-fit=cover` so existing safe-area env vars are real on notched phones.
- Transcript is the only `overflow-y: auto` region; `overscroll-behavior: contain`.
- On textarea `pointerdown`, apply last keyboard inset **before** focus; `focus({ preventScroll: true })`.
- Subscribe to `visualViewport` `resize`/`scroll`; commit height after 80 ms stability; ignore sub-16 px jitter.
- Standalone: if `innerHeight` stays depressed after blur, force a full-viewport reflow (documented PWA shrink). Verify on device; do not ship a desktop-only guess.

### 2.9 Microcopy (Inter, not serif)

- Photos  
- Camera  
- Attach a photo (VoiceOver on `+` when closed)  
- Couldn’t attach — tap to retry  
- You can attach up to 4 photos  
- Photo (preview expired)  
Never “Upload file”, “Choose file”, or a paperclip tooltip.

---

## 3. Divergent / minority ideas (do not collapse to the plus menu)

1. **Pattern B only:** one **Attach** row that *is* WebKit’s Photo Library / Take Photo / Browse sheet. One tap cheaper; labels are Apple’s, not Claude’s. Loses explicit Camera vs Photos in the app menu. Worth an A/B on device; HIG-purer for a PWA.
2. **Paste-first, picker-second:** no Photos row in v1; only intercept long-press Paste + document the screenshot path. Extreme, but it matches how developers actually feed UI bugs to agents, and it adds zero picker/keyboard-restore bugs. Reject for the stated Claude/Kimi bar; keep paste as **peer**, not afterthought.
3. **In-composer camera shutter** (second 44 pt clay circle, empty state only), Claude Lock Screen “Analyze Photo” energy. ([Claude iOS intents](https://support.claude.com/en/articles/10263469-using-claude-app-intents-shortcuts-and-widgets-on-ios).) Crowds send/stop. Only viable if `+` stays mode-only.
4. **`getUserMedia` in-app viewfinder** instead of `capture`. Custom shutter, flash, overlay grid. Costs a camera permission prompt, custom chrome, and the historical black-viewfinder PWA bug. ([SO PWA camera black](https://stackoverflow.com/questions/54844616/why-does-upload-image-via-camera-work-on-mobile-safari-but-not-as-ios-pwa).) Minority: skip unless capture quality is proven bad.
5. **iOS 17.4 ` <input type="checkbox" switch> ` haptic** under `+` / send. Feels native; VoiceOver sees extra switches; iOS 26.5 tightened programmatic ticks. ([tappt](https://github.com/mxerf/tappt); [howdoiusekeyboard/haptics](https://github.com/howdoiusekeyboard/haptics).) Do not ship as required feel.
6. **Mail-style swipe-to-remove** on chips *in addition to* ×, with Undo toast. Satisfies 2.5.1; still collides with horizontal pan. Only if the strip never overflows (≤2 chips) or uses a vertical stack.
7. **Write the file to the host workspace and paste a path** (supermux model) instead of `images[]`. Better for “here’s `fail.png` in `/tmp`”; worse for model vision; crosses plan-mode more aggressively. Spec this only if pi’s vision path is weak.
8. **Chip inside the textarea** (iMessage). Caret and chips share one field; VoiceOver and growing-height logic get worse. Keep the Kimi/Claude **strip above the text**.
9. **Reorder chips by drag.** Needs 2.5.7 buttons anyway. Send order = insert order; skip drag.
10. **`enterkeyhint="send"` on iPhone** mapping Return to submit (Telegram-style). Faster one-liners; hostile to multi-line + caption-on-screenshot. Reject while this is a coding agent.
11. **Share-sheet inbound** via a native wrapper / App Intent. Impossible in a pure PWA today; the Claude widget/control is native-only. Do not fake a Share destination.
12. **Keep the tools popover open behind the picker** so Mode/Commands remain. Violates one-sheet HIG and usually loses the activation token. Close first.

---

## 4. Open questions + risks

1. **Does installed-PWA `capture="environment"` still show a live preview on the target iOS?** Historical black camera in standalone mode. Device-test iOS 18/26 PWA vs Safari before locking Pattern A.
2. **HEIC from Photo Library:** MIME may be `image/heic` or transcoded JPEG depending on picker encoding. Confirm `createObjectURL` vs `FileReader` on-device; relay must accept both and normalize before host `images[]`.
3. **Does pi’s host actually consume `PromptCommand.images`?** Types exist; the relay never sends them. If the host drops images, the UI must fail the chip, not the Claude-Code silent-success path.
4. **Preview TTL vs session resume:** staging blobs die on reload. Unsent drafts with `attachmentId`s need encrypted-at-rest replay or honest loss. Undecided.
5. **16 KiB JSON cap vs multipart auth cookies / CSRF:** the new lane must use the same cookie + ticket fail-closed pattern as `/api/prompt/submit` without inheriting the JSON size cap.
6. **RAC Popover + system picker focus restoration** on iOS 18: verify the popover does not reopen empty on dismiss.
7. **Chrome iOS vs Safari PWA:** FileTrigger `onSelect` bug. If “Add to Home Screen” is Safari-only, still test Chrome.
8. **Live Photos / bursts / screenshots with markup:** picker usually yields a still. Confirm no paired `.mov` sneaks through `image/*`.
9. **VoiceOver + hidden file inputs:** ensure they are `tabIndex={-1}` and labelled only via the visible rows, or AT will find “Choose file” twice.
10. **Keyboard shrink in standalone** interacting with chip height: needs a real iPhone; emulators lie.
11. **Plan-mode policy:** product may later want to block camera (environment photos of desks) while allowing screenshots. No signal yet; do not pre-disable Camera.
12. **Undo-remove vs fail-closed tickets:** aborting an in-flight upload must not retry the same ticket.

---

## 5. Sources

**Apple / HIG / WebKit**  
- https://developer.apple.com/design/human-interface-guidelines/buttons  
- https://developer.apple.com/design/tips/  
- https://developer.apple.com/design/human-interface-guidelines/sheets  
- https://developer.apple.com/design/human-interface-guidelines/context-menus  
- https://developer.apple.com/design/human-interface-guidelines/playing-haptics  
- https://developer.apple.com/videos/play/wwdc2023/10107/ (embedded Photos picker; avoid full-library access)  
- https://github.com/WebKit/WebKit/blob/main/Source/WebKit/UIProcess/ios/forms/WKFileUploadPanel.mm  

**WCAG**  
- https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html (2.5.1)  
- https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html (2.5.2)  
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html (2.5.8)  
- https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html (2.5.7)  

**HTML / iOS PWA file + keyboard**  
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file  
- https://web.dev/articles/media-capturing-images  
- https://react-aria.adobe.com/FileTrigger  
- https://github.com/adobe/react-spectrum/issues/10092  
- https://stackoverflow.com/questions/79775667/react-aria-filetrigger-onselect-not-firing-on-first-file-selection-in-chrome-ios  
- https://stackoverflow.com/questions/54844616/why-does-upload-image-via-camera-work-on-mobile-safari-but-not-as-ios-pwa  
- https://stackoverflow.com/questions/67796277/how-do-i-access-the-image-gallery-from-a-pwa  
- https://github.com/w3c/csswg-drafts/issues/10464  
- https://stackoverflow.com/questions/78844736/how-to-polyfill-interactive-widget-resizes-content-for-meta-viewport-tag-on  
- https://github.com/Crscristi28/ios-pwa-keyboard-fix  
- https://github.com/cameronapak/polyfill-virtual-keyboard-api/blob/master/docs/ios-composer.md  
- https://dev.to/cederhook/fixing-the-ios-standalone-pwa-keyboard-bug-that-shrinks-your-viewport-for-good-63d  
- https://bugs.webkit.org/show_bug.cgi?id=288846  

**Claude / ChatGPT / Kimi (target bar)**  
- https://support.claude.com/en/articles/8114491-get-started-with-claude  
- https://support.claude.com/en/articles/10263469-using-claude-app-intents-shortcuts-and-widgets-on-ios  
- https://dev.to/amullagaliev/osd700-how-llms-and-messengers-handling-attachments-ui-4264  
- https://github.com/anthropics/claude-code/issues/57882  
- https://www.kimi.com/zh-cn/help/new-user-guide/overview  
- https://github.com/MoonshotAI/kimi-code  
- https://github.com/MoonshotAI/kimi-code/commit/4c763f6763acb67a73d133f7450d092e71d63692  
- https://github.com/xy200303/spec-kimi-code/blob/main/apps/kimi-web/src/components/chat/Composer.vue  
- https://github.com/xy200303/spec-kimi-code/blob/main/apps/kimi-web/src/composables/useAttachmentUpload.ts  

**Mobbin (public URLs; MCP not callable this pass)**  
- https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1 — Claude iOS image-input flow  
- https://mobbin.com/explore/screens/f2a2127a-3258-4ac9-aa6d-ca1494e25ead — Claude camera permission  
- https://mobbin.com/explore/screens/448b88ea-3923-427c-aead-5488541ff56e — Claude upload/download  
- https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8 — Claude chat detail / FAB  
- https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1 — ChatGPT iOS composer + camera icon  

**Remote coding-agent / chat clients**  
- https://github.com/sanderbz/supermux  
- https://github.com/nanodan/concierge  
- https://github.com/astroicers/vibe-remote  
- https://github.com/danny-avila/LibreChat  
- https://github.com/assistant-ui/assistant-ui/issues/4091  
- https://github.com/Flopsstuff/ccui/commit/03f12726d6265643dea1a4bbf87f134608b660b8  

**This repo (grounding)**  
- `apps/pi-remote-web/src/SessionComposer.tsx` — Enter-to-send, `+` tools popover, stop-vs-send  
- `apps/pi-remote-web/src/style.css` — 2.5rem (40 px) targets, sticky tray, 120 ms states  
- `apps/pi-remote-web/src/App.tsx` — enrollment `<input type="file" accept="image/*">`  
- `apps/pi-remote-web/index.html` — viewport, apple-mobile-web-app-capable  
- `apps/pi-remote-web/src/relay.ts` — ticketed `prompt.submit`  
- `packages/pi-rpc-protocol/src/types.ts` — host `images?: ImageContent[]`; PWA submit has no attachments  
- `apps/pi-remote-relay/src/http/server.ts` — `MAX_HTTP_BODY_BYTES = 16_384`  
- `docs/design-reference/mobile-chat-apps/council-gpt-sol.md`  
- `docs/design-reference/mobile-chat-apps/research-gpt-luna.md`
