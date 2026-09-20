---
title: "Feature Specification: Phase 4 — Plugin tie-in scenarios"
description: "Execute the 3 plugin tie-in scenarios (OBS-011 beancount, OBS-012 tables, OBS-013 brat) at the file layer in the test vault and record pass/fail. Executor: deepseek-v4-flash via cli-opencode."
trigger_phrases:
  - "plugin tie-in scenarios"
  - "beancount tables brat test"
  - "obsidian plugin file layer"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/010-playbook-validation/004-plugin-tie-in-scenarios"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Run OBS-011/012/013 file-layer plugin scenarios via cli-opencode"
    next_safe_action: "Record results in this phase's implementation-summary"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/010-playbook-validation-004-plugin-tie-in-scenarios"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4 — Plugin tie-in scenarios

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-plugin-tie-in-scenarios |
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

The community-plugin file-layer operations (beancount ledger, .table.md, BRAT data.json) are unverified against the real vault where those plugins are installed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 4. SCOPE

In scope: OBS-011 beancount-transaction, OBS-012 obsidian-tables-roundtrip, OBS-013 brat-headless-install, run at the file layer by deepseek over cli-opencode. Out of scope: in-app rendering verification.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

- Each scenario's file-layer edit is applied and validated against the plugin's documented schema.\n- Every scenario recorded PASS or FAIL with evidence.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- 3/3 plugin tie-in scenarios executed and recorded.
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
