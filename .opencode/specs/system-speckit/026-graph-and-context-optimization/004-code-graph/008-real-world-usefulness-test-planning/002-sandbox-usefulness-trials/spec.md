---
title: "Feature Specification: Real-World Usefulness Test Execution"
description: "Execution sub-phase for packet 026/007/012 that runs sandboxable usefulness trials and documents deferred live-runtime cells."
trigger_phrases:
  - "real-world usefulness execution"
  - "026/007/012/001"
  - "usefulness synthesis"
importance_tier: "important"
contextType: "execution"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/002-sandbox-usefulness-trials"
    last_updated_at: "2026-05-06T04:35:32.335Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Ran sandboxable usefulness trials and synthesized partial verdicts"
    next_safe_action: "Review synthesis gaps or rerun deferred live runtime cells"
    blockers:
      - "Authenticated/networked external CLI runtimes unavailable in sandbox"
      - "Claude Code and OpenCode native live sessions unavailable from sandbox"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
      - "synthesis-report.md"
      - "trials/trial-log.jsonl"
    session_dedup:
      fingerprint: "sha256:0260070120010260070120010260070120010260070120010260070120010260"
      session_id: "026-007-012-002-sandbox-usefulness-trials"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 pre-approved for this execution packet."
---
# Feature Specification: Real-World Usefulness Test Execution

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Partial Execution Complete |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning` |
| **Execution Mode** | Sandbox-direct automation plus documented live-runtime deferrals |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The parent packet designed a 58-cell usefulness campaign, but many cells require authenticated external CLIs, network access, native Claude Code/OpenCode sessions, or live compaction state. This execution sub-phase needed to capture as much empirical evidence as the sandbox can produce without fabricating runtime behavior.

### Purpose
Run Phase 1 setup, complete the pilot where possible, execute all sandboxable trials, aggregate the results, and document the exact gaps left for a live-runtime follow-up.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create the 002-sandbox-usefulness-trials Level 2 packet under the approved parent folder.
- Run sandbox-direct code graph, session-prime, advisor, Gate 3, and sk-code-routing trials.
- Capture raw outputs, controls, trial JSONL, analysis summaries, and synthesis.
- Attempt external CLI smoke checks and record blocked cells with reasons.
- Update parent `graph-metadata.json.children_ids` with `002-sandbox-usefulness-trials`.

### Out of Scope
- Running interactive Claude Code or OpenCode native sessions.
- Completing authenticated/networked model calls for cli-codex, or cli-gemini after smoke checks failed.
- Mutating production code or performing a hypothetical refactor.
- Fabricating token counts, model responses, or compaction-recovery data.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Update | Declared execution scope, requirements, and sandbox limits. |
| `plan.md` | Update | Listed completed sandbox-direct cells and deferred live/runtime cells. |
| `tasks.md` | Update | Tracked one task per planned matrix cell plus analysis and synthesis. |
| `checklist.md` | Update | Recorded P0/P1/P2 evidence for completed and deferred work. |
| `decision-record.md` | Create | Captured execution ADRs for deferrals and scoring mechanics. |
| `implementation-summary.md` | Update | Summarized trials, verdicts, and validation status. |
| `trials/trial-log.jsonl` | Create | Append-only structured trial log. |
| `trials/raw/` | Create | Raw assisted output and blocked external smoke outputs. |
| `trials/control/` | Create | Manual/control workflow records. |
| `analysis/aggregated-metrics.md` | Create | Scenario and CLI metrics aggregation. |
| `analysis/per-scenario-deltas.md` | Create | Assisted-vs-control deltas. |
| `synthesis-report.md` | Create | Verdict, wins, overheads, deferrals, and backlog. |
| `description.json` | Create | Discovery metadata for the execution packet. |
| `graph-metadata.json` | Update | Packet graph metadata. |
| `../graph-metadata.json` | Update | Parent children_ids includes 002-sandbox-usefulness-trials. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Create execution packet artifacts. | Required Level 2 docs, metadata, trial folders, analysis docs, and synthesis report exist. |
| REQ-002 | Run Phase 1 setup. | Trial log schema and raw/control folders exist; parent metadata includes this child. |
| REQ-003 | Run Phase 2 pilot. | S-CG-01 and S-HK-01 have completed pilot records; S-PL-01 has blocked external smoke evidence. |
| REQ-004 | Run sandboxable Phase 3 cells. | Code graph, hook, advisor, Gate 3, and sk-code routing trials are logged with raw outputs. |

### P1 - Required (complete OR documented deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Analyze completed trials. | `analysis/aggregated-metrics.md` and `analysis/per-scenario-deltas.md` summarize trial results. |
| REQ-006 | Synthesize verdicts. | `synthesis-report.md` classifies code graph, hooks, and runtime integration. |
| REQ-007 | Document deferred cells. | Plan, tasks, and synthesis list deferred cells with concrete sandbox reasons. |
| REQ-008 | Preserve raw evidence. | Every trial-log row points to a raw output or control record. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `trials/trial-log.jsonl` contains one JSON object per completed or blocked trial attempt.
- **SC-002**: At least 30 local assisted/control records exist for sandboxable scenarios.
- **SC-003**: External runtime cells that could not run are deferred with observed smoke-test evidence.
- **SC-004**: Synthesis report has verdict, wins, overheads, deferred cells, backlog, and confidence note sections.
- **SC-005**: Strict spec validation exits 0 for this child packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Code graph SQLite DB | Local graph trials require the generated DB. | Use existing DB and record stale-state context in synthesis. |
| Dependency | Skill advisor and Gate 3 compiled/local scripts | Hook trials require callable local implementations. | Use the Python advisor script and compiled classifier JS. |
| Risk | External CLIs unavailable | Runtime verdict could be mistaken for product verdict. | Label plugin/runtime result as sandbox verdict and list follow-up cells. |
| Risk | Control timings are shell-command timings, not human IDE timings. | Deltas understate real manual reading cost. | Treat controls as lower-bound baselines. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which live runtime should rerun S-PL-01 through S-PL-04 first once auth and network access are available?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Trial records must be append-only JSONL with raw evidence paths.
- **NFR-R02**: Missing runtime data must be marked deferred or blocked, not inferred.

### Maintainability
- **NFR-M01**: Scenario IDs and CLI IDs must match the parent packet wherever parent cells are referenced.

### Safety
- **NFR-S01**: Runtime prompts and controls must not mutate production files.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Runtime Boundaries
- Network DNS failure, missing auth, and interactive browser prompts are recorded as blocked external smoke outcomes.
- Native Claude Code/OpenCode cells remain deferred because the sandbox cannot reproduce live runtime hook state.

### Data Boundaries
- Token usage is estimated from text length because the completed local tools do not expose model-token accounting.
- The S-HK-02 and S-HK-03 control truth comes from the labeled prompt corpus.

### State Transitions
- A deferred cell can become complete only after a live-runtime run writes raw evidence and a trial-log row.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | New child packet, trial artifacts, parent metadata update. |
| Risk | 14/25 | External runtime gaps and generated evidence handling. |
| Research | 15/20 | Required parent packet review and local tool discovery. |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
