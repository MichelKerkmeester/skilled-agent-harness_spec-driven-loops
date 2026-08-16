<!-- provenance: external-CLI orchestration pass; original file iter-04-deepseek.md -->
> **Source pass 4** — executor: DeepSeek v4 Flash (opencode-go gateway). Independent, cited pass under a rotating lens. Migrated from `iter-4-deepseek.md`.

<!-- F2-change-effort | model=deepseek | lens=edge-failure | iter 4/5 | 2026-08-15T19:38:53.723Z -->

I have a complete picture of the current effort-control implementation and failure surfaces. Now let me do the web research to ground the lens findings.
Claude Code docs confirm `/effort`, org effort caps, and remote-control failure semantics. Let me get effort-level semantics and Kimi Code prior art.
Claude effort semantics confirmed. Now let me get Kimi Code's thinking/effort behavior, verify the pi agent repo, and find prior-art mobile companions.
Harness Remote is a goldmine for prior art. Let me confirm pi's exported thinking levels in the fixture, and grab Apple HIG content plus Kimi thinking docs.
# Edge-Failure Research Pass — Effort/Reasoning-Level Switcher (Pi Remote)

Lens: edge cases, failure modes, races, graceful degradation. Grounded against the actual wired implementation (protocol, relay, PWA), Claude Code's shipped effort surface, and prior-art mobile coding-agent companions.

---

## 1. Findings for this lens

### 1.1 The control line, end to end, and where it can fail

The current effort control is a RAC `Select` fed by one reducer state (`apps/pi-remote-web/src/runtime.ts`). Mutations are non-optimistic: `control-start` sets a `pending` intent, and only `accepted`/`stale` outcomes replace the displayed value ([runtime.ts:66-74](apps/pi-remote-web/src/runtime.ts)). Write flow is two round-trips: one-use `/api/auth/ticket`, then `/api/runtime/control` carrying `controlId` (idempotency), `expectedRevision`, `operation`, `ticket` ([relay.ts:119-142](apps/pi-remote-web/src/relay.ts)). The relay fails closed on: not-live, revision mismatch (`stale`), unknown level (`unsupported`), delivery in doubt (`delivery-unknown`, terminal) ([runtime-service.ts:111-145](apps/pi-remote-relay/src/runtime/runtime-service.ts)).

The reading is correct and security-correct. The **failure surface** is:

| Condition | Where it surfaces today | Gap observed |
|---|---|---|
| Hydrate fails | `status:'error'`, hint `Unavailable — reconcile` ([RuntimeStrip.tsx:131](apps/pi-remote-web/src/RuntimeStrip.tsx)) | The `error` string is never rendered; **no Reconcile/Retry action exists in the UI**. `refresh()` is only auto-called on mount ([runtime.ts:183-185](apps/pi-remote-web/src/runtime.ts)); nothing calls it on stale/error, so the phone can be locked out of effort switching until a full remount. |
| Revision race (`stale`) | copy `Refreshed — host changed` ([runtime.ts:98-103](apps/pi-remote-web/src/runtime.ts)) but then `disabled = status !== 'ready'` ([RuntimeStrip.tsx:36](apps/pi-remote-web/src/RuntimeStrip.tsx)) | Misleading copy (nothing was "refreshed") **plus no auto-rehydration**. Host changed the level/model on desktop → the phone keeps showing `ready` with a stale level until a tap, then shows an un-recoverable `stale`. The `stale` outcome replaces `state` but **not the `models` catalog** — if the host also switched model, the Model select then holds an out-of-catalog key. |
| Not the foreground device (403) | `postJson` throws `Relay returned HTTP 403.` (403 not in accepted list [relay.ts:137](apps/pi-remote-web/src/relay.ts)) | `isForegroundDevice` = device with an **open sync WebSocket** ([server.ts:259-261](apps/pi-remote-relay/src/http/server.ts)). iOS kills background WS quickly; a blip closes it transiently and the *next* effort change fails with an opaque message. This will be the single most common real-world failure for a phone remote, and it currently reads as a generic `.unavailable`. |
| Rate-limited (429) | raw `Relay returned HTTP 429.` (429 not in accepted list, limiter 30/60s per device [server.ts:123](apps/pi-remote-relay/src/http/server.ts)) | Rapid switching (which the reading actually *prevents* at steady state) and retry storms surface as a decode-gray "Relay returned HTTP…" string via the generic `.unavailable` catch. |
| Host rejects `set_thinking_level` mid-stream | `HostRejectedError` → `.unavailable` with the host's message ([runtime-service.ts:137-139](apps/pi-remote-relay/src/runtime/runtime-service.ts)) | **pi's mid-turn behavior is undefined in this app.** The UI offers no "applies to the next message" affordance or copy, so a mid-stream tap can end in an unexplained rejection or, worse, silently queue. |
| Delivery-unknown | `deliveryUnknown:true`, same generic hint ([runtime.ts:113-121](apps/pi-remote-web/src/runtime.ts)) | Correctly terminal and never auto-retried — but `rollback/runbook` recovery is invisible in UI ("Unavailable — reconcile" again). |
| Offline | fetch `TypeError` → `.unavailable` | No `navigator.onLine`, no banner, no "cached, read-only" framing. The yielded message is a raw fetch error string. |
| Empty catalog | `disabled || availableThinkingLevels.length===0` → silently dead control ([RuntimeStrip.tsx:74](apps/pi-remote-web/src/RuntimeStrip.tsx), [SessionHeader.tsx:105](apps/pi-remote-web/src/SessionHeader.tsx)) | No reason text. If the active model reports no thinking levels, the control is disabled with no explanation. |
| **Pending forever** | `pending` sets `status:'pending'` and disables everything | `controlRuntime` is called with **no AbortSignal/timeout** (signal is optional and unused in [runtime.ts:158](apps/pi-remote-web/src/runtime.ts)). A wedged tailnet request parks the strip on `Applying…` indefinitely. |
| Same-tick double tap | Second tap while request in flight | `apply` reads `runtime.status`/`runtime.state` **from its render closure** ([runtime.ts:149-168](apps/pi-remote-web/src/runtime.ts)); two taps within one render both pass the guard and fire two controls with the *same* `expectedRevision`. The relay's `expectedRevision` check catches the later one (`stale`) — fail-closed is the real backstop, but the client should also gate on an in-flight ref. |

### 1.2 The `ready` status is "last known good", not "live truth"

The phone only rehydrates on mount ([runtime.ts:183-185](apps/pi-remote-web/src/runtime.ts)). Pi restart, supervisor backoff, or a desktop-side `/effort` change is **never pushed to the phone** — the sync/WS stream carries transcript and plan-mode extension events only ([plan-status.ts:1-32](apps/pi-remote-relay/src/runtime/plan-status.ts)). So the effort control can show `High` with `status:'ready'` while the host is actually at default after a restart. The relay *knows* this on the next `control()` (`runtime authority is unknown`, [runtime-service.ts:116-119](apps/pi-remote-relay/src/runtime/runtime-service.ts)) — the phone just doesn't until it taps. Claude Code's remote-control precedent explicitly handles "session taken over, ended, or server can't find it" by naming the cause and withholding recovery advice ([Remote Control troubleshooting](https://code.claude.com/docs/en/remote-control)) — this is the exact shaping we should copy: a *cause-naming* degraded state, not a generic one.

### 1.3 What shipped reference surfaces tell us about *mid-turn* and *availability*

- **Effort is a per-request input, so it semantically applies to the next turn.** "[The effort level] is sent to the model as part of the request, right alongside your prompt" — it therefore shapes the next generation, and the only in-flight hard boundary is `max_tokens` truncation ([Anthropic effort blog](https://claude.com/blog/claude-model-and-effort-level-in-claude-code)). Claude Code exposes `/effort` from mobile/web as an **argument**, not a picker; caps are **per model**, and levels above the cap "aren't offered in the /effort picker" ([Claude Code model-config](https://code.claude.com/docs/en/model-config)). This confirms two Ui facts for us: (a) the legible labels should say *what the next turn will do*, and (b) **switching model can legitimately change the level list** — the `stale`/catalog-refresh path is a real, first-party-endorsed state, not a corner case.
- **Best-practice companions hide what the backend can't do rather than failing on tap.** Harness Remote — which supervises PI, Claude Code, Codex, OpenCode — "hides what a backend cannot do rather than offering a control that fails"; its Claude adapter "advertises a permission mode and an effort level, which the app does not use yet", and its Codex backend reports reasoning-effort "advertised but unused" ([Harness Remote README](https://github.com/giuliastro/harness-remote)). For locked sessions (writer held by the desktop app) it **marks the session "Started by another client" and disables the model picker**, because the back-end only reports models as part of the load it is refusing — the exact analogue of our 403 `foreground_required` problem ([Harness Remote README, Codex section](https://github.com/giuliastro/harness-remote)).
- **Queuing mid-turn is an established pattern.** Harness Remote/OMP queues a prompt sent while working and runs it when the turn ends ([Harness Remote README, OMP section](https://github.com/giuliastro/harness-remote)). That is a graceful-degradation alternative to "reject" for our mid-stream effort tap.
- **Claude Code's own outage semantics**: server-mode remote-control gives up after ~10 min offline; interactive mode retries and reconnects on its own; presence-heartbeat failures surface with an explicit message and manual `/remote-control` recovery ([Remote Control docs](https://code.claude.com/docs/en/remote-control)). Expose cause + explicit recovery action on the phone too (here: "Reconcile" / "Reconnect").

---

## 2. Concrete spec a build phase can execute

### 2.1 Exact states (replace today's 5 with a cause-named 9)

| State | Triggers | Control behavior | Live region copy (English, then localized) |
|---|---|---|---|
| `checking` | mount / Reconcile | disabled; show last-known value if present, else `—` | "Checking effort…" |
| `ready` | hydrated / accepted | enabled | — |
| `pending` | control in flight | trigger disabled, spinner on **that** level; other sections stay interactive (effort only — see 2.4) | "Applying High — next message" / "Applying − tasks may drop to Max if you tap again" *(see 3)* |
| `stale` | revision mismatch | disabled + auto-rehydrate once; button **Reconcile** | "Pi changed this on the host — updated. Check yours now." (then auto-`refresh()` once; on refetch success go `ready` — never leave `stale` as a resting state) |
| `unsupported` | level no longer in catalog | disabled; reason inline under label | "Effort removed for this model — choose another level or model." |
| `unavailable-host` | host rejected (mid-stream) / authority unknown | disabled until `ready` regained | "Pi didn't accept that now. It applies between messages — try when idle." |
| `foreground-held` | 403 `foreground_required` | disabled + **Continuation button "Reconnect — take the controls"**; on retry, re-establish the sync socket first, then resubmit the same `controlId` | "Another device or the host is driving Pi. Reconnect to switch effort." *(verbatim framing borrowed from Claude's take-over recovery, [docs](https://code.claude.com/docs/en/remote-control))* |
| `rate-limited` | 429 | disabled, countdown to the window | "Too many changes — try again in a few seconds." |
| `offline` | `!navigator.onLine` at tap time, or first network error | disabled; **cached badge** (matches the platform-support stance that offline views "are visibly stale": [platform-support.md](docs/platform-support.md)) | "Offline — the last host state is shown; changes need a connection." |
| `delivery-unknown` | terminal | disabled; **Reconcile** + never auto-retry (unchanged contract) | "Pi may have applied this before the disconnect — Reconcile to confirm, don't resend." |

Merge `error`/`unavailable`/`delivery-unknown` today into the cause-named set above. Key rule from NN/g: display the message **adjacent to the source control** with a recovery affordance ("close to the error's source", "offer constructive advice", "preserve the user's input") — not as a lone footer status ([NN/g error-message guidelines](https://www.nngroup.com/articles/error-message-guidelines/)).

### 2.2 Protocol-side hardening (small, build-ready)

1. **Client timeout**: `controlRuntime(…)` takes `AbortSignal.timeout(10_000)` (aligns with relay `requestTimeoutMs = 15_000`, [supervisor.ts:15](apps/pi-remote-relay/src/rpc/supervisor.ts)). On abort → `delivery-unknown` (we may have delivered), **never** silently retry — preserves the fail-closed terminal contract; the user gets the Reconcile path instead of an infinite `Applying…`.
2. **In-flight ref guard**: gate `apply()` on a `useRef` in-flight flag in addition to render-`status`, closing the same-tick double-fire window; keep `expectedRevision` as the backstop ([runtime-service.ts:121](apps/pi-remote-relay/src/runtime/runtime-service.ts)).
3. **`stale` auto-rehydration**: after applying a `stale` response, fire `refresh()` once (models + levels + state). This also repairs the Model-select out-of-catalog key forced by a host-side model change.
4. **Map 403/429 in the client**: accept `[202,403,409,422,429,503]` and key the outcome to `stale`-like cause states in `settle()`; never let raw HTTP text reach copy (NN/g: human-readable language; the other helpers already do this for approvals, [relay.ts:303-315](apps/pi-remote-web/src/relay.ts)).
5. **Freshness stamp**: piggyback a cheap `runtime` stamp onto the existing plan-status extension channel ([plan-status.ts](apps/pi-remote-relay/src/runtime/plan-status.ts)) so a Pi restart flips the phone's effort control to `unavailable-host` *before* the user taps — matching Claude's proactive disconnect detection.

### 2.3 Gestures & interaction

- Effort stays in the model/effort sheet ([SessionHeader.tsx](apps/pi-remote-web/src/SessionHeader.tsx)), one tap from the header.
- `Off / High / Max` (pi's current catalog, [demo.ts:169](apps/pi-remote-web/src/demo.ts)) render as **three mutually exclusive rows**; the reading already treats the sheet's Select as a radio-style one-of-many. With ≤4 levels, prefer the existing `ToggleButtonGroup` ("radio" role) that Build/Plan already uses ([RuntimeStrip.tsx:92-109](apps/pi-remote-web/src/RuntimeStrip.tsx)) — a segmented row reads better on iPhone than a hidden dropdown; with >4 levels, fall back to the ListBox.
- Mid-turn tap: **queue-and-label** — selection is accepted locally as "next message" behavior (per Harness Remote's pending-follow-up precedent, [repo](https://github.com/giuliastro/harness-remote)); if the host rejects (`HostRejectedError`), fall back to `unavailable-host` copy *naming the cause*. Reject-with-copy only if the prober in 2.6 proves pi refuses mid-stream.
- Row tap keeps the sheet open on Hold-to-prevent? No — use **RAC `shouldCloseOnSelect={false}`** so restart-of-turn adjustments stay one-handed.

### 2.4 Disabled/unavailable handling (a11y-first)

- Every level row carries a `Description` slot: although "Off" strikes in WCAG AA with `--stone`/carbon ok in both themes, the fix is behavioral: disabled **rows** (via RAC `disabledKeys`, not whole-select) keep their label and add the reason line next to the trigger — never a bare dead control ([RAC Select: `isDisabled` vs `disabledKeys`](https://react-spectrum.adobe.com/react-aria/Select.html)).
- `aria-live="polite"` `role="status"` already exists ([SessionHeader.tsx:124](apps/pi-remote-web/src/SessionHeader.tsx)); render the **state**, not just the hint — and switch terminal states to `assertive` so VoiceOver readers stop navigating through an unexplained lockout.
- Focus: after settlement return focus to the effort trigger; RAC already restores it on popover close — don't let the queue label steal it.
- 44 pt targets (Apple HIG minimum; WCAG 2.2 SC 2.5.8 gives the 24 px floor, iOS tactile norm is 44 pt — keep the existing toolbar sizing, touch nothing).
- Non-text contrast for applied/pending markers: clay `#d97757` vs parchment `#f8f8f6` is ~3.6:1 — **fails WCAG 1.4.11 (3:1 non-text)** for the pending dot if used as the only cue; pair the dot with a text label ("High – next message") or use carbon-ink fill for the pending state, clay only for the transient pulse above 3:1.

### 2.5 Visual / motion

- Pending: recycle the existing `streaming-glyph` keyframe language ([style.css:2004-2042](apps/pi-remote-web/src/style.css)) — the selected level's row shows the three-bars pulse while `pending`; stop on settle. This keeps the ink-parchment motion vocabulary coherent between the transcript and the switch.
- State transitions: 150–200 ms fade/ease (`cubic-bezier` in the tokens) on the reason row appearing/disappearing; **disabled reasons fade, they don't slide**.
- `prefers-reduced-motion`: collapse the pulse to a static "…" and skip the fade (matches the app's existing motion discipline).
- Offline mode: the cached effort value is rendered at reduced emphasis (the existing stale-stone treatment), plus a small inline "Offline" tag on the effort row — exactly the "stale-visited" framing already documented for transcripts ([platform-support.md](docs/platform-support.md)).

### 2.6 Required probes before build

- Integration test against the live Pi child (tests currently run the fixture only, [runtime-control.test.ts](apps/pi-remote-relay/tests/runtime-control.test.ts)): `set_thinking_level` **while streaming** — accepted-next-turn or rejected? This single datum decides the queue-vs-reject copy.
- Device test on a real iPhone: background the app, drop the WS, retry an effort change → confirm 403 path actually maps to `foreground-held` (iOS Web Push/WS lifetime caveat is documented [platform-support.md:43](docs/platform-support.md)).

---

## 3. Divergent / minority ideas worth considering

1. **Effort belongs on the composer, not the model sheet** (contrary to the fixed design). Kimi and (crucially) Claude Code's mobile client treat `/effort` as an *argument next to typing*, and the effort blog frames it as "a general preference, not task-by-task" ([blog](https://claude.com/blog/claude-model-and-effort-level-in-claude-code)). A persistent composer pill (Kimi-style, [Kimi App Store listing](https://apps.apple.com/ca/app/kimi-kimi-k3-is-live/id6474233312)) surfaces that "what comes next is different" much closer to the point of action than a header sheet. Worth staging as an A/B.
2. **Two-scope effort**: "Next message / Until I change it" — effort "until changed is a preference; effort for one turn is a workaround". Claude Code effectively has both (session default vs `/fast` override). A two-option affordance is heavier but kills the mid-turn ambiguity at the source.
3. **Show projected cost per level.** The effort blog reports ~7× tokens at high effort on the same prompt ([blog](https://claude.com/blog/claude-model-and-effort-level-in-claude-code)). A quiet "Max ≈ more files read + tests run" caption under Max would teach the mental model instead of forcing a docs hunt — legibility without new UI.
4. **Allow Reconcile to resubmit the same `controlId`.** Because the relay dedupes by `controlId` ([runtime-service.ts:51,112-115](apps/pi-remote-relay/src/runtime/runtime-service.ts)), a safe recovery is: remember the last intent and give Reconcile the power to re-POST it after a fresh hydrate, knowing the rescue is idempotent. Reverse of today's "never retry" — but it preserves fail-closed because the *attempt* is duplicated, not the delivery.
5. **Reject the value, not the control**: on `unsupported`, don't disable the whole effort control — keep Off/High interactive and disable only Max with "not supported by {model label}". Matches Claude Code's per-model caps behavior ([model-config](https://code.claude.com/docs/en/model-config)) and keeps the fail state actionable.

---

## 4. Open questions + risks

- **pi mid-stream semantics are unverified** — queue vs reject decides the headline copy and the whole switch-mid-turn story. Highest-priority probe (2.6).
- **Foreground contract**: docs say "phone can never enable full access" but a phone that simply *backs its WS* becomes non-authoritative for a benign effort change. Is the open-sync-socket gating the intended "on-the-phone" signal, or should effort (a changeable preference) be allowed while read-only? Security review required; this is a policy question, not a code question.
- Pi restart leaves phone UI `ready` on stale data; the freshness stamp (2.2-5) is the mitigation but depends on relay push-surface changes.
- The in-memory idempotency map (cap 256, [runtime-service.ts:256-263](apps/pi-remote-relay/src/runtime/runtime-service.ts)) is lost on relay restart; double-delivered `set_thinking_level` is semantically idempotent (set X twice = X) so risk is low, but placeholder text in the queue must not imply a hard "applied exactly once".
- `availableThinkingLevels` may grow (pi exposes `off/high/max` today); **labels must fall back to the raw token** (already the behavior in `effortLabel`, [RuntimeStrip.tsx:118-121](apps/pi-remote-web/src/RuntimeStrip.tsx)) — the spec should keep the map additive, never strict.
- **Kimi Code's true effort UI is not captured** — the App Store/docs don't confirm a discrete effort scale in the Kimi consumer app; treat "Kimi target" as the segmented/pill placement (grounded), not the exact level scale.
- Offline banner vs sheet placement: the sheet may be closed when the user taps — the offline state must also surface as a small session-statusline dot (next to "reconnecting", [App.tsx:1111-1121](apps/pi-remote-web/src/App.tsx)), not only inside the sheet.
- Raw host reason strings are already bounded to 500 chars ([runtime-service.ts:291-293](apps/pi-remote-relay/src/runtime/runtime-service.ts)) but redaction of `set_thinking_level` reasons should be re-audited before any reason line becomes visible UI.
- **Mobbin verification is outstanding** — the model/effort sheet shapes from Claude iOS and Kimi below are reconstruction-grade from App Store/documented sources, not screenshot-measured; re-verify against live Mobbin captures (`claude-by-anthropic` model picker flow; `kimi` model-switch flow; `chatgpt` status states) before pixel-locking 2.5.

---

## 5. Sources

**Codebase (verified by direct read)**
- `apps/pi-remote-web/src/runtime.ts`, `relay.ts`, `RuntimeStrip.tsx`, `SessionHeader.tsx`, `demo.ts`, `App.tsx`, `style.css`
- `apps/pi-remote-relay/src/runtime/runtime-service.ts`, `plan-status.ts`, `http/server.ts`, `rpc/supervisor.ts`
- `docs/platform-support.md`, `docs/design-reference/mobile-chat-apps/*` (research-gpt-luna.md, 01/02), `goal.md`

**Web / docs (fetched and parsed)**
- [Claude Code: Model configuration](https://code.claude.com/docs/en/model-config) — effort levels, `/effort` picker, per-model org effort caps, then-argument form on mobile/web
- [Claude Code: Settings](https://code.claude.com/docs/en/settings) — `alwaysThinkingEnabled`, `MAX_THINKING_TOKENS=0` (extended-thinking on/off semantics)
- [Claude Code: Remote Control](https://code.claude.com/docs/en/remote-control) — take-over/session-ended cause naming, 10-min / 30-min outage and heartbeat semantics, mobile push limits
- [Anthropic blog: "Choosing a Claude model and effort level in Claude Code"](https://claude.com/blog/claude-model-and-effort-level-in-claude-code) — effort ⇒ files read/verification/check-in cadence; ~7× token figure at high effort; per-request effort input; max_tokens boundary
- [W3C ARIA Authoring Practices: Menu Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/) — `aria-haspopup`/`aria-expanded` contract for the trigger
- [Nielsen Norman Group: Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/) — proximity, redundant indicators, recovery copy, no-blame
- [React Aria: Select](https://react-spectrum.adobe.com/react-aria/Select.html) — `isDisabled`, `disabledKeys`, `allowsEmptyCollection`, Description slot, `SelectValue` render prop
- [Apple HIG: Menus](https://developer.apple.com/design/human-interface-guidelines/menus) and [Apple HIG: Progress indicators](https://developer.apple.com/design/human-interface-guidelines/progress-indicators) (pages are JS-gated; cited for iOS picker/loading norms)
- [WCAG 2.2 SC 1.4.11 non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), [SC 2.5.8 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- Prior design research already in repo: [research-gpt-luna.md](docs/design-reference/mobile-chat-apps/research-gpt-luna.md) (Claude iOS model selector, Kimi, ChatGPT) with its grounding to [Claude Help](https://support.claude.com/en/articles/8114491-get-started-with-claude), [Kimi Help](https://www.kimi.com/help/getting-started/overview), [Kimi on App Store](https://apps.apple.com/ca/app/kimi-kimi-k3-is-live/id6474233312), [IXD@Pratt Claude critique](https://ixd.prattsi.org/2026/02/design-critique-claude-mobile-app/)

**Prior-art mobile coding-agent companions (GitHub, fetched via API)**
- [giuliastro/harness-remote](https://github.com/giuliastro/harness-remote) — capability-based hide-vs-fail, queued mid-turn follow-ups, session-held-by-other-client read-only marker, effort/mode advertised-but-unused by ACP adapters (Claude Code, Codex, PI)
- [termly-dev/termly-cli](https://github.com/termly-dev/termly-cli) — mobile companion for Claude Code/Gemini CLI/OpenCode, E2EE, WebSocket PTY
- [y49/tlive](https://github.com/y49/tlive) — self-hosted remote approvals + live monitoring (Telegram/Feishu/web terminal)
- [handmux/handmux](https://github.com/handmux/handmux) — tmux-based mobile PWA coding cockpit
- [QuivrHQ/247-claude-code-remote](https://github.com/QuivrHQ/247-claude-code-remote) — Tailscale-mobile Claude Code access (matches Pi Remote's tailnet ingress precedent)
- [lamngockhuong/termote](https://github.com/lamngockhuong/termote) — PWA remote control of CLI agents, stale-while-revalidate shell caching (parallel to our offline shell)
- [MoonshotAI/kimi-cli](https://github.com/MoonshotAI/kimi-cli) — ACP/IDE integration surface for Kimi Code (effort scale not doc-confirmed; flagged in §4)

**Mobbin** — [mobbin.com](https://mobbin.com): recommended flows to capture before build: Claude iOS "model picker" sheet (disabled/unavailable rows), Kimi mobile "model switch above input", ChatGPT "status/error states"; not screenshot-measured in this pass (flagged in §4).
