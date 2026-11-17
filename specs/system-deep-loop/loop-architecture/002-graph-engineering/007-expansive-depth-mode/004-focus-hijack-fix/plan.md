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
Two reducer chains change: the research chain in `deep-research/scripts/reduce-state.cjs` plus its helper `runtime/lib/deep-loop/continuity-thread.cjs`, and the review chain in `runtime/scripts/reduce-state.cjs`. The research side filters answered questions and reads the leaf recommendation; the review side lets an uncovered dimension outrank free leaf text. New cases in three existing suites prove each change.
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
- [ ] `npx vitest run deep-research-reduce-state continuity-thread deep-review-state-reducer` from `.skilled/skills/system-deep-loop/runtime` exits 0, with the new P0 cases red before the change
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Ordered precedence chain. Each focus source is tried in a fixed order and the first non-empty one wins.

### Key Components
- **`continuity-thread.cjs`**: owns the research continuity order. Its only runtime caller is the research reducer (`deep-research/scripts/reduce-state.cjs`), so the change does not reach the review loop. The contract that must not break is the terminal sentinel when no machine question is open.
- **Research `resolveNextFocus`**: keeps pivot focus first and blocked-stop recovery second, then hands the filtered inputs and the latest leaf `nextFocus` to the continuity function.
- **Review focus block** (`runtime/scripts/reduce-state.cjs:2184-2215`): keeps blocked-stop and pivot overrides, and changes only the base pick between leaf `nextFocus` and the first uncovered `REQUIRED_DIMENSIONS` entry.

### Data Flow
Iteration markdown is parsed into `questionsRemaining` and `nextFocus`. The registry supplies open and resolved questions. Research: pivot, then blocked-stop, then continuity (sentinel when no machine question is open; otherwise the leaf recommendation unless answered, then carried-forward free text with answered keys removed, then finding follow-up, then the first machine question), then promoted idea. Review: blocked-stop, then pivot, then uncovered dimension or a leaf `nextFocus` that names one, then the leaf text when all dimensions are covered.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup runs the three suites to record a green baseline and reads the two focus chains. Implementation changes `continuity-thread.cjs`, the research `resolveNextFocus` inputs and the review focus block, then adds the cases. Verification runs the three suites and checks the P0 cases were red before the change. The ordered work and each task's verify clause live in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run `npx vitest run deep-research-reduce-state continuity-thread deep-review-state-reducer` from `.skilled/skills/system-deep-loop/runtime`. It must exit 0. Each P0 requirement in `spec.md` maps to one new case; write the case first and confirm it fails on the current code.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None. No new package or module. This phase is a prerequisite of `../010-research-frontier-mode/`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a default research or review run picks a focus that skips an open counted question or an uncovered dimension it picked before. Revert the single commit that carries this phase; no state file or schema changes, so no data migration is needed.
<!-- /ANCHOR:rollback -->

---
