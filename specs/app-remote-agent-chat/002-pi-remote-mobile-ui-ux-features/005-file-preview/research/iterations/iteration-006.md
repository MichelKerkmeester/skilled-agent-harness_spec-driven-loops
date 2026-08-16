<!-- provenance: external-CLI orchestration pass; original file iter-06-grok.md -->
> **Source pass 6** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-6-grok.md`.

<!-- F6-file-preview | model=grok | lens=prior-art-github | iter 6/10 | 2026-08-15T19:50:56.642Z -->

# Prior-art GitHub pass — Claude-style file/artifact viewer for Pi Remote

**Lens:** `prior-art-github` · iteration 6 of 10 · iPhone PWA (React 19 + Vite + Tailwind 4 + react-aria-components) · ink-on-parchment · redaction-aware, fail-closed.

**Grounding constraint this pass does not relax:** Pi Remote already has styled `file_diff` cards and plan checklists; it has **no** artifact/file preview surface. The protocol today exposes `file_diff.summary` + `file_diff.patch` (already redacted), `tool_result.output`, and an `unknown` fallback for kinds the client cannot display ([`packages/pi-rpc-protocol/src/types.ts`](packages/pi-rpc-protocol/src/types.ts), [`apps/pi-remote-web/src/App.tsx`](apps/pi-remote-web/src/App.tsx)). Almost every GitHub “file viewer” below **fetches the live host filesystem**. That is a different product. The transferable UX is the **chrome, states, and renderer routing** — not the data plane.

---

## 1. Findings (prior-art GitHub, iPhone + this stack)

### 1.1 Two product families are being conflated. Only one matches Pi Remote.

Open-source coding-agent UIs on GitHub split into:

| Family | What they open | Data plane | Closest to Pi Remote? |
|---|---|---|---|
| **Host file browser** | Repo tree, live file, live git diff | Extra HTTP/SFTP/SSH reads of the machine | No — violates “only show what the relay already sends” |
| **Chat artifact viewer** | Self-contained payload already in the turn (HTML/SVG/MD/code/PDF/image) | Bytes already in the message / tool result | **Yes** |
| **Diff card only** | Unified patch in the transcript | Patch text already streamed | **Current Pi Remote** |

Pi Remote is family 2 + the existing family-3 diff card. Building family 1 (Conduit / Garcon / P4OC / Wave / Moshi file trees) would require a **new ticketed, revision-checked read** and is out of the stated security posture.

### 1.2 Remote-CLI / coding-agent **mobile clients** (GitHub)

These are the closest prior art for “drive an agent from a phone and see files.”

**A. PWA / browser clients over a local or tailnet server (same form factor as Pi Remote)**

- **[dibstern/conduit](https://github.com/dibstern/conduit)** — Browser UI for `opencode serve`. Documented file surface: “File browser with breadcrumbs, **preview modal**, and live reload.” Mobile: PWA-installable, large approve/deny targets, camera attach, QR connect. Auth: PIN once (vs OpenCode web’s HTTP Basic on every visit). Remote access: **Tailscale explicitly recommended**. Diffs: LCS-based, not a full-file viewer. Tradeoff: it is a **stateless translation layer** over OpenCode’s HTTP/SSE; it **does** fetch project files. Live reload is correct for a live workspace and **wrong** for a redacted snapshot. [README](https://raw.githubusercontent.com/dibstern/conduit/main/README.md)

- **[chadbyte/clay](https://github.com/chadbyte/clay)** — The Conduit README states Conduit was built on Clay’s approach. Clay: installable iOS/Android PWA, push for approvals, QR connect, Tailscale for remote. It **drives Claude Code / Codex**, not a redacted relay. HTTPS trick: `d.clay.studio` DNS-only for cert validation; traffic stays on-machine. Pi Remote already has Tailscale Serve HTTPS, so Clay’s DNS helper is unnecessary. [README](https://raw.githubusercontent.com/chadbyte/clay/main/README.md)

- **[cfal/garcon](https://github.com/cfal/garcon)** — Self-hosted browser workspace for Claude Code, Codex, Cursor Agent, OpenCode, Amp, Droid, **and Pi**. Explicit: “Browse and edit project files… review large diffs… stage individual lines.” **Safari / iOS Safari 17.4+** is a stated requirement. Phone: “installable workspace.” Security: API keys stay on the Garcon host and are **redacted from client responses**; `GARCON_PROJECT_BASE_DIR` is a filesystem access boundary. Tradeoff: full host FS + Git + terminal — a control plane, not a transcript renderer. Status CLI “redacts image bodies and truncates each message at 4,000 characters” — a concrete truncation number to copy. [README](https://raw.githubusercontent.com/cfal/garcon/main/README.md)

- **[chriswritescode-dev/opencode-manager](https://github.com/chriswritescode-dev/opencode-manager)** — Mobile-first PWA (React + Vite + Tailwind, iOS-optimized). Files: tree, **syntax highlighting**, create/rename/delete, ZIP download. That mutation surface is incompatible with Pi Remote’s read-only-by-default posture. Keep: mobile-first nav + syntax-highlighted **view**.

- **[getpaseo/paseo](https://github.com/getpaseo/paseo)** — Daemon + **Expo client (iOS, Android, web)** + Electron + CLI. Pair phone via Settings. Optional E2E relay; Tailscale/TCP as the no-relay path. This is the closest **cross-device Pi** orchestrator (Pi is a first-class provider). Public README is session/orchestration, not a documented artifact renderer. Treat Paseo as evidence that **native iOS + web can share one client package**, not as a viewer spec. [README](https://raw.githubusercontent.com/getpaseo/paseo/main/README.md)

**B. Native iOS / Android OpenCode clients (the “Kimi/Claude iOS bar” in open source)**

- **[jungwuk-ryu/better-opencode-client](https://github.com/jungwuk-ryu/better-opencode-client)** (BOC) — Flutter, **iOS + Android**. Documented panes: chat, **files, review diffs**, context, shell, pending questions, permissions. Adaptive: phone = compact; tablet = split panes. This is the open-source split: **iPhone = full-screen file/review overlay; iPad = side pane.** Pi Remote is iPhone-first → overlay, not a persistent right rail.

- **[ntoporcov/openclient](https://github.com/ntoporcov/openclient)** — Native SwiftUI iPhone/iPad companion for a self-hosted OpenCode server. Chat, todos, permission prompts, Live Activity. **No documented file/artifact viewer.** Evidence that a polished iOS agent client can ship **without** a viewer (Unpeel makes this a philosophy; see §3).

- **[Sammy42779/opencode_ios_client_dz](https://github.com/Sammy42779/opencode_ios_client_dz)** — Native iOS/iPadOS/visionOS. Documented Files surface: **file tree, session diffs, markdown preview, image preview with zoom/pan, code view with line numbers.** iPhone: tab-based. iPad/visionOS: three-column `NavigationSplitView` (sidebar, **file preview**, chat). This is the most explicit open iOS file-preview matrix found this pass.

- **[theblazehen/P4OC](https://github.com/theblazehen/P4OC)** (Pocket for OpenCode) — Android. Screens: `files`, `diff`. “Browse project files with symbol search and syntax highlighting. View file diffs from AI edits.” Play Store also lists a **file viewer and editor**. Editor is out of scope for Pi Remote; the **dedicated Files + Diff screens** (not an in-bubble `<pre>`) is the pattern.

- **[crim50n/oc-remote](https://github.com/crim50n/oc-remote)** — Android. Concrete, copyable behaviors: **fullscreen image preview + save**; HTML errors switch **rendered page vs raw code**; **code word-wrap vs horizontal scroll toggle**; chat font size S/M/L; image side cap 720–2560 px / keep-original. These are the only open-source mobile client knobs found that map 1:1 onto a PWA viewer.

- **[mulkymalikuldhrs/opencode-android](https://github.com/mulkymalikuldhrs/opencode-android)** — Android: chat + terminal + **FilesScreen tree** + **EditorScreen**. Split-screen on tablets (chat+editor). Confirms: phone = sequential screens; large = split.

**C. Closed iOS agent terminals (not GitHub source, but they are the category Pi Remote competes with)**

- **Moshi** ([getmoshi.app](https://getmoshi.app/), [diff viewer docs](https://getmoshi.app/docs/diff-viewer)) — Native iPhone SSH/Mosh. **Diff viewer + file browser + in-app browser preview** are **not** in the chat bubble: they are host-gateway surfaces (`127.0.0.1:24543`) tunneled over the existing SSH session. Diffs stay on the host; binary files are **listed but not rendered**. Pro-gated. Architecture lesson: **preview traffic must not go through a third-party relay** — Pi Remote’s Tailscale path already matches this. Product lesson: **diff ≠ file preview**; Moshi ships both as separate buttons in the terminal header.

- **Unpeel** ([unpeel.com](https://unpeel.com/)) — Native Mac + iPhone remote. Explicit: **“No diff viewers. No code panes. On purpose.”** Screenshots of agent browser work land in a **session artifacts folder**. Minority position: conversation-only on the phone; files stay on the desk. Listed in [bradAGI/awesome-cli-coding-agents](https://github.com/bradAGI/awesome-cli-coding-agents).

### 1.3 Desktop/web agent UIs whose **renderer routing** is reusable

**Wave Terminal** — [wavetermdev/waveterm](https://github.com/wavetermdev/waveterm), [widgets docs](https://github.com/wavetermdev/waveterm/blob/c99022c1/docs/docs/widgets.mdx), [DeepWiki preview map](https://deepwiki.com/wavetermdev/waveterm/4.2-file-preview-and-editor-views)

- One **Preview** widget; file type routes to specialized views: directory / markdown / codeedit / CSV / image / video / PDF / streaming (files being written) / “too large”.
- Open: `wsh view [path]`, or double-click a directory row, or Enter.
- **Magnify** any block to fullscreen: double-click header or `Cmd+M`; un-magnify the same way. This is the desktop analog of Claude’s tap-to-open.
- Code **view** vs **edit**: edit is Monaco; view is not required to be Monaco. PR [#2459](https://github.com/wavetermdev/waveterm/pull/2459) shows language detection is **filename-driven**, not content-sniffed — if two models share an empty filename they cross-talk. For Pi Remote: **always pass a display name** into the highlighter, never `""`.
- macOS Quick Look from directory preview via `qlmanage` — **unavailable in a PWA**. Do not spec QLPreviewController.

**[Edison-A-N/opencode-preview](https://github.com/Edison-A-N/opencode-preview)** — The most complete open **type → renderer table** found:

| Format | Renderer |
|---|---|
| Markdown | GFM (`marked`), TOC, word count |
| DrawIO | Embedded viewer |
| HTML | **Sandboxed iframe** + “Open in new tab” |
| CSV | Table |
| PNG | Centered, max-dimension, download original |
| Code | highlight.js, 40+ langs |

Also: tab cap (`PREVIEW_MAX_TABS` default **10**), path traversal blocked (project-root only), live reload, worktree switcher. For Pi Remote: copy the **router + sandbox + tab cap**; drop live reload, worktrees, and any path that reads disk.

**Official OpenCode web** — [opencode.ai/docs/web](https://opencode.ai/docs/web), [architecture issue #11616](https://github.com/anomalyco/opencode/issues/11616)

- `opencode web`: local Hono API + **remote UI assets** from `https://app.opencode.ai`. File tree, editor, **review/diff panel**, session share.
- Third-party comparison ([github/copilot-cli#3301](https://github.com/github/copilot-cli/issues/3301)): web wins on side-by-side diffs, clickable tree, a11y, mobile-over-Tailscale; TUI stays for keyboard.
- Auth: HTTP Basic — Conduit’s critique (re-enter password every visit on iOS) is why Pi Remote must **not** put viewer auth in the overlay; reuse the existing enrolled session.
- “Mobile Support” heading exists in third-party mirrors but the official page fetched this pass has **no mobile-specific viewer spec**. Do not treat OpenCode web as an iPhone artifact UX.

**Chat-artifact UIs (Claude clones, not remote-CLI — still the target bar)**

- **[huggingface/chat-ui](https://github.com/huggingface/chat-ui)** commit [89e9b33](https://github.com/huggingface/chat-ui/commit/89e9b33f5cf772dff52d84b67be57c4ba359c855): Claude-style artifacts. **Cards in chat + dedicated panel.** Actions: Preview/Code tabs, copy, download, **fullscreen**, version stepper. **Desktop: drag-resize side panel. Mobile: fullscreen overlay.** Streaming: **auto-open, pin code view to bottom, disable live preview until complete.** Runtime-error capture + “ask to fix.” Types: html/svg sandboxed iframe; react via Babel+CDN; mermaid CDN; markdown native; other code = highlight only. Follow-up [0b9507c](https://github.com/huggingface/chat-ui/commit/0b9507cefa682a3306e8fe8b66f380a175c99eb7): iframe **without `allow-same-origin`**, so `localStorage` throws — models must keep state in memory. Dark-mode fix: iframe backing must follow theme or you get a **white flash**.

- **[assistant-ui/assistant-ui](https://github.com/assistant-ui/assistant-ui)** artifacts example + **[safe-content-frame](https://github.com/assistant-ui/assistant-ui/tree/main/packages/safe-content-frame)**: HTML/PDF/Blob in a sandboxed iframe on a **separate eTLD+1** (`scf.auiusercontent.com`), origin hashed per content. Methods: `renderHtml`, `renderRaw(mime)`, `renderPdf`. This is the correct isolation model for **executable** HTML. Pi Remote on a private tailnet **cannot** depend on `auiusercontent.com`. Equivalent: `sandbox` iframe + `srcdoc` or blob URL **without** `allow-same-origin` unless a same-tailnet preview origin is added later.

- **LobeHub artifacts** ([docs](https://www.mintlify.com/lobehub/lobehub/features/artifacts), [lobehub/lobe-chat](https://github.com/lobehub/lobe-chat)): dedicated right pane; Preview vs Code; copy/download SVG/PNG/HTML. Desktop-first. On iPhone this pane **must collapse to the HF fullscreen overlay**, not a squeezed split.

- **[e2b-dev/fragments](https://github.com/e2b-dev/fragments)** — Open-source Claude Artifacts / v0. Not a file viewer: it **executes** generated apps in an E2B sandbox (Python, Next, Vue, Streamlit, Gradio). Do not copy execution. Copy the **card → live pane** information architecture only if the relay ever emits runnable HTML. Running untrusted HTML on the phone against the tailnet origin is a security defect.

**Goose desktop** — [aaif-goose/goose](https://github.com/aaif-goose/goose)

- [`ImagePreview.tsx`](https://github.com/block/goose/blob/e94f3047/ui/desktop/src/components/ImagePreview.tsx): tap toggles `max-h-40 max-w-40` ↔ `max-h-96`. Error → italic “Unable to load.” This is **below** the Claude iOS bar (Claude goes full-screen). Keep the error string pattern; do not keep the 40/96 cap as the open state.
- MCP-UI sidecar ([issue #3562](https://github.com/block/goose/issues/3562)): tool results with `_meta.ui.resourceUri` render embedded UI. Experimental. Pi Remote should **not** execute MCP-UI from redacted tool output unless the relay explicitly types it.

### 1.4 iOS system prior art the PWA cannot call, and the web substitutes

- **QLPreviewController** ([Apple](https://developer.apple.com/documentation/quicklook/qlpreviewcontroller)): modal preview, title from last path component, share sheet, pinch-zoom, **multi-item arrows / swipe** when the data source has N items. Embed = thumbnail only, not live preview. **Not available to a PWA.**
- **SwiftUI `fullScreenCover`** ([Apple](https://developer.apple.com/documentation/swiftui/view/fullscreencover(ispresented:ondismiss:content:))): covers the screen, **no swipe-to-dismiss**, **must** provide an explicit close. Sheets swipe down; covers do not. Claude-style artifact open is a **cover**, not a detent sheet.
- **HIG-aligned interaction notes** ([ios-hig interaction.md](https://github.com/johnrogers/claude-swift-engineering/blob/main/plugins/swift-engineering/skills/ios-hig/references/interaction.md)): modals for short self-contained tasks; always a clear dismiss; do not override back; `.cancellationAction` / `.confirmationAction` placement.
- **Blink Shell Files.app** ([docs](https://docs.blink.sh/advanced/files-app)): File Provider → Quick Look of **remote** files. PWA cannot register a File Provider. Closest substitute: **Share sheet / “Open in Files”** of a blob the relay already sent.
- **Web Share API** ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)): HTTPS + **transient user activation**; `navigator.canShare({ files })` before `share({ files })`. Shareable types include `application/pdf`, images, `text/plain`, `text/html`, `text/csv`. User cancel → `AbortError`. iOS PWA `download` attributes are unreliable; **Share is the primary export**.

### 1.5 Stack-specific constraints (React Aria + iPhone PWA)

Pi Remote already uses react-aria-components `Dialog` / `DialogTrigger` in composer and session sheets ([`SessionComposer.tsx`](apps/pi-remote-web/src/SessionComposer.tsx), [`SessionHeader.tsx`](apps/pi-remote-web/src/SessionHeader.tsx)).

React Aria **Modal** ([docs](https://react-spectrum.adobe.com/react-aria/Modal.html)):

- `isDismissable` **defaults to false** (matches `fullScreenCover`, not a sheet).
- Escape close unless `isKeyboardDismissDisabled`.
- Overlay CSS uses **`--visual-viewport-height`** (iOS keyboard). A full-screen viewer **must** bind height to `visualViewport`, not `100vh`.
- Official **Sheet** example: same `Modal` with custom enter/exit — use this for a **medium detent** only if the payload is a tiny text snippet; Claude-bar artifacts are full-screen.
- `Heading slot="title"` is required for the accessible name.
- `Button slot="close"` is the RAC close contract.
- Overlay `z-index: 100` in the vanilla starter — the viewer must sit **above** the composer island and status pills.

**Do not ship Monaco on iPhone.** Wave uses Monaco for **edit**. Replit migrated to CodeMirror 6 for mobile (reported +70% weekly mobile retention after the July mobile release; [HN / dart-pad #2743](https://github.com/dart-lang/dart-pad/issues/2743)). PkgPulse 2026: Monaco ~2–5 MB gzip + workers; CodeMirror 6 ~50–200 kB, touch-friendly; Monaco mobile support is the known gap ([guide](https://www.pkgpulse.com/guides/monaco-editor-vs-codemirror-6-vs-sandpack-in-browser-2026)). For **view-only**, opencode-preview’s highlight.js (or Shiki lazy-loaded) is enough. Clopen’s “Monaco in the browser” is a desktop workspace, not an iPhone PWA.

**PDF:** prefer **native Safari PDF** via `<iframe>` / `<object>` + `blob:` URL with `application/pdf`. PDF.js canvas on iOS is a memory trap. assistant-ui’s `renderPdf` is the isolation pattern if blob iframe fails; measure before adding the library.

**HTML artifacts:** HuggingFace’s rule — sandbox **without** `allow-same-origin`. Never point an iframe at the Tailscale origin. `srcdoc` or blob. No preview while streaming.

### 1.6 What Pi Remote already has (so the viewer does not duplicate it)

From [`App.tsx`](apps/pi-remote-web/src/App.tsx) `DiffPatch`: unified patch in a `<pre aria-label="Redacted file diff">` with `+` / `-` / context line classes. From the relay projector: file-mutation tools emit a **separate** `file_diff` block with summary `"${toolName} changed a file"` and a patch extracted from the tool result ([`transcript-projector.ts`](apps/pi-remote-relay/src/store/transcript-projector.ts)). From protocol: `unknown` already explains that a redacted original kind cannot be displayed.

Claude iOS (local teardown, [`docs/design-reference/mobile-chat-apps/01-visual-teardown.md`](docs/design-reference/mobile-chat-apps/01-visual-teardown.md)): artifact **card in the turn** — ~16px radius, hairline, near-canvas fill, title + muted subtitle (`Piano MIDI Player` / `Interactive artifact`), tilted thumbnail, optional `1 artifact` pill above the turn. That card is the **trigger**. The missing piece is the **cover**.

Mobbin (MCP not available this session; URLs from crawl):

- Claude iOS coding-input flow: [mobbin.com/explore/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b](https://mobbin.com/explore/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b)
- Claude **Web** code preview (segmented Preview/Code + toolbar): [mobbin.com/explore/screens/1a33eaae-c123-4c39-82bc-e42df38209d3](https://mobbin.com/explore/screens/1a33eaae-c123-4c39-82bc-e42df38209d3)
- Claude Web publish-artifact confirm: [mobbin.com/explore/screens/36894d50-1a68-4142-8907-ad5623a47fc7](https://mobbin.com/explore/screens/36894d50-1a68-4142-8907-ad5623a47fc7)
- GitHub iOS repo detail (README / files as a **different** app): [mobbin.com/explore/flows/def7a90e-2606-4c80-92a0-d34c8ce78fff](https://mobbin.com/explore/flows/def7a90e-2606-4c80-92a0-d34c8ce78fff)

Do not copy GitHub Mobile’s repo browser. Copy GitHub’s **file chrome** if/when a full-file payload exists: wrap toggle, language, raw vs rendered (oc-remote already has wrap + font size).

### 1.7 Negative knowledge (tried in this ecosystem, do not copy)

- **Live filesystem fetch** (Conduit, Garcon, P4OC, Wave, Moshi, opencode-preview `/api/file`). Conflicts with redaction-everywhere.
- **Live reload / file watch** (Conduit, opencode-preview). The transcript is a snapshot; watching disk would leak post-redaction bytes.
- **In-viewer edit / save / stage hunks** (Garcon, P4OC editor, Wave Codeedit, OpenCode Manager). Mutations are ticketed + revision-checked elsewhere; the viewer is read-only.
- **Monaco / LSP** on device (Wave edit, Clopen). Bundle + workers + iOS keyboard.
- **Side panel on iPhone** (Lobe, HF desktop, OpenHands canvas). HF already special-cased mobile as fullscreen overlay.
- **Execute HTML against the app origin** (e2b fragments, unsandboxed `srcdoc`).
- **Goose 40×96 inline expand** as the only open state.
- **Unpeel’s zero-viewer** as the default if the target bar is Claude + Kimi (those apps *do* open artifacts). Keep it as an **operator toggle**, not the v1 default.
- **HTTP Basic on every iOS visit** (OpenCode web). Viewer must ride existing enrollment.
- **Third-party preview CDN** (assistant-ui `scf.auiusercontent.com`, draw.io CDN in opencode-preview) on a private tailnet PWA — fail closed if offline.

---

## 2. Concrete spec a build phase can execute

### 2.0 Protocol (fail closed; no extra bytes)

Do **not** add a host file-read RPC in this feature. Introduce a **display** block the projector may emit only from bytes already on the event:

```ts
interface FilePreviewBlock extends TranscriptBlockBase {
  readonly kind: 'file_preview';
  readonly filename: string;          // display only; never used to fetch
  readonly mediaClass:
    | 'image' | 'pdf' | 'text' | 'code' | 'markdown'
    | 'html' | 'svg' | 'csv' | 'diff' | 'binary' | 'redacted';
  readonly mime: string;              // as the relay labeled it; client does not sniff
  readonly text?: string;             // present iff mediaClass is textual
  readonly dataUrl?: string;          // present iff image/pdf and relay inlined it
  readonly truncated: boolean;
  readonly byteLength: number | null; // null if relay withheld
  readonly language?: string;         // filename-derived on the relay, never ""
}
```

Mapping from **today’s** blocks (ship viewer before the new kind if needed):

| Existing block | Open as |
|---|---|
| `file_diff` | `mediaClass: 'diff'`, `text = patch`, filename from summary if parseable else `"diff"` |
| `tool_result` with image/pdf/text already in `output` | only if the relay already typed it; else stay collapsed `<pre>` |
| `unknown` | card that **does not open** a renderer; copy the existing quiet sentence |

If `text` and `dataUrl` are both missing → state `unavailable`, not an empty viewer.

**Hard rules**

- No `fetch('/file?path=')`. No blob constructed from a host path.
- Do not decode/render past `truncated: true` without a visible “truncated by relay” banner.
- `mediaClass: 'redacted' | 'binary'` → listed, not rendered (Moshi).
- HTML/SVG preview: sandbox iframe, **no** `allow-same-origin`, **no** `allow-top-navigation`. Scripts: off unless a later explicit “interactive artifact” flag exists; v1 HTML = **syntax view only** (opencode-preview’s HTML iframe is opt-in and dangerous on a tailnet).
- Size: if `byteLength > 1_048_576` or line count > 4000 (Garcon’s 4k-char status truncate is a cousin), do not mount a highlighter; show first 400 lines + banner (Wave “too large”).

### 2.1 Objects in the chat (Claude card, not a second transcript)

**ArtifactCard** (one per `file_preview` or promoted `file_diff`):

- Placement: inside the owning assistant turn, **after** the prose that introduced it, **before** the action row (existing design-council rule in-repo).
- Layout (from local Claude teardown): 16px radius, 1px hairline (`carbon` at ~12% / dark inverse), fill `bone` / dark canvas, 16–20px padding. Left: title (Inter medium, 15–16px, 1 line, middle truncate) + subtitle (Inter 13px, muted: `Redacted diff` · `Markdown` · `PNG · 128 KB`). Right: 40×40 type glyph or tilted thumb if `dataUrl` image.
- If a turn has N>1 openable items: centered pill `N artifacts` above the turn (Claude).
- Hit target: entire card ≥ 44×44 pt. Role: `button`. Name: `Open {filename}, {subtitle}`.
- Keyboard: Enter/Space. Focus ring: 2px clay, offset 2px, 3:1 vs adjacent (WCAG 2.2 2.4.13).
- Do **not** put Share/Close on the card. Card = open only.

**file_diff** stays a styled diff card in-flow (current). Add a trailing text button `View full screen` (Inter 13px, clay) that opens the same cover with `mediaClass: 'diff'`.

### 2.2 Viewer chrome (iOS `fullScreenCover` analog)

**Component:** `ModalOverlay` + `Modal` + `Dialog` from react-aria-components.

| Prop | Value |
|---|---|
| `isDismissable` | `false` (no tap-outside; matches `fullScreenCover`) |
| `isKeyboardDismissDisabled` | `false` (Escape closes; VoiceOver / hardware keyboard) |
| Height | `100dvh` and `var(--visual-viewport-height)`; `padding-top/bottom: env(safe-area-inset-*)` |
| z-index | ≥ 200 (above composer ~100) |
| `Heading slot="title"` | filename |
| Close | `Button slot="close"` in the **leading** toolbar slot (HIG cancellation) |

**History:** on open, `history.pushState({ piViewer: blockId }, "", "#preview")`. `popstate` closes. iOS edge-swipe / Android back closes the cover **without** leaving the session route. On close, `history.back()` only if we pushed. This is the PWA substitute for the system back affordance HIG requires.

**Toolbar** (44pt tall + safe area), Inter, carbon on bone:

- Leading: Close (`×` 24px, `aria-label="Close preview"`).
- Center: filename (1 line, middle truncate) + muted mediaClass.
- Trailing: Share (if `navigator.canShare` or clipboard fallback), then overflow `⋯` with Copy, Wrap, Text size.

Share (user-gesture only):

1. If `canShare({ files: [file] })` where `file` is a `File` from the **already-held** text/bytes → `navigator.share({ files, title: filename })`.
2. Else `share({ text })` for textual classes.
3. Else `clipboard.writeText`.
4. `AbortError` → no toast. Other errors → `role="status"` “Couldn’t share.”

No network. No “Open host path.”

### 2.3 States

| State | UI | a11y |
|---|---|---|
| `closed` | card only | — |
| `opening` | cover mounts, toolbar visible, body `role="status"` “Loading preview” | focus → Close after 300ms or immediately if `prefers-reduced-motion` |
| `ready` | renderer | live region off |
| `streaming` (if block still revising) | code/text only; **preview tab disabled**; pin scroll to end (HF chat-ui) | “Updating, preview paused” |
| `truncated` | ready + sticky banner “Relay sent a truncated copy.” | banner in `role="status"` |
| `too_large` | banner + first 400 lines or downsampled image max edge 2560 (oc-remote) | — |
| `unsupported` / `binary` / `redacted` | glyph + one sentence; no iframe | dialog still titled |
| `error` | “Unable to load” (Goose) + Close/Share disabled for files | — |
| `closing` | 150–200ms exit | restore focus to the card |

Revision: if `block.revision` increments while open, replace body in place; do not close. If `kind` becomes `unknown`, switch to `redacted`.

### 2.4 Renderers (filename/language from relay; no content-sniff)

| `mediaClass` | Mount | Gestures | Notes |
|---|---|---|---|
| `image` | `<img alt="">` `object-fit: contain`; pinch via `touch-action: pinch-zoom` on the **image scroller only** (viewport stays `user-scalable=no` if the PWA already sets it) | pinch, pan, double-tap 1×/2× | no edit; EXIF not interpreted |
| `pdf` | `<iframe title>` blob `application/pdf` | native Safari PDF chrome | if iframe empty on iOS: fallback Share + “Open in Safari” via blob URL in `window.open` (may be blocked in standalone — then Share only) |
| `text` | `<pre>` Inter 13–15px, wrap default ON | vertical scroll; no pinch-zoom steal | |
| `code` | `<pre><code>` + lazy highlighter (highlight.js/Shiki). **Not Monaco.** Line numbers optional, off by default on 320px | wrap default ON (oc-remote toggle) | `language` from relay; unknown → plain |
| `markdown` | GFM in Source Serif 4 body; code fences Inter/mono | | TOC omitted on phone |
| `diff` | reuse `DiffPatch` classes, full-screen, wrap OFF default (diffs need alignment) | | `aria-label="Redacted file diff"` kept |
| `csv` | table, first 200 rows (opencode-preview) | horizontal swipe inside table only | |
| `html` / `svg` v1 | **Code tab only** | | Preview tab hidden until a security review adds sandbox iframe |
| `binary` / `redacted` | no renderer | | |

Tabs: only when `html`/`svg` preview is enabled later. v1: no Preview/Code split (Mobbin Claude Web has it; iPhone v1 does not need it for diffs/code/images).

Font size: S/M/L stored in `localStorage` key `pi-remote.preview.font` (oc-remote). Default M = 15px code / 18px markdown (serif matches Claude prose ~19–20px, slightly smaller in overlay).

### 2.5 Gestures (explicit allow/deny)

| Gesture | Result |
|---|---|
| Tap card | Open |
| Close / Escape / `popstate` | Close |
| Swipe down from toolbar | **Ignored** (`isDismissable: false`) |
| Swipe from left screen edge | Close (via history) |
| Vertical pan on body | Scroll content |
| Pinch on image | Zoom image |
| Pinch on code/text | **Ignored** (keeps PWA scale) |
| Horizontal swipe on body | If turn has N>1 previews: next/prev (QLPreviewController). Else ignore |
| Long-press image | system callout OK; do not invent a custom menu |
| Two-finger tap | no-op |

Multi-item: `aria-keyshortcuts` Left/Right; VoiceOver “Item i of N.”

### 2.6 Motion (ink-on-parchment, RAC timings)

- Overlay fade 200ms out-cubic; cover translateY(12px)→0 + fade 200ms (not the RAC 300ms zoom-bounce — too playful vs parchment).
- `prefers-reduced-motion: reduce`: 0ms, instant mount.
- Dark: overlay `rgba(0,0,0,0.5)`; iframe/image backing = canvas color to avoid HF’s white flash.
- Clay `#d97757` only on focus ring, wrap-toggle selected, and truncated-banner border. Never on the overlay scrim.

### 2.7 a11y (WCAG AA, iPhone VoiceOver)

- Dialog name = filename; description = mediaClass + truncated flag.
- Focus trap inside overlay (RAC default).
- Close and Share ≥ 44×44 pt, 8px apart.
- Contrast: carbon on bone ≥ 4.5:1; muted subtitle ≥ 4.5:1 against bone (do not use 3:1 gray).
- Diff: do not use color alone; keep `+`/`-` prefixes (already in `DiffPatch`).
- Images: empty `alt` if decorative thumb on card; on cover, alt = filename.
- `aria-busy="true"` while streaming.
- Dynamic Type: toolbar uses `1rem` min; code uses a bounded scale (S/M/L) so 400-line files do not explode.
- Reduced transparency: no backdrop-blur on overlay (RAC tailwind starter uses blur; **disable** it for this cover).

### 2.8 Implementation sketch (files a build can add)

- `ArtifactCard.tsx` — pressable card.
- `FilePreviewModal.tsx` — RAC `ModalOverlay`/`Dialog` + history hook.
- `renderers/{Image,Pdf,Code,Markdown,Diff,Csv,Fallback}.tsx` — no shared Monaco.
- Wire in `renderBlock` next to `file_diff`; promote `file_preview` when the projector emits it.
- Tests: open/close focus restore; `popstate`; truncated banner; Share `AbortError`; unknown/redacted does not mount iframe; wrap toggle; reduced motion.

---

## 3. Divergent / minority ideas (do not converge yet)

1. **Unpeel mode:** no viewer. Cards are metadata only; Share dumps text. Fastest, safest, misses the Claude/Kimi bar.
2. **Hand off to Safari/Files:** build a blob and `navigator.share` / “Open in Files” as the *only* preview. You get real Quick Look (PDF, pinch, markup) the PWA cannot match. Loses in-app parchment chrome and redaction banners.
3. **Wave magnify, not Claude cover:** preview is a second “block” that can sit above the chat (PiP). Lets the operator keep steering. Hard on 320px; conflicts with the composer island.
4. **Moshi split:** keep `file_diff` in chat; put “Files” as a **session-header button** that lists every `file_preview` in the session (not a host tree). Closer to a coding-agent phone than Claude’s in-turn artifacts.
5. **Agent-invoked preview tool** (opencode-preview’s `preview` tool): the model opens the overlay. Conflicts with “user tap” and with plan-mode; would need a ticket.
6. **MCP-UI sidecar** (Goose #3562): render tool `_meta.ui`. Powerful, wrong trust model for a redacted relay.
7. **HF streaming overlay:** auto-open while the patch streams, preview disabled. Noisy on a phone; good for HTML artifacts, bad for diffs.
8. **QLPreview-style stack only:** no chrome except Close/Share; swipe between all files in the turn. More iOS-native, less Claude.
9. **CodeMirror 6 read-only** instead of `<pre>`: better find-in-file, worse first paint. Replit’s data says CM6 wins if you need selection + search; for view-only, highlight.js is enough.
10. **Independent code theme** (P4OC’s 9 TUI themes) vs parchment. A carbon-on-bone diff is on-brand; a Dracula island is not. Keep parchment; optional “high-contrast code” token later.
11. **Execute HTML in E2B/fragments style.** Out of security scope.
12. **Telegram document bubble** (icon + size + tap) instead of Claude’s titled artifact card. More “file,” less “artifact.” Better for PDFs; worse vs the stated Claude target.
13. **iPad-only split** (BOC / Sammy42779 / OpenCode Android tablets). Spec iPhone cover first; `min-width: 768px` may later dock the Dialog as a 40% pane. Do not ship split on iPhone.
14. **Clay/Conduit PIN on the viewer.** Redundant with enrollment; extra friction on every open.
15. **Version stepper** (HF artifacts). Only if the relay keeps per-revision payloads; today `revision` overwrites in place.
16. **CSS-only highlighting** (no JS highlighter) for the first paint, upgrade on idle. Helps 4k-line diffs on A12.
17. **Hex dump** for `binary` instead of Moshi’s blank list. Minority; usually noise.
18. **Don’t add `file_preview`:** infer everything from `file_diff` + `tool_result`. Faster to ship, but HTML/PDF/image will stay trapped in `<pre>` forever.

---

## 4. Open questions + risks

1. **Will the relay ever inline image/PDF bytes, or only redacted patches?** If never, the image/PDF renderers are dead code. Spec them behind `dataUrl` presence; do not mock bytes in the client.
2. **Is HTML preview in-scope for v1?** Claude’s famous surface is interactive artifacts. Pi’s posture is redaction + private tailnet. v1 recommendation: **code view only** until sandbox policy is written.
3. **Truncation vs “too large”:** Garcon 4k chars vs Wave “too large” vs oc-remote 2560px. Need the relay’s actual cap.
4. **Standalone PWA + blob iframe PDF:** known iOS inconsistency. Need a device check on a real iPhone PWA, not Safari tabs.
5. **Web Share of `text/x-diff`:** not in MDN’s shareable list. Diffs may only share as `text/plain`.
6. **Focus vs composer:** RAC modal should inert the page; confirm the session composer does not still capture hardware keyboard.
7. **Streaming diffs:** projector already emits `file_diff` as tools complete. Opening mid-stream needs the HF “preview paused” rule or a freeze-at-open snapshot.
8. **License/GPL:** Garcon is GPL-3.0 — do not copy code; patterns only. Conduit/Clay MIT. Paseo AGPL — same caution.
9. **Mobbin MCP unauthenticated this session** — Claude iOS *artifact open* chrome is inferred from in-repo screenshots + Claude Web Mobbin, not from a paid iOS artifact-open flow capture. A later pass should pull the exact iOS artifact fullscreen if Mobbin has it.
10. **Kimi Code iOS is closed source.** No GitHub client to copy. Closest open iOS file matrix is Sammy42779 + BOC.
11. **history.pushState vs existing session URLs** (`/session/:id`) — hash `#preview` must not break attention deep links (`/attention/:id`).
12. **Highlighter main-thread cost** on 4k-line patches — risk of jank; virtualize or skip highlight when `too_large`.
13. **Iframe + Tailscale cookies:** even a sandboxed iframe that accidentally loads a tailnet URL could attach the PWA cookie. Ban `src` to any `*.ts.net` inside the viewer.

---

## 5. Sources

### GitHub repos (coding-agent / remote-CLI / viewers)

- https://github.com/dibstern/conduit
- https://github.com/chadbyte/clay
- https://github.com/cfal/garcon
- https://github.com/getpaseo/paseo
- https://github.com/chriswritescode-dev/opencode-manager
- https://github.com/anomalyco/opencode
- https://github.com/Edison-A-N/opencode-preview
- https://github.com/jungwuk-ryu/better-opencode-client
- https://github.com/ntoporcov/openclient
- https://github.com/Sammy42779/opencode_ios_client_dz
- https://github.com/theblazehen/P4OC
- https://github.com/crim50n/oc-remote
- https://github.com/mulkymalikuldhrs/opencode-android
- https://github.com/wavetermdev/waveterm
- https://github.com/wavetermdev/waveterm/blob/c99022c1/docs/docs/widgets.mdx
- https://github.com/wavetermdev/waveterm/pull/2459
- https://github.com/huggingface/chat-ui/commit/89e9b33f5cf772dff52d84b67be57c4ba359c855
- https://github.com/huggingface/chat-ui/commit/0b9507cefa682a3306e8fe8b66f380a175c99eb7
- https://github.com/assistant-ui/assistant-ui
- https://github.com/assistant-ui/assistant-ui/tree/main/packages/safe-content-frame
- https://github.com/lobehub/lobe-chat
- https://github.com/lobehub/lobe-ui
- https://github.com/e2b-dev/fragments
- https://github.com/aaif-goose/goose
- https://github.com/aaif-goose/goose/blob/e94f3047/ui/desktop/src/components/ImagePreview.tsx
- https://github.com/aaif-goose/goose/issues/3562
- https://github.com/All-Hands-AI/OpenHands
- https://github.com/bradAGI/awesome-cli-coding-agents
- https://github.com/awesome-opencode/awesome-opencode
- https://github.com/badlogic/pi-mono
- https://github.com/MoonshotAI/kimi-cli
- https://github.com/myrialabs/clopen
- https://github.com/TommyLui/codeg
- https://github.com/github/copilot-cli/issues/3301
- https://github.com/anomalyco/opencode/issues/11616
- https://github.com/dart-lang/dart-pad/issues/2743

### Docs / HIG / web platform

- https://opencode.ai/docs/web
- https://docs.waveterm.dev/widgets
- https://deepwiki.com/wavetermdev/waveterm/4.2-file-preview-and-editor-views
- https://getmoshi.app/
- https://getmoshi.app/docs/diff-viewer
- https://getmoshi.app/docs/hooks
- https://unpeel.com/
- https://developer.apple.com/documentation/quicklook/qlpreviewcontroller
- https://developer.apple.com/documentation/swiftui/view/fullscreencover(ispresented:ondismiss:content:)
- https://developer.apple.com/design/human-interface-guidelines/sheets (JS-gated this pass; HIG interaction notes used via https://github.com/johnrogers/claude-swift-engineering/blob/main/plugins/swift-engineering/skills/ios-hig/references/interaction.md)
- https://docs.blink.sh/advanced/files-app
- https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
- https://react-spectrum.adobe.com/react-aria/Modal.html
- https://www.mintlify.com/lobehub/lobehub/features/artifacts
- https://www.pkgpulse.com/guides/monaco-editor-vs-codemirror-6-vs-sandpack-in-browser-2026
- https://www.shareduo.com/blog/claude-artifacts
- https://play.google.com/store/apps/details?id=dev.blazelight.p4oc

### Mobbin

- https://mobbin.com/explore/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b (Claude iOS coding input)
- https://mobbin.com/explore/screens/1a33eaae-c123-4c39-82bc-e42df38209d3 (Claude Web code preview)
- https://mobbin.com/explore/screens/36894d50-1a68-4142-8907-ad5623a47fc7 (Claude Web publish artifact)
- https://mobbin.com/explore/flows/def7a90e-2606-4c80-92a0-d34c8ce78fff (GitHub iOS repo detail)

### In-repo evidence

- `docs/design-reference/mobile-chat-apps/01-visual-teardown.md` (+ `screens/claude-conversation-actions.png`)
- `apps/pi-remote-web/src/App.tsx` (`file_diff` / `DiffPatch`)
- `packages/pi-rpc-protocol/src/types.ts` (`FileDiffBlock`, `unknown`)
- `apps/pi-remote-relay/src/store/transcript-projector.ts` (diff emission)
- `apps/pi-remote-web/src/SessionHeader.tsx` / `SessionComposer.tsx` (existing RAC Dialog)
