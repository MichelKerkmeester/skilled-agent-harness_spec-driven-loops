<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: phase -->

# F7 — Rich Content Blocks

> One-line summary: render redacted shell activity, fenced code, and substantial text as compact Claude-style cards with exact Copy actions and a shared F6 full-screen read surface.

## DECISION

Build three typed, read-only transcript projections: paired Bash Command/Output cards, fenced-code cards, and explicit or substantial text-artifact cards. Each card gets a bounded inline preview, unit-level Copy controls, and an explicit Open action into the shared F6 full-screen viewer. Shell activity leaves the quiet Activity group; routine tools remain grouped. Syntax highlighting is progressive and bounded: plaintext is always immediate, settled supported code may be highlighted in a worker, and large or unsupported content remains fully usable as plaintext.

This adopts Claude’s transcript-to-inspection hierarchy and Kimi’s stable semantic shell rendering without adding desktop side panels, auto-open behavior, editing, execution, download, publishing, sharing as a file, or host-file access. It remains entirely over already-redacted content and preserves Pi Remote’s read-only-by-default, one-use-ticketed, revision-checked mutation posture.

## Problem and goal

Pi Remote currently exposes tool calls and results as quiet grouped Activity, renders assistant text as ordinary Source Serif prose, and has no Copy or full-screen affordance for commands, code, or substantial text. The operator must be able to inspect the content pi already sends without losing transcript context, copying generated UI text, or turning displayed model content into a host read.

The goal is a deliberately small two-level interaction:

1. A user sees a stable, full-width inline card with a useful preview and explicit actions.
2. Copy exports only the named canonical redacted unit.
3. Open moves the same committed redacted snapshot into the existing F6 full-screen viewer.
4. Close, Back, Escape, or VoiceOver dismissal returns the user to the same transcript location and focus target.
5. Streaming, replay, stale cache, malformed payloads, truncation, clipboard failure, and relay loss are visible states rather than inferred or silently repaired states.

The fixed product constraints remain authoritative: ink-on-parchment surfaces, bone `#f8f8f6`, carbon ink, clay `#d97757`, Inter, Source Serif 4, light and dark themes, WCAG AA, 320px reflow, and the existing host/extension-enforced plan-mode and mutation gates.

## Current state

- `packages/pi-rpc-protocol/src/types.ts` has `TextBlock`, `ToolCallBlock`, `ToolResultBlock`, and `FileDiffBlock`, but tool call/result identity and shell lifecycle metadata are not sufficient for a safe rich projection contract.
- `packages/pi-rpc-protocol/src/guards.ts` validates the existing transcript union. Rich-capable fields need bounded guards and a safe legacy path.
- `apps/pi-remote-relay/src/store/transcript-projector.ts` produces revisable redacted transcript blocks, but the web-facing tool call/result shapes do not yet expose all identity, shell genre, terminal checkpoint, or truncation information needed by the cards.
- `apps/pi-remote-relay/src/store/redaction.ts` is the redaction boundary. Rich blocks must remain projections of its redacted ledger, not a second data path.
- `apps/pi-remote-relay/src/http/server.ts` already serves transcript pages through `/api/sessions/:sessionId/transcript` and the read-only sync socket through `/api/sync`. F7 adds no rich-content or host-file endpoint.
- `apps/pi-remote-web/src/App.tsx` renders transcript blocks and Activity disclosures inside a virtualized transcript. `apps/pi-remote-web/src/state.ts`, `src/turns.ts`, `src/relay.ts`, `src/cache.ts`, and `src/demo.ts` own state, transport, cache, and fixtures.
- `apps/pi-remote-web/src/SessionComposer.tsx` remains a prompt composer. Optimistic prompts are ordinary user bubbles and are not rich cards.
- F6 supplies the shared React Aria full-screen viewer shell. F7 supplies rich-content adaptation into that shell; it must not create a second modal or a parallel history/focus system.

## Desired end state

The transcript renders three typed projections from the same already-redacted envelopes:

| Source                                                 | Projection          | Inline action surface                                      |
| ------------------------------------------------------ | ------------------- | ---------------------------------------------------------- |
| Relay-authored Bash/shell call and result              | `CommandOutputCard` | `Copy command`, optional `Copy output`, `Open full screen` |
| Fenced code in settled or streaming assistant text     | `CodeCard`          | `Copy code`, `Open full screen`                            |
| Explicit artifact metadata or settled substantial text | `TextArtifactCard`  | `Copy text`, `Open full screen`                            |

The cards are previews, not new storage. The complete canonical redacted source stays in the committed block state for Copy and F6. The transcript remains virtualized and does not grow an inline thousands-of-lines pane. The card cannot run, edit, retry, approve, apply, download, publish, share as a file, or open anything on the host.

## Scope

### In scope for v1

- Protocol fields and guards for stable tool call identity, shell genre, authoritative lifecycle/checkpoint, output completeness, and explicit text-artifact metadata.
- A pure web normalizer between transcript envelopes and React rendering.
- Identity-only Bash call/result pairing, including concurrent, out-of-order, duplicate, result-before-call, stale-revision, and malformed states.
- A `CommandOutputCard` with separate Command and Output regions, bounded previews, lifecycle labels, unit-level Copy, and one explicit F6 Open action.
- A `CodeCard` for fenced code with language allowlisting, immediate plaintext, bounded progressive highlighting, exact Copy, and F6 Open.
- A `TextArtifactCard` for trusted prompt/goal/plan/document metadata and settled substantial text, with honest `Long text` labelling for heuristic promotion.
- One session-level F6 `ArtifactViewerProvider` integration with history, focus, scroll restoration, safe areas, full-bleed iPhone layout, and no browser Fullscreen API.
- Native selection, React Aria buttons, 44×44px action targets, keyboard support, VoiceOver/Voice Control semantics, RTL-safe application chrome, and 200% text enlargement.
- Exact clipboard behavior over canonical redacted strings, visible failure recovery, and one persistent polite status region.
- Strict safe Markdown rendering with no raw HTML, remote media, forms, iframes, executable previews, or unqualified navigation.
- Bounded worker-based syntax highlighting for a fixed language allowlist, with a permanent plaintext fallback.
- Light/dark visual treatment using the existing design system, reduced-motion behavior, 320/390/430px width checks, and oldest-supported-iPhone verification.
- Deterministic fixtures and tests for protocol guards, relay redaction, normalization, cards, clipboard, viewer lifecycle, accessibility, cache/service-worker behavior, security negatives, and CDP screenshots.

### Out of scope: v1 non-goals

- Run, Retry, Execute, Approve, Apply, Edit, Restore, Stage, or any other mutation action inside a card or viewer.
- Replaying a command from a card, creating a mutation ticket from Copy/Open, or bypassing the existing one-use ticket and revision-checked prompt path.
- A host-filesystem read, live file browser, path-derived request, file handle, lazy host loader, workspace explorer, or file-content fetch based on prose, command text, tool output, or a filename.
- A new artifact resource endpoint, public URL, shareable transcript URL, download, upload, publish, file share, Web Share file, Blob, object URL, or browser Fullscreen API use.
- Auto-opening, auto-following a viewer to a newer block, desktop side panels, split panes, centered desktop dialogs, iPad inspectors, galleries, detents, grabbers, backdrop dismissal, or custom swipe-down dismissal.
- Treating every long paragraph as an `Artifact`, reconstructing a file from a diff, or guessing language from filenames or punctuation.
- Persisting rich payloads or highlight output beyond the existing bounded redacted transcript retention policy.
- Syntax highlighting being a prerequisite for reading or copying code.
- A silent “sanitized Copy” variant that changes the canonical copied value. Any future transformed export must be a separately labelled feature.

## Data, identity, and routing contract

### Relay and protocol contract

Rich cards consume the redacted transcript ledger. The relay must publish enough authoritative information for the browser to render state without guessing. The existing transcript page and sync envelope remain the transport; no new read endpoint is introduced.

The protocol additions are:

- `ToolCallBlock` carries a bounded opaque `callId`, the relay-authored `toolName`, a `shellKind` of `bash`, `shell`, or `other`, the canonical redacted `inputSummary`, and an authoritative lifecycle/checkpoint value.
- `ToolResultBlock` carries the same bounded opaque `callId`, the canonical redacted `output`, the supplied error flag, the authoritative lifecycle/checkpoint value, and output completeness of `complete`, `upstream-truncated`, or `unknown`.
- A trusted `TextArtifactBlock` carries a relay-authored label of `prompt`, `goal`, `plan`, `document`, or `text`, plus the canonical redacted source. It is distinct from an optimistic user prompt.
- Existing legacy blocks without the rich fields remain valid for compatibility, but they are not eligible for a rich card. They stay in the existing Activity, prose, or safe fallback renderer.
- All new fields are bounded and guard-validated. Wrong types, unknown rich discriminants, invalid lifecycle values, missing paired identity, oversized strings, and malformed redaction metadata are rejected before rendering.
- `revision` is a positive monotonic number per stable block identity. `seq` remains transcript ordering. A higher revision can replace content; a duplicate or lower revision cannot.
- The relay continues to attach its existing redaction provenance (`policyVersion`, `fieldsRedacted`, `reasons`) to the envelope. Missing metadata is not described as “unredacted.”

The normalized web shape is conceptually:

```ts
type NormalizedRichBlock = Readonly<{
  sessionId: string;
  blockId: string;
  revision: number;
  sequence: number;
  source: 'relay' | 'cache' | 'optimistic';
  kind: 'command' | 'code' | 'text-artifact';
  sourceText: string;
  previewText: string;
  redaction: {
    policyVersion: number | null;
    fieldsRedacted: number | null;
    reasons: readonly string[];
  };
  lifecycle:
    | 'queued'
    | 'running'
    | 'succeeded'
    | 'failed'
    | 'denied'
    | 'cancelled'
    | 'interrupted'
    | 'unknown';
  outputCompleteness: 'complete' | 'upstream-truncated' | 'unknown';
  metadata: Readonly<Record<string, string | number | boolean>>;
}>;
```

`sourceText` is the canonical committed redacted string; `previewText` is only a presentation substring. Highlighted spans, Markdown AST nodes, line counts, truncation labels, generated prompts, decorative `$`, and status text are never canonical copy sources.

### Normalization and routing rules

| Transcript input                                                               | Rendering                                                                                   |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Relay-authored shell/Bash/exec call plus result                                | `CommandOutputCard`, paired only by stable `callId`                                         |
| Fenced code in assistant text                                                  | `CodeCard`; language comes from an allowlisted fence identifier                             |
| Explicit goal, prompt, plan, document, or artifact metadata                    | `TextArtifactCard` regardless of length                                                     |
| Settled self-contained text with at least 16 logical lines or 1,200 characters | `TextArtifactCard` labelled `Long text`                                                     |
| Short prose                                                                    | Existing borderless Source Serif prose                                                      |
| Thinking, usage, and non-shell tools                                           | Existing Activity disclosure                                                                |
| File diff                                                                      | Existing F6/file-diff card; F7 may share viewer plumbing but does not change diff semantics |
| Unknown, legacy-incomplete, or malformed payload                               | Existing safe fallback; no Copy and no Open                                                 |

Normalization rules:

- Pair only by `callId`; adjacency, command-text equality, tool name, and output similarity are forbidden.
- Result-before-call creates `Output received · command details loading`; it merges only when the matching call arrives.
- A missing result after a relay terminal checkpoint creates `Result unavailable`; it does not attach a nearby result.
- Duplicate `(blockId, revision)` updates are ignored. Lower revisions are ignored. A higher revision replaces the current source atomically.
- React keys derive from protocol identity and stable fence ordinal, never from streamed content.
- Replay can update content but cannot reopen F6, reset expansion, move focus, change the user’s follow mode, or disturb transcript scroll.
- Heuristic text promotion happens only after settlement. A streaming paragraph does not repeatedly switch between prose and artifact cards.
- Optimistic prompts stay ordinary user bubbles. They expose no Copy or Open until replaced by a committed, relay-redacted block.
- Cache-origin blocks retain their card actions but are visibly labelled `Cached transcript`. Cache entries missing identity, revision, or redaction metadata take the safe fallback path.

## Shared inline-card contract

- Each card occupies the full transcript column, uses a near-canvas paper surface, 16px radius, a 1px boundary, and 12px separation from neighboring content. It has no transcript drop shadow.
- The toolbar and every action have a minimum 44×44 CSS-pixel hit box.
- Copy and Open are sibling React Aria `Button`s. The card and selectable body are not buttons or button-like press surfaces.
- Inline bodies are previews, not vertical scrolling panes. Only code may pan horizontally, and that pan is contained inside the code surface.
- The accessibility tree contains only the visible preview substring. The complete canonical source remains in component state for Copy and F6.
- Long press and drag use native iOS text selection. F7 does not add `useLongPress`, custom context menus, double-tap actions, or card-wide press handlers.
- Activation is on release. Scrolling, dragging outside a control, pointer cancellation, and a pointer leaving the control do not activate it.
- No card auto-opens or grows to thousands of lines in a virtualized transcript row.
- Inter is used for chrome and metadata; system monospace is used for commands, output, and code; Source Serif 4 is used for human-language artifact content.
- The canvas is bone `#f8f8f6` in light mode and the established dark parchment token in dark mode. Bash may use a warm-carbon Command/Output well; code and text remain parchment surfaces. Dark-mode wells require a visible boundary.
- Clay `#d97757` is a restrained accent, never the sole status, error, body-text, or focus signal. Meaningful text meets 4.5:1 contrast; boundaries, icons, and focus indicators meet 3:1.

## User-facing behavior and UI states

### Command/Output card

Structure, in order:

1. A visible heading such as `Running a command`, `Ran a command`, or the authoritative failure/state label.
2. A Command subsection with `Copy command`.
3. An Output subsection when output exists, with `Copy output` or `Copy current output` while running.
4. One explicit `Open full screen` action.

Inline presentation:

- Command uses monospace, wraps long tokens, and is capped at three visual lines.
- Output shows the last eight logical lines or 160px, whichever is smaller. If clipped, it says `N earlier lines` without putting that label in the copied value.
- A decorative `$` prompt, if used, is `aria-hidden="true"` and never enters the source or clipboard.
- There is no vertical scroll region inside the card.
- Streaming replaces the fixed tail preview without animating card height or stealing transcript scroll.

| State                                   | Required presentation and actions                                                                  |
| --------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `queued`                                | Command visible; `Waiting to run`; Copy command and Open available when source is committed.       |
| `running`, no output                    | Command visible; `Running`; output says `Waiting for output`; no Copy output.                      |
| `running`, output present               | Fixed tail preview; action says `Copy current output`; Open remains available.                     |
| `succeeded`                             | `Completed`; show exit code only when the relay supplied it.                                       |
| `failed`                                | `Failed · Exit N` when supplied; text and icon/shape, never color alone.                           |
| `denied` / `cancelled` / `interrupted`  | Exact supplied state; preserve partial output and its Copy action.                                 |
| Empty output                            | `Completed · No output`; omit Copy output.                                                         |
| Whitespace-only output                  | `Whitespace-only output`; Copy output remains available.                                           |
| Upstream-truncated                      | `Output truncated upstream`; F6 does not imply omitted bytes are recoverable.                      |
| Terminal checkpoint with missing result | `Result unavailable`; preserve the command and do not invent output.                               |
| Result before call                      | `Output received · command details loading`; preserve the unmatched output without nearby pairing. |
| Malformed/unmatched                     | `Unmatched activity`; no Copy and no Open for an unsafe or unpaired value.                         |
| Connection lost while running           | Preserve received bytes; `Connection lost · output may be incomplete`.                             |
| Stale cache                             | Preserve Copy/Open; show `Cached transcript` in card/viewer metadata.                              |

Completed command viewers open at the top. Running viewers open at the tail and follow only while the user is within 96px of the bottom. Scrolling upward disables follow mode and reveals a 44×44 `Jump to latest` control. Completion never forces a reader back to the tail.

### Code card

- Header shows the normalized allowlisted language or `Code`, line count, `Copy code`, and `Open full screen`.
- Preview shows the first 12 logical lines or 228px.
- Indentation and newlines are preserved. Code is LTR, unwrapped by default, and horizontally pannable only inside its code surface.
- Unknown or absent languages render as plaintext with the supplied safe label or `Code`; language is never guessed from a filename or punctuation.
- No inline line numbers. Copy excludes fences, language labels, line numbers, truncation UI, and generated whitespace.

| State                                 | Required presentation and actions                                                                           |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Fence streaming                       | Escaped plain monospace text; `Receiving code`; Copy/Open use the current committed source where available. |
| Settled, highlighter pending          | Plaintext remains immediately visible; no loading blank or layout jump.                                     |
| Highlighted                           | Token spans are ordinary React text nodes and remain selectable/copyable.                                   |
| Unknown language                      | Plaintext with the supplied label or `Code`.                                                                |
| Worker/grammar failure                | Plaintext plus quiet `Syntax highlighting unavailable`.                                                     |
| Empty fence                           | `Empty code block`; Copy disabled; no generated placeholder is copied.                                      |
| Upstream-truncated                    | `Code may be incomplete`; copied value remains exactly the received redacted source.                        |
| Over 20,000 characters or 1,000 lines | Skip highlighting; full plaintext remains selectable and copyable.                                          |

The initial highlighter allowlist is Bash, JavaScript, TypeScript, JSX/TSX, JSON, HTML, CSS, Markdown, Python, Go, Rust, YAML, SQL, diff, ANSI, and plaintext. Highlight tokens are cached in memory only by language, theme, revision, and content hash. Worker responses carry request and revision IDs so stale results cannot overwrite newer content. No `codeToHtml`, `dangerouslySetInnerHTML`, raw language-derived CSS classes, remote grammar, or CDN request is permitted.

### Text-artifact card

- Trusted metadata labels are `Prompt`, `Goal`, `Plan`, `Document`, or `Text`.
- Heuristic promotion is labelled `Long text`, never falsely labelled `Artifact`.
- Preview shows the first six logical lines in Source Serif 4 at approximately 17px/1.55 with an explicit continuation indicator.
- Header chrome uses Inter and includes complete character or line count.
- Copy writes the complete committed redacted source, including Markdown syntax.
- Human-language content uses `dir="auto"`; filenames and identifiers use `<bdi>`.
- Safe Markdown supports paragraphs, headings, lists, emphasis, blockquotes, tables, and fenced code. Raw HTML, scripts, forms, images, iframes, audio, video, data URLs, and remote embeds are escaped or omitted.

| State                       | Required presentation and actions                                                     |
| --------------------------- | ------------------------------------------------------------------------------------- |
| Explicit non-empty artifact | Trusted label, bounded preview, complete count, Copy text, Open full screen.          |
| Settled heuristic long text | `Long text`, bounded preview, complete count, Copy text, Open full screen.            |
| Streaming substantial text  | Remains ordinary prose until settled; no renderer churn.                              |
| Empty explicit artifact     | `Empty text artifact`; Copy disabled; Open may show the empty state.                  |
| Unknown or missing metadata | Safe prose/fallback path; no invented artifact label or action.                       |
| Stale cache                 | Copy/Open remain available with `Cached transcript`; source is not refreshed by Open. |
| Upstream-truncated          | `Text may be incomplete`; F6 preserves the same received source.                      |

### Copy behavior

The named semantic unit is always copied. Native selection remains available for partial copying.

| Control                          | Exact copied value                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------- |
| `Copy command`                   | Canonical redacted command only                                                       |
| `Copy output`                    | Canonical redacted output only, preserving tabs, Unicode, newlines, and final newline |
| `Copy current output`            | The authoritative redacted output revision present at press time                      |
| `Copy code`                      | Canonical redacted fence body, excluding fence markers                                |
| `Copy text`                      | Canonical redacted artifact source, including Markdown syntax                         |
| F6 `Copy all` for command/output | Command plus `"\n\n"` plus output; omit the separator when output is empty            |

Behavior:

1. `navigator.clipboard.writeText(payload)` is invoked directly from the React Aria button’s `onPress`. There is no preceding fetch, dynamic import, permission query, timeout, or worker wait.
2. Focus remains on the initiating button.
3. Success changes that button’s visible label to `Copied` for 1.5 seconds and announces the named unit through one persistent polite `role="status"` region.
4. Failure leaves the action available and shows persistent recovery text: `Copy failed. Touch and hold to select the text.`
5. If the Clipboard API is unavailable, the action is hidden; complete content remains selectable in F6.
6. Copy never reads the clipboard and never uses highlighted DOM, `innerText`, hidden content, a generated prompt, or an unredacted backing value.
7. Copy during streaming snapshots the current authoritative revision at press time and announces `Copied current output`.

### F6 full-screen viewer

F7 uses one shared React Aria `ModalOverlay` → `Modal` → `Dialog` implementation owned by `ArtifactViewerProvider`. The browser Fullscreen API is not used.

Layout and controls:

- `position: fixed; inset: 0`, full-bleed on iPhone, with height from React Aria’s visual-viewport variable and `100dvh` fallback.
- No centered desktop dialog, detent, nested modal, grabber, backdrop dismissal, or custom swipe-down in v1.
- Sticky opaque toolbar: leading Close, visible safe title, trailing Copy where applicable. Every control is at least 44×44px.
- Safe-area padding uses `env(safe-area-inset-*)`. One vertical content scroller has bottom home-indicator padding and contained overscroll.
- Code owns horizontal scroll; the page never overflows horizontally. Text uses a centered reading measure up to 66 characters.
- Command/output uses two stacked labelled sections with independent Copy actions and toolbar-level Copy all. Code has a local, non-persisted `Wrap lines` toggle. Output and prose wrap by default.

Open/close sequence:

1. Save the transcript scroll offset and exact invoking Open control.
2. Push one ephemeral history entry containing only the block ID, never content.
3. Open without a network request, filesystem request, mutation request, or ticket request.
4. Focus the visible title with `tabIndex="-1"`; the first Tab stop is Close.
5. Make the transcript inert and lock background scroll.
6. Close through visible Close, Escape, browser Back/edge-back, or VoiceOver dismiss.
7. Restore transcript scroll before returning focus to the invoker.
8. If virtualization removed the invoker, fall back to card heading, owning message, then transcript heading.

Higher revisions of the same block may update an open viewer without fetching. Lower or unrelated revisions are ignored. If reconciliation removes the source block, retain the last trustworthy redacted snapshot and label the viewer `No longer in the current transcript`.

Viewer states:

| State                          | Presentation and actions                                                                                                                       |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Closed                         | Inline card only; explicit Open is the sole entry.                                                                                             |
| Opening                        | Full-screen shell and safe title appear immediately; Close is available.                                                                       |
| Open, settled                  | Frozen committed source; renderer controls and permitted Copy actions.                                                                         |
| Open, running                  | Tail-first command/output view; follow mode only at the live edge; `Jump to latest` after upward scroll.                                       |
| Open, higher revision          | Update the same viewer in place; do not refocus, re-open history, or reset scroll/selection unless the source itself is no longer trustworthy. |
| Open, lower/duplicate revision | Ignore the update and keep the current viewer snapshot.                                                                                        |
| Open, stale cache              | Show `Cached transcript`; never silently fetch or imply freshness.                                                                             |
| Source removed                 | Keep the last trustworthy snapshot and show `No longer in the current transcript`.                                                             |
| Clipboard success              | Initiating control says `Copied` for 1.5 seconds and focus stays put.                                                                          |
| Clipboard failure              | Persistent recovery text; content remains selectable.                                                                                          |
| Clipboard unavailable          | Copy control omitted; native selection remains.                                                                                                |
| Malformed/unsafe source        | Safe fallback or withheld state with no Copy/Open.                                                                                             |
| Reduced motion                 | No translation, rotation, scale, spring, or height animation; instant or opacity-only transition of at most 100ms.                             |

### Keyboard and accessibility behavior

Inline focus order is `Copy command/code/text`, `Copy output` when present, then `Open … full screen`. Viewer focus starts at the title, then Close, Copy all, section Copy controls, Wrap lines when applicable, content, and Jump to latest when present.

- Enter and Space activate focused buttons. Escape closes F6. Tab and Shift+Tab stay inside F6.
- Arrow keys, Page Up/Down, Home, and End operate on the focused scroller.
- Native `Command/Ctrl+C` remains untouched when text is selected. Browser Find, `Command+W`, and OS shortcuts are not intercepted.
- Use `<article>` with a visible heading; do not make every card a landmark and do not use `role="application"`.
- Code uses `<pre><code>`; output uses `<pre>`; text uses semantic headings, paragraphs, lists, and tables.
- Token spans are semantically neutral. Decorative prompts, fades, and future line numbers are hidden from assistive technology.
- Streaming output is not a live region. Announce only lifecycle transitions and Copy results.
- Accessible names begin with visible labels, such as `Copy command`, `Copy output`, `Copy code`, `Copy text`, `Open code full screen`, and `Close preview`.
- Status combines text and shape/icon. Color alone never communicates success, failure, denial, truncation, or stale state.
- Application chrome uses CSS logical properties. Commands, paths, hashes, stack traces, and code remain LTR and are never translated; prose follows `dir="auto"`.
- Support 200% text enlargement, 320px reflow, portrait and landscape, VoiceOver, Voice Control, external keyboards, and RTL locales.

### Motion and visual behavior

- Button feedback is immediate tint plus optional `.985` press scale over 90–120ms.
- Copy icon/label crossfades over 120ms; there is no bounce or toast.
- Viewer enters with opacity plus `translateY(8px → 0)` over 220ms and exits over 180ms.
- There is no scale-from-0.8 modal, overshoot spring, full-screen blur, animated card height, or per-line streaming animation.
- `prefers-reduced-motion: reduce` removes translation, rotation, scale, and height animation.

## Security and redaction requirements

Rich blocks are projections of the redacted ledger, not a new data plane.

- Redaction occurs before persistence, replay, caching, broadcast, worker processing, rendering, and clipboard export. Components receive no host paths, extension callbacks, raw-event callbacks, file handles, lazy loaders, unredacted variants, or download URLs.
- Propagate redaction metadata. If fields were removed, F6 may show `Redacted · path, secret`; missing metadata is never described as `Unredacted`.
- Copy and F6 use only the committed block’s current authoritative redacted revision. A more-redacted higher revision replaces older content and clears stale Copy success state.
- No payload is placed in a URL, history entry, analytics event, push notification, persistent highlight cache, hidden DOM attribute, or error report. History contains only the block ID.
- Clipboard export is `text/plain` only. Pi Remote never reads the clipboard and never creates a `File`, `Blob` download, object URL, or Web Share file payload.
- Cached transcript content is visible only under the existing retention policy and is labelled stale. F7 introduces no new transcript persistence.
- Redaction markers are immutable text and never reveal controls, original values, or removed lengths that would disclose a secret.
- Raw HTML and executable artifact previews are forbidden. Redaction does not make markup trustworthy.
- ANSI control bytes, bidirectional controls, language identifiers, and Markdown links cannot create executable DOM, styles, navigation, or misleading status. If a bidi/control warning presentation is added, it is read-only and does not change verbatim Copy.
- Opening, copying, wrapping, closing, replaying, and highlighting perform zero mutation requests, mutation-ticket requests, host-file calls, or rich-content network fetches.
- Manually pasting copied text into the existing composer remains an ordinary prompt submission through its current one-use ticket and revision-checked path. Plan mode and host/extension mutation-family gates remain authoritative.
- Any future direct command replay would be a separate feature requiring an exact-action one-use ticket, matching base revision, explicit confirmation, and host/extension approval; it cannot be added as card chrome.
- Clipboard export is an explicit exfiltration boundary: iOS Universal Clipboard may expose even redacted text to another device. Release review and notes must cover that fact; this feature does not silently claim clipboard content is private.

## Dependencies and affected areas

| Area                        | Files/components                                                                                                                                                                                                                                                                            | Required change                                                                                                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F6 viewer                   | Existing `ArtifactViewerProvider`, React Aria `ModalOverlay`/`Modal`/`Dialog`, viewer focus/history shell; new `F6ViewerAdapter` integration                                                                                                                                                | Reuse one full-screen shell, freeze rich snapshots, preserve scroll/focus/history, and add command/code/text renderer adapters. No second modal or new resource route. |
| Protocol                    | `packages/pi-rpc-protocol/src/types.ts`, `guards.ts`, `index.ts`; `packages/pi-rpc-protocol/tests/guards.test.ts`                                                                                                                                                                           | Add bounded call identity, shell/lifecycle/completeness fields, explicit text-artifact block, and compatibility-safe guards.                                           |
| Relay projection            | `apps/pi-remote-relay/src/store/transcript-projector.ts`, `store/redaction.ts`, `store/relay-store.ts`, `replay/sync.ts`                                                                                                                                                                    | Preserve stable identity and authoritative lifecycle/truncation metadata; redact before store/replay/broadcast; keep revision semantics.                               |
| Relay endpoints/auth        | `apps/pi-remote-relay/src/http/server.ts`, existing `transcript:read` and `sync:read` paths                                                                                                                                                                                                 | Verify existing `/api/sessions/:sessionId/transcript` and `/api/sync` carry only guarded redacted blocks. Add no endpoint, ticket, or mutation action.                 |
| Web transport/cache         | `apps/pi-remote-web/src/relay.ts`, `state.ts`, `cache.ts`, `public/service-worker.js`                                                                                                                                                                                                       | Parse rich fields, retain cache source and compatibility state, and prove no rich payload or highlight output is newly persisted or service-worker cached.             |
| Web transcript              | `apps/pi-remote-web/src/App.tsx`, `turns.ts`, `style.css`                                                                                                                                                                                                                                   | Route typed blocks without changing prompt grouping, virtualization, live-edge behavior, or the fixed design system.                                                   |
| Web rich-content components | `apps/pi-remote-web/src/rich-content/normalizeTranscriptBlocks.ts`, `RichContentRouter.tsx`, `RichBlockFrame.tsx`, `CommandOutputCard.tsx`, `CodeCard.tsx`, `TextArtifactCard.tsx`, `SafeMarkdown.tsx`, `RedactionBadge.tsx`, `useCopyFeedback.ts`, `useHighlightedCode.ts`, worker adapter | Implement the pure identity/revision normalizer, cards, exact Copy, safe text presentation, and progressive highlighting.                                              |
| Fixtures and checks         | `apps/pi-remote-web/src/demo.ts`, `apps/pi-remote-web/tests/`, relay/protocol tests, and `scripts/rich-content-cdp.mjs`                                                                                                                                                                     | Cover every state, redaction/security negative, accessibility behavior, and true 390px light/dark screenshot.                                                          |

F6’s viewer shell and focus/history ownership are a prerequisite. If F6 is not yet available in the target branch, its already-approved shell must land before the F7 Open action is enabled; F7 must not duplicate it or substitute a browser fullscreen implementation.

## Acceptance criteria

The feature is complete only when every check below passes. Each criterion names the proof expected at implementation time.

1. Concurrent and out-of-order shell fixtures produce one card per `callId`, and a duplicate replay produces one rendered card. **Check:** normalizer unit test plus DOM assertion on card count.
2. A result arriving before its call shows `Output received · command details loading`, then merges only when the same `callId` arrives. **Check:** normalization test and DOM assertion; a nearby different call must remain separate.
3. A revision 8 update arriving after revision 9 cannot replace revision 9. **Check:** reducer/normalizer unit test asserting source, status, and viewer content remain revision 9.
4. Stable React keys survive streamed content revisions. **Check:** React test records the card node identity across revisions and asserts it is unchanged.
5. Every rich block has `sessionId`, stable `blockId`, positive monotonic `revision`, transcript `sequence`, source, kind, canonical redacted source, and redaction metadata when supplied. **Check:** protocol guard and normalizer type tests.
6. Short prose, thinking, usage, routine tools, file diffs, unknown payloads, optimistic prompts, and legacy blocks route to their specified existing or safe fallback renderers. **Check:** exhaustive router unit test and DOM assertions that fallback blocks have neither Copy nor Open.
7. `Copy command`, `Copy output`, `Copy code`, `Copy text`, and F6 `Copy all` are string-equal to their canonical redacted values, including tabs, emoji, RTL text, leading spaces, and final newline. **Check:** clipboard mock unit tests comparing exact strings.
8. No label, decorative `$`, fence, language name, line number, truncation label, hidden DOM content, generated whitespace, or highlighted markup enters the clipboard. **Check:** clipboard mock plus DOM/query and source-inspection test.
9. Copy is invoked directly by `onPress`, leaves focus on the initiating button, reports success for 1.5 seconds, and exposes persistent failure recovery. **Check:** React DOM test with clipboard success/failure and fake timers.
10. Optimistic user prompts, malformed blocks, unmatched unsafe results, and unknown protocol values expose neither Copy nor Open. **Check:** DOM assertions across the corresponding fixtures.
11. Opening, copying, wrapping, and closing produce zero network requests, host-file calls, mutation frames, mutation tickets, or new relay endpoint calls. **Check:** browser `fetch`/WebSocket spy, relay negative test, and request-log assertion.
12. Redaction fixtures expose secrets only as redaction markers in transcript DOM, accessibility text, clipboard data, worker messages, in-memory highlight cache, and F6 content. **Check:** relay redaction/security tests plus browser and worker message inspection.
13. Malicious HTML, scripts, raw SVG, forms, iframes, data URLs, remote media, ANSI escape sequences, bidi controls, language identifiers, and Markdown links cannot create executable DOM, styles, navigation, or an unsafe text layer. **Check:** SafeMarkdown/security-negative test and DOM query for forbidden nodes/attributes.
14. Every visible action reports a hit box of at least 44×44 CSS px, with accessible names beginning with their visible labels. **Check:** DOM `getBoundingClientRect()` assertions and accessibility-tree snapshot.
15. At 320, 390, and 430 CSS-pixel widths and 200% text, only code surfaces may scroll horizontally; the page, card, command, output, and prose do not overflow. **Check:** layout test plus true-width CDP screenshots and `scrollWidth <= clientWidth` assertions outside code.
16. F6 traps focus, keeps Tab inside the dialog, closes through Close/Escape/Back/VoiceOver dismissal, restores the exact invoker or documented fallback, and restores transcript scroll within 1px. **Check:** React DOM focus/scroll test, CDP interaction, and manual VoiceOver step.
17. Long press produces native selection; dragging or scrolling from a Copy/Open control does not activate it. **Check:** manual Safari and installed-PWA iPhone step with event assertions in the browser test harness.
18. Streaming output does not create continuous VoiceOver announcements, does not animate card height, and does not move a reader who left the tail. **Check:** DOM live-region assertions, scroll-position test, and manual VoiceOver step.
19. Running viewers follow only within 96px of the bottom; upward scroll exposes `Jump to latest`, and completion never forces the reader back to the tail. **Check:** viewer scroll unit/DOM test and CDP interaction.
20. F6 opens at the top for completed command/output, at the tail for running output, and never reopens or refocuses on replay. **Check:** viewer state test and replay interaction test.
21. Fence streaming and settled code are immediately readable as plaintext; highlighting is skipped above 20,000 characters or 1,000 lines; worker failure leaves full selectable/copyable plaintext. **Check:** worker/large-fixture tests, DOM selection assertion, and CDP screenshot.
22. Safe Markdown renders only the allowed semantic subset and falls back to plain text for invalid or unsafe input. **Check:** sanitizer fixture suite and DOM assertion.
23. Higher revisions update an open viewer only when they belong to the same block; lower, duplicate, unrelated, or removed-source revisions follow the specified ignore/last-trustworthy-snapshot states. **Check:** viewer reconciliation tests and DOM status assertions.
24. Cached rich blocks retain actions only when their committed redacted source and identity are present, visibly say `Cached transcript`, and never trigger a refresh on Open. **Check:** cache hydration test and browser request spy.
25. Opening F6 does not change virtualized row height, transcript live-edge state, or background scroll position. **Check:** virtualization/scroll test and CDP before/after measurements.
26. Reduced-motion mode runs no transform, rotation, spring, or height animation and uses an instant or opacity-only transition of at most 100ms. **Check:** computed-style/animation test under `prefers-reduced-motion: reduce`.
27. Light and dark themes pass automated and manual text/non-text contrast checks, including shell wells, syntax tokens, focus rings, status icons, truncation states, and error states. **Check:** contrast test plus inspected true-390px light/dark CDP screenshots.
28. The full state fixture reaches every command, code, artifact, Copy, viewer, stale, connection-loss, truncation, malformed, and fallback state described above with the correct available actions. **Check:** fixture-driven DOM/state test matrix.
29. Large-block opening is prompt, does not blank the viewer, remains selectable, copies the complete received payload, and does not accumulate worker/cache memory across repeated open/close cycles. **Check:** performance/cleanup test plus manual oldest-iPhone repetition.
30. Repository checks find no new Run, Retry, Edit, Approve, Download, Publish, Open-on-host, Share-file, raw-HTML, filesystem, mutation-ticket, or unqualified network affordance in the rich-content implementation. **Check:** source/DOM negative-control scan and relay auth-route test.
31. True 390px CDP captures exist for the principal inline and full-screen states in both light and dark themes, with no clipped safe-area controls, horizontal page overflow, or unexpected row-height change. **Check:** `scripts/rich-content-cdp.mjs` exit status plus human inspection of all four screenshots.
32. The feature remains usable in portrait and landscape on the oldest supported iPhone, with VoiceOver, Voice Control, external keyboard, native selection, RTL prose, 200% text, reduced motion, app suspension, and installed-PWA standalone mode. **Check:** manual on-device checklist signed off after automated gates.

The implementation is not release-ready if any check is replaced by a visual approximation, a desktop-only screenshot, inferred lifecycle state, adjacency-based pairing, or an unverified assumption that redaction happened later in the pipeline.
