---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Bring the "Pi Remote" mobile PWA's chat UI and UX really close to the Claude and GPT mobile apps, both the interaction UX and the visual UI styling in general. Pi Remote is an installable iPhone PWA (Vite + React 19 + Tailwind 4 + React Aria) that remote-controls the Pi coding agent over a Tailscale tailnet. The single live session is driven from a compose box; the transcript renders typed blocks (text, thinking, plan, tool_call, tool_result, file_diff, usage) with live streaming. RESEARCH GOAL: find concrete, adoptable improvements so the chat experience feels like a first-class modern AI app. Cover these four operator-requested capabilities in depth, plus overall chat UI/UX polish: 1. Easy model switching from the phone — how Claude, GPT, Cursor mobile, and similar apps expose a model picker (placement, affordance, in-conversation vs settings, showing the active model), and how to wire it to pi RPC model selection. 2. Easy effort / reasoning-level switching — how leading apps present thinking/effort tiers (e.g. a segmented control, a quick menu), and how to map to pi thinking levels. 3. Typed commands — a command input surface (slash commands and quick actions), discoverability, autocomplete, and how it maps to pi commands without weakening safety. 4. Tab-to-plan-mode — a fast toggle into read-only plan mode using the pi plan-mode extension (the --plan flag); how apps present a mode switch and keep it obvious which mode is active. Also study the general chat UI/UX and visual styling of the Claude and GPT apps and other strong references (message layout, streaming feel, spacing, typography, color, motion, input bar ergonomics, empty states, quick actions), and extract patterns worth adopting for Pi Remote's restrained-token, one-accent, light/dark, prefers-reduced-motion, React-Aria design. For each finding give: the source, the pattern, why it helps ease-of-use, and how to apply it concretely to Pi Remote's stack. Read the current implementation at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src (App.tsx, state.ts, relay.ts, attention.ts, style.css) and the design docs under /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs, plus the earlier UI/UX research at specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/research.md. Note: pi now runs in full-access desktop-parity mode per operator choice, but the transport keeps redaction and foreground-authority, so recommendations must fit the PWA + relay architecture.
- Started: 2026-08-15T07:07:00.000Z
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: fanout-grok45-1786777562169-s2n1hh
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1: In-session model switching placement and pi RPC wiring under redaction + foreground authority | - | 0.92 | 0 | complete |
| 2 | Q2: Effort/thinking-level switching mapped to pi set_thinking_level | - | 0.78 | 0 | complete |
| 3 | Q3: Typed slash commands discoverability and safe prompt-path mapping | - | 0.84 | 0 | complete |
| 4 | Q4: Plan-mode toggle via /plan extension with persistent mode chrome | - | 0.81 | 0 | complete |
| 5 | Q5: Claude/GPT chat visual polish transferable to restrained-token PWA | - | 0.72 | 0 | complete |

- iterationsCompleted: 5
- keyFindings: 125
- openQuestions: 10
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/10
- [ ] How should Pi Remote expose in-session model switching on iPhone (placement, active-model visibility, relay/RPC wiring) without breaking desktop-parity full-access mode or redaction? [analyst-strategy]
- [ ] How should effort / thinking-level switching be presented (segmented control vs menu) and mapped to pi thinking levels with clear active state? [analyst-strategy]
- [ ] How should typed slash commands / quick actions be discoverable and auto-completed while mapping safely to pi commands (no weaker safety boundary)? [analyst-strategy]
- [ ] How should a fast plan-mode toggle (--plan / plan-mode extension) be presented so active mode is always obvious, including exit back to agent mode? [analyst-strategy]
- [ ] Which Claude/GPT (and peer) chat UI/UX visual patterns transfer to Pi Remote's restrained-token, one-accent, light/dark, prefers-reduced-motion design? [analyst-strategy]
- [ ] Q1: How should Pi Remote expose in-session model switching on iPhone (placement, active-model visibility, relay/RPC wiring) without breaking desktop-parity full-access mode or redaction? [legacy-import]
- [ ] Q2: How should effort / thinking-level switching be presented (segmented control vs menu) and mapped to pi thinking levels with clear active state? [legacy-import]
- [ ] Q3: How should typed slash commands / quick actions be discoverable and auto-completed while mapping safely to pi commands (no weaker safety boundary)? [legacy-import]
- [ ] Q4: How should a fast plan-mode toggle (`--plan` / plan-mode extension) be presented so active mode is always obvious, including exit back to agent mode? [legacy-import]
- [ ] Q5: Which Claude/GPT (and peer) chat UI/UX visual patterns (layout, streaming, typography, input bar, empty states, motion) transfer to Pi Remote's restrained-token, one-accent, light/dark, prefers-reduced-motion design? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 10
- [ ] How should Pi Remote expose in-session model switching on iPhone (placement, active-model visibility, relay/RPC wiring) without breaking desktop-parity full-access mode or redaction?
- [ ] How should effort / thinking-level switching be presented (segmented control vs menu) and mapped to pi thinking levels with clear active state?
- [ ] How should typed slash commands / quick actions be discoverable and auto-completed while mapping safely to pi commands (no weaker safety boundary)?
- [ ] How should a fast plan-mode toggle (--plan / plan-mode extension) be presented so active mode is always obvious, including exit back to agent mode?
- [ ] Which Claude/GPT (and peer) chat UI/UX visual patterns transfer to Pi Remote's restrained-token, one-accent, light/dark, prefers-reduced-motion design?
- [ ] Q1: How should Pi Remote expose in-session model switching on iPhone (placement, active-model visibility, relay/RPC wiring) without breaking desktop-parity full-access mode or redaction?
- [ ] Q2: How should effort / thinking-level switching be presented (segmented control vs menu) and mapped to pi thinking levels with clear active state?
- [ ] Q3: How should typed slash commands / quick actions be discoverable and auto-completed while mapping safely to pi commands (no weaker safety boundary)?
- [ ] Q4: How should a fast plan-mode toggle (`--plan` / plan-mode extension) be presented so active mode is always obvious, including exit back to agent mode?
- [ ] Q5: Which Claude/GPT (and peer) chat UI/UX visual patterns (layout, streaming, typography, input bar, empty states, motion) transfer to Pi Remote's restrained-token, one-accent, light/dark, prefers-reduced-motion design?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▆▅▄▃▄▄▅▅▅▅▅▄▄▄▃▂▂▁
- score sparkline: █▇▆▅▄▃▄▄▅▅▅▅▅▄▄▄▃▂▂▁
- Last 3 ratios: 0.84 -> 0.81 -> 0.72
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.72
- coverageBySources: {"code":3}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Effort-only closed button that hides model name — fails F-003. (iteration 2)
- Hardcoded High/Medium/Low only — discards pi’s richer level set and model-specific availability. (iteration 2)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Follow up on: **Why ruled out:** Conflicts with one-accent token system and 044 anti-clutter; would make tool/plan/thinking blocks harder to parse.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
