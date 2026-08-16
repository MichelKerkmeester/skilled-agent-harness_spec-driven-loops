<!-- provenance: external-CLI orchestration pass; original file iter-07-grok.md -->
> **Source pass 7** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-7-grok.md`.

<!-- F7-rich-content-blocks | model=grok | lens=security-redaction | iter 7/10 | 2026-08-16T04:19:49.535Z -->

# Security-redaction research — Pi Remote rich content blocks  
**Lens:** what Copy / Expand / artifact cards expose, how to keep the read-only + redaction posture intact, and the only safe path from phone → agent  
**Pass:** independent deep-research iteration 7 of 10 (do not converge on “add a Copy button”)  
**Stack lock:** installable iPhone PWA, React 19 + Vite + Tailwind 4 + react-aria-components, ink-on-parchment, WCAG AA, fail-closed mutations, redaction-before-persist

---

## 1. Findings for this lens

### 1.1 Copy and full-screen do not read the host. They *amplify* whatever already survived policy v1.

Pi Remote’s trust boundary is already written down: `redactEnvelope` is the only redaction allowed before persistence or broadcast; only the resulting envelope reaches SQLite, replay, snapshots, or live subscribers ([ARCHITECTURE.md](ARCHITECTURE.md) §6; [docs/security.md](docs/security.md) §9; `apps/pi-remote-relay/src/store/redaction.ts`). The PWA has no API that returns unredacted tool args, patches, or prompts. Expand-to-full-screen and Copy therefore cannot “open a file on the Mac.” They can only re-present or export strings the phone already holds.

That is the actual new risk. A Copy control writes those strings onto iOS’s **general pasteboard**, which is shared across foreground apps and, with Universal Clipboard, across every nearby device signed into the same Apple Account ([Apple Support — Universal Clipboard](https://support.apple.com/en-us/102430); [Apple Platform Security — Handoff / Universal Clipboard](https://support.apple.com/guide/security/handoff-security-secf78dbe639/web)). Apple’s own security guide states apps on those other devices can read clipboard data **whether or not the user pasted** ([Handoff security](https://support.apple.com/guide/security/handoff-security-secf78dbe639/web)). OWASP MASVS documents the same: the general pasteboard is persistent by default and is a cross-app channel ([MASTG-KNOW-0083](https://mas.owasp.org/MASTG/knowledge/ios/MASVS-PLATFORM/MASTG-KNOW-0083/)).

So the feature’s security job is not “don’t talk to the filesystem.” It is: **never copy more than the already-redacted, already-rendered field; never fetch a richer original; never mint a File/blob that looks like an upload; never read the pasteboard.**

### 1.2 Policy v1 is a pattern scanner, not a proof. Copy makes the holes load-bearing.

`redactEnvelope` replaces:

| Trigger | Marker |
|---|---|
| keys `cwd`, `fulloutputpath`, `path`, `sessionfile`, `workspacepath` | `[REDACTED_PATH]` |
| keys `apikey`, `authorization`, `cookie`, `password`, `secret`, `token` | `[REDACTED_SECRET]` |
| key `prompt` | `[REDACTED_PRIVATE_TEXT]` |
| assignment / Bearer / `github_pat`·`ghp`·`sk-`·`xox[baprs]` patterns | `[REDACTED_SECRET]` |
| POSIX `~` or `/Users|/home|/private|/tmp|/var|/etc|/opt|/usr|/Volumes/...` and Windows `C:\...` | `[REDACTED_PATH]` |

([`redaction.ts` L23–L99](apps/pi-remote-relay/src/store/redaction.ts); [docs/security.md](docs/security.md) §9)

Two structural facts matter for Command/Output and artifact cards:

1. **Private-text replacement is key-name based.** Only a JSON key whose alphanumerics normalize to `prompt` is wholesale-replaced. Transcript blocks persist user steering as `{ kind: 'text', text: message }` (`TranscriptProjector.projectSubmittedPrompt`, [`transcript-projector.ts` L226–L240](apps/pi-remote-relay/src/store/transcript-projector.ts)). Tool bodies persist as `inputSummary` and `output`. Those field names are **not** in `PRIVATE_TEXT_KEYS`. They receive only the string regexes. The architecture is explicit: the prompt *command* (ticket, submissionId) is never persisted; the projected user **text block** is ([ARCHITECTURE.md](ARCHITECTURE.md) §7).
2. **The projector stringifies before redaction.** `summarizeJson` is `JSON.stringify` of tool args ([`transcript-projector.ts` L452–L455](apps/pi-remote-relay/src/store/transcript-projector.ts)). After that, `path` is no longer a key — it is characters inside a string. Absolute `/Users/...` still matches `POSIX_PATH_PATTERN`. Relative `src/secrets.env`, `./.env`, `id_rsa`, AWS `AKIA…`, JWT `eyJ…`, and `https://user:token@github.com` **do not**. OpenHands has repeatedly shipped the last class as a real leak: git remote URLs with embedded credentials in terminal output ([openhands/openhands#15338](https://github.com/openhands/openhands/issues/15338); [OpenHands/software-agent-sdk#3792](https://github.com/OpenHands/software-agent-sdk/pull/3792)). Pi Remote’s own docs already say pattern redaction is not a proof that free-form text is harmless ([docs/security.md](docs/security.md) §9).

A Claude-parity Copy button on a bash Output card therefore copies **the post-policy string**, including every class the regexes miss. That is correct relative to the ledger. It is incorrect to treat Copy as “safe because redaction ran.”

### 1.3 The PWA currently throws away the redaction stamp, so the UI cannot tell the operator what was removed.

Every envelope carries `redaction: { policyVersion, fieldsRedacted, reasons[] }` ([`types.ts`](packages/pi-rpc-protocol/src/types.ts); [`redactEnvelope`](apps/pi-remote-relay/src/store/redaction.ts) L47–L52). `transcriptReducer` / `blocksFromEnvelopes` keep only `envelope.payload` ([`state.ts` L322–L338](apps/pi-remote-web/src/state.ts)). Grep of `apps/pi-remote-web` finds no use of `redaction` except a demo comment. Cards cannot show “3 fields redacted · path, secret.” Copy cannot refuse or warn. Full-screen cannot label the chrome with the policy version that produced the text.

Without plumbing that stamp onto `DisplayTranscriptBlock`, the polished Claude card will look like a complete command log. It is not.

### 1.4 Optimistic user blocks are the one unredacted string the phone already has.

`sendPrompt` inserts a local `text` block with the **raw** composer string, then replaces it when `/api/prompt/submit` returns the committed block ([`App.tsx` L1062–L1092](apps/pi-remote-web/src/App.tsx); [`relay.ts` `submitPrompt`](apps/pi-remote-web/src/relay.ts) L59–L87). Redaction happens on the relay during `syncHub.publish` ([`prompt-service.ts` L140–L155](apps/pi-remote-relay/src/prompt/prompt-service.ts)). Until `promptAccepted`, the on-screen user bubble can contain a token the ledger will later turn into `[REDACTED_SECRET]`.

Today `AssistantActions` only copies **assistant** text ([`App.tsx` L1564–L1566](apps/pi-remote-web/src/App.tsx)). A “goal-prompt artifact” with Copy on the user turn would, if wired naively, put the pre-redaction string on the general pasteboard — and then onto Universal Clipboard. Cache hydration already drops pending ids ([`cache.ts` L64–L66](apps/pi-remote-web/src/cache.ts)); Copy must use the same rule: **only `source === 'relay'` (or cache of a previously committed relay block), never `pendingPromptIds`.**

### 1.5 iOS Safari makes “copy after a fetch” both a UX bug and a security bug. That is useful.

Safari/Firefox require **transient user activation** for `clipboard.writeText`. An `await fetch(...)` between tap and write yields `NotAllowedError` ([MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API); [Kian — Safari transient activation](https://kian.org.uk/writing-to-clipboard-in-safari-transient-activation/); [github/gh-aw#2441](https://github.com/github/gh-aw/pull/2441)). The secure design and the working iPhone design are the same: **Copy writes the in-memory field that is already on screen. It never round-trips to the relay for “full output.”** There is no `/api/tool/raw` to add. ClipboardItem-with-promise is only for delayed *same* bytes, not for fetching a less-redacted original.

Safari and Firefox do **not** implement the Permissions API `clipboard-write` / `clipboard-read` tokens ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)). Do not request `clipboard-read`. iOS 16+ prompts on programmatic pasteboard **read**; write from an explicit Copy tap is the intended consent ([Apple Developer Forums](https://developer.apple.com/forums/thread/713770); [MASTG-KNOW-0083](https://mas.owasp.org/MASTG/knowledge/ios/MASVS-PLATFORM/MASTG-KNOW-0083/)). The existing `AssistantActions` already gates on `navigator.clipboard?.writeText` and never reads ([`App.tsx` L1387–L1410](apps/pi-remote-web/src/App.tsx)). Keep that shape.

Copy **HTML** (`text/html` ClipboardItem, or `execCommand('copy')` of a highlighted `<pre>`) can put hidden DOM, syntax-span text, and redaction markers in a different visual order than the logical string. Spec: **`text/plain` only**, sourced from the block field, not from `Selection` / `innerText` of the highlighted tree.

### 1.6 Share is a stronger exfil than Copy. Bash/code cards must not inherit the turn-level Share.

`navigator.share({ text })` opens the iOS share sheet (Messages, Mail, Slack, Files). That is a second persistence domain, not a clipboard slot. Web Share is a secure-context, user-gesture API ([Web Share matrix](https://www.webshareapi.com/web-share-api-security-contexts/browser-support-matrix-for-web-share-api/)). Sharing **files** on iOS 15+ requires a `File` with an allowlisted MIME; mixing `text` + `files` is unreliable ([SO 76076190](https://stackoverflow.com/questions/76076190/sharing-an-image-using-the-webshare-api-in-ios-is-failing)). Constructing a `.sh` or `.txt` `File` from tool output would create a file-shaped payload that later “Attach” work will be tempted to reuse. **This feature must not call `navigator.share({ files })`.** Prefer: Share stays on settled **assistant prose** only (current `AssistantActions`); Command/Output and code/artifact cards expose Copy, not Share.

### 1.7 Syntax highlighting is a new XSS TCB. The repo currently has none.

`@pi-remote/web` depends on React, react-aria-components, TanStack Virtual, Vite, Tailwind — no highlighter, no markdown parser, no `dangerouslySetInnerHTML` ([`package.json`](apps/pi-remote-web/package.json); grep of `apps/pi-remote-web`). `DiffPatch` already does the safe thing: split lines, React text children, CSS classes from **prefix of the line**, not from untrusted language ids ([`App.tsx` L1571–L1590](apps/pi-remote-web/src/App.tsx)).

highlight.js documents that unescaped HTML inside a code block is an injection bug, and CVE-2020-26237 is prototype pollution via **attacker-controlled language names** in Markdown fences ([highlight.js#2886](https://github.com/highlightjs/highlight.js/issues/2886); [GHSA-vfrc-7r7c-w9mx](https://github.com/advisories/ghsa-vfrc-7r7c-w9mx)). Assistant `text` is currently a `<p>`, not parsed fences. Introducing fenced-code rendering without an allowlisted language enum re-opens that CVE class. JSON API responses already send `Content-Security-Policy: default-src 'none'; frame-ancestors 'none'` ([`server.ts` L927–L931](apps/pi-remote-relay/src/http/server.ts); [http README](apps/pi-remote-relay/src/http/README.md)). The PWA document is served by Vite preview via Tailscale Serve on `/` ([docs/install-and-onboarding.md](docs/install-and-onboarding.md)), not by that JSON `sendJson` helper — so highlighter XSS is not covered by the API CSP. **Tokenize to React spans (DiffPatch pattern). Never `innerHTML`. Language id = allowlist from `toolName` / fence info-string, else `text`.**

Bidirectional Unicode in copied code survives paste into editors (Trojan Source, CVE-2021-42574; [trojansource.codes](https://trojansource.codes/); [arXiv 2111.00169](https://ar5iv.labs.arxiv.org/html/2111.00169)). A full-screen code viewer that “looks like Claude” will hide U+202E unless the viewer visualizes it. Copy will faithfully re-export it.

### 1.8 Full-screen (the F6 viewer shell) must be a *snapshot of a redacted block*, not a new data plane.

There is **no** `F6` component in this repo today (grep of `*.tsx`/`*.ts`/`*.md`). The charter’s “F6 viewer shell” is the shared overlay other passes are specifying. On this stack it must be react-aria `Modal` + `Dialog`: focus trap, `aria-modal`, `slot="title"`, `slot="close"`, `isDismissable` ([React Aria Modal](https://react-spectrum.adobe.com/react-aria/Modal.html)). Apple HIG: a full-screen modal is for in-depth content; **always ship an explicit Close**, even if swipe-down exists; Close/Cancel on the **leading** edge of the top toolbar ([HIG Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets); [HIG Modality](https://developer.apple.com/design/human-interface-guidelines/modality); WWDC19 “What’s New in iOS Design”). Because the viewer is read-only, there is no unsaved-edit confirmation and `isModalInPresentation` is unnecessary.

Security constraints on that shell:

- Props are `{ title, language?, text, redaction? }` copied from the **current block revision** at open. Streaming updates may append inside the same modal **only if** they are later revisions of the same `block.id` already applied by `transcriptReducer` (highest revision wins, [`state.ts`](apps/pi-remote-web/src/state.ts)). No extra fetch.
- Chrome (`user-select: none`); body (`user-select: text`) so iOS Select-All does not copy “Copy / Close / File diff”.
- Close control must clear `env(safe-area-inset-top)` — installed iOS PWAs have trapped users behind the status bar when `X` sat at `top-4` with no safe-area and no history entry (documented failure in `ncvgl/slawk` PR discussion cited by the interaction pass).
- No `<a download>`, no `URL.createObjectURL` of the payload, no `showSaveFilePicker` (File System Access API is not available in iOS Safari/PWA; [Apple Forums](https://developer.apple.com/forums/thread/816515)).
- Screenshots of the modal cannot be blocked in a PWA. Treat Expand as “larger type,” not as a confidentiality upgrade.

### 1.9 Claude-parity is Copy + view, not Publish, not host open, not remix-from-URL.

Claude’s artifact window exposes view-code, copy, and download; **Publish** is a separate, capability-gated action that mints a public URL ([Claude Help — Artifacts](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them); [Publish and share](https://support.claude.com/en/articles/9547008-publish-and-share-artifacts)). Pi Remote must not grow a publish lane. Local design evidence already shows Claude iOS putting an artifact **card** in the turn (`Piano MIDI Player` / `Interactive artifact`) with a turn action row of copy/share/play ([`docs/design-reference/mobile-chat-apps/01-visual-teardown.md`](docs/design-reference/mobile-chat-apps/01-visual-teardown.md); Mobbin Claude iOS chat-detail / coding-input flows: [screen 63d3bc73](https://mobbin.com/explore/screens/63d3bc73-3bc9-4d13-996f-aa4a4a881b5b) wait - use the search URLs: [Claude iOS chat detail](https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8), [coding input flow](https://mobbin.com/explore/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b), [Claude Web publish-artifact modal](https://mobbin.com/explore/screens/36894d50-1a68-4142-8907-ad5623a47fc7) as a **negative** reference — that confirm-to-publish dialog is exactly the mutation we do not add).

Council already locked: `InlineAttachmentCard` / `ArtifactCard` “Uses existing redacted data only; no new upload or mutation lane” ([`council-gpt-sol.md`](docs/design-reference/mobile-chat-apps/council-gpt-sol.md) L152–L154).

Kimi Code CLI is a **terminal** agent with confirmation on file edits and shell ([MoonshotAI/kimi-code](https://github.com/MoonshotAI/kimi-code)). Its information-design (tools as conversational objects) is a UX target; it is not a license to stream raw host paths to a phone clipboard.

### 1.10 There is no upload path today. The protocol fail-closes it. That is the feature’s friend.

Facts:

- `PromptSubmitCommand` allowlists keys `{ type, submissionId, sessionId, message, ticket, streamingBehavior }` — **any extra key fails** [`isPromptSubmitCommand`](packages/pi-rpc-protocol/src/guards.ts) L253–L267.
- HTTP bodies are capped at **16 384 bytes**; WS messages at 64 KiB; prompts 20/min ([`server.ts` L39–L43](apps/pi-remote-relay/src/http/server.ts)).
- `/api/prompt/submit` consumes a one-use ticket for action `prompt:submit` ([`server.ts` L510–L540](apps/pi-remote-relay/src/http/server.ts)).
- `PromptService` sends `{ type: 'prompt', message, streamingBehavior? }` to the Pi child — **no `images`** ([`prompt-service.ts` L109–L116](apps/pi-remote-relay/src/prompt/prompt-service.ts)), even though Pi RPC `PromptCommand` already declares optional `images?: ImageContent[]` ([`types.ts` L22–L26](packages/pi-rpc-protocol/src/types.ts)).
- Composer `+` “Attach” is specified as **hidden until a real attachment path exists** ([`council-gpt-sol.md`](docs/design-reference/mobile-chat-apps/council-gpt-sol.md) L38).

Copying a command and pasting it into `Reply to Pi` is **not** an upload. It is a new ticketed `prompt.submit` of text the user can already see. That is the only phone→agent path this feature may create.

iOS PWAs cannot read the host Mac disk and cannot use `showDirectoryPicker`. The only phone-local file source that exists in WebKit is `<input type="file">` (Photos / Files picker), user-gesture gated, with historically stripped EXIF/GPS on many Safari paths ([Ask Different](https://apple.stackexchange.com/questions/326789/gps-exif-from-iphone-photo-upload-in-safari); [SO 57942150](https://stackoverflow.com/questions/57942150/file-upload-and-exif-in-mobile-safari)). That path is **out of scope for this feature** and must not be smuggled in via Share-as-file or “save artifact.”

### 1.11 Current Copy is already a live exfil of assistant prose — cards multiply it.

`AssistantActions` copies the full assistant `text` with `writeText` and swallows errors ([`App.tsx` L1404–L1410](apps/pi-remote-web/src/App.tsx)). Hit target is `min-height: 2rem` (32px) ([`style.css` `.turn-action`](apps/pi-remote-web/src/style.css)) — above WCAG 2.2 SC 2.5.8’s 24×24 CSS px ([Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)) but **below Apple’s 44×44 pt** HIG button target ([HIG Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)). Card Copy/Expand must not ship 16px glyph-only hits.

Stale cache (`pi-remote.read-only.v1`, 8 sessions × 500 blocks, 7 days, [`cache.ts`](apps/pi-remote-web/src/cache.ts)) already stores redacted blocks in `localStorage`. Copy from a stale session still exports tailnet transcript to the pasteboard while the composer is correctly disabled (`isStale` disables submit, [`App.tsx` L1055–L1061](apps/pi-remote-web/src/App.tsx)). Full-screen from cache is allowed; it must not look like live host access. Push remains content-free (`lookupId` + `attentionClass` only) ([docs/security.md](docs/security.md) §9) — cards must never be stuffed into a push payload.

---

## 2. Concrete spec contribution (build-phase executable)

### 2.1 Data contract (do not add kinds; do not add fetches)

Reuse existing `TranscriptBlock` fields only ([`types.ts` L185–L239](packages/pi-rpc-protocol/src/types.ts)):

| Card | Source fields (already redacted in ledger) | Not allowed |
|---|---|---|
| Bash Command/Output | Pair `tool_call` (`toolName === 'bash'` or `bash_execution_update` results) + matching `tool_result` by turn grouping already used in `ActivityGroup` | Fetching `event.args`, host cwd, unredacted argv |
| Fenced / tool code | Assistant `text` slices once markdown is parsed **or** `tool_result.output` / `file_diff.patch` as monospace | `dangerouslySetInnerHTML`, language class from raw fence |
| Goal-prompt / long-text artifact | Settled `text` with `role: 'user'` when length ≥ threshold; assistant long `text` as artifact **preview** | Optimistic `pendingPromptIds`; `kind: 'unknown'` payload |

**Plumbing (required for honest UX):** extend `DisplayTranscriptBlock` with optional `redaction: { policyVersion: 1, fieldsRedacted: number, reasons: readonly string[] }` copied from the parent envelope in `blocksFromEnvelopes`. If missing (cache from older clients), treat as `{ fieldsRedacted: 0, reasons: [] }` and do not claim “unredacted.”

**Invariant:** the string passed to `clipboard.writeText` === the string rendered in the card body === `block.inputSummary` | `block.output` | `block.text` | `block.patch` at that `revision`. No second client-side redaction pass that would make clipboard ≠ screen (except the optional bidi *visualization* which must not mutate the copied bytes unless the user opts into “Copy sanitized”).

### 2.2 Copy — states, gesture, a11y, motion

**Capability gate (same as today):** render Copy iff `typeof navigator.clipboard?.writeText === 'function'`. No fake disabled control ([`App.tsx` L1387–L1395](apps/pi-remote-web/src/App.tsx); council honesty rule).

**Gesture:** single tap on a 44×44 pt hit target (Apple HIG). WCAG AA floor is 24×24 ([SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)); this app’s iPhone target is 44 pt.

**Synchronous write (Safari):**

```ts
onPress={() => {
  void navigator.clipboard.writeText(plain).then(ok, fail);
}}
```

`plain` is already in the closure. **No** `await fetch`. **No** `ClipboardItem` unless a future build copies a Blob of the *same* `plain`. MIME: `text/plain` only.

**States**

| State | Visual (ink-on-parchment) | SR |
|---|---|---|
| Idle | Inter 12–13px “Copy” + glyph, carbon ink, no fill | `aria-label="Copy command"` / `"Copy output"` / `"Copy code"` / `"Copy prompt"` |
| Pressed | 80ms opacity 0.7; `prefers-reduced-motion: reduce` → skip | — |
| Copied | Label “Copied” 1500ms (match existing timer) | `aria-live="polite"` “Copied” |
| Failed | Label “Can’t copy”; no toast of the payload | `aria-live="assertive"` “Copy failed” |
| Hidden | Clipboard API absent | control not in tree |
| Blocked | `pendingPromptIds` or `kind === 'unknown'` | control not in tree |

Do not copy while the block is optimistic. Streaming: Copy is enabled and copies the **current revision**; prefix the accessible name with “partial ” when `running && block` is the in-flight tool_result. Visible 1-line “Partial” chip in clay only if `fieldsRedacted` is not the story — use muted Inter, not clay, so clay stays for primary actions.

**What is copied**

- Command card: `inputSummary` only (not the Output, not the label “Tool call · bash”).
- Output card: `output` only.
- Combined Claude-style Command/Output card: Copy on the **header** copies `command + "\n" + output` as two sections; per-pane Copy buttons copy one pane. Default header Copy = both, because that matches “copy the terminal card.”
- Code artifact: fence body without the backticks; do not include the language tag in the clipboard.
- Prompt artifact: committed `text` only.

**Never:** `clipboard.read()`, `clipboard.readText()`, paste listeners, copying `originalKind` of `unknown` blocks, copying `usage` numbers into a “code” card.

### 2.3 Expand / F6 viewer — states, gesture, a11y, motion

**Shell:** one shared `ArtifactViewer` = react-aria `Modal` + `Dialog`, reused for bash, code, prompt, and (later) `file_diff`.

| Prop | Rule |
|---|---|
| `isDismissable` | `true` (read-only; swipe/backdrop/Escape) |
| `isKeyboardDismissDisabled` | `false` |
| Close | `Button slot="close"`, leading, 44pt, `aria-label="Close"`, `top: env(safe-area-inset-top)` |
| Title | `Heading slot="title"`: `bash` / `Code` / `Prompt` + optional redaction chip |
| Body | monospace for command/code/output; Source Serif 4 for long prompt/prose artifact |

**Gesture**

- Tap expand control (44pt, `aria-label="Open full screen"`) on the card.
- Swipe down on the overlay to dismiss (HIG sheet pattern; [HIG Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets)).
- Backdrop tap dismisses.
- Escape / VoiceOver “Close” dismisses.
- Vertical pan inside the `<pre>` scrolls content; only an overscroll-at-top downward swipe dismisses (same conflict WWDC19 called out for sheets).
- Long-press in the body: native iOS selection + system Copy. Do not hijack `copy` events.

**Motion:** overlay fade 150–200ms (`ModalOverlay` `[data-entering]` / `[data-exiting]` as in React Aria examples). `prefers-reduced-motion: reduce` → instant. No zoom-from-card if it causes 3D transform containing fixed headers under the Dynamic Island.

**Visual**

- Canvas: bone `#f8f8f6` / dark inverse; hairline carbon at 8–12% opacity; clay `#d97757` only on the primary Copy in the viewer toolbar (not on Close).
- Redaction chip (if `fieldsRedacted > 0`): muted Inter 12px, e.g. `Redacted · path, secret` using `reasons` already sorted by the relay. Never show the pre-redaction values.
- Streaming: same chip `Updating` bound to `aria-live="polite"` on the pre, not a second live region that double-speaks.

**Security**

- Snapshot at open: `{ id, revision, text }`. If a newer revision of the same `id` arrives, replace `text` in place. If `id` changes, ignore.
- No network. No download. No Share in the viewer.
- `user-select: none` on toolbar; `user-select: text` on body.
- Do not put the payload in the URL hash or history state (no leak via screenshot of the address, no back-stack dump).

### 2.4 Card chrome (read-only, Claude-shaped, fail-closed)

**Bash Command/Output**

- Collapsed in Activity until expanded as a **card** (this feature’s promotion): two stacked panes, labels `Command` / `Output` in Inter, bodies in monospace.
- Errors (`isError`): Output pane stays expanded; clay is not used as “error red” — use existing `.error-output` token.
- Copy + Expand on the card header. No “Run again,” no “Open on host,” no “Save to workspace.”

**Code**

- Fence or `tool_result` rendered as DiffPatch-style spans. Language from allowlist: `bash|sh|zsh|ts|tsx|js|json|diff|text`. Unknown → `text` (no class).
- Copy + Expand. No execute.

**Prompt / long-text artifact**

- Label (Inter medium) + 3-line preview + Copy + Expand.
- User prompt artifacts only after `promptAccepted`. Preview may include `[REDACTED_*]` markers; do not restyle them as “tap to reveal.”

**Unknown blocks:** keep the existing quiet line; **no Copy, no Expand** ([`App.tsx` L1535–L1541](apps/pi-remote-web/src/App.tsx)).

### 2.5 Exact safe path: phone → agent (uploads and “send this”)

**This feature adds zero new routes.** Anything that must reach Pi uses the path that already exists:

```
user gesture in composer
  → submitPrompt(sessionId, submissionId, message, steer|followUp?)
  → POST /api/auth/ticket          (one-use)
  → POST /api/prompt/submit        PromptSubmitCommand allowlist only
       body ≤ 16 KiB
       ticket consumed as prompt:submit
       extra keys → 400 invalid_prompt
  → PromptService.supervisor.send({ type: "prompt", message, streamingBehavior? })
       images omitted
  → projectSubmittedPrompt → Envelope
  → redactEnvelope (policy v1) → SQLite → broadcast
  → PWA replaces optimistic block with redacted TextBlock
```

([`relay.ts`](apps/pi-remote-web/src/relay.ts) L59–L87; [`server.ts`](apps/pi-remote-relay/src/http/server.ts) L510–L540; [`prompt-service.ts`](apps/pi-remote-relay/src/prompt/prompt-service.ts); [`redaction.ts`](apps/pi-remote-relay/src/store/redaction.ts))

**Copy → paste into composer → Send** is that path. The bytes are whatever already rendered. Plan mode / mutation kill switch / exact-action leases are unchanged: a pasted bash snippet is **steering text**, not a `process` family `bash` tool execution. Execution still requires host/extension + family `PI_REMOTE_MUTATION_FAMILY=process` ([docs/security.md](docs/security.md) §7).

**Forbidden for this feature (and for any later Attach unless a new spec opens):**

| Action | Why it fails closed |
|---|---|
| `images` on `prompt.submit` | extra key rejected by `PROMPT_SUBMIT_KEYS` |
| `multipart/form-data` / `/api/upload` | no route; would write host disk |
| `navigator.share({ files: [new File(output)] })` | file-shaped exfil; looks like upload |
| `<a download>` / blob URL | iOS → Files/Share; new persistence |
| Relay reading Mac files for “full output” | violates “no host-filesystem reads”; no such API |
| Raising 16 KiB silently to sneak images | body cap is a security control, not a UX bug |

**If a later phase truly attaches a photo (not this feature), the only posture-preserving design is:**

1. User tap → `<input type="file" accept="image/jpeg,image/png,image/webp">` (Photos/Files only).
2. Keep the `File` in RAM; do not write `localStorage` / IndexedDB.
3. Re-encode via canvas/`createImageBitmap` so residual EXIF is not the trust model (Safari stripping is inconsistent across iOS versions).
4. **Protocol RFC:** add an allowlisted `images` array to `PromptSubmitCommand` **and** a new explicit HTTP budget; fail closed until both land.
5. Relay maps to existing Pi RPC `PromptCommand.images`.
6. Ledger stores a redacted user **text** block (`Attached image · image/jpeg · N bytes`), never the bytes.
7. Relay still does not write the image into the workspace. The child gets in-memory image content for the model only.

Until those seven land, Attach stays hidden ([council](docs/design-reference/mobile-chat-apps/council-gpt-sol.md)).

### 2.6 Tests a build must add (security, not cosmetics)

- Copy payload equals ledger field after a fixture that contains `/Users/…`, `Bearer …`, `ghp_`, and a **relative** `.env` path (expect first three marked, last still present — documents the known gap).
- Copy is not rendered on optimistic user blocks.
- `unknown` blocks have no Copy/Expand.
- Viewer open does not call `fetch` / `submitPrompt` / `controlRuntime`.
- Share is not present on tool/code cards.
- Highlighter never emits `innerHTML` (static analysis or React `dangerouslySetInnerHTML` grep = 0).
- Language class only from allowlist.
- Envelope `redaction.reasons` surfaces on the card when `fieldsRedacted > 0`.

---

## 3. Divergent / minority ideas (resist converging)

1. **Outbound copy-guard, not inbound paste-guard.** `secret-stripper` wraps *pastes into* CLI agents ([kalix127/secret-stripper](https://github.com/kalix127/secret-stripper)). Pi Remote’s leak is the opposite direction. A second, stricter client regex before `writeText` would make clipboard ≠ screen. Minority option: dual control “Copy” vs “Copy sanitized” (strip bidi + URL-embedded `user:token` + `AKIA`). Default stays verbatim-as-shown so operators can paste a redacted command and see the markers.
2. **Do not put tool output on the general pasteboard at all.** Only native iOS selection Copy (user explicitly selects). Loses Claude parity; gains OWASP-aligned minimization ([MASTG-KNOW-0083](https://mas.owasp.org/MASTG/knowledge/ios/MASVS-PLATFORM/MASTG-KNOW-0083/)). Worth it if Universal Clipboard to a shared Apple ID is in-scope threat.
3. **Expire clipboard.** Native PWAs cannot set `UIPasteboard.local` or expiration. A follow-up copy of `" "` after 60s is hostile UX and still loses the race to Universal Clipboard. Reject unless WKWebView/native shell appears.
4. **Show a confirm sheet before Copy when `reasons` includes `secret`.** HIG allows a modal when the action has consequences ([HIG Modality](https://developer.apple.com/design/human-interface-guidelines/modality)). Conflicts with Claude’s one-tap copy. Use only if product treats phone clipboard as hostile.
5. **Hash-bind Copy to the ledger.** Copy concatenates `sha256(text).slice(0,12)` as a canary footer so pasted leaks are attributable. Pollutes the paste for real coding use. Optional behind a Settings flag, off by default.
6. **Visualize Trojan Source instead of stripping on copy.** Render U+202E as a visible `<U+202E>` chip in the F6 viewer; keep copy bytes intact. Better for audit than silent strip.
7. **Keep bash inside Activity disclosure; only file_diff stays a card.** Security-minimizing: fewer Copy affordances. Diverges from the Claude/Kimi target bar. Compromise: Copy exists only inside the F6 viewer, not on the collapsed card — one extra tap, half the accidental pasteboard writes.
8. **Refuse Expand while `connection !== 'live'`.** Prevents studying stale cached secrets on a lost phone. Conflicts with the existing offline cache product. Prefer: Expand allowed, banner `Stale · cached redacted transcript`, composer still disabled.
9. **Pipe Copy into composer (“Send to Pi”) as a one-tap.** That is still `prompt.submit` of visible text — protocol-safe — but it looks like “re-run this bash on the host.” Do not label it Run. If offered, label **“Insert into reply”** and never auto-submit.
10. **Client-side highlighter in a Web Worker.** Isolates CPU DoS from pathological tool output; does not fix XSS if the worker posts HTML. Only useful if tokenization stays text/spans.

---

## 4. Open questions + risks

| ID | Question | Why it matters |
|---|---|---|
| Q1 | Should `DisplayTranscriptBlock` grow `redaction` metadata, or is a parallel map by `eventId` required because one envelope can project multiple blocks? | Projector can emit tool_result + file_diff from one event ([`transcript-projector.ts` L364–L371](apps/pi-remote-relay/src/store/transcript-projector.ts)). Stamp must not be dropped on the diff sibling. |
| Q2 | Is relative-path leakage in bash argv an accepted residue of policy v1, or a P0 to tighten `POSIX_PATH_PATTERN` before shipping Copy? | Copy multiplies it. Tightening regexes can over-redact `src/` and break operator debugging. |
| Q3 | URL-embedded credentials (`https://x:ghp_…@github.com`) are a documented OpenHands-class miss. Extend `TOKEN_PATTERN` in the **relay** (single source of truth) before UI Copy, or ship Copy against current policy? | UI cannot fix a ledger that already stored the token. |
| Q4 | Does Vite-preview CSP for `/` match the JSON API `default-src 'none'`? | Highlighter XSS lives in the document, not in `/api`. Unverified in this pass. |
| Q5 | Shared Apple ID / Universal Clipboard: in-scope threat or operator environment assumption? | Determines whether tool-output Copy is allowed at all. |
| Q6 | Threshold for “long-text artifact” vs ordinary serif prose? | Too low → every user bubble gets Copy+Expand (optimistic-copy footgun). Too high → Claude parity misses. |
| Q7 | Pairing `tool_call`↔`tool_result` for a Command/Output card: `toolCallId` is **not** on the DTO today. | Grouping is UI-heuristic (`ActivityGroup`). A wrong pair would copy the wrong output. May need a protocol field — that is a contract change, not a CSS change. |
| Q8 | Streaming bash `delta` envelopes: each revision is redacted independently. Can a secret split across two deltas evade `TOKEN_PATTERN` then reassemble on screen/clipboard? | Classic streaming-redaction bug. Needs a projector-level test. |
| Q9 | Lost-phone: `localStorage` already holds 500 redacted blocks. Copy/Expand do not make that worse except by ease. Is cache encryption in scope? | Out of this feature; still a risk the card UX will be blamed for. |
| Q10 | Mobbin MCP was not callable in this session (no MCP servers). Visual claims for Claude iOS artifact expand vs inline card should be re-checked on-device or via authenticated Mobbin. | Do not over-claim a full-screen artifact viewer exists on Claude iOS. |

**Risks if the spec is ignored**

- Copy-after-fetch “to get full unredacted output” would both fail on iPhone and blow the redaction boundary.
- `innerHTML` highlighting + attacker language id = XSS inside a tailnet PWA that already holds session cookies (`HttpOnly` session cookie still does not save you from DOM XSS acting as the enrolled device).
- Share-as-file or download creates the upload-shaped API this protocol spent allowlists avoiding.
- Copy on optimistic prompts puts pre-redaction secrets on Universal Clipboard.
- A Run/Retry control on a bash card would be a new mutation and must use the ticketed `process` family lease — it is **not** part of this feature.

---

## 5. Sources

### In-repo (ground truth)

- [`apps/pi-remote-relay/src/store/redaction.ts`](apps/pi-remote-relay/src/store/redaction.ts) — policy v1
- [`apps/pi-remote-relay/tests/redaction.test.ts`](apps/pi-remote-relay/tests/redaction.test.ts)
- [`apps/pi-remote-relay/src/store/transcript-projector.ts`](apps/pi-remote-relay/src/store/transcript-projector.ts)
- [`apps/pi-remote-relay/src/prompt/prompt-service.ts`](apps/pi-remote-relay/src/prompt/prompt-service.ts)
- [`apps/pi-remote-relay/src/http/server.ts`](apps/pi-remote-relay/src/http/server.ts) — 16 KiB, CSP, ticketed prompt
- [`packages/pi-rpc-protocol/src/types.ts`](packages/pi-rpc-protocol/src/types.ts) — blocks + `PromptCommand.images`
- [`packages/pi-rpc-protocol/src/guards.ts`](packages/pi-rpc-protocol/src/guards.ts) — `PROMPT_SUBMIT_KEYS` fail-closed
- [`apps/pi-remote-web/src/App.tsx`](apps/pi-remote-web/src/App.tsx) — Activity group, Copy/Share, DiffPatch
- [`apps/pi-remote-web/src/state.ts`](apps/pi-remote-web/src/state.ts) — envelope payload only
- [`apps/pi-remote-web/src/cache.ts`](apps/pi-remote-web/src/cache.ts)
- [`apps/pi-remote-web/src/relay.ts`](apps/pi-remote-web/src/relay.ts) — `submitPrompt`
- [`docs/security.md`](docs/security.md)
- [`ARCHITECTURE.md`](ARCHITECTURE.md) §5–7
- [`docs/feature-catalog/transport-and-state/canonical-redaction.md`](docs/feature-catalog/transport-and-state/canonical-redaction.md)
- [`docs/design-reference/mobile-chat-apps/01-visual-teardown.md`](docs/design-reference/mobile-chat-apps/01-visual-teardown.md)
- [`docs/design-reference/mobile-chat-apps/council-gpt-sol.md`](docs/design-reference/mobile-chat-apps/council-gpt-sol.md)

### Official docs / HIG / a11y / clipboard

- https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
- https://kian.org.uk/writing-to-clipboard-in-safari-transient-activation/
- https://github.com/github/gh-aw/pull/2441
- https://developer.apple.com/design/human-interface-guidelines/sheets
- https://developer.apple.com/design/human-interface-guidelines/modality
- https://developer.apple.com/design/human-interface-guidelines/buttons
- https://developer.apple.com/design/human-interface-guidelines/accessibility
- https://developer.apple.com/videos/play/wwdc2019/808/
- https://support.apple.com/en-us/102430
- https://support.apple.com/guide/security/handoff-security-secf78dbe639/web
- https://mas.owasp.org/MASTG/knowledge/ios/MASVS-PLATFORM/MASTG-KNOW-0083/
- https://developer.apple.com/forums/thread/713770
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://react-spectrum.adobe.com/react-aria/Modal.html
- https://www.webshareapi.com/web-share-api-security-contexts/browser-support-matrix-for-web-share-api/
- https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them
- https://support.claude.com/en/articles/9547008-publish-and-share-artifacts

### Security research (copy / highlight / uploads)

- https://trojansource.codes/
- https://ar5iv.labs.arxiv.org/html/2111.00169
- https://github.com/advisories/ghsa-vfrc-7r7c-w9mx
- https://github.com/highlightjs/highlight.js/issues/2886
- https://apple.stackexchange.com/questions/326789/gps-exif-from-iphone-photo-upload-in-safari
- https://stackoverflow.com/questions/57942150/file-upload-and-exif-in-mobile-safari
- https://developer.apple.com/forums/thread/816515

### GitHub prior art (coding-agent UIs + redaction)

- https://github.com/MoonshotAI/kimi-code
- https://github.com/openhands/openhands/issues/15338
- https://github.com/OpenHands/software-agent-sdk/pull/3792
- https://github.com/OpenHands/OpenHands/pull/12965
- https://github.com/kalix127/secret-stripper
- https://github.com/Cline/Cline
- https://github.com/anthropics/claude-code/issues/78792 (mobile artifact listing gap — do not assume Claude iOS = desktop artifact pane)

### Mobbin screens / flows (Claude as target; publish as anti-target)

- https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8 — Claude iOS chat detail
- https://mobbin.com/explore/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b — Claude iOS coding-input flow
- https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57 — Claude iOS text-input flow
- https://mobbin.com/explore/screens/160dd19d-0632-49a6-8cff-a00cf361e426 — Claude iOS empty state
- https://mobbin.com/explore/screens/36894d50-1a68-4142-8907-ad5623a47fc7 — Claude **Web** publish-artifact confirmation (do not implement)

Mobbin MCP was registered in this repo but **not available in this session** (empty MCP catalog; OAuth-gated calls remain operator-pending per `mcp-mobbin`). Screen IDs above are from the public Mobbin index, not from an authenticated `search_screens` response.
