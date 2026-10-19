---
title: "Implementation Plan: Phase 10: post-fix-research"
description: "Run five DeepSeek V4.1 Flash max research iterations through cli-pi with the deep-research fan-out runner, merge the lineage, and verify every finding at its cited line."
trigger_phrases:
  - "post fix research plan"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: post-fix-research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | The deep-loop runtime; the relaunch loop as the research target |
| **Framework** | `/deep:research` through `fanout-run.cjs` |
| **Storage** | `research/lineages/deepseek-pi/` with its ledger, state log and iterations |
| **Testing** | Verification of each cited line instead of tests |

### Overview
One lineage through the fan-out runner, so the runner owns setup, dispatch and the gateway writes. `fanout-merge.cjs` builds the merged registry. A read-only verifier opens every cited line, the orchestrator re-reads the top finding, and the report carries the verified verdicts.
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
The `/deep:research` fan-out route with a single `--executors` entry, which hands the whole loop to the runner.

### Key Components
- **`fanout-run.cjs`**: runs the cli-pi lineage, builds its brief and enforces containment.
- **`append-mode-event.cjs`**: the only writer of the lineage's state log.
- **`fanout-merge.cjs`**: merges the lineage registry into `research/`.

### Data Flow
The runner starts `pi` with the brief. Each iteration writes its narrative and delta and hands its record to the gateway. After five iterations the lineage writes its synthesis, the runner reports `fulfilled`, and the merge writes the combined registry.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Verification | Every cited line of all twenty findings | A read-only verifier, then the orchestrator's re-read of P1-1 |
| Run health | Gateway refusals, runner status, iteration files | `gateway-refusals.jsonl`, `orchestration-summary.json` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `pi` with the `llmgateway` provider | External | Green | No lineage could run |
| The gateway brief fix merged as `64a47e5157` | Internal | Green | A CLI lineage could write its state log directly and be refused |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the report is wrong or unwanted.
- **Procedure**: revert the phase commit; no code changed.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Scaffold ──► Lineage run ──► Merge ──► Verification ──► Report
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Scaffold | Phase 009 merged | Lineage run |
| Lineage run | Scaffold | Merge |
| Verification | Merge | Report |
| Report | Verification | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Scaffold and parent rows |
| Core Implementation | Low | One runner call, about 12 minutes |
| Verification | Med | Twenty findings |
| **Total** | | **About an hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): no data changes
- [x] Feature flag configured: not applicable
- [x] Monitoring alerts set: not applicable

### Rollback Procedure
1. Revert the phase commit.
2. Rerun recursive strict validation on the parent.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
