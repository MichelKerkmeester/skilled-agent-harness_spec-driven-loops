<!-- provenance: external-CLI orchestration pass; original file iter-04-sol.md -->
> **Source pass 4** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-4-sol.md`.

<!-- F3-slash-commands | model=sol | lens=edge-failure | iter 4/10 | 2026-08-15T19:11:13.671Z -->

# 1. Findings for the edge-failure lens

## 1.1 “Actual host commands” has a narrower meaning than “everything visible in Pi’s desktop UI”

Pi’s `get_commands` RPC returns extension commands, prompt templates, and skills that can be invoked through the prompt channel. It deliberately excludes interactive-only built-ins such as `/model` and `/settings`, because those require terminal UI that does not exist over RPC. Pi Remote should label the surface “Available commands,” but define its contract as “commands remotely invokable in this session,” not “every command shown by desktop Pi.” [Pi RPC documentation](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md), [Pi extension documentation](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/extensions.md)

The existing Pi Remote DTO includes `name`, `description`, `source`, `enabled`, `disabledReason`, and `requiresConfirmation`; it has no usage or argument-hint field. The current web hook also collapses every failure into `error`, clears all prior commands, and does not pass an `AbortSignal`, while the composer only offers commands inside the `+` popover. [Pi Remote command types](https://github.com/MichelKerkmeester/pi-mobile-pwa-tailscale/blob/main/packages/pi-rpc-protocol/src/types.ts), [current command hook](https://github.com/MichelKerkmeester/pi-mobile-pwa-tailscale/blob/main/apps/pi-remote-web/src/commands.ts), [current composer](https://github.com/MichelKerkmeester/pi-mobile-pwa-tailscale/blob/main/apps/pi-remote-web/src/SessionComposer.tsx)

Argument hints therefore cannot be truthfully inferred from the current catalog. Pi extensions can implement `getArgumentCompletions(prefix)`, but that function and its possible values are not exposed by `get_commands`. A build may display an argument hint only when supplied by authoritative host metadata; deriving syntax from prose descriptions would violate the “actual host list” requirement. [Pi command and argument-completion API](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/extensions.md)

Pi also resolves duplicate extension command names by assigning callable suffixes such as `/review:1` and `/review:2`. Those suffixed names must be treated as distinct host identities, not deduplicated by stripping suffixes. [Pi duplicate-command behavior](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/extensions.md)

## 1.2 Graceful degradation should preserve drafting, not pretend the catalog is current

The best precedent is to separate the durable app shell from live agent data. Harness Remote caches its PWA shell but explicitly never caches harness-server requests, preventing stale session data from masquerading as live data. Pi Remote should likewise allow the composer and command surface to render offline, while labeling any retained command snapshot as stale and continuing to require live server revalidation before execution. [Harness Remote PWA behavior](https://github.com/giuliastro/harness-remote)

A stale command snapshot is relatively safe to display because choosing a row only inserts text. It must nevertheless be scoped to the current authenticated principal, session, and host epoch, and cleared on logout, pairing change, permission denial, or session replacement. The relay must still re-fetch and revalidate the command name during submission, as Pi Remote’s command service already intends. [Pi Remote command service](https://github.com/MichelKerkmeester/pi-mobile-pwa-tailscale/blob/main/apps/pi-remote-relay/src/commands/command-service.ts)

`navigator.onLine` is not authoritative: browsers may report “online” when only a LAN or virtual adapter is reachable. It should alter explanatory copy, never decide whether a request or selection is allowed. The decisive evidence is the catalog request and authenticated relay connection. [MDN `navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)

Loading must not disable the composer or replace it with a blank region. Apple recommends displaying placeholders promptly, letting people continue other actions, and supplying actionable feedback if an operation stalls. For this feature, that means a stable three-row placeholder above the composer while the user continues typing. [Apple loading guidance](https://developer.apple.com/design/human-interface-guidelines/loading), [Apple progress-indicator guidance](https://developer.apple.com/design/human-interface-guidelines/progress-indicators)

## 1.3 The essential failure states are not interchangeable

The UI must distinguish at least:

- A valid catalog containing zero commands.
- A valid catalog whose commands do not match the query.
- A network failure with a same-session cached snapshot.
- A network failure without a snapshot.
- A responsive relay whose Pi child is unavailable.
- Authentication or authorization denial.
- An invalid or version-incompatible response.
- A command that exists but is disabled.
- A command that disappeared between selection and submission.

These states imply different recovery actions. “No matches” changes when the user edits; “empty catalog” requires a host/configuration change; offline may recover automatically; `401`/`403` requires re-authentication and must clear protected cached data; malformed data requires fail-closed version reconciliation.

Kimi Code supplies an important behavioral boundary: `/` at the beginning opens a live-filtered list, `Esc` closes it, leading whitespace prevents triggering, and unmatched input falls back to an ordinary message. Pi Remote should adopt the first three behaviors, but not automatically copy the last one: its relay intentionally treats leading-slash prompts as a restricted command channel. [Kimi Code interaction documentation](https://moonshotai.github.io/kimi-code/en/guides/interaction.html)

## 1.4 Race conditions are a first-class product state

React’s documentation explicitly warns that network responses may arrive in a different order than requests and requires effect cleanup that aborts or ignores obsolete results. `AbortController` can cancel the fetch, response-body consumption, and streams. Pi Remote needs both cancellation and a monotonically increasing client request ID: cancellation alone cannot guarantee that an already-completed obsolete response will not commit. [React effect cleanup](https://react.dev/learn/synchronizing-with-effects), [React race-condition example](https://react.dev/reference/react/useEffect), [MDN `AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

The critical races are:

1. Initial prefetch versus refresh-on-open.
2. Two rapid open/retry actions resolving out of order.
3. A session switch while the old session’s catalog is in flight.
4. Logout or permission revocation while the list remains open.
5. Pi loading or unloading skills after the menu opens.
6. Selection from revision N while submission is validated against revision N+1.
7. React Strict Mode’s development setup/cleanup/setup cycle.
8. An iPhone PWA returning from suspension with a visually open but stale overlay.

GitHub Copilot’s ACP implementation avoids ambiguity by advertising a full authoritative snapshot and sending a new snapshot whenever available commands change. A future Pi Remote push event should use the same replace-not-merge rule. [GitHub Copilot ACP command discovery](https://docs.github.com/en/copilot/reference/copilot-cli-reference/acp-server)

The current relay revision increment also needs serialization or atomic allocation: concurrent `listCommands()` calls can capture the same revision before either asynchronous host request settles. A client request ID is still required even after server serialization. [Pi Remote command service](https://github.com/MichelKerkmeester/pi-mobile-pwa-tailscale/blob/main/apps/pi-remote-relay/src/commands/command-service.ts)

## 1.5 iPhone keyboard geometry is a probable failure point

WebKit supports the Visual Viewport API specifically so completion overlays can move around the onscreen keyboard. However, WebKit has documented standalone-PWA and rotation failures in which `visualViewport.height`, offsets, or fixed positioning remain wrong after keyboard dismissal or orientation changes. The palette therefore needs physical-device tests and must not assume `100vh`, a fixed footer, or one resize event is reliable. [WebKit Visual Viewport announcement](https://webkit.org/blog/9674/new-webkit-features-in-safari-13/), [standalone PWA viewport bug](https://bugs.webkit.org/show_bug.cgi?id=218983), [iOS keyboard/fixed-position bug](https://bugs.webkit.org/show_bug.cgi?id=191204)

React Aria’s popover positioning can constrain an overlay to current viewport height, keep it out of clipping containers, close it on outside interaction or `Escape`, and provide screen-reader dismissal controls. Its Autocomplete supports a `TextArea` plus a separately positioned suggestion collection while keeping virtual focus in the input. These primitives fit the existing stack better than creating a second command input. [React Aria Autocomplete](https://react-aria.adobe.com/Autocomplete), [React Aria Popover](https://react-aria.adobe.com/Popover/usePopover.html)

## 1.6 Evidence boundary for the target apps

Kimi Code documents the required slash-trigger semantics directly. Pi’s own TUI also opens autocomplete on `/`, accepts completion with `Tab`, and defaults to five visible autocomplete rows—stronger evidence than reconstructing behavior from promotional images. [Kimi Code](https://moonshotai.github.io/kimi-code/en/guides/interaction.html), [Pi TUI autocomplete](https://github.com/badlogic/pi-mono/blob/main/packages/tui/README.md), [Pi autocomplete setting](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/settings.md)

No verifiable Mobbin screen for a Claude iOS or Kimi mobile slash-command flow was publicly accessible during this pass, so no behavior is attributed to one. Mobbin’s documented API requires an authenticated Team or Enterprise workspace. Claude iOS can remain the visual-composure target, but it is not evidence for slash-command failure semantics. [Mobbin API quick start](https://docs.mobbin.com/api/quickstart), [Claude mobile documentation](https://support.claude.com/en/collections/9387080-claude-mobile-apps)

# 2. Concrete spec contribution

## 2.1 Trigger and parsing contract

The inline surface opens only when all of these are true:

```text
composer focused
AND not in IME composition
AND draft matches ^/[^\s]*$
AND selection is collapsed inside that command token
AND the user has not dismissed suggestions for this exact draft value
```

Consequences:

- `/` opens the full list.
- `/pla` filters the list.
- ` /pla`, `hello /pla`, `/plan args`, and multiline text do not open it.
- `compositionstart` freezes trigger evaluation; `compositionend` evaluates the final value.
- Pasting `/pla` opens the list; pasting `/plan\nnotes` does not.
- Deleting the leading slash closes the list immediately.
- `Esc` closes without editing and suppresses reopening until the draft changes or focus leaves and returns.
- Selecting `/plan` replaces the current `/query` range with `/plan ` and puts the caret after the space. It must not append `/plan ` to `/query`.

This matches Kimi’s first-character and no-leading-whitespace behavior while avoiding accidental triggers inside prose. [Kimi Code interaction documentation](https://moonshotai.github.io/kimi-code/en/guides/interaction.html)

## 2.2 Exact catalog state machine

| State | Visible content | Allowed interaction | Exact status copy |
|---|---|---|---|
| `closed` | Nothing | Normal composer | — |
| `loading.initial` | Three fixed-height skeleton rows | Keep typing; `Esc` closes | “Loading available commands…” |
| `ready.current` | Up to five ranked rows | Arrow, touch, `Tab`, or `Enter` inserts | “N commands available” for assistive technology |
| `refreshing.current` | Existing rows plus a small header spinner | Existing rows remain insertion-only | “Checking for command changes…” |
| `ready.emptyCatalog` | One explanatory row | Retry | “No commands are available in this session.” |
| `ready.noMatches` | Query-specific empty row | Edit query or `Esc` | `No matches for “query”.` |
| `ready.staleOffline` | Same-session cached rows, warning header | May insert; cannot imply current availability | “Offline — showing the last verified list.” |
| `error.offlineNoCache` | Empty error row | Retry after connectivity returns | “Reconnect to load commands.” |
| `error.hostUnavailable` | Empty error row and Retry | Retry; preserve draft | “Pi is not responding.” |
| `error.forbidden` | No cached rows | Reconnect/re-authenticate | “Commands aren’t available for this device.” |
| `error.invalidPayload` | No rows from the invalid response | Reload/update app | “The phone and host versions don’t agree.” |
| `command.disabled` | Command row with reason and disabled styling | Not selectable or active | Host-provided `disabledReason`, otherwise “Unavailable now” |
| `submit.stale` | Palette reopens on refreshed list; draft preserved | Reselect or edit | “The command list changed on the host.” |

Loading, empty, offline, and error messages use `role="status"`/`aria-live="polite"` and never steal focus. WCAG requires status changes to be programmatically exposed without moving focus. [WCAG 2.2, 4.1.3](https://www.w3.org/TR/WCAG22/#status-messages)

## 2.3 Fetching, caching, and race rules

Use an in-memory snapshot:

```ts
type CommandSnapshot = {
  authEpoch: string;
  sessionId: string;
  revision: number;
  fetchedAt: number;
  commands: readonly CommandDescriptorDto[];
};
```

Rules:

1. Prefetch once after the authenticated session snapshot becomes live.
2. Every slash-menu opening revalidates unless a request for the same session is already in flight.
3. Show an existing same-session snapshot immediately while revalidating.
4. Never persist the catalog in `localStorage`, IndexedDB, or the service worker.
5. Clear it on principal change, logout, unpair, `401`, `403`, session replacement, or host epoch change.
6. Abort on unmount, session/auth change, or superseding request.
7. Commit only when `requestId` is still current and the returned `sessionId` equals the selected session.
8. Ignore a revision lower than the committed revision. Treat a session mismatch or malformed payload as `invalidPayload`.
9. Use an eight-second request timeout. Do not auto-loop after timeout; retry on explicit action, relay reconnect, or foreground return.
10. On `visibilitychange` back to visible, revalidate if the snapshot is older than 30 seconds.
11. Do not fetch on each character: filtering is entirely local.
12. Submission remains server-authoritative and is never automatically retried.

This provides the responsiveness of a cache without letting an old principal or session leak into a new one. React requires abort-or-ignore cleanup for obsolete requests. [React synchronization guidance](https://react.dev/learn/synchronizing-with-effects)

## 2.4 Filtering and ordering

Filter against the command token without its leading slash. Ranking is deterministic:

1. Exact name.
2. Name prefix.
3. Prefix after a `:`, `-`, or `_` boundary.
4. Ordered subsequence in the name, ranked by fewest gaps and earliest start.
5. Description prefix.
6. Description substring.
7. Original authoritative host order as final tie-breaker.

Examples:

```text
pl    → /plan before /deploy
cmp   → /compact
rev1  → /review:1
```

Use locale-aware, case- and diacritic-insensitive comparisons where possible; React Aria’s `useFilter` supplies normalized locale-sensitive prefix and substring operations. Never interpolate the query into a regular expression. [React Aria `useFilter`](https://react-aria.adobe.com/useFilter)

Render at most five rows at once, matching Pi’s default TUI autocomplete density. The collection remains scrollable for larger catalogs. [Pi autocomplete setting](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/settings.md)

## 2.5 Selection, keyboard, and touch

- Focus remains in the composer textarea; options use virtual focus through `aria-activedescendant`.
- `Down Arrow` activates the first enabled item, then moves down.
- `Up Arrow` moves up; navigation may wrap.
- `Enter` or `Tab` with an active enabled item inserts it, prevents form submission, closes the list, and restores the caret after the trailing space.
- The next `Enter` is a separate explicit submission.
- `Enter` with no active item retains normal composer behavior; unknown leading-slash handling remains subject to the relay policy.
- `Left`/`Right` always move the caret and clear virtual option focus.
- `Escape` closes without clearing or submitting.
- Tapping a row inserts on completed press/touch release; dragging off or receiving `pointercancel` does nothing.
- Tapping outside closes without editing or submitting.
- Disabled rows never become active and cannot insert.
- Pressing the send button is explicit submission, not palette selection.

These controls follow the ARIA combobox/list-autocomplete convention and React Aria’s virtual-focus model. [WAI-ARIA combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), [React Aria Autocomplete](https://react-aria.adobe.com/Autocomplete)

Every row has a minimum 44-by-44 CSS-pixel touch target. Apple recommends 44-point targets; WCAG 2.2 AA requires at least 24-by-24 CSS pixels or sufficient separation. [Apple UI design tips](https://developer.apple.com/design/tips/), [WCAG target-size criterion](https://www.w3.org/TR/WCAG22/#target-size-minimum)

## 2.6 Row content and argument hints

Each row contains:

```text
/name  [authoritative usage hint]          [Confirm]
Description, up to two visual lines
Disabled reason, when applicable
```

- Command name: Inter semibold/monospace-like tabular treatment, carbon ink.
- Description: Source Serif 4 or Inter regular, subdued ink.
- Current match characters: clay-tinted highlight with sufficient text contrast.
- `requiresConfirmation`: textual “Confirm” badge, never color alone.
- `source`: optional compact “Extension,” “Prompt,” or “Skill” label.
- Host descriptions are escaped as text, visually clamped, and never rendered as HTML.
- Full accessible name includes command, usage, description, confirmation requirement, and disabled reason.

Add nullable `usage: string | null` end-to-end. It must come from authoritative host registration data. Until Pi exposes such metadata, omit the usage line rather than guessing. A later RPC may expose bounded argument completions separately from command discovery. [Pi command metadata and argument completion](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/extensions.md)

## 2.7 Visual layout and motion

- Anchor the panel to the composer tray, 8 px above it.
- Width equals the composer’s inner width.
- `placement="top start"` and `shouldFlip={false}`; reduce the internal scroll region rather than flipping under the keyboard.
- Maximum panel height:

```css
min(320px, available visual viewport above composer - 16px)
```

- Preserve at least one complete row in very short landscape viewports.
- Use a 1 px carbon/clay-mix border, parchment surface, and restrained shadow; dark mode uses the fixed inverse parchment tokens.
- Loading skeletons preserve final row dimensions and are `aria-hidden`.
- Default opening motion: opacity plus 4 px upward translation over 120 ms.
- With `prefers-reduced-motion: reduce`, remove translation and use an 80 ms opacity change or no transition.
- No spring, bounce, panel-height tween, or continuously animated shimmer.

Apple recommends respecting Reduced Motion and replacing problematic movement with fades or color changes when motion conveys state. [Apple Reduced Motion criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria)

## 2.8 Accessibility requirements

Implement the feature with React Aria `Autocomplete`, the existing textarea, `Popover`, and `ListBox`, rather than a second focusable command input.

Required semantics:

- Textarea exposes `aria-autocomplete="list"`, `aria-expanded`, `aria-controls`, and `aria-activedescendant`.
- Listbox label: “Available Pi commands.”
- Each option’s accessible name starts with the literal command.
- Async states are polite live-region updates; permission or version failures may use `role="alert"` once.
- Result-count announcements are debounced so VoiceOver does not speak once per keystroke.
- At 200% text size, rows grow and the panel scrolls; no horizontal page scrolling.
- The active option and focused textarea remain at least partially visible above the keyboard and overlay.
- Status is communicated with text/iconography, not clay color alone.

WCAG 2.2 requires visible focus, focus not entirely obscured, named roles and states, and status-message exposure. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

## 2.9 Objective acceptance checks

### Functional

- Typing `/` as the first character paints either rows or placeholders within 100 ms without a network round trip.
- Typing `/` after whitespace or prose never opens the surface.
- Filtering 500 bounded descriptors completes within one animation frame at p95 on the supported iPhone baseline.
- Selecting by tap, `Enter`, or `Tab` produces exactly one draft update and zero submission calls.
- `/pla` selected as `/plan` becomes exactly `/plan ` with the caret at index 6.
- `Escape`, outside tap, `pointercancel`, deletion, and IME composition submit nothing.
- Disabled commands cannot become active or insert.
- No raw host path appears in DOM text, accessible names, errors, telemetry, or console output.

### Race and failure injection

- Request B resolving before request A leaves B committed and A ignored.
- Switching sessions before resolution cannot render the old session’s commands.
- React Strict Mode’s double effect produces one committed snapshot and no post-unmount update.
- `401`/`403` clears cached commands; `503` may retain same-session stale rows; malformed JSON never enters the list.
- Offline/online hints do not prevent a real request attempt.
- A command removed after selection is rejected by server revalidation; the draft remains intact and the refreshed list opens.
- Reconnect and foreground recovery issue at most one catalog request per session.
- No mutation or submission is automatically retried.

### iPhone/PWA

- With the software keyboard open, every visible option and the composer remain inside `visualViewport`.
- Portrait → landscape → portrait, keyboard show/hide, Home Screen suspension/resume, and Safari/PWA modes do not strand the overlay offscreen.
- Safe-area insets are correct on Home-indicator devices.
- VoiceOver announces the popup, active option, disabled reason, loading, no-results, stale, and error states without moving focus.
- Full Keyboard Access and an attached hardware keyboard complete the flow without touch.
- Light, dark, 200% text, increased contrast, and reduced-motion variants pass WCAG AA checks.

# 3. Divergent / minority ideas worth considering

## 3.1 Pin a catalog revision to the selected draft

When a user selects a command, retain `{sessionId, catalogRevision, commandName}` beside the draft. Submission sends the expected catalog revision; if it changed, the relay refuses execution, refreshes, and asks the user to reselect. This is stricter than name-only revalidation and protects against a command retaining its name while its semantics change.

## 3.2 Allow offline command preparation

Show a same-session stale snapshot offline and let the user prepare `/command arguments`, while keeping submission unavailable until reconnection and fresh revalidation. This treats offline mode as a drafting state instead of an error dead end, without relaxing execution authority.

## 3.3 Replace polling with an authoritative catalog event

Introduce a full-snapshot `commands.updated` event containing a catalog fingerprint or revision. Replace the cached list on every event; never patch individual rows. GitHub Copilot ACP already uses full `available_commands_update` snapshots when skills change. [GitHub Copilot ACP](https://docs.github.com/en/copilot/reference/copilot-cli-reference/acp-server)

## 3.4 Offer “Did you mean?” without silently correcting

For a query with no matches, show up to three fuzzy near-misses below the empty-state text. Selection still only inserts. Copilot CLI has adopted similar-command suggestions for misspelled slash commands, providing precedent without dangerous autocorrection. [Copilot CLI changelog](https://github.com/github/copilot-cli/blob/main/changelog.md)

## 3.5 Add a second-stage argument completer

After `/deploy `, keep a smaller panel open only if the host exposes bounded `getArgumentCompletions`. Do not cache sensitive values, do not infer filesystem paths, and treat a failure as “no suggestions,” leaving ordinary argument typing functional. This reaches the terminal-quality target more faithfully than a static hint, but requires new host protocol rather than a purely visual implementation. [Pi extension argument completions](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/extensions.md)

## 3.6 Use a compact tray only in pathological landscape geometry

If fewer than roughly 96 CSS pixels remain above the composer, an inline list may be unusable. A minority fallback is a keyboard-aware tray containing the same list and no duplicate text input. React Aria has documented mobile tray behavior for comboboxes, but this should be a last-resort geometry fallback because the primary requirement is terminal-style inline presentation. [React Aria mobile combobox design](https://react-aria.adobe.com/blog/building-a-combobox)

# 4. Open questions + risks

1. **Catalog scope:** Does “real host command list” mean remotely invokable `get_commands` entries, or must Pi Remote also recreate interactive-only built-ins? The latter requires purpose-built mobile controls, not forwarding command strings.

2. **Argument metadata:** What authoritative schema will populate `usage`? Current Pi RPC exposes descriptions but not usage strings or argument completion results.

3. **Unknown leading slashes:** Kimi treats unmatched slash input as ordinary prose, while Pi Remote currently fail-closes leading-slash prompts. The intended recovery must be decided explicitly; silently changing `/unknown` into a normal message would alter the security boundary.

4. **Disabled commands:** Should `enabled: false` rows remain discoverable with reasons, or disappear? Showing them improves comprehension but can reveal capabilities intentionally unavailable to the phone. The relay, not the client, must decide which disabled rows are safe to disclose.

5. **Revision semantics:** The relay must serialize or atomically allocate catalog revisions before the client can use them as freshness evidence.

6. **Dynamic registration:** Pi can register commands after startup. Without a push event, open-time and foreground-time revalidation provide bounded staleness but not instant accuracy.

7. **Description quality:** Host descriptions may be null, excessively verbose, or contain apparent syntax that is not machine-authoritative. Visual clamping and null-safe copy are required.

8. **Large catalogs:** The relay permits hundreds of entries. Local filtering should remain immediate, but screen-reader announcements and DOM size need measurement; virtualization may be necessary if real catalogs approach the cap.

9. **iOS viewport regressions:** Visual Viewport and fixed-position bugs vary by iOS release and standalone versus Safari mode. Simulator-only verification is insufficient.

10. **Mobbin evidence:** No relevant authenticated Mobbin screen was available for citation in this pass. A later pass with workspace access should capture exact Claude/Kimi loading, empty, and offline composer states rather than retrofitting assumptions from unrelated screens.

# 5. Sources

- [Pi RPC: `get_commands`](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md)
- [Pi extension and command APIs](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/extensions.md)
- [Pi TUI autocomplete](https://github.com/badlogic/pi-mono/blob/main/packages/tui/README.md)
- [Pi autocomplete settings](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/settings.md)
- [Pi Remote repository](https://github.com/MichelKerkmeester/pi-mobile-pwa-tailscale)
- [Kimi Code interaction and slash commands](https://moonshotai.github.io/kimi-code/en/guides/interaction.html)
- [GitHub Copilot ACP command discovery](https://docs.github.com/en/copilot/reference/copilot-cli-reference/acp-server)
- [GitHub Copilot CLI changelog](https://github.com/github/copilot-cli/blob/main/changelog.md)
- [Harness Remote](https://github.com/giuliastro/harness-remote)
- [MobileCLI](https://github.com/MobileCLI/mobilecli)
- [ACP UI](https://github.com/formulahendry/acp-ui)
- [React Aria Autocomplete](https://react-aria.adobe.com/Autocomplete)
- [React Aria ComboBox](https://react-aria.adobe.com/ComboBox)
- [React Aria Popover](https://react-aria.adobe.com/Popover/usePopover.html)
- [React Aria `useFilter`](https://react-aria.adobe.com/useFilter)
- [React Aria mobile combobox design](https://react-aria.adobe.com/blog/building-a-combobox)
- [React `useEffect`](https://react.dev/reference/react/useEffect)
- [React effect synchronization and cleanup](https://react.dev/learn/synchronizing-with-effects)
- [WAI-ARIA combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Apple loading guidance](https://developer.apple.com/design/human-interface-guidelines/loading)
- [Apple progress indicators](https://developer.apple.com/design/human-interface-guidelines/progress-indicators)
- [Apple UI design tips](https://developer.apple.com/design/tips/)
- [Apple Reduced Motion criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria)
- [WebKit Visual Viewport support](https://webkit.org/blog/9674/new-webkit-features-in-safari-13/)
- [WebKit standalone-PWA viewport bug](https://bugs.webkit.org/show_bug.cgi?id=218983)
- [WebKit software-keyboard positioning bug](https://bugs.webkit.org/show_bug.cgi?id=191204)
- [MDN `AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [MDN `navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)
- [Mobbin API quick start](https://docs.mobbin.com/api/quickstart)
- [Mobbin MCP](https://mobbin.com/mcp)
- [Claude mobile documentation](https://support.claude.com/en/collections/9387080-claude-mobile-apps)
