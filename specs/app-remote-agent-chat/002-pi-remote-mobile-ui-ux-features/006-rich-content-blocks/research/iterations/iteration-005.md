<!-- provenance: external-CLI orchestration pass; original file iter-05-sol.md -->
> **Source pass 5** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-5-sol.md`.

<!-- F7-rich-content-blocks | model=sol | lens=react-implementation | iter 5/10 | 2026-08-16T04:29:19.140Z -->

# 1. Findings for the react-implementation lens

## 1.1 Treat rich blocks as transcript projections, not new capabilities

Introduce a pure normalization layer between the already-redacted transcript and React:

```ts
type RichBlock =
  | {
      kind: "command";
      id: string;
      command: string;
      output?: string;
      cwd?: string;
      exitCode?: number;
      phase: "running" | "complete" | "failed" | "unknown";
      truncated?: boolean;
    }
  | {
      kind: "code";
      id: string;
      code: string;
      language: string;
      label?: string;
      phase: "streaming" | "settled";
    }
  | {
      kind: "artifact";
      id: string;
      text: string;
      label: "Prompt" | "Goal" | "Text";
      format: "plain" | "markdown";
    };
```

The normalizer should receive only redacted strings already present in transcript events. It must not accept filesystem paths, lazy loaders, URLs that fetch content, or callbacks capable of requesting host data. Pair `tool_call` and `tool_result` using their protocol identity, never by command text or adjacency; coding-agent transcripts can contain concurrent or delayed results. Kimi’s implementation explicitly treats foreground Bash output as a stream into a single running tool card, which supports this identity-based model rather than independent call/result rows ([Kimi tool reference](https://github.com/MoonshotAI/kimi-code/blob/main/docs/en/reference/tools.md)).

If the WebSocket/session store lives outside React, subscribe through `useSyncExternalStore`. React documents it specifically for stores and browser APIs that can change independently of React ([React `useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore)). Preserve immutable snapshots so old transcript blocks retain referential identity, wrap settled cards in `React.memo`, and allow only the currently streaming block to rerender.

Use stable keys such as `toolCallId` or `messageId:blockIndex`. Never key by block content: streaming would change the key on every chunk, remount disclosures, lose scroll position, and recreate the full-screen trigger.

## 1.2 Separate disclosure, copy, and full-screen actions

Do not make the entire card a button. A whole-card trigger prevents reliable text selection and leads to invalid nested interactions once Copy and Open controls are added.

Use this anatomy:

```tsx
<Disclosure>
  <div className="flex min-w-0 items-center">
    <Heading className="min-w-0 flex-1">
      <Button slot="trigger">Command and status</Button>
    </Heading>
    <Button aria-label="Copy command">Copy</Button>
    <Button aria-label="Open command and output full screen">Open</Button>
  </div>
  <DisclosurePanel>{/* output */}</DisclosurePanel>
</Disclosure>
```

React Aria explicitly supports buttons adjacent to a disclosure heading and warns that the heading and disclosure trigger must not contain interactive children. It also supplies `isExpanded`, `onExpandedChange`, `[data-expanded]`, and measured panel dimensions ([React Aria Disclosure](https://react-aria.adobe.com/Disclosure)).

Use React Aria `Button`, not a styled `div`, for every action. React Aria normalizes pointer, touch, keyboard, pressed, and focus-visible behavior, exposing states for Tailwind selectors ([React Aria Button](https://react-aria.adobe.com/Button)). Tailwind 4 can target React Aria’s boolean data attributes directly, for example `data-pressed:bg-…` and `data-focus-visible:ring-…` ([Tailwind state variants](https://tailwindcss.com/docs/hover-focus-and-other-states)).

## 1.3 Reuse the F6 viewer shell as the only overlay implementation

Expose a content adapter rather than cloning a modal per block:

```ts
type ViewerPayload = {
  id: string;
  title: string;
  kind: "command" | "code" | "artifact";
  copyText: string;
  content: ReactNode;
};
```

The F6 shell should own `DialogTrigger`, controlled open state, focus restoration, scroll locking, safe-area padding, and close behavior. React Aria’s `ModalOverlay`/`Modal`/`Dialog` combination blocks background interaction and exposes `--visual-viewport-height` and `--visual-viewport-width`, specifically to account for mobile visible-viewport changes ([React Aria Modal](https://react-aria.adobe.com/Modal)).

For a long structured document, give the visible viewer title `tabIndex={-1}` and focus it when the view opens. Do not set `aria-describedby` to the entire code or artifact. WAI recommends focusing a static heading at the beginning of large structured dialogs, trapping `Tab` within the dialog, supporting `Escape`, providing a visible close button, and restoring focus to the invoking control ([WAI modal-dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)).

## 1.4 Syntax highlighting must be asynchronous, bounded, and safe

Use Shiki through a dedicated worker:

- `shiki/core`
- `shiki/engine/javascript`
- an explicit language allow-list
- one light and one dark theme
- `codeToTokens`, rendered as React text spans

Do not use `codeToHtml` plus `dangerouslySetInnerHTML`. Tokens provide the highlighting without introducing an HTML-injection boundary. Shiki recommends fine-grained bundles for browser and performance-sensitive applications; its full and web bundles are approximately 1.2 MB and 695 KB gzip respectively ([Shiki bundles](https://shiki.style/guide/bundles)). Shiki also recommends the JavaScript engine for smaller browser bundles and faster startup, and recommends workers because highlighting regexes can be CPU-intensive ([Shiki performance guidance](https://shiki.style/guide/best-performance)).

Implementation rules:

- While a fenced block is streaming, render escaped plain monospace text.
- Highlight after the block settles; do not retokenize on every streamed token.
- Cache by `language + theme-pair + content-hash`.
- Attach a monotonically increasing request ID so stale worker responses cannot replace newer content.
- Above 20,000 characters or 1,000 lines, render plain code rather than thousands of token spans.
- Unknown language identifiers map to `text`; Shiki provides plain-text fallback explicitly ([Shiki languages](https://shiki.style/languages)).
- Precache the worker and selected grammars in the PWA service worker. If loading fails offline, retain readable plain code rather than a spinner.

Kimi provides direct prior-art warnings: its web client moved Mermaid and KaTeX parsing into workers, fixed tool-card height flicker during streaming, fixed expansion-induced conversation jumps, disabled code ligatures, and fixed nested code blocks that rendered blank ([Kimi Code changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)). Happy, an open-source mobile/web Codex and Claude client, has also shipped a code-block Copy button and Markdown rendering ([Happy releases](https://github.com/slopus/happy/releases)).

## 1.5 Copy must remain inside the initiating gesture

Create one `useCopyFeedback` hook for all three card types:

```ts
type CopyState = "idle" | "copying" | "copied" | "failed";
```

The `Button`’s `onPress` handler must call `navigator.clipboard.writeText(redactedText)` before any dynamic import, timeout, or unrelated `await`. WebKit rejects clipboard writes outside a user gesture and exposes the API only in secure contexts ([WebKit Async Clipboard API](https://webkit.org/blog/10855/async-clipboard-api/); [MDN `writeText`](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText)).

Provide a synchronous best-effort fallback using a temporary readonly textarea, selection, and the legacy copy command for private-tailnet origins that are still served over HTTP. Do not display “Copied” unless either path reports success. Kimi’s changelog records a dedicated fix for copy actions served over plain HTTP, showing that this is a real remote-agent deployment failure mode rather than a theoretical edge case ([Kimi Code changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)).

Copy the canonical redacted source string, not `textContent`, which may include labels, line numbers, truncation marks, or hidden accessibility text. Keep the control’s accessible name stable—“Copy Python code”, for example—and publish “Python code copied” through a shared `role="status"` region. WCAG requires non-focus-taking status messages to be programmatically exposed ([WCAG 2.2 §4.1.3](https://www.w3.org/TR/WCAG22/); [WAI `role=status` example](https://www.w3.org/WAI/WCAG22/working-examples/aria-role-status-searchresults/)).

React Aria’s `useClipboard` is useful if an entire focused block should support keyboard `⌘C`, but it is not a replacement for the explicit Copy button ([React Aria `useClipboard`](https://react-aria.adobe.com/useClipboard)).

## 1.6 Markdown is still untrusted content

For text artifacts, use `react-markdown` with CommonMark/GFM support, but:

- do not enable `rehype-raw`;
- do not render remote images;
- restrict links to the existing safe-navigation policy;
- route fenced code to `CodeArtifactCard`;
- render unsupported HTML as escaped text;
- cap parser input and process exceptional payloads in the worker.

The remark maintainers warn that malformed or extremely large Markdown can create both XSS and denial-of-service problems and recommend size caps and worker processing ([remark security guidance](https://github.com/remarkjs/remark)). If any existing pipeline turns raw HTML into HAST, place `rehype-sanitize` after the last unsafe transformation; its defaults are safe, but an improperly broadened schema can reopen XSS ([rehype-sanitize](https://github.com/rehypejs/rehype-sanitize)).

This matters even though the transcript is redacted: redaction removes sensitive strings, not executable markup.

## 1.7 iPhone full-screen layout needs two viewport systems

Set:

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1,viewport-fit=cover"
/>
```

The shell should use:

```css
.viewer-overlay {
  height: 100dvh;
  height: var(--visual-viewport-height);
}

.viewer-surface {
  padding-block-start: max(12px, env(safe-area-inset-top));
  padding-block-end: max(12px, env(safe-area-inset-bottom));
  padding-inline: max(12px, env(safe-area-inset-left))
                  max(12px, env(safe-area-inset-right));
}
```

`viewport-fit=cover` makes edge-to-edge presentation possible, while `env(safe-area-inset-*)` prevents controls from colliding with the sensor housing, rounded corners, and Home indicator ([WebKit safe-area guidance](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)). Safari has supported dynamic viewport units since 15.4, and Tailwind 4 exposes `h-dvh`, but React Aria’s visual-viewport variable should win inside its overlay because it tracks the actual usable modal viewport ([WebKit viewport units](https://webkit.org/blog/12669/new-webkit-features-in-safari-15-5/); [Tailwind height utilities](https://tailwindcss.com/docs/height)).

Use a single internal scroll region: `min-h-0 overflow-y-auto overscroll-contain`. Avoid custom body `position: fixed` scroll locking, which commonly loses the transcript’s scroll position when restored.

## 1.8 Preserve selection and reflow

Gestures should be limited to:

- Tap disclosure trigger: expand/collapse.
- Tap Copy: copy.
- Tap Open: full-screen.
- Long press and drag: native text selection.
- Horizontal pan inside code only: inspect long lines.
- Pinch: browser zoom.

Do not add swipe-to-open, swipe-to-dismiss, double-tap, or long-press menus in the first build. Those gestures compete with iOS selection, code scrolling, pinch zoom, and system edge navigation.

Code may use `whitespace-pre overflow-x-auto`; formatting is part of its meaning. Command output and text artifacts should use `whitespace-pre-wrap wrap-anywhere`, containing horizontal scrolling to the code region. WCAG requires ordinary text to reflow at 320 CSS pixels but permits sections whose two-dimensional layout is necessary for meaning ([WCAG reflow guidance](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html)). Tailwind provides the required `whitespace-pre-wrap` and `wrap-anywhere` utilities ([Tailwind white-space](https://tailwindcss.com/docs/white-space); [Tailwind overflow-wrap](https://tailwindcss.com/docs/overflow-wrap)).

All controls need at least a 44×44 CSS-pixel hit region and a visible pressed state. Apple recommends a 44×44-point hit region and explicitly requires feedback for custom pressed states ([Apple HIG Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)).

## 1.9 Prior art supports semantic cards over terminal emulation

Relevant open-source mobile clients include:

- [Happy](https://github.com/slopus/happy): mobile/web Codex and Claude client with formatted Markdown and code-copy support.
- [Kimi Code](https://github.com/MoonshotAI/kimi-code): tool cards, streaming Bash output, browser UI, workers, and explicit mobile Safari fixes.
- [MobileCLI](https://github.com/MobileCLI/mobilecli): iOS remote client that distinguishes tool calls, approvals, terminal output, and sessions.
- [Claude Code UI](https://github.com/TeamADAPT/claude-code-ui): responsive chat, shell, file viewer, and syntax-highlighted editor.
- [247 Claude Code Remote](https://github.com/QuivrHQ/247-claude-code-remote): mobile-first Tailscale-accessible PWA terminal.
- [OpenCodex](https://github.com/mjmkk/opencodex): native iPhone Codex/Claude client with chat, terminal, file browsing, and command approval.

The strongest implementation lesson is to retain structured tool identities and render semantic cards. Flattening everything into ANSI terminal text makes pairing, accessibility, copy boundaries, truncation, and full-screen rendering substantially harder.

Anthropic describes artifacts as content placed in a dedicated viewing window and confirms creation/viewing on iOS and Android, supporting the separate viewer model rather than merely enlarging transcript prose ([Anthropic Artifacts announcement](https://www.anthropic.com/news/artifacts)).

Mobbin’s authenticated screen library was unavailable during this pass, so no unverifiable screen-level assertion about Claude or Kimi is included. Mobbin documents that its screen search returns app names, images, and direct screen links when authenticated ([Mobbin API quick start](https://docs.mobbin.com/api/quickstart)).

# 2. Concrete spec contribution a build phase can execute

## 2.1 Component and hook inventory

| Component/hook | Responsibility |
|---|---|
| `normalizeTranscriptBlocks()` | Pure conversion from already-redacted transcript events to `RichBlock[]`; pairs calls/results by ID |
| `TranscriptRichBlock` | Exhaustive switch over block kind; unknown blocks fall back to existing prose/activity rendering |
| `RichBlockFrame` | Shared border, header, status, actions, and responsive spacing |
| `CommandOutputCard` | Command, output, execution state, output disclosure, separate copy actions |
| `CodeArtifactCard` | Language label, code preview, syntax tokens, Copy, Open |
| `TextArtifactCard` | Artifact label, serif preview, Copy, Open |
| `F6ViewerAdapter` | Converts each block to the existing F6 viewer-shell payload |
| `SafeMarkdown` | Restricted Markdown renderer; no raw HTML or remote images |
| `useCopyFeedback()` | Clipboard call, fallback, timeout, visible and screen-reader feedback |
| `useHighlightedCode()` | Worker request, cache lookup, stale-response guard, plain fallback |
| `useTranscriptSnapshot()` | `useSyncExternalStore` integration where the stream is external to React |

## 2.2 Classification rules

- Every recognized shell/Bash call becomes a `CommandOutputCard`.
- Every fenced code block becomes a `CodeArtifactCard`, including fences without a known language.
- Explicit goal/prompt transcript blocks always become `TextArtifactCard`.
- Ordinary assistant text remains serif prose below both 900 characters and 12 lines.
- Ordinary assistant text at or above either threshold becomes a text artifact.
- Do not infer “code” merely from punctuation or indentation.
- Unknown tool types remain within the quiet Activity disclosure.

These are deterministic presentation rules, not changes to transcript semantics.

## 2.3 Command/output states

| State | Presentation | Default expansion |
|---|---|---|
| Running, no output | Command visible; “Running” text plus non-color status glyph | Expanded |
| Running with output | Command plus live plain-text output; no syntax processing | Expanded unless user manually collapsed |
| Complete, ≤6 output lines | Full command and output visible | Expanded |
| Complete, >6 output lines | First 6 lines plus “N more lines” | Collapsed |
| Failed with exit code | “Failed · exit N”; final 12 lines available immediately | Expanded |
| Unknown result | “Finished · status unavailable” | Preserve current user state |
| Truncated | Visible “Output truncated by source” before the final line | Preserve current user state |
| Disconnected while running | “Connection lost; last received output shown” | Expanded |

Never infer success from output text. Use only explicit protocol status or exit code.

The command subsection has “Copy command”; the output subsection has “Copy output”. The card header has “Open”. If output is absent, omit its Copy control.

Once a user manually changes expansion, set a local override flag so incoming stream updates cannot reopen or recollapse the card.

## 2.4 Code-card states

- Header: language or “Code”, optional filename label already present in the transcript, Copy, Open.
- Preview: maximum 10 visual lines; use a bottom parchment fade only when more content exists.
- Streaming: escaped plain monospace text plus “Generating code”.
- Settled and highlightable: worker-generated tokens.
- Unknown language, worker failure, oversized block, or offline chunk failure: escaped plain code.
- Code uses `ui-monospace, SFMono-Regular, Menlo, monospace`, 13px/1.55, and `font-variant-ligatures: none`.
- `<pre tabIndex={0} aria-label="Python code, horizontally scrollable">` provides one keyboard-accessible scroll region. Token spans and optional line numbers are not separate accessibility nodes; line numbers, if added later, are `aria-hidden`.

Copy always returns the complete redacted code, not the ten-line preview.

## 2.5 Text-artifact states

- Header: “Prompt”, “Goal”, or “Text”; Copy; Open.
- Preview: maximum 8 lines with Source Serif 4 at 16px/1.55.
- Plain text preserves line breaks and wraps long tokens.
- Markdown supports paragraphs, headings, lists, emphasis, blockquotes, tables, links under the safe-link policy, and fenced code routed to `CodeArtifactCard`.
- Images, iframes, raw HTML, scripts, forms, audio, video, and embedded remote content are not rendered.
- Copy returns original redacted source text, including Markdown syntax.

## 2.6 Full-screen viewer

- Full viewport, no rounded floating sheet on iPhone.
- Sticky header with 44×44 Close at leading edge, truncated title in the center region, and 44px-high Copy at trailing edge.
- One scrollable content region below the header.
- Command viewer contains clearly labeled Command and Output sections.
- Code viewer preserves horizontal code scrolling inside the vertical viewer.
- Text viewer reflows without horizontal scrolling.
- Opening focuses the static title; closing restores focus to the exact Open button.
- `Escape` closes with a hardware keyboard.
- Background transcript is inert and cannot scroll.
- Do not dismiss from content taps. Any backdrop dismissal behavior from other F6 content types should be disabled for this full-screen variant.

## 2.7 Visual system

- Reuse only existing bone, carbon, clay, border, surface, and focus tokens.
- Card: 14px radius; 1px subtle ink border; parchment-derived surface; no drop shadow in the transcript.
- Full-screen viewer: bone background in light mode and the established dark parchment surface in dark mode.
- Carbon remains the text color. Clay is reserved for the focus ring, disclosure chevron, and small decorative/status accents unless a measured token combination passes 4.5:1 for normal text. WCAG AA requires 4.5:1 for normal text and 3:1 only for large text ([WCAG contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)).
- Status always includes text or an icon plus text; never color alone.
- Focus indicator: 2px visible ring with 2px offset in both themes.
- Header controls retain visible text labels at 320px. The title truncates before actions collapse into unlabeled icons.

## 2.8 Motion

- Transcript disclosure: no height tween. Reveal immediately with an optional 100ms opacity transition.
- Viewer enter: overlay opacity 0→1 over 160ms; content translateY 8px→0 over 180ms.
- Viewer exit: 120ms.
- Copy confirmation: visible for 1.5 seconds.
- Under `prefers-reduced-motion: reduce`, remove translation and reduce all fades to effectively instantaneous. The media query reflects the operating-system motion preference ([MDN reduced-motion guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)).

## 2.9 Pass/fail acceptance checks

| Requirement | Objective check |
|---|---|
| Read-only | Copy, disclosure, and viewer tests produce zero POST/PUT/PATCH/DELETE requests and zero outbound mutation WebSocket frames |
| No host reads | Opening every fixture block produces no new host/file API request |
| Redaction | A fixture containing a pre-redaction secret exposes only `[REDACTED]` in the DOM, accessibility tree, copied text, worker messages, and caches |
| Pairing | Out-of-order tool results attach only to their matching `toolCallId` |
| Streaming stability | Existing card DOM nodes and expansion state survive 100 appended output chunks |
| Clipboard | Under HTTPS, one press copies exact source text; under HTTP, fallback succeeds or presents “Couldn’t copy—select the text manually”; false success is forbidden |
| Full-screen focus | Open focuses viewer title; Tab cannot leave the viewer; Escape/Close restores focus to its trigger |
| Touch | Every interactive control has a computed hit box of at least 44×44 CSS px |
| Reflow | At 320 CSS px, prose/artifacts have no page-level horizontal overflow; only code regions may scroll horizontally |
| Dark/light | Axe and automated contrast checks pass both themes; no semantic state depends on color alone |
| Reduced motion | With reduced motion enabled, no transform animation runs |
| Large blocks | A 100 KB or 2,000-line code fixture opens without syntax-token DOM explosion and remains copyable in full |
| Offline | After installation/precache, airplane-mode opening works; missing highlighter chunks fall back to plain code |
| Performance | Opening a settled 20 KB code block produces no main-thread task over 50ms on the project’s baseline physical iPhone |
| Regression | Existing file-diff cards and the quiet Activity disclosure remain visually and behaviorally unchanged for non-Bash tools |
| iOS modes | Tests pass in Safari browser mode and installed standalone PWA, portrait and landscape, including safe-area positioning |
| VoiceOver | Close, Copy, Open, disclosure state, language, and completion status have concise announcements; streamed log lines are not continuously announced |

# 3. Divergent / minority ideas worth considering

1. **Make the F6 viewer a history-backed route, not only a modal.** Opening a block could push `viewer/:blockId` into local navigation state. The iOS back gesture, reload restoration, and deep linking become more predictable, while React Aria still provides dialog semantics. The cost is route/state synchronization and handling blocks that disappear after transcript compaction.

2. **Offer “Wrap code” only in full-screen.** No-wrap preserves code structure, but a local wrap toggle can materially improve accessibility at high text magnification. It must be local state only and must not alter copied text.

3. **Use a compact command receipt instead of a conventional card.** A one-line `$ command`, status, duration, and Open action would keep the transcript quieter; output would live only in the disclosure/viewer. This better preserves the current Activity philosophy but is less Claude-like.

4. **Use a native Share fallback when clipboard is unavailable.** `navigator.share({text})` is not equivalent to Copy, but in an insecure-origin failure it may be more useful than a dead button on iPhone. Label it “Share”, never “Copy”, and expose it only after actual clipboard failure.

5. **Never syntax-highlight very large blocks, even in full-screen.** Plain monospace text is faster, more selectable, less memory-intensive, and more faithful during streaming. “Claude-grade” polish does not require risking a frozen installed PWA.

# 4. Open questions + risks

- What exact tool names identify shell execution, and do results provide authoritative `exitCode`, `duration`, `truncated`, and `phase` fields?
- Can tool results arrive before their corresponding call during replay or reconnect?
- Does F6 already own browser-history state, focus restoration, and body scroll locking? A second owner will create duplicate history entries or scroll jumps.
- Is the tailnet origin guaranteed to be HTTPS? Clipboard parity cannot rely solely on `navigator.clipboard` otherwise.
- What Content Security Policy applies to `worker-src`, and will it permit the Vite worker bundle?
- Which code languages occur frequently enough to justify prebundling? Start with transcript evidence rather than shipping Shiki’s full language set.
- What are the maximum transcript block and message sizes? Source truncation needs an explicit protocol flag; the client must not silently invent truncation.
- Are Markdown links permitted to navigate outside the installed PWA? Remote images should remain disabled because rendering them creates network reads.
- Does transcript redaction occur before persistence and before client delivery? Client-side-only redaction would allow secrets into worker messages and clipboard source strings.
- iOS text selection inside nested overflow regions needs physical-device verification; simulator and desktop WebKit are insufficient.
- Expansion while the transcript autoscrolls can still move the reader’s position. Preserve bottom anchoring only if the reader was already at the bottom; otherwise preserve their current scroll offset.
- Mobbin screen-level comparison remains outstanding because authenticated screen search was unavailable in this pass. A later visual QA pass should capture the current Claude iOS code/artifact flow and Kimi mobile tool-card flow rather than relying on memory.

# 5. Sources

- [React Aria: Disclosure](https://react-aria.adobe.com/Disclosure)
- [React Aria: Modal](https://react-aria.adobe.com/Modal)
- [React Aria: Button](https://react-aria.adobe.com/Button)
- [React Aria: useClipboard](https://react-aria.adobe.com/useClipboard)
- [React: useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)
- [React 19 release](https://react.dev/blog/2024/12/05/react-19)
- [Tailwind CSS 4.0](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind state and data-attribute variants](https://tailwindcss.com/docs/hover-focus-and-other-states)
- [Tailwind dynamic viewport height](https://tailwindcss.com/docs/height)
- [Tailwind white-space utilities](https://tailwindcss.com/docs/white-space)
- [Tailwind overflow-wrap utilities](https://tailwindcss.com/docs/overflow-wrap)
- [Shiki fine-grained bundles](https://shiki.style/guide/bundles)
- [Shiki performance practices](https://shiki.style/guide/best-performance)
- [Shiki languages and plain-text fallback](https://shiki.style/languages)
- [Shiki dual light/dark themes](https://shiki.style/guide/dual-themes)
- [WebKit Async Clipboard API](https://webkit.org/blog/10855/async-clipboard-api/)
- [MDN Clipboard.writeText](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText)
- [WebKit safe-area and viewport-fit guidance](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [WebKit dynamic viewport units](https://webkit.org/blog/12669/new-webkit-features-in-safari-15-5/)
- [Apple HIG: Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [Apple HIG: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [WAI modal-dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WCAG contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
- [WCAG reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html)
- [WAI status-message example](https://www.w3.org/WAI/WCAG22/working-examples/aria-role-status-searchresults/)
- [remark security guidance](https://github.com/remarkjs/remark)
- [rehype-sanitize](https://github.com/rehypejs/rehype-sanitize)
- [Kimi Code repository](https://github.com/MoonshotAI/kimi-code)
- [Kimi Code web UI documentation](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html)
- [Kimi Code changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)
- [Happy mobile/web agent client](https://github.com/slopus/happy)
- [Happy releases](https://github.com/slopus/happy/releases)
- [MobileCLI](https://github.com/MobileCLI/mobilecli)
- [Claude Code UI](https://github.com/TeamADAPT/claude-code-ui)
- [247 Claude Code Remote](https://github.com/QuivrHQ/247-claude-code-remote)
- [OpenCodex](https://github.com/mjmkk/opencodex)
- [Anthropic Artifacts announcement](https://www.anthropic.com/news/artifacts)
- [Mobbin API quick start](https://docs.mobbin.com/api/quickstart)
- [Mobbin mobile-app discovery](https://mobbin.com/discover/apps/ios/latest)
