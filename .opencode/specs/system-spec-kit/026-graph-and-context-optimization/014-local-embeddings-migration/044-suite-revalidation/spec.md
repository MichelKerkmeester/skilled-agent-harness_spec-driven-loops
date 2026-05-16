---
title: "043 Suite Revalidation"
description: "Re-run scenarios 401-415 from the 24-- local LLM query intelligence playbook after the substrate repair wave, then compare against the 032/002 baseline."
trigger_phrases:
  - "043 suite revalidation"
  - "post substrate wave scenario suite"
  - "24-- local llm query intelligence revalidation"
  - "401-415 post-wave validation"
importance_tier: "critical"
contextType: "spec"
status: "fail"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/044-suite-revalidation"
    last_updated_at: "2026-05-14T16:35:00Z"
    last_updated_by: "main-agent"
    recent_action: "Attempted all 15 scenarios; nested codex exec failed before scenario execution"
    next_safe_action: "Rerun after nested codex exec startup works"
    blockers:
      - "Nested codex exec exits with failed to initialize in-process app-server client: Operation not permitted"
    key_files:
      - "_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-post-wave.sh"
      - "_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-post-wave.summary.tsv"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000043"
      session_id: "044-suite-revalidation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3: E - phase folder 044-suite-revalidation"
      - "Branch: main; no branches and no commits"
      - "SpawnAgent forbidden; codex exec child processes allowed"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 043 Suite Revalidation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Fail: runner blocked before scenario logic |
| **Created** | 2026-05-14 |
| **Branch** | main |
| **Parent Spec** | `../spec.md` (`014-local-embeddings-migration`) |
| **Phase** | 043 |
| **Evidence Dir** | `_sandbox/24--local-llm-query-intelligence/evidence/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 032/002 evidence recorded only 2 PASS / 2 PARTIAL / 11 FAIL across scenarios 401-415, with many failures caused by substrate defects rather than scenario behavior. Packets 037, 038, 039, 040, and 041 repaired or instrumented the worker, error propagation, chunking, V8 validation, and CocoIndex IPC observability layers.

### Purpose

Re-run the same 15-scenario suite through fresh `codex exec` child processes and produce a TSV-backed comparison showing whether the post-wave substrate materially improves the scenario distribution.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Scaffold this Level 2 packet with canonical anchors and metadata.
- Create `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-post-wave.sh`.
- Execute scenarios 401-415 from `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/`.
- Capture per-scenario logs and a summary TSV.
- Compare the new TSV against `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.summary.tsv`.
- Record per-scenario deltas and final PASS/PARTIAL/FAIL/SKIP counts.

### Out of Scope

- Modifying playbook scenario Markdown files.
- Modifying substrate source.
- Creating branches, commits, or PRs.
- Using SpawnAgent.
- Network-dependent setup or package installation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/044-suite-revalidation/` | Create | Level 2 packet docs and metadata. |
| `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-post-wave.sh` | Create | Sequential `codex exec` scenario runner. |
| `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-post-wave.summary.tsv` | Generate | Scenario verdict summary. |
| `_sandbox/24--local-llm-query-intelligence/evidence/per-scenario-logs-post-wave/` | Generate | Raw child-process logs for scenarios 401-415. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Scenario files are read-only inputs. | `git diff` shows no playbook scenario modifications. |
| REQ-002 | Runner dispatches scenarios 401-415 sequentially. | TSV includes one data row per scenario unless a missing playbook file is skipped. |
| REQ-003 | Each scenario uses real MCP tools when available. | Prompt names the required Spec Kit Memory and CocoIndex MCP tool families. |
| REQ-004 | Each scenario emits PASS, PARTIAL, FAIL, or SKIP. | Runner extracts the final `VERDICT:` line or records a controlled FAIL for missing verdicts. |
| REQ-005 | Findings compare against the 032/002 baseline. | `implementation-summary.md` contains the requested baseline-delta table. |
| REQ-006 | Packet strict validation runs. | `validate.sh <043 packet> --strict` result is recorded. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Runner tolerates missing scenario files. | Missing files produce SKIP rows instead of aborting the suite. |
| REQ-008 | Stalled child processes do not block the whole suite indefinitely. | Runner has a per-scenario timeout and moves on after termination. |
| REQ-009 | Cleanup is delegated to each scenario executor. | Prompt instructs child processes to run CLEAN-UP when present. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 15 scenarios are attempted or explicitly SKIP with a reason.
- **SC-002**: The TSV has `scenario`, `verdict`, `key_metric`, and `detail` columns.
- **SC-003**: `implementation-summary.md` includes 15 scenario rows plus a TOTAL row.
- **SC-004**: The binding trace can report scenario count, verdict distribution, baseline comparison, TSV path, strict validation result, and final 043 status.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `codex exec` MCP registration | Scenarios may SKIP or FAIL if required tools are unavailable to children. | Preserve raw logs and classify the failure separately from scenario semantics. |
| Dependency | Spec Kit Memory daemon | Save-heavy scenarios 411-415 depend on working memory save/search/causal tools. | Runner captures the exact final verdict and detail. |
| Dependency | CocoIndex MCP | Scenarios 404 and 407 may remain partial until the follow-on reliability packet. | Treat PARTIAL as a valid post-wave signal. |
| Risk | Child process stalls | Long-running scenario can block later scenarios. | Per-scenario watchdog terminates after the configured timeout. |
| Risk | Baseline TSV has duplicate historical rows | Naive comparison can miscount. | Use the final row per scenario for machine aggregation and the handoff baseline counts for headline delta. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None at dispatch time.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-R01**: Evidence must be reproducible from the runner script and raw logs.
- **NFR-R02**: The runner must append one TSV row per scenario and continue after controlled child failures.
- **NFR-S01**: The run must not write secrets, modify playbooks, or change substrate source.
- **NFR-O01**: The summary must distinguish scenario-quality failures from MCP/tool availability failures.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **Missing playbook file**: record `SKIP` with the missing glob.
- **Missing final verdict**: record `FAIL` with the raw log path.
- **Codex child startup failure**: record `FAIL` with `codex exec app-server initialization failed`.
- **Child timeout**: terminate the child, record `FAIL`, and proceed.
- **MCP daemon crash**: child prompt allows restart via the scenario process where applicable; parent runner still proceeds.
- **Duplicate baseline rows**: compare against the latest row per scenario for detail, while preserving the provided 2 PASS / 2 PARTIAL / 11 FAIL headline baseline.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | One runner, one packet, generated evidence. |
| Risk | 20/25 | Cross-process MCP availability and long-running scenario behavior. |
| Research | 12/20 | Requires baseline comparison and playbook inspection. |
| **Total** | **47/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
