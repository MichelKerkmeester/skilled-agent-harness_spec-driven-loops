# Iteration 14: Adversarial stress-test — risks, tradeoffs, and failure modes

## Focus
Challenge the recommendation (5-child umbrella-router, hub-inside-interface). Where could it be wrong? Stress-test against the corpus exemplars and surface risks for phase 002.

## Findings

### F57 — Risk: foundations is a "grab-bag" that re-splits under real usage
Merging color + typography + layout into one `sk-design-foundations` child is the softest call (iter 10). designer-skills keeps them together (one `ui-design` plugin), supporting the merge; but oklch alone is a deep specialist with 4 reference files, and users say "fix my contrast" or "fix my spacing" as distinct intents. **Mitigation:** ship foundations as one child but structure its internals as clean `color/`, `type/`, `layout/` reference packets so a later split to `sk-design-color` + `sk-design-layout` (→6 children) is mechanical, not a rewrite. Track advisor routing: if color and layout triggers fire at high volume independently, split. [SOURCE: external/oklch-skill.md:85-90], [SOURCE: external/designer-skills-main/README.md:72]

### F58 — Risk: interface child over-absorbs and becomes the monolith we rejected
Folding craft/shape/redesign/explore + the aesthetic presets + writing into `sk-design-interface` risks recreating impeccable's 23-command sprawl inside one child — the exact bloat the umbrella avoids at family scale. **Mitigation:** apply impeccable's own defenses *inside* the child — selective per-mode reference loading (F29) and an in-child router; keep cross-domain operations (audit, motion, color) as *handoffs to sibling children*, not absorbed modes. The interface child owns direction + build, and delegates. [SOURCE: external/impeccable.md:119-168]

### F59 — Risk: the shared design-base becomes a hidden coupling / single point of drift
A parent-owned anti-slop base that all children reference is leverage, but if it changes, every child's behavior shifts at once (the flip side of impeccable's "loaded in this context"). **Mitigation:** version the shared base; treat it as a stable contract; let children pin to a base version; run the routing-regression suite on any base change. The corpus shows the upside (one DON'T list, consistently applied) is worth this if governed. [SOURCE: external/audit.md:60-64]

### F60 — Tradeoff table the phase-002 decision should weigh
| Axis | 5-child umbrella (recommended) | 3–4 child hub | 7+ child fine-grained |
|------|-------------------------------|---------------|----------------------|
| Discoverability | High (distinct triggers) | Medium (one door) | High but noisy |
| Context cost | Low (lazy children) | Low (selective load) but base always on | Low per child, more registry overhead |
| Cognitive load | Low (5 names) | Lowest (1–3) | High |
| Compat with existing names | Best (flat names) | Worst (nesting) | Good |
| Runtime fit (heterogeneous) | Best (siblings) | Poor (co-load backend) | Best |
| Maintenance | Medium | Low surface, high internal | High |
| Matches local precedent | deep-loop-workflows, sk-code | create:sk-skill-parent | none |
Net: 5-child umbrella wins on compat + runtime-fit + discoverability; hub wins only on raw cognitive minimalism, which the umbrella's single parent door largely recovers. [SOURCE: skill registry: deep-loop-workflows, sk-code, create:sk-skill-parent]

### F61 — Where this lineage could be wrong (honest negatives)
- **Single-model bias:** this is one Opus lineage; the taxonomy leans on impeccable + designer-skills as the two structural poles. A different reading could weight impeccable's hub success more heavily and recommend a 3-child hub. The fan-out merge across lineages should reconcile this.
- **Corpus ≠ usage:** the corpus shows how design skills are *authored*, not how *this repo's users* invoke them. Advisor/usage telemetry (absent here) is the missing signal that would harden the foundations-split and output-child calls.
- **Output child unresolved:** canvas/slides/bento genuinely sit on the family boundary; reasonable to include OR exclude. Flagged for phase 002, not forced.
- **`design-lab` cleanup behavior** (temp `.claude-design/` routes) implies a stateful workflow that may not fit a stateless reference child cleanly — an implementation wrinkle for the interface child's explore mode. [SOURCE: external/design-lab.md:10-17]

## Sources Consulted
- Synthesis over iters 1–13; cross-checks against impeccable, designer-skills, oklch, design-lab, and local parent precedents (cited).

## Assessment
- **newInfoRatio: 0.35** — The risk register, mitigations, the tradeoff table across three structural options, and the explicit "where this could be wrong" negatives are new and are the adversarial-verification layer; novelty is naturally tapering as the analysis converges.
- **Novelty justification:** Adds the falsification/risk lens that a decision-ready recommendation needs, and names the cross-lineage reconciliation points for the merge.
- **Confidence:** High on the risks (each traces to a concrete tension in the evidence); the negatives are deliberately uncertainty-preserving.

## Reflection
- **Worked:** Stress-testing surfaced that the foundations merge and the interface-absorption are the two places the recommendation is most likely to need adjustment.
- **Insight:** The recommendation is robust on structure (umbrella) but tunable on grain (5 vs 6 vs 4) — phase 002 should treat grain as the open dial.
- **Ruled out:** Presenting the 5-child taxonomy as the only option — the variants and their tradeoffs must travel with it.

## Recommended Next Focus
Iteration 15: Final convergence — consolidated recommendation, answered-question ledger, confidence, and the open questions handed to phase 002 (then synthesis + maxIterationsReached).
