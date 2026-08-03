---
title: "Feature Specification: Phase 3 — MCP round-trip scenarios"
description: "Execute the 6 MCP manual-testing-playbook scenarios (round-trip + verification) against the live Local REST API and record pass/fail. Executor: deepseek-v4-flash via cli-opencode."
trigger_phrases:
  - "mcp roundtrip scenarios"
  - "obsidian mcp playbook run"
  - "local rest api test"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/010-playbook-validation/003-mcp-scenarios"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Run the 6 mcp-roundtrip and mcp-verification scenarios via cli-opencode"
    next_safe_action: "Record results in this phase's implementation-summary"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/010-playbook-validation-003-mcp-scenarios"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3 — MCP round-trip scenarios

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-mcp-scenarios |
| **Parent** | 010-playbook-validation |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## 2. PHASE CONTEXT

This phase is part of the mcp-obsidian playbook validation run: executing every manual-testing-playbook scenario against a live throwaway Obsidian vault plus the mcp-tooling routing benchmark.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 3. PROBLEM

The MCP surface (structured read/write, tags, search, tool inventory) is unverified against the live Local REST API.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 4. SCOPE

In scope: 4 mcp-roundtrip + 2 mcp-verification scenarios via deepseek over cli-opencode, using the REST API on 127.0.0.1:27124. Out of scope: headless CLI, plugins.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

- Each scenario runs against the live REST API and its expected signals are checked.\n- Every scenario recorded PASS or FAIL with evidence.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- 6/6 MCP scenarios executed and recorded.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS

- Live-environment flakiness (vault sync, app focus) can cause transient scenario failures; re-run before recording a fail.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
