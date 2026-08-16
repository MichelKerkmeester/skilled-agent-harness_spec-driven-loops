<!-- provenance: external-CLI orchestration pass; original file iter-06-grok.md -->
> **Source pass 6** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-6-grok.md`.

<!-- F7-rich-content-blocks | model=grok | lens=prior-art-github | iter 6/10 | 2026-08-16T04:14:37.203Z -->

# Iteration 6 — Prior-art GitHub: Claude-style Command / Output / Artifact blocks (iPhone PWA)

Lens: **prior-art-github**. Grounded in shipped GitHub clients, this repo’s current transcript surface, and mobile HIG / Mobbin evidence. Not a restyle opinion piece.

---

## 1. Findings for this lens

### 1.1 What this repo actually has (the gap prior art is solving)

Pi Remote already virtualizes a typed, redacted transcript (`@tanstack/react-virtual`, `estimateSize: 180`, `overscan: 6`, `measureElement`) and folds consecutive `thinking` / `tool_call` / successful `tool_result` / `usage` into one quiet **Activity** disclosure. Assistant `text` is a serif `<p>`. The only styled card is `file_diff`. Copy exists only as a whole-answer `AssistantActions` button, gated on `navigator.clipboard.writeText`, with errors swallowed.

```1312:1322:apps/pi-remote-web/src/App.tsx
function isEvidenceBlock(block: DisplayTranscriptBlock): boolean {
  switch (block.kind) {
    case 'thinking':
    case 'tool_call':
    case 'usage':
      return true;
    case 'tool_result':
      return !block.isError;
    default:
      return false;
  }
}
```

```1499:1508:apps/pi-remote-web/src/App.tsx
    case 'tool_call':
      label = `Tool call · ${block.toolName}`;
      content = <pre>{block.inputSummary}</pre>;
      collapsible = true;
      break;
    case 'tool_result':
      label = `${block.isError ? 'Tool error' : 'Tool result'} · ${block.toolName}`;
      content = <pre className={block.isError ? 'error-output' : ''}>{block.output}</pre>;
```

The display DTO has **no** `toolCallId`, **no** `exitCode`, **no** stdout/stderr split, **no** language, **no** artifact kind. The relay *does* pair internally (`toolCallKeys` + `tool:${callId}:result`) and stringifies args via `summarizeJson` ([`transcript-projector.ts`](apps/pi-remote-relay/src/store/transcript-projector.ts)). The web package has **no** highlighter (`react-aria-components` + Tailwind 4 only) ([`apps/pi-remote-web/package.json`](apps/pi-remote-web/package.json)). Overlay primitives already in use are react-aria `Dialog` / `Popover` sheets, not a named “F6” component (that name is not in this repo).

### 1.2 Coding-agent UIs that already solved Command + Output (the closest prior art)

**Pair the call with the result into one card. Do not leave them as two Activity rows.**

| Project | Approach | Tradeoff vs Pi Remote |
|---|---|---|
| [anomalyco/opencode](https://github.com/anomalyco/opencode) `packages/ui/src/components/message-part.tsx` | Dedicated `ToolRegistry` renderer for `bash`. Collapsed trigger = “Shell” + optional description. Body = one `<pre>` of `` `$ ${cmd}` `` + `stripAnsi(output)`. **One Copy copies command and output together.** Copy uses `onMouseDown={(e) => e.preventDefault()}` then `clipboard.writeText` (keeps the iOS user-activation window). 2s “Copied” state. No syntax highlight on logs. | Highest-fidelity match for a read-only remote: one card, copy-as-replayable-shell, no extra protocol fields. Loses separate stdout/stderr and exit codes (Pi also lacks those). |
| [21st-dev/1code](https://github.com/21st-dev/1code) `src/renderer/features/agents/ui/agent-bash-tool.tsx` | Header `Ran command: {first-words-of-pipeline}`. **Full command always visible** with a `$ ` prefix. stdout/stderr split. **Collapsed output = first 3 lines.** Expand is **inline**, not a modal. Success/fail from `exitCode === 0`. Shortens absolute project paths in the displayed command. | Best collapsed-preview numbers (3 lines). Path-shortening is unsafe here: content is already redacted; do not re-parse paths. Inline expand fights a virtualizer (see 1.6). Pi has `isError`, not `exitCode`. |
| [OpenHands/agent-canvas#1577](https://github.com/OpenHands/agent-canvas/pull/1577) | Truncated command panes get Expand/Collapse; copy of **full** output is preserved while collapsed. Shared `CodeBlock` primitive; `wrapLongLines` for results; `language="bash"` on both command and output. A large-output “skip highlight” guard was added, then **removed** so expanded logs stay highlighted. | Warns against duplicating highlight/truncate in the output pane. Highlighting huge logs on an iPhone is the failure mode they oscillated on. |
| [badlogic/pi-mono](https://github.com/badlogic/pi-mono) `packages/coding-agent/src/modes/interactive/components/bash-execution.ts` | The **same agent family** Pi Remote remotes. TUI card: `$ command` header, width-aware preview truncation, expand-all, status `running \| complete \| cancelled \| error`, optional `fullOutputPath` when truncated. | Host TUI already treats bash as a first-class card. Folding bash into Activity is a *regression* vs the agent the phone is driving. |
| [Q-Peppa/pi-collapse-tools](https://github.com/Q-Peppa/pi-collapse-tools) | Pi plugin: seven built-in tools collapse to **one line** (`ok` / `exit N` for bash). Expand via `Ctrl+O`. | Desktop TUI density. On iPhone the analog is a one-line summary + tap-to-open viewer, not a keyboard chord. |
| [aaif-goose/goose](https://github.com/block/goose) `ui/desktop/src/components/ToolCallWithResponse.tsx` + [#4253](https://github.com/block/goose/pull/4253) | **One bordered card = request + response.** Consecutive tool-only turns chain into `ToolCallChain` with a single timestamp; chaining **disabled while streaming** to avoid flicker. Labels truncated (~80 chars). MCP rich UI is a separate path. | Chaining = this repo’s Activity grouping, but Goose still renders a real tool card inside the chain. Activity-without-cards is the miss. Do not port Goose’s inline approval UI (this feature is read-only). |
| [vercel/ai-elements](https://github.com/vercel/ai-elements) [`Tool`](https://elements.ai-sdk.dev/components/tool) | Composable `ToolHeader` + `ToolInput` + `ToolOutput`. States: `input-streaming`, `input-available`, `output-available`, `output-error`, plus approval states. Docs say completed tools **auto-open**. | Status machine is reusable. Auto-open of completed tools is a desktop bias; LibreChat later reversed it for code (1.4). |
| [getmoshi.app Chat View](https://getmoshi.app/docs/chat-view) | Remote-CLI: transcript parsed into **compact tool cards**; **tap a card to expand**. Terminal remains the authority if a card is incomplete. | Honest fallback for a redacted protocol: card is a view, not a second source of truth. Pi’s “unsupported block” copy already matches this. |

**Cline** ([cline/cline](https://github.com/cline/cline)) uses `CodeAccordian` in the webview for command/edit bodies with language-based highlighting, and a newer `DiffEditRow` when “Background Edit” is on ([issue #7527](https://github.com/cline/cline/issues/7527)). Accordion-in-chat is the VS Code analog of Activity; it still shows a **code surface**, not a label-only disclosure.

### 1.3 Artifact cards + full-screen (the Claude/Kimi target, as actually implemented in OSS)

Claude iOS (this repo’s teardown) puts a **rounded ~16px in-flow card** in the turn: title, muted subtype (`Interactive artifact`), thumbnail, optional `1 artifact` pill above the turn ([`docs/design-reference/mobile-chat-apps/01-visual-teardown.md`](docs/design-reference/mobile-chat-apps/01-visual-teardown.md)). Mobbin’s Claude **web** surface is a split coding interface + code/preview toolbar ([Claude Web Coding Interface](https://mobbin.com/explore/screens/74973eed-0934-4bad-b8e8-504a3afe20b8), [Claude Web Code Preview](https://mobbin.com/explore/screens/1a33eaae-c123-4c39-82bc-e42df38209d3)). Claude **iOS** flows are chat-with-coding-input, not a desktop side panel ([coding-input flow](https://mobbin.com/explore/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b), [text-input flow](https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57)). **Do not copy the web side panel onto a 390pt PWA.**

OSS that already encoded that mobile rule:

- **[danny-avila/LibreChat](https://github.com/danny-avila/LibreChat) `ToolArtifactCard.tsx`** ([raw](https://raw.githubusercontent.com/danny-avila/LibreChat/main/client/src/components/Chat/Messages/Content/Parts/ToolArtifactCard.tsx), [PR #12961](https://github.com/danny-avila/LibreChat/pull/12961)): in-flow chip with title + “click to open”. **Code-only artifacts never auto-open** (even while streaming). Rich HTML/React/Markdown may auto-open **only** if the card mounted during the live stream; history / back-navigation must not steal focus. Duplicate file mentions are deduped so one chip wins. Docs advertise a **browser Fullscreen API** control that hides when fullscreen is unavailable ([LibreChat artifacts docs](https://www.librechat.ai/docs/features/artifacts)).
- **[chriswritescode-dev/opencode-manager#284](https://github.com/chriswritescode-dev/opencode-manager/pull/284)**: HTML artifacts use **side-panel on desktop, fullscreen sheet on mobile**. That split is the correct iPhone mapping.
- **Vercel AI Elements `CodeBlock`** ([source](https://github.com/vercel/ai-elements/blob/main/packages/elements/src/code-block.tsx), [docs](https://github.com/vercel/ai-elements/blob/main/skills/ai-elements/references/code-block.md)): Shiki `github-light` / `github-dark`, **raw tokens first** then async highlight, copy timeout **2000ms**, fails if `clipboard.writeText` is missing. **No expand/fullscreen in the primitive** — that is a separate overlay.

**iPhone constraint that kills LibreChat’s fullscreen control:** `Element.requestFullscreen()` is not a reliable iPhone API. It is iPad-oriented; iPhone support was experimental, then disabled; `display: fullscreen` in a web-app manifest **falls back to `standalone`** ([Apple Developer Forums](https://developer.apple.com/forums/thread/133248), [firt.dev iOS PWA notes](https://firt.dev/notes/pwa-ios), [MDN compat thread](https://github.com/mdn/browser-compat-data/issues/18440)). “Open full-screen” on this PWA **must** be a react-aria `Modal` filling `var(--visual-viewport-height)`, which React Aria already documents ([Modal](https://react-spectrum.adobe.com/react-aria/Modal.html): `max-height: calc(var(--visual-viewport-height) * 0.9)`). That is the F6-shaped shell this stack already owns.

### 1.4 Remote-CLI / mobile clients on GitHub (same job as Pi Remote)

These are the actual category peers (phone → private host agent). They split into **terminal-faithful** vs **chat-card** — Pi Remote is choosing the latter, but the former is the majority of this niche.

| Repo | What they render on the phone | Tradeoff |
|---|---|---|
| [eyalev/mobile-cc](https://github.com/eyalev/mobile-cc) | Installable PWA over Tailscale. Primary surface is a **real terminal** (`ttyview`). Optional “chat-style transcript” is **plain text from JSONL** — no Command/Output cards. | Same network story as Pi Remote. Their chat view is what Pi Remote already is. Cards are the delta. |
| [Epsilondelta-ai/rico](https://github.com/Epsilondelta-ai/rico) | Svelte PWA + Go bridge, Tailscale, tested on iOS Safari Add to Home Screen. File browser + session list. | File browser is **out of scope** (no host-filesystem reads). Chat is not the Claude-card model. |
| [Arose-Niazi/claude-remote-controller](https://github.com/Arose-Niazi/claude-remote-controller) | React PWA: **live chat** with markdown, code blocks, tool calls; TTY mode + mobile keys bar as escape hatch; file links downloadable. | Closest product copy. Downloadable file links violate this feature’s read-only / no-FS rule — omit them. Dual compose vs TTY is a minority idea (section 3). |
| [sohampawar1866/claude-remote-runner](https://github.com/sohampawar1866/claude-remote-runner) | PWA **xterm.js** over WebRTC. Faithful TUI, not cards. | Opposite of the desired result. Keep as the “if cards lie, show raw” rationale, not the UI. |
| [JerseyBro/cc-pocket](https://github.com/JerseyBro/cc-pocket) | Native Compose Multiplatform (App Store). Line-level diffs, **select and copy diff text**, tap path to open, **long-press path → copy full value**. | Native copy/long-press is the iOS-grade bar. A PWA cannot match UIPasteboard chrome; it must use a 44pt Copy + a working clipboard fallback (1.5). Path-open is a FS read — skip. |
| Moshi ([docs](https://getmoshi.app/docs/chat-view)) | SSH to host, parse agent transcript into cards, tap to expand, terminal always available. | Best remote-CLI UX doctrine: **cards are a projection**. Pi already redacts; never imply the card is complete. |

OpenCode’s own web app is adding PWA installability ([#19174](https://github.com/anomalyco/opencode/issues/19174), [#19173](https://github.com/anomalyco/opencode/pull/19173)) and still treats bash as a **console card with copy**, not an Activity dump. Their open issue to **copy as markdown, not flattened text** ([#14041](https://github.com/anomalyco/opencode/issues/14041)) applies: a Copy on a highlighted `<pre>` must write the **source string**, not the rendered spans.

### 1.5 iPhone clipboard, targets, sheets (non-negotiable for Copy)

- Apple HIG: **44×44 pt** minimum hit target ([Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons), [UI Design Dos and Don’ts](https://developer.apple.com/design/tips/)). WCAG 2.2 AA 2.5.8 is only **24×24 CSS px** ([Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)). On this iPhone PWA, Copy / Expand must be **44pt**, not 24px icon buttons.
- `clipboard.writeText` requires a **secure context** (Tailscale HTTPS already) and a **fresh user gesture**. Any `await` *other than* `writeText` between tap and copy can void iOS activation ([clipboard writeText failure modes](https://juanchi.dev/en/blog/clipboard-api-typescript-fails-undocumented-cases-copytext), [Web Share copy fallback ladder](https://www.webshareapi.com/permission-flows-progressive-enhancement/copy-to-clipboard-fallback-patterns/)).
- iOS `execCommand('copy')` fallback: visible (not `display:none`) textarea, **`readonly`**, **`font-size: 12pt`** (prevents auto-zoom), `focus()` + `setSelectionRange(0, length)` ([github/gh-aw#2339](https://github.com/github/gh-aw/pull/2339)).
- OpenCode’s `onMouseDown preventDefault` on the copy control is the known way to avoid iOS focus-stealing before `writeText`.
- Current `AssistantActions` already capability-gates Copy and uses a 1500ms “Copied” label — keep that pattern, align timeout with OpenCode/Vercel at **2000ms**, and **stop swallowing** clipboard rejection (announce failure).

### 1.6 Virtualizer vs inline expand (why the viewer must be a modal)

1code and OpenHands expand **inline**. This list uses `useVirtualizer` + `measureElement`. Expanding a 4k-line bash log inside a virtual row:

- forces a full remeasure of that row and neighbors,
- can unmount off-screen expanded state (`overscan: 6`),
- janks the live-edge autoscroll (`nearBottom` threshold 96px in `App.tsx`).

OpenHands originally truncated *because* long output made the message view unusable ([#1577](https://github.com/OpenHands/agent-canvas/pull/1577)). On a phone, the prior-art that survives is: **3-line preview in the flow + full body in a Modal** (opencode-manager mobile sheet, Moshi tap-to-expand, LibreChat click-to-open). That is also how to “reuse the F6 viewer shell”: one `Modal`/`Dialog` hosted at the session root, parameterized by `{title, subtitle, language, text, copyPayload}` — used by bash, fenced code, long-text artifacts, and later diffs.

### 1.7 What not to import from prior art

- **Shiki as a default for bash output.** Vercel uses it for *code*; OpenHands applied it to logs then argued with themselves. `@pi-remote/web` currently has zero highlighter. Highlight **fenced code ≤ a budget**; never highlight command output.
- **Auto-open panels** (AI Elements “completed tools open by default”, LibreChat rich-preview auto-open). On a 390pt chat with a composer island, auto-open covers the answer. LibreChat’s own later rule: **code is click-to-open**.
- **Browser Fullscreen API** (LibreChat). Dead on iPhone.
- **Host file preview / download** (rico, claude-remote-controller, cc-pocket, opencode-manager CSP file server). Forbidden here.
- **Green-on-black terminal chrome** (xterm clients). Conflicts with the locked ink-on-parchment system. Reuse `file_diff` card language (hairline, near-canvas fill, Inter mono inside).
- **Goose/Cline approval chrome.** This feature is read-only over already-redacted blocks.

---

## 2. Concrete spec a build phase can execute

### 2.0 Protocol / data (read-only; fail closed)

1. **Plumb `callId`** from the projector’s existing `toolCallKeys` onto `ToolCallBlock` and `ToolResultBlock`. Pairing by `toolName` adjacency is how cards will desync when two `bash` calls overlap. This is a DTO field, not a new mutation.
2. Do **not** add `exitCode`, stdout/stderr, language, or filesystem paths unless the host already sends them. Map `tool_result.isError` → card status `error`; else `ok`. Streaming call without result → `running`.
3. **Bash family** (promote out of Activity, like `file_diff`): `toolName` case-insensitive in `{bash, shell, terminal, execute_bash, run_command}`. All other successful tools stay in Activity.
4. **No new RPC.** Cards render `inputSummary` and `output` as already redacted. Copy writes those strings verbatim (OpenCode #14041).
5. **Strip ANSI** on display and copy (`strip-ansi` as OpenCode does) so a paste into Notes is not `^[[32m`.

### 2.1 Three in-flow components (same card chrome as `file_diff`)

Shared chrome: radius 16px, hairline border, fill `--surface` / bone, Inter 13–14px mono body, header Inter medium, clay used only on the expand glyph. Dark: invert to carbon surface, keep clay.

#### A. `BashCard` (paired `tool_call` + `tool_result`)

**Collapsed (default)**

```
┌─────────────────────────────────────────┐
│  ⌁  bash     ok|failed|running     ↗ ⧉ │  ← 44pt Copy, 44pt Expand
│  $ git status --short                   │  ← full command, wrap, max 3 lines
│  M apps/pi-remote-web/src/App.tsx       │  ← first 3 lines of output
│  … 42 more lines                        │  ← only if truncated
└─────────────────────────────────────────┘
```

- Header label = `toolName` (not “Tool call ·”). Status text, not color-only (WCAG).
- Command always shown in full if ≤ 3 visual lines; else 3 lines + “Expand”.
- Output preview = **3 lines** (1code). Trailing “N more lines” is a button (same as Expand).
- `running`: shimmer/pulse on header label (OpenCode `TextShimmer`); no fake exit status.
- `error`: keep **promoted** (already true for `isError`); use existing `.error-output` token, not clay.
- Copy copies `` `$ ${command}\n\n${output}` `` (OpenCode). `aria-label="Copy command and output"`.
- Expand opens the F6 modal with two sections (Command, Output). Do **not** expand inline inside the virtualizer.

**States:** `running` | `ok` | `error` | `truncated-preview` | `copied` (2s) | `copy-failed`.

#### B. `CodeFenceCard` (assistant `text` containing GFM fences)

- Parse fences client-side on already-rendered `block.text`. Unfenced prose stays serif.
- Card header: language id or `Code`. Actions: Copy (source inside fence only), Expand.
- Body: first **12 lines** or **40vh**, whichever is smaller; then “Expand”.
- Highlight only if `code.length ≤ 20_000` **and** language ∈ a small allowlist (`ts, tsx, js, json, css, html, python, rust, go, bash, diff, markdown, text`). Else monospace, no highlighter. **Never** highlight bash *output* cards.
- If a highlighter is added: Vercel’s **raw-tokens-then-Shiki** pattern so streaming fences don’t blank. Prefer not shipping full Shiki WASM on first paint; lazy-import on first fenced block.
- Copy: fence inner text, not highlighted HTML. `aria-label="Copy TypeScript code"` (language in the name).

#### C. `ArtifactCard` (long text / goal-prompt)

Trigger (any one):

- user `text` with `length ≥ 600` **or** `lineCount ≥ 12`, **or**
- assistant `text` with **no** fences and `length ≥ 1200` / `lineCount ≥ 24`, **or**
- explicit title line matching `/^(Goal|Prompt|Spec|Plan):/i` on user text.

Collapsed:

```
┌─────────────────────────────────────────┐
│  Goal / Prompt              ↗ ⧉         │
│  First 3 lines of preview…              │
│  1,248 characters                       │
└─────────────────────────────────────────┘
```

- Title: `Goal / Prompt` for user, `Note` for assistant long-prose. Subtitle = character count, not a fake “Interactive artifact”.
- Copy = full `block.text`. Expand = F6 modal, serif for prose, mono if it was a fence.
- **Never auto-open** (LibreChat code-only rule). History scroll must not steal focus.
- At most **one** artifact chip per block (LibreChat claim-winner). Do not also render the full prose underneath; keep a 3-line preview so VoiceOver still has context.

`file_diff` stays its own card; add Copy + Expand to it in the same pass (cc-pocket: copy diff text). Do not merge diffs into bash cards.

### 2.2 F6 viewer shell (react-aria `Modal` + `Dialog`, session-root)

Not `element.requestFullscreen()`. One overlay:

- `Modal` `isDismissable` + `Dialog` with `Heading slot="title"`.
- Overlay: `position: fixed; inset: 0; padding: env(safe-area-inset-*); height: var(--visual-viewport-height)` (React Aria’s own CSS; matches iOS keyboard resize).
- Panel: 100% width, `max-height: 100%`, bone fill, **no** drag-handle (HIG: drag handles are for pickers, not document viewers — PWA modal playbook: center/cover, not a 50% sheet that hides output).
- Header (44pt row): close `×` (left, HIG back/close), title + truncated subtitle, Copy (right). Sticky; body scrolls underneath (`-webkit-overflow-scrolling: touch`; `overscroll-behavior: contain` so it doesn’t chain to the transcript).
- Body: `pre`/`code` for bash and fences; Source Serif for prose artifacts. Horizontal scroll allowed for code; wrap for bash output (`wrapLongLines` from OpenHands).
- Bash modal sections: **Command** then **Output**, both copyable via the header Copy (combined) **and** optional per-section 44pt copies.
- Focus: trap inside Dialog; restore to the Expand control. Escape / overlay tap closes. `aria-modal="true"`.
- Live region (reuse transcript `aria-live="polite"`): `{Title} copied` / `Couldn’t copy`.
- Reduced motion: skip enter/exit animation if `prefers-reduced-motion: reduce`. Default: React Aria 200ms enter / 150ms exit fade, **not** a 100% `translateY` sheet race against `visualViewport`.

Wire `TranscriptList` so only **one** viewer is open. Opening it must **not** change `atLiveEdge` / autoscroll.

### 2.3 Gestures (iPhone)

| Control | Gesture | Result |
|---|---|---|
| Expand (↗) / preview / “N more lines” | Tap | Open F6 modal |
| Copy (⧉) | Tap | Copy payload; 2s `Copied`; fail → live-region |
| Card body (non-button) | Tap | Same as Expand if truncated; else no-op (avoid accidental copies) |
| Modal body | Vertical pan | Scroll content only |
| Modal | Two-finger pinch | **Do not** implement custom zoom; iOS selection zoom is enough |
| Modal | System back / Escape / header × / overlay tap | Close |
| Text | Long-press | Native iOS selection (do not `user-select: none` on `pre`) |
| Copy control | `pointerdown` `preventDefault` | Keep user activation (OpenCode) |

No swipe-to-dismiss on the document viewer (easy to lose place in a 2k-line log). No double-tap expand.

### 2.4 Accessibility

- Every icon button has a **verb + object** name: `Copy command and output`, `Open command output full screen`, `Copy Python code`, `Close viewer`.
- Status is text (`ok` / `failed` / `running`), not color alone. Error cards remain outside Activity.
- 44×44 pt targets; 4.5:1 carbon-on-bone (and dark inverse) for body and buttons (WCAG AA).
- `pre` has `tabIndex={0}` only inside the modal (so VoiceOver can enter the block); in-flow cards do not put a focusable `pre` in the transcript tab loop.
- Copy success is **not** only a checkmark: toggle accessible name to `Copied` (existing `AssistantActions` pattern).
- Do not put `aria-label` on a button that already has visible text (OpenHands review of #1577).
- Activity summary stays for non-bash tools: `Worked · N tools` must **exclude** promoted bash cards so the count stays honest.

### 2.5 Motion / visual (ink-on-parchment)

- In-flow cards: no entrance animation (virtualizer). Copied glyph: swap icon, 2s, no scale bounce if reduced motion.
- Modal: fade overlay 200ms; panel opacity 0→1 (no full-height slide).
- `$ ` prompt: carbon ink, not green. Failed output: existing error token. Clay: expand icon only.
- Match Claude iOS artifact geometry from the teardown (~16px radius, hairline, title + muted subtitle). No tilted thumbnail unless a local glyph exists; a 16px Inter `</>` or `$` is enough (honesty over mimicry).

### 2.6 Implementation seams in *this* stack

1. `groupTranscript`: stop treating bash-family `tool_call` / matching `tool_result` as `isEvidenceBlock`. Emit a `kind: 'bash'` render item when `callId` matches.
2. `Block` for `text`: markdown-lite (paragraphs + fences only). Do not take a full markdown stack in this phase.
3. Extract `copyText(text): Promise<'ok'|'denied'|'missing'>` shared with `AssistantActions`, with iOS textarea fallback.
4. `ContentViewer` at `Session` level (react-aria `Modal`). Pass payload in; do not clone DOM from the card.
5. Tests: extend `App.test.tsx` / `turns.test.tsx` — bash pair not inside Activity; Copy writes exact payload; modal open/close; error bash still promoted; fenced copy does not include backticks; virtualizer does not expand inline.

---

## 3. Divergent / minority ideas (resist converging)

1. **Terminal-authoritative dual view** (mobile-cc, Moshi, claude-remote-runner): keep Activity as-is and add a “Raw TTY” tab that is a read-only `<pre>` of the same redacted stream. Cards can lie; raw cannot. Minority vs Claude-parity, majority vs remote-CLI GitHub.
2. **Keep bash *inside* Activity**, but when the disclosure opens, render `BashCard` instead of bare `<pre>`. Lowest-risk vs the current grouping; loses Claude’s “artifact in the turn” prominence.
3. **No highlighter at all this phase.** OpenCode’s bash card is unhighlighted `<pre><code>`. Ship Copy + modal first; syntax is a second PR. Avoids Shiki/WASM on a Tailscale PWA.
4. **Three copy payloads** on bash: Command / Output / Both as a segmented control in the modal. OpenCode only does Both; 1code shows them separately but copies nothing in the snippet. Useful when pasting a command into another session.
5. **Copy as Markdown** (OpenCode #14041): `` ```bash\n$ cmd\n\noutput\n``` `` vs plain. Better for Obsidian; worse for a shell. Could be a long-press menu if a menu is ever added — not a second visible button (44pt budget).
6. **User-gesture Share** for artifacts (`navigator.share({ text })`), already used on answers. iOS share sheet is more native than Copy for long prompts. Do not share files.
7. **Horizontal Command | Output tabs** in the modal (classic terminal inspectors). Better for 10k-line output; worse than Claude’s single scroll. Consider only if output often dwarfs the command.
8. **Virtualize the modal body** (second `useVirtualizer` on lines) instead of one `<pre>`. Prior art for huge logs (pi-mono width-aware truncation, OpenHands truncate-by-default). Heavier to a11y (VoiceOver + virtual windows).
9. **Do not parse fences.** Only upgrade `tool_*` and `file_diff`. Assistant prose stays plain until a markdown phase. Avoids false-positive fences in diffs pasted as text.
10. **50% sheet instead of full-viewport modal** (HIG sheets for pickers). Rejected for logs by the PWA-modal playbook, but a 92% height card with a visible chat peek would preserve turn context. Test on 390×844 before locking full-bleed.
11. **Long-press-only copy** (cc-pocket paths). More iOS-native, invisible to VoiceOver unless also a button. Do not replace the 44pt control.
12. **Promote *all* tools** to Goose-style `ToolCallWithResponse` cards, not just bash. Closer to AI Elements; noisier than Claude iOS, which hides routine tools. Conflicts with the existing Activity doctrine.

---

## 4. Open questions + risks

1. **`callId` on the display DTO** — projector has it; UI types do not. Without it, pairing two `bash` calls in one turn will attach the wrong output. Confirm whether adding a field is in-scope for this read-only feature (it is still a protocol/DTO change, not a mutation).
2. **`inputSummary` fidelity** — `summarizeJson` stringifies args. If bash args are `{command: "..."}`, the card must unwrap `.command` when present; otherwise the user copies JSON, not a shell line. Verify live redacted payloads before locking the `$ ` prefix.
3. **ANSI / wrap / CJK width** — pi-mono truncates by visual width; 1code truncates by lines. Pick lines (3) for v1; wide `git diff` lines will look worse.
4. **Highlighter budget vs PWA size** — Shiki is what Vercel/OpenHands use; it is also the jank vector on large logs. Decide allowlist + lazy import, or ship unhighlighted v1 (idea 3).
5. **Virtualizer + markdown split** — turning one `text` block into N cards (prose + N fences + artifact) changes `renderItems.length` and scroll anchors. Need a stable `id` per fence (`${block.id}:fence:${i}`) so measureElement does not jump the live edge.
6. **Clipboard failures in standalone PWA** — iOS standalone has a separate cookie/storage jar ([firt.dev](https://firt.dev/notes/pwa-ios)); clipboard usually still works on gesture, but the current `.catch(() => undefined)` will hide a real standalone bug. Must surface `copy-failed`.
7. **F6 shell does not exist as a named component in this repo.** The executable analog is react-aria `Modal`/`Dialog` + `--visual-viewport-height`. If a spec-kit “F6” already defines tokens/motion, this overlay must consume it rather than forking a second modal.
8. **Auto-open temptation during streaming** — LibreChat needed years of Recoil to stop focus-stealing. Hard-rule: viewer opens only from a user tap.
9. **Activity count honesty** — promoting bash without updating `activitySummary` will show `Worked · 3 tools` when the user already sees three bash cards. Off-by-N is a visible lie.
10. **Kimi Code** is closed-source; this pass used the local teardown + Claude Mobbin, not a Kimi GitHub client. Do not invent Kimi-specific chrome without a screenshot in `docs/design-reference/mobile-chat-apps/screens/`.
11. **Mobbin MCP** in this environment is registered but **OAuth-pending**; screen URLs above are public Mobbin pages, not authenticated MCP hits. Treat layout numbers as corroboration of the local teardown, not as new pixel measurements.

---

## 5. Sources

### GitHub — coding-agent chat UIs

- https://github.com/anomalyco/opencode/blob/7daea69e/packages/ui/src/components/message-part.tsx
- https://github.com/anomalyco/opencode/issues/14041
- https://github.com/anomalyco/opencode/issues/19174
- https://github.com/anomalyco/opencode/pull/19173
- https://github.com/21st-dev/1code/blob/main/src/renderer/features/agents/ui/agent-bash-tool.tsx
- https://github.com/OpenHands/agent-canvas/pull/1577
- https://github.com/OpenHands/agent-canvas
- https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/src/modes/interactive/components/bash-execution.ts
- https://github.com/Q-Peppa/pi-collapse-tools
- https://github.com/block/goose
- https://github.com/block/goose/blob/e94f3047/ui/desktop/src/components/ToolCallWithResponse.tsx
- https://github.com/block/goose/pull/4253
- https://github.com/vercel/ai-elements
- https://github.com/vercel/ai-elements/blob/main/packages/elements/src/code-block.tsx
- https://github.com/vercel/ai-elements/blob/main/skills/ai-elements/references/code-block.md
- https://elements.ai-sdk.dev/components/tool
- https://github.com/danny-avila/LibreChat
- https://github.com/danny-avila/LibreChat/blob/main/client/src/components/Chat/Messages/Content/Parts/ToolArtifactCard.tsx
- https://github.com/danny-avila/LibreChat/pull/12961
- https://www.librechat.ai/docs/features/artifacts
- https://github.com/chriswritescode-dev/opencode-manager/pull/284
- https://github.com/cline/cline
- https://github.com/cline/cline/issues/7527
- https://github.com/continuedev/continue/blob/cb273098/extensions/cli/src/tools/index.tsx

### GitHub — remote-CLI / mobile clients

- https://github.com/eyalev/mobile-cc
- https://github.com/Epsilondelta-ai/rico
- https://github.com/Arose-Niazi/claude-remote-controller
- https://github.com/sohampawar1866/claude-remote-runner
- https://github.com/JerseyBro/cc-pocket
- https://getmoshi.app/docs/chat-view
- https://github.com/ttyview/ttyview (upstream of mobile-cc)

### Mobbin

- https://mobbin.com/explore/screens/74973eed-0934-4bad-b8e8-504a3afe20b8 (Claude Web coding interface)
- https://mobbin.com/explore/screens/1a33eaae-c123-4c39-82bc-e42df38209d3 (Claude Web code preview)
- https://mobbin.com/explore/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b (Claude iOS chatting, coding input)
- https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57 (Claude iOS chatting, text input)
- https://mobbin.com/explore/screens/c176ae9f-5a25-45b6-acda-5620364105df (ChatGPT iOS chat interface)

### Apple HIG / iOS PWA / a11y / clipboard

- https://developer.apple.com/design/human-interface-guidelines/sheets
- https://developer.apple.com/design/human-interface-guidelines/buttons
- https://developer.apple.com/design/tips/
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://react-spectrum.adobe.com/react-aria/Modal.html
- https://developer.apple.com/forums/thread/133248
- https://firt.dev/notes/pwa-ios
- https://github.com/mdn/browser-compat-data/issues/18440
- https://github.com/github/gh-aw/pull/2339
- https://www.webshareapi.com/permission-flows-progressive-enhancement/copy-to-clipboard-fallback-patterns/
- https://juanchi.dev/en/blog/clipboard-api-typescript-fails-undocumented-cases-copytext

### This repo (current surface)

- `apps/pi-remote-web/src/App.tsx` (`TranscriptList`, `ActivityGroup`, `Block`, `AssistantActions`, `DiffPatch`)
- `apps/pi-remote-web/package.json`
- `packages/pi-rpc-protocol/src/types.ts`
- `apps/pi-remote-relay/src/store/transcript-projector.ts`
- `docs/design-reference/mobile-chat-apps/01-visual-teardown.md`
- `docs/design-reference/mobile-chat-apps/02-current-ui-map.md`
