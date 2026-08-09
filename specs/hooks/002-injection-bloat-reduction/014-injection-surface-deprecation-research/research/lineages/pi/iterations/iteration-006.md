# Iteration 6: Verification Pass — Claims Re-Checked, Injection Scan Completed

## Focus

End-to-end verification of the load-bearing claims behind the q5 dispositions: 037 fix status, Pi transform-handler inventory completeness, 013 dedup-extension feasibility, 004 shadow-only wiring, and the directives-only fallback emission path.

## Findings

### F1. 037 (gate-question noise) is functionally shipped — the checklist is fully green and the fix is in the code

- 037's checklist shows every item `[x]` including CHK-010 "Read-only turns never re-surface the question while gate is open", CHK-012 "Answer-attempt turns (letter without path) re-surface", CHK-022/023 live Pi smoke tests, CHK-FIX-001/004 core fix + fail-open. [SOURCE: specs/cli-external-orchestration/037-spec-gate-question-noise/checklist.md:45-101]
- The code confirms: `shouldSuppressGate3Delivery` (spec-gate-core.mjs:343-358) suppresses when state is open in the same session+epoch; the question text now invites path answers (`A) Use an existing spec folder (reply with its path...)` at spec-gate-core.mjs:117-120), resolving the answer-grammar defect. The 98% completion_pct is stale packet metadata.
- **Correction to iteration 5:** migration step 2 ("finish 037") should read "037 shipped; verify live on next sessions". The Gate-3 KEEP verdict stands, and its noise defect is already remediated in source.

### F2. The Pi per-turn [MSG] injection set is exhaustively confirmed — no missed surfaces

The full Pi extension inventory (`.pi/extensions/` + system-spec-kit hooks/pi): exactly two handlers return `{action:"transform"}` on `input` — `spec-gate-classify.ts:52` (Gate-3 question) and `goal-context.ts:62` (goal brief) — plus `prompt-advisor.ts` (advisor brief + dispatch directive). All other Pi extensions (dispatch-audit, dispatch-preflight-lint, git-preflight-advisory, mcp-route-guard, post-edit-quality, session-start/compact/stop-context, session-start-advisories, spec-gate-enforce) are tool-time [BLOCK]/[SYS]/[LOG]-equivalent. The iteration-1 inventory is complete; no continuity or dist-warning text is per-turn on Pi. [SOURCE: .pi/extensions/ listing, hooks/pi/ listing]

### F3. 013 dedup extension is feasible with the existing store

`decidePiDirectiveDelivery` already maintains `directiveDedupBySession: Map<sessionKey, deliveredDirectivesString>` with all guardrails (confirmed session, identical content, epoch, fail-open, kill-switch) (prompt-advisor.ts:246-283). Extending it to the headless fallback means storing the fallback block string under the same key when `splitPiDirectiveBrief` returns null (instead of returning FULL_PI_DIRECTIVE_DELIVERY unconditionally) and suppressing when the identical fallback string recurs in the same epoch. No new state machine needed; the 013 vitest suite (10/10 branch coverage) is the extension point. [SOURCE: prompt-advisor.ts:230-283, 013 implementation-summary.md:94]

### F4. 004 route-only remains shadow-only with no activation flag in the renderer

render.ts carries `ROUTE_ONLY_SHADOW_ID`, `ROUTE_ONLY_ESTIMATED_BYTES = 43`, a bounded shadow log, and `renderRouteOnlyAdvisorBrief` — but `renderAdvisorBrief` returns the legacy full render on every path (004 implementation-summary.md:76). No `SPECKIT_*` activation flag exists in render.ts for route-only delivery; activation would be a new, deliberately-gated change (007 evidence gate). This strengthens the migration-path framing: step 3 (activate 004) is a real decision point requiring the 007 negative controls, not a flag flip.

### F5. Directives-only fallback emission path re-confirmed

`brief ?? renderAdvisorFallbackDirective(renderOptions)` (claude user-prompt-submit.ts:272) fires on every turn where the advisor yields no recommendation — status/freshness failure, no passing recommendation, or instruction-shaped label (render.ts:417-438). The OpenCode bridge mirrors the directives locally (mk-skill-advisor-bridge.mjs:319-373) with its own fallback. The 767 B block is emitted verbatim on those turns across all runtimes; only Pi renders it visibly.

## Sources Consulted

- 037 checklist.md:45-101; spec-gate-core.mjs:117-120,343-358
- .pi/extensions/ + system-spec-kit/hooks/pi/ listings; goal-context.ts:62; spec-gate-classify.ts:52
- prompt-advisor.ts:230-283; 013 implementation-summary.md:94
- render.ts:88-101,214-236; 004 implementation-summary.md:76
- user-prompt-submit.ts:272; mk-skill-advisor-bridge.mjs:319-373

## Assessment

- **newInfoRatio: 0.35** — verification pass; new facts: 037 fully checked (F1 correction), exhaustive transform-handler inventory (F2), dedup-extension feasibility (F3), no activation flag for 004 (F4). No load-bearing claim of iterations 1-5 was contradicted.
- **Confidence:** high across the board.
- **All five key questions now have evidence-backed answers.** Quality guards: source diversity — 12+ distinct repo files across 4 spec packets, hook code, extension code, and live state files; focus alignment — all iterations traced to q1-q5; no single-weak-source dominance.

## Reflection

- What worked: re-running the exact code paths behind each disposition (F1-F5) — all held, one refinement (037 status).
- What failed: nothing material.
- Ruled out: any additional injection surface on Pi (F2 exhausts the inventory); any need for a new dedup state machine (F3).

## Recommended Next Focus

Iteration 7: Remaining-gap quantification for the convergence report — question-coverage accounting and marginal verification of the recommended end-state (post-migration Pi per-turn chain composition and 10-turn totals).
