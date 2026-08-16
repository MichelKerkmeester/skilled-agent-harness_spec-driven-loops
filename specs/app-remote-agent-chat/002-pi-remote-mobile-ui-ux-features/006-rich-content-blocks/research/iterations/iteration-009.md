<!-- provenance: external-CLI orchestration pass; original file iter-09-grok.md -->
> **Source pass 9** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-9-grok.md`.

<!-- F7-rich-content-blocks | model=grok | lens=competitive-teardown | iter 9/10 | 2026-08-16T04:29:33.768Z -->

I have enough primary sources to write the teardown: 2026 product splits, official interaction sequences, and the mobile copy failures that earlier passes did not cover.

# Competitive teardown — Claude-style Command / Output / Artifact blocks (iteration 9 / 10)

Lens: **competitive-teardown**. How Claude iOS, Kimi Code, ChatGPT, Perplexity, DeepSeek, Gemini, and Meta AI actually handle *this* job on a phone: a bash Command+Output object, a fenced-code object, and a long-text artifact, each with Copy and a full-screen inspect surface. Specs below are for Pi Remote’s installable iPhone PWA (React 19, Vite, Tailwind 4, react-aria-components) over already-redacted transcript bytes. No mutation. No host-filesystem read.

Evidence boundary: Mobbin MCP was **not callable** this session (empty MCP catalog; OAuth still operator-pending). Public Mobbin flow/screen URLs are cited as catalog pointers, not as measured pixels. Pixel numbers come from (a) this repo’s Claude screenshot teardown, (b) first-party help/docs/changelogs, (c) GitHub issues in shipped clients, and (d) third-party DESIGN.md reconstructions, which are labeled as reconstructions.

---

## 1. Findings

### 1.1 The 2026 split that earlier teardowns flattened: *side panel* vs *inline block*

Two incompatible mobile architectures shipped in 2025–2026. Pi Remote on a 390-pt iPhone can copy only one of them.

| Architecture | Who still ships it | What the user does | Why it fails on 390 pt |
|---|---|---|---|
| **Dedicated pane beside chat** | Claude web/desktop artifacts; Gemini Canvas (desktop); ChatGPT Canvas (legacy models only); Perplexity Assets (web) | Content lives in a second column; chat stays visible | There is no second column. iPad can fake it; iPhone cannot. |
| **Inline block in the turn, optional fullscreen** | ChatGPT writing/code blocks (current models, May–June 2026); Claude iOS *in-thread card*; DeepSeek/Perplexity fenced code; Kimi Web Shell cards | Card stays in the transcript; Expand opens a reader | Fits a PWA virtualizer. Matches F6. |

OpenAI’s own release notes state the reason they killed Canvas on GPT-5.5 Instant and GPT-5.5 Thinking: writing and coding now live **in the chat thread** as writing blocks and code blocks so the same surface works on phones, tablets, web, and desktop. Paid users keep Canvas only on **legacy models until sunset**. ([ChatGPT release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes); contemporaneous recap of the 28 May 2026 Instant/Thinking cut: [Canvas sunset write-up](https://medium.com/@mubashirburfat4/i-used-chatgpts-canvas-feature-for-six-months-then-openai-quietly-killed-it-88c542f1a63f).)

Claude’s official artifact model is still the other architecture: “a dedicated window separate from the main conversation,” Copy / view-code / download in the **lower-right of that window**, for content that is “significant and self-contained, typically over 15 lines.” Artifacts are on iOS/Android as of 21 July 2025, but the help article’s interaction chrome is still described as a right-of-chat window. ([Claude Help: What are artifacts](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them); [Claude blog, 21 Jul 2025 iOS/Android](https://claude.com/blog/build-artifacts).)

**Implication for this stack:** do not port Claude *web*’s split editor onto the PWA. Port Claude *iOS*’s in-thread card plus ChatGPT 2026’s inline-block → fullscreen reader. That is already F6’s shape (`ModalOverlay` + `Modal` + `Dialog`, full-screen on iPhone, no detents). Mobbin’s Claude **web** code-preview screens are the anti-target: [Claude Web Coding Interface](https://mobbin.com/explore/screens/74973eed-0934-4bad-b8e8-504a3afe20b8), [Claude Web Code Preview](https://mobbin.com/explore/screens/1a33eaae-c123-4c39-82bc-e42df38209d3). Claude **iOS** flows in Mobbin are chat-with-coding-input, not a side pane: [coding-input flow](https://mobbin.com/explore/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b), [text-input flow](https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57).

### 1.2 There are two Claudes. Only one is the target bar.

| Surface | Command / bash | Copy | Artifacts |
|---|---|---|---|
| **Consumer Claude iOS** (the bar) | Not a coding-agent shell. Code is a fenced block or an artifact card in the turn. | Per-turn action row (copy · share · play · thumbs · retry) **and** a Copy control on the artifact window. Local screenshot: `docs/design-reference/mobile-chat-apps/01-visual-teardown.md`. | In-thread card (title + muted subtype + thumbnail). Tap opens a dedicated inspect surface. Artifacts space in the sidebar does **not** auto-ingest in-conversation artifacts until Publish. |
| **Claude Code iOS** (do not copy) | Bash tool **card is blank until the command finishes** — no streaming stdout. ([anthropics/claude-code#38260](https://github.com/anthropics/claude-code/issues/38260)) | **No copy icon under answers**; users must select text. Feature request to match consumer Claude / Mac. ([#61891](https://github.com/anthropics/claude-code/issues/61891)) | Published Code artifacts (`claude.ai/code/artifact/…`) **do not list** in the mobile Artifacts view; no Code section. Workaround: paste the URL in Safari. ([#78792](https://github.com/anthropics/claude-code/issues/78792), iOS 1.260709.0 / 1.260721.0) |
| **Claude Code iOS approval** | Long bash commands truncate with `\…`; **no tap-to-expand, no scroll, no detail view** before Allow/Deny. ([#48411](https://github.com/anthropics/claude-code/issues/48411), duplicate of #37235) | n/a (this feature is read-only; still a truncation anti-pattern for the *viewer*) | n/a |

Using Claude’s 2026 guide is explicit: “Editing and iterating is easier on web/desktop than mobile (**the mobile app is mainly for viewing**).” ([usingclaude.com artifacts guide](https://usingclaude.com/en/guides/features/how-to-use-claude-artifacts).) Pi Remote is a **viewer of a remote agent**. Consumer Claude iOS-as-viewer is the bar. Claude Code iOS is a list of defects to refuse: blank-until-done bash, truncation without expand, hover-or-select-only copy, artifact listing that diverges from web.

Beebom’s mobile walkthrough adds one more anti-target: **Publish is web-only**; the iOS app can view, not mint public URLs. ([Beebom: Claude Artifacts](https://beebom.com/claude-artifacts-how-to-use/).) Matches this feature’s “no publish / no public URL” lock and F6’s non-goal list.

### 1.3 Claude iOS — concrete card / code / artifact sequence

**Ground truth in this repo** (measured off `screens/claude-conversation-actions.png` at ~390 pt): assistant serif, no bubble; artifact card ~16 px radius, hairline, near-canvas fill; title (medium) + muted subtitle (`Piano MIDI Player` / `Interactive artifact`); small tilted thumbnail on the right; optional centered `1 artifact` pill above the turn; **per-message actions sit under the answer, not inside the card**. ([01-visual-teardown.md](docs/design-reference/mobile-chat-apps/01-visual-teardown.md).)

**Third-party reconstruction** (not Anthropic; `Meliwat/awesome-ios-design-md`, useful as a second ruler, not as pixels we observed):

- **Code block:** 12 pt radius, 16 pt padding, header = language (JetBrains Mono 11 pt, muted) left + Copy right, 1 pt divider; body JetBrains Mono 14 pt; Copy control drawn 32×32 with a **44 pt hit area**; copy confirmation = icon → checkmark 150 ms + toast 1 200 ms. Horizontal scroll, wrap off. ([Claude DESIGN.md](https://github.com/Meliwat/awesome-ios-design-md/blob/main/design-md/misc/claude/DESIGN.md).)
- **Artifact card (iPhone):** inset in the flow, 12 pt radius, paper fill, 1 pt sand border, 16 pt padding; title + type icon; preview ≈ first **6 lines** or a thumbnail; footer **Open** on the right; tap → **full-screen modal**. iPad → 40% side pane (30–60% draggable). Artifact expand described as a 400 ms shared-element spring. Copy on cream vs dark wells uses different fills.
- Conflict with this repo’s screenshot: teardown says **~16 px** radius and **no Open label** (thumbnail-as-affordance); reconstruction says **12 pt** and an explicit Open. For Pi, **16 px / `--radius-lg`** already matches `file_diff` and F6 (`specs/002/F6-file-preview/spec.md`). Prefer the local screenshot + F6 over the reconstruction’s 12 pt.

**Official interaction sequence (consumer Claude, artifact window):**

1. Claude emits self-contained content ≳ 15 lines.
2. A dedicated artifact surface appears (web: right of chat; iOS: card in the turn → tap to inspect).
3. Lower-right cluster: view underlying code, **Copy**, Download. ([Claude Help](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them); [Claude Academy](https://academy.claude.com/courses/claude-101/creating-with-artifacts).)
4. Sidebar Artifacts list is a **library**, not the transcript. In-conversation artifacts appear there only after Publish. Do not add a session-wide gallery in v1 (F6 already forbids it).

**Copy vs turn actions (the placement rule):** Claude puts **block-local Copy on the artifact/code chrome** and **message Copy on the turn action row**. Gemini’s structured-card rule in this repo’s earlier capture is the same: actions that operate on *that* object live inside the card; message feedback stays outside. ([research-gpt-luna.md](docs/design-reference/mobile-chat-apps/research-gpt-luna.md) §6.)

### 1.4 Kimi Code is not an iPhone app. Treat the Web Shell renderer + TUI card as the bar.

Moonshot’s **App Store “Kimi”** (`id6474233312`) is a consumer chat/agent product (slides, games, plugins). It is **not** the coding-agent transcript UI. ([Kimi App Store](https://apps.apple.com/us/app/kimi-kimi-k3-is-live/id6474233312).)

**Kimi Code** is a TUI plus `kimi web`. Default bind is **loopback** `127.0.0.1` (docs currently say port **5494**, range 5494–5503). That URL is unreachable from an iPhone until `--network` / `--host 0.0.0.0` plus auth. Mobile layout is **not** a native app: “Desktop: Sidebar + main content; **Mobile: collapsible drawer-style sidebar**.” ([Kimi Web UI](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html).)

What the Web UI actually documents for *this* feature:

- **Shell commands and output are dedicated components**, not a generic disclosure. ([Kimi Web UI — Tool output](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html).)
- Tool parameters are expandable with syntax highlighting for long values.
- Assistant-message actions: **Copy** (whole message) and **Fork** (v1.10). No documented per-pane Copy on the Shell card in the public page — a gap, not a license to omit it.
- TUI streams stdout/stderr **into the running Bash tool card** while foreground execution is active. Default foreground timeout 60 s (max 5 min); timeout can background the task rather than kill it. stdin closed. ([Kimi built-in tools](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/tools.html).)
- TUI global collapse: **Ctrl-O** toggles collapsed/expanded state of tool output. ([Kimi interaction](https://moonshotai.github.io/kimi-code/en/guides/interaction.html).) On iPhone the analog is a per-card disclosure, not a hidden keyboard chord.
- `--restrict-sensitive-apis` disables **Open-in** (Terminal / VS Code / Cursor / System) and file access. That is the same boundary Pi already has. Do not port Open-in.

GitHub evidence that Kimi **stabilized card height** because streaming bash made the card jump: [MoonshotAI/kimi-code#1345](https://github.com/MoonshotAI/kimi-code/pull/1345). Copy on Kimi Web code blocks requires a **secure context**; they added an `execCommand` textarea fallback for HTTP. ([kimi-code#1714](https://github.com/MoonshotAI/kimi-code/pull/1714); [kimi-cli#1340](https://github.com/MoonshotAI/kimi-cli/issues/1340).) Pi Remote is Tailscale HTTPS, so `navigator.clipboard.writeText` is available; still fail closed like existing `AssistantActions`.

**Kimi vs Pi Activity grouping:** Kimi groups consecutive tool calls into collapsible stacks **with per-tool renderers still visible inside**. Pi today folds `tool_call` / successful `tool_result` into a quiet “Worked · N tools” disclosure and renders only `<pre>` inside (`App.tsx` `isEvidenceBlock` / `ActivityGroup`). That is the structural miss relative to the Kimi bar: grouping is fine; **erasing the Shell card** is not.

### 1.5 ChatGPT iOS — writing block / code block (post-Canvas)

Official contract ([Working with writing blocks and code blocks](https://help.openai.com/en/articles/20001246-working-with-writing-blocks-and-code-blocks-in-chatgpt)):

**Writing block**

- Editable draft (email, doc, PRD). Actions, **when present**: edit in place, **Copy**, **open full-screen editing view**.
- June 2026 app notes: full-screen writing covers essays/PRDs/reports; Library save; wider layout; **table of contents** for long docs; download; undo/redo; clearer loading. ([Release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes); [8 Jun 2026 recap](https://updatealert.io/updates/openai/openai-chatgpt/chatgpt-update-2026-06-08).)

**Code block**

- Separates code from prose. Actions, **when present**: **Copy**, language label, edit, **full screen**, Code/Preview toggle, Run (Python) + console, Stop.
- Availability **varies by plan, device, workspace, model, rollout**. Do not assume every control is on iOS.
- Previews: HTML / React / SVG / Mermaid / Vega (third-party recap of the inline-block replacement: [Canvas sunset](https://medium.com/@mubashirburfat4/i-used-chatgpts-canvas-feature-for-six-months-then-openai-quietly-killed-it-88c542f1a63f)). Run was removed from Code Canvas in late 2025 and lives on the inline block’s sandbox instead.

**iOS copy sequence (message-level):** tap the response to reveal action icons → tap the clipboard icon → whole response on the pasteboard. Manual select-and-copy is the partial-copy path and is dirtier (UI chrome, markdown vs rendered). Prefer the app’s Copy control over selection. ([ChatGPT4Mobile copy guide](https://chatgpt4mobile.com/how-to-copy-chatgpt-text-on-mobile).)

**Desktop-only, do not fake on iPhone:** `⌘⇧;` copies the **last code block**. ([Release notes, keyboard shortcuts](https://help.openai.com/en/articles/6825453-chatgpt-release-notes).)

**Copy integrity bug (web, still the right test):** the Copy **button** dropped the first character of the last line while the rendered `<pre>` was correct; manual selection was fine. Root cause class: Copy must write the **source string**, not `innerText` of highlighted spans. ([OpenAI community #1384161](https://community.openai.com/t/code-block-copy-button-drops-first-character-of-last-line/1384161).)

**ChatGPT iOS listing** (v1.2026.209, requires iOS 17): [App Store](https://apps.apple.com/us/app/chatgpt/id6448311069). Mobbin chrome (not a code-block measurement): [ChatGPT iOS chat](https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1).

**Pi mapping:** keep Copy + Open full-screen. Drop Edit, Run, Preview-as-execution, Library, Download, ToC-as-navigation-chrome. A **read-only** ToC for a 2 500-line artifact is a minority idea (section 3), not v1.

### 1.6 Perplexity iOS — Copy on code, Expand on *assets*, not on snippets

Perplexity is an answer engine. Its hero object is the **cited answer**, not a shell card.

Reconstructed iOS spec (`awesome-ios-design-md`, not official Perplexity pixels):

- **Code block:** fill `#0E0E0E`, 1 pt `#2A2A2A` border, **8 pt** radius, **14 pt** padding. Header: language JetBrains Mono 11 pt left, **Copy right**, 1 pt divider. Body JetBrains Mono **14 pt**. **No Expand control on ordinary code.** ([Perplexity DESIGN.md](https://github.com/Meliwat/awesome-ios-design-md/blob/main/design-md/misc/perplexity/DESIGN.md).)
- **Answer action row:** Copy / Share / Pro Search retry / Save — **message-level**, under the prose.
- **Pro Steps:** collapsed-by-default accordion, 12 pt radius, 16 pt pad, **300 ms** expand, 30 ms stagger per row. This is Perplexity’s analog of Pi’s Activity disclosure — and it stays a *list of steps*, not a bash log.
- **Source cards:** **200×80 pt**, 12 pt radius, 12 pt pad, horizontal scroll, 12 pt gap; “Show all N sources” chevron card after the last. Wrong object for bash, useful as a **density warning**: 80 pt-tall chips cannot hold a command.

Official Assets/Labs: generated docs/apps open a preview with an **Expand → fullscreen** control and version history; **auto-open** of the asset pane is documented on web. Third-party reporting (2026) still describes **asset creation as web-first / Pro–Max**, not a complete iPhone parity. ([Perplexity Assets help](https://www.perplexity.ai/help-center/en/articles/12528830-creating-assets-with-perplexity-overview) — Cloudflare-gated this pass; [Perplexity iOS App Store](https://apps.apple.com/us/app/perplexity-ai-search-chat/id1668000334), v26.31.0, iOS 18+; Mobbin: [Perplexity iOS screen](https://mobbin.com/explore/screens/67ff18d6-4a29-418d-9f55-b51010e0b462).)

**Pi mapping:** steal **language+Copy in the code header**. Do not steal the inverted `#0E0E0E` well (fights parchment; already rejected in iter 8). Do not steal 8 pt radius (F6/Claude-in-repo is 16). Do not auto-open anything. Do not skip Expand on bash/long text just because Perplexity skips it on snippets — a 4k-line `tool_result` is not a 12-line snippet.

### 1.7 Gemini iOS — the warning case for hidden Copy and desktop-only Canvas

**In-chat code (web help, still the documented Copy):** “To copy code from a response: **Below the block of code, click Copy.**” ([Gemini Apps help](https://support.google.com/gemini/answer/13275745).) Placement is **under the block**, not in a hover overlay.

**iOS Canvas copy is a three-step regression.** Official iPhone/iPad Canvas help:

1. Open the Canvas chat.
2. Top of the Canvas panel → **More**.
3. To copy: **Tap Select text. Select the text you want. Tap Copy.**

On **Gemini web even on a phone**, the same menu offers a one-tap **Copy**. The native app does not. ([Canvas — iPhone & iPad](https://support.google.com/gemini/answer/16047321?hl=en&co=GENIE.Platform%3DiOS).)

Other Gemini mobile cuts, all first-party:

- **Export to Colab / Replit / Sheets: “This feature isn't currently available on the Gemini mobile app.”** Docs/Gmail export exist. ([Export responses — Android help, same mobile clause](https://support.google.com/gemini/answer/14184041?hl=en-GB&co=GENIE.Platform=Android).)
- **Text style/format editing: desktop web only.** ([Canvas FAQ](https://gemini.google/overview/canvas/); same sentence in iOS help.)
- **Shared Canvas links open only on gemini.google.com. They do not open in the Gemini mobile app.** ([Canvas iOS help](https://support.google.com/gemini/answer/16047321?hl=en&co=GENIE.Platform%3DiOS).)

This repo’s Gemini capture: structured cards 18–22 pt radius, 16–20 pt padding; thumbs + overflow under the answer; Copy lives in **More**. ([research-gpt-luna.md](docs/design-reference/mobile-chat-apps/research-gpt-luna.md).) Mobbin (chrome, not a code block): [Gemini iOS Gem detail](https://mobbin.com/explore/screens/a7a9fe4a-4817-4b22-ad5b-0a1e17c447d8).

**Pi mapping:** never hide Copy in More / overflow / hover. Gemini is the existence proof that “we have Copy, it’s in a menu” fails the coding-agent job.

### 1.8 DeepSeek iOS — one-tap code Copy, no agent card, sandbox is web-only

Official App Store: DeepSeek – AI Assistant, seller Hangzhou DeepSeek, **iOS 15+**, v2.3.3 “Fixed some known issues.” No current What’s New line for tables or artifacts. ([App Store](https://apps.apple.com/us/app/deepseek-ai-assistant/id6737597349).) Listing does **not** document a Command/Output object.

Secondary (not first-party) iOS marketing: syntax-highlighted code, **language label**, **one-tap copy** “paste straight into Xcode”; **code sandbox is web-only**. ([deepseeksr1.com iOS page](https://deepseeksr1.com/ios-app/) — treat as unofficial.) This repo’s earlier DeepSeek notes: composer Instant/Expert, DeepThink/Search chips; Chinese disclaimer. ([research-gpt-luna.md](docs/design-reference/mobile-chat-apps/research-gpt-luna.md) §5.)

Iter 1 cited App Store history for **table** copy / download / fullscreen. That control exists for *tables* in some builds; it is **not** a general artifact model. Do not infer a bash viewer from a table preview.

DeepSeek TUI (separate product) had to **re-enable selection on tool output** after a gate restricted copy to user/assistant bodies — tool logs became uncopyable. ([chenchunyang/DeepSeek-TUI](https://github.com/chenchunyang/DeepSeek-TUI).) Same class of bug as folding bash into Activity with no Copy.

### 1.9 Meta AI — negative control

App Store v286.0.0 (iOS 17.2+): briefings, email/calendar, research reports, presentations, quizzes, games, Thinking, voice, glasses. **No** code-block, command/output, or artifact-inspect language. Accessibility features: **not indicated**. ([Meta AI App Store](https://apps.apple.com/us/app/meta-ai/id1558240027).) Mobbin home (empty/greeting, not a code card): cited in `01-visual-teardown.md`.

A coding-agent transcript that looks like Meta AI’s prose/media feed is a failed product. Do not use Meta’s More/long-press-only patterns for commands.

### 1.10 The actual category peer is Happy Coder, and its Copy UX is a defect to invert

Pi Remote’s job is **phone → private host agent**. Consumer Claude/ChatGPT/Gemini are chat apps. The GitHub peer is [slopus/happy](https://github.com/slopus/happy/) (App Store “Happy: Codex & Claude Code”, `id6748571505`): QR-paired remote for Claude Code / Codex, E2E encrypted, Expo.

Shipped Copy behavior on mobile:

- Code-block Copy used **`onMouseEnter` / `onMouseLeave`**. Those events **do not fire on iPhone**, so the button stays `opacity: 0; pointer-events: none`. ([slopus/happy#841](https://github.com/slopus/happy/issues/841).)
- Experimental `markdownCopyV2`: **long-press opens a full-message selection screen**. No per-block Copy. All-or-nothing. ([#841](https://github.com/slopus/happy/issues/841); [PR #82](https://github.com/slopus/happy/pull/82).)
- Users still cannot select a precise slice of tool output. ([#1386](https://github.com/slopus/happy/issues/1386).)

**This is the highest-severity competitive finding for Pi:** hover Copy and whole-message Copy are how a Claude-Code-on-iPhone client already failed. Always-visible 44 pt per-block Copy + native selection inside the well is the bar. Happy’s dedicated `/text-selection` screen is a **fallback**, not the primary.

### 1.11 Market gap: third-party “artifact readers” exist because chat apps fail at long content

[AI Artifact Reader](https://github.com/EricZZZZhang/ai-artifact-reader) (App Store `id6777939457`) and [AIpine](https://apps.apple.com/us/app/aipine/id6775947157) exist specifically to paste HTML/Markdown/JSX from Claude/ChatGPT/Gemini/Perplexity/DeepSeek/Kimi and render it **offline**. That is evidence that in-chat cards + a weak viewer are not enough. Pi must not become another paste-out-to-Files workflow. F6 **is** that reader, in-app, over relay snapshots, **without executing HTML/JS** (F6 forbids it; those App Store apps advertise JS execution — out of scope and unsafe on a tailnet transcript).

### 1.12 iPhone chrome the competitors agree on (and where they disagree)

**Agreement (use):**

- Full-screen or near-full-screen inspect for *long* content; inline preview stays short. Apple: full-screen modal for in-depth content; **Cancel/Close on the leading edge** of a single-view sheet; Done trailing if present; **do not stack sheets**; pair Close with a real way out — a lone Done that implies “complete the task” is wrong for a read-only viewer (there is nothing to complete). HIG Sheets updated **24 Mar 2026** for button placement. ([HIG Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets); [HIG Modality](https://developer.apple.com/design/human-interface-guidelines/modality).)
- Hit targets **44×44 pt**. Reconstruction even for Claude’s 32 pt glyph still expands the hit to 44. WCAG 2.5.8 AA is only 24×24 — Apple wins on this PWA.
- Copy writes **plain source**, not rendered HTML. ChatGPT’s last-line bug and Kimi’s HTTP clipboard fallback both prove this.
- Message-level Copy and block-level Copy are **different controls**. ChatGPT, Claude, Perplexity, Gemini (web) all separate them.

**Disagreement (must pick):**

| Topic | Camp A | Camp B | Pi pick |
|---|---|---|---|
| Wrap vs horizontal pan | Cline: always wrap on mobile. | Claude reconstruction: wrap off, pan. F6 code: wrap **off** by default + Wrap toggle. | F6: wrap off + visible Wrap. Command lines wrap (`overflow-wrap: anywhere`) so a 200-char bash line is readable without pan. |
| Well color | Perplexity/DeepSeek/ChatGPT: inverted near-black. | Claude iOS artifact card: near-canvas paper. | Paper card, parchment well (iter 8). Inverted well is the category default to reject. |
| Expand on every code block | ChatGPT / Claude artifacts: yes. | Perplexity / DeepSeek snippets: Copy only. | Expand if preview is truncated **or** line count ≥ 16 (Claude’s 15-line artifact rule). Short fences: Copy only, still selectable. |
| Auto-open | Perplexity Assets / some Canvas: auto pane. LibreChat: rich HTML auto-open while streaming. | LibreChat later: **code never auto-opens**. | Never auto-open. Operator is monitoring a live agent; a sheet covering the transcript is hostile. |
| Streaming bash | Kimi: stream into the card. | Claude Code iOS: blank until done. | Show command immediately; output preview updates; **do not announce every chunk** (a11y). |
| Copy placement | Claude artifact window: **lower-right**. Perplexity/Claude code: **header trailing**. Gemini web: **below block**. | Gemini iOS Canvas / Happy: menu or hover. | Header trailing on the **card**; header trailing on F6. Never hover, never More-only. |

### 1.13 What Pi Remote has today (the competitive gap, cited to code)

- `tool_call` / successful `tool_result` fold into `ActivityGroup` (“Worked · N tools”). Content is `<pre>{inputSummary}` / `<pre>{output}`. No pairing by call id on the DTO. (`App.tsx` `isEvidenceBlock`, `Block`.)
- Copy exists only as **whole-answer** `AssistantActions`, gated on `clipboard.writeText`, errors swallowed, 1 500 ms “Copied”.
- `file_diff` is the only styled card. F6 viewer shell is specified, not shipped in `apps/pi-remote-web` (composer/header use `Dialog` inside `Popover`, not `ModalOverlay`).
- Protocol: `ToolCallBlock` has `toolName` + `inputSummary`; `ToolResultBlock` has `output` + `isError`. No `callId`, no `exitCode`, no language, no artifact kind. (`packages/pi-rpc-protocol/src/types.ts`.)

---

## 2. Concrete spec contribution (build-executable)

This section is Pi Remote requirements synthesized from the competitive matrix. It does not claim we measured these numbers on Mobbin.

### 2.1 Routing (what graduates out of Activity)

| Object | Stays in Activity | Becomes a card | Opens F6 |
|---|---|---|---|
| `thinking`, `usage`, non-shell tools | Yes, grouped | No | No |
| Paired `bash`/`shell`/`exec` `tool_call`+`tool_result` (and `isError` results) | **No** — leave Activity | `CommandOutputCard` | Yes, if output preview truncated or user taps Open |
| Fenced code inside assistant `text` | n/a | `CodeCard` in the serif flow | Yes if truncated or ≥ 16 logical lines |
| Long self-contained text / goal / prompt | n/a | `TextArtifactCard` if ≥ **16 lines or 1 200 characters** (Claude’s “typically over 15 lines”) | Always (that is the point of the card) |
| `file_diff` | No | Existing card | F6 as specified |

Pair **only** by relay `callId`. Adjacency pairing breaks when two bash calls overlap. This is a DTO field, not a mutation.

### 2.2 Shared chrome (all three cards)

- Width: 100% of the assistant column. Radius: `var(--radius-lg)` **16 px**. Border: 1 px `--line`. Fill: `--surface` (light) / `--surface-raised` (dark). Padding: 12 px chrome / 16 px well. Inter chrome, mono well. Clay only on `$` / streaming glyph / error border — not on Copy.
- **Two independent RAC `Button`s** (Copy, Open) plus native selection in the well. The card is **not** a single `Button` (F6 file-card pattern). Nested interactive content is illegal in a disclosure trigger and in a card-as-button. ([React Aria Disclosure](https://react-aria.adobe.com/Disclosure); iter 3 a11y.)
- Copy and Open: **44×44 pt** on `(pointer: coarse)`. Visible glyph may be 16–20 pt. Accessible name starts with the visible word: `Copy command`, `Copy output`, `Copy code`, `Copy text`, `Open command output`, `Open code`, `Open document`. ([WCAG 2.5.3 Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html).)
- Copy payload = the **already-redacted source string**, invoked **synchronously** in `onPress` via `navigator.clipboard.writeText`. No `await` except `writeText`. On success: label `Copied` **2 000 ms** (OpenCode / Vercel / ChatGPT-class), **no toast**, focus stays. On failure: inline `Copy failed. Touch and hold to select the text.` Do not swallow. Tailscale HTTPS is a secure context; still capability-gate like `AssistantActions`.
- Open always reuses **one** F6 `ArtifactViewerProvider`: `ModalOverlay` + `Modal` + `Dialog`. Full-screen on iPhone. Close **leading**, 44×44, `aria-label="Close preview"`. No grabber, no detent, no backdrop-tap, no custom swipe-down (F6: conflicts with scroll and selection). History-backed Back / edge-swipe. Focus title (`tabIndex={-1}`) on open; restore to the exact Open button (or the transcript region if virtualized away).
- Motion: overlay dissolve 200 ms enter / 150 ms exit, sheet `translateY(8px→0)` 220 ms `--ease-out`. **No** RAC `modal-zoom` / scale(0.8). `prefers-reduced-motion`: opacity only, ≤ 100 ms. Copy: **no positional motion**.
- Virtualizer: opening F6 **must not** change the row height. Expanding an inline Activity disclosure **must** `measureElement`.

### 2.3 `CommandOutputCard` — states, gestures, a11y, visual

**Anatomy (Kimi split, Claude paper):**

```
[ Ran a command | Running | Command failed ]     [Copy ▾] [Open]
$  <command, wrap, max 3 lines, fade if clipped>
────────────────────────────────────────────────
Output · N lines · exit unknown                 [Copy]
<preview, max 8 lines / 160 px, fade-mask>
```

Do not inject a synthetic `$` into the copy payload. Show `$` in the UI only (`aria-hidden`).

| State | Visible | Copy | Open | Live region (one `role="status"`) |
|---|---|---|---|---|
| `pending` (call, no result) | Command only; output well = `Running…` 3-dot (existing `working-wave`, killed under reduced motion) | Command | Disabled until first output byte **or** always enabled with `Output is still running.` empty viewer — pick **enabled**, show streaming snapshot | “Command started.” once |
| `ready` | Command + preview | Both | Yes | “Command completed.” once |
| `error` (`isError`) | Command + preview; `--danger` label and 3:1 well border, not a red flood | Both | Yes | “Command failed.” once |
| `empty` | Command; output `No output.` | Command only | No | none extra |
| `truncated` (preview clip) | Fade-mask + `Open` emphasized | Both copy **full** strings | Required | none |

**Gestures:** tap Copy / Open. Vertical pan on the transcript, not on the 160 px well (well is `overflow: hidden`). Long-press inside the well = native iOS selection. No card-level long-press. No swipe-to-open.

**Streaming (anti Claude Code iOS):** paint the command as soon as `tool_call` arrives. Append output text in the preview **without** retokenizing. Do not `aria-live` the log. Kimi streams into the card; Claude Code iOS shows a blank card — we take Kimi.

### 2.4 `CodeCard` — states, gestures, a11y, visual

**Anatomy (Perplexity/Claude header, ChatGPT actions, parchment well):**

```
[language or “code”]                    [Copy] [Open if truncated]
<pre><code> preview, max 12 lines / 228 px, wrap-off, fade
```

- Language label is Inter/mono 11–12 pt muted, **never** inferred from a host path; use fence info if present, else `code`.
- Syntax: **plain first paint**. Highlight only in F6 or after the block’s revision is stable (iter 8). Highlighter spans `aria-hidden` so VoiceOver reads one code sequence.
- Short fences (< 16 lines, fully visible): **omit Open** (Perplexity/DeepSeek). Copy + selection remain.
- F6 code renderer: F6 table (wrap off default, Wrap/Find/Copy, line-number gutter `aria-hidden`). Copy all received content.

### 2.5 `TextArtifactCard` — states, gestures, a11y, visual

**Anatomy (Claude iOS card from local teardown + reconstruction’s 6-line preview):**

```
[label: “Document” | “Prompt” | “Notes”]     [Copy] [Open]
Title (Inter 15/20 semibold, 1 line, <bdi>)
Preview: first 6 lines, Source Serif 17/27, fade
```

- Whole-card tap is **not** used (Copy would be trapped). Open is explicit. Reconstruction’s “tap card to open” works only when the card is a single button — F6 file cards can; F7 cards cannot.
- F6 text renderer: Source Serif 17/27, wrap, native selection, Copy received content. No markdown execution, no remote images.

### 2.6 F6 viewer additions for these three types (do not fork a second overlay)

Reuse F6 header: Close leading, title, subtitle (`Bash · redacted` / `TypeScript · 84 lines` / `Document · 1 200 characters`), Copy trailing. At 200% text: two-row header (F6). Safe area: `env(safe-area-inset-top/bottom)`, height `min(100dvh, var(--visual-viewport-height))`. Portal to `document.body`. `overscroll-behavior: contain`.

**Do not call `Element.requestFullscreen()`** (LibreChat; dead on iPhone).

Viewer Copy is the same source string as the card Copy. If the user copies in both places, that is fine.

### 2.7 Competitive controls we will not ship

Run, Edit, Preview-as-iframe, Publish, Download, Open in VS Code/Colab/Replit/Sheets, Library, Fork, thumbs, auto-open, Canvas share links, hover Copy, More-only Copy, swipe-down dismiss, stacked sheets, inverted IDE well, `$` in clipboard.

---

## 3. Divergent / minority ideas (resist converging)

1. **Keep a collapsed composer inside F6** (ChatGPT full-screen writing still lets you continue the conversation). Operator job: read a 4k log and steer. Conflicts with F6 “blur the composer” and with “one modal task.” Could be a 44 pt `Reply` that closes F6 and focuses the session composer with a quote-block of the selected lines — still no mutation from the viewer itself.

2. **Happy’s `/text-selection` screen as Copy’s primary**, not a failure fallback. Always-visible Copy is the majority. A second “Select…” that pushes a dedicated selectable `<pre>` (no markdown, no gestures stealing selection) is how Happy tried to fix iOS selection and still lost per-block granularity. Worth it **only** if WebKit selection inside a RAC Dialog is broken on iOS 26; verify on-device before building.

3. **Perplexity-style horizontal chip row for N bash cards in one turn** (200×80). Density win; unreadable for commands. Maybe for *completed* tools as a jump list above the cards, not instead of them.

4. **Kimi Ctrl-O analog: session-level “Collapse all tools.”** One header control. Conflicts with “bash has graduated out of Activity.” Could apply only to non-shell Activity.

5. **Do not auto-promote 16-line assistant prose to an artifact card** (ChatGPT 2026 kept more content inline). Threshold only for user-labeled goals / `plan` text / explicit `artifact` kinds. Prevents every verbose answer becoming a card farm.

6. **Two-thumb Copy on the leading edge.** Header-trailing Copy is the category default and hard to hit one-handed on a full-width card. Leading Copy + trailing Open matches HIG Close-leading / action-trailing better than Claude’s lower-right cluster.

7. **View-code toggle without execution** (Claude’s Preview/Code). For text artifacts, F6 already allows optional source view. For bash, a “command vs output” segment is redundant if both panes are on screen. Skip Preview of HTML.

8. **Dual surface: cards + optional raw TTY** ([Arose-Niazi/claude-remote-controller](https://github.com/Arose-Niazi/claude-remote-controller), Moshi). Cards are a projection; TTY is the authority. Minority because this feature’s desired result is Claude-parity cards, not xterm. Keep as the honesty rule: if a block is `unknown` / truncated, say so — never imply completeness.

9. **DeepSeek table-only fullscreen** (content-type-specific inspect). Tempting to add a fourth card type for markdown tables. Out of F7 scope; don’t let table-preview chrome leak into bash.

10. **Gemini “Add Canvas app to Home Screen.”** Irrelevant and dangerous (HTML execution). Refuse.

11. **Copy confirmation toast** (Claude reconstruction, 1 200 ms from the bottom) vs in-button `Copied` (OpenCode, current `AssistantActions`). Toasts steal attention and can cover the next Copy. Stay in-button. Reconstruction’s 150 ms icon morph is optional and must respect reduced motion.

12. **Line-number gutter in the inline preview.** F6 has it in the viewer. Inline gutters steal 2–3 characters on 390 pt and contaminate selection. Keep gutters **viewer-only**.

---

## 4. Open questions + risks

| ID | Question | Risk if guessed |
|---|---|---|
| Q1 | Confirm consumer Claude iOS artifact expand: full-screen modal vs in-flow grow vs sheet detent, on-device or via authenticated Mobbin `search_screens`. Local screenshot shows the **card**, not the open viewer. | Shipping RAC zoom-dialog because we assumed “dedicated window.” |
| Q2 | Does Kimi Web’s Shell component expose per-pane Copy on a phone-width drawer, or only message Copy? Public docs don’t say. | Building a control Kimi itself doesn’t give mobile users — or omitting one they do. |
| Q3 | ChatGPT iOS: is code-block Copy **always visible**, or tap-to-reveal like message actions? Help says actions “vary by device.” | Hiding Copy to “match ChatGPT” and accidentally matching Happy’s hover bug. |
| Q4 | WebKit selection inside `Modal` + `pre` on iOS 26 standalone PWA: does long-press work, or do we need Happy’s selection screen? | Uncopyable output — the #1 Happy failure. |
| Q5 | Protocol: can the relay emit `callId` without changing mutation posture? Projector already pairs internally. | Cards desync on concurrent bash. |
| Q6 | 16-line / 1 200-char artifact threshold vs ChatGPT’s “keep it inline” 2026 move. | Card spam or missing Claude parity. |
| Q7 | Streaming `tool_result` into a virtualized row: Kimi fixed height jumps; our `estimateSize: 180` + `measureElement` will thrash if preview height is not capped. | Live-edge autoscroll fights the user (`App.tsx` 96 px threshold). |
| Q8 | Third-party DESIGN.md numbers (Claude 12 pt vs our screenshot ~16 px; Perplexity 8 pt inverted well) disagree with first-party screenshots. | Painting VS Code wells “because Perplexity.” |
| Q9 | Gemini/ChatGPT Preview of HTML/React is exactly what F6 forbids (no HTML/JS execution). Product pressure to “match Claude artifacts” will reintroduce it. | XSS on a tailnet transcript. |
| Q10 | Universal Clipboard: Copy on iPhone lands on the Mac. Redacted ≠ secret-free (iter 7). Competitive apps all Copy anyway. | Operator pastes a missed secret into Slack. Mitigation is relay redaction, not hiding Copy. |

---

## 5. Sources

### First-party product docs

- https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them
- https://claude.com/blog/build-artifacts
- https://academy.claude.com/courses/claude-101/creating-with-artifacts
- https://help.openai.com/en/articles/20001246-working-with-writing-blocks-and-code-blocks-in-chatgpt
- https://help.openai.com/en/articles/6825453-chatgpt-release-notes
- https://support.google.com/gemini/answer/13275745
- https://support.google.com/gemini/answer/16047321?hl=en&co=GENIE.Platform%3DiOS
- https://support.google.com/gemini/answer/14184041?hl=en-GB&co=GENIE.Platform=Android
- https://gemini.google/overview/canvas/
- https://www.perplexity.ai/help-center/en/articles/12528830-creating-assets-with-perplexity-overview
- https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html
- https://www.kimi.com/code/docs/en/kimi-code-cli/reference/tools.html
- https://moonshotai.github.io/kimi-code/en/guides/interaction.html
- https://developer.apple.com/design/human-interface-guidelines/sheets
- https://developer.apple.com/design/human-interface-guidelines/modality
- https://developer.apple.com/design/human-interface-guidelines/buttons

### App Store listings

- https://apps.apple.com/us/app/chatgpt/id6448311069
- https://apps.apple.com/us/app/perplexity-ai-search-chat/id1668000334
- https://apps.apple.com/us/app/deepseek-ai-assistant/id6737597349
- https://apps.apple.com/us/app/meta-ai/id1558240027
- https://apps.apple.com/us/app/kimi-kimi-k3-is-live/id6474233312
- https://apps.apple.com/us/app/happy-codex-claude-code-app/id6748571505
- https://apps.apple.com/id/app/ai-artifact-reader/id6777939457
- https://apps.apple.com/us/app/aipine/id6775947157

### GitHub (competitors, peers, bugs)

- https://github.com/anthropics/claude-code/issues/38260
- https://github.com/anthropics/claude-code/issues/61891
- https://github.com/anthropics/claude-code/issues/78792
- https://github.com/anthropics/claude-code/issues/48411
- https://github.com/MoonshotAI/kimi-code
- https://github.com/MoonshotAI/kimi-code/pull/1345
- https://github.com/MoonshotAI/kimi-code/pull/1714
- https://github.com/MoonshotAI/kimi-cli/issues/1340
- https://github.com/slopus/happy
- https://github.com/slopus/happy/issues/841
- https://github.com/slopus/happy/issues/1386
- https://github.com/slopus/happy/pull/82
- https://github.com/EricZZZZhang/ai-artifact-reader
- https://github.com/chenchunyang/DeepSeek-TUI
- https://community.openai.com/t/code-block-copy-button-drops-first-character-of-last-line/1384161

### Mobbin (catalog pointers; pixels not retrieved this pass)

- https://mobbin.com/explore/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b — Claude iOS, coding input
- https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57 — Claude iOS, text input
- https://mobbin.com/explore/screens/74973eed-0934-4bad-b8e8-504a3afe20b8 — Claude Web coding interface (anti-target)
- https://mobbin.com/explore/screens/1a33eaae-c123-4c39-82bc-e42df38209d3 — Claude Web code preview (anti-target)
- https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1 — ChatGPT iOS chat
- https://mobbin.com/explore/screens/67ff18d6-4a29-418d-9f55-b51010e0b462 — Perplexity iOS
- https://mobbin.com/explore/screens/a7a9fe4a-4817-4b22-ad5b-0a1e17c447d8 — Gemini iOS

### Reconstructions and secondary write-ups (labeled)

- https://github.com/Meliwat/awesome-ios-design-md/blob/main/design-md/misc/claude/DESIGN.md — Claude iOS reconstruction
- https://github.com/Meliwat/awesome-ios-design-md/blob/main/design-md/misc/perplexity/DESIGN.md — Perplexity iOS reconstruction
- https://usingclaude.com/en/guides/features/how-to-use-claude-artifacts
- https://beebom.com/claude-artifacts-how-to-use/
- https://medium.com/@mubashirburfat4/i-used-chatgpts-canvas-feature-for-six-months-then-openai-quietly-killed-it-88c542f1a63f
- https://chatgpt4mobile.com/how-to-copy-chatgpt-text-on-mobile
- https://updatealert.io/updates/openai/openai-chatgpt/chatgpt-update-2026-06-08
- https://deepseeksr1.com/ios-app/

### This repo

- `docs/design-reference/mobile-chat-apps/01-visual-teardown.md`
- `docs/design-reference/mobile-chat-apps/research-gpt-luna.md`
- `apps/pi-remote-web/src/App.tsx` (`ActivityGroup`, `Block`, `AssistantActions`)
- `packages/pi-rpc-protocol/src/types.ts`
- `specs/002/F6-file-preview/spec.md`
- `specs/002/F7-rich-content-blocks/001-research/BRIEF.md`
