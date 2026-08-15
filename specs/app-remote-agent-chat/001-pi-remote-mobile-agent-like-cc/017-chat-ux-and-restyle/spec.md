---
title: "Pi Remote Desktop-Parity Chat UX"
description: "Deep-research packet: bring the Pi Remote mobile PWA's chat UI/UX close to the Claude and GPT mobile apps — interaction UX and visual styling — including model switching, effort/reasoning switching, typed commands, tab-to-plan-mode, and general chat UI/UX polish."
trigger_phrases:
  - "pi remote chat ux"
  - "pi remote chat parity"
  - "model switching pi"
  - "effort reasoning switching"
  - "tab to plan mode"
  - "typed commands slash"
  - "pi remote desktop parity chat"
importance_tier: "normal"
contextType: "research"
---
# Pi Remote Desktop-Parity Chat UX

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Research |
| **Created** | 2026-08-15 |
| **Branch** | `skilled/0147-pi-remote-experience` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Pi Remote mobile PWA (installable iPhone PWA, Vite + React 19 + Tailwind 4 + React Aria) remote-controls the Pi coding agent over a Tailscale tailnet. The single live session is driven from a compose box; the transcript renders typed blocks (text, thinking, plan, tool_call, tool_result, file_diff, usage) with live streaming. The operator wants the chat experience to feel like a first-class modern AI app: easy model switching from the phone, easy effort/reasoning-level switching, typed commands, a fast toggle into read-only plan mode, and overall chat UI/UX polish benchmarked against the Claude and GPT mobile apps.

### Purpose
Research concrete, adoptable improvements so the Pi Remote chat experience matches the interaction UX and visual styling of the Claude and GPT mobile apps (plus Cursor mobile and other strong references), covering four operator-requested capabilities plus general chat UI/UX polish, with findings that state the source, the pattern, why it helps ease-of-use, and how to apply it concretely to Pi Remote's restrained-token, one-accent, light/dark, prefers-reduced-motion, React-Aria stack. Research-only; it does not proceed to implementation.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

<!-- DR-SEED:SCOPE -->
### In Scope
- Easy model switching from the phone (placement, affordance, in-conversation vs settings, active-model display, pi RPC model selection wiring)
- Easy effort / reasoning-level switching (thinking/effort tiers UI, mapping to pi thinking levels)
- Typed commands (slash commands and quick actions, discoverability, autocomplete, mapping to pi commands without weakening safety)
- Tab-to-plan-mode (fast toggle into read-only plan mode via the pi plan-mode extension / `--plan` flag; obvious active-mode indication)
- General chat UI/UX and visual styling (message layout, streaming feel, spacing, typography, color, motion, input bar ergonomics, empty states, quick actions)
- Benchmarking Claude mobile, GPT mobile, Cursor mobile, and other strong references
- Application strategy constrained to the PWA + relay architecture (redaction and foreground-authority preserved; pi runs in full-access desktop-parity mode)

### Out of Scope
- Implementation of any improvement (research only)
- Visual rebrand or design-token overhaul beyond concrete adoptions
- Removing or weakening the security posture (redaction, foreground authority, mutation approval-gating)
- Non-mobile (desktop/web) redesign
- Performance profiling or infrastructure work unrelated to the chat UX

### Files to Change
None (research-only packet). Evidence sources live under the Pi Remote app home:
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src` (App.tsx, state.ts, relay.ts, attention.ts, style.css)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs`
- Prior UI/UX research: `specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/research.md`

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

<!-- DR-SEED:REQUIREMENTS -->
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Produce research/research.md synthesizing findings across iterations with sources and application strategy | Findings cite sources or inference; each has an application path that preserves the security posture |
| REQ-002 | Benchmark Claude, GPT, Cursor mobile (and other strong references) for adoptable chat UX patterns | Each adopted pattern names its source, the pattern, why it helps ease-of-use, and how to apply it to Pi Remote |
| REQ-003 | Cover all four operator-requested capabilities in depth (model switching, effort/reasoning switching, typed commands, tab-to-plan-mode) | Findings map to concrete interaction and wiring paths in Pi Remote's stack |
| REQ-004 | Respect constraints: restrained tokens, one accent, light/dark, prefers-reduced-motion, React-Aria, PWA + relay architecture | No recommendation weakens redaction or foreground authority |
| REQ-005 | Research-only: do not implement changes | Packet ends at research/research.md; implementation is a separate follow-up |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Research yields a concrete, prioritized set of adoptable chat UI/UX improvements with source citations
- **SC-002**: Each operator-requested capability (model switching, effort switching, typed commands, tab-to-plan-mode) has concrete findings and application paths
- **SC-003**: Every recommendation states why it improves ease-of-use and how to apply it without weakening security
- **SC-004**: research/research.md exists with synthesized findings, convergence report, and references

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Recommending patterns that leak content (hints/redaction) | Weakens redaction posture | Benchmark content-free patterns; flag any leak risk explicitly |
| Risk | Model/effort switching UI that confuses or slows the operator | Hurts ease-of-use | Follow leading-app picker patterns; keep active state obvious |
| Risk | Typed-command surface weakening safety | Unsafe or unclear commands | Preserve redaction/authority; map commands to pi safely |
| Dependency | External reference apps | Pattern claims may be stale | Cite sources per finding; prefer official docs and verified references |
| Dependency | Pi RPC surfaces for model/thinking/plan-mode | Wiring claims must match reality | Read the current relay.ts/state.ts and pi docs before recommending |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How do Claude, GPT, and Cursor mobile expose a model picker, and how should Pi Remote surface the active model and wire selection to pi RPC model selection?
- How do leading apps present effort/reasoning tiers, and how should Pi Remote map a segmented control or quick menu to pi thinking levels?
- What is the right command input surface (slash commands and quick actions), how is it discovered and autocompleted, and how does it map to pi commands without weakening safety?
- How should tab-to-plan-mode present a fast toggle into read-only plan mode using the pi plan-mode extension (`--plan` flag), keeping the active mode obvious?
- Which general chat UI/UX and visual-styling patterns from Claude/GPT mobile (message layout, streaming feel, spacing, typography, color, motion, input bar ergonomics, empty states, quick actions) are worth adopting for Pi Remote's restrained design?

<!-- /ANCHOR:questions -->

---

## 8. RESEARCH CONTEXT

Deep research is active for this topic; `research/research.md` is canonical.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Fan-out deep-research synthesis (2 lineages × 5 iterations, 10 total; grok45 cli-cursor/cursor-grok-4.5-high, gptsol cli-codex/gpt-5.6-sol/high; 145 merged key findings; stop reason maxIterationsReached). Abridged from `research/research.md`.

- **Control dock first:** a sticky composer-adjacent strip `[Model ▾] [Effort ▾] [Build | Plan] … [Send]`, always showing the active model short label. [F-002, F-019, gptsol §4/§8]
- **Relay-forward RPCs:** allowlisted phone→relay→child model/thinking commands (`runtime.control`), one-use tickets, `expectedRevision`, rate-limited; project redacted active labels into session chrome. [F-004, F-007, gptsol §9]
- **Effort tiers:** sibling chip + single-select sheet with exact Pi levels (`off|minimal|low|medium|high|xhigh|max`) from `get_available_thinking_levels`; no lossy 3-tier mapping; refresh on model change. [F-006–F-009]
- **Typed commands:** `/` typeahead + one commands button from a relay-filtered `get_commands` catalog; selection inserts into the draft, never auto-submits; same ticketed `prompt.submit` path; strip source paths; unknown/privileged commands hidden. [F-010–F-013, gptsol §6]
- **Plan mode:** `Build | Plan` toggle via `/plan`/plan-extension bridge, host-confirmed on/off, persistent `Plan · read-only` pill, `--plan` for cold start only, machine-readable plan bridge (no TUI-only `ctx.ui.select`); never a second session. [F-014–F-018, gptsol §7]
- **Transcript/visual polish:** turn-oriented hierarchy (user bubble / assistant prose / typed evidence disclosures), named streaming phases (`Thinking · 12s` → `Worked for…`), reader-position `N new · Jump to latest`, autosizing composer dock, restrained one-accent motion. [F-020–F-023, gptsol §8]
- **Security preserved:** redaction, mutation approval, foreground authority, content-free push, single live session; no raw-value reveal, no second weaker authority, no client-only plan mode.
- **Phase 0 blocker:** locate/test the deployed full-access Pi launch arguments and confirm plan extension loads in RPC mode; the inspected checkout still documents the legacy steering-only default.
<!-- END GENERATED: deep-research/spec-findings -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
