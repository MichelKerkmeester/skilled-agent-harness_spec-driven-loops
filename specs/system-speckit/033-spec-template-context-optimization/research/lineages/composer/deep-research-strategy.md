---
title: Deep Research Strategy - Spec Templates & Context Reducer (composer lineage)
description: Fan-out lineage composer strategy for testing Reducer Engineering and Agent Engineering harness concepts against system-speckit.
trigger_phrases:
  - "spec templates context reducer"
  - "composer lineage research"
importance_tier: important
contextType: research
version: 1.0.0
---

# Deep Research Strategy - Spec Templates & Context Reducer (lineage: composer)

## 2. TOPIC
Test Reducer Engineering + $1.2M Agent Engineering harness concepts against system-speckit templates, documentation logic, and context/memory — classify every recommendation {already-exists / genuine-gap / not-applicable} with file:line evidence; produce ranked shortlist + refutation list. Report-only.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
[All key questions resolved at synthesis — see Section 6]
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implement any runtime, template, or doc change in this lineage.
- Reinvent or duplicate `system-deep-loop` reducers, findings-registry, or contradiction-supersession machinery.
- Expand scope outside templates / doc-logic / context-memory (except as cited prior art).
- Early synthesis before `maxIterations=2` (`stopPolicy: max-iterations`).

---

## 5. STOP CONDITIONS
- Hard stop at `maxIterations: 2` (`stopPolicy: max-iterations`).
- Convergence ratio is telemetry only; broaden angles instead of early STOP.
- Report-only; no product-file writes outside this artifact_dir.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- [x] Q1: Raw 5,541 LOC is maintainer source weight; fleet render at L1 is ~2,162 lines / ~14.6k est. tokens — core docs collapse via IF gates; `research.md.tmpl` stays ~945 lines at every level. (iteration 1)
- [x] Q2: Reducer Engineering validate→dedup→contradiction already ships in deep-loop (`reduce-state.cjs`, `contradiction-supersession`); template analogue is `renderInlineGates`. (iteration 1)
- [x] Q3: Default-FAIL ≈ Iron Law + completion verification; fresh evaluator ≈ deep-review LEAF; handoff ≈ handover + `_memory.continuity`; complexity-matches-task is documented in charter, not automated. (iteration 2)
- [x] Q4: `memory_context` has `enforceTokenBudget` (mode budgets 800–3500); `memory_search` has session dedup — no claim-normalization reducer across heterogeneous hits. (iteration 2)
- [x] Q5: Ranked shortlist + refutation list in `research.md`. (synthesis)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Fleet-wide `renderInlineGates` measurement falsified the naïve 5,541-LOC agent-context framing (iteration 1)
- Cross-surface harness mapping via constitutional + handler file:line citations (iteration 2)
- Treating deep-loop reducers as immovable prior art prevented duplicate-reducer proposals (iteration 1)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Searching for a missing "synthesis reducer" in speckit — already owned by deep-research `reduce-state.cjs` (iteration 1)
- Treating `memory_context` as lacking any token control — `enforceTokenBudget` is live (iteration 2)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### New speckit-side synthesis reducer — BLOCKED (iteration 1, 1 attempt)
- What was tried: Map Reducer Engineering Python reducer into system-speckit
- Why blocked: `contradiction-supersession` + findings-registry already implement claim relationship reduce/replay
- Do NOT retry: porting `reduce_findings()` into speckit
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Blind deletion of multi-level template bodies: IF gating already provides level slices (iteration 1, evidence: `inline-gate-renderer.ts:182`)
- Separate `progress.md` harness file: handover + continuity ladder already externalize session state (iteration 2, evidence: `feature-catalog.md` recovery chain)
- Standalone Default-FAIL microservice: Iron Law + `validate.sh --strict` + checklist gates cover completion (iteration 2)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 2
- Failed pivots: 0
- Audited overrides: 0
- Saturated: deep-loop reducer reinvention, memory has zero token control
- Pivot lineage: templates-weight → harness-memory-doc-logic
- Remaining frontier: optional template level gates, raw-tmpl read guard, claim-normalization pre-synthesis for memory (low priority)
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None — synthesis complete]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[Synthesis complete — see research.md]
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- resource-map.md not present at spec root; skipping coverage gate.
- Context sources: `context/Reducer Engineering.md`, `context/The $1.2M Agent Engineering skill.md`.
- Charter: `specs/system-speckit/033-spec-templates-and-context-reducer/spec.md`.
- Template path: `.opencode/skills/system-spec-kit/templates/manifest/*.tmpl` (13 files, 5,541 LOC raw).
- Doc logic: `shared/gate-3-classifier.ts`, Levels 1–3+, `scripts/spec/validate.sh`, `inline-gate-renderer`.
- Memory: `mcp-server/handlers/memory-context.ts` (`enforceTokenBudget`), `memory-search.ts` (`applySessionDedup`).

### Bounded Context Snapshot
- Source pointers: templates/manifest, gate-3-classifier.ts, validate.sh, memory-context.ts, deep-research-reducers, contradiction-supersession.
- Reuse candidates: `renderInlineGates`, `enforceTokenBudget`, Iron Law, handover continuity, deep-review LEAF evaluator.
- Integration points: `create.sh` + `INLINE_GATE_RENDERER`; SKILL.md scaffold mandate.
- Constraints: lineage write authority = this artifact_dir only.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 2
- Convergence threshold: 0.05 (telemetry only under max-iterations stopPolicy)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Lifecycle: new fan-out lineage `fanout-composer-1786515199922-z0hium`
- Current generation: 1
- Started: 2026-08-12T06:17:00Z
