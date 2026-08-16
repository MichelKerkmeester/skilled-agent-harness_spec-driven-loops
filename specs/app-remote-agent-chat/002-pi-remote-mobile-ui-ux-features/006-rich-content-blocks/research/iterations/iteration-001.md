<!-- provenance: external-CLI orchestration pass; original file iter-01-sol.md -->
> **Source pass 1** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-1-sol.md`.

<!-- F7-rich-content-blocks | model=sol | lens=competitive-teardown | iter 1/10 | 2026-08-16T04:12:40.279Z -->

# 1. Findings for the competitive-teardown lens

## Evidence boundary

Mobbin’s screen library requires an authenticated Pro/Team/Enterprise connection, and its public search index does not expose stable screen-level URLs for the requested AI-chat flows. Its API documentation confirms that authenticated search returns screenshots, app names, and Mobbin links, but those results were unavailable in this pass. Consequently, no geometry below is presented as a Mobbin measurement; it is an executable specification synthesized from verifiable product documentation, App Store material, public screenshots, and open-source implementations. This avoids inventing “observed” Mobbin details. ([Mobbin MCP](https://mobbin.com/mcp), [Mobbin API quick start](https://docs.mobbin.com/api/quickstart))

## Product-by-product teardown

| Product | Verified behavior | Competitive lesson for Pi Remote |
|---|---|---|
| **Claude / Claude iOS** | Claude promotes significant, self-contained content—typically over 15 lines—into an artifact rather than leaving it undifferentiated in chat. Documents, plain text, code, HTML, SVG, diagrams, and React components qualify. The artifact lives in a dedicated window and offers underlying-code view, clipboard copy, download, version selection, and switching among several artifacts. Anthropic explicitly added artifacts to iOS and Android. ([Artifact criteria and controls](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them), [mobile availability](https://claude.com/blog/build-artifacts)) | The transferable pattern is not merely “a bordered code block.” It is a two-level information architecture: compact evidence in the transcript, then a dedicated inspection surface for material worth reusing. Pi should borrow this hierarchy without importing Claude’s editing, publishing, execution, or storage capabilities. |
| **Kimi Code** | Kimi’s web UI has dedicated renderers for shell commands and their output, expandable tool parameters with syntax highlighting, code highlighting, Markdown, one-click assistant-message copy, and a mobile layout with a drawer sidebar. Recent releases group consecutive tool calls into collapsible stacks with per-tool renderers and specifically fixed height jumps during expansion and streaming. Its terminal UI also provides a global tool-output collapse toggle and a fullscreen pager for truncated approval previews. ([Kimi web UI](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/kimi-web.html), [interaction guide](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction), [current changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)) | Kimi is the closest structural reference for Bash cards: pair command and result, retain status, collapse routine activity, and specialize rendering by tool type. The important detail is preserving card height and scroll stability while results stream. |
| **ChatGPT** | ChatGPT distinguishes ordinary prose, writing blocks, and code blocks. Writing blocks can be copied and opened in a fullscreen editing view. Code blocks expose a language label, Copy, fullscreen, and—where supported—Code/Preview and Run. Availability can vary by device, plan, workspace, and rollout. ([OpenAI block documentation](https://help.openai.com/en/articles/20001246-working-with-writing-blocks-and-code-blocks-in-chatgpt)) | The useful parity target is a content-local toolbar. A message-level Copy action is insufficient because users commonly need one command, one output, or one fenced block. Pi should implement Copy and Open locally on each block while omitting Edit, Run, Preview, and Share. |
| **Perplexity** | Perplexity’s newer asset flow automatically opens a generated document/app preview, places the asset in a side panel, and provides an explicit Expand action for fullscreen. It preserves version history and supports web/mobile preview. Its ordinary answer UI instead prioritizes prose, images, citations, sources, and follow-up questions. ([Asset workflow](https://www.perplexity.ai/help-center/en/articles/12528830-creating-assets-with-perplexity-overview), [iOS listing](https://apps.apple.com/us/app/perplexity-ai-search-chat/id1668000334)) | Perplexity validates “preview first, expand second,” but automatic opening is wrong for a monitoring-oriented transcript. Pi should open only after an explicit tap and preserve the transcript’s scroll location. |
| **DeepSeek** | DeepSeek’s iOS release history documents category-specific controls for tables: copy, download, and fullscreen preview. It also supports custom font sizes. Public product material does not document an equivalent full artifact model for code or command output. ([DeepSeek App Store listing](https://apps.apple.com/us/app/deepseek-ai-assistant/id6737597349)) | Even a comparatively restrained chat client recognizes that structured content needs controls different from prose. Pi should use the stronger Claude/ChatGPT pattern for code, but DeepSeek is useful evidence that fullscreen inspection should be content-specific rather than a generic “expand message” action. |
| **Gemini** | Gemini renders code as a distinct block with a Copy control. Its broader Canvas supplies code/document workspaces, but mobile capabilities remain fragmented: exporting code to Colab or Replit and exporting tables to Sheets are unavailable in the mobile app; shared Canvas content may open only on the web. Mobile responses instead expose a message-level More menu and long-press export. ([Code-block copy](https://support.google.com/gemini/answer/13275745), [iPhone/iPad export limitations](https://support.google.com/gemini/answer/14184041?co=GENIE.Platform%3DiOS), [Canvas limitations](https://support.google.com/gemini/answer/16047321)) | Gemini is the warning case: desktop-rich features that degrade inconsistently on mobile make the interface unpredictable. Pi should guarantee the same three read-only operations—inspect, select, copy—on every supported iPhone size. |
| **Meta AI** | Meta’s current iOS positioning emphasizes conversational responses, documents/files, images, recommendations, voice, and social content. Its public listing documents no code-artifact, command/output, or content-block inspection model. ([Meta AI App Store listing](https://apps.apple.com/us/app/meta-ai/id1558240027)) | Treat Meta AI as a negative baseline for this feature. A general-purpose prose/media feed is not adequate for a coding-agent transcript where command provenance and exact whitespace matter. |

## Cross-competitive conclusions

1. **The strongest products separate transcript context from inspection context.** Claude, ChatGPT, and Perplexity all provide a dedicated surface for substantial reusable content. Pi should therefore reuse F6 as the canonical viewer rather than enlarging inline cards indefinitely. ([Claude](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them), [ChatGPT](https://help.openai.com/en/articles/20001246-working-with-writing-blocks-and-code-blocks-in-chatgpt), [Perplexity](https://www.perplexity.ai/help-center/en/articles/12528830-creating-assets-with-perplexity-overview))

2. **Coding-agent activity requires semantic renderers, not one generic disclosure.** Kimi explicitly distinguishes Shell, media, todos, tool parameters, diffs, and subagent activity while still grouping consecutive calls. Pi’s existing quiet Activity disclosure should remain for low-value tools, but Bash/Shell events should graduate to a paired Command/Output renderer. ([Kimi web UI](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/kimi-web.html), [Kimi changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md))

3. **Copy belongs to the smallest meaningful unit.** ChatGPT exposes it on code blocks, Claude on artifacts, Gemini on code, and Kimi on assistant content. Pi needs separate Copy command, Copy output, Copy code, and Copy artifact-content targets—not only Copy message. ([ChatGPT](https://help.openai.com/en/articles/20001246-working-with-writing-blocks-and-code-blocks-in-chatgpt), [Claude](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them), [Gemini](https://support.google.com/gemini/answer/13275745))

4. **Read-only is a beneficial differentiation, not a missing feature.** Competitors blur reading with editing, execution, publishing, downloading, and exporting. For a remote agent with already-redacted transcript data, Pi should expose no Run, Edit, Open in editor, Download, or filesystem affordance. Fullscreen must mean “inspect this immutable payload.”

5. **Mobile parity must be deliberately narrower than desktop parity.** Gemini demonstrates the cost of actions appearing only on certain surfaces. Pi should ship a small invariant contract—copy, expand, select, dismiss—rather than a broad action menu that changes by block type or viewport.

## Relevant open-source prior art

- [MoonshotAI/kimi-code](https://github.com/MoonshotAI/kimi-code) is the best public reference for tool grouping, specialized shell renderers, streaming stability, and responsive React/Vite presentation.
- [newlandjia/opencode-mobile](https://github.com/newlandjia/opencode-mobile) is a dedicated OpenCode PWA and includes a `ToolCallCard` architecture.
- [TeamADAPT/claude-code-ui](https://github.com/TeamADAPT/claude-code-ui) demonstrates responsive chat, code blocks, syntax highlighting, bottom-tab mobile navigation, and PWA installation.
- [giuliastro/harness-remote](https://github.com/giuliastro/harness-remote) supports Pi, OpenCode, OMP, and Claude Code from a PWA and documents deliberate auto-follow release when the user scrolls away from the tail.
- [incidentfox/box](https://github.com/incidentfox/box) streams text and tool chips to a phone PWA while keeping the coding process on the remote host.
- [MobileCLI/mobilecli](https://github.com/MobileCLI/mobilecli) parses agent terminal output into tool, plan-review, question, and completion states rather than exposing an undifferentiated terminal.
- [SirAllap/agentglass](https://github.com/SirAllap/agentglass) treats tool calls and dangerous-action holds as first-class remote/mobile information.
- [thrinz/agentpeek](https://github.com/thrinz/agentpeek) is a Tailscale-oriented remote control, but its terminal-key injection approach highlights what Pi should avoid: content controls should operate on transcript payloads, not synthesize terminal input.

# 2. Concrete spec contribution for the build phase

All dimensions in this section are proposed Pi Remote requirements, not claimed competitor measurements.

## 2.1 Content routing

Implement one deterministic `RichContentRouter` over the already-redacted transcript envelope:

| Input | Renderer | Qualification |
|---|---|---|
| `tool_call` paired to `tool_result` | `CommandOutputCard` | Tool type is Bash, Shell, terminal, exec, or the normalized call contains a command field. Pair only by stable tool-call ID; never by adjacency alone. |
| Fenced Markdown code | `CodeCard` | Fence contains any payload. Normalize the language alias for highlighting, but preserve the original payload byte-for-byte for Copy. |
| Explicit prompt, goal, long-text, or artifact content | `TextArtifactCard` | Prefer an explicit semantic type. As a fallback, promote self-contained text at **16 or more logical lines** or **1,200 or more characters**; the line threshold follows Claude’s documented “typically over 15 lines” boundary. ([Claude artifact criteria](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them)) |
| Other tool activity | Existing `Activity` disclosure | Preserve the quiet grouped treatment. |
| `file_diff` | Existing diff card | No behavior change except optional reuse of F6 toolbar conventions. |

Mandatory invariant: every renderer receives only the redacted transcript string already present on the client. It must perform no filesystem request, file-path expansion, “load full output,” tool invocation, or mutation request.

## 2.2 Command/Output card

### Inline geometry

- Width: `100%` of the transcript column.
- Border: `1px`; radius: `14px`.
- Header: minimum `44px` tall, `12px` horizontal padding.
- Outer gap from adjacent prose/cards: `12px`.
- Header layout: terminal icon, `Command` label, status, flexible spacer, Copy, Open, disclosure chevron.
- Controls: visually 32px icons inside independent **44×44px** press targets.
- Command body: 13px/19px monospace, `12px` padding, soft-wrap with `overflow-wrap:anywhere`.
- Output body: 13px/19px monospace; default preview limited to **12 logical lines or 228px**, whichever is smaller.
- Do not prepend a synthetic `$`; it must not be mistaken for copied content.
- Command and output use separate DOM regions and separate Copy actions.

Using 44px targets exceeds WCAG 2.2 AA’s 24×24px minimum and is safer for one-handed iPhone use. ([WCAG target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html))

### States

1. **Queued:** command visible; neutral clock status; output says “Waiting to run.”
2. **Running:** command visible; clay-colored progress indicator plus text “Running”; output streams below it.
3. **Succeeded:** check icon plus “Completed”; output preview available.
4. **Failed:** error icon, “Failed,” and exit code when transmitted. Failure may use muted red but must also have icon and text.
5. **Denied/cancelled:** slash-circle icon plus explicit “Denied” or “Cancelled.”
6. **Empty output:** show “No output” rather than a blank panel.
7. **Transcript-truncated:** show the received truncation marker and label “Output truncated upstream.” Never imply that Expand can retrieve omitted bytes.
8. **Result missing:** after the turn is terminal, show “Result unavailable” and preserve the command.
9. **Malformed pair:** render call and orphan result separately with “Unmatched activity”; never attach a result to the wrong command.

The card must not animate its height on every streaming chunk. Kimi’s recent fixes specifically target tool-card jumping and transcript instability during expansion/streaming, making stable geometry a competitive requirement. ([Kimi changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md))

### Interaction sequence

- Tap header disclosure: toggle the inline output preview.
- Tap **Copy command**: copy only the exact redacted command.
- Tap **Copy output**: copy only the exact redacted result, including original newlines and trailing newline if present.
- Tap **Open**: launch F6 with two stacked, labeled sections and independent Copy controls.
- Long-press inside text: permit native iOS selection; do not make the entire body a button.
- A card-level tap must not copy, run, approve, or expand fullscreen.

## 2.3 Code card

### Inline geometry and rendering

- Header: `40px` visual height but a minimum `44px` interactive box.
- Leading label: normalized language such as `TypeScript`, `Bash`, `JSON`, or `Plain text`.
- Trailing controls: Copy and Open; never hide essential actions behind hover.
- Code: 13px/20px monospace, tab size 2, `12px 14px` padding.
- Preview: maximum **16 lines or 288px**.
- Default behavior: preserve lines and horizontal-scroll code; do not soft-wrap source code.
- Add a subtle bottom fade only when clipped. The fade is decorative and must not obscure the final fully visible line.
- Do not render line numbers inline by default; they consume scarce width and risk contaminating selection.
- Unknown or absent language: plaintext, not guessed highlighting.

Use Shiki’s fine-grained bundle and load only Bash, JavaScript, TypeScript, JSX/TSX, JSON, CSS, HTML, Markdown, Python, diff, plaintext, and ANSI initially. Shiki recommends fine-grained imports for performance-sensitive web apps and provides an ANSI grammar for terminal output. ([Shiki bundles](https://shiki.style/guide/bundles), [Shiki languages](https://shiki.style/languages.html))

For payloads over **2,000 lines or 200 KiB**, render full plaintext and copy the full payload, but omit token highlighting with a non-modal “Highlighting omitted for performance” note. Content must never be truncated merely to preserve highlighting.

### Security/rendering requirements

- Render tokens as React text nodes; never pass transcript payloads directly to `dangerouslySetInnerHTML`.
- Preserve the original redacted string separately from highlighted tokens.
- Copy from that source string, not `innerText`; `innerText` can include labels, line numbers, collapsed markers, or altered whitespace.
- Strip or display ANSI control sequences through a non-executing parser. Never inject terminal escape content into style attributes.
- Links that appear inside code remain text.

## 2.4 Text/prompt artifact card

- Header: document icon; semantic label `Prompt`, `Goal`, or `Text artifact`; optional line count; Copy and Open.
- Card radius: 14px; padding: 14px; border: 1px.
- Preview typography: Source Serif 4 at 16px/24px.
- Preview limit: **six lines or 156px**.
- Preserve paragraph breaks and lists. For prompt-like whitespace, use `white-space:pre-wrap`.
- The preview is not editable and has no caret.
- A bottom fade and “Open full screen” text action communicate continuation.
- Copy copies the complete redacted payload, not only the preview.
- If classification was heuristic rather than semantic, label it `Long text`, not `Artifact`; do not pretend the host declared an artifact.

## 2.5 F6 fullscreen viewer

Apple recommends fullscreen modality for in-depth content, an obvious dismissal mechanism, a clear task title, and no nested stack of modals. ([Apple HIG: Modality](https://developer.apple.com/design/human-interface-guidelines/modality))

### Layout

- Reuse the existing F6 shell as the only fullscreen implementation.
- `position:fixed; inset:0; min-height:100dvh`.
- Background: bone `#f8f8f6` in light mode; existing carbon parchment token in dark mode.
- Top toolbar: `56px + env(safe-area-inset-top)`.
- Toolbar content: Close on the leading side, truncated title centered, Copy on the trailing side.
- Each toolbar control: minimum 44×44px.
- Body: top below toolbar; bottom padding `max(20px, env(safe-area-inset-bottom))`.
- Text gutters: 18px on widths below 390px, 20px at 390px and above.
- Code viewer: horizontal scroll contained within the body; no page-level horizontal overflow.
- Status bar remains visible; hiding it is unnecessary for text/code inspection. Apple recommends retaining it except where immersive media makes hiding valuable. ([Apple HIG: Layout](https://developer.apple.com/design/human-interface-guidelines/layout))

### Open/close sequence

1. User activates Open.
2. Viewer appears with title and content type.
3. Initial focus moves to Close.
4. Background transcript becomes inert and inaccessible.
5. Close works through the visible button, `Escape` on hardware keyboards, and browser Back when F6 owns a history entry.
6. On dismissal, focus returns to the exact originating Open button and transcript scroll position is unchanged.

React Aria’s dialog behavior already covers initial focus, containment, outside-content hiding, Escape dismissal, and return focus; use `ModalOverlay`, `Modal`, and `Dialog` rather than rebuilding focus management. ([React Aria dialog behavior](https://reactspectrum.blob.core.windows.net/reactspectrum/9404798d01f635934964f95c3519f9be2c1e366e/docs/react-aria/useDialog.html))

### Gestures

- Visible Close is mandatory; a gesture is supplemental.
- Optional swipe-down dismissal may start only in the toolbar/drag region, not the scrollable content.
- Commit dismissal after `80px` downward travel or `0.8px/ms` downward velocity.
- Cancelled drag returns to rest in 160ms.
- Do not intercept edge-back, text selection, horizontal code scrolling, or pinch zoom.
- No swipe gesture may trigger Copy.

## 2.6 Copy feedback

The Clipboard API requires a secure context and can require transient user activation, so clipboard writes must occur directly within the button’s press handler. ([MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API))

- Idle label: `Copy`.
- Success: check icon plus `Copied` for 1.5 seconds.
- Screen-reader feedback: one shared `role="status"`/polite live region saying “Command copied,” “Output copied,” “Code copied,” or “Text copied.” WCAG requires status messages to be programmatically available without taking focus. ([WCAG 4.1.3](https://www.w3.org/TR/WCAG22/#status-messages), [ARIA status technique](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22))
- Failure: retain focus and show `Copy failed`; do not report success optimistically.
- Failure fallback: leave the full payload selectable and offer `Select text`.
- Never use clipboard reads.
- Never copy labels, `$` prompts, line numbers, folds, status text, truncation UI, or hidden unredacted data.

## 2.7 Accessibility

- Card root: semantic `group` with a name such as “Bash command and output.”
- Disclosure: native button with `aria-expanded` and `aria-controls`.
- Output section: named `region`, e.g. “Command output.”
- Running output must not be a character-by-character live region. Announce only state transitions: “Command started,” then “Command completed” or “Command failed.”
- Icon-only buttons require stable accessible names: “Copy command,” “Copy output,” “Open code full screen,” and “Close viewer.”
- Use `Button`/`onPress` from react-aria-components so touch, mouse, keyboard, and virtual screen-reader activation share one semantic interaction path. React Aria documents cross-input press handling and the requirement for accessible labels on icon-only buttons. ([React Spectrum button accessibility](https://react-spectrum.adobe.com/v3/Button.html))
- Text contrast: at least 4.5:1; large text 3:1. Borders, focus rings, and state icons: at least 3:1 against adjacent surfaces. ([WCAG contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum))
- Status must never be encoded by clay/red/green alone.
- Fonts, headers, and controls must reflow at 200% zoom without overlap, truncating essential labels, or hiding the Close action.
- Keep `user-select:text` for command, output, code, and artifact bodies.
- Focus ring: 2px carbon/clay outline plus 2px offset, verified at 3:1 against both card and page backgrounds.
- Fullscreen content needs a real heading connected to the dialog’s accessible name.

## 2.8 Visual and motion system

- Ink-on-parchment remains dominant; clay marks action/focus, not large card fills.
- Light cards: bone surface, carbon text, a low-contrast neutral border that still meets non-text contrast where it conveys the boundary.
- Dark cards: raised dark-parchment surface, off-white text, syntax colors individually verified against that surface.
- Commands/output/code use Inter for chrome and the existing monospace token for payloads; long-text artifacts use Source Serif 4.
- Inline expand/collapse: 180ms ease-out opacity plus content reveal. Avoid scale on monospace text.
- Fullscreen entrance: 200ms opacity plus `translateY(8px → 0)`.
- Fullscreen dismissal: 160ms.
- Under `prefers-reduced-motion: reduce`, remove translation and height animation; retain an immediate opacity change.
- Streaming must never animate each appended line.

## 2.9 Objective acceptance checks

1. At 320, 375, 393, and 430 CSS-pixel widths, no card or toolbar causes page-level horizontal overflow.
2. Every visible control has a 44×44px computed hit target.
3. Light and dark palettes pass automated 4.5:1 text and 3:1 non-text contrast checks.
4. At 200% zoom, Close, Copy, labels, and all content remain reachable with no two-dimensional page scrolling.
5. Copy output equals the exact redacted source string in a byte-for-byte fixture, including tabs, Unicode, leading spaces, and final newline.
6. Copy tests prove that labels, line numbers, synthetic prompts, and hidden DOM are absent.
7. Opening F6 moves focus inside; Tab cannot escape; closing returns focus to the source button.
8. VoiceOver announces block type, state, disclosure state, action labels, and copy success once.
9. Streaming output does not force-scroll a transcript after the user has moved upward.
10. A missing or delayed tool result never attaches to a different command.
11. A 200 KiB/2,000-line fixture remains fully copyable and inspectable without syntax highlighting.
12. Malicious fixtures containing HTML, script tags, bidi controls, ANSI sequences, and Markdown links execute no script or style.
13. Network instrumentation records no host-file request or mutation request from rendering, Copy, disclosure, or fullscreen actions.
14. Viewer dismissal preserves the originating transcript scroll offset within 1px.
15. Reduced-motion tests show no translation or animated height.
16. A repository search confirms there is no new Run, Edit, Download, Open-file, approve, or mutation affordance associated with these blocks.

# 3. Divergent / minority ideas worth considering

## Evidence strip instead of a conventional terminal card

Treat Command and Output as two cells in a miniature lab notebook:

- Cell A: exact command.
- Cell B: exact observed output.
- A thin central status rail connects them.

This makes provenance clearer than a single black terminal rectangle and fits the parchment design system better. It also avoids visually implying that Pi Remote is an interactive shell.

## Promote only exceptional commands

Retain all successful commands inside the existing Activity group, but promote running, failed, denied, or unusually long commands into standalone cards. This would make the transcript substantially quieter than Claude or Kimi. The risk is reduced discoverability and inconsistent placement; if adopted, the promotion rule must be deterministic.

## Redaction provenance badge

Show a quiet `Redacted transcript` badge in F6 and expose a disclosure explaining that Copy uses exactly the already-redacted payload. This reinforces the security boundary without adding a permission dialog. Avoid displaying redaction counts unless the host actually transmits trustworthy counts.

## Session-local artifact index

Derive a read-only “Blocks in this conversation” index from the loaded transcript: Commands, Code, Prompts, and Diffs. It would be ephemeral, require no storage, and mimic Claude’s artifact retrievability without creating an artifact library or mutation surface.

## Two Copy targets for Command/Output

Offer separate `Copy command` and `Copy output` actions inline, plus `Copy all` only inside F6. Most competitors emphasize one generic Copy action; separating evidence units better fits debugging and avoids repeatedly deleting unwanted output after pasting.

## Wrap toggle in fullscreen only

Kimi specifically fixed wrapping of long single-line shell commands. Pi could keep source code unwrapped inline but offer a read-only `Wrap lines` toggle in F6. The toggle should be local UI state, never persisted or sent to the host. ([Kimi changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md))

# 4. Open questions + risks

1. **Transcript semantics:** Does Pi provide stable call IDs, tool type, status, exit code, streaming sequence, and truncation metadata? Without stable IDs, correct Command/Output pairing cannot be guaranteed.

2. **Artifact intent:** Are goal prompts and long text explicitly typed, or must the client infer them? Heuristic promotion can misclassify long assistant explanations, logs, or legal text.

3. **Redaction boundary:** Is redaction performed before persistence and transport, or only at render time? Copy must never access a parallel raw payload, source map, title, or hidden attribute.

4. **Output completeness:** If upstream truncates results, F6 must not imply that it contains “full output.” The UI needs transmitted truncation metadata or must conservatively say “Displayed transcript output.”

5. **ANSI and bidi content:** Terminal escape sequences and bidirectional-control characters can create visually deceptive commands. Decide whether to display controls visibly, strip presentation-only controls, or add a warning while preserving the exact copied redacted payload.

6. **Markdown security:** Long-text artifacts may contain HTML, links, images, or data URLs. The safest initial release is Markdown without raw HTML, remote image loading, embedded media, or interactive components.

7. **Syntax cost:** Client-side TextMate highlighting can block an older iPhone on large blocks. The plaintext cutoff and lazy, fine-grained language loading need real-device profiling.

8. **Selection versus virtualization:** Full line virtualization can break native text selection and Select All. Prefer chunked `content-visibility` or plaintext degradation before introducing a virtualized editor.

9. **Clipboard leakage:** Clipboard writes are explicitly user-triggered but move redacted transcript content outside Pi Remote. Product copy should not imply the clipboard remains private.

10. **Streaming scroll ownership:** Expanding a card or appending output must not steal scroll position. The app needs an explicit “following tail” state, released as soon as the user scrolls upward; Harness Remote documents this pattern for remote-agent chat. ([Harness Remote](https://github.com/giuliastro/harness-remote))

11. **PWA history behavior:** If F6 adds a history entry so Back dismisses it, refresh/deep-link behavior must not leave the app on a meaningless viewer route. Store only a block ID in navigation state, never the payload.

12. **iOS viewport behavior:** Validate `100dvh`, safe-area insets, selection menus, rotation, standalone mode, and the software keyboard on physical iPhones. Apple recommends `width=device-width` for correct iOS viewport behavior. ([Safari viewport guidance](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/UsingtheViewport/UsingtheViewport.html))

13. **Competitor drift:** ChatGPT explicitly varies block actions by device and rollout, and mobile AI clients change rapidly. The implementation should follow the durable interaction model—content-local Copy plus explicit fullscreen inspection—not exact competitor icon placement.

14. **Mobbin verification debt:** Before visual sign-off, conduct an authenticated Mobbin review of the latest Claude, ChatGPT, Perplexity, Gemini, DeepSeek, and Meta AI iOS captures. Record screen IDs, app versions, capture dates, device widths, and measured toolbar/card spacing so later iterations can distinguish verified competitor geometry from this proposed spec.

# 5. Sources

## Product documentation and listings

- https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them
- https://claude.com/blog/build-artifacts
- https://www.kimi.com/code/docs/en/kimi-code-cli/reference/kimi-web.html
- https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction
- https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md
- https://help.openai.com/en/articles/20001246-working-with-writing-blocks-and-code-blocks-in-chatgpt
- https://www.perplexity.ai/help-center/en/articles/12528830-creating-assets-with-perplexity-overview
- https://apps.apple.com/us/app/perplexity-ai-search-chat/id1668000334
- https://apps.apple.com/us/app/deepseek-ai-assistant/id6737597349
- https://support.google.com/gemini/answer/13275745
- https://support.google.com/gemini/answer/14184041?co=GENIE.Platform%3DiOS
- https://support.google.com/gemini/answer/16047321
- https://apps.apple.com/us/app/meta-ai/id1558240027

## Mobbin

- https://mobbin.com/mcp
- https://docs.mobbin.com/api/quickstart
- https://docs.mobbin.com/mcp/clients/overview

## Platform, accessibility, and implementation

- https://developer.apple.com/design/human-interface-guidelines/modality
- https://developer.apple.com/design/human-interface-guidelines/layout
- https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/UsingtheViewport/UsingtheViewport.html
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum
- https://www.w3.org/TR/WCAG22/#status-messages
- https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22
- https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
- https://reactspectrum.blob.core.windows.net/reactspectrum/9404798d01f635934964f95c3519f9be2c1e366e/docs/react-aria/useDialog.html
- https://react-spectrum.adobe.com/v3/Button.html
- https://shiki.style/guide/bundles
- https://shiki.style/languages.html

## Open-source prior art

- https://github.com/MoonshotAI/kimi-code
- https://github.com/newlandjia/opencode-mobile
- https://github.com/TeamADAPT/claude-code-ui
- https://github.com/giuliastro/harness-remote
- https://github.com/incidentfox/box
- https://github.com/MobileCLI/mobilecli
- https://github.com/SirAllap/agentglass
- https://github.com/thrinz/agentpeek
