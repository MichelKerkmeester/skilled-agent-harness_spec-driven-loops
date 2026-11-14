---
title: Deep Research Strategy - dsh-rc3 Lineage
description: Runtime strategy for the dsh-rc3 fan-out lineage researching the two DeepSeek Harness route patches.
trigger_phrases:
  - "dsh route patches"
  - "deepseek-v4.1-flash-1017 route"
  - "opencode-go deepseek route"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - dsh-rc3 Lineage

## 1. OVERVIEW

### Purpose

Persistent brain for the dsh-rc3 fan-out lineage. It records what to investigate, what worked, what failed, and where to focus next. The workflow reducer rewrites the machine-owned sections after each iteration.

### Usage

- Init: the lineage config, this strategy, and the findings registry are created inside the lineage artifact directory.
- Per iteration: the leaf reads Next Focus, writes `iterations/iteration-NNN.md`, records one iteration record through the append gateway, and writes `deltas/iter-NNN.jsonl`.
- The reducer owns Sections 3, 6, 7-11A after each iteration.

---

## 2. TOPIC

Which endpoint, model id and reasoning effort do the two dsh route patches in .dsh/patches configure? Cite each with its path and line.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which provider and base URL does .dsh/patches/route-llmgateway-deepseek.patch.yml configure?
- [x] Which model id and default reasoning effort does .dsh/patches/route-llmgateway-deepseek.patch.yml configure?
- [x] Which provider and base URL does .dsh/patches/route-opencode-go-deepseek.patch.yml configure?
- [x] Which model id and default reasoning effort does .dsh/patches/route-opencode-go-deepseek.patch.yml configure?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do not modify or re-generate either route patch; this is read-only research of checked-in configuration.
- Do not implement, validate, or dispatch any dsh run.
- Do not mutate the owning spec packet or any path outside the lineage artifact directory.

---

## 5. STOP CONDITIONS

- The configured hard cap is `maxIterations: 1`; the loop stops after one iteration with `maxIterationsReached`.
- All four key questions are answerable from the two checked-in patch files, so one iteration is sufficient.
- No convergence signal can extend the loop past the hard cap.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which provider and base URL does .dsh/patches/route-llmgateway-deepseek.patch.yml configure?
- Which model id and default reasoning effort does .dsh/patches/route-llmgateway-deepseek.patch.yml configure?
- Which provider and base URL does .dsh/patches/route-opencode-go-deepseek.patch.yml configure?
- Which model id and default reasoning effort does .dsh/patches/route-opencode-go-deepseek.patch.yml configure?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading each patch in full with line numbering produced exact, verifiable citations in one pass, and the harness route selector plus `.dsh` docs cross-checked the patch content without a second derivation ambiguity. (iteration 1)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Nothing failed. Composing the patches with `dsh --dump-config` was deliberately not run: the ask is what the checked-in patches configure, and a runtime probe would add environment state without improving line-level provenance. (iteration 1)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

None. The continuity ladder found no prior research context on the two route patches: `handover.md` is absent, the packet's `implementation-summary.md` and `spec.md` carry no route-patch statements, and `resource-map.md` is not present (coverage gate skipped).

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 1
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output in the lineage directory
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: the reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `.deep-research-pause` in the lineage directory
- Current generation: 1
- Started: 2026-11-14T17:16:01.000Z
