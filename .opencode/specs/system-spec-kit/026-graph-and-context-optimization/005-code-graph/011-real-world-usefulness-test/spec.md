---
title: "Feature Specification: Real-World Usefulness Test"
description: "Planning packet for a real-world validation campaign that measures whether the code graph, hooks, and plugin/runtime integrations improve day-to-day engineering work."
trigger_phrases:
  - "real-world usefulness test"
  - "code graph usefulness"
  - "hook usefulness validation"
  - "runtime integration usefulness"
  - "026/007/012"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test"
    last_updated_at: "2026-05-05T00:00:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Created planning-only scaffold for the real-world usefulness campaign"
    next_safe_action: "Review and approve the plan before dispatching the execution pass"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0120120120120120120120120120120120120120120120120120120120120120"
      session_id: "026-007-011-real-world-usefulness-test"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 pre-approved by user for this exact spec folder."
---
# Feature Specification: Real-World Usefulness Test

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planning Scaffold Complete |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `026-graph-and-context-optimization/005-code-graph` |
| **Execution Mode** | Planning only; no scenarios run in this packet |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 001-011 shipped capability and resilience for code graph tooling, hooks, and runtime integration surfaces. That proves the systems can exist, but it does not prove they help an engineer move faster or make better decisions during normal coding work. The missing evidence is a real-world usefulness campaign with controls, repeated trials, and runtime-specific observations.

### Purpose
Define the scenario battery, CLI matrix, measurement framework, and execution plan for a follow-up campaign that answers whether these systems reduce engineering friction or add overhead.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Design a 12-scenario battery across code graph, hooks, and plugin/runtime integration.
- Define the runtime matrix and the rationale for scenario-specific CLI subsets.
- Define quantitative metrics, qualitative scoring, control runs, analysis rules, and reporting outputs.
- Create the Level 2 planning artifacts needed for a later execution pass.
- Update the `005-code-graph` parent metadata so this child phase is discoverable.

### Out of Scope
- Running any real CLI session, external invocation, hook harness, code graph query, or scenario trial.
- Generating empirical test data, token counts, timing logs, or finding quality scores.
- Changing code under `mcp_server/code_graph/`, hooks, plugins, runtime scripts, or CLI wrappers.
- Editing the phase-parent `spec.md`, `description.json`, or heavy parent docs unless validation requires it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test/spec.md` | Create | Problem, scope, scenario battery, requirements, success criteria. |
| `specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test/plan.md` | Create | Execution design, phased rollout, CLI matrix, scoring rubric. |
| `specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test/tasks.md` | Create | Scenario, matrix-cell, and analysis task list for the later execution pass. |
| `specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test/checklist.md` | Create | Scaffold verification plus future execution gates. |
| `specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test/decision-record.md` | Create | Methodology ADRs for the campaign design. |
| `specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test/implementation-summary.md` | Create | Planning-only placeholder; execution summary comes later. |
| `specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test/description.json` | Create | Discovery metadata for this packet. |
| `specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test/graph-metadata.json` | Create | Graph metadata for this child packet. |
| `specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/graph-metadata.json` | Modify | Add this child packet to `children_ids`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define code graph usefulness scenarios. | `S-CG-01` through `S-CG-04` each state task intent, control comparison, metrics, and included CLIs. |
| REQ-002 | Define hook usefulness scenarios. | `S-HK-01` through `S-HK-04` each state hook surface, prompt corpus or session condition, scoring, and included CLIs. |
| REQ-003 | Define plugin/runtime integration scenarios. | `S-PL-01` through `S-PL-04` each state runtime behavior under test, control comparison, metrics, and included CLIs. |
| REQ-004 | Include a control workflow for every scenario. | Each scenario compares assisted flow against a no-code-graph/no-hook/no-plugin baseline, grep/manual reading, or direct runtime-only flow. |
| REQ-005 | Keep this packet planning-only. | No scenario execution commands, timing logs, token logs, generated datasets, or external CLI invocations appear in the packet. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Define a quantitative measurement framework. | Plan includes time-to-result, token usage, context-injection accuracy, hit rate, adoption rate, and rework count. |
| REQ-007 | Define a qualitative scoring framework. | Plan includes 0-3 relevance and 0-3 usefulness rubrics with anchored score meanings. |
| REQ-008 | Define the scenario-specific CLI matrix. | Plan documents the full runtime list, included subsets, exclusions, and total planned matrix-cell count. |
| REQ-009 | Define synthesis outputs for the later execution pass. | Checklist and plan require a report that identifies helpful systems, overhead systems, and a file:line-cited improvement backlog. |

### Scenario Battery Overview

| ID | Axis | Scenario | Primary Question | Control |
|----|------|----------|------------------|---------|
| S-CG-01 | Code Graph | Where is X used? | Does graph query find callers faster than grep plus manual reading? | `rg` plus file reads. |
| S-CG-02 | Code Graph | What does this module touch? | Does graph context reduce orientation time for an unfamiliar file? | Manual import and call-path reading. |
| S-CG-03 | Code Graph | Refactor blast-radius preview | Does graph dependency preview improve rename confidence before editing? | Grep plus IDE rename preview. |
| S-CG-04 | Code Graph | Cross-file invariant check | Does graph structure find rule violations with less script work? | Custom grep/script baseline. |
| S-HK-01 | Hooks | Session-prime context relevance | Is startup context relevant to the first prompt? | Fresh session without injected context. |
| S-HK-02 | Hooks | Skill advisor routing accuracy | Does advisor routing match human skill choice on real prompts? | Human-labelled prompt corpus. |
| S-HK-03 | Hooks | Gate 3 classifier precision | Does write/read-only classification avoid false blocks and missed writes? | Human-labelled prompt corpus. |
| S-HK-04 | Hooks | Compaction-recovery quality | Does recovery preserve useful working state after compaction? | Manual recap after compaction. |
| S-PL-01 | Plugin/Runtime | Startup context across runtimes | Do runtimes receive useful first-turn context consistently? | Same project opened with integrations disabled where possible. |
| S-PL-02 | Plugin/Runtime | In-session memory retrieval | Can each runtime retrieve prior decisions during active work? | Manual search through spec docs. |
| S-PL-03 | Plugin/Runtime | External CLI dispatch consistency | Do external CLI invocations produce comparable review quality? | Native runtime review only. |
| S-PL-04 | Plugin/Runtime | sk-code routing under each runtime | Does sk-code routing fire with correct surface evidence? | Same prompt without advisor/routing context. |

### Dimension Table

| Dimension | What It Measures | Applies To | Evidence Captured Later |
|-----------|------------------|------------|--------------------------|
| Speed | Time-to-first-useful-result and time-to-confidence. | All scenarios. | Start/end timestamps and operator notes. |
| Cost | Token usage, prompt overhead, repeated turns, and setup burden. | All runtime and hook scenarios. | CLI logs and manual token readouts where available. |
| Relevance | Whether injected or retrieved context matches the task. | Hooks and plugin/runtime scenarios. | 0-3 relevance score with rationale. |
| Usefulness | Whether the system changed the engineer's next action for the better. | All scenarios. | 0-3 usefulness score with adoption note. |
| Correctness | Whether outputs are complete, accurate, and non-misleading. | Code graph and dispatch scenarios. | Human audit against repo evidence. |
| Friction | Whether setup, prompt noise, or routing overhead slowed the work. | All scenarios. | Overhead notes and failure taxonomy. |
| Control Delta | Difference between assisted and unassisted workflow. | All scenarios. | Paired control trial result. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: This scaffold packet contains `description.json`, `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `graph-metadata.json`, and `implementation-summary.md`.
- **SC-002**: The scenario battery documents exactly 12 scenarios across the three system axes.
- **SC-003**: The CLI matrix documents all included runtime variants and explains exclusions.
- **SC-004**: Strict validation passes for this child packet and the `005-code-graph` parent.
- **SC-005**: Parent `graph-metadata.json.children_ids` includes `system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test`.
- **SC-006**: The later execution pass has a clear done definition: at least three trials per included CLI cell, quantitative metrics, qualitative scores, control comparison, synthesis report, and improvement backlog.

### Acceptance Scenarios

- **Given** the scaffold packet is reviewed, **When** the user opens `spec.md`, **Then** the 12 scenarios and measurement dimensions are clear without requiring scenario execution data.
- **Given** a follow-up executor receives this packet, **When** they open `plan.md`, **Then** they can identify which CLIs to run for each scenario and why.
- **Given** a follow-up executor starts task execution, **When** they open `tasks.md`, **Then** they find one task per major scenario and one task per included scenario-runtime matrix cell.
- **Given** the campaign finishes later, **When** the synthesis report is produced, **Then** it can classify each system as useful, mixed, or overhead using paired control evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Runtime feature parity differs across Claude Code, Codex CLI, Copilot CLI, Gemini CLI, cli-claude-code, and OpenCode. | Full cross-runtime comparison may become misleading. | Use scenario-specific CLI subsets and document exclusions. |
| Risk | Human operator familiarity biases time-to-result. | A practiced operator may make baseline or assisted flows look better than they are. | Rotate scenario order, record operator notes, and compare within paired trials. |
| Risk | Token usage may not be exposed uniformly by all CLIs. | Cost comparisons may be partial. | Record exact token metrics when available and mark unavailable fields as `UNKNOWN`. |
| Risk | Context injection may appear useful but not change decisions. | Relevance alone can overstate value. | Score relevance and usefulness separately, and require adoption notes. |
| Dependency | Existing code graph, hook, and runtime surfaces from phases 001-011. | Campaign cannot test systems that are unavailable or broken at execution time. | Execution pass begins with baseline readiness checks and records blocked cells. |
| Dependency | Real prompt corpus for hook classifier and advisor scenarios. | Synthetic prompts would weaken external validity. | Use 10 actual historical prompts, anonymized if needed, and preserve human labels. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for the planning scaffold. The execution pass may add runtime-specific blockers as scenario evidence, but it must not backfill synthetic data into this packet.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Every execution metric must be traceable to a trial id, scenario id, CLI variant, and control/assisted label.
- **NFR-R02**: Missing metrics must be recorded as `UNKNOWN`, not inferred.

### Maintainability
- **NFR-M01**: The scenario ids and CLI ids must remain stable so results can be joined across logs, reports, and backlog items.

### Safety
- **NFR-S01**: External CLI trials must run under explicit user approval in the follow-up pass and must not mutate repo files unless a scenario explicitly authorizes a disposable test branch or scratch area.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Runtime Coverage
- If a runtime cannot expose token counts, record `UNKNOWN` for token usage and preserve the other metrics.
- If a runtime lacks the hook or plugin surface under test, mark the matrix cell excluded with rationale rather than forcing an invalid comparison.
- If a scenario blocks because the code graph is stale or unavailable, record a blocked trial and run the control path separately.

### Data Boundaries
- Prompt corpora for advisor and Gate 3 tests must use real prompts, but secrets, private customer data, and unrelated personal context must be redacted before storage.
- Control runs must use the same task goal and repo state as assisted runs.

### State Transitions
- Planning scaffold completion does not imply execution completion.
- Execution completion requires a synthesis artifact and improvement backlog after all included cells complete or receive documented user-approved deferrals.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Twelve scenarios across three systems and seven runtime variants. |
| Risk | 15/25 | Main risk is measurement bias, not code mutation. |
| Research | 12/20 | Requires later empirical trials and synthesis, but this packet only designs the campaign. |
| **Total** | **45/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
