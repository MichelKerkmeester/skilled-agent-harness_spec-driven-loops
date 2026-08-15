# Pi Remote Desktop-Parity Chat UX — Deep Research Synthesis

> **Deep-research fan-out run** — 2 CLI lineages × 5 iterations (10 total), executors `cli-cursor` (`cursor-grok-4.5-high`, label `grok45`) and `cli-codex` (`gpt-5.6-sol`, high, label `gptsol`), concurrency 2, session `fanout-research-047`, generation 1.
> Stop policy: `max-iterations` (convergence threshold 0.05 was telemetry-only; convergence mode `default`).
> [SOURCE: file:specs/cli-external-orchestration/047-pi-remote-desktop-parity-chat-ux/research/deep-research-config.json]
>
> **Topic:** bring the "Pi Remote" mobile PWA's chat UI and UX close to the Claude and GPT mobile apps — both interaction UX and visual styling — for model switching, effort/reasoning switching, typed commands, tab-to-plan-mode, and overall chat UI/UX polish, grounded in the current implementation and prior 044 UI/UX research. This research is **research-only**: it does not proceed to implementation.

---

## 1. Executive Summary

Pi Remote's session surface today is a strong typed-block transcript plus a minimal compose box (**Send only**). It has **no model picker, no effort control, no slash command surface, and no plan-mode chrome** — even though the pi child already exposes the missing capabilities over RPC (`get_available_models`/`set_model`, `get_available_thinking_levels`/`set_thinking_level`, `get_commands`, and `/plan` via the plan-mode extension). The gap is almost entirely **protocol forwarding + composer UX**, not agent invention.

Both lineages converge on the same adoption model, with the sequencing mattering:

1. **Composer-centered control dock backed by authoritative Pi state** — a sticky strip with `[Model ▾] [Effort ▾] [Build | Plan] … [Send]` immediately above the composer, always showing the active model short label. [F-002, F-019, gptsol §4/§8]
2. **Relay-forward model + thinking RPCs** — allowlisted phone→relay→child commands (`runtime.control`), ticketed and revision-checked, with redacted active labels projected into session chrome. [F-004, F-007, gptsol §9]
3. **Slash typeahead + quick chips** — `/` completion and one commands button fed by a live, relay-filtered `get_commands` catalog; selection inserts into the draft, never auto-submits. [F-010–F-012, gptsol §6]
4. **Plan toggle + persistent warning pill** — `Build | Plan` two-state control via `/plan`/extension bridge, host-confirmed on/off, `Plan · read-only` badge; never a second `--plan` session. [F-014–F-018, gptsol §7]
5. **Transcript and visual polish** — turn-oriented hierarchy (user bubble / assistant prose / typed evidence disclosures), named streaming phases, reader-position-aware live edge, calm empty state, and restrained one-accent motion. [F-020–F-023, gptsol §8]

Every recommendation preserves Pi Remote's security boundaries: redaction everywhere, mutation approval-gated, foreground authority, content-free push, single live session. No recommendation offers a raw-value reveal, a second weaker authority, or a client-only (unenforced) plan mode.

---

## 2. Background

Pi Remote is an installable iPhone PWA (Vite + React 19 + Tailwind 4 + React Aria) that remote-controls one `pi --mode rpc` child over a Tailscale tailnet. The single live session is driven from a compose box; the transcript renders typed blocks (text, thinking, plan, tool_call, tool_result, file_diff, usage) with live streaming. Operator choice: **full-access desktop-parity mode**; the transport keeps redaction and foreground authority. Prior packet 044 (`specs/cli-external-orchestration/044-pi-mobile-ui-ux-research`) covered multi-surface IA, transcript hierarchy, compose Send/Steer/Later, review, and attention. This packet focuses on **chat controls and visual parity** with Claude/GPT-class apps.

Current compose: textarea + Send; session chrome shows agent running/idle only. Thinking/plan exist as transcript block kinds, not as mode/effort controls.

**Confirmed source/deployed-direction mismatch (Phase 0 blocker):** the inspected checkout still defaults `RpcSupervisor` to `--no-tools --no-extensions`, and its legacy setup docs describe the steering-only slice, while the operator has chosen full-access desktop-parity. This is a confirmed direction mismatch, not a reason to reverse the operator decision — but implementation must first locate and test the deployed full-access Pi launch arguments and confirm the plan extension loads in RPC mode.

---

## 3. Objectives (answered)

| ID | Question | Verdict |
|----|----------|---------|
| Q1 | In-session model switching | Composer-adjacent Menu; forward `get_available_models` / `set_model`; keep history; never hide model nick behind effort-only |
| Q2 | Effort / thinking levels | Sibling chip; dynamic `get_available_thinking_levels`; discrete select > cycle on phone; exact Pi levels, no lossy 3-tier mapping |
| Q3 | Typed commands | `/` typeahead from `get_commands` + quick chips; same ticketed `prompt.submit` path; redact source paths |
| Q4 | Plan-mode toggle | Dedicated `Build | Plan` toggle → `/plan`; persistent warning pill; host-confirmed; `--plan` for cold start only |
| Q5 | General chat polish | Sticky dock strip, turn hierarchy, named streaming phases, empty-state chips, token-preserving typography/motion |

## 4. Methodology

Two detached CLI fan-out lineages ran 5 iterations each under `stopPolicy: max-iterations` (convergence telemetry only). Evidence came from Pi Remote sources (`App.tsx`, `state.ts`, `relay.ts`, `attention.ts`, `style.css`, `pi-rpc-protocol`, relay supervisor/prompt-service/auth policy, feature-catalog, security docs), the 044 synthesis, installed Pi official docs (`rpc.md`, `usage.md`, `extensions.md`, plan-mode example extension), and official Claude/ChatGPT/Cursor/React Aria product and help sources. Both lineages independently read the same implementation and reference set; their syntheses agree on the control-dock model and the relay-forward wiring. The merged findings registry holds 145 key findings across 10 iterations with 0 reconstruction gaps.

---

## 5. Findings by capability

### 5.1 Model switching (Q1)

| ID | Pattern | Why it helps | Pi Remote apply |
|----|---------|--------------|-----------------|
| F-001/F-002 | No model UI today; leading apps put the model control next to send | Operators cannot see/change answering model; one-thumb mid-chat switch with history intact | Add always-visible model nick; React Aria Menu by Send |
| F-003 | Keep model name visible (Cursor negative lesson) | Effort-first closed state loses glanceability | Closed button = model nick, not "High" |
| F-004 | pi RPC `set_model` / `get_available_models` / `get_state` | Capability exists; protocol gap | Extend protocol + relay forward; redacted labels only |
| F-005 | Ruled out: Settings-only primary | Hides active model while steering | In-composer primary |
| gptsol | Searchable bottom sheet, host-driven, no optimistic chips | Large provider catalog without crowding composer | `Model · <short label>` chip; sheet from live catalog; ticketed `runtime.control` with expectedRevision; pending only on selected row |

**RPC sketch:** `{"type":"set_model","provider":"anthropic","modelId":"…"}` after `get_available_models`. Disable while non-live / awaitingSnapshot (same as compose-box guards). On rejection or stale revision, preserve the prior model and offer Retry after refresh.

### 5.2 Effort / thinking (Q2)

| ID | Pattern | Why it helps | Pi Remote apply |
|----|---------|--------------|-----------------|
| F-006 | Sibling effort chip | Frequent changes without losing model identity | `[Model][Effort][Plan][Send]` |
| F-007 | Dynamic levels from child | Avoid unsupported tiers | Refresh on model change; hide if only `off` |
| F-008 | Discrete select > cycle on phone | Cycles hide destination | Menu with checked current level |
| F-009 | Effort ≠ thinking Disclosure | Reading preference ≠ compute | Keep 044 Disclosure defaults |
| gptsol | Exact Pi levels, plain-language hints | Preserve capability detail; avoid dead choices | Title-case exact levels (`Off`, `Minimal`, `Extra high`); never compress to Low/Medium/High |

**Levels:** `off|minimal|low|medium|high|xhigh|max` via `set_thinking_level` / `get_available_thinking_levels`.

### 5.3 Typed commands (Q3)

| ID | Pattern | Why it helps | Pi Remote apply |
|----|---------|--------------|-----------------|
| F-010 | `get_commands` + `/name` via prompt | Single source of truth with desktop | Relay `commands.list`; insert/submit `/name` |
| F-011 | Mobile typeahead + quick chips | Claude Code mobile fails without autocomplete | ListBox on `/`; 2–4 allowlisted chips |
| F-012 | Same ticketed `prompt.submit` | No second weaker authority | No separate execute verb; redact paths; approvals unchanged |
| F-013 | Defer mid-prompt `/` | v1 complexity on iOS | Start-of-input only |
| gptsol | Relay filters catalog; descriptors carry source kind + confirmation flag; selection inserts, never submits | Safety review point preserved | Strip `path`; server allowlist; unknown/privileged commands hidden; ticketed `command.submit` revalidates then uses Pi `prompt` |

**Safety invariant:** Slash is still prompt text through the existing ticket/single-flight path. Never expose `!`/`!!` shell-editor syntax as quick actions, and never provide a raw Pi RPC entry field.

### 5.4 Plan mode (Q4)

| ID | Pattern | Why it helps | Pi Remote apply |
|----|---------|--------------|-----------------|
| F-014 | Extension `/plan` + `--plan` flag | Read-only tool set without new RPC verb | Ensure extension loaded; toggle sends `/plan` |
| F-015 | Persistent mode badge | Never ambiguous under full-access | Warning pill `Plan · read-only`; placeholder copy change |
| F-016 | Labeled toggle > Shift+Tab | Touch-first | React Aria `ToggleButton`; label `Build | Plan`, not "Tab" |
| F-017 | Explicit exit + host confirm | Avoid stuck-on/stuck-off | Pill until relay confirms; `Mode · Checking…` on reconnect |
| F-018 | Ruled out: new `--plan` session per request | Breaks single-session product | In-session toggle only |
| gptsol | Machine-readable plan-extension bridge | RPC mode cannot depend on TUI-only `ctx.ui.select` | Expose `build | plan | executing-plan`, captured tools, read-only status; `Build this plan` confirms Plan off + tools restored before execution |

The enforcement remains in Pi. A client-only toggle or "do not edit" prompt is explicitly rejected.

### 5.5 General chat polish (Q5)

| ID | Pattern | Why it helps | Pi Remote apply |
|----|---------|--------------|-----------------|
| F-019 | Sticky bottom dock + control strip | Matches Claude/GPT ergonomics | Two-row footer on narrow widths |
| F-020 | Turn hierarchy + calm streaming | Scannable agent transcripts | Spacing + live-edge from 044; reduced-motion safe pulse |
| F-021 | Empty state as capability runway | Teaches new controls | Chips fill drafts / send allowlisted `/` |
| F-022 | Hierarchy via weight/surface, not new colors | Stays one-accent | User raised / assistant flat / meta muted |
| F-023 | 2–3 intentional motions | Presence without slop | Focus ring, plan pill, jump-to-latest |
| gptsol | Named streaming phase, reader-position live edge, autosizing composer dock, immediate state feedback, quiet response actions | Reassures operator; no force-scroll; fewer accidental taps | `Thinking · 12s` → `Worked for…`; `N new · Jump to latest`; 1–6 line input; pending immutable submit + new draft; long-press for Copy/Retry/Edit-and-resend |

---

## 6. Consolidated wiring map (PWA + relay)

```text
Phone UI                      Relay (allowlisted)              Pi RPC child
─────────                     -------------------              ------------
Model Menu  ──runtime.control / model.list/set ──► get_available_models / set_model
Effort Menu ──runtime.control / thinking.list/set ► get_available_thinking_levels / set_thinking_level
/ typeahead ──commands.list──────────────────────► get_commands
/plan chip  ──prompt.submit("/plan") / ext bridge ► prompt (plan-mode extension)
Send/Steer  ──prompt.submit (existing)───────────► prompt / steer
Plan pill   ◄── status/session projection ──────── extension setStatus / get_state
```

**Non-negotiables:** opaque ids only on the wire to the phone; no API keys; no raw paths in command sourceInfo; every runtime/command mutation consumes a one-use ticket, is rate-limited, has an idempotency id, and is serialized through `RpcSupervisor`; `expectedRevision` prevents stale overwrites; mutation tools still hit the approval card; push stays content-free; unknown operations fail closed; delivery-unknown mutations never auto-retry.

---

## 7. Relationship to 044 research

Reuse without re-litigating: two-root IA, turn-oriented transcript, Send/Steer/Later, live edge, content-free attention, React Aria disclosures. This packet **adds** the missing composer control strip and RPC forwards so the chat feels like a first-class AI app while remaining a remote control for one pi session. Prior 044 compose guidance (Return inserts newline, quick actions fill drafts only) is preserved and reinforced.

---

## 8. Open implementation risks (research → plan)

1. **Phase 0 — locate and test the deployed full-access Pi launch arguments.** The inspected checkout still documents the legacy steering-only default; confirm the production source of Pi child arguments and that RPC mode loads the plan extension.
2. Confirm live `get_state` fields for active model + thinking level nicknames.
3. Decide whether extension status entries are projected into the sync ledger today; if not, add a redacted mode flag to session card DTO.
4. Rate-limit model/thinking switches (same class as prompt submit).
5. Hardware-keyboard cycle shortcuts are optional progressive enhancement only.

## 9. Recommendations and adoption order

### Phase 0 — Verify the runtime boundary
Locate/test deployed full-access Pi args; confirm plan extension loading in RPC mode; inventory what still speaks the legacy steering-only contract (setup docs, tests, fixtures, supervisor defaults, installed clients); record rollback.

### Phase 1 — Authority and protocol
Extend shared types + runtime guards for model/thinking queries, `RuntimeStateDto`, guarded `runtime.control`, command descriptors; add runtime/command services, one-use tickets, idempotency, stale-revision handling, rate limits, negative controls; add the machine-readable plan-extension bridge; publish runtime changes through the existing redacted sync path.

### Phase 2 — Mobile control dock
Implement `RuntimeStrip`, model/effort sheets, `Build | Plan`, command palette, autosizing composer with React Aria; ship pending/ack/failure/reconnect behavior before styling; keep the old transcript renderer temporarily to isolate control-plane risk.

### Phase 3 — Transcript and streaming hierarchy
Pure `groupBlocksIntoTurns` view model; turn components, signal-based disclosure, named working phases, elapsed time, live-edge control; retain stable ids, revisions, virtualization, caches, sync barriers, every typed renderer.

### Phase 4 — Physical-iPhone QA and polish
Test installed PWA standalone mode, safe areas, software/hardware keyboards, rotation, VoiceOver, 200% text, dark mode, offline/reconnect, reduced motion, long transcripts, long model names, large command sheets; tune density after accessibility/keyboard pass; voice input optional later work.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Lineage(s) |
|---|---|---|---|
| Generic chat bubbles for every block | Erases plan/tool/diff/error/usage semantics | Current typed projection; 044 findings | grok45, gptsol |
| Timeline card for every event | Gives low-signal telemetry equal weight; log-viewer feel | `App.tsx`, `style.css`, product comparison | gptsol |
| Settings-only model/effort | Hides the active next-response context | Claude/GPT in-conversation controls | both |
| Hard-coded model or effort catalogs | Drifts from provider/model capabilities | Pi live catalog RPCs | both |
| Optimistic runtime chips | Can lie after failure/reconnect/host reconciliation | Existing ticket/reconciliation model | both |
| Lossy 3-tier effort mapping | Obscures exact Pi levels | Pi model-dependent thinking levels | gptsol |
| Static/unfiltered slash catalog | Drifts; may expose host paths or privileged commands | Pi `get_commands` includes source paths | both |
| Auto-submit command selection / quick action | Removes the argument/safety review point | Pi command args; mobile compose safety | both |
| Raw Pi RPC passthrough | Broadens remote execution surface | Existing guarded union; default-deny policy | gptsol |
| Client-only/prompt-only Plan | Does not disable tools or survive reconnect | Pi plan extension enforcement | both |
| Second `--plan` session per request | Violates single-live-session model | Pi `/plan` in-session toggle | both |
| Keyboard-only Plan affordance | Not reliably available on iPhone | Cursor shortcut adapted to mobile | gptsol |
| Force-scroll / token animation | Destroys review position; churn | 044 live-edge research; virtualized transcript | both |
| Plain Enter sends on touch | Accidental dispatch; blocks multiline input | Current composer; 044 compose research | both |
| Permanent composer icon row | Crowds phone surface | ChatGPT mobile tool consolidation | gptsol |
| Rebrand / multiple accents / glass-heavy UI | Conflicts with restrained system | Existing OKLCH token system | both |

## Divergence Map

- **Saturated directions:** none marked saturated; each iteration addressed a distinct planned question.
- **Pivots taken:** none. The five-question strategy remained valid across both lineages.
- **Evidence artifacts:** 10 verified iteration narratives, 10 JSONL deltas, per-lineage findings registries, dashboards, resource maps; merged registry (`deep-research-findings-registry.json`) with 145 key findings and `fanout-attribution.md`.
- **Pivot failures and audited overrides:** no failed pivots, no operator overrides. The requested `max-iterations` policy overrode any temptation to synthesize early; convergence remained telemetry.
- **Remaining frontier:** implementation-time confirmation of the deployed full-access Pi arguments, extension loading, and the exact plan-state bridge (Phase 0).

## 12. Open Questions

All five research questions are answered in synthesis. One implementation-environment question remains: where the deployed full-access Pi argument/extension configuration is owned, because the inspected checkout still documents the older steering-only default. Confirming that location is Phase 0, not additional product research.

## 13. Convergence Report

| Field | Value |
|-------|-------|
| Stop reason | `maxIterationsReached` |
| Total iterations | 10 (2 lineages × 5) |
| newInfoRatio trend | grok45: 0.92 → 0.78 → 0.84 → 0.81 → 0.72; gptsol: 0.92 → 0.82 → 0.76 → 0.68 → 0.51 |
| Questions answered | Q1–Q5 answered in synthesis (both lineages) |
| Convergence threshold | 0.05 (telemetry-only under max-iterations stop policy) |
| Merged findings | 145 key findings, 0 reconstruction gaps |
| Divergence summary | No divergent pivots; single five-question frontier |

## 14. References

- Pi Remote: `apps/pi-remote-web/src/{App.tsx,state.ts,relay.ts,attention.ts,style.css}`, `packages/pi-rpc-protocol/src/{types.ts,guards.ts}`, `apps/pi-remote-relay/src/{rpc/supervisor.ts,prompt/prompt-service.ts,http/server.ts,auth/policy.ts}`, `docs/**`
- Installed Pi: `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/{rpc.md,usage.md,extensions.md}`, `examples/extensions/plan-mode`
- Prior: `specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/research.md`
- Claude model/effort: [usingclaude guide](https://usingclaude.com/en/guides/features/claude-app-model-effort-thinking-settings) · [Claude settings](https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings)
- ChatGPT: [GPT-5 help](https://help.openai.com/en/articles/11909943-gpt-5-) · [release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)
- Cursor: [iOS mobile app](https://cursor.com/changelog/ios-mobile-app) · [commands](https://docs.cursor.com/en/agent/chat/commands) · [modes](https://docs.cursor.com/agent) · [Plan Mode](https://cursor.com/blog/plan-mode)
- Claude Code: [permission modes](https://code.claude.com/docs/en/permission-modes) · [CLI reference](https://docs.anthropic.com/en/docs/claude-code/cli-usage)
- React Aria: [getting started](https://react-spectrum.adobe.com/react-aria/getting-started.html) · [ComboBox](https://react-spectrum.adobe.com/v3/ComboBox.html)
- Mobile slash gaps (negative lessons): [claude-code#32051](https://github.com/anthropics/claude-code/issues/32051) · [#56204](https://github.com/anthropics/claude-code/issues/56204)
