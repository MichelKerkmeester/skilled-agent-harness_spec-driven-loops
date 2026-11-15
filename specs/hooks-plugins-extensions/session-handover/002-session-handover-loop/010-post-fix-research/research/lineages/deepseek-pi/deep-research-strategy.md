---
title: Deep Research Strategy - Session Relaunch Loop After Phase 009
description: Focus tracking for the post-phase-009 drift, latent-bug and standards-alignment research on the session relaunch loop.
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Session Relaunch Loop After Phase 009

## 1. OVERVIEW

Lineage `deepseek-pi` of the `010-post-fix-research` packet. Five iterations, one focus each,
stop policy `max-iterations`. Findings already verified and fixed by phase 009 are out of scope:
see `specs/hooks/023-session-relaunch-loop/research/research.md` and
`specs/hooks/023-session-relaunch-loop/009-research-fixes-and-core-consolidation/implementation-summary.md`.

---

## 2. TOPIC
Session relaunch loop after phase 009: remaining drift between code, docs and spec records; latent bugs and edge cases, including any the phase 009 consolidation introduced; refinements; and alignment gaps against the sk-code-skilled surface standards and the sk-doc document standards.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [ ] Which decisions the phase 009 core consolidation moved into `lib/relaunch-core.cjs` still disagree with at least one adapter's call site, and what does each disagreement break?
- [ ] Which latent bugs or edge cases does `bin/session-relaunch.cjs` and the `.skilled/bin/skilled-loop` wrapper still carry after the phase 009 fixes?
- [ ] Where does the conformance suite or the per-adapter test suites assert less than they claim, leaving a behaviour unguarded?
- [ ] Which adapter-local behaviours still diverge across claude, codex, hermes, pi and the OpenCode plugin after the shared helpers landed?
- [ ] Which sk-code-skilled surface standards and sk-doc document standards remain unmet in the hook sources, the command doc and the packet records?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Re-reporting any finding already verified and fixed in phase 009.
- Implementing fixes: this run reports findings with evidence and a concrete fix.
- Live relaunch execution against a real runtime.

---

## 5. STOP CONDITIONS
- `config.stopPolicy` is `max-iterations`: run all five iterations regardless of newInfoRatio.
- Convergence below threshold is telemetry only; broaden the review angle instead of stopping early.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[Populated after iteration 1 completes]
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[Populated after iteration 1 completes]
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[Consolidated from iteration dead-end data]
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
[Populated after iteration 1 completes]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Iteration 1: the phase 009 core consolidation in `lib/relaunch-core.cjs` against its five adapter call sites.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Prior research verified thirteen defects plus seven doc-drift items before phase 009, and phase 009
fixed them with failing-first tests and a seven-case conformance table. What remains open is what the
consolidation itself introduced and what no test reaches.

### Bounded Context Snapshot

- Source pointers: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` (881 lines, the shared decisions), `lib/nudge.cjs` (509), `lib/killer.cjs` (655), `lib/context-usage.cjs` (254), `bin/session-relaunch.cjs` (626), `.skilled/bin/skilled-loop`, `opencode/session-relaunch.js` (359), `pi/session-relaunch.ts` (387).
- Adapters: `claude/stop-arm.mjs`, `claude/context-nudge.mjs`, `codex/stop-arm.mjs`, `codex/shared.mjs`, `codex/context-nudge.mjs`, `codex/prompt-seed.mjs`, `hermes/session-end-arm.mjs`, `hermes/context-nudge.mjs`.
- Tests: `tests/adapter-conformance.test.cjs` (315), `tests/relaunch-core.test.cjs` (1180), `tests/nudge.test.cjs` (1067), `tests/killer.test.cjs` (1875), `tests/skilled-loop.test.cjs` (1783), `tests/session-relaunch-cli.test.cjs` (1564), `tests/claude-adapters.test.cjs` (812), `tests/codex-adapters.test.cjs` (709), `tests/hermes-adapters.test.cjs` (493), `tests/context-usage.test.cjs` (316), `pi/session-relaunch.test.ts` (799), `.opencode/plugins/tests/session-relaunch.test.cjs`.
- Integration points: `/speckit:handoff` command doc, `README.md`, `tests/README.md`, `ENV-REFERENCE.md`, the catalog entry, `specs/hooks/023-session-relaunch-loop/spec.md` and `goal.md`.
- Constraints and risks: no live relaunch was run by phase 009; several fixes narrow paths only unit tests reach.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.1 (telemetry only under `max-iterations`)
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Current generation: 1
- Started: 2026-10-19T19:33:15Z
