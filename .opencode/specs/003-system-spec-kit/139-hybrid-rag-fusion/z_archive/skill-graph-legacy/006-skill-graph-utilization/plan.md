---
title: "Implementation Plan: Skill Graph Utilization Testing [006-skill-graph-utilization/plan]"
description: "This plan implements a lightweight test harness that wraps the SGQS CLI to execute structured queries on behalf of 5 developer personas. Five parallel sub-agents (one per person..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "skill"
  - "graph"
  - "utilization"
  - "006"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Skill Graph Utilization Testing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (SGQS), Python (skill_advisor.py), Bash (CLI) |
| **Framework** | Custom test harness |
| **Storage** | None (file-based scratch output) |
| **Testing** | Manual agent-based validation |

### Overview

This plan implements a lightweight test harness that wraps the SGQS CLI to execute structured queries on behalf of 5 developer personas. Five parallel sub-agents (one per persona) each run 4+ scenarios, score results using a 0–5 rubric, and write JSON result files. A final synthesis step aggregates all scores, computes cross-cutting metrics, and produces a utilization report.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (aggregate >= 3.0, error resilience 100%)
- [x] Dependencies identified (SGQS engine, skill_advisor.py, graph index)

### Definition of Done

- [ ] All 5 persona test suites executed and JSON results written to scratch/
- [ ] Aggregate score computed and assessment tier assigned
- [ ] Utilization report written with cross-cutting metrics
- [ ] Spec/plan/tasks docs reflect final state
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

CLI test harness → parallel agent delegation → result aggregation

### Key Components

- **Test Harness Script** (`scratch/test-harness.sh`): Wraps SGQS CLI, accepts persona and scenario inputs, outputs structured JSON; includes error capture on stderr
- **Persona Agent Suites** (T003–T007): Five parallel sub-agents each holding a developer persona context, executing 4+ scenarios, and scoring outputs against the rubric
- **Result Aggregator** (T008): Reads all persona JSON files, computes per-persona averages and overall aggregate, evaluates cross-cutting metrics
- **Utilization Report** (`scratch/utilization-report.md`): Human-readable synthesis of all results, tier assessment, and recommendations

### Data Flow

Test harness script accepts scenario input → calls SGQS CLI → captures response JSON → persona agent scores response (0–5) → writes result to scratch/results-{persona}.json → aggregator reads all result files → computes aggregate + metrics → writes utilization-report.md
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Spec folder documentation created (spec.md, plan.md, tasks.md)
- [ ] Test harness script authored and validated against SGQS CLI
- [ ] Scoring rubric defined and included in harness or as inline reference

### Phase 2: Execution

- [ ] Git persona agent (T003): 4+ scenarios executed and scored
- [ ] Frontend persona agent (T004): 4+ scenarios executed and scored
- [ ] Docs persona agent (T005): 4+ scenarios executed and scored
- [ ] Full-Stack persona agent (T006): 4+ scenarios executed and scored
- [ ] QA persona agent (T007): 4+ scenarios executed and scored

### Phase 3: Synthesis

- [ ] All JSON result files collected from scratch/
- [ ] Aggregate score computed; assessment tier assigned
- [ ] Cross-cutting metrics evaluated against targets
- [ ] Utilization report written and reviewed
- [ ] Memory context saved
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | SGQS query execution per scenario | Bash harness + SGQS CLI |
| Agent-scored | Response quality rated 0–5 per scenario | Sub-agent rubric evaluation |
| Aggregate | Cross-cutting metrics vs. targets | Manual calculation in aggregation step |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| SGQS query engine | Internal | Green | Harness cannot execute; all testing blocked |
| skill_advisor.py | Internal | Green | Skill routing scores unavailable for comparison |
| Graph index (73 nodes, 9 skills) | Internal | Green | Query results would be empty or incorrect |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not applicable — this is a testing-only exercise with no code changes
- **Procedure**: All artifacts are written to scratch/ and can be deleted without impact to the codebase
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
