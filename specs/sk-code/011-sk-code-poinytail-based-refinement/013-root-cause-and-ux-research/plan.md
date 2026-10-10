---
title: "Implementation Plan: Phase 13: root-cause-and-ux-research"
description: "Run one ten-iteration deep-research lineage on DeepSeek V4.1 Flash through cli-pi, then check its claims against the repository and write a ranked synthesis."
trigger_phrases:
  - "root cause and ux research plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 13: root-cause-and-ux-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts; JSONL state |
| **Framework** | /deep:research auto workflow, fan-out runner |
| **Storage** | None |
| **Testing** | Spot-checks of cited lines and commands; strict spec validation |

### Overview
The /deep:research auto workflow spawns one cli-pi lineage through its fan-out step. Pi runs ten iterations and its own lineage synthesis. The orchestrator then reads the lineage output, checks each load-bearing claim, and writes `research/research.md` with VERIFIED and INFERRED marks and ranked phases.
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
Other: a detached fan-out research lineage with orchestrator-side synthesis.

### Key Components
- **fanout-run.cjs**: spawns the Pi lineage and contains its writes to the lineage folder.
- **Orchestrator synthesis**: verifies claims and writes the ranked report.

### Data Flow
Topic and config go to the runner, the lineage writes iterations and state under `research/lineages/dsflash-llmgw/`, and the orchestrator reads them into `research/research.md`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each load-bearing claim is checked by reading its cited line or by running the command it names. The SOURCE-tag loop in `goal.md` checks that every cited path and line exists.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `pi` binary and the llmgateway credential, with cline-pass as the fallback route.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete this phase folder and its parent phase-map row. No product file changes.
<!-- /ANCHOR:rollback -->

---
