> **Deep research — external-CLI multi-executor run.** 10 independent iterations (5 × GPT 5.6 SOL high (--search, cli-codex), 5 × Grok 4.6 xhigh (cli-cursor)), no early convergence. Synthesis of all passes into one build-ready decision.
> **Provenance:** produced by external-CLI orchestration, NOT the `/deep:research` state-machine runtime — so runtime state artifacts (`deep-research-state.jsonl`, `findings-registry.json`, `deep-research-dashboard.md`, observability, deltas, lineages) are intentionally absent. See `PROVENANCE.md`.
> **Canonical:** this file (`research.md`) is the synthesized output; per-pass findings live in `iterations/iteration-NNN.md`.

---

# F7-rich-content-blocks — Synthesis

## 1. Decision

Build three typed, read-only transcript projections: paired Bash Command/Output cards, fenced-code cards, and explicit or substantial text-artifact cards. Each receives a bounded inline preview, unit-level Copy controls, and an explicit Open action into the shared F6 full-screen viewer; shell activity graduates out of the quiet Activity group, while routine tools remain grouped. This combines Claude’s transcript-to-inspection hierarchy with Kimi’s stable, semantic shell rendering without importing desktop side panels, auto-open behavior, editing, execution, download, publishing, or host-file access (iter-01, iter-06, iter-09). Syntax highlighting is progressive and bounded: plain text is always immediate, settled code may be highlighted in a worker, and large or unsupported content remains fully usable as plaintext.

## 2. Build spec

### Data model and routing

Add a pure normalization layer between redacted transcript envelopes and React. A normalized rich block must contain:

- `sessionId`, stable `blockId`, monotonic `revision`, and transcript `sequence`.
- `source: "relay" | "cache" | "optimistic"`.
- `kind: "command" | "code" | "text-artifact"`.
- Canonical already-redacted source strings, separate from preview or highlighted presentation.
- Redaction metadata when available: `policyVersion`, `fieldsRedacted`, and `reasons`.
- Authoritative lifecycle and truncation metadata supplied by the relay; never inferred from output wording.

Routing rules:

| Transcript input | Rendering |
|---|---|
| Relay-authored shell/Bash/exec call plus result | `CommandOutputCard`, paired only by stable `callId` |
| Fenced code in assistant text | `CodeCard`; language comes from an allowlisted fence identifier |
| Explicit goal, prompt, plan, document, or artifact metadata | `TextArtifactCard` regardless of length |
| Settled, self-contained text at least 16 logical lines or 1,200 characters | `TextArtifactCard` labelled `Long text`, not falsely labelled `Artifact` |
| Short prose | Existing borderless Source Serif prose |
| Thinking, usage, and non-shell tools | Existing Activity disclosure |
| File diff | Existing diff card; may reuse the viewer and toolbar later |
| Unknown or malformed payload | Existing safe fallback; no Copy or Open |

Requirements:

- Plumb `callId` to display blocks; adjacency or command-text matching is forbidden.
- Stable React keys are based on protocol identity, never streamed content.
- Ignore duplicate `(blockId, revision)` updates and lower revisions.
- Result-before-call creates a temporary unmatched-output state and merges only when the matching call arrives.
- Replays may update content but must not reopen viewers, reset user expansion state, move focus, or disturb transcript scrolling.
- Optimistic user prompts remain ordinary bubbles. They cannot become copyable/openable artifacts until replaced by the committed, relay-redacted block (iter-07).

### Component breakdown

| Component or hook | Responsibility |
|---|---|
| `normalizeTranscriptBlocks` | Pure conversion and identity-based call/result pairing |
| `RichContentRouter` | Exhaustive renderer selection with safe fallback |
| `RichBlockFrame` | Shared paper chrome, heading, metadata, status, and action layout |
| `CommandOutputCard` | Separate Command and Output regions, lifecycle states, streaming preview, unit-level Copy |
| `CodeCard` | Fenced-code preview, language normalization, progressive highlighting, Copy and Open |
| `TextArtifactCard` | Prompt/goal/document preview, safe Markdown, Copy and Open |
| `ArtifactViewerProvider` | Single session-level owner for F6 viewer state, history, focus, and scroll restoration |
| `F6ViewerAdapter` | Maps each rich block into the appropriate F6 renderer |
| `SafeMarkdown` | CommonMark/GFM without raw HTML, remote media, forms, iframes, or executable previews |
| `useCopyFeedback` | Exact clipboard write, success/failure state, and shared live-region announcement |
| `useHighlightedCode` | Worker request, allowlist, cache, size cutoff, and stale-response guard |
| `RedactionBadge` | Displays transmitted redaction provenance without implying completeness |

### Shared inline-card contract

- Full transcript-column width, 16px radius, 1px border, and 12px separation from neighboring content.
- Toolbar and every action have a minimum 44×44 CSS-pixel hit area.
- Copy and Open are sibling React Aria `Button`s. The card and selectable body are not buttons.
- Inline bodies are previews, not scrollable vertical panes. Only code may pan horizontally.
- Render only the visible preview substring in the accessibility tree; retain the complete source string in component state for Copy and F6.
- Long press and drag remain native iOS text selection. Do not use `useLongPress`, custom context menus, double-tap actions, or card-wide press handlers.
- Activation occurs on release. Scrolling, dragging outside the control, or pointer cancellation must not trigger Copy or Open.
- No rich card auto-opens or grows to thousands of lines inside the virtualized transcript.

### Command/Output card

Structure:

1. Card heading: `Running a command`, `Ran a command`, `Command failed`, or another authoritative state.
2. Command subsection with `Copy command`.
3. Output subsection with `Copy output` when output exists.
4. One explicit `Open full screen` action.

Inline presentation:

- Command: monospace, wraps long tokens, maximum three visual lines.
- Output: last eight logical lines or 160px, whichever is smaller; show `N earlier lines` when clipped.
- No synthetic `$` in the source or clipboard. A decorative prompt may be displayed with `aria-hidden="true"`.
- No vertical scrolling inside the card.
- Streaming updates replace the fixed-height tail preview without animating height or stealing transcript scroll.

States:

| State | Presentation |
|---|---|
| `queued` | Command visible; `Waiting to run` |
| `running`, no output | Command visible; `Running`; output says `Waiting for output` |
| `running`, output present | Fixed tail preview; action labelled `Copy current output` |
| `succeeded` | `Completed`; exit code only when supplied |
| `failed` | `Failed · Exit N` when supplied; text and icon, never color alone |
| `denied` / `cancelled` / `interrupted` | Exact supplied state; preserve partial output |
| Empty output | `Completed · No output`; omit `Copy output` |
| Whitespace-only output | Explicit `Whitespace-only output`; Copy remains available |
| Upstream-truncated | `Output truncated upstream`; F6 must not imply omitted bytes are recoverable |
| Result missing after terminal checkpoint | `Result unavailable`; preserve the command |
| Result before call | `Output received · command details loading` |
| Malformed/unmatched | `Unmatched activity`; never attach it to a nearby command |
| Connection lost while running | Preserve received bytes; `Connection lost · output may be incomplete` |
| Stale cache | Preserve Copy/Open; label the viewer `Cached transcript` |

Completed viewers open at the top. Running viewers start at the tail and follow only while the user is within 96px of the bottom. Scrolling upward disables follow mode and exposes a 44×44 `Jump to latest` control; completion never forces a reader back to the tail.

### Code card

- Header: normalized language or `Code`, line count, Copy, and Open.
- Preview: first 12 logical lines or 228px.
- Preserve indentation and newlines; source code is LTR and unwrapped by default with horizontal panning contained inside the code surface.
- Unknown or absent languages render as plaintext; never guess from filenames or punctuation.
- No line numbers inline.
- Copy writes the exact redacted fence body, excluding fences, language labels, line numbers, truncation UI, and generated whitespace.

Rendering states:

| State | Presentation |
|---|---|
| Fence streaming | Escaped plain monospace text; `Receiving code` |
| Settled, highlighter pending | Plain text remains visible |
| Highlighted | Token spans rendered as ordinary React text nodes |
| Unknown language | Plain text with supplied language label or `Code` |
| Worker/grammar failure | Plain text plus quiet `Syntax highlighting unavailable` |
| Empty fence | `Empty code block`; Copy disabled |
| Upstream-truncated | `Code may be incomplete` |
| Over 20,000 characters or 1,000 lines | Skip highlighting; full plaintext remains selectable and copyable |

Use a fine-grained Shiki worker with an initial allowlist for Bash, JavaScript, TypeScript, JSX/TSX, JSON, HTML, CSS, Markdown, Python, Go, Rust, YAML, SQL, diff, ANSI, and plaintext. Cache tokens in memory by language, theme, revision, and content hash; never persist source or token output. Worker responses must carry request and revision IDs so stale highlighting cannot overwrite newer content.

Do not use `codeToHtml`, `dangerouslySetInnerHTML`, raw language-derived CSS classes, or remote grammar/CDN requests.

### Text-artifact card

- Label from trusted metadata: `Prompt`, `Goal`, `Plan`, `Document`, or `Text`.
- Heuristically promoted content is labelled `Long text`.
- Preview: first six logical lines, Source Serif 4 at approximately 17px/1.55, with an explicit continuation indicator.
- Header chrome uses Inter and includes complete character or line count.
- Copy writes the complete committed redacted source, including Markdown syntax.
- Human-language content uses `dir="auto"`; filenames and identifiers use `<bdi>`.
- Safe Markdown supports paragraphs, headings, lists, emphasis, blockquotes, tables, and fenced code.
- Raw HTML, scripts, forms, images, iframes, audio, video, data URLs, and remote embeds remain escaped or omitted.
- Empty explicit artifacts show `Empty text artifact`; heuristic classification never creates an empty card.
- Heuristic promotion happens only after content settles, preventing a streaming paragraph from repeatedly changing renderer type.

### Copy contract

Copy always targets the named semantic unit; native selection handles partial copying.

| Control | Copied value |
|---|---|
| `Copy command` | Canonical redacted command only |
| `Copy output` | Canonical redacted output only, preserving tabs, Unicode, newlines, and final newline |
| `Copy code` | Canonical redacted fence body |
| `Copy text` | Canonical redacted artifact source |
| F6 `Copy all` for command/output | Command plus `"\n\n"` plus output; omit separator when output is empty |

Behavior:

1. `navigator.clipboard.writeText(payload)` is invoked directly from `onPress`; there is no preceding fetch, dynamic import, permission query, timeout, or worker wait.
2. Focus remains on the button.
3. Success changes the initiating label to `Copied` for 1.5 seconds and announces the named unit through one persistent polite `role="status"`.
4. Failure leaves the action available and shows persistent recovery text: `Copy failed. Touch and hold to select the text.`
5. Missing Clipboard API hides the action; full content remains selectable in F6.
6. Copy never reads the clipboard and never uses highlighted DOM, `innerText`, hidden content, generated prompts, or an unredacted backing value.
7. Copy during streaming snapshots the current authoritative revision at press time and announces `Copied current output`.

### F6 full-screen viewer

Use one shared React Aria `ModalOverlay` → `Modal` → `Dialog` implementation. Do not use the browser Fullscreen API.

Layout:

- `position: fixed; inset: 0`.
- Height from React Aria’s visual-viewport variable with `100dvh` fallback.
- Full-bleed on iPhone; no centered desktop dialog, detent, nested modal, or grabber.
- Sticky toolbar: leading Close, visible title, trailing Copy; every control at least 44×44px.
- Safe-area padding from `env(safe-area-inset-*)`.
- One vertical content scroller with bottom Home-indicator padding and contained overscroll.
- Code owns its horizontal scroll; the page never overflows horizontally.
- Text uses a centered reading measure up to 66 characters.
- Command/output uses two stacked, labelled sections with independent Copy actions and toolbar-level Copy all.
- Code has a local, non-persisted `Wrap lines` toggle. Output and prose wrap by default.

Open/close sequence:

1. Save the transcript scroll offset and exact invoking Open control.
2. Push one ephemeral history entry containing only the block ID—not content.
3. Open the dialog without performing a network, filesystem, or mutation request.
4. Focus the visible title with `tabIndex="-1"`; the first Tab stop is Close.
5. Make the transcript inert and lock background scroll.
6. Close through the visible Close button, `Escape`, browser Back/edge-back, or VoiceOver dismiss.
7. Restore transcript scroll before returning focus to the invoker.
8. If virtualization removed the invoker, fall back to the card heading, owning message, then transcript heading.

For the initial build, `isDismissable` is false: no backdrop dismissal and no custom swipe-down. These gestures conflict with long-text selection, horizontal code panning, nested scrolling, and F6’s established gesture contract (iter-02, iter-09, iter-10).

Higher revisions of the same block may update an open viewer without another fetch. Lower or unrelated revisions are ignored. If reconciliation removes the source block, retain the last trustworthy redacted snapshot and label it `No longer in the current transcript`.

### Keyboard and accessibility

Inline focus order:

1. `Copy command/code/text`
2. `Copy output`, when present
3. `Open … full screen`

Viewer focus order:

1. Programmatically focused title
2. Close
3. Copy all
4. Section Copy actions
5. Wrap toggle, when applicable
6. Overflowing content region
7. Jump to latest, when present

Keyboard behavior:

- `Enter` and `Space` activate focused buttons.
- `Escape` closes F6.
- `Tab` and `Shift+Tab` stay inside F6.
- Arrow keys, Page Up/Down, Home, and End operate on the focused scroller.
- Native `Command/Ctrl+C` remains untouched when text is selected.
- Do not intercept browser Find, `Command+W`, or operating-system shortcuts.

Semantics:

- Use `<article>` with a visible heading; do not turn every card into a landmark or use `role="application"`.
- Code uses `<pre><code>`; output uses `<pre>`; text uses semantic headings, paragraphs, and lists.
- Token spans remain semantically neutral. Decorative prompts, fades, and future line numbers are hidden from assistive technology.
- Streaming output is not a live region. Announce only lifecycle transitions and Copy results.
- Accessible names begin with visible labels: `Copy command`, `Open code full screen`, `Close preview`.
- Status always combines text and shape/icon; never rely on color.
- Support 200% text enlargement, 320px reflow, portrait and landscape, VoiceOver, Voice Control, external keyboards, and RTL locales.
- Application chrome uses CSS logical properties. Code, shell commands, paths, hashes, and stack traces remain LTR and are never translated.

### Visual and motion system

- Canvas: bone `#f8f8f6` in light mode and the established dark parchment token in dark mode.
- Cards: near-canvas paper surface, carbon text, 16px radius, 1px boundary, no transcript drop shadow.
- Bash alone may use a warm-carbon Command/Output well to preserve shell genre; code and text remain parchment surfaces. Dark-mode wells require a visibly raised boundary rather than disappearing into the canvas.
- Inter for chrome; Source Serif 4 for prose; system monospace for command, output, and code.
- Clay `#d97757` is a restrained signature accent, not body text, status text, or the sole focus/error indicator. It is approximately 2.94:1 against bone and therefore cannot carry meaningful contrast alone (iter-03, iter-08).
- Meaningful text must meet 4.5:1; component boundaries, icons, and focus indicators meet 3:1.
- Focus uses a two-color ring equivalent to at least a 2px perimeter plus offset.

Motion:

- Button feedback: immediate tint and optional `.985` press scale over 90–120ms.
- Copy icon/label: 120ms crossfade; no bounce or toast.
- Viewer: opacity plus `translateY(8px → 0)` over 220ms; exit over 180ms.
- No scale-from-0.8 modal, overshoot spring, full-screen blur, animated height, or per-line streaming animation.
- Under `prefers-reduced-motion: reduce`, remove translation, rotation, scale, and height animation; use an instant change or opacity-only transition of at most 100ms.

### Objective acceptance gates

The build is complete only when all of the following pass:

1. Concurrent and out-of-order shell fixtures pair only by `callId`; duplicate replay produces one card per block.
2. Revision 8 arriving after revision 9 cannot replace revision 9.
3. Every Copy value is string-equal to its canonical redacted source, including tabs, emoji, RTL text, leading spaces, and final newline.
4. Labels, synthetic `$`, fences, line numbers, truncation text, and hidden DOM never enter the clipboard.
5. Optimistic user prompts and unknown blocks expose neither Copy nor Open.
6. Opening, copying, wrapping, and closing produce zero network requests, host-file calls, mutation frames, or mutation tickets.
7. Redaction fixtures expose secrets only as redaction markers in DOM, accessibility text, clipboard data, worker messages, and caches.
8. Malicious HTML, scripts, language identifiers, ANSI sequences, bidi controls, and Markdown links cannot create executable DOM or styles.
9. Every visible action reports a hit box of at least 44×44px.
10. At 320, 390, and 430 CSS-pixel widths and 200% text, only code regions may scroll horizontally.
11. F6 traps focus, closes through Close/Escape/Back, restores focus, and restores transcript scroll within 1px.
12. Long press produces native selection; dragging or scrolling from a button does not activate it.
13. Streaming produces no continuous VoiceOver announcements and does not move a reader who left the tail.
14. Reduced-motion mode runs no transform, rotation, spring, or height animation.
15. Light and dark themes pass automated and manual text/non-text contrast checks, including syntax and shell-well tokens.
16. A large-block fixture skips highlighting, opens promptly, remains selectable, and copies the complete received payload.
17. Opening F6 does not change the virtualized row height or live-edge state.
18. Repository checks find no new Run, Retry, Edit, Approve, Download, Publish, Open-on-host, Share-file, raw-HTML, or filesystem affordance.

## 3. Consensus vs divergence

### Consensus

All ten passes converge on these requirements:

- Use a two-level hierarchy: bounded transcript preview followed by a dedicated inspection surface (iter-01, iter-02, iter-06, iter-09).
- Promote shell calls/results into a semantic paired card and preserve quiet Activity grouping for routine tools (iter-01, iter-05, iter-06, iter-10).
- Pair by stable protocol identity and reconcile by revision; adjacency is unsafe (iter-01, iter-04, iter-05, iter-06).
- Provide always-visible, block-local Copy and Open actions with 44×44 targets; hover, More-only, and long-press-only controls fail on iPhone (iter-02, iter-03, iter-09, iter-10).
- Copy canonical already-redacted strings rather than rendered DOM and surface clipboard rejection (all passes).
- Reuse one React Aria F6 viewer rather than inline-expanding large virtualized rows or using the browser Fullscreen API (iter-02, iter-05, iter-06, iter-08).
- Never auto-open, edit, execute, download, publish, share as a file, or fetch richer host content (iter-01, iter-06, iter-07, iter-09).
- Preserve native selection, explicit dismissal, focus restoration, safe areas, reduced motion, and scroll position (iter-02, iter-03, iter-10).
- Keep streaming geometry stable and highlight only bounded, settled code with an immediate plaintext fallback (iter-04, iter-05, iter-08).

### Strong minority ideas retained

- **Redaction provenance badge:** retain transmitted reason categories such as `path` or `secret` and show them quietly in F6. This improves honesty without revealing removed values (iter-01, iter-07).
- **Bidi/control-character warning:** detect bidirectional controls and offer a read-only `Show invisible characters` presentation while keeping Copy byte-faithful (iter-03, iter-07).
- **Tail-first shell preview:** use the output tail inline because test summaries and exit context usually occur there; completed F6 views still open at the top (iter-02, iter-04).
- **Wrap toggle in F6:** source code remains unwrapped by default, but a local-only wrap control materially improves magnified iPhone reading (iter-01, iter-03, iter-05).
- **Snapshot mode:** if live revision updates repeatedly destroy selection on physical iPhones, add `Snapshot` and `View latest` rather than compromising review stability (iter-04).
- **No-highlighter fallback:** plaintext is a permanent supported renderer, not an error state. It may become the initial release if worker size or device performance misses the budget (iter-05, iter-06, iter-08).
- **Header-only swipe dismissal:** keep as a later, device-tested enhancement for text/code only. It remains out of the first build because Close, Back, and Escape already cover dismissal safely (iter-02, iter-08, iter-10).
- **Sanitized Copy:** a future secondary `Copy sanitized` action could remove bidi controls and additional secret patterns. It must never silently replace verbatim Copy or create a clipboard value different from its label (iter-07).

## 4. Security & redaction

Rich blocks are projections of the redacted ledger, not a new data plane. The relay must redact before persistence, replay, caching, broadcast, worker processing, rendering, and clipboard export. Components receive no host paths, lazy loaders, raw-event callbacks, file handles, download URLs, or unredacted variants.

Security rules:

- Propagate redaction metadata instead of dropping it. When metadata says fields were removed, F6 may show `Redacted · path, secret`; missing metadata must never be described as `Unredacted`.
- Copy and F6 use only the committed block’s current authoritative redacted revision.
- More-redacted higher revisions immediately replace older content and clear stale Copy success state.
- No payload is placed in a URL, history entry, analytics event, push notification, persistent highlight cache, hidden DOM attribute, or error report.
- Copy is `text/plain` only. Pi Remote never reads the clipboard and never creates a `File`, Blob download, object URL, or Web Share file payload.
- Cached transcript content may be viewed only under the existing retention policy and is visibly labelled stale; this feature introduces no new transcript persistence.
- Redaction markers are immutable text, never reveal controls.
- Raw HTML and executable artifact previews are forbidden. Redaction removes sensitive strings; it does not make markup trustworthy.
- Clipboard export is an explicit exfiltration boundary: iOS’s general and Universal Clipboard can expose even redacted content to other apps and devices. This must be covered by product threat modelling and release notes (iter-07).

This feature adds no mutation control. There is no Run, Retry, Approve, Apply, Edit, Upload, or Open-on-host action, so Copy/Open never request or consume a mutation ticket. Manually pasting copied text into the existing composer remains an ordinary prompt submission through the existing one-use ticket and revision-checked path; host/extension-enforced plan mode and mutation-family gates remain authoritative. Any future direct command replay would be a separate feature requiring an exact-action one-use ticket, matching base revision, explicit confirmation, and host/extension approval—it cannot be added as card chrome.

## 5. Open questions + risks

### Human decisions before build

1. **Protocol identity:** expose stable `callId`, `revision`, terminal checkpoint, and shell genre on display blocks. Without them, paired cards must not ship.
2. **Redaction gaps:** decide whether relative paths, URL-embedded credentials, AWS/JWT-style tokens, and secrets split across streamed deltas must be covered by a new relay policy before enabling tool-output Copy.
3. **Clipboard threat model:** decide whether Universal Clipboard on shared Apple accounts is accepted, requires a first-use warning, or blocks shell-output Copy entirely.
4. **Artifact classification:** confirm whether prompt/goal/artifact intent is transmitted. If not, approve the 16-line/1,200-character heuristic and `Long text` label.
5. **F6 ownership:** confirm which existing layer owns history entries, focus restoration, safe areas, scroll locking, and Back handling so the adapter does not create duplicate behavior.
6. **ANSI and bidi contract:** decide whether Copy preserves canonical control bytes, copies normalized visible text, or offers both explicit variants. Silent transformation is not acceptable.

### Risks to resolve during build

7. **Status fidelity:** exit code, cancellation, stdout/stderr separation, duration, and upstream truncation may not exist. The UI must omit rather than infer them.
8. **Large-block budget:** validate the proposed 20,000-character/1,000-line highlighting cutoff and main-thread budget on the oldest supported physical iPhone.
9. **Selection versus live revision:** test whether higher-revision DOM updates break iOS selection; use snapshot mode if necessary.
10. **Secure origin:** verify Clipboard API behavior in Safari and installed standalone mode over the production Tailscale HTTPS origin. Failure must remain selectable and visible.
11. **Dynamic Type:** verify Inter and Source Serif retain iOS text scaling; otherwise add an explicit local text-size preference.
12. **Viewport behavior:** test `viewport-fit=cover`, orientation, software-keyboard dismissal, safe areas, and visual-viewport recovery on physical devices.
13. **Authenticated benchmark review:** Mobbin screen URLs were available, but most passes lacked authenticated screen inspection. Re-measure current Claude iOS and Kimi mobile-width flows before pixel-level visual sign-off.
14. **Existing cache schema:** older cached blocks may lack redaction metadata, call IDs, or revisions. They need a safe compatibility state rather than guessed pairing.

## 6. Sources

### Product and platform

- [Claude Artifacts](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them)
- [Claude Artifacts on mobile](https://claude.com/blog/build-artifacts)
- [Kimi Code Web UI](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html)
- [Kimi Code tools](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/tools.html)
- [ChatGPT writing and code blocks](https://help.openai.com/en/articles/20001246-working-with-writing-blocks-and-code-blocks-in-chatgpt)
- [Apple HIG: Modality](https://developer.apple.com/design/human-interface-guidelines/modality)
- [Apple HIG: Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [Apple HIG: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [React Aria Modal](https://react-aria.adobe.com/Modal)
- [React Aria Disclosure](https://react-aria.adobe.com/Disclosure)
- [WAI-ARIA modal-dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WebKit Async Clipboard API](https://webkit.org/blog/10855/async-clipboard-api/)
- [WebKit iPhone safe-area guidance](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [Shiki performance guidance](https://shiki.style/guide/best-performance)
- [Shiki fine-grained bundles](https://shiki.style/guide/bundles)

### Open-source prior art

- [MoonshotAI/kimi-code](https://github.com/MoonshotAI/kimi-code)
- [OpenCode message/tool renderers](https://github.com/anomalyco/opencode/blob/7daea69e/packages/ui/src/components/message-part.tsx)
- [1Code Bash card](https://github.com/21st-dev/1code/blob/main/src/renderer/features/agents/ui/agent-bash-tool.tsx)
- [Pi’s Bash execution component](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/src/modes/interactive/components/bash-execution.ts)
- [LibreChat artifact-card behavior](https://github.com/danny-avila/LibreChat/pull/12961)
- [Happy mobile Copy failure](https://github.com/slopus/happy/issues/841)
- [Harness Remote](https://github.com/giuliastro/harness-remote)
- [OpenCodex](https://github.com/mjmkk/opencodex)
- [CC Pocket](https://github.com/K9i-0/ccpocket)

### Security

- [Apple Universal Clipboard](https://support.apple.com/en-us/102430)
- [Apple Handoff and Universal Clipboard security](https://support.apple.com/guide/security/handoff-security-secf78dbe639/web)
- [OWASP iOS pasteboard guidance](https://mas.owasp.org/MASTG/knowledge/ios/MASVS-PLATFORM/MASTG-KNOW-0083/)
- [Trojan Source](https://trojansource.codes/)
- [Unicode source-code handling](https://www.unicode.org/reports/tr55/)
- [rehype-sanitize](https://github.com/rehypejs/rehype-sanitize)

### Mobbin references

- [Claude iOS coding-input flow](https://mobbin.com/explore/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b)
- [Claude iOS text-input flow](https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57)
- [Claude Web code preview — desktop anti-target](https://mobbin.com/explore/screens/1a33eaae-c123-4c39-82bc-e42df38209d3)
- [ChatGPT iOS chat](https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1)
- [Gemini iOS structured-card reference](https://mobbin.com/explore/screens/a7a9fe4a-4817-4b22-ad5b-0a1e17c447d8)
