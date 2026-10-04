---
title: "Implementation Plan: Phase 19: doctor-test-environment-research"
description: "Fan out /deep:research:auto over two lineages, DeepSeek V4.1 Flash for three iterations and LUNA 6 for two, then merge and check every load-bearing claim before synthesis."
trigger_phrases:
  - "doctor test environment research plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 19: doctor-test-environment-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts |
| **Framework** | The `/deep:research` auto workflow |
| **Storage** | `research/` state files behind the append gateway |
| **Testing** | Lineage artifact checks by the fan-out runner; targeted strict spec validation |

### Overview
The fan-out runner runs two independent lineages with stop policy `max-iterations`, one at a time: DeepSeek V4.1 Flash through cli-pi for three iterations and LUNA 6 through cli-codex for two. `fanout-merge.cjs` merges the registries, and the orchestrator checks each load-bearing claim before writing `research/research.md`.
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
Independent lineages with externalized state; the orchestrator owns setup, merge and synthesis.

### Key Components
- **Lineage**: one executor running its own loop under `research/lineages/<label>/`
- **Merge**: `fanout-merge.cjs` consolidates the registries and writes the attribution

### Data Flow
Each lineage writes its iterations and report, then the merge, then the orchestrator's synthesis.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each lineage must produce its `research.md`. Every load-bearing finding carried into the merged `research.md` is rechecked against the file or command it cites.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete the `research/` folder and revert the spec note; nothing outside this phase changed.
<!-- /ANCHOR:rollback -->

---
