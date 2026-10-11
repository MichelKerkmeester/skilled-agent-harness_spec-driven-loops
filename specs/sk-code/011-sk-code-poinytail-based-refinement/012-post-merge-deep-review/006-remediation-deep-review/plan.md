---
title: "Implementation Plan: Phase 6: remediation-deep-review"
description: "Run five /deep:review iterations on the remediation commits through cli-pi, then verify every iteration finding by rerun or read before it enters the report."
trigger_phrases:
  - "remediation deep review plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: remediation-deep-review

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js hooks and scripts, Bash, Markdown |
| **Framework** | `/deep:review` auto workflow, cli-pi executor |
| **Storage** | Review ledger and state log under `review/` |
| **Testing** | Reruns of each touched suite and of each new test against the pre-fix code |

### Overview
Drive the auto workflow's per-iteration steps for five iterations with stop policy `max-iterations`, one focus per iteration across the six commits. Then synthesize: rerun or read every finding and keep only the confirmed ones.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Externalized-state review loop

### Key Components
- **Iteration driver**: renders the prompt pack, dispatches cli-pi, verifies, reduces and upserts the graph
- **Synthesizer**: the orchestrating agent, which proves each finding before it enters the report

### Data Flow
Each iteration appends a ledger event and writes `iterations/iteration-NNN.md` and `deltas/iter-NNN.jsonl`. The reducer refreshes the registry, and the synthesizer reads all five iterations into `review-report.md`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Every new test was run against a pre-fix copy of its hook built with `git archive` in a temp directory, and every neighbouring suite was rerun at HEAD.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

DevPass on the LLM gateway, with Cline Pass as the fallback route.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit. It changes only docs in the 012 packet.
<!-- /ANCHOR:rollback -->

---

