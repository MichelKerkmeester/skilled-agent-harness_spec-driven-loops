# Iteration 5: Disposition Matrix & Migration Path (q5 core)

## Focus

Per-surface keep/deprecate/redesign verdicts with evidence weights, and a concrete migration path that respects the 002 program's measurement-first, evidence-gated discipline.

## Findings

### F1. The question's framing is incomplete — "proven" vs "unproven" is not the right axis for every surface

Evidence from iterations 1-4 supports three tiers, not two:
- **Tier A — proven, conditional, edge-triggered (keep):** Gate-3 question (behavioral mechanism = denial authority, 037 fixing its noise defect), advisor route line (in-vivo routing evidence, 42 B dynamic).
- **Tier B — opt-in / event-driven (keep, zero cost today):** active-goal briefs (no active goal exists), continuity briefs (389 B/session, purpose-built for context loss), dist-warning briefs (OpenCode-only, pre-risky-Bash).
- **Tier C — always-on constant per-turn text (redesign, not flat deprecate):** the three directives (767 B) and the Pi dispatch directive (554 B).

The always-on surfaces cannot be simply "deprecated" without a replacement because they exist to cover AGENTS.md absence on hook runtimes (render.ts:106 comment: "so all hook-capable runtimes receive the comment hygiene rule even when AGENTS.md is absent from session context") — but on Pi, AGENTS.md is ALWAYS in project context, so the marginal value on Pi is the lowest of any runtime while the visibility cost ([MSG]) is the highest. The durable rules live in the root doc by design (AGENTS.md:419: "this framework remains the durable source of the full rules").

### F2. Disposition matrix (evidence-weighted)

| # | Surface | Bytes | Frequency | Evidence of value | Verdict |
|---|---|---|---|---|---|
| 1 | Gate-3 question | 521 | once/session when mutating (defect: sticky re-ask, 037) | HARD BLOCK + [BLOCK] denial authority; live gate-state files | **KEEP**; finish 037 |
| 2 | Advisor route line | 42 | per-turn | in-vivo routing (this lineage); 12-hub routing backbone | **KEEP** |
| 3 | Active-goal brief | ≤4,800 | per-turn only when goal active | steering; opt-in | **KEEP** (zero cost today) |
| 4 | Continuity briefs | ~389/session | session boundaries | resume/compaction recovery | **KEEP** |
| 5 | Dist-warning brief | small | event-driven, OpenCode-only | stale-dist guard | **KEEP** |
| 6 | Three directives | 767 | **per-turn constant** | asserted reminder value only; 0/13 activation evidence; no behavioral negative control ever run | **REDESIGN → once/session + route-only repeats** |
| 7 | Pi dispatch directive | 554 | **per-turn constant** | Pi-critical (013 decision); 5 semantics mapped in 006; compact prototype disabled | **KEEP**; compact only when 006's 5-semantics proof passes |
| 8 | Directives-only fallback | 767 | per-turn whenever advisor yields no brief | guardrail presence | **REDESIGN → dedup must cover it** (currently skipped) |

### F3. Migration path (each step measurement-first, flag-gated, fail-open)

1. **Fix the 013 dedup gap (smallest, highest-ratio step).** Extend `decidePiDirectiveDelivery` to suppress the directive block on content-hash match even when the head is absent (the fallback case). All 013 guardrails already apply (confirmed session, identical content, same epoch, re-deliver on lifecycle/kill-switch). Files: `prompt-advisor.ts` `splitPiDirectiveBrief`/`decidePiDirectiveDelivery` (prompt-advisor.ts:230-244); tests in 013's vitest suite. Expected: Pi repeat turns drop from 1,321 B to ~554 B (fallback case), and the "savings collapse" case in iteration 3 F2 is closed.
2. **Finish 037 (gate question noise).** In flight, 98%; completes the Gate-3 keep.
3. **Activate candidate 004 through the 007 evidence gate (the program's own rule: "no evidence, no activation, ever").** Run the behavioral negative controls (007's suite: long-context, advisor failure, no-match, comment-writing, completion-proof, advisory Gate, invalid-answer, child-session, resume, compaction) on the four eligible runtimes (Claude/Codex/Devin/OpenCode), then flip the 004 matrix cells with receipts. Effect: per-turn advisor payload 806 → 43 B on repeats (modeled 82.2% for 10-turn sessions). This is REDESIGN-as-activation: the full-first/route-only machine already built in 004 is the migration destination for the directives.
4. **Pi directive delivery:** once 013-gap fix + 004 activation evidence exist, migrate Pi to epoch-based full-first + repeat suppression across BOTH advisor shapes (head + fallback), and evaluate 006's compact dispatch directive against its five-semantics test map (native default, current-turn override, preload, anti-signal, child exclusion). Keep the 554 B full text as the unconditional fallback on advisor failure (006 constraint).
5. **Keep Tier B surfaces untouched.** No deprecation needed for opt-in/event-driven surfaces; document them in injection-contract.md as low-cost by design.
6. **Re-measure after each step** against hooks/001's model: target 10-turn payloads 9,626 → 1,715 B (four runtimes, 82.2%) and Pi 13,630 → ~3.2-4 KB with steps 1+4 (vs today's 6.7-13.4 KB). Rollback procedure per 007: disable flag, clear delivery state, full baseline emission.

### F4. What NOT to do (eliminated)

- Flat removal of the three directives with no replacement: breaks the AGENTS.md-absent case on hook runtimes (render.ts design intent) and the Pi advisor-failure path (guardrail-preservation is the program's hard constraint).
- Deprecating the Gate-3 question or advisor line (the topic's "keep only two" framing): both have the strongest behavioral evidence in the whole inventory.
- Trusting byte savings alone for any activation (007 REQ: behavioral AND delivery evidence both required; 001 rank 4: "bytes high, behavior low").

## Sources Consulted

- 006-pi-dispatch-and-compaction/spec.md (lines 62-77; rank-6 compact, 5-semantics map, eliminated 130/177 B variants)
- render.ts:106-123 (AGENTS.md-absence design intent), prompt-advisor.ts:230-244, 202-205
- 004 implementation-summary.md:76-91, 007 activation-matrix.json, 037 spec.md:69-70
- AGENTS.md:417-419 (Directive Capsule, root doc as durable source)
- mk-skill-advisor-bridge.mjs:319-373 (OpenCode bridge mirrors directives locally)
- Iterations 1-4 of this lineage

## Assessment

- **newInfoRatio: 0.75** — 006 details and bridge-mirror verified new; the disposition matrix and migration path are the first full synthesis of the lineage's evidence.
- **Confidence:** high for Tier A/B; medium-high for the redesign mechanics (004 activation still requires the 007 negative controls to pass — this research recommends the path, not the activation).
- **q5 core answered; final verification pass next.**

## Reflection

- What worked: framing the answer as three tiers instead of the two in the question — the evidence forced it (opt-in surfaces are neither "proven" nor bloat).
- What failed: nothing material.
- Ruled out: flat deprecation of always-on directives (F4), and deprecating either of the "two proven" surfaces.

## Recommended Next Focus

Iteration 6: Verification pass — re-check the load-bearing claims end-to-end (fallback dedup feasibility in code, 004/007 wiring, 037 status), scan for missed injection points (e.g., the skill-advisor CLI fallback, session-prime content, spec-kit memory context injection), and quantify any gaps in the q5 answer.
