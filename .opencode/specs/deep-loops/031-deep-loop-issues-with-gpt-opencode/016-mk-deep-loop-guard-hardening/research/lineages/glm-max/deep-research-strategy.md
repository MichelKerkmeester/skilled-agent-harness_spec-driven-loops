# Deep Research Strategy - Fan-out Lineage: glm-max

## 2. TOPIC

Investigate whether `.opencode/plugins/mk-deep-loop-guard.js` (a `tool.execute.before` OpenCode plugin currently checking single-dispatch mode-mismatch via `mode-registry.json`) can be extended to mechanically detect and optionally block repeated/loop-like orchestrate-to-command-owned-loop-executor dispatches (`deep-research`, `deep-review`, `deep-improvement`, `prompt-improver`), while still allowing exactly one legitimate bounded hand-off.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] Q1: Does the `@opencode-ai/plugin` SDK's `tool.execute.before` hook expose or allow persisting session-scoped state across multiple Task-tool calls within one session, or would this require external state (e.g. a temp file keyed by sessionID)? **ANSWERED (iter 1):** Yes — two proven mechanisms. In-process closure `Map<sessionID,...>` (3 sibling plugins) and external file `{hex(sessionID)}.json` (mk-goal.js).
- [x] Q2: What should 'loop-like' mean mechanically — e.g. same subagent_type dispatched N times within a session from the same caller — and what's a reasonable N/window that avoids false-positiving on legitimate retries? **ANSWERED (iter 1):** Same loop-executor agent identity (parsed from prompt) dispatched ≥3 times per session = block; N=2 = warn. subagent_type is always "general" so cannot be the discriminator.
- [x] Q3: Review cli-opencode/SKILL.md Agent Delegation section, orchestrate.md @deep-review Priority row, and deep-review.md Caller/coordinator contract to ground the design in the actual current dispatch paths. **ANSWERED (iter 2):** "Exactly one bounded hand-off" stated in 4 independent documents. Guard cannot attribute caller (command vs orchestrate) from args alone — iteration-state markers are the heuristic discriminator.
- [x] Q4: Review phase 012's benchmark-results.md for the exact GPT-5.5 enforcement-inconsistency evidence this hardening is meant to address. **ANSWERED (iter 2):** GPT refused deep-research direct dispatch but allowed deep-review — identical convention, inconsistent self-enforcement. This is the exact gap mechanical enforcement closes.
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do NOT implement the plugin changes — this is design-research only, producing options with trade-offs.
- Do NOT evaluate the single-dispatch mode-mismatch check (already shipped and working).
- Do NOT assess latency as a detection signal (phase 012 established latency is insufficient on its own).
- Do NOT design enforcement for cli-claude-code or other non-OpenCode runtimes.

---

## 5. STOP CONDITIONS

- Max iterations (2) reached.
- All 4 key questions have evidence-backed answers AND 2+ design options documented with trade-offs.
- Source diversity requirement met (SDK types + plugin source + 3+ contract docs + benchmark evidence).

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: SDK exposes sessionID per-call; in-process Map and external file both proven (iter 1)
- Q2: loop-like = same loop-executor dispatched ≥3 per session; prompt-parsed identity (iter 1)
- Q3: "Exactly one bounded hand-off" in 4 docs; guard cannot attribute caller; iteration-state markers are heuristic (iter 2)
- Q4: GPT-5.5 inconsistently enforced Command-only (refused research, allowed review) (iter 2)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- SDK type-definition reading: index.d.ts line 235-241 definitively answered the sessionID availability question (iter 1)
- Cross-referencing sibling plugins: mk-spec-memory, mk-code-graph, mk-skill-advisor all prove the in-process Map pattern; mk-goal proves external file pattern (iter 1)
- Grounding the N threshold in the actual contract (cli-opencode "exactly one bounded hand-off" + orchestrate §6 RETRY attempts 1-2) (iter 1)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[Populated from iteration dead-end data]
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[Populated after iteration 1]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

All 4 questions answered. Proceed to synthesis: compile research.md with 2+ design options, trade-offs, and false-positive risks. Convergence reached via maxIterations (stopPolicy: max-iterations).
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- Phase 012 benchmark-results.md documents the GPT-5.5 enforcement inconsistency this hardening addresses.
- The current `mk-deep-loop-guard.js` is a stateless `tool.execute.before` hook reading `mode-registry.json`.
- `cli-opencode/SKILL.md` §3 defines orchestrate as caller/coordinator only with one bounded hand-off.
- `orchestrate.md` §2 Priority table and NDP protocol govern dispatch depth and routing.
- `deep-review.md` defines the caller/coordinator contract for the leaf agent.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 2
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 15 minutes
- Progressive synthesis: true
- Fan-out lineage: glm-max (executor: cli-opencode model=zai-coding-plan/glm-5.2)
- Session ID: fanout-glm-max-1782925116331-6rt4hp
- Started: 2026-07-01T19:00:00Z
