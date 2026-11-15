---
title: "Implementation Plan: Phase 24: terminal-gates-script"
description: "Add a terminal-gates script that reuses the stop decision's facts and gate rules, export two readers from convergence.cjs, and make the deep-review terminal gate step call it. DeepSeek V4.1 Flash max builds each task through cli-pi."
trigger_phrases:
  - "terminal gates script plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 24: terminal-gates-script

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS on Node, workflow YAML |
| **Framework** | The deep-loop runtime and the `/deep:review` workflow |
| **Storage** | The run's config, JSONL state log and findings registry, read only |
| **Testing** | Vitest in `.skilled/skills/system-deep-loop/runtime` |

### Overview
The script builds the review facts with `buildStopDecisionInput`, takes evidence and coverage from `evaluateReviewLegalStopGates`, and computes scope from `reviewScopeFiles`. The workflow step binds the script's two outputs and keeps its existing ledger append.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Runtime suite and typecheck baselined

### Definition of Done
- [x] `terminal-gates.vitest.ts` passes and the suite matches the baseline plus it
- [x] `check-contract-drift.cjs` passes
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One script over the existing gate rules.

### Key Components
- **`terminal-gates.cjs`**: computes the three rows and their digests.
- **`record_terminal_gates`**: runs it at every terminal stop and appends the ledger event.

### Data Flow
At a terminal stop the workflow runs the script on the config, state log and registry, binds its two outputs, and appends `deep_review.terminal_gates_recorded`. The verdict step reads that event as before.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`: baseline, the script, the workflow step, then the checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Unit cases build minimal config, registry and state rows for each pass and fail. The script also runs on recorded review packets under `specs/` as a smoke check. The full suite, typecheck and the contract drift check run against the baseline.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node:crypto` for the digests. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit; the step returns to its prose rules and the contracts recompile on the next commit.
<!-- /ANCHOR:rollback -->

---

