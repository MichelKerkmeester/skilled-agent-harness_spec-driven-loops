---
title: "Feature Specification: Phase 1 — Test-environment provisioning"
description: "Provision the live test env for the playbook run: install notesmd-cli, register the Obsidian test vault, install + activate the Local REST API plugin (MCP), and configure .env; verify every surface is reachable."
trigger_phrases:
  - "playbook provisioning"
  - "obsidian test env setup"
  - "local rest api install"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/010-playbook-validation/001-provisioning"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Provision the playbook test environment"
    next_safe_action: "Hand the reachable surfaces to phases 2-5"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/010-playbook-validation-001-provisioning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1 — Test-environment provisioning

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-provisioning |
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

The playbook scenarios need a live vault, headless CLI, and a running Local REST API before any can execute.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 4. SCOPE

In scope: notesmd-cli install + default vault, Local REST API file-layer install + key seed, .env config, reachability probes. Out of scope: running the scenarios themselves.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

- notesmd-cli installed and default vault set.\n- Local REST API reachable and authenticating on 127.0.0.1:27124.\n- .env carries the obsidian_ vars (gitignored).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- Each surface (headless CLI, MCP REST) answers a smoke probe; official CLI recorded as blocked-pending-Register-CLI.
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
