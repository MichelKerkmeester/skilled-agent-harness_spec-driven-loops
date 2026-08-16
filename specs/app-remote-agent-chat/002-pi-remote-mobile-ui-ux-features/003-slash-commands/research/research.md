> **Deep research — external-CLI multi-executor run.** 10 independent iterations (5 × GPT 5.6 SOL high (--search, cli-codex), 5 × Grok 4.6 xhigh (cli-cursor)), no early convergence. Synthesis of all passes into one build-ready decision.
> **Provenance:** produced by external-CLI orchestration, NOT the `/deep:research` state-machine runtime — so runtime state artifacts (`deep-research-state.jsonl`, `findings-registry.json`, `deep-research-dashboard.md`, observability, deltas, lineages) are intentionally absent. See `PROVENANCE.md`.
> **Canonical:** this file (`research.md`) is the synthesized output; per-pass findings live in `iterations/iteration-NNN.md`.

---

# F3-slash-commands — Synthesis

## 1. Decision

Build a nonmodal command autocomplete directly above the existing composer, with the current multiline textarea remaining the only editing field. A leading `/` at character zero opens the relay-filtered `get_commands` catalog; typing filters locally, and selecting a result only inserts the canonical command plus a trailing space. The existing `+` command browser and the inline route share one catalog, ranking function, and insertion reducer. This is preferred over a second `ComboBox`, mobile tray, or sheet because those steal focus, disrupt the iOS keyboard, and weaken the terminal interaction validated by Kimi, Pi, and coding-agent prior art (iter-01, iter-02, iter-05, iter-06). Execution remains separate and fail-closed: only explicit Send requests a one-use ticket and submits against current session and catalog revisions.

## 2. Build spec

### 2.1 Command authority and protocol

“Available commands” means commands remotely invokable through Pi’s RPC prompt channel: effective extension commands, prompt templates, and skills. It does not include TUI-only built-ins such as interactive settings or model pickers unless Pi later exposes remotely executable equivalents (iter-03, iter-04, iter-05).

The relay-filtered catalog is the only source of truth:

```ts
type RemoteCommandCatalog = {
  hostEpoch: string;
  sessionId: string;
  sessionRevision: string;
  catalogRevision: string;
  commands: CommandDescriptorDto[];
};

type CommandDescriptorDto = {
  name: string; // canonical, no leading slash
  description: string | null;
  source: "extension" | "prompt" | "skill";
  enabled: boolean;
  disabledReason: string | null;
  requiresConfirmation: boolean;

  // Optional only after an allowlisted protocol extension:
  aliases?: string[];
  argumentHint?: string | null;
};

type SelectedCommandBinding = {
  name: string;
  sessionRevision: string;
  catalogRevision: string;
};
```

Rules:

- Never ship a hardcoded fallback catalog or recreate Pi’s TUI built-ins.
- Treat the canonical name, including host-assigned suffixes such as `review:1`, as the command’s identity within a catalog revision.
- `argumentHint` and `aliases` are absent unless authoritative host metadata survives an allowlisted, redacted protocol projection. Never infer them from descriptions, paths, filenames, prompt bodies, or command source.
- Scope every snapshot to the authenticated principal, host epoch, and session. Never show one host’s commands while another host or session is loading.
- Keep the catalog in memory only. Do not place it in `localStorage`, IndexedDB, Cache Storage, service-worker responses, transcript persistence, or crash reports.
- Prefetch when an authenticated session becomes live. Revalidate on reconnect, host/session change, revision notification, and foreground return when the snapshot is older than 30 seconds. Share in-flight requests and never fetch per keystroke or automatically on every `/`.
- Use `AbortController` plus a monotonically increasing request ID; commit a response only if its auth epoch and session still match.
- A full `commands.updated` snapshot should replace the previous snapshot rather than merge individual rows.

### 2.2 Component breakdown

| Component | Responsibility |
|---|---|
| `SessionComposer` | Owns the controlled draft, selection, composition state, normal submission, and the primary action button. Submission must consult slash-menu state. |
| `useHostCommandCatalog` | Fetches, scopes, invalidates, and revalidates the in-memory catalog; exposes current, refreshing, stale, and error states. |
| `useSlashTrigger` | Derives the trigger range and query from draft, caret, focus, IME state, and Escape dismissal latch. It performs no filtering or transport. |
| `rankHostCommands` | Locale-aware, deterministic client-side ranking over the current redacted catalog. |
| `ComposerCommandAutocomplete` | React Aria `Autocomplete` with the existing `TextArea`, a nonmodal `Popover`, and `ListBox`. Owns active-option state and presentation. |
| `CommandOption` | Renders one text-only option: command, authoritative hint, description, source, confirmation marker, or disabled reason. |
| `insertSlashCommand` | Replaces the complete leading command token with `/${name} `, restores caret/focus, records the revision binding, and performs zero network requests. Shared by inline and `+` discovery routes. |
| `useVisualViewportAnchor` | Updates available panel height from `visualViewport` resize/scroll and orientation changes through `requestAnimationFrame`. |
| `submitSlashDraft` | Resolves the leading token against the current catalog, requests a one-use ticket, supplies expected revisions, and handles stale or denied outcomes without clearing the draft. |

Pin the React Aria version and isolate the autocomplete behind `ComposerCommandAutocomplete`, so a lower-level React Aria implementation can replace it if iOS VoiceOver testing exposes a library regression.

### 2.3 Trigger, filtering, and insertion

Open the inline panel only when all conditions are true:

```text
composer is focused
draft begins with ASCII "/" at index 0
selection is collapsed
caret is within the first token
the token contains no whitespace, newline, or second slash
IME composition is not active
the exact draft/selection has not been dismissed with Escape
```

Consequences:

- `/` opens the complete catalog.
- `/pla` filters it.
- ` /pla`, `hello /pla`, a slash after a newline, and `/plan args` do not open it.
- Paste, dictation, undo/redo, and caret movement re-evaluate the predicate after committed input.
- Moving the caret within the initial token may reopen the list; selection replaces the entire token, not only text before the caret.
- `compositionstart` freezes parsing, filtering, Enter handling, and selection. After `compositionend`, clear the composition guard on the next event-loop turn before re-evaluating.
- Escape closes the panel without editing and suppresses reopening until the draft or selection changes, or focus leaves and returns.

Filter the already-downloaded catalog locally. Normalize comparison text for case, diacritics, and Unicode normalization, but display and insert the exact canonical host string. Rank:

1. Exact canonical name.
2. Exact authoritative alias.
3. Canonical-name prefix.
4. Alias prefix.
5. Prefix after a `:`, `-`, or `_` boundary.
6. Contiguous name or alias substring.
7. Ordered name subsequence, penalizing gaps.
8. Description substring.
9. Argument-hint substring.
10. Original host order.

Do not use edit-distance autocorrection or usage-history reranking. A plausible typo must not silently become a different host command. Bold matching graphemes; do not use clay-colored match text.

With an empty query, preserve host order. Disabled rows remain in their server-provided position but are skipped by keyboard activation. The first enabled result becomes active. Preserve the active command by canonical name when reranking if it remains visible.

On selection:

1. Resolve the selected row in the current catalog revision.
2. Replace the complete trigger token with `/${name} `.
3. Update controlled state synchronously, then place the caret after the space.
4. Keep or restore textarea focus without scrolling the page.
5. Close the panel.
6. Record `{name, sessionRevision, catalogRevision}` beside the draft.
7. Announce “Slash command name inserted. Not sent.”
8. Make no ticket, prompt, mutation, telemetry-content, or host request.

Editing the command-name token clears the binding. Editing arguments retains it. A host revision change marks it stale; Send must re-resolve or require reselection.

### 2.4 State model

| State | Presentation | Behavior |
|---|---|---|
| `closed` | No panel in the DOM or accessibility tree. | Normal composer behavior. |
| `loading.initial` | Anchored card with “Loading available commands…” and three static skeleton rows. | Drafting continues. Command insertion and primary action are disabled. |
| `ready.unfiltered` | Full current catalog in host order. | First enabled row is active. |
| `ready.filtered` | Ranked matches with matched graphemes bolded. | Preserve active name when possible; otherwise activate the first enabled match. |
| `refreshing.current` | Existing same-session rows remain visible with “Checking for command changes…”. | Rows may still be inserted because insertion is local; execution still revalidates. |
| `ready.emptyCatalog` | “No commands are available in this session.” | Nonselectable; Retry is available outside the listbox. |
| `ready.noMatches` | `No command matches “/query”.` | Enter and the primary action do nothing; no synthetic “send as text” result. |
| `ready.staleOffline` | Same-session memory snapshot with “Last verified — reconnect before sending.” | Draft insertion is allowed. Submission is unavailable until live revalidation. |
| `error.noSnapshot` | “Reconnect to load commands.” | Composer remains usable for non-slash drafts. |
| `error.hostUnavailable` | “Pi is not responding.” plus Retry. | Preserve draft; do not expose stale rows from another session. |
| `error.forbidden` | “Commands aren’t available for this device.” | Clear catalog and revision binding immediately. |
| `error.incompatible` | “The phone and host versions don’t agree.” | Reject malformed rows and do not render partial payloads. |
| `row.disabled` | Row remains visible only when the relay deliberately disclosed it; reason begins with “Unavailable:”. | Never active, insertable, or executable. |
| `committing` | Transient reducer state lasting at most one render. | Draft update only; no transport. |
| `drafted` | Composer contains canonical command and optional arguments; panel is closed. | Explicit Send is available when the connection and host state permit. |
| `submit.revalidating` | Primary action shows bounded progress; draft remains visible. | Request one ticket and validate catalog/session revisions. No automatic retry. |
| `submit.stale` | Inline error: “Commands changed on the host. Choose the command again.” | Zero Pi calls; refresh catalog, preserve draft, clear binding. |
| `submit.denied` | Inline error: “That command isn’t available from this phone.” | Zero Pi calls; preserve draft. |
| `session.running` | Relay-provided effective availability controls each row. | Never reinterpret an extension command as steer/follow-up. If authoritative availability is unavailable, disable slash-command submission until idle. |

### 2.5 Touch, gestures, and keyboard

| Input | Result |
|---|---|
| Type `/` at index zero | Open the panel within the next rendered frame. |
| Type committed characters | Filter immediately; no network request. |
| Tap an enabled row | Insert on completed press/release; never submit. |
| Tap a disabled row | No insertion; announce its reason. |
| Drag vertically in the list | Scroll the list only; cancel row activation. |
| Swipe down | Scroll; it does not dismiss the panel. |
| Horizontal swipe | No command action. |
| Long-press a row | No hidden action or selection. Suppress row text selection/context menus. |
| Long-press the textarea | Preserve native iOS text selection and editing. |
| Tap outside | Close without editing, then allow the tapped target’s normal behavior. |
| Tap `+` | Close inline completion and open the existing tools browser. The two surfaces are mutually exclusive. |
| Tap primary disc while open | Perform the same local Insert action as Enter when an active row exists. It is labelled “Insert command,” never “Send.” Disabled otherwise. |
| `ArrowDown` / `ArrowUp` | Move virtual focus to the next/previous enabled row without wrapping; keep it visible with immediate `scrollIntoView({block: "nearest"})`. |
| `Enter` while open | Insert the active row and consume the event. It never reaches composer or form submission. With no active row, do nothing and announce “No command selected.” |
| Second `Enter` after insertion | Follows the composer’s existing explicit submission policy. |
| `Shift+Enter` | Insert a newline and close completion. |
| `Escape` | Close; retain exact draft, selection, focus, and attachments. |
| `Tab` | Close and continue normal document focus traversal. It does not select. |
| Left/Right, editing shortcuts, undo/redo | Retain native textarea behavior; the trigger parser decides whether the panel remains valid. |
| Any key during IME composition | No filtering, insertion, or submission interception. |

Use React Aria press handling with focus prevention on options. Where required by WebKit, cancel both `pointerdown` and compatibility `mousedown`, then commit on completed press. Do not use `touchstart` activation.

The list is not part of the Tab order. DOM focus remains in the textarea while arrows change virtual focus.

### 2.6 Visual, layout, and motion

Panel:

- Anchor 8px above the composer shell, `placement="top start"`, `shouldFlip={false}`, and `isNonModal`.
- Match the composer’s inline width with at least 12px screen margins.
- Maximum height: `min(280px, 40% of visualViewport.height, available space above composer − 8px)`.
- Keep at least one complete row visible; shrink the scroll viewport rather than flipping below the composer.
- Use 4px internal padding, 14px radius, a 1px semantic ink border, opaque raised parchment, and the restrained existing shadow. No backdrop blur.
- Use contained vertical scrolling, `touch-action: pan-y`, and no horizontal overflow.
- Opening and closing must cause zero transcript or composer displacement.
- Hide the scroll-to-latest control while the panel overlaps its position.
- Use `100dvh`, `viewport-fit=cover`, and safe-area padding at the app/composer boundary. Recalculate after visual-viewport resize/scroll, rotation, keyboard-language changes, and PWA foregrounding.

Rows:

- Minimum height 56px; never below 44px.
- Padding: 9px block, 12px inline; the entire row is the target.
- `/name`: Inter, 15px/20px, weight 600, carbon ink, isolated LTR.
- Argument hint: Inter, 12px/17px, secondary ink, displayed only when authoritative.
- Description: Source Serif 4, 13px/18px, secondary ink, wrapping naturally.
- Source marker: optional Inter 11–12px text—“Extension,” “Prompt,” or “Skill”—never a path or colored capability badge.
- Confirmation marker: textual “Asks first”; not an interactive descendant and not a substitute for the submit-time gate.
- Disabled reason replaces the description and uses an AA-compliant disabled text token. Do not use opacity alone.
- At default scale, descriptions should normally occupy no more than two lines; at enlarged text sizes remove visual clamping and let rows grow.
- External strings use `overflow-wrap:anywhere` and content-driven heights.

Active and pressed states:

- Carbon text remains the primary readable color.
- Use a clay-tinted wash plus a 2px high-contrast logical-start rail and increased label weight. Clay `#d97757` does not meet AA for normal text on bone, so it is never the command-name, description, or sole focus indicator.
- The focus indicator must remain identifiable without color in light, dark, and increased-contrast modes.
- Light canvas remains bone `#f8f8f6`; dark mode uses the established semantic inverse tokens rather than literal color inversion.

Motion decision:

- Open, close, and filtering are immediate. This is a high-frequency terminal interaction and must never wait for animation (iter-08).
- Active-row color may transition for 80ms; pressed feedback is immediate.
- No translation, scale, spring, stagger, animated height, shimmer, or smooth scrolling.
- Under `prefers-reduced-motion: reduce`, all remaining transitions are zero-duration.

### 2.7 Accessibility and internationalization

Use React Aria `Autocomplete`, the existing `TextArea`, a nonmodal `Popover`, and `ListBox`. Preserve native multiline textarea behavior and let React Aria generate the relationship; do not layer duplicate roles or attributes over its output.

Required accessibility-tree outcomes:

- Editor accessible name: “Message Pi.”
- Editor exposes multiline editing plus list autocomplete, expanded state, controlled-list reference, and active-descendant reference while open.
- List label: “Available host commands.”
- Each option announces the canonical command, authoritative hint, description, source, confirmation requirement, disabled state, and disabled reason.
- Rows contain no nested buttons, links, or independently focusable badges.
- A single nonfocusable `role="status" aria-atomic="true"` announces loading, result counts, stale refreshes, insertion, and errors.
- Debounce result-count announcements by 250ms. Do not duplicate active-option speech in the live region unless iOS VoiceOver fails to announce `aria-activedescendant`.
- Announce insertion as “Inserted slash command name. Not sent.”
- At 200% text and 320 CSS-pixel width, rows grow and the panel scrolls; there is no page-level horizontal scrolling and the focused composer remains visible.
- Every row is at least 44×44 CSS pixels, with normal text contrast of at least 4.5:1 and meaningful indicators at least 3:1.
- Browser zoom and pinch zoom remain enabled; the textarea stays at least 16px to avoid iOS focus zoom.
- Test VoiceOver, Voice Control, Switch Control, Full Keyboard Access, a Bluetooth keyboard, and installed-PWA mode on physical iPhones.

Internationalization:

- Use CSS logical properties throughout.
- Set document `lang` and `dir` from the selected BCP 47 locale.
- Wrap canonical commands in `<bdi dir="ltr" translate="no">`.
- Descriptions use supplied language metadata and `dir="auto"` when unknown.
- Search normalization never changes the displayed or inserted canonical string.
- Reject or visibly escape host command names containing control or bidi-override characters.

### 2.8 Pass/fail acceptance checks

The feature is complete only when all checks pass:

1. `/` at index zero opens; ` /`, `hello /`, `/plan args`, a slash after a newline, and active IME composition do not.
2. A host/session switch can never render the previous catalog, including while requests resolve out of order.
3. Selecting through touch, Enter, or the primary Insert action updates the draft exactly once and produces zero ticket, prompt, mutation, or submission requests.
4. Enter with an open empty/error/loading panel produces zero submissions.
5. `/${name} ` is inserted exactly, with the caret after the space and the iOS keyboard still visible.
6. Exact name, prefix, boundary, substring, and description fixtures produce deterministic ordering; a description match cannot outrank a name prefix.
7. Filtering 500 bounded descriptors completes within 16ms at p95 on the minimum supported iPhone and does not rerender the transcript.
8. A catalog revision change between insertion and Send produces zero Pi calls, retains the draft, and requests reselection.
9. Explicit Send produces exactly one one-use ticket request and one revision-checked prompt request. No mutation is automatically retried.
10. Hidden, malformed, disabled, stale, and unknown leading-slash commands never reach Pi.
11. Canary paths, tokens, bearer strings, secret assignments, and bidi controls are absent from visible DOM, hidden DOM, ARIA strings, status text, logs, telemetry, caches, and serialized catalog responses.
12. IME confirmation Enter cannot insert or submit a partial command.
13. Tap-dragging through the list repeatedly produces zero accidental insertions.
14. The panel remains inside the visual viewport in Safari and installed-PWA modes across portrait, landscape, keyboard show/hide, globe-key changes, and suspension/resume.
15. Light, dark, 200% text, increased contrast, and reduced-motion variants pass automated checks plus physical-device VoiceOver review.
16. No command catalog appears in local storage, IndexedDB, Cache Storage, service-worker cache, transcript persistence, or snapshots.

## 3. Consensus vs divergence

### Consensus

All ten passes converge on these points:

- The relay-filtered live catalog must be the sole command authority; a client-maintained list will drift and may expose non-executable or unsafe commands (iter-01 through iter-10).
- The surface belongs above the composer, with the composer itself acting as the filter. A second search input, default mobile ComboBox tray, or sheet breaks terminal continuity and iOS keyboard behavior (iter-02, iter-05, iter-06, iter-08, iter-10).
- Selection and execution must be separate. Selection inserts editable text; only explicit Send can request a ticket and contact Pi.
- Command filtering is local, immediate, deterministic, and based only on already-redacted metadata.
- The software keyboard must remain visible, DOM focus must remain in the textarea, and the panel must follow the visual viewport.
- Argument hints, aliases, and availability must be authoritative. Missing metadata is omitted rather than guessed.
- Touch targets, VoiceOver status, IME handling, dark mode, enlarged text, and physical-iPhone testing are release requirements.
- Catalog descriptions, disabled reasons, accessible labels, and telemetry are security surfaces and require the same redaction discipline as visible transcript content.

### Resolved divergences

| Divergence | Decision |
|---|---|
| Character-zero versus first nonwhitespace or post-newline triggers | Use character zero only. It matches Kimi’s strict rule, avoids paths and prose, and preserves one-command-per-message semantics. |
| Full fuzzy matching versus prefix/substring matching | Use deterministic ordered-subsequence matching but no edit-distance autocorrection. |
| First result active versus no initial active option | Activate the first enabled result because acceptance only inserts local text and never executes. Revisit if device testing shows accidental completion. |
| Tab inserts versus Tab leaves the widget | Tab closes and follows normal focus traversal. Enter is the completion key. |
| Stale catalog hidden versus useful offline drafting | A same-session, memory-only snapshot may remain visible for drafting with an explicit stale label. It can never authorize execution. |
| 80–140ms panel motion versus instant terminal response | Open, close, and filter instantly; retain only optional 80ms color feedback. |
| `ListBox` versus `Menu` | Use `ListBox`: choosing an option completes editable text rather than invoking an immediate action. |
| Unknown `/text` sent as prose versus blocked | Fail closed. Unknown and hidden leading-slash tokens never reach Pi. |

### Minority ideas worth retaining

- **Schema-driven argument completion:** after `/name `, a second completion phase would materially improve parity, but only after Pi exposes a side-effect-free, redacted, revision-bound argument-completion protocol (iter-02, iter-04, iter-05).
- **Accessibility command deck:** if inline textarea/listbox semantics remain unreliable with iOS VoiceOver, `+` should offer a full-height searchable command deck that returns selection to the original composer without submitting (iter-01, iter-03, iter-10).
- **Authoritative push snapshots:** a `commands.updated` full-snapshot event would eliminate most polling and bound catalog staleness more cleanly than open-time refreshes (iter-04).
- **Offline command preparation:** keeping a same-session memory snapshot for drafting is useful and remains safe when Send requires reconnection and fresh revision validation (iter-04).
- **Read-only command chaining:** multiple revision-bound commands could eventually be supported for commands proven read-only, but only after atomicity, ordering, cancellation, and partial-failure rules exist (iter-01).

## 4. Security & redaction

1. **The feature is read-only until explicit Send.** Catalog retrieval is an authenticated read. Filtering, navigation, and insertion are local editor operations. None requests a mutation ticket or contacts Pi.

2. **Every leading-slash submission is revision checked.** On Send, parse the first token, normalize it, and resolve it against the current relay-filtered catalog. Request a one-use `prompt:submit` ticket bound to the principal, session, final body, session revision, and catalog revision. The relay must revalidate the canonical name against a fresh or revision-matching catalog before calling Pi.

3. **Stale or denied submissions fail before the host boundary.** Revision mismatch, unknown name, hidden command, disabled command, wrong session, or invalid ticket returns a typed error and produces zero Pi calls. Preserve the draft and never automatically retry.

4. **Manual typing cannot bypass discovery policy.** A user may type an exact allowed command without selecting a row, but it receives the same current-catalog lookup, ticket, and revision checks. Hidden-but-real commands and unknown `/foo` are denied rather than converted into ordinary prose.

5. **Catalog projection is allowlist-based.** The relay emits only approved fields. Strip `path`, `location`, filenames, source content, environment values, and unknown keys. Normalize and validate names; reject path separators, whitespace, C0 controls, bidi overrides, malformed Unicode, and oversized values.

6. **Redaction precedes every observation surface.** Apply canonical redaction to descriptions and disabled reasons before HTTP delivery. Build visible text, hidden text, ARIA strings, live-region copy, errors, tests, and snapshots only from that redacted DTO. Render text nodes only—no HTML, Markdown, active links, or `dangerouslySetInnerHTML`.

7. **Raw arguments have one narrow lifetime.** The final raw command and arguments exist only in the controlled draft and the explicitly ticketed execution request sent to Pi. They must not enter logs, analytics, crash payloads, persisted drafts, or catalog telemetry. Transcript persistence and broadcasts receive canonical redaction first.

8. **Telemetry is content-free.** Record only request latency, result count, error class, catalog revision, and performance timings. Do not record names, queries, descriptions, arguments, composer text, source paths, or disabled reasons.

9. **Catalogs never persist.** Clear memory on logout, unpairing, revocation, `401`/`403`, principal change, host-epoch change, or session replacement. The service worker must bypass `/api/` and all command responses must use `no-store`.

10. **Plan mode remains host/extension enforced.** The PWA does not optimistically enable tools, reinterpret `/plan`, or convert an inserted command into a client-only mode toggle. Runtime mode changes remain their separate ticketed, revision-checked control path. The host extension and relay enforce read-only tool policy regardless of what the phone displays.

11. **Streaming behavior remains explicit.** The client never converts an extension command into steer or follow-up. Effective availability must come from the relay; if the relay cannot prove the command safe in the current running state, submission is disabled until idle.

12. **No adjacent mutation channel is introduced.** This slice adds no `!` shell mode, `@` path browser, upload command, file picker, binary attachment, command chaining, or client-side expansion of prompts and skills.

## 5. Open questions + risks

- **Protocol metadata:** Decide whether this slice adds authoritative `argumentHint`, aliases, language metadata, and catalog revisions. The honest partial release can ship without hints or aliases, but revision metadata is required for the fixed security posture.
- **Catalog identity:** Confirm that the remotely invokable RPC catalog—not Pi’s full TUI inventory—is the product definition of “real host commands.” Otherwise interactive built-ins need purpose-built mobile controls.
- **Revision allocation:** Relay catalog revisions must be serialized or atomically allocated. Duplicate or out-of-order revisions cannot serve as freshness evidence.
- **Running-turn commands:** Confirm whether the relay can compute effective command availability while Pi streams. Until it can, the conservative implementation disables slash-command submission during a running turn.
- **Unknown slash copy:** The behavior is decided as fail-closed, but product copy should explicitly explain the deliberate divergence from Kimi’s “send as text” fallback.
- **iOS accessibility:** React Aria’s textarea autocomplete and virtual focus require validation on the minimum supported iOS version, current iOS, Safari, and installed-PWA mode. If VoiceOver cannot reliably traverse it, the `+` command deck becomes the supported accessibility route.
- **Visual viewport defects:** Standalone PWA rotation, keyboard-language changes, dictation, and keyboard dismissal remain WebKit risks. Do not sign off from desktop emulation alone.
- **Catalog scale:** Measure real catalogs. If 500 rows fail the 16ms gate, use an accessible React Aria virtualizer that keeps the active option mounted and provides correct set-size/position metadata.
- **Mobbin validation:** Public links establish reference flows but not authenticated pixel measurements or accessibility behavior. Review the exact Claude, Slack, and Discord screens in a licensed Mobbin workspace before final visual sign-off.
- **Theme verification:** Clay must remain decorative/redundant. Recalculate all semantic token pairings against the actual dark surfaces rather than assuming the light-mode result transfers.

## 6. Sources

### Pi and Pi Remote

- [Pi RPC mode and `get_commands`](https://pi.dev/docs/latest/rpc)
- [Pi extension and command API](https://pi.dev/docs/latest/extensions)
- [Pi monorepo](https://github.com/badlogic/pi-mono)
- [Pi Remote repository](https://github.com/MichelKerkmeester/pi-mobile-pwa-tailscale)
- [Harness Remote](https://github.com/giuliastro/harness-remote)

### Interaction and implementation

- [React Aria Autocomplete](https://react-aria.adobe.com/Autocomplete)
- [React Aria ListBox](https://react-aria.adobe.com/ListBox)
- [React Aria Popover](https://react-aria.adobe.com/Popover)
- [React Aria mobile ComboBox engineering](https://react-aria.adobe.com/blog/building-a-combobox)
- [Kimi Code interaction guide](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction)
- [Kimi Code slash-command reference](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/slash-commands.html)
- [Kimi editable selection, wrapping, and ranking fix](https://github.com/MoonshotAI/kimi-code/pull/878)
- [Kimi Code changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)
- [OpenCode composer slash popover](https://github.com/sst/opencode/blob/69a80663/packages/app/src/components/prompt-input/slash-popover.tsx)
- [Claude Code Remote Control](https://code.claude.com/docs/en/remote-control)
- [Claude Code commands](https://code.claude.com/docs/en/commands)

### Accessibility, iPhone, and web platform

- [WAI-ARIA combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WCAG focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)
- [WCAG contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
- [WCAG target-size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
- [MDN Visual Viewport API](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API)
- [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Apple touch-target guidance](https://developer.apple.com/design/tips/)
- [Apple typography guidance](https://developer.apple.com/design/human-interface-guidelines/typography)
- [WebKit standalone-PWA viewport issue](https://bugs.webkit.org/show_bug.cgi?id=218983)
- [WebKit keyboard/fixed-position issue](https://bugs.webkit.org/show_bug.cgi?id=191204)

### Mobile interaction references and Mobbin

- [Slack slash-command usage hints](https://docs.slack.dev/interactivity/implementing-slash-commands)
- [Discord application commands](https://docs.discord.com/developers/interactions/application-commands)
- [Mobbin — Claude iOS text composer flow](https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57)
- [Mobbin — Claude iOS chat detail](https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8)
- [Mobbin — Slack iOS shortcut-command flow](https://mobbin.com/explore/flows/c367fe4e-3662-4f6f-870a-93f97e5110cc)
- [Mobbin — Discord iOS chat interface](https://mobbin.com/explore/screens/041a4291-f46b-48cd-8b08-dc87cceea3f7)
