> **Deep research — external-CLI multi-executor run.** 5 independent iterations (5 × DeepSeek v4 Flash (opencode-go gateway)), no early convergence. Synthesis of all passes into one build-ready decision.
> **Provenance:** produced by external-CLI orchestration, NOT the `/deep:research` state-machine runtime — so runtime state artifacts (`deep-research-state.jsonl`, `findings-registry.json`, `deep-research-dashboard.md`, observability, deltas, lineages) are intentionally absent. See `PROVENANCE.md`.
> **Canonical:** this file (`research.md`) is the synthesized output; per-pass findings live in `iterations/iteration-NNN.md`.

---

# F2-change-effort — Synthesis

## 1. Decision

Build one reusable, host-authoritative effort picker as full-width radio rows inside the existing Model and Effort sheet; remove the nested effort `Select` and make both the header and RuntimeStrip open this same surface. Radio rows remain understandable from three through seven levels, support descriptions and VoiceOver cleanly, and avoid the adaptive segmented-control complexity proposed by some passes. Every change commits immediately but remains visually unselected until Pi confirms it through the existing one-use-ticket and revision-checked mutation path. While Pi is streaming, effort changes are disabled until a live-host probe establishes their exact effect; the UI must not promise “next message” semantics that may be false for multi-call agent turns. Failures become cause-specific, recoverable read-only states rather than the current generic, terminal “Unavailable” state.

## 2. Build spec

### Component structure

- `effort.ts`
  - Single source of truth for known IDs: `off`, `minimal`, `low`, `medium`, `high`, `xhigh`, `max`.
  - Exports localized labels, descriptions and formatting helpers.
  - Preserves the host’s advertised order and subset.
  - Unknown IDs remain internal selection values but render as `Host-defined level 1`, `Host-defined level 2`, etc.; never render raw host strings.
  - Do not add a `Default` marker until the host supplies an explicit default field.

- `EffortRadioGroup.tsx`
  - Controlled React Aria `RadioGroup` with one `Radio` per advertised level.
  - Receives confirmed level, available levels, pending operation, runtime state and `onChange`.
  - Uses the confirmed host value as `value`; the requested value is represented separately as pending.
  - Displays each known level with:
    - Label.
    - One-line explanation.
    - Confirmed check indicator.
    - Pending spinner/status when that row was requested.
    - Disabled reason where applicable.

- `ModelEffortSheet.tsx`
  - Retains the current model picker.
  - Replaces the nested effort `Select → Popover → ListBox` with `EffortRadioGroup`.
  - Remains a single top-level React Aria `Dialog`/portaled `Popover`; no second overlay for effort.
  - Supports an `initialSection` value so the header opens at Model while the RuntimeStrip effort trigger focuses Effort.
  - Contains no local committed model or effort state.

- `EffortTrigger`
  - Header readout: confirmed `{model} · {effort}` using separate spans and one localized accessible label.
  - RuntimeStrip: compact `Effort · High` summary button.
  - Both triggers open the same controlled sheet rather than implementing independent pickers.

- `useRuntime`
  - Retains the non-optimistic reducer.
  - Adds a synchronous in-flight ref to close the same-render double-tap window.
  - Adds a cross-browser 10-second mutation deadline. A timeout becomes `delivery-unknown`, never an automatic retry.
  - Rehydrates on sheet open, app foreground and sync reconnection.
  - Maps transport failures to stable local issue codes instead of exposing HTTP or host reason strings.

### Level copy

| Host ID | Visible label | Description |
|---|---|---|
| `off` | Off | No explicit reasoning; fastest for simple checks. |
| `minimal` | Minimal | Brief reasoning with a quick response. |
| `low` | Low | Light reasoning for routine work. |
| `medium` | Medium | Balanced reasoning depth and speed. |
| `high` | High | Deep reasoning for complex coding work. |
| `xhigh` | Extra high | Very deep reasoning for long-running agent work. |
| `max` | Max | Maximum available reasoning; slowest and highest use. |

Copy describes direction, not guaranteed token counts, quality gains or cost. Those require host-supplied metadata.

### State model

| State | Presentation | Interaction and recovery |
|---|---|---|
| `checking` | Last confirmed value marked `Checking…`, or an em dash when none exists. | All mutations disabled; read-only hydrate in progress. |
| `ready-adjustable` | Confirmed row checked; descriptions visible. | Tap, Space or arrow selection starts one mutation. |
| `ready-off-only` | Static `Off` row plus `This model does not expose adjustable reasoning.` | No mutation affordance. Model control remains available. |
| `ready-empty` | Effort group replaced by `Pi reported no effort controls.` | Treat as inconsistent capability data; offer `Reconcile`. |
| `streaming` | Confirmed value remains visible with `Available when the current turn ends.` | No ticket is requested and no effort mutation is sent. Re-enable after confirmed idle state. |
| `pending` | Confirmed row remains checked. Requested row shows spinner and `Applying High…`; group has `aria-busy="true"`. | Group becomes read-only, not unfocusable. Further input is ignored by both handler and in-flight guard. Other mutation controls remain locked to avoid revision races. Sheet may close; the operation continues. |
| `accepted` | Check moves only when the accepted response supplies the new host state. | Announce `Effort set to High.` Return to ready. |
| `stale` | Use state returned by the relay, then enter `reconciling`. | Perform one read-only refresh of state, models and levels. Never resend the mutation. |
| `unsupported` | Last confirmed value remains; refreshed catalog determines which rows remain available. | Reconcile once. Announce `That effort level is not available for this model.` |
| `offline` | Last confirmed value marked `Last confirmed`; inline `Offline` status. | Mutations disabled. Reconcile automatically after connectivity returns, but require a new user selection to mutate. |
| `foreground-required` | `Another device is controlling Pi.` | Mutations disabled. `Reconnect` may restore the sync connection, but must not take authority or resubmit automatically. |
| `rate-limited` | `Too many changes—try again shortly.` | Honor `Retry-After`; afterward reconcile, then require a fresh selection and ticket. |
| `host-unavailable` | `Pi is not ready to change effort.` | Read-only `Reconcile` action. No automatic mutation retry. |
| `delivery-unknown` | `Pi may have received this change. Reconcile before trying again.` | Terminal until a read-only hydrate confirms state. Never replay the old intent automatically. |
| `inconsistent-state` | Confirmed value is absent from the advertised catalog. | Disable mutation and reconcile; do not silently choose a replacement. |

`Reconcile` is always a read-only fetch. After any failure, a later change is a new deliberate action with a new ticket, control ID and expected revision.

### Interaction, gestures and keyboard

- Tap a trigger to open the sheet.
- Tap an option to commit on release; dragging away cancels through React Aria press semantics.
- Re-tapping the confirmed option is a no-op.
- Scrim tap, explicit Close and Escape dismiss the sheet. A pending operation is not cancelled by dismissal.
- Do not add swipe-to-change, sliders, long-press actions, custom audio ticks or simulated haptics.
- Do not add a custom swipe-to-dismiss gesture during this hardening pass; the sheet remains vertically scrollable.
- Keyboard:
  - Enter or Space opens the sheet.
  - Tab enters the radio group at the confirmed option.
  - Arrow keys follow React Aria radio behavior and select one option, after which the group locks pending confirmation.
  - Space selects the focused option.
  - Escape closes and restores focus to the originating trigger.
- RTL behavior and arrow direction come from React Aria and inherited `dir`; do not manually reverse keys.

### Accessibility and internationalization

- Label the group from the visible `Effort` heading with `aria-labelledby`.
- Associate every radio with its description via React Aria’s description slot or `aria-describedby`.
- Maintain one document-level `role="status" aria-live="polite" aria-atomic="true"` so confirmation remains announceable after the sheet closes.
- Do not introduce a competing `alert` region; iter-03 identified iOS VoiceOver double-speaking risks around overlapping live-region behavior.
- Keep the pending group focusable with `isReadOnly`/event guards rather than disabling the focused radio.
- Minimum touch target: 44×44 CSS px; two-line rows should normally be 56–64 px high.
- Verify:
  - Text contrast of at least 4.5:1.
  - Focus, borders and selected indicators at least 3:1.
  - Visible keyboard focus on every trigger and option.
  - Reflow at 320 CSS px and 200% zoom without horizontal scrolling.
- Preserve browser text inflation; never set `-webkit-text-size-adjust: none`.
- At large text sizes, descriptions wrap and the sheet scrolls internally beneath a fixed heading.
- Replace concatenated English strings such as `Effort · ${value}` with localized templates or separately ordered spans.
- Host strings and server reasons never become accessible names or live-region copy.

### Visual system

- Light:
  - Canvas: bone `#f8f8f6`.
  - Primary text: carbon `#121212`.
  - Decorative accent: clay `#d97757`.
  - Functional light-theme clay text/check: darker clay such as existing `#8a452f`.
- Dark:
  - Canvas: carbon `#121212`.
  - Raised surface: warm carbon around `#2b2925`.
  - Primary text: bone `#f8f8f6`.
  - Functional accent: light clay such as existing `#f0b19a`.

Raw clay `#d97757` is only 2.94:1 against bone, so it must not be the sole selected, focus or pending indicator. Use carbon, the accessible clay-ink token, a check, text and shape together.

The sheet uses a Source Serif 4 title and Inter for headings, controls and descriptions. Use parchment surfaces, a warm hairline border, 24–30 px corner radius and restrained shadow. Each row has an Inter semibold label, muted description, right-aligned confirmation mark and an `accent-soft` wash when confirmed. The sheet is body-portaled, width `min(92vw, 24rem)`, max-height approximately `75dvh`, internally scrollable and padded for `env(safe-area-inset-bottom)`.

### Motion

- Press: `data-pressed` scale to `0.98`, returning on release.
- Sheet: 140–180 ms opacity plus 8 px movement using React Aria `data-entering`/`data-exiting`.
- Confirmed check: 120 ms scale-and-fade.
- Pending: reuse the existing restrained streaming-bars language or a 12 px spinner on only the requested row.
- Reduced motion: remove transforms and pulses; use an immediate state change or short opacity-only transition.
- Never animate the header’s confirmed value before host acceptance.

### Acceptance gates

- Available levels render in exactly the host’s order and subset.
- Unknown IDs never appear in visible or accessible text.
- Selecting a row requests exactly one ticket and sends exactly one `set_thinking_level` operation with a fresh control ID and current expected revision.
- The checked row does not change before an accepted host response.
- Same-tick double taps produce one request.
- Streaming state produces no ticket or mutation request.
- Stale and unsupported outcomes cause one read-only refresh and zero automatic mutation retries.
- Timeout and ambiguous delivery enter `delivery-unknown`; retry remains unavailable until reconciliation.
- Offline, 403 and 429 responses produce local, redacted copy rather than raw transport messages.
- `["off"]`, an empty catalog and a confirmed value missing from the catalog each render their specified distinct state.
- VoiceOver announces pending, accepted, stale and failure outcomes once.
- Light, dark, selected, disabled, focus and pending combinations pass automated contrast checks.
- Test at 320 px, landscape, 200% zoom, reduced motion, RTL and a real iPhone standalone PWA with VoiceOver.
- Plan-mode tests prove that changing effort neither changes Build/Plan state nor bypasses host- or extension-enforced plan restrictions.

## 3. Consensus vs divergence

### Consensus

- All passes preserve host-authoritative levels and confirmed state; no pass supports inventing a client-side committed value.
- Iter-01, iter-03 and iter-05 prefer descriptive radio rows in the Model and Effort sheet; iter-02 also agrees that the nested overlay must be removed, although it favors segments for three levels.
- Every pass keeps ticketed, revision-checked, non-optimistic mutations and visible pending/error feedback.
- Iter-02 through iter-05 converge on 44 px targets, React Aria press semantics, reduced-motion support and explicit VoiceOver announcements.
- Iter-03 through iter-05 identify silent unavailable states, raw unknown labels and generic errors as hardening gaps.
- Iter-04 and iter-05 establish that stale, offline, foreground-held, rate-limited and delivery-unknown outcomes need distinct behavior and recovery.
- Model and effort remain adjacent, while effort stays visually secondary to model identity.

### Strong minority ideas retained

- **Three-way segmented control:** iter-01 and iter-02 make a strong case for `Off / High / Max`. Keep it as a future compact variant only if the protocol formally pins the public catalog to at most three levels; do not change widget shape dynamically today.
- **Composer-adjacent shortcut:** several passes favor Kimi-style placement near the prompt. Retain the RuntimeStrip summary trigger, but have it open the canonical sheet instead of creating another mutation implementation.
- **Native `<select>` fallback:** iter-05 proposes it as the most conservative VoiceOver fallback. Keep a spike in reserve if real-device testing finds React Aria radio behavior unreliable inside the current dialog.
- **Cost and latency guidance:** iter-01 and iter-04 correctly argue that effort needs consequences, not adjectives. Ship qualitative descriptions now and add token/budget estimates only when Pi reports trustworthy metadata.
- **Mid-turn changes:** most passes favor allowing them with next-turn messaging. Preserve this as a capability-gated improvement after a real-host probe establishes whether the change affects the next message, the next model call within the current turn, or is rejected.
- **Per-option availability:** iter-04’s proposal to disable only an unsupported level is preferable to disabling the group once the host protocol exposes per-level disabled reasons.

## 4. Security & redaction

- Effort remains a mutation in an otherwise read-only client. Only an explicit option selection may request a one-use ticket.
- Every attempt sends a unique control ID, a fresh ticket, the selected internal level ID and the latest confirmed revision.
- The relay validates the requested ID against Pi’s current advertised levels before forwarding it.
- No UI state is committed optimistically. Pending presentation is visually distinct from confirmed selection.
- Streaming, offline, stale-authority, foreground-held and inconsistent states fail closed.
- Reconcile, reconnect and foreground refreshes are read-only. They never replay an intent or silently obtain mutation authority.
- Ambiguous delivery is terminal until the client reads back current host state. Neither the same control ID nor a new one is automatically submitted.
- Tickets are requested just in time, never prefetched, persisted, logged or included in diagnostics.
- Unknown level IDs, host rejection text, HTTP bodies and RPC reasons stay internal. User-facing and assistive copy comes from a bounded local allowlist.
- Runtime state, telemetry and logs retain existing redaction and length bounds; new issue fields carry enums rather than server strings.
- Changing effort cannot enable Build mode, approve tools or relax plan restrictions. Plan mode remains enforced independently by the host and extension even if the client is compromised.
- Foreground-device enforcement remains unchanged. Any proposal to exempt effort changes requires a separate security decision.

## 5. Open questions + risks

- **Mid-turn contract:** run `set_thinking_level` against a live Pi while it is streaming and during a tool loop. This decides whether the disabled streaming policy can later become “applies to next model call.”
- **Default metadata:** Pi does not currently report a recommended/default level. A Claude-style `Default` badge would be misleading without a protocol field.
- **Level metadata:** decide whether the protocol should eventually provide localized meaning, rank, disabled reason and thinking-budget data instead of maintaining client-authored descriptions.
- **Freshness:** rehydrating on open, foreground and reconnect narrows stale windows but does not push desktop-side effort changes live. A redacted revision-change signal may be needed later.
- **Foreground ownership:** confirm whether an open sync socket is the intended authority test for low-risk configuration changes. Do not weaken it as part of this feature.
- **Unknown levels:** generic ordinal labels prevent unsafe echoing but are less understandable when multiple new levels appear. Protocol evolution is the durable fix.
- **Small-screen density:** seven two-line rows may require substantial scrolling at 320 px or 200% zoom; validate the 75dvh sheet and sticky heading on-device.
- **VoiceOver focus:** verify that making the group read-only during pending retains focus in standalone Safari and that the document-level live region announces after dismissal.
- **Mobbin evidence:** Claude, ChatGPT and Kimi flows were partly reconstructed from gated references. Recheck live screens before pixel-locking spacing and motion, not before implementing the interaction contract.

## 6. Sources

### Product and host behavior

- [Pi RPC mode and thinking commands](https://pi.dev/docs/latest/rpc)
- [Pi usage documentation](https://pi.dev/docs/latest/usage)
- [Pi repository](https://github.com/earendil-works/pi)
- [Claude: change model, effort and thinking settings](https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings)
- [Anthropic API effort documentation](https://platform.claude.com/docs/en/build-with-claude/effort)
- [Claude Code Remote Control](https://code.claude.com/docs/en/remote-control)
- [Claude Code model configuration](https://code.claude.com/docs/en/model-config)
- [Choosing a Claude model and effort level](https://claude.com/blog/claude-model-and-effort-level-in-claude-code)
- [OpenAI reasoning models](https://platform.openai.com/docs/guides/reasoning)
- [DeepSeek thinking mode](https://api-docs.deepseek.com/guides/thinking_mode)
- [Kimi Code](https://github.com/MoonshotAI/Kimi-Code)
- [Harness Remote](https://github.com/giuliastro/harness-remote)

### Components, accessibility and platform

- [React Aria RadioGroup](https://react-spectrum.adobe.com/react-aria/RadioGroup.html)
- [React Aria Popover](https://react-spectrum.adobe.com/react-aria/Popover.html)
- [React Aria press interactions](https://react-spectrum.adobe.com/react-aria/usePress.html)
- [WAI-ARIA Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [MDN ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions)
- [WCAG reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html)
- [WCAG non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [WCAG target-size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [Apple HIG: Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [Apple HIG: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Apple HIG: Typography](https://developer.apple.com/design/human-interface-guidelines/typography)

### Visual references

- [Mobbin mobile app gallery](https://mobbin.com/explore/mobile) — retain Claude model/effort picker, ChatGPT reasoning picker/status states and Kimi model-switch/composer flows as the comparison set; access is login-gated.
