---
title: "Implementation Plan: Phase 11: deep-research-swe-2"
description: "Dispatch one cli-devin lineage at swe-2-max for five iterations with convergence disabled, write-contained to this phase's research tree, then read the iteration records rather than the exit status."
trigger_phrases:
  - "swe-2 research dispatch plan"
  - "deep research fan-out lineage"
  - "write containment research"
  - "five iterations no convergence"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Phase 11: deep-research-swe-2

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | The deep-loop fan-out runner, dispatching the Devin CLI |
| **Framework** | `/deep:research` in `:auto` mode, one lineage |
| **Storage** | Iteration records as JSONL plus a synthesized `research.md` under this phase's `research/` tree |
| **Testing** | Iteration records counted and read; the orchestration summary checked for a stalled lineage |

### Overview

One lineage, five iterations, convergence disabled so depth is not cut short. The executor is `cli-devin` at `swe-2-max`, which the preceding cutover packet added to the fan-out allowlist and dispatch-verified. The run is bound to this phase folder, so its write authority and Gate 3 answer are pre-resolved and no leaf stops to ask.
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

Fan-out with a single lineage. The runner owns the loop, the leaf owns one iteration, and the orchestrator neither reviews nor summarizes on the leaf's behalf.

### Key Components
- **`fanout-run.cjs`**: allocates the lineage, builds the Devin command, enforces the model allowlist and the write boundary
- **The lineage directory**: the only place the run may write. Edits made to packet documents while the loop is live are reverted by containment, with the discarded patch saved for recovery
- **`orchestration-summary.json`**: per-lineage status, which is what distinguishes a completed run from one that exited zero after a single iteration

### Data Flow

The runner composes the target string, dispatches one Devin turn per iteration, and each leaf writes its own iteration record into the lineage directory; the synthesis reads those records rather than the conversation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

A green exit proves nothing here: a lineage can stall after one iteration and still exit zero, which this packet has seen. The check is the iteration record count and the per-lineage status in the orchestration summary, read rather than inferred.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`swe-2-max` in the fan-out allowlist, which the preceding cutover added, and an authenticated Devin CLI at 3000.10.21 or later.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete this phase's `research/` tree. Nothing outside it is written, and no shipped surface depends on it.
<!-- /ANCHOR:rollback -->

---
