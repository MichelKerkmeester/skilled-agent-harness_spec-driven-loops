<!-- provenance: external-CLI orchestration pass; original file iter-04-sol.md -->
> **Source pass 4** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-4-sol.md`.

<!-- F7-rich-content-blocks | model=sol | lens=edge-failure | iter 4/10 | 2026-08-16T04:26:46.939Z -->

# Pi Remote rich content blocks — edge-failure research pass

## 1. Findings for the edge-failure lens

### Failure states must remain distinct

Pi Remote should not collapse transport loss, authentication failure, incomplete execution, renderer failure, and empty output into a generic “Something went wrong.” They imply different facts and remedies:

- `navigator.onLine` is only a hint: it may report online when the Pi host, Tailscale route, or service is unreachable. The actual transcript connection must be authoritative. [MDN explicitly describes `navigator.onLine` as inherently unreliable](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine).
- An HTTP `401` or `403` can be labeled as access failure; a timeout or failed WebSocket/SSE connection cannot reliably be called “permission denied.” Tailscale lists the host service, device reachability, firewall, port, and ACL policy as separate possible failure points. [Tailscale connectivity guidance](https://tailscale.com/kb/1452/connect-to-devices).
- A completed command with zero output is not a loading command. An interrupted command is not a failed command unless Pi supplied a terminal failure outcome.
- Syntax-highlighting failure is a presentation failure, not content loss. The unhighlighted source remains usable.

Apple recommends placing errors near the problem and stating what the person can do next rather than showing opaque error codes. [Apple HIG: Writing](https://developer.apple.com/design/human-interface-guidelines/writing).

### Lossless recovery is the relevant mobile-agent precedent

Mobile coding clients treat reconnection as a transcript-reconciliation problem:

- CC Pocket advertises recovery of missed streaming updates after reconnecting. [CC Pocket](https://github.com/K9i-0/ccpocket).
- OpenCodex uses cursor-based SSE recovery, sequence numbers, ping/pong, and event batching to prevent UI lag. [OpenCodex](https://github.com/mjmkk/opencodex).
- Remotty provides replay after reconnect and specifically targets connection loss caused by an iPhone screen lock. [Remotty](https://github.com/mirkomaselli/remotty).

Therefore, reconnecting Pi Remote must merge by stable block identity and revision, not append whatever is replayed. A duplicate command card after waking the phone is a data-integrity defect, not merely visual noise.

### The last trustworthy content should survive degradation

When connectivity is lost, already-rendered and already-redacted blocks should remain readable, expandable, selectable, and copyable. Replacing the transcript with a full-screen offline error destroys the primary value of a remote supervisor.

This does not automatically justify persistent offline transcript storage. Service-worker caches are origin-wide, can retain outdated content, and require explicit eviction strategy. [web.dev: PWA caching](https://web.dev/learn/pwa/caching). The safe baseline is:

1. Preserve the mounted in-memory transcript through transient connection loss.
2. Rehydrate persisted transcript data only if Pi Remote already has an approved encrypted/local-storage policy.
3. Cache the application shell separately from sensitive transcript payloads.

### Copy is fallible even though it is read-only

Clipboard writing requires a secure context and can still reject. Safari/WebKit also requires the write to occur directly within a user gesture; deferring it through unrelated asynchronous work can lose transient activation. [MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API), [WebKit Async Clipboard API](https://webkit.org/blog/10855/async-clipboard-api/).

Consequences:

- Invoke `navigator.clipboard.writeText(snapshot)` directly from the React Aria `onPress` path.
- Copy the canonical redacted string, not `innerText` from syntax-highlighted DOM.
- Catch every rejection; never display “Copied” optimistically.
- Preserve normal text selection so long-press and the iOS selection menu remain a fallback.
- Do not query `clipboard-write` permission first; Safari does not implement the same persistent permission model as Chromium.

Tailscale Serve can provide the HTTPS origin needed by clipboard and service-worker APIs without making the PWA public. [Tailscale Serve](https://tailscale.com/docs/features/tailscale-serve).

### Streaming content and syntax highlighting are hostile unless staged

Repeatedly rebuilding highlighted DOM while code streams can:

- Destroy an active text selection.
- Move the user’s reading position.
- Let an older async highlighting result replace newer content.
- Block the main thread on large blocks.

React’s documentation explicitly warns that asynchronous results may arrive in a different order and recommends cleanup/ignore guards. [React `useEffect`](https://react.dev/reference/react/useEffect). Shiki describes highlighter construction as expensive, recommends a shared instance and fine-grained bundles, and suggests workers for CPU-heavy highlighting. [Shiki performance guidance](https://shiki.style/guide/best-performance).

The robust staging rule is: render incomplete fenced code immediately as plain monospace text; apply highlighting only after the fence/block becomes terminal. Unknown grammar, missing offline chunk, CSP/WASM failure, or worker failure must leave the plain-text rendering intact.

### Full-screen viewing must not become a second fetch path

Opening a block should pass its existing redacted payload into the F6 viewer shell. It must not:

- Read the host filesystem.
- Re-request a file by path.
- Re-execute a tool.
- Exchange a mutation ticket.
- Replace redacted transcript text with fresher unredacted source.

React Aria’s modal primitives provide modality, controlled open state, dismiss behavior, and visual-viewport dimensions for layouts affected by the iOS software keyboard. [React Aria Modal](https://react-aria.adobe.com/Modal). Safe-area padding is still required around the Dynamic Island, rounded corners, and Home indicator. [WebKit safe-area guidance](https://webkit.org/blog/7929/designing-websites-for-iphone-x/).

### Quiet status feedback is preferable to repeated alerts

The transcript is sequential information, so `role="log"` is appropriate and carries implicit polite live-region behavior. [WAI-ARIA `log` role](https://www.w3.org/TR/wai-aria/#log). However, announcing every streamed token or output line would overwhelm VoiceOver.

Announce only semantic transitions:

- “Command started.”
- “Command completed with no output.”
- “Command failed, exit code 1.”
- “Connection lost; output may be incomplete.”
- “Copied.”
- “Copy failed.”

WCAG 2.2 requires status changes to be programmatically available without moving focus. [WCAG 2.2, 4.1.3](https://www.w3.org/TR/WCAG22/).

## 2. Concrete spec contribution for the build phase

### 2.1 Canonical state model

Each block must retain:

```text
sessionId
blockId
kind: command | output | code | text-artifact
revision: monotonically increasing integer
sequence: transcript ordering key
lifecycle: assembling | complete | failed | stopped | interrupted
redactedText
language?
exitCode?
startedAt?
finishedAt?
```

Reconciliation rules:

1. Key tool activity by `sessionId + callId`; never by array position.
2. Ignore duplicate `(blockId, revision)` updates.
3. Ignore a revision lower than the rendered revision.
4. Replace/merge an equal block only when the revision increases.
5. Abort or ignore pending parse/highlight work when the session, block revision, language, or theme changes.
6. A result received before its call creates a temporary “Output received — command details loading” card. Merge when the call arrives.
7. After the server’s synchronization checkpoint, an unmatched result becomes “Command unavailable” rather than disappearing.
8. Replayed data may update blocks but must not reopen disclosures, move focus, or reset transcript scroll.

### 2.2 Transcript-level states

| Condition | Exact presentation | Available actions |
|---|---|---|
| Initial request pending, no local transcript | Card-shaped skeletons with `aria-label="Loading transcript"`; no fake command text | None |
| Successful empty transcript | “No transcript yet.” | Existing navigation only |
| Reconnecting with content present | Non-modal top strip: “Reconnecting… Showing the latest received transcript.” | Continue reading, Copy, Open |
| Connection failed with content present | “Can’t reach Pi — showing the latest received transcript.” Secondary line: “Check Tailscale and the host.” | `Try again` performs read-only reconnect |
| Offline hint only | “Network appears offline.” Do not disable local block actions | Copy, Open |
| Reloaded offline with no approved transcript cache | “Pi Remote is offline. Reconnect to load this transcript.” | `Try again` |
| HTTP 401 | “Session access expired.” | Existing reconnect/auth flow |
| HTTP 403 | “This device isn’t allowed to view this session.” | No automatic retry loop |
| Malformed transcript envelope | “This transcript couldn’t be displayed safely.” | `Try again`; retain no unsafe raw payload |

Do not label an opaque network failure as an ACL denial. Tailscale ACLs are deny-by-default when configured and apply to Serve, but network-level denial is not reliably distinguishable in browser JavaScript from other reachability failures. [Tailscale access control](https://tailscale.com/docs/features/access-control).

### 2.3 Command/Output card states

| Pi state | Card status | Body behavior |
|---|---|---|
| Tool call received, no result, connection healthy | `Running` with subdued indeterminate indicator | Command visible; body says “Waiting for output…” |
| Tool call received, connection lost | `Connection lost` | Preserve received bytes; “Output may be incomplete.” |
| Success with nonempty output | `Completed` | Tail preview, Copy, Open full-screen |
| Success with exactly zero characters | `Completed · No output` | No empty black rectangle; Copy disabled |
| Whitespace-only output | `Completed · Whitespace-only output` | Show character count; full-screen preserves whitespace; Copy enabled |
| Supplied nonzero exit code | `Failed · Exit N` | Preserve stdout/stderr and Copy/Open |
| Pi reports cancellation | `Stopped` | Preserve partial output |
| Stream ends without terminal outcome | `Output interrupted` | Do not infer success or failure |
| Result exists but command is permanently absent | `Command unavailable` | Output remains readable |
| Unsupported tool payload | `Can’t display this activity` | Show only approved redacted `displayText`; never dump the raw envelope |

Preview rules:

- Command preview: maximum 3 visual lines; never silently remove the command’s tail. Add “Open full command” when clipped.
- Output preview: latest 12 logical lines, because terminal status usually appears at the tail. Prepend “184 earlier lines” when truncated.
- Copy always copies the complete canonical redacted command or output, not the preview.
- While running, label the action `Copy current output`; success feedback is `Copied current output`.
- ANSI control sequences must never become executable HTML. Unsupported sequences are ignored or rendered literally according to the existing sanitized transcript contract.

### 2.4 Code-block states

| Condition | Required rendering |
|---|---|
| Fence still streaming | Immediate plain monospace text; label `Receiving code…`; no re-highlighting |
| Complete, highlighter pending | Plain text remains visible; no skeleton |
| Supported language | Replace with highlighted tokens without changing padding, font metrics, or scroll offset |
| Missing/unknown language | Plain text; label `Plain text` or the supplied language name |
| Highlighter load/worker failure | Plain text plus quiet `Syntax highlighting unavailable` status |
| Empty fence | `Empty code block`; Copy disabled with `aria-describedby="Nothing to copy"` |
| More than 2,000 lines or 200 KiB | Skip inline highlighting; use chunked plain-text viewer and label `Large code block` |
| Truncated upstream payload | `Code may be incomplete`; never add a synthetic closing fence |

Prebundle the common grammar set needed offline: shell/bash, JavaScript, TypeScript, JSX, TSX, JSON, HTML, CSS, Markdown, Python, Go, Rust, YAML, SQL, and plain text. Fine-grained Shiki bundles reduce browser memory and bundle overhead compared with the full bundle. [Shiki bundles](https://shiki.style/guide/bundles).

Inline preview is 16 logical lines. Its footer says, for example, `Open full code · 142 lines`. Code remains inside its own horizontal scroller; it must not create page-level horizontal scrolling. WCAG permits localized two-dimensional scrolling where indentation is important, but the remainder of the page must reflow. [WCAG reflow guidance for code](https://www.w3.org/WAI/WCAG21/Understanding/reflow).

### 2.5 Text/prompt artifact states

Create an artifact card when redacted text exceeds either 640 characters or 8 rendered lines.

- Header: `Prompt`, `Goal`, or `Text artifact` from trusted transcript metadata.
- Preview: first 8 lines, followed by a visible truncation indicator and exact total character count.
- Empty value: `Empty text artifact`; Copy disabled.
- Incomplete streamed value: `Receiving text…`; Copy action becomes `Copy current text`.
- Upstream truncation: `Text may be incomplete`.
- Copy uses the complete redacted source, including content hidden by the preview.
- Full-screen text uses Source Serif 4 for prose and preserves paragraphs, lists, and explicit line breaks; untrusted embedded HTML remains text.

### 2.6 Gestures and hit targets

Use separate sibling controls; do not nest Copy/Open buttons inside a card-wide button.

- Primary header `Disclosure` button: tap toggles the inline preview.
- `Copy` button: one tap, no confirmation.
- `Open full-screen` button: one tap.
- Long-press text: native selection fallback.
- Full-screen viewer: explicit top-left Close, top-right Copy.
- Escape closes with an external keyboard.
- A downward swipe may close only as an enhancement; Close must remain available because Apple recommends an onscreen alternative to gestures. [Apple HIG: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility/).

All three card controls require at least a 44×44 CSS-pixel hit region, following Apple’s iPhone target recommendation, exceeding WCAG 2.2’s 24×24 minimum. [Apple HIG: Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons), [WCAG target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

### 2.7 F6 full-screen viewer behavior

- Build with React Aria `DialogTrigger`, `ModalOverlay`, `Modal`, and `Dialog`.
- Use controlled open state keyed by `sessionId + blockId`.
- Size from React Aria’s visual-viewport variables, not only `100vh`.
- Apply `max(16px, env(safe-area-inset-*)))` around toolbar content.
- Full-screen viewer opening must perform zero transcript, filesystem, or mutation requests.
- Focus enters on Close; closing restores focus to the exact originating Open button.
- Transcript scroll position remains unchanged.
- If the source block disappears during session reconciliation, keep the viewer’s last trustworthy snapshot and show `This block is no longer in the current transcript`.
- If output appends while the viewer is at its bottom, follow it.
- If the user scrolls away, selects text, or VoiceOver focus enters the content, stop auto-following and show `12 new lines` as a button.
- Never replace selected code DOM with a newly highlighted tree.
- Copy snapshots `redactedText` at press time so a concurrent stream append cannot alter what the success message refers to.

### 2.8 Accessibility semantics

- Transcript container: `role="log"`, `aria-live="polite"`, `aria-relevant="additions"`.
- Mark a streaming block `aria-busy="true"`, but do not expose each token through the live region.
- Command card: labeled `section`.
- Disclosure control: `aria-expanded` and `aria-controls`.
- Icon-only controls: exact labels such as `Copy command`, `Copy output`, and `Open code full-screen`.
- Horizontally scrollable `<pre>`: keyboard-focusable with `aria-label="Code, TypeScript, 142 lines"`.
- Status changes use a pre-mounted `role="status"`.
- User-triggered copy failure may use `role="alert"` once; reconnect churn remains polite.
- Running, failed, interrupted, and complete states require text plus icon/shape; clay/red coloring alone is insufficient.
- Dynamic status messages must not take focus. [W3C status-message failure guidance](https://www.w3.org/WAI/WCAG22/Techniques/failures/F103.html).

### 2.9 Visual and motion behavior

- Preserve the fixed parchment/carbon/clay system; failure states use carbon text plus icon and border treatment, not a new saturated danger palette.
- Skeletons use low-contrast parchment tonal shifts and disappear as a unit; they must not pulse indefinitely after a terminal error.
- Disclosure: 160 ms opacity/height transition.
- Full-screen viewer: 180 ms fade plus 8 px vertical translation.
- Copy success: icon morph or opacity change only; no confetti, bounce, or haptic dependency.
- Under `prefers-reduced-motion: reduce`, remove translation and height animation; use a ≤100 ms opacity change. The media feature reflects the system preference, and Apple recommends replacing large movement with fades or color shifts. [MDN `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion), [Apple HIG: Motion](https://developer.apple.com/design/human-interface-guidelines/motion).

### 2.10 Copy feedback

State machine:

```text
idle → copying → copied
idle → copying → failed
copied/failed → idle on next copy or after focus leaves the block
```

- `copying` must not survive longer than the clipboard promise.
- Success: button label and status become `Copied`.
- Failure: persistent inline message, `Couldn’t copy. Press and hold the text to select it.`
- Do not automatically retry; a retry outside the original gesture is likely to be rejected by WebKit.
- Do not clear selection or close the viewer after Copy.
- Empty content: disabled Copy control with an accessible explanation.

### 2.11 Objective acceptance checks

| Check | Pass condition |
|---|---|
| Duplicate replay | Replaying every event twice produces one card per `blockId` |
| Revision race | Revision 8 arriving after revision 9 leaves revision 9 visible |
| Session switch race | A delayed highlight/fetch from session A cannot update session B |
| Result-before-call | Result remains visible and later merges with its call |
| Zero output | Exact empty string renders `Completed · No output`, never a spinner |
| Interrupted output | Disconnect preserves received output and does not show `Completed` |
| Unknown grammar | Source appears immediately as selectable plain text |
| Large code | A 200 KiB fixture remains interactive; inline highlighting is skipped |
| Streaming selection | Selecting text prevents DOM replacement and auto-follow |
| Copy race | Appending output during Copy does not change the copied snapshot |
| Clipboard denial | Rejected `writeText` displays the manual-selection fallback |
| Offline with mounted data | Every existing Copy/Open action remains usable |
| HTTP 403 | No infinite automatic retry and no generic offline label |
| Full-screen network isolation | Opening, copying, and closing causes zero network requests |
| Security | `<script>`, ANSI escapes, and Markdown HTML fixtures cannot create executable DOM |
| Focus restoration | Closing returns focus to the originating Open button |
| Safe area | Toolbar controls remain outside all iPhone safe-area insets in portrait and landscape |
| Reflow | At 320 CSS px, only individual code/output surfaces scroll horizontally |
| VoiceOver | A running block announces only semantic lifecycle transitions, not streamed tokens |
| Reduced motion | No translation, scale, spring, or animated height under reduced motion |
| Stale PWA schema | Unsupported cached transcript schema fails closed with a readable compatibility state |

## 3. Divergent / minority ideas worth considering

### Snapshot full-screen mode

Instead of a live viewer, freeze the exact block revision when Open is pressed and show `Snapshot from 14:32:08`. This eliminates selection destruction and scroll races entirely. A separate `View latest` action replaces the snapshot. It is less “live,” but may be superior for careful review of fast terminal output.

### Tail-first command cards

Show the last 12 lines of terminal output rather than the beginning. This diverges from document-style artifacts but matches the supervisory task: exit summaries, failing tests, and final paths usually appear at the tail. Preserve a visible `184 earlier lines` marker so the omission is never ambiguous.

### Never toast Copy

Keep feedback entirely in the initiating button: `Copy` → `Copied`, with the shared live region for assistive technology. This avoids transient overlays covering code and follows Apple’s caution around time-boxed interface elements. [Apple HIG: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility/).

### Copy disabled until completion

For running commands, disable Copy rather than offering `Copy current output`. This prevents users from mistaking a partial log for a complete artifact. The tradeoff is losing a useful emergency escape hatch during a long or stuck command.

### Plain text by default on mobile

Highlight code only after the user opens it full-screen. Inline transcript cards remain fast, stable, and highly selectable. Kimi documents code recognition/highlighting and one-click message copy, but that does not require every inline preview to initialize a highlighter. [Kimi Web UI](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html).

### Explicit uncertainty edge

Use a broken/dashed bottom border on any interrupted or upstream-truncated block. This makes “the end of this card is not the end of the process” perceivable without relying only on microcopy or color.

## 4. Open questions and risks

1. Does Pi’s transcript contract already provide stable call IDs, sequence numbers, terminal outcomes, exit codes, and monotonic revisions? Without them, lossless replay reconciliation cannot be guaranteed.
2. Is `redactedText` a canonical field, or does the client currently reconstruct display text from a richer payload? Copy must never bypass the existing redaction boundary.
3. Are stdout and stderr distinguishable? If not, the UI must not invent separate stream labels.
4. Can a resumed transcript contain a result without its original call? The orphan-result state needs a defined synchronization checkpoint.
5. Does F6 already restore focus and transcript scroll, or must the viewer adapter add that behavior?
6. Is any transcript persisted locally today? Adding offline persistence would require an explicit retention, encryption, eviction, and device-sharing review.
7. What maximum transcript/block sizes occur in production? The proposed 2,000-line/200-KiB highlighting limit should be validated against real redacted telemetry.
8. Does the current service worker cache lazy syntax-language chunks? If not, offline highlighting must reliably fall back to plain text.
9. How are stale app-shell and transcript-schema combinations detected? The service-worker lifecycle intentionally allows an old and waiting new worker to coexist, so schema compatibility must be explicit. [web.dev: service-worker lifecycle](https://web.dev/articles/service-worker-lifecycle).
10. Should terminal previews preserve ANSI color? Supporting it increases parser and contrast-testing scope; stripping ANSI is safer and more consistent with parchment styling.
11. Mobbin’s public index did not expose a stable, inspectable Claude or Kimi code-block/error-flow screen during this pass. Claude/Kimi visual-parity claims should therefore be verified separately against captured, licensed Mobbin flows or physical apps rather than inferred here.

## 5. Sources

- [Apple Human Interface Guidelines — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility/)
- [Apple Human Interface Guidelines — Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [Apple Human Interface Guidelines — Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Apple Human Interface Guidelines — Writing](https://developer.apple.com/design/human-interface-guidelines/writing)
- [React Aria — Modal](https://react-aria.adobe.com/Modal)
- [React — `useEffect` race-condition guidance](https://react.dev/reference/react/useEffect)
- [MDN — Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [WebKit — Async Clipboard API](https://webkit.org/blog/10855/async-clipboard-api/)
- [MDN — `navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)
- [MDN — `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)
- [WebKit — iPhone safe-area insets](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WAI-ARIA — `log` role](https://www.w3.org/TR/wai-aria/#log)
- [WCAG — Reflow and code](https://www.w3.org/WAI/WCAG21/Understanding/reflow)
- [WCAG — Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [Shiki — Best Performance Practices](https://shiki.style/guide/best-performance)
- [Shiki — Bundles](https://shiki.style/guide/bundles)
- [web.dev — PWA caching](https://web.dev/learn/pwa/caching)
- [web.dev — Service-worker lifecycle](https://web.dev/articles/service-worker-lifecycle)
- [Tailscale — Connect to devices](https://tailscale.com/kb/1452/connect-to-devices)
- [Tailscale — Access control](https://tailscale.com/docs/features/access-control)
- [Tailscale — Serve](https://tailscale.com/docs/features/tailscale-serve)
- [Kimi Code Web UI documentation](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html)
- [MoonshotAI/Kimi Code](https://github.com/MoonshotAI/kimi-code)
- [CC Pocket](https://github.com/K9i-0/ccpocket)
- [OpenCodex](https://github.com/mjmkk/opencodex)
- [Remotty](https://github.com/mirkomaselli/remotty)
- [Happy — mobile/web client for Claude Code and Codex](https://github.com/slopus/happy)
