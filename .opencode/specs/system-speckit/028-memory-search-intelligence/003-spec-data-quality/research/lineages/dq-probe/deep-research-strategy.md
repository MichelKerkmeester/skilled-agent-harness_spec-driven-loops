# Deep Research Strategy - dq-probe lineage

## 1. OVERVIEW

Fan-out lineage `dq-probe` under packet 003-spec-data-quality. The parent research converged on the **truncation law** over a narrow surface (spec docs + 2 metadata JSONs + retrieval code). This lineage extends the question to the **entire spec-kit knowledge surface** and asks which automated on-write and retroactive features perfect data quality across that surface, with emphasis on document refinement and context engineering rather than retrieval-code fixes alone.

---

## 2. TOPIC

Best-possible automated and perfected data quality across the entire spec-kit knowledge surface: spec docs and their two metadata JSONs, the skill documents (SKILL.md + references + assets), the commands, and the context-engineering layer (context assembly, retrieval, injection, prompts, memory). Out-of-the-box automated on-write and retroactive features that maximize data quality for retrieval, AI adherence and logic reading. Builds on the 028 truncation-law finding (prod truncates to a 3-result floor, so retrieval candidates need prod-mode proof while adherence, logic and write-time candidates bypass the floor).

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: What automated quality machinery (on-write gates + retroactive sweeps) already exists across the spec-kit surface, and which parts of the surface (skill docs, commands, context-engineering) are NOT covered by it?
- [ ] Q2: Which document-refinement and context-engineering automations maximize AI adherence and logic reading, and do they bypass or pay the truncation floor?
- [ ] Q3: What is the highest-ROI set of out-of-the-box automated features to perfect data quality across the FULL surface, ranked by floor-bypass and reuse-first?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Building or shipping any feature. This lineage is research only.
- Re-deriving the parent packet's retrieval-candidate tiering (header-path prefix, metadata fusion, etc.). Those are settled in the parent `research/research.md`. This lineage extends to the doc/command/skill/context surface the parent did not cover.
- Touching any path outside the `dq-probe` lineage artifact directory.

---

## 5. STOP CONDITIONS
- Two iterations complete (maxIterations cap), OR
- Composite convergence with legal-stop gates passing, whichever comes first.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- [x] Q1: The automated machinery is bifurcated and surface-incomplete. Spec docs get a deep 33-rule gate (validate.sh) that is manual-at-completion; code/MCP/prompt-registry surfaces get blocking on-write commit gates; the sk-doc DQI scorer is real/deterministic/type-aware but never automated; skill docs, references, command docs, and context-engineering assets have NO automated data-quality gate. (iteration 1)
- [x] Q2: The adherence/logic automations are write-time, floor-bypassing, and half-built (DQI scorer, post-save-review, EARS linter, link validators) = features 1-5; the one retrieval automation is the inject->refine telemetry loop (feature 6), which PAYS the floor and needs prod-mode proof. The injection layer is a pure consumer with no feedback to source docs. (iteration 2)
- [x] Q3: Highest-ROI set = features 1-5 (Tier GO-on-cost). Rank 1 (wire the existing DQI scorer on-write + retroactively) is the single highest-ROI move; the lever is fully built and blind only by lack of wiring. Features 6-7 are conditional, gated on prod-mode completeRecall@3. (iteration 2)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading validator-registry.json + the live pre-commit hook directly: exposed the bifurcation in one pass (iteration 1)
- Tracing the DQI scorer to validation.md: found a half-built reuse-first lever, mirroring the parent packet's pattern (iteration 1)
- Extending the parent's GO-on-cost / floor-bypass doctrine onto the net-new surface: produced an actionable ranking immediately (iteration 2)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Searching for a corpus-wide retroactive doc-quality runner: none exists; only illustrative shell snippets (iteration 1)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach is tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- "A corpus-wide retroactive doc-quality sweep already exists": ruled out. validation.md batch snippets are illustrative, no shipped runner wires DQI across the surface (iteration 1, evidence: validation.md:506-522)
- "memory:manage or advisor_validate IS the doc-quality automation": ruled out. Both operate on the index/routing axis, not the source-document data-quality axis (iteration 2)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[Populated after iteration 1 completes]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
CONVERGED at maxIterations=2; all three key questions answered. If extended: count the actual skill/reference/command-doc census to harden the magnitude claim, and prototype feature 1 as a default-off warn-only retroactive DQI report to measure the real band distribution before promoting any on-write gate to blocking.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Parent packet `research/research.md` converged on the truncation law:
- Prod retrieval truncates to a 3-result floor (`confidence-truncation.ts:35` DEFAULT_MIN_RESULTS=3, wrapped in `if (!evaluationMode)` at `hybrid-search.ts:2049`). completeRecall 0.212 eval-mode vs 0.036 prod-mode at K8 (028/before-vs-after.md:159), a 5.9x gap.
- The floor taxes RETRIEVAL candidates only. Adherence (A), logic (L) and write-time candidates bypass it. The cheapest real wins are write-time gates, not headline retrieval techniques.
- Parent tiering: one measured GO (JSON-schema validation gate via zod graphMetadataSchema + new description.json schema into validate.sh), a GO-on-cost set (EARS + constraint tiers + soft linter, REQ_COVERAGE gate reusing AC_COVERAGE, description.json ops/logic fields, graph-metadata child-aggregation, read-time content_hash verify), a CONDITIONAL retrieval slate (header-path prefix, answerable_questions/semantic_intent, metadata fusion, LLM-judge) all hypothesis-until-prod-measured, and a NO-GO set (libSQL/DiskANN swap, LightRAG, quantization, Ed25519, new rollup node type).

`resource-map.md` not present; skipping coverage gate.

This lineage's novelty target: the parent surface stopped at spec docs + 2 JSONs + retrieval code. The skill documents, the command docs, and the context-engineering layer (assembly/injection/prompts) were NOT tiered for automated quality. That is the net-new surface.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 2
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output
- Artifact dir: `.../003-spec-data-quality/research/lineages/dq-probe` (all writes confined here)
- Current generation: 1
- Started: 2026-06-21T10:05:00Z
