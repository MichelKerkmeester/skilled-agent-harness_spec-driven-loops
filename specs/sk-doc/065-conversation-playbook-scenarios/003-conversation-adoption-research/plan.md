---
title: "Implementation Plan: Phase 3: conversation-adoption-research"
description: "Run a deep-research fan-out that applies the four ordered scenario-style questions to every playbook package, then synthesize a ranked adoption map in research/research.md."
trigger_phrases:
  - "conversation adoption research plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: conversation-adoption-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts |
| **Framework** | `/deep:research:auto` fan-out: a cli-codex lineage on `gpt-6-luna` xhigh fast, then a cli-devin lineage on `deepseek-v4-1-flash-max` for the packages the first skipped |
| **Storage** | `research/` state files and iteration notes |
| **Testing** | `validate.sh --strict` on the phase |

### Overview
The loop reads playbook packages and classifies their scenarios with the style rule in `sk-create-manual-testing-playbook/SKILL.md` §6. The orchestrating session merges the lineage, writes `research/research.md` and runs the closeout. No playbook, skill or runner file changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met: 56 of 56 packages carry a verdict
- [x] `validate.sh --strict` prints `RESULT: PASSED` for this phase
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-out research loop

### Key Components
- **`fanout-run.cjs`**: runs each lineage, one iteration per dispatch
- **`fanout-merge.cjs` and `reduce-state.cjs`**: merge findings and emit `resource-map.md`
- **`synthesis-closeout.cjs`**: records the synthesis event through the ledger gateway

### Data Flow
Each iteration writes a note and a delta. The merge builds `findings-registry.json`, the conductor writes `research.md` from the notes, and the closeout appends `synthesis_complete`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup binds the loop config, Implementation runs and merges the lineage, Verification writes the synthesis and validates.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/065-conversation-playbook-scenarios --strict --recursive` must print `RESULT: PASSED`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Luna quota through cli-codex, which ran out after iteration 8, and the Devin CLI for the second lineage.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The phase writes only inside its own folder. Reverting means deleting `003-conversation-adoption-research/` by exact path.
<!-- /ANCHOR:rollback -->

---
