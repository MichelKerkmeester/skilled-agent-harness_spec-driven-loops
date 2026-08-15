# Deep Research Strategy — Pi Remote Mobile Chat Parity

## 1. Overview

This lineage investigates adoptable interaction and visual patterns for making Pi Remote feel like a first-class mobile AI chat app while preserving its PWA, relay, redaction, and foreground-authority boundaries.

## 2. Topic

Bring the Pi Remote mobile PWA chat UI and UX close to Claude and GPT mobile apps, covering model switching, effort switching, typed commands, plan mode, and overall polish within the relay architecture.

<!-- ANCHOR:key-questions -->
## 3. Key Questions (remaining)

- [x] What does the current Pi Remote implementation already support, and where are the highest-value parity gaps?
- [x] How should phone-first model and effort controls be presented and mapped to Pi RPC state safely?
- [x] How should typed commands and a prominent read-only plan-mode toggle work without weakening transport or foreground-authority controls?
- [x] Which Claude, ChatGPT, Cursor, and adjacent mobile chat patterns materially improve transcript scanning, streaming, composer ergonomics, and empty states?
- [x] What phased, concrete design and implementation plan best fits React 19, Tailwind 4, React Aria, one accent, light/dark themes, restrained tokens, and reduced motion?
<!-- /ANCHOR:key-questions -->

## 4. Non-Goals

- Implementing application changes.
- Replacing the existing relay, redaction, foreground-authority, or single-live-session architecture.
- Recommending desktop-only hover interactions or visual effects that conflict with restrained tokens and reduced-motion support.
- Treating unofficial screenshots or third-party recreations as authoritative API or safety documentation.

## 5. Stop Conditions

- Complete exactly five evidence iterations because the operator selected `max-iterations`; convergence before iteration five is telemetry only.
- Stop early only for unrecoverable state corruption, a write-boundary conflict, or a security concern.

<!-- ANCHOR:answered-questions -->
## 6. Answered Questions

- Current baseline established: retain typed transcript semantics, relay authority, redaction, tokens, theme support, touch targets, and reduced-motion behavior; add a typed control plane, conversational hierarchy, mobile composer state, and live-edge behavior. (iteration 1)
- Model/effort controls established: use Pi `get_state`, live catalogs, acknowledged set commands, composer-adjacent active chips, and capability-dependent effort options. (iteration 2)
- Commands/plan controls established: project a redacted `get_commands` catalog, route extension commands through `prompt`, use `/plan` for in-session switching, and expose reconciled host-enforced mode state. (iteration 3)
- Chat-polish direction established: group by turn, collapse low-signal execution, name streaming phases, preserve reader position, and rebuild the composer as an autosizing context-aware dock. (iteration 4)
- Implementation order established: verify runtime posture, add authoritative projections and ticketed services, ship the control dock, restyle through a derived turn view, then complete physical-iPhone QA. (iteration 5)
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. What Worked

- Cross-reading source, transport, CSS, security docs, and prior research exposed both interaction gaps and non-negotiable authority constraints. (iteration 1)
- Targeted installed-Pi RPC docs plus current official product docs provided exact host mappings and current mobile placement patterns. (iteration 2)
- Targeted Pi command and plan-extension sources exposed the critical difference between UI affordance, RPC routing, and host-side enforcement. (iteration 3)
- Combining official mobile behavior with the existing typed projection exposed improvements that preserve semantics rather than copying pixels. (iteration 4)
- Tracing the existing prompt route provided a concrete template for policy, tickets, idempotency, serialization, projection, and negative controls. (iteration 5)
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. What Failed

- Broad documentation grep produced repeated authority statements; later passes should target control-plane symbols and primary product documentation. (iteration 1)
- Broad filesystem search crossed minified dependency artifacts; limit Pi research to authored package docs/source. (iteration 2)
- Broad search crossed other lineage artifacts; subsequent research must use explicitly scoped primary sources. (iteration 3)
- Official product docs do not publish pixel specifications; numeric styling guidance must remain explicitly inferred. (iteration 4)
- The inspected source still describes steering-only Pi launch arguments, so production full-access/extension state requires an implementation-time audit. (iteration 5)
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. Exhausted Approaches

- Generic chat bubbles: ruled out because they erase typed execution semantics. (iteration 1)
- Local-only model, effort, or plan preferences: ruled out because visible state could diverge from Pi. (iteration 1)
- Forced autoscroll on every delta: ruled out because it destroys review position. (iteration 1)
- Settings-only, hard-coded, optimistic, or lossy model/effort controls: ruled out because they hide or misstate live Pi state. (iteration 2)
- Static/autosubmitting command catalogs and prompt-only/local-only plan state: ruled out because they drift from or weaken the host contract. (iteration 3)
- Equal-card hierarchy, forced follow, plain-Enter touch dispatch, icon-row overload, and decorative rebranding: ruled out because they harm scanning or mobile ergonomics. (iteration 4)
- Raw RPC passthrough, unguarded combined payloads, TUI-only plan reuse, and transcript-storage rewrites: ruled out because narrower integration seams already exist. (iteration 5)
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. Ruled Out Directions

- Generic bubbles or equal-card timelines for every typed block.
- Local-only, optimistic, settings-only, hard-coded, or lossy runtime controls.
- Static/unfiltered command catalogs, auto-submit completion, shell quick actions, or raw RPC passthrough.
- Prompt-only/client-only Plan state, per-request Pi restarts, or keyboard-only Plan access.
- Force-scroll, token animation, plain-Enter touch dispatch, permanent composer icon rows, or decorative rebranding.
- Rewriting transcript storage when a derived turn view preserves the existing contract.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. Saturated Directions and Divergence Frontier

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: synthesis only; all five planned questions are answered
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. Carried-Forward Open Questions

- Implementation must confirm the deployed full-access Pi argument/extension configuration because the inspected checkout still documents the older steering slice.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. Next Focus

Complete. Final synthesis is in `research.md`; evidence inventory is in `resource-map.md`.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. Known Context

- Source pointers: `App.tsx`, `state.ts`, `relay.ts`, `attention.ts`, and `style.css` in the Pi Remote web app.
- Reuse candidates: typed transcript blocks, the single compose surface, connection/session status, redaction, and foreground-authority transport semantics.
- Integration points: Pi RPC messages, relay projection, React state, React Aria controls, and PWA-safe-area layout.
- Prior study: `specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/research.md`.
- Resource map: `resource-map.md` was not present at initialization; skipping the prior-inventory coverage gate.
- Code graph: unavailable at session start; file evidence is authoritative.

## 13. Research Boundaries

- Max iterations: 5
- Convergence threshold: 0.05
- Stop policy: max iterations
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Allowed write root: `specs/cli-external-orchestration/047-pi-remote-desktop-parity-chat-ux/research/lineages/gptsol`
- Current generation: 1
- Started: 2026-08-15T07:08:49Z
