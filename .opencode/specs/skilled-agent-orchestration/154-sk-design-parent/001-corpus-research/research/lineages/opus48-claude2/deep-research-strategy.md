# Deep Research Strategy — opus48-claude2 lineage

## 1. OVERVIEW
Lineage `opus48-claude2` (Opus 4.8, xhigh) of the four-model fan-out for the sk-design parent-skill corpus research. Independent loop, 15-iteration cap, converges on its own state under this lineage dir.

---

## 2. TOPIC
Determine how to restructure the existing `sk-design-interface` skill into a parent skill named `sk-design` containing 4–7 focused design sub-skills, grounded in the external design-skills corpus at `../external/` (41 standalone design-skill docs, the designer-skills-main 9-collection / 97-skill model, and apple-bento-grid-main). Produce: (1) the optimal sub-skill taxonomy with each child's scope, boundaries, and corpus sources; (2) parent structural-model evidence — single hub with nested mode packets vs. umbrella router over a sibling family — with coupling and shared-runtime signals; (3) per-child onboarding + backward-compat implications, folding in `sk-design-interface` and `sk-design-md-generator`.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
All key questions answered; none remaining (converged at iteration 15 / cap).
- [x] KQ1 corpus domains (iter 1) · [x] KQ2 designer-skills model (iter 2) · [x] KQ3 apple-bento role (iter 3)
- [x] KQ4 taxonomy (iter 10) · [x] KQ5 source→child (iter 9) · [x] KQ6 structural model (iters 6/7/11)
- [x] KQ7 fold-in/compat (iter 13) · [x] KQ8 per-child onboarding (iter 12)
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Not building, scaffolding, or migrating any skill (phases 003–005 own that).
- Not making the binding architecture decision (phase 002 owns it); this lineage produces evidence and a recommendation only.
- Not authoring the design-judgment content inside each future sub-skill.
- Not evaluating transports (`mcp-figma`, `mcp-open-design`) as design-judgment sub-skills.

---

## 5. STOP CONDITIONS
- Hard stop at 15 iterations (`maxIterationsReached`) — REQ-001 expects this lineage to reach its cap.
- Early convergence only if newInfoRatio holds below 0.05 across the required consecutive evidence iterations AND all key questions are evidence-backed AND quality gates pass.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- KQ1–KQ8 all answered (8/8). Recommendation: 5 core children (sk-design-interface, -foundations, -motion, -audit, -spec) + optional -output; umbrella-router parent with hub structure inside the interface child; keep flat names, md-generator→spec via alias, augment interface, additive shared base, advisor+skill-graph rebuild gate. See research.md for the full cited synthesis.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Front-matter grep + directory tree for a cheap, complete, cited inventory (iter 1).
- Reading the corpus's own structural exemplars (impeccable hub, designer-skills umbrella) to ground hub-vs-umbrella in evidence (iters 6/7).
- Reading the two existing skills to discover the family already exists as loosely-coupled siblings (iter 8) — the decisive coupling signal.
- A single inclusion test applied uniformly to produce a non-arbitrary taxonomy (iter 10).
- A coupling signal matrix to settle the structural model transparently (iter 11).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[Populated after iteration 1]
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach is exhausted]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Atomic designer-skills (97) as the child unit — wrong granularity (iter 2).
- Four named-aesthetic children as peers — they are a preset axis (iter 3).
- Tone/intensity verbs (bolder/quieter/etc.) as standalone children — modifiers (iter 4).
- Standalone motion-performance child; pure mode-slicing — audit lens / buries depth (iter 5).
- audit/critique/harden/optimize as separate peer children — one review contract (iter 6/10).
- Hub co-loading all children; 23 commands as children — modes, selective load (iter 7).
- Folding md-generator into a co-loaded hub; renaming without aliases — runtime/compat (iter 8/13).
- 9-child taxonomy; folding audit into interface (iter 10).
- Monolithic single hub for the whole family; flat no-parent set (iter 11).
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[Populated after iteration 1]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
None — lineage complete at the iteration cap (maxIterationsReached, 15/15). Hand off to the fan-out merge and the phase-002 architecture decision. Open dials carried forward: grain (4/5/6), output child keep/drop, md-generator naming, shared-base governance, cross-lineage reconciliation.
<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT
- `resource-map.md` not present; skipping coverage gate.
- Existing skills to fold in: `sk-design-interface` (distinctive UI design judgment, brainstorm-critique-build) and `sk-design-md-generator` (live-site CSS → v3 Style Reference DESIGN.md).
- Repo has a parent-skill pattern (`create:sk-skill-parent` → hub identity + nested mode packets, registry source of truth) and an umbrella-router pattern (`deep-loop-workflows` routes 5 modes over a shared runtime; `sk-code` smart-router auto-detects surface). These are local structural precedents.
- Phase-parent default in the parent spec is "umbrella + siblings," to be confirmed against evidence at phase 002.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 15 (hard cap; REQ-001 target)
- Convergence threshold: 0.05 newInfoRatio
- Per-iteration budget: 12 tool calls, 15 minutes
- Progressive synthesis: true
- research.md ownership: lineage-owned canonical synthesis at this lineage dir
- Evidence base: local corpus at `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/` + existing skills under `.opencode/skills/`
- Current generation: 1
- Started: 2026-06-25T10:16:00Z
