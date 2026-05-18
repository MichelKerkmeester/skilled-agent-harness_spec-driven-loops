---
title: "002 rerun-24-scenarios-suite (validate post-fix substrate)"
description: "Re-run the full 15-scenario suite in `manual_testing_playbook/24--local-llm-query-intelligence/` after Wave 1 lands. Produce a real PASS/FAIL distribution against the post-fix substrate."
trigger_phrases:
  - "rerun 24 scenarios suite post-032"
  - "post-fix substrate validation"
  - "kimi-k2.6 24-- scenario run"
  - "post-022 scenario re-run"
importance_tier: "important"
status: "blocked"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/002-rerun-24-scenarios-suite"
    last_updated_at: "2026-05-14T11:55:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Preflight blocked before 15-scenario suite execution"
    next_safe_action: "Repair Memory MCP startup and provider connectivity, then rerun the generated script"
    blockers:
      - "Spec Kit Memory MCP launcher fails with missing zod-to-json-schema"
      - "opencode-go/kimi-k2.6 provider route fails from sandbox"
    key_files:
      - "_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.md"
      - "_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000322"
      session_id: "002-rerun-24-scenarios-suite"
      parent_session_id: null
    completion_pct: 30
    open_questions:
      - "Where should the missing zod-to-json-schema runtime dependency repair live?"
    answered_questions:
      - "This packet is blocked: 0 PASS / 0 PARTIAL / 0 FAIL / 15 SKIP."
---
# Feature Specification: Re-run 24-- scenarios suite

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `002-rerun-24-scenarios-suite` |
| **Parent** | `032-substrate-repair-followups` |
| **Status** | Blocked |
| **Level** | 2 |
| **Executor** | cli-codex with external `cli-opencode` dispatch |
| **Evidence** | `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The post-fix memory substrate needs a real validation signal from the 15 scenario playbook in `manual_testing_playbook/24--local-llm-query-intelligence/`. Earlier runs were dominated by substrate-level save failures rather than meaningful query-quality results, so this packet exists to rerun the suite after governance and build fixes landed.

The purpose is to measure actual local-LLM memory behavior through OpenCode and `kimi-k2.6`, not to repair substrate bugs during the run.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Execute scenarios 401-415 sequentially via `opencode run --pure -m opencode-go/kimi-k2.6 --variant high`.
- Confirm preflight `memory_health` and a sample inline `memory_save` / `memory_delete` round-trip before running scenarios.
- Capture per-scenario logs under `_sandbox/24--local-llm-query-intelligence/evidence/per-scenario-logs-post-032/`.
- Write the final report at `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.md`.
- Maintain packet Level-2 docs and `graph-metadata.json` status.

### Out of Scope

- Modifying the 24-- scenario Markdown files.
- Fixing substrate code, installing dependencies, changing env flags, or restarting daemons.
- Re-running failed scenarios with different prompts.
- Treating preflight failure as a scenario-quality result.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: The runner must not start the scenario suite unless Memory MCP health is acceptable.
- **REQ-002**: The preflight must prove inline `memory_save` works by saving and deleting a substantive temporary spec file.
- **REQ-003**: Each scenario prompt must instruct the executor to read the matching playbook file and use real MCP tools.
- **REQ-004**: Save-heavy scenarios 401 and 411-415 must not pass `retentionPolicy:"ephemeral"`.
- **REQ-005**: The final report must include substrate state, per-scenario detail, verdict counts, and an overall finding.
- **REQ-006**: Packet metadata must be `complete`, `partial`, or `blocked` according to the acceptance thresholds.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **Given** a healthy Memory MCP provider, **When** the runner starts, **Then** it records `memory_health` and completes the preflight save/delete round-trip.
- **Given** the preflight passes, **When** scenarios 401-415 run, **Then** every scenario emits exactly `VERDICT`, `KEY_METRIC`, and `DETAIL`.
- **Given** the suite completes, **When** results are aggregated, **Then** at least 8 of 15 are PASS or PARTIAL for packet completion.
- **Given** the suite is blocked before execution, **When** evidence is written, **Then** the packet is marked `blocked` and no successful substrate-quality claim is made.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Status | Impact |
|-------------------|--------|--------|
| Spec Kit Memory MCP startup | Blocked | No health, save, search, or delete tool calls are possible. |
| OpenCode Go provider connectivity | Blocked from sandbox | No `kimi-k2.6` scenario dispatch can complete. |
| Background failed embeddings | Known external issue | May affect health thresholds, but this run blocked earlier. |
| Scenario cleanup | Not exercised | No per-scenario sandboxes were created in this attempt. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the missing `zod-to-json-schema` dependency be repaired inside sibling packet 003, or should a new follow-up packet own that runtime dependency issue?
- Should the actual 15-scenario suite be rerun from a less-restricted environment where `opencode-go/kimi-k2.6` can reach the provider endpoint?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- The runner output must be deterministic enough to compare counts across runs.
- Evidence must distinguish preflight/runtime failure from scenario verdicts.
- Logs must be retained under the requested evidence path and not mixed with scenario source files.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **Given** Memory MCP startup fails, **When** the suite is requested, **Then** the runner must not proceed to scenario execution.
- **Given** OpenCode provider calls fail, **When** evidence is written, **Then** the failure must be reported as a runner/runtime blocker.
- **Given** the preflight sandbox is never created, **When** cleanup runs, **Then** the report should state that no cleanup artifact existed.
- **Given** prior baseline evidence is unavailable in the workspace, **When** comparison is required, **Then** use the orchestrator-provided baseline counts and label that source.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

This is operationally moderate rather than code-complex. The risk comes from cross-runtime dependencies: OpenCode provider auth/connectivity, MCP startup, Memory DB health, and scenario cleanup. Because the current execution failed at preflight, the packet remains blocked pending runtime repair.
<!-- /ANCHOR:complexity -->
