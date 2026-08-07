---
title: "Feature Specification: 116/001 — Deep Review Complexity Research Synthesis"
description: "Research why focused deep-research bug-finding can surface more actionable defects than the deep-review workflow, and identify changes that would make deep-review less surface-level. This packet completed an evidence-only 15-iteration synthesis with ranked recommendations."
trigger_phrases:
  - "deep-review complexity"
  - "deep review surface level"
  - "deep-research bug finding"
  - "review workflow depth"
  - "deep-loop review quality"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/003-deep-review/001-complexity-research-synthesis"
    last_updated_at: "2026-05-22T08:35:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Completed 15-iteration Level 3 auto deep-research synthesis."
    next_safe_action: "Use recommendations to plan a follow-up implementation packet."
    blockers: []
    key_files:
      - ".opencode/skills/deep-review/"
      - ".opencode/skills/deep-research/"
      - ".opencode/commands/deep/start-review-loop.md"
      - ".opencode/commands/deep/start-research-loop.md"
    session_dedup:
      fingerprint: "sha256:1161161161161161161161161161161161161161161161161161161161161161"
      session_id: "116-deep-review-complexity-auto-research"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which follow-up implementation packet should own deep-review searchLedger changes?"
    answered_questions:
      - "Deep-review's strongest rigor begins after candidate findings exist, leaving candidate generation under-specified."
      - "Deep-research's transferable strengths are persistent hypotheses, unanswered questions, observations, ruled-out directions, and focused next-step state."
      - "Continuation iterations refined the searchLedger recommendation into schema, validation, persistence, convergence, and graph rollout gates."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: 116/001 — Deep Review Complexity Research Synthesis

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Focused deep-research passes sometimes find more concrete bugs than the dedicated deep-review workflow. This suggests deep-review may over-index on broad review ceremony, convergence, or summary-level checks instead of forcing adversarial, class-of-bug exploration.

**Key Decisions**: run an evidence-only 15-iteration deep-research loop; defer implementation until findings are synthesized and ranked.

**Critical Dependencies**: `/deep:start-research-loop:auto`, `cli-codex`, `gpt-5.5`, and local access to the deep-review and deep-research command/skill surfaces.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-22 |
| **Branch** | Current workspace branch |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 8 |
| **Predecessor** | None (first phase) |
| **Successor** | `../002-seeded-fixture-harness/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the 116 arc. Purpose: preserve the completed 15-iteration evidence base and synthesis that define the implementation phases.

**Scope Boundary**: Evidence-only research artifacts and packet docs. No production deep-review behavior changes belong in this phase.

**Dependencies**: None.

**Deliverables**:
- `research/research.md` final synthesis.
- `research/iterations/iteration-001.md` through `iteration-015.md`.
- `research/deltas/iter-001.jsonl` through `iter-015.jsonl`.
- `research/deep-research-state.jsonl`, dashboard, strategy, and registry artifacts.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-review workflow should be the strongest bug-finding path for iterative audits, but user experience indicates focused deep-research loops can surface more defects when prompted to look for bugs. If true, deep-review may be too shallow in scope selection, evidence pressure, iteration focus, or adversarial class-of-bug coverage.

### Purpose
Use 15 autonomous research iterations to identify why deep-review underperforms on bug discovery and produce actionable recommendations for hardening the deep-review workflow.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inspect deep-review skill, agent, command, YAML workflow, convergence, and finding-output contracts.
- Compare deep-review behavior against deep-research behaviors that improve bug discovery.
- Identify concrete shallow-review failure modes with file and line evidence.
- Produce ranked recommendations, acceptance criteria, and likely implementation surfaces.

### Out of Scope
- Implementing deep-review changes during the research loop.
- Changing CLI executor behavior unless it directly explains review shallowness.
- Evaluating unrelated skills outside the deep-loop and review orchestration surfaces.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/spec.md` | Modify | Define research packet and requirements. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/plan.md` | Modify | Define auto research execution plan. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/tasks.md` | Modify | Track planning, research, synthesis, and validation tasks. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/checklist.md` | Modify | Track evidence and workflow compliance checks. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/description.json` | Create | Provide system-spec-kit indexing metadata. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/research/**` | Create | Workflow-owned deep-research artifacts. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run the investigation through `/deep:start-research-loop:auto` semantics, not an ad hoc research loop. | Research artifacts include config, state JSONL, iteration markdown, deltas, and synthesis under this packet's `research/` directory. |
| REQ-002 | Use `cli-codex` with `gpt-5.5`, `high` or continuation-requested `xhigh` reasoning, and `fast` service tier for each iteration. | Deep-research config and iteration audit metadata record the requested executor settings. |
| REQ-003 | Keep the run evidence-only. | No deep-review implementation files are modified during the research loop. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Compare deep-review and deep-research at the workflow-contract level. | Synthesis cites command, skill, agent, and YAML surfaces with file references. |
| REQ-005 | Identify root causes for shallow deep-review behavior. | Findings are grouped by failure mode and include severity, evidence, and confidence. |
| REQ-006 | Recommend concrete deep-review improvements. | Recommendations include target surfaces, expected impact, risks, and verification strategy. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 15 iterations complete or the workflow halts with a documented convergence or failure reason.
- **SC-002**: `research/research.md` synthesizes all iteration outputs into findings and recommendations.
- **SC-003**: The final response presents prioritized changes that would make deep-review find deeper correctness bugs.
- **SC-004**: Spec metadata files exist and the packet is indexable by system-spec-kit memory.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Codex CLI auth and model availability | Research iterations cannot run through the requested executor. | Preflight `codex` availability and auth before iteration dispatch. |
| Risk | Research loop drifts into implementation | Violates evidence-only scope and can mask review-design findings. | Use read/research prompts and keep implementation files untouched. |
| Risk | Iterations repeat broad summaries | Low novelty and weak recommendations. | Force each iteration to focus on a distinct failure mode and record ruled-out directions. |
| Risk | Deep-review source paths differ across runtime directories | Findings may cite the wrong surface. | Prefer `.opencode/` runtime surfaces and note sibling mirrors only when relevant. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each iteration should complete within the configured executor timeout.

### Security
- **NFR-S01**: Prompts and artifacts must not include secrets, tokens, or private credentials.

### Reliability
- **NFR-R01**: Each iteration must write narrative, state-log, and delta artifacts before reducer processing.

---

## 8. EDGE CASES

### Data Boundaries
- Empty prior research state: initialize a fresh `research/` packet.
- Existing completed research state: archive or report before rerun rather than overwriting.

### Error Scenarios
- Codex auth failure: stop, report the exact error, and preserve initialized state.
- Missing iteration artifact: record failure in state and do not claim synthesis completeness.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Multiple skills, commands, agents, YAML workflows, and generated research artifacts. |
| Risk | 16/25 | Review workflow quality affects future defect detection and remediation quality. |
| Research | 20/20 | 10 fresh-context research iterations requested. |
| Multi-Agent | 10/15 | CLI executor dispatch with workflow-owned loop state. |
| Coordination | 10/15 | Spec docs, memory indexing, and research state must stay synchronized. |
| **Total** | **74/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Findings are too generic to implement. | H | M | Require file-level evidence and target-surface recommendations. |
| R-002 | Research undercounts deep-review strengths. | M | M | Include explicit comparison against deep-review contracts before recommending changes. |
| R-003 | Auto loop exhausts context or CLI quota. | M | L | Keep iterations focused and preserve state after each pass. |

---

## 11. USER STORIES

### US-001: Deeper Bug-Finding Review Workflow (Priority: P0)

**As a** maintainer, **I want** deep-review to find the same classes of bugs that focused deep-research finds, **so that** review workflows catch implementation risks before they ship.

**Acceptance Criteria**:
1. Given the current deep-review workflow, When research compares it with deep-research bug-finding behavior, Then the synthesis identifies concrete depth gaps and proposed remediations.

---

### US-002: Evidence-Based Improvement Backlog (Priority: P1)

**As a** workflow author, **I want** ranked recommendations with target files and verification ideas, **so that** a follow-up packet can implement changes without repeating discovery work.

**Acceptance Criteria**:
1. Given 10 completed research iterations, When synthesis completes, Then recommendations include priority, rationale, affected surfaces, and validation gates.

---

## 12. OPEN QUESTIONS

- Which follow-up implementation packet should own deep-review `searchLedger` changes?
- What strictness thresholds should separate trivial reviews from non-trivial ledger-required reviews?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
