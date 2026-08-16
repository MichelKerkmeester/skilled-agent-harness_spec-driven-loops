<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: phase -->

# F3 — Typed “/” Commands

One-line summary: Add a terminal-style, inline slash-command autocomplete to the existing Pi Remote composer, backed only by the relay-filtered host command catalog and never auto-submitting.

## Decision

Build one nonmodal autocomplete directly above the existing multiline composer. The textarea remains the only editing field. An ASCII `/` at character zero opens the relay-filtered `get_commands` catalog; subsequent typing filters that in-memory snapshot locally. Selecting a result replaces the complete leading token with the canonical `/${name} `, restores textarea focus, and does nothing on the host. The existing `+` command browser and the inline route share the same catalog, ranking function, and insertion reducer. Explicit Send is the only execution path: it obtains a one-use ticket and submits only after current host, session, and catalog revisions pass fail-closed validation.

This is the PARTIAL tier: deliver the desired terminal-style inline experience while retaining the fixed ink-on-parchment design system and read-only-by-default security posture.

## Problem and goal

Pi Remote already exposes a relay-filtered command catalog through the `+` tools browser. A user must currently leave the composer, search a separate control, and insert a command. Typing `/` in the message field has no inline discovery, so the interaction does not match the terminal-like command entry users expect from Pi, Kimi Code, or Claude-style mobile agent apps.

The goal is a fast, keyboard- and touch-friendly inline route:

- Typing `/` as the first character opens the actual commands available from the authenticated host and session.
- Typing more characters filters locally with deterministic ranking.
- Each result can show only authoritative command metadata: canonical name, description, argument hint when supplied by the host, source, confirmation marker, or disabled reason.
- Selecting a result inserts the canonical command and a trailing space without sending, requesting a ticket, mutating Pi, or changing the transcript.
- Explicit Send revalidates the command and all identity/revision bindings before the existing ticketed prompt path can reach Pi.

## Current state

- `apps/pi-remote-relay/src/commands/command-service.ts` requests Pi’s `get_commands`, projects a bounded catalog, removes path-like and privileged names, and exposes it through `/api/commands/list`.
- `apps/pi-remote-relay/src/store/redaction.ts` already has an allowlist projector for command descriptors.
- `packages/pi-rpc-protocol` already models `get_commands`, `CommandDescriptorDto`, and `CommandCatalogDto`, but the catalog identity is not yet explicit enough for a slash binding that spans insertion and Send.
- `apps/pi-remote-web/src/commands.ts` fetches the catalog and `apps/pi-remote-web/src/CommandPalette.tsx` renders the existing `+` picker.
- `apps/pi-remote-web/src/SessionComposer.tsx` owns the multiline textarea and the primary action, but it does not parse a leading slash or render inline completion.
- `apps/pi-remote-web/src/App.tsx` sends the current draft through the existing one-use-ticket `/api/prompt/submit` path; the current running-turn behavior maps ordinary drafts to steer/follow-up behavior and must not be applied blindly to a slash command.

## Desired end state

The composer remains visually stable while a compact, nonmodal command card is anchored above it. The caret and DOM focus stay in the textarea; the list uses virtual focus and `aria-activedescendant`. The panel works at a true 390 CSS-pixel iPhone viewport with the keyboard open, in light and dark themes, without transcript displacement, horizontal overflow, or a second editing control.

The catalog is session- and host-scoped, in memory only, and refreshed on authenticated-session readiness, reconnect, host/session change, revision notification, and foreground return when older than 30 seconds. Search never makes a network request. A selected command is a local draft transformation with a `{name, sessionRevision, catalogRevision}` binding. Any host/catalog change invalidates that binding before execution.

## Authority and protocol contract

“Available commands” means the effective commands remotely invokable through Pi’s RPC prompt channel: safe extension commands, prompt templates, and skills. It does not include TUI-only built-ins such as interactive settings or model pickers unless Pi later exposes a remotely executable equivalent.

The relay-filtered catalog is the sole source of truth. The protocol work must evolve the existing catalog contract rather than introduce a client-owned fallback.

### Catalog identity

The response exposed by `/api/commands/list` must carry these semantics, whether the wire names are introduced directly or the existing `revision` field is migrated compatibly:

| Field | Requirement |
|---|---|
| `hostEpoch` | Opaque epoch for the current host process/authority lifetime. A changed epoch invalidates every prior snapshot and binding. |
| `sessionId` | Opaque authenticated session identifier. A response for another session is rejected and never rendered. |
| `sessionRevision` | Current session identity/state revision used to prevent sending a draft against a changed session. |
| `catalogRevision` | Monotonic revision for the complete command snapshot. A new full snapshot replaces the previous one. |
| `commands` | Bounded, relay-filtered `CommandDescriptorDto` rows in host order. |

Each descriptor contains:

| Field | Requirement |
|---|---|
| `name` | Canonical host name without a leading slash. Host-assigned suffixes such as `review:1` are part of identity. |
| `description` | Bounded string or `null`, supplied by the host and redacted by the relay. |
| `source` | `extension`, `prompt`, or `skill`. |
| `enabled` | Host/relay availability; the client never infers availability. |
| `disabledReason` | Bounded, safe reason or `null`; displayed only when deliberately disclosed. |
| `requiresConfirmation` | Host metadata for a textual “Asks first” marker; it is not a submit-time authorization substitute. |
| `aliases` | Optional only after an allowlisted protocol extension preserves authoritative host aliases. Never infer aliases. |
| `argumentHint` | Optional only after an allowlisted protocol extension preserves authoritative host argument metadata. Never infer hints from descriptions, paths, filenames, prompt bodies, or source. |

The client records a selected binding containing the canonical name, `hostEpoch`, `sessionId`, `sessionRevision`, and `catalogRevision`. Editing the command-name token clears the binding; editing arguments retains it. A host/session/catalog revision change marks it stale.

The relay must continue to reject malformed or incompatible descriptors as a whole response. It must not render a partially trusted payload. It must never ship a hardcoded fallback catalog or recreate Pi’s TUI built-ins.

## In scope

- A nonmodal React Aria autocomplete above the existing `TextArea`, with the textarea remaining the only editing field.
- Trigger parsing for a leading ASCII `/` at index zero, including caret, selection, focus, Escape, and IME-composition rules.
- Local normalization and deterministic ranking over the already downloaded catalog.
- Canonical insertion, caret restoration, focus retention, and the “Not sent” announcement.
- Loading, ready, refreshing, empty, no-match, stale/offline, error, disabled-row, committing, drafted, revalidating, stale-submit, denied-submit, and running-session states defined below.
- Keyboard, touch, pointer, virtual-focus, VoiceOver, Voice Control, Switch Control, Full Keyboard Access, and Bluetooth-keyboard behavior defined below.
- Shared catalog, ranking, and insertion behavior between typed inline completion and the existing `+` command browser.
- Authenticated catalog prefetch/revalidation, in-flight request sharing, abort/race protection, and in-memory lifecycle management.
- One-use ticket and revision-checked explicit Send integration for slash drafts.
- Redacted protocol projection and relay-side command allowlisting for the catalog and submission path.
- Light/dark styling using the existing semantic tokens, safe-area/visual-viewport handling, responsive rows, and reduced-motion behavior.
- Unit/component/relay/protocol tests, accessibility-tree assertions, true-390px CDP screenshots, and physical-iPhone checks.

## Out of scope: v1 non-goals

- Executing a command on `/` or on selection; there is no auto-submit, auto-ticket, or implicit host request from typing or insertion.
- A second editing field, modal sheet, mobile tray, backdrop, or full-screen command browser for the inline route.
- A client-side or static fallback catalog, usage-history ranking, edit-distance autocorrection, or synthetic “send as text” result for an unknown slash token.
- Recreating TUI-only commands or exposing privileged/destructive commands that the relay did not deliberately disclose.
- Inferring aliases, argument syntax, command capabilities, file paths, prompt bodies, or source locations from untrusted strings.
- Command authoring, editing, deletion, installation, extension management, model selection, settings, or plan-mode policy changes from this feature.
- Changing the ink-on-parchment palette, typography, light/dark modes, WCAG target, PWA architecture, or the read-only-by-default posture.
- A new persistence layer. Command catalogs, bindings, query text, and completion state are not written to `localStorage`, IndexedDB, Cache Storage, service-worker responses, transcript persistence, URLs, crash reports, or content telemetry.
- Rich command forms, argument validation beyond host-provided metadata, command history, favorites, macros, or multi-token completion.

## User-facing behavior

### Trigger and query

Open the inline panel only when all of these conditions hold:

1. The composer is focused.
2. The draft begins with ASCII `/` at character index zero.
3. The selection is collapsed and the caret is within the first token.
4. The first token contains no whitespace, newline, or second slash.
5. IME composition is not active.
6. The exact draft/selection has not been dismissed with Escape.

Therefore `/` opens the complete catalog and `/pla` filters it. ` /pla`, `hello /pla`, a slash after a newline, and `/plan args` do not open the panel. Paste, dictation, undo/redo, and caret movement reevaluate the predicate after committed input. Moving the caret within the initial token may reopen the panel. Escape closes it without editing until the draft or selection changes, or focus leaves and returns.

During `compositionstart`, freeze parsing, filtering, Enter handling, and selection. Clear the composition guard on the next event-loop turn after `compositionend`, then reevaluate the committed draft.

### Filtering and ranking

Filter the current in-memory catalog; never fetch per keystroke or automatically fetch on every `/`. Normalize case, diacritics, and Unicode for comparison, but display and insert the exact canonical host string.

Rank in this order, retaining original host order as the final tie-breaker:

1. Exact canonical name.
2. Exact authoritative alias.
3. Canonical-name prefix.
4. Alias prefix.
5. Prefix after a `:`, `-`, or `_` boundary.
6. Contiguous name or alias substring.
7. Ordered name subsequence with a gap penalty.
8. Description substring.
9. Argument-hint substring.
10. Original host order.

Do not autocorrect plausible typos into a different command. Bold matching graphemes without using clay-colored text. With an empty query, preserve host order. Disabled rows stay in server-provided position but are skipped by keyboard activation. The first enabled result becomes active. When reranking, preserve the active canonical name if it remains visible.

### Selection and insertion

Selecting by tap, completed press, Enter, or the primary Insert action:

1. Resolves the option from the current catalog revision.
2. Replaces the complete trigger token with `/${name} `.
3. Updates controlled state synchronously and places the caret immediately after the trailing space.
4. Keeps or restores textarea focus without scrolling the page.
5. Closes the panel.
6. Records the selected binding beside the draft.
7. Announces “Inserted slash command name. Not sent.”
8. Makes zero ticket, prompt, mutation, telemetry-content, or host-execution requests.

The `+` tools browser and inline surface are mutually exclusive. Tapping `+` closes inline completion and opens the existing tools browser. Both routes call the same catalog, ranking, and insertion reducer and produce exactly the same canonical draft string.

### Input, touch, and keyboard behavior

| Input | Result |
|---|---|
| Type `/` at index zero | Open within the next rendered frame. |
| Type committed characters | Filter immediately from memory; make no network request. |
| Tap an enabled row | Insert on completed press/release; never submit. |
| Tap a disabled row | Do not insert; announce its disclosed reason. |
| Drag vertically in the list | Scroll only; cancel row activation. |
| Swipe down | Scroll; do not dismiss. |
| Horizontal swipe | No command action. |
| Long-press a row | No hidden action; suppress row text selection/context menus. |
| Long-press the textarea | Preserve native iOS text selection and editing. |
| Tap outside | Close without editing, then allow the tapped target’s normal behavior. |
| Tap `+` | Close inline completion and open tools; never leave both surfaces open. |
| Tap primary action while open | Perform local Insert for the active enabled row; label it “Insert command,” never “Send.” Disabled when no active row exists. |
| `ArrowDown` / `ArrowUp` | Move virtual focus to the next/previous enabled row without wrapping and scroll it into view with `block: nearest`. |
| `Enter` while open | Insert the active row and consume the event. With no active row, do nothing and announce “No command selected.” |
| Second `Enter` after insertion | Follow the existing explicit submission policy. |
| `Shift+Enter` | Insert a newline and close completion. |
| `Escape` | Close; retain exact draft, selection, focus, and attachments. |
| `Tab` | Close and continue normal document focus traversal; do not select. |
| Left/Right, editing shortcuts, undo/redo | Retain native textarea behavior; the trigger parser decides whether the panel remains valid. |
| Any key during IME composition | Do not filter, insert, or intercept submission. |

Use React Aria press handling with focus prevention on options. Where WebKit requires it, cancel both `pointerdown` and compatibility `mousedown`, then commit on completed press. Do not use `touchstart` activation. The list is not in the Tab order; DOM focus remains in the textarea while arrows change virtual focus.

### Execution and fail-closed submission

Selection is only drafting. When the user explicitly presses Send, the client and relay must:

1. Confirm the draft’s leading canonical token and binding still match the current authenticated host epoch, session, session revision, and catalog revision.
2. Resolve the name against the current relay-filtered catalog; require exact canonical identity, `enabled: true`, and the current disclosed policy.
3. Obtain one fresh one-use ticket immediately before submission.
4. Submit the prompt with the expected identity/revision values so the relay can reject a race before forwarding to Pi.
5. Forward through the existing Pi RPC prompt channel only after all checks pass.
6. Never automatically retry a stale, denied, delivery-unknown, or malformed outcome.

A slash command must never be silently converted into `steer` or `followUp` merely because a turn is running. If authoritative availability for the running state is unavailable, slash-command Send is disabled until the host is idle or provides an explicit effective availability. Plan mode remains host/extension-enforced; the client may display host-provided state but is not a policy boundary.

### Complete UI state model

The implementation must expose and test every state in this table. Text may be localized later, but the meaning and fail-closed behavior are fixed.

| State | Presentation | Behavior |
|---|---|---|
| `closed` | No panel in the DOM or accessibility tree. | Normal composer behavior. |
| `loading.initial` | Anchored card with “Loading available commands…” and three static skeleton rows. | Drafting continues; insertion and primary action are disabled. |
| `ready.unfiltered` | Full current catalog in host order. | First enabled row is active. |
| `ready.filtered` | Ranked matches with matching graphemes bolded. | Preserve active name when possible; otherwise activate first enabled match. |
| `refreshing.current` | Existing same-session rows remain visible with “Checking for command changes…”. | Local insertion remains allowed; execution still revalidates. |
| `ready.emptyCatalog` | “No commands are available in this session.” | Nonselectable; Retry is available outside the listbox. |
| `ready.noMatches` | `No command matches “/query”.` | Enter and primary action do nothing; no send-as-text option. |
| `ready.staleOffline` | Same-session memory snapshot with “Last verified — reconnect before sending.” | Draft insertion is allowed; submission is unavailable until live revalidation. |
| `error.noSnapshot` | “Reconnect to load commands.” | Composer remains usable for non-slash drafts. |
| `error.hostUnavailable` | “Pi is not responding.” plus Retry. | Preserve draft; do not expose stale rows from another session. |
| `error.forbidden` | “Commands aren’t available for this device.” | Clear catalog and revision binding immediately. |
| `error.incompatible` | “The phone and host versions don’t agree.” | Reject malformed rows; do not render partial payloads. |
| `row.disabled` | Visible only when deliberately disclosed; reason begins with “Unavailable:”. | Never active, insertable, or executable. |
| `committing` | Transient reducer state lasting at most one render. | Draft update only; no transport. |
| `drafted` | Composer contains canonical command and optional arguments; panel closed. | Explicit Send is available only when connection and host state permit. |
| `submit.revalidating` | Primary action shows bounded progress; draft remains visible. | Request one ticket and validate revisions; no automatic retry. |
| `submit.stale` | Inline error: “Commands changed on the host. Choose the command again.” | Make zero Pi calls; refresh catalog, preserve draft, clear binding. |
| `submit.denied` | Inline error: “That command isn’t available from this phone.” | Make zero Pi calls; preserve draft. |
| `session.running` | Relay-provided effective availability controls each row. | Never reinterpret an extension command as steer/follow-up. Disable slash Send if authoritative running-state availability is missing. |

### Visual, layout, and motion requirements

The fixed design system remains unchanged: bone canvas `#f8f8f6`, carbon ink, clay `#d97757`, Inter, Source Serif 4, light and dark semantic tokens, and WCAG AA contrast.

Panel:

- Anchor 8px above the composer shell with top-start placement, no flip, and nonmodal behavior.
- Match the composer’s inline width with at least 12px screen margins.
- Maximum height is the minimum of 280px, 40% of `visualViewport.height`, and the available space above the composer minus 8px.
- Keep at least one complete row visible; shrink the scroll viewport instead of flipping below the composer.
- Use 4px internal padding, 14px radius, a 1px semantic ink border, opaque raised parchment, and the existing restrained shadow. No backdrop blur.
- Use contained vertical scrolling, `touch-action: pan-y`, and no horizontal overflow.
- Opening/closing causes zero transcript or composer displacement. Hide scroll-to-latest while the panel overlaps it.
- Use `100dvh`, `viewport-fit=cover`, and safe-area padding at the app/composer boundary. Recalculate after visual-viewport resize/scroll, rotation, keyboard-language changes, and PWA foregrounding.

Rows:

- Minimum 56px height and never below 44px; padding 9px block and 12px inline; the whole row is the target.
- Canonical `/name` uses Inter 15px/20px, weight 600, carbon ink, isolated LTR.
- Authoritative argument hint uses Inter 12px/17px secondary ink; description uses Source Serif 4 13px/18px and wraps naturally.
- Source marker is optional text (“Extension”, “Prompt”, or “Skill”), never a path or colored capability badge.
- Confirmation marker is textual “Asks first,” not an interactive descendant and not a submit-time gate substitute.
- Disabled reason replaces the description and uses an AA-compliant disabled token; opacity alone is insufficient.
- Descriptions normally occupy no more than two lines at default scale; enlarged text removes visual clamping and permits row growth.
- External strings use `overflow-wrap: anywhere` and content-driven heights.

Active/pressed states keep carbon text as the primary readable color. Use a clay-tinted wash plus a 2px high-contrast logical-start rail and increased label weight. Clay `#d97757` is never command-name, description, or sole focus-indicator text. The focus indicator remains identifiable without color in light, dark, and increased-contrast modes.

Opening, closing, and filtering are immediate. An active-row color transition may last 80ms; pressed feedback is immediate. No translation, scale, spring, stagger, animated height, shimmer, or smooth scrolling. Under `prefers-reduced-motion: reduce`, remaining transitions are zero-duration.

### Accessibility and internationalization

Use React Aria `Autocomplete`, the existing `TextArea`, a nonmodal `Popover`, and `ListBox`. Let React Aria generate the relationship; do not layer duplicate roles or attributes over its output.

Required accessibility outcomes:

- The editor accessible name is “Message Pi.”
- While open, the editor exposes multiline editing, list autocomplete, expanded state, controlled-list reference, and active-descendant reference.
- The list label is “Available host commands.”
- Each option announces canonical command, authoritative hint, description, source, confirmation requirement, disabled state, and disclosed disabled reason.
- Rows contain no nested buttons, links, or independently focusable badges.
- One nonfocusable `role="status" aria-atomic="true"` announces loading, result counts, stale refreshes, insertion, and errors. Result-count announcements are debounced by 250ms.
- Do not duplicate active-option speech in the live region unless physical VoiceOver testing proves `aria-activedescendant` insufficient.
- At 200% text and 320 CSS-pixel width, rows grow and the panel scrolls; there is no page-level horizontal scrolling and the focused composer remains visible.
- Every row is at least 44×44 CSS pixels; normal text contrast is at least 4.5:1 and meaningful indicators at least 3:1.
- Browser zoom and pinch zoom remain enabled; the textarea remains at least 16px to avoid iOS focus zoom.
- Test installed-PWA mode on physical iPhones with VoiceOver, Voice Control, Switch Control, Full Keyboard Access, and a Bluetooth keyboard.

Use CSS logical properties throughout. Set `lang` and `dir` from the selected BCP 47 locale. Wrap canonical names in `<bdi dir="ltr" translate="no">`; use supplied language metadata for descriptions and `dir="auto"` when unknown. Search normalization never changes the displayed/inserted canonical string. Reject or visibly escape command names containing control or bidi-override characters.

## Acceptance criteria

The feature is complete only when every check below passes. Each criterion identifies the proof required.

1. **Trigger predicate — component test and DOM assertion.** `/` at index zero opens; ` /`, `hello /`, `/plan args`, a slash after a newline, a noncollapsed selection, and active IME composition do not open. Caret movement and committed paste/dictation/undo/redo reevaluate the same predicate.
2. **Escape latch — component test.** Escape closes without changing draft, selection, focus, or attachments and prevents reopening until draft/selection changes or focus leaves and returns.
3. **Catalog authority — relay and protocol tests.** The browser renders only an authenticated relay response projected from Pi `get_commands`; no hardcoded fallback or TUI-only command appears, and a malformed/incompatible response renders no partial rows.
4. **Identity isolation — relay/client race test.** A response for another host epoch or session, including an out-of-order response that arrives after a switch, is discarded and cannot replace the current catalog.
5. **Lifecycle — hook test.** Catalog loading is prefetched once per live session, shared across consumers, revalidated on reconnect/session or host change, revision notification, and foreground return after 30 seconds, and never fetched per keystroke.
6. **Deterministic ranking — pure-function test.** Exact name, alias, prefix, boundary, substring, subsequence, description, and hint fixtures rank in the specified order; a description match never outranks a name prefix; ties retain host order; no edit-distance correction occurs.
7. **Filtering performance — benchmark/test.** Filtering 500 bounded descriptors completes within 16ms at p95 on the minimum supported iPhone fixture and does not rerender transcript content.
8. **Selection parity — component test.** Touch, Enter, and the primary Insert action each update the draft exactly once to the exact canonical `/${name} `, place the caret after the space, restore textarea focus, close the panel, and record the current revision binding.
9. **Selection is local — network spy test.** Selection and filtering produce zero ticket, prompt, mutation, submission, telemetry-content, or Pi RPC requests.
10. **Keyboard semantics — component/DOM test.** Arrow keys move virtual focus only through enabled rows without wrapping; Enter consumes the event while open; no-active-row Enter announces “No command selected”; Shift+Enter inserts a newline; Tab traverses normally; second Enter after insertion follows explicit Send policy.
11. **Touch semantics — component/manual iPhone step.** Vertical drag scrolls only the list, completed press activates an enabled row, disabled rows cannot activate, outside tap closes without editing, horizontal swipe and long-press have no hidden command action, and textarea long-press retains native selection.
12. **IME semantics — component/manual iPhone step.** No parsing, filtering, insertion, or submission interception occurs during composition; committed text is evaluated after composition ends.
13. **State coverage — DOM assertions.** Loading, unfiltered, filtered, refreshing, empty catalog, no matches, stale offline, no snapshot, host unavailable, forbidden, incompatible, disabled row, committing, drafted, revalidating, stale submit, denied submit, and running-session states render the specified copy and controls, with draft preservation and fail-closed actions.
14. **Shared `+` route — component test.** Inline and `+` discovery use the same catalog, ranking, canonical insertion, and revision-binding reducer; only one surface is present at a time.
15. **Focus and layout — true-390px CDP screenshots.** In a 390 CSS-pixel viewport with the keyboard-open simulation, panel open/close does not move transcript or composer, the textarea remains focused/visible, safe-area padding is correct, and no horizontal page scroll occurs in both light and dark themes.
16. **Responsive text — CDP screenshot plus DOM assertion.** At 320 CSS pixels and 200% text, rows grow, the panel scrolls, all text remains readable, and the page does not horizontally scroll. At default scale, descriptions normally occupy at most two lines; enlarged text is not visually clamped.
17. **Visual system — CDP screenshot and contrast test.** Bone/carbon/clay semantic tokens, Inter, Source Serif 4, active rail, focus indicator, disabled text, light/dark inverse tokens, radius, border, shadow, and immediate motion match the requirements; clay is never the sole focus cue or normal text color.
18. **Accessibility tree — browser accessibility inspection plus component test.** The editor is named “Message Pi” and exposes multiline autocomplete relationships; the list is labelled “Available host commands”; options expose all required metadata; no nested focusable descendants exist; one atomic status region carries state announcements.
19. **Internationalization safety — protocol/component test.** Canonical names render and insert exactly as supplied inside isolated LTR text; descriptions use safe direction; control and bidi-override characters are rejected or visibly escaped; locale `lang`/`dir` and logical layout are applied.
20. **Draft execution gate — relay integration test.** Explicit Send is the only path that requests exactly one fresh one-use ticket and exactly one revision-checked prompt submission. A slash command is never silently mapped to steer/follow-up because a turn is running.
21. **Revision race — relay integration/security test.** If host epoch, session, session revision, or catalog revision changes between insertion and Send, no Pi RPC call occurs; the draft remains visible, the binding clears, the catalog refreshes, and the user is asked to choose the command again.
22. **Denied/disabled command — relay negative-control test.** Hidden, malformed, disabled, unknown, path-like, privileged, and stale leading-slash commands never reach Pi. The client never converts them into ordinary text submission.
23. **Running and plan policy — manual on-device plus relay test.** Host/extension availability controls each row; plan mode remains host/extension-enforced; unavailable running-state authority disables slash Send rather than guessing.
24. **Redaction and storage — repository/security test.** Catalog payloads contain no paths, filenames, prompt bodies, source, secrets, ticket values, or raw host errors; catalogs/bindings/query state are absent from persistence, service-worker responses, URLs, crash reports, and content telemetry.
25. **Physical iPhone release check — manual on-device step.** Installed-PWA mode passes VoiceOver, Voice Control, Switch Control, Full Keyboard Access, Bluetooth keyboard, keyboard-language change, rotation, foreground/background, reduced-motion, light, and dark checks without losing draft or focus.

## Security and redaction requirements

The feature remains read-only by default. Discovery is an authenticated read of the relay’s already allowed `get_commands` projection. The inline UI is not a new authority boundary and must not widen the existing command surface.

- `/api/commands/list` remains authenticated and separately authorized as `commands:list`. It is the only catalog source. The relay scopes every response to the authenticated principal, host epoch, and session.
- `apps/pi-remote-relay/src/store/redaction.ts` must emit only an allowlisted, bounded projection. Drop paths, filenames, prompt bodies, source locations, hidden rows, raw Pi errors, secrets, tokens, and unknown nested fields before a browser DTO is created.
- `CommandService` must safe-filter privileged/destructive names and reject names with leading `!`, `$`, whitespace, path semantics, control characters, or bidi overrides. Disabled rows are disclosed only when the relay deliberately chooses to disclose a safe reason.
- Aliases and argument hints are absent unless authoritative metadata survives an explicit protocol allowlist. The client must never derive them from descriptions or other strings.
- Keep the catalog, selected binding, query, and state in memory only. Do not put them in existing transcript/session cache, `localStorage`, IndexedDB, Cache Storage, service-worker responses, URLs, analytics, crash reports, or content-bearing logs.
- Filtering, opening, closing, and insertion make no host or mutation request. Selection never obtains a ticket.
- Send must use one fresh, one-use ticket and current expected identity/revision values. The relay consumes the ticket once, checks authenticated device/session/principal and foreground/read-only policy, revalidates the effective command, and fails closed before forwarding to Pi on any mismatch.
- A `requiresConfirmation` marker is informational. Existing approval, mutation, and plan-mode gates remain authoritative and cannot be bypassed by a slash string.
- A stale, forbidden, malformed, unavailable, delivery-unknown, or incompatible outcome preserves the draft, clears unsafe bindings where required, gives a bounded user-facing error, and does not auto-retry.
- Do not log full command arguments, ticket values, catalog payloads, or prompt content as diagnostic context. Reuse existing redaction and content-free telemetry posture.

## Dependencies and affected areas

| Area | Files/components | Required change |
|---|---|---|
| Protocol | `packages/pi-rpc-protocol/src/types.ts`, `guards.ts`, `index.ts`, `packages/pi-rpc-protocol/tests/guards.test.ts` | Versioned catalog identity, optional authoritative metadata, selected binding, slash-aware expected-revision submission contract, strict guards, and public exports. |
| Relay authority | `apps/pi-remote-relay/src/commands/command-service.ts`, `src/store/redaction.ts`, `src/http/server.ts`, `src/prompt/prompt-service.ts`, `src/auth/policy.ts`, `src/index.ts` | Host/session/catalog revision lifecycle, safe allowlist projection, authenticated catalog endpoint, one-use ticket/revision gate, host-forwarding checks, and fail-closed error mapping. |
| Web transport/state | `apps/pi-remote-web/src/relay.ts`, `src/commands.ts`, `src/App.tsx`, `src/state.ts` | Catalog lifecycle, abort/race protection, foreground/reconnect invalidation, binding state, stale/denied submit handling, and explicit Send integration. |
| Web composer | `apps/pi-remote-web/src/SessionComposer.tsx`, `src/CommandPalette.tsx`, plus `ComposerCommandAutocomplete`, `CommandOption`, `useSlashTrigger`, `rankHostCommands`, `insertSlashCommand`, `useVisualViewportAnchor`, and `submitSlashDraft` modules | Single textarea inline surface, shared `+` route, trigger/parser, ranking, insertion, state rendering, keyboard/touch behavior, focus, accessibility, and submit gate. |
| Web styling/PWA | `apps/pi-remote-web/src/style.css`, `apps/pi-remote-web/index.html`, existing viewport/theme helpers | Semantic light/dark styles, logical layout, safe-area/`100dvh`/`visualViewport` handling, no-displacement panel, and reduced motion. |
| Tests/release | `apps/pi-remote-web/tests/*`, `apps/pi-remote-relay/tests/commands.test.ts`, `prompt.test.ts`, `security/negative-controls.test.ts`, protocol tests, CDP harness, physical iPhone checklist | Pure-function, component, relay, protocol, accessibility, security, performance, true-390px light/dark, and on-device verification. |

No database migration or catalog persistence is required for v1.
