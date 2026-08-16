> **Deep research — external-CLI multi-executor run.** 10 independent iterations (5 × GPT 5.6 SOL high (--search, cli-codex), 5 × Grok 4.6 xhigh (cli-cursor)), no early convergence. Synthesis of all passes into one build-ready decision.
> **Provenance:** produced by external-CLI orchestration, NOT the `/deep:research` state-machine runtime — so runtime state artifacts (`deep-research-state.jsonl`, `findings-registry.json`, `deep-research-dashboard.md`, observability, deltas, lineages) are intentionally absent. See `PROVENANCE.md`.
> **Canonical:** this file (`research.md`) is the synthesized output; per-pass findings live in `iterations/iteration-NNN.md`.

---

# F4-plan-mode-tab — Synthesis

## 1. Decision

Build one always-visible, composer-adjacent `ModeButton` that displays the host-confirmed state: `Build`, `Plan · read-only`, `Plan ready`, `Executing plan`, or `Mode unavailable`. Tapping it opens a two-option mode menu; `Shift+Tab` provides Claude/Kimi parity only while the composer is focused, while bare `Tab` remains normal focus navigation. Treat `plan`, `plan_ready`, and `executing-plan` as distinct states, and never show a requested state before host acknowledgment. Execution must be a separate, atomic, ticketed operation bound to the reviewed plan revision—not `/plan execute` submitted as chat and not `set_mode(build)` followed by a prompt. This is preferable to a hidden `+`-menu toggle, a width-heavy permanent segmented control, or a local optimistic switch because it combines mobile discoverability with the fixed fail-closed posture (iter-01, iter-04, iter-05, iter-07, iter-10).

## 2. Build spec

### Component and protocol breakdown

#### Web client

- `PlanModeButton`
  - Persistent in the sticky composer toolbar, immediately after `+`.
  - React Aria `Button`/`MenuTrigger`.
  - Visible states:
    - `Build`
    - lock/document icon + `Plan · read-only`
    - document-check icon + `Plan ready`
    - play/document icon + `Executing plan`
    - warning/shield icon + `Mode unavailable`
  - Accessible name includes the consequence: `Agent mode: Plan, read-only`.
  - Opens the same picker from touch, keyboard, and the optional `+ → Mode…` route.

- `PlanModeMenu`
  - React Aria `Popover` + single-selection `Menu`.
  - Rows:
    - `Build` — `Pi may request write-capable tools; approvals still apply.`
    - `Plan` — `Read-only exploration and planning.`
  - Arrow keys move focus; only Enter, Space, or press selects. Focus alone must never change authority.
  - Current host-confirmed mode has a checkmark. `executing-plan`, unknown, pending, and disconnected states disable selection and explain why.

- `usePlanModeShortcut`
  - Handles composer-scoped `Shift+Tab`.
  - Bare `Tab` is never intercepted.
  - Also supports `⌘⇧M` to open the mode menu.
  - Preserves textarea focus, selection, draft, and scroll.

- `PlanReadyCard`
  - Created only from a structured, versioned host plan event; never inferred by parsing assistant prose.
  - Shows title, redacted summary, revision, timestamp, step count, and `Review plan`.
  - Only the newest still-valid plan may expose execution.
  - Sending plan feedback immediately marks the old plan superseded and disables its execution action.

- `PlanReviewSheet`
  - Full-height React Aria modal containing the complete redacted plan.
  - Actions:
    - `Keep planning`
    - `Revise plan` — closes and focuses the composer
    - `Leave without running`
    - `Execute reviewed plan`
  - Initial focus is `Keep planning`, never Execute.
  - Execute uses the carbon action style, not clay.
  - Swipe-down, backdrop press, Escape, browser Back, and focus loss all cancel safely.

- `LeavePlanSheet`
  - Used for every Plan → Build transition because it expands authority.
  - Copy:
    - Title: `Leave plan mode?`
    - Body: `Pi may request write-capable tools again. The current plan will not run.`
    - Actions: `Stay in plan` and `Switch to Build`
  - A retained plan remains a non-executable transcript artifact after leaving.

- `RuntimeModeAnnouncer`
  - One permanently mounted polite live region.
  - A separate pre-mounted alert region is used only for conflicts, permission loss, or delivery uncertainty.

#### Relay and protocol

Expose two control operations:

```text
set_mode {
  target: "build" | "plan"
  expectedRuntimeRevision
  controlId
  oneUseTicket
}
```

```text
execute_plan {
  planId
  expectedPlanRevision
  planToken
  selectedApproachId?
  expectedRuntimeRevision
  postRunMode: "plan"
  controlId
  oneUseTicket
}
```

`planToken` is an opaque, host-issued binding to the canonical plan; the phone echoes it but does not derive it from redacted text. `execute_plan` must atomically validate the ticket, session, foreground principal, runtime revision, plan revision/token, current Plan mode, and idle state before enabling tools and enqueuing the reviewed plan.

Remove `plan` from the phone slash-command catalog and reject a leading `/plan` token on normal prompt submission. Control commands emitted internally by the relay must not become user messages or transcript cards.

#### Host extension

- Publish authoritative mode and monotonically increasing runtime revision on hydration and every transition.
- Publish structured plan artifacts with stable ID, revision, opaque token, redacted projection metadata, and validity state.
- Enforce Plan with a default-deny capability policy:
  - Built-in write/edit tools denied.
  - Shell commands allowlisted for read-only behavior.
  - Unknown extension or MCP tools denied unless explicitly classified read-only.
- Publish `executing-plan` only after the atomic handoff succeeds.
- Reapply Plan restrictions after completion, cancellation, or execution failure; do not leave the session in durable Build after a bounded plan execution.
- If tool restoration succeeds but execution cannot start, restore Plan restrictions before returning an error.

### Authoritative state model

Keep independent fields rather than a single `isPlan` flag:

```text
confirmedMode: "build" | "plan" | "executing-plan" | "unknown"
runtimeRevision: integer | null
connection: "hydrating" | "ready" | "offline" | "forbidden" | "unsupported" | "error"
transition: null | "entering-plan" | "leaving-plan" | "executing-plan"
delivery: "settled" | "unknown"
planPhase: "none" | "drafting" | "ready" | "superseded"
planId / planRevision / planToken: nullable
turnState: "idle" | "running"
```

| State | Presentation | Allowed actions |
|---|---|---|
| Hydrating | `Checking mode…`; no selected menu item | Edit draft only |
| Ready Build | `Build`; normal composer outline | Enter Plan |
| Entering Plan | Build remains confirmed; target shows `Applying…` | No duplicate control |
| Ready Plan | `Plan · read-only`; dashed composer outline | Planning prompts, review, request exit |
| Plan ready | `Plan ready`; authoritative card present | Review, revise, execute, or leave |
| Execute pending | Plan remains confirmed; Execute shows pending | No second mutation |
| Executing | `Executing plan`; solid composer outline; never “read-only” | Steer/Stop under existing rules |
| Leave pending | Plan remains confirmed | No duplicate control |
| Conflict/stale | Returned host state plus `Updated elsewhere` | Refresh and act again |
| Delivery unknown | Last state labelled `Unconfirmed`; all mutations disabled | Read-only reconciliation only |
| Offline | `Last confirmed … · offline`; timestamp shown | Reconnect; never queue mutations |
| Forbidden | `Device not authorized` | Secure reconnect or device approval |
| Unsupported | `Plan unavailable on this host` | Diagnostic/recovery only |
| Extension error | `Plan safety could not be verified` | Send and all escalation disabled |

A resumed or foregrounded PWA must hydrate again before enabling Send or mode controls. Cached Build must never be rendered as current authority.

Mode switching is idle-only. If a turn is running, disable the menu with `Stop the current turn before changing mode`; entering Plan cannot retroactively cancel already-dispatched writes.

### Touch, gestures, and keyboard

- Tap the mode button: open the mode menu without blurring the composer.
- Tap Plan from Build: request Plan immediately; no confirmation because authority decreases.
- Tap Build from Plan: open `LeavePlanSheet`.
- Tap `Review plan`: open the full plan sheet.
- Long-press: may open the same menu, but has no unique functionality.
- Horizontal swipe, double-tap, drag, and touch-down never change mode.
- Activation commits only on release inside the target.
- Software-keyboard users receive the complete feature through the visible control; no fake Tab key is required.

Keyboard contract:

- `Tab`: normal forward focus everywhere.
- `Shift+Tab`: toggle only when:
  - the composer textarea has DOM focus;
  - the CLI-style shortcut setting is enabled;
  - no menu, sheet, dialog, autocomplete, or approval surface is open;
  - `event.isComposing`, `event.repeat`, and `event.defaultPrevented` are false;
  - no other modifier is pressed;
  - the runtime is ready, idle, and settled.
- From Build, `Shift+Tab` requests Plan.
- From Plan, it opens the leave confirmation; it never directly restores tools.
- From `plan_ready`, it opens the same leave-without-running confirmation.
- From `executing-plan`, it is a no-op with `Plan execution is in progress`.
- Outside the composer, `Shift+Tab` remains reverse focus navigation.
- `⌘⇧M` opens the mode menu.
- Escape dismisses the topmost surface without changing mode.
- `aria-keyshortcuts="Shift+Tab Meta+Shift+M"` appears on the mode button.

Ship composer-scoped `Shift+Tab` enabled for target-product parity, with an immediately reachable `CLI-style Shift+Tab in composer` setting that restores reverse focus when disabled. Physical Full Keyboard Access testing is a release gate.

### Accessibility

- Mode trigger: one tab stop, visible label, icon, and consequence; do not use a changing-label toggle with ambiguous `aria-pressed`.
- Menu name: `Agent mode`.
- Modal background becomes inert; focus is trapped and restored to the invoker.
- Never move focus after a settled mode change.
- Do not automatically open the plan sheet or move VoiceOver when a plan becomes ready.
- Announcements:
  - `Plan mode on. Pi is read-only.`
  - `Build mode on. Changes still require approval.`
  - `Plan ready for review.`
  - `Approved plan execution started.`
  - `Mode changed on another device.`
  - `Mode could not be verified. Controls disabled.`
- Use visible inline errors plus `role="alert"` only for failures requiring action; avoid redundant live-region attributes that double-announce on iOS.
- Every target is at least 44×44 CSS px.
- Focus indicators are at least 2px, offset 2px, and 3:1 against both component and surrounding surface.
- Support 200% text scaling and 320px reflow without truncating `Plan · read-only` or hiding actions.
- At narrow widths or enlarged text, place the mode control on a full-width toolbar row above the textarea.
- Use `rem`, logical CSS properties, localized complete messages, `dir="auto"` for prose, and isolated LTR rendering for paths, revisions, slash commands, and keyboard legends.

### Visual system

- Light:
  - Canvas: bone `#f8f8f6`
  - Text and critical outlines: carbon/near-carbon
  - Clay `#d97757`: decorative 3–4px status bar, small dot, or soft selected tint only
- Dark:
  - Near-carbon canvas/surface
  - Bone text and critical outlines
  - Clay remains a secondary accent

Clay-on-bone is approximately 2.94:1 and must not carry normal text, focus, or the only state boundary. Plan mode is conveyed redundantly by the words `Plan · read-only`, lock/document glyph, selected menu item, and a dashed carbon-contrast composer outline. Execution changes the outline from dashed to solid and the label to `Executing plan`; it does not retain the lock or read-only copy.

Typography:

- Mode control/menu: Inter, 14px/20px, weight 600.
- Menu descriptions and supporting UI: Inter, 13–14px/20px.
- Plan title: Source Serif 4, 20px/26px.
- Plan body: Source Serif 4, at least 17px/27px.
- Composer input remains Inter at 16px or larger to avoid iOS auto-zoom.

### Motion and PWA layout

- Press feedback: 120ms opacity/background response; no required scale.
- Pointer-opened menu: 140ms opacity only.
- Sheet: 180ms ease-out with no more than 8px translation.
- Confirmed mode chrome: 140ms color/outline crossfade.
- Keyboard-triggered transitions: 0ms.
- Pending status appears after 300ms to avoid flicker.
- No bounce, pulsing security badge, marching dashed border, full-page tint, or celebratory animation.
- Under `prefers-reduced-motion: reduce`, remove translation, rotation, and transition delay; retain immediate textual state changes.
- Do not promise haptics in a PWA.

Keep the mode control inside the existing sticky composer. Use `viewport-fit=cover` and safe-area padding; do not create a separately fixed overlay positioned solely from `visualViewport.height`. Verify Safari and installed standalone mode independently with the keyboard open, rotation, background/resume, and hardware-keyboard attachment.

### Objective acceptance gates

- Initial hydration never flashes Build.
- Ten rapid taps or held shortcuts produce at most one in-flight mutation.
- Bare Tab is never cancelled.
- Shift+Tab outside the composer always navigates backward.
- IME composition, autocomplete, repeat, pending, offline, and running-turn states issue no mode request.
- Plan/Build selection changes only after matching host acknowledgment.
- Lost responses enter delivery-unknown reconciliation and are never replayed automatically.
- Two clients acting on one revision yield one acceptance and one stale response.
- Ticket expiry, consumption, or replay cannot change mode.
- Prompt submission rejects `/plan`, including leading whitespace; no host prompt is emitted.
- Control-plane status events produce no transcript blocks or user bubbles.
- `executing-plan` is never labelled Plan or read-only.
- Execution fails closed when the runtime revision, plan revision, ID, token, or selected approach differs.
- Execute completion or failure re-establishes Plan restrictions.
- Cached plan cards cannot execute before live reconciliation.
- VoiceOver announces each settled transition once without focus movement.
- At 320, 375, 390, and 430px, with 200% text and both themes, controls remain visible and unobscured.
- Automated contrast checks reject clay-on-bone normal text and clay-only state outlines.
- Reduced Motion contains no positional or continuous animation.
- All failures and diagnostics omit tickets, principals, hostnames, absolute paths, raw tool arguments, and unredacted plan content.

## 3. Consensus vs divergence

### Consensus

All ten passes converged on the following:

- Plan is authoritative host state, not local presentation.
- The primary control must be persistent and composer-adjacent; `+`-only entry is below the Claude/Kimi bar.
- Bare Tab must remain focus navigation.
- `plan`, `plan_ready`, and `executing-plan` require distinct labels and permissions.
- Entering Plan may be fast; leaving or executing must be explicit.
- Execution must bind to the reviewed plan and must not be implemented as two independent mutations.
- Offline, stale, timeout, reconnect, and unknown states fail closed.
- Touch targets are 44×44px, focus remains stable, and color is never the sole cue.
- Clay cannot safely carry small text or critical outlines on bone.
- Long-press and swipe may be secondary conveniences but cannot be required.
- Plans and mode status must come from structured host events, not transcript parsing (iter-01–iter-10).

### Strong minority ideas retained

- **Make Shift+Tab opt-in:** retained as a user setting and release fallback if Full Keyboard Access testing shows unacceptable reverse-navigation loss (iter-02, iter-03, iter-04).
- **Bounded execution lease:** adopted for `execute_plan`; execution returns to Plan rather than leaving broad Build authority active (iter-02, iter-05).
- **Fork execution into a child session:** keep as a later auditability mode. It preserves the planning transcript as immutable evidence but adds session-management complexity (iter-01, iter-04).
- **Plan-first sessions or one-turn Plan:** preserve as a future policy/deep-link option, not part of this interaction slice. The client must never impose it locally without a host-authoritative session policy (iter-01, iter-04, iter-06).
- **Show capability rather than product jargon:** retained in menu descriptions—`Read-only` versus `May request changes`—while keeping the familiar Build/Plan labels (iter-02, iter-03).
- **Plan content minimization:** keep the option to show only a redacted outline on the phone and require a fresh ticket for fuller plan content where host data sensitivity warrants it (iter-07).

## 4. Security & redaction

The only authority chain is:

```text
explicit user action
→ one-use ticketed control request
→ expected-revision validation
→ host-extension capability change
→ authoritative status publication
→ client presentation
```

Security requirements:

- `set_mode` and `execute_plan` are single-flight, foreground-only, rate-limited controls.
- A timeout or aborted HTTP request does not prove non-application; reconcile by read-only state fetch and never retry automatically.
- Plan → Build changes capability only. It never submits the draft or executes a stored plan.
- `execute_plan` is atomic and limited to the exact reviewed plan. It is not an approval of later prompts, auto-accept, YOLO, or bypass mode.
- Normal filesystem/process approval leases remain active during execution.
- `/plan on`, `/plan off`, and `/plan execute` are not accepted through the user prompt channel.
- Mode-control prompts generated internally are excluded from transcripts, replay, and model-visible chat.
- Unknown or newly installed tools are mutation-capable until explicitly classified otherwise.
- The host must block write-capable custom/MCP tools and shell escape routes, not merely hide built-in Edit and Write.
- Redaction happens before persistence, ledger append, sync broadcast, rendering, copying, or notification generation.
- Plan DTOs, tool results, diffs, and errors use allowlisted projectors. Secrets, absolute paths, unsafe filenames, credentials, raw environment content, principals, tickets, and host identifiers are removed.
- Project-relative paths appear only when explicitly allowed by policy; otherwise use stable redacted aliases.
- Large read results are truncated or summarized before reaching the phone. Redaction is not treated as proof that arbitrary file contents are safe.
- Copy is user-initiated and copies only the already-redacted projection.
- Push payloads contain only lookup and attention-class identifiers—never mode, plan titles, paths, or plan bodies.
- Service-worker and transcript caches may render history but may never enable mode or execution controls.
- Resume, reconnect, relay restart, and foreground restoration force fresh authoritative hydration.

These requirements directly address the prompt-channel privilege bypass and executing-state mislabelling identified in iter-07 while preserving the existing ticketed, revision-checked model from iter-04 and iter-05.

## 5. Open questions + risks

- Can the host expose `execute_plan` as a dedicated atomic operation and guarantee re-entry into Plan after completion, cancellation, or partial failure?
- What events invalidate a plan: planning feedback, any user message, branch/repository change, another client, reconnect, or host restart?
- Can the extension emit a canonical structured plan artifact with stable ID, revision, opaque token, approaches, and redacted projection?
- How will all extension and MCP tools declare read-only capability? Until that registry exists, unknown tools must remain denied in Plan.
- Should sensitive read tools such as `cat`, `git show`, and environment-file access require separate approval even during Plan?
- Does physical iPhone Full Keyboard Access testing permit composer-scoped Shift+Tab to remain default-on? If not, ship the existing preference default-off while retaining `⌘⇧M`.
- Which installed-PWA iOS versions are supported? Tailwind 4’s browser floor and WebKit keyboard/safe-area behavior require an explicit minimum.
- Can the relay return structured distinctions for offline, expired session, device authorization, host unavailable, extension unhealthy, and certificate failure?
- What host event deterministically ends `executing-plan`? The client must never infer completion from a timer.
- Authenticated Mobbin validation of current Claude Code mobile and comparable plan-review screens remains outstanding; public consumer-chat screens are useful for composer proportions but not permission semantics.

## 6. Sources

### Primary product behavior

- [Claude Code permission modes and plan approval](https://code.claude.com/docs/en/permission-modes)
- [Claude Code mobile](https://code.claude.com/docs/en/mobile)
- [Claude Code Remote Control](https://code.claude.com/docs/en/remote-control)
- [Kimi Code work modes](https://www.kimi.com/help/kimi-code/cli-work-modes)
- [Kimi Code interaction and Plan review](https://moonshotai.github.io/kimi-cli/en/guides/interaction.html)
- [Kimi Code web UI](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html)
- [Gemini Deep Research on iPhone](https://support.google.com/gemini/answer/15719111?co=GENIE.Platform%3DiOS&hl=en)
- [Codex best practices](https://developers.openai.com/codex/learn/best-practices)

### Implementation, accessibility, and platform

- [React Aria Menu](https://react-aria.adobe.com/Menu)
- [React Aria Button](https://react-aria.adobe.com/Button)
- [React Aria RadioGroup](https://react-aria.adobe.com/RadioGroup)
- [Apple HIG — Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards)
- [Apple HIG — Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [Apple HIG — Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WCAG — Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)
- [WCAG — No Keyboard Trap](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html)
- [WCAG — Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG — Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [WebKit safe-area guidance](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [RFC 9110 conditional requests](https://www.rfc-editor.org/rfc/rfc9110.html#name-if-match)

### Coding-agent and remote-client prior art

- [Pi](https://github.com/badlogic/pi-mono)
- [Pi Plan-mode extension example](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/plan-mode/index.ts)
- [Community Pi Plan mode](https://github.com/narumiruna/pi-extensions/tree/main/extensions/pi-plan-mode)
- [OpenCode Manager PWA](https://github.com/chriswritescode-dev/opencode-manager)
- [Happy remote client](https://github.com/slopus/happy)
- [Happy Plan-mode handoff fix](https://github.com/slopus/happy/blob/main/docs/plans/agent-sdk-upgrade-plan-mode-fix.md)
- [Codex Shift+Tab accessibility discussion](https://github.com/openai/codex/issues/10991)
- [Gemini CLI Plan mode](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/plan-mode.md)

### Mobbin references worth retaining

These validate mobile composer and mode-chip proportions, not Pi’s permission semantics:

- [Claude iOS chat detail](https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8)
- [ChatGPT iOS composer](https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1)
- [Gemini iOS home](https://mobbin.com/explore/screens/2ec379b4-48e9-46bd-a332-d84086092f78)
- [DeepSeek iOS chat](https://mobbin.com/explore/screens/9fa85a22-a24c-4224-a3db-6c40827c1db4)
- [Perplexity iOS Research flow](https://mobbin.com/explore/flows/036b8308-ccd9-4efe-9b47-4d203ff6f53e)
- [Meta AI iOS composer](https://mobbin.com/explore/screens/5d784612-55db-4241-a110-0a5d66cf5711)
