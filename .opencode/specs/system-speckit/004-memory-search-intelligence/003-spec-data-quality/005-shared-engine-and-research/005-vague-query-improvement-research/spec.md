---
title: "Spec: 005 Post-Benchmark Improvement Research [template:level_2/spec.md]"
description: "A 10-angle deep-research study, seeded by the 029 model benchmark, on how to improve the 005 spec-data-quality program further. Covers the score-calibration false-relevance the benchmark exposed, re-prioritization of the un-built levers, and the adherence and logic-reading jobs the benchmark never touched. Read-only, the synthesized and adversarially-verified proposals live in research/research.md, no calibration or lever code is modified."
trigger_phrases:
  - "005 improvement research"
  - "data quality calibration research"
  - "off-corpus false-relevance fix"
  - "spec data quality next steps"
  - "post-benchmark 005 research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/005-shared-engine-and-research/005-vague-query-improvement-research"
    last_updated_at: "2026-07-04T17:12:05.502Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed 10-angle research, synthesized and verified the proposals"
    next_safe_action: "Decide which verified proposals warrant a build phase"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: 005 Post-Benchmark Improvement Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-22 |
| **Branch** | `system-speckit/004-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../004-vague-query-model-benchmark/spec.md |
| **Successor** | ../006-generated-metadata-quality-research/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The original 005 research decided which data-quality levers were worth building. The 029 model benchmark then ran 144 read-only `/memory:search` dispatches and exposed a sharper truth: the data-quality envelope the command emits is sound and model-robust, but the score calibration underneath it false-confirms off-corpus terms. The term `kubernetes` earned a good verdict at 0.78 on a semantically unrelated doc, identical across all four models, so the gate cited a spurious match with confidence. No follow-on research has re-examined the 005 priorities or the calibration fix in light of this evidence, and the benchmark only measured the retrieval job, leaving the adherence and logic-reading jobs unexamined.

### Purpose
Produce a prioritized, evidence-grounded set of improvement proposals for 005, seeded by the benchmark and spanning ten angles, then adversarially verify the load-bearing proposals with an independent model. The deliverable is the research synthesis and a recommended next-build order, not an implementation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Ten angle-diverse read-only research iterations covering the calibration false-relevance, gap-detection, envelope fidelity, citation grounding, a red-team eval set, absolute-relevance re-fit, un-built lever re-prioritization, the quality-loop scorer, the adherence and logic-reading jobs, and model-driver defaulting
- A synthesis that deduplicates and ranks the proposals by priority and benefit over effort
- An independent adversarial verification of the top proposals by a different model

### Out of Scope
- Implementing any proposal or modifying the calibration, scorer, command, or lever code
- Re-running the original lever-selection research, this study only re-prioritizes against new evidence
- Any change to the eval harness beyond proposing a red-team class

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| research/research.md | Create | The synthesized and verified improvement proposals |
| research/deltas/ | Create | The ten per-angle finding sets |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ten angles researched with file-grounded evidence | research/research.md carries proposals from each angle, every load-bearing claim cites a file it read |
| REQ-002 | Proposals synthesized and ranked | A deduplicated ranked proposal set with priority and effort, merging overlapping angles |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Top proposals adversarially verified by a different model | The load-bearing proposals carry an independent verdict from a non-claude model |
| REQ-004 | Read-only, no production code modified | git shows zero changes under the calibration, scorer, command, or lever trees |
| REQ-005 | Per-angle evidence retained | research/deltas/ holds the ten finding sets |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A ranked improvement-proposal set for 005, each proposal attributed to evidence and an effort, with the calibration false-relevance addressed concretely
- **SC-002**: A recommended next-build order that re-prioritizes the un-built levers against the benchmark evidence
- **SC-003**: The top proposals survive independent adversarial verification, with refuted or downgraded ones marked
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A research seat proposes a fix that the code already implements | Inflated proposal count | Each seat reads the real source and lowers priority on already-solved items, the verify pass refutes the rest |
| Risk | Single-model research misses what that model is blind to | Coverage gap | The top proposals are verified by a different model, gpt-5.5-fast, which catches claude self-misses |
| Dependency | The 029 benchmark evidence as the research seed | Without it the calibration weakness is unmotivated | The benchmark results in 029 are the cited source of truth |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Ten bounded angle seats run in parallel, each scoped to its files so it stays within context
- **NFR-P02**: The verification pass is scoped to the top proposals only, so it fits a single-dimension model dispatch

### Security
- **NFR-S01**: Every research and verification seat is read-only, no seat can mutate calibration, scorer, command, or lever code
- **NFR-S02**: The orchestrator owns all writes, confined to the packet research tree

### Reliability
- **NFR-R01**: Each proposal cites a file the seat actually read, a claim without evidence is dropped in synthesis
- **NFR-R02**: The load-bearing proposals are verified by a different model than the one that surfaced them
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Already-solved proposal: the seat marks it solved in the problem field and lowers priority, synthesis drops it
- Overlapping proposals from different angles: synthesis merges them into one ranked entry
- An angle with no real finding: returns an empty or low-priority set rather than padding

### Error Scenarios
- A proposal whose evidence does not survive verification: marked refuted or downgraded, not silently kept
- A seat that dies mid-run: filtered out, its angle noted as missing rather than counted

### State Transitions
- Find to verify: only the load-bearing or surprising proposals advance to the independent model
- Research to recommendation: the ranked set becomes a next-build order, not an implementation
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Ten angles across calibration, levers, scorer, command, and two un-measured jobs |
| Risk | 6/25 | Read-only research, low blast radius, no code change |
| Research | 18/20 | Ten angle-diverse seats with an independent cross-model verification pass |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Which verified proposals warrant a build phase versus a backlog entry
- Whether the calibration re-fit needs its own measurement phase before any code change
<!-- /ANCHOR:questions -->
