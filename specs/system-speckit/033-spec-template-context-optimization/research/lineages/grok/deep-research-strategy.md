---
title: Deep Research Strategy - Spec Templates & Context Reducer
description: Fan-out lineage grok strategy for testing Reducer Engineering and Agent Engineering harness concepts against system-speckit.
trigger_phrases:
  - "spec templates context reducer"
  - "reducer engineering speckit"
importance_tier: important
contextType: research
version: 1.0.0
---

# Deep Research Strategy - Spec Templates & Context Reducer (lineage: grok)

## 2. TOPIC
Test Reducer Engineering + $1.2M Agent Engineering harness concepts against system-speckit templates, documentation logic, and context/memory — classify every recommendation {already-exists / genuine-gap / not-applicable} with file:line evidence; produce ranked shortlist + refutation list. Report-only.

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
- Hard stop at `maxIterations: 3` (`stopPolicy: max-iterations`) — **REACHED**.
- Convergence ratio is telemetry only; broaden angles instead of early STOP.
- Report-only; no product-file writes outside this artifact_dir.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- [x] Q1: Raw 5541 LOC collapses via renderInlineGates for core docs; remaining weight is ungated optional tmpls + raw-read risk (iter1)
- [x] Q2: Reducer Engineering already exists in deep-loop; template IF-gating is the templates analogue (iter1)
- [x] Q3: Harness patterns map to Iron Law/deep-review/handover/Levels; genuine gap is machine scope check (iter2)
- [x] Q4: memory_context budgets; memory_search does not — reuse enforceTokenBudget (iter3)
- [x] Q5: 4-item shortlist + refutation table in research.md (iter3)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Measuring rendered vs raw template LOC (iteration 1)
- Negative evidence on validate.sh scope rules (iteration 2)
- Contrasting memory_context vs memory_search budget enforcement (iteration 3)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- None material across three iterations
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Porting source-essay harness wholesale -- BLOCKED (iteration 3)
- What was tried: Map each source pattern to in-repo surfaces
- Why blocked: Most patterns already ship; remaining work is narrow gaps
- Do NOT retry: Full harness reimplementation PRs
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Port Twitter reduce_findings into speckit (iteration 1)
- Blind cut of 5541 LOC templates (iteration 1)
- New Default-FAIL / fresh evaluator / Gate3-as-reducer (iteration 2)
- Add memory_context token budget / memory claim-normalize ledger (iteration 3)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: templates-weight, harness-vs-doc-logic, memory-budget-dedup, shortlist
- Pivot lineage: none
- Remaining frontier: none (max iterations reached)
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Design detail for scope-allowlist exemptions (rank 3) — deferred to `/speckit:plan`
- Whether handover/resource-map should share research.md gating treatment — deferred
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
SYNTHESIS complete. Parent merge / plan ranks 1–2 of shortlist.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- resource-map.md not present at spec root; skipping coverage gate.
- Context sources: `context/Reducer Engineering.md`, `context/The $1.2M Agent Engineering skill.md`.
- Lineage research.md written with ranked shortlist + refutations.

### Bounded Context Snapshot
- Unchanged from init; see research.md for synthesis.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 3 — completed
- Stop policy: max-iterations — fired
- Session: fanout-grok-1786515199922-z0hium
- Completed: 2026-08-12T06:21:14Z
