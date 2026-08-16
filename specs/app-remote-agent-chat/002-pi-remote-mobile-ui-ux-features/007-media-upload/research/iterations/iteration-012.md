<!-- provenance: external-CLI orchestration pass; original file iter-12-deepseek.md -->
> **Source pass 12** — executor: DeepSeek v4 Flash (opencode-go gateway). Independent, cited pass under a rotating lens. Migrated from `iter-12-deepseek.md`.

<!-- F5-media-upload | model=deepseek | lens=edge-failure | iter 12/15 | 2026-08-15T19:53:22.052Z -->

I'll research the edge-failure lens for iOS-PWA media upload. Starting with source gathering in parallel.
FileTrigger and MDN file-input specs captured. Continuing source gathering in parallel.
tus protocol captured in full. Fetching PHPicker docs markdown, Uppy status bar docs, and searching for the remote-CLI prior art (Onyx).
GitHub API for prior art and Apple HIG states pages.
Strong prior art found (termly-cli 292★, harness-remote 284★, handmux 147★, Quivr 247 Tailscale-based 71★). Checking the nearest-form-factor PWA (handmux) for attach/failure states, and one platform quirk.
# Edge-Failure Research: Composer Media Attach — Pi Remote (PWA, iOS) — Iteration 12/15

**Lens:** edge cases, failure modes, race conditions, graceful degradation. Stack: React 19 + Vite + Tailwind 4 + react-aria-components, installable iOS PWA over a private Tailscale tailnet.

---

## 1. Findings

### 1.1 The platform reality: you are building on `<input type=file>` + two hidden inputs, not a picker API

A PWA cannot reach `PHPickerViewController` — that is a native `PhotosUI` class [S3]. The web equivalent is WebKit's file input, which MDN specifies cleanly but with hard constraints that become edge cases:

- **`accept` is a hint, not a validation.** "The `accept` attribute doesn't validate the types of the selected files." MDN is explicit that "you should make sure that the `accept` attribute is backed up by appropriate server-side validation." [S2]. So client-side type/size rejection on `change` is mandatory, and the helper-text must not promise that the picker filtered for you.
- **`capture` values `user`/`environment`** let you force the camera front/back pass. MDN documents it pre-boolean and notes that if the facing mode is unavailable the UA may "fall back to its preferred default mode" — i.e. the camera sheet can silently present the wrong camera [S2]. An `environment` Civil? Actually a photo-for-a-bug report should default to environment; front camera is for the rare self-self case.
- **Cancel/empty is detectable but fragile:** MDN defines a `cancel` event fired when the dialog is closed or cancelled [S2], but iOS WebKit has a long history of not firing it deterministically when a photo sheet is dismissed without selection. You cannot rely on it for state transitions — only the `change` → `FileList` path is trustworthy.
- **`input.value` is not loadable from script** and the "value" is always the `C:\fakepath\`-style stub via the HTML spec [S2]. Consequences for edge handling: (a) after a successful pick you must **manually reset `input.value = ''`** or the identical re-pick emits no `change` event (a silent no-op that looks like a dead button); (b) you can never render a "path".

**react-aria-components `FileTrigger`** wraps exactly this and exposes the switches you need as props: `acceptedFileTypes`, `allowsMultiple`, `defaultCamera` (`"environment" | "user"`), `onSelect(files: FileList | null)`, and `hidden` [S1]. The pattern that survives the platform is **two `FileTrigger`s in the DOM** (library + camera) driven by one "+" affordance, because a single input cannot switch between `capture` and no-`capture` at runtime in iOS in a way that SILENTLY changes which sheet opens — mutating the attribute between taps is itself a race on iOS. Peninsula one input bug is real: iOS ignores a programmatic `.click()` while a sheet is already animating or still presented, so a double-tap on "+" yields a **silent no-op**. Dedupe the open action.

### 1.2 Tailscale + iOS PWA = flaky network is the DEFAULT, not an exception

The transport is a private tailnet — high latencies, intermittent arrival, no guarantees. The single most relevant prior art is **handmux** (a phone-PWA tmux cockpit for Claude Code / Codex, 147★): its README explicitly ships a "built for flaky networks" list — "backoff reconnect, connection-lost banner, offline page, polling that pauses in the background; a reflow-safe cursor" — and for chat delivery: *"The queue and delivery receipts survive [app] restarts, and uncertain sends are reconciled before retrying"* [S5]. That is the exact failure semantics an uploader needs: **a persisted queue with idempotency keys, explicit receipts, and reconciliation (not silent drops) on reconnect.** Claude iOS behaves the same way for fails: the message bubbles stick with a "Couldn't send" state and a retry affordance; nothing is deleted.

Three peers worth studying for the same reason are **termly-cli** ("Mobile companion for Claude Code, Gemini CLI & OpenCode. Encrypted, remote.", 292★) [S6], **giuliastro/harness-remote** ("Run and supervise Codex, Claude Code, OpenCode, OMP and PI across your machines", 284★, mobile/Capacitor) [S7], and **QuivrHQ/247-claude-code-remote** ("Access Claude Code from anywhere – Mobile / Desktop secure connection via Tailscale", 71★) [S8] — both 247 and handmux share Pi Remote's topology (browser phone → host daemon) and are the closest prior art for the entire feature.

**The background-suspension fact:** iOS Safari/standalone suspends pages aggressively. A `fetch` multi-part body in flight through a tailnet that backgrounds mid-upload will pause or kill; there is **no service-worker continuation of an in-flight upload** (the SW only intercepts request initiation, not mid-body resumption in Safari). Combined with WebKit's documented lack of request-body streaming `Request.duplex` upload support in Safari (duplex is Chrome-only today; MDN marks it Not Supported in Safari) — you cannot stream a huge body from a `File` object. Consequences:

1. **Never buffer large videos into `FormData`/`fetch`** — iOS memory pressure terminates WebKit tabs above roughly hundreds-of-MB in engagements; a 4K HDR clip (multi-GB) buffered into RAM is a hard crash, not an error.
2. **Chunked, resumable transport is the only safe lane.** The **tus v1.0 protocol** is the industry standard and is fully specified: `HEAD` returns `Upload-Offset`; `PATCH` resumes from the offset; offset mismatch → `409 Conflict`; expired/cleaned resources → `404 Not Found`/`410 Gone` (client restarts a new upload, do not blind-retry); optional `checksum` extension verifies each chunk (`sha1`, mismatch → `460 Checksum Mismatch`, chunk discarded, offset unchanged); `Upload-Defer-Length` covers unknown lengths; `X-HTTP-Method-Override` exists for PATCH-less stacks [S4]. Uppy's **StatusBar** plugin encodes the complete upload state vocabulary you should mirror: `uploading`, `complete`, `uploadFailed`, `paused`, `retry` / `retryUpload`, `cancel`, `pause`, `resume`, `+N more file added` (appendix) — and its `showErrorDetails` string shows there are always two layers of error text (summary + detail) [S10].

### 1.3 Upload-state machine vocabulary (proven by Uppy)

Uppy StatusBar [S10] gives the canonical model, which I translate to the composer:

| State | Copy (tone-set) | Control |
|---|---|---|
| `uploading` | "Uploading 45%" / "Uploading 45% · 43 MB of 101 MB · 8s left" | pause/cancel |
| `paused` | "Paused" | resume |
| `uploadFailed` | "Upload failed" | **retry** ("Retry upload"), remove |
| `complete` | "Complete" | done (→ collapse into sent chip) |
| new files added mid-session | "Upload +2 more files" | — |

Note Uppy ships retry OFF-by-default only if `hideRetryButton` is set; the default is that **retry is a first-class affordance**, and `showErrorDetails` proves the two-tier error UI. Pi Remote should keep "retry" visible on the chip and keep per-file granularity (retry one file, never the whole batch).

### 1.4 In-flight security failures are a distinct edge class (fail-closed posture)

Pi Remote's fixed posture is one-use ticketed mutations that **fail closed**, revision-checked, redacted. This creates failure modes most chat apps never have, and they MUST be surfaced differently from network errors:

1. **Ticket expired/reused/revoked** → server answers `403/410` (see tus's 404/410 convention [S4]). The correct UX is a one-time, non-retryable sheet ("This upload session expired — tap to start a new one"), and the client must NOT retry automatically, because a blind retry would **burn a new ticket** to no purpose. This is the inverse of network retry logic and must sit before the retry queue.
2. **Revision-stamp mismatch** (working tree changed since the ticket was minted) → the mutation is refused even though network was fine. Auto-retry is the wrong call; the right call is a "content changed — reload" action with diff framing, because silently re-applying an attachment against a changed tree is exactly the class of write the posture forbids.
3. **Redaction failure** (attachment can't be safely shown, filename contains PII, metadata leakage) → transcript shows a placeholder card, never partial bytes. The transcript is a redaction surface first, a history second.

These three are read-only-proof boundary conditions: if the "how bytes reach pi" lane is not designed as a **staged, then explicitly-approved** pipeline (staging dir → agent turn → user-visible "Add to workspace?" with its own ticket), the feature violates the posture the moment an attachment auto-writes anywhere. Prior art confirms the framing: handmux's read-only git viewer and "move files both ways" coexist by making transfer an explicit, isolated action [S5].

### 1.5 Degradation ladder: what "best apps do" means on iOS

The Claude iOS / Kimi target bar and the platform together dictate a **degradation ladder** rather than a success/fail binary:

- **Level 0 — offline pick:** selecting photos/videos from the gallery happens on-device with zero network. Everything up to locally encoding a Latent preview and inserting the chip MUST work with the tailnet down. Apple's own picker design calls this "deferred image loading and reliable handling of large and complex assets" [S3] — the recents-style sheet is why the POST-buffering is the only real cost.
- **Level 1 — offline compose:** chips attach, reorder, remove offline; only `Send` requires a connection. Send with no connection → enqueue in IndexedDB, show "Queued — will send when connected" chip state (handmux reconcile pattern [S5]).
- **Level 2 — degraded transport:** chunked resumable tus [S4], backoff + jitter reconnects, banner when the connection-loss is detected (handmux "connection-lost banner, offline page" [S5]).
- **Level 3 — hostile network:** retry vs. fail leave local data intact; byte-receipt mismatch (sha) on resume → restart upload, never truncate.

---

## 2. Concrete spec contribution

### 2.1 States (exact, exhaustive)

Composer-level machine, one of: `idle` → `menuOpen` → `pickerActive` → `validating` → `uploading{n,total}` → `partiallyComplete` → `sent` / `failed{reason}` / `blocked{rationale}`. Per-chip machine: `pending` (local only) → `validating` → `queued` (offline) → `uploading(progress|paused)` → `sent` → **`accepted`** (host registered sha + ticket burned) → **`denied`** (redaction/revision/ticket failure; card flattens to a system note) → `removed(undoable 5s)`.

Non-celebratory states get **inline chips**, never page-level toasts:

- **Type/size rejection** → chip becomes "`IMG_4821.HEIC` · 41 MB — limit is 25 MB" with `role=alert`, clay-tinted background, carbon-ink text; the only action is `<ликвидация>` remove. Fail fast at `change`, before any encoding/network (MDN: accept is not validation [S2]).
- **Empty/cancel** → no state change; keep focus on the "+" trigger. Do NOT rely on the iOS `cancel` event; treat silence as cancel and never spin a spinner on open.
- **Permission-denied (camera)** → iOS shows the system camera sheet itself; if the user denies, the input returns empty with **no error event**. Detect via "capture input opened then returned empty within 3s" heuristic and offer "Camera access was turned off — choose from your photo library" as a single-call Action-List item, not a dialog.
- **Connection-loss with queue** → chip shifts to `queued`; the composer shows a single hairline "Waiting for connection — N media queued" strip (handmux "connection-lost banner" [S5]); **nothing is auto-deleted**, ever.
- **Security failures** (ticket 403/410 expired, revision 409, redaction-denied) → a distinct non-retryable sheet: "This session expired" / "The workspace changed — reload" / "Attachment was blocked from showing in the transcript"; each has exactly one primary action and skips the retry queue entirely (see 1.4).
- **Upload genuinely failed (network/CRC)** → chip shows `error` + **Retry AND Remove** (Uppy's retry-first grammar [S10]); retry resumes via tus offset [S4], not a fresh POST.

### 2.2 Gestures & pick flow

- **"+" (44 pt min, aria-label "Attach media")** opens a native-feeling bottom sheet (`react-aria` Menu in a Dialog) with: **Photo Library**, **Take Photo**, **Take Video**, each a 44pt row. Choice maps to `FileTrigger` with `acceptedFileTypes=["image/*"]` (no capture), `["image/*"]` + `defaultCamera="environment"`, `["video/*"]` + `defaultCamera="environment"` [S1][S2]. Keep all three `FileTriggers` mounted; never mutate `capture` at runtime (1.1 race).
- **Multi-pick** is `allowsMultiple` on the library input only [S1]. Cap at 5 per batch at `change`; overflow → inline rejection chip "You attached 7 of 5 — I kept the first 5."
- **Chip = local thumbnail + filename + size + status**, 64px square, parchment background, ink text, `2px` clay ring while selected.
- **Tap chip** → full-size preview via `URL.createObjectURL` (revoke when preview closes or after 60 s idle). **Long-press / menu** → View / Remove / (if not yet sent) "Send original size" toggle. **Drag to reorder** chips with `aria-live` reorder announcement; react-aria-compatible pointer model, no dependency on native reorder.
- **Send is gated**: disabled while any chip is `validating|uploading|queued` except when user explicitly long-press → "Send text only". Prevents the double-send race corrupting transcript order.

### 2.3 A11y (WCAG AA)

- All progress rendered as `role="progressbar"` with `aria-valuemin/max/now` + `aria-label="Uploading photo 1 of 3"`. Success/failure transitions announced through an `aria-live="polite"` region (single region, deduped).
- Focus round-trips: sheet close returns focus to "+"; after `onSelect`, focus returns to the first chip; after removal, focus returns to "+" so a flubbed removal can't strand VO.
- `accept`'s hint nature documented in a static helper line ("Images up to 25 MB") so SR users are treated to the real limit, not the picker's filter.
- `reduced-motion`: suppress insert translation and success bounce; keep fade-only (WCAG 2.3.3).
- Dynamic Type: chip text may drop filename to ellipsis + full name in `aria-label`/`title`; never clip below 1em.
- New-batch +N announcement ("3 files selected") matches Uppy's `xMoreFilesAdded` pattern [S10].

### 2.4 Upload, redaction & security design (crossing the read-only posture — exact)

1. **Two separate tokens, one upload.** On first attach: client `POST /gw/upload` → `uploadId` (bytes lane, tus resource [S4]) and a **mint-stage ticket** (TTL 5 min, purpose `media-attach`, bound to `sessionId` + `clientContentSha256`). Bytes stream chunked to host staging dir (never straight to the working tree); per-chunk sha checksum [S4]. The ticket is only marked used on **successful finalize** (bytes verified), so a CRC failure retries within TTL without burning anything. This is the minimal change to the ticketed mutation system.
2. **Limits (enforced client AND host):** images HEIC/JPEG/PNG/WebP/GIF ≤ 25 MB; video ≤ 120 MB; 5/batch; 2048 px encode ceiling for stills at send (original kept only if user toggles "Send original"). Behind latency: if upload exceeds 90 s, auto-downgrade to a server-prescribed size and inform.
3. **Bytes reach pi as a *staged reference*, not a write.** On finalize, the host registers `{uploadId, sha512, mime, size, contentDescription?}`; the agent turn receives the path as an attachment metadata pointer. **Adding it to the workspace is a separate, explicitly-approved mutation with its own one-use ticket** ("Add `IMG_4821.HEIC` to the workspace?"). Default = read-only staging. Matches handmux's separation between read-only views and explicit transfer [S5].
4. **Redaction in the transcript:** local preview for the operator via `objectURL` (never mirrored to transcript beyond a hash). Remote transcript card = kind + filename + size + `sha256`, all configurable; "privacy mode" redacts filename and sends only `📷 photo · 2.1 MB`. Host strips EXIF/GPS metadata before staging (HEIC carries far more than EXIF; strip at container level). If anything fails redaction, the card renders as a placeholder — partial bytes never render.
5. **Fail-closed order of gates:** authn → ticket fresh → revision match → size/type + magic-bytes → sha verify → redaction → write-to-staging. Whatever fails, the response is non-retryable into the queue where it's a security (not network) error (1.4).

### 2.5 Visual/motion

- Insert: 180 ms `translateY(8px)→0` + fade; removed slot collapses 200 ms; success = 220 ms avatar-scale burst on the chip (suppressed under reduced motion).
- Progress: determinate 2 px hairline under the chip when >1 MB known; indeterminate when unknown (tus deferred-length [S4]).
- Colours only from the palette: success = carbon-ink check on bone; error = clay-tinted chip with ink text; inverse in dark mode. No new hues.
- The offline strip renders `ink@60%` on parchment with a dot that pulses (respecting reduced motion → static dot).

---

## 3. Divergent / minority ideas worth considering

1. **"Process-on-host, describe-first" attachments for plan mode.** Instead of shipping pixels into the agent by default, ship an OCR/CLIP-style description; the original goes to the staged store and to the agent on explicit approval. This keeps plan mode read-only by construction and shrinks the byte lane 100× — a genuine alternative to "bytes reach pi" as currently assumed.
2. **Lossy-by-default sends.** Send the 1280px encode or a 2–3 Mbps video by default; full-resolution is an explicit per-chip choice. Claude iOS effectively does this; making it *visible and reversible* is a cleaner failure posture: a huge wedged upload can never block the chat.
3. **Same-file re-pick anti-pattern surfaced, not silently fixed.** Rather than only `input.value=''` resetting, add an explicit "Replace `${IMG_4821.HEIC}`" action in the chip menu; it doubles as the user-facing workaround for iOS's identical-pick `change` bug.
4. **Two-input always-mounted "library"/"camera" strategy (accept this one, not mutate-one).** Already in the spec above; the minority part is *keeping both visible triggers* in the sheet with distinct labels instead of one magic button — iOS camera-denial then has a deterministic second affordance instead of a heuristic.
5. **Never-store previews in IndexedDB.** Leave the file in memory and rely on tus resume for anything > 2 MB; this shrinks the persistence failure class (quota eviction of a pending attachment between restarts) at the cost of losing offline compose for big videos. Minority, because most apps persist; but persistence across iOS Safari suspensions is itself unreliable.
6. **Skip redaction of filenames entirely; users opt into sending, so filenames are fine.** This is the opposite of the posture's default and worth at least naming: the redaction that matters is metadata + bytes-in-transcript, not display names.

---

## 4. Open questions + risks

1. **WebKit memory ceiling for in-memory body imaging at > ~50 MB** — must verify on device that tus/XHR chunk work around it; if XHR itself buffers per-chunk, cap chunk at 4 MB. *Risk: moderate; must test on the oldest supported iOS.*
2. **`FileTrigger` `defaultCamera` mapping to `capture`** in standalone PWA mode — needs a device test matrix (iOS 17/18/19 + standalone vs tab). `capture=environment` can be ignored by some UAs (MDN: UA may fall back [S2]).
3. **iOS does not fire `cancel` reliably on the photo sheet** — the whole "empty/cancel" state rests on positive `change` only; if the user wants a "choose nothing → back to attach menu" recovery, we need the heuristic in 2.1 (3 s empty-return window). Validate before shipping; the heuristic cost is a false "camera-denied" tip.
4. **Game-time race: double-tap "+"** while a sheet is animating → silent no-op. Spec dedupes the open action, but iOS may still swallow the second open; confirm the sheet re-opens after dismiss.
5. **Suspension mid-upload:** iOS can suspend a backgrounded tab; tus offset after foreground [S4] is the stated cure, but the foregrounded app must re-`HEAD` before any `PATCH` or it hard-fails with `409 Conflict` — a footgun if the resume logic skips the offset check.
6. **Ticket/revision burn on double-send.** Two chips referencing the same uploadId must both finalize; the ticket burns once, both idempotency-key-derived. Confirm the idempotency key is client-provided and stable over retries, otherwise reconcile (handmux's "uncertain sends reconciled before retrying" [S5]) will double-insert the card.
7. **Privacy silence:** the feature by definition moves photos off-device. Default redaction posture should be confirmed with ownership before launch; the "privacy mode" toggle in 2.4 is a proposal, not a decision.
8. **HEIC nuance:** host must accept HEIC (iOS originals) but *trans coded* preview must exist client-side; decide whether the agent receives HEIC or the JPEG encode for analysis. Not specified anywhere in this doc's LHS; flag for the upload-lane designer.

---

## 5. Sources

- **[S1] react-aria-components FileTrigger** — https://react-spectrum.adobe.com/react-aria/FileTrigger.html (props: acceptedFileTypes, allowsMultiple, defaultCamera, onSelect, hidden; a11y role guidance)
- **[S2] MDN `<input type=file>`** — https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file (cancel event, fakepath, accept-as-hint, capture semantics, multiple)
- **[S3] Apple PhotosUI PHPickerViewController** — https://developer.apple.com/documentation/photokit/phpickerviewcontroller (deferred loading, large/complex asset handling, iOS 17 opacity touch-gating)
- **[S4] tus resumable upload protocol v1.0** — https://tus.io/protocols/resumable-upload (HEAD/PATCH offsets, 409/404/410 semantics, checksum extension 460, Upload-Defer-Length, X-HTTP-Method-Override, expiry)
- **[S5] handmux/handmux (PWA mobile vibe-coding cockpit)** — https://github.com/handmux/handmux (inflaky-network list, queue+receipts+reconciled sends, "files both ways" chat upload, read-only git viewer)
- **[S6] termly-dev/termly-cli (mobile companion for Claude/Gemini/OpenCode, E2EE)** — https://github.com/termly-dev/termly-cli
- **[S7] giuliastro/harness-remote (local-first remote agent harness; Codex/Claude/OpenCode/OMP/PI)** — https://github.com/giuliastro/harness-remote
- **[S8] QuivrHQ/247-claude-code-remote (Tailscale-based mobile/desktop secure access)** — https://github.com/QuivrHQ/247-claude-code-remote
- **[S9] lamngockhuong/termote (PWA remote CLI control)** — https://github.com/lamngockhuong/termote
- **[S10] Uppy Status Bar plugin** — https://uppy.io/docs/status-bar/ (uploading/failed/paused/retry/retryUpload/cancel/pause/resume/done strings + showErrorDetails + hideRetryButton)
- **[S11] Apple HIG Loading / Errors / Empty states (iOS guidance)** — https://developer.apple.com/design/human-interface-guidelines/loading ; https://developer.apple.com/design/human-interface-guidelines/errors
- *Secondary prior-art reproductions: **y49/tlive** (Telegram-based remote approval lane) https://github.com/y49/tlive ; **terranc/claude-telegram-bot-bridge** https://github.com/terranc/claude-telegram-bot-bridge — referenced for the approval-lane pattern, not uploaded.*
