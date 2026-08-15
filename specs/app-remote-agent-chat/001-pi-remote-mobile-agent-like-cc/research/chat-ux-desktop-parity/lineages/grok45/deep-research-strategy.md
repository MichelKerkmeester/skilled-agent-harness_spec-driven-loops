# Deep Research Strategy - Pi Remote Desktop-Parity Chat UX (grok45 lineage)

## 2. TOPIC

Bring the Pi Remote mobile PWA chat UI/UX close to Claude and GPT mobile apps: model switching, effort/reasoning switching, typed commands, plan-mode toggle, plus general chat visual/interaction polish — adoptable on Vite + React 19 + Tailwind 4 + React Aria with PWA relay redaction and foreground-authority constraints.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
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

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing product code in the Pi Remote app or relay (research-only).
- Weakening redaction, inventing a second mutation path, or making push/content-bearing notifications authoritative.
- Replacing the 044 multi-surface IA research; this lineage focuses on chat session controls + visual parity.
- Building a full desktop Claude/GPT clone (keep one-accent restrained tokens).
- Changing Tailscale / auth transport architecture.

---

## 5. STOP CONDITIONS

- `stopPolicy: max-iterations` — stop after 5 iterations regardless of early convergence telemetry.
- Early low newInfoRatio is telemetry only; broaden angles instead of synthesizing early.
- Halt if all four capability questions plus polish remain unanswerable after exhausting primary sources and current implementation evidence.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Effort-only closed button that hides model name — fails F-003. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Effort-only closed button that hides model name — fails F-003.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Effort-only closed button that hides model name — fails F-003.

### Hardcoded High/Medium/Low only — discards pi’s richer level set and model-specific availability. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Hardcoded High/Medium/Low only — discards pi’s richer level set and model-specific availability.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hardcoded High/Medium/Low only — discards pi’s richer level set and model-specific availability.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Effort-only closed button that hides model name — fails F-003. (iteration 2)
- Hardcoded High/Medium/Low only — discards pi’s richer level set and model-specific availability. (iteration 2)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Follow up on: **Why ruled out:** Conflicts with one-accent token system and 044 anti-clutter; would make tool/plan/thinking blocks harder to parse.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

resource-map.md not present at parent init; skipping coverage gate for this lineage.

### Bounded Context Snapshot

- Source pointers:
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/{App.tsx,state.ts,relay.ts,attention.ts,style.css}`
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/` (security, architecture, feature-catalog)
  - Prior research: `specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/research.md`
- Reuse candidates: 044 compose Send/Steer/Later; turn-oriented typed-block transcript; two-root IA (Sessions/Attention); content-free attention; React Aria Disclosure for thinking blocks.
- Integration points: `prompt-composer` in App.tsx; relay command tickets; typed blocks `thinking`/`plan`; feature-catalog `command-and-push`.
- Constraints: full-access desktop-parity mode (operator choice) but transport keeps redaction + foreground-authority; PWA iPhone; restrained tokens, one accent, light/dark, prefers-reduced-motion.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only under max-iterations stopPolicy)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output (lineage-local)
- Lifecycle: new detached fan-out lineage `grok45`
- Write containment: ONLY under `specs/cli-external-orchestration/047-pi-remote-desktop-parity-chat-ux/research/lineages/grok45`
- Session ID: `fanout-grok45-1786777562169-s2n1hh`
- Executor: cli-cursor / cursor-grok-4.5-high
- Current generation: 1
- Started: 2026-08-15T07:07:00.000Z
