---
title: "Feature Specification: Phase 2 — Headless notesmd-cli scenarios"
description: "Execute the 8 headless notesmd-cli manual-testing-playbook scenarios against the test vault and record pass/fail. Executor: deepseek-v4-flash via cli-pi."
trigger_phrases:
  - "headless notesmd-cli scenarios"
  - "notesmd-cli playbook run"
  - "obsidian headless test"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/010-playbook-validation/002-headless-cli-scenarios"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Run the 8 headless-notes and headless-vaults scenarios via cli-pi"
    next_safe_action: "Record results in this phase's implementation-summary"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/010-playbook-validation-002-headless-cli-scenarios"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2 — Headless notesmd-cli scenarios

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-headless-cli-scenarios |
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

The headless notesmd-cli surface (create/read/search/daily/move/delete/frontmatter/vaults) is unverified against a live vault.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 4. SCOPE

In scope: the 6 headless-notes scenarios + 2 headless-vaults scenarios, run by deepseek via cli-pi. Out of scope: MCP, official CLI, plugins.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

- Each scenario's exact command sequence runs and its expected signals are checked.\n- Every scenario is recorded PASS or FAIL with evidence.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- 8/8 headless scenarios executed and recorded (a documented FAIL is an acceptable recorded outcome).
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
