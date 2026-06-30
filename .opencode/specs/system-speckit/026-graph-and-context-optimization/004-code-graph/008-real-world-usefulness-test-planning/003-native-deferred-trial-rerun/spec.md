---
title: "Feature Specification: Native Rerun of Deferred Usefulness Cells"
description: "Native re-execution packet for cells deferred by the sandbox campaign, with updated verdicts for code graph, hooks, and runtime integration."
trigger_phrases:
  - "native rerun usefulness"
  - "026/007/012/002"
  - "code graph scope policy failure"
  - "native synthesis update"
importance_tier: "important"
contextType: "execution"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/003-native-deferred-trial-rerun"
    last_updated_at: "2026-05-06T04:47:44.000Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Authored native rerun packet and updated usefulness verdicts"
    next_safe_action: "Fix code graph P0 backlog or run separate live-runtime campaign"
    blockers:
      - "Code graph native scope policy and parser failures remain unresolved"
      - "Plugin/runtime integration still needs a separate authenticated live-runtime campaign"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
      - "synthesis-report-native-rerun.md"
      - "trials/trial-log.jsonl"
    session_dedup:
      fingerprint: "sha256:b8573afd98812522094e9f5aa54f5d37d81833610eaaa1bd3f99e41c397950d4"
      session_id: "026-007-012-003-native-deferred-trial-rerun"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which live-runtime campaign should validate plugin/runtime integration next?"
    answered_questions:
      - "Gate 3 pre-approved for this packet."
      - "Native rerun evidence upgrades the code graph verdict to overhead."
---
# Feature Specification: Native Rerun of Deferred Usefulness Cells

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning` |
| **Prior Child** | `../001-sandbox-usefulness-trials/` |
| **Execution Mode** | Native orchestrator rerun with MCP, network/authenticated state, and live session context |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sandbox campaign deferred native cells because it could not access MCP tools, authenticated state, network, or real compaction context. The initial synthesis therefore treated code graph overhead as sandbox-bound. The native rerun produced different evidence: code graph queries blocked under real workflow conditions, scope-mismatched scans wiped the live index to zero nodes, and parser crashes prevented recovery.

### Purpose
Capture the native rerun as a Level 2 packet, record every measured native cell, and update the usefulness verdicts with evidence rather than carrying forward the sandbox-only interpretation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author the `003-native-deferred-trial-rerun/` Level 2 packet.
- Log each native measurement from the orchestrator rerun.
- Preserve raw or placeholder evidence files for the advisor probes.
- Record code graph failure modes as native product findings.
- Verify both sandbox backlog fixes: Codex session-start smoke mode and Copilot offline preflight documentation.
- Update parent `graph-metadata.json.children_ids` with `003-native-deferred-trial-rerun`.
- Update the synthesis verdict by system axis.

### Out of Scope
- Fixing the code graph implementation defects found by the native rerun.
- Re-running a separate authenticated cli-gemini, Claude Code, or OpenCode campaign.
- Replacing the prior `001-sandbox-usefulness-trials` packet; this packet supersedes only the verdict interpretation.
- Inferring relevance or quality for runtime surfaces not measured in this run.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `description.json` | Create | Discovery metadata for the native rerun packet. |
| `graph-metadata.json` | Create | Packet graph metadata and derived status. |
| `spec.md` | Create | Scope, requirements, success criteria, and native findings. |
| `plan.md` | Create | Execution plan and what worked or blocked. |
| `tasks.md` | Create | One completed task per measured native cell. |
| `checklist.md` | Create | Level 2 verification gates for backlog fixes and synthesis. |
| `decision-record.md` | Create | ADRs for code graph product finding and interim workflow. |
| `implementation-summary.md` | Create | Delivery summary, trial counts, and verification. |
| `synthesis-report-native-rerun.md` | Create | Updated verdict per axis and native-derived backlog. |
| `trials/trial-log.jsonl` | Update | One JSONL row per native measurement. |
| `trials/raw/*.json` | Create | Raw or placeholder advisor probe evidence plus native evidence summaries. |
| `../graph-metadata.json` | Update | Parent `children_ids` includes this child packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Capture the native code graph run honestly. | Trial log records the successful first scan, three drift-blocked queries, zero-node wipe, empty-graph query, and failed recovery scan. |
| REQ-002 | Preserve advisor and hook evidence. | Trial log records three advisor probes, compaction recovery formatting, and both verified backlog fixes. |
| REQ-003 | Update the synthesis verdict. | `synthesis-report-native-rerun.md` classifies code graph as OVERHEAD, hooks as USEFUL, and plugin/runtime integration as DEFERRED. |
| REQ-004 | Update parent graph metadata. | Parent `children_ids` includes `003-native-deferred-trial-rerun`. |

### P1 - Required (complete OR documented deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Document native-derived backlog. | Synthesis lists three P0 code graph items and one P1 query/drift item with file paths. |
| REQ-006 | Record workflow recommendation. | Decision record names the interim day-to-day workflow until graph scope/index stability is fixed. |
| REQ-007 | Keep runtime integration scoped. | Plugin/runtime verdict stays deferred because this native rerun only validated MCP-bridged surfaces. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `trials/trial-log.jsonl` contains one JSON object per native measurement.
- **SC-002**: Code graph native failures are documented as product findings, not sandbox limits.
- **SC-003**: Advisor probes are captured as 3/3 correct with top recommendations and scores.
- **SC-004**: Backlog fixes from `001-sandbox-usefulness-trials` are marked verified with command evidence.
- **SC-005**: Strict spec validation exits 0 for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Native orchestrator evidence | Packet relies on the orchestrator's measured outputs. | Preserve those values verbatim in trial log and synthesis. |
| Risk | Code graph state mutation | Scope-mismatched scans can wipe a previously useful graph index. | Recommend lexical search plus targeted direct reads until P0 fixes land. |
| Risk | Parser crash opacity | `memory access out of bounds` hides file-level indexing loss unless surfaced. | Log as P0 backlog and require scan-time warning/rejection. |
| Risk | Runtime integration undercoverage | Native rerun did not run separate authenticated external runtime campaigns. | Mark plugin/runtime integration as deferred, not useful or overhead. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which authenticated live-runtime campaign should run next for plugin/runtime integration: cli-gemini, Claude Code native, or OpenCode native?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Native trial rows must distinguish completed, blocked, partial, and verified statuses.
- **NFR-R02**: Empty or degraded graph state must be described explicitly, not hidden behind a generic failure.

### Maintainability
- **NFR-M01**: Backlog items must reference the implementation files named by the native findings.
- **NFR-M02**: The packet must preserve the parent/child graph relationship for resume and search.

### Safety
- **NFR-S01**: No production code is changed in this documentation packet.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Scope State
- A query after an `includeSkills: true` scan can still block if the candidate manifest drifts.
- A default-scope scan can replace a previously populated graph with a zero-node state.
- Re-running the original `includeSkills: true` scan after a wipe may not recover the graph.

### Evidence State
- Advisor probe raw files may be placeholders when the orchestrator already captured the live MCP transcript.
- Compaction recovery formatting is confirmed, but recovery relevance remains unmeasured.

### Verdict State
- The code graph verdict can worsen from the sandbox verdict when native state introduces new failure modes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | New child packet, trial log, synthesis, and parent metadata update. |
| Risk | 16/25 | Verdict reversal and native product defect documentation. |
| Research | 12/20 | Based on orchestrator measurements plus prior packet review. |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
