---
title: "Implementation Plan: Stop free text hijacking Next Focus in research and review"
description: "Change the research continuity focus chain to drop answered carried-forward questions and read the leaf's Recommended Next Focus; change the review chain so an uncovered dimension outranks free leaf text. Prove it with new cases in three existing vitest suites."
trigger_phrases:
  - "focus hijack fix plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Stop free text hijacking Next Focus in research and review

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`) reducers, TypeScript tests |
| **Framework** | system-deep-loop runtime |
| **Storage** | None (reducers read iteration markdown, the state log and the registry) |
| **Testing** | vitest, run from `.skilled/skills/system-deep-loop/runtime` |

### Overview
Two reducer chains change: the research chain in `deep-research/scripts/reduce-state.cjs` plus its helper `runtime/lib/deep-loop/continuity-thread.cjs`, and the review base pick in `runtime/scripts/reduce-state.cjs`. The research side filters carried-forward items in the shared helper, by question shape and by answered status, and reads the leaf recommendation; the review side lets an uncovered dimension outrank free leaf text in the strategy and dashboard Next Focus. New cases in three existing suites prove each change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/deep-research-reduce-state.vitest.ts tests/unit/continuity-thread.vitest.ts tests/unit/deep-review-state-reducer.vitest.ts` exits 0, with the new P0 cases red before the change
- [ ] The playbook scenarios for both loops are written through `/create:manual-testing-playbook`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Ordered precedence chain. Each focus source is tried in a fixed order and the first non-empty one wins.

### Key Components
- **`continuity-thread.cjs`**: owns the research continuity order and the carried-forward list. Its only runtime caller is the research reducer (`deep-research/scripts/reduce-state.cjs`), so the change does not reach the review loop. The contract that must not break is the terminal sentinel when no machine question is open.
- **Research `buildRegistry`** (:2587): the one call site of `buildCarriedForwardOpenQuestions`. It passes the answered and resolved set, so the filtered list reaches every consumer: the suppressed-candidates builder (:2592-2594), the registry field (:2618), the metric (:2644), strategy section 11A (:2798-2801) and, through that section, the prompt pack every leaf reads (`deep-research.yaml:851`, `prompt-pack-iteration.md.tmpl:17`).
- **Research `resolveNextFocus`** (:2420-2473): keeps pivot focus first and blocked-stop recovery second, then hands the filtered inputs and the latest leaf `nextFocus` to the continuity function.
- **Review base pick** (`runtime/scripts/reduce-state.cjs:2183-2186`, dashboard twin `:2271-2273`): keeps the pivot and blocked-stop overrides, and changes only the base pick between leaf `nextFocus` and the first uncovered `REQUIRED_DIMENSIONS` entry. Review dispatch reads `{next_dimension}` from the strategy's remaining-dimension queue (`deep-review.yaml:904`), not this text; the agent reads the text (`.skilled/agents/deep-review.md:161`).

### Data Flow
Iteration markdown is parsed into `questionsRemaining` and `nextFocus`. The registry supplies open and resolved questions. Research: pivot, then blocked-stop, then continuity (sentinel when no machine question is open; otherwise the leaf recommendation unless answered, then carried-forward items that are question-shaped and unanswered, then finding follow-up, then the first machine question), then promoted idea. Review strategy and dashboard Next Focus: blocked-stop, then pivot, then uncovered dimension or a leaf `nextFocus` that names one, then the leaf text when all dimensions are covered.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup runs the three suites to record a green baseline and reads the two focus chains. Implementation adds the cases first, then changes `continuity-thread.cjs`, the research `buildRegistry` and `resolveNextFocus` inputs and the review base pick at both sites. Verification runs the three suites, checks the P0 cases were red before the change, and writes the playbook scenarios through `/create:manual-testing-playbook`. The ordered work and each task's verify clause live in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/deep-research-reduce-state.vitest.ts tests/unit/continuity-thread.vitest.ts tests/unit/deep-review-state-reducer.vitest.ts`. It must exit 0. Each P0 requirement in `spec.md` maps to one new case; write the case first and confirm it fails on the current code.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No new package or module. Build after `../005-prompt-pack-contract-alignment/`, whose heading fix makes the REQ-002 reader see pack-compliant narratives. This phase is a prerequisite of `../010-research-frontier-mode/`, and it lands before `../008-review-dimension-coverage/` and `../011-review-frontier-mode/`, which change the same review focus lines. No compiled contract digests a file this phase changes, so there is no regeneration step, and no agent definition changes, so there is no mirror sync.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a default research or review run picks a focus that skips an open counted question or an uncovered dimension it picked before. Revert the single commit that carries this phase; no state file or schema changes, so no data migration is needed. The playbook scenarios revert with it.
<!-- /ANCHOR:rollback -->

---
