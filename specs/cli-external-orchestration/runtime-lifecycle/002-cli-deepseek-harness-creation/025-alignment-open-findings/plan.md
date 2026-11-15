---
title: "Implementation Plan: Phase 25: alignment-open-findings"
description: "Fix the open alignment findings with doc edits, two intent-signal lists, a recompiled skill graph and one allowlist entry, then prove each with the check that named it and the full routing gate set."
trigger_phrases:
  - "alignment open findings plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 25: alignment-open-findings

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON |
| **Framework** | sk-doc document standards, the skill advisor graph |
| **Storage** | `skill-graph.json` |
| **Testing** | The two CI checks, the routing suites, `check-contract-drift.cjs`, `validate.sh --strict` |

### Overview
Each finding is fixed in the file that holds it. The doc claims come from the workflow YAML, `fanout-merge.cjs` and `relaunch-core.cjs`. The advisor fix adds phrases one at a time and keeps only those that leave every routing suite green.
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
- [x] Every routing suite passes
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Docs follow code. Vocabulary changes are tested against the full routing gate set before they stay.

### Key Components
- **Intent signals**: `graph-metadata.json` per skill feeds the compiled `skill-graph.json` and the advisor
- **Routing suites**: the scorer, holdout, divergence and golden-prompt tests plus the corpus floors

### Data Flow
An intent signal changes the compiled graph. The advisor rebuild reads it, and the suites score the fixed corpora against their baselines.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup reruns each failing check. Implementation edits the docs, then the signals. Verification reruns every check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each finding is rechecked with the command that named it. The routing suites run after every signal change.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a routing suite fails after merge. Revert the two `graph-metadata.json` edits, recompile `skill-graph.json` with `skill_graph_compiler.py --export-json` and rerun the suites.
<!-- /ANCHOR:rollback -->

---
