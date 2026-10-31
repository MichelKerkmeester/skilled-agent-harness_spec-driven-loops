---
title: "Implementation Plan: deep review remediation"
description: "Run the deep-review loop through the runtime's fan-out runner, verify each finding against the files, then fix the code finding at the shared seam and close the document findings with evidence."
trigger_phrases:
  - "deep review remediation plan"
  - "fan-out runner review lineage"
  - "shared index invariant"
  - "closure rows with evidence"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: deep review remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM retrieval scripts, vitest, spec-kit markdown |
| **Framework** | system-deep-loop review runtime, cli-codex executor |
| **Storage** | The packet's `review/` tree |
| **Testing** | vitest retrieval suites, validate.sh --strict recursive |

### Overview
The review ran as one cli-codex lineage with a max-iterations stop policy so convergence could not end it early. Each finding was re-read at its cited location before any change. The code finding moved the generator's publish-time structural checks into the shared artifact library so the reader enforces the same invariant; the document findings were closed by evidence, not by deleting rows.
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Review loop plus targeted remediation

### Key Components
- **Fan-out runner**: ran the lineage, enforced write containment, preserved the misplaced iteration-9 files rather than adopting them
- **Shared index invariant**: one function both the generator and the reader call

### Data Flow
Iteration files and JSONL deltas accumulate under the lineage; the report synthesizes them; the orchestrator verifies each finding at its source and applies fixes outside the lineage tree after the runner exits.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Four reader fail-closed cases added; the trigger-index and parity suites pass (76 tests). The index regenerates byte-identical after the document edits.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Codex ChatGPT OAuth was logged in; the lineage ran for about 49 minutes over nine iterations, then about 43 minutes for the resumed tenth iteration and synthesis.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the two remediation commits; the review artifacts are additive.
<!-- /ANCHOR:rollback -->

---

