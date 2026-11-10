---
title: "Implementation Plan: Phase 1: authoring-ux-research"
description: "Run a ten-iteration deep-research lineage on DeepSeek V4.1 Flash through cli-pi over sk-create-skill and system-skill-advisor, verify its load-bearing claims by hand, and synthesize ranked authoring-time fixes."
trigger_phrases:
  - "skill authoring ux research plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: authoring-ux-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js scripts, Python scripts, JSON manifests and Markdown skill docs, read only |
| **Framework** | `/deep:research` auto workflow with the shared fan-out runner |
| **Storage** | JSONL state and Markdown under `research/` |
| **Testing** | Orchestrator reruns of the advisor battery, the leaf-manifest check and the doctor checks |

### Overview
One cli-pi lineage runs up to ten research iterations over the two skills and the 092 child records. The orchestrator then reruns each load-bearing claim and writes the synthesis, ending with implementation phases ranked by how many 092-class errors each prevents per unit of cost.
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
Fan-out research lineage, then orchestrator verification and synthesis

### Key Components
- **fanout-run.cjs**: runs the single cli-pi lineage and its iterations
- **Orchestrator**: verifies claims and writes `research/research.md`

### Data Flow
The lineage reads the two skills and the 092 records, writes iterations and deltas under `research/lineages/<label>/`, and the orchestrator reads those into the synthesis.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No product code changes, so no tests run against product code. The orchestrator reruns the advisor battery, the leaf-manifest check, the doctor parent-skill-check, the intent-signal check and the skill-graph freshness panel to verify the load-bearing claims.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The cli-pi executor with DeepSeek V4.1 Flash through the LLM Gateway route, with `cline-pass/deepseek-v4.1-flash` as the fallback.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. Only this packet, one phase-map row in the parent spec.md and one binding row in the parent goal.md change.
<!-- /ANCHOR:rollback -->

---

