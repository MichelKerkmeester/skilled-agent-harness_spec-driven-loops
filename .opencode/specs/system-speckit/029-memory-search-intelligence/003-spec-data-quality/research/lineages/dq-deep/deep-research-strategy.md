---
title: Deep Research Strategy (lineage dq-deep)
description: Session tracking for the dq-deep fan-out lineage on automated data-quality across the spec-kit knowledge surface.
trigger_phrases:
  - "dq-deep lineage strategy"
  - "automated data quality strategy"
  - "spec-kit on-write retroactive automation"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - dq-deep lineage

Lineage `dq-deep` of the spec-data-quality fan-out. Distinct angle from the parent synthesis: the parent converged on the *truncation law* and tiered retrieval/adherence/logic candidates. This lineage drives DEEPER on the **automation surface** the topic asks for: out-of-the-box on-write hooks and retroactive sweeps that auto-perfect data quality across spec docs, the two metadata JSONs, skill docs, commands, and the context-engineering layer.

---

## 2. TOPIC
Best-possible automated and perfected data quality across the entire spec-kit knowledge surface, with on-write and retroactive automation maximizing retrieval, AI adherence and logic reading, refining documents and context engineering beyond simple code fixes. Built on the 028 truncation law: prod truncates to a 3-result floor, so retrieval candidates need prod-mode proof while adherence, logic and write-time candidates bypass the floor.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] KQ1: What on-write automation already runs in the spec-kit write path (generate-context.js, validate.sh, validators, hooks) and where are the data-quality gaps?
- [ ] KQ2: What retroactive/sweep automation exists (reindex, backfill, retention, doctor, ingest) and which quality-maximizing retroactive features are missing?
- [ ] KQ3: How can the two metadata JSONs be auto-enriched on write for retrieval/adherence/logic, respecting which fields bypass the truncation floor?
- [ ] KQ4: How can spec docs be auto-refined (document refinement, not just validation): auto-summary, auto-trigger-phrases, auto-EARS, HVR/structure normalization?
- [ ] KQ5: What skill-doc corpus quality automation is missing (SKILL.md + references + assets, advisor metadata, trigger phrases, smart-router coverage)?
- [ ] KQ6: What command-doc quality automation is missing across the command surface?
- [ ] KQ7: What context-engineering-layer automation can auto-perfect context (assembly, retrieval, injection, prompt packs, memory write safety)?
- [ ] KQ8: What is the best-possible automated DQ program, prioritized by truncation-law-aware ROI (write-time/adherence/logic ship cheap; retrieval gated on prod-mode proof)?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Re-deriving the truncation law (inherited as settled from the parent synthesis).
- Building or shipping anything. This lineage is research only.
- Re-ranking the parent's retrieval candidates on benchmark numbers; instead, find the AUTOMATION wrapper around them.
- Touching any path outside this lineage directory.

---

## 5. STOP CONDITIONS
- All eight key questions answered with file:line-grounded automation findings.
- newInfoRatio below 0.05 for the convergence window with quality guards passing.
- A complete automated-DQ program (on-write + retroactive) is assembled and tiered.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
All 8 KQs answered (see findings-registry.json resolvedQuestions and research.md). Central finding: the automation asymmetry — gate-rich authored surface, refinement-rich memory surface, never connected. Two on-write keystones (A1 extend the live quality loop, plus enum/schema/propagation hygiene), one retroactive keystone (B1 scheduled sweep with guarded auto-fix), one retrieval unblocker (C2 prod-mode-@3 benchmark). Converged at iteration 9.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[Populated after iteration 1]
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[Populated after iteration 1]
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[None yet]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
KQ1: Map the on-write automation already in the spec-kit write path and find the data-quality gaps.
<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT
Parent synthesis (`research/research.md`) is settled. Inherited facts:
- The truncation law: prod retrieval truncates to a 3-result floor (`confidence-truncation.ts:35` DEFAULT_MIN_RESULTS=3, gated by `if (!evaluationMode)` at `hybrid-search.ts:2049`). 028 measured completeRecall 0.212 eval vs 0.036 prod at K8 (5.9x gap).
- Doctrine: a feature earns a prod keep only by changing the composition of the truncated top-3; adherence/logic/write-time candidates serve a different reader and bypass the floor.
- Parent GO: JSON-schema validation gate wired into validate.sh (zod graphMetadataSchema + new description.json schema), reusing shipped machinery, zero re-index.
- Parent reuse-first lesson: levers already exist half-built (rollup record at weight 0.75, quality_score column + fusion multiplier, AC_COVERAGE pattern, 103 typed edges, zod schemas parse at write time).

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 40
- Convergence threshold: 0.05 newInfoRatio
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output
- Scope lock: write only inside research/lineages/dq-deep/
- Current generation: 1
- Started: 2026-06-21T08:14:06Z
