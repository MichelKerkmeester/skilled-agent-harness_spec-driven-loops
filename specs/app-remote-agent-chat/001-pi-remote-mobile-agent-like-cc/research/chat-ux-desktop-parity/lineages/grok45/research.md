# Pi Remote Desktop-Parity Chat UX — Deep Research Synthesis (grok45)

> **Deep-research detached fan-out lineage** — 5 iterations, executor `cli-cursor` (`cursor-grok-4.5-high`), session `fanout-grok45-1786777562169-s2n1hh`, generation 1.
> Stop policy: `max-iterations` (convergence threshold 0.05 was telemetry-only).
> Artifact dir: `specs/cli-external-orchestration/047-pi-remote-desktop-parity-chat-ux/research/lineages/grok45`
>
> **Topic:** Bring Pi Remote’s chat UI/UX close to Claude and GPT mobile apps — model switching, effort/reasoning switching, typed commands, plan-mode toggle, plus general chat polish — on Vite + React 19 + Tailwind 4 + React Aria, with PWA relay redaction and foreground-authority preserved under full-access desktop-parity.

---

## 1. Executive Summary

Pi Remote’s session surface today is a strong typed-block transcript plus a minimal compose box (**Send only**). It has **no model picker, no effort control, no slash command surface, and no plan-mode chrome**. The pi child already exposes the missing capabilities over RPC (`set_model`, `set_thinking_level`, `get_commands`, `/plan` via the plan-mode extension). The gap is almost entirely **protocol forwarding + composer UX**, not agent invention.

**Adoption order (phone-first):**

1. **Composer control strip** — sticky dock with `[Model ▾] [Effort ▾] [Plan] … [Send]` (F-019, F-006, F-015).
2. **Relay-forward model + thinking RPCs** — allowlisted phone→relay→child commands; project redacted active labels into session chrome (F-004, F-007).
3. **Slash typeahead + quick chips** — `get_commands` inventory; invoke only via ticketed `prompt.submit` (F-010–F-012).
4. **Plan toggle + warning pill** — `/plan` extension path; host-confirmed on/off; never dual-session `--plan` (F-014–F-018).
5. **Visual polish** — turn spacing, empty-state chips, restrained motion; keep one-accent tokens (F-020–F-023).

Every recommendation preserves: redaction everywhere, mutation approval-gated, foreground authority, content-free push, single live session.

---

## 2. Background

Pi Remote is an installable iPhone PWA remote-controlling one `pi --mode rpc` child over Tailscale. Operator choice: full-access desktop-parity mode. Transport still redacts and requires foreground authority. Prior packet 044 covered multi-surface IA, transcript hierarchy, compose Send/Steer/Later, review, and attention — this lineage focuses on **chat controls and visual parity** with Claude/GPT-class apps.

Current compose: textarea + Send; session chrome shows agent running/idle only. Thinking/plan exist as **transcript block kinds**, not as mode/effort controls.

---

## 3. Objectives (answered)

| ID | Question | Verdict |
|----|----------|---------|
| Q1 | In-session model switching | Composer-adjacent Menu; forward `get_available_models` / `set_model`; keep history; never hide model nick behind effort-only |
| Q2 | Effort / thinking levels | Sibling chip; dynamic `get_available_thinking_levels`; discrete select > cycle on phone |
| Q3 | Typed commands | `/` typeahead from `get_commands` + quick chips; same `prompt.submit` ticket path; redact source paths |
| Q4 | Plan-mode toggle | Dedicated Plan toggle → `/plan`; persistent warning pill; host-confirmed; `--plan` for cold start only |
| Q5 | General chat polish | Sticky dock strip, turn hierarchy, empty-state chips, token-preserving typography/motion |

---

## 4. Methodology

Five LEAF iterations under `stopPolicy: max-iterations`. Evidence from Pi Remote sources (`App.tsx`, `relay.ts`, `style.css`, `pi-rpc-protocol`, feature-catalog, security docs), 044 synthesis, pi official `rpc.md` + plan-mode extension, Claude/ChatGPT model-effort guides, Claude Code permission/plan-mode docs, Cursor plan/model-picker forum+docs, and Claude Code mobile slash-autocomplete issue reports (negative lessons).

---

## 5. Findings by capability

### 5.1 Model switching (Q1)

| ID | Pattern | Why it helps | Pi Remote apply |
|----|---------|--------------|-----------------|
| F-001 | No model UI today | Operators cannot see/change answering model | Add always-visible model nick |
| F-002 | Composer-adjacent picker (Claude/GPT) | One-thumb, mid-chat switch, history intact | React Aria Menu by Send |
| F-003 | Keep model name visible (Cursor negative lesson) | Effort-first closed state loses glanceability | Closed button = model nick, not “High” |
| F-004 | pi RPC `set_model` / `get_available_models` | Capability exists; protocol gap | Extend protocol + relay forward; redacted labels only |
| F-005 | Ruled out: Settings-only primary | Hides active model while steering | In-composer primary |

**RPC sketch:** `{"type":"set_model","provider":"anthropic","modelId":"…"}` after `get_available_models`. Disable while non-live / awaitingSnapshot (same as compose-box guards).

### 5.2 Effort / thinking (Q2)

| ID | Pattern | Why it helps | Pi Remote apply |
|----|---------|--------------|-----------------|
| F-006 | Sibling effort chip | Frequent changes without losing model identity | `[Model][Effort][Plan][Send]` |
| F-007 | Dynamic levels from child | Avoid unsupported tiers | Refresh on model change; hide if only `off` |
| F-008 | Discrete select > cycle on phone | Cycles hide destination | Menu with checked current level |
| F-009 | Effort ≠ thinking Disclosure | Reading preference ≠ compute | Keep 044 Disclosure defaults |

**Levels:** `off|minimal|low|medium|high|xhigh|max` via `set_thinking_level` / `get_available_thinking_levels`.

### 5.3 Typed commands (Q3)

| ID | Pattern | Why it helps | Pi Remote apply |
|----|---------|--------------|-----------------|
| F-010 | `get_commands` + `/name` via prompt | Single source of truth with desktop | Relay `commands.list`; insert/submit `/name` |
| F-011 | Mobile typeahead + quick chips | Claude Code mobile fails without autocomplete | ListBox on `/`; 2–4 allowlisted chips |
| F-012 | Same ticketed `prompt.submit` | No second weaker authority | No separate execute verb; redact paths; approvals unchanged |
| F-013 | Defer mid-prompt `/` | v1 complexity on iOS | Start-of-input only |

**Safety invariant:** Slash is still prompt text through the existing ticket/single-flight path. Extension commands may run during streaming per rpc.md — UI must not imply mutation auto-approval.

### 5.4 Plan mode (Q4)

| ID | Pattern | Why it helps | Pi Remote apply |
|----|---------|--------------|-----------------|
| F-014 | Extension `/plan` + `--plan` flag | Read-only tool set without new RPC verb | Ensure extension loaded; toggle sends `/plan` |
| F-015 | Persistent mode badge | Never ambiguous under full-access | Warning pill `Plan · read-only`; placeholder copy change |
| F-016 | Labeled toggle > Shift+Tab | Touch-first | React Aria `ToggleButton` |
| F-017 | Explicit exit + host confirm | Avoid stuck-on/stuck-off | Pill until relay confirms |
| F-018 | Ruled out: new `--plan` session per request | Breaks single-session product | In-session toggle only |

### 5.5 General chat polish (Q5)

| ID | Pattern | Why it helps | Pi Remote apply |
|----|---------|--------------|-----------------|
| F-019 | Sticky bottom dock + control strip | Matches Claude/GPT ergonomics | Two-row footer on narrow widths |
| F-020 | Turn hierarchy + calm streaming | Scannable agent transcripts | Spacing + live-edge from 044; reduced-motion safe pulse |
| F-021 | Empty state as capability runway | Teaches new controls | Chips fill drafts / send allowlisted `/` |
| F-022 | Hierarchy via weight/surface, not new colors | Stays one-accent | User raised / assistant flat / meta muted |
| F-023 | 2–3 intentional motions | Presence without slop | Focus ring, plan pill, jump-to-latest |
| F-024 | Ruled out: multicolor bubbles / glass / promo chips | Fights tokens + clutter | — |

---

## 6. Consolidated wiring map (PWA + relay)

```text
Phone UI                      Relay (allowlisted)              Pi RPC child
─────────                     -------------------              ------------
Model Menu  ──model.list/set───────────────► get_available_models / set_model
Effort Menu ──thinking.list/set────────────► get_available_thinking_levels / set_thinking_level
/ typeahead ──commands.list────────────────► get_commands
/plan chip  ──prompt.submit("/plan")───────► prompt (extension command)
Send/Steer  ──prompt.submit (existing)─────► prompt / steer
Plan pill   ◄── status/session projection ── extension setStatus / get_state
```

**Non-negotiables:** opaque ids only on the wire to the phone; no API keys; no raw paths in command sourceInfo; mutation tools still hit approval card; push stays content-free.

---

## 7. Relationship to 044 research

Reuse without re-litigating: two-root IA, turn-oriented transcript, Send/Steer/Later, live edge, content-free attention, React Aria disclosures. This lineage **adds** the missing composer control strip and RPC forwards so the chat feels like a first-class AI app while remaining a remote control for one pi session.

---

## 8. Open implementation risks (research → plan)

1. Confirm live `get_state` fields for active model + thinking level nicknames.
2. Confirm plan-mode extension is installed in the supervised child under desktop-parity boots.
3. Decide whether extension status entries are projected into the sync ledger today; if not, add a redacted mode flag to session card DTO.
4. Rate-limit model/thinking switches (same class as prompt submit).
5. Hardware-keyboard cycle shortcuts are optional progressive enhancement only.

---

## 9. Convergence report

| Field | Value |
|-------|-------|
| Stop reason | `max_iterations` |
| Iterations | 5 / 5 |
| newInfoRatio trend | 0.92 → 0.78 → 0.84 → 0.81 → 0.72 |
| Questions | Q1–Q5 answered in synthesis |
| Lineage | `grok45` / `fanout-grok45-1786777562169-s2n1hh` |

---

## 10. References

- Pi Remote: `apps/pi-remote-web/src/{App.tsx,relay.ts,style.css}`, `packages/pi-rpc-protocol/src/types.ts`, `docs/feature-catalog/**`, `docs/security.md`
- Prior: `specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/research.md`
- Pi: [rpc.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/rpc.md), [plan-mode extension](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/plan-mode/index.ts), [extensions docs](https://pi.dev/docs/latest/extensions)
- Claude model/effort: [usingclaude guide](https://usingclaude.com/en/guides/features/claude-app-model-effort-thinking-settings)
- Claude Code modes: [permission modes](https://code.claude.com/docs/en/permission-modes)
- ChatGPT picker: [OpenAI GPT-5.6 help](https://help.openai.com/en/articles/11909943-gpt-5-)
- Cursor Plan Mode: [learncursor](https://www.learncursor.dev/learn/cursor-agents/agent-plan-mode)
- Mobile slash gaps: [claude-code#32051](https://github.com/anthropics/claude-code/issues/32051), [#56204](https://github.com/anthropics/claude-code/issues/56204)

---

## 11. Lineage iteration index

| Iter | Focus | Ratio | Status |
|------|-------|-------|--------|
| 001 | Q1 model switching | 0.92 | complete |
| 002 | Q2 effort/thinking | 0.78 | complete |
| 003 | Q3 typed commands | 0.84 | complete |
| 004 | Q4 plan mode | 0.81 | complete |
| 005 | Q5 visual polish | 0.72 | complete |
