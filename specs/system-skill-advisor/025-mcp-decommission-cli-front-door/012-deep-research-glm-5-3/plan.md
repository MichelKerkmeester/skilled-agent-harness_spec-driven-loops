---
title: "Implementation Plan: Phase 12: deep-research-glm-5-3"
description: "Dispatch one cli-pi lineage on the gateway's GLM-5.3-Flash route for four iterations with convergence disabled, write-contained to this phase's research tree, then verify by counting records and spot-checking citations."
trigger_phrases:
  - "glm 5.3 research dispatch plan"
  - "cli-pi gateway lineage"
  - "four iterations no convergence"
  - "citation spot check research"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Phase 12: deep-research-glm-5-3

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | The deep-loop fan-out runner, dispatching the Pi CLI |
| **Framework** | `/deep:research` in `:auto` mode, one lineage |
| **Storage** | Iteration records as JSONL plus a synthesized `research.md` under this phase's `research/` tree |
| **Testing** | Records counted, per-lineage status read, and cited commits and file ranges checked against the repository |

### Overview

One lineage, four iterations, convergence disabled so depth is not cut short. The executor is `cli-pi` on the bare `glm-5.3-flash` literal, which the fan-out maps to the LLM Gateway and pins to `max` effort. The brief is the one the prior lineage answered, unchanged, because agreement only means something when the question was the same.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fan-out with a single lineage. The runner owns the loop and builds the command; the leaf owns one iteration. The skill's contract is explicit that no packet-local wrapper or spawn path may be added, so the executor kind is used directly.

### Key Components
- **`fanout-run.cjs`**: allocates the lineage, composes the provider-qualified selector, enforces the model allowlist and the write boundary
- **The gateway route**: one literal maps to one provider, so the bare `glm-5.3-flash` resolves to the two-segment selector the gateway requires and nothing else
- **The effort pin**: this model is force-pinned to `max` rather than taking a caller's value, because the route carries that tier
- **The lineage directory**: the only place the run may write

### Data Flow

The runner composes the target string, dispatches one Pi turn per iteration with stdin redirected, and each leaf writes its own iteration record; the synthesis reads those records rather than the conversation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The prior lineage exited zero, wrote a complete synthesis, and fabricated every timestamp in its state log. So the exit status is not the check. The checks are the iteration record count, the per-lineage status, and a spot-check of cited commits and file ranges against the actual repository, which is what established that the prior synthesis was grounded rather than plausible.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The Pi CLI authenticated against the LLM Gateway, and the `glm-5.3-flash` route serving `max`. Both were probed live before this phase was written.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete this phase's `research/` tree. Nothing outside it is written, and no shipped surface depends on it.
<!-- /ANCHOR:rollback -->

---
