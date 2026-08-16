<!-- provenance: external-CLI orchestration pass; original file iter-04-deepseek.md -->
> **Source pass 4** — executor: DeepSeek v4 Flash (opencode-go gateway). Independent, cited pass under a rotating lens. Migrated from `iter-4-deepseek.md`.

<!-- F1-change-model | model=deepseek | lens=edge-failure | iter 4/5 | 2026-08-15T19:12:23.046Z -->

The HIG page needs JS. Let me use a rendering proxy and pull GitHub prior-art in parallel.
Good, got sheets HIG. Now fetching more HIG pages and searching for prior-art repos.
Key discovery: `pi` = earendil-works/pi, and there's `Leechael/pi-provider-kimi-code` and `EchoBird` (model-switch CLI harness). Let me pull more sources.
Good — ListBox async loading and HIG Loading confirmed. Picking up Dialog a11y, MDN Network API, HIG Searching, and prior-art repos.
Modal/Dialog a11y and MDN Network API confirmed. Now HIG Searching, the Offline Cookbook, and a Mobbin attempt.
Two more sources: Offline UX design guidelines and HIG Alerts.
Let me verify the Offline Cookbook's caching-strategy names in the truncated file before writing.
Spec-folder question: **E) Skip** — research-only pass; no file mutation, report returned inline below.

---

# Deep-Research Pass 4/5 — Edge-Failure Lens: Model Switcher Hardening for *Pi Remote*

Lens owner: edge cases, failure modes, race conditions, and graceful degradation on iPhone PWA (React 19 + Vite + Tailwind 4 + react-aria-components; ink-on-parchment, WCAG AA; fail-closed security posture).

---

## 1. Findings

### 1.1 The model catalog is *dynamic host data*, so its caching strategy is the load-bearing decision

The host ("pi") generates its model catalog from live provider catalogs (Anthropic, OpenAI, Google, Moonshot…): the pi monorepo builds "model data" by refreshing it from provider catalogs and ships `--offline-model-data` snapshots ([earendil-works/pi README](https://github.com/earendil-works/pi)). That means `Pi Remote`'s model list is exactly the kind of *frequently-updating, version-tolerant* resource that the web's canonical offline guidance puts on a **stale-while-revalidate** or **network-first** strategy — *never* "cache only" and *never* "optimistic" ([The Offline Cookbook — "Cache, falling back to network" / "Stale-while-revalidate"](https://web.dev/articles/offline-cookbook)). Because this app's security posture is host-confirmed and fail-closed, the correct degradation is: **browse/read from cache freely, but gate any mutation on a fresh host confirmation**. That is precisely the pattern Apple endorses for server-unavailable states — show cached content with a non-intrusive label rather than a blocking modal (Mail example, [Apple HIG Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts/)).

For a PWA this maps to a service-worker `fetch` handler: model-catalog GET → stale-while-revalidate; `set_model` mutation → network-only, never intercepted ([Offline Cookbook](https://web.dev/articles/offline-cookbook), "Network only … non-GET requests" is explicitly *not* to be served from cache).

### 1.2 On iPhone you cannot trust connectivity APIs — design off the fetch, not the browser

The Network Information API (`navigator.connection.effectiveType`) is **not Baseline** and is **unsupported in Safari/iOS**, so any "data-saver / switch to a cheap model on cellular" logic must not depend on it ([MDN Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)). The reliable primitives are `navigator.onLine` + the `online`/`offline` events ([MDN `Navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)). Two more iOS-specific facts harden the design:

- `navigator.onLine` cannot distinguish "your wifi is dead" from "the Tailscale tunnel is down but wifi is up." So the sheet needs **three** distinguishable failure frames, not one: *You're offline* (navigator.onLine false), *Can't reach pi* (fetch timeout/HTTP error), *Access expired/denied* (ticket rejection). The Offline UX guidelines insist the app say whether the problem is on the user's side or the app's side ("The network is down" vs "You are disconnected", [web.dev Offline UX design guidelines](https://web.dev/articles/offline-ux-design-guidelines)).
- iOS evicts/backgrounds WebViews; a `set_model` sent before backgrounding may never be confirmed. On `visibilitychange` back to foreground, the app must **re-fetch host state and reconcile** — the host is the single source of truth (this is the PWA form of the offline guidelines' "make experiences transferable," [web.dev Offline UX](https://web.dev/articles/offline-ux-design-guidelines)).

### 1.3 Race conditions to engineer for (this is the lens's meat)

1. **Stale list response beats fresh one.** User opens the sheet (fetch #1), a host update arrives, user reopens (fetch #2), fetch #1's response resolves late and overwrites. React Aria's `useAsyncList` passes an `AbortController` `signal` into `load()` precisely so you can cancel the in-flight request ([react-aria ListBox async-loading docs](https://react-spectrum.adobe.com/react-aria/ListBox.html)); `AbortController` also bounds the request (timeout the model list at ~8s). Every list fetch must carry its own signal and discard on abort or on newer-request-arrival.
2. **Out-of-order `set_model` confirmations.** The host confirms "model X" then later "model Y"; the X-confirmation must never clobber Y. Because this app already uses *revision-checked* mutations, extend the same discipline: tag each `set_model` with a monotonic client request seq + the host revision it was based on; ignore confirmations whose seq < latest intent. (Claude/Kimi-grade switchers are strictly *server-confirmed*, never optimistic — this repo's current behavior is already correct; the hardening is the seq guard.)
3. **Double-tap on two models.** Two `set_model` calls in one sheet-open; last-intent-wins, dedupe identical targets, disable the list while a mutation is in flight, and reconcile by refetch if both resolve.
4. **Switch during a running turn.** The `pi` host is a turn-based agent; whether a mid-turn switch is legal is a **host-semantics question (see §4)**. Best-in-class prior art *queues*: Claude Code's `/model` changes the model for subsequent turns rather than interrupting the in-flight turn ([anthropics/claude-code](https://github.com/anthropics/claude-code)); the pi community already reuses Moonshot "Kimi Code" plans inside pi as a provider/plan swap ([Leechael/pi-provider-kimi-code](https://github.com/Leechael/pi-provider-kimi-code)), which only matters *between* turns. The sheet therefore needs a **"pending — applies after the current turn"** state (indeterminate progress indicator per [Apple HIG Loading](https://developer.apple.com/design/human-interface-guidelines/loading/)), auto-confirming when the turn ends.

### 1.4 Error/state presentation: inline beats modal, icon+text beats color alone

- Apple is explicit: *"Avoid using an alert merely to provide information … when a server connection is unavailable, Mail displays an indicator that people can choose to learn more."* and to **avoid alerts at app start** for no-connection ([Apple HIG Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts/)). So every model-sheet failure (fetch error, offline, stale, rejected switch) is an **inline row inside the sheet** with a Retry affordance — not a modal. Reserve `role="alertdialog"` (supported by react-aria `Dialog`, [react-aria Modal/Dialog docs](https://react-spectrum.adobe.com/react-aria/Dialog.html)) for non-recoverable events like an expired access ticket.
- Don't block the user from acting elsewhere while a request is pending — the offline guidelines warn that a full-screen loading modal becomes a trap on flaky networks ([web.dev Offline UX](https://web.dev/articles/offline-ux-design-guidelines)); the "switching…" progress should be a **non-blocking pill/toast** at the top of the screen while the conversation stays usable.
- This palette has **no red**: bone `#f8f8f6`, carbon ink, clay `#d97757`. The guidelines are emphatic that state must not be conveyed by color alone ([web.dev Offline UX](https://web.dev/articles/offline-ux-design-guidelines); WCAG 1.4.1 Use of Color). Use **clay + icon + text label** for errors, and verify clay meets **3:1** for UI/non-text and **4.5:1** for text against bone (and the dark variant) — clay on bone sits near the contrast threshold, so small text should stay carbon ink ([WCAG 2.x Quickref](https://www.w3.org/WAI/WCAG21/quickref/)).

### 1.5 Loading/empty/stale states have specific, citable shapes

- **Loading:** "Show something as soon as possible… placeholder text, graphics, or animations" ([Apple HIG Loading](https://developer.apple.com/design/human-interface-guidelines/loading/)); skeleton list + `renderEmptyState` spinner in the ListBox is the react-aria-native way ([ListBox docs](https://react-spectrum.adobe.com/react-aria/ListBox.html)). Never a blank sheet.
- **Empty (host has zero models):** distinct from "error" — pi's catalog can legitimately be empty when no provider is configured on the host. Surface a *configure-on-host* state, not an empty spinner.
- **Stale:** show the cached list immediately with a "last updated Xm ago — refreshing" inline chip (stale-while-revalidate; "inform users of state and changes of state," [web.dev Offline UX](https://web.dev/articles/offline-ux-design-guidelines)).
- **Menu semantics:** HIG says dim unavailable items but *keep the menu openable* so users can learn what's there ([Apple HIG Menus](https://developer.apple.com/design/human-interface-guidelines/menus/)) — the trigger header must stay enabled even when the list fails to load, opening into the inline error state instead.

### 1.6 Prior art the build should steal from

- **Enchanted** (~6k★) — the only *native-iOS* self-hosted-LLM chat client of note; the model picker and its "host unreachable → degrade to last-known chat" behavior is the closest mobile precedent ([gluonfield/enchanted](https://github.com/gluonfield/enchanted)).
- **Open WebUI** (~149k★) — model switcher with server-confirmed selection, grouped/paginated model list, and graceful empty/error handling ([open-webui/open-webui](https://github.com/open-webui/open-webui)).
- **Continue** (~35k★) — provider-grouped model dropdown in the IDE; note it lists *providers* as first-class sections ([continuedev/continue](https://github.com/continuedev/continue)).
- **aider** (~48k★) — `/model` lists models *with descriptions* and enforces a refusal/fallback model, i.e. a capability-tripping notion ([Aider-AI/aider](https://github.com/Aider-AI/aider)).
- **Claude Code** (~142k★) and **OpenAI Codex** (~106k★) — model switching with a "this session uses X" confirmation; Codex additionally *gates models by plan tier*, a per-model availability state a host-confirmed switcher must reflect ([anthropics/claude-code](https://github.com/anthropics/claude-code), [openai/codex](https://github.com/openai/codex)).
- **pi ecosystem** (the actual host): `@earendil-works/pi-ai` is a "unified multi-provider LLM API (OpenAI, Anthropic, Google, …)" and the monorepo *generates* per-provider model data at build time ([earendil-works/pi](https://github.com/earendil-works/pi)) — this is the source the capability hints (§2) should read from. **EchoBird** (~3k★, Tauri desktop) is the closest "model-switch across Claude Code/Codex/Kimi" harness and is literally built on a *unified model data hub — configure once, used everywhere* ([edison7009/EchoBird](https://github.com/edison7009/EchoBird)); its README even uses `#D97757` as accent.
- **Kimi Code** itself has no first-party OSS repo; the practical references are the pi-side provider bridge above and the terminal harness [Doriandarko/kimi-2-6-code](https://github.com/Doriandarko/kimi-2-6-code).

### 1.7 iOS gesture/affordance substrate (sheet, not popover)

The feature already opens "a sheet," which matches HIG: iPhone sheets get a **grabber**, **swipe-down to dismiss**, medium/large **detents**, and VoiceOver-resizable behavior ([Apple HIG Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets/)). react-aria supports building this as a `Modal` with custom entry/exit animations + `isDismissable`/`isKeyboardDismissDisabled`/`shouldCloseOnInteractOutside` ([react-aria Modal/Dialog](https://react-spectrum.adobe.com/react-aria/Dialog.html)) and a ComboBox that can sit inside it, with `allowsEmptyCollection` to keep the menu open on zero results, `menuTrigger`, `onOpenChange`, and language-sensitive `defaultFilter` for search ([ComboBox docs](https://react-spectrum.adobe.com/react-aria/ComboBox.html)). One HIG trap: **only one sheet at a time**, and never stack sheets on sheet ([Apple HIG Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets/)) — the error/reconnect affordance must live *inside* the switcher sheet, not spawn a second one.

---

## 2. Concrete spec contribution for a build phase

**Component:** `ModelSwitcherSheet` (Modal-based sheet, `role="dialog"`, grabber + swipe-down dismiss + medium/large detents).

### 2.1 State machine (single reducer; every field host-confirmed, never optimistic)

```
sheet:   closed → opening → open
list:    initial → loading → ready | empty | stale | error(offline|unreachable|denied)
search:  idle | typing | no-results          (ComboBox filter, allowsEmptyCollection)
mutation: idle → requesting(modelId) → confirmed | rejected | pending-turn(modelId)
```

**List fetch:** `useAsyncList({ load({signal}) })` → GET `/models` with 8s timeout via `AbortController`; on timeout mark `unreachable`; on `navigator.onLine === false` mark `offline` *without* waiting; on HTTP 401/403 mark `denied` (ticket expired — fail-closed). Service worker serves the catalog stale-while-revalidate ([Offline Cookbook](https://web.dev/articles/offline-cookbook)); UI shows cached items immediately with an inline **"last updated Xm ago · refreshing"** chip when serving stale.

**`set_model`:** network-only through the SW (never cached). Each call carries `{ model, clientSeq, hostRevision }`. Response states:
- `confirmed { model, hostRevision }` — apply only if `clientSeq` is the latest intent; stamp the header + ephemeral "Switched to X" status.
- `rejected { reason }` — inline error row, revert header to last-confirmed model (it never changed optimistically).
- `pending-turn` (host reports busy) — item shows indeterminate progress + description **"Will apply after the current turn."** Re-poll or push-update on turn end; then confirm.
- **No response before backgrounding:** on `visibilitychange`→visible, refetch `/models` + current-model and reconcile.

### 2.2 Exact UI states

| State | Visual (bone/ink/clay) | Copy (sentence-style) | Accessibility |
|---|---|---|---|
| Loading | 4 skeleton rows + centered 24px indeterminate ring | — | `aria-busy="true"` on listbox |
| Ready | Sections per provider (sticky headers), checkmark on current, `aria-current` | — | `ListBoxSection`+`Header` |
| Empty | Clay outline icon + text | "No models configured. Configure a provider on the host to get started." | plain text row, no spinner |
| Stale | List visible + top-right chip | "Last updated 2m ago · refreshing" | `aria-live="polite"` |
| Offline | Chip + disabled items | "You're offline. Showing last-known models; switching is disabled until you reconnect." | items `isDisabled` (kept visible/learnable per HIG Menus), live region |
| Unreachable | Inline row + Retry | "Can't reach pi. Check the Tailscale connection." | Retry is a real `Button`, 44px |
| Denied | `role="alertdialog"` (only modal in the app for this flow) | "Access expired. Reconnect to the tailnet." | `aria-labelledby` title, focus trap |
| Requesting | Selected row shows ring; header shows "Switching…" | — | `aria-live="assertive"` "Switching to X" |
| Rejected | Inline error row + auto-header-revert | "pi rejected the switch to X. {reason}" | live region |
| Search no-results | Kept-open listbox, empty message | "No models match "X"." | `allowsEmptyCollection` |

### 2.3 Gestures & motion (respect `prefers-reduced-motion` — MDN `@media prefers-reduced-motion`)

- **Open:** sheet slides up 300ms spring (`cubic-bezier(0.32, 0.72, 0, 1)`); backdrop fades 200ms; list rows stagger in 40ms. **Reduced motion:** 200ms crossfade only.
- **Grabber:** 32×5px rounded bar, top-center; drag toggles medium↔large detent; also VoiceOver-accessible (cycle detents), per HIG Sheets.
- **Dismiss:** swipe-down with 40% threshold; Escape (hardware keyboard) via `isKeyboardDismissDisabled={false}`; overlay tap via `isDismissable`. Dismiss is always allowed during `requesting` — the pill continues above the conversation.
- **Search field:** `autoCorrect="off" autoCapitalize="none" spellCheck={false}` (model IDs are technical tokens); `enterKeyHint="search"`; input `type="search"` role searchbox with label "Filter models".
- **Item layout:** 44px+ touch target; label (model id, `textValue` set for typeahead) + `description` slot line: "provider · ctx · tools" only when host catalog supplies it (pi's generated model data); current model gets clay checkmark + `aria-current="true"` ([ListBox docs](https://react-spectrum.adobe.com/react-aria/ListBox.html)).
- **Confirm stamp:** selected row flashes clay → check; switch pill appears top-of-screen, self-dismisses after 2.5s.

### 2.4 Contrast / AA gate

Ink on bone = well over 4.5:1. Verify with a contrast tool (e.g. webaim) that **clay `#d97757` ≥ 3:1** on bone for checkmark/chip/ring and on the dark-surface variant; keep all *small text* in carbon ink, never clay. Disabled items: `text-ink/40` + removed check — and since disabled *looks* gray, pair it with the text labels above so state never relies on color alone (WCAG 1.4.1; Offline UX "don't use color alone").

### 2.5 Behavior checklist (acceptance for this lens)

1. Open sheet while list fetch in flight → loading skeletons; reopen during fetch → previous AbortController aborted, no stale overwrite.
2. Fetch times out at 8s → `unreachable` inline + Retry; Retry resets 8s clock.
3. Airplane-mode open → `offline` state shown from `navigator.onLine` without waiting for timeout.
4. Offline + cached list → list browsable/searchable, selection disabled (fail-closed).
5. Double-tap two models → single mutation in flight; last intent wins; list disabled while `requesting`.
6. Late confirmation (out-of-order) → ignored by `clientSeq`; header matches host refetch.
7. Switch during turn → `pending-turn` pill; confirms after turn end.
8. Background + return → reconcile via refetch; header never lies.
9. Ticket revoked mid-session → `denied` dialog; no other mutation pathways left enabled.
10. Zero providers on host → empty state (not error).
11. VoiceOver end-to-end: trigger → sheet (dialog) → searchbox → list → "Switching to X" announcement → focus restored to header trigger on dismiss.

---

## 3. Divergent / minority ideas worth resisting convergence on

1. **Make the header a *non-modal* switcher** for the two most-recent models (tap toggles last-used; long-press opens the sheet). HIG explicitly blesses non-modal sheets that affect the parent without dismissal ([Apple HIG Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets/) — Notes format example). Minority because it must still be host-confirmed before actually mutating, and "last-used" pairs are a client-only fiction unless the host reports history.
2. **Pinned/favorite models section** at the top of the sheet (persisted locally, revalidated against the host). Diverges from fail-closed purity if a pinned model vanishes from the host — must render as disabled-with-reason, not selectable.
3. **Cost/speed-aware auto-suggestion**: when a turn has run long or the host reports throttling, surface a clay "Consider a faster model" suggestion row. Can't use iOS connectivity info (§1.2), so it keys off host-reported latency — honest and unusual.
4. **Experimental mid-turn hot-swap**: ask pi to apply the model change at the *next tool call* rather than next turn. Only valid if the host supports it (see §4); if unsupported, it must fail-closed with the `pending-turn` state.
5. **Double-confirm only for expensive models** (e.g. very long context): one extra tap for the big-context model, zero friction for normal switches — respects HIG's "don't alert on common undoable actions" ([Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts/)) while guarding token cost.
6. **Per-session (per-conversation) model memory** instead of a global model — the sheet sets the model for the current session; a badge on the header shows session-scope. Depends on whether pi's model state is session-scoped or global (open question).
7. **Full offline shell**: if no cache *and* offline, render a dedicated "last known model + reconnect" card inside the sheet instead of the normal list — turns the worst case into a feature rather than a dead sheet.

---

## 4. Open questions + risks

1. **Mid-turn semantics of `pi`:** does `set_model` apply now, at next tool call, or next turn? This single answer determines `pending-turn` vs. instant-confirm and is the biggest correctness risk. Check `packages/coding-agent` + `packages/ai` in [earendil-works/pi](https://github.com/earendil-works/pi) (or pi.dev docs).
2. **Mutation contract:** does `set_model` return the applied model + host revision? The revision-checked machinery needs a revision to compare against; if absent, use `clientSeq` only and reconcile by refetch (weaker).
3. **Catalog shape & capability metadata:** does `/models` expose provider, context-window, tool support, and *tier/plan availability* per model (Codex-tier gating exists in the wild, [openai/codex](https://github.com/openai/codex))? If not, capability hints are cut or fabricated — do not invent them.
4. **Push vs. poll:** can the host push model-state updates (streaming/websocket), or must the client poll/refetch on foreground? Multi-device drift (another client switches while this sheet is open) is unresolvable without push or polling.
5. **`navigator.onLine` is a lie for tailnets:** an online phone with a dead tunnel reports `onLine === true` and the fetch times out; conversely the API can't say *why* a tailnet host is unreachable. The `unreachable`/`offline` split is heuristic — accept residual ambiguity and say "Check the Tailscale connection."
6. **iOS backgrounding/SW eviction:** a confirmed-but-lost response is the worst silent failure; reconciliation-on-foreground is mandatory, and `navigator.storage.persist()` should be requested so the cached catalog survives storage pressure ([Offline Cookbook — cache persistence](https://web.dev/articles/offline-cookbook)).
7. **Contrast on the dark variant:** clay `#d97757` against the dark parchment surface must be re-verified (≥3:1 non-text); small text stays ink/paper.
8. **Sheet-within-sheet:** the "reconnect/denied" flow must never stack a second modal on the switcher sheet ([Apple HIG Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets/)); use the in-sheet `alertdialog` role instead.
9. **Mobbin verification pending:** I could not fetch Mobbin screens (login-gated/JS; `mobbin.com/apps/claude-ai` returns 404). Treat the two Mobbin references in §5 as unverified pointers, not confirmed flows.

---

## 5. Sources

**Verified by direct fetch this pass (primary grounding):**
- [Apple HIG — Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets/) (grabber, detents, swipe-dismiss, one-sheet rule)
- [Apple HIG — Menus](https://developer.apple.com/design/human-interface-guidelines/menus/) (dimmed-but-openable items, checkmarks, grouping, separators)
- [Apple HIG — Loading](https://developer.apple.com/design/human-interface-guidelines/loading/) (show content ASAP, placeholders, progress indicators)
- [Apple HIG — Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts/) (inline-over-alert for connectivity; no startup alerts; alertdialog copy rules)
- [Apple HIG — Searching](https://developer.apple.com/design/human-interface-guidelines/searching/) (search-field conventions, clear scope, privacy of recent-search)
- [react-aria — ListBox](https://react-spectrum.adobe.com/react-aria/ListBox.html) (async loading via `useAsyncList`+`signal`, `renderEmptyState`, sections+sticky Header, label/description slots, `isDisabled`, `textValue`)
- [react-aria — ComboBox](https://react-spectrum.adobe.com/react-aria/ComboBox.html) (`allowsEmptyCollection`, `menuTrigger`, `defaultFilter`, `onOpenChange`, `isDisabled`)
- [react-aria — Modal/Dialog](https://react-spectrum.adobe.com/react-aria/Dialog.html) (sheet pattern, focus trap, `isDismissable`, `isKeyboardDismissDisabled`, `role="alertdialog"`, entering/exiting animations)
- [MDN — Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API) (not Baseline; absent from Safari/iOS)
- [MDN — `Navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) (reliable on/offline primitive)
- [web.dev — The Offline Cookbook (Jake Archibald)](https://web.dev/articles/offline-cookbook) (cache-only / network-only / cache-falling-back-to-network / stale-while-revalidate; cache persistence via `navigator.storage.persist()`)
- [web.dev — Offline UX design guidelines (Kurtuldu & Steiner)](https://web.dev/articles/offline-ux-design-guidelines) (inform of state, don't block content, no-color-alone, plain language, skeleton layouts)
- [earendil-works/pi — README](https://github.com/earendil-works/pi) (pi = the host; `@earendil-works/pi-ai` unified multi-provider API; generated provider model data; 90,857★)

**Prior-art GitHub repos (verified to exist via GitHub API, stars as of this pass):**
- [gluonfield/enchanted](https://github.com/gluonfield/enchanted) (~6k★; iOS/macOS SwiftUI self-hosted-LLM client)
- [open-webui/open-webui](https://github.com/open-webui/open-webui) (~149k★)
- [continuedev/continue](https://github.com/continuedev/continue) (~35k★)
- [Aider-AI/aider](https://github.com/Aider-AI/aider) (~48k★)
- [anthropics/claude-code](https://github.com/anthropics/claude-code) (~142k★)
- [openai/codex](https://github.com/openai/codex) (~106k★)
- [ollama/ollama](https://github.com/ollama/ollama) (~179k★)
- [edison7009/EchoBird](https://github.com/edison7009/EchoBird) (~3k★; unified model data hub switching Claude Code/Codex/Kimi; clay `#D97757`)
- [Leechael/pi-provider-kimi-code](https://github.com/Leechael/pi-provider-kimi-code) (~78★; Kimi Code plan reuse inside pi — the mid-turn/provider-switch precedent)
- [Doriandarko/kimi-2-6-code](https://github.com/Doriandarko/kimi-2-6-code) (~81★; Kimi K2.6 terminal harness)

**Referenced standards (not fetched):**
- [WCAG 2.x Quickref](https://www.w3.org/WAI/WCAG21/quickref/) (1.4.1 Use of Color, 4.1.3 Status Messages, 2.5.8 min target size)
- [MDN — `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [Mobbin — Claude flow references](https://mobbin.com) (login-gated; the Claude model-switch and Kimi model-switch flows are the visual targets for this lens — **unverified this pass**, needs a logged-in capture before build-time cribbing)
