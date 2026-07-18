---
title: "GLM-OOB Lateral Lineage Strategy"
description: "Radical/lateral rethinks of parent-hub routing. Convergence is telemetry-only (stopPolicy=max-iterations). Each iteration diverges from the keep-1/flip-4 answer in 021/run2-archive/research.md."
session_id: fanout-glm-oob-1784347200936-r7aos1
lineage_label: glm-oob
executor: cli-opencode (zai-coding-plan/glm-5.2)
importance_tier: important
contextType: research
version: 1
---

# Deep Research Strategy — GLM-OOB Lateral Lineage

## 1. TOPIC
Parent-hub routing, **radical lateral rethinks** over the 8-item out-of-box agenda in
`.opencode/specs/sk-doc/019-sk-doc-router-alignment/023-oob-glm-parallel/spec.md`. Runs concurrently
with the SOL-ultra sibling lineage to diversify the idea space before the combined `021` defaultMode
synthesis.

## 2. KNOWN CONTEXT (Bounded Snapshot)

### Prior answer (DO NOT RE-DERIVE)
Run-1 + Run-2 of sibling packet `021` established: keep `sk-prompt` → `prompt-improve`;
flip four hubs (`cli-external-orchestration`, `system-deep-loop`, `mcp-tooling`, `sk-design`) to
`defaultMode: null` with a routing-helper fallback. The cli hub may additionally be
"detection-defaulted" via a runtime-detection block. Full study: `021/run2-archive/research.md`.
This lineage must **diverge**, not re-litigate.

### Out-of-box agenda (from `023-oob-glm-parallel/spec.md` §3)
1. **Abolish the hub-router layer** — advisor (Layer 0) picks the mode directly; hubs become pure packet containers.
2. **Learned / adaptive routing** — weights that update from observed corrections; deterministic-offline learned router.
3. **Cross-domain analogies** — OS schedulers, IP routers, DNS resolvers, load balancers, a human receptionist.
4. **No-wrong-door / handoff routing** — any mode accepts then hands off; routing becomes recoverable.
5. **Routing as dialogue** — the zero-signal case as a one-turn typed negotiation.
6. **Confidence-first architecture** — every route carries calibrated confidence; below threshold, always defer with a card.
7. **Radical simplification** — is the INTENT_SIGNALS + RESOURCE_MAP two-layer scheme necessary, or an accident?
8. **Contrarian frame-break** — the whole defaultMode debate is a symptom of a deeper design smell; name it and the reframe.

### Ground-truth surfaces read at init
- All seven parent-hub `hub-router.json` files (sk-doc, sk-code, sk-design, sk-prompt,
  cli-external-orchestration, system-deep-loop, mcp-tooling).
- `sk-doc/create-skill/assets/skill/skill_smart_router.md` (the canonized router template).
- `system-skill-advisor/mcp_server/scripts/skill_advisor.py:2810-2866`
  (`_apply_deep_skill_routing_layer` — the *one* precedent where Layer-0 pre-resolves a `(skill, mode)` pair for a Layer-1 hub).
- The sibling `021/run2-archive/research.md` for the established answer we are explicitly diverging from.

### Structural regularities observed across hubs
- `weight: 4` on essentially every signal in every hub — i.e. the **`weight` field does no actual discrimination today**; all discrimination lives in `classes` / `vocabularyClasses`.
- Every hub defines the same three `outcomes` (`single`, `orderedBundle`, `defer`) with near-identical prose.
- `defaultResource` is one of two shapes: a single doc (`sk-doc` → `quick_reference.md`) or `smart_routing.md + mode-registry.json` (everyone else).
- `bundleRules` exist in 2-of-7 hubs only (sk-doc, sk-design) and each hub has exactly one rule.

### Resource-map integration
`resource-map.md` not present in this packet; coverage gate skipped. Bounded context snapshot taken from
`spec.md` + sibling `021/run2-archive/research.md` instead.

## 3. KEY QUESTIONS (remaining)

The lineage's job is to **invent** radical answers, not answer the run-1/run-2 question. Phrased as
out-of-box questions:

- [ ] Q1. If Layer-1 routing were deleted entirely (advisor emits `(skill, mode)`), what concretely breaks vs improves? (agenda #1)
- [ ] Q2. Which routing primitive transfers from a non-routing domain (scheduler / IP / DNS / load balancer / receptionist), and what is its non-obvious cost? (agenda #3)
- [ ] Q3. If any mode could accept any request and then hand off (no-wrong-door), does the keep-vs-null distinction dissolve? What does it cost? (agenda #4, #5)
- [ ] Q4. If every route carried calibrated confidence and the table was learned from corrections, would `defaultMode` still be a meaningful field? (agenda #2, #6)
- [ ] Q5. Is the two-layer `INTENT_SIGNALS` + `RESOURCE_MAP` scheme load-bearing or an accident? What is the minimal replacement? (agenda #7, #8)

## 4. NON-GOALS

- Re-deriving keep-1/flip-4 (already settled across runs 1-2 in `021`).
- Implementation planning (that is `022`).
- Per-hub verdict tables (run-2 already produced one; lateral rethinks do not need to).
- Anything outside the 8-item agenda, unless an iteration genuinely discovers a 9th frame.

## 5. STOP CONDITIONS

- `stopPolicy: max-iterations` — the loop runs **all 5 iterations** unconditionally.
- Convergence signals are **telemetry only** (convergenceMode: off). A low `newInfoRatio` is logged
  but does NOT trigger synthesis; instead the next iteration broadens the angle.
- The lineage's job is divergence — early synthesis would be a failure of the charter.

## 6. ANSWERED QUESTIONS

- **q1 — If Layer-1 routing were deleted entirely, what breaks vs improves?** (answered, iteration 1)
  - Reframed: abolition is a **tier-split** (cold advisor decides `skill`; hot advisor-loaded vocab decides `mode`), not a deletion.
  - Breaks: vocabulary centralisation kills per-skill authoring boundary; advisor becomes Layer-0+1 coupled; eager resource selection forced; `bundleRules` lose their encoding home.
  - Improves: keep-vs-null disappears at the root; drift detectable at one file; `clarifying_question` already shipped becomes the single disambiguation surface.
- **q2 — Which routing primitive transfers from a non-routing domain, and at what cost?** (answered, iteration 2)
  - Four of five analogies collapse to weighted-selection / bundleRules / defer — already shipped.
  - The genuine transfer is the **feedback channel** itself: closed-loop routing (emit `routeId`, record re-prompt).
  - Health-score routing is the multi-release destination; F3's four costs make it non-trivial.
- **q3 — Does no-wrong-door/handoff dissolve the keep-vs-null distinction? At what cost?** (answered, iteration 3)
  - Yes, but **orthogonally**, not by replacement. NWD makes wrong picks recoverable, so keep-vs-null becomes a cost inequality (one handoff vs one clarification turn), not a moral judgment.
  - Cost: typed handoff vocabulary is load-bearing (five fields); NWD needs a handoff-loop cap; mode contract gains a new return type.
  - Routing-as-dialogue: the zero-signal card becomes **non-blocking** under NWD (run-2's was a commitment gate).
  - Cross-iteration convergence: handoff is the typed substrate turning re-prompt into a first-class closed-loop channel.
- **q4 — Does confidence-first + learned routing make defaultMode meaningless?** (answered, iteration 4)
  - Alone, no — confidence-first without handoff collapses to run-2's null-with-card (F2).
  - With handoff, yes — but the load-bearing reframe is the **(T, R, P) decomposition**: routing has three orthogonal knobs (Threshold, Recovery, Provenance); `defaultMode` is one corner.
  - The learned router does NOT learn weights (uniform 4 = vestigial); it learns the **vocabulary-to-mode assignment**.
- **q5 — Is the INTENT_SIGNALS+RESOURCE_MAP scheme load-bearing or an accident?** (answered, iteration 5)
  - The smell named: routerPolicy fields **conflate three orthogonal concerns** (T, R, P) across all 7 hubs.
  - The minimal router is `(T, R, P)` triple + vocabulary table; `defaultMode`, `defaultResource`, `bundleRules`, `outcomes`, `tieBreak`, `ambiguityDelta` are all deleted or relocated.
  - Contrarian claim (load-bearing): **`defaultMode` was never a design knob — it was a documented bug compensating for the missing recovery primitive (typed handoff).**

## 7. WHAT WORKED

- **Reading the one shipped precedent (`_apply_deep_skill_routing_layer`)** made abolition answerable from evidence (iter 1, F1).
- **Surveying all five cross-domain analogies before committing** produced the negative-knowledge finding that four-of-five collapse (iter 2, F1).
- **Treating agenda pairs as single iterations** (#4+#5, #2+#6, #7+#8) — each pair is a two-turn reframe where the second turn is radical only because of the first.
- **The (T, R, P) decomposition** (iter 4 F5) subsumed every prior iteration's findings cleanly; applying it (iter 5) dissolved the defaultMode debate without contradicting run-2.

## 8. WHAT FAILED

- **Searching for a "minimal deletion"** of Layer-1 — none exists (iter 1).
- **Trying to make the load-balancer transfer literal** — state-space explosion (iter 2 F3.1).
- **Initially trying to make "learn the weights" the headline** — weights are uniformly 4, vestigial (iter 4 F3).
- **Initially trying to invent a fourth (T, R, P) axis** — scope creep, did not survive stress (iter 5).

## 9. EXHAUSTED APPROACHES (do not retry)

- **Static-selection analogies as a source of routing primitives.** OS scheduler, IP longest-prefix, receptionist — all collapse to today's `weight` / `vocabularyClasses` / `defer` / `bundleRules`. (iteration 2)
- **Confidence-first routing without handoff.** Collapses to run-2's null-with-card. (iteration 4)
- **Keeping `defaultMode` alongside (T, R, P).** Worst of both worlds; conflation smell persists. (iteration 5)

## 10. RULED OUT DIRECTIONS

- **"Set every `defaultMode` to null" as abolition** — run-1/run-2 answer wearing a wig. (iteration 1)
- **"Generalise `_apply_deep_skill_routing_layer` verbatim"** — distributed monolith in another shape. (iteration 1)
- **OS scheduler / IP longest-prefix / receptionist analogies** — collapse to existing primitives. (iteration 2)
- **Full health-score routing as immediate destination** — F3 four costs; multi-release programme. (iteration 2)
- **Any-mode-accepts without typed handoff vocabulary** — collapses to re-prompt signal. (iteration 3)
- **NWD as replacement for `defaultMode: null`** — NWD is orthogonal, not replacement. (iteration 3)
- **Open-ended `clarifying_question` as zero-signal outcome** — typed card dominates it. (iteration 3)
- **"Learn the weights"** — vestigial field, nothing to learn. (iteration 4)
- **Live in-path weight updates** — breaks router-replay reproducibility. (iteration 4)
- **Mechanical codemod for (T,R,P) migration** — `defaultMode:X` is ambiguous between (T low,R none) and (T low,R handoff). (iteration 5)
- **Shrinking the vocabulary table** — it IS the router's discrimination. (iteration 5)

## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Saturated: static-selection analogies (iter 2); confidence-first-without-handoff (iter 4); static-`P` plane generally (iter 4 F5)
- Pivot lineage: none (stopPolicy = max-iterations, no early pivots)
- Remaining frontier: NONE open in this lineage — all 8 agenda items explored
- Promoted ideas:
  - `idea-closed-loop-router` (3 observations across iters 2/3/4; the lineage's most-cited primitive)
  - `idea-minimal-router` (early promotion iter 5; load-bearing synthesis claim, awaits cross-lineage confirmation in SOL-ultra)

## 11. CARRIED-FORWARD OPEN QUESTIONS

All seeds consumed by iterations 3-5:
- CF1 (deferral vs handoff) → consumed by iter 3 (handoff wins; deferral is the second turn of a dialogue)
- CF2 (advisor confidence under tier-split) → consumed by iter 4 (F1: advisor already has it)
- CF3 (handoff as typed closed-loop signal) → consumed by iter 3 F5 and iter 4 F3

New carry-forwards for the combined-021 synthesis (outside this lineage):
- **CF4 (for 021 synthesis):** does the SOL-ultra sibling lineage independently arrive at typed-handoff or (T,R,P)? If yes, cross-lineage convergence on the axis system; if no, this lineage's claims need ablation.
- **CF5 (for 022 implementation):** if (T,R,P) is adopted, the migration order is R first (handoff vocabulary), then T (fleet-wide threshold), then P (learned table). The reverse order re-creates the conflation smell.

## 12. NEXT FOCUS
**Lineage complete — maxIterationsReached at iteration 5.** Proceed to phase_synthesis.

## 13. RESEARCH BOUNDARIES
- Max iterations: 5 (hard stop; stopPolicy = max-iterations)
- Convergence threshold: 0.05 (telemetry only; never triggers STOP)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Convergence mode: off (divergence charter)
- Artifact dir: `.opencode/specs/sk-doc/019-sk-doc-router-alignment/023-oob-glm-parallel/research/lineages/glm-oob`
- All writes confined to this lineage dir
- Current generation: 1
- Started: 2026-07-18T06:00:00Z
