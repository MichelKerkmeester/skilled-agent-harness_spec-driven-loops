---
title: Deep Research Strategy - Spec Templates & Context Reducer (lineage pi-flash-a) - COMPLETE
description: Fan-out lineage pi-flash-a (cli-pi deepseek-v4-flash) strategy. Loop complete at maxIterations=3.
trigger_phrases:
  - "spec templates context reducer"
  - "reducer engineering speckit"
importance_tier: important
contextType: research
version: 1.0.0
---

# Deep Research Strategy - Spec Templates & Context Reducer (lineage: pi-flash-a)

## 2. TOPIC
Test Reducer Engineering and the $1.2M Agent Engineering harness against system-speckit templates, documentation logic, and context/memory. Classify every recommendation {already-exists / genuine-gap / not-applicable} with file:line evidence. Ranked shortlist + refutation list. Report-only.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
[None — all five answered]
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implement any runtime, template, or doc change in this lineage.
- Reinvent or duplicate `system-deep-loop` reducers, findings-registry, or contradiction-supersession machinery.
- Expand scope outside templates / doc-logic / context-memory (except as cited prior art).
- Early synthesis before `maxIterations=3` (`stopPolicy: max-iterations`).

---

## 5. STOP CONDITIONS
- `maxIterations=3` reached — STOP. Convergence before that is telemetry only.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1 Template weight: raw 5,541 LOC collapses via renderInlineGates for core docs (spec 874→143 at L1); the heaviest survivor is research.md.tmpl which renders 944 lines at EVERY level (ungated passthrough gate). (iteration 1)
- Q2 Reducer Engineering vs templates: deterministic level-gate renderer + fail-closed template pipeline already-exist; ungated utility templates (research/resource-map/handover/debug-delegation/review.spec) are the genuine gaps. (iteration 1)
- Q3 Harness vs doc-logic: Default-FAIL (Iron Law + check-evidence), fresh evaluator (deep-review), handoff (handover.md/_memory.continuity), complexity-match (check-complexity) all already-exist; genuine gaps are dormant AC_COVERAGE rule (disabled by default) and zero scope-adherence validator rules. (iteration 2)
- Q4 Memory: memory_context enforces per-layer token budget (memory-context.ts:551); dedup is id-based at multiple stages; the dynamic tier budget is advisory-only (split-brain). (iteration 3)
- Q5 Prior art: contradiction-supersession, conditional-fanin, reduce-state.cjs dedup = Reducer Engineering core already shipped; porting reduce_findings is not-applicable. (iteration 3)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Measuring rendered output directly with the renderer CLI instead of reading raw templates end-to-end (turns LOC claims into evidence) (iteration 1)
- Grepping env-var enablement repo-wide to distinguish "rule exists" from "rule exists but dead by default" (iteration 2)
- Reading handler code + its dedicated vitest to resolve the token-budget hypothesis (iteration 3)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- None — all three planned focus surfaces delivered evidence.
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
- "Reduce raw template LOC as a goal" — BLOCKED (iteration 1): rendered weight is what agents read; gating already cuts core docs ~84% at L1. Do NOT retry as a research angle.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Cut raw 5,541 LOC: refuted — rendered weight is the real authoring cost; gating already reduces it (iteration 1, evidence: inline-gate-renderer.ts:182)
- Port reduce_findings into speckit templates/memory: not-applicable — deep-loop reducers already ship the pattern (iteration 1+3, evidence: conditional-fanin/reduction.ts:1, contradiction-supersession)
- Add a new fresh-context evaluator to speckit: already-exists — deep-review is it (iteration 2, evidence: deep-review/SKILL.md:298)
- Re-architect Gate 3 as a token reducer: category error — it is a write-boundary classifier by contract (iteration 2, evidence: gate-3-classifier.ts:838)
- Claim-level near-dedup in memory_search: not worth it — id-dedup exists; content grouping lives in findings-registry (iteration 3, evidence: stage1-candidate-gen.ts:528)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: template weight (measured), harness-pattern mapping on doc-logic (mapped), memory reducer presence (verified)
- Remaining frontier: none recorded — all three charter surfaces covered within maxIterations
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Cross-lineage synthesis-input collapse (F3.6): whether a deterministic claim-collapse across independent fan-out lineages before the final convergence read would add value — flagged genuine-gap-but-out-of-charter (touches deep-loop runtime, not scoped speckit surfaces).
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
COMPLETE — synthesis done. Loop stopped at maxIterations=3 with all five key questions answered.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
[Initial snapshot; see iteration files for the evidence each focus produced.]

## 13. RESEARCH BOUNDARIES
- Max iterations: 3 | Convergence threshold: 0.05 | Budget: 12 tool calls / 10 min per iteration
- Started: 2026-08-12T07:00:45Z | Generation: 1 | sessionId: fanout-pi-flash-a-1786517927558-l9mbmd
