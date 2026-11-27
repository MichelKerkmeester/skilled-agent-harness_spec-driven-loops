---
title: "Implementation Plan: Fan-out review lineages that skip the terminal stop gate and record rows under the wrong run"
description: "Name the stop gate and the run identity in the lineage prompt, and add two deterministic refusals, one in the append gateway and one in the synthesis closeout, so a lineage that skips its gate or names another run is stopped in session."
trigger_phrases:
  - "vibe review terminal gates plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Fan-out review lineages that skip the terminal stop gate and record rows under the wrong run

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS scripts |
| **Framework** | Deep-loop runtime |
| **Storage** | Append-only ledger frames and the projected state log |
| **Testing** | Vitest |

### Overview
The lineage prompt built by `buildLoopPrompt` gains a stop gate block for review lineages and a run identity block for every lineage. The append gateway refuses a lineage row that names the root run or a closeout event that names another run. The synthesis closeout refuses a review lineage that reached synthesis without a `terminal_gates` row, so the lineage can still run the gate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `npx vitest run --no-coverage` in `.skilled/skills/system-deep-loop/runtime` prints `Test Files 226 passed` and no failure
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Guard at the producer

### Key Components
- **`buildLoopPrompt` in `fanout-run.cjs`**: tells the lineage model what to run at the stop and which session id to use. Without it the model never sees the gate.
- **`lineageScopeRefusal` in `append-mode-event.cjs`**: the one door into a lineage's ledger, so a row naming another run stops there. Without it a copied config passes every append.
- **`assertReviewLineageStopGate` in `synthesis-closeout.cjs`**: every lineage observed runs the closeout, so it is where a skipped gate can still be caught in session.

### Data Flow
The lineage model hands each state record to the gateway, which checks the scope against the lineage and root configs before the ledger append. At synthesis the closeout reads the lineage state log, and stages its event only when a `terminal_gates` row is present.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`tests/unit/fanout-lineage-run-identity.vitest.ts` runs the real gateway and closeout CLIs against temporary lineage folders and checks the built prompt. Each refusal test fails against the unchanged scripts. The full runtime suite runs before and after. The two default golden prompts are regenerated with `GOLDEN_UPDATE=1`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a legitimate lineage append or close-out is refused. Revert the changes to the three scripts and the two golden fixtures, and delete the new test file.
<!-- /ANCHOR:rollback -->

---
