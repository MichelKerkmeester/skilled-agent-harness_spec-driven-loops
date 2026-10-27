---
title: "Implementation Plan: Phase 1: deep-research"
description: "Run two parallel DeepSeek V4.1 Flash research lanes through the deep-loop fan-out, merge them, and check the load-bearing git source claims by hand."
trigger_phrases:
  - "deep research plan"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: deep-research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, git v2.50.1 C source, Node.js deep-loop runtime |
| **Framework** | `/deep:research` fan-out (`fanout-run.cjs`, `fanout-merge.cjs`) |
| **Storage** | JSONL state logs and Markdown under `research/` |
| **Testing** | `validate.sh --strict` and direct reads of the cited source |

### Overview
Run the five questions from `../scratch/findings.md` through two parallel `cli-opencode` lanes of DeepSeek V4.1 Flash at `max` effort, three iterations each, with convergence treated as telemetry. Merge the lanes with `fanout-merge.cjs`, emit the resource map, and write one synthesis. Check the load-bearing git source and repository claims directly before the synthesis marks them verified.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: `../scratch/findings.md` sections 1 to 8
- [x] Success criteria measurable: SC-001 and SC-002 are `rg` counts
- [x] Dependencies identified: `opencode` with both providers configured

### Definition of Done
- [x] All acceptance criteria met
- [x] `rg -n '^### Q[1-5]\.' research/research.md` prints five lines and `rg -n '^### Layer [1-4]' research/research.md` prints four
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parallel lanes, single merge.

### Key Components
- **`fanout-run.cjs`**: runs each lane as its own lineage, with a containment guard over the git working tree.
- **`fanout-merge.cjs`**: merges lane findings into `deep-research-findings-registry.json` and writes `fanout-attribution.md`.
- **`reduce-state.cjs --emit-resource-map`**: writes `research/resource-map.md`.

### Data Flow
Each lane reads the findings record, runs one iteration per dispatch and appends to its own state log. The merge reads every lane's registry. The orchestrator writes `research/research.md` from the lane syntheses and its own source checks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A. This phase changes no code. The affected surfaces of the fix are inventoried in `research/research.md` section 5 Q4 and owned by phases 002 to 004.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup writes the run config, implementation runs and merges the lanes, and verification checks the source claims and validates the folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | N/A, no code changes | None |
| Integration | Lane merge and resource map | `fanout-merge.cjs`, `reduce-state.cjs` |
| Manual | git v2.50.1 source lines and repository lines the synthesis relies on | `curl` of the tagged source, `git show`, `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `llmgateway/deepseek-v4.1-flash-1017` | External | Green | Lane one cannot run |
| `opencode-go/deepseek-v4.1-flash` | External | Red, monthly quota exhausted | Lane two moved to `llmgateway/deepseek-v4.1-flash` on the operator's choice |
| git v2.50.1 source on GitHub | External | Green | Source claims stay INFERRED |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The synthesis is found to rest on a wrong source claim.
- **Procedure**: Research artifacts change nothing outside `research/`. Correct `research/research.md` or delete the folder and rerun the fan-out.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `../scratch/findings.md` | Implementation |
| Implementation | Setup, a working model provider | Verification |
| Verification | Both complete lanes | Phase 002 planning |
<!-- /ANCHOR:phase-deps -->

---
