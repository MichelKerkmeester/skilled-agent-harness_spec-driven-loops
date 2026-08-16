<!-- provenance: external-CLI orchestration pass; original file iter-09-grok.md -->
> **Source pass 9** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-9-grok.md`.

<!-- F6-file-preview | model=grok | lens=competitive-teardown | iter 9/10 | 2026-08-15T20:02:51.338Z -->

# Competitive teardown: Claude-style artifact/file viewer for Pi Remote (iPhone PWA)

Lens: how Claude iOS, Kimi, ChatGPT, Perplexity, DeepSeek, Gemini, and Meta AI actually open files — plus GitHub remote-agent clients. Goal: a build-executable viewer that matches Claude/Kimi feel without violating Pi Remote’s fail-closed, redaction-everywhere posture.

**Evidence limits (stated, not hedged):** Mobbin MCP is registered in this repo but **this session’s MCP catalog was empty** (no authenticated `search_screens` calls). Public Mobbin index URLs and titles were retrieved via web search; **pixel-accurate Mobbin screenshots timed out on fetch**. Geometry below for Claude cards comes from this repo’s staged teardown at ~390pt (`docs/design-reference/mobile-chat-apps/01-visual-teardown.md`). GitHub/HIG/official docs are primary for interaction contracts.

---

## 1. Findings for this lens

### 1.1 The category split (do not clone the wrong grammar)

Shipped products use **two different file surfaces**. Mixing them produces Claude-looking chrome that cannot show a coding-agent file.

| Grammar | What “open a file” means | Who |
|---|---|---|
| **A. Consumer artifact** | Model *creates* a document/app in a dedicated pane; tap expands it; share is a public link | Claude Artifacts, Gemini Canvas, ChatGPT writing/code blocks |
| **B. Remote-host artifact** | Bytes live on a Mac/Linux host; phone shows a **scoped, size-capped preview** of what the session already referenced | ChatGPT Codex mobile, Cmux iOS, OpenClaw iOS |

Pi Remote is **grammar B wearing grammar A’s ink-on-parchment skin**. The visual target is Claude; the data/security target is Cmux/OpenClaw/Codex-remote. Claude’s interactive React artifact is *not* the same object as a redacted `file_diff` patch.

### 1.2 Claude iOS — primary visual target

**In-thread card (measured in-repo at ~390pt):** assistant prose is serif, ~19–20px / 1.5–1.6 line-height; artifacts sit **in the turn**, not in a dock. Card: ~16px radius, hairline border, near-canvas fill; **title (medium sans) + muted subtitle** (`Piano MIDI Player` / `Interactive artifact`); **tilted thumbnail ~right**; a centered **`1 artifact` pill** can sit above the turn. Message actions (copy/share/play/vote/retry) are a **separate icon row under the prose**, ~20px glyphs, ~22–26px gaps — they are not inside the artifact card. ([local teardown](docs/design-reference/mobile-chat-apps/01-visual-teardown.md); Claude card screenshot indexed as `screens/claude-conversation-actions.png`)

**Open sequence (mobile vs desktop):** on desktop the artifact panel is a **right split** that auto-expands when Claude emits a qualifying artifact (~15+ lines / full document / chart). On **mobile the same object is a full-screen overlay you dismiss** — not a persistent split. ([TechBink 2026 guide](https://techbink.com/how-to-use-claude-artifacts/); [Anthropic Artifacts GA](https://claude.com/blog/artifacts) via search index; [build-artifacts, iOS/Android 21 Jul 2025](https://claude.com/blog/build-artifacts))

**Second surface:** a dedicated **Artifacts space in the app sidebar** (Free/Pro/Max as of that post), for browse/remix, not only in-chat cards. Share is **link-based**; signed-in viewers get the full interactive experience. MCP + persistent storage landed 21 Oct 2025. ([build-artifacts](https://claude.com/blog/build-artifacts))

**Mobbin flows (iOS, public index — titles only, pixels not retrieved this pass):**
- Chat detail: [mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8](https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8)
- Text chat: […/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57](https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57)
- **Image input** (attach → translate): […/flows/d386db15-c86c-4c9e-916a-68e2b84251e1](https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1) — 7 timed steps (0:00–0:19)
- **Coding input**: […/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b](https://mobbin.com/explore/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b)
- Web conversation-with-image (desktop contrast): […/screens/ce7d8bb5-3e54-4936-848d-000c2a9ff599](https://mobbin.com/explore/screens/ce7d8bb5-3e54-4936-848d-000c2a9ff599)

**Implication for Pi:** clone the **card + overlay**, not the desktop split, and **do not auto-open** the overlay on every `file_diff` (Claude auto-opens because the model *created* a product; a coding agent emitting 12 patches would trap the operator).

### 1.3 ChatGPT iOS — the category is moving *off* split panes

**Canvas is being retired on current models.** OpenAI’s 12 May 2026 notes: canvas is **no longer available in GPT-5.5 Instant or Thinking**; writing/coding move into **in-thread writing blocks and code blocks**; paid users keep canvas only on **legacy models until sunset**. ([ChatGPT release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)) Independent write-up of the same change: split canvas was an engineering burden **because it does not render the same on phone vs desktop**; inline blocks do. ([Medium, Burfat](https://medium.com/@mubashirburfat4/i-used-chatgpts-canvas-feature-for-six-months-then-openai-quietly-killed-it-88c542f1a63f))

**What replaced it (web-first, mobile-partial):**
- **Writing blocks** can open a **focused full-screen editor** for long-form (essays, PRDs, reports), with TOC, download, Library save. This block is listed under **Web** in the notes, not under the iOS subsection next to it. ([release notes, “Full-screen writing blocks”](https://help.openai.com/en/articles/6825453-chatgpt-release-notes))
- **Interactive code blocks** (19 Feb 2026): inline edit; **preview diagrams/mini-apps in chat**; **split-screen code review**. ([same notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes))
- **iOS image path:** tap-to-original-size for inline web images; **immediate thumbnail after send** (was a gray box). Mobbin titles a **full-screen image + save confirmation**: [mobbin.com/explore/screens/d95a9997-a076-4b09-be7e-4a332053f220](https://mobbin.com/explore/screens/d95a9997-a076-4b09-be7e-4a332053f220). Composer camera: […/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1](https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1).
- **Library:** files persist until deleted; composer **Recent files** works on iOS; **Library browse is web-only**. Caps: Free 500 MB, Go 4 GB, Plus/Business 20 GB, Pro 100 GB. Attach up to **20 files/message** (web, 13 Feb 2026). ([same notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes))
- **Desktop agent preview** (ChatGPT desktop, not iOS): auto-open generated file when enabled; HTML **preview ↔ source**; annotations on a region. Codex CLI explicitly **has no visual preview**. ([learn.chatgpt.com/docs/artifacts-viewer](https://learn.chatgpt.com/docs/artifacts-viewer))
- **Google Docs side-by-side** (13 Aug 2026) is **web**; OpenAI says **mobile “will follow.”** ([NerdSchalk](https://nerdschalk.com/chatgpt-can-now-open-google-docs-sheets-and-slides-side-by-side-in-chat/))

**Closest ChatGPT analog to Pi Remote:** **Codex remote from the ChatGPT iOS app** (14 May 2026). Phone QR-pairs to a **Mac host that must stay awake**; mobile loads **project context, approvals, screenshots, terminal, diffs, test results**. That is grammar B. ([release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes))

**Implication:** matching “ChatGPT on iPhone” in 2026 means **inline card → optional full-screen**, not a Canvas clone. Auto-preview belongs on desktop agents, not on the phone overlay.

### 1.4 Gemini — Canvas is a named mode, mobile is view-only

Official: Canvas is a **composer chip** (“select Canvas below the prompt bar”). Mobile FAQ: **you can open Canvas projects in the app; you cannot edit text style/format on mobile** (desktop web only). ([gemini.google/overview/canvas](https://gemini.google/overview/canvas/))

**Desktop Canvas chrome (do not port wholesale to a 390pt PWA):** header actions **Preview / Code / Show console / recent changes**; docs also expose **Select & ask**, **Create** (web page, infographic, quiz, audio, LaTeX), **Share & export** (`g.co/gemini/share` copy-link). Shared Canvas **links do not open in the Gemini mobile app**. Export: Docs / Slides / PDF / Colab. Version stepper: Previous/Next Version. ([support.google.com/gemini/answer/16047321](https://support.google.com/gemini/answer/16047321))

**Mobbin:** image-upload → identify place → Maps: [mobbin.com/explore/flows/e5b8846f-e7bb-481a-82bd-47f29bfb6653](https://mobbin.com/explore/flows/e5b8846f-e7bb-481a-82bd-47f29bfb6653). This repo’s Gemini screenshot is a **plan card + composer chip**, not a file viewer (`01-visual-teardown.md`).

**Implication:** steal **Preview ↔ Code** for HTML/text only, and **view-only on phone**. Do not ship Gemini’s Create/export-to-Docs cluster (those are mutations + Google account).

### 1.5 Kimi — two products; neither is a Claude overlay

**Kimi iOS (consumer, App Store id 6474233312):** Visual Agentic **Slides**, live **dashboards**, game generation, Office Agent with **PPT/Word/Excel/PDF “lossless swaps”**, vibe-coding a website. That is a **generated-document player**, not a host-workspace preview. ([App Store](https://apps.apple.com/us/app/kimi-kimi-k3-is-live/id6474233312))

**Kimi Code (the coding agent):** CLI + VS Code + ACP. **File Changes panel** after edits: list of files with **added / modified / deleted** and **+/- line stats**; tap opens **VS Code native diff**; restore/keep; bulk keep/undo; baseline captured at first mutation. Media input caps: paste **5 MB** (compress to ~2 MB), picker images **10 MB**, video **20 MB**, **≤9 files**, **≤80 MB** total. Plan mode: expandable plan card before execution. This is **desktop-IDE**, not iPhone. ([Kimi Code core operations](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html); [kimi.com/code/docs](https://www.kimi.com/code/docs/en/); [MoonshotAI/kimi-code](https://github.com/MoonshotAI/kimi-code))

**No Kimi iOS file-viewer flow appeared in Mobbin search this pass.** Matching “Kimi Code app” on a phone means: **a file-change list with status + stats that opens a read-only diff/file**, not Kimi’s slide player and not VS Code restore (restore is a mutation; Pi is read-only by default).

### 1.6 Perplexity iOS — attach-and-ask, almost no artifact stage

iOS 17+ app: `+` on the search bar → **Upload File** from Files. Spaces persist PDFs for later queries. ([Perplexity iPhone guide](https://perplexityaimagazine.com/perplexity-hub/how-to-use-perplexity-ai-on-iphone/))

Mobile vs desktop (third-party table; treat as **unofficial**): mobile **25 MB**, PDF/PNG/JPG/TXT only; desktop **100 MB**, adds DOCX/XLSX. ([WiseChecker](https://wisechecker.com/perplexity-file-upload-failed-mobile-fix/)) Consumer web often cited as **40 MB, 10 files**; Sonar API **50 MB**, PDF/DOC/DOCX/TXT/RTF. ([DataStudios](https://www.datastudios.org/post/perplexity-ai-pdf-uploading-pdf-reading-capabilities-text-extraction-accuracy-layout-support-and-1))

**UX:** thumbnail in the composer, then **Q&A over extracted text**. There is no Claude-style dedicated viewer in the public write-ups. Sources open **out of process** (Safari). That is the **anti-pattern** for Pi: leaving the PWA to Files/Safari breaks the private tailnet mental model.

### 1.7 DeepSeek iOS — chat transcript is the viewer

Mobbin: [DeepSeek iOS Chat Bot Screen](https://mobbin.com/explore/screens/9fa85a22-a24c-4224-a3db-6c40827c1db4). Public docs do not describe a Canvas/Artifacts pane. The market gap is so real that **third-party iOS apps exist specifically to preview DeepSeek/ChatGPT/Claude Markdown and HTML** because Quick Look shows raw source. ([Md Preview](https://markdown.cybergame.ai/articles/); [AI Artifact Reader](https://github.com/EricZZZZhang/ai-artifact-reader); [Html Preview App Store](https://apps.apple.com/us/app/html-preview-web-file-viewer/id6760443436))

**Implication:** if Pi only keeps `file_diff` cards and `tool_result` `<pre>`, it **is** DeepSeek — the bar the brief says to beat.

### 1.8 Meta AI iOS — Instagram image grammar; share-without-preview is an anti-pattern

App Store: upload **docs, PDFs, spreadsheets**, multiple files; “Make things: presentations, lookbooks, quizzes, games.” ([App Store 1558240027](https://apps.apple.com/us/app/meta-ai/id1558240027)) Mobbin chat screen: […/screens/2f2c7ae9-3cc8-4841-9a96-c1c9074f2a73](https://mobbin.com/explore/screens/2f2c7ae9-3cc8-4841-9a96-c1c9074f2a73)

Glasses gallery: tap capture → **Share**; **“When you share media using Meta AI, you will not be able to preview or edit your media before sharing.”** ([Meta AI Glasses Help](https://www.meta.com/help/ai-glasses/683425686669295/))

**Do not copy that.** Pi’s share action must preview the **already-redacted** bytes, then `navigator.share`.

### 1.9 Apple HIG + iPhone PWA constraints (the stack cannot use Quick Look)

Native iOS file preview is **`QLPreviewController`**: push on a nav stack **or present modally full screen**; multi-item lists get **next/prev arrows**; action button includes Print. ([Using the Quick Look Framework](https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/DocumentInteraction_TopicsForIOS/Articles/UsingtheQuickLookFramework.html); [Previewing and Opening Files](https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/DocumentInteraction_TopicsForIOS/Articles/PreviewingandOpeningItems.html)) A PWA **cannot** present `QLPreviewController`. File System Access API is **unsupported** on iOS; Web Share and `<input type=file>` are the file I/O. Standalone PWAs still show the **status bar**; no immersive Fullscreen API you can rely on for a `div` on iPhone (`requestFullscreen` remains unreliable; it was enabled then **disabled** in Safari 17.4). ([MagicBell PWA iOS 2026](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide); [Apple Forums / Fullscreen API](https://developer.apple.com/forums/thread/133248))

**Sheets (if the viewer is a sheet, not a cover):** system detents **large** (fully expanded) and **medium (~half height)**; **grabber required** on resizable sheets — VoiceOver uses it to cycle detents. ([HIG Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets))

**Hit targets:** HIG default **44×44 pt**, platform minimum **28×28 pt** (iOS). ([HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility); [UI Dos and Don’ts](https://developer.apple.com/design/tips/)) WCAG 2.2 AA is milder: **2.5.8 Target Size (Minimum) = 24×24 CSS px** (with spacing exception). ([W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/Overview.html); [Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)) Meet **44×44** for Close/Share to match Claude/iOS, not the WCAG floor.

**Reduce Motion:** HIG: cut **zooming, scaling, peripheral motion**. ([HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)) WCAG **2.5.7 Dragging Movements (AA)** means pinch-zoom **cannot be the only** zoom path — provide `+`/`−`.

**PDF on iOS Safari:** `pdf.js` pinch often changes **visualViewport scale**, so the library thinks zoom never changed (WONTFIX; Safari “mostly” supported). ([mozilla/pdf.js#20584](https://github.com/mozilla/pdf.js/issues/20584)) Prefer **Safari’s native PDF plugin** (`<iframe>`/`<object type="application/pdf">` + blob URL) over pdf.js on iPhone.

### 1.10 GitHub prior art (this exact job: phone preview of host files)

**Cmux (`manaflow-ai/cmux` PR #7674, merged 14 Jul 2026)** — nearest open implementation.

- Mac RPCs: `mobile.chat.artifact.{stat,fetch,thumbnail,list,gallery}` gated on **`chat.artifact.v1` / `gallery.v1`**. Older hosts: **zero artifact RPCs**, UI unchanged.
- **Scope:** only paths **referenced in that session’s transcript**; **forbidden before any `stat`** (existence must not leak). Referenced dirs: **one child level**.
- Transfer: **3 MiB raw / frame**, under **8 MiB** codec cap. Viewer cap: **`stat` then refuse > 64 MB**. Thumbnails: ImageIO JPEG, memory + **~100 MB disk** LRU, prefetch next page.
- iOS states: **image | monospaced text | binary/unsupported | too large | file missing on Mac | Mac unreachable + retry**.
- Gallery: sections **Created / You attached / Referenced**; grid/list; search; floating **“N files”** chip. Tool sheets: **View file / Browse folder**.
- Soft-wrapped **path:line:col** is tappable. ([PR #7674](https://github.com/manaflow-ai/cmux/pull/7674))

**Pi must not copy Cmux’s fetch-from-disk.** Pi’s relay **already redacts before persist/broadcast** (`POSIX_PATH_PATTERN` → `[REDACTED_PATH]`). ([`apps/pi-remote-relay/src/store/redaction.ts`](apps/pi-remote-relay/src/store/redaction.ts)) A phone `stat` of the host tree would punch a hole in that contract. Copy Cmux’s **capability gate, explicit states, size-cap-before-decode, thumbnail cache, and “N files” chip** — not the filesystem RPC.

**OpenClaw iOS** (`openclaw/openclaw`): read-only **Files** on Agents — directory drill-down, **syntax-highlighted text**, **image preview**, **share-sheet export**; **previews size-capped by the gateway**; **no writes**. Assistant images: **short-lived Gateway artifact URLs**, full-screen preview, **bytes not stored in the transcript cache**. Canvas is a **WKWebView** the agent drives; remote A2UI is **render-only**. Pairing via Tailscale Serve is the documented remote path. ([docs/platforms/ios.md](https://github.com/openclaw/openclaw/blob/main/docs/platforms/ios.md); [PR #100767](https://github.com/openclaw/openclaw/pull/100767))

**EPAM AI DIAL Chat** (web, issue #7213): attachment **canvas** from any card; header = **filename + close + download + copy**; renderers: image, `<pre>`, Markdown, JSON (`dir="ltr"`), PDF with **thumbnail sidebar**; unsupported copy; canvas and sources panel **mutually exclusive**; close on route change. ([epam/ai-dial-chat#7213](https://github.com/epam/ai-dial-chat/issues/7213))

**Multica** `attachment-preview-modal.tsx`: one modal, seven kinds; images on a shared **ZoomCanvas** (fit, wheel, drag, pinch, double-click, keyboard). PDF via Chromium PDFium — **desktop-only**, not a PWA path. ([multica-ai/multica](https://github.com/multica-ai/multica/blob/main/packages/views/editor/attachment-preview-modal.tsx))

### 1.11 Pi Remote current surface (the gap, cited)

Transcript kinds today: `text | thinking | plan | tool_call | tool_result | file_diff | usage` (+ client `unknown`). [`FileDiffBlock`](packages/pi-rpc-protocol/src/types.ts) is only `{ summary, patch }`. Projector emits diffs for tools `edit | write | apply_patch` with summary `` `${toolName} changed a file` ``. ([`transcript-projector.ts`](apps/pi-remote-relay/src/store/transcript-projector.ts)) UI: labelled card + `DiffPatch` `<pre>` with `+/-` coloring; **not tappable**; no image/PDF/text/code viewer. Share exists only on **assistant text** via `navigator.share({ text })`. ([`App.tsx` `AssistantActions` / `file_diff` branch](apps/pi-remote-web/src/App.tsx))

**Redaction will strip POSIX paths inside patches**, so a viewer **cannot recover a real path** from `block.patch`. Title must be an **allowlisted basename or a generic “File change”** — never parse a path out of the patch on the client.

Unknown/redacted kinds already fail closed: *“A redacted `{originalKind}` block cannot be displayed by this client.”* Extend that copy; do not invent a fetch.

Stack already has **react-aria-components `Dialog` + `DialogTrigger` + `Popover`** in `SessionHeader.tsx` / `SessionComposer.tsx`. The viewer should graduate to **`ModalOverlay` + `Modal` + `Dialog`** (focus trap, scroll lock, Escape, restore focus) — RAC documents `isDismissable`, `--visual-viewport-height` for the iOS keyboard, and **iOS 26 overlay clipping** (backdrop should not rely on `position: fixed` filling the visual viewport). ([RAC Modal](https://react-spectrum.adobe.com/react-aria/Modal.html); [react-spectrum#8888](https://github.com/adobe/react-spectrum/pull/8888))

Design tokens already match Claude numbers: `--canvas: #f8f8f6`, `--ink: #121212`, `--accent: #d97757`, `--radius-lg: 1rem` (16px), `--duration-state: 220ms`, `--duration-fast: 120ms`, `--ease-out-interface: cubic-bezier(0.22, 1, 0.36, 1)`, `--font-display: Source Serif 4`, `--font-sans: Inter`. ([`style.css`](apps/pi-remote-web/src/style.css))

---

## 2. Concrete spec contribution (build-executable)

### 2.0 Protocol (blocker; UI without this is DeepSeek)

Add a **relay-projected, already-redacted** block (name it `file_preview` or `artifact` — not a client-side guess from `file_diff`):

```ts
interface FilePreviewBlock {
  kind: 'file_preview';
  id: string; revision: number; seq: number; occurredAt: string;
  displayName: string;          // allowlisted basename OR "File" — never a path
  mediaClass: 'image' | 'pdf' | 'text' | 'code' | 'diff' | 'binary' | 'unavailable';
  language?: string;            // code only, e.g. "ts"
  byteLength: number;           // of payload the relay is willing to send
  text?: string;                // text/code/diff only, already redacted
  image?: { mime: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif'; base64: string };
  pdf?: { mime: 'application/pdf'; base64: string };
  thumbnail?: { mime: 'image/jpeg'; base64: string }; // ≤ 64 KB, 96×96 @2x
}
```

Rules:
1. **Fail closed:** if the relay did not send a `file_preview` (or sent `mediaClass: 'unavailable'`), the client **never** requests host bytes. Capability-gate like Cmux `chat.artifact.v1`.
2. **No paths** in DTO; `POSIX_PATH_PATTERN` already proves patches are unsafe titles.
3. **Cap before decode:** refuse `byteLength > 8_388_608` (8 MiB) in the projector (PWA memory; Cmux’s 64 MB is native). Below that, still stream/chunk if you add fetch later — v1 should **embed in the sync payload** like today’s `patch`.
4. Keep `file_diff` cards as **decision artifacts**; `file_preview` is the **openable product**. A write tool may emit **both** (Kimi: list + diff; Claude: card + overlay).

### 2.1 In-thread card (Claude geometry, Kimi status)

**Layout (390pt, light + dark):**
- Full prose column width, not a user-bubble.
- Height: 64–72pt; padding 12–16pt (`--space-3`/`--space-4`).
- Radius `--radius-lg` (16px); fill `--surface`; border `1px solid var(--line)`; no drop shadow (Claude is hairline, not Material).
- Left stack: **displayName** Inter 15–16px / 650 weight / `--ink`, 1 line ellipsis; subtitle Inter 12–13px / `--ink-muted` = `{mediaClass label} · {compact bytes}` e.g. `Code · 12 KB` or `Diff · 34 lines`.
- Right: thumbnail 48×48pt, 8pt radius, 2pt `--line`; if no thumb, a **type glyph** (not a tilted 3D mock — that’s Claude-specific chrome; a flat glyph is more honest for diffs).
- Optional turn-level pill, centered, 12px muted: `N files` when the turn has >1 preview (Claude `1 artifact`; Cmux chip).
- Entire card is **one** `Button` (RAC). Do not nest Share on the card (Claude keeps share on the turn action row).

**Kimi overlay on the same card:** if `mediaClass === 'diff'`, subtitle includes `+a / −d` when the projector can count hunk lines **without parsing paths**.

### 2.2 Open / close sequence (ChatGPT overlay + HIG cover)

**Do not auto-open.** Operator taps the card (or VoiceOver activates it).

**Presentation by `mediaClass`:**
| Class | Presentation | Why |
|---|---|---|
| `image`, `pdf` | **Full-screen cover** (`ModalOverlay` 100dvh, canvas `--canvas` or `--surface-code` for image dim) | Matches Claude mobile overlay, ChatGPT full-screen image, QLPreview modal |
| `text`, `code`, `diff` | **Large detent sheet** (grabber visible) with option to expand to cover | Matches HIG sheets + ChatGPT writing-block focus without burying Close |
| `binary`, `unavailable` | **Non-expanding sheet**, 50% max | Prevents empty theatre |

**Chrome (44pt bar + `env(safe-area-inset-*)`):**
- Left: **Close** (`Button`, 44×44, label “Close file”). HIG: dismiss on the leading edge.
- Center: `displayName` truncated; subtitle in `aria-describedby`.
- Right: **Share** only if `navigator.canShare?.({ files })` or `{ text }` — same honesty as `AssistantActions`. No disabled fake.
- Optional trailing **Copy** for text/code/diff (clipboard API gated).
- No Print (QLPreview has it; PWA print of blobs is unreliable). No Restore (Kimi mutation).

**Dismiss:** Close; Escape; iOS swipe-down on **sheets**; **not** swipe-down on image cover (conflicts with pan). Backdrop tap: `isDismissable` **true** for sheets, **false** for image/pdf cover (accidental dismiss while zoomed). RAC `isKeyboardDismissDisabled={false}`.

**Focus (WCAG 2.4.3, 2.4.7, 2.4.11, 4.1.2):** `Dialog` with `aria-labelledby` = filename. Initial focus = Close. Restore focus to the card. `aria-modal` via RAC Modal. Background inert.

### 2.3 Renderers (iPhone Safari / PWA)

| `mediaClass` | Renderer | Gestures | Fail state |
|---|---|---|---|
| `image` | `<img>` on a pan/zoom layer; `object-fit: contain`; `alt` = `displayName` | Pinch, double-tap toggle 1×/2×, one-finger pan when zoomed; **+ / −** buttons (WCAG 2.5.7); max zoom 4× | Decode error → `unavailable` copy |
| `pdf` | **Native** `<iframe title={displayName} src={blobUrl} />` (Safari UnifiedPDF). **Do not** ship pdf.js as default | Let Safari own pinch; provide page `±` only if iframe is inaccessible | If iframe blank after 1.5s, fallback: “PDF can’t be previewed — Share to Files” |
| `text` | Source Serif 4, 17–19px, 1.5, `--reading-width` 66ch, parchment | Vertical scroll only; horizontal forbidden | — |
| `code` | `<pre>` Inter/SF Mono 13px/1.45; `--surface-code` **only if contrast ≥ 4.5:1** for `--ink-inverse`; else parchment + carbon (brand-first). Language from DTO, not guessed from redacted path | Horizontal scroll `overflow-x: auto`; `tabIndex={0}` so VoiceOver/keyboard can scroll | — |
| `diff` | Existing `DiffPatch` coloring, **full height in the overlay** (today it is inline-only) | Same as code | — |
| `binary` | Glyph + “Preview not supported” + Share if `canShare` | — | — |
| `unavailable` | Quiet copy: “The relay did not send a preview of this file.” **No Retry that would hit the host** | — | — |

**HTML/interactive (Claude/Gemini/ChatGPT mini-apps):** **out of v1** unless sandboxed `iframe` with `sandbox=""` (no `allow-scripts`) and a **text/source** toggle. A coding-agent HTML file on a tailnet PWA is an XSS primitive; Claude can afford a walled garden, Pi cannot. Market proof that phones fail here: entire apps exist to render AI HTML offline. ([AI Artifact Reader](https://github.com/EricZZZZhang/ai-artifact-reader))

**Blob hygiene (OpenClaw):** `URL.createObjectURL` on open; `revokeObjectURL` on close/unmount; **do not** persist base64 in `localStorage` or the transcript cache.

### 2.4 Multi-file (QLPreview arrows × Cmux chip)

If the **turn** (or session, if you add a chip) has multiple `file_preview` blocks:
- Cover/sheet shows `i of n`.
- Buttons Previous/Next, 44×44, disabled at ends (don’t wrap — wrapping hides the end).
- Optional one-finger **horizontal swipe** when zoom === 1 (image only).
- Session-level **`N files` floating chip** (Cmux) is **v1.1**: it needs a gallery DTO. v1: per-turn pill + in-viewer pager is enough to match Claude.

### 2.5 Share / copy (honest, redaction-aware)

1. Prefer `navigator.share({ files: [new File([blob], displayName, { type })] })` after `canShare`.
2. Else `share({ text })` for text/code/diff.
3. Else hide Share (existing `AssistantActions` rule).
4. Copy writes **exactly** `text` / `patch` already on the block — never an unredacted reconstruction.
5. **Preview before share** (inverse of Meta glasses).

### 2.6 Visual / motion (fixed design system)

- Overlay backdrop: `color-mix(in oklch, var(--ink) 40%, transparent)`.
- Enter: `isEntering` 220ms `--ease-out-interface`, `translateY(12px) + opacity`. Image cover: fade only (no scale-from-thumbnail — HIG Reduce Motion and WCAG vestibular).
- `@media (prefers-reduced-motion: reduce)`: **120ms fade**, zero translation/scale (`--duration-fast`).
- Dark theme: use existing `[data-theme='dark']` tokens; do not invent a third “cinema black” unless image cover (then `#000` behind the image only, chrome stays `--surface`).
- Focus ring: `--focus: #121212` 2px; 3:1 non-text contrast (WCAG 1.4.11).
- Clay `#d97757` **only** for the focused pager dot or “open” press; not for the Close button (Claude uses carbon chrome).

### 2.7 A11y checklist (AA, iPhone VoiceOver)

- Card name: `Open {displayName}, {mediaClass}, {size}`.
- Dialog: Close first in tab order; Share; renderer; pager.
- Images: not `aria-hidden` if they are the content; empty `alt` only for decorative thumbs **on the card** if the name is already in the button.
- Code/diff: `role="region"` + `aria-label="File contents"`; do **not** `aria-live` (would re-announce on scroll).
- Pinch alternatives: visible `+` `−` `Reset` for images (2.5.7).
- Dynamic Type: filename uses `1em`/`0.8125rem` rem, not locked px; code may cap at 200% to avoid horizontal blowout.
- Contrast: body text 4.5:1 on `--canvas` / `--surface` (WCAG 1.4.3). `--ink-muted` `#6c6a65` on `#f8f8f6` is the riskiest pair — **verify in both themes** before using it for the only subtitle.
- Hit targets 44×44 for Close, Share, pager, zoom.

### 2.8 States to implement (exhaustive)

`collapsed` → `opening` → `ready` | `too_large` | `unsupported` | `unavailable` | `decode_error`.  
Streaming: if `revision` increments (blocks already carry `revision`), replace text in place **without** resetting scroll if the operator is not at the bottom.

Loading spinner only if the payload is **chunked**; v1 embedded payload should paint in the same frame as the overlay.

### 2.9 What not to build (competitive negatives)

- Desktop split pane (ChatGPT killed it on current models; Claude mobile already abandoned it).
- Auto-open overlay on every patch.
- Host `stat`/`fetch` from the PWA.
- Restore/keep (Kimi File Changes).
- Annotations / Select & ask (ChatGPT desktop, Gemini) — those are edits.
- Share without preview (Meta glasses).
- pdf.js as default on iOS.
- Executing agent HTML.

---

## 3. Divergent / minority ideas (resist converging)

1. **Two chromes, not one “fullscreen modal.”** Image/PDF = cover; text/code/diff = grabbed sheet. Every consumer app that used one pattern for both either cramped PDFs (sheet) or exhausted Close-reach on long text (cover). HIG already splits these presentations.

2. **Session gallery chip (Cmux) instead of Claude’s per-turn-only cards.** Coding sessions produce files in tool results the operator never “taps.” A floating `N files` that opens a **read-only index** (Created vs referenced) is more Kimi-Code than Claude, and more useful on a remote agent.

3. **Do not render a “file” at all when `mediaClass === 'diff'` — promote the existing diff card to the overlay.** Claude artifacts are *products*; pi diffs are *decisions*. Showing a reconstructed file that the relay never sent is a hallucination.

4. **Safari-native PDF, even if it looks less branded.** pdf.js “Claude-like” chrome will fail pinch on iOS; native PDF looks like Files.app and just works.

5. **Parchment code, not `--surface-code` dark islands.** ChatGPT/DeepSeek/Kimi use dark code. Claude’s document metaphor is light. Dark code in an ink-on-parchment app is the generic AI tell. Minority: keep carbon-on-bone for code, accept “less IDE.”

6. **Never implement Claude interactive artifacts.** Third-party HTML preview apps exist because vendors half-ship this; on a tailnet PWA, a sandboxed **source-only** view is the distinctive, safer product.

7. **Pager as a horizontal filmstrip of thumbs** (QLPreview + ChatGPT Images tab) rather than `i of n` text. Better for screenshots from Codex-like sessions; worse for 40-file refactors (use Kimi’s list).

8. **Capability flag in the session hello** (`artifact.preview.v1`). If absent, cards stay inert — Cmux’s graceful downgrade. Prevents a pretty overlay that always says “unavailable.”

9. **Line-jump from a `file_diff` hunk into a `file_preview` of the same turn** without exposing paths: match by `toolCallId` / block `id` linkage the projector already has (`tool:${callId}:diff`). DeepSeek cannot do this; Cmux can.

10. **Codex-mobile as the UX north star for v1, Claude only for paint.** ChatGPT’s May 2026 Codex-on-iOS is the only **mass-market** grammar-B phone client: diffs, screenshots, terminal, host must stay awake. Copy *that* information architecture; paint it bone/clay.

11. **Medium detent as the default for code** so the operator can still see the last assistant sentence (Gemini/Claude desktop keep chat visible). Full-screen is for images. This is the opposite of “tap to full-screen everything.”

12. **No thumbnail generation on the phone.** OpenClaw/Cmux generate thumbs on the host/gateway. Phone-side downscale of a 8 MB PNG will jank the PWA. If the relay omits `thumbnail`, show a glyph.

---

## 4. Open questions + risks

| # | Question / risk | Why it matters |
|---|---|---|
| Q1 | Will the relay add a `file_preview` DTO in this feature, or must the web app fake it from `file_diff` + `tool_result`? | Without it, there is **no** image/PDF/code preview that stays redaction-honest. |
| Q2 | Is an allowlisted **basename** acceptable, or must titles stay `File` / `[REDACTED_PATH]`? | Claude/Kimi cards are unreadable without names; paths are a stated leak. |
| Q3 | Size cap: 8 MiB (PWA) vs Cmux 64 MB vs Perplexity mobile 25 MB? | iPhone Safari tab memory; base64 inflates ~33%. |
| Q4 | May `tool_result.output` ever contain image base64 today, already redacted? | If yes, a **detector on the client** is a bypass of the allowlist projector — don’t. |
| Q5 | Interactive HTML: never, or `sandbox` without scripts? | Claude/Gemini/ChatGPT mini-apps set the bar; tailnet XSS is the risk. |
| Q6 | iOS 26 visual viewport vs RAC `position: fixed` overlay | Viewer chrome can clip under the status bar / Home Indicator if we ignore #8888. |
| Q7 | EU standalone PWA tabbing (DMA) | Overlay `100dvh` assumptions break if the app runs **in Safari chrome** not standalone. ([MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide)) |
| R1 | **Any new RPC that `stat`s the host** recreates Cmux’s high-risk surface without their transcript-scope tests. | Fail closed: display only ledger bytes. |
| R2 | pdf.js as a “consistent” renderer | Documented iOS pinch failure. |
| R3 | Auto-open | Unusable during a 15-file refactor; Claude can auto-open because it emits ~1 artifact. |
| R4 | Share of redacted diffs leaking remaining secrets | Share the same string the card shows; no re-fetch. |
| R5 | `--ink-muted` on bone failing 4.5:1 | Subtitle-only failure still fails AA if it’s required info (file type). |
| R6 | Large PDFs in iframes on older iPhones | Provide Share-out as the accessible equivalent, not an infinite spinner. |

---

## 5. Sources

### Mobbin (public index; pixels not retrieved this pass)

- https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8 — Claude iOS chat detail  
- https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57 — Claude iOS text chat  
- https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1 — Claude iOS image input  
- https://mobbin.com/explore/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b — Claude iOS coding input  
- https://mobbin.com/explore/screens/ce7d8bb5-3e54-4936-848d-000c2a9ff599 — Claude web conversation  
- https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1 — ChatGPT iOS composer / camera  
- https://mobbin.com/explore/screens/d95a9997-a076-4b09-be7e-4a332053f220 — ChatGPT iOS full-screen image + save  
- https://mobbin.com/explore/flows/e5b8846f-e7bb-481a-82bd-47f29bfb6653 — Gemini iOS image → Maps  
- https://mobbin.com/explore/screens/2f2c7ae9-3cc8-4841-9a96-c1c9074f2a73 — Meta AI iOS  
- https://mobbin.com/explore/screens/9fa85a22-a24c-4224-a3db-6c40827c1db4 — DeepSeek iOS chat  

### Official product docs

- https://claude.com/blog/build-artifacts — Artifacts space; iOS/Android 21 Jul 2025; share; MCP 21 Oct 2025  
- https://claude.com/blog/artifacts — GA + mobile (indexed; `/blog/artifacts` 404’d on fetch this pass)  
- https://help.openai.com/en/articles/6825453-chatgpt-release-notes — Canvas retirement on GPT-5.5; writing-block fullscreen; code blocks; Codex-on-iOS 14 May 2026; Library caps; image preview  
- https://learn.chatgpt.com/docs/artifacts-viewer — desktop auto-preview, HTML preview/source, Codex CLI has no viewer  
- https://openai.com/index/introducing-canvas — original split-window canvas  
- https://gemini.google/overview/canvas/ — Canvas access; mobile view-only  
- https://support.google.com/gemini/answer/16047321 — Preview/Code/console/share/export; shared links not in mobile app  
- https://www.kimi.com/code/docs/en/ — Kimi Code product forms  
- https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html — File Changes, media caps, plan card  
- https://apps.apple.com/us/app/kimi-kimi-k3-is-live/id6474233312 — Kimi iOS slides/dashboards/Office/PDF  
- https://apps.apple.com/us/app/meta-ai/id1558240027 — Meta AI file types  
- https://www.meta.com/help/ai-glasses/683425686669295/ — share without preview  

### Apple / WCAG / WebKit / RAC

- https://developer.apple.com/design/human-interface-guidelines/sheets — detents, grabber, VoiceOver  
- https://developer.apple.com/design/human-interface-guidelines/accessibility — 44×44 / 28×28; Reduce Motion  
- https://developer.apple.com/design/tips/ — 44pt hit targets, 11pt min text  
- https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/DocumentInteraction_TopicsForIOS/Articles/UsingtheQuickLookFramework.html — QLPreview modal vs push; multi-item arrows  
- https://www.w3.org/TR/WCAG22/Overview.html — 2.4.11, 2.5.7, 2.5.8  
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum — 24×24  
- https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html — modal takes focus  
- https://react-spectrum.adobe.com/react-aria/Modal.html — dismiss, focus trap, scroll lock, viewport CSS vars  
- https://github.com/adobe/react-spectrum/pull/8888 — iOS 26 overlay positioning  
- https://developer.apple.com/forums/thread/133248 — Fullscreen API on iPhone  
- https://github.com/mozilla/pdf.js/issues/20584 — iOS pinch vs visualViewport  
- https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide — no FSAA; no reliable fullscreen; status bar remains  

### GitHub prior art

- https://github.com/manaflow-ai/cmux/pull/7674 — iOS artifact plane, 64 MB cap, 3 MiB chunks, forbidden-before-stat, gallery chip  
- https://github.com/openclaw/openclaw/blob/main/docs/platforms/ios.md — read-only Files, short-lived URLs, no transcript image bytes, Tailscale Serve  
- https://github.com/openclaw/openclaw/pull/100767 — iOS Files browser  
- https://github.com/MoonshotAI/kimi-code — Kimi Code CLI  
- https://github.com/epam/ai-dial-chat/issues/7213 — attachment canvas renderers  
- https://github.com/multica-ai/multica/blob/main/packages/views/editor/attachment-preview-modal.tsx — ZoomCanvas  
- https://github.com/EricZZZZhang/ai-artifact-reader — iOS HTML/MD artifact reader (market gap)  

### Secondary / corroborating

- https://techbink.com/how-to-use-claude-artifacts/ — mobile = full-screen overlay  
- https://www.getmasset.com/resources/claude-artifacts-for-marketers — mobile iframe caveats  
- https://perplexityaimagazine.com/perplexity-hub/how-to-use-perplexity-ai-on-iphone/ — iOS upload + Spaces  
- https://wisechecker.com/perplexity-file-upload-failed-mobile-fix/ — unofficial 25 MB mobile cap  
- https://nerdschalk.com/chatgpt-can-now-open-google-docs-sheets-and-slides-side-by-side-in-chat/ — Drive pane web-only as of 13 Aug 2026  
- https://markdown.cybergame.ai/articles/ — iOS MD preview gap across vendors  

### This repo (current state)

- `docs/design-reference/mobile-chat-apps/01-visual-teardown.md` — Claude card ~16px radius, artifact pill, action row  
- `packages/pi-rpc-protocol/src/types.ts` — `FileDiffBlock` `{ summary, patch }`  
- `apps/pi-remote-relay/src/store/transcript-projector.ts` — diff emission for edit/write/apply_patch  
- `apps/pi-remote-relay/src/store/redaction.ts` — path/secret redaction before persist  
- `apps/pi-remote-web/src/App.tsx` — inline `DiffPatch`; share on text only  
- `apps/pi-remote-web/src/style.css` — bone/carbon/clay tokens, 16px `--radius-lg`, 220ms motion  
- `apps/pi-remote-web/src/SessionHeader.tsx` — existing RAC `Dialog` pattern
