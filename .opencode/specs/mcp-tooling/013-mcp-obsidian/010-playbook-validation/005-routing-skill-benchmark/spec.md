---
title: "Feature Specification: Phase 5 — Routing skill benchmark"
description: "Run the mcp-tooling skill/routing benchmark (Mode A router-replay) validating seven-mode routing, and record the official-CLI scenarios as blocked-pending-Register-CLI."
trigger_phrases:
  - "routing skill benchmark"
  - "mcp-tooling hub routing test"
  - "seven mode routing replay"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/010-playbook-validation/005-routing-skill-benchmark"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Run the router-replay skill benchmark for the 7-mode hub"
    next_safe_action: "Compare the aggregate + route-gold against the frozen baseline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/010-playbook-validation-005-routing-skill-benchmark"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5 — Routing skill benchmark

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-routing-skill-benchmark |
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

The hub routing was reconciled from six to seven modes (mcp-obsidian added); the routing benchmark has not been re-run post-expansion.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 4. SCOPE

In scope: run-skill-benchmark.cjs Mode A router-replay for mcp-tooling into a new run-label; optional Mode B live via cli-opencode. Also document the 2 official-CLI scenarios as blocked. Out of scope: live vault scenarios.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

- The router-replay benchmark runs and produces a report pair under benchmark/reports/.\n- Route-gold conformance is recorded against the seven-mode set.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- Benchmark executed with route-gold scored; official-CLI scenarios documented as blocked.
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
