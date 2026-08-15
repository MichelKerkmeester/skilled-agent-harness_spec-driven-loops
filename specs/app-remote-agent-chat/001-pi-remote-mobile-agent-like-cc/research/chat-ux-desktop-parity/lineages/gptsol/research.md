# Pi Remote Mobile Chat Parity — Final Research

## 1. Executive Summary

Pi Remote can feel materially closer to Claude and ChatGPT mobile without imitating either brand or weakening its security model. The highest-leverage change is a **composer-centered control dock backed by authoritative Pi state**, followed by a **turn-oriented transcript view that progressively discloses typed execution evidence**.

The recommended experience is:

- a quiet session header and conversational transcript;
- a sticky autosizing composer with `Model`, `Effort`, and `Build | Plan` context immediately above it;
- `/` autocomplete and one quick-actions button using a live, relay-filtered Pi command catalog;
- a persistent, host-confirmed `Plan · read-only` state;
- named streaming phases, a stable working group, and reader-position-aware `N new · Jump to latest`;
- user prompts as compact bubbles, assistant prose as borderless reading text, and tools/plans/diffs as typed disclosures;
- the existing one-accent OKLCH themes, 44px targets, safe-area support, focus rings, and reduced-motion behavior.

The sequencing matters. Do not build optimistic model/mode chips on top of the current browser state. First add a narrow typed relay control plane and a machine-readable plan-extension bridge; only then ship the visible controls.

## 2. Research Question and Scope

This research asks how Pi Remote can approach the interaction quality and restrained visual hierarchy of leading mobile AI apps while preserving its PWA/relay architecture, typed transcript, redaction, and foreground authority. It covers model selection, effort selection, typed commands, Plan mode, streaming, transcript hierarchy, composer ergonomics, empty states, styling, motion, and an implementation path.

The packet states that Pi now runs in full-access desktop-parity mode, with redaction and foreground authority retained. The inspected checkout still defaults `RpcSupervisor` to `--no-tools --no-extensions`, and its legacy setup docs describe the steering-only slice. This is a **confirmed source/deployed-direction mismatch**, not a reason to reverse the operator decision.

Before implementation, confirm the production source of Pi child arguments and verify that RPC mode loads the plan extension. The UI must not configure full access; it should consume the already-approved runtime posture and preserve redaction, mutation approval, ticketing, default-deny authorization, and single-live-session ownership.

## 3. Decision and Experience Blueprint

```text
Session · Live                                      Plan · read-only

  You
  ┌──────────────────────────────────────────────┐
  │ Review the auth changes and propose a plan.  │
  └──────────────────────────────────────────────┘

  Assistant
  I found two boundary issues and one stale test assumption…

  ▸ Worked for 28s · 5 steps
  ┌ Plan ─────────────────────────────────────────┐
  │ ○ Update request validation                   │
  │ ○ Add a negative-control test                 │
  └───────────────────────────────────────────────┘

                    [3 new · Jump to latest]

  [Sonnet 4.5] [High]                 [Build | Plan]
  ┌──────────────────────────────────────────────┐
  │ Describe what to investigate and plan…   [■] │
  └──────────────────────────────────────────────┘
    [+ Commands]
```

This is a presentation layer over the existing typed transcript. It does not replace stable block ids, revisions, virtualization, replay, redaction, or synchronization.

## 4. Model Switching

### Source and pattern

- ChatGPT's June 2026 mobile model picker is at the top of the conversation and expresses choices as understandable speed/reasoning bands. Its iOS app also supports long-press Send for a one-off model choice. [OpenAI release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)
- Claude places the active model and effort next to Send and applies changes to the next response without leaving the conversation. [Claude model, effort, and thinking settings](https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings)
- Cursor's iOS app lets the operator pick a frontier model when launching/controlling an agent from the phone. [Cursor iOS changelog](https://cursor.com/changelog/ios-mobile-app)
- Pi RPC already exposes `get_state`, `get_available_models`, `set_model`, and `cycle_model`. [Installed Pi `docs/rpc.md`:162,217,235,259]

### Why it improves ease of use

The model is part of the next-message decision, not an account preference. Keeping the active model visible near the draft removes navigation and uncertainty. A searchable sheet handles a large provider catalog without filling the composer with permanent controls.

### Concrete Pi Remote application

1. Show a persistent `Model · <short label>` chip in the runtime strip.
2. Open a searchable React Aria dialog/bottom sheet on press.
3. Populate it from live `get_available_models`; group by provider and optionally place host-derived recent/scoped models first.
4. Mark the host-reported model, display provider/model ids as secondary text, and never hard-code the catalog.
5. On selection, issue one ticketed `runtime.control` operation with the current runtime revision.
6. Show pending only on the selected row. Do not change the persistent chip optimistically.
7. Accept the Pi response, then reconcile the complete runtime state and available thinking levels.
8. On rejection or stale revision, preserve the prior model and offer Retry after refresh.

An optional later shortcut can mirror ChatGPT's long-press Send for a one-message override, but the first release should favor one persistent active model to keep host/session semantics simple.

## 5. Effort and Reasoning-Level Switching

### Source and pattern

- Claude exposes effort inside the conversation model menu and explains higher effort as a speed/token trade-off; thinking remains separately visible with a timer and expandable summary. [Claude settings](https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings)
- ChatGPT simplified its picker to task-oriented reasoning bands. [OpenAI release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)
- Pi RPC accepts `off`, `minimal`, `low`, `medium`, `high`, `xhigh`, and `max`, while `get_available_thinking_levels` returns only values supported by the active model. [Installed Pi `docs/rpc.md`:281–334]

### Why it improves ease of use

The operator can trade speed for depth at the moment it matters. Showing only valid levels avoids dead choices, and plain-language hints prevent the picker from becoming model-provider jargon.

### Concrete Pi Remote application

1. Show `Effort · <exact Pi level>` beside the model chip.
2. Open a compact single-select bottom sheet.
3. Render only `availableThinkingLevels` from the authoritative runtime projection.
4. Title-case the exact levels (`Off`, `Minimal`, `Extra high`) and add concise speed/depth copy.
5. Send `set_thinking_level` through the same ticketed, revision-checked control path.
6. After a model change, refresh available levels and surface any host-selected fallback as one reconciled update.

Do not compress Pi's seven values into a client-owned Low/Medium/High mapping. That loses capability detail and can become incorrect when models differ.

## 6. Typed Commands and Quick Actions

### Source and pattern

- Pi's TUI opens completion when `/` is typed. RPC `get_commands` returns extension, prompt-template, and skill commands, and leading-slash invocations go through `prompt`. Extension commands execute immediately even while streaming; `steer`/`followUp` do not accept them. [Installed Pi `docs/usage.md`:33] [Installed Pi `docs/rpc.md`:45–78,793–824]
- Cursor detects `/` in the chat input and lists available project commands; Cursor iOS explicitly supports slash commands. [Cursor commands](https://docs.cursor.com/en/agent/chat/commands) [Cursor iOS changelog](https://cursor.com/changelog/ios-mobile-app)
- React Aria supplies accessible dynamic collections, filtering, selection, overlays, and small-screen-friendly interaction primitives. [React Aria](https://react-spectrum.adobe.com/react-aria/getting-started.html) [ComboBox](https://react-spectrum.adobe.com/v3/ComboBox.html)

### Why it improves ease of use

Slash typing is fast for experts; a visible command button makes the same capability discoverable with one thumb. A shared catalog prevents two mental models. Inserting into the draft provides a review point and supports arguments.

### Concrete Pi Remote application

1. Add a compact command/plus button to the composer's left edge.
2. Typing `/` as the first non-whitespace character opens a filtered list above the composer or in a keyboard-safe sheet.
3. Rows show `/name`, description, and `Extension`, `Prompt`, or `Skill`.
4. Selection inserts `/name ` and returns focus to the textarea. It never submits automatically.
5. The visible quick-actions section references the same live catalog or safe draft templates; examples: `Plan`, `Summarize`, `Review changes`.
6. A relay `commands.list` action calls Pi `get_commands`, strips `path`, applies a server allowlist, and returns only display-safe descriptors.
7. Unknown extension commands default to hidden. Sensitive credential/session/reload/share/package commands require explicit policy decisions and usually stay unavailable remotely.
8. A ticketed `command.submit` revalidates command name and catalog revision, then uses Pi `prompt`. It preserves submission idempotency and delivery-unknown behavior.

Never expose `!`/`!!` shell-editor syntax as quick actions, and never provide a raw Pi RPC entry field.

## 7. Fast Plan Mode

### Source and pattern

- Cursor toggles Plan from the agent input, creates an editable plan, asks clarifying questions, and waits before building. Its broader mode picker distinguishes read-only Ask from full Agent. [Cursor Plan Mode](https://cursor.com/blog/plan-mode) [Cursor modes](https://docs.cursor.com/agent)
- Claude Code has an explicit `plan` permission mode. [Claude Code CLI reference](https://docs.anthropic.com/en/docs/claude-code/cli-usage)
- Pi's reference plan extension registers `--plan`, `/plan`, and a shortcut. It removes `edit`/`write`, restricts Bash through an allowlist, injects read-only instructions, persists state, extracts todos, and restores tools for execution. [Installed Pi `examples/extensions/plan-mode/index.ts` and `README.md`]

### Why it improves ease of use

A visible mode prevents the most consequential mobile error: believing the agent is only planning while it still has write authority. A thumb-reachable switch makes planning as fast as a keyboard shortcut, and a reviewable handoff prevents accidental execution.

### Concrete Pi Remote application

1. Place `Build | Plan` as a two-state control in the runtime strip; do not call it “Tab” in the mobile label.
2. When Plan is host-confirmed, reinforce it in three places: selected segment, `Plan · read-only` near the session title, and a subtly tinted composer with plan-specific placeholder.
3. Use `/plan` or a narrow extension bridge to switch the existing live session. `--plan` remains the cold-start default.
4. Change the UI only after the extension confirms state and the relay publishes a new runtime revision.
5. On reconnect, show `Mode · Checking…` until authoritative state arrives; never assume Build.
6. Adapt the extension to expose `build | plan | executing-plan`, captured prior tools, and read-only status in machine-readable form. Do not depend on TUI-only `ctx.ui.select` in RPC mode.
7. Render the typed plan block with `Refine` and `Build this plan`; the latter first confirms Plan is off and the prior tool set is restored, then submits execution.

The enforcement remains in Pi. A client-only toggle or “do not edit” prompt is explicitly rejected.

## 8. Chat UI, Streaming, and Visual Styling

| Finding | Source pattern | Why it helps | Pi Remote application |
|---|---|---|---|
| Turn-oriented hierarchy | Claude/ChatGPT privilege conversational messages; Cursor foregrounds task status and artifacts. Current Pi uses equal event cards. | The eye follows the conversation before supporting telemetry. | Group blocks by user turn; compact user bubble, borderless assistant text, nested typed evidence. |
| Signal-based disclosure | Claude thinking is expandable; Cursor surfaces plans, logs, and diffs contextually. | Routine tool noise stops competing with errors and decisions. | Collapse successful tool pairs/usage after settlement; keep errors, plans, approvals, and diffs prominent. |
| Named streaming phase | Claude shows a Thinking timer. | Reassures the operator and explains whether Pi is reasoning, using a tool, or writing. | Stable `Thinking · 12s`, `Running tests · 34s`, `Writing response`; collapse to `Worked for…` when settled. |
| Reader-controlled live edge | Prior Pi research rejects force-scroll; stable block ids support safe anchors. | The operator can inspect a diff without being dragged away. | Follow only near bottom; otherwise freeze and show `N new · Jump to latest`. |
| Autosizing composer dock | ChatGPT consolidated mobile tools into a sheet; Claude keeps input/voice/stop compact. | More text area and fewer accidental taps on a crowded phone surface. | One rounded 1–6 line input, command button left, explicit Send/Steer/Stop right, runtime strip above. |
| Explicit touch dispatch | Modern mobile composers reserve Return for multiline entry. Earlier Pi research reached the same safety result. | Avoids sending unfinished remote instructions. | Touch Return inserts newline; Cmd/Ctrl+Enter is an optional hardware shortcut. |
| Immediate state feedback | ChatGPT immediately previews sent images and clarifies edit mode. | The operator knows what was accepted without losing the next draft. | Pending immutable submit snapshot plus new editable draft; exact Accepted/Rejected/Delivery unknown status. |
| Actionable empty state | ChatGPT centers the mobile composer when empty. | The first useful action is obvious. | Greeting + current runtime context + three fill-draft actions; never auto-submit. |
| Quiet response actions | ChatGPT mobile exposes secondary actions through long press. | Persistent icon rows do not clutter every message. | Long press/overflow on settled turns for Copy, Retry, Edit-and-resend; tool sections only Expand/Collapse. |
| Restrained visual system | Pi already has one accent, OKLCH themes, focus rings, safe areas, 44px targets, and reduced motion. | Consistency feels more native than a cosmetic rebrand. | Remove decorative timeline rail, reduce session-heading scale, use 16px body/~1.6 line-height and 8/12/16/24 rhythm; reserve cards for evidence. |
| Functional motion | React Aria supports robust interaction state; Pi globally honors reduced motion. | State changes remain understandable without visual churn. | Short sheet/row/live-edge transitions only; no token animation, continuous pulse, or moving settled content. |

## 9. System Model and Invariants

```ts
interface RuntimeStateDto {
  sessionId: string;
  revision: number;
  model: { provider: string; id: string; label: string } | null;
  thinkingLevel: string;
  availableThinkingLevels: readonly string[];
  mode: 'build' | 'plan' | 'executing-plan' | 'unknown';
  streaming: boolean;
  updatedAt: string;
}

type RuntimeOperation =
  | { type: 'set_model'; provider: string; modelId: string }
  | { type: 'set_thinking_level'; level: string }
  | { type: 'set_mode'; mode: 'build' | 'plan' };

interface RuntimeControlCommand {
  type: 'runtime.control';
  controlId: string;
  sessionId: string;
  expectedRevision: number;
  operation: RuntimeOperation;
  ticket: string;
}

interface CommandDescriptorDto {
  name: string;
  description: string | null;
  source: 'extension' | 'prompt' | 'skill';
  enabled: boolean;
  disabledReason: string | null;
  requiresConfirmation: boolean;
}
```

### Boundary rules

- Browser DTOs never contain command source paths, raw tool catalogs, secrets, or unredacted transcript content.
- Every runtime or command mutation consumes a one-use ticket, is rate-limited, has an idempotency id, and is serialized through `RpcSupervisor`.
- `expectedRevision` prevents a stale phone from overwriting newer runtime state.
- The relay validates selected model/thinking values against live Pi catalogs.
- The extension—not the browser—enforces Plan tool restrictions and restores exact prior tools.
- Unknown route actions, runtime operations, and extension commands fail closed.
- State reads and sync projections remain redacted and session scoped.
- Delivery-unknown mutations never auto-retry.

## 10. Component and Integration Surface

| Component | Responsibility | Host dependency |
|---|---|---|
| `RuntimeStrip` | Persistent active model, effort, and mode | `RuntimeStateDto` |
| `ModelSheet` | Search/group live models; pending and check state | available models + `runtime.control` |
| `EffortSheet` | Exact supported thinking levels | available levels + `runtime.control` |
| `ModeSwitch` | Build/Plan transaction and obvious state | plan bridge + `runtime.control` |
| `CommandPalette` | Slash filtering and quick-actions discovery | safe `commands.list` |
| `ComposerDock` | Autosize, draft, explicit dispatch, Send/Steer/Stop | runtime/connection/prompt state |
| `TurnList` | Derived grouping over typed blocks | existing transcript blocks |
| `WorkingGroup` | Current phase and collapsed settled execution | block kind/revision/agent status |
| `LiveEdgeButton` | Reader-position-aware new-block recovery | virtualizer + stable block ids |
| `PlanCard` | Todos, Refine, Build handoff | plan blocks + runtime mode |

## 11. Recommendations and Adoption Order

### Phase 0 — Verify the runtime boundary

- Locate and test the deployed full-access Pi launch arguments.
- Confirm plan extension loading and behavior in RPC mode.
- Inventory what still speaks the legacy steering-only contract: setup docs, tests, fixtures, supervisor defaults, and installed clients.
- Record rollback: restore the prior verified Pi argument set and disable new UI controls if runtime projection cannot reconcile.

### Phase 1 — Authority and protocol

- Extend shared types and runtime guards for model/thinking queries, `RuntimeStateDto`, guarded runtime operations, command descriptors, and responses.
- Add runtime and command services, explicit policy actions, one-use ticket consumption, idempotency, stale-revision behavior, rate limits, and negative controls.
- Add the machine-readable plan-extension bridge.
- Publish runtime changes through the existing redacted sync path or an equivalently reconciled session-scoped channel.
- Prove the services with an unstyled harness/test client.

### Phase 2 — Mobile control dock

- Implement `RuntimeStrip`, model/effort sheets, `Build | Plan`, command palette, and autosizing composer with React Aria.
- Ship pending/ack/failure/reconnect behavior before styling refinements.
- Keep the old transcript renderer temporarily to isolate control-plane risk.

### Phase 3 — Transcript and streaming hierarchy

- Implement a pure `groupBlocksIntoTurns` view model.
- Add turn components, signal-based disclosure, named working phases, elapsed time, and live-edge control.
- Retain stable ids, revisions, virtualization, caches, sync barriers, and every typed renderer.

### Phase 4 — Physical-iPhone QA and polish

- Test installed PWA standalone mode, safe areas, software/hardware keyboards, rotation, VoiceOver, 200% text, dark mode, offline/reconnect, reduced motion, long transcripts, long model names, and large command sheets.
- Tune density after accessibility and keyboard behavior pass.
- Treat voice input as optional later work.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---:|
| Generic chat bubbles for every block | Erases plan/tool/diff/error/usage semantics. | Current typed projection and prior research | 1, 4 |
| Timeline card for every event | Gives low-signal telemetry equal visual weight and makes chat feel like a log viewer. | `App.tsx`, `style.css`, product comparison | 1, 4 |
| Settings-only model/effort | Hides the active next-response context. | Claude and ChatGPT in-conversation controls | 2 |
| Hard-coded model or effort catalogs | Drifts from provider and model capabilities. | Pi live catalog RPCs | 2 |
| Optimistic runtime chips | Can lie after failure, reconnect, or host reconciliation. | Existing ticket/reconciliation model | 1, 2, 5 |
| Lossy three-tier effort mapping | Obscures exact Pi levels. | Pi model-dependent thinking levels | 2 |
| Static/unfiltered slash catalog | Drifts and may expose host paths or privileged commands. | Pi `get_commands` includes source paths | 3 |
| Auto-submit command selection or quick action | Removes the argument/safety review point. | Pi command arguments and mobile compose safety | 3, 4 |
| Raw Pi RPC passthrough | Broadens the remote execution surface and weakens runtime validation. | Existing guarded union and default-deny policy | 2, 5 |
| Client-only/prompt-only Plan | Does not disable tools or survive reconnect. | Pi plan extension enforcement | 3, 5 |
| Spawn a second `--plan` session per request | Violates the single-live-session model. | Pi `/plan` in-session toggle | 3 |
| Keyboard-only Plan affordance | Is not reliably available on iPhone. | Cursor shortcut adapted to mobile | 3 |
| Force-scroll/token animation | Destroys review position and creates churn. | Prior live-edge research and virtualized transcript | 1, 4 |
| Plain Enter sends on touch | Causes accidental dispatch and blocks natural multiline input. | Current composer and prior compose research | 1, 4 |
| Permanent composer icon row | Crowds the phone surface; consolidated sheets are clearer. | ChatGPT mobile tool consolidation | 4 |
| Rebrand/multiple accents/glass-heavy UI | Conflicts with the existing restrained system without improving task flow. | Existing OKLCH token system | 1, 4 |
| Rewrite transcript storage for grouping | A derived view achieves hierarchy with far less risk. | Stable typed blocks and virtualizer | 5 |

## Divergence Map

- Saturated directions: none were marked saturated; each iteration addressed a distinct planned question.
- Pivots taken: none. The five-pass strategy remained valid.
- Evidence artifacts: five verified iteration narratives, five JSONL deltas, the findings registry, dashboard, and resource map in this lineage.
- Pivot failures and audited overrides: no failed pivots and no operator overrides. The requested max-iterations policy overrode any temptation to synthesize early; convergence remained telemetry.
- Remaining frontier: implementation-time confirmation of the deployed full-access Pi arguments, extension loading, and the exact plan-state bridge.

## 12. Open Questions

All five research questions are answered. One implementation-environment question remains: where the deployed full-access Pi argument/extension configuration is owned, because the inspected checkout still documents the older steering-only default. Confirming that location is Phase 0, not additional product research.

## 13. Existing Art Comparison

| Reference | Strongest transferable pattern | Intentional Pi Remote adaptation |
|---|---|---|
| ChatGPT mobile | In-conversation model context, consolidated tools sheet, immediate feedback | Persistent relay-backed model/effort chips and one commands button |
| Claude mobile | Composer-adjacent model/effort, thinking timer/disclosure, compact input/stop controls | Named typed-block phase, exact Pi levels, explicit Send/Steer/Stop |
| Cursor mobile/agent | Phone model choice, slash commands, visible plans/artifacts/diffs | Safe live command catalog, host-enforced Plan, typed evidence grouping |
| Pi TUI | Persistent model state, thinking signal, slash completion, shortcuts | Text-labeled chips/sheets and thumb controls instead of keyboard dependence |
| Existing Pi Remote | Typed projection, replay, redaction, tickets, one accent, reduced motion | Preserve the architecture and replace only presentation/control gaps |

## 14. Testable Acceptance Conditions

### Runtime controls

- Model, effort, and mode chips equal host state after success, rejection, reconnect, stale revision, and Pi restart.
- A model change refreshes supported thinking levels and never leaves an impossible combination visible.
- One mutation consumes exactly one ticket; replay with the same id returns the settled result or an explicit delivery-unknown state.
- Unknown operations and values fail closed and do not reach Pi.

### Commands

- `/` opens completion only in command position; filtering and VoiceOver announcements work.
- Selection inserts a draft and never submits.
- Descriptors contain no absolute paths or other redacted fields.
- Unknown/privileged extension commands are absent or explicitly disabled by server policy.
- Extension commands use Pi `prompt`; ordinary steering keeps its existing delivery behavior.

### Plan mode

- Host state—not local UI—controls the visible Plan label.
- In Plan, `edit`/`write` are unavailable and destructive Bash is blocked by the extension.
- Build restores the exact active tool set captured before Plan, including custom tools.
- Reconnect/resume restores `plan` or `executing-plan` correctly.
- `Build this plan` cannot dispatch execution until Build/full tools are host-confirmed.

### Composer and transcript

- Touch Return creates a newline; explicit Send/Steer/Later dispatches.
- The action control and runtime strip remain visible above the iPhone keyboard and bottom safe area.
- Rejected submissions restore the exact draft; delivery-unknown never auto-retries.
- Scrolling away from the live edge freezes position; `N new` counts meaningful block changes and returns reliably.
- Errors, plans, approvals, and diffs remain prominent after grouping; routine successful tool detail is recoverable.
- Existing redaction, prompt-idempotency, sync, replay, transcript, ticket, and default-deny tests remain green.

### Accessibility and motion

- All controls have visible labels/pressed/selected/pending state, 44px minimum targets, and logical focus order.
- VoiceOver announces model, effort, mode, command list, streaming phase, errors, and live-edge changes without token-level chatter.
- At 200% text, controls wrap without overlapping the composer or transcript.
- `prefers-reduced-motion` removes continuous/spatial animation while preserving immediate textual state changes.

## 15. Implementation Boundaries

- Research only: this lineage changes no Pi Remote application files.
- Preserve the PWA, one-live-session relay, redaction, foreground authority, one-use tickets, mutation approval, replay, and default-deny action policy.
- Use React 19, Tailwind 4/CSS tokens, React Aria, light/dark themes, one accent, safe areas, and reduced motion already present in the product.
- Confirm the production runtime posture before wiring controls; do not infer full access from a browser preference.
- Treat physical-iPhone PWA and VoiceOver testing as a release gate, not an optional visual review.

## 16. Trade-offs, Risks, and Convergence Report

| Iteration | Focus | New information ratio |
|---:|---|---:|
| 1 | Current implementation and architecture baseline | 0.92 |
| 2 | Model and reasoning-effort controls | 0.82 |
| 3 | Typed commands and plan-mode safety | 0.76 |
| 4 | Mobile chat hierarchy and interaction polish | 0.68 |
| 5 | Architecture, sequencing, and acceptance plan | 0.51 |

The final rolling three-iteration mean was `0.650`, above the configured `0.05` convergence threshold. Per the requested `max-iterations` stop policy, convergence was telemetry only and the loop completed all five iterations. Stop reason: `maxIterationsReached`. All five planned questions are answered; the remaining uncertainty is implementation-environment confirmation of the deployed full-access Pi arguments and plan-extension RPC bridge.

### Evidence quality, risks, and limitations

- Pi RPC and plan-mode claims come from the installed Pi 0.84.2 authored documentation/example source and are directly adoptable, subject to version confirmation in production.
- Pi Remote architecture claims come from the requested application source and design docs.
- ChatGPT, Claude, Cursor, and React Aria behavior claims use official product/help/docs sources current at research time.
- Official product docs do not publish proprietary padding, typography, or color specifications. Numeric visual guidance here is an explicit implementation inference based on Pi Remote's existing tokens and established mobile readability, not a claim of pixel equivalence.
- Cursor's documented desktop Plan interaction is a strong reference; older web/mobile material did not prove that exact toggle was available on mobile at that time. Pi Remote's recommendation is its own mobile adaptation.

## 17. References

### Pi Remote and Pi

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/state.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/relay.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/attention.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/packages/pi-rpc-protocol/src/types.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/packages/pi-rpc-protocol/src/guards.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/rpc/supervisor.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/prompt/prompt-service.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/http/server.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/auth/policy.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs`
- `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md`
- `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/usage.md`
- `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md`
- `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/examples/extensions/plan-mode`
- `specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/research.md`

### Official product and framework sources

- [ChatGPT release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)
- [ChatGPT Android app FAQ](https://help.openai.com/en/articles/8142208-chatgpt-android-app-faq)
- [Claude model, effort, and thinking settings](https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings)
- [Claude voice mode](https://support.claude.com/en/articles/11101966-use-voice-mode)
- [Claude Code CLI reference](https://docs.anthropic.com/en/docs/claude-code/cli-usage)
- [Cursor iOS mobile app](https://cursor.com/changelog/ios-mobile-app)
- [Cursor commands](https://docs.cursor.com/en/agent/chat/commands)
- [Cursor modes](https://docs.cursor.com/agent)
- [Cursor Plan Mode](https://cursor.com/blog/plan-mode)
- [Cursor planning](https://docs.cursor.com/en/agent/planning)
- [React Aria](https://react-spectrum.adobe.com/react-aria/getting-started.html)
- [React Spectrum ComboBox](https://react-spectrum.adobe.com/v3/ComboBox.html)
