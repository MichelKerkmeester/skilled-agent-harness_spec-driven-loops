---
title: Senior Mobile Product-Design Council
description: Ranks Pi Remote chat redesign decisions for the composer, message flow, controls, accessibility, responsive behavior, and regression gates.
trigger_phrases:
  - 'Claude-style Pi Remote chat hierarchy'
  - 'mobile composer interaction states'
  - 'message-flow implementation priorities'
importance_tier: normal
contextType: planning
version: 1.2.0.3
---

# Senior Mobile Product-Design Council: Pi Remote Chat UX

> Pre-SvelteKit design research, retained for context. It describes the earlier React app, not the shipped Svelte UI.

## Decision

Pi Remote should optimize first for Claude iOS-style composure: a quiet transcript, a dominant bottom composer, and compact controls that are available without sitting in the reading path. The current screen exposes the right capabilities but presents them as implementation rows: `RuntimeStrip`, `CommandPalette`, and `prompt-composer` stack above each other, creating chat clutter exactly where Claude keeps the UI calm.

The redesign should keep the fixed parchment/ink/clay system, existing security posture, current React + React Aria stack, virtualization, relay-filtered commands, host-confirmed runtime state, and no heavy dependencies.

### Reference Hierarchy

- **Claude iOS is the authority** for silhouette and hierarchy: centered model header, serif assistant prose, compact user turns, quiet actions, disclaimer, and the floating composer.
- **ChatGPT is a secondary behavior reference** for the stable circular action that changes between voice, send, stop, and loading, plus reader-controlled live-edge behavior.
- **Kimi is a secondary information-design reference** for fitting agent activity, tools, and generated objects into a conversational turn without making the screen read like a developer log.
- When references conflict, choose Claude's calmer reading experience and Pi Remote's host-confirmed/security-constrained behavior; do not blend all three visual systems.

## Ranked Implementation Plan

### Priority A: COMPOSER / INPUT

Highest leverage. The composer is the main mobile product surface, and the current one looks like a web form rather than a native chat object.

1. Create a single `SessionComposer` component that owns the current `prompt-composer`, `CommandPalette`, and visible runtime affordances.
   - Source landing zone: split from `Session` in the former React entry.
   - Preserve existing behavior from `sendPrompt`, `stopRun`, `useRuntime`, and `useCommands`.
   - Acceptance: the session screen has one bottom anchored composer object, not separate visible rows for model, effort, Build/Plan, command input, textarea, helper text, and buttons.

2. Replace the framed label/textarea/footer form with a Claude-style rounded composer tray.
   - Visual shape: pill-to-card hybrid, 16-24px corner radius, parchment surface, subtle hairline, soft raised shadow, sticky above `env(safe-area-inset-bottom)`.
   - Internal structure: first row is the growing text area; second row is icon controls left and send/voice/stop controls right.
   - Place the quiet disclaimer `Pi can make mistakes. Check important work.` immediately above the tray; it scrolls with neither the transcript nor the textarea and must meet muted-text contrast in both themes.
   - Remove visible "Steer Pi" label and keyboard instruction text from the default view; keep accessible labels and hints through `aria-label`, `aria-describedby`, and button titles.
   - Acceptance: at 390px wide, the composer reads like one native mobile control with thumb-sized buttons, not a boxed form.

3. Relocate runtime and command controls into composer-adjacent controls without losing capabilities.
   - `+` button opens a compact `ComposerToolsMenu` sheet/popover with:
     - `Commands`, which opens the current relay-filtered `CommandPalette` catalog and inserts text without submitting; typing `/` as the first draft character opens the same palette above the composer for keyboard-first use;
     - `Run mode`, which opens the Build/Plan control;
     - `Attach`, only when a real attachment path exists; never show a dead affordance.
   - A centered model-name button plus chevron in the session header opens `RuntimeModelSheet`.
     - Replace the visible `Model · Claude Opus 4.8` row.
     - Show the host-confirmed model as the exact center title, for example `Claude Opus 4.8`; keep the back control at left and a single overflow/settings control at right so the title remains optically centered.
     - Move Inbox/Review navigation back to the parent screen and theme selection to the app/settings surface; neither belongs in the chat header.
     - Keep `RuntimeStrip` host-confirmed selected values and no optimistic commits.
   - Effort lives as a secondary section inside `RuntimeModelSheet`, not as a permanent composer chip. The sheet shows model first and `Effort: High` below it, opening `RuntimeEffortSheet` or an inline radio group.
   - Build/Plan moves to a two-state segmented item inside `ComposerModeMenu`, reached through `+` > `Run mode`.
     - Build stays visually implicit. When Plan is active, show one compact `Plan · read-only` status chip beside `+`; the chip also reopens the mode menu.
     - `executing-plan` displays as `Plan running` and is disabled for mode changes until host state is ready.
   - Acceptance: the default composer contains only `+`, the textarea, mic when supported, and the circular primary action; all model, effort, Build/Plan, and slash-command abilities remain reachable in one or two taps without occupying transcript vertical space.

4. Define the send/voice/stop interaction exactly.
   - Empty idle composer: the circular right control is voice; a separate mic toggles dictation only when the platform capability is available.
   - Non-empty idle composer: the same circular control morphs to a send arrow; the mic remains a secondary action.
   - Running turn with empty composer: the circular control becomes stop; mic/dictation is hidden during the active turn.
   - Running turn with draft: show `Steer` as the primary arrow and expose `Later` in the overflow/long-press menu, not as a full-width button.
   - Sending state: freeze the textarea only while the exact submit awaits acknowledgement, show a small spinner in the circular control, then re-enable it; preserve draft recovery on failure.
   - Voice is capability-gated: unsupported browsers hide mic/voice rather than rendering dead buttons. A later voice implementation must use platform primitives and feed transcribed text through the same redacted prompt path; raw audio persistence and a new voice backend are outside this UI pass.
   - Acceptance: no state produces three text buttons in the composer; the primary action is always a single icon-sized target with a clear accessible name.

5. Implement multiline growth rules.
   - Textarea starts at one visual line, grows to 5 lines, then scrolls internally.
   - Return on mobile inserts a newline unless the platform keyboard exposes a send action; desktop keeps Enter to send and Shift+Enter newline.
   - Use the exact default placeholder `Reply to Pi`; while running, change it to `Steer Pi or send after this turn`.
   - Keep current trim-on-send, optimistic user block, retry submission id, and rejected prompt recovery.
   - Acceptance: a long prompt does not push the transcript offscreen or resize controls unpredictably.

### Priority B: CONVERSATION / MESSAGE FLOW

Second highest leverage. Current transcript semantics are solid, but visual treatment still shows too many cards and headers.

1. Introduce `TurnView` rendering over the existing `groupBlocksIntoTurns`.
   - Keep `groupBlocksIntoTurns` as the data boundary; do not mutate or drop typed blocks.
   - `TranscriptList` should virtualize turns or render rows with turn-level spacing, not make each typed evidence block look equally important.
   - Acceptance: a user prompt, assistant prose, and related evidence read as one conversation turn.

2. Treat assistant text as the hero content.
   - Assistant text: borderless prose, Source Serif display/body rhythm where appropriate, larger line-height, no visible "Assistant" header in the common case.
   - User text: compact clay/parchment bubble aligned to the trailing edge or indented right, max width around 70-78%, no timestamp header by default.
   - Timestamps move to long press, hover, or an overflow details popover.
   - Acceptance: Claude-style reading flow appears before tool/evidence chrome.

3. Move message actions to progressive disclosure.
   - The latest completed assistant reply shows its action row after prose settles; older rows become visible on hover, focus-within, tap, or long-press. Never show it while that reply is streaming.
   - Preserve the Claude order: copy, share, play, thumbs up, thumbs down, retry. Use local/platform capabilities for copy, Web Share with copy fallback, and speech playback; hide play when unavailable.
   - Thumbs and retry appear only when a real feedback or host-authorized rerun path exists. Retry must use the normal ticketed, revision-checked mutation path; it must never replay a prior mutation client-side. Do not render decorative or disabled fake actions.
   - Acceptance: only the latest settled reply keeps a visible row; older rows stay quiet until invoked, and keyboard and screen-reader users can reach every supported action.

4. Define evidence, thinking, and tools as subordinate to Claude-style prose.
   - Replace generic `Show +` with a meaningful, compact summary such as `Worked for 42s · 3 tools` plus a chevron; its label must describe what expanding it reveals.
   - Thinking summary: collapsed inline disclosure titled `Thinking` with a small status dot and one-line preview maximum.
   - Tool calls/results: grouped under `Used 3 tools` inside the same activity disclosure, collapsed by default except errors.
   - File diffs and plans: promoted cards within the assistant turn because they are decision artifacts, not routine evidence.
   - Usage: hide under turn details or session details; never show as a full card in the main flow unless explicitly expanded.
   - Acceptance: routine telemetry no longer interrupts the assistant answer, while auditability remains available.

5. Improve streaming and live edge.
   - Keep reader-controlled live edge behavior already present in `TranscriptList`.
   - Replace "Agent working" block with a Claude-like inline generation marker under the current assistant turn.
   - Stream text deltas into the assistant prose area when available; when only settled blocks exist, show "Working" as a small inline status until the next block lands.
   - Replace the text-heavy `n new ↓` pill with a floating circular down-chevron above the composer. A small count badge is optional; the accessible name must say `Jump to 3 new messages` when a count exists.
   - Preserve `aria-live` announcements for completed blocks, but make visual status minimal.
   - Acceptance: active generation feels attached to the response, not like a separate status card.

6. Add inline attachment and artifact cards after turn hierarchy is stable.
   - Introduce `InlineAttachmentCard` for user-provided files and `ArtifactCard` for agent-created outputs, placed inside the owning turn rather than as detached transcript rows.
   - Show a compact thumbnail or file-type glyph, title, type/size or status, and one primary open/preview action; long metadata belongs in details.
   - Use parchment surface, hairline border, and restrained radius so cards read as embedded objects, not message bubbles. Errors stay inline and actionable.
   - Acceptance: an attachment or artifact is visibly associated with the turn that introduced it, is keyboard operable, and does not exceed the prose column on 320px screens.

## Component-Level Relocation

### Current Components

- `Session` currently owns session toolbar, title, transcript, runtime controls, command palette, composer, submit, stop, and draft recovery.
- `RuntimeStrip` exposes model, effort, Build/Plan, pending/status, and host-confirmed state.
- `CommandPalette` exposes filtered slash-command insertion.
- `TranscriptList` virtualizes flat blocks and uses `groupBlocksIntoTurns` only for spacing.
- `Block` renders every typed block with similar header/card emphasis.

### Target Components

- `SessionHeader`
  - Back button at left, centered model-name button plus chevron, and one session overflow/status affordance at right.
  - Model title tap opens `RuntimeModelSheet`; the current model remains host-confirmed during pending changes.
  - Freshness and agent state move into the overflow/status affordance or a quiet transient line, not a second app bar.
  - Keep topbar visually light on iPhone PWA, accounting for `env(safe-area-inset-top)`.

- `SessionComposer`
  - Props: prompt state, `canSubmit`, `status`, `connection`, `awaitingSnapshot`, `sendingPrompt`, `stopping`, `runtimeControls`, `commandCatalog`, `sendPrompt`, `stopRun`.
  - Owns the disclaimer, composer tray, `+` menu, contextual Plan chip, mic/dictation affordance, circular primary action, error line, and hidden accessible instructions.
  - Replaces the separate on-screen `RuntimeStrip` and `CommandPalette` rows.

- `RuntimeModelSheet`
  - Reuses model options from `RuntimeControls.runtime.models`.
  - Shows provider/model labels, current selection, a secondary Effort section, pending state, stale/error state, and refresh action.
  - Writes only through `setModel`; no optimistic label.

- `RuntimeEffortSheet`
  - Reuses `availableThinkingLevels` and `setThinkingLevel`.
  - Disabled if no host-confirmed state or no supported levels.

- `ComposerModeMenu`
  - Build/Plan toggle using `setMode`.
  - Shows Build as default and Plan as an explicit read-only mode.
  - Disabled during `pending`, `checking`, `stale`, `error`, or missing state.

- `ComposerCommandMenu`
  - Uses `useCommands` data.
  - Opens from `+` > `Commands` or when `/` is the first character in the draft.
  - Selecting a command inserts `/${name} ` into the draft and returns focus to the textarea.
  - Never submits a command by selection.

- `InlineAttachmentCard` / `ArtifactCard`
  - Renders an attachment or generated artifact within its owning turn with title, type/status, preview glyph, and supported open/share action.
  - Uses existing redacted data only; no new upload or mutation lane is implied by the visual component.

- `TurnView`
  - Receives one turn from `groupBlocksIntoTurns`.
  - Renders `UserBubble`, `AssistantProse`, `TurnEvidenceStack`, and `TurnActionRow`.

- `TurnEvidenceStack`
  - Groups `thinking`, `tool_call`, `tool_result`, `usage`, `plan`, and `file_diff` under turn-level hierarchy.
  - Errors and diffs can be expanded by default; routine tool success and usage remain collapsed.

- `TurnActionRow`
  - Renders the stable copy/share/play/thumbs/retry order after settlement and capability-gates each behavior.
  - Owns touch pinning, hover/focus reveal, accessible names, and local success feedback such as `Copied`.

- `ScrollToLatestButton`
  - Replaces the current text pill with a floating down-chevron above the composer and preserves the existing reader-owned live-edge logic.

## Composer Interaction Model

### Idle, Empty

- Placeholder: `Reply to Pi`.
- Left controls: `+` for commands/menu.
- Right controls: dictation mic when supported, then the circular voice button.
- Send is not visible because there is nothing to send.
- Disabled reason appears only when needed: offline, reconciling, relay unavailable.

### Idle, Draft Present

- Right control becomes send arrow.
- Accessible label: `Send message`.
- Tap sends with existing default behavior, no `streamingBehavior`.
- Desktop keyboard: Enter sends, Shift+Enter newline.
- Mobile keyboard: prefer newline Return; send arrow remains canonical.
- Dictation mic remains available when supported; voice-conversation mode yields to the send arrow as soon as the draft contains non-whitespace text.
- Draft remains locally editable until submit starts.

### Running, Empty

- Right control becomes stop.
- Accessible label: `Stop current turn`.
- Composer placeholder: `Steer Pi or send after this turn`.
- Stop uses current `abortPrompt` path and remains delivery-unknown aware.

### Running, Draft Present

- Primary action sends steer: `sendPrompt('steer')`.
- Secondary "send later" is in overflow or a press-and-hold send menu: `sendPrompt('followUp')`.
- The UI must make the distinction legible:
  - primary arrow label: `Steer now`;
  - overflow item: `Send after current turn`.
- Acceptance: users do not accidentally queue a follow-up when they intended to steer.

### Loading, Disabled, Error

- `connection !== 'live'`: textarea disabled, placeholder `Reconnect to send`; composer remains visible but subdued.
- `transcript.awaitingSnapshot`: disabled with compact inline message `Syncing`.
- `sendingPrompt`: the primary action shows a spinner and the textarea is briefly read-only until acknowledgement; on rejection, restore the exact draft and submission id for safe retry.
- Runtime `pending`: only the changed control shows pending; composer text input stays available if relay allows prompt submit.
- Runtime `stale`/`error`: runtime chips show warning state and open a sheet with `Refresh`; prompt send remains governed by connection/snapshot state, not runtime catalog state.

### Voice

- Empty draft switches the circular primary action to voice; any non-whitespace draft switches it to send/steer without moving the control.
- Dictation and voice must expose permission-requesting, listening, processing, denied, and unavailable states with visible plus announced feedback.
- If speech capture is not already implemented, capability-gate and hide it in the first release rather than ship a visual placeholder or dead control.
- Non-goal: adding voice transcription in this pass.

## Message-Flow Specification

### User Messages

- Compact bubble, clay-muted surface, trailing alignment on mobile.
- No persistent header.
- Timestamp/details available via tap/long-press or focus-visible action.
- Optimistic user prompt uses the same bubble with subtle pending opacity; rejected prompt removes bubble and restores draft exactly as current reducer does.

### Assistant Messages

- Borderless prose by default, visually closer to Claude than to a log viewer.
- Use generous paragraph rhythm and preserve whitespace.
- Keep max reading width; on iPhone use full content width minus gutters.
- Assistant identity is implied by placement and typography; only show label when needed for accessibility or mixed-role ambiguity.

### Turn Spacing

- Larger vertical gap before each new user turn.
- Smaller internal gaps between assistant prose and its evidence.
- Evidence cards indent under assistant content rather than spanning as unrelated cards.
- Avoid nested cards; use disclosures, hairlines, and subtle bands.

### Action Row Trigger

- Never appears on a streaming reply.
- The latest reply's row appears as soon as streaming settles so the feature is discoverable; older replies reveal it on pointer hover, focus within, tap, or long-press.
- Keep the action order stable: copy, share, play, thumbs up, thumbs down, retry. Omit any action without a real supported behavior; never leave a disabled decorative icon in the row.
- A touch tap pins the row for that turn until focus moves or another turn is selected.
- Must remain keyboard reachable with roving focus or normal tab stops.
- Minimum touch target: 44px.

### Streaming

- The active assistant turn owns the streaming indicator.
- If text deltas are present, append into the prose region.
- If only typed settled blocks are available, show inline `Working` below the last assistant/user turn.
- Keep current live-edge pill when the reader is away from bottom.
- Never auto-scroll if the reader has intentionally scrolled away.

### Evidence, Thinking, and Tools

- Thinking and routine tools share an `Activity` disclosure summarized as `Worked for 42s · 3 tools`; the label changes truthfully when duration or counts are unavailable.
- Thinking: collapsed, with a one-line preview only when the existing redacted summary provides one.
- Tool calls/results: grouped count, e.g. `Used 3 tools`; errors expanded and visually distinct.
- File diffs: promoted evidence card with filename/summary visible; patch expandable if long.
- Plan/todo: promoted card with checklist, but styled as part of the assistant turn.
- Usage: hidden in turn details/session details; default collapsed.

### Attachments and Artifacts

- User attachments sit immediately above or below their compact user bubble; assistant-created artifacts sit between the prose that introduces them and the action row.
- Cards show a preview/glyph, title, concise metadata or generation status, and one primary open action. Secondary share/download actions live in overflow.
- Loading, unavailable, redacted, and error states keep the same card footprint to avoid layout jumps during streaming.
- Cards never visually masquerade as ordinary chat bubbles and never expose unredacted paths or payloads.

## Top 5 Claude-Quality Details

1. **The composer silhouette and keyboard relationship:** one soft rounded object floating above the safe area, with no web-form label, helper copy, or full-width button.
2. **The centered model header:** host-confirmed model name plus chevron is the visual anchor; global navigation no longer competes with the conversation.
3. **Serif prose, sans-serif chrome:** Source Serif 4 makes assistant answers feel authored while Inter keeps user bubbles, evidence, actions, and controls precise.
4. **Quiet but exact state transitions:** the same circular control becomes voice, send, steer, spinner, or stop without shifting position, and the scroll-to-bottom affordance respects reader intent.
5. **Progressive disclosure with real labels:** message actions appear at the right moment, while `Worked for 42s · 3 tools` replaces generic `Show +` and keeps audit detail recoverable.

## Three Cheapest First Wins

1. Remove `RuntimeStrip` and `CommandPalette` from the transcript stack: put model in the centered header, and temporarily put effort, mode, and commands in one `+` menu before the final sheets are polished.
2. Restyle `prompt-composer` into a rounded bottom tray with `Reply to Pi`, one-line growth, an icon-sized primary action, and the small disclaimer; remove the visible label and keyboard helper.
3. Change assistant text to Source Serif 4 with no bubble/header, and relabel routine collapsed evidence from `Show +` to a truthful activity summary.

## Accessibility, WCAG, and PWA Checkpoints

- Maintain visible focus for every icon button, chip, menu item, disclosure, and sheet close action.
- Every icon-only control requires an accessible name: `Add command`, `Choose effort`, `Send message`, `Steer current turn`, `Stop current turn`, `Record voice`.
- Preserve current `aria-live` completion announcements, but avoid verbose announcements for every visual animation.
- Color contrast must pass in light, dark, and system themes using existing tokens only.
- Touch targets must be at least 44px on coarse pointers.
- Composer must account for `env(safe-area-inset-bottom)` and iOS keyboard viewport changes.
- Sheets/popovers must trap focus when modal and return focus to the invoking control on close.
- Reduced motion must disable morph/stream animations without hiding state.
- Offline/cache state must be clear without relying on color alone.

## Responsive / iPhone PWA Requirements

- 320px minimum width remains supported.
- At 390px and 430px iPhone widths, composer controls must not wrap into tall stacked text buttons.
- Landscape iPhone should cap composer growth and keep the transcript scrollable.
- Installed PWA mode must avoid bottom controls being hidden behind the home indicator.
- Header should collapse to icon/back + model/session title + one status affordance; avoid multiple text nav buttons on the session screen.
- Popovers that would be cramped on mobile should become bottom sheets.

## Dependency and Tradeoff Reasoning

- Keep React Aria. It already supports accessible Button, Select, Popover, ToggleButton, and disclosure patterns.
- Avoid adding animation, gesture, or bottom-sheet libraries. CSS transitions plus React Aria popovers/dialog patterns are enough.
- Do not change relay security or runtime authority. Runtime controls must continue to reflect host-confirmed state only.
- Do not add new command semantics. Command menu inserts text; submit path remains the existing prompt transport.
- Do not redesign the approval/review flows in this pass, except ensuring session header changes do not regress navigation to Inbox/Review.

## Acceptance Criteria

### Priority A Checkpoint

- At 320px, 390px, and 430px widths, the default session view shows one centered model header, the transcript, disclaimer, and one bottom composer tray; there are no standalone runtime or command rows.
- From the default chat screen, model is reachable in one tap and effort, Build/Plan, and commands in no more than two; each calls the same existing host-backed function and command insertion never submits.
- During a runtime mutation, the visible selection remains the last host-confirmed value and only the affected control reports pending.
- Empty, draft, running-empty, running-draft, sending, stopping, offline, reconciling, rejection, and runtime-stale states each have a distinct visible label/icon and accessible name.
- The tray clears the iPhone home indicator and software keyboard in portrait and landscape, never wraps controls at 320px, and passes WCAG contrast in light, dark, and system themes.

### Priority B Checkpoint

- Every fixture turn groups its user prompt, assistant prose, evidence, and artifacts without reordering or dropping a typed block.
- Assistant prose uses Source Serif 4, has no bubble or routine role/timestamp header, and remains within the reading width; user turns use compact trailing bubbles.
- Routine thinking, successful tools, and usage are collapsed under a descriptive activity label; tool errors, plans, diffs, and artifact cards remain visible in their owning turn.
- While generating, exactly one inline streaming/working indicator belongs to the active assistant turn; message actions appear only after it settles.
- The latest completed assistant reply exposes the supported action row, and every older row can be revealed and operated with touch, pointer, and keyboard.
- Scrolling away from the live edge prevents automatic jumps; new content instead produces one floating scroll-to-bottom control that returns focus predictably.

### Regression Gate

- Before implementation, capture the current 390px light/dark screenshots and confirm the known failure: standalone `Model`, `Effort`, `Build/Plan`, `/ command`, `STEER PI`, and full-width `Send` controls are visible in the message flow.
- After each sequence step, rerun the existing prompt, runtime, transcript, contrast, and accessibility tests; a step does not advance with a new failure.
- Final visual checks use the same seeded conversation at 320px, 390px, and 430px in light and dark, with idle, streaming, scrolled-away, Plan, offline, and keyboard-open states.
- Final DOM checks confirm there is one composer, one centered model trigger, no visible `STEER PI` or keyboard-helper copy, no generic `Show +`, and no unsupported action buttons.

## Non-Goals

- No new backend capability.
- No voice transcription implementation.
- No security posture change.
- No heavy dependency or design-system replacement.
- No speculative reaction/rerun/share features unless already supported by existing commands or local-only affordances.
- No rewrite of transcript projection semantics; this is a rendering and interaction pass.

## Recommended Build Sequence

1. Capture the failing baseline states and lock the regression matrix.
2. Extract `SessionComposer` while preserving current submit, steer, follow-up, stop, rejection, and reconciliation behavior.
3. Restyle the tray, add the disclaimer, exact placeholders, multiline growth, and circular primary-action state machine.
4. Replace the chat app bar with `SessionHeader`; move model into its centered sheet trigger and relocate global navigation/settings.
5. Move commands and Build/Plan into `ComposerToolsMenu`; place effort in `RuntimeModelSheet`; add the contextual Plan status chip.
6. Complete disabled/loading/error copy, focus return, announcements, and capability-gated mic/voice behavior.
7. Refactor transcript rendering around `TurnView` while keeping `groupBlocksIntoTurns` and virtualized performance.
8. Apply compact user bubbles, Source Serif 4 assistant prose, and inline streaming/live-edge behavior.
9. Group routine evidence under `TurnEvidenceStack`, promote errors/plans/diffs, and add inline attachment/artifact cards when their existing data is available.
10. Add the supported progressive message action row and run the full regression and device/theme matrix.
