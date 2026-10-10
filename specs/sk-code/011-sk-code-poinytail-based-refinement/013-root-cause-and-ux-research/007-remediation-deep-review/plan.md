---
title: "Implementation Plan: Phase 7: remediation-deep-review"
description: "One five-iteration cli-pi review lineage over the six fix phases, then an orchestrator synthesis that reruns every finding before keeping it."
trigger_phrases:
  - "remediation deep review plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: remediation-deep-review

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, TypeScript, JSON fixtures, Markdown |
| **Framework** | `/deep:review` loop on the shared deep-loop runtime |
| **Storage** | Lineage state under `review/lineages/` |
| **Testing** | node --test, vitest, the hub canary script |

### Overview
One five-iteration cli-pi review lineage over the six fix phases, then an orchestrator synthesis that reruns every finding before keeping it.
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
Other: a detached review lineage plus an orchestrator synthesis.

### Key Components
- **`fanout-run.cjs`**: runs the lineage through the workflow's fan-out step
- **`goal-file-manifest.txt`**: the review scope the lineage's scope discovery reads
- **`review/review-report.md`**: the confirmed findings

### Data Flow
The lineage reads the manifest and spec, writes five iterations into its own directory, and the merge step folds its registry into `review/`. The orchestrator then reruns each finding and writes the report.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Rerun every regression gate the brief names from the final state, and reproduce each lineage finding with a probe or a read before it enters the report.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `pi` binary with the llmgateway credential, or cline-pass as the fallback route.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert this phase's single commit with `git revert`. It touches only spec-folder files.
<!-- /ANCHOR:rollback -->

---
